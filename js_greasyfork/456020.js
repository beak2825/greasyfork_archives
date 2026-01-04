// ==UserScript==
// @name        ZoomControl
// @namespace   Violentmonkey Scripts
// @match       https://starblast.io/*
// @grant       none
// @version     0.5
// @author      ed
// @license     GPL-3.0-or-later
// @description Use mouse wheel to adjust the viewport zoom
// @icon        https://starblast.io/static/img/icon64.png
// @downloadURL https://update.greasyfork.org/scripts/456020/ZoomControl.user.js
// @updateURL https://update.greasyfork.org/scripts/456020/ZoomControl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.ga = function(...args) {
        return true;
    };
    var DEBUG = false;
    Window.__gameSocket = undefined;
    Window.__zoomCtrlFactor = 0.01; // changes how much zoom will be increased/decreased
    Window.__selectingTeamModeEnabled = false;

    /**
     * Sends a websocket message to the connected game socket telling it to join a specific team.
     * Works even for grayed out teams for some reason, you can join the winning team if you want with this.
     * @param {WebSocket} socket - socket object used to send the message
     * @param {Number} teamId - The team to be joined
     */
    Window.__joinTeam = async function(teamId = 0, socket = Window.__gameSocket) {
        if (!(socket instanceof WebSocket)) throw new Error("socket is not a WebSocket");
        if (socket.readyState != WebSocket.OPEN) return;
        /****** subject to change if the game updates ******/
        socket.send(JSON.stringify({
            "name": "enter",
            "data": {
                "team": teamId,
                "spectate": false
            }
        }));
        // sleep a bit, supposedly waiting the confirmation
        await new Promise(r => setTimeout(() => r(), 100));
        // spawn into the team
        socket.send(JSON.stringify({
            "name": "respawn"
        }));
        // tryfix
        await new Promise(r => setTimeout(() => r(), 100));
        socket.send(JSON.stringify({
            "name": "get_name",
            "data": {
                "id": 1
            }
        }));
    };

    /**
     * ensures that the right socket object is found
     * @param {Object} obj - object to be validated
     * @param {String} propertyToFind - name of the property to find
     * @returns true if the validation was ok, false otherwise
     */
    Window.__validateSocketObject = function(obj, propertyToFind) {
        let socket = obj[propertyToFind];
        if (typeof(socket) === 'object' &&
            socket instanceof WebSocket &&
            socket.url.includes("starblast.io")) {
            return true;
        }
        return false;
    };

    Window.__validateChildren = function(_obj, _propertyToFind) {
        return Object.keys(_obj).includes(_propertyToFind);
    };

    /**
     * recursive function to deep find a specific property inside objects
     * @param obj - initial object
     * @param propertyToFind - name of the property to find
     * @param curDepth - used to keep track of current depth, should be 0 at the beginning
     * @param history - used for debugging, shows where the path of objects where the property was found
     * @param validator - function used to validate specific criteria to ensure the right property path is found. This is important,
     * it should be used to verify other variables in the same scope.
     * @param visited - used internally to avoid circular references
     * @returns the found object, if found. null if not found.
     */
    Window.__findRecursively = function(obj, propertyToFind, curDepth = 0, history = [], validator = null, visited = []) {
        if (curDepth > 8 || obj == null) {
            return null;
        }
        // main validation, find the desired property in subitems
        validator = validator === null ? Window.__validateChildren : validator;

        if (validator(obj, propertyToFind)) {
            return obj[propertyToFind];
        }

        // avoid circular references
        for (var vobj of visited) {
            if (vobj === obj)
                return null;
        }
        visited.push(obj);

        if (typeof(obj) === 'object') {
            for (let i of Object.keys(obj)) {
                let ret = Window.__findRecursively(obj[i], propertyToFind, curDepth + 1, history, validator, visited);
                if (ret) {
                    history.push(i);
                    return ret;
                }
            }
        }
        return null;
    };

    /**
     * non-recursive version of __findRecursively
     * @returns the found object, if found. null if not found.
     */
    Window.__findIteractively = function(obj, propertyToFind, validator = null, history = [], deepFirst = false, maxDepth = 8) {

        let visited = [];
        let stack = Object.keys(obj).map(obj => [{
            o: obj,
            depth: 1,
            parent: undefined
        }][0]);
        let pushMethod = deepFirst ? stack.push : stack.unshift;

        // main validation, find the desired property in subitems
        validator = validator === null ? Window.__validateChildren : validator;

        while (stack.length > 0) {
            let current = stack.pop();
            let curObj = current.o,
                curDepth = current.depth;

            if (curDepth > maxDepth || curObj == null) {
                continue;
            }

            if (validator(curObj, propertyToFind)) {
                let objParent = parent;
                while (objParent != null) {
                    if (objParent) {
                        history.push(objParent);
                    }
                    objParent = objParent.parent;
                }
                history.push(curObj);
                history.push(curObj[propertyToFind]);
                return curObj[propertyToFind];
            }

            // avoid circular references
            for (var vobj of visited) {
                if (vobj === curObj)
                    return null;
            }
            visited.push(curObj);

            if (typeof(curObj) === 'object') {
                for (let i of Object.keys(curObj)) {
                    pushMethod({
                        o: curObj[i],
                        depth: curDepth + 1,
                        parent: curObj
                    });
                }
            }
        }
    };

    /**
     * ensures that the right ship list was found, there is one with json strings in it which is useless for us
     * @param {Object} obj - object to be validated
     * @param {String} propertyToFind - name of the property to find
     * @returns true if the validation was ok, false otherwise
     */
    Window.__validateShipsObject = function(obj, propertyToFind) {
        let ships = obj[propertyToFind];
        if (typeof(ships) === 'object' &&
            ships.length > 0 &&
            typeof(ships[0]) !== 'string') // cant edit ship properties if they are json strings
        {
            return true;
        }
        return false;
    };

    /**
     * callback used to set the game zoom
     * @param event - mousewheel event
     * @param event - list of all game's ships and their respective properties
     */
    Window.__zoomCtrlFn = function(event, ships) {
        // scroll down = decrease zoom
        // scroll up = increase zoom
        let y = event.deltaY > 0 ? -Window.__zoomCtrlFactor : Window.__zoomCtrlFactor;
        ships.forEach((s) => {
            // by default some game modes dont have a zoom property, but it still works if added
            if (s.zoom == null) {
                s.zoom = 1.0;
            }
            // prevent zero and negative values that makes the camera zoom in and out like crazy
            s.zoom = Math.max(s.zoom + y, Window.__zoomCtrlFactor);
        });
    };

    Window.__patchEcpVerified = function(thisArg, args) {
        let funcEcpVerifiedCheck = /return ?"yes" ?=== ?this.verified/g;
    };

    Window.__patchAntiAdblock = function(thisArg, args) {
        let isAdBlocked = null,
            objectPath = [];

        if (args != null &&
            args.length > 1 &&
            args[1].length > 0 &&
            args[1][0]) {
            isAdBlocked = Window.__findRecursively(args[1][0], "isAdBlocked", 0, objectPath, null);
        }
        if (typeof isAdBlocked === 'boolean') {
            var parentOfIsAdBlockedVar = null;
            for (let i = objectPath.length - 1; i >= 0; i--) {
                if (parentOfIsAdBlockedVar == null) {
                    parentOfIsAdBlockedVar = args[1][0][objectPath[i]];
                } else {
                    parentOfIsAdBlockedVar = parentOfIsAdBlockedVar[objectPath[i]];
                }
            }

            // hacky fix for anti ad-block, the game relies on top-level objects
            // so this overwrites it constantly to prevent it from being used
            if (Window.__antiAntiAdBlock == null) {
                let nullFunc = function() {};
                let patchedRequestAd = function(whenStr, objsCallbacks) {
                    objsCallbacks.adFinished();
                };
                Window.__antiAntiAdBlock = setInterval(function() {
                    // might need to change in the future
                    parentOfIsAdBlockedVar.isAdBlocked = false;
                    window.adplayer = null;
                    window.crazysdk = null;
                    window.csdk.requestBanner = nullFunc;
                    window.csdk.requestAd = patchedRequestAd;
                }, 60);
            }
            Window.__parentOfAdBlockedVar = parentOfIsAdBlockedVar;
        }
    };

    Window.__patchFunctionZoom = function(thisArg, args) {
        let ships = null,
            objectPath = [];

        if (args != null &&
            args.length > 1 &&
            args[1].length > 0 &&
            args[1][0]) {
            ships = Window.__findRecursively(args[1][0], "ships", 0, objectPath, Window.__validateShipsObject);
        }

        if (ships) {
            console.log(objectPath.reverse().join("."));
            if (Window.__e == undefined) {
                Window.__e = args[1][0];

                window.addEventListener('mousewheel', (event) => Window.__zoomCtrlFn(event, ships));
                ships.forEach((s) => {
                    if (s.typespec != null &&
                        s.typespec.specs != null &&
                        s.typespec.specs.ship != null) {
                        s.typespec.specs.ship.rotation = [200, 220];
                        s.typespec.specs.ship.mass = 20;
                    }
                    // capture the flag mode
                    if (s.specs != null &&
                        s.specs.ship != null) {
                        s.specs.ship.rotation = [200, 220];
                        s.specs.ship.mass = 20;
                    }
                });
            }
            return true;
        }
        return false;
    };

    /**
     * Tries to apply a patch function inside a private scope
     * @param {Function} patchFunction - callback which receives the params of the proxied call
     */
    Window.__applyPatch = function(patchFunction) {
        // intercept every function call until we find the right scope
        var FunctionPrototypeCallOrig = Function.prototype.call;
        Function.prototype.call = new Proxy(Function.prototype.call, {
            apply(thisArg, ...args) {
                // remove patch because this may slowdown a bit the page
                // since this whole block of code is executed on every function call
                Window.__c = Window.__c == undefined ? 0 : Window.__c + 1;
                if (Window.__c > 10000) {
                    console.log("unable to patch. giving up");
                    Function.prototype.call = FunctionPrototypeCallOrig;
                }

                if (patchFunction(thisArg, args)) {
                    console.log("patch applied successfully");
                    Function.prototype.call = FunctionPrototypeCallOrig;
                }

                return thisArg.apply(...args);
            }
        });
    };

    Window.__patchGetSocket = function() {
        let objectPath = [];
        let socket = Window.__findRecursively(window, "socket", 0, objectPath, Window.__validateSocketObject);
        if (socket) {
            Window.__gameSocket = socket;
            return Window.__gameSocket;
        }
    };

    window.addEventListener('keypress', function(e) {
        console.log(e.key);
        if (e.key == '.') {
            console.log("patching zoom");
            Window.__applyPatch(Window.__patchFunctionZoom);
            console.log("patching anti-adblock");
            Window.__applyPatch(Window.__patchAntiAdblock);
        } else if (e.key == ',') {
            if (Window.__patchGetSocket()) {
                Window.__selectingTeamModeEnabled = true;
            }
        } else if (e.key == '1' && Window.__selectingTeamModeEnabled) {
            Window.__joinTeam(0);
            Window.__selectingTeamModeEnabled = false;
        } else if (e.key == '2' && Window.__selectingTeamModeEnabled) {
            Window.__joinTeam(1);
            Window.__selectingTeamModeEnabled = false;
        } else if (e.key == '3' && Window.__selectingTeamModeEnabled) {
            Window.__joinTeam(2);
            Window.__selectingTeamModeEnabled = false;
        }
    });

})();