// ==UserScript==
// @name         TWMap+
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Change your map size without premium and collect village coordinates.
// @author       henriquemac (coordinates code from https://forum.tribalwars.net/index.php?threads/coordinate-grabber.273144/)
// @grant        none
// @include      https://*.tribalwars.*/*=map*
// @downloadURL https://update.greasyfork.org/scripts/401407/TWMap%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/401407/TWMap%2B.meta.js
// ==/UserScript==

//Map code
//resizes map when page is loaded
TWMap.resize(15);

//adds button to change Map Size
var btn = document.createElement("input", "button");
btn.type = "button";
btn.value = "New Map Size";
btn.onclick = function(){
    newMapSize = parseInt(prompt("New Map Size", ""));
    TWMap.resize(newMapSize);
};
document.body.appendChild(btn);

//Coordinates code
var btn2 = document.createElement("input", "button");
btn2.type = "button";
btn2.value = "CoordGrab";
btn2.onclick = function(){
    if (format === undefined) { var format = "{coord} "}
    var win = (window.frames.length > 0) ? window.main : window;
    var index = 0;
    var outputID = 'villageList';
    $(document).ready(function () {
    if ($('#' + outputID).length <= 0) {
        if (game_data.screen == 'map') {
            var srcHTML = '<div id="coord_picker">' + '<textarea id="' + outputID + '" cols="40" rows="10" value="" onFocus="this.select();"/>' + '</div>';
            ele = win.$('body').append(win.$(srcHTML));
            win.TWMap.map._handleClick = function (e) {
                index++;
                var pos = this.coordByEvent(e);
                var x = pos[0];
                var y = pos[1];
                var coord = pos.join("|");
                coordidx = x * 1000 + y,
                village = TWMap.villages[coordidx];
                var ownername, ownerpoints, tribetag, tribename, tribepoints, ownerally;
                if (village.owner == 0) {
                    ownername = "";
                    ownerpoints = 0;
                }
                else {
                    owner = TWMap.players[village.owner];


                    if (TWMap.allies[TWMap.players[village.owner]] > 0) {
                        tribetag = TWMap.allies[TWMap.players[village.owner].ally].tag;
                        tribename = TWMap.allies[TWMap.players[village.owner].ally].name;
                        tribepoints = TWMap.allies[TWMap.players[village.owner].ally].points;
                        ownerally = owner.ally;
                        tribe = TWMap.allies[TWMap.players[village.owner].ally];
                    }
                    else {
                        tribe = "";
                        tribetag = "";
                        tribename = "";
                        tribepoints = "";
                        ownerally = 0;
                    }
                }
                var image = "";
                if (village.bonus) {
                    image = village.bonus[1];
                }


                var data = format.replace("{coord\}", coord)
                .replace("{player\}", ownername)
                .replace("{playerpoints\}", ownerpoints)
                .replace("{playerid\}", village.owner)
                .replace("{villageid\}", village.id)
                .replace("{points\}", village.points.replace(".", ""))
                .replace("{tag\}", tribetag)
                .replace("{tribename\}", tribename)
                .replace("{tribepoints\}", tribepoints)
                .replace("{tribeid\}", ownerally)
                .replace("{x\}", x)
                .replace("{y\}", y)
                .replace("{kk\}", TWMap.con.continentByXY(x, y))
                .replace("{image\}", 'http://' + document.URL.split('/')[2] + '/graphic/' + image)
                .replace("{index\}", index)
                .replace("{NL\}", "\n");
                document.getElementById(outputID).innerHTML += data;
                /* $('#' + outputID).value += data + "\n";*/
                return false;
            };
        } else {
            alert("Run this script from the Map.\nRedirecting now...");
            self.location = win.game_data.link_base_pure.replace(/screen\=\w*/i, "screen=map");
        }
    }
});
};
document.body.appendChild(btn2);

var btn3 = document.createElement("input", "button");
btn3.type = "button";
btn3.value = "Fullscreen";
btn3.onclick = function(){
    TWMap.goFullscreen();
};
document.body.appendChild(btn3);