// ==UserScript==
// @name        agar.io autoclicker
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description edit this to change or add keys
// @author      BZZZZ
// @include     /^https?\:\/\/(www\.)?agar\.io\/([?#]|$)/
// @version     0.2
// @grant       none
// @run-at      document-end
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/427838/agario%20autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/427838/agario%20autoclicker.meta.js
// ==/UserScript==

{
/*
key format: [X,Y] Hold X to autoclick Y. X and Y are "keyCode"s. http://keycode.info/
KEYS is array of keys.
INTERVAL is time between autoclicks in milliseconds.
*/
const KEYS=[
	[69,87],// Hold E to autoclick W.
	[90,32],// Hold Z to autoclick spacebar.
],INTERVAL=30;

const l=KEYS.length;
let n,code="var c={\"keyCode\":0},p=k=>{c.keyCode=k;window.dispatchEvent(new KeyboardEvent(\"keydown\",c));window.dispatchEvent(new KeyboardEvent(\"keyup\",c));}";
for(n=0;n<l;n++)code+=",k"+n+"=false";
code+=";window.addEventListener(\"keydown\",e=>{switch(e.keyCode){";
for(n=0;n<l;n++)code+="case "+KEYS[n][0]+":k"+n+"=true;return;";
code+="}},false);window.addEventListener(\"keyup\",e=>{switch(e.keyCode){";
for(n=0;n<l;n++)code+="case "+KEYS[n][0]+":k"+n+"=false;return;";
code+="}},false);window.setInterval(()=>{";
for(n=0;n<l;n++)code+="if(k"+n+")p("+KEYS[n][1]+");";
code+="},"+INTERVAL+");";
const a=document.createElement("div");
a.setAttribute("onclick",code);
a.click();
}
