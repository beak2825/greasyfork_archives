// ==UserScript==
// @name         番茄小说指定章节下载(含VIP)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      MIT License
// @description  番茄小说页面等待按钮变更
// @author       Grech
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @match        https://fanqienovel.com/page/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @icon         <$ICON$>
// @downloadURL https://update.greasyfork.org/scripts/491320/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E6%8C%87%E5%AE%9A%E7%AB%A0%E8%8A%82%E4%B8%8B%E8%BD%BD%28%E5%90%ABVIP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491320/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E6%8C%87%E5%AE%9A%E7%AB%A0%E8%8A%82%E4%B8%8B%E8%BD%BD%28%E5%90%ABVIP%29.meta.js
// ==/UserScript==
const css = `
.grech-download-btn {
    position: absolute!important;
    bottom: 0!important;
    left: 160px!important;
}
.grech-chapter {
    position: absolute;
    bottom: 0;
    left: 320px;
    height: 32px;
    width: 80px;
    outline: none;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 3% 0 3%;
    font-size: 16px;
    box-shadow: 0px 1px 5px rgba(0,0,0,0.1);
}
.grech-loading-mask {
    display: none;
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 9999;
}
.grech-loading-icon {
    width: 300px;
    height: 300px;
    margin-left: calc(100vw / 2 - 150px);
    margin-top: calc(100vh / 2 - 150px);
    object-fit: cover;
}
.grech-loading-text {
    margin-top: -100px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: white;
    font-size: 22px;
    font-weight: 500;
}
`
GM_addStyle(css)
setTimeout(() => {
    const mask = $(`
        <div class="grech-loading-mask">
            <img class="grech-loading-icon" src="https://7up.pics/images/2024/03/31/loading.gif" />
            <div class="grech-loading-text">正在下载</div>
        </div>
    `)
    $('body').append(mask)
    // 获取info面板
    const info = $(".page-header-info > .info")
    // 移除下载App按钮
    $('.download-icon').remove()
    // 移除跳转按钮
    info.find('a')[2].remove()
    // 设置info面板样式
    info.css({ overflow: 'visible' })
    // 新建下载按钮
    const download = $(`
        <button
            class=
            "
                byte-btn
                byte-btn-primary
                byte-btn-size-large
                byte-btn-shape-square
                muye-button
                info-btn
                grech-download-btn
            "
            type="button"
        >
            下载指定章节
        </button>
    `)
    // info面板添加下载按钮
    info.append(download)
    // 新建章节输入框
    const chapter = $(`
        <input class="grech-chapter" type="number" value="1" />
    `)
    // info面板添加章节输入框
    info.append(chapter)
    // 获取章节模型
    const arrayChapter = $('.chapter-item').toArray().map((e, i) => {
        return {
            name: e.innerText,
            id: $(e).find('a').attr('href').replace('/reader/', ''),
            index: i + 1
        }
    })
    // 监听下载按钮点击事件
    download.click(() => {
        // 空值时自动填入1
        chapter.val((chapter.val() === '0' || chapter.val() === '') ? '1' : chapter.val() )
        // 获取章节模型
        const chapterItem = arrayChapter[parseInt(chapter.val()) - 1]
        // 拼接章节数据地址
        const apiURL = `http://fq.hk.frps.uk/content?item_id=${chapterItem.id}`
        const loMask = $('.grech-loading-mask')
        const loText = $('.grech-loading-text')
        loText.text(`开始下载【${chapterItem.name}】`)
        loMask.fadeIn()
        GM_xmlhttpRequest({
            url: apiURL,
            method: 'GET',
            'Content-Type': 'application/json; charset=UTF-8',
            onload (res) {
                const data = JSON.parse(res.responseText)
                const content = data.data.data.content
                const blob = new Blob([new TextEncoder('UTF-8').encode(content)], { type: `text/plain;charset=UTF-8` });
                saveAs(blob, chapterItem.name + ".txt");
                loText.text(`开始下载`)
                loMask.fadeOut()
            }
        })
    })
}, 1000)