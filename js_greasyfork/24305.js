// ==UserScript==
// @name         Gota Script Voodo
// @namespace    Pretty Good Gota Script
// @description  E - 16 Split -|- Q - Triple Split -|- D - Double Split -|- A - Cell pause -|- ~ - turquoise Mode -|- F - Hide Pellets -|- N - Hide Names + More
// @version      5
// @author       Voodo
// @match        http://gota.io/web/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/24305/Gota%20Script%20Voodo.user.js
// @updateURL https://update.greasyfork.org/scripts/24305/Gota%20Script%20Voodo.meta.js
// ==/UserScript==

function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}

//Custom Font, Logo, Minimap, Viruses and Mothercells
spike.src = "http://i.imgur.com/8xi87Qg.png";
spike_mother.src = "http://i.imgur.com/VC0ChYD.png";
addStyleSheet('@import url(https://fonts.googleapis.com/css?family=Ubuntu);');
GM_addStyle('* #logo {background-image: url("http://i.imgur.com/l0QnU0E.png");}');
GM_addStyle('* #minimap-canvas {background-image: url("http://i.imgur.com/QMBgZaC.png");}');
GM_addStyle('*{font-family: Ubuntu;}');
GM_addStyle('* .coordinates {font-family: Ubuntu;}');
GM_addStyle('* #leaderboard-panel {font-size: 24px;}');

var fillTextz = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function(){
    var argumentz = arguments;
    if(this.canvas.id == 'leaderboard-canvas'){
    this.font = 'bold 15px Ubuntu';
    }
    if(this.canvas.id == 'minimap-canvas'){
    this.font = 'bold 15px Ubuntu';
    }
    if(this.canvas.id == 'party-canvas'){
    this.font = 'bold 15px Ubuntu';
    }
    fillTextz.apply(this, arguments);
};

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

//Chat Size
GM_addStyle('* #chat-panel {width: 350px}');
GM_addStyle('* #chat-panel {height: 240px}');

//Social Media Buttons Removal
$(".main-bottom-links").replaceWith("");

//Instructions
var maincontent = document.getElementById("main-content");
  var ffscversion = document.createElement("div");
  ffscversion.innerHTML = 'E - Tricksplit -|- Q - Triplesplit -|- D - Double split -|- A - Cell pause';
  ffscversion.id = 'instructions';
  maincontent.appendChild(ffscversion);
document.getElementById("instructions").style.textAlign = "center";
document.getElementById("instructions").style.fontSize = "12px";
document.getElementById("instructions").style.color = "white";

//LeaderBoard
var fz = "LƐAƊƐRƁOARƊ";

$(".lh").replaceWith(fz);

$("#main-rb").replaceWith("");
GM_addStyle ('* #main {left: 350px;}');

$("#btnforums").replaceWith("");
GM_addStyle ('* #main {left: 350px;}');

//Custom Cursor
GM_addStyle ('* body {cursor: crosshair;}');

//Line Split Macro(Cell pause)
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '65') {
    player.mouseRawX = canvas.width / 2;
    player.mouseRawY = canvas.height / 2;
    }
}

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

//Hide Food
document.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which;
        switch (key) {
            case 70:
                if (options.cHideFood === true) {
                    options.cHideFood = false;
} else {
   options.cHideFood = true;
}
        }
});
//Hide skins
document.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which;
        switch (key) {
            case 83:
                if (options.cHideSkins === true) {
                    options.cHideSkins = false;
} else {
   options.cHideSkins = true;
}
        }
});
//Hide names
document.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which;
        switch (key) {
            case 18:
                if (options.cHideNames === true) {
                    options.cHideNames = false;
} else {
   options.cHideNames = true;
}
        }
    });
//turquoise Mode
document.addEventListener('keydown', function(e) {
       var key = e.keyCode || e.which;
       switch (key) {
           case 192:
               if (player.rainbow === false) {
                   player.rainbow = true;
                   rainbowColors = ["#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9", "#00ffa9"];
} else {
  player.rainbow = false;
}
       }
   });
//Remove some of the code sections if you dislike them