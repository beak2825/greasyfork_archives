// ==UserScript==
// @name         studi.fr add a link for full tab
// @namespace    http://tampermonkey.net/
// @description  add a button for open in full browser tab not windows ;-)
// @author       michael@cadot.info
// @match        https://app.studi.fr/*
// @version      0.3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418850/studifr%20add%20a%20link%20for%20full%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/418850/studifr%20add%20a%20link%20for%20full%20tab.meta.js
// ==/UserScript==



var checkExist = setInterval(function() {
    var $ = window.jQuery;
    if ($('#courseframecontent').length) {
        if(!document.querySelector("#fulltab"))
        {
            var a = document.createElement('a');
            var linkText = document.createElement('span');
            linkText.classList.add('fa');
            linkText.classList.add('fa-arrows-alt');
            a.appendChild(linkText);
            a.title = "full tab";
            a.style.bottom = "0";
            a.classList.add('toggler-button');
            a.href = $('iframe').attr('src');
            a.id="fulltab"
            document.querySelector("#toggler-meta").after(a);
        }
        clearInterval(checkExist);
    }
}, 100); // check every 100ms
