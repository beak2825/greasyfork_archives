// ==UserScript==
// @name         Shell Shockers Basic Aimbot + ESP: LibertyMutualV1
// @namespace    https://github.com/onlypuppy7/LibertyMutualShellShockers/
// @license      GPL-3.0
// @version      1.4.1
// @author       onlypuppy7
// @description  UPDATED FOR 0.50.0! Fed up of a popular script injecting ads into your game? Need a simple script to modify or use? FOSS ESP, Tracers and Aimbot. Hold right mouse button to aimlock.
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @icon         https://github.com/onlypuppy7/LibertyMutualShellShockers/blob/main/scripticon.jpg?raw=true
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdn.jsdelivr.net/npm/babylonjs@7.15.0/babylon.min.js
// @downloadURL https://update.greasyfork.org/scripts/484168/Shell%20Shockers%20Basic%20Aimbot%20%2B%20ESP%3A%20LibertyMutualV1.user.js
// @updateURL https://update.greasyfork.org/scripts/484168/Shell%20Shockers%20Basic%20Aimbot%20%2B%20ESP%3A%20LibertyMutualV1.meta.js
// ==/UserScript==

//Usage: Hold right mouse button to aimlock
//This script is more of a template than a functioning tool. If you're modifying this, you can add a GUI to start!

