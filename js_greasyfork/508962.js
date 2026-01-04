// ==UserScript==
// @name         [TAS] Speedrun Tools
// @namespace    http://tampermonkey.net/
// @version      1.0.0
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
// @downloadURL https://update.greasyfork.org/scripts/508962/%5BTAS%5D%20Speedrun%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/508962/%5BTAS%5D%20Speedrun%20Tools.meta.js
// ==/UserScript==

const codeNames = {};
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

fetch(`https://hitbox.io/bundle.js`)
    .then(code => code.text())
    .then(code => {
    parent.document.getElementById("adboxverticalright").style.top = "-200000%";
    parent.document.getElementById("adboxverticalleft").style.top = "-200000%";
    for (let i in codeNamesRegex){
        codeNames[i] = codeNamesRegex[i].verify(code.match(codeNamesRegex[i].reg));
    }
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

    let stateMaker;
    let mostScore = -1;

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

    function loadKeys(classi,typ){
        let cons = String(classi.constructor);
        let defines = (cons.split("constructor() {")[1]).split("this.");
        let m = [];
        for (let i of defines){
            m.push(i.split("=")[0]);
        }
        codeNames.keys = m;
    }
    let overrideInputs = true;
    function getInputs(frame){
        overrideInputs = false;
        let inputs = stateMaker[codeNames.simulation[1]][codeNames.simulation[2]](frame,true);
        let ts = stateMaker[codeNames.simulation[1]].get(-1);
        overrideInputs = true;
        if (!codeNames.keys && ts){
            loadKeys(ts);
            codeNames.keySample = ts;
        }
        return inputs;
    }
    let tasInputs = [];
    let TAS = false;
    let myId = -1;
    stateMaker[codeNames.simulation[1]].gettr = stateMaker[codeNames.simulation[1]].get;
    const getTasInput = (frame) => {
        let inputData = tasInputs[frame];
        return inputData;
    }

    const sendInp = (inp,frame) => {
        if (!codeNames.keys && inp){
            loadKeys(inp);
            codeNames.keySample = inp;
        }
        let input = {
            left: inp.left? 1 : 0,
            right: inp.right? 1 : 0,
            up: inp[codeNames.keys[3]]? 1 : 0,
            down: inp[codeNames.keys[4]]? 1 : 0,
            bat: inp[codeNames.keys[7]]? 1 : 0, // BAT
            rocket: inp[codeNames.keys[6]]? 1 : 0, // ROCKET
            grab: inp[codeNames.keys[8]]? 1 : 0, // GRAB
            force: inp[codeNames.keys[5]]? 1 : 0 // FP
        }
        let inputInt = MAKE_KEYS(input);
        WSS.send(`42[1,[13,[${inputInt},${frame},${frame}]]]`)
        }

    stateMaker[codeNames.simulation[1]].get = (player,frame) => {
        if (overrideInputs && TAS) {
            let inp = getTasInput(frame);
            if (inp) {
                //sendInp(inp,frame);
            }else{
                inp = stateMaker[codeNames.simulation[1]].gettr(player,frame);
            }
            //42[1,[13,[128,397,32]]]
            return inp;
        }else{
            return stateMaker[codeNames.simulation[1]].gettr(player,frame);
        }
    }

    let stateProperty;
    function getAllStates() {
        let state;
        if (stateProperty) {
            state = stateMaker[stateProperty];
        } else {
            for (let a in stateMaker) {
                let b = stateMaker[a];
                if (b.constructor.name == "Array") {
                    for (let i of b) {
                        if (typeof (i) == "object" && "all" in i && i.all.constructor.name == "Array") {
                            if (i.all.length > 10 && i.all.length < 15) {
                                state = b;
                                stateProperty = a;
                                break;
                            }

                        }
                    }
                }
            }
        }
        if (state) {
            return state;
        }
    }

    let inputsPropertie = null;
    for (let i in stateMaker[codeNames.simulation[1]]) {
        if (stateMaker[codeNames.simulation[1]][i].constructor === Array) {
            inputsPropertie = i;
        }
    }
    let paused = false;
    const stateVars = String(stateMaker.constructor).match(/this\.(.*?)=/ig);
    stateVars.splice(0,1);
    const stateArray = [];
    for (let i of stateVars) {
        if (i && i.match("=")) {
            stateArray.push(i.split("this.")[1].split("=")[0]);
        }
    }

    let highestFrame = 0;

    const STB = function(x){
        if(x == "0"){
            return 0;
        }
        else{
            return 1;
        }
    };
    const BTS = function(x){
        if(x == 0){
            return "0";
        }
        else{
            return "1";
        }
    };

    const GET_KEYS = function(x){
        var x2 = ((x+256)>>>0).toString(2).substring(1).split("");
        return {"left":STB(x2[7]),"right":STB(x2[6]),"up":STB(x2[5]),"down":STB(x2[4]),"force":STB(x2[3]),"rocket":STB(x2[2]),"bat":STB(x2[1]),"grab":STB(x2[0])}
    };
    const MAKE_KEYS = function(x){
        return x.grab*128+x.bat*64+x.rocket*32+x.force*16+x.down*8+x.up*4+x.right*2+x.left;
    };
    //42[1,[13,[128,397,32]]]
    stateMaker.rrPP = stateMaker[codeNames.simulation[0]];
    stateMaker[codeNames.simulation[0]] = function (frame) {
        let simulated;
        try {
            if (paused && TAS){
                if (addFrames) {
                    stateMaker[stateArray[5]] += addFrames;
                    frame += addFrames;
                    if (stateMaker[stateArray[5]] > highestFrame || stateMaker[stateArray[5]] <= 1 || !getAllStates()[frame]){
                        stateMaker[stateArray[5]] -= addFrames;
                        frame -= addFrames;
                    }
                    addFrames = 0;
                }
                simulated = getAllStates()[frame];
                stateMaker[stateArray[5]] = frame-1;
            }else{
                if (frame == 1){
                    highestFrame = 0;
                }else{
                    highestFrame = Math.max(highestFrame,frame);
                }
                simulated = stateMaker.rrPP.call(this, frame);
                let inputs = stateMaker[codeNames.simulation[1]].gettr(0,frame);
                if (!tasInputs[frame] && TAS){
                    tasInputs[frame] = inputs;
                }
            }
        }catch(err){
            console.log(err);
        }
        return simulated;
    }

    function newkeydiv(){
        let div = document.createElement('div');
        div.style="width:60px;font-size:40px;height:60px;border-radius:15px;background-color:rgba(48,56,71,0.5);position:absolute;left=30px;pointer-events:none;"
        div.style.backgroundSize = "cover";
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
        Grab: newkeydiv(),
        Timer: newkeydiv(),
        Pause: newkeydiv(),
        Previous: newkeydiv(),
        Foward: newkeydiv(),
        TAS: newkeydiv(),
        ResetInputs: newkeydiv(),
    }

    let addFrames = 0;

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

    function updateInps(){
        for (let i in keyDivs) {
            let div = keyDivs[i];
            div.style.backgroundColor = inps[i]? 'rgba(178,205,255,1)' : 'rgba(48,56,71,0.5)';
        }
        keyDivs.Timer.style.background = 'rgb(0,0,0,0)';
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
    });

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
    keyDivs.Timer.style.bottom = '50px';
    keyDivs.Timer.style.width = '100%';
    keyDivs.Timer.style.background = 'rgb(0,0,0,0)';
    document.body.appendChild(keyDivs.Left);
    document.body.appendChild(keyDivs.Down);
    document.body.appendChild(keyDivs.Right);
    document.body.appendChild(keyDivs.Up);
    document.body.appendChild(keyDivs.Bat);
    document.body.appendChild(keyDivs.Rocket);
    document.body.appendChild(keyDivs.Grab);
    document.body.appendChild(keyDivs['Force Push']);
    document.body.appendChild(keyDivs.Timer);
    document.body.appendChild(keyDivs.Pause);
    document.body.appendChild(keyDivs.Previous);
    document.body.appendChild(keyDivs.Foward);
    document.body.appendChild(keyDivs.TAS);
    document.body.appendChild(keyDivs.ResetInputs);

    keyDivs.Timer.textContent = "00:00:00 | 0 frames";
    keyDivs.Pause.style.right = '150px';
    keyDivs.Pause.style.bottom = '50px';
    keyDivs.Pause.style.pointerEvents = 'all';
    keyDivs.Pause.textContent = '⏸'
    keyDivs.Pause.onclick = () => {
        paused = !paused;
        keyDivs.Pause.textContent = paused? '▶' : '⏸'
        keyDivs.Pause.style.backgroundColor = paused? 'white' : 'rgba(48,56,71,0.5)';
    }
    keyDivs.Previous.style.right = '210px';
    keyDivs.Previous.style.bottom = '50px';
    keyDivs.Previous.style.pointerEvents = 'all';
    keyDivs.TAS.textContent = '⏺';
    keyDivs.Previous.textContent = '⏪';
    keyDivs.Foward.textContent = '⏩';
    let addingFrames = false;
    let removingFrames = false;
    keyDivs.Previous.onmousedown = () => {
        removingFrames = true;
        paused = true;
        keyDivs.Previous.style.backgroundColor = 'white';
        keyDivs.Pause.style.backgroundColor = paused? 'white' : 'rgba(48,56,71,0.5)';
        keyDivs.Pause.textContent = paused? '▶' : '⏸'
    }
    keyDivs.Foward.style.right = '90px';
    keyDivs.Foward.style.bottom = '50px';
    keyDivs.Foward.style.pointerEvents = 'all';
    keyDivs.Foward.onmousedown = () => {
        addingFrames = true;
        paused = true;
        keyDivs.Foward.style.backgroundColor = 'white';
        keyDivs.Pause.style.backgroundColor = paused? 'white' : 'rgba(48,56,71,0.5)';
        keyDivs.Pause.textContent = paused? '▶' : '⏸'
    }
    keyDivs.TAS.style.right = '30px';
    keyDivs.TAS.style.bottom = '50px';
    keyDivs.TAS.style.pointerEvents = 'all';
    keyDivs.TAS.onmousedown = () => {
        TAS = !TAS;
        tasInputs = [];
        keyDivs.TAS.style.backgroundColor = TAS? 'white' : 'rgba(48,56,71,0.5)';
    }
    keyDivs.ResetInputs.style.right = '270px';
    keyDivs.ResetInputs.style.bottom = '50px';
    keyDivs.ResetInputs.style.pointerEvents = 'all';
    keyDivs.ResetInputs.onmousedown = () => {
        let frame = stateMaker[stateArray[5]];
        tasInputs.splice(frame,tasInputs.length-frame);
        keyDivs.ResetInputs.style.backgroundColor = 'white';
        setTimeout(() => {
            keyDivs.ResetInputs.style.backgroundColor = 'rgba(48,56,71,0.5)';
        },500);
    }
    window.addEventListener('mouseup',() => {
        addingFrames = false;
        removingFrames = false;
        keyDivs.Foward.style.backgroundColor = 'rgba(48,56,71,0.5)';
        keyDivs.Previous.style.backgroundColor = 'rgba(48,56,71,0.5)';
    })
    keyDivs.Grab.style.backgroundImage = 'url(https://i.ibb.co/JncFVMT/grab.png)';
    keyDivs.Bat.style.backgroundImage = 'url(https://i.ibb.co/pQfPTqM/bat.png)';
    keyDivs.Rocket.style.backgroundImage = 'url(https://i.ibb.co/QCWK7Xs/rocket.png)';
    keyDivs['Force Push'].style.backgroundImage = 'url(https://i.ibb.co/D5hK6cP/force-push.png)';

    const originalSend = window.WebSocket.prototype.send;
    let WSS = 0;
    let excludewss = [];

    let gameStartTimestamp = 0;
    let gameRunning = false;

    //42[16, start
    //42[22] stop
    //42[1,[21]] end host

    setInterval(() => {
        if (addingFrames){
            addFrames = 1;
        }
        if (removingFrames){
            addFrames = -1;
        }
    },1/15);

    window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
        apply( target, thisArgs, args ) {
            Reflect.apply(...arguments);
            if (gameRunning) {
                let maxMil = Math.max(0,Date.now()-gameStartTimestamp);
                let mil = maxMil;
                let sec = Math.floor(mil/1000);
                let min = Math.floor(sec/60);
                sec %= 60;
                mil %= 1000;
                sec = ("0".repeat(Math.max(0,2-String(sec).length)))+sec;
                mil = ("0".repeat(Math.max(0,2-String(mil).length)))+mil;
                min = ("0".repeat(Math.max(0,2-String(min).length)))+min;
                keyDivs.Timer.textContent = min+":"+sec+":"+mil+" | "+Math.floor((maxMil/1000)*30)+" frames";
            }
        }
    })

    let WSSinit = false;

    window.WebSocket.prototype.send = async function(args) {
        if(this.url.includes("/socket.io/?EIO=3&transport=websocket&sid=")){
            if(typeof(args) == "string" && !excludewss.includes(this)){
                if (!WSS){
                    WSS = this;
                    WSSinit = false;
                    setTimeout(() => {
                        if (WSSinit){
                            WSS.onmessage({data: `42[18,false,["eJyrVkpSsoqO1VHKglDFEKoAQpWUQulkCJ0OFYdyi1NLlKyqlYyVrIxNdZRMlKwM9IC0oYGSlZkBkDYECgApIwhlDqRqawFiwBsq","Baseplate","Chaz","",false,-1,0,0,null],{"9": 1}]`})
                        }
                    },10000);
                }

                if (args.startsWith('42[1,[21]]') || args.startsWith('42[1,[68')) {
                    gameRunning = false;
                }
                if (args.startsWith('42[1,[13,[')) {
                    let packet = JSON.parse('['+args.split('42[')[1]);
                    let keys = GET_KEYS(packet[1][1][0]);
                }
            }

            if (!this.injecteded){
                this.injecteded = true;
                const originalClose = this.onclose;
                this.onclose = (...args) => {
                    if (WSS == this){
                        WSS = 0;
                    }
                    originalClose.call(this,...args);
                }
                this.onmessage8 = this.onmessage;
                this.onmessage = function(event){
                    if(!excludewss.includes(this) && typeof(event.data) == 'string'){
                        /*

                    */
                        if (event.data.startsWith('42[')){
                            let packet = JSON.parse(event.data.slice(2,event.data.length));
                            if (packet[0] == 18 || packet[0] == 6 || packet[0] == 20){
                                gameRunning = false;
                                WSSinit = false;
                            }
                            if (packet[0] == 7){
                                myId = packet[1][0]
                            }
                            if (packet[0] == 16){
                                gameStartTimestamp = Date.now()+3000;
                                gameRunning = true;

                            }
                            if (packet[0] == 22){
                                gameRunning = false;
                            }
                        }
                    }
                    this.onmessage8(event);
                }
            }
        }
        return originalSend.call(this, args);
    }
});