// ==UserScript==
// @name         button for Vince_HD tetr.JS Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       ore100
// @description  21-06-21
// @match        http://farter.cn/t*
// @match        http*://*/tetr.js
// @match        */tetr.js*
// @match        https://doktorocelot.com/tetr.js/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428335/button%20for%20Vince_HD%20tetrJS%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/428335/button%20for%20Vince_HD%20tetrJS%20Enhanced.meta.js
// ==/UserScript==


(function() {
    window.addEventListener('load', function(){

document.getElementById("touchLeft").style.position = "absolute";
//* x：position*//
document.getElementById("touchDrop").style.marginLeft="122px";document.getElementById("touchRotRight").style.marginLeft="184px";document.getElementById("touchRotLeft").style.marginLeft="211px";document.getElementById("touchRight").style.marginLeft="-180px";document.getElementById("touchLeft").style.marginLeft="-57px";document.getElementById("touchDown").style.marginLeft="-119px";document.getElementById("touchHold").style.marginLeft="134px";document.getElementById("touchRot180").style.marginLeft="156px";
//* y：position*//
document.getElementById("touchDrop").style.marginTop="0px";document.getElementById("touchRotRight").style.marginTop="67px";document.getElementById("touchRotLeft").style.marginTop="67px";document.getElementById("touchRight").style.marginTop="0px";document.getElementById("touchLeft").style.marginTop="0px";document.getElementById("touchDown").style.marginTop="-67px";document.getElementById("touchHold").style.marginTop="-134px";document.getElementById("touchRot180").style.marginTop="60px";

//* width *//
document.getElementById("touchDrop").style.maxWidth="69px";document.getElementById("touchRotRight").style.maxWidth="69px";document.getElementById("touchRotLeft").style.maxWidth="69px";document.getElementById("touchRight").style.maxWidth="69px";document.getElementById("touchLeft").style.maxWidth="69px";document.getElementById("touchDown").style.maxWidth="69px";document.getElementById("touchHold").style.maxWidth="69px";document.getElementById("touchRot180").style.maxWidth="69px";
//* color *//
document.getElementById("touchDrop").style.backgroundColor="#66B3FF";document.getElementById("touchRotRight").style.backgroundColor="#66B3FF";document.getElementById("touchRotLeft").style.backgroundColor="#66B3FF";document.getElementById("touchRight").style.backgroundColor="#66B3FF";document.getElementById("touchLeft").style.backgroundColor="#66B3FF";document.getElementById("touchDown").style.backgroundColor="#66B3FF";document.getElementById("touchHold").style.backgroundColor="#66B3FF";document.getElementById("touchRot180").style.backgroundColor="#66B3FF";


//* length *//
//document.getElementById("touchDrop").style.paddingBottom="0px";document.getElementById("touchRotRight").style.paddingBottom="0px";document.getElementById("touchRotLeft").style.paddingBottom="0px";document.getElementById("touchRight").style.paddingBottom="0px";document.getElementById("touchLeft").style.paddingBottom="0px";document.getElementById("touchDown").style.paddingBottom="0px";document.getElementById("touchHold").style.paddingBottom="0px";document.getElementById("touchRot180").style.paddingBottom="0px";
});
})();
//width360 on pc chrome dev tool