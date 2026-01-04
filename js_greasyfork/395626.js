// ==UserScript==
// @name         Show garbage in invisible
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows normal and solid garbage in invisible mode
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395626/Show%20garbage%20in%20invisible.user.js
// @updateURL https://update.greasyfork.org/scripts/395626/Show%20garbage%20in%20invisible.meta.js
// ==/UserScript==

/**************************
  Show garbage in invisible
**************************/

(function() {
    window.addEventListener('load', function(){

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}

var types = [Ctx2DView['prototype']['redrawMatrix'].toString(), WebGLView['prototype']['redrawMatrix'].toString()]
drawnMino = types[0].substr(types[0].lastIndexOf("this"),types[0].substr(types[0].lastIndexOf("this")).indexOf(")"))
isInvisible = types[0].split("if(")[1].substr(0,types[0].split("if(")[1].indexOf(")"))
invisCondition = "if (!("+isInvisible+" && "+drawnMino+" < 8)) {"

for (var i = 0; i < types.length; i++) {
	types[i] = types[i].replace("return", "")
	types[i] = types[i].replace("++){this", "++){" + invisCondition + "this")
	types[i] += "}"
}

Ctx2DView['prototype']['redrawMatrix'] = new Function(trim(types[0]));
WebGLView['prototype']['redrawMatrix'] = new Function(trim(types[1]));

    });
})();