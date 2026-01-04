// ==UserScript==
// @name         Camel BTC
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Coletar recursos e market automatico
// @author       white
// @license      MIT
// @match        https://1ink.cc/*
// @match        https://camelbtc.com/*
// @match        https://donaldco.in/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472738/Camel%20BTC.user.js
// @updateURL https://update.greasyfork.org/scripts/472738/Camel%20BTC.meta.js
// ==/UserScript==

var apple = 'yes';
var market = 'yes';

        if (document.getElementsByClassName('skipbutton')[0]) {
            document.getElementsByClassName('skipbutton')[0].click();
        }
function clickBotaoElement() {
    var botaoElement = document.getElementById('button1');
    if (botaoElement) {
        botaoElement.click();
    } else {
        console.log('Link not found.');
    }
}
if (window.location.href === "https://camelbtc.com/") {
    window.location.href = "https://camelbtc.com/?ref=100034";
}
if (window.location.href === "https://camelbtc.com/market.php?action=deliver") {
 window.location.href = "https://camelbtc.com/index.php";
}
if (window.location.href === "https://camelbtc.com/market.php?action=collect") {
 window.location.href = "https://camelbtc.com/index.php";
}
const bitcoinWalletAddress = 'email';
const inputField = document.querySelector('input[name="bitcoinwallet"][type="text"][size="150"]');
const submitButton = document.querySelector('input[type="submit"].submit2[style="width: 300px; height: 60px;"][value="Enter & Earn Crypto"]');

function fillAndClick() {
    if (inputField && submitButton) {
        inputField.value = bitcoinWalletAddress;
        submitButton.click();
    }
}

setTimeout(fillAndClick, 5000);

    function redirectToHomePageWithDelay() {
        setTimeout(function() {
            window.location.href = "https://camelbtc.com/";
        }, 5000);
    }

    if (window.location.href.includes("https://camelbtc.com/grass.php?action=claim1") ||
        window.location.href.includes("https://camelbtc.com/grass.php?action=claim2") ||
        window.location.href.includes("https://camelbtc.com/grass.php?action=claim3")) {
        redirectToHomePageWithDelay();
    }
    if (window.location.href.includes("https://camelbtc.com/grass.php?action=grass1") ||
        window.location.href.includes("https://camelbtc.com/grass.php?action=grass2") ||
        window.location.href.includes("https://camelbtc.com/grass.php?action=grass3")) {
        redirectToHomePageWithDelay();
    }

function ativarBotao() {
    var link = document.querySelector('a[href="index.php?claim=1&type=wood"]');
    if (link) {
        link.click();
    } else {
        console.log('Link not found.');
    }
}

function ativarBotao2() {
    var link = document.querySelector('a[href^="index.php?confirm1="]');
    if (link) {
        link.click();
    } else {
        console.log('Link not found.');
    }
}

function ativarBotao3() {
    var link = document.querySelector('a[href="index.php?claim=1&type=rock"]');
    if (link) {
        link.click();
    } else {
        console.log('Link not found.');
    }
}

function ativarBotao4() {
    var link = document.querySelector('a[href="index.php?claim=1&type=steel"]');
    if (link) {
        link.click();
    } else {
        console.log('Link not found.');
    }
}

function ativarBotao5() {
    var link = document.querySelector('a[href="grass.php?action=claim1"]');
    if (link) {
        link.click();
    } else {
        console.log('Link not found.');
    }
}

function ativarBotao6() {
    var link = document.querySelector('a[href="grass.php?action=claim2"]');
    if (link) {
        link.click();
    } else {
        console.log('Link not found.');
    }
}

function ativarBotao7() {
    var link = document.querySelector('a[href="grass.php?action=claim3"]');
    if (link) {
        link.click();
    } else {
        console.log('Link not found.');
    }
}

function ativarBotao8() {
    var link = document.querySelector('a[href="grass.php?action=grass1"]');
    if (link) {
        link.click();
    } else {
        console.log('Link not found.');
    }
}

function ativarBotao9() {
    var link = document.querySelector('a[href="grass.php?action=grass2"]');
    if (link) {
        link.click();
    } else {
        console.log('Link not found.');
    }
}

