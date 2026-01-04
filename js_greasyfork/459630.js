// ==UserScript==
// @name         AWBW Music Player
// @namespace    https://awbw.amarriner.com/
// @version      2.0.8
// @description  A comprehensive audio player that attempts to recreate the cart experience
// @author       twiggy_
// @match        https://awbw.amarriner.com/*?games_id=*
// @match        https://awbw.amarriner.com/*?replays_id=*
// @match        https://awbw.amarriner.com/*editmap*
// @icon         https://awbw.amarriner.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459630/AWBW%20Music%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/459630/AWBW%20Music%20Player.meta.js
// ==/UserScript==

const MY_VERSION = "2.0.8";
var NEWEST_VERSION = "FETCHING...";

let musicPlayerSettings = {}

let isMapEditor = window.location.href.indexOf("editmap.php?") > -1;

let neutralImgLink = 'https://macroland.one/img/music-player-icon.png';
let playingImgLink = 'https://macroland.one/img/music-player-playing.gif';

let myName = document.querySelector('#profile-menu').getElementsByClassName("dropdown-menu-link")[0].href.split("username=")[1];
let myID = -1;

let clicked = false;

let isPlaying = false;
let menuOpen = false;
let menuItemClick = false;

let randomThemeTimeout = null;

let volume = 0.5;
let sfxVolume = 0.35;
let uiVolume = 0.425;
let val;

let ahMove = null;
let ahWait = null;
let ahLoad = null;
let ahUnload = null;
let ahCapt = null;
let ahExplode = null;
let ahSupply = null;
let ahRepair = null;
let ahJoin = null;
let ahFog = null;
let ahCursorMove = null;
let ahOpenMenu = null;
let ahCloseMenu = null;
let ahUnitClick = null;

let scopBHDelay = 2500;
let scopDelay = 1550;

let movementSFX = null;
let movingUnit = null;
let activeUnitSFX = {};

let currentTheme = new Audio();
currentTheme.volume = volume;

let themeSource = "";
let loopingTheme;

let currentSFX = new Audio();
currentSFX.volume = sfxVolume;

let currentUI = new Audio();
currentUI.volume = volume;
const CURSOR_THRESHOLD = 30;

let sfxSource = "";

let menuOptions = null;

let playerCOObj = {};

let playerNames = [];

let blackHoleCOs = ["Adder", "Flak", "Hawke", "Jugger", "Kindle", "Koal", "Lash", "Sturm", "Von Bolt"];

let SCOPTheme = "https://macroland.one/themes/kingrex/misc/super-power.ogg";
let COPTheme = "https://macroland.one/themes/kingrex/misc/power.ogg";
let SCOPThemeBH = "https://macroland.one/themes/kingrex/misc/bh-super-power.ogg";
let COPThemeBH = "https://macroland.one/themes/kingrex/misc/bh-power.ogg";
let victoryTheme = "https://macroland.one/themes/kingrex/misc/victory-1.ogg";
let defeatTheme = "https://macroland.one/themes/kingrex/misc/defeat-1.ogg";
let mapTheme = "https://sndup.net/zwwj/d";

let andyTheme = "https://macroland.one/themes/kingrex/orange-star/andy.ogg";
let hachiTheme = "https://macroland.one/themes/kingrex/orange-star/hachi.ogg";
let jakeTheme = "https://macroland.one/themes/kingrex/orange-star/jake.ogg";
let maxTheme = "https://macroland.one/themes/kingrex/orange-star/max.ogg";
let nellTheme = "https://macroland.one/themes/kingrex/orange-star/nell.ogg";
let rachelTheme = "https://macroland.one/themes/kingrex/orange-star/rachel.ogg";
let samiTheme = "https://macroland.one/themes/kingrex/orange-star/sami.ogg";
let colinTheme = "https://macroland.one/themes/kingrex/blue-moon/colin.ogg";
let gritTheme = "https://macroland.one/themes/kingrex/blue-moon/grit.ogg";
let olafTheme = "https://macroland.one/themes/kingrex/blue-moon/olaf.ogg";
let sashaTheme = "https://macroland.one/themes/kingrex/blue-moon/sasha.ogg";
let drakeTheme = "https://macroland.one/themes/kingrex/green-earth/drake.ogg";
let eagleTheme = "https://macroland.one/themes/kingrex/green-earth/eagle.ogg";
let javierTheme = "https://macroland.one/themes/kingrex/green-earth/javier.ogg";
let jessTheme = "https://macroland.one/themes/kingrex/green-earth/jess.ogg";
let grimmTheme = "https://macroland.one/themes/kingrex/yellow-comet/grimm.ogg";
let kanbeiTheme = "https://macroland.one/themes/kingrex/yellow-comet/kanbei.ogg";
let senseiTheme = "https://macroland.one/themes/kingrex/yellow-comet/sensei.ogg";
let sonjaTheme = "https://macroland.one/themes/kingrex/yellow-comet/sonja.ogg";
let adderTheme = "https://macroland.one/themes/kingrex/black-hole/adder.ogg";
let flakTheme = "https://macroland.one/themes/kingrex/black-hole/flak.ogg";
let hawkeTheme = "https://macroland.one/themes/kingrex/black-hole/hawke.ogg";
let juggerTheme = "https://macroland.one/themes/kingrex/black-hole/jugger.ogg";
let kindleTheme = "https://macroland.one/themes/kingrex/black-hole/kindle.ogg";
let koalTheme = "https://macroland.one/themes/kingrex/black-hole/koal.ogg";
let lashTheme = "https://macroland.one/themes/kingrex/black-hole/lash.ogg";
let sturmTheme = "https://macroland.one/themes/kingrex/black-hole/sturm.ogg";
let vonboltTheme = "https://macroland.one/themes/kingrex/black-hole/vonbolt.ogg";

// Reboot Camp
let SCOPThemeRBC = "https://macroland.one/themes/rbc/loop/t-co-super-power-2.wav";
let COPThemeRBC = "https://macroland.one/themes/rbc/loop/t-co-power-2.wav";
let SCOPThemeBHRBC = "https://macroland.one/themes/rbc/loop/t-bh-super-power-2.wav";
let COPThemeBHRBC = "https://macroland.one/themes/rbc/loop/t-bh-power-2.wav";
let victoryThemeRBC = "https://macroland.one/themes/rbc/loop/t-no-loop-victory.wav";
let defeatThemeRBC = "https://macroland.one/themes/rbc/loop/t-no-loop-defeat.wav";

let andyThemeRBC = "https://macroland.one/themes/rbc/loop/t-andy.wav";
let hachiThemeRBC = "https://macroland.one/themes/rbc/loop/t-hachi.wav";
let maxThemeRBC = "https://macroland.one/themes/rbc/loop/t-max.wav";
let nellThemeRBC = "https://macroland.one/themes/rbc/loop/t-nell.wav";
let samiThemeRBC = "https://macroland.one/themes/rbc/loop/t-sami.wav";
let colinThemeRBC = "https://macroland.one/themes/rbc/loop/t-colin.wav";
let gritThemeRBC = "https://macroland.one/themes/rbc/loop/t-grit.wav";
let olafThemeRBC = "https://macroland.one/themes/rbc/loop/t-olaf.wav";
let drakeThemeRBC = "https://macroland.one/themes/rbc/loop/t-drake.wav";
let eagleThemeRBC = "https://macroland.one/themes/rbc/loop/t-eagle.wav";
let jessThemeRBC = "https://macroland.one/themes/rbc/loop/t-jess.wav";
let kanbeiThemeRBC = "https://macroland.one/themes/rbc/loop/t-kanbei.wav";
let senseiThemeRBC = "https://macroland.one/themes/rbc/loop/t-sensei.wav";
let sonjaThemeRBC = "https://macroland.one/themes/rbc/loop/t-sonja.wav";
let adderThemeRBC = "https://macroland.one/themes/rbc/loop/t-adder.wav";
let flakThemeRBC = "https://macroland.one/themes/rbc/loop/t-flak.wav";
let hawkeThemeRBC = "https://macroland.one/themes/rbc/loop/t-hawke.wav";
let lashThemeRBC = "https://macroland.one/themes/rbc/loop/t-lash.wav";
let sturmThemeRBC = "https://macroland.one/themes/rbc/loop/t-sturm.wav";

let allCOThemes = [andyTheme, hachiTheme, jakeTheme, maxTheme, nellTheme, rachelTheme, samiTheme, colinTheme,
                   gritTheme, olafTheme, sashaTheme, drakeTheme, eagleTheme, javierTheme, jessTheme,
                   grimmTheme, kanbeiTheme, senseiTheme, sonjaTheme, adderTheme, flakTheme, hawkeTheme,
                   juggerTheme, kindleTheme, koalTheme, lashTheme, sturmTheme, vonboltTheme, andyThemeRBC,
                   hachiThemeRBC, maxThemeRBC, nellThemeRBC, samiThemeRBC, colinThemeRBC, gritThemeRBC, olafThemeRBC,
                   drakeThemeRBC, eagleThemeRBC, jessThemeRBC, kanbeiThemeRBC, senseiThemeRBC, sonjaThemeRBC,
                   adderThemeRBC, flakThemeRBC, hawkeThemeRBC, lashThemeRBC, sturmThemeRBC];

let moveInf_1 = "https://macroland.one/movement/inf_move_chopped_1.mp3";
let moveInf_2 = "https://macroland.one/movement/inf_move_chopped_2.mp3";
let moveInf_3 = "https://macroland.one/movement/inf_move_chopped_3.mp3";

let moveBCopterLoop = "https://macroland.one/movement/move_bcopter.wav";
let moveBCopterOneShot = "https://macroland.one/movement/move_bcopter_rolloff.wav";
let moveInfLoop = "https://macroland.one/movement/move_inf.wav";
let moveMechLoop = "https://macroland.one/movement/move_mech.wav";
let moveNavalLoop = "https://macroland.one/movement/move_naval.wav";
let movePiperunnerLoop = "https://macroland.one/movement/move_piperunner.wav";
let movePlaneLoop = "https://macroland.one/movement/move_plane.wav";
let movePlaneOneShot = "https://macroland.one/movement/move_plane_rolloff.wav";
let moveSubLoop = "https://macroland.one/movement/move_sub.wav";
let moveTCopterLoop = "https://macroland.one/movement/move_tcopter.wav";
let moveTCopterOneShot = "https://macroland.one/movement/move_tcopter_rolloff.wav";
let moveTiresHeavyLoop = "https://macroland.one/movement/move_tires_heavy.wav";
let moveTiresHeavyOneShot = "https://macroland.one/movement/move_tires_heavy_rolloff.wav";
let moveTiresLightLoop = "https://macroland.one/movement/move_tires_light.wav";
let moveTiresLightOneShot = "https://macroland.one/movement/move_tires_light_rolloff.wav";
let moveTreadHeavyLoop = "https://macroland.one/movement/move_tread_heavy.wav";
let moveTreadHeavyOneShot = "https://macroland.one/movement/move_tread_heavy_rolloff.wav";
let moveTreadLightLoop = "https://macroland.one/movement/move_tread_light.wav";
let moveTreadLightOneShot = "https://macroland.one/movement/move_tread_light_rolloff.wav";

