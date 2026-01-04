// ==UserScript==
// @name         Old Reddit Auto Expand Images and Post Text, Images in comments
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  expands medias and post text on old Reddit feeds.
// @author       ein
// @match        *://old.reddit.com/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/525564/Old%20Reddit%20Auto%20Expand%20Images%20and%20Post%20Text%2C%20Images%20in%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/525564/Old%20Reddit%20Auto%20Expand%20Images%20and%20Post%20Text%2C%20Images%20in%20comments.meta.js
// ==/UserScript==

(function() {
    'use strict';
    [...document.querySelectorAll('a')].forEach((element) => {
        if(element.innerHTML == '&lt;image&gt;'){
            const my_img = document.createElement('img');
            my_img.src = element.href;
            my_img.style = 'width:100%';
            element.replaceWith(my_img);
        }
    });
    function expandContent() {
        const elementsToExpand = [
            '.selftext.collapsed',
            '.expando-button.collapsed.video',
            '.expando-button.collapsed.image',
            '.expando-button.crosspost.collapsed'
        ];
        const firstCollapsed = document.querySelector(elementsToExpand.join(','));
        if (firstCollapsed) {
            if (firstCollapsed.classList.contains('selftext')) {
                firstCollapsed.click();
            } else {
                firstCollapsed.click();
            }
        }
    }

    let iterationCount = 0;

    function limitedExpandContent() {
        if (iterationCount < 25) {
            expandContent();
            iterationCount++;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setInterval(limitedExpandContent, 1000);
        });
    } else {
        setInterval(limitedExpandContent, 1000);
    }
})();