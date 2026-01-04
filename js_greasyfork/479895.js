// ==UserScript==
// @name         ZOMBS.IO ッ 𝔐𝙤໓
// @namespace    -
// @version      1
// @description  Press [=] for instructions
// @description 2 share to greasyfork= i hack your ip
// @author       :) || XD9230 lol#7911
// @match        *://zombs.io/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAMFBMVEX///8AAADw8PCamprp6emysrJNTU18fHzHx8doaGjZ2dnQ0NC9vb3h4eGnp6eMjIzCSNxaAAAErElEQVR4nO2c6baqMAyFKTKIOLz/214v6lF2SidaYK+V77dD04xNA1WlKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKFmp26Heew0ZqFtjTLv3KlYzifGk2Xsh6/iIYcxp76Ws4SvGk9veq0lmJoYx/d7rSaU2wGXvFaVyB0GGvReUilDJOe13RtO3ZR2sPrljaguCdGlZ8aXZx7lYAG+9MbUDSdKy4vC3EfexQIEwdn4HPqNxpaxjbqFDmzdmNH2QA/cgSEpWHAvGjPobkK7OD15QJQl2jsHP/Y9RXMOt5QGrSMiK6GjZAthlmP2u21oaVEm0heMvdMkLn1PjHnuWdoJPR1s4Box78tIB9F/P0oRKYrMi7kQ2y7rhyjxLw4XEmka37usOMIp4/F2oZIz6N9y3bJb19BIMI54fR5XEBS4sc+K2wQ1mKI/drivnB/jyuqUDwt/dm4ybGqMSNMy8B2Zh9m5/FyqJSO9X+GpOy6rkHnv8HT8esa2YtdauHJD+7izQhQaDVYLKzN6Kkf7uXBsGruAYimk9/7E/zt9FERx6LoEdyJgNP8j87twslDv0qJiqyQjQWtwlV+JRES24RAtCxFR3CMboEFY6wm6V6SdhhHf3SERDJeQvcLMyng1/iQrBST0uNMhC/SARipyGn1LNQzYs1qkUIdiVrhLOvPiVxEalHxmCXbpHsf2lI3phuds7EYIfjg9DKH34yz+o4AveFMkq2GUvP8GhuwbsLv56yT62qIJd9vJnKaewigmO1AXKky9RWfH14eEcaOobJZE3Mis6Pvx0qVO4fWASKXxRL7KiY+OaUGVMbOfqE/JgkmnnMN0Wv4AUWTHTiEP5kwggC5UsFdG2rj4hVJKl0YGBfYOZHFCJ5340FAgiJY6Ggl9r7jOl340K+DnfUmLIFlpAIRsN5LxV0uUrs8t3gay8VJJzsgwUstk4zrO8a3OGFcyyxU5UiG+UIxaI6OWTYSEwx26QDMuAKZZ1QBU9hHY+FU8GrArBKotVIeL0zKoQvMVnVYjoMLEqJPVG6GiIFgCpQnIN2O7O6uGugyAaGaRD6GIMwdXcPzJiEIz02RlhWKShV3b2SUNvmUbf9ggHIfX0yHGjwyJvIzkP6jWOYLI+WSbuuUkNS8rBaVhy1JPTsMRQGmkqtMhBWfTKyRxOB7HIQZnSZUJPfepyXyz+Qfm0uE0OxppXTOQYzraJzOeUAau2yUH4XohG1LuccljCrjGEL4GRZSKlHPIp2f/0dHLcxPggp39YzYpPjpstWhHKYVcHnRwL6mDL5/WCOtjqxLM1WD3TB1fdfhE96jdc6aOxpsD/bDI+motavpPgA9PxY9HHudzDIYa587hHYzs9feCJuk4xeKLVuBRwJ1iSedMupD8uLx8X0waTOprlrPHiwXAb1VwXCtw/OoI7A78UmWfoi3Br/VKY/vBWNTqD1MeqCCor+cYXSjEq680Tm3O8sd0REIpRydcV/ZD5OZnCLLoJlxiV7WHXyajYxKgsM3BcvvEFVUIScC3M/H2gFWM2BxfxToQj8nnYNeRtIYdmUkng20KOzanjjFOKoiiKoiiKwss/2hcaejBPt/YAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/479895/ZOMBSIO%20%E3%83%83%20%F0%9D%94%90%F0%9D%99%A4%E0%BB%93.user.js
// @updateURL https://update.greasyfork.org/scripts/479895/ZOMBSIO%20%E3%83%83%20%F0%9D%94%90%F0%9D%99%A4%E0%BB%93.meta.js
// ==/UserScript==


let serverCapacity;
let capacity = new XMLHttpRequest();
capacity.open("GET", "http://zombs.io/capacity", true);
capacity.onreadystatechange = () => {
    if(capacity.readyState === 4) {
        if(capacity.status === 200) {
            serverCapacity = JSON.parse(capacity.responseText);
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select > optgroup:nth-child(1)").label = `US East [${serverCapacity.regions["US East"].players} / ${serverCapacity.regions["US East"].capacity}]`;
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select > optgroup:nth-child(2)").label = `US West [${serverCapacity.regions["US West"].players} / ${serverCapacity.regions["US West"].capacity}]`;
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select > optgroup:nth-child(3)").label = `Europe [${serverCapacity.regions["Europe"].players} / ${serverCapacity.regions["Europe"].capacity}]`;
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select > optgroup:nth-child(4)").label = `Asia [${serverCapacity.regions["Asia"].players} / ${serverCapacity.regions["Asia"].capacity}]`;
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select > optgroup:nth-child(5)").label = `Australia [${serverCapacity.regions["Australia"].players} / ${serverCapacity.regions["Australia"].capacity}]`;
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select > optgroup:nth-child(6)").label = `South America [${serverCapacity.regions["South America"].players} / ${serverCapacity.regions["South America"].capacity}]`;
        };
    };
};
capacity.send();

const lololololol = `ッ hax`

let mapTimeouts = [];

function createCoordinates() {
    let x = document.createElement('div')
    x.innerHTML = `<p id="coords" style="color:brown;">â€ƒâ€ƒâ€ƒâ€ƒâ€ƒX: 0, Y: 0</p>
`
    x.style.textAlign = "center"
    document.querySelector("#hud > div.hud-bottom-left").append(x)
}

let mapMouseX;
let mapMouseY;
let hasBeenInWorld = false;
const uAgent = navigator.userAgent;
const isChromeOS = uAgent.includes('CrOS');
const isMac = uAgent.includes('Macintosh');
const isWindows = uAgent.includes('Windows');

function blurText(path) {
    document.querySelector(path)
        .style.color = "transparent";
    document.querySelector(path)
        .style.textShadow = "0 0 5px rgba(0,0,0,0.5)";
}

function focusText(path, originalColor) {
    document.querySelector(path)
        .style.color = originalColor;
    document.querySelector(path)
        .style.textShadow = "none";
}
setInterval(() => {
    try {
        if (window.isInMenu) {
            blurText('#scorelog')
            blurCanvas()
        } else {
            focusText('#scorelog', 'black')
            focusCanvas()
        }
    } catch (err) {
        // console.log('Cannot blur or focus canvas. This is most likely because the score logger has not been loaded yet. Error: ' + err);
    }
    _isInChatbox = document.querySelector('.hud-chat')
        .classList.contains('is-focused')
    if (botMode) {
        if (parseInt((getEntitiesByModel('Tree')[0][1].targetTick.position.x - game.world.getEntityByUid(game.world.getMyUid())
                      .targetTick.position.x)
                     .toString()
                     .replaceAll('-', '')) < 250) {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: "Tree @ Angle (in radians): " + getNearestTreeAngle()
            })
            danceRandom = false;
        } else {
            danceRandom = true;
        }
        if (parseInt((getEntitiesByModel('Stone')[0][1].targetTick.position.x - game.world.getEntityByUid(game.world.getMyUid())
                      .targetTick.position.x)
                     .toString()
                     .replaceAll('-', '')) < 250) {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: "Stone @ Angle (in radians): " + getNearestStoneAngle()
            })
        }
    }
}, 2.5)

function blurCanvas() {
    document.querySelector('canvas')
        .style.filter = "blur(8px)";
}

function focusCanvas() {
    document.querySelector('canvas')
        .style.filter = "none";
}
const version = "2.4.6";

const authors = ":)";

