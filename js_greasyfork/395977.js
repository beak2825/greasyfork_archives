// ==UserScript==
// @name         vk.com_del_redir
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Deletes VK.com url redirects
// @author       AndShy
// @match        http://vk.com/*
// @match        https://vk.com/*
// @license      GPL-3.0
// @homepageURL  https://greasyfork.org/en/users/384289-andshy
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395977/vkcom_del_redir.user.js
// @updateURL https://update.greasyfork.org/scripts/395977/vkcom_del_redir.meta.js
// ==/UserScript==

(function() {
  'use strict';

    document.onmouseover = handler;

    function handler(event) {
      var evt = event.target
      if (evt) {
        if (evt.tagName.includes('A')) {
          if (evt.href){
            var link = decodeURIComponent(evt.href)
            evt.href = link.replace(/^(?:http.?.*\?to\=)(.*?)(?:\&.*)?$/,'$1')
          }
        }
      }
    }

})();