// ==UserScript==
// @name         Zombia.io Debugging QOL
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Makes the 'ByteBuffer', 'PIXI', and 'game' objects global, deobfuscates app.js, and adds extra functionality to game.network.decode. You must have instant inject on for this script to work.
// @author       You
// @match        http://zombia.io/
// @icon         http://zombia.io/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/485110/Zombiaio%20Debugging%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/485110/Zombiaio%20Debugging%20QOL.meta.js
// ==/UserScript==
// YOU MUST HAVE INSTANT INJECT FOR THIS SCRIPT TO WORK

/* CUSTOM DECODE INFO:
 args: packet, id/customKE, lpUid (not required)
 - decoding the same packet twice will not error anymore
 - uid key is returned to every entity
 - for every ws you open, it has to be decoded with a seperate id (number or string, no objects) (defaults to -1, used for socket sent by appjs)
 - if you want to decode a packet with a custom knownEntities and uid (like a packet that has already been decoded and its not in the same tick), you can pass the customKE as the id and the custom uid as the third argument (this will not update your customKE object!!)
*/

// BYTEBUFFER GLOBAL
Object.defineProperty(Function.prototype, "LITTLE_ENDIAN", {
    get: function() {
        return this._LITTLE_ENDIAN
    },
    set: function(val) {
        window.ByteBuffer = this
        this._LITTLE_ENDIAN = val
    },
    configurable: true
})

// DEOBFUSCATE APP.JS AND PIXI OBJECT GLOBAL
new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === "BODY") {
                    let pixiScript = document.createElement("script")
                    pixiScript.src = "https://pixijs.download/v7.4.0/pixi.js"
                    document.body.appendChild(pixiScript)
                }
                if (node.src) {
                    if (node.src.includes("/asset/app.js")) {
                        node.src = "https://zombia-src.glitch.me/app.js"
                        fetch("https://zombia-src.glitch.me/version.txt").then(res=>res.text()).then(data=>{
                            if (data !== document.getElementsByClassName("hud-intro-footer-center")[0].children[document.getElementsByClassName("hud-intro-footer-center")[0].children.length-1].innerText.split("Version ")[1]) {
                                alert("Incompatable client, use at your own risk.")
                            }
                        })
                    }
                }
            })
        }
    }
}).observe(document, {childList: true, subtree: true})

// setup for decode functionality
function buffersEqual(buf1, buf2) {
    if (!buf2) return false

    buf1 = new Uint8Array(buf1)
    buf2 = new Uint8Array(buf2)

    if (buf1.length !== buf2.length) return false

    for (let i=0; i < buf1.length; i++) {
        if (buf1[i] !== buf2[i]) {
            return false
        }
    }
    return true
}

let propTypes = {
    "aimingYaw": "Uint16",
    "aggroEnabled": "Boolean",
    "dead": "Boolean",
    "entityClass": "String",
    "experience": "Uint16",
    "firingTick": "Uint32",
    "hatName": "String",
    "health": "Uint16",
    "hits": "ArrayUint32",
    "targetBeams": "ArrayUint32",
    "lastPlayerDamages": "ArrayUint32",
    "lastPetDamage": "Uint16",
    "lastPetDamageTarget": "Uint16",
    "lastPetDamageTick": "Uint32",
    "lastDamagedTick": "Uint32",
    "maxHealth": "Uint16",
    "gold": "Uint32",
    "model": "String",
    "name": "String",
    "partyId": "Uint32",
    "petUid": "Uint64",
    "position": "Vector2",
    "resourceType": "String",
    "score": "Uint32",
    "stone": "Uint32",
    "tier": "Uint16",
    "tokens": "Uint32",
    "wave": "Uint32",
    "weaponName": "String",
    "weaponTier": "Uint16",
    "wood": "Uint32",
    "yaw": "Varint32",
    "zombieShieldHealth": "Float",
    "zombieShieldMaxHealth": "Float",
    "colour": "ZombieColour",
    "scale": "Uint8",
    "invulnerable": "Boolean"
}

let propTypesArr = Object.keys(propTypes)
let modelProps;
let lpUids = {}
let keInstances = {}