document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
console.log('%ceHaxx', 'color: green; background: yellow; font-size: 30px');
game.network.addEnterWorldHandler(function () {
    setTimeout(() => {
        game.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: "ッ hax v" + version + " (âœ“) made by " + authors
        })
    }, 500)


    document.querySelector("#hud > div.hud-bottom-center").style.textAlign = "center"
    document.querySelector("#hud > div.hud-bottom-center").style.color = "rgba(192, 192, 192, 0.75)"
    document.querySelector("#hud > div.hud-bottom-center").style.fontSize = "30px"
    setInterval(() => {
        document.querySelector("#hud > div.hud-top-right")
            .style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        document.querySelector("#hud > div.hud-top-right")
            .style.border = "5px solid rgba(0, 0, 0, 0.30)";
        document.querySelector("#hud-spell-icons")
            .style.border = "5px solid rgba(0, 0, 0, 0.30)";
        document.querySelector("#hud-menu-icons")
            .style.border = "5px solid rgba(0, 0, 0, 0.30)";
        document.querySelector("#hud-menu-icons")
            .childNodes.forEach((item) => (item.innerHTML = ""));
        document.querySelectorAll(".hud-toolbar-building")
            .forEach((item) => {
            (item.style.border = "5px solid rgba(0, 0, 0, 0.30)"), (item.style.babsdsd = "25%");
        });
        document.querySelector("#hud-debug")
            .style.color = "grey";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(1)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(2)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(3)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(4)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(5)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(6)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(1)")
            .style.border = "3px solid lightBlue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(2)")
            .style.border = "3px solid lightBlue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(3)")
            .style.border = "3px solid lightBlue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(4)")
            .style.border = "3px solid lightBlue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(5)")
            .style.border = "3px solid lightBlue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(6)")
            .style.border = "3px solid lightBlue";
        if (isChromeOS) {
            document.querySelector("#hud-menu-icons")
                .style.marginBottom = "120px";
        }
        document.querySelector("#hud-map")
            .style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        document.querySelector("#hud-map")
            .style.border = "5px solid rgba(0, 0, 0, 0.40)";
    }, 250);
    setTimeout(() => {
        if (!hasBeenInWorld) {
            var scoreLogged = 0;
            if(!hasBeenInWorld) {
                hasBeenInWorld = true
                setInterval(() => {
                    document.querySelector('#scorelog')
                        .innerText = `Score in Last Wave: ${scoreLogged}`
                    document.querySelector("#coords")
                        .innerText = `â€ƒâ€ƒâ€ƒâ€ƒâ€ƒâ€ƒX: ${game.world.localPlayer.entity.targetTick.position.x}, Y: ${game.world.localPlayer.entity.targetTick.position.y}`
                }, 100)
                createCoordinates()
            }
            hasBeenInWorld = true;
            document.querySelector("#hud > div.hud-bottom-center").append('ッ hax ')
            var oldScore = Game.currentGame.ui.playerTick.score,
                newScore = 0;
            Game.currentGame.network.addRpcHandler("DayCycle", () => {
                newScore = Game.currentGame.ui.playerTick.score;
                scoreLogged = ((newScore - oldScore)
                               .toLocaleString("en"));
                oldScore = Game.currentGame.ui.playerTick.score;
            });
            const topCenter = document.querySelector("#hud > div.hud-top-center");
            let logElem;
            logElem = document.createElement('div');
            logElem.innerHTML = `<h1 id="scorelog" style="color:white;">Score in Last Wave: 0</h1>`;
            topCenter.append(logElem);
        }
    }, 500)

})
var changeChat = true;
var hoverOver;
var mousemove;
addEventListener('mousemove', (e) => {
    mousemove = e;
})

function roundTenThousands(x) {
    if (x > 10000) {
        return x.toString()
            .slice(0, 3) + "00"
    } else {
        return x.toString()
    }
}

function roundMyPosition(e) {
    return {
        x: roundTenThousands(e.getPositionX()),
        y: roundTenThousands(e.getPositionY())
    }
}
/*
var mouseOverInterval = setInterval(() => {
	if (game.world.inWorld) {
		Object.entries(game.world.entities)
			.forEach((item => {
				if (roundMyPosition(item[1])
					.x == parseInt(roundTenThousands(game.renderer.screenToWorld(mousemove.clientX, mousemove.clientY)
						.x)) && roundMyPosition(item[1])
					.y == parseInt(roundTenThousands(game.renderer.screenToWorld(mousemove.clientX, mousemove.clientY)
						.y))) {
					hoverOver = 'Hovering over entity: ' + JSON.stringify(item[1].targetTick)
				} else {
					hoverOver = 'Hovering over no entities.'
				}
			}))
		document.querySelector('#hoverOver')
			.innerText = hoverOver;
	}
}, 100)
*/
var isSpamming = 0;

function pauseChatSpam(e) {
    if (!isSpamming) {
        if (e == "") {
            // e = "<-=_eHaxx_=->"
            e = lololololol
        }
        window.spammer = setInterval(() => {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: e
            })
        }, 100)
    } else if (isSpamming) {
        clearInterval(window.spammer)
    }
    isSpamming = !isSpamming
}
window.rainbowwww = false;

function degreesToYaw(deg) {
    let ans;
    if ((deg - 90) < 90) {
        ans = deg - 90
    } else if (deg == 90) {
        ans = deg + 90
    } else if (deg > 90) {
        ans = deg + 90
    }
    if (ans < 0) {
        ans = Math.abs(ans)
    }
}
if (localStorage.timesEhacked == undefined) {
    localStorage.timesEhacked = 1;
} else {
    localStorage.timesEhacked++;
}
document.title = "ッ hax | Times Played: " + localStorage.timesEhacked
var autoRespawn = false
let hue = 10
var settingsRainbow = document.querySelector("#hud-menu-settings")

function changeHue() {
    if (window.rainbowwww) {
        hue -= 20
    }
}

function getEntitiesByModel(type) {
    let entities = []
    Object.entries(game.world.entities)
        .forEach((item => {
        if (item[1].targetTick.model == type) {
            entities.push(item)
        }
    }))
    return entities;
}

function moveUp() {
    game.inputPacketScheduler.scheduleInput({
        down: 0,
        up: 1
    })
}

function moveDown() {
    game.inputPacketScheduler.scheduleInput({
        up: 0,
        down: 1
    })
}

function moveLeft() {
    game.inputPacketScheduler.scheduleInput({
        right: 0,
        left: 1
    })
}

function moveRight() {
    game.inputPacketScheduler.scheduleInput({
        left: 0,
        right: 1
    })
}
var danceCounter = 0
var danceRandom = true
var botMode = false
var danceInterval = setInterval(() => {
    if (botMode) {
        if (danceCounter < moves.length) {
            moves[danceCounter]()
            if (danceRandom) {
                danceCounter = Math.floor(Math.random() * moves.length)
            } else {
                danceCounter++
            }
        } else {
            danceCounter = 0;
        }
    }
}, 500)
var respawnInterval = setInterval(() => {
    if (document.querySelector('.hud-respawn')
        .style.display == "block" && autoRespawn) {
        game.inputPacketScheduler.scheduleInput({
            respawn: 1
        })
        document.querySelector('.hud-respawn')
            .style.display = "none"
    }
}, 10)
var moves = [moveUp, moveRight, moveDown, moveLeft]

function getNearestStoneAngle() {
    let stoneEntities = getEntitiesByModel('Stone');
    let firstStone = stoneEntities[0][1].targetTick;
    let player = game.world.localPlayer.entity.targetTick

    return Math.atan2(player.position.y - firstStone.position.y / 2,
                      player.position.x - firstStone.position.x)
}

function getNearestTreeAngle() {
    return Math.atan2(game.world.entities[game.world.getMyUid()].targetTick.position.y - getEntitiesByModel('Tree')[0][1].targetTick.position.y / 2, game.world
                      .entities[game.world.getMyUid()].targetTick.position.x - getEntitiesByModel('Tree')[0][1].targetTick.position.x)
}

function scanServer() {
    var current = []
    Object.entries(game.ui.getComponent('Leaderboard')
                   .playerNames)
        .forEach((item => {
        current.push(item)
    }))
    return JSON.stringify(current)
}
var leaveChats = ['POP', 'BING', 'TONG', 'RIIING', 'POOF']

