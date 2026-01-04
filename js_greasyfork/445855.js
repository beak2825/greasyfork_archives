// ==UserScript==
// @name         bilibili-ads-rm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除bilibili 动态广告 推广
// @author       You
// @match        https://t.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js

// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445855/bilibili-ads-rm.user.js
// @updateURL https://update.greasyfork.org/scripts/445855/bilibili-ads-rm.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function hasKeyWord(child) {

        let keywords = ["taobao.com", "pinduoudo.com", "特惠价", '放心囤', '安心吃', '买贵我请', '领独家优惠券', '现金红包', '赠运费险', '京东红包', '豆角怎么做更入味', '天猫红包', '互动抽奖', 'https://tb', '年卡']

        for (let i = 0; i < keywords.length; i++) {
            const k = keywords[i];
            if (child.textContent.includes(k)) {
                return true
            }
        }

        return false
    }

    function checkBan(item) {
        let flag = false
        let list = item.querySelector("div.bili-dyn-content__orig__desc > div > div")

        if (list) {
            if (list.children.length > 0) {

                let childs = list.children

                for (let childIdx = 0; childIdx < childs.length; childIdx++) {
                    const child = childs[childIdx];
                    if (hasKeyWord(child)) {
                        flag = true
                        break
                    }
                }
            }


        }

        return flag
    }


    const container = document.querySelector("#app")
    const config = {
        attributes: false, // 检测节点属性变化，这里用不到，为减少不必要的触发这里不用开启
        childList: true, // 检测子节点添加和删除
        subtree: true // 检测包含后代节点
    };
    const mutationCallback = mutationsList => {
        for (let mutation of mutationsList) {
            const type = mutation.type;
            const addedNodes = mutation.addedNodes;

            switch (type) {
                case 'childList':
                    if (addedNodes.length > 0) {
                        var list = $('.bili-dyn-list__item');
                        if (list.children().length) {
                            let items = list
                            for (let index = 0; index < list.length; index++) {
                                const item = items[index];
                                let f = checkBan(item)
                                if (f) {
                                    item.remove()
                                }

                            }

                        }
                    }
                    break;
            }
        }
    };

    const loadObserver = createNodeListener(container, config, mutationCallback);

    function createNodeListener(node, config, mutationCallback) {
        const observer = new MutationObserver(mutationCallback);
        observer.observe(node, config);
        return observer;
    }

})();