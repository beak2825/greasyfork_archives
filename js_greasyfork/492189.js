// ==UserScript==
// @name         Neon's Gamemode Maker
// @namespace    http://tampermonkey.net/
// @version      v1.17
// @description  A Mod about custom gamemodes for hitbox.io.
// @author       iNeonz
// @match        https://heav.io/game.html
// @match        https://hitbox.io/game.html
// @match        https://heav.io/game2.html
// @match        https://hitbox.io/game2.html
// @match        https://hitbox.io/game-beta.html
// @require      https://unpkg.com/blockly/blockly.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heav.io
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/492189/Neon%27s%20Gamemode%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/492189/Neon%27s%20Gamemode%20Maker.meta.js
// ==/UserScript==

const version = "v1.17";
const codeNames = {};
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


let gmmTextures = {};
let gmmSounds = {};

function appendScript(link,head){
    let scr = document.createElement("script");
    scr.src = link;
    (head? document.head : document.body).appendChild(scr);
}


// TAKEN FROM BONK.IO'S CODE INJECTOR.
fetch(`https://hitbox.io/bundle.js`)
    .then(code => code.text())
    .then(code => {
    parent.document.getElementById("adboxverticalright").style.right = "-200%";
    parent.document.getElementById("adboxverticalleft").style.left = "-200%";
    for (let i in codeNamesRegex){
        codeNames[i] = codeNamesRegex[i].verify(code.match(codeNamesRegex[i].reg));
    }

    //codeNames.lv = [codeNames.general[4],codeNames.general[5]]
    let monacoCSS = document.createElement(`link`);
    monacoCSS.rel = "stylesheet";
    monacoCSS.setAttribute("data-name","vs/editor/editor.main.css");
    monacoCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs/editor/editor.main.css";

    let requirer = document.createElement("script");
    requirer.textContent = `
       var require = { paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs' } };
    `;
    document.body.appendChild(requirer);

    appendScript("https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs/loader.min.js");
    appendScript("https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs/editor/editor.main.nls.js");
    appendScript("https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs/editor/editor.main.js");
    document.head.appendChild(monacoCSS);

    //appendScript("https://unpkg.com/blockly/msg/en.js");

    // /eval let last; for (let i in window.multiplayerSession.YI.Hx){last = window.multiplayerSession.YI.Hx[i];} last.po[0].th = -5;
    const newScope = (scope, script) => Function(`"use strict"; const globalThis = null; const window = null; const document = null; const game = this; for (let i in game.usedMath) {Math[i] = (...args) => {return game.Math[i](...args)};}; ${script}`).bind(scope);
    let DN = [
        "gsFightersCollide",
        "recordMode",
        "o",
        "l",
        "u",
        "m",
        "g",
        "v",
        "k",
        "N",
        "S",
        "M",
        "C",
        "_",
        "T",
        "P",
        "B",
        "I",
        "F",
        "R",
        "O",
        "A",
        "D",
        "L",
        "U",
        "H",
        "J",
        "W",
        "G",
        "Y", // ss
        "V",
        "q",
        "K",
        "X",
        "Z",
        "$",
        "tt",
        "it",
        "st",
        "ht",
        "et",
        "nt",
        "ot",
        "rt",
        "at",
        "lt",
        "ut",
        "ct",
        "dt",
        "wt",
        "ft",
        "gt",
        "bt"
    ]

    function SeedRandom(state1,state2){
        var mod1=4294967087
        var mul1=65539
        var mod2=4294965887
        var mul2=65537
        if(typeof state1!="number"){
            state1=+new Date()
        }
        if(typeof state2!="number"){
            state2=state1
        }
        state1=state1%(mod1-1)+1
        state2=state2%(mod2-1)+1
        function random(limit){
            state1=(state1*mul1)%mod1
            state2=(state2*mul2)%mod2
            if(state1<limit && state2<limit && state1<mod1%limit && state2<mod2%limit){
                return random(limit)
            }
            return (state1+state2)%limit
        }
        return random
    }

    let stateMaker;
    let mostScore = -1;
    let game = {
        state: null,
        Math: {},
        usedMath: {
            "random":true
        }
    }
    let gmm = {
        enabled: false,
        pixi: {},
        overrides: {},
        applyOverrides: false,
        scopeFunc: null,
        collisions: [],
        destroyList: [],
        jointdestroyList: [],
        events: {
        }
    }
    window.gmm = gmm;
    const origRandom = Math.random;

    const gmmEvents = [
        "step",
        "step4each",
        "init",
        "init4each",
        'ondeath'
    ]

    for (let a1 in window.multiplayerSession){
        let a = window.multiplayerSession[a1];
        if (typeof a == "object")
        {
            let score = 0;
            for (let x1 in a){
                let x = a[x1];
                if (typeof x == "object")
                {
                    if (x.constructor.name == "Array"){

                    }
                    else
                    {
                        let length = 0;
                        for (let y1 in x){
                            let y = x[y1];
                            length++
                            if (length > 2){
                                break;
                            }
                        }
                        if (length == 1){
                            for (let y1 in x){
                                let y = x[y1];
                                if (y.constructor.name == "Map"){
                                    score++
                                }
                                break;
                            }
                        }else{
                            let isDN = true;
                            for (let i of DN){
                                if (!i in x){
                                    isDN = false;
                                    break;
                                }
                            }
                            if (isDN){
                                score+=5;
                            }
                        }
                    }
                }
            }
            if (score > mostScore && score < 50){
                mostScore = score;
                stateMaker = a;
            }
        }
    }
    function encodeState(state){
        let newState = state;
        newState.cubes = newState.all[8];
        newState.projectiles = [];
        for (let id in newState.all[9]){
            let proj = newState.all[9][id];
            if (proj && codeNames.general){
                if (!codeNames.projectiles){
                    let matches = String(proj.constructor).match(/this\.(.*?)=(.*?);/ig);
                    let m = [];
                    for (let i of matches){
                        m.push(i.split("this.")[1].split("=")[0]);
                    }
                    codeNames.projectiles = m;
                }
                let newProj = {
                    p: [proj.x,proj.y],
                    lv: [proj[codeNames.lv[0]],proj[codeNames.lv[1]]],
                    a: proj.angle,
                    av: proj.angularVelocity,
                    ftd: proj[codeNames.projectiles[10]],
                    tr: proj[codeNames.projectiles[14]], // turn rate
                    gs: proj[codeNames.projectiles[17]], // gravity scale
                    er: proj[codeNames.projectiles[15]], // explode radius
                    bb: proj[codeNames.projectiles[18]], // bullet bounces
                    owner: proj[codeNames.projectiles[13]],
                    round: proj[codeNames.projectiles[24]], // bullet round
                    restitution: proj.restitution, // bullet restitution
                    bc: proj[codeNames.projectiles[22]], // bounce count
                    br: proj[codeNames.projectiles[6]], // bullet radius
                }
                newState.projectiles[id] = newProj;
            }
        }
        for (let id in newState.all[13]){
            if (codeNames.general && newState.all[13][id]){
                let flag = newState.all[13][id];
                if (!codeNames.flags){
                    let constructor = String(flag.constructor);
                    let matches = constructor.match(/this\..{0,2}=(.*?);/ig);
                    let m = [];
                    for (let i of matches){
                        m.push(i.split("this.")[1].split("=")[0]);
                    }
                    let t = [''];
                    for (let i in m) {
                        t.push(m[i]);
                    }
                    codeNames.flags = t;
                }
                flag.p = [flag.x,flag.y];
                flag.capFrames = flag[codeNames.flags[7]];
                flag.capLimit = flag[codeNames.flags[6]];
                flag.takenBy = flag[codeNames.flags[5]];
            }
        }
        newState.flags = newState.all[13];
        for (let id in newState.cubes){
            let cube = newState.cubes[id];
            if (!codeNames.general){
                let constructor = String(cube.constructor);
                let matches = constructor.match(/this\..{0,2}=(.*?);/ig);
                let m = [];
                for (let i of matches){
                    m.push(i.split("this.")[1].split("=")[0]);
                }
                let t = [''];
                for (let i in m) {
                    t.push(m[i]);
                }
                codeNames.general = t;
                codeNames.lv = [codeNames.general[4],codeNames.general[5]]
            }
            cube.p = [cube.x,cube.y];
            cube.lv = [cube[codeNames.lv[0]],cube[codeNames.lv[1]]];
            cube.st = cube[codeNames.general[21]];
            cube.team = cube[codeNames.general[9]];
            cube.ff = cube[codeNames.general[15]];
            cube.dj = cube[codeNames.general[10]];
            cube.rf = cube[codeNames.general[30]];
            cube.hp = cube[codeNames.general[8]];
            cube.ra = cube[codeNames.general[31]];
            cube.stepsSurvived = cube[codeNames.general[14]];
            cube.iframes = Math.max(0,cube[codeNames.general[13]]-1);
            cube.ba = cube[codeNames.general[25]];
            cube.bf = cube[codeNames.general[24]];
            cube.a = cube.angle;
            cube.av = cube.angularVelocity;
            delete cube.angle;
            delete cube.angularVelocity;
            delete cube[codeNames.general[21]];
            delete cube[codeNames.general[8]];
            delete cube[codeNames.general[14]];
            delete cube[codeNames.general[22]];
            delete cube[codeNames.lv[0]];
            delete cube[codeNames.lv[1]];
            delete cube.x;
            delete cube.y;
        }
        for (let id in newState.all[4]){
            let info = newState.all[4][id];
            if (!codeNames.deathReg){
                let constructor = String(info.constructor);
                let matches = constructor.match(/this\..{0,2}=(.*?);/ig);
                let m = [];
                for (let i of matches){
                    m.push(i.split("this.")[1].split("=")[0]);
                }
                let t = [];
                for (let i in m) {
                    t.push(m[i]);
                }
                codeNames.deathReg = t;
            }
            let playerData = info[codeNames.deathReg[10]];
            let finalPlrData = {};
            for (let id2 in playerData){
                let info2 = playerData[id2];
                if (info2){
                    if (!codeNames.playerReg){
                        let constructor = String(info2.constructor);
                        let matches = constructor.match(/this\..{0,2}=(.*?);/ig);
                        let m = [];
                        for (let i of matches){
                            m.push(i.split("this.")[1].split("=")[0]);
                        }
                        let t = [];
                        for (let i in m) {
                            t.push(m[i]);
                        }
                        codeNames.playerReg = t;
                    }
                    info2.lives = info2[codeNames.playerReg[14]];
                    info2.kills = info2[codeNames.playerReg[2]];
                    info2.respawnIndex = info2[codeNames.playerReg[34]];
                    info2.killedBy = info2[codeNames.playerReg[18]];
                    info2.respawn = info2[codeNames.playerReg[12]];
                }
            }
            newState.playerData = playerData;
        }
        return newState;
    }

    let lastPixiContainer = null;



    function decodeState(state) {
        let newState = state;
        newState.all[8] = newState.cubes;
        for (let id in newState.projectiles){
            let proj = newState.projectiles[id];
            let p = newState.all[9][id];
            if (proj && p && codeNames.general){
                p.x = proj.p[0]
                p.y = proj.p[1]
                p[codeNames.lv[0]] = proj.lv[0]
                p[codeNames.lv[1]] = proj.lv[1]
                p.angle = proj.a;
                p.angularVelocity = proj.av;
                p[codeNames.projectiles[10]] = proj.ftd;
                p[codeNames.projectiles[14]] = proj.tr; // turn rate
                p[codeNames.projectiles[17]] = proj.gs; // gravity scale
                p[codeNames.projectiles[15]] = proj.er; // explode radius
                p[codeNames.projectiles[18]] = proj.bb; // bullet bounces
                p[codeNames.projectiles[13]] = proj.owner;
                p[codeNames.projectiles[24]] = proj.round; // bullet round
                p.restitution = proj.restitution; // bullet restitution
                p[codeNames.projectiles[22]] = proj.bc; // bounce count
                p[codeNames.projectiles[6]] = proj.br; // bullet radius
            }
        }
        delete newState.projectiles;
        newState.all[13] = newState.flags;
        for (let id in newState.all[13]){
            if (codeNames.general && newState.all[13][id]){
                let flag = newState.all[13][id];
                if (!codeNames.flags){
                    let constructor = String(flag.constructor);
                    let matches = constructor.match(/this\..{0,2}=(.*?);/ig);
                    let m = [];
                    for (let i of matches){
                        m.push(i.split("this.")[1].split("=")[0]);
                    }
                    let t = [''];
                    for (let i in m) {
                        t.push(m[i]);
                    }
                    codeNames.flags = t;
                }
                if (flag.p){
                    flag.x = flag.p[0];
                    flag.y = flag.p[1];
                    flag[codeNames.flags[7]] = flag.capFrames;
                    flag[codeNames.flags[6]] = flag.capLimit;
                    flag[codeNames.flags[5]] = flag.takenBy;
                }
            }
        }
        for (let id in newState.all[8]){
            let cube = newState.all[8][id];
            if (!codeNames.general){
                let constructor = String(cube.constructor);
                let matches = constructor.match(/this\..{0,2}=(.*?);/ig);
                let m = [];
                for (let i of matches){
                    m.push(i.split("this.")[1].split("=")[0]);
                }
                let t = [''];
                for (let i in m) {
                    t.push(m[i]);
                }
                codeNames.general = t;
                codeNames.lv = [codeNames.general[4],codeNames.general[5]]
            }
            cube.x = cube.p[0];
            cube.y = cube.p[1];
            cube[codeNames.lv[0]] = cube.lv[0];
            cube[codeNames.lv[1]] = cube.lv[1];
            cube.angularVelocity = cube.av;
            cube[codeNames.general[10]] = cube.dj;
            cube[codeNames.general[8]] = cube.hp;
            cube[codeNames.general[13]] = cube.iframes;
            cube[codeNames.general[21]] = cube.st;
            cube[codeNames.general[15]] = cube.ff;
            cube[codeNames.general[9]] = cube.team;
            cube[codeNames.general[30]] = cube.rf;
            cube[codeNames.general[31]] = cube.ra;
            cube[codeNames.general[14]] = cube.stepsSurvived;
            cube[codeNames.general[25]] = cube.ba;
            cube[codeNames.general[24]] = cube.bf;
            cube.angle = cube.a;
            delete cube.a;
            delete cube.av;
            delete cube.stepsSurvived;
            delete cube.st;
            delete cube.dj;
            delete cube.iframes;
            delete cube.lv;
            delete cube.hp;
            delete cube.p;
            delete cube.ba;
            delete cube.bf;
            delete cube.ra;
            delete cube.rf;
            delete cube.ff;
            delete cube.team;
        }

        for (let id in newState.playerData){
            let info = newState.playerData[id];
            if (info){
                info[codeNames.playerReg[14]] = info.lives;
                info[codeNames.playerReg[12]] = info.respawn;
            }
        }
        for (let i in newState.all[4]){
            if (newState.all[4][i]){
                newState.all[4][i][codeNames.deathReg[10]] = newState.playerData;
            }
        }
        return newState;
    }


    // vh down
    // yh up
    // kh rocket
    // Xh bat
    // qh force push
    // Zh grab

    function loadKeys(classi,typ){
        let cons = String(classi.constructor);
        let defines = (cons.split("constructor() {")[1]).split("this.");
        let m = [];
        for (let i of defines){
            m.push(i.split("=")[0]);
        }
        codeNames.keys = m;
    }

    function updateEditor() {
        document.querySelector("#appContainer > div.cornerButton > div.items > div:nth-child(7)").click();
        document.querySelector("#appContainer > div.lobbyContainer > div.settingsBox > div:nth-child(6)").click();
    }

    function makeInputs(frame,cubes){
        let inputs = stateMaker[codeNames.simulation[1]][codeNames.simulation[2]](frame,true);
        let ts = stateMaker[codeNames.simulation[1]].get(-1);
        if (!codeNames.keys && ts){
            loadKeys(ts);
            codeNames.keySample = ts;
        }
        if (inputs){
            let array = [];
            for (let id in inputs){
                array[id] = {
                    left: inputs[id].left,
                    right: inputs[id].right,
                    up: inputs[id][codeNames.keys[3]],
                    down: inputs[id][codeNames.keys[4]],
                    action3: inputs[id][codeNames.keys[7]], // BAT
                    action4: inputs[id][codeNames.keys[6]], // ROCKET
                    action2: inputs[id][codeNames.keys[8]], // GRAB
                    action1: inputs[id][codeNames.keys[5]] // FP
                }
            }
            for (let id in cubes){
                if (cubes[id]){
                    if (!array[id]){
                        array[id] = {
                            left: false,
                            right: false,
                            up: false,
                            down: false,
                            action3: false, // BAT
                            action4: false, // ROCKET
                            action2: false, // GRAB
                            action1: false // FP
                        }
                    }
                }
            }
            return array;
        }
    }

    const createGraphics = (info) => {
        let id = game.state.graphics.index;
        game.state.graphics.index++;
        game.state.graphics.drawings[id] = info;
        return id;
    }

    //console.log(stateMaker,"won",mostScore)
    const stateVars = String(stateMaker.constructor).match(/this\.(.*?)=/ig);
    stateVars.splice(0,1);
    const stateArray = [];
    for (let i of stateVars) {
        if (i && i.match("=")) {
            stateArray.push(i.split("this.")[1].split("=")[0]);
        }
    }
    // 23
    const Tsettings = stateMaker[stateArray[13]].settings[0]
    const settingsArray = String(Tsettings.constructor).split("constructor() {")[1].match(/this\..{0,2}=(.*?);/ig);
    //console.log(String(Tsettings.constructor));
    const settingsEndArray = [];
    for (let i of settingsArray) {
        if (i.match("=")) {
            settingsEndArray.push(i.split("this.")[1].split("=")[0]);
        }
    }
    codeNames.settings = settingsEndArray;
    console.log(stateArray);
    const editorInfo = stateMaker[stateArray[18]];
    let editorMaps = [];
    const editorVar = String(editorInfo.constructor).match(/this\.(.*?)=/ig);
    editorVar.splice(0,1);
    const editorVarArray = [];
    for (let i of editorVar) {
        if (i && i.match("=")) {
            editorVarArray.push(i.split("this.")[1].split("=")[0]);
        }
    }
    console.log(editorVarArray,"l");
    editorMaps = editorInfo[editorVarArray[4]];
    const stateVars2 = String(stateMaker[stateArray[23]].constructor).match(/this\.(.*?)=/ig);
    // console.log(stateVars2);
    stateVars.splice(0,1);
    const stateArray2 = [];
    for (let i of stateVars2) {
        if (i && i.match("=")) {
            stateArray2.push(i.split("this.")[1].split("=")[0]);
        }
    }
    // console.log(stateArray2);
    // 15
    /*console.log(stateMaker[stateArray[23]]);
    const stateVars3 = String(stateMaker[stateArray[23]][stateArray2[15]].constructor).match(/this\.(.*?)=/ig);
  //  console.log(stateVars3);
    stateVars.splice(0,1);
    const stateArray3 = [];
    for (let i of stateVars3) {
        if (i && i.match("=")) {
         stateArray3.push(i.split("this.")[1].split("=")[0]);
        }
    }*/

    const lerpNumber = function(a, b, weight) {
        return ((1 - weight) * a + weight * b);
    };
    // 0
    // codeNames.deathReg = [stateArray[23],stateArray2[15],stateArray3[0],stateMaker[stateArray[23]][stateArray2[15]][stateArray3[0]]];
    function updateDrawings(dt){
        if (gmm.enabled){
            if (document.getElementById('backgroundImage') && lastPixiContainer && game.state && game.prevState && game.prevState.graphics && game.state.graphics){
                let bg = document.getElementById('backgroundImage')
                let w = bg.offsetWidth;
                let h = bg.offsetHeight;
                let mps = 35/((game.state.settings[0][codeNames.settings[2]])/35);
                if (!lastPixiContainer.sortableChildren){
                    lastPixiContainer.sortableChildren = true
                }
                for (let id in game.prevState.graphics.drawings)
                {
                    let p = game.state.graphics.drawings[id];
                    if (!p){
                        if (gmm.pixi[id]){
                            gmm.pixi[id].container.destroy();
                            delete gmm.pixi[id];
                        }
                    }
                }
                for (let id in game.state.graphics.drawings)
                {
                    let pi = game.prevState.graphics.drawings[id];
                    let p = game.state.graphics.drawings[id];
                    if (p){
                        if (!gmm.pixi[id]){
                            let obj = new window.PIXI.Container();
                            lastPixiContainer.addChild(obj);
                            gmm.pixi[id] = {container: obj,children: {}};
                            obj.zIndex = 100000;
                        }
                        let offsetX = 0;
                        let offsetY = 0;
                        let offsetXL = 0;
                        let offsetYL = 0;
                        let offsetAngle = 0;
                        if (p.attach == "cube")
                        {
                            let attachCode = findUser(p.attachId)?.name;
                            if (alive[attachCode]){
                                if (!gmm.pixi[id].container.parent || gmm.pixi[id].container.parent != alive[attachCode].obj){
                                    gmm.pixi[id].container.parent?.removeChild(gmm.pixi[id].container);
                                    alive[attachCode].obj.addChild(gmm.pixi[id].container);
                                    gmm.pixi[id].container.zIndex = p.behind? -10 : 10;
                                    alive[attachCode].obj.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
                                }
                            }
                            if (game.state.cubes[p.attachId]){
                                gmm.pixi[id].container.visible = true;
                                let c = game.state.cubes[p.attachId];
                                offsetX = c.x;
                                offsetY = c.y;
                                offsetXL = c.x;
                                offsetYL = c.y;
                                offsetAngle = p.fixedAngle? 0 : c.angle;
                            }else{
                                gmm.pixi[id].container.visible = false;
                            }
                            if (game.prevState.cubes[p.attachId]){
                                let c = game.prevState.cubes[p.attachId];
                                offsetXL = c.x;
                                offsetYL = c.y;
                            }
                        }else{
                            if (!gmm.pixi[id].container.parent || gmm.pixi[id].container.parent != lastPixiContainer){
                                gmm.pixi[id].container.parent?.removeChild(gmm.pixi[id].container);
                                lastPixiContainer.addChild(gmm.pixi[id].container);
                            }
                        }
                        let x = (p.p[0])*100;
                        let y = (p.p[1])*100;
                        gmm.pixi[id].container.x = (((((x/35)*mps)/35)*w)/100);
                        gmm.pixi[id].container.y = (((((y/35)*mps)/35)*w)/100);
                        gmm.pixi[id].container.rotation = offsetAngle + (p.a||0);
                        if (pi){
                            for (let shapeId in pi.shapes){
                                let shape = p.shapes[shapeId];
                                if (!shape){
                                    gmm.pixi[id].children[shapeId].destroy();
                                    delete gmm.pixi[id].children[shapeId];
                                }
                            }
                        }
                        for (let shapeId in p.shapes){
                            let shape = p.shapes[shapeId];
                            let shapel = pi?.shapes[shapeId];
                            if (shape){
                                if (!gmm.pixi[id].children[shapeId]){
                                    if (shape.type == "bx"){
                                        // Box shape
                                        let obj = new window.PIXI.Sprite(window.PIXI.Texture.WHITE);
                                        obj.anchor.x = 0.5;
                                        obj.anchor.y = 0.5;
                                        gmm.pixi[id].container.addChild(obj);
                                        gmm.pixi[id].children[shapeId] = obj;
                                    }
                                    else if (shape.type == "ci"){
                                        // Circle shape
                                        let obj = new window.PIXI.Graphics();
                                        obj.beginFill(0xffffff);
                                        obj.drawCircle(0, 0, 30);
                                        gmm.pixi[id].container.addChild(obj);
                                        gmm.pixi[id].children[shapeId] = obj;
                                    }
                                    else if (shape.type == "im"){
                                        // Image shape
                                        let obj;
                                        if (gmmTextures[shape.id] && gmmTextures[shape.id].valid){
                                            obj = new window.PIXI.Sprite(new window.PIXI.Texture(gmmTextures[shape.id].baseTexture));
                                        }else{
                                            obj = new window.PIXI.Sprite(window.PIXI.Texture.WHITE);
                                            obj.texture.isWhite = true;
                                        }
                                        obj.anchor.x = 0.5;
                                        obj.anchor.y = 0.5;
                                        gmm.pixi[id].container.addChild(obj);
                                        gmm.pixi[id].children[shapeId] = obj;
                                    }
                                    else if (shape.type == "tx")
                                    {
                                        // Text shape
                                        let obj = new window.PIXI.Text('', {
                                            fontFamily: 'Arial',
                                            fontSize: 24,
                                            fill: 0xffffff,
                                            align: 'center',
                                        });
                                        obj.anchor.x = 0.5;
                                        obj.anchor.y = 0.5;
                                        gmm.pixi[id].container.addChild(obj);
                                        gmm.pixi[id].children[shapeId] = obj;
                                    }
                                }
                                let obj = gmm.pixi[id].children[shapeId];
                                obj.alpha = "alpha" in shape? shape.alpha : 1;
                                obj.tint = shape.color;
                                obj.rotation = shape.a || 0;
                                if (shape.type == "tx"){
                                    obj.text = shape.text;
                                    obj.style.fontSize = ((((shape.size/35)*mps)/35)*w)*p.scale[0];
                                }else{
                                    obj.width = ((((shape.size[0]/35)*mps)/35)*w)*p.scale[0];
                                    obj.height = ((((shape.size[1]/35)*mps)/35)*w)*p.scale[1];
                                }
                                let x = shape.p[0]*100;
                                let y = shape.p[1]*100;
                                obj.x = lerpNumber(obj.x,(((((x/35)*mps)/35)*w)*p.scale[0])/100,1-((1/100**10)**dt));
                                obj.y = lerpNumber(obj.y,(((((y/35)*mps)/35)*w)*p.scale[1])/100,1-((1/100**10)**dt));
                                if (shape.type == "im"){
                                    if (shapel && shapel.id != shape.id || obj.texture.isWhite) {
                                        if (gmmTextures[shape.id] && gmmTextures[shape.id].valid) {
                                            obj.texture = new window.PIXI.Texture(gmmTextures[shape.id].baseTexture);
                                            obj.texture.requiresUpdate = true;
                                            obj.texture.updateUvs();
                                        }
                                    }

                                    if (obj.texture.noFrame){
                                        obj.texture.frame = new window.PIXI.Rectangle(0,0,obj.texture.baseTexture.width,obj.texture.baseTexture.height);
                                    }
                                    let ra = shapel? shapel.region : null;
                                    let rb = shape.region;
                                    let regionAEqualB = (ra != null && rb != null) ?
                                        ra.pos[0] == rb.pos[0] &&
                                        ra.pos[1] == ra.pos[1] &&
                                        ra.size[0] == rb.size[0] &&
                                        ra.size[1] == ra.size[1] : (ra == null && rb == null);
                                    if (regionAEqualB) {
                                        if (shape.region){
                                            let frame = obj.texture.frame;
                                            frame.x = shape.region.pos[0];
                                            frame.y = shape.region.pos[1];
                                            frame.width = shape.region.size[0];
                                            frame.height = shape.region.size[1];
                                        }else{
                                            let frame = obj.texture.frame;
                                            frame.width = obj.texture.baseTexture.width;
                                            frame.height = obj.texture.baseTexture.height;
                                            frame.x = 0;
                                            frame.y = 0;
                                        }
                                        obj.texture.updateUvs();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    const vectorUtils = {
        magn: function(n1) {
            return Math.sqrt(n1[0]**2+n1[1]**2);
        },
        add: function(n1,n2){
            let p1 = [...n1];
            let p2 = [...n2];
            for (let i in p1){
                p1[i] += p2[i] || 0;
            }
            return p1;
        },
        sub: function(n1,n2){
            let p1 = [...n1];
            let p2 = [...n2];
            for (let i in p1){
                p1[i] -= p2[i] || 0;
            }
            return p1;
        },
        mult: function(n1,n2){
            let p1 = [...n1];
            let p2 = [...n2];
            for (let i in p1){
                p1[i] *= p2[i] || 0;
            }
            return p1;
        },
        div: function(n1,n2){
            let p1 = [...n1];
            let p2 = [...n2];
            for (let i in p1){
                p1[i] /= p2[i] || 0;
            }
            return p1;
        },
        angleOf: function(n1){
            return Math.atan2(n1[1],n1[0]);
        },
        norm: function(n1){
            let a = Math.atan2(n1[1],n1[0]);
            return [Math.cos(a),Math.sin(a)];
        },
        dot: function(n1,n2) {
            return n1.map((x, i) => n1[i] * n2[i]).reduce((m, n) => m + n)
        }
    }

    function loadTextureGMM(id,url){
        try {
            let img = new Image();
            img.src = url;
            window.PIXI.BaseImageResource.crossOrigin(img,url);
            img.onload = () => {
                let base = new window.PIXI.BaseTexture(img);
                let texture = new window.PIXI.Texture(base);
                gmmTextures[id] = texture;
            }
        }catch (error) {

        }
    }

    function loadSoundGMM(id,url){
        try {
            let sound = new Howl({
                src: [url],
                html5: true
            });
            gmmSounds[id] = sound;
        }catch (error) {
            console.log("L",error)
        }
    }

    /*[
    Ja: {
        "Rr": 0,
        "x": 0,
        "y": 0,
        "color": 16777215,
        "Ir": true,
        "Dr": 0,
        "texture": 0,
        "Lr": 0,
        "Ur": 0,
        "jr": 1,
        "Jr": false,
        "zIndex": 0,
        "Wr": [
            {
                "x": -1,
                "y": -2
            },
            {
                "x": 2,
                "y": 1
            },
            {
                "x": -1,
                "y": 1
            }
        ]
    }
]
*/
    function playSoundGMM(id,volume) {
        let sound = gmmSounds[id];
        game.sound.step += 1;
        if (sound && (!game.state.soundStep || game.state.soundStep < game.sound.step)) {
            sound.volume(volume || 1)
            sound.play();
        }
        game.state.soundStep = Math.max(game.state.soundStep || 0,game.sound.step);
    }

    function createPlatformData(sample){
        codeNames.platform = {
            sample: sample.constructor,
        }
        let matches = String(sample.constructor).match(/this\..{0,2}=(.*?);/ig);
        let m = [];
        for (let i of matches){
            m.push(i.split("this.")[1].split("=")[0]);
        }
        let t = [];
        for (let i in m) {
            t.push(m[i]);
        }
        console.log(t);
        let shape;
        for (let i of sample[t[55]]) {
            if (i) {
                shape = i;
            }
        }
        codeNames.platform.shapeSample = shape.constructor;
        matches = String(shape.constructor).match(/this\..{0,2}=(.*?);/ig);
        m = [];
        for (let i of matches){
            m.push(i.split("this.")[1].split("=")[0]);
        }
        let t2 = [];
        for (let i in m) {
            t2.push(m[i]);
        }
        console.log(t2);
        codeNames.platform.properties = {
            shapes: t[55],
            source1: t,
            source2: t2,
            shapeVertices: t2[10]
        }
    }

    function createPlatform(){
        let state = getCurrentState();
        console.log(state.all[5]);
        if (!codeNames.platform){
            for (let i of state.all[5]) {
                if (i) {
                    createPlatformData(i);
                    break;
                }
            }
        }
        let platform = new codeNames.platform.sample();
        console.log(platform);
        let data = codeNames.platform;
        let shape = new data.shapeSample();
        let size = 5;
        shape.Wr = [{'x':-size,'y':-size},{'x':size,'y':-size},{'x':size,'y':size},{'x':-size,'y':size}];
        platform.x = 10;
        platform.y = 10;
        platform[data.properties.shapes].push(shape);
        platform.id = state.all[5].length;
        state.all[5].push(platform);
    }

    function getWorld(){
        for (let i in stateMaker[codeNames.simulation[3]]){
            if (stateMaker[codeNames.simulation[3]][i].m_island){
                return stateMaker[codeNames.simulation[3]][i];
            }else if (stateMaker[codeNames.simulation[3]][i].PostSolve && !stateMaker[codeNames.simulation[3]][i].injected){
                stateMaker[codeNames.simulation[3]][i].injected = true;
                let a = stateMaker[codeNames.simulation[3]][i];
                const postSolve = a.PostSolve;
                a.PostSolve = function(contact, impulses) {
                    if (impulses.normalImpulses[0] > 0.05 && gmm.enabled) {
                        const worldManifold = new window.Box2D.Collision.b2WorldManifold();
                        contact.GetWorldManifold(worldManifold);
                        /*gmm.collisions.push({
                            fixtureAData: contact.GetFixtureA().GetUserData(),
                            fixtureABodyData: contact.GetFixtureA().GetBody().GetUserData(),
                            fixtureBData: contact.GetFixtureB().GetUserData(),
                            fixtureBBodyData: contact.GetFixtureB().GetBody().GetUserData(),
                            normal: {x: worldManifold.m_normal.x, y: worldManifold.m_normal.y},
                        });*/
                    }

                    return postSolve(...arguments);
                };
            }
        }
    }
    let b2World = getWorld();
    const b2Vec2 = window.Box2D.Common.Math.b2Vec2
    b2World.DestroyJointo = b2World.DestroyJoint;
    b2World.DestroyBodo = b2World.DestroyBody;
    b2World.DestroyBody = (id) => {
        if (!gmm.enabled) {
            return b2World.DestroyBodo(id);
        }else{
            gmm.destroyList.push(id);
        }
    }
    b2World.DestroyJoint= (id) => {
        if (!gmm.enabled) {
            return b2World.DestroyJointo(id);
        }else{
            gmm.jointdestroyList.push(id);
        }
    }
    function getCause(cube,state) {
        let cause = [-1,-1];
        let nearestRocket = 0;
        let largest = 1/0;
        for (let id in state.projectiles){
            let proj = state.projectiles[id];
            if (proj) {
                let dist = vectorUtils.magn([(proj.p[0]+proj.p[0]/30)-cube.p[0],(proj.p[1]+proj.p[1]/30)-cube.p[0]]);
                if (dist < largest){
                    largest = dist;
                    nearestRocket = proj;
                }
            }
        }
        if (nearestRocket){
            cause = [0,nearestRocket.owner];
        }
        if (vectorUtils.magn(cube.lv)/15 > cube.hp){
            cause = [1,-1];
        }
        return cause;
    }

    function raycast(origin,end,filter){
        const hits = [];

        const rayCastCallback = (fixture, point, normal, fraction) => {
            const bodyData = fixture.GetBody().GetUserData();
            const fixtureData = fixture.GetUserData();

            let body_info = null;
            for (let i in bodyData) {
                try {
                    if ("id" in bodyData[i] || bodyData[i].id){
                        body_info = bodyData[i];
                        break;
                    }
                }catch(error){

                }
            }
            const hit = {
                type: null,
                bodyData: body_info,
                id: (body_info || bodyData)?.id,
                point: [point.x, point.y],
                normal: [normal.x, normal.y],
            };

            if (codeNames.general[11] in (body_info || bodyData || {})) {
                hit.type = "cube";
            }else{
                hit.type = "shape";
            }

            hits[fraction] = hit;

            return -1;
        };
        b2World.RayCast(
            rayCastCallback,
            new b2Vec2(origin[0],origin[1]),
            new b2Vec2(end[0],end[1])
        );
        const keysInOrder = Object.keys(hits).sort();
        let theChosenOne = null;;

        for (let i = 0; i < keysInOrder.length; i++) {
            const hit = hits[keysInOrder[i]];

            if (!filter || filter(hit)) {
                theChosenOne = hit;
                break;
            }
        }

        return theChosenOne;
    }
    stateMaker.mmR = stateMaker[codeNames.simulation[1]][codeNames.simulation[2]];
    console.log(codeNames.simulation);
    let inputsPropertie = null;
    for (let i in stateMaker[codeNames.simulation[1]]){
        if (stateMaker[codeNames.simulation[1]][i].constructor === Array){
            inputsPropertie = i;
        }
    }
    stateMaker[codeNames.simulation[1]][codeNames.simulation[2]] = function(frame,noOverride){
        let info = stateMaker.mmR.call(this,frame);
        if (gmm.enabled){
            let state;
            try {
                state = getAllStates()[frame-1];
            }catch(error){
                WSS.onmessage({data:`42[22]`});
                if (hostId == myid) {
                    display("LEVEL 4 ERROR: "+error,"#ff0000","#ff0000",true);
                }
                console.error(error);
                return;
            }
            if (codeNames.keySample && !noOverride) {
                for (let i of users){
                    if (!info[i.id]) {
                        info[i.id] = new codeNames.keySample.constructor;
                    }
                    if (!this[inputsPropertie][i.id]){
                        this[inputsPropertie][i.id] = [[]];
                    }
                    this[inputsPropertie][i.id][0] = info[i.id];
                }
            }
            if (state && gmm.applyOverrides && !noOverride){
                let overrides = state.overrides;
                for (let i in info){
                    if (!overrides[i]){
                        overrides[i] = {
                            left: null,
                            right: null,
                            up: null,
                            down: null,
                            action3: null,
                            action4: null,
                            action2: null,
                            action1: null
                        }
                    }
                }
                for (let i in overrides){
                    if (info[i]){
                        if (!codeNames.keys){
                            loadKeys(info[i]);
                            codeNames.keySample = info[i];
                        }
                        info[i] = {
                            left: overrides[i].left != null? overrides[i].left : info[i].left,
                            right: overrides[i].right != null? overrides[i].right : info[i].right,
                            [codeNames.keys[3]]: overrides[i].up != null? overrides[i].up : info[i][codeNames.keys[3]],
                            [codeNames.keys[4]]: overrides[i].down != null? overrides[i].down : info[i][codeNames.keys[4]],
                            [codeNames.keys[7]]: overrides[i].action3 != null? overrides[i].action3 : info[i][codeNames.keys[7]], // BAT
                            [codeNames.keys[6]]: overrides[i].action4 != null? overrides[i].action4 : info[i][codeNames.keys[6]], // ROCKET
                            [codeNames.keys[8]]: overrides[i].action2 != null? overrides[i].action2 : info[i][codeNames.keys[8]], // GRAB
                            [codeNames.keys[5]]: overrides[i].action1 != null? overrides[i].action1 : info[i][codeNames.keys[5]] // FP
                        }
                    }
                }
            }
        }
        return info;
    }
    stateMaker.rrP = stateMaker[codeNames.simulation[0]];
    stateMaker[codeNames.simulation[0]] = function(frame)
    {
        gmm.applyOverrides = true;
        let simulated;
        try{
            simulated = stateMaker.rrP.call(this,frame);
        }catch(error){
            WSS.onmessage({data:`42[22]`});
            if (hostId == myid) {
                display("LEVEL 2 ERROR: "+error,"#ff0000","#ff0000",true);
            }
            console.error(error);
            return;
        }
        gmm.applyOverrides = false;
        if (gmm.enabled){
            try {
                let lc = getAllStates()[frame] || null;
                if (lc && !lc.vars){
                    lc.vars = {};
                    lc.overrides = [];
                    for (let i of users){
                        lc.overrides[i.id] = {
                            left: null,
                            right: null,
                            up: null,
                            down: null,
                            action3: null,
                            action4: null,
                            action2: null,
                            action1: null
                        }
                    }
                    lc.graphics = {create: createGraphics,index: 0,drawings: {},loadTexture: loadTextureGMM};
                    lc.sound = {load: loadSoundGMM,play: playSoundGMM,step: 0};
                }
                if (lc){
                    simulated.vars = JSON.parse(JSON.stringify(lc.vars));
                    simulated.overrides = JSON.parse(JSON.stringify(lc.overrides));
                    simulated.graphics = {create: createGraphics,index: parseInt(lc.graphics.index.toString()),drawings: JSON.parse(JSON.stringify(lc.graphics.drawings))};
                    simulated.prevGraphics = {create: createGraphics,index: parseInt(lc.graphics.index.toString()),drawings: JSON.parse(JSON.stringify(lc.graphics.drawings))};
                }
                game.sound = {load: loadSoundGMM,play: playSoundGMM,step: 0};
                game.world = {raycast: raycast,createPlatform: createPlatform};
                game.state = encodeState(simulated);
                game.state.frames = frame;
                game.Vector = vectorUtils;
                game.overrides = simulated.overrides;
                let seed = 0;
                seed = Number(frame);
                for (let a in game.state.cubes) {
                    let i = game.state.cubes[a];
                    if (i) {
                        seed += Math.floor(seed/10);
                        seed += Math.floor((i.p[0]+i.p[1]+i.lv[0]+i.lv[1])**2);
                        seed *= Math.floor((i.p[0]+i.p[1]+i.lv[0]+i.lv[1])/5);
                    }
                }
                const rng = new SeedRandom(seed);
                game.Math.random = () => {
                    if (gmm.enabled){
                        if (game.state){
                            return Math.round(rng(1000000000)) * 0.000000001;
                        }
                    }else{
                        return origRandom();
                    }
                }
                if (frame == 1){
                    game.clientId = myid;
                    game.hostId = hostId;
                    for (let i in gmm.pixi){
                        gmm.pixi[i].container.destroy();
                        delete gmm.pixi[i];
                    }

                    game.graphics = {create: createGraphics,index: 0,drawings: {}};
                    game.state.graphics = game.graphics;
                    game.vars = {};
                    for (let func of gmm.events.init){
                        func();
                    }
                    for (let func of gmm.events.init4each){
                        for (let i of users){
                            try {
                                func(i.id);
                            }
                            catch (error)
                            {
                                WSS.onmessage({data:`42[22]`});
                                if (hostId == myid) {
                                    display(error,"#ff0000","#ff0000",true);
                                }
                            }
                        }
                    }
                    simulated.vars = game.vars;
                    simulated.graphics = game.graphics;
                }
                game.prevState = lc? encodeState(lc) : null;
                if (game.prevState){
                    game.prevState.frames = frame-1;
                }
                game.inputs = makeInputs(frame,game.state.cubes);
                game.vars = simulated.vars;
                game.graphics = simulated.graphics;
                if (frame > 1){
                    for (let func of gmm.events.step){
                        try {
                            func();
                        }
                        catch (error)
                        {

                        }
                    }
                    for (let func of gmm.events.ondeath){
                        if (game.prevState){
                            for (let id in game.prevState.cubes){
                                let cube = game.prevState.cubes[id];
                                if (cube && !game.state.cubes[id]){
                                    let revive = func(cube,game.state.playerData[id].killedBy)
                                    if (revive){
                                        let clone = Object.assign(Object.create(Object.getPrototypeOf(cube)), cube)
                                        clone.hp = 100;
                                        clone.stepsSurvived = 0;
                                        game.state.cubes[id] = clone;
                                        game.state.playerData[id].lives += 1;
                                        game.state.playerData[id].respawn = -1;
                                    }
                                }
                            }
                        }
                    }
                    for (let func of gmm.events.step4each){
                        for (let i of users){
                            try {
                                func(i.id);
                            }
                            catch (error)
                            {
                                WSS.onmessage({data:`42[22]`});
                                if (hostId == myid) {
                                    display("LEVEL 3 ERROR: "+error,"#ff0000","#ff0000",true);
                                }
                                console.error(error);
                                return;
                            }
                        }
                    }
                }
                simulated = decodeState(game.state);
                simulated.vars = game.vars;
                simulated.graphics = game.graphics;
                simulated.overrides = game.overrides;
                if (lc){
                    lc = decodeState(game.prevState);
                }
            }catch(error){
                WSS.onmessage({data:`42[22]`});
                if (hostId == myid) {
                    display("LEVEL 1 ERROR: "+error,"#ff0000","#ff0000",true);
                }
                console.error(error);
                return;
            }
        }
        for (let i of gmm.destroyList) {
            b2World.DestroyBodo(i);
        }
        gmm.destroyList = [];
        for (let i of gmm.jointdestroyList) {
            b2World.DestroyJointo(i);
        }
        gmm.jointdestroyList = [];
        return simulated;
    }

    //eval defineGMM("game.events.add('step',function() {game.state.po[0].th = -5;})")

    function getAllStates(){
        let state;
        for (let a in stateMaker){
            let b = stateMaker[a];
            if (b.constructor.name == "Array"){
                for (let i of b){
                    if (typeof(i) == "object" && "all" in i && i.all.constructor.name == "Array"){
                        if (i.all.length > 10 && i.all.length < 15){
                            state = b;
                            break;
                        }

                    }
                }
            }
        }
        if (state){
            return state;
        }
    }

    function setStates(states){
        let state;
        for (let a in stateMaker){
            let b = stateMaker[a];
            if (b.constructor.name == "Array"){
                for (let i of b){
                    if (typeof(i) == "object" && "all" in i && i.all.constructor.name == "Array"){
                        if (i.all.length > 10 && i.all.length < 15){
                            state = b;
                            break;
                        }

                    }
                }
            }
        }
        if (state){
            state = states;
        }
    }

    function getCurrentState(){
        let state;
        for (let a in stateMaker){
            let b = stateMaker[a];
            if (b && b.constructor && b.constructor.name == "Array"){
                for (let it in b){
                    let i = b[it];
                    if (typeof(i) == "object" && "all" in i && i.all.constructor.name == "Array"){
                        if (i.all.length > 10 && i.all.length < 15){
                            state = b;
                            break;
                        }

                    }
                }
            }
        }
        if (state){
            let last;
            for (let a in state){
                state[a].frame = a;
                last = state[a];
            }
            return last;
        }
    }

    function sendInfo(sett = {},offset = 0){
        if (hostId == myid){
            sett.frame = getCurrentState()?.frame-offset;
            settings.nhm = sett;
            WSS.send(`42[1,[62,${JSON.stringify(settings)}]]`)
            WSS.onmessage({data: `42[63,${JSON.stringify(settings)}]`})
        }
    }

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

    class listener {
        constructor() {

        }
        add(event,func){
            if (gmm.events[event]){
                gmm.events[event].push(func);
            }
        }
    }

    function defineGMM(code)
    {
        gmmTextures = {};
        gmmSounds = {};
        gmm.enabled = true;
        gmm.events = [];
        gmm.code = code;
        for (let i in gmm.pixi){
            gmm.pixi[i].container.destroy();
            delete gmm.pixi[i];
        }
        for (let i of gmmEvents){
            gmm.events[i] = [];
        }
        gmm.listener = new listener();
        game.events = gmm.listener;
        let func = newScope(game,code);
        game.graphics = {create: createGraphics,index: 0,drawings: {},loadTexture: loadTextureGMM};
        game.sound = {load: loadSoundGMM,play: playSoundGMM};
        func();
        gmm.scopeFunc = func;
        if (hostId == myid)
        {
            sendInfo({gmm:code});
        }
    }

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
    var blocklyWorkspace;
    const editor = document.createElement('div');
    editor.style = "opacity: 1; position: absolute; top: calc(50% - 40%); left: calc(50% - 45%); width: 90%; height: 80%; background-color: #212121; border-radius: 7px;";
    const topBar = document.createElement('div');
    topBar.classList.add("topBar");
    topBar.textContent = "Editor";
    editor.appendChild(topBar);
    document.getElementById("appContainer").appendChild(editor);
    const editorBox = document.createElement(`div`);
    editorBox.style = "color-scheme: only light; background: #ffffff; overflow: hidden; border-radius: 8px; width: calc(100% - 70px); right: 15px; height: calc(100% - 60px); top: 50px; position: absolute;";
    editor.appendChild(editorBox);
    editorBox.style.display = 'none';
    // editor.style.display = "none";
    const blocklyBox = document.createElement(`div`);
    blocklyBox.style = "overflow: hidden; border-radius: 8px; width: calc(100% - 70px); right: 15px; height: calc(100% - 60px); top: 50px; position: absolute;";
    editor.appendChild(blocklyBox);

    const checkButton = document.createElement('div');
    checkButton.classList.add("crossButton");
    editor.appendChild(checkButton);
    const exportButton = document.createElement('div');
    exportButton.classList.add("crossButton");
    exportButton.style.left = "15px";
    exportButton.style.top = "50px";
    exportButton.style.backgroundImage = "url(https://github.com/SneezingCactus/gmmaker/blob/master/src/gmWindow/images/gmeexport.png?raw=true)";
    editor.appendChild(exportButton);
    const importButton = document.createElement('div');
    importButton.classList.add("crossButton");
    importButton.style.left = "15px";
    importButton.style.top = "80px";
    importButton.style.backgroundImage = "url(https://github.com/SneezingCactus/gmmaker/blob/master/src/gmWindow/images/gmedownload.png?raw=true)";
    editor.appendChild(importButton);
    exportButton.onclick = () => {
        if (window.monacoEditor){
            let text = `
  {
  [CODE]
  > \`\`\`;${window.monacoEditor.getValue()}> \`\`\`;
  [IMAGES]
  > \`\`\`;> \`\`\`;
  }
  `
            let element = document.createElement('a');
            let file = new Blob([text], { type: "text/plain" })

            let url = URL.createObjectURL(file);
            element.setAttribute('href', url);
            element.setAttribute('download', (prompt("Name of the file") || "ngmm export")+".ngmm");
            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }
    }
    importButton.onclick = () => {
        if (window.monacoEditor){
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = '.ngmm';

            input.onchange = e => {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.readAsText(file,'UTF-8');
                reader.onload = readerEvent => {
                    let content = readerEvent.target.result;
                    let decoded = content;
                    try {
                        decoded = decodeURIComponent(window.atob(content));
                    } catch (err) {

                    }
                    let firstStep = decoded.match(/\[CODE\](.*?)> ```;(.*?)> ```;/gims)[0].split('> ```;');
                    let finalCode = '';
                    for (let i in firstStep){
                        if (i > 0 && i < firstStep.length){
                            finalCode+=firstStep[i];
                        }
                    }
                    window.monacoEditor.setValue(finalCode);
                }
            }

            input.click();
        }
    }
    checkButton.onclick = () => {
        if (window.monacoEditor){
            let markers = monaco.editor.getModelMarkers({owner: "javascript"}).filter(a => a.severity >= 5);
            if (markers[0]){
                //console.log(markers[0]);
                window.monacoEditor.revealLine(markers[0].endLineNumber);
                window.monacoEditor.setPosition({lineNumber: markers[0].endLineNumber, column: markers[0].endColumn});
                return;
            }
            else
            {
                document.getElementsByClassName("lobbyContainer")[0].style.display = "block";
                let code = window.monacoEditor.getValue();
                defineGMM(code);
            }
        }
        editor.style.display = "none";
    }
    new Promise(async (r) => {
        var fetched = await fetch('https://raw.githubusercontent.com/wildyShadow/NeonGmmaker/main/shared/typescript.ts');
        var libSource = await fetched.text();
        const thisId = setInterval(() => {
            if (window.monaco){
                var libUri = "ts:filename/facts.d.ts";
                monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
                monaco.editor.createModel(libSource, "typescript", monaco.Uri.parse(libUri));

                monaco.editor.setTheme('vs')

                monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                    noSemanticValidation: false,
                });

                monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                    target: monaco.languages.typescript.ScriptTarget.ES6,
                    allowNonTsExtensions: true
                });

                window.monacoEditor = monaco.editor.create(editorBox, {
                    value: `
// Sword replaces Bat gmm

// insert id, then url
game.graphics.loadTexture("sus","https://upload.wikimedia.org/wikipedia/commons/d/df/Sword_Pixel_art_-_Radin.png");
game.events.add("step4each",(id) => {
	let cube = game.state.cubes[id];
	if (cube) {
		let g = game.graphics.drawings[game.vars[id]];
		let add = cube.bf <= 8? 0 : Math.PI;
		g.shapes[0].alpha = cube.bf > 0? 1 : 0;
		g.a = cube.ba+add;
	}
})

game.events.add("init4each",(id) => {
		game.vars[id] = game.graphics.create({
			p: [0,0],
			attach: "cube",
			attachId: id,
			scale: [1,1],
            fixedAngle: true,
			a: 0,
			shapes: [
				{
					type: "im",
					text: (id == game.clientId? "YOU" : "OTHER")+(game.clientId == game.hostId? " HOST" : " NOT HOST"),
					color: 0xffffff,
					a: 45*Math.PI/180+Math.PI,
					p: [-1,0],
					size: [1.4,1.4],
					// set the id of the image to the id of the url you set
					id: "sus"
				}
			]
		})
})`,
                    automaticLayout: true,
                    language: 'javascript'
                });
                clearInterval(thisId);
                r();
            }
        },10);
    })
        .then(r => {
        console.log("monaco loaded");
        //  appendScript("https://unpkg.com/blockly/blocks_compressed.js");
        //  appendScript("https://unpkg.com/blockly/javascript_compressed.js");
        new Promise(async (r) => {
            const tool = {
                "kind": "categoryToolbox",
                "contents": [
                    {
                        "id": null,
                        "categorystyle": null,
                        "colour": "#536f92",
                        "cssconfig": null,
                        "hidden": false,
                        "kind": "category",
                        "name": "EDITOR.LOGIC",
                        "contents": [
                            {
                                "kind": "block",
                                "type": "controls_if"
                            }
                        ]
                    }
                ]
            }
            const thisId = setInterval(() => {
                if (window.Blockly){
                    blocklyWorkspace = Blockly.inject(blocklyBox, {toolbox: tool});
                    clearInterval(thisId);
                    r();
                }
            },10);
        })
            .then(r => {
            console.log("blockly loaded");
        })
    })
    //<textarea class="scrollBox" wrap="soft" spellcheck="false" style="border: none; outline: none; -webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; resize: none; position: absolute; overflow-y: scroll; overflow-x: hidden; background-color: #2f2f2f; height: calc(100% - 60px); width: calc(100% - 80px); left: 80px; top: 50px; box-sizing: border-box; border-bottom-left-radius: 7px; border-bottom-right-radius: 7px; white-space: nowrap;"></textarea>

    let myid = -1;
    let hostId = -1;

    let users = [];
    let abc = 'abcdefghijklmnopqrstuvwxyz';
    const alive = {};
    // Your code here...

    const render = window.PIXI.Graphics.prototype._render
    window.PIXI.Graphics.prototype._render = function(...args){
        render.call(this,...args)
        if (this.parent) {
            for (let a in this.parent.children) {
                let i = this.parent.children[a];
                if (i._text && a > 3) {
                    alive[i._text] = {orbj: this,obj: this.parent,frames: 16, txt: i};
                    break;
                }
            }
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

    function lerp(a, b, x) {
        return a + x * (b - a);
    }

    let lastMO;

    //SP.SE.ve[0].name
    //SP.zE.eo[0];
    let empty = {};

    window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
        apply( target, thisArgs, args ) {
            if (window.Blockly && blocklyWorkspace){
            Blockly.svgResize(blocklyWorkspace);
            }
            let T = Date.now();
            let dt = (T-lc)/1000;
            lc = T;
            frames++
            updateDrawings(dt);
            Reflect.apply(...arguments);
            gmmEditor.style.display = document.querySelector("#appContainer > div.lobbyContainer > div.settingsBox > div.hideLobbyButton.settingsButton").style.display != 'none'? 'none' : 'block';
            /*if (currentState && currentState.mo){
            for (let id in currentState.mo){
             let info = currentState.mo[id];
                if (!info.injected){
                    info.injected = true;
                    let player = findUser(info.$h);
                    console.log(player.name,"died?",info);
                }
            }
        }*/

            for (let i in alive) {
                let unalive = (!alive[i].obj || !alive[i].obj.transform || !alive[i].obj.parent || !alive[i].txt || !alive[i].txt.visible || alive[i].txt.parent != alive[i].obj || !alive[i].obj.visible || alive[i].obj.alpha <= 0);
                let p = findUser(i);
                if (p){
                    if (unalive){
                        alive[i].frames--
                        if (alive[i].frames <= 0){
                            delete alive[i];
                        }
                    }else{
                        let topElement = alive[i].obj;
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
                        lastPixiContainer = alive[i].obj.parent;
                    }
                }else{
                    delete alive[i];
                }
            }
        }
    })

    const originalSend = window.WebSocket.prototype.send;
    const excludewss = [];
    let WSS = 0;

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

    function updateGMMButton(){
        if (hostId == myid){
            gmmEditor.classList.remove('disabled');
        }else{
            gmmEditor.classList.add('disabled');
        }
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

    window.WebSocket.prototype.send = function(args) {
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
                        users = [];
                        for (let i in gmm.pixi){
                            gmm.pixi[i].container.destroy();
                            delete gmm.pixi[i];
                        }
                        gmm.enabled = false;
                    }
                    originalClose.call(this,...args);
                }
                this.onmessage2 = this.onmessage;
                this.onmessage = function(event){
                    if(!excludewss.includes(this) && typeof(event.data) == 'string'){
                        if (event.data.startsWith('42[')){
                            let packet = JSON.parse(event.data.slice(2,event.data.length));
                            if (packet[0] == 63){
                                if (packet[1].nhm){
                                    if (packet[1].nhm.gmm && myid != hostId && (!packet[1].nhm.target || packet[1].nhm.target == myid))
                                    {
                                        defineGMM(packet[1].nhm.gmm);
                                        display("[NGMM] The host has changed the gamemode.")
                                    }
                                    delete packet[1].nhm;
                                }
                                settings = packet[1];
                            }
                            if (packet[0] == 7){
                                myid = packet[1][0]
                                hostId = packet[1][1];
                                updateGMMButton();
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
                                updateGMMButton();
                                let user = findUser(packet[1]);
                                if (user){
                                    users.splice(user.index,1);
                                }
                            }
                            if (packet[0] == 45){
                                hostId = packet[1];
                                updateGMMButton();
                            }
                            if (packet[0] == 8){
                                if (myid == hostId && gmm.enabled)
                                {
                                    sendInfo({gmm: gmm.code,target: packet[1][4]});
                                }
                                if (gmm.enabled){
                                    if (game.state && getCurrentState()){
                                        for (let func of gmm.events.init4each){
                                            func(packet[1][2]);
                                        }
                                    }
                                }
                                users.push({"name":packet[1][0],"color":(packet[7]? (packet[7][1] || packet[7][0]):undefined),"team":packet[1][2],"id":packet[1][4],"lvl":packet[1][6]});
                            }
                        }
                    }
                    this.onmessage2.call(this,event);
                }
            }
        }
        return originalSend.call(this, args);
    }

    let chats = document.getElementsByClassName('content');
    window.addEventListener('keydown',(event) => {

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

    let editorDiv = document.querySelector("#appContainer > div.lobbyContainer > div.settingsBox > div.editorButton.settingsButton");
    let gmmEditor = editorDiv.cloneNode();
    gmmEditor.innerHTML = 'GMM';
    gmmEditor.style.width = 'calc((50% - 22px) / 2 - 5px)';
    editorDiv.style.width = 'calc((50% - 22px) / 2 - 5px';
    gmmEditor.style.right = 'calc((50% - 22px) / 2 + 20px)';
    gmmEditor.onclick = () => {
        if (hostId == myid){
            document.getElementsByClassName("lobbyContainer")[0].style.display = "none";
            editor.style.display = "block";
            return ' ';
        }
    }
    const splashScreen = document.createElement('div');
    document.getElementById("appContainer").appendChild(splashScreen);
    splashScreen.outerHTML = `<div id='splash' style='position: absolute; font-size: 10px; left: 20px; top: 20px; text-align: right; width: 290px; height: 160px; background-color: rgb(0,0,0,0.6); border-radius: 20px;'><img style='position: absolute; left: 10px; top: 10px;' src='https://raw.githubusercontent.com/SneezingCactus/gmmaker/master/src/gmWindow/images/gmmlogo.png' width='120' height='120'></img><div style='position: absolute; right: 5px; top: 5px;'><font size='5'>version: ${version}</font><p>NGMM has just loaded!</p><p>Original by sneezingCactus</p></div></div>`
    setTimeout(() => {
        document.querySelector("#splash").remove()
    },5000);
    editorDiv.parentNode.appendChild(gmmEditor);
});