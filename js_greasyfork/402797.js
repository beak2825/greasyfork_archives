// ==UserScript==
// @name         Local Sync
// @namespace    http://192.168.1.66/localsync
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402797/Local%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/402797/Local%20Sync.meta.js
// ==/UserScript==
var $saveurl = "http://192.168.1.66/localsync/save.php";
var $loadurl = "http://192.168.1.66/localsync/load.php";




(function() {
    'use strict';

    // Your code here...

    if (typeof SugarCube == "object") {
        //console.log("SugarCube found! Initialize mutation observer.");
        var MOInterval = setInterval(function () {
            var target = document.getElementById("ui-dialog-body");
            if (target != null) {
                var MOConfig = {attributes: true , attributeOldValue: true ,attributeFilter: ['class']};
                const observer = new MutationObserver(SICallback);
                observer.observe(target,MOConfig);
                //document.body.innerHTML += '<div id="localsyncfloater" style="position: absolute;z-index: 999;background-color: #f1f1f1;display:none;"><button type="button" onclick="SCSave()">Save</button><button type="button" onclick="SCLoad()">Load</button></div>';
                //lcdragElement(document.getElementById("localsyncfloater"));
            }
            clearInterval(MOInterval);
        }, 100);
    }
})();

function SICallback(mutationList) {
    var target = document.getElementById("ui-dialog-body");
    var target2 = document.getElementById("ui-dialog-titlebar");
    if (target.classList.contains("saves")) {
        if (document.getElementById("lcsave")) {return;} else {
            target2.innerHTML += '<div id="lcsave"><button type="button" onclick="SCSave()">Save</button><button type="button" onclick="SCLoad()">Load</button></div>';
            }

    }
}

window.SCSave = function SCSave() {
    var $game = SugarCube.Config.saves.id;
    var $data = localStorage[$game+".saves"];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Done!");
        }
    }
    xhttp.open("POST",$saveurl,true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("game="+$game+"&data="+LZString.decompressFromUTF16($data));
}

window.SCLoad = function SCLoad() {
    var $game = SugarCube.Config.saves.id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);
            if (this.responseText) {
                localStorage[$game+".saves"] = LZString.compressToUTF16(this.responseText);
                alert("Done!");
            }

        }
    }
    xhttp.open("POST",$loadurl,true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("game="+$game);
}