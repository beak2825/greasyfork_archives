// ==UserScript==
// @name         Geoserver fast preview shortcut
// @namespace    http://tommynanny.com/
// @version      0.1
// @description  with this addon, you could go to preview of the layer with a click of a button
// @author       tommynanny
// @match        http://localhost:8080/geoserver/web/wicket/bookmarkable/org.geoserver.web.data.resource.ResourceConfigurationPage?*&name=*&wsName=*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @icon         https://icons.duckduckgo.com/ip2/geoserver.org.ico
// @require      https://greasyfork.org/scripts/47911-font-awesome-all-js/code/Font-awesome%20AllJs.js?version=275337
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441667/Geoserver%20fast%20preview%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/441667/Geoserver%20fast%20preview%20shortcut.meta.js
// ==/UserScript==
(function() {
    'use strict';

    $(document).ready(function() {

        var tabgroup = $($("li.tab0")[0]).parent();
        tabgroup.append($("<li id='layer-view-li'></li>"));
        var li = tabgroup.find("#layer-view-li");
        li.append($("<a id='layer-preview'> <span>Layer Preview  <i class='fa'>&#xf279;</i></span> </a>"));

        var preview_button = li.find('#layer-preview');
        preview_button.css("background-color","#94f7f2");

        preview_button.on("click", function() {
            var wsName = getUrlParameter("wsName");
            var layerName = getUrlParameter("name");

            var latLongBoundingBox = $("#latLonBoundingBox");
            var minX = latLongBoundingBox.find("#minX").val();
            var minY = latLongBoundingBox.find("#minY").val();
            var maxX = latLongBoundingBox.find("#maxX").val();
            var maxY = latLongBoundingBox.find("#maxY").val();

            var result = "http://localhost:8080/geoserver/" + wsName + "/wms?service=WMS&version=1.1.0&request=GetMap&layers=" +  wsName + "%3A" + layerName + "&bbox=" + minX + "%2C" + minY + "%2C" + maxX + "%2C" + maxY + "&width=768&height=702&srs=EPSG%3A4326&format=application/openlayers"
            var win = window.open(result, '_blank');
            return
        })
    });
})();

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};