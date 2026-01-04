// ==UserScript==
// @name         +ENVIAR - Menéame
// @namespace    http://tampermonkey.net/
// @version      2025-01-05.12
// @description  Envia fácilmente a Menéame.
// @author       Ergomnm
// @match        ://*/*
// @exclude      /^[^:/#?]*:\/\/([^#?/]*\.)?meneame\.net(:[0-9]{1,5})?\/.*$/
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/523001/%2BENVIAR%20-%20Men%C3%A9ame.user.js
// @updateURL https://update.greasyfork.org/scripts/523001/%2BENVIAR%20-%20Men%C3%A9ame.meta.js
// ==/UserScript==

 (function() {
'use strict';
let button = document.createElement('button');
button.innerText = 'ENVIAR';
button.style.position ='relative';
button.style.lineHeight= '16px';
button.style.left = '70px';
button.style.top = '-6px';
button.style.height = '20px';
button.style.transform = 'translateX(-50%)';
button.style.zIndex = '9999';
button.style.padding = '0px 7px 0px 15px';
button.style.background = 'linear-gradient(to top, #e35614, #fd6f00)';
button.style.color = '#ffffff';
button.style.border = 'none';
button.style.borderRadius = '10px';
button.style.border = '1px solid #ffd7b7';
button.style.borderBottom = '1px solid #feb48b';
button.style.cursor = 'pointer';
button.style.fontSize = '11px';
button.style.fontFamily = 'Open Sans';
button.style.fontWeight = 'bold';
button.style.boxShadow = '0px 2px 3px rgba(0, 0, 0, 0.1)';
button.classList.add('enviarmnm');
let eli = document.createElement('div');
eli.classList.add('Eli');
eli.textContent = 'Eli';
let mas = document.createElement('div');
mas.classList.add('Más');
mas.textContent = '+';
button.appendChild(eli);
button.appendChild(mas);
mas.style.color = '#ffffff';
mas.style.fontSize = '15px';
mas.style.position = 'absolute';
mas.style.left = '5px';
mas.style.top = '0px';
const mediaQueryMas = window.matchMedia("(max-width: 767px)");
if (mediaQueryMas.matches) {
mas.style.top = '1px';
}
mas.style.fontWeight = 'bolder';
eli.style.fontSize = '28px';
eli.style.width = '32px';
eli.style.height = '32px';
eli.style.left = '-30px';
eli.style.top = '-8px';
const mediaQueryEli = window.matchMedia("(max-width: 767px)");
if (mediaQueryEli.matches) {
eli.style.top = '-7.5px';
}
eli.style.overflow = 'visible';
eli.style.position = 'absolute';
eli.style.color = 'transparent';
eli.style.backgroundSize = '100%';
eli.style.backgroundPosition = '50% 50%';
eli.style.backgroundColor = 'rgba(0, 0, 0, 0)';
eli.style.backgroundRepeat = 'no-repeat';
eli.style.backgroundImage =
      'url("data:image/png;base64,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")';

document.querySelector("h1[class*=title],h2[class*=title],h3[class*=title],h2[class*=head],h1[class*=head],h1").appendChild(button);

const buttonR = document.getElementById('enviarmnm');

if (window.location.pathname !== '/') {
    button.style.display = 'inline !important';
} else {
    button.style.display = 'none';
}
button.addEventListener('click', function() {
let currentUrl = encodeURIComponent(window.location.href.split('?')[0]);
let currentTitle = encodeURIComponent(document.title);
let meneameUrl = `https://www.meneame.net/submit?url=${currentUrl}&title=${currentTitle}`;
window.open(meneameUrl, '_blank');
});
})();