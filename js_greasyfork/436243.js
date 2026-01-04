// ==UserScript==
// @name         diep.io key functions
// @version      47.2.1
// @description  Bounds keys do stuff
// @author       delta-1
// @match        *://*.diep.io/*
// @grant        none
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/436243/diepio%20key%20functions.user.js
// @updateURL https://update.greasyfork.org/scripts/436243/diepio%20key%20functions.meta.js
// ==/UserScript==




(function() {
    document.body.onkeyup=function(e){

		//Build keys
		//Go to http://keycode.info/ if you want to reassign keys and then change the number after "e.keyCode==="

        //01277727 = "z key"
        if(e.keyCode===90){
            input.execute("game_stats_build 565656565656564848484848484877332");
        }

        //57700077 = "x key"
        if(e.keyCode===88){
            input.execute("game_stats_build 232323888238238238238117777777111");
        }

        //07776600 = 
        if(e.keyCode===70){
            input.execute("game_stats_build 565656565656444444432323232323232");
        }
        
         //reset build = "0 key"
        if(e.keyCode===48){
            input.execute("game_stats_build 0");
        }

        //00077676 = "G key"
        if(e.keyCode===71){
            input.execute("game_stats_build 565656565656547474747474774888888");
        }
		//Themes bellow. 

        //La Faucheuse theme = "v key"
        if(e.keyCode===86){
            input.set_convar("ren_minimap_viewport", true);
            input.set_convar("ren_background_color", 0xC8C661);
            input.set_convar("ren_pattern_grid", false);
            input.set_convar("ren_grid_base_alpha", 0.3);
            input.set_convar("ren_stroke_soft_color_intensity", 1);
            input.execute("net_replace_color 1 0xBCDED2");
            input.execute("net_replace_color 2 0x0E99EE");
            input.execute("net_replace_color 10 0x0BC9E1");
            input.execute("net_replace_color 9 0xF6181B");
            input.execute("net_replace_color 8 0xE3C816");
            input.execute("net_replace_color 11 0xA881C2");
            input.execute("net_replace_color 15 0xF71022");
            input.execute("net_replace_color 16 0xEBE776");
            input.execute("net_replace_color 14 0xBCB28F");
            input.execute("net_replace_color 3 0x0E99EE");
            input.execute("net_replace_color 4 0xF71022");
            input.execute("net_replace_color 5 0xC03998");
            input.execute("net_replace_color 6 0x9FFA03");
            input.execute("net_replace_color 101 0x999999");
             input.set_convar(`ren_raw_health_values`, true);
             input.execute("ren_fps true");           
            setInterval(function(){input.keyDown(76);},150);
        }
        //b key
        if(e.keyCode===66){
       input.execute("net_replace_color 0 0x777777");
       input.execute("net_replace_color 1 0x898989");
       input.execute("net_replace_color 2 0x008db1");
       input.execute("net_replace_color 3 0x008db1");
       input.execute("net_replace_color 4 0xc23f43");
       input.execute("net_replace_color 5 0x9865c4");
       input.execute("net_replace_color 6 0x00aa4b");
       input.execute("net_replace_color 8 0xB8860B");
       input.execute("net_replace_color 9 0xa53c2c");
       input.execute("net_replace_color 10 0x105773");
       input.execute("net_replace_color 11 0xcc5fb0");
       input.execute("net_replace_color 12 0xccb954");
       input.execute("net_replace_color 13 0x2fb270");
       input.execute("net_replace_color 14 0x212121");
       input.execute("net_replace_color 15 0xc23f43");
       input.execute("net_replace_color 16 0xb48c56");
       input.set_convar("ren_background_color", 0x999999);
       input.execute("ren_solid_background true");
       input.execute("ren_minimap_viewport true");
       input.execute("ren_border_color_alpha 1");
       input.execute("ren_health_fill_color 0x20FFEF");
       input.execute("ren_health_background_color 0x000000");
       input.set_convar(`ren_raw_health_values`, true);
       input.execute("ren_fps true");
        }
    };
})();



//predator stack


document.addEventListener("keydown", function(zEvent) {
    if ( zEvent.code === "KeyN") {
        function fire(t, w) {
            setTimeout(function() {
                input.keyDown(32);
            }, t * 1000);
            setTimeout(function() {
                input.keyUp(32);
            }, t * 1000 + w);
        }
        fire(0, 100);
        fire(0.75, 200);
        fire(1.5, 750);
        setTimeout(function() {
            input.keyDown(69);
        }, 2000);
    }
});

