// ==UserScript==
// @name         BumpyBall Unlimiter
// @name:ru      BumpyBall Unlimiter
// @description  Every server is Super Server!
// @description:ru  Каждый сервер это Супер Сервер!
// @author       0vC4
// @version      3.2
// @namespace    https://greasyfork.org/users/670183-exnonull
// @match        http://www.pucks.io/
// @match        https://www.pucks.io/
// @match        http://www.bumpyball.io/
// @match        https://www.bumpyball.io/
// @icon         https://www.google.com/s2/favicons?domain=bumpyball.io
// @run-at       document-start
// @grant        none
// @license      MIT
// @require      https://greasyfork.org/scripts/438620-workertimer/code/WorkerTimer.js
// @require      https://greasyfork.org/scripts/448029-rblu/code/RBLU.js
// @downloadURL https://update.greasyfork.org/scripts/433235/BumpyBall%20Unlimiter.user.js
// @updateURL https://update.greasyfork.org/scripts/433235/BumpyBall%20Unlimiter.meta.js
// ==/UserScript==

//hello from O

document.addEventListener('DOMContentLoaded', e => document.body.style.overflow = 'hidden');
window.logout = () => {
    window.indexedDB.databases().then(d=>d[2]).then(d=>window.indexedDB.deleteDatabase(d.name))
};
// try { window.logout(); } catch (e) {}



const r7bit = arr => {let r=0,e=0;for(;35!=e;){let f=arr[e/7];if(r|=(127&f)<<e,0==(128&f))return[r,e/7+1];e+=7}};
const int7 = (arr, start) => {
    let [value, bytes] = r7bit(arr.slice(start));
    return [value, start+bytes];
};
const float = (arr, start) => {
    let value = new Float32Array(new Uint8Array(arr.slice(start, start+4)).buffer)[0]
    return [value, start+4];
};
const w7bit = num => {let r=[];for(;num>=128;num>>=7)r.push((128|num)%256);return r.push(num%256),r};



const client = window.client = {
    bots: [],
    num: 15,
    team: 2,
    enabled: false,
    chatEnabled: false,
    moveEnabled: true,

    antiAfk: WorkerTimer.setInterval(()=>{
        const hiddenForward = new Uint8Array([8,7,18,10,18,5,13,0,0,128,63,24,200,1]).buffer;
        if (client.ws && client.ws.readyState === 1 && client.ws.id > -1) client.ws._send(hiddenForward);
        client.bots.forEach(b => {
            if (b.readyState === 1 && b.id > -1) b._send(hiddenForward);
        });
    }, 1000),

    sendMessage(text='') {
        if (!this.ws || !this.ws.constId) return;
        const msg = new TextEncoder().encode(text);
        const body = [8,...w7bit(this.ws.constId), 18,...w7bit(msg.length),...msg];
        const head = [8,5, 18,...w7bit(body.length)];
        const data = new Uint8Array([...head, ...body]);
        this.ws.send(data);
    },

    bot(num=15, team=2){
        this.team = team;
        this.num = num;
        return this.enabled = !this.enabled
    },

    move(on = null){
        if (on == null) return this.moveEnabled = !this.moveEnabled;
        return this.moveEnabled = !!on;
    },

    chatBot(on = null){
        if (on == null) return this.chatEnabled = !this.chatEnabled;
        return this.chatEnabled = !!on;
    },

    // 0 - blue, 1 - red
    close(team=2){
        this.bots.forEach(b=>{
            if (team === 2 || team === b.team) {
                WorkerTimer.clearInterval(b.inter);
                b.close();
            }
        });

        this.bots = this.bots.filter(b => team !== b.team);
        if (team === 2) this.bots = [];
    },

    setup(data, num=this.num){
        if (!this.ws.url || !this.enabled) return false;
        for(;num--;){
            WorkerTimer.setTimeout(()=>{
                const ws = new WebSocket(this.ws.url);
                this.bots.push(ws);
                ws.query = [data];
                ws.onopen=function(){
                    ws.inter = WorkerTimer.setInterval(()=>{
                        if (!ws.query.length) return;
                        let data = [...new Uint8Array(ws.query.shift())];
                        ws.send(new Uint8Array(data).buffer);
                    }, 17);
                }
            }, 57*num);
        }
    }
};



