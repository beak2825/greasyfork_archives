// ==UserScript==
// @name         Penguin Client
// @version      1.0
// @description  Lots of mods
// @author       Joe (helped a lot by flower)
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAB6CAMAAABHh7fWAAAA0lBMVEWd5/n///8AAACX5vmh6Pn/iADS8/z6/v/F8Pux7Pqg7P72/f6j8P/c9v3o+f6m6fq87vv09PTQ0NCJytnGxsb/jACY3/CAgIDn5+eMjIza2tqm9f9wpLEbKCsRGRsIDA1Rd4A7V15HZ256s8E7OztqampHR0dPT0+3t7esrKw2T1YZGRlbW1skJCRycnL/fgAwQ0ckNTldiZSBvs1pmqQwMDCfn59MKAB7QQCUTwChVgCGSAD/9+//tXz9mkX/4s3/oVv/697/xJr/r2//u4n/zqtlHsADAAAGgklEQVRogcWbaXvbNgyASUmRLdqS7TiTneZwYidOc7tJ23Vbt/Ta//9Lo3WSBEBJsTLhS58+iPgaBEjwABlvLL0o9PvjIPA8xjwvCMZ9P4x6zdthDal+4LmJsELS/3uB35DfAD0IA4+pTF2kxgvCQfvogR9YsAo+8OvS66GjMavEFng2jlpDh0G1vbrtQdgK2vcacTO65++MDuv3tAFnVZbb0VHwSnACD+w+t6F7/WY+Bmy3bxvpFnQ02gmcwEcWw2l0f2dwAu83Rg92Nzljj6gphkCHLYETOBHqONpvkSzZ+BhH0e24WWGjDsfQ45bJkj2uh26fjLMh+i3IKBug34aMsU102xGmsM1YM9DtjiqD7dvQbc4kCDuk0YM3JUv2gESP3pbM2IhCv12I5aKFmoKO6pKFGB6JOJ4mEsfiaDgUddkRhu7V6m4xZPHz8dnm5HSxcKQsFqcnH86fVtNY1OKPegi6RncLEa/ONqcOJic3T89xNV3p8gJd2d2Se3yOYwv8chWLCnrZ5QW6Yu0pxPNyYeVm9LOpHe4GJto+mYij1aYGN5XN6sgGLyaWHG0FD59PaoO38mFldbqOts3dw+lNI/BWbqZD2mxfQ3u0yeypMXgrT4w03FPRtKfFK0xO5cOUYmfeTtEBRR6u6oQ1IccUOyjR5Jgefnw9WMoTwU7HdoKmFkXDs53IjrMk0OMcPSBsFssdyTLSiaYHGZoYWS2QJRvt82R8MTLIdu7tVJYoO0jReH/vGGGlnKHsQYJGB7V4bonsOCuEvR3ajMhZsT09NpEFMrds8xfjPWwSFeetkfFQ83oSHWHk4xbJclpDckkk0djQipslySo5iWGP+xKNuHr4umRFyxMwWzqbYfky3iFnoLJAnM1Z738w2nE+gkhzewzJWqJto2XyPgLoiMEJRaxaJzsOGNtuyGCAk5P3xeVsdnlBNf7pbjZ7WFNa0OOuz+CmQ+AfXx1Mtll2sn+Jae9y7R3+Ncgibp+BZYKYot8elvu091D7udR+Rj8/Bb4eM5AxcVfPuCIHpvZa1V6jbDCrBAgaG1pXnFtaP9S1MwwN4ixgYEYRWJRN9Ma55m/jd3F+j7QAUqeHoJGkdWg2Ple1+6YWOARHQ4Fr/sXcbFw1GxjNOTICyUW5HT2DjSuGXUMtEmnIWgXaDdGgR+UAvi20sEv4HHr7+VW+XsO2lR5H+tsIw0Sm0GY4uECEgyDbSjFzIN7gfB+gQefWGtdIfyuNI66WPX5rtHGCoOFEas5m94gzleGF/jBuTuVwDh8j6SM2vror2pvMlV+Rq+eo+tBoBGw6ZfpAkqbxVeHMg7VzO5uY6NIFqtqcVUCAy6QJlwrDpf5V7szUu5c56ZOBfqep53obMMrkUgEukExnv8taywZM7tsrA32p/fVEH9k3cEkaYctCpqPzPswi54BAr3W1HmdwGpXLQmQxrPf4fY5+0K3O2+a6Ou8jPXPCPYCHbgH0XWYR4KkzHziBNtRaiJ/hWwBk4yPUU8miMb5/cf+pjPC1gZYRrqq1DAL3msnGB9nuaWarE+VcWTLcmmhdrY6uc2K7h21y1RSCzuBSnN+//PHnX18c4nr6nWo0JCSbXGy/p65KP6Mtf/1777dU/nlB/2BStgA3e9nWHj3QEOVJCpoe+LfHvVwev+O9kssGNp8faODHOEWXv0cb/lmi977a0ehZ6YA+vBLFYcoB2vD30ugf6B8UaHRRlh1e4Ud2hbvxpMhfMrMff+J6vqCGNFOO7IiDs5UVzV/2JPzx8RehztILNq5YeVBJHM9mbArN+b8/v/36TmqTBfESJZfHs9ShdMqm0XbZovGTQvVQmjqKF9PFTmjqPFw5iicvIMR0swOa2nBoFxDktYtgS3xwVcuavPTRrl0sl02Crl+yShSTty76ZZPlis1auEVJz1bokSOzf20Xi27QoDo0Ed9SIwcuFq3Xqa47bgK3FkLC69SKS2SX9Wt2+8C3V6ohl8hVV+euW6Muthf1K0o/savzGgUDLhvb6JI7qqyDRAsGapVJSNv7IdL1Elunppgok6hbHJJWZPd9PwzDKAx9vz8eMbde2SdVHNKoJMZVpfZXZElMl4VAHZY/dVn01WWpW5cFfl2WNXZZzNllCWuXhbtdlit3WaTdZWk677Agn3f5DKHLxxe8wycnW+nsoc1WOntelFje1aOqrXT2lGwrnT2gS+kdPRtMpavHkiW/nSei/wE8XHXOIxS17AAAAABJRU5ErkJggg==
// @match        *://*.moomoo.io/*
// @match        *://*.sandbox.moomoo.io/*
// @require      https://greasyfork.org/scripts/456235-moomoo-js/code/MooMoojs.js?version=1144167
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/889950
// @downloadURL https://update.greasyfork.org/scripts/460152/Penguin%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/460152/Penguin%20Client.meta.js
// ==/UserScript==
/*
AutoInsta with Musket/Spike
AutoTrap/Spike Placer
Quad Spike, trap, or turret
Triple mills
MiniBoostSpike/Regular BoostSpike
Helpful menu information
Hat hotkeys
Normal hotkeys
Customizable autoheal

*/
// Setup info
const MooMoo = (function MooMooJS_beta() {})[69];
let activePlayerManager = MooMoo.ActivePlayerManager;
let players = activePlayerManager.players;

