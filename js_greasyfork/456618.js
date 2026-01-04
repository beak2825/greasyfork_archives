// ==UserScript==
// @name         Bonk VTOL
// @version      5.1
// @author       Salama + paren patch
// @description  Brings back the legendary gamemode known as VTOL to bonk.io
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @supportURL   https://discord.gg/Dj6usq7ww3
// @namespace    https://greasyfork.org/users/824888
// @downloadURL https://update.greasyfork.org/scripts/456618/Bonk%20VTOL.user.js
// @updateURL https://update.greasyfork.org/scripts/456618/Bonk%20VTOL.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

let injector = (str) => {
    let newStr = str;
let END_GAME=`
function i5S() {
    if(u6H[11]["hostID"] == u6H[11]["getLSID"]()) {
        u6H[11]["sendReturnToLobby"]();
    }
`;

let RENDER_JETPACK=`
if(this["gameSettings"]["mo"]=="v") {
    this["VTOLWing"]=new PIXI["Graphics"]();
    this["VTOLWing"]["beginFill"](0xcccccc);
    this["VTOLWing"]["drawRect"](
        this["radius"]*(-{uniVar}["footHW"]+{uniVar}["footOffsetX"]),
        this["radius"]*(-{uniVar}["footHH"]+{uniVar}["footOffsetY"]),
        this["radius"]*({uniVar}["footHW"]*2),
        this["radius"]*({uniVar}["footHH"]*2)
    );
    this["VTOLWing"]["beginFill"](0xcccccc);
    this["VTOLWing"]["drawRect"](
        this["radius"]*(-{uniVar}["footHW"]+-{uniVar}["footOffsetX"]),
        this["radius"]*(-{uniVar}["footHH"]+{uniVar}["footOffsetY"]),
        this["radius"]*({uniVar}["footHW"]*2),
        this["radius"]*({uniVar}["footHH"]*2)
        );
    this["container"]["addChild"](this["VTOLWing"]);
}`;

let VTOL=`"v") {
    var VTOL_O1B=[];
    VTOL_O1B[11]=(-22/30)*{sizeMultiplier};
    VTOL_O1B[791]=0.12;
    VTOL_O1B[874]=new {box2d}.Common.Math.b2Vec2(0,VTOL_O1B[11]);
    VTOL_O1B[874]={playerObject}["body"]["GetWorldVector"](VTOL_O1B[874],VTOL_O1B[874]);
    VTOL_O1B[857]=new {box2d}.Common.Math.b2Vec2(0,VTOL_O1B[11]*VTOL_O1B[791]);
    VTOL_O1B[857]={playerObject}["body"]["GetWorldVector"](
        VTOL_O1B[857],
        VTOL_O1B[857]
    );
    VTOL_O1B[347]={playerObject}["body"]["GetWorldPoint"](new {box2d}.Common.Math.b2Vec2(
        {uniVar}["footOffsetX"]*{sizeMultiplier},
        {uniVar}["footOffsetY"]*{sizeMultiplier}
    ));
    VTOL_O1B[848]={playerObject}["body"]["GetWorldPoint"](new {box2d}.Common.Math.b2Vec2(
        -{uniVar}["footOffsetX"]*{sizeMultiplier},
        {uniVar}["footOffsetY"]*{sizeMultiplier}
    ));
    VTOL_O1B[195]="none";
    if({inputs}["up"]) {
        if({inputs}["left"]) {
            VTOL_O1B[195]="right";
        }
        else if({inputs}["right"]) {
            VTOL_O1B[195]="left";
        }
        else {
            VTOL_O1B[195]="both";
        }
    }
    else if({inputs}["left"] && {inputs}["right"]) {
        VTOL_O1B[195]="both";
    }
    else if({inputs}["left"]) {
        VTOL_O1B[195]="right";
    }
    else if({inputs}["right"]) {
        VTOL_O1B[195]="left";
    }
    if(VTOL_O1B[195]=="both") {
        {playerObject}["body"]["ApplyImpulse"](VTOL_O1B[874],VTOL_O1B[347]);
        {playerObject}["body"]["ApplyImpulse"](VTOL_O1B[874],VTOL_O1B[848]);
    }
    if(VTOL_O1B[195]=="left") {
        {playerObject}["body"]["ApplyImpulse"](VTOL_O1B[874],VTOL_O1B[347]);
        {playerObject}["body"]["ApplyImpulse"](VTOL_O1B[857],VTOL_O1B[848]);
    }
    if(VTOL_O1B[195]=="right") {
        {playerObject}["body"]["ApplyImpulse"](VTOL_O1B[857],VTOL_O1B[347]);
        {playerObject}["body"]["ApplyImpulse"](VTOL_O1B[874],VTOL_O1B[848]);
    }
}`;

/**YOINKED WITH PERMISSION FROM BLU <3**/
let VARTOL_PARTICLES = `if (arguments[3].mo == "v") {
    for (let currDisc = 0; currDisc < arguments[1].discs.length; currDisc++) {
        if (arguments[0].discs[currDisc] && arguments[1].discs[currDisc] && this.discGraphics[currDisc] && arguments[4] && arguments[4][currDisc]) {
            let particleSize = 2.5 * this.discGraphics[currDisc].radius / arguments[1].physics.ppm;
            let percentAlongJetpack = 0.85;
            let xOffset = -this.discGraphics[currDisc].radius * ({stepperVar}.footOffsetX + -{stepperVar}.footHW) * percentAlongJetpack;

            let spreadWidth = .3;
            let spreadDir = Math.random() * spreadWidth - spreadWidth / 2;
            let dir = arguments[1].discs[currDisc].a + spreadDir + Math.PI / 2;
            let avgSpeed = 2;
            let maxRandSpeed = .7;
            let speed = avgSpeed + (Math.random() * maxRandSpeed) - (maxRandSpeed / 2);
            let particleXV = Math.cos(dir) * speed;
            let particleYV = Math.sin(dir) * speed;
            particleXV += arguments[1].discs[currDisc].xv / 30;
            particleYV += arguments[1].discs[currDisc].yv / 30;

            let fireJetpack = [];
            if(arguments[4][currDisc].left && !arguments[4][currDisc].action2) fireJetpack.push("right");
            if(arguments[4][currDisc].right && !arguments[4][currDisc].action2) fireJetpack.push("left");
            if(arguments[4][currDisc].up && !fireJetpack.length) fireJetpack = ["left", "right"];
            for(let jetpack in fireJetpack) {
                let particle = new PIXI.Graphics;
                // vanilla vtol (with old renderer lighting fx accounted for) = 0xffffd9;
                particle.beginFill(0xffd9d9);
                particle.drawRect(0, -particleSize/2, particleSize, particleSize);
                particle.x = this.discGraphics[currDisc].container.x + ((fireJetpack[jetpack] == "right" ? xOffset : -xOffset) * Math.cos(this.discGraphics[currDisc].container.rotation));
                particle.y = this.discGraphics[currDisc].container.y + ((fireJetpack[jetpack] == "right" ? xOffset : -xOffset) * Math.sin(this.discGraphics[currDisc].container.rotation));
                this.blurContainer.addChild(particle);
                this.particleManager.container.addChild(particle);
                this.particleManager.particles.push({graphics: particle, xv: particleXV, yv: particleYV, alpha: 1, shrinkPerFrame: 0.05, gravity: .04});
            }
        }
    }
}`;

let stepperVar = newStr.match(/([a-zA-Z0-9\$]{1,5})\[.{2,5}\[.{1,10}\]=\{discs:.{1,20}shakeVectorThisStep/)[1]
let uniVar=newStr.match(/\(0,20\)\);[A-Z]/)[0][8]; // functional
let box2d=newStr.match(/requirejs(.){0,70}function\(...,...,.../)[0].slice(-3); // functional

let buildFunction = newStr.match(/build\(...,...\) \{var ...=\[arguments\];...\[[0-9]+\]=[a-zA-Z0-9\$]{2,5};this\[(.){0,30}new PIXI/)[0].split("var "); // nonfunctional so far
newStr=newStr.replace(buildFunction[0], buildFunction[0] + RENDER_JETPACK.replaceAll('{uniVar}', uniVar));

let sizeMultiplier=newStr.match(/20;\}...\[(\d){1,3}\]\*=...\[(\d){1,3}\]/)[0].split("=")[1];
let playerObject=newStr.match(/...\[(\d){1,3}\]\[...\[(\d){1,3}\]\]=\{a1a:/)[0].split("=")[0];
let inputs = `${playerObject.substr(0, 3)}[0][1][${playerObject.match(/\[...\[(\d){1,3}\]\]/)[0].slice(1, -1)}]`;
newStr=newStr.replace('"v"){;}',
    VTOL.replaceAll('{box2d}', box2d)
    .replaceAll('{sizeMultiplier}', sizeMultiplier)
    .replaceAll('{playerObject}', playerObject)
    .replaceAll('{inputs}', inputs)
    .replaceAll('{uniVar}', uniVar)
);

let lobbyModes=newStr.match(/...\....\((\d){1,4}\)\];...\[(\d){1,3}\](.){0,20}\[\];/)[0];
newStr=newStr.replace(lobbyModes,"'v'," + lobbyModes);

let lastMode = newStr.match(/editorCanTarget:[a-z]{4,5}\};/g).slice(-1);
let modeVar = newStr.match(/editorCanTarget:[a-z]{4,5}\};...\[(\d){1,3}\]\[...\[(\d){1,3}\]\[(\d){1,3}\]\]/)[0].split(";")[1];
newStr=newStr.replace(lastMode, lastMode + modeVar + "['v'].editorCanTarget=true;");

//let gameEndFunction = newStr.match(`function ...\(\)\{var ...=\[arguments\];(.){0,50}if\(${varInGameEndFunction.substr(0, 3)}\[(\d){1,3}\]\)\{${varInGameEndFunction.substr(0, 3)}\[(\d){1,3}\]\[...\[(\d){1,3}\]\[(\d){1,3}\]\]\(\);${varInGameEndFunction.substr(0, 3)}\[(\d){1,3}\]\[...\[(\d){1,3}\]\[(\d){1,3}\]\]\(\);`)[0];
newStr=newStr.replace('function i5S(){', END_GAME);

// add particles to renderer
newStr = newStr.replace(`this.particleManager.render`, `${VARTOL_PARTICLES.replaceAll('{stepperVar}', stepperVar)} this.particleManager.render`);   console.log("Bonk VTOL injector run");
    return newStr;
}

if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
    try {
        return injector(bonkCode);
    } catch (error) {
        alert(
`Whoops! Bonk VTOL was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
Bonk VTOL, such as the Bonk Leagues Client. You would have to disable it to use \
Bonk VTOL.`);
        throw error;
    }
});

console.log("Bonk VTOL injector loaded");