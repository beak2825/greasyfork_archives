// ==UserScript== 
// @name theChive.com removal of modal overlays
// @namespace http://www.theChive.com/
// @description Remove the annoying overlays for not whitelisting the site for ads
// @include http*://*thechive.com/* 
// @version 0.2
// @downloadURL https://update.greasyfork.org/scripts/35774/theChivecom%20removal%20of%20modal%20overlays.user.js
// @updateURL https://update.greasyfork.org/scripts/35774/theChivecom%20removal%20of%20modal%20overlays.meta.js
// ==/UserScript==

jQuery('div.tp-modal').css('display','none');
jQuery('div.tp-backdrop').css('display','none');
jQuery('body.tp-modal-open').css('overflow','auto');
jQuery('div.preloaded_lightbox').remove();