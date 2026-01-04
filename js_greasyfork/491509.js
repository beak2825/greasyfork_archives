// ==UserScript==
// @name        Keybinds.js
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.7.4
// @license     MIT
// @author      xew
// @description best Keybinds!
// @downloadURL https://update.greasyfork.org/scripts/491509/Keybindsjs.user.js
// @updateURL https://update.greasyfork.org/scripts/491509/Keybindsjs.meta.js
// ==/UserScript==
class Keybind{constructor(s,c,a){if(!s||typeof s!=='string')throw new Error('No Keybinds');if(s.length<2)console.warn('Warning: String Length should be longer');if(!c||typeof c!='function')throw new Error('No Function Called');let keyType=a?['keydown','keyup','keypress'].filter(t=>t==a).length?['keydown','keyup','keypress'].filter(t=>t==a)[0]:'keypress':'keypress',k='',listener=addEventListener(keyType,({key})=>{if(s.split('').includes(key)){if(key==s.charAt(s.length))k=s.charAt(s.length);else k+=key;if(k==s){if(c&&typeof c=='function')c();removeEventListener(keyType,listener);k=''}}else k=''})}};