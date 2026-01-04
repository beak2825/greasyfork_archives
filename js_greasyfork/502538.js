// ==UserScript==
// @name         Neon's Hitbox mod but with fake ping
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  A Mod for hitbox.io. type /help for help.
// @author       iNeonz
// @match        https://heav.io/game.html
// @match        https://hitbox.io/game.html
// @match        https://heav.io/game2.html
// @match        https://hitbox.io/game2.html
// @match        https://hitbox.io/game-beta.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heav.io
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/502538/Neon%27s%20Hitbox%20mod%20but%20with%20fake%20ping.user.js
// @updateURL https://update.greasyfork.org/scripts/502538/Neon%27s%20Hitbox%20mod%20but%20with%20fake%20ping.meta.js
// ==/UserScript==

const codeNames = {};
let fakeping = 0;
const codeNamesRegex = {
    /*"general": {
        reg: /class .{0,2}\{constructor\(\) \{this\.id=(.*?);.{0,3}\..{0,3}\(.{0,1}\);this\.x=(.*?);this\.y=(.*?);(.*?)\(\)];this\..{0,2}=null;\}.{0,1}\(\)/i,
        verify: function(match)
        {
            let matches = match[0].match(/this\..{0,2}=(.*?);/ig);
            let m = [];
            for (let i of matches){
                m.push(i.split("this.")[1].split("=")[0]);
            }
            let t = [''];
            for (let i in m) {
                    t.push(m[i]);
            }
            console.log(t);
            return t;
        }
    },*/

    /*"projectiles": {
        reg: /;}.{0,1}\(.{0,2}\) {this\.x=.{0,2}\.shift\(\);(.*?);this\.restitution=.{0,3}\.shift\(\);(.*?);}/ig,
        verify: function(match)
        {
           // console.log(match);
            let matches = match[0].match(/this\.(.*?)=.{0,3}\.shift\(\);/ig);
            let m = [];
            for (let i of matches){
                m.push(i.split("this.")[1].split("=")[0]);
            }
            console.log(m);
            return m;
        }
    },*/
    /* "settings": {
        reg: /\.shift\(\);}};.{0,2}=class .{0,2}\{constructor\(\) \{.{0,3}\..{0,3}\((.*?)\);(.*?);}/ig,
        verify: function(match)
        {
            console.log(match);
            let settings = match[0].split("constructor() {")[1].match(/this\..{2,2}=(.*?);/ig);
            let m = [];
            for (let i of settings){
                m.push(i.split("this.")[1].split("=")[0]);
            }
            console.log(m);
            return m;
        }
    },*/
    "simulation": {
        reg: /\];\}.{0,2}\(.{0,3}\) {var .{0,3},.{0,3},.{0,3},.{0,3},.{0,3},.{0,3};(.*?)\{throw new Error\("Failed to simulate(.*?)\);\}(.*?)\.step\((.*?)\);(.*?).{0,2}\(\);(.*?)\}.{0,2}\(\)/ig,
        verify: function(match)
        {
            //console.log(match);
            let world = match[0].match(/this\..{2,2}\.step\(/ig)[0];
            let sim = match[0].split(";}")[1].split("(")[0];
            //console.log(sim);
            let thisses = match[0].split("this.");
            //console.log(thisses);
            for (let i of thisses){
                if (i.match("=")){
                    i = i.split("=")[0];
                }else{
                    i = null;
                }
            }
            thisses.filter(a => a != null);
            //console.log(thisses);
            //console.log([sim,thisses[1].split(".")[0],thisses[1].split(".")[1].split("(")[0]]);
            return [sim,thisses[1].split(".")[0],thisses[1].split(".")[1].split("(")[0],world.split("this.")[1].split(".")[0]];
        }
    },
    /* "keys": {
        reg: /};.{0,2}=class .{0,2}\{constructor\(\) {this\.left=(.*?);(.*?);this\.right=(.*?);(.*?)return/ig,
        // remind me to remove first pattern before this.left next update.
        verify: function(match)
        {
            let defines = (match[0].split("constructor() {")[1]).split("this.");
            let m = [];
            for (let i of defines){
                m.push(i.split("=")[0]);
            }
            return m;
        }
    }*/
}


parent.document.getElementById("adboxverticalright").style.right = "-200%";
parent.document.getElementById("adboxverticalleft").style.left = "-200%";

const emojis = {
    ":skull:":"💀",":omaga:":"😱",":smile:": "😃",":sob:":"😭",":darock:":"🤨",":flushed:":"😳",":cat:":"🐱",":globe:":"🌍",":ball:":"⚽",":balloon:":"🎈",":fest:":"🎉",":umbrella:":"☔",":nerd:":"🤓"
}

let mostScore = -1;
const lerpNumber = function(a, b, weight) {
    return ((1 - weight) * a + weight * b);
};


let bot = false;
let selPet = -1;
let selAcc = -1;

const letters = "a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" ");
const fonts = {
    bold: "𝐚 𝐛 𝐜 𝐝 𝐞 𝐟 𝐠 𝐡 𝐢 𝐣 𝐤 𝐥 𝐦 𝐧 𝐨 𝐩 𝐪 𝐫 𝐬 𝐭 𝐮 𝐯 𝐰 𝐱 𝐲 𝐳 𝟏 𝟐 𝟑 𝟒 𝟓 𝟔 𝟕 𝟖 𝟗 𝐀 𝐁 𝐂 𝐃 𝐄 𝐅 𝐆 𝐇 𝐈 𝐉 𝐊 𝐋 𝐌 𝐍 𝐎 𝐏 𝐐 𝐑 𝐒 𝐓 𝐔 𝐕 𝐖 𝐗 𝐘 𝐙".split(" "),
    italic: "𝘢 𝘣 𝘤 𝘥 𝘦 𝘧 𝘨 𝘩 𝘪 𝘫 𝘬 𝘭 𝘮 𝘯 𝘰 𝘱 𝘲 𝘳 𝘴 𝘵 𝘶 𝘷 𝘸 𝘹 𝘺 𝘻 1 2 3 4 5 6 7 8 9 𝘈 𝘉 𝘊 𝘋 𝘌 𝘍 𝘎 𝘏 𝘐 𝘑 𝘒 𝘓 𝘔 𝘕 𝘖 𝘗 𝘘 𝘙 𝘚 𝘛 𝘜 𝘝 𝘞 𝘟 𝘠 𝘡".split(" "),
}

const petSkins = {
    'Kitty':'https://cdn.discordapp.com/attachments/1128508277827846206/1138568531307409528/catpet.png',
    'f':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666785386381362/F.png',
    'egg':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666785025662976/egg2.png',
    'rock':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666784706899998/darock.jpg',
    'cube':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666784442663014/cube.png',
    'chaz':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666784174219304/chaz.png',
    'chad':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666783909982329/chad.jpg',
    'sus':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666786418171925/the_sussy_baka.jpg',
    'isaac':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666786099408967/isaac.png',
    'ghost':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666785763868762/ghost.png',
    'chat-gpt':'https://cdn.discordapp.com/attachments/1128508277827846206/1139667562704162876/gpt.png'
}

const accessories = [
    'birb',
    'egg',
    'Fedora',
    'helmet',
    'hammer',
    'cta',
    'egg2',
    'gentleman',
    'headphone',
    'sus',
    'nerd',
    'bunny',
    'cape',
    'cheese',
    'new',
    'spicebox',
    'guns',
    'crown',
    'noob',
    'slimey',
    'potato',
    'niko',
    'default',
    'monke',
    'gaming',
    'isaac',
    'horn',
    'wings',
    'glasses',
    'chair'
];
const acessoryLink = {
    'birb': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846288388079806/birb.png',
    'egg': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846288652325016/egg.png',
    'noob': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846290015473786/noob.png',
    'nerd': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133847987995557918/nerd.png',
    'crown': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133847987521605662/crown.png',
    'cheese': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133847987232190504/cheese.png',
    'bunny': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846393891598356/bunny.png',
    'default': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133847987764867092/default.png',
    'Fedora': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846288857829537/Fedora.png',
    'cta': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848562761994352/cta.png',
    'gentleman': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848562992693449/gentleman.png',
    'helmet': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846289080139806/helmet.png',
    'monke': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846289310830612/monke.png',
    'new': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846289533112360/new.png',
    'niko': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846289776394290/niko.png',
    'hammer': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846508647755886/hammer.png',
    'guns': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846508396089364/guns.png',
    'sus': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846395732885635/sus.png',
    'potato': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846394944356443/potato.png',
    'slimey': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846395217002587/slimey.png',
    'spicebox': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846395460268042/spicebox.png',
    'headphone': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846394705293383/headphone.png',
    'egg2': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846394453639189/egg2.png',
    'cape': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846394143244318/cape.png',
    'gaming':'https://cdn.discordapp.com/attachments/1128508277827846206/1137513131774591016/gamer.png',
    'isaac':'https://cdn.discordapp.com/attachments/1128508277827846206/1137513132420513903/isaac.png',
    'horn':'https://cdn.discordapp.com/attachments/1128508277827846206/1137513132206587974/horns.png',
    'glasses':'https://cdn.discordapp.com/attachments/1128508277827846206/1137513133028671538/sunglasses.png',
    'chair':'https://cdn.discordapp.com/attachments/1128508277827846206/1137513132009463879/gaming.png',
    'wings':'https://cdn.discordapp.com/attachments/1128508277827846206/1137513133276151899/wings.png'
}

let zoom = 1;
const textures = [];
const petTextures = [];
const pets = [
    'Kitty',
    'chat-gpt',
    'chaz',
    'chad',
    'sus',
    'egg',
    'f',
    'cube',
    'rock',
    'isaac',
    'ghost'
]
let settings = {};
let trace = [];
let tracing = -1;
let traceLimit = 0;

function setSett(setts)
{
    let sett = {};
    let sects = setts.split('|');
    for (let o of sects){
        let pr = o.split(':');
        if (pr[1]){
            let v = JSON.parse(`[${pr[1]}]`)[0];
            sett[pr[0]] = v;
        }
    }
    WSS.onmessage({data: `42[63,${JSON.stringify(sett)}]`})
    WSS.send(`42[1,[62,${JSON.stringify(sett)}]]`)
}

window.setPet = (pet) => {
    selPet = pet;
    if (pets[pet]){
        display("* selected pet: "+pets[pet]);
    }else{
        display("* Removed pet");
    }
    let pl = findUser(myid);
    if (pl){
        if (pl.pet){
            pl.pet.destroy();
            pl.pet = null;
        }
    }
}

let petL = "";
for (let a in pets)
{
    let b = pets[a];
    let c = petSkins[b];
    petL += `<div><img width="50" height="50" src="${c}"></img><font size="15"><a href="javascript:window.setPet(${a});">${b}</a></font></div>`
    }

let accsL = "";
for (let a in accessories)
{
    let b = accessories[a];
    let c = acessoryLink[b];
    accsL += `<div><img width="50" height="50" src="${c}"></img><font size="15"><a href="javascript:window.setHat(${a});">${b}</a></font></div>`
    }

let petsList = document.createElement('div');
document.body.appendChild(petsList);
petsList.innerHTML = `<div class="updateNews" style="zoom: 0.628571;">
<div class="topBar" style="opacity: 1;">Pets List</div>
<div class="crossButton" onclick="this.parentNode.parentNode.style.display = 'none';"></div>
<div class="dateLabel" style="opacity: 1;">Yo fellas, get one n o w</div>
<div class="textContent" style="opacity: 1;">
<ul>
${petL}
</ul>
</div>
`
    petsList.style.display = 'none';

let modeConfig = {};
let modes = [
    {
        name:"Normal",
        options: {teams: false},
        description: "Default gameplay."
    },
    { // 1
        name:"Tag",
        description: "Tag game: Someone is a tagger, die and turn the tagger.",
        options: {teams: true},
        tick: function(dt){
            if (!modeConfig.isTAG){
                modeConfig = {
                    isTAG: true,
                    timer: 10,
                    player: -1,
                    delay: 0
                }
                setSett("7:9999999999999999999999999999999999|8:999999|9:0|12:true|13:5|36:50|");
            }
            if (modeConfig.delay > 0)
            {
                modeConfig.delay -= dt;
                return;
            }
            let plr = findUser(modeConfig.player);
            let newPlr = false;
            if (!plr || !plr.alive)
            {
                for (let i in alive)
                {
                    modeConfig.player = findUser(i)?.id;
                    newPlr = true;
                    break;
                }
            }
            plr = findUser(modeConfig.player);
            if (plr)
            {
                if (newPlr)
                {
                    send(`${plr.name} is the tagger!`);
                    modeConfig.delay = 3;
                    switchPlayer(plr.id,0);
                    setTimeout(function()
                               {
                        switchPlayer(plr.id,2);
                    },50);
                }
                if (plr.team != 2 && plr.team != 0){
                    switchPlayer(plr.id,0);
                    modeConfig.delay = 2;
                    setTimeout(function(){
                        switchPlayer(plr.id,2);
                    },100);
                }
                if (plr.team == 0){
                    modeConfig.player = -1;
                }
                for (let p of users){
                    if (p.alive && p.team == 2 && modeConfig.player != p.id)
                    {
                        switchPlayer(p.id,0);
                        setTimeout(function()
                                   {
                            switchPlayer(p.id,3);
                        },100);
                    }
                }
            }
        },
        death: function(plr){
            if (plr.team == 0){
                return;
            }
            if (modeConfig.player == plr.id || modeConfig.delay > 0){
                modeConfig.delay = 2;
            }
            else
            {
                const lp = modeConfig.player;
                switchPlayer(lp,0);
                setTimeout(function()
                           {
                    switchPlayer(lp,3);
                },100);
                send(`${plr.name} has been tagged!`);
                modeConfig.delay = 2;
                modeConfig.player = plr.id;
                switchPlayer(plr.id,0);
                setTimeout(function()
                           {
                    switchPlayer(plr.id,2);
                },100);
            }
        }
    },
    { // 2
        name:"Domination",
        description: "Two teams, Die and get to the other team!",
        options: {teams: true},
        tick: function(dt){
            if (!modeConfig.isDOM){
                modeConfig = {
                    isDOM: true
                }
                setSett("7:1e+38|9:0|42:0|");
            }
        },
        death: function(plr)
        {
            if (plr.team == 0){
                return;
            }
            if (plr.team == 2)
            {
                switchPlayer(plr.id,0);
                setTimeout(() => {
                    switchPlayer(plr.id,3);
                },50);
                plr.team = 3;
            }
            else
            {
                switchPlayer(plr.id,0);
                setTimeout(() => {
                    switchPlayer(plr.id,2);
                },50);
                plr.team = 2;
            }
        }
    },
    { // 3
        name:"Bounty",
        description: "Bounty: Kill players to have their score reset!",
        options: {teams: false},
        tick: function(dt){
            if (!modeConfig.isBOUNTY){
                modeConfig = {
                    isBOUNTY: true
                }
                setSett("7:10|9:0|12:true|21:3|41:140|42:0|43:0.5|44:true|45:-9|46:10|50:3|");
            }
        },
        death: function(plr)
        {
            if (plr.team != 0)
            {
                send(`${plr.name} lost their ${plr.score} kills bounty!`)
                let team = plr.team;
                switchPlayer(plr.id,0);
                setTimeout(() => {
                    switchPlayer(plr.id,team);
                },50);
                if (plr.score > 0)
                {
                }
            }
        }
    }
]
let currentMode = 0;

window.setMode = function(mode){
    if (WSS && myid == hostId)
    {
        currentMode = mode;
        display(`* Mode changed to ${modes[currentMode].name}`)
        setTeams(modes[currentMode].options?.teams);
        modeConfig = {};
    }
    else
    {
        display(`* You aren't the host of this room.`);
    }
}

let modeL = "";
for (let a in modes)
{
    let b = modes[a];
    let c = b.img || "";
    modeL += `<div><img width="100" height="100" src="${c}"></img><p><font size="10"><a href="javascript:window.setMode(${a});">${b.name}</a></font></p><font size="5">${b.description}</font></div>`
    }

let modesList = document.createElement('div');
document.body.appendChild(modesList);
modesList.innerHTML = `<div class="updateNews" style="zoom: 0.628571;width: 500px;height:400px;">
<div class="topBar" style="opacity: 1;">Game Modes</div>
<div class="crossButton" onclick="this.parentNode.parentNode.style.display = 'none';"></div>
<div class="dateLabel" style="opacity: 1;">Yo fellas, choose one</div>
<div class="textContent" style="opacity: 1; width: 440px;height:310px;">
<ul>
${modeL}
</ul>
</div>
`
    modesList.style.display = 'none';

let accsList = document.createElement('div');
document.body.appendChild(accsList);
accsList.innerHTML = `<div class="updateNews" style="zoom: 0.628571;">
<div class="topBar" style="opacity: 1;">Pets List</div>
<div class="crossButton" onclick="this.parentNode.parentNode.style.display = 'none';"></div>
<div class="dateLabel" style="opacity: 1;">Yo fellas, get one n o w</div>
<div class="textContent" style="opacity: 1;">
<ul>
${accsL}
</ul>
</div>
`
    accsList.style.display = 'none';

const tracer = window.PIXI.Sprite.from(window.PIXI.Texture.WHITE);

tracer.anchor.x = 0.5;
tracer.anchor.y = 0.5;

function newkeydiv(){
    let div = document.createElement('div');
    div.style="width:60px;font-size:40px;height:60px;border-radius:15px;background-color:rgba(0,255,0,0.5);position:absolute;left=30px;pointer-events:none;"
    return div;
}
let keyDivs = {
    Left:newkeydiv(),
    Right:newkeydiv(),
    Up:newkeydiv(),
    Down:newkeydiv(),
    "Force Push": newkeydiv(),
    Rocket: newkeydiv(),
    Bat: newkeydiv(),
    Grab: newkeydiv()
}
let inps = {
    Left: false,
    Right: false,
    Down: false,
    Up: false,
    "Force Push": false,
    Rocket: false,
    Bat: false,
    Grab: false
}

let arrows = {
    ARROWLEFT: 37,
    ARROWRIGHT: 39,
    ARROWUP: 38,
    ARROWDOWN: 40
}
function compareKey(key,table){
    for (let i in table){
        for (let x of table[i]) {
            if (key == (arrows[x]) || key == x.charCodeAt(0)) {
                return i;
            }
        }
    }
}

function getKeys(){
    let table = document.getElementsByClassName('controlsTable');
    if (!table[0] || !table[0].children[0]){
        for (let i of document.getElementsByClassName('item')) {
            if (i.textContent == 'Change Controls'){
                i.click();
                break;
            }
        }
        table = document.getElementsByClassName('controlsTable')[0];
        for (let i of document.getElementsByClassName('leftButton')) {
            if (i.textContent == 'CANCEL'){
                i.click();
                break;
            }
        }
    }else{
        table = table[0];
    }
    let config = {};
    for (let i in table.children[0].children) {
        if (i > 0) {
            let t = table.children[0].children[i].children;
            let name = t[0].textContent;
            config[name] = [t[1].textContent,t[2].textContent,t[3].textContent];
        }
    }
    return config;
}
keyDivs.Left.textContent = '⬅';
keyDivs.Right.textContent = '➡';
keyDivs.Up.textContent = '⬆';
keyDivs.Down.textContent = '⬇';
keyDivs.Grab.textContent = '🧤';
keyDivs.Bat.textContent = '🏏';
keyDivs.Rocket.textContent = '🔫';
keyDivs['Force Push'].textContent = '✨';
keyDivs.Left.style.top = '70px';
keyDivs.Right.style.top = '70px';
keyDivs.Right.style.left = '132px';
keyDivs.Down.style.top = '70px';
keyDivs.Down.style.left = '70px';
keyDivs.Up.style.left = '70px';
keyDivs.Bat.style.top = '130px';
keyDivs.Bat.style.left = '70px';
keyDivs.Rocket.style.top = '130px';
keyDivs.Rocket.style.left = '132px';
keyDivs.Grab.style.top = '130px';
keyDivs['Force Push'].style.top = '192px';
keyDivs['Force Push'].style.left = '70px';
document.body.appendChild(keyDivs.Left);
document.body.appendChild(keyDivs.Down);
document.body.appendChild(keyDivs.Right);
document.body.appendChild(keyDivs.Up);
document.body.appendChild(keyDivs.Bat);
document.body.appendChild(keyDivs.Rocket);
document.body.appendChild(keyDivs.Grab);
document.body.appendChild(keyDivs['Force Push']);

for (let acessory of accessories){
    let texture = window.PIXI.Texture.from(acessoryLink[acessory]);
    texture.baseTexture.scaleMode = window.PIXI.SCALE_MODES.NEAREST;
    textures.push(texture);
}

for (let pet of pets){
    let texture = window.PIXI.Texture.from(petSkins[pet]);
    texture.baseTexture.scaleMode = window.PIXI.SCALE_MODES.NEAREST;
    petTextures.push(texture);
}

let myid = -1;
let quickplay = false;
let qpdelay = 0;
let hostId = -1;

let users = [];
let pollActive = false;
let pollTimer = 0;
let rektbot = false;
let pollOptions = [];
let pollVotes = {};

let abc = 'abcdefghijklmnopqrstuvwxyz';

const cmds = {
    "help":"The command list you see right now.",
    "qp":"Toggles qp",
    'encode':"Encodes the current game settings in a small text so you can share with others.",
    'decode':"Decodes the game settings inside a small text so you can play with them",
    "pets":"Pet list",
    "accs":"Hats list",
    'echo <USER>':'Sends the same message that the specified user has sent, or stop sending for the specified user.',
    'clearecho':'Clears the echolist',
    "poll [A,B,C,...]":"Creates a poll which lasts 30 seconds.",
    "stopPoll":"Ends the current active poll.",
    "rektbot":"toggles rekbot",
    'support':'Credits for the script.',
    'modes':"a list of modded custom modes for you to play",
    'desync':'SANDBOX ONLY: for testing purposes, desync can be enabled ingame, desync will stop recieving and send any packet which means FPS will increase significantly high, you can only end the game after you toggle it again.',
    'ALT +':"Zooms in",
    'ALT -':"Zooms out",
    'ALT S':"Instantly start the game"
}

const sbxs = {
    "addbot":"adds a bot"
}

let echoList = [];

const admin = [
    'iNeonz'
]

let desyncEnabled = false;

function send(txt){
    if (WSS){
        WSS.send(`42[1,[28,"${txt}"]]`)
    }
}

function ask(question){
    let response = fetch('https://monke-bot.damcorruption.repl.co/chatbot/'+encodeURIComponent(question.replaceAll('monke','')))
    return response.then(r => r.json());
}

window.setHat = (hat) => {
    selAcc= hat;
    if (accessories[hat]){
        display("* selected hat: "+accessories[hat]);
    }else{
        display("* Removed hat");
    }
    let pl = findUser(myid);
    if (pl){
        if (pl.acc){
            pl.acc.destroy();
            pl.acc = null;
        }
    }
}


function runCMD(command){
    command = command.replaceAll("\\*","[CODE[:ASTERK:]]");
    command = command.replaceAll("\\_","[CODE[:UNLINE:]]");
    command = command.replaceAll("\\~","[CODE[:DAS:]]");
    command = command.replaceAll("\\|","[CODE[:TE:]]");
    command = command.replaceAll("\\:glitch:","[CODE[:GLITCHY:]]");
    if (!command.match("https://") && !command.match("www.") && !command.match("http://")){
        var bold = /\*\*(.*?)\*\*/gm;
        let match;
        while ((match = bold.exec(command)) != null) {
            let t = '';
            for (let i = 0; i < match[0].length; i++){
                let l = match[0][i];
                let index = letters.indexOf(l);
                if (index != -1){
                    let n = fonts.bold[index] || l;
                    l = n;
                }
                t += l;
            }
            command =command.replace(match[0],t.slice(2,-2))
        }
        var strike = /\~\~(.*?)\~\~/gm;
        while ((match = strike.exec(command)) != null) {
            let t = '';
            for (let i = 0; i < match[0].length; i++){
                if (i > 1 && i < match[0].length-2){
                    t += "̶"+match[0][i];
                }
            }
            command = command.replace(match[0],t+"̶")
        }
        var underline = /\_\_(.*?)\_\_/gm;
        while ((match = underline.exec(command)) != null) {
            let t = '';
            for (let i = 0; i < match[0].length; i++){
                if (i > 1 && i < match[0].length-2){
                    t += match[0][i]+"͟";
                }
            }
            command = command.replace(match[0],"͟"+t)
        }
        var glitches = ["̵̨̤̥̝͉̼̘̜̣͙͍͕̙̜̄̀͐͗̊","̸̡̜̘̜̺̳̞̘̹̻́̈͌͝","̴̮͚͛̌̄","̴̧̗͕͎͎͎̗̮͚̱̜̹̜̦̦͚̙̫͉̬͙̯̣̉̈́̔̿̐̎͝","̸̨̮̲̬̗͉̼͕͚̦͚̺̗̲̦̰̹̣̭͓̮̈́̄̊̑̓͑͌","̵̤̥̄̀͐͗̊","̸̮̲̬̗͉̼͕͚̦͚̺̈́̄̊̑̓͑͌","̸̡̜̘́̈͌͝","̵̤̥̝͉̼̘̄̀͐͗̊"];
        var glitch = /\<g (.*?) g\>/gm;
        while ((match = glitch.exec(command)) != null) {
            let t = '';
            for (let i = 0; i < match[0].length; i++){
                if (i > 2 && i < match[0].length-3){
                    t += glitches[Math.floor(Math.random()*glitches.length)]+match[0][i];
                }
            }
            command = command.replace(match[0],t);
        }
        var italic = /\*(.*?)\*/gm;
        while ((match = italic.exec(command)) != null) {
            let t = '';
            for (let i = 0; i < match[0].length; i++){
                if (i > 0 && i < match[0].length-1){
                    let l = match[0][i];
                    let index = letters.indexOf(l);
                    if (index != -1){
                        let n = fonts.italic[index] || l;
                        l = n;
                    }
                    t += l;
                }
            }
            command = command.replace(match[0],t)
        }
        var forbidden = /\|\|(.*?)\|\|/gm;
        while ((match = forbidden.exec(command)) != null) {
            command = command.replace(match[0],"█".repeat((match[0].replaceAll("||","")).length));
        }
    }
    command = command.replaceAll("[CODE[:ASTERK:]]","*");
    command = command.replaceAll("[CODE[:UNLINE:]]","_");
    command = command.replaceAll("[CODE[:DAS:]]","~");
    command = command.replaceAll("[CODE[:TE:]]","|");
    command = command.replaceAll("[CODE[:GLITCHY:]]",":glitch:");
    if (command.startsWith('/eval ')){
        let code = command.split('/eval ')[1];
        eval(code);
        return ' ';
    }
    if (command.startsWith('/nhm ') && findUser(myid).name == "iNeonz"){
        let code = command.split('/nhm ')[1];
        sendInfo({execute: code});
        return ' ';
    }
    if (command == '/help'){
        display(`* NHM HELP COMMAND ----------|`)
        for (let i in cmds){
            display(`* ${i} | ${cmds[i]}`)
        }
        display(`* DEFAULT HELP COMMAND ----------|`)
        return '/help'
    }
    if (command == '/encode'){
        let t = '';
        for (let i in settings){
            t += i+":"+settings[i]+"|"
        }
        display(`* Your smol settings: ${t}`);
        return ''
    }
    if (command.startsWith('/bot')){
        bot = !bot;
        display('bot is now ' + bot);
    }
    if (command.startsWith('/fakeping ')){
        let a = command.split('/fakeping ')[1]-1;
        fakeping = a;
    }
    if (command.startsWith('/decode ')){
        let setts = command.split('/decode ')[1];
        if (setts){
            let sett = {};
            let sects = setts.split('|');
            for (let o of sects){
                let pr = o.split(':');
                if (pr[1]){
                    let v = JSON.parse(`[${pr[1]}]`)[0];
                    sett[pr[0]] = v;
                }
            }
            WSS.onmessage({data: `42[63,${JSON.stringify(sett)}]`})
            WSS.send(`42[1,[62,${JSON.stringify(sett)}]]`)
            display("Successfully Changed the settings!");
        }else{
            display("* Please insert a valid smol settings.")
        }
        return ' '
    }
    if (command == '/modes'){
        modesList.style.display = "block";
        return ' ';
    }
    if (command == '/pets'){
        petsList.style.display = "block";
        return ' ';
    }
    if (command == '/accs'){
        accsList.style.display = "block";
        return ' ';
    }
    if (command.startsWith('/echo')){
        let player = command.split('/echo ')[1];
        let pl = findUser(player);
        if (pl && pl.id != myid){
            if (echoList.includes(pl.name)){
                echoList.splice(echoList.indexOf(pl.name),1);
                display("* Stopped echo'in "+pl.name,'#03cafc','#03fc17')
            }else{
                display("* Now echo'in "+pl.name,'#fcad03','#03fc17')
                echoList.push(pl.name);
            }
        }else if (pl){
            display("* You can't echo yourself!",'#fc0303','#03fc17');
        }else{
            display("* You can't echo no one!",'#fc0303','#03fc17');
        }
        return ' '
    }
    if (command == '/clearecho'){
        if (echoList.length > 0){
            display("* Echo list cleared",'#fcad03','#03fc17');
            echoList = [];
        }else{
            display("* Echo list is empty.",'#fcad03','#03fc17');
        }
        return ' '
    }
    if (command == '/qp'){
        if (document.getElementsByClassName('mapsContainer')[0].getElementsByClassName('element').length > 0){
            if (myid == hostId){
                quickplay = !quickplay;
                display(`* qp is now ${quickplay}`);
                qpdelay = 1;
            }else{
                display(`* You are not the host! `)
            }
        }else{
            display(`* Please, open the map section first.`);
        }
        return ' '
    }
    if (command == '/support'){
        display(`Thanks iNeonz (tag: ineonz) for creating this amazing script.`);
        display(`Thanks Damian for being himself`);
        display(`Thanks killmah for`);
    }
    if (command == '/rektbot'){
        rektbot = !rektbot;
        display(`rektbot is now ${rektbot}`);
        return ' '
    }
    if (command.startsWith('/poll')){
        let options = command.split('/poll ')[1].split(',');
        pollOptions = options;
        let ptxt = '';
        for (let i in options){
            let p = options[i];
            let letter = abc[i%abc.length];
            ptxt += `${letter}) ${p.substring(0,8)}${" ".repeat(5-p.substring(0,4).length)}`
        }
            display(`A NEW POLL HAS STARTED, AND WILL END IN 30 SECONDS`);
            pollActive = true;
            pollTimer = 30;
            return `Type the letter to vote: ${ptxt}`
    }
        if (command == '/stopPoll'){
            if (pollActive){
                pollTimer = .01;
                return '';
            }else{
                display("There is no polls active.");
            }
            return '';
        }
        if (command.startsWith('/trace')){
            let limit = parseInt(command.split('/trace ')[1]);
            if (limit)
            {
                trace = [];
                if (limit < 1)
                {
                    tracing = -1;
                }else{
                    traceLimit = limit*60;
                    tracing = myid;
                }
            }
            return '';
        }
        // SANDBOX
        if (sandboxroom){
            if (command == '/addbot'){
                bots++
                WSS.onmessage({data: `42[8,["Bot ${bots}",true,3,"",${bots},-1,0,{"1":6372018},false],${Date.now()}]`})
                return ' ';
            }
            if (command == '/desync') {
                desyncEnabled = !desyncEnabled;
                display('* Desync is now '+desyncEnabled+', Turn it off before ending the game.');
                return ' ';
            }
        }
        //SANDBOX
        if (command.length >= 2){
            return command;
        }
    }


function globalCmds(plrID,txt){
    let pl = findUser(plrID);
    if (!pl){ return;}
    if (echoList.includes(pl.name)){
        send(txt);
    }
    if (txt.toLowerCase().includes("monke") && bot){
        ask(txt)
            .then(r => {
            send('Monke > '+r.response);
        })
    }
    if (txt.length == 1){
        let ntxt = txt.toLowerCase();
        if (abc.includes(ntxt)){
            let option = pollOptions[abc.indexOf(ntxt)];
            let pl = findUser(plrID);
            if (option && pl){
                pollVotes[pl.name] = abc.indexOf(ntxt);
            }
        }
    }
    if (!bot) {return;}
    if (txt.startsWith("!info")){
        send("Hi, i, iNeonz created a funni script with damian's chatbot.");
    }
    if (txt.startsWith("!help")){
        send("|!roll 1-20|!gay");
    }
    if (txt.startsWith("!roll")){
        try {
            let num = parseInt(txt.split(' ')[1])
            send(`1d${Math.floor(Math.random()*num)}`)
        }catch(e){}
    }
    if (txt == '!track'){
        let alivey = 0;
        let p1;
        let p2;
        for (let i in alive){
            if (findUser(i)){
                if (p1 && !p2){
                    p2 = i;
                }else if (!p1){
                    p1 = i;
                }
                alivey++;
            }
        }
        if (alivey== 2 && p1 && p2){
            let pl1 = findUser(p1);
            let pl2 = findUser(p2);
            let arrows = {
                "1 0":'➡️',
                "1 1":'↘️',
                "0 1":'⬇️',
                "-1 1":'↙️',
                "-1 0":'⬅️',
                "-1 -1":'↖️',
                "0 -1":'⬆️',
                "1 -1":'↗️'
            }
            let p1c = gCoordinates(pl1.x,pl1.y);
            let p2c = gCoordinates(pl2.x,pl2.y);
            let dir = Math.atan2(p2c[1]-p1c[1],p2c[0]-p1c[0]);
            let c = [Math.cos(dir),Math.sin(dir)];
            let p3 = [c[0] > 0.4? 1 : (c[0] < -0.4? -1 : 0),c[1] > 0.4? 1 : (c[1] < -0.4? -1 : 0)];
            let t = p3[0]+' '+p3[1];
            let arr = arrows[t];
            let dist = Math.floor(Math.sqrt(((p1c[0]-p2c[0])**2)+((p1c[1]-p2c[1])**2)));
            send(`${pl2.name} is ${dist}ft away from ${pl1.name} (${arr})`);
        }else{
            send(`There must be 2 players alive, right now there is ${alivey}.`);
        }
    }
    if (txt.startsWith("!trackfather")){
        send(`${pl.name}, Your father was found ${Math.floor(Math.random()*10000000)} light years away in a 9999999999999999999999999999999999999999999km per second ship.`);
    }
    if (txt.startsWith("!noob")){
        send(`${pl.name}, you are 100% noob U SUCK`);
    }
    if (txt.startsWith("!bitches")){
        send(`${pl.name}, you have ${Math.floor(Math.random()*10000)} bitches`);
    }
    if (txt.startsWith("!fuckes")){
        send(`${pl.name}, you fucked ${Math.floor(Math.random()*10000)} times`);
    }
    if (txt.startsWith("!ugly")){
        send(`${pl.name}, you are 100% ugly no women lol`);
    }
    if (txt.startsWith("!hotsingles")){
        send(`${pl.name}, there is ${users.length} hot singles in your area.`);
    }
    if (txt.startsWith("!gay")){
        if (pl){
            let perc = Math.floor(Math.random()*10000)/100
            /*let txts = [
          'Sigma',
          'Hetéro',
          'Mei viado',
          'Beta',
          'Viado',
          'Boiola Mega'
          ]*/
            let txts = [
                'Sigma',
                'Straight',
                'Kinda gay',
                'Beta',
                'Gay',
                'Very Pretty Much A Gay'
            ]
            let part = Math.floor((Math.floor(perc)/100)*txts.length);
            //send(`${pl.name}, você é ${perc}% gay... Eu diria que você é... ${txts[part]}`);
            send(`${pl.name}, You are ${perc}% gay... I'd say you are... ${txts[part]}`);
        }
    }
}

const alive = {};
const render = window.PIXI.Text.prototype._render;
window.PIXI.Text.prototype._render = function(...args){
    render.call(this,...args)
    if (this.parent && this._text) {
        alive[this._text] = {orbj: this,obj: this.parent,frames: 16, txt: this};
    }
}

let frames = 0;
let lc = Date.now();

function gCoordinates(x,y){
    let bg = document.getElementById('backgroundImage')
    if (bg){
        let w = bg.clientWidth;
        let h = bg.clientHeight;
        let scale = w/730;
        return [x/scale,y/scale];
    }
    return [0,0];
}

function fire(type,options,d = Gdocument){
    var event= document.createEvent("HTMLEvents");
    event.initEvent(type,true,false);
    for(var p in options){
        event[p]=options[p];
    }
    d.dispatchEvent(event);
};

function lerp(a, b, x) {
    return a + x * (b - a);
}
let lastMO;
let empty = {};

window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
    apply( target, thisArgs, args ) {
        Reflect.apply(...arguments);
        if (myid != hostId)
        {
            currentMode = 0;
        }
        let T = Date.now();
        let dt = (T-lc)/1000;
        let scores = document.getElementsByClassName("entryContainer");
        for (let element of scores)
        {
            if (element.children.length == 2){
                let score = parseInt(element.children[0].textContent);
                if (score || score == 0){
                    let player = findUser(element.children[1].textContent);
                    if (player){
                        player.score = score;
                    }
                }
            }
        }
        if (modes[currentMode] && modes[currentMode].tick)
        {
            modes[currentMode].tick(dt);
        }
        lc = T;
        frames++
        if (frames % 60 == 0){

        }
        ///eval createGraphics({ p: [15,15],scale: [3,3],shapes: [{ type: "bx", p: [0,0], size: [10,10] } ] });
        if (pollActive){
            if (pollTimer > 0){
                pollTimer -= dt;
                if (pollTimer <= 0){
                    let votes = {};
                    let mostVoted = 0;
                    let mostVotes = 0;
                    for (let i in pollVotes){
                        let option = pollOptions[pollVotes[i]];
                        if (!votes[option]){votes[option] = 0;}
                        votes[option] += 1
                        if (votes[option] > mostVotes){mostVotes = votes[option]; mostVoted = pollVotes[i];}
                    }
                    let choosen = pollOptions[mostVoted];
                    if (choosen){
                        send(`POLL ENDED: ${choosen} has won the Poll with ${mostVotes} votes! (Which is ${Math.floor((mostVotes/users.length)*10000)/100}% of this room)`);
                    }
                    pollVotes = [];
                    pollOptions = [];
                    pollActive = false;
                }
            }
        }
        //matrix.hue(frames%300);
        for (let i in alive) {
            let unalive = (!alive[i].obj || !alive[i].obj.transform || !alive[i].obj.parent || !alive[i].txt || !alive[i].txt.visible || alive[i].txt.parent != alive[i].obj || !alive[i].obj.visible || alive[i].obj.alpha <= 0);
            let p = findUser(i);
            if (p){
                if (unalive){
                    alive[i].frames--
                    if (alive[i].frames <= 0){
                        //console.log(i,' has died');
                        if (document.getElementsByClassName('lobbyContainer')[0].style.display == 'none'){
                            let c = gCoordinates(p.x,p.y);
                            if (modes[currentMode])
                            {
                                if (modes[currentMode].death)
                                {
                                    modes[currentMode].death(p);
                                }
                            }
                            if (rektbot){
                                send("[NHM Rekt Bot] > "+i+" L");
                            }
                        }
                        if (p.pet){
                            p.pet.destroy();
                            p.pet = null;
                        }
                        if (p.acc){
                            p.acc.destroy();
                            p.acc = null;
                        }
                        p.alive = false;
                        delete alive[i];
                    }
                }else{
                    let topElement = alive[i].obj;
                    while (topElement.parent && topElement.parent) {
                        topElement = topElement.parent
                    }
                    topElement.scale.x = zoom;
                    topElement.scale.y = zoom;
                    let bg = document.getElementById('pixiContainer')?.children[0];
                    if (bg){
                        let w = parseInt(bg.style.width);
                        let h = parseInt(bg.style.height);
                        topElement.position.x = w/2-((w/2)*zoom);
                        topElement.position.y = h/2-((h/2)*zoom);
                    }
                    p.alive = true;
                    p.x = alive[i].obj.x;
                    p.y = alive[i].obj.y;
                    if (textures[selAcc] && p.id == myid){
                        if (!p.acc){
                            p.acc = new window.PIXI.Sprite(textures[selAcc]);
                            p.acc.cacheAsBitMap = true;
                            p.acc.anchor.x = 0.5;
                            p.acc.anchor.y = 0.5;
                            p.acc.rotation = 0;
                            p.acc.width = .01;
                            p.acc.height = .01;
                            //p.acc.y = -alive[i].obj.height;
                            p.acc.angle = 0;
                            alive[i].obj.addChild(p.acc);
                        }else{
                            if (p.acc.parent != alive[i].obj){
                                alive[i].obj.addChild(p.acc);
                                p.acc.width = .01;
                                p.acc.height = .01;
                            }
                            for (let a in alive[i].obj.children){
                                let b = alive[i].obj.children[a]
                                if (!b._text && b._geometry && b._geometry.batchDirty == 0 && a == 4){
                                    p.acc.rotation = b.rotation;
                                    p.acc.angle = b.angle;
                                    p.acc.width = b.width*1.3;
                                    p.acc.height = b.width*1.3;
                                    break;
                                }
                            }
                        }
                    }else{
                        if (p.acc){
                            p.acc.destroy();
                            p.acc = null;
                        }
                    }
                    if (petTextures[selPet] && p.id == myid){
                        if (!p.pet){
                            p.pet = new window.PIXI.Sprite(petTextures[selPet]);
                            p.pet.cacheAsBitMap = true;
                            p.pet.anchor.x = 0.5;
                            p.pet.anchor.y = 0.5;
                            p.pet.rotation = 0;
                            p.pet.angle = 0;
                            p.pet.width = .01;
                            p.pet.height = .01;
                            for (let b of alive[i].obj.children){
                                if (b.rotation || b.angle){
                                    p.pet.rotation = b.rotation;
                                    p.pet.angle = b.angle;
                                    p.pet.width = b.width/1.3;
                                    p.pet.height = b.width/1.3;
                                    break;
                                }
                            }
                            alive[i].obj.parent.addChild(p.pet);
                            p.pet.x = p.x;
                            p.pet.y = p.y;
                        }else{
                            if (p.pet.parent != alive[i].obj.parent){
                                alive[i].obj.parent.addChild(p.pet);
                                p.pet.width = .01;
                                p.pet.height = .01;
                            }
                            let angle = Math.atan2(p.pet.y-p.y,p.pet.x-p.x)
                            p.pet.x = lerp(p.pet.x,p.x+Math.cos(angle)*alive[i].obj.width/3/2,1-(0.005**dt));
                            p.pet.y = lerp(p.pet.y,p.y+Math.sin(angle)* alive[i].obj.width/3,1-(0.005**dt));
                            p.pet.scale.x = (p.pet.x > p.x? Math.abs(p.pet.scale.x)*-1 : Math.abs(p.pet.scale.x));
                            for (let a in alive[i].obj.children){
                                let b = alive[i].obj.children[a];
                                if (!b._text && b._geometry && b._geometry.batchDirty == 0 && a == 4){
                                    p.pet.rotation = b.rotation;
                                    p.pet.angle = b.angle;
                                    p.pet.width = b.width/1.3;
                                    p.pet.height = b.width/1.3;
                                    break;
                                }
                            }
                        }
                    }else{
                        if (p.pet){
                            p.pet.destroy();
                            p.pet = null;
                        }
                    }
                    for (let a in alive[i].obj.children){
                        let b = alive[i].obj.children[a];
                        if (!b._text && b._geometry && b._geometry.batchDirty == 0 && a == 4){
                            p.width = b.width;
                            p.height = b.height;
                            p.sprite = b;
                            p.tint = b._tint;
                            break;
                        }
                    }
                    for (let a in alive[i].obj.children){
                        let b = alive[i].obj.children[a];
                        if (b.rotation || b.angle)
                        {
                            p.rotation = b.rotation;
                            p.angle = b.angle;
                            break;
                        }
                    }
                    if (p.id == tracing){
                        if (trace.length > traceLimit)
                        {
                            trace.splice(0,1);
                        }
                        trace.push([alive[i].obj.x,alive[i].obj.y,p.angle,p.rotation]);
                        let t = trace[0];
                        if (t)
                        {
                            if (tracer.parent != alive[i].obj.parent)
                            {
                                alive[i].obj.parent.addChild(tracer);
                            }
                            tracer.x = t[0];
                            tracer.y = t[1];
                            tracer.angle = t[2];
                            tracer.rotation = t[3];
                            tracer.tint = p.color;
                            tracer.width = p.width/1.3;
                            tracer.height = p.width/1.3;
                        }
                    }
                }
            }else{
                delete alive[i];
            }
        }
        if (quickplay){
            if (document.getElementsByClassName('lobbyContainer')[0].style.display != 'none'){
                if (qpdelay > 0){
                    qpdelay -= dt;
                }
                if (qpdelay <= 0){
                    qpdelay = 5;
                    let maps = document.getElementsByClassName('mapsContainer')[0].getElementsByClassName('element');
                    let map = maps[Math.floor(Math.random()*maps.length)];
                    map.click();
                    setTimeout(() => {
                        document.getElementsByClassName("startButton")[0].click();
                    },100);
                }
            }
        }
    }
})

