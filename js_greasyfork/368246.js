// ==UserScript==
// @name         cnbeta Anti-AdBlock killer 
// @namespace    http://tampermonkey.net/
// @version      0.50
// @description  反 cnbate反广告屏蔽  Anti-AdBlock killer 
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @author       WangHexie

// @exclude      https://www.cnbeta.com/
// @exclude      http://www.cnbeta.com/
// @match        https://www.cnbeta.com/*
// @match        https://*.cnbeta.com/*
// @match        http://www.cnbeta.com/*
// @match        http://*.cnbeta.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368246/cnbeta%20Anti-AdBlock%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/368246/cnbeta%20Anti-AdBlock%20killer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.insertBefore = function(a,v){};
    var y = $(".main-wrap");
    var x = y.children();
    x[4].remove();
    $(document).ready(function(){
        document.body.insertBefore = function(a,v){};
        var LB = function(i){
            setTimeout(
                function()
                {
                    var y = y = $('body div[style="display:block !important;position:fixed;bottom:0;margin-top:10px;width:100%;background:#c44;color:#fff;font-size:15px;z-index:99999"]');
                    y.hide();
                }, i*50);
        }
        var len = 40;
        for (var i =0; i<len; i++)
        {
            LB(i);
        }
    });
})();
