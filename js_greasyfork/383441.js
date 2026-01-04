// ==UserScript==
// @id             BilibiliWatchlaterRedirect@Laster2800
// @name           B站「稍后再看」重定向
// @version        1.5.0.20210423
// @namespace      laster2800
// @author         Laster2800
// @description    B站「稍后再看」播放页重定向至常规播放页面
// @include        *://www.bilibili.com/medialist/play/watchlater/*
// @include        *://www.bilibili.com/watchlater/*
// @grant          GM_xmlhttpRequest
// @connect        api.bilibili.com
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/383441/B%E7%AB%99%E3%80%8C%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E3%80%8D%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/383441/B%E7%AB%99%E3%80%8C%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E3%80%8D%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    alert('【B站「稍后再看」重定向】\n\n脚本已于最近B站改版后失效，请迁移至【 https://greasyfork.org/zh-CN/scripts/395456-b站稍后再看功能增强 】。')
    window.open('https://greasyfork.org/zh-CN/scripts/395456')
    if (/bilibili.com\/medialist\/play\/watchlater\//.test(location.href)) {
        window.stop()
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.bilibili.com/x/v2/history/toview/web?jsonp=jsonp`,
            onload: function(response) {
                if (response && response.responseText) {
                    try {
                        var part = parseInt(location.href.match(/(?<=\/watchlater\/p)\d+(?=\/?)/)[0])
                        var json = JSON.parse(response.responseText)
                        var watchList = json.data.list
                        location.replace('https://www.bilibili.com/video/' + watchList[part - 1].bvid)
                    } catch(e) {
                        console.error('重定向错误。该脚本已合并到【 https://greasyfork.org/zh-CN/scripts/395456-b站稍后再看功能增强 】，不再考虑更新。若本次错误为致命性错误，说明本脚本已不适用于当前B站版本，请迁移至新脚本。')
                        console.error(e)
                    }
                }
            }
        })
    }
})()