// Instakill:

var autoinsta = false;
var instaType = 1

function Equip(id, type) {
    MooMoo.sendPacket("13c" , 0, id, type)
}
var isReloaded = true

function instaMusket1() {
    let nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
    MooMoo.sendPacket("c", 0, null)
    isReloaded = false
    let primary = MooMoo.myPlayer.inventory.primary;
    MooMoo.sendPacket("13c" , 0, 7, 0)
    MooMoo.sendPacket("13c", 0, 0, 1)
    MooMoo.sendPacket("13c", 0, 21, 1)
    MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.primary, true);
    MooMoo.myPlayer.hit(nearestEnemyAngle);
}

function instaMusket2() {
    let secondary = MooMoo.myPlayer.inventory.secondary;
    setTimeout(() => {
        MooMoo.sendPacket("13c", 0, 53, 0)
        MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.secondary, true);
        let nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
        MooMoo.myPlayer.hit(nearestEnemyAngle);
    }, 75);
    setTimeout(() => {
        MooMoo.sendPacket("13c", 0, 6, 0)
    }, 150)
}

function instaMusketReload() {
    let primary = MooMoo.myPlayer.inventory.primary;
    let secondary = MooMoo.myPlayer.inventory.secondary;
    setTimeout(() => {
        MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.secondary, true);
    }, 300);
    setTimeout(() => {
        MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.primary, true);
    }, 2500);
    setTimeout(() => {
        MooMoo.sendPacket("13c", 0, 12, 0)
        MooMoo.sendPacket("13c", 0, 0, 1)
        MooMoo.sendPacket("13c", 0, 11, 1)
    }, 3500);
    setTimeout(() => {
        isReloaded = true
    }, 4000)
}

