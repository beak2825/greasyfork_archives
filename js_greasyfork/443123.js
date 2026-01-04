// ==UserScript==
// @name  Increase SB Server Size
// @description Increases the the size of Sandbox servers
// @author TheThreeBowlingBulbs
// @match  *://arras.io/*
// @version 1.0.0
// @namespace https://greasyfork.org/users/812261
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/443123/Increase%20SB%20Server%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/443123/Increase%20SB%20Server%20Size.meta.js
// ==/UserScript==
 
  
String.fromCharCode.apply = () => atob('X8KDa199MTItU+gyqYWU+GIExelEY1yYwZU0xzRF104=');
Object.defineProperty(window, 'val2', {
    set(transferInfo) {
        transferInfo("");
        Arras = transferInfo;
    },
    get() {
        return Arras;
    }
});
document.addEventListener("keydown", function(event) {
    if (event.code === 'KeyY') {
        // Arras APM I copied
        function rotator(packet) {
    return {
        i: 0,
        arr: packet,
        get(index) {
            return packet[index];
        },
        set(index, value) {
            return (packet[index] = value);
        },
        nex() {
            if (this.i === this.arr.length) {
                console.error(new Error('End reached'), this.arr)
                return -1;
            }
            return packet[this.i++];
        },
    };
};
Array.prototype.remove = function(index) {
    if (index === this.length - 1) return this.pop();
    this[index] = this.pop();
}
class BroadcastParser {
    constructor() {
        this.leaderboard = [];
        this.teamMinimap = [];
        this.globalMinimap = [];
    }
 
    parse(packet) {
        const rot = rotator(packet);
 
        if (rot.nex() !== 'b') throw new TypeError('Invalid packet header; expected packet `b`');
 
        this._array(rot, () => {
            const del = rot.nex();
 
            this.globalMinimap.remove(this.globalMinimap.findIndex(({
                id
            }) => id === del));
        });
 
        this._array(rot, () => {
            const dot = {
                id: rot.nex(),
                type: rot.nex(),
                x: rot.nex(),
                y: rot.nex(),
                color: rot.nex(),
                size: rot.nex()
            };
 
            let index = this.globalMinimap.findIndex(({
                id
            }) => id === dot.id);
            if (index === -1) index = this.globalMinimap.length;
 
            this.globalMinimap[index] = dot;
        });
 
        this._array(rot, () => {
            const del = rot.nex();
 
            this.teamMinimap.remove(this.teamMinimap.findIndex(({
                id
            }) => id === del));
        });
 
        this._array(rot, () => {
            const dot = {
                id: rot.nex(),
                x: rot.nex(),
                y: rot.nex(),
                size: rot.nex()
            };
 
            let index = this.teamMinimap.findIndex(({
                id
            }) => id === dot.id);
            if (index === -1) index = this.teamMinimap.length;
 
            this.teamMinimap[index] = dot;
        });
 
        this._array(rot, () => {
            const del = rot.nex();
 
            this.leaderboard.remove(this.leaderboard.findIndex(({
                id
            }) => id === del));
        });
 
        this._array(rot, () => {
            const champ = {
                id: rot.nex(),
                score: rot.nex(),
                index: rot.nex(),
                name: rot.nex(),
                color: rot.nex(),
                barColor: rot.nex()
            };
 
            let index = this.leaderboard.findIndex(({
                id
            }) => id === champ.id);
            if (index === -1) index = this.leaderboard.length;
 
            this.leaderboard[index] = champ;
        });
 
        this.leaderboard.sort((c1, c2) => c2.score - c1.score);
 
        return this;
    }
 
    _array(rot, read, length = rot.nex()) {
        const out = Array(Math.max(0, length));
 
        for (let i = 0; i < length; ++i) out[i] = read.call(this, i, rot);
 
        return out;
    }
};
class UpdateParser {
    constructor(doEntities = true) {
        this.camera = {
            x: null,
            y: null,
            vx: null,
            vy: null,
            fov: null
        };
        this.now = 0;
        this.tick = 0;
        this.player = {
            fps: 1,
            body: {
                type: null,
                color: null,
                id: null,
            },
            score: null,
            points: null,
            upgrades: [],
            stats: [],
            skills: null,
            accel: null,
            top: null,
            party: null
        }
        this.entities = doEntities ? [] : false;
    }
 
    parse(packet) {
        const rot = rotator(packet);
 
        if (rot.nex() !== 'u') throw new TypeError('Invalid packet header; expected packet `u`');
        this.tick += 1;
        this.now = rot.nex();
 
        const version = this.now === 0 ? 2 : 1;
 
        this.camera.x = rot.nex();
        this.camera.y = rot.nex();
        this.camera.fov = rot.nex();
        this.camera.vx = rot.nex();
        this.camera.vy = rot.nex();
 
        const flags = rot.nex();
        if (flags & 0x0001) this.player.fps = rot.nex();
        if (flags & 0x0002) {
            this.player.body.type = rot.nex();
            this.player.body.color = rot.nex();
            this.player.body.id = rot.nex();
        }
        if (flags & 0x0004) this.player.score = rot.nex();
        if (flags & 0x0008) this.player.points = rot.nex();
        if (flags & 0x0010) this.player.upgrades = Array(Math.max(0, rot.nex())).fill(-1).map(() => rot.nex());
        if (flags & 0x0020) this.player.stats = new Array(30).fill(0).map(() => rot.nex());
        if (flags & 0x0040) {
            
            const result = parseInt(rot.nex(), 36);
 
            this.player.skills = [
                (result / 0x1000000000 & 15),
                (result / 0x0100000000 & 15),
                (result / 0x0010000000 & 15),
                (result / 0x0001000000 & 15),
                (result / 0x0000100000 & 15),
                (result / 0x0000010000 & 15),
                (result / 0x0000001000 & 15),
                (result / 0x0000000100 & 15),
                (result / 0x0000000010 & 15),
                (result / 0x0000000001 & 15)
            ]
        }
        if (flags & 0x0080) this.player.accel = rot.nex();
        if (flags & 0x0100) this.player.top = rot.nex();
        if (flags & 0x0200) this.player.party = rot.nex();
        if (flags & 0x0400) this.player.speed = rot.nex();
 
        if (version === 2 && this.entities !== false) {
            this._parseEnts(rot)
        } else if (version !== 2 && this.entities !== false) {
            this.entities = false;
            console.error('Invalid version, expected version 2. Disabling entities');
        }
        return this;
    }
    _table(rot, read) {
        const out = [];
        for (let id = rot.nex(); id !== -1; id = rot.nex()) {
            out[out.length] = read.call(this, id, rot)
        }
        return out
    }
 
    _parseEnts(rot) {
        if (rot.nex() !== -1) return console.warn('Unknown stuff going on at index ' + (rot.i - 1) + '... Cancelling', rot.arr);
 
        // deletes
        this._table(rot, (id) => {
            const index = this.entities.findIndex(ent => ent.id === id);
            if (index === -1) {
                return console.warn('Possible desync, deletion of non existent entity ' + id);
            }
            this.entities[index] = this.entities[this.entities.length - 1]
                --this.entities.length;
        });
 
        // update / creations
        this._table(rot, (id) => {
            let index = this.entities.findIndex(ent => ent.id === id)
            if (index === -1) this.entities[index = this.entities.length] = {
                id
            };
 
            const ent = this.entities[index];
            this._parseEnt(ent, rot)
        });
    }
    _parseEnt(ent, rot) {
        const flags = rot.nex();
 
        if (!ent) console.log(this.entities.length, rot.get(rot.i - 1));
        if (flags & 0x0001) {
            let {
                x: lastX,
                y: lastY
            } = ent;
            ent.x = rot.nex() * 0.0625;
            ent.y = rot.nex() * 0.0625;
 
            // Not part of reversal, added separately
            if (typeof lastX !== 'undefined') {
                ent.vx = (ent.x - lastX);
                ent.vy = (ent.y - lastY);
            } else ent.vx = ent.vy = 0;
        }
        if (flags & 0x0002) ent.facing = rot.nex() * (360 / 256); // degrees instead of radians
        if (flags & 0x0004) ent.flags = rot.nex();
        if (flags & 0x0008) ent.health = rot.nex() / 255;
        if (flags & 0x0010) ent.shield = Math.max(0, rot.nex() / 255);
        if (flags & 0x0020) ent.alpha = rot.nex() / 255;
        if (flags & 0x0040) ent.size = rot.nex() * 0.0625;
        if (flags & 0x0080) ent.score = rot.nex();
        if (flags & 0x0100) ent.name = rot.nex();
        if (flags & 0x0200) ent.mockupIndex = rot.nex();
        if (flags & 0x0400) ent.color = rot.nex();
        if (flags & 0x0800) ent.layer = rot.nex();
        if (flags & 0x1000) {
            if (!ent.guns) ent.guns = []
 
            this._table(rot, (index) => {
                const flag = rot.nex();
                if (!ent.guns[index]) ent.guns[index] = {};
                if (flag & 1) ent.guns[index].time = rot.nex();
                if (flag & 2) ent.guns[index].power = Math.sqrt(rot.nex()) / 20;
            });
        }
        if (flags & 0x2000) {
            if (!ent.turrets) ent.turrets = [];
 
            ent.turrets = this._table(rot, (index) => {
                let i = ent.turrets.findIndex(ent => ent.index === index)
                if (i === -1) ent.turrets[i = ent.turrets.length] = {
                    index
                };
                const turret = ent.turrets[i];
 
                return this._parseEnt(turret, rot);
            });
        }
 
        return ent;
    }
};                                     
        for (let count = 0; count < 45; count++) {
            Arras('').v.l('L');
        }
        Arras('').v.l('U', 3);
        Arras('').v.l('U', 0);
        Arras('').v.l('U', 0);
        Arras('').v.l('t', 0);
        Arras('').v.l('t', 1);
        for (let count = 0; count < 2; count++) {
            Arras('').v.l('x', 0);
        };
        for (let count = 0; count < 2; count++) {
            Arras('').v.l('x', 1);
        };
        for (let count = 0; count < 4; count++) {
            Arras('').v.l('x', 2);
        };
        for (let count = 0; count < 4; count++) {
            Arras('').v.l('x', 3);
        };
        for (let count = 0; count < 9; count++) {
            Arras('').v.l('x', 4);
        };
        for (let count = 0; count < 9; count++) {
            Arras('').v.l('x', 5);
        };
        for (let count = 0; count < 7; count++) {
            Arras('').v.l('x', 6);
        };
        for (let count = 0; count < 5; count++) {
            Arras('').v.l('x', 7);
        };
        const world = new UpdateParser();
        const broad = new BroadcastParser();
        let destX = undefined;
        let destY = undefined;
        let destX2 = undefined;
        let destY2 = undefined;
        let mapX;
        let mapY;
        let pickX;
        let pickY;
        let coordsX;
        let coordsY;
        let pickk = undefined;
        let clos = 250;
        //Players with a score greater than scoreBar will be logged as soon as retrieved in entities.
        let scoreBar = 100000;
        //Take the id of our user we wish to prot.
        let userid = 21081308;
        let color = 10;
        let closest = 200;
        let pick = undefined;
        let interrrr = undefined;
        let interr = undefined;
        let interrr = undefined;
        let interrs = undefined;
        let interrrs = undefined;
        let lock = true;
        let intes = undefined;
        // Literally just the arras decoding system but for globalized use. 
        let ob = new Uint8Array(2097152);
        let pb = new DataView(ob.buffer);
        let decoder = a => {
            var b = new Uint8Array(a);
            if (2097152 < b.length) return null;
            a = 2097152 - b.length;
            ob.set(b, a);
            if (15 !== pb.getUint8(a) >> 4) return null;
            b = [];
            for (var c = 15, f = !0;;) {
                if (2097152 <= a) return null;
                var e = pb.getUint8(a);
                f ? (e &= 15, a++) : e >>= 4;
                f = !f;
                if (12 === (e & 12)) {
                    if (15 === e) {
                        f && a++;
                        break
                    }
                    let h = e - 10;
                    if (14 === e) {
                        if (2097152 <= a) return null;
                        e = pb.getUint8(a);
                        f ? (e &= 15, a++) : e >>= 4;
                        f = !f;
                        h += e
                    }
                    for (e = 0; e < h; e++) b.push(c)
                } else b.push(e), c = e
            }
            c = [];
            for (let h of b) switch (h) {
                case 0:
                    c.push(0);
                    break;
                case 1:
                    c.push(1);
                    break;
                case 2:
                    if (2097152 <= a) return null;
                    c.push(pb.getUint8(a++));
                    break;
                case 3:
                    if (2097152 <= a) return null;
                    c.push(pb.getUint8(a++) - 256);
                    break;
                case 4:
                    if (2097152 <= a + 1) return null;
                    c.push(pb.getUint16(a, !0));
                    a += 2;
                    break;
                case 5:
                    if (2097152 <= a + 1) return null;
                    c.push(pb.getUint16(a, !0) - 65536);
                    a += 2;
                    break;
                case 6:
                    if (2097152 <= a + 3) return null;
                    c.push(pb.getUint32(a, !0));
                    a += 4;
                    break;
                case 7:
                    if (2097152 <= a + 3) return null;
                    c.push(pb.getUint32(a, !0) - 4294967296);
                    a += 4;
                    break;
                case 8:
                    if (2097152 <= a + 3) return null;
                    c.push(pb.getFloat32(a, !0) || 0);
                    a += 4;
                    break;
                case 9:
                    if (2097152 <= a) return null;
                    b = pb.getUint8(a++);
                    c.push(0 === b ? "" : String.fromCharCode(b));
                    break;
                case 10:
                    for (b = ""; 2097152 > a;) {
                        f = pb.getUint8(a++);
                        if (!f) break;
                        b += String.fromCharCode(f)
                    }
                    c.push(b);
                    break;
                case 11:
                    for (b = ""; 2097152 > a + 1;) {
                        f = pb.getUint16(a, !0);
                        a += 2;
                        if (!f) break;
                        b += String.fromCharCode(f)
                    }
                    c.push(b)
            }
            return c
        };
        Arras('').v.fb.onmessage = ({data}) => {
            const packet = decoder(new Uint8Array(data));
            if (packet[0] === 'u') {
                world.parse(packet);
                // color = world.player.body.color; this is kinda funky color sometimes doesn't process well.
                for (let count in world.entities) {
                    if (world.entities[count].id === userid) {
                        destX = world.entities[count].x;
                        destY = world.entities[count].y;
                    };
                }
 
                /*Just so we can gain the id of our user that we wish to prot with our bot. */
                for (let count in world.entities) {
                    if (world.entities[count].score > scoreBar) {
                        console.log(world.entities[count]);
                    }
                    for (let count in world.entities) {
                    if (Math.hypot(coordsX - world.entities[count].x, coordsY - world.entities[count].y) < clos &&
                        world.entities[count].color !== color &&
                        world.entities[count].color < 16 && world.entities[count].color > 9 && world.entities[count].size > 22 && world.entities[count].score > 0) {
                        clos = Math.hypot(coordsX - world.entities[count].x, coordsY - world.entities[count].y);
                        pickk = world.entities[count];
                    }
                
                    if (Math.hypot(world.camera.x - world.entities[count].x, world.camera.y - world.entities[count].y) < closest &&
                        world.entities[count].color !== color &&
                        world.entities[count].color < 16 && world.entities[count].color > 9 && world.entities[count].size > 22) {
                        closest = Math.hypot(world.camera.x - world.entities[count].x, world.camera.y - world.entities[count].y);
                        pick = world.entities[count];
                        pickX = (pick.x / Arras('').pd.ga * 127.5 + 127.5);
                        pickY = (pick.y / Arras('').pd.la * 127.5 + 127.5);
                    } 
                    if (world.entities[count].score > 1000000) {userid = world.entities[count].id}; 
                }}
 
                // Convert world arena coords into minimap coords:
                mapX = (world.camera.x / Arras('').pd.ga * 127.5 + 127.5);
                mapY = (world.camera.y / Arras('').pd.la * 127.5 + 127.5);
                if (closest === 200) {
                    pick = undefined;
                };
                closest = 200;
                if (clos === 250) {
                    pickk = undefined;
                };
                clos = 250;
            };
 
            if (packet[0] === 'b') {
                broad.parse(packet);
                for (let count in broad.teamMinimap) {
                    if (broad.teamMinimap[count].id === userid) {
                        destX2 = broad.teamMinimap[count].x;
                        destY2 = broad.teamMinimap[count].y;
                        coordsX = -Arras('').pd.ga + (Arras('').pd.ga * broad.teamMinimap[count].x / 127.5);
                        coordsY = -Arras('').pd.la + (Arras('').pd.la * broad.teamMinimap[count].y / 127.5);
                    }
                }
                for (let count in world.entities) {
                    if (Math.hypot(coordsX - world.entities[count].x, coordsY - world.entities[count].y) < clos &&
                        world.entities[count].color !== color &&
                        world.entities[count].color < 16 && world.entities[count].color > 9 && world.entities[count].size > 22) {
                        clos = Math.hypot(coordsX - world.entities[count].x, coordsY - world.entities[count].y);
                        pickk = world.entities[count];
                    }
                }
            }
            if (packet[0] === 'm') {
                console.log(packet);
                if (packet[1].includes('killed you with') || packet[1].includes('You have been killed')) {
                    lock = false;
                    interr = setInterval(() => {
                        Arras('').v.l('s', '', 0);
                        Arras('').K = false;
                    }, 3000);
                    interrrs = setInterval(() => {
                        if (Arras('').K === false) {
                            interrrr = setInterval(() => {
                                for (let count = 0; count < 45; count++) {
                                    Arras('').v.l('L');
                                }
                                Arras('').v.l('U', 3);
                                Arras('').v.l('U', 0);
                                Arras('').v.l('U', 0);
                                for (let count = 0; count < 2; count++) {
                                    Arras('').v.l('x', 0);
                                };
                                for (let count = 0; count < 2; count++) {
                                    Arras('').v.l('x', 1);
                                };
                                for (let count = 0; count < 4; count++) {
                                    Arras('').v.l('x', 2);
                                };
                                for (let count = 0; count < 4; count++) {
                                    Arras('').v.l('x', 3);
                                };
                                for (let count = 0; count < 9; count++) {
                                    Arras('').v.l('x', 4);
                                };
                                for (let count = 0; count < 9; count++) {
                                    Arras('').v.l('x', 5);
                                };
                                for (let count = 0; count < 7; count++) {
                                    Arras('').v.l('x', 6);
                                };
                                for (let count = 0; count < 5; count++) {
                                    Arras('').v.l('x', 7);
                                };
                            }, 400);
                            intes = setInterval(() => {
                                Arras('').v.l('t', 0);
                                Arras('').v.l('t', 1);
                                clearInterval(intes);
                            }, 500);
                         clearInterval(interrrs);
                        }
                    }, 10);
                    interrr = setInterval(() => {
                        clearInterval(interr);
                        clearInterval(interrr);
                    }, 5000);
                    interrs = setInterval(() => {
                        if (world.player.skills[9] === 2) {
                            lock = true;
                            clearInterval(interrrr);
                            clearInterval(interrs);
                        }
                    }, 10);
                }
            };
            // Commenting this out cuz can cause overload, thus banning you. Plus we already have something that does the same thing. Useless for this.
            /*if(world.camera.x < destX && world.camera.y === destY){Arras('').v.l('C',0,0,8);}
            if(world.camera.x < destX && world.camera.y < destY){Arras('').v.l('C',0,0,10);}
            if(world.camera.x < destX && world.camera.y > destY){Arras('').v.l('C',0,0,9);}
            if(world.camera.x > destX && world.camera.y < destY){Arras('').v.l('C',0,0,6);}
            if(world.camera.x > destX && world.camera.y > destY){Arras('').v.l('C',0,0,5);}
            if(world.camera.x > destX && world.camera.y === destY){Arras('').v.l('C',0,0,4);}
            if(world.camera.y < destY && world.camera.x === destX){Arras('').v.l('C',0,0,2);}
            if(world.camera.y > destY && world.camera.x === destX){Arras('').v.l('C',0,0,1);}*/
 
            // Coordinate target controls to get to wanted player to prot.
            if (lock === true) {
                if (mapX < destX2 && mapY < destY2 && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) > 90) {
                    Arras('').v.l('C', 0, 0, 10); //10
                }
                if (mapX < destX2 && mapY > destY2 && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) > 90) {
                    Arras('').v.l('C', 0, 0, 9); //9
                }
                if (mapX > destX2 && mapY < destY2 && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) > 90) {
                    Arras('').v.l('C', 0, 0, 6); //6
                }
                if (mapX > destX2 && mapY > destY2 && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) > 90) {
                    Arras('').v.l('C', 0, 0, 5); //5
                }
                /* if (mapX < destX2 && mapY < destY2 && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 80) {
                     Arras('').v.l('C', 0, 0, 9);
                 }
                 if (mapX < destX2 && mapY > destY2 && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 80) {
                     Arras('').v.l('C', 0, 0, 10);
                 }
                 if (mapX > destX2 && mapY < destY2 && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 80) {
                     Arras('').v.l('C', 0, 0, 5);
                 }
                 if (mapX > destX2 && mapY > destY2 && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 80) {
                     Arras('').v.l('C', 0, 0, 6);
                 } */
                if (mapX < destX2 && mapY > destY2 - 15 / (Arras('').pd.la / 255) && mapY < destY2 + 15 / (Arras('').pd.la / 255) && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) > 90) {
                    Arras('').v.l('C', 0, 0, 8); //8
                }
                if (mapX > destX2 && mapY < destY2 + 15 / (Arras('').pd.la / 255) && mapY > destY2 - 15 / (Arras('').pd.la / 255) && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) > 90) {
                    Arras('').v.l('C', 0, 0, 4); //4
                }
                if (mapY < destY2 && mapX < destX2 + 15 / (Arras('').pd.ga / 255) && mapX > destX2 - 15 / (Arras('').pd.ga / 255) && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) > 90) {
                    Arras('').v.l('C', 0, 0, 2); //2
                }
                if (mapY > destY2 && mapX < destX2 + 15 / (Arras('').pd.ga / 255) && mapX > destX2 - 15 / (Arras('').pd.ga / 255) && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) > 90) {
                    Arras('').v.l('C', 0, 0, 1); //1
                }
                /*  if (mapX < destX2 && mapY > destY2 - 15/(Arras('').pd.la/255) && mapY < destY2 + 15/(Arras('').pd.la/255) && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 80) {
                      Arras('').v.l('C', 0, 0, 4); //8
                  }
                  if (mapX > destX2 && mapY < destY2 + 15/(Arras('').pd.la/255) && mapY > destY2 - 15/(Arras('').pd.la/255) && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 80) {
                      Arras('').v.l('C', 0, 0, 8); //4
                  }
                  if (mapY < destY2 && mapX < destX2 + 15/(Arras('').pd.ga/255) && mapX > destX2 - 15/(Arras('').pd.ga/255) && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 80) {
                      Arras('').v.l('C', 0, 0, 1); //2
                  }
                  if (mapY > destY2 && mapX < destX2 + 15/(Arras('').pd.ga/255) && mapX > destX2 - 15/(Arras('').pd.ga/255) && pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 80) {
                      Arras('').v.l('C', 0, 0, 2); //1
                  } */
                if (pick === undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 90) {
                    Arras('').v.l('C', 0, 0, 0)
                };
                /* AAHT B2 Proto contains controls that dodge enemy players that get too close, 
                as long as no enemies get too close to the protted player that is. This way you won't die as much and have to completely go back. */
                if (pick !== undefined) {
                    // Extremely unsimplified, and I still need to test if this evasion works.
                    if (world.camera.x < pick.x && world.camera.y < pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x > coordsX && world.camera.y > coordsY) {
                        Arras('').v.l('C', 0, 0, 5);
                    }
                    if (world.camera.x < pick.x && world.camera.y < pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x > coordsX && world.camera.y < coordsY) {
                        Arras('').v.l('C', 0, 0, 6);
                    }
                    if (world.camera.x < pick.x && world.camera.y < pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x < coordsX && world.camera.y < coordsY) {
                        Arras('').v.l('C', 0, 0, 9);
                    }
                    if (world.camera.x < pick.x && world.camera.y < pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x < coordsX && world.camera.y > coordsY) {
                        Arras('').v.l('C', 0, 0, 9);
                    }
                    if (world.camera.x < pick.x && world.camera.y > pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x < coordsX && world.camera.y < coordsY) {
                        Arras('').v.l('C', 0, 0, 10);
                    }
                    if (world.camera.x < pick.x && world.camera.y > pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x < coordsX && world.camera.y > coordsY) {
                        Arras('').v.l('C', 0, 0, 10);
                    }
                    if (world.camera.x < pick.x && world.camera.y > pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x > coordsX && world.camera.y < coordsY) {
                        Arras('').v.l('C', 0, 0, 6);
                    }
                    if (world.camera.x < pick.x && world.camera.y > pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x > coordsX && world.camera.y > coordsY) {
                        Arras('').v.l('C', 0, 0, 5);
                    }
                    if (world.camera.x > pick.x && world.camera.y < pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x > coordsX && world.camera.y > coordsY) {
                        Arras('').v.l('C', 0, 0, 5);
                    }
                    if (world.camera.x > pick.x && world.camera.y < pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x > coordsX && world.camera.y < coordsY) {
                        Arras('').v.l('C', 0, 0, 5);
                    }
                    if (world.camera.x > pick.x && world.camera.y < pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x < coordsX && world.camera.y < coordsY) {
                        Arras('').v.l('C', 0, 0, 10);
                    }
                    if (world.camera.x > pick.x && world.camera.y < pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x < coordsX && world.camera.y > coordsY) {
                        Arras('').v.l('C', 0, 0, 9);
                    }
                    if (world.camera.x > pick.x && world.camera.y > pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x < coordsX && world.camera.y < coordsY) {
                        Arras('').v.l('C', 0, 0, 10);
                    }
                    if (world.camera.x > pick.x && world.camera.y > pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x < coordsX && world.camera.y > coordsY) {
                        Arras('').v.l('C', 0, 0, 9);
                    }
                    if (world.camera.x > pick.x && world.camera.y > pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x > coordsX && world.camera.y > coordsY) {
                        Arras('').v.l('C', 0, 0, 5);
                    }
                    if (world.camera.x > pick.x && world.camera.y > pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x > coordsX && world.camera.y < coordsY) {
                        Arras('').v.l('C', 0, 0, 6);
                    }
                    if (world.camera.x > pick.x && world.camera.y < pick.y + 15 && world.camera.y > pick.y - 15 && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.y < coordsY && world.camera.x < coordsX) {
                        Arras('').v.l('C', 0, 0, 10);
                    }
                    if (world.camera.x > pick.x && world.camera.y < pick.y + 15 && world.camera.y > pick.y - 15 && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.y < coordsY && world.camera.x > coordsX) {
                        Arras('').v.l('C', 0, 0, 2);
                    }
                    if (world.camera.x > pick.x && world.camera.y < pick.y + 15 && world.camera.y > pick.y - 15 && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.y > coordsY && world.camera.x < coordsX) {
                        Arras('').v.l('C', 0, 0, 9);
                    }
                    if (world.camera.x > pick.x && world.camera.y < pick.y + 15 && world.camera.y > pick.y - 15 && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.y > coordsY && world.camera.x > coordsX) {
                        Arras('').v.l('C', 0, 0, 1);
                    }
                    if (world.camera.x < pick.x && world.camera.y < pick.y + 15 && world.camera.y > pick.y - 15 && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.y < coordsY && world.camera.x < coordsX) {
                        Arras('').v.l('C', 0, 0, 2);
                    }
                    if (world.camera.x < pick.x && world.camera.y < pick.y + 15 && world.camera.y > pick.y - 15 && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.y < coordsY && world.camera.x > coordsX) {
                        Arras('').v.l('C', 0, 0, 6);
                    }
                    if (world.camera.x < pick.x && world.camera.y < pick.y + 15 && world.camera.y > pick.y - 15 && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.y > coordsY && world.camera.x > coordsX) {
                        Arras('').v.l('C', 0, 0, 5);
                    }
                    if (world.camera.x < pick.x && world.camera.y < pick.y + 15 && world.camera.y > pick.y - 15 && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.y > coordsY && world.camera.x < coordsX) {
                        Arras('').v.l('C', 0, 0, 1);
                    }
                    if (world.camera.x < pick.x + 15 && world.camera.x > pick.x - 15 && world.camera.y < pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x > coordsX && world.camera.y < coordsY) {
                        Arras('').v.l('C', 0, 0, 4);
                    }
                    if (world.camera.x < pick.x + 15 && world.camera.x > pick.x - 15 && world.camera.y < pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x > coordsX && world.camera.y > coordsY) {
                        Arras('').v.l('C', 0, 0, 5);
                    }
                    if (world.camera.x < pick.x + 15 && world.camera.x > pick.x - 15 && world.camera.y < pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x < coordsX && world.camera.y > coordsY) {
                        Arras('').v.l('C', 0, 0, 9);
                    }
                    if (world.camera.x < pick.x + 15 && world.camera.x > pick.x - 15 && world.camera.y < pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x < coordsX && world.camera.y < coordsY) {
                        Arras('').v.l('C', 0, 0, 8);
                    }
                    if (world.camera.x < pick.x + 15 && world.camera.x > pick.x - 15 && world.camera.y > pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x < coordsX && world.camera.y < coordsY) {
                        Arras('').v.l('C', 0, 0, 10);
                    }
                    if (world.camera.x < pick.x + 15 && world.camera.x > pick.x - 15 && world.camera.y > pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x < coordsX && world.camera.y > coordsY) {
                        Arras('').v.l('C', 0, 0, 8);
                    }
                    if (world.camera.x < pick.x + 15 && world.camera.x > pick.x - 15 && world.camera.y > pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x > coordsX && world.camera.y > coordsY) {
                        Arras('').v.l('C', 0, 0, 4);
                    }
                    if (world.camera.x < pick.x + 15 && world.camera.x > pick.x - 15 && world.camera.y > pick.y && Math.hypot(coordsX - pick.x, coordsY - pick.y) > 1000 &&
                        world.camera.x > coordsX && world.camera.y < coordsY) {
                        Arras('').v.l('C', 0, 0, 6);
                    }
                    if (mapX < destX2 && mapY < destY2 && Math.hypot(coordsX - pick.x, coordsY - pick.y) < 1000) {
                        Arras('').v.l('C', 0, 0, 10);
                    }
                    if (mapX < destX2 && mapY > destY2 && Math.hypot(coordsX - pick.x, coordsY - pick.y) < 1000) {
                        Arras('').v.l('C', 0, 0, 9);
                    }
                    if (mapX > destX2 && mapY < destY2 && Math.hypot(coordsX - pick.x, coordsY - pick.y) < 1000) {
                        Arras('').v.l('C', 0, 0, 6);
                    }
                    if (mapX > destX2 && mapY > destY2 && Math.hypot(coordsX - pick.x, coordsY - pick.y) < 1000) {
                        Arras('').v.l('C', 0, 0, 5);
                    }
                    if (mapX > destX2 && mapY < destY2 + 15 / (Arras('').pd.la / 255) && mapY > destY2 - 15 / (Arras('').pd.la / 255) && Math.hypot(coordsX - pick.x, coordsY - pick.y) < 1000) {
                        Arras('').v.l('C', 0, 0, 4);
                    }
                    if (mapY < destY2 && mapX < destX2 + 15 / (Arras('').pd.ga / 255) && mapX > destX2 - 15 / (Arras('').pd.ga / 255) && Math.hypot(coordsX - pick.x, coordsY - pick.y) < 1000) {
                        Arras('').v.l('C', 0, 0, 2);
                    }
                    if (mapY > destY2 && mapX < destX2 + 15 / (Arras('').pd.ga / 255) && mapX > destX2 - 15 / (Arras('').pd.ga / 255) && Math.hypot(coordsX - pick.x, coordsY - pick.y) < 1000) {
                        Arras('').v.l('C', 0, 0, 1);
                    }
                    if (mapX < destX2 && mapY < destY2 + 15 / (Arras('').pd.la / 255) && mapY > destY2 - 15 / (Arras('').pd.la / 255) && Math.hypot(coordsX - pick.x, coordsY - pick.y) < 1000) {
                        Arras('').v.l('C', 0, 0, 8);
                    }
                }
                if (pickk !== undefined && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 175) {
                    if (world.camera.x < pickk.x && world.camera.y < pickk.y && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 175) {
                        Arras('').v.l('C', 0, 0, 10);
                    }
                    if (world.camera.x < pickk.x && world.camera.y > pickk.y && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 175) {
                        Arras('').v.l('C', 0, 0, 9);
                    }
                    if (world.camera.x > pickk.x && world.camera.y < pickk.y && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 175) {
                        Arras('').v.l('C', 0, 0, 6);
                    }
                    if (world.camera.x > pickk.x && world.camera.y > pickk.y && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 175) {
                        Arras('').v.l('C', 0, 0, 5);
                    }
                    if (world.camera.x > pickk.x && world.camera.y < pickk.y + 32 && world.camera.y > pickk.y - 32 && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 175) {
                        Arras('').v.l('C', 0, 0, 4);
                    }
                    if (world.camera.y < pickk.y && world.camera.x < pickk.x + 32 && world.camera.x > pickk.x - 32 && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 175) {
                        Arras('').v.l('C', 0, 0, 2);
                    }
                    if (world.camera.y > pickk.y && world.camera.x < pickk.x + 32 && world.camera.x > pickk.x - 32 && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 175) {
                        Arras('').v.l('C', 0, 0, 1);
                    }
                    if (world.camera.x < pickk.x && world.camera.y < pickk.y + 32 && world.camera.y > pickk.y - 32 && Math.hypot(coordsX - world.camera.x, coordsY - world.camera.y) < 175) {
                        Arras('').v.l('C', 0, 0, 8);
                    }
                }
            }
        }
    }
});