// ==UserScript==
// @name         B 站投稿合集排序插件
// @namespace    http://tampermonkey.net/
// @version      2024-01-02
// @description  给 B 站合集管理页面添加排序按钮
// @license      MIT
// @author       hsfzxjy (hsfzxjy@gmail.com)
// @match        https://member.bilibili.com/platform/upload-manager/ep
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmVmoTlEUx3+XkgeZKUNKhgelUJIHJSFRQqSQ5IG8mUqGMhQSkWcJIUUyPJgflBelTA9eDFGmyFA8GDKcv9bWdpxz79nfd75zzld319e93757+P/3+u+111q3hSZvLU2On3YCZVuwTAsMAWYBZ4HHtR5EWQRGA1eBXsBDYHgzEfDBC3dhBDpEmy0EOgFngPc1nJrAXwN62tx3wORISndrWOvPlBAJLQKO2kZfgfPAEeAS8CMDgCTwU4A7GeamDqmVgL/gK+AYcBh4kLJTQ8CHWkBklwLLgbEpQG+ZVU54EhtjF9bJRtKTbOo6ebd/iAV8zCOAJYBk1S+BjJPYFWCXp/lcwadZYKjpWn66Sk1vxbTo0B75oJIssD7yNDuqhNzDsgHY2RaBLcDmihLYGuESvr8tyQI+gf8mlECsVTxZCeheKG7pWBABvSuKkaT3XAhooaIvtQsxciHwq6CTj28jheROQH69kW1d7I7mTqDWxy8rad/aDbFAGoHOwDJgtQV3U71ERU7gskWy54BTwA3gZwKrwgmI0ApgI9DfA7QG2Gvf1wK7Y2BfA6eBfbGMrHACiy2A8/E9AyYBT6xTHkwZ2OCEE5eHG+b1F05ASY7CabUXFrwdAL7EwCohmgDMA+Z4QWDpBIRzvulb2o4DT7q8jswoQHfiaZkWcHvPtnzhoL2iXb07sAr4BMTHJJErXEIOxAegO/AR6B39XAnssT/qQu8HlAN3AzTWJThxEqUReOnpWlIaDww0dM+jWP4mMNe+a+yAlIehNAIhYbjC9W1VI6Byi7yRvIwvK/3ew+s7aano96oRcHgmWtL/xkov6p8J9AWU9F9PAe66S5NQG7gy/7nhBDIjyWFgbsGcyiTSeJFNeypAzCWc3g4oICuKxDcL/jblRaDIk4/vVZcFVEnWp8ymMqQ+asFllTKBJ+2diYBfRq8aAWE77oNKSg/VtyDKlkZ6A1XHV5U5rd22hCWEcOia9wFVvf+pkGRN0FXfVzCW5IXk7sZFofK9EPRRHtDamvJCWrPN/9xkJSBsM4BDQB8P6Fsrs18IBO+G171mCAFt2gWYDgwClPdejN6HzzWCd9PqWjOUQJ1Y85/eTiD/Mw1bsekt8BtgsAZA2AtOoAAAAABJRU5ErkJggg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483672/B%20%E7%AB%99%E6%8A%95%E7%A8%BF%E5%90%88%E9%9B%86%E6%8E%92%E5%BA%8F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/483672/B%20%E7%AB%99%E6%8A%95%E7%A8%BF%E5%90%88%E9%9B%86%E6%8E%92%E5%BA%8F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const callback = (mList) => {
        for (const mutation of mList) {
            for (const addedNode of mutation.addedNodes) {
                for (const ch of addedNode.childNodes) {
                    if (ch.className === 'ep-edit-wrp') {
                        handleWrapper(ch);
                        return;
                    }
                }
            }
        }
    }
    const ob = new MutationObserver(callback)
    ob.observe(document, { childList: true, subtree: true, })
})();

function handleWrapper(node) {
    const p = node.querySelector('p.ep-edit-info-id')
    if (!p) return;
    console.log(p)
    const id = /合集ID：(\d+)/.exec(p.textContent)[1]
    let btn = document.createElement('button')
    btn.textContent = '按时间顺序排序'
    btn.addEventListener('click', sorter(id, false))
    p.appendChild(btn)
    btn = document.createElement('button')
    btn.textContent = '按时间倒序排序'
    btn.addEventListener('click', sorter(id, true))
    p.appendChild(btn)
}

function sorter(id, desc) {
    return async function () {
        let r = await window.fetch(`https://member.bilibili.com/x2/creative/web/season?id=${id}`)
        let data = await r.json()
        let sectionId = data.data.sections.sections[0].id
        console.log('sectionId', sectionId)
        r = await window.fetch(`https://member.bilibili.com/x2/creative/web/season/section?id=${sectionId}`)
        data = (await r.json()).data
        const eps = data.episodes
        const sorts = eps
            .sort((a, b) => {
                let ret = a.cid - b.cid
                if (desc) ret = -ret
                return ret
            })
            .map((item, i) => ({ id: item.id, sort: i + 1 }))
        const payload = {
            section: {
                id: data.section.id,
                type: data.section.type,
                seasonId: data.section.seasonId,
                title: data.section.title,
            },
            sorts: sorts,
        }
        console.log(payload)
        const csrfToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("bili_jct="))
            ?.split("=")[1];
        console.log(csrfToken)
        r = await window.fetch(`https://member.bilibili.com/x2/creative/web/season/section/edit?csrf=${csrfToken}`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "content-type": "application/json",
            }
        })
        data = await r.json()
        if (data.code === 0) {
            alert("成功！即将刷新")
            document.location.reload()
        }else{
            alert("出错了，请打开开发者工具查看原因")
            console.warn("提交错误", data)
        }
    }
}