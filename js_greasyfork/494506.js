// ==UserScript==
// @name         NGA查看曾用名
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在用户中心界面展示用户的曾用名(如果有。对版主无效)
// @author       monat151
// @match        https://bbs.nga.cn/nuke.php?func=ucp&uid=*
// @match        https://bbs.nga.cn/nuke.php?func=ucp&username=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494506/NGA%E6%9F%A5%E7%9C%8B%E6%9B%BE%E7%94%A8%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/494506/NGA%E6%9F%A5%E7%9C%8B%E6%9B%BE%E7%94%A8%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getUserPreviousNames(uid, cb) {
        window.__NUKE.doRequest2(
            'f',function(d){
                let previousNames = []
                if (d?.data && d.data[0]) {
                    for (const i in d.data[0]) {
                        previousNames.push(d.data[0][i])
                    }
                }
                cb(previousNames)
            },
            'u',window.__API._base+'__lib=ucp&__act=oldname&__output=3',
            'uid', uid
        )
    }
    function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
        var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
        return Y+M+D+h+m+s;
    }

    const pageModifier = () => {
        const pageInfo = window.__UCPUSER
        const uid = pageInfo.uid
        const userName = pageInfo.username
        if (pageInfo._greater) return
        getUserPreviousNames(uid, pNames => {
            console.warn('pNames', pNames)
            if (!pNames.length) return

            let content = ''
            for (let i = 0; i < pNames.length; i++) {
                const pNameInfo = pNames[i]
                if (content) content += '<br>'
                const time = timestampToTime(pNameInfo.time)
                content += pNameInfo.username + ' 修改于' + time
            }

            const container = document.createElement('span')
            container.innerHTML = `
            <h2 class="catetitle">:: ${userName} 的曾用名 :: <img src="about:blank" style="display: none;"></h2>
            <div class=" cateblock" style="text-align: left; line-height: 1.8em;">
              <div class="contentBlock" style="padding: 5px 10px;">
                <span>${content}</span>
                <div class="clear"></div>
              </div>
            </div>`
            const blockUserInfo = document.getElementById('ucpuser_info_block')
            blockUserInfo.after(container)
        })
    }

    const _CONFIG_MAX_RETRY_TIME = 30

    var retry_times = 0

    const _interval = setInterval(() => {
        retry_times++
        if (retry_times > _CONFIG_MAX_RETRY_TIME) {
            console.error('[Nga查看曾用名] 页面信息不足或异常错误，并且已达到最大重试次数。')
            clearInterval(_interval)
        }
        if (
            window.__UCPUSER && window.__NUKE && window.__API
            && document.getElementById('ucpuser_info_block')
        ) {
            pageModifier()
            clearInterval(_interval)
        }
    }, 200)
})();