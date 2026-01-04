// ==UserScript==
// @name         Replit Better Colors
// @license      YKM
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Making Replit Look Nicer
// @author       YouKnowMe
// @match        https://replit.com/*
// @iconURL      https://media.discordapp.net/attachments/763581379597828117/927065483373588510/kingspectre-02.png?width=176&height=176
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449787/Replit%20Better%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/449787/Replit%20Better%20Colors.meta.js
// ==/UserScript==

function setCookie(name,value="",days=365) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value}${expires}; path=/`
}
function getCookie(name) {
    const splitRe = new RegExp(`(?:; |^)${name}=`);
    const value = document.cookie.split(splitRe)[1]?.split(/; /)[0];
    return value;
}
function eraseCookie(name) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

function get(x){return document.getElementById(x);}
function getc(x){return document.getElementsByClassName(x);}

function darkTheme(){
    setCookie("Theme","dark");
    let main = get("box");
    document.body.style = "--accent-pink-stronger: #FF70CF ;--background-root: #000000; --background-default: #0e1014; --background-higher: #000000; --background-highest: #222327; --background-overlay: #000000a0; --foreground-default:#F5F9FC; --foreground-dimmer:#C2C8CC; --foreground-dimmest:#9DA2A6; --outline-dimmest: #72788c; --outline-dimmer:#5F677A; --outline-default: #ffffff;--outline-stronger: #222b44; --outline-strongest:#9195A1; --accent-primary-dimmest:#004182;--accent-primary-dimmer: #205992; --accent-primary-default: #0d1115;--accent-primary-stronger: #3b6b9b; --accent-primary-strongest:#B2D9FF; --accent-positive-dimmest:#044A10; --accent-positive-dimmer:#046113; --accent-positive-default:#009118; --accent-positive-stronger:#6CD97E; --accent-positive-strongest:#BFFFCA; --accent-negative-dimmest:#660000; --accent-negative-dimmer:#A60808; --accent-negative-default:#E52222; --accent-negative-stronger:#FF6666; --accent-negative-strongest:#FFCFCF; --accent-red-dimmest:#660000; --accent-red-dimmer:#A60808; --accent-red-default:#E52222; --accent-red-stronger:#FF6666; --accent-red-strongest:#FFCFCF; --accent-orange-dimmest:#542A00; --accent-orange-dimmer:#703800; --accent-orange-default:#AD5700; --accent-orange-stronger:#D4781C; --accent-orange-strongest:#FFBD7A; --accent-yellow-dimmest:#4D4000; --accent-yellow-dimmer:#635300; --accent-yellow-default:#967D00; --accent-yellow-stronger:#BFA730; --accent-yellow-strongest:#F2E088; --accent-lime-dimmest:#314A00; --accent-lime-dimmer:#3D5C00; --accent-lime-default:#5A8700; --accent-lime-stronger:#87B825; --accent-lime-strongest:#C4E581; --accent-green-dimmest:#044A10; --accent-green-dimmer:#046113; --accent-green-default:#009118; --accent-green-stronger:#6CD97E; --accent-green-strongest:#7AEB8D; --accent-teal-dimmest:#004452; --accent-teal-dimmer:#006073; --accent-teal-default:#0093B0; --accent-teal-stronger:#27B9D6; --accent-teal-strongest:#69D9F0; --accent-blue-dimmest:#004182; --accent-blue-dimmer:#0053A6; --accent-blue-default:#0079F2; --accent-blue-stronger:#57ABFF; --accent-blue-strongest:#B2D9FF; --accent-blurple-dimmest:#39298A; --accent-blurple-dimmer:#5239CC; --accent-blurple-default:#795EFF; --accent-blurple-stronger:#A694FF; --accent-blurple-strongest:#CEC4FF; --accent-purple-dimmest:#582987; --accent-purple-dimmer:#7633B8; --accent-purple-default:#A64DFF; --accent-purple-stronger:#C78FFF; --accent-purple-strongest:#E2C4FF; --accent-magenta-dimmest:#6B1A6B; --accent-magenta-dimmer:#8A218A; --accent-magenta-default:#C73AC7; --accent-magenta-stronger: #3a2b3a; --accent-magenta-strongest:#FFBFFF; --accent-pink-dimmest:#6E1B52; --accent-pink-dimmer:#8F226B; --accent-pink-default: #272727; --accent-pink-stronger:#FF70CF; --accent-pink-strongest:#FFBAE8; --accent-grey-dimmest: #725656; --accent-grey-dimmer:#545454; --accent-grey-default:#808080; --accent-grey-stronger:#A6A6A6; --accent-grey-strongest:#D4D4D4; --accent-brown-dimmest:#594031; --accent-brown-dimmer:#75503B; --accent-brown-default:#A3765C; --accent-brown-stronger:#D49877; --accent-brown-strongest:#FFC8A8; --black: #000000; --white: #ffffff;cursor: auto;"
}
function synthTheme(){
    setCookie("Theme","synth");
    document.body.style = "--background-root: #9238bd; --background-default: #4c187a; --background-higher: #a828a9; --background-highest: #3e2f41; --background-overlay: #8a2121; --foreground-default: #ffffff; --foreground-dimmest: #ff0099; --outline-dimmest: #72788c; --outline-dimmer:#5F677A; --outline-default: #ffffff; --outline-stronger: #222b44; --outline-strongest:#9195A1; --accent-primary-default: #360178; --accent-primary-stronger: #3b6b9b; --accent-primary-strongest:#B2D9FF; --accent-positive-dimmest: #eb4daa; --accent-negative-default:#E52222; --accent-negative-stronger:#FF6666; --accent-negative-strongest:#FFCFCF; --accent-red-dimmest:#660000; --accent-red-dimmer:#A60808; --accent-red-default:#E52222; --accent-red-stronger:#FF6666; --accent-red-strongest:#FFCFCF; --accent-orange-dimmest:#542A00; --accent-orange-dimmer:#703800; --accent-orange-default:#AD5700; --accent-orange-stronger:#D4781C; --accent-orange-strongest: #ffff00; --accent-yellow-dimmest:#4D4000; --accent-yellow-dimmer:#635300; --accent-yellow-default:#967D00; --accent-yellow-stronger:#BFA730; --accent-yellow-strongest:#F2E088; --accent-lime-dimmest:#314A00; --accent-lime-dimmer:#3D5C00; --accent-lime-default:#5A8700; --accent-lime-stronger:#87B825; --accent-lime-strongest:#C4E581; --accent-green-dimmest:#044A10; --accent-green-dimmer:#046113; --accent-green-default: #00ffffbd; --accent-green-stronger:#6CD97E; --accent-blurple-dimmest:#39298A; --accent-blurple-dimmer:#5239CC; --accent-blurple-default:#795EFF; --accent-blurple-stronger:#A694FF; --accent-blurple-strongest:#CEC4FF; --accent-purple-dimmest:#582987; --accent-purple-dimmer:#7633B8; --accent-purple-default:#A64DFF; --accent-purple-stronger:#C78FFF; --accent-purple-strongest:#E2C4FF; --accent-magenta-dimmest:#6B1A6B; --accent-magenta-dimmer:#8A218A; --accent-magenta-default:#C73AC7; --accent-magenta-stronger: #3a2b3a; --accent-magenta-strongest:#FFBFFF; --accent-pink-dimmest:#6E1B52; --accent-pink-default: #272727; --accent-pink-strongest:#FFBAE8; --accent-grey-dimmest: #725656; --accent-grey-dimmer:#545454; --accent-grey-default:#808080; --accent-grey-stronger:#A6A6A6; --accent-grey-strongest:#D4D4D4; --accent-brown-dimmest:#594031; --accent-brown-dimmer:#75503B; --accent-brown-default:#A3765C; --accent-brown-stronger:#D49877; --accent-brown-strongest:#FFC8A8; --black: #000000; --white: #ffffff;cursor: crosshair;"
}
function youtubeTheme(){
    setCookie("Theme","youtube");
    document.body.style = "--background-root: #bf1a1a; --background-default: #7a1818; --background-higher: #d26969; --background-highest: #3e2f41; --background-overlay: #8a2121; --foreground-default: #ffffff; --foreground-dimmest: #ff0000; --outline-dimmest: #ff00a5; --outline-dimmer: #889fd7; --outline-default: #ffffff; --outline-stronger: #222b44; --outline-strongest:#9195A1; --accent-primary-default: #a72424; --accent-primary-stronger: #3b6b9b; --accent-primary-strongest:#B2D9FF; --accent-positive-dimmest: #13a252; --accent-negative-default:#E52222; --accent-negative-stronger:#FF6666; --accent-negative-strongest:#FFCFCF; --accent-red-dimmest:#660000; --accent-red-dimmer:#A60808; --accent-red-default:#E52222; --accent-red-stronger:#FF6666; --accent-red-strongest:#FFCFCF; --accent-orange-dimmest:#542A00; --accent-orange-dimmer:#703800; --accent-orange-default:#AD5700; --accent-orange-stronger: #ffffff; --accent-orange-strongest: #ffff00; --accent-yellow-dimmest:#4D4000; --accent-yellow-dimmer:#635300; --accent-yellow-default:#967D00; --accent-yellow-stronger:#BFA730; --accent-yellow-strongest:#F2E088; --accent-lime-dimmest:#314A00; --accent-lime-dimmer:#3D5C00; --accent-lime-default:#5A8700; --accent-lime-stronger:#87B825; --accent-lime-strongest:#C4E581; --accent-green-dimmest:#044A10; --accent-green-dimmer:#046113; --accent-green-default: #00ff4c; --accent-green-stronger:#6CD97E; --accent-blurple-dimmest:#39298A; --accent-blurple-dimmer:#5239CC; --accent-blurple-default:#795EFF; --accent-blurple-stronger:#A694FF; --accent-blurple-strongest:#CEC4FF; --accent-purple-dimmest:#582987; --accent-purple-dimmer:#7633B8; --accent-purple-default:#A64DFF; --accent-purple-stronger:#C78FFF; --accent-purple-strongest:#E2C4FF; --accent-magenta-dimmest:#6B1A6B; --accent-magenta-dimmer:#8A218A; --accent-magenta-default:#C73AC7; --accent-magenta-stronger: #3a2b3a; --accent-magenta-strongest:#FFBFFF; --accent-pink-dimmest:#6E1B52; --accent-pink-default: #272727; --accent-pink-strongest:#FFBAE8; --accent-grey-dimmest: #725656; --accent-grey-dimmer:#545454; --accent-grey-default:#808080; --accent-grey-stronger:#A6A6A6; --accent-grey-strongest:#D4D4D4; --accent-brown-dimmest:#594031; --accent-brown-dimmer:#75503B; --accent-brown-default:#A3765C; --accent-brown-stronger:#D49877; --accent-brown-strongest:#FFC8A8; --black: #000000; --white: #ffffff;cursor: default;"
}
function vibrantTerminal(){
    setCookie("Theme","terminal");
    document.body.style = "--background-root: #000000; --background-default: #000000; --background-higher: #000000; --background-highest: #222327; --background-overlay: #000000a0; --foreground-default: #04ff22; --foreground-dimmer:#C2C8CC; --foreground-dimmest:#9DA2A6; --outline-dimmest: #72788c; --outline-dimmer:#5F677A; --outline-default: #ffffff; --outline-stronger: #222b44; --outline-strongest:#9195A1; --accent-primary-dimmest:#004182; --accent-primary-dimmer: #205992; --accent-primary-default: #0d1115; --accent-primary-stronger: #3b6b9b; --accent-primary-strongest:#B2D9FF; --accent-positive-dimmest:#044A10; --accent-positive-dimmer:#046113; --accent-positive-default:#009118; --accent-positive-stronger:#6CD97E; --accent-positive-strongest:#BFFFCA; --accent-negative-dimmest:#660000; --accent-negative-dimmer:#A60808; --accent-negative-default:#E52222; --accent-negative-stronger:#FF6666; --accent-negative-strongest:#FFCFCF; --accent-red-dimmest:#660000; --accent-red-dimmer:#A60808; --accent-red-default:#E52222; --accent-red-stronger:#FF6666; --accent-red-strongest:#FFCFCF; --accent-orange-dimmest:#542A00; --accent-orange-dimmer:#703800; --accent-orange-default:#AD5700; --accent-orange-stronger:#D4781C; --accent-orange-strongest: #ffeb00; --accent-yellow-dimmest:#4D4000; --accent-yellow-dimmer:#635300; --accent-yellow-default:#967D00; --accent-yellow-stronger:#BFA730; --accent-yellow-strongest:#F2E088; --accent-lime-dimmest:#314A00; --accent-lime-dimmer:#3D5C00; --accent-lime-default:#5A8700; --accent-lime-stronger:#87B825; --accent-lime-strongest:#C4E581; --accent-green-dimmest:#044A10; --accent-green-dimmer:#046113; --accent-green-default: #707070; --accent-green-stronger:#6CD97E; --accent-green-strongest:#7AEB8D; --accent-teal-dimmest:#004452; --accent-teal-dimmer:#006073; --accent-teal-default:#0093B0; --accent-teal-stronger:#27B9D6; --accent-teal-strongest:#69D9F0; --accent-blue-dimmest:#004182; --accent-blue-dimmer:#0053A6; --accent-blue-default:#0079F2; --accent-blue-stronger: #00f1ff; --accent-blue-strongest: #b300e3; --accent-blurple-dimmest:#39298A; --accent-blurple-dimmer:#5239CC; --accent-blurple-default:#795EFF; --accent-blurple-stronger:#A694FF; --accent-blurple-strongest:#CEC4FF; --accent-purple-dimmest:#582987; --accent-purple-dimmer:#7633B8; --accent-purple-default:#A64DFF; --accent-purple-stronger:#C78FFF; --accent-purple-strongest:#E2C4FF; --accent-magenta-dimmest:#6B1A6B; --accent-magenta-dimmer:#8A218A; --accent-magenta-default:#C73AC7; --accent-magenta-stronger: #3a2b3a; --accent-magenta-strongest:#FFBFFF; --accent-pink-dimmest:#6E1B52; --accent-pink-dimmer:#8F226B; --accent-pink-default: #272727; --accent-pink-stronger: #ff00a9; --accent-pink-strongest:#FFBAE8; --accent-grey-dimmest: #725656; --accent-grey-dimmer:#545454; --accent-grey-default:#808080; --accent-grey-stronger:#A6A6A6; --accent-grey-strongest:#D4D4D4; --accent-brown-dimmest:#594031; --accent-brown-dimmer:#75503B; --accent-brown-default:#A3765C; --accent-brown-stronger:#D49877; --accent-brown-strongest:#FFC8A8; --black: #000000; --white: #ffffff;cursor: auto;"
}
function resetTheme(){
    eraseCookie("Theme");
    document.body.style = "--background-root:#0E1525; --background-default:#1C2333; --background-higher:#2B3245; --background-highest:#3C445C; --background-overlay:#0e1525A0; --foreground-default:#F5F9FC; --foreground-dimmer:#C2C8CC; --foreground-dimmest:#9DA2A6; --outline-dimmest:#4E5569; --outline-dimmer:#5F677A; --outline-default:#70788C; --outline-stronger:#828899; --outline-strongest:#9195A1; --accent-primary-dimmest:#004182; --accent-primary-dimmer:#0053A6; --accent-primary-default:#0079F2; --accent-primary-stronger:#57ABFF; --accent-primary-strongest:#B2D9FF; --accent-positive-dimmest:#044A10; --accent-positive-dimmer:#046113; --accent-positive-default:#009118; --accent-positive-stronger:#6CD97E; --accent-positive-strongest:#BFFFCA; --accent-negative-dimmest:#660000; --accent-negative-dimmer:#A60808; --accent-negative-default:#E52222; --accent-negative-stronger:#FF6666; --accent-negative-strongest:#FFCFCF; --accent-red-dimmest:#660000; --accent-red-dimmer:#A60808; --accent-red-default:#E52222; --accent-red-stronger:#FF6666; --accent-red-strongest:#FFCFCF; --accent-orange-dimmest:#542A00; --accent-orange-dimmer:#703800; --accent-orange-default:#AD5700; --accent-orange-stronger:#D4781C; --accent-orange-strongest:#FFBD7A; --accent-yellow-dimmest:#4D4000; --accent-yellow-dimmer:#635300; --accent-yellow-default:#967D00; --accent-yellow-stronger:#BFA730; --accent-yellow-strongest:#F2E088; --accent-lime-dimmest:#314A00; --accent-lime-dimmer:#3D5C00; --accent-lime-default:#5A8700; --accent-lime-stronger:#87B825; --accent-lime-strongest:#C4E581; --accent-green-dimmest:#044A10; --accent-green-dimmer:#046113; --accent-green-default:#009118; --accent-green-stronger:#6CD97E; --accent-green-strongest:#7AEB8D; --accent-teal-dimmest:#004452; --accent-teal-dimmer:#006073; --accent-teal-default:#0093B0; --accent-teal-stronger:#27B9D6; --accent-teal-strongest:#69D9F0; --accent-blue-dimmest:#004182; --accent-blue-dimmer:#0053A6; --accent-blue-default:#0079F2; --accent-blue-stronger:#57ABFF; --accent-blue-strongest:#B2D9FF; --accent-blurple-dimmest:#39298A; --accent-blurple-dimmer:#5239CC; --accent-blurple-default:#795EFF; --accent-blurple-stronger:#A694FF; --accent-blurple-strongest:#CEC4FF; --accent-purple-dimmest:#582987; --accent-purple-dimmer:#7633B8; --accent-purple-default:#A64DFF; --accent-purple-stronger:#C78FFF; --accent-purple-strongest:#E2C4FF; --accent-magenta-dimmest:#6B1A6B; --accent-magenta-dimmer:#8A218A; --accent-magenta-default:#C73AC7; --accent-magenta-stronger:#F562F5; --accent-magenta-strongest:#FFBFFF; --accent-pink-dimmest:#6E1B52; --accent-pink-dimmer:#8F226B; --accent-pink-default:#D4359F; --accent-pink-stronger:#FF70CF; --accent-pink-strongest:#FFBAE8; --accent-grey-dimmest:#404040; --accent-grey-dimmer:#545454; --accent-grey-default:#808080; --accent-grey-stronger:#A6A6A6; --accent-grey-strongest:#D4D4D4; --accent-brown-dimmest:#594031; --accent-brown-dimmer:#75503B; --accent-brown-default:#A3765C; --accent-brown-stronger:#D49877; --accent-brown-strongest:#FFC8A8; --black:#0E1525; --white:#FCFCFC;"
}
function forceUpdate(){
    console.log("Forced Update");
}
function loadTheme(){
        const theme = getCookie("Theme");
        if(theme==="dark") {
            darkTheme();
        }
        else if(theme==="synth"){
            synthTheme();
        }
        else if(theme==="youtube"){
            youtubeTheme();
        }
        else if(theme==="terminal"){
            vibrantTerminal();
        }
    }
window.addEventListener('load', initTheme);

function initTheme() {
    const UIBGc = getCookie("UIBG");
    const UIBc = getCookie("UIB");
    const Close = getCookie("State");
    const overlayHTML = `
