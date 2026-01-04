// ==UserScript==
// @name         HTTP Request Sniffer
// @namespace    HTTP Request Sniffer
// @version      1.0
// @description  log http requests made with javascript in the console.
// @author       Turtle ? Clan
// @license      GPL
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/39149/HTTP%20Request%20Sniffer.user.js
// @updateURL https://update.greasyfork.org/scripts/39149/HTTP%20Request%20Sniffer.meta.js
// ==/UserScript==
var createElement = function(tag, attributes, value) {
   var element       = document.createElement(tag);
   element.innerText = value || '';
   for ( var i = 0; attributes && i < attributes.length; i += 2 ) {
      element.setAttribute(attributes[i], attributes[i + 1]);
   }
   return element;
};

var injectScript = function(element, callback) {
   var script = createElement('script', ['type', 'text/javascript'], '(' + String(callback) + '())');
   element.appendChild(script);
};

var requestSniffer = function() {
   var self     = {};
   self.request = {};
   self.open    = XMLHttpRequest.prototype.open;
   self.send    = XMLHttpRequest.prototype.send;
   self.header  = XMLHttpRequest.prototype.setRequestHeader;
   XMLHttpRequest.prototype.open = function() {
      self.request         = {};
      self.request.method  = arguments['0'];
      self.request.url     = arguments['1'];
      self.request.headers = [];
      self.open.apply(this, arguments);
   };
   XMLHttpRequest.prototype.setRequestHeader = function() {
      self.request.headers.push(arguments['0']);
      self.request.headers.push(arguments['1']);
      self.header.apply(this, arguments);
   };
   XMLHttpRequest.prototype.send = function() {
      self.request.post = arguments['0'] || false;
      self.send.apply(this, arguments);
      console.log(self.request);
   };
};

injectScript(document.body || document.head || document.documentElement, requestSniffer);