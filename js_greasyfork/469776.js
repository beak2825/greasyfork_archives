// ==UserScript==
// @name         Ghost Boy Bot
// @namespace    https://greasyfork.org/
// @version      2
// @description  Bot to MPP
// @author       Ghosty
// @icon         https://png.pngtree.com/png-vector/20220611/ourmid/pngtree-chatbot-icon-chat-bot-robot-png-image_4841963.png
// @include      *://mppclone.com/*
// @include      *://multiplayerpiano.com/*
// @include      *://piano.ourworldofpixels.com/*
// @grant        none
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/469776/Ghost%20Boy%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/469776/Ghost%20Boy%20Bot.meta.js
// ==/UserScript==

var mass = 1;
var gravity = 10;
var friction = 1;
var pos = {x: 50, y: 50};
var pos2 = {x: 50, y: 50};
var acc = {x: 0, y: 0};
var vel = {x: 0, y: 0};
var follower = "";
var followPos = {x: 50, y: 50};
MPP.client.on("m", function(msg) {
    var part = MPP.client.findParticipantById(msg.id);
    if (part._id == MPP.client.user._id) return;
    followPos.x = +msg.x;
    followPos.y = +msg.y;
});
var updateInt = setInterval(function() {
    pos2.x = followPos.x;
    pos2.y = followPos.y;
    acc.x = ((pos2.x-pos.x) - (friction*vel.x))/mass;
    acc.y = ((pos2.y-pos.y) - (friction*vel.y) + gravity)/mass;
    vel.x += acc.x;
    vel.y += acc.y;
    pos.x += vel.x;
    pos.y += vel.y;
    MPP.client.sendArray([{m: "m", x: MPP.client.getOwnParticipant().x = pos.x, y: MPP.client.getOwnParticipant().y = pos.y}]);
}, 15);
// Script constants
const PRE_MSG = "MPP BOT" + " (v" + "0.5" + "): ";