let actionLoadSFX = "https://macroland.one/game/action_load.wav";
let actionUnloadSFX = "https://macroland.one/game/action_unload.wav";
let actionCaptAllySFX = "https://macroland.one/game/capture_ally.wav";
let actionCaptEnemySFX = "https://macroland.one/game/capture_enemy.wav";
let actionUnitExplode = "https://macroland.one/game/unit_explode.wav";
let actionSupplyRepair = "https://macroland.one/game/action_resupply_repair.wav";

let uiCursorMove = "https://macroland.one/game/ui_cursormove.wav";
let uiMenuOpen = "https://macroland.one/game/ui_openmenu.wav";
let uiMenuClose = "https://macroland.one/game/ui_closemenu.wav";
let uiMenuMove = "https://macroland.one/game/ui_menumove.wav";
let uiUnitClick = "https://macroland.one/game/ui_unitclick.wav";

let powerSCOPIntro = "https://macroland.one/game/power_co_scop.wav";
let powerBHSCOPIntro = "https://macroland.one/game/power_bh_scop.wav";

let thisGamesCOs = [];
let preLoadedAudio = [];

let eventHeader = document.querySelector('.event-username');

let menu = isMapEditor ? document.querySelector('#replay-misc-controls') : document.querySelector('#game-map-menu').parentNode;

// build and append button to game menu
let musicPlayerDiv = document.createElement('div');
musicPlayerDiv.id = 'music-player-parent';
musicPlayerDiv.classList.add('game-tools-btn');
musicPlayerDiv.classList.add('cls-context-menu-root');
musicPlayerDiv.style.width = '34px';
musicPlayerDiv.style.height = '30px';
musicPlayerDiv.style.border = isMapEditor ? 'none' : '1px solid #888888';
musicPlayerDiv.style.borderLeft = isMapEditor ? '1px solid #888888' : '0px';

let musicPlayerDivHoverSpan = document.createElement('span');
musicPlayerDivHoverSpan.id = 'adji-hover-span';
musicPlayerDivHoverSpan.classList.add('game-tools-btn-text');
musicPlayerDivHoverSpan.classList.add('small_text');
musicPlayerDivHoverSpan.classList.add('cls-context-menu-root');
musicPlayerDivHoverSpan.innerText = "Play Tunes";

let musicPlayerDivBackground = document.createElement('div');
musicPlayerDivBackground.id = 'music-player-background';
musicPlayerDivBackground.classList.add('game-tools-bg');
musicPlayerDivBackground.classList.add('cls-context-menu-root');
musicPlayerDivBackground.style.backgroundImage = "linear-gradient(to right, #ffffff 0% , #888888 0%)";
// #0066CC

let musicPlayerDivBackgroundSpan = document.createElement('span');
musicPlayerDivBackgroundSpan.id = 'music-player-background-span';
musicPlayerDivBackgroundSpan.classList.add('norm2');
musicPlayerDivBackgroundSpan.classList.add('cls-context-menu-root');

let musicPlayerDivBackgroundLink = document.createElement('a');
musicPlayerDivBackgroundLink.id = 'music-player-background-link';
musicPlayerDivBackgroundLink.classList.add('norm2');
musicPlayerDivBackgroundLink.classList.add('cls-context-menu-root');

let musicPlayerDivBackgroundImg = document.createElement('img');
musicPlayerDivBackgroundImg.id = 'music-player-background-link';
musicPlayerDivBackgroundImg.classList.add('cls-context-menu-root');
musicPlayerDivBackgroundImg.src = neutralImgLink;
musicPlayerDivBackgroundImg.style.verticalAlign = "middle";
musicPlayerDivBackgroundImg.style.width = '17px';
musicPlayerDivBackgroundImg.style.height = '17px';

musicPlayerDiv.appendChild(musicPlayerDivBackground);
musicPlayerDiv.appendChild(musicPlayerDivHoverSpan);
musicPlayerDivBackground.appendChild(musicPlayerDivBackgroundSpan);
musicPlayerDivBackgroundSpan.appendChild(musicPlayerDivBackgroundLink);
musicPlayerDivBackgroundLink.appendChild(musicPlayerDivBackgroundImg);
menu.appendChild(musicPlayerDiv);

musicPlayerDivBackgroundLink.onclick = musicFunc;

// Button click function
function musicFunc()
{
    if (clicked == false)
    {
        isPlaying = true;

        isMapEditor ? playMapTunes() : playTunes();

        musicPlayerDivHoverSpan.innerText = "Stop Tunes";
        musicPlayerDivBackground.style.backgroundColor = "#e1e1e1";
        clicked = true;
    }
    else
    {
        isPlaying = false;

        stopTunes();

        musicPlayerDivBackgroundImg.src = neutralImgLink;
        musicPlayerDivHoverSpan.innerText = "Play Tunes";
        musicPlayerDivBackground.style.backgroundColor = "#ffffff";
        clicked = false;
    }

    musicPlayerSettings["is-playing"] = isPlaying;
    updateObjectInLocalStorage();
}

function determineRandomCO()
{
  if (rbcThemesOn)
  {
    let newTheme = "";

    while (!newTheme.includes("t-"))
    {
      let randomTheme = allCOThemes[Math.floor(Math.random() * allCOThemes.length)];
      themeSource = randomTheme;
      newTheme = themeSource;
    }
  }
  else
  {
    let randomTheme = allCOThemes[Math.floor(Math.random() * allCOThemes.length)];
    themeSource = randomTheme;
  }
}

// Determine who the current CO is and generate their theme data
function determineCurrentCO()
{
    let COName = "";

    Object.keys(playersInfo).forEach(playerID =>
    {
      if (playerID == currentTurn)
      {
          COName = playersInfo[playerID]["co_name"];
      }

      playerCOObj[playerID] = playersInfo[playerID]["co_name"];
      playerNames.push(playersInfo[playerID]["users_username"]);

    });

    switch(COName)
    {
        case "Andy":
            if (rbcThemesOn) { themeSource = andyThemeRBC; }
            else { themeSource = andyTheme; }
            break;
        case "Hachi":
            if (rbcThemesOn) { themeSource = hachiThemeRBC; }
            else { themeSource = hachiTheme; }
            break;
        case "Jake":
            themeSource = jakeTheme;
            break;
        case "Max":
            if (rbcThemesOn) { themeSource = maxThemeRBC; }
            else { themeSource = maxTheme; }
            break;
        case "Nell":
            if (rbcThemesOn) { themeSource = nellThemeRBC; }
            else { themeSource = nellTheme; }
            break;
        case "Rachel":
            themeSource = rachelTheme;
            break;
        case "Sami":
            if (rbcThemesOn) { themeSource = samiThemeRBC; }
            else { themeSource = samiTheme; }
            break;
        case "Colin":
            if (rbcThemesOn) { themeSource = colinThemeRBC; }
            else { themeSource = colinTheme; }
            break;
        case "Grit":
            if (rbcThemesOn) { themeSource = gritThemeRBC; }
            else { themeSource = gritTheme; }
            break;
        case "Olaf":
            if (rbcThemesOn) { themeSource = olafThemeRBC; }
            else { themeSource = olafTheme; }
            break;
        case "Sasha":
            themeSource = sashaTheme;
            break;
        case "Drake":
            if (rbcThemesOn) { themeSource = drakeThemeRBC; }
            else { themeSource = drakeTheme; }
            break;
        case "Eagle":
            if (rbcThemesOn) { themeSource = eagleThemeRBC; }
            else { themeSource = eagleTheme; }
            break;
        case "Javier":
            themeSource = javierTheme;
            break;
        case "Jess":
            if (rbcThemesOn) { themeSource = jessThemeRBC; }
            else { themeSource = jessTheme; }
            break;
        case "Grimm":
            themeSource = grimmTheme;
            break;
        case "Kanbei":
            if (rbcThemesOn) { themeSource = kanbeiThemeRBC; }
            else { themeSource = kanbeiTheme; }
            break;
        case "Sensei":
            if (rbcThemesOn) { themeSource = senseiThemeRBC; }
            else { themeSource = senseiTheme; }
            break;
        case "Sonja":
            if (rbcThemesOn) { themeSource = sonjaThemeRBC; }
            else { themeSource = sonjaTheme; }
            break;
        case "Adder":
            if (rbcThemesOn) { themeSource = adderThemeRBC; }
            else { themeSource = adderTheme; }
            break;
        case "Flak":
            if (rbcThemesOn) { themeSource = flakThemeRBC; }
            else { themeSource = flakTheme; }
            break;
        case "Hawke":
            if (rbcThemesOn) { themeSource = hawkeThemeRBC; }
            else { themeSource = hawkeTheme; }
            break;
        case "Jugger":
            themeSource = juggerTheme;
            break;
        case "Kindle":
            themeSource = kindleTheme;
            break;
        case "Koal":
            themeSource = koalTheme;
            break;
        case "Lash":
            if (rbcThemesOn) { themeSource = lashThemeRBC; }
            else { themeSource = lashTheme; }
            break;
        case "Sturm":
            if (rbcThemesOn) { themeSource = sturmThemeRBC; }
            else { themeSource = sturmTheme; }
            break;
        case "Von Bolt":
            themeSource = vonboltTheme;
            break;
    }
}

// Event listener for when the audio data is actually loaded
currentTheme.onloadedmetadata = function()
{
    if (isRandomCOTheme)
    {
      currentTheme.loop = false;

      var duration = currentTheme.duration * 1000;

      randomThemeTimeout = setTimeout(function()
      {
        stopTunes();
        playTunes();
      }, duration);

    };
    if (isClassicTheme ||
        currentTheme.src == SCOPTheme ||
        currentTheme.src == COPTheme ||
        currentTheme.src == SCOPThemeBH ||
        currentTheme.src == COPThemeBH ||
        currentTheme.src == victoryTheme ||
        currentTheme.src == defeatTheme)
    {
      currentTheme.loop = true;

      if (currentTheme.src == victoryThemeRBC || currentTheme.src == defeatThemeRBC)
      {
        currentTheme.loop = false;
        setTimeout(function()
        {
          musicFunc();
        }, currentTheme.duration * 1000);
      }

      clearTimeout(randomThemeTimeout);
    };

    currentTheme.play();

    musicPlayerDivBackgroundImg.src = playingImgLink;
};

