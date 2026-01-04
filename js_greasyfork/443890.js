// ==UserScript==
// @name         ShellShockers Multifunction Script - Aimbot, ESP, No-Scope, All Skins Mod, FPS Improver and more!
// @namespace    ShellShockers Multifunction Script - Aimbot, ESP, No-Scope, All Skins Mod, FPS Improver and more!
// @version      0.0.3
// @description  A compilation of multiple other JS scripts for shellshockers
// @author       Heatron#1974 from NerdHub
// @match        https://shellshock.io/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://eggsarecool.com/*
// @match        https://deadlyegg.com/*
// @match        https://mathgames.world/*
// @match        https://hardshell.life/*
// @match        https://violentegg.club/*
// @match        https://yolk.life/*
// @match        https://softboiled.club/*
// @match        https://scrambled.world/*
// @match        https://algebra.best/*
// @match        https://scrambled.today/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443890/ShellShockers%20Multifunction%20Script%20-%20Aimbot%2C%20ESP%2C%20No-Scope%2C%20All%20Skins%20Mod%2C%20FPS%20Improver%20and%20more%21.user.js
// @updateURL https://update.greasyfork.org/scripts/443890/ShellShockers%20Multifunction%20Script%20-%20Aimbot%2C%20ESP%2C%20No-Scope%2C%20All%20Skins%20Mod%2C%20FPS%20Improver%20and%20more%21.meta.js
// ==/UserScript==


