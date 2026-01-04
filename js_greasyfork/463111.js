// ==UserScript==
// @author      loviuz
// @name        No Cookiewall Italia
// @namespace   https://este.linux.it
// @version     1.6.2
// @include     *://*
// @license     AGPL v3
// @description Permette di navigare siti web italiani di notizie evitando il cookiewall, il quale permette di accedere ai contenuti, già arrivati al browser, previa accettazione cookie o il pagamento di un abbonamento. Alcuni stabiliscono che questo comportamento dei siti non è lecito secondo il GDPR: in attesa di una pronuncia del garante della privacy propongo questo metodo per saltare questo blocco.
// @lang         it
// @downloadURL https://update.greasyfork.org/scripts/463111/No%20Cookiewall%20Italia.user.js
// @updateURL https://update.greasyfork.org/scripts/463111/No%20Cookiewall%20Italia.meta.js
// ==/UserScript==


var cookiewall_found = false;

var ci = setInterval( function(){
    // Identifica il tipo di cookiewall
    var is_iubenda = secureQuerySelector('#iubenda-cs-banner') || secureQuerySelector('#iubenda-cs-banner');
    var is_privacycpwall = secureQuerySelector('.wall-modal') || secureQuerySelector('.privacy-cp-wall');
    var is_onetrust_banner_sdk = secureQuerySelector('#onetrust-banner-sdk');
    var is_fov_consent = secureQuerySelector('#fov-consent');

    if (is_iubenda) {
        console.log('[No Cookiewall Italia] Iubenda detected');
        var cookiewall_desktop = secureQuerySelector('.prompt-to-accept');
        var cookiewall_mobile = secureQuerySelector('#iubenda-cs-banner');

        // Cookiewall desktop
        if (cookiewall_desktop) {
            cookiewall_desktop.style.display = 'none';
            secureQuerySelector('html').classList.remove('show-prompt-to-accept');
          	secureQuerySelector('.o-wrapper.iub--active').style.filter = 'none';
            cookiewall_found = true;
            console.log('[No Cookiewall Italia] Iubenda desktop removed');
        }
        
        // Cookiewall mobile
        if (cookiewall_mobile) {
            secureQuerySelector('#iubenda-cs-banner.iubenda-cs-visible').classList.remove('iubenda-cs-visible');
            cookiewall_mobile.setAttribute('style', 'display:none !important');
            secureQuerySelector('html').setAttribute('style', '');
          	secureQuerySelector('.o-wrapper.iub--active').style.blur = 'none';
            secureQuerySelector('.adv-slot').style.display = 'none';
            cookiewall_found = true;
            console.log('[No Cookiewall Italia] Iubenda mobile removed');
        }
    }

    if(is_privacycpwall){
        console.log('[No Cookiewall Italia] Privacy CPWall detected');
        var cookiewall_desktop = secureQuerySelector('.wall-modal');
        var cookiewall_mobile = secureQuerySelector('.privacy-cp-wall');

        // Cookiewall desktop
        if (cookiewall_desktop) {
            cookiewall_desktop.style.display = 'none';
            secureQuerySelector('.tp-backdrop').style.display = 'none';
            secureQuerySelector('body').classList.remove('tp-modal-open');
            cookiewall_found = true;
            console.log('[No Cookiewall Italia] Privacy CPWall desktop removed');
        }

        // Cookiewall mobile
        if (cookiewall_mobile) {
            cookiewall_mobile.style.display = 'none';
            secureQuerySelector('body').classList.remove('noScroll');
            cookiewall_found = true;
            console.log('[No Cookiewall Italia] Privacy CPWall mobile removed');
        }
    }

    if(is_onetrust_banner_sdk){
        console.log('[No Cookiewall Italia] Onetrust detected');
        var cookiewall = secureQuerySelector('#onetrust-banner-sdk');

        // Cookiewall
        if (cookiewall) {
            cookiewall.style.position = 'absolute';
            cookiewall.style.left = '-10000px';

            secureQuerySelector('.onetrust-pc-dark-filter').style.position = 'absolute';
            secureQuerySelector('.onetrust-pc-dark-filter').style.left = '-10000px';

            secureQuerySelector('body').setAttribute('style', '');
            cookiewall_found = true;
            console.log('[No Cookiewall Italia] Onetrust desktop/mobile removed');
        }
    }

    if(is_fov_consent) {
      console.log('[No Cookiewall Italia] FOV Consent detected');
      var cookiewall = secureQuerySelector('#fov-noconsent');

      if (cookiewall) {
        cookiewall.style.display = 'none';
        console.log('[No Cookiewall Italia] FOV Consent desktop/mobile removed');
      }
    }

    if (cookiewall_found) {
        clearInterval(ci);
    }
}, 1000 );


function secureQuerySelector(element){
  if (document.querySelector(element)) {
    return document.querySelector(element);
  }else{
    return generateElements('<div></div>');
  }
}

function generateElements(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.children[0];
}
