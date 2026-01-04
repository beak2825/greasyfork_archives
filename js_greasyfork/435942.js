// ==UserScript==
// @name         高能榜显示总人数
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  听说有人想要把高能榜当同接参考？
// @author       Eric Lam
// @license      MIT
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/435942/%E9%AB%98%E8%83%BD%E6%A6%9C%E6%98%BE%E7%A4%BA%E6%80%BB%E4%BA%BA%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/435942/%E9%AB%98%E8%83%BD%E6%A6%9C%E6%98%BE%E7%A4%BA%E6%80%BB%E4%BA%BA%E6%95%B0.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    // ====== 设定 ==========
    const seconds = 5 // 隔 X 秒侦测

    // =====================

    const roomReg = /^\/(blanc\/)?(?<id>\d+)/
    let roomId = parseInt(roomReg.exec(location.pathname)?.groups?.id)

    const res = await fetcher('https://api.live.bilibili.com/room/v1/Room/room_init?id=' + roomId)

    if (res.data.live_status != 1) {
        console.warn(`不在直播，已略过`)
        return
    }

    roomId = res.data.room_id
    const uid = res.data.uid

    let rankGold = undefined

    while ($('.tab-list.dp-flex').children().length == 0) {
        console.warn(`找不到Tab元素，等待3秒。`)
        await new Promise((res,) => setTimeout(res, 3000)) // wait 3 seconds
    }

    const keywords = ['高能榜', '高能用户', '应援日榜']
    let keyword;
    for (const element of $('.tab-list.dp-flex').children()) {
        console.log(element.innerText)
        const kw = keywords.find(s => element.innerText.startsWith(s))
        console.log(kw)
        if (kw) {
            rankGold = element
            keyword = kw
        }
    }

    if (!rankGold || !keyword) {
        console.warn(`找不到高能榜元素。`)
        return
    }

    setInterval(async () => {
        let online = 0
        let online2 = 0
        try {
            const data = await fetcher(`https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=${uid}&roomId=${roomId}&page=1&pageSize=1`)
            online = data.data.onlineNum
        } catch (err) {
            console.warn(`查询高能榜时出现错误: ${err}`)
            console.warn(err)
        }
        try {
            const data2 = await fetcher(`https://api.live.bilibili.com/xlive/general-interface/v1/rank/queryContributionRank?ruid=${uid}&room_id=${roomId}&page=1&page_size=1&type=online_rank&switch=contribution_rank`)
            online2 = data2.data.count
        } catch (err) {
            console.warn(`查询贡献榜时出现错误: ${err}`)
            console.warn(err)
        }
        rankGold.innerHTML = `<span title="高能用戶(左): ${online}\n贡献用户(右): ${online2}">${keyword}(${online}/${online2})</span>`
    }, seconds * 1000)
})().catch(console.warn);



async function fetcher(url) {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error(res.statusText)
    }

    const data = await res.json()
    console.debug(data)
    if (data.code != 0) {
        throw new Error(`B站API请求错误: ${data.message}`)
    }
    return data
}
