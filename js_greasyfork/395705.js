// ==UserScript==
// @name         Moving touch buttons in tetr.js
// @namespace    http://tampermonkey.net/
// @version      0.6.6
// @author       Oki
// @description  title
// @match        http://farter.cn/tetr.js/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395705/Moving%20touch%20buttons%20in%20tetrjs.user.js
// @updateURL https://update.greasyfork.org/scripts/395705/Moving%20touch%20buttons%20in%20tetrjs.meta.js
// ==/UserScript==

(function() {

    window.addEventListener('load', function(){



if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}

function onTouchPressed() {
    //execute stuff after placing block
    setInterval(x=>{touchLeft.style.height = "1.5in";touchLeft.style.backgroundColor="red"},3000)
}

var placeBlockFunc = window.touchButtonsLayout.toString()
placeBlockFunc =  trim(onTouchPressed.toString()) + trim(placeBlockFunc)
window.touchButtonsLayout = new Function(placeBlockFunc);


"Hold0RotLeft0Down0Left0Right0RotRight0Drop".split(0).map(x=>{u=document.getElementById("touch"+x);u.style.paddingBottom="100px";u.style.backgroundColor="red";u.style.marginTop="-3in";console.log(u)})



    });
})();