currentSFX.onloadedmetadata = function()
{
    currentSFX.loop = false;
    currentSFX.play();
};

var on = (function() {
    if (window.addEventListener) {
        return function(target, type, listener){
            target.addEventListener(type, listener, false);
        };
    }
    else {
        return function(object, sEvent, fpNotify){
            object.attachEvent("on" + sEvent, fpNotify);
        };
    }
} ());

let replayForwardBtn = document.getElementsByClassName('replay-forward')[0];
let replayBackwardBtn = document.getElementsByClassName('replay-backward')[0];

if (replayForwardBtn != null)
{
    on(replayForwardBtn, "click", function(){
        if (isPlaying == false) return;
        stopTunes();
        setTimeout(()=>{ playTunes(); }, 1000);
    });
}

if (replayBackwardBtn != null)
{
    on(replayBackwardBtn, "click", function(){
        if (isPlaying == false) return;
        stopTunes();
        setTimeout(()=>{ playTunes(); }, 1000);
    });
}

// Wrap the event screen to update the current theme
if (isMapEditor == false)
{
    let native = showEventScreen;
    showEventScreen = function()
    {
        native.apply(showEventScreen, arguments);

        if (isPlaying == false) return;

        if (eventHeader.innerText.includes("Super") &&
            eventHeader.innerText.includes("Power") &&
            blackHoleCOs.includes(playerCOObj[currentTurn]) == false)
        {
            stopTunes();

            if (isClassicTheme == false)
            {
              if (isEnemyTheme) playSCOPBHTheme();
              else playSCOPTheme();
            }
            else
            {
              playSCOPTheme();
            }

        }
        else if (eventHeader.innerText.includes("Super") &&
                eventHeader.innerText.includes("Power") &&
                blackHoleCOs.includes(playerCOObj[currentTurn]) == true)
        {
            stopTunes();

            if (isClassicTheme == false)
            {
              if (isEnemyTheme) playSCOPBHTheme();
              else playSCOPTheme();
            }
            else
            {
              playSCOPBHTheme();
            }
        }
        else if (eventHeader.innerText.includes("Super") == false &&
                eventHeader.innerText.includes("Power") &&
                blackHoleCOs.includes(playerCOObj[currentTurn]) == false)
        {
            stopTunes();

            if (isClassicTheme == false)
            {
              if (isEnemyTheme) playCOPBHTheme();
              else playCOPTheme();
            }
            else
            {
              playCOPTheme();
            }
        }
        else if (eventHeader.innerText.includes("Super") == false &&
                eventHeader.innerText.includes("Power") &&
                blackHoleCOs.includes(playerCOObj[currentTurn]) == true)
        {
            stopTunes();

            if (isClassicTheme == false)
            {
              if (isEnemyTheme) playCOPBHTheme();
              else playCOPTheme();
            }
            else
            {
              playCOPBHTheme();
            }
        }
        else if (eventHeader.innerText.includes("Day") )
        {
            stopTunes();
            playTunes();
        }
        else if (eventHeader.innerText.includes(myName))
        {
            stopTunes();
            playDefeatTheme();
        }
        else if (eventHeader.innerText.includes(myName) == false)
        {
            stopTunes();
            playVictoryTheme();
        }
    };
}

// Play/Stop functions
function playMapTunes()
{
    currentTheme.src = mapTheme;
}

function playTunes()
{
    if (isClassicCOTheme) { determineCurrentCO(); };
    if (isRandomCOTheme) { determineRandomCO(); };

    currentTheme.src = themeSource;
}

function playVictoryTheme()
{
    if (rbcThemesOn) { currentTheme.loop = false; currentTheme.src = victoryThemeRBC; }
    else { currentTheme.src = victoryTheme; }
}

function playDefeatTheme()
{
  if (rbcThemesOn) { currentTheme.loop = false; currentTheme.src = defeatThemeRBC; }
  else { currentTheme.src = defeatTheme; }
}

function playSCOPTheme()
{
  playOneShot(powerSCOPIntro, volume);

  setTimeout(() => {
    if (rbcThemesOn) { currentTheme.src = SCOPThemeRBC; }
    else { currentTheme.src = SCOPTheme; }
  }, scopDelay);
}

function playCOPTheme()
{
    if (rbcThemesOn) { currentTheme.src = COPThemeRBC; }
    else { currentTheme.src = COPTheme; }
}

function playSCOPBHTheme()
{
    playOneShot(powerBHSCOPIntro, volume);

    setTimeout(() => {
      if (rbcThemesOn) { currentTheme.src = SCOPThemeBHRBC; }
      else { currentTheme.src = SCOPThemeBH; }
    }, scopBHDelay);
}

function playCOPBHTheme()
{
  if (rbcThemesOn) { currentTheme.src = COPThemeBHRBC; }
  else { currentTheme.src = COPThemeBH; }
}

function stopTunes()
{
    // clearInterval(loopingTheme);
    clearTimeout(randomThemeTimeout);
    currentTheme.src = '';
}

function determineThemesToPreload()
{
    Object.values(playersInfo).forEach(entry => {
      thisGamesCOs.push(entry.co_name);
    });
}

function getCOThemesToPreload()
{
  if (isRandomCOTheme)
  {
    allCOThemes.forEach(function(theme)
    {
      preLoadedAudio.push(theme);
    });
  }
  else
  {
    thisGamesCOs.forEach(function(co)
    {
        switch(co)
    {
        case "Andy":
            preLoadedAudio.push(andyTheme);
            if (rbcThemesOn) { preLoadedAudio.push(andyThemeRBC); }
            break;
        case "Hachi":
            preLoadedAudio.push(hachiTheme);
            if (rbcThemesOn) { preLoadedAudio.push(hachiThemeRBC); }
            break;
        case "Jake":
            preLoadedAudio.push(jakeTheme);
            break;
        case "Max":
            preLoadedAudio.push(maxTheme);
            if (rbcThemesOn) { preLoadedAudio.push(maxThemeRBC); }
            break;
        case "Nell":
            preLoadedAudio.push(nellTheme);
            if (rbcThemesOn) { preLoadedAudio.push(nellThemeRBC); }
            break;
        case "Rachel":
            preLoadedAudio.push(rachelTheme);
            break;
        case "Sami":
            preLoadedAudio.push(samiTheme);
            if (rbcThemesOn) { preLoadedAudio.push(samiThemeRBC); }
            break;
        case "Colin":
            preLoadedAudio.push(colinTheme);
            if (rbcThemesOn) { preLoadedAudio.push(colinThemeRBC); }
            break;
        case "Grit":
            preLoadedAudio.push(gritTheme);
            if (rbcThemesOn) { preLoadedAudio.push(gritThemeRBC); }
            break;
        case "Olaf":
            preLoadedAudio.push(olafTheme);
            if (rbcThemesOn) { preLoadedAudio.push(olafThemeRBC); }
            break;
        case "Sasha":
            preLoadedAudio.push(sashaTheme);
            break;
        case "Drake":
            preLoadedAudio.push(drakeTheme);
            if (rbcThemesOn) { preLoadedAudio.push(drakeThemeRBC); }
            break;
        case "Eagle":
            preLoadedAudio.push(eagleTheme);
            if (rbcThemesOn) { preLoadedAudio.push(eagleThemeRBC); }
            break;
        case "Javier":
            preLoadedAudio.push(javierTheme);
            break;
        case "Jess":
            preLoadedAudio.push(jessTheme);
            if (rbcThemesOn) { preLoadedAudio.push(jessThemeRBC); }
            break;
        case "Grimm":
            preLoadedAudio.push(grimmTheme);
            if (rbcThemesOn) { preLoadedAudio.push(grimmThemeRBC); }
            break;
        case "Kanbei":
            preLoadedAudio.push(kanbeiTheme);
            if (rbcThemesOn) { preLoadedAudio.push(kanbeiThemeRBC); }
            break;
        case "Sensei":
            preLoadedAudio.push(senseiTheme);
            if (rbcThemesOn) { preLoadedAudio.push(senseiThemeRBC); }
            break;
        case "Sonja":
            preLoadedAudio.push(sonjaTheme);
            if (rbcThemesOn) { preLoadedAudio.push(sonjaThemeRBC); }
            break;
        case "Adder":
            preLoadedAudio.push(adderTheme);
            if (rbcThemesOn) { preLoadedAudio.push(adderThemeRBC); }
            break;
        case "Flak":
            preLoadedAudio.push(flakTheme);
            if (rbcThemesOn) { preLoadedAudio.push(flakThemeRBC); }
            break;
        case "Hawke":
            preLoadedAudio.push(hawkeTheme);
            if (rbcThemesOn) { preLoadedAudio.push(hawkeThemeRBC); }
            break;
        case "Jugger":
            preLoadedAudio.push(juggerTheme);
            break;
        case "Kindle":
            preLoadedAudio.push(kindleTheme);
            break;
        case "Koal":
            preLoadedAudio.push(koalTheme);
            break;
        case "Lash":
            preLoadedAudio.push(lashTheme);
            if (rbcThemesOn) { preLoadedAudio.push(lashThemeRBC); }
            break;
        case "Sturm":
            preLoadedAudio.push(sturmTheme);
            if (rbcThemesOn) { preLoadedAudio.push(sturmThemeRBC); }
            break;
        case "Von Bolt":
            preLoadedAudio.push(vonboltTheme);
            break;
        }
    });
  }

}

function getGenericThemesToPreload()
{
  preLoadedAudio.push(SCOPTheme);
  preLoadedAudio.push(COPTheme);
  preLoadedAudio.push(SCOPThemeBH);
  preLoadedAudio.push(COPThemeBH);
  preLoadedAudio.push(victoryTheme);
  preLoadedAudio.push(defeatTheme);

  if (rbcThemesOn)
  {
    preLoadedAudio.push(SCOPThemeRBC);
    preLoadedAudio.push(COPThemeRBC);
    preLoadedAudio.push(SCOPThemeBHRBC);
    preLoadedAudio.push(COPThemeBHRBC);
    preLoadedAudio.push(victoryThemeRBC);
    preLoadedAudio.push(defeatThemeRBC);
  }
}

