// ==UserScript==
// @name         Auto Disable Animations on Prolific
// @namespace    mailto:trace.heritage@mail.com
// @version      0.1
// @description  Immediately and automatically hide animations on the prolific studies page.
// @author       LauraIsBestFox!
// @include      https://*.prolific.co/*
// @downloadURL https://update.greasyfork.org/scripts/426395/Auto%20Disable%20Animations%20on%20Prolific.user.js
// @updateURL https://update.greasyfork.org/scripts/426395/Auto%20Disable%20Animations%20on%20Prolific.meta.js
// ==/UserScript==

(function() {
    //check to see if there's an animation on page, disable if there is
    var checkAnimation = setInterval(function() {
        try{
            var toggle_animation = document.getElementsByClassName("toggle-animation")[0];

            if(typeof(toggle_animation) != 'undefined' && toggle_animation != null){
                if(toggle_animation.innerText.match("Disable animation")){
                    toggle_animation.click();
                } else if (toggle_animation.innerText.match("Enable animation")){
                    toggle_animation.innerText = "";
                    clearInterval(checkAnimation);
                }
            }
        }
        catch(err) {
        }
    }, 10);
})();