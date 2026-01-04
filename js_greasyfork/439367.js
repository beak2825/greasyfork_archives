// ==UserScript==
// @name         PaperIO Simple Script
// @namespace    https://paper-io.com/teams/
// @version      0.0.22222222222222222222222222
// @description  Paper.io用のシンプルなHack用Script
// @license      MIT
// @author       Akkey57492
// @match        https://paper-io.com/*
// @icon         https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/d2708e8aa31df3fe7b211bca36405d6d.png
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @resource     toastr.min.css https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @downloadURL https://update.greasyfork.org/scripts/439367/PaperIO%20Simple%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/439367/PaperIO%20Simple%20Script.meta.js
// ==/UserScript==

var cf_css;
var window = window.unsafeWindow;
cf_css = GM_getResourceText("toastr.min.css");
GM_addStyle(cf_css);
let debugMode = false;
let godmode = false;
let stopMove = false;
let fastMove = false;
let shortcut = true;
let teams = true;
let menuHTML = `
<div id="menu">
    <button class="toggle" id="toggle_button">Toggle</button>
    <div class="toggle" id="menu_main">
        <section><div class="menu_content"><button class="menu_button" id="play_game">Start Game</button></div></section>
        <section><div class="menu_content"><button class="menu_button" id="shortcut_toggle">Shortcut Toggle(Enabled)</button></div></section>
        <section><div class="menu_content"><button class="menu_button" id="stop_move_toggle">Stop Movement(Disabled)</button></div></section>
        <section><div class="menu_content"><button class="menu_button" id="fast_move_toggle">Fast Movement(Disabled)</button></div></section>
        <section><div class="menu_content"><button class="menu_button" id="suicide">Suicide</button></div></section>
        <section><div class="menu_content"><button class="menu_button" id="debug_toggle">Debug Mode(Disabled)</button></div></section>
        <section><div class="menu_content"><button class="menu_button" id="godmode">Godmode(Disabled)</button></div></section>
        <section><div class="menu_content"><button class="menu_button" id="zoom_reset">Reset Zoom</button></div></section>
    </div>
</div>
<style>
#menu {
    z-index: 10;
    position: absolute;
    top: 256px;
    left: 7px;
}
#menu_main {
    padding: 15px;
    margin-bottom: 5px;
    display: grid;
}
section {
    display: flex;
    justify-content: space-between;margin:5px;
}
.toggle {
    background-color: #363c3d;
    letter-spacing: 2px;
    font-weight: bold;
    font-size: 15px;
    font-family: 'Open Sans', sans-serif;
    color:white;
}
p {
    text-align: center;
    border-bottom:1px solid white;
}
#toggle_button {
    width: 100%;
    border:0;
}
label {
    font-weight: bold;
}
input {
    margin-top: auto;
    margin-bottom: auto;
    transform: scale(1.3);
}
input:hover {
    cursor: pointer;
}
input:focus {
    box-shadow: 0 0 10px #9ecaed;
}
input[type=checkbox] {
    transform: scale(2.2);outline=none;
}
input[type=radio] {
    border-top: auto;
}
input[type=color] {
    width: 50px;
}
.menu_button {
  background-color: #242829;
  color: white;
  font-size: 16px;
  border: none;
  padding: 8px;
}
.menu_content {
  position: relative;
  display: inline-block;
}
</style>
`
let menu_element = document.createElement("div");
menu_element.innerHTML = menuHTML;
document.body.appendChild(menu_element);
let toggle = document.getElementById("toggle_button");
let start = document.getElementById("play_game");
let shortcut_toggle = document.getElementById("shortcut_toggle");
let stop_move_toggle = document.getElementById("stop_move_toggle");
let fast_move_toggle = document.getElementById("fast_move_toggle");
let suicide = document.getElementById("suicide");
let debug_toggle = document.getElementById("debug_toggle");
let godmode_toggle = document.getElementById("godmode");
let reset_zoom = document.getElementById("zoom_reset");

if(window.paper2 === undefined) {
    teams = true;
    toastr.warning("モード: Teams");
} else {
    teams = false;
    toastr.warning("モード: Classic");
}

toggle.onclick = function() {
    let menu = document.getElementById("menu_main");
    if(menu.style.display == "none") {
        menu.style.display = "grid";
    } else {
        menu.style.display = "none";
    }
}

