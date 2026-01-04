// ==UserScript==
// @name         Big Jitsi Controls
// @namespace    https://greasyfork.org/en/users/922168-mark-zinzow
// @version      0.4
// @description  Magnify & Highlight Jit.si & 8x8 Meeting controls to help the visually impaired
// @author       Mark Zinzow
// @match        https://meet.jit.si/*
// @match        https://8x8.vc/*
// @match        https://meet.*.space/*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/zhdewxpctuazcm6e6chymibnn6y1
// @homepage     https://greasyfork.org/en/scripts/446014-big-jitsi-controls/feedback
// @license MIT
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/446014/Big%20Jitsi%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/446014/Big%20Jitsi%20Controls.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

let DEBUG =0;
setTimeout(makebig, 1000); //Wait to makes sure page js finished first
//Looking for clicks anywhere in the document almost solved the problem of not finding exactly which to watch
//https://gomakethings.com/listening-for-click-events-with-vanilla-javascript/

document.addEventListener('click', function (event) {
	if (DEBUG) console.log(event.target); // Log the clicked element in the console to see elements clicked
    setTimeout(makebig, 100); // restore the big icons after they change on click
});

//Bonus feature, remove that dang install Chrome extension nag element!
// using Kill Sticky bookmarklet code from https://github.com/t-mart/kill-sticky
/*    document.querySelectorAll('body *').forEach(function(node) {
        if (['fixed', 'sticky'].includes(getComputedStyle(node).position)) {
            node.parentNode.removeChild(node);
        }
    });
 Not used as the don't show me again box seems to work now...
*/

function makebig() {
let ctrlsvgs = document.querySelectorAll("svg[height='22']"); //bottom row
for (let i = 0; i < ctrlsvgs.length; i++) {
  ctrlsvgs[i].style.height=66;
  ctrlsvgs[i].style.width=66;
  ctrlsvgs[i].style.fill="#FFF01F"; //Neon Yellow
  ctrlsvgs[i].style.backgroundColor = "black";
  ctrlsvgs[i].addEventListener("click",makebig);
}
let tinysvgs = document.querySelectorAll("svg[height='9']");
for (let i = 0; i < tinysvgs.length; i++) {
  tinysvgs[i].style.height=18;
  tinysvgs[i].style.width=18;
  tinysvgs[i].style.fill="#39FF14"; //Neon Green
  tinysvgs[i].addEventListener("click",makebig);
  }
}
// When the mic or video buttons are toggled, they revert to small size
// Sometimes the mic icon reverts to small shortly after page load.  Not sure why so redo a few times to catch
// Unmuting cameras seems to also revert the camera icon, so give kludge an hour to fix
for (let i = 0; i < 1800 ; i++) { //1800 keeps altering the icons every 2 seconds for an hour
setTimeout(makebig, i*2000);
}

