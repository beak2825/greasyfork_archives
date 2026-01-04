// ==UserScript==
// @name         zombia.io - Dyno
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  First all-purpose public zombia script. Updates will be released frequently, improving the ui and adding functions.
// @author       gjdcr
// @match        zombia.io
// @icon         https://media.discordapp.net/attachments/1163605097884946473/1210374593492160583/10.png?ex=65ea542e&is=65d7df2e&hm=543e65a1956cfb401d0338cbec10178874b410a4261f77a276202a969415e5cb&=&format=webp&quality=lossless&width=432&height=432
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507235/zombiaio%20-%20Dyno.user.js
// @updateURL https://update.greasyfork.org/scripts/507235/zombiaio%20-%20Dyno.meta.js
// ==/UserScript==
let css = `
.btn:hover {
    cursor: pointer;
}

.hud-scripts {
    top: 25%;
    border-radius: 4px;
    width: 56px;
    margin-left: 0%;
    height: 56px;
    background: #0000001a;
    position: fixed;
    display: block;
    border: 2px solid transparent;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.8); /* Enhanced initial glow */
    animation: glow 1.5s infinite alternate; /* Glowing animation */
}

@keyframes glow {
    0% {
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.6); /* Less intense glow */
    }
    100% {
        box-shadow: 0 0 25px rgba(255, 255, 255, 1); /* More intense glow */
    }
}

.hud-scripts-menu {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 40%;
    height: 50%;
    background: #00000080;
    color: #fff;
    justify-content: center;
    z-index: 9999;
    overflow-y: auto;
    padding: 20px;
    transform: translate(-50%, -50%);
}


body.menu-open {
    overflow: hidden;
}

.hud-spell-icons .hud-spell-icon[data-type="Scripts"]::before {
    background-image: url("https://cdn.glitch.com/65698807-c047-4e77-bf51-7937b4cef560%2Finventory-timeout%5B1%5D.svg?v=1611216944842");
}
  .color-pad {
            padding: 5px;
            border: 1px solid #ccc;
            margin: 10px;
        }
        #colorCode {
            display: block;
            margin-top: 10px;
        }
/* Glowing border effect for .hud-intro-settings */
.hud-intro-settings {
    border: 2px solid transparent;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); /* Initial glow */
    animation: settingsGlow 1.5s infinite alternate; /* Glowing animation */
}

@keyframes settingsGlow {
    0% {
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); /* Less intense glow */
    }
    100% {
        box-shadow: 0 0 20px rgba(255, 255, 255, 1); /* More intense glow */
    }
}

/* Glowing border effect for .hud-intro-form */
.hud-intro-form {
    border: 2px solid transparent;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); /* Initial glow */
    animation: formGlow 1.5s infinite alternate; /* Glowing animation */
}

@keyframes formGlow {
    0% {
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    100% {
        box-shadow: 0 0 20px rgba(255, 255, 255, 1);
    }
}

.hud-intro-modes {
    border: 2px solid transparent;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    animation: modesGlow 1.5s infinite alternate;
}

@keyframes modesGlow {
    0% {
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    100% {
        box-shadow: 0 0 20px rgba(255, 255, 255, 1);
    }
}
`;
let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css));
document.head.appendChild(styles);
styles.type = "text/css";
let isInitialized = false;
const urlQueries = window.location.hash.split("/");
let sessionSaverWs;

