// ==UserScript==
// @name         BiliBiliTags
// @name zh-CN   B站关注页面显示标签
// @namespace    http://tampermonkey.net/BiliBiliTags
// @version      0.1.3
// @description  Display Tag for each following
// @author       You
// @match        https://space.bilibili.com/*/fans/follow*
// @connect      api.bilibili.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419962/BiliBiliTags.user.js
// @updateURL https://update.greasyfork.org/scripts/419962/BiliBiliTags.meta.js
// ==/UserScript==

(function () {
    'use strict';
     function getFollowList() {
        return document.querySelector('.follow-content.section').querySelector(".content").querySelector('ul')
    }

    function update() {
        let items = getFollowList().querySelectorAll('.list-item')
            for (let item of items) {
                let uid = /\d+/.exec(item.querySelector('.cover').getAttribute('href'))[0]
                GM_xmlhttpRequest({
                    method: 'get', url: `https://api.bilibili.com/x/relation/tag/user?fid=${uid}&jsonp=jsonp`,
                    onload: (xhr) => {
                        let ret = JSON.parse(xhr.responseText).data
                        if (Object.keys(ret).length !== 0) {

                            item.querySelector('.fans-action-text').innerText = '<' + Object.values(ret).join(', ') + '>';
                        } else {
                            item.querySelector('.fans-action-text').innerText = '<默认分组>';
                            item.querySelector('.fans-action-text').style.color = "#ff9999";
                        }
                    }
                })
            }
    }

    var inter = window.setInterval(function () {
        if (getFollowList() != undefined) {
            clearInterval(inter)
            update()
            const observer = new MutationObserver(function (mutationsList, observer) { update() });
            observer.observe(getFollowList(), { attributes: false, childList: true, subtree: false });
        }
    }, 1000);

})();