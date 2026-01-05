// ==UserScript==
// @author         たかだか。/TKDK.
// @name           Yahoo T-Point Auto Skip
// @name:ja        Yahoo T-Point Auto Skip
// @namespace      https://twitter.com/djtkdk_086969
// @description:ja Yahoo! Japan ログイン後の「T-POINT利用手続き/PayPay連携/LINEアカウント連携」画面を自動的にスキップします。
// @description    Automatically skips the T-Point / PayPay registration nag screen on Yahoo! Japan.
// @include        *://tcard.yahoo.co.jp/*
// @include        *://wallet.yahoo.co.jp/*
// @include        *://paypay.yahoo.co.jp/*
// @include        *://id.lylink.yahoo.co.jp/*
// @version        0.2.2.005
// @grant          none
// @license        MIT License; https://opensource.org/licenses/mit-license.php
// @homepage       https://twitter.com/djtkdk_086969
// @compatible     firefox
// @compatible     chrome
// @downloadURL https://update.greasyfork.org/scripts/30086/Yahoo%20T-Point%20Auto%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/30086/Yahoo%20T-Point%20Auto%20Skip.meta.js
// ==/UserScript==

(function() {
    console.log("YTPAS: Started.");
    window.addEventListener ('DOMContentLoaded', checkElem());

    var mo =
        new MutationObserver(function(mutationEventList) {
            checkElem();
        });
    var mo_conf = {
        childList: true,
        attributes: true,
        characterData: false,
        subtree: true
    };
    mo.observe(document.querySelector('body'), mo_conf);

    function checkElem() {
        console.log("YTPAS: Checking elements...");
        let skipButtonT = document.getElementById("skipButton");
        let skipButtonP = document.getElementById("ppskip");
        if (skipButtonT !== null &&
           location.href.startsWith('https://tcard.yahoo.co.jp/') &&
           document.title.match(/[ＴT]ポイント利用手続き/) !== null) {
           console.log("YTPAS: T-Point nag screen detected. Skipping...");
           skipButtonT.click();
        }
        if (skipButtonP !== null &&
            (
                location.href.startsWith('https://wallet.yahoo.co.jp/paypay/agreement/') ||
                location.href.startsWith('https://paypay.yahoo.co.jp/agreement/')
            ) &&
            document.title.match(/ヤフーからの大切なお知らせです/) !== null) {
            console.log("YTPAS: PayPay nag screen detected. Skipping...");
            skipButtonP.click();
        }
        if (location.href.includes("id.lylink.yahoo.co.jp")) {
            // LINEアカウント連携
            let lyHeader = document.getElementsByTagName("h1");
            let lyFlag = false;
            if (lyHeader.length > 0) {
                [].slice.call(lyHeader).forEach( (e) => {
                    if (e.innerText == "アカウント連携をしましょう") {
                        lyFlag = true;
                    }
                });
            }
            if (lyFlag) {
                console.log("YTPAS: LINE nag screen detected. Skipping...");
                let lyBtn = document.querySelectorAll("button.btn");
            if (lyBtn.length > 0) {
                [].slice.call(lyBtn).forEach( (e) => {
                    if (e.innerText == "あとで行う") {
                        e.click();
                    }
                });
            }
            }
        }
    }
})();