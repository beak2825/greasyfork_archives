// ==UserScript==
// @name         CGTN不暂停
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  切换标签页及最小化，CGTN不暂停
// @author       openAI
// @match        https://www.cgtn.com/*
// @match        https://news.cgtn.com/*
// @icon         https://ui.cgtn.com/static/ng/resource/images/logo_title.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/430490/CGTN%E4%B8%8D%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/430490/CGTN%E4%B8%8D%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(()=>{
        window.addEventListener("visibilitychange", function (event) {
            event.stopPropagation();
        }, true);
    })
})();

//致谢：
//Chris Middleton的回答 ↓
//https://stackoverflow.com/questions/19469881/remove-all-event-listeners-of-specific-type/46986927?r=SearchResults&s=1%7C5.7194#46986927
//https://www.itranslater.com/qa/details/2325770065544741888