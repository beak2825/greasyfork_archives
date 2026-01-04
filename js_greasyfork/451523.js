// ==UserScript==
// @name        KameSame Open Framework - Jquery module
// @version     0.4
// @author      Robin Findley, Timberpile
// @description Jquery module for KameSame Open Framework
// @homepage    https://github.com/timberpile/kamesame-open-framework#readme
// @supportURL  https://github.com/timberpile/kamesame-open-framework/issues
// @match       http*://*.kamesame.com/*
// @copyright   2022+, Robin Findley, Timberpile
// @namespace   timberpile@proton.me
// @run-at      document-start
// @grant       none
// @license     MIT
// ==/UserScript==

(()=>{"use strict";(async e=>{const t=window.ksof;await t.ready("document");try{$.fn.jquery}catch(e){await t.loadScript(t.supportFiles["jquery.js"],!0)}t.Jquery={version:$.fn.jquery},setTimeout((()=>{t.setState("ksof.Jquery","ready")}),0)})()})();