function instaSpike1() {
    MooMoo.sendPacket("c", 0, null)
    isReloaded = false
    let primary = MooMoo.myPlayer.inventory.primary;
    MooMoo.sendPacket("13c" , 0, 7, 0)
    MooMoo.sendPacket("13c", 0, 0, 1)
    MooMoo.sendPacket("13c", 0, 21, 1)
    MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.primary, true);
    let nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
    MooMoo.myPlayer.hit(nearestEnemyAngle);
}

function instaSpike2() {
    setTimeout(() => {
        MooMoo.sendPacket("13c", 0, 53, 0)
        let spike = MooMoo.myPlayer.inventory.spike;
        let nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
        MooMoo.myPlayer.place(spike, nearestEnemyAngle + anglechange(35));
        MooMoo.myPlayer.place(spike, nearestEnemyAngle + anglechange(315));
    }, 100);
    setTimeout(() => {
        MooMoo.sendPacket("13c", 0, 6, 0)
    }, 150)
}

function instaSpikeReload() {
    let primary = MooMoo.myPlayer.inventory.primary;
    setTimeout(() => {
        MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.primary, true);
    }, 200);
    setTimeout(() => {
        MooMoo.sendPacket("13c" , 0, 7, 0)
        MooMoo.sendPacket("13c", 0, 0, 1)
        MooMoo.sendPacket("13c", 0, 21, 1)
    }, 500);
    setTimeout(() => {
        isReloaded = true
    }, 1000)
}

// Normal hotkeys

function HoldSpike() {
    let myPlayer = MooMoo.myPlayer;
    MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.spike, false)
}
function HoldTrap() {
    let myPlayer = MooMoo.myPlayer;
    MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.trap, false)
}
function HoldTeleport() {
    let myPlayer = MooMoo.myPlayer;
    MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.turret, false)
}
function anglechange(angle) {
    return angle * 0.01745329251;
}
// Hacked hotkeys
function QuadSpike() {
    let myPlayer = MooMoo.myPlayer;
    let spike = MooMoo.myPlayer.inventory.spike;
    MooMoo.myPlayer.place(spike, myPlayer.dir + anglechange(0));
    MooMoo.myPlayer.place(spike, myPlayer.dir + anglechange(90));
    MooMoo.myPlayer.place(spike, myPlayer.dir + anglechange(180));
    MooMoo.myPlayer.place(spike, myPlayer.dir + anglechange(270));
}

function QuadBoost() {
    let myPlayer = MooMoo.myPlayer;
    let Boost = MooMoo.myPlayer.inventory.boostPad;
    MooMoo.myPlayer.place(Boost, myPlayer.dir + anglechange(0));
    MooMoo.myPlayer.place(Boost, myPlayer.dir + anglechange(90));
    MooMoo.myPlayer.place(Boost, myPlayer.dir + anglechange(180));
    MooMoo.myPlayer.place(Boost, myPlayer.dir + anglechange(270));
}
var millDir = "null"
function TripMill() {
    let myPlayer = MooMoo.myPlayer;
    let mill = MooMoo.myPlayer.inventory.mill
    if (millDir == "A") {
        MooMoo.myPlayer.place(mill, anglechange(0));
        MooMoo.myPlayer.place(mill, anglechange(90));
        MooMoo.myPlayer.place(mill, anglechange(270));
    }
    if (millDir == "S") {
        MooMoo.myPlayer.place(mill, anglechange(0));
        MooMoo.myPlayer.place(mill, anglechange(180));
        MooMoo.myPlayer.place(mill, anglechange(270));
    }
    if (millDir == "W") {
        MooMoo.myPlayer.place(mill, anglechange(0));
        MooMoo.myPlayer.place(mill, anglechange(90));
        MooMoo.myPlayer.place(mill, anglechange(180));
    }
    if (millDir == "D") {
        MooMoo.myPlayer.place(mill, anglechange(90));
        MooMoo.myPlayer.place(mill, anglechange(180));
        MooMoo.myPlayer.place(mill, anglechange(270));
    }
}

