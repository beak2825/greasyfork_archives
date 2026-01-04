// ==UserScript==
// @name         DMZJ Auto Loader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Load successive pages
// @author       Siyuan
// @include      /^http(s)?://q\.dmzj\.com/[0-9]+/[0-9]+/[0-9]+.shtml/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367746/DMZJ%20Auto%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/367746/DMZJ%20Auto%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var dom = document.getElementById("chapter_contents_first");
    var idx = g_chapter_page - 1;
    var data = g_chapter_pages_url;

    var load_completed = function() {
        var eles = [];
        eles.push(document.getElementById("control_block"));
        eles.push(document.getElementById("page_num_title").parentNode);
        eles.push(document.getElementById("jump_select"));

        for (var i = 0; i < eles.length; i++) {
            var ele = eles[i];
            ele.parentNode.removeChild(ele);
        }
    };

    var load_next = function(page) {
        var url = data[page];
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    dom.innerHTML += this.responseText;
                    if (page + 1 < data.length) {
                        load_next(page + 1);
                    } else{
                        load_completed();
                    }
                } else {
                    console.log("Load page failed, " + url);
                }
            }
        };
        console.log("Try load page, " + url);
        xhttp.open("GET", url, true);
        xhttp.send();
    };

    load_next(idx + 1);
})();
