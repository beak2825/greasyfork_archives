// ==UserScript==
// @name         ixueshu reader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  make ixueshu pdf more readable
// @author       Shae
// @match        https://www.ixueshu.com/document/*.html
// @match        https://www.ixueshu.com/h5/document/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407516/ixueshu%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/407516/ixueshu%20reader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (/\/h5\//.test (location.pathname) ) {
        var newURL = location.pathname.replace (/\/h5\//, "/");
        location.replace (newURL);
    }
    setTimeout(function() {
        // close top fav bar
        var fav = document.querySelector("body > div.top_collect_web");
        if (fav) {
            document.querySelector("body > div.top_collect_web > a.cw_close").click();
        }
        // close weixin band layer
        var wxband_shade = document.querySelector("#layui-layer-shade1");
        var wxband = document.querySelector("#layui-layer1");
        if (wxband) {
            var iframe = document.querySelector("#layui-layer-iframe1");
            var iframe_doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
            var wx_close = iframe_doc.querySelector("body > div > div > div.wx_close");
            wx_close.click();
        }
        // remove navbar and sidebar
        var navbar = document.querySelector("body > div:nth-child(5) > div.nav_0814");
        var sidebar = document.querySelector("#preview > div.det_right");
        navbar.parentNode.removeChild(navbar);
        sidebar.parentNode.removeChild(sidebar);
        // make container width 100%
		document.querySelector("#preview > div > div.det_left").style.width = "100%";
		document.querySelector("#preview > div.det_rel_left").style.width = "100%";
		document.querySelector("#preview > div").style.width = "100%";
		// make pdf width 100%
        var docs = document.getElementsByClassName("main");
        var doc;
        for (var i = 0; i < docs.length; i++) {
            doc = docs[i];
            doc.style.width = "100%";
            doc.style.height = "100%";
        }
        // remove elements
        // remove feedback button
        document.querySelector("body > div.suspFeedback_1").remove();
        // remove upload button
        document.querySelector("body > div:nth-child(4) > div > div > div.head_upload").remove();
        // remove ads
        var links = document.querySelectorAll("a");
        // var adpattern = new RegExp("^https://adapi.ixueshu.com/link/[0-9]+$");
        var adpattern = /^https:\/\/adapi.ixueshu.com\/link\/\d+$/;
        for (i = 0; i < links.length; i++) {
            if (adpattern.test(links[i].href)) {
                links[i].remove();
            }
        }
    }, 3000);
})();