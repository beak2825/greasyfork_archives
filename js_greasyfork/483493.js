// ==UserScript==
// @name         Bilibili 评论申诉
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bilibili 快捷查询评论是否被隐藏 / 自动填充评论申诉表单
// @author       MnFeN
// @match       *.bilibili.com/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/483493/Bilibili%20%E8%AF%84%E8%AE%BA%E7%94%B3%E8%AF%89.user.js
// @updateURL https://update.greasyfork.org/scripts/483493/Bilibili%20%E8%AF%84%E8%AE%BA%E7%94%B3%E8%AF%89.meta.js
// ==/UserScript==

//  默认申诉原因填写在这里的引号内 ↓
var reason = "请点击浏览器上方篡改猴图标，找到此脚本，点击编辑，在代码第一行设置默认申诉原因";


var currentPageLink = "";

(function()
{
    'use strict';

    // 在申诉页面自动填充申诉理由
    function fillTextarea()
    {
        var txtReason = document.querySelector('textarea[placeholder="请填写申诉理由 （10～100字）"]');
        if (txtReason)
        {
            txtReason.value = reason;
            txtReason.dispatchEvent(new Event('input'));
        }
    }

    // 监听 BV 输入框
    function addInputListener()
    {
        var txtBV = document.querySelector('input.bili-input__inner[placeholder="请输入稿件bv号或位置链接"]');
        if (txtBV)
        {
            // 如果存储过链接则填入 BV
            var storedBV = localStorage.getItem('currentBV');
            if (storedBV)
            {
                txtBV.value = storedBV;
                localStorage.removeItem('currentBV');
                txtBV.dispatchEvent(new Event('input'));
            }

            txtBV.addEventListener('input', function()
            {
                txtBV.value = ExtractBVFrom(txtBV.value);
            });
        }
    }

    function ExtractBVFrom(url)
    {
        var regex = /bilibili\.com\/[^\/]+\/(?<bv>BV[^\/]+)\//;
        var match = url.match(regex);
        if (match && match.groups.bv)
        {
            return match.groups.bv;
        }
        else return url;
    }

    // 在视频页面添加 [申诉] 超链接
    function addAppealLink()
    {
        var checkExist = setInterval(function()
        {
            var xpath = "//span[contains(text(), '评论') and contains(@class, 'nav-title-text')]";
            var navTitleText = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (navTitleText)
            {
                //console.log("找到了评论区");
                clearInterval(checkExist); // 终止轮询

                var appealLink = document.createElement('span');
                appealLink.className = "total-reply";
                appealLink.textContent = '[申诉]';
                appealLink.style.color = '#00AEEC';
                appealLink.style.marginLeft = '10px';
                appealLink.style.marginRight = '10px';
                appealLink.style.cursor = 'pointer';

                var dataAttribute = navTitleText.getAttributeNames().find(name => name.startsWith('data-'));
                if (dataAttribute)
                {
                    appealLink.setAttribute(dataAttribute, navTitleText.getAttribute(dataAttribute));
                }

                appealLink.addEventListener('click', function()
                {
                    localStorage.setItem('currentBV', ExtractBVFrom(window.location.href)); // 存储当前页面地址
                    //console.log(localStorage.getItem('bilibiliPageLink'));
                    window.open('https://www.bilibili.com/blackboard/cmmnty-appeal.html', '_blank'); // 在新页面打开链接
                });

                navTitleText.parentNode.insertBefore(appealLink, navTitleText.nextSibling);
            }
        }, 500);
    }

    window.addEventListener('load', function()
    {
        fillTextarea();
        addInputListener();
        addAppealLink();
    });
})();