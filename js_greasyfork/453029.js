// ==UserScript==
// @name         禁漫天堂-方向鍵快速切換上下一話
// @name:zh-TW   禁漫天堂-方向鍵快速切換上下一話
// @name:zh-CN   禁漫天堂-方向键快速切换上下一话
// @name:en      18comic / JMcomic - Arrow Key Next/Prev Chapter
// @namespace    9nice
// @version      0.2.0
// @description        按下[→]鍵 下一話，按下[←]鍵 上一話，[ESC] 回到漫畫簡介
// @description:zh-TW  按下[→]鍵 下一話，按下[←]鍵 上一話，[ESC] 回到漫畫簡介
// @description:zh-CN  按下[→]键 下一话，按下[←]键 上一话，[ESC] 回到漫畫簡介
// @description:en     next / previous chapter on right / left arrow keys , ESC return album
// @author       9nice
// @match        *://18comic.vip/photo/*
// @match        *://18comic.org/photo/*
// @match        *://jmcomic.me/photo/*
// @match        *://jmcomic1.me/photo/*
// @match        *://18comic.*/photo/*
// @match        *://18comic*.*/photo/*
// @match        *://jmcomic.*/photo/*
// @match        *://jmcomic*.*/photo/*
// @match        *://jm-comic*.*/photo/*
// @grant        none
// @noframes
// @supportURL   none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453029/%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82-%E6%96%B9%E5%90%91%E9%8D%B5%E5%BF%AB%E9%80%9F%E5%88%87%E6%8F%9B%E4%B8%8A%E4%B8%8B%E4%B8%80%E8%A9%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/453029/%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82-%E6%96%B9%E5%90%91%E9%8D%B5%E5%BF%AB%E9%80%9F%E5%88%87%E6%8F%9B%E4%B8%8A%E4%B8%8B%E4%B8%80%E8%A9%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function(e){
        e = e || window.event;
        //right→:39 left←:37 Esc:27
        if (e.keyCode == '39') {
            e.preventDefault();
            document.querySelectorAll('.fa-angle-double-right.fa')[0].click();
        }
        else if (e.keyCode == '37') {
            e.preventDefault();
            document.querySelectorAll('.fa-angle-double-left.fa')[0].click();
        }
        else if (e.keyCode == '27') {
            e.preventDefault();
            document.querySelectorAll('.fa-list-alt.far')[0].click();
        }
    };
})();