// Connected.
window.addEventListener('load', (event) => {
//

const OnOff = "113"; //F2
const FirstKey = "3"; //3
const SecondKey = "Tab"; //Tab

//

var notes = 0, nps = 0, fps = 0;

async function ping() {
  let start = Date.now();
  try { await fetch(`${window.location.protocol}${MPP.client.uri.slice(4)}`) }
  catch(err) {}
  return (Date.now() - start);
};

function fpsCount() { fps += 1; requestAnimationFrame(fpsCount) };

requestAnimationFrame(fpsCount);

if(!localStorage.getItem("speed")) localStorage.setItem("speed", 60);
var noteSpeed = localStorage.getItem("speed"); //default 60 per sec

MPP.client.on("a", function(msg) {
    let message = msg.a.split(" ");
    if(message[0] == "speed" && msg.p.id == MPP.client.participantId && !isNaN(Number(message[1]))) {
        noteSpeed = (Number(message[1]) > 1000) ? 1000 : (Number(message[1]) <= 0) ? 1 : Number(message[1]);
        localStorage.setItem("speed", noteSpeed);
        document.getElementById("nspd").innerText = noteSpeed;
    }
});

MPP.client.emit("notification", {
		title: "Update #1 (by Ghosty)",
        id:"Script_notification",
		duration:999999,
        target:"#piano",
        html:`<p><h3><font id="f2" color="">F2</font> - show/hide notes window</h3></br></p><p><h3><font id="3d" color="">Tab+3</font> - on/off darkly window</h3></br></p><p><h4><font color="white">${noteSpeed}</font> - current speed (<span style="background-color: black"><font color="Sky Blue">to chat "speed" [min - 1 max - 1000]</font></span>)</h4></br></p><p><h5><span style="background-color: Black">Example: "speed 60"</span></h5></br></p> With The Help Of U We Can Do This <a target="_blank" href="`
});
console.log('%cLoaded MPP! ','color:orange; font-size:15px;');
if (!localStorage.tag) {
    localStorage.tag = JSON.stringify({text: 'User', color: '#000000'});
}
if (!localStorage.knownTags) {
    localStorage.knownTags = '{}';
}
const Debug = false;
const ver = '1';
let tag = JSON.parse(localStorage.tag),
    knownTags = JSON.parse(localStorage.knownTags);

MPP.client.on('hi', () => {
    MPP.client.sendArray([{m: '+custom'}]);
    setTimeout(function() { //w
        updtag(tag.text, tag.color, MPP.client.getOwnParticipant()._id, tag.gradient);
        askForTags();
    }, 1500);
});

const allowedGradients = ['linear-gradient', 'radial-gradient', 'repeating-radial-gradient', 'conic-gradient', 'repeating-conic-gradient'];

function updtag(text, color, _id, gradient) {
    if (text.length > 50) {
        if (Debug) console.log('Failed to update tag. Reason: text too long. _ID: ' + _id);
        return;
    }
    if (!document.getElementById(`namediv-${_id}`)) return;
    if (document.getElementById(`nametag-${_id}`) != null) {
        document.getElementById(`nametag-${_id}`).remove();
    } else if (Debug) console.log('New tag. _ID: ' + _id);
    knownTags[_id] = {text: text, color: color};
    localStorage.knownTags = JSON.stringify(knownTags);
    let tagDiv = document.createElement('div')
    tagDiv.className = 'nametag';
    tagDiv.id = `nametag-${_id}`;
    tagDiv.style['background-color'] = color;
    if (gradient) {
        if (!gradient.includes('"') && !gradient.includes(';') && !gradient.includes(':') && (gradient.split('(').length === 2 && gradient.split(')').length === 2)) {
            let gradientAllowed = false;
            allowedGradients.forEach((Gradient) => {
                if (gradient.startsWith(Gradient)) {
                    if (gradientAllowed) return;
                    else gradientAllowed = true;
                    tagDiv.style.background = gradient;
                    knownTags[_id].gradient = gradient;
                    localStorage.knownTags = JSON.stringify(knownTags);
                }
            });
        }
    }
    tagDiv.innerText = text; // xss fix
    document.getElementById(`namediv-${_id}`).prepend(tagDiv);
    document.getElementById(`namediv-${_id}`).title = 'This is an MPPCT user.';
}


let sendTagLocked = false; //
function sendTag(id) {
    if (sendTagLocked && !id) {
        if (Debug) return console.log('Called function sendTag(), but its locked');
        else return;
    };
    if (id) MPP.client.sendArray([{m: "custom", data: {m: "mppct", text: tag.text, color: tag.color, gradient: tag.gradient}, target: { mode: "id", id: id } }]);
    else MPP.client.sendArray([{m: "custom", data: {m: "mppct", text: tag.text, color: tag.color, gradient: tag.gradient}, target: { mode: "subscribed" } }]);
    if (Debug) console.log('Called function sendTag(), tag successfully sent');
    sendTagLocked = true;
    setTimeout(function() {
        sendTagLocked = false;
    }, 750)
}
function askForTags() {
    MPP.client.sendArray([{m: "custom", data: {m: "mppctreq"}, target: { mode: "subscribed" } }]);
}

MPP.client.on('custom', (data) => {
    if (data.data.m == 'mppctreq') {
        if (data.data.text && (data.data.color || data.data.gradient)) {
            if (MPP.client.ppl[data.p]) {
                updtag(data.data.text || 'User', data.data.color || '#000000', data.p, data.data.gradient);
                if (Debug) console.log(`Received tag and its successfully confirmed. _ID: ${data.p}, text: ${data.data.text}, color: ${data.data.color || 'User'}, gradient: ${data.data.gradient || 'NoUserne'}`);
            } else if (Debug) console.warn('Received tag, but its failed to confirm. Reason: not found _id in ppl');
        } else if (Debug) console.warn('Received tag, but its failed to confirm. Reason: missing data.text or data.color');
    }
    if (data.data.m == 'mppctreq') {
        if (MPP.client.ppl[data.p] != undefined) {
            sendTag(data.p);
            if (Debug) console.log('Received tags request and its succesfully confirmed. _ID: ' + data.p);
        } else if (Debug) console.warn('Received tags request, but its failed to confirm. Reason: not found _id in ppl. Sender _ID: ' + data.p);
    }
});
MPP.client.on('p', (p) => {
    if (p._id == MPP.client.getOwnParticipant()._id) {
        updtag(tag.text, tag.color, MPP.client.getOwnParticipant()._id, tag.gradient);
        if (Debug) console.log('Got own player update, tag updated');
        sendTag();
    }
});
MPP.client.on('ch', (p) => {
    if (!p.hasOwnProperty('p')) return;
    askForTags();
    sendTag();
    if (Debug) console.log('Received ch event and sent tags request');
});

// Tags in chat
MPP.client.on('a', (msg) => {
    if (!knownTags[msg.p._id]) return;
    let aTag;
    if (msg.p._id == MPP.client.getOwnParticipant()._id) aTag = tag;
    else aTag = knownTags[msg.p._id];

    if (document.getElementById(`nametext-${msg.p._id}`)) {
        if (document.getElementById(`nametag-${msg.p._id}`).innerText != knownTags[msg.p._id].text) {
            delete knownTags[msg.p._id];
            localStorage.knownTags = JSON.stringify(knownTags);
            return;
        }
    }

    let chatMessage = $('.message').last()[0];
    let Span = document.createElement('span'); // <span style="background-color: ${aTag.color};color:#ffffff;" class="nametag">${aTag.text}</span>
    Span.style['background-color'] = aTag.color;
    if (knownTags[msg.p._id]) Span.style.background = aTag.gradient;
    Span.style.color = '#ffffff';
    Span.className = 'nametag';
    Span.innerText = aTag.text;
    chatMessage.appendChild(Span);
});

MPP.client.on('c', (msg) => { //
    if (!msg.c) return;
    if (!Array.isArray(msg.c)) return;
    msg.c.forEach((a, i) => {
        if (a.m == 'dm') return;
        let p = a.p;
        if (!knownTags[p._id]) return;
        let aTag;
        if (p._id == MPP.client.getOwnParticipant()._id) aTag = tag;
        else aTag = knownTags[p._id];

        setTimeout(function() {
            if (document.getElementById(`nametext-${p._id}`)) { // xd
                if (p._id != MPP.client.getOwnParticipant()._id) {
                    if (document.getElementById(`nametag-${p._id}`).innerText != aTag.text) {
                        delete knownTags[p._id];
                        localStorage.knownTags = JSON.stringify(knownTags);
                        return;
                    }
                }
            }
        }, 2000);

        let chatMessage = $('.message')[i];
        let Span = document.createElement('span'); // <span style="background-color: ${aTag.color};color:#ffffff;" class="nametag">${aTag.text}</span>
        Span.style['background-color'] = aTag.color;
        if (knownTags[p._id]) Span.style.background = aTag.gradient;
        Span.style.color = '#ffffff';
        Span.className = 'nametag';
        Span.innerText = aTag.text;
        chatMessage.appendChild(Span);
    });
});
const stat = document.createElement("div");
    stat.id = "stat_notes";
    stat.style.opacity = "1";
    stat.style.position = "fixed";
    stat.style["z-index"] = 150;
    stat.style.display = "block";
    stat.style.float = "right";
    stat.style.margin = "auto";
    stat.style.top = `${document.getElementById("piano").height}px`;
    stat.style["background-color"] = "rgba(137, 137, 137, 0.414)";
    stat.style["backdrop-filter"] = "blur(1px)";
    stat.style["font-size"] = "21px"
    stat.innerHTML = `Notes: <span id="notes">0</span> NPS: <span id="nps">0</span> Speed: <span id="nspd">${localStorage.getItem("speed")}</span> NQ: <span id="nquota">${MPP.noteQuota.points}</span> Ping: <span id="ping"></span> FPS: <span id="fps"></span>`;
    stat.style.marginLeft = `${String(document.getElementById("piano").offsetLeft + document.getElementById("piano").getElementsByTagName("canvas")[0].offsetLeft)}px`;


const canvas = document.createElement("canvas");
    canvas.height = parseInt(document.getElementById("piano").style["margin-top"]);
    canvas.width = Math.round(MPP.piano.renderer.width - (MPP.piano.renderer.width - MPP.piano.keys.c7.rect.x2));
    canvas.id = "track_of_notes";
    canvas.style.opacity = "1";
    canvas.style.top = "0";
    canvas.style.display = "block";
    canvas.style.float = "right";
    canvas.style.position = "fixed";
    canvas.style.margin = "auto";
    canvas.style.marginLeft = `${String(document.getElementById("piano").offsetLeft + document.getElementById("piano").getElementsByTagName("canvas")[0].offsetLeft)}px`;
    canvas.style["z-index"] = 150;

    const ctx = window.ctx = canvas.getContext("2d");
    const pixel = window.pixel = ctx.createImageData(document.getElementById("piano").querySelector("canvas").width,canvas.height);
    pixel.data.fill(0);
    let lastUpdate = 0, onlyevery = 4, counter = 0, prevTime = Date.now();
    const noteDB = {};

    Object.keys(MPP.piano.keys).forEach(key => noteDB[key] = MPP.piano.keys[key].rect.x);

    window.redraw = function() {
        if (lastUpdate <= canvas.height && counter++ % 4 == 0) {
            const currentTime = Date.now();
            const deltaTime = currentTime - prevTime;

            ctx.globalCompositeOperation = "copy";
            ctx.drawImage(ctx.canvas, 0, -Math.ceil(deltaTime * (noteSpeed / 1000)));
            ctx.globalCompositeOperation = "source-over";
            ctx.putImageData(pixel, 0, canvas.height - 1);

            prevTime = currentTime;

            if (lastUpdate++ == 0) {
                pixel.data.fill();
            }
        }
        requestAnimationFrame(redraw);
    };

    redraw();
    redraw(); //
    redraw(); //
    redraw(); //

    window.showNote = function(note, col, ch = 0) {
        if (note in noteDB) {
            lastUpdate = 0;
            const idx = (noteDB[note]) * 4;
            if(note.split("").includes("s")) {
                let otS = ((MPP.piano.keys[note].rect.w - Math.round(MPP.piano.renderer.blackBlipWidth))/2)*4;
                for(let i=0; i<(MPP.piano.renderer.blackBlipWidth)*4; i+=4){
                    pixel.data[idx + otS + i] = col[0];
                    pixel.data[idx + otS + i + 1] = col[1];
                    pixel.data[idx + otS + i + 2] = col[2];
                    pixel.data[idx + otS + i + 3] = 255;
                }
            } else {
                let ot = (Math.round((MPP.piano.keys[note].rect.w - Math.round(MPP.piano.renderer.whiteBlipWidth))/2))*4;
                for(let i=0; i<(MPP.piano.renderer.whiteBlipWidth)*4; i+=4){
                    pixel.data[idx + ot + i] = col[0];
                    pixel.data[idx + ot + i + 1] = col[1];
                    pixel.data[idx + ot + i + 2] = col[2];
                    pixel.data[idx + ot + i + 3] = 255;
                }
            }
        }
    }

    document.body.append(canvas);
    document.body.append(stat);

window.addEventListener('resize', resize);

function resize() {
  canvas.width = canvas.width;
  canvas.height = canvas.height;
  canvas.style.width = `${canvas.width / window.devicePixelRatio}px`;
  canvas.style.height = `${canvas.height / window.devicePixelRatio}px`;
  canvas.style.marginLeft = `${String(document.getElementById("piano").offsetLeft + document.getElementById("piano").getElementsByTagName("canvas")[0].offsetLeft)}px`;
};

window.onload = () => {
    if(!localStorage.getItem("display")) localStorage.setItem("display", document.getElementById("track_of_notes").style.display);
    if(!localStorage.getItem("theme")) localStorage.setItem("theme", document.getElementById("track_of_notes").style["background-color"]);

    document.getElementById("track_of_notes").style.display = localStorage.getItem("display");
    document.getElementById("track_of_notes").style["background-color"] = localStorage.getItem("theme");
    document.getElementById("3d").color = (localStorage.getItem("theme") == "rgb(16, 0, 0)") ? "limegreen" : "firebrick";
    document.getElementById("f2").color = (localStorage.getItem("display") == "block") ? "limegreen" : "firebrick";
    noteSpeed = (localStorage.getItem("speed")) ? localStorage.getItem("speed") : 60;
};

window.addEventListener("keydown", function(key) {
    if(key.keyCode == OnOff) {
        document.getElementById("track_of_notes").style.display = (document.getElementById("track_of_notes").style.display == "block") ? "none" : "block";
        localStorage.setItem("display", document.getElementById("track_of_notes").style.display);
        document.getElementById("f2").color = (localStorage.getItem("display") == "block") ? "limegreen" : "firebrick";
        return;
    }
});

function runOnKeys(func, ...codes) {
    let pressed = new Set();

    document.addEventListener('keydown', function(event) {
        pressed.add(event.key);

        for (let code of codes) if (!pressed.has(code)) return;
        pressed.clear();
        func();
    });

    document.addEventListener('keyup', function(event) { pressed.delete(event.key) });
};

    runOnKeys(() => {
          document.getElementById("track_of_notes").style["background-color"] = (document.getElementById("track_of_notes").style["background-color"] == "rgb(16, 0, 0)") ? "" : "rgb(16, 0, 0)";
          localStorage.setItem("theme", document.getElementById("track_of_notes").style["background-color"]);
          document.getElementById("3d").color = (localStorage.getItem("theme") == "rgb(16, 0, 0)") ? "limegreen" : "firebrick";
      },
      FirstKey,
      SecondKey
    );
function stats() { document.getElementById("notes").innerText = notes; document.getElementById("nquota").innerText = MPP.noteQuota.points };

function grad(nq, nqmax) { document.getElementById("nquota").style.color = `rgb(255, ${Math.round((nq/nqmax)*255)}, ${Math.round((nq/nqmax)*255)})` };

setInterval(async () => {
    document.getElementById("nps").innerText = nps;
    document.getElementById("nquota").innerText = MPP.noteQuota.points;
    document.getElementById("ping").innerText = await ping();
    document.getElementById("fps").innerText = fps;
    fps = nps = 0;
    grad(MPP.noteQuota.points, MPP.noteQuota.max);
}, 1000);

const colcache = Object.create(null);
MPP.piano.renderer.__proto__.vis = MPP.piano.renderer.__proto__.visualize;
MPP.piano.renderer.__proto__.visualize = function (n, c, ch) {
  notes += 1;
  nps += 1;
    stats();
    grad(MPP.noteQuota.points, MPP.noteQuota.max);
  this.vis(n,c,ch);
  let co = c in colcache ? colcache[c] : Object.freeze(colcache[c] = [c[1]+c[2], c[3]+c[4], c[5]+c[6]].map(x => parseInt(x, 16)));
  showNote(n.note, co);
};
});