function leaveChat() {
    let counter = 0;
    window.leaveChatInterval = setInterval(() => {
        if (counter < leaveChats.length) {
            doNewSend(['ch', [leaveChats[counter]]]);
            counter++;
        } else {
            counter = 0;
            clearInterval(window.leaveChatInterval);
            Game.currentGame.network.disconnect();
        };
    }, 1500);
};
window.startaito = false;
window.useSamePI = false
addEventListener('keyup', function (e) {
    if (e.key == "`" && !_isInChatbox) {
        game.inputManager.onKeyRelease({
            keyCode: 117
        })
    }
}) // debug info
var bw1 = "ðŸ˜ˆ Boss Waves [1/2]: 9, 17, 25, 33, 41, 49, 57, 65, 73, 81 ðŸ˜ˆ"
var bw2 = "ðŸ˜ˆ Boss Waves [2/2]: 89, 97, 105, 121 ðŸ˜ˆ"
window.ajsd = Math.random()
    .toString()
    .slice(0, 6)
console.log(window.ajsd)
var users = [
    {
        "name": "â˜­ ð‘’ð’½ âœ¨ ãƒ„ âœ“",
        "roles": ['Owner', 'Admin']
    }






    , {
        "name": "u7ðŸ¤—ãƒ„âœ”",
        "roles": ['Co-Owner', 'Admin']
    }






    , {
        "name": "â˜¢â‚¦É„â‚µâ± É†â‚³â±¤â˜£âœ”",
        "roles": ['Co-Owner', 'Admin']
    }






    , {
        "name": "â¦•NRâ¦–â˜­ð‘’ð’½âœ¨ãƒ„âœ“",
        "roles": ['Owner', 'Admin']
    }






    , {
        "name": "Potato Bot",
        "roles": ['Admin', 'Leaker']
    }






    , {
        "name": "â¦•NRâ¦– F3AR ãƒ„",
        "roles": ['Admin', 'Official']
    }






    , {
        "name": "Yazeet",
        "roles": ['Stealer']
    }
]
var q = [
    {
        word: "is",
        answers: ['Naw', 'Yup.'],
        random: true
    }






    , {
        word: "will",
        answers: ['Outlook good.', 'Perhaps.', 'Yup.', 'Naw'],
        random: true
    }






    , {
        word: "when",
        answers: ['Soon.', 'Never.'],
        random: true
    }






    , {
        word: "are",
        answers: ['Yup.', 'Naw', 'Perhaps.'],
        random: true
    }]
let ppInterval = setInterval(() => { // show private parties
    if (document.querySelector('#showpp')
        .checked) {
        document.querySelectorAll('.hud-party-link')
            .forEach((elem => {
            if (elem.style.display == "none") {
                elem.style.display = "block"
                elem.childNodes[0].innerText = elem.childNodes[0].innerText + "[PRIVATE]"
                elem.addEventListener('click', function () {
                    game.ui.getComponent('PopupOverlay')
                        .showHint('Cannot join this party as it is private', 1e4)
                })
            }
        }))
    }
}, 3000) // show private parties

window.lpSave = []

const altSpace = "â€€" // alternate space character

String.prototype.multiChatSpaces = function () {
    return this.replaceAll(' ', altSpace)
}
var chatAnims = {
    makeRect: [
        "________________________"






        , "| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |"






        , "________________________"
    ],
    makeCircle: [
        "   â•±â€¾â€¾â€¾â€¾â€¾â•²"






        , "  /         \\"






        , " |            |"






        , "  \\          /"






        , "   â•²_____â•±"
    ]
} // :D
window.use_di = true;
window.isInMenu = false;

function doorWall() {
    var stashPosition = getGoldStash()
    PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
    PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + 96, stashPosition.y + -192, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + -96, stashPosition.y + -288, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + -24, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -72, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -120, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -168, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -216, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -264, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -312, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -360, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -408, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -456, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -504, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -552, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 24, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 72, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 120, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 168, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 216, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 264, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -600, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -648, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -696, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -744, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -792, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -792, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -744, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -696, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -648, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -600, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -552, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -504, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -456, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -408, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -360, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -312, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -264, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -216, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -168, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -120, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -72, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -24, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 24, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 72, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 120, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 168, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 216, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 264, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 312, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 360, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 408, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 456, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 504, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 552, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 600, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 648, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 696, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 744, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 792, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -792, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -744, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -696, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -648, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -600, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -552, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -504, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -456, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -408, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -360, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -216, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -168, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -72, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 24, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -312, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -264, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -120, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -24, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 72, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 120, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 168, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 216, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 264, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 312, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 360, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 456, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 408, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 504, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 552, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 600, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 648, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 696, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 744, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 792, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 792, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 744, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 696, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 648, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 600, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 552, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 504, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 456, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 408, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 360, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 312, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 264, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 216, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 168, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 120, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 72, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 24, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -24, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -72, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -168, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -264, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -312, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -360, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -408, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -456, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -504, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -552, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -600, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -648, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -216, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -120, 'Door', 180);
    PlaceBuilding(stashPosition.x + 312, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 360, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 408, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 456, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 504, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 552, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 600, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 648, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 696, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 744, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 792, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -792, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -744, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -696, 'Door', 180);
}
var animChat = {
    makeRect: function () {
        let counter = 0;
        let rectInterval = setInterval(() => {
            if (counter < chatAnims.makeRect.length) {
                doNewSend(['ch', [chatAnims.makeRect[counter].multiChatSpaces()]])
                counter++
            } else {
                counter = 0
                clearInterval(rectInterval)
            }
        }, 3000)
        },
    makeCircle: function () {
        let counter = 0;
        let circleInterval = setInterval(() => {
            if (counter < chatAnims.makeCircle.length) {
                doNewSend(['ch', [chatAnims.makeCircle[counter].multiChatSpaces()]])
                counter++
            } else {
                counter = 0
                clearInterval(circleInterval)
            }
        }, 3000)
        }
}

function btnChatCircle() {
    animChat.makeCircle()
}

function btnChatRect() {
    animChat.makeRect()
}

function upgradeAll() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: obj.fromTick.uid
        })
    }
    doNewSend(['ch', ['â™¦ï¸ Upgraded All! â™¦ï¸']])
}

function movePlayer(e) {
    if (!_isInChatbox) {
        switch (e.toLowerCase()
                .replaceAll(' ', '')) {
            case "a":
                Game.currentGame.network.sendInput({
                    left: 1
                })
                break;
            case "d":
                Game.currentGame.network.sendInput({
                    right: 1
                })
                break;
            case "w":
                Game.currentGame.network.sendInput({
                    up: 1
                })
                break;
            case "s":
                Game.currentGame.network.sendInput({
                    down: 1
                })
                break;
        }
    }
}
var emojis = [
    {
        text: ":happy:",
        char: "ðŸ˜„"
    }






    , {
        text: ":sad:",
        char: "ðŸ˜¥"
    }






    , {
        text: ":angry:",
        char: "ðŸ˜ "
    }






    , {
        text: ":laughing:",
        char: "ðŸ˜‚"
    }






    , {
        text: ":stop:",
        char: "ðŸ›‘"
    }






    , {
        text: ":revenge:",
        char: "ðŸ˜ˆ"
    }






    , {
        text: ":smiley:",
        char: "ãƒ…"
    }






    , {
        text: ":pog:",
        char: "ÌŠ<ÌŠ"
    }]

function heal() {
    Game.currentGame.network.sendRpc({
        "name": "BuyItem",
        "itemName": "HealthPotion",
        "tier": 1
    })
    Game.currentGame.network.sendRpc({
        "name": "EquipItem",
        "itemName": "HealthPotion",
        "tier": 1
    })
    Game.currentGame.network.sendRpc({
        "name": "BuyItem",
        "itemName": "PetHealthPotion",
        "tier": 1
    })
    Game.currentGame.network.sendRpc({
        "name": "EquipItem",
        "itemName": "PetHealthPotion",
        "tier": 1
    })
}

function getGoldStash() {
    let entities = Game.currentGame.ui.buildings
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        let obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}

