// ==UserScript==
// @name         3lectr0N!nj@ EXP
// @namespace    https://greasyfork.org/en/users/1462379-3lectr0n-nj
// @description  farming exp
// @author       3lectr0N!nj@
// @match        https://nifty-condition-169823.appspot.com/*
// @match        https://blank.org/
// @version      V2
// @require      https://update.greasyfork.org/scripts/539331/1638884/BumpyballioPucksio%20Decoder.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pucks.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537238/3lectr0N%21nj%40%20EXP.user.js
// @updateURL https://update.greasyfork.org/scripts/537238/3lectr0N%21nj%40%20EXP.meta.js
// ==/UserScript==
// @match        https://blank.org/
function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
let game = {
    handlepackets(j,ws){
        let js = {}
        let data = j[18][2]
        if(j[8][2]==2){
            ws.id = data[24][2]
            game.bid.push(ws.id)
        }
        if(j[8][2]==8){
            if(data[26][2][16][2]==0){
                let id = data[26][2][24][2]
                let eid = data[16][2]
                if(!game.bid.includes(id)){
                    game.bid.push(id)
                game.ids[id]=[eid,ws.url]
                }
            }
        }
        js[8] = ["packetid","int",j[8][2]]
        js[18]=["data","dict",data]
        return js
    },
    handleomp(j,ws){
        for (let b in j) {
        let _j = j[b]
        j[b]=this.handlepackets(_j,ws)
        }
        return j
    },
    ids:[],
    bid:[],
    server : [
            'wss://singapore-01.usemapsettings.com:8080/server',
            'wss://singapore-01.usemapsettings.com:8081/server',
            'wss://singapore-01.usemapsettings.com:8082/server',
            'wss://singapore-01.usemapsettings.com:8083/server',
            'wss://singapore-01.usemapsettings.com:8084/server',
            'wss://singapore-01.usemapsettings.com:8085/server'
        ],
    Bots : [
            "Anna", "Steven", "Chris", "Martha", "David", "Linda", "Betty", "Mildred", "Meowzer", "Christine",
            "Kitty", "Gloria", "Wanda", "Roger", "Michelle", "Beverly", "Andrea", "Bobby", "Clarence", "Peter",
            "Carlos", "Patricia", "Jesse", "Douglas"
        ],
    join() {
            let j = {
        8:  ["PacketId","int",1],
        18: ["Data","dict",{
        10: ["name", "string",this.Bots[getRandomInt(0, this.Bots.length - 1)]],
        18: ["uid", "string","AU3s1oxeVqOPJt8Wrh4hEf4yf892"],
        24: ["version", "uint",870],
        32: ["skinId", "uint",getRandomInt(0, 14)],
        56: ["authenticationMethod", "uint",1],
        }]
    }
            const join = new Uint8Array(new BR().Sencoder(j))
            return join;
        },
    move(eid){
        let j = {
        8: ["PacketId", "int",7],
        18: ["Data", "dict",{
        8: ["command", "bool",getRandomInt(0,1)],
        18: ["position", "dict", {
            13: ["x", "float",getRandomInt(-1,1)],
            21: ["z", "float",getRandomInt(-1,1)],
        }],
        24: ["EID", "uint",eid],
        }]
}
        const move = new Uint8Array(new BR().Sencoder(j))
            return move;
    },
    joingame(url) {
                const ws = new WebSocket(url)
                ws.onopen = function () {
                    ws.send(game.join());
                };
        if(!ws.hack){
                ws.addEventListener("message", async function(e){
                    const arrayBuffer = await e.data.arrayBuffer();
               let uint8Array = new Uint8Array(arrayBuffer);
               let json = new BR().Mdecoder(uint8Array)
               json = game.handleomp(json,ws)
                    game.afk(ws)
                });

                ws.addEventListener("close", () => {
                    location.reload();
                });
        }
            },
    afk(ws){
    game.ids.forEach(v=>{
                        let eid = v[0]
                        let url = v[1]
                        if(ws.url==url){
                        ws.send(game.move(eid))
                        }
                        })
    },
    exp() {
        this.server.forEach((url, index) => {
                    setTimeout(() => {
                        this.joingame(url);
                    }, 1000 * index);
                });
    }
        };
window.game=game
game.exp();
game.exp();
game.exp();
game.exp();
game.exp();