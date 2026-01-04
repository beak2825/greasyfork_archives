// ==UserScript==
// @name         快看漫画一键保存
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  单击保存即可下载漫画
// @author       You
// @icon         https://www.kuaikanmanhua.com/favicon.ico
// @grant        none
// @license MIT
// @include      https://www.kuaikanmanhua.com/web/comic/*

// @downloadURL https://update.greasyfork.org/scripts/451849/%E5%BF%AB%E7%9C%8B%E6%BC%AB%E7%94%BB%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/451849/%E5%BF%AB%E7%9C%8B%E6%BC%AB%E7%94%BB%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    async function AsyncErgodic(
        data,
        callBack
    ) {
        const ps = new Set()
        if ('forEach' in data) {
            data.forEach((a, b, c) => {
                ps.add(callBack(a, b, c))
            })
        } else {
            for (const k in data) {
                ps.add(callBack(data[k], k, data))
            }
        }
        return await Promise.all(ps)
    }

    let count = 0

    function run() {
        const el = document.querySelector('.bodyContent')
        if (!el) {
            count++
            if (count >= 100) {
                console.log(`多次重启失败`)
                return
            }
            setTimeout(run, 50)
            console.log(`第${count}次尝试重启`)
            return
        }
        // 下载进度条
        el.insertAdjacentHTML('afterbegin', `
<div class="fc_sop">
    <div>
        <div class="fc_sop_line">
            <div class="fc_sop_line_l"></div>
        </div>
        <div class="fc_sop_bom">
            <span class="fc_sop_info">正在准备</span>
        </div>
    </div>
</div>`)
        document.body.insertAdjacentHTML('afterbegin', `<style>
            .fc_dl {
                cursor: pointer;
                margin-right: 10px
            }
            .fc_sop {
                display: none;
                z-index:999999;
                width: 300px;
                height: 50px;
                background-color: #fff;
                box-shadow: #ccc 0 0 5px;
                position: fixed;
                top: 80px;
                right: 20px;
                border-radius: 6px;
                align-items: center;
                justify-content: center;
            }
            .fc_show {
                display: flex;
                opacity: 1;
            }
            .fc_sop_line {
                width: 260px;
                height: 4px;
                border-radius: 2px;
                background-color: #ccc;
                overflow: hidden;
            }
            .fc_sop_line_l {
                height: 100%;
                background-color: #ffba15;
                transition: width 0.2s;
            }
            .fc_sop_bom{
                margin-top: 6px;
                color: #999;
            }
            .fc_sop_info {
                float: left;
            }
            #fc_cvs {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 99999;
            }
        </style>`)
        // 顶部下载
        document.querySelector('.titleBox>.tab>div').insertAdjacentHTML('beforebegin', `<div class="fl fc_dl"><svg style="position: relative;top: 2px;height: 16px;width: 16px;" t="1663846480398" class="icon" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg" p-id="2613" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M502.010485 765.939573c3.773953 3.719718 8.686846 5.573949 13.596669 5.573949 0.075725 0 0.151449-0.010233 0.227174-0.011256 0.329505 0.016373 0.654916 0.050142 0.988514 0.050142 0.706081 0 1.400906-0.042979 2.087545-0.116657 4.352121-0.366344 8.607028-2.190899 11.961426-5.496178l335.053985-330.166675c7.619538-7.509021 7.709589-19.773346 0.200568-27.393907s-19.774369-7.711636-27.39493-0.201591L536.193005 706.304358 536.193005 50.019207c0-10.698666-8.67252-19.371186-19.371186-19.371186s-19.371186 8.67252-19.371186 19.371186l0 657.032164-306.881342-302.44838c-7.618515-7.509021-19.883863-7.419993-27.393907 0.199545-7.509021 7.619538-7.419993 19.884886 0.199545 27.393907L502.010485 765.939573z" p-id="2614" fill="#666666"></path><path d="M867.170139 711.020776c-10.698666 0-19.371186 8.67252-19.371186 19.371186l0 165.419494c0 13.054317-10.620895 23.675212-23.676236 23.675212L205.182103 919.486668c-13.054317 0-23.676236-10.620895-23.676236-23.675212L181.505867 730.391962c0-10.698666-8.67252-19.371186-19.371186-19.371186s-19.371186 8.67252-19.371186 19.371186l0 165.419494c0 34.416857 28.000728 62.416562 62.417585 62.416562l618.941638 0c34.417881 0 62.417585-27.999704 62.417585-62.416562L886.540302 730.391962C886.541325 719.693296 877.868805 711.020776 867.170139 711.020776z" p-id="2615" fill="#666666"></path></svg>下载</div>`)
        const fc_sop = document.querySelector('.fc_sop')
        /**@type {HTMLDivElement} */
        const fc_sop_line_l = document.querySelector('.fc_sop_line_l')
        const fc_sop_info = document.querySelector('.fc_sop_info')

        function cancel() {
            fc_sop.classList.remove('fc_show')
            fc_sop_line_l.style.width = '0%'
            fc_sop_info.innerText = '正在准备'
        }

        // 防重锁
        let lock = false

        function downloadCvs(cvs, ext) {
            console.log(`download canvas`)
            let a = document.createElement('a')
            a.href = cvs.toDataURL('image/png')
            a.download = document.title.replace('漫画全集在线观看-快看', '') + ext + '.png'
            a.click()
            cancel()
            lock = false
            a.remove()
        }

        function drawCvs(imgs, width, height) {
            console.log(`draw canvas`)
            const cvs = document.createElement('canvas')
            // cvs.id = 'fc_cvs'
            // document.querySelector('.bodyContent').append(cvs)
            cvs.width = width
            cvs.height = height
            let th = 0
            const ctx = cvs.getContext('2d')
            for (let i = 0; i < imgs.length; i++) {
                const e = imgs[i]
                ctx.drawImage(e, 0, th)
                th += e.height
            }
            return cvs
        }

        async function download() {
            if (lock) return
            lock = true
            fc_sop.classList.add('fc_show')
            const imgEles = [...document.querySelectorAll('.imgList .img-box .img[data-src]')]
            if (imgEles.length === 0) return console.log('空元素异常')
            console.log(`准备下载${imgEles.length}张图片`)
            const imgUrls = imgEles.map(e => e.getAttribute('data-src'))
            /** @type {HTMLImageElement[]} */
            const imgObjs = await AsyncErgodic(imgUrls, (e, i) => new Promise(n => {
                const el = document.createElement('img')
                el.onload = () => {
                    const b = (i + 1) / imgUrls.length * 100
                    fc_sop_line_l.style.width = b + '%'
                    n(el)
                }
                el.src = e
                el.setAttribute("crossOrigin", 'Anonymous')
            }))
            const width = imgObjs[0].width
            const height = imgObjs.reduce((v, e) => v + e.height, 0)
            console.log(`图片尺寸${width}×${height}`)

            // 分组，保证每组图片高度不超过32000
            const groups = [{height: 0, items: []}]
            for (let i = 0; i < imgObjs.length; i++) {
                const e = imgObjs[i]
                const pi = groups[groups.length - 1]
                // 高度限制
                if (pi.height + e.height > 32000) {
                    groups.push({
                        height: e.height,
                        items: [e]
                    })
                    continue
                }
                pi.height += e.height
                pi.items.push(e)
            }
            console.log(groups)
            if (groups.length === 1) {
                const cvs = drawCvs(groups[0].items, width, groups[0].height)
                downloadCvs(cvs)
            } else {
                if (height > 30000) {
                    const info = `图片高度超过限制，将拆分为${groups.length}个文件`
                    console.log(info)
                    fc_sop_info.innerText = info
                }
                groups.forEach((e, i) => {
                    const cvs = drawCvs(e.items, width, e.height)
                    downloadCvs(cvs, '_' + i)
                })
            }
        }

        document.querySelectorAll('.fc_dl').forEach(e => e.addEventListener('click', download))
    }

    setTimeout(run, 20)
})();