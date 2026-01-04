// ==UserScript==
// @name         RW filter
// @namespace    rwfilter.zero.torn
// @version      0.2
// @description  filter rw items
// @author       -zero [2669774]
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473199/RW%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/473199/RW%20filter.meta.js
// ==/UserScript==

let lowerlimit = 3000000000;
let upperlimit = 4000000000;

let itemIds = [];

const {fetch: origFetch} = window;
window.fetch = async (...args) => {
    console.log("fetch called with args:", args);

    const response = await origFetch(...args);

    if (response.url.includes('bazaar.php?sid=bazaarData&step=getBazaarItems')){
        //  console.log("REsponseL : "+response);

        let clonedResponse = response.clone();
        let clonedJ = await clonedResponse.json();
        let newlist = [];
        console.log(clonedJ.list);

        for (let item of clonedJ.list){
            if (item.bonusesAvailable){
                let iprice = parseInt(item.price);
                let aid = item.armoryID;
                if (iprice >= lowerlimit && iprice <= upperlimit && !itemIds.includes(aid)){
                    newlist.push(item);
                    itemIds.push(aid);
                }
            }
        }
        console.log(newlist);

        clonedJ.list = newlist;

        let modifiedResponse = JSON.stringify(clonedJ);

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