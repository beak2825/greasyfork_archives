// ==UserScript==
// @name          freeroms.com fast downloader
// @namespace     freeroms.com fast downloader
// @match         *://*.freeroms.com/*
// @version       0.2
// @description   Ignore download wait time
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwklEQVQ4jaWTzWpTYRCGnznnJCe2sdWgUDVRF6HgrqX4uxDBa+gVCOLSC3Dj0gsIFHoD4k0UFbWt4KL4R9E2arD+NbZN05zzfefMuEgsuD0OzGZm3nfmHWaES62nQJ1i1okwrSOcLwQ3iLC8YPO/BGRgxTkiNENEaJ6tUZuo/JPc3u1TSteZPDI4jGV5yPrPE+wllRGBeaIg5M78DNfnzpGk2WHx0vJ7Gt0FLjY+kWQlBKMc5iy8uELr+dURQe6xQBGMl687LD5aJbehpoN+j/vXHCsf67SWL1MOlXs3ljgz9hsxj+lIAqokzoEYMxemqMQlzIwnK28hVcaDjJv1D1RLjpNBH0sN1IMKkZhH8oDe/gFCTGOqSnUsJldlPBZIlW4acyreZX76HZt7kzzeqINmiI12gAV47/j2Y8Diw2fYSEKgDk4r+/2Q1toszco2Lg9Z26oNJwCC4SgZmGGmpMmAZDD0PHOIU8Qpnb0KD1bnaJR3uT39ilgSUE8ox2fvgh5zzvP5yy+2vnfBcjAFlIELedOt0e5V+dofY2NnAq/Q7h0l8bIj0ry1+R+n3I7Ag0khPBgRqgXBQ4sw7RR/Bun8AQPO4LhIclb6AAAAAElFTkSuQmCC
// @author        mickey90427 <mickey90427@naver.com>
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/477168/freeromscom%20fast%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/477168/freeromscom%20fast%20downloader.meta.js
// ==/UserScript==


(function() {
    'use strict';

    window.onload = function() {
        var downloadLinks = document.querySelectorAll('.rom-tr.download');
        downloadLinks.forEach(function(link) {
            var originalText = link.querySelector('span').textContent;
            if (originalText === 'Download') { // 원하는 텍스트로 변경
                link.querySelector('span').textContent = 'Fast Download';
            }

            link.addEventListener('click', function(e) {
                e.preventDefault();
                var href = link.getAttribute('href');
                var redirectUrl = extractRedirectUrl(href);
                if (redirectUrl) {
                    openInNewTab(redirectUrl);
                } else {
                    alert('No redirect URL found.');
                }
            });
        });
    };

    function extractRedirectUrl(href) {
        var matches = href.match(/&redirectUrl=([^&]+)/);
        if (matches && matches.length >= 2) {
            return matches[1];
        } else {
            return null;
        }
    }

    function openInNewTab(url) {
        var newTab = window.open(url, '_blank');
        newTab.focus();
    }
})();