function getElem(DOMClass) {
    return document.getElementsByClassName(DOMClass);
}
let menu = document.createElement('div')
menu.classList.add("hud-scripts");
menu.setAttribute("scripts-type", "Scripts");
menu.onclick = "MNU()";
document.body.appendChild(menu)
let menuMenu = document.createElement("div");
menuMenu.classList.add("hud-scripts-menu");
menuMenu.maxheight="50%";
menuMenu.innerHTML = `
<div style="text-align:center"><br>
<button class="M1" style="text-align:center" onclick="window.mainxbygridtype('M1G');" style="width: 30%">Graphics</button>
<button class="M2" style="text-align:center" onclick="window.mainxbygridtype('M2G');" style="width: 30%">Raiding</button>
<button class="AB" style="text-align:center" onclick="window.mainxbygridtype('ABG');" style="width: 30%">Base</button>
<div class="M1G" style="display: none;">
<br>
<br>
<button class="btn btn-blue 7z" onclick="toggleDebug();">Start debug</button>
<button class="btn btn-blue" onclick="getPing();">Get Ping</button>
<br>
<br>
<button class="btn btn-blue 1z" onclick="groundLayer();">Stop Rendering Ground</button>
<button class="btn btn-blue 6z" onclick="scenery();">Stop Rendering Scenery</button>
<br>
<br>
<button class="btn btn-blue 4z" onclick="projectiles();">Stop Rendering Projectiles</button>
<button class="btn btn-blue 5z" onclick="buildings();">Stop Rendering Buildings</button>
<br>
<br>
<button class="btn btn-blue 3z" onclick="players();">Stop Rendering Players</button>
<button class="btn btn-blue 2z" onclick="zombieLayer();">Stop Rendering Zombies</button>
<br>
<br>
 <button class="btn btn-blue" onclick="selectGround();">Set Ground Color</button>
    <input id="colorPicker" class="color-pad" type="color" value="#698d41">
    <div id="colorCode">Hex Code: #698d41</div>
    <br>
</div>
<div class="M2G" style="display: none;">
<br>
<br>
<br>
<br>
<button class="btn btn-blue 19SA" onclick="toggleXkey();">Start X Key</button>
<button class="btn btn-blue 8z" onclick="clearMsgs();">Clear Messages</button>
<br>
<br>
<button class="btn btn-blue chatspambutton">Enable chat spam</button>
<input class="btn chatspam" type="text" style="width: 45%;" placeholder="Message To Spam" value="spam">
</div>
<div class="ABG" style="display: none;">
<br>
<br>
<input class="btn basename" type="text" style="width: 45%;" placeholder="Base Name">
<button class="btn btn-blue saveb" onclick="saveBuildings();">Record Base</button>
<button class="btn btn-blue buildb" onclick="buildBase();">Build Base</button>
<button class="btn btn-blue delb" onclick="delBase();">Delete Base</button>
<input type="text" class="saveb2" placeholder='Code of the base will appear here...' style="width: 100%" disabled="true">
<br>
<br>
<button class="btn btn-blue 9z" onclick="sellAll();">Sell All</button>
<br>
<br>
<button class="btn btn-blue" id="autoRebuildBtn" onclick="toggleAutoRebuild();">Enable Auto Rebuild</button>
<button class="btn btn-blue" id="autoUpgradeBtn" onclick="toggleAutoUpgrade();">Enable Auto Upgrade</button>
<br>
<br>
<button class="btn btn-blue 20SA" onclick="togglerapidfire();">Enable Auto Rapidfire</button>
<input class="btn rfpercent" type="text" style="width: 10%; vertical-align: middle;" value="90">
<span style="vertical-align: middle;">%</span>
<br>
<br>
<button class="btn btn-blue 21SA" onclick="toggleuth();">Enable Uth</button>
<input class="btn uthpercent" type="text" style="width: 10%; vertical-align: middle;" value="40">
<span style="vertical-align: middle;">%</span>
<br>
<br>
<button class="btn btn-blue 23SA" onclick="toggleautoaimplayer();">Enable Player Auto Aim</button>
<button class="btn btn-blue 22SA" onclick="toggleautoaimzombie();">Enable Zombie Auto Aim</button>
</div>
`;



