// ==UserScript==
// @name         Շēค๓ŧนr๖໐死 Σxէ
// @description  Agarplus.io Edited by Շŧ死?ŦųŖƂØ? | TurboCheetah
// @namespace bit.ly/TurboYT | twitch.tv/turbocheetah
// @author       TurboCheetah
// @version      2.3
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/17409/%D5%87%C4%93%E0%B8%84%E0%B9%93%C5%A7%E0%B8%99r%E0%B9%96%E0%BB%90%E6%AD%BB%20%CE%A3x%D5%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/17409/%D5%87%C4%93%E0%B8%84%E0%B9%93%C5%A7%E0%B8%99r%E0%B9%96%E0%BB%90%E6%AD%BB%20%CE%A3x%D5%A7.meta.js
// ==/UserScript==
function loadScript(a, b) {
    var x = document.getElementsByTagName("head")[0], y = document.createElement("script");
    y.type = "text/javascript", y.src = a, y.onload = b, x.appendChild(y);
    var rd = $("center").replaceWith('<div align="middle" id="Radio" class="RadioClass" style="display: block;"><audio style="margin-middle: 3px" controls="" autoplay="" src="http://192.99.0.170:5529/;"><a href="music.html" target="radio" align="middle">');
    var lb = $("div.header").replaceWith('<div id="NEL99Header" class="header" style="color:#00c9ff; font-size:35px;"><b>Շēค๓</b><style="color:#FF9100; font-size:35px;"><b>ŧนr๖໐</b></div>');
    var fp = $("div.agario-panel.agario-side-panel.agarioProfilePanel.level.forums").replaceWith('<div class="agario-panel agario-side-panel agarioProfilePanel level forums" style="display: block !important;"<p></p></div>');
    var cp = $("div.agario-panel.agario-side-panel.agarioProfilePanel.level:nth-last-child(1)").append('<hr>').after('<div id="NEL99YtChannelPanel" class="agario-panel agario-side-panel"></div>');
    var yt = $("#NEL99YtChannelPanel").append('<script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" data-channelid="UCyjEpj8QXLiQRUNgezhwX6w" data-layout="full" data-theme="dark" data-count="default" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 163px; height: 48px; background: transparent;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 163px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 48px;"></div>');
    var tt = $("div#mainPanel.agario-panel").prepend('<h2 id="NEL99Title" style="color:#00c9ff; text-align:center; font-size: 50px"><b>Շēค๓ŧนr๖໐</b></h2><sup><h4 id="NEL99Subtitle" style="color:#FF9100; text-align:right">  v2.3</h4></sup>');
    var ds = $("div#profile-main").replaceWith('');
    var te = $("title").replaceWith('<title>Շēค๓ŧนr๖໐死 Σxէ</title>');
    var tp = $("div#game_info").append('<hr>').after('<p style="text-align:right; font-size:13px"><b>Ƈσɗєɗ ву ?ŦųŖƂØ?</b></p>');
    var ps = $("div#NEL99YtChannelPanel.agario-panel.agario-side-panel").append('<hr>').append('<div id="NEL99PrivateServersPanel" class="privateserverspanelclass"></div>');
    var sp = $("#NEL99PrivateServersPanel").append('<select id="NEL99PrivateServer" class="form-control privateServer" style="height: 35px; display: block; width: 100; float: left; margin-bottom: 10px"></select>');
    var lt = $("#NEL99PrivateServer").after('<button class="btn btn-nosx joinPrivate1" style="margin-bottom: 12px" onclick="$(\'.partyToken\').val($(\'#NEL99PrivateServer\').val()); connect($(\'#NEL99PrivateServer\').val());">Connect</button>');
    var mv = $("#NEL99PrivateServer").append('<option value="Private Servers" disabled default selected style="display: none;">Private Servers</option><option value="ws://parisgamma.iomods.com:1501">Private Party</option><option value="ws://185.38.150.94:443">W=Virus</option><option value="ws://wv1.unnamedcell.com:443">W=Virus 2</option><option value="ws://dmr.secureobscure.com:4444">Instant Merge Hungergames</option><option value="ws://158.69.209.111:4800">Agario Hero</option><option value="ws://vps56296.vps.ovh.ca:443">Virus Instant Merge Reddit</option><option value="ws://58.7.166.114:443">Reddit Server 1</option><option value="ws://vps62061.vps.ovh.ca:443">Reddit Server 2</option><option value="ws://dmr.secureobscure.com:4001">Instant Merge FFA</option><option value="ws://5.189.161.247:4545">Nightbot FFA</option><option value="ws://5.189.161.247:4544">Teams</option><option value="ws://5.189.161.247:4543">Experimental</option><option value="ws://5.189.161.247:4542">Instant Reform</option><option value="ws://5.189.161.247:4541">Instant Mass</option><option value="ws://5.189.161.247:4549">Hunger Games</option><option value="ws://5.189.161.247:4548">Fighting Mode</option><option value="ws://5.189.161.247:4547">Zombie Mode</option><option value="ws://5.189.161.247:4546">1 vs 1</option><option value="ws://5.189.161.247:444">Worm Mode</option><option value="ws://5.189.161.247:4551">Rainbow Mode</option><option value="ws://5.189.161.247:4553">Instant Reform Teams</option><option value="ws://5.189.161.247:4552">Instant Mass Teams</option><option value="ws://5.189.161.247:4554">Instant Mass Experimental</option><option value="ws://5.189.161.247:4555">Instant Reform Experimental</option><option value="ws://5.189.161.247:4480">Leap Mode</option><option value="ws://5.189.161.247:4491">Murder Mode</option><option value="ws://dmr.secureobscure.com:4002">FFA</option>');
    var ss = $("head link[rel='stylesheet']").last().after("<style>.joinPrivate1 { width: 100%; background: #30ff00!important}</style>");
    var ml = $("head link[rel='stylesheet']").last().after("<style>.joinPrivate1:hover { background: #21ad00!important}</style>");
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
    URL_MAIN_OUT = "http://googledrive.com/host/0B66yR_spsJnAbnpGRXN3SHczbUk",
    URL_CSS_FILE = "http://googledrive.com/host/0B66yR_spsJnAWjVJSEtVVXNlb1U";
window.stop(), document.documentElement.innerHTML = null, "agar.io" == location.host && "/" == location.pathname && (location.href = "http://agar.io/Շŧ死" + location.hash), loadScript(URL_JQUERY, function () {
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
