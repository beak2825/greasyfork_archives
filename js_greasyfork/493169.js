// ==UserScript==
// @name         Fix rockstar games jobs page
// @namespace    https://gta5bmx.me/
// @version      1.0.2845.9
// @description  A browser script to fix rockstar's job page, code by chatGPT
// @author       taoletsgo/chatGPT
// @match        https://socialclub.rockstargames.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493169/Fix%20rockstar%20games%20jobs%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/493169/Fix%20rockstar%20games%20jobs%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Code by chatGPT 4.0
    setTimeout(() => {
        setInterval(() => {
            const url = window.location.href;
            if (url.startsWith('https://socialclub.rockstargames.com/jobs') ||
                (/^https:\/\/socialclub\.rockstargames\.com\/member\/[^\/]+\/jobs/.test(url))) {

                let rockstar;
                try {
                    rockstar = document.querySelector('[class^="Search__container"]');
                } catch (error) {
                    console.error("Error in querying the element: ");
                    return;
                }

                let should;
                try {
                    should = Object.keys(rockstar).find(k => k.startsWith('__reactProps'));
                } catch (error) {
                    console.error("Error in finding the key: ", error);
                    return;
                }

                let fix;
                try {
                    fix = rockstar[should].children;
                } catch (error) {
                    console.error("Error in getting children: ", error);
                    return;
                }

                let bmx;
                try {
                    bmx = (Array.isArray(fix) ? fix[0] : fix)._owner.stateNode;
                } catch (error) {
                    console.error("Error in getting stateNode: ", error);
                    return;
                }

                bmx.props.hasMore = true;
                bmx.forceUpdate();
            }
        }, 500);
    }, 1000); // delay 1 seconds before running the script
})();