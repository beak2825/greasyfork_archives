// ==UserScript==
// @name         closeBanner
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  try to take over the world!
// @author       anonym
// @grant        none
// @include        https://alpha.e-sim.org/battle.html?id=*
// @include        https://primera.e-sim.org/battle.html?id=*
// @downloadURL https://update.greasyfork.org/scripts/393219/closeBanner.user.js
// @updateURL https://update.greasyfork.org/scripts/393219/closeBanner.meta.js
// ==/UserScript==
const closeBanners = () => {
    const banners = document.querySelectorAll('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable.ui-dialog-buttons');

    const closeBanner = (banner) => {
    const observer = new MutationObserver(mutationRecords => {
    const display = mutationRecords[0].target.style.display;
        if(display === 'block') {
        const btnYes = banner.querySelectorAll('.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only')[0];
    const event = new Event('click');
    console.log('banner');
    btnYes.dispatchEvent(event);
        }
 
});

  observer.observe(banner, {
  attributes: true
});

};
    let i;
    if(document.URL.indexOf('primera') > 0){
        i = 0;
    } else {
       i = 1;
    }

    for(i; i< banners.length; i++) {
        closeBanner(banners[i]);
    }
}

let script = document.createElement('script');
	script.textContent = '(' + closeBanners + ')(jQuery, window);';
	document.body.appendChild(script);