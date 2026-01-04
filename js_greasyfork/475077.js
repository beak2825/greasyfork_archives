// ==UserScript==
// @name         隐藏colamanhua广告
// @namespace    ChatGPT
// @version      1.4
// @description  隐藏colamanhua广告展示
// @homepageURL  https://greasyfork.org/zh-CN/scripts/475077
// @run-at       document-start
// @match        https://www.colamanga.com/*
// @match        https://www.colamanhua.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475077/%E9%9A%90%E8%97%8Fcolamanhua%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/475077/%E9%9A%90%E8%97%8Fcolamanhua%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    stopMainlandRedirect();
    stopAndHideAds();
})();
// 阻止大陆跳转
function stopMainlandRedirect() {
    var proxy__cad;
    window.__cad && updateProxy(window.__cad);
    function updateProxy(target) {
        return (proxy__cad = new Proxy(target, {
            set: function (target, property, value, receiver) {
                target[property] = value;
                return true;
            },
            get: function (target, property, receiver) {
                if (property == 'countryIsMainland' || property == 'countryIsCN') {
                    target[property] = () => false;
                }
                if (typeof target[property] == 'function') {
                    const func = target[property];
                    target[property]= function(){var r=func.apply(this,arguments);if(r==='CN')r='HK';return r;};
                }
                return target[property];
            }
        }));
    }
    Object.defineProperty(window, '__cad', {
        get: () => proxy__cad,
        set: value => updateProxy(value)
    });
}
// 阻止隐藏广告
function stopAndHideAds() {
    if (!window.location.href.includes(".html")) return;
    const style = document.createElement('style');
    style.innerHTML = `[style='display: block; width: 100%; height: 132px; background: rgb(170, 170, 170);'],[style='bottom: 132px;'],body \
    > div[style*='height: 33px'][style*='132px !important;'],body \
    > div[class][style^='bottom: '][style$='vw; display: block;'],[style*='z-index: 214748364'],.mlad,[class$='_b'],[style*='8.5vw;background: #000;opacity:0.01;'] \
    {display: none !important;visibility: hidden; opacity: 0; z-index: -999; width: 0; height: 0; pointer-events: none; position: absolute; left: -9999px; top: -9999px;}`;
    document.head.appendChild(style);
    false && window.addEventListener('beforeunload', e => {
        e.preventDefault();
        e.returnValue = '';
    });
    (function() {
        var locked = false;
        window.addEventListener('touchmove', ev => {
            locked || (locked = true, window.addEventListener('touchend', stopTouchendPropagation, true));
        }, true);
        window.addEventListener('touchstart', ev => {
            locked || (locked = true, window.addEventListener('touchend', stopTouchendPropagation, true));
        }, true);
        function stopTouchendPropagation(ev) {
            ev.stopPropagation();
            window.removeEventListener('touchend', stopTouchendPropagation, true);
            locked = false;
        }
    })();
}