function decodePacket(packet, wsId, lpUid) {
    let customKE = typeof wsId === "object"

    let buffer = ByteBuffer.wrap(packet)
    buffer.littleEndian = true
    let opcode = buffer.readUint8()
    let decodedRes;

    function dew(a) {
        if (a.readUint8()) {
            return {
                allowed: true,
                name: a.readVString(),
                uid: a.readUint16(),
                tickRate: a.readUint16(),
                startingTick: a.readUint32(),
                x: a.readUint16(),
                y: a.readUint16(),
                minimumBuildDistanceFromWall: a.readUint8(),
                maxFactoryBuildDistance: a.readUint8(),
                maxPlayerBuildDistance: a.readUint8(),
                maxPlayerPartyLimit: a.readUint8()
            };
        } else {
            return {
                allowed: false,
                reason: a.readVString()
            };
        }
    }

    function deu(a) {
        const b = game.network.currentTickNumber
        const c = a.readVarint32();
        for (let b = 0; b < c; b++) {
            let b = a.readUint16();
            (!customKE ? delete keInstances[wsId][b] : false)
        }
        const d = a.readVarint32();
        const e = {};
        for (let b = 0; b < d; b++) {
            const b = a.readUint16();
            const c = Object.values(modelProps)[a.readUint8()];
            e[b] = {
                uid: b,
                model: c.name,
                entityClass: c.entityClass
            };
            if (b == (customKE ? lpUid : lpUids[wsId])) {
                for (const d of c.privateProps) {
                    const c = propTypes[d];
                    dea(e, b, a, d, c);
                }
            } else {
                for (const d of c.props || c.publicProps) {
                    const c = propTypes[d];
                    dea(e, b, a, d, c);
                }
            }
        }
        let f = [];
        let g = a.readVarint32();
        let h = Object.keys((customKE ? wsId : keInstances[wsId]));
        for (let b = 0; b < g; b++) {
            let c = a.readUint8();
            for (let a = 0; a < 8; a++) {
                let d = c & 1;
                c >>= 1;
                if (d === 0 && h[b * 8 + a] !== undefined) {
                    f.push(parseInt(h[b * 8 + a]));
                } else if (d === 1) {
                    e[parseInt(h[b * 8 + a])] = true;
                }
            }
        }
        f.sort((a, b) => a - b);
        for (const b of f) {
            e[b] = {};
            const c = a.readUint8();
            for (let d = 0; d < c; d++) {
                const c = propTypesArr[a.readUint8()];
                const d = propTypes[c];
                dea(e, b, a, c, d);
            }
        }
        const i = a.readUint16() / 100;
        (!customKE ? keInstances[wsId] = e : false)
        return {
            tick: b,
            entities: e,
            averageServerFrameTime: i,
            byteSize: a.capacity()
        };
    }

    function dea(a, b, c, d, e) {
        let f = ["Grey", "Green", "Blue"];
        switch (e) {
            case "Boolean":
                a[b][d] = !!c.readUint8();
                break;
            case "Uint32":
                a[b][d] = c.readUint32();
                break;
            case "Int32":
                a[b][d] = c.readInt32();
                break;
            case "Float":
                a[b][d] = c.readFloat();
                break;
            case "String":
                a[b][d] = c.readVString();
                break;
            case "ZombieColour":
                a[b][d] = f[c.readUint8()];
                break;
            case "Vector2":
                a[b][d] = {
                    x: c.readUint16(),
                    y: c.readUint16()
                };
                break;
            case "ArrayVector2":
                {
                    let e = c.readInt32();
                    let f = [];
                    for (var g = 0; g < e; g++) {
                        var h = c.readInt32() / 100;
                        var i = c.readInt32() / 100;
                        f.push({
                            x: h,
                            y: i
                        });
                    }
                    a[b][d] = f;
                }
                break;
            case "ArrayUint32":
                {
                    let e = c.readUint16();
                    let f = [];
                    for (g = 0; g < e; g++) {
                        var j = c.readUint32();
                        f.push(j);
                    }
                    a[b][d] = f;
                }
                break;
            case "Uint16":
                a[b][d] = c.readUint16();
                break;
            case "Uint8":
                a[b][d] = c.readUint8();
                break;
            case "Int16":
                a[b][d] = c.readInt16();
                break;
            case "Int8":
                a[b][d] = c.readInt8();
                break;
            case "Uint64":
                a[b][d] = c.readUint64();
                break;
            case "Int64":
                a[b][d] = c.readInt64();
                break;
            case "Double":
                a[b][d] = c.readDouble();
                break;
            case "Varint32":
                a[b][d] = c.readVarint32();
                break;
            default:
                throw new Error("Unsupported attribute type: " + d);
        }
    }

    function drpc(a) {
        const b = {
            PartyKey: {
                partyKey: "String"
            },
            PartyBuilding: {
                isArray: true,
                dead: "Boolean",
                tier: "Uint16",
                type: "String",
                uid: "Uint32",
                x: "Uint32",
                y: "Uint32"
            },
            PartyRequest: {
                name: "String",
                uid: "Uint32"
            },
            PartyRequestCancelled: {
                uid: "Uint32"
            },
            PartyRequestMet: {},
            PartyMembersUpdated: {
                isArray: true,
                canPlace: "Boolean",
                canSell: "Boolean",
                name: "String",
                uid: "Uint32",
                isLeader: "Boolean"
            },
            UpdateParty: {
                isArray: true,
                isOpen: "Boolean",
                partyId: "Uint32",
                partyName: "String",
                memberCount: "Uint8",
                memberLimit: "Uint8"
            },
            UpdateLeaderboard: {
                isArray: true,
                uid: "Uint32",
                name: "String",
                score: "Uint64",
                wave: "Uint64",
                rank: "Uint8"
            },
            UpdateDayNightCycle: {
                nightLength: "Uint32",
                dayLength: "Uint32"
            },
            Respawned: {},
            SetTool: {
                isArray: true,
                toolName: "String",
                toolTier: "Uint8"
            },
            Dead: {
                reason: "String",
                wave: "Uint64",
                score: "Uint64",
                partyScore: "Uint64"
            },
            ToolInfo: {
                json: "String"
            },
            BuildingInfo: {
                json: "String"
            },
            SpellInfo: {
                json: "String"
            },
            BuySpellResponse: {
                name: "String",
                cooldown: "Uint32",
                iconCooldown: "Uint32"
            },
            ClearActiveSpell: {
                name: "String"
            },
            EntityData: {
                json: "String"
            },
            ModelProps: {
                json: "String"
            },
            Failure: {
                failure: "String"
            },
            ReceiveChatMessage: {
                channel: "String",
                name: "String",
                message: "String"
            }
        };
        const c = Object.keys(b)[a.readUint8()];
        const d = b[c];
        const e = {
            name: c,
            response: {}
        };
        if (d.isArray === true) {
            const b = [];
            const c = a.readUint16();
            for (let e = 0; e < c; e++) {
                let c = {};
                for (let b in d) {
                    if (b == "isArray") {
                        continue;
                    }
                    let e;
                    switch (d[b]) {
                        case "Uint8":
                            e = a.readUint8();
                            break;
                        case "Uint16":
                            e = a.readUint16();
                            break;
                        case "Uint32":
                            e = a.readUint32();
                            break;
                        case "Uint64":
                            e = a.readUint64();
                            break;
                        case "String":
                            e = a.readVString();
                            break;
                        case "Boolean":
                            e = !!a.readUint8();
                            break;
                        default:
                            throw new Error("Unknown RPC type: " + JSON.stringify(d));
                    }
                    c[b] = e;
                }
                b.push(c);
            }
            e.response = b;
        } else {
            for (let b in d) {
                if (b == "isArray") {
                    continue;
                }
                let c;
                switch (d[b]) {
                    case "Uint8":
                        c = a.readUint8();
                        break;
                    case "Uint16":
                        c = a.readUint16();
                        break;
                    case "Uint32":
                        c = a.readUint32();
                        break;
                    case "Uint64":
                        c = a.readUint64();
                        break;
                    case "String":
                        c = a.readVString();
                        break;
                    case "Boolean":
                        c = !!a.readUint8();
                        break;
                    default:
                        throw new Error("Unknown RPC type: " + JSON.stringify(d));
                }
                if (e.name === "ModelProps") {
                    modelProps = JSON.parse(c)
                }
                e.response[b] = c;
            }
        }
        return e;
    }

    switch (opcode) {
        case 4:
            decodedRes = dew(buffer)
            lpUids[wsId] = decodedRes.uid
            keInstances[wsId] = {}
            break
        case 0:
            decodedRes = deu(buffer)
            break
        case 9:
            decodedRes = drpc(buffer)
            break
        case 7:
            decodedRes = {}
    }
    decodedRes.opcode = opcode
    return decodedRes
}

