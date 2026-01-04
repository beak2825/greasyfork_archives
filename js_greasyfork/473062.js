// ==UserScript==
// @name         Replace
// @namespace    zero.replace.torn
// @version      0.4
// @description  modifies fetch response
// @author       -zero [2669774]
// @match       https://www.torn.com/*
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473062/Replace.user.js
// @updateURL https://update.greasyfork.org/scripts/473062/Replace.meta.js
// ==/UserScript==

//activityLogUserData

let uniqueMoney = '2444134';
let replacedMoney = '1';

let usernametoReplace = '_Meh';
let replacedusername = 'whatyouwanttochangeto';

let thirdword = 'Nova';
let replaceword = 'hidden';







const {fetch: origFetch} = window;
window.fetch = async (...args) => {
    console.log("fetch called with args:", args);

    const response = await origFetch(...args);

    if (response.url.includes('/page.php?sid=activityLogUserData') || response.url.includes('page.php?sid=activityLogData')){
        //  console.log("REsponseL : "+response);

        let clonedResponse = response.clone();
        let clonedJ = await clonedResponse.json();

        let modifiedResponse = JSON.stringify(clonedJ).replaceAll(usernametoReplace, replacedusername).replaceAll(uniqueMoney, replacedMoney).replaceAll(thirdword, replaceword);

        modifiedResponse = new Response(modifiedResponse, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });

        console.log("Modified");

        return modifiedResponse;



    }



    return response;
};
