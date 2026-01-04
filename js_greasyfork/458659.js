// ==UserScript==
// @name         florr.io master automation
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  automates important constants for the game florr.io
// @author       bismuth
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match        https://florr.io/
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/458659/florrio%20master%20automation.user.js
// @updateURL https://update.greasyfork.org/scripts/458659/florrio%20master%20automation.meta.js
// ==/UserScript==

class Automator {
    static config;
    constructor() {
        this.index = 0;
        this.packet;
        this.buffer = new ArrayBuffer(4);
        this._u8 = new Uint8Array(this.buffer);
        this._i32 = new Int32Array(this.buffer);
        this._f32 = new Float32Array(this.buffer);
        this.ready = false;
    }
    endianSwap(val) { return ((val & 0xff) << 24) | ((val & 0xff00) << 8) | ((val >> 8) & 0xff00) | ((val >> 24) & 0xff) }
    u8() { return this.packet[this.index++] }
    vu() {
        let out = 0, at = 0;
        while (this.packet[this.index] & 0x80) {
            out |= (this.u8() & 0x7f) << at;
            at += 7;
        }
        out |= this.u8() << at;
        return out;
    }
    getConfig(bin) {
        let buildHash;
        for (const a of document.scripts) if (a.innerHTML.length < 70 && a.innerHTML.match(/const versionHash = "(.){40}";/)) buildHash = a.innerHTML.split('"')[1];
        try {
            this.config = Automator.config = JSON.parse(window.localStorage.config);
        } catch(e) {
            this.config = Automator.config = {};
        }
        if (this.config.buildHash === buildHash) {
            console.log("[AUTOMATOR] loaded existing automation");
            return;
        }
        Number.prototype.fromvu = function() {
            let _ = this;
            const ret = [];
            while (_ >= 128) {
                ret.push((_ & 127) | 128);
                _ >>= 7;
            }
            ret.push(_);
            return ret;
        }
        const wasmRegex = (regex, repeat = false, start = 0) => {
            let ret = [], rets = [];
            jump: for (let n = start; n < this.packet.length - regex.length; n++) {
                this.index = n;
                ret = [];
                for (let p = 0; p < regex.length; p++) {
                    if (regex[p] === '*') this.vu();
                    else if (regex[p] === '+') ret.push(this.vu());
                    else if (regex[p] === "f") this.index += 4;
                    else if (this.u8() !== regex[p]) continue jump;
                }
                if (repeat) rets.push(ret);
                else return ret;
            }
            return rets.length? rets: false;
        }
        let entFunc;
        const ptrConsts = {}, textOffsets = {}, componentOffsets = {};
        const fieldOffsets = {
            x: {
                type: 'f32',
                group: 'position'
            },
            y: {
                type: 'f32',
                group: 'position'
            },
            absoluteX: {
                type: 'f64',
                group: 'position',
                offset: 56
            },
            absoluteY: {
                type: 'f64',
                group: 'position',
                offset: 88
            },
            angle: {
                type: 'f64',
                group: 'position'
            },
            petalCooldown: {
                type: 'u8',
                group: 'player',
                repeat: 10
            },
            petalsEquipped: {
                type: 'id',
                group: 'player',
                repeat: 20
            },
            petalHealth: {
                type: 'u8',
                group: 'player',
                repeat: 10
            },
            playerIsSelf: {
                type: 'i32',
                group: 'player'
            },
            dev: {
                type: 'u8',
                group: 'player'
            },
            playerUnkU8: {
                type: 'u8',
                group: 'player'
            },
            flowerFaceFlags: {
                type: 'u8',
                group: 'player'
            },
            playerSquadRelations: {
                type: 'u16',
                group: 'player'
            },
            fov: {
                type: 'f32',
                group: 'gui'
            },
            guiFlags: {
                type: 'u8',
                group: 'gui'
            },
            petalsCollected: {
                type: 'i32',
                group: 'gui',
                repeat: 51 * 8
            },
            playerPtr: {
                type: 'i32',
                group: 'gui'
            },
            killedBy: {
                type: 'str',
                group: 'gui'
            },
            cameraX: {
                type: 'f32',
                group: 'gui'
            },
            cameraY: {
                type: 'f32',
                group: 'gui'
            },
            dropCount: {
                type: 'i32',
                group: 'drop'
            },
            dropHidden: {
                type: 'u8',
                group: 'drop'
            },
            dropID: {
                type: 'id',
                group: 'drop'
            },
            petalID: {
                type: 'id',
                group: 'petal'
            },
            healthbar: {
                type: 'u8',
                group: 'health'
            },
            health: {
                type: 'u8',
                group: 'health'
            },
            shield: {
                type: 'u8',
                group: 'health'
            },
            name: {
                type: 'str',
                group: 'name'
            },
            arenaBGColor: {
                type: 'i32',
                group: 'arena'
            },
            arenaScenario: {
                type: 'u8',
                group: 'arena'
            },
            arenaBG2Color: {
                type: 'i32',
                group: 'arena'
            },
            arenaMapFunc: {
                type: 'i32',
                group: 'arena'
            },
            mobID: {
                type: 'u8',
                group: 'mob'
            },
            mobRarity: {
                type: 'u8',
                group: 'mob'
            },
            isFriendly: {
                type: 'u8',
                group: 'mob'
            },
            projectileType: {
                type: 'u8',
                group: 'projectilePea'
            },
            isPoisonous: {
                type: 'u8',
                group: 'projectilePea'
            },
            hidden: {
                type: 'u8',
                group: 'renderable'
            },
            radius: {
                type: 'f32',
                group: 'physics'
            }
        }
        const componentFunctionMap = {};
        const funcs = [];
        const field_func = [...new Array(140).fill().map((_,ind) => ind & 1? '*': 2), 32, '*', 32, '*', 106, 34, '*', 65, 2];
        this.packet = new Uint8Array(bin);
        this.index = 8;
        while (this.index < this.packet.length) {
            const id = this.vu();
            const sectionLen = this.vu();
            if (id !== 10) {
                this.index += sectionLen;
                continue;
            }
            const bodyCount = this.vu();
            for (let i = 0; i < bodyCount; i++) {
                const len = this.vu();
                funcs.push(this.packet.subarray(this.index, this.index += len));
            }
            break;
        }
        for (let funcIndex = 0; funcIndex < funcs.length; funcIndex++) {
            let a;
            this.packet = funcs[funcIndex];
            if (a = wasmRegex([
                [12],
                [127],
                [32,'*'],
                [40,'*','+']
            ].flat(), false)) { componentFunctionMap[funcIndex+358] = a[0] }
            if (a = wasmRegex([
                [65,'+'],
                [106],
                [33,'*'],
                [3,'*'],
                [32,'*'],
                [65,'+'],
                [107],
                [16]
            ].flat(), false)) [ptrConsts.entListOffset, ptrConsts.entSize] = a;
            if (a = wasmRegex([
                [26],
                [65,'*'],
                [65,'*'],
                [54,'*','*'],
                [65,'+'],
                [16]
            ].flat(), false)) ptrConsts.entListPtr = a[0];
            if (a = wasmRegex([
                [43,'*','*'],
                [182],
                [32,'*'],
                [65,'+'],
                [106],
                [42,'*','*'],
                [147],
                [148],
                [32,'*'],
                [65,'*']
            ].flat(), false)) ptrConsts.animatedOffset = a[0];
            if (a = wasmRegex([
                [65,"*"],
                [66,0],
                [55,"*","*"],
                [65,"*"],
                [65,1],
                [54,"*","*"],
                [65,"*"],
                [66,0],
                [55,"*","*"],
                [65,"*"],
                [65,1],
                [58,"*","*"],
                [65,"+"],
                [65,5],
                [54,"*","*"],
                [65,"*"],
                [65,0],
                [58,"*","*"],
            ].flat(), false)) ptrConsts.inventoryOffset = a[0];
            if (a = wasmRegex([
                [4,"*"],
                [32,"*"],
                [32,"*"],
                [65,"*"],
                [113],
                [58,"*","*"],
                [2,"*"],
                [32,"*"],
                [40,"*","*"],
                [34,"*"],
                [40,"*","*"],
                [34,"*"],
                [69],
                [13,"*"],
                [32,"*"],
                [65,"+"],
                [106],
                [33,"*"],
                [32,"*"],
                [65,"+"],
                [106],
                [40,"*","*"],
                [33,"*"],
                [65,"*"],
                [33,"*"],
                [3,"*"],
            ].flat(), true)) {
                console.log(a);
                a = a.filter(([b,c]) => b > 132 && b < 300)[0];
                ptrConsts.entVecOffset = a[1];
                ptrConsts.entVecPtrOffsetPer = a[0];
            }
            if (a = wasmRegex([
                [32,0],
                [65,"+"],
                [106],
                [40,"*","*"],
                [40,"*","*"],
                [34,'*'],
                [69],
                [13,'*'],
                [32,'*'],
                [40,"*",'*'],
            ].flat(), false)) ptrConsts.guiGroupOffset = a[0];
            if (a = wasmRegex([
                [2,"*"],
                [32,"*"],
                [16,"*"],
                [65,"*"],
                [70],
                [4,"*"],
                [32,"*"],
                [65,"+"],
                [65,"*"],
                [16,"*"],
                [69],
                [13,"*"],
                [11],
                [65,"*"],
                [16,"*"],
                [12,"*"],
                [11],
            ].flat(), false)) ptrConsts.buildHashPtr = a[0];
            if (a = wasmRegex(field_func) && funcIndex > 200) {
                const index = this.index;
                gui: {
                    a = wasmRegex([
                        [32,'*'],
                        [16,"+"],
                        [33,'*'],
                        [2,"*"],
                        [32,'*'],
                        [40,"*",'*'],
                        [69],
                        [4,"*"],
                        [32,'*'],
                        [40,"*",'*'],
                        [33,'*'],
                        [12,"*"],
                        [11],
                        [32,'*'],
                        [65,'*'],
                        [54,"*",'*'],
                        [32,'*'],
                        [32,'*'],
                        [40,"*",'*'],
                        [65,'*'],
                        [106],
                        [34,'*'],
                        [54,"*",'*'],
                        [11],
                        [32,'*'],
                        [32,'*'],
                        [65,'*'],
                        [106],
                        [34,'*'],
                        [32,'*'],
                        [40,"*",'*'],
                        [77],
                        [4,'*'],
                        [32,'*'],
                        [40,"*","*"],
                        [32,'*'],
                        [106],
                        [42,'*',"*"],
                        [33,'*'],
                        [32,'*'],
                        [32,'*'],
                        [54,"*",'*'],
                        [67,"f"],
                        [67,"f"],
                        [32,'*'],
                        [32,'*'],
                        [139],
                        [34,'*'],
                        [67,"f"],
                        [96],
                        [27],
                        [67,"f"],
                        [32,'*'],
                        [32,'*'],
                        [91],
                        [27],
                        [32,'*'],
                        [67,"f"],
                        [93],
                        [27],
                        [5],
                        [67,"f"],
                        [11],
                        [56,"*","+"],
                        [12,"*"],
                    ].flat(), true, index);
                    a = componentFunctionMap[a[0][0]]? a[0]: a[1];
                    componentOffsets.gui = a[0];
                    fieldOffsets.fov.offset = a[1];
                    a = wasmRegex([
                        [16,...componentOffsets.gui.fromvu()],
                        [33,'*'],
                        [2,"*"],
                        [32,'*'],
                        [40,"*",12],
                        [69],
                        new Array(71).fill('*'),
                        [65,0],
                        [11],
                        [58,"*",'+'],
                        [12,"*"],
                    ].flat(), false, index);
                    fieldOffsets.guiFlags.offset = a[0];
                    a = wasmRegex([
                        [32,"*"],
                        [16,"*"],
                        [34,"*"],
                        [40,"*","*"],
                        [40,"*","*"],
                        [33,"*"],
                        [2,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [69],
                        [4,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [33,"*"],
                        [12,"*"],
                        [11],
                        [32,"*"],
                        [65,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [54,"*","*"],
                        [11],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [77],
                        [4,"*"],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [40,"*","*"],
                        [34,"*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [33,"*"],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [33,"*"],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [33,"*"],
                        [32,"*"],
                        [32,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [116],
                        [114],
                        [32,"*"],
                        [65,"*"],
                        [116],
                        [114],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [65,"*"],
                        [116],
                        [114],
                        [5],
                        [65,"*"],
                        [11],
                        [16,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [40,"*","*"],
                        [33,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [40,"*","*"],
                        [33,"*"],
                        [32,"*"],
                        [65,"+"],
                    ].flat(), false, index);
                    fieldOffsets.playerPtr.offset = a[0];
                    a = wasmRegex([
                        [16,...componentOffsets.gui.fromvu()],
                        [65,'+'],
                        [106],
                    ].flat(), false, index);
                    fieldOffsets.petalsCollected.offset = a[0] + 32;
                    componentOffsets.gui = componentFunctionMap[componentOffsets.gui];
                }
                position: {
                    a = wasmRegex([
                        [16,"+"],
                        [34,'*'],
                        [42,"*",'+'],
                        new Array(159).fill("*"),
                        [187],
                        [57,"*","+"],
                    ].flat(), true, index);
                    if (a[0][2] === 144) {
                        fieldOffsets.x.offset = a[0][1];
                        fieldOffsets.y.offset = a[1][1];
                    }
                    else {
                        fieldOffsets.y.offset = a[0][1];
                        fieldOffsets.x.offset = a[1][1];
                    }
                    componentOffsets.position = componentFunctionMap[a[0][0]];
                    a = wasmRegex([
                        [32,'*'],
                        [32,'*'],
                        [97],
                        [13,"*"],
                        [32,'*'],
                        [65,1],
                        [58,"*","*"],
                        [32,'*'],
                        [32,'*'],
                        [43,"*",'+'],
                        [57,"*",'*'],
                    ].flat(), false, index);
                    fieldOffsets.angle.offset = a[0];
                }
                player: {
                    a = wasmRegex([
                        [32,"*"],
                        [16,"+"],
                        [65,"+"],
                        [106],
                        [33,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [33,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [69],
                        [33,"*"],
                        [65,"*"],
                        [33,"*"],
                        [3,"*"],
                        [65,"*"],
                        [33,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [33,"*"],
                        [2,"*"],
                        [2,"*"],
                        [2,"*"],
                        [2,"*"],
                        [32,"*"],
                        [65,"*"],
                        [113],
                        [69],
                    ].flat(), true, index);
                    a = a.filter(([b,c]) => componentFunctionMap.hasOwnProperty(b) && componentFunctionMap[b] !== componentOffsets.gui)[0];
                    componentOffsets.player = a[0];
                    fieldOffsets.petalCooldown.offset = a[1];
                    a = wasmRegex([
                        [16,...componentOffsets.player.fromvu()],
                        [65,"+"],
                        [106],
                        [33,"*"],
                        [65,"*"],
                        [33,"*"],
                        [3,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [33,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [33,"*"],
                        [2,"*"],
                        [2,"*"],
                        [2,"*"],
                        [2,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [4,"*"],
                        [32,"*"],
                        [65,"*"],
                        [54,"*","*"],
                        [65,"*"],
                        [33,"*"],
                        [32,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [34,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [32,"*"],
                        [75],
                        [13,"*"],
                        [32,"*"],
                        [32,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [44,"*","*"],
                        [34,"*"],
                        [65,"*"],
                        [113],
                        [33,"*"],
                        [32,"*"],
                        [65,"*"],
                        [78],
                        [13,"*"],
                        [32,"*"],
                        [32,"*"],
                        [70],
                        [13,"*"],
                        [65,"*"],
                        [33,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [32,"*"],
                        [77],
                        [13,"*"],
                        [32,"*"],
                        [33,"*"],
                        [12,"*"],
                        [11],
                        [65,"*"],
                        [33,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [34,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [32,"*"],
                        [75],
                        [13,"*"],
                        [32,"*"],
                        [32,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [44,"*","*"],
                        [34,"*"],
                        [65,"*"],
                        [113],
                        [33,"*"],
                        [32,"*"],
                        [65,"*"],
                        [78],
                        [13,"*"],
                        [32,"*"],
                        [32,"*"],
                        [70],
                        [13,"*"],
                        [65,"*"],
                        [33,"*"],
                        [2,"*"],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [73],
                        [4,"*"],
                        [32,"*"],
                        [33,"*"],
                        [12,"*"],
                        [11],
                        [32,"*"],
                        [32,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [33,"*"],
                        [11],
                        [32,"*"],
                        [65,"*"],
                        [113],
                        [65,"*"],
                        [116],
                        [32,"*"],
                        [114],
                        [33,"*"],
                        [32,"*"],
                        [65,"*"],
                        [116],
                        [65,"*"],
                        [117],
                        [65,"*"],
                        [78],
                        [13,"*"],
                        [32,"*"],
                        [32,"*"],
                        [70],
                        [13,"*"],
                        [65,"*"],
                        [33,"*"],
                        [2,"*"],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [73],
                        [4,"*"],
                        [32,"*"],
                        [33,"*"],
                        [12,"*"],
                        [11],
                        [32,"*"],
                        [32,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [33,"*"],
                        [11],
                        [32,"*"],
                        [65,"*"],
                        [113],
                        [65,"*"],
                        [116],
                        [32,"*"],
                        [114],
                        [33,"*"],
                        [32,"*"],
                        [65,"*"],
                        [116],
                        [65,"*"],
                        [117],
                        [65,"*"],
                        [78],
                        [13,"*"],
                        [32,"*"],
                        [32,"*"],
                        [70],
                        [13,"*"],
                        [65,"*"],
                        [33,"*"],
                        [2,"*"],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [73],
                        [4,"*"],
                        [32,"*"],
                        [33,"*"],
                        [12,"*"],
                        [11],
                        [32,"*"],
                        [32,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [33,"*"],
                        [11],
                        [32,"*"],
                        [65,"*"],
                        [113],
                        [65,"*"],
                        [116],
                        [32,"*"],
                        [114],
                        [33,"*"],
                        [32,"*"],
                        [65,"*"],
                        [116],
                        [65,"*"],
                        [117],
                        [65,"*"],
                        [78],
                        [13,"*"],
                        [32,"*"],
                        [32,"*"],
                        [70],
                        [13,"*"],
                        [32,"*"],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [79],
                        [4,"*"],
                        [32,"*"],
                        [32,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [5],
                        [65,"*"],
                        [11],
                        [65,"*"],
                        [116],
                        [114],
                        [33,"*"],
                        [12,"*"],
                        [11],
                        [32,"*"],
                        [32,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [33,"*"],
                        [11],
                        [32,"*"],
                        [65,"*"],
                        [113],
                        [65,"*"],
                        [116],
                        [32,"*"],
                        [114],
                        [33,"*"],
                        [32,"*"],
                        [65,"*"],
                        [116],
                        [65,"*"],
                        [117],
                        [65,"*"],
                        [78],
                        [13,"*"],
                        [32,"*"],
                        [32,"*"],
                        [70],
                        [13,"*"],
                        [65,"*"],
                        [33,"*"],
                        [2,"*"],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [73],
                        [4,"*"],
                        [32,"*"],
                        [33,"*"],
                        [12,"*"],
                        [11],
                        [32,"*"],
                        [32,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [33,"*"],
                        [11],
                        [32,"*"],
                        [65,"*"],
                        [113],
                        [65,"*"],
                        [116],
                        [32,"*"],
                        [114],
                        [33,"*"],
                        [32,"*"],
                        [65,"*"],
                        [116],
                        [65,"*"],
                        [117],
                        [65,"*"],
                        [78],
                        [13,"*"],
                        [32,"*"],
                        [32,"*"],
                        [70],
                        [13,"*"],
                        [65,"*"],
                        [33,"*"],
                        [2,"*"],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [73],
                        [4,"*"],
                        [32,"*"],
                        [33,"*"],
                        [12,"*"],
                        [11],
                        [32,"*"],
                        [32,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [33,"*"],
                        [11],
                        [32,"*"],
                        [65,"*"],
                        [113],
                        [65,"*"],
                        [116],
                        [32,"*"],
                        [114],
                        [33,"*"],
                        [32,"*"],
                        [65,"*"],
                        [116],
                        [65,"*"],
                        [117],
                        [65,"*"],
                        [78],
                        [13,"*"],
                        [32,"*"],
                        [32,"*"],
                        [70],
                        [13,"*"],
                        [32,"*"],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [79],
                        [4,"*"],
                        [32,"*"],
                        [32,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [5],
                        [65,"*"],
                        [11],
                        [65,"*"],
                        [116],
                        [114],
                        [33,"*"],
                        [11],
                        [32,"*"],
                        [65,"*"],
                        [115],
                        [34,"*"],
                        [69],
                        [13,"*"],
                        [11],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [32,"*"],
                        [16,"*"],
                        [32,"*"],
                        [32,"*"],
                        [106],
                        [34,"*"],
                        [65,"*"],
                        [116],
                        [32,"*"],
                        [106],
                        [65,"*"],
                        [107],
                        [32,"*"],
                        [47,"*","*"],
                        [59,"*","*"],
                        [12,"*"],
                        [11],
                        [0],
                    ].flat(), false, index);
                    fieldOffsets.petalsEquipped.offset = a[0];
                    a = wasmRegex([
                        [16,...componentOffsets.player.fromvu()],
                        [65,'+'],
                        [106],
                        [33,'*'],
                        [65,0],
                        [33,'*'],
                        [3,'*'],
                        [32,'*'],
                        [40, '*', '*'],
                        [33,'*'],
                        [32,'*'],
                        [40,"*",4],
                        [33,'*'],
                    ].flat(), true, index);
                    fieldOffsets.petalHealth.offset = fieldOffsets.petalsEquipped.offset === a[0][0]? a[1][0]: a[0][0];
                    a = wasmRegex([
                        [16,...componentOffsets.player.fromvu()],
                        [33,"*"],
                        [2,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [69],
                        [4,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [33,"*"],
                        [12,"*"],
                        [11],
                        [32,"*"],
                        [65,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [54,"*","*"],
                        [11],
                        [32,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [34,"*"],
                        [32,"*"],
                        [40,"*","*"],
                        [77],
                        [4,"*"],
                        [32,"*"],
                        [32,"*"],
                        [54,"*","*"],
                        [32,"*"],
                        [40,"*","*"],
                        [32,"*"],
                        [106],
                        [45,"*","*"],
                        [5],
                        [65,"*"],
                        [11],
                        [58,"*","+"],
                        [12,"*"],
                    ].flat(), true, index);
                    fieldOffsets.flowerFaceFlags.offset = a[0][0] + a[1][0] + a[2][0];
                }

                petal_drop: {
                    a = wasmRegex([
                        [32,"*"],
                        [16,"+"],
                        [33,"*"],
                        [32,"*"],
                        [65,"*"],
                        [106],
                        [32,"*"],
                        [16,"*"],
                        [32,"*"],
                        [32,"*"],
                        [47,"*","*"],
                        [59,"*","+"],
                        [12,"*"],
                    ].flat(), true, index);
                    const b = a;
                    if (a = wasmRegex([
                        [16,...b[0][0].fromvu()],
                        [33,'*'],
                        [32,'*'],
                        [40,"*","*"],
                        [33,'*'],
                        [32,'*'],
                        new Array(692).fill("*"),
                        [32,'*'],
                        [54,"*",'+'],
                        [12,"*"],
                        [11,"*"],
                    ].flat(), false, index)) {
                        componentOffsets.petal = b[1][0];
                        fieldOffsets.petalID.offset = b[1][1];
                        componentOffsets.drop = b[0][0];
                        fieldOffsets.dropCount.offset = a[0];
                    } else if (a = wasmRegex([
                        [16,...b[1][0].fromvu()],
                        [33,'*'],
                        [32,'*'],
                        [40,"*","*"],
                        [33,'*'],
                        [32,'*'],
                        new Array(692).fill("*"),
                        [32,'*'],
                        [54,"*",'+'],
                        [12,"*"],
                        [11,"*"],
                    ].flat(), false, index)) {
                        componentOffsets.petal = b[0][0];
                        fieldOffsets.petalID.offset = b[0][1];
                        componentOffsets.drop = b[1][0];
                        fieldOffsets.dropCount.offset = a[0];
                    }
                }
                name: {
                    try {
                        a = wasmRegex([
                            [16,"+"],
                            [33,'*'],
                            [2,"*"],
                            [32,'*'],
                            [40,"*",'*'],
                            [69],
                            new Array(418).fill('*'),
                            [55,'*','*'],
                            [32,'*'],
                            [32,'*'],
                            [40,"*",'*'],
                            [54,"*",'+'],
                            [12,"*"],
                        ].flat(), true, index);
                        for (const pair of a) {
                            if (componentFunctionMap[pair[0]]) {
                                if (componentFunctionMap[pair[0]] !== componentOffsets.gui) {
                                    componentOffsets.name = componentFunctionMap[pair[0]];
                                    fieldOffsets.name.offset = pair[1] - 8;
                                } else {
                                    fieldOffsets.killedBy.offset = pair[1] - 8;
                                }
                            }
                        }
                    } catch(e) {}
                }
                arena: {
                    try {
                        a = wasmRegex([
                            [16,"+"],
                            [33,'*'],
                            [2,"*"],
                            [32,'*'],
                            [40,"*",'*'],
                            new Array(179).fill('*'),
                            [11],
                            [32,'*'],
                            [32,'*'],
                            [58,"*",'+'],
                            [32,'*'],
                            [32,'*'],
                            [58,"*",'+'],
                            [32,'*'],
                            [32,'*'],
                            [58,"*",'+'],
                        ].flat(), false, index);
                        fieldOffsets.arenaBGColor.offset = Math.min(...a);
                        componentOffsets.arena = componentFunctionMap[a[0]];
                        a = wasmRegex([
                            [32,'*'],
                            [65,'*'],
                            [75],
                            [13,"*"],
                            [11],
                            [32,'*'],
                            [32,'*'],
                            [65,'+'],
                            [106],
                            [32,'*'],
                            [16,"*"],
                        ].flat(), false, index);
                        fieldOffsets.arenaScenario.offset = a[0];
                        fieldOffsets.arenaMapFunc.offset = a[0] + 12;
                        a = wasmRegex([
                            [32,'*'],
                            [32,'*'],
                            [114],
                            [32,'*'],
                            [114],
                            [114],
                            [54,"*",'+'],
                            [12,"*"],
                        ].flat(), false, index);
                        fieldOffsets.arenaBG2Color.offset = a[0];
                    } catch(e) {}
                }
                mob: {
                    a = wasmRegex([
                        [16,"+"],
                        [33,'*'],
                        [2,"*"],
                        new Array(79).fill('*'),
                        [11],
                        [58,"*",'+'],
                        [12,"*"],
                    ].flat(), true, index);
                    a = a.filter(x => x[1] < 11).filter(x => componentFunctionMap.hasOwnProperty(x[0]) && componentFunctionMap[x[0]] !== componentOffsets.health && componentFunctionMap[x[0]] !== componentOffsets.player).sort((x,y) => x[0] - y[0]);
                    componentOffsets.mob = 0;
                    let maps = new Set();
                    for (let b of a) maps.add(b[0]);
                    for (const num of maps.keys()) {
                        let ct = 0;
                        for (let m = 0; m < a.length; m++) if (a[m][0] === num) ct++;
                        if (ct === 3) componentOffsets.mob += num;
                    }
                }
                physics: {
                    try {
                        a = wasmRegex([
                            [2,"*"],
                            [32,'*'],
                            [16,"+"],
                            [34,'*'],
                            [45,"*",'*'],
                            [69],
                            [4,"*"],
                            [32,'*'],
                            [42,"*",'*'],
                            [12,"*"],
                            [11],
                            new Array(250).fill('*'),
                            [11],
                            [56,"*",'+'],
                            [12,"*"],
                        ].flat(), true, index);
                        a = a.filter(x => componentFunctionMap[x[0]] !== componentOffsets.gui)[0];
                        componentOffsets.physics = componentFunctionMap[a[0]];
                        fieldOffsets.radius.offset = a[1];
                    } catch(e) {}
                }
                console.log("[AUTOMATOR] ran field automation");
                entFunc = funcIndex + 358;
            }
            if (a = wasmRegex([
                [45,"*",'+'],
                [184],
                [68, ...new Uint8Array(new Float64Array([0.024639942381096416]).buffer)],
                [162],
                [182],
                [56,"*",'*'],
                [32,'*'],
                [32,'*'],
                [45,"*",'+'],
            ].flat())) { fieldOffsets.flowerFaceFlags.offset -= a[0] + a[1]; fieldOffsets.playerUnkU8.offset = a[0]; fieldOffsets.dev.offset = a[1]; }
            if (a = wasmRegex([
                [32,"*"],
                [40,"*","*"],
                [70],
                [13,"*"],
                [32,'*'],
                [40,"*",'+'],
                [34,"*"],
                [45,"*",'+'],
                [65,'+'],
            ].flat(), false)) {
                componentOffsets.health = a[0];
                fieldOffsets.healthbar.offset = a[1];
                fieldOffsets.healthbar.flag = a[2];
                componentOffsets.mob -= Object.fromEntries(Object.entries(componentFunctionMap).map(([key,val]) => [val,key]))[a[0]];
                componentOffsets.mob = componentFunctionMap[componentOffsets.mob];
            }
            if (a = wasmRegex([
                [45,"*",'+'],
                [184],
                [68,"f","f"],
                [162],
                [182],
                [56,'*','*'],
                [32,'*'],
                [32,'*'],
                [45,"*",'+'],
                [184],
                [68,"f","f"],
                [162],
                [182],
            ].flat())) { fieldOffsets.health.offset = a[0]; fieldOffsets.shield.offset = a[1] }
            if (a = wasmRegex([
                [2,"*"],
                [32,"*"],
                [65,"*"],
                [106],
                [45,"*","*"],
                [69],
                [4,"*"],
                [32,"*"],
                [42,"*","+"],
                [12,"*"],
                [11],
                [32,"*"],
                [65,"*"],
                [106],
                [16,"*"],
                [2,"*"],
                [68,"f","f"],
                [32,"*"],
                [45,"*","*"],
                [69],
                [13,"*"],
                [26],
                [68,"f","f"],
                [32,"*"],
                [45,"*","*"],
                [69],
                [13,"*"],
                [26],
                [32,"*"],
                [43,"*","*"],
                [32,"*"],
                [65,"*"],
                [106],
                [43,"*","*"],
                [161],
                [68,"f","f"],
                [162],
                [11],
                [68,"f","f"],
                [165],
                [68,"f","f"],
                [164],
                [32,"*"],
                [42,"*","*"],
                [32,"*"],
                [65,"*"],
                [106],
                [42,"*","*"],
                [34,"*"],
                [147],
                [187],
                [162],
                [32,"*"],
                [187],
                [160],
                [182],
                [11],
                [33,"*"],
                [32,"*"],
                [65,"*"],
                [106],
                [45,"*","*"],
                [69],
                [4,"*"],
                [32,"*"],
                [42,"*","+"],
                [12,"*"],
                [11],
                [32,"*"],
                [65,"*"],
                [106],
                [16,"*"],
            ].flat(), false)) {
                fieldOffsets.cameraX.offset = a[0];
                fieldOffsets.cameraY.offset = a[1];
            }
            if (a = wasmRegex([
                [66,"*"],
                [55,"*",'*'],
                [32,'*'],
                [32,'*'],
                [45,"*",'+'],
                [58,"*",'*'],
                [32,'*'],
                [32,'*'],
                [45,"*",'+'],
                [34,'*'],
                [58,"*",'*'],
            ].flat(), false)) {
                fieldOffsets.mobID.offset = a[0];
                fieldOffsets.mobRarity.offset = a[1];
                fieldOffsets.isFriendly.offset = 27 - a[0] - a[1];
            }
            if (a = wasmRegex([
                [32,'*'],
                [40,"*",'+'],
                [45,"*",'+'],
                [33,'*'],
                [32,'*'],
                [65,"*"],
                [106],
                [32,'*'],
                [40,"*",'+'],
                [16,'*'],
            ].flat(), false)) {
                componentOffsets.projectilePea = a[0];
                fieldOffsets.isPoisonous.offset = a[1];
                fieldOffsets.projectileType.offset = 17 - a[1];
                componentOffsets.renderable = a[2];
                fieldOffsets.hidden.offset = 8;
            }
            if (a = wasmRegex([
                [65,"+"],
                [65,"*"],
                [32,'*'],
                [27],
                [34,'*'],
                [32,'*'],
                [65,"+"],
                [108],
                [106],
            ].flat(), false)) {
                textOffsets.chatBasePtr = a[0] - 8;
                textOffsets.outerSize = a[1];
            }
            if (a = wasmRegex([
                [65,"+"],
                [33,'*'],
                [32,'*'],
                [65,'*'],
                [108],
                [65,"*"],
                [106],
                [33,'*'],
                [32,'*'],
                [178],
            ].flat(), false)) textOffsets.mobPtr = a[0];
        }
        componentOffsets.petal = componentFunctionMap[componentOffsets.petal];
        componentOffsets.player = componentFunctionMap[componentOffsets.player];
        componentOffsets.drop = componentFunctionMap[componentOffsets.drop];

        const fields = {};
        for (const [name,field] of Object.entries(fieldOffsets)) {
            if (!fields[field.group]) fields[field.group] = [];
            if (field.offset) fields[field.group].push({...field,name});
        }
        const components = Object.fromEntries(Object.entries(componentOffsets).map(([key,val]) => [val,key]));
        //for (const key of Object.keys(componentOffsets)) componentOffsets[key] = componentFunctionMap[componentOffsets[key]];
        this.config = Automator.config = { ptrConsts, componentOffsets, components, fieldOffsets, fields, entFunc, buildHash };
        window.localStorage.config = JSON.stringify(this.config);
        console.log("[AUTOMATOR] done with config", componentFunctionMap, this.config);
    }
    init(before, after) {
        const that = this;
        WebAssembly.instantiateStreaming = new Proxy(WebAssembly.instantiateStreaming, {
            apply(t,ta,[r, i]) {
                return r.arrayBuffer().then(b => WebAssembly.instantiate(b, i));
            }
        });
        WebAssembly.instantiate = new Proxy(WebAssembly.instantiate , {
            apply(t,ta,[bin,imports]) {
                that.getConfig(bin);
                bin = before(bin, imports) || bin;
                return t.apply(ta, [bin, imports]).then(wasm => {
                    for (const exp of Object.values(wasm.instance.exports)) {
                        if (exp.buffer) {
                            after(exp.buffer);
                            break;
                        }
                    }
                    return wasm;
                });
            }
        })
    }
}