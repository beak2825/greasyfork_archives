// ==UserScript==
// @name         Auto Stats Upgrade Script & AFK Diep.io - UPDATED!
// @namespace    http://tampermonkey.net/
// @version      v1.7.3
// @description  • Added Auto Repel • Added SANDBOX Auto Level Up • Added SANDBOX Auto Respawn • Added Copy Link - CUSTOM SAVED UPGRADES COMING SOON!!
// @author       Comma
// @match        https://diep.io/*
// @icon         https://i.imgur.com/E20fTA6.png
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/506772/Auto%20Stats%20Upgrade%20Script%20%20AFK%20Diepio%20-%20UPDATED%21.user.js
// @updateURL https://update.greasyfork.org/scripts/506772/Auto%20Stats%20Upgrade%20Script%20%20AFK%20Diepio%20-%20UPDATED%21.meta.js
// ==/UserScript==



// Press the TAB key to view the menu
// Press the TAB key to view the menu

/* If you're unsure of how to use this script read along:

1. Firstly make sure you're using Google Chrome or Microsoft Edge
2. Download the Tampermonkey extension: https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en
3. Enable developer mode for whatever browser you're using:

For Chrome:
- Paste this into the address bar at the top: chrome://extensions/ then hit enter
- Tick the Developer mode slider in the top right corner and do the same with the tampermonkey extension
- An update button should appear in the top left area, click on it to save the changes

For Edge:
- Paste this into the address bar at the top: edge://extensions/ then hit enter
- Tick the "Developer mode" slider and the "Allow extensions from other stores" slider and do the same with the tampermonkey extension
- An update button should appear on screen, click on it to save the changes

4. Enable the extension by clicking the Tampermonkey icon in the top right corner then go into "Dashboard" and enable the script.
   This should be enabled by default, if you don't see the Tampermonkey icon you have to pin it to the toolbar

5. Go into Diep.io and refresh, the script should work perfectly fine, use the TAB key to toggle the menu's visibility.
   If you have any issues DM me on Discord: Comma#4169

*/

document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        event.preventDefault();
    }
});