window.mainxbygridtype = function(type) {
    document.getElementsByClassName("M1G")[0].style.display = "none";
    document.getElementsByClassName("M2G")[0].style.display = "none";
    document.getElementsByClassName("ABG")[0].style.display = "none";

    document.getElementsByClassName("M1")[0].innerText = "Graphics";
    document.getElementsByClassName("M2")[0].innerText = "Raiding";
    document.getElementsByClassName("AB")[0].innerText = "Base";

    document.getElementsByClassName(type.split("G")[0])[0].innerText = "~ Selected ~";
    document.getElementsByClassName(type)[0].style.display = "";
}
document.body.appendChild(menuMenu);
let openMenu = true;
menu.onclick = function() {
    if (openMenu == true) {
        menuMenu.style.display = (menuMenu.style.display === 'none' || menuMenu.style.display === '') ? 'flex' : 'none';
        openMenu = false;
    } else {
        menuMenu.style.display = (menuMenu.style.display === 'flex' || menuMenu.style.display === '') ? 'none' : 'flex';
        openMenu = true;
    };
};
let isMenuOpen = false;

document.addEventListener('keydown', (event) => {

    if (event.key === '\\') {
        toggleMenu();
    }
});

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    menuMenu.style.display = isMenuOpen ? 'flex' : 'none';
    document.body.classList.toggle('menu-open', isMenuOpen);
}

/**-----------------------INTRO STUFF-----------------------**/
//Yt thing
    const newYouTubeUrl = 'https://www.youtube.com/@Woltk_91';
    const newLinkText = 'Woltk';

    function updateYouTubeLink() {
        const linkElement = document.querySelector('a.btn-youtube#hud-featured-youtuber');
        if (linkElement) {
            linkElement.href = newYouTubeUrl;
            linkElement.textContent = newLinkText;
        }
    }

    updateYouTubeLink();

    setInterval(updateYouTubeLink, 1000);
//Discord thing
    const newDiscordInviteUrl = 'https://discord.gg/Wtjd5rXnGQ';

    function updateDiscordLink() {
        const linkElement = document.querySelector('a.btn.btn-discord');
        if (linkElement) {
            linkElement.href = newDiscordInviteUrl;
        }
    }

    updateDiscordLink();

    setInterval(updateDiscordLink, 1000);


/**-----------------------GRAPHICS-----------------------**/

function toggleScriptsMenu() {
    const menu = document.querySelector('.hud-scripts-menu');
    const body = document.body;

    if (menu.style.display === 'none' || !menu.style.display) {
        menu.style.display = 'flex';
        body.classList.add('menu-open');
    } else {
        menu.style.display = 'none';
        body.classList.remove('menu-open');
    }
}
        window.selectGround = function() {
    if (window.groundLayer1) {
        game.renderer.groundLayer.setVisible(false);
        window.groundLayer1 = false;
        document.getElementsByClassName("1z")[0].innerText = "Start Rendering Ground";
    }

    const colorCode = document.getElementById('colorPicker').value;
    const color = parseInt(colorCode.slice(1), 16);

    if (game && game.renderer && game.renderer.renderer && game.renderer.renderer.renderer) {
        game.renderer.renderer.renderer.background.color = color;
    } else {
        console.error('Game renderer not found.');
    }

    document.getElementById('colorCode').textContent = `Hex Code: ${colorCode}`;
};

document.getElementById('colorPicker').addEventListener('input', function() {
    const colorCode = this.value;
    document.getElementById('colorCode').textContent = `Hex Code: ${colorCode}`;
});

//Zoom
const initializeZoom = () => {
    if (game && game.renderer && game.renderer.zoomDimension && game.renderer.onWindowResize) {
        window.onwheel = (e) => {
            const menu = document.querySelector('.hud-scripts-menu');

            if (menu.style.display === 'none' || !menu.style.display) {

                if (e.deltaY > 0 && game.renderer.zoomDimension < 40) {
                    game.renderer.zoomDimension *= 1.05;
                    game.renderer.zoomDimension += 0.02;
                    game.renderer.onWindowResize();
                }
                if (e.deltaY < 0 && game.renderer.zoomDimension > 0.5) {
                    game.renderer.zoomDimension *= 0.95;
                    game.renderer.zoomDimension -= 0.02;
                    game.renderer.onWindowResize();
                }
            }
        };

        clearInterval(zoomInterval);
    }
};

const zoomInterval = setInterval(initializeZoom, 100);



