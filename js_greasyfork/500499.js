// ==UserScript==
// @name         api platform 翻译文档 Debugging
// @namespace    fireloong
// @version      0.0.3
// @description  翻译文档 distribution/debugging
// @author       itsky71
// @match        https://api-platform.com/docs/distribution/debugging/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=api-platform.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500499/api%20platform%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20Debugging.user.js
// @updateURL https://update.greasyfork.org/scripts/500499/api%20platform%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20Debugging.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
    };

    let n = 0;
    $('.doc > h1,.doc > h2,.doc > p,.doc li').each(function(i,v){
        if(translates.hasOwnProperty($(this).text())) {
            $(this).html(translates[$(this).text()]);
        }else{
            console.log(n,v,$(this).text());
            n++;
        }
    });
})($);