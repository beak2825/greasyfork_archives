// ==UserScript==
// @name         Multipowers
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Attack 1: Freeze-Virus + AntiRecombine ; Attack 2: Portal + AntiRecombine + Virus ; Defense: Antifreeze + Shield + Speed ; Growspam & Autoskip
// @author       qwd
// @match        https://agarpowers.xyz/*
// @icon         https://cdn.shopify.com/s/files/1/0281/7546/6627/products/IMG_6601.jpg?v=1656046323
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467015/Multipowers.user.js
// @updateURL https://update.greasyfork.org/scripts/467015/Multipowers.meta.js
// ==/UserScript==
// Look at "Controls". You can change the keys of attacks. Furthermore on the left side is an information box. - qwd
    (function() {
        'use strict';
        var controls = document.getElementById("controls");
        var attack1Btn = document.createElement("div");
        attack1Btn.innerHTML = '<div class="controlRow">Attack 1 <input value="V" id="attack1ID" oninput="toUpperCase()" class="controlBtn" role="button"></div>';

        controls.appendChild(attack1Btn);

var $ = window.$;
var fvirusKey = document.getElementById("fvirus");
var antiRecKey = document.getElementById("antirecombine");
var attackInput = document.getElementById("attack1ID");

function frozenVirus() {
    var letter = fvirusKey.innerText;
    var fViruskeyCode = letter.charCodeAt(0);
    $("#canvas").trigger($.Event("keydown", { keyCode: fViruskeyCode })); // Frozen-Virus KeyCode
    $("#canvas").trigger($.Event("keyup", { keyCode: fViruskeyCode })); // Frozen-Virus KeyCode
}

function antiRec() {
    var letter2 = antiRecKey.innerText;
    var antimergekeyCode = letter2.charCodeAt(0);
    $("#canvas").trigger($.Event("keydown", { keyCode: antimergekeyCode })); // AntiRecombine KeyCode
    $("#canvas").trigger($.Event("keyup", { keyCode: antimergekeyCode })); // AntiRecombine KeyCode
}

var attack1 = parseInt(localStorage.getItem("attack1KeyCode")) || 86; // Standard value for Attack-One KeyCode

fvirusKey.addEventListener("click", function(event) {
    frozenVirus();
});

antiRecKey.addEventListener("click", function(event) {
    antiRec();
});

window.addEventListener('keydown', function(event) {
    if (event.keyCode == attack1) {
        antiRec();
        frozenVirus();
    }
});

attackInput.value = String.fromCharCode(attack1);
attackInput.addEventListener("input", function(event) {
    var attack1Key = event.target.value.toUpperCase().charAt(0);
    var newKeyCode = attack1Key.charCodeAt(0);
    if (!isNaN(newKeyCode)) {
        attack1 = newKeyCode;
        localStorage.setItem("attack1KeyCode", attack1);
    }
});
        var feedBtn = document.createElement("div");
        feedBtn.innerHTML = '<div class="controlRow">Feeding <input value="Z" id="feedingID"  class="controlBtn" role="button"></div>';
        controls.appendChild(feedBtn);
        var feedKey = document.getElementById("feed");
        function startFeed() {
            var letterFeed = feedKey.innerText;
            var FeedkeyCode = letterFeed.charCodeAt(0);
            $("#canvas").trigger($.Event("keydown", { keyCode: FeedkeyCode })); // Feed KeyCode
        }
        function stopFeed() {
            var letterFeed = feedKey.innerText;
            var FeedkeyCode = letterFeed.charCodeAt(0);
            $("#canvas").trigger($.Event("keyup", { keyCode: FeedkeyCode }));
        }
        var feed = parseInt(localStorage.getItem("FeedkeyCode")) || 90; // Feeding Keycode
        let isFunction1Active = true;
        function toggleFunction(event) {
            if (event.keyCode === feed) { // Enter-Taste (keyCode 13) wird überwacht, du kannst dies auf eine andere Taste ändern
                if (isFunction1Active) {
                    startFeed();
                    isFunction1Active = false;
                    console.log("start")
                } else {
                    stopFeed();
                    isFunction1Active = true;
                    console.log("stop");
                }
            }
        }
        document.addEventListener("keydown", toggleFunction);
        var feedInput = document.getElementById("feedingID");
        feedInput.value = String.fromCharCode(feed);
        feedInput.addEventListener("input", function(event) {
            var feedingKey = event.target.value.toUpperCase().charAt(0);
            var newKeyCode9 = feedingKey.charCodeAt(0);
            if (!isNaN(newKeyCode9)) {
                feed = newKeyCode9;
                localStorage.setItem("FeedKeyCode", feed);
            }
        });




       var attack2Btn = document.createElement("div");
       attack2Btn.innerHTML = '<div class="controlRow">Attack 2 <input value="T" id="attack2ID" oninput="toUpperCase()" class="controlBtn" role="button"></div>';
       controls.appendChild(attack2Btn);
       var virusKey = document.getElementById("virus");
       var portalKey = document.getElementById("portal");
       var attack2Input = document.getElementById("attack2ID");
       function virus() {
            var letterV = virusKey.innerText;
            var ViruskeyCode = letterV.charCodeAt(0);
            $("#canvas").trigger($.Event("keydown", { keyCode: ViruskeyCode })); // Virus KeyCode
            $("#canvas").trigger($.Event("keyup", { keyCode: ViruskeyCode })); // Virus KeyCode
        }
        function portal() {
            var letterP = portalKey.innerText;
            var PortalkeyCode = letterP.charCodeAt(0);
            $("#canvas").trigger($.Event("keydown", { keyCode: PortalkeyCode })); // Portal KeyCode
            $("#canvas").trigger($.Event("keyup", { keyCode: PortalkeyCode })); // Portal KeyCode
        }
        var attack2 = parseInt(localStorage.getItem("attack2KeyCode")) || 84; // Attack-Two KeyCode (portal + virus + antirec)
        virusKey.addEventListener("click", function(event) {
            virus();
        });
        portalKey.addEventListener("click", function(event) {
            portal();
        });
        window.addEventListener('keydown', function(event) {
            if (event.keyCode == attack2) {
                portal();
                setTimeout(virus, 100);
                setTimeout(antiRec, 200);
            }
        });
        attack2Input.value = String.fromCharCode(attack2);
        attack2Input.addEventListener("input", function(event) {
            var attack2Key = event.target.value.toUpperCase().charAt(0);
            var newKeyCode2 = attack2Key.charCodeAt(0);
            if (!isNaN(newKeyCode2)) {
                attack2 = newKeyCode2;
                localStorage.setItem("attack2KeyCode", attack2);
            }
        });


        var shieldKey = document.getElementById("shield");
        var antifKey = document.getElementById("antifreeze");
        var speedKey = document.getElementById("speed");
        var defenseBtn = document.createElement("div");
        defenseBtn.innerHTML = '<div class="controlRow">Defense <input value="C" id="defenseID" oninput="toUpperCase()" class="controlBtn" role="button"></div>';
        controls.appendChild(defenseBtn);
        var defenseInput = document.getElementById("defenseID");
        function shield() {
            var letterS = shieldKey.innerText;
            var ShieldkeyCode = letterS.charCodeAt(0);
            $("#canvas").trigger($.Event("keydown", { keyCode: ShieldkeyCode })); // Shield KeyCode
            $("#canvas").trigger($.Event("keyup", { keyCode: ShieldkeyCode })); // Shield KeyCode
        }
        function antiFreeze() {
            var letterAf = antifKey.innerText;
            var AntifkeyCode = letterAf.charCodeAt(0);
            $("#canvas").trigger($.Event("keydown", { keyCode: AntifkeyCode })); // Antifreeze KeyCode
            $("#canvas").trigger($.Event("keyup", { keyCode: AntifkeyCode })); // Antifreeze KeyCode
        }
        function speed() {
            var letterSp = speedKey.innerText;
            var SpeedkeyCode = letterSp.charCodeAt(0);
            $("#canvas").trigger($.Event("keydown", { keyCode: SpeedkeyCode })); // Speed KeyCode
            $("#canvas").trigger($.Event("keyup", { keyCode: SpeedkeyCode })); // Speed KeyCode
        }
        var defense = parseInt(localStorage.getItem("defenseKeyCode")) || 67; // Defense KeyCode (Shield + AntiFreeze + Speed)
        window.addEventListener('keydown', keydown3);
        function keydown3(event) {

        if (event.keyCode == defense) {
            shield()
            setTimeout(antiFreeze, 100)
            setTimeout(speed, 100)
        }
        }
        defenseInput.value = String.fromCharCode(defense);
        defenseInput.addEventListener("input", function(event) {
            var defenseKey = event.target.value.toUpperCase().charAt(0);
            var newKeyCode3 = defenseKey.charCodeAt(0);
            if (!isNaN(newKeyCode3)) {
                defense = newKeyCode3;
                localStorage.setItem("defenseKeyCode", defense);
            }
        });

        var growthKey = document.getElementById("pellet");
        var growBtn = document.createElement("div");
        growBtn.innerHTML = '<div class="controlRow">Grow <input value="C" id="growID"  oninput="toUpperCase()" class="controlBtn" role="button"></div>';
        controls.appendChild(growBtn);
        var growInput = document.getElementById("growID");
        function pellet() {
            var letterPellet = growthKey.innerText;
            var GrowthkeyCode = letterPellet.charCodeAt(0);
            $("#canvas").trigger($.Event("keydown", { keyCode: GrowthkeyCode }));
            $("#canvas").trigger($.Event("keyup", { keyCode: GrowthkeyCode }));
        }
        var grow = parseInt(localStorage.getItem("growKeyCode")) || 67;
        window.addEventListener('keydown', keydown5);
        function keydown5(event) {

        if (event.keyCode == grow) {
            pellet()
            setTimeout(pellet, 50)
            setTimeout(pellet, 100)
            setTimeout(pellet, 150)
            setTimeout(pellet, 200)
            setTimeout(pellet, 250)
            setTimeout(pellet, 300)
            setTimeout(pellet, 350)
            setTimeout(pellet, 400)
            setTimeout(pellet, 450)
            setTimeout(pellet, 500)
            setTimeout(pellet, 550)
            setTimeout(pellet, 600)
            setTimeout(pellet, 650)
            setTimeout(pellet, 700)
            setTimeout(pellet, 750)
            setTimeout(pellet, 800)
            setTimeout(pellet, 850)
            setTimeout(pellet, 900)
            setTimeout(pellet, 950)
            setTimeout(pellet, 1000)
            setTimeout(pellet, 1050)
            setTimeout(pellet, 1100)
            setTimeout(pellet, 1150)
            setTimeout(pellet, 1200)
            setTimeout(pellet, 1250)
            setTimeout(pellet, 1300)
            setTimeout(pellet, 1350)
            setTimeout(pellet, 1400)
            setTimeout(pellet, 1450)
            setTimeout(pellet, 1500)
        }
        }
        growInput.value = String.fromCharCode(grow);
        growInput.addEventListener("input", function(event) {
            var growthKey = event.target.value.toUpperCase().charAt(0);
            var newKeyCode5 = growthKey.charCodeAt(0);
            if (!isNaN(newKeyCode5)) {
                grow = newKeyCode5;
                localStorage.setItem("growKeyCode", grow);
            }
        });
        var autofeedText = document.createElement("div");
        autofeedText.innerHTML = 'AutoFeed <input id="autoFeed" type="checkbox">';
        controls.appendChild(autofeedText);

        var checkboxAutoF = document.getElementById("autoFeed");
        checkboxAutoF.addEventListener("change", function() {
            if (this.checked) {
                startAutoFeed();
            } else {
                stopAutoFeed();
            }
        });

        var autoFeedInterval;

        function startAutoFeed() {
            autoFeedInterval = setInterval(autofeed, 1500);
        }

        function stopAutoFeed() {
            clearInterval(autoFeedInterval);
        }

        function autofeed() {
            var grow = parseInt(localStorage.getItem("growKeyCode")) || 67;

            function triggerGrowKey() {
                var event = new KeyboardEvent('keydown', {
                    keyCode: grow,
                    which: grow
                });

                window.dispatchEvent(event);
            }

            var mass1 = document.getElementById("ingame-mass").textContent;
            var mass2 = mass1.replace('Mass: ', '');
            var mass = mass2.replace(' ', '');

            if (mass < 10000) {
                triggerGrowKey();
            }
        }



    })();
