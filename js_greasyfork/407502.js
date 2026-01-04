// ==UserScript==
// @name flip diep.io
// @description press F to disable/enable flip, press G to change flip mode
// @version 1
// @author nimdac
// @match *://*.diep.io/*
// @grant none
// @namespace https://greasyfork.org/users/668919
// @downloadURL https://update.greasyfork.org/scripts/407502/flip%20diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/407502/flip%20diepio.meta.js
// ==/UserScript==

(() => {
  
  	let s = true, v = false;

  	for(let x of ["mousemove", "mousedown", "mouseup"]) document.addEventListener(x, e => e.isTrusted && c.dispatchEvent(new MouseEvent(x, e)));
  
  	document.addEventListener('contextmenu', e => e.preventDefault());
  	document.addEventListener("keydown", e => {
		e.code === "KeyF" && !(s ^= true) && body.appendChild(c2) && loop();
        e.code === "KeyG" && (v ^= true);
    });
  
 	let c = document.getElementById("canvas"),
        body = document.getElementsByTagName('body')[0],
    	c2 = document.createElement("canvas"), ctx2 = c2.getContext("2d");
  
    c2.width = c.width;
    c2.height = c.height;
  
    c2.style.position = "absolute";
    c2.style.top = "0px";
    c2.style.left = "0px";
    c2.style.zIndex = 3;
  
    window.addEventListener("resize", () => (c2.width = c.width) && (c2.height = c.height), false); 
  
	let loop = () => {
      
		if(s) return body.removeChild(c2);
      
		ctx2.clearRect(0,0,c2.width,c2.height);
        ctx2.setTransform(v? 1:-1, 0, 0, v? -1:1, v? 0:c2.width, v? c2.height:0);
        ctx2.drawImage(c,0,0);  
		requestAnimationFrame(loop);
          
	};
  
})();