// ==UserScript==
// @name         Dino Chrome Hacks Menu 30+ Commands
// @namespace    http://tampermonkey.net/
// @version      2.111111111111111111111111111111111111111111111111111111111111115
// @homepage     https://greasyfork.org/scripts/453925
// @description  hi
// @author       Shortboi
// @match        chrome://dino
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/453925/Dino%20Chrome%20Hacks%20Menu%2030%2B%20Commands.user.js
// @updateURL https://update.greasyfork.org/scripts/453925/Dino%20Chrome%20Hacks%20Menu%2030%2B%20Commands.meta.js
// ==/UserScript==

var smilelogo = `\u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2557\u2591\u2591\u2591\u2588\u2588\u2588\u2557  \u2588\u2588\u2557  \u2588\u2588\u2557\u2591\u2591\u2591\u2591\u2591  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557
\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d  \u2588\u2588\u2588\u2588\u2557\u2591\u2588\u2588\u2588\u2588\u2551  \u2588\u2588\u2551  \u2588\u2588\u2551\u2591\u2591\u2591\u2591\u2591  \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d
\u255a\u2588\u2588\u2588\u2588\u2588\u2557  \u2591\u2588\u2588\u2554\u2588\u2588\u2588\u2588\u2554\u2588\u2588\u2551  \u2588\u2588\u2551  \u2588\u2588\u2551\u2591\u2591\u2591\u2591\u2591  \u2588\u2588\u2588\u2588\u2588\u2557\u2591\u2591
\u2591\u255a\u2550\u2550\u2550\u2588\u2588\u2557  \u2588\u2588\u2551\u255a\u2588\u2588\u2554\u255d\u2588\u2588\u2551  \u2588\u2588\u2551  \u2588\u2588\u2551\u2591\u2591\u2591\u2591\u2591  \u2588\u2588\u2554\u2550\u2550\u255d\u2591\u2591
\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d  \u2588\u2588\u2551\u2591\u255a\u2550\u255d\u2591\u2588\u2588\u2551  \u2588\u2588\u2551  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557
\u255a\u2550\u2550\u2550\u2550\u2550\u255d  \u2591\u255a\u2550\u255d\u2591\u2591\u2591\u2591\u2591\u255a\u2550\u255d  \u255a\u2550\u255d  \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d  \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d
`
alert('COMMANDS:s, c, g, gmax, score, 999999, stuck, scorelag, dead, accelerate1, accelerate0.1, help, extra, info1, info2, info3, info4, info5, info6, info7, info8, info9, accelerinfo, acceler1info, allcmds, length30, infoheight, clear, sussy?, nyan, mach874030.49, hidden, weavethesmallcacti, hacks, c00lkidd, hacks = true')

var passwrong = 'WRONG'
const  myCustomFunction = i => console.error(passwrong);
let iteration = 0;
const delay = 10;
const tillCount = 1000;


nyan = new Audio('https://vincens2005.github.io/vr/Nyan%20Cat%20[original].mp3');
if (typeof nyan.loop == 'boolean') {
  nyan.loop = true;
}
else {
  nyan.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);
}

function keys() {

  let input = prompt(smilelogo);
  switch (input) {
    case 's': speediskey()
      break;
    case 'c': noCollision()
      break;
    case 'g': Gravity50()
      break;
    case 'gmax': Gravitymax()
      break;
    case 'score': setScore()
      break;
    case '999999': setScoremax()
      break;
    case 'stuck': noMovement()
      break;
    case 'scorelag': setScoremalf()
      break;
    case 'dead': Gameover()
      break;
    case 'mach874030.49': Mach()
      break;
    case 'accelerate0.1': Speedfrac110()
      break;
    case 'accelerate1': Speed1()
      break;
    case 'hidden': INVIS()
      break;
    case 'help': HELP()
      break;
    case 'extra': INFO()
      break;
    case 'info1': speediskeyINFO()
      break;
    case 'info2': noCLIPinfo()
      break;
    case 'info3': GravINFO()
      break;
    case 'info4': GravmaxINFO()
      break;
    case 'info5': ScoreINFO()
      break;
    case 'info6': ScoremaxINFO()
      break;
    case 'info8': LAGINFO()
      break;
    case 'accelerinfo': ACCELERINFO()
      break;
    case 'acceler1info': ACCELER1INFO()
      break;
    case 'allcmds': CMDINFO()
      break;
    case 'info7': stuckINFO()
      break;
    case 'clear': CLEARCMDS()
      break;
    case 'length30': AREA()
      break;
    case 'infoheight': AREAINFO()
      break;
    case 'weavethesmallcacti': AREAsmol()
      break;
    case 'hacks': HACKS()
      break;
    case 'c00lkidd': robloxhackerlol()
      break;
    case 'hacks = true': HACKSenabled()
      break;
    case 'sussy?': SUSSYBAKA()
      break;
    case 'nyan': nyancat()
      break;
    case 'boywhatthehellboy': boywhatthehellboy()
      break;
    default:setTimeout(1750); 
  }
}

