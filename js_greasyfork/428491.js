// ==UserScript==
// @name         Old School Rank Check
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Shows your rank, as well as other players ranks, using the old hand symbol.
// @author       Zoltar
// @match        http://manyland.com/*
// @icon         https://cdn.discordapp.com/icons/852442189283983380/a_70793eeb1f509f9c4aa1021e5691fab4.webp
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/428491/Old%20School%20Rank%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/428491/Old%20School%20Rank%20Check.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // took this part from Eternity's mod
    async function loadObf() {
        if (typeof Deobfuscator == 'undefined')
            await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js")

    }
    // Parses smooth loader
    !async function loader() {
        let loading = setInterval(() => {
            if (typeof ig === "undefined") return
            else if (typeof ig.game === "undefined") return
            else if (typeof ig.game.screen === "undefined") return
            else if (ig.game.screen.x == 0) return
            else if (typeof Settings !== "function") return

            clearInterval(loading);
            loadObf().then(() => {
                ig.game.oldDraw = ig.game.draw;

                let profileRequest = false;
                let globalColor = "";
                let image = new Image();
                let image2 = new Image();

                let whiteArray = ['https://cdn.discordapp.com/attachments/821248617628565524/858245966929985536/Rank0Hand.png', 'https://cdn.discordapp.com/attachments/821248617628565524/858245767889944606/Rank1Hand.png', 'https://cdn.discordapp.com/attachments/821248617628565524/858246009771261982/Rank2Hand.png', 'https://cdn.discordapp.com/attachments/821248617628565524/858245730572959754/Rank3Hand.png', 'https://cdn.discordapp.com/attachments/821248617628565524/858245729389510656/Rank4Hand.png', 'https://cdn.discordapp.com/attachments/821248617628565524/858245899813257236/Rank5Hand.png', 'https://cdn.discordapp.com/attachments/821248617628565524/858245723756691466/Rank10Hand.png']
                let blackArray = ['https://cdn.discordapp.com/attachments/821248617628565524/858245737828974602/Rank0HandBlack.png', 'https://cdn.discordapp.com/attachments/821248617628565524/858245742136393728/Rank1HandBlack.png', 'https://cdn.discordapp.com/attachments/821248617628565524/858245736357167113/Rank2HandBlack.png', 'https://cdn.discordapp.com/attachments/821248617628565524/858245735426293790/Rank3HandBlack.png', 'https://cdn.discordapp.com/attachments/821248617628565524/858245733974409216/Rank4HandBlack.png', 'https://cdn.discordapp.com/attachments/821248617628565524/858245732930027540/Rank5HandBlack.png', 'https://cdn.discordapp.com/attachments/821248617628565524/858245732271783936/Rank10HandBlack.png']


                let rank = ig.game.player.rank === 10 ? 6 : ig.game.player.rank;
                image.src = whiteArray[rank];

                let opened = false;
                let initialOffset = 55;

                ig.game.draw = function () {
                    ig.game.oldDraw();
                    ig.system.context.globalAlpha = 0.85;
                    ig.system.context.drawImage(image, 5, -4, (18 * ig.system.scale), (18 * ig.system.scale))

                    ig.game.whiteFont.draw(ig.game.player.screenName, 22, 6);
                    ig.system.context.globalAlpha = 1;


                }


                ig.game.playerDialog.old_draw = ig.game.playerDialog.draw;

                ig.game.playerDialog.draw = function () {
                    ig.game.playerDialog.old_draw();

                    if (this.isOpen) {
                        let player = Deobfuscator.object(ig.game.playerDialog, 'rank', false);
                        if (player.id === ig.game.player[id]) return;

                        if (player.name.length > 6 && !opened) {
                            opened = true;
                            if(player.hasMinfinity) {
                                initialOffset -= 14;
                            } else if(player.rank === 0) {
                                initialOffset -= 26;
                            }
                            for (let i = 0; i < player.name.length - 6; i++) {
                                initialOffset -= 12;

                            }
                        } else if (player.name.length < 6 && !opened) {
                            opened = true;
                            if(player.hasMinfinity) {
                                initialOffset -= 14;
                            } else if(player.rank === 0) {
                                initialOffset -= 26;
                            }
                            for (let i = 0; i < (6 - player.name.length); i++) {
                                initialOffset += 12;

                            }

                        } else {
                            if(player.hasMinfinity && !opened) {
                                opened = true;
                                initialOffset -= 14;
                            } else if(player.rank === 0  && !opened) {
                                initialOffset -= 26;
                            }
                        }

                        if (!profileRequest) {


                            $.post('http://manyland.com/j/u/pi', { id: player.id, planeId: 0, areaId: ig.game.areaId }, data => {
                                globalColor = data.profileColor;
                                ig.system.context.globalAlpha = 0.7;
                                let rank = player.rank === 10 ? 6 : player.rank;


                                globalColor === 7 || globalColor === null ? image2.src = blackArray[rank] : image2.src = whiteArray[rank]


                                ig.system.context.drawImage(image2,
                                    (this.pos.x * ig.system.scale) + ig.game.playerDialog.clickspotInfoPos.x - initialOffset,
                                    (this.pos.y * ig.system.scale) + ig.game.playerDialog.clickspotInfoPos.y - 10, (17 * ig.system.scale), (17 * ig.system.scale)
                                );

                                ig.system.context.globalAlpha = 1;

                            })
                            profileRequest = true;

                        } else {

                            ig.system.context.globalAlpha = 0.7;
                            let rank = player.rank === 10 ? 6 : player.rank;

                            globalColor === 7 || globalColor === null ? image2.src = blackArray[rank] : image2.src = whiteArray[rank]

                            ig.system.context.drawImage(image2,
                                (this.pos.x * ig.system.scale) + ig.game.playerDialog.clickspotInfoPos.x - initialOffset,
                                (this.pos.y * ig.system.scale) + ig.game.playerDialog.clickspotInfoPos.y - 10, 50, 50
                            );

                            ig.system.context.globalAlpha = 1;
                        }



                    } else {
                        profileRequest = false;
                        initialOffset = 55;
                        opened = false;
                    }
                }
            });
        }, 250)
    }()
})();
