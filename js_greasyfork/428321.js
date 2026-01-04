// ==UserScript==
// @name         Relive GPX downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Relive Relive.cc GPX file downloader
// @author       UrSuS
// @match        https://www.relive.cc/view/*
// @icon         https://www.google.com/s2/favicons?domain=relive.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428321/Relive%20GPX%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/428321/Relive%20GPX%20downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';

    if (typeof positions !== "undefined") {


        var customButton = L.Control.extend({

            options: {
                position: 'topleft'
            },

            onAdd: function(map) {
                var container = L.DomUtil.create('input');
                container.type = "button";
                container.title = "Download .GPX";
                container.value = "GPX";

                container.style.backgroundColor = 'white';
                container.style.backgroundSize = "30px 30px";
                container.style.width = '50px';
                container.style.height = '30px';

                container.onmouseover = function() {
                    container.style.backgroundColor = 'pink';
                }
                container.onmouseout = function() {
                    container.style.backgroundColor = 'white';
                }

                container.onclick = function() {
                    downloadGpxFile();
                }

                return container;
            }
        });

        map.addControl(new customButton());

        let gpxString = '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="runtracker"><metadata/>';
        gpxString += '<trk><trkseg>';
        positions.forEach(createTrkptString);
        gpxString += '</trkseg></trk></gpx>';

        function createTrkptString(item, index) {
            let segmentTag = '<trkpt lat="' + item[0] + '" lon="' + item[1] + '"></trkpt>';
            gpxString += segmentTag;
        }

        function downloadGpxFile() {

            let trackInfo = document.getElementsByClassName("titles")[0];
            let trackTitle = trackInfo.getElementsByTagName("H2")[0].innerHTML;
            let trackDetails = trackInfo.getElementsByTagName("SPAN");
            let fileName = trackTitle + " " + trackDetails[0].innerHTML + trackDetails[1].innerHTML;
            let fileName2 = fileName.replaceAll(" • ", " ").trim();
            let fileName3 = fileName2.replaceAll(" ", "_") + ".gpx";

            const xml = gpxString;
            const url = 'data:text/json;charset=utf-8,' + xml;
            const link = document.createElement('a');
            link.download = fileName3;
            link.href = url;
            document.body.appendChild(link);
            link.click();

        };
    }
})();