// ==UserScript==
// @name         twisted
// @version      1.0.6
// @author       Twisted
// @description  Twisted - op kranker dot eye oh h4x dll firefox api
// @match        *://krunker.io/*
// @grant        GM.registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/717607
// @downloadURL https://update.greasyfork.org/scripts/418719/twisted.user.js
// @updateURL https://update.greasyfork.org/scripts/418719/twisted.meta.js
// ==/UserScript==

window = unsafeWindow;

window.hackToggle = true;

let game, input, me, recon, lock;

const key = {
    frame: 0,
    delta: 1,
    xdir: 2,
    ydir: 3,
    moveDir: 4,
    shoot: 5,
    scope: 6,
    jump: 7,
    reload: 8,
    crouch: 9,
    weaponScroll: 10,
    weaponSwap: 11,
    moveLock: 12
};

const varsRe = {
    cnBSeen: { regex: /(&&!\w\['\w+']&&\w\['\w+'\]&&)\w\['(\w+)'](\){)/, pos: 2 },
    recoilAnimY: { regex: /this\['(\w+)']\+=this\['\w+']\*\(/, pos: 1 },
    aimVal: { regex: /this\['(\w+)']-=0x1\/\(this\['weapon']\['\w+']\/\w+\)/, pos: 1 },
    pchObjc: { regex: /0x0,this\['(\w+)']=new \w+\['Object3D']\(\),this/, pos: 1 },
    didShoot: { regex: /--,\w+\['(\w+)']=!0x0/, pos: 1 },
    nAuto: { regex: /'Single\\x20Fire','varN':'(\w+)'/, pos: 1 }
}

const vars = {}

const getDistance = function(x1, y1, z1, x2, y2, z2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var dz = z1 - z2;
    return Math.hypot(dx, dy, dz);
}

const getDirection = function(a, b, c, d) {
    return Math.atan2(b - d, a - c);
}

const getXDir = function(e, n, r, i, a, s) {
    const o = Math.abs(n - a);
    const dis = getDistance(e, n, r, i, a, s);
    return Math.asin(o / dis) * (n > a ? -1 : 1);
}

const getTarget = function() {
    let fil = game.players.list.filter(function(player) {
        return (player[vars.cnBSeen] && player.active && player !== me) && (!me.team || me.team !== player.team)
    });
    return fil[0];
}

const shoot = function() {
    input[key.scope] = 1;
    let weapon = me.weapon;
    if (weapon[vars.nAuto] && me[vars.didShoot]) {
        input[key.shoot] = 0;
    } else if (!me[vars.aimVal]) {
        input[key.shoot] = 1;
    }
}

const toggleHack = function() {
    window.hackToggle = !window.hackToggle;
}

window.useHack = function(i, g, m, r, l) {
    game = g; input = i; me = m; recon = r; lock = l;

    let target = getTarget();
    if (target && window.hackToggle) {
        const yDire = (getDirection(me.z, me.x, target.z, target.x) || 0) * 1000;
        const xDire = ((getXDir(me.x, me.y, me.z, target.x, target.y, target.z) || 0) - (0.3 * me[vars.recoilAnimY])) * 1000;

        input[key.ydir] = yDire;
        input[key.xdir] = xDire;

        shoot();
    }
}

const patchCode = function(code) {
    for (let i in varsRe) {
        const key = varsRe[i];
        vars[i] = key.regex.exec(code)[key.pos];
    }
    code = code.replace(varsRe.cnBSeen.regex, "$1true$3").replace(/!(\w+)\['transparent']/, `$&& (!window.hackToggle || !$1.penetrable )`).replace(/(this\['\w+']=function\(\w+,\w+,\w+,\w+\){)(this\['recon'])/, "$1{\nconst [input, game, recon, lock] = arguments, me = this;\nwindow.useHack(input, game, me, recon, lock);};$2") // patches code
    GM.registerMenuCommand("Toggle Hack", toggleHack);
    return code;
}

const _Function = Function;
window.Function = new Proxy(Function, {
    construct(target, args) {
        if ((args[2] || "").startsWith("var vrtInit")) {
            args[2] = patchCode(args[2]);
            window.Function = _Function;
        }
        return new target(...args);
    }
})