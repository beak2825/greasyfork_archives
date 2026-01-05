// ==UserScript==
// @name         JaviExt v3.3
// @version      3.3.2
// @namespace    ...
// @description  AgarPlusV2 Edited By Javi
// @author       Agarplus.io Developers & Javi
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/17579/JaviExt%20v33.user.js
// @updateURL https://update.greasyfork.org/scripts/17579/JaviExt%20v33.meta.js
// ==/UserScript==
function loadScript(a, b) {
    var x = document.getElementsByTagName("head")[0], y = document.createElement("script");
    y.type = "text/javascript", y.src = a, y.onload = b, x.appendChild(y);
    // Original Edits By Javi
    var rd = $("center").replaceWith('<div align="middle" id="Radio" class="RadioClass" style="display: block;"><audio style="margin-middle: 3px" controls="" autoplay="" src="http://192.99.0.170:5529/;"><a href="music.html" target="radio" align="middle">');
    var lb = $("div.header").replaceWith('<div id="JaviHeader" class="header" style="color:#FFFFFF; font-size:30px;"><b>Leaderboard</b></div>');
    var fp = $("div.agario-panel.agario-side-panel.agarioProfilePanel.level.forums").replaceWith('<div class="agario-panel agario-side-panel agarioProfilePanel level forums" style="display: block !important;"<p></p></div>');
    var cp = $("div.agario-panel.agario-side-panel.agarioProfilePanel.level:nth-last-child(1)").after('<div id="JaviYtChannelPanel" class="agario-panel agario-side-panel"></div>');
    var yt = $("#JaviYtChannelPanel").append('<script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" data-channelid="UC3rD3h2k6lvF7xHWNAygmyA" data-layout="full" data-theme="dark" data-count="default" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 163px; height: 48px; background: transparent;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 163px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 48px;"></div>');
    var tt = $("div#mainPanel.agario-panel").prepend('<h2 id="JaviTitle" style="color:#09B4ED; text-align:center; font-size: 73px"><b>Javi</b></h2><sup><h4 id="JaviSubtitle" style="text-align:right">  v3.3</h4></sup>');
    var te = $("title").replaceWith('<title>Javi v3.3</title>');
    var ig = $("head").append('<link rel="shortcut icon" href="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQN6-9EjW9GDdP-RjG3sugDY8eu5g2Pg70SP6HEwnXPn3JD1I16I9_x4A">');
    var ds = $("div#profile-main").remove('');
    var ps = $("div#JaviYtChannelPanel.agario-panel.agario-side-panel").append('<hr>').append('<div id="JaviPrivateServersPanel" class="privateserverspanelclass"></div>');
    var sp = $("#JaviPrivateServersPanel").append('<select id="JaviPrivateServer" class="form-control privateServer" style="height: 35px; display: block; width: 190; float: left; margin-bottom: 10px"></select>');
    var lt = $("#JaviPrivateServer").after('<button class="btn btn-nosx joinPrivate1" style="margin-bottom: 12px" onclick="$(\'.partyToken\').val($(\'#JaviPrivateServer\').val()); connect($(\'#JaviPrivateServer\').val());">Connect</button>');
    var mv = $("#JaviPrivateServer").append('<option value="Private Servers" disabled default selected style="display: none;">Private Servers</option><option value="ws://parisgamma.iomods.com:1501">Private Party</option><option value="ws://185.38.150.94:443">W=Virus</option><option value="ws://wv1.unnamedcell.com:443">W=Virus 2</option>');
    var ss = $("head link[rel='stylesheet']").last().after("<style>.joinPrivate1 { width: 100%; background: #007AE6!important}</style>");
    var ml = $("head link[rel='stylesheet']").last().after("<style>.joinPrivate1:hover { background: #003D73!important}</style>");
    var hg = $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.focus,.btn-nosx:focus {    color: #fff;    background-color: #79822b;    border-color: #ffffff}</style>");
    var kv = $("head link[rel='stylesheet']").last().after("<style>.btn-nosx:hover {    color: #fff;    background-color: #8b9531;    border-color: #ffffff}</style>");
    var na = $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.active.focus,.btn-nosx.active:focus,.btn-nosx.active:hover,.btn-nosx:active.focus,.btn-nosx:active:focus { color: #fff; background-color: #79822b; border-color: #ffffff}</style>");
    var tk = $("head link[rel='stylesheet']").last().after("<style>.btn-nosx:active:hover,.open>.dropdown-toggle.btn-nosx.focus,.open>.dropdown-toggle.btn-nosx:focus,.open>.dropdown-toggle.btn-nosx:hover { color: #fff; background-color: #79822b; border-color: #ffffff}</style>");
    var xo = $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.active,.btn-nosx:active,.open>.dropdown-toggle.btn-nosx {    background-image: none}</style>");
    var gq = $("head link[rel='stylesheet']").last().after("<style>.btn-nosx .badge { color: #79822b; background-color: #fff}</style>");
    var mp = $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.disabled,.btn-nosx.disabled.active,.btn-nosx.disabled.focus,.btn-nosx.disabled:active,.btn-nosx.disabled:focus { background-color: #79822b; border-color: #ffffff}</style>");
    var fr = $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.disabled:hover,.btn-nosx[disabled],.btn-nosx[disabled].active,.btn-nosx[disabled].focus,.btn-nosx[disabled]:active { background-color: #79822b; border-color: #ffffff}</style>");
    var jc = $("head link[rel='stylesheet']").last().after("<style>.btn-nosx[disabled]:focus,.btn-nosx[disabled]:hover,fieldset[disabled] .btn-nosx,fieldset[disabled] .btn-nosx.active { background-color: #79822b; border-color: #ffffff}</style>");
    var yy = $("head link[rel='stylesheet']").last().after("<style>fieldset[disabled] .btn-nosx.focus,fieldset[disabled] .btn-nosx:active,fieldset[disabled] .btn-nosx:focus,fieldset[disabled] .btn-nosx:hover { background-color: #79822b; border-color: #ffffff}</style>");
}
var VERSION = "2.0.0",
    $, URL_JQUERY = "http://code.jquery.com/jquery-1.11.3.min.js",
    URL_BOOTSTRAP = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js",
    URL_SOCKET_IO = "https://cdn.socket.io/socket.io-1.3.5.js",
    URL_FACEBOOK = "http://connect.facebook.net/en_US/sdk.js",
    URL_MAIN_OUT = "http://googledrive.com/host/0B66yR_spsJnAMmxZVHZRWDU4V0E",
    URL_CSS_FILE = "http://googledrive.com/host/0B66yR_spsJnASGJHY0xfWlZSLWc";
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
