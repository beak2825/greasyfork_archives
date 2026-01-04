// ==UserScript==
// @name         Spam kill
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  wow
// @author       LongName
// @match        https://agarpowers.xyz/
// @icon         https://i.imgur.com/hS3gXVD.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471841/Spam%20kill.user.js
// @updateURL https://update.greasyfork.org/scripts/471841/Spam%20kill.meta.js
// ==/UserScript==


       var LongNameScriptBtn = document.createElement("div");
       LongNameScriptBtn.innerHTML = '<div class="controlRow">LongName Script <input value="T" id="LongName ScriptID" oninput="toUpperCase()" class="controlBtn" role="button"></div>';
       controls.appendChild(LongNameScriptBtn);
       var portalKey = document.getElementById("portal");
       var antiRecKey = document.getElementById("antirecombine");
       var LongNameScriptInput = document.getElementById("LongName ScriptID");
        function portal() {
            var letterP = portalKey.innerText;
            var PortalkeyCode = letterP.charCodeAt(0);
            $("#canvas").trigger($.Event("keydown", { keyCode: PortalkeyCode })); // Portal KeyCode
            $("#canvas").trigger($.Event("keyup", { keyCode: PortalkeyCode })); // Portal KeyCode
        }
        function antiRec() {
            var letter2 = antiRecKey.innerText;
            var antimergekeyCode = letter2.charCodeAt(0);
            $("#canvas").trigger($.Event("keydown", { keyCode: antimergekeyCode })); // AntiRecombine KeyCode
            $("#canvas").trigger($.Event("keyup", { keyCode: antimergekeyCode })); // AntiRecombine KeyCode
        }

        var LongNameScript = parseInt(localStorage.getItem("LongName ScriptKeyCode")) || 84; // Attack-Two KeyCode (portal + antirec)
        portalKey.addEventListener("click", function(event) {
            portal();
        });
        window.addEventListener('keydown', function(event) {
            if (event.keyCode == LongNameScript) {
                portal();
                setTimeout(virus, 100);
                setTimeout(antiRec, 200);

            }
        });