// ==UserScript==
// @name         More content height for tweetdeck
// @namespace    http://tampermonkey.net/
// @version      0.2
// @icon         https://tweetdeck.twitter.com/favicon.ico
// @description  Make tweetdeck content have more height
// @author       mmorgat
// @match        https://tweetdeck.twitter.com/*
// @grant        none
 
// @downloadURL https://update.greasyfork.org/scripts/458063/More%20content%20height%20for%20tweetdeck.user.js
// @updateURL https://update.greasyfork.org/scripts/458063/More%20content%20height%20for%20tweetdeck.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    let content = document.createElement('style'); //Create custom <style> HTML element
    content.innerText = '.js-column .js-show-detail .media-item{height:500px !important;}'; //Set content of script
    document.getElementsByTagName('head')[0].appendChild(content); //Append the HTML element at the end of the page
})();