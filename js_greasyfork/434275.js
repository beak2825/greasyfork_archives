// ==UserScript==
// @name         IXL Time Farmer
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Farm time on IXL since it's utter bs. ;)
// @author       Chase Davis
// @match        https://www.ixl.com/*/*/*
// @icon         https://www.google.com/s2/favicons?domain=ixl.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/434275/IXL%20Time%20Farmer.user.js
// @updateURL https://update.greasyfork.org/scripts/434275/IXL%20Time%20Farmer.meta.js
// ==/UserScript==

(function() {
    'use strict';

let ClickDelay = 100000 // 100,000ms = 1.5mins
let clicks = 0
var i;
var kill;

jQuery(function($) {

setInterval(fill, ClickDelay);
alert('Farming started, a toggle button is coming soon. ;)\n\nYou may now switch to a different tab.')

/*function toggle() {

  if (event.currentTarget.checked) {

    alert('Now Farming, uncheck to stop.');
    let kill = setInterval(fill, ClickDelay);

  } else {

    alert('Farming Stopped.');
    clearInterval(kill);

  };

};


$('.box-site-nav-func').append(`
<div id="checkbox-wrapper" style="position: relative; margin: 3px; padding: 3px; width: fit-content; height: fit-content; top: 30%; left: 30%;">
    Farm Time <input id="farm?" type="checkbox" onClick="`+toggle()+`"></input>
</div>
`)*/




function fill() {

    try{
        $('.fillIn')[0].value = Math.round(Math.random()*1000);
        document.getElementsByClassName('crisp-button')[2].click();
        document.getElementsByClassName('got-it-top')[0].click();
    }catch(err){
        document.getElementsByClassName('crisp-button')[2].click();
        document.getElementsByClassName('crisp-button-cancel')[0].click();
        document.getElementsByClassName('got-it-top')[0].click();
    };

    clicks = clicks + 1
    console.log('Clicked '+clicks+' times')

}



});
})();