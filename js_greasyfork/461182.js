// ==UserScript==
// @name         AWBW Power Banners
// @namespace    https://awbw.amarriner.com/
// @version      1.03
// @description  Fires up a banner whenever a player has COP/SCOP ready
// @author       twiggy_
// @match        https://awbw.amarriner.com/*?games_id=*
// @match        https://awbw.amarriner.com/*?replays_id=*
// @icon         https://awbw.amarriner.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461182/AWBW%20Power%20Banners.user.js
// @updateURL https://update.greasyfork.org/scripts/461182/AWBW%20Power%20Banners.meta.js
// ==/UserScript==

// Vars
let allPlayers = Object.keys(playersInfo);
let playerObjs = {};
let playerContainers = [];
let ahFire = null;
let ahPower = null;
let ahExplode = null;
let exitTimeout = null;
let redStarSrc = "terrain/aw2/redstar.gif";
let blueStarSrc = "terrain/aw2/bluestar.gif";
let powerQueue = [];
const SHOWTIME = 6000;

// HTML
let customEventScreenContainer = document.createElement('div');
customEventScreenContainer.classList.add('custom-event-screen-container');
customEventScreenContainer.addEventListener("click", exitEventScreen);

let customEventScreen = document.createElement('div');
customEventScreen.classList.add('custom-event-screen');

let customEventScreenContent = document.createElement('div');
customEventScreenContent.classList.add('custom-event-screen-content');

let customEventScreenProfile = document.createElement('img');
customEventScreenProfile.classList.add('custom-event-screen-profile');
customEventScreenProfile.src = null;

let customEventScreenProfileStar = document.createElement('img');
customEventScreenProfileStar.classList.add('custom-event-screen-profile-star');
customEventScreenProfileStar.src = redStarSrc;

let customEventScreenTextDiv = document.createElement('div');
customEventScreenTextDiv.classList.add('custom-event-screen-text-div');

let customEventScreenProfileHeader = document.createElement('span');
customEventScreenProfileHeader.classList.add('custom-event-screen-header');
customEventScreenProfileHeader.innerHTML = "SUPER POWER";

let customEventScreenProfileReady = document.createElement('span');
customEventScreenProfileReady.classList.add('custom-event-screen-ready');
customEventScreenProfileReady.innerHTML = "READY";

let powerLine1 = document.createElement('div');
powerLine1.id = 'powerLine1';

let powerLine2 = document.createElement('div');
powerLine2.id = 'powerLine2';

let powerLine3 = document.createElement('div');
powerLine3.id = 'powerLine3';

let powerLine4 = document.createElement('div');
powerLine4.id = 'powerLine4';

let powerLine5 = document.createElement('div');
powerLine4.id = 'powerLine5';

document.getElementById('gamemap-container').appendChild(customEventScreenContainer);
customEventScreenContainer.appendChild(customEventScreen);
customEventScreen.appendChild(customEventScreenContent);
customEventScreenContent.appendChild(customEventScreenProfile);
customEventScreenContent.appendChild(customEventScreenProfileStar)
customEventScreenContent.appendChild(customEventScreenTextDiv);
customEventScreenTextDiv.appendChild(customEventScreenProfileHeader);
customEventScreenTextDiv.appendChild(customEventScreenProfileReady);

customEventScreenContent.appendChild(powerLine1);
customEventScreenContent.appendChild(powerLine2);
customEventScreenContent.appendChild(powerLine3);
customEventScreenContent.appendChild(powerLine4);
customEventScreenContent.appendChild(powerLine5);

// Event screen handler functions
function queueEventProfile(id, type)
{
  queueItem = {};
  queueItem.id = id;
  queueItem.type = type;

  powerQueue.push(queueItem);
}

function buildEventProfile(id, type)
{
  customEventScreenProfile.src = playerObjs[id]["coImg"];
  customEventScreenContent.style.background = playerObjs[id]["countryGradient"];
  customEventScreen.style.borderColor = playerObjs[id]["countryColor"];
  customEventScreenProfileHeader.style.textShadow = 'text-shadow: 1px 1px 2px ' + playerObjs[id]["countryColor"] + ";";
  customEventScreenProfileReady.style.textShadow = 'text-shadow: 1px 1px 2px ' + playerObjs[id]["countryColor"] + ";";

  switch (type)
  {
    case "cop":
      playerObjs[id]["hasSeenCOPStatusScreen"] = true;
      customEventScreenProfileHeader.innerHTML = "POWER";
      customEventScreenProfileStar.src = redStarSrc;
      togglePowerLines(false);
      break;
    case "scop":
      playerObjs[id]["hasSeenSCOPStatusScreen"] = true;
      customEventScreenProfileHeader.innerHTML = "SUPER POWER";
      customEventScreenProfileStar.src = blueStarSrc;
      togglePowerLines(true);
      break;
  }
}

