// ==UserScript==
// @name         Claim Bits
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  autologin + autoshorts com captcha embutido!
// @author       Keno Venas
// @match        https://claimbits.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimbits.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494443/Claim%20Bits.user.js
// @updateURL https://update.greasyfork.org/scripts/494443/Claim%20Bits.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.left = '20px';
    messageDiv.style.padding = '10px';
    messageDiv.style.backgroundColor = 'blue';
    messageDiv.style.color = 'black';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.zIndex = '9999';
    messageDiv.textContent = 'Criado por Keno Venas !!!';
    document.body.appendChild(messageDiv);
    function clicarComDelay() {
        setTimeout(function() {
            var botao = document.querySelector('button[class="btn btn-success btn-sm"]');
            if (botao) {
                botao.click();
            } else {
                console.log('Botão não encontrado.');
            }
        }, 5000);
    }
    clicarComDelay();
    if (window.location.href === "https://claimbits.net/faucet.html") {
        window.location.href = "http://linksfly.link/claimbits-net-shortlinks-html";
    }
    function clickButton(button, delay) {
        setTimeout(function() {
            button.click();
        }, delay);
    }
    function autoLogin() {
        var loginButton = document.querySelector('a.btn-info');
        // Seletor do campo de email
        var emailInput = document.querySelector('input[placeholder="Username / Email"]');
        var passwordInput = document.querySelector('input[placeholder="Password"]');
        var submitButton = document.querySelector('button[id="login-sub-btn"]');
        if (loginButton && emailInput && passwordInput && submitButton) {
            clickButton(loginButton, 2000);
            setTimeout(function() {
                emailInput.value = "seuemail@gmail.com";
            }, 2000);
            setTimeout(function() {
                passwordInput.value = "suasenha";
            }, 3000);
            clickButton(submitButton, 15000);
        }
    }
    autoLogin();
  var keywords = ["chainfo.xyz",
"adlink.click",
"clk.sh",
"clicksfly.com",
"shortox.com",
"exe.io",
"linksly.co",
"birdurls.com",
"illink.net",
"insfly.pw",
"revly.click",
"fc.lc",
"revcut.net",
"bitad.org",
"faho.us",
"urlcut.pro",
"kyshort.xyz",
"linkrex.net",
"shortino.link",
"wez.info",
"megafly.in",
"cashurl.win",
"shorti.io",
"shrinkme.link",
"inlinks.online",
"bitss.sbs",
"linkjust.com",
"rsshort.com",
"earnow.online",
"clks.pro",
"easycut.io",
"shrinkearn.com",
"shortox.com",
"owllink.net",
"cutlink.xyz",
"megaurl.in",
"usalink.io",
"oii.io",
"ex-foary.com"
];

    var xpathExpressions = keywords.map(function(keyword) {
        return "//tr[td[contains(text(), '" + keyword + "')]]";
    });

    for (var i = 0; i < xpathExpressions.length; i++) {
        var xpathExpression = xpathExpressions[i];
        var matchingElements = document.evaluate(xpathExpression, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var j = 0; j < matchingElements.snapshotLength; j++) {
            var element = matchingElements.snapshotItem(j);
            element.parentNode.removeChild(element);
        }
    }

})();
