// ==UserScript==
// @name         Youtube Subscription Search
// @namespace    http://tampermonkey.net/
// @version      2024-09-16
// @description  Adds the ability to search though subscribed channels
// @author       Chillfam
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492011/Youtube%20Subscription%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/492011/Youtube%20Subscription%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showAllSubscriptions(allSubscriptions, showLess) {
        for (let i = 0; i < allSubscriptions.length; i++) {
            allSubscriptions[i].parentNode.hidden = false;
            //showLess.click();
        }
    }

    function hideAllSubscriptions(allSubscriptions) {
        for (let i = 0; i < allSubscriptions.length; i++) {
            allSubscriptions[i].parentNode.hidden = true;
        }
    }

    let observer = new MutationObserver(function() {
        const showMore = document.querySelector("ytd-guide-collapsible-entry-renderer.style-scope:nth-child(8) > ytd-guide-entry-renderer:nth-child(1) > a:nth-child(1) > tp-yt-paper-item:nth-child(1)");
        showMore.click();
        const allSubscriptions = document.querySelectorAll('a#endpoint.yt-simple-endpoint.style-scope.ytd-guide-entry-renderer[href^="/@"]');
        const showLess = document.querySelector("ytd-guide-collapsible-entry-renderer.style-scope:nth-child(8) > div:nth-child(2) > ytd-guide-entry-renderer:nth-child(2) > a:nth-child(1) > tp-yt-paper-item:nth-child(1)");
        //showLess.click();
        const subscriptionsTitleElement = document.querySelector("ytd-guide-section-renderer.style-scope:nth-child(2) > h3:nth-child(1)");
        const backgroundElement = document.getElementById("background");
        observer.disconnect();
        const darkBackgroundColor = "rgb(15, 15, 15)";

        let searchDiv = document.createElement('div');
        searchDiv.style.marginLeft = '0px';
        searchDiv.style.paddingLeft = '8px';
        searchDiv.style.paddingRight = '8px';
        searchDiv.style.height = '25px';
        searchDiv.style.border = '1px solid rgb(51, 51, 51)';
        searchDiv.style.borderRadius = '50px';

        let searchElement = document.createElement('input');
        searchElement.setAttribute('placeholder', '\uD83D\uDD0D');
        searchElement.style.border = '0px';
        searchElement.style.paddingRight = '10px';
        searchElement.style.paddingLeft = '4px';
        searchElement.style.paddingTop = '4px';
        searchElement.style.width = '160px';
        searchElement.style.outline = 'none';
        searchElement.style.backgroundColor = 'transparent';
        searchElement.style.display = 'inline-block';

        let buttonElement = document.createElement('button');
        buttonElement.style.border = '1px';
        buttonElement.style.marginLeft = '4px';
        buttonElement.style.backgroundColor = 'transparent';
        buttonElement.textContent = 'X';
        buttonElement.style.display = 'inline-block';
        buttonElement.style.borderRadius = '50px';
        buttonElement.style.marginTop = '3px';
        buttonElement.hidden = true;

        if (window.getComputedStyle(backgroundElement).background == darkBackgroundColor) {
            searchElement.style.color = 'white';
            searchElement.style.caretColor = 'white';
            buttonElement.style.color = 'white';
        }
        else {
            searchElement.style.color = 'black';
            searchElement.style.caretColor = 'black';
            buttonElement.style.color = 'black';
        }

        searchDiv.appendChild(searchElement);
        searchDiv.appendChild(buttonElement);
        subscriptionsTitleElement.insertAdjacentElement('afterend', searchDiv);



        searchElement.addEventListener('input', function(event) {
            if (event.target.value != '') {
                //showMore.click();
                hideAllSubscriptions(allSubscriptions, showLess)
                for (let i = 0; i < allSubscriptions.length; i++) {
                    if (allSubscriptions[i].title.toLowerCase().startsWith(event.target.value.toLowerCase())) {
                        allSubscriptions[i].parentNode.hidden = false;
                    }
                }
                buttonElement.hidden = false;
            }
            else {
                showAllSubscriptions(allSubscriptions, showLess);
                buttonElement.hidden = true;
            }
        });

        searchElement.addEventListener('focus', function() {
            searchDiv.style.borderColor = 'rgb(28, 98, 185)';
        });

        searchElement.addEventListener('blur', function() {
            searchDiv.style.borderColor = 'hsla(0,0%,26%,1)';
        });

        buttonElement.addEventListener('click', function() {
            searchElement.value = '';
            buttonElement.hidden = true;
            showAllSubscriptions(allSubscriptions, showLess);
        });

        buttonElement.addEventListener('mouseover', function() {
            if (window.getComputedStyle(backgroundElement).background == darkBackgroundColor) {
                buttonElement.style.backgroundColor = 'rgb(51, 51, 51)';
            }
            else {
                buttonElement.style.backgroundColor = 'rgb(204,204,204)';
            }
        });

        buttonElement.addEventListener('mouseout', function() {
            buttonElement.style.backgroundColor = 'transparent';
        });

    });

    observer.observe(document, { childList: true, subtree: true });
})();