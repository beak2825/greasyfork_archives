// ==UserScript==
// @name         Raid Defense leaked best script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       ♛Ꭾls♣ℌelp♠ℳe xD♕ leaked
// @description  perfect script
// @license      MIT
// @match        zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443960/Raid%20Defense%20leaked%20best%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/443960/Raid%20Defense%20leaked%20best%20script.meta.js
// ==/UserScript==

(function() {
    let styles1 = document.createTextNode( `
.btn-purple {
background-color: #341b7a;
}
.hud-menu-scripts {
display: none;
position: fixed;
top: 50%;
left: 48%;
width: 600px;
height: 500px;
margin: -300px 0 0 -320px;
padding: 20px;
background: rgba(0, 0, 0, 0.6);
color: #eee;
border-radius: 4px;
z-index: 15;
overflow-y: auto;
background: color: gray
opacity: 0.75;
background-size: cover;
}
.hud-spell-icons .hud-spell-icon[data-type="Scripts"]::before {
background-image: url("https://discordapp.com/assets/ad2e4d6e7b90ca6005a5038e22b099cc.svg");
}
`);


let css = document.createElement("style");
css.type = "text/css";
css.appendChild(styles1);
document.body.appendChild(css);
let menu_html = `
<div class='hud-menu-scripts'><h3 style="text-align: center;">Wall Scripts!</h3>
    <hr />
    <button class="btn btn-green 1z" style="width: 40%"><small>Enable 3x3 Walls!</small></button>
    <button class="btn btn-green 2z" style="width: 40%"><small>Enable 3x3 Doors!</small></button>
    <button class="btn btn-green 3z" style="width: 40%"><small>Enable 5x5 Walls!</small></button>
    <button class="btn btn-green 4z" style="width: 40%"><small>Enable 7x7 Walls!</small></button>
    <button class="btn btn-green 5z" style="width: 40%"><small>Enable 9x9 Walls!</small></button>
    <button class="btn btn-green 6z" style="width: 40%"><small>Enable 20x20 Walls!</small></button>
    <hr />
    <h3 style="text-align: center;">Alarms!<h3>
    <hr />
    <button class="btn btn-purple alarm 7z" onclick="alarm();" style="width: 40%"><small>Enable Tower Destroy Alarm!</small></button>
    <button class="btn btn-purple stashHitAlarm 8z" onclick="stashHitAlarm();" style="width: 40%"><small>Enable Stash Damage Alarm!</small></button>
    <button class="btn btn-purple deadAlarm 9z" onclick="deadAlarm();" style="width: 40%"><small>Enable Player Death Alarm!</small></button>
    <button class="btn btn-purple disconnectAlarm 10z" onclick="disconnectAlarm();" style="width: 40%"><small>Enable Disconnect Alarm!</small></button>
    <button class="btn btn-purple health65pAlarm 11z" onclick="health65pAlarm();" style="width: 40%"><small>Enable 65% Player Health Alarm!</small></button>
    <button class="btn btn-purple pingAlarm 12z" onclick="pingAlarm();" style="width: 40%"><small>Enable 2k Ping Alarm!</small></button>
    <button class="btn btn-purple tower65pAlarm 13z" onclick="tower65pAlarm();" style="width: 40%"><small>Enable 65% Tower Health Alarm!</small></button>
    <button class="btn btn-purple 14z" onclick="teamDeathAlarm();" style="width: 40%"><small>Enable Teammate Death Alarm!</small></button>
    <hr />
    <h3 style="text-align: center;">Extras!</h3>
    <hr />
    <button class="btn btn-green 15z" style="width: 40%"><small>Enable Wall of Doors!</small></button>
    <button class="btn btn-green 16z" style="width: 40%"><small>Enable Wall of Walls!</small></button>
    <button class="btn btn-green 17z" style="width: 40%"><small>Upgrade All!</small></button>
    <button class="btn btn-green 18z" style="width: 40%"><small>Enable Bot Mode!</small></button>
    <hr />
    <h3 style="text-align: center;">Base!</h3>
    <hr />
    <button class="btn btn-purple 19z" style="width: 40%"><small>Save Towers!</small></button>
    <button class="btn btn-purple 20z" style="width: 40%"><small>Build Saved Towers!</small></button>
    <button class="btn btn-purple 21z" style="width: 40%"><small>Auto Rebuild Saved Towers!</small></button>
    <button class="btn btn-purple 22z" style="width: 40%"><small>Enable Upgrade All!</small></button>
    <hr />
    <h3 style="text-align: center;">Info!</h3>
    <hr />
    <p><small>Boss waves: 9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121</small></p>
    <p><small>Wall of walls and wall of doors are the same thing just different towers. Wall of walls and wall of doors will surround the base in either walls or doors(Depending on what you chose).</small></p>
    </div>
    </div>`
    ;
    document.body.insertAdjacentHTML("afterbegin", menu_html);
    let menu_scripts = document.getElementsByClassName('hud-menu-scripts')[0];
    var allItems = document.getElementsByClassName("myCustomIcon");
        var menus = document.getElementsByClassName("hud-menu");

        var newMenuItem = document.createElement("div");
        newMenuItem.classList.add("hud-menu-icon");
        newMenuItem.classList.add("myCustomIcon");
        newMenuItem.setAttribute("data-type", "Scripts");
        newMenuItem.innerHTML = "Scripts";
        document.getElementById("hud-menu-icons").appendChild(newMenuItem);

        var AllItems = document.getElementsByClassName("myCustomIcon");
        for(var item = 0; item < allItems.length; item++) {
            allItems[item].addEventListener("mouseenter", onMenuItemEnter, false);
            allItems[item].addEventListener("mouseleave", onMenuItemLeave, false);
        }

        function onMenuItemEnter() {
            var theTooltip = document.createElement("div");
            theTooltip.classList.add("hud-tooltip");
            theTooltip.classList.add("hud-tooltip-left");
            theTooltip.id = "hud-tooltip";
            theTooltip.innerHTML = `<div class="hud-tooltip-menu-icon">
                                       <h4>Raid Defense!</h4>
                                    </div>`;

            this.appendChild(theTooltip)

            theTooltip.style.top = "-10px";
        theTooltip.style.bottom = 0
        theTooltip.style.left = "-96.4px";
        theTooltip.style.right = 0;
                theTooltip.style.width = "100px";
                theTooltip.style.fontSize = "16.7px";
                theTooltip.style.fontWeight = "bold";
        theTooltip.style.position = "relative";
                theTooltip.style.textIndent = 0;
        }

        function onMenuItemLeave() {
            this.removeChild(document.getElementById("hud-tooltip"));
        }

    document.getElementsByClassName('hud-menu-icon')[3].addEventListener("click", function(e) {
        if(menu_scripts.style.display == "none") {
            menu_scripts.style.display = "block";
            for(var i = 0; i < menus.length; i++) {
                menus[i].style.display = "none";
            }
        } else {
            menu_scripts.style.display = "none";
        }
    });
    let icons = document.getElementsByClassName("hud-menu-icon");
    let menu_icons = [
        icons[0],
        icons[1],
        icons[2]
    ]
    menu_icons.forEach(function(elem) {
        elem.addEventListener("click", function(e) {
            if(menu_scripts.style.display == "block") {
                menu_scripts.style.display = "none";
            }
        })
    })
    window.addEventListener('mouseup', function(event) {
        if(event.target !== menu_scripts && event.target.parentNode !== menu_scripts) {
            menu_scripts.style.display = 'none';
        }
    })
})();
isOnOrNot = false;
stashhitalarm = false;
deadalarm = false;
disconnectalarm = false;
health65palarm = false;
onlyOpenOnceOnTimeout = false;
pingalarm = false;
tower65palarm = false;