start.onclick = function() {
    if(teams === true) {
        window.paperio2api.startGame();
    } else if(teams === false) {
        window.paper2.start("paper2_classic");
    }
}

shortcut_toggle.onclick = function() {
    if(shortcut === true) {
        shortcut = false;
        shortcut_toggle.textContent = "Shortcut Toggle(Disabled)";
        toastr.warning("ショートカットキーを無効にしました");
    } else if(shortcut === false) {
        shortcut = true;
        shortcut_toggle.textContent = "Shortcut Toggle(Enabled)";
        toastr.success("ショートカットキーを有効にしました");
    }
}

function stop_movement(switch_boolean) {
    if(switch_boolean === true) {
        if(teams === true) {
            window.paperio2api.config.unitSpeed = 0;
        } else if(teams === false) {
            window.paper2.configs.paper2_classic.unitSpeed = 0;
        }
        stopMove = true;
        stop_move_toggle.textContent = "Stop Movement(Enabled)";
        toastr.success("StopMovementを有効にしました");
    } else if(switch_boolean === false) {
        if(teams === true) {
            window.paperio2api.config.unitSpeed = 90;
        } else if(teams === false) {
            window.paper2.configs.paper2_classic.unitSpeed = 90;
        }
        stopMove = false;
        stop_move_toggle.textContent = "Stop Movement(Disabled)";
        toastr.info("StopMovementを無効にしました");
    } else {
        window.location.reload(true);
    }
}

function fast_movement(switch_boolean) {
    if(switch_boolean === true) {
        if(teams === true) {
            window.paperio2api.config.unitSpeed = 140;
        } else if(teams === false) {
            window.paper2.configs.paper2_classic.unitSpeed = 140;
        }
        fastMove = true;
        fast_move_toggle.textContent = "Fast Movement(Enabled)";
        toastr.success("FastMovementを有効にしました");
    } else if(switch_boolean === false) {
        if(teams === true) {
            window.paperio2api.config.unitSpeed = 90;
        } else if(teams === false) {
            window.paper2.configs.paper2_classic.unitSpeed = 90;
        }
        fastMove = false;
        fast_move_toggle.textContent = "Fast Movement(Disabled)";
        toastr.info("FastMovementを無効にしました");
    }
}

function player_suicide() {
    if(teams === true) {
        window.paperio2api.game.gameOver(true);
    } else if(teams === false) {
        window.paper2.game.gameOver(true);
    }
    toastr.success("自殺しました");
}

function debug(switch_boolean) {
    if(switch_boolean === true) {
        if(teams === true) {
            window.paperio2api.game.debug = true;
            window.paperio2api.game.debugGraph = true;
        } else if(teams === false) {
            if(window.paper2.game.player === null) {
                toastr.error("Debugはプレイ中でないと起動できません");
                return
            }
            window.paper2.game.debug = true;
            window.paper2.game.debugGraph = true;
        }
        debugMode = true;
        debug_toggle.textContent = "Debug(Enabled)";
        toastr.success("Debugモードを有効にしました");
    } else if(switch_boolean === false) {
        if(teams === true) {
            window.paperio2api.game.debug = false;
            window.paperio2api.game.debugGraph = false;
        } else if(teams === false) {
            window.paper2.game.debug = false;
            window.paper2.game.debugGraph = false;
        }
        debugMode = false;
        debug_toggle.textContent = "Debug(Disabled)";
        toastr.info("Debugモードを有効にしました");
    }
}

function player_godmode(switch_boolean) {
    if(switch_boolean === true) {
        if(teams === true) {
            const player_id = window.paperio2api.game.player.id;
            window.paperio2api.game.kill2 = window.paperio2api.game.kill;
            window.paperio2api.game.kill = function(killed, killer, count) {
                if(killed.id === player_id) {
                    return
                } else if(killed.id === player_id && killer === undefined) {
                    return
                }
                window.paperio2api.game.kill2(killed, killer, count);
            }
        } else if(teams === false) {
            const player_name = window.paper2.game.player.name;
            window.paper2.game.kill2 = window.paper2.game.kill;
            window.paper2.game.kill = function(killed, killer, count) {
                if(killed.name === player_name) {
                    return
                } else if(killed.name === player_name && killer === undefined) {
                    return
                }
                window.paper2.game.kill2(killed, killer, count);
            }
        }
        godmode = true;
        godmode_toggle.textContent = "Godmode(Enabled)";
        toastr.success("Godmodeを有効にしました");
    } else if(switch_boolean === false) {
        if(teams === true) {
            window.paperio2api.game.kill = window.paperio2api.game.kill2;
            window.paperio2api.game.kill2 = null;
        } else if(teams === false) {
            window.paper2.game.kill = window.paper2.game.kill2;
            window.paper2.game.kill2 = null;
        }
        godmode = false;
        godmode_toggle.textContent = "Godmode(Disabled)";
        toastr.info("Godmodeを無効にしました");
    }
}

