// ==UserScript==
// @name        niconico unlimited comment slot
// @namespace   rinsuki.net
// @match       https://www.nicovideo.jp/watch/*
// @version     1.0.1
// @grant       GM_getValue
// @grant       GM_setValue
// @author      rinsuki
// @description ニコニコ動画の最大同時コメント表示数を撤廃します。
// @downloadURL https://update.greasyfork.org/scripts/446556/niconico%20unlimited%20comment%20slot.user.js
// @updateURL https://update.greasyfork.org/scripts/446556/niconico%20unlimited%20comment%20slot.meta.js
// ==/UserScript==

(() => {
    function getReactInternalInstance(dom) {
        for (const key in dom) {
            if (key.startsWith("__reactInternalInstance$")) return dom[key]
        }
    }
    function doIt(commentRenderer) {
        const commentRendererInstance = getReactInternalInstance(commentRenderer).return.stateNode.renderer
        /** @type {Function} */
        const orig = commentRendererInstance.__proto__.registerLayerProcessorEvents
        function patch(layer) {
            /** @type {{_stagingList: unknown[], reservedList: unknown[], _getReserved: () => unknown, __proto__: {_stagingList: unknown[], reservedList: unknown[], _getReserved: () => unknown, getReserved: () => unknown}}} */
            const slotRepository = layer.slotRepository
            const slotClass = (slotRepository._stagingList[0] ?? slotRepository.reservedList[0]).constructor
            slotRepository.__proto__.getReserved = function() {
                while (this.reservedList.length < 5) this.reservedList.push(new slotClass())
                return this._getReserved()
            }
        }
        commentRendererInstance.__proto__.registerLayerProcessorEvents = function(lp) {
            patch(lp)
            orig.call(this, lp)
        }
        for (const lp of commentRendererInstance.layerProcessorList) {
            patch(lp)
        }
    }
    const observer = new unsafeWindow.MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.target.classList.contains("CommentRenderer")) {
                    const commentRenderer = mutation.target
                    doIt(commentRenderer)
                    observer.disconnect()
                    break
                }
            }
    })
    observer.observe(document.getElementById("js-app"), {
        childList: true,
        subtree: true,
    })
})()