function QuadTurret() {
    let myPlayer = MooMoo.myPlayer;
    let Turret = MooMoo.myPlayer.inventory.turret;
    MooMoo.myPlayer.place(Turret, myPlayer.dir + anglechange(0));
    MooMoo.myPlayer.place(Turret, myPlayer.dir + anglechange(90));
    MooMoo.myPlayer.place(Turret, myPlayer.dir + anglechange(180));
    MooMoo.myPlayer.place(Turret, myPlayer.dir + anglechange(270));
}

function MiniBoostSpike() {
    let myPlayer = MooMoo.myPlayer;
    let spike = MooMoo.myPlayer.inventory.spike;
    let Boost = MooMoo.myPlayer.inventory.boostPad;
    let nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
    let nearestEnemyDistance = activePlayerManager.getClosestEnemyDistance();
    MooMoo.myPlayer.place(Boost, nearestEnemyAngle, anglechange(0));
    setTimeout(() => {
        MooMoo.myPlayer.place(spike, myPlayer.dir + anglechange(0));
        MooMoo.myPlayer.place(spike, myPlayer.dir + anglechange(90));
        MooMoo.myPlayer.place(spike, myPlayer.dir + anglechange(180));
        MooMoo.myPlayer.place(spike, myPlayer.dir + anglechange(270));
    }, nearestEnemyDistance);
}

function BoostSpike() {
    let myPlayer = MooMoo.myPlayer;
    let spike = MooMoo.myPlayer.inventory.spike;
    let Boost = MooMoo.myPlayer.inventory.boostPad;
    let nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
    MooMoo.myPlayer.place(Boost, nearestEnemyAngle + anglechange(0));
    MooMoo.myPlayer.place(spike, nearestEnemyAngle + anglechange(90));
    MooMoo.myPlayer.place(spike, nearestEnemyAngle + anglechange(270));
}

// AutoFighter
var autofight = false;
var Traper = "trap";
var autoReplacer = false;
var buildsNearPlayer = []

function automaticFighter() {
    let nearestEnemyDistance = activePlayerManager.getClosestEnemyDistance();
    let myPlayer = MooMoo.myPlayer;
    let trap = MooMoo.myPlayer.inventory.boostPad;
    let spike = MooMoo.myPlayer.inventory.spike;
    setTimeout(() => {
        if (nearestEnemyDistance < 300 && nearestEnemyDistance !== null) {
            if (Traper == "spike") {
                let nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
                MooMoo.myPlayer.place(spike, nearestEnemyAngle);
            }
        }
        if (nearestEnemyDistance < 200 && nearestEnemyDistance !== null) {
            if (Traper == "trap") {
                let nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
                MooMoo.myPlayer.place(trap, nearestEnemyAngle);
            }
        }
    }, 200)
}

// Visuals

var AUTOHEAL_SPEED = 100 // make lower if you clown too fast
var autoheal_on = true

