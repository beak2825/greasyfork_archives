// ==UserScript==
// @name         Goth Alert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Antidote against FAST-fashion. Bypass a list of fast-fashion brands's websites.
// @author       Fashionistawarness
// @license MIT
// @match https://www.zara.com/*
// @match https://www2.hm.com/*
// @match https://www.balenciaga.com/*
// @match https://www.uniqlo.com/*
// @match https://www.gap-france.fr/*
// @match https://www.forever21.com/*
// @match https://www.asos.com/*
// @match https://fr.shein.com/*
// @match https://www.stradivarius.com/*
// @match https://shop.mango.com/*
// @match https://www.zalando.fr/*
// @match https://www.prettylittlething.fr/*
// @match https://www.nike.com/*
// @match https://www.primark.com/*
// @match https://www.urbanoutfitters.com/*
// @match https://www.esprit.fr/*
// @match https://www.esprit.us/*
// @match https://www.missguided.co.uk/*
// @match https://fr.victoriassecret.com/*
// @match https://www.ripcurl.eu/*
// @match https://fr.zaful.com/*
// @match https://www.guess.eu/*
// @match https://www.hollisterco.com/*
// @match https://www.ae.com/*
// @match https://www.peacocktv.com/*
// @match https://www.massimodutti.com/*
// @match https://www.adidas.fr/*
// @match https://www.hottopic.com/*
// @match https://www.dior.com/*
// @match https://www.newlook.com/*
// @match https://www.fashionnova.com/*
// @match https://fr.benetton.com/*
// @match
// @match
// @match
// @match
// @match
// @match
// @match
// @match
// @match
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457382/Goth%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/457382/Goth%20Alert.meta.js
// ==/UserScript==
(function() {
    'use strict';
const div2 = document.createElement('div');
div2.innerHTML =`<a href='https://la.bonnebulle.xyz/younes_guilmot/page2.html'> <span id='bitch' style='
     background-image: url(https://la.bonnebulle.xyz/younes_guilmot/goth_mov2.gif);
    background-position: center;
    background-repeat: no-repeat;
    vertical-align: middle;
    color: rgb(60, 255, 0);
    width:100%;
    text-align: center;
    font-family: fantasy;
    font-size: 200px;
    position: fixed;
    z-index: 9999;
    display:block;
    block-size:100%;
    padding:auto;
    filter: blur(1px);'>Goth Alert</span> </a>`


document.body.insertAdjacentElement('afterbegin', div2);



})();