// ==UserScript==
// @name         Exhentai MPV Auto Load
// @namespace    http://mhycy.me/
// @version      0.1
// @description  Auto load all image from exhentai at mpv mode
// @author       mhycy
// @match        *://exhentai.org/mpv/*/*
// @icon         https://e-hentai.org/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437606/Exhentai%20MPV%20Auto%20Load.user.js
// @updateURL https://update.greasyfork.org/scripts/437606/Exhentai%20MPV%20Auto%20Load.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var MAX_REQUEST_PER_SECOND = 20;

    var hook_load_image = function(max_request_per_second) {
        var old_function = window.load_image;

        window.load_image = function(c) {
            console.log(c);
            console.log(imagelist[c - 1]);
            if (imagelist[c - 1].i != undefined) {
                var d = '<a href="#page' + (c + 1) + '"><img id="imgsrc_' + c + '" src="' + imagelist[c - 1].i + '" title="' + imagelist[c - 1].n + '" style="margin:0; width:' + imagelist[c - 1].xres + "px; height:" + imagelist[c - 1].yres + 'px"' + (imagelist[c - 1].reloaded == undefined ? ' onerror="this.onerror=null; action_reload(' + c + ')"' : "") + ' /></a> <div class="mi1"> 	<div class="mi2"> 		' + (imagelist[c - 1].o == "org" ? '<img style="cursor:default; opacity:0.5" title="Original Image" src="' + img_url + 'mpvd.png" />' : '<img title="' + imagelist[c - 1].o + '" onclick="action_fullimg(' + c + ')" src="' + img_url + 'mpvd.png" />') + ' 		<img title="Reload broken image" onclick="action_reload(' + c + ')" src="' + img_url + 'mpvr.png" /> 	</div> 	<div class="mi3"> 		<a href="' + base_url + imagelist[c - 1].lo + '" target="_ehshow_' + gid + "_" + c + '"><img title="Open image in normal viewer" onclick="action_open(' + c + ')" src="' + img_url + 'mpvn.png" /></a> 		<img title="Show galleries with this image" onclick="action_search(' + c + ')" src="' + img_url + 'mpvs.png" /> 		<img title="Get forum link to image" onclick="action_link(' + c + ')" src="' + img_url + 'mpvl.png" /> 	</div> 	<div class="mi4">' + imagelist[c - 1].d + " :: " + imagelist[c - 1].n + '</div> 	<div style="clear:both"></div> </div>';
                document.getElementById("image_" + c).innerHTML = d;
                rescale_image(c, document.getElementById("imgsrc_" + c))
            } else {
                if (imagelist[c - 1].xhr != undefined) {
                    return
                }
                imagelist[c - 1].xhr = new XMLHttpRequest();
                var b = Date.now();
                if (b < next_possible_request) {
                    var a = next_possible_request - b;
                    setTimeout(function() {
                        preload_image(c)
                    }, a)
                } else {
                    preload_image(c)
                }
                next_possible_request = Math.max(b, next_possible_request) + Math.floor(1000 / max_request_per_second)
            }
        }.bind(window)
    }.bind(window);

    var hook_load_all = function () {
        for (let i = 1; i < imagelist.length; i++) {
            load_image(i);
        }
    }.bind(window);

    var hook_test = function() {
        console.log(imagelist.length);
    }.bind(window);

    hook_load_image(MAX_REQUEST_PER_SECOND);
    setTimeout(hook_load_all, 0);

})();