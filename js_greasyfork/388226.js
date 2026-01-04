// ==UserScript==
// @name         GotoArXivMirrors
// @namespace    https://github.com/zzilch/GotoArXivMirrors
// @homepage     https://github.com/zzilch/GotoArXivMirrors
// @version      1.1
// @author       zzilch
// @description  Open arXiv sites with arXiv mirrors
// @include      /^https?://(.*\.)?arxiv\.org/.*/
// @include      http://xxx.itp.ac.cn/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/388226/GotoArXivMirrors.user.js
// @updateURL https://update.greasyfork.org/scripts/388226/GotoArXivMirrors.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // useful funcitons
    function incompletePDF(url){ return url.includes('/pdf') && !url.endsWith('pdf') }
    function abstractURL(url){ return url.includes('/abs') }
    
    // available mirrors
    let mirrors = {
        'Main':'arxiv.org',
        'China':'xxx.itp.ac.cn',
        'Germany':'de.arxiv.org',
        'India':'in.arxiv.org',
    }
    
    // Tampermonkey menu items
    for(let mirror in mirrors){
        let url = location.href.replace(location.hostname,mirrors[mirror]).replace('https','http')
        url = incompletePDF(url) ? url+'.pdf' : url
        console.log(mirror+':'+url)
        GM_registerMenuCommand(mirror,()=>location.replace(url));
    }
    
    // append the filename extension for downloading
    if(incompletePDF(location.href)) { history.pushState(null,"",location.href+'.pdf') }
    
    // complete pdf url with filename extension after the document is loaded
    onload = function(){
        if(abstractURL(location.href))
        { document.querySelector("#abs > div.extra-services > div.full-text > ul > li:nth-child(1) > a").href += '.pdf' }
    }
})();