// ==UserScript==
// @name         BitteWenden's Solar Crusaders Mod
// @version      0.1.3
// @description  Adds some functionality to the Solar Crusaders Alpha
// @author       @BitteWenden
// @match        http://www.solarcrusaders.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/18854
// @downloadURL https://update.greasyfork.org/scripts/13372/BitteWenden%27s%20Solar%20Crusaders%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/13372/BitteWenden%27s%20Solar%20Crusaders%20Mod.meta.js
// ==/UserScript==

var startupTimerFreq = 5000; // expressed in miliseconds
var gameInformation;
var overlay;
var shipsToModify;
alert("You're using a modified version of the game. Any bugs you encounter could be caused by the modification so please send a message to BitteWenden in the Solar Crusader forums if you encounter a mod caused bug. Feel free to contact me if you have any suggestions! Select some ships and press 'F' to open the mod menu.");

function setPlayable() {
    for (var ship of gameInformation.ships) {
        ship.isPlayer = true;
    }
}

function createInputs() {
    window.addEventListener('keydown', KeyCheck, true);
    overlay = document.createElement('div');
    overlay.innerHTML = '<div id="dialog"><h2 id="shipsToEditLabel">No Ships Selected!</h2><form><label for="shipColorChooser" >Set Ship Tint: </label><input id="shipColorChooser" type="color"></input></br><label for="shipScaleChooser" >Set Scale: </label><input placeholder="1" id="shipScaleChooser" type="number"></input></br><label for="engineGlowColorChooser" >Set Engine Glow Tint: </label><input placeholder="1" id="engineGlowColorChooser" type="color"></input></form></br><h3>Press Enter to Proceed or ESC to exit.</h3></div>';
    overlay.setAttribute('id', 'overlay');
    document.body.appendChild(overlay);
}

function init() {

    if (game.state.current == "sector") {
        clearInterval(startupTestInterval)
        gameInformation = getGameInformation();
        setPlayable();


        createInputs();
    }

}

function getGameInformation() {
    return {
        game: game,
        state: game.state.getCurrentState(),
        ships: game.state.getCurrentState().shipManager.shipsGroup.children,
    }
}

function KeyCheck(e) {
    if (overlay.style.visibility == "visible") {
        if (e.keyCode == 13) {

            var shipColorChooser = document.getElementById("shipColorChooser");
            var shipRgbColorObj = hexToRgb(shipColorChooser.value);

            var engineColorChooser = document.getElementById("engineGlowColorChooser");
            var engineRgbColorObj = hexToRgb(engineColorChooser.value);

            var shipRgbColor = rgbToFullRgb(shipRgbColorObj);
            var engineRgbColor = rgbToFullRgb(engineRgbColorObj);
            var scaleChooser = document.getElementById("shipScaleChooser");
            var scale = scaleChooser.value;
            if (scale == 0) {
                scale = 0.1;
            }
            for (var ship of shipsToModify) {
                ship.tint = shipRgbColor;
                for (var engineCoreGlow of ship.engineCore.glows) {
                    engineCoreGlow.tint = engineRgbColor;
                }
                ship.scale.x = scale,
                    ship.scale.y = scale;
            }
            overlay.style.visibility = "hidden";
        }

        if (e.keyCode == 27) {

            overlay.style.visibility = "hidden";
        }
    } else if (e.keyCode == 70) {
        if (overlay != undefined) {
            overlay.style.visibility = "visible";
            shipsToModify = [];
            for (var ship of gameInformation.ships) {
                if (ship.selected == true)
                    shipsToModify.push(ship);
            }
            if (shipsToModify.length != 0) {
                var labelString = "Selected: ";
                var first = true;
                for (var ship of shipsToModify) {
                    if (first == true) {
                        first = false;
                    } else {
                        labelString += ",";
                    }
                    if (ship.name)
                        labelString += ship.name;


                }
                var label = document.getElementById("shipsToEditLabel");
                label.innerHTML = labelString;
                console.log("Selected:" + labelString);
            }
        }
    }
    else if(e.keyCode == 77) {
        gameInformation.state.createShips();
        
    }
    else if(e.keyCode == 78) {
        setPlayable();
    }
}

var startupTestInterval = setInterval(function() {
    init()
}, startupTimerFreq);



GM_addStyle(multilineStr(function() {
    /*!
        #overlay {
         visibility: hidden;
         position: absolute;
         left: 0px;
         top: 0px;
         width:100%;
         height:100%;
         text-align:center;
         z-index: 1000;
         }
         
         #dialog {
         width: 30vw;
         height: 40vh;
         background-color: rgba(255, 165, 0, 0.8);
         margin-left: auto;
        margin-right: auto;
        margin-top:10vh;
         }
         #shipsToEditLabel {
         height: 2em;
         width: 100%;
         text-overflow: ellipsis;
         overflow: hidden;
         white-space: nowrap;
         color:black;
         }
         
         label{
         color:black;
         }
         h3{
         color:black;
         }
    */
}));

function multilineStr(dummyFunc) {
    var str = dummyFunc.toString();
    str = str.replace(/^[^\/]+\/\*!?/, '') // Strip function () { /*!
        .replace(/\s*\*\/\s*\}\s*$/, '') // Strip */ }
        .replace(/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
    ;
    return str;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToFullRgb(rgbColorObj) {

    var r = rgbColorObj.r.toString();
    if (rgbColorObj.r < 100) {
        var r = "0" + r;
        console.log(r);
        if (rgbColorObj.r < 10) {
            var r = "0" + r;
        }
    }
    var g = rgbColorObj.g.toString();
    if (rgbColorObj.g < 100) {
        g = "0" + g;
        console.log(g);
        if (rgbColorObj.g < 10) {
            var g = "0" + g;
        }
    }
    var b = rgbColorObj.b.toString();
    if (rgbColorObj.b < 100) {
        b = "0" + b;
        if (rgbColorObj.b < 10) {
            var b = "0" + b;
        }
    }
    return r + g + b;
}