function PlaceBuilding(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
var isBowing = false;
var slotChars = [
    {
        char: "7ï¸âƒ£",
        value: 33
    }






    , {
        char: "ðŸŽ",
        value: 10
    }






    , {
        char: "ðŸ”",
        value: 25
    }






    , {
        char: "ðŸ¥“",
        value: 15
    }






    , {
        char: "âš½",
        value: 12
    }






    , {
        char: "ðŸ¾",
        value: 10
    }






    , {
        char: "1ï¸âƒ£",
        value: 27
    }






    , {
        char: "ðŸ’¡",
        value: 30
    }]
console.log(slotChars)
window.generateSlots = function () { // fp is the returned array, fs is the joined | fp string, pp is the score
    let fp = [];
    let fs = "";
    let pp = 0;
    var f1 = slotChars[Math.floor(Math.random() * slotChars.length)]
    fp.push(f1.char)
    pp += f1.value
    var f2 = slotChars[Math.floor(Math.random() * slotChars.length)]
    fp.push(f2.char)
    pp += f2.value
    var f3 = slotChars[Math.floor(Math.random() * slotChars.length)]
    fp.push(f3.char)
    pp += f3.value
    fs = [fp.join('|'), pp + " / 99"]
    return fs;
}

function ahrc1() { // 1 ahrc (collect and refuel), used in lpinterval
    var entities = Game.currentGame.world.entities
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        let obj = entities[uid];
        Game.currentGame.network.sendRpc({
            name: "CollectHarvester",
            uid: obj.fromTick.uid
        });
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 1) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.07
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 2) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.11
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 3) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.17
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 4) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.22
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 5) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.25
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 6) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.28
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 7) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.42
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 8) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.65
            });
        }
    }
}
var lpinterval = setInterval(function () { // loaded player info, ahrc, isInMenu, noob = chatbot
    document.querySelector('#lpi')
        .innerText = "Loaded Player Info: " + JSON.stringify(window.loadedIDS())
    if (window.ahrc) {
        ahrc1()
    }
    window.isInMenu = document.querySelector('#hud-menu-settings')
        .style.display == "block" ? true : false
    if ((window.lpSave[window.lpSave.length - 1] !== loadedPlayers()[loadedPlayers()
                                                                     .length - 1]) && document.querySelector('#noobchat')
        .checked) {
        doNewSend(['ch', ['NOOB = ' + loadedPlayers()[Math.floor(Math.random() * loadedPlayers()
                                                                 .length)]]])
        window.lpSave = loadedPlayers()
    }
    document.querySelector("#hud-menu-party > div.hud-party-grid > div.hud-party-joining")
        .style.display = "none"
}, 250)
// enable/disable chat
// ðŸŸ© ðŸŸ¥
function enDisAbleEmj(bool, txt) {
    return bool ? "ðŸŸ© " + txt + " Enabled ðŸŸ©" : "ðŸŸ¥ " + txt + " Disabled ðŸŸ¥"
}
// disable enable in chat
window.cmdsEnabled = true
// these are all button event listeners --->
function toggleCmds() {
    window.cmdsEnabled = !window.cmdsEnabled
    if (changeChat) {
        doNewSend(['ch', [enDisAbleEmj(window.cmdsEnabled, "Commands")]])
    }
    document.querySelector('#togglecmd')
        .innerText = window.cmdsEnabled ? "Disable Commands" : "Enable Commands"
}

function sellAll() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model !== "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold All ðŸ’°']])
}

function sellWalls() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Wall") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Walls ðŸ’°']])
}

function sellBombTowers() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "BombTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Bomb Towers ðŸ’°']])
}

function sellGoldMines() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "GoldMine") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Gold Mines ðŸ’°']])
}

function sellArrowTowers() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "ArrowTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Arrow Towers ðŸ’°']])
}

function sellSlowTraps() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "SlowTrap") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Slow Traps ðŸ’°']])
}

function sellCannonTowers() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "CannonTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Cannon Towers ðŸ’°']])
}

function sellMageTowers() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "MagicTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Mage Towers ðŸ’°']])
}

function sellMeleeTowers() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "MeleeTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Melee Towers ðŸ’°']])
}

function sellHarvesters() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Harvester") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Harvesters ðŸ’°']])
}

function sellDoors() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Door") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Doors ðŸ’°']])
}
// <--- end of button event listeners
//
document.querySelector('.hud-chat-input')
    .addEventListener('keypress', function (e) {
    emojis.forEach((item => {
        this.value = this.value.replaceAll(item.text, item.char)
    }))
    if (e.keyCode == 13) { // exclude commands and html entities
        this.value = this.value.replaceAll('fuck', 'fucâ€Œk')
            .replaceAll('FUCK', 'FUCâ€ŒK')
            .replaceAll('shit', 'shiâ€Œt')
            .replaceAll('SHIT', 'SHIâ€ŒT')
            .replaceAll('bitch', 'bitâ€Œch')
            .replaceAll('BITCH', 'BITâ€ŒCH')
            .replaceAll('ass', 'asâ€Œs')
            .replaceAll('ASS', 'ASâ€ŒS')
            .replaceAll('dick', 'dicâ€Œk')
            .replaceAll('DICK', "DICâ€ŒK")
            .slice(0, 63) // anti censor C:
        if (this.value.toLowerCase()
            .includes('nigg') || this.value.toLowerCase()
            .includes('niga') || this.value.toLowerCase()
            .includes('nig ') || this.value.toLowerCase()
            .includes('nige')) {
            this.value = "I am a building, don't be racist"
        }
    }
})
var insults = ["you smooth brained potato", "you rotten pumpkin brain", "you soggy zuicini", "you watered down banana"





               , "you're orange juice toothpaste flavored"] // just an array of insults
// menu stuff (defining & appending) --->
var settingsHTML = `
<h3>ð“®ð“—ð“ªð”ð”</h3>
<hr>
<input type="text" id="spamchat" placeholder="Message" class="menu-textbox">
<br>
<button class="btn btn-purple ehack-btn" style="border-radius:25%" id="spamchatbtn">Split Chat</button>
<br>
<input type="text" id="spmchinput" placeholder="Message" class="menu-textbox">
<br>
<button class="btn btn-purple ehack-btn" style="border-radius:25%" id="togglespmch">Enable Chat Spam</button>
<hr>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="clearchatbtn">Clear Chat</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="upgradeallbtn">Upgrade All</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="mainxaito">Enable Aito</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="walldoor">Wall of Doors</button>
<hr>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="idkbtn33">Chat Leave Sounds</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="idkbtn22">Chat Rectangle</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="idkbtn11">Chat Circle</button>
<hr>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="resetinsultsbtn">Reset Insults</button>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="togglecmd">Disable Commands</button>
<button class="btn btn-red ehack-btn ehack-btn" style="border-radius:25%" id="toggleahrc">Enable AHRC</button>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="toggleab">Enable AutoBow</button>
<hr>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="togglebot">Enable Bot Mode</button>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="toggleresp">Enable Auto Respawn</button>
<hr>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellall">Sell All</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellwalls">Sell Walls</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="selldoors">Sell Doors</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="selltraps">Sell Traps</button>
<hr>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellmines">Sell Gold Mines</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellarrows">Sell Arrows</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellcannons">Sell Cannons</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellmelees">Sell Melees</button>
<hr>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellbombs">Sell Bombs</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellmages">Sell Mages</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellharvesters">Sell Harvesters</button>
<hr>
<button class="btn btn-gold ehack-btn" style="border-radius:25%" id="menu-leaveparty-btn">Leave Party</button>
<br>
<input type="text" class="menu-textbox" id="menu-jpbsk-input" placeholder="Party share key">
<br>
<button class="btn btn-gold ehack-btn" style="border-radius:25%" id="menu-jpbsk-btn" onclick='Game.currentGame.network.sendRpc({name:"JoinPartyByShareKey", partyShareKey: document.querySelector("#menu-jpbsk-input").value})'>Join Party By Share Key</button>
<hr>
<button class="btn btn-white ehack-btn" style="border-radius:25%" onclick="Game.currentGame.network.disconnect()">Disconnect</button>
<hr>
<p style="font-size:10px;">Use default insults?</p><input type="checkbox" id="use-di" checked>
<br>
<p style="font-size:10px;">Show private parties?</p><input type="checkbox" id="showpp" checked>
<br>
<p style="font-size:10px;">Noob chat?</p><input type="checkbox" id="noobchat">
<br>
<p style="font-size:10px;">Advanced Player Info?</p><input type="checkbox" id="advancedlpi">
<br>
<p style="font-size:10px;">Zoom On Scroll?</p><input type="checkbox" id="zos">
<br>
<p style="font-size:10px;">CopyCat?</p><input type="checkbox" id="copycat">
<br>
<p style="font-size:10px;">Death Chat?</p><input type="checkbox" id="deadchat">
<br>
<p style="font-size:10px;">Enable/Disable Chat?</p><input type="checkbox" id="apexmode" checked>
<hr>
<p id="lpi">Loaded Player Info: </p>
<style>
.menu-textbox{
    border-radius:25%;
    background-color: rgba(171, 183, 183, 0.25);
    border: 2px solid black;
    color:white;
}
.ehack-btn:hover{
border: 3px solid grey;
}
</style>
` // aka mod menu
settingsHTML.id = "modmenu"
document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHTML;
document.querySelector('#clearchatbtn')
    .addEventListener('click', function () {
    document.querySelector('.hud-chat-messages')
        .innerHTML = ""
    console.clear()
    Game.currentGame.network.sendRpc({
        name: "SendChatMessage",
        channel: "Local",
        message: "âœ¨ Cleared Chat âœ¨"
    })
})
document.querySelector('#sellbombs')
    .addEventListener('click', sellBombTowers)
