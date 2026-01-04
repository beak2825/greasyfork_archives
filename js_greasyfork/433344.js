// ==UserScript==
// @name         Unlock Brainly
// @namespace    Unlock Brainly
// @version      3.2
// @description  Remove o bloqueio do brainly.
// @author       Ricardo Franco
// @match        https://*.brainly.com.br/*
// @icon         data:image/png;base64,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
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433344/Unlock%20Brainly.user.js
// @updateURL https://update.greasyfork.org/scripts/433344/Unlock%20Brainly.meta.js
// ==/UserScript==

//o metodo é bem simples: limpa todos os dados e apaga algumas areas da pagina pra evitar o aviso de que o usuario não é premium + anuncios no meio da questão.


//cosnt for block intrusive ads
const ads=['brn-bottom-toplayer__container js-ads-bottom-offset-element brn-bottom-toplayer__container--no-padding',
           'sg-toplayer__wrapper',
           'sg-space-ignore',
           'brn-cookie-policy-wrapper js-brn-cookie-policy-wrapper js-ads-bottom-offset-element',
           'brn-qpage-layout__right-top',
           'sg-toplayer sg-toplayer--modal sg-toplayer--medium OfferModal__toplayer--2qcUl',
           'brn-qpage-next-banner',
           'brn-brainly-plus-box BrainlyPlusBoxSearchUnlogged__boxFullWidth--1O-vq',
           'sg-overlay',
           'sg-overlay sg-overlay--dark',
           'brn-brainly-plus-box BrainlyPlusBoxSearchUnlogged__boxFullWidth--1O-vq',
           'sg-box--padding-m.sg-box--mint-secondary-light.sg-box',
           'brn-ads-box brn-ads-sticky-wrapper',
           'sg-box sg-box--mint-secondary-light sg-box--padding-m',
           'sg-toplayer sg-toplayer--modal sg-toplayer--medium OfferModal__toplayer--2qcUl',
           'sg-overlay',
           'sg-space-ignore'
];

//clear local storage from brainly
localStorage.clear();

//Remove banner and other ads just in /tarefa page
let pathName = window.location.pathname;
if (pathName.startsWith('/tarefa')) {
    const adBanPlus = document.getElementsByClassName('js-react-bottom-banner')[0];
    if (adBanPlus){
      adBanPlus.parentNode.removeChild(adBanPlus);
    }
    for (let obj in ads){
        let adsBlock = document.getElementsByClassName(ads[obj])[0];
        if (adsBlock){
            adsBlock.parentNode.removeChild(adsBlock);
        }
    }

    setTimeout(function(){
        let adsBanner = ['sg-overlay sg-overlay--dark',
                         'sg-toplayer__wrapper',
                         'sg-overlay',
                         'sg-space-ignore'
                        ];
        for (let obj in adsBanner){
            let adsBlock = document.getElementsByClassName(adsBanner[obj])[0];
            if (adsBlock){
                adsBlock.parentNode.removeChild(adsBlock);
            }
        }
    }, 10000);
}

let pathNameAsk = window.location.pathname;
if (pathNameAsk.startsWith('/app')) {
    let adsBanAsk = document.getElementsByClassName('sg-flex sg-flex--column')[0];
    if (adsBanAsk){
      adsBanAsk.parentNode.removeChild(adsBanAsk);
    }
    adsBanAsk = document.getElementsByClassName('brn-cookie-policy-wrapper js-brn-cookie-policy-wrapper js-ads-bottom-offset-element')[0];
    if (adsBanAsk){
      adsBanAsk.parentNode.removeChild(adsBanAsk);
    }
}