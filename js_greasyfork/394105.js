// ==UserScript==
// @name         Newgrounds Swf Downloader
// @namespace    ngroundswf
// @version      1.1
// @description  download swf from newground easily
// @author       Reissfeld
// @match        https://www.newgrounds.com/portal/view/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394105/Newgrounds%20Swf%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/394105/Newgrounds%20Swf%20Downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function btn(a){
        var bt = `<span>
		       <a href="`+a+`" target="_blank" title="Download Link">
			   Download This
               </a>
	           </span>`;
        return bt;
    }
    var swf = $("script:contains('swf')").text().split("\"")[3];
    if(swf != undefined){
        $("#embed_header").children().last().append(btn(swf))
    }
})();