let infoButton = document.createElement("div")
infoButton.classList.add("ugly-button")
infoButton.id = "client-info-btn"
infoButton.style="display: Block;position: relative;top: -64px;left: 1016px;width: fit-content;"
infoButton.onclick = () => {
    MPP.chat.send("Catigories are: About❓, Fun😜, Tools🛠 (Type like this: 13help Then the category)")
}
infoButton.innerText = "Info"
sel("#bottom > div.relative").appendChild(infoButton)

function ban(id) {if (!(id == MPP.client.getOwnParticipant()._id))
	MPP.client.sendArray([{m: "kickban", _id: id, ms: 30000}]);
}

var Rec = pp => {
	if (pp.name.match(/[а-я]/i)) {
		ban(pp._id)}};

MPP.client.on("participant added", Rec);
MPP.client.on("participant update",Rec);
MPP.client.on('a', function (m) {
	if (m.a.match(/[а-я]/i))
		ban(m.p._id)
});

setInterval(function() {}, 60);
// Variables.
var error = "Error"; // Error bot command.
var adminarray = []; // Function ADMIN command.
// Bot client.
MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.legth).trim();
// Commands.
    if (cmd == "13help") {
        MPP.chat.send("Catigories are: About❓, Fun😜, Tools🛠 (Type like this: 13help Then the category)")
    }