<link href="https://fonts.googleapis.com/css?family=Orbitron:900" rel="stylesheet"/>
<div id="box">
    <div class="boxou" id="box2">
        <p style="color:white;"> Better Replit Colors! \n</p>
        <br>
        <button class="ou" id="Darkmode">Dark ++</button>
        <br>
        <button class="ou" id="SynthWavePurple">Synth Wave Purple</button>
        <br>
        <button class="ou" id="YoutubeRed">Youtube Red</button>
        <br>
        <button class="ou" id="VibrantTerminal">Vibrant Terminal</button>
        <br>
        <section><label>UI Background Color   </label>                          <input id="UIBGcolor"  type="color"    value=${UIBGc}></section>
        <br>
        <section><label>UI Button Color   </label>                          <input id="UIBcolor"  type="color"    value=${UIBc}></section>
        <br>
        <button class="ou" id="Reset">Default</button><button class="ou" id="update">UPDATE<button>
    </div>
    <button class="ou" id="accordian">Show</button>
</div>
<style id="stl">
#box {
    background-color: rgba(250, 100, 250,1);
    z-index: 10;
    position: fixed;
    bottom: 1vh;
    opacity: .9;
    left: 5px;}
#box2 {
    padding: 15px;
    margin-bottom: 5px}
.ou, .boxou {
    letter-spacing: 3px;
    font-weight: bold;
    font-size: 15px;
    font-family: Orbitron;
    color:white;}

