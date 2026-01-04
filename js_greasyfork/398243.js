// ==UserScript==
// @name              Intel Maps Link Provider
// @name:zh-CN        Ingress Intel地图链接工具
// @name:zh-TW        Ingress Intel地圖連接工具
// @namespace         http://cyblocker.com/
// @version           0.9
// @description       Provide Ingress Intel map link to the coordinate information on Wikipedia and Geohack.
// @description:zh-CN 在维基百科及其链接到的Geohack网站上提供Ingress Intel的地图链接
// @description:zh-TW 在維基百科及其連接到的Geohack上提供Ingress Intel地圖連接
// @author            cyblocker
// @match             https://tools.wmflabs.org/geohack/*
// @match             https://geohack.toolforge.org/*
// @match             https://*.wikipedia.org/wiki/*
// @require           https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @supportURL        https://github.com/cyblocker/Intel-Map-Provider/issues
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/398243/Intel%20Maps%20Link%20Provider.user.js
// @updateURL https://update.greasyfork.org/scripts/398243/Intel%20Maps%20Link%20Provider.meta.js
// ==/UserScript==

(function () {

    'use strict';

    const GEOHACK_URL_FORMAT = /geohack.toolforge.org\/geohack.php?/i;
    const OLD_GEOHACK_URL_FORMAT = /tools.wmflabs.org\/geohack\/geohack.php?/i;
    const WIKIPEDIA_URL_FORMAT = /wikipedia.org\/wiki/i;
    const GELHACK_DOM_PREFIX = "a[href*='geohack.toolforge.org\/geohack.php?']";
    const OLD_GELHACK_DOM_PREFIX = "a[href*='tools.wmflabs.org\/geohack\/geohack.php?']";

    const INTEL_URL_PREFIX = "https://intel.ingress.com/intel?ll=";

    function convertGeoUrlParams(input) {
        var parts = input.split("_");
        var i = 0;
        var latitude = 0;
        var devider = 1;
        for (; i < parts.length; i++) {
            if (parts[i] != "S" && parts[i] != "N") {
                latitude = latitude + parts[i] / devider;
                devider = devider * 60;
            } else {
                if (parts[i] == "S") latitude = latitude * -1;
                break;
            }
        }
        var longitude = 0;
        devider = 1;
        for (i = i + 1; i < parts.length; i++) {
            if (parts[i] != "W" && parts[i] != "E") {
                longitude = longitude + parts[i] / devider;
                devider = devider * 60;
            } else {
                if (parts[i] == "W") longitude = longitude * -1;
                break;
            }
        }
        return latitude.toFixed(6) + "," + longitude.toFixed(6);
    }

    function getIntelUrl() {
        var geoUrl;
        if (GEOHACK_URL_FORMAT.test(document.URL)) {
            geoUrl = document.URL;
        } else if (GEOHACK_URL_FORMAT.test(document.body.innerHTML)){
            geoUrl = $(GELHACK_DOM_PREFIX).attr("href");
        } else {
            geoUrl = $(OLD_GELHACK_DOM_PREFIX).attr("href");
        }
        var geoParams = /[&?]params=[0-9NSWE_.]+/.exec(geoUrl)[0].slice(8);
        var intelUrl = INTEL_URL_PREFIX + convertGeoUrlParams(geoParams);
        return intelUrl;
    }

    function getWikiLinkItem(url) {
        var linkItem = document.createElement("a");
        linkItem.setAttribute("href", url);
        linkItem.setAttribute("target", "_blank");
        linkItem.innerHTML = '<img width="17" title="Ingress Intel Map" src="https://upload.wikimedia.org/wikipedia/commons/6/63/Ingress_Logo.png">';
        return linkItem;
    }

    if (GEOHACK_URL_FORMAT.test(document.URL) || OLD_GEOHACK_URL_FORMAT.test(document.URL)) {

        // Find correct location and insert
        if ($("#GEOTEMPLATE-GLOBAL").length != 0) {
            var mapName = "Map";
            if (/language=zh-yue/.test(document.URL)) {
                mapName = "地圖";
            } else if (/language=ja/.test(document.URL)) {
                mapName = "地図";
            } else if (/language=zh/.test(document.URL)) {
                mapName = "地图";
            }
            var tableNode = document.getElementById("GEOTEMPLATE-GLOBAL").getElementsByTagName("tbody")[0];
            // Emsamble the table
            var insertItem = document.createElement("tr");
            var serviceName = document.createElement("th");
            serviceName.innerHTML = '<img width="16" alt="Ingress Logo" src="https://upload.wikimedia.org/wikipedia/commons/6/63/Ingress_Logo.png"> Ingress Intel Map';
            serviceName.setAttribute("scope", "row");
            serviceName.setAttribute("style", "font-weight:normal; text-align:left;");
            insertItem.appendChild(serviceName);
            var mapLink = document.createElement("td");
            mapLink.innerHTML = '<a href="' + getIntelUrl() + '" target = "_blank">' + mapName + '</a>';
            insertItem.appendChild(mapLink);
            var emptyTd = document.createElement("td");
            insertItem.appendChild(emptyTd);
            insertItem.appendChild(emptyTd);
            var firstItemNode = tableNode.getElementsByTagName("tr")[1];
            tableNode.insertBefore(insertItem, firstItemNode);
        }
        $("a[href^=geo]").after(getWikiLinkItem(getIntelUrl()));
    }

    if (WIKIPEDIA_URL_FORMAT.test(document.URL)) {
        if (GEOHACK_URL_FORMAT.test(document.body.innerHTML) == false && OLD_GEOHACK_URL_FORMAT.test(document.body.innerHTML) == false) {
            // Try to parse the internal map element, if possible.
            $(document).one( "mousemove", "a[href*='\/maplink\/']", function(){
                var wikiMapLink = $("a[href*='\/maplink\/']");
                if (wikiMapLink.length == 0) return;
                if (!(wikiMapLink.attr("data-lat") && wikiMapLink.attr("data-lon"))) return;
                var url = INTEL_URL_PREFIX + wikiMapLink.attr("data-lat") + "," + wikiMapLink.attr("data-lon");
                wikiMapLink.parent().before(getWikiLinkItem(url));
            });
        }
        $(GELHACK_DOM_PREFIX).before(getWikiLinkItem(getIntelUrl()));
        $(OLD_GELHACK_DOM_PREFIX).before(getWikiLinkItem(getIntelUrl()));
    }

})();