document.querySelector('#sellarrows')
    .addEventListener('click', sellArrowTowers)
document.querySelector('#sellcannons')
    .addEventListener('click', sellCannonTowers)
document.querySelector('#sellmages')
    .addEventListener('click', sellMageTowers)
document.querySelector('#sellall')
    .addEventListener('click', sellAll)
document.querySelector('#selltraps')
    .addEventListener('click', sellSlowTraps)
document.querySelector('#selldoors')
    .addEventListener('click', sellDoors)
document.querySelector('#sellmines')
    .addEventListener('click', sellGoldMines)
document.querySelector('#sellwalls')
    .addEventListener('click', sellWalls)
document.querySelector('#sellmelees')
    .addEventListener('click', sellMeleeTowers)
document.querySelector('#sellharvesters')
    .addEventListener('click', sellHarvesters)

function onLeaveParty() {
    Game.currentGame.network.sendRpc({
        name: "LeaveParty"
    })
}
document.querySelector('#use-di')
    .addEventListener('change', function () {
    var THIS_DI_EVENT = this
    game.ui.getComponent('PopupOverlay')
        .showConfirmation('Are you sure you want to change default insults? This will reset all custom insults', 1e4, function () {
        if (THIS_DI_EVENT.checked) {
            insults = ["you smooth brained potato", "you rotten pumpkin brain", "you soggy zuicini", "you watered down banana"





                       , "you're orange juice toothpaste flavored"]
            game.ui.getComponent('PopupOverlay')
                .showHint('Successfully activated default insults.', 1e4)
            window.use_di = true
            if (changeChat) {
                doNewSend(['ch', ['âš™ï¸ Activated Use Default Insults âš™ï¸']])
            }
        } else {
            insults = ["There are no insults, use !addinsult to add one!"]
            game.ui.getComponent('PopupOverlay')
                .showHint('Successfully deactivated default insults.', 1e4)
            window.use_di = false
            if (changeChat) {
                doNewSend(['ch', ['âš™ï¸ Deactivated Use Default Insults âš™ï¸']])
            }
        }
    }, function () {
        game.ui.getComponent('PopupOverlay')
            .showHint('OK!', 1e4)
    })
})
document.querySelector('#menu-leaveparty-btn')
    .addEventListener('click', onLeaveParty)
document.querySelector('#showpp')
    .addEventListener('change', function () {
    var THIS_PP_EVENT = this;
    if (THIS_PP_EVENT.checked) {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Activated Show Private Parties âš™ï¸']])
        }
    } else {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Deactivated Show Private Parties âš™ï¸']])
        }
    }
})
document.querySelector('#copycat')
    .addEventListener('change', function () {
    var THIS_CC_EVENT = this;
    if (THIS_CC_EVENT.checked) {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Activated CopyCat âš™ï¸']])
        }
    } else {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Deactivated CopyCat âš™ï¸']])
        }
    }
})
document.querySelector('#deadchat')
    .addEventListener('change', function () {
    var THIS_DC_EVENT = this;
    if (THIS_DC_EVENT.checked) {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Activated Death Chat âš™ï¸']])
        }
    } else {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Deactivated Death Chat âš™ï¸']])
        }
    }
})
document.querySelector('#noobchat')
    .addEventListener('change', function () {
    var THIS_NC_EVENT = this;
    if (THIS_NC_EVENT.checked) {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Activated Noob Chat âš™ï¸']])
        }
    } else {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Deactivated Noob Chat âš™ï¸']])
        }
    }
})
// <--- end of menu stuff (defining & appending)
// also event listeners on the menu forgot to add that at start of script
var removeDeleted = function (e) { // remove deleted/empty/undefined/null items in an array
    let fp = []
    for (let i = 0; i < e.length; i++) {
        if (e[i] !== undefined) {
            fp.push(e[i])
        }
    }
    return fp;
}

function loadedPlayers() { // loaded player names
    var returns = []
    Object.entries(Game.currentGame.world.entities)
        .forEach((stuff => {
        if (stuff[1].targetTick.entityClass == "PlayerEntity" && ((stuff[1].targetTick.uid !== Game.currentGame.world.entities[Game.currentGame
                                                                                                                               .world.getMyUid()].targetTick.uid) || window.useSamePI)) {
            returns.push(stuff[1].targetTick.name)
        }
    }))
    return returns;
}
window.loadedIDS = function () {
    var returns = []
    Object.entries(Game.currentGame.world.entities)
        .forEach((stuff => {
        if (stuff[1].targetTick.entityClass == "PlayerEntity" && ((stuff[1].targetTick.uid !== Game.currentGame.world.entities[Game.currentGame
                                                                                                                               .world.getMyUid()].targetTick.uid) || window.useSamePI)) {
            var h = stuff[1].targetTick
            if (document.querySelector('#advancedlpi')
                .checked) {
                returns.push(JSON.stringify(h))
            } else {
                returns.push(stuff[1].targetTick.name + " - Wood: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.wood +
                             ", Stone: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.stone + ", Gold: " + Game.currentGame
                             .world.entities[stuff[1].targetTick.uid].targetTick.gold)
            }
        }
    }))
    return returns;
}

function spamchatclick() { // used to be called spam chat, its split chat now
    var user = document.querySelector('#spamchat')
    .value
    splitChatLength(user)
}
document.querySelector('#spamchatbtn')
    .addEventListener('click', spamchatclick)
document.querySelector('#resetinsultsbtn')
    .addEventListener('click', resetInsults)

function resetInsults() {
    if (window.use_di) {
        insults = ["you smooth brained potato", "you rotten pumpkin brain", "you soggy zuicini", "you watered down banana"





                   , "you're orange juice toothpaste flavored"]
    } else {
        insults = ["There are no insults, use !addinsult to add one!"]
    }
    doNewSend(['ch', ["âœ… Successfully reset insults âœ…"]])
}
document.querySelector('#togglecmd')
    .addEventListener('click', toggleCmds)
