// ==UserScript==
// @name         funny title screen for zombs.io
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  yes, i copied arcaea's main menu ui
// @author       r word
// @match        https://zombs.io/
// @match        localhost:1000
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446299/funny%20title%20screen%20for%20zombsio.user.js
// @updateURL https://update.greasyfork.org/scripts/446299/funny%20title%20screen%20for%20zombsio.meta.js
// ==/UserScript==

window.usePotential = true;

document.querySelectorAll('.ad-unit, .hud-intro-left, .hud-intro-guide, .hud-intro-stone, .hud-intro-tree, .hud-intro-youtuber, .hud-intro-more-games, .hud-intro-social, .hud-respawn-corner-bottom-left, .hud-respawn-twitter-btn, .hud-respawn-facebook-btn').forEach(el => el.remove());

let fontAwesome = document.createElement("script");
fontAwesome.type = "text/javascript";
fontAwesome.src = "https://kit.fontawesome.com/1c239b2e80.js";
document.head.appendChild(fontAwesome);

document.getElementById('hud-intro').insertAdjacentHTML('afterbegin', `
    <div id="top-bar">
        <a id="user-avatar"></a>
        <a id="potential">--<small></small></a>
    </div>
    <a id="parallel-right"></a>
    <a id="best-anime-girl-ever"></a>
`);

document.querySelector("#hud-intro > div.hud-intro-footer > span").innerText = `© 2024 ZOMBS.io - © lowiro 2024`;
// document.getElementsByClassName('hud-intro-corner-bottom-left')[0].insertAdjacentHTML('afterbegin', `<div id="social-container"></div>`);
document.getElementsByClassName('hud-intro-corner-bottom-left')[0].insertAdjacentHTML('afterbegin', `<a id="unawaken"></a>`);
document.getElementsByClassName('hud-intro-corner-top-left')[0].insertAdjacentElement('afterbegin', document.querySelector("#hud-intro > div.hud-intro-wrapper > h2"));
document.getElementsByClassName('hud-intro-corner-top-left')[0].insertAdjacentElement('afterbegin', document.querySelector("#hud-intro > div.hud-intro-wrapper > h1"));
document.getElementById('top-bar').insertAdjacentElement(
    "afterbegin",
    document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div.hud-intro-form > input")
);
document.getElementsByClassName("hud-intro-play")[0].innerText = "";
document.getElementsByClassName("hud-intro-form")[0].insertAdjacentHTML("beforeend", `<span id="playspan">Play</span>`);

/* document.getElementById('top-bar').insertAdjacentHTML("beforeend", `
    <button id="settings-gear">
        <i class="fa fa-cog" style="
        color: rgba(255, 255, 255, 0.5);
        font-size: 2em;
        line-height: .75em;
        vertical-align: -0.0667em;
        transform: rotate(45deg);"></i>
    </button>
`); */

const potentialEnum = {
    '0.00': 'https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Rating%200%20119.webp?v=1723037683816',
    '3.50': 'https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Rating%201.webp?v=1723037684510',
    '7.00': 'https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Rating%202.webp?v=1723037685796',
    '11.00': 'https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Rating%204.webp?v=1723037686575',
    '12.00': 'https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Rating%205.webp?v=1723037687300',
    '12.50': 'https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Rating%206.webp?v=1723037688035',
    '13.00': "https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Rating%207.webp?v=1723037688731",
};

let usingPtt = window.usePotential ? potentialEnum[0] : `https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Rating%20off.webp?v=1723037689496`;
localStorage.potential || (localStorage.potential = 0);

function findPotential(potential) {
    if (potential < 0) return ['0.00', '0.00'];
    const enumArray = Object.keys(potentialEnum).map(e => parseFloat(e));
    return [`${Math.max(...enumArray.filter(num => num <= potential)).toFixed(2)}`, potential.toFixed(2) + ''];
}

