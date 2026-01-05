// ==UserScript==
// @name         Injected <3
// @namespace    greasyfork.org
// @version      2.0.0
// @description  InjectedExtension by ZBC
// @author       ZBC
// @license      A
// @description  Injected Extension
// @match        http://agar.io/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/17561/Injected%20%3C3.user.js
// @updateURL https://update.greasyfork.org/scripts/17561/Injected%20%3C3.meta.js
// ==/UserScript==

function loadScript(a, b) {
    var c = document.getElementsByTagName("head")[0], d = document.createElement("script");
    d.type = "text/javascript", d.src = a, d.onload = b, c.appendChild(d);
        $("h2").replaceWith('<h2>  Best Extension Ever </h2>');

    var rd = $("center").replaceWith('<div align="middle" id="Radio" class="RadioClass" style="display: block;"><audio style="margin-middle: 3px" controls="" autoplay="" src="http://192.99.0.170:5529/;"><a href="music.html" target="radio" align="middle">');
    var ig = $("head").append('<link rel="shortcut icon" href="http://www.rebarlabs.com/wp-content/uploads/2015/12/icon694.png">');
    var tt = $("div#mainPanel.agario-panel").prepend('<h2 id="?Injected?" style="color:#09B4ED; text-align:center; font-size: 60px"><b>?ɪɳȷ?</b></h2><sup><h4 id="ZBC22Subtitle" style="text-align:right">  By ZBC</h4></sup>');
    var te = $("title").replaceWith('<title>ɪɳȷ</title>');
}

function receiveMessage(a) {
    if ("http://agar.io" == a.origin && a.data.action) {
        var b = unsafeWindow.Action;
        a.data.action == b.COPY && GM_setClipboard(a.data.data), a.data.action == b.IMAGE && downloadResource(a.data.data, unsafeWindow.handleResource);
                        // Load the clan tag list, private server list, agar party list, etc.

    }
}

function downloadResource(a, b) {
    GM_xmlhttpRequest({
        method: "GET",
        url: a,
        responseType: "blob",
        onload: function(c) {
            200 === c.status ? b(a, window.URL.createObjectURL(c.response)) : console.log("res.status=" + c.status);
        },
        onerror: function(a) {
            console.log("GM_xmlhttpRequest error! "), b(null);
        }
    });
}

var VERSION = "2.0.0", $,
    URL_JQUERY = "http://code.jquery.com/jquery-1.11.3.min.js",
    URL_BOOTSTRAP = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js",
    URL_SOCKET_IO = "https://cdn.socket.io/socket.io-1.3.5.js",
    URL_FACEBOOK = "http://connect.facebook.net/en_US/sdk.js",
    URL_MAIN_OUT = "http://scastshow.com/v2min.js",
    URL_CSS_FILE = "http://scastshow.com/v2.css";

window.stop(), document.documentElement.innerHTML = null, "agar.io" == location.host && "/" == location.pathname && (location.href = "http://agar.io/agarplus.io" + location.hash),
    loadScript(URL_JQUERY, function() {
        $ = unsafeWindow.jQuery, $("head").append('<link href="https://fonts.googleapis.com/css?family=Ubuntu:400,300,300italic,400italic,500,500italic,700,700italic" rel="stylesheet" type="text/css">'),
            $("head").append('<link rel="stylesheet" href="http://agar.io/css/glyphicons-social.css">'),
            $("head").append('<link rel="stylesheet" href="http://agar.io/css/animate.css">'),
            $("head").append('<link rel="stylesheet" href="http://agar.io/css/bootstrap.min.css">'),
            $("head").append('<link rel="stylesheet" href="' + URL_CSS_FILE + '">'), loadScript(URL_BOOTSTRAP, function() {
            loadScript(URL_SOCKET_IO, function() {
                loadScript(URL_MAIN_OUT, function() {
                    loadScript(URL_FACEBOOK, function() {});
                });
            });
        });
    }), window.addEventListener("message", receiveMessage, !1);