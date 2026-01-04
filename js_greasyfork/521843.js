// ==UserScript==
// @name         Clear countdown
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  sdfr345tdtg
// @author       You
// @match        https://tiktokcounter.net/*
// @match        https://tpayr.xyz/*
// @match        https://lifgam.online/*
// @match        https://waezf.xyz/*
// @match        https://u10596-clro.playonpc.online/*
// @match        https://u8483-clro.playonpc.online/*
// @match        https://finance240.com/*
// @match        https://u10107-clro.playonpc.online/*
// @match        https://freeat30.org/*
// @match        https://business3.cryptednews.space/*
// @match        https://u3150-lime.playonpc.online/*
// @match        https://u169-lime.playonpc.online/*
// @match        https://tryzt.xyz/*
// @match        https://ashrfd.xyz/*
// @match        https://poqzn.xyz/*
// @match        https://ashrff.xyz/*
// @match        https://rezsx.xyz/*
// @grant        none
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/521843/Clear%20countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/521843/Clear%20countdown.meta.js
// ==/UserScript==

(function() {


    setTimeout(function() {
        // Localize e clique no elemento usando o seletor CSS fornecido
        document.querySelector('.gt-current-lang').click();
    }, 5000);

setTimeout(function() {
        // Localize e clique no elemento usando o seletor CSS fornecido
        document.querySelector('a.nturl:nth-of-type(22)').click();
    }, 6000);

    const tiktokcounterRegex = /^(https?:\/\/)(.+)?(tiktokcounter.net|u3150-lime.playonpc.online|u169-lime.playonpc.online|u10107-clro.playonpc.online|u10596-clro.playonpc.online|u8483-clro.playonpc.online|freeat30.org|tryzt.xyz|finance240.com|business3.cryptednews.space|poqzn.xyz|ashrff.xyz|rezsx.xyz|tpayr.xyz|ashrfd.xyz|lifgam.online|waezf.xyz)(\/.*)/
    if (tiktokcounterRegex.test(window.location.href)) {
        //---DEFINE FUNCTIONS---

        function ReadytoClick(selector, sleepTime = 0) {
            const events = ["mouseover", "mousedown", "mouseup", "click"];
            const selectors = selector.split(', ');
            if (selectors.length > 1) {
                return selectors.forEach(ReadytoClick);
            }
            if (sleepTime > 0) {
                return sleep(sleepTime * 1000).then(function() {
                    ReadytoClick(selector, 0);
                });
            }
            elementReady(selector).then(function(element) {
                element.removeAttribute('disabled');
                element.removeAttribute('target');
                events.forEach(eventName => {
                    const eventObject = new MouseEvent(eventName, {
                        bubbles: true
                    });
                    element.dispatchEvent(eventObject);
                });
            });
        }

        function elementReady(selector) {
            return new Promise(function(resolve, reject) {
                let element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }
                new MutationObserver(function(_, observer) {
                    element = document.querySelector(selector);
                    if (element) {
                        resolve(element);
                        observer.disconnect();
                    }
                }).observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
            });
        }

        function sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        function preventForcedFocusOnWindow() {
            window.mouseleave = true;
            window.onmouseover = true;
            document.hasFocus = function() {
                return true;
            };
            Object.defineProperty(document, 'webkitVisibilityState', {
                get() {
                    return 'visible';
                }
            });
            Object.defineProperty(document, 'visibilityState', {
                get() {
                    return 'visible';
                }
            });
            window.addEventListener('visibilitychange', function(e) {
                e.stopImmediatePropagation();
            }, true, true);
            window.addEventListener('focus', onfocus, true);
            document.addEventListener('visibilitychange', function(e) {
                e.stopImmediatePropagation();
            }, true, true);
            Object.defineProperty(document, 'hidden', {
                get() {
                    return false;
                }
            });
        };

        function captchaIsSolved() {
            if (document.querySelector('.h-captcha')) {
                return window.hcaptcha.getResponse().length !== 0;
            } else if (document.querySelector('.cf-turnstile') || document.querySelector('#captcha-turnstile')) {
                return window.turnstile.getResponse().length !== 0;
            } else if (document.querySelector('.g-recaptcha') || document.querySelector('#captchaShortlink') || document.querySelector('#captcha_container') || document.querySelector('#captchaShortlinker')) {
                return window.grecaptcha.getResponse().length !== 0;
            }
        }

        //---EXECUTE

        if (tiktokcounterRegex.test(window.location.href)) {
            preventForcedFocusOnWindow();
        }

        //document.addEventListener('DOMContentLoaded', function() {
        window.addEventListener('load', function() {
            // Check its not ez4short because it won't work on that one - example https://ez4short.com/ar02kkolam
            //if (false){
            if (!(document.querySelectorAll('a[href*="ez4short.com"]').length > 0)) {

                if (tiktokcounterRegex.test(window.location.href)) {

                    // Skip timer
                    setInterval(function(){window.wT9882=0;}, 1000);

                    // Auto click buttons
                    if (true){
                    //if (navigator.userAgent.indexOf("Firefox") != -1) {
                        if (document.querySelector('.h-captcha')) {
                            let ctrsh = setInterval(() => {
                                if (captchaIsSolved()) {
                                    clearInterval(ctrsh);
                                    ReadytoClick('#cbt', 1);
                                }
                            }, 1000);
                        } else {
                            let profitsfly = setInterval(() => {
                                if (document.querySelector('#cbt').innerText == 'NEXT ARTICLE') {
                                    clearInterval(profitsfly);
                                    ReadytoClick('#cbt', 2);
                                }
                            }, 1000);
                        }

                    }











                }
if (true){
                    //if (navigator.userAgent.indexOf("Firefox") != -1) {
                        if (document.querySelector('.h-captcha')) {
                            let ctrsh = setInterval(() => {
                                if (captchaIsSolved()) {
                                    clearInterval(ctrsh);
                                    ReadytoClick('#cbt', 1);
                                }
                            }, 1000);
                        } else {
                            let profitsfly = setInterval(() => {
                                if (document.querySelector('#cbt').innerText == 'NEXT ARTICLE') {
                                    clearInterval(profitsfly);
                                    ReadytoClick('#cbt', 2);
                                }
                            }, 1000);
                        }
                    }
        }
                                }
                                )}

setTimeout (function () {
(function() { var el=document.body; var ce=document.createElement('div'); if(el) { el.appendChild(ce); ce.setAttribute("id", "QGSBETJjtZkYH"); } });
((function(){const e=document.querySelector("#widescreen1");if(e){const t=document.createElement("div");t.setAttribute("id","google_ads_iframe_"),e.appendChild(t)}}));
}, 6000);


setTimeout(function(){
  $('a').trigger('click');
}, 5000);



})();
