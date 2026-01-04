// ==UserScript==
// @name         The Gaming Guru Community Script
// @namespace    https://skidlamer.github.io/
// @version      0.1
// @description  A Community Script for Krunker
// @author       The Gaming Guru Community
// @iconURL      https://cdn.discordapp.com/icons/692606346645733396/2c8c01e76973634afcaec17d22ba5e80.webp?size=128
// @match        *://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406206/The%20Gaming%20Guru%20Community%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/406206/The%20Gaming%20Guru%20Community%20Script.meta.js
// ==/UserScript==

(function(script, state) {
    'use strict';

    const states = {
        updating:"GAME UPDATING\n",
        disconect:"DISCONNECTED\n",
        connecting:"CONNECTING...\n",
        ready:"CLICK TO PLAY\n",
    }

    var me;
    var GUI;
    var showMenu = true;
    var menuDirty = true;
    var features = [];
    var updatedFeat = new Map();
    var players = new Map();
    var vars = new Map();
    var downKeys = new Set();

    let setVars = function() {
        vars.set("isYou", {regex:/this\['\w+']=k,this\['(\w+)']=w,this\['\w+']=!0x0/,pos:1})
        vars.set("inView", {regex:/if\(!\w+\['(\w+)']\)continue/,pos:1})
        for (const [name, object] of vars.entries()) {
            let result = object.regex.exec(script);
            if ( result ) {
                object.val = result[object.pos];
                console.log("found: ", name, " at ", result.index, " value: ", object.val);
            } else {
                object.val = null;
                alert("Failed to find ", name);
            }
        }
    }

    let decodeText = function(str, array, xor) {
        for (var i = 0, il = array.byteLength; i < il; i ++) {
            str += String.fromCharCode(array.getUint8(i) ^ xor);
        }
        try {
            return decodeURIComponent( escape( str ) );
        } catch ( e ) {
            return str;
        }
    }

    let getVersion = function() {
		const elems = document.getElementsByClassName('terms');
		const version = elems[elems.length - 1].innerText;
        return version;
	}

    let saveAs = function(name, data) {
        let blob = new Blob([data], {type: 'text/plain'});
        let el = window.document.createElement("a");
        el.href = window.URL.createObjectURL(blob);
        el.download = name;
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    }

    let isDefined = function(object) {
        return void 0 !== object;
    }

    let isType = function(item, type) {
        return typeof item === type;
    }

    let addObserver = function(elm, check, callback, onshow = true) {
        return new MutationObserver((mutationsList, observer) => {
            if (check == 'src' || onshow && mutationsList[0].target.style.display == 'block' || !onshow) {
                callback(mutationsList[0].target);
            }
        }).observe(elm, check == 'childList' ? {
            childList: true
        } : {
            attributes: true,
            attributeFilter: [check]
        });
    }

    let addListener = function(elm, type, callback = null) {
        if (!isDefined(elm)) { alert("Failed creating " + type + "listener"); return }
        elm.addEventListener(type, event => callback(event));
    }

    //Storage
    let canStore = (typeof(Storage) !== "undefined");
    let saveVal = function(name, val) {
        if (canStore) localStorage.setItem(name, val);
    }
    let deleteVal = function(name) {
        if (canStore) localStorage.removeItem(name);
    }
    let getSavedVal = function(name) {
        if (canStore) return localStorage.getItem(name);
        return null;
    }

    //Features
    let newFeature = (name, keyBind, array, myFunction = null) => {
        const cStruct = (...keys) => ((...v) => keys.reduce((o, k, i) => {
            o[k] = v[i];
            return o
        }, {}));
        let item = [];
        const myStruct = cStruct('name', 'key', 'value', 'valueStr', 'container', 'myFunction')
        const value = parseInt(getSavedVal("utilities_" + name) || 0);
        const feature = myStruct(name, keyBind, value, array.length ? array[value] : '', array, myFunction);
        if (array.length || myFunction) features.push(feature);
        item.push(feature);
        return item;
    }

    let getFeature = (name) => {
        for (const feature of features) {
            if (feature.name.toLowerCase() === name.toLowerCase()) {
                return feature;
            }
        }
        return null;
    }

    let onUpdated = (feature) => {
        window.SOUND.play('tick_0', 0.1);
        if (feature.container.length) {
            feature.value += 1;
            if (feature.value > feature.container.length - 1) {
                feature.value = 0;
            }
            feature.valueStr = feature.container[feature.value];
            saveVal("utilities_" + feature.name, feature.value);
        }
        if (feature.container.length == 2 && feature.container[0] == 'Off' && feature.container[1] == 'On') {
            console.debug(feature.name, " is now ", feature.valueStr);
        }

        if (!updatedFeat.has(feature.name)) {
            console.debug(feature.name, " - Update Pending ")
            updatedFeat.set(feature.name, feature);
        }

        menuDirty = true;
    }

    // keyDown
    let keyDown = (key) => downKeys.has(key)

    // onTick Function
    let onTick = function(game, delta) {
        if (!isDefined(me) || !me || !me.active) return;

        const featureBhop = getFeature('Bhop');
        if (isDefined(featureBhop) && featureBhop.value) {
            if (keyDown("Space") || featureBhop.value !== 2 && featureBhop.value !== 4) {
                game.controls.keys[game.controls.jumpKey] ^= 1;
                game.controls.keys[game.controls.crouchKey] = (me.yVel < -0.04 && me.canSlide) && featureBhop.value !== 1 && featureBhop.value !== 2 ? 1 : 0;
            }

        }
    }

    // onInitialize
    let initialize = function() {

        //Add Features
        newFeature('ESP', "5", ['Off', 'On']);
        newFeature('Bhop', "6", ['Off', 'Auto Jump', 'Key Jump', 'Auto Slide', 'Key Slide']);

        // GameState
        addObserver(window.instructionHolder, 'style', (target) => {
            state = target.innerText;
            if (state.includes(states.updating)) {
                alert(state);
                location.reload();
            }
            else console.log(state)
        });

        // GUI Init
        GUI = document.getElementById("myGUI");
        if (GUI == null) {
            GUI = document.createElement('div');
            GUI.id = "myGUI";
            GUI.style = "float:left;width:100%;background-color: rgba(0,0,0,0.25);border-radius:5%;text-align:right;line-height:0.8;margin-top:5%;";
        }


        // Input/output
        let mouseDownL = false, mouseDownM = false, mouseDownR = false;

        addListener(document, "keyup", event => {
            if (downKeys.has(event.code)) downKeys.delete(event.code)
        })

        addListener(document, "keydown", event => {
            if ('INPUT' == document.activeElement.tagName || !window.endUI && window.endUI.style.display) return;
            switch (event.code) {
                case 'F1':
                    showMenu ^= 1;
                    window.SOUND.play('tick_0', 0.1);
                    menuDirty = showMenu;
                    break;
                case 'F2':
                    saveAs("game_" + getVersion() + ".js", script);
                    break;
                default:
                    if (!downKeys.has(event.code)) downKeys.add(event.code);
                    for (const feature of features) {
                        if (feature && "Digit" + feature.key == event.code) {
                            if (feature.container.length) onUpdated(feature);
                            else if (typeof feature.myFunction === "function") feature.myFunction();
                        }
                    }
                    break;
            }

        })

        addListener(document, "mousedown", event =>{
            const Left=0, Middle=1, Right=2;
            switch(event.button) {
                case Left: mouseDownL = true; break;
                case Middle: mouseDownM = true; break;
                case Right: mouseDownR = true; break;
                default: break;
            }
        });

        addListener(document, "mouseup", event =>{
            const Left=0, Middle=1, Right=2;
            switch(event.button) {
                case Left: mouseDownL = false; break;
                case Middle: mouseDownM = false; break;
                case Right: mouseDownR = false; break;
                default: break;
            }
        });

        //Hook Array
        Array.prototype.push = new Proxy(Array.prototype.push, {
            apply: function(target, that, [item, ...sub]) {
                if (!state) return target.apply(that, [item, ...sub]);
                let size = target.apply(that, [item, ...sub]);
                if (item instanceof Object && item.isPlayer) {
                    players.set(size - 1, item);
                }
                return size;
            }
        })

        //Hook Frame
        window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
            apply: function(target, that, args) {
                for (let [key, player] of players) {
                    if (player && player.active) {
                        if (player[vars.get("isYou").val]) {
                            me = player;
                            if (!player.update.proxy) {
                                player.update = new Proxy(player.update, {
                                    apply: function(target, that, [game, delta]) {
                                        that.update.proxy = true;
                                        onTick(game, delta);
                                        return target.apply(that, [game, delta]);
                                    }
                                })
                            }
                            else {
                                const topLeft = document.getElementById("topLeftHolder");
                                if (topLeft && GUI) {
                                    if (!topLeft.contains(GUI)) {
                                       topLeft.appendChild(GUI);
                                    } else if (showMenu) {
                                        if (menuDirty) {
                                            menuDirty = false;
                                            GUI.innerHTML = "<br><h4 style='text-align:center;color:#1E90FF;'>Community Skid</h4><hr>";
                                            for (const feature of features) {
                                                GUI.innerHTML += `<h5><span style='float:left;margin-left:10%;color:rgba(255,193,72,255)'>${feature.key}</span> <span style='float:left;margin-left:10%;color:rgba(255,255,255,255)'>${feature.name}</span> <span style=float:all;margin-right:10%;margin-left:10%;color:${feature.valueStr == "On" ? "#B2F252" : feature.valueStr == "Off" ? "#FF4444" : "#999EA5"};'>${feature.valueStr}</span></h5>`;
                                            }
                                            GUI.innerHTML += "<br>";
                                        }
                                    } else if (GUI.innerHTML) GUI.innerHTML = null;
                                }
                                for (let[name, feature] of updatedFeat) {
                                    updatedFeat.delete(name);
                                }
                            }
                        }
                        else {
                            const featureESP = getFeature('ESP');
                            if (isDefined(featureESP) && featureESP) {
                                player[vars.get("inView").val] = featureESP.value;
                            }
                        }
                    }
                }
                return target.apply(that, args);
            }
        })
    }

    // Hook Promise Respose to buff
    Response.prototype.arrayBuffer = new Proxy(Response.prototype.arrayBuffer, {
        apply: function(target, that, args) {
            const returnValue = target.apply(that, args);
            returnValue.then(buffer => {
                script = decodeText("", new DataView(buffer), 0x69);
                setVars();
                initialize();
            });
            return returnValue;
        }
    })

})("", null);