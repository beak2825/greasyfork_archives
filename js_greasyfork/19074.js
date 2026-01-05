// ==UserScript==
// @name         Slither.io mod
// @namespace    http://kmcgurty.com
// @version      1.1
// @description  Mods a few things
// @author       Kmc - admin@kmcdeals.com
// @match        http://slither.io
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/19074/Slitherio%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/19074/Slitherio%20mod.meta.js
// ==/UserScript==

var zoomNum = 0.9;
var maxZoom = 2;
var minZoom = 0.2;
var zoomRate = 0.1;

setInterval(function(){
    if(zoomNum > maxZoom) {
        console.log("adding");
        zoomNum -= 0.1;
    } else if(zoomNum < minZoom){
        console.log("subrtacting")
        zoomNum += 0.1;
    }

    unsafeWindow.gsc = zoomNum;
}, 50);

function changeZoom(e) {
    if(zoomNum < maxZoom && zoomNum > minZoom){
        var delta = (e.wheelDelta / Math.abs(e.wheelDelta));
        zoomNum += zoomRate * delta;
    }
}

document.body.onmousewheel = changeZoom;

appendInput();
function appendInput(){
    var div = document.querySelector(".taho").parentElement;
    
    var html = `<div class="taho" id="nick_holder" style="width: 244px; margin-top: 34px; box-shadow: rgb(0, 0, 0) 0px 6px 50px; opacity: 1; background: rgb(76, 68, 124);">
                    <input class="sumsginp" id="ip_address" style="width: 220px; height: 24px;" placeholder="IP Address" maxlength="24">
                </div>`;
    
    var node = document.createElement('div');
    node.innerHTML = html;
    node = node.children[0];

    div.appendChild(node);
}

document.querySelector(".sadg1").addEventListener("click", function(){
    var ipAddressInput = document.querySelector("#ip_address");

    if(ipAddressInput.value != ""){
        if(ipAddressInput.value != unsafeWindow.bso.ip){
            unsafeWindow.bso.ip = ipAddressInput.value;
            unsafeWindow.connect();
        }
    } else {
        ipAddressInput.value = unsafeWindow.bso.ip;
    }
});

initStatsHTML();
function initStatsHTML(){
    var node = document.createElement('div');
    node.id = "stats";

    document.body.appendChild(node);

    document.querySelector("iframe[src='/social-box/']").src = "";

    var css = `
        #stats-wrapper{
            position: absolute;
            z-index: 7;
            background-color: rgba(40, 40, 40, .7);
            color: white;
        }
    `;

    GM_addStyle(css);
}

setInterval(function(){
    if(unsafeWindow.playing){
        var html = `
            <div id="stats-wrapper">
                IP: ` + unsafeWindow.bso.ip + `<br>
                X: ` + Math.round(snake.xx) + `<br>
                Y: ` + Math.round(snake.yy) + `<br>
                <button onclick="window.connect()">Respawn</button>
            </div>
        `;

        var statsDiv = document.querySelector("#stats");
        statsDiv.innerHTML = html;
    }
}, 500);