function enterEventScreen()
{
  let poppedItem = powerQueue.pop();

  buildEventProfile(poppedItem.id, poppedItem.type);

  customEventScreenContainer.style.display = "block";

  customEventScreen.classList.remove('pop-out');
  customEventScreen.classList.add('pop-in');

  exitTimeout = setTimeout(() => { exitEventScreen(); }, SHOWTIME);

}

function exitEventScreen()
{
  clearTimeout(exitTimeout);

  customEventScreen.classList.remove('pop-in');
  customEventScreen.classList.add('pop-out');

  setTimeout(() => { customEventScreenContainer.style.display = "none"; }, 400);

  if (powerQueue.length > 0)
  {
    setTimeout(() => { enterEventScreen(); }, 500);
  }
}

function buildPlayerObjs()
{
  allPlayers.forEach(function(id)
  {
    playerObjs[id] = {};

    let playerContainerString = 'player' + String(id);
    let container = document.getElementById(playerContainerString);

    playerObjs[id]["container"] = container;

    let copStatus = container.getElementsByClassName('cop-star power-star anim-power-bar').length > 0;
    let scopStatus = container.getElementsByClassName('scop-star power-star anim-power-bar').length > 0;

    playerObjs[id]["copStatus"] = copStatus;
    playerObjs[id]["scopStatus"] = scopStatus;

    // loadSettings(id);

    let countryGradient = container.getElementsByTagName("header");
    playerObjs[id]["countryGradient"] = countryGradient[0].style.background;
    let s = countryGradient[0].style.background.split("rgb")[2];
    playerObjs[id]["countryColor"] = "rgb" + s.substring(0, s.length - 1);

    let coImgSrc = container.getElementsByClassName('player-co')[0].firstElementChild.src;
    playerObjs[id]["coImg"] = coImgSrc;

    // console.log(playerObjs);
  });
}

function updatePlayerObjs()
{
  allPlayers.forEach(function(id)
  {
    let copStatus = playerObjs[id]["container"].getElementsByClassName('cop-star power-star anim-power-bar').length > 0;
    let scopStatus = playerObjs[id]["container"].getElementsByClassName('scop-star power-star anim-power-bar').length > 0;

    let copSeen = playerObjs[id]["hasSeenCOPStatusScreen"];
    let scopSeen = playerObjs[id]["hasSeenSCOPStatusScreen"];

    if (copStatus && scopStatus && !scopSeen) { queueEventProfile(id, "scop"); };
    if (copStatus && !scopStatus && !copSeen) { queueEventProfile(id, "cop"); };

    playerObjs[id]["copStatus"] = copStatus;
    playerObjs[id]["scopStatus"] = scopStatus;
  });

  if (powerQueue.length > 0) { enterEventScreen(); }
}

ahFire = actionHandlers.Fire;
actionHandlers.Fire = function()
{
  ahFire.apply(actionHandlers.Fire, arguments);

  setTimeout(()=>{ updatePlayerObjs(); }, 500);
}

ahExplode = actionHandlers.Explode;
actionHandlers.Explode = function()
{
  ahExplode.apply(actionHandlers.Explode, arguments);

  setTimeout(()=>{ updatePlayerObjs(); }, 500);
}

ahPower = actionHandlers.Power;
actionHandlers.Power = function()
{
  ahPower.apply(actionHandlers.Power, arguments);

  switch(arguments[0].coPower)
  {
    case "Y":
      playerObjs[String(arguments[0].playerId)]["hasSeenCOPStatusScreen"] = false;
      break;
    case "S":
      playerObjs[String(arguments[0].playerId)]["hasSeenCOPStatusScreen"] = false;
      playerObjs[String(arguments[0].playerId)]["hasSeenSCOPStatusScreen"] = false;
      break;
  }

  exitEventScreen();
}

function togglePowerLines(bool)
{
  if (bool)
  {
    powerLine1.style.display = 'block';
    powerLine2.style.display = 'block';
    powerLine3.style.display = 'block';
    powerLine4.style.display = 'block';
    powerLine5.style.display = 'block';
  }
  else
  {
    powerLine1.style.display = 'none';
    powerLine2.style.display = 'none';
    powerLine3.style.display = 'none';
    powerLine4.style.display = 'none';
    powerLine5.style.display = 'none';
  }
}

