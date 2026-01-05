// ==UserScript==
// @name         Block sites
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Block sites (such as Baidu, etc.) You can edit the block list in the script.
// @author       Laphy
// @match        http*://www.baidu.com/
// @match        http*://weibo.com/*
// @match        http*://feedly.com/*
// @match        http*://twitter.com/*
// @match        http://www.newsmth.net/*
// @grant        GM_addStyle
// @run-at       document-start
// @require      http://code.jquery.com/jquery-2.2.4.js
// @downloadURL https://update.greasyfork.org/scripts/25448/Block%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/25448/Block%20sites.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var fullBlock = true;
    
    if(fullBlock)
    {
        window.stop();
    //not works, since the reloading will also be blocked.
    /*
    document.body = document.createElement("body");
    $('body').html(`<div id="NewContent">Connected. <a href='${document.URL}'>Restore</a></div>`);
    */
        return;
        
    }

    $("body").css("visibility","hidden");
    
    $(document).ready(function() {
        var oldBody = $('body').html();
        $('body').html('<div id="NewContent">Connected. <a href="javascript:void(0)">Restore</a></div>');
        $("body").css("visibility","visible");
        
        GM_addStyle(`#NewContent {
height: 300px;
margin: 50px;
padding: 50px;
font-size:20pt;
text-align:center;
}`);

        
        $("body a").click(function() {
        $('body').html(oldBody);
    });
        
});

    
})();