// ==UserScript==
// @name         DTower(US)
// @namespace    DragonTower
// @version      1.3
// @description  Dragon-Tower
// @author       diehard2k0
// @match        *://stake.us/casino/games/dragon-tower
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stake.us
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://update.greasyfork.org/scripts/480138/1321848/StakeUs%2B.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486336/DTower%28US%29.user.js
// @updateURL https://update.greasyfork.org/scripts/486336/DTower%28US%29.meta.js
// ==/UserScript==

(function() {
    var setplay = 0;
    var cashout = 0;
    var round = 0;
    'use strict';
    class dtower extends StakeUsPlusPlugin {
        constructor() {
            super("dtower", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "progressive",
                        label:"Progressive bet",
                        type: "checkbox",
                        default: false,
                    },
                    {
                        id: "waittime",
                        label: "Wait",
                        type: "number",
                        default: 1000,
                    },
                    {
                        id: "cashout",
                        label: "Multiplier",
                        type: "number",
                        default: 5,

                    },
                    {
                        id: "maxwins",
                        label: "Max Wins",
                        type: "number",
                        default: 3,

                    },
                    {
                        id: "seedReset",
                        label: "Reset Seed",
                        type: "select",
                        default: "off",
                        options: [
                            {value: "off", label: "Off"},
                            {value: "100", label: "100 Turns"},
                            {value: "1000", label: "1000 Turns"},
                            {value: "5000", label: "5000 Turns"},
                        ]
                    },
                    {
                        id: "boton",
                        label: "Enable",
                        type: "checkbox",
                        default: false
                    }
                ]
            });
        }

        onConfigsChanged() {
            if(this.getConfig("dragonTower")) {
                StakeUsPlus.plugins.dtower.mkBtn()
            }
        }


        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        triggerMouseEvent (node, eventType) {
            var clickEvent = document.createEvent ('MouseEvents');
            clickEvent.initEvent (eventType, true, true);
            node.dispatchEvent (clickEvent);
        }

        async startBot() {
            var waittime = StakeUsPlus.plugins.dtower.getConfig("waittime")
            //console.log("Starting Bot")
            if (StakeUsPlus.plugins.dtower.getConfig("boton") == true) {
                //console.log("Bot enabled, Running")
                //const sleep1 = await StakeUsPlus.plugins.dtower.sleep(1000)
                var easy = document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-sidebar.svelte-2dxdox > label:nth-child(3) > div > div > select").children[0]
                //Play and Pick Random Tile

                var button1 = document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-sidebar.svelte-2dxdox > button").children[0].children[0]

                //multiplier

                //set to Easy
                //console.log("Setting to easy")

                if (easy.selected == false) {easy.selected = true}
                await StakeUsPlus.plugins.dtower.sleep(waittime)
                if (button1.innerHTML == "Play" && setplay == 0) {
                    setplay = 1
                    let seedReset = StakeUsPlus.plugins.dtower.getConfig("seedReset")
                    let fairness = document.querySelector("#main-content > div > div.game-footer.svelte-1gyzqh2 > div.fairness.svelte-h8r3ex > button")
                    switch(seedReset) {
                        case "off": {
                            break;
                        }
                        case "100": {
                            if(round >= seedReset) {
                                await StakeUsPlus.plugins.dtower.sleep(1000)
                                fairness.click()
                                try {
                                    await StakeUsPlus.plugins.dtower.sleep(1500)
                                    document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-modal.svelte-teplsn > div.wrapper.scrollY.svelte-teplsn > div.footer.svelte-e2gyul > form > label > div > div.input-button-wrap.svelte-3axy6s > button").click()
                                    console.log("Reset Seed")
                                    await StakeUsPlus.plugins.dtower.sleep(1500)
                                    document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-modal.svelte-teplsn > div.wrapper.scrollY.svelte-teplsn > div.header.svelte-teplsn > button").click()
                                    round = 0
                                }
                                catch(err)
                                {
                                    console.log("Could reset fairness")
                                }
                            }
                            break;
                        }
                        case "1000": {
                            if(round >= seedReset) {
                                await StakeUsPlus.plugins.dtower.sleep(1000)
                                fairness.click()
                                try {
                                    await StakeUsPlus.plugins.dtower.sleep(1500)
                                    document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-modal.svelte-teplsn > div.wrapper.scrollY.svelte-teplsn > div.footer.svelte-e2gyul > form > label > div > div.input-button-wrap.svelte-3axy6s > button").click()
                                    console.log("Reset Seed")
                                    await StakeUsPlus.plugins.dtower.sleep(1500)
                                    document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-modal.svelte-teplsn > div.wrapper.scrollY.svelte-teplsn > div.header.svelte-teplsn > button").click()
                                    round = 0
                                }
                                catch(err)
                                {
                                    console.log("Could reset fairness")
                                }
                            }
                            break;
                        }
                        case "5000": {
                            if(round >= seedReset) {
                                await StakeUsPlus.plugins.dtower.sleep(1000)
                                fairness.click()
                                try {
                                    await StakeUsPlus.plugins.dtower.sleep(1500)
                                    document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-modal.svelte-teplsn > div.wrapper.scrollY.svelte-teplsn > div.footer.svelte-e2gyul > form > label > div > div.input-button-wrap.svelte-3axy6s > button").click()
                                    console.log("Reset Seed")
                                    await StakeUsPlus.plugins.dtower.sleep(1500)
                                    document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-modal.svelte-teplsn > div.wrapper.scrollY.svelte-teplsn > div.header.svelte-teplsn > button").click()
                                    round = 0
                                }
                                catch(err)
                                {
                                    console.log("Could reset fairness")
                                }
                            }
                            break;
                        }
                    }
                    //console.log("Clicking Play")
                    round++
                    console.log("Playing round " + round)
                    button1.click()
                    await StakeUsPlus.plugins.dtower.sleep(1000)
                    StakeUsPlus.plugins.dtower.startBot()

                } else {
                    if (button1.innerHTML == "Pick Random Tile") {
                        try {
                            var multi = document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-sidebar.svelte-2dxdox > div.profit.svelte-5v1hdl > label > div.labels.svelte-5v1hdl > span > span").innerHTML.match(/\d.\d\d/gi)
                            if (multi < StakeUsPlus.plugins.dtower.getConfig("cashout")) {
                                //Have not met cashout yet
                                button1.click()
                                StakeUsPlus.plugins.dtower.startBot()
                            } else {
                                //Cashout
                                document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-sidebar.svelte-2dxdox > button.button.variant-success.size-xl.align-center.svelte-1pcg5q8").click()
                                if (StakeUsPlus.plugins.dtower.getConfig("progressive") == true) {
                                    StakeUsPlus.plugins.dtower.botCashout()
                                    await StakeUsPlus.plugins.dtower.sleep(waittime)
                                } else {
                                    await StakeUsPlus.plugins.dtower.sleep(waittime)
                                    StakeUsPlus.plugins.dtower.startBot()
                                }
                            }
                        }
                        catch(err) {
                            //console.log("You lost, starting over")
                            await StakeUsPlus.plugins.dtower.sleep(waittime)
                            StakeUsPlus.plugins.dtower.botLoss()
                        }
                    }
                }
            } else {console.log("Bot is currently disabled")}
        }

        async botCashout() {
            if (StakeUsPlus.plugins.dtower.getConfig("maxwins") == cashout+1) {
                StakeUsPlus.plugins.dtower.botLoss()
            } else {
                await StakeUsPlus.plugins.dtower.sleep(1000)
                //console.log("Cashout count: " +cashout)
                //2x button
                cashout++;
                document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-sidebar.svelte-2dxdox > label:nth-child(2) > div > div.input-button-wrap.svelte-3axy6s > button:nth-child(2)").click()
                await StakeUsPlus.plugins.dtower.sleep(1000)
                setplay = 0
                StakeUsPlus.plugins.dtower.startBot()
            }
        }

        async botLoss() {
            await StakeUsPlus.plugins.dtower.sleep(1000)
            //1/2 button
            let lowerbet = document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-sidebar.svelte-2dxdox > label:nth-child(2) > div > div.input-button-wrap.svelte-3axy6s > button:nth-child(1)")
            for (let i = 0; i < cashout; i++) {
                lowerbet.click()
                await StakeUsPlus.plugins.dtower.sleep(500)
            }
            cashout = 0
            setplay = 0
            StakeUsPlus.plugins.dtower.startBot()
        }


        mkBtn() {

            var text = "Start"
            //
            let div = document.querySelector("#svelte")
            var cssObj = cssObj || {position: 'fixed', top: '15%', right:'1%', 'z-index': 3, fontWeight: '600', fontSize: '14px', backgroundColor: '#00cccc', color: 'white', border: 'none', padding: '10px 20px', }
            let button = document.createElement('button'), btnStyle = button.style
            div.appendChild(button)
            button.innerHTML = text
            button.onclick = () => {
                setplay = 0;
                StakeUsPlus.plugins.dtower.startBot();
            };
            Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
            return button
        }


    }

    const plugin = new dtower();
    StakeUsPlus.registerPlugin(plugin);
    setTimeout(
        function(){
            console.log("Making Button");
            StakeUsPlus.plugins.dtower.mkBtn()
        }, 5000)
})();