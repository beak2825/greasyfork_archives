// ==UserScript==
// @name         ZGIT
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  ZGIT_DESC
// @author       You
// @match        https://zgit.csez.zohocorpin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zohocorpin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453836/ZGIT.user.js
// @updateURL https://update.greasyfork.org/scripts/453836/ZGIT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        jQuery('.sidebar-top-level-items').append("<input id='SfileName' placeholder='fileName to Search' /><button id='searchFile'>Search File</button>");
        const queryParams = window.location.href.split("?")[1];
         let search = queryParams||'';
        try{
            var queryObj = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/%2F/g,"\/") + '"}');
        }catch(e){
        queryObj = {};
        }
        const { searchFile='' } = queryObj || {};
        jQuery('#SfileName').val(searchFile)
        const searchFileFn = ()=>{
            let searchVal = jQuery('#SfileName').val();
            const nextBtn = jQuery('.js-next-button a');
            let query = nextBtn.attr('href');
            query && query.indexOf("searchFile") == -1 && jQuery('.js-next-button a').attr('href', query+"&searchFile="+encodeURI(searchVal));
            if(jQuery('.diff-file.file-holder').length != 0){
                let elem = jQuery(`[data-blob-diff-path*="${searchVal}" i]`);
                if(elem.length == 0){
                     nextBtn.length != 0 && jQuery('.js-next-button a')[0].click();
                }else{
                    elem.find('[data-qa-selector="file_name_content"]').attr('style','color:red')
                    elem[0].scrollIntoViewIfNeeded();
                }
            }
        }
        if(window.location.pathname == '/zohodesk/desk_client_app/-/compare'){
            $('.gl-mt-4').append(`<button type="button" id='changeMaster' class="btn btn btn-default btn-default btn-md gl-button"><span class="gl-button-text">Compare with Master</span></button>`);
        }
        jQuery('#changeMaster').click(()=>{
            debugger;
            let query = window.location.href;
            if(query.indexOf("REACT_RELEASE_BRANCH") != -1){
                var queryObj = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/%2F/g,"\/") + '"}');
                window.location.href = `https://zgit.csez.zohocorpin.com/zohodesk/desk_client_app/-/compare/master...`+queryObj.to
            }
        })
        jQuery( "#searchFile" ).click(()=>{
           let searchVal = jQuery('#SfileName').val();
           queryObj.page = 1;
           queryObj.searchFile = encodeURI(searchVal);
            const { pathname, origin } = window.location;
            window.location.href = `${origin}${pathname}?${new URLSearchParams(queryObj).toString()}`;
        });
        searchFile && searchFileFn();
    },1000);
})();