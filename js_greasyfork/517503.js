// ==UserScript==
// @name         Discord notification count remover
// @namespace    https://rant.li/boson
// @version      1.1
// @description  Removes the notification count indicator from the title
// @author       Boson
// @match        *://discord.com/*
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/517503/Discord%20notification%20count%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/517503/Discord%20notification%20count%20remover.meta.js
// ==/UserScript==


(function() {
  'use strict';
    var notificationCountRegex = new RegExp('^\\(\\d+\\)+');

    function removeTitleNotification() {
      if(notificationCountRegex.test(document.head.querySelector("title").innerText))
          document.head.querySelector("title").innerText = document.head.querySelector("title").innerText.split(')')[1];
         }
    removeTitleNotification();
    var observeDOM = (function() {
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function(obj, callback) {
            if(MutationObserver) {
                var obs = new MutationObserver(function(mutations, observer){
                    if(mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                        callback();
                });
                obs.observe(obj, {childList: true, subtree: true});
            }
            else if(eventListenerSupported ) {
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    })();

    var favicon_link_html = document.createElement('link');
    favicon_link_html.rel = 'icon';
    favicon_link_html.href = 'https://static-00.iconduck.com/assets.00/discord-icon-512x512-xtx725no.png';
    favicon_link_html.type = 'image/png';
    try {
      document.getElementsByTagName('head')[0].appendChild( favicon_link_html );
    }
    catch(e) { }
    observeDOM(document.head.querySelector("title"), function() {
        removeTitleNotification();
    });
})();

