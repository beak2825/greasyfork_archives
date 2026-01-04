// ==UserScript==
// @name         Performance Settings
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds some performance options to the settings menu. Adds options "Performance Mode" and "Quick Dust Removal".
// @author       Zoltar
// @match        http://manyland.com/*
// @icon         https://cdn.discordapp.com/icons/852442189283983380/a_70793eeb1f509f9c4aa1021e5691fab4.webp
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/428521/Performance%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/428521/Performance%20Settings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // took this part from Eternity's mod
    function loadObf() {
        if (typeof Deobfuscator === 'undefined')
            return $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js")
    }


    async function main() {
        ig.game.settings.add = Deobfuscator.function(ig.game.settings, 'Math.min(ig.system.scale,5)', true);
        ig.game.settings.header = Deobfuscator.function(ig.game.settings, 'text-transform: uppercase;', true);

        let performanceSetting = await GM.getValue("performance");
        let dustSetting = await GM.getValue("dust");

        ig.game.settings.performanceMode = function () {
            if (!this.pmodeon) {
                this.pInterval = setInterval(() => {
                    for (let entity of ig.game.entities) {
                        if (Object.keys(entity.anims).includes('cell1') || entity.type == 0 && !Object.keys(entity.anims).includes('normal')) {
                            entity.kill();
                        } else if (typeof entity.anims.main !== 'undefined' && !Object.keys(entity.anims).includes('run')) {
                            if (entity.anims.main.timer.base > 0)
                                entity.kill()
                        }
                    }
                }, 250)
                this.pmodeon = !this.pmodeon;
                GM.setValue("performance", this.pmodeon);
            } else {
                this.pmodeon = !this.pmodeon;
                GM.setValue("performance", this.pmodeon);
                clearInterval(this.pInterval);
            }
        }

        ig.game.settings.duster = function () {

            if (!this.dustr) {
                this.dustInterval = setInterval(() => {
                    for (let entity of ig.game.entities) {
                        if (typeof entity.animSheet != 'undefined' && entity.animSheet != null) {
                            if (typeof entity.animSheet.image != 'undefined') {
                                if (entity.animSheet.image.path == "extracted/bigdust" || entity.animSheet.image.path == "extracted/dust") {
                                    entity.kill();
                                }
                            }
                        }

                    }
                }, 250)
                this.dustr = !this.dustr;
                GM.setValue("dust", this.dustr);
            } else {
                this.dustr = !this.dustr;
                GM.setValue("dust", this.dustr);
                clearInterval(this.dustInterval);
            }
        }

        if (typeof performanceSetting != 'undefined') {
            ig.game.settings.pmodeon = performanceSetting;

        } else {
            ig.game.settings.pmodeon = false;
        }

        if (typeof dustSetting != 'undefined') {
            ig.game.settings.dustr = dustSetting;

        } else {
            ig.game.settings.dustr = false;
        }

        if (ig.game.settings.pmodeon) {
            ig.game.settings.pmodeon = !ig.game.settings.pmodeon;
            ig.game.settings.performanceMode();

        }

        if (ig.game.settings.dustr) {
            ig.game.settings.dustr = !ig.game.settings.dustr;
            ig.game.settings.duster();
        }

        ig.game.settings.dustInterval = 1;
        ig.game.settings.pInterval = 1;



        eval('ig.game.settings.openDialog = function(){ ' + ig.game.settings.openDialog.toString().split('function(){')[1].split('a+="</div>";').join(`a += this.${ig.game.settings.header}("Performance"); a += this.${ig.game.settings.add}("pmodeon", "Performance Mode", null, "ig.game.settings.performanceMode()", this.pmodeon); a += this.${ig.game.settings.add}("dustr", "Quick Dust Removal", null, "ig.game.settings.duster()", this.dustr); a+="</div>";`));
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