var balls = ["Outlook good.", "Really?", "Perhaps.", "Definitely not.", "Yup.", "Are you retarded?", "Naw", "Yup.", "Yup."]
var breadEaten = 0
var cmdInterval = setInterval(function () {
    if (game.world.isInWorld) {
        if (window.cmdsEnabled) {
            var playerName = Game.currentGame.world.entities[Game.currentGame.world.getMyUid()].targetTick.name
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].slice(1, 4) == "!ch") {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                            .length - 1].innerText.split(':')[1].slice(4)
                })
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].slice(1, 7) == "!bread") {
                breadEaten++;
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "ðŸžðŸžðŸž @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                         .length - 1].innerText.split(':')[0] + " has eaten bread! " + breadEaten + " people have eaten bread! ðŸžðŸžðŸž"
                })
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].slice(1, 13) == "!willigetagf") {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "ðŸ’ The chances of you getting a girlfriend are " + Math.floor(Math.random() * 10) + "%! @" + document
                    .querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                           .length - 1].innerText.split(':')[0] + " ðŸ’"
                })
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].slice(1, 9) == "!insults") {
                var insultCounteRz = 1;
                var innsultSInterval = setInterval(() => {
                    if (insultCounteRz <= (insults.length)) {
                        doNewSend(['ch', ['ðŸ“– Insults [' + insultCounteRz + "/" + (insults.length) + "]: " + insults[insultCounteRz - 1] +
                                          " ðŸ“–"]])
                        insultCounteRz++;
                    } else {
                        insultCounteRz = 0;
                        clearInterval(innsultSInterval)
                    }
                }, 1500)
                }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].slice(1)
                .includes('**')) {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "âŒ Don't fucâ€Œking swear you bitcâ€Œh @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll(
                        '.hud-chat-message')
                                                                                                                    .length - 1].innerText.split(':')[0] + " âŒ"
                })
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.toLowerCase()
                .split(':')[1].slice(1, 7) == "!8ball") {
                q.forEach((item => {
                    if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                       .length - 1].innerText.toLowerCase()
                        .split(':')[1].includes(item.word)) {
                        window.ball = item.answers[Math.floor(Math.random() * item.answers.length)]
                    } else {
                        window.ball = balls[Math.floor(Math.random() * balls.length)]
                    }
                }))
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "ðŸŽ± Magic 8Ball answered with " + window.ball + " ðŸŽ±"
                })
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.toLowerCase()
                .split(':')[1].slice(1, 10) == "!commands") {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "ðŸ’» Commands [1/3]: !8ball,!ch,!bread,!insult,!addinsult ðŸ’»"
                })
                setTimeout(function () {
                    Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "ðŸ’» Commands [2/3]: !willigetagf, !slots, !boss, !insults ðŸ’»"
                    })
                }, 1500)
                setTimeout(function () {
                    Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "ðŸ’» Commands [3/3]: none ðŸ’»"
                    })
                }, 3000)
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.toLowerCase()
                .split(':')[1].slice(1, 6) == "!boss") {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: bw1
                })
                setTimeout(function () {
                    Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: bw2
                    })
                }, 1500)
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.toLowerCase()
                .split(':')[1].slice(1, 11) == "!addinsult") {
                if (!insults.includes(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                     .length - 1].innerText.toLowerCase()
                                      .split(':')[1].slice(11))) {
                    if (window.use_di) {
                        insults.push(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                    .length - 1].innerText.toLowerCase()
                                     .split(':')[1].slice(11))
                    } else {
                        insults = []
                        insults.push(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                    .length - 1].innerText.toLowerCase()
                                     .split(':')[1].slice(11))
                    }
                    Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "ðŸ“ Added to insults ðŸ“"
                    })
                } else {
                    Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "âŒ That insult already exists âŒ"
                    })
                }
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.toLowerCase()
                .split(':')[1].slice(1, 8) == "!insult" && document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                                          .length - 1].innerText.split(':')[1].slice(1, 9) !== "!insults") {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "ðŸ“ " + insults[Math.floor(Math.random() * insults.length)] + " @" + loadedPlayers()[Math.floor(Math.random() *
                                                                                                                             loadedPlayers()
                                                                                                                             .length)] + " ðŸ“"
                })
            }
            if (document.querySelector('#hud-respawn')
                .style.display == "block" && document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                            .length - 1].innerText.split(':')[1] !== (playerName + " thinks that whoever killed them is an idiot!") && document.querySelector(
                '#deadchat')
                .checked) {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: (playerName + " thinks that whoever killed them is an idiot!")
                })
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].slice(1, 7) == "!slots") {
                var f = window.generateSlots()
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "ðŸŽ° @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                     .length - 1].innerText.split(':')[0] + " Your slots results are: " + f[0] + " with a score of " + f[1] + "! ðŸŽ°"
                })
            }

            function getUserRoles(s) {
                users.forEach((item => {
                    if (item.name == s) {
                        return item.roles
                    } else {
                        return []
                    }
                }))
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].includes('!disconnect ' + window.ajsd) && (users[0].name == document.querySelectorAll(
                '.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                     .length - 1].innerText.split(':')[0] || users[1].name == document.querySelectorAll('.hud-chat-message')[document
                                                                                                                                             .querySelectorAll('.hud-chat-message')
                                                                                                                                             .length - 1].innerText.split(':')[0] || users[2].name == document.querySelectorAll('.hud-chat-message')[document
						.querySelectorAll('.hud-chat-message')
						.length - 1].innerText.split(':')[0] || users[3].name == document.querySelectorAll('.hud-chat-message')[document
                                                                                                                                .querySelectorAll('.hud-chat-message')
                                                                                                                                .length - 1].innerText.split(':')[0] || document.querySelectorAll('.hud-chat-message')[document.querySelectorAll(
                '.hud-chat-message')
						.length - 1].innerText.split(':')[0].toLowerCase()
                                                                                                                                               .includes('pot') || users[4].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
						.length - 1].innerText.toLowerCase()
                                                                                                                                               .split(':')[0])) {
                document.querySelector('.hud-chat-messages')
                    .innerHTML = ""
                console.clear()
                doNewSend(['ch', ['Bye have a great day!']])
                Game.currentGame.network.disconnect()
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].includes('!eid') && (users[0].name == document.querySelectorAll('.hud-chat-message')[document
						.querySelectorAll('.hud-chat-message')
						.length - 1].innerText.split(':')[0] || users[1].name == document.querySelectorAll('.hud-chat-message')[document
                                                                                                                                .querySelectorAll('.hud-chat-message')
                                                                                                                                .length - 1].innerText.split(':')[0] || users[2].name == document.querySelectorAll('.hud-chat-message')[document
						.querySelectorAll('.hud-chat-message')
						.length - 1].innerText.split(':')[0] || users[3].name == document.querySelectorAll('.hud-chat-message')[document
                                                                                                                                .querySelectorAll('.hud-chat-message')
                                                                                                                                .length - 1].innerText.split(':')[0] || document.querySelectorAll('.hud-chat-message')[document.querySelectorAll(
                '.hud-chat-message')
						.length - 1].innerText.split(':')[0].toLowerCase()
                                                                                                                         .includes('pot') || users[4].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
						.length - 1].innerText.toLowerCase()
                                                                                                                         .split(':')[0])) {
                doNewSend(['ch', [window.ajsd]])
            }
        }
    }
}, 750)
let dimension = 1;
const onWindowResize = () => {
    if (!window.isInMenu && window.zoomonscroll) {
        const renderer = Game.currentGame.renderer;
        let canvasWidth = window.innerWidth * window.devicePixelRatio;
        let canvasHeight = window.innerHeight * window.devicePixelRatio;
        let ratio = canvasHeight / (1080 * dimension);
        renderer.scale = ratio;
        renderer.entities.setScale(ratio);
        renderer.ui.setScale(ratio);
        renderer.renderer.resize(canvasWidth, canvasHeight);
        renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
        renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
    }
} // Zoom by Apex, modified by eh
onWindowResize();
var transparentMenu = false;
window.onresize = onWindowResize;
window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension += 0.02;
        onWindowResize();
    } else if (e.deltaY < 0) {
        dimension -= 0.02;
        onWindowResize();
    }
}
var _isInChatbox = false;
window.isChatting = 0

function doNewSend(sender) {
    if (sender[0] == "ch") {
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: sender[1][0]
        })
    }
}

function splitChatLength(text) {
    let i = 0;
    window.chatSetInterval = setInterval(function () {
        if (i < text.length) {
            doNewSend(['ch', [text.slice(i, i + 45)]])
            i += 45;
        } else {
            clearInterval(window.chatSetInterval)
        }
    }, 1500)
}
addEventListener('keydown', function (e) {
    if (!_isInChatbox && e.key == "/") {
        document.querySelector("#hud-menu-settings")
            .style.display = document.querySelector("#hud-menu-settings")
            .style.display == "none" ? "block" : "none"
        document.querySelector("#hud-menu-shop")
            .style.display = "none"
        document.querySelector("#hud-menu-party")
            .style.display = "none"
    }
    if (!_isInChatbox && e.key == "-") {
        Game.currentGame.network.sendRpc({
            name: "BuyItem",
            itemName: "Crossbow",
            tier: 1
        });
        Game.currentGame.network.sendRpc({
            name: "EquipItem",
            itemName: "Crossbow",
            tier: 1
        });
    }
    if (e.key == "u" && !_isInChatbox) {
        transparentMenu = !transparentMenu
        console.log('done')
    } else if (e.key == "=" && !_isInChatbox) {
        game.ui.getComponent("PopupOverlay").showHint(
            'Say !commands in chat for the chat commands, press [/] for menu, press [=] for help and press [u] for transparent menu. Left click somewhere on the minimap to automatically move there.',
            1.5e4
        )
    }
})
document.querySelector('#toggleahrc')
    .addEventListener('click', function () {
    window.ahrc = !window.ahrc
    document.querySelector('#toggleahrc')
        .innerText = window.ahrc ? "Disable AHRC" : "Enable AHRC"
    if (changeChat) {
        doNewSend(['ch', [enDisAbleEmj(window.ahrc, 'AHRC')]])
    }
})