function zoom_reset() {
    if(teams === true) {
        window.paperio2api.config.maxScale = 4.5;
    } else if(teams === false) {
        window.paper2.configs.paper2_classic.maxScale = 4.5;
    }
    toastr.success("拡大率をリセットしました");
}

stop_move_toggle.onclick = function() {
    if(stopMove === true) {
        stop_movement(false);
    } else if(stopMove === false) {
        if(fastMove === true) {
            toastr.error("FastMovementが有効な間はStopMovementを有効にできません");
            return
        }
        stop_movement(true);
    }
}

fast_move_toggle.onclick = function() {
    if(fastMove === true) {
        fast_movement(false);
    } else if(fastMove === false) {
        if(stopMove === true) {
            toastr.error("StopMovementが有効な間はFastMovementを有効にできません");
            return
        }
        fast_movement(true);
    }
}

suicide.onclick = function() {
    player_suicide();
}

debug_toggle.onclick = function() {
    if(debugMode === true) {
        debug(false);
    } else if(debugMode === false) {
        debug(true);
    }
}

godmode_toggle.onclick = function() {
    if(godmode === true) {
        player_godmode(false);
    } else if(godmode === false) {
        if(teams === true) {
            if(window.paperio2api.game.player === null) {
                toastr.error("ゲームを開始しないとGodmodeを有効にできません");
                return
            }
        } else if(teams === false) {
            if(window.paper2.game.player === null) {
                toastr.error("ゲームを開始しないとGodmodeを有効にできません");
                return
            }
        }
        player_godmode(true);
    }
}

reset_zoom.onclick = function() {
    zoom_reset();
}

window.addEventListener("keypress", function(event) {
    if(shortcut === false) {
        return
    }
    if(event.key === "e") {
        if(stopMove === true) {
            stop_movement(false);
        } else if(stopMove === false) {
            if(fastMove === true) {
                toastr.error("FastMovementが有効な間はStopMovementを有効にできません");
                return
            }
            stop_movement(true);
        }
    } else if(event.key === "g") {
        if(fastMove === true) {
            fast_movement(false);
        } else if(fastMove === false) {
            if(stopMove === true) {
                toastr.error("StopMovementが有効な間はFastMovementを有効にできません");
                return
            }
            fast_movement(true);
        }
    } else if(event.key === "r") {
        player_suicide();
    } else if(event.key === "t") {
        if(debugMode === false) {
            debug(true);
        } else if(debugMode === true) {
            debug(false);
        }
    } else if(event.key === "y") {
        if(godmode === true) {
            player_godmode(false);
        } else if(godmode === false) {
            if(teams === true) {
                if(window.paperio2api.game.player === null) {
                    toastr.error("ゲームを開始しないとGodmodeを有効にできません");
                    return
                }
            } else if(teams === false) {
                if(window.paper2.game.player === null) {
                    toastr.error("ゲームを開始しないとGodmodeを有効にできません");
                    return
                }
            }
            player_godmode(true);
        }
    } else if(event.key === "u") {
        zoom_reset();
    }
});

window.addEventListener("wheel", function(event) {
    if(teams === true) {
        if(event.deltaY > 0) {
            if(window.paperio2api.config.maxScale > 0.5) {
                window.paperio2api.config.maxScale -= 0.5;
            }
        } else if(event.deltaY < 0) {
            if(window.paperio2api.config.maxScale < 4.5) {
                window.paperio2api.config.maxScale += 0.5;
            }
        }
    } else if(teams === false) {
        if(event.deltaY > 0) {
            if(window.paper2.configs.paper2_classic.maxScale > 0.5) {
                window.paper2.configs.paper2_classic.maxScale -= 0.5;
            }
        } else if(event.deltaY < 0) {
            if(window.paper2.configs.paper2_classic.maxScale < 4.5) {
                window.paper2.configs.paper2_classic.maxScale += 0.5;
            }
        }
    }
});

toastr.success("Script Loaded");