function ativarBotao10() {
    var link = document.querySelector('a[href="grass.php?action=grass3"]');
    if (link) {
        link.click();
    } else {
        console.log('Link not found.');
    }
}
function clickBotaoElement2() {
    var botaoElement = document.getElementById('button1');
    if (botaoElement) {
        botaoElement.click();
    } else {
        console.log('Link not found.');
    }
}

function clickMarketButton() {
    var link = document.querySelector('a[href="market.php?action=deliver"]');
    if (link) {
        link.click();
    } else {
        console.log('Market button not found.');
    }
}

function clickCustomButton() {
    var link = document.querySelector('a[href="https://camelbtc.com/index.php"]');
    if (link) {
        link.click();
    } else {
        console.log('Custom button not found.');
    }
}
function clickCollectButton() {
    var link = document.querySelector('a[href="market.php?action=collect"]');
    if (link) {
        link.click();
    } else {
        console.log('Collect button not found.');
    }
}



if (apple === 'yes') {
    setTimeout(ativarBotao5, 5000);
    setTimeout(ativarBotao6, 5000);
    setTimeout(ativarBotao7, 5000);
    setTimeout(ativarBotao8, 5000);
    setTimeout(ativarBotao9, 5000);
    setTimeout(ativarBotao10, 5000);
    setTimeout(clickBotaoElement, 6000);
    setTimeout(ativarBotao2, 6500);
}


    var buttonText = document.body.textContent;
    if (buttonText.includes('Log Available :') && parseInt(buttonText.split('Log Available :')[1]) >= 3000) {
        setTimeout(ativarBotao, 5000);
    }
    setTimeout(ativarBotao2, 5000);
    setTimeout(clickBotaoElement, 5000);



    if (buttonText.includes('Rock Available :') && parseInt(buttonText.split('Rock Available :')[1]) >= 10000) {
        setTimeout(ativarBotao3, 5000);
    }
    setTimeout(ativarBotao2, 5000);
    setTimeout(clickBotaoElement, 5000);



    setTimeout(function () {
        var buttonText = document.body.textContent;
        if (buttonText.includes('Gold Available :') && parseInt(buttonText.split('Gold Available :')[1]) >= 500) {
            var button = document.querySelector('input[type="submit"].submit2[value="Collect"]');
            if (button) {
                button.click();
            } else {
                console.log('Link not found.');
            }
        }
    }, 5000);



    if (buttonText.includes('Steel Available :') && parseInt(buttonText.split('Steel Available :')[1]) >= 500) {
        setTimeout(ativarBotao4, 5000);
    }
    setTimeout(ativarBotao2, 5000);
    setTimeout(clickBotaoElement, 5000);

if (window.location.href === "https://camelbtc.com/market.php") {
            setTimeout(clickMarketButton, 5000);
            setTimeout(clickCollectButton, 6000);
            setTimeout(clickCustomButton, 7000);
            setTimeout(clickBotaoElement, 5000);
}
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        const target = mutation.target;
        const errorMessage = "Ooops ~";

        if (target.textContent.includes(errorMessage)) {
            setTimeout(() => {
                window.location.href = "https://camelbtc.com/";
            }, 4000);
        }
    }
});

const observerConfig = {
    childList: true,
    subtree: true,
    characterData: true,
};

const body = document.querySelector('body');
observer.observe(body, observerConfig);

const observer2 = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        const target = mutation.target;
        const errorMessage = "Your items are shipped..";

        if (target.textContent.includes(errorMessage)) {
            setTimeout(() => {
                window.location.href = "https://camelbtc.com/";
            }, 4000);
        }
    }
});

const observerConfig2 = {
    childList: true,
    subtree: true,
    characterData: true,
};

const body2 = document.querySelector('body');
observer2.observe(body2, observerConfig2);


if (market === 'yes') {
  setTimeout(function () {
    window.location.href = "https://camelbtc.com/market.php";
  }, 300000);
}

if (market === 'no') {
  setTimeout(function () {
    window.location.href = "https://camelbtc.com/";
  }, 300000);
}