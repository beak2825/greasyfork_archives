// ==UserScript==
// @name         bonk-vtol-alternate
// @version      1.0.0
// @author       LeWolfYT
// @description  A userscript to add VTOL back into bonk.io. Works with most extensions and userscripts (other than the VarTOL mod by Blu, which this script is based on)
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1089374
// @downloadURL https://update.greasyfork.org/scripts/467993/bonk-vtol-alternate.user.js
// @updateURL https://update.greasyfork.org/scripts/467993/bonk-vtol-alternate.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

const injectorName = `VTOL`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

// escape special regex characters for RegExp obj
function escReg(reg){
  return reg.replace(/([[\]])/g, "\\$1");
}

function injector(src){
  let newSrc = src;
  const modeName = "var";

  // locate beginning of requirejs function
  const REQUIREJS_REGEX = /"use strict";var ([\w]+)=([\w]+);.{0,20}var ([\w]+)=\[arguments\];/;
  let requirejsMatch = newSrc.match(REQUIREJS_REGEX);
  let localObject = requirejsMatch[1];
  let globalObject = requirejsMatch[2];
  let argumentsObject = requirejsMatch[3];

  // locate game object responsible for createNewState and step
  let gameObject = newSrc.match(/\]=new (\w)\(\);/)[1];

  const RENDER_JETPACK=`if(this.gameSettings.mo == "${modeName}") {
		this.VTOLWing = new PIXI.Graphics();
		this.VTOLWing.beginFill(0xcccccc);
		this.VTOLWing.drawRect(
			this.radius * (-${gameObject}.footHW + ${gameObject}.footOffsetX),
			this.radius * (-${gameObject}.footHH + ${gameObject}.footOffsetY),
			this.radius * (${gameObject}.footHW * 6),
			this.radius * (${gameObject}.footHH * 2)
		);
		this.container.addChild(this.VTOLWing);
	}`;

  // identify obfuscated identifiers necessary for VARTOL_GAME
  let discs = newSrc.match(/discs:(.{5,20}),/)[1];
  let currentIndex = newSrc.match(new RegExp(`\\(${escReg(discs)}(\\[[\\w$]{3}\\[\\d{1,4}\\]\\]).{5,20} == 1000\\)`))[1];
  let gameSettings = newSrc.match(/gameSettings:(.{5,20}),/)[1];
  let stepArgObject = gameSettings.split('[')[0];
  let magicNumber = newSrc.match(new RegExp(`${stepArgObject}\\[\\d{1,4}\\]\\*=(${stepArgObject}\\[\\d{1,4}\\])`))[1];

  const VARTOL_GAME = `if (${gameSettings}.mo == "${modeName}") {
    let player = ${discs}${currentIndex};
    let fullPowerMultiplier = (-22/30)*${magicNumber};
    let weakMultiplier = 0.12;
    let bVec = ${argumentsObject}[0][2].Common.Math.b2Vec2;

    let fullPower = new bVec(0,fullPowerMultiplier);
    fullPower = player.body.GetWorldVector(fullPower,fullPower);
    let weakPower = new bVec(0,fullPowerMultiplier*weakMultiplier);
    weakPower = player.body.GetWorldVector(weakPower, weakPower);

    let leftWing = player.body.GetWorldPoint(new bVec(${gameObject}.footOffsetX*${magicNumber}, ${gameObject}.footOffsetY*${magicNumber}));
    let rightWing = player.body.GetWorldPoint(new bVec(-${gameObject}.footOffsetX*${magicNumber}, ${gameObject}.footOffsetY*${magicNumber}));

    let jetpackInput = "none";
    let playerInput = ${stepArgObject}[0][1]${currentIndex};
    if(playerInput.up) jetpackInput = "both";
    if(player.ds == 0){
      if(playerInput.left) jetpackInput = "right";
      if(playerInput.right) jetpackInput = "left";
      if(playerInput.left && playerInput.right) jetpackInput = "both";
    }

    if(jetpackInput=="both") {
      player.body.ApplyImpulse(fullPower,leftWing);
      player.body.ApplyImpulse(fullPower,rightWing);
    }
    if(jetpackInput=="left") {
      player.body.ApplyImpulse(fullPower,leftWing);
      player.body.ApplyImpulse(weakPower,rightWing);
    }
    if(jetpackInput=="right") {
      player.body.ApplyImpulse(weakPower,leftWing);
      player.body.ApplyImpulse(fullPower,rightWing);
    }
  }`;

  // add the VTOL movement code in same scope
  let magicDeclare = newSrc.match(new RegExp(`${escReg(magicNumber)}=.{120,180}?;`))[0];
  newSrc = newSrc.replace(magicDeclare, `$& ${VARTOL_GAME}`);

   // locate createArrow function
  //const CREATEARROW_REGEX = /function \w{2}\(\w{3},\w{3},\w{3}\)\{.{200,1000}x:.*?;\}{1,2}/g;
  //let createarrowMatch = newSrc.match(CREATEARROW_REGEX).filter(x=>!x.includes('return'))[0];
  //let createArrowFunc = createarrowMatch.match(/function (\w{2})/)[1];


  // get string function indices of each vanilla mode
  const MODENAME_REGEX = /(\d+)\)]={lobbyName:/g;
  let modenameMatch = newSrc.match(MODENAME_REGEX).map(x=>x.split(")")[0]);
  let modeIndices = {
    b: modenameMatch[0],
    v: modenameMatch[1],
    sp: modenameMatch[2],
    ar: modenameMatch[3],
    ard: modenameMatch[4],
    bs: modenameMatch[5],
    f: modenameMatch[6]
  };

  // locate lobbyModes array initialisation
  const LASTMODE_REGEX = `${localObject}\\.[\\w$]{1,3}\\(${modeIndices.f}\\)`;
  const MODEARRAY_REGEX = new RegExp(`=\\[(${localObject}\\.[\\w$]{1,3}\\(${modeIndices.b}\\).*?),(${LASTMODE_REGEX})]`);
  let modearrayMatch = newSrc.match(MODEARRAY_REGEX);
  // add VarTOL to mode selection button, before Football
  newSrc = newSrc.replace(modearrayMatch[0], `=[${modearrayMatch[1]},"${modeName}",${modearrayMatch[2]}]`);

  // locate Football mode metadata initialisation
  const FOOTBALLDATA_REGEX = new RegExp(`${argumentsObject}\\[(\\d{1,3})\\]\\[${argumentsObject}.{5,10}\\]\\[.{5,10}${modeIndices.f}\\)]={lobbyName:${localObject}\\.[\\w$]{1,3}\\(.*?,editorCanTarget:false}`);
  let footballdataMatch = newSrc.match(FOOTBALLDATA_REGEX);
  let metadataIndex = footballdataMatch[1];
  const VARTOL_METADATA = `{lobbyName:"VTOL",gameStartName:"VTOL",lobbyDescription:"The original VTOL mode, brought back into Bonk.io.",tutorialTitle:"VTOL Mode",tutorialText:"•Fly around with the arrow keys\\r\\n•Hold X to make yourself heavier",forceTeams:false,forceTeamCount:null,editorCanTarget:false}`;
  let vartolData = `${argumentsObject}[${metadataIndex}].modes.${modeName} = ${VARTOL_METADATA};`;
  // add VarTOL mode metadata
  newSrc = newSrc.replace(footballdataMatch[0], `${footballdataMatch[0]}; ${vartolData}`);

   // locate ar outline and bow graphic initialisation
  //const ARGRAPHIC_REGEX = new RegExp(`this\\[.{20,30}\\] == ${localObject}\\.[\\w$]{3}\\(${modeIndices.ar}\\)`, 'g');
  //let argraphicMatch = newSrc.match(ARGRAPHIC_REGEX);
  //if(argraphicMatch.length != 2) throw "Injection failed!";
   // add ar outline and bow graphics to var
  //if(argraphicMatch[0] == argraphicMatch[1]) newSrc = newSrc.replaceAll(argraphicMatch[0], `$& || this.gameSettings.mo == "${modeName}"`);
  //else argraphicMatch.forEach(x => newSrc = newSrc.replace(x, `$& || this.gameSettings.mo == "${modeName}"`));

  // locate player graphic initialisation
  let playerfillMatch = newSrc.match(/this\[.{20,30}\]\(0x448aff/)[0];
  // add jetpack graphic before player graphic
  newSrc = newSrc.replace(playerfillMatch, `${RENDER_JETPACK}; ${playerfillMatch}`);

   // locate a1a cooldown
  //const ARROWCOOLDOWN_REGEX = /== -1 && \((.{20,25}) == "ar"/;
  //let arrowcooldownMatch = newSrc.match(ARROWCOOLDOWN_REGEX);
  //let currentMode = arrowcooldownMatch[1];
   // add var to cooldown check
  //newSrc = newSrc.replace(arrowcooldownMatch[0],`${arrowcooldownMatch[0]} || ${currentMode} == "${modeName}"`);

   // locate arrow direction and charge applyInputs
  //let arrowinputsMatch = newSrc.match(new RegExp(`if\\(${escReg(currentMode)} == "ar"`))[0];
   // add var to applyInputs check
  //newSrc = newSrc.replace(arrowinputsMatch, `${arrowinputsMatch} || ${currentMode} == "${modeName}"`);

   // locate doArrows invocation
  //const DOARROWS_REGEX = /}if\((this\[\w{3}\[\d{1,4}\]\]\[\w{3}\[\d{1,4}\]\]) == "ar" \|\| (.{20,200}?\){this\[\w{3}\[\d{1,4}\]\]\(\w{3},\w{3},\w{3},\w{3}\);)/;
  //let doarrowsMatch = newSrc.match(DOARROWS_REGEX);
  //currentMode = doarrowsMatch[1];
  //let restOfIf = doarrowsMatch[2];
   // add var to doArrows check
  //newSrc = newSrc.replace(doarrowsMatch[0], `}if(${currentMode} == "ar" || this.gameSettings.mo == "${modeName}" || ${restOfIf}`);

   // locate createNewState set arrows cooldown to half
  //const HALFCOOLDOWN_REGEX = new RegExp(`if\\((.{20,30}) == (${localObject}\\.[\\w$]{3}\\(${modeIndices.ar}\\))(.{60,200}=750;;})`);
  //let halfcooldownMatch = newSrc.match(HALFCOOLDOWN_REGEX);
  //currentMode = halfcooldownMatch[1];
  //let arrowsMode = halfcooldownMatch[2];
   // add var to createNewState check
  //newSrc = newSrc.replace(halfcooldownMatch[0], `if(${currentMode} == ${arrowsMode} || ${currentMode} == "${modeName}"${halfcooldownMatch[3]}`);

  // locate fixedRotation initialisation
  const BODYROTATION_REGEX = /if\((\w{3}\[\d{1,3}\]\[\d{1,3}\]\[\w{3}\[\d{1,3}\]\[\d{1,4}\]\]) == "v"\){(.{15,30}=false;)/;
  let bodyrotationMatch = newSrc.match(BODYROTATION_REGEX);
  currentMode = bodyrotationMatch[1];
  // add var to fixedRotation check
  newSrc = newSrc.replace(bodyrotationMatch[0], `if(${currentMode} == "v" || ${currentMode} == "${modeName}"){${bodyrotationMatch[2]}`);

  // locate vtolwing physics initialisation
  const VTOLPHYSICS_REGEX = new RegExp(`if\\(${escReg(currentMode)} == "v"\\){([\\w$]{3}\\[\\d{1,4}\\]=new)`);
  let vtolphysicsMatch = newSrc.match(VTOLPHYSICS_REGEX);
  // add var to vtolwing check
  newSrc = newSrc.replace(vtolphysicsMatch[0], `if(${currentMode} == "v" || ${currentMode} == "${modeName}"){${vtolphysicsMatch[1]}`);

   // locate fireArrow call
  //const FIREARROW_REGEX = new RegExp(`{${createArrowFunc}\\((.{5,10},.{20,40}),(.{10,20})(\\[[\\w$]{3}\\[\\d{1,3}\\]\\[\\d{1,4}\\]\\])( \\* .{10,40})\\);`);
  //let firearrowMatch = newSrc.match(FIREARROW_REGEX);
  //let player = firearrowMatch[2];
  //let premoddedDir = firearrowMatch[3];
   // calculate player angle from rotation matrix and add to the arrow's angle
  //let direction = `(${player}${premoddedDir} + (-Math.round(SafeTrig.safeATan2(${player}.body.m_xf.R.col2.x, ${player}.body.m_xf.R.col1.x) * (180/Math.PI))))${firearrowMatch[4]}`;
   // add new maths to fireArrow call
  //newSrc = newSrc.replace(firearrowMatch[0], `{${createArrowFunc}(${firearrowMatch[1]},${direction});`);

  const VARTOL_PARTICLES = `if (arguments[3].mo == "${modeName}") {
    for (let currDisc = 0; currDisc < arguments[1].discs.length; currDisc++) {
      if (arguments[0].discs[currDisc] && arguments[1].discs[currDisc] && this.discGraphics[currDisc] && arguments[4] && arguments[4][currDisc]) {
        let particleSize = 2.5 * this.discGraphics[currDisc].radius / arguments[1].physics.ppm;
        let percentAlongJetpack = 0.85;
        let xOffset = -this.discGraphics[currDisc].radius * (${gameObject}.footOffsetX + -${gameObject}.footHW) * percentAlongJetpack;

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
          particle.beginFill(0xffffd9);
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

  // add particles to renderer
  newSrc = newSrc.replace(`this.particleManager.render`, `${VARTOL_PARTICLES} this.particleManager.render`);

  if(src === newSrc) throw "Injection failed!";
  console.log(injectorName+" injector run");
  return newSrc;
}

// Compatibility with Excigma's code injector userscript
if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	} catch (error) {
		alert(errorMsg);
		throw error;
	}
});

console.log(injectorName+" injector loaded");