game.network.addRpcHandler("LocalBuilding", e => {
    for (let i in e) {
        if (e[i].dead) {
            if (e[i].type !== "Wall" && e[i].type !== "Door") {
                if (isOnOrNot) {
                    !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
                }
            }
        }
    }
})

game.network.addEntityUpdateHandler((e) => {
    let gl = GetGoldStash();
    if (gl) {
        if (e.entities[gl.uid]) {
            if (e.entities[gl.uid].health !== e.entities[gl.uid].maxHealth) {
                if (stashhitalarm) {
                    !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 24000))
                }
            }
        }
    }
    if (e.entities[game.world.myUid]) {
        if (e.entities[game.world.myUid].health) {
            if ((e.entities[game.world.myUid].health / 500) * 100 < 65) {
                if (health65palarm) {
                    !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 24000));
                }
            }
        }
    }
    if((game.network.ping > 2000) && pingalarm) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    };
    for (let i in e.entities) {
        if (e.entities[i].partyId == game.ui.playerTick.partyId) {
            if (e.entities[i].model == "Harvester" || e.entities[i].model == "ArrowTower" || e.entities[i].model == "CannonTower" || e.entities[i].model == "BombTower" || e.entities[i].model == "MagicTower" || e.entities[i].model == "MeleeTower") {
                entitiesHealth[e.entities[i].uid] = {uid: e.entities[i].uid, health: e.entities[i].health, maxHealth: e.entities[i].maxHealth}
            }
        }
        if (entitiesHealth[i]) {
            e.entities[i].health && (entitiesHealth[i].health = e.entities[i].health);
            e.entities[i].maxHealth && (entitiesHealth[i].maxHealth = e.entities[i].maxHealth);
        }
    }
    for (let i in entitiesHealth) {
        if ((entitiesHealth[i].health / entitiesHealth[i].maxHealth) * 100 < 65) {
            if (tower65palarm) {
                !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 30000))
            }
        }
        if (!e.entities[i]) {
            delete entitiesHealth[i];
        }
    }
})

