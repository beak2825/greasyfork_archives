// ==UserScript==
// @name         Krunker.io Aimbot, ESP 1.9.3
// @namespace    BlueCamper
// @version      3.3
// @description  Style
// @match        https://krunker.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390990/Krunkerio%20Aimbot%2C%20ESP%20193.user.js
// @updateURL https://update.greasyfork.org/scripts/390990/Krunkerio%20Aimbot%2C%20ESP%20193.meta.js
// ==/UserScript==

(function() {
    var rightMouseClicked = false;

function handleMouseDown(e) {
  //e.button describes the mouse button that was clicked
  // 0 is left, 1 is middle, 2 is right
  if (e.button === 2) {
    rightMouseClicked = true;
  } else if (e.button === 0) {
    //Do something if left button was clicked and right button is still pressed
    if (rightMouseClicked) {
      //code
    }
  }
  console.log(rightMouseClicked);
}

function handleMouseUp(e) {
  if (e.button === 2) {
    rightMouseClicked = false;
  }
  console.log(rightMouseClicked);
}

document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
    let shared_state = new Map(Object.entries({
        functions_to_hide: new WeakMap(),
        strings_to_hide: [],
        hidden_globals: [],
        init: false
    }));

    let invisible_define = function(obj, key, value) {
        shared_state.get('hidden_globals').push(key);
        Object.defineProperty(obj, key, {
            enumberable: false,
            configurable: false,
            writable: true,
            value: value
        });
    };

    let conceal_function = function(original_Function, hook_Function) {
        shared_state.get('functions_to_hide').set(hook_Function, original_Function);
    };

    let conceal_string = function(original_string, hook_string) {
        shared_state.get('strings_to_hide').push({
            from: new RegExp(hook_string.replace(/([\[|\]|\(|\)|\*|\\|\.|\+])/g, '\\$1'), 'g'),
            to: original_string
        });
    };

    const original_toString = Function.prototype.toString;
    let hook_toString = new Proxy(original_toString, {
        apply: function(target, _this, _arguments) {
            try {
                var ret = Function.prototype.apply.apply(target, [_this, _arguments]);
            } catch (e) {
                // modify stack trace to hide proxy
                e.stack = e.stack.replace(/\n.*Object\.apply \(<.*/, '');
                throw e;
            }

            let lookup_fn = shared_state.get('functions_to_hide').get(_this);
            if (lookup_fn) {
                return Function.prototype.apply.apply(target, [lookup_fn, _arguments]);
            }

            for (var i = 0; i < shared_state.get('strings_to_hide').length; i++) {
                ret = ret.replace(shared_state.get('strings_to_hide')[i].from, shared_state.get('strings_to_hide')[i].to);
            }
            return ret;
        }
    });
    Function.prototype.toString = hook_toString;
    conceal_function(original_toString, hook_toString);

    var _cnBSeen, _canSee, _pchObjc, _objInstances, _isYou, _recoilAnimY, _mouseDownL, _mouseDownR, _getWorldPosition, _didShoot, _maxHealth, _ammos, _weaponIndex, _inputs, _me, _world, _procInputs;
    const defined = object => typeof object !== "undefined";

    const original_encode = TextEncoder.prototype.encodeInto; // skidLamer
    let hook_encode = new Proxy(original_encode, {
        apply: function(target, _this, _arguments) {
            let game = false;
            try {
                if (_arguments[0].length > 140000) {
                    //saveAs(new Blob([_arguments[0]], {type: "text/plain;charset=utf-8"}), `game.js`)
                    _cnBSeen = _arguments[0].match(/this\['recon']=!0x1,this\['(\w+)']=!0x1/)[1];
                    _canSee = _arguments[0].match(/,this\['(\w+)'\]=function\(\w+,\w+,\w+,\w+,\w+\){if\(!\w+\)return!\w+;/)[1];
                    _pchObjc = _arguments[0].match(/\(\w+,\w+,\w+\),this\['(\w+)'\]=new \w+\['\w+'\]\(\)/)[1];
                    _objInstances = _arguments[0].match(/\[\w+\]\['\w+'\]=!\w+,this\['\w+'\]\[\w+\]\['\w+'\]&&\(this\['\w+'\]\[\w+\]\['(\w+)'\]\['\w+'\]=!\w+/)[1];
                    _isYou = _arguments[0].match(/,this\['\w+'\]=!\w+,this\['\w+'\]=!\w+,this\['(\w+)'\]=\w+,this\['\w+'\]\['length'\]=\w+,this\[/)[1];
                    _recoilAnimY = _arguments[0].match(/\w*1,this\['\w+'\]=\w*0,this\['\w+'\]=\w*0,this\['\w+'\]=\w*1,this\['\w+'\]=\w*1,this\['\w+'\]=\w*0,this\['\w+'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]=\w*0,this\['\w+'\]=\w*0,this\['\w+'\]=\w*0,/)[1];
                    _mouseDownL = _arguments[0].match(/this\['\w+'\]=function\(\){this\['(\w+)'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]={}/)[1];
                    _mouseDownR = _arguments[0].match(/this\['\w+'\]=function\(\){this\['(\w+)'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]={}/)[2];
                    // _inputs = _arguments[0].match(/\(\w+,\w*1\)\),\w+\['\w+'\]=\w*0,\w+\['\w+'\]=\w*0,!(\w+)\['\w+'\]&&\w+\['\w+'\]\['push'\]\((\w+)\),(\w+)\['\w+'\]/)[2];
                    _getWorldPosition = _arguments[0].match(/\['camera']\['(\w+)']\(\);if/)[1];
                    _maxHealth = _arguments[0].match(/this\['health']\/this\['(\w+)']\?/)[1];
                    _didShoot = _arguments[0].match(/\w+\['(\w+)']=!0x1,\w+\['burstCount']=0x0/)[1];
                    const procInputRegex = _arguments[0].match(/this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)/);
                    const reloadRegex = _arguments[0].match(/{!\w+\['reloadTimer']&&\w+\['(\w+)']\[\w+\['(\w+)']]/);
                    _procInputs = procInputRegex[1];
                    //_inputs = procInputRegex[2];
                    //_world = procInputRegex[3];
                    //_me = procInputRegex[4];
                    _ammos = reloadRegex[1];
                    _weaponIndex = reloadRegex[2];
                    game = true;
                }

            } catch (e) {
                // modify stack trace to hide proxy
                e.stack = e.stack.replace(/\n.*Object\.apply \(<.*/, '');
                throw e;
            }
            if (game) TextEncoder.prototype.encodeInto = original_encode;

            return Function.prototype.apply.apply(target, [_this, _arguments]);
        }
    });
    TextEncoder.prototype.encodeInto = hook_encode;
    conceal_function(original_encode, hook_encode);

    /**************************************************************/
    //<DEFINES>
    const Pi = Math.PI / 2;
    const PI2 = 2 * Math.PI;
    const consts = {
        cameraHeight: 1.5,
        playerHeight: 11,
        cameraHeight: 1.5,
        headScale: 2,
        crouchDst: 3,
        camChaseTrn: 0.0022,
        camChaseSpd: 0.0012,
        camChaseSen: 0.2,
        camChaseDst: 24,
        recoilMlt: 0.3,
        nameOffset: 0.6,
        nameOffsetHat: 0.8,
        verClans: [
            "DEV",
            "FaZe",
            "Lore",
            "nV",
            "Oxic",
            "Verb",
            "Omen",
            "ロリ幼女",
            "VOID",
            "JBP",
            "PHIL",
            "TIMP",
            "24/7",
            "g59",
            "GLXY",
            "MMOK",
            "ODTY"
        ],
    };
    const input = {
        speed: 1,
        ydir: 2,
        xdir: 3,
        shoot: 5,
        scope: 6,
        jump: 7,
        crouch: 8,
        reload: 9,
        weapon: 10,
    };
    const fonts = {
        ssBig: '30px\x20Sans-serif',
        ssSmall: '20px\x20Sans-serif',
        gmBig: '30px\x20GameFont',
        gmSmall: '20px\x20GameFont'
    }
    let settings = {
        isSliding: false,
        distance: Infinity,
        scopingOut: false,
        canShoot: true,
    }

    const downKeys = new Set();
    const upKeys = new Set();

    /**************************************************************/
    //<FUNCTIONS>
    let keyDown = (code) => {
        return downKeys.has(code);
    }

    let keyUp = (code) => {
        if (upKeys.has(code)) {
            upKeys.delete(code);
            return true;
        }
        return false;
    }

    let getDistance3D = (fromX, fromY, fromZ, toX, toY, toZ) => {
        var distX = fromX - toX,
            distY = fromY - toY,
            distZ = fromZ - toZ;
        return Math.sqrt(distX * distX + distY * distY + distZ * distZ);
    }

    let getDistance = (player1, player2) => {
        return getDistance3D(player1.x, player1.y, player1.z, player2.x, player2.y, player2.z);
    }

    let getDirection = (fromZ, fromX, toZ, toX) => {
        return Math.atan2(fromX - toX, fromZ - toZ);
    }

    let getXDir = (fromX, fromY, fromZ, toX, toY, toZ) => {
        var dirY = Math.abs(fromY - toY),
            dist = getDistance3D(fromX, fromY, fromZ, toX, toY, toZ);
        return Math.asin(dirY / dist) * (fromY > toY ? -1 : 1);
    }

    let getAngleDist = (start, end) => {
        return Math.atan2(Math.sin(end - start), Math.cos(start - end));
    }

    /**************************************************************/
    //<PROCINPUTS>
    function procInputs(me, world, renderer, inputs) {
        const controls = world.controls;
        let get = (entity, string) => {
            if (defined(entity) && entity && entity.active) {
                switch (string) {
                    case 'isYou':
                        return entity[_isYou];
                    case 'objInstances':
                        return entity[_objInstances];
                    case 'inView':
                        return (null == world[_canSee](me, entity.x, entity.y, entity.z)) && (null == world[_canSee](renderer.camera[_getWorldPosition](), entity.x, entity.y, entity.z, 10));
                    case 'isFriendly':
                        return (me && me.team ? me.team : me.spectating ? 0x1 : 0x0) == entity.team;
                    case 'recoilAnimY':
                        return entity[_recoilAnimY];
                }
            }
            return null;
        }

        let autoBhop = (value) => {
            if (!value) return;
            if (keyDown("Space") || value == 1 || value == 3) {
                controls.keys[controls.jumpKey] = !controls.keys[controls.jumpKey];
                if (value >= 2) {
                    if (settings.isSliding) {
                        controls.keys[controls.crouchKey] = 1;
                        return;
                    }
                    if (me.yVel < -0.04 && me.canSlide) {
                        settings.isSliding = true;
                        setTimeout(() => {
                            settings.isSliding = false;
                            controls.keys[controls.crouchKey] = 0;
                        }, 350);
                        controls.keys[controls.crouchKey] = 1;
                    }
                }
            }
        }

        let runQuickscoper = (target) => {
            if (me[_didShoot]) {
                me.aimVal = 0;
                settings.canShoot = false;
                setTimeout(() => {
                    inputs[input.scope] = controls[_mouseDownR] = 0;
                    inputs[input.shoot] = controls[_mouseDownL] = 0;
                    settings.canShoot = true;
                }, me.weapon.name == "Sniper Rifle" ? me.weapon.rate / 1.85 : me.weapon.rate / 4);
            }
            if (controls[_mouseDownL] === 1) {
                me.aimVal = 0;
                inputs[input.scope] = controls[_mouseDownR] = 0;
                inputs[input.shoot] = controls[_mouseDownL] = 0;
                settings.scopingOut = true;
            }
            if (me.aimVal === 1) {
                settings.scopingOut = false;
            }
            if (settings.scopingOut || !settings.canShoot || me.recoilForce > 0.01) {
                return false;
            }

            if (controls[_mouseDownR] === 0) {
                controls[_mouseDownR] = 1;
            } else if (me.aimVal < 0.2) {
                controls[_mouseDownL] = 1 - controls[_mouseDownL];
            }
            return true;
        }

        //auto aim
        let isLockedOn = false;
        let ty = controls.object.rotation.y;
        let tx = controls[_pchObjc].rotation.x;
        let target = world.players.list.filter(x => {
            x[_cnBSeen] = true;
            return defined(x[_objInstances]) && x[_objInstances] && x.active && !x[_isYou] && get(x, "inView") && !get(x, "isFriendly")
        }).sort((p1, p2) => p1[_objInstances].position.distanceTo(me) - p2[_objInstances].position.distanceTo(me)).shift();
        if (target && rightMouseClicked) {
            isLockedOn = runQuickscoper(target);
            let offset1 = ((consts.playerHeight - consts.cameraHeight) - (target.crouchVal * consts.crouchDst));
            let offset2 = consts.playerHeight - consts.headScale / 2 - target.crouchVal * consts.crouchDst;
            ty = getDirection(controls.object.position.z, controls.object.position.x, target.z, target.x);
            tx = getXDir(controls.object.position.x, controls.object.position.y, controls.object.position.z, target.x, target.y + offset2, target.z);
            tx -= consts.recoilMlt * me[_recoilAnimY];
        }
        if (!isLockedOn) {
            //controls[_mouseDownL] = 0;
            //controls[_mouseDownR] = 0;
            inputs[input.scope] = 0;
        }

        inputs[input.xdir] = +(tx % PI2).toFixed(3);
        inputs[input.ydir] = +(ty % PI2).toFixed(3);
        inputs[input.scope] = controls[_mouseDownR];
        inputs[input.shoot] = controls[_mouseDownL];


        // auto reload
        const ammoLeft = me[_ammos][me[_weaponIndex]];
        if (ammoLeft === 0) {
            world.players.reload(me);
            if (ammoLeft) world.players.endReload(me.weapon);
        }

        //auto bHop
        autoBhop(2);
    }

    /**************************************************************/
    //<HOOK>
    const original_scale = CanvasRenderingContext2D.prototype.fillRect;
    let hook_scale = new Proxy(original_scale, {
        apply: function(target, _this, _arguments) {
            try {
                var ret = Function.prototype.apply.apply(target, [_this, _arguments]);
                const args = arguments.callee.caller.arguments;
                //const scale = args[0];
                //const world = args[1];
                const renderer = args[2];
                const me = args[3];
                //const scale2 = args[4];
                if (me) {
                    if (defined(window.$)) { //jquery functions
                        window.$(document).ready(function() {
                            // Do once
                            if (!defined(console.json)) {
                                console.json = object => console.log(JSON.stringify(object, undefined, 2));
                                console.log("jquery Version ", window.$.fn.jquery);
                                console.dir(window);
                                // EventListeners...
                                addEventListener("keydown", e => {
                                    if ("INPUT" == window.document.activeElement.tagName) return;
                                    const key = e.key.toUpperCase();
                                    const code = e.code;
                                    if (!downKeys.has(code)) downKeys.add(code);
                                });
                                addEventListener("keyup", e => {
                                    const key = e.key.toUpperCase();
                                    const code = e.code;
                                    if (downKeys.has(code)) downKeys.delete(code);
                                    if (!upKeys.has(code)) upKeys.add(code);
                                })
                            }
                        });
                    }

                    if (!defined(me.procInputs)) {
                        me.procInputs = me[_procInputs];
                    }
                    else
                    {
                        me[_procInputs] = function() {
                            const player = this;
                            const inputs = arguments[0];
                            const world = arguments[1];
                            procInputs(player, world, renderer, inputs);
                            return me.procInputs.apply(this, arguments);
                        }
                    }
                }

            } catch (e) {
                // modify stack trace to hide proxy
                e.stack = e.stack.replace(/\n.*Object\.apply \(<.*/, '');
                throw e;
            }

            return ret;
        }
    });
    CanvasRenderingContext2D.prototype.fillRect = hook_scale;
    conceal_function(original_scale, hook_scale);
})();