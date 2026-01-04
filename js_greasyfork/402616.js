// ==UserScript==
// @name         THBWiki复制短链接
// @namespace    https://thdog.moe/
// @version      0.1
// @description  将原来的【短网址】链接替换成一个按钮，点击按钮可将短链接复制到剪切板
// @author       shirokurakana
// @match        https://thwiki.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402616/THBWiki%E5%A4%8D%E5%88%B6%E7%9F%AD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/402616/THBWiki%E5%A4%8D%E5%88%B6%E7%9F%AD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url_div = document.getElementById('mw-indicator-0');
    var url_a_tag = url_div.getElementsByTagName('a')[0];
    if (url_a_tag) {
        var url = url_a_tag.href;
        console.log(url);
        url_a_tag.parentNode.removeChild(url_a_tag);
        var button;
        if(document.title.match(/^用户/)){
            button = "<button id=\"cpy-btn\">点击复制短链接</button>";
        } else {
            button = "<button id=\"cpy-btn\" style=\"padding: 10px 10px\">点击复制短链接</button>";
        }
        url_div.innerHTML += button;
        var copy_button = url_div.getElementsByTagName('a')[0];
        const btn = document.querySelector('#cpy-btn');
        btn.addEventListener('click',() => {
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('value', url);
            input.select();
            if (document.execCommand('copy')) {
                console.log('复制成功');
            }
            document.body.removeChild(input);
            url_div.getElementsByTagName('button')[0].innerHTML="短链接复制成功";
        })
    }
})();