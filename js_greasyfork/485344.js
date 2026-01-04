// ==UserScript==
// @name         Automatic Gem Claim
// @namespace    http://tampermonkey.net/
// @version      2023-12-20
// @description  it does things
// @author       You
// @match        https://promptchan.ai/earn-gems
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485344/Automatic%20Gem%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/485344/Automatic%20Gem%20Claim.meta.js
// ==/UserScript==

var oldFetch = fetch

function handleRewardClaim(authorization) {
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://dev.promptchan.ai/api/claim_reward",
        headers : {
            Authorization: authorization,
            "content-type": "application/json"
        },
        data: JSON.stringify({
            mobile: !1
        }),
        onload: (response) => {
            console.log("Claim reward status : " + response.status)
        }
    })
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://dev.promptchan.ai/api/claim_welcome_reward",
        headers : {
            Authorization: authorization,
            "content-type": "application/json"
        },
        onload: (response) => {
            console.log("Welcome reward status : " + response.status)
        }
    })
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://promptcloud.editapp.ai/api/initialise-account",
        headers : {
            Authorization: authorization,
            "content-type": "application/json"
        },
        onload: (response) => {
            console.log("Android app reward status : " + response.status)
        }
    })
}

function handleStripeSub(response) {
    return new Response(`{"plan":"Pro","status":"active"}`, response)
}

const _fetch = fetch;
unsafeWindow.fetch = async (resource, initOptions = {}) => {
    const getOriginalResponse = () => _fetch(resource, initOptions);

    let request;

    if (resource instanceof Request) {
      request = resource.clone();
    } else {
      request = new Request(resource.toString(), initOptions);
    }

    if (resource.toString().includes("check_reward_claim") && initOptions.method === "GET") {
        handleRewardClaim(initOptions.headers.Authorization)
    }

    let fetchedResponse;
    let exceptionCaught;

    try {
      fetchedResponse = await getOriginalResponse();
    } catch (error) {
      exceptionCaught = error;
    }

    if (exceptionCaught) {
        return Promise.reject(exceptionCaught);
    }

    if (resource.toString() == "https://dev.promptchan.ai/api/check_stripe_status" && initOptions.method != "OPTIONS") {
        return handleStripeSub(fetchedResponse)
    }

    return fetchedResponse;
};