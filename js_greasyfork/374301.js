// ==UserScript==
// @name Bypass Statesman paywall
// @description Hides modal overlays, restores scrolling, replaces munged article text.
// @match *://*.statesman.com/*
// @version 1
// @run-at document-idle
// @namespace https://greasyfork.org/users/167798
// @downloadURL https://update.greasyfork.org/scripts/374301/Bypass%20Statesman%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/374301/Bypass%20Statesman%20paywall.meta.js
// ==/UserScript==


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle("div.cmg-banner-label, div.banner-body, div.modal-scrollable," +
               "div.connext-modal-backdrop, div.modal-body, div.Mg2-connext " +
               "{display: none;} html {overflow: scroll;}");

var intervalID = setInterval(function () {
   var divs = document.getElementsByClassName('blurry-text');
   if (divs.length) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
         var oldNodes = document.getElementsByClassName('article');
         var newNodes = this.responseXML.getElementsByClassName('article');
         var length;
         if (newNodes.length < oldNodes.length) {
            length = newNodes.length;
         } else {
               length = oldNodes.length;
         }

         for (var i = 0; i < length; i++){
            oldNodes.item(i).innerHTML = newNodes.item(i).innerHTML;}
      }

      xhr.open("GET",
          window.location.href);
          xhr.responseType = "document";
      xhr.send();

      clearInterval(intervalID);
   }
} , 100);
setTimeout(function() {clearInterval(intervalID);} , 10000);