//Keep rss
game.renderer.oldRemove = game.renderer.remove
game.renderer.remove = (e) => {
    if (e.entityClass === "Resource") return
    game.renderer.oldRemove(e)
}

//Get ping
window.getPing = () => {
  game.ui.components.uiPopupOverlay.showHint(`${game.network.getPing()} ms`);
}
//Hide ground
    window.groundLayer1 = true;

    window.groundLayer = () => {
        window.groundLayer1 = !window.groundLayer1;

        if (window.groundLayer1) {
            game.renderer.groundLayer.setVisible(true);
            document.getElementsByClassName("1z")[0].innerText = "Stop Rendering Ground";
        } else {
            game.renderer.groundLayer.setVisible(false);
            document.getElementsByClassName("1z")[0].innerText = "Start Rendering Ground";
        }
    }
//Hide projectiles
window.projectiles = () => {
    window.projectiles1 = !window.projectiles1;
    if (window.projectiles1) {
        game.renderer.projectiles.setVisible(false)
        document.getElementsByClassName("4z")[0].innerText = "Start Rendering Projectiles";
    } else {
        game.renderer.projectiles.setVisible(true)
        document.getElementsByClassName("4z")[0].innerText = "Stop Rendering Projectiles";
    }
}
//Hide Players
window.players = () => {
    window.players1 = !window.players1;
    if (window.players1) {
        game.renderer.players.setVisible(false)
        document.getElementsByClassName("3z")[0].innerText = "Start Rendering Players";
    } else {
        game.renderer.players.setVisible(true)
        document.getElementsByClassName("3z")[0].innerText = "Stop Rendering Players";
    }
}
//Hide Zombies
window.zombieLayer = () => {
    window.zombieLayer1 = !window.zombieLayer1;
    if (window.zombieLayer1) {
        game.renderer.zombieLayer.setVisible(false)
        document.getElementsByClassName("2z")[0].innerText = "Start Rendering Zombies";
    } else {
        game.renderer.zombieLayer.setVisible(true)
        document.getElementsByClassName("2z")[0].innerText = "Stop Rendering Zombies";
    }
}
//Hide buildings
window.buildings = () => {
    window.buildings1 = !window.buildings1;
    if (window.buildings1) {
        game.renderer.buildings.setVisible(false)
        document.getElementsByClassName("5z")[0].innerText = "Start Rendering Buildings";
    } else {
        game.renderer.buildings.setVisible(true)
        document.getElementsByClassName("5z")[0].innerText = "Stop Rendering Buildings";
    }
}
//Hide Wood and stone
window.scenery = () => {
    window.scenery1 = !window.scenery1;
    if (window.scenery1) {
        game.renderer.scenery.setVisible(false)
        document.getElementsByClassName("6z")[0].innerText = "Start Rendering Scenery";
    } else {
        game.renderer.scenery.setVisible(true)
        document.getElementsByClassName("6z")[0].innerText = "Stop Rendering Scenery";
    }
}
//Debugger
window.debugMode = false;

window.toggleDebug = () => {
    window.debugMode = !window.debugMode;

    if (window.debugMode) {
        game.debug.show();
        document.getElementsByClassName("7z")[0].innerText = "Stop debug";
     } else {
         game.debug.hide();
         document.getElementsByClassName("7z")[0].innerText = "Start debug";
        }
    }
/**-----------------------RAIDING-----------------------**/
    window.xkeyActive = false;

    window.toggleXkey = () => {
        window.xkeyActive = !window.xkeyActive;

        if (window.xkeyActive) {
            game.network.sendRpc({ name: "BuyTool", toolName: "Sword", tier: 1 });
            game.network.sendRpc({ name: "EquipTool", toolName: "Sword", tier: 1 });
            game.network.sendRpc({ name: "Respawn", tier: 1 });
            document.getElementsByClassName("19SA")[0].innerText = "Stop X Key";
        } else {
            document.getElementsByClassName("19SA")[0].innerText = "Start X Key";
        }
    }

