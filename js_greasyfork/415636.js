// ==UserScript==
// @name        niconico slot count changer
// @namespace   rinsuki.net
// @match       https://www.nicovideo.jp/watch/*
// @version     1.0.1
// @grant       GM_getValue
// @grant       GM_setValue
// @author      rinsuki
// @description ニコニコ動画の最大同時コメント表示数を変更できるUserScriptです。デフォルトでは標準と同じ40になっているので、GM_valueのSlotCountを変更してください。※注意: 増やせば増やすほどメモリを食います(実際にそれだけのコメントがなくても)
// @downloadURL https://update.greasyfork.org/scripts/415636/niconico%20slot%20count%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/415636/niconico%20slot%20count%20changer.meta.js
// ==/UserScript==

(() => {
    const loadedSlotCount = GM_getValue("SlotCount")
    const EXPECT_SLOT_COUNT = Math.min(100000, typeof loadedSlotCount === "number" && Number.isSafeInteger(loadedSlotCount) && loadedSlotCount > 0 ? loadedSlotCount : 40)
    GM_setValue("SlotCount", EXPECT_SLOT_COUNT)

    function getReactInternalInstance(dom) {
        for (const key in dom) {
            if (key.startsWith("__reactInternalInstance$")) return dom[key]
        }
    }
    const observer = new unsafeWindow.MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.target.id === "CommentRenderer") {
                    const commentRenderer = mutation.target
                    const commentRendererInstance = getReactInternalInstance(commentRenderer).return.stateNode.renderer
                    /** @type {Function} */
                    const orig = commentRendererInstance.__proto__.registerLayerProcessorEvents
                    commentRendererInstance.__proto__.registerLayerProcessorEvents = function(layer) {
                        /** @type {{_stagingList: unknown[], reservedList: unknown[]}} */
                        const slotRepository = layer.slotRepository
                        const slotClass = (slotRepository._stagingList[0] ?? slotRepository.reservedList[0]).constructor
                        while (true) {
                            const currentSlot = slotRepository._stagingList.length + slotRepository.reservedList.length
                            if (currentSlot > EXPECT_SLOT_COUNT) {
                                if (slotRepository.reservedList.length) {
                                    slotRepository.reservedList.pop()
                                } else {
                                    slotRepository._stagingList.pop()
                                }
                            } else if (currentSlot < EXPECT_SLOT_COUNT) {
                                const slot = new slotClass
                                slotRepository.reservedList.push(slot)
                            } else {
                                break
                            }
                        }
                        orig.call(this, layer)
                    }
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