// ==UserScript==
// @name         MTOPS Unlocked
// @namespace    https://www.mtopscriterion.com
// @version      1.2
// @license      gpl-3.0
// @description  Removes all paywalls on mtopscriterion.com, allowing the user to learn the MTOPS course content and use the trading system entirely for free
// @author       Luculent
// @match        https://www.mtopscriterion.com/*
// @exclude      https://www.mtopscriterion.com/login
// @icon         https://www.mtopscriterion.com/images/members/header-logo-small.png
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/445766/MTOPS%20Unlocked.user.js
// @updateURL https://update.greasyfork.org/scripts/445766/MTOPS%20Unlocked.meta.js
// ==/UserScript==
// Yes, I know, unsafeWindow is evil but I ain't gonna try to fix this shit, it works.

(function() {
    'use strict';
    'esversion: 6';

    // Keep the original fetch instead of our override
    let original_fetch = unsafeWindow.fetch;

    // Override fetch
    unsafeWindow.fetch = async (url, init) => {

        // Get the response and define some storage variables
        let response = await original_fetch(url, init)
        let respo = response.clone();
        let newResStr;
        let newRes;
        if (url.includes("auth/session")) {
            // Enable the trading system for free by changing account types
            newResStr = await respo.json().then((info) => {
                // console.log(info)
                info["accountType"] = 3  // 0 = trial, 1 = free, 2 = student, 3 = unlimited
                info["access"] = 1  // I don't actually know what this does, I just set it to make sure but you probably don't need it.
                return JSON.stringify(info)
            });
            newRes = new Response(newResStr, {status: response.status, statusText: response.statusText, headers: response.headers})
        }
        if (url.includes("api/graphql")) {
            // Completely open the course
            newResStr = await respo.json().then((info) => {
                for (let i = 0; i < info.data.allCourses.length; i++) {
                    info.data.allCourses[i]["completed"] = true;
                    info.data.allCourses[i]["locked"] = false;
                }

                return JSON.stringify(info);
            });

            // Send the modified graphql response to the client
            newRes = new Response(newResStr, {status: response.status, statusText: response.statusText, headers: response.headers})
        }

        // Check if anything has actually been modified, if not, just return the original response
        if (newRes == undefined) newRes = response;

    return newRes;
    };
})();