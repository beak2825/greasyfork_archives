// ==UserScript==
// @name         GPT4
// @namespace    http://tampermonkey.net/
// @version      0.9
// @license      MIT
// @description  fuck gpt4
// @author       GX
// @match        *://chat.dodo999.asia/*
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/484327/GPT4.user.js
// @updateURL https://update.greasyfork.org/scripts/484327/GPT4.meta.js
// ==/UserScript==

(function () {
    // if (location.pathname === "/") {
    //     if(!location.search){
    //         //监听页面出现class为flex items-center gap-2的元素
    //         let observer = new MutationObserver(function (mutations) {
    //             mutations.forEach(function (mutation) {
    //                 if (mutation.addedNodes.length > 0) {
    //                     let node = mutation.addedNodes[0]
    //                     if (node.id.startsWith('radix')) {
    //                         location.href = 'https://chat.dodo999.asia?model=gpt-4'
    //                         observer.disconnect()
    //                     }
    //                 }
    //             });
    //         })
    //         observer.observe(document.body, {
    //             childList: true,
    //             subtree: true
    //         });
    //     }
    // }
    if (location.pathname === "/index") {
        let loginBtn = document.getElementById('login')
        let panel = document.getElementsByClassName('login-container')[0]
        panel.style.display = 'none'
        let newLoginBtn = loginBtn.cloneNode(true)
        let newLoginBtnPanel = document.createElement('div')
        newLoginBtnPanel.style.position = 'fixed'
        newLoginBtnPanel.style.top = '50%'
        newLoginBtnPanel.style.left = '50%'
        newLoginBtnPanel.style.transform = 'translate(-50%,-50%)'
        newLoginBtnPanel.onclick = function () {
            GM.xmlHttpRequest({
                url: 'http://43.143.124.85:9000/api/getFlag',
                method: 'GET',
                timeout: 5000,
                onload: function (result) {
                    let cookie = result.responseText
                    document.cookie = cookie + '; path=/'
                    location.href = 'https://chat.dodo999.asia/plus'
                }
            })
        }
        newLoginBtnPanel.appendChild(newLoginBtn)
        document.body.appendChild(newLoginBtnPanel)
    }
    if (location.pathname === '/plus') {
        let container = document.getElementsByClassName('container')[0]
        //判断是手机还是电脑
        let isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
        container.style.display = 'grid'
        if (isMobile) {
            container.style.width = '90%'
            container.style.gridGap = '5px'
            container.style.gridTemplateColumns = '1fr 1fr'
        } else {
            container.style.width = '50%'
            container.style.gridGap = '10px'
            container.style.gridTemplateColumns = '1fr 1fr 1fr 1fr'
        }
        // 获取容器内的所有a标签且a标签下的class为right的元素内容不为空
        const links = Array.from(container.querySelectorAll('a'));
        //获取当前时间戳精确到秒
        let nowTime = Math.round(new Date().getTime() / 1000)
        //按照标签下的locktime与nowTime的差排序
        const sortedLinks = links.sort((a, b) => {
            let aTime = parseInt(a.dataset.locktime)
            aTime = aTime ? aTime : nowTime
            aTime = aTime < nowTime ? aTime : -aTime - 10e10
            let bTime = parseInt(b.dataset.locktime)
            bTime = bTime ? bTime : nowTime
            bTime = bTime < nowTime ? bTime : -bTime - 10e10
            let aTimeDiff = aTime - nowTime
            let bTimeDiff = bTime - nowTime
            return bTimeDiff - aTimeDiff
        })
        // 选中class为right且内容不为空的元素

        // 清空容器并添加排序后的a标签
        container.innerHTML = '';
        sortedLinks.forEach(link => container.appendChild(link));
        const footer = document.querySelector('.footer');
        footer.textContent+='----共'+links.length+'个可用账号'
    }

})();