function getMovementSFXToPreload()
{
  preLoadedAudio.push(moveBCopterLoop);
  preLoadedAudio.push(moveBCopterOneShot);
  preLoadedAudio.push(moveInfLoop);
  preLoadedAudio.push(moveNavalLoop);
  preLoadedAudio.push(movePiperunnerLoop);
  preLoadedAudio.push(movePlaneLoop);
  preLoadedAudio.push(movePlaneOneShot);
  preLoadedAudio.push(moveSubLoop);
  preLoadedAudio.push(moveTCopterLoop);
  preLoadedAudio.push(moveTCopterOneShot);
  preLoadedAudio.push(moveTiresHeavyLoop);
  preLoadedAudio.push(moveTiresHeavyOneShot);
  preLoadedAudio.push(moveTiresLightLoop);
  preLoadedAudio.push(moveTiresLightOneShot);
  preLoadedAudio.push(moveTreadHeavyLoop);
  preLoadedAudio.push(moveTreadHeavyOneShot);
  preLoadedAudio.push(moveTreadLightLoop);
  preLoadedAudio.push(moveTreadLightOneShot);
}

function getGameSFXToPreload()
{
  preLoadedAudio.push(actionLoadSFX);
  preLoadedAudio.push(actionUnloadSFX);
  preLoadedAudio.push(actionCaptAllySFX);
  preLoadedAudio.push(actionCaptEnemySFX);
}

function preloadAudio() {
    console.log(preLoadedAudio.length)
    preLoadedAudio.forEach(function(url)
    {
        let audio = new Audio();
        audio.addEventListener('canplaythrough', loadedAudio, false);
        audio.src = url;
    })
}

let loaded = 0;
let loadPercentage = 0;
function loadedAudio() {
    loaded++;
    loadPercentage = (loaded / preLoadedAudio.length) * 100;
    musicPlayerDivBackground.style.backgroundImage = "linear-gradient(to right, #ffffff " + String(loadPercentage) + "% , #888888 0%)";

    if (loaded == preLoadedAudio.length)
    {
    	console.log("All audio has been pre-loaded!");
    }
}

function preloadThemes()
{
    if (!isMapEditor)
    {
        determineThemesToPreload();
        getCOThemesToPreload();
        getGenericThemesToPreload();
        getMovementSFXToPreload();
        getGameSFXToPreload();
    }
    else
    {
        preLoadedAudio.push(mapTheme);
    }
    preloadAudio();
}

const playMovementSound = (audioURL, playCount = 1, volume) =>
{

  const audioContext = new AudioContext();
  audioContext.resume();

  let playCountArray = [];

  for (let i = 0; i < playCount; i++) {

    let soundInstance = new Audio(audioURL);
    playCountArray.push(soundInstance);

    if (playCountArray.length < playCount)
    {
      playCountArray[i].addEventListener('ended', () => { playCountArray.shift(); playCountArray[0].currentTime = 0; playCountArray[0].volume = volume; movementSFX = playCountArray[0]; playCountArray[0].play(); });
    }

  }

  movementSFX = playCountArray[0];
  playCountArray[0].currentTime = 0;
  playCountArray[0].volume = volume;
  playCountArray[0].play();

};

var playOneShot = (audioURL, volume) =>
{
  // const audioContext = new AudioContext();
  // audioContext.resume();

  let soundInstance = new Audio(audioURL);
  soundInstance.currentTime = 0;
  soundInstance.volume = volume;
  soundInstance.play();
};

function stopMovementSound(unitId, rolloff)
{

  if (movementSFX != null)
  {
    movementSFX.currentTime = 0;
    movementSFX.pause();
  }

  if (movingUnit == unitId && rolloff)
  {

    switch(activeUnitSFX["unitType"])
    {
      case "APC":
        playOneShot(moveTreadLightOneShot, sfxVolume);
        break;
      case "Anti-Air":
        playOneShot(moveTreadLightOneShot, sfxVolume);
        break;
      case "Artillery":
        playOneShot(moveTreadLightOneShot, sfxVolume);
        break;
      case "B-Copter":
        playOneShot(moveBCopterOneShot, sfxVolume);
        break;
      case "Black Bomb":
        playOneShot(movePlaneOneShot, sfxVolume);
        break;
      case "Bomber":
        playOneShot(movePlaneOneShot, sfxVolume);
        break;
      case "Fighter":
        playOneShot(movePlaneOneShot, sfxVolume);
        break;
      case "Md.Tank":
        playOneShot(moveTreadHeavyOneShot, sfxVolume);
        break;
      case "Mega Tank":
        playOneShot(moveTreadHeavyOneShot, sfxVolume);
        break;
      case "Missile":
        playOneShot(moveTiresHeavyOneShot, sfxVolume);
        break;
      case "Neotank":
        playOneShot(moveTreadHeavyOneShot, sfxVolume);
        break;
      case "Recon":
        playOneShot(moveTiresLightOneShot, sfxVolume);
        break;
      case "Rocket":
        playOneShot(moveTiresHeavyOneShot, sfxVolume);
        break;
      case "Stealth":
        playOneShot(movePlaneOneShot, sfxVolume);
        break;
      case "T-Copter":
        playOneShot(moveTCopterOneShot, sfxVolume);
        break;
      case "Tank":
        playOneShot(moveTreadLightOneShot, sfxVolume);
        break;
    }

    movingUnit = null;

  }
}

function playSoundBasedOnUnitType(unitType)
{
  switch(unitType)
  {
    case "APC":
      playMovementSound(moveTreadLightLoop, 1, sfxVolume);
      break;
    case "Anti-Air":
      playMovementSound(moveTreadLightLoop, 1, sfxVolume);
      break;
    case "Artillery":
      playMovementSound(moveTreadLightLoop, 1, sfxVolume);
      break;
    case "B-Copter":
      playMovementSound(moveBCopterLoop, 1, sfxVolume);
      break;
    case "Battleship":
      playMovementSound(moveNavalLoop, 1, sfxVolume);
      break;
    case "Black Boat":
      playMovementSound(moveNavalLoop, 1, sfxVolume);
      break;
    case "Black Bomb":
      playMovementSound(movePlaneLoop, 1, sfxVolume);
      break;
    case "Bomber":
      playMovementSound(movePlaneLoop, 1, sfxVolume);
      break;
    case "Carrier":
      playMovementSound(moveNavalLoop, 1, sfxVolume);
      break;
    case "Cruiser":
      playMovementSound(moveNavalLoop, 1, sfxVolume);
      break;
    case "Fighter":
      playMovementSound(movePlaneLoop, 1, sfxVolume);
      break;
    case "Infantry":
      playMovementSound(moveInfLoop, 1, sfxVolume);
      break;
    case "Lander":
      playMovementSound(moveNavalLoop, 1, sfxVolume);
      break;
    case "Md.Tank":
      playMovementSound(moveTreadHeavyLoop, 1, sfxVolume);
      break;
    case "Mech":
      playMovementSound(moveMechLoop, 1, sfxVolume);
      break;
    case "Mega Tank":
      playMovementSound(moveTreadHeavyLoop, 1, sfxVolume);
      break;
    case "Missile":
      playMovementSound(moveTiresHeavyLoop, 1, sfxVolume);
      break;
    case "Neotank":
      playMovementSound(moveTreadHeavyLoop, 1, sfxVolume);
      break;
    case "Piperunner":
      playMovementSound(movePiperunnerLoop, 1, sfxVolume);
      break;
    case "Recon":
      playMovementSound(moveTiresLightLoop, 1, sfxVolume);
      break;
    case "Rocket":
      playMovementSound(moveTiresHeavyLoop, 1, sfxVolume);
      break;
    case "Stealth":
      playMovementSound(movePlaneLoop, 1, sfxVolume);
      break;
    case "Sub":
      playMovementSound(moveSubLoop, 1, sfxVolume);
      break;
    case "T-Copter":
      playMovementSound(moveTCopterLoop, 1, sfxVolume);
      break;
    case "Tank":
      playMovementSound(moveTreadLightLoop, 1, sfxVolume);
      break;
  }
}

function getPlayerInfo()
{
  Object.values(playersInfo).forEach(entry => {
    if (entry.users_username == myName) { myID = entry.players_id; };
  });
}

// Action Handlers
ahMove = actionHandlers.Move;
actionHandlers.Move = function()
{
    ahMove.apply(actionHandlers.Move, arguments);

    if (isPlaying == false) return;

    stopMovementSound(movingUnit, false);
    movingUnit = arguments[0].unit.units_id;

    var movementDist = arguments[0].path.length;

    if (movementDist > 1)
    {
      var unitType = unitsInfo[arguments[0].unit.units_id].units_name;

      activeUnitSFX["unitID"] = movingUnit;
      activeUnitSFX["unitType"] = unitType;

      playSoundBasedOnUnitType(unitType);
    }
}

ahWait = waitUnit;
waitUnit = function()
{
  ahWait.apply(waitUnit, arguments);

  if (isPlaying == false) return;

  if (movementSFX != null)
  {
    if (arguments[0] !== undefined && unitsInfo[arguments[0]] !== undefined && unitsInfo[arguments[0]].units_moved) { stopMovementSound(arguments[0], true); };
  }
}

ahCursorMove = updateCursor;
let lastCursorCall = Date.now();
updateCursor = function()
{
  ahCursorMove.apply(updateCursor, arguments);

  if (isPlaying == false) return;

  if (Date.now() - lastCursorCall > CURSOR_THRESHOLD) { playOneShot(uiCursorMove, uiVolume) };
  lastCursorCall = Date.now();
}

ahOpenMenu = openMenu;
openMenu = function()
{
  ahOpenMenu.apply(openMenu, arguments);

  if (isPlaying == false) return;

  menuOptions = document.getElementsByClassName("menu-option");

  for (var i = 0; i < menuOptions.length; i++) {
      menuOptions[i].addEventListener('mouseover', function(e) {
        if (e.target !== this) { return; };
        playOneShot(uiMenuMove, uiVolume);
      });

      on(menuOptions[i], "click", function(){
          menuItemClick = true;
      });
  }

  menuOpen = true;

  playOneShot(uiMenuOpen, uiVolume);
}

ahCloseMenu = closeMenu;
closeMenu = function()
{
  ahCloseMenu.apply(closeMenu, arguments);

  if (isPlaying == false) return;

  if (menuItemClick && menuOpen) { playOneShot(uiMenuOpen, uiVolume); };
  if (!menuItemClick && menuOpen) { playOneShot(uiMenuClose, uiVolume); };

  menuOpen = false;
  menuItemClick = false;
}

ahUnitClick = unitClickHandler;
unitClickHandler = function()
{
  ahUnitClick.apply(unitClickHandler, arguments);

  if (isPlaying == false) return;

  playOneShot(uiUnitClick, uiVolume);
}

ahJoin = joinUnits;
joinUnits = function()
{
  ahJoin.apply(joinUnits, arguments);

  if (isPlaying == false) return;

  stopMovementSound(movingUnit, false);
}

ahFog = updateAirUnitFogOnMove;
updateAirUnitFogOnMove = function()
{
  ahFog.apply(updateAirUnitFogOnMove, arguments);

  if (isPlaying == false) return;

  if (arguments[5] === "Add")
  {
    setTimeout(() => {
      if (movementSFX != null) { stopMovementSound(movingUnit, true); }
    }, arguments[6]);
  };
}

