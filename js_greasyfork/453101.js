// ==UserScript==
// @name         Colamanga/MangaDig-方向鍵快速切換上下一話
// @name:zh-TW   Colamanga/MangaDig-方向鍵快速切換上下一話
// @name:zh-CN   Colamanga/MangaDig-方向键快速切换上下一话
// @name:en      Colamanga/MangaDig - Arrow Key Next/Prev Chapter
// @namespace    9nice
// @version      0.3.0
// @description        按下[→]鍵 下一話，按下[←]鍵 上一話
// @description:zh-TW  按下[→]鍵 下一話，按下[←]鍵 上一話
// @description:zh-CN  按下[→]键 下一话，按下[←]键 上一话
// @description:en     next / previous chapter on right / left arrow keys
// @author       9nice
// @match        *://www.colamanga.com/*
// @match        *://www.cocomanga.com/*
// @match        *://www.colamanhua.com/*
// @match        *://mangadig.com/*
// @grant        none
// @supportURL   none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453101/ColamangaMangaDig-%E6%96%B9%E5%90%91%E9%8D%B5%E5%BF%AB%E9%80%9F%E5%88%87%E6%8F%9B%E4%B8%8A%E4%B8%8B%E4%B8%80%E8%A9%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/453101/ColamangaMangaDig-%E6%96%B9%E5%90%91%E9%8D%B5%E5%BF%AB%E9%80%9F%E5%88%87%E6%8F%9B%E4%B8%8A%E4%B8%8B%E4%B8%80%E8%A9%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function(e){
        e = e || window.event;
        //right→:39 left←:37
        if (e.keyCode == '39') {
            e.preventDefault();
            document.querySelectorAll('.mh_headpager .read_page_link.mh_btn.mh_prevbook')[1].click();
//            document.querySelectorAll('.mh_readend  ul  li:nth-of-type(3)  .read_page_link  strong')[0].click();
        }
        else if (e.keyCode == '37') {
            e.preventDefault();
            document.querySelectorAll('.mh_headpager .read_page_link.mh_btn.mh_prevbook')[0].click();
//            document.querySelectorAll('.mh_readend  ul  li:nth-of-type(1)  .read_page_link  strong')[0].click();
        }

    };
})();