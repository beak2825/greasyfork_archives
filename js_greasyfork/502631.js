// ==UserScript==
// @name         Caption Inspector - pogdeviv
// @namespace    Quickly opens up caption inspectors
// @version      3.0
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
// @downloadURL https://update.greasyfork.org/scripts/502631/Caption%20Inspector%20-%20pogdeviv.user.js
// @updateURL https://update.greasyfork.org/scripts/502631/Caption%20Inspector%20-%20pogdeviv.meta.js
// ==/UserScript==
// v1.0 initial with asset version included.
// v2.0 changing of page id
// v3.0 removes button on url change until data is fetched
(function() {
    'use strict';

    let language = 'en';
    let captions = [];
    let pageId = document.URL.split('sourcePackage=')[1];

    function pokemon(ee) {
        //got to catch them all (api call)
        const open = unsafeWindow.XMLHttpRequest.prototype.open;
        const send = unsafeWindow.XMLHttpRequest.prototype.send;

        const isRegularXHR = true;


        // don't hijack if already hijacked - this will mess up with frameworks like Angular with zones
        // we work if we load first there which we can.
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
        // don't hijack twice, if fetch is built with XHR no need to decorate, if already hijacked
        // then this is dangerous and we opt out
        //const isFetchNative = fetch.toString().indexOf('native code') !== -1;
        const isFetchNative= true;
        if(isFetchNative) {
            unsafeWindow.fetch = function () {
                ee.onFetch && ee.onFetch(arguments);
                const p = fetch.apply(this, arguments);
                p.then(ee.onFetchResponse, ee.onFetchError);
                return p;
            };
            // at the moment, we don't listen to streams which are likely video
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

    function intcpt()
    {
        //console.log(arguments);
        //intercept the api call
        //do what you want here
        if( pageId !== document.URL.split('sourcePackage=')[1] )
        {
            $('#cptInspt').remove();
            pageId = document.URL.split('sourcePackage=')[1];
            captions = [];
        };
        try
        {
            let data = arguments[0];
            if ( !!data.target && !!data.target.responseURL && data.target.responseURL.split('response-object').length > 1 )
            {
                data = data.target.responseText;
                data = ( typeof data === 'object' ) ? data : JSON.parse(data);
                if (data.tableIdentifier.split('GLOBAL').length > 1 )
                {

                    data = data.rows;
                    for ( let i = 0 ; i < data.length; i++ )
                    {
                        if ( data[i].fields[7].value == 'Active' )
                        {
                            if (data[i].fields[1].value == 'TimedText' )
                            {
                                if ( data[i].fields[5].value.split(language).length > 1 )
                                {
                                    console.log(data[i]);
                                    let ids = {maid: data[i].rowMetadata.mediaAssetId , v: data[i].rowMetadata.mediaAssetVersion};
                                    captions.push(ids);
                                };
                            };
                        };
                    };
                    displayButton();
                };

            };


        } catch (e) {console.log(e);};
    };

    function displayButton() {
        console.log('displaying button');
        $('#root')[0].insertAdjacentHTML('beforebegin', '<div style="position:fixed; margin-top: 5%; margin-left: 80%;z-index:10000;"><button class="css-bni06b" role="button" id="cptInspt">Caption Inspectors</button></div>');
        $('#cptInspt').click(function() {
            for ( let i = 0; i < captions.length; i++ ) {
                let url ='https://dmemediatoolingserviceui.video.amazon.dev/VccBridge/' + captions[i].maid + '/' + captions[i].v + '/' + pageId;
                window.open(url, '_blank');
            }
        });
    };


    pokemon({
        onFetchLoad: intcpt,
        onLoad: intcpt
    });
})();