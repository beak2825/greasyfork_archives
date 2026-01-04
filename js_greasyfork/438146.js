// ==UserScript==
// @name         online-selection
// @namespace    com.hho.middle.fe.online.selection
// @version      0.27
// @description  在线选品
// @author       bosiwan
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=camp-fire.jp
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM.setValue
// @grant        GM.getValue 
// @grant        GM.deleteValue 
// @grant        GM.listValues
// @grant        GM.setClipboard
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        unsafeWindow
// @run-at       document-body
// @connect      taobao.com
// @connect      alicdn.com
// @connect      hhodata.com
// @connect      tamll.com
// @connect      1688.com
// @downloadURL https://update.greasyfork.org/scripts/438146/online-selection.user.js
// @updateURL https://update.greasyfork.org/scripts/438146/online-selection.meta.js
// ==/UserScript==

class Dep{ //订阅池
    constructor(name){
        this.id = new Date()    // 使用时间戳做订阅池的ID
        this.subs = []          // 该事件下对象的集合
    }
    defined(){                  // 添加订阅者
        Dep.watch.add(this);
    }
    notify(){                   // 通知订阅者有变化
        this.subs.forEach((e,i)=>{
            if(typeof e.update === 'function'){
                try{
                    e.update.apply(e);  // 触发订阅者更新函数
                }catch(err){
                    console.warr(err);
                }
            }
        })
    }
}

Dep.watch = null;

class Watch{
    constructor(name,fn){
        this.name = name;           // 订阅消息的名称
        this.id = new Date();       // 使用时间戳做订阅者的ID
        this.callBack = fn;         // 订阅消息发送改变时 -> 订阅者执行的回调函数
    }
    add(dep){                       // 将订阅者放入dep订阅池
        dep.subs.push(this);
    }
    update(){                       // 将订阅者更新方法
        var cb = this.callBack;     // 赋值为了不改变函数内调用的this
        cb(this.name);
    }
}



