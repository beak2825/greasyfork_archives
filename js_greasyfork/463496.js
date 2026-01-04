// ==UserScript==
// @name         IdlePixel Easter 2023 Tracker
// @namespace    lbtechnology.info
// @version      1.1.0
// @description  Tracks which eggs have been crafted & notifies for bunny
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/463496/IdlePixel%20Easter%202023%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/463496/IdlePixel%20Easter%202023%20Tracker.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    let eggList = new Set()
    let bunnyActive = false;

    const fullEggList = [
        "stone_egg",
        "copper_egg",
        "iron_egg",
        "silver_egg",
        "gold_egg",
        "bronze_metal_egg",
        "iron_metal_egg",
        "silver_metal_egg",
        "gold_metal_egg",
        "dotted_green_leaf_egg",
        "green_leaf_egg",
        "lime_leaf_egg",
        "gold_leaf_egg",
        "logs_egg",
        "oak_logs_egg",
        "willow_logs_egg",
        "maple_logs_egg",
        "chocolate_bar_egg",
        "apple_egg",
        "banana_egg",
        "maggot_egg",
        "stinger_egg",
        "iron_dagger_egg",
    ]
  
    class EasterPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("easter", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
            this.previous = "";
        }

        createPanel(){
            IdlePixelPlus.addPanel("eastereggs", "Easter Egg List", function() {
                let content = "<div>";
                fullEggList.forEach((egg)=>{
                    const found = eggList.has(egg)? "\u{1F7E2}" : "\u{1F534}"

                    content += `<p class="notification"><strong>${egg.toUpperCase().replace("_", " ")} ${found}</strong></p><br/>`
                })
                content += "</div>";
                return content;
            });
        }

        onLogin(){
            const onlineCount = $(".top-bar .gold:not(#top-bar-admin-link)");
            onlineCount.before(`
            <a href="#" class="hover float-end link-no-decoration" onclick="event.preventDefault(); IdlePixelPlus.setPanel('eastereggs')" title="Open Egg List">Eggs&nbsp;&nbsp;&nbsp;</a>
            `);
            this.createPanel()
        }
 
        onMessageReceived(data){
            if(data.startsWith("SET_ITEMS=")){
                const split = data.substring("SET_ITEMS=".length).split("~");
                split.forEach(element => {
                    if (element.endsWith("egg_crafted")){
                        eggList.add(element.slice(0, -8))
                        IdlePixelPlus.refreshPanel("eastereggs")
                        console.log(eggList)
                    }
                })
                if (typeof var_easter_bunny_timer !== 'undefined'){
                    if (var_easter_bunny_timer > 0 && bunnyActive===false){
                        bunnyActive = true;
                        this.notify();
                    }
                    else if (var_easter_bunny_timer < 1 && bunnyActive===true){
                        bunnyActive = false;
                    }
                }
            }
        }

        notify(){
            Sounds.play(Sounds.VARIABLE_POWER_UP)
            if (!window.Notification) {
                alert("Sorry, Notifications are not supported in this Browser!");
            } else {
                if (Notification.permission === 'default') {
                    Notification.requestPermission(function(p) {
                        if (p === 'denied') {
                            alert('You have denied Notifications'); }
                        else {
                            var notify = new Notification('Bunny Notification', {
                                body: `The bunny has appeared!`,
                                requireInteraction: true,
                                icon: bun
                            });
                        }
                    });
                } else {
                    var notify = new Notification('Bunny Notification', {
                        body: `The bunny has appeared!`,
                        requireInteraction: true,
                        icon: bun
                    });
                }
            }
        }


    }
 
    const plugin = new EasterPlugin();
    var bun = "https://d1xsc8x7nc5q8t.cloudfront.net/images/easter_bunny.png"
    IdlePixelPlus.registerPlugin(plugin);
 
})(); 