(function() {
    let currentPlayerList = [];
    let myPlayerId = 0;
    window.hackData = {
        get currentPlayerList(){return currentPlayerList;},
        get myPlayerId(){return myPlayerId;}
    };
    //
    // Aimbot Settings
    const fov = 20;
    const toggleKey = "KeyV";
    const aimCheckDelay = 1; // In milliseconds
    //
    // Aimbot Code
    let aimToggled = false;
    function doAimbot(){
        let myPlayer = currentPlayerList[myPlayerId]; // Get my player object
        let players = currentPlayerList.filter(e=>{return (e.id != myPlayerId)}); // Filter the array
        if (!myPlayer || !players){return;} // Make sure these both exist!
        let aimPlayer = {}; // Aim player will be best calculated target so far
        let aimPlayerAngle = 999; // Will be used to store the closest player angle to our crosshair so far
        let aimPlayerYawPitch = {yaw: 0, pitch: 0}; // Store the yaw and pitch to aim at the aim player
        //
        const adjustedYaw = Math.radRange(Math.PI / 2 - myPlayer.yaw); // Correct my yaw for calcs
        const adjustedPitch = -myPlayer.pitch; // Correct my pitch for calcs
        const cosPitch = Math.cos(adjustedPitch); // Get cosPitch
        const lookVec = new window.BABYLON.Vector3(cosPitch * Math.cos(adjustedYaw), Math.sin(adjustedPitch), cosPitch * Math.sin(adjustedYaw)).normalize(); // Get my look vec
        const posVec = new window.BABYLON.Vector3(myPlayer.x, myPlayer.y + 0.3, myPlayer.z); // Get my position vec
        //
        for (let player of players){
            if (player == null || player.id == null){continue;} // Check if player object exists
            if (player.isDead()){continue;} // Check if player is dead
            //
            const otherVec = new window.BABYLON.Vector3(player.x, player.y + 0.3 - 0.072, player.z); // Calculate their position vec
            const diffVec = otherVec.subtract(posVec).normalize(); // Calculate the difference and normalize
            const angle = Math.acos(window.BABYLON.Vector3.Dot(lookVec, diffVec)); // Get the angle (in radians)
            const angleDeg = angle * 180 / Math.PI; // Get the angle in degrees (for fov)
            console.log(player.name, angleDeg);
            //
            if (angleDeg <= fov && angleDeg < aimPlayerAngle){
                aimPlayer = player;
                aimPlayerAngle = angleDeg;
                const targetVectorNormalized = diffVec; // Set targetVectorNormalized
                const newYaw = Math.radRange(-Math.atan2(targetVectorNormalized.z, targetVectorNormalized.x) + Math.PI / 2); // Get my new yaw
                const newPitch = Math.clamp(-Math.asin(targetVectorNormalized.y), -1.5, 1.5); // Get my new pitch
                aimPlayerYawPitch.yaw = newYaw;
                aimPlayerYawPitch.pitch = newPitch;
            }
        }
        //
        if (aimPlayer.id != null){ // If the aimPlayer was set it should have an id!
            // Ok we can set our yaw and pitch now!
            myPlayer.yaw = aimPlayerYawPitch.yaw;
            myPlayer.pitch = aimPlayerYawPitch.pitch;
        }
    }
    let aimLoop; // Define our aimloop variable
    document.addEventListener("keydown", (e)=>{
        if (e.code == toggleKey){ // Check if this key pressed is our aim toggle
            aimToggled = !aimToggled;
            if (aimToggled){ // If aimbot enabled set a loop to do the aimbot
                aimLoop = setInterval(doAimbot, aimCheckDelay);
            }else { // If aimbot is disabled clear the loop
                clearInterval(aimLoop);
            }
        }
    });
    //
    // Hooks
    let packetDecryptClone = {
        init: function(e) {
            this.buffer = new Uint8Array(e),
                this.idx = 0
        },
        unPackInt8U: function() {
            var e = this.idx;
            return this.idx++,
                this.buffer[e]
        }
    }
    function doHook(){
        const oldCloneMesh = window.BABYLON.Scene.prototype.cloneMesh;
        window.BABYLON.Scene.prototype.cloneMesh = function(){
            if (arguments[0] == "egg"){
                // We Are Cloning the Egg Mesh in player constructor!
                // Grab the player object by getting the arguments passed to function Io!
                let playerObj = arguments.callee.caller.arguments[0];
                // Make sure this is a player
                if (playerObj.id == null || playerObj.id == -1){return oldCloneMesh.apply(this, arguments);}
                // Add the player to our list
                currentPlayerList[playerObj.id] = playerObj;

                // The function Si to remove the player calls playerObj.actor.remove (aka Io.prototype.remove)
                // We are going to hook that function call!
                // Note : arguments.callee.caller references the Io function.
                let oldRemove = arguments.callee.caller.prototype.remove;
                arguments.callee.caller.prototype.remove = function(){
                    // Make sure this is a player
                    if (!this.player.id){return oldRemove.apply(this, arguments);}

                    // Remove the player from our list
                    delete currentPlayerList[this.player.id];
                    // Apply to original
                    return oldRemove.apply(this, arguments);
                }
            }
            return oldCloneMesh.apply(this, arguments);
        }
        function messageHook(){
            if (arguments[0].data instanceof ArrayBuffer){
                // Lets use our packetDecryptClone
                let decrypt = packetDecryptClone;
                decrypt.init(arguments[0].data);
                let packetType = decrypt.unPackInt8U();
                if (packetType == 0){ // Check if gameJoined Packet
                    myPlayerId = decrypt.unPackInt8U(); // Get my player id
                    currentPlayerList = []; // Clear the player list
                }
            }
        }
        let oldOnMessageSetter = Object.getOwnPropertyDescriptors(WebSocket.prototype).onmessage.set;
        Object.defineProperty(WebSocket.prototype, 'onmessage', {
            set: function(){
                let originalFunc = ()=>{};
                if (typeof arguments[0] == "function"){
                    originalFunc = arguments[0];
                    arguments[0] = function(){
                        messageHook.apply(this, arguments); // Send a copy of the values to our message hook
                        originalFunc.apply(this, arguments);
                    }
                }
                oldOnMessageSetter.apply(this, arguments);
            }
        });
    }
    let checkForBabylon = setInterval(()=>{
        if (window.BABYLON && window.BABYLON.Scene && window.BABYLON.Scene.prototype.cloneMesh){
            clearInterval(checkForBabylon);
            doHook();
        }
    }, 100);
})();
/////
(function () {
    unsafeWindow.XMLHttpRequest = class extends unsafeWindow.XMLHttpRequest {
        constructor() {
            super(...arguments);
        }
        open() {
            if (arguments[1] && arguments[1].includes("src/shellshock.js")) {
                this.scriptMatch = true;
            }

            super.open(...arguments);
        }
        get response() {

            if (this.scriptMatch) {
                let responseText = super.response;

                let match = responseText.match(/inventory\[[A-z]\].id===[A-z].id\)return!0;return!1/);
                if (match) responseText = responseText.replace(match[0], match[0] + `||true`);
                return responseText;
            }
            return super.response;
        }
    };
}())
///////
(function () {
    unsafeWindow.XMLHttpRequest = class extends unsafeWindow.XMLHttpRequest {
        constructor() {
            super(...arguments);
        }
        open() {
            if (arguments[1] && arguments[1].includes("src/shellshock.js")) {
                this.scriptMatch = true;
            }

            super.open(...arguments);
        }
        get response() {

            if (this.scriptMatch) {
                let responseText = super.response;

                let matches = [responseText.match(/.push\(([A-z])\),\w.maxZ=100/), responseText.match(/this.crosshairs.position.z=2/)];
                if (matches[0]) responseText = responseText.replace(matches[0][0], matches[0][0] + `,window.fixCamera(${matches[0][1]})`);
                if (matches[1]) responseText = responseText.replace(matches[1][0], matches[1][0] + `;return`);

                return responseText;
            }
            return super.response;
        }
    };

    unsafeWindow.fixCamera = function (camera) {
        let border = document.getElementById("scopeBorder");
        Object.defineProperties(camera.viewport, {
            width: {
                set: () => border.style.display = "none",
                get: () => 1
            },
            x: {
                get: () => 0
            }
        });
    }
}())
///////
(function () {
    unsafeWindow.hookScene = function () {
        BABYLON.Scene = new Proxy(BABYLON.Scene, {
            construct: function (func, args) {
                const product = new func(...args);

                ["probesEnabled", "particlesEnabled", "texturesEnabled", "fogEnabled", "lightsEnabled", "postProcessesEnabled", "lensFlaresEnabled", "renderTargetsEnabled", "shadowsEnabled", "proceduralTexturesEnabled"].forEach(a => Object.defineProperty(product, a, {
                    get: () => false
                }));

                return product;
            },
        })
    }
    unsafeWindow.XMLHttpRequest = class extends XMLHttpRequest {
        constructor() {
            super(...arguments)
        }
        open() {
            if (arguments[1] && arguments[1].includes("src/shellshock.js")) {
                this.scriptMatch = true;
            }

            super.open(...arguments);
        }
        get response() {

            if (this.scriptMatch) {
                let responseText = super.response;

                let match = responseText.match(/else console.log\(window\),"undefined"==typeof window\?(\w).BABYLON=(\w\(\w,\w,\w\)).(\w)=\w\(\w,\w,\w\)/);
                if (match) {
                    responseText = responseText.replace(match[0], `else{${match[1]}.BABYLON=${match[2]};${match[3]}=${match[1]}.BABYLON,window.hookScene()}`);
                }
                return responseText;
            }
            return super.response;
        }
    };
}())
///////