const packet = {};
packet.open = (arr, pos=0) => {
    packet.cancel = false;
    packet.arr = arr;
    packet.value = undefined;
    packet.pos = pos;
    return packet;
}
packet.null = () => {
    packet.cancel = true;
    packet.value = null;
    return packet;
}
packet.len = () => {
    if (packet.cancel) return packet;
    let {arr, pos, value} = packet;

    if (arr[pos++] !== 10) return packet.null();
    [value, pos] = int7(arr, pos);

    return Object.assign(packet, {pos, value});
}
packet.code = () => {
    if (packet.cancel) return packet;
    let {arr, pos, value} = packet;

    if (arr[pos++] !== 8) return packet.null();
    [value, pos] = int7(arr, pos);

    return Object.assign(packet, {pos, value});
}
packet.player = () => {
    if (packet.cancel) return packet;
    let {arr, pos, value} = packet;

    let data = {
        id: null,
        constId: null,
        team: null,
        x: null,
        z: null
    };

    if (arr[pos++] !== 10) return packet.null();
    [value, pos] = int7(arr, pos);

    if (arr[pos++] !== 8) return packet.null();
    if (arr[pos++] !== 8) return packet.null();

    if (arr[pos++] !== 18) return packet.null();
    [value, pos] = int7(arr, pos);

    if (arr[pos++] !== 16) return packet.null();
    [value, pos] = int7(arr, pos);
    data.id = value;

    if (arr[pos++] !== 26) return packet.null();
    [value, pos] = int7(arr, pos);

    if (arr[pos++] !== 10) return packet.null();
    [value, pos] = int7(arr, pos);

    if (arr[pos++] !== 13) return packet.null();
    [value, pos] = float(arr, pos);
    data.x = value;

    if (arr[pos++] !== 21) return packet.null();
    [value, pos] = float(arr, pos);
    data.z = value;

    if (arr[pos++] !== 24) return packet.null();
    [value, pos] = int7(arr, pos);
    data.constId = value;

    if (arr[pos] === 42) { //42,0
        data.team = 0;
        pos += 2;
        packet.value = data;
        return Object.assign(packet, {pos});
    }

    //37,219,15,73,192, 42,0
    data.team = 1;
    pos += 5+2;
    packet.value = data;
    return Object.assign(packet, {pos});
}
packet.players = () => {
    if (packet.cancel) return packet;
    let {arr, pos, value} = packet;
    const players = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== 10) continue;
        packet.pos = i;
        let data = packet.player().value;
        if (data === null) {
            packet.cancel = false;
            continue;
        }
        players.push(data);
        i = packet.pos-1;
    }

    packet.value = players;
    return packet;
}



const isConnected = arr => {
    packet.open(arr);
    const code = packet.len().code().value;
    if (code === null) return false;
    if (code === 3) return true;
    return false;
}
const isJoinOther = arr => {
    packet.open(arr);
    const code = packet.len().code().value;
    if (code === null) return false;
    if (code === 2) return true;
    return false;
}
const isSpawn = arr => {
    packet.open(arr);
    const code = packet.len().code().value;
    if (code === null) return false;
    if (code === 8) return packet.player().value;
    return false;
}



const getId = arr => {
    // 10,x, 8,8,18,x, 16,id, 26,x, 10,10,13,... ,0,42];
    if (isConnected(arr)) return packet.id(arr).value;
    if (isJoinOther(arr)) return null;
    if (isSpawn(arr)) return packet.id(arr).value;
}
window.r7bit = r7bit;
window.w7bit = w7bit;
window.getId = getId;