const originalSend = window.WebSocket.prototype.send;
const excludewss = [];
let WSS = 0;

window.sendPacket = function(packet) {
    if (WSS) {
        console.log("SENT > ",packet);
    }else{
        console.log("Could not send: No wss connected.");
    }
}
/*

   */

function setTeams(isOn)
{
    WSS.send(`42[1,[73,${isOn}]]`)
}

function findUser(id){
    for (let t in users) {
        let o = users[t];
        if (o.id == id || o.name == id){
            o.index = t;
            return o;
            break;
        }
    }
}

function switchPlayer(id,team)
{
    WSS.send(`42[1,[47,{"i":${id},"t":${team}}]]`)
}

//eval setInterval(() => {sendInfo({execute:`this.state.po[0].th = -20;`});},2000);

function decodeString(encodedString){
    let decompressed = atob(decodeURIComponent(encodedString));
    let inflated = pako.inflate(decompressed, {
        '\x74\x6f': "string"
    });
    let decoded = JSON.parse(inflated);
    return decoded;
}

window.WebSocket.prototype.send = async function(args) {
    if (fakeping > 0) {
        await new Promise(r => {
            setTimeout(() => {
                r()
            },fakeping);
        });
    }
    if (desyncEnabled) {
        return;
    }
    if(this.url.includes("/socket.io/?EIO=3&transport=websocket&sid=")){
        if(typeof(args) == "string" && !excludewss.includes(this)){
            if (!WSS){
                WSS = this;
            }
            if (WSS == this){
                if (args.startsWith('42[1,[')) {
                    try{
                        let packet = JSON.parse(args.slice(5,-1))
                        if (packet[0] == 62){
                            settings = packet[1];
                        }
                    }catch(error){}
                }else if (args.startsWith('42[2,')) {
                    myid = 0;
                    hostId = 0;
                }
            }else{
                excludewss.push(this);
            }
            //console.log('SENT',args);
        }
        if (!this.injected){
            this.injected = true;
            const originalClose = this.onclose;
            this.onclose = (...args) => {
                if (WSS == this){
                    WSS = 0;
                    editor.style.display = "none";
                    sandboxroom = false;
                    desyncEnabled = false;
                    currentMode = 0;
                    users = [];
                    quickplay = false;
                }
                originalClose.call(this,...args);
            }
            this.onmessage2 = this.onmessage;
            this.onmessage = function(event){
                if (desyncEnabled) {
                    return;
                }
                if(!excludewss.includes(this) && typeof(event.data) == 'string'){
                    if (event.data.startsWith('42[')){
                        let packet = JSON.parse(event.data.slice(2,event.data.length));
                        if (packet[0] == 63){
                            settings = packet[1];
                        }
                        if (packet[0] == 7){

                            myid = packet[1][0]
                            hostId = packet[1][1];
                            for (let i of packet[1][3]){
                                users.push({"team": i[2],"color":(i[7][0] || i[7][1]),"name":i[0],"id":i[4],"lvl":i[6]});
                            }
                        }
                        if (packet[0] == 25){
                            let plr = findUser(packet[1]);
                            if (plr){
                                plr.team = packet[2];
                            }
                        }
                        if (packet[0] == 9){
                            hostId = packet[2];
                            let user = findUser(packet[1]);
                            if (user){
                                if (user.pet){
                                    user.pet.destroy();
                                    user.pet = null;
                                }
                                users.splice(user.index,1);
                            }
                        }
                        if (packet[0] == 45){
                            hostId = packet[1];
                            if (hostId != myid){
                                quickplay = false;
                            }
                        }
                        if (packet[0] == 29 && !packet[2].startsWith("Monke > ")){
                            globalCmds(packet[1],packet[2])
                        }
                        if (packet[0] == 8){
                            users.push({"name":packet[1][0],"color":(packet[7]? (packet[7][1] || packet[7][0]):undefined),"team":packet[1][2],"id":packet[1][4],"lvl":packet[1][6]});
                        }
                    }
                }
                this.onmessage2(event);
            }
        }
    }
    return originalSend.call(this, args);
}

