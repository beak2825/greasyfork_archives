// ==UserScript==
// @name         HideReviewRank
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Boardgamememoの評価を一時的に隠すスクリプト。評価のエリアをマウスオーバーしている間だけ評価の数値が表示されます
// @author       s9732
// @match        https://boardgamememo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamememo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455801/HideReviewRank.user.js
// @updateURL https://update.greasyfork.org/scripts/455801/HideReviewRank.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let strP = document.getElementsByTagName("p");
    if(strP){
        for( let pite=0; pite<strP.length; pite++ ) {
            let strMatch = strP[pite].textContent.match(/評価：\d+\/10/);
            if( strMatch ) {
                strP[pite].textContent = strP[pite].textContent.replace( /評価：(\d+)\/10/, '評価：-/10' );
                strP[pite].onmouseenter = function(ev){ ev.target.textContent = strMatch[0];};
                strP[pite].onmouseleave = function(ev){ ev.target.textContent = '評価：-/10';};
                strP[pite].style.backgroundColor = "#F6F6F6";
            }
        }
    }
})();