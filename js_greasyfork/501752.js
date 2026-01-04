// ==UserScript==
// @name         JiraCloudNoPlansTab
// @namespace    http://wimgodden.be/
// @version      1.3
// @description  Remove the "Plans" menu in the header of Jira Cloud
// @author       Wim Godden <wim@cu.be>
// @match        https://*.atlassian.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501752/JiraCloudNoPlansTab.user.js
// @updateURL https://update.greasyfork.org/scripts/501752/JiraCloudNoPlansTab.meta.js
// ==/UserScript==


add_jQuery (removeCouldPlansTab, "1.7.2");

function add_jQuery (callbackFn, jqVersion) {
    jqVersion = jqVersion || "1.7.2";
    var D = document;
    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    var scriptNode = D.createElement ('script');
    scriptNode.src = 'https://ajax.googleapis.com/ajax/libs/jquery/'
                    + jqVersion
                    + '/jquery.min.js'
                    ;
    scriptNode.addEventListener ("load", function () {
        var scriptNode = D.createElement ("script");
        scriptNode.textContent =
            'var gm_jQuery  = jQuery.noConflict (true);\n'
            + '(' + callbackFn.toString () + ')(gm_jQuery);'
        ;
        targ.appendChild (scriptNode);
    }, false);
    targ.appendChild (scriptNode);

    setTimeout(function() {
        removeCouldPlansTab(gm_jQuery);
    }, 2000); // A second will elapse and Code will execute.
}

function removeCouldPlansTab($) {
    'use strict';

    $("div div div div div button span:contains('Plans')").parent().parent().parent().parent().parent().hide();
}