game.network.addRpcHandler("Dead", () => {
    if (deadalarm) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    }
})

game.network.addCloseHandler(() => {
    if (disconnectalarm) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    }
})

videoalert = () => {
    let a = new Audio();
    a.src = "https://cdn.discordapp.com/attachments/870020008128958525/871587235324117052/Canadian_EAS_Alarm_EXTREME_LOUD.mp3"
    a.volume = 1;
    a.play();
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Stop Alert?", 10000, function() {
        a.pause();
    })
    setTimeout(() => {
        a.pause();
    }, 30000);
}

alarm = () => {
    window.isOnOrNot = !isOnOrNot;

    document.getElementsByClassName("alarm")[0].innerText = document.getElementsByClassName("alarm")[0].innerText.replace(isOnOrNot ? "Enable" : "Disable", isOnOrNot ? "Disable" : "Enable");

    document.getElementsByClassName("alarm")[0].className = document.getElementsByClassName("alarm")[0].className.replace(isOnOrNot ? "purple" : "red", isOnOrNot ? "red" : "purple");

}

stashHitAlarm = () => {
    window.stashhitalarm = !stashhitalarm;

    document.getElementsByClassName("stashHitAlarm")[0].innerText = document.getElementsByClassName("stashHitAlarm")[0].innerText.replace(stashhitalarm ? "Enable" : "Disable", stashhitalarm ? "Disable" : "Enable");

    document.getElementsByClassName("stashHitAlarm")[0].className = document.getElementsByClassName("stashHitAlarm")[0].className.replace(stashhitalarm ? "purple" : "red", stashhitalarm ? "red" : "purple");

}

deadAlarm = () => {
    window.deadalarm = !deadalarm;

    document.getElementsByClassName("deadAlarm")[0].innerText = document.getElementsByClassName("deadAlarm")[0].innerText.replace(deadalarm ? "Enable" : "Disable", deadalarm ? "Disable" : "Enable");

    document.getElementsByClassName("deadAlarm")[0].className = document.getElementsByClassName("deadAlarm")[0].className.replace(deadalarm ? "purple" : "red", deadalarm ? "red" : "purple");

}

disconnectAlarm = () => {
    window.disconnectalarm = !disconnectalarm;

    document.getElementsByClassName("disconnectAlarm")[0].innerText = document.getElementsByClassName("disconnectAlarm")[0].innerText.replace(disconnectalarm ? "Enable" : "Disable", disconnectalarm ? "Disable" : "Enable");

    document.getElementsByClassName("disconnectAlarm")[0].className = document.getElementsByClassName("disconnectAlarm")[0].className.replace(disconnectalarm ? "purple" : "red", disconnectalarm ? "red" : "purple");

}

health65pAlarm = () => {
    window.health65palarm = !health65palarm;

    document.getElementsByClassName("health65pAlarm")[0].innerText = document.getElementsByClassName("health65pAlarm")[0].innerText.replace(health65palarm ? "Enable" : "Disable", health65palarm ? "Disable" : "Enable");

    document.getElementsByClassName("health65pAlarm")[0].className = document.getElementsByClassName("health65pAlarm")[0].className.replace(health65palarm ? "purple" : "red", health65palarm ? "red" : "purple");

}

pingAlarm = () => {
    window.pingalarm = !pingalarm;

    document.getElementsByClassName("pingAlarm")[0].innerText = document.getElementsByClassName("pingAlarm")[0].innerText.replace(pingalarm ? "Enable" : "Disable", pingalarm ? "Disable" : "Enable");

    document.getElementsByClassName("pingAlarm")[0].className = document.getElementsByClassName("pingAlarm")[0].className.replace(pingalarm ? "purple" : "red", pingalarm ? "red" : "purple");

}

tower65pAlarm = () => {
    window.tower65palarm = !tower65palarm;

    document.getElementsByClassName("tower65pAlarm")[0].innerText = document.getElementsByClassName("tower65pAlarm")[0].innerText.replace(tower65palarm ? "Enable" : "Disable", tower65palarm ? "Disable" : "Enable");

    document.getElementsByClassName("tower65pAlarm")[0].className = document.getElementsByClassName("tower65pAlarm")[0].className.replace(tower65palarm ? "purple" : "red", tower65palarm ? "red" : "purple");

}

GetGoldStash = () => {
    for (let i in game.ui.buildings) {
        if (game.ui.buildings[i].type == "GoldStash") {
            return game.ui.buildings[i];
        }
    }
}