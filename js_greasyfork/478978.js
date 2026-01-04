// ==UserScript==
// @name         Dice(US)
// @namespace    Auto99
// @version      1.3
// @description  99 Dice (US)
// @author       diehard2k0
// @match        *://stake.us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stake.us
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://update.greasyfork.org/scripts/480138/1321848/StakeUs%2B.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478978/Dice%28US%29.user.js
// @updateURL https://update.greasyfork.org/scripts/478978/Dice%28US%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    class dice extends StakeUsPlusPlugin {
        constructor() {
            super("dice", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "runDice",
                        label: "Run Dice",
                        type: "checkbox",
                        default: true
                    },
                ]
            });
        }

        onConfigsChanged() {
            if(this.getConfig("runDice")) {
                StakeUsPlus.plugins.dice.mkBtn()
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

        async checkSettings() {
            var settings = document.querySelector("#main-content > div > div.game-footer.svelte-1gyzqh2 > div.stack.x-space-between.y-center.gap-none.padding-none.direction-horizontal.padding-left-auto.padding-top-auto.padding-bottom-auto.padding-right-small.svelte-1mgzzos > div.dropdown.svelte-r0kn32.transparent > div > button")
            await StakeUsPlus.plugins.dice.sleep(1000)

            if (settings) {
                StakeUsPlus.plugins.dice.triggerMouseEvent (settings, "mouseover");
                StakeUsPlus.plugins.dice.triggerMouseEvent (settings, "mousedown");
                StakeUsPlus.plugins.dice.triggerMouseEvent (settings, "mouseup");
                StakeUsPlus.plugins.dice.triggerMouseEvent (settings, "click");
                await StakeUsPlus.plugins.dice.sleep(250)
                StakeUsPlus.plugins.dice.checkAni()
                await StakeUsPlus.plugins.dice.sleep(250)
                StakeUsPlus.plugins.dice.checkInstant()
                await StakeUsPlus.plugins.dice.sleep(250)
                StakeUsPlus.plugins.dice.selectAuto()
            } else {
                console.log("Could not find settings")
            }
        }

        async checkAni() {
            var animation = document.querySelector("body > div:nth-child(14) > div > div > div:nth-child(2) > div > button:nth-child(3)")

            await StakeUsPlus.plugins.dice.sleep(100)
            if (animation) {
                var tmp = animation.getAttributeNode('class')
                if (!tmp.textContent.match("active")) {
                    console.log("Animations already deactive... Skipping.")
                } else {
                    console.log("Animations disabled")
                    StakeUsPlus.plugins.dice.triggerMouseEvent (animation, "click");
                }
            } else {
                console.log("Could not disable Animations")
            }
        }

        async checkInstant() {
            var instant = document.querySelector("body > div:nth-child(6) > div > div > div:nth-child(2) > div > button:nth-child(2)")

            await StakeUsPlus.plugins.dice.sleep(100)
            if (instant) {
                var tmp = instant.getAttributeNode('class')
                if (tmp.textContent.match("active")) {
                    console.log("Instant Play Active Already... Skipping.")
                } else {
                    console.log("Instant Play Triggered")
                    triggerMouseEvent (instant, "click");
                }
            } else {
                console.log("Could not trigger Instant Play")
            }
        }

        async selectAuto() {
            var autoTab = document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-sidebar.svelte-2dxdox > div.tabs-wrapper.scrollX.fullWidth.svelte-1vkrcyy > div > div > button.button.variant-tabmenu.size-sm.align-center.rounded.active.svelte-1pcg5q8")
            if (autoTab) {
                console.log("Clicking Auto tab");
                StakeUsPlus.plugins.dice.triggerMouseEvent (autoTab, "click");
                await StakeUsPlus.plugins.dice.sleep(500);
                StakeUsPlus.plugins.dice.setAutoPlay();
            } else {console.log("Could not locate Auto Tab")}
        }

        async setAutoPlay() {
            await StakeUsPlus.plugins.dice.sleep(100)
            var autoPlay = document.querySelector("#main-content > div > div.content.svelte-h8r3ex > div.game-sidebar.svelte-2dxdox > button")
            if (autoPlay) {
                console.log("Selecting Auto Play");
                autoPlay.removeAttribute("disabled")
                console.log("Auto Play Enabled");
                autoPlay.click();
            }

        }

        mkBtn() {
            var text = "Start"
            let div = document.querySelector("#svelte")
            var cssObj = cssObj || {position: 'fixed', top: '15%', right:'4%', 'z-index': 3, fontWeight: '600', fontSize: '14px', backgroundColor: '#00cccc', color: 'white', border: 'none', padding: '10px 20px', }
            let button = document.createElement('button'), btnStyle = button.style
            div.appendChild(button)
            button.innerHTML = text
            button.onclick = () => {
                StakeUsPlus.plugins.dice.checkSettings();
            };
            Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
            return button
        }


    }

    const plugin = new dice();
    StakeUsPlus.registerPlugin(plugin);
    setTimeout(
        function(){
            console.log("Making Button");
            StakeUsPlus.plugins.dice.mkBtn()
        }, 5000)
})();