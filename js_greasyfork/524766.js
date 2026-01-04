// ==UserScript==
// @name         Neon's custom editor
// @namespace    http://tampermonkey.net/
// @version      v1.1.1
// @description  A Mod to extend editor functionality.
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
// @downloadURL https://update.greasyfork.org/scripts/524766/Neon%27s%20custom%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/524766/Neon%27s%20custom%20editor.meta.js
// ==/UserScript==
 
const version = "v1.0.9";
const codeNames = {};
let jsSwitch = false;
const codeNamesRegex = {
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
            return [sim,thisses[1].split(".")[0],thisses[1].split(".")[1].split("(")[0],world.split("this.")[1].split(".")[0]];
        }
    },
}
 
 
function appendScript(link,head){
    let scr = document.createElement("script");
    scr.src = link;
    (head? document.head : document.body).appendChild(scr);
}
 
 
fetch(`https://hitbox.io/bundle.js`)
    .then(code => code.text())
    .then(code => {
    parent.document.getElementById("adboxverticalright").style.top = "-100000%";
    parent.document.getElementById("adboxverticalleft").style.top = "-200000%";
    for (let i in codeNamesRegex){
        codeNames[i] = codeNamesRegex[i].verify(code.match(codeNamesRegex[i].reg));
    }
 
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
 
    function timeConverter(UNIX_timestamp){
        let a = new Date(UNIX_timestamp * 1000);
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let month = months[a.getMonth()];
        let date = a.getDate();
        let hour = a.getHours();
        let min = a.getMinutes();
        let sec = a.getSeconds();
        let time = date + ' ' + month + ' ' + hour + ':' + min + ':' + sec ;
        return time;
    }
 
    let autosaves = JSON.parse(localStorage.getItem('autosaves') || '[]');
    let stateMaker;
    let mostScore = -1;
    console.log('damn bro');
    function autosave(){
        if (WSS && hostId == myid){
            let data = editorMaps[0].state.rc();
            autosaves.push([data,editorMaps[0].BN,Date.now()]);
            if (autosaves.length > 5){
                autosaves.splice(0,1);
            }
            localStorage.setItem('autosaves',JSON.stringify(autosaves));
            setAdvice("Auto saved map!");
        }
    }
    window.multiplayerSession.TJ.gWW = window.multiplayerSession.TJ.gW;
    window.multiplayerSession.TJ.gW = () => {
        window.multiplayerSession.TJ.gWW();
        autosave();
    }
    setInterval(() => {
        if (WSS){
            if (editorMaps[0] && hostId == myid){
                let data = editorMaps[0].state.rc();
                autosaves.push([data,editorMaps[0].BN,Date.now()]);
                if (autosaves.length > 5){
                    autosaves.splice(0,1);
                }
                localStorage.setItem('autosaves',JSON.stringify(autosaves));
                setAdvice("Auto saved map!");
            }
        }
    },40000);
 
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
 
    function updateInEditor() {
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
    console.log(settingsEndArray);
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
    window.editorMaps = editorMaps;
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
 
    // Stopped here
 
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
 
    function getWorld(){
        for (let i in stateMaker[codeNames.simulation[3]]){
            if (stateMaker[codeNames.simulation[3]][i].m_island){
                return stateMaker[codeNames.simulation[3]][i];
            }else if (stateMaker[codeNames.simulation[3]][i].PostSolve && !stateMaker[codeNames.simulation[3]][i].injected){
                stateMaker[codeNames.simulation[3]][i].injected = true;
                let a = stateMaker[codeNames.simulation[3]][i];
                const postSolve = a.PostSolve;
                a.PostSolve = function(contact, impulses) {
                    if (impulses.normalImpulses[0] > 0.0) {
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
 
    stateMaker.mmR = stateMaker[codeNames.simulation[1]][codeNames.simulation[2]];
    let inputsPropertie = null;
    for (let i in stateMaker[codeNames.simulation[1]]){
        if (stateMaker[codeNames.simulation[1]][i].constructor === Array){
            inputsPropertie = i;
        }
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
 
    //<textarea class="scrollBox" wrap="soft" spellcheck="false" style="border: none; outline: none; -webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; resize: none; position: absolute; overflow-y: scroll; overflow-x: hidden; background-color: #2f2f2f; height: calc(100% - 60px); width: calc(100% - 80px); left: 80px; top: 50px; box-sizing: border-box; border-bottom-left-radius: 7px; border-bottom-right-radius: 7px; white-space: nowrap;"></textarea>
 
    let myid = -1;
    let hostId = -1;
 
    let users = [];
    let abc = 'abcdefghijklmnopqrstuvwxyz';
    const alive = {};
    // Your code here...
 
    let toppest = null;
    // scope.toppest.children[1].children[0] is bg
    // starting from 1 to end, first is the most behind and the last is the furthest on the z index sort
    let overlayWidth = .25;
    let overlayHeight = .25;
 
    let lastRender = Date.now();
    // This a hacky method that will be replaced soon. this shit isn't very good
 
    const render = window.PIXI.Graphics.prototype._render;
    window.PIXI.Graphics.prototype._render = function(...args){
        render.call(this,...args)
        if (this.batchDirty == -1)
        {
            let parent = this.parent;
            while (parent.parent){
                parent = parent.parent;
            }
            toppest = parent;
            window.toppest = toppest;
        }
    }
 
    const render2 = window.PIXI.Text.prototype._render;
    window.PIXI.Text.prototype._render = function(...args){
        render2.call(this,...args)
        if (this.parent && this._text) {
            alive[this._text] = {orbj: this,obj: this.parent,frames: 16, txt: this};
        }
    }
 
    const render3 = window.PIXI.Renderer.prototype.render;
    window.PIXI.Renderer.prototype.render = function(...args){
        if (lastOverlayGraphics){
            if (lastOverlayGraphics.parent != toppest.children[1] || lastOverlayGraphics != toppest.children[toppest.children.length-1]){
                toppest.addChild(lastOverlayGraphics);
            }
            let bg = document.getElementById('backgroundImage')
            let w = bg.offsetWidth;
            let zoom = (toppest.children[1].width / w);
            let width = toppest.children[1].width;
            let height = toppest.children[1].height;
            lastOverlayGraphics.width = (overlayWidth/1)*width;
            lastOverlayGraphics.height = (overlayHeight/1)*height;
            lastOverlayGraphics.x = toppest.children[1].x+(overlayX/1)*width;
            lastOverlayGraphics.y = toppest.children[1].y+(overlayY/1)*height;
            lastOverlayGraphics.anchor.x = .5;
            lastOverlayGraphics.anchor.y = .5;
        }
        render3.call(this,...args)
    };
 
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
            let T = Date.now();
            let dt = (T-lc)/1000;
            lc = T;
            frames++
            Reflect.apply(...arguments);
            editorMaps = editorInfo[editorVarArray[4]];
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
 
                    }
                }else{
                    delete alive[i];
                }
            }
        }
    })
 
    const originalSend = window.WebSocket.prototype.send;
    let excludewss = [];
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
 
    //eval setInterval(() => {sendInfo({execute:`this.state.po[0].th = -20;`});},2000);
 
    function decodeString(encodedString){
        let V7T = atob(decodeURIComponent(encodedString));
        let g9_ = pako.inflate(V7T, {
            '\x74\x6f': "string"
        });
        return JSON.parse(g9_);
    }
 
    function encodeString(jsonData){
        let B8e = JSON.stringify(jsonData);
        let p1E = btoa(pako.deflate(B8e, {
            '\x74\x6f': "string"
        }));
        return encodeURIComponent(p1E);
    }
 
    const defaultMap = '{"b":[],"j":[],"s":[],"p":[],"tu":[],"tc":[],"gp":[],"c":[],"set":{"3":40,"4":0.5,"10":60,"11":0,"12":3690098,"15":40,"16":25,"17":2108492}}';
 
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
 
    function mapFromImage(url,w,h,sample,colorscale)
    {
        canvas.width = w;
        canvas.height = h;
        var img = new Image();
        img.src = url;
        img.setAttribute('crossOrigin', '');
        let data = {
            '\x62': [],
            '\x73\x65\x74': {
                "3": 40,
                "4": 0.5,
                "10": 60,
                "11": 0,
                "12": 3690098,
                "15": 40,
                "16": 25,
                "17": 2108492
            }
        };
        if (!codeNames.body){
            for (let i in editorMaps[0].state.all[5]){//[bodyId].Sa) {
                let body = editorMaps[0].state.all[5][i];
                if (body && body.Sa && body.Sa.length > 0){
                    for (let i2 in body.Sa){
                        let shape = body.Sa[i2];
                        if (shape && shape.ca && shape.ca[0]){
                            codeNames.body = {
                                body: body.constructor,
                                shape: shape.constructor,
                                point: shape.ca[0].constructor
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
        editorMaps[0].state.ac('eJwtyjEKgDAQRNG7TB1kNyYx2auIjSKClZBYiXd3ZVM9%2FjAPVsi8OJxGNS6j3d3NPPres%2B4N8mCEBHIIEBqiAxMkaTProHjImApRyRrRvpwg%2Fv9OKlMOxb%2FvB5nHII8%3D');
        let bod = new codeNames.body.body();
        img.onload = function() {
            if (WSS){
                WSS.send(`42[1,[58]]`);
            }
            canvas.width = img.width;
            canvas.height = img.height;
            let size = Math.floor(((1+Math.floor(canvas.width/370))+(1+Math.floor(canvas.height/370)))/2);
            canvas.width /= size;
            canvas.height /= size;
            if (sample == 0){
                sample = 40/canvas.width;
            }
            if (w == 0) {
                w = canvas.width;
            }
            if (h == 0){
                h = canvas.height;
            }
            ctx.clearRect(0,0,canvas.width,canvas.height)
            ctx.drawImage(img, 0, 0,canvas.width,canvas.height);
            const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = pixelData.data;
            bod.Jr = true;
            const colors = {};
            const colorGoals = {};
            const colorStarts = {};
            console.log("Pixel hashing start");
            const colorMergeHash = {};
            const canvasWidth = canvas.width;
            const colorscaleSquared = colorscale ** 2;
 
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    const index = (y * canvasWidth + x) * 4;
                    const alpha = pixels[index + 3]; // Alpha (transparency) component (0-255)
 
                    if (alpha > 240) {
                        const red = pixels[index]; // Red component (0-255)
                        const green = pixels[index + 1]; // Green component (0-255)
                        const blue = pixels[index + 2]; // Blue component (0-255)
                        let color = rgbToInt(red, green, blue);
 
                        let mergedColor = colorMergeHash[color] || null;
                        if (!mergedColor) {
                            for (const existingColor in colors) {
                                const existingRed = (existingColor >> 16) & 0xFF;
                                const existingGreen = (existingColor >> 8) & 0xFF;
                                const existingBlue = existingColor & 0xFF;
 
                                const colorDistanceSquared =
                                      (red - existingRed) ** 2 +
                                      (green - existingGreen) ** 2 +
                                      (blue - existingBlue) ** 2;
 
                                if (colorDistanceSquared < colorscaleSquared) {
                                    mergedColor = existingColor;
                                    colorMergeHash[color] = mergedColor;
                                    break;
                                }
                            }
                        }
 
                        if (mergedColor !== null) {
                            color = mergedColor;
                        }
                        if (!colors[color]) {
                            colors[color] = {};
                            colorStarts[color] = [x, y];
                            colorGoals[color] = [x,y];
                        }
                        colorStarts[color] = [Math.min(x,colorStarts[color][0]),Math.min(y,colorStarts[color][1])];
                        colorGoals[color] = [Math.max(x,colorGoals[color][0]),Math.max(y,colorGoals[color][1])];
                        colors[color][x + '.' + y] = true;
                    }
                }
            }
            console.log("Pixel hashing end");
            console.log("Color meshing start");
            for (let color in colors) {
                let pixels = colors[color];
                if (pixels) {
                    let rectangles = [];
                    let polygons = [];
                    let checkX = colorStarts[color][0];
                    let checkY = colorStarts[color][1];
                    let goalX = w;// colorGoals[color][0];
                    let goalY = h;//colorGoals[color][1];
                    overall:
                    for (let round = 0; round < 1; round++){
                        //console.log("PIXEL RASTERIZATION ROUND "+round);
                        let broke = true;
                        for (let i in pixels){
                            if (pixels[i]){
                                broke = false;
                                break;
                            }
                        }
                        if (broke){
                            break;
                        }
                        for (let y = checkY - 1; y <= goalY; y++) {
                            for (let x = checkX - 1; x <= goalX; x++) {
                                let key = x + '.' + y;
                                if (pixels[key]) {
                                    let endX = x;
                                    let endY = y;
 
                                    // Find the maximum endX for the current row
                                    while (endX < goalX && pixels[(endX + 1) + '.' + y]) {
                                        endX++;
                                    }
 
                                    // Check the rectangular area
                                    outerLoop:
                                    for (let iy = y; iy <= goalY; iy++) {
                                        for (let ix = x; ix <= endX; ix++) {
                                            if (!pixels[ix + '.' + iy]) {
                                                break outerLoop;
                                            }
                                        }
                                        endY = iy;
                                    }
 
                                    // Mark the rectangle as processed and collect it
                                    rectangles.push([x, y, (endX + 1) - x, (endY + 1) - y]);
 
                                    // Collect keys to delete
                                    let keysToDelete = [];
                                    for (let iy = y; iy <= endY; iy++) {
                                        for (let ix = x; ix <= endX; ix++) {
                                            keysToDelete.push(ix + '.' + iy);
                                        }
                                    }
                                    keysToDelete.forEach(key => delete pixels[key]);
                                }
                            }
                        }
                    }
                    console.log("Color meshing end");
                    // Placeholder for merging rectangles into polygons logic
                    // This can be a complex process involving checking adjacency and overlaps
                    // For simplicity, we will assume rectangles are merged if they share an edge or overlap
 
                    // Example simple merge implementation (improvement needed for complex merging)
                    console.log("Shape building start");
                    for (let rectangle of rectangles) {
                        let shape = new codeNames.body.shape();
                        let we = rectangle[2]*sample/2;
                        let he = rectangle[3]*sample/2;
                        shape.ca = [
                            new codeNames.body.point(we,he),
                            new codeNames.body.point(we,-he),
                            new codeNames.body.point(-we,-he),
                            new codeNames.body.point(-we,he)
                        ];
                        shape.x = (rectangle[0] * sample)+we;
                        shape.y = (rectangle[1] * sample)+he;
                        shape.Jr = true;
                        shape.color = parseInt(color); // Ensure color is parsed as an integer
 
                        bod.Sa.push(shape);
                    }
 
                    let pixelsleft = 0;
                    for (let pixel in pixels){
                        pixelsleft++;
                        let x = pixel.split('.')[0]-0;
                        let y = pixel.split('.')[1]-0;
                        let shape = new codeNames.body.shape();
                        let we = sample/2;
                        let he = sample/2;
                        shape.ca = [
                            new codeNames.body.point(we,he),
                            new codeNames.body.point(we,-he),
                            new codeNames.body.point(-we,-he),
                            new codeNames.body.point(-we,he)
                        ];
                        shape.x = x*sample+we;
                        shape.y = y*sample+he;
                        shape.Jr = true;
                        shape.color = parseInt(color);
 
                        bod.Sa.push(shape);
                    }
                }
            }
            console.log("Shape building stop");
            editorMaps[0].state.all[5].push(bod);
            if (WSS){
                console.log("Map rewrite start");
                WSS.send(`2[1, [50,"${editorMaps[0].state.rc()}"]]`);
                window.multiplayerSession.TJ.bW();
            }
            //editorMaps[0].state.ac(editorMaps[0].state.rc());
        }
 
    }
 
 
    window.mapFromImage = mapFromImage;
    /*{
    "b": [
        {
            "2": 12.25,
            "3": 11.25,
            "8": 3,
            "14": 2,
            "23": true,
            "s": [
                {
                    "7": 10595505,
                    "14": true,
                    "p": [
                        -0.25,
                        -0.25,
                        0.25,
                        -0.25,
                        0.25,
                        0.25,
                        -0.25,
                        0.25
                    ]
                }
            ]
        }
    ],
    "j": [],
    "s": [],
    "p": [],
    "tu": [],
    "tc": [],
    "gp": [],
    "c": [],
    "set": {
        "3": 40,
        "4": 0.5,
        "10": 60,
        "11": 0,
        "12": 3690098,
        "15": 40,
        "16": 25,
        "17": 2108492
    }
}*/
 
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
            if (!this.injectedNCE){
                this.injectedNCE = true;
                const originalClose = this.onclose;
                this.onclose = (...args) => {
                    if (WSS == this){
                        WSS = 0;
                        excludewss = [];
                        users = [];
                    }
                    originalClose.call(this,...args);
                }
                this.onmessage3 = this.onmessage;
                this.onmessage = function(event){
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
                                    users.splice(user.index,1);
                                }
                            }
                            if (packet[0] == 45){
                                hostId = packet[1];
                            }
                            if (packet[0] == 8){
                                users.push({"name":packet[1][0],"color":(packet[7]? (packet[7][1] || packet[7][0]):undefined),"team":packet[1][2],"id":packet[1][4],"lvl":packet[1][6]});
                            }
                        }
                    }
                    this.onmessage3.call(this,event);
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
 
    function updateEditor() {
        document.querySelector("#editorContainer > div.topMenu > div.topLabel.fileMenu > div > div:nth-child(5)").click();
        window.multiplayerSession.TJ.hide();
    }
 
    let windowContent;
    let windowTopProperties;
 
    function setPropertiesName(title) {
        let closeClick = windowTopProperties.children[0].onclick;
        let minimizeClick = windowTopProperties.children[1].onclick;
        windowTopProperties.innerHTML = windowTopProperties.innerHTML.replace("Merge Shapes",title);
        windowTopProperties.children[0].onclick = closeClick;
        windowTopProperties.children[1].onclick = minimizeClick;
    }
 
    let fields = 0;
 
    function addPropertiesField(title,description) {
        let div = document.createElement('div');
        div.classList.add("row");
        fields += 1;
        if (fields % 2 == 0) {
            div.classList.add("bgalt");
        }
        windowContent.appendChild(div);
        div.innerHTML = `<span class="title">${title}</span><span class="subtitle">${description}</span><input>`;
        return div;
    }
 
    function addPropertiesButton(title) {
        let div = document.createElement('div');
        div.classList.add("row");
        windowContent.appendChild(div);
        div.innerHTML = `<button>${title}</button>`;
        return div;
    }
 
    function setAdvice(advice) {
        if (document.querySelector("#editorContainer").style.display != 'none'){
            document.querySelector("#relativeContainer > div").textContent = advice;
        }
    }
 
    function openProperties() {
        document.querySelector("#editorContainer > div.topMenu > div.topLabel.toolsMenu > div > div:nth-child(1)").click();
        windowTopProperties = document.querySelector("#editorPropertiesWindow > div.topBar");
        windowContent = document.querySelector("#editorPropertiesWindow > div.contentDiv");
        windowContent.innerHTML = '';
    }
 
    function scaleBody(bodyId,sampleX,sampleY,sample,reverse) {
        updateEditor();
        for (let i in editorMaps[0].state.all[5][bodyId].Sa) {
            let p = editorMaps[0].state.all[5][bodyId].Sa[i];
            if (p) {
                p.x *= sampleX;
                p.y *= sampleY;
                p.ra *= sample;
                for (let i in p.ca) {
                    let z = p.ca[i];
                    if (z) {
                        z.x *= sampleX;
                        z.y *= sampleY;
                    }
                }
                if (reverse){
                    p.ca.reverse();
                }
            }
        }
        updateInEditor();
    }
 
    const editorTools = document.querySelector("#editorContainer > div.topMenu > div.topLabel.toolsMenu > div");
    let scaleBodyTool = document.createElement('div');
    let lastGraphicsAlpha = .5;
    editorTools.appendChild(scaleBodyTool);
    let overlayTool = document.createElement('div');
    editorTools.appendChild(overlayTool);
    let autosavesTool = document.createElement('div');
    editorTools.appendChild(autosavesTool);
    let centerTool = document.createElement('div');
    editorTools.appendChild(centerTool);
    let overlayX = 0.5;
    let overlayY = 0.5;
    // let brush = document.createElement('div');
    //editorTools.appendChild(brush);
    let copyMap = document.createElement('div');
    editorTools.appendChild(copyMap);
    copyMap.textContent = 'Copy Map';
    copyMap.classList.add("item");
    overlayTool.classList.add("item");
    overlayTool.textContent = 'Overlay Tool';
    autosavesTool.classList.add("item");
    autosavesTool.textContent = 'Auto Saves';
    overlayTool.textContent = 'Overlay Tool';
    let overlayTexture = null;
    let lastOverlayGraphics = null;
    let lastOverlayLink = '';
    autosavesTool.onclick = () => {
        openProperties();
        setPropertiesName("Auto saves");
        const clearButton = addPropertiesButton("Delete saves");
        clearButton.children[0].onclick = () => {
            autosaves = [];
            localStorage.setItem('autosaves','[]');
        }
        for (let id in autosaves){
            const data = autosaves[id];
            if (data){
                const button = addPropertiesButton("Save #"+id+" by "+data[1]+" - "+timeConverter(data[2] || Date.now()));
                button.children[0].onclick = () => {
                    editorMaps[0].state.ac(data[0]);
                    editorMaps[0].BN = data[1];
                    updateInEditor();
                }
            }
        }
    }
    overlayTool.onclick = () => {
        openProperties();
        setPropertiesName("Overlay Tool");
        const image = addPropertiesField("Overlay Image URL","The direct link to the image used for overlay");
        const imageFile = addPropertiesButton("Select File");
        const width = addPropertiesField("Width Scale","width of the image from scale to screen");
        const height = addPropertiesField("Height Scale","height of the image from scale to screen");
        const alpha = addPropertiesField("Alpha","The opacity of the image");
        const sxe = addPropertiesField("Position X Scale","The X position scale of the image to screen");
        const sye = addPropertiesField("Position Y Scale","The Y position scale of the image to screen");
        const alter = addPropertiesButton("Update overlay");
        const rem = addPropertiesButton("Remove overlay");
        alpha.children[2].value = lastGraphicsAlpha;
        image.children[2].value = lastOverlayLink;
        width.children[2].value = overlayWidth;
        height.children[2].value = overlayHeight;
        sxe.children[2].value = overlayX;
        sye.children[2].value = overlayY;
        imageFile.children[0].onclick = () => {
            let input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept","image/png, image/jpeg");
            input.click();
            input.onchange = () => {
                if (input.files.length == 1) {
                    const reader = new FileReader();
                    reader.addEventListener(
                        "load",
                        () => {
                            // convert image file to base64 string
                            image.children[2].value = reader.result;
                            alter.children[0].click();
                        },
                        false,
                    );
 
                    reader.readAsDataURL(input.files[0]);
                }
            }
        }
        rem.children[0].onclick = () => {
            if (overlayTexture){
                overlayTexture.baseTexture.destroy();
 
            }
            if (lastOverlayGraphics){
                lastOverlayGraphics.destroy();
            }
            lastOverlayGraphics = null;
            overlayTexture = null;
        }
        alter.children[0].onclick = async () => {
            let link = image.children[2].value;
            let widthe = width.children[2].value-0;
            let heighte = height.children[2].value-0;
            let alphae = alpha.children[2].value-0;
            let xe = sxe.children[2].value-0;
            let ye = sye.children[2].value-0;
            if (widthe != widthe || heighte != heighte){
                widthe = 100;
                heighte = 100;
            }
            if (overlayTexture){
                overlayTexture.baseTexture.destroy();
 
            }
            if (lastOverlayGraphics){
                lastOverlayGraphics.destroy();
            }
            lastOverlayLink = link;
            let img = new Image();
            img.src = link;
            window.PIXI.BaseImageResource.crossOrigin(img, link, true);
            img.onload = () => {
                let base = new window.PIXI.BaseTexture(img);
                let texture = new window.PIXI.Texture(base);
                overlayTexture = texture;
                lastOverlayGraphics = new window.PIXI.Sprite(overlayTexture);
                lastOverlayGraphics.width = widthe;
                lastOverlayGraphics.height = heighte;
                lastOverlayGraphics.anchor.x = 0;
                lastGraphicsAlpha = alphae;
                lastOverlayGraphics.alpha = alphae;
                overlayWidth = widthe;
                overlayHeight = heighte;
                overlayX = xe;
                overlayY = ye;
                lastOverlayGraphics.anchor.y = 0;
                lastOverlayGraphics.x = 0;
                lastOverlayGraphics.y = 0;
                toppest.addChild(lastOverlayGraphics);
            }
        }
    }
 
    copyMap.onclick = () => {
        document.querySelector("#editorContainer > div.topMenu > div.topLabel.fileMenu > div > div:nth-child(3)").click();
        setAdvice("Saving map...");
        document.querySelector("#appContainer > div.mapListContainer").style.display = 'none';
        new Promise((r,f) => {
            let intervalID = setInterval(() => {
                if (document.querySelector("#appContainer > div.mapListContainer > div.mapList > div.mapsContainer > div:nth-child(1)")) {
                    r();
                    clearInterval(intervalID);
                }
            },0);
        })
            .then(() => {
            document.querySelector("#appContainer > div.mapListContainer > div.mapList > div.mapsContainer > div:nth-child(1)").click();
            document.querySelector("#appContainer > div.mapListContainer > div.mapList > div.enterNameWindow > input").value = "#"+Math.floor(Math.random()*1000)+" by " + editorMaps[0].BN;
            setAdvice("Map saved as "+document.querySelector("#appContainer > div.mapListContainer > div.mapList > div.enterNameWindow > input").value);
            document.querySelector("#appContainer > div.mapListContainer > div.mapList > div.enterNameWindow > textarea").value = "This map was copied using NCE.";
            document.querySelector("#appContainer > div.mapListContainer > div.mapList > div.enterNameWindow > select").value = 0;
            document.querySelector("#appContainer > div.mapListContainer > div.mapList > div.enterNameWindow > div.button.okButton").click();
            document.querySelector("#editorContainer > div.topMenu > div.topLabel.fileMenu > div > div:nth-child(3)").classList.add("disabled");
            editorMaps[0].BN = 'COPIED';
            editorMaps[0].FN = 0;
            editorMaps[0].IN = true;
        })
    }
    scaleBodyTool.textContent = 'Scale Body';
    scaleBodyTool.classList.add("item");
    centerTool.textContent = 'Center Tools';
    centerTool.classList.add("item");
    //brush.classList.add("item");
    /*brush.onclick = () => {
        openProperties();
        setPropertiesName("Brush Color");
        const hex = addPropertiesField("Hex Color","The hex color used for brush:");
        const buttton = addPropertiesButton("Set");
        buttton.children[0].onclick = () => {
            let color = hexToRgb(botColor.children[1].value);
            if (color){//21
                let int = rgbToInt(color.r,color.g,color.b);
                const currentState = editorMaps[0].state;
                updateInEditor();
                editorMaps[0].state = currentState;
                updateInEditor();
            }
        }
    }*/
    centerTool.onclick = () => {
        openProperties();
        setPropertiesName("Center Body Tools");
        const srcId = addPropertiesField("Source Body ID","The body which center (aka. origin and push or bat point)");
        const sxe = addPropertiesField("Shift X","The scale used for X axis:");
        const sye = addPropertiesField("Shift Y","The scale used for Y axis:");
        const removeGlitch = addPropertiesButton("Remove Glitched Polygons From Body");
 
        removeGlitch.children[0].onclick = () => {
            updateEditor();
            let bodyId = srcId.children[2].value-0;
            let body = editorMaps[0].state.all[5][bodyId];
            if (body) {
                for (let i2 in body.Sa) {
                    let s = body.Sa[i2];
                    if (s && s.ca.length < 3 && s.ra <= 0){
                        delete body.Sa[i2];
                        break;
                    }
                }
            }
            updateInEditor();
        }
        const buttton1 = addPropertiesButton("Shift all offsets by X and Y (useful for determining where a player may bat or push the body)");
        buttton1.children[0].onclick = () => {
            updateEditor();
            let bodyId = srcId.children[2].value-0;
            let shiftX = sxe.children[2].value-0;
            let shiftY = sye.children[2].value-0;
            for (let i in editorMaps[0].state.all[5][bodyId].Sa) {
                let p = editorMaps[0].state.all[5][bodyId].Sa[i];
                if (p) {
                    p.x -= shiftX;
                    p.y -= shiftY;
                }
            }
            editorMaps[0].state.all[5][bodyId].x += shiftX;
            editorMaps[0].state.all[5][bodyId].y += shiftY;
            updateInEditor();
        }
        const buttton2 = addPropertiesButton("Center all offsets on bounding box (between all shapes, useful for determining where a player may bat or push the body)");
        buttton2.children[0].onclick = () => {
            let bodyId = srcId.children[2].value-0;
            updateEditor();
            let finalX = 0;
            let finalY = 0;
            let finalZ = 0;
            for (let i in editorMaps[0].state.all[5][bodyId].Sa) {
                let p = editorMaps[0].state.all[5][bodyId].Sa[i];
                if (p) {
                    let offset = 0;
                    let ofx = 0;
                    let ofy = 0;
                    let ofz = 0;
                    for (let i in p.ca) {
                        let z = p.ca[i];
                        if (z) {
                            ofx += z.x;
                            ofy += z.y;
                            ofz++;
                        }
                    }
                    ofx /= ofz;
                    ofy /= ofz;
                    for (let i in p.ca) {
                        let z = p.ca[i];
                        if (z) {
                            z.x -= ofx;
                            z.y -= ofy;
                        }
                    }
                    finalX += (p.x+ofx);
                    finalY += (p.y+ofy);
                    finalZ++;
                }
            }
            finalX /= finalZ;
            finalY /= finalZ;
            for (let i in editorMaps[0].state.all[5][bodyId].Sa) {
                let p = editorMaps[0].state.all[5][bodyId].Sa[i];
                if (p) {
                    p.x -= finalX;
                    p.y -= finalY;
                }
            }
            editorMaps[0].state.all[5][bodyId].x += finalX;
            editorMaps[0].state.all[5][bodyId].y += finalY;
            updateInEditor();
        }
    }
    scaleBodyTool.onclick = () => {
        openProperties();
        setPropertiesName("Scale Body");
        const bodyId = addPropertiesField("Source Body ID","The body to be scaled:");
        const sample = addPropertiesField("Scale Sample","The scale used for circles:");
        const sampleX = addPropertiesField("Scale Sample X","The scale used for X axis:");
        const sampleY = addPropertiesField("Scale Sample Y","The scale used for Y axis:");
        const buttton = addPropertiesButton("Scale");
        buttton.children[0].onclick = () => {
            scaleBody(bodyId.children[2].value,sampleX.children[2].value,sampleY.children[2].value,sample.children[2].value);
        }
        const buttton2 = addPropertiesButton("Flip X (Physics shapes compatible)");
        buttton2.children[0].onclick = () => {
            scaleBody(bodyId.children[2].value,-1,1,1,true);
        }
        const buttton3 = addPropertiesButton("Flip Y (Physics shapes compatible)");
        buttton3.children[0].onclick = () => {
            scaleBody(bodyId.children[2].value,1,-1,1,true);
        }
    };
 
    function hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
 
    function rgbToInt(r,g,b) {
        return 256*256*r+256*g+b;
    }
 
    const bgSet = document.querySelector("#editorContainer > div.sideBar > div:nth-child(17) > div.footer");
    const topColor = document.createElement('div');
    const botColor = document.createElement('div');
    bgSet.appendChild(topColor);
    bgSet.appendChild(botColor);
    topColor.innerHTML = `<span class="label">Top Color</span>
    <input style="position: absolute; width: 100%; background: #303030; top: 24px; border: 1px solid #222222; font-family: 'Bai Jamjuree'; outline: none; color: #ebebeb; padding: 4px;" class="nameField" maxlength="7">`
    botColor.innerHTML =`<span class="label">Bot Color</span>
    <input style="position: absolute; width: 100%; background: #303030; top: 24px; border: 1px solid #222222; font-family: 'Bai Jamjuree'; outline: none; color: #ebebeb; padding: 4px;" class="nameField" maxlength="7">`
 
    botColor.classList.add('paramContainer');
    topColor.classList.add('paramContainer');
    botColor.children[1].addEventListener("keyup",() => {
        let color = hexToRgb(botColor.children[1].value);
        if (color){//21
            updateEditor();
            let int = rgbToInt(color.r,color.g,color.b);
            editorMaps[0].state.settings[0][codeNames.settings[10]] = int;
            updateInEditor();
            document.querySelector("#editorContainer > div.sideBar > div.preview.bgTexPreview").click();
            botColor.children[1].focus();
        }
    })
    topColor.children[1].addEventListener("keyup",() => {
        let color = hexToRgb(topColor.children[1].value);
        if (color){//21
            updateEditor();
            let int = rgbToInt(color.r,color.g,color.b);
            console.log(int);
            editorMaps[0].state.settings[0][codeNames.settings[21]] = int;
            updateInEditor();
            document.querySelector("#editorContainer > div.sideBar > div.preview.bgTexPreview").click();
            topColor.children[1].focus();
        }
    })
    let editorDiv = document.querySelector("#appContainer > div.lobbyContainer > div.settingsBox > div.editorButton.settingsButton");
    let inputs = document.getElementsByClassName('input');
    let chatI = [];
 
    for (let c of inputs){
        if (c.parentElement.classList.contains('inGameChat') || c.parentElement.classList.contains('chatBox')){
            chatI.push(c);
            c.addEventListener('keydown',(event) => {
                if (event.keyCode == 13){
                    let newMsg = runCMD(c.value);
                    if (newMsg) {
                        if (newMsg.length < 2) {c.value = '';}else{c.value = newMsg;}
                    }
                }
            });
        }
    }
 
    function runCMD(command){
        if (command == "/image"){
            let input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept","image/png, image/jpeg");
            input.click();
            input.onchange = () => {
                if (input.files.length == 1) {
                    const reader = new FileReader();
                    reader.addEventListener(
                        "load",
                        () => {
                            // convert image file to base64 string
                            mapFromImage(reader.result,0,0,0,10);
                        },
                        false,
                    );
 
                    reader.readAsDataURL(input.files[0]);
                }
            }
            return ' ';
        }
        if (command.length >= 2){
            return command;
        }
    }
});