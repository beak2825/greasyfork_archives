// ==UserScript==
// @name         虎扑各项细节优化
// @version      0.3
// @description  手机虎扑自动跳转网页版+清空多余参数+操作细节优化
// @author       233yuzi
// @match        *://bbs.hupu.com/*
// @match        *://m.hupu.com/bbs-share/*
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @license MIT
// @namespace https://greasyfork.org/users/759046
// @downloadURL https://update.greasyfork.org/scripts/467481/%E8%99%8E%E6%89%91%E5%90%84%E9%A1%B9%E7%BB%86%E8%8A%82%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/467481/%E8%99%8E%E6%89%91%E5%90%84%E9%A1%B9%E7%BB%86%E8%8A%82%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('启动成功')
    mobileToPc()
    openInNewWindow()

    //移动端自动跳转PC
    function mobileToPc() {
        let reg = RegExp(/bbs-share/)
        let a = location.href
        if (a.match(reg)) {
            a = a.replace("m.", "bbs.")
            a = a.replace("/bbs-share", "")
            a = a.split('?')[0]
            location.href = a
        }
    }
    //点击链接新窗口打开
    function openInNewWindow() {
        document.addEventListener('click', (e) => {
            const pattern = /my.hupu.com/
            let target = e.target
            // console.log(target.innerHTML)
            //帖子实现新标签页打开
            if (target.className === 'p-title') {
                goto(e, target.href)
            }
            //top栏实现新标签页打开
            else if (target.className === 'notificatText') {
                if (target.innerHTML === '消息') {
                    goto(e, 'https://my.hupu.com/message?tabKey=1')
                } else {
                    goto(e, 'https://my.hupu.com/personalMessage')
                }
            }
            else if (pattern.test(target.href)) {
                goto(e, target.href)
            }
        }, true)
    }
    //跳转
    function goto(e, href) {
        e.preventDefault()
        e.stopPropagation()
        window.open(href)
        return false
    }
})();