// ==UserScript==
// @name         Jstris Stats Script
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  change the color of stats
// @author       jezevec10
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385661/Jstris%20Stats%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385661/Jstris%20Stats%20Script.meta.js
// ==/UserScript==

/**************************
  Jstris Stats Script         
**************************/

(function() {
    window.addEventListener('load', function(){

//default color is #808080 for both
colorhex_numbers = "#FFB600"
colorhex_text = "#B6FFAA"
colorhex_linesRemaining = "#C0FFEE"

colorhex_replay = "#FF0000"

if(typeof Game == "undefined"){
document.querySelectorAll("[id='stats']").forEach((stat) => {
  stat.style.color = colorhex_replay
})
}

sprintText.style.color = colorhex_linesRemaining
lrem.style.color = colorhex_linesRemaining

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)] : null
}

//canvas2d
var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}

var fastFont = FastFont2D['prototype']['draw'].toString()
var params = getParams(fastFont)
fastFont = trim(fastFont).split("=")
fastFont[2] = fastFont[2].split(";")
fastFont[2][0] = "'"+colorhex_numbers+"'"
fastFont[2] = fastFont[2].join(";")
fastFont = fastFont.join("=")

FastFont2D['prototype']['draw'] = new Function(...params, fastFont);

rgb = hexToRgb(colorhex_numbers)
oldcolor = "[128/ 255,128/ 255,128/ 255,1]"
newcolor = "["+rgb[0]+"/ 255, "+rgb[1]+" / 255, "+rgb[2]+" / 255, 1]"

//webgl
window.resetColor = true;

fastFont = FastFont['prototype']['draw'].toString()
params = getParams(fastFont)
fastFont = trim(fastFont).replace(oldcolor,newcolor)
fastFont = "if(resetColor){this['glParamsSet']=false;resetColor=0};" + fastFont

FastFont['prototype']['draw'] = new Function(...params, fastFont);

//changes the color of the texts
statLabels.style.color = colorhex_text
    });
})();