// Custom styling
var styles = `
  .pop-in {
    animation-duration: 0.5s;
    animation-name: pop-in;
    animation-timing-function: cubic-bezier(.26, .53, .74, 1.48);
    animation-fill-mode: forwards;
  }

  .pop-out {
    animation-duration: 0.5s;
    animation-name: pop-out;
    animation-timing-function: cubic-bezier(.26, .53, .74, 1.48);
    animation-fill-mode: forwards;
  }

  @keyframes pop-in {
    0% {
      opacity: 0;
      -webkit-transform: scale(0.5, 0.5);
    }

    100% {
      opacity: 1;
      -webkit-transform: scale(1, 1);
    }
  }

  @keyframes pop-out {
    0% {
      opacity: 1;
      -webkit-transform: scale(1, 1);
    }

    100% {
      opacity: 0;
      -webkit-transform: scale(0.5, 0.5);
    }
  }

  .custom-event-screen-header {
    font-size: 15px;
    letter-spacing: -1px;
    color: white;
  }

  .custom-event-screen-ready {
    font-size: 35px;
    letter-spacing: -2px;
    color: white;
  }

  .custom-event-screen-text-div {
    display: flex;
    flex-direction: column;
    height: 55px;
    width: 125px;
    margin-left: 5px;
  }

  .custom-event-screen-profile {
    width: 55px;
    height: 55px;
    margin-left: 5px;
    z-index: 1;
  }

  .custom-event-screen-profile-star {
    position: absolute;
    left: 50px;
    bottom: 2.5px;
    z-index: 2;
    width: 22px;
    height: 22px;
  }

  .custom-event-screen-content {
    align-items: center;
    border-style: solid;
    border-width: 4px 2px;
    border-color: white;
    display: flex;
    flex-direction: row;
    justify-content: left;
    padding: 2px 0;
    width: 100%;
    z-index: 2;
  }

  .custom-event-screen-container {
    font-size: 14px;
    left: 50%;
    position: absolute;
    top: 40%;
    transform: translateX(-50%);
    display: none;
  }

  .custom-event-screen {
    background: rgba(255, 255, 255, 0.9);
    border-width: 1px;
    border-color: black;
    border-style: solid;
    display: flex;
    height: 70px;
    justify-content: center;
    overflow: hidden;
    padding: 1px;
    position: relative;
    width: 200px;
    opacity: 0;
    cursor: pointer;
  }

  #powerLine1 {
		position: absolute;
		left: 0px;
    top: 12px;
		height: 3px;
		background: white;
		animation: powerLine 1.75s 1.75s infinite ease;
    animation-delay: 0ms;
	}

  #powerLine2 {
		position: absolute;
		left: 0px;
    top: 22px;
		height: 3px;
		background: white;
		animation: powerLine 2.5s 1.25s infinite ease;
    animation-delay: 250ms;
	}

  #powerLine3 {
		position: absolute;
		left: 0px;
    top: 39px;
		height: 3px;
		background: white;
		animation: powerLine 1s 1.5s infinite ease;
    animation-delay: 100ms;
	}

  #powerLine4 {
		position: absolute;
		left: 0px;
    top: 48px;
		height: 3px;
		background: white;
		animation: powerLine 2s 1.25s infinite ease;
    animation-delay: 400ms;
	}

  #powerLine5 {
		position: absolute;
		left: 0px;
    top: 58px;
		height: 3px;
		background: white;
		animation: powerLine 1.5s 2s infinite ease;
    animation-delay: 100ms;
	}

  @keyframes powerLine {
		0% {
			width: 0%;
		}
		100% {
      width: 100%;opacity: 0;
    }
  }

    .shine {
    	position: relative;
    	overflow: hidden;

    	&::before {
    		background: linear-gradient(
    			to right,
    			fade_out(#fff, 1) 0%,
    			fade_out(#fff, 0.7) 100%
    		);
    		content: "";
    		display: block;
    		height: 100%;
    		left: -75%;
    		position: absolute;
    		top: 0;
    		transform: skewX(-25deg);
    		width: 50%;
    		z-index: 2;
    		animation: shine 1.5s infinite;
    	}

    	@keyframes shine {
    		100% {
    			left: 125%;
    		}
    	}
    }
`;

var powerStyleSheet = document.createElement("style");
powerStyleSheet.innerText = styles;
document.head.appendChild(powerStyleSheet);

buildPlayerObjs();
updatePlayerObjs();