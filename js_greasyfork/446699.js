// ==UserScript==
// @name         Alarms
// @namespace    -
// @version      1.1
// @description  Tower Alarms
// @author       you
// @match        zombs.io
// @icon         https://cdn.discordapp.com/attachments/854376044522242059/924865286719557672/BG_Mirai_Light.webp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446699/Alarms.user.js
// @updateURL https://update.greasyfork.org/scripts/446699/Alarms.meta.js
// ==/UserScript==

let isOnOrNot = false;
let stashhitalarm = false;
let deadalarm = false;
let disconnectalarm = false;
let onlyOpenOnceOnTimeout;
let health65palarm = false;
let tower65palarm = false;
let entitiesHealth = {};
let pingalarm = false;
let petdeadalarm = false;
let m25health = false;
let videoalert = () => {
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
                    !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
                }
            }
        }
    }
    if((game.network.ping > 2000) && pingalarm) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    };
    if (e.entities[game.world.myUid]) {
        if (e.entities[game.world.myUid].health) {
            if ((e.entities[game.world.myUid].health / 500) * 100 < 65) {
                if (health65palarm) {
                    !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true,videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
                }
            }
        }
    }
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
                !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
            }
        }
        if (!e.entities[i]) {
            delete entitiesHealth[i];
        }
    }
})

Game.currentGame.ui._events.playerPetTickUpdate.push(pet => {
    if (petdeadalarm && pet.health <= 0) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    }
    if (m25health && pet.health <= 10) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    }
})

game.network.addRpcHandler("Dead", () => {
    if (deadalarm) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    }
})

game.network.addCloseHandler(() => {
    if (disconnectalarm) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, window.open("https://youtu.be/xvFZjo5PgG0"), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    }
})

alarm = () => {
    isOnOrNot = !isOnOrNot;

    document.getElementsByClassName("0i9")[0].innerText = document.getElementsByClassName("0i9")[0].innerText.replace(isOnOrNot ? "Enable" : "Disable", isOnOrNot ? "Disable" : "Enable");

    document.getElementsByClassName("0i9")[0].className = document.getElementsByClassName("0i9")[0].className.replace(isOnOrNot ? "green" : "red", isOnOrNot ? "red" : "green");

}

stashHitAlarm = () => {
    stashhitalarm = !stashhitalarm;

    document.getElementsByClassName("3i9")[0].innerText = document.getElementsByClassName("3i9")[0].innerText.replace(stashhitalarm ? "Enable" : "Disable", stashhitalarm ? "Disable" : "Enable");

    document.getElementsByClassName("3i9")[0].className = document.getElementsByClassName("3i9")[0].className.replace(stashhitalarm ? "green" : "red", stashhitalarm ? "red" : "green");

}

deadAlarm = () => {
    deadalarm = !deadalarm;

    document.getElementsByClassName("6i9")[0].innerText = document.getElementsByClassName("6i9")[0].innerText.replace(deadalarm ? "Enable" : "Disable", deadalarm ? "Disable" : "Enable");

    document.getElementsByClassName("6i9")[0].className = document.getElementsByClassName("6i9")[0].className.replace(deadalarm ? "green" : "red", deadalarm ? "red" : "green");

}

disconnectAlarm = () => {
    disconnectalarm = !disconnectalarm;

    document.getElementsByClassName("9i9")[0].innerText = document.getElementsByClassName("9i9")[0].innerText.replace(disconnectalarm ? "Enable" : "Disable", disconnectalarm ? "Disable" : "Enable");

    document.getElementsByClassName("9i9")[0].className = document.getElementsByClassName("9i9")[0].className.replace(disconnectalarm ? "green" : "red", disconnectalarm ? "red" : "green");
}
health65pAlarm = () => {
    health65palarm = !health65palarm;

    document.getElementsByClassName("11i9")[0].innerText = document.getElementsByClassName("11i9")[0].innerText.replace(health65palarm ? "Enable" : "Disable", health65palarm ? "Disable" : "Enable");

    document.getElementsByClassName("11i9")[0].className = document.getElementsByClassName("11i9")[0].className.replace(health65palarm ? "green" : "red", health65palarm ? "red" : "grey");

}

tower65pAlarm = () => {
    tower65palarm = !tower65palarm;

    document.getElementsByClassName("14i9")[0].innerText = document.getElementsByClassName("14i9")[0].innerText.replace(tower65palarm ? "Enable" : "Disable", tower65palarm ? "Disable" : "Enable");

    document.getElementsByClassName("14i9")[0].className = document.getElementsByClassName("14i9")[0].className.replace(tower65palarm ? "green" : "red", tower65palarm ? "red" : "grey");

}
pingAlarm = () => {
    pingalarm = !pingalarm;

    document.getElementsByClassName("16i9")[0].innerText = document.getElementsByClassName("16i9")[0].innerText.replace(pingalarm ? "Enable" : "Disable", pingalarm ? "Disable" : "Enable");

    document.getElementsByClassName("16i9")[0].className = document.getElementsByClassName("16i9")[0].className.replace(pingalarm ? "green" : "red", pingalarm ? "red" : "grey");

}
petdeathalarm = () => {
    petdeadalarm = !petdeadalarm;

    document.getElementsByClassName("17i9")[0].innerText = document.getElementsByClassName("17i9")[0].innerText.replace(petdeadalarm ? "Enable" : "Disable", petdeadalarm ? "Disable" : "Enable");

    document.getElementsByClassName("17i9")[0].className = document.getElementsByClassName("17i9")[0].className.replace(petdeadalarm ? "green" : "red", petdeadalarm ? "red" : "grey");

}
pet10hpalarm = () => {
    m25health = !m25health;

    document.getElementsByClassName("18i9")[0].innerText = document.getElementsByClassName("18i9")[0].innerText.replace(m25health ? "Enable" : "Disable", m25health ? "Disable" : "Enable");

    document.getElementsByClassName("18i9")[0].className = document.getElementsByClassName("18i9")[0].className.replace(m25health ? "green" : "red", m25health ? "red" : "grey");

}
