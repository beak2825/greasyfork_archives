// ==UserScript==
// @name         AgarPlusV2 Edited By Javi
// @version      3.2
// @namespace    Edited AgarPlusV2 By Javi
// @description  Agarplus+Music+Interface Transparent
// @author       Javi
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/17416/AgarPlusV2%20Edited%20By%20Javi.user.js
// @updateURL https://update.greasyfork.org/scripts/17416/AgarPlusV2%20Edited%20By%20Javi.meta.js
// ==/UserScript==
function loadScript(a, b) {
    var x = document.getElementsByTagName("head")[0], y = document.createElement("script");
    y.type = "text/javascript", y.src = a, y.onload = b, x.appendChild(y);
    $("center").replaceWith('<div align="middle" id="Radio" class="RadioClass" style="display: block;"><audio style="margin-middle: 3px" controls="" autoplay="" src="http://192.99.0.170:5529/;"><a href="music.html" target="radio" align="middle">');
    $("div.header").replaceWith('<div id="Javi" class="header" style="color:#FFFFFF; font-size:35px;"><b>Top</b></div>');
    $("div.agario-panel.agario-side-panel.agarioProfilePanel.level.forums").replaceWith('<div class="agario-panel agario-side-panel agarioProfilePanel level forums" style="display: block !important;text-align:center"<p style="font-size:20px;"><b>Agarplus.io v2 Edited By Javi</b></p></div>');
    $("div.agario-panel.agario-side-panel.agarioProfilePanel.level:nth-last-child(1)").after('<div id="JaviYtChannelPanel" class="agario-panel agario-side-panel"></div>');
    $("#JaviYtChannelPanel").append('<script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" data-channelid="UC3rD3h2k6lvF7xHWNAygmyA" data-layout="full" data-theme="dark" data-count="default" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 163px; height: 48px; background: transparent;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 163px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 48px;"></div>');
}
function receiveMessage(t) {
    if ("http://agar.io" == t.origin && t.data.action) {
        var e = unsafeWindow.Action;
        t.data.action == e.COPY && GM_setClipboard(t.data.data), t.data.action == e.IMAGE && downloadResource(t.data.data, unsafeWindow.handleResource)
    }
}

function downloadResource(t, e) {
    GM_xmlhttpRequest({
        method: "GET",
        url: t,
        responseType: "blob",
        onload: function (o) {
            200 === o.status ? e(t, window.URL.createObjectURL(o.response)) : console.log("res.status=" + o.status)
        },
        onerror: function (t) {
            console.log("GM_xmlhttpRequest error! "), e(null)
        }
    })
}
var VERSION = "2.0.0",
    $, URL_JQUERY = "http://code.jquery.com/jquery-1.11.3.min.js",
    URL_BOOTSTRAP = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js",
    URL_SOCKET_IO = "https://cdn.socket.io/socket.io-1.3.5.js",
    URL_FACEBOOK = "http://connect.facebook.net/en_US/sdk.js",
    URL_MAIN_OUT = "http://googledrive.com/host/0B66yR_spsJnAOEt5OU9DU0lEYlE",
    URL_CSS_FILE = "http://googledrive.com/host/0B66yR_spsJnAcGdiZmhDTlYwN0k";
window.stop(), document.documentElement.innerHTML = null, "agar.io" == location.host && "/" == location.pathname && (location.href = "http://agar.io/agarplus.io" + location.hash), loadScript(URL_JQUERY, function () {
    $ = unsafeWindow.jQuery, $("head")
        .append('<link href="https://fonts.googleapis.com/css?family=Ubuntu:400,300,300italic,400italic,500,500italic,700,700italic" rel="stylesheet" type="text/css">'), $("head")
        .append('<link rel="stylesheet" href="http://agar.io/css/glyphicons-social.css">'), $("head")
        .append('<link rel="stylesheet" href="http://agar.io/css/animate.css">'), $("head")
        .append('<link rel="stylesheet" href="http://agar.io/css/bootstrap.min.css">'), $("head")
        .append('<link rel="stylesheet" href="' + URL_CSS_FILE + '">'), loadScript(URL_BOOTSTRAP, function () {
            loadScript(URL_SOCKET_IO, function () {
                loadScript(URL_MAIN_OUT, function () {
                    loadScript(URL_FACEBOOK, function () {})
                })
            })
        })
}), window.addEventListener("message", receiveMessage, !1);
