// ==UserScript==
// @name         Spooktober Purple
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Spooky egg game
// @author       Theme by Jayvan, Fog by Helloworld, Pumpkin Art by PigBot
// @match        https://shellshock.io/
// @icon         https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/231/among-us-player-white-512.png
// @downloadURL https://update.greasyfork.org/scripts/440989/Spooktober%20Purple.user.js
// @updateURL https://update.greasyfork.org/scripts/440989/Spooktober%20Purple.meta.js
// ==/UserScript==

document.title = 'Shell Spookers';

let style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'https://shellthemes.jayvan229.repl.co/spooktoberpurple.css';
document.head.appendChild(style);

setTimeout(function(){
    //pumpkin img made by @PigBot (822885503774359582)
    document.getElementById("logo").innerHTML = "<img src='https://cdn.discordapp.com/attachments/811268272418062359/892042520270348368/unknown.png'>";
}, 3000);

var scareTimer;
var number;

function scare() {
    function doStuff() {
        document.getElementById("shellshockers_titlescreen_wrap").innerHTML = "<img src='https://cdn.discordapp.com/attachments/811268272418062359/892137995833081856/unknown.png'>";
        setTimeout(function(){
            document.getElementById("shellshockers_titlescreen_wrap").innerHTML = "<img src=''>";
        }, 50);
    }
    number = Math.floor(Math.random() * 25000);
    scareTimer = setTimeout(doStuff, number);
}
setInterval( function(){
    scare();
}, 5000);

setTimeout(function() {
    document.getElementById("canvas").style.opacity = "50%";
    let playBtn = document.getElementById('play_game').getElementsByClassName('btn_big')[0];
    playBtn.addEventListener("click", function(e) {
        console.log('Egg Opacity 100%');
        document.getElementById("canvas").style.opacity = "100%";
    });
    let homeBtn = document.getElementById('leaveGameConfirmPopup').getElementsByClassName('ss_button')[1];
    homeBtn.addEventListener("click", function(e) {
        console.log('Egg Opacity 50%');
        document.getElementById("canvas").style.opacity = "50%";
    });
    //backup keybind
    document.addEventListener('keydown', function(e) {
        if(e.code == 'KeyP') {
            document.getElementById("canvas").style.opacity = "100%";
        }
    });
}, 5000);

//Fog mod and skybox change by helloworld#3059 (495120474179895306) (lines 60-64)
let density = .2;
let color = "#3d3d3d";
let skybox = "night";
oldResJson=Response.prototype.json;Response.prototype.json=async function(){let o=await oldResJson.apply(this,arguments);return o&&o.fog&&(console.log("Found Map Data"),o.fog.density=density,o.fog.color=color,o.skybox=skybox),o};