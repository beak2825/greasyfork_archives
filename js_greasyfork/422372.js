// ==UserScript==
// @name         微博拉黑所有点赞用户
// @namespace    Tan
// @version      0.1
// @description  批量拉黑微博点赞用户
// @match        *://weibo.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422372/%E5%BE%AE%E5%8D%9A%E6%8B%89%E9%BB%91%E6%89%80%E6%9C%89%E7%82%B9%E8%B5%9E%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/422372/%E5%BE%AE%E5%8D%9A%E6%8B%89%E9%BB%91%E6%89%80%E6%9C%89%E7%82%B9%E8%B5%9E%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createBlockLink(params) {
        const link = document.createElement('a')
        link.href = 'javascript:void(0);'
        link.onclick = blockAll.bind(link, params)
        link.innerText = '拉黑评论及点赞'
        link.className = 'S_txt1'

        const li = document.createElement('li')
        li.className = 'hover'

        const span = document.createElement('span')
        span.className = 'line S_line1'

        span.appendChild(link)
        li.appendChild(span)
        return li
    }

    const injected = new Set()
    function injectBlock() {
        const links = Array.from(
            document.querySelectorAll('[action-type="fl_like"]'))
        .filter(x => {
            const data = x.attributes['action-data'] && x.attributes['action-data'].value
            if(!data) return false
            return data.indexOf('object_type=comment') != -1 && !injected.has(data)
        })

        links.forEach(link => {
            const actionData = link.attributes['action-data'].value
            link.closest('.WB_handle ul').prepend(createBlockLink(actionData))
            injected.add(actionData)
        })
    }

    setInterval(injectBlock, 1000)

    async function getLikePage(actionData, page = 1) {
        const res = await fetch(`https://www.weibo.com/aj/like/object/big?ajwvr=6&page=${page}&${actionData}`)
        if(res.status === 200) {
            const json = await res.json()
            return [json.data.page.totalpage, Array.from(json.data.html.matchAll(/uid=['"](.+?)['"]/ig))
                .map(x => x[1])]
        } else {
            alert(res.statusText);
        }
        return [0, []]
    }

    async function getLikeData(actionData) {
        const uids = []
        const [page, uid] = await getLikePage(actionData)
        uids.push(...uid);
        if(page > 1) {
            const pages = new Array(page-1).fill(0).map((x, i) => i + 2)
            const datas = await Promise.all(pages.map(x => getLikePage(actionData, x)))
            datas.forEach(x => {
                uids.push(...x[1])
            })
        }
        return uids
    }

    async function blockUser(uid) {
        const res = await fetch('https://www.weibo.com/aj/filter/block?ajwvr=6', {
            method: 'POST',
            body: `uid=${uid}&filter_type=1&status=1&interact=1&follow=1`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        console.log("block " + uid)
        return await res.json()
    }

    async function blockAll(actionData) {
        if (!(window.confirm("Confirm"))) {
            return
        }

        const link = this
        link.onclick = undefined
        this.innerText = `正在获取点赞用户...`
        const uids = await getLikeData(actionData)
        const comment = actionData.match(/o_uid=(\d+)/)
        if(comment.length > 0) uids.push(comment[1])
        let failed = [...uids]

        const blockUsers = async function(evt) {
            const refailed = []
            link.innerText = `已拉黑 0/${failed.length}`

            for(var i = 0; i < failed.length; i++) {
                const data = await blockUser(failed[i])
                if(data.code != '100000') refailed.push(failed[i])

                link.innerText = `已拉黑 ${i+1}/${failed.length}: ${data.msg}`
            }

            if(refailed.length > 0) {
                link.innerText = `再次尝试拉黑剩余${refailed.length}人`
                link.onclick = blockUsers

            } else {
                link.onclick = undefined
                link.innerText = uids.length + '人已全部拉黑'
                link.style.color = '#CCC'
            }

            failed = refailed
            evt && evt.stopPropagation()
        }
        await blockUsers()
}

})();