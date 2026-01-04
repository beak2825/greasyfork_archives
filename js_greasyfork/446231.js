// ==UserScript==
// @name         inoreader mark read when press [n]
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  当按下 n 定位到下一条时，将它设为已读
// @author       wanglongbiao
// @match        https://www.inoreader.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inoreader.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/446231/inoreader%20mark%20read%20when%20press%20%5Bn%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/446231/inoreader%20mark%20read%20when%20press%20%5Bn%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('keydown', function(event){
        switch(event.code){
            case 'KeyN':
                // console.log(event.keyCode)
                let current = document.querySelector('div.article_current')
                if(current.classList.contains('article_unreaded')){
                    mark_read(current.getAttribute('data-aid'))    
                }
                break
        }
    })
})();