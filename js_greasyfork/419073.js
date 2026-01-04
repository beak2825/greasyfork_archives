// ==UserScript==
// @name Krunker Dogeware
// @description The most advanced krunker cheat
// @version 2.02
// @author SkidLamer - From The Gaming Gurus
// @supportURL https://discord.gg/upA3nap6Ug
// @homepage https://skidlamer.github.io/
// @match *.krunker.io/*
// @exclude *krunker.io/social*
// @run-at document-start
// @grant unsafeWindow
// @grant GM.xmlHttpRequest
// @noframes
// @namespace https://greasyfork.org/users/704479
// @downloadURL https://update.greasyfork.org/scripts/419073/Krunker%20Dogeware.user.js
// @updateURL https://update.greasyfork.org/scripts/419073/Krunker%20Dogeware.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint-disable no-return-assign, no-sequences, no-undef, curly, no-eval */
/* Ip Dip Dog Shit Chonker Stood In It */

let request = (url) => fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`).then(response => response.ok ? response.json() : null);
let redefine = (fnStr, prop, func, config = false) => { Object.defineProperty(globalThis, prop, { [fnStr]: func, configurable: config}) }
const the_gaming_gurus = "const[input,game,recon,lock]=arguments,me=this,key={frame:0,delta:1,xdir:2,ydir:3,moveDir:4,shoot:5,scope:6,jump:7,reload:8,crouch:9,weaponScroll:10,weaponSwap:11,moveLock:12},moveDir={leftStrafe:0,forward:1,rightStrafe:2,right:3,backwardRightStrafe:4,backward:5,backwardLeftStrafe:6,left:7};utilities.state.frame=input[key.frame],utilities.state.players=game.players,utilities.state.game=game,utilities.state.me=me,utilities.state.controls=game.controls,utilities.settings.autoNuke&&me&&Object.keys(me.streaks).length&&sendWsMessage(\"k\",0);const bhop=utilities.settings.bhop;if(bhop&&(utilities.state.pressedKeys.has(\"Space\")||[1,3].includes(bhop))&&(utilities.state.controls.keys[utilities.state.controls.binds.jumpKey.val]^=1,utilities.state.controls.keys[utilities.state.controls.binds.jumpKey.val]&&(utilities.state.controls.didPressed[utilities.state.controls.binds.jumpKey.val]=1),[3,4].includes(bhop)&&(utilities.state.pressedKeys.has('Space')||bhop===3)&&utilities.state.me.canSlide&&(setTimeout(()=>{utilities.state.shouldCrouch=!1},350),utilities.state.shouldCrouch=!0)),utilities.settings.forceNametagsOn)try{Object.defineProperty(game.config,\"nameTags\",{get(){return!utilities.settings.forceNametagsOn&&game._nametags},set(a){game._nametags=a}})}catch(a){}if(utilities.state.shouldCrouch&&(input[key.crouch]=1),utilities.settings.spinBot){const a=1;input[key.moveDir]!==-1&&(input[key.moveDir]=(input[key.moveDir]+utilities.state.spinCounter-Math.round(7*(input[key.ydir]/(Math.PI*2e3))))%7),input[key.ydir]=utilities.state.spinCounter/7*(Math.PI*2e3),input[key.frame]%a===0&&(utilities.state.spinCounter=(utilities.state.spinCounter+1)%7)}if(utilities.settings.autoReload&&me[utilities.vars.ammos][me[utilities.vars.weaponIndex]]===0&&(input[key.reload]=1),utilities.settings.pitchHack)switch(utilities.settings.pitchHack){case 1:input[key.xdir]=-Math.PI*500;break;case 2:input[key.xdir]=Math.PI*500;break;case 3:input[key.xdir]=Math.sin(Date.now()/50)*Math.PI*500;break;case 4:input[key.xdir]=Math.sin(Date.now()/250)*Math.PI*500;break;case 5:input[key.xdir]=input[key.frame]%2?Math.PI*500:-Math.PI*500;break;case 6:input[key.xdir]=(Math.random()*Math.PI-Math.PI/2)*1e3;break}const getNoise=()=>(Math.random()*2-1)*utilities.settings.aimNoise;if(game.players.list.forEach(a=>{a.pos={x:a.x,y:a.y,z:a.z},a.npos={x:a.x+getNoise(),y:a.y+getNoise(),z:a.z+getNoise()},a.isTarget=!1}),game.AI.ais&&game.AI.ais.forEach(a=>a.npos=a.pos={x:a.x,y:a.y,z:a.z}),utilities.state.renderer&&utilities.state.renderer.frustum&&me.active){game.controls.target=null;const b=game.players.list.filter(a=>!a.isYTMP&&a.hasOwnProperty('npos')&&(!utilities.settings.frustumCheck||utilities.state.renderer.frustum.containsPoint(a.npos))&&(me.team===null||a.team!==me.team)&&a.health>0&&a[utilities.vars.inView]).sort((a,b)=>utilities.math.getDistance(me.x,me.z,a.npos.x,a.npos.z)-utilities.math.getDistance(me.x,me.z,b.npos.x,b.npos.z));let a=b[0];if(utilities.settings.fovbox){const e=parseFloat(document.getElementById(\"uiBase\").style.transform.match(/\\((.+)\\)/)[1]),c=innerWidth/e,d=innerHeight/e;function world2Screen(a,b=0){return a.y+=b,a.project(utilities.state.renderer.camera),a.x=(a.x+1)/2,a.y=(-a.y+1)/2,a.x*=c,a.y*=d,a}let f=!1;for(let g=0;g<b.length;g++){const h=b[g],i=world2Screen(new utilities.state.three.Vector3(h.x,h.y,h.z),h.height/2);let e=[c/3,d/4,c*(1/3),d/2];switch(utilities.settings.fovBoxSize){case 2:e=[c*.4,d/3,c*.2,d/3];break;case 3:e=[c*.45,d*.4,c*.1,d*.2];break}if(i.x>=e[0]&&i.x<=e[0]+e[2]&&i.y>=e[1]&&i.y<e[1]+e[3]){a=b[g],f=!0;break}}f||(a=void\"kpal\")}let c=!1;if(game.AI.ais&&utilities.settings.AImbot){let b=game.AI.ais.filter(a=>a.mesh&&a.mesh.visible&&a.health&&a.pos&&a.canBSeen).sort((a,b)=>utilities.math.getDistance(me.x,me.z,a.pos.x,a.pos.z)-utilities.math.getDistance(me.x,me.z,b.pos.x,b.pos.z)).shift();(!a||b&&utilities.math.getDistance(me.x,me.z,b.pos.x,b.pos.z)>utilities.math.getDistance(me.x,me.z,a.pos.x,a.pos.z))&&(a=b,c=!0)}const d=input[key.shoot];if(a&&utilities.settings.aimbot&&utilities.state.bindAimbotOn&&(!utilities.settings.aimbotRange||utilities.math.getD3D(me.x,me.y,me.z,a.x,a.y,a.z)<utilities.settings.aimbotRange)&&(!utilities.settings.rangeCheck||utilities.math.getD3D(me.x,me.y,me.z,a.x,a.y,a.z)<=me.weapon.range)&&!me[utilities.vars.reloadTimer]){utilities.settings.awtv&&(input[key.scope]=1),a.isTarget=utilities.settings.markTarget;const b=(utilities.math.getDir(me.z,me.x,a.npos.z,a.npos.x)||0)*1e3,e=c?((utilities.math.getXDire(me.x,me.y,me.z,a.npos.x,a.npos.y-a.dat.mSize/2,a.npos.z)||0)-.3*me[utilities.vars.recoilAnimY])*1e3:((utilities.math.getXDire(me.x,me.y,me.z,a.npos.x,a.npos.y-a[utilities.vars.crouchVal]*3+me[utilities.vars.crouchVal]*3+utilities.settings.aimOffset,a.npos.z)||0)-.3*me[utilities.vars.recoilAnimY])*1e3;switch(utilities.settings.forceUnsilent&&(game.controls.target={xD:e/1e3,yD:b/1e3},game.controls.update(400)),utilities.settings.aimbot){case 1:case 2:case 5:case 6:case 9:case 10:{let a=[5,6,9].includes(utilities.settings.aimbot);(utilities.settings.aimbot===5&&input[key.scope]||utilities.settings.aimbot===10)&&(game.controls.target={xD:e/1e3,yD:b/1e3},game.controls.update(400)),([2,10].includes(utilities.settings.aimbot)||utilities.settings.aimbot===1&&utilities.state.me.weapon.id)&&!me.weapon.melee&&(input[key.scope]=1),me[utilities.vars.didShoot]?(input[key.shoot]=0,utilities.state.quickscopeCanShoot=!1,setTimeout(()=>{utilities.state.quickscopeCanShoot=!0},me.weapon.rate)):utilities.state.quickscopeCanShoot&&(!a||input[key.scope])&&(me.weapon.melee||(input[key.scope]=1),!utilities.settings.superSilent&&utilities.settings.aimbot!==9&&(input[key.ydir]=b,input[key.xdir]=e),(utilities.settings.aimbot!==9&&(!me[utilities.vars.aimVal]||me.weapon.noAim||me.weapon.melee)||utilities.settings.aimbot===9&&d)&&(input[key.ydir]=b,input[key.xdir]=e,input[key.shoot]=1))}break;case 4:case 7:case 8:case 11:input[key.scope]||utilities.settings.aimbot===11?(game.controls.target={xD:e/1e3,yD:b/1e3},game.controls.update({4:400,7:110,8:70,11:400}[utilities.settings.aimbot]),[4,11].includes(utilities.settings.aimbot)&&(input[key.xdir]=e,input[key.ydir]=b),me[utilities.vars.didShoot]?(input[key.shoot]=0,utilities.state.quickscopeCanShoot=!1,setTimeout(()=>{utilities.state.quickscopeCanShoot=!0},me.weapon.rate)):utilities.state.quickscopeCanShoot&&(input[me.weapon.melee?key.shoot:key.scope]=1)):game.controls.target=null;break;case 12:{if(!utilities.state.three||!utilities.state.renderer||!utilities.state.renderer.camera||!utilities.state.players||!utilities.state.players.list.length||!input[key.scope]||me[utilities.vars.aimVal])break;utilities.state.raycaster||(utilities.state.raycaster=new utilities.state.three.Raycaster,utilities.state.mid=new utilities.state.three.Vector2(0,0));const a=[];for(let c=0;c<utilities.state.players.list.length;c++){let b=utilities.state.players.list[c];if(!b||!b[utilities.vars.objInstances]||b.isYTMP||!(me.team===null||b.team!==me.team)||!b[utilities.vars.inView])continue;a.push(b[utilities.vars.objInstances])}const b=utilities.state.raycaster;b.setFromCamera(utilities.state.mid,utilities.state.renderer.camera),b.intersectObjects(a,!0).length&&(input[key.shoot]=me[utilities.vars.didShoot]?0:1)}break}}else utilities.settings.uwtv&&(input[key.scope]=0),utilities.state.spinFrame=0}utilities.settings.alwaysAim&&(input[key.scope]=1),utilities.settings.preventMeleeThrowing&&me.weapon.melee&&(input[key.scope]=0)"
const _requestAnimationFrame = unsafeWindow.requestAnimationFrame;
unsafeWindow.requestAnimationFrame = function(fn) {
    const callback = fn;
    return arguments[0] = function() {
        try {
            return callback.apply(this, arguments)
        } catch (fn) {
            alert("FATAL ERROR:\n" + fn + "\n" + fn.stack)
        }
    }, _requestAnimationFrame.apply(this, arguments);
}, unsafeWindow.utilities = {
    settings: {
        aimbot: 1,
        superSilent: !0,
        AImbot: !0,
        frustumCheck: !1,
        staticWeaponZoom: !1,
        wallbangs: !0,
        alwaysAim: !1,
        pitchHack: 0,
        thirdPerson: !1,
        autoReload: !1,
        speedHack: !1,
        rangeCheck: !1,
        alwaysTrail: !1,
        spinAimFrames: 10,
        animatedBillboards: !1,
        esp: 1,
        espFontSize: 10,
        tracers: !1,
        showGuiButton: !0,
        awtv: !1,
        uwtv: !1,
        forceUnsilent: !1,
        bhop: 0,
        spinBot: !1,
        markTarget: !0,
        skinHack: !1,
        aimOffset: 0,
        aimNoise: 0,
        keybinds: !0,
        antikick: !0,
        fovbox: !1,
        drawFovbox: !0,
        fovBoxSize: 1,
        guiOnMMB: !1,
        chams: !1,
        wireframe: !1,
        chamsc: 0,
        customCss: "",
        selfChams: !1,
        autoNuke: !1,
        chamsInterval: 500,
        preventMeleeThrowing: !1,
        forceNametagsOn: !1,
        aimbotRange: 0
    },
    state: {
        bindAimbotOn: !0,
        quickscopeCanShoot: !0,
        spinFrame: 0,
        pressedKeys: new Set,
        shouldCrouch: !1,
        spinCounter: 0,
        activeTab: 0,
        frame: 0
    },
    gui: {},
    math: {
        getDir: function(a, b, c, d) {
            return Math.atan2(b - d, a - c)
        },
        getDistance: function(c, d, a, b) {
            return Math.sqrt((a -= c) * a + (b -= d) * b)
        },
        getD3D: function(g, h, i, d, e, f) {
            const a = g - d,
                  b = h - e,
                  c = i - f;
            return Math.sqrt(a * a + b * b + c * c)
        },
        getXDire: function(c, a, d, e, b, f) {
            const g = Math.abs(a - b),
                  h = this.getD3D(c, a, d, e, b, f);
            return Math.asin(g / h) * (a > b ? -1 : 1)
        },
        lineInRect: function(k, b, c, d, e, f, s, r, q, p, t, o) {
            const m = (s - k) * d,
                  a = (p - k) * d,
                  l = (q - c) * f,
                  j = (o - c) * f,
                  i = (r - b) * e,
                  h = (t - b) * e,
                  g = Math.max(Math.max(Math.min(m, a), Math.min(l, j)), Math.min(i, h)),
                  n = Math.min(Math.min(Math.max(m, a), Math.max(l, j)), Math.max(i, h));
            return !(n < 0 || g > n) && g
        }
    },
    isClient: !!unsafeWindow.doge_work
}, localStorage.kro_setngss_json ? Object.assign(utilities.settings, JSON.parse(localStorage.kro_setngss_json)) : localStorage.kro_setngss_json = JSON.stringify(utilities.settings),
    Object.defineProperty(Object.prototype, "thirdPerson", {
    get() {
        return unsafeWindow.utilities.settings.thirdPerson
    }
}), Object.defineProperty(Object.prototype, "renderer", {
    enumerable: !1,
    get() {
        return this.camera && (unsafeWindow.utilities.state.renderer = this), this._renderer
    },
    set(a) {
        this._renderer = a
    }
}), Object.defineProperty(Object.prototype, "OBJLoader", {
    enumerable: !1,
    get() {
        return this._OBJLoader
    },
    set(a) {
        unsafeWindow.utilities.state.three = this, this._OBJLoader = a
    }
}), Object.defineProperty(Object.prototype, "useLooseClient", {
    enumerable: !1,
    get() {
        return this._ulc
    },
    set(a) {
        unsafeWindow.utilities.state.config = this, Object.defineProperty(this, "nameVisRate", {
            value: 0,
            writable: !1,
            configurable: !0
        }), this._ulc = a
    }
}), Object.defineProperty(Object.prototype, "trail", {
    enumerable: !1,
    get() {
        return unsafeWindow.utilities.settings.alwaysTrail || this._trail
    },
    set(a) {
        this._trail = a
    }
}), Object.defineProperty(Object.prototype, "showTracers", {
    enumerable: !1,
    get() {
        return unsafeWindow.utilities.settings.alwaysTrail || this._showTracers
    },
    set(a) {
        this._showTracers = a
    }
}), Object.defineProperty(Object.prototype, "shaderId", {
    enumerable: !1,
    get() {
        return this.src && this.src.startsWith("pubs/") ? unsafeWindow.utilities.settings.animatedBillboards ? 1 : this.rshaderId : this.rshaderId
    },
    set(a) {
        this.rshaderId = a
    }
}), Object.defineProperties(Object.prototype, {
    idleTimer: {
        enumerable: !1,
        get() {
            return unsafeWindow.utilities.settings.antikick ? 0 : this._idleTimer
        },
        set(a) {
            this._idleTimer = a
        }
    },
    kickTimer: {
        enumerable: !1,
        get() {
            return unsafeWindow.utilities.settings.antikick ? 1 / 0 : this._kickTimer
        },
        set(a) {
            this._kickTimer = a
        }
    }
}); {
    Object.defineProperty(CanvasRenderingContext2D.prototype, 'save', {
        value: CanvasRenderingContext2D.prototype.save,
        writable: !1
    });

    function c(a) {
        unsafeWindow.utilities.canvas = document.createElement("canvas"), unsafeWindow.utilities.canvas.width = innerWidth, unsafeWindow.utilities.canvas.height = innerHeight, unsafeWindow.addEventListener("resize", () => {
            const a = unsafeWindow.utilities.state.canvasScale || 1;
            unsafeWindow.utilities.canvas.width = innerWidth / a, unsafeWindow.utilities.canvas.height = innerHeight / a
        }), a.insertAdjacentElement("beforeend", unsafeWindow.utilities.canvas), unsafeWindow.utilities.state.ctx = unsafeWindow.utilities.canvas.getContext("2d")
    }
    const a = setInterval(() => {
        document.getElementById("inGameUI") && (clearInterval(a), c(document.getElementById("inGameUI")))
    }, 100);

    function d() {
        if (!unsafeWindow.utilities.state.renderHookArgs) return;
        const [q, j, o, n, b, p] = unsafeWindow.utilities.state.renderHookArgs;
        if (unsafeWindow.utilities.state.canvasScale = parseFloat(document.getElementById("uiBase").style.transform.match(/\((.+)\)/)[1]), unsafeWindow.utilities.state.players = j.players, unsafeWindow.utilities.state.game = j, unsafeWindow.utilities.state.controls = o, unsafeWindow.utilities.state.renderer = n, unsafeWindow.utilities.state.me = b, !unsafeWindow.utilities.state.renderer.frustum) return;
        b && b.weapon && !b.weapon.zoomHooked && (b.weapon.zoomHooked = !0, b.weapon._zoom = b.weapon.zoom, Object.defineProperty(b.weapon, "zoom", {
            get() {
                return unsafeWindow.utilities.settings.staticWeaponZoom ? 1 : this._zoom
            }
        }));
        const a = unsafeWindow.utilities.state.ctx,
              h = parseFloat(document.getElementById("uiBase").style.transform.match(/\((.+)\)/)[1]),
              d = innerWidth / h,
              c = innerHeight / h;
        if (unsafeWindow.utilities.canvas.width = d, unsafeWindow.utilities.canvas.height = c, !a) return;

        function k(a, b = 0) {
            return a.y += b, a.project(unsafeWindow.utilities.state.renderer.camera), a.x = (a.x + 1) / 2, a.y = (-a.y + 1) / 2, a.x *= d, a.y *= c, a
        }

        function m(c, d, e, f, b, g) {
            a.save(), a.lineWidth = b + 2, a.beginPath(), a.moveTo(c, d), a.lineTo(e, f), a.strokeStyle = "rgba(0, 0, 0, 0.25)", a.stroke(), a.lineWidth = b, a.strokeStyle = g, a.stroke(), a.restore()
        }

        function g(h, i, d, e, f, g, b, c) {
            a.save(), a.translate(~~h, ~~i), a.beginPath(), c ? a.fillStyle = b : a.strokeStyle = b, a.rect(d, e, f, g), c ? a.fill() : a.stroke(), a.closePath(), a.restore()
        }

        function l(b) {
            for (let c = 0; c < b.length; c++) b[c] = ~~a.measureText(b[c]).width;
            return b
        }

        function i(d, e, f, g, b) {
            const c = a.createLinearGradient(d, e, f, g);
            for (let a = 0; a < b.length; a++) c.addColorStop(a, b[a]);
            return c
        }

        function e(b, c, d, e, f) {
            a.save(), a.translate(~~e, ~~f), a.fillStyle = d, a.strokeStyle = "rgba(0, 0, 0, 0.5)", a.font = c, a.lineWidth = 1, a.strokeText(b, 0, 0), a.fillText(b, 0, 0), a.restore()
        }
        const f = 2;
        if (a.clearRect(0, 0, d, c), unsafeWindow.utilities.settings.esp > 1)
            for (const j of unsafeWindow.utilities.state.players.list.filter(a => !a.isYTMP && a.active && (a.pos = {
                x: a.x,
                y: a.y,
                z: a.z
            }))) {
                const s = new unsafeWindow.utilities.state.three.Vector3(j.pos.x, j.pos.y, j.pos.z),
                      r = k(s.clone()),
                      h = k(s.clone(), j.height),
                      q = ~~(r.y - h.y),
                      o = ~~(q * .6),
                      p = unsafeWindow.utilities.settings.espFontSize + "px GameFont";
                if (!unsafeWindow.utilities.state.renderer.frustum.containsPoint(j.pos)) continue;
                if (unsafeWindow.utilities.settings.tracers && m(d / 2, unsafeWindow.utilities.settings.tracers === 2 ? c / 2 : c - 1, r.x, r.y, 2, j.team === null ? "#FF4444" : j.team === unsafeWindow.utilities.state.me.team ? "#44AAFF" : "#FF4444"), j.isTarget) {
                    a.save();
                    const b = l(["TARGET"]);
                    e("TARGET", p, "#FFFFFF", h.x - b[0] / 2, h.y - unsafeWindow.utilities.settings.espFontSize * 1.5), a.beginPath(), a.translate(h.x, h.y + Math.abs(q / 2)), a.arc(0, 0, Math.abs(q / 2) + 10, 0, Math.PI * 2), a.strokeStyle = "#FFFFFF", a.stroke(), a.closePath(), a.restore()
                }
                if (utilities.settings.esp === 2) {
                    a.save(), a.strokeStyle = b.team === null || j.team !== b.team ? "#FF4444" : "#44AAFF", a.strokeRect(h.x - o / 2, h.y, o, q), a.restore();
                    continue
                }
                g(h.x - o / 2 - 7, ~~h.y - 1, 0, 0, 4, q + 2, "#000000", !1), g(h.x - o / 2 - 7, ~~h.y - 1, 0, 0, 4, q + 2, "#44FF44", !0), g(h.x - o / 2 - 7, ~~h.y - 1, 0, 0, 4, ~~((j[utilities.vars.maxHealth] - j.health) / j[utilities.vars.maxHealth] * (q + 2)), "#000000", !0), a.save(), a.lineWidth = 4, a.translate(~~(h.x - o / 2), ~~h.y), a.beginPath(), a.rect(0, 0, o, q), a.strokeStyle = "rgba(0, 0, 0, 0.25)", a.stroke(), a.lineWidth = 2, a.strokeStyle = j.team === null ? '#FF4444' : utilities.state.me.team === j.team ? '#44AAFF' : '#FF4444', a.stroke(), a.closePath(), a.restore();
                const t = ~~(utilities.math.getD3D(b.x, b.y, b.z, j.pos.x, j.pos.y, j.pos.z) / 10);
                a.save(), a.font = p;
                const n = l(["[", t, "m]", j.level, "©", j.name]);
                a.restore();
                const u = i(0, 0, n[4] * 5, 0, ["rgba(0, 0, 0, 0.25)", "rgba(0, 0, 0, 0)"]);
                if (j.level) {
                    const a = i(0, 0, n[4] * 2 + n[3] + f * 3, 0, ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.25)"]);
                    g(~~(h.x - o / 2) - 12 - n[4] * 2 - n[3] - f * 3, ~~h.y - f, 0, 0, n[4] * 2 + n[3] + f * 3, n[4] + f * 2, a, !0), e("" + j.level, p, '#FFFFFF', ~~(h.x - o / 2) - 16 - n[3], ~~h.y + n[4] * 1)
                }
                g(~~(h.x + o / 2) + f, ~~h.y - f, 0, 0, n[4] * 5, n[4] * 4 + f * 2, u, !0), e(j.name, p, j.team === null ? '#FFCDB4' : b.team === j.team ? '#B4E6FF' : '#FFCDB4', h.x + o / 2 + 4, h.y + n[4] * 1), j.clan && e("[" + j.clan + "]", p, "#AAAAAA", h.x + o / 2 + 8 + n[5], h.y + n[4] * 1), e(j.health + " HP", p, "#33FF33", h.x + o / 2 + 4, h.y + n[4] * 2), e(j.weapon.name, p, "#DDDDDD", h.x + o / 2 + 4, h.y + n[4] * 3), e("[", p, "#AAAAAA", h.x + o / 2 + 4, h.y + n[4] * 4), e("" + t, p, "#DDDDDD", h.x + o / 2 + 4 + n[0], h.y + n[4] * 4), e("m]", p, "#AAAAAA", h.x + o / 2 + 4 + n[0] + n[1], h.y + n[4] * 4)
            }
        if (utilities.settings.chams && utilities.state.players)
            for (const b of utilities.state.players.list.filter(a => (utilities.settings.selfChams || !a.isYTMP) && a.active && (a.pos = {
                x: a.x,
                y: a.y,
                z: a.z
            }))) {
                const a = b[utilities.vars.objInstances];
                if (!a) continue;
                Reflect.defineProperty(a, "visible", {
                    get() {
                        return utilities.settings.chams || this._visible
                    },
                    set(a) {
                        this._visible = a
                    }
                }), a.traverse(a => {
                    if (a.type === "Mesh") {
                        Reflect.defineProperty(a.material, "wireframe", {
                            get() {
                                return utilities.settings.wireframe || this._wf
                            },
                            set(a) {
                                this._wf = a
                            }
                        }), a.visible = !0, a.material.visible = !0, a.material.depthTest = !1, a.material.transparent = !0, a.material.fog = !1;
                        const b = [null, {
                            r: 1
                        }, {
                            g: 1
                        }, {
                            b: 1
                        }, {
                            g: 1,
                            b: 1
                        }, {
                            r: 1,
                            b: 1
                        }, {
                            r: 1,
                            g: 1
                        }];
                        if (utilities.settings.chamsc === 7) a.material.emissive = b[1 + Math.floor(Math.random() * 6)];
                        else if (utilities.settings.chamsc === 8) {
                            const c = ~~(Date.now() % (utilities.settings.chamsInterval * 6) / utilities.settings.chamsInterval);
                            a.material.emissive = b[c + 1]
                        } else a.material.emissive = b[utilities.settings.chamsc]
                    }
                })
            }
        if (utilities.settings.fovbox && utilities.settings.drawFovbox) {
            let b = [d / 3, c / 4, d * (1 / 3), c / 2];
            switch (utilities.settings.fovBoxSize) {
                case 2:
                    b = [d * .4, c / 3, d * .2, c / 3];
                    break;
                case 3:
                    b = [d * .45, c * .4, d * .1, c * .2];
                    break
            }
            a.save(), a.strokeStyle = "red", a.strokeRect(...b), a.restore()
        }
    }
    const b = a => typeof a != "undefined" && a !== null;
    Object.defineProperty(Object.prototype, "render", {
        enumerable: !1,
        get() {
            return this._render
        },
        set(a) {
            b(this.showHits) ? this._render = new Proxy(a, {
                apply(b, c, a) {
                    const e = b.apply(c, a);
                    return utilities.state.renderHookArgs = a, d(), e
                }
            }) : this._render = a
        }
    })
} {
    let a = {};

    function e(b) {
        unsafeWindow.dispatchWsEvent = b._dispatchEvent.bind(b), unsafeWindow.sendWsMessage = b.send.bind(b), b.send = new Proxy(b.send, {
            apply(c, d, b) {
                return b[0] === "en" && (a = {
                    main: b[1][2][0],
                    secondary: b[1][2][1],
                    hat: b[1][3],
                    body: b[1][4],
                    knife: b[1][9],
                    dye: b[1][14],
                    waist: b[1][17]
                }), c.apply(d, b)
            }
        }), b._dispatchEvent = new Proxy(b._dispatchEvent, {
            apply(c, d, [e, f]) {
                if (a && e === "0" && utilities.settings.skinHack) {
                    const c = f[0];
                    let d = 38;
                    while (c.length % d !== 0) d++;
                    for (let e = 0; e < c.length; e += d) c[e] === b.socketId && (c[e + 12] = [a.main, a.secondary], c[e + 13] = a.hat, c[e + 14] = a.body, c[e + 19] = a.knife, c[e + 24] = a.dye, c[e + 33] = a.waist)
                }
                return c.apply(d, arguments[2])
            }
        })
    }
    const b = Symbol("kpal");
    Object.defineProperty(Object.prototype, "events", {
        enumerable: !1,
        get() {
            return this[b]
        },
        set(a) {
            this.ahNum === 0 && e(this), this[b] = a
        }
    });
    const c = Symbol("lol anticheat");
    Object.defineProperty(Object.prototype, "skins", {
        enumerable: !1,
        get() {
            return this.stats && utilities.settings.skinHack ? this.fakeSkins : this[c]
        },
        set(a) {
            if ("stats" in this) {
                this.fakeSkins = [];
                for (let b = 0; b < 5e3; b++) a[b] ? this.fakeSkins.push({
                    ind: b,
                    cnt: a[b].cnt
                }) : this.fakeSkins.push({
                    ind: b,
                    cnt: "SH"
                })
            }
            this[c] = a
        }
    })
}
let b; {
    function f() {
        const a = {
            checkbox: (b, a, c = "", d = !1) => `<div class="settName" title="${c}">${b} ${d?'<span style="color: #eb5656">*</span>':""}<label class="switch" style="margin-left:10px"><input type="checkbox" onclick='utilities.gui.setSetting("${a}", this.checked)' ${utilities.settings[a]?"checked":""}><span class="slider"></span></label></div>`,
            client_setting: (b, a, c = "", d = !0) => `<div class="settName" title="${c}">${b} ${d?'<span style="color: #eb5656">*</span>':""}<label class="switch" style="margin-left:10px"><input type="checkbox" onclick='doge_setsetting("${a}", this.checked?"1":"0")' ${utilities.settings[a]?"checked":""}><span class="slider"></span></label></div>`,
            select: (d, b, a, e = "", f = !1) => {
                let c = `<div class="settName" title="${e}">${d} ${f?'<span style="color: #eb5656">*</span>':""}<select onchange='utilities.gui.setSetting("${b}", parseInt(this.value))' class="inputGrey2">`;
                for (const d in a) a.hasOwnProperty(d) && (c += `<option value="${a[d]}" ${utilities.settings[b]==a[d]?"selected":""}>${d}</option>,`);
                return c + "</select></div>"
            },
                slider: (d, a, b, c, e, f = "") => `<div class="settName" title="${f}">${d} <input type="number" class="sliderVal" id="slid_input_${a}" min="${b}" max="${c}" value="${utilities.settings[a]}" onkeypress="utilities.gui.setSetting('${a}', parseFloat(this.value.replace(',', '.')));document.querySelector('#slid_input_${a}').value=this.value" style="margin-right:0;border-width:0"><div class="slidecontainer" style=""><input type="range" id="slid_${a}" min="${b}" max="${c}" step="${e}" value="${utilities.settings[a]}" class="sliderM" oninput="utilities.gui.setSetting('${a}', parseFloat(this.value));document.querySelector('#slid_input_${a}').value=this.value"></div></div>`,
                    input: (c, a, b, d, e) => `<div class="settName" title="${d}">${c} <input type="${b}" name="${b}" id="slid_utilities_${a}"\n${'color'==b?'style="float:right;margin-top:5px"':`class="inputGrey2" placeholder="${e}"`}\nvalue="${utilities.settings[a]}" oninput="utilities.gui.setSetting(\'${a}\', this.value)"/></div>`,
                        label: (a, b) => "<br><span style='color: black; font-size: 20px; margin: 20px 0'>" + a + "</span> <span style='color: dimgrey; font-size: 15px'>" + (b || "") + "</span><br>",
                            nobrlabel: (a, b) => "<span style='color: black; font-size: 20px; margin: 20px 0'>" + a + "</span> <span style='color: dimgrey; font-size: 15px'>" + (b || "") + "</span><br>",
                                br: () => "<br>",
                                    style: a => `<style>${a}</style>`
    };
    let b = `<div id="settHolder">
