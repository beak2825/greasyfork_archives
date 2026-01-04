// ==UserScript==
// @name        sciDownload
// @namespace   http://tampermonkey.net/
// @version     4.1
// @description 任何页面，sci论文下载，显示期刊信息
// @author      Polygon
// @icon        data:image/png;base64,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
// @match       *://*/*
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
// @grant       unsafeWindow
// @grant       window.close
// @connect     *
// @run-at      document-idlm
// @downloadURL https://update.greasyfork.org/scripts/431169/sciDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/431169/sciDownload.meta.js
// ==/UserScript==
(function() {
    'use strict'
    const notification = (function() {
        'use strict';
        GM_addStyle(`
            #notification {
                box-sizing: border-box;
                position: fixed;
                left: calc(50% - 365.65px / 2);
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                height: 50px;
                background-color: #ff7675;
                border-radius: 50px;
                padding: 0 0px 0px 20px;
                top: -50px;
                transition: top .5s ease-out;
                z-index: 9999999999;
            }
            #notification .content {
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 25px;
            }
            #notification .closeBox {
                margin: 0 10px;
                transform: rotate(90deg);
                cursor: pointer;
            }
            #notification .closeBox .progress {
                margin: 0 10px;
                cursor: pointer;
            }
            #notification .closeBox .progress .circle {
                stroke-dasharray: 100;
                animation: progressOffset 0s linear;
            }
            @keyframes progressOffset {
                from {
                    stroke-dashoffset: 100;
                }
                to {
                    stroke-dashoffset: 0;
                }
            }
        `)
        return {
            open(info, timeout, autoClose=true) {
                let eles = document.querySelectorAll('#notification')
                for (let i=0;i<eles.length;i++) {
                    this.close(eles[i])
                }
                this.box = document.createElement('div')
                this.box.setAttribute('id', 'notification')
                this.box.innerHTML = `
                    <div class="content"></div>
                    <svg class="closeBox" width="40" height="40">
                        <g class="close" style="stroke: white; stroke-width: 2; stroke-linecap: round;">
                            <line x1="13" y1="13" x2="27" y2="27"/>
                            <line x1="13" y1="27" x2="27" y2="13"/>
                        </g>
                        <g class="progress" fill="transparent" stroke-width="3">
                            <circle class="background" cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.15)"/>
                            <circle class="circle" cx="20" cy="20" r="16" stroke="rgba(255,255,255,1)"/>
                        </g>
                    </svg>
                    `
                document.body.appendChild(this.box)
                this.box.querySelector('.content').innerHTML = info
                let width = getComputedStyle(this.box).width
                this.box.style.left = `clac(50%-${width}/2)`
                this.box.querySelector('.closeBox .progress .circle').style['animation-duration'] = `${timeout}s`
                this.box.style.top = '100px'
                this.box.querySelector('.closeBox .progress').addEventListener('click', () => {
                    console.log('you close...')
                    this.close()
                    console.log('you clear...')
                })
                if (autoClose) {
                    setTimeout(() => {
                        console.log('timeout close...')
                        this.close()
                        console.log('timeout clear ...')
                    }, timeout * 1000)
                }
            },
            close(ele=null) {
                if (!ele) {ele=this.box}
                ele.style['transition-duration'] = '.23s'
                ele.style['transition-timing-function'] = 'eaer-out'
                ele.style.top = '-50px'
                setTimeout(() => {
                    try {
                        document.body.removeChild(this.box)
                    } catch {
                        console.log('clear')
                    }
                }, 1000)
            }
        }
    })();

    const utils = {
        api: 'http://muise.icu:5000/sciDownload',
        doiRegex: new RegExp(/10\.\d{4,9}\/[-\._;\(\)\/:A-z0-9]+/),
        pdfRegex: /(content-type|Content-Type).+(pdf|binary|application|stream)/g,
        timeout: 25,
        autoMax: {b: true, time: 1},
        scihubURL: 'sci-hub.ee',
        // 适配ipad，userscript暂不支持GM_getValue，GM_setValue
        get switchState() {
            if (typeof(GM_getValue) == 'undefined') {
                return this._switchSate
            } else {
                return GM_getValue('sciDownload-state', 'max')
            }
        },
        set switchState(value) {
            if (typeof(GM_setValue) == 'undefined') {
                this._switchSate = value
            } else {
                GM_setValue('sciDownload-state', value)
            }
        },
        _switchSate: 'max',
        color:
        {
            success: '#e74c3c',
            flash: '#00b894',
            fail: '#2c3e50'
        },
        svg:
        {
            doi: `<svg class="progressBox" width="40" height="40">
                <g fill="transparent" stroke-width="2.5">
                    <circle class="progress-background" cx="20" cy="20" r="11" stroke="rgba(255,255,255,0.23)"/>
                    <circle class="progress" cx="20" cy="20" r="11" stroke="rgba(255,255,255,1)" stroke-linecap="round"/>
                </g>
            </svg>`,
            pdf: `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2519" width="30" height="30"><path d="M478.08 192.192a58.88 58.88 0 0 1 46.208 23.168c23.104 32.064 21.312 99.84-8.832 199.68A536.832 536.832 0 0 0 625.664 557.44c37.312-7.04 74.688-12.416 112-12.416 83.52 1.792 96 41.024 94.144 64.128 0 60.544-58.688 60.544-88.896 60.544v0.064a226.048 226.048 0 0 1-131.52-53.504c-72.832 16-142.144 39.168-211.456 67.712C344.96 782.08 293.312 832 248.96 832c-8.96 0-19.584-1.792-26.752-7.168A52.48 52.48 0 0 1 192 776.704c0-16 3.52-60.608 172.352-133.568a1267.776 1267.776 0 0 0 94.208-221.056c-21.312-42.752-67.584-147.84-35.584-201.344 10.688-19.648 32-30.272 55.168-28.544z m-118.4 475.84c-42.688 20.736-95.232 58.368-90.112 82.368 3.392 16 21.888 10.56 55.424-16.384 21.056-27.072 24.512-41.088 34.688-65.984z m386.304-79.808c-17.152 0-32.384 0-49.536 7.68 19.072 19.2 29.504 28.608 48.64 32.448 13.312 3.84 39.104 10.752 46.72-9.28 7.68-19.968-7.616-30.848-45.824-30.848zM494.08 492.8a2572.16 2572.16 0 0 1-46.592 104.704l104.704-34.88c-21.76-22.272-41.344-43.392-58.112-69.824z m-16.64-223.488c-10.496 1.664-16.192 15.04-18.88 24.512-5.504 27.008 8.96 57.088 27.072 78.528 14.912-22.528 18.688-43.328 12.928-73.92-6.976-20.48-14.016-30.208-21.12-29.12z" fill="#ffffff" p-id="2520"></path></svg>`,
            switch: `<svg width="40" height="40">
                <g stroke="white" stroke-width="3" stroke-linecap="round">
                    <line x1="10" y1="20" x2="30" y2="20"/>
                    <line class="switch" x1="10" y1="20" x2="30" y2="20"/>
                </g>
            </svg>`
        },
        style() {
            let div = document.createElement('div')
            div.innerHTML = this.svg.doi
            div.style.opacity = '0'
            document.body.appendChild(div)
            try{
                this.progressTotaLength = div.querySelector('.progress').getTotalLength()
            } catch {
                this.progressTotaLength = 68.66967010498047
            }
            document.body.removeChild(div)
            return `
                #sciDownloadBox {
                    display: flex;
                    position: fixed;
                    height: 40px;
                    bottom: 75px;
                    font-family: NexusSans,Arial,Helvetica,Lucida Sans Unicode,Microsoft Sans Serif,Segoe UI Symbol,STIXGeneral,Cambria Math,Arial Unicode MS,sans-serif;
                    font-size: 18px;
                    cursor: pointer;
                    box-shadow: 0px 0px 20px rgba(0, 0, 0, .1);
                    transition: left .23s ease-out, opacity .23s, right .23s ease-out;
                    z-index: 9999999999;
                }
                #sciDownloadBox * {
                    box-sizing: border-box;
                }
                #sciContent {
                    position: relative;
                    overflow: hidden;
                    box-sizing: border-box;
                    display: flex;
                    height: 40px;
                    align-items: center;
                    justify-content: space-around;
                    vertical-align: middle;
                    white-space: nowrap;
                    color: white;
                    background-color: ${this.color.fail};
                    opacity: 0.72;
                    transition: width .23s ease-out, opacity .23s, background-color .23s;
                }
                #sciContent[loading] #sciState .progress {
                    opacity: 0;
                }
                #sciContent[loading]::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    background-color: white;
                    z-index: -1;
                    animation: loading 2.3s linear infinite;
                }
                @keyframes loading {
                    from {
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.3;
                    }
                    to {
                        opacity: 0;
                    }
                }
                #sciSwitch {
                    width: 40px;
                    height: 40px;
                    color: white;
                    background-color: #00b894;
                    opacity: 0.72;
                    transition: width .23s ease-out, opacity .23s;
                    z-index: 1;
                }
                #sciContent #sciState {
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    opacity: 1;
                }
                #sciContent #sciText {
                    position: relative;
                    overflow: hidden;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    padding-left: 5px;
                    padding-right: 10px;
                    opacity: 1;
                    text-decoration: none;
                    transition: width .23s ease-out;
                }
                #sciContent:hover {
                    opacity: 0.99 !important;
                }
                #sciSwitch:hover {
                    opacity: 1 !important;
                }
                /* left svg progress */
                #sciContent #sciState .progressBox {
                    transform: rotate(-90deg);
                }
                #sciContent #sciState .progress {
                    stroke-dasharray: ${this.progressTotaLength};
                    stroke-dashoffset: ${this.progressTotaLength};
                    transition: stroke-dashoffset .23s linear;
                }
                #sciContent[progress] #sciState .progress {
                    animation: progressOffset ${this.timeout}s linear forwards;
                }
                @keyframes rotator {
                    from {
                        transform: rotate(-90deg);
                    }
                    to {
                        transform: rotate(180deg);
                    }
                }
                #sciContent[download-noprogress] #sciState .progressBox {
                    animation: rotator 2.3s linear infinite;
                }
                @keyframes dash {
                    from {
                        stroke-dashoffset: ${this.progressTotaLength};
                    }
                    50% {
                        stroke-dashoffset: ${this.progressTotaLength / 4};
                        transform:rotate(135deg);
                    }
                    to {
                        stroke-dashoffset: ${this.progressTotaLength};
                        transform:rotate(450deg);
                    }
                }
                #sciContent[download-noprogress] #sciState .progress {
                    stroke-dashoffset: 0;
                    transform-origin: center;
                    animation: dash 2.3s ease-in-out infinite;
                }
                @keyframes progressOffset {
                    from {
                        stroke-dashoffset: ${this.progressTotaLength};
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes progressRecover {
                    to {
                        stroke-dashoffset: ${this.progressTotaLength};
                    }
                }
                /* progress animation */
                @keyframes progress {
                    to {
                    width: 100%;
                    }
                }
                /* switch button animation */
                #sciSwitch svg .switch {
                    transform: rotate(0deg);
                    transform-origin: center center;
                    transition: transform .23s ease-out .15s;
                }
                /* ripple effect */
                #sciDownloadBox .ripple {
                    position: absolute;
                    background: #fff;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    border-radius: 50%;
                    animation: ripple 1s linear;
                }
                @keyframes ripple{
                    from {
                        width: 0px;
                        height: 0px;
                        opacity: 0.5;
                    }
                    to {
                        width: 500px;
                        height: 500px;
                        opacity: 0;
                    }
                }
            `
        },
        initBox(doi) {
            let createBox = () => {
                this.sciDownloadBox = document.createElement('div')
                this.sciDownloadBox.setAttribute('id', 'sciDownloadBox')
                this.sciDownloadBox.setAttribute('doi', doi)
                this.sciDownloadBox.innerHTML = `
                                                <div id="sciSwitch">${this.svg.switch}</div>
                                                <div id="sciContent">
                                                    <div id="sciState"></div>
                                                    <a id="sciText"></a>
                                                </div>
                                                `
                document.body.appendChild(this.sciDownloadBox)
                // 绑定变量
                this.sciContent = this.sciDownloadBox.querySelector('#sciContent')
                this.sciState = this.sciDownloadBox.querySelector('#sciState')
                this.sciText = this.sciDownloadBox.querySelector('#sciText')
                // 改变doi文字
                this.changeContent(this.svg.doi, doi)
                // 缓入准备
                this.sciDownloadBox.style.right = -this.getElementWidth(this.sciDownloadBox) + 'px'
                setTimeout(() => {
                    // 设置right属性，触发缓入动画
                    this.sciDownloadBox.style.right = '0px'
                }, 230)
                this.sciSwitch = this.sciDownloadBox.querySelector('#sciSwitch')
                // 最大化/最小化按钮点击事件绑定
                this.sciSwitch.addEventListener('click', this.switchEvent)
                // 涟漪效果点击事件
                this.sciState.addEventListener('click', this.rippleClickEvent)
                this.sciText.addEventListener('click', this.rippleClickEvent)
                // 当窗口调整时，自适应
                window.onresize = () => {
                    setTimeout(() => {
                        this.sciSwitch.click()
                        this.sciSwitch.click()
                    })
                }
            }
            // 添加sciTool逻辑
            if (this.sciDownloadBox) {
                // 存在，设置left属性缓出
                this.sciDownloadBox.style.left = getComputedStyle(utils.sciDownloadBox).left
                this.sciDownloadBox.style.left = document.body.clientWidth + 'px'
                GM_addStyle(`
                    #sciContent[progress] #sciState .progress {
                        animation: progressOffset 25s linear forwards;
                    }
                `)
                setTimeout(() => {
                    // 缓出结束，让其消失，并创建新的
                    this.sciDownloadBox.remove()
                    createBox.apply(this)
                }, 230);
            } else {
                // 可能首次打开页面，直接创建
                createBox.apply(this)
            }

        },
        rippleClickEvent(event) {
            // 这一步让sciState内svg的点击事件传播到sciState，而svg本身不产生动画效果
            let parent
            for (let i=0;i<event.path.length;i++) {
                if (event.path[i].id.match(/(sciText|sciState)/)) {
                    parent = event.path[i]
                    break
                }
            }
            let x = event.offsetX
            let y = event.offsetY
            let ripple = document.createElement("span")
            ripple.setAttribute('class', 'ripple')
            ripple.style.left = `${x}px`
            ripple.style.top = `${y}px`
            parent.appendChild(ripple)
            // timeout数值越大涟漪扩散越慢
            setTimeout(() => {
                ripple.remove()
            }, 1000)
            event.stopPropagation();
        },
        switchEvent(event) {
            if (utils.switchState == 'max') {
                utils.sciDownloadBox.style.left = getComputedStyle(utils.sciDownloadBox).left
                utils.sciDownloadBox.style.left = document.body.clientWidth - 40 * 2 + 'px'
                utils.sciDownloadBox.style.right = -utils.getElementWidth(utils.sciDownloadBox) + 'px'
                utils.sciSwitch.querySelector('svg .switch').style.transform = 'rotate(90deg)'
                utils.switchState = 'min'
            } else if (utils.switchState == 'min') {
                utils.sciDownloadBox.style.left = ''
                utils.sciDownloadBox.style.right = '0px'
                utils.sciSwitch.querySelector('svg .switch').style.transform = 'rotate(0deg)'
                utils.switchState = 'max'
            }
        },
        startProgress(doi) {
            if (document.querySelectorAll(`#sciDownloadBox[doi="${doi}"]`).length == 0) return
            this.sciContent.setAttribute('progress', '')
            // 有progress属性的有进度条动画
            GM_addStyle(`
                /* 背景色进度条 */
                #sciContent[progress] #sciText::before {
                    content: "";
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    height: 40px;
                    width: 0%;
                    background-color: ${this.color.flash};
                    opacity: 1;
                    z-index: -1;
                    animation: progress ${this.timeout}s linear forwards;
                }
            `)
        },
        getContentWidth(ele, content) {
            let oldContent = ele.innerHTML
            ele.innerHTML = content
            let width = this.getElementWidth(ele)
            ele.innerHTML = oldContent
            return width
        },
        getElementWidth(ele) {
            return parseFloat(window.getComputedStyle(ele).width.replace('px', ''))
        },
        changeContent(state, text, callback=null) {
            if (state) {this.sciState.innerHTML = state}
            let ele = this.sciText
            let oldWidth = this.getElementWidth(ele)
            let newWidth = this.getContentWidth(ele, text)
            ele.style.width = oldWidth + 'px'
            setTimeout(() => {
                ele.style.width = newWidth + 'px'
                ele.innerHTML = text
                setTimeout(() => {
                    ele.style.width = 'fit-content'
                    if (callback) {callback()}
                }, 230)
                if (this.switchState == 'min' & this.autoMax.b){
                    this.sciSwitch.click()
                    setTimeout(() => {
                        this.sciSwitch.click()
                    }, this.autoMax.time * 1000 > 230 ? this.autoMax.time * 1000 : 230)
                }
            }, 230)
        },
        getDoi() {
            let doi, select, res
            let selection = window.getSelection().toString()
            let sourceText = document.body.innerHTML
            res = selection.match(this.doiRegex)
            if (res) {
                doi = res[0]
                select = true
            } else {
                res = sourceText.match(this.doiRegex)
                if (res) {
                    doi = res[0]
                    select = false
                }
            }
            if (doi) {
                doi = doi.replace(/[\/\.]\w*?pdf/, '').split(';')[0]
            }
            return [doi, select]

        },
        check_update_journal_info(journal_name) {
            let key = `sciDownload-journal-${journal_name}`
            console.log(key)
            if (!GM_getValue(key, undefined)) {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: "https://easyscholar.cc/homeController/getQueryTable.ajax",
                    data: `page=1&limit=10&sourceName=${journal_name}`,
                    headers:  {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    responseType: "json",
                    onload: function (res) {
                        let value
                        if (res.response.data.length) {
                            let info = res.response.data[0]
                            value = `${info.paperName} | ${info.sciif}/${info.sciif5} | ${info.sciBase} | ${info.sciUp}`
                        } else {
                            value = journal_name || "No More Information"
                        }
                        console.log(value)
                        GM_setValue(key, value)
                    }
                })
            } else {
                console.log('read from GM_getValue')
                console.log(GM_getValue(key, undefined))
            }
        },
        LocalSearch(doi) {
            // 1 开启动画效果
            this.initBox(doi)
            setTimeout(() => {
                this.startProgress(doi)
            }, 230)
            // 2 生成data，这里按顺序查询，不太会用js的并发只能按照顺序了，应该不会很慢
            let data = {journal_name: ""}
            let totalSource = 4
            let failSource = 0
            let setData = (value) => {
                if (value.url) {
                    if (!Object.keys(data).includes("url")) {
                        data = {...data, ...value}
                    }
                } else {
                    failSource += 1
                }
            }
            // 2.1 查询unpaywall
            const unpaywall = `https://api.unpaywall.org/v2/${doi}?email=polygon@unpaywall.com`
            GM_xmlhttpRequest({
                method: 'GET',
                url: unpaywall,
                responseType: 'json',
                onload: function (res) {
                    const unpaywallData = res.response
                    let journal_name = unpaywallData['journal_name']
                    setTimeout(() => {
                        utils.check_update_journal_info(journal_name)
                        data.journal_name = journal_name
                    }, 0);
                    let url
                    try {
                        url = unpaywallData['best_oa_location']['url_for_pdf'] || unpaywallData['best_oa_location']['url_for_landing_page']
                    } catch {
                        url = ''
                        if (Object.prototype.hasOwnProperty.call(unpaywallData, 'title')) {
                            console.log(`unpaywall: ${unpaywallData['title']}`)
                            researchgate(unpaywallData['title'])  // 交给researchgate
                        }
                    }
                    setData({
                        message: 'unpaywall.org',
                        url: url
                    })
                }
            })
            // 2.2 查询scihub
            const scihub = `https://${this.scihubURL}/${doi}`
            GM_xmlhttpRequest({
                method: 'GET',
                url: scihub,
                onload: function (res) {
                    let url = res.response.match(/\/\/(.+pdf)[^\'\"]/)
                    if (url) {
                        url = 'https://' + url[1]
                    } else {
                        url = ''
                    }
                    setData({
                        message: utils.scihubURL,
                        url: url
                    })
                }
            })
            // 2.3 查询researchgate
            let isConsistent = (s1, s2) => {
                if (s1 == null || s2 == null) return false
                let matchArray = [], strArray = [s1, s2]
                for (let i=0;i<strArray.length;i++) {
                    matchArray.push(strArray[i].toLowerCase().match(/\w+/g))
                }
                [s1, s2] = matchArray
                if (s1.length != s2.length) return false
                let b = true
                for (let i=0;i<s1.length;i++) {
                    if (s1[i] != s2[i]) return false
                }
                return b
            }
            let researchgate = (paperTitle) => {
                const url = `https://www.researchgate.net/search.SearchBox.html?query=${paperTitle}&activeTab=publication`
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {'accept': 'application/json'},
                    responseType: 'json',
                    onload: function (res) {
                        try {
                            const resData = res.response['result']['state']['searchSearch']['publication']['items']
                            console.log(resData)
                            let url = ''
                            let i = 0
                            while (i < resData.length) {
                                let item = resData[i]
                                if (!Object.prototype.hasOwnProperty.call(item['urls'], 'download')){
                                    console.log(`researchgate: no url`)
                                } else {
                                    const pdfURL = 'https://www.researchgate.net/' + item['urls']['download']
                                    // 标题是否一致
                                    if (isConsistent(item['title'], paperTitle)) {
                                        url = pdfURL
                                        console.log(`researchgate[${i}]: best title`)
                                        console.log(paperTitle)
                                        console.log(item['title'])
                                        break
                                    } else {
                                        console.log(`researchgate: not consistent`)
                                    }
                                }
                                i += 1
                            }
                            setData({
                                message: 'researchgate.net',
                                url: url
                            })
                        } catch {
                            console.log(res)
                        }
                    }
                })
            }
            // 2.4 出版商地址
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://doi.org/${doi}`,
                onload: function (res) {
                    let publisherURL = res.finalUrl
                    // https://linkinghub.elsevier.com/retrieve/pii/S016980952100421X
                    if (publisherURL.includes('linkinghub.elsevier.com')) {
                        let pdfURL = 'https://www.sciencedirect.com/science/article/pii/' + publisherURL.match(/pii\/(.+)/)[1] + '/pdfft'
                        console.log(pdfURL)
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: pdfURL,
                            onload: function (res) {
                                let url = ''
                                res = res.response.match(/"(https?:\/\/pdf.+)"/)
                                if (res && res.length == 2) {
                                    url = res[1]
                                } else {
                                    url = ''
                                }
                                setData({
                                    message: 'sciencedirect.com',
                                    url: url
                                })
                            }
                        })
                    } else if (publisherURL.includes('springer.com')) {
                        let pdfURL = 'https://link.springer.com/content/pdf/' + publisherURL.match(/article\/(.+)/)[1] + '.pdf'
                        console.log(pdfURL)
                        let func = (res) => {
                            let url
                            let contentType = res.responseHeaders.match(/content-type:(.+)/)[1]
                            console.log(contentType)
                            if (contentType.includes('pdf')) {
                                url = pdfURL
                            } else {
                                url = ''
                            }
                            setData({
                                message: 'springer.com',
                                url: url
                            })
                        }
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: pdfURL,
                            onprogress: func,
                            onload: func
                        })
                    } else {
                        setData({
                            message: 'sciencedirect.com',
                            url: null
                        })
                    }
                    // 补充其他
                }
            })
            // 3 等待data结果，并提交至下一个函数
            let total = 0
            const interval = 10
            let id = setInterval(() => {
                if (Object.keys(data).includes('url')) {
                    console.log(data)
                    utils.getPdf(data, doi)
                    clearInterval(id)
                } else if (failSource == totalSource) {
                    data = {
                        message: 'NotSupport',
                        url: ''
                    }
                    utils.getPdf(data, doi)
                    clearInterval(id)
                } else if (total > this.timeout * 1000) {
                    data = {
                        message: 'Timeout',
                        url: ''
                    }
                    utils.getPdf(data, doi)
                    clearInterval(id)
                }
                total += interval
            }, interval)
        },
        getPdf(data, doi) {
            if (document.querySelectorAll(`#sciDownloadBox[doi="${doi}"]`).length == 0) return
            // 进入下载，收回timeout倒计时的进度条
            let progress = this.sciState.querySelector('svg .progress')
            let currentOffset = getComputedStyle(progress)['stroke-dashoffset']
            GM_addStyle(`
                #sciContent[progress] #sciState .progress {
                    stroke-dashoffset: ${currentOffset};
                    animation: progressRecover .23s linear;
                }
            `)
            setTimeout(() => {
                // 动画结束后改变sciContent状态
                this.sciContent.removeAttribute('progress')
            }, 230)
            this.changeContent(null, data.message)
            // api相应速度太快，可能清除不掉过一段时间才出现的进度条, 检测一秒钟
            let exit = true
            switch (data.message) {
                case 'NotSupport':
                    this.log('不支持该文章，退出...')
                    break
                case 'Timeout':
                    this.log('请求超时，退出...')
                    break
                default:
                    this.log('请求pdf中...')
                    exit = false
            }
            setTimeout(() => {
                progress.style['stroke-dashoffset'] =  '0'
            }, 230*2)
            if (exit) {
                return
            }
            utils.sciContent.style['background-color'] = utils.color.flash
            let openInTab = (url) => {
                if (typeof(GM_openInTab) == 'undefined') {
                    var a = document.createElement('a')
                    a.href = url
                    a.target = '_blank'
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                } else {
                    GM_openInTab(url, {active: false, insert: true})
                }
            }
            utils.sciText.onclick = () => { openInTab(data.url) }
            utils.sciState.onclick = () => { openInTab(data.url) }
            // 开始缓存同时尝试打开链接，可将下行反注释即可
            // window.open(pdfURL)
            let failSetting = () => {
                progress.style['stroke-dashoffset'] =  '0'
                utils.sciContent.style['background-color'] = utils.color.fail
            }
            let lastTime, currentTime, lastDone=0, currentDone, size
            setTimeout(() => {
                this.sciContent.setAttribute('loading', '')
                progress.style['stroke-dashoffset'] =  utils.progressTotaLength
            }, 230*2)
            GM_xmlhttpRequest({
                method: 'GET',
                url: data.url,
                responseType: 'blob',
                onprogress: function(res) {
                    if (document.querySelectorAll(`#sciDownloadBox[doi="${doi}"]`).length == 0) return
                    utils.sciContent.removeAttribute('loading')
                    if (!res.responseHeaders.match(utils.pdfRegex)) {
                        failSetting()
                        return
                    }
                    // 波浪冲击效果待完成
                    let rippleUp = (opacity) => {
                        let ripple = document.createElement("span")
                        ripple.setAttribute('class', 'ripple')
                        ripple.style.backgroundColor = 'white'
                        ripple.style.zIndex = -1
                        ripple.style.opacity = opacity
                        ripple.style.left = `${utils.getElementWidth(utils.sciContent)}px`
                        ripple.style.top = '20px'
                        utils.sciContent.appendChild(ripple)
                        // timeout数值越大涟漪扩散越慢
                        setTimeout(() => {
                            ripple.remove()
                        }, 1E3)
                    }
                    currentTime = new Date().getTime()
                    currentDone = res.done
                    if (!lastTime | currentTime - lastTime >= 300) {
                        size = (currentDone - lastDone) / 1024 / 1024 * 5
                        rippleUp(size > 1 ? 1 : size)
                        lastTime = currentTime
                        lastDone = currentDone
                        let tip
                        let key = `sciDownload-journal-${data.journal_name}`
                        let journal_info = GM_getValue(key, "...")
                        if (res.lengthComputable) {
                            utils.sciContent.setAttribute('download-progress', '')
                            let percent = res.done / res.total
                            progress.style['stroke-dashoffset'] =  utils.progressTotaLength * (1 - percent)
                            // 下载进度条
                            GM_addStyle(`
                                #sciContent[download-progress] #sciText::before {
                                    content: "";
                                    position: absolute;
                                    right: 0;
                                    bottom: 0;
                                    height: 40px;
                                    width: ${percent * 100}%;
                                    background-color: white;
                                    opacity: 0.5;
                                    z-index: -1;
                                    transition: width .23s linear;
                                }
                            `)
                            tip = `${journal_info} | ${(res.done / 1024 / 1024).toFixed(2)}M | ${(res.total / 1024 / 1024).toFixed(2)}M | ${(percent * 100).toFixed(2)}% | ${data.message}`
                        } else {
                            tip = `${journal_info} | ${(res.done / 1024 / 1024).toFixed(2)}M | --M | --% | ${data.message}`
                            utils.sciContent.setAttribute('download-noprogress', '')
                        }
                        utils.sciContent.setAttribute('title', tip)
                        utils.sciSwitch.setAttribute('title', tip)
                    }
                },
                onload: function(res) {
                    if (document.querySelectorAll(`#sciDownloadBox[doi="${doi}"]`).length == 0) return
                    let size = (res.response.size / 1024 / 1024).toFixed(2)
                    let key = `sciDownload-journal-${data.journal_name}`
                    let journal_info = GM_getValue(key, "...")
                    let tip = `${journal_info} | ${size}M | ${data.message}`
                    utils.sciContent.setAttribute('title', tip)
                    utils.sciSwitch.setAttribute('title', tip)
                    setTimeout(() => {
                        utils.sciContent.removeAttribute('loading')
                        if (!res.responseHeaders.match(utils.pdfRegex)) {
                            failSetting()
                            notification.open('pdf加载失败了，亲自点一下吧~', 3)
                            return
                        }
                        utils.sciContent.removeAttribute('download-progress')
                        utils.sciContent.removeAttribute('download-noprogress')
                        setTimeout(() => {
                            utils.sciContent.style['background-color'] = utils.color.success
                        }, 230);
                        let fileURL = URL.createObjectURL(new Blob([res.response], {type: 'application/pdf'}))
                        let title = doi.split('/').slice(1).join('/')
                        let titleRes = res.responseHeaders.match(/filename=(.+)/)
                        if (titleRes) {
                            title = decodeURI(titleRes[1].split(';')[0]).replace('.pdf', '').replace('"', '').replace('"', '')
                        }
                        utils.sciText.removeAttribute('href')
                        let downloadPdf = (fileURL, title) => {
                            let aTag = document.createElement('a')
                            aTag.setAttribute('href', fileURL)
                            aTag.setAttribute('download', `${title}.pdf`)
                            aTag.click()
                        }
                        utils.sciText.onclick = () => {
                            setTimeout(() => {
                                if ((typeof(GM_setValue) == 'undefined')) {
                                    downloadPdf(fileURL, title)
                                } else {
                                    let win = window.open()
                                    win.document.write(`<iframe name="${title}" src="${fileURL}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`)
                                    win.document.title = title
                                }
                            }, 1E3)
                        }
                        utils.log('缓存pdf成功')
                        utils.sciContent.style['background'] = utils.color.success
                        utils.changeContent(utils.svg.pdf, title)
                        utils.sciState.onclick = () => {
                            downloadPdf(fileURL, title)
                        }
                        // 防止此时还没变更
                        let key = `sciDownload-journal-${data.journal_name}`
                        let value
                        if (utils.sciContent.getAttribute('title').includes('...')) {
                            // 设置一个循环等着
                            let id = setInterval(() => {
                                value = GM_getValue(key, undefined)
                                if (value !== undefined) {
                                    let tip = utils.sciContent.getAttribute('title')
                                        .replace('...', value)
                                    utils.sciContent.setAttribute('title', tip)
                                    utils.sciSwitch.setAttribute('title', tip)
                                    clearInterval(id)
                                }
                            }, 200);
                        }
                    }, 230*3);
                }
            })
        },
        log(text) {
            console.log('[sciDownload]', text)
        }
    }
    try{
        GM_addStyle(utils.style())
    } catch {
        utils.log('添加style失败，退出...')
        return
    }
    let lastDoi = null
    let lastIsSelect = false
    setInterval(function () {
        let [doi, select] = utils.getDoi()
        if (!doi | doi == lastDoi | (lastIsSelect && !select)) {
            return
        }
        lastDoi = doi
        lastIsSelect = select
        let a = 'background: #00b894; color: #fff; opacity: 0.75;'
        let b = 'background: #2c3e50; color: #fff; opacity: 0.75;'
        console.log(`%c sciDownload %c ${doi} `, a, b)
        utils.LocalSearch(doi)
    }, 500)
})();