var myTimeout = setTimeout(startt, 1000);
function startt() {



        var exit_btn = document.getElementById('quick-exit-game');
        var add = document.getElementById("last-updated");
        var add_2 = document.getElementById('apes-io-promo');
        if(add_2){add_2.remove()};
        if(add){add.style.display = "none"};
        if(exit_btn){exit_btn.style.display = "none"};

(function() {
    'use strict';
    var welcome_msg = document.createElement("h1");
      var menuVisible = GM_getValue('menuVisible', true);


(function() {
    const hasRunBefore = GM_getValue('hasRunBefore', false);

    if (!hasRunBefore) {


        document.body.prepend(welcome_msg);
    
        GM_setValue('hasRunBefore', true);
    }
})();
var build_message = document.createElement("h1");

    function build_msg() {
build_message.style.display = 'block';
build_message.textContent = "Build";
build_message.style.zIndex = "9999";
build_message.style.width = "45vw";
build_message.style.height = "auto";
build_message.style.whiteSpace = "nowrap";
build_message.style.fontSize = "1em";
build_message.style.position = "absolute";
build_message.style.textAlign = "center";
build_message.style.top = "7%";
build_message.style.left = "50%";
build_message.style.transform = "translate(-50%, -50%)";
build_message.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
build_message.style.color = "white";
build_message.style.padding = "0.5em";
build_message.style.borderRadius = "5px";

document.body.appendChild(build_message)
}

    setTimeout(function() {



welcome_msg.textContent = "Script by Comma, press TAB to toggle menu, report any bugs via Discord";
welcome_msg.style.zIndex = "9999";
welcome_msg.style.width = "45vw";
welcome_msg.style.height = "auto";
welcome_msg.style.whiteSpace = "nowrap";
welcome_msg.style.fontSize = "1em";
welcome_msg.style.position = "absolute";
welcome_msg.style.textAlign = "center";
welcome_msg.style.top = "7%";
welcome_msg.style.left = "50%";
welcome_msg.style.transform = "translate(-50%, -50%)";
welcome_msg.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
welcome_msg.style.color = "white";
welcome_msg.style.padding = "0.5em";
welcome_msg.style.borderRadius = "5px";

setTimeout(function msg(){
  welcome_msg.style.display = "none";
}, 5000);
}, 1000);


var Creator = document.createElement("div");
var Help = document.createElement("p");
var SSP_Ol = document.createElement("p");
var SSP_Fi = document.createElement("p");
var Glass_Fi = document.createElement("p");
var Destroyer = document.createElement("p");
var time_alive = document.createElement("p")
var Ui_Toggle = document.createElement("p");
var Net_Predict_Toggle = document.createElement("p");
var Build_Create = document.createElement("p");
var copy_link = document.createElement("p");
var afkk = document.createElement("p");
var auto_repel = document.createElement("p");
Creator.innerHTML = "Diep Build<br>Comma#4169";
Help.textContent = "TAB Key: Toggle On/Off";
SSP_Ol.textContent = "SSP Overlord: 1";
SSP_Fi.textContent = "SSP Fighter: 2";
Glass_Fi.textContent = "Glass Fighter: 3";
Destroyer.textContent = "Destroyer: 4";
time_alive.textContent = "Time Alive"
Ui_Toggle.textContent = "UI Toggle (F) - Disabled";
Build_Create.textContent = "Build Create: B";
Net_Predict_Toggle.textContent = "NetPredict - Enabled";
afkk.textContent = "Press ` for afk"
copy_link.textContent = "Copy Link"
Creator.style.display = "none";
auto_repel.textContent = "Auto Repel - Disabled"

   // Key Down and up create for Auto Repel
const RAW_MAPPING = ["KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF", "KeyG", "KeyH", "KeyI", "KeyJ", "KeyK", "KeyL", "KeyM", "KeyN", "KeyO", "KeyP", "KeyQ", "KeyR", "KeyS", "KeyT", "KeyU", "KeyV", "KeyW", "KeyX", "KeyY", "KeyZ", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "Tab", "Enter", "NumpadEnter", "ShiftLeft", "ShiftRight", "Space", "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9", "Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "F2", "End", "Home", "Semicolon", "Comma", "NumpadComma", "Period", "Backslash"]; let _win = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;function key_down(keyString) {const index = RAW_MAPPING.indexOf(keyString);if (index === -1) return console.error(`Invalid key string: ${keyString}`);input.onKeyDown(index + 1)}; function key_up(keyString) {const index = RAW_MAPPING.indexOf(keyString);if (index === -1) return console.error(`Invalid key string: ${keyString}`); input.onKeyUp(index + 1)};


var mark = true;

    auto_repel.onclick = function(){
if(mark){
    auto_repel.textContent = "Auto Repel - Enabled"
    key_down("ShiftLeft");
} else {
    auto_repel.textContent = "Auto Repel - Disabled"
    key_up("ShiftLeft");
}
mark = !mark
}


function hi() {
if (!t) {


Creator.style.display = 'none';

} else {
Creator.style.display = 'block';

}
t = !t;

};
    Help.onclick = hi;

    var t__1 = true;
    var renUI = true;
    var renPREDICT = true;

Ui_Toggle.onclick = function() {

    if(!t__1) {
Ui_Toggle.textContent = "UI Toggle (F) - Disabled"
        t__1 = !t__1

} else {
if(Ui_Toggle.textContent = "UI Toggle (F) - Enabled") {

 t__1 = !t__1
}
    }
}
Net_Predict_Toggle.onclick = function() {

if(Net_Predict_Toggle.textContent === "NetPredict - Enabled") {

input.set_convar("net_predict_movement", false)

Net_Predict_Toggle.textContent = "NetPredict - Disabled"

} else {
if(Net_Predict_Toggle.textContent === "NetPredict - Disabled"){
input.set_convar("net_predict_movement", true)
Net_Predict_Toggle.textContent = "NetPredict - Enabled"


}
}
}


 Build_Create.onclick = function(){ truthy = !truthy;

             if(checker == true){
            menu.style.display = truthy ? "block" : "none";
            document.getElementById('toggle-container').style.display = truthy ? "block" : "none"}
                                     }


SSP_Ol.onclick = function() {
input.execute('game_stats_build 565656565656568888888444444423233');
build_msg()
build_message.textContent = "SSP Overlord build applied";
setTimeout(function() {
build_message.style.display = "none";
}, 3000);

};
SSP_Fi.onclick = function() {
input.execute('game_stats_build 565656565656568888888777777723233');

build_msg()
build_message.textContent = "SSP Fighter build applied";

setTimeout(function() {
build_message.style.display = "none";
}, 3000);
};
Glass_Fi.onclick = function() {
input.execute('game_stats_build 56565656565656888888877777774444444');

build_msg()
build_message.textContent = "Glass Fighter build applied";
setTimeout(function() {
    build_message.style.display = "none";
}, 3000);

};
Destroyer.onclick = function() {
input.execute('game_stats_build 565656565656888888844444447777777');
build_msg()
build_message.textContent = "Destroyer build applied";

setTimeout(function() {
    build_message.style.display = "none";
}, 3000);
};

    Creator.style.position = "fixed";
    Creator.style.top = "0px";
    Creator.style.left = "0px";
    Creator.style.zIndex = "9999";

    Creator.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    Creator.style.color = "white";
    Creator.style.padding = "1.5vh";
    Creator.style.borderRadius = "0.6vh";


    document.body.appendChild(Creator);
    Creator.appendChild(Help);
    Creator.appendChild(SSP_Ol);
    Creator.appendChild(SSP_Fi);
    Creator.appendChild(Glass_Fi);
    Creator.appendChild(Destroyer);
    Creator.appendChild(Ui_Toggle);
    Creator.appendChild(Build_Create);
    Creator.appendChild(Net_Predict_Toggle);
    Creator.appendChild(time_alive)
    Creator.appendChild(copy_link)
    Creator.appendChild(auto_repel)
    Creator.appendChild(afkk)
    Creator.style.width = "18vw";
    Creator.style.height = "56vh";
Creator.querySelectorAll('p').forEach(p => {

        p.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        p.style.margin = "0";
        p.style.height = "4%"
        p.style.width = "95%"
        p.style.overflow = "hidden";
        p.style.padding = "1vh";
        p.style.borderRadius = "0.6vh";
        p.style.transition = "background-color 0.3s";

let tooltip = document.getElementById('tooltip')
        p.addEventListener('mouseover', (event) => {
            event.target.style.backgroundColor = '#014D4E';
        });

        p.addEventListener('mouseout', (event) => {
            event.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        });
    });

    var t = true;
    var t_2 = true;
var t_8 = true;


document.addEventListener('keydown', function(event) {
  if (event.keyCode === 9) { // TAB key
    if (!t) {
       Creator.style.display = 'none';

         } else {
             Creator.style.display = 'block';
     }
  t = !t;
  }
    });


var checker = true;
 (function() { // SSP Overlord
  document.addEventListener('keydown', function(event) { //shift + 1
if (event.shiftKey && event.keyCode === 49) { if(checker == true) {
build_msg()
 build_message.textContent = "SSP Overlord build applied";
          input.execute('game_stats_build 565656565656568888888444444423233');
    setTimeout(function() {
    build_message.style.display = "none";
}, 3000);
}
}
        });
    })();

(function() { // SSP Fighter
        document.addEventListener('keydown', function(event) { //Shift + 2
            if (event.shiftKey && event.keyCode === 50) {
                if(checker == true){
                input.execute('game_stats_build 565656565656568888888777777723233');
                build_msg()
        build_message.textContent = "SSP Fighter build applied";
                    setTimeout(function() {
    build_message.style.display = "none";
}, 3000);
                }
            }
        });
    })();



    (function() { // Glass Fighter
        document.addEventListener('keydown', function(event) { //shift + 3
            if (event.shiftKey && event.keyCode === 51) {
                if(checker == true) {
                input.execute('game_stats_build 56565656565656888888877777774444444');
                 build_msg()
            build_message.textContent = "Glass Fighter build applied";
                    setTimeout(function() {
    build_message.style.display = "none";
}, 3000);
                }
            }
        });
    })();

    (function() { // Destroyer
        document.addEventListener('keydown', function(event) { //shift + 4
            if (event.shiftKey && event.keyCode === 52) {
                if(checker == true) {
                input.execute('game_stats_build 565656565656888888844444447777777');
                build_msg()
    build_message.textContent = "Destroyer build applied";
                    setTimeout(function() {
    build_message.style.display = "none";
}, 3000);
                }
            }
        });
    })();
var tt = true;
var spawn_inputt = document.getElementById("spawn-nickname");

spawn_inputt.addEventListener('focus', () => {
tt = false;
checker = false;
   });

spawn_inputt.addEventListener('blur', () => {
tt = true;
checker = true;
   });
    (function() { // UI Toggle


     document.addEventListener('keydown', function(event) {
        if (event.key === 'f' || event.key === 'F') {
        if(Ui_Toggle.textContent === "UI Toggle (F) - Enabled" && renUI == renUI && tt) {

                renUI = !renUI
                input.set_convar("ren_ui", renUI);


            }
        }
    });
})();
// those reading this script and judging code and shit idc dumb fucks its literal all rushed + its a public script so idc, im not cleaning it up

var clock = document.createElement("p");
clock.style.position = "absolute";
clock.style.display = "none";
clock.style.right = "1.3%";
clock.style.bottom = "23%";
clock.style.color = "white";
clock.textContent = "00:00:00";
clock.style.fontSize = "3vw"; clock.style.fontSize = "2vh";
clock.style.zIndex = "9999";
clock.style.fontFamily = "Ubuntu, sans-serif";
clock.style.fontFamily = '"Ubuntu", sans-serif';
clock.style.textShadow =
  "-0.1vw -0.2vh 0 #000, " +
    "0.1vw -0.2vh 0 #000, " +
    "-0.1vw 0.2vh 0 #000, " +
    "0.1vw 0.2vh 0 #000, " +
    "-0.1vw 0 0 #000, " +
    "0.1vw 0 0 #000, " +
    "0 -0.1vh 0 #000, " +
    "0 0.1vh 0 #000";
document.body.appendChild(clock);

var spawn_btn = document.getElementById("spawn-button");
var timerInterval;
var hours = 0;
var minutes = 0;
var seconds = 0;
var isPaused = false;

function pauseTimer() {
    isPaused = true;
}

function resumeTimer() {
    isPaused = false;
}

spawn_btn.onclick = function() {
    clearInterval(timerInterval);
clock.textContent = "00:00:00";
        hours = 0;
        minutes = 0;
        seconds = 0;
    if (isPaused) {
        resumeTimer();
    }

    timerInterval = setInterval(function() {
        if (!isPaused) {
            seconds++;

            if (seconds >= 60) {
                seconds = 0;
                minutes++;
            }

            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }

            if (hours >= 24) {
                hours = 0;
            }

            clock.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }, 1000);
};

function checkXState() {
    var homeScreen = document.getElementById("home-screen");
    if (homeScreen) {
        var xState = homeScreen.getAttribute("x-state");
        if (xState === "game-over") {
            pauseTimer();
        }
    }
}

const observer = new MutationObserver(checkXState);
var homeScreen = document.getElementById("home-screen");
if (homeScreen) {
    observer.observe(homeScreen, { attributes: true });
}

const bodyObserver = new MutationObserver(() => {
    var newHomeScreen = document.getElementById("home-screen");
    if (newHomeScreen) {
        observer.observe(newHomeScreen, { attributes: true });
        bodyObserver.disconnect();
    }
});

bodyObserver.observe(document.body, { childList: true, subtree: true });


time_alive.onclick = function() {
    if (t_8) {

        
        clock.style.display = "block";

    } else {
        
        clock.style.display = "none";

    }
    t_8 = !t_8
};
    var menu = document.createElement("div");
    var Normal = document.createElement("button");
    var Sandbox = document.createElement("button");

    var Add_Build = document.createElement("button");
    var Delete_Build = document.createElement("button");
    var Import = document.createElement("button");
    var Export = document.createElement("button");
    var List = document.createElement("div");

menu.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
menu.style.width = "70vw";
menu.style.height = "70vh";
menu.style.zIndex = "9997";
menu.style.position = "absolute";
menu.style.top = "50%";
menu.style.left = "50%";
menu.style.transform = "translate(-50%, -50%)";
menu.style.borderRadius = "5px";
menu.style.color = "white"
menu.style.textAlign = "center";
menu.style.fontSize = "2em";
var Diep_Builds = document.createElement("h4");
menu.style.display = "none";
menu.style.position = 'relative';

Normal.style.backgroundColor = "black";
Normal.style.width = "50%";
Normal.style.height = "10%";
Normal.style.zIndex = "9999";
Normal.style.position = "absolute";
Normal.style.top = "0";
Normal.style.left = "0";
Normal.textContent = "Build";
Normal.style.color = "white";
var sbx = true;
Normal.onmouseover = function(){if(sbx == false) {return}else{Normal.style.transition = 'background-color 1s ease'; Normal.style.backgroundColor = "#5d89b6" }};
Normal.onmouseout = function(){if (sbx === true) { Normal.style.backgroundColor = "Black" } else {return}};
Normal.onclick = function(){setTimeout(function(){Diep_Builds.textContent = "Tank Builds"}, 150); Normal.style.backgroundColor = "#5d89b6"; sbx = false; Sandbox.style.backgroundColor = "Black"; document.getElementById('container-box').style.display = 'none'; List.style.display = "flex";};

Sandbox.style.backgroundColor = "black";
Sandbox.style.width = "50%";
Sandbox.style.height = "10%";
Sandbox.style.zIndex = "9999";
Sandbox.style.position = "absolute";
Sandbox.style.top = "0";
Sandbox.style.right = "0";
Sandbox.textContent = "Sandbox";
Sandbox.style.color = "white";

    const style = document.createElement('style');
    style.textContent = `
        .switch {
            position: relative;
            display: incline-block;
            width: 10vh;
            height: 4vh;
        }
        #container-box{
         display: none;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            z-index: 9998;
            border-radius: 2vh;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 3vh;
            width: 3vh;
            left: 0.4vh;
            bottom: 0.4vh;
            background-color: white;
            transition: .4s;
            z-index: 9998;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #2196F3;
        }

        input:focus + .slider {
            box-shadow: 0 0 1px #2196F3;
        }

        input:checked + .slider:before {
            transform: translateX(4vh);
        }

        .label-container {
            display: flex;
            align-items: center;
            margin-bottom: 3vh;
            font-size: 3vh;
        }

        .label-container span {
            margin-left: 2vh;
        }

        #toggle-container {
            position: fixed;
            top: 44vh;
            left: 50vh;
            transform: translate(-50%, -50%);
            transition: all 0.4s;
            z-index: 9998;
        }

    `;



    var lastGameMode = localStorage.getItem('d:last_gamemode');


    document.head.appendChild(style);
var auto_respawn = false; //Automatically respawns your tank
var auto_level = false; //Automtically gives you level 45
var auto_build_apply = false; //Automatically applies build
var value;
const target = document.getElementById("home-screen");

const config = { attributes: true };

const callback = (mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'x-state') {
     const newXStateValue = mutation.target.getAttribute('x-state');

lastGameMode = localStorage.getItem('d:last_gamemode');

     if(newXStateValue == "game-over" && auto_respawn == true && lastGameMode == `"sandbox"`){

      value = localStorage.getItem("d:last_spawn_name");
       input.execute("game_spawn " + value)
}

 if(newXStateValue == "in-game" && auto_level == true){

 document.querySelector("#sandbox-max-level").click();
    }
  }
  }
};


const observerr = new MutationObserver(callback);

observerr.observe(target, config);


    const container = document.createElement('div');
    container.id = 'toggle-container';
    container.innerHTML = `
    <div id="container-box">
        <div class="label-container">
            <label class="switch">
                <input type="checkbox" id="Auto_leveler">
                <span class="slider"></span>
            </label>
            <span>Auto Level Up</span>
        </div>
        <div class="label-container">
            <label class="switch">
                <input type="checkbox" id="Auto_respawn">
                <span class="slider"></span>
            </label>
            <span>Auto Respawn</span>
        </div>
        <div class="label-container">
            <label class="switch">
                <input type="checkbox" id="Auto_build">
                <span class="slider"></span>
            </label>
            <span>Auto Apply Build</span>
        </div>
        <h2 style = "margin-left: 2vh;">More Coming Soon!<h2>
        </div>

    `;

    document.body.appendChild(container);

document.getElementById("Auto_leveler").addEventListener('change', (event) => {
document.querySelector("#sandbox-max-level").click();
    auto_level = !auto_level;


});

           document.getElementById("Auto_respawn").addEventListener('change', (event) => {

                auto_respawn = !auto_respawn;


});

               document.getElementById("Auto_build").addEventListener('change', (event) => {


});

Diep_Builds.style.position = "absolute"
Diep_Builds.textContent = "Tank Builds";
Diep_Builds.style.top = "6%";
Diep_Builds.style.left = "50%";
Diep_Builds.style.transform = "translate(-50%, -50%)";
Diep_Builds.style.color = "white";

List.style.zIndex = "9999";
List.style.width = "100%";
List.style.height = "50%";
List.style.position = "absolute";
List.style.top = "43%";
List.style.left = "50%";
List.style.marginTop = "0.5vh"
List.style.transform = "translate(-50%, -50%)";
List.style.display = "flex";
List.style.flexDirection = "column";
List.style.gap = "1vh";
List.style.overflowY = "scroll";

//

var user_buildd = document.createElement('div');
user_buildd.style.width = "100%";
user_buildd.style.backgroundColor = "black"
user_buildd.style.height = "20%";
user_buildd.style.position = "sticky";
user_buildd.style.top = "0";
user_buildd.style.zIndex = "9999";
user_buildd.style.color = "white"
user_buildd.style.fontSize = "3vh"
user_buildd.style.display = "flex";
user_buildd.style.justifyContent = "space-evenly";
user_buildd.style.alignItems = "center";
user_buildd.style.textAlign = "center";
var bld_namee = document.createElement('p');
bld_namee.textContent = "Build Name"
var tank_namee = document.createElement('p');
tank_namee.textContent = "Tank Name"
var key_shortcutt = document.createElement('p');
key_shortcutt.textContent = "Key Shortcut"
user_buildd.appendChild(bld_namee)
user_buildd.appendChild(tank_namee)
user_buildd.appendChild(key_shortcutt)
List.appendChild(user_buildd)


var user_build;
function createnew() {
user_build = document.createElement('div');
user_build.className = "user_builder";
user_build.style.width = "100%";
user_build.style.backgroundColor = "white"
user_build.style.height = "20%";
user_build.style.zIndex = "9997";
user_build.style.color = "black"
user_build.style.fontSize = "2.4vh"
user_build.onmouseover = function() {user_build.style.backgroundColor = "rgb(93, 137, 182)"};

user_build.onmouseout = function() {user_build.style.backgroundColor = "white"};

user_build.style.display = "flex";
user_build.style.justifyContent = "space-evenly";
user_build.style.alignItems = "center";
user_build.style.textAlign = "center";



var bld_name = document.createElement('p');
bld_name.textContent = "Ram Defence"
var tank_name = document.createElement('p');
tank_name.textContent = "Tank Name"
var key_shortcut = document.createElement('p');
key_shortcut.textContent = "SHIFT + 1"
user_build.appendChild(bld_name)
user_build.appendChild(tank_name)
user_build.appendChild(key_shortcut)
List.appendChild(user_build)

}
    createnew()
    createnew()
    createnew()
    createnew()
    createnew()
    createnew()
    createnew()
    createnew()


Sandbox.onmouseover = function(){if(sbx == false){ return }Sandbox.style.transition = 'background-color 1s ease'; Sandbox.style.backgroundColor = "#5d89b6"};
Sandbox.onmouseout = function(){if (sbx === true) {Sandbox.style.backgroundColor = "Black"} else {return}};
Sandbox.onclick = function(){setTimeout(function(){Diep_Builds.textContent = "Sandbox"}, 150); Sandbox.style.backgroundColor = "#5d89b6"; sbx = false; Normal.style.backgroundColor = "Black"; document.getElementById('container-box').style.display = "inline-block"; List.style.display = "none"; };


Add_Build.style.backgroundColor = "#00FF00"
Add_Build.textContent = "+"
Add_Build.style.width = "3.9vw";
Add_Build.style.height = "3.9vw";
Add_Build.style.zIndex = "9999";
Add_Build.style.fontSize = "5vh"
Add_Build.style.overflow = "hidden";
Add_Build.style.position = "absolute";
Add_Build.style.bottom = "8%";
Add_Build.style.left = "10%";
Add_Build.style.color = "black";
Add_Build.style.border = "none";
Add_Build.style.cursor = "pointer";

Delete_Build.style.backgroundColor = "#FF0000"
Delete_Build.style.width = "3.9vw";
Delete_Build.style.height = "3.9vw";
Delete_Build.style.zIndex = "9999";
Delete_Build.style.position = "absolute";
Delete_Build.style.bottom = "8%";
Delete_Build.style.left = "20%";
Delete_Build.style.border = "none";
Delete_Build.style.backgroundImage = "url('https://i.imgur.com/DNl3R4E.png')";
Delete_Build.style.backgroundPosition = "center";
Delete_Build.style.backgroundSize = "contain";
Delete_Build.style.backgroundRepeat = "no-repeat";
Delete_Build.style.cursor = "pointer";

Import.style.zIndex = "9999";
Import.style.color = "white";
Import.style.border = "2px solid white"
Import.style.borderRadius = "6%";
Import.style.position = "absolute";
Import.style.bottom = "8%";
Import.style.right = "22%";
Import.textContent = "Import"
Import.style.height = "9%";
Import.style.width = "10%";
Import.style.cursor = "pointer";


Import.onmouseover = function(){Import.style.backgroundColor = "Black"};
Import.onmouseout = function(){Import.style.backgroundColor = "transparent"};

Export.style.zIndex = "9999";
Export.textContent = "Export"
Export.style.color = "white";
Export.style.border = "2px solid white"
Export.style.borderRadius = "6%";
Export.style.position = "absolute";
Export.style.bottom = "8%";
Export.style.right = "9%";
Export.style.height = "9%";
Export.style.width = "10%";
Export.style.cursor = "pointer";

Export.onmouseover = function(){Export.style.backgroundColor = "Black"};
Export.onmouseout = function(){Export.style.backgroundColor = "transparent"};

Add_Build.onmouseover = function(){Add_Build.style.backgroundColor = "#008000"};
Add_Build.onmouseout = function(){Add_Build.style.backgroundColor = "#00FF00"};
Delete_Build.onmouseover = function(){Delete_Build.style.backgroundColor = "#800000"};
Delete_Build.onmouseout = function(){Delete_Build.style.backgroundColor = "#FF0000"};

document.body.appendChild(menu)
    menu.appendChild(Normal);
    menu.appendChild(Sandbox);
    menu.appendChild(Diep_Builds);
    menu.appendChild(List);
    menu.appendChild(Import);
    menu.appendChild(Export);
    menu.appendChild(Add_Build);
    menu.appendChild(Delete_Build);
    List.appendChild(user_build)
    var truthy = false;

    (function() { // Build Crate
        document.addEventListener('keydown', function(event) {
            if (event.keyCode === 66) {
            truthy = !truthy;

             if(checker == true){
            menu.style.display = truthy ? "block" : "none";
            document.getElementById('toggle-container').style.display = truthy ? "block" : "none";


             }
            }
        });
    })();

document.addEventListener('keydown', function(event) {
    if (event.keyCode === 192) {
        Creator.style.display = "none";
        t = true
        }
    });


copy_link.onclick = function(){var link = document.getElementById("copy-party-link").click(); copy_link.textContent = "Copied!"; setTimeout(function(){copy_link.textContent = "Copy Link"}, 5000); }
 // Mouse Coords
    let x = event.clientX;
    let y = event.clientY;
var help_tool = document.createElement('div');

onclick = function(){
    help_tool.textContent = "Build";
    help_tool.style.backgroundColor = "grey";
    help_tool.style.color = "white";
    help_tool.style.zIndex = "9999";};
    help_tool.style.position = "absolute"
    help_tool.style.top = `${y}px`;
    help_tool.style.left = `${x}px`;
    document.body.appendChild(help_tool);
    onmousemove = function(){if(help_tool){help_tool.remove()}};




})();
}


