// ==UserScript==
// @name        MooMoo.io Gold bots 2025
// @version     1
// @author      HaThu
// @description moomoo.io gold bots 2025 create bot follow your to kill get gold easy
// @require     https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @license     MIT
// @match       *://*.moomoo.io/*
// @grant       none
// @namespace https://greasyfork.org/users/1258025
// @downloadURL https://update.greasyfork.org/scripts/546513/MooMooio%20Gold%20bots%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/546513/MooMooio%20Gold%20bots%202025.meta.js
// ==/UserScript==

let msgpack_lite = window.msgpack;
let oweb = window.WebSocket;
let socket;
let bot = [];
let ownplayer = { sid:null, x:0, y:0, dir:0, skinIndex:0, name:null };

function getAngleDist(e,t){
  const i=Math.abs(t-e)%(Math.PI*2);
  return i>Math.PI?Math.PI*2-i:i;
}
let chatMessages = [
  "Hello mooaddict im a bots",
  "iam hathu slave",
  "josh not unblocked me",
  "after add cloudflare :(",
  "dc : harryhathu._.",
  "zx is 13 year old",
  "zx got logger and blame me",
  "poor boy zx",
  "ahhh",
  "best running people 2025",
  "only zx pls skid",
  "mommy mod script pls",
  "only hacking game dead",
  "unfair game",
  "pls zx",
  "zx only know swearing ppl",
  "poor for him",
  "sad child"
];
async function safeDecode(event){
  try{
    let buf;
    if(event.data instanceof Blob){
      buf = new Uint8Array(await event.data.arrayBuffer());
    } else if(event.data instanceof ArrayBuffer){
      buf = new Uint8Array(event.data);
    } else return null;
    return msgpack_lite.decode(buf);
  }catch(e){
    console.warn("decode error",e);
    return null;
  }
}
function hookPacket(decoded){
  if(!decoded) return null;
  return (decoded.length>1 && Array.isArray(decoded[1])) ? [decoded[0],...decoded[1]] : decoded;
}

window.WebSocket = function(...args){
  socket = new oweb(...args);
  socket.addEventListener("message", async e=>{
    let hooked = hookPacket(await safeDecode(e));
    if(!hooked) return;

    if(hooked[0]==="io-init"){
      let region = socket.url.split("/")[2];
      for(let i=0;i<1;i++){ // can adjust for spawn custom value
        let token = await altcha.generate();
        bot.push(new Bot(region, token));
      }
    }
    if(hooked[0]==="C" && ownplayer.sid==null){
      ownplayer.sid = hooked[1];
    }
    if(hooked[0]==="D" && hooked[1][1]===ownplayer.sid){
      ownplayer.name = hooked[1][2];
    }
    if(hooked[0]==="a"){
      for(let i=0;i<hooked[1].length/13;i++){
        let p = hooked[1].slice(13*i,13*i+13);
        if(p[0]==ownplayer.sid){
          [ownplayer.x,ownplayer.y,ownplayer.dir,ownplayer.skinIndex] = [p[1],p[2],p[3],p[9]];
        }
      }
      for(let b of bot){ b.autm.x=ownplayer.x; b.autm.y=ownplayer.y; }
    }
  });
  return socket;
};

let randomhats=[28,29,30,36,37,38,44,42,43,49];
class Bot{
  constructor(region,token){
    this.socket=new WebSocket(`wss://${region}/?token=${token}`);
    this.sid=null; this.x=0; this.y=0; this.dir=0;
    this.weaponIndex=0; this.health=100; this.foodCount=100;
    this.packetCount=0; this.autm={x:0,y:0,boolean:true};
    this.chatIndex = 0;
    setInterval(()=>this.packetCount=0,1000);

    this.socket.addEventListener("open",()=>{
      console.log("bot connected");
        setInterval(() => {
        if (this.sid) {
          let msg = chatMessages[this.chatIndex];
          this.sendMessage("6", msg);
          this.chatIndex = (this.chatIndex + 1) % chatMessages.length;
        }
      }, 3000);
      this.socket.addEventListener("message", async e=>{
        let hooked = hookPacket(await safeDecode(e));
        if(!hooked) return;

        if(hooked[0]==="io-init") this.spawn();
        if(hooked[0]==="C" && this.sid==null) this.sid=hooked[1];
        if(hooked[0]==="D" && hooked[1][1]===this.sid){ this.foodCount=100; this.health=100; }
        if(hooked[0]==="a"){
          for(let i=0;i<hooked[1].length/13;i++){
            let p=hooked[1].slice(13*i,13*i+13);
            if(p[0]==this.sid){ [this.x,this.y,this.dir,this.weaponIndex]=[p[1],p[2],p[3],p[5]]; }
          }
          this.equipIndex(0, randomhats[Math.random()*randomhats.length|0], 0);
          if(this.autm.boolean){
            let dx=this.autm.x-this.x, dy=this.autm.y-this.y;
            let dist=Math.hypot(dx,dy), ang=Math.atan2(dy,dx);
            this.sendMessage("9", dist>=105?ang:ownplayer.dir);
          }
        }
        if(hooked[0]==="P") this.spawn();
      });
    });
  }
  spawn(){ this.sendMessage("M",{name:"GoldBot",moofoll:true,skin:0}); }
  equipIndex(buy,id,index){ this.sendMessage("c",buy,id,index); }
  sendMessage(type,...args){
    if(this.packetCount<120){
      this.socket.send(new Uint8Array(msgpack_lite.encode([type,args])));
      this.packetCount++;
    }
  }
}

