// ==UserScript==
// @name         PostPrime - Expand Text Field
// @namespace    https://github.com/y-muen
// @version      0.1.3
// @description  Expand Text Field in PostPrime timeline
// @author       Yoiduki <y-muen>
// @include      *://postprime.com/*
// @exclude      *://postprime.com/*/post/*
// @icon         https://www.google.com/s2/favicons?domain=postprime.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443514/PostPrime%20-%20Expand%20Text%20Field.user.js
// @updateURL https://update.greasyfork.org/scripts/443514/PostPrime%20-%20Expand%20Text%20Field.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(".Post_text__cLvqu {-webkit-line-clamp:1000!important;}");

    const expandTextField_sub = (elem) => {
        if (!elem.classList.contains('expandTextField')){
            var innerHTML = elem.innerHTML.replaceAll(/\n\n+/g, "\n\n");
            if(innerHTML != elem.innerHTML) {
                elem.innerHTML = innerHTML;
            }
            elem.classList.add('expandTextField');
        }
    }

    const expandTextField = function() {
        var richcontent = document.getElementsByClassName('richcontent')
        richcontent = Array.from(richcontent);
        richcontent.forEach( elem => expandTextField_sub(elem));
    }

    expandTextField();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            expandTextField()
        });
    });

    const config = {
        attributes: false,
        childList: true,
        characterData: false,
        subtree:true
    };

    observer.observe(document, config);
})();