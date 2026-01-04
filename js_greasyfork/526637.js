// ==UserScript==
// @name         Caption Inspector 
// @namespace    Quickly opens up caption inspectors
// @version      1.0
// @description  Quickly opens up caption inspectors
// @author       amogzmis
// @match        https://atv-optic-domain-tooling-prod-iad.iad.proxy.amazon.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/526637/Caption%20Inspector.user.js
// @updateURL https://update.greasyfork.org/scripts/526637/Caption%20Inspector.meta.js
// ==/UserScript==
// v1.0 forked from previous release and fixed bug that caused style to not be applied on the button, also included fix to bypass the new dropdown addition to edp 

(function() {
    'use strict';

    // Initialize default language and storage for captions
    let language = 'en';
    let captions = [];
    let pageId;

    // Add custom styles for buttons
    GM_addStyle(`
        #root: { margin-top:60px; }
        .mybutton:hover {
            box-shadow: rgba(11, 12, 12, 0.16) 0px 1px 2px 0px;
            color: rgb(255, 255, 255);
            background-color: rgb(5, 93, 123);
        }
        .mybutton {
            margin-left: .4em;
            border: 0px none;
            text-align: inherit;
            appearance: none;
            cursor: pointer;
            font-family: "Amazon Ember", "Amazon Ember Arabic", Arial, sans-serif;
            font-size: 16px;
            font-weight: 400;
            line-height: 24px;
            color: rgb(255, 255, 255);
            background-color: rgb(7, 115, 152);
            display: inline-flex;
            flex-direction: row;
            float: right;
            -moz-box-align: center;
            align-items: center;
            -moz-box-pack: center;
            justify-content: center;
            box-sizing: border-box;
            outline: none;
            height: 40px;
            padding: 0px 16px;
            transition: color 100ms ease 0s, background-color 100ms ease 0s, border-color 100ms ease 0s;
            border-radius: 4px;
            white-space: nowrap;
            position: relative;
            z-index: 0;
        }
    `);

    // Determine pageId based on URL components
    if (document.URL.includes('sourcePackage=')) {
        pageId = document.URL.split('sourcePackage=')[1];
    } else if (document.URL.includes('external-content-id/')) {
        pageId = document.URL.split('external-content-id/')[1];
    } else {
        pageId = '';
    }

    // Intercept XHR and Fetch calls to process API data
    function api_call(ee) {
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
            unsafeWindow.fetch = function() {
                ee.onFetch && ee.onFetch(arguments);
                const p = fetch.apply(this, arguments);
                p.then(ee.onFetchResponse, ee.onFetchError);
                return p;
            };
            const js = Response.prototype.json;
            const text = Response.prototype.text;
            const blob = Response.prototype.blob;
            Response.prototype.json = function() {
                const p = js.apply(this, arguments);
                p.then(ee.onFetchLoad && ee.onFetchLoad.bind(ee, "json"));
                return p;
            };
            Response.prototype.text = function() {
                const p = text.apply(this, arguments);
                p.then(ee.onFetchLoad && ee.onFetchLoad.bind(ee, "text"));
                return p;
            };
            Response.prototype.blob = function() {
                const p = blob.apply(this, arguments);
                p.then(ee.onFetchLoad && ee.onFetchLoad.bind(ee, "blob"));
                return p;
            };
        }
        return ee;
    }

    // Process API call response and update captions
    function intcpt() {
        if (pageId !== document.URL.split('sourcePackage=')[1]) {
            $('#cptInsptdiv').remove();
            pageId = document.URL.split('sourcePackage=')[1];
            captions = [];
            displayButton();
        }
        try {
            let data = arguments[0];
            if (data.target && data.target.responseURL.includes('response-object') && !document.URL.includes('metadata')) {
                data = data.target.responseText;
                data = (typeof data === 'object') ? data : JSON.parse(data);
                if (data.tableIdentifier.includes('GLOBAL')) {
                    data = data.rows;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].fields[7].value === 'Active' && data[i].fields[1].value === 'TimedText' && data[i].fields[5].value.includes(language)) {
                            console.log(data[i]);
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
    }

    // Display the button for Caption Inspector
    function displayButton() {
        $('#app-layout-content-1').each(function() {
            this.children[0].children[0].style.paddingTop = '40px';
        });
        $('#cptInsptdiv button').remove();
        if ($('#cptInsptdiv').length === 0) {
            $('#root')[0].insertAdjacentHTML('beforebegin', `<div id="cptInsptdiv" style="position:fixed; margin-top: 10%; right: 5%;width:auto;z-index:10000;"></div>`);
        }
        if (captions.length > 0) {
            $('#cptInsptdiv')[0].insertAdjacentHTML('beforeend', '<button id="cptInspt" class="mybutton" role="button">Caption Inspectors</button>');
            $('#cptInspt').click(function() {
                for (let i = 0; i < captions.length; i++) {
                    let url = 'https://dmemediatoolingserviceui.video.amazon.dev/VccBridge/' + captions[i].maid + '/' + captions[i].v + '/' + pageId;
                    window.open(url, '_blank');
                }
            });
        }
    }

    // Set up API call interception
    api_call({
        onFetchLoad: intcpt,
        onLoad: intcpt
    });
})();