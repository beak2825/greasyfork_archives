// ==UserScript==
// @name                AIAA PDF Download Button
// @name:zh-CN          AIAA PDF 下载按钮
// @namespace           https://greasyfork.org/zh-CN/users/1335433
// @version             0.4
// @description         Add PDF download button based on AIAA DOI link
// @description:zh-CN   根据 AIAA DOI 链接添加 PDF 下载按钮
// @author              wakewon
// @match               https://arc.aiaa.org/*
// @include             *://arc-aiaa-org-s.*
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/500958/AIAA%20PDF%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/500958/AIAA%20PDF%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the DOI link
    var doiLink = document.querySelector('.epub-section__doi__text');
    if (doiLink) {
        var doiURL = doiLink.getAttribute('href');
        var doi = doiURL.match(/https:\/\/doi.org\/(.*)/)[1];

        // Find the "Read Now" button
        var readNowButton = document.querySelector('a[aria-label=" Read Now"]');
        if (readNowButton) {
            // Create a new "Download Now" button next to the "Read Now" button
            var downloadNowButton = document.createElement('a');
            downloadNowButton.href = '/doi/pdf/' + doi + '?download=true';
            downloadNowButton.innerText = ' Download';
            downloadNowButton.className = 'ctrl--primary ctrl';

            // Add icon to the "Download Now" button
            var icon = document.createElement('i');
            icon.className = 'icon-download';
            downloadNowButton.insertBefore(icon, downloadNowButton.firstChild);

            // Insert the "Download Now" button after the "Read Now" button
            readNowButton.parentNode.insertBefore(downloadNowButton, readNowButton.nextSibling);
        }
    }
})();