ahHide = hideUnit;
hideUnit = function()
{
  ahHide.apply(hideUnit, arguments);

  if (isPlaying == false) return;

  if (movementSFX != null) { stopMovementSound(arguments[0], false); };
}

ahLoad = actionHandlers.Load;
actionHandlers.Load = function()
{
  ahLoad.apply(actionHandlers.Load, arguments);

  if (isPlaying == false) return;

  playOneShot(actionLoadSFX, sfxVolume);
}

ahUnload = actionHandlers.Unload;
actionHandlers.Unload = function()
{
  ahUnload.apply(actionHandlers.Unload, arguments);

  if (isPlaying == false) return;

  playOneShot(actionUnloadSFX, sfxVolume);
}

ahCapt = actionHandlers.Capt;
actionHandlers.Capt = function()
{
  ahCapt.apply(actionHandlers.Capt, arguments);

  if (isPlaying == false) return;

  if ((arguments[0].newIncome != undefined || arguments[0].newIncome != null) && playerKeys.includes(myID))
  {
    if (arguments[0].buildingInfo.buildings_team != null && arguments[0].buildingInfo.buildings_team != myID)
    {
      playOneShot(actionCaptEnemySFX, sfxVolume);
    }
    else if (arguments[0].buildingInfo.buildings_team != null && arguments[0].buildingInfo.buildings_team == myID)
    {
      playOneShot(actionCaptAllySFX, sfxVolume);
    }
  }
  else if ((arguments[0].newIncome != undefined || arguments[0].newIncome != null) && !playerKeys.includes(myID))
  {
    if (arguments[0].buildingInfo.buildings_team != null) { playOneShot(actionCaptAllySFX, sfxVolume); };
  }
}

ahExplode = animExplosion;
animExplosion = function()
{
  ahExplode.apply(animExplosion, arguments);

  if (isPlaying == false) return;

  playOneShot(actionUnitExplode, sfxVolume);
}

ahSupply = actionHandlers.Supply;
actionHandlers.Supply = function()
{
  ahSupply.apply(actionHandlers.Supply, arguments);

  if (isPlaying == false) return;

  playOneShot(actionSupplyRepair, sfxVolume);
}

ahRepair = actionHandlers.Repair;
actionHandlers.Repair = function()
{
  ahRepair.apply(actionHandlers.Repair, arguments);

  if (isPlaying == false) return;

  playOneShot(actionSupplyRepair, sfxVolume);
}

ahBuild = actionHandlers.Build;
actionHandlers.Build = function()
{
  ahBuild.apply(actionHandlers.Build, arguments);

  if (isPlaying == false) return;

  if (!playerKeys.includes(myID))
  {
    playOneShot(actionSupplyRepair, sfxVolume);
  }
}

// Custom context menu
let contextMenu = document.createElement('div');
contextMenu.id = 'div-context-menu';
contextMenu.classList.add('cls-context-menu');
contextMenu.style.position = 'absolute';
contextMenu.style.height = '76px';
contextMenu.style.paddingTop = '0px';
contextMenu.style.paddingBottom = isMapEditor ? '0px' : '4px';
musicPlayerDiv.appendChild(contextMenu);

// Volume slider
const volumeSlider = document.createElement('input');
volumeSlider.id = "vol-slider";
volumeSlider.type = "range";
volumeSlider.max = "1";
volumeSlider.min = "0";
volumeSlider.step = "0.01";
volumeSlider.value = volume;

let volumeSliderFlexContainer = document.createElement('div');
volumeSliderFlexContainer.id = "vol-slider-flex-container";
volumeSliderFlexContainer.style.display = 'flex';
volumeSliderFlexContainer.style.flexDirection = 'row';
volumeSliderFlexContainer.style.marginBottom = '3.5px';
volumeSliderFlexContainer.style.alignItems = 'center';
volumeSliderFlexContainer.style.backgroundColor = '#F0F0F0';

let volumeSliderSpanDiv = document.createElement('div');
volumeSliderSpanDiv.id = "vol-slider-div";
volumeSliderSpanDiv.style.display = 'inline-block';
volumeSliderSpanDiv.style.width = '100%';
volumeSliderSpanDiv.style.textAlign = 'center';

let volumeSliderSpan = document.createElement('span');
volumeSliderSpan.id = "vol-slider-desc";
volumeSliderSpan.textContent = "Music Volume";
volumeSliderSpan.style.fontSize = "13px";

contextMenu.appendChild(volumeSliderFlexContainer);
volumeSliderFlexContainer.appendChild(volumeSliderSpanDiv);
volumeSliderSpanDiv.appendChild(volumeSliderSpan);
contextMenu.appendChild(volumeSlider);

// SFX Volume slider
const sfxVolumeSlider = document.createElement('input');
sfxVolumeSlider.id = "vol-sfx-slider";
sfxVolumeSlider.type = "range";
sfxVolumeSlider.max = "1";
sfxVolumeSlider.min = "0";
sfxVolumeSlider.step = "0.01";
sfxVolumeSlider.value = sfxVolume;

let sfxVolumeSliderFlexContainer = document.createElement('div');
sfxVolumeSliderFlexContainer.id = "vol-sfx-slider-flex-container";
sfxVolumeSliderFlexContainer.style.display = 'flex';
sfxVolumeSliderFlexContainer.style.flexDirection = 'row';
sfxVolumeSliderFlexContainer.style.marginBottom = '3.5px';
sfxVolumeSliderFlexContainer.style.marginTop = '3.5px';
sfxVolumeSliderFlexContainer.style.alignItems = 'center';

let sfxVolumeSliderSpanDiv = document.createElement('div');
sfxVolumeSliderSpanDiv.id = "vol-sfx-slider-div";
sfxVolumeSliderSpanDiv.style.display = 'inline-block';
sfxVolumeSliderSpanDiv.style.width = '100%';
sfxVolumeSliderSpanDiv.style.textAlign = 'center';

let sfxVolumeSliderSpan = document.createElement('span');
sfxVolumeSliderSpan.id = "vol-sfx-slider-desc";
sfxVolumeSliderSpan.textContent = "SFX Volume";
sfxVolumeSliderSpan.style.fontSize = "13px";

contextMenu.appendChild(sfxVolumeSliderFlexContainer);
sfxVolumeSliderFlexContainer.appendChild(sfxVolumeSliderSpanDiv);
sfxVolumeSliderSpanDiv.appendChild(sfxVolumeSliderSpan);
contextMenu.appendChild(sfxVolumeSlider);

// UI Volume slider
const uiVolumeSlider = document.createElement('input');
uiVolumeSlider.id = "vol-ui-slider";
uiVolumeSlider.type = "range";
uiVolumeSlider.max = "1";
uiVolumeSlider.min = "0";
uiVolumeSlider.step = "0.01";
uiVolumeSlider.value = uiVolume;

let uiVolumeSliderFlexContainer = document.createElement('div');
uiVolumeSliderFlexContainer.id = "vol-ui-slider-flex-container";
uiVolumeSliderFlexContainer.style.display = 'flex';
uiVolumeSliderFlexContainer.style.flexDirection = 'row';
uiVolumeSliderFlexContainer.style.marginBottom = '3.5px';
uiVolumeSliderFlexContainer.style.marginTop = '3.5px';
uiVolumeSliderFlexContainer.style.alignItems = 'center';

let uiVolumeSliderSpanDiv = document.createElement('div');
uiVolumeSliderSpanDiv.id = "vol-ui-slider-div";
uiVolumeSliderSpanDiv.style.display = 'inline-block';
uiVolumeSliderSpanDiv.style.width = '100%';
uiVolumeSliderSpanDiv.style.textAlign = 'center';

let uiVolumeSliderSpan = document.createElement('span');
uiVolumeSliderSpan.id = "vol-ui-slider-desc";
uiVolumeSliderSpan.textContent = "Interface Volume";
uiVolumeSliderSpan.style.fontSize = "13px";

contextMenu.appendChild(uiVolumeSliderFlexContainer);
uiVolumeSliderFlexContainer.appendChild(uiVolumeSliderSpanDiv);
uiVolumeSliderSpanDiv.appendChild(uiVolumeSliderSpan);
contextMenu.appendChild(uiVolumeSlider);

// Theme flex container
let themeFlexContainer = document.createElement('div');
themeFlexContainer.id = "theme-slider-flex-container";
themeFlexContainer.style.display = 'flex';
themeFlexContainer.style.flexDirection = 'row';
themeFlexContainer.style.marginTop = '5.5px';
themeFlexContainer.style.alignItems = 'center';
themeFlexContainer.style.backgroundColor = '#F0F0F0';

let themeSpanDiv = document.createElement('div');
themeSpanDiv.id = "theme-slider-div";
themeSpanDiv.style.display = 'inline-block';
themeSpanDiv.style.width = '100%';
themeSpanDiv.style.textAlign = 'center';

let themeSpan = document.createElement('span');
themeSpan.id = "theme-slider-desc";
themeSpan.textContent = "COP/SCOP Themes";
themeSpan.style.fontSize = "13px";

// Classic COP/SCOP slider
let themeSliderFlexContainer = document.createElement('div');
themeSliderFlexContainer.id = "classic-slider-flex-container";
themeSliderFlexContainer.style.display = 'flex';
themeSliderFlexContainer.style.flexDirection = 'row';
themeSliderFlexContainer.style.marginTop = '5.5px';
themeSliderFlexContainer.style.alignItems = 'center';
themeSliderFlexContainer.style.justifyContent = 'space-around';

let classicSliderSpanDiv = document.createElement('div');
classicSliderSpanDiv.id = "classic-slider-div";
classicSliderSpanDiv.style.display = 'flex';
classicSliderSpanDiv.style.width = 'auto';
classicSliderSpanDiv.style.textAlign = 'center';
classicSliderSpanDiv.style.flexDirection = 'column';
classicSliderSpanDiv.style.alignItems = 'center';

let classicSliderSpan = document.createElement('span');
classicSliderSpan.id = "classic-slider-desc";
classicSliderSpan.textContent = "Classic";
classicSliderSpan.style.fontSize = "11px";

// Ally COP/SCOP slider
// let allySliderFlexContainer = document.createElement('div');
// allySliderFlexContainer.id = "ally-slider-flex-container";
// allySliderFlexContainer.style.display = 'flex';
// allySliderFlexContainer.style.flexDirection = 'row';
// allySliderFlexContainer.style.marginTop = '3.5px';
// allySliderFlexContainer.style.alignItems = 'center';

