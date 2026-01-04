// ==UserScript==
// @name         MTurk Submit Orange Button
// @namespace    https://www.mturkcrowd.com/members/aveline.7/
// @version      1.2
// @description  Grave/tilde key to submit HITs. Works with newer HIT templates that use the orange submit buttons.
// @author       YUVARAJA COPY
// @icon         https://i.imgur.com/jsju8Wy.png
// @include      /^https://(www\.mturkcontent|s3\.amazonaws)\.com/
// @downloadURL https://update.greasyfork.org/scripts/387215/MTurk%20Submit%20Orange%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/387215/MTurk%20Submit%20Orange%20Button.meta.js
// ==/UserScript==

let crowd;

setTimeout(function(){
    crowd = document.querySelector(`crowd-button[form-action="submit"]`) || document.querySelector(`crowd-classifier`) || document.querySelector(`crowd-image-classifier`) || document.querySelector(`crowd-bounding-box`) || document.querySelector(`crowd-keypoint`) || document.querySelector(`crowd-polygon`) || document.querySelector(`crowd-instance-segmentation`) || document.querySelector(`crowd-semantic-segmentation`);
},500);

document.addEventListener("keydown", function(e){
    if (e.keyCode == 192){ // `
        if (crowd){
            e.preventDefault();
            crowd.shadowRoot.querySelector(`[type="submit"]`).click();
        } else {
            e.preventDefault();
            document.querySelector(`[type='submit']`).click();
        }
    }
});