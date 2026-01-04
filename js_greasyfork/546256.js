// ==UserScript==
// @name         Share Card
// @namespace    https://glidea.zenfeed.xyz/
// @version      1.0.1
// @description  在 V2EX 帖子页面添加一个分享按钮，点击后跳转到 v2ex-share 页面
// @author       Glidea
// @match        https://*v2ex.com/t/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546256/Share%20Card.user.js
// @updateURL https://update.greasyfork.org/scripts/546256/Share%20Card.meta.js
// ==/UserScript==

; (function () {
    'use strict'

    window.addEventListener('load', function () {
        const topicBox = document.querySelector('#Main > .box[style="border-bottom: 0px;"]')

        if (topicBox) {
            const pathParts = window.location.pathname.split('/')
            const topicId = pathParts[2]

            if (topicId) {
                const shareCell = document.createElement('div')
                shareCell.className = 'cell'
                shareCell.style.textAlign = 'center'

                const shareButton = document.createElement('a')
                shareButton.textContent = '卡片分享'
                shareButton.style.backgroundColor = '#778087'
                shareButton.style.color = 'white'
                shareButton.style.padding = '10px 20px'
                shareButton.style.textDecoration = 'none'
                shareButton.style.display = 'inline-block'
                shareButton.style.borderRadius = '3px'
                shareButton.style.fontSize = '14px'
                shareButton.style.fontWeight = 'bold'

                const shareUrl = `https://v2ex-share.zenfeed.xyz/t/${topicId}`
                shareButton.href = shareUrl
                shareButton.target = '_blank'

                shareCell.appendChild(shareButton)
                topicBox.appendChild(shareCell)
            }
        }
    })
})()
