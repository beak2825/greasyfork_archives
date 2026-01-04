// ==UserScript==
// @name         MooMoo.io Bot
// @version      0.2
// @description  gives you magic powers
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @grant        none
// @run-at       document-start
// @icon         https://moomoo.io/img/favicon.png?v=1
// @namespace https://greasyfork.org/users/1347888
// @downloadURL https://update.greasyfork.org/scripts/529124/MooMooio%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/529124/MooMooio%20Bot.meta.js
// ==/UserScript==

let ws, msgpack = window.msgpack;

const ipLimit = 2;

let extra = {
    newSend: function(e) {
        const t = Array.prototype.slice.call(arguments, 1), i = window.msgpack.encode([e, t]);
        this && this.readyState === 1 && this.send(i)
    },
    spawn: function(name = "wealthy bot", skin = 6) {
        this.newSend("M", { name: name, moofoll: true, skin: skin })
    },
    chat: function(message) {
        this.newSend("6", message)
    },
    createTribe: function(tribe) {
        this.newSend("L", tribe)
    },
}

let keys = Object.keys(extra);
for(let key of keys) WebSocket.prototype[key] = extra[key];

const vanilla = WebSocket;
window.WebSocket = class extends vanilla {
    constructor(...args) {
        super(...args);

        this.send = new Proxy(super.send, {
            apply: (target, thisArg, args) => {
                let data = args[0];

                if(!ws) {
                    window.ws = ws = thisArg;
                    joined()
                }

                return target.apply(thisArg, args);
            }
        });
    }
};

async function joined() {
 sendBot(serverIp(), await getToken())
}

let payload_;async function getPayload(){return window.altcha.reset(),document.getElementById("altcha").configure({auto:"onfocus",challengeurl:"https://api.moomoo.io/verify",debug:!1,delay:0,hidefooter:!0,hidelogo:!1,name:"altcha",maxnumber:1e6,mockerror:!1,refetchonexpire:!0,spamfilter:!1,strings:{ariaLinkLabel:"Visit Altcha.org",error:"Verification failed. Try again later.",expired:"Verification expired. Try again.",footer:'Protected by <a href="https://altcha.org/" target="_blank" aria-label="Visit Altcha.org">ALTCHA</a>',label:"I'm not a robot",verified:"Verified",verifying:"Verifying...",waitAlert:"Verifying... please wait."},test:!1,workers:12}),new Promise((e,a)=>{document.querySelector("#altcha").addEventListener("statechange",a=>{let{detail:t}=a,{payload:r,state:i}=t;"verified"===i&&e(payload_=r)}),document.getElementById("altcha_checkbox").click()})};

async function getToken() {
    let token = await getPayload();
    let converted = JSON.parse(atob(token));

    console.log(`delta: ${100}ms, converted:`, converted)

    token = `alt:${btoa(JSON.stringify(converted))}`

    return token;
}

function serverIp() {
 if(!ws) return null;

 return ws.url.split("wss://")[1].split(".moomoo.io")[0];
}

function getRandomString(t){let n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",r="";for(let o=0;o<t;o++)r+=n.charAt(Math.floor(Math.random()*n.length));return r}
function sendBot(ip, token) {
    let url = `wss://${ip}.moomoo.io/?token=${token}`

    try {
        let bot = new WebSocket(url);

        bot.onopen = () => {
            console.log("open")

            bot.spawn();
            bot.createTribe(getRandomString(7));

            setInterval(() => {
              let message = Math.random() > .1 ? "discord/youtube: wealthydev" : "notice me josh!"
              bot.chat(message);

              bot.spawn();
            }, 2e3);
        }

        bot.onclose = (e) => console.log("closed", e.code)
        bot.onerror = () => {}

        window.bots.push(bot)
    } catch(e){}
}

window.bots = window.bots || []

window.getServers = async () => {
    let run_start = Date.now()
    let token = await getToken()

    let servers = {
        sandbox: await fetch("https://api-sandbox.moomoo.io/servers?v=1.26").then(res => res.json()),
        default: await fetch("https://api.moomoo.io/servers?v=1.26").then(res => res.json())
    }

    return servers;
}

window.getToken = getToken;
window.sendBot = sendBot;
window.serverIp = serverIp;