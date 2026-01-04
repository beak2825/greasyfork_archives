// ==UserScript==
// @name         stayLoggedIn
// @author       Than
// @version      0.02
// @description  Keeps you logged in on specific sites. (edit @match and @include to set your own sites)
// @match        https://*.lithium.hosting:*/*
// @match        https://lithiumhosting.com/*
// @include      https://*.lithium.hosting:*/*
// @include      https://lithiumhosting.com/*
// @connect      lithiumhosting.com
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @namespace https://greasyfork.org/users/288098
// @downloadURL https://update.greasyfork.org/scripts/421667/stayLoggedIn.user.js
// @updateURL https://update.greasyfork.org/scripts/421667/stayLoggedIn.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var gmFetch = function ({url, // Supply the URL you want to XHR
                             method="GET", // default method
                             data="", // post data, if needed
                             headers="", // includ headers as json.
                             anonymous=false, // true: no cookies will be included. false: default browser cookies will be included.
                             simple=true, // true returns just the response body. false returns the full response object.
                             onprogressCallback=false, // supply a function name for a callback
                             responseType = "text",
                            }) {
        return new Promise((resolve, reject) => {
            headers = ((method === "POST" && headers === "") ? {"Content-Type": "application/x-www-form-urlencoded"} : headers);
            //  console.log(GM.xmlHttpRequest);
            GM.xmlHttpRequest({
                method: method,
                url: url,
                headers: headers,
                data: data,
                anonymous: anonymous,
                onload: (simple ? e => resolve(e.response) : e => resolve(e)),
                onprogress: (onprogressCallback ? function (response) { onprogressCallback(response) } : false),
                onerror: reject,
                ontimeout: reject,
                responseType:responseType,
            });
        });
    }
    sendPing(document.location.href);
    /*--------------------------------------------------------------------------------------------------------------------
    ------------------------------------------- General functions --------------------------------------------------
    --------------------------------------------------------------------------------------------------------------------*/
    async function sendPing(url){
        console.log("ping active...")
        setInterval(sendRequest, 400000);
        async function sendRequest(){
            var response = await gmFetch({url:url});
            console.log(response);
            document.body.click();
            (function(path){
                var item = document.querySelector(path);
                if (!item){
                    document.body.appendChild(document.createTextNode('Error: '+path+' not found'));
                    return;
                };
                item.click();
                item.dispatchEvent(new Event('resize', {bubbles: true}));
            })('body');
        }
    } // Also, run all of the above when the document loads initially, not just during mutations
    // Your code here...
})();