(function() {
    'use strict';
    
    // TODO: 切换测试正式
    const portalHost = 'portal.hhodata.com'
    // const portalHost = 'containertest.hhodata.com'

    // 众筹站点
    const fundingSites = ['camp-fire.jp', 'greenfunding.jp', 'www.makuake.com']
    // 众筹 pathnames 列表遍历寻源
    // const fundingListPathname = ['/projects/category', '/portals/search', '/discover/categories']
    // 众筹 detail 详情寻源
    const fundingDetailPathname = ['/projects/view', '/project']
    // 寻源站点
    const sourcingSites = ['item.taobao.com', 'detail.tmall.com', 'detail.tmall.hk', 'detail.1688.com']
    // portal
    const portalPaths = [
        'https://portal.hhodata.com/sevensmall-onshelf/sevensmall-onshelf/add',
        'http://containertest.hhodata.com/sevensmall-onshelf/sevensmall-onshelf/add'
    ]

    const isFundingSites = fundingSites.indexOf(window.location.host) !== -1
    const isSourcingSites = sourcingSites.indexOf(window.location.host) !== -1
    const isPortal = portalPaths.indexOf(window.location.href.split('?')[0]) !== -1
    const isFrom7sou = queryParams('extension') === '7sou'

    // api baseurl
    const baseURL = `http${portalHost.startsWith('containertest') ? '' : 's'}://` + portalHost
    const DomainMap = {
        'camp-fire.jp': 'camp-fire',
        'greenfunding.jp': 'greenfunding',
        'www.makuake.com': 'makuake',
        'item.taobao.com': 'taobao',
        'detail.1688.com': 'one688',
        'detail.tmall.com': 'tmall',
        'detail.tmall.hk': 'tmall',
    }

    // 拖动事件，记录鼠标xy
    let preX = 0, preY = 0, startX = 0, startY = 0, canMoving = false

    // 汇率记录（日元转人民币）
    let exchangeRates = 1

    // blob 视频流处理
    let _sourceBufferList = [] // blob
    let _endOfStream = window.MediaSource.prototype.endOfStream // 监听资源全部录取成功
    let _addSourceBuffer = window.MediaSource.prototype.addSourceBuffer // 录取资源
    let _sourceBufferLoaded = false // 已经加载完
    
    const css =`
    .hho-button {
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 6px;
        padding-bottom: 6px;
        min-width: 100px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -o-user-select: none;
        user-select: none;
        cursor: pointer;
    }
    .hho-primary-button {
        background-color: rgb(3, 193, 253);
        color: white;
        font-weight: bold;
    }
    .hho-delete-button {
        background-color: #f52743;
        color: white;
        font-weight: bold;
    }
    .hho-online-selection-container {
        position:fixed; 
        top: 50px; 
        right: 40px; 
        z-index: 9007199254740991; 
        background: white; 
        width: 300px;
        border-radius: 6px;
        box-shadow: 0px 0px 6px 3px rgba(0,0,0,0.5); 
        padding: 8px;
    }
    .button-list {
        display: flex;
        margin-top: 6px;
    }
    .result-container {
        max-height: 520px; 
        overflow-y: scroll; 
        cursor: default;
    }
    .hho-selected {
        border: 1px solid red;
    }
    #hhoLog p {
        margin: 0;
        font-size: 12px;
    }
    `
    GM_addStyle(css)


    function init() {
        $(document).ready(function() {
            if (window.location.host === portalHost && window.location.pathname.indexOf('sevensmall-onshelf') === -1) {
                const token = localStorage.getItem('__hho_token__')
                if (token) {
                    GM.setValue('hho_token', localStorage.getItem('__hho_token__'))
                    window.close()
                    return
                }
            }

            if (!isFundingSites && !isSourcingSites && !isPortal) return
            // 添加按钮
            if ($('#hho-online-selection-container').length > 0) return

            $('body').append(`<div id="hho-online-selection-container" class="hho-online-selection-container">
                <div  id="hho-online-selection-header" onmousedown="handleMouseDown(event)" onmouseup="handleMouseUp(event)" style="cursor: move;">
                    <div style="font-weight: bold;">
                        <a href="https://cdn.hhodata.com/chrome-extension/online-selection/script.user.js">【更新插件】</a>
                        7sou - 7秒寻源&nbsp;&nbsp;&nbsp;&nbsp;
                        <span id="loading-text"></span>
                    </div>
                    <div class="button-list"></div>
                    <div id="hhoBlob"></div>
                    <div id="hhoLog"></div>
                </div>
                <div class="result-container"></div>
            </div>`)

            if (isFundingSites) {
                // const yesButton = `<div class="hho-button hho-primary-button" id="hhoYesBtn">寻源</div>`
                $('#hho-online-selection-container .button-list').append('<span>请使用截图工具截图至剪切板，在此黏贴即可寻源</span>');
                $('#hho-online-selection-header').after('<label>关键词：</label><input name="search" style="margin: 6px" />')

                // 事件绑定
                // $(document).off('click',"#hhoYesBtn", save);
                // $(document).on('click',"#hhoYesBtn", save);
                $(document).off('paste', handleSourcingPaste)
                $(document).on('paste', handleSourcingPaste)

                // 查询线索关系
                queryRelation()

                // 渲染汇率
                getExchangeRates().then(res => {
                    exchangeRates = Number(Number(res).toFixed(2))
                    renderExchangePrice()
                })

                // 搜索
                $('input[name="search"]').on("keyup", function (event) {
                    if (event.key === "Enter") {
                        if (!unsafeWindow.hhoSourcingResults) return
                        const searchKey = event.currentTarget.value
    
                        if (searchKey) {
                            unsafeWindow.hhoSourcingResultsFilter = unsafeWindow.hhoSourcingResults.filter(d => d.itemName.indexOf(searchKey) !== -1)
                        } else {
                            unsafeWindow.hhoSourcingResultsFilter = unsafeWindow.hhoSourcingResults
                        }
                        unsafeWindow.renderResultContainer(unsafeWindow.hhoSourcingResultsFilter)
                    }
                });
            } else if (isSourcingSites) {
                // 寻源站点 【一键上架】、【重新加载图片】
                const uploadButton = `<div class="hho-button hho-primary-button" id="hhoUploadButton">一键上架</div>`
                $('#hho-online-selection-container .button-list').append(uploadButton);
                const renderImageButton = `<div class="hho-button hho-primary-button" style="margin-left: 10px" id="renderImageButton">重新加载图片</div>`
                $('#hho-online-selection-container .button-list').append(renderImageButton);
                // 获取图片
                renderImageList()
                // 事件绑定
                $(document).off('click',"#renderImageButton", renderImageList);
                $(document).on('click', "#renderImageButton", renderImageList);
                $(document).off('click',"#hhoUploadButton", startUpload);
                $(document).on('click', "#hhoUploadButton", startUpload);
                $(document).off('paste', handleSourcingSitesPaste)
                $(document).on('paste', handleSourcingSitesPaste)


                // blob视频
                window.MediaSource.prototype.endOfStream = function () {
                    logger('blob视频资源全部捕获成功')
                    $('#hhoBlob').text('')
                    _sourceBufferLoaded = true
                    _endOfStream.call(this)
                }

                window.MediaSource.prototype.addSourceBuffer = function (mime) {
                    let sourceBuffer = _addSourceBuffer.call(this, mime)
                    let _append = sourceBuffer.appendBuffer
                    let bufferList = []
                    if (mime.startsWith('video/mp4')) {
                        _sourceBufferList.push({ mime, bufferList })
                        sourceBuffer.appendBuffer = function (buffer) {
                            console.log(`正在捕获blob片段，已捕获 ${_sourceBufferList[0].bufferList.length} 个`)
                            $('#hhoBlob').text(`正在捕获blob片段，已捕获 ${_sourceBufferList[0].bufferList.length} 个`)
                            bufferList.push(buffer)
                            _append.call(this, buffer)
                        }
                    }
                    
                    return sourceBuffer
                }

                GM.setValue('hho_attributes', [])
            } else if (isPortal && isFrom7sou) { 
                GM.getValue('hho_attributes').then(attributesList => {
                    console.log(attributesList)
                    $('#hho-online-selection-container .result-container').empty()
                    $('#hho-online-selection-container .result-container').append('<ul></ul>')
                    attributesList.forEach((d, index) => {
                        $('#hho-online-selection-container .result-container ul').append(`<li>${index+1}、${d}</li>`)
                    })
                    
                })
                
            }
            
            $(document).mousemove(handleMouse)
        })
    }

    var $ = window.$
    var addHistoryMethod = (function(){
        var historyDep = new Dep();
        return function(name){
            if(name === 'historychange'){
                return function(name,fn){
                    var event = new Watch(name,fn)
                    Dep.watch = event;
                    historyDep.defined();
                    Dep.watch = null;       //    置空供下一个订阅者使用
                }
            }else if(name === 'pushState' || name === 'replaceState'){
                var method = history[name];
                return function(){
                    init()
                    method.apply(history,arguments);
                    historyDep.notify();
                }
            }
        }
    }());
    
    window.addHistoryListener = addHistoryMethod('historychange');
    history.pushState = addHistoryMethod('pushState');
    history.replaceState = addHistoryMethod('replaceState');
    init()
    

    function _ajax (options, headers = { 'Content-Type': 'application/json' }) {
        $("#loading-text").text('加载中...')
        return new Promise((resolve, reject) => {
            GM.getValue('hho_token').then(res => {
                if (!res) {
                    window.open(baseURL)
                    return
                }
                $.ajax({
                    ...options,
                    headers: {...headers, 'x-token': res},
                    complete: function (data) {
                        $("#loading-text").text('')
                        if (data.status === 200) {
                            if (data.responseJSON.msg === '未登录或非法访问') {
                                // 登录
                                window.open(baseURL)
                                reject()
                            } else {
                                resolve(data.responseJSON.data)
                            }
                        } else {
                            reject()
                        }
                    },
                    fail: function(err) {
                        reject(err)
                    }
                })
            }).catch(err => window.open(baseURL))
        })
    }

    function _gmAjax (options, headers = {}) {
        $("#loading-text").text('加载中...')
        return new Promise((resolve, reject) => {
            GM.getValue('hho_token').then(res => {
                if (!res) {
                    window.open(baseURL)
                    return
                }
                GM_xmlhttpRequest({
                    ...options,
                    headers: { ...headers, 'x-token': res },
                    onload: function (data) {
                        console.log(data)
                        $("#loading-text").text('')
                        if (data.status === 200) { 
                            if (!data.response) {
                                resolve('')
                                return
                            }
                            if (JSON.parse(data.response).msg === '未登录或非法访问' || JSON.parse(data.response).msg === '您的帐户异地登陆或令牌失效') {
                                // 登录
                                window.open(baseURL)
                                reject()
                            } else {
                                resolve(JSON.parse(data.response))
                            }
                            
                        } else if (data.status === 405) { 
                            window.open(baseURL)
                            reject()
                        } else {
                            $("#loading-text").text(data.statusText)
                            const errResponse = JSON.parse(data.response)
                            reject(data.status + ' ' + (data.statusText || errResponse.errorMsg))
                        }
                    },
                    onerror: function (err) {
                        window.open(baseURL)
                        console.log(err)
                        reject();
                    }
                })
            }).catch(err => window.open(baseURL))
        })
    }

    function queryParams(param) {
        return new URL(location.href).searchParams.get(param)
    }

    function getJPNPrice(CHNPrice) {
        const price = Math.ceil((parseInt(CHNPrice) + 50) * 18.12 * 1.1)
        const price2Str = (price + '').substring(0, (price + '').length - 2) + '99'
        return parseInt(price2Str)
    }

    function getSourcingResult(project) {
        return _ajax({
            url: baseURL + `/api/sevenSmall/sevenSmallResult?projectCode=${project.code}&domain=${project.domain}`,
            method: 'GET',
            dataType: 'json',
        })
    }

    function startSourcing(project) {
        return _ajax({
            url: baseURL + `/api/sevenSmall/sevenSmallParseSouring`,
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                html: document.documentElement.innerHTML,
                url: window.location.href,
                projectCode: project.code,
                domain: project.domain
            }),
        })
    }

    function resourcing (file, project) {
        var formData = new FormData()
        formData.append('projectCode', project.code)
        formData.append('domain', project.domain)
        formData.append('imgfile', file)

        return _ajax({
            url: baseURL + `/api/sevenSmall/sevenSmallSourcingAgain`,
            enctype: 'multipart/form-data',
            type: 'POST',
            dataType: 'json',
            processData: false,
            contentType: false,
            data: formData,
        }, {})
    }

    // function save() {
    //     if (!window.location.pathname.startsWith('/projects/view') && 
    //         !(/\/.*\/projects\/[0-9]+/.exec(window.location.pathname)) &&
    //         !window.location.pathname.startsWith('/project')
    //     ) {
    //         alert('不是详情页页')
    //         return;
    //     } 
    //     let project = {}
    //     const domain = DomainMap[window.location.host]
    //     switch (domain) {
    //         case 'camp-fire':
    //             project = DetailSelection.campfile() 
    //             break;
    //         case 'greenfunding':
    //             project = DetailSelection.greenfunding()
    //             break;
    //         case 'makuake':
    //             project = DetailSelection.makuake()
    //             break;
    //         default:
    //             break;
    //     }
    //     startSourcing(project).then(() => {
    //         getSourcingResult(project).then(showSourcingResult).catch(err => alert('寻源失败，再点一次试试'))
    //     }).catch(error => alert('寻源失败，再点一次试试'))
    // }

    // 截图寻源
    function handleSourcingPaste(event) {
        const items = event.originalEvent.clipboardData && event.originalEvent.clipboardData.items
        if (!items || items.length <= 0) { return }
        let file = null
        // 检索剪切板items
        file = Array.from(items).find(d => d.type.indexOf('image') !== -1)?.getAsFile()
     
        if (!file) {
            logger('没有从剪切板读取到图片')
            return
        }

        logger('正在寻源，请耐心等待...')

        // const confirm = window.confirm('确定重新寻源吗？')
        // if(!confirm) return

        let project = {}
        const domain = DomainMap[window.location.host]
        switch (domain) {
            case 'camp-fire':
                project = DetailSelection.campfile() 
                break;
            case 'greenfunding':
                project = DetailSelection.greenfunding()
                break;
            case 'makuake':
                project = DetailSelection.makuake()
                break;
            default:
                break;
        }
        resourcing(file, project).then(res => {
            getSourcingResult(project).then(showSourcingResult).catch(err => alert('寻源失败，再点一次试试'))
        })
    }

    // 截图上传商品主图/OCR识别
    function handleSourcingSitesPaste (event) {
        const items = event.originalEvent.clipboardData && event.originalEvent.clipboardData.items
        if (!items || items.length <= 0) { return }
        let file = null
        // 检索剪切板items
        file = Array.from(items).find(d => d.type.indexOf('image') !== -1)?.getAsFile()
    
        if (!file) { return }

        const confirm = window.prompt('上传商品主图请填1，OCR识别请填2。都不是请取消', '1')
        if (!confirm) return
        if (confirm === '1') {
            const url = URL.createObjectURL(file)
            renderImageList({ hhosrc: url })
        } else if (confirm === '2') {
            // OCR接口，获取的内容存入 hho_attributes
            readOCR(file).then(ocrstr => {
                GM.getValue('hho_attributes').then(attributes => {
                    attributes.push(ocrstr)
                    GM.setValue('hho_attributes', attributes)
                }).catch(err => {
                    console.log(err)
                })
            })
            // logger ('')
        }
    }

    // OCR 识别
    function readOCR (meidaFile) {
        if(!meidaFile) return
        return new Promise((resolve, reject) => {
            logger('正在识别OCR内容，请耐心等待...')
            let fd = new FormData()
            fd.append('file', meidaFile)
            _gmAjax({
                url: 'https://media.athena.hhodata.com/api/image/ocr',
                method: 'POST',
                data: fd,
            }).then(resocr => {
                if (!resocr || !resocr.length || resocr.length === 0) {
                    logger('未识别出内容，请重试')
                    resolve()
                    return
                }
                const ocrstr = resocr.map(d => d.word).join(' ')
                logger('已识别：' + ocrstr)
                resolve(ocrstr)
            }).catch(err => {
                logger('识别失败 ' + err)
                reject(err)
            })
        })
    }

    // 移动container
    unsafeWindow.handleMouseDown = function handleMouseDown (event) {
        event.preventDefault()
        event.stopPropagation()
        preX = event.clientX
        preY = event.clientY
        startX = $('#hho-online-selection-container')[0].offsetLeft
        startY = $('#hho-online-selection-container')[0].offsetTop
        if (!canMoving) {
            canMoving = true
        }
    }

    unsafeWindow.handleMouseUp = function handleMouseUp (event) {
        event.preventDefault()
        event.stopPropagation()
        if (canMoving) {
            canMoving = false
        }
    }

    function handleMouse (event) {
        if (canMoving) {
            event.preventDefault()
            event.stopPropagation()
            $("#hho-online-selection-container").css("top", event.clientY - preY + startY + 'px')
            $("#hho-online-selection-container").css("left", startX + event.clientX - preX + 'px')
        }
    }

    // 获取汇率
    function getExchangeRates () { 
        return _ajax({
            url: baseURL + `/api/sevenSmall/getExchange?currency=JPY`,
            method: 'GET',
            dataType: 'json',
        })
    }

    // append 转人民币后的价格 并且 * 0.6
    function renderExchangePrice () {
        const domain = DomainMap[window.location.host]
        let ul, li;
        switch (domain) {
            case 'camp-fire':
                ul = ExchangePriceSelection.campfile().ul
                li = ExchangePriceSelection.campfile().li
                break;
            case 'greenfunding':
                ul = ExchangePriceSelection.greenfunding().ul
                li = ExchangePriceSelection.greenfunding().li
                break;
            case 'makuake':
                ul = ExchangePriceSelection.makuake().ul
                li = ExchangePriceSelection.makuake().li
                break;
            default:
                break;
        }
        if (!ul || !li) {return}
        $(ul).before(`<p style="padding: 12px">实时汇率： ${exchangeRates.toLocaleString()}</p>`)
        Array.prototype.slice.call(document.querySelectorAll(li)).forEach(ele => {
            const price = Number(ele.innerText.match(/\d+/g).join(''))
            const exchangePrice = +Number(price / exchangeRates).toFixed(2)
            const offPrice = +Number(exchangePrice * 0.6).toFixed(2)
            $(ele).after(`<p style="padding: 12px" class="hho-exchange-price">人民币：${exchangePrice.toLocaleString()} * 0.6 = ${offPrice.toLocaleString()}</p>`)
        });
    }

    function renderImageList (uploadImage) {
        $('#hho-online-selection-container .result-container').empty()
        const domain = DomainMap[window.location.host]
        if (!domain) return
        let imagesList = ImageSelection[domain]()
        if (uploadImage) { 
            imagesList.push(uploadImage)
        }
        $('.result-container').append('<div class="result-images" style="display: grid; grid-template-columns: 100px 100px 100px; grid-template-rows: 100px 100px 100px;"></div>')
        imagesList.forEach((img, index) => {
            if (img.hhosrc) {
                $('.result-container .result-images').append('<img class="hho-image" style="width: 90%; aspect-ratio: 1 / 1;" src="' + img.hhosrc + '" />')
            }
        })

        $('.result-container .result-images').off('click', 'img', selectImage)
        $('.result-container .result-images').on('click', 'img', selectImage)
    }

    function selectImage (e) {
        $('.result-container .result-images img').each(function(){
            $(this).removeClass('hho-selected')
        });
        $(this).addClass('hho-selected')
    }

    function startUpload () {
        $('#hhoLog').empty()
        logger('开始一键上架')
        
        const domain = DomainMap[window.location.host]
        if (!domain) return
        
        UploadSelection[domain]().then(res => {
            console.log('init data: ', res)
            if (!res) {
                logger('没有解析到页面数据，请联系管理员')
                return
            }

            if (isNaN(res.rmbPrice)) {
                logger('请选择具体 SKU 的价格后再继续上传')
                return
            }

            logger(`当前 SKU 价格: ${res.rmbPrice}`)

            if (!res.img) {
                logger('请选择主图后再继续上传')
                return
            }

            if (!res.video) {
                if (window.location.host === 'detail.1688.com') {
                    logger('1688一键上架前请先点击视频播放')
                    return
                }
                logger('页面上没有视频，不建议上传')
                return
            }

            let videoFn
            if (res.video.startsWith('blob')) {
                // blob
                if (!_sourceBufferLoaded) {
                    logger('blob 视频资源未加载完毕，请加载完毕后再次点击【一键上架】')
                    return
                }
                videoFn = blobToFile
            } else {
                videoFn = mp4ToFile
            }

            videoFn(res.video).then((videoFile) => {
                return fileUpload(videoFile, 'video')
            }).then(videoUrl => {
                res.ossOriginalUrl = videoUrl
                return imageToFile(res.img)
            }).then(imageFile => {
                return fileUpload(imageFile, 'image')
            }).then(imageUrl => {
                res.productImage = imageUrl
                return create7smallForm(res)
            }).then(sevensmallId => {
                window.open(`${baseURL}/sevensmall-onshelf/sevensmall-onshelf/add?id=${sevensmallId}&iframe=false&onShelf=false&extension=7sou`)
                // 建立关系
                createSevensmallRelation(sevensmallId)
            }).catch(err => {
                console.log(err)
            })
            
        })

        
        // blob url to File
        function blobToFile () {
            return new Promise((resolve, reject) => {
                _sourceBufferList.forEach((target) => {
                    const mime = target.mime.split(';')[0]
                    const type = mime.split('/')[1]
                    const fileBlob = new Blob(target.bufferList, { type: mime })
                    resolve(new window.File([fileBlob], '1.mp4', { type: fileBlob.type }))
                })
            })
        }

        // mp4 url 转 File 对象
        function mp4ToFile (url) {
            logger('准备将视频解析成File')
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: url,
                    responseType: 'blob',
                    method: 'GET',
                    onload: function (resblob) {
                        logger('视频解析成File成功')
                        resolve(new window.File([resblob.response], '1.mp4'))
                    },
                    onerror: function (err) {
                        logger('视频解析成File失败')
                        reject(err)
                    }
                })
            })
        }

        // img url 转 File 对象
        function imageToFile (url) {
            logger('准备将图片解析成File')
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: url,
                    responseType: 'blob',
                    method: 'GET',
                    onload: function (res) {
                        logger('图片解析成File成功')
                        resolve(new window.File([res.response], '1.jpg', { type: res.type }))
                    },
                    onerror: function (err) {
                        logger('图片解析成File失败')
                        reject(err)
                    }
                })
            })
        }

        // File 上传到 OSS
        function fileUpload (meidaFile, mediaType) {
            if(!meidaFile) return
            return new Promise((resolve, reject) => {
                logger(mediaType === 'video' ? '正在上传视频，请耐心等待...' : '正在上传图片，请耐心等待...')
                let fd = new FormData()
                fd.append('file', meidaFile)
                _gmAjax({
                    url: baseURL + '/api/item/center/upload/upload',
                    method: 'POST',
                    data: fd,
                }).then(resvideo => {
                    logger(mediaType === 'video' ? '视频上传成功' : '图片上传成功')
                    resolve(resvideo.data.url)
                }).catch(err => {
                    logger((mediaType === 'video' ? '视频上传失败' : '图片上传失败') + err)
                    reject(err)
                })
            })
        }
    }

    // function translate (titleCN) {
    //     logger('准备翻译标题')
    //     return _gmAjax({
    //         url: baseURL + '/api/translation/tool/robot/description',
    //         method: 'POST',
    //         dataType: 'json',
    //         data: JSON.stringify({ description: titleCN })
    //     }, {'Content-Type': 'application/json; charset=UTF-8'})
    // }

    function logger (text) {
        $('#hhoLog').append(`<p>${new Date().toLocaleString()}  ${text}</p>`)
    }

    function create7smallForm(data) {
        data.rmbPrice = Math.floor(data.rmbPrice)
        data.jpyPrice = Math.floor(data.jpyPrice)
        return new Promise((resolve, reject) => {
            console.log('create7smallForm: ', data)
            logger('准备新增7small')
            _gmAjax({
                url: baseURL + '/api/content/center/content_item/update',
                method: 'POST',
                data: JSON.stringify({
                    ...data,
                    title: '',
                    status: 1
                }),
            }, { 'Content-Type': 'application/json; charset=UTF-8' }).then(res => {
                console.log('res: ', res)
                if (res.code !== 0) {
                    logger('新增7small失败 ' + res.msg)
                    reject()
                    return
                }
                logger(`新增7small成功 <a href="${baseURL}/sevensmall-onshelf/sevensmall-onshelf/add?id=${res.data}&iframe=false&onShelf=false&extension=7sou" target="_blank">去看看</a>`)
                resolve(res.data+'')
            }).catch(err => {
                logger('新增7small失败 ' + err)
                reject()
            })
        })
    }

    function createSevensmallRelation (id) {
        return new Promise((resolve, reject) => {
            GM.getValue('hho_source').then(res => {
                let data = {}
                const domain = DomainMap[window.location.host]
                const target = CollectTargetDoaminInfo[domain] && CollectTargetDoaminInfo[domain]()
                if (res) {
                    data = { ...JSON.parse(res), ...target, "code": id }
                } else {
                    data = { ...target, "code": id }
                }
               
                _gmAjax({
                    method: 'POST',
                    url: baseURL + '/api/sevenSmallMappings/createSevenSmallMappings',
                    data: JSON.stringify(data)
                }, { 'Content-Type': 'application/json; charset=UTF-8' }).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        })
    }

    function queryRelation () {
        // makuake camp-fire greenfunding 查询寻源关系
        const host = DomainMap[window.location.host]
        if (!host) return
        console.log(host, CollectSourceDoaminInfo[host])
        const { sourceCode, sourceDomain } = CollectSourceDoaminInfo[host] && CollectSourceDoaminInfo[host]()
        console.log(sourceCode, sourceDomain)
        if(!sourceCode || !sourceDomain) return

        _gmAjax({
            url: `${baseURL}/api/sevenSmallMappings/findSevenSmallMappings?sourceCode=${sourceCode}&sourceDomain=${sourceDomain}`,
            method: 'GET',
        }, { 'Content-Type': 'application/json; charset=UTF-8' }).then(res => {
            console.log(res)
            $('#hhoLog').empty()
            if (res.code !== 0 || !res.data.resevenSmallMappings) {
                return
            } else {
                logger(`已经寻过源了: <a href=${res?.data?.resevenSmallMappings?.targetUrl} target="_blank">点击查看</a>`)
            }
        })

    }

    
    window.showSourcingResult = function showSourcingResult (results) {
        unsafeWindow.hhoSourcingResults = results
        unsafeWindow.renderResultContainer(results)
    }

    unsafeWindow.renderResultContainer = function renderResultContainer (results) {
        $('#hho-online-selection-container .result-container').empty()
        {
            $('#hho-online-selection-container .result-container').append(results.map(r => {
            const url = r.itemUrl.indexOf('?') === -1 ? `${r.itemUrl}?extension=7sou` : `${r.itemUrl.replace('?', '?extension=7sou&')}`
            return `
                <div class='result-item' onclick="collectSourceInfo();window.open('${url}')">
                    <div>
                        <img src="${r.itemPrcUrl}" style="width: 180px">
                    </div
                    <div>
                        <div>${r.itemName}</div>
                    </div>
                </div> 
                `
        }).join(''))}
    }

    unsafeWindow.collectSourceInfo = function collectSourceInfo () {
        const domain = DomainMap[window.location.host]
        if (!domain) return
        const { sourceCode, sourceDomain, sourceUrl } = CollectSourceDoaminInfo[domain] && CollectSourceDoaminInfo[domain]()
        GM.setValue('hho_source', JSON.stringify({ sourceCode, sourceDomain, sourceUrl }))
    }

    const DetailSelection = {
        campfile() {
            const code = window.dataLayer[1].dynx_itemid;
            const name = document.title
            const domain = 'camp-file'
            return {code, name, domain}
        },
        greenfunding() {
            const code = window.location.pathname.split('/').reverse()[0]
            const name = document.title
            const domain = 'Greenfunding'
            return {code, name, domain}
        },
        makuake() {
            const code = window.location.pathname.split('/').reverse()[1]
            const name = document.title
            const domain = 'makuake'
            return {code, name, domain}
        }
    }

    const ExchangePriceSelection = {
        greenfunding() {
            const ul = '.project_sidebar'
            const li = '.project_sidebar_reward--flat .project_sidebar_reward-head .project_sidebar_reward-amount'
            return {ul, li}
        },
        makuake() {
            const ul = '#return'
            const li = '.return-section .lefth4RightBase '
            return {ul, li}
        },
        campfile () { 
            const ul = '#sp-return'
            const li = '.return-box strong'
            return {ul, li}
        }
    }

    const sleep = wait => new Promise(resolve => setTimeout(resolve, wait))

    const UploadSelection = {
        taobao () {
            return new Promise((resolve, reject) => {
                const source = '淘宝'
                const secondTitle = $('.tb-main-title')[0]?.innerText;
                const rmbPrice = Number($('#J_PromoPriceNum')?.innerText || $('#J_PromoPriceNum')[0]?.innerText || $('.tb-rmb-num')[0]?.innerText || 0);
                const img = $('.result-images .hho-selected')[0]?.src
                const { origin, pathname } = window.location
                const detailUrl = origin + pathname + '?id=' + queryParams('id')
                const jpyPrice = rmbPrice && getJPNPrice(rmbPrice)
                const video = $('video')[0] && ($('video')[0].src || $('video source')[0].src)
                const skuName = $('#J_isku .tb-selected span')[0]?.innerText
                resolve({
                    secondTitle: `${secondTitle}｜${skuName}`,
                    source, rmbPrice, img, video, detailUrl, jpyPrice
                }) 
            })
        },
        tmall () {
            $('.J_playVideo')[0] && $('.J_playVideo')[0].click()
            return new Promise((resolve, reject) => {
                sleep(1000).then(() => {
                    const secondTitle = $('.tb-detail-hd > h1')[0]?.innerText;
                    const source = '天猫'
                    const rmbPrice = Number($('.tm-promo-price .tm-price')[0]?.innerText || $('.tm-price')[0]?.innerText || 0);
                    const img = $('.result-images .hho-selected')[0]?.src
                    const { origin, pathname } = window.location
                    const detailUrl = origin + pathname + '?id=' + queryParams('id')
                    const jpyPrice = rmbPrice && getJPNPrice(rmbPrice)
                    const video = $('video')[0] && ($('video')[0].src || $('video source')[0].src)
                    const skuName = $('.tb-sku .tb-selected')[0]?.title

                    resolve({
                        secondTitle: `${secondTitle}｜${skuName}`,
                        source, rmbPrice, img, video, detailUrl, jpyPrice
                    })
                }).catch(err => console.log(err))
            })
        },
        one688 () { 
            return new Promise((resolve, reject) => {
                const secondTitle = $('.title-text')[0]?.innerText;
                const source = '1688'
                const rmbPrice = Number($('.price-text')[0]?.innerText || 0);
                const img = $('.result-images .hho-selected')[0]?.src
                const video = $('video')[0] && ($('video')[0].src || $('video source')[0].src)
                const { origin, pathname } = window.location
                const detailUrl = origin + pathname + '?object_id=' + queryParams('object_id')
                const jpyPrice = rmbPrice && getJPNPrice(rmbPrice)
                const skuName = $('.prop-item .active .prop-name')[0]?.innerText

                resolve({
                    secondTitle: `${secondTitle}｜${skuName}`,
                    source, rmbPrice, img, video, detailUrl, jpyPrice
                })
            })
        }
    }

    const ImageSelection = {
        taobao() {
            var leftImagesEl = Array.from($('#J_UlThumb img')).map(d => {
                if (!d.dataset.src) {
                    d.hhosrc = ''
                } else {
                    d.hhosrc = d.dataset.src.startsWith('http') ?
                        `${d.dataset.src.replace('_50x50.jpg', '')}` :
                        `http://${d.dataset.src.replace('_50x50.jpg', '')}`
                }
                return d
            });
            leftImagesEl = leftImagesEl.filter(img => img.src.indexOf('q-90-90') < 0)
            // 详情
            var detailImagesEl = Array.from($('#J_DivItemDesc img')).map(d => {
                d.hhosrc = d.src
                return d
            });
            detailImagesEl = detailImagesEl.filter(img => img.src.indexOf('.gif') < 0 && img.src.indexOf('q-90-90') < 0)
            return leftImagesEl.concat(detailImagesEl)
        },
        tmall () {
            var leftImagesEl = Array.from($('#J_UlThumb img')).map(d => {
                d.hhosrc = d.src && `${d.src.replace('_60x60q90.jpg','')}`
                return d
            });
            leftImagesEl = leftImagesEl.filter(img => img.src.indexOf('q-90-90') < 0)
            // 详情
            var detailImagesEl = Array.from($('#description img')).map(d => {
                d.hhosrc = d.src
                return d
            });
            detailImagesEl = detailImagesEl.filter(img => img.src.indexOf('.gif') < 0 && img.src.indexOf('q-90-90') < 0)
            return leftImagesEl.concat(detailImagesEl)
        },
        one688 () { 
            var leftImagesEl = Array.from($('.detail-gallery-turn img')).map(d => {
                d.hhosrc = d.src
                return d
            });
            if (leftImagesEl.length === 0) {
                leftImagesEl = Array.from($('.tab-content img')).map(d => {
                    d.hhosrc = d.src.replace('.60x60', '')
                    return d
                });
            }
            // 详情
            var detailImagesEl = Array.from($('#detailContentContainer img')).map(d => {
                d.hhosrc = d.src
                return d
            });
            if (detailImagesEl.length === 0) {
                detailImagesEl = Array.from($('#de-description-detail img')).map(d => {
                    d.hhosrc = d.src
                    return d
                });
                
            }
            return leftImagesEl.concat(detailImagesEl)
        }
    }

    const CollectSourceDoaminInfo = {
        greenfunding() {
            const sourceCode = window.location.href.match(/[0-9]+/g)[0]
            const sourceDomain = 'Greenfunding'
            const sourceUrl = window.location.href
            return { sourceCode, sourceDomain, sourceUrl }
        },
        makuake() {
            const sourceCode = window.location.pathname.split('/')[2]
            const sourceDomain = 'makuake'
            const sourceUrl = window.location.href
            return { sourceCode, sourceDomain, sourceUrl }
        },
        campfile() { 
            const sourceCode = window.location.href.match(/[0-9]+/g)[0]
            const sourceDomain = 'camp-fire'
            const sourceUrl = window.location.href
            return { sourceCode, sourceDomain, sourceUrl }
        }
    }

    const CollectTargetDoaminInfo = {
        taobao() {
            const targetCode = queryParams('id')
            const { origin, pathname } = window.location
            const targetUrl = origin + pathname + '?id=' + queryParams('id')
            return { targetCode, targetUrl }
        },
        tmall () {
            const targetCode = queryParams('id')
            const { origin, pathname } = window.location
            const targetUrl = origin + pathname + '?id=' + queryParams('id')
            return { targetCode, targetUrl }
        },
        one688 () { 
            const targetCode = window.location.pathname.match(/[0-9]+/g)[0]
            const { origin, pathname } = window.location
            const targetUrl = origin + pathname + '?object_id=' + queryParams('object_id')
            return { targetCode, targetUrl }
        }
    }

})();