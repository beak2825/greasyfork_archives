// ==UserScript==
// @name         Password Input Protector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to protect your password input!
// @author       HeziCyan
// @include      *
// @icon         https://www.google.com/s2/favicons?domain=219.58
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/439498/Password%20Input%20Protector.user.js
// @updateURL https://update.greasyfork.org/scripts/439498/Password%20Input%20Protector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        let inputs = document.getElementsByTagName('input')
        let pass = new Array
        for (let input of inputs) {
            if (input.type === 'password') pass.push(input)
        }

        const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    let target = mutation.target
                    if (target.type !== 'password') {
                        target.type = 'password'
                        alert('请不要试图修改密码框的 type 属性！')
                    }
                }
            }
        }
        const config = { attributes: true }
        let observer = new MutationObserver(callback)
        for (let ele of pass) observer.observe(ele, config)
    })
})();