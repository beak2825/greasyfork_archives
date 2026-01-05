// ==UserScript==
// @name         MLB The Show Nation Profit Reporter
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2019.5.1.1
// @description  Get the Chrome script
// @author       sreyemnayr
// @match        https://mlb19.theshownation.com/community_market/listings/*
// @exclude      https://mlb19.theshownation.com/community_market/orders/*

// @downloadURL https://update.greasyfork.org/scripts/29650/MLB%20The%20Show%20Nation%20Profit%20Reporter.user.js
// @updateURL https://update.greasyfork.org/scripts/29650/MLB%20The%20Show%20Nation%20Profit%20Reporter.meta.js
// ==/UserScript==
//var notified = false;


(function() {
    'use strict';
    
     var updateDialog = document.createElement('div');
        updateDialog.title = "MLBTSN Helper - Chrome Extension ";
        var updateInnerHTML = '<i>The UserScripts are no longer being updated.</i><a href="https://chrome.google.com/webstore/detail/mlb-the-show-nation-helpe/edgciopoaccbichgmbdheglfjbnfhhfd">Click here</a> to download the Chrome extension.';
        updateDialog.innerHTML = updateInnerHTML;


            $( updateDialog ).dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    "Got It!": function() {
                        localStorage.setItem('tsn-versionUpdate-'+scriptName, currentVersion);
                        $( this ).dialog( "close" );
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                }
            });
    
})();