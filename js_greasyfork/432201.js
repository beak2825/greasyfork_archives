// ==UserScript==
// @name         GBF_OPACITY
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  gbf opacity
// @author       Moo_asdsasd5
// @match        *://game.granbluefantasy.jp/
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/432201/GBF_OPACITY.user.js
// @updateURL https://update.greasyfork.org/scripts/432201/GBF_OPACITY.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const opacity = GM_getValue('gbf_opacity')
    if (!opacity) {
        GM_setValue('gbf_opacity', 0.5)
    } else {
        GM_addStyle(
        `
           body, #ready { opacity: ${opacity};}
        `)
    }
    const setOpacity = (num) => {
        return () => {
           GM_setValue('gbf_opacity', num)
        }
    }
    GM_registerMenuCommand('OPACITY_0', setOpacity(0.0));
    GM_registerMenuCommand('OPACITY_0.1', setOpacity(0.1));
    GM_registerMenuCommand('OPACITY_0.2', setOpacity(0.2));
    GM_registerMenuCommand('OPACITY_0.5', setOpacity(0.5));
    GM_registerMenuCommand('OPACITY_1', setOpacity(1));
 
    GM_addValueChangeListener('gbf_opacity', (name, ov, nv) => {
        GM_addStyle(
        `
           body, #ready { opacity: ${nv};}
        `)
    })
    // Your code here...
})();