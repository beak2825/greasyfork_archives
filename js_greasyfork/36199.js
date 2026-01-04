// ==UserScript==
// @name         pokehuntr_auto-refresh
// @namespace    niu541412
// @version      0.63
// @icon         http://img.informer.com/icons_mac/png/128/400/400605.png
// @description  refresh pokehuntr map
// @author       niu541412@gmail.com
// @license      MIT License
// @match        *://*.pokehuntr.com/*
// @match        *://*.gymhuntr.com/*
// @match        *://*.pokefetch.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/36199/pokehuntr_auto-refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/36199/pokehuntr_auto-refresh.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //full screen button
    document.getElementsByClassName("controls")[0].insertAdjacentHTML('beforeend', '<button id="fullscreen" class="botton button-circle" title="Toggle fullscreen" onclick="toggleFullScreen()"><span class="inner"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAAAUklEQVR4AWOgGhgF/8HwPIrYeYgoIU0OKGIOxGm6jyJ2n5Cm8wwOQEUGKGIGQBEHoAwB0AA0FwEbSAgOBBwWmggHBOVBTjhyKU9GhBMslcAoAABPu2Hh6JIyeQAAAABJRU5ErkJggg==" style="opacity:0.6;"></span></button>');
    document.getElementById('fullscreen').addEventListener('click', toggleFullScreen, false);
    //full screen, from mozilla.org
    function toggleFullScreen() {
        var doc = window.document;
        var docEl = doc.documentElement;

        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        } else {
            cancelFullScreen.call(doc);
        }
    }

    var place = location.hash.match(/[-]*[0-9]*\.[0-9]*/g);
    var lttd_ctr = parseFloat(place[0]);
    var lgtd_ctr = parseFloat(place[1]);
    var ofst = 0.005;
    var num_of_side = 5; // scanning_region_num = num_of_side^2, if you want to change the scanning size, modify this parameter, one sacnning_region is about 0.5 km^2.

    function scan(lttd, lgtd, index) {
        setTimeout(function() {
            var frame = document.createElement("iframe");
            frame.src = "https://pokehuntr.com/#" + lttd + "," + lgtd;
            frame.style.visibility = "hidden";
            //frame.style.position = "fixed";
            frame.id = "Y" + lttd + "X" + lgtd;
            document.body.appendChild(frame);
            setTimeout(function() {
                //console.log(document.getElementById(frame.id).contentWindow.document.location.href);
                document.getElementById(frame.id).contentWindow.document.getElementById("scan").click();
                document.body.removeChild(document.getElementById(frame.id));
            }, 2000 + (Math.random() * 2 - 1) * 10);
        }, 10000 * index);
    }

    function scan_region(lttd_ctr, lgtd_ctr, num) {
        var index = 0;
        var n = (num - 1) / 2;
        for (var i = -n; i <= n; i++) {
            for (var j = -n; j <= n; j++) {
                var lttd = lttd_ctr + ofst * (i + (Math.random() * 2 - 1) / 1000);
                var lgtd = lgtd_ctr + ofst * (j + (Math.random() * 2 - 1) / 1000);
                scan(lttd, lgtd, index);
                index++;
            }
        }
    }

    document.getElementsByClassName("leaflet-control-attribution leaflet-control")[0].style.visibility = "hidden";
    document.getElementsByClassName("scan")[0].style.visibility = "hidden";
    document.getElementById("search").style.display = "none";
    if (document.domain == "pokehuntr.com") {
        scan_region(lttd_ctr, lgtd_ctr, num_of_side);
        setInterval(function() {
            //console.log(new Date());
            scan_region(lttd_ctr, lgtd_ctr, num_of_side);
        }, 420000);
    } else if (document.domain == "pokefetch.com") {
        document.querySelectorAll('a.button.button-circle')[0].style.display = "none";
    }
})();