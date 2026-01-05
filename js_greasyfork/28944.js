// ==UserScript==
// @name         Gota.io Istant Merge Script
// @namespace    Pretty Good Gota Script
// @description  E - 16 Split -|- Q - Triple Split -|- D - Double Split |- R - Pop Split |- Z - Douchebag Split
// @version      1.0
// @author       Editted By ItzRimz and daddy :D
// @match        http://gota.io/web/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28944/Gotaio%20Istant%20Merge%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/28944/Gotaio%20Istant%20Merge%20Script.meta.js
// ==/UserScript==

function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}

//Border Removal
document.getElementById("leaderboard-panel").style.borderRadius = "0";
document.getElementById("leaderboard-panel").style.borderWidth = "0px";
document.getElementById("leaderboard-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("score-panel").style.borderRadius = "0";
document.getElementById("score-panel").style.borderWidth = "0px";
document.getElementById("score-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("minimap-panel").style.borderRadius = "0";
document.getElementById("minimap-panel").style.borderWidth = "0px";
document.getElementById("minimap-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("minimap-panel").style.marginBottom = "3px";
document.getElementById("party-panel").style.borderRadius = "0";
document.getElementById("party-panel").style.borderWidth = "0px";
document.getElementById("party-panel").style.boxShadow = "0px 0px 0px black";

//Panel Borders
GM_addStyle('* .main-panel {border: solid 3px rgba(99, 97, 95, 0.5)}');
GM_addStyle('* .main-panel {border-radius: 0px}');
GM_addStyle('* .main-panel {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.52)}');
GM_addStyle('* .gota-btn {border-radius: 15px}');
GM_addStyle('* .main-bottom-stats {border-radius: 5px}');
GM_addStyle('* #popup-party {border-radius: 0px}');
GM_addStyle('* #popup-party {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.25)}');
GM_addStyle('* #popup-login {border-radius: 0px}');
GM_addStyle('* #popup-login {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.25)}');
GM_addStyle('* .login-input {border-radius: 0px}');
GM_addStyle('* #chat-input {border-radius: 0 0 0px 0px}');
GM_addStyle('* .ui-pane {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.52)}');

//Custom Cursor
GM_addStyle ('* body {cursor: crosshair;}');

//Chat Size
GM_addStyle('* #chat-panel {width: 300px}');
GM_addStyle('* #chat-panel {height: 195px}');

//Social Media Buttons Removal
$(".main-bottom-links").replaceWith("");

//Instructions
var maincontent = document.getElementById("main-content");
  var version = document.createElement("div");
  version.innerHTML = 'E - 16 Split -|- Q - Triple Split -|- D - Double Split |- R - Pop Split ';
  version.id = 'instructions';
  maincontent.appendChild(version);
document.getElementById("instructions").style.textAlign = "center";
document.getElementById("instructions").style.fontSize = "12px";
document.getElementById("instructions").style.color = "white";

//Ad Remove
$("#main-rb").replaceWith("");
GM_addStyle ('* #main {left: 350px;}');

//Custom Cursor
GM_addStyle ('* body {cursor: crosshair;}');

//Double Split
(function() {
    var amount = 2;
    var duration = 5;

    var overwriting = function(evt) {
        if (evt.keyCode === 68) {
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32});
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

//Triple Split Macro
(function() {
    var amount = 3;
    var duration = 5;

    var overwriting = function(evt) {
        if (evt.keyCode === 81) {
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32});
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

//16 Split Macro
(function() {
    var amount = 4;
    var duration = 5; 

    var overwriting = function(evt) {
        if (evt.keyCode === 69) {
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32});
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

//Pop Split
(function() {
    var amount = 2;
    var duration = 120;

    var overwriting = function(evt) {
        if (evt.keyCode === 82) {
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32});
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

//Douchebag Split Macro
(function() {
    var amount = 6;
    var duration = 5; 

    var overwriting = function(evt) {
        if (evt.keyCode === 90) {
            for (var i = 0; i < amount; ++i) { //Splits :D
                setTimeout(function() {
                    window.onkeydown({keyCode: 32});
                    window.onkeyup({keyCode: 32});
				    ({keyCode: 87});
                    ({keyCode: 87});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();