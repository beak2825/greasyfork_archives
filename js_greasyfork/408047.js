// ==UserScript==
// @name         YHWOT (YourHackedWorldOfText)
// @namespace    http://tampermonkey.net/
// @version      69420
// @description  try to take over the world!
// @author       kmccord1
// @match        https://www.yourworldoftext.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/408047/YHWOT%20%28YourHackedWorldOfText%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408047/YHWOT%20%28YourHackedWorldOfText%29.meta.js
// ==/UserScript==

(function() {
    window.stop();
    var customHtml = `
<head>
<title>Your World of Text</title>
<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link type="text/css" rel="stylesheet" href="/static/yourworld.bbfd28df9420.css">
<link id="world-style" type="text/css" rel="stylesheet" href="/world_style.css?world=~andrew/">
<link rel="icon" type="image/png" href="/static/favicon.3875e6a87f40.png">
</head>
<body>
<div id="topbar" class="ui">
<div id="topbar_inner">
<div id="announce" class="ui-vis">
<span align="center" id="announce_text"></span>
<span id="announce_close" class="announce_close">X</span>
</div>
<span id="menu" class="ui-vis tab menu">Menu <span style="font-size:50%">▼</span></span>
</div>
</div>
<div id="nav" class="ui menu ui-vis">
<ul>
<li>
<a href="/home/" target="_blank">More...&nbsp;<img src="/static/Icon_External_Link.3df6ed389e65.png"></a>
</li>
</ul>
</div>
<div id="coords" class="ui ui-vis">
X: <span id="coord_X"></span>
Y: <span id="coord_Y"></span>
</div>
<div id="coordinate_input_modal" style="display:none" ;>
<form method="get" action="#" id="coord_input_form">
<div id="coord_input_title" style="max-width:20em">Go to coordinates:</div>
<br>
<table>
<tbody>
<tr>
<td>X: </td>
<td><input type="text" name="coord_input_X" value=""></td>
</tr>
<tr>
<td>Y: </td>
<td><input type="text" name="coord_input_Y" value=""></td>
</tr>
</tbody>
</table>
<div id="coord_input_submit"><input type="submit" value="   Go   "> or <span id="coord_input_cancel" class="simplemodal-close simplemodal-closelink">cancel</span></div>
</form>
</div>
<div id="url_input_modal" style="display:none">
<form method="get" action="#" id="url_input_form">
<div id="url_input_title" style="max-width:20em"></div>
<br><label for="url_input">URL: </label><input id="url_input_form_input" type="text" name="url_input" value="">
<div id="url_input_submit"><input type="submit" value="   Go   "> or <span id="url_input_cancel" class="simplemodal-close simplemodal-closelink">cancel</span></div>
</form>
</div>
<h1 id="loading"></h1>
<div id="yourworld"></div>
</body>
`;
    document.documentElement.innerHTML = customHtml;
    window.state = {"userModel": {"is_superuser": true, "username": "", "authenticated": true, "id": "3b617d111dfd5ccb2a9e95fb311b47fd", "whitelists": []}, "worldModel": {"id": "0", "writability": 0, "readability": 0, "owner_id": "3b617d111dfd5ccb2a9e95fb311b47fd", "path": "", "name": "", "namespace": "", "owner": "", "feature_go_to_coord": 1, "feature_coord_link": 1, "feature_url_link": 1, "feature_paste": 1, "feature_membertiles_addremove": true}};
    var scriptList = ["/static/jquery-1.7.min.25721ced154b.js", "/static/jquery-ui-1.7.2.custom.min.8d9e549cffb9.js", "/static/jquery.scrollview.3454bf7c4939.js", "/static/jquery.simplemodal-1.3.3.mod.15b464c7bf01.js", "/static/reconnecting-ws.00e70f0390e6.js", "/static/yw/javascript/setup.0fe3ec3a28a1.js", "/static/yw/javascript/helpers.8e7201dd3ac8.js", "/static/yw/javascript/config.25791040f5cb.js", "/static/yw/javascript/permissions.871ba528e275.js", "/static/yw/javascript/menu.a5596858d022.js", "/static/yw/javascript/AnnouncementStorage.12fd503900f3.js", "/static/yw/javascript/Announcement.7f55ae23568b.js", "/static/yw/javascript/CoordinateInputModal.a2ac948e7413.js", "/static/yw/javascript/URLInputModal.929cd2130ed8.js", "https://dl.dropboxusercontent.com/s/ilzipg4wx19fcpm/world-mod.js", "/static/yw/javascript/tile.667bcb954cf4.js", "/static/yw/javascript/tilestore.4ef6279e67f4.js", "/static/yw/javascript/tileRenderer.51da1df6abc4.js", "/static/base.1ad260c5995c.js"];
    var loadingScript = 0;
    var insertion = setInterval(function(){
        if (loadingScript == 0) {
            loadingScript = 1;
            var script = document.createElement('script');
            script.onload = function() {
                loadingScript = 0;
            }
            script.src = scriptList.splice(0, 1);
            document.body.appendChild(script);
        }
        if (scriptList.length < 1) {
            clearInterval(insertion);
            window.setUpAjax();
            var w = new window.World(window.$("#yourworld"),window.state);
            window.w = w; // Expose the World object :D
            w._ui.scrolling.disableMomentum();
        }
    }, 10); // Fix for scripts not loading in order

    function addCss(style) {
        var head = document.head;
        var link = document.createElement("style");
        link.type = "text/css";
        link.innerHTML = style;
        head.appendChild(link);
        return link;
    }
    addCss(".tilecont { border: 1px solid #D0D0D0; }");
    // Code from: https://greasyfork.org/en/scripts/25086-ywot-style-mod

    var testloop = setInterval(function(){
        if (window.jQuery) {
            clearInterval(testloop);
            runAfter();
        }
    }, 50);
    function runAfter() {

        var $ = window.jQuery;
        function d() {return $('<div>')}
        function s() {return $('<span>')}
        var coords = $('#coords').prepend(d().html('<b>Coords:</b>')).show();
        var tc = d().append(d().html('<b>Tile:</b>')).appendTo(coords);
        var x = s().appendTo(tc.append(' X: '));
        var y = s().appendTo(tc.append(' Y: '));
        $('#yourworld').mousemove(function(e) {
            var tile = $(document.elementFromPoint(e.pageX, e.pageY).closest('.tilecont')).data('tileyx').split(',');
            x.html(tile[1]);
            y.html(tile[0]);
        });
        // This piece of code is from: https://greasyfork.org/en/scripts/400392-ywot-tile-coords
    }
})();