// ==UserScript==
// @name         Extra Sound Settings
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a better version of mute, that mutes everything but claps, pings and clicks. It also adds the ability to hear when people are typing within a certain range around you.
// @author       Zoltar
// @match        http://manyland.com/*
// @icon         https://cdn.discordapp.com/icons/852442189283983380/a_70793eeb1f509f9c4aa1021e5691fab4.webp
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/428527/Extra%20Sound%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/428527/Extra%20Sound%20Settings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // took this part from Eternity's mod
    async function loadObf() {
        if (typeof Deobfuscator == 'undefined')
            await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js")

        // getPlayerChat depends on this


    }

    async function main() {
        let btMuteSetting = await GM.getValue("bettermute");
        let typeSetting = await GM.getValue("typesound");

        let pasteCheck = Deobfuscator.function(ig.game.player, 'Boolean(b&&b', true);
        let slotPass = Deobfuscator.object(ig.game, 'slots', true);
        let storedPasteCheck = ig.game.player[pasteCheck];


        ig.game.settings.add = Deobfuscator.function(ig.game.settings, 'Math.min(ig.system.scale,5)', true);
        ig.game.settings.header = Deobfuscator.function(ig.game.settings, 'text-transform: uppercase;', true);
        ig.game.settings.typeInterval = 1;





        const getPlayerChat = target => {
            Deobfuscator.findByType = (object, type, returnKey) => {

                let keyFound = null;

                Object.keys(object).forEach((i) => {
                    if (object[i] === null)
                        return;

                    if (object[i].constructor === type)
                        keyFound = returnKey ? i : object[i];
                });

                return keyFound;

            }

            updatePlayers();
            if (ig.game.players.length == 0) return;
            let chat = "";
            ig.game.players.forEach(player => {
                let playerId = Deobfuscator.variableByLength(ig.game.players[1], 24, true)
                if (player[playerId] === target) {

                    let playerChat = Deobfuscator.object(player, 'player', false);
                    playerChat.object = Deobfuscator.findByType(playerChat, Array, false);

                    if (playerChat.object.length != 0) {
                        let index = playerChat.object.length - 1;
                        chat = Deobfuscator.findByType(playerChat.object[index], String, false);
                    }
                }
            });

            return chat;
        }

        function getDistance(x1, y1, x2, y2) {
            let xDistance = x2 - x1;
            let yDistance = y2 - y1;

            return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
        }


        ig.game.settings.betterMute = function () {
            if (!this.btm) {

                let whiteListedSounds = ["ping", "clap"];
                if (ig.game.settings.tps) whiteListedSounds.push("click");


                ig.game.player[pasteCheck] = function (a) {
                    if (a === "mutesPastes") return true;
                    var b = this.attachments[ig.game[slotPass].slots.WEARABLE];

                    return Boolean(b && b.attributes && b.attributes[a])
                }

                for (let sound of Object.keys(ig.game.sounds)) {
                    if (!whiteListedSounds.includes(sound)) {
                        if (ig.game.sounds[sound].volume == 1) {
                            ig.game.sounds[sound].volume = 0;
                        }


                    }
                }
                this.btm = !this.btm
                GM.setValue("bettermute", this.btm);

            } else {
                ig.game.player[pasteCheck] = storedPasteCheck;
                for (let sound of Object.keys(ig.game.sounds)) {
                    if (ig.game.sounds[sound].volume == 0) {
                        ig.game.sounds[sound].volume = 1;
                    }


                }
                this.btm = !this.btm;
                GM.setValue("bettermute", this.btm);
            }

        }

        ig.game.settings.typeSound = function () {

            let chatBuffer = [{ id: "", message: "" }]
            let chatterIds = [""];

            if (!this.tps) {
                ig.game.settings.typeInterval = setInterval(() => {
                    updatePlayers();
                    if (ig.game.players.length == 0) {
                        this.tps = !this.tps;
                        GM.setValue("typesound", this.tps);
                        return;
                    }
                    for (let player of ig.game.players) {

                        let playerId = Deobfuscator.variableByLength(ig.game.players[1], 24, true)

                        if (getDistance(ig.game.player.pos.x, ig.game.player.pos.y, player.pos.x, player.pos.y) <= 230 && player[playerId] != ig.game.player.id) {
                            if (!chatterIds.includes(player[playerId])) {
                                chatBuffer.push({ id: player[playerId], message: getPlayerChat(player[playerId]) })
                                chatterIds.push(player[playerId])
                            }

                            for (let chatter of chatBuffer) {
                                if (chatter.id === player[playerId]) {

                                    if (chatter.message != getPlayerChat(player[playerId])) {
                                        ig.game.sounds.click.play();
                                    }
                                    chatter.message = getPlayerChat(player[playerId]);

                                }
                            }

                        }
                    }
                }, 50)
                this.tps = !this.tps;
                GM.setValue("typesound", this.tps);

            } else {
                clearInterval(ig.game.settings.typeInterval);
                this.tps = !this.tps;
                GM.setValue("typesound", this.tps);
            }


        }



        ig.game.settings.btm = typeof btMuteSetting == 'undefined' ? ig.game.settings.btm = false : ig.game.settings.btm = btMuteSetting;
        ig.game.settings.tps = typeof typeSetting == 'undefined' ? ig.game.settings.tps = false : ig.game.settings.tps = typeSetting;


        if (ig.game.settings.btm) {
            ig.game.settings.btm = !ig.game.settings.btm;
            ig.game.settings.betterMute();

        }

        if (ig.game.settings.tps) {
            ig.game.settings.tps = !ig.game.settings.tps;
            ig.game.settings.typeSound();
        }

        // Making it compatiable with performance mod
        let splitCheck = ig.game.settings.openDialog.toString().split('function() {').length > 1 ? 'function() {' : 'function(){';
        let splitText = ig.game.settings.openDialog.toString().split(splitCheck)[1];
        let newFunction = splitText.split('a+="</div>";').join(`a += this.${ig.game.settings.header}("Sound Extras"); a += this.${ig.game.settings.add}("btm", "Better Mute", null, "ig.game.settings.betterMute()", this.btm); a += this.${ig.game.settings.add}("tps", "Typing Sound", null, "ig.game.settings.typeSound()", this.tps); a+="</div>";`)

        eval('ig.game.settings.openDialog = function(){ ' + newFunction);
    }

    // Parses smooth loader
    !async function loader() {
        let loading = setInterval(async function () {
            if (typeof ig === "undefined") return
            else if (typeof ig.game === "undefined") return
            else if (typeof ig.game.screen === "undefined") return
            else if (ig.game.screen.x == 0) return
            else if (typeof Settings !== "function") return

            clearInterval(loading);
            await loadObf();
            main();
        }, 250)
    }()
})();