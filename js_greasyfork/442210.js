// ==UserScript==
// @name         bonk-grapple
// @version      1.0.1
// @author       Blu
// @description  A userscript to add the OG Grapple back to bonk.io
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/826975
// @downloadURL https://update.greasyfork.org/scripts/442210/bonk-grapple.user.js
// @updateURL https://update.greasyfork.org/scripts/442210/bonk-grapple.meta.js
// ==/UserScript==
 
// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io
 
const injectorName = `OG Grapple`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

// $$ in replacement string is treated as $
function replace(src, qry, rpl){
  rpl = rpl.replaceAll('$', '$$$');
  return src.replace(qry, rpl);
}

// escape special regex characters for RegExp obj
function escReg(reg){
  return reg.replace(/([[\]])/g, "\\$1");
}

function injector(src){
  let newSrc = src;
  const modeName = "s";
  
  // locate beginning of requirejs function
  const REQUIREJS_REGEX = /"use strict";var ([\w$]+)=([\w$]+);.{0,20}var ([\w$]+)=\[arguments\];/;
  let requirejsMatch = newSrc.match(REQUIREJS_REGEX);
  let localObject = requirejsMatch[1];
  let globalObject = requirejsMatch[2];
  let argumentsObject = requirejsMatch[3];
  
  let gameSettings = newSrc.match(/gameSettings:(.{5,20}),/)[1];
  let inputState = newSrc.match(/inputState:([\w$]{2,4}\[0\]\[0\])/)[1];
  let discs = newSrc.match(/discs:(.{5,20}),/)[1];
  let currentIndex = newSrc.match(new RegExp(`\\(${escReg(discs)}\\[([\\w$]{3}\\[\\d{1,4}\\])\\].{5,20} == 1000\\)`))[1];
  let vector = `${argumentsObject}[0][2].Common.Math.b2Vec2`;
  let world = newSrc.match(/if\((.{1,10})\[[^0-9].{10,30}!= 20/)[1];
  
  let swingCooldown = newSrc.match(new RegExp(`\\((${escReg(gameSettings)}\\[[\\w$]{2,4}\\[[0-9]{1,4}\\]\\[[0-9]{1,4}\\]\\] == "sp")\\)`));
  // add s to swing cooldown code
  newSrc = replace(newSrc, `${swingCooldown[0]}`, `(${gameSettings}.mo == "${modeName}" || ${swingCooldown[1]})`);
  
  let bMovement = newSrc.match(new RegExp(`${escReg(gameSettings)}\\[[\\w$]{2,4}\\[[0-9]{1,4}\\]\\[[0-9]{1,4}\\]\\] == "sp" \\|\\|`));
  // add s to ga b movement code
  newSrc = replace(newSrc, `${bMovement}`, `${bMovement} ${gameSettings}.mo == "${modeName}" ||`);
  
  let doGrappleCheck = newSrc.match(/\(this.{1,50}? == "sp"/)[0];
  // add s to doGrapple rendering
  newSrc = replace(newSrc, doGrappleCheck, `${doGrappleCheck} || this.gameSettings.mo == "${modeName}"`);
  
  let perpendicularMatches = newSrc.match(/\{this.{10,50}?\(2,0xcccccc,0\.5\).{1,20}?this.{10,30}\(0,0,.{1,15}?([\w$]{3}\[[0-9]{1,3}\]).{0,5}\)\);/);
  let radius = perpendicularMatches[1];
  // render perpendicular line
  newSrc = replace(newSrc, perpendicularMatches[0], `${perpendicularMatches[0]}
  if(this.gameSettings.mo == "s"){
    let disc = ${radius.split('[')[0]}[0][0].discs[this.playerID];
    let dv = new ${vector}(disc.xv, disc.yv);
    dv.Normalize();
    this.specialGraphic.lineStyle(2 * this.scaleRatio, 0xFFFFFF, 0.7);
    // left
    this.specialGraphic.moveTo(10*${radius}*dv.y, -10*${radius}*dv.x);
    // right
    this.specialGraphic.lineTo(-10*${radius}*dv.y, 10*${radius}*dv.x);
  }`);
  
  let addGrapplePointFunction = newSrc.match(/function ([\w$]{2})\([\w$]{3},[\w$]{3},[\w$]{3},[\w$]{3}\)/)[1];
  const CUSTOM_GAME = `if (${gameSettings}.mo == "${modeName}" && !${inputState}.discs[${currentIndex}].swing && ${inputState.replace(`][0]`, `][1]`)}[${currentIndex}].action2 && ${discs}[${currentIndex}].a1a > 500) {
    let maxGrappleLength = 10;
    let disc = ${inputState}.discs[${currentIndex}];
    let playerCoords = new ${vector}(disc.x, disc.y);
    let playerDir = new ${vector}(disc.xv, disc.yv);
    playerDir.Normalize();
    
    // collect possible fixtures
    let leftRay = new ${vector}(playerCoords.x + playerDir.y*maxGrappleLength, playerCoords.y + -playerDir.x*maxGrappleLength);
    let rightRay = new ${vector}(playerCoords.x + -playerDir.y*maxGrappleLength, playerCoords.y + playerDir.x*maxGrappleLength);
    let possibleFixtures = [];
    // args: fixture, worldPoint, dir, distance
    let onRayCast = (...args) => {
      let f = args[0];
      if (f.GetBody().GetUserData().type == "phys" && !f.GetUserData().capzone && !f.GetUserData().noGrapple)
        possibleFixtures.push(args);
      return true;
    }
    ${world}.RayCast(onRayCast, playerCoords, leftRay);
    ${world}.RayCast(onRayCast, playerCoords, rightRay);
    
    // account for RayCast not firing when inside a shape
    let onInnerRayCast = (...args) => {
      let f = args[0];
      // invert distance to compensate for opposite origin
      args[3] = 1 - args[3];
      if (f.GetBody().GetUserData().type == "phys" && !f.GetUserData().capzone && !f.GetUserData().noGrapple)
        possibleFixtures.push(args);
      return true;
    }
    ${world}.RayCast(onInnerRayCast, rightRay, playerCoords);
    ${world}.RayCast(onInnerRayCast, leftRay, playerCoords);
    
    
    // for each fixture find a possible point
    let possiblePoints = [];
    for(let fixture = 0; fixture < possibleFixtures.length; fixture++){
      let currFixture = possibleFixtures[fixture][0];
      let currBody = currFixture.GetBody();
      let worldPoint = possibleFixtures[fixture][1];
      let distance = possibleFixtures[fixture][3] * maxGrappleLength;
      possiblePoints.push({b: currBody, f: currFixture, wp: worldPoint, d: distance});
    }
    
    // grapple to closest possible point
    possiblePoints.sort((a, b) => a.d-b.d);
    for (let p = 0; p < possiblePoints.length; p++) {
      let currPoint = possiblePoints[p];
      if (currPoint.f.TestPoint(playerCoords) == false || currPoint.f.GetUserData().innerGrapple) {
        let localPoint = currPoint.b.GetLocalPoint(currPoint.wp, new ${vector});
        ${addGrapplePointFunction}(${currentIndex}, currPoint.b.GetUserData().arrayID, localPoint, currPoint.d);
        break;
      }
    }
  }`;
  
  // locate createArrow function
  const CREATEARROW_REGEX = /function [\w$]{2}\([\w$]{3},[\w$]{3},[\w$]{3}\){.{200,1000}x:.*?;}{1,2}/g;
  let createarrowMatch = newSrc.match(CREATEARROW_REGEX).filter(x=>!x.includes('return'))[0];
  // add the custom movement code in same scope
  newSrc = replace(newSrc, createarrowMatch, `${createarrowMatch} ${CUSTOM_GAME}`);
  
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
  // add mode to mode selection button, before Football
  newSrc = replace(newSrc, modearrayMatch[0], `=[${modearrayMatch[1]},"${modeName}",${modearrayMatch[2]}]`);
  
  // locate Football mode metadata initialisation
  const FOOTBALLDATA_REGEX = new RegExp(`${argumentsObject}\\[(\\d{1,3})\\]\\[${argumentsObject}.{5,10}\\]\\[.{5,10}${modeIndices.f}\\)]={lobbyName:${localObject}\\.[\\w$]{1,3}\\(.*?,editorCanTarget:false}`);
  let footballdataMatch = newSrc.match(FOOTBALLDATA_REGEX);
  let metadataIndex = footballdataMatch[1];
  const CUSTOM_METADATA = `{lobbyName: "OG Grapple", gameStartName: "OG GRAPPLE", lobbyDescription: "Hold your special key (default z or y) to swing around the map. If an enemy hits you while you are grappling your grapple will be disabled for a few seconds.", tutorialTitle: "OG Grapple Mode", tutorialText: "•Z key to grapple\\r\\n•Grapples nearest object perpendicular to your direction\\r\\n•Hit enemies while they're grappling to knock them off", forceTeams: false, forceTeamCount: null, editorCanTarget: false}`;
  let customData = `${argumentsObject}[${metadataIndex}].modes.${modeName} = ${CUSTOM_METADATA};`;
  // add custom mode metadata
  newSrc = replace(newSrc, footballdataMatch[0], `${footballdataMatch[0]}; ${customData}`);
  
  // locate cooldown outline initialisation
  const OUTLINEGRAPHIC_REGEX = new RegExp(`this\\[.{20,30}\\] == ${localObject}\\.[\\w$]{3}\\(${modeIndices.sp}\\)`);
  let outlineGraphicMatch = newSrc.match(OUTLINEGRAPHIC_REGEX)[0];
  // add s to cooldown outline
  newSrc = replace(newSrc, outlineGraphicMatch, `${outlineGraphicMatch} || this.gameSettings.mo == "${modeName}"`);
 
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