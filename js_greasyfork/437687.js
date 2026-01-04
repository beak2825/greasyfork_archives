// ==UserScript==
// @name         CryptboxUnlocker
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  unlocker Cryptbox
// @author       LittleDuckLiu
// @match        https://*.sankuai.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437687/CryptboxUnlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/437687/CryptboxUnlocker.meta.js
// ==/UserScript==


(function() {
  function urlConverter(url) {
    if(!url.startsWith('https://cryptbox.sankuai.com/file/')) return url;
    return 'https://cryptbox.sankuai.com/file/distribute/download/v1/' + url.split('/').slice(-2).join('/')
  }

  unsafeWindow.addEventListener('load', function() {

    if(location.href.startsWith('https://cryptbox.sankuai.com/file/')) {
        location.href = urlConverter(location.href);
    }

    (function(open) {
      unsafeWindow.open = function() {
        var url = arguments[0];
        if(url.startsWith('https://cryptbox.sankuai.com/file/')) {
          window.open(urlConverter(url));
        }
        else {
          open.apply(this, arguments);
        }
      };
    })(unsafeWindow.open);

    setTimeout(function() {
      if(!unsafeWindow.secDBDownload || !unsafeWindow.secDBDownload.downloadFile) return;
      unsafeWindow.secDBDownload = {
        downloadFile: function(url) {
          window.open(urlConverter(url));
        }
      };

      Array.from(document.getElementsByClassName('ct-attachment')).forEach(function(c) {
        var old_element = c.getElementsByClassName('btn-download')[0];
        old_element.style = 'border: 1px solid red; border-radius: 15px;';
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
        new_element.addEventListener('click', function() {
          window.open(c.dataset.src);
        });
      });
    }, 5000);
  });
})();