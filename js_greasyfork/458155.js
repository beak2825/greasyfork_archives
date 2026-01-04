// ==UserScript==
// @name         f site page🎮
// @description  Append the next content to the bottom seamlessly
// @namespace    f_____l
// @author       Covenant
// @version      1.0.2
// @license      MIT
// @homepage
// @match        https://*.site/*
// @exclude      file:///*
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwLjQzNCAxLjQ2Mi40MDIgMTguNjEyQy0uNzQgMjAuNTYzLjY4NyAyMyAyLjk2NiAyM2gyMC4wNjhjMi4yOCAwIDMuNzA2LTIuNDM3IDIuNTY0LTQuMzg3TDE1LjU2NiAxLjQ2M2MtMS4xNDItMS45NS0zLjk5LTEuOTUtNS4xMzIgMHoiIGZpbGw9IiM5QjlCOUIiLz48cGF0aCBkPSJNMTMuOTk1IDE3LjM1N2MuMjUzLjI1LjM5NS41NjYuMzk1Ljk1NnMtLjE0My43MjUtLjM5NS45NzVjLS4yODkuMjUtLjYwOS4zNy0xLjAwNC4zN3MtLjcxOS0uMTQtLjk2OC0uMzljLS4yODgtLjI1LS40MS0uNTY1LS40MS0uOTU1cy4xMjYtLjcxLjQxLS45NTZjLjI1My0uMjUuNTczLS4zNy45NjgtLjM3cy43MzUuMTI1IDEuMDA0LjM3em0uMTgxLTkuNjQtLjM4MyA3LjY3OWEuNjczLjY3MyAwIDAgMS0uNjc1LjYzNWgtLjIzOGMtLjM2IDAtLjY2LS4yOC0uNjc1LS42MzVsLS4zODMtNy42NzlhLjY3MS42NzEgMCAwIDEgLjY3NS0uNzAyaDFjLjM4NyAwIC42OTUuMzIuNjc1LjcwMmguMDA0eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458155/f%20site%20page%F0%9F%8E%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/458155/f%20site%20page%F0%9F%8E%AE.meta.js
// ==/UserScript==
var div_content;
function fn_XMLHttpRequest(url,fn){
    const xhr=new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4 && xhr.status==200){
            console.log([
                "xmlhttpRequest",
                url,
                xhr.status,
                xhr.statusText,
                xhr.readyState,
                xhr.getResponseHeader("Content-Type"),
                //response.responseText,
                xhr.finalUrl].join("\n")
            );
            fn(xhr);
        }
    };
}
function fn_re_page(response){
    let dom=document.createRange().createContextualFragment(response.responseText);
    if(response.status==200){
        var entry_content=dom.querySelectorAll('div.entry-content');
        div_content.appendChild(entry_content[0].cloneNode(true));
    }else{//
        console.log("response.status: "+response.status+response.responseHeaders);
    }
}
//console.log("break");
(function() {
    'use strict';
    var ary_tmp=document.querySelectorAll('.entry-content');
    if(ary_tmp.length>0){
        div_content=ary_tmp[0];
        var url=new URL(document.location);
        var ary_page=div_content.querySelectorAll('.lcp_paginator>li>a');
        if(ary_page.length>0&&url.searchParams.get('lcp_page0')==null){
            var page_len=parseInt(ary_page[ary_page.length-2].innerText,10);
            for(let i=2; i <= page_len; i++){
                window.setTimeout(( () => fn_XMLHttpRequest("https://"+url.host+url.pathname+"?lcp_page0="+i,fn_re_page) ), i*1000*0.6);
            }
        }
    }
})();