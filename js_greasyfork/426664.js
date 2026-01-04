// ==UserScript==
// @name         自用JS
// @namespace    https://www.v587.com/
// @version      1.0.1
// @description  自家用的js
// @author       penrcz
// @match        http://bbs.pcbeta.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/426664/%E8%87%AA%E7%94%A8JS.user.js
// @updateURL https://update.greasyfork.org/scripts/426664/%E8%87%AA%E7%94%A8JS.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    
    var $ = $ || window.$;
    var domain = window.location.host;
    
     switch(domain){
        /**
         * 远景论坛 去后广告高度调整 
         **/
        case 'bbs.pcbeta.com':
            $('.forum_top_sub').parent().css("height","auto");
            break;
         default:
     }
     
    
    function _p(obj){
    	console.log(obj);
    }
})();