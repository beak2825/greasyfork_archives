// ==UserScript==
// @name         hostloc 自动屏蔽黑名单用户
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  自动获取 hostloc 的黑名单，并屏蔽相应帖子
// @author       susc
// @match        http*://*.hostloc.com/*
// @grant        unsafeWindow
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/402309/hostloc%20%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E9%BB%91%E5%90%8D%E5%8D%95%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/402309/hostloc%20%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E9%BB%91%E5%90%8D%E5%8D%95%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    // 脚本内部使用，在此处修改无效
    var CONFIG = {
        blockList: [],
        blockedPIDs: [],
        blockedCount: 0
    }
    
    // 根据页数获取黑名单
    async function getBlackListByPage(page) {
        let response
        try {
            response = await fetch(`/home.php?mod=space&do=friend&view=blacklist&page=${page}`)
        } catch (e) {
            console.log('获取黑名单失败')
            console.log(e)
            return []
        }
        let html = await response.text()
        let regList = html.match(/<a\shref="space-uid-.+html">([^<].+)<\/a>/g)
        if (!regList) {
            return []
        }
        let blacklist = regList.map(i => i.replace(/<.+?>/g, ''))
        console.log(`获取第${page}页黑名单成功: ${blacklist}`)
        return blacklist
    }
    
    // 获取黑名单
    let currentPage = 1
    let finish = false
    while (!finish) {
        console.log(`获取第${currentPage}页黑名单`)
        let blacklist = await getBlackListByPage(currentPage)
        if (blacklist.length === 0) {
            finish = true
        }
        else {
            CONFIG.blockList = CONFIG.blockList.concat(blacklist)
            currentPage++
        }
    }

    // 帖子列表页面
    var authorNodes = document.querySelectorAll('th + .by cite a')
    authorNodes.forEach(function (item) {
        if (CONFIG.blockList.includes(item.innerText.trim())) {
            var $wrapper = item.parentElement.parentElement.parentElement.parentElement
            var $list = $wrapper.parentElement
            $list.removeChild($wrapper)
            CONFIG.blockedCount++
        }
    })

    // 帖子列表点击下一页
    var $postList = document.querySelector('#threadlisttableid')
    if ($postList) {
        var post_mo = new MutationObserver(function (mList) {
            authorNodes = document.querySelectorAll('th + .by cite a')
            authorNodes.forEach(function (item) {
                if (CONFIG.blockList.includes(item.innerText.trim())) {
                    var $wrapper = item.parentElement.parentElement.parentElement.parentElement
                    var $list = $wrapper.parentElement
                    $list.removeChild($wrapper)
                    CONFIG.blockedCount++
                    console.log('Blocked: ' + CONFIG.blockedCount)
                }
            })
        })
        post_mo.observe($postList, {
            childList: true
        })
    }

    // 帖子详情页面
    authorNodes = document.querySelectorAll('.authi a.xw1');
    authorNodes.forEach(function (item) {
        if (CONFIG.blockList.includes(item.innerText.trim())) {
            var $wrapper = item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
            var id = Number(item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id.replace('pid', ''))
            CONFIG.blockedPIDs.push(id)
            var $list = $wrapper.parentElement
            $list.removeChild($wrapper)
            CONFIG.blockedCount++
        }
    })

    // 针对隐藏楼层
    if (unsafeWindow.blockedPIDs) {
        CONFIG.blockedPIDs.forEach(function (id) {
            for (var i = 0; i < unsafeWindow.blockedPIDs.length; i++) {
                if (unsafeWindow.blockedPIDs[i] === id) {
                    unsafeWindow.blockedPIDs.splice(i, 1)
                    CONFIG.blockedCount++
                }
            }
        })
        if (!unsafeWindow.blockedPIDs.length) {
            document.querySelector('#hiddenpoststip').style.display = 'none'
        }
    }

    // 针对点评
    let $specialComments = document.querySelectorAll('.pstl')
    $specialComments.forEach(function (item) {
        let $author = item.querySelector('.psta .xi2')
        if ($author && CONFIG.blockList.includes($author.innerText.trim())) {
            let commentId = item.parentElement.id
            item.parentElement.removeChild(item)
            // 若点评列表无内容，则隐藏点评列表
            if (document.querySelectorAll(`#${commentId} .pstl`).length === 0) {
                document.querySelector(`#${commentId}`).style.display = 'none'
            }
            CONFIG.blockedCount++
        }
    })
    console.log('Blocked: ' + CONFIG.blockedCount)
})();