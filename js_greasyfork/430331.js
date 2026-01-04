// ==UserScript==
// @name         9酷
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  9酷歌曲广告剔除
// @author       gwbc
// @match        https://www.9ku.com/*
// @icon         https://scpic.chinaz.net/Files/pic/icons128/8169/e12.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430331/9%E9%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/430331/9%E9%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    try{
        let youFix = document.querySelector('div.youFix');
        if(youFix != null)
        {
            youFix.remove();
        }

        let iframes = document.querySelectorAll('iframe');
        for (let i = 0; i < iframes.length; ++i) {
            iframes[i].remove();
        }

        let box = document.querySelector('.box');
        if(box != null)
        {
            let boxWidth = document.querySelector('.box').getBoundingClientRect().width;
            let boxHeight = document.querySelector('.nplayL-box').getBoundingClientRect().height
            document.querySelector('.pFl.clearfix').style.width = boxWidth + "px";
            document.querySelector('.nplayL-box').style.width = boxWidth / 2 + "px";
            document.querySelector('.ppR').style.width = boxWidth / 2 + "px";
            document.querySelector('.playingTit').style.width = boxWidth / 2 - 22 + "px";
            document.querySelector('.oldPlayer').style.margin = 0;
            document.querySelector('.lrcBox').style.width = boxWidth / 2 - 2 + "px";
            document.querySelector('.lrcBox').style.height = boxHeight - 111 + "px";
            document.querySelector('.oldPlayer').style.width = boxWidth / 2 - 22 + "px";
            document.querySelector('.ncol-btns').remove();
            document.querySelector('.dongBox.mb10').remove();
            document.querySelector('#p_top').remove();
            document.querySelector('.fotter').remove();
            document.querySelector('.ppBox').style.height = boxHeight - 2 + "px";
            document.querySelector('.ppBox').style.borderBottom = "1px solid #259b24";
            document.querySelector('.jp-progress').style.width = boxWidth / 2 - 20 + "px";
            document.querySelector('#lyric').style.height = boxHeight - 100 + "px";
        }

    }catch(e){
        //TODO handle the exception
    }

    var count = 0
    var t = setInterval(function() {
        count++;
        if (count > 2000) {
            clearInterval(t);
        }

        try {
            let iframes = document.querySelectorAll('iframe');
            for (let i = 0; i < iframes.length; ++i) {
                iframes[i].remove();
            }

            let sprris = document.querySelectorAll('#songlist li');
            for (let i = 0; i < sprris.length; ++i) {
                if (sprris[i].id.length != 0) {
                    sprris[i].remove();
                }
            }

            if(sprris.length != 0)
            {
                document.querySelector('.box.bgWrite.mb10.clearfix').remove();
                document.querySelector('.xxl.clearfix').remove();
                document.querySelector('.box.bgWrite.mb10').remove();
                document.querySelector('#fankui').remove();
                document.querySelector('#weixin').remove();
                document.querySelector('#gotop').remove();
            }

            let ls = document.querySelectorAll('.musicList li[style*="position:relative"]');
            for (let i = 0; i < ls.length; ++i)
            {
                ls[i].remove();
            }

        } catch (e) {

        }
    }, 1);
})();