//Clear chat
window.clearMsgs = () => {
    window.clearMsgs1 = !window.clearMsgs1;
    let clearMessages = window.clearMsgs1;
    document.getElementsByClassName("8z")[0].innerText = clearMessages ? "Clear messages" : "(Clear messages)";

    if (clearMessages) {
        let messages = document.getElementsByClassName('hud-chat-message');
        for (let i = 0; i < messages.length; i++) {
            messages[i].remove();
        }
    }
}
//Chat spam
let getElement = (elem) => { return document.getElementsByClassName(elem) }
let getId = (id) => { return document.getElementById(id) }
let packet = (e, t) => { game.network.sendPacket(e, t) }
let setElementToggleTo = (enabled, classname) => {
    if (!enabled) {
        getElement(classname)[0].innerText = getElement(classname)[0].innerText.replace("Disable", "Enable");
        getElement(classname)[0].className = getElement(classname)[0].className.replace("red", "blue");
    } else {
        getElement(classname)[0].innerText = getElement(classname)[0].innerText.replace("Enable", "Disable");
        getElement(classname)[0].className = getElement(classname)[0].className.replace("blue", "red");
    }
}
//Chat spam code
let scripts = {
    chatSpam: false
}
getElement("chatspambutton")[0].onclick = e => {
    scripts.chatSpam = !scripts.chatSpam
    setInterval(() => {
        if (scripts.chatSpam) {
            game.network.sendRpc({name: "SendChatMessage", channel: "All", message: getElement("chatspam")[0].value});
        }
    }, 1000)
    if(!scripts.chatSpam) {
        scripts.chatSpam = false;
    }
    setElementToggleTo(scripts.chatSpam, e.target.classList[2]);
}

/**-----------------------Base-----------------------**/
//Sell all
window.sellAll = () => {
    window.sellAll1 = !window.sellAll1;
    let sellall = window.sellAll1;
    document.getElementsByClassName("9z")[0].innerText = sellall ? "Sell All" : "(Sell All)";

   ["CannonTower", "Drill", "RocketTower", "LightningTower", "ArrowTower", "Door", "SawTower", "Wall", "MageTower", "LargeWall", "SpikeTrap", "Harvester"].forEach(tower => {
    const uids = [];
    Object.values(game.ui.buildings).map(e => {
        e.type == tower && uids.push(e.uid)
    })
    game.network.sendRpc({
        name: "SellBuilding",
        uids: uids
    });
})
}

//Auto rapidfire
window.rapidfire = false;
let rapidfirePercentage = 90;

window.togglerapidfire = () => {
    window.rapidfire = !window.rapidfire;
    const button = document.getElementsByClassName("20SA")[0];

    if (window.rapidfire) {
        button.innerText = "Disable Auto Rapidfire";
        button.classList.remove("btn-blue");
        button.classList.add("btn-red");
    } else {
        button.innerText = "Enable Auto Rapidfire";
        button.classList.remove("btn-red");
        button.classList.add("btn-blue");
    }
};

function updateRapidfirePercentage() {
    const input = document.querySelector(".rfpercent");
    rapidfirePercentage = parseFloat(input.value) || 90;
}

document.querySelector(".rfpercent").addEventListener("input", updateRapidfirePercentage);

game.eventEmitter.addListener("EntityUpdate", onEntityUpdateRapidfire);

function onEntityUpdateRapidfire(event) {
    if (window.rapidfire) {
        for (let i in game.renderer.world.entities) {
            const entity = game.renderer.world.entities[i];

            if (entity.targetTick && entity.targetTick.health <= entity.targetTick.maxHealth * (rapidfirePercentage / 100)) {
                const tower = game.ui.buildings[entity.uid];

                if (tower) {
                    game.network.sendRpc({
                        name: "CastSpell",
                        spellName: "Rapidfire",
                        x: tower.x,
                        y: tower.y
                    });
                }
            }
        }
    }
}



// Uth
window.uth = false;
let uthPercentage = 40;

