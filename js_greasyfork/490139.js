// ==UserScript==
// @name         trumpet
// @description  Fixed for 0.47.2! Advanced, Open Source, No Ads. Best cheats menu for Shell Shockers in 2024. Many modules such as Aimbot, PlayerESP, AmmoESP, Chams, Nametags, Join/Leave messages, Chat Filter Disabling, AntiAFK, FOV Slider, Zooming, Co-ords, Player Stats, Auto Refill and many more whilst having unsurpassed customisation options such as binding to any key, easily editable colour scheme and themes - all on the fly!
// @author       Hydroflame521, onlypuppy7, enbyte and notfood
// @namespace    http://github.com/Hydroflame522/StateFarmClient/
// @supportURL   http://github.com/Hydroflame522/StateFarmClient/issues/
// @license      GPL-3.0
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_info
// @grant        GM_setClipboard
// @icon         https://i.imgur.com/uqavChF.jpeg

// @require      https://cdn.jsdelivr.net/npm/tweakpane@3.1.10/dist/tweakpane.min.js
// @require      https://cdn.jsdelivr.net/npm/@tweakpane/plugin-essentials@0.1.8/dist/tweakpane-plugin-essentials.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js

// version naming:
    //3.#.#-pre[number] for development versions, increment for every commit (not full release)
    //3.#.#-release for release
//this ensures that each version of the script is counted as different

// @version      3.4.0-pre58

// @match        *://*.shellshock.io/*
// @match        *://*.shell.onlypuppy7.online/*
// @match        *://*.algebra.best/*
// @match        *://*.algebra.vip/*
// @match        *://*.biologyclass.club/*
// @match        *://*.deadlyegg.com/*
// @match        *://*.deathegg.world/*
// @match        *://*.eggboy.club/*
// @match        *://*.eggboy.xyz/*
// @match        *://*.eggcombat.com/*
// @match        *://*.egg.dance/*
// @match        *://*.eggfacts.fun/*
// @match        *://*.egghead.institute/*
// @match        *://*.eggisthenewblack.com/*
// @match        *://*.eggsarecool.com/*
// @match        *://*.geometry.best/*
// @match        *://*.geometry.monster/*
// @match        *://*.geometry.pw/*
// @match        *://*.geometry.report/*
// @match        *://*.hardboiled.life/*
// @match        *://*.hardshell.life/*
// @match        *://*.humanorganising.org/*
// @match        *://*.mathactivity.xyz/*
// @match        *://*.mathactivity.club/*
// @match        *://*.mathdrills.info/*
// @match        *://*.mathdrills.life/*
// @match        *://*.mathfun.rocks/*
// @match        *://*.mathgames.world/*
// @match        *://*.math.international/*
// @match        *://*.mathlete.fun/*
// @match        *://*.mathlete.pro/*
// @match        *://*.overeasy.club/*
// @match        *://*.scrambled.tech/*
// @match        *://*.scrambled.today/*
// @match        *://*.scrambled.us/*
// @match        *://*.scrambled.world/*
// @match        *://*.shellshockers.club/*
// @match        *://*.shellshockers.life/*
// @match        *://*.shellshockers.site/*
// @match        *://*.shellshockers.us/*
// @match        *://*.shellshockers.world/*
// @match        *://*.shellshockers.xyz/*
// @match        *://*.shellsocks.com/*
// @match        *://*.softboiled.club/*
// @match        *://*.urbanegger.com/*
// @match        *://*.violentegg.club/*
// @match        *://*.violentegg.fun/*
// @match        *://*.yolk.best/*
// @match        *://*.yolk.life/*
// @match        *://*.yolk.rocks/*
// @match        *://*.yolk.tech/*
// @match        *://*.yolk.quest/*
// @match        *://*.yolk.today/*
// @match        *://*.zygote.cafe/*
// @match        *://*.shellshockers.best/*
// @match        *://*.eggboy.me/*
// @downloadURL https://update.greasyfork.org/scripts/490139/trumpet.user.js
// @updateURL https://update.greasyfork.org/scripts/490139/trumpet.meta.js
// ==/UserScript==

// {{CRACKEDSHELL}}
// require:"https://cdn.jsdelivr.net/npm/tweakpane@3.1.10/dist/tweakpane.min.js"
// require:"https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
// require:"https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js"
// {{!CRACKEDSHELL}}

let attemptedInjection = false;
console.log("StateFarm: running (before function)");

