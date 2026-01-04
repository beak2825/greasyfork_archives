// ==UserScript==
// @name         Gats.io
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto Chat & Chat Spammer
// @author       You
// @match        https://gats.io
// @icon         https://cdn.discordapp.com/icons/1013557649943572633/83194fce8496596487ff886b09b4f0dc.webp?size=96
// @grant        Dewey
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/450586/Gatsio.user.js
// @updateURL https://update.greasyfork.org/scripts/450586/Gatsio.meta.js
// ==/UserScript==

(function () {
    "use strict";
    setInterval(function () {
        if (document.getElementById("ht").checked == true) {
            var random = Math.floor(Math.random() * 90 * 90 * Math.PI);
            var msg = document.getElementById("holdtextInput").value + " " + random;
            RF.list[0].socket.send(`c,${msg}`);
        }
        var errm1 = "Maximum length reached!";
        if (document.getElementById("m2").value.length > 30 || document.getElementById("m1").value.length > 30) {
            document.getElementById("m2").value = errm1;
            document.getElementById("m1").value = errm1;
        }
    }, 500);

    setInterval(function () {
        if (document.getElementById("ts").checked == true) {
            var random = Math.floor(Math.random() * Math.PI * 99999);
            var msg = document.getElementById("m1").value + " " + random;
            RF.list[0].socket.send(`c,${msg}`);
            setTimeout(function () {
                msg = document.getElementById("m2").value + " " + random;
                RF.list[0].socket.send(`c,${msg}`);
            }, 30);
        }
    }, 50);

let overlayHTML = `
<div id="a">
    <div id="a1">
        <h2 id="bannerA">Dewey#0547</h2>
        <br />
        <label for="TextHolder">Hold text</label><br />
        <input placeholder="Text..." type="text" id="holdtextInput" /> <br />
        <input type="checkbox" id="ht" name="TextHolder" value="ht" />
        <hr />
        <label for="TextSpammer">Text Spammer</label><br />
        <input placeholder="Message1..." type="text" id="m1" /> <br />
        <input placeholder="Message2..." type="text" id="m2" /> <br />
        <input type="checkbox" id="ts" name="TextSpammer" value="ts" />
    </div>
</div>
<style>
    #a {
        z-index: 10;
        position: absolute;
        bottom: 10vh;
        left: 10px;
    }
    #a1 {
        padding: 15px;
        margin-bottom: 5px;
    }
    #ht {
        width: 20px;
        height: 20px;
    }
    #ts {
        width: 20px;
        height: 20px;
    }
    * hr {
        border: 1px solid red;
    }
</style>
`

    let overlay = document.createElement("div");
    overlay.innerHTML = overlayHTML;
    document.body.appendChild(overlay);
})();