window.toggleuth = () => {
    window.uth = !window.uth;
    const button = document.getElementsByClassName("21SA")[0];

    if (window.uth) {
        button.innerText = "Disable Uth";
        button.classList.remove("btn-blue");
        button.classList.add("btn-red");
    } else {
        button.innerText = "Enable Uth";
        button.classList.remove("btn-red");
        button.classList.add("btn-blue");
    }
};

function updateUthPercentage() {
    const input = document.querySelector(".uthpercent");
    uthPercentage = parseFloat(input.value) || 40;
}

document.querySelector(".uthpercent").addEventListener("input", updateUthPercentage);

function onEntityUpdateUth(event) {
    if (!window.uth) return;

    for (let i in game.renderer.world.entities) {
        const entity = game.renderer.world.entities[i];

        if (entity.targetTick && entity.targetTick.health <= entity.targetTick.maxHealth * (uthPercentage / 100)) {
            const tower = game.ui.buildings[entity.uid];

            if (tower) {
                game.network.sendRpc({
                    name: "UpgradeBuilding",
                    uids: [entity.uid],
                });
            }
        }
    }
}

game.eventEmitter.addListener("EntityUpdate", onEntityUpdateUth);


//Auto Aim
window.zombieAutoAim = false;
window.playerAutoAim = false;
let nearestZombies = {};
let nearestPlayers = {};

window.toggleautoaimzombie = () => {
    window.zombieAutoAim = !window.zombieAutoAim;
    const button = document.getElementsByClassName("22SA")[0];

    if (window.zombieAutoAim) {
        button.innerText = "Disable Zombie Auto Aim";
        button.classList.remove("btn-blue");
        button.classList.add("btn-red");
    } else {
        button.innerText = "Enable Zombie Auto Aim";
        button.classList.remove("btn-red");
        button.classList.add("btn-blue");
    }
};

window.toggleautoaimplayer = () => {
    window.playerAutoAim = !window.playerAutoAim;
    const button = document.getElementsByClassName("23SA")[0];

    if (window.playerAutoAim) {
        button.innerText = "Disable Player Auto Aim";
        button.classList.remove("btn-blue");
        button.classList.add("btn-red");
    } else {
        button.innerText = "Enable Player Auto Aim";
        button.classList.remove("btn-red");
        button.classList.add("btn-blue");
    }
};

game.eventEmitter.addListener("EntityUpdate", onEntityUpdate);

function onEntityUpdate(event) {
    if (window.zombieAutoAim && game.ui.playerTick) {
        nearestZombies = {};
        for (let i in game.renderer.world.entities) {
            const entity = game.renderer.world.entities[i];

            if (entity.targetTick && entity.targetTick.model.startsWith("Zombie")) {
                nearestZombies[i] = {
                    distance: Math.hypot(game.ui.playerTick.position.x - entity.targetTick.position.x, game.ui.playerTick.position.y - entity.targetTick.position.y),
                    x: entity.targetTick.position.x,
                    y: entity.targetTick.position.y
                };
            }
        }

        if (Object.values(nearestZombies)[0]) {
            nearestZombies = Object.values(nearestZombies).sort((x, y) => x.distance - y.distance);
            const target = Object.values(nearestZombies)[0];
            const aim = ((Math.atan2(target.y - game.ui.playerTick.position.y, target.x - game.ui.playerTick.position.x) * 180 / Math.PI + 450) % 360) | 0;
            packet(3, { mouseMoved: aim });
            nearestZombies = {};
        }
    }

    if (window.playerAutoAim && game.ui.playerTick) {
        nearestPlayers = {};
        const myPartyMembers = game.ui.playerPartyMembers.map(member => member.uid);

        for (let i in game.renderer.world.entities) {
            const entity = game.renderer.world.entities[i];

            if (entity.targetTick
                && entity.targetTick.model === "Player"
                && entity.targetTick.uid !== game.ui.playerTick.uid
                && !myPartyMembers.includes(entity.targetTick.uid)) {

                nearestPlayers[i] = {
                    distance: Math.hypot(game.ui.playerTick.position.x - entity.targetTick.position.x, game.ui.playerTick.position.y - entity.targetTick.position.y),
                    x: entity.targetTick.position.x,
                    y: entity.targetTick.position.y
                };
            }
        }

        if (Object.values(nearestPlayers)[0]) {
            nearestPlayers = Object.values(nearestPlayers).sort((x, y) => x.distance - y.distance);
            const target = Object.values(nearestPlayers)[0];
            const aim = ((Math.atan2(target.y - game.ui.playerTick.position.y, target.x - game.ui.playerTick.position.x) * 180 / Math.PI + 450) % 360) | 0;
            packet(3, { mouseMoved: aim });
            nearestPlayers = {};
        }
    }
}