let allySliderSpanDiv = document.createElement('div');
allySliderSpanDiv.id = "ally-slider-div";
allySliderSpanDiv.style.display = 'flex';
allySliderSpanDiv.style.width = 'auto';
allySliderSpanDiv.style.textAlign = 'center';
allySliderSpanDiv.style.flexDirection = 'column';
allySliderSpanDiv.style.alignItems = 'center';

let allySliderSpan = document.createElement('span');
allySliderSpan.id = "ally-slider-desc";
allySliderSpan.textContent = "Allies";
allySliderSpan.style.fontSize = "11px";

// Black Hole COP/SCOP slider
// let bhSliderFlexContainer = document.createElement('div');
// bhSliderFlexContainer.id = "bh-slider-flex-container";
// bhSliderFlexContainer.style.display = 'flex';
// bhSliderFlexContainer.style.flexDirection = 'row';
// bhSliderFlexContainer.style.marginTop = '3.5px';
// bhSliderFlexContainer.style.alignItems = 'center';

let bhSliderSpanDiv = document.createElement('div');
bhSliderSpanDiv.id = "bh-slider-div";
bhSliderSpanDiv.style.display = 'flex';
bhSliderSpanDiv.style.width = 'auto';
bhSliderSpanDiv.style.textAlign = 'center';
bhSliderSpanDiv.style.flexDirection = 'column';
bhSliderSpanDiv.style.alignItems = 'center';

let bhSliderSpan = document.createElement('span');
bhSliderSpan.id = "bh-slider-desc";
bhSliderSpan.textContent = "Enemies";
bhSliderSpan.style.fontSize = "11px";

// Radio buttons
var classicRadioBtn = document.createElement('input');
classicRadioBtn.id = "classic-radio-btn";
classicRadioBtn.classList.add('theme-radio-btn');
classicRadioBtn.type = "radio";

var allyRadioBtn = document.createElement('input');
allyRadioBtn.id = "ally-radio-btn";
allyRadioBtn.classList.add('theme-radio-btn');
allyRadioBtn.type = "radio";

var enemyRadioBtn = document.createElement('input');
enemyRadioBtn.id = "enemy-radio-btn";
enemyRadioBtn.classList.add('theme-radio-btn');
enemyRadioBtn.type = "radio";

contextMenu.appendChild(themeFlexContainer);
themeFlexContainer.appendChild(themeSpanDiv);
themeSpanDiv.appendChild(themeSpan);

contextMenu.appendChild(themeSliderFlexContainer);
themeSliderFlexContainer.appendChild(classicSliderSpanDiv);
classicSliderSpanDiv.appendChild(classicRadioBtn);
classicSliderSpanDiv.appendChild(classicSliderSpan);

themeSliderFlexContainer.appendChild(allySliderSpanDiv);
allySliderSpanDiv.appendChild(allyRadioBtn);
allySliderSpanDiv.appendChild(allySliderSpan);

themeSliderFlexContainer.appendChild(bhSliderSpanDiv);
bhSliderSpanDiv.appendChild(enemyRadioBtn);
bhSliderSpanDiv.appendChild(bhSliderSpan);

// CO Theme Options flex container
let coThemeOptionsFlexContainer = document.createElement('div');
coThemeOptionsFlexContainer.id = "co-theme-slider-flex-container";
coThemeOptionsFlexContainer.style.display = 'flex';
coThemeOptionsFlexContainer.style.flexDirection = 'row';
coThemeOptionsFlexContainer.style.marginTop = '5.5px';
coThemeOptionsFlexContainer.style.alignItems = 'center';
coThemeOptionsFlexContainer.style.backgroundColor = '#F0F0F0';

let coThemeOptionsSpanDiv = document.createElement('div');
coThemeOptionsSpanDiv.id = "co-theme-slider-div";
coThemeOptionsSpanDiv.style.display = 'inline-block';
coThemeOptionsSpanDiv.style.width = '100%';
coThemeOptionsSpanDiv.style.textAlign = 'center';

let coThemeOptionsSpan = document.createElement('span');
coThemeOptionsSpan.id = "theme-slider-desc";
coThemeOptionsSpan.textContent = "CO Themes";
coThemeOptionsSpan.style.fontSize = "13px";

contextMenu.appendChild(coThemeOptionsFlexContainer);
coThemeOptionsFlexContainer.appendChild(coThemeOptionsSpanDiv);
coThemeOptionsSpanDiv.appendChild(coThemeOptionsSpan);

// CO Theme Container
let coThemeFlexContainer = document.createElement('div');
coThemeFlexContainer.id = "co-theme-flex-container";
coThemeFlexContainer.style.display = 'flex';
coThemeFlexContainer.style.flexDirection = 'row';
coThemeFlexContainer.style.marginTop = '3.5px';
coThemeFlexContainer.style.alignItems = 'center';
coThemeFlexContainer.style.justifyContent = 'space-evenly';

let coThemeSpanDiv = document.createElement('div');
coThemeSpanDiv.id = "co-theme-div";
coThemeSpanDiv.style.display = 'flex';
coThemeSpanDiv.style.width = 'auto';
coThemeSpanDiv.style.textAlign = 'center';
coThemeSpanDiv.style.flexDirection = 'column';
coThemeSpanDiv.style.alignItems = 'center';

let coThemeSpan = document.createElement('span');
coThemeSpan.id = "co-theme-desc";
coThemeSpan.textContent = "Classic";
coThemeSpan.style.fontSize = "11px";

// CO Random Container

let coRandomSpanDiv = document.createElement('div');
coRandomSpanDiv.id = "co-random-div";
coRandomSpanDiv.style.display = 'flex';
coRandomSpanDiv.style.width = 'auto';
coRandomSpanDiv.style.textAlign = 'center';
coRandomSpanDiv.style.flexDirection = 'column';
coRandomSpanDiv.style.alignItems = 'center';

let coRandomSpan = document.createElement('span');
coRandomSpan.id = "co-random-desc";
coRandomSpan.textContent = "Random";
coRandomSpan.style.fontSize = "11px";

// Radio buttons
var coThemeRadioBtn = document.createElement('input');
coThemeRadioBtn.id = "co-theme-radio-btn";
coThemeRadioBtn.classList.add('theme-radio-btn');
coThemeRadioBtn.type = "radio";

var randomThemeRadioBtn = document.createElement('input');
randomThemeRadioBtn.id = "random-theme-radio-btn";
randomThemeRadioBtn.classList.add('theme-radio-btn');
randomThemeRadioBtn.type = "radio";

var shuffleButton = document.createElement("button");
shuffleButton.id = 'shuffle-button';
randomThemeRadioBtn.classList.add('shuffle-button-enabled');
shuffleButton.innerHTML = 'Shuffle';

shuffleButton.addEventListener ("click", function() {
  if (isPlaying && isRandomCOTheme)
  {
    stopTunes();
    playTunes();
  }
});

contextMenu.appendChild(coThemeFlexContainer);
coThemeFlexContainer.appendChild(coThemeSpanDiv);
coThemeSpanDiv.appendChild(coThemeRadioBtn);
coThemeSpanDiv.appendChild(coThemeSpan);

coThemeFlexContainer.appendChild(coRandomSpanDiv);
coRandomSpanDiv.appendChild(randomThemeRadioBtn);
coRandomSpanDiv.appendChild(coRandomSpan);

coThemeFlexContainer.appendChild(shuffleButton);

// RBC flex container
let rbcFlexContainer = document.createElement('div');
rbcFlexContainer.id = "rbc-flex-container";
rbcFlexContainer.style.display = 'flex';
rbcFlexContainer.style.flexDirection = 'row';
rbcFlexContainer.style.marginTop = '5.5px';
rbcFlexContainer.style.alignItems = 'center';
rbcFlexContainer.style.backgroundColor = '#F0F0F0';

let rbcSpanDiv = document.createElement('div');
rbcSpanDiv.id = "rbc-slider-div";
rbcSpanDiv.style.display = 'inline-block';
rbcSpanDiv.style.width = '100%';
rbcSpanDiv.style.textAlign = 'center';

let rbcSpan = document.createElement('span');
rbcSpan.id = "rbc-slider-desc";
rbcSpan.textContent = "Reboot Camp Themes";
rbcSpan.style.fontSize = "13px";

// RBC flex div
let rbcSliderFlexContainer = document.createElement('div');
rbcSliderFlexContainer.id = "rbc-on-slider-flex-container";
rbcSliderFlexContainer.style.display = 'flex';
rbcSliderFlexContainer.style.flexDirection = 'row';
rbcSliderFlexContainer.style.marginTop = '5.5px';
rbcSliderFlexContainer.style.alignItems = 'center';
rbcSliderFlexContainer.style.justifyContent = 'space-around';

// RBC on slider
let rbcOnSliderSpanDiv = document.createElement('div');
rbcOnSliderSpanDiv.id = "rbc-on-slider-div";
rbcOnSliderSpanDiv.style.display = 'flex';
rbcOnSliderSpanDiv.style.width = 'auto';
rbcOnSliderSpanDiv.style.textAlign = 'center';
rbcOnSliderSpanDiv.style.flexDirection = 'column';
rbcOnSliderSpanDiv.style.alignItems = 'center';

let rbcOnSliderSpan = document.createElement('span');
rbcOnSliderSpan.id = "rbc-on-slider-desc";
rbcOnSliderSpan.textContent = "On";
rbcOnSliderSpan.style.fontSize = "11px";

// RBC off slider
let rbcOffSliderSpanDiv = document.createElement('div');
rbcOffSliderSpanDiv.id = "rbc-off-slider-div";
rbcOffSliderSpanDiv.style.display = 'flex';
rbcOffSliderSpanDiv.style.width = 'auto';
rbcOffSliderSpanDiv.style.textAlign = 'center';
rbcOffSliderSpanDiv.style.flexDirection = 'column';
rbcOffSliderSpanDiv.style.alignItems = 'center';

let rbcOffSliderSpan = document.createElement('span');
rbcOffSliderSpan.id = "rbc-off-slider-desc";
rbcOffSliderSpan.textContent = "Off";
rbcOffSliderSpan.style.fontSize = "11px";

// Radio buttons
var rbcOnRadioBtn = document.createElement('input');
rbcOnRadioBtn.id = "rbc-on-radio-btn";
rbcOnRadioBtn.classList.add('theme-radio-btn');
rbcOnRadioBtn.type = "radio";

var rbcOffRadioBtn = document.createElement('input');
rbcOffRadioBtn.id = "rbc-off-radio-btn";
rbcOffRadioBtn.classList.add('theme-radio-btn');
rbcOffRadioBtn.type = "radio";

contextMenu.appendChild(rbcFlexContainer);
rbcFlexContainer.appendChild(rbcSpanDiv);
rbcSpanDiv.appendChild(rbcSpan);