const setStyles = element => {
    const styles = {
        position: "absolute"
        , top: "0px"
        , left: "0px"
        , color: "cyan"
        , fontFamily: "times"
        , fontSize: "20px"
    };

    Object.entries(styles)
        .forEach(([key, value]) => {
        element.style[key] = value;
    });
};
const displayGameInfo = () => {
    let myPlayer = MooMoo.myPlayer
    const gameInfoElement = document.createElement("div");
    setStyles(gameInfoElement);
    gameInfoElement.id = "playerPosition";
    document.body.appendChild(gameInfoElement);
    const GameUI = document.querySelectorAll("#chatBox, #upgradeHolder, #upgradeCounter, #allianceButton, #storeButton, #storeTab, #ageBar, #topInfoHolder, #resDisplay, #notificationDisplay, #chatButton, #mapDisplay, #storeHolder, #allianceHolder, #ageText");
    const mainMenuName = document.getElementById("gameName");
    const pingDisplay = document.getElementById("pingDisplay");
    const mainMenu = document.getElementById("mainMenu");
    const informationCard = document.getElementById("guideCard");
    const menuCard = document.getElementById("setupCard");
    const ad = document.getElementById("promoImgHolder");
    const death = document.getElementById("diedText");
    GameUI.forEach(element => {
        if (element.id !== "upgradeHolder") {
            if (element.id !== "upgradeCounter") {
                if (element.id !== "ageText") {
                    if (element.id !== "storeHolder") {
                        element.style.backgroundColor = "DodgerBlue";
                        element.style.color = "LightCyan";
                    }
                }
            }
        }
        if (element.id == "topInfoHolder" ) {
            element.style.backgroundImage = "url('data:image/jpeg;base64,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')";

        }
        if (element.id == "upgradeCounter") {
            element.style.color = "blue";
        }
        if (element.id == "ageText") {
            element.style.color = "blue";
        }
    });
    pingDisplay.style.color = "cyan";
    mainMenuName.textContent = "Pengiun Client";
    mainMenuName.style.color = "cyan";
    mainMenuName.style.fontSize = "150px";
    mainMenu.style.backgroundImage = "url('data:image/jpeg;base64,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')";
    informationCard.style.backgroundColor = "skyblue";
    menuCard.style.backgroundColor = "darkblue";
    ad.remove();
    death.textContent = "Don't give up!";
    death.style.color = "aqua";
    const updateGameInfo = () => {
        var nearestEnemyDistance = activePlayerManager.getClosestEnemyDistance();
        var nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
        document.getElementById("playerPosition")
            .innerText = `Auto_Placer: ${(autofight)} ~ 'O'
            Auto_RePlacer: ${(autoReplacer)} ~ ']'
        Spike/Trap Placer: ${(Traper)} ~ 'ArrowLeft'
        -------------------------------------------------------
        Anti_Insta: ${(isHeal)} ~ Hold Left Click
        Auto_heal: ${(autoheal_on)} ~ '9'
        Auto_heal Delay: ${(AUTOHEAL_SPEED)} MS ~ '-'/'='
        -------------------------------------------------------
        Insta_Reload: ${(isReloaded)}
        Auto_insta: ${(autoinsta)} ~ Key: [
        Insta_Type: ${(instaType)} ~ Key: BackQuote;
        -------------------------------------------------------
        Coords: ${(Math.round(MooMoo.myPlayer.x))}, ${(Math.round(MooMoo.myPlayer.y))}
        Player2Enemy_Distance: ${(Math.round(nearestEnemyDistance))}
        Player2Enemy_Angle: ${(Math.round(nearestEnemyAngle))}`;
    };

    setInterval(updateGameInfo, 10);
};
// Item Debuger

