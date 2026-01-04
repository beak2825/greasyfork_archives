// ==UserScript==
// @name         fly Inc
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Bypass Familia Fly
// @author       keno venas
// @license      MIT
// @match        https://rshostinginfo.com/*
// @match        https://shoesonic.com/*
// @match        https://pluginmixer.com/*
// @match        https://edonmanor.com/*
// @match        https://boardgamechick.com/*
// @match        https://healthyfollicles.com/*
// @match        https://gearsadviser.com/*
// @match        https://vrtier.com/*
// @match        https://misterio.ro/*
// @match        https://techedifier.com/*
// @match        https://hauntingrealm.com/*
// @match        https://batmanfactor.com/*
// @match        https://shinshu.net/*
// @match        https://shinchu.net/*
// @match        https://allcryptoz.net/*
// @match        https://gametechreviewer.com/*
// @match        https://phineypet.com/*
// @match        https://vegan4k.com/*
// @match        https://chefknives.expert/*
// @match        https://tunebug.com/*
// @match        https://crewus.net/*
// @match        https://basketballsavvy.com/*
// @match        https://kenzo-flowertag.com/*
// @match        https://ineedskin.com/*
// @match        https://rsadnetworkinfo.com/*
// @match        https://advertisingexcel.com/landing/*
// @match        https://advertisingexcel.com/outgoing/*
// @match        https://boredboard.com/*
// @match       *://*/*bypass.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pluginmixer.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492612/fly%20Inc.user.js
// @updateURL https://update.greasyfork.org/scripts/492612/fly%20Inc.meta.js
// ==/UserScript==

(function() {
  const centros = document.querySelectorAll("center");
  for (const centro of centros) {
    const codes = centro.querySelectorAll("code");
    const h1s = centro.querySelectorAll("h1");

    for (const code of codes) {
      centro.parentNode.insertBefore(code, centro);
    }

    for (const h1 of h1s) {
      centro.parentNode.insertBefore(h1, centro);
    }
    const buttons = centro.querySelectorAll("button");
    if (buttons.length === 0) {
      centro.parentNode.removeChild(centro);
    }
  }
  const botoes = document.querySelectorAll("button");
  for (const botao of botoes) {
    if (botao.hasAttribute("disabled")) {
      botao.removeAttribute("disabled");
    }
  }
var buttons = document.evaluate("//button[contains(@class, 'btn-')]", document, null, XPathResult.ANY_TYPE, null);
function clickButton(button) {
  setTimeout(function() {
    button.click();
  }, 3000);
}
var button;
while (button = buttons.iterateNext()) {
  console.log(button);
  clickButton(button);
}
if (
    document.body.innerText.includes("OOPS! YOU HAVE BEEN BLOCKED") ||
    document.body.innerText.includes("Sorry, you have been blocked") ||
    document.body.innerText.includes("Web server is returning an unknown error")) {
    if (document.referrer !== window.location.href) {
        window.location.href = document.referrer;
    } else {
        window.location.href = "paginaInicial.html";
    }
}
    function clickContinueButton() {
        var buttons = document.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].textContent.includes('Continue')) {
                var button = buttons[i];
                console.log('Botão "Continue" encontrado. Clicando em 3 segundos...');
                setTimeout(function() {
                    button.click();
                    console.log('Botão "Continue" clicado!');
                }, 1000);
                break;
            }
        }
    }
    function clickGetLinkButton() {
        var buttons = document.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].textContent.includes('Get Link')) {
                var button = buttons[i];
                console.log('Botão "Get Link" encontrado. Clicando em 5 segundos...');
                setTimeout(function() {
                    button.click();
                    console.log('Botão "Get Link" clicado!');
                }, 1000);
                break;
            }
        }
    }
    var targetNode = document.body;
    var config = { attributes: true, childList: true, subtree: true };
    var callback = function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                clickContinueButton();
                clickGetLinkButton();
            }
        }
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    clickContinueButton();
    clickGetLinkButton();
})();