// ==UserScript==
// @name         NBA-VIP
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  不用解释，会用的真香!
// @author       w__yi
// @match        https://123kzb.net/player/*
// @include      *://123kzb.net/player/*
// @match        https://dszbok.com/player/*
// @include      *://dszbok.com/player/*
// @match        https://player.huminbird.cn/*
// @include      *://*.huminbird.cn/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_log
// @charset		 UTF-8
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/463893/NBA-VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/463893/NBA-VIP.meta.js
// ==/UserScript==

function init_Vip(obj) {
    GM_log("执行init_Vip()");
    //GM_log("matchinfo：" + JSON.stringify(matchData.matchinfo));
    const live_urls = (matchData.matchinfo.live_urls || []).filter(item => item.status == 1);
    if (live_urls.length > 0) {
        const source_list = (addLanG().concat(live_urls)).map((item, index) => item.isLang ? `<span class='source-item' data-index='-1'>${item.name}</span>` : `<span class='source-item' data-index='${addLanG().length > 0 ? index - 1 : index}'>${item.name}-VIP</span>`).join('');
        $(obj).empty();
        $(obj).append(source_list);
        classAddRemove(addLanG().length > 0 ? 1 : 0);
        const qualityItem = document.querySelectorAll('.source-item')
        qualityItem.forEach((el) => {
            const ind = el.dataset.index || 0;
            const sIndex = addLanG().length > 0 ? 1 : 0;
            el.addEventListener(
                'click',
                (event) => {
                    window.event ? (window.event.cancelBubble = true) : event.stopPropagation()
                    classAddRemove((ind - 0) + sIndex);
                    video.url = video.quality[ind - 0].url;
                    video.defaultQuality = ind - 0;
                    initMatchVideo();
                },
                false
            )
        });
    }
}

function findTargetElement(targetContainer) {
    const body = window.document;
    let tabContainer;
    let tryTime = 0;
    const maxTryTime = 100;
    let startTimestamp;
    return new Promise((resolve, reject) => {
        function tryFindElement(timestamp) {
            if (!startTimestamp) {
                startTimestamp = timestamp;
            }
            const elapsedTime = timestamp - startTimestamp;

            if (elapsedTime >= 500) {
                GM_log("查找元素：" + targetContainer + "，第" + tryTime + "次");
                tabContainer = body.querySelector(targetContainer);
                if (tabContainer) {
                    resolve(tabContainer);
                } else if (++tryTime === maxTryTime) {
                    reject();
                } else {
                    startTimestamp = timestamp;
                }
            }
            if (!tabContainer && tryTime < maxTryTime) {
                requestAnimationFrame(tryFindElement);
            }
        }

        requestAnimationFrame(tryFindElement);
    });
}


function removeAds(displayNodes) {
    displayNodes.forEach((item, index) => {
        findTargetElement(item)
            .then((obj) => obj.remove())
            .catch(e => console.warn("不存在元素", e));
    });
}

(function () {
    if (location.host !== 'player.huminbird.cn') {
        GM_log("脚本加载成功");
        removeAds([".chartNewRoot", ".pc_appkhd", ".iconVS", "#DownloadIcon"]);
        findTargetElement("#videoiframe")
            .then((obj) => {
                findTargetElement('#is_showShop')
                    .then((obj) => {
                        const url = $("#videoiframe").attr("src");
                        $('#is_showShop').append(`<a href="${url}"  style="font-size: 20px;color: red;font-weight: 600;border: 1px solid;margin: 5px;display: inline-block;padding: 5px;">内容源地址入口</a>`)
                    }).catch(e => GM_log("不存在元素[#is_showShop]" + e));
            }).catch(e => GM_log("不存在元素[#videoiframe]"));
    } else {
        GM_log("huminbird脚本加载成功");
        findTargetElement(".source_list")
            .then((obj) => init_Vip(obj))
            .catch(e => GM_log("不存在元素[.source_list]"));
    }
})();