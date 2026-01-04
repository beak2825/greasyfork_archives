// ==UserScript==
// @name         Asana Enhancer
// @namespace    https://app.asana.com
// @version      0.9.1
// @description  Enhance asana web interface
// @author       honsa
// @include        https://app.asana.com/*
// @include        http://app.asana.com/*
// @match          https://app.asana.com/*
// @match          http://app.asana.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374412/Asana%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/374412/Asana%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    initAsanaEnhancer();

    function initAsanaEnhancer() {
        console.log('%cInit asana enhancer', 'color: #77a7ba');

        taskListDetailsOnDblClick();
        hideTopBar();
        hideUpgradeBtn();
    }

    function taskListDetailsOnDblClick() { //open task list details on double click
        let taskListItems = document.querySelectorAll('.TaskList .SubtaskTaskRow-taskName');

        for(let i = 0; i < taskListItems.length; i++) {
            taskListItems[i].addEventListener('dblclick', openTaskDetails);
        }

        console.log('show tasklist details on double click is active');
    }

    function openTaskDetails(e) { //open task list details
        e.target.parentNode.parentNode.parentNode.querySelector('.SubtaskTaskRow-detailsButton').click();
    }

    function hideTopBar() {
        let topBar = document.getElementById('topbar');

        if(topBar && topBar.style.display !== 'none') {
            topBar.style.display = 'none';
            console.log('topbar hidden');
        }
    }

    function hideUpgradeBtn(){
        let upgradeBtn = document.querySelector('[class*="upgradeButton"]');

        if(upgradeBtn && upgradeBtn.style.display !== 'none'){
            upgradeBtn.style.display = 'none';
            console.log('upgrade button hidden');
        }
    }

    function getUrlParams(url) {
        let params = {};
        url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            params[key] = value;
        });

        return params;
    }

    function waitForElementToDisplay(selector, ms) {
        if(document.querySelector(selector)!=null) {
            hideUpgradeBtn();
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, ms);
            }, ms);
        }
    }

    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

            this.addEventListener("readystatechange", function() {

                if(this.readyState === 4) {
                    let urlParams = getUrlParams(this.responseURL);
                    if(!urlParams.idle) { //just re-initialise if not an idle request
                        initAsanaEnhancer();
                    }
                }
            }, false);

            open.call(this, method, url, async, user, pass);
        };

    })(XMLHttpRequest.prototype.open);

})();