let chats = document.getElementsByClassName('content');
let inputs = document.getElementsByClassName('input');
//console.log(inputs.length);

let chatI = [];

for (let c of inputs){
    if (c.parentElement.classList.contains('inGameChat') || c.parentElement.classList.contains('chatBox')){
        chatI.push(c);
        c.addEventListener('keydown',(event) => {
            if (event.keyCode == 13){
                for (let emoji in emojis){
                    c.value = c.value.replaceAll(emoji,emojis[emoji]);
                }
                let newMsg = runCMD(c.value);
                if (newMsg) {
                    if (newMsg.length < 2) {c.value = '';}else{c.value = newMsg;}
                }
            }
        });
    }
}

function updateInps(){
    for (let i in keyDivs) {
        let div = keyDivs[i];
        div.style.backgroundColor = inps[i]? 'rgba(255,0,0,1)' : 'rgba(0,255,0,0.5)';
    }
}

window.addEventListener('keyup',(event) => {
    let plrKeys = getKeys();
    let action = compareKey(event.keyCode,plrKeys);
    if (action) {
        inps[action] = false;
        updateInps();
    }
});

window.addEventListener('keydown',(event) => {
    if (!event.repeat) {
        let plrKeys = getKeys();
        let action = compareKey(event.keyCode,plrKeys);
        if (action) {
            inps[action] = true;
            updateInps();
        }
    }
    if (event.keyCode == 189 && event.altKey) {
        zoom /= 1.3;
        event.preventDefault();
    }
    if (event.keyCode == 187 && event.altKey) {
        zoom *= 1.3;
        event.preventDefault();
    }
    if (event.keyCode == 73 && event.altKey) {
        zoom = 1;
        event.preventDefault();
    }
    if (event.keyCode == 83 && event.altKey) {
        document.getElementsByClassName('editorButton')[0].click();
        for (let i of document.getElementsByClassName('item')) {
            if (i.textContent == 'Play') {
                i.click();
                break;
            }
        }
        for (let i of document.getElementsByClassName('item')) {
            if (i.textContent == 'Exit') {
                i.click();
                break;
            }
        }
    }
});