function autoBow() {
    if (isBowing) {
        isBowing = false
        clearInterval(window.bow)
    } else {
        isBowing = true
        if (Game.currentGame.ui.inventory.Bow) {
            Game.currentGame.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: Game.currentGame.ui.inventory.Bow.tier
            })
            window.bow = setInterval(function () {
                Game.currentGame.inputPacketScheduler.scheduleInput({
                    space: 1
                })
                Game.currentGame.inputPacketScheduler.scheduleInput({
                    space: 0
                })
                Game.currentGame.inputPacketScheduler.scheduleInput({
                    space: 0
                })
            }, 0);
        }
    }
    document.querySelector('#toggleab')
        .innerText = isBowing ? "Disable AutoBow" : "Enable AutoBow"
    doNewSend(['ch', [isBowing ? "ðŸŸ© Enabled AutoBow ðŸŸ©" : "ðŸŸ¥ Disabled AutoBow ðŸŸ¥"]])
}
document.querySelector('#toggleab')
    .addEventListener('click', autoBow)
document.querySelector('#upgradeallbtn')
    .addEventListener('click', upgradeAll)

function onChangePP() {
    game.ui.getComponent('PopupOverlay')
        .showHint('This may take a bit to apply, so be patient')
}
document.querySelector('#showpp')
    .addEventListener('change', onChangePP)
document.querySelector('#idkbtn11')
    .addEventListener('click', btnChatCircle)
document.querySelector('#idkbtn22')
    .addEventListener('click', btnChatRect)
document.querySelector('#advancedlpi')
    .addEventListener('change', function (e) {
    var THIS_LPI_EVENT = this;
    if (THIS_LPI_EVENT.checked) {
        doNewSend(['ch', ['âš™ï¸ Activated Advanced Player Info âš™ï¸']])
    } else {
        doNewSend(['ch', ['âš™ï¸ Deactivated Advanced Player Info âš™ï¸']])
    }
})
document.querySelector('#zos')
    .addEventListener('change', function (e) {
    var THIS_ZOS_EVENT = this;
    window.zoomonscroll = THIS_ZOS_EVENT.checked
    if (THIS_ZOS_EVENT.checked) {
        doNewSend(['ch', ['âš™ï¸ Activated Zoom On Scroll âš™ï¸']])
    } else {
        doNewSend(['ch', ['âš™ï¸ Deactivated Zoom On Scroll âš™ï¸']])
    }
})
// AITO from Main X (credit to pot for giving me this)
window.sendAitoAlt = () => {
    if (window.startaito) {
        let ws = new WebSocket(`ws://${Game.currentGame.options.servers[Game.currentGame.options.serverId].hostname}:8000`);
        ws.binaryType = "arraybuffer";
        ws.onclose = () => {
            ws.isclosed = true;
        }
        ws.onopen = () => {
            ws.network = new Game.currentGame.networkType();
            ws.network.sendEnterWorldAndDisplayName = (t) => {
                ws.network.sendPacket(4, {
                    displayName: t
                });
            };
            ws.network.sendInput = (t) => {
                ws.network.sendPacket(3, t);
            };
            ws.network.sendRpc = (t) => {
                ws.network.sendPacket(9, t);
            };
            ws.network.sendPacket = (e, t) => {
                if (!ws.isclosed) {
                    ws.send(ws.network.codec.encode(e, t));
                }
            };
            ws.network.sendEnterWorldAndDisplayName(localStorage.name);
        }
        ws.onEnterWorld = () => {
            // useless
        }
        ws.onmessage = msg => {
            ws.data = ws.network.codec.decode(msg.data);
            if (ws.data.uid) {
                ws.uid = ws.data.uid;
            }
            if (ws.data.name) {
                ws.dataType = ws.data;
            }
            if (!window.startaito && !ws.isclosed) {
                ws.isclosed = true;
                ws.close();
            }
            if (ws.verified) {
                if (!ws.isDay && !ws.isclosed) {
                    ws.isclosed = true;
                    ws.close();
                    window.sendAitoAlt();
                }
            }
            if (ws.data.name == "DayCycle") {
                ws.isDay = ws.data.response.isDay;
                if (ws.isDay) {
                    ws.verified = true;
                }
            }
            if (ws.data.name == "Dead") {
                ws.network.sendInput({
                    respawn: 1
                });
            }
            if (ws.data.name == "Leaderboard") {
                ws.lb = ws.data;
                if (ws.psk) {
                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.getPlayerPartyShareKey()
                    });
                    if (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) {
                        ws.network.sendRpc({
                            name: "BuyItem",
                            itemName: "Pause",
                            tier: 1
                        });
                    }
                }
            }
            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
            }
            switch (ws.data.opcode) {
                case 4:
                    ws.onEnterWorld(ws.data);
                    break;
            }
        }
    }
}

function toggleAito() {
    if (window.startaito) {
        window.startaito = false;
    } else {
        window.startaito = true;
        window.sendAitoAlt()
    }
    doNewSend(['ch', [window.startaito ? "ðŸŸ© Enabled Aito ðŸŸ©" : "ðŸŸ¥ Disabled Aito ðŸŸ¥"]])
    document.querySelector('#mainxaito')
        .innerText = window.startaito ? "Disable Aito" : "Enable Aito"
}
document.querySelector('#mainxaito')
    .addEventListener('click', toggleAito)
document.querySelector('#idkbtn33')
    .addEventListener('click', leaveChat)
Game.currentGame.network.addRpcHandler('ReceiveChatMessage', (e) => {
    if (e.uid !== game.world.getMyUid() && document.querySelector('#copycat')
        .checked) {
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: e.message
        })
    }
    if (e.message.toLowerCase()
        .includes('ligma')) {
        doNewSend(['ch', ['LIGMA BALLS BITCH AHAHA @' + e.displayName]])
    }
})
document.querySelector('#togglebot')
    .addEventListener('click', function () {
    botMode = !botMode
    this.innerText = botMode ? "Disable Bot Mode" : "Enable Bot Mode"
    if (changeChat) {
        doNewSend(['ch', [enDisAbleEmj(botMode, "Bot Mode")]])
    }
})
document.querySelector('#toggleresp')
    .addEventListener('click', function () {
    autoRespawn = !autoRespawn
    this.innerText = autoRespawn ? "Disable Auto Respawn" : "Enable Auto Respawn"
    if (changeChat) {
        doNewSend(['ch', [enDisAbleEmj(autoRespawn, "Auto Respawn")]])
    }
})/*
window.lol = setInterval(changeHue, 50)
window.rainbow = setInterval(() => {
    if (!transparentMenu) {
        settingsRainbow.style.backgroundColor = `hsla(${hue}, 25%, 30%, 0.45)`
		document.querySelector("#hud-menu-settings > div")
            .style.backgroundColor = `rgba(0, 0, 0, 0.25)`
	} else {
        settingsRainbow.style.backgroundColor = `rgba(0, 0, 0, 0)`
		document.querySelector("#hud-menu-settings > div")
            .style.backgroundColor = `rgba(0, 0, 0, 0)`
	}
}, 10)*/
document.querySelector('#togglespmch')
    .addEventListener('click', function () {
    pauseChatSpam(document.querySelector('#spmchinput')
                  .value)
    if (changeChat) {
        doNewSend(['ch', [enDisAbleEmj(isSpamming, "Chat Spam")]])
    }
    this.innerText = isSpamming ? "Disable Spam Chat" : "Enable Spam Chat"
})
document.querySelector('#walldoor')
    .addEventListener('click', doorWall)
document.querySelector('#apexmode')
    .addEventListener('change', function () {
    changeChat = this.checked
})
// ==UserScript==
// @name         ZoGUI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes the ZOMBS.io ui look better!
// @author       ehScripts
// @match        zombs.io
// @grant        none
// ==/UserScript==
// addEventListener('load', function(e){

// })

// $("body")
// .css('cursor', 'url(https://ani.cursors-4u.net/cursors/cur-13/cur1163.png), default');
// ==UserScript==
// @name         ZoGUI Extras
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A background for the ZoGUI menus, and some other stuff.
// @author       ehScripts
// @match        http://zombs.io/
// @grant        none
// ==/UserScript==
var css;
var style;
if (localStorage.loadReminder == undefined) {
    localStorage.loadReminder = true;
    alert(
        'enjoy my hack :)'
    )
} else if (Math.floor(Math.random() * 3) === 2) {
    alert(
        'enjoy my hack :)'
    )
}

