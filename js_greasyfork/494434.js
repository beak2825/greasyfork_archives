// ==UserScript==
// @name         TornForumNoFormat
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Remove format from forum posts
// @author       Resh
// @match        https://www.torn.com/forums.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/494434/TornForumNoFormat.user.js
// @updateURL https://update.greasyfork.org/scripts/494434/TornForumNoFormat.meta.js
// ==/UserScript==


// change these to true or false depending on what you want removed
const REMOVE_COLOR = true;
const REMOVE_BACKGROUND_COLOR = true;
const REMOVE_SIZE = false;
const REMOVE_EMOJI = false;

(function() {
    'use strict';

    setInterval(function(){
        if(REMOVE_COLOR){
            $("div.quote  span, div.post span, div.quote  li, div.post li").css("color", "");
        }
        if(REMOVE_BACKGROUND_COLOR){
            $("div.quote  span, div.post span, div.quote  li, div.post li").css("background-color", "");
        }
        if(REMOVE_SIZE){
            $("div.quote  span, div.post span, div.quote  li, div.post li").css("font-size", "");
        }
        if(REMOVE_EMOJI) {
            $("div.quote p, div.post p").each(function(){
                let p_content = $(this).text();
                if(/\p{Extended_Pictographic}/u.test(p_content)) {
                    $(this).text(p_content.replace(/\p{Extended_Pictographic}/ug, ''));
                }
            })
        }
    }, 500);
})();