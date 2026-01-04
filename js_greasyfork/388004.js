// ==UserScript==
// @name         Modify AWS console service names
// @namespace    https://greasyfork.org/en/users/321441-david-cuthbert
// @version      0.2
// @description  Modify the AWS service names to not include "Amazon" or "AWS"
// @author       David Cuthbert (dacut@kanga.org)
// @match        https://*.console.aws.amazon.com/*
// @grant        none
// @run-at       document-body
// @require      http://code.jquery.com/jquery-3.4.1.slim.min.js
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/388004/Modify%20AWS%20console%20service%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/388004/Modify%20AWS%20console%20service%20names.meta.js
// ==/UserScript==

/* global jQuery */

(function() {
    'use strict';
    let mezz_data = jQuery("meta[name='awsc-mezz-data']");
    if (! mezz_data) {
        console.log("meta tag with name=\"awsc-mezz-data\" not found");
        return;
    }

    let content = JSON.parse(mezz_data.attr("content"));
    for (let service of content.services) {
        if (! service.label) { continue; }
        if (service.label.startsWith("AWS ")) {
            service.label = service.label.substring(4);
        } else if (service.label.startsWith("Amazon ")) {
            service.label = service.label.substring(7);
        }
    }

    mezz_data.attr("content", JSON.stringify(content));
})();
