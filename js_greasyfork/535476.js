// ==UserScript==
// @name        1-click Pipeline to Cloudwatch
// @version     1.0
// @description Iterates through child elements of liveDataSamplesDiv
// @author      Syed Shuaib Zaidi (zidisz@)
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @include     https://pipelines.amazon.com/*
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1467838
// @downloadURL https://update.greasyfork.org/scripts/535476/1-click%20Pipeline%20to%20Cloudwatch.user.js
// @updateURL https://update.greasyfork.org/scripts/535476/1-click%20Pipeline%20to%20Cloudwatch.meta.js
// ==/UserScript==


$(document).ready(function() {
    'use strict';

    // Select all divs with class naws-detail and title AWS Account
    const awsAccountDivs = document.querySelectorAll('div.naws-detail[title="AWS Account"]');

    awsAccountDivs.forEach(div => {
        const originalLink = div.querySelector('a');
        originalLink.className = "button";
        originalLink.title = "Conduit";

        // Create a fresh div
        const cwDashboardLink = document.createElement('div');
        cwDashboardLink.className = 'naws-detail';
        cwDashboardLink.title = 'Dashboard link';

        // Create a hyperlink for the account
        const hyperlink1 = document.createElement('a');
        hyperlink1.className = "button";
        hyperlink1.href = "https://cw-dashboards.aka.amazon.com/cloudwatch/dashboardInternal?accountId=" + div.textContent.trim();
        hyperlink1.textContent = 'Dashboard link';
        hyperlink1.style.marginLeft = '10px';

        // Append the hyperlink to the new div
        cwDashboardLink.appendChild(hyperlink1);

        // Insert the cloned div after the original
        div.parentNode.insertBefore(cwDashboardLink, div.nextSibling);

        // Create a fresh div
        const cwMetricsLink = document.createElement('div');
        cwMetricsLink.className = 'naws-detail';
        cwMetricsLink.title = 'Metrics link';

        // Create a hyperlink for the account
        const hyperlink2 = document.createElement('a');
        hyperlink2.className = "button";
        hyperlink2.href = "https://cw-dashboards.aka.amazon.com/?accountId=" + div.textContent.trim() + "#metricsV2" ;
        hyperlink2.textContent = 'Metrics link';
        hyperlink2.style.marginLeft = '10px';

        // Append the hyperlink to the new div
        cwMetricsLink.appendChild(hyperlink2);

        // Insert the cloned div after the original
        div.parentNode.insertBefore(cwMetricsLink, div.nextSibling);
    });
})();
