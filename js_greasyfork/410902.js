// ==UserScript==
// @name         Mturk Compare Image MMSP
// @namespace    https://github.com/rrockwel
// @version      0.2
// @description  Allow Selection of right or left image with "a" and "d" keys, as well as autoclick "submit" after last picture is chosen.
// @author       Richard Rockwell
// @match        https://worker.mturk.com/projects/30L3LKLDIOU8DWS8TAS8WR6UX4NSKX/tasks/*
// @include      https://www.mturkcontent.com/dynamic/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @contributionURL  https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=richardtylerrockwell@gmail.com&item_name=Greasy+Fork+donation
// @downloadURL https://update.greasyfork.org/scripts/410902/Mturk%20Compare%20Image%20MMSP.user.js
// @updateURL https://update.greasyfork.org/scripts/410902/Mturk%20Compare%20Image%20MMSP.meta.js
// ==/UserScript==


let $ = window.jQuery;

document.addEventListener('keypress', keyDetect);

// Detect Keypress
function keyDetect(e){
    if(e.which===97){
        console.log('a clicked');
      let left = document.querySelector('.leftBtn');
        console.log(left);
      left.click();
        console.log('left clicked');
    }
    if(e.which===100){
      let right = document.querySelector('.rightBtn');
      right.click();
    }

    // Autosubmit If Submit Button Exists
    let submit = document.querySelector('input[type=submit]');
    if(submit){
      submit.click();
    }
}