(function() {
    const handler = {
        apply(r,o,args) {
            Error.stackTraceLimit = 0;
            return r.apply(o,args)
        }
    }
    Object.freeze = new Proxy(Object.freeze, handler)
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

    const callbackMap = new WeakMap();

    EventTarget.prototype.addEventListener = function(event, callback, options) {
        if (['keydown', 'keypress', 'keyup'].includes(event)) {
            const wrappedCallback = function(e) {
                const originalIsTrusted = e.isTrusted;
                const wrappedEvent = new Proxy(e, {
                    get(target, property) {
                        if (property === 'isTrusted') {
                            return true;
                        } else if (property === 'originalIsTrusted') {
                            return originalIsTrusted;
                        }
                        return target[property];
                    }
                });

                callback.call(this, wrappedEvent);
            };

            callbackMap.set(callback, wrappedCallback);
            originalAddEventListener.call(this, event, wrappedCallback, options);
        } else {
            originalAddEventListener.call(this, event, callback, options);
        }
    };

    EventTarget.prototype.removeEventListener = function(event, callback, options) {
        if (callbackMap.has(callback)) {
            const wrappedCallback = callbackMap.get(callback);
            originalRemoveEventListener.call(this, event, wrappedCallback, options);
            callbackMap.delete(callback);
        } else {
            originalRemoveEventListener.call(this, event, callback, options);
        }
    };
})();