(() => {
    const targetPtt = findPotential(parseFloat(JSON.parse(localStorage.potential))),
          pttElem = document.getElementById('potential'),
          childrenText = targetPtt[1].split('.');
    usingPtt = potentialEnum[targetPtt[0]];
    pttElem.style.backgroundImage = usingPtt;
    pttElem.innerHTML = `${childrenText[0]}<small>.${childrenText[1]}</small>`;
})();

const _css = `
@keyframes parallax {
  0%   { background-position: bottom; }
  25%  { background-position: top; }
  50%   { background-position: right; }
  75%  { background-position: left; }
  100%   { background-position: bottom; }
}

@keyframes bounce {
  50%   { background-position-y: 0px; }
  100%  { background-position-y: -20px; }
}

/* @media only screen and (min-width: 1080px) {
    #best-anime-girl-ever {
        left: 55vw !important;
    }
} */

@media only screen and (max-width: 750px) {
    #hud-intro > div.hud-intro-corner-top-left > h2 {
        display: none !important;
    }
}

.hud-intro .hud-intro-corner-top-right {
    top: 40px;
    z-index: 21 !important;
}

.hud-intro .hud-intro-leaderboard {
    color: rgba(0, 0, 0, 0.4);
}

.hud-intro .hud-intro-leaderboard select {
    background: rgba(0, 0, 0, 0.15);
}

.hud-intro .hud-intro-leaderboard .hud-leaderboard-party strong {
    color: black;
}

.hud-intro .hud-intro-corner-top-left {
    top: 5px;
    left: 15px;
    z-index: 21 !important;
}

#hud-intro > div.hud-intro-corner-top-left > h1 {
    font-size: 27px;
}

#hud-intro > div.hud-intro-corner-top-left > h1 > small {
    color: rgba(0, 0, 0, 0.6);
}

#hud-intro > div.hud-intro-corner-top-left > h2 {
    position: relative;
    display: inline-block;
    margin: 0 0 0 calc(20vw - 100px);
    padding: 0;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
    top: -4px;
}

.hud-intro .hud-intro-footer {
    left: unset;
    right: 30px;
    text-shadow: 0 1px 3px rgb(0 0 0 / 50%);
    z-index: 21 !important;
}

#hud-intro > div.hud-intro-footer > span {
    color: white;
}

#hud-intro > div.hud-intro-footer > a {
    color: white;
}

#hud-intro > div.hud-intro-wrapper > div > div.hud-intro-guide {
    visibility: hidden;
}

.hud-intro::before {
    background-image: url('https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/World%20Map.webp?v=1716598026118');
    background-size: 300%;
    background-position: bottom;
    filter: blur(2px);

    animation-name: parallax;
    animation-duration: 727s;
    animation-iteration-count: infinite;
}

.hud-intro::after {
    background: none;
}

.hud-intro-name {
    display: block;
    width: 25vw;
    height: 40px;
    line-height: 34px;
    padding: 8px 14px;
    margin: 0 calc(50vw + 50px);
    border: 0;
    font-size: 16px;
    border-radius: 4px;
    box-shadow: unset;
    background: none;
    font-family: Open Sans, sans-serif;
}

#hud-intro > div.hud-intro-wrapper > div > div.hud-intro-form {
    background: none;
}

.hud-intro .hud-intro-form .hud-intro-server {
    display: inline-block;
    width: 100%;
    height: 50px;
    line-height: 34px;
    padding: 8px 14px;
    background: #eee;
    border: 2px solid #eee;
    font-size: 14px;
    box-shadow: 0 2px 10px rgb(0 0 0 / 20%);
    border-radius: 4px;
    transition: all 0.15s ease-in-out;
    margin: 0 0 0 -100px;
    position: relative;
    z-index: 20;
}

.hud-intro .hud-intro-form .hud-intro-play {
    width: 150px;
    height: 150px;
    transform: rotate(45deg);
    border: 5px solid white;
    margin: -100px 0 0 200px;
    z-index: 21 !important;
    position: relative;
}
.hud-intro .hud-intro-form .hud-intro-play::before {
    position: absolute;
    content: " ";
    width: 150%;
    height: 150%;
    top: -35px;
    left: -35px;
    transform: rotate(-45deg);
    background-image: url('https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/World%20icon.webp?v=1716598023035');
    background-size: contain;
    background-position-y: center;
    background-position-x: center;
    transition: all 0.15s ease-in-out;
}
.hud-intro .hud-intro-form .hud-intro-play:hover:before {
    filter: saturate(300%);
}

.hud-intro .hud-intro-form label {
    transform: translate(-40px, -60px);
    color: rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 21;
}

.hud-intro .hud-intro-main {
    margin: 50px 500px 50px 100px;
}

#social-container {
    height: 400px;
    width: 30px;
    background: linear-gradient(to top, #000000 0%, rgba(0, 0, 0, 0.8) 80%, transparent 100%);
    transform: translate(-20px, 100px);
}

#playspan {
    position: absolute;
    margin: -130px 0 0 115px;
    font-weight: 900;
    z-index: 22;
    font-size: xx-large;
    text-shadow: 1px 1px 3px black;
    cursor: pointer;
    font-family: 'Open Sans';
    pointer-events: none;
}

#unawaken {
    display: block;
    background-size: cover;
    background: url(https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Ayu%20large.webp?v=1723037683105);
    height: 1000px;
    width: 1000px;
    opacity: 0.1;
    cursor: default;
    transform: translate(-200px, 500px);
}

#parallel-right {
    width: 1750px;
    height: 1550px;
    transform: skew(-35deg);
    background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
                      url(https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/1000%20Switch.webp?v=1723037677839);
    display: block;
    margin: 0 calc(65vw - 82px) -1550px;
    border-left: 10px solid rgba(0, 0, 0, 0.1);
    background-size: cover;
    z-index: 19 !important;
    position: relative;
    cursor: default;
}

#best-anime-girl-ever {
    display: block;
    background-image: url(https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Ayu%20awakened.webp?v=1723037680878);
    background-position-y: -20px;
    background-size: cover;
    right: -20vh;
    height: 80vh;
    width: 80vh;
    z-index: 20 !important;
    position: fixed;
    background-repeat: no-repeat;
    top: 12.5vh;
    filter: drop-shadow(5px 5px 0px rgba(0, 0, 0, 0.3));
    cursor: default;

    animation-name: bounce;
    animation-duration: 10s;
    animation-iteration-count: infinite;
}

#top-bar {
    display: block;
    width: 120%;
    height: 40px;
    box-shadow: 5px 5px 10px rgb(0 0 0 / 30%);
    position: absolute;
    z-index: 21;
    transform: translate(-20px, 0px);
    background-image: linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),
                      url(https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/light2.webp?v=1714878822666);
}

#user-avatar {
    display: block;
    background-image: url(https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Ayu%20awakened%20icon.webp?v=1723037678569);
    position: absolute;
    top: -20px;
    height: 100px;
    background-repeat: no-repeat;
    width: 100px;
    left: calc(50vw - 50px);
    background-size: cover;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5));
}

#potential {
    display: block;
    background-image: url(${usingPtt});
    background-size: cover;
    position: absolute;
    height: 60px;
    width: 60px;
    left: 50vw;
    top: 35px;
    padding: 16px 0;
    font-size: 20px;
    color: white;
    font-weight: 600;
    text-shadow: 1px 1px 0px black;
}
#potential small {
    font-size: 15px;
}
#settings-gear {
    width: 60px;
    height: 60px;
    transform: rotate(45deg);
    top: -10px;
    right: 25vw;
    position: fixed;
    background: #64496B;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 0 3px rgb(0 0 0 / 40%);
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(_css));
document.head.appendChild(styles);
styles.type = "text/css";

document.getElementsByClassName("hud-intro-play")[0].addEventListener("click", () => {
    document.getElementById('playspan').style.display = "none";
})

function rng(min, max) {
    return Math.random() * (max - min) + min;
}

game.network.addEnterWorldHandler((e) => { localStorage.potential = JSON.stringify((parseFloat(JSON.parse(localStorage.potential)) + rng(-0.05, 0.10)).toFixed(2)); });
