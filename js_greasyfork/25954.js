// ==UserScript==
// @name       Hybrid - Watermark Entry 
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @match      https://crowd.pimproll.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/25954/Hybrid%20-%20Watermark%20Entry.user.js
// @updateURL https://update.greasyfork.org/scripts/25954/Hybrid%20-%20Watermark%20Entry.meta.js
// ==/UserScript==

if ($('li:contains("Watermark Entry")').length) {
    $('iframe').height('800px');
    setInterval(function(){ listenForAnswer(); }, 250);
}

if(document.URL.indexOf("crowd.pimproll.com") >= 0){
    var lit = setInterval(function(){ listenFor(); }, 250);
}

function listenFor() {
    if ($('p:contains("Task complete, thank you.")').length) {
        clearTimeout(lit);
        GM_setValue('listen',true);
    }
}

function listenForAnswer() {
    if (GM_getValue('listen') === true) {
        GM_setValue('listen',false);
        $( "input[value='Submit']" ).click();
    }
}