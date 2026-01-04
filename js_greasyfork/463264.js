// ==UserScript==
// @name         PT站删除无效邮件
// @namespace    https://www.aoaostar.com/
// @version      0.1
// @description  快速删除PT站内无效邮件
// @author       Pluto
// @match        *://*/messages.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aoaostar.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/463264/PT%E7%AB%99%E5%88%A0%E9%99%A4%E6%97%A0%E6%95%88%E9%82%AE%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/463264/PT%E7%AB%99%E5%88%A0%E9%99%A4%E6%97%A0%E6%95%88%E9%82%AE%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const messageD = document.querySelectorAll('form table td> a');
    if (messageD.length <= 0) {
        console.log("执行完毕")
        return
    }

    const lese = []
    messageD.forEach((v, k) => {
        if (
            v.textContent.includes('中奖通知') ||
            v.textContent.includes('获得道具')
        ) {
            const href = v.getAttribute('href');
            lese.push(parseInt(href.slice(href.lastIndexOf('id=') + 3)))
        }
    })
    const searchParams = new URLSearchParams(window.location.search)
    if (lese.length <= 0) {
        window.location.href = "?page=" + (+(searchParams.get('page') || 1) + 1)
        return;
    }
    const params = {
        action: 'moveordel',
        delete: '删除',
        box: 1,
    }
    let body = (new URLSearchParams(params)).toString()
    for (const v of lese) {
        body += `&messages[]=${v}`
    }
    const func = () => {
        return fetch("/messages.php", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
            },
            "body": body,
            "method": "POST",
        }).then(r => {
            if (r.status === 200) {
                console.log(`删除成功, 共计 ${lese.length} 条`, lese)
                window.location.reload()
                return
            }
            console.log('删除失败，重试中', lese)
            func()
        })
    }
    func()


})();