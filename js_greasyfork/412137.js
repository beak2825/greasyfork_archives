// ==UserScript==
// @name         Geekhub logo X
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  A sexy version of geekhub logo
// @author       夜幕下的尖椒, dallaslu
// @match        https://geekhub.com/**
// @match        https://www.geekhub.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412139/Geekhub%20logo%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/412139/Geekhub%20logo%20X.meta.js
// ==/UserScript==

(function() {

    'use strict';
    var ghLogos = {
        'light': 'https://i.loli.net/2020/09/27/uiv2YTXKFR9BtE5.png',
        'dark': 'https://i.loli.net/2020/09/27/F7BWNYqje13ixKV.png',
        'reverse': 'https://i.loli.net/2020/09/27/MuZIl9jiYSvOWN4.png'
    };

    var ghSchemeButtons = {
        'light': ghLogos.reverse,
        'dark': ghLogos.light,
        'royal': ghLogos.light,
        'ocean': ghLogos.dark,
        'jade': ghLogos.light,
        'purple': ghLogos.dark,
    };

    function changeLogo() {
        // 判断当前主题
        var logoFile = '';
        for (var btn in ghSchemeButtons) {
            var schemeBtn = document.getElementById('theme-'+btn);
            if (schemeBtn && schemeBtn.style.display === 'inline') {
                logoFile = ghSchemeButtons[btn];
                break;
            }
        }

        logoFile = logoFile || ghLogos.reverse;

        //获取该对象
        var logo = document.querySelector('header>div>div>a>span') || document.querySelector('sidebar>div>div>div.flex>div>a>span');
        if (!logo.style.background) {
            logo.style.background = "url(" + logoFile + ")";
            logo.style.backgroundSize = '116.7px 36px';
            logo.style.width = '116.7px';
            logo.style.height = '36px';
            logo.innerHTML = "";
        }
    }

    var observer = new MutationObserver(function(doc, observer) {
        changeLogo();
    });

    observer.observe(document, {
        characterData: true,
        childList: true,
        attributes: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    });

    changeLogo();
})();