// ==UserScript==
// @name         Back to top
// @namespace    cyyyu
// @version      0.7
// @description  scroll to top
// @author       Chuang Yu
// @match        https://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/405732/Back%20to%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/405732/Back%20to%20top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* written in es5 */

    var rootNode = document.querySelector("body")
    var prevLocations = new Map() // node: number
    var timers = new Map() // node: number
    var backToPrevLocationDelay = 10000 // 10s

    rootNode.addEventListener("dblclick", function (evt) {
        var path = evt.composedPath()

        if (!evt.altKey) return
        for (var i = 0; i < path.length; i++) {
            var node = path[i]
            if (!isScrollable(node)) continue;

            evt.stopPropagation()

            if (!isAtTop(node)) {
                clearTimeout(timers.get(node))
                scrollTo(node, 0)
            } else if (prevLocations.has(node)) {
                scrollTo(node, prevLocations.get(node))
            }

            return
        }
    })

    function isAtTop(node) {
        return node.scrollTop === 0
    }

    function scrollTo(node, top) {
        var prevScrollBehavior = node.style.scrollBehavior
        var prevLocation = node.scrollTop

        node.style.scrollBehavior = "smooth"
        node.scrollTop = top
        node.style.scrollBehavior = prevScrollBehavior

        if (top === 0) {
            prevLocations.set(node, prevLocation)
            var timer = setTimeout(
                function () { prevLocations.delete(node) },
                backToPrevLocationDelay
            )
            timers.set(node, timer)
        }
    }

    function isScrollable(node) {
        if (!(node instanceof Element)) return false
        var computed = window.getComputedStyle(node)
        return (node.tagName === "HTML" ||
                (computed.overflow !== "visible" &&
                 computed.overflow !== "hidden")
               ) &&
            node.scrollHeight > node.clientHeight
    }

})();