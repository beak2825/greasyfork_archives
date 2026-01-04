// ==UserScript==
// @name         Caption Inspector - pogdeviv 
// @namespace    Quickly opens up caption inspectors
// @version      3.5
// @description  Quickly opens up caption inspectors
// @author       pogdeviv
// @match        https://atv-optic-domain-tooling-prod-iad.iad.proxy.amazon.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/510395/Caption%20Inspector%20-%20pogdeviv.user.js
// @updateURL https://update.greasyfork.org/scripts/510395/Caption%20Inspector%20-%20pogdeviv.meta.js
// ==/UserScript==
// v1.0 initial with asset version included.
// v2.0 changing of page id
// v3.0 removes button on url change until data is fetched
// v3.5 Allows KDPOW users to use this function with or without approvals

(function() {
    'use strict';

    //initialize variables
    let language = 'en'; //default language to fetch
    let captions = []; //array to store captions
    let pageId;

    // Check the URL for both 'sourcePackage' and 'external-content-id' to set the pageId accordingly
    if (document.URL.includes('sourcePackage=')) {
        pageId = document.URL.split('sourcePackage=')[1];
    } else if (document.URL.includes('external-content-id/')) {
        pageId = document.URL.split('external-content-id/')[1];
    } else {
        pageId = ''; // or handle cases where neither is found
    }

    //This function is used to intercept XHR and Fetch calls
    function pokemon(ee) {
        const open = unsafeWindow.XMLHttpRequest.prototype.open;
        const send = unsafeWindow.XMLHttpRequest.prototype.send;

        const isRegularXHR = true;

        if (isRegularXHR) {
            unsafeWindow.XMLHttpRequest.prototype.open = function() {
                ee.onOpen && ee.onOpen(this, arguments);
                if (ee.onLoad) {
                    this.addEventListener('load', ee.onLoad.bind(ee));
                }
                if (ee.onError) {
                    this.addEventListener('error', ee.onError.bind(ee));
                }
                return open.apply(this, arguments);
            };
            unsafeWindow.XMLHttpRequest.prototype.send = function() {
                ee.onSend && ee.onSend(this, arguments);
                return send.apply(this, arguments);
            };
        }

        const fetch = unsafeWindow.fetch;
        const isFetchNative = true;
        if (isFetchNative) {
            unsafeWindow.fetch = function () {
                ee.onFetch && ee.onFetch(arguments);
                const p = fetch.apply(this, arguments);
                p.then(ee.onFetchResponse, ee.onFetchError);
                return p;
            };
            const js = Response.prototype.json;
            const text = Response.prototype.text;
            const blob = Response.prototype.blob;
            Response.prototype.json = function () {
                const p = js.apply(this,arguments);
                p.then(ee.onFetchLoad && ee.onFetchLoad.bind(ee, "json"));
                return p;
            };
            Response.prototype.text = function () {
                const p = text.apply(this,arguments);
                p.then(ee.onFetchLoad && ee.onFetchLoad.bind(ee, "text"));
                return p;
            };
            Response.prototype.blob = function () {
                const p = blob.apply(this,arguments);
                p.then(ee.onFetchLoad && ee.onFetchLoad.bind(ee, "blob"));
                return p;
            };
        }
        return ee;
    };

    //This function is used to read the API call and process the data
    function intcpt() {
        if (pageId !== document.URL.split('sourcePackage=')[1] && !document.URL.includes('external-content-id/')) {
            $('#cptInspt').remove();
            pageId = document.URL.includes('sourcePackage=') ? document.URL.split('sourcePackage=')[1] : document.URL.split('external-content-id/')[1];
            captions = [];
        }
        try {
            let data = arguments[0];
            if (data.target && data.target.responseURL && data.target.responseURL.split('response-object').length > 1) {
                data = data.target.responseText;
                data = (typeof data === 'object') ? data : JSON.parse(data);
                if (data.tableIdentifier.split('GLOBAL').length > 1) {
                    data = data.rows;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].fields[7].value === 'Active' && data[i].fields[1].value === 'TimedText' && data[i].fields[5].value.includes(language)) {
                            let ids = { maid: data[i].rowMetadata.mediaAssetId, v: data[i].rowMetadata.mediaAssetVersion };
                            captions.push(ids);
                        }
                    }
                    displayButton();
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    //This function is used to display the button on the page
    function displayButton() {
        console.log('displaying button');
        $('#root')[0].insertAdjacentHTML('beforebegin', '<div style="position:fixed; margin-top: 5%; margin-left: 80%; z-index:10000;"><button class="css-bni06b" role="button" id="cptInspt">Caption Inspectors</button></div>');
        $('#cptInspt').click(function() {
            for (let i = 0; i < captions.length; i++) {
                let url = 'https://dmemediatoolingserviceui.video.amazon.dev/VccBridge/' + captions[i].maid + '/' + captions[i].v + '/' + pageId;
                window.open(url, '_blank');
            }
        });
    };

    pokemon({
        onFetchLoad: intcpt,
        onLoad: intcpt
    });
})();
