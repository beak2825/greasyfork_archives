// ==UserScript==
// @name         Architextures (Desbloquear Pro)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Um script que desbloqueia todas as funções pro do Architextures.
// @author       Pedro6159
// @match        https://architextures.org/create*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=architextures.org
// @license      MIT
// @run-at   document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483177/Architextures%20%28Desbloquear%20Pro%29.user.js
// @updateURL https://update.greasyfork.org/scripts/483177/Architextures%20%28Desbloquear%20Pro%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function getListOfElementsByXpath(path) {
        var nodes = document.evaluate(path, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        var result = [];
        for (var i = 0; i < nodes.snapshotLength; i++) {
            result.push(nodes.snapshotItem(i));
        }
        return result;
    }
    function initialize_code() {
        // Desbloqueia itens inativo e tira a opacidade
        var _a = getListOfElementsByXpath("//*[contains(@class,'inactive')]");
        for (let i = 0; i < _a.length; i++) {
            const d = _a[i]
            d.classList.remove("inactive")
            if (d.style.opacity != null)
                _a[i].style.opacity = "1";
        }
        // remove o rotulo de "pro"
        var _b = getListOfElementsByXpath("//*[contains(@class,'pro-feature')]");
        for (let i = 0; i < _b.length; i++) {
            _b[i].classList.remove("pro-feature")
        }
        // Desbloqueia as opções
        var _c = getListOfElementsByXpath("//*[@disabled]");
        for (let i = 0; i < _c.length; i++) {
            _c[i].removeAttribute("disabled")
        }
        // Desbloqueia outras configurações
        var _d = getListOfElementsByXpath("//*[contains(@class,'disabled')]");
        for (let i = 0; i < _d.length; i++) {
            _d[i].classList.remove("disabled")
            _d[i].classList.add("view-option-button");
        }
    }


    window.onload = function () {
        if (document.readyState == 'complete') {
            console.log("Trying to find the interface to inject the script...");
            setInterval(function () {
                var gui = document.getElementsByClassName("canvas-container output-container");
                if (gui) {
                    initialize_code();
                }
            }, 5000);
            window.onload = null;
        }
    };


})();