<h3 style="margin-bottom: 10px">Dogeware v3</h3>
<h5 style="margin: 15px 0">Made by Skidlamer, sub to Krunker Extra<br></h5>`;
    Object.keys(a).forEach(c => {
        const d = a[c];
        a[c] = function() {
            return b += d.apply(this, arguments), ""
        }
    });
    const c = ["Weapon", "Wallhack", "Visual", "Tweaks", "Movement", "Other"];
    utilities.isClient && c.push("Client"), a.style(`
.cheatTabButton {
color: black;
background: #ddd;
padding: 2px 7px;
font-size: 15px;
cursor: pointer;
text-align: center;
}
.cheatTabActive {
background: #bbb;
}
`), utilities.gui.changeTab = function(a) {
        const b = a.innerText;
        document.getElementById("cheat-tabbtn-" + c[utilities.state.activeTab]).classList.remove("cheatTabActive"), document.getElementById("cheat-tab-" + c[utilities.state.activeTab]).style.display = "none", a.classList.add("cheatTabActive"), document.getElementById("cheat-tab-" + b).style.display = "block", utilities.state.activeTab = c.indexOf(b)
    }, b += `<table style="width: 100%; margin-bottom: 30px"><tr>`;
    for (let a = 0; a < c.length; a++) {
        const d = c[a];
        b += `<td id="cheat-tabbtn-${d}" onclick="utilities.gui.changeTab(this)" class="cheatTabButton ${c[utilities.state.activeTab]===d?'cheatTabActive':''}">`, b += d, b += `</td>`
    }
    b += `</table></tr>`;

    function d(a, d) {
        b += `<div style="display: ${utilities.state.activeTab===a?'block':'none'}" class="cheat-tab" id="cheat-tab-${c[a]}">`, d(), b += `</div>`
    }
    return d(0, () => {
        a.select("Aimbot [Y]", "aimbot", {
            None: 0,
            "Quickscope / Auto pick": 1,
            "Silent aimbot": 2,
            "Aim assist": 4,
            "Easy aim assist": 11,
            "SP Trigger bot": 12,
            "Silent on aim": 6,
            Smooth: 7,
            Unsilent: 10,
            "Unsilent on aim": 5,
            "Aim correction": 9
        }), a.select("Spin aimbot speed", "spinAimFrames", {
            1: 30,
            2: 20,
            3: 15,
            4: 10,
            5: 5
        }), a.slider("Aim range", "aimbotRange", 0, 1e3, 10, "Set above 0 to make the aimbot pick enemies only at the selected range"), a.slider("Aim offset", "aimOffset", -4, 1, .1, "The lower it is, the lower the aimbot will shoot (0 - head, -4 - body)"), a.slider("Aim noise", "aimNoise", 0, 2, .005, "The higher it is, the lower is the aimbot accuracy"), a.checkbox("Supersilent aim", "superSilent", "Only works with quickscope and silent aim, makes it almost invisible that you're looking at somebody when you're shooting at him"), a.checkbox("Aim at AIs", "AImbot", "Makes the aimbot shoot at NPCs"), a.checkbox("FOV check", "frustumCheck", "Makes you only shoot at enemies that are in your field of view. Prevents 180 flicks"), a.checkbox("FOV box", "fovbox", "Creates a box in which enemies can be targetted, enable with FOV check"), a.select("FOV box size", "fovBoxSize", {
            Big: 1,
            Medium: 2,
            Small: 3
        }), a.checkbox("Wallbangs", "wallbangs", "Makes the aimbot shoot enemies behind walls"), a.checkbox("Aimbot range check", "rangeCheck", "Checks if the enemy is in range of your weapon before shooting it, disable for rocket launcher"), a.checkbox("Auto reload", "autoReload", "Automatically reloads your weapon when it's out of ammo"), a.checkbox("Prevent melee throwing", "preventMeleeThrowing", "Prevents you from throwing your knife")
    }), d(1, () => {
        a.select("ESP [H]", "esp", {
            None: 0,
            Nametags: 1,
            "Box ESP": 2,
            "Full ESP": 3
        }), a.select("ESP Font Size", "espFontSize", {
            "30px": 30,
            "25px": 25,
            "20px": 20,
            "15px": 15,
            "10px": 10,
            "5px": 5
        }), a.select("Tracers", "tracers", {
            None: 0,
            Bottom: 1,
            Middle: 2
        }, "Draws lines to players"), a.checkbox("Mark aimbot target", "markTarget", "Shows who is the aimbot targetting at the time, useful for aim assist/aim correction"), a.checkbox("Draw FOV box", "drawFovbox", "Draws the FOV box from aimbot settings"), a.checkbox("Chams", "chams"), a.select("Chams colour", "chamsc", {
            None: 0,
            Red: 1,
            Green: 2,
            Blue: 3,
            Cyan: 4,
            Pink: 5,
            Yellow: 6,
            RGB: 8,
            Epilepsy: 7
        }), a.checkbox("Self chams", "selfChams", "Makes your weapon affected by chams"), a.checkbox("Wireframe", "wireframe"), a.slider("RGB interval", "chamsInterval", 50, 1e3, 50, "How fast will the RGB chams change colour")
    }), d(2, () => {
        a.checkbox("Skin hack", "skinHack", "Makes you able to use any skin in game, only shows on your side"), a.checkbox("Third person mode", "thirdPerson"), a.checkbox("No weapon zoom", "staticWeaponZoom", "Removes the distracting weapon zoom animation"), a.checkbox("Any weapon trail", "alwaysTrail"), a.checkbox("Billboard shaders", "animatedBillboards", "Disable if you get fps drops")
    }), d(3, () => {
        a.checkbox("Always aim", "alwaysAim", "Makes you slower and jump lower, but the aimbot can start shooting at enemies  faster. Only use if ur good at bhopping"), a.checkbox("Aim when target visible", "awtv"), a.checkbox("Unaim when no target visible", "uwtv"), a.checkbox("Force unsilent", "forceUnsilent")
    }), d(4, () => {
        a.select("Auto bhop", "bhop", {
            None: 0,
            "Auto Jump": 1,
            "Key Jump": 2,
            "Auto Slide": 3,
            "Key Slide": 4
        }), a.label("Only use with silent aim"), a.select("Pitch hax", "pitchHack", {
            Disabled: 0,
            Downward: 1,
            Upward: 2,
            "sin(time)": 3,
            "sin(time/5)": 4,
            double: 5,
            random: 6
        }, "Only use with aimbot on"), a.checkbox("Spin bot", "spinBot")
    }), d(5, () => {
        a.input("Custom CSS", "customCss", "url", "", "URL to CSS file"), a.checkbox("Show GUI button", "showGuiButton", "Disable if you don't want the dog under settings to be visible"), a.checkbox("GUI on middle mouse button", "guiOnMMB", "Makes it possible to open this menu by clicking the mouse wheel"), a.checkbox("Keybinds", "keybinds", "Turn keybinds on/off, Aimbot - Y, ESP - H"), a.checkbox("No inactivity kick", "antikick", "Disables the 'Kicked for inactivity' message (client side, but works)"), a.checkbox("Auto nuke", "autoNuke", "Automatically nukes when you are able to"), a.checkbox("Force nametags on", "fgno", "Use in custom games with disabled nametags")
    }), utilities.isClient && d(6, () => {
        a.nobrlabel("Restart is required after changing any of these settings"), a.br(), a.client_setting("Uncap FPS", "uncap_fps", "Disables V-Sync"), a.client_setting("Adblock", "adblock", "Disables ads")
    }), b += "</div>", b
}
b = function() {
    function a(f, g, d) {
        const e = document.querySelector("#menuItemContainer"),
              a = document.createElement("div"),
              c = document.createElement("div"),
              b = document.createElement("div");
        a.className = "menuItem", c.className = "menuItemIcon", b.className = "menuItemTitle", b.innerHTML = f, c.style.backgroundImage = `url("https://i.imgur.com/QWfy80i.png")`, a.append(c, b), e.append(a), a.addEventListener("click", d)
    }
    utilities.gui.cssElem = document.createElement("link"), utilities.gui.cssElem.rel = "stylesheet", utilities.gui.cssElem.href = utilities.settings.customCss;
    try {
        document.head.appendChild(utilities.gui.cssElem)
    } catch (a) {
        alert("Error injecting custom CSS:\n" + a), utilities.settings.customCss = ""
    }
    utilities.gui.setSetting = function(a, b) {
        switch (a) {
            case "customCss":
                utilities.settings.customCss = b;
                break;
            default:
                utilities.settings[a] = b
        }
        localStorage.kro_setngss_json = JSON.stringify(utilities.settings);
    }, utilities.gui.windowIndex = windows.length + 1, utilities.gui.settings = {
        aimbot: {
            val: utilities.settings.aimbot
        }
    }, utilities.gui.windowObj = {
        header: "CH33T",
        html: "",
        gen() {
            return f()
        }
    }, Object.defineProperty(unsafeWindow.windows, windows.length, {
        value: utilities.gui.windowObj
    }), utilities.settings.showGuiButton && a("CH33TS", null, () => {
        unsafeWindow.showWindow(utilities.gui.windowIndex)
    })
};

function a() {
    (document.pointerLockElement || document.mozPointerLockElement) && document.exitPointerLock(), unsafeWindow.showWindow(utilities.gui.windowIndex)
}
unsafeWindow.addEventListener("mouseup", b => {
    b.which === 2 && utilities.settings.guiOnMMB && (b.preventDefault(), a())
}), unsafeWindow.addEventListener("keydown", b => {
    b.key === "F1" && (b.preventDefault(), b.stopPropagation(), b.stopImmediatePropagation(), a())
}), unsafeWindow.addEventListener("keydown", a => {
    utilities.state.pressedKeys.has(a.code) || utilities.state.pressedKeys.add(a.code)
}), unsafeWindow.addEventListener("keyup", a => {
    if (utilities.state.pressedKeys.has(a.code) && utilities.state.pressedKeys.delete(a.code), !(document.activeElement.tagName === "INPUT" || !unsafeWindow.endUI && unsafeWindow.endUI.style.display) && utilities.settings.keybinds) switch (a.code) {
        case "KeyY":
            utilities.state.bindAimbotOn = !utilities.state.bindAimbotOn, dispatchWsEvent("ch", [null, "Aimbot " + (utilities.state.bindAimbotOn ? "on" : "off"), 1]);
            break;
        case "KeyH":
            utilities.settings.esp = (utilities.settings.esp + 1) % 4, dispatchWsEvent("ch", [null, "ESP: " + ["disabled", "nametags", "box", "full"][utilities.settings.esp], 1]);
            break
    }
})
}

const h = new Function(the_gaming_gurus);

function i() {
    Object.defineProperty(Object.prototype, utilities.vars.procInputs, {
        enumerable: !1,
        get() {
            return this._procInputs
        },
        set(a) {
            typeof a == "function" ? this._procInputs = new Proxy(a, {
                apply(c, a, b) {
                    return h.apply(a, b), c.apply(a, b)
                }
            }) : this._procInputs = a
        }
    })
}

function j(a) {
    utilities.vars = {};
    const b = (new Map).set("inView", [/&&!\w+\['\w+']&&\w+\['\w+']&&\w+\['(\w+)']\)/, 1]).set("procInputs", [/this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)\['recon']/, 1]).set("aimVal", [/this\['(\w+)']-=0x1\/\(this\['weapon']\['\w+']\/\w+\)/, 1]).set("didShoot", [/--,\w+\['(\w+)']=!0x0/, 1]).set("nAuto", [/'Single\\x20Fire','varN':'(\w+)'/, 1]).set("crouchVal", [/this\['(\w+)']\+=\w\['\w+']\*\w+,0x1<=this\['\w+']/, 1]).set("ammos", [/\['length'];for\(\w+=0x0;\w+<\w+\['(\w+)']\['length']/, 1]).set("weaponIndex", [/\['weaponConfig']\[\w+]\['secondary']&&\(\w+\['(\w+)']==\w+/, 1]).set("objInstances", [/\(\w+=\w+\['players']\['list']\[\w+]\)\['active']&&\w+\['(\w+)']\)/, 1]).set("reloadTimer", [/0x0>=this\['(\w+')]&&0x0>=this\['swapTime']/, 1]).set("maxHealth", [/this\['health']\/this\['(\w+)']\?/, 1]).set("recoilAnimY", [/this\['(\w+)']\+=this\['\w+']\*\(/, 1]);
    for (const [c, d] of b) {
        const e = d[0].exec(a);
        e ? utilities.vars[c] = e[d[1]] : (alert("Failed to find " + c), utilities.vars[c] = c)
    }
    console.log("VARS:"), console.table(utilities.vars), console.log(JSON.stringify(utilities.vars)), i()
}

function k(a) {
    return a = a.replace(/(&&!\w+\['\w+']&&\w+\['\w+'])&&(\w+\['\w+'])\)/, "$1 && ($2 || [1, 2].includes(utilities.settings.esp)) && utilities.settings.esp !== 3)"), a = a.replace(/!(\w+)\['transparent']/, "(utilities.settings.wallbangs ? !$1.penetrable : !$1.transparent)"), a = a.replace("navigator['webdriver']", "false"), a = a.replace(",this['frustum']['containsPoint']=new Proxy(this['frustum']['containsPoint'],{'apply':function(){return!0x1;}})", ""), a = a.replace(/windows\['length'\]>\d+.*?0x25/, '0x25'), a
}
unsafeWindow.gameCodeInit = function(a) {
    return console.log("Initializing cheat"), j(a), k(a)
};

function l(a, b) {
    if (a()) return b();
    const c = setInterval(() => {
        a() && (clearInterval(c), b())
    }, 100)
    }
l(() => unsafeWindow.windows, b)

function initialize() {
    GM.xmlHttpRequest ({ url: "https://krunker.io/social.html", responseType: 'json' }).then(res => GM.xmlHttpRequest ({ url: `https://krunker.io/pkg/krunker.${/\w.exports="(\w+)"/.exec(res.responseText)[1]}.vries`, responseType: 'arrayBuffer' })).then(res => {
        const array = Array.from(new Uint8Array(res.response))
        const xor = array[0]^'!'.charCodeAt(0);
        const csv = 0;
        let script = array.map((code) => String.fromCharCode(code ^ xor)).join('');
        let loader = Function("__LOADER__mmTokenPromise", "Module", unsafeWindow.gameCodeInit(script))
        loader(GM.xmlHttpRequest ({ url: "https://api.sys32.dev/token", responseType: 'json' }).then(data=>data.response.token), {csv: async () => csv})
    })
}

redefine('get', 'initWASM', function() {
    return function(m){console.log(m)}
},true)


let observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
            if (node.tagName === 'SCRIPT' && node.type === "text/javascript" && node.innerHTML.startsWith("*!", 1)) {
                //console.log(node.innerHTML)
                node.innerHTML = ""
                initialize();
                observer.disconnect();
            }
        }
    }
});
observer.observe(document, {
    childList: true,
    subtree: true
});