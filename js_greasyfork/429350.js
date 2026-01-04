// ==UserScript==
// @name         获取某团cookie
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  用于获取某团cookie
// @author       syu
// @supportURL   https://greasyfork.org/zh-CN/scripts/429350/versions/new
// @match        https://waimaie.meituan.com/*
// @match        https://shangoue.meituan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429350/%E8%8E%B7%E5%8F%96%E6%9F%90%E5%9B%A2cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/429350/%E8%8E%B7%E5%8F%96%E6%9F%90%E5%9B%A2cookie.meta.js
// ==/UserScript==

;(function () {
        'use strict'
        console.log(document.cookie);
        console.log('cookie插入搜索框');
        //将cookie放到搜索文本框中
        document.getElementsByClassName('form-control J-search')[0].setAttribute('value', document.cookie);
        //将值拷贝到剪切板
        function copyText(text)
        {
            var input = document.createElement('input');

            input.setAttribute('id', 'input_for_copyText1');
            input.value = text;

            document.getElementsByTagName('body')[0].appendChild(input);
            document.getElementById('input_for_copyText1').select();
            document.execCommand('copy');
            document.getElementById('input_for_copyText1').remove();
        }
        //下载cookie到一个txt
        function fakeClick(obj) {
            var ev = document.createEvent("MouseEvents");
            ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            obj.dispatchEvent(ev);
        }

        function exportRaw(name, data) {
            var urlObject = window.URL || window.webkitURL || window;
            var export_blob = new Blob([data]);
            var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
            save_link.href = urlObject.createObjectURL(export_blob);
            save_link.download = name;
            fakeClick(save_link);
        }
    }
)()