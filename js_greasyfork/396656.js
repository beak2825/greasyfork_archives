// ==UserScript==
// @name         button for me tetr.JS Enhanced
// @namespace    http://tampermonkey.net/
// @version      2.7
// @author       ore100
// @description  21-06-21
// @include      */tetr.js*
// @match        http://farter*/t*
// @match        http*://*/tetr.js
// @match        https://doktorocelot.com/tetr.js/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396656/button%20for%20me%20tetrJS%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/396656/button%20for%20me%20tetrJS%20Enhanced.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function(){

//time.style.position = "absolute";time.style.left="1.4in";time.style.bottom="3in";time.style.transform="scale(2,2)";a.style.bottom="-70px";b.style.bottom="-1in";c.style.bottom="-0.8in";
//* color：The following *//
let button1 = [touchDrop, touchLeft, touchRight, touchDown, touchRotLeft, touchRotRight, touchHold, touchRot180];

button1.forEach(function(button2) {
button2.style.backgroundColor="#87cefa";
button2.style.opacity="0.3";
button2.style.border="3px solid #fff";
  console.log(button2);
});
//* x：position*//
document.getElementById("touchDrop").style.marginLeft="119px";document.getElementById("touchRotRight").style.marginLeft="113px";document.getElementById("touchRotLeft").style.marginLeft="141px";document.getElementById("touchRight").style.marginLeft="-181px";document.getElementById("touchLeft").style.marginLeft="-65px";document.getElementById("touchDown").style.marginLeft="98px";document.getElementById("touchHold").style.marginLeft="-150px";document.getElementById("touchRot180").style.marginLeft="-60px";
//* y：position*//
document.getElementById("touchDrop").style.marginTop="49px";document.getElementById("touchRotRight").style.marginTop="50px";document.getElementById("touchRotLeft").style.marginTop="40px";document.getElementById("touchRight").style.marginTop="-20px";document.getElementById("touchLeft").style.marginTop="-19px";document.getElementById("touchDown").style.marginTop="-89px";document.getElementById("touchHold").style.marginTop="-100px";document.getElementById("touchRot180").style.marginTop="-100px";
//* width *//
document.getElementById("touchDrop").style.maxWidth="76px";document.getElementById("touchRotRight").style.maxWidth="68px";document.getElementById("touchRotLeft").style.maxWidth="68px";document.getElementById("touchRight").style.maxWidth="68px";document.getElementById("touchLeft").style.maxWidth="76px";
//* length *//
document.getElementById("touchDrop").style.paddingBottom="22px";document.getElementById("touchRotRight").style.paddingBottom="22px";document.getElementById("touchRotLeft").style.paddingBottom="22px";document.getElementById("touchRight").style.paddingBottom="22px";document.getElementById("touchLeft").style.paddingBottom="22px";

});
})();
//width360 on pc chrome dev tool