// ==UserScript==
// @name         ㄒㄒx
// @version      1.0.0
// @namespace    http://dum5nomg.tk
// @description  ㄒㄒ＊ Clan Extension
// @author       Oğuz Kurt/dum5n
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/17524/%E3%84%92%E3%84%92x.user.js
// @updateURL https://update.greasyfork.org/scripts/17524/%E3%84%92%E3%84%92x.meta.js
// ==/UserScript==

function loadScript(t, e) {
    var o = document.getElementsByTagName("head")[0],
        a = document.createElement("script");
    a.type = "text/javascript", a.src = t, a.onload = e, o.appendChild(a)
    
    document.getElementsByClassName("header")[0].innerHTML = '<div class="header99" style="color: rgb(255, 255, 255);"><a href="https://www.youtube.com/channel/UC1Row7D4Dg-L654QxBBkaQw" target="_blank"><u>ㄒㄒx</a></u></div>';
    document.getElementsByClassName("agario-panel agario-side-panel agarioProfilePanel level forums")[0].innerHTML = '<a href="https://www.youtube.com/channel/UCCQmkbekDPGEYVmbiAFp0jQ" target="_blank"><h4>ㄒㄒ＊ Youtube Channel!';
    document.getElementsByTagName("center")[0].innerHTML = '<div align="middle" id="Radio" class="" style="display: block;"><audio style="margin-middle: 3px" controls="" autoplay="" src="http://192.99.0.170:5529/;"><a href="music.html" target="radio" align="middle">';
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
window.stop(), document.documentElement.innerHTML = null, "agar.io" == location.host && "/" == location.pathname && (location.href = "http://agar.io/ㄒㄒ＊" + location.hash), loadScript(URL_JQUERY, function () {
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