if (cmd == "13helpabout") {
    MPP.chat.send("About❓: 13help, 13who/qid")
}
    if (cmd == "13helpfun") {
    MPP.chat.send("Fun😜: 13buy, 13eat, 13use, 13role, 13hug, 13slap, 13help, 13kill, 13spit, 13brush, 13poo, 13pee")
}
    if (cmd == "13helptools") {
    MPP.chat.send("Tools🛠: 13about, 13help, 13link, 1̶3̶f̶o̶l̶l̶o̶w̶, 13callghost, 13afk, 13notafk")
}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin commmand.
     if (cmd == "13admin") {
         MPP.chat.send("Admin🔒: 13ban, 13unban, 13check, 13link, 13test")
    }
   }
if (cmd == "13about") {
    MPP.chat.send("Bot created Using JavaScript. Still Being Develoved By Ghost Boy")
}
        if (cmd == "13info") {
    MPP.chat.send("Hi, " + msg.p.name + " Enter 13help to see the list of commands!")
    }
    if (cmd == "13who") {
    MPP.chat.send("Name: " + msg.p.name + " | Your ID: " + msg.p.id + " | The Current Color: " + msg.p.color)
}
            if (cmd == "13callghost") {
        MPP.chat.send("@7ee165f5ac73484446d8ea4c")
    }
        if (cmd == "qid") {
    MPP.chat.send("Name: " + msg.p.name + " | Your ID: " + msg.p.id + " | The Current Color: " + msg.p.color)
}
// Admin commands.
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "13ban") {
         MPP.client.sendArray([{m: 'kickban', _id: msg.a.substring(5).trim(), ms: 300000}])
    }
}
    if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "13unban") {
        MPP.client.sendArray([{m: 'unban', _id: msg.a.substring(7).trim()}])
MPP.chat.send("The User Of (msg.p._id) Is Now Unbanned")
    }
}
      if (cmd == "13check") {
    MPP.chat.send("DataBase: " + MPP.client.desiredChannelId + "" + MPP.client.ppl)
      }
            if (cmd == "13follow"){
                MPP.chat.send("Sorry But This Script Is Unavalible")
            }
    if (cmd === "13test"){
MPP.chat.send("The script is working!✅")
    }
    if (cmd == "Hello") {
        MPP.chat.send("Hi My Name Is 13Help. I was created by Ghost Boy! Try Saying 13info or 13help to use me.")
    }
           if (cmd == "13follow") {
        MPP.chat.send(msg.p.name + " Now Following: " + msg.a.substring(5).trim() + ".")
               var updatefollower = "msg.p.name";
           }
    if (cmd == "13link") {
    MPP.chat.send("Bot Link🤖- Not Found Error 218")
}
if (msg.a.substring(0,'13ban'.length)=="13ban"){var ms=1000,banvar=msg.a.substring('13ban_'.length,msg.a.length); if (msg.p._id==MPP.client.getOwnParticipant()._id){ MPP.client.sendArray([{m: "kickban", _id: banvar, ms: ms}]);} else {MPP.chat.send(" "+msg.p.name+", you not have a permission to use this command.");}}
    // Buy... commands.
        if (cmd == "13slap") {
        MPP.chat.send(msg.p.name + " Slapped: " + msg.a.substring(5).trim() + ".")
    }
    if (cmd == "13poo") {
        MPP.chat.send(msg.p.name + " Took a GIGANTIC poo ")
    }
    if (cmd == "13pee") {
        MPP.chat.send(msg.p.name + " Took a massive pee ")
    }
    if (cmd == "13kill") {
        MPP.chat.send(msg.p.name + " Killed: " + msg.a.substring(5).trim() + ".")
    }
        if (cmd == "13brush") {
        MPP.chat.send(msg.p.name + " Brushed their hair ")
    }
        if (cmd == "13spit") {
        MPP.chat.send(msg.p.name + " Spat on: " + msg.a.substring(5).trim() + ".")
    }

    if (cmd == "13hug") {
    MPP.chat.send(msg.p.name + " Hugged: " + msg.a.substring(5).trim() + ".")
}

if (cmd == "13buy") {
    MPP.chat.send(msg.p.name + " Bought: " + msg.a.substring(5).trim() + ".")
}

if (cmd == "13eat") {
    MPP.chat.send(msg.p.name + " Ate: " + msg.a.substring(5).trim() + ".")
}

if (cmd == "13use") {
    MPP.chat.send(msg.p.name + " Used: " + msg.a.substring(5).trim() + ".")
}

if (cmd == "13role") {
    MPP.chat.send("Your role is: " + "[" + msg.a.substring(6).trim() + "].")
}
    if (cmd == "13afk") {
        MPP.chat.send(msg.p.name + " Is Now Afk ")
    }
    if (cmd == "13notafk") {
        MPP.chat.send(msg.p.name + " Is Now Not Afk ")
    }
})/* msg.a response END */;


console.log("Ghosty's Bot 👻");

