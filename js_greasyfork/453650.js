// ==UserScript==
// @name         Display Kepler Versionsets in Code homepage
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Displays kepler's versionsets in the code homepage
// @author       You
// @match        https://code.amazon.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/453650/Display%20Kepler%20Versionsets%20in%20Code%20homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/453650/Display%20Kepler%20Versionsets%20in%20Code%20homepage.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

$(document).ready(function() {
    setTimeout(function() {
        const pipelineChanges = $(".track_changes.panel.panel-default")[0]
        const keplerPackages = '' +
        '<div class="panel panel-default">' +
            '<div class="panel-heading">' +
                '<h3>' +
                'Kepler Version Sets' +
               '</h3>' +
            '</div>' +
            '<div class="panel-body">' +
                '<ul class="list-unstyled">' +
                    '<li><a href="/version-sets/GalaxyAutoAssociationMetricsService">GalaxyAutoAssociationMetricsService</a></li>' +
                    '<li><a href="/version-sets/GalaxyAutoAssociationMLInference">GalaxyAutoAssociationMLInference</a></li>' +
                    '<li><a href="/version-sets/GalaxyAutoAssociationMLLab">GalaxyAutoAssociationMLLab</a></li>' +
                    '<li><a href="/version-sets/GalaxyAutoAssociationProxyService">GalaxyAutoAssociationProxyService</a></li>' +
                    '<li><a href="/version-sets/GalaxyAutoAssociationProxyServiceCanary">GalaxyAutoAssociationProxyServiceCanary</a></li></ul>' +
            '</div>' +
        '</div>'
        $(keplerPackages).insertAfter(pipelineChanges)
    }, 500);
});