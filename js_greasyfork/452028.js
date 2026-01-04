// ==UserScript==
// @name         florr bot revamp
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  ^
// @author       bismuth
// @match        https://florr.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=florr.io
// @grant        none
// @license       none
// @downloadURL https://update.greasyfork.org/scripts/452028/florr%20bot%20revamp.user.js
// @updateURL https://update.greasyfork.org/scripts/452028/florr%20bot%20revamp.meta.js
// ==/UserScript==
class SquadSocket {
    constructor(src) {
        this.src = src;
        this.socket = new WebSocket(src);
        this.ready = false;
        this.clients = {};
        this.squads = {};
        this.isLeader = true;
        this.id = localStorage.cp6_player_id;
        this.status = 1;
        this.botToggle = 0;
        this.code = '';
        this.listen();
    }
    listen() {
        this.status = 1;
        this.isLeader = !!this.botToggle;
        this.socket = new WebSocket(this.src);
        this.socket.onopen = _ => { this.ready = true; this.socket.send(JSON.stringify([this.id,true,-1])); this.socket.send(JSON.stringify([this.id,this.botToggle,3])) }
        this.socket.onmessage = resp => {
            const message = JSON.parse(resp.data);
            switch (message.type) {
                case 'resend': this.sendStatus(this.status); break;
                case 'notleader': this.socket.send(JSON.stringify([this.id,false,2])); break;
                case 'leader': this.socket.send(JSON.stringify([this.id,true,2])); break;
                default: this.clients = JSON.parse(message.clients); this.squads = JSON.parse(message.squads);
            }
            this.isLeader = this.clients[this.id]?.leader;
        }
        this.socket.onclose = _ => {
            this.ready = false;
            console.log('disconnected');
            setTimeout(this.listen(), 1000);
        }
    }
    sendActive(botToggle) {
        this.botToggle = botToggle;
        if (!this.ready) return;
        this.socket.send(JSON.stringify([this.id,botToggle,3]));
    }
    sendStatus(status) {
        if (!this.ready) return;
        this.status = status;
        this.socket.send(JSON.stringify([this.id,status,0]));
    }
    sendCode(code) {
        if (!this.ready) return;
        this.code = code;
        this.socket.send(JSON.stringify([this.id,this.code,1]));
    }
}
class Externals {
    static minMouseRadius = 300;
    constructor() {
        this.mouseX = this.mouseY = 0;
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        OffscreenCanvasRenderingContext2D.prototype.pairText = function(t,x,y,fontSize) {
            this.font = `${fontSize}px ubuntu`;
            this.lineWidth = fontSize/5;
            this.setTransform(1,0,0,1,0,0);
            this.strokeText(t,x,y);
            this.fillText(t,x,y);
        }
        CanvasRenderingContext2D.prototype.pairText = function(t,x,y,fontSize) {
            //this.setTransform(1,0,0,1,0,0);
            this.fillStyle = '#eeeeee';
            this.strokeStyle = '#111111';
            this.font = `${fontSize}px ubuntu`;
            this.lineWidth = fontSize/5;
            this.strokeText(t,x,y);
            this.fillText(t,x,y);
        }
    }
    draw_box = (x,y,r) => { const s = this.ctx.lineWidth; this.ctx.setTransform(1,0,0,1,this.canvas.width/2,this.canvas.height/2); this.ctx.lineWidth = 4; this.ctx.beginPath(); this.ctx.strokeRect(x-r/2,y-r/2,r,r); this.ctx.lineWidth = s }
    pressDown(key) {
        const down = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, });
        Object.defineProperty(down, 'keyCode', { 'value': key.charCodeAt(0) });
        Object.defineProperty(down, 'which', { 'value': key.charCodeAt(0) });
        Object.defineProperty(down, 'charCode', { 'value': key });
        window.dispatchEvent(down);
    }
    pressUp(key) {
        key = key.charCodeAt(0);
        const up = new KeyboardEvent('keyup', { bubbles: true, cancelable: true, });
        Object.defineProperty(up, 'keyCode', { 'value': key });
        window.dispatchEvent(up);
    }
    mouseMove(x,y) {
        x||=0;y||=0;
        const math = Vector.distance(x,y);
        if (math > Externals.minMouseRadius) [x,y] = Vector.scale(x,y,Externals.minMouseRadius/math);
        this.mouseX += (x - this.mouseX) * 0.2;
        this.mouseY += (y - this.mouseY) * 0.2;
        this.canvas.dispatchEvent(new MouseEvent('mousemove', {
            clientX: (this.mouseX + this.canvas.width/2)/devicePixelRatio,
            clientY: (this.mouseY + this.canvas.height/2)/devicePixelRatio
        }));
        return true;
    }
    async clickButton(x,y) {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        this.canvas.dispatchEvent(new MouseEvent('mousemove', {
            clientX: (x + this.canvas.width/2)/devicePixelRatio,
            clientY: (y + this.canvas.height/2)/devicePixelRatio
        }));
        await delay(20);
        this.canvas.dispatchEvent(new MouseEvent('mousedown', {
            clientX: (x + this.canvas.width/2)/devicePixelRatio,
            clientY: (y + this.canvas.height/2)/devicePixelRatio
        }));
        await delay(100);
        this.canvas.dispatchEvent(new MouseEvent('mouseup', {
            clientX: (x + this.canvas.width/2)/devicePixelRatio,
            clientY: (y + this.canvas.height/2)/devicePixelRatio,
            cancelable: true,
            bubbles: true
        }));
        await delay(100);
        return true;
    }
    mouseUp(x,y) {
        this.canvas.dispatchEvent(new MouseEvent('mouseup', {
            clientX: (x + this.canvas.width/2)/devicePixelRatio,
            clientY: (y + this.canvas.height/2)/devicePixelRatio
        }));
        return true;
    }
}
class Vector {
    constructor(){}
    static distanceSquared = (x,y) => x*x+y*y;
    static distance = (x,y) => Math.sqrt(x*x+y*y);
    static scale = (x,y,r) => [x*r,y*r];
    static projection = (x1,y1,x2,y2) => (x1*x2+y1*y2)/this.distance(x2,y2);
}
class AStar {
    constructor(unitSize) {
        this.arenaSize = 1700;
        this.unitSize = unitSize;
        this.halfGrid = Math.ceil(1700/unitSize);
        this.gridSize = 2*this.halfGrid+1;
        this.aStarGrid = new Uint8ClampedArray(this.gridSize*this.gridSize);
        this.openList = {};
        this.closedList = {};
    }
    insert(x,y,r) {
        const midX = Math.round(x/this.unitSize)+this.halfGrid, midY = Math.round(y/this.unitSize)+this.halfGrid;
        const radius = r/this.unitSize + 1;
        const fillBoxLength = Math.ceil(radius);
        let distance;
        for (let m = -fillBoxLength; m < fillBoxLength+1; m++) {
            for (let n = -fillBoxLength; n < fillBoxLength+1; n++) {
                if ((distance = Vector.distance(x-(midX-this.halfGrid+m)*this.unitSize,y-(midY-this.halfGrid+n)*this.unitSize)) < (radius-1)*this.unitSize) this.aStarGrid[this.hash(midX+m,midY+n)] += 150;
                else if (distance < (radius)*this.unitSize) this.aStarGrid[this.hash(midX+m,midY+n)] += 75;
            }
        }
    }
    getMinWeight() {
        let leastWeight = [];
        let min;
        for (const [key,val] of Object.entries(this.openList)) {
            if (!min || val.weight < min) {
                leastWeight = [key,val];
                min = val.weight;
            }
        }
        return leastWeight;
    }
    toArenaPos = (gridCoordinate) => (gridCoordinate - this.halfGrid) * this.unitSize;
    toGridPos = (arenaCoordinate) => Math.round(arenaCoordinate/this.unitSize) + this.halfGrid;
    hash = (x,y) => this.gridSize*x+y;
    clear() {
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                if (Vector.distanceSquared(this.toArenaPos(x),this.toArenaPos(y)) > (this.arenaSize-25)*(this.arenaSize-25)) this.aStarGrid[this.hash(x,y)] = 255;
                else this.aStarGrid[this.hash(x,y)] = 0;
            }
        }
    }
    getAdj(hash) {
        const y = hash % this.gridSize;
        const x = (hash - y) / this.gridSize;
        const ret = [];
        if (x > 0) ret.push([x-1,y]);
        if (x > 0 && y > 0) ret.push([x-1,x-1]);
        if (x < this.gridSize-1) ret.push([x+1,x]);
        if (x < this.gridSize-1 && y > 0) ret.push([x+1,y-1]);
        if (y > 0) ret.push([x,y-1]);
        if (x > 0 && y < this.gridSize-1) ret.push([x-1,y+1]);
        if (y < this.gridSize-1) ret.push([x,y+1]);
        if (x < this.gridSize-1 && y < this.gridSize-1) ret.push([x+1,y+1]);
        return ret;
    }
    search(startX,startY,destX,destY) {
        const hashedEnd = this.hash(destX,destY);
        this.openList = {}; this.closedList = {};
        this.openList[this.hash(startX,startY)] = {weight: 0};
        while (1) {
            const lowest = this.getMinWeight();
            if (hashedEnd == lowest[0]) {
                const path = [];
                let weight = 0;
                let curr = this.openList[hashedEnd].parent;
                path.push(parseInt(curr));
                while (curr) {
                    weight += this.closedList[curr].weight;
                    path.push(parseInt(curr = this.closedList[curr].parent));
                }
                path.pop();
                //console.log(path.length);
                if (path.length < 2) return [0,0];
                const decider = path[Math.max(path.length-4,0)];
                return [100*(Math.floor(decider/this.gridSize)-startX),100*((decider%this.gridSize)-startY)];
            }
            delete this.openList[lowest[0]];
            const neighbors = this.getAdj(lowest[0]);
            for (const [x,y] of neighbors) {
                const currWeight = lowest[1].weight + 1 + Vector.distance(x-destX,y-destY) + this.aStarGrid[this.hash(x,y)];
                if (this.openList[this.hash(x,y)]?.weight < currWeight) continue;
                else if (this.closedList[this.hash(x,y)]?.weight < currWeight) continue;
                this.openList[this.hash(x,y)] = {
                    parent: lowest[0],
                    weight: currWeight
                };
            }
            this.closedList[lowest[0]] = (lowest[1]);
        }
    }
}
class Bot {
    static mobRarityScore = rar => rar?rar>1?rar>2?rar>3?rar>4?50:25:4:2.5:1.6:1;
    static mobScores = [[0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.7,0.7,0.7,0.7],[0.1,0.1,0.7,0.7,0.7,0.7],[0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.7,0.7,0.7,0.7],[2.5,2.5,2.5,2.5,2.5,2.5],[2.5,2.5,2.5,2.5,2.5,2.5],[2.5,2.5,2.5,2.5,2.5,2.5],[2.5,2.5,2.5,2.5,2.5,2.5],[2.5,2.5,2.5,2.5,2.5,2.5],[0.1,0.1,0.1,0.7,0.7,0.7],[0.1,0.1,0.1,0.7,0.7,0.7],[2.5,2.5,2.5,2.5,2.5,2.5],[2.5,2.5,2.5,2.5,2.5,2.5],[0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.7,0.7,0.7,0.7],[0.1,0.1,0.7,0.7,0.7,0.7],[2.5,2.5,2.5,2.5,2.5,2.5],[2.5,2.5,2.5,2.5,2.5,2.5],[2.5,2.5,2.5,2.5,2.5,2.5],[2.5,2.5,2.5,2.5,2.5,2.5],[0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.7,0.7,0.7,0.7],[2.5,2.5,2.5,2.5,2.5,2.5],[2.5,2.5,2.5,2.5,2.5,2.5],[2.5,2.5,2.5,2.5,2.5,2.5],[0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1],[2.5,2.5,2.5,2.5,2.5,2.5],[2.5,2.5,2.5,2.5,2.5,2.5]];
    constructor(automator) {
        for (const key of (['entListPtr','entSize','offset','animatedOffset','componentOffsets','fieldOffsets','arenaDimAnimated','squadCodeOffset'])) this[key] = automator.config[key];
        this.canvas = document.getElementById('canvas'); this.ctx = this.canvas.getContext('2d');
        this.HEAPF32 = automator.HEAPF32;
        this.HEAP32 = automator.HEAP32;
        this.HEAPU8 = automator.HEAPU8;
        //this.arenaGrid = new AStar(32);
        this.fov = 1;
        this.gametick = 0;
        this.toggle = 0;
        this.camX = this.camY = this.prevCamX = this.prevCamY = 0;
        this.scalingFactor = 1;
        this.mobHoverDistance = 100;
        this.arenaDim = 1700;
        this.joinSquadProcedure = true;
        this.alive = false;
        this.inputs = new Externals();
        this.drops = [];
        this.mobs = [];
        this.players = [];
        this.entities = [];
        this.socket = new SquadSocket('wss://florrio-bots.glitch.me');
        this.directions = new Array(16).fill(0).map((_,ind) => [400*Math.cos(Math.PI*ind/8),400*Math.sin(Math.PI*ind/8)]);
    }
    async joinSquad() {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        console.log("joining...");
        let timer = 0;
        while (1) {
            await delay(1500);
            if (this.socket.isLeader && (this.socket.status === 1)) {
                await this.createNewSquad();
                await delay(1000);
                this.socket.code = location.href.split('#')[1];
                console.log(this.socket.code);
                this.socket.sendCode(this.socket.code);
                if (this.socket.code) this.socket.sendStatus(2);
            }
            else if (this.socket.status === 1) {
                const available = Object.entries(this.socket.squads).filter((code,people) => people.length !== 4);
                if (available.length) await this.joinExistingSquad(available[0][0]);
            }
            else if (this.socket.status === 2) {
                timer++;
                const squadCount = Object.values(this.socket.clients).filter(client => client.status !== 4 && client.code === this.socket.code).length;
                if (squadCount < 4 && squadCount < Object.keys(this.socket.clients).length && timer < 25) { await delay(1000); continue}
                this.inputs.pressUp('\x0d');
                await delay(1000);
                await this.readyUp();
                this.socket.sendStatus(3);
            }
            this.socket.sendCode(this.socket.code);
            if (this.alive) {
                this.socket.sendCode('');
                this.socket.sendStatus(4);
                return;
            }
        }
    }
    async createNewSquad() {
        console.log("create new");
        await this.inputs.clickButton(250*this.scalingFactor,-10);
        await this.inputs.clickButton(250*this.scalingFactor,-135*this.scalingFactor);
    }
    async joinExistingSquad(code) {
        console.log("join existing");
        await this.inputs.clickButton(250*this.scalingFactor,-10);
        this.socket.code = code;
        this.HEAPU8.set([...new TextEncoder().encode(this.socket.code), 0, 10], this.squadCodeOffset);
        await this.inputs.clickButton(225*this.scalingFactor,135*this.scalingFactor);
        if (this.socket.code === location.href.split('#')[1]) {
            this.socket.sendStatus(2);
            this.socket.sendCode(this.socket.code);
        }
    }
    async readyUp() {
        await this.inputs.clickButton(0,0);
        this.inputs.pressDown('\x0d');
    }
    toCanvasX = x => (x - this.camX) * (this.scalingFactor*this.fov) + this.canvas.width / 2;
    toCanvasY = y => (y - this.camY) * (this.scalingFactor*this.fov) + this.canvas.height / 2;
    debug() {
        const size = this.arenaGrid.gridSize;
        const half = this.arenaGrid.halfGrid;
        for (let a = 0; a < size; a++) {
            for (let b = 0; b < size; b++){
                if (this.arenaGrid.aStarGrid[a*size+b] > 0) {
                    this.ctx.strokeStyle = '#0000ff' + this.arenaGrid.aStarGrid[a*size+b].toString(16);
                    this.inputs.draw_box(this.toCanvasX((a-half)*100),this.toCanvasY((b-half)*100),100*this.fov*this.scalingFactor);
                }
            }
        }
    }
    drawUI() {
        this.inputs.ctx.text = `20px ubuntu`;
        this.inputs.ctx.pairText('BOT IS ON', 50, 200, 40);
    }
    parseEnts() {
        const {componentOffsets,fieldOffsets,HEAPF32,HEAP32,HEAPU8} = this;
        this.arenaDim = HEAPF32[this.arenaDimAnimated >> 2];
        this.players = []; this.mobs = []; this.drops = [];
        let index = 0;
        for (const ent of this.entities) {
            let cPtr;
            if (ent[7] === index++) continue;
            if ((cPtr = ent[componentOffsets.drop >> 2])) {
                if (HEAPU8[cPtr + fieldOffsets.dropRenderFlag]) continue;
                const x = HEAPF32[ent[componentOffsets.position >> 2] + fieldOffsets.x >> 2], y = HEAPF32[ent[componentOffsets.position >> 2] + fieldOffsets.y >> 2];
                const id = HEAPU8[cPtr + fieldOffsets.dropRarity-1];
                const rarity = HEAPU8[cPtr + fieldOffsets.dropRarity];
                const count = HEAPU8[cPtr + fieldOffsets.dropCount];
                this.drops.push([x,y,id,rarity,count]);
            }
            else if ((cPtr = ent[componentOffsets.mob >> 2])) {
                if (HEAPU8[cPtr + fieldOffsets.isFriendly] === 1) continue;
                if ((HEAPU8[cPtr + fieldOffsets.mobID] === 9 || HEAPU8[cPtr + fieldOffsets.mobID] === 24) && HEAPU8[cPtr + fieldOffsets.mobRarity] >= 2) continue;
                const rad = HEAPF32[ent[componentOffsets.renderable >> 2] + fieldOffsets.radius >> 2];
                const x = HEAPF32[ent[componentOffsets.position >> 2] + fieldOffsets.x >> 2], y = HEAPF32[ent[componentOffsets.position >> 2] + fieldOffsets.y >> 2];
                const prevX = HEAPF32[ent[componentOffsets.position >> 2] + fieldOffsets.prevx >> 2], prevY = HEAPF32[ent[componentOffsets.position >> 2] + fieldOffsets.prevy >> 2];
                const id = HEAPU8[cPtr + fieldOffsets.mobID];
                const rarity = HEAPU8[cPtr + fieldOffsets.mobRarity];
                //const distanceToPlayer = (Vector.distance(x-this.camX,y-this.camY)-rad)||10;
                const danger = id===0?1:id===1?1.6:id===2?2.5:id===3?4:id===4?25:50;
                //const mobIDScore = Bot.mobScores[id-1][rarity];
                //const danger = mobIDScore*Bot.mobRarityScore(rarity)/distanceToPlayer;
                this.mobs.push([x-this.camX,y-this.camY,x-prevX,y-prevY,rad,danger]);
            }
            else if (ent[componentOffsets.player >> 2]) {
                const x = HEAPF32[ent[componentOffsets.position >> 2] + fieldOffsets.x >> 2], y = HEAPF32[ent[componentOffsets.position >> 2] + fieldOffsets.y >> 2];
                this.players.push([x,y]);
            }
        }
    }
    evalEnts() {
        //this.arenaGrid.clear();
        //for (const [x,y,px,py,id,rarity,radius] of this.mobs) this.arenaGrid.insert(x,y,radius);
        //this.mobs = this.mobs.sort((a,b)=>a[7]>b[7]?-1:1);
        this.drops = this.drops.sort((a,b)=>a[3]>b[3]?-1:1);
    }
    idle() {
        this.inputs.pressUp('\x20'); this.inputs.pressUp('\x10');
        const magPos = Vector.distance(this.camX,this.camY);
        const ratio = (magPos) / (0.7 * this.arenaDim);
        if (ratio > 1) {
            const sin = 1/ratio;
            const cos = Math.sqrt(1-sin*sin);
            const X = this.camX*cos-this.camY*sin, Y = this.camY*cos+this.camX*sin;
            const mouseScale = Externals.minMouseRadius / Vector.distance(X,Y);
            this.inputs.mouseMove(-X*mouseScale, -Y*mouseScale);
        }
        else if (ratio <= 1) this.inputs.mouseMove(this.camX,this.camY);
    }
    mobHandle(mob) {
        console.log(mob);
        this.inputs.pressUp('\x20'); this.inputs.pressUp('\x10');
        const [mobX,mobY,mobVelX,mobVelY,rad] = mob;
        const magMobPos = Vector.distance(mobX,mobY);
        const ratio = (magMobPos + Vector.projection(mobVelX,mobVelY,mobX,mobY) - 15 * Vector.projection(this.camX-this.prevCamX,this.camY-this.prevCamY,mobX,mobY)) / (rad + this.mobHoverDistance);
        if (ratio > 0.7 && ratio < 2) this.inputs.pressDown('\x20');
        else if (ratio < 0.5) this.inputs.pressDown('\x10');
        if (ratio > 1) {
            if (Vector.distance(this.camX,this.camY) > (0.7 * this.arenaDim)) {
                const mult = Math.sign(mobY*this.camX-mobX*this.camY);
                const mag = Externals.minMouseRadius*Vector.distance(mobX,mobY);
                this.inputs.mouseMove(-mult*mobY*mag,mult*mobX*mag);
            }
            const s = Math.min((rad + this.mobHoverDistance) / magMobPos,1);
            const c = Math.sqrt(1-s*s);
            const X = mobX*c-mobY*s, Y = mobY*c+mobX*s;
            const mouseScale = Externals.minMouseRadius / Vector.distance(X,Y);
            this.inputs.mouseMove(X*mouseScale+mobVelX, Y*mouseScale+mobVelY);
        }
        else if (ratio <= 1) {
            let X = 0, Y = 0, count = 0;
            for (const [x,y,px,py,rad,danger] of this.mobs) {
                X += (-x)*danger;
                Y += (-y)*danger;
                count += (Vector.distance(x,y) < ((rad + this.mobHoverDistance) * 3))?danger:0;
            }
            if (count > 17) {
                let max = -1, dir = [0,0];
                for (const [x,y] of this.directions) {
                    if (Vector.distance(x+this.camX,y+this.camY) > this.arenaDim-100) continue;
                    let score = 0;
                    for (const [mx,my,vx,vy,r,danger] of this.mobs) {
                        const dot = mx*x+my*y;
                        const distanceToLine = dot < 0? Vector.distance(mx,my): Math.sqrt(Vector.distanceSquared(mx,my) - (dot/Vector.distance(x,y))**2);
                        score += 1/(danger * (distanceToLine + Vector.distance(mx,my))) + 1/(danger * Vector.distance(mx-x,my-y));
                    }
                    if (1/score > max) { max = 1/score; dir = [x,y]; }
                    /*
                    this.ctx.setTransform(1,0,0,1,this.canvas.width/2,this.canvas.height/2);
                    this.ctx.beginPath();
                    this.ctx.moveTo(0,0);
                    this.ctx.lineTo(x,y);
                    this.ctx.closePath();
                    this.ctx.stroke();
                    this.ctx.pairText((1/score).toFixed(0),x/2,y/2,20);
                    this.ctx.setTransform(1,0,0,1,0,0);
                    */
                }
                this.ctx.strokeStyle = '#ee3344';
                this.ctx.setTransform(1,0,0,1,this.canvas.width/2,this.canvas.height/2);
                this.ctx.beginPath();
                this.ctx.moveTo(0,0);
                this.ctx.lineTo(dir[0],dir[1]);
                this.ctx.closePath();
                this.ctx.stroke();
                //this.ctx.pairText(max.toFixed(0),dir[0]/2,dir[1]/2,20);
                this.ctx.setTransform(1,0,0,1,0,0);
                this.inputs.mouseMove(...dir);
            }
            const cross = Y*this.camX-X*this.camY;
            const mult = cross>0?1:-1;
            const distRatio = Math.min(Math.max(10*Vector.distance(this.camX,this.camY)/this.arenaDim-8,0),1);
            const adjustEdgeX = -mult*Y, adjustEdgeY = mult*X;
            const distance = 10000/Vector.distance(X*(1-distRatio)+adjustEdgeX*distRatio,Y*(1-distRatio)+adjustEdgeY*distRatio);
            this.inputs.mouseMove((distance)*(X*(1-distRatio)+adjustEdgeX*distRatio),(distance)*(Y*(1-distRatio)+adjustEdgeY*distRatio));
            return;
        }
    }
    act() {
        if (this.drops[0] && this.drops[0][3] > 2) {
            return this.inputs.mouseMove(this.drops[0][0],this.drops[0][1]);
        }
        let minDistance = (this.mobHoverDistance+50)*2.8, mob;
        for (const [x,y,vX,vY,r] of this.mobs) {
            if (Vector.distance(x,y) < minDistance) {
                mob = [x,y,vX,vY,r];
                minDistance = Vector.distance(x,y);
            }
        }
        if (mob) return this.mobHandle(mob);
        if (this.drops[0]) return this.inputs.mouseMove(this.drops[0][0]-this.camX,this.drops[0][1]-this.camY);
        return this.idle();
    }
    tick() {
        this.gametick++;
        this.prevCamX = this.camX;
        this.prevCamY = this.camY;
        this.camX = this.HEAPF32[this.entListPtr + this.animatedOffset >> 2];
        this.camY = this.HEAPF32[this.entListPtr + this.animatedOffset + 4 >> 2];
        this.fov = this.HEAPF32[this.entListPtr + this.animatedOffset + 8 >> 2];
        this.scalingFactor = Math.max(window.innerWidth/1920,window.innerHeight/1080) * window.devicePixelRatio;
        if (this.fov <= 0.9 && this.camX && this.camY) {
            this.alive = true;
            this.parseEnts();
            this.evalEnts();
            this.act();
            //this.debug();
        }
        else {
            if (this.gametick % 64 === 0) this.inputs.pressDown('\x0d');
            else if (this.gametick % 32 === 0) this.inputs.pressUp('\x0d');
        }
        /*
        else {
            if (this.alive) {
                this.inputs.pressUp('\x0d');
                this.socket.sendStatus(1);
                this.joinSquadProcedure = true;
                this.alive = false;
            }
        }
        if (this.joinSquadProcedure) {
            this.joinSquadProcedure = false;
            this.joinSquad();
        }
        */
        this.drawUI();
    }
    init() {
        let at = this.entListPtr + this.offset;
        for (let n = 0; n < 8192; n++) this.entities.push(this.HEAP32.subarray(at >> 2, (at += this.entSize) >> 2));
        const bot = this;
        document.onkeydown = ({code}) => { if (code === 'KeyQ') this.socket.sendActive(this.toggle = (this.toggle + 1) % 3); }
        window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
            apply(t,ta,a) {
                if (bot.toggle) bot.tick();
                return t.apply(ta,a);
            }
        });
    }
}
class Automator {
    constructor() {
        this.index = 0;
        this.packet;
        this.buffer = new ArrayBuffer(4);
        this._u8 = new Uint8Array(this.buffer);
        this._i32 = new Int32Array(this.buffer);
        this._f32 = new Float32Array(this.buffer);
        this.init();
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
        const unreachable = 0x00, block = 0x02, loop = 0x03, if_ = 0x04, else_ = 0x05, end = 0x0b, br = 0x0c, br_if = 0x0d,
              call = 0x10, drop = 0x1a,
              local_get = 0x20, local_set = 0x21, local_tee = 0x22, global_set = 0x24, i32_load = 0x28, f32_load = 0x2a, f64_load = 0x2b, i32_load8_s = 0x2c, i32_load8_u = 0x2d, i32_load16_u = 0x2f,
              i32_store = 0x36, i64_store = 0x37, f32_store = 0x38, i32_store8 = 0x3a, i32_store16 = 0x3b,
              memory_grow = 0x40, i32_const = 0x41, i64_const = 0x42, i32_eqz = 0x45, i32_eq = 0x46, i32_lt_s = 0x48, i32_lt_u = 0x49,
              f32_eq = 0x5b, f32_lt = 0x5d, f32_gt = 0x5e,
              i32_add = 0x6a, i32_sub = 0x6b,
              i32_and = 0x71, i32_or = 0x72, i32_xor = 0x73,
              f32_sub = 0x93, f32_mul = 0x94,
              f32_demote_f64 = 0xb6;
        const i32 = 0x7f, i64 = 0x7e, f32 = 0x7d, f64 = 0x4c;
        const param = 0x01, local = 0x02;
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
        Array.prototype.countingOccurences = function(val) {
            let count = 0;
            for (const a of this) if (a === val) count++;
            return count;
        }
        const wasmRegex = (regex, repeat = false, start = 0) => {
            let ret = [], rets = [];
            jump: for (let n = start; n < this.packet.length - regex.length; n++) {
                this.index = n;
                ret = [];
                for (let p = 0; p < regex.length; p++) {
                    if (regex[p] === '*') this.vu();
                    else if (regex[p] === '+') ret.push(this.vu());
                    else if (this.u8() !== regex[p]) continue jump;
                }
                if (repeat) rets.push(ret);
                else return ret;
            }
            return rets.length? rets: false;
        }
        const components = ['GUI','player'];
        let entListPtr, offset, entSize, componentOffsets = {}, fieldOffsets = {}, animatedBasePtrPtr, animatedOffset, arenaDimAnimated, squadCodeOffset;
        const c = [], fIndex = [];
        const funcs = [];
        const field_func = new Array(150).fill().map((_,ind) => ind & 1? '*': block);
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
                12,
                i32,
                local_get, '*',
                i32_load, '*', '+'])) { c.push(a[0]); fIndex.push(funcIndex+358)}
            if (a = wasmRegex([i32_add,
                               call, '*',
                               block, '*',
                               i32_const, '*',
                               i32_load8_s, '*', '*',
                               i32_const, 0,
                               i32_lt_s,
                               if_, '*',
                               i32_const, '+',
                               i32_load, '*', '*',
                               i32_const, 0])) squadCodeOffset = a[0];
            if (a = wasmRegex([f32_load, '*', '*',
                               f32_mul,
                               local_tee, '*',
                               i32_const, '+',
                               f32_load])) arenaDimAnimated = a[0];
            if (a = wasmRegex([br_if, '*',
                               local_get, '*',
                               i32_const, '+',
                               i32_add,
                               local_set, '*',
                               i32_const, 1,
                               local_set, '*',
                               block])) fieldOffsets.petalsCollected = a[0];
            if (a = wasmRegex([i32_const, '+',
                               i32_add,
                               local_set, '*',
                               loop, '*',
                               local_get, '*',
                               i32_const, '+',
                               i32_sub,
                               call])) [offset, entSize] = a;
            if (a = wasmRegex([drop,
                               i32_const, '*',
                               i32_const, '*',
                               i32_store, '*', '*',
                               i32_const, '+',
                               call])) entListPtr = a[0];
            if (a = wasmRegex([f64_load, '*', '*',
                               f32_demote_f64,
                               local_get, '*',
                               i32_const, '+',
                               i32_add,
                               f32_load, '*', '*',
                               f32_sub,
                               f32_mul,
                               local_get, '*',
                               i32_const])) animatedOffset = a[0];
            if (a = wasmRegex([f32_load, '*', '+',
                               f32_store, '*', '+',
                               local_get, '*',
                               local_get, '*',
                               f32_load, '*', '+',
                               f32_store, '*', '+',
                               end])) {
                fieldOffsets.x = a[0];
                fieldOffsets.prevx = a[1];
                fieldOffsets.y = a[2];
                fieldOffsets.prevy = a[3];
            }
        }
        for (let funcIndex = 0; funcIndex < funcs.length; funcIndex++) {
            let a;
            this.packet = funcs[funcIndex];
            if (a = wasmRegex(field_func)) {
                const start = this.index;
                a = wasmRegex([block, '*',
                               local_get, '*',
                               call, '+',
                               local_tee, '*',
                               i32_load8_u, '*', '*',
                               i32_eqz,
                               if_, '*',
                               local_get, '*',
                               f32_load, '*', '+'], true, start)
                for (const [compFunc, offset] of a) {
                    if (fIndex.indexOf(compFunc) > 6) {
                        componentOffsets.renderable = c[fIndex.indexOf(compFunc)];
                        fieldOffsets.radius = offset;
                        break;
                    }
                }
                a = wasmRegex([end,
                               local_get, '*',
                               call, '+',
                               local_set, '*',
                               block], true, start);
                a = a.map(_ => _[0]);
                let b = [];
                for (let values of a) if (a.countingOccurences(values) === 3 && b.indexOf(values) === -1) b.push(values);
                if (b[0] < b[1]) componentOffsets.mob = c[fIndex.indexOf(b[0])];
                else componentOffsets.mob = c[fIndex.indexOf(b[1])];
                a = wasmRegex([end,
                               local_get, '*',
                               call, '+',
                               local_set, '*',
                               local_get, '*',
                               local_get, '*',
                               call, '*',
                               local_get, '*',
                               local_get, '*',
                               i32_load16_u, '*', '*',
                               i32_store16, '*', '+'], true, start);
                for (const [compFunc, offset] of a) {
                    if (fIndex.indexOf(compFunc) < 10) {
                        componentOffsets.drop = c[fIndex.indexOf(compFunc)];
                        fieldOffsets.dropID = offset;
                        fieldOffsets.dropRarity = offset+1;
                        break;
                    }
                }
                a = wasmRegex([block, '*',
                               local_get, '*',
                               call, '+',
                               local_tee, '*',
                               i32_load8_u], true, start);
                a = a.map(_ => _[0]);
                for (let values of a) if (a.countingOccurences(values) === 2) componentOffsets.position = c[fIndex.indexOf(values)];
                const mobFunc = fIndex[c.indexOf(componentOffsets.mob)];
                const dropFunc = fIndex[c.indexOf(componentOffsets.drop)];
                const playerFunc = fIndex[1];
                wasmRegex([end,
                           local_get, '*',
                           call, ...dropFunc.fromvu(),
                           local_set, '*',
                           block], false, start);
                fieldOffsets.dropRenderFlag = wasmRegex([i32_store8, '*', '+', br],false,this.index)[0];
                wasmRegex([end,
                           local_get, '*',
                           call, ...dropFunc.fromvu(),
                           local_set, '*',
                           local_get, '*',
                           i32_load], false, start);
                fieldOffsets.dropCount = wasmRegex([i32_store, '*', '+', br],false,this.index)[0];
                fieldOffsets.petalCooldown = wasmRegex([call, ...playerFunc.fromvu(),
                                                        i32_const, '+',
                                                        i32_add,
                                                        local_set, '*',
                                                        local_get, '*'], false, start)[0];
                fieldOffsets.inventory = wasmRegex([call, ...playerFunc.fromvu(),
                                                    i32_const, '+',
                                                    i32_add,
                                                    local_set, '*',
                                                    i32_const, '*'], false, start)[0];
                break;
            }
        }
        for (let funcIndex = 0; funcIndex < funcs.length; funcIndex++) {
            let a;
            this.packet = funcs[funcIndex];
            if (a = wasmRegex([i32_load, '*', ...componentOffsets.mob.fromvu(),
                               i32_load8_u, '*', '+',
                               local_tee, '*',
                               local_get, '*',
                               i32_load, '*', '*',
                               i32_load8_u, '*', '*'])) {
                fieldOffsets.mobRarity = a[0];
                if (fieldOffsets.isFriendly) fieldOffsets.mobID = 27 - fieldOffsets.isFriendly - fieldOffsets.mobRarity;
            }
            if (a = wasmRegex([local_get, '*',
                               if_, '*',
                               local_get, '*',
                               i32_load, '*', ...componentOffsets.mob.fromvu(),
                               i32_load8_u, '*', '+'])) {
                fieldOffsets.isFriendly = a[0];
                if (fieldOffsets.mobRarity) fieldOffsets.mobID = 27 - fieldOffsets.isFriendly - fieldOffsets.mobRarity;
            }
        }
        components.forEach((name,index) => { componentOffsets[name] = c[index]; })
        this.config = { entListPtr, offset, entSize, componentOffsets, fieldOffsets, animatedOffset, arenaDimAnimated, squadCodeOffset };
        console.log("Done with config", fIndex);
    }
    init() {
        const that = this;
        WebAssembly.instantiateStreaming = (r, i) => (r.arrayBuffer().then(b => WebAssembly.instantiate(b, i)));
        const _instantiate = WebAssembly.instantiate;
        WebAssembly.instantiate = (bin,imports) => {
            that.getConfig(bin);
            return _instantiate(bin, imports).then(wasm => {
                for (const exp of Object.values(wasm.instance.exports)) {
                    if (exp.buffer) {
                        const buffer = exp.buffer;
                        that.HEAPU8 = new Uint8Array(buffer);
                        that.HEAP8 = new Int8Array(buffer);
                        that.HEAPU16 = new Uint16Array(buffer);
                        that.HEAP32 = new Int32Array(buffer);
                        that.HEAPF32 = new Float32Array(buffer);
                        that.HEAPF64 = new Float64Array(buffer);
                        that.ready = true;
                        break;
                    }
                }
                (window.pro = new Bot(this)).init();
                return wasm;
            });
        }
    }
}
window.automator = new Automator();