function keybindInfo() {
var body = document.querySelector("body");
var container = document.createElement("div");
    container.style.zIndex="50"; container.style.marginTop="320px"; container.style.position="absolute"; container.style.border="2px solid white"; container.style.borderRadius="7px"; container.style.color="white"; container.style.padding="10px";
    container.style.left="93%";
    container.innerHTML = '<p id="attack1Info">1. Attack: V</p><p id="attack2Info">2. Attack: T</p><p id="defenseInfo">1. Defense: C</p><p id="growInfo">Grow: C</p><p id="feedInfo">Feeding: Z</p><p id="autofeedInfo" style="color: red">AutoFeed: Off</p><p style="color: gold">by qwd</p>';

    function updateKeys() {
        var dInfo = document.getElementById("defenseInfo");
        var a1Info = document.getElementById("attack1Info");
        var a2Info = document.getElementById("attack2Info");
        var growInfo = document.getElementById("growInfo");
        var feedInfo = document.getElementById("feedInfo");
        var dValue = document.getElementById("defenseID").value;
        var a1Value = document.getElementById("attack1ID").value;
        var a2Value = document.getElementById("attack2ID").value;
        var growValue = document.getElementById("growID").value;
        var feedValue = document.getElementById("feedingID").value;

        var autofeedInfo = document.getElementById("autofeedInfo");
        var autoFeedInput = document.getElementById("autoFeed");
        autoFeedInput.addEventListener("change", function() {
            if (this.checked) {
                autofeedInfo.innerHTML = "AutoFeed: On ";
                autofeedInfo.style.color="lime";
            } else {
                autofeedInfo.innerHTML = "AutoFeed: Off";
                autofeedInfo.style.color="red";
            }
        });

        a1Info.innerHTML = "1. Attack: " + a1Value ;
        a2Info.innerHTML = "2. Attack: " + a2Value ;
        dInfo.innerHTML = "Defense: " + dValue ;
        growInfo.innerHTML = "Grow: " + growValue;
        feedInfo.innerHTML = "Feeding: " + feedValue;

    } setInterval(updateKeys, 200);
    body.appendChild(container);
}
keybindInfo()
function skip() {
    var deathpanel = document.getElementById("death-panel");
    deathpanel.style.display="none";
    var panel = document.getElementById("panel");
    panel.style.display="block";
    var respawnBtnInput = document.getElementById("respawn");
    var deathpanelIf = window.getComputedStyle(deathpanel);
    if (deathpanelIf.display !== "none") {
        // Das Element ist nicht auf "display: none" gesetzt
        console.log("Das Element ist sichtbar.");
    } else {
        // Das Element ist auf "display: none" gesetzt
        console.log("Das Element ist ausgeblendet.");
    }
    var $ = window.$;
    function respawn() {
        var letterRe = respawnBtnInput.innerText;
        var RekeyCode = letterRe.charCodeAt(0);
        $("#canvas").trigger($.Event("keydown", { keyCode: RekeyCode }));
        $("#canvas").trigger($.Event("keyup", { keyCode: RekeyCode }));
        }
    respawnBtnInput.addEventListener("click", function() {
        var letterRe = respawnBtnInput.innerText;
        var RekeyCode = letterRe.charCodeAt(0);
    });
}
setInterval(skip, 2000)
function advanced() {
    // Get ID's
    var body = document.querySelector("body");
    var deathpanel = document.getElementById("death-panel");
    var lastKills = document.getElementById("kills");
    var lastPws = document.getElementById("powers-used");
    var lastScores = document.getElementById("highest-mass");
    // Creating Box
    var container = document.createElement("div");
    container.setAttribute("id", "box");
    container.style.width="200px";container.style.height="auto";container.style.border="2px solid white";
    container.style.zIndex="50";container.style.position="absolute"; container.style.padding="8px";
    container.style.marginTop="0px";container.style.borderRadius="7px";container.style.color="white";
    container.style.boxShadow="inset 2px 0px 3px white"; container.style.marginLeft="25%";
    container.innerHTML = `
    <div>
    <div id="Kills">Kills: 0</div>
    <div id="Powers">Powers: 0</div>
    <div id="Score">Score: 0</div>
    </div>
    `;
    body.appendChild(container);
    var textKills = document.getElementById("Kills");
    var textPowers = document.getElementById("Powers");
    var textScore = document.getElementById("Score");

    let sessionKills = 0;
    let sessionPws = 0;
    let sessionScores = 0;
    // Observe Death panel
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0
    };
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                var lastKillsCount = parseInt(lastKills.textContent);
                var lastPwsCount = parseInt(lastPws.textContent);
                var lastScoresCount = parseInt(lastScores.textContent);
                sessionKills = sessionKills + lastKillsCount ;
                textKills.innerHTML = 'Kills: ' + sessionKills ;
                sessionPws = sessionPws + lastPwsCount ;
                textPowers.innerHTML = 'Powers: ' + sessionPws ;
                if (sessionScores <= lastScoresCount) {
                    sessionScores = lastScoresCount ;
                    textScore.innerHTML = 'Score: ' + sessionScores ;
                }
                else {
                    sessionScores = sessionScores ;
                }
            }
        });
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(deathpanel);
}
setTimeout(advanced, 2000);





