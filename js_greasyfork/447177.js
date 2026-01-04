// ==UserScript==
// @name         获取人民法院委托鉴定平台案件信息
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  获取人民法院委托鉴定平台案件信息@LYS!
// @author       LYS
// @match        http://dwwtjd.court.gov.cn/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447177/%E8%8E%B7%E5%8F%96%E4%BA%BA%E6%B0%91%E6%B3%95%E9%99%A2%E5%A7%94%E6%89%98%E9%89%B4%E5%AE%9A%E5%B9%B3%E5%8F%B0%E6%A1%88%E4%BB%B6%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/447177/%E8%8E%B7%E5%8F%96%E4%BA%BA%E6%B0%91%E6%B3%95%E9%99%A2%E5%A7%94%E6%89%98%E9%89%B4%E5%AE%9A%E5%B9%B3%E5%8F%B0%E6%A1%88%E4%BB%B6%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var ishook = setInterval(function () {
        if ($('tbody').eq(1).text() != " ") {
            window.result = $('thead').eq(2).find('tr').text().slice(3) + "\n"
            $('a[ng-click="selectPage(page + 1)"]').attr('onclick', 'gettable();')
            $('body').keydown(function (event) {
                if (event.keyCode == 39) {
                    $('a[ng-click="selectPage(page + 1)"]').eq(1).click()
                }
                if (event.keyCode == 37) {
                    copyToClipboard(window.result)
                    alert("案件信息已经存储至剪切板，请移步Excel处理！")
                }
            })
            alert("注入成功！")
            clearInterval(ishook)
        }
    }, 200)

    window.gettable = function () {

        $('tbody').eq(2).find('tr:contains("法医"),tr:contains("医疗")').each(function () {
            $(this).find('.ng-hide').remove();
            if (window.result.includes($(this).text())) {} else {
                window.result = window.result + $(this).text() + "\n"
            }
        })
    }

    window.copyToClipboard = function (s) {
        if (window.clipboardData) {
            window.clipboardData.setData('text', s);
        } else {
            (function (s) {
                document.oncopy = function (e) {
                    e.clipboardData.setData('text', s);
                    e.preventDefault();
                    document.oncopy = null;
                }
            })(s);
            document.execCommand('Copy');
        }
    }
})();