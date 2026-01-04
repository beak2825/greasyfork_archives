// ==UserScript==
// @name         肉漫屋-方向鍵快速切換上下一話
// @name:zh-TW   肉漫屋-方向鍵快速切換上下一話
// @name:zh-CN   肉漫屋-方向键快速切换上下一话
// @name:en      Rouman5 - Arrow Key Next/Prev Chapter
// @namespace    9nice
// @version      0.1.0
// @description        按下[→]鍵 下一話，按下[←]鍵 上一話，[ESC] 回到漫畫目錄
// @description:zh-TW  按下[→]鍵 下一話，按下[←]鍵 上一話，[ESC] 回到漫畫目錄
// @description:zh-CN  按下[→]键 下一话，按下[←]键 上一话，[ESC] 回到漫畫目錄
// @description:en     next / previous chapter on right / left arrow keys , ESC return album
// @author       9nice
// @match        *://rouman5.com/books/*
// @match        *://rouman5.*/books/*
// @grant        none
// @noframes
// @supportURL   none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541131/%E8%82%89%E6%BC%AB%E5%B1%8B-%E6%96%B9%E5%90%91%E9%8D%B5%E5%BF%AB%E9%80%9F%E5%88%87%E6%8F%9B%E4%B8%8A%E4%B8%8B%E4%B8%80%E8%A9%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/541131/%E8%82%89%E6%BC%AB%E5%B1%8B-%E6%96%B9%E5%90%91%E9%8D%B5%E5%BF%AB%E9%80%9F%E5%88%87%E6%8F%9B%E4%B8%8A%E4%B8%8B%E4%B8%80%E8%A9%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function(e){
        e = e || window.event;
        //right→:39 left←:37 Esc:27
        if (e.keyCode == '39') {
            e.preventDefault();
            document.querySelectorAll('.justify-between.flex > [href]')[2].click();
        }
        else if (e.keyCode == '37') {
            e.preventDefault();
            document.querySelectorAll('.justify-between.flex > [href]')[0].click();
        }
        else if (e.keyCode == '27') {
            e.preventDefault();
            document.querySelectorAll('.justify-between.flex > [href]')[1].click();
        }
    };
})();