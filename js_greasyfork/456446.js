// ==UserScript==
// @name           Chrome DevTools console
// @description    execute "console.log()" and "console.dir()" faster in the DevTool of Chrome
// @author         yeshiqing
// @license        MIT
// @run-at         document-idle
// @match          *
// @grant          none
// @version        0.0.1
// @namespace      https://github.com/yeshiqing/tampermonkey-scripts
// @icon           https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/456446/Chrome%20DevTools%20console.user.js
// @updateURL https://update.greasyfork.org/scripts/456446/Chrome%20DevTools%20console.meta.js
// ==/UserScript==

let isFn = function (x) { return (x instanceof Function) }

let generate_console = function (...props) {
    props.forEach((prop, i) => {
        let raw = window[prop]
        let raw_isFn = isFn(raw)
        if (raw == null || raw_isFn) {
            window[prop] = function (...args) {
                raw && raw_isFn && raw()
                console[prop](...args)
            }
        }
    })
}

let extend_Object_prototype = function (props) {
    props.forEach((prop, i) => {
        if (Object.prototype[prop] == null) {
            Object.prototype[prop] = function () {
                console[prop](this)
            }
        }
    })
}

generate_console('log', 'dir')

extend_Object_prototype('log', 'dir')