setTimeout(() => {

    document.querySelector("#hud-intro > div.hud-intro-wrapper > h2")
        .innerHTML = ":)"
    document.querySelector("#hud-intro > div.hud-intro-wrapper > h1 > small")
        .remove()
    document.querySelector("#hud-intro > div.hud-intro-wrapper > h1")
        .innerHTML = "🔮★シ𝔐𝙤໓✔🔮<small>.</small>"
    document.querySelector("#hud-intro > div.hud-intro-wrapper > h1")
        .style.color = "rgba(128, 0, 128, 0.75)"
    css =
        '.hud-intro::after { background: url(\'https://cutewallpaper.org/21/wallpaper-gif-1920x1080/Gif-Background-Space-1920x1080-Backgrounds-For-Html-Gif-.gif\'); background-size: cover; }';
    style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    css =
        '.hud-intro-footer { background: url(\'https://cutewallpaper.org/21/wallpaper-gif-1920x1080/Gif-Background-Space-1920x1080-Backgrounds-For-Html-Gif-.gif\'); background-size: cover; }';
    style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    document.querySelector("#hud-intro > div.hud-intro-corner-bottom-right > div")
        .remove()
    document.querySelector("#hud-intro > div.hud-intro-corner-top-left > div > a")
        .remove()
    document.querySelector("#hud-intro > div.hud-intro-corner-top-left > div > h3")
        .innerText = "by :)"
    document.querySelector("#hud-intro > div.hud-intro-corner-top-right > div")
        .style.opacity = "0.55"
    document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > input")
        .style.backgroundColor = "rgba(255, 255, 255, 0.80)"
    document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select")
        .style.backgroundColor = "rgba(255, 255, 255, 0.80)"
    document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > input")
        .style.border = "2px solid grey"
    document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select")
        .style.border = "2px solid grey"
}, 100)
// document.querySelector('.hud-top-left').appendChild($('#hud-health-bar')[0]);
function moveNext(targetX, targetY) {
    let player = game.world.localPlayer.entity.targetTick.position
    if (player.x <= targetX && player.y <= targetY) {
        game.network.sendInput({
            right: 1,
            left: 0,
            up: 0,
            down: 1
        })
        doNewSend(['ch', ['MapMover - Moving RightDown']])
    } else if (player.x >= targetX && player.y <= targetY) {
        game.network.sendInput({
            right: 0,
            left: 1,
            up: 0,
            down: 1
        })
        doNewSend(['ch', ['MapMover - Moving LeftDown']])
    } else if (player.x <= targetX && player.y >= targetY) {
        game.network.sendInput({
            right: 1,
            left: 0,
            up: 1,
            down: 0
        })
        doNewSend(['ch', ['MapMover - Moving RightUp']])
    } else if (player.x >= targetX && player.y >= targetY) {
        game.network.sendInput({
            right: 0,
            left: 1,
            up: 1,
            down: 0
        })
        doNewSend(['ch', ['MapMover - Moving LeftUp']])
    }
}

function isXYCloseTo(x, y) {
    let playerTargetTick = game.world.localPlayer.entity.targetTick.position;
    const radius = 50;
    // console.log('checking if xy position is close to target position')
    return ((x <= (playerTargetTick.x + radius) && x >= (playerTargetTick.x - radius)) && (y <= (playerTargetTick.y + radius) && y >= (playerTargetTick.y -
                                                                                                                                       radius)));
}

let moveIsActive = false;

function goToPos(x, y) {
    moveIsActive = true;
    window.goToPosInterval = setInterval(() => {
        moveNext(x, y)
    }, 250)
    window.checkPosInterval = setInterval(() => {
        if (moveIsActive) {
            if (isXYCloseTo(x, y)) {
                doNewSend(['ch', ['MapMover: Done!']])
                game.network.sendInput({
                    left: 0,
                    right: 0,
                    up: 0,
                    down: 0
                })
                game.ui.getComponent('PopupOverlay')
                    .showHint('Finished moving!', 1e4)
                moveIsActive = false;
                mapTimeouts.forEach((item => { clearTimeout(item) }))
                clearInterval(window.goToPosInterval)
                clearInterval(window.checkPosInterval)
            }
        } else {
            game.network.sendInput({
                left: 0,
                right: 0,
                up: 0,
                down: 0
            })
            doNewSend(['ch', ['MapMover: Unexpectedly shut down']])
            mapTimeouts.forEach((item => { clearTimeout(item) }))
            game.ui.getComponent('PopupOverlay')
                .showHint('MapMover unexpectedly stopped', 1e4)
            clearInterval(window.checkPosInterval)
        }
    }, 10)
    let g = setTimeout(() => {
        clearInterval(window.goToPosInterval)
        game.ui.getComponent('PopupOverlay')
            .showHint('It has been 4 minutes to move to the position on the map, so it has automatically stopped to prevent infinite loops.', 1e4)
        moveIsActive = false;
        game.network.sendInput({
            left: 0,
            right: 0,
            up: 0,
            down: 0
        })
    }, 240000)
    mapTimeouts.push(g)
}
let mapContainer = document.createElement('div')

mapContainer.id = "hud-map-container"
document.querySelector('.hud-bottom-left')
    .append(mapContainer)
$('#hud-map')
    .appendTo(document.querySelector('#hud-map-container'))
document.querySelector("#hud-map-container")
    .addEventListener('mousemove', function (e) {
    var offset = $('#hud-map-container')
    .offset();
    // Then refer to
    mapMouseX = e.pageX - offset.left;
    mapMouseY = e.pageY - offset.top;
})

document.querySelector("#hud-map-container")
    .addEventListener('click', function (e) {
    if (!moveIsActive) {
        mapTimeouts.forEach((item => { clearTimeout(item) }))
        let yn = "y"
        game.ui.getComponent('PopupOverlay').showConfirmation('Are you sure you want to move to X:' + (mapMouseX * 170.4390625) + ",Y:" + (mapMouseY * 171.9977142857143) + '? You can right click the minimap to cancel this at any time.', 5e3, function() {
            if (yn.toLowerCase() == "y") {
                game.ui.getComponent('PopupOverlay').showHint('Starting MapMove...', 3e3)
                let moveToMapX = (mapMouseX * 170.4390625)
                let moveToMapY = (mapMouseY * 171.9977142857143)
                goToPos(moveToMapX, moveToMapY)
            }
        }, function() {
            game.ui.getComponent('PopupOverlay').showHint('OK, did not start MapMove', 3e3)
        })
    } else {
        moveIsActive = false;
        clearInterval(window.goToPosInterval)
        clearInterval(window.checkPosInterval)
        game.network.sendInput({
            left: 0,
            right: 0,
            up: 0,
            down: 0
        })
        mapTimeouts.forEach((item => { clearTimeout(item) }))
        game.ui.getComponent('PopupOverlay').showHint('MapMove is already in process. Restarting and moving to X:' + (mapMouseX * 170.4390625) + ",Y:" + (mapMouseY * 171.9977142857143) + '. You can right click the minimap to cancel this at any time.', 5e3)
        let yn = "y"
        if (yn.toLowerCase() == "y") {
            let moveToMapX = (mapMouseX * 170.4390625)
            let moveToMapY = (mapMouseY * 171.9977142857143)
            goToPos(moveToMapX, moveToMapY)
        }
    }
})

document.querySelector('#hud-map-container').addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    if(moveIsActive) {
        game.ui.getComponent('PopupOverlay').showConfirmation('Are you sure you want to cancel the current MapMove process?', 5e3, function() {
            moveIsActive = false;
            clearInterval(window.goToPosInterval)
            clearInterval(window.checkPosInterval)
            game.network.sendInput({
                left: 0,
                right: 0,
                up: 0,
                down: 0
            })
            game.ui.getComponent('PopupOverlay').showHint('Successfully stopped MapMover.', 3e3)
            mapTimeouts.forEach((item => { clearTimeout(item) }))
        }, function() {
            game.ui.getComponent('PopupOverlay').showHint('OK, did not stop MapMover.', 3e3)
        })
    } else {
        game.ui.getComponent('PopupOverlay').showHint('You are not in a MapMover process right now. Left click somewhere on the minimap to start one.')
    }
    return false;
}, false);

setInterval(() => {
    if(document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-left > a")) {
        document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-left > a").remove()
    }
    if(document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-guide")) {
        document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-guide").remove()
    }
    if(document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-left > div")) {
        document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-left > div").remove()
    }
}, 10)
//eHaxx