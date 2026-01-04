// ==UserScript==
// @name         91porn 视频一键下载/获取视频下载链接/去广告
// @description  91porn 视频一键下载/获取视频下载链接/去广告等
// @namespace    http://limbopro.com/
// @version      0.0.02
// @author       limbopro
// @license      CC BY-NC 4.0
// @match        https://www.91porn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91porn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526360/91porn%20%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/526360/91porn%20%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


var porn91_ad_css = ".copysuccess {background:green !important;color:white !important;} br, .ad_img,.preroll-blocker, img[href*='.gif'] {display:none !important; pointer-events: none !important;}"  // 91porn
document.head.insertAdjacentHTML("beforeend", "<style>" + porn91_ad_css + "</style>") // 插入 CSS 代码 用于隐藏广告 以及其他元素    

let url91 = document.location.href;
if (url91.indexOf('view_') !== -1) {
    let play = setInterval(() => {
        if (document.querySelector('div.preroll-skip-button') !== null) {
            document.querySelector('div.preroll-skip-button').click();
        } else {
            clearInterval(play);
        }
    }, 1000)
}

function _91porn_dl() { // 下载视频

    if (window.location.href.match('view_video')) {

        var css = document.createElement('style')
        css.innerHTML = '.copysuccess {background:green !important;color:white !important;}'
        css.id = 'porn91'
        document.body.appendChild(css)

        if (document.getElementById('mp4Download') == null) {
            var mp4URL = document.querySelectorAll('source')[0].src
            var mp4Download = document.createElement('a')
            mp4Download.download = document.title.toString()
            mp4Download.target = '_blank'
            mp4Download.id = 'mp4Download'
            mp4Download.href = mp4URL

            if ((/\b(android|iphone|ipad|ipod)\b/i.test(navigator.userAgent.toLowerCase()))) {
                mp4Download.textContent = '无广播放'
            } else {
                mp4Download.textContent = '下载视频'
            }

            var button_download = document.createElement('button')
            button_download.style = 'padding:12px; position:fixed;right:0px;top:216px;border:0px; background:yellowgreen;color:white;font-weight:bolder;width:60px;'
            button_download.textContent = '复制视频下载地址'
            button_download.id = 'copyURL'

            var button_alert = document.createElement('button')
            button_alert.style = 'padding:12px; position:fixed;right:0px;top:322px;border:0px; background:yellowgreen;color:white;font-weight:bolder;width:60px;'
            button_alert.textContent = '如何下载视频?'
            button_alert.id = 'alertDownload'

            button_alert.addEventListener('click', (() => {
                alert(' 1.复制视频下载地址；2.iOS用户推荐使用名叫 "Documents" 的 app 下载视频，打开 Documents app -> 浏览器 - 粘贴视频下载地址；Android 暂无建议；')
            }))

            button_download.addEventListener('click', (() => {
                if (document.querySelectorAll('source')[0].src.match('\.mp4') !== null) {
                    const textarea = document.createElement('textarea') // 创建 textarea 元素 并将选中内容填充进去
                    textarea.id = 'fuck91porn'
                    document.querySelector('#copyURL').appendChild(textarea)
                    textarea.value = mp4URL
                    textarea.select();
                    document.execCommand('copy', true); // 执行复制
                    document.querySelector('#copyURL').classList.add('copysuccess')  // 复制成功提醒
                    document.querySelector('#copyURL').textContent = '复制成功'

                    setTimeout(() => { // ↩️按钮恢复原状
                        document.querySelector('#copyURL').classList.remove('copysuccess')
                        document.querySelector('#copyURL').textContent = '复制视频下载地址'
                    }, 2500)

                    if (document.getElementById('fuck91porn')) { // 删除刚刚创建的 textarea 元素
                        document.getElementById('ffuck91porn').remove()
                    }
                } else {
                    alert('未找到视频下载地址！')
                }
            }))

            mp4Download.style = 'padding:12px; position:fixed;right:0px;top:150px;background:yellowgreen;color:white;font-weight:bolder;width:60px;'
            document.querySelectorAll('#useraction')[0].parentNode.insertBefore(button_alert, document.querySelectorAll('#useraction')[0])
            document.querySelectorAll('#useraction')[0].parentNode.insertBefore(button_download, document.querySelectorAll('#useraction')[0])
            document.querySelectorAll('#useraction')[0].parentNode.insertBefore(mp4Download, document.querySelectorAll('#useraction')[0])
        }
    }
}

setTimeout(() => {
    _91porn_dl()
}, 2500)