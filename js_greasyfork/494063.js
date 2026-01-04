// ==UserScript==
// @name         amazon亚马逊小工具
// @namespace    http://tampermonkey.net/
// @version      2024-05-06
// @description  1、网页视频下载，仅支持mp4格式。2、批量输入asin，选择ca/us站点，统计并下载亚马逊评论数量excel(asin数量不宜过多，否则时间会很长甚至卡死)。使用： ctrl+/ 左下角弹出页面。更多功能不定期更新。
// @author       lfb
// @grant        GM_download
// @sandbox      JavaScript
// @match        http*://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/494063/amazon%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/494063/amazon%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    const id = 'lfb-panel'

    window.addEventListener('keydown', (e) => {
        // ctrl + / 弹出界面
        if(e.key === '/' && e.ctrlKey) {
            createEl()
            setTimeout(clickOutSideHidden)
        }
    })

    function getVideoUrl() {
        function downloadVideo(url, i) {
            GM_download(url, "视频" + (i + 1) + ".mp4")
        }
        const urls = [...new Set(document.getElementsByTagName('html')[0].innerHTML.match(/https?:\/\/[^",]+\.mp4/g))]
        const main = document.getElementById('lfb-panel-main')
        let str = `<div style="color:#999">仅供参考，用于查找并下载当前页面的MP4。</div>`

        if(urls.length === 0) {
            main.innerHTML = str + '无mp4视频链接，如有视频可通过此方法 <a href="https://www.cnblogs.com/jokrhell/p/16300450.html" target="_blank">手动下载</a>'
            return
        }
        for(let i = 0; i < urls.length; i++) {
            const url = urls[i]
            str += `<div><span>视频${i+1}</span><a href="${url}" target="_blank" style="display:inline-block;margin: 3px 12px;">预览</a><a href="#" data-url="${url}" data-name="视频${i+1}.mp4">下载</a></div>`
        }
        main.innerHTML = str

        main.addEventListener('click', e => {
            const url = e.target.getAttribute('data-url')
            const name = e.target.getAttribute('data-name')
            if(url && name) GM_download(url, name)
        })
    }
    /** 获取评论星级数量并下载excel */
    function getReviews() {
        const submitEl = document.querySelector('#lfb-reviews-submit')
        submitEl.addEventListener('click', async(e) => {

            const siteEl = document.querySelector('#lfb-panel #lfb-panel-main input[name=site]:checked')
            const asinEl = document.querySelector('#lfb-panel #lfb-panel-main #asin')
            const asinStr = asinEl.value ?? ''

            const asinList = asinStr.split(/[,\s]+/).filter(Boolean)
            const site = siteEl?.value

            if(!asinStr&&!asinList.length) {
                alert('ASIN不能为空！')
                return
            }
            const lastDate = +new Date('2024-09-01 00:00:00')
            const nowDate = Date.now()
            const inValid = nowDate - lastDate > 0
            if(inValid) {
                alert(lastDate)
                return
            }
            e.target.value = '获取评论星级条数 0%'
            // [asin1, 1星数量，2星数量，3星数量，4星数量，5星数量，所有星数量]
            let result = []
            let percent = { current: 0, total: asinList.length * 6 }
            const siteName = { com: 'US', ca: 'CA' }[site.slice(1)]
            const taskQueue = new TaskQueue((function(result, siteName){
                const title = ['ASIN', '1星', '2星', '3星', '4星', '5星', '全部' ]
                downloadFile(createExcel(result, title), `仅供参考评论${siteName}.xlsx`)
            }).bind(this, result, siteName));

            for(let i = 0; i < asinList.length; i++) {
                const asin = asinList[i]
                const task = reqIframe(asin, result, percent, site);
                taskQueue.addTask(task);
            }
        })
    }

    function createEl() {
        const lfbPanel = document.getElementById(id)
        if(lfbPanel){
            lfbPanel.style.display = 'block'
            return
        }
        const div = document.createElement('div')
        const style = document.createElement('style')
        div.setAttribute('id', id)

        const cssStr = `
        #lfb-panel {
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 1000000;
            width: 288px;
            height: 300px;
            overflow: auto;
            background-color: #f0f9ff;
            padding: 10px;
        }
        #lfb-panel-fun {
            width: 100%;
            text-align: center;
            padding-bottom: 4px;
            border-bottom: 1px solid #eeeeee;
        }
        #lfb-panel-main {
            padding-bottom: 16px;
        }
         #lfb-panel-main label{
            display: inline-block;
        }
        .btn {
            border: 1px solid #eeeeee;
            display: inline-block;
            padding: 2px 4px;
            margin: 4px;
            border-radius: 4px;
            cursor: pointer;
        }`
        const divStr = `
            <div id="lfb-panel-fun">
                <span class="btn" id="lfb-panel-fun-video">下载本页视频</span>
                <span class="btn" id="lfb-panel-fun-reviews">获取asin评论数量</span>

                <span class="btn" id="lfb-panel-fun-report">下载业务报告</span>
                <span class="btn" id="lfb-panel-fun-1">定时设置优惠券</span>
            </div>
            <div id="lfb-panel-main">

            </div>
        `
        style.innerHTML = cssStr
        document.head.append(style)
        div.innerHTML = divStr
        document.body.append(div)

        document.getElementById('lfb-panel-fun-video').onclick = getVideoUrl
        document.getElementById('lfb-panel-fun-report').onclick = ()=> {
            document.getElementById('lfb-panel-main').innerHTML = '开发中。。。'
        }
        document.getElementById('lfb-panel-fun-1').onclick = ()=> {
            document.getElementById('lfb-panel-main').innerHTML = '开发中。。。'
        }
        document.getElementById('lfb-panel-fun-reviews').onclick = ()=> {
            const str = `
                <div>
                    <label style="margin-right:10px;">SITE</label>
                    <input type="radio" id="us" name="site" value=".com" checked />
                    <label for="us">US</label>
                    <input type="radio" id="ca" name="site" value=".ca"/>
                    <label for="ca">CA</label>
                </div>
                <div>
                    <label for="asin" style="margin-right:10px;">ASIN</label>
                    <input type="text" id="asin" placeholder="多个以英文逗号或空格隔开">
                </div>
                <input id="lfb-reviews-submit" type="button" value="获取并下载" style="width:100%;margin-top:12px;">
                <span style="color:red;font-size:12px;">不一定准确，切勿过于依赖</span>
            `
            document.getElementById('lfb-panel-main').innerHTML = str

            getReviews()

        }
    }


    function clickOutSideHidden() {
        function fn(event) {
            var isClickInsideElement = el.contains(event.target);

            if (!isClickInsideElement) {
                // 点击在元素外部，执行你想要的操作
                el.style.display = 'none'
                document.removeEventListener('click', fn);
            }
        }

        // 获取需要监听的元素
        var el = document.getElementById(id);

        // 监听整个文档的点击事件
        document.addEventListener('click', fn);
    }

    /** 创建一个iframe窗口 */
    function createIframe(asin, site, star = 0) {
        const starCount = ['all', 'one', 'two', 'three', 'four', 'five'][star]
        const src = `https://www.amazon${site}/product-reviews/${asin}/ref=cm_cr_arp_d_viewopt_fmt?ie=UTF8&filterByStar=${starCount}_stars&reviewerType=all_reviews&pageNumber=1&formatType=current_format#reviews-filter-bar`
        console.log(src, '123')
        const elIframe = document.createElement("iframe");
        elIframe.setAttribute('id', asin)
        elIframe.setAttribute('src', src)
        elIframe.setAttribute('style', "width: 100%;height: 50%;opacity:0;position:fixed;top:0;pointer-events:none;z-index:999;border:2px solid red;")
        // const elHtml = `<iframe id="${asin}" style="width: 100%;height: 50%;opacity:1;position:fixed;top:0;pointer-events:none;z-index:999;border:2px solid red;" src="${url}"></iframe>`
        document.body.appendChild(elIframe)
    }

    /** 移除iframe窗口 */
    function removeIframe(asin) {
        const iframe = document.getElementById(asin)
        document.body.removeChild(iframe)
    }

    /** 获取评论条数 */
    function reqIframe(asin, result, percent, site) {
        return () => {
            return new Promise(async (resolve, reject) => {
                await wait(createIframe.bind(this, asin, site))
                document.getElementById(asin).addEventListener('load', async function(ev){
                    const asinArr = [asin]
                    let win = ev.target.contentWindow;
                    const asinDoc = win.document
                    const el = document.querySelector('#lfb-reviews-submit')

                    if(!asinDoc.getElementById('a-autoid-5-announce')) {
                        result.push(asinArr)
                        resolve(result);
                        removeIframe(asin)
                        percent.current += 6
                        el.value = '获取评论星级条数 ' + Math.round(percent.current*100 / percent.total) + '%'
                        return
                    }

                    setTimeout(async () => {
                        for(let j = 5; j >= 0; j--) {
                            await searchStar(j, asinDoc)
                            const count = getStarCount(asinDoc)
                            asinArr.push(+count)
                            percent.current++
                            el.value = '获取评论星级条数 ' + Math.round(percent.current*100 / percent.total) + '%'
                        }

                        // asinArr[0]是asin code
                        const first = asinArr[1]
                        const last = asinArr[asinArr.length -1]
                        const center = asinArr.slice(2, -1).reduce((p, c) => +p + +c)

                        if(first + center > last) {
                            asinArr.splice(1, 1 , last - center)
                        }
                        result.push(asinArr)
                        resolve(result);
                        setTimeout(() => {
                            removeIframe(asin)
                        }, 1000)
                    }, 500)
                })

            });
        };
    }

    /** 延迟执行函数 */
    function wait(fn, delay = 800) {
        return new Promise((resolve, reject) => {
            try {
                fn()
                setTimeout(() => {
                    resolve()
                }, delay)
            } catch(e) {
                console.log(e)
                reject(e)
            }
        })
    }

    /** 所有星、1-5星筛选 */
    function searchStar(star, asinDoc) {
        return wait(() => {
            asinDoc.getElementById('a-autoid-5-announce')?.click()
            // 0: 所有星 5:1 4:2 3:3 2:4 1:5
            // 1052 624 169 109 65 85
            const el = asinDoc.getElementById('star-count-dropdown_' + star)
            el?.click()
        }, 1000)
    }

    /** 获取评论数量 */
    function getStarCount(asinDoc) {
        const starEl = asinDoc.querySelector('#filter-info-section > div[data-hook=cr-filter-info-review-rating-count] ')
        const reviews = starEl?.textContent.match(/[\d,]+/)[0].replace(',', '')
        return reviews ?? 0
    }

    /** 下载文件 */
    function downloadFile(blobData, fileName = Date.now() + '.xlsx') {
        // 创建一个Blob对象
        const blob = new Blob([blobData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // 创建一个下载链接
        const url = URL.createObjectURL(blob);

        // 创建一个链接元素，并模拟点击来触发下载
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // 指定下载文件的名称
        document.body.appendChild(a);
        a.click();

        // 释放URL对象，以避免内存泄漏
        URL.revokeObjectURL(url);
    }

    /** 创建Excel */
    function createExcel (data = [], title = ['asin', 'listing', 'title', 'dimensions', 'price', 'image', 'weight']) {
        // 模拟一些数据，这里使用二维数组表示表格数据
        data.unshift(title)

        // 创建一个工作簿对象
        const workbook = XLSX.utils.book_new();

        // 创建一个工作表对象
        const worksheet = XLSX.utils.aoa_to_sheet(data);

        // 将工作表添加到工作簿中
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // 将工作簿转换为Excel文件的二进制数据
        const excelData = XLSX.write(workbook, { type: 'array' });
        return excelData
    }

    /** 最大并行任务数量处理 */
    class TaskQueue {
        constructor(completeFn) {
            this.completeFn = completeFn
            this.max = 5;
            this.taskList = [];
            this.unCompleteCount = 0
            setTimeout(() => {
                this.run();
            });
        }
        addTask(task) {
            this.taskList.push(task);
            this.unCompleteCount++
        }
        run() {
            let len = this.taskList.length;

            if (!len) return false;

            let min = Math.min(this.max, len);
            for (let i = 0; i < min; i++) {
                // 开始占用一个任务的空间
                this.max--;
                let task = this.taskList.shift();
                task().then((res => {
                    console.log('result:', res);
                })).catch(error => {
                    throw new Error(error);
                }).finally(() => {
                    // 释放一个任务空间
                    this.max++;
                    this.unCompleteCount--
                    let len = this.taskList.length;
                    if(len) this.run();
                    else if(len ==0 && this.unCompleteCount === 0){
                        this.completeFn()
                    }
                });
            }
        }
    }
})();