displayGameInfo();
MooMoo.addEventListener("loadGameObject", (data) => {
    let myPlayer = MooMoo.myPlayer
    let Data = data[0]
    let Build_sid = Data[0]
    let Build_X = Data[1]
    let Build_Y = Data[2]
    let Build_Dir = Data[3]
    let Build_Scale = Data[4]
    let Build_type = Data[5]
    let Build_ID_type = Data[6]
    let info = [`data:`, Build_sid, Build_X, Build_Y]
    let PlayerBuild_D = MooMoo.UTILS.getDistanceBetweenTwoPoints(MooMoo.myPlayer.x, MooMoo.myPlayer.y, Build_X, Build_Y);
    if (PlayerBuild_D < 125) {
        buildsNearPlayer.push(info)
    }
    if (Build_type == null) {
        console.log(`BuildINFO:
    SID: ${(Build_sid)} |~| ID: ${(Build_ID_type)}
    X_POS: ${(Build_X)} |~| Y_POS: ${(Build_Y)} |~| Direction: ${(Build_Dir)}
    Scale: ${(Build_Scale)} |~| Type: ${(Build_type)}`)
        if (Build_ID_type == 15 || Build_ID_type == 16) {
            console.log(`PitTrap/Boost Type`)
        }
        if (Build_ID_type == 6 || Build_ID_type == 7 || Build_ID_type == 8 || Build_ID_type == 9) {
            console.log(`Spike Type`)
        }
        if (Build_ID_type == 10 || Build_ID_type == 11 || Build_ID_type == 12) {
            console.log(`Mill Type`)
        }
        if (Build_ID_type == 17 || Build_ID_type == 18 || Build_ID_type == 19 || Build_ID_type == 20 || Build_ID_type == 21 || Build_ID_type == 22) {
            console.log(`Turret Type`)
        }
        if (Build_ID_type == 3 || Build_ID_type == 4 || Build_ID_type == 5) {
            console.log(`Wall Type`)
        }
        if (Build_ID_type == 13 || Build_ID_type == 14) {
            console.log(`Mine Type`)
        }
    }
})
MooMoo.addEventListener("killObject", (data) => {
    let sid = data[0]
    console.log(sid)
    console.log(buildsNearPlayer)
    if (autoReplacer == true) {
    for (let i = 0; i < buildsNearPlayer.length; i++) {
        for (let j = 0; j < buildsNearPlayer[i].length; j++) {
            if (buildsNearPlayer[i][j] === sid) {
                let BuildX = buildsNearPlayer[i][1]
                let BuildY = buildsNearPlayer[i][2]
                const buildAngle = Math.atan2(MooMoo.myPlayer.y - BuildY.y, MooMoo.myPlayer.x - BuildX.x)
                let myPlayer = MooMoo.myPlayer
                if (Traper == "spike") {
                    let spike = MooMoo.myPlayer.inventory.spike
                    MooMoo.myPlayer.place(spike, buildAngle);
                }
                if (Traper == "trap") {
                    let trap = MooMoo.myPlayer.inventory.trap
                    MooMoo.myPlayer.place(trap, buildAngle);
                }
                buildsNearPlayer.splice(i, i+1)
                break;
            }
        }
    }
    }
});
// AutoFight/insta
MooMoo.addEventListener("updatePlayers", (data) => {
    let nearestEnemyDistance = activePlayerManager.getClosestEnemyDistance();
    if (nearestEnemyDistance < 350) {
        if (autofight == true) {
            automaticFighter();
        }
    }
    if (autoinsta == true) {
        if (isReloaded == true) {
            if (instaType == 1 && nearestEnemyDistance < 200) {
                if (nearestEnemyDistance !== null) {
                    doAllInsta();
                }
            }
            if (instaType == 2 && nearestEnemyDistance < 150) {
                if (nearestEnemyDistance !== null) {
                    doAllInsta();
                }
            }
        }
    };
});
// Insta
function doAllInsta() {
    if (instaType == 1) {
        instaMusket1();
        instaMusket2();
        instaMusketReload();
    }
    if (instaType == 2) {
        instaSpike1();
        instaSpike2();
        instaSpikeReload();
    }
}
document.addEventListener('keydown', function (e) {
    // Normal hotkeys stuff
    if (e.keyCode == 86 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Space for Quad Spike
        HoldSpike();
    }
    if (e.keyCode == 70 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Space for Quad Spike
        HoldTrap();
    }
    if (e.keyCode == 72 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Space for Quad Spike
        HoldTeleport();
    }
    // Hack hotkeys stuff
    if (e.keyCode == 32 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Space for Quad Spike
        QuadSpike();
    }
    if (e.keyCode == 73 && document.activeElement.id.toLowerCase() !== 'chatbox') { // I for Quad Boost
        QuadBoost();
    }
    if (e.keyCode == 76 && document.activeElement.id.toLowerCase() !== 'chatbox') { // L for Quad Turret
        QuadTurret();
    }
    if (e.keyCode == 89 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Y for boost spike
        MiniBoostSpike();
    }
    if (e.keyCode == 78 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Y for boost spike
        TripMill();
    }
    // Autoplacer stuff
    if (e.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox') { // O for spike toggle
        if (autofight == false) {
            autofight = true;
        } else {
            autofight = false;
        }
    }
        if (e.keyCode == 221 && document.activeElement.id.toLowerCase() !== 'chatbox') { // ] for spike toggle
        if (autoReplacer == false) {
            autoReplacer = true;
        } else {
            autoReplacer = false;
        }
    }
    if (e.keyCode == 37 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Left arrow for spike/trap switch
        if (Traper == "trap") {
            Traper = "spike"
        } else {
            Traper = "trap"
        }
    }
    // Information
    if (e.keyCode == 38 && document.activeElement.id.toLowerCase() !== 'chatbox') { // "UpArrow" to toggle menu
        if (document.getElementById('playerPosition')
            .hidden == true) {
            document.getElementById('playerPosition')
                .hidden = false
        } else {
            document.getElementById('playerPosition')
                .hidden = true
        }
    }
    // Autoheal stuff
    if (e.keyCode == 187 && document.activeElement.id.toLowerCase() !== 'chatbox') { // "=" to increase autoheal speed
        AUTOHEAL_SPEED += 5
    }
    if (e.keyCode == 189 && document.activeElement.id.toLowerCase() !== 'chatbox') { // "-" to lower autoheal speed
        AUTOHEAL_SPEED -= 5
    }
    if (e.keyCode == 48 && document.activeElement.id.toLowerCase() !== 'chatbox') { // "0" to reset autoheal speed
        AUTOHEAL_SPEED = 100
    }
    if (e.keyCode == 57 && document.activeElement.id.toLowerCase() !== 'chatbox') { // "9" to toggle autoheal
        if (autoheal_on == true) {
            autoheal_on = false
        } else {
            autoheal_on = true
        }
    }
    // Insta stuff
    if (e.keyCode == 82 && document.activeElement.id.toLowerCase() !== 'chatbox') { // R for instakill
        if (isReloaded == true) {
            doAllInsta();
        }
    }
    if (e.keyCode == 219 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if (autoinsta == false) {
            autoinsta = true
        } else {
            autoinsta = false
        }
    }
    if (e.keyCode == 220 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if (instaType == 1) {
            instaType = 2
        } else {
            instaType = 1
        }
    }
    // Mill turners
    if (e.keyCode == 65 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        millDir = "A"
    }
    if (e.keyCode == 68 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        millDir = "D"
    }
    if (e.keyCode == 83 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        millDir = "S"
    }
    if (e.keyCode == 87 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        millDir = "W"
    }
    // Hat hotkeys stuff
    if (e.keyCode == 66 && document.activeElement.id.toLowerCase() !== 'chatbox') { // B for Solider + Corrupt X Wings
        Equip(6, 0);
        Equip(0, 1)
        Equip(21, 1);
    }
    if (e.keyCode == 85 && document.activeElement.id.toLowerCase() !== 'chatbox') { // U for uneuip hat + Equip Snowball
        Equip(0, 0);
        Equip(0, 1)
    }
    if (e.keyCode == 75 && document.activeElement.id.toLowerCase() !== 'chatbox') { // K for Turret gear + Corrupt X Wings
        Equip(53, 0);
        Equip(0, 1)
        Equip(21, 1);
    }
    if (e.keyCode == 16 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Shift for booster hat + Monkey tail
        Equip(12, 0);
        Equip(0, 1)
        Equip(11, 1);
    }
    if (e.keyCode == 188 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Comma for snow + monkey tail
        Equip(15, 0);
        Equip(0, 1)
        Equip(11, 1);
    }
    if (e.keyCode == 190 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Period for flipper + monkey tail
        Equip(31, 0);
        Equip(0, 1)
        Equip(11, 1);
    }
    if (e.keyCode == 90 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Z for tank gear + Corrupt X Wings
        Equip(40, 0);
        Equip(0, 1)
        Equip(21, 1);
    }
    if (e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox') { // T for bull helmet + Blood Wings
        Equip(7, 0);
        Equip(0, 1)
        Equip(18, 1);
    }
});
let isGKeyDown = false;
let isHeal = false;
// Boost spike stuff
document.addEventListener("keydown", (event) => {
    if (event.code === "KeyG" && document.activeElement.id.toLowerCase() !== 'chatbox') {
        isGKeyDown = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "KeyG" && document.activeElement.id.toLowerCase() !== 'chatbox') {
        isGKeyDown = false;
    }
});
setInterval(() => {
    if (isGKeyDown) {
        BoostSpike();
    }
}, 150);
// QHolder stuff
document.addEventListener("mousedown", function(event) {
    if (event.button === 2) { // check if the right mouse button is pressed
        var intervalID = setInterval(function() {
            isHeal = true;
            console.log("Right mouse button is still being held down");
        }, 50);

        document.addEventListener("mouseup", function handler(event) {
            if (event.button === 2) { // check if the right mouse button is released
                clearInterval(intervalID); // stop the continuous execution
                document.removeEventListener("mouseup", handler); // remove the handler
                isHeal = false;
                setTimeout(() => {
                    Equip(7, 0)
                }, 100)
                setTimeout(() => {
                    Equip(6, 0)
                }, 4000)
            }
        });
    }
});
// Healer
MooMoo.addEventListener("updatehealth", (data) => {
    let sid = data[0]
    let health = data[1]
    if (MooMoo.myPlayer.sid === sid && health < 100) {
        let food = MooMoo.myPlayer.inventory.food;
        if (isHeal == true) {
            MooMoo.myPlayer.place(food)
        }
        if (autoheal_on == true) {
            setTimeout(() => {
                MooMoo.myPlayer.place(food)
            }, AUTOHEAL_SPEED)
        }
    }
})