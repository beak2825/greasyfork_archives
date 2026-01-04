// ==UserScript==
// @name        d3.ru fixer 
// @namespace   d3.ru
// @match       https://*.d3.ru/*
// @match       https://d3.ru/*
// @grant       none
// @version     1.1
// @author      Sergey Stolyarov <sergei@regolit.com>
// @description Disable links, right-click them to open
// @downloadURL https://update.greasyfork.org/scripts/416826/d3ru%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/416826/d3ru%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    var linksNumber = 0;
  
    function linkHandler(evt, href) {
        if (/^javascript:/.test(href)) {
            return true;
        }
        return true;
    }
  
    function loader() {
        // check is site loaded
        var links = document.getElementsByTagName('a');
        if (links.length > linksNumber) {
            for (var l of links) {
                const href = l.href;
                l.onclick = function(evt) {
                    return linkHandler(evt, href);
                };
                if (!/^javascript:/.test(href)) {
                    l.target = '_blank';
                }
          }
          linksNumber = links.length;
        };
        setTimeout(loader, 1000);
    }
    loader();
})();