function password() {

  let input = prompt('');
  switch (input) {
    case 'stto': stto()
      break;
    default:
   if (setInterval(() => {
    if (iteration < tillCount) {
      iteration ++;
      myCustomFunction(iteration);
    }
}, delay))  {
    }
  }
}


function infocmdkeys() {
  prompt(`
Type "allcmds" for all commands
`);

  let input = prompt(smilelogo);
  switch (input) {
    case 's': speediskey()
      break;
    case 'c': noCollision()
      break;
    case 'g': Gravity50()
      break;
    case 'gmax': Gravitymax()
      break;
    case 'score': setScore()
      break;
    case '999999': setScoremax()
      break;
    case 'stuck': noMovement()
      break;
    case 'scorelag': setScoremalf()
      break;
    case 'dead': Gameover()
      break;
    case 'mach874030.49': Mach()
      break;
    case 'accelerate0.1': Speedfrac110()
      break;
    case 'accelerate1': Speed1()
      break;
    case 'hidden': INVIS()
      break;
    case 'help': HELP()
      break;
    case 'extra': INFO()
      break;
    case 'info1': speediskeyINFO()
      break;
    case 'info2': noCLIPinfo()
      break;
    case 'info3': GravINFO()
      break;
    case 'info4': GravmaxINFO()
      break;
    case 'info5': ScoreINFO()
      break;
    case 'info6': ScoremaxINFO()
      break;
    case 'info8': LAGINFO()
      break;
    case 'accelerinfo': ACCELERINFO()
      break;
    case 'acceler1info': ACCELER1INFO()
      break;
    case 'allcmds': CMDINFO()
      break;
    case 'info7': stuckINFO()
      break;
    case 'clear': CLEARCMDS()
      break;
    case 'length30': AREA()
      break;
    case 'infoheight': AREAINFO()
      break;
    case 'weavethesmallcacti': AREAsmol()
      break;
    case 'hacks': HACKS()
      break;
    case 'c00lkidd': robloxhackerlol()
      break;
    case 'hacks = true': HACKSenabled()
      break;
    case 'sussy?': SUSSYBAKA()
      break;
    case 'nyan': nyancat()
      break;
    case 'boywhatthehellboy': boywhatthehellboy()
      break;
    default:setTimeout(1750);
  }
}

function helpcmdkeys() {
  prompt(`
Type "extra" for commands
`);

  let input = prompt(smilelogo);
  switch (input) {
    case 's': speediskey()
      break;
    case 'c': noCollision()
      break;
    case 'g': Gravity50()
      break;
    case 'gmax': Gravitymax()
      break;
    case 'score': setScore()
      break;
    case '999999': setScoremax()
      break;
    case 'stuck': noMovement()
      break;
    case 'scorelag': setScoremalf()
      break;
    case 'dead': Gameover()
      break;
    case 'mach874030.49': Mach()
      break;
    case 'accelerate0.1': Speedfrac110()
      break;
    case 'accelerate1': Speed1()
      break;
    case 'hidden': INVIS()
      break;
    case 'help': HELP()
      break;
    case 'extra': INFO()
      break;
    case 'info1': speediskeyINFO()
      break;
    case 'info2': noCLIPinfo()
      break;
    case 'info3': GravINFO()
      break;
    case 'info4': GravmaxINFO()
      break;
    case 'info5': ScoreINFO()
      break;
    case 'info6': ScoremaxINFO()
      break;
    case 'info8': LAGINFO()
      break;
    case 'accelerinfo': ACCELERINFO()
      break;
    case 'acceler1info': ACCELER1INFO()
      break;
    case 'allcmds': CMDINFO()
      break;
    case 'info7': stuckINFO()
      break;
    case 'clear': CLEARCMDS()
      break;
    case 'length30': AREA()
      break;
    case 'infoheight': AREAINFO()
      break;
    case 'weavethesmallcacti': AREAsmol()
      break;
    case 'hacks': HACKS()
      break;
    case 'c00lkidd': robloxhackerlol()
      break;
    case 'hacks = true': HACKSenabled()
      break;
    case 'sussy?': SUSSYBAKA()
      break;
    case 'nyan': nyancat()
      break;
    case 'boywhatthehellboy': boywhatthehellboy()
      break;
    default:setTimeout(1750);
  }
}