contextMenu.appendChild(rbcSliderFlexContainer);
rbcSliderFlexContainer.appendChild(rbcOnSliderSpanDiv);
rbcOnSliderSpanDiv.appendChild(rbcOnRadioBtn);
rbcOnSliderSpanDiv.appendChild(rbcOnSliderSpan);

rbcSliderFlexContainer.appendChild(rbcOffSliderSpanDiv);
rbcOffSliderSpanDiv.appendChild(rbcOffRadioBtn);
rbcOffSliderSpanDiv.appendChild(rbcOffSliderSpan);

let versionDiv = document.createElement('div');
versionDiv.id = "version-number-div";
versionDiv.style.width = '100%';
versionDiv.style.marginTop = "5px";
versionDiv.style.backgroundColor = '#F0F0F0';

let versionSpan = document.createElement('span');
versionSpan.id = "version-number";
versionSpan.textContent = "VERSION: " + MY_VERSION + " / " + NEWEST_VERSION;
versionSpan.style.fontSize = "9px";
versionSpan.style.color = "#888888";

contextMenu.appendChild(versionDiv);
versionDiv.appendChild(versionSpan);

function getVersionNumber()
{
  fetch('https://greasyfork.org/en/scripts/459630-awbw-music-player').then(function (response) {
  	return response.text();
  }).then(function (html) {

  	var parser = new DOMParser();
  	var doc = parser.parseFromString(html, 'text/html');

  	var newestVersionNumber = doc.getElementsByClassName("script-show-version");
    NEWEST_VERSION = String(newestVersionNumber[1].firstChild.innerHTML);

    versionSpan.textContent = "VERSION: " + MY_VERSION + " / ";

    var myNum;
    var newNum;
    var outOfDate = false;

    if (Number(MY_VERSION.split(".")[0]) < Number(NEWEST_VERSION.split(".")[0]))
    {
      outOfDate = true;
    }
    else if (Number(MY_VERSION.split(".")[1]) < Number(NEWEST_VERSION.split(".")[1]))
    {
      outOfDate = true;
    }
    else if (Number(MY_VERSION.split(".")[2]) < Number(NEWEST_VERSION.split(".")[2]))
    {
      outOfDate = true;
    }

    // console.log(MY_VERSION);
    // console.log(NEWEST_VERSION);

    if (outOfDate)
    {
      console.log("Music Player version is out of date!");
      versionSpan.textContent = "";
      let versionText = "UPDATE TO " + NEWEST_VERSION;
      let link = document.createElement("a")
      let txt = document.createTextNode(versionText)
      link.appendChild(txt)
      link.title = versionText;
      link.id = "version-link";
      link.target = '_blank';
      link.href = "https://greasyfork.org/en/scripts/459630-awbw-music-player";
      let el = document.getElementById("version-number");
      el.appendChild(link)
    }
    else
    {
      versionSpan.textContent = "VERSION " + MY_VERSION;
    }

  }).catch(function (err) {
  	// There was an error
  	console.warn('Something went wrong.', err);
  });
}

function disableShuffle(bool)
{

  shuffleButton.disabled = bool;

  if (bool)
  {
    shuffleButton.classList.add('shuffle-button-disabled');
    shuffleButton.classList.remove('shuffle-button-enabled');
  }
  else
  {
    shuffleButton.classList.remove('shuffle-button-disabled');
    shuffleButton.classList.add('shuffle-button-enabled');
  }
}

// Volume control
let modifyVolume = function(val)
{
    volume = val.target.value;
    currentTheme.volume = volume;
    musicPlayerSettings["volume"] = volume;
    updateObjectInLocalStorage();
    // console.log("changing volume to: " + String(volume));
}
document.getElementById("vol-slider").addEventListener ("input", modifyVolume, false);

// SFX volume control
let modifySFXVolume = function(val)
{
    sfxVolume = val.target.value;
    currentSFX.volume = sfxVolume;
    musicPlayerSettings["sfx-volume"] = sfxVolume;
    updateObjectInLocalStorage();
    // console.log("changing volume to: " + String(volume));
}
document.getElementById("vol-sfx-slider").addEventListener ("input", modifySFXVolume, false);

// SFX volume control
let modifyUIVolume = function(val)
{
    uiVolume = val.target.value;
    currentUI.volume = uiVolume;
    musicPlayerSettings["ui-volume"] = uiVolume;
    updateObjectInLocalStorage();
    console.log("changing volume to: " + String(volume));
}
document.getElementById("vol-ui-slider").addEventListener ("input", modifyUIVolume, false);

// Toggle Classic COP/SCOP
let isClassicTheme = false;
let toggleClassicTheme = function(val)
{
  musicPlayerSettings["themeType"] = 1;
  updateObjectInLocalStorage();

  isClassicTheme = true;

  isAllyTheme = false;
  isEnemyTheme = false;

  allyRadioBtn.checked = false;
  enemyRadioBtn.checked = false;
}
document.getElementById("classic-radio-btn").addEventListener ("change", toggleClassicTheme, false);

// Toggle Ally COP/SCOP
let isAllyTheme = false;
let toggleAllyTheme = function(val)
{
  musicPlayerSettings["themeType"] = 2;
  updateObjectInLocalStorage();

  isAllyTheme = true;

  isClassicTheme = false;
  isEnemyTheme = false;

  classicRadioBtn.checked = false;
  enemyRadioBtn.checked = false;
}
document.getElementById("ally-radio-btn").addEventListener ("change", toggleAllyTheme, false);

// Toggle Enemy COP/SCOP
let isEnemyTheme = false;
let toggleEnemyTheme = function(val)
{
  musicPlayerSettings["themeType"] = 3;
  updateObjectInLocalStorage();

  isEnemyTheme = true;

  isClassicTheme = false;
  isAllyTheme = false;

  classicRadioBtn.checked = false;
  allyRadioBtn.checked = false;
}
document.getElementById("enemy-radio-btn").addEventListener ("change", toggleEnemyTheme, false);

// Toggle Classic CO Themes
let isClassicCOTheme = false;
let toggleClassicCOTheme = function(val)
{
  musicPlayerSettings["coThemeType"] = 1;
  updateObjectInLocalStorage();

  isClassicCOTheme = true;
  isRandomCOTheme = false;

  coThemeRadioBtn.checked = true;
  randomThemeRadioBtn.checked = false;

  currentTheme.loop = true;

  disableShuffle(true);

  if (isPlaying)
  {
    stopTunes();
    playTunes();
  }
}
document.getElementById("co-theme-radio-btn").addEventListener ("change", toggleClassicCOTheme, false);

// Toggle Random CO Themes
let isRandomCOTheme = false;
let toggleRandomCOTheme = function(val)
{
  musicPlayerSettings["coThemeType"] = 2;
  updateObjectInLocalStorage();

  isClassicCOTheme = false;
  isRandomCOTheme = true;

  coThemeRadioBtn.checked = false;
  randomThemeRadioBtn.checked = true;

  currentTheme.loop = false;

  disableShuffle(false);

  if (isPlaying)
  {
    stopTunes();
    playTunes();
  }
}
document.getElementById("random-theme-radio-btn").addEventListener ("change", toggleRandomCOTheme, false);

let rbcThemesOn = false;

// Toggle RBC On
let toggleRBCThemesOn = function(val)
{
  musicPlayerSettings["rbcThemesToggle"] = 1;
  updateObjectInLocalStorage();

  rbcThemesOn = true;

  rbcOffRadioBtn.checked = false;

  if (isPlaying)
  {
    stopTunes();
    playTunes();
  }
}
document.getElementById("rbc-on-radio-btn").addEventListener ("change", toggleRBCThemesOn, false);

// Toggle RBC off
let toggleRBCThemesOff = function(val)
{
  musicPlayerSettings["rbcThemesToggle"] = 2;
  updateObjectInLocalStorage();

  rbcThemesOn = false;

  rbcOnRadioBtn.checked = false;

  if (isPlaying)
  {
    stopTunes();
    playTunes();
  }
}
document.getElementById("rbc-off-radio-btn").addEventListener ("change", toggleRBCThemesOff, false);

// Tool-tip functions
let lastTooltipState = "";

let hoverClassicTheme = function()
{
  lastTooltipState = musicPlayerDivHoverSpan.innerText;
  musicPlayerDivHoverSpan.innerText = "Play CO-Specific COP/SCOP Themes";
}
document.getElementById("classic-radio-btn").addEventListener ("mouseover", hoverClassicTheme, false);

let hoverAllyTheme = function()
{
  lastTooltipState = musicPlayerDivHoverSpan.innerText;
  musicPlayerDivHoverSpan.innerText = "Only Play Macro Land COP/SCOP Themes";
}
document.getElementById("ally-radio-btn").addEventListener ("mouseover", hoverAllyTheme, false);

let hoverEnemyTheme = function()
{
  lastTooltipState = musicPlayerDivHoverSpan.innerText;
  musicPlayerDivHoverSpan.innerText = "Only Play Black Hole COP/SCOP Themes";
}
document.getElementById("enemy-radio-btn").addEventListener ("mouseover", hoverEnemyTheme, false);

let hoverCassicCOTheme = function()
{
  lastTooltipState = musicPlayerDivHoverSpan.innerText;
  musicPlayerDivHoverSpan.innerText = "Play Theme of Active CO";
}
document.getElementById("co-theme-radio-btn").addEventListener ("mouseover", hoverCassicCOTheme, false);

let hoverRandomOTheme = function()
{
  lastTooltipState = musicPlayerDivHoverSpan.innerText;
  musicPlayerDivHoverSpan.innerText = "Play Random CO Themes";
}
document.getElementById("random-theme-radio-btn").addEventListener ("mouseover", hoverRandomOTheme, false);

let hoverRBCThemesOn = function()
{
  lastTooltipState = musicPlayerDivHoverSpan.innerText;
  musicPlayerDivHoverSpan.innerText = "Enable RBC Themes for COs";
}
document.getElementById("rbc-on-radio-btn").addEventListener ("mouseover", hoverRBCThemesOn, false);

let hoverRBCThemesOff = function()
{
  lastTooltipState = musicPlayerDivHoverSpan.innerText;
  musicPlayerDivHoverSpan.innerText = "Disable RBC Themes for COs";
}
document.getElementById("rbc-off-radio-btn").addEventListener ("mouseover", hoverRBCThemesOff, false);