Object.defineProperty(Object.prototype, "ui", {
    get() {
        if (!window.game) {
            // GAME OBJECT GLOBAL
            window.game = this

            // CUSTOM FUNCTIONALITY TO DECODE
            let lastPacket;
            let lastId;
            let lastResponse;
            game.network.decode = function(origDecode) {
                return function(packet, id=-1, lpUid) { // -1 means localplayer, 0-infinity is any socket manually sent
                    let opcode = new Uint8Array(packet)[0]

                    //if decoded by appjs, its a "real" packet. this means ctn needs to be updated. if its not from appjs it could or could not be a real packet and its impossible to know
                    let caller = "https://"+Error().stack.split("https://")[Error().stack.split("https://").length-1].split(":")[0]
                    if (caller === "https://zombia.io/app.js" || caller === "https://zombia-src.glitch.me/app.js") {
                        opcode === 0 ? game.network.currentTickNumber++ : false
                    }

                    if (!buffersEqual(packet, lastPacket)) { // if its a new packet that needs to be decoded with the stored knownentities from last tick
                        lastPacket = packet
                        lastId = id
                        lastResponse = decodePacket(packet, id, lpUid)

                        // return uid to each entity
                        if (opcode === 0) {
                            for (let uid in lastResponse.entities) {
                                if (typeof lastResponse.entities[uid] === "object") {
                                    lastResponse.entities[uid].uid = Number(uid)
                                }
                            }
                        }
                        return lastResponse
                    } else if (id === lastId) { // if its the same packet that doesnt need to be decoded because knownentities is alr updated from the current tick and would break
                        return lastResponse
                    } else { // if its the same packet but from another ws, same as first one
                        lastPacket = packet
                        lastId = id
                        lastResponse = decodePacket(packet, id, lpUid)

                        // return uid to each entity
                        if (opcode === 0) {
                            for (let uid in lastResponse.entities) {
                                lastResponse.entities[uid].uid = Number(uid)
                            }
                        }
                        return lastResponse
                    }
                }
            }(game.network.decode)
        }
        return this._ui
    },
    set(val) {
        this._ui = val
    },
    configurable: true
})