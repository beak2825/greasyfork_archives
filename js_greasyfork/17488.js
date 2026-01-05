// ==UserScript==
// @name         VersedForce Clan Extension <3
// @version      1.7
// @namespace    VercedForce extension by Krayton.
// @description  VF
// @author       Agarplus.io Developers & P2W&krayton
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/17488/VersedForce%20Clan%20Extension%20%3C3.user.js
// @updateURL https://update.greasyfork.org/scripts/17488/VersedForce%20Clan%20Extension%20%3C3.meta.js
// ==/UserScript==
//This script is not by krayton it is edited by krayton and P2W for VersedForce.
//Enjoy the ext <3
function loadScript(a, b) {
    var x = document.getElementsByTagName("head")[0], y = document.createElement("script");
    y.type = "text/javascript", y.src = a, y.onload = b, x.appendChild(y);
    var rd = $("center").replaceWith('<div align="middle" id="Radio" class="RadioClass" style="display: block;"><audio style="margin-middle: 3px" controls="" autoplay="" src=""><a href="music.html" target="radio" align="middle">');
    var lb = $("div.header").replaceWith('<div id="Agar.ioHeader" class="header" style="color:#FFFFFF; font-size:32px;"><b>Leaderboard</b></div>');
    var fp = $("div.agario-panel.agario-side-panel.agarioProfilePanel.level.forums").replaceWith('<div class="agario-panel agario-side-panel agarioProfilePanel level forums" style="display: block !important;"<p></p></div>');
    var cp = $("div.agario-panel.agario-side-panel.agarioProfilePanel.level:nth-last-child(1)").after('<div id="NEL99YtChannelPanel" class="agario-panel agario-side-panel"></div>');
    var cp = $("div.agario-panel.agario-side-panel.agarioProfilePanel.level:nth-last-child(1)").after('<div id="NEL99YtChannelPanel" class="agario-panel agario-side-panel"></div>');
    $("#NEL99YtChannelPanel").append('<b>Subscribe to our members!</b><div class="nty" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 5px; vertical-align: baseline; display: inline-block; width: 250px; height: 15px; background: transparent;">');
    $("#NEL99YtChannelPanel").append('<script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" data-channelid="UCFbHuWVf6oayJAxufWCSnKg" data-layout="full" data-theme="dark" data-count="default" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 163px; height: 48px; background: transparent;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 163px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 48px;"></div>');
    $("#NEL99YtChannelPanel").append('<script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" data-channelid="UC9bvnN3ImXJEQVb-KIdoKBg" data-layout="full" data-theme="dark" data-count="default" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 163px; height: 48px; background: transparent;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 163px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 48px;"></div>');
    
    var tt = $("div#mainPanel.agario-panel").prepend('<h2 id="NEL99Title" style="color:#0700fc; text-align:center; font-size: 50px"><b>VersedForce</b></h2><sup><h4 id="NEL99Subtitle" style="text-align:right">Version 1.7</h4></sup>');
    var cp = $("div.agario-panel.agario-side-panel.agarioProfilePanel.level:nth-last-child(1)").prepend('<h3 id="NEL99text" style="color:#00ffe1; text-align: left; font-size: 30px"><b>Teamspeak </b></h2><sup><h5 id="NEL99Subtitle" style="text-align:right">Edited By P2W&Krayton</h5></sup>');
    var tt = $("div#mainPanel.agario-panel").prepend('<h2 id="NEL99text" style="color:#b92b1a; text-align: left; font-size: 20px"><b>TS3:73.13.225.28</b></h2><sup><h3 id="NEL99Subtitle" style="text-align:right">Extension by Krayton</h5></sup>');
    var ds = $("div#profile-main").replaceWith('');
}
var VERSION = "2.0.0",
    $, URL_JQUERY = "http://code.jquery.com/jquery-1.11.3.min.js",
    URL_BOOTSTRAP = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js",
    URL_SOCKET_IO = "https://cdn.socket.io/socket.io-1.3.5.js",
    URL_FACEBOOK = "http://connect.facebook.net/en_US/sdk.js",
    URL_MAIN_OUT = "http://googledrive.com/host/0B66yR_spsJnAbnpGRXN3SHczbUk",
    URL_CSS_FILE = "http://googledrive.com/host/0B66yR_spsJnAWjVJSEtVVXNlb1U";
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