(function () {

    let originalReplace = String.prototype.replace;
    let originalReplaceAll = String.prototype.replaceAll;

    String.prototype.originalReplace = function() {
        return originalReplace.apply(this, arguments);
    };
    String.prototype.originalReplaceAll = function() {
        return originalReplaceAll.apply(this, arguments);
    };

    console.log("StateFarm: running (after function)");
    //script info
    const name="trumpet";
    const version = typeof(GM_info) !== 'undefined' ? GM_info.script.version : "3";
    const menuTitle=name + " v" + version;
    //INIT WEBSITE LINKS: store them here so they are easy to maintain and update!
    const discordURL = "https://discord.gg/Vf5qtxAmvU";
    const githubURL = "https://github.com/Hydroflame522/StateFarmClient";
    const featuresGuideURL = "https://github.com/Hydroflame522/StateFarmClient/tree/main?tab=readme-ov-file#-features";
    const bottingGuideURL = "https://github.com/Hydroflame522/StateFarmClient/tree/main?tab=readme-ov-file#-botting";
    const replacementLogoURL = "https://i.imgur.com/uqavChF.jpeg";
    const babylonURL = "https://cdn.jsdelivr.net/npm/babylonjs@3.3.0/babylon.min.js";
    const sfxURL = "https://api.github.com/repos/Hydroflame522/StateFarmClient/contents/soundpacks/sfx";
    const iconURL = "https://i.imgur.com/uqavChF.jpeg";
    //startup sequence
    const startUp=function () {
        console.log("StateFarm: detectURLParams()");
        detectURLParams();
        console.log("StateFarm: mainLoop()");
        mainLoop();
        console.log("StateFarm: injectScript()");
        injectScript();
        document.addEventListener("DOMContentLoaded", function () {
            console.log("StateFarm: DOMContentLoaded, fetching sfx");
            fetch(sfxURL)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch folder contents');
                };
            })
            .then(data => {
                data.forEach((file, index) => {
                    retrievedSFX.push({text: file.name.replace(".zip",""), value: JSON.stringify(file.download_url)})
                });
                onContentLoaded();
            })
            .catch(error => {
                console.error('Error:', error);
                onContentLoaded();
            });
        });
    };
    //INIT VARS
    const inbuiltPresets = { //Don't delete onlypuppy7's Config
        "onlypuppy7's Config": `aimbot>true<aimbotTargetMode>0<aimbotVisibilityMode>0<aimbotRightClick>true<silentAimbot>false<noWallTrack>true<prediction>true<antiBloom>true<antiSwitch>true<oneKill>true<aimbotMinAngle>30<aimbotAntiSnap>0.77<antiSneak>1.8<aimbotColor>"#0000ff"<autoRefill>true<smartRefill>true<enableAutoFire>true<autoFireType>0<grenadeMax>true<playerESP>true<tracers>true<chams>false<nametags>true<targets>true<tracersType>0<tracersColor1>"#ff0000"<tracersColor2>"#00ff00"<tracersColor3>"#ffffff"<tracersColor1to2>5<tracersColor2to3>15<ammoESP>true<ammoTracers>false<ammoESPRegime>1<ammoESPColor>"#ffff00"<grenadeESP>true<grenadeTracers>false<grenadeESPRegime>0<grenadeESPColor>"#00ffff"<fov>120<zoom>15<freecam>false<wireframe>false<eggSize>1<setDetail>0<enableTextures>true<renderDelay>0<revealBloom>true<showLOS>true<showMinAngle>false<highlightLeaderboard>false<showCoordinates>true<radar>false<playerStats>true<playerInfo>true<gameInfo>true<showStreams>true<chatExtend>true<chatHighlight>false<maxChat>10<disableChatFilter>true<chatFilterBypass>false<tallChat>false<antiAFK>true<spamChat>false<spamChatDelay>500<spamChatText>"dsc.gg/sfnetwork: ЅtateFarm Client v3.4.0-pre19 On Top! "<mockMode>false<announcer>false<autoEZ>false<cheatAccuse>false<joinMessages>true<leaveMessages>true<publicBroadcast>false<joinLeaveBranding>false<whitelist>"User-1, User-2"<enableWhitelistAimbot>false<enableWhitelistTracers>false<whitelistESPType>0<whitelistColor>"#e80aac"<blacklist>"User-1, User-2"<enableBlacklistAimbot>false<enableBlacklistTracers>false<blacklistESPType>0<blacklistColor>"#00ff00"<bunnyhop>true<autoWalk>false<autoStrafe>false<autoJump>false<autoJumpDelay>1<autoWeapon>0<autoGrenade>false<autoJoin>false<joinCode>"CODE"<useCustomName>false<usernameAutoJoin>"ЅtateFarmer"<autoRespawn>false<autoTeam>0<gameBlacklist>false<gameBlacklistCodes>""<leaveEmpty>false<autoLeave>false<autoLeaveDelay>300<autoGamemode>0<autoRegion>0<eggColour>0<autoStamp>0<autoHat>0<muteGame>false<distanceMult>1<customSFX>0<adBlock>true<spoofVIP>false<unlockSkins>false<adminSpoof>false<autoUnban>true<silentRoll>false<enableSeizureX>false<amountSeizureX>2<enableSeizureY>false<amountSeizureY>2<popups>true<replaceLogo>true<titleAnimation>true<themeType>5<enablePanic>false<panicURL>"https://classroom.google.com/"<selectedPreset>0<debug>false`,
        "onlypuppy7's Silent Config": `aimbot>true<aimbotTargetMode>1<aimbotVisibilityMode>1<aimbotRightClick>true<silentAimbot>true<noWallTrack>false<prediction>true<antiBloom>true<antiSwitch>false<oneKill>false<aimbotMinAngle>360<aimbotAntiSnap>0.77<antiSneak>1.8<aimbotColor>"#0000ff"<autoRefill>true<smartRefill>true<enableAutoFire>true<autoFireType>3<grenadeMax>true<playerESP>true<tracers>true<chams>false<nametags>true<targets>true<tracersType>0<tracersColor1>"#ff0000"<tracersColor2>"#00ff00"<tracersColor3>"#ffffff"<tracersColor1to2>5<tracersColor2to3>15<ammoESP>true<ammoTracers>false<ammoESPRegime>1<ammoESPColor>"#ffff00"<grenadeESP>true<grenadeTracers>false<grenadeESPRegime>0<grenadeESPColor>"#00ffff"<fov>120<zoom>15<freecam>false<wireframe>false<eggSize>1<setDetail>0<enableTextures>true<renderDelay>0<revealBloom>true<showLOS>true<showMinAngle>false<highlightLeaderboard>false<showCoordinates>true<radar>false<playerStats>true<playerInfo>true<gameInfo>true<showStreams>true<chatExtend>true<chatHighlight>false<maxChat>10<disableChatFilter>true<chatFilterBypass>false<tallChat>false<antiAFK>true<spamChat>false<spamChatDelay>500<spamChatText>"dsc.gg/sfnetwork: ЅtateFarm Client v3.4.0-pre19 On Top! "<mockMode>false<announcer>false<autoEZ>false<cheatAccuse>false<joinMessages>true<leaveMessages>true<publicBroadcast>false<joinLeaveBranding>false<whitelist>"User-1, User-2"<enableWhitelistAimbot>false<enableWhitelistTracers>false<whitelistESPType>0<whitelistColor>"#e80aac"<blacklist>"User-1, User-2"<enableBlacklistAimbot>false<enableBlacklistTracers>false<blacklistESPType>0<blacklistColor>"#00ff00"<bunnyhop>true<autoWalk>false<autoStrafe>false<autoJump>false<autoJumpDelay>1<autoWeapon>0<autoGrenade>false<autoJoin>false<joinCode>"CODE"<useCustomName>false<usernameAutoJoin>"ЅtateFarmer"<autoRespawn>false<autoTeam>0<gameBlacklist>false<gameBlacklistCodes>""<leaveEmpty>false<autoLeave>false<autoLeaveDelay>300<autoGamemode>0<autoRegion>0<eggColour>0<autoStamp>0<autoHat>0<muteGame>false<distanceMult>1<customSFX>0<adBlock>true<spoofVIP>false<unlockSkins>false<adminSpoof>false<autoUnban>true<silentRoll>false<enableSeizureX>false<amountSeizureX>2<enableSeizureY>false<amountSeizureY>2<popups>true<replaceLogo>true<titleAnimation>true<themeType>5<enablePanic>false<panicURL>"https://classroom.google.com/"<selectedPreset>0<debug>false`,
        "Server Hopper + Non-Silent": `aimbot>true<aimbotTargetMode>0<aimbotVisibilityMode>0<aimbotRightClick>true<silentAimbot>false<noWallTrack>true<prediction>true<antiBloom>true<antiSwitch>true<oneKill>true<aimbotMinAngle>30<aimbotAntiSnap>0.77<antiSneak>1.8<aimbotColor>"#0000ff"<autoRefill>true<smartRefill>true<enableAutoFire>true<autoFireType>0<grenadeMax>true<playerESP>true<tracers>true<chams>false<nametags>true<targets>true<tracersType>0<tracersColor1>"#ff0000"<tracersColor2>"#00ff00"<tracersColor3>"#ffffff"<tracersColor1to2>5<tracersColor2to3>15<ammoESP>true<ammoTracers>false<ammoESPRegime>1<ammoESPColor>"#ffff00"<grenadeESP>true<grenadeTracers>false<grenadeESPRegime>0<grenadeESPColor>"#00ffff"<fov>120<zoom>15<freecam>false<wireframe>false<eggSize>1<setDetail>0<enableTextures>true<renderDelay>0<revealBloom>true<showLOS>true<showMinAngle>false<highlightLeaderboard>false<showCoordinates>true<radar>false<playerStats>true<playerInfo>true<gameInfo>true<showStreams>true<chatExtend>true<chatHighlight>false<maxChat>10<disableChatFilter>true<chatFilterBypass>false<tallChat>false<antiAFK>true<spamChat>false<spamChatDelay>1440<spamChatText>"Live now at twitch.tv/ЅtateFarmNetwork! "<mockMode>false<announcer>false<autoEZ>false<cheatAccuse>false<joinMessages>true<leaveMessages>true<publicBroadcast>false<joinLeaveBranding>false<whitelist>"User-1, User-2"<enableWhitelistAimbot>false<enableWhitelistTracers>false<whitelistESPType>0<whitelistColor>"#e80aac"<blacklist>"User-1, User-2"<enableBlacklistAimbot>false<enableBlacklistTracers>false<blacklistESPType>0<blacklistColor>"#00ff00"<bunnyhop>true<autoWalk>false<autoStrafe>false<autoJump>false<autoJumpDelay>1<autoWeapon>0<autoGrenade>false<autoJoin>false<joinCode>"CODE"<useCustomName>false<usernameAutoJoin>"CaptainShell74"<autoRespawn>false<autoTeam>0<gameBlacklist>false<gameBlacklistCodes>""<leaveEmpty>false<autoLeave>true<autoLeaveDelay>240<autoGamemode>0<autoRegion>0<eggColour>0<autoStamp>0<autoHat>0<muteGame>false<distanceMult>0.59<customSFX>0<adBlock>true<spoofVIP>false<unlockSkins>false<adminSpoof>false<autoUnban>true<silentRoll>false<enableSeizureX>false<amountSeizureX>2<enableSeizureY>false<amountSeizureY>0.04772456526919999<popups>true<replaceLogo>true<titleAnimation>true<themeType>2<enablePanic>false<panicURL>"https://classroom.google.com/"<selectedPreset>0<debug>false`,
        "Server Hopper + Silent": `aimbot>true<aimbotTargetMode>1<aimbotVisibilityMode>1<aimbotRightClick>true<silentAimbot>true<noWallTrack>false<prediction>true<antiBloom>true<antiSwitch>false<oneKill>false<aimbotMinAngle>360<aimbotAntiSnap>0.77<antiSneak>1.8<aimbotColor>"#0000ff"<autoRefill>true<smartRefill>true<enableAutoFire>true<autoFireType>3<grenadeMax>true<playerESP>true<tracers>true<chams>false<nametags>true<targets>true<tracersType>0<tracersColor1>"#ff0000"<tracersColor2>"#00ff00"<tracersColor3>"#ffffff"<tracersColor1to2>5<tracersColor2to3>15<ammoESP>true<ammoTracers>false<ammoESPRegime>1<ammoESPColor>"#ffff00"<grenadeESP>true<grenadeTracers>false<grenadeESPRegime>0<grenadeESPColor>"#00ffff"<fov>120<zoom>15<freecam>false<wireframe>false<eggSize>1<setDetail>0<enableTextures>true<renderDelay>0<revealBloom>true<showLOS>true<showMinAngle>false<highlightLeaderboard>false<showCoordinates>true<radar>false<playerStats>true<playerInfo>true<gameInfo>true<showStreams>true<chatExtend>true<chatHighlight>false<maxChat>10<disableChatFilter>true<chatFilterBypass>false<tallChat>false<antiAFK>true<spamChat>false<spamChatDelay>1440<spamChatText>"Live now at twitch.tv/ЅtateFarmNetwork! "<mockMode>false<announcer>false<autoEZ>false<cheatAccuse>false<joinMessages>true<leaveMessages>true<publicBroadcast>false<joinLeaveBranding>false<whitelist>"User-1, User-2"<enableWhitelistAimbot>false<enableWhitelistTracers>false<whitelistESPType>0<whitelistColor>"#e80aac"<blacklist>"User-1, User-2"<enableBlacklistAimbot>false<enableBlacklistTracers>false<blacklistESPType>0<blacklistColor>"#00ff00"<bunnyhop>true<autoWalk>false<autoStrafe>false<autoJump>false<autoJumpDelay>1<autoWeapon>0<autoGrenade>false<autoJoin>false<joinCode>"CODE"<useCustomName>false<usernameAutoJoin>"CaptainShell74"<autoRespawn>false<autoTeam>0<gameBlacklist>false<gameBlacklistCodes>""<leaveEmpty>false<autoLeave>true<autoLeaveDelay>240<autoGamemode>0<autoRegion>0<eggColour>0<autoStamp>0<autoHat>0<muteGame>false<distanceMult>0.59<customSFX>true<adBlock>true<spoofVIP>false<unlockSkins>false<adminSpoof>false<autoUnban>true<silentRoll>false<enableSeizureX>false<amountSeizureX>2<enableSeizureY>false<amountSeizureY>0.04772456526919999<popups>true<replaceLogo>true<titleAnimation>true<themeType>2<enablePanic>false<panicURL>"https://classroom.google.com/"<selectedPreset>0<debug>false`,
    };
    const presetStorageLocation = "StateFarmUserPresets";
    let hudElementPositions = {};
    let blacklistedGameCodes = [];
    const storageKey = "StateFarm_"+(unsafeWindow.document.location.host.replaceAll(".",""))+"_";
    console.log("Save key:",storageKey);
    let binding=false;
    let previousFrame=0;
    let lastSpamMessage=[0,""];
    let startTime = Date.now();
    let lastAutoJump=0;
    let lastAntiAFKMessage=0;
    let spamMessageCount=0;
    let currentFrameIndex = 0;
    let deciSecondsPassed = 0;
    let timeJoinedGame = 0;
    let lastSentMessage="";
    let spamDelay=0;
    let URLParams="";
    let retrievedSFX = [{text: "Default", value: "default"}];
    let soundsSFC = {};
    let targetingComplete=false;
    let username = "";
    let autoStrafeValue=[0,0,"left"];
    let TEAMCOLORS = ["#fed838","#40e0ff","#ffc0a0"];
    let autoLeaveReminder = 9999;
    const allModules=[];
    const allFolders=[];
    const F=[];
    const createAudioContext = function () {return new (window.AudioContext || window.webkitAudioContext)()};
    const audioContexts = {
        "BGM": createAudioContext(),
        "KOTC": createAudioContext(),
        "OTHER": createAudioContext(),
        "SOUNDS": createAudioContext(),
    };
    const divertContexts = {
        "KOTC": ["kotc_capture", "kotc_capturing_opponents", "kotc_capturing_player", "kotc_contested", "kotc_pointscore", "kotc_roundend", "kotc_zonespawn"],
    };
    const L={};
    const functionNames=[];
    const isKeyToggled={};
    let ESPArray=[];
    let onlinePlayersArray=[];
    let bindsArray={};
    let H={}; // obfuscated shit lol
    const tp={}; // <-- tp = tweakpane
    let ss,msgElement,botBlacklist,initialisedCustomSFX,automatedBorder,clientID,didStateFarm,menuInitiated,GAMECODE,noPointerPause,resetModules,amountOnline,errorString,playersInGame,loggedGameMap,startUpComplete,isBanned,attemptedAutoUnban,coordElement,gameInfoElement,playerinfoElement,playerstatsElement,minangleCircle,redCircle,crosshairsPosition,currentlyTargeting,ammo,ranOneTime,lastWeaponBox,lastChatItemLength,configMain,configBots;
    let whitelistPlayers,scrambledMsgEl,newGame,previousDetail,previousTitleAnimation,blacklistPlayers,playerLookingAt,forceControlKeys,forceControlKeysCache,playerNearest,enemyLookingAt,enemyNearest,AUTOMATED,ranEverySecond
    let cachedCommand = "", cachedCommandTime = Date.now();
    let activePath, findNewPath, activeNodeTarget;
    let pathfindingTargetOverride = undefined;
    let despawnIfNoPath = false;
    let isLeftButtonDown = false;
    let isRightButtonDown = false;
    let configNotSet = true;
    const weaponArray={ //this could be done differently but i cba
        eggk47: 0,
        scrambler: 1,
        freeranger: 2,
        rpegg: 3,
        whipper: 4,
        crackshot: 5,
        trihard: 6,
        random: 3, // :trol_fancy:
    };
    const antiAFKString = "AntiAFK Message. This message is not visible to others. || ";
    const filteredList = [ //a selection of filtered words for antiafk. brimslate reports afk messages, so have fun reporting this and trying to explain this to the "eggforcers"
        'date', 'dick', 'fuck', 'fuk', 'suck', 'piss', 'hate', 'nude', 'fux', 'hate', 'pussy',
    ]; //filteredList[randomInt(0,filteredList.length-1)]
    let proxyList = [
        'shellshock.io', 'algebra.best', 'algebra.vip', 'biologyclass.club', 'deadlyegg.com', 'deathegg.world', 'eggboy.club', 'eggboy.xyz', 'eggcombat.com', 'egg.dance',
        'eggfacts.fun', 'egghead.institute', 'eggisthenewblack.com', 'eggsarecool.com', 'geometry.best', 'geometry.monster', 'geometry.pw', 'geometry.report', 'hardboiled.life',
        'hardshell.life', 'humanorganising.org', 'mathactivity.xyz', 'mathactivity.club', 'mathdrills.info', 'mathdrills.life', 'mathfun.rocks', 'mathgames.world', 'math.international',
        'mathlete.fun', 'mathlete.pro', 'overeasy.club', 'scrambled.tech', 'scrambled.today', 'scrambled.us', 'scrambled.world', 'shellshockers.club', 'shellshockers.life', 'shellshockers.site',
        'shellshockers.us', 'shellshockers.world', 'shellshockers.xyz', 'shellsocks.com', 'softboiled.club', 'urbanegger.com', 'violentegg.club', 'violentegg.fun', 'yolk.best', 'yolk.life',
        'yolk.rocks', 'yolk.tech', 'yolk.quest', 'yolk.today', 'zygote.cafe', 'shellshockers.best', 'eggboy.me'
    ];
    proxyList=proxyList.filter(item=>item!==unsafeWindow.location.hostname);
    proxyList=[...proxyList].sort(() => Math.random() - 0.5);
    let proxyListIndex=0;
    const monitorObjects = {};
    //title animation
    const titleAnimationFrames = [
        '︻デ═一',
        '︻デ═一',
        'デ═一　-',
        '═一　　　-',
        '一　　　　-',
        '.　　　　　-',
        '.　　　　-',
        '.　　　-',
        '.　　　　-　　0',
        '.　　　　　-0',
        '.　　　　\\/',
        '.　　　_-_',
        '.　___',
        '__',
        '.',
        'STATEFARMCLIEN',
        'TATEFARMCLIENT',
        'ATEFARMCLIENTV',
        'TEFARMCLIENTV3',
        'EFARMCLIENTV3 ',
        'FARMCLIENTV3 S',
        'ARMCLIENTV3 ST',
        'RMCLIENTV3 STA',
        'MCLIENTV3 STAT',
        'CLIENTV3 STATE',
        'LIENTV3 STATEF',
        'IENTV3 STATEFA',
        'ENTV3 STATEFAR',
        'NTV3 STATEFARM',
        'TV3 STATEFARMC',
        'V3 STATEFARMCL',
        '3 STATEFARMCLI',
        'STATEFARMCLIEN',
        'TATEFARMCLIENT',
        'STATEFARM',
        'CLIENT V3',
        'STATEFARM',
        'CLIENT V3',
        'STATEFARM',
        'CLIENT V3',
        'STATEFARM',
        'CLIENT V3',
        ':)',
        ';)',
        ':)',
        '⠝⠓⠗⠅ ஃ ⠟⠑⠙⠟',
        '⠑⠑⠟⠟ ஃ ⠙⠛⠟⠕',
        '⠛⠟⠍⠑ ஃ ⠅⠑⠍⠃',
        '⠅⠟⠇⠝ ஃ ⠟⠕⠗⠕',
        '⠝⠓⠗⠅ ஃ ⠟⠑⠙⠟',
        '⠑⠑⠟⠟ ஃ ⠙⠛⠟⠕',
        '⠛⠟⠍⠑ ஃ ⠅⠑⠍⠃',
        '⠅⠟⠇⠝ ஃ ⠟⠕⠗⠕',
        '( ͡° ͜ʖ ͡°)',
        '( ͠° ͟ʖ ͡°)',
        '( ͡° ͟ʖ ͡°)',
        '( ͡° ͟ʖ ͠°)一',
        '( ͡° ͟ʖ ͠°)═一',
        '( ͡° ͟ʖ ͠°)デ═一',
        '( ͡° ͟ʖ ͠°)︻デ═一',
        ' ͡° ͟ʖ ͠°)︻デ═一',
        ' ͟ʖ ͠°)︻デ═一',
        ' ͠°)︻デ═一',
        ')︻デ═一',
    ];

    //menu interaction functions
    //menu extraction
    const extract = function (variable,shouldUpdate) {
        if (shouldUpdate) {updateConfig()};
        return configMain[variable]||configBots[variable];
    };
    const extractDropdownList = function (variable) {
        return tp[variable+"Button"].controller_.binding.value.constraint_.constraints[0].options;
    };
    const extractAsDropdownInt = function (variable) {
        const options = extractDropdownList(variable);
        const state = extract(variable);
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === state) {
                return i;
            };
        };
    };

    const beginBinding = function (value) {
        if (binding == false) {
            binding=value;
            tp[binding+"BindButton"].title="PRESS KEY";
        };
    };
    //one day i should make this unshit. dom is not the correct way to go about this.
    //unfortunately tweakpane is a pain in the ass and has barely anything for actually extracting/changing vars
    //a way it could be done is export preset => change value => import preset
    //but doesnt account for it being a button... and dropdowns wouldnt switch properly too. laziness. the problem is that this works fine.
    //suppose i could always just log the type of module and refer to it later. you can also get the parent object from the tp object, that would save iterating over everything.
    const change = function (module,newValue) { //its important to note that every module must have a unique name (the title of the module, NOT the storeAs)
        const labels = document.querySelectorAll('.tp-lblv_l');
        const moduleButton=module+"Button";
        const moduleLabel=tp[moduleButton].label;
        for (const label of labels) {
            if (label.textContent.includes(moduleLabel)) {
                const inputContainer = label.nextElementSibling;
                const currentValue=extract(module);
                // check for checkbox
                const checkbox = inputContainer.querySelector('.tp-ckbv_i');
                if (checkbox) {
                    if (newValue==undefined) {
                        newValue=(!currentValue);
                    };
                    if (newValue!==(!!currentValue)) {
                        checkbox.click(); // Toggle checkbox
                    };
                    console.log(module,"checkbox",currentValue,newValue);
                    return extract(module,true);
                };
                // check for button
                const button = inputContainer.querySelector('.tp-btnv_b');
                if (button) {
                    button.click(); // Trigger button click
                    console.log(module,"button",currentValue,newValue);
                    return ("NOMSG"); //no change of state, dont show pop up message
                };
                // check for dropdown
                const dropdown = inputContainer.querySelector('.tp-lstv_s');
                if (dropdown) {
                    if (newValue==undefined) { //if youre going to set a list to a certain value, use the int value of the list item
                        newValue=(dropdown.selectedIndex+1) % dropdown.options.length;
                    };
                    dropdown.selectedIndex = newValue;
                    dropdown.dispatchEvent(new Event('change')); // trigger change event for dropdown
                    console.log(module,"dropdown",currentValue,newValue);
                    return extract(module,true);
                };
                // check for text input
                const textInput = inputContainer.querySelector('.tp-txtv_i');
                if (textInput) {
                    textInput.value = newValue;
                    textInput.dispatchEvent(new Event('change')); // trigger change event for dropdown
                    return extract(module,true);
                };
            };
        };
    };
    document.addEventListener('mousedown', function (event) {
        if (event.button === 2) {
            isRightButtonDown = true;
        } else if (event.button === 0) {
            isLeftButtonDown = true;
        };
    });
    document.addEventListener('mouseup', function (event) {
        if (event.button === 2) {
            isRightButtonDown = false;
        } else if (event.button === 0) {
            isLeftButtonDown = false;
        };
    });
    //menu
    document.addEventListener("keydown", function (event) {
        event=(event.code.originalReplace("Key",""));
        isKeyToggled[event]=true;
        if (event=="Escape") { noPointerPause=false; unsafeWindow.document.onpointerlockchange() };
    });
    document.addEventListener("keyup", function (event) {
        event=(event.code.originalReplace("Key",""));
        isKeyToggled[event]=false;
        if (document.activeElement&&document.activeElement.tagName==='INPUT' ) {
            return;
        } else if (binding!=false) {
                if (event=="Delete") { event="Set Bind" };
                tp[binding+"BindButton"].title=event;
                bindsArray[binding]=event;
                save(binding+"Bind",event);
                createPopup("Binded "+tp[binding+"Button"].label+" to key: "+event);
                binding=false;
        } else {
            Object.keys(bindsArray).forEach(function (module) {
                if ((bindsArray[module] == event) && module!="zoom") {
                    let state=change(module)
                    let popupText=state
                    if (state!="NOMSG") {
                        if (state===true||state===false||state===undefined) {state=(state?"ON":"OFF")};
                        popupText="Set "+module+" to: "+state;
                        if (extract("announcer")) {
                            sendChatMessage("I just set "+module+" to "+state+"!");
                        };
                    } else {
                        switch (module) {
                            case ("hide"):
                                popupText="Toggled StateFarm Panel"; break;
                            case ("showBotPanel"):
                                popupText="Toggled Bot Panel"; break;
                            case ("panic"):
                                popupText="Exiting to set URL..."; break;
                        };
                    };
                    createPopup(popupText);
                };
            });
        };
    });
    const initTabs = function(tab,guideData) {
        tp[tab.storeAs]=tab.location.addTab({
            pages: [
                {title: 'Modules'},
                {title: 'Binds'},
                {title: 'Guide'},
            ],
        });
        if (guideData) {
            const thePages = [];
            guideData.forEach(aPage=>{
                thePages.push({title: aPage.title});
            });
            tp[tab.storeAs+"Guide"]=tp[tab.storeAs].pages[2].addTab({ pages: thePages }); //is there a one liner for this? uhhh probabyl
            //tp[tab.storeAs + "Guide"] = tab.location.addTab({ thePages: guideData.map(page => ({ title: page.title })) });
            for (let i = 0; i < guideData.length; i++) {
                const storeAs = tab.storeAs+"Guide"+i;
                const text = (guideData[i].content||"Not set up correctly lmao");
                initModule({ location: tp[tab.storeAs+"Guide"].pages[i], storeAs: storeAs, monitor: (text.split('\n').length + 0.25),});
                monitorObjects[storeAs]=text;
                const infoElement = tp[storeAs+"Button"].controller_.view.element.children[1].children[0];
                infoElement.style.width = "270px";
                infoElement.style.setProperty("margin-left", "-110px", "important");
            };
        };
    };
    const initFolder = function(folder) {
        tp[folder.storeAs]=folder.location.addFolder({
            title: folder.title,
            expanded: load(folder.storeAs) !== null ? load(folder.storeAs) : false
        });
        allFolders.push(folder.storeAs);
    };
    const initModule = function (module) {
        if (module.requirements) {

        };

        const value={};
        value[module.storeAs]=(module.defaultValue !== undefined ? module.defaultValue : false);

        tp[module.storeAs+"TiedModules"] = {
            showConditions: (module.showConditions||false),
            hideConditions: (module.hideConditions||false),
            enableConditions: (module.enableConditions||false),
            disableConditions: (module.disableConditions||false), //why have disable when there is already enable? enable acts like an AND operator, whereas having conditions for the opposite allows for an OR operation. it is messy, but hey it works lmao?
        };

        if (!(module.slider&&module.slider.step)) {module.slider={}};
        const config={
            label: module.title,
            options: module.dropdown,
            min: module.slider.min,
            max: module.slider.max,
            step: module.slider.step,
            title: module.button,
        };
        if (module.button) {
            tp[(module.storeAs+"Button")]=module.location.addButton({
                label: module.title,
                title: module.button,
            }).on("click", (value) => {
                if (module.clickFunction!==undefined) {module.clickFunction(value)};
                if (module.botParam!==undefined) {updateBotParams(module.botParam)};
            });
        } else if (module.monitor) {
            monitorObjects[module.storeAs]="Text Goes Here";
            tp[(module.storeAs+"Button")]=module.location.addMonitor(monitorObjects,module.storeAs,{
                label: '',
                expanded: true,
                multiline: true,
                lineCount: module.monitor,
            });
            setInterval(() => {
                tp[(module.storeAs+"Button")].refresh();
            }, 1000);
        } else {
            tp[module.storeAs+"Button"]=module.location.addInput(value,module.storeAs,config
            ).on("change", (value) => {
                if (module.changeFunction!==undefined) {module.changeFunction(value)};
                setTimeout(() => {
                    if (startUpComplete) {
                        if ((module.botParam!==undefined)) {
                            updateBotParams(module.botParam);
                        };
                    };
                    updateHiddenAndDisabled();
                    saveConfig();
                }, 150);
            });
        };
        allModules.push(module.storeAs);
        if (module.bindLocation) {initBind(module)};
    };
    const initBind = function (module) {
        if (resetModules) { remove(module.storeAs+"Bind") };
        const theBind=( load(module.storeAs+"Bind") || module.defaultBind || "Set Bind" );
        tp[(module.storeAs+"BindButton")]=module.bindLocation.addButton({
            label: module.title,
            title: theBind,
        }).on("click", (value) => {
            beginBinding(module.storeAs);
        });
        bindsArray[module.storeAs]=theBind;
    };
    const initMenu = function (reset) {
        //INIT MENU
        //init tp.mainPanel

        resetModules = reset;
        menuInitiated = false;

        if (tp.mainPanel) { tp.mainPanel.dispose() };
        if (tp.botPanel) { tp.botPanel.dispose() };

        tp.mainPanel = new Tweakpane.Pane();
        tp.mainPanel.title = menuTitle;
        //COMBAT MODULES
        initFolder({ location: tp.mainPanel, title: "Combat", storeAs: "combatFolder",});
        initTabs({ location: tp.combatFolder, storeAs: "combatTab" }, [
            {title: "Basics", content:
`This is the combat tab. Here you will find
options relating to aimbotting, and other
useful macros. Aimbot is made active by
turning it on. Using ToggleRM will give you
more control by allowing you to switch by
pressing the right mouse button.
TargetMode also allows a more intuitive
means of selecting who you will target.
The most powerful features you can use
are Predictions and Antibloom. These
improve the accuracy of the tracking.
AntiSwitch will make you lock on to a
target until they die, and if you don't want
to target them after they die then choose
1Kill too. Auto Refill helps you stay
topped up and choosing the Smart
mode allows you to refill at the moment
when you will not have a long
reload time. GrenadeMAX makes all
grenades get thrown at max strength.`},
        {title: "Visibility", content:
`There are a couple of options related to
visibility (Line-of-Sight). First is
TargetVisible. This tunes the aimbot to
be more strategic with where it aims.
NoWallTrack makes it such that if a
targeted player goes behind a wall, you
stop aimlocking them. There is also an
AutoFire mode with this sort of
functionality.`},
        {title: "Advanced", content:
`If you want to increase stealthiness,
make use of MinAngle and AntiSnap. The
first will make it so that you have to
manually move your reticle within your
specified radius to lock on. The latter
smooths snapping, which evades
detection on botter spotter scripts.
If you want to be more powerful, opt for
SilentAim. This modifies your direction
packets instead of making you lock on.
However, this can lead to slightly glitchy
movement. When this is on, MinAngle
changes to instead narrow down the
selection of targets rather than acting
as a guide.
AntiSneak is a module which, while not
always showing use, can help you in a
difficult situation. It automatically
switches targets to a player that enters
your specified range, and begins
shooting with your primary gun, and then
the pistol. Ideal use case is when you are
sniping and someone sneaks up on you
(...hence it is called... AntiSneak).`},
        ]);
            initModule({ location: tp.combatTab.pages[0], title: "Aimbot", storeAs: "aimbot", bindLocation: tp.combatTab.pages[1], defaultBind:"V",});
            initFolder({ location: tp.combatTab.pages[0], title: "Aimbot Options", storeAs: "aimbotFolder",});
                initModule({ location: tp.aimbotFolder, title: "TargetMode", storeAs: "aimbotTargetMode", bindLocation: tp.combatTab.pages[1], defaultBind:"T", dropdown: [{text: "Pointing At", value: "pointingat"}, {text: "Nearest", value: "nearest"}], defaultValue: "pointingat", enableConditions: [["aimbot",true]],});
                initModule({ location: tp.aimbotFolder, title: "TargetVisible", storeAs: "aimbotVisibilityMode", bindLocation: tp.combatTab.pages[1], dropdown: [{text: "Disabled", value: "disabled"}, {text: "Prioritise Visible", value: "prioritise"}, {text: "Only Visible", value: "onlyvisible"}], defaultValue: "disabled", enableConditions: [["aimbot",true]]});
                tp.aimbotFolder.addSeparator();
                initModule({ location: tp.aimbotFolder, title: "ToggleRM", storeAs: "aimbotRightClick", bindLocation: tp.combatTab.pages[1], enableConditions: [["aimbot",true]],});
                initModule({ location: tp.aimbotFolder, title: "SilentAim", storeAs: "silentAimbot", bindLocation: tp.combatTab.pages[1], enableConditions: [["aimbot",true]],});
                initModule({ location: tp.aimbotFolder, title: "NoWallTrack", storeAs: "noWallTrack", bindLocation: tp.combatTab.pages[1], enableConditions: [["aimbot",true], ["silentAimbot",false]],});
                tp.aimbotFolder.addSeparator();
                initModule({ location: tp.aimbotFolder, title: "Prediction", storeAs: "prediction", bindLocation: tp.combatTab.pages[1], enableConditions: [["aimbot",true]],});
                initModule({ location: tp.aimbotFolder, title: "AntiBloom", storeAs: "antiBloom", bindLocation: tp.combatTab.pages[1], enableConditions: [["aimbot",true]],});
                tp.aimbotFolder.addSeparator();
                initModule({ location: tp.aimbotFolder, title: "AntiSwitch", storeAs: "antiSwitch", bindLocation: tp.combatTab.pages[1], enableConditions: [["aimbot",true]],});
                initModule({ location: tp.aimbotFolder, title: "1 Kill", storeAs: "oneKill", bindLocation: tp.combatTab.pages[1], enableConditions: [["aimbot",true]],});
                tp.aimbotFolder.addSeparator();
                initModule({ location: tp.aimbotFolder, title: "MinAngle", storeAs: "aimbotMinAngle", slider: {min: 0.05, max: 360, step: 1}, defaultValue: 360, enableConditions: [["aimbot",true]],});
                initModule({ location: tp.aimbotFolder, title: "AntiSnap", storeAs: "aimbotAntiSnap", slider: {min: 0, max: 0.99, step: 0.01}, defaultValue: 0, enableConditions: [["aimbot",true], ["silentAimbot",false]],});
                initModule({ location: tp.aimbotFolder, title: "AntiSneak", storeAs: "antiSneak", slider: {min: 0, max: 5, step: 0.2}, defaultValue: 0, enableConditions: [["aimbot",true]],});
                tp.aimbotFolder.addSeparator();
                initModule({ location: tp.aimbotFolder, title: "ESPColor", storeAs: "aimbotColor", defaultValue: "#0000ff", enableConditions: [["aimbot",true]]});
            tp.combatTab.pages[0].addSeparator();
            initModule({ location: tp.combatTab.pages[0], title: "Auto Refill", storeAs: "autoRefill", bindLocation: tp.combatTab.pages[1],});
            initModule({ location: tp.combatTab.pages[0], title: "Smart Refill", storeAs: "smartRefill", bindLocation: tp.combatTab.pages[1], showConditions: [["autoRefill",true]],});
            tp.combatTab.pages[0].addSeparator();
            initModule({ location: tp.combatTab.pages[0], title: "Auto Fire", storeAs: "enableAutoFire", bindLocation: tp.combatTab.pages[1],});
            initModule({ location: tp.combatTab.pages[0], title: "AutoFireType", storeAs: "autoFireType", bindLocation: tp.combatTab.pages[1], dropdown: [{text: "Force Automatic", value: "forceAutomatic"}, {text: "While Visible", value: "whileVisible"}, {text: "While Aimbotting", value: "whileAimbot"}, {text: "Visible and Aimbotting", value: "whileVisAimbot"}, {text: "Always", value: "always"}], defaultValue: "leftMouse", showConditions: [["enableAutoFire",true]]});
            tp.combatTab.pages[0].addSeparator();
            initModule({ location: tp.combatTab.pages[0], title: "GrenadeMAX", storeAs: "grenadeMax", bindLocation: tp.combatTab.pages[1],});
        //RENDER MODULES
        initFolder({ location: tp.mainPanel, title: "Render", storeAs: "renderFolder",});
        initTabs({ location: tp.renderFolder, storeAs: "renderTab" });
            initModule({ location: tp.renderTab.pages[0], title: "PlayerESP", storeAs: "playerESP", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Tracers", storeAs: "tracers", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Chams", storeAs: "chams", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Nametags", storeAs: "nametags", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Targets", storeAs: "targets", bindLocation: tp.renderTab.pages[1],});
            tp.renderTab.pages[0].addSeparator();
            initFolder({ location: tp.renderTab.pages[0], title: "Player ESP/Tracers Options", storeAs: "tracersFolder",});
                initModule({ location: tp.tracersFolder, title: "Type", storeAs: "tracersType", bindLocation: tp.renderTab.pages[1], dropdown: [{text: "Static", value: "static"}, {text: "Proximity", value: "proximity"}, {text: "Visibility", value: "visibility"}], defaultValue: "static", disableConditions: [["tracers",false],["playerESP",false]],});
                initModule({ location: tp.tracersFolder, title: "Color 1", storeAs: "tracersColor1", defaultValue: "#ff0000", disableConditions: [["tracers",false],["playerESP",false]],});
                initModule({ location: tp.tracersFolder, title: "Color 2", storeAs: "tracersColor2", defaultValue: "#00ff00", disableConditions: [["tracers",false],["playerESP",false]], hideConditions: [["tracersType","static"]],});
                initModule({ location: tp.tracersFolder, title: "Color 3", storeAs: "tracersColor3", defaultValue: "#ffffff", disableConditions: [["tracers",false],["playerESP",false]], showConditions: [["tracersType","proximity"]],});
                // tp.tracersFolder.addSeparator();
                initModule({ location: tp.tracersFolder, title: "Dist 1->2", storeAs: "tracersColor1to2", slider: {min: 0, max: 30, step: 0.25}, defaultValue: 5, showConditions: [["tracersType","proximity"]], disableConditions: [["tracers",false],["playerESP",false]],});
                initModule({ location: tp.tracersFolder, title: "Dist 2->3", storeAs: "tracersColor2to3", slider: {min: 0, max: 30, step: 0.25}, defaultValue: 15, showConditions: [["tracersType","proximity"]], disableConditions: [["tracers",false],["playerESP",false]],});
            tp.renderTab.pages[0].addSeparator();
            initFolder({ location: tp.renderTab.pages[0], title: "Ammo ESP/Tracers Options", storeAs: "tracersAmmoFolder",});
                initFolder({ location: tp.tracersAmmoFolder, title: "Ammo", storeAs: "ammoFolder",});
                    initModule({ location: tp.ammoFolder, title: "AESP", storeAs: "ammoESP", bindLocation: tp.renderTab.pages[1],});
                    initModule({ location: tp.ammoFolder, title: "ATracers", storeAs: "ammoTracers", bindLocation: tp.renderTab.pages[1],});
                    tp.ammoFolder.addSeparator();
                    initModule({ location: tp.ammoFolder, title: "ARegime", storeAs: "ammoESPRegime", bindLocation: tp.renderTab.pages[1], dropdown: [{text: "When Depleted", value: "whendepleted"},{text: "When Low", value: "whenlow"},{text: "Below Max", value: "belowmax"},{text: "Always On", value: "alwayson"},], defaultValue: "whendepleted", disableConditions: [["ammoESP",false],["ammoTracers",false]],});
                    initModule({ location: tp.ammoFolder, title: "AColor", storeAs: "ammoESPColor", defaultValue: "#ffff00", disableConditions: [["ammoESP",false],["ammoTracers",false]],});
                initFolder({ location: tp.tracersAmmoFolder, title: "Grenades", storeAs: "grenadesFolder",});
                    initModule({ location: tp.grenadesFolder, title: "GESP", storeAs: "grenadeESP", bindLocation: tp.renderTab.pages[1],});
                    initModule({ location: tp.grenadesFolder, title: "GTracers", storeAs: "grenadeTracers", bindLocation: tp.renderTab.pages[1],});
                    tp.grenadesFolder.addSeparator();
                    initModule({ location: tp.grenadesFolder, title: "GRegime", storeAs: "grenadeESPRegime", bindLocation: tp.renderTab.pages[1], dropdown: [{text: "When Depleted", value: "whendepleted"},{text: "When Low", value: "whenlow"},{text: "Below Max", value: "belowmax"},{text: "Always On", value: "alwayson"},], defaultValue: "whendepleted", disableConditions: [["grenadeESP",false],["grenadeTracers",false]],});
                    initModule({ location: tp.grenadesFolder, title: "GColor", storeAs: "grenadeESPColor", defaultValue: "#00ffff", disableConditions: [["grenadeESP",false],["grenadeTracers",false]],});
            tp.renderTab.pages[0].addSeparator();
            initModule({ location: tp.renderTab.pages[0], title: "FOV", storeAs: "fov", slider: {min: 0, max: 360, step: 3}, defaultValue: 72,});
            initModule({ location: tp.renderTab.pages[0], title: "Zoom FOV", storeAs: "zoom", slider: {min: 0, max: 72, step: 1}, defaultValue: 15, bindLocation: tp.renderTab.pages[1], defaultBind: "C",});
            tp.renderTab.pages[0].addSeparator();
            initModule({ location: tp.renderTab.pages[0], title: "CamWIP", storeAs: "freecam", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Wireframe", storeAs: "wireframe", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Egg Size", storeAs: "eggSize", slider: {min: 0, max: 10, step: 0.25}, defaultValue: 1,});
            tp.renderTab.pages[0].addSeparator();
            initModule({ location: tp.renderTab.pages[0], title: "Set Detail", storeAs: "setDetail", bindLocation: tp.renderTab.pages[1], dropdown: [{text: "Disabled", value: "disabled"}, {text: "Auto Detail", value: "autodetail"}, {text: "No Details", value: "nodetails"}, {text: "Shadows", value: "shadows"}, {text: "High Res", value: "highres"}, {text: "Shadows+High Res", value: "shadowshighres"}], defaultValue: "disabled"});
            initModule({ location: tp.renderTab.pages[0], title: "Textures", storeAs: "enableTextures", bindLocation: tp.renderTab.pages[1], defaultValue: true,});
            initModule({ location: tp.renderTab.pages[0], title: "Render Delay", storeAs: "renderDelay", slider: {min: 0, max: 30000, step: 10}, defaultValue: 0,});
        //HUD MODULES
        initFolder({ location: tp.mainPanel, title: "HUD", storeAs: "hudFolder",});
        initTabs({ location: tp.hudFolder, storeAs: "hudTab" });
            initModule({ location: tp.hudTab.pages[0], title: "Show Bloom", storeAs: "revealBloom", bindLocation: tp.hudTab.pages[1],});
            initModule({ location: tp.hudTab.pages[0], title: "Show LOS", storeAs: "showLOS", bindLocation: tp.hudTab.pages[1],});
            initModule({ location: tp.hudTab.pages[0], title: "Show MinAngle", storeAs: "showMinAngle", bindLocation: tp.hudTab.pages[1],});
            initModule({ showConditions: [["disabledlmao",true]], location: tp.hudTab.pages[0], title: "Leaderboard", storeAs: "highlightLeaderboard", bindLocation: tp.hudTab.pages[1], enableConditions: [["aimbot",true]],});
            tp.hudTab.pages[0].addSeparator();
            initModule({ location: tp.hudTab.pages[0], title: "Co-ords", storeAs: "showCoordinates", bindLocation: tp.hudTab.pages[1],});
            initModule({ location: tp.hudTab.pages[0], title: "RadarWIP", storeAs: "radar", bindLocation: tp.hudTab.pages[1],});
            initModule({ location: tp.hudTab.pages[0], title: "HP Display", storeAs: "playerStats", bindLocation: tp.hudTab.pages[1],});
            initModule({ location: tp.hudTab.pages[0], title: "PlayerInfo", storeAs: "playerInfo", bindLocation: tp.hudTab.pages[1],});
            initModule({ location: tp.hudTab.pages[0], title: "GameInfo", storeAs: "gameInfo", bindLocation: tp.hudTab.pages[1],});
            initModule({ location: tp.hudTab.pages[0], title: "ShowStream", storeAs: "showStreams", bindLocation: tp.hudTab.pages[1],});
        //CHAT MODULES
        initFolder({ location: tp.mainPanel, title: "Chat", storeAs: "chatFolder",});
        initTabs({ location: tp.chatFolder, storeAs: "chatTab" });
            initModule({ location: tp.chatTab.pages[0], title: "InfiniHistory", storeAs: "chatExtend", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "HighlightTxt", storeAs: "chatHighlight", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "Max Ingame", storeAs: "maxChat", slider: {min: 0, max: 30, step: 1}, defaultValue: 5,});
            initModule({ location: tp.chatTab.pages[0], title: "ShowFiltered", storeAs: "disableChatFilter", bindLocation: tp.chatTab.pages[1],});
            tp.chatTab.pages[0].addSeparator();
            initModule({ location: tp.chatTab.pages[0], title: "BypassFilter", storeAs: "chatFilterBypass", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "Tall Chat", storeAs: "tallChat", bindLocation: tp.chatTab.pages[1],});
            tp.chatTab.pages[0].addSeparator();
            initModule({ location: tp.chatTab.pages[0], title: "AntiAFK", storeAs: "antiAFK", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "Spammer", storeAs: "spamChat", bindLocation: tp.chatTab.pages[1],});
            initFolder({ location: tp.chatTab.pages[0], title: "Spammer Options", storeAs: "spammerFolder",});
                initModule({ location: tp.spammerFolder, title: "Delay (ms)", storeAs: "spamChatDelay", slider: {min: 250, max: 60000, step: 10}, defaultValue: 500, enableConditions: [["spamChat",true]],});
                initModule({ location: tp.spammerFolder, title: "Spam Text", storeAs: "spamChatText", defaultValue: "ЅtateFarm Client On Top! ",});
            initFolder({ location: tp.chatTab.pages[0], title: "Trolling", storeAs: "trollingFolder",});
                initModule({ location: tp.trollingFolder, title: "Mock", storeAs: "mockMode", bindLocation: tp.chatTab.pages[1],});
                initModule({ location: tp.trollingFolder, title: "Announcer", storeAs: "announcer", bindLocation: tp.chatTab.pages[1],});
                tp.trollingFolder.addSeparator();
                initModule({ location: tp.trollingFolder, title: "AutoEZ", storeAs: "autoEZ", bindLocation: tp.chatTab.pages[1],});
                initModule({ location: tp.trollingFolder, title: "CheatAccuse", storeAs: "cheatAccuse", bindLocation: tp.chatTab.pages[1],});
            initFolder({ location: tp.chatTab.pages[0], title: "Join/Leave Msgs Options", storeAs: "joinLeaveFolder",});
                initModule({ location: tp.joinLeaveFolder, title: "Join Msgs", storeAs: "joinMessages", bindLocation: tp.chatTab.pages[1],});
                initModule({ location: tp.joinLeaveFolder, title: "Leave Msgs", storeAs: "leaveMessages", bindLocation: tp.chatTab.pages[1],});
                tp.joinLeaveFolder.addSeparator();
                initModule({ location: tp.joinLeaveFolder, title: "Send2Chat", storeAs: "publicBroadcast", bindLocation: tp.chatTab.pages[1], disableConditions: [["joinMessages",false],["leaveMessages",false]],});
                initModule({ location: tp.joinLeaveFolder, title: "[SFC]Added", storeAs: "joinLeaveBranding", bindLocation: tp.chatTab.pages[1], disableConditions: [["joinMessages",false],["leaveMessages",false]],});
        //LISTS MODULES
        initFolder({ location: tp.mainPanel, title: "Lists", storeAs: "listsFolder",});
        initTabs({ location: tp.listsFolder, storeAs: "listsTab" })
            initModule({ location: tp.listsTab.pages[0], title: "Whitelist", storeAs: "whitelist", defaultValue: "User-1, User-2",});
            initFolder({ location: tp.listsTab.pages[0], title: "Whitelist (Target Only) Options", storeAs: "whitelistFolder",});
                initModule({ location: tp.whitelistFolder, title: "WAimbot", storeAs: "enableWhitelistAimbot", bindLocation: tp.listsTab.pages[1],});
                initModule({ location: tp.whitelistFolder, title: "WESP", storeAs: "enableWhitelistTracers", bindLocation: tp.listsTab.pages[1], disableConditions: [["tracers",false],["playerESP",false]],});
                initModule({ location: tp.whitelistFolder, title: "WESPType", storeAs: "whitelistESPType", bindLocation: tp.listsTab.pages[1], dropdown: [{text: "Only Include", value: "onlyinclude"},{text: "Highlight", value: "highlight"},], defaultValue: "onlyinclude", disableConditions: [["tracers",false],["playerESP",false]], showConditions: [["enableWhitelistTracers",true]],});
                initModule({ location: tp.whitelistFolder, title: "WHighlight", storeAs: "whitelistColor", defaultValue: "#e80aac", disableConditions: [["tracers",false],["playerESP",false]], showConditions: [["enableWhitelistTracers",true], ["whitelistESPType", "highlight"]],});
            tp.listsTab.pages[0].addSeparator();
            initModule({ location: tp.listsTab.pages[0], title: "Blacklist", storeAs: "blacklist", defaultValue: "User-1, User-2",});
            initFolder({ location: tp.listsTab.pages[0], title: "Blacklist (Exclude) Options", storeAs: "blacklistFolder",});
                initModule({ location: tp.blacklistFolder, title: "BAimbot", storeAs: "enableBlacklistAimbot", bindLocation: tp.listsTab.pages[1],});
                initModule({ location: tp.blacklistFolder, title: "BESP", storeAs: "enableBlacklistTracers", bindLocation: tp.listsTab.pages[1], disableConditions: [["tracers",false],["playerESP",false]],});
                initModule({ location: tp.blacklistFolder, title: "BESPType", storeAs: "blacklistESPType", bindLocation: tp.listsTab.pages[1], dropdown: [{text: "Just Exclude", value: "justexclude"},{text: "Highlight", value: "highlight"},], defaultValue: "justexclude", disableConditions: [["tracers",false],["playerESP",false]], showConditions: [["enableBlacklistTracers",true]],});
                initModule({ location: tp.blacklistFolder, title: "BHighlight", storeAs: "blacklistColor", defaultValue: "#00ff00", disableConditions: [["tracers",false],["playerESP",false]], showConditions: [["enableBlacklistTracers",true], ["blacklistESPType", "highlight"]],});
        //AUTOMATION MODULES
        initFolder({ location: tp.mainPanel, title: "Automation", storeAs: "automationFolder",});
        initTabs({ location: tp.automationFolder, storeAs: "automationTab" })
            initModule({ location: tp.automationTab.pages[0], title: "Flood Report", storeAs: "floodReport", bindLocation: tp.automationTab.pages[1], button: "Spam Now!", clickFunction: function(){
                alert("Thank you for your efforts comrade! o7");
                spamReport();
            },});
            tp.automationTab.pages[0].addSeparator();
            initModule({ location: tp.automationTab.pages[0], title: "Bunnyhop", storeAs: "bunnyhop", bindLocation: tp.automationTab.pages[1], });
            initModule({ location: tp.automationTab.pages[0], title: "Auto Walk", storeAs: "autoWalk", bindLocation: tp.automationTab.pages[1],});
            initModule({ location: tp.automationTab.pages[0], title: "Auto Strafe", storeAs: "autoStrafe", bindLocation: tp.automationTab.pages[1],});
            initModule({ location: tp.automationTab.pages[0], title: "Auto Jump", storeAs: "autoJump", bindLocation: tp.automationTab.pages[1],});
            initModule({ location: tp.automationTab.pages[0], title: "Jump Delay", storeAs: "autoJumpDelay", slider: {min: 1, max: 10000, step: 1}, defaultValue: 1, showConditions: [["autoJump", true]],});
            tp.automationTab.pages[0].addSeparator();
            initModule({ location: tp.automationTab.pages[0], title: "AutoWeapon", storeAs: "autoWeapon", bindLocation: tp.automationTab.pages[1], dropdown: [{text: "Disabled", value: "disabled"}, {text: "EggK-47", value: "eggk47"}, {text: "Scrambler", value: "scrambler"}, {text: "Free Ranger", value: "freeranger"}, {text: "RPEGG", value: "rpegg"}, {text: "Whipper", value: "whipper"}, {text: "Crackshot", value: "crackshot"}, {text: "Tri-Hard", value: "trihard"}, {text: "Randomised", value: "random"}], defaultValue: "disabled"});
            initModule({ location: tp.automationTab.pages[0], title: "AutoGrenade", storeAs: "autoGrenade", bindLocation: tp.automationTab.pages[1],});
            tp.automationTab.pages[0].addSeparator();
            initFolder({ location: tp.automationTab.pages[0], title: "Auto Join Options", storeAs: "autoJoinFolder",});
                initModule({ location: tp.autoJoinFolder, title: "Auto Join", storeAs: "autoJoin", bindLocation: tp.automationTab.pages[1],});
                initModule({ location: tp.autoJoinFolder, title: "Join Code", storeAs: "joinCode", defaultValue: "CODE", enableConditions: [["autoJoin", true]],});
                initModule({ location: tp.autoJoinFolder, title: "Get Code", storeAs: "getCode", button: "Retrieve", clickFunction: function(){change("joinCode",GAMECODE)}, enableConditions: [["autoJoin", true]],});
            initFolder({ location: tp.automationTab.pages[0], title: "Auto Name Options", storeAs: "autoNamesFolder",});
                initModule({ location: tp.autoNamesFolder, title: "Use Name", storeAs: "useCustomName", bindLocation: tp.automationTab.pages[1],});
                initModule({ location: tp.autoNamesFolder, title: "New Name", storeAs: "usernameAutoJoin" , defaultValue: "ЅtateFarmer", enableConditions: [["useCustomName", true]],});
                //the name usernameAutoJoin is only kept for compatability
                initModule({ location: tp.autoNamesFolder, title: "Copy Name", storeAs: "copyName", button: "Steal Name", enableConditions: [["useCustomName", true]], bindLocation: tp.automationTab.pages[1], clickFunction: function(){
                    const copiedName = retrieveCopiedName();
                    console.log("Retrieved copied name:",copiedName);
                    change("usernameAutoJoin",(copiedName||"ЅtateFarmer"));
                },});
                initModule({ location: tp.autoNamesFolder, title: "Random Name", storeAs: "randomName", button: "Randomise Name", enableConditions: [["useCustomName", true]], bindLocation: tp.automationTab.pages[1], clickFunction: function(){
                    const randomisedName = unsafeWindow.extern.generateRandomName();
                    change("usernameAutoJoin",(randomisedName||"ЅtateFarmer"));
                },});
            tp.automationTab.pages[0].addSeparator();
            initModule({ location: tp.automationTab.pages[0], title: "AutoRespawn", storeAs: "autoRespawn", bindLocation: tp.automationTab.pages[1],});
            initModule({ location: tp.automationTab.pages[0], title: "Auto Team", storeAs: "autoTeam", bindLocation: tp.automationTab.pages[1], dropdown: [{text: "Disabled", value: "disabled"}, {text: "Red Team", value: "red"}, {text: "Blue Team", value: "blue"}, {text: "Random Team", value: "random"}], defaultValue: "disabled"});
            tp.automationTab.pages[0].addSeparator();
            initFolder({ location: tp.automationTab.pages[0], title: "Game Blacklist Settings", storeAs: "gameBlacklistFolder",});//Game Blacklist Folder
                initModule({ location: tp.gameBlacklistFolder, title: "Blacklist On", storeAs: "gameBlacklist", bindLocation: tp.automationTab.pages[1],});
                initModule({ location: tp.gameBlacklistFolder, title: "Codes:", storeAs: "gameBlacklistCodes", defaultValue: "",});
                initModule({ location: tp.gameBlacklistFolder, title: "Get Code", storeAs: "getCode", button: "Retrieve", clickFunction: function(){
                    if (GAMECODE != undefined && GAMECODE != null){
                        extract("gameBlacklistCodes") != undefined ? change("gameBlacklistCodes", extract("gameBlacklistCodes")+GAMECODE+",") : change("gameBlacklistCodes", GAMECODE+",");
                    } else {
                        createPopup("Join a game first");
                    };
                },});
            tp.automationTab.pages[0].addSeparator();
            initModule({ location: tp.automationTab.pages[0], title: "LeaveGame", storeAs: "leaveGame", button: "Unjoin Game", bindLocation: tp.automationTab.pages[1], clickFunction: function(){unsafeWindow.vueApp.onLeaveGameConfirm()},});
            initModule({ location: tp.automationTab.pages[0], title: "LeaveEmpty", storeAs: "leaveEmpty", bindLocation: tp.automationTab.pages[1],});
            initModule({ location: tp.automationTab.pages[0], title: "Auto Leave", storeAs: "autoLeave", bindLocation: tp.automationTab.pages[1],});
            initModule({ location: tp.automationTab.pages[0], title: "Delay (s)", storeAs: "autoLeaveDelay", slider: {min: 0, max: 3600, step: 1}, defaultValue: 300, enableConditions: [["autoLeave",true]]});
            tp.automationTab.pages[0].addSeparator();
            initModule({ location: tp.automationTab.pages[0], title: "Gamemode", storeAs: "autoGamemode", bindLocation: tp.automationTab.pages[1], dropdown: [{text: "Disabled", value: "disabled"}, {text: "FFA", value: "ffa"}, {text: "Teams", value: "teams"}, {text: "Captula", value: "captula"}, {text: "KotC", value: "kotc"}, {text: "Randomised", value: "random"}], defaultValue: "disabled"});
            initModule({ location: tp.automationTab.pages[0], title: "Auto Region", storeAs: "autoRegion", bindLocation: tp.automationTab.pages[1], dropdown: [{text: "Disabled", value: "disabled"}, {text: "Chile", value: "santiago"}, {text: "Germany", value: "germany"}, {text: "Singapore", value: "singapore"}, {text: "Sydney", value: "sydney"}, {text: "US Central", value: "uscentral"}, {text: "US East", value: "useast"}, {text: "US West", value: "uswest"}, {text: "Randomised", value: "random"}], defaultValue: "disabled"});
            tp.automationTab.pages[0].addSeparator();
            initModule({ location: tp.automationTab.pages[0], title: "Egg Colour", storeAs: "eggColour", bindLocation: tp.automationTab.pages[1], dropdown: [{text: "Disabled", value: "disabled"}, {text: "White", value: "white"}, {text: "Light Blue", value: "lightblue"}, {text: "Light Eggshell", value: "lighteggshell"}, {text: "Eggshell", value: "eggshell"}, {text: "Dark Eggshell", value: "darkeggshell"}, {text: "Darker Eggshell", value: "darkereggshell"}, {text: "Darkest Eggshell", value: "darkesteggshell"}, {text: "Red (VIP)", value: "red"}, {text: "Purple (VIP)", value: "purple"}, {text: "Pink (VIP)", value: "pink"}, {text: "Yellow (VIP)", value: "yellow"}, {text: "Blue (VIP)", value: "blue"}, {text: "Green (VIP)", value: "green"}, {text: "Lime (VIP)", value: "lime"}, /*{text: "Randomised", value: "random"}*/], defaultValue: "disabled"});
            initModule({ location: tp.automationTab.pages[0], title: "Auto Stamp", storeAs: "autoStamp", bindLocation: tp.automationTab.pages[1], dropdown: [{text: "Disabled", value: "disabled"}, {text: "Target Stamp", value: "target"}, {text: "No Sign Stamp", value: "nosign"}, {text: "Question Mark Stamp?", value: "question"}, {text: "Peace Stamp", value: "peace"}, {text: "Thumbs Up Stamp", value: "thumbsup"}, {text: "Pablo Smile Stamp", value: "pablosmile"}], defaultValue: "disabled"});
            initModule({ location: tp.automationTab.pages[0], title: "Auto Hat", storeAs: "autoHat", bindLocation: tp.automationTab.pages[1], dropdown: [{text: "Disabled", value: "disabled"}, {text: "Ball Cap", value: "ballcap"}, {text: "Boat Fedora", value: "boatfedora"}, {text: "Top Hat", value: "tophat"}, {text: "Derby Hat", value: "derbyhat"}, {text: "Mountie Hat", value: "mountiehat"}, {text: "Pablo Hat", value: "pablohat"}], defaultValue: "disabled"});
        //BOTTING MODULES
        initFolder({ location: tp.mainPanel, title: "Botting", storeAs: "bottingFolder",});
        initTabs({ location: tp.bottingFolder, storeAs: "bottingTab" })
            initModule({ location: tp.bottingTab.pages[0], title: "Show Panel", storeAs: "showBotPanel", bindLocation: tp.bottingTab.pages[1], button: "Show Panel", clickFunction: function(){tp.botPanel.hidden=!tp.botPanel.hidden}, defaultBind:"J",});
            tp.bottingTab.pages[0].addSeparator();
            initModule({ location: tp.bottingTab.pages[0], title: "How To?", storeAs: "bottingGuide", button: "Link", clickFunction: function(){unsafeWindow.open(bottingGuideURL)},});
        //THEMING MODULES
        initFolder({ location: tp.mainPanel, title: "Theming", storeAs: "themingFolder",});
        initTabs({ location: tp.themingFolder, storeAs: "themingTab" })
            initFolder({ location: tp.themingTab.pages[0], title: "Audio Settings", storeAs: "audioFolder",});
                initModule({ location: tp.audioFolder, title: "Mute Game", storeAs: "muteGame", bindLocation: tp.themingTab.pages[1],});
                initModule({ location: tp.audioFolder, title: "DistanMult", storeAs: "distanceMult", slider: {min: 0.01, max: 2, step: 0.01}, defaultValue: 1,});
                tp.audioFolder.addSeparator();
                initModule({ location: tp.audioFolder, title: "CustomSFX", storeAs: "customSFX", bindLocation: tp.themingTab.pages[1], enableConditions: [["muteGame", false]], dropdown: retrievedSFX, });
        //MISC MODULES
        initFolder({ location: tp.mainPanel, title: "Misc", storeAs: "miscFolder",});
        initTabs({ location: tp.miscFolder, storeAs: "miscTab" })
            initModule({ location: tp.miscTab.pages[0], title: "Ad Block", storeAs: "adBlock", bindLocation: tp.miscTab.pages[1],});
            initModule({ location: tp.miscTab.pages[0], title: "VIP Spoof", storeAs: "spoofVIP", bindLocation: tp.miscTab.pages[1],});
            initModule({ location: tp.miscTab.pages[0], title: "Unlock Skins", storeAs: "unlockSkins", bindLocation: tp.miscTab.pages[1],});
            initModule({ location: tp.miscTab.pages[0], title: "Admin Spoof", storeAs: "adminSpoof", bindLocation: tp.miscTab.pages[1],});
            tp.miscTab.pages[0].addSeparator();
            initModule({ location: tp.miscTab.pages[0], title: "Unban", storeAs: "unban", bindLocation: tp.miscTab.pages[1], button: "UNBAN NOW", clickFunction: function(){
                const userConfirmed=confirm("By proceeding, you will be signed out. If you don't have an account, your stats will be lost.");
                if (userConfirmed) {
                    unban();
                };
            },});
            initModule({ location: tp.miscTab.pages[0], title: "Auto Unban", storeAs: "autoUnban", bindLocation: tp.miscTab.pages[1],});
            initModule({ location: tp.miscTab.pages[0], title: "New Proxy", storeAs: "newProxy", bindLocation: tp.miscTab.pages[1], button: "NEW PROXY", clickFunction: function(){
                const userConfirmed=confirm("Switching to a proxy URL. By proceeding, you will enter another URL for Shell Shockers but your data doesn't get transferred.");
                if (userConfirmed) {
                    newProxy();
                };
            },});
            initModule({ location: tp.miscTab.pages[0], title: "Reload Page", storeAs: "reload", bindLocation: tp.miscTab.pages[1], button: "RELOAD NOW", clickFunction: function(){
                reloadPage();
            },});
            tp.miscTab.pages[0].addSeparator();
            initModule({ location: tp.miscTab.pages[0], title: "Switch Focus", storeAs: "unfocus", bindLocation: tp.miscTab.pages[1], button: "FOCUS/UNFOCUS", defaultBind: "P", clickFunction: function(){
                if (document.pointerLockElement !== null) { //currently locked
                    noPointerPause=true; unsafeWindow.document.exitPointerLock();
                } else if (noPointerPause) { //already unlocked?
                    noPointerPause=false; canvas.requestPointerLock();
                };
            },});
            tp.miscTab.pages[0].addSeparator();
            initModule({ location: tp.miscTab.pages[0], title: "RandomPath", storeAs: "randomPath", bindLocation: tp.miscTab.pages[1], button: "Random Path", clickFunction: function(){
                findNewPath = true;
            },});
            findNewPath = false;
            tp.miscTab.pages[0].addSeparator();
            initModule({ location: tp.miscTab.pages[0], title: "SilentRoll", storeAs: "silentRoll", bindLocation: tp.miscTab.pages[1],});
            initFolder({ location: tp.miscTab.pages[0], title: "Seizure Options", storeAs: "seizureFolder",});
                initModule({ location: tp.seizureFolder, title: "SeizureX", storeAs: "enableSeizureX", bindLocation: tp.miscTab.pages[1],});
                initModule({ location: tp.seizureFolder, title: "X Amount", storeAs: "amountSeizureX", slider: {min: -6.283185307179586, max: 6.283185307179586, step: Math.PI/280}, defaultValue: 2,});
                initModule({ location: tp.seizureFolder, title: "SeizureY", storeAs: "enableSeizureY", bindLocation: tp.miscTab.pages[1],});
                initModule({ location: tp.seizureFolder, title: "Y Amount", storeAs: "amountSeizureY", slider: {min: -6.283185307179586, max: 6.283185307179586, step: Math.PI/280}, defaultValue: 2,});
        //CLIENT MODULES
        initFolder({ location: tp.mainPanel, title: "Client & About", storeAs: "clientFolder",});
        initTabs({ location: tp.clientFolder, storeAs: "clientTab" })
            initModule({ location: tp.clientTab.pages[0], title: "Hide GUI", storeAs: "hide", bindLocation: tp.clientTab.pages[1], button: "Hide!", clickFunction: function(){tp.mainPanel.hidden=!tp.mainPanel.hidden}, defaultBind:"H",});
            initModule({ location: tp.clientTab.pages[0], title: "Pop-ups", storeAs: "popups", bindLocation: tp.clientTab.pages[1], defaultValue: true,});
            tp.clientTab.pages[0].addSeparator();
            initModule({ location: tp.clientTab.pages[0], title: "Replace Logo", storeAs: "replaceLogo", bindLocation: tp.clientTab.pages[1],});
            initModule({ location: tp.clientTab.pages[0], title: "Animate Title", storeAs: "titleAnimation", bindLocation: tp.clientTab.pages[1],});
            initModule({ location: tp.clientTab.pages[0], title: "Theme", storeAs: "themeType", bindLocation: tp.clientTab.pages[1], dropdown: [
                {text: "Default", value: "defaultTheme"},
                {text: "Iceberg", value: "icebergTheme"},
                {text: "Jet Black", value: "jetblackTheme"},
                {text: "Light", value: "lightTheme"},
                {text: "Retro", value: "retroTheme"},
                {text: "Translucent", value: "translucentTheme"},
                {text: "StateFarmer", value: "statefarmerTheme"},
                {text: "Blurple", value: "blurpleTheme"},
                {text: "ShellFarm", value: "shellFarmTheme"},
            ], defaultValue: "defaultTheme", changeFunction: function(value) {
                applyTheme(value.value);
            }});
            tp.clientTab.pages[0].addSeparator();
            initModule({ location: tp.clientTab.pages[0], title: "Panic", storeAs: "panic", bindLocation: tp.clientTab.pages[1], button: "EXIT!", clickFunction: function(){if (extract("enablePanic")) { unsafeWindow.location.replace(extract("panicURL")) }}, defaultBind:"X", enableConditions: [["enablePanic",true]],});
            initFolder({ location: tp.clientTab.pages[0], title: "Panic Options", storeAs: "panicFolder",});
                initModule({ location: tp.panicFolder, title: "Enable", storeAs: "enablePanic", bindLocation: tp.clientTab.pages[1], defaultValue: true,});
                initModule({ location: tp.panicFolder, title: "Set URL", storeAs: "panicURL", defaultValue: "https://classroom.google.com/", enableConditions: [["enablePanic",true]],});
            tp.clientTab.pages[0].addSeparator();
            let presetList = [];
            Object.entries(inbuiltPresets).forEach(([key, value]) => {//Get all presets from inbuilt presets var
                let options = {};
                options["text"] = key;//not the best way to add things to a dictionary, but the only way i could get to work
                options["value"] = key;
                presetList.push(options);
            });
            //PRESETS: OakSwingZZZ 😎
            initFolder({ location: tp.clientTab.pages[0], title: "Presets", storeAs: "presetFolder",});
                initModule({ location: tp.presetFolder, title: "Preset List", storeAs: "selectedPreset", defaultValue: "onlypuppy7's Config", bindLocation: tp.clientTab.pages[1], dropdown: presetList, });
                initModule({ location: tp.presetFolder, title: "Apply", storeAs: "applyPreset", button: "Apply Preset", clickFunction: function () {
                    const userConfirmed = confirm( "Are you sure you want to continue? This will replace most of your current config." );
                        if (userConfirmed) { applySettings(inbuiltPresets[extract("selectedPreset")], true); };
                    },
                });
                tp.presetFolder.addSeparator();
                initModule({ location: tp.presetFolder, title: "Save", storeAs: "savePreset", button: "Save As Preset", clickFunction: function () {
                    console.log("Config Main: ", configMain);
                    let saveString = '';
                    const addParam = function(module,setTo) {saveString=saveString+module+">"+JSON.stringify(setTo)+"<"};
                    Object.entries(configMain).forEach(([key, value]) => {
                        console.log(key, value);
                        if (typeof(value) == 'string') {
                            try {
                                let dropdown = extractAsDropdownInt(key)
                                value = dropdown;
                            } catch (error) {
                                //dont care lmaoooo
                            };
                        };
                        addParam(key, value);
                    });
                    saveString = saveString.substring(0, saveString.length - 1);
                    let presetName = prompt("Name of preset:"); // asks user for name of preset
                    if (presetName == "" || presetName == null) {
                        console.log("User cancelled save");
                    } else {
                        let result = saveUserPreset(presetName, saveString);//saves user preset
                        addUserPresets(loadUserPresets()); //updates inbuiltPresets to include
                        console.log("Saved Preset: ", saveString);
                        console.log("User Preset Result: ", result);
                    };
                    console.log("InbuiltPrests:");
                    console.log(inbuiltPresets);
                    initMenu(false); //Reloads menu to add to dropdown list
                },});
                initModule({ location: tp.presetFolder, title: "Delete", storeAs: "deletePreset", button: "Remove Preset", clickFunction: function () { // Function won't do anything if they select a preset that was loaded in the gamecode
                    let currUserPresets = loadUserPresets(); //gets current presets from storage
                    delete currUserPresets[extract("selectedPreset")];//deletes
                    delete inbuiltPresets[extract("selectedPreset")];//deletes
                    save(presetStorageLocation, currUserPresets); // saves cnages to file.
                    console.log("Current User Presets: ",currUserPresets);
                    initMenu(false); //reloads menu
                },});
                tp.presetFolder.addSeparator();
                initModule({ location: tp.presetFolder, title: "Import", storeAs: "importPreset", button: "Import Preset", clickFunction: function () {
                    let preset = prompt("Paste preset here:"); // asks user to paste preset
                    if (preset == "" || preset == null) {
                        console.log("User cancelled save");
                    } else {
                        const pattern = /([a-zA-Z]*>[^<]*<)+[a-zA-Z]*>[^<]*/;
                        if (pattern.test(preset)){
                            let presetName = prompt("Name of preset:"); // asks user for name of preset
                            if (presetName == "" || presetName == null) {
                                console.log("User cancelled save");
                            } else {
                                let result = saveUserPreset(presetName, preset);//saves user preset
                                addUserPresets(loadUserPresets()); //updates inbuiltPresets to include
                                console.log("Saved Preset: ", preset);
                                console.log("User Preset Result: ", result);
                            }
                        } else {
                            alert("Not A Valid Preset!");
                            console.log("Preset Not Valid");
                        };
                        initMenu(false);
                    };
                },});
                initModule({ location: tp.presetFolder, title: "Export", storeAs: "exportPreset", button: "Copy To Clipboard", clickFunction: function () {
                    let saveString = '';
                    const addParam = function(module,setTo) {saveString=saveString+module+">"+JSON.stringify(setTo)+"<"};
                    Object.entries(configMain).forEach(([key, value]) => {
                        console.log(key, value);
                        if (typeof(value) == 'string') {
                            try {
                                let dropdown = extractAsDropdownInt(key)
                                value = dropdown;
                            } catch (error) {
                                //dont care lmaoooo
                            };
                        };
                        addParam(key, value);
                    });
                    saveString = saveString.substring(0, saveString.length - 1);
                    GM_setClipboard(saveString, "text", () => console.log("Clipboard set!"));
                    createPopup("Preset copied to clipboard...")
                },});
            tp.clientTab.pages[0].addSeparator();
            initFolder({ location: tp.clientTab.pages[0], title: "Creator's Links", storeAs: "linksFolder",});
                initModule({ location: tp.linksFolder, title: "Discord", storeAs: "discord", button: "Link", clickFunction: function(){unsafeWindow.open(discordURL)},});
                initModule({ location: tp.linksFolder, title: "GitHub", storeAs: "github", button: "Link", clickFunction: function(){unsafeWindow.open(githubURL)},});
            tp.clientTab.pages[0].addSeparator();
            initModule({ location: tp.clientTab.pages[0], title: "Reset", storeAs: "clear", button: "DELETE", clickFunction: function(){
                const userConfirmed=confirm("Are you sure you want to continue? This will clear all stored module states and keybinds.");
                if (userConfirmed) {
                    initMenu(true);
                    alert("Reset to defaults.");
                };
            },});
            initModule({ location: tp.clientTab.pages[0], title: "Debug", storeAs: "debug", bindLocation: tp.clientTab.pages[1],});
        tp.mainPanel.addSeparator();
        initModule({ location: tp.mainPanel, title: "Guide", storeAs: "documentation", button: "Link", clickFunction: function(){unsafeWindow.open(featuresGuideURL)},});


        tp.botPanel = new Tweakpane.Pane();
        tp.botPanel.title = "StateFarm Bot Control Panel";
        tp.botPanel.containerElem_.style.left = "15%";
        tp.botPanel.containerElem_.style.top = "25%";
        tp.botPanel.hidden=true;

        tp["botTabs"]=tp.botPanel.addTab({
            pages: [
                {title: 'Deploy'},
                {title: 'Manage'},
                {title: 'Params'},
                {title: 'Info'},
            ],
        });

        //DEPLOY STUFF
        initModule({ location: tp.botTabs.pages[0], title: "Bots Amount", storeAs: "numberBots", slider: {min: 1, max: 18, step: 1}, defaultValue: 1,});
        initModule({ location: tp.botTabs.pages[0], title: "Deploy", storeAs: "deployBots", button: "START BOTS!", bindLocation: tp.bottingTab.pages[1], clickFunction: function(){deployBots()},});
        tp.botTabs.pages[0].addSeparator();
        initModule({ location: tp.botTabs.pages[0], title: "Use Names", storeAs: "useCustomNameBots", defaultValue: true, botParam: true,});
        initModule({ location: tp.botTabs.pages[0], title: "Bot Name", storeAs: "botUsername", defaultValue: "ЅtateFarmer", enableConditions: [["useCustomNameBots",true]],});
        initModule({ location: tp.botTabs.pages[0], title: "AntiDupe", storeAs: "botAntiDupe", enableConditions: [["useCustomNameBots",true]],});
        initModule({ location: tp.botTabs.pages[0], title: "CopyNames", storeAs: "botCopyName", enableConditions: [["useCustomNameBots",true]],});
        tp.botTabs.pages[0].addSeparator();
        initModule({ location: tp.botTabs.pages[0], title: "Bot Colour", storeAs: "eggColourBots", dropdown: [{text: "Disabled", value: "disabled"}, {text: "White", value: "white"}, {text: "Light Blue", value: "lightblue"}, {text: "Light Eggshell", value: "lighteggshell"}, {text: "Eggshell", value: "eggshell"}, {text: "Dark Eggshell", value: "darkeggshell"}, {text: "Darker Eggshell", value: "darkereggshell"}, {text: "Darkest Eggshell", value: "darkesteggshell"}, {text: "Red (VIP)", value: "red"}, {text: "Purple (VIP)", value: "purple"}, {text: "Pink (VIP)", value: "pink"}, {text: "Yellow (VIP)", value: "yellow"}, {text: "Blue (VIP)", value: "blue"}, {text: "Green (VIP)", value: "green"}, {text: "Lime (VIP)", value: "lime"}, {text: "Randomised", value: "random"}], defaultValue: "darkesteggshell",});
        initModule({ location: tp.botTabs.pages[0], title: "Bot Stamp", storeAs: "autoStampBots", dropdown: [{text: "Disabled", value: "disabled"}, {text: "Target Stamp", value: "target"}, {text: "No Sign Stamp", value: "nosign"}, {text: "Question Mark Stamp?", value: "question"}, {text: "Peace Stamp", value: "peace"}, {text: "Thumbs Up Stamp", value: "thumbsup"}, {text: "Pablo Smile Stamp", value: "pablosmile"}, {text: "Randomised", value: "random"}], defaultValue: "pablosmile",});
        initModule({ location: tp.botTabs.pages[0], title: "Bot Hat", storeAs: "autoHatBots", dropdown: [{text: "Disabled", value: "disabled"}, {text: "Ball Cap", value: "ballcap"}, {text: "Boat Fedora", value: "boatfedora"}, {text: "Top Hat", value: "tophat"}, {text: "Derby Hat", value: "derbyhat"}, {text: "Mountie Hat", value: "mountiehat"}, {text: "Pablo Hat", value: "pablohat"}, {text: "Randomised", value: "random"}], defaultValue: "pablohat",});
        //MANAGE STUFF
        initModule({ location: tp.botTabs.pages[1], title: "Close Bots", storeAs: "killBots", button: "CLOSE TABS", clickFunction: function(){ broadcastToBots("kill") },});
        initModule({ location: tp.botTabs.pages[1], title: "Refresh Pages", storeAs: "refreshBots", button: "REFRESH", clickFunction: function(){ broadcastToBots("refresh") },});
        tp.botTabs.pages[1].addSeparator();
        initModule({ location: tp.botTabs.pages[1], title: "New Proxies", storeAs: "newProxyBots", button: "NEW PROXIES", clickFunction: function(){ broadcastToBots("newproxy") },});
        initModule({ location: tp.botTabs.pages[1], title: "Unban All", storeAs: "unbanBots", button: "UNBAN BOTS", clickFunction: function(){ broadcastToBots("unban") },});
        initModule({ location: tp.botTabs.pages[1], title: "AutoUnbanBot", storeAs: "botAutoUnban", botParam: true,});
        tp.botTabs.pages[1].addSeparator();
        initModule({ location: tp.botTabs.pages[1], title: "Don'tKillMe", storeAs: "botNoKillMe", botParam: true,});
        initModule({ location: tp.botTabs.pages[1], title: "Don'tKillBot", storeAs: "botNoKillBots", botParam: true,});
        tp.botTabs.pages[1].addSeparator();
        initModule({ location: tp.botTabs.pages[1], title: "Leave Games", storeAs: "leaveBots", button: "LEAVE", clickFunction: function(){ broadcastToBots("leave") },});
        initModule({ location: tp.botTabs.pages[1], title: "Leave Empty", storeAs: "leaveEmptyBots", botParam: true,});
        initModule({ location: tp.botTabs.pages[1], title: "AutoLeave", storeAs: "autoLeaveBots", botParam: true,});
        initModule({ location: tp.botTabs.pages[1], title: "Delay (s)", storeAs: "autoLeaveDelayBots", slider: {min: 0, max: 3600, step: 1}, defaultValue: 300, enableConditions: [["autoLeaveBots",true]], botParam: true,});
        tp.botTabs.pages[1].addSeparator();
        initModule({ location: tp.botTabs.pages[1], title: "Spam Report", storeAs: "reportBots", button: "SPAM REPORT!", clickFunction: function(){ broadcastToBots("report") },});
        tp.botTabs.pages[1].addSeparator();
        initModule({ location: tp.botTabs.pages[1], title: "Join Game", storeAs: "botAutoJoin", botParam: true,});
        initModule({ location: tp.botTabs.pages[1], title: "Game Code", storeAs: "botJoinCode", defaultValue: "CODE", botParam: true,});
        initModule({ location: tp.botTabs.pages[1], title: "Get Code", storeAs: "getCodeBots", button: "Retrieve", clickFunction: function(){change("botJoinCode",GAMECODE)}, botParam: true,});
        tp.botTabs.pages[1].addSeparator();
        initModule({ location: tp.botTabs.pages[1], title: "GameType", storeAs: "autoGamemodeBots", dropdown: [{text: "Disabled", value: "disabled"}, {text: "FFA", value: "ffa"}, {text: "Teams", value: "teams"}, {text: "Captula", value: "captula"}, {text: "KotC", value: "kotc"}, {text: "Randomised", value: "random"}], defaultValue: "disabled", botParam: true,});
        initModule({ location: tp.botTabs.pages[1], title: "AutoRegion", storeAs: "autoRegionBots", dropdown: [{text: "Disabled", value: "disabled"}, {text: "Chile", value: "santiago"}, {text: "Germany", value: "germany"}, {text: "Singapore", value: "singapore"}, {text: "Sydney", value: "sydney"}, {text: "US Central", value: "uscentral"}, {text: "US East", value: "useast"}, {text: "US West", value: "uswest"}, {text: "Randomised", value: "random"}], defaultValue: "disabled", botParam: true,});
        tp.botTabs.pages[1].addSeparator();
        initModule({ location: tp.botTabs.pages[1], title: "Select Team", storeAs: "botTeam", botParam: true, dropdown: [{text: "Disabled", value: "disabled"}, {text: "Red Team", value: "red"}, {text: "Blue Team", value: "blue"}, {text: "Random Team", value: "random"}], defaultValue: "disabled",});
        //PARAMS STUFF
        initModule({ location: tp.botTabs.pages[2], title: "DoPlay", storeAs: "botRespawn", botParam: true,});
        initModule({ location: tp.botTabs.pages[2], title: "LowRes", storeAs: "botLowRes", botParam: true,})
        initModule({ location: tp.botTabs.pages[2], title: "RenderDelay", storeAs: "renderDelayBots", slider: {min: 0, max: 30000, step: 10}, defaultValue: 0, botParam: true,});
        initModule({ location: tp.botTabs.pages[2], title: "MuteGame", storeAs: "botMuteGame", botParam: true,})
        tp.botTabs.pages[2].addSeparator();
        initModule({ location: tp.botTabs.pages[2], title: "DoSeizure", storeAs: "botSeizure", botParam: true, enableConditions: [["botRespawn",true]],});
        tp.botTabs.pages[2].addSeparator();
        initModule({ location: tp.botTabs.pages[2], title: "DoTallChat", storeAs: "botTallChat", botParam: true,});
        initModule({ location: tp.botTabs.pages[2], title: "DoMock", storeAs: "botMock", botParam: true,});
        initModule({ location: tp.botTabs.pages[2], title: "DoAutoEZ", storeAs: "botAutoEZ", botParam: true,});
        initModule({ location: tp.botTabs.pages[2], title: "DoChAccuse", storeAs: "botCheatAccuse", botParam: true,});
        tp.botTabs.pages[2].addSeparator();
        initModule({ location: tp.botTabs.pages[2], title: "DoSpam", storeAs: "botSpam", botParam: true,});
        initModule({ location: tp.botTabs.pages[2], title: "SpamText", storeAs: "spamChatTextBot", defaultValue: "ЅtateFarm Client On Top! ", botParam: true,});
        tp.botTabs.pages[2].addSeparator();
        initModule({ location: tp.botTabs.pages[2], title: "SelectWeapon", storeAs: "botWeapon", dropdown: [{text: "EggK-47", value: "eggk47"}, {text: "Scrambler", value: "scrambler"}, {text: "Free Ranger", value: "freeranger"}, {text: "RPEGG", value: "rpegg"}, {text: "Whipper", value: "whipper"}, {text: "Crackshot", value: "crackshot"}, {text: "Tri-Hard", value: "trihard"}, {text: "Randomised", value: "random"}], botParam: true, defaultValue: "eggk47", enableConditions: [["botRespawn",true]],});
        initModule({ location: tp.botTabs.pages[2], title: "DoMove", storeAs: "botAutoMove", botParam: true, enableConditions: [["botRespawn",true]],});
        initModule({ location: tp.botTabs.pages[2], title: "DoShoot", storeAs: "botAutoShoot", botParam: true, enableConditions: [["botRespawn",true]],});
        initModule({ location: tp.botTabs.pages[2], title: "DoAimbot", storeAs: "botAimbot", botParam: true, enableConditions: [["botRespawn",true]],});;
        //INFO STUFF
        initModule({ location: tp.botTabs.pages[3], storeAs: "botOnline", monitor: 17.5, botParam: true,});

        if (!AUTOMATED) {
            if (!load("StateFarmConfigMainPanel") || reset) {
                saveConfig();
            } else {
                console.log("##############################################")
                tp.mainPanel.importPreset(load("StateFarmConfigMainPanel"));
                tp.botPanel.importPreset(load("StateFarmConfigBotPanel"));
            };
        };

        updateConfig();

        setTimeout(() => {
            if (AUTOMATED) { //why after 500ms? perhaps we'll never know. maybe because it gives a visual indication that statefarm is statefarming.
                tp.mainPanel.hidden=true;
            };
            updateHiddenAndDisabled();
        }, 500);

        menuInitiated = true;
        const defaultSpamText = ("dsc.gg/sfnetwork: "+menuTitle+" On Top! ");

        if (extract("spamChatText").includes("On Top!")) { change("spamChatText",defaultSpamText) };
        if (extract("spamChatTextBot").includes("On Top!")) { change("spamChatTextBot",defaultSpamText) };

        makeDraggable(tp.mainPanel.containerElem_);
        makeDraggable(tp.botPanel.containerElem_);
    };
    const onContentLoaded = function() {
        console.log("StateFarm: initMenu()");
        initMenu();
        console.log("StateFarm: applyStylesAddElements()");
        applyStylesAddElements(); //set font and change menu cass, and other stuff to do with the page
        const intervalId1 = setInterval(everySecond, 1000);
        const intervalId2 = setInterval(everyDecisecond, 100);
        applyStateFarmLogo();
        const observer = new MutationObserver(applyStateFarmLogo);
        observer.observe(document.body, { subtree: true, childList: true });
    };
    //visual functions
    const createPopup = function (text,type) {
        console.log("Creating Popup Type:",type,"With Text:",text);
        try {
            if (extract("popups")) {
                const messageContainer = document.getElementById('message-container');
                const messages = messageContainer.getElementsByClassName(scrambledMsgEl);
                if (messages.length > 5) {
                    messageContainer.removeChild(messages[0]);
                };
                const clonedMsgElement = msgElement.cloneNode(true);
                clonedMsgElement.innerText = text;
                switch (type) {
                    case ("success"):
                        clonedMsgElement.style.border='2px solid rgba(0, 255, 0, 0.5)'; break;
                    case ("error"):
                        clonedMsgElement.style.border='2px solid rgba(255, 0, 0, 0.5)'; break;
                };
                clonedMsgElement.style.display='none';
                const messageOffset=(messages.length+1)*50;
                clonedMsgElement.style.bottom=messageOffset+"px";
                void clonedMsgElement.offsetWidth;
                clonedMsgElement.style.display='';
                messageContainer.appendChild(clonedMsgElement);
                //reorder such that newest is lowest
                for (let i=messages.length-1;i>=0;i--) {
                    messages[i].style.bottom=(((messages.length-i)*50)-40)+"px";
                };
            };
        } catch (error) {
            // Handle the error and display an error message onscreen
            console.error("An error occurred:", error);
            alert("Bollocks! If you're getting this message, injection probably failed. To solve this, perform CTRL+F5 - this performs a hard reload. If this does not work, contact the developers.");
        }
    };
    const applyStylesAddElements = function (themeToApply = "null") {
        const head = document.head || document.getElementsByTagName('head').pages[0];

        if (AUTOMATED) {
            automatedBorder = document.createElement('div');
            automatedBorder.setAttribute('id', 'automated-border');
            document.body.appendChild(automatedBorder);

            const automatedBorderStyle = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 5px solid rgba(255, 0, 0, 1);
                pointer-events: none;
                z-index: 999999999;
            `;
            automatedBorder.style.cssText = automatedBorderStyle;
        };

        //menu customisation (apply font, button widths, adjust checkbox right slightly, make menu appear on top, add anim to message)
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @font-face {
                font-family: "Bahnschrift";
                src: url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.eot");
                src: url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.eot?#iefix")format("embedded-opentype"),
                url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.woff2")format("woff2"),
                url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.woff")format("woff"),
                url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.ttf")format("truetype"),
                url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.svg#Bahnschrift")format("svg");
            }
            .tp-dfwv, .tp-sglv_i, .tp-rotv_t, .tp-fldv_t, .tp-ckbv_l, .tp-txtv_i, .tp-lblv_l, .tp-tbiv_t, .coords, .gameinfo, .playerstats, .playerinfo, .automated {
                font-family: 'Bahnschrift', sans-serif !important;
                font-size: 16px;
                z-index: 9999 !important;
            }
            .tp-rotv_m, .tp-fldv_m {
                display: none;
            }
            .tp-dfwv {
                min-width: 300px;
            }
            .tp-rotv_t {
                cursor: move;
                user-select: none;
            }
            .tp-tbiv_t {
                font-family: 'Bahnschrift';
                font-size: 13px;
            }
            .tp-lblv_v, .tp-lstv, .tp-btnv_b, .tp-btnv_t {
                font-family: 'Bahnschrift';
                font-size: 12px;
            }
            .tp-mllv {
                font-family: 'Bahnschrift';
                font-size: 12px;
                letter-spacing: -1px;
                width: 290px;
                margin-left: -130px !important;
            }
            .tp-mllv_i::-webkit-scrollbar-thumb {
                background-color: #888; /* Adjust the color as needed */
                border: 2px solid #555; /* Change the color of the border and adjust the width as needed */
            }
            .tp-mllv_i::-webkit-scrollbar-track {
                background-color: #000; /* Change the color as needed */
            }
            .tp-lblv_l {
                font-size: 14px;
                letter-spacing: -1px;
            }
            .tp-btnv {
                width: 100px;
                margin-left: 60px !important;
            }
            .tp-ckbv_w {
                margin-left: 4px !important;
            }
            .tp-dfwv, .tp-rotv, .tp-rotv_c, .tp-fldv, .tp-fldv_c, .tp-lblv, .tp-lstv, .tp-btnv, .tp-sldv {
                z-index: 99999 !important;
                white-space: nowrap !important;
            }
            @keyframes msg {
                from {
                    transform: translate(-120%, 0);
                    opacity: 0;
                }
                to {
                    transform: none;
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(styleElement);
        applyTheme();

        //initiate message div and css and shit
        msgElement = document.createElement('div'); // create the element directly
        scrambledMsgEl = getScrambled();
        msgElement.classList.add(scrambledMsgEl);
        msgElement.setAttribute('style', `
            position: absolute;
            left: 10px;
            color: #fff;
            background: rgba(0, 0, 0, 0.7);
            font-weight: normal;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            font-family: 'Bahnschrift', sans-serif !important;
            font-size: 16px;
            z-index: 9999 !important;
        `);
        document.body.appendChild(msgElement);
        msgElement.style.display = 'none';
        const messageContainer = document.createElement('div'); //so it can be cloned. i think.
        messageContainer.id = 'message-container';
        document.body.appendChild(messageContainer);
        //initiate coord div and css and shit
        coordElement = document.createElement('div'); // create the element directly
        coordElement.classList.add('coords');
        coordElement.setAttribute('style', `
            position: fixed;
            top: 0px;
            left: 0px;
            height: auto;
            max-height: 30px;
            min-height: 30px;
            text-wrap: nowrap;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            font-weight: bolder;
            padding: 2px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 999999;
        `);
        document.body.appendChild(coordElement);
        coordElement.style.display = 'none';
        //initiate game info div and css and shit
        gameInfoElement = document.createElement('div'); // create the element directly
        gameInfoElement.classList.add('gameinfo');
        gameInfoElement.setAttribute('style', `
            position: fixed;
            bottom: 0px;
            left: 0px;
            height: auto;
            max-height: 30px;
            min-height: 30px;
            text-wrap: nowrap;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            font-weight: bolder;
            padding: 2px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 999999;
        `);
        document.body.appendChild(gameInfoElement);
        gameInfoElement.style.display = 'none';
        //initiate hp div and css and shit
        playerstatsElement = document.createElement('div'); // create the element directly
        playerstatsElement.classList.add('playerstats');
        playerstatsElement.setAttribute('style', `
            position: absolute;
            top: 20px;
            left: 280px;
            height: auto;
            min-height: 30px;
            text-wrap: nowrap;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            font-weight: bolder;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 999999;
        `);
        document.body.appendChild(playerstatsElement);
        playerstatsElement.style.display = 'none';
        //initiate player info div and css and shit
        playerinfoElement = document.createElement('div'); // create the element directly
        playerinfoElement.classList.add('playerinfo');
        playerinfoElement.setAttribute('style', `
            position: absolute;
            top: 80%;
            left: 90%;
            height: auto;
            max-height: 102;
            text-wrap: nowrap;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            font-weight: bolder;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 999999;
        `);
        document.body.appendChild(playerinfoElement);
        playerinfoElement.style.display = 'none';
        //initiate bloom indicator div and css and shit
        redCircle = document.createElement('div');
        redCircle.style.position = 'fixed';
        redCircle.style.width = '5px';
        redCircle.style.height = '5px';
        redCircle.style.borderRadius = '50%';
        redCircle.style.backgroundColor = 'red';
        redCircle.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(redCircle);
        //initiate minangle indicator div and css and shit
        minangleCircle = document.createElement('div');
        minangleCircle.style.position = 'fixed';
        minangleCircle.style.borderRadius = '100%';
        minangleCircle.style.border = 'thin solid red'
        minangleCircle.style.transform = 'translate(50%, 50%)';
        minangleCircle.style.pointerEvents = 'none';
        document.body.appendChild(minangleCircle);

        if (load("HUD-Positions") == null){
            hudElementPositions["coordElement"] = {"top": coordElement.getBoundingClientRect().top, "left": coordElement.getBoundingClientRect().left};
            hudElementPositions["gameInfoElement"] = {"top": gameInfoElement.getBoundingClientRect().top, "left": gameInfoElement.getBoundingClientRect().left};
            hudElementPositions["playerstatsElement"] = {"top": playerstatsElement.getBoundingClientRect().top, "left": playerstatsElement.getBoundingClientRect().left};
            hudElementPositions["playerinfoElement"] = {"top": playerinfoElement.getBoundingClientRect().top, "left": playerinfoElement.getBoundingClientRect().left};
            save("HUD-Positions", hudElementPositions);
        } else {
            hudElementPositions = load("HUD-Positions");

            coordElement.style.top = hudElementPositions["coordElement"]["top"] + "px";
            gameInfoElement.style.top = hudElementPositions["gameInfoElement"]["top"] + "px";
            playerstatsElement.style.top = hudElementPositions["playerstatsElement"]["top"] + "px";
            playerinfoElement.style.top = hudElementPositions["playerinfoElement"]["top"] + "px";

            coordElement.style.left = hudElementPositions["coordElement"]["left"] + "px";
            gameInfoElement.style.left = hudElementPositions["gameInfoElement"]["left"] + "px";
            playerstatsElement.style.left = hudElementPositions["playerstatsElement"]["left"] + "px";
            playerinfoElement.style.left = hudElementPositions["playerinfoElement"]["left"] + "px";
        }

    };
    const makeDraggable = function(element,notMenu) {
        if (element) {
            let offsetX, offsetY;
            element.addEventListener('mousedown', function(e) {
                const dragElement = function(e) {
                    const x = (e.clientX - offsetX) / unsafeWindow.innerWidth * 100;
                    const y = (e.clientY - offsetY) / unsafeWindow.innerHeight * 100;
                    const maxX = 100 - (element.offsetWidth / unsafeWindow.innerWidth * 100);
                    const maxY = 100 - (element.offsetHeight / unsafeWindow.innerHeight * 100);
                    element.style.left = `${Math.max(0, Math.min(x, maxX))}%`;
                    element.style.top = `${Math.max(0, Math.min(y, maxY))}%`;
                };
                if (notMenu||e.target.classList.contains('tp-rotv_t')) {
                    offsetX = e.clientX - element.getBoundingClientRect().left;
                    offsetY = e.clientY - element.getBoundingClientRect().top;
                    document.addEventListener('mousemove', dragElement);
                    document.addEventListener('mouseup', function() {
                        document.removeEventListener('mousemove', dragElement);
                    });
                    e.preventDefault(); // Prevent text selection during drag
                };
            });
        };
    };

    const makeHudElementDragable = function (element) {
        if (element.getAttribute("drag-true") != "true") {
            element.addEventListener("mousedown", function (e) {
                let offsetX = e.clientX - parseInt(window.getComputedStyle(this).left);
                let offsetY = e.clientY - parseInt(window.getComputedStyle(this).top);

                function mouseMoveHandler(e) {
                    let newX = e.clientX - offsetX;
                    let newY = e.clientY - offsetY;
                    if (newX >= 0 && newX + element.getBoundingClientRect().width <= window.innerWidth) {
                        element.style.left = newX + "px";
                    };
                    if (newY >= 0 && newY + element.getBoundingClientRect().height <= window.innerHeight) {
                        element.style.top = newY + "px";
                    };
                };

                function reset() {
                    window.removeEventListener("mousemove", mouseMoveHandler);
                    window.removeEventListener("mouseup", reset);

                    //saves new positions
                    hudElementPositions["coordElement"] = {"top": coordElement.getBoundingClientRect().top, "left": coordElement.getBoundingClientRect().left};
                    hudElementPositions["gameInfoElement"] = {"top": gameInfoElement.getBoundingClientRect().top, "left": gameInfoElement.getBoundingClientRect().left};
                    hudElementPositions["playerstatsElement"] = {"top": playerstatsElement.getBoundingClientRect().top, "left": playerstatsElement.getBoundingClientRect().left};
                    hudElementPositions["playerinfoElement"] = {"top": playerinfoElement.getBoundingClientRect().top, "left": playerinfoElement.getBoundingClientRect().left};
                    save("HUD-Positions", hudElementPositions);
                };

                window.addEventListener("mousemove", mouseMoveHandler);
                window.addEventListener("mouseup", reset);
            });

            element.setAttribute("drag-true", "true");
        };
    };

    const applyTheme = function(setTheme) {
        setTheme = (setTheme||extract("themeType")||"defaultTheme");
        let rootTheme
        switch (setTheme) {
            case ("defaultTheme"):
                rootTheme = `
                --tp-base-background-color: hsla(230, 7%, 17%, 1.00);
                --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
                --tp-button-background-color: hsla(230, 7%, 70%, 1.00);
                --tp-button-background-color-active: hsla(230, 7%, 85%, 1.00);
                --tp-button-background-color-focus: hsla(230, 7%, 80%, 1.00);
                --tp-button-background-color-hover: hsla(230, 7%, 75%, 1.00);
                --tp-button-foreground-color: hsla(230, 7%, 17%, 1.00);
                --tp-container-background-color: hsla(230, 7%, 75%, 0.10);
                --tp-container-background-color-active: hsla(230, 7%, 75%, 0.25);
                --tp-container-background-color-focus: hsla(230, 7%, 75%, 0.20);
                --tp-container-background-color-hover: hsla(230, 7%, 75%, 0.15);
                --tp-container-foreground-color: hsla(230, 7%, 75%, 1.00);
                --tp-groove-foreground-color: hsla(230, 7%, 75%, 0.10);
                --tp-input-background-color: hsla(230, 7%, 75%, 0.10);
                --tp-input-background-color-active: hsla(230, 7%, 75%, 0.25);
                --tp-input-background-color-focus: hsla(230, 7%, 75%, 0.20);
                --tp-input-background-color-hover: hsla(230, 7%, 75%, 0.15);
                --tp-input-foreground-color: hsla(230, 7%, 75%, 1.00);
                --tp-label-foreground-color: hsla(230, 7%, 75%, 0.70);
                --tp-monitor-background-color: hsla(230, 7%, 0%, 0.20);
                --tp-monitor-foreground-color: hsla(230, 7%, 75%, 0.70);`; break;
            case ( "icebergTheme" ):
                rootTheme = `
                --tp-base-background-color: hsla(230, 20%, 11%, 1.00);
                --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
                --tp-button-background-color: hsla(230, 10%, 80%, 1.00);
                --tp-button-background-color-active: hsla(230, 10%, 95%, 1.00);
                --tp-button-background-color-focus: hsla(230, 10%, 90%, 1.00);
                --tp-button-background-color-hover: hsla(230, 10%, 85%, 1.00);
                --tp-button-foreground-color: hsla(230, 20%, 11%, 1);
                --tp-container-background-color: hsla(230, 25%, 16%, 1.00);
                --tp-container-background-color-active: hsla(230, 25%, 31%, 1.00);
                --tp-container-background-color-focus: hsla(230, 25%, 26%, 1.00);
                --tp-container-background-color-hover: hsla(230, 25%, 21%, 1.00);
                --tp-container-foreground-color: hsla(230, 10%, 80%, 1.00);
                --tp-groove-foreground-color: hsla(230, 20%, 8%, 1.00);
                --tp-input-background-color: hsla(230, 20%, 8%, 1.00);
                --tp-input-background-color-active: hsla(230, 28%, 23%, 1.00);
                --tp-input-background-color-focus: hsla(230, 28%, 18%, 1.00);
                --tp-input-background-color-hover: hsla(230, 20%, 13%, 1.00);
                --tp-input-foreground-color: hsla(230, 10%, 80%, 1.00);
                --tp-label-foreground-color: hsla(230, 12%, 48%, 1.00);
                --tp-monitor-background-color: hsla(230, 20%, 8%, 1.00);
                --tp-monitor-foreground-color: hsla(230, 12%, 48%, 1.00);`; break;
            case ( "jetblackTheme" ):
                rootTheme = `
                --tp-base-background-color: hsla(0, 0%, 0%, 1.00);
                --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
                --tp-button-background-color: hsla(0, 0%, 70%, 1.00);
                --tp-button-background-color-active: hsla(0, 0%, 85%, 1);
                --tp-button-background-color-focus: hsla(0, 0%, 80%, 1.00);
                --tp-button-background-color-hover: hsla(0, 0%, 75%, 1.00);
                --tp-button-foreground-color: hsla(0, 0%, 0%, 1.00);
                --tp-container-background-color: hsla(0, 0%, 10%, 1.00);
                --tp-container-background-color-active: hsla(0, 0%, 25%, 1.00);
                --tp-container-background-color-focus: hsla(0, 0%, 20%, 1.00);
                --tp-container-background-color-hover: hsla(0, 0%, 15%, 1.00);
                --tp-container-foreground-color: hsla(0, 0%, 50%, 1.00);
                --tp-groove-foreground-color: hsla(0, 0%, 10%, 1.00);
                --tp-input-background-color: hsla(0, 0%, 10%, 1.00);
                --tp-input-background-color-active: hsla(0, 0%, 25%, 1.00);
                --tp-input-background-color-focus: hsla(0, 0%, 20%, 1.00);
                --tp-input-background-color-hover: hsla(0, 0%, 15%, 1.00);
                --tp-input-foreground-color: hsla(0, 0%, 70%, 1.00);
                --tp-label-foreground-color: hsla(0, 0%, 50%, 1.00);
                --tp-monitor-background-color: hsla(0, 0%, 8%, 1.00);
                --tp-monitor-foreground-color: hsla(0, 0%, 48%, 1.00);`; break;
            case ( "lightTheme" ):
                rootTheme = `
                --tp-base-background-color: hsla(230, 5%, 90%, 1.00);
                --tp-base-shadow-color: hsla(0, 0%, 0%, 0.10);
                --tp-button-background-color: hsla(230, 7%, 75%, 1.00);
                --tp-button-background-color-active: hsla(230, 7%, 60%, 1.00);
                --tp-button-background-color-focus: hsla(230, 7%, 65%, 1.00);
                --tp-button-background-color-hover: hsla(230, 7%, 70%, 1.00);
                --tp-button-foreground-color: hsla(230, 10%, 30%, 1.00);
                --tp-container-background-color: hsla(230, 15%, 30%, 0.20);
                --tp-container-background-color-active: hsla(230, 15%, 30%, 0.32);
                --tp-container-background-color-focus: hsla(230, 15%, 30%, 0.28);
                --tp-container-background-color-hover: hsla(230, 15%, 30%, 0.24);
                --tp-container-foreground-color: hsla(230, 10%, 30%, 1.00);
                --tp-groove-foreground-color: hsla(230, 15%, 30%, 0.10);
                --tp-input-background-color: hsla(230, 15%, 30%, 0.10);
                --tp-input-background-color-active: hsla(230, 15%, 30%, 0.22);
                --tp-input-background-color-focus: hsla(230, 15%, 30%, 0.18);
                --tp-input-background-color-hover: hsla(230, 15%, 30%, 0.14);
                --tp-input-foreground-color: hsla(230, 10%, 30%, 1.00);
                --tp-label-foreground-color: hsla(230, 10%, 30%, 0.70);
                --tp-monitor-background-color: hsla(230, 15%, 30%, 0.10);
                --tp-monitor-foreground-color: hsla(230, 10%, 30%, 0.50);`; break;
            case ( "retroTheme" ):
                rootTheme = `
                --tp-base-background-color: hsla(40, 3%, 90%, 1.00);
                --tp-base-shadow-color: hsla(0, 0%, 0%, 0.30);
                --tp-button-background-color: hsla(40, 3%, 70%, 1.00);
                --tp-button-background-color-active: hsla(40, 3%, 55%, 1.00);
                --tp-button-background-color-focus: hsla(40, 3%, 60%, 1.00);
                --tp-button-background-color-hover: hsla(40, 3%, 65%, 1.00);
                --tp-button-foreground-color: hsla(40, 3%, 20%, 1.00);
                --tp-container-background-color: hsla(40, 3%, 70%, 1.00);
                --tp-container-background-color-active: hsla(40, 3%, 55%, 1.00);
                --tp-container-background-color-focus: hsla(40, 3%, 60%, 1.00);
                --tp-container-background-color-hover: hsla(40, 3%, 65%, 1.00);
                --tp-container-foreground-color: hsla(40, 3%, 20%, 1.00);
                --tp-groove-foreground-color: hsla(40, 3%, 40%, 1.00);
                --tp-input-background-color: hsla(120, 3%, 20%, 1.00);
                --tp-input-background-color-active: hsla(120, 3%, 35%, 1.00);
                --tp-input-background-color-focus: hsla(120, 3%, 30%, 1.00);
                --tp-input-background-color-hover: hsla(120, 3%, 25%, 1.00);
                --tp-input-foreground-color: hsla(120, 40%, 60%, 1.00);
                --tp-label-foreground-color: hsla(40, 3%, 50%, 1.00);
                --tp-monitor-background-color: hsla(120, 3%, 20%, 1.00);
                --tp-monitor-foreground-color: hsla(120, 40%, 60%, 0.80);`; break;
            case ( "translucentTheme" ):
                rootTheme = `
                --tp-base-background-color: hsla(0, 0%, 10%, 0.80);
                --tp-base-shadow-color: hsla(0, 0%, 0%, 0.20);
                --tp-button-background-color: hsla(0, 0%, 80%, 1.00);
                --tp-button-background-color-active: hsla(0, 0%, 100%, 1.00);
                --tp-button-background-color-focus: hsla(0, 0%, 95%, 1.00);
                --tp-button-background-color-hover: hsla(0, 0%, 85%, 1.00);
                --tp-button-foreground-color: hsla(0, 0%, 0%, 0.80);
                --tp-container-background-color: hsla(0, 0%, 0%, 0.30);
                --tp-container-background-color-active: hsla(0, 0%, 0%, 0.60);
                --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.50);
                --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.40);
                --tp-container-foreground-color: hsla(0, 0%, 100%, 0.50);
                --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.20);
                --tp-input-background-color: hsla(0, 0%, 0%, 0.30);
                --tp-input-background-color-active: hsla(0, 0%, 0%, 0.60);
                --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.50);
                --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.40);
                --tp-input-foreground-color: hsla(0, 0%, 100%, 0.50);
                --tp-label-foreground-color: hsla(0, 0%, 100%, 0.50);
                --tp-monitor-background-color: hsla(0, 0%, 0%, 0.30);
                --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.30);`; break;
            case ( "statefarmerTheme" ):
                rootTheme = `
                --tp-base-background-color: hsla(0, 80%, 40%, 1.00);
                --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
                --tp-button-background-color: hsla(0, 0%, 100%, 1.00);
                --tp-button-background-color-active: hsla(0, 0%, 85%, 1.00);
                --tp-button-background-color-focus: hsla(0, 0%, 90%, 1.00);
                --tp-button-background-color-hover: hsla(0, 0%, 95%, 1.00);
                --tp-button-foreground-color: hsla(230, 20%, 11%, 1.00);
                --tp-container-background-color: hsla(0, 0%, 0%, 0.20);
                --tp-container-background-color-active: hsla(0, 0%, 0%, 0.35);
                --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.30);
                --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.25);
                --tp-container-foreground-color: hsla(0, 0%, 100%, 0.90);
                --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.50);
                --tp-input-background-color: hsla(0, 0%, 0%, 0.50);
                --tp-input-background-color-active: hsla(0, 0%, 0%, 0.65);
                --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.60);
                --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.55);
                --tp-input-foreground-color: hsla(0, 0%, 100%, 0.90);
                --tp-label-foreground-color: hsla(0, 0%, 100%, 0.90);
                --tp-monitor-background-color: hsla(0, 0%, 0%, 0.50);
                --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.50);`; break;
            case ( "blurpleTheme" ):
                rootTheme = `
                --tp-base-background-color: hsla(255, 68%, 39%, 1.00);
                --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
                --tp-button-background-color: hsla(0, 0%, 100%, 1.00);
                --tp-button-background-color-active: hsla(0, 0%, 85%, 1.00);
                --tp-button-background-color-focus: hsla(0, 0%, 90%, 1.00);
                --tp-button-background-color-hover: hsla(0, 0%, 95%, 1.00);
                --tp-button-foreground-color: hsla(230, 20%, 11%, 1.00);
                --tp-container-background-color: hsla(0, 0%, 0%, 0.20);
                --tp-container-background-color-active: hsla(0, 0%, 0%, 0.35);
                --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.30);
                --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.25);
                --tp-container-foreground-color: hsla(0, 0%, 100%, 0.90);
                --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.50);
                --tp-input-background-color: hsla(0, 0%, 0%, 0.50);
                --tp-input-background-color-active: hsla(0, 0%, 0%, 0.65);
                --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.60);
                --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.55);
                --tp-input-foreground-color: hsla(0, 0%, 100%, 0.90);
                --tp-label-foreground-color: hsla(0, 0%, 100%, 0.90);
                --tp-monitor-background-color: hsla(0, 0%, 0%, 0.50);
                --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.50);`; break;
            case ( "shellFarmTheme" ):
                rootTheme = `
                --tp-base-background-color: hsla(198, 100%, 50%, 1.00);
                --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
                --tp-button-background-color: hsla(0, 0%, 100%, 1.00);
                --tp-button-background-color-active: hsla(0, 0%, 85%, 1.00);
                --tp-button-background-color-focus: hsla(0, 0%, 90%, 1.00);
                --tp-button-background-color-hover: hsla(0, 0%, 95%, 1.00);
                --tp-button-foreground-color: hsla(230, 20%, 11%, 1.00);
                --tp-container-background-color: hsla(0, 0%, 0%, 0.20);
                --tp-container-background-color-active: hsla(0, 0%, 0%, 0.35);
                --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.30);
                --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.25);
                --tp-container-foreground-color: hsla(0, 0%, 100%, 0.90);
                --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.50);
                --tp-input-background-color: hsla(0, 0%, 0%, 0.50);
                --tp-input-background-color-active: hsla(0, 0%, 0%, 0.65);
                --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.60);
                --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.55);
                --tp-input-foreground-color: hsla(0, 0%, 100%, 0.90);
                --tp-label-foreground-color: hsla(0, 0%, 100%, 0.90);
                --tp-monitor-background-color: hsla(0, 0%, 0%, 0.50);
                --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.50);`; break;
        };

        //menu customisation (apply font, button widths, adjust checkbox right slightly, make menu appear on top, add anim to message)
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            :root { ${rootTheme} }
        `;
        document.head.appendChild(styleElement);
    };
    const temp = document.createElement( 'div' );
    temp.innerHTML = `
<style>
.notif {
    position: absolute;
    border: 5px solid lightblue;
    left: 70%;
    top: 85%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
    font-weight: bolder;
    padding: 15px;
    z-index: 999999;
    border-radius: 2vw;
    overflow: auto;
    resize: both;
    backdrop-filter: blur(4px);
    overflow: hidden;
    min-width: 10vw;
    min-height: 4vh;
    pointer-events: none;
}
.MiniMap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1000px;
    height:1000px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
    background: rgba(0, 0, 0, 0);
    font-weight: bolder;
    padding: 15px;
    z-index: 999999;
    border-radius: 2vw;
    overflow: auto;
    overflow: hidden;
    pointer-events: none;
}
.playerDot {
position: absolute;
width: 0;
height: 0;
border-left: 10px solid transparent;
border-right: 10px solid transparent;
border-bottom: 20px solid green;
color: white;
transform: translate(-50%, -50%);
z-index: 999999;
}
</style>
<div id = "minimap" class="MiniMap"></div>
<div id = "playerDot" class="playerDot">playerdot</div>
`;
    const mapEl = temp.querySelector('.MiniMap');
    let myPlayerDot = temp.querySelector('.playerDot');
    const playerDotsMap = new Map();
    window.addEventListener( 'DOMContentLoaded', async function () {
        while ( temp.children.length > 0 ) {
            document.body.appendChild( temp.children[ 0 ] );
        }
    } );
    function updateMiniMap(player, myPlayer) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        // Check if a player dot with the unique ID already exists, then do flow of control
        let xPosition = (player[H.x] / 100) * windowWidth;xPosition += (windowWidth + xPosition)/2;
        let yPosition = (player[H.z] / 100) * windowHeight;yPosition += (windowHeight + yPosition)/2;
        if (!player[H.playing] || !player) {
            if (playerDotsMap.has(player.uniqueId)) {
                const playerDotToRemove = playerDotsMap.get(player.uniqueId);
                mapEl.removeChild(playerDotToRemove); // Remove the dot from the DOM
                playerDotsMap.delete(player.uniqueId); // Remove the dot from the map
            };
        } else if (player === myPlayer) {
            myPlayerDot.style.left = `${xPosition}px`;
            myPlayerDot.style.top = `${yPosition}px`;
            myPlayerDot.textContent = myPlayer.name;
            myPlayerDot.style.transform = 'translate(-50%, -50%) rotate(' + yawToDeg(player[H.yaw]) + 'deg)';
        } else if (playerDotsMap.has(player.uniqueId)) {
            // If it exists, update its position
            const existingPlayerDot = playerDotsMap.get(player.uniqueId);
            existingPlayerDot.style.left = `${xPosition}px`;
            existingPlayerDot.style.top = `${yPosition}px`;
            //existingPlayerDot.style.transform = 'translate(-50%, -50%) rotate(' + yawToDeg(player[H.yaw]) + 'deg)'; // could uncomment but then names unreadable,
        } else {
            // If it doesn't exist, create a new player dot element
            const newPlayerDot = document.createElement('div');
            newPlayerDot.className = 'playerDot';
            newPlayerDot.style.border = player.team === 1 ? '5px solid blue' : '5px solid red';

            newPlayerDot.style.left = `${xPosition}px`;
            newPlayerDot.style.top = `${yPosition}px`;
            newPlayerDot.textContent = player.name;
            // append to the MiniMap element, for later purposes once we can set inside the element instead
            mapEl.appendChild(newPlayerDot);

            // Store in the Map
            playerDotsMap.set(player.uniqueId, newPlayerDot);
        };
    };
    function yawToDeg(yaw) {
        let yaw_degrees = yaw * 180.0 / Math.PI; // conversion to degrees
        if( yaw_degrees < 0 ) yaw_degrees += 360.0; // convert negative to positive angles
        return yaw_degrees;
    };
    const applyStateFarmLogo = function() {
        if (extract("replaceLogo")) {
            const images = document.getElementsByTagName('img');
            for (let i = 0; i < images.length; i++) {
                const src = images[i].getAttribute('src');
                if (src && src.includes('img/logo.svg')) {
                    images[i].setAttribute('src', replacementLogoURL);
                };
            };
            const logoDiv = document.getElementById('logo');
            if (logoDiv) {
                const logoImg = logoDiv.querySelector('img');
                if (logoImg) {
                    logoImg.setAttribute('src', replacementLogoURL);
                    logoImg.setAttribute('width', 300);
                    logoImg.setAttribute('height', 104);
                };
            };
        };
    };
    //1337 H4X
    const getSearchParam = function(param) {
        const queryParams = new URLSearchParams(unsafeWindow.location.search);
        return queryParams.get(param);
    };
    const fetchTextContent = function (url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send();
        if (xhr.status === 200) {
            return xhr.responseText;
        } else {
            console.error("Error fetching "+url);
            return null;
        };
    };
    const findKeyByValue = function(obj, value) {
        for (const key in obj) {
            if (obj[key] === value) {
                return key;
            };
        };
        return null; // Return null if the value is not found
    };
    const newProxy = function() {
        unsafeWindow.location.replace(unsafeWindow.location.href.replace(unsafeWindow.location.hostname,proxyList[3]));
    };
    const unban = function() {
        console.log("STATEFARM UNBANNING...");
        unsafeWindow.extern.signOut();
        setTimeout(() => {
            const banPopup=document.getElementById("bannedPopup");
            if (banPopup) { banPopup.style.display='none' }; //hide it
        }, 10000);
    };
    const reloadPage = function() {
        unsafeWindow.location.reload(true);
    };
    const spamReport = function() {
        (async function(){
            const sleep = function(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            };
            playerList = document.getElementById("playerList").children;
            for (let i = 0; i < playerList.length; i++){
                playerList[i].click();
                await sleep(400);
                document.getElementsByClassName("ss_button btn_medium btn_red bevel_red")[0].click();
                await sleep(400);
                document.getElementsByClassName("ss_checkbox label")[randomInt(0,3)].click();
                await sleep(400);
                document.getElementsByClassName("ss_button btn_medium btn_green bevel_green")[0].click();
                await sleep(400);
                document.getElementById("genericPopup").children[2].children[1].click();
            };
        })();
    };

    const broadcastToBots = function(command) {
        const commandTime = Date.now();
        console.log("StateFarm: sending command to bots:", command, "| at time:", commandTime);
        GM_setValue("StateFarm_Command", command);
        GM_setValue("StateFarm_CommandTime", commandTime);
    };

    const hexToRgb = function (hex) {
        hex = hex.replace(/^#/, '');
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r / 255, g / 255, b / 255];
    };
    const fadeBetweenColors = function (color1, color2, progress) {
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        const resultRgb = [
            rgb1[0] + (rgb2[0] - rgb1[0]) * progress,
            rgb1[1] + (rgb2[1] - rgb1[1]) * progress,
            rgb1[2] + (rgb2[2] - rgb1[2]) * progress
        ];
        return resultRgb;
    };
    const distancePlayers = function (player,yMultiplier) {
        yMultiplier=yMultiplier||1;
        let vector = getDirectionVectorFacingTarget(player);
        return Math.hypot(vector.x,vector.y*yMultiplier,vector.z); //pythagoras' theorem in 3 dimensions. no one owns maths, zert.
    };
    const setPrecision = function (value) { return Math.round(value * 8192) / 8192 }; //required precision
    const calculateYaw = function (pos) {
        return setPrecision(Math.mod(Math.atan2(pos.x,pos.z), Math.PI2));
    };
    const calculatePitch = function (pos) {
        return setPrecision(-Math.atan2(pos.y,Math.hypot(pos.x,pos.z))%1.5);
    };
    const getAngularDifference = function (obj1,obj2) { //this is super scuffed
        return Math.abs(obj1[H.yaw]-obj2.yawReal)+Math.abs(obj1[H.pitch]-obj2.pitchReal);
    };
    const getDirectionVectorFacingTarget = function (target,vectorPassed,offsetY) {
        target = vectorPassed ? target : target[H.actor][H.mesh].position;
        offsetY=offsetY||0;
        return {
            x: target.x - ss.MYPLAYER[H.actor][H.mesh].position.x,
            y: target.y - ss.MYPLAYER[H.actor][H.mesh].position.y+offsetY,
            z: target.z - ss.MYPLAYER[H.actor][H.mesh].position.z,
        };
    };
    const deg2rad = function(deg) {
        return deg * (Math.PI / 180);
    };
    const reverseString = function (str) { return str.split("").reverse().join("") };
    const isPartialMatch = function (array, searchString) {
        return array.some(item => item !== "" && searchString.toLowerCase().includes(item.toLowerCase()));
    };
    const playAudio = function(name, panner, contextName) {
        contextName = findStringInLists(divertContexts, name) || "OTHER";
        let audioContext;
        audioContext = audioContexts[contextName];
        let source = audioContext.createBufferSource();
        source.buffer = soundsSFC[name];

        const newPanner = audioContext.createPanner();
        audioContext.listener.setPosition(0,0,0);

        if (panner) {
            newPanner.context.listener.setPosition(panner.context.listener.positionX.value,panner.context.listener.positionY.value,panner.context.listener.positionZ.value);
            newPanner.setPosition(
                panner.context.listener.positionX.value - ((panner.context.listener.positionX.value - panner.positionX.value) * extract("distanceMult")),
                panner.context.listener.positionY.value - ((panner.context.listener.positionY.value - panner.positionY.value) * extract("distanceMult")),
                panner.context.listener.positionZ.value - ((panner.context.listener.positionZ.value - panner.positionZ.value) * extract("distanceMult")),
            );
            newPanner.setOrientation(panner.orientationX.value, panner.orientationY.value, panner.orientationZ.value);
            newPanner.refDistance = panner.refDistance;
            newPanner.maxDistance = panner.maxDistance;
            newPanner.rolloffFactor = panner.rolloffFactor;
            newPanner.coneInnerAngle = panner.coneInnerAngle;
            newPanner.coneOuterAngle = panner.coneOuterAngle;
            newPanner.coneOuterGain = panner.coneOuterGain;
        };
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        };
        console.log(contextName);
        source.connect(newPanner);
        newPanner.connect(audioContext.destination);
        source.start();
    };
    const playerMatchesList = function (array, player) {
        let nameMatched = isPartialMatch(array,player.name);
        let idMatched = isPartialMatch(array,player.uniqueId);
        return nameMatched||idMatched;
    };
    const randomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const radianAngleDiff = function (angle1,angle2) {
        const fullCircle = 2 * Math.PI;
        // Normalize angles to be within [0, 2π)
        angle1 = (angle1 % fullCircle + fullCircle) % fullCircle;
        angle2 = (angle2 % fullCircle + fullCircle) % fullCircle;
        // Find the absolute angular difference
        let diff = Math.abs(angle1 - angle2);
        // Ensure the difference is within [0, π)
        diff = Math.min(diff, fullCircle - diff);
        // Determine the sign of the difference correctly
        if ((angle1 - angle2 + fullCircle) % fullCircle > Math.PI) {
            return -diff;
        } else {
            return diff;
        };
    };
    const getScrambled=function(){return Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')}
    clientID=(getScrambled()+"noID");
    const createAnonFunction=function(name,func){
        const funcName=getScrambled();
        unsafeWindow[funcName]=func;
        F[name]=unsafeWindow[funcName];
        functionNames[name]=funcName
    };
    const processChatItem = function (text,playerName,playerTeam,highlightColor) {
        let chatItem = document.createElement("div");
        let playerNameSpan = document.createElement("span");
        let playerInfoContainer = document.createElement("div");
        let serverIcon = document.createElement("i");

        chatItem.classList.add("chat-item");
        playerInfoContainer.style.display = "inline-block";

        playerNameSpan.classList.add("chat-player-name", "ss_marginright_xs");
        playerNameSpan.textContent = playerName + " ";

        playerInfoContainer.style.color = TEAMCOLORS[playerTeam];
        playerInfoContainer.appendChild(serverIcon);
        playerInfoContainer.appendChild(playerNameSpan);

        let messageSpan = document.createElement("span");
        messageSpan.innerHTML = text;
        chatItem.style.fontStyle = "italic";
        messageSpan.style.backgroundColor = highlightColor;
        playerInfoContainer.style.backgroundColor = highlightColor;

        chatItem.appendChild(playerInfoContainer);
        chatItem.appendChild(messageSpan);

        document.getElementById("chatOut").appendChild(chatItem);

        if (document.querySelector(".chat-container")) {
            document.querySelector(".chat-container").scrollTop = document.querySelector(".chat-container").scrollHeight;
        };
    };
    const updateOrCreateLinesESP = function (object,type,color) {
        let newPosition,newScene,newParent
        if (type=="playerESP") {
            newPosition = object[H.actor][H.mesh].position;
            newScene    = object[H.actor].scene;
            newParent   = object[H.actor][H.mesh];
        } else {
            newPosition = object.position;
            newScene    = object._scene;
            newParent   = object;
        };
        if (!object.generatedESP) {
            //tracers
            const tracerLines = L.BABYLON.MeshBuilder.CreateLines("tracerLines", { points: [newPosition, crosshairsPosition] }, newScene);
            tracerLines.color=new L.BABYLON.Color3(1, 1, 1);
            tracerLines.renderingGroupId=1;
            object.tracerLines = tracerLines;
            //ESP
            //FUCK WIREFRAME BOXES! LIBERTYMUTUAL dictates we making our own MANUALLY bitch! to hell with those diagonal lines
            const boxSize = {
                playerESP: { width: 0.5, height: 0.75, depth: 0.5 },
                ammoESP: { width: 0.25, height: 0.35, depth: 0.25 },
            };
            const boxOffset = {
                playerESP: 0,
                ammoESP: -0.05,
            };
            const vertices = [
                new L.BABYLON.Vector3(-boxSize[type].width / 2, boxOffset[type], -boxSize[type].depth / 2),
                new L.BABYLON.Vector3(boxSize[type].width / 2, boxOffset[type], -boxSize[type].depth / 2),
                new L.BABYLON.Vector3(boxSize[type].width / 2, boxOffset[type] + boxSize[type].height, -boxSize[type].depth / 2),
                new L.BABYLON.Vector3(-boxSize[type].width / 2, boxOffset[type] + boxSize[type].height, -boxSize[type].depth / 2),
                new L.BABYLON.Vector3(-boxSize[type].width / 2, boxOffset[type], boxSize[type].depth / 2),
                new L.BABYLON.Vector3(boxSize[type].width / 2, boxOffset[type], boxSize[type].depth / 2),
                new L.BABYLON.Vector3(boxSize[type].width / 2, boxOffset[type] + boxSize[type].height, boxSize[type].depth / 2),
                new L.BABYLON.Vector3(-boxSize[type].width / 2, boxOffset[type] + boxSize[type].height, boxSize[type].depth / 2),
            ];
            const lines = [];
            for (let i = 0; i < 4; i++) {
                lines.push([vertices[i], vertices[(i + 1) % 4]]);
                lines.push([vertices[i + 4], vertices[(i + 1) % 4 + 4]]);
                lines.push([vertices[i], vertices[i + 4]]);
            };
            const box = L.BABYLON.MeshBuilder.CreateLineSystem(getScrambled(), { lines }, newScene);
            box.color = new L.BABYLON.Color3(1, 1, 1);
            box.position.y=boxOffset[type];
            box.renderingGroupId = 1;
            box.parent=newParent;
            object.box=box;
            //TARGETS
            let target
            if (type=="playerESP") {
                target = L.BABYLON.MeshBuilder.CreateSphere(getScrambled(), { diameter: 0.05 }, newScene);
                target.material = new L.BABYLON.StandardMaterial(getScrambled(), newScene);
                target.material.diffuseColor = new L.BABYLON.Color3(1, 0, 0);
                target.material.alpha = 0.5;
                target.position.y = 0.3;
                target.renderingGroupId = 1;
                target.parent=newParent;
                object.target=target;
            };
            //stuff
            object.generatedESP=true;
            ESPArray.push([object,tracerLines,box,target]);
        };
        object.tracerLines.setVerticesData(L.BABYLON.VertexBuffer.PositionKind, [crosshairsPosition.x, crosshairsPosition.y, crosshairsPosition.z, newPosition.x, newPosition.y, newPosition.z]);
        object.tracerLines.color = new L.BABYLON.Color3(...color);
        object.box.color = new L.BABYLON.Color3(...color);
    };
    const everySecond = function () {
        if (extract("debug")) {
            globalSS={};
            globalSS.ss=ss;
            globalSS.H=H;
            globalSS.tp=tp;
            globalSS.initMenu=initMenu;
            globalSS.extractAsDropdownInt=extractAsDropdownInt;
            globalSS.extract=extract;
            globalSS.extractDropdownList=extractDropdownList;
            globalSS.save=save;
            globalSS.load=load;
            globalSS.remove=remove;
            globalSS.change=change;
            globalSS.list=GM_listValues;
            globalSS.soundsSFC=soundsSFC;
            // if (typeof(L.BABYLON) !== 'undefined') {globalSS.L.BABYLON=L.BABYLON};
        };
        startUpComplete = (!document.getElementById("progressBar"));
        let botsDict = GM_getValue("StateFarm_BotStatus");
        if (!botsDict) botsDict = {};
        if (AUTOMATED) {
            if (clientID) {
                const autoLeave = extract("autoLeave") ? " AL: "+Math.round(((timeJoinedGame+(1000*extract("autoLeaveDelay"))) - Date.now())/100)/10 : "";
                const newArray = {
                    noConfig: ((botsDict[clientID] && configNotSet) ? (
                        (botsDict[clientID].noConfig>Date.now()) ? botsDict[clientID].noConfig : Date.now()
                        ) : 0),
                    username: ((ss&&ss.MYPLAYER&&ss.MYPLAYER.name)||(unsafeWindow.vueApp.playerName)),
                    uniqueId: ((ss&&ss.MYPLAYER&&ss.MYPLAYER.uniqueId)||"value_undefined"),
                    startTime: startTime,
                    timecode: Date.now(),
                    status: ((isBanned&&"banned")||
                        (unsafeWindow.extern.inGame&&((ss.MYPLAYER[H.playing] ? "playing " : (unsafeWindow.vueApp.game.respawnTime + "s cooldown ")) + GAMECODE + autoLeave + " (" + findKeyByValue(unsafeWindow.extern.GameType,unsafeWindow.vueApp.game.gameType) + ", " + unsafeWindow.vueData.currentRegionId + ", " + unsafeWindow.vueApp.game.mapName + ", team" + unsafeWindow.vueApp.game.team + ")"))||
                        (errorString||"idle")),
                };

                delete botsDict[clientID];

                clientID = (unsafeWindow.vueData.firebaseId||clientID);

                botsDict[clientID] = newArray;
            };
            if (attemptedInjection && automatedBorder && automatedBorder.style && automatedBorder.style.borderColor=="rgb(255, 0, 0)") {
                automatedBorder.style.borderColor = 'rgba(0, 255, 0, 1)';
            };
        } else {
            let oldBlacklist = botBlacklist;
            botBlacklist = "";
            if (extract("botNoKillMe")) {
                botBlacklist += botBlacklist + ((ss&&ss.MYPLAYER&&ss.MYPLAYER.uniqueId)||"value_undefined") + ",";
            };
            monitorObjects.botOnline="";
            amountOnline = 0;
            const botsArray = Object.keys(botsDict).sort();
            for (i in botsArray) {
                if (i!=="shallowClone") {
                    i = Number(i);
                    const botID = botsArray[i];
                    const data = botsDict[botID];
                    if (data.noConfig) {
                        updateBotParams();
                        botsDict[botID].noConfig = Date.now()+5000;
                    };
                    if (extract("botNoKillBots") && data.uniqueId !== "value_undefined") {
                        botBlacklist += data.uniqueId + ",";
                    };
                    if ((data.timecode+10000)<Date.now()) { //give up on this bot lmao
                        delete botsDict[botID];
                    } else if ((data.timecode+4000)<Date.now()) { //maybe it will come back
                        botsDict[botID].status="not responding " + (Date.now()-data.timecode) + "ms elapsed";
                    }; //bot is doing fine... hopefully
                    amountOnline+=1;
                    monitorObjects.botOnline = monitorObjects.botOnline + "\n" + data.username + " [" + "..." + botID.slice(-4) + "]: " + data.status;
                };
            };
            if (oldBlacklist !== botBlacklist) {
                console.log("old:", oldBlacklist, "new:", botBlacklist);
                updateBotParams();
            };
            monitorObjects.botOnline = ((amountOnline) + " bots online.")+monitorObjects.botOnline;
        };
        GM_setValue("StateFarm_BotStatus",botsDict);

        allFolders.forEach(function (name) {
            save(name,tp[name].expanded);
        });

        coordElement.style.display = "none";
        gameInfoElement.style.display = "none";
        playerstatsElement.style.display = "none";
        playerinfoElement.style.display = "none";
        redCircle.style.display = "none";
        makeHudElementDragable(coordElement);
        makeHudElementDragable(gameInfoElement);
        makeHudElementDragable(playerstatsElement);
        makeHudElementDragable(playerinfoElement);
        if (extract("gameBlacklistCodes")!="" && extract("gameBlacklistCodes") != undefined){
            let input = extract("gameBlacklistCodes");
            input = input.split(",");
            input.forEach(function (code) {
                if (code != "" && code.length == 7){
                    blacklistedGameCodes.push(code);
                }
            });
        };

        extract('spoofVIP') && document.getElementById("chickenBadge") ? document.getElementById("chickenBadge").style.display = "block" : document.getElementById("chickenBadge").style.display = "none"; //VIP Badge Spoof by OakSwingZZZ

        const fetchAndProcessAudioFromZip = async function (zipURL) {
            try {
                const response = await fetch(zipURL);
                if (!response.ok) {
                    throw new Error('Failed to fetch ZIP:', response.statusText);
                };
                const arrayBuffer = await response.arrayBuffer();
                const zip = await JSZip.loadAsync(arrayBuffer);
                const mp3Files = Object.keys(zip.files).filter(fileName => fileName.endsWith('.mp3'));
                const jsonFiles = Object.keys(zip.files).filter(fileName => fileName.endsWith('.json'));
                const totalRequests = mp3Files.length + jsonFiles.length;
                let config = {};

                if (jsonFiles.length > 0) {
                    const jsonFileData = await zip.file(jsonFiles[0]).async('string');
                    config = {...config, ...JSON.parse(jsonFileData)};
                };

                let loadedCount = 0;

                mp3Files.forEach(async (fileName, index) => {
                    const fileData = await zip.file(fileName).async('arraybuffer');
                    const audioBuffer = await audioContexts.SOUNDS.decodeAudioData(fileData);
                    const key = fileName.replace('.mp3', '');
                    audioBuffer.disablePanning = !!config.disablePanning;
                    soundsSFC[key] = audioBuffer;
                    console.log("Loaded sound for:", key);
                    loadedCount++;

                    if (loadedCount === totalRequests) {
                        createPopup("Loaded Custom SFX!", "success");
                        console.log("LOADED!");
                    };
                });
            } catch (error) {
                console.error('Error fetching/decoding audio from ZIP:', error);
            };
        };

        if (initialisedCustomSFX !== extract("customSFX")) {
            initialisedCustomSFX = extract("customSFX");
            console.log("STARTING TO LOAD CUSTOM SFX...", initialisedCustomSFX);
            soundsSFC = {};
            if (initialisedCustomSFX !== true && initialisedCustomSFX !== "default") {
                createPopup("Loading Custom SFX...");

                // Make the request to fetch and process audio data from the ZIP file
                fetchAndProcessAudioFromZip(JSON.parse(initialisedCustomSFX));
            };
        };

        if (startUpComplete && ss && ss.MYPLAYER && unsafeWindow.extern.inGame) {
            if (extract("mockMode")) {
                let textAfterLastColon = document.getElementById("chatOut").children[document.getElementById("chatOut").children.length-1].children[1].textContent;
                let chatName = document.getElementById("chatOut").children[document.getElementById("chatOut").children.length-1].children[0].textContent.slice(0,-2);
                // console.log("Chat Name:", chatName);
                if (chatName && chatName!==username && textAfterLastColon!=="joined." && textAfterLastColon!=="left." && !handleChat(textAfterLastColon)) {
                    sendChatMessage(textAfterLastColon);
                }; //mockMode, this will copy and send the chat into message when joining, but doesn't show to other players, so it's fine. solvable with an if statement bool
            };
            if (extract("antiAFK")) {
                if (Date.now()>(lastAntiAFKMessage+270000)) {
                    if (sendChatMessage(antiAFKString+filteredList[randomInt(0,filteredList.length-1)])) {
                        lastAntiAFKMessage=Date.now();
                    };
                };
            };
            if (extract("gameInfo")) {
                let gameInfoText=GAMECODE+" | "+playersInGame+"/18 | "+(18-playersInGame)+" slots remaining. | Server: "+unsafeWindow.vueData.currentRegionId+" | Gamemode: "+findKeyByValue(unsafeWindow.extern.GameType,unsafeWindow.vueApp.game.gameType)+" | Map: "+unsafeWindow.vueApp.game.mapName+" | Time in game: "+(Math.floor((Date.now()-timeJoinedGame)/1000))+"s"+(extract("autoLeave") ? " | AutoLeave: "+(Math.ceil(((timeJoinedGame+(1000*extract("autoLeaveDelay"))) - Date.now())/1000))+"s" : "");
                gameInfoElement.innerText = gameInfoText;
                void gameInfoElement.offsetWidth;
                gameInfoElement.style.display = '';
            };
            if (extract("leaveEmpty")) {
                if (playersInGame==1 || playersInGame==2) { //if literally empty or there is one person remaining
                    createPopup("Left empty game. [LeaveEmpty]")
                    change("leaveGame");
                    playersInGame=0;
                };
            };
            if (extract("autoLeave")) {
                const remaining = ((timeJoinedGame+(1000*extract("autoLeaveDelay"))) - Date.now())/1000;
                if (remaining <= 0) {
                    createPopup("AutoLeave: Leaving now...");
                    change("leaveGame");
                } else if (autoLeaveReminder > 5 && remaining <= 5) {
                    createPopup("AutoLeave: 5 seconds remaining!");
                } else if (autoLeaveReminder > 10 && remaining <= 10) {
                    createPopup("AutoLeave: 10 seconds remaining");
                };
                // console.log(autoLeaveReminder, remaining);
                autoLeaveReminder = remaining;
            };

            //credits: @2lars and @macintosh2 in the discord :)
            if ((extract("autoTeam")!=="disabled")&&ss.MYPLAYER.team!==0) {
                if ((extract("autoTeam")=="random") ||
                    (extract("autoTeam")=="red")&&(ss.MYPLAYER.team==1) ||
                    (extract("autoTeam")=="blue")&&(ss.MYPLAYER.team==2)) {
                    unsafeWindow.extern.switchTeam();
                };
            };
            if (!ss.MYPLAYER[H.playing]) {
                GAMECODE = unsafeWindow.vueApp.game.shareLinkPopup.url.slice(-7);
                if (extract("autoRespawn")) {
                    var button = document.querySelector('.ss_button.btn_big.btn-dark-bevel.btn-respawn.ss_button.btn_green.bevel_green');
                    if (button) {
                        button.click();
                    };
                };
            };
            addStreamsToInGameUI();
        } else {
            if ((!document.getElementById("progressBar"))) {
                if (extract("autoJoin")) {
                    unsafeWindow.vueApp.externPlayObject((extract("joinCode").length===7)?2:0,vueApp.currentGameType,(vueApp.playerName),-1,extract("joinCode"));
                };
            };
            if (extract("autoRegion")!=="disabled") {
                const region = (extract("autoRegion")=="random" ? extractDropdownList("autoRegion")[randomInt(1,7)].value : extract("autoRegion"));
                unsafeWindow.vueData.currentRegionId = region;
            };
            if (extract("autoGamemode")!=="disabled") {
                const gamemode = ((extract("autoGamemode")=="random") ? randomInt(0,3) : (extractAsDropdownInt("autoGamemode")-1));
                unsafeWindow.vueApp.onGameTypeChanged(gamemode);
            };
        };

        if (startUpComplete) {
            if ((extract("setDetail")!==previousDetail)&&(extract("setDetail")!=="disabled")) {
                unsafeWindow.vueApp.settingsUi.togglers.misc[3].value=false;
                if (extract("setDetail")=="autodetail") {
                    unsafeWindow.vueApp.settingsUi.togglers.misc[3].value=true;
                } else if (extract("setDetail")=="nodetails") {
                    unsafeWindow.vueApp.settingsUi.togglers.misc[4].value=false;
                    unsafeWindow.vueApp.settingsUi.togglers.misc[5].value=false;
                } else if (extract("setDetail")=="shadows") {
                    unsafeWindow.vueApp.settingsUi.togglers.misc[4].value=true;
                    unsafeWindow.vueApp.settingsUi.togglers.misc[5].value=false;
                } else if (extract("setDetail")=="highres") {
                    unsafeWindow.vueApp.settingsUi.togglers.misc[4].value=false;
                    unsafeWindow.vueApp.settingsUi.togglers.misc[5].value=true;
                } else if (extract("setDetail")=="shadowshighres") {
                    unsafeWindow.vueApp.settingsUi.togglers.misc[4].value=true;
                    unsafeWindow.vueApp.settingsUi.togglers.misc[5].value=true;
                };
                unsafeWindow.extern.applyUiSettings(unsafeWindow.vueApp.settingsUi);
            };
            previousDetail=extract("setDetail");

            if (previousTitleAnimation!==extract("titleAnimation")) {
                let existingFavicons = document.querySelectorAll("link[rel*='icon']");
                existingFavicons.forEach(function (favicon) {
                    favicon.parentNode.removeChild(favicon);
                });
                let favicon = document.createElement('link');
                favicon.type = 'image/x-icon';
                favicon.rel = 'shortcut icon';
                if (extract("titleAnimation")) {
                    favicon.href = (GM_info?.script?.icon || iconURL);
                } else {
                    favicon.href = 'https://www.google.com/s2/favicons?domain=shellshock.io';
                };
                document.getElementsByTagName('head')[0].appendChild(favicon);
                previousTitleAnimation = extract("titleAnimation");
            };
        };

        const banPopup = document.getElementById("bannedPopup");
        if (attemptedInjection && banPopup && vueApp.bannedPopup.expire!=="") {
            isBanned=true;
        };
        if (isBanned && extract("autoUnban") && (!attemptedAutoUnban)) {
            console.log("eep!");
            banPopup.textContent='StateFarm AutoUnban:\nPLEASE RELOAD FOR THE NEXT\n20s to 1min for new database\nID for unban. Enjoy! :)\nBan message will be automatically removed from screen in 15 seconds.';
            unban();
            attemptedAutoUnban=true;
            createPopup("AutoUnban: Attempting to Unban...");
            setTimeout(() => {
                createPopup("AutoUnban: Removed ban message.");
                banPopup.style.display = "none";
            }, 15000);
        };

        if (extract("eggColour")!=="disabled") {
            const colour = extract("eggColour")=="random" ? randomInt(0,6) : extractAsDropdownInt("eggColour")-1;
            if (colour!==ss.USERDATA.playerAccount.colorIdx) {
                extern.setShellColor(colour);
                vueApp.onBackClick();
            };
        };
        if (extract("autoStamp")!=="disabled") {
            const stampID = 2000 + (extract("autoStamp")=="random" ? randomInt(1,6) : extractAsDropdownInt("autoStamp"));
            if (ss.USERDATA && ss.USERDATA.playerAccount) {
                if (stampID!==((ss.USERDATA.playerAccount.stampItem && ss.USERDATA.playerAccount.stampItem?.id)||-1)) {
                    ss.USERDATA.playerAccount.stampItem = unsafeWindow.extern.catalog.findItemById(stampID);
                    vueApp.onBackClick();
                };
            };
        };
        if (extract("autoHat")!=="disabled") {
            const hatID = 1000 + (extract("autoHat")=="random" ? randomInt(1,6) : extractAsDropdownInt("autoHat"));
            if (ss.USERDATA && ss.USERDATA.playerAccount) {
                if (hatID!==((ss.USERDATA.playerAccount.hatItem && ss.USERDATA.playerAccount.hatItem?.id)||-1)) {
                    ss.USERDATA.playerAccount.hatItem = unsafeWindow.extern.catalog.findItemById(hatID);
                    vueApp.onBackClick();
                };
            };
        };
        if (extract("useCustomName")) {
            unsafeWindow.vueApp.setPlayerName(extract("usernameAutoJoin"));
        };
        if ((!ranEverySecond) && startUpComplete) {
            ranEverySecond = true;
        };

        //block ads or something kek
        localStorage.timesPlayed = 0;
    };
    const handleCommand = function(command) {
        args = command.split(" ");

        switch (args[0]) {
            case "setconfig":
                let receivedConfig = decodeURIComponent(unsafeWindow.escape(window.atob(args[1])));
                if (URLParams !== "") { receivedConfig = URLParams + "<" + receivedConfig };
                console.log("StateFarm: Change in Bot Panel detected.", receivedConfig);
                applySettings(receivedConfig);
                configNotSet = false;
                break;
            case "ping":
                createPopup("Pong! "+((Date.now()-cachedCommandTime))+"ms","success");
                break;
            case "kill":
                unsafeWindow.close();
                break;
            case "leave":
                change("leaveGame");
                break;
            case "unban":
                unban();
                break;
            case "newproxy":
                newProxy();
                break;
            case "refresh":
                reloadPage();
                break;
            case "report":
                spamReport();
                break;
            case "join":
                code = args[1];
                if (code) {
                    unsafeWindow.vueApp.externPlayObject(0,0,unsafeWindow.vueApp.playerName,-1,code);
                } else {
                    alert("Invalid code");
                };
                break;
            case "pathtarget": // pathfinding target
                option = args[1];
                if (option) {
                    if (option === "set") {
                        x = args[2];
                        y = args[3];
                        z = args[4];
                        if (x && y && z) {
                            pathfindingTargetOverride = { x: x, y: y, z: z };
                        } else {
                            sendChatMessage("Invalid pathtarget coordinates")
                        };
                    };
                };
                break;

            case "clearpath":
                clearPath();
                break;
            case "clearpath_t":
                clearPath_andTarget();
                break;
            case "repeat":
                if (args[1]) {
                    sendChatMessage(args.slice(1).join(" "));
                } else {
                    sendChatMessage("Invalid repeat message");
                }
                break;
            case "setpathdespawn":
                if (args[1]) {
                    if (args[1] === "true") {
                        despawnIfNoPath = true;
                    } else if (args[1] === "false") {
                        despawnIfNoPath = false;
                    } else if (args[1] === "toggle") {
                        despawnIfNoPath = !despawnIfNoPath;
                    } else {
                        sendChatMessage("Invalid setpathdespawn argument");
                    }
                } else {
                    sendChatMessage("Invalid setpathdespawn message");
                }

        }
    };
    const clearPath = function() {
        activePath = undefined;
        activeNodeTarget = undefined;
    }
    const clearPath_andTarget = function() {
        clearPath();
        pathfindingTargetOverride = undefined;
    };
    const everyDecisecond = function () {
        updateConfig(); deciSecondsPassed+=1;

        if (extract("titleAnimation")) {
            if (deciSecondsPassed%3==0) {
                unsafeWindow.document.title = titleAnimationFrames[currentFrameIndex];
                currentFrameIndex = (currentFrameIndex + 1) % titleAnimationFrames.length;
            };
        } else {
            unsafeWindow.document.title = "Shell Shockers 🍳 Multiplayer ,io game";
        };

        if (ss && ss.MYPLAYER && unsafeWindow.extern.inGame) {
            //innertext stuff, fairly resource intensive. disable these for performance
            if (extract("playerStats")) {
                let playerStates="";
                ss.PLAYERS.forEach(player=>{
                    if (player && (player!==ss.MYPLAYER) && (player[H.hp]>0) && ((!ss.MYPLAYER.team)||( player.team!==ss.MYPLAYER.team))) {
                        playerStates=playerStates+player.name+": "+Math.round(player[H.hp])+" HP\n";
                    };
                });
                if (playerStates=="") {playerStates="No Enemy Players"};
                playerstatsElement.innerText = playerStates;
                void playerstatsElement.offsetWidth;
                playerstatsElement.style.display = '';
            };
            if (extract("playerInfo")) {
                let playerInfoString="";
                const player=currentlyTargeting||playerLookingAt||undefined
                if (player && player.distance && player[H.playing]) {
                    playerInfoString=playerInfoString+player.name+"\n"
                    playerInfoString=playerInfoString+"HP: "+Math.round(player[H.hp])+"\n"
                    playerInfoString=playerInfoString+"Distance: "+player.distance.toFixed(3)+"\n"
                    playerInfoString=playerInfoString+"AngleDiff: "+player.angleDiff.toFixed(3)+"\n"
                };
                if (playerInfoString=="") {playerInfoString="Not Looking At Player"};
                playerinfoElement.innerText = playerInfoString;
                void playerinfoElement.offsetWidth;
                playerinfoElement.style.display = '';
            };
            if (ss.MYPLAYER && ss.MYPLAYER[H.actor] && ss.MYPLAYER[H.actor][H.mesh] && extract("showCoordinates")) {
                const fonx = Number((ss.MYPLAYER[H.actor][H.mesh].position.x).toFixed(3));
                const fony = Number((ss.MYPLAYER[H.actor][H.mesh].position.y).toFixed(3));
                const fonz = Number((ss.MYPLAYER[H.actor][H.mesh].position.z).toFixed(3));
                const yaw = Number((ss.MYPLAYER[H.yaw]).toFixed(3)); //could i function this? yea
                const pitch = Number((ss.MYPLAYER[H.pitch]).toFixed(3));
                const personalCoordinate = `XYZ: ${fonx}, ${fony}, ${fonz} Rot: ${yaw}, ${pitch}`;
                coordElement.innerText = personalCoordinate;
                void coordElement.offsetWidth;
                coordElement.style.display = '';
            };
        };
        if (AUTOMATED) { //i know what youre saying looking at this. i am the greatest programmer to have ever lived
            if (GM_getValue("StateFarm_CommandTime") > cachedCommandTime) {
                // alert("New command incoming");
                cachedCommand = GM_getValue("StateFarm_Command");
                cachedCommandTime = GM_getValue("StateFarm_CommandTime");
                console.log("Command received:", cachedCommand);
                handleCommand(cachedCommand);
            } else {
                // uncommment if needed
                // console.log("No new command, cached command:", cachedCommand, "cached time:", cachedCommandTime, "diff to now:", Date.now() - cachedCommandTime);
            };
        };
    };
    const updateConfig = function () {
        configMain = tp.mainPanel.exportPreset();
        configBots = tp.botPanel.exportPreset();
    };
    const updateHiddenAndDisabledHelper = function (array) { //determines if all conditions are met
        conditionMet = false;
        array.forEach(condition=>{
            if ((extract(condition[0]) ? extract(condition[0]) : false) !== condition[1]) {
                conditionMet = true;
                return;
            };
        });
        return conditionMet;
    }
    const updateHiddenAndDisabled = function () {
        //the format for hidden/disabled modules is as follows:
        //hidden/disabled is an array of arrays. within each of the items, there is the condition required for the module to be shown
        //eg: [["aimbot",true],...] (will only be shown if extract("aimbot")==true)
        if (menuInitiated) {
            allModules.forEach(module=>{
                const tiedModules = tp[module+"TiedModules"];
                if (tiedModules) {
                    if (tiedModules.showConditions) {
                        tp[module+"Button"].hidden = updateHiddenAndDisabledHelper(tiedModules.showConditions);
                    };
                    if (tiedModules.hideConditions) {
                        tp[module+"Button"].hidden = !updateHiddenAndDisabledHelper(tiedModules.hideConditions);
                    };
                    if (tiedModules.enableConditions) {
                        tp[module+"Button"].disabled = updateHiddenAndDisabledHelper(tiedModules.enableConditions);
                    };
                    if (tiedModules.disableConditions) {
                        tp[module+"Button"].disabled = !updateHiddenAndDisabledHelper(tiedModules.disableConditions);
                    };
                };
            });
        };
    };
    const saveConfig = function () {
        save("StateFarmConfigMainPanel",tp.mainPanel.exportPreset());
        save("StateFarmConfigBotPanel",tp.botPanel.exportPreset());
    };
    const save = function (key,value) {
        if (AUTOMATED) { return undefined };
        if (JSON.parse(localStorage.getItem(key))!==undefined) {localStorage.removeItem(key)}; //dont need that anymore lmao
        GM_setValue(storageKey+key,value);
    };
    const load = function (key) {
        if (AUTOMATED) { key = getScrambled() };
        return GM_getValue(storageKey+key)||JSON.parse(localStorage.getItem(key)); //localstorage is for legacy purposes *only*
    };
    const remove = function (key) {
        if (AUTOMATED) { return undefined };
        GM_deleteValue(storageKey+key);
        if (JSON.parse(localStorage.getItem(key))!==undefined) {localStorage.removeItem(key)}; //legacy
    };
    const addUserPresets = function (presets) { //adds presets from dict to inbilt presets, can be called multiple times to update
        if (presets != null) {
            Object.entries(presets).forEach(([key, value]) => {
                inbuiltPresets[key] = value;
            });
        };
    };
    const loadUserPresets = function () { //gets user presets
        let result = load(presetStorageLocation);
        console.log("Loaded StateFarmUserPresets: ", result);
        return load(presetStorageLocation);
    };
    const saveUserPreset = function (presetName, preset) {
        let currentPresets = loadUserPresets(); //gets current saved presets
        if (currentPresets == null) { // if it does not exist, makes it
            let presets = {};
            presets[presetName] = preset;
            save(presetStorageLocation, presets);
            return presets;
        } else { //otherwise it appends it
            currentPresets[presetName] = preset;
            save(presetStorageLocation, currentPresets);
            return currentPresets;
        };
    };
    //Updates inbuiltPresets to include user presets
    addUserPresets(loadUserPresets());
    const sendChatMessage = function (text) { //basic method (simulates legit method of sending message)
        if (ss.MYPLAYER.chatLines<2) {
            try {
                lastSentMessage=text;
                chatThing=document.getElementById('chatIn');
                if (chatThing && unsafeWindow.extern.startChat) {
                    unsafeWindow.extern.startChat();
                    chatThing.value=text;
                    chatThing.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true,
                    }));
                    return true;
                } else {
                    return false;
                };
            } catch (error) {
                return false
            };
        } else {
            // createPopup("Chat Cooldown: "+(globalSS.ss.MYPLAYER.chatLines-2)+" remaining.","error");
        };
    };
    const addStreamsToInGameUI = function () {
        let inGameUIElement = document.getElementById("inGameUI");
        let streams = document.getElementById("stream_scroll").children;
        if ( inGameUIElement && streams.length > 0) {
            for (let i = 0; i < streams.length; i++) {
                let hrefValue = streams[i].querySelector('a').href;
                let nameValue = streams[i].querySelector(".stream_name").textContent;
                const streamElement = inGameUIElement.querySelector('div[data-name="' + nameValue + '"]');
                if (extract("showStreams") && !streamElement) {
                    let containerDiv = document.createElement("div");
                    let nameDiv = document.createElement("div");
                    nameDiv.textContent = nameValue;
                    nameDiv.setAttribute('data-href', hrefValue);
                    nameDiv.style.color = 'white';
                    nameDiv.style.cursor = 'pointer';
                    nameDiv.style.textDecoration = 'none';
                    nameDiv.addEventListener('mouseover', function() { nameDiv.style.textDecoration = 'underline'; nameDiv.style.color = 'blue' });
                    nameDiv.addEventListener('mouseout', function() { nameDiv.style.textDecoration = 'none'; nameDiv.style.color = 'white' });
                    nameDiv.addEventListener('click', function() { unsafeWindow.open(hrefValue, '_blank'); });
                    containerDiv.setAttribute('data-name', nameValue);
                    containerDiv.appendChild(nameDiv);
                    containerDiv.appendChild(nameDiv);
                    inGameUIElement.appendChild(containerDiv);
                } else if (!extract("showStreams") && streamElement) {
                    inGameUIElement.removeChild(streamElement);
                };
            };
        };
    };
    const highlightTargetOnLeaderboard = function (target, aimbot) {
        let playerArray = [];
        ss.PLAYERS.forEach(player=>{
            if (player && (target!==ss.MYPLAYER) && player[H.playing] && (player[H.hp]>0) && ((!ss.MYPLAYER.team)||( player.team!==ss.MYPLAYER.team))) {
                const uniqueId = player.uniqueId;
                const name = player.name;
                const hp = player[H.hp]
                playerArray.push({ player, uniqueId, name, hp });
            };
        });
        Array.from(document.getElementById("playerList").children).forEach(playerListItem=>{
            if (aimbot && target?.name && target[H.playing] === playerListItem.textContent.slice(0, -3)) {//need to slice otherwise won't match properly
                playerListItem.style.backgroundColor = 'blue';
            } else {
                playerListItem.style.backgroundColor = '';
            };
            // console.log(playerArray.find(player => player.name === playerListItem.textContent.slice(0, -3))?[H.hp]);
        });
    };
    const highlightCrossHairReticleDot = function (bool) {
        let dot = document.getElementById("reticleDot");
        let crosshair = document.getElementById("crosshairContainer");
        let setTo='';
        if (bool===true) {
            setTo="green";
        } else if (bool===false) {
            setTo="red";
        };
        dot.style.backgroundColor = setTo;
        Array.from(crosshair.children).forEach(part=>{
            part.style.backgroundColor = setTo;
        });
    };
    const handleChat = function (textAfterLastColon) {
        const responses = {
            "report": "report me? pffft. i'm not even human",
            "aimbot": "what aimboot?",
            "bot": "you're a booooT",
            "stop": "u stop",
            "cheat": "oh youre gonna cheat accuse? keep yapping",
            "hack": "oh youre gonna cheat accuse? keep yapping",
            "hax": "oh youre gonna cheat accuse? keep yapping",
            "bro": "brooooo what",
            "spam": "me, spamming? im just chatting",
            "mute": "you dont want to listen to me talk? how weak hahaha",
            "ban": "ban me? no free speech these days",
            "lol": "lolzedong",
            "dude": "dudeinator3000: what is your request",
            "what": "dude what",
            "annoy": "im not that bad",
            "mock": "im not doing anything wrong",
            "wtf": "watch your profanity",
            "i'm": "yes you are",
            "im": "yes you are",
            "u r": "no im not. proof?",
            "you r": "no im not. proof?",
            "you are": "no im not. proof?",
            "you're": "no im not. proof?",
            "imagine": "imagine who asked",
            "f u": "funny uncleburger",
            "gg": "good grief",
            "shut up": "B͇͈͉͍͎̽̾̿̀́͂̓̈́͆͊͋͌͗ͅ͏͎͗͏͇͇̽̾̿̀́̽̿̀̀́̽̀͆̓̈́̓͋͌ͅ͏͌͏͎͉͗͗͌̓̓̓̓̓́̿",
            "chill": "you think i can just CALM DOWN?!?",
            "stfu": "just reported u for swearing",
            "look": "im looking but im not seeing",
            "nigg": "WHOA we cant have racism on our egg game! tone it down yo",
            "fuck": "pipe down with those swears boi",
            "shit": "pipe down with those swears boi",
            "piss": "pipe down with those swears boi",
            "dick": "pipe down with those swears boi",
            "loser": "ive been speccing u, cheater",
            "code": "A1BXDQ is the code",
            "rip": "rest in small pieces",
            "omg": "oh my GAWWWD!",
            "npc": "literally you rn:",
            "wth": "ur an npc",
            "yes": "no, what do you mean? elaborate you npc",
            "bruh": "did you just say bruh? that is a racist remark",
            "noob": "1v1 me you bot",
            "lmfao": "who is this LMFAO, and is he working with LMBAO?",
            "?": "ask a better question",
            "huh": "huh, are u bot?",
            "your mom": "Yo mama's so poor, she can't even afford to pay attention",
            "your mum": "Yo mama's so poor, she can't even afford to pay attention",
            "shut": "you shaddup you lil' twerrrrrrp",
            "dang": "ching chong bing bong wing wong",
            "trash": "you good sir, are rubbish",
            "damn": "damns are for the fishies",
            "care": "yes you do you bot",
            "go away": "no, you go away u bot",
            "...": "an ellipsis wooow you're so fancy i bet youre sooo smart",
            "leave": "i'll leave if you leave",
            "oh": "ohhhhhh yeahh!!!",
            "no": "ohhhhhh yeeesss",
            "hey": "hey is for horses",
            "client": "i am not using trumpet, definitely not on greasyfork",
            "script": "i am not using trumpet, definitely not on greasyfork",
            "troll": "yea i sometimes do trolling. but its not that funny",
            "well done": "thanks g",
            "that was": "was it though?",
            "how": "i want to know too",
            "esp": "you think people can see thru walls? thats absurd",
            "shell": "thats what we're playing",
            "weird": "ur odd",
            "lag": "get better internet pooron lol",
            "wth": "watch your heckin profanity",
            "boy": "OH GOD YOU SAID BOY IM REPORTING YOU FOR SEXISM",
            "girl": "OH GOD YOU SAID GIRL IM REPORTING YOU FOR SEXISM",
            "monkey": "get outta ur rainforest",
            "trash": "nah ur father took the recycling with him when he left",
            "father": "look in a mirror for a lack of father figure",
            "dad": "look in a mirror for a lack of father figure",
            "mad": "imagine getting mad over an egg game",
            "angry": "imagine getting angry over an egg game",
            "sad": "imagine getting sad over an egg game",
            "happy": "imagine getting happy over an egg game",
            "cheater": "Ho Ho Ho! Santa's Here! And I'm gonna give you a present! A ban! <AdminSpoof enabled>",
            "tf": "toasted fries",
        };

        const foundKeywords = Object.keys(responses).filter(keyword =>
            textAfterLastColon.toLowerCase().includes(keyword.toLowerCase())
        );

        if (foundKeywords.length > 0) {
            const firstKeyword = foundKeywords[0];
            sendChatMessage(responses[firstKeyword]);
            // console.log(firstKeyword);
            return true;
        };
        return false;
    };
    const constructChatPacket = function (str) {
        if (str.length > 255) {
            console.log('%c UH OH UR PACKET IS TOO LONG!!!!', css);
            str.length = 255;
        };

        var arr = new Uint8Array(2 * str.length + 2);
        arr[0] = ss.SERVERCODES.chat;
        arr[1] = str.length;

        for (var i = 0; i < str.length; i++) {
            arr[2 * i + 2] = str[i].charCodeAt(0) & 255;
            arr[2 * i + 3] = str[i].charCodeAt(0) >> 8 & 255; // ripped straight outta packInt16
        };
        // console.log(arr);
        return arr;
    };
    const extractChatPacket = function (packet) {
        if (!(packet instanceof ArrayBuffer)) {
            var pack_arr = new Uint8Array(packet);
        } else {
            var pack_arr = packet;
        };
        var str = "";
        for (var i = 0; i < pack_arr[1]; i++) {
            str += String.fromCharCode(pack_arr[2 * i + 2] + (pack_arr[2 * i + 3] << 8)); // ripped straight outta unpackInt16 (thanks github copilot)
        };
        return str;
    };
    const chatPacketHandler = function (packet) {
        string = extractChatPacket(packet);
        if (string.includes(antiAFKString)) {
            console.log(packet)
            console.log("AntiAFK replacement...", string.originalReplace(antiAFKString,""));
            var constructed = constructChatPacket(string.originalReplace(antiAFKString,""));
            console.log(constructed)
            return constructed;
        };
        return packet;
    };
    const modifyPacket = function (data) {
        if (!ss || (data instanceof String)) { // avoid server comm, ping, etc. necessary to load
            return data;
        };


        if (data.byteLength == 0) {
            return data;
        };

        var arr = new Uint8Array(data);

        // if (arr[0]!==17) {
        //     console.log(arr)
        // };

        if (arr[0] == ss.SERVERCODES.throwGrenade) { // comm code 27 = client to server grenade throw
            if (extract("grenadeMax")) {
                arr[1] = 255;
                console.log("StateFarm: modified a grenade packet to be at full power");
                return arr.buffer;
            } else {
                console.log("StateFarm: didn't modify grenade packet")
            };
        } else if (arr[0] == ss.SERVERCODES.chat) {
            console.log('%c Chat packet sent, chat handler!!!', css);
            return chatPacketHandler(data);
        } else {

        };

        return data;
    };
    const is39Packet = function (packetData) { // packet only sent if we are in-game
        if (packetData instanceof String) { // avoid server comm, ping, etc. necessary to load
            return false;
        };

        if (packetData.byteLength == 0) {
            return false;
        };

        var arr = new Uint8Array(packetData);
        return arr[0] == 39;
    };
    const ghostSpamToggle = function () {}
    ghostSpamToggle.enabled = false;
    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {

        var modified = modifyPacket(data);
        this._send(modified);

        if (is39Packet(data) && ghostSpamToggle.enabled) {
            for (var i = 0; i < 5; i++) {
                this._send(constructChatPacket("spammeroonie number #" + new Date().getTime() % 1000));
            };
        };
    };
    const predictBloom = function(yaw,pitch) { //outputs the difference in yaw/pitch from the bloom
        let seed = ss.MYPLAYER[H.randomGen].seed;
        let numbers = [];
        const accuracy=ss.MYPLAYER.weapon.accuracy;
        for (var i = 0; i < 3; i++) { //generate from seed the values used to scatter shot
            seed = (seed * 9301 + 49297) % 233280;
            numbers.push(((seed/233280)-0.5)*accuracy);
        };
        const range = ss.MYPLAYER.weapon.constructor.range;
        const playerRotationMatrix = L.BABYLON.Matrix.RotationYawPitchRoll(yaw, pitch, 0);
        const rangeMatrix = L.BABYLON.Matrix.Translation(0, 0, range);
        const playerAndRangeMatrix = rangeMatrix.multiply(playerRotationMatrix);
        const bloomMatrix = L.BABYLON.Matrix.RotationYawPitchRoll(numbers[0],numbers[1],numbers[2]);
        const finalBulletMatrix = playerAndRangeMatrix.multiply(bloomMatrix);
        const finalBulletTranslation = finalBulletMatrix.getTranslation();
        const bulletYaw = calculateYaw(finalBulletTranslation);
        const bulletPitch = calculatePitch(finalBulletTranslation);
        const bulletYawDiff = radianAngleDiff(yaw,bulletYaw)
        const bulletPitchDiff = radianAngleDiff(pitch,bulletPitch)
        //console.log("current accuracy: ",accuracy)
        //console.log("input yaw: ",yaw)
        //console.log("input pitch: ",pitch)
        //console.log("calculated bullet yaw: ",bulletYaw)
        //console.log("calculated bullet pitch: ",bulletPitch)
        //console.log("therefore yaw diff: ",bulletYawDiff)
        //console.log("therefore pitch diff: ",bulletPitchDiff)

        return [bulletYawDiff,bulletPitchDiff];
    };
    const applyBloom = function(dir,multiplier) { //multiplier can be set to -1 to invert
        const bloomValues=predictBloom(dir.yawReal,dir.pitchReal);
        return {
            yawReal: dir.yawReal+(bloomValues[0]*multiplier),
            pitchReal: dir.pitchReal+(bloomValues[1]*multiplier),
        };
    };
    const predictPosition = function(player) { //outputs the prediction for where a player will be in the time it takes for a bullet to reach them
        let velocityVector = new L.BABYLON.Vector3(player.dx, player.dy, player.dz);
        const bulletSpeed=ss.MYPLAYER.weapon.constructor.velocity;
        const timeDiff = distancePlayers(player, 1) / bulletSpeed + 1;
        let newPos = new L.BABYLON.Vector3(player[H.x],player[H.y],player[H.z]).add(velocityVector.scale(timeDiff));
        newPos.y = player[H.y];
        const cappedVector = new L.BABYLON.Vector3(velocityVector.x, 0.29, velocityVector.z);
        Math.capVector3(cappedVector);
        const terminalVelocity = -cappedVector.y;
        const timeAccelerating = Math.min(timeDiff, (terminalVelocity - velocityVector.y) / -0.012);
        const predictedY = velocityVector.y * timeAccelerating + timeAccelerating * (timeAccelerating) * -0.012 / 2 + newPos.y + terminalVelocity * Math.max(timeDiff - timeAccelerating, 0);
        const rayToGround = ss.RAYS[H.rayCollidesWithMap](newPos,new L.BABYLON.Vector3(0,predictedY-1-newPos.y,0), ss.RAYS.grenadeCollidesWithCell);
        newPos.y=Math.max(rayToGround ? rayToGround.pick.pickedPoint.y:0,predictedY)-0.072;
        // console.log(velocityVector, bulletSpeed, timeDiff, cappedVector, terminalVelocity, timeAccelerating, predictedY, rayToGround, newPos);
        return newPos;
    };
    const getLineOfSight = function(target,usePrediction) { //returns true if no wall collisions
        // credit for code: de_neuublue/crackware
        if (target && target[H.actor] && target[H.actor][H.bodyMesh] && target[H.actor][H.bodyMesh].renderOverlay && target[H.actor][H.bodyMesh].overlayColor.g == 1) return; //check if player is spawned in fully

        let myPlayerPosition = ss.MYPLAYER[H.actor][H.mesh].position;
        let targetPosition = extract("prediction") ? predictPosition(target) : target[H.actor][H.mesh].position; //set to always use prediction for now
        // let targetPosition = usePrediction ? predictPosition(target) : target[H.actor][H.mesh].position;

        let directionVector = getDirectionVectorFacingTarget(targetPosition,true);
        let rotationMatrix = L.BABYLON.Matrix.RotationYawPitchRoll(calculateYaw(directionVector), calculatePitch(directionVector), 0);
        let directionMatrix = L.BABYLON.Matrix.Translation(0, 0, ss.MYPLAYER.weapon.constructor.range).multiply(rotationMatrix);
        directionVector = directionMatrix.getTranslation();
        let position = L.BABYLON.Matrix.Translation(0, .1, 0).multiply(rotationMatrix).add(L.BABYLON.Matrix.Translation(myPlayerPosition.x, myPlayerPosition.y + 0.3, myPlayerPosition.z)).getTranslation();

        let rayCollidesWithMap = ss.RAYS[H.rayCollidesWithMap](position, directionVector, ss.RAYS.projectileCollidesWithCell);
        let distanceToMap = rayCollidesWithMap ? L.BABYLON.Vector3.DistanceSquared(position, rayCollidesWithMap.pick.pickedPoint) : Infinity;
        let distanceToTarget = L.BABYLON.Vector3.DistanceSquared(position, targetPosition)
        return distanceToTarget < distanceToMap
    };
    const getAimbot = function(target) {
        let targetPosition = extract("prediction") ? predictPosition(target) : target[H.actor][H.mesh].position;
        let directionVector = getDirectionVectorFacingTarget(targetPosition, true, -0.05);

        let direction = {
            yawReal: calculateYaw(directionVector),
            pitchReal: calculatePitch(directionVector),
        };

        if (extract("antiBloom")) {
            direction = applyBloom(direction, 1);
        };

        return direction;
    };
    const injectScript = function () {
        //TODO: replace with anon functions
        createAnonFunction('fixCamera', function () {
            return isKeyToggled[bindsArray.zoom] && (extract("zoom")*(Math.PI / 180)) || (extract("fov")*(Math.PI/180)) || 1.25;
        });
        createAnonFunction('getChatLimit', function () {
            return (extract("chatExtend")&&999999)||4;
        });
        createAnonFunction('getDisableChatFilt3r', function () {
            return extract("disableChatFilter");
        });
        createAnonFunction('getSkinHack', function () {
            return extract("unlockSkins");
        });
        createAnonFunction('getAdminSpoof', function () {
            return extract("adminSpoof");
        });
        createAnonFunction('getPointerEscape', function () {
            return noPointerPause;
        });
        createAnonFunction('setNewGame', function () {
            newGame = true;
            timeJoinedGame = Date.now();
        });
        createAnonFunction('interceptDeath', (KILLER, DEAD) => {
            if (DEAD.name === KILLER.name === ss.MYPLAYER.name) return; // killed self (with grenade)

            if (DEAD.name == ss.MYPLAYER.name) { // you died
                if (extract("cheatAccuse")) sendChatMessage(`${KILLER.name} might be cheating, everyone report`);
            } else if (KILLER.name == ss.MYPLAYER.name) { // you killed someone
                unsafeWindow.BAWK.play("on_killed_enemy");
                if (extract("autoEZ")) sendChatMessage(`imagine dying ${DEAD.name}, couldn't be me`);
            };
        });
        createAnonFunction('interceptAudio', function (name, panner, somethingelse) {
            // console.log(0, name, panner, somethingelse);
            let customAudio = soundsSFC[name];
            if (panner && panner.positionX && extract("distanceMult") !== 1) {
                panner.setPosition(
                    panner.context.listener.positionX.value - ((panner.context.listener.positionX.value - panner.positionX.value) * extract("distanceMult")),
                    panner.context.listener.positionY.value - ((panner.context.listener.positionY.value - panner.positionY.value) * extract("distanceMult")),
                    panner.context.listener.positionZ.value - ((panner.context.listener.positionZ.value - panner.positionZ.value) * extract("distanceMult")),
                );
            };
            if (extract("muteGame")) {
                name = "silence";
            } else if (customAudio) {
                if (customAudio.disablePanning) {
                    playAudio(name);
                } else {
                    playAudio(name, panner);
                };
                name = "silence";
            };
            return [name, panner, somethingelse];
        });
        createAnonFunction('beforeFiring', function (MYPLAYER) {
            if (extract("aimbot") && (extract("aimbotRightClick") ? isRightButtonDown : true) && (targetingComplete||extract("silentAimbot")) && ss.MYPLAYER[H.playing] && currentlyTargeting && currentlyTargeting[H.playing]) {
                const aimbot = getAimbot(currentlyTargeting);
                // credit for code: de_neuublue
                let diffYaw = Math.radDifference(ss.MYPLAYER[H.yaw], aimbot.yawReal) * 180 / Math.PI;
                let diffPositive = diffYaw > 0 // a turn to the left if positive
                diffYaw *= diffPositive ? 1 : -1;
                for (let i = 0; i < 3; i++) {
                    let state = ss.MYPLAYER[H.stateBuffer][Math.mod(ss.MYPLAYER.stateIdx - i, 256)];
                    let newControlKeys = 0;
                    if (diffYaw > 157.5) {
                        newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.left ? ss.CONTROLKEYSENUM.right : 0
                        newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.right ? ss.CONTROLKEYSENUM.left : 0
                        newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.up ? ss.CONTROLKEYSENUM.down : 0
                        newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.down ? ss.CONTROLKEYSENUM.up : 0
                    } else if (diffYaw > 112.5) {
                        if (diffPositive) {
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.left ? ss.CONTROLKEYSENUM.up + ss.CONTROLKEYSENUM.right : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.right ? ss.CONTROLKEYSENUM.down + ss.CONTROLKEYSENUM.left: 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.up ? ss.CONTROLKEYSENUM.down + ss.CONTROLKEYSENUM.right : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.down ? ss.CONTROLKEYSENUM.up + ss.CONTROLKEYSENUM.left : 0
                        } else {
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.left ? ss.CONTROLKEYSENUM.down + ss.CONTROLKEYSENUM.right : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.right ? ss.CONTROLKEYSENUM.up + ss.CONTROLKEYSENUM.left : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.up ? ss.CONTROLKEYSENUM.down + ss.CONTROLKEYSENUM.left : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.down ? ss.CONTROLKEYSENUM.up + ss.CONTROLKEYSENUM.right : 0
                        }
                    } else if (diffYaw > 67.5) {
                        if (diffPositive) {
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.left ? ss.CONTROLKEYSENUM.up : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.right ? ss.CONTROLKEYSENUM.down : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.up ? ss.CONTROLKEYSENUM.right : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.down ? ss.CONTROLKEYSENUM.left : 0
                        } else {
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.left ? ss.CONTROLKEYSENUM.down : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.right ? ss.CONTROLKEYSENUM.up : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.up ? ss.CONTROLKEYSENUM.left : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.down ? ss.CONTROLKEYSENUM.right : 0
                        }
                    } else if (diffYaw > 22.5) {
                        if (diffPositive) {
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.left ? ss.CONTROLKEYSENUM.up + ss.CONTROLKEYSENUM.left : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.right ? ss.CONTROLKEYSENUM.down + ss.CONTROLKEYSENUM.right : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.up ? ss.CONTROLKEYSENUM.up + ss.CONTROLKEYSENUM.right : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.down ? ss.CONTROLKEYSENUM.down + ss.CONTROLKEYSENUM.left : 0
                        } else {
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.left ? ss.CONTROLKEYSENUM.down + ss.CONTROLKEYSENUM.left : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.right ? ss.CONTROLKEYSENUM.up + ss.CONTROLKEYSENUM.right: 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.up ? ss.CONTROLKEYSENUM.up + ss.CONTROLKEYSENUM.left : 0
                            newControlKeys |= ss.CONTROLKEYS & ss.CONTROLKEYSENUM.down ? ss.CONTROLKEYSENUM.down + ss.CONTROLKEYSENUM.right : 0
                        };
                    };
                    // console.log(ss.CONTROLKEYS, newControlKeys);
                    state.controlKeys |= newControlKeys;
                    state[H.yaw] = setPrecision(aimbot.yawReal);
                    state[H.pitch] = setPrecision(aimbot.pitchReal);
                    ss.MYPLAYER[H.stateBuffer][Math.mod(ss.MYPLAYER.stateIdx - i, 256)] = state;
                };
                console.log("force update?");
                ss.SERVERSYNC();
            };
        });
        createAnonFunction('onConnectFail', function (ERRORCODE,ERRORARRAY) {
            errorString = findKeyByValue(ERRORARRAY,ERRORCODE);
            console.log("StateFarm has detected a connection error...",errorString,ERRORCODE,ERRORARRAY);
            if (document.getElementById("genericPopup").textContent === ' Game Not Found Sorry! This game ID is either invalid, or no longer exists.  OK '){
                document.getElementById("genericPopup").children[1].textContent = 'joinCode not found! check your autoJoin settings and get a new code';
                document.getElementById("genericPopup").children[2].children[1].textContent = "heeheeheehaw";
                document.getElementById("genericPopup").children[0].children[1].textContent = 'MAKE NEW AUTOJOIN CODE';
            };
            if ((!attemptedAutoUnban) && extract("autoUnban")&&(errorString=="sessionNotFound")) {
                console.log("StateFarm: Gonna refresh, could be banned but you can't play with this error anyways.");
                createPopup("AutoUnban: Reloading page in 5 seconds...");
                attemptedAutoUnban = true;
                setTimeout(() => {
                    if (extract("autoUnban")) { //you get a bit of time to stop it
                        createPopup("AutoUnban: Reloading page now.");
                        reloadPage(); attemptedAutoUnban = false;
                    } else {
                        createPopup("AutoUnban: Reload page cancelled.");
                    };
                }, 5000);
            };
        });
        createAnonFunction('modifyChat', function(msg) {
            if (msg!==lastSentMessage) { //not spammed or afked
                if (extract("chatFilterBypass")) {
                    const UNICODE_RTL_OVERRIDE = '\u202e'
                    msg = ([UNICODE_RTL_OVERRIDE,].concat(reverseString(msg).split(""))).join("");
                };
            };
            if (extract("tallChat") && !(msg.includes("᥊"))) {
                msg = msg + "᥊";
            };
            if (msg[0] === '%') {
                command = msg.slice(1);
                msg = ""; //dont send anything
                broadcastToBots(command);
            };
            return msg;
        });
        createAnonFunction('modifyControls', function(CONTROLKEYS) {
            // if (AUTOMATED) { CONTROLKEYS=0 };
            if (forceControlKeys) {
                forceControlKeysCache = true;
                return forceControlKeys;
            } else if (forceControlKeysCache) {
                forceControlKeysCache = false;
                return 0;
            } else {
                if (extract("autoWalk")) { CONTROLKEYS|=ss.CONTROLKEYSENUM.up };
                // credit for code: de_neuublue
                if (extract("bunnyhop") && isKeyToggled["Space"]) {
                    CONTROLKEYS |= ss.CONTROLKEYSENUM.jump;
                };
                if (extract("autoJump")) {
                    if (Date.now()>(lastAutoJump+extract("autoJumpDelay"))) {
                        CONTROLKEYS|=ss.CONTROLKEYSENUM.jump;
                        lastAutoJump=Date.now();
                    };
                };
                if (extract("autoStrafe")) {
                    if (Date.now()>(autoStrafeValue[0])) {
                        if (autoStrafeValue[1]==0) { //decide new strafe delay
                            autoStrafeValue[0]=Date.now() + randomInt(500,3000);
                            autoStrafeValue[2]=(Math.random()>0.5) ? "left" : "right";
                            autoStrafeValue[1]=1;
                        } else if (autoStrafeValue[1]==1) { //time to start strafe
                            autoStrafeValue[3]=Date.now() + randomInt(500,2000);
                            autoStrafeValue[1]=2;
                        } else if (autoStrafeValue[1]==2 && Date.now()<autoStrafeValue[3]) { //do strafe
                            CONTROLKEYS|=ss.CONTROLKEYSENUM[autoStrafeValue[2]];
                        } else if (autoStrafeValue[1]==2) { //stop strafe
                            CONTROLKEYS&=~ss.CONTROLKEYSENUM.left;
                            CONTROLKEYS&=~ss.CONTROLKEYSENUM.right;
                            autoStrafeValue[1]=0;
                        };
                    };
                };
                return CONTROLKEYS;
            };
        });
        createAnonFunction('adBlocker', function(input) {
            if (extract("adBlock")) {
                if (typeof(input) == 'boolean') {
                    return true;
                } else if (input == "user-has-adblock") {
                    return getScrambled();
                } else if (input == "adsBlocked") {
                    return false;
                };
            };
            return input;
        });
        createAnonFunction('gameBlacklisted', function(t) {
            let result = false;
            if (blacklistedGameCodes.length >= 1) {
                blacklistedGameCodes.forEach(function (code){
                    if (t.id == code){
                        console.log("Blacklisted Game: ", t.id, code);
                        result = true;
                        return true;
                    }
                });
            };

            return extract('gameBlacklist') == false || extract('gameBlacklist') == undefined ? false : result;
        });
        const originalXHROpen = XMLHttpRequest.prototype.open; //wtf??? libertymutual collab??????
        const originalXHRGetResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
        let shellshockjs
        XMLHttpRequest.prototype.open = function(...args) {
            const url = args[1];
            if (url && url.includes("js/shellshock.js")) {
                shellshockjs = this;
            };
            originalXHROpen.apply(this, args);
        };
        Object.defineProperty(XMLHttpRequest.prototype, 'response', {
            get: function() {
                if (this===shellshockjs) {
                    return applyStateFarm(originalXHRGetResponse.get.call(this));
                };
                return originalXHRGetResponse.get.call(this);
            }
        });
        const applyStateFarm = function(js) {
            console.log('%cATTEMPTING TO START STATEFARM', 'color: magenta; font-weight: bold; font-size: 1.5em; text-decoration: underline;');
            let match;
            let clientKeys;

            let originalJS = js;
            if (typeof isCrackedShell !== 'undefined') originalJS = fetchTextContent('/js/shellshock.og.js');

            let hash = CryptoJS.SHA256(originalJS).toString(CryptoJS.enc.Hex);

            let onlineClientKeys = fetchTextContent("https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/statefarm_"+hash+".json");

            if (onlineClientKeys == "value_undefined" || onlineClientKeys == null) {
                let userInput = prompt('Valid VarData could not be retrieved online. Enter VarData if you have it. Join the StateFarm Network Discord server to generate VarData! https://discord.gg/HYJG3jXVJF Perform command sf.vardata in the bot channel. Hash: '+hash, '');
                if (userInput !== null && userInput !== '') {
                    alert('Aight, let\'s try this. If it is invalid, it will just crash.');
                    clientKeys = JSON.parse(userInput);
                } else {
                    alert('You did not enter anything, this is gonna crash lmao.');
                };
            } else {
                clientKeys = JSON.parse(onlineClientKeys);
                if (GM_getValue("StateFarm_KeyCache")) {
                    GM_setValue("StateFarm_KeyCache", GM_getValue("StateFarm_KeyCache")[onlineClientKeys.hash] = onlineClientKeys);
                } else {
                    GM_setValue("StateFarm_KeyCache", {[onlineClientKeys.hash]: GM_getValue("StateFarm_KeyCache")});
                };
            };

            console.log(hash, onlineClientKeys);

            H = clientKeys.vars;

            let injectionString="";

            //SERVERSYNC
            match = new RegExp(`!${H.CULL}&&(.+?\\}\\})`).exec(js);
            H.SERVERSYNC = match ? match[1].replace(/[a-zA-Z$_\.\[\]]+shots/, 0) : "function(){console.log('no serversync womp womp')}";
            console.log("SERVERSYNC:",  match);

            const variableNameRegex = /^[a-zA-Z0-9_$\[\]"\\]*$/;
            for (let name in H) {
                deobf = H[name];
                if (name == "SERVERSYNC" || variableNameRegex.test(deobf)) { //serversync should only be defined just before...
                    injectionString = `${injectionString}${name}: (() => { try { return ${deobf}; } catch (error) { return "value_undefined"; } })(),`;
                } else {
                    alert("Message from the StateFarm Devs: WARNING! The keys inputted contain non-variable characters! There is a possibility that this could run code unintended by the StateFarm team, although possibly there is also a mistake. Do NOT proceed with using this, and report to the StateFarm developers what is printed in the console.");
                    console.log("REPORT THIS IN THE DISCORD SERVER:", name, deobf, clientKeys);
                    const crashplease = "balls";
                    crashplease = "balls2";
                };
            };

            console.log('%cSTATEFARM INJECTION STAGE 1: GATHER VARS', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');

            const modifyJS = function(find,replace) {
                let oldJS = js;
                try {
                    js = js.originalReplaceAll(find,replace);
                } catch (err) {
                    console.log("%cReplacement failed! Likely a required var was not found. Attempted to replace "+find+" with: "+replace, 'color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
                };
                if (oldJS !== js) {
                    console.log("%cReplacement successful! Injected code: replaced: "+find+" with: "+replace, 'color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
                } else {
                    console.log("%cReplacement failed! Attempted to replace "+find+" with: "+replace, 'color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
                };
            };

            const f = function(varName) { return varName.replace("$", "\\$") };

            console.log('%cSTATEFARM INJECTION STAGE 2: INJECT VAR RETRIEVAL FUNCTION AND MAIN LOOP', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
            //hook for main loop function in render loop
            modifyJS(f(H.SCENE)+'.'+f(H.render),`window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${f(H.SCENE)}.render`);
            modifyJS('console.log("After Game Ready"),', `console.log("After Game Ready: StateFarm is also trying to add vars..."),window["${functionNames.retrieveFunctions}"]({${injectionString}}),`);
            console.log('%cSuccess! Variable retrieval and main loop hooked.', 'color: green; font-weight: bold;');
            console.log('%cSTATEFARM INJECTION STAGE 3: INJECT CULL INHIBITION', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
            //stop removal of objects
            modifyJS(`${f(H.CULL)})r`,`true)r`);
            console.log('%cSuccess! Cull inhibition hooked '+f(H.CULL), 'color: green; font-weight: bold;');
            console.log('%cSTATEFARM INJECTION STAGE 4: INJECT OTHER FUNCTIONS', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
            //hook for modifications just before firing
            modifyJS('fire(){var','fire(){window.'+functionNames.beforeFiring+'(this.player);var');
            //hook for fov mods
            modifyJS(/\.fov\s*=\s*1\.25/g, '.fov = window.'+functionNames.fixCamera+'()');
            modifyJS(/\.fov\s*\+\s*\(1\.25/g, '.fov + (window.'+functionNames.fixCamera+'()');
            //chat mods: disable chat culling
            const chatCull=/;[a-zA-Z$_]+\.length>4/.exec(js)[0];
            modifyJS(chatCull,chatCull.originalReplace('4', `window.${functionNames.getChatLimit}()`));
            //chat mods: disable filter (credit to A3+++ for this finding)
            modifyJS(`!${f(H._filterFunction)}(${f(H._insideFilterFunction)})`,`((!${f(H._filterFunction)}(${f(H._insideFilterFunction)}))||window.${functionNames.getDisableChatFilter}())`);
            //chat mods: make filtered text red
            let [_, elm, str] = js.match(/\)\),([a-zA-Z$_]+)\.innerHTML=([a-zA-Z$_]+),/);
            modifyJS(_, _ + `${f(H._filterFunction)}(${str})&&!arguments[2]&&(${elm}.style.color="red"),`);
            //skins
            match = js.match(/inventory\[[a-zA-Z$_]+\].id===[a-zA-Z$_]+.id\)return!0;return!1/);
            if (match) {modifyJS(match[0], match[0] + `||window.${functionNames.getSkinHack}()`)};
            //reset join/leave msgs
            modifyJS(',console.log("joinGame()',',window.'+functionNames.setNewGame+'(),console.log("value changed, also joinGame()');
            //bypass chat filter
            modifyJS('.trim();','.trim();'+f(H._chat)+'=window.'+functionNames.modifyChat+'('+f(H._chat)+');')
            //hook for control interception
            match = new RegExp(`${f(H._update)}=function\\([a-zA-Z$_,]+\\)\\{`).exec(js)[0];
            console.log("player update function:",match);
            modifyJS(match,`${match}${f(H.CONTROLKEYS)}=window.${functionNames.modifyControls}(${f(H.CONTROLKEYS)});`);
            //admin spoof lol
            modifyJS('isGameOwner(){return ','isGameOwner(){return window.'+functionNames.getAdminSpoof+'()?true:')
            modifyJS('adminRoles(){return ','adminRoles(){return window.'+functionNames.getAdminSpoof+'()?255:')
            //grab reason for connect fail
            const FUNCTIONPARAM = new RegExp('function '+f(H._connectFail)+'\\(([a-zA-Z$_]+)\\)').exec(js)[1];
            console.log("FUNCTIONPARAM:",FUNCTIONPARAM);
            modifyJS('function '+f(H._connectFail)+'('+f(FUNCTIONPARAM)+'){','function '+f(H._connectFail)+'('+f(FUNCTIONPARAM)+'){window.'+functionNames.onConnectFail+'('+f(FUNCTIONPARAM)+','+f(H.ERRORARRAY)+');')
            //get rid of tutorial popup because its a stupid piece of shit
            modifyJS(',vueApp.onTutorialPopupClick()','');
            //annoying shit
            modifyJS('alert','console.log');
            //pointer escape
            modifyJS('onpointerlockchange=function(){','onpointerlockchange=function(){if (window.'+functionNames.getPointerEscape+'()) {return};');
            //death hook
            const DEATHARGS = new RegExp('function '+f(H._deathFunction)+'\\(([a-zA-Z$_]+,[a-zA-Z$_]+)\\)').exec(js)[1];
            console.log("DEATHARGS",DEATHARGS);
            modifyJS('function '+f(H._deathFunction)+'('+DEATHARGS+'){','function '+f(H._deathFunction)+'('+f(DEATHARGS)+'){window.'+functionNames.interceptDeath+'('+f(DEATHARGS)+');');
            //vip spoof/no ads credit absolutely goes to OakSwingZZZ
            modifyJS('adsBlocked='+FUNCTIONPARAM, 'adsBlocked='+functionNames.adBlocker+'("adsBlocked")');
            modifyJS('"user-has-adblock"', functionNames.adBlocker+'("user-has-adblock")');
            modifyJS('layed=!1', 'layed=window.'+functionNames.adBlocker+'(!1)');
            modifyJS(H.USERDATA+'.playerAccount.isUpgraded()', functionNames.adBlocker+'('+f(H.USERDATA)+'.playerAccount.isUpgraded())');
            //Modifies matchmaker JS to block gamecodes.
            match = js.match(/ion,([a-zA-Z$_]+)\(([a-zA-Z$_]+)/);
            if (match) {
                modifyJS('region,', `region,window.${functionNames.gameBlacklisted}(${match[2]})?(${match[2]}.uuid="${getScrambled()}",${match[1]}(${match[2]}),vueApp.hideSpinner()):`);
            };
            //intercept and replace audio
            match = js.match(/static play\(([a-zA-Z$_,]+)\){/);
            console.log("AUDIO INTERCEPTION", match);
            modifyJS(match[0], `${match[0]}[${match[1]}] = window.${functionNames.interceptAudio}(${match[1]});`);

            modifyJS('console.log("startShellShockers"),', `console.log("STATEFARM ACTIVE!"),`);
            modifyJS(/tp-/g,'');

            console.log(H);
            console.log(js);

            attemptedInjection = true;
            return js;
        };
    };

    JSON.safeStringify = (obj, indent = 2) => {
        let cache = [];
        const retVal = JSON.stringify(
        obj,
        (key, value) =>
            typeof value === "object" && value !== null
                ? cache.includes(value)
                    ? undefined // Duplicate reference found, discard key
                    : cache.push(value) && value // Store value in our collection
            : value,
            indent
        );
        cache = null;
        return retVal;
    };

    const deployBots = function() {
        updateBotParams();
        if (!load("firstTimeBots")) {
            save("firstTimeBots",true);
            unsafeWindow.open(bottingGuideURL);
        };

        GM_setValue("StateFarm_BotStatus",{});

        console.log("Deploying "+extract("numberBots")+" bots...");

        let botNames=[];
        for (let i = 0; i < extract("numberBots"); i++) {
            let name=(extract("botUsername"));
            if (extract("botCopyName")) {
                name = retrieveCopiedName();
                if (!name) {
                    alert("StateFarm: Cannot copy names if you haven't been in a game!");
                    return;
                };
            };
            botNames.push(name);
        };

        for (let i = 0; i < extract("numberBots"); i++) {
            let leftOffset=((i%15)*100);
            // let topOffset=((i%3)*100);
            let topOffset=0;
            let proxyURL=proxyList[proxyListIndex];
            proxyListIndex=(proxyListIndex+1)%proxyList.length;
            let params="?AUTOMATED=true&StateFarm=";
            let name=botNames[i];
            if (extract("botAntiDupe")) { name=name+String.fromCharCode(97 + Math.floor(Math.random() * 26)) };

            const addParam = function(module,setTo,noEnding) {params=params+module+">"+JSON.stringify(setTo)+(noEnding ? "" : "<")};

            addParam("eggColour",extract("eggColourBots")=="random" ? randomInt(1,7) : extractAsDropdownInt("eggColourBots"));
            addParam("autoStamp",extract("autoStampBots")=="random" ? randomInt(0,6) : extractAsDropdownInt("autoStampBots"));
            addParam("autoHat",extract("autoHatBots")=="random" ? randomInt(0,6) : extractAsDropdownInt("autoHatBots"));

            addParam("usernameAutoJoin",name,true);

            console.log("PARAMS:",params)
            unsafeWindow.open("https://"+proxyURL+"/"+params, '_blank', 'width=450,height=300,left='+leftOffset+',top='+topOffset);
        };
    };

    const constructBotParams = function() {
        const addParam = function(module,setTo,noEnding) {params=params+module+">"+JSON.stringify(setTo)+(noEnding ? "" : "<")};
        let params="";

        addParam("autoFireType",1); //while visible
        addParam("adBlock",true);

        //blacklist stuff
        addParam("blacklist",botBlacklist);
        addParam("enableBlacklistAimbot",true);
        //do aimbot
        addParam("aimbotTargetMode",1);
        addParam("aimbotVisibilityMode",1);
        addParam("prediction",extract("botAimbot"));
        addParam("aimbot",extract("botAimbot"));
        addParam("antiBloom",extract("botAimbot"));
        addParam("grenadeMax",extract("botAimbot"));
        addParam("autoRefill",extract("botAimbot"));
        //do shoot
        addParam("antiSneak",extract("botAutoShoot")?1.4:0);
        addParam("enableAutoFire",extract("botAutoShoot"));
        addParam("autoGrenade",extract("botAutoShoot"));
        //automove
        addParam("autoWalk",extract("botAutoMove"));
        addParam("autoStrafe",extract("botAutoMove"));
        addParam("autoJump",extract("botAutoMove"));
        addParam("autoJumpDelay",1500);
        //low res
        addParam("enableTextures",!extract("botLowRes"));
        addParam("setDetail",extract("botLowRes")?2:0);
        //seizure
        addParam("enableSeizureX",extract("botSeizure"));
        addParam("enableSeizureY",extract("botSeizure"));

        addParam("renderDelay",extract("renderDelayBots"));
        addParam("muteGame",extract("botMuteGame"));
        addParam("autoJoin",extract("botAutoJoin"));
        addParam("mockMode",extract("botMock"));
        addParam("autoRespawn",extract("botRespawn"));
        addParam("autoEZ",extract("botAutoEZ"));
        addParam("cheatAccuse",extract("botCheatAccuse"));
        addParam("joinCode",extract("botJoinCode"));
        addParam("autoWeapon",extractAsDropdownInt("botWeapon")+1);
        addParam("autoTeam",extractAsDropdownInt("botTeam"));
        addParam("autoUnban",extract("botAutoUnban"));
        addParam("autoRegion",extractAsDropdownInt("autoRegionBots"));
        addParam("autoGamemode",extractAsDropdownInt("autoGamemodeBots"));
        addParam("useCustomName",extract("useCustomNameBots"));
        addParam("leaveEmpty",extract("leaveEmptyBots"));
        addParam("autoLeave",extract("autoLeaveBots"));
        addParam("autoLeaveDelay",extract("autoLeaveDelayBots"));
        addParam("spamChat",extract("botSpam"));
        addParam("spamChatText",extract("spamChatTextBot"));
        addParam("tallChat",extract("botTallChat"),true);

        return params;
    };

    const detectURLParams = function() {

        if (getSearchParam("AUTOMATED")=="true") {
            console.log("Automated Window!");
            AUTOMATED=true;
        };
        let customSettings = getSearchParam("StateFarm")
        if (customSettings!==null) {
            customSettings=customSettings.split("|");
            URLParams=customSettings[0];
            console.log("StateFarm: Custom Settings in URL!", URLParams);
            // let setVars=[];
            // let setBinds=[];
            // if (customSettings[0]) {setVars=customSettings[0].split("<")};
            // if (customSettings[1]) {setVars=customSettings[0].split("<")};
            // console.log(setVars,setBinds);
            // setBinds.forEach(element=>{ //not yet done
            // });
        };
    };

    const applySettings = function(receivedConfig,reset,secondPassThru) {
        console.log(AUTOMATED,receivedConfig);
        let settings=receivedConfig.split("<");
        if (reset) {initMenu(true); console.log("StateFarm: clearing before applying settings")};
        settings.forEach(element=>{
            element=element.split(">");
            console.log(change(element[0],JSON.parse(element[1])));
        });
        createPopup("Custom StateFarm Settings Applying...");
        if (!secondPassThru) {
            setTimeout(() => {
                if (receivedConfig) {
                    applySettings(receivedConfig,false,true);
                };
            }, 150);
        };
    };

    const updateBotParams = function() {
        if (AUTOMATED) { // nuh uh.
            createPopup("Automated window cannot config bots.","error");
        } else {
            const botParams = constructBotParams();
            broadcastToBots("setconfig "+btoa(unsafeWindow.unescape(encodeURIComponent(botParams))));
            console.log("StateFarm: attempted to set bot params.");
        };
    };

    const retrieveCopiedName = function () {
        const playerSlots = document.querySelectorAll('.playerSlot--name');
        const mapNames = Array.from(playerSlots).map(playerSlot => playerSlot.textContent.trim());
        return mapNames[Math.floor(Math.random() * mapNames.length)];
    };

    loggedGameMap = false;

    // begin pathfinding

    function BinaryHeap(scoreFunction){
        this.content = [];
        this.scoreFunction = scoreFunction;
    }

    BinaryHeap.prototype = {
        push: function(element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to bubble up.
        this.bubbleUp(this.content.length - 1);
        },

        rescoreElement: function(node) {
            this.sinkDown(this.content.indexOf(node));
        },

        pop: function() {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it sink down.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
        }
        return result;
        },

        remove: function(node) {
        var length = this.content.length;
        // To remove a value, we must search through the array to find
        // it.
        for (var i = 0; i < length; i++) {
            if (this.content[i] != node) continue;
            // When it is found, the process seen in 'pop' is repeated
            // to fill up the hole.
            var end = this.content.pop();
            // If the element we popped was the one we needed to remove,
            // we're done.
            if (i == length - 1) break;
            // Otherwise, we replace the removed element with the popped
            // one, and allow it to float up or sink down as appropriate.
            this.content[i] = end;
            this.bubbleUp(i);
            this.sinkDown(i);
            break;
        }
        },

        size: function() {
        return this.content.length;
        },

        bubbleUp: function(n) {
        // Fetch the element that has to be moved.
        var element = this.content[n], score = this.scoreFunction(element);
        // When at 0, an element can not go up any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = Math.floor((n + 1) / 2) - 1,
            parent = this.content[parentN];
            // If the parent has a lesser score, things are in order and we
            // are done.
            if (score >= this.scoreFunction(parent))
            break;

            // Otherwise, swap the parent with the current element and
            // continue.
            this.content[parentN] = element;
            this.content[n] = parent;
            n = parentN;
        }
        },

        includes: function(n) {
            return this.content.includes(n);
        },

        sinkDown: function(n) {
        // Look up the target element and its score.
        var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);

        while(true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) * 2, child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
            // Look it up and compute its score.
            var child1 = this.content[child1N],
            child1Score = this.scoreFunction(child1);
            // If the score is less than our element's, we need to swap.
            if (child1Score < elemScore)
                swap = child1N;
            }
            // Do the same checks for the other child.
            if (child2N < length) {
            var child2 = this.content[child2N],
            child2Score = this.scoreFunction(child2);
            if (child2Score < (swap == null ? elemScore : child1Score))
                swap = child2N;
            }

            // No need to swap further, we are done.
            if (swap == null) break;

            // Otherwise, swap and continue.
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
        }
        }
    };

    function isNodeAir(item) {
        return item[H.mesh] === undefined;
    }

    class Position {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    var GLOBAL_NODE_LIST = [];

    class MapNode {
        constructor(position, linked, map) {
            this.position = position;
            this.linked = linked;
            GLOBAL_NODE_LIST.push(this);
            this.add_children_from_map_data(map);
            this.f = undefined;
            this.g = undefined;
            this.h = undefined;
        }
        add_link(node) {
            this.linked.push(node);
        }
        remove_link(node) {
            this.linked = this.linked.filter(item => item !== node);
        }
        can_move(node) {
            return this.linked.includes(node);
        }
        add_children_from_map_data(map_data) {
            // for each thing around us in a 3x3x3 cube, add a link if it's air and it's not above us
            for (var x = -1; x <= 1; x++) {
                for (var y = -1; y <= 0; y++) {
                    for (var z = -1; z <= 1; z++) {
                        if (x == 0 && y == 0 && z == 0) {
                            continue;
                        }
                        if (Math.abs(x) + Math.abs(y) + Math.abs(z) > 1) {
                            continue;
                        }
                        var map_data_x = Math.floor(this.position.x + x);
                        var map_data_y = Math.floor(this.position.y + y);
                        var map_data_z = Math.floor(this.position.z + z);
                        if (map_data_x < 0 || map_data_y < 0 || map_data_z < 0) {
                            continue;
                        }
                        if (map_data_x >= map_data.length || map_data_y >= map_data[0].length || map_data_z >= map_data[0][0].length) {
                            continue;
                        }
                        if (!isNodeAir(map_data[map_data_x][map_data_y][map_data_z])) {
                            continue;
                        }
                        if (y != 0) {
                            var air_directly_below = isNodeAir(map_data[map_data_x][map_data_y - 1][map_data_z]);
                        } else {
                            var air_directly_below = false;
                        }
                        // if the node is already in the list, add a link to it. Otherwise create it and then add a link to it.
                        if (GLOBAL_NODE_LIST.some(item => item.position.x == map_data_x && item.position.y == map_data_y && item.position.z == map_data_z)) {
                            if (air_directly_below && y == -1 || !air_directly_below) {
                                this.add_link(GLOBAL_NODE_LIST.find(item => item.position.x == map_data_x && item.position.y == map_data_y && item.position.z == map_data_z));
                            }
                        } else {
                            var new_node = new MapNode(new Position(map_data_x, map_data_y, map_data_z), [], map_data);
                            if (air_directly_below && y == -1 || !air_directly_below) {
                                this.add_link(new_node);
                            }
                        }

                    }
                }
            }
        }
    }

    function get_node_at(position) {
        return GLOBAL_NODE_LIST.find(item => item.position.x == position.x && item.position.y == position.y && item.position.z == position.z);
    }

    function get_player_position(player) {
        var x = Math.floor(player[H.actor][H.mesh].position.x);
        var y = Math.floor(player[H.actor][H.mesh].position.y);
        var z = Math.floor(player[H.actor][H.mesh].position.z);
        return new Position(x, y, z);
    }

    function get_player_linked_nodes(player) {
        var position = get_player_position(player);
        var node = get_node_at(position);
        if (node) {
            return node.linked;
        } else {
            return [];
        }
    }

    var map_data_created = false;

    // kazowie

    function TaxicabDist3D(pos1, pos2) {
        return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) + Math.abs(pos1.z - pos2.z);
    };

    function pathTo(node) {
        var current = node;
        var path = [];
        console.log("pathTo called")
        while (current.parent) {
            path.unshift(current);
            if (current.parent === undefined) { console.log("parent undefined; path nodes successfully acquired:", path.length)}
            current = current.parent;
            console.log("pathTo loop, list len:", path.length)
        }
        console.log("done")
        return path;
    }

    function getHeap() {
        return new BinaryHeap(function(node) {
            return node.f;
        });
    }

    function cleanList(items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.f = undefined;
            item.g = undefined;
            item.h = undefined;
            item.closed = undefined;
            item.parent = undefined;
            item.visited = undefined;
        }
    }




    function AStar(start, goal) {
        console.log("astar called")
        cleanList(GLOBAL_NODE_LIST)
        // start and goal are map nodes
        // map data is the list of all the nodes
        // each node has a .linked indicating which nodes can be traveled to from it
        // returns a list of nodes to travel through, ordered from start to goal
        // if no path is found, returns null

        var closed_set = [];


        var heuristic = TaxicabDist3D;
        var open_heap = getHeap();

        start.h = heuristic(start.position, goal.position);
        start.g = 0;
        start.f = start.g + start.h;

        open_heap.push(start);


        while (open_heap.size() != 0) {
            var current = open_heap.pop();

            if (current === goal) {
                console.log("done with astar - path found")
                var val = pathTo(current);
                console.log("done with pathTo");
                return val;
            }

            closed_set.push(current);

            var neighbors = current.linked;

            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                if (closed_set.includes(neighbor)) {
                    continue;
                }

                var tentative_g_score = current.g + 1;
                var visited = neighbor.visited;
                if (!visited || tentative_g_score < neighbor.g) {
                    neighbor.visited = true;
                    neighbor.parent = current;
                    neighbor.g = tentative_g_score;
                    neighbor.h = heuristic(neighbor.position, goal.position);
                    neighbor.f = neighbor.g + neighbor.h;
                    if (!visited) {
                        open_heap.push(neighbor);
                    } else {
                        open_heap.rescoreElement(neighbor);
                    };
                };


            };

        };


        console.log("done with astar - no path found")
        // return null if no path has been found
        return null


    };

    function print_node_list(list) {
        var output = "";
        console.log("printing node list, length:", list.length, "list:", list);
        for (var i = 0; i < list.length; i++) {
            output += list[i].position.x + ", " + list[i].position.y + ", " + list[i].position.z + "\n";
        }
        console.log(output);
    }

    function create_red_line_between_nodes(ss, node1, node2) {
        // const tracerLines = L.BABYLON.MeshBuilder.CreateLines("tracerLines", { points: [newPosition, crosshairsPosition] }, newScene);
        pos1 = [node1.position.x - 0.5, node1.position.y - 0.5, node1.position.z - 0.5];
        pos2 = [node2.position.x - 0.5, node2.position.y - 0.5, node2.position.z - 0.5];
        if (window.pathLines === undefined) {
            let node_lines = L.BABYLON.MeshBuilder.CreateLines(new Date().getTime().toString(), { points: [ss.MYPLAYER[H.actor][H.mesh].position, pos2] }, ss.MYPLAYER[H.actor].scene);
            node_lines.color = new L.BABYLON.Color3(1, 0, 0);
            node_lines.renderingGroupId = 1;
            window.pathLines = [node_lines];
        } else {
            let node_lines = L.BABYLON.MeshBuilder.CreateLines(new Date().getTime().toString(), { points: [ss.MYPLAYER[H.actor][H.mesh].position, pos2] }, ss.MYPLAYER[H.actor].scene);
            node_lines.color = new L.BABYLON.Color3(1, 0, 0);
            node_lines.renderingGroupId = 1;
            window.pathLines.push(node_lines);
        }
    }

    function create_pathfinding_lines(ss, path) {
        for (var i = 0; i < path.length - 1; i++) {
            create_red_line_between_nodes(ss, path[i], path[i + 1]);
        };
    };

    // end pathfinding

    const findKeyWithProperty = function(obj, propertyToFind) {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                continue;
            };
            if (!!obj[key] && (typeof(obj[key])=='object' || typeof(obj[key])=='function') && obj[key].hasOwnProperty(propertyToFind)) {
                return key;
            };
        };
        // Property not found
        return null;
    };

    const findStringInLists = function(dictWithLists, str) {
        for (const key in dictWithLists) {
            if (dictWithLists.hasOwnProperty(key)) {
                const list = dictWithLists[key];
                if (list.includes(str)) {
                    return key; // Return the key where the string is found
                };
            };
        };
        return null; // Return null if the string is not found in any list
    };

    const mainLoop = function () {
        const oneTime = function () {
            //xd lmao
            if (ss.MYPLAYER) {
                console.log('%cSTATEFARM IS ATTEMPTING TO LOAD L.BABYLON', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
                var script = document.createElement("script");
                script.src = babylonURL;
                script.onload = function() {
                    if (unsafeWindow.BABYLON) {
                        L.BABYLON = unsafeWindow.BABYLON;
                        delete unsafeWindow.BABYLON;

                        console.log("Babylon.js loaded successfully");
                        console.log(L.BABYLON.Engine.Version);

                        console.log('%cSTATEFARM SUCCESSFULLY LOADED BABYLON!', 'color: green; font-weight: bold; font-size: 1.2em; text-decoration: underline;');

                        H.actor = findKeyWithProperty(ss.MYPLAYER, H.mesh);
                        // Math.capVector3 = Math[H.capVector3];

                        console.log("StateFarm: found vars:", H);

                        crosshairsPosition=new L.BABYLON.Vector3();
                        Object.defineProperty(ss.MYPLAYER.scene, 'forceWireframe',  {
                            get: () => {
                                return extract("wireframe");
                            }
                        });

                        if (AUTOMATED) {
                            automatedBorder.style.borderColor = 'rgba(0, 0, 255, 1)';
                        };

                    } else {
                        console.log('%cSTATEFARM COULD NOT LOAD L.BABYLON', 'color: red; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
                    };
                };
                document.body.appendChild(script);
                ranOneTime=true;
            };
        };
        const mapStuff = function () {
            if (!map_data_created) {
                new MapNode(new Position(ss.GAMEMAP.data.length - 1, ss.GAMEMAP.data[0].length - 1, ss.GAMEMAP.data[0][0].length - 1), [], ss.GAMEMAP.data);
                map_data_created = true;
            };

            if (findNewPath && !activePath && !activeNodeTarget && get_node_at(get_player_position(ss.MYPLAYER))) {
                let player_pos = get_player_position(ss.MYPLAYER);
                let player_node = get_node_at(player_pos);
                if (player_node) {
                    let position = {
                        x: player_pos.x + Math.floor(Math.random() * 5) - 1,
                        y: player_pos.y,
                        z: player_pos.z + Math.floor(Math.random() * 5) - 1
                    }
                    // check if node at position exists
                    let random_node = get_node_at(position);

                    if (!(player_node === random_node) && random_node) {
                        console.log("location, target:")
                        print_node_list([player_node, random_node])
                        activePath = AStar(player_node, random_node);
                        if (activePath) {
                            console.log("setting active node target");
                            print_node_list(activePath);
                            activeNodeTarget = activePath[0];
                            console.log("list printed, target set, creating pathfinding lines")
                            create_pathfinding_lines(ss, activePath);
                            findNewPath = false;
                            console.log("found path to random node")
                        } else {
                            console.log("unable to find path to random node")
                        }
                    } else {
                        console.log("player node / random node not air")
                    }
                } else {
                    console.log("player not on air node currently")
                }
            }

            if (AUTOMATED && pathfindingTargetOverride !== undefined) {
                player_node = get_node_at(get_player_position(ss.MYPLAYER));
                target_node = get_node_at(pathfindingTargetOverride);
                if (player_node && target_node) {
                    path = AStar(player_node, target_node);
                    if (path) {
                        activePath = path;
                        activeNodeTarget = path[0];
                    } else {
                        if (despawnIfNoPath) {
                            sendChatMessage("despawnIfNoPath");
                        }
                    }
                }
            }

            if (activeNodeTarget && activePath) {
                console.log("found target and path");
                let player_node = get_node_at(get_player_position(ss.MYPLAYER));
                if (player_node == activeNodeTarget) {
                    activeNodeTarget = activePath.shift();
                    console.log("update target");
                    if (activePath.length == 0) {
                        console.log("path completed");
                        activePath = null;
                        activeNodeTarget = null;
                    }
                } else {
                    console.log("not at target");
                }
                /* if (!(activePath.includes(get_node_at(get_player_position(ss.MYPLAYER))))) { // went off path somehow, need to find new path
                    findNewPath = true;
                    activePath = null;
                    activeNodeTarget = null;
                    console.log("went off path, finding new path")
                } */
            }

            if (activeNodeTarget) {
                // look towards the node
                console.log("looking towards node")
                let directionVector = getDirectionVectorFacingTarget(activeNodeTarget.position, true, 0);
                let forwardVector = new L.BABYLON.Vector3(0, 0, 1);
                console.log("vector obtained: ", directionVector);
                ss.MYPLAYER[H.yaw] = setPrecision(calculateYaw(directionVector));
                ss.MYPLAYER[H.pitch] = setPrecision(calculatePitch(forwardVector));
                console.log("pitch and yaw set: ", ss.MYPLAYER[H.pitch], ss.MYPLAYER[H.yaw]);
                forceControlKeys = ss.CONTROLKEYSENUM.up;
                console.log("done with looking & window forward set")
            };
        };
        const initVars = function () {

            isBanned=false; //cant be banned if in a game /shrug
            errorString=undefined; //no error if ur playing
            forceControlKeys=undefined; //reset every frame

            if (newGame) {
                onlinePlayersArray=[];
            };
            if (extract("debug")&&(typeof playerLogger === 'undefined')) {
                playerLogger=[];
            };
            const weaponBox = document.getElementById("weaponBox");
            const chatContainer = document.getElementById('chatOut');
            const chatItems = chatContainer.getElementsByClassName('chat-item');
            if ((weaponBox.style.display!=lastWeaponBox)||(chatItems.length!=lastChatItemLength)) {
                lastWeaponBox=weaponBox.style.display;
                lastChatItemLength=chatItems.length;

                const maxChat = extract("maxChat");
                const maxMessages = (weaponBox.style.display === "block" && maxChat) || 9999999;

                const startIndex = Math.max(0, chatItems.length - maxMessages);

                for (let i = chatItems.length - 1; i >= 0; i--) {
                    const chatIndex = i - startIndex;
                    const isInRange = chatIndex >= 0 && chatIndex < maxMessages;
                    chatItems[i].style.display = isInRange ? '' : 'none';
                };
            };

            if (didStateFarm) {
                if (!loggedGameMap) {
                    console.log(ss.GAMEMAP.width, ss.GAMEMAP.height, ss.GAMEMAP.data);
                    loggedGameMap = true;
                };
                username=ss.MYPLAYER?.name;

                crosshairsPosition.copyFrom(ss.MYPLAYER[H.actor][H.mesh].position);
                const horizontalOffset = Math.sin(ss.MYPLAYER[H.actor][H.mesh].rotation.y);
                const verticalOffset = Math.sin(-ss.MYPLAYER[H.pitch]);
                crosshairsPosition.x += horizontalOffset;
                crosshairsPosition.z += Math.cos(ss.MYPLAYER[H.actor][H.mesh].rotation.y);
                crosshairsPosition.y += verticalOffset + 0.4;

                ammo=ss.MYPLAYER.weapon.ammo;

                whitelistPlayers=(extract("whitelist")||"").split(',');
                blacklistPlayers=(extract("blacklist")||"").split(',');

                ss.MYPLAYER[H.actor].scene.texturesEnabled=extract("enableTextures");
            };
        };
        const updateLinesESP = function () {
            const objExists=Date.now();

            //update playerESP boxes, tracer lines, colors
            ss.PLAYERS.forEach(player=>{
                if (player && (player!==ss.MYPLAYER) && player[H.playing] && (player[H.hp]>0) && ((!ss.MYPLAYER.team)||( player.team!==ss.MYPLAYER.team))) {
                    const whitelisted=(extract("whitelistESPType")=="highlight"||!extract("enableWhitelistTracers")||playerMatchesList(whitelistPlayers,player));
                    const blacklisted=(extract("blacklistESPType")=="justexclude"&&extract("enableBlacklistTracers")&&playerMatchesList(blacklistPlayers,player));
                    const passedLists=whitelisted&&(!blacklisted);
                    const tracersType=extract("tracersType");

                    let color,progress;
                    if (extract("enableWhitelistTracers") && extract("whitelistESPType")=="highlight" && playerMatchesList(whitelistPlayers,player) ) {
                        color=hexToRgb(extract("whitelistColor"));
                    } else if (extract("enableBlacklistTracers") && extract("blacklistESPType")=="highlight" && playerMatchesList(blacklistPlayers,player) ) {
                        color=hexToRgb(extract("blacklistColor"));
                    } else if ( tracersType=="proximity" ) {
                        const distance = distancePlayers(player);
                        if (distance < extract("tracersColor1to2")) { //fade between first set
                            progress=(distance/extract("tracersColor1to2"));
                            color=fadeBetweenColors(extract("tracersColor1"),extract("tracersColor2"),progress);
                        } else if (distance < extract("tracersColor2to3")) { //fade between second set
                            progress=((distance-extract("tracersColor1to2"))/(extract("tracersColor2to3")-extract("tracersColor1to2")));
                            color=fadeBetweenColors(extract("tracersColor2"),extract("tracersColor3"),progress);
                        } else {
                            color=hexToRgb(extract("tracersColor3"));
                        };
                    } else if (tracersType=="static") {
                        color=hexToRgb(extract("tracersColor1"));
                    } else if (tracersType == "visibility") {
                        color = getLineOfSight(player) ? hexToRgb(extract("tracersColor2")) : hexToRgb(extract("tracersColor1"))
                    };
                    updateOrCreateLinesESP(player,"playerESP",color);

                    player.tracerLines.visibility = player[H.playing] && extract("tracers") && passedLists;
                    player.box.visibility = extract("playerESP") && passedLists;
                    // player.target.visibility = extract("targets") && passedLists;
                    player.target.visibility = false;

                    if (player[H.actor]) {
                        eggSize=extract("eggSize")
                        player[H.actor][H.bodyMesh].scaling = {x:eggSize, y:eggSize, z:eggSize}
                    };

                    player[H.actor][H.bodyMesh].renderingGroupId = extract("chams") ? 1 : 0;

                    player.exists=objExists;
                };
                if (player) {
                    if (extract("nametags") && player[H.actor] && player[H.actor].nameSprite) { //taken from shellshock.js, so var names are weird
                        player[H.actor].nameSprite._manager.renderingGroupId = 1;
                        player[H.actor].nameSprite.renderingGroupId = 1;
                        var h = Math.length3(player[H.x] - ss.MYPLAYER[H.x], player[H.y] - ss.MYPLAYER[H.y], player[H.z] - ss.MYPLAYER[H.z]),
                        d = Math.pow(h, 1.25)*2;
                        player[H.actor].nameSprite.width = d / 10 + .6, player[H.actor].nameSprite.height = d / 20 + .3;
                        ss.MYPLAYER[H.actor].scene.activeCamera.fov=0.75
                    };
                    if (!player.logged) {
                        player.logged=true;
                        if (extract("debug")) { playerLogger.push(player);console.log("Logged player: "+player.name,player) }; //if youre a l33t kiddy who did a search for the term "logger", this does not in fact log any of the user's info. it just keeps track of players who joined and prints them to console.
                        if (extract("joinMessages") && (!newGame)) {
                            if (extract("publicBroadcast")) {
                                sendChatMessage((extract("joinLeaveBranding") ? "[SFC] " : "")+player.name+" joined.")
                            } else {
                                processChatItem("joined.",player.name,player.team,"rgba(0, 255, 0, 0.2)");
                            };
                        };
                        onlinePlayersArray.push([player,player.name,player.team]);
                    };
                    player.isOnline=objExists;
                };
            });
            playersInGame=onlinePlayersArray.length;
            for ( let i=0;i<onlinePlayersArray.length;i++) {
                if (onlinePlayersArray[i][0] && onlinePlayersArray[i][0].isOnline==objExists) { //player still online
                    onlinePlayersArray[i][2]=onlinePlayersArray[i][0].team;
                } else {
                    if (extract("leaveMessages") && (!newGame)) {
                        if (extract("publicBroadcast")) {
                            sendChatMessage((extract("joinLeaveBranding") ? "[SFC] " : "")+onlinePlayersArray[i][1]+" left.")
                        } else {
                            processChatItem("left.",onlinePlayersArray[i][1],onlinePlayersArray[i][2],"rgba(255, 0, 0, 0.2)");
                        };
                    };
                    onlinePlayersArray.splice(i,1);
                };
            };
            //update ammoESP boxes, tracer lines, colors
            if (extract("ammoESP")||extract("ammoTracers")||extract("grenadeESP")||extract("grenadeTracers")) {
                ss.OBJECTSVAR.getShadowMap()[H.renderList].forEach(item=>{
                    if ( item._isEnabled && item.sourceMesh && item.sourceMesh.name && (item.sourceMesh.name=="grenadeItem" || item.sourceMesh.name=="ammo") ) { //this is what we want
                        const itemType=item.sourceMesh.name;
                        let color=itemType=="ammo" && extract("ammoESPColor") || extract("grenadeESPColor");
                        color = hexToRgb(color);

                        updateOrCreateLinesESP(item,"ammoESP",color)

                        let willBeVisible=false;

                        if (itemType=="ammo") { //ammo
                            const regime=extract("ammoESPRegime");
                            if (regime=="whendepleted" && ammo.store==0) {
                                willBeVisible=true;
                            } else if (regime=="whenlow" && ammo.store<=ammo.capacity) {
                                willBeVisible=true;
                            } else if (regime=="belowmax" && ammo.store<ammo.storeMax) {
                                willBeVisible=true;
                            } else if (regime=="alwayson") {
                                willBeVisible=true;
                            };
                        } else { //grenades
                            const regime=extract("grenadeESPRegime");
                            if (regime=="whendepleted" && ss.MYPLAYER.grenadeCount==0) {
                                willBeVisible=true;
                            } else if (regime=="whenlow" && ss.MYPLAYER.grenadeCount<=1) {
                                willBeVisible=true;
                            } else if (regime=="belowmax" && ss.MYPLAYER.grenadeCount<ss.MYPLAYER.grenadeCapacity) {
                                willBeVisible=true;
                            } else if (regime=="alwayson") {
                                willBeVisible=true;
                            };
                        };

                        item.box.visibility = willBeVisible && (itemType=="ammo" && extract("ammoESP") || extract("grenadeESP"));
                        item.tracerLines.visibility = willBeVisible && (itemType=="ammo" && extract("ammoTracers") || extract("grenadeTracers"));

                        item.exists=objExists;
                    };
                });
            };
            for ( let i=0;i<ESPArray.length;i++) {
                if (ESPArray[i][0] && ESPArray[i][0].exists==objExists) { //obj still exists and still relevant
                    //do nothing, lol
                } else {
                    if (ESPArray[i][0]) { //obj still exists but no longer relevant
                        console.log( '%cRemoving tracer line due to irrelevant object', 'color: white; background: red' );
                        ESPArray[i][0].generatedESP=false;
                    } else { //obj no longer exists
                        console.log( '%cRemoving tracer line due to no longer exists', 'color: white; background: red' );
                    };
                    ESPArray[i][1].dispose(); //tracer
                    ESPArray[i][2].dispose(); //esp box
                    if (ESPArray[i][3]) {ESPArray[i][3].dispose()}; //target
                    ESPArray.splice(i,1);
                };
            }; newGame=false;
        };
        createAnonFunction("retrieveFunctions",function(vars,doStateFarm) {
            ss=vars;
            if (doStateFarm) {
                didStateFarm = true;
                return F.STATEFARM();
            } else {
                console.log("StateFarm: creating silence audio");
                unsafeWindow.BAWK.sounds.silence = Object.assign({}, unsafeWindow.BAWK.sounds.ammo);
                unsafeWindow.BAWK.sounds.silence.end = 0.001;
            };
        });
        createAnonFunction("STATEFARM",function(){
            ss.PLAYERS.forEach(PLAYER=>{
                if (PLAYER.hasOwnProperty("ws")) {
                    ss.MYPLAYER = PLAYER
                };
            });
            if ( !ranOneTime ) {
                oneTime();
            } else if ( typeof(L.BABYLON) !== 'undefined' ) {
                initVars();
                updateLinesESP();
                // mapStuff();


                let isVisible;
                const player=currentlyTargeting||playerLookingAt||undefined;
                if (player && player[H.playing]) {
                    isVisible=getLineOfSight(player);
                };
                highlightCrossHairReticleDot(extract("showLOS")?isVisible:null);

                if (extract("radar")){
                    myPlayerDot.style.display = 'block';
                    ss.PLAYERS.forEach(player=>{updateMiniMap(player,ss.MYPLAYER)});
                }
                else {
                    ss.PLAYERS.forEach(player=>{
                        if (playerDotsMap.has(player.uniqueId)) {
                            const playerDotToRemove = playerDotsMap.get(player.uniqueId);
                            mapEl.removeChild(playerDotToRemove);
                            playerDotsMap.delete(player.uniqueId);
                        }
                    });
                    myPlayerDot.style.display = 'none';
                }

                if ( extract("freecam") ) {
                    ss.MYPLAYER[H.actor][H.mesh].position.y = ss.MYPLAYER[H.actor][H.mesh].position.y + 1;
                };
                if (extract("spamChat")) {
                    if (document.getElementById("chatIn").style.visibility == 'visible') {
                        if (spamDelay < Date.now()) {
                            if (Date.now()>(lastSpamMessage[0]+extract("spamChatDelay"))) {
                                let possibleMessages = extract("spamChatText").split("|");
                                let chosenMessage = possibleMessages[spamMessageCount%possibleMessages.length];
                                if (chosenMessage == lastSpamMessage[1]) {chosenMessage += String.fromCharCode(97 + Math.floor(Math.random() * 26))};
                                sendChatMessage(chosenMessage);
                                lastSpamMessage=[Date.now(),chosenMessage];
                                spamMessageCount+=1;
                            };
                        } else if (spamDelay < Date.now()-250) {
                            spamDelay = Date.now()+250;
                        };
                    };
                };
                if ( extract("chatHighlight") ) {
                    document.getElementById("chatOut").style.userSelect="text"
                };
                if ( extract("autoRefill") ) {
                    //console.log(ss.MYPLAYER.weapon);
                    if (ammo.rounds==0) {
                        ss.MYPLAYER.reload();
                    } else if (extract("smartRefill")) {
                        let smartRefillMinAmmo = {
                            eggk47:1,
                            dozenGauge:0,
                            csg1:1,
                            rpegg:0,
                            smg:1,
                            m24:0,
                            aug:3,
                            cluck9mm:1
                        };
                        if (ammo.rounds <= smartRefillMinAmmo[ss.MYPLAYER.weapon.constructor.standardMeshName]) {
                            ss.MYPLAYER.reload();
                        };
                    };
                };
                if (extract("autoGrenade") && isVisible && (ss.MYPLAYER.grenadeCount>0)) {
                    ss.MYPLAYER.throwGrenade();
                };
                if ((extract("autoWeapon")!=="disabled")&&(!ss.MYPLAYER[H.playing])) {
                    weaponArray.random = randomInt(0,6);
                    document.querySelectorAll('.weapon_img')[weaponArray[extract("autoWeapon")]].parentNode.click();
                };
                if (extract("revealBloom") || extract("showMinAngle")) {
                    const distCenterToOuter = 2 * (200 / ss.CAMERA.fov);
                    const bloomValues=predictBloom(ss.MYPLAYER[H.yaw],ss.MYPLAYER[H.pitch]);
                    // Set the new position of the circle
                    const centerX = (unsafeWindow.innerWidth / 2);
                    const centerY = (unsafeWindow.innerHeight / 2);
                    const offsettedX = centerX + (2 * distCenterToOuter * bloomValues[0]);
                    const offsettedY = centerY + (2 * distCenterToOuter * bloomValues[1]);
                    if (extract("revealBloom")) {
                        redCircle.style.display='';
                        redCircle.style.bottom = offsettedY + 'px';
                        redCircle.style.right = offsettedX + 'px';
                    } else {
                        redCircle.style.display='none';
                    };
                    if (extract("showMinAngle")) {
                        minangleCircle.style.display = '';
                        let idkWhatThisIs = 25*(1.25/ss.CAMERA.fov);
                        minangleCircle.style.width = extract("aimbotMinAngle") * idkWhatThisIs + 'px';
                        minangleCircle.style.height = extract("aimbotMinAngle") * idkWhatThisIs + 'px';
                        minangleCircle.style.bottom = offsettedY + 'px';
                        minangleCircle.style.right = offsettedX + 'px';
                    } else {
                        minangleCircle.style.display='none';
                    };
                };

                // playerNearest=undefined; //currently unused and not defined
                // enemyLookingAt=undefined; //currently unused and not defined

                let playerLookingAtMinimum = 999999;
                playerLookingAt=undefined; //used for player info

                let enemyMinimumDistance = 999999;
                enemyNearest=undefined; //used for antisneak

                let previousTarget=currentlyTargeting;
                let selectNewTarget=(!extract("antiSwitch")||!currentlyTargeting);
                let isDoingAimbot=(extract("aimbot") && (extract("aimbotRightClick") ? isRightButtonDown : true) && ss.MYPLAYER[H.playing]);
                // console.log(targetingComplete);

                const targetType = extract("aimbotTargetMode");
                const visibilityMode = extract("aimbotVisibilityMode");

                let enemyMinimumValue = ((targetType == "pointingat") && (extract("silentAimbot"))) ? deg2rad(extract("aimbotMinAngle")) : 10000; //used for selecting target (either pointingat or nearest)

                let didAimbot
                const candidates=[];
                let amountVisible=0;

                ss.PLAYERS.forEach(player=>{ //iterate over all players to
                    if (player && (player!==ss.MYPLAYER) && player[H.playing] && (player[H.hp]>0)) {
                        const whitelisted=(!extract("enableWhitelistAimbot")||extract("enableWhitelistAimbot")&&playerMatchesList(whitelistPlayers,player));
                        const blacklisted=(extract("enableBlacklistAimbot")&&playerMatchesList(blacklistPlayers,player));
                        const passedLists=whitelisted&&(!blacklisted);
                        player.distance=distancePlayers(player);
                        player.adjustedDistance=distancePlayers(player,2);
                        const directionVector=getDirectionVectorFacingTarget(player);
                        player.angleDiff=getAngularDifference(ss.MYPLAYER, {yawReal: calculateYaw(directionVector), pitchReal: calculatePitch(directionVector)});
                        player.isVisible=getLineOfSight(player,extract("prediction"));

                        if (player.angleDiff < playerLookingAtMinimum) {
                            playerLookingAtMinimum = player.angleDiff;
                            playerLookingAt = player;
                        };

                        if (passedLists && ((!ss.MYPLAYER.team)||( player.team!==ss.MYPLAYER.team))) { //is an an enemy
                            if (isDoingAimbot) { //is doing aimbot and we care about getting a new target
                                if (player.adjustedDistance<enemyMinimumValue) { //for antisneak, not targeting
                                    enemyMinimumDistance = player.adjustedDistance;
                                    enemyNearest = player;
                                };
                                if (selectNewTarget) {
                                    candidates.push(player);
                                    if (player.isVisible) { amountVisible+=1 };
                                };
                            };
                        };
                    };
                });

                candidates.forEach(player=>{
                    const valueToUse=((targetType=="nearest"&&player.adjustedDistance)||(targetType=="pointingat"&&player.angleDiff));
                    let visibleValue;
                    if (visibilityMode=="disabled") { //we dont care about that shit
                        visibleValue = true; //go ahead
                    } else if (amountVisible<1) { //none of candidates are visibS
                        visibleValue = (visibilityMode=="onlyvisible" ? false : true); //there are no visible candidates, so either select none if "onlyvisible" or ignore this altogether
                    } else { //some are visible
                        visibleValue = player.isVisible; //assuming now that either "prioritise" or "onlyvisible" are enabled, as "onlyvisible"'s use case fulfilled in previous statement
                    };
                    if (visibleValue) {
                        if (valueToUse < enemyMinimumValue ) {
                            enemyMinimumValue = valueToUse;
                            currentlyTargeting = player;
                        };
                    };
                });

                if (isDoingAimbot) {
                    //globalSS.currentlyTargeting = currentlyTargeting;
                    if ( currentlyTargeting && currentlyTargeting[H.playing] && currentlyTargeting[H.actor] ) { //found a target
                        didAimbot=true;
                        if (extract("tracers")) {
                            currentlyTargeting.tracerLines.color = new L.BABYLON.Color3(...hexToRgb(extract("aimbotColor")));
                        };
                        if (extract("playerESP")) {
                            currentlyTargeting.box.color = new L.BABYLON.Color3(...hexToRgb(extract("aimbotColor")));
                        };
                        if ((!extract("silentAimbot")) && (!extract("noWallTrack") || getLineOfSight(player,true)) && (targetingComplete||(deg2rad(extract("aimbotMinAngle"))>currentlyTargeting?.angleDiff))) {
                            const distanceBetweenPlayers = distancePlayers(currentlyTargeting);

                            const aimbot=getAimbot(currentlyTargeting);

                            const antiSnap=(1-(extract("aimbotAntiSnap")||0));

                            if (previousTarget!==currentlyTargeting) { targetingComplete=false };

                            const lerp = function(start, end, alpha) {
                                let value = (1 - alpha ) * start + alpha * end;
                                if ((Math.abs(end - start) < (0.2/(distanceBetweenPlayers))) || (targetingComplete)) {
                                    value = end; targetingComplete=true;
                                };
                                return value;
                            };

                            // Exponential lerp towards the target rotation
                            ss.MYPLAYER[H.yaw] = setPrecision(lerp(ss.MYPLAYER[H.yaw], aimbot.yawReal, antiSnap));
                            ss.MYPLAYER[H.pitch] = setPrecision(lerp(ss.MYPLAYER[H.pitch], aimbot.pitchReal, antiSnap));
                        };
                        if ( enemyMinimumDistance < extract("antiSneak")) {
                            currentlyTargeting = enemyNearest;
                            if (ammo.rounds === 0) { //basically after MAGDUMP, switch to pistol, if that is empty reload and keep shootin'
                                if (ss.MYPLAYER.weaponIdx === 0){ss.MYPLAYER.swapWeapon(1);}
                                else {ss.MYPLAYER.reload();}
                            };
                            ss.MYPLAYER.pullTrigger();
                            // console.log("ANTISNEAK---->", enemyNearest?.name, enemyMinimumDistance);
                        };
                    } else {
                        if (extract("oneKill")) {
                            currentlyTargeting="dead";
                        } else {
                            currentlyTargeting=false;
                        };
                    };
                } else {
                    currentlyTargeting=false;
                    targetingComplete=false;
                    if (extract("enableSeizureX")) {
                        ss.MYPLAYER[H.yaw]+=extract("amountSeizureX")
                    };
                    if (extract("enableSeizureY")) {
                        ss.MYPLAYER[H.pitch]+=extract("amountSeizureY")
                    };
                };
                highlightTargetOnLeaderboard(currentlyTargeting, (extract("highlightLeaderboard")) ? didAimbot : false);
                if (extract("upsideDown")) { //sorta useless
                    if (ss.MYPLAYER[H.pitch]<1.5 && ss.MYPLAYER[H.pitch]>-1.5) {
                        ss.MYPLAYER[H.pitch]=Math.PI;
                    };
                };
                if (extract("silentRoll")) {
                    ss.MYPLAYER[H.pitch]+=2*Math.PI;
                };

                if (extract("enableAutoFire")) {
                    let autoFireType=extract("autoFireType");
                    let doAutoFire=false
                    if (autoFireType=="always") {
                        doAutoFire=true;
                    } else if (autoFireType=="whileAimbot" && didAimbot) {
                        doAutoFire=true;
                    } else if (autoFireType=="whileVisible" && isVisible) {
                        doAutoFire=true;
                    } else if (autoFireType=="whileVisAimbot" && isVisible && didAimbot) {
                        doAutoFire=true;
                    };
                    if (doAutoFire) {
                        if ((ammo.rounds>0)||(ammo.store>0)) {
                            ss.MYPLAYER.pullTrigger();
                        } else {
                            ss.MYPLAYER.melee();
                        };
                    };
                    //method by de_Neuublue
                    if ( autoFireType=="forceAutomatic" ) {
                        if (ss.MYPLAYER.weapon.constructor.originallySemi == null) {
                            ss.MYPLAYER.weapon.constructor.originallySemi = !ss.MYPLAYER.weapon.constructor.automatic;
                        };
                        ss.MYPLAYER.weapon.constructor.automatic = true;
                    } else if (ss.MYPLAYER.weapon.constructor.originallySemi) {
                        ss.MYPLAYER.weapon.constructor.originallySemi = null;
                        ss.MYPLAYER.weapon.constructor.automatic = false;
                    };
                };

                let doRender = true;

                if ((extract("renderDelay")>10) && (Date.now()<(previousFrame+extract("renderDelay")))) { //because bots lmao
                    doRender = false;
                } else {
                    previousFrame = Date.now();
                };

                return (!doRender);
            };
        });
    };

    var css = "text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(5.4, 100%, 50%), 3px 2px hsl(10.8, 100%, 50%), 5px 3px hsl(16.2, 100%, 50%), 7px 4px hsl(21.6, 100%, 50%), 9px 5px hsl(27, 100%, 50%), 11px 6px hsl(32.4, 100%, 50%), 13px 7px hsl(37.8, 100%, 50%), 14px 8px hsl(43.2, 100%, 50%), 16px 9px hsl(48.6, 100%, 50%), 18px 10px hsl(54, 100%, 50%), 20px 11px hsl(59.4, 100%, 50%), 22px 12px hsl(64.8, 100%, 50%), 23px 13px hsl(70.2, 100%, 50%), 25px 14px hsl(75.6, 100%, 50%), 27px 15px hsl(81, 100%, 50%), 28px 16px hsl(86.4, 100%, 50%), 30px 17px hsl(91.8, 100%, 50%), 32px 18px hsl(97.2, 100%, 50%), 33px 19px hsl(102.6, 100%, 50%), 35px 20px hsl(108, 100%, 50%), 36px 21px hsl(113.4, 100%, 50%), 38px 22px hsl(118.8, 100%, 50%), 39px 23px hsl(124.2, 100%, 50%), 41px 24px hsl(129.6, 100%, 50%), 42px 25px hsl(135, 100%, 50%), 43px 26px hsl(140.4, 100%, 50%), 45px 27px hsl(145.8, 100%, 50%), 46px 28px hsl(151.2, 100%, 50%), 47px 29px hsl(156.6, 100%, 50%), 48px 30px hsl(162, 100%, 50%), 49px 31px hsl(167.4, 100%, 50%), 50px 32px hsl(172.8, 100%, 50%), 51px 33px hsl(178.2, 100%, 50%), 52px 34px hsl(183.6, 100%, 50%), 53px 35px hsl(189, 100%, 50%), 54px 36px hsl(194.4, 100%, 50%), 55px 37px hsl(199.8, 100%, 50%), 55px 38px hsl(205.2, 100%, 50%), 56px 39px hsl(210.6, 100%, 50%), 57px 40px hsl(216, 100%, 50%), 57px 41px hsl(221.4, 100%, 50%), 58px 42px hsl(226.8, 100%, 50%), 58px 43px hsl(232.2, 100%, 50%), 58px 44px hsl(237.6, 100%, 50%), 59px 45px hsl(243, 100%, 50%), 59px 46px hsl(248.4, 100%, 50%), 59px 47px hsl(253.8, 100%, 50%), 59px 48px hsl(259.2, 100%, 50%), 59px 49px hsl(264.6, 100%, 50%), 60px 50px hsl(270, 100%, 50%), 59px 51px hsl(275.4, 100%, 50%), 59px 52px hsl(280.8, 100%, 50%), 59px 53px hsl(286.2, 100%, 50%), 59px 54px hsl(291.6, 100%, 50%), 59px 55px hsl(297, 100%, 50%), 58px 56px hsl(302.4, 100%, 50%), 58px 57px hsl(307.8, 100%, 50%), 58px 58px hsl(313.2, 100%, 50%), 57px 59px hsl(318.6, 100%, 50%), 57px 60px hsl(324, 100%, 50%), 56px 61px hsl(329.4, 100%, 50%), 55px 62px hsl(334.8, 100%, 50%), 55px 63px hsl(340.2, 100%, 50%), 54px 64px hsl(345.6, 100%, 50%), 53px 65px hsl(351, 100%, 50%), 52px 66px hsl(356.4, 100%, 50%), 51px 67px hsl(361.8, 100%, 50%), 50px 68px hsl(367.2, 100%, 50%), 49px 69px hsl(372.6, 100%, 50%), 48px 70px hsl(378, 100%, 50%), 47px 71px hsl(383.4, 100%, 50%), 46px 72px hsl(388.8, 100%, 50%), 45px 73px hsl(394.2, 100%, 50%), 43px 74px hsl(399.6, 100%, 50%), 42px 75px hsl(405, 100%, 50%), 41px 76px hsl(410.4, 100%, 50%), 39px 77px hsl(415.8, 100%, 50%), 38px 78px hsl(421.2, 100%, 50%), 36px 79px hsl(426.6, 100%, 50%), 35px 80px hsl(432, 100%, 50%), 33px 81px hsl(437.4, 100%, 50%), 32px 82px hsl(442.8, 100%, 50%), 30px 83px hsl(448.2, 100%, 50%), 28px 84px hsl(453.6, 100%, 50%), 27px 85px hsl(459, 100%, 50%), 25px 86px hsl(464.4, 100%, 50%), 23px 87px hsl(469.8, 100%, 50%), 22px 88px hsl(475.2, 100%, 50%), 20px 89px hsl(480.6, 100%, 50%), 18px 90px hsl(486, 100%, 50%), 16px 91px hsl(491.4, 100%, 50%), 14px 92px hsl(496.8, 100%, 50%), 13px 93px hsl(502.2, 100%, 50%), 11px 94px hsl(507.6, 100%, 50%), 9px 95px hsl(513, 100%, 50%), 7px 96px hsl(518.4, 100%, 50%), 5px 97px hsl(523.8, 100%, 50%), 3px 98px hsl(529.2, 100%, 50%), 1px 99px hsl(534.6, 100%, 50%), 7px 100px hsl(540, 100%, 50%), -1px 101px hsl(545.4, 100%, 50%), -3px 102px hsl(550.8, 100%, 50%), -5px 103px hsl(556.2, 100%, 50%), -7px 104px hsl(561.6, 100%, 50%), -9px 105px hsl(567, 100%, 50%), -11px 106px hsl(572.4, 100%, 50%), -13px 107px hsl(577.8, 100%, 50%), -14px 108px hsl(583.2, 100%, 50%), -16px 109px hsl(588.6, 100%, 50%), -18px 110px hsl(594, 100%, 50%), -20px 111px hsl(599.4, 100%, 50%), -22px 112px hsl(604.8, 100%, 50%), -23px 113px hsl(610.2, 100%, 50%), -25px 114px hsl(615.6, 100%, 50%), -27px 115px hsl(621, 100%, 50%), -28px 116px hsl(626.4, 100%, 50%), -30px 117px hsl(631.8, 100%, 50%), -32px 118px hsl(637.2, 100%, 50%), -33px 119px hsl(642.6, 100%, 50%), -35px 120px hsl(648, 100%, 50%), -36px 121px hsl(653.4, 100%, 50%), -38px 122px hsl(658.8, 100%, 50%), -39px 123px hsl(664.2, 100%, 50%), -41px 124px hsl(669.6, 100%, 50%), -42px 125px hsl(675, 100%, 50%), -43px 126px hsl(680.4, 100%, 50%), -45px 127px hsl(685.8, 100%, 50%), -46px 128px hsl(691.2, 100%, 50%), -47px 129px hsl(696.6, 100%, 50%), -48px 130px hsl(702, 100%, 50%), -49px 131px hsl(707.4, 100%, 50%), -50px 132px hsl(712.8, 100%, 50%), -51px 133px hsl(718.2, 100%, 50%), -52px 134px hsl(723.6, 100%, 50%), -53px 135px hsl(729, 100%, 50%), -54px 136px hsl(734.4, 100%, 50%), -55px 137px hsl(739.8, 100%, 50%), -55px 138px hsl(745.2, 100%, 50%), -56px 139px hsl(750.6, 100%, 50%), -57px 140px hsl(756, 100%, 50%), -57px 141px hsl(761.4, 100%, 50%), -58px 142px hsl(766.8, 100%, 50%), -58px 143px hsl(772.2, 100%, 50%), -58px 144px hsl(777.6, 100%, 50%), -59px 145px hsl(783, 100%, 50%), -59px 146px hsl(788.4, 100%, 50%), -59px 147px hsl(793.8, 100%, 50%), -59px 148px hsl(799.2, 100%, 50%), -59px 149px hsl(804.6, 100%, 50%), -60px 150px hsl(810, 100%, 50%), -59px 151px hsl(815.4, 100%, 50%), -59px 152px hsl(820.8, 100%, 50%), -59px 153px hsl(826.2, 100%, 50%), -59px 154px hsl(831.6, 100%, 50%), -59px 155px hsl(837, 100%, 50%), -58px 156px hsl(842.4, 100%, 50%), -58px 157px hsl(847.8, 100%, 50%), -58px 158px hsl(853.2, 100%, 50%), -57px 159px hsl(858.6, 100%, 50%), -57px 160px hsl(864, 100%, 50%), -56px 161px hsl(869.4, 100%, 50%), -55px 162px hsl(874.8, 100%, 50%), -55px 163px hsl(880.2, 100%, 50%), -54px 164px hsl(885.6, 100%, 50%), -53px 165px hsl(891, 100%, 50%), -52px 166px hsl(896.4, 100%, 50%), -51px 167px hsl(901.8, 100%, 50%), -50px 168px hsl(907.2, 100%, 50%), -49px 169px hsl(912.6, 100%, 50%), -48px 170px hsl(918, 100%, 50%), -47px 171px hsl(923.4, 100%, 50%), -46px 172px hsl(928.8, 100%, 50%), -45px 173px hsl(934.2, 100%, 50%), -43px 174px hsl(939.6, 100%, 50%), -42px 175px hsl(945, 100%, 50%), -41px 176px hsl(950.4, 100%, 50%), -39px 177px hsl(955.8, 100%, 50%), -38px 178px hsl(961.2, 100%, 50%), -36px 179px hsl(966.6, 100%, 50%), -35px 180px hsl(972, 100%, 50%), -33px 181px hsl(977.4, 100%, 50%), -32px 182px hsl(982.8, 100%, 50%), -30px 183px hsl(988.2, 100%, 50%), -28px 184px hsl(993.6, 100%, 50%), -27px 185px hsl(999, 100%, 50%), -25px 186px hsl(1004.4, 100%, 50%), -23px 187px hsl(1009.8, 100%, 50%), -22px 188px hsl(1015.2, 100%, 50%), -20px 189px hsl(1020.6, 100%, 50%), -18px 190px hsl(1026, 100%, 50%), -16px 191px hsl(1031.4, 100%, 50%), -14px 192px hsl(1036.8, 100%, 50%), -13px 193px hsl(1042.2, 100%, 50%), -11px 194px hsl(1047.6, 100%, 50%), -9px 195px hsl(1053, 100%, 50%), -7px 196px hsl(1058.4, 100%, 50%), -5px 197px hsl(1063.8, 100%, 50%), -3px 198px hsl(1069.2, 100%, 50%), -1px 199px hsl(1074.6, 100%, 50%), -1px 200px hsl(1080, 100%, 50%), 1px 201px hsl(1085.4, 100%, 50%), 3px 202px hsl(1090.8, 100%, 50%), 5px 203px hsl(1096.2, 100%, 50%), 7px 204px hsl(1101.6, 100%, 50%), 9px 205px hsl(1107, 100%, 50%), 11px 206px hsl(1112.4, 100%, 50%), 13px 207px hsl(1117.8, 100%, 50%), 14px 208px hsl(1123.2, 100%, 50%), 16px 209px hsl(1128.6, 100%, 50%), 18px 210px hsl(1134, 100%, 50%), 20px 211px hsl(1139.4, 100%, 50%), 22px 212px hsl(1144.8, 100%, 50%), 23px 213px hsl(1150.2, 100%, 50%), 25px 214px hsl(1155.6, 100%, 50%), 27px 215px hsl(1161, 100%, 50%), 28px 216px hsl(1166.4, 100%, 50%), 30px 217px hsl(1171.8, 100%, 50%), 32px 218px hsl(1177.2, 100%, 50%), 33px 219px hsl(1182.6, 100%, 50%), 35px 220px hsl(1188, 100%, 50%), 36px 221px hsl(1193.4, 100%, 50%), 38px 222px hsl(1198.8, 100%, 50%), 39px 223px hsl(1204.2, 100%, 50%), 41px 224px hsl(1209.6, 100%, 50%), 42px 225px hsl(1215, 100%, 50%), 43px 226px hsl(1220.4, 100%, 50%), 45px 227px hsl(1225.8, 100%, 50%), 46px 228px hsl(1231.2, 100%, 50%), 47px 229px hsl(1236.6, 100%, 50%), 48px 230px hsl(1242, 100%, 50%), 49px 231px hsl(1247.4, 100%, 50%), 50px 232px hsl(1252.8, 100%, 50%), 51px 233px hsl(1258.2, 100%, 50%), 52px 234px hsl(1263.6, 100%, 50%), 53px 235px hsl(1269, 100%, 50%), 54px 236px hsl(1274.4, 100%, 50%), 55px 237px hsl(1279.8, 100%, 50%), 55px 238px hsl(1285.2, 100%, 50%), 56px 239px hsl(1290.6, 100%, 50%), 57px 240px hsl(1296, 100%, 50%), 57px 241px hsl(1301.4, 100%, 50%), 58px 242px hsl(1306.8, 100%, 50%), 58px 243px hsl(1312.2, 100%, 50%), 58px 244px hsl(1317.6, 100%, 50%), 59px 245px hsl(1323, 100%, 50%), 59px 246px hsl(1328.4, 100%, 50%), 59px 247px hsl(1333.8, 100%, 50%), 59px 248px hsl(1339.2, 100%, 50%), 59px 249px hsl(1344.6, 100%, 50%), 60px 250px hsl(1350, 100%, 50%), 59px 251px hsl(1355.4, 100%, 50%), 59px 252px hsl(1360.8, 100%, 50%), 59px 253px hsl(1366.2, 100%, 50%), 59px 254px hsl(1371.6, 100%, 50%), 59px 255px hsl(1377, 100%, 50%), 58px 256px hsl(1382.4, 100%, 50%), 58px 257px hsl(1387.8, 100%, 50%), 58px 258px hsl(1393.2, 100%, 50%), 57px 259px hsl(1398.6, 100%, 50%), 57px 260px hsl(1404, 100%, 50%), 56px 261px hsl(1409.4, 100%, 50%), 55px 262px hsl(1414.8, 100%, 50%), 55px 263px hsl(1420.2, 100%, 50%), 54px 264px hsl(1425.6, 100%, 50%), 53px 265px hsl(1431, 100%, 50%), 52px 266px hsl(1436.4, 100%, 50%), 51px 267px hsl(1441.8, 100%, 50%), 50px 268px hsl(1447.2, 100%, 50%), 49px 269px hsl(1452.6, 100%, 50%), 48px 270px hsl(1458, 100%, 50%), 47px 271px hsl(1463.4, 100%, 50%), 46px 272px hsl(1468.8, 100%, 50%), 45px 273px hsl(1474.2, 100%, 50%), 43px 274px hsl(1479.6, 100%, 50%), 42px 275px hsl(1485, 100%, 50%), 41px 276px hsl(1490.4, 100%, 50%), 39px 277px hsl(1495.8, 100%, 50%), 38px 278px hsl(1501.2, 100%, 50%), 36px 279px hsl(1506.6, 100%, 50%), 35px 280px hsl(1512, 100%, 50%), 33px 281px hsl(1517.4, 100%, 50%), 32px 282px hsl(1522.8, 100%, 50%), 30px 283px hsl(1528.2, 100%, 50%), 28px 284px hsl(1533.6, 100%, 50%), 27px 285px hsl(1539, 100%, 50%), 25px 286px hsl(1544.4, 100%, 50%), 23px 287px hsl(1549.8, 100%, 50%), 22px 288px hsl(1555.2, 100%, 50%), 20px 289px hsl(1560.6, 100%, 50%), 18px 290px hsl(1566, 100%, 50%), 16px 291px hsl(1571.4, 100%, 50%), 14px 292px hsl(1576.8, 100%, 50%), 13px 293px hsl(1582.2, 100%, 50%), 11px 294px hsl(1587.6, 100%, 50%), 9px 295px hsl(1593, 100%, 50%), 7px 296px hsl(1598.4, 100%, 50%), 5px 297px hsl(1603.8, 100%, 50%), 3px 298px hsl(1609.2, 100%, 50%), 1px 299px hsl(1614.6, 100%, 50%), 2px 300px hsl(1620, 100%, 50%), -1px 301px hsl(1625.4, 100%, 50%), -3px 302px hsl(1630.8, 100%, 50%), -5px 303px hsl(1636.2, 100%, 50%), -7px 304px hsl(1641.6, 100%, 50%), -9px 305px hsl(1647, 100%, 50%), -11px 306px hsl(1652.4, 100%, 50%), -13px 307px hsl(1657.8, 100%, 50%), -14px 308px hsl(1663.2, 100%, 50%), -16px 309px hsl(1668.6, 100%, 50%), -18px 310px hsl(1674, 100%, 50%), -20px 311px hsl(1679.4, 100%, 50%), -22px 312px hsl(1684.8, 100%, 50%), -23px 313px hsl(1690.2, 100%, 50%), -25px 314px hsl(1695.6, 100%, 50%), -27px 315px hsl(1701, 100%, 50%), -28px 316px hsl(1706.4, 100%, 50%), -30px 317px hsl(1711.8, 100%, 50%), -32px 318px hsl(1717.2, 100%, 50%), -33px 319px hsl(1722.6, 100%, 50%), -35px 320px hsl(1728, 100%, 50%), -36px 321px hsl(1733.4, 100%, 50%), -38px 322px hsl(1738.8, 100%, 50%), -39px 323px hsl(1744.2, 100%, 50%), -41px 324px hsl(1749.6, 100%, 50%), -42px 325px hsl(1755, 100%, 50%), -43px 326px hsl(1760.4, 100%, 50%), -45px 327px hsl(1765.8, 100%, 50%), -46px 328px hsl(1771.2, 100%, 50%), -47px 329px hsl(1776.6, 100%, 50%), -48px 330px hsl(1782, 100%, 50%), -49px 331px hsl(1787.4, 100%, 50%), -50px 332px hsl(1792.8, 100%, 50%), -51px 333px hsl(1798.2, 100%, 50%), -52px 334px hsl(1803.6, 100%, 50%), -53px 335px hsl(1809, 100%, 50%), -54px 336px hsl(1814.4, 100%, 50%), -55px 337px hsl(1819.8, 100%, 50%), -55px 338px hsl(1825.2, 100%, 50%), -56px 339px hsl(1830.6, 100%, 50%), -57px 340px hsl(1836, 100%, 50%), -57px 341px hsl(1841.4, 100%, 50%), -58px 342px hsl(1846.8, 100%, 50%), -58px 343px hsl(1852.2, 100%, 50%), -58px 344px hsl(1857.6, 100%, 50%), -59px 345px hsl(1863, 100%, 50%), -59px 346px hsl(1868.4, 100%, 50%), -59px 347px hsl(1873.8, 100%, 50%), -59px 348px hsl(1879.2, 100%, 50%), -59px 349px hsl(1884.6, 100%, 50%), -60px 350px hsl(1890, 100%, 50%), -59px 351px hsl(1895.4, 100%, 50%), -59px 352px hsl(1900.8, 100%, 50%), -59px 353px hsl(1906.2, 100%, 50%), -59px 354px hsl(1911.6, 100%, 50%), -59px 355px hsl(1917, 100%, 50%), -58px 356px hsl(1922.4, 100%, 50%), -58px 357px hsl(1927.8, 100%, 50%), -58px 358px hsl(1933.2, 100%, 50%), -57px 359px hsl(1938.6, 100%, 50%), -57px 360px hsl(1944, 100%, 50%), -56px 361px hsl(1949.4, 100%, 50%), -55px 362px hsl(1954.8, 100%, 50%), -55px 363px hsl(1960.2, 100%, 50%), -54px 364px hsl(1965.6, 100%, 50%), -53px 365px hsl(1971, 100%, 50%), -52px 366px hsl(1976.4, 100%, 50%), -51px 367px hsl(1981.8, 100%, 50%), -50px 368px hsl(1987.2, 100%, 50%), -49px 369px hsl(1992.6, 100%, 50%), -48px 370px hsl(1998, 100%, 50%), -47px 371px hsl(2003.4, 100%, 50%), -46px 372px hsl(2008.8, 100%, 50%), -45px 373px hsl(2014.2, 100%, 50%), -43px 374px hsl(2019.6, 100%, 50%), -42px 375px hsl(2025, 100%, 50%), -41px 376px hsl(2030.4, 100%, 50%), -39px 377px hsl(2035.8, 100%, 50%), -38px 378px hsl(2041.2, 100%, 50%), -36px 379px hsl(2046.6, 100%, 50%), -35px 380px hsl(2052, 100%, 50%), -33px 381px hsl(2057.4, 100%, 50%), -32px 382px hsl(2062.8, 100%, 50%), -30px 383px hsl(2068.2, 100%, 50%), -28px 384px hsl(2073.6, 100%, 50%), -27px 385px hsl(2079, 100%, 50%), -25px 386px hsl(2084.4, 100%, 50%), -23px 387px hsl(2089.8, 100%, 50%), -22px 388px hsl(2095.2, 100%, 50%), -20px 389px hsl(2100.6, 100%, 50%), -18px 390px hsl(2106, 100%, 50%), -16px 391px hsl(2111.4, 100%, 50%), -14px 392px hsl(2116.8, 100%, 50%), -13px 393px hsl(2122.2, 100%, 50%), -11px 394px hsl(2127.6, 100%, 50%), -9px 395px hsl(2133, 100%, 50%), -7px 396px hsl(2138.4, 100%, 50%), -5px 397px hsl(2143.8, 100%, 50%), -3px 398px hsl(2149.2, 100%, 50%), -1px 399px hsl(2154.6, 100%, 50%); font-size: 40px;";

    //start init thingamajigs
    console.log("StateFarm: startUp()", attemptedInjection);
    startUp();
    console.log("StateFarm: after startUp()", attemptedInjection);

    setTimeout(() => {
        if (!attemptedInjection) {
            console.log("Injection didn't work for whatever reason, let's try again.");
            reloadPage();
        };
    }, 30000);
})();
console.log("StateFarm: after function",attemptedInjection);