//stuff stack
document.addEventListener("keydown", function(zEvent) {
    if ( zEvent.code === "KeyP") {
        function fire(t, w) {
            setTimeout(function() {
                input.keyDown(32);
            }, t * 1000);
            setTimeout(function() {
                input.keyUp(32);
            }, t * 1000 + w);
        }
        fire(0, 100);
        setTimeout(function() {
            input.keyDown(69);
        }, 200);
    }
}); 




 


'use strict';
const HTML = `
<table style="width:100%">
  <tr>
    <td><b>So uh.......</b></td>
    <td><b>If you frogot the commands here they are: <br>
click z for overlord build <br>
x for ram build <br>
f anti ram build <br>
0 to reset your build <br>
g for glass build <br>
v for cool theme <br>
b for other cool theme <br>
n predator stack (7 reload) <br>
p stack for (twin,booster,gunner,octo,and more!) 7 reload! <br>
and... esc for menu <br>
<tr>
    <td>Ssp build for booster/fighter</td>
    <td><button onclick='input.execute("game_stats_build 565656565656567878787878787833322")'>Apply</button></td>
  </tr>
  <tr>
    <td>anti ram for hybrid/anni 1/7/7/4/7/7/0</td>
    <td><button onclick='input.execute("game_stats_build 565656565656564444232323232323231")'>Apply</button></td>
  </tr>

    <tr>
    <td>Reset build button(again more convenient)</td>
    <td><button onclick='input.execute("game_stats_build 0")'>Apply</button></td>
  </tr>
  
  <tr>
   <img src="https://share.sketchpad.app/21/45b-afe5-45d32e.png" alt="diep cool pic". style="width:200px;height:100px;"> <br>
  if you understand you do if you dont... <a href="https://www.reddit.com/r/Diepio/comments/ot9rl3/fighter_plush/" target="_blank">Click here</a> 
  </tr>
  
</table>
    `
const styles = `
div#dt-menu > table, th, td {
  border: 1px solid green;
  padding-left:10px;
  padding-right:10px;
  border-collapse: collapse;
  overflow-y:auto;
  word-wrap:break-all;
}
div#dt-menu > button {
    font-family: inherit;
    font-size: 1em;
}

`
const menuStyles = {
    position: "absolute",
    top: "25%",
    width:"50vw",
    height:"60vh",
    left: "25%",
    display: "none",
    "background-color": "rgba(0, 80, 89, 1)",
    "font-family":'"Montserrat","Verdana"'
}
// <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
const menu = document.createElement("div")
for (var prop in menuStyles) {
    menu.style[prop] = menuStyles[prop]
}
menu.innerHTML = HTML
menu.id = "dt-menu"
const styleElement = document.createElement("style")
const font = document.createElement("link")
font.rel = "stylesheet"
font.href = "https://fonts.googleapis.com/css?family=Montserrat"
styleElement.innerHTML = styles
document.head.appendChild(styleElement)
document.head.appendChild(font)
document.body.appendChild(menu)
const myEvent = function(event) {
switch (event.key) {
    case "Escape":
        if (menu.style.display == "none") {
            menu.style.display = "block"
            console.log("Menu Enabled!")
        }
        else {
            menu.style.display = "none"
            console.log("Menu Disabled!")
        }
        break

    }
}
window.addEventListener("keydown",myEvent)
console.log("Key functions loaded!")


//diff colored names
   
CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
    apply(reference, _this, args) {
        if (_this.fillStyle == "#ffff90") {
            _this.fillStyle = "#03fcfc";
        }
        return reference.apply(_this, args);
    }
});
//afk 
//not by me 
//not finished
////<tr>
    //<td>Afk</td>
    //<td><button onclick="afk()">Apply</button></td>
 // </tr>
function Afk() {
 
 
    
}



 //shows latency
(function() {
	var isActive = true;
 
	function f(e){
		if (!isActive) return;
		var a = new KeyboardEvent("keydown", {
			bubbles: true,
			cancelable: true,
			shiftKey: false
		});
		delete a.keyCode;
		Object.defineProperty(a, "keyCode", {
			"value": 76
		});
		dispatchEvent(a);
	}
	function a(e) {
		addEventListener(e, f);
	}
 
	for (var i of ["focus", "blur", "keyup"]) {
		a(i);
	}
 
	addEventListener("keydown", function(e) {
		if (e.keyCode == 76 && e.isTrusted) {
			isActive ^= true;
		}
	});
}());
console.log("%c Keycode", "color: #B9E87E; font-size: 1.4em;");
console.log("%c Developed By Delta-1", "color: #8ABC3F; font-size: 1.1em;");