function main() {
  console.clear();
  console.log(`
Type "help" for commands
`);

  let input = prompt(smilelogo);
  switch (input) {
    case 's': speediskey()
      break;
    case 'c': noCollision()
      break;
    case 'g': Gravity50()
      break;
    case 'gmax': Gravitymax()
      break;
    case 'score': setScore()
      break;
    case '999999': setScoremax()
      break;
    case 'stuck': noMovement()
      break;
    case 'scorelag': setScoremalf()
      break;
    case 'dead': Gameover()
      break;
    case 'mach874030.49': Mach()
      break;
    case 'accelerate0.1': Speedfrac110()
      break;
    case 'accelerate1': Speed1()
      break;
    case 'hidden': INVIS()
      break;
    case 'help': HELP()
      break;
    case 'extra': INFO()
      break;
    case 'info1': speediskeyINFO()
      break;
    case 'info2': noCLIPinfo()
      break;
    case 'info3': GravINFO()
      break;
    case 'info4': GravmaxINFO()
      break;
    case 'info5': ScoreINFO()
      break;
    case 'info6': ScoremaxINFO()
      break;
    case 'info8': LAGINFO()
      break;
    case 'accelerinfo': ACCELERINFO()
      break;
    case 'acceler1info': ACCELER1INFO()
      break;
    case 'allcmds': CMDINFO()
      break;
    case 'info7': stuckINFO()
      break;
    case 'clear': CLEARCMDS()
      break;
    case 'length30': AREA()
      break;
    case 'infoheight': AREAINFO()
      break;
    case 'weavethesmallcacti': AREAsmol()
      break;
    case 'hacks': HACKS()
      break;
    case 'c00lkidd': robloxhackerlol()
      break;
    case 'hacks = true': HACKSenabled()
      break;
    case 'clearcmds': CLEARCMDS()
      break;
    case 'sussy?': SUSSYBAKA()
      break;
    case 'nyan': nyancat()
      break;
    case 'boywhatthehellboy': boywhatthehellboy()
      break;
    default:setTimeout(1750);
  }
}

main();

function speediskey() {
  Runner.instance_.setSpeed(100)
  alert("a lot of speed enabled, press ok to go to main menu");
  main();
}

function noCollision() {
  Runner.instance_.gameOver = function() { };
  alert("no collision enabled, press ok to go to main menu");
  main();
}

function Gravity50() {
  Runner.instance_.tRex.config.GRAVITY = 0.1
  alert("Gravity 50 enabled, press ok to go to main menu");
  main();
}

function Gravitymax() {
  Runner.instance_.tRex.config.GRAVITY = 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001
  alert("Gravity Infinite, press ok to go to main menu");
  main();
}

function stto() {
  console.warn("ACCESS GRANTED")
  document.body.style.backgroundColor = "lime";
  Runner.instance_.gameOver = function() { };
  Runner.instance_.setSpeed(100)
  Runner.instance_.tRex.config.GRAVITY = 0.1
  alert("You join SMILE, welcome.")
  document.body.style.backgroundImage = "url('');"
}

function setScore() {
  Runner.instance_.distanceRan = 10000 / Runner.instance_.distanceMeter.config.COEFFICIENT
  alert("Score set to 10000, press ok to go to main menu");
  main();
}

function setScoremax() {
  Runner.instance_.distanceRan = 999950 / Runner.instance_.distanceMeter.config.COEFFICIENT
  alert("this might be buggy ngl");
  main();
}

function noMovement() {
  Runner.instance_.playingIntro = true
  alert("No Movement enabled, press ok to go to main menu");
  main();
}

function setScoremalf() {
  Runner.instance_.highestScore = 99999
  alert("Score Malfunction enabled, press ok to go to main menu");
  main();
}

function Gameover() {
  Runner.instance_.gameOver();
  console.warn("u ded")
}