let win = typeof unsafeWindow != "undefined" ? unsafeWindow : window;

var int = win.setInterval(function() {
  if(win.input != null) {
    win.clearInterval(int);
    onready();
  }
}, 100);

function onready() {
  function key_down(keyCode) {
    let event = new KeyboardEvent('keydown', {
        bubbles: true,
        keyCode: keyCode,
        key: String.fromCharCode(keyCode),
        code: `Key${String.fromCharCode(keyCode).toUpperCase()}`,
    });
    document.dispatchEvent(event);
}

function key_up(keyCode) {
    var event = new KeyboardEvent('keyup', {
        bubbles: true,
        keyCode: keyCode,
        key: String.fromCharCode(keyCode),
        code: `Key${String.fromCharCode(keyCode).toUpperCase()}`,
    });
    document.dispatchEvent(event);
}
  const KEY = '`';
  const scaling = 64;
  const scale = win.devicePixelRatio;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const c = CanvasRenderingContext2D.prototype;

  function getRatio() {
    if(canvas.height * 16 / 9 >= canvas.width) {
      return canvas.height;
    } else {
      return canvas.width / 16 * 9;
    }
  }

  function getScale() {
    return getRatio() / (1080 * scale);
  }

  function withinMinimap(x, y) {
    const r = getRatio();
    if(x >= canvas.width - r * 0.2 && y >= canvas.height - r * 0.2) {
      return true;
    } else {
      return false;
    }
  }

  function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }

  var FoV = 1;
  var background_alpha = 0.05;

  var got = false;
  var posCount = 0;
  var firstPos = [];
  var secondPos = [];
  var playerPos = [-1, 0];
  var vel = [0, 0];
  var mvel = [0, 0];

  var mouse = [0, 0];
  var realMouse = [0, 0];
  var afkSpot = [-1, 0];
  var picking = false;
  var afk = false;
  var slowerAfk = 0;

  var relyKeys = true;
  var menuVisible = false;
  var menu;
  var textOverlay = 0;

  var multibox = false;
  var aim = 0;
  var movement = false;
  var mov;
  var aimm;

  var buttons = 0;
  const KEYS = {
    48  :       1,
    49  :       2,
    50  :       4,
    51  :       8,
    52  :      16,
    53  :      32,
    54  :      64,
    55  :     128,
    56  :     256,
    57  :     512,
    67  :    1024,
    69  :    2048,
    75  :    4096,
    79  :    8192,
    77  :   16384,
    85  :   32768,
    59  :   65536,
    220 :  131072,
    13  :  262144,
    0   :  524288,
    2   : 1048576,
    32  : 2097152,
    16  : 4194304
  };
  const KEYS2 = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 67, 69, 75, 79, 77, 85, 59, 220, 13, 0, 2, 32, 16];

  var bmov = 0;
  const MKEYS = {
    87: 1,
	38: 1,

    83: 2,
	40: 2,

    65: 4,
	37: 4,

    68: 8,
	39: 8
  };

  const RD = 2.5;
  const MRD = 0.1;
  const SRD = RD + MRD;
  const DRD = SRD * (Math.sqrt(2) / 2);

  const keybinds = localStorage.getItem("multbox_keybinds") ? JSON.parse(localStorage.getItem("multbox_keybinds")) : ["XD", "XD", "XD", "XD", "XD", "XD"];

  if(keybinds.length != 6) {
    for(let i = keybinds.length; i < 6; ++i) {
      keybinds[i] = "XD";
    }
    localStorage.setItem("multbox_keybinds", JSON.stringify(keybinds));
  }

  function normalizeVel() {
    const d = dist(0, 0, vel[0], vel[1]);
    if(d > 1) {
      mvel[0] = Math.sign(vel[0]) * DRD;
      mvel[1] = Math.sign(vel[1]) * DRD;
    } else {
      mvel = [Math.sign(vel[0]) * SRD, Math.sign(vel[1]) * SRD];
    }
  }

  function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return [(e.clientX - rect.left) / (rect.right - rect.left) * canvas.width, (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height];
  }

  win.onmousemove = new Proxy(win.onmousemove ?? function(){}, {
    apply: function(to, what, args) {
      const e = args[0];
      mouse = getMousePos(e);
      realMouse = [playerPos[0] + (mouse[0] - canvas.width / 2) / getScale() / FoV / scaling,
                   playerPos[1] + (mouse[1] - canvas.height / 2) / getScale() / FoV / scaling];
      return to.apply(what, args);
    }
  });
  win.onmousedown = new Proxy(win.onmousedown ?? function(){}, {
    apply: function(to, what, args) {
      const e = args[0];
      if(picking == true) {
        const w = canvas.width;
        const h = canvas.height;
        const r = getRatio();
        if(withinMinimap(e.clientX * scale, e.clientY * scale) == true) {
          afkSpot = [(e.clientX * scale - w + r * 0.2) / getScale(), (e.clientY * scale - h + r * 0.2) / getScale()];
        } else if(e.clientX * scale > w - r * 0.3 - 1 && e.clientX * scale < w - r * 0.2 - 1 && e.clientY * scale > h - r * 0.3 - 1 && e.clientY * scale < h - r * 0.2 - 1) {
          afkSpot = [-1, 0];
        } else {
		  afkSpot = realMouse;
		}
		picking = false;
      }
      if(KEYS[e.button] != null && (buttons & KEYS[e.button]) == 0) {
        buttons |= KEYS[e.button];
      }
      return to.apply(what, args);
    }
  });
  win.onmouseup = new Proxy(win.onmouseup ?? function(){}, {
    apply: function(to, what, args) {
      const e = args[0];
      if(KEYS[e.button] != null && (buttons & KEYS[e.button]) != 0) {
        buttons ^= KEYS[e.button];
      }
      return to.apply(what, args);
    }
  });
  win.onkeydown = new Proxy(win.onkeydown ?? function(){}, {
    apply: function(to, what, args) {
      const e = args[0];
      if(e.key == KEY && (textOverlay == 0 || (textOverlay != 0 && textOverlay > 6))) {
        menuVisible = !menuVisible;
        if(menuVisible == true) {
          menu.style.display = 'block';
        } else {
          menu.style.display = 'none';
        }
      }
      if(KEYS[e.keyCode] != null && (buttons & KEYS[e.keyCode]) == 0) {
        buttons |= KEYS[e.keyCode];
      }
      if(MKEYS[e.keyCode] != null && (bmov & MKEYS[e.keyCode]) == 0) {
		let code = MKEYS[e.keyCode];
        bmov |= code;
        switch(code) {
          case 4: {
            vel[0] -= 1;
            break;
          }
          case 8: {
            vel[0] += 1;
            break;
          }
          case 2: {
            vel[1] += 1;
            break;
          }
          case 1: {
            vel[1] -= 1;
            break;
          }
        }
        normalizeVel();
      }
      if(textOverlay == 0 || textOverlay > 6) {
        for(let i = 0; i < keybinds.length; ++i) {
          if(e.key == keybinds[i]) {
            document.getElementById('mboxb' + (i + 1)).dispatchEvent(new MouseEvent("click"));
          }
        }
      } else {
        if(e.key == KEY) {
          keybinds[textOverlay - 1] = "XD";
          document.getElementById('mboxk' + textOverlay).innerHTML = '-';
        } else {
          keybinds[textOverlay - 1] = e.key;
          document.getElementById('mboxk' + textOverlay).innerHTML = e.key;
        }
        localStorage.setItem("multibox_keybinds", JSON.stringify(keybinds));
        textOverlay = 0;
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      return to.apply(what, args);
    }
  });
  win.onkeyup = new Proxy(win.onkeyup ?? function(){}, {
    apply: function(to, what, args) {
      const e = args[0];
      let code = KEYS[e.keyCode];
      if(code != null && (buttons & code) != 0) {
        buttons ^= code;
      }
	  code = MKEYS[e.keyCode];
      if(code != null && (bmov & code) != 0) {
        bmov ^= code;
        switch(code) {
          case 4: {
            vel[0] += 1;
            break;
          }
          case 8: {
            vel[0] -= 1;
            break;
          }
          case 2: {
            vel[1] -= 1;
            break;
          }
          case 1: {
            vel[1] += 1;
            break;
          }
        }
        if((bmov & MKEYS[65]) == 0 && (bmov & MKEYS[68]) == 0) {
          vel[0] = 0;
        }
        if((bmov & MKEYS[83]) == 0 && (bmov & MKEYS[87]) == 0) {
          vel[1] = 0;
        }
        normalizeVel();
      }
      return to.apply(what, args);
    }
  });

  c.moveTo = new Proxy(c.moveTo, {
    apply: function(to, what, args) {
      const x = args[0];
      const y = args[1];
      if(withinMinimap(x, y) == true) {
        firstPos = [x, y];
        posCount = 1;
      } else {
        posCount = 0;
      }
      return to.apply(what, args);
    }
  });

  c.stroke = new Proxy(c.stroke, {
    apply: function(to, what, args) {
      if((what.fillStyle == '#cdcdcd' || what.fillStyle == '#cccccc') && what.strokeStyle == '#000000') {
        FoV = what.globalAlpha / background_alpha;
      }
      posCount = 0;
      return to.apply(what);
    }
  });

  c.lineTo = new Proxy(c.lineTo, {
    apply: function(to, what, args) {
      const x = args[0];
      const y = args[1];
      switch(posCount) {
        case 1: {
          if(withinMinimap(x, y) == true && dist(x, y, firstPos[0], firstPos[1]) < 15 * scale * getScale()) {
            secondPos = [x, y];
            ++posCount;
          } else {
            posCount = 0;
          }
          break;
        }
        case 2: {
          const d = dist(firstPos[0], firstPos[1], secondPos[0], secondPos[1]);
          if(withinMinimap(x, y) == true && d < 15 * scale * getScale() && what.fillStyle == "#000000" && !got) {
            const angle = Math.atan2(secondPos[1] - y, secondPos[0] - x) - 0.3674113;
            const r = getRatio();
            const xx = (x + Math.cos(angle) * d * 0.8660111 - canvas.width + r * 0.2) / getScale();
            const yy = (y + Math.sin(angle) * d * 0.8660111 - canvas.height + r * 0.2) / getScale();
			  console.log(xx.toFixed(2), yy.toFixed(2), getScale(), getRatio());
            playerPos = [xx, yy];
			got = true;
            realMouse = [playerPos[0] + (mouse[0] - canvas.width / 2) / getScale() / FoV / scaling,
                         playerPos[1] + (mouse[1] - canvas.height / 2) / getScale() / FoV / scaling];
          }
          posCount = 0;
          break;
        }
      }
      return to.call(what, x, y);
    }
  });

  function drawOverlay() {
    if(picking == true) {
      const r = getRatio();
      var draw = true;
      var angle;
      const w = canvas.width;
      const h = canvas.height;
      ctx.beginPath();
      ctx.fillStyle = '#00000077';
      ctx.fillRect(0, 0, w, (h - r * 0.2) | 0);
      ctx.fillRect(0, (h - r * 0.2) | 0, (w - r * 0.2) | 0, h);
      ctx.fillStyle = '#FF000077';
      ctx.fillRect(w - r * 0.3 - 1, h - r * 0.3 - 1, r * 0.1, r * 0.1);
      ctx.moveTo(mouse[0] - 15, mouse[1]);
      ctx.lineTo(mouse[0] + 15, mouse[1]);
      ctx.moveTo(mouse[0], mouse[1] - 15);
      ctx.lineTo(mouse[0], mouse[1] + 15);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00000077';
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF77';
      ctx.font = `${30 * scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('drag your cursor on the minimap', w / 2, (h - h / 2.5) / 2);
      ctx.fillText('left click to select where you want to stay', w / 2, (h - h / 5) / 2);
      ctx.fillText('click on the red area to reset your AFK location', w / 2, (h) / 2);
	  ctx.fillText('click anywhere else to stay at that location', w / 2, (h + h / 5) / 2);
      ctx.fillText('press the button again to hide this overlay', w / 2, (h + h / 2.5) / 2);
    } else if(textOverlay != 0) {
      const w = canvas.width / 2;
      const h = canvas.height / 2;
      ctx.beginPath();
      ctx.fillStyle = '#00000077';
      ctx.fillRect(0, 0, w * 2, h * 2);
      ctx.fillStyle = '#FFFFFF77';
      ctx.font = `${30 * scale}px Arial`;
      ctx.textAlign = 'center';
      switch(textOverlay) {
        case 1: {
          ctx.fillText('press the key you want to bind to picking AFK location', w, h - h / (10 / 3));
          break;
        }
        case 2: {
          ctx.fillText('press the key you want to bind to toggling AFK', w, h - h / (10 / 3));
          break;
        }


        case 7: {
          ctx.fillText('picks the location which your tank will be going towards', w, h - h / 10);
          ctx.fillText('when you toggle AFK option to be on', w, h + h / 10);
          break;
        }
        case 8: {
          ctx.fillText('moves your tank towards the position you set previously', w, h - h / 10);
          ctx.fillText('if you did not set AFK location, it will be set to your current position', w, h + h / 10);
          break;
        }
        case 9: {
          ctx.fillText('enables / disables multibox (aim, movement, key copying)', w, h - h / 10);
          ctx.fillText('can be set for each tab individually', w, h + h / 10);
          break;
        }
        case 10: {
          ctx.fillText('toggles between different aiming styles for other tabs', w, h - h / 2.5);
          ctx.fillText('precise - tabs will aim based on mouse position on the map', w, h - h / 5);
          ctx.fillText('copy - tabs will aim based on mouse position on the screen', w, h);
          ctx.fillText('reverse - tabs will aim the opposite precise direction', w, h + h / 5);
          ctx.fillText('\'reverse\' option is mostly useful when having movement set to \'mouse\'', w, h + h / 2.5);
          break;
        }
        case 11: {
          ctx.fillText('toggles between different movement styles for other tabs', w, h - h / 5);
          ctx.fillText('player - moves tabs towards the player, uses own movement prediction', w, h);
          ctx.fillText('mouse - moves tabs towards the mouse to act like drones', w, h + h / 5);
          break;
        }
        case 12: {
          ctx.fillText('decides whether keys pressed on your master tab will affect this tab', w, h - h / 5);
          ctx.fillText('keep it on if you want all your tabs to be coordinated no matter what', w, h);
          ctx.fillText('keep it off if eg. auto fire off shouldn\'t affect other tabs', w, h + h / 5);
          break;
        }
      }
      if(textOverlay < 7) {
        ctx.fillText('pressing ' + KEY + ' will set the keybind to inactive (no key will be assigned)', w, h - h / 10);
        ctx.fillText('you can change the keybind anytime afterwards', w, h + h / 10);
        ctx.fillText('press the button again to hide this overlay', w, h + h / (10 / 3));
      }
    }
	got = false;
    requestAnimationFrame(drawOverlay);
  }

  function moveToWithRadius(x, y, r) {
    if(dist(x, y, playerPos[0], playerPos[1]) <= r) {
      key_up(65);
      key_up(68);
      key_up(83);
      key_up(87);
      return;
    }
    key_up(65);
    key_up(68);
    key_up(83);
    key_up(87);
    const angle = Math.atan2(y - playerPos[1], x - playerPos[0]);
    if(angle > -Math.PI * 2/6 && angle < Math.PI * 2/6) {
      key_down(68);
    } else if(angle < -Math.PI * 4/6 || angle > Math.PI * 4/6) {
      key_down(65);
    }
    if(angle > Math.PI * 1/6 && angle < Math.PI * 5/6) {
      key_down(83);
    } else if(angle > -Math.PI * 5/6 && angle < -Math.PI * 1/6) {
      key_down(87);
    }
  }

  function moveToAFKSpot() {
    if(afk == true) {
      if(afkSpot[0] == -1) {
        afkSpot = playerPos;
      }
      if(!win.tripletTroll || ++slowerAfk % 3 == 0) {
        moveToWithRadius(afkSpot[0], afkSpot[1], -1);
      } else {
        key_up(65);
        key_up(68);
        key_up(83);
        key_up(87);
      }
    }
  }

  function simulateKeyPress(key, down) {
	down ? key_down(key) : key_up(key);
  }

  function simulateMousePress(button, down) {
	win.input.mouse(...mouse);
	++button;
	down ? key_down(button) : key_up(button);
  }

  function ReadVarUint(packet, at) {
    var number = 0;
    var count = 0;
    do {
      number |= (packet[at] & 0x7f) << (7 * count++);
    } while((packet[at++] >> 7) == 1);
    return [number, count];
  }

  function WriteVarUint(number) {
    let vu = [];
    while(number > 0x7f) {
      vu[vu.length] = (number & 0x7f) | 0x80;
      number >>>= 7;
    }
    vu[vu.length] = number;
    return vu;
  }

  function createData() {
    var o;
    if(movement == false) {
      o = [0, ...WriteVarUint((playerPos[0] + mvel[0]) * 1000), ...WriteVarUint((playerPos[1] + mvel[1]) * 1000), (mvel[0] == 0 && mvel[1] == 0) ? 0 : 1, ...WriteVarUint((Math.atan2(mvel[1], mvel[0]) + 4) * 1000)];
    } else {
      o = [1, ...WriteVarUint(realMouse[0] * 1000), ...WriteVarUint(realMouse[1] * 1000)];
    }
    if(aim == 0) {
      o = [...o, 0, ...WriteVarUint(realMouse[0] * 1000), ...WriteVarUint(realMouse[1] * 1000)];
    } else if(aim == 1) {
      o = [...o, 1, ...WriteVarUint(32000 + (mouse[0] - canvas.width / 2) / getScale() * 10), ...WriteVarUint(32000 + (mouse[1] - canvas.height / 2) / getScale() * 10)];
    } else {
      o = [...o, 2, ...WriteVarUint(realMouse[0] * 1000), ...WriteVarUint(realMouse[1] * 1000)];
    }
    o = [...o, ...WriteVarUint(buttons)];
    return o;
  }

  function parseData(o) {
    if(afk == false) {
      win.clearInterval(mov);
      win.clearInterval(aimm);
      const w = canvas.width / 2;
      const h = canvas.height / 2;
      const type = o[0];
      var at = 1;
      const x = ReadVarUint(o, at);
      at += x[1];
      x[0] /= 1000;
      const y = ReadVarUint(o, at);
      at += y[1];
      y[0] /= 1000;
      if(type == 0) {
        const hasVel = ReadVarUint(o, at);
        at += hasVel[1];
        const ang = ReadVarUint(o, at);
        at += ang[1];
        ang[0] = ang[0] / 1000 - 4;
        const lmfao = function() {
          if(hasVel[0] == 1 && dist(x[0], y[0], playerPos[0], playerPos[1]) <= RD) {
            const a1 = Math.atan2(y[0] - playerPos[1], x[0] - playerPos[0]);
            if(Math.abs(a1 - ang[0]) < 0.5) {
              if(a1 < ang[0]) {
                moveToWithRadius(x[0] + Math.cos(ang[0] + Math.PI / 2) * SRD, y[0] + Math.sin(ang[0] + Math.PI / 2) * SRD, -1);
              } else {
                moveToWithRadius(x[0] + Math.cos(ang[0] - Math.PI / 2) * SRD, y[0] + Math.sin(ang[0] - Math.PI / 2) * SRD, -1);
              }
            } else {
              moveToWithRadius(x[0] - Math.cos(ang[0]) * SRD * 2, y[0] - Math.sin(ang[0]) * SRD * 2, RD);
            }
          } else {
            moveToWithRadius(x[0], y[0], RD);
          }
        };
        mov = win.setInterval(lmfao, 50);
        lmfao();
      } else {
        mov = win.setInterval(function() {
          moveToWithRadius(x[0], y[0], -1);
        }, 50);
        moveToWithRadius(x[0], y[0], -1);
      }
      const a = o[at++];
      const xx = ReadVarUint(o, at);
      at += xx[1];
      const yy = ReadVarUint(o, at);
      at += yy[1];
      if(a == 0) {
        const lmfao = function() {
          const angle = Math.atan2(yy[0] / 1000 - playerPos[1], xx[0] / 1000 - playerPos[0]);
          var distance = dist(xx[0] / 1000, yy[0] / 1000, playerPos[0], playerPos[1]) * getScale() * FoV * scaling;
          mouse = [w + Math.cos(angle) * distance, h + Math.sin(angle) * distance];
          win.input.mouse(w + Math.cos(angle) * distance, h + Math.sin(angle) * distance);
        };
        aimm = win.setInterval(lmfao, 50);
        lmfao();
      } else if(a == 1) {
        mouse = [(xx[0] - 32000) / 10 * getScale() + w, (yy[0] - 32000) / 10 * getScale() + h];
        win.input.mouse((xx[0] - 32000) / 10 * getScale() + w, (yy[0] - 32000) / 10 * getScale() + h);
      } else {
        const lmfao = function() {
          const angle = Math.atan2(playerPos[1] - yy[0] / 1000, playerPos[0] - xx[0] / 1000);
          var distance = dist(xx[0] / 1000, yy[0] / 1000, playerPos[0], playerPos[1]) * getScale() * FoV * scaling;
          mouse = [w + Math.cos(angle) * distance, h + Math.sin(angle) * distance];
          win.input.mouse(w + Math.cos(angle) * distance, h + Math.sin(angle) * distance);
        };
        aimm = win.setInterval(lmfao, 50);
        lmfao();
      }
      if(relyKeys == true) {
        const b = ReadVarUint(o, at);
        at += b[1];
        const d = b[0] ^ buttons;
        for(let i = 0; i < KEYS2.length; ++i) {
          if((d & (2 ** i)) != 0) {
            if(KEYS2[i] < 3) {
              simulateMousePress(KEYS2[i], (buttons & (2 ** i)) == 0);
            } else {
              simulateKeyPress(KEYS2[i], (buttons & (2 ** i)) == 0);
            }
          }
        }
        buttons = b[0];
      }
    }
  }

  Object.freeze(CanvasRenderingContext2D.prototype);

  win.goUp = true;
  function updateCycle() {
    if(document.hasFocus() == true) {
      win.clearInterval(mov);
      win.clearInterval(aimm);
      if(multibox == true) {
        GM_setValue("mbox", JSON.stringify(createData()));
      }
    } else if(multibox == true) {
      try {
        var g = JSON.parse(GM_getValue("mbox"));
        parseData(g);
      } catch(err){}
    }
    if(win.octoAFK == true) {
      key_up(65);
      key_up(68);
      key_up(83);
      key_up(87);
      if(playerPos[0] < 184) {
        key_down(68);
      } else if(playerPos[0] > 186) {
        key_down(65);
      }
      if(playerPos[1] < 30) {
        win.goUp = false;
      } else if(playerPos[1] > 186) {
        win.goUp = true;
      }
      if(win.goUp == true) {
        key_down(87);
      } else {
        key_down(83);
      }
    }
    requestAnimationFrame(updateCycle);
  }

  const html = `
<div id="mbox">
<button id="mboxb1" class="mboxb">Pick AFK location</button>
<button id="mboxb2" class="mboxb">AFK: off</button>





</div>
`;
  const css = `
<style>
.mboxb {
border: none;
text-align: center;
text-decoration: none;
font-size: max(calc(0.3em + 0.7vw), 0.8em);
width: 70%;
height: 16.66666666666666%;
display: block;
transition-duration: 0.2s;
cursor: pointer;
-webkit-touch-callout: none;
-webkit-user-select: none;
-khtml-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
}
#mbox {
position: absolute;
top: 30%;
width: max(7em, 15%);
height: max(7em, 35%);
display: none;
z-index: 200;
}
#mboxb1 {
position: absolute;
top: 0;
left: 30%;
background-color: #4CAF50;
color: #FFFFFF;
border: 0.3em solid #4CAF50;
}
#mboxb1:hover {
background-color: #4CAF5000;
}
#mboxk1 {
position: absolute;
width: 15%;
top: 0;
left: 15%;
background-color: #4CAF50;
color: #FFFFFF;
border: 0.3em solid #4CAF50;
}
#mboxk1:hover {
background-color: #4CAF5000;
}
#mboxh1 {
position: absolute;
width: 15%;
top: 0;
left: 0;
background-color: #4CAF50;
color: #FFFFFF;
border: 0.3em solid #4CAF50;
}
#mboxh1:hover {
background-color: #4CAF5000;
}
#mboxb2 {
position: absolute;
top: 16.66666666666666%;
left: 30%;
background-color: #008CBA;
color: #FFFFFF;
border: 0.3em solid #008CBA;
}
#mboxb2:hover {
background-color: #008CBA00;
}
#mboxk2 {
position: absolute;
width: 15%;
top: 16.66666666666666%;
left: 15%;
background-color: #008CBA;
color: #FFFFFF;
border: 0.3em solid #008CBA;
}
#mboxk2:hover {
background-color: #008CBA00;
}
#mboxh2 {
position: absolute;
width: 15%;
top: 16.66666666666666%;
left: 0;
background-color: #008CBA;
color: #FFFFFF;
border: 0.3em solid #008CBA;
}
#mboxh2:hover {
background-color: #008CBA00;
}

</style>
`;

  requestAnimationFrame(drawOverlay);
  requestAnimationFrame(updateCycle);
  win.setInterval(moveToAFKSpot, 100);
  canvas.insertAdjacentHTML('afterend', css);
  canvas.insertAdjacentHTML('afterend', html);
  menu = document.getElementById('mbox');
  const AFKLocationButton = document.getElementById('mboxb1');
  AFKLocationButton.addEventListener("click", function(e) {
	if(!document.hasFocus() || !(e instanceof MouseEvent)) return;
    if(textOverlay != 0) {
      textOverlay = 0;
    }
    picking = !picking;
  });
  const AFKButton = document.getElementById('mboxb2');
  AFKButton.addEventListener("click", function(e) {
	if(!document.hasFocus() || !(e instanceof MouseEvent)) return;
    afk = !afk;
    if(afk == true) {
      win.clearInterval(mov);
      win.clearInterval(aimm);
      this.innerHTML = 'AFK: on';
    } else {
      this.innerHTML = 'AFK: off';
      key_up(65);
      key_up(68);
      key_up(83);
      key_up(87);

    }



  });



   };