let hoverOut = function()
{
  musicPlayerDivHoverSpan.innerText = lastTooltipState;
}
document.getElementById("classic-radio-btn").addEventListener ("mouseout", hoverOut, false);
document.getElementById("ally-radio-btn").addEventListener ("mouseout", hoverOut, false);
document.getElementById("enemy-radio-btn").addEventListener ("mouseout", hoverOut, false);
document.getElementById("co-theme-radio-btn").addEventListener ("mouseout", hoverOut, false);
document.getElementById("random-theme-radio-btn").addEventListener ("mouseout", hoverOut, false);
document.getElementById("rbc-on-radio-btn").addEventListener ("mouseout", hoverOut, false);
document.getElementById("rbc-off-radio-btn").addEventListener ("mouseout", hoverOut, false);

function setVolume()
{
    let s = String(volume);
    volumeSlider.value = s;
    currentTheme.volume = volume;

    let ssfx = String(sfxVolume);
    sfxVolumeSlider.value = ssfx;
    currentSFX.volume = sfxVolume;

    let sui = String(uiVolume);
    uiVolumeSlider.value = sui;
    currentUI.volume = uiVolume;
}

function setDefaultThemeMode()
{
  if (musicPlayerSettings["themeType"] == null)
  {
    musicPlayerSettings["themeType"] = 1;

    isClassicTheme = true;
    isAllyTheme = false;
    isEnemyTheme = false;
    classicRadioBtn.checked = true;
    allyRadioBtn.checked = false;
    enemyRadioBtn.checked = false;

    isClassicCOTheme = true;
    isRandomCOTheme = false;
    coThemeRadioBtn.checked = true;
    randomThemeRadioBtn.checked = false;

    rbcThemesOn = false
    rbcOnRadioBtn.checked = false;
    rbcOffRadioBtn.checked = true;

    disableShuffle(true);
  }
}

function setThemeMode()
{
  if (musicPlayerSettings["themeType"] != undefined && musicPlayerSettings["themeType"] == 1)
  {
    isClassicTheme = true;
    isAllyTheme = false;
    isEnemyTheme = false;
    classicRadioBtn.checked = true;
    allyRadioBtn.checked = false;
    enemyRadioBtn.checked = false;
  }
  else if (musicPlayerSettings["themeType"] != undefined && musicPlayerSettings["themeType"] == 2)
  {
    isClassicTheme = false;
    isAllyTheme = true;
    isEnemyTheme = false;
    classicRadioBtn.checked = false;
    allyRadioBtn.checked = true;
    enemyRadioBtn.checked = false;
  }
  else if (musicPlayerSettings["themeType"] != undefined && musicPlayerSettings["themeType"] == 3)
  {
    isClassicTheme = false;
    isAllyTheme = false;
    isEnemyTheme = true;
    classicRadioBtn.checked = false;
    allyRadioBtn.checked = false;
    enemyRadioBtn.checked = true;
  }
  else
  {
    isClassicTheme = true;
    isAllyTheme = false;
    isEnemyTheme = false;
    classicRadioBtn.checked = true;
    allyRadioBtn.checked = false;
    enemyRadioBtn.checked = false;
  }
}

function setCOThemeMode()
{
  if (musicPlayerSettings["coThemeType"] != undefined && musicPlayerSettings["coThemeType"] == 1)
  {
    isClassicCOTheme = true;
    isRandomCOTheme = false;
    coThemeRadioBtn.checked = true;
    randomThemeRadioBtn.checked = false;
    disableShuffle(true);
  }
  else if (musicPlayerSettings["coThemeType"] != undefined && musicPlayerSettings["coThemeType"] == 2)
  {
    isClassicCOTheme = false;
    isRandomCOTheme = true;
    coThemeRadioBtn.checked = false;
    randomThemeRadioBtn.checked = true;
    disableShuffle(false);
  }
  else
  {
    isClassicCOTheme = true;
    isRandomCOTheme = false;
    coThemeRadioBtn.checked = true;
    randomThemeRadioBtn.checked = false;
    disableShuffle(true);
  }
}

function setRBCThemeMode()
{
  if (musicPlayerSettings["rbcThemesToggle"] != undefined && musicPlayerSettings["rbcThemesToggle"] == 1)
  {
    rbcThemesOn = true;
    rbcOnRadioBtn.checked = true;
    rbcOffRadioBtn.checked = false;
  }
  else if (musicPlayerSettings["rbcThemesToggle"] != undefined && musicPlayerSettings["rbcThemesToggle"] == 2)
  {
    rbcThemesOn = false;
    rbcOnRadioBtn.checked = false;
    rbcOffRadioBtn.checked = true;
  }
}

on(document, "click", function(e)
{
  if (e.target.id == "div-context-menu" ||
      e.target.id == "vol-slider" ||
      e.target.id == "vol-sfx-slider" ||
      e.target.id == "vol-ui-slider" ||
      e.target.id == "bh-slider-div" ||
      e.target.id == "ally-slider-div" ||
      e.target.id == "classic-slider-div" ||
      e.target.id == "classic-radio-btn" ||
      e.target.id == "ally-radio-btn" ||
      e.target.id == "enemy-radio-btn" ||
      e.target.id == "co-theme-radio-btn" ||
      e.target.id == "random-theme-radio-btn" ||
      e.target.id == "co-theme-div" ||
      e.target.id == "co-random-div" ||
      e.target.id == "shuffle-button" ||
      e.target.id == "rbc-on-radio-btn" ||
      e.target.id == "rbc-off-radio-btn" ||
      e.target.id == "rbc-on-slider-flex-container") return;
contextMenu.style.display = 'none';
});

let contextMenuOpen = false;
document.getElementById('music-player-parent').oncontextmenu = function(e){
   let elmnt = e.target
   if (elmnt.id.startsWith ("music-player")) {
      e.preventDefault();
      let eid = elmnt.id.replace(/link-/,"");
      contextMenu.style.height = '347px';
      contextMenu.style.width = '175px';
      contextMenu.style.top = '37px';
      contextMenu.style.display = 'block';
      let toRepl = "to=" + eid.toString();
      setVolume();
      contextMenuOpen = true;
   }
}

// Store settings in local storage
function loadSettings()
{
    if (window.localStorage.getItem('musicPlayerSettings') != null)
    {
        musicPlayerSettings = JSON.parse(window.localStorage.getItem('musicPlayerSettings'));

        if (musicPlayerSettings["volume"] != undefined) { volume = musicPlayerSettings["volume"]; }
        if (musicPlayerSettings["sfx-volume"] != undefined) { sfxVolume = musicPlayerSettings["sfx-volume"]; };
        if (musicPlayerSettings["ui-volume"] != undefined) { uiVolume = musicPlayerSettings["ui-volume"]; };
        setVolume();
        setThemeMode();
        setCOThemeMode();
        setRBCThemeMode();

        musicPlayerSettings["is-playing"] = false;

        updateObjectInLocalStorage();
    }
    else
    {
        initializeMusicPlayerSettings();
    }
}

function initializeMusicPlayerSettings()
{
    addObjectToLocalStorage();
}

function addObjectToLocalStorage()
{
    localStorage.setItem('musicPlayerSettings', JSON.stringify(musicPlayerSettings));
}

function updateObjectInLocalStorage()
{
    localStorage.removeItem(musicPlayerSettings);
    localStorage.setItem('musicPlayerSettings', JSON.stringify(musicPlayerSettings));
}

function resetSettings()
{
  localStorage.removeItem(musicPlayerSettings);
}

// Custom styling for context menu
let styles = `
    // Context Menu
    .cls-context-menu-link {
        display:block;
        padding:20px;
        background:#ECECEC;
    }

    .cls-context-menu {
        position:absolute;
        display:none;
        width: 175px;
        height: 347px;
        padding-top: 4px;
    }

    .cls-context-menu ul, #context-menu li {
        list-style:none;
        margin:0; padding:0;
        background:white;
    }

    .cls-context-menu { border: 1px solid #888888 !important;}
    .cls-context-menu li { border: 1px solid #888888; }
    .cls-context-menu li:last-child { border:none; }
    .cls-context-menu li a {
        display:block;
        padding:5px 10px;
        text-decoration:none;
        color:blue;
    }
    .cls-context-menu li a:hover {
        background:blue;
        color:#FFF;
    }

    // Input Range
    :root {
      --shadow-len: -60px;
    }
    input[type="range"] {
        margin: auto;
        -webkit-appearance: none;
        position: relative;
        overflow: hidden;
        height: 25px;
        cursor: pointer;
        border-radius: 0; /* iOS */
    }

    ::-webkit-slider-runnable-track {
        background: #ddd;
    }

    /*
     * 1. Set to 0 width and remove border for a slider without a thumb
     * 2. Shadow is negative the full width of the input and has a spread
     *    of the width of the input.
     */
    ::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px; /* 1 */
        height: 25px;
        background: #fff;
        box-shadow: -200px 0 0 200px #0066CC; /* 2 */
        border: 2px solid #888888; /* 1 */
        clip-path: inset(0px 0px 0px let(--shadow-len));
    }

    ::-moz-range-track {
        height: 25px;
        background: #888888;
    }

    ::-moz-range-thumb {
        background: #fff;
        height: 25px;
        width: 20px;
        border: 3px solid #888888;
        border-radius: 0 !important;
        box-shadow: -200px 0 0 200px #0066CC;
        box-sizing: border-box;
        clip-path: inset(0px 0px 0px let(--shadow-len));
    }

    ::-ms-fill-lower {
        background: #0066CC;
    }

    ::-ms-thumb {
        background: #fff;
        border: 3px solid #999;
        height: 25px;
        width: 20px;
        box-sizing: border-box;
    }

    ::-ms-ticks-after {
        display: none;
    }

    ::-ms-ticks-before {
        display: none;
    }

    ::-ms-track {
        background: #888888;
        color: transparent;
        height: 25px;
        border: none;
    }

    ::-ms-tooltip {
        display: none;
    }

    .theme-radio-btn {
      height: 14px;
      width: 14px;
    }

    .theme-radio-btn:hover {
      cursor: pointer;
    }

    #shuffle-button {
      font-family: "Nova Square", cursive;
      line-height: 25px;
    }

    .shuffle-button-enabled {
      color: white;
      background: #0066CC;
      border: 2px solid #0066CC;
    }

    .shuffle-button-enabled:hover {
      cursor: pointer;
    }

    .shuffle-button-enabled:active {
      color: black;
      background: white;
      border: 2px solid #888888;
    }

    .shuffle-button-disabled {
      color: white;
      background: #888888;
      border: 2px solid #888888;
    }

    .blob {
      animation: shine 1.5s ease-in-out  infinite;
      animation-fill-mode: forwards;
      animation-direction: alternate;
    }

    #version-link {
      color: #0066CC;
      font-weight: bold;
      text-decoration: underline;
    }
}
`

let styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet);

getPlayerInfo();
preloadThemes();
setDefaultThemeMode();
loadSettings();
getVersionNumber();