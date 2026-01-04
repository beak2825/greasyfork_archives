// ==UserScript==
// @name         DirectLink🐘!
// @namespace    editit
// @version      0.4.1
// @description  在长毛象站点中直达ActivityHub链接
// @author       editit
// @match        *://o3o.ca/*
// @match        *://m.cmx.im/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462540/DirectLink%F0%9F%90%98%21.user.js
// @updateURL https://update.greasyfork.org/scripts/462540/DirectLink%F0%9F%90%98%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // https://stackoverflow.com/a/47409362
    const inputTypes = [window.HTMLInputElement, window.HTMLSelectElement, window.HTMLTextAreaElement]
    const triggerInputChange = (node, value = "") => {
        // only process the change on elements we know have a value setter in their constructor
        if (inputTypes.indexOf(node.__proto__.constructor) > -1) {
            const setValue = Object.getOwnPropertyDescriptor(node.__proto__, "value").set
            const event = new Event("input", { bubbles: true })

            setValue.call(node, value)
            node.dispatchEvent(event)
        }
    }
    const kp1 = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        keyCode: 13,
    })
    const kp2 = new KeyboardEvent("keyup", {
        bubbles: true,
        cancelable: true,
        keyCode: 13,
    })
    // https://stackoverflow.com/a/34896387
    document.addEventListener("click", function (e) {
        const target = e.target.closest("a.status-link.unhandled-link") // Or any other selector.

        if (target) {
            let h = target.href
            if (h.match(/^.*?\/\/[^\/]+\/((@[^\/]+)|(notes))\//) || h.match(/^.*?:\/\/bird\.makeup\/user\.*/) || h.match(/^.*?\/\/[^\/]+\/users\/[^\/]+\/statuses\/\d+/)) {
                e.preventDefault()
                console.log(h)
                triggerInputChange(document.querySelector("input.search__input"), h)
                document.querySelector("input.search__input").dispatchEvent(kp1)
                document.querySelector("input.search__input").dispatchEvent(kp2)
                return false
            } else {
            }
        }
    })
})();