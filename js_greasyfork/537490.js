// ==UserScript==
// @name         replace ADF title
// @namespace    http://tampermonkey.net/
// @version      2024-04-24
// @description  replace title
// @author       You
// @match        https://adf.azure.com/*
// @match        https://*.azuredatabricks.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azure.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537490/replace%20ADF%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/537490/replace%20ADF%20title.meta.js
// ==/UserScript==
const replace_map = {
    "dtf-sgesss-dev-az1-cfpuv7hera2": "DEV ADF",
    "dtf-sgesss-dev-az1-m5rbvkhera2": "SIT ADF",
    "dtf-sgesss-uat-az1-kaoi9khera2": "UAT ADF",
    "sgesss-prd-az1-ramcat": "PRD ADF",

    "adb-4693644767318262": "DEV ADB",
    "adb-6251393601425350": "SIT ADB",
    "adb-3769403716554776.16": "UAT ADB",
    "adb-2232446691151506.6": "PRD ADB",
    "3263952417704082.2": "Optimus POC ADB",
    "328189355790169.9": "Optimus DEV ADB",
    "4167251017893463.3": "Optimus SIT ADB",

    "dtf-sgesss-dev-az1-tw12jnoptimus": "Opt POC ADF",
    "dtf-sgesss-dev-az1-p89dtaoptimus": "Opt SIT ADF",
};

// (function() {
//     'use strict';
//     const title = document.title.toLowerCase();
//     console.log(title);
//     if (title.includes('dtf-sgesss-dev-az1-m5rbvkhera2')) {
//         document.title = 'SIT ADF';
//         console.log("set title to " + title);
//     }
// })();

var oldTitle = document.title;
(function() {
    'use strict';


    var intervalId = setInterval(function() {
        var title = document.title;
        var url = document.URL;
        //console.log(1, title, 2, url);
        //console.log(url.includes())

        for (const [key, value] of Object.entries(replace_map)) {
            //console.log(key, value);
            if (url.includes(key)) {
                console.log("matched key", key);
                document.title = value + ": " + oldTitle;
                //clearInterval(intervalId);
                break;
            } else {
                console.log("not matched", key)
            }
        }
    }, 1000);
})();

// (function () {
//   "use strict";


//   // Listen for changes in the tab title
//   const observer = new MutationObserver((mutations) => {
//     mutations.forEach((mutation) => {
//       if (mutation.target.nodeName === "TITLE") {
//         const currentTitle = mutation.target.textContent;
//         for (const [key, value] of Object.entries(replace_map)) {
//           if (currentTitle.includes(key)) {
//             mutation.target.textContent = value;
//             break;
//           }
//         }
//       }
//     });
//   });

//   // Observe changes to the title element
//   observer.observe(document.querySelector("title"), {
//     subtree: true,
//     characterData: true,
//     childList: true,
//   });
// })();
