// ==UserScript==
// @name         Disable TransIP DNS records
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When a site has name servers pointing elsewhere the DNS records will be hidden
// @author       Tomas van Rijsse
// @match        https://www.transip.nl/cp/domein-hosting/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/389823/Disable%20TransIP%20DNS%20records.user.js
// @updateURL https://update.greasyfork.org/scripts/389823/Disable%20TransIP%20DNS%20records.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
/*global $ jQuery*/

jQuery(function(){

    checkNameservers();

    var waitingForFragment = setInterval(
        function(){
            if(jQuery('.fragment').length > 0){
                startObserver();
                clearInterval(waitingForFragment);
            }
        }, 100
    );
});

function startObserver(){

    // Select the node that will be observed for mutations
    var targetNode = jQuery('.fragment')[0];

    // Options for the observer (which mutations to observe)
    var config = { childList: true };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
        observer.disconnect();
        setTimeout(checkNameservers,100);
        observer.observe(targetNode, config);
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

}

function checkNameservers(){
    var ns0 = jQuery('#nameserver-0').val();

    if(ns0 && ns0.indexOf('transip') == -1){
        jQuery('form.dns').hide()
            .after('Gebruik de nameservers van '+ns0);
    }
}