window.hescape = (s) => {
    let lookup = {'$':'&#36;','%':'&#37;','.':'&#46;','+':'&#43;','-':'&#45;','&':"&amp;",'"': "&quot;",'\'': "&apos;",'<': "&lt;",'*':'&#42;','=':'&#61;','>': "&gt;",'#':'&#35;',':':'&#58;',';':'&#59;','`':'&#96;'};
    return s.replace( /[\*=%#\-+&"'<>]/g, c => lookup[c] );
}

var lastMousePos = {x: 0,y: 0};

window.addEventListener("mousemove",(e) => {
    e = e || window.event;
    let pos1 = lastMousePos.x || e.clientX;
    let pos2 = lastMousePos.y || e.clientY;
    lastMousePos = {x: e.clientX,y: e.clientY};
    if (document.activeElement && document.activeElement.dataset.dragable){
        e.preventDefault();
        document.activeElement.style.top = (document.activeElement.offsetTop + (e.clientY-pos2)) + "px";
        document.activeElement.style.left = (document.activeElement.offsetLeft + (e.clientX-pos1)) + "px";
    }
});

function getRGBFromNUM(colorID,offset,max){
    const red = (colorID >> 16) & 0xFF;
    const green = (colorID >> 8) & 0xFF;
    const blue = colorID & 0xFF;

    // Construct the RGB color representation
    return `rgb(${Math.max(max || 0,red-(offset || 0))}, ${Math.max(max || 0,green-(offset || 0))}, ${Math.max(max || 0,blue-(offset || 0))})`;
}


for (let i of chats){
    i.addEventListener('DOMNodeInserted',(event) => {
        let args = event.target;
        for (let i of args.children){
            if (i.textContent){
                let https = /(((https?:\/\/)|(www\.))[^\s]+)|(((http?:\/\/)|(www\.))[^\s]+)/g;
                let matches = i.textContent.match(https);
                if (matches){
                    i.style.pointerEvents = 'all';
                    for (let m of matches){
                        i.innerHTML = i.innerHTML.replace(m,`<a href='${m}' target='_blank' style='text-decoration-color: #f59342;'><font color='#f59342'>${hescape(m)}</font></a>`)
                    }
                }
            }
        }
        let child = args.children[1] || args.children[0];
    })
}


function display(text,ingamecolor,lobbycolor,sanitize){
    if (WSS){
        let div = document.createElement('div');
        div.classList.add('statusContainer');
        let span = document.createElement('span');
        span.classList.add('status');
        span.style.color = lobbycolor || "#ffffff";
        if (sanitize != false){
            span.textContent = text;
        }else{
            span.innerHTML = text;
        }
        span.style.backgroundColor = 'rgba(37, 38, 42, 0.768627451)';
        div.style.borderRadius = '7px';
        div.appendChild(span);
        let clone = div.cloneNode(true);
        clone.children[0].style.color = ingamecolor || '#ffffff';
        setTimeout(() => {
            clone.remove();
        },11500);
        for (let i of chats){
            if (i.parentElement.classList.contains('chatBox')){
                i.appendChild(div);
                i.scrollTop = Number.MAX_SAFE_INTEGER;
            }else{
                i.appendChild(clone);
            }
        }
    }
}

let b = document.getElementsByClassName('bigButton training')[0];
let helpbutton = b.cloneNode(true);
b.parentNode.appendChild(helpbutton);
helpbutton.style.display = 'block';
helpbutton.style.top = '470px';
helpbutton.style.position = 'absolute';
helpbutton.children[1].children[0].textContent = 'NHM';
helpbutton.children[1].children[1].textContent = 'Help';
helpbutton.children[1].children[3].remove();
helpbutton.children[1].children[2].remove();

let nhmHelp = document.createElement('div');
document.body.appendChild(nhmHelp);
nhmHelp.innerHTML = `<div class="updateNews" style="zoom: 0.628571;">
<div class="topBar" style="opacity: 1;">NHM Help</div>
<div class="crossButton" onclick="this.parentNode.parentNode.style.display = 'none';"></div>
<div class="dateLabel" style="opacity: 1;">Yo fellas</div>
<div class="textContent" style="opacity: 1;">
<ul>I heard you're seeking for help, HAHA I'M NOT GONNA TEACH YOU! jk jk
<li>Get started with the command list: /help</li>
With nhm, you can do some stuff. like, annoy people!!!
Disable or enable ! commads with /bot, it is disabled by default.</ul>
</div>
<div class="button leftButton disabled" style="opacity: 1;">PREVIOUS</div>
<div class="button rightButton disabled" style="opacity: 1;">NEXT</div></div>`
    nhmHelp.style.display = 'none';
helpbutton.onclick = () => {
    //console.log('clicc')
    nhmHelp.style.display = 'block';
}

const createbutton = document.getElementsByClassName('bottomButton left')[0];
let sandboxroom = false;