(function () {
    //intercept log
    const oldConsoleLog = console.log;
    const log = function(...args) {
        const argsNew = [
            "%c%s",
            `color: white; font-weight: bold; background:rgb(212, 212, 0); padding: 2px 6px; border-radius: 5px; margin-right: 5px;`,
            `LM`,
            ...args
        ];
        oldConsoleLog.apply(console, argsNew);
    };
    //create random number betwee 1 and 999
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    let randomDebugKey = `debug${randomInt(9,999)}`;
    log("LM started??", randomDebugKey);

    // crackedshell is a script executor for chromebooks
    let crackedShell = typeof $WEBSOCKET !== 'undefined';

    let originalReplace = String.prototype.replace;

    String.prototype.originalReplace = function() {
        return originalReplace.apply(this, arguments);
    };

    const enableESP=true; //turn to false for off
    const enableTracers=true; //turn to false for off

    //Credit for script injection code: AI. ChatGPT prompt: "tampermonkey script. how can i make it grab a javascript file as it's loaded. if it detects the javascript file, make it apply modifications to it via regex? using XMLHttpRequest"
    //Credit for idea to use XMLHttpRequest: A3+++
    const useXHRMethod = false;

    if (useXHRMethod) {
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRGetResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
        let shellshockjs
        XMLHttpRequest.prototype.open = function(...args) {
            const url = args[1];
            if (url && url.includes("js/shellshock.js")) {
                shellshockjs = this;
            };
            originalXHROpen.apply(this, args);
        };
        Object.defineProperty(XMLHttpRequest.prototype, 'response', {
            get: function() {
                if (this===shellshockjs) {
                    return applyLibertyMutual(originalXHRGetResponse.get.call(this));
                };
                return originalXHRGetResponse.get.call(this);
            }
        });
    };

    let _apc = HTMLElement.prototype.appendChild;
    let shellshock_og = null;

    HTMLElement.prototype.appendChild = function(node) {
        if (node.tagName === 'SCRIPT' && node.innerHTML && node.innerHTML.startsWith('(()=>{')) {
            shellshock_og = node.innerHTML;
            log("shellshock_og set");
            node.innerHTML = applyLibertyMutual(node.innerHTML);
        };
        return _apc.call(this, node);
    };
    
    const proto = unsafeWindow.HTMLScriptElement.prototype;
    const existing = Object.getOwnPropertyDescriptor(proto, "textContent");

    const original = existing || Object.getOwnPropertyDescriptor(unsafeWindow.Node.prototype, "textContent");

    Object.defineProperty(proto, "textContent", {
        get: function () {
            let textContent = original.get.call(this);
            if (textContent && textContent.startsWith('(()=>{')) {
                log("returning shellshock_og");
                return shellshock_og;
            } else {
                return textContent;
            };
        },
        set: original.set,
        configurable: true,
        enumerable: true
    });

    //Credit for event listener code: AI. ChatGPT prompt: "tampermonkey script. how can i intercept the addEventListener function and log the type of event, listener, and options?"
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    // const eventCache = [];
    // unsafeWindow.__eventListenerCache = eventCache;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
        try {
            const target = this;
            const tag = target.tagName || target.constructor.name;

            // eventCache.push({ target: tag, type, listener, options });

            // log(`Listener added: [${tag}] type=${type}, listener=${listener.name || 'anonymous'}, options=${JSON.stringify(options)}`);

            if (type == "pointermove" && listener.name == "real") {
                yawpitch.listener = listener;
                log("Gotcha. REAL pointermove listener detected.");
                
                const originalListener = listener;
                listener = function(event) {
                    yawpitch.listenerHook(event, originalListener);
                };
            };
        } catch (e) {
            console.warn('Event hook error:', e);
        };

        return originalAddEventListener.call(this, type, listener, options);
    };

    const yawpitch = {
        magicValue: 0.0025, // multiplier for mouse movement
        listener: null,
        movementsToApply: {
            x: 0,
            y: 0,
            reset: () => {
                yawpitch.movementsToApply.x = 0;
                yawpitch.movementsToApply.y = 0;
            },
        },
        listenerHook: (event, originalListener) => {
            //this is a mess of many failed ideas and i could clean this, but i feel it might be useful in the future

            // const deltaX = yawpitch.movementsToApply.x;
            // const deltaY = yawpitch.movementsToApply.y;

            // const proxyEvent = new Proxy(event, {
            //     get(target, prop) {
            //         if (prop === 'movementX') return target.movementX + deltaX;
            //         if (prop === 'movementY') return target.movementY + deltaY;
            //         if (prop === 'isTrusted') return true;
            //         return Reflect.get(target, prop);
            //     },
            // });

            console.log("YawPitch listener hook called with event:", event);
            originalListener.call(this, event);

            //uncomment for thing
            // const proxyEvent = {
            //     movementX: event.movementX + yawpitch.movementsToApply.x,
            //     movementY: event.movementY + yawpitch.movementsToApply.y,
            //     isTrusted: true,
            // };

            // // log("x:", proxyEvent.movementX, "y:", proxyEvent.movementY, "mX:", yawpitch.movementsToApply.x, "mY:", yawpitch.movementsToApply.y);
            // yawpitch.movementsToApply.reset();
    
            // // console.log("YawPitch listener hook called with event:", event);

            // originalListener.call(this, { 
            //     movementX: proxyEvent.movementX,
            //     movementY: proxyEvent.movementY,
            //     isTrusted: true
            // });
        },
        // fakeMovePointer: (force = false) => {
        //     if (!force && !(yawpitch.movementsToApply.x || yawpitch.movementsToApply.y)) {
        //         return;
        //     };
        //     const event = new PointerEvent('pointermove');
        //     yawpitch.listenerHook(event, yawpitch.listener);
        // },
        movePointer: (movementX = 0, movementY = 0) => {
            yawpitch.setMouseParams();

            movementX = Math.ceil(movementX);
            movementY = Math.ceil(movementY);

            yawpitch.listener({ //direct call will bypass the hook
                movementX,
                movementY,
                x: 1,
                isTrusted: true,
            });

            yawpitch.getAndSetYawPitch();
        },
        getAndSetYawPitch: (viaWasm = true) => {
            if (viaWasm) {
                const result = unsafeWindow.get_yaw_pitch();
                ss.MYPLAYER[H.yaw] = result.yaw;
                ss.MYPLAYER[H.pitch] = result.pitch;
                ss.MYPLAYER[H.coords] = result.coords;
                return result;
            } else {
                return {
                    yaw: ss.MYPLAYER[H.yaw],
                    pitch: ss.MYPLAYER[H.pitch],
                    coords: ss.MYPLAYER[H.coords]
                };
            };
        },
        setMouseParams: (mouseSpeed = 50, mouseInvert = 0, scopeFov = 0.9, scope = false, uniqueId = ss.MYPLAYER[H.uniqueId]) => {
            unsafeWindow.set_mouse_params(
                mouseSpeed,
                mouseInvert, 
                scopeFov, //ss.MYPLAYER[H.weapon][H.actor].scopeFov
                scope, //ss.MYPLAYER.scope
                uniqueId
            );
        },
        changeByMovement: (x = 0, y = 0) => {
            yawpitch.setMouseParams();

            log("Changing yaw and pitch by movement:", x, y);

            yawpitch.movePointer(x, y);

            // yawpitch.movementsToApply.x = x;
            // yawpitch.movementsToApply.y = y;
            // yawpitch.fakeMovePointer();
        },
        changeByYawPitchDiff: (yaw = 0, pitch = 0) => {
            yawpitch.changeByMovement(
                yaw   / yawpitch.magicValue,
                pitch / yawpitch.magicValue
            );
        },
        radianAngleDiff: (angle1 = 0, angle2 = 0) => {
            const fullCircle = 2 * Math.PI;
            // Normalize angles to be within [0, 2π]
            angle1 = (angle1 % fullCircle + fullCircle) % fullCircle;
            angle2 = (angle2 % fullCircle + fullCircle) % fullCircle;
            // Find the absolute angular difference
            let diff = Math.abs(angle1 - angle2);
            // Ensure the difference is within [0, π)
            diff = Math.min(diff, fullCircle - diff);
            // Determine the sign of the difference correctly
            if ((angle1 - angle2 + fullCircle) % fullCircle > Math.PI) {
                return -diff;
            } else {
                return diff;
            };
        },
        setToYawPitch: (yaw = 0, pitch = 0) => {
            const yawDiff = yawpitch.radianAngleDiff(ss.MYPLAYER[H.yaw], yaw);
            const pitchDiff = yawpitch.radianAngleDiff(ss.MYPLAYER[H.pitch], pitch);

            // log("Setting yaw and pitch:", yaw, pitch, "Diffs:", yawDiff, pitchDiff);

            yawpitch.changeByYawPitchDiff(yawDiff, pitchDiff);
        },
        getCoordsForYawPitch: (yaw = 0, pitch = 0) => { //useful for silent
            const starting = yawpitch.getAndSetYawPitch(false);
            yawpitch.setToYawPitch(yaw, pitch);
            const atDesired = yawpitch.getAndSetYawPitch(false);
            yawpitch.setToYawPitch(starting.yaw, starting.pitch);

            //for testing
            // const ending = yawpitch.getAndSetYawPitch(false);
            // console.log("Starting:", starting, "At desired:", atDesired, "Ending:", ending);

            return atDesired;
        },
    };

    //VAR STUFF
    let F=[];
    let H={};
    let functionNames=[];
    let ESPArray=[];
    let RMB=false;

    //Credit: AI. ChatGPT prompt: "make javascript tampermonkey code that sets a variable RMB to true while right mouse button is being held"
    document.addEventListener('mousedown', function(event) {
        if (event.button === 2) {
            RMB = true;
        };
    }, true);

    document.addEventListener('mouseup', function(event) {
        if (event.button === 2) {
            RMB = false;
        };
    }, true);

    //scrambled... geddit????
    const getScrambled=function(){return Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')}
    const createAnonFunction=function(name,func){
        const funcName=getScrambled();
        window[funcName]=func;
        F[name]=window[funcName];
        functionNames[name]=funcName
    };
    const findKeyWithProperty = function(obj, propertyToFind) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === propertyToFind) {
                    return [key];
                } else if (
                    typeof obj[key] === 'object' &&
                    obj[key] !== null &&
                    obj[key].hasOwnProperty(propertyToFind)
                ) {
                    return key;
                };
            };
        };
        // Property not found
        return null;
    };
    const fetchTextContent = function(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false); // Make the request synchronous
        xhr.send();
        if (xhr.status === 200) {
            return xhr.responseText;
        } else {
            console.error("Error fetching text content. Status:", xhr.status);
            return null;
        };
    };

    const applyLibertyMutual = function(js) {
        // support crackedshell's harsh rewriting system
        // more info @ https://github.com/VillainsRule/CrackedShell
        let clientKeyJS = js;
        // if (crackedShell) clientKeyJS = fetchTextContent('/js/shellshock.og.js');

        // let hash = CryptoJS.SHA256(clientKeyJS).toString(CryptoJS.enc.Hex);
        let clientKeys;
        onlineClientKeys = fetchTextContent("https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/libertymutual_latest.json"); //credit: me :D
        // onlineClientKeys = fetchTextContent("https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/libertymutual_"+hash+".json"); //credit: me :D

        if (onlineClientKeys == "value_undefined" || onlineClientKeys == null) {
            let userInput = prompt('Valid keys could not be retrieved online. Enter keys if you have them. Join the StateFarm Network Discord server to generate keys! https://discord.gg/HYJG3jXVJF', '');
            if (userInput !== null && userInput !== '') {
                alert('Aight, let\'s try this. If it is invalid, it will just crash.');
                clientKeys = JSON.parse(userInput);
            } else {
                alert('You did not enter anything, this is gonna crash lmao.');
            };
        } else {
            clientKeys = JSON.parse(onlineClientKeys);
        };

        H = clientKeys.vars;

        let injectionString="";
        
        const modifyJS = function(find,replace) {
            let oldJS = js;
            js = js.originalReplace(find,replace);
            if (oldJS !== js) {
                log("%cReplacement successful! Injected code: "+replace, 'color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            } else {
                log("%cReplacement failed! Attempted to replace "+find+" with: "+replace, 'color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            };
        };

        log('%cATTEMPTING TO START LIBERTYMUTUAL', 'color: magenta; font-weight: bold; font-size: 1.5em; text-decoration: underline;');
        const variableNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
        for (let name in H) {
            deobf = H[name];
            if (variableNameRegex.test(deobf)) {
                injectionString = `${injectionString}${name}: (() => { try { return ${deobf}; } catch (error) { return "value_undefined"; } })(),`;
            } else {
                alert("Message from the LibertyMutual Devs: WARNING! The keys inputted contain non-variable characters! There is a possibility that this could run code unintended by the LibertyMutual team, although possibly there is also a mistake. Do NOT proceed with using this, and report to the LibertyMutual developers what is printed in the console.");
                log("REPORT THIS IN THE DISCORD SERVER:", clientKeys);
                const crashplease = "balls";
                crashplease = "balls2";
            };
        };
        log(injectionString);
        log('%cLIBERTYMUTUAL INJECTION: INJECT VAR RETRIEVAL FUNCTION AND MAIN LOOP', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
        modifyJS(H.SCENE+'.render',`window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${H.SCENE}.render`);
        log('%cSuccess! Variable retrieval and main loop hooked.', 'color: green; font-weight: bold;');
        modifyJS(`{if(${H.CULL})`,`{if(true)`);
        log('%cSuccess! Cull inhibition hooked.', 'color: green; font-weight: bold;');
        modifyJS("Not playing in iframe", "LIBERTYMUTUAL ACTIVE!");
        // log(js);
        log(H);
        return js;
    };

    let ss = {}; //skvll this wasnt here so it was global skvll
    createAnonFunction("retrieveFunctions",function(vars) { 
        Object.assign(ss, vars);
        F.LIBERTYMUTUAL();
    });

    const tracersKey = getScrambled();

    const createOrUpdateTracer = (PLAYER, CROSSHAIRS) => {
        const points = [
            PLAYER[H.actor][H.mesh].position.clone(),
            CROSSHAIRS.clone()
        ];
        points[0].y += 0.4;

        if (!PLAYER[tracersKey]) {
            PLAYER[tracersKey] = BABYLON.MeshBuilder.CreateLines(getScrambled(), { points, updatable: true }, ss.SCENE);
            PLAYER[tracersKey].isPickable = false;
            PLAYER[tracersKey].alwaysSelectAsActiveMesh = true;
            PLAYER[tracersKey].doNotSyncBoundingInfo = true;
            PLAYER[tracersKey][H.renderingGroupId] = 1;
            PLAYER[tracersKey].visibility = true;
        } else {
            BABYLON.MeshBuilder.CreateLines(undefined, {
                points,
                instance: PLAYER[tracersKey],
                updatable: true
            });
        };

        PLAYER[tracersKey].visibility = (PLAYER[H.playing] && enableTracers);
        return PLAYER[tracersKey];
    };

    createAnonFunction("LIBERTYMUTUAL",function() {
        // globalSS = ss;
        
        ss.PLAYERS.forEach(PLAYER=>{
            if (PLAYER.hasOwnProperty("ws")) {
                ss.MYPLAYER = PLAYER
            };
        });

        H.actor = findKeyWithProperty(ss.MYPLAYER,H.mesh);

        let TARGETED;
        let CROSSHAIRS=new BABYLON.Vector3();
        CROSSHAIRS.copyFrom(ss.MYPLAYER[H.actor][H.mesh].position);

        // eye level
        CROSSHAIRS.y += 0.4;
        const forwardOffset = -5; 
        const yaw = ss.MYPLAYER[H.yaw];
        const pitch = -ss.MYPLAYER[H.pitch];
        const forwardX = Math.sin(yaw) * Math.cos(pitch);
        const forwardY = Math.sin(pitch);
        const forwardZ = Math.cos(yaw) * Math.cos(pitch);
        CROSSHAIRS.x += forwardX * forwardOffset;
        CROSSHAIRS.y += forwardY * forwardOffset;
        CROSSHAIRS.z += forwardZ * forwardOffset;

        const timecode=Date.now();
        let minValue=99999;
        ss.PLAYERS.forEach(PLAYER=>{
            if (PLAYER) {
                PLAYER.timecode=timecode;
                //Partial credit for enemy player filtering: PacyTense. Also just common sense.
                if ((PLAYER!==ss.MYPLAYER) && ((ss.MYPLAYER.team==0)||(PLAYER.team!==ss.MYPLAYER.team))) {
                    //ESP CODE
                    if ((!PLAYER.generatedESP)) {
                        //Credit for box from lines code: AI. ChatGPT prompt: "how can i create a box out of lines in babylon.js?"
                        //ESP BOXES
                        const boxSize = {width: 0.4, height: 0.65, depth: 0.4};
                        const vertices = [
                            new BABYLON.Vector3(-boxSize.width / 2, 0, -boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0, -boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0 + boxSize.height, -boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0 + boxSize.height, -boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0, boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0, boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0 + boxSize.height, boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0 + boxSize.height, boxSize.depth / 2),
                        ];
                        const lines = [];
                        for (let i = 0; i < 4; i++) {
                            lines.push([vertices[i], vertices[(i + 1) % 4]]);
                            lines.push([vertices[i + 4], vertices[(i + 1) % 4 + 4]]);
                            lines.push([vertices[i], vertices[i + 4]]);
                        };
                        const box = BABYLON.MeshBuilder.CreateLineSystem(getScrambled(), { lines }, ss.SCENE);
                        //ChatGPT prompt: "how can i make an object anchored to another object, change its color, and have it render on top of everything else? babylon.js"
                        box.color = new BABYLON.Color3(1, 1, 1);
                        box[H.renderingGroupId] = 1;
                        box.parent=PLAYER[H.actor][H.mesh];
                        
                        PLAYER.box=box;
                        PLAYER.generatedESP=true;
                        ESPArray.push([box,createOrUpdateTracer(PLAYER, CROSSHAIRS),PLAYER]);
                    };
                    
                    createOrUpdateTracer(PLAYER, CROSSHAIRS);

                    PLAYER.box.visibility=enableESP;
                    PLAYER[tracersKey].visibility=(PLAYER[H.playing]&&enableTracers);

                    //AIMBOT CODE
                    //Credit: This section is mostly common sense, and could be made by most decent programmers. It is still worth mentioning PacyTense used a functionally equivalent thing similar to this this before me 4 years ago.
                    const distance=Math.hypot(PLAYER[H.x]-ss.MYPLAYER[H.x], PLAYER[H.y]-ss.MYPLAYER[H.y], PLAYER[H.z]-ss.MYPLAYER[H.z]);

                    if (distance<minValue) {
                        TARGETED=PLAYER;
                        minValue=distance;
                    };
                };
            };
        });
        //im gonna kms why was this in the player loop
        if (RMB && TARGETED && TARGETED[H.playing]) {
            //3D maths
            const directionVector={
                [H.x]: -(TARGETED[H.x]-ss.MYPLAYER[H.x]),
                [H.y]: -(TARGETED[H.y]-ss.MYPLAYER[H.y]-0.05),
                [H.z]: -(TARGETED[H.z]-ss.MYPLAYER[H.z]),
            };
            // console.log("Direction vector:", directionVector, "Yaw:", F.calculateYaw(directionVector), "Pitch:", F.calculatePitch(directionVector));
            yawpitch.setToYawPitch(
                F.calculateYaw(directionVector),
                F.calculatePitch(directionVector)
            );
            // ss.MYPLAYER[H.yaw]=F.calculateYaw(directionVector);
            // ss.MYPLAYER[H.pitch]=F.calculatePitch(directionVector);
        };
        for ( let i=0;i<ESPArray.length;i++) {
            if (ESPArray[i][2] && ESPArray[i][2].timecode==timecode) { //still exists
            } else {
                //Credit for info: AI. ChatGPT prompt: "how can i delete an object in babylon.js?"
                ESPArray[i][0].dispose();
                ESPArray[i][1].dispose();
                ESPArray.splice(i,1);
            };
        };

        if (unsafeWindow[randomDebugKey]) {
            unsafeWindow.globalSS = {
                ss, F, H, functionNames, cross: {
                    CROSSHAIRS, yaw, pitch
                }, BABYLON, TARGETED, ESPArray, RMB, timecode, createOrUpdateTracer, tracersKey, yawpitch
            };
        };

        // log("Main loop executed.");
    });
    createAnonFunction("setPrecision",function (value) { return Math.floor(value * 8192) / 8192 }); //required precision
    createAnonFunction("calculateYaw",function (pos) {
        return F.setPrecision(Math.mod(Math.atan2(pos[H.x],pos[H.z]), Math.PI2));
    });
    createAnonFunction("calculatePitch",function (pos) {
        return F.setPrecision(-Math.atan2(pos[H.y],Math.hypot(pos[H.x],pos[H.z]))%1.5);
    });
})();