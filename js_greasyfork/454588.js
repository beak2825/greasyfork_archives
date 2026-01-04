// ==UserScript==
// @name        Bilibili Remove Video Tracker
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/video/*
// @grant       none
// @version     1.1
// @author      yufu
// @description Remove tracker parameter in video link to make a:visited works
// @run-at      document-idle
// @license MIT
// @icon         https://icons.duckduckgo.com/ip3/bilibili.com.ico
// @downloadURL https://update.greasyfork.org/scripts/454588/Bilibili%20Remove%20Video%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/454588/Bilibili%20Remove%20Video%20Tracker.meta.js
// ==/UserScript==



(function() {
    'use strict';

    let size = 12;

    let query = '.info > a';


    let counter = 0;

    // https://stackoverflow.com/a/16941754
    function removeParam(key, sourceURL) {
        var rtn = sourceURL.split("?")[0],
            param,
            params_arr = [],
            queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
        if (queryString !== "") {
            params_arr = queryString.split("&");
            for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                param = params_arr[i].split("=")[0];
                if (param === key) {
                    params_arr.splice(i, 1);
                }
            }
            if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
        }
        return rtn;
    }

    function doOne(link) {
          let url = link.href;
          let clean_url = removeParam('spm_id_from',url);
          if (url === clean_url) return;
          link.href =  clean_url;

    }
    function doit() {
      for (let link of document.querySelectorAll(query)) {
         doOne(link);
      }
    }

     // dynamically loaded <a> tag for Autopage
    function aObserver() {
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
              if (mutation.type === 'attributes' && mutation.attributeName == 'href'){
                let target = mutation.target;
                console.log(mutation.attributeName, (mutation.attributeName == 'href'));
                if (target.tagName === 'A') {
                          doOne(target);
                }

              }else {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) return
                    if (target.tagName === 'A') {
                          doOne(target);
                    } else {
                      for (let link of document.querySelectorAll(query)) {
                           doOne(link);
                      }
                      break;
                    }
                }
                break;
              }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(document, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['href']
        });
    }

    doit();
    aObserver();

})();