class Alt {
    constructor() {
        this.core_count = Math.min(16, navigator.hardwareConcurrency || 8);
        this.workers = [];
        this.initialized = false;
        this.blobUrl = null;
    }
    initWorkerPool() {
        if (this.initialized) return;
        const workerCode = `
            importScripts('https://cdn.jsdelivr.net/npm/js-sha256@0.9.0/build/sha256.min.js');
            let challenge = null;
            let salt = null;
            self.onmessage = function(e) {
                const data = e.data;
                if (data.init) {
                    challenge = data.challenge;
                    salt = data.salt;
                    self.postMessage({ ready: true });
                    return;
                }
                const { start, end } = data;
                for (let i = start; i <= end; i++) {
                    if (sha256(salt + i) === challenge) {
                        self.postMessage({ found: i });
                        return;
                    }
                }
                self.postMessage({ done: true });
            };
        `;
        const blob = new Blob([workerCode], { type: "application/javascript" });
        this.blobUrl = URL.createObjectURL(blob);
        for (let i = 0; i < this.core_count; i++) {
            this.workers.push(new Worker(this.blobUrl));
        }
        this.initialized = true;
    }
    async getChallenge() {
        const response = await fetch("https://api.moomoo.io/verify");
        return await response.json();
    }
    async solveChallenge(challengeData) {
        this.initWorkerPool();
        const { challenge, salt, maxnumber } = challengeData;
        const segmentSize = Math.ceil(maxnumber / this.core_count);
        let solved = false;
        let doneCount = 0;

        return new Promise((resolve, reject) => {
            const startTime = performance.now();
            const tasks = this.workers.map((worker, idx) => ({
                start: idx * segmentSize,
                end: Math.min(maxnumber, (idx + 1) * segmentSize - 1)
            }));

            this.workers.forEach((worker, idx) => {
                worker.onmessage = e => {
                    const msg = e.data;
                    if (msg.ready) {
                        worker.postMessage(tasks[idx]);
                    } else if (msg.found != null && !solved) {
                        solved = true;
                        const number = msg.found;
                        const took = ((performance.now() - startTime) / 1000).toFixed(2);
                        resolve({ challenge, salt, maxnumber, number, took });
                        this.cleanupWorkers();
                    } else if (msg.done) {
                        doneCount++;
                        if (!solved && doneCount === this.workers.length) {
                            reject(new Error("Challenge not solved"));
                            this.cleanupWorkers();
                        }
                    }
                };
                worker.onerror = err => {
                    if (!solved) {
                        reject(err);
                        this.cleanupWorkers();
                    }
                };
                worker.postMessage({ init: true, challenge, salt });
            });
        });
    }
    cleanupWorkers() {
        this.workers.forEach(w => w.terminate());
        this.workers = [];
        this.initialized = false;
        if (this.blobUrl) {
            URL.revokeObjectURL(this.blobUrl);
            this.blobUrl = null;
        }
    }
    static createPayload(Data, Date_) {
        return btoa(JSON.stringify({
            algorithm: "SHA-256",
            challenge: Data.challenge,
            salt: Data.salt,
            number: Date_.number,
            signature: Data.signature || null,
            took: Date_.took
        }));
    }
    async generate() {
        const challengeData = await this.getChallenge();
        const solution = await this.solveChallenge(challengeData);
        this.code = `alt:${Alt.createPayload(challengeData, solution)}`;
        return this.code;
    }
}

let altcha = new Alt();