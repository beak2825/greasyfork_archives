// jshint esversion: 6
// eslint-disable-next-line
// ==UserScript==
// @name         appendShadow
// @namespace    https://dniness.github.io/
// @version      0.03
// @description  💜
// @author       Dniness
// @match        *://*/*
// @icon         data:image/svg+xml,<svg width='64' height='64' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='32' cy='32' r='32' fill='darkgray'/></svg>
// @grant        none
// @run-at       document-body
// @license      MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/452732/appendShadow.user.js
// @updateURL https://update.greasyfork.org/scripts/452732/appendShadow.meta.js
// ==/UserScript==

 

(document.appendShadow=(func,name)=>{
    'use strict';
    const mode = name?'open':'closed';
    [,name,func]=(func+'').match(/([^ =]+)[^{]+\{(.+)\}$/);
    name = name.replace(/([A-Z])/g,"-$1").toLowerCase();
    customElements.define(name, class extends HTMLElement {
        constructor() {
            super();
            new Function(func).call(this.attachShadow({mode}));
        }
    })
    document.body.appendChild(document.createElement(name));
})(exampleMonkeyShadow=>{this.appendChild(document.createElement('h2'))});