function Mach() {
  Runner.instance_.config.ACCELERATION = 100000
  alert("Lightspeed enabled 😳, press ok to go to main menu");
  main();
}

function HELP() {
  alert("Commands: s, c, g, gmax, score, 999999, stuck, extra")
  helpcmdkeys();
}

function INFO() {
  alert("EXTRA: scorelag, dead, accelerate0.1, accelerate1")
  infocmdkeys();
}

function INVIS() {
  Runner.instance_.tRex.config.HEIGHT = 0
  alert("invisible mode enabled (it's not really invis, it's that you just are tiny), press ok to go to main menu");
  main();
}

function Speedfrac110() {
  Runner.instance_.config.ACCELERATION = 0.1
  alert("Accerlerate0.1 enabled, press ok to go to main menu");
  main();
}

function Speed1() {
  Runner.instance_.config.ACCELERATION = 1
  alert("Accerlerate1 enabled, press ok to go to main menu");
  main();
}

function speediskeyINFO() {
  alert("your speed will be set to 100");
  infocmdkeys();
}

function noCLIPinfo() {
  alert("you will enter god mode")
  keys();
}

function GravINFO() {
  alert("your gravity will be set to 50")
  keys();
}

function GravmaxINFO() {
  alert("your gravity will be set to 1e-560")
  keys();
}

function ScoreINFO() {
  alert("your score will be set to 10000")
  keys();
}

function ScoremaxINFO() {
  alert("your score will be 999999 when you die")
  keys();
}

function stuckINFO() {
  alert("you can't move")
  keys();
}

function LAGINFO() {
  alert("your high score wont change when you die")
  keys();
}

function CMDINFO() {
  alert(`
s c g gmax score 999999 stuck scorelag dead accelerate1 accelerate0.1 help extra info1 info2 info3 info4 info5 info6 info7 info8 info9 accelerinfo acceler1info allcmds length30 infoheight clearcmds
`)
  keys();
}

function ACCELERINFO() {
  alert("your acceleration will be set to 0.1, kinda useless but i'm trying to code more cmds so yeah")
  keys();
}

function ACCELER1INFO() {
  alert("your acceleration will be set to 1")
  keys();
}

function AREAINFO() {
  alert("your height will be set to 30")
  keys();
}

function AREA() {
  Runner.instance_.tRex.config.HEIGHT = 30
  alert("Your height is now equal to 30");
  main();
}

function AREAsmol() {
  Runner.instance_.tRex.config.HEIGHT = 13
  alert("u smol");
  main();
}

function HACKS() {
  console.error("bruh")
  alert("you goofy");
  keys();
}

function robloxhackerlol() {
  document.body.style.backgroundColor = "red";
  document.body.style.backgroundImage = "url('https://static.wikia.nocookie.net/terminated/images/a/ac/C00lkiddEarlyYears.png/revision/latest?cb=20211103073101')";
  Runner.instance_.setArcadeMode()
  Runner.instance_.tRex.config.WIDTH = 10000
  alert("roblo hakr 💀");
  keys();
}

function HACKSenabled() {
  password();
}

function CLEARCMDS() {
  location.reload()
  alert("the location.reload() don't work, do ctrl+r")
  main();
}

function SUSSYBAKA() {
  console.warn("SUSSY MODE ENABLED")
  document.body.style.backgroundImage = "url('https://earlygame.com/uploads/images/_article/imposter-card.jpg')";
  Runner.instance_.tRex.config.DROP_VELOCITY = 100
  Runner.instance_.tRex.config.INITIAL_JUMP_VELOCITY = -10000
  alert("You can vent, just press space.")
  main();
}

function nyancat() {
  console.log("nyan time!")
  document.body.style.backgroundImage = "url('https://i.kym-cdn.com/photos/images/original/000/128/096/Nyancatless20110725-22047-2vf3z5.gif')";
  Runner.instance_.tRex.config.DROP_VELOCITY = -10
  Runner.instance_.tRex.config.INITIAL_JUMP_VELOCITY = -10000
  nyan.play()
main();
}

function boywhatthehellboy() {
Runner.instance_.tRex.config.WIDTH = 10000
document.body.style.backgroundImage = "url('https://i.kym-cdn.com/entries/icons/original/000/037/774/coverbbbbb.jpg')";
keys();
}

let btn = document.createElement("button");
btn.innerHTML = "Main()";
btn.onclick = function () {
  main();
}
document.body.appendChild(btn);