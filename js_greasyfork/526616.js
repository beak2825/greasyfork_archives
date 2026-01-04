// ==UserScript==
// @name         Caption Inspector + Kairos
// @namespace    Launch Caption Inspector & Added Kairos functionality to metadata page
// @version      1.1
// @description  Launch Caption Inspector & Added Kairos functionality to metadata page
// @author       amogzmis
// @match        https://atv-optic-domain-tooling-prod-iad.iad.proxy.amazon.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// v1.0 initial with asset version included.
// v1.1 fixed placement of caption inspector.
// @downloadURL https://update.greasyfork.org/scripts/526616/Caption%20Inspector%20%2B%20Kairos.user.js
// @updateURL https://update.greasyfork.org/scripts/526616/Caption%20Inspector%20%2B%20Kairos.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let language = 'en';
    let captions = [];
    let options = {};
    let urls = {};
    let pageId = document.URL.split('sourcePackage=')[1];

    GM_addStyle (` #root: { margin-top:60px; }
.mybutton:hover {
  box-shadow: rgba(11, 12, 12, 0.16) 0px 1px 2px 0px;
}
.mybutton:hover {
  color: rgb(255, 255, 255);
  background-color: rgb(5, 93, 123);
}
.mybutton {
  margin-left: .4em;
}
.mybutton {
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
}`);

    resetVars(true);
    function resetVars (option) {
        if ( option )
        {
            if( !!unsafeWindow.localStorage.getItem('kairosOptions') ) {
                options = JSON.parse(unsafeWindow.localStorage.getItem('kairosOptions'));
            }
            else
            {
                options = {
                    Captions: true
                    , IMDb: true
                    , CSM: true
                    , "AppleTV": true
                    , MAL: true
                    , MDL: false
                    , Dove: false
                    , RottenTomatoes: true
                    , Lyrics: true
                    , TranslatedLyrics: false
                };
            };
        };
        urls = {
            IMDb: ''
            , CSM: ''
            , "AppleTV": ''
            , MAL: ''
            , MDL: ''
            , Dove: ''
            , RottenTomatoes: ''
            , Lyrics: ''
            , TranslatedLyrics: ''
        };
    };

    function api_call(ee) {
        //got to catch them all (api call)
        const open = unsafeWindow.XMLHttpRequest.prototype.open;
        const send = unsafeWindow.XMLHttpRequest.prototype.send;

        const isRegularXHR = true;

        // for XHR

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
            $('#cptInsptdiv').remove();
            pageId = document.URL.split('sourcePackage=')[1];
            resetVars(false);
            captions = [];
            displayButton();
        };
        try
        {
            let data = arguments[0];
            if ( !!data.target && !!data.target.responseURL && data.target.responseURL.split('response-object').length > 1 && document.URL.split('metadata').length == 1 )
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
            if ( !!data.target && !!data.target.responseURL && data.target.responseURL.split('metadata').length > 1 && data.target.responseURL.split('GLOBAL').length > 1)
            {
                data = data.target.responseText;
                data = ( typeof data === 'object' ) ? data : JSON.parse(data);
                if( data.length > 0 && !!data[0].territory )
                {
                    let name = '';
                    if ( data[0].staticMetadata.contentType == 'SEASON' || data[0].staticMetadata.contentType == 'EPISODE' )
                    {
                        if ($('p:contains("Series:")').length > 0 )
                        {
                            name = $('p:contains("Series:")')[0].nextElementSibling.innerText
                        }
                        else
                        {
                            urls.CSM = ''; urls.AppleTV = ''; urls.Lyrics = ''; urls.TranslatedLryics = ''; urls.IMDb = ''; urls.MAL = ''; urls.MDL = ''; urls.Dove = ''; urls.RottenTomatoes = '';
                            var observer = new MutationObserver(function(mutations){
                                observer.disconnect();
                                if ($('p:contains("Series:")').length > 0 )
                                {
                                    let name = $('p:contains("Series:")')[0].nextElementSibling.innerText;
                                    urls.CSM = 'https://www.commonsensemedia.org/search/' + encodeURIComponent(name);
                                    urls.AppleTV = 'https://www.google.com/search?q=' + name.replaceAll(' ','+') + '+apple+tv';
                                    urls.MAL = 'https://myanimelist.net/search/all?q=' + encodeURIComponent(name) + '&cat=all';
                                    urls.MDL = 'https://mydramalist.com/search?q=' + encodeURIComponent(name);
                                    urls.Dove = 'https://dove.org/search/reviews/' + encodeURIComponent(name);
                                    urls.RottenTomatoes = 'https://www.rottentomatoes.com/search?search=' + encodeURIComponent(name);
                                    urls.Lyrics = 'https://www.google.com/search?q=' + name.replaceAll(' ','+') + '+lyrics';
                                    urls.TranslatedLyrics = 'https://www.google.com/search?q=' + name.replaceAll(' ','+') + '+lyrics+translated';
                                    if ( urls.IMDb.split('null').length > 1 || urls.IMDb.split('nv_sr_sm').length > 1 ) { urls.IMDb = 'https://www.imdb.com/find/?q=' + encodeURIComponent(name) + '&ref_=nv_sr_sm'; }
                                    displayButton();
                                }
                                else
                                {
                                    observer.observe(document.documentElement, {
                                        childList: true,
                                        subtree: true
                                    });
                                }
                            });
                            observer.observe(document.documentElement, {
                                childList: true,
                                subtree: true
                            });
                        };
                    }
                    else
                    {
                        name = data[0].localeMetadata[0].titleName
                    };
                    urls.IMDb = 'https://www.imdb.com/title/' + data[0].staticMetadata.imdbId + '/';
                    if ( name !== '' )
                    {
                        urls.CSM = 'https://www.commonsensemedia.org/search/' + encodeURIComponent(name);
                        urls.AppleTV = 'https://www.google.com/search?q=' + name.replaceAll(' ','+') + '+apple+tv';
                        urls.MAL = 'https://myanimelist.net/search/all?q=' + encodeURIComponent(name) + '&cat=all';
                        urls.MDL = 'https://mydramalist.com/search?q=' + encodeURIComponent(name);
                        urls.Dove = 'https://dove.org/search/reviews/' + encodeURIComponent(name);
                        urls.RottenTomatoes = 'https://www.rottentomatoes.com/search?search=' + encodeURIComponent(name);
                        urls.Lyrics = 'https://www.google.com/search?q=' + name.replaceAll(' ','+') + '+lyrics';
                        urls.TranslatedLyrics = 'https://www.google.com/search?q=' + name.replaceAll(' ','+') + '+lyrics+translated';
                        if ( urls.IMDb.split('null').length > 1 ) { urls.IMDb = 'https://www.imdb.com/find/?q=' + encodeURIComponent(name) + '&ref_=nv_sr_sm'; }
                    };
                    displayButton();
                };
            };


        } catch (e) {console.log(e);};
    };

    function displayButton() {
        $('#app-layout-content-1').each(function() { this.children[0].children[0].style.paddingTop = '40px'; });
        $('#cptInsptdiv button').remove();
        if( $('#cptInsptdiv').length == 0 )
        {
            $('#root')[0].insertAdjacentHTML('beforebegin', `<div id="cptInsptdiv" style="position:fixed; margin-top: 10%;width:100%;z-index:10000;">
                         <svg xmlns="http://www.w3.org/2000/svg" style="float:right; height:40px; width:40px;" width="16" height="16" fill="rgb(7, 115, 152)" class="bi bi-list" viewBox="0 0 16 16"><title>Options</title>
                           <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                         </svg></div>`);
            $('#cptInsptdiv svg').click(function() {
                let pos = this.getBoundingClientRect();
                let html = '<div id="cptInsptOptions" style="position:fixed;background-color:white;z-index:100000;left:' + (pos.left - 100) + 'px;top:' + pos.bottom + 'px;">';
                let keys = Object.keys(options);
                for ( let i = 0; i < keys.length; i++ )
                {
                    let key = keys[i];
                    html += '<input type="checkbox" id="opt' + key + '" name="' + i + key + ' value="' + key + '><label for="' + i + key + '">' + key + '</label><br>';
                };
                html += '</div>';
                $('#root')[0].insertAdjacentHTML('beforebegin',html);
                $('#cptInsptOptions input').click(function() {
                    console.log('clicked');
                    options[this.id.replace('opt','')] = this.checked;
                    unsafeWindow.localStorage.setItem('kairosOptions', JSON.stringify(options));
                }).each(function() {
                    this.checked = options[this.id.replace('opt','')];
                    console.log(this.value, this.checked);
                });
                $('#root').on('click', function() { $('#root').off('click'); $('#cptInsptOptions').remove(); $('#cptInsptdiv').remove(); displayButton(false); });
            });

        };
        if( options.Captions && captions.length > 0 )
        {
            $('#cptInsptdiv')[0].insertAdjacentHTML('beforeend','<button id="cptInspt" class="mybutton" role="button" >Caption Inspector</button>');
            $('#cptInspt').click(function() {
                for ( let i = 0; i < captions.length; i++ ) {
                    let url ='https://dmemediatoolingserviceui.video.amazon.dev/VccBridge/' + captions[i].maid + '/' + captions[i].v + '/' + pageId;
                    window.open(url, '_blank');
                }
            });
        };
        let keys = Object.keys(urls);
        for ( let i = 0; i < keys.length; i++ )
        {
            let key = keys[i];
            if ( options[key] && urls[key] !== '' )
            {
                $('#cptInsptdiv')[0].insertAdjacentHTML('beforeend', '<button id="cpt' + key + '" class="mybutton" role="button">' + key + '</button>');
                $('#cpt' + key ).click(function() {
                    window.open(urls[this.id.replace('cpt','')], '_blank');
                });
            };
        };
    };


    api_call({
        onFetchLoad: intcpt,
        onLoad: intcpt
    });
})();