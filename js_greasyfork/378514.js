// ==UserScript==
// @name         Agma.io Tools - Dizzy.
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Fast eject, Auto Re-spawn, Re-spawn on R, Quick buy, Chat uncensor, and more
// @author       Dizzy
// @match        agma.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378514/Agmaio%20Tools%20-%20Dizzy.user.js
// @updateURL https://update.greasyfork.org/scripts/378514/Agmaio%20Tools%20-%20Dizzy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let features = [{
        name: "Auto re-spawn",
        enabled: true,
        bootstrap: function() {
            let advert = document.querySelector("#advert")
            let playBtn = document.querySelector("#playBtn");
            let overlays = document.querySelector("#overlays");
            let prevTimeout;
            let muts = [];
            let lastClosed = 0;
            let lastDisplay = "none";

            let closedByDeath = () => Date.now() - lastClosed < 300;
            let triggerPlay = () => {
                if(closedByDeath()) return; // info window was open and closed by dying in the background

                prevTimeout = null;
                window.closeStats();
                playBtn.disabled = false;
                playBtn.click();
            }


            this.load = () => {
                if(muts.length) throw "Auto-respawn feature already loaded";

                muts.push(new MutationObserver(mutations => {
                    for(let mutation of mutations){
                        if(mutation.target.style.display !== lastDisplay){
                            lastDisplay = mutation.target.style.display;

                            if(lastDisplay !== "none"){
                                if(prevTimeout) clearTimeout(prevTimeout);
                                prevTimeout = setTimeout(triggerPlay, 5);
                            }
                        }
                    }
                }))


                muts.push(new MutationObserver(mutations => {
                    for(let mutation of mutations){
                        if(overlays.style.display === "none"){
                            lastClosed = Date.now();
                        }
                    }
                }))

                muts[0].observe(advert, {attributes: true, attributeFilter: ["style"]});
                muts[1].observe(overlays, {attributes: true, attributeFilter: ["style"]});
            }

            this.unload = () => {
                for(let mut of muts){
                    mut.disconnect();
                }
                muts = [];
            }
        }
    },{
        name: "Chat un-censor",
        enabled: true,
        bootstrap: function() {
            let chatBox = document.querySelector("#chtbox");
            let forbiddenWords = ["fuck", "shit", "ass", "dick", "penis", "dick", "pussy", "fag", "bitch", "sucker", "tits", "porn", "cunt", "cock"];
            let listener;

            this.load = () => {
                if(listener) throw "Chat un-censor feature already loaded";
                chatBox.addEventListener("keydown", listener = event => {
                    let text = chatBox.value.toLowerCase();
                    for(let forbidden of forbiddenWords){
                        let loc = text.indexOf(forbidden);

                        if(loc !== -1){
                            let found = chatBox.value.substr(loc, forbidden.length); // retain original to keep case
                            chatBox.value = chatBox.value.replace(found, found.split("").join(String.fromCharCode(8203)))
                        }
                    }
                });
            }

            this.unload = () => listener = chatBox.removeEventListener("keydown", listener);
        }
    }, {
        name: "Fast Eject",
        enabled: true,
        bootstrap: function(){
            const syntheticEvent = {keyCode: 87, synthetic: true};
            Object.freeze(syntheticEvent);

            let int;
            let pressW = () => {
                window.onkeydown(syntheticEvent);
                window.onkeyup(syntheticEvent);
            }
            let downListener = event => {
                if(event.keyCode === 87 && !event.synthetic && !int){
                    int = setInterval(pressW, 25);
                    window.onkeyup(syntheticEvent); // complete first press
                }
            }
            let upListener = event => {
                if(event.keyCode === 87 && !event.synthetic){
                    clearInterval(int);
                    int = null;
                }
            }
            this.load = () => {
                window.addEventListener("keydown", downListener);
                window.addEventListener("keyup", upListener);
            }
            this.unload = () => {
                window.removeEventListener("keydown", downListener);
                window.removeEventListener("keyup", upListener);
            }
        }
    }, {
        name: "Re-spawn on R",
        enabled: true,
        bootstrap: function (){
            let nicknameInput = document.querySelector("#nick");
            let listener = event => {
                if(event.keyCode === 82 && document.activeElement === document.body){
                    window.rspwn(nicknameInput.value);
                }
            }
            this.load = () => {
                window.addEventListener("keydown", listener);
            }

            this.unload = () => {
                window.removeEventListener("keydown", listener);
            }

        }

    }, {
        name: "Quick-buy powerups with keys 1-4", // rename later
        enabled: true,
        bootstrap: function(){
            const [buyRecombine, buySpeed, buyGrowth, buyPushEnemies] = document.querySelectorAll(".purchase-btn.confirmation");
            let confirmButton;
            let alert;
            let onAlertAvailable = () => {
                const showingNow = alert.classList.contains("showSweetAlert");

                if(showingNow){
                    if(!confirmButton){
                        confirmButton = alert.querySelector("button.confirm");
                        if(!confirmButton) return;
                    }

                    // SweetAlert will ignore all clicks until this class is added
                    // which it waits nearly a full second to add.. annoying. Wasted a lot of time debugging this.
                    // https://github.com/lipis/bootstrap-sweetalert/blob/67fdf993b35fa0a9e2c2a34d218cc9d83a59b8bd/dev/modules/handle-click.js#L42
                    alert.classList.add("visible");
                    confirmButton.click();
                }
            }
            let watcher = new MutationObserver(mutations => {
                for(let mutation of mutations){
                    if(mutation.type === "attributes"){
                        if(mutation.target === alert){
                            onAlertAvailable();
                        }
                    }else if(mutation.type === "childList"){
                        for(let node of mutation.addedNodes){
                            if(node.nodeType !== Node.ELEMENT_NODE) continue;
                            if(node.classList.contains("sweet-alert")){
                                alert = node;
                                onAlertAvailable();
                                watcher.disconnect();
                                watcher.observe(node, {attributes: true, attributeFilter: ["class"]})
                            }
                        }
                    }
                }
            })

            let listener = event => {
                if(document.activeElement === document.body){ // focus is on the game rather than chat or anything else
                    if(event.keyCode === 49 || event.keyCode === 97){
                        buyRecombine.click();
                    }else if(event.keyCode === 50 || event.keyCode === 98){
                        buySpeed.click();
                    } else if(event.keyCode === 51 || event.keyCode === 99){
                        buyGrowth.click();
                    } else if(event.keyCode === 52 || event.keyCode === 100){
                        buyPushEnemies.click();
                    }
                }
            }

            this.load = () => {
                watcher.observe(document.body, {
                    childList: true
                });
                window.addEventListener("keydown", listener);
            }
            this.unload = () => {
                watcher.disconnect();
                window.addEventListener("keydown", listener);
            }
        }
    }, {
        name: "Freeze on F",
        enabled: false, // work in progress
        bootstrap: function() {
            const game = document.body;
            let freezing;
            const listener = (event) => {
                if(event.keyCode === 70 && document.activeElement === document.body){
                    if(!freezing){
                        let event = new MouseEvent("mousemove", {
                            clientX: window.innerWidth / 2,
                            clientY: window.innerHeight / 2
                        });
                        freezing = setInterval(() => game.dispatchEvent(event), 20);
                    }else{
                        clearInterval(freezing);
                        freezing = null;
                    }
                }
            }
            this.load = () => {
                window.addEventListener("keydown", listener);
            }
            this.unload = () => {
                window.removeEventListener("keydown", listener);
            }
        }
    }, {
        enabled: true,
        name: "Remove popups",
        bootstrap: function(){
            this.load = () => {
                const popups = document.querySelectorAll("body .modal");
                for(const popup of popups){
                    if(popup.textContent.indexOf("referral") !== -1){
                        popup.remove();
                    }
                }
            }
            this.unload = () => {

            }
        }
    }];

    for(let feature of features){
        if(feature.enabled) {
            feature.instance = new feature.bootstrap();
            feature.instance.load();
        }
    }
})();