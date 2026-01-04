// ==UserScript==
// @name         Rule ID for Composite Entities Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script adds the rule id to the composite entity page for each rule.
// @author       abbelot
// @match        https://*.prod.kms.graphiq.a2z.com/app_admin/composite_entity
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      KIO
// @downloadURL https://update.greasyfork.org/scripts/493968/Rule%20ID%20for%20Composite%20Entities%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/493968/Rule%20ID%20for%20Composite%20Entities%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const infs = document.querySelectorAll(".inference-rule-row");

    for (let inf of infs) {
        let rule_id_cont = document.createElement("div")
        rule_id_cont.innerHTML = "Rule ID = " + inf.getAttribute("data-rule-id")
        inf.parentNode.insertBefore(rule_id_cont,inf)
    }


})();