// eslint-disable-next-line
// ==UserScript==
// @name         ChangeNavReadOnly
// @namespace    https://dniness.github.io/
// @name:zh-CN   New Use Nav
// @version      0.01
// @description  修改 navigator 等只读Object
// @author       Dniness
// @match        *://*/*
// @icon         data:image/svg+xml,<svg width='64' height='64' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='32' cy='32' r='32' fill='MediumAquaMarine'/></svg>
// @grant        none
// @run-at       document-start
// @license      MPL2.0
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/452121/ChangeNavReadOnly.user.js
// @updateURL https://update.greasyfork.org/scripts/452121/ChangeNavReadOnly.meta.js
// ==/UserScript==
// jshint esversion: 6

(function(UA_APP) {
    'use strict';
    const navTag=$=>{
        $=[$=Object.entries($),$=$.shift().pop()].shift()
            .forEach(([e,value])=>Object.defineProperty($,e,{value}));
    }
    navTag({navigator,
        userAgent:UA_APP,
        appName:UA_APP.split('/').slice(1).join('/'),
        platform:'Win32'
    });
    // Your code here...
})('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.114 Safari/537.36');
