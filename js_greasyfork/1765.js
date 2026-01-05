// ==UserScript==
// @name        Gaia - No Image Cache
// @namespace   gaiarch_v3
// @match       http://*.gaiaonline.com/*
// @version     2.3.1
// @grant       none
// @description Remove Gaia's image cache from the image source
// @downloadURL https://update.greasyfork.org/scripts/1765/Gaia%20-%20No%20Image%20Cache.user.js
// @updateURL https://update.greasyfork.org/scripts/1765/Gaia%20-%20No%20Image%20Cache.meta.js
// ==/UserScript==
(function() {
    var recursiveCheck = function (elem, className) {
      if (elem && elem.classList && elem.classList.contains(className)) {
        return true;
      } else {
        if (elem.parentNode) {
          return recursiveCheck(elem.parentNode, className);
        } 
        else {
          return false;
        }
      }
    };
    function noCache() {
        var image = document.getElementsByTagName('img');

        for(let img of image) {
           if(img.src.indexOf('img-cache.cdn.gaiaonline.com') !== -1)
              img.src = decodeURIComponent(img.src.substr(69)).replace(/&amp;/gi, '&');
        }
    };
    document.addEventListener('click', function (evt) {
        if (recursiveCheck(evt.target, 'yui3-pjax')) {
            new MutationObserver(function (mutations) {
                mutations.some(function (mutation, idx, mutated) {
                    if (mutation.addedNodes.length === 21) {
                        for (var i = 0; i < mutation.addedNodes.length; i++) {
                            if (mutation.addedNodes[i].id === 'post_container') {
                                noCache();
                                console.log('changed')
                                break; // stop for-loop post_container search 
                            };
                        };
                        return true; // stop iterating added nodes
                    };
                });
                this.disconnect(); // stop listening for changes on the target regardless if post_container exists
            }).observe(document.querySelector('#content-padding'), {
                childList: true
            });
        };
    });
    return noCache();
})();