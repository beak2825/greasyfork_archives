// ==UserScript==
// @name         tampermonkey demonstration
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This is a script demonstrated how to create a Tampermonkey script and remove advertisments from web pages.
// @author       You
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/452141/tampermonkey%20demonstration.user.js
// @updateURL https://update.greasyfork.org/scripts/452141/tampermonkey%20demonstration.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    // Your code here...

    // delete elements by class
    var underSearchboxTips = $(".under-searchbox-tips");
    if (null !== underSearchboxTips &&
        typeof(underSearchboxTips) !== "undefined" &&
        underSearchboxTips.length > 0){

        for(var i=0; i<underSearchboxTips.length; i++){
            underSearchboxTips[i].remove();
        }
    }

    // delete elements by id
    var hotsearchWrapper = $("#s-hotsearch-wrapper");
    if (null !== hotsearchWrapper &&
        typeof(hotsearchWrapper) !== "undefined"){
        hotsearchWrapper.remove();
        console.log("delete elements by id:s-hotsearch-wrapper finished");
    }
    var hotsearchData = $("#hotsearch_data");
    if (null !== hotsearchData &&
        typeof(hotsearchData) !== "undefined"){
        hotsearchData.remove();
        console.log("delete elements by id:hotsearch_data finished");
    }
})();