button {background-color: rgba(250,200,250,.5);}
p { text-align: center;border-bottom:1px solid white;}
#accordian {
    width: 100%;
    border:1;}
label { font-weight: bold;}
input {
    margin-top: auto;
    margin-bottom: auto;
    transform: scale(1.3);}
input:hover { cursor: pointer;}
input:focus { box-shadow: 0 0 10px #9ecaed;}
input[type=checkbox] { transform: scale(2.2);outline=none;}
input[type=radio] { border-top: auto;}
input[type=color] { width: 50px;}
</style>
`
    // Setting up the html div
    const overlay= document.createElement("div");
    overlay.innerHTML= overlayHTML;
    document.body.appendChild(overlay);

    const acc = get("accordian"),
        dark = get("Darkmode"),
        synth = get("SynthWavePurple"),
        res = get("Reset"),
        youtube= get("YoutubeRed"),
        VT= get("VibrantTerminal"),
        UIBG= get("UIBGcolor"),
        UIB= get("UIBcolor"),
        home = document.body,
        upd = get("update");
    if(Close === "close"){
        get("box2").style.display = "none";
    }
    else{
        get("box2").style.display = "grid";
        acc.innerHTML = "Hide";
    }
    for (const button of [...getc("ou")]) {
            button.style = `background-color: ${UIBc};`
        }
    document.getElementById("box").style = `background-color: ${UIBGc};`

    UIBG.onchange = function(){
        get("box").style = `background-color: ${this.value};`
        setCookie("UIBG",this.value);
    }
    UIB.onchange = function(){
        for (const button of [...getc("ou")]) {
            button.style = `background-color: ${this.value};`
        }
        setCookie("UIB",this.value);
    }
    acc.onclick = function() {
        let panel = get("box2");
        let main = get("box");
        if (panel.style.display == "grid"){
            setCookie("State","close");
            panel.style.display = "none";
            acc.innerHTML = "Show";
        }
        else {
            panel.style.display = "grid";
            eraseCookie("State");
            acc.innerHTML = "Hide";
        }
    }


    upd.onclick = forceUpdate;
    dark.onclick = darkTheme;
    res.onclick = resetTheme;
    synth.onclick = synthTheme;
    youtube.onclick = youtubeTheme;
    VT.onclick = vibrantTerminal;
    //getting theme and cookie managment
    loadTheme();
};


// Select the node that will be observed for mutations
//const targetNode = document.getElementById('__next');
const targetNode = document.body;
// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

let oldHref = window.location.href;
// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
    if (oldHref !== window.location.href) {
        oldHref = window.location.href;
        loadTheme();
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Later, you can stop observing
//observer.disconnect();


/*

*/