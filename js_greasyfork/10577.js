// ==UserScript==
// @name         Hornohexe Video Downloader
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://www.hornoxe.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10577/Hornohexe%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/10577/Hornohexe%20Video%20Downloader.meta.js
// ==/UserScript==

(function () {

    function renderObject(embedElements) {

    
        var flashvars = decodeURIComponent(embedElements.value).toString();
        
       
        var link = document.createElement('a');
        link.href = /&file=([^&]*)?&/gm.exec(flashvars)[1];
        link.innerHTML = 'Download Video';
        
        var b = document.getElementsByClassName('infobox')[0];
        b.insertBefore(link, b.firstChild);
                
        
    }

    function doExec() {
        var embedElements = document.querySelectorAll('param[name="flashvars"]');
            //log(embedElements);
        renderObject(embedElements[0]);
       
    }

    function log(msg) {
         console.log(JSON.parse(JSON.stringify(msg)));
    }

    try
    {
       doExec();
    }catch (e) {}
})();