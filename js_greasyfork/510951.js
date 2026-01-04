// ==UserScript==
// @name         Mazean King
// @namespace    http://tampermonkey.net/
// @version      2024-08-18
// @description  Basic Player ESP
// @author       November2246
// @match        https://mazean.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mazean.com
// @grant        none
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/510951/Mazean%20King.user.js
// @updateURL https://update.greasyfork.org/scripts/510951/Mazean%20King.meta.js
// ==/UserScript==

const enableESP = true;

/////

const { log, warn, error, debug } = window.console;

if (enableESP) {
    WebGL2RenderingContext.prototype.shaderSource = new Proxy(WebGL2RenderingContext.prototype.shaderSource, {
        apply(target, thisArgs, args) {
            let [shader, src] = args;
            if (src.includes('gl_Position')) {
                if (src.includes('vPosition = (model * position).xyz;')) {
                    src = src.replace('}',
`
    if (gl_Position.z > 0.4) {
        gl_Position.z = 0.01 + gl_Position.z * 0.1;
    }
}`);
                }
            }
            args[1] = src;
            return Reflect.apply(...arguments);
        }
    });
}