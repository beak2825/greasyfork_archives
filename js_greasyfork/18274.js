// ==UserScript==
// @name         TF2Outpost: Simpler
// @namespace    http://www.tf2outpost.com
// @version      0.1.3
// @description  Fix up Outpost. TF2Outpost/CSGOutpost / Dota2Outpost is just used for trading. No need for those ridiculous widgets on the side; ought to shappen up a bit as well.
// @author       Mengh facepalms.
// @include      /^http?://.*\.?tf2outpost\.com/.*$/
// @include      /^http?://.*\.?csgoutpost\.com/.*$/
// @include      /^http?://.*\.?dotaoutpost\.com/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18274/TF2Outpost%3A%20Simpler.user.js
// @updateURL https://update.greasyfork.org/scripts/18274/TF2Outpost%3A%20Simpler.meta.js
// ==/UserScript==
function removeSideWidget(document) {
        $('.sidebar').remove()
};

function removeTopAd (document) {
    $('.widget-aphex-main').remove();
};

function movePageUp (document) {
    $('body').css('padding ','0px 0 0 80px');
};

function squeezeItems (document) {
    $('.item').css('width','72px');
};

removeSideWidget();
removeTopAd();
movePageUp();
squeezeItems();