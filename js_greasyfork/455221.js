// ==UserScript==
// @name         THBWiki备用站快捷功能
// @namespace    https://thdog.moe/
// @version      0.1
// @description  页面右上角添加复制短链按钮和转到主站按钮
// @author       shirokurakana
// @match        https://cache.thwiki.cc/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455221/THBWiki%E5%A4%87%E7%94%A8%E7%AB%99%E5%BF%AB%E6%8D%B7%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/455221/THBWiki%E5%A4%87%E7%94%A8%E7%AB%99%E5%BF%AB%E6%8D%B7%E5%8A%9F%E8%83%BD.meta.js
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
            button = "<button id=\"cpy-btn\">复制短链</button>";
        } else {
            button = "<button id=\"cpy-btn\">复制短链</button><br /><button id=\"jmp-btn\">转到主站</button>";
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
        const btn2 = document.querySelector('#jmp-btn');
        btn2.addEventListener('click',() => {
            const o_url = window.location.href.replace('cache.','');
            //window.open(o_url);
            document.location=o_url;
        })
    }
})();