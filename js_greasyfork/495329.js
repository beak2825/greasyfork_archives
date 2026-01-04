// ==UserScript==
// @name         扇贝阅读单词自动发音
// @namespace    http://tampermonkey.net/
// @version      2024-05-17
// @description  文章阅读页面，点击单词显示释义的同时自动发音该单词
// @author       CTRN43062
// @match        https://web.shanbay.com/reading/web-news/articles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shanbay.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495329/%E6%89%87%E8%B4%9D%E9%98%85%E8%AF%BB%E5%8D%95%E8%AF%8D%E8%87%AA%E5%8A%A8%E5%8F%91%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/495329/%E6%89%87%E8%B4%9D%E9%98%85%E8%AF%BB%E5%8D%95%E8%AF%8D%E8%87%AA%E5%8A%A8%E5%8F%91%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let wordCardObs = null;
    const metaInfo = document.querySelector('.meta-info')

    // Your code here...
    const obs = new MutationObserver((mutationsList) => {
        for(const m of mutationsList) {
            if(m.type === 'childList') {
                const { addedNodes, removedNodes } = m

                if(addedNodes.length === 1 && addedNodes[0].className === 'word-card') {
                    const wordCard = addedNodes[0]
                    wordCard.querySelector('.volume').click()

                    wordCardObs = new MutationObserver((mutationList) => {
                      for(const m of mutationList) {
                        if(m.type === 'attributes') {
                          setTimeout(() => metaInfo.querySelector('.volume').click(), 200)
                        }
                      }
                    })

                    wordCardObs.observe(wordCard, { 'attributes': true })
                } else if (removedNodes.length === 1 && removedNodes[0].className === 'word-card' && wordCardObs) {
                   wordCardObs.disconnect()
                }
            }
        }
    })

    obs.observe(metaInfo, { childList: true, subtree:true})
})();