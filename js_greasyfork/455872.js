// ==UserScript==
// @name         请大家不要聚集！
// @namespace    http://tampermonkey.net/
// @description  请大家不要聚集！ 是一个油猴脚本，也是一项行为艺术。它可以帮您把知乎上点赞数大于 3 的回答，自动按下一个反对键。
// @version      0.1
// @description  try to take over the world!
// @author       Sheepzh
// @match        https://www.zhihu.com/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455872/%E8%AF%B7%E5%A4%A7%E5%AE%B6%E4%B8%8D%E8%A6%81%E8%81%9A%E9%9B%86%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/455872/%E8%AF%B7%E5%A4%A7%E5%AE%B6%E4%B8%8D%E8%A6%81%E8%81%9A%E9%9B%86%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // The min threshold to vote down
    var THRESHOLD = 3;
    var ZHIHU_CONTAINER = 'ContentItem-actions';

    // Process the container of vote buttons
    function processZhihuContainer(container) {
        var voteUpBtn = container.getElementsByClassName('VoteButton--up')?.[0]
        if(!voteUpBtn || voteUpBtn?.classList?.contains['is-active']){
            return;
        }
        var voteUpTxt = voteUpBtn?.innerText?.replaceAll('\n', '')
        if(!voteUpTxt){
            return;
        }
        if (!voteUpTxt.endsWith('万')){
            var voteUpCountTxt = /^.*?(\d+)$/.exec(voteUpTxt)?.[1]
            if(!voteUpCountTxt){
                return;
            }
            var voteUpCountVal = parseInt(voteUpCountTxt)
            if(!voteUpCountVal || voteUpCountVal < THRESHOLD){
                return;
            }
        }

        // need vote down
        var voteDownButton = container.getElementsByClassName('VoteButton--down')?.[0]
        if(!voteDownButton || voteDownButton.classList?.contains('is-active')){
           return;
        }
        // Click
        console.log('Try to click', voteDownButton)
        voteDownButton && voteDownButton?.click?.()
    }

    // Handle new nodes
    function observeZhihuMutation(){
        new MutationObserver(events => {
            events.forEach(event => {
                var addedNodes = event.addedNodes
                if (!addedNodes) {
                    return;
                }
                addedNodes.forEach(node => {
                    var containers = document.getElementsByClassName(ZHIHU_CONTAINER);
                    Array.from(containers).forEach(processZhihuContainer);
                })
            })
        }).observe(document, { attributes: false, childList: true, subtree: true })
    }

    function processZhihu(){
        var allContainers = document.getElementsByClassName(ZHIHU_CONTAINER);
        Array.from(allContainers).forEach(processZhihuContainer)
        observeZhihuMutation()
    }

    processZhihu();
})();