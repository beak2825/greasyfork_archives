// ==UserScript==
// @name        Lemmy Image Expand
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.1
// @author      SlyFabi
// @description Auto expands all image posts except NSFW ones.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/468868/Lemmy%20Image%20Expand.user.js
// @updateURL https://update.greasyfork.org/scripts/468868/Lemmy%20Image%20Expand.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Thanks to CodingAndCoffee for isLemmy
    let isLemmy;
    try {
        isLemmy = document.head.querySelector("[name~=Description][content]").content === "Lemmy";
    } catch (_er) {
        isLemmy = false;
    }

    if(isLemmy) {
      function isVersion0181() {
        const versionRegex = /(\d+\.\d+\.\d+(?:-\w+\.\d+)*)/;
        const documentText = document.documentElement.innerHTML;
        const matches = documentText.match(versionRegex);

        if (matches && matches.length > 0) {
          const versionString = matches[0];
          const versionNumbers = versionString.split(/[\.-]/);
          return (versionNumbers[1] == 18 && versionNumbers[2] >= 1) || (versionNumbers[1] > 18);
        } else {
          console.error('Could not find lemmy version');
        }
        return true;
      }

      // https://stackoverflow.com/questions/18177174/how-to-limit-handling-of-event-to-once-per-x-seconds-with-jquery-javascript
      function throttle(func, interval) {
        var lastCall = 0;
        var nextCall = -1;
        return function() {
            var now = Date.now();
            clearTimeout(nextCall);
            if (lastCall + interval < now) {
                lastCall = now;
                func.apply(this, arguments);
            } else {
              nextCall = setTimeout(function() {
                lastCall = Date.now();
                func.apply(this, arguments);
              }, interval);
            }
        };
      }

      const isVer0181 = isVersion0181();
      const targetNode = document.getElementById('app');
      const config = { attributes: false, childList: true, subtree: true };
      let observer = null;
      const callback = throttle(function(mutationsList) {
        if(observer != null) {
          observer.disconnect();
        }

        setTimeout(function() {
          let selector = '.post-listing a.text-body svg.icon use';
          if(isVer0181) {
            selector = '.post-listing button.thumbnail svg.icon use';
          }

          let postList = [];
          let linkList = [];
          document.querySelectorAll(selector).forEach(function(postIcon) {
            const imgPreview = postIcon.parentElement.parentElement;
            if(postIcon.getAttribute('xlink:href').endsWith("symbols.svg#icon-image")) {
              postList.push(imgPreview);
            } else if(postIcon.getAttribute('xlink:href').endsWith("symbols.svg#icon-external-link")) {
              linkList.push(imgPreview.parentElement);
            }
          });

          let uniqueList = postList;
          if(!isVer0181) {
            uniqueList = postList.reduce((unique, o) => {
              if(!unique.some(obj => obj.getAttribute('href') === o.getAttribute('href'))) {
                unique.push(o);
              }
              return unique;
            },[]);
          }

          uniqueList.forEach(function(imgPreview) {
            const postListing = imgPreview.closest(".post-listing");
            const isExpanded = postListing.querySelector('.img-expanded') != null;
            const isNsfw = postListing.querySelector('.thumbnail.img-blur') != null;
            if(!isExpanded && !isNsfw) {
              imgPreview.click();
            }
            //console.log('UElement: ' + imgPreview + ' Exp: ' + isExpanded);
          });
          // Open links in new tab
          /*linkList.forEach(function(link) {
            link.setAttribute('target', '_blank');
          });*/

          setTimeout(function() {
            observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
          }, 500);
        }, 500);
      }, 1000);

      setTimeout(function() {
        callback([]);
      }, 500);
    }
})();