//Arb
let timeoutMs = 75;
let canPlace = true;
let buildings = new Map();
let missingBuildings = new Map();
let buildingsToUpgrade = new Map();
let autoRebuildEnabled = false;
let autoUpgradeEnabled = false;

window.toggleAutoRebuild = () => {
    autoRebuildEnabled = !autoRebuildEnabled;
    const button = document.getElementById("autoRebuildBtn");

    if (autoRebuildEnabled) {
        button.innerText = "Disable Auto Rebuild";
        button.className = "btn btn-red";
        startAutoRebuild();
    } else {
        button.innerText = "Enable Auto Rebuild";
        button.className = "btn btn-blue";
        stopAutoRebuild();
    }
};

window.toggleAutoUpgrade = () => {
    autoUpgradeEnabled = !autoUpgradeEnabled;
    const button = document.getElementById("autoUpgradeBtn");

    if (autoUpgradeEnabled) {
        button.innerText = "Disable Auto Upgrade";
        button.className = "btn btn-red";
        startAutoUpgrade();
    } else {
        button.innerText = "Enable Auto Upgrade";
        button.className = "btn btn-blue";
        stopAutoUpgrade();
    }
};

const startAutoRebuild = () => {
    for (let building in game.ui.buildings) {
        let { x, y, tier, type } = game.ui.buildings[building];
        buildings.set(`${x}, ${y}, ${type}`, { tier: tier, type: type, x: x, y: y });
        console.log(`${x} ${y} ${type}`);
    }

    game.eventEmitter.addListener("PartyBuildingRpcReceived", handleBuildingUpdates);
    game.eventEmitter.addListener("EntityUpdate", handleRebuildUpdates);
};

const stopAutoRebuild = () => {
    buildings.clear();
    missingBuildings.clear();
    game.eventEmitter.removeListener("PartyBuildingRpcReceived", handleBuildingUpdates);
    game.eventEmitter.removeListener("EntityUpdate", handleRebuildUpdates);
};

function handleBuildingUpdates(buildingArray) {
    if (!autoRebuildEnabled) return;

    for (let building of buildingArray) {
        let { x, y, tier, type } = building;
        let key = `${x}, ${y}, ${type}`;
        if (building.dead && buildings.has(key)) {
            missingBuildings.set(key, buildings.get(key));
        }
        if (!building.dead) {
            if (missingBuildings.has(key)) {
                missingBuildings.delete(key);
            }
        }
    }
}

function handleRebuildUpdates(e) {
    if (!autoRebuildEnabled) return;

    missingBuildings.forEach(building => {
        if (canPlace) {
            canPlace = false;
            let { x, y, type } = building;
            game.network.sendInput({ x: x, y: y });
            game.network.sendRpc({ name: 'PlaceBuilding', x: x, y: y, type: type, yaw: 0 });
            setTimeout(() => canPlace = true, timeoutMs);
        }
    });
}

const startAutoUpgrade = () => {
    game.eventEmitter.addListener("EntityUpdate", handleUpgradeUpdates);
};

const stopAutoUpgrade = () => {
    buildingsToUpgrade.clear();
    game.eventEmitter.removeListener("EntityUpdate", handleUpgradeUpdates);
};