(()=>{
    const proto = WebSocket.prototype;
    proto._send = proto.send;
    proto.send = function (data) {
        if (!this.event) {
            this.event = true;
            this.addEventListener('message', async function(e){
                const data = [...new Uint8Array(await e.data.arrayBuffer())];
                const players = packet.open(data).players().value;
                if (players == null) return;

                if (players.length) {
                    if (this.constId == null) Object.assign(this, players[0]);
                    const player = players.find(p => p.constId === this.constId);
                    if (player) Object.assign(this, player);
                }

                if (client.team !== 2 && client.bots.every(b => b.team > -1)) client.close(+(!client.team));
            });
        }

        if (!client.ws) {
            client.ws = this;
            this.addEventListener('close', e=>{
                delete client.ws;
                client.close();
            });
            this.own = true;
            client.setup(data);
        }

        if (this.own) {
            const d = [...new Uint8Array(data)];
            let move = false;
            let packet = d;

            if (
                (d[0]==8&&d[1]==7&&d[2]==18) // move
            ) {
                move = true;
                packet = d.slice(0, d.length-w7bit(this.id||0).length);
            }

            if (
                client.moveEnabled&&
                !(!client.chatEnabled&&d[0]==8&&d[1]==5&&d[2]==18) // chat
            ) {
                client.bots.forEach(b=>{
                    if (move && b.id == null) return;
                    if (b.readyState===3) return;
                    if (b.readyState!==1) return b.query.push(packet);
                    if (move) b.send(new Uint8Array([...packet, ...w7bit(b.id)]));
                    else b.send(new Uint8Array(packet));
                })
            }
        }

        //if (this.own) console.log('own', new Uint8Array(data));
        //else console.log('bot', new Uint8Array(data));
        this._send(data);
    }
})();



window.genMatrix = () => {
    const steps = 10;
    const fps = 1000/20;
    const time = performance.now()/100;
    const step = time/fps>>0;

    const light = num => {
        const gradient = "_O";
        const max = gradient.length-1;
        num = Math.min(100, Math.max(num, 0));
        const x = max*num/100>>0;
        return gradient[x];
    }

    const matrix = Array(10).fill(0).map((a,y)=>{
        //y = y + step%steps >> 0;
        return Array(10).fill(0).map((a,x)=>{
            //x = x + step%steps >> 0;
            const dxy = x^y;
            const drawIf = dxy>time%25 || x==0 || x == 9 || y == 0 || y == 9;
            const formula = drawIf*100;
            const color = light(formula);
            return color;
        }).join('');
    });

    return matrix;
};
window.genMatrix2 = () => {
    return [
        'OOOOOOOOOO',
        'O________O',
        'O_O____O_O',
        'O_O____O_O',
        'O_O____O_O',
        'O________O',
        'O_O____O_O',
        'O__OOOO__O',
        'O________O',
        'OOOOOOOOOO',
    ];
};
window.genMatrix3 = () => {
    return [
        'OOOOOOOOOO',
        'O________O',
        'O_O____O_O',
        'O_O____O_O',
        'O_O____O_O',
        'O________O',
        'O__OOOO__O',
        'O_O____O_O',
        'O________O',
        'OOOOOOOOOO',
    ];
};
var iter = null;
const fps = 1000/250;
document.onkeydown = e => {
    if (e.code == 'NumpadAdd') {
        client.sendMessage('');
        for(let i=0;i<9;i++)client.sendMessage('');
        return;
    }
    if (e.code == 'NumpadMultiply') {
        const matrix = window.genMatrix2();
        for(let i=0;i<10;i++)client.sendMessage(matrix[i]);
        return;
    }
    if (e.code == 'NumpadDivide') {
        const matrix = window.genMatrix3();
        for(let i=0;i<10;i++)client.sendMessage(matrix[i]);
        return;
    }
    if (e.code == 'NumpadSubtract') {
        if (iter != null) {
            WorkerTimer.clearInterval(iter);
            iter = null;
            return;
        }
        let g = 0;
        iter = WorkerTimer.setInterval(()=>{
            let matrix = Array(120).fill(' ').join('');
            client.sendMessage(matrix);
        }, fps);
        return;
    }
}
// 0vC4#7152