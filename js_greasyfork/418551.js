// ==UserScript==
// @name         浏览器工具—自动聚焦
// @name:zh	 浏览器工具—自动聚焦
// @version      1.2.4
// @namespace    http://tampermonkey.net/
// @description  自动聚焦，鼠标移到input、textarea元素、或鼠标在任何位置按快捷键Alt+H，输入框自动聚焦，光标在文字最后，鼠标移出失焦
// @author       lyscop
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/418551/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B7%A5%E5%85%B7%E2%80%94%E8%87%AA%E5%8A%A8%E8%81%9A%E7%84%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/418551/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B7%A5%E5%85%B7%E2%80%94%E8%87%AA%E5%8A%A8%E8%81%9A%E7%84%A6.meta.js
// ==/UserScript==

(function () {
    'use strict'

    //鼠标移入移出文本框聚焦失焦
    document.addEventListener('mouseover', function (e) {

        //鼠标经过元素
    if (e.target.selectionStart === e.target.selectionEnd &&
            (e.target.type !== 'checkbox' && e.target.type !== 'submit') &&
            ((e.target.localName ==='input' || e.target.localName ==='textarea')||
             (document.activeElement.tagName.toLowerCase() === 'input' || document.activeElement.tagName === 'TEXTAREA')))
            {
            //e.target.focus();
            if(e.target.value){
                //e.target.selectionStart = e.target.value.length;
                //e.target.selectionEnd = e.target.value.length;
            }
        }
    });
    document.addEventListener('mouseout', function (e) {
//        var timer = setTimeout(function () {
//            e.target.blur();
//        }, 20)

        if (e.target.selectionStart !== e.target.selectionEnd || e.target.localName ==='select' || e.target.localName ==='a' ||
            e.target.name === 'username' || e.target.name === 'userName')
        {
//                clearTimeout(timer);
            }
    });

    document.addEventListener('keydown',function(event) {

        var keynum;
        if(window.event) // IE
        {
            keynum = event.keyCode;
        }
        else if(event.which) // Netscape/Firefox/Opera
        {
            keynum = event.which;
        }
        //ALT+H
        if(keynum==72&&event.altKey){
            let searchBar = document.querySelector("input[name=wd],input[type=text],input[autocomplete],input[type=search],textarea[spellcheck]");
            searchBar.focus();
            if(searchBar.value){
                searchBar.selectionStart = searchBar.value.length;
                searchBar.selectionEnd = searchBar.value.length;
                searchBar.click();
            }
        }
    });

        document.addEventListener('keydown',function(event) {

        var keynum;
        if(window.event) // IE
        {
            keynum = event.keyCode;
        }
        else if(event.which) // Netscape/Firefox/Opera
        {
            keynum = event.which;
        }
        //ALT+J
        if(keynum==74&&event.altKey){
            let searchBar = document.querySelector("input[name=wd],input[type=text],input[autocomplete],input[type=search],textarea[spellcheck]");
            searchBar.blur();
            if(searchBar.value){
                searchBar.selectionStart = searchBar.value.length;
                searchBar.selectionEnd = searchBar.value.length;
                searchBar.click();
            }
        }
    });
    
})();