function handleUpgradeUpdates(e) {
    if (!autoUpgradeEnabled) return;

    for (let building in game.ui.buildings) {
        let { uid, tier, x, y, type } = game.ui.buildings[building];
        if (tier !== game.ui.factory.tier && !buildingsToUpgrade.has(uid)) {
            buildingsToUpgrade.set(uid, uid);
        }
    }

    buildingsToUpgrade.forEach(building => {
        game.network.sendRpc({ name: 'UpgradeBuilding', uids: [building] });
    });
}

//Base Saver
document.getElementsByClassName("saveb")[0].onclick = function() {
    const baseName = document.getElementsByClassName("basename")[0].value.trim();
    if (!baseName) {
        alert("Please enter a base name.");
        return;
    }

    let s4 = { x: 0, y: 0 };
    let p4 = { x: 0, y: 0 };
    let isPushed4 = false;
    let dataCodes4 = '';
    let arb4 = [];

    const factory = Object.values(game.ui.buildings).find(b => b.type === "Factory");
    if (!factory) {
        alert("Factory not found in the game state.");
        return;
    }
    const factoryX = factory.x;
    const factoryY = factory.y;

    Object.values(game.ui.buildings).forEach(e => {
        if (e.type == "Factory") {
            s4 = { x: e.x, y: e.y };
            if (!isPushed4) {
                p4 = { x: e.x, y: e.y };
                isPushed4 = true;
            }
        } else {
            arb4.push(e);
        }
    });

    arb4.forEach(e => {
        const relX = e.x - factoryX;
        const relY = e.y - factoryY;

        dataCodes4 += `game.network.sendRpc({name: "PlaceBuilding", x: ${relX}, y: ${relY}, type: "${e.type}", yaw: 0});`;
    });

    localStorage.setItem(baseName, dataCodes4);
    document.getElementsByClassName("saveb2")[0].value = dataCodes4;
    game.ui.components.uiPopupOverlay.showHint(`Successfully saved base named "${baseName}"!`);
};


document.getElementsByClassName("buildb")[0].onclick = function() {
    const baseName = document.getElementsByClassName("basename")[0].value.trim();
    if (!baseName) {
        alert("Please enter a base name.");
        return;
    }

    const savedBase = localStorage.getItem(baseName);
    if (!savedBase) {
        alert("No base found with that name.");
        return;
    }

    const commands = savedBase.split(';').filter(cmd => cmd.trim() !== '');

    let index = 0;

    const executeNextCommand = () => {
        if (index < commands.length) {
            const factory = Object.values(game.ui.buildings).find(b => b.type === "Factory");
            if (!factory) {
                console.error("Factory not found in the game state.");
                return;
            }
            const { x: factoryX, y: factoryY } = factory;

            const command = commands[index].trim();
            const adjustedCommand = command.replace(/x: (-?\d+)/g, (_, x) => `x: ${parseInt(x) + factoryX}`)
                                          .replace(/y: (-?\d+)/g, (_, y) => `y: ${parseInt(y) + factoryY}`);

            console.log("Executing command:", adjustedCommand);

            try {
                eval(adjustedCommand);
                index++;
                setTimeout(executeNextCommand, timeoutMs);
            } catch (e) {
                console.error("Error executing command:", adjustedCommand, e);
                index++;
                setTimeout(executeNextCommand, timeoutMs);
            }
        } else {
            game.ui.components.uiPopupOverlay.showHint(`Successfully built base named "${baseName}"!`);
        }
    };

    executeNextCommand();
};



document.getElementsByClassName("delb")[0].onclick = function() {
    const baseName = document.getElementsByClassName("basename")[0].value.trim();
    if (!baseName) {
        alert("Please enter a base name.");
        return;
    }

    const savedBase = localStorage.getItem(baseName);
    if (!savedBase) {
        alert("No base found with that name.");
        return;
    }

    localStorage.removeItem(baseName);
    document.getElementsByClassName("saveb2")[0].value = '';
    game.ui.components.uiPopupOverlay.showHint(`Successfully deleted base named "${baseName}"!`);
};
