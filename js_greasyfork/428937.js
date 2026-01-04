// ==UserScript==
// @name         Typing Tube 10key/sec CPU
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  10key/secで打つCPUに譜面を打たせます。
// @author       You
// @match        https://typing-tube.net/movie/show*
// @icon         https://www.google.com/s2/favicons?domain=typing-tube.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428937/Typing%20Tube%2010keysec%20CPU.user.js
// @updateURL https://update.greasyfork.org/scripts/428937/Typing%20Tube%2010keysec%20CPU.meta.js
// ==/UserScript==
setInterval(function(){if(next_char[0]){
if(Math.floor( Math.random() * 100 ) != 0){
document.dispatchEvent( new KeyboardEvent( "keydown",{key:next_char[1][0],keyCode:keycode[next_char[1][0].toUpperCase()]}))
}else{
document.dispatchEvent( new KeyboardEvent( "keydown",{key:"0"}))
}
}
},100)
var keycode =  new Object({A:65, B:66,C: 67,D: 68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P: 80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90});
