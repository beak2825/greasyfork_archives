// ==UserScript==
// @name         文库下载器/支持度娘、道客、豆丁、智库、360、原创力文库
// @namespace    wenku
// @version      2.0
// @description  文库下载器/支持度娘、道客、豆丁、智库、360、原创力文库的文档下载
// @author       zhihu
// @license      End-User License Agreement
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js
// @require      https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue

// @connect      docimg1.docin.com
// @connect      view-cache.book118.com
// @connect      docreado.mbalib.com
// @connect      so3.360tres.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/477742/%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8%E6%94%AF%E6%8C%81%E5%BA%A6%E5%A8%98%E3%80%81%E9%81%93%E5%AE%A2%E3%80%81%E8%B1%86%E4%B8%81%E3%80%81%E6%99%BA%E5%BA%93%E3%80%81360%E3%80%81%E5%8E%9F%E5%88%9B%E5%8A%9B%E6%96%87%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/477742/%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8%E6%94%AF%E6%8C%81%E5%BA%A6%E5%A8%98%E3%80%81%E9%81%93%E5%AE%A2%E3%80%81%E8%B1%86%E4%B8%81%E3%80%81%E6%99%BA%E5%BA%93%E3%80%81360%E3%80%81%E5%8E%9F%E5%88%9B%E5%8A%9B%E6%96%87%E5%BA%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //全局对象
    const window = unsafeWindow||window
    //---------------------------公共方法开始---------------------------
    String.prototype.startWith=function(str){
        if(typeof str !== 'string') str = str.toString()
        if(this==null||this==''||this.length==0||str.length==0||str.length>this.length) return false
        let len = str.length
        return this.slice(0,len) === str
    }
       
    String.prototype.endWith=function(str){
        if(typeof str !== 'string') str = str.toString()
        if(this==null||this==''||this.length==0||str.length==0||str.length>this.length) return false
        let len = str.length
        return this.slice(-len) === str
    }
     /**
     * 公共样式
     */
    const COMMON_STYLE = `
        .zh-container *{
            padding:0;
            margin:0
        }
        .zh-shadow{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 999999998;
            background-color: rgba(0,0,0,.5);
        }
        .zh-input{
            outline: none;
            border-radius: 5px;
            border: 1px solid #e7e9eb;
            color: var(--999, #999);
            width: 100%;
            flex: 1 1 0%;
            font-size: 12px;
            line-height: 16px;
            padding:5px;
            box-sizing: border-box;
        }
        .zh-button{
            font-size: 12px;
            min-height: 30px;
            background: #54be99;
            border: 1px solid #54bc99;
            color: #fff;
            border-radius: 3px;
            user-select: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            min-width: 80px;
            justify-content: center;
            box-sizing: border-box;
        }
        .zh-button.zh-default{
            background: #fff;
            border: 1px solid #dedede;
            color: #333;
        }
        .user-select{
            user-select: none;
        }
        .scroll::-webkit-scrollbar-track {
            width: 6px;
            background: transparent;
        }
        .scroll::-webkit-scrollbar-thumb {
            width: 6px;
            border-radius: 4px;
            background-color: #54be99;
            -webkit-transition: all 1s;
            transition: all 1s;
        }
        .scroll::-webkit-scrollbar-corner {
            background-color: #54be99;
        }
        .scroll::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .zh-select{
            width: 100%;
            height: 100%;
            position: relative;
        }
        .zh-select:after {
            content: "";
            width: 0px;
            height: 0px;
            position: absolute;
            right: 10px;
            top: 5px;
            border-top: 5px solid #666;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: transparent;
            top: 50%;
            transform: translateY(-2.5px);
            cursor:pointer;
        }
        .is-unfold.zh-select:after {
            transform: rotate(180deg) translateY(2.5px);
        }
        .zh-select .zh-select-text{
            height: 32px;
            position: relative;
            user-select: none;
            cursor:pointer;
        }
        .zh-select .zh-options{
            display:none;
            position: absolute;
            top: 37px;
            border: 1px solid #eee;
            width: 100%;
            border-radius: 5px;
            padding: 5px 0;
            z-index: 10000;
            background: #fff;
            max-height: 180px;
            overflow-y: auto;
            font-size: 12px;
            color: #333;
            box-sizing: border-box;
        }
        .is-unfold.zh-select .zh-options{
            display:block;
        }
        .zh-select .zh-options .zh-options-item {
            width: 100%;
            height: 28px;
            padding: 0 10px;
            box-sizing: border-box;
            line-height: 28px;
            user-select: none;
            cursor:pointer;
        }
        .zh-select .zh-options .zh-options-item.zh-active{
            background: #54be99;
            color: #fff;
        }
        .zh-checkbox{
            position: relative;
            height: 22px;
            line-height: 22px;
            width: 45px;
            padding: 0 5px;
            border: 1px solid #d2d2d2;
            border-radius: 20px;
            cursor: pointer;
            background-color: #fff;
            -webkit-transition: 0.1s linear;
            transition: 0.1s linear;
            box-sizing: content-box;
        }
        .zh-checkbox.is-selected{
            border: 1px solid #54be99;
            background-color: #54be99;
        }
        .zh-checkbox input[type="checkbox"]{
            display:none;
        }
        .zh-checkbox .zh-checkbox-btn{
            position: absolute;
            top: 3px;
            left: 5px;
            width: 16px;
            height: 16px;
            border-radius: 20px;
            background-color: #d2d2d2;
            -webkit-transition: 0.1s linear;
            transition: 0.1s linear;
        }
        .zh-checkbox .zh-checkbox-text{
            width: 100%;
            height: 100%;
            display: inline-block;
            color: #d2d2d2;
        }
        .zh-checkbox .zh-checkbox-text.zh-checkbox-off{
            text-align: right;
            display:block;
        }
        .zh-checkbox .zh-checkbox-text.zh-checkbox-on{
            text-align: left;
            color:#fff;
            display:none;
        }
        .zh-checkbox .zh-checkbox-input:checked ~ .zh-checkbox-off{
            display:none;
        }
        .zh-checkbox .zh-checkbox-input:checked ~ .zh-checkbox-on{
            display:block;
        }
        .zh-checkbox .zh-checkbox-input:checked ~ .zh-checkbox-btn{
            right: 5px;
            left:auto;
            background-color: #fff;
        }
        .zh-form-item{
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .zh-form-item .zh-form-label{
            width: 80px;
            font-weight: 400;
            line-height: 38px;
            text-align: right;
            margin-right: 10px;
            font-size:12px;
            color: #333;
        }
        .zh-form-item .zh-form-inline{

        }
    `;
        
    const UI = {
        /**
         * 开关按钮UI
         * @params {String} id -元素id
         * @params {String} OFF - 关闭状态文本
         * @params {String} ON - 开启状态文本
         */
        switch(id,selected = false,off = "OFF",on = "ON"){
            if(!id) throw new TypeError('UI.switch:id必须传入');
            //监听节点是否挂载，挂载后赋予事件
            Utils.observeElement(`#${id}`,10).then(node=>{
                node.onchange = function(){
                    this.parentNode.classList.toggle('is-selected');
                }
            })

            return `
                <label class="zh-checkbox ${selected?'is-selected':''}" for="${id}" style="display:block;">
                    <input type="checkbox" ${selected?'checked':''} class="zh-checkbox-input" id="${id}">
                    <div class="zh-checkbox-btn"></div>
                    <span class="zh-checkbox-text zh-checkbox-off">${off}</span>
                    <span class="zh-checkbox-text zh-checkbox-on">${on}</span>
                </label>
            `;
        },
        /**
         * 开关按钮UI
         * @params {String} id -元素id
         * @params {Array} options - 选项数据
         * @params {String} selected - 选中的值
         * @params {String} nameKey - options的name字段自定义名
         * @params {String} valueKey - options的value字段自定义名
         */
        select({id,options,selected = '',nameKey='name',valueKey='value',placeholder='请选择'}){
            if(!id) throw new TypeError('UI.select:id必须传入');
            if(!(options instanceof Array)||options?.length == 0) throw new TypeError('UI.select:options必须传入不为空的数组');
            //监听节点是否挂载，挂载后赋予事件
            Utils.observeElement(`#${id}`,10).then(node=>{
                node.onclick = function(){
                    this.parentNode.classList.toggle('is-unfold');
                }
                document.querySelector(`#${id} ~ .zh-options`).onclick = function(e){
                    let children =this.querySelectorAll('.zh-options-item');
                    let len = Array.from(children).length;
                    
                    for (let index = 0; index < len; index++) {
                        children[index].classList.remove('zh-active');
                    }

                    e.target.classList.add('zh-active');

                    node.value = e.target.dataset.name;
                    node.dataset.value = e.target.dataset.value;

                    this.parentNode.classList.remove('is-unfold');
                }
            })

            let optionSelected;

            if(selected){
                optionSelected = options.find(item=>item[valueKey] == selected);
            }
            console.log(optionSelected)
            let optionsHtml = options.map(item=>`<div class="zh-options-item ${selected == item[valueKey]?'zh-active':''}" data-value="${item[valueKey]}" data-name="${item[nameKey]}">${item[nameKey]}</div>`).join('')
            return `
                <div class="zh-select">
                    <input placeholder="${placeholder}" readonly ${optionSelected?'value="'+optionSelected[nameKey]+'" data-value="'+optionSelected[valueKey]+'"':''}  class="zh-select-text zh-input" id="${id}">
                    <div class="zh-options scroll">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        }



       
    }

    const HREF = window.location.href;

    const Utils = {
         //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
         getValue:function(name, value) {
            if (typeof GM_getValue === "function") {
                return GM_getValue(name, value);
            } else {
                return GM.getValue(name, value);
            }
        },

        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        setValue:function(name, value) {
            if (typeof GM_setValue === "function") {
                GM_setValue(name, value);
            } else {
                GM.setValue(name, value);
            }
        },
          /**
         * 添加css
         * @params {String||Array} css - css样式
         */
        appendStyle(css){
            let style = document.createElement('style');
            if(css instanceof Array){
                style.textContent = css.join('');
            }else{
                style.textContent = css
            }
            style.type = 'text/css';
            let doc = document.head || document.documentElement;
            doc.appendChild(style);
        },
         /**
         * 添加js文件
         * @params {String} url - js文件地址
         */
        appendScript:function(type,content) {
            let script = document.createElement('script');
            if(type === 'url'){
                script.src = content;
            }else{
                script.innerHTML = content;
            }
            
            var docu = document.body;
            docu.appendChild(script);
        },
        //判断设备是PC端还是移动端: false PC端 | true 移动端
        isMobile(){
            return !!window.navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|WebOS|Windows Phone|Phone)/i);
        },
         /**
         * 自动滚动页面
         * @params {Number} distance - 每次滚动的距离
         * @params {Number} originalLocation - 滚动条初始位置
         * @params {Number} targetLocation - 滚动条目标位置
         * @params {Number} delay - 每次滚动的时间差
         */
        scrollPage(distance,originalLocation,targetLocation,delay = 1000){
        
            const scrollTo = ()=>{
                window.scrollTo({
                    top: originalLocation,
                    behavior: "smooth"
                });
            }

            let time = Math.ceil(Math.abs(targetLocation - originalLocation)/distance)*delay + delay
            Utils.toast('正在自动预览页面，请勿操作','warning',time)

            //先滚动到起始位置
            scrollTo()

            let timer = null;

            return new Promise((resolve, reject) => {
                if(originalLocation<targetLocation){
                    timer = setInterval(()=>{
                        if(originalLocation<targetLocation){
                            originalLocation += distance
                            scrollTo()
                             // 相比上次位置减10，根据自己需要的速度修改
                        }else{
                            clearInterval(timer)
                            resolve(true)
                        }
                        
                    },delay)
                }else{
                    timer = setInterval(()=>{
                        if(originalLocation>targetLocation){
                            originalLocation -=distance
                            scrollTo()
                            // 相比上次位置减10，根据自己需要的速度修改
                        }else{
                            clearInterval(timer)
                            resolve(true)
                        }
                        
                    },delay)
                }
            })
            
        },
         /**
         * 延时
         * @params {Number} time - 需要延迟的时间(毫秒)
         */
        sleep(time){
            return new Promise(resolve => setTimeout(resolve, time));
        },
         /**
         * 网络请求
         * @params {String} method - 请求类型（GET,POST...）
         * @params {String} url - 请求地址
         * @params {Object} data - 请求body
         * @params {String} responseType - 返回的数据类型
         */
        request(method, url, data, headers = {} , responseType = 'text') {
            return new Promise((resolve, reject) => {
                let xmlHttpRequest = GM_xmlhttpRequest||GM.xmlHttpRequest
                xmlHttpRequest({
                    method,
                    url,
                    data,
                    headers,
                    responseType,
                    onerror: reject,
                    ontimeout: reject,
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(responseType === 'text' ? response.responseText : response.response);
                        } else {
                            reject(new Error(response.statusText));
                        }
                    }
                });
            });
        },
         /**
         * 下载图片
         * @params {String} url - 图片远程地址
         */
        loadImage (url) {
            return new Promise(async (resolve, reject) => {
                url.startsWith("//")&&(url='http:'+url);
                if (!url) {
                    reject('loadImage:请传入图片地址');
                }
                let img = await Utils.request('GET', url, null,{}, 'blob');
                console.log(img)
                let imgEl = document.createElement('img');
                imgEl.onload = () => {
                    resolve(imgEl);
                }
                imgEl.onabort = imgEl.onerror = reject;
                imgEl.src = URL.createObjectURL(img);
            })
        },
         /**
         * 信息提示
         * @params {String} msg - 信息内容
         * @params {String} type - 信息类型
         * @params {Number} delay - 自动移除消息的时间
         */
        msgBox:null,
        toast (msg,type = 'success',delay = 3000){    
            let typeMap = {
                success:{
                    bg:'#f0f9eb',
                    text:'#67c23a',
                    border:'#e1f3d8'
                },
                error:{
                    bg:'#fef0f0',
                    text:'#f56c6c',
                    border:'#fde2e2'
                },
                warning:{
                    bg:'#fdf6ec',
                    text:'#e6a23c',
                    border:'#faecd8'
                }
            }
            if(!this.msgBox){
                this.msgBox = document.createElement('div')
                this.msgBox.style = `position: fixed;
                                top: 100px;
                                left: 0;
                                right: 0;
                                margin: 0 auto;
                                width: 300px;
                                padding: 20px;
                                z-index:9999999999;
                `
                this.msgBox.classList.add('zh-container')
                document.body.appendChild(this.msgBox)
            }
            let msgItem = document.createElement('div')
            let id = 'msg' + new Date().getTime()
            msgItem.setAttribute('id',id)
            msgItem.innerHTML = `<p>${msg}</p>`
            msgItem.style = `
                text-align: center;
                width: fit-content;
                margin: 0 auto;
                padding: 10px 20px;
                font-size: 14px;
                line-height: 20px;
                border: 1px solid;
                border-radius: 5px;
                margin-bottom:10px;
            `
            msgItem.style.background = typeMap[type].bg
            msgItem.style.color = typeMap[type].text
            msgItem.style.borderColor = typeMap[type].border
            this.msgBox.appendChild(msgItem)
            setTimeout(()=>{
                document.querySelector('#'+id).remove()
            },delay)
        },
        //进度条
        progressBox:null,
        progress:{
            width:500,
            height:90,
            padding:20,
            createDialogElement(){
                if(!Utils.progressBox){
                    let css = `
                        .zh-panel{
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            z-index: 999999998;
                            background-color: #fff;
                            width: ${this.width}px;
                            height: ${this.height}px;
                            margin: auto;
                            border-radius: 10px;
                            box-shadow: 0 0 6px 3px #00000026;
                            padding:${this.padding}px;
                            box-sizing:border-box;
                        }
                        .zh-panel .zh-progress-wrapper{
                            width: 100%;
                            background: #f1f1f1;
                            height: 20px;
                            position: relative;
                            border-radius: 3px;
                            margin-bottom: 10px;
                        }
                        .zh-panel .zh-progress-wrapper #zh-progress{
                            position: absolute;
                            left: 0;
                            top: 0;
                            bottom: 0;
                            width: 0px;
                            background: #56ab8d;
                            border-radius: 3px;
                        }
                        .zh-panel .zh-progress-tips{
                            display:flex;
                            justify-content: space-between;
                            font-size: 12px;
                            line-height:20px;
                            color: #000;
                        }
                        .zh-panel .zh-progress-tips #zh-text{
                            flex: 1;
                        }
                        .zh-panel .zh-progress-tips #zh-progress-text{
                            width: 50px;
                            text-align: right;
                            color: #56ab8d;
                        }   
                    `
                    Utils.appendStyle(css);
                    Utils.progressBox = document.createElement('div')
                    Utils.progressBox.innerHTML = `
                        <div class="zh-shadow"></div>
                        <div class="zh-panel zh-container">
                            <div class="zh-progress-wrapper">
                                <div id="zh-progress"></div>
                            </div>
                            <div class="zh-progress-tips">
                                <span id="zh-text">正在下载</span>
                                <span id="zh-progress-text">0%</span>
                            </div>
                        </div>
                    `
                    document.body.appendChild(Utils.progressBox)
                }
            },
            showStatus(text = '',progress = -1){
                if(!Utils.progressBox){
                    this.createDialogElement()
                }
                text&&(document.querySelector('.zh-panel #zh-text').innerHTML = text)
                if (progress >= 0) {
                    progress = Math.min(progress, 100);
                    document.querySelector('.zh-panel #zh-progress').style.width = `${Math.floor(progress)}%`;
                    document.querySelector('.zh-panel #zh-progress-text').innerHTML = `${Math.floor(progress)}%`;
                }

            },
            hideStatus(){
                Utils.progressBox.remove()
                Utils.progressBox = null
            }
        },
        /**
         * 弹窗
         * @params {String} type - 弹窗类型 'default':默认，'tab'：tab类型
         * @params {Object} options:{
         *      {Array} size:[width,height] - 弹窗宽度,弹窗高度
         *      {Array,String} content - 弹窗主体html内容
         *      {String} confirmText - 确定按钮文本
         *      {String} cancelText - 取消按钮文本
         * }
         * @params {Function} onConfirm - 点击确定按钮的回调
         * @params {Function} onCancel - 点击取消按钮的回调
         * 
         */
        popup(type,options,onConfirm,onCancel){
            if(type != 'default' && type != 'tab') throw new TypeError("type:参数错误,必须为'tab'或'default'");
            // 标题索引名
            const DATA_ID_NAME = 'index' 
            //获取弹窗头部内容
            const getPopupHeader = function(){
                if(!options?.title) throw new TypeError('options.title:参数必填')

                let popupHeaderHtml = ''

                if(type === 'default'){
                    popupHeaderHtml = `<div class="zh-title">${options.title}</div>`
                }else{
                    if(options.title instanceof Array === false) throw new TypeError('options.title:参数错误，必须为Array类型')
                    for(let i = 0;i < options.title.length;i++){
                        popupHeaderHtml += `<div data-${DATA_ID_NAME}="${i}" class="zh-title ${i === 0?'zh-active':''}">${options.title[i]}</div>`
                    }
                }

                return popupHeaderHtml;
            }
            //获取弹窗主体内容
            const getPopupMain = function(){
                if(!options?.content) throw new TypeError('options.content:参数必填')

                let popupHeaderHtml = ''

                if(type === 'default'){
                    popupHeaderHtml = `<div class="zh-content" style="display:block;">${options.content}</div>`
                }else{
                    if(options.content instanceof Array === false) throw new TypeError('options.content:参数错误，必须为Array类型')
                    for(let i = 0;i < options.content.length;i++){
                        popupHeaderHtml += `<div data-${DATA_ID_NAME}="${i}" class="zh-content" style="${i === 0?'display:block;':''}">${options.content[i]}</div>`
                    }
                }

                return popupHeaderHtml;
            }

            let popup,popupHeaderHtml,popupMainHtml;
            //创建popup节点
            popup = document.createElement('div');
            popup.id = options.id||'zh_popup'+ (new Date).getTime();
            //窗体尺寸
            let popupSize = ''
            if(options?.size&&options.size instanceof Array && options.size.length === 2){
                popupSize = `width:${options.size[0]}px;height:${options.size[1]}px`
            }
            //获取头部内容
            popupHeaderHtml = getPopupHeader();
            //获取主体内容
            popupMainHtml = getPopupMain();
            let html = `
                <div class="zh-shadow"></div>
                <div class="zh-container zh-popup" style="${popupSize}">
                    <div class="zh-header popup_header">
                            ${popupHeaderHtml}
                            <i class="zh-header-right zh-close">
                                <svg t="1698461012573" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8594" width="128" height="128"><path d="M240.512 180.181333l271.530667 271.488 271.530666-271.488a42.666667 42.666667 0 0 1 56.32-3.541333l4.010667 3.541333a42.666667 42.666667 0 0 1 0 60.330667l-271.530667 271.530667 271.530667 271.530666a42.666667 42.666667 0 0 1-56.32 63.872l-4.010667-3.541333-271.530666-271.530667-271.530667 271.530667-4.010667 3.541333a42.666667 42.666667 0 0 1-56.32-63.872l271.488-271.530666-271.488-271.530667a42.666667 42.666667 0 0 1 60.330667-60.330667z" fill="#000000" p-id="8595"></path></svg>
                            </i>
                    </div>
                    <div class="zh-main popup_main">
                            ${popupMainHtml}
                    </div>
                    <div class="zh-footer">
                        <div class="zh-button zh-default zh-button-cancel">${options.cancelText||'取消'}</div>
                        <div class="zh-button zh-button-confirm">${options.confirmText||'确定'}</div>
                    </div>
                </div>
            `;
            let style = `
                .zh-popup{
                    position: fixed;
                    min-width: 480px;
                    min-height: 300px;
                    background: #fff;
                    z-index: 999999999;
                    border-radius: 8px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    flex-direction: column;
                    display: flex;
                }
                .zh-popup .zh-header{
                    display: flex;
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #f0f0f0;
                    font-size: 14px;
                    color: #333;
                    overflow: visible;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-weight: 700;
                }
                .zh-popup .zh-header .zh-title{
                    min-width: 80px;
                    max-width: 300px;
                    padding: 0 20px;
                    text-align: center;
                    overflow: hidden;
                    cursor: pointer;
                    color: #000;
                    border-left: 1px solid #fff;
                    border-right: 1px solid #fff;
                    box-sizing: border-box;
                }
                .zh-popup .zh-header .zh-active{
                    height: 51px;
                    border-left: 1px solid #eee;
                    border-right: 1px solid #eee;
                    background-color: #fff;
                }
                .zh-popup .zh-header .zh-title:first-child{
                    border-left: none;
                    border-top-left-radius: 8px;
                }
                .zh-popup .zh-header .zh-header-right{
                    width: 40px;
                    height: 50px;
                    margin-left: auto;
                    text-align: center;
                    line-height: 50px;
                    cursor:pointer;
                }
                .zh-popup .zh-header .zh-header-right .icon{
                    width: 14px;
                    height: 14px
                }
                .zh-popup .zh-main{
                    flex:1;
                    position:relative;
                }
                .zh-popup .zh-main .zh-content{
                    display:none;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding: 10px 30px 0 30px;
                    overflow-y: auto;
                    box-sizing: border-box;
                }
                .zh-popup .zh-footer{
                    display:flex;
                    align-items: center;
                    height: 48px;
                }
                .zh-button-cancel{
                    margin-left:auto;
                    margin-right:10px;
                }
                .zh-button-confirm{
                    margin-right:auto;
                }
            `;
            popup.innerHTML = html;
            Utils.appendStyle(style);
            document.body.appendChild(popup);

            //隐藏弹窗
            function close(){
                popup.style.display = 'none'
            }

            //监听tab菜单点击切换页面
            if(type === 'tab'){
                popup.querySelector('.popup_header').addEventListener('click',function(e){
                    if(!e.target.classList.value.includes('zh-title')) return;

                    let children =this.querySelectorAll('.zh-title');
                    let main = popup.querySelector('.popup_main');
                    let len = Array.from(children).length;
                    
                    for (let index = 0; index < len; index++) {
                        children[index].classList.remove('zh-active');
                        main?.children[index]&&(main.children[index].style.display = 'none')
                    }

                    e.target.classList.add('zh-active');
                    main.children[e.target.dataset[DATA_ID_NAME]].style.display = 'block';
                })
            }
             //点击关闭按钮
             popup.querySelector('.zh-close').onclick = ()=>{
                close()
            }
            //点击取消按钮
            popup.querySelector('.zh-button-cancel').onclick = ()=>{
                onCancel&&onCancel();
                close()
            }
            //点击确定按钮
            popup.querySelector('.zh-button-confirm').onclick = ()=>{
                onConfirm&&onConfirm(close);
            }

            return popup

            
        },
        wap_popup(content,options){
            if(!content) throw new TypeError('Utils.wap_popup=>content必须传入');
            //css
            let style = `
                .zh-wap-popup{
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    max-height: 50%;
                    background: #fff;
                    z-index: 9999999999;
                    border-top-left-radius: 15px;
                    border-top-right-radius: 15px;
                    display: flex;
                    flex-direction: column;
                }
                .zh-wap-popup .zh-popup-header {
                    display: flex;
                    height: 56px;
                    align-items: center;
                    padding: 0 10px;
                    justify-content: space-between;
                    background: #f5f5f5;
                    border-top-left-radius: 15px;
                    border-top-right-radius: 15px;
                }
                .zh-wap-popup .zh-popup-header h3{
                    font-size: 14px;
                    font-weight: 700;
                    color: #333;
                }
                .zh-wap-popup .zh-popup-header span{
                    font-size: 12px;
                    color: #444;
                }
                .zh-wap-popup .zh-popup-content{
                    flex: 1 1 auto;
                    overflow-y: auto;
                    padding: 15px;
                    overflow-x: hidden;
                }
                .zh-wap-popup .zh-popup-footer{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 56px;
                    padding: 0 20px;
                }
                .zh-wap-popup .zh-popup-footer .zh-button{
                    width: 65%;
                    height: 38px;
                    font-size: 14px;
                    border-radius: 5px;
                }
            `;

            Utils.appendStyle(style);
            
            let nowTime = (new Date).getTime();
            //html
            let footerHtml = options?.onConfirm?`
                    <div class="zh-popup-footer" id="zh_wap_confirm_${nowTime}">
                        <div class="zh-button">${options.confirmText||'确定'}</div>
                    </div>
                `:'';

            let html = `
                <div class="zh-shadow" id="zh_shadow_close_${nowTime}"></div>
                <div class="zh-wap-popup" style="${options?.height?'height:'+options?.height+';':''}">
                    <div class="zh-popup-header">
                        <h3>${options?.title||'标题'}</h3>
                        <span id="zh-subhead_${nowTime}">${options?.subhead||''}</span>
                    </div>
                    <div class="zh-popup-content">
                        ${content}
                    </div>
                    ${footerHtml}
                </div>
            `;
            
            let popup = document.createElement('div');
            popup.innerHTML = html;
            document.body.appendChild(popup);
            

            const close = ()=>{
                popup.style.display = 'none';
            }
            //点击遮罩关闭弹窗
            document.querySelector("#zh_shadow_close_"+nowTime).onclick = function(){
                close();
            }
            //副标题点击事件
            if(options?.onSubHead){
                document.querySelector("#zh-subhead_"+nowTime).onclick = function(){
                    options?.onSubHead(close);
                }
            }
            // 点击事件
            if(options?.onConfirm){
                document.querySelector("#zh_wap_confirm_"+nowTime).onclick = function(){
                    options?.onConfirm(close);
                }
            }

            return popup;
        },
        //拼接Get请求链接
        getAjaxUrl(url,params){
            if(!url.endWith('?')) url+='?'
            let query = ''
            for( var i in params ){
                query += '&' + i + '=' +  params[i];
            }
            query = query.slice(1)
            return url+query;
        },
         /**
         * /html转canvas
         * @params {Object} el - 需要转换成canvas的元素
         */
        htmlToCanvas(el){
            return new Promise((resolve, reject) => {
                html2canvas(el,{
                    useCORS: true, // 【重要】开启跨域配置
                    scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
                    allowTaint: true, // 允许跨域图片
                })
                .then(canvas => {
                    resolve(canvas)
                })
                .catch(err=>reject(err));
            })
        },
         /**
         * 弹窗拖拽功能
         * @params {Object} el - 元素节点
         * @params {String} strongName - localStrong存储名
         */
        drag(el,strongName = ''){
            if(!el||!strongName){
                console.log(el)
                return null
            }
            //获取存储的定位信息
            const item = window.localStorage.getItem(strongName)
            console.log(JSON.parse(item))
            //设置节点定位
            if(item){
                const {top,left} = JSON.parse(item)
                el.style.top = top + 'px';
                el.style.left = left + 'px';
            }


            let disX,disY,startTime,lastTime,startLeft,lastLeft,startTop,lastTop;

            let isMobile = Utils.isMobile();

            let funcMap = (function(){
                if(isMobile){
                    return {
                        up:'touchstart',
                        move:'touchmove',
                        down:'touchend'
                    }
                }else{
                    return {
                        up:'mouseup',
                        move:'mousemove',
                        down:'mousedown'
                    }
                }
            }())

            const moveHanlder = (event)=>{
                event.preventDefault()
                console.log('move')
                isMobile&&(event = event.changedTouches[0]);

                let left = event.pageX - disX ;
                let top = event.pageY - disY;

                if(left < 0){
                    left = 0
                }else{
                    left = Math.min(left,document.documentElement.clientWidth - el.offsetWidth)
                }
                if(top < 0){
                    top = 0
                }else{
                    top = Math.min(top,document.documentElement.clientHeight - el.offsetHeight)
                }

                el.style.left =  left + 'px';
                el.style.top = top + 'px';
                //存储位置信息
                window.localStorage.setItem(strongName,JSON.stringify({left,top}))
            }

            const upHanlder = (event)=>{

                isMobile&&(event = event.changedTouches[0]);

                lastTime = (new Date).getTime()
                lastTop = event.pageY;
                lastLeft = event.pageX;
                window.removeEventListener(funcMap.move,moveHanlder);
                window.removeEventListener(funcMap.up,upHanlder);
            }
            el.addEventListener(funcMap.down,function(event){

                isMobile&&(event = event.changedTouches[0]);

                //鼠标距节点左边缘的距离
                disX = event.pageX - el.offsetLeft;
                //鼠标距节点顶部的距离
                disY = event.pageY -el.offsetTop;
                //按下的时间
                startTime = (new Date).getTime()
                startTop = event.pageY;
                startLeft = event.pageX;

                console.log(disX,disY,startTime,startTop,startLeft)
                window.addEventListener(funcMap.move,moveHanlder);
                window.addEventListener(funcMap.up,upHanlder);

                //阻止点击捕获事件
                document.addEventListener('click',(event)=>{
                    if((Math.abs(lastTop - startTop) > 5)||(Math.abs(lastLeft - startLeft) > 5)||(lastTime - startTime > 500)) event.stopPropagation()
                },true)
            })

            
            console.log(funcMap)
            // el[funcMap.down] = function(event){
            //     isMobile&&(event = event.changedTouches[0]);
                
            //     console.log(event);
            //     //鼠标距节点左边缘的距离
            //     disX = event.pageX - el.offsetLeft;
            //     //鼠标距节点顶部的距离
            //     disY = event.pageY -el.offsetTop;
            //     //按下的时间
            //     startTime = (new Date).getTime()
            //     startTop = event.pageY;
            //     startLeft = event.pageX;

            //     document[funcMap.move] = function(event){

            //         isMobile&&(event = event.changedTouches[0]);

            //         console.log(event)

            //         let left = event.pageX - disX ;
            //         let top = event.pageY - disY;

            //         if(left < 0){
            //             left = 0
            //         }else{
            //             left = Math.min(left,document.documentElement.clientWidth - el.offsetWidth)
            //         }
            //         if(top < 0){
            //             top = 0
            //         }else{
            //             top = Math.min(top,document.documentElement.clientHeight - el.offsetHeight)
            //         }

            //         el.style.left =  left + 'px';
            //         el.style.top = top + 'px';
            //         //存储位置信息
            //         window.localStorage.setItem(strongName,JSON.stringify({left,top}))
            //     }

            //     document[funcMap.up] = function(event){

            //         isMobile&&(event = event.changedTouches[0]);

            //         lastTime = (new Date).getTime()
            //         lastTop = event.pageY;
            //         lastLeft = event.pageX;
            //         document[funcMap.move] = null;
            //         document[funcMap.up] = null;
            //     }

            //     //阻止点击捕获事件
            //     document.addEventListener('click',(event)=>{
            //         if((Math.abs(lastTop - startTop) > 5)||(Math.abs(lastLeft - startLeft) > 5)||(lastTime - startTime > 500)) event.stopPropagation()
            //     },true)
            // }
        },
        /**
         * 保存blob数据至本地的方法
         * @params {Blob} content - 需要保存的blob数据
         * @params {String} file_name - 保存文件的命名
         * @params {String} type - 保存文件的格式
         */
        save(content,file_name, type="") {
            if (!type && content instanceof Blob) {
                type = content.type;
            }

            let blob = null;
            if (content instanceof Array) {
                blob = new Blob(content, { type });
            } else {
                blob = new Blob([content], { type });
            }

            const url = URL.createObjectURL(blob);
            const el = document.createElement("a");
            el.download = file_name || "未命名文件";
            el.href = url;
            el.click();
            URL.revokeObjectURL(url);
        },
        /**
         * 监听节点是否存在，存在便返回
         * @params {String} el - 节点id或class
         * @params {Number} delay - 监测时间(秒)；
         */
        observeElement(el,delay = 5){
            let startTime = (new Date).getTime();
            let query = null;
            let timer = null;
            return new Promise((resolve, reject) => {
                timer = setInterval(()=>{

                    query = document.querySelector(el);
    
                    if(query){
                        clearInterval(timer)
                        resolve(query)
                    }
                    if(((new Date).getTime() - startTime > delay*1000)){
                        clearInterval(timer)
                        reject(query)
                    }
    
                },100)
            })
            
        }

    }   
    //---------------------------公共方法结束---------------------------

    //---------------------------文档下载类开始-------------------------
    class DocDownload{
        // 下载弹窗id
        elementId = 'zhihuDocDownload';
        //是否已经创建下载弹窗
        isMount = false;
        //开始页码
        pageStart = {
            value:'',
            initVlaue:''
        };
        //结束页码
        pageEnd = {
            value:'',
            initVlaue:''
        };
        //预览速度
        preSpeed = {
            value:300,
            initVlaue:300
        };
        //是否有预览失败的
        hasPreviewFail = false;
        //是否正在预览
        isPreviewing = false;
        //是否开启自动预览
        autoPreview = true;
        //是否开启分批下载
        splitDownload = true;
        //当前平台 道客：daoke 豆丁：docin
        platform = '';
        //css样式
        style = `
            .zh-dialog{
                box-shadow: 0 0 6px 3px #00000038;
                z-index: 99999997;
                top: 100px;
                position: fixed;
                right: 50px;
                background: #fff;
                padding:20px;
                border-radius: 8px;
                width:120px;
                box-sizing: content-box;
            }
            .zh-dialog-item{
                display:flex;
                flex-direction:column
            }
            .zh-dialog-item .title{
                font-size:14px;
                font-weight:500;
                color:#333;
                margin-bottom:5px
            }
            .zh-dialog-item .content{
                display:flex;
                align-items:center;
                margin-bottom: 10px;
            }
            .zh-dialog-item .content .cut{
                margin: 0 5px
            }
            .zh-dialog-item .content .text{
                font-size:12px;
                color:#666;
                margin-left:5px
            }
            .zh-button{
                height:38px;
            }
            .zh-default{
                margin-bottom:10px;
            }
        `;
        constructor(options){
            if(options.preSpeed){
                this.preSpeed.value = options.preSpeed
                this.preSpeed.initVlaue = options.preSpeed
            }

            if(!options.platform) throw new TypeError('请传入platform')
            this.platform = options.platform
           
            if(options.autoPreview !== undefined){
                this.autoPreview = options.autoPreview;
            }
            if(options.splitDownload !== undefined){
                this.splitDownload = options.splitDownload;
            }

            this.createDialogElement()
        }

        //创建下载弹窗元素
        createDialogElement(){
            if(this.isMount) return;
            //插入CSS
            Utils.appendStyle(this.style);

            //创建div元素
            let autoPreviewHtml = this.autoPreview ?`
                <div class="zh-dialog-item">
                    <label class="title user-select">预览速度</label>
                    <div class="content">
                        <input class="zh-input" id="preSpeed" value="${this.preSpeed.value}"></input>
                        <span class="text user-select">像素</span>
                    </div>
                </div>
                <div class="zh-button zh-default user-select" id="zh-preview">自动预览</div>
            `:''
            let splitDownloadHtml = this.splitDownload?`
                <div class="zh-dialog-item">
                    <label class="title user-select">分批下载</label>
                    <div class="content">
                        <input class="zh-input" placeholder="页码" type="number" id="pageStart"></input>
                        <span class="cut">-</span>
                        <input class="zh-input" placeholder="页码" type="number" id="pageEnd"></input>
                    </div>
                </div>
            `:''

            let div = document.createElement('div')
            let html = `
                <div id="zh-wk" class="zh-dialog zh-container">
                    ${splitDownloadHtml}
                    ${autoPreviewHtml}
                    <div class="zh-button user-select" id="zh-download">下载文档</div>
                </div>
            `
            div.innerHTML = html
            div.setAttribute('id',this.elementId)
            // 挂载到body
            document.body.appendChild(div)
            if(this.autoPreview){
                document.querySelector('#zh-preview').addEventListener('click',()=>{
                    if(!this.isPreviewing){
                        this.isPreviewing = true
                        this.preview().finally(()=>{
                            this.isPreviewing = false
                        })
                    }
                })
                this.observerInputChange('preSpeed');
            }

            if(this.splitDownload){
                this.observerInputChange('pageStart');
                this.observerInputChange('pageEnd');
            }
            
            //拖拽移动
            let el = document.querySelector('#zh-wk')
            Utils.drag(el,'zh-wk')
            
        }
        // 监听点击下载
        start(callback){
            let isClick = false
            document.querySelector('#zh-download').addEventListener('click',(e)=>{
                //如果未点击或预览失败可以点击
                if(!isClick&&!this.isPreviewing){
                    //点击之后锁死，不让再次点击
                    isClick = true
                    callback(()=>{
                        //重置开关状态
                        isClick = false;
                        this.hasPreviewFail = false;
                    })
                }
            })
        }
        //监听输入框变化，变化后给变量赋值
        observerInputChange(id) {
            document.querySelector('#'+id).addEventListener('change',(e)=>{
                let val = Math.abs(parseInt(e.target.value)) 
                e.target.value = val||this[id].initVlaue
                this[id].value = val||this[id].initVlaue
            })
        }
        //检测页码是否输入有误
        checkPage(len){
            
            if(!this.pageStart.value||!this.pageEnd.value) {
                return true
            }

            if(this.pageStart.value>this.pageEnd.value) {
                throw new TypeError('输入错误,起始页码大于结束页码')
            }
            if(this.pageStart.value > len){
                throw new TypeError('输入错误,起始页码大于页码数')
            }
            if(this.pageEnd.value > len){
                throw new TypeError('输入错误,结束页码大于页码数')
            }

            return true
            
        }
        //检测页面是否预览完成
        checkPageHasNoPreview(){
            var map ={
                daoke:{
                    el:'.page_pb',
                    verifyFn:(i)=>elements[i - 1].childNodes.length !== 0
                },
                docin:{
                    el:'.model',
                    verifyFn:(i)=>document.querySelector('#img_'+i)?.childNodes.length === 0
                    
                },
                max_book:{
                    el:'.webpreview-item',
                    verifyFn:(i)=>elements[i - 1].querySelector('img').getAttribute('src') === null
                },
                sodoc:{
                    el:'.wenku-detail__showdoc__imgContainer',
                    verifyFn:(i)=>elements[i - 1].childNodes.length === 0
                }
            }
            var elements = document.querySelectorAll(map[this.platform].el);
            let noPreview = [];

            // 下载页码
            let pageStart = (this.pageStart.value&&this.pageEnd.value)?this.pageStart.value:1
            let pageEnd = (this.pageStart.value&&this.pageEnd.value)?this.pageEnd.value:elements.length

            for ( let i=pageStart; i <= pageEnd;i++){
                let isEmpty = map[this.platform].verifyFn(i)
                console.log(isEmpty)
                isEmpty&&noPreview.push(i)
            }
            if(noPreview.length > 0){
                let errorMsg = noPreview.map(item=>`第${item}页`).join(',')
                Utils.toast(`${errorMsg} 预览失败，请手动预览上述页码`,'error',5000);
                return true
            }

            return false
            
        } 
        //滚动页面预览
        async preview(targetLocation){

            switch (this.platform){
                case 'daoke':
                    //展开全文
                    let continueButton = document.querySelector("#continueButton")
                    continueButton&&window.buyContinueRead();
                break;
                case 'max_book':
                    let WebPreview = window?.WebPreview||''
                    if(!WebPreview) return Utils.toast('该页面不支持自动预览','error')
                    let preview_page = WebPreview?.Data?.preview_page
                    WebPreview.Preview.jump(preview_page)
                break;
            }
            // //展开全文docin
            // let continueButton = document.querySelector(".model-fold-show")
            // continueButton&&window.docinReader.halfPageHanlde&&window.docinReader.halfPageHanlde();

            let target = targetLocation||document.body.scrollHeight;
            await Utils.scrollPage(this.preSpeed.value,0,target,600)
            return Promise.resolve(true)
        }
        // 导出PDF
        async exportPdf(pageCanvas,title){

            async function max_book_ppt(i){
                //跳转至该页面
                window.gosld(i)
                //清除父容器缩放
                document.querySelector('#view')?.setAttribute("style", "")
                Utils.progress.showStatus(`正在获取第${i + 1}页网页数据`);
                await Utils.sleep(100);
                let node = document.querySelector('#view'+i)
                return Utils.htmlToCanvas(node)
            }

            try {
                // 下载页码
                let pageStart = (this.pageStart.value&&this.pageEnd.value)?this.pageStart.value - 1:0
                let pageEnd = (this.pageStart.value&&this.pageEnd.value)?this.pageEnd.value:pageCanvas.length
                //创建PDF
                let doc = null

                for(let i = pageStart;i < pageEnd; i++){
                    
                    let page = i + 1;
                    let el = pageCanvas[i]
                    Utils.progress.showStatus(`正在创建第${page}页`,(page/pageCanvas.length) * 100);

                    if(this.platform === 'max_book_ppt') el = await max_book_ppt(i)

                    //获取页面尺寸
                    let pageSize = [parseInt(pageCanvas[i].clientWidth),parseInt(pageCanvas[i].clientHeight)];
                    //如果没有创建PDF，先创建，已创建直接增加页面
                    if (!doc) {
                        doc = new Pdf(pageSize);
                    } else {
                        doc.addPage(pageSize);
                    }

                    Utils.progress.showStatus(`正在合成第${page}页`);
        
                    let imageData
                    //图片节点先加载图片至本地
                    console.log(el,el.tagName)
                    if(el.tagName === 'IMG'){
                        imageData = await Utils.loadImage(el.getAttribute("src"))
                        console.log(imageData.offsetWidth)
                    }else if(el.tagName === 'CANVAS'){
                        imageData =el.toDataURL('image/jpeg', 1.0);
                    }else{
                        throw new TypeError('imageData：此节点数据不能转换成图片')
                    }
                    //将图片数据写入PDF
                    doc.addImage({
                        imageData,
                        width:pageSize[0],
                        height:pageSize[1]
                    });

                    Utils.progress.showStatus(`第${page}页创建成功`);

                    await Utils.sleep(100)
                }
                doc.save(title);
            } catch (error) {
                return Promise.reject(error)
            }finally{
                Utils.progress.hideStatus()
            }
            
        }
    }
    //---------------------------文档下载类结束-------------------------

    //---------------------------jsPdf类开始---------------------------
    class Pdf{
        doc = null;
        
        constructor(pageSize){
            this.doc = new jspdf.jsPDF({
                orientation: pageSize[0] < pageSize[1] ? 'p' : 'l',
                unit: 'pt',
                format: pageSize,
                compress: true
            });
        }
        // 增加页面
        addPage(pageSize){
            this.doc.addPage({
                orientation: pageSize[0] < pageSize[1] ? 'p' : 'l',
                format: pageSize,
            })
        }
        //添加图片到页面
        addImage({imageData,width,height,x = 0,y = 0,type="JPEG"}){
            this.doc.addImage(imageData, type, x, y, width, height);
        }
        //保存pdf
        save(title){
            this.doc.save(`${title}.pdf`);
        }
    }
    //---------------------------jsPdf类结束---------------------------

    //---------------------------文库初始化开始-------------------------
    const wenkuInit = {
            //道客巴巴初始化
            daoke(){
                //创建节点
                const docDown = new DocDownload({
                    preSpeed:400,
                    platform:'daoke'
                })
            
                docDown.start(async (reClick)=>{
                    try {
                        //输入了页码才检测页码是否正常
                        let len = document.querySelectorAll('.outer_page').length||0
                        docDown.checkPage(len)
                        //检测是否有页面未预览成功
                        docDown.hasPreviewFail = docDown.checkPageHasNoPreview()

                        if(!docDown.hasPreviewFail){
                            //标题
                            let title = window?.words||"道客巴巴文档";
                            //页面的canvas
                            let pageCanvas = document.getElementsByClassName("inner_page");
                            //下载文档
                            await docDown.exportPdf(pageCanvas,title)
                        }    
                    } catch (error) {
                        Utils.toast(error.message,'error')
                    } finally{
                        reClick()
                    }
                        
                })
            
            },
            //豆丁初始化
            docin(){
                //创建节点
                const docDown = new DocDownload({
                    preSpeed:400,
                    platform:'docin'
                })

                docDown.start(async (reClick)=>{
                    try { 
                        //输入了页码才检测页码是否正常
                        let len = document.querySelectorAll('.model').length||0
                        docDown.checkPage(len)
                        //检测是否有页面未预览成功
                        docDown.hasPreviewFail = docDown.checkPageHasNoPreview()
            
                        if(!docDown.hasPreviewFail){
                            //标题
                            let title = window?.docinShareConfig?.title||"豆丁文档";
                            //页面的canvas
                            let container = document.querySelector('#contentcontainer')
                            let pageCanvas = container?.getElementsByTagName("canvas").length>0?container.getElementsByTagName("canvas"):container.getElementsByTagName("img");
                            //下载文档
                            await docDown.exportPdf(pageCanvas,title)
                        }    
                    } catch (error) {
                        console.log(error)
                        Utils.toast(error.message,'error')
                    } finally{
                        reClick()
                    }
                        
                })
                
            },
            //原创力初始化
            max_book(){
                //创建节点
                const docDown = new DocDownload({
                    preSpeed:400,
                    platform:'max_book'
                })
                //获取PPT预览链接
                const getOfficeSrc = function(detail){
                    let previewUrl = detail.preview.pic.view_token
                    window.open(previewUrl)
                }

                docDown.start(async (reClick)=>{
                    try { 
                       let detail = window?.base?.detail||''
                       if(!detail) throw new TypeError('下载错误，文档参数获取失败')
                       if(detail.format === "pptx"||detail.format === "ppt") {
                            getOfficeSrc(detail)
                       }else{
                            //输入了页码才检测页码是否正常
                            let len = document.querySelectorAll('.webpreview-item').length||0
                            docDown.checkPage(len)
                            //检测是否有页面未预览成功
                            docDown.hasPreviewFail = docDown.checkPageHasNoPreview()
                
                            if(!docDown.hasPreviewFail){
                                //标题
                                let title = window?.base?.detail?.search_q||"原创力文档";
                                //页面的canvas
                                let pageCanvas = document.querySelectorAll('.webpreview-item img');
                                //下载文档
                                await docDown.exportPdf(pageCanvas,title)
                            }    
                       } 
                    } catch (error) {
                        console.log(error)
                        Utils.toast(error.message,'error')
                    } finally{
                        reClick()
                    }
                        
                })
                
            },
            max_book_ppt(){
                 //创建节点
                 const docDown = new DocDownload({
                    preSpeed:400,
                    platform:'max_book_ppt',
                    autoPreview:false
                })

                const preview = function(pageCount){
                    return new Promise(async (resolve, reject) => {
                        let timer = null
                        timer = setInterval(()=>{
                            window.nextPage()
                            Utils.toast('正在自动预览页面，请勿操作','warning',370)
                            if(document.querySelector('#PageIndex').textContent == pageCount){
                                clearInterval(timer)
                                resolve(true)
                            }
                        },400)
                    })
                }

                docDown.start(async (reClick)=>{
                    try { 
                        //输入了页码才检测页码是否正常
                        let len = document.querySelectorAll('#PageInfo div').length||0
                        docDown.checkPage(len)

                        let pageCount = window?.pageCount
                        if(!pageCount) throw new TypeError('下载错误，文档参数获取失败')
                        //预览页面
                        await preview(pageCount)
                        //获取节点
                        let pageCanvas = document.querySelectorAll('#view>div')
                        if(pageCanvas.length > 0){
                            //标题
                            let title = "原创力PPT文档";
                            //下载文档
                            await docDown.exportPdf(pageCanvas,title)
                        }  
                        console.log('预览完成')
                    } catch (error) {
                        console.log(error)
                        Utils.toast(error.message,'error')
                    } finally{
                        reClick()
                    }
                        
                
                })
            },
            //智库
            mbalib(){     
                //创建节点
                const docDown = new DocDownload({
                    preSpeed:400,
                    platform:'mbalib',
                    autoPreview:false,
                    splitDownload:false
                })
                docDown.start(async reClick =>{
                    try { 
                        let DEFAULT_URL = window?.DEFAULT_URL||null
                        if(!DEFAULT_URL) throw new TypeError('DEFAULT_URL：文档下载失败')
                        Utils.toast('正在获取pdf文件数据')
                        let content = await Utils.request('GET', DEFAULT_URL, null,null,'blob');
                        let file_name = window?.wgDocTitle||'智库文档'
                        Utils.toast('成功获取到pdf文件数据，正在下载')
                        Utils.save(content,file_name)
                    } catch (error) {
                        console.log(error)
                        Utils.toast(error.message,'error')
                    } finally{
                        reClick()
                    }
                })
            },
            //百度
            bdwk(){
                 //创建节点
                 const docDown = new DocDownload({
                    preSpeed:400,
                    platform:'bdwk',
                    autoPreview:false,
                    splitDownload:false
                })
                docDown.start(reClick=>{
                    window.open('http://www.wezhicms.com/index/Tools/index?url='+window.location.href);
                    reClick()
                })
            },
            //360
            sodoc(){
                //创建节点
                const docDown = new DocDownload({
                    preSpeed:400,
                    platform:'sodoc'
                })
                docDown.start(async (reClick)=>{
                    try { 
                        let asyncData = window?.asyncData||null;
                        if(!asyncData) throw new TypeError('asyncData：文档下载失败');

                        //输入了页码才检测页码是否正常
                        let len = asyncData?.DocInfo?.Field03.length||0;
                        docDown.checkPage(len);

                        //检测是否有页面未预览成功
                        docDown.hasPreviewFail = docDown.checkPageHasNoPreview()
                
                        if(!docDown.hasPreviewFail){
                            //标题
                            let title = asyncData?.DocInfo.Title||'360文档';
                            //页面的canvas
                            let pageCanvas = document.querySelectorAll('.wenku-detail__showdoc__imgContainer>img');
                            //下载文档
                            await docDown.exportPdf(pageCanvas,title)
                        }    
                    } catch (error) {
                        console.log(error)
                        Utils.toast(error.message,'error')
                    } finally{
                        reClick()
                    }
                })
            }
    }
    //---------------------------文库初始化结束-------------------------

    //---------------------------全网VIP视频开始-------------------------
    class Video{
        //是否已经创建按钮
        isCreateButton = false;
        //手机端解析弹窗
        parseVideoPopup = null
        //设置弹窗
        settingPopup = null;
        //添加解析弹窗
        addVideoApiPopup = null;
        //当前选中的内嵌接口
        currentVideoApi = '';
        //网址变化监听定时器
        observeLocationHrefTimer = null;
        //解析接口
        static videoApiList = [
            {"name":"M3U8.TV","category":1,"url":"https://jx.m3u8.tv/jiexi/?url=", "showType":3},
            {"name":"纯净/B站","category":1,"url":"https://z1.m1907.top/?eps=0&jx=", "showType":3},
            {"name":"高速接口","category":1,"url":"https://jx.jsonplayer.com/player/?url=", "showType":3},
            {"name":"综合/B站","category":1,"url":"https://jx.bozrc.com:4433/player/?url=", "showType":3},
            {"name":"OK解析","category":1,"url":"https://okjx.cc/?url=", "showType":3},
            {"name":"OKJX","category":1,"url":"https://api.okjx.cc:3389/jx.php?url=", "showType":3},
            {"name":"夜幕","category":1,"url":"https://www.yemu.xyz/?url=", "showType":3},
            {"name":"NNXV","category":1,"url":"https://jx.nnxv.cn/tv.php?url=", "showType":3},
            {"name":"听乐","category":1,"url":"https://jx.dj6u.com/?url=", "showType":3},
            {"name":"RDHK","category":1,"url":"https://jx.rdhk.net/?v=", "showType":3},
            {"name":"铭人云","category":1,"url":"https://parse.123mingren.com/?url=", "showType":3},
            {"name":"爱豆","category":1,"url":"https://jx.aidouer.net/?url=", "showType":1},
            {"name":"七哥","category":1,"url":"https://jx.mmkv.cn/tv.php?url=", "showType":3},
            {"name":"CK","category":1,"url":"https://www.ckplayer.vip/jiexi/?url=", "showType":1},
            {"name":"ckmov","category":1,"url":"https://www.ckmov.vip/api.php?url=", "showType":1},
            {"name":"playerjy/B站","category":1,"url":"https://jx.playerjy.com/?ads=0&url=", "showType":3},
            {"name":"1717解析","category":1,"url":"https://ckmov.ccyjjd.com/ckmov/?url=", "showType":1},
            {"name":"H8","category":1,"url":"https://www.h8jx.com/jiexi.php?url=", "showType":1},
            {"name":"猪蹄","category":1,"url":"https://jx.iztyy.com/Bei/?url=", "showType":1},
            {"name":"解析la","category":1,"url":"https://api.jiexi.la/?url=", "showType":1},
            // {"name":"老板","category":1,"url":"https://vip.laobandq.com/jiexi.php?url=", "showType":1},
            // {"name":"盘古","category":1,"url":"https://www.pangujiexi.cc/jiexi.php?url=", "showType":1},
            // {"name":"盖世","category":1,"url":"https://www.gai4.com/?url=", "showType":1},
            // {"name":"0523","category":1,"url":"https://go.yh0523.cn/y.cy?url=", "showType":1},
            {"name":"17云","category":1,"url":"https://www.1717yun.com/jx/ty.php?url=", "showType":1},
            {"name":"云析","category":1,"url":"https://jx.yparse.com/index.php?url=", "showType":1},
            {"name":"8090","category":1,"url":"https://www.8090g.cn/?url=", "showType":1},
            {"name":"PM","category":1,"url":"https://www.playm3u8.cn/jiexi.php?url=", "showType":1},
            // {"name":"无名","category":1,"url":"https://www.administratorw.com/video.php?url=", "showType":1},
    
            {"name":"综合线路","category":2,"url":"https://zhihuweb.com/player.html?url=", "showType":1},
            {"name":"纯净/B站","category":2,"url":"https://z1.m1907.cn/?jx=", "showType":1},
            {"name":"高速接口","category":2,"url":"https://jsap.attakids.com/?url=", "showType":1},
            {"name":"综合/B站1","category":2,"url":"https://jx.bozrc.com:4433/player/?url=", "showType":1},
            {"name":"OK解析","category":2,"url":"https://okjx.cc/?url=", "showType":1},
            {"name":"夜幕","category":2,"url":"https://www.yemu.xyz/?url=", "showType":1},
            {"name":"虾米","category":2,"url":"https://jx.xmflv.com/?url=", "showType":1},
            {"name":"M3U8.TV","category":2,"url":"https://jx.m3u8.tv/jiexi/?url=", "showType":1},
        ];
        //平台节点信息
        static platformNodeInfo = {
            iqiyi_pc : { url:"www.iqiyi.com", node:["#flashbox"],playwork:true},
            qq_pc : { url:"v.qq.com", node:["#mod_player","#player-container"],adnode:["#mask_layer",".mod_vip_popup",".panel-tip-pay"],playwork:true},
            youku_pc:{ url:"v.youku.com", node:["#player"],playwork:true},
            mgtv_pc:{ url:"www.mgtv.com", node:["#mgtv-player-wrap","#player"],playwork:true},
            sohu_pc:{ url:"tv.sohu.com", node:["#player"],playwork:true},
            film_sohu_pc:{ url:"film.sohu.com", node:["#playerWrap"],playwork:true},
            le_pc:{ url:"www.le.com", node:["#le_playbox"],playwork:true},
            pptv_pc:{ url:"v.pptv.com", node:["#pptv_playpage_box"],playwork:""},
            wasu_pc:{ url:"www.wasu.cn", node:["#flashContent","#player"],playwork:""},
            vip_pc:{ url:"vip.1905.com", node:["#playBox"],playwork:""},
            bili_pc:{ url:"www.bilibili.com", node:["#player_module","#bilibili-player"],playwork:true},
            wap_iqiyi:{ url: "m.iqiyi.com", node: [".m-video-player-wrap"], playwork: true },
            wap_qq:{ url:"m.v.qq.com", node:[".player"],adnode:["#vipPosterContent",".at-app-banner"],playwork:true},
            wap_youku:{ url:"m.youku.com", node:["#player"],adnode:[".callEnd_box"],playwork:""},
            wap_mgtv:{ url:"m.mgtv.com", node:[".video-area"],adnode:[".mg-down-btn",".ad-fixed-bar"],playwork:true},
            wap_bilibili:{ url:"m.bilibili.com", node:["#bofqi"],playwork:true},
            wap_le:{ url:"m.le.com", node:["#j-player"],adnode:["#j-vipLook",".daoliu1","#j-player"],playwork:true},
            wap_sohu:{ url:"m.tv.sohu.com", node:[".player"],adnode:[".player_film_cover"],playwork:true},
            wap_pptv:{ url:"m.pptv.com", node:[".pp-details-video"],playwork:""},
            wap_vip:{ url:"vip.1905.com", node:["#player_section"],playwork:""},
    }
        //所有解析接口
        get allvideoApiList(){
            if(this.customVideoApiList.length === 0) return Video.videoApiList;
            return this.customVideoApiList.concat(Video.videoApiList)
        }
        //内嵌解析接口html
        get inPlayApiListHtml(){
            console.log(this.allvideoApiList)
            return this.currentPlatformInVideoApiList.map(item=>{
                return `<span data-url="${item.url}" class="zh-api-item ${item.url==this.currentVideoApi?'zh-active':''}">${item.name}</span>`
            }).join('')
        }
        //跳转播放解析接口html
        get outPlayApiListHtml(){
            return this.currentPlatformOutVideoApiList.map(item=>{
                return `<span data-url="${item.url}" class="zh-api-item">${item.name}</span>`
            }).join('')
        }
        //设置页面html
        get settingHtml(){
            let params = {
                id:PCVideo.SET_FORM_ITEM_ID.autoPlayApi,
                options:this.currentPlatformInVideoApiList,
                valueKey:'url',
                placeholder:'请选择解析接口',
                selected:this.autoPlayApi
            }

            return `
                <div class="zh-form-item">
                    <label class="zh-form-label">
                        解析接口
                    </label>
                    <div class="zh-form-inline" style="width:180px">
                        ${UI.select(params)}
                    </div>
                </div>
                <div class="zh-form-item">
                    <label class="zh-form-label">
                        延迟时间
                    </label>
                    <div class="zh-form-inline">
                        <input type="number" value="${this.playDelay}" id="${PCVideo.SET_FORM_ITEM_ID.autoPlayDelay}" style="width:80px" class="zh-input"/><span style="margin-left:5px">秒</span>
                    </div>
                </div>
                <div class="zh-form-item">
                    <label class="zh-form-label">
                        自动解析
                    </label>
                    <div class="zh-form-inline">
                        ${UI.switch(PCVideo.SET_FORM_ITEM_ID.isAutoplay,this.isAutoPlay)}
                    </div>
                </div>
            `;
        }
        constructor(platform){
            //自定义解析接口
            Object.defineProperty(this,'customVideoApiList',{
                set(value){
                    //保存接口到内存
                    Utils.setValue("customParseApiData", value);
                    //更新接口列表
                    this.updateInPlayApiListHtml();
                    this.updateOutPlayApiListHtml();
                    this.updateSettingHtml()
                    //更新添加解析页面的接口列表
                    this.updateAddPlayApiListHtml();
                },
                get(){
                    //从内存获取到自定义接口
                    return Utils.getValue("customParseApiData")||[];
                }
            });
            //播放延时
            Object.defineProperty(this,'playDelay',{
                set(value){
                    console.log(value)
                    window.localStorage.setItem("playDelay", JSON.stringify(value));
                },
                get(){
                    return JSON.parse(window.localStorage.getItem("playDelay"))||3;
                }
            });
             //自动解析接口
             Object.defineProperty(this,'autoPlayApi',{
                set(value){
                    window.localStorage.setItem("autoPlayApi", value);
                },
                get(){
                    return window.localStorage.getItem("autoPlayApi")||'';
                }
            });
             //是否开启自动播放
             Object.defineProperty(this,'isAutoPlay',{
                set(value){
                    window.localStorage.setItem("isAutoPlay", JSON.stringify(value));
                },
                get(){
                    return  JSON.parse(window.localStorage.getItem("isAutoPlay"))||false;
                }
            });
            //平台标识
            this.platform = platform;
            //创建按钮
            this.createControlButton();
            //自动播放
            if(this.isAutoPlay){
                this.autoPlay()
            }
        }
        //创建按钮
        createControlButton(){
            console.log(this)
            if(!this.isCreateButton){
                let html = `
                        <div class="btn_item" id="onSetting">
                                <svg t="1651763850342" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" p-id="2320" width="200" height="200">
                                        <path d="M661.333333 665.6l51.2 12.8 42.666667-72.533333-34.133333-38.4c4.266667-21.333333 4.266667-38.4 4.266666-55.466667s0-34.133333-4.266666-51.2l34.133333-38.4-42.666667-72.533333-51.2 12.8c-25.6-21.333333-55.466667-42.666667-89.6-51.2L554.666667 256h-85.333334l-17.066666 51.2c-34.133333 8.533333-64 25.6-89.6 51.2l-51.2-12.8-42.666667 72.533333 34.133333 38.4c-4.266667 21.333333-4.266667 38.4-4.266666 55.466667s0 34.133333 4.266666 51.2l-34.133333 38.4 42.666667 72.533333 51.2-12.8c25.6 21.333333 55.466667 42.666667 89.6 51.2L469.333333 768h85.333334l17.066666-51.2c34.133333-8.533333 64-25.6 89.6-51.2z m38.4 81.066667c-21.333333 17.066667-51.2 34.133333-76.8 42.666666L597.333333 853.333333h-170.666666l-25.6-64c-29.866667-12.8-55.466667-25.6-76.8-42.666666l-68.266667 12.8-85.333333-149.333334 42.666666-51.2V512c0-17.066667 0-29.866667 4.266667-42.666667l-42.666667-51.2 85.333334-149.333333 68.266666 12.8c21.333333-17.066667 51.2-34.133333 76.8-42.666667L426.666667 170.666667h170.666666l25.6 64c29.866667 12.8 55.466667 25.6 76.8 42.666666l68.266667-12.8 85.333333 149.333334-42.666666 51.2c4.266667 12.8 4.266667 29.866667 4.266666 42.666666s0 29.866667-4.266666 42.666667l42.666666 51.2-85.333333 149.333333-68.266667-4.266666zM512 554.666667c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667-42.666667 17.066667-42.666667 42.666667 17.066667 42.666667 42.666667 42.666667z m0 85.333333c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z"
                                                fill="#ffffff" p-id="2321"></path>
                                </svg>
                                <span class="user-select">解析设置</span>
                        </div>
                        <div class="btn_item" id="onAddVideoApi">
                                <svg t="1656638904518" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" p-id="7918" width="200" height="200">
                                        <path d="M469.333333 469.333333V341.333333h85.333334v128h128v85.333334h-128v128h-85.333334v-128H341.333333v-85.333334h128z m42.666667 384c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z"
                                                fill="#ffffff" p-id="7919"></path>
                                </svg>
                                <span class="user-select">添加接口</span>
                        </div>
                        <div class="btn_item" id="onPlay">
                                <svg t="1651762741797" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" p-id="1235" width="200" height="200">
                                        <path d="M512 853.333333c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z m128-256l-213.333333 128V384l213.333333 128z"
                                                fill="#ffffff" p-id="1236"></path>
                                </svg>
                                <span class="user-select">解析播放</span>
                        </div>
                `
                let style = `
                    .vip_btn {
                        position: fixed;
                        top: 40%;
                        left: 10px;
                        z-index: 999999997;
                        padding: 0 16px;
                        border-radius: 12px;
                        background: rgb(134 134 134/60%);
                        box-shadow: 1px 1px 8px 1px rgb(98 99 99/34%);
                    }
                    .vip_btn .btn_item {
                        position: relative;
                        display: block;
                        box-sizing: border-box;
                        width: 26px;
                        height: 56px;
                        color: #b5b9bc;
                        text-align: center;
                        font-size: 22px;
                        line-height: 20px;
                        border-bottom: 1px solid #f3f5f7;
                        cursor: pointer;
                    }
                    .vip_btn .btn_item span {
                        display: none;
                        padding: 14px 0;
                        color: #fff;
                        font-size: 12px;
                        line-height: 14px;
                    }
                
                    .vip_btn .btn_item svg {
                        margin: 14px 0;
                        width: 28px;
                        height: 28px;
                        color: #199b6d;
                        font-size: 24px;
                        line-height: 56px;
                    }
                
                    .vip_btn .btn_item:hover span {
                                        display: inline-block;
                                }
                
                    .vip_btn .btn_item:hover svg {
                        display: none;
                    }
                
                    .vip_btn .btn_item:last-child {
                        border: none;
                    }
                `
                Utils.appendStyle(style);
                let section = document.createElement('section');
                section.classList.add('vip_btn');
                section.id = 'zh-vip'
                section.innerHTML = html;
                document.body.appendChild(section);
            }

            
            document.querySelector("#onSetting").onclick = ()=>this.createParseVideoPopup.call(this,null);
            document.querySelector("#onAddVideoApi").onclick = ()=>this.createAddVideoApiPopup.call(this,null);
            document.querySelector("#onPlay").onclick = ()=>this.autoPlay(); 
            //拖拽移动
            let el = document.querySelector('#zh-vip')
            Utils.drag(el,'zh-vip')
        }
        //解析播放
        playVideo(apiUrl){
            this.currentVideoApi = apiUrl;
            //更新接口列表html
            this.updateInPlayApiListHtml();

            Utils.observeElement(Video.platformNodeInfo[this.platform].node).then(element => {
                    let iframeDivCss = "width:100%;height:100%;"
                    if (Video.platformNodeInfo[this.platform].node.url === 'wap_iqiyi') {
                            iframeDivCss += "position: absolute;top: 0;right: 0;bottom: 0;left: 0;"
                    }
                    element.innerHTML = "";
                    element.innerHTML = `<div id="zh_video_model" style="${iframeDivCss}">
                            <iframe id="iframe-player-zhihu" src=" ${this.currentVideoApi + HREF}" frameborder="0" allowfullscreen="true" width="100%" height="100%"></iframe>
                        </div>`;

                    if (Video.platformNodeInfo[this.platform].playwork) this.observeLocationHref()
            })
        }
        //监听页面url改变
        observeLocationHref(){
            let startHref = HREF;
            this.observeLocationHrefTimer = setInterval(function() {
                let lastHref = window.location.href;
                if (startHref != lastHref) {
                    clearInterval(observeLocationHref);
                    window.location.reload();
                }
            },500);
        }
        //自动播放
        async autoPlay(){
            let playDelay = this.playDelay;
            Utils.toast(playDelay + '秒后自动解析视频');
            await Utils.sleep(playDelay*1000);

            let playVideoApi = this.currentVideoApi||this.autoPlayApi||this.currentPlatformInVideoApiList[0];

            this.playVideo(playVideoApi)
        }
        /* 解析设置
         * @params {Number} playDelay - 自动解析延迟时间
         * @params {String} autoPlayApi - 自动解析api
         * @params {Boolean} isAutoPlay - 是否开启自动解析
         */
        savePlayConfig(playDelay = 3,autoPlayApi = '',isAutoPlay = false){
            if(playDelay&&!isNaN(playDelay)){
                this.playDelay = parseInt(playDelay);
            }else{
                return Utils.toast('解析延迟时间请输入整数','error');
            }

            autoPlayApi&&(this.autoPlayApi = autoPlayApi);

            if(isAutoPlay){
                this.isAutoPlay = true;
            }else{
                this.isAutoPlay = false;
            }

            Utils.toast('设置成功');
        }
        /* 添加自定义接口
         * @params {String } newData - 接口数据
         */
        addCustomVideoApi(newData){
            if (newData === '') return toast('请输入需要添加的解析接口');

            let apiArr = newData.split(/[(\r\n)\r\n]+/); // 根据换行或者回车进行识别
            apiArr.forEach((item, index) => { // 删除空项
                    if (!item) {
                            apiArr.splice(index, 1);
                    }
            })

            apiArr = Array.from(new Set(apiArr)); // 去重

            if (apiArr.length > 0) {
                    let repeatApi = []
                    apiArr.forEach((item, index) => {
                            if (item) {
                                    let apiItemArr = item.split(/,/);
                                    console.log(apiItemArr);
                                    let customParseApiData = this.customVideoApiList;
                                    if (apiItemArr.length == 2&&this.platform.includes('wap_')) {
                                            if (this.allvideoApiList.some(item => item.url === apiItemArr[1])) {
                                                return repeatApi.push(index + 1);
                                            }

                                            let j = { name: apiItemArr[0], category: 1, url: apiItemArr[1], showType: "3" };

                                            customParseApiData.unshift(j);

                                            Utils.toast("第" + (index + 1) + "行的解析接口添加成功");

                                    } else if(apiItemArr.length == 3){
                                            if(apiItemArr[1]==1||apiItemArr[1]==2){
                                                    if(this.allvideoApiList.some(item=>item.url === apiItemArr[2]&&item.category == apiItemArr[1])) {
                                                        return repeatApi.push(index + 1);
                                                    }

                                                    let j = {name:apiItemArr[0],category:apiItemArr[1],url:apiItemArr[2],showType:"1"};

                                                    customParseApiData.unshift(j);

                                                    Utils.toast("第"+(index+1)+"行的解析接口添加成功");

                                                    console.log(customParseApiData)
                                            }else{
                                                    Utils.toast("第"+(index+1)+"行格式错误，请按照示例格式重新添加");
                                            }
                                    }else {
                                            Utils.toast("第" + (index + 1) + "行格式错误，请按照示例格式重新添加");
                                    }

                                    this.customVideoApiList = customParseApiData;

                            }
                    });
                    (repeatApi.length > 0) && Utils.toast("第" + repeatApi.join('、') + "行添加的解析接口已存在");
            }
        }
        /* 删除自定义接口
         * @params {Number} index - 接口索引
         */
        deleteCustomVideoApi(index){
            let customParseApiData = this.customVideoApiList;
            let deleteData = customParseApiData[index];
            console.log(deleteData)
            customParseApiData.splice(index,1);
            //如果删除的接口是自动解析接口,同时删除自动解析接口
            if(deleteData.url == this.autoPlayApi) this.autoPlayApi = '';
            Utils.toast('【'+deleteData.name+'】解析接口删除成功')
            this.customVideoApiList = customParseApiData;
        }
        //更新内嵌解析列表页面的接口列表
        updateInPlayApiListHtml(){
            let el =  document.querySelector("#in_play_list");
            el&&(el.innerHTML = this.inPlayApiListHtml)
        }
        //更新跳转解析列表页面的接口列表
        updateOutPlayApiListHtml(){
            let el =  document.querySelector("#out_play_list");
            el&&(el.innerHTML = this.outPlayApiListHtml)
        }
        //更新设置页面
        updateSettingHtml(){
            let el =  document.querySelector("#setting_config");
            el&&(el.innerHTML = this.settingHtml)
        }
        //更新添加解析页面的接口列表
        updateAddPlayApiListHtml(){
            let el =  document.querySelector("#add_play_api");
            el&&(el.innerHTML = this.addPlayApiHtml)
        }0
    }
    //---------------------------全网VIP视频结束-------------------------
    class PCVideo extends Video{
        
        //添加解析页面html
        get addPlayApiHtml(){

            let listHtml = this.customVideoApiList.map((item,index)=>{
                return `
                    <div class="zh-custom-api-list" style="border-bottom: 1px dashed #eee;" id="custom-api-list">
                        <span class="zh-custom-api-item zh-name">${ item.name }</span>
                        <span class="zh-custom-api-item zh-api-url">${item.url}</span>
                        <span class="zh-custom-api-item zh-type">${item.category == 1?'内嵌播放':'跳转播放'}</span>
                        <span class="zh-custom-api-item zh-edit zh-delete" data-url="${item.url}" data-index="${index}">删除</span>
                    </div>
                `
            }).join(''); 

            return `
                <div class="zh-add-editor">
                        <textarea class="text scroll" id="addApiInput" placeholder="数据格式：[名字] + [,] +[1或者2]+ [,]+ [接口地址]&#10;例：智狐百宝箱,1,https://jx.zhihubaibaoxiang.com/jx/?url=&#10;注：一行一个,1代表内嵌播放,2代表跳转播放"></textarea>
                </div>
                <div class="zh-custom-api">
                        <div class="zh-custom-api-list zh-list-header">
                                <span class="zh-custom-api-item zh-name">名称</span>
                                <span class="zh-custom-api-item zh-api-url">接口地址</span>
                                <span class="zh-custom-api-item zh-type">接口类型</span>
                                <span class="zh-custom-api-item zh-edit">操作</span>
                        </div>
                        <div class="scroll" style="height: calc(100% - 36px);width: 100%;overflow-y: scroll;">
                                ${listHtml}
                        </div>
                        
                </div>
            `;
        }
        //pc端内嵌播放接口数据
        get currentPlatformInVideoApiList(){
            return this.allvideoApiList.filter(item=>item.category == 1)
        }
        //pc端跳转播放接口数据
        get currentPlatformOutVideoApiList(){
            return this.allvideoApiList.filter(item=>item.category == 2)
        }

        static rightQrcodeHtml = `
            <div  class="zh-content-right">
                <img  src="http://tool.wezhicms.com/img/1-21121500044Q94.jpg">
                <h1 >智狐百宝箱</h1>
                <p >微信扫描上方二维码</p>
                <p >关注我</p>
                <p >从此不迷路</p>
            </div>
        `;

        static SET_FORM_ITEM_ID = {
            autoPlayApi:'autoplay_api',
            autoPlayDelay:'autoplay_delay',
            isAutoplay:'is_autoplay'
        }
        constructor(platform){
            //父类初始化
            super(platform);
            //添加公共css
            let style = `
                .zh-content-right{
                    margin-left: auto;
                    width: 144px;
                    height: 100%;
                    text-align: center;
                }
                .zh-content-right img{
                    margin: 0 5px 10px;
                    width: 140px;
                }
                .zh-content-right h1{
                    margin: 0 0 20px;
                    font-weight: 700;
                    font-size: 18px;
                }
                .zh-content-right p{
                    margin: 0;
                    color: #666;
                    font-size: 12px;
                    line-height: 26px;
                }
                .zh-video{
                    display:flex;
                    height: 100%;
                    font: 12px/1.5 PingFangSC-Regular,Helvetica,Arial,Microsoft Yahei,sans-serif!important;
                }
            `
            Utils.appendStyle(style);
        }
        //创建解析弹窗
        createParseVideoPopup(){

            if(!this.parseVideoPopup){
                let style = `
                    .zh-video .zh-api-list{
                        overflow-y: auto;
                        height: 100%;
                        padding-right: 5px;
                        display: grid;
                        grid-template-columns: repeat(3, 30%);
                        grid-template-rows: repeat(auto-fill,34px);
                        grid-column-gap: 5%;
                        grid-row-gap: 10px;
                        width: 100%;
                    }
                    .zh-video .zh-api-list .zh-api-item {
                        display: inline-block;
                        line-height: 34px;
                        height: 34px;
                        border-radius: 4px;
                        background: hsla(0, 0%, 89.8%, 0.64);
                        color: #505050;
                        text-align: center;
                        font-size: 12px;
                        cursor: pointer;
                        box-sizing: content-box;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        box-sizing: border-box;
                    }
                    .zh-video .zh-api-list .zh-api-item.zh-active{
                        background: #54be99;
                        color: #fff;
                    }
                    .zh-video .zh-form-list{
                        width:100%;
                        height:100%
                    }
                `
                Utils.appendStyle(style);

                let inPlayHtml = `
                    <div class="zh-video">
                        <div class="zh-api-list scroll" id="in_play_list">
                            ${this.inPlayApiListHtml}
                        </div>
                        ${PCVideo.rightQrcodeHtml}
                    </div>
                `;

                let outPlayHtml = `
                    <div class="zh-video">
                        <div class="zh-api-list scroll" id="out_play_list">
                            ${this.outPlayApiListHtml}
                        </div>
                        ${PCVideo.rightQrcodeHtml}
                    </div>
                `;

                let settingHtml = `
                    <div class="zh-video">
                        <div class="zh-form-list scroll" id="setting_config">
                            ${this.settingHtml}
                        </div>
                        ${PCVideo.rightQrcodeHtml}
                    </div>
                `;

                const onConfirm = (close)=>{
                    let autoPlayApiValue = document.querySelector('#'+PCVideo.SET_FORM_ITEM_ID.autoPlayApi).dataset.value||'';
                    let autoPlayDelayValue = document.querySelector('#'+PCVideo.SET_FORM_ITEM_ID.autoPlayDelay).value||this.playDelay;
                    let isAutoPlayValue = document.querySelector('#'+PCVideo.SET_FORM_ITEM_ID.isAutoplay).checked||false;
                    this.savePlayConfig(autoPlayDelayValue,autoPlayApiValue,isAutoPlayValue);
                    //关闭弹窗
                    close()
                }
                this.parseVideoPopup = Utils.popup(
                    'tab',
                    {
                        size:[560,400],
                        title:['内嵌播放','跳转播放','解析设置'],
                        content:[inPlayHtml,outPlayHtml,settingHtml],
                        confirmText:'保存设置'
                    },
                    onConfirm
                )
                document.querySelector("#in_play_list").onclick = (e)=>{
                    let api = e.target.dataset.url;
                    api&&e.target.classList.contains("zh-api-item")&&this.playVideo(api);
                }
                document.querySelector("#out_play_list").onclick = (e)=>{
                    let api = e.target.dataset.url;
                    api&&window.open(api+HREF);
                }
            }else{
                this.settingPopup.style.display = 'block'
            }
        }
        // 创建添加解析接口
        createAddVideoApiPopup(){
            if(!this.addVideoApiPopup){
                let html = `
                    <div class="zh-video">
                        <div class="zh-content-left scroll" id="add_play_api">
                            ${this.addPlayApiHtml}
                        </div>
                        ${PCVideo.rightQrcodeHtml}
                    </div>
                `;
                let style= `
                    .zh-video .zh-content-left{
                        height: 100%;
                        padding-right: 5px;
                        flex:1
                    }
                    .zh-video .zh-content-left .zh-add-editor{
                            width: 100%;
                            height: 120px;
                                
                    }
                    .zh-video .zh-content-left .zh-add-editor .text{
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border-radius: 5px;
                        border: 1px solid #eee;
                        padding: 10px;
                    }
                    .zh-video .zh-content-left .zh-custom-api{
                            width: 100%;
                            height: calc(100% - 120px);
                            padding: 10px 0;
                            box-sizing: border-box;
                            
                    }
                    .zh-video .zh-content-left .zh-custom-api .zh-custom-api-list{
                        display: flex;
                        align-items: center;
                        height: 36px;
                        justify-content: space-between;
                        padding: 0 10px;
                        box-sizing: border-box;
                        width: 100%;
                    }
                    .zh-video .zh-content-left .zh-custom-api .zh-custom-api-list .zh-custom-api-item{
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .zh-video .zh-custom-api .zh-custom-api-list .zh-name,.zh-type,.zh-edit{
                        width: 60px
                    }
                    .zh-video .zh-content-left .zh-custom-api .zh-custom-api-list .zh-api-url{
                        width: 200px;
                    }
                    .zh-video .zh-content-left .zh-custom-api .zh-custom-api-list .zh-delete{
                        color: rgba(255, 70, 70, 0.849);
                        cursor: pointer;
                    }
                    .zh-video .zh-content-left .zh-custom-api .zh-list-header{
                            background: #eee;
                    }
                `;
                Utils.appendStyle(style);
                
                const onConfirm = ()=>{
                    console.log(this)
                    let data = document.querySelector("#addApiInput").value||'';
                    if(!data){
                        Utils.toast('请输入需要添加的接口','error');
                    }else{
                        this.addCustomVideoApi(data);
                    }
                }
                this.addVideoApiPopup = Utils.popup(
                    'default',
                    {
                        title:'添加解析接口',
                        size:[680,400],
                        content:html
                    },
                    onConfirm
                );

                document.querySelector('#add_play_api').addEventListener('click',(e)=>{
                    e.target.classList.contains('zh-delete')&&this.deleteCustomVideoApi(e.target.dataset.index);
                })
            }else{
                this.addVideoApiPopup.style.display = 'block'
            }
        }
    }
    class WAPVideo extends Video{
        //跳转播放解析接口html
        get outPlayApiListHtml(){
           
        }
        //添加解析页面html
        get addPlayApiHtml(){

            
        }
        
        //WAP端内嵌播放接口数据
        get currentPlatformInVideoApiList(){
            return this.allvideoApiList.filter(item=>item.category == 1)
        }
        constructor(platform){
             //父类初始化
             super(platform);
             //添加公共css
             let style = `
                .zh-api-list{
                    overflow-y: auto;
                    height: 100%;
                    padding-right: 5px;
                    display: grid;
                    grid-template-columns: repeat(3, 30%);
                    grid-template-rows: repeat(auto-fill,34px);
                    grid-column-gap: 5%;
                    grid-row-gap: 10px;
                    width: 100%;
                }
                .zh-api-list .zh-api-item {
                    display: inline-block;
                    line-height: 34px;
                    height: 34px;
                    border-radius: 4px;
                    background: hsla(0, 0%, 89.8%, 0.64);
                    color: #505050;
                    text-align: center;
                    font-size: 12px;
                    cursor: pointer;
                    box-sizing: content-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    box-sizing: border-box;
                }
                .zh-api-list .zh-api-item.zh-active{
                    background: #54be99;
                    color: #fff;
                }
                .zh-form-list{
                    width:100%;
                    height:100%
                }
            `
             Utils.appendStyle(style);
        }
        //创建解析弹窗
        createParseVideoPopup(){

             //关闭其他弹窗
             this.settingPopup&&(this.settingPopup.style.display = 'none');

            if(!this.parseVideoPopup){

                const onSubHead = ()=>{
                    this.createSettingPopup()
                }

                let content = `
                    <div class="zh-api-list scroll" id="in_play_list">
                        ${this.inPlayApiListHtml}
                    </div>
                `;

                this.parseVideoPopup = Utils.wap_popup(
                    content,
                    {
                        title:'解析接口列表',
                        subhead:'解析设置',
                        height:'40%',
                        onSubHead,
                    },
                    
                );

                document.querySelector("#in_play_list").onclick = (e)=>{
                    let api = e.target.dataset.url;
                    api&&e.target.classList.contains("zh-api-item")&&this.playVideo(api);
                };
            }else{
                this.parseVideoPopup.style.display = 'block';
            }
        }
        createSettingPopup(){
            //关闭其他弹窗
            this.parseVideoPopup&&(this.parseVideoPopup.style.display = 'none');

            if(!this.settingPopup){
                const onConfirm = (close)=>{
                    let autoPlayApiValue = document.querySelector('#'+PCVideo.SET_FORM_ITEM_ID.autoPlayApi).dataset.value||'';
                    let autoPlayDelayValue = document.querySelector('#'+PCVideo.SET_FORM_ITEM_ID.autoPlayDelay).value||this.playDelay;
                    let isAutoPlayValue = document.querySelector('#'+PCVideo.SET_FORM_ITEM_ID.isAutoplay).checked||false;
                    this.savePlayConfig(autoPlayDelayValue,autoPlayApiValue,isAutoPlayValue);
                    //关闭弹窗
                    close();
                }

                const onSubHead = ()=>{
                    this.createParseVideoPopup();
                }
                let content = `
                    <div class="zh-form-list scroll" id="setting_config">
                        ${this.settingHtml}
                    </div>
                `;

                this.settingPopup = Utils.wap_popup(
                    content,
                    {
                        title:'自动解析设置',
                        height:'40%',
                        subhead:'返回解析列表',
                        confirmText:'保存设置',
                        onConfirm,
                        onSubHead
                    },
                    
                );

                document.querySelector("#in_play_list").onclick = (e)=>{
                    let api = e.target.dataset.url;
                    api&&e.target.classList.contains("zh-api-item")&&this.playVideo(api);
                };
            }else{
                this.settingPopup.style.display = 'block';
            }
        }
    }
    function videoInit(platform = ''){
        try {
            if(!platform) throw new TypeError('videoInit=>platform:参数错误');
            window.zh_video = new PCVideo(platform);
        } catch (error) {
            console.log(error)
            Utils.toast(error.message,'error');
        }
        
    }
    function mobileVideoInit(platform = ''){
        try {
            if(!platform) throw new TypeError('videoInit=>platform:参数错误');
            window.zh_video = new WAPVideo(platform);
        } catch (error) {
            console.log(error)
            Utils.toast(error.message,'error');
        }
        
    }

    //网址匹配
    const siteMap = [
        {
            match:['www.doc88.com/p.*'],
            initFunc:wenkuInit.daoke
        },
        {
            match:['www.docin.com/p.*'],
            initFunc:wenkuInit.docin
        },
        {
            match:['max.book118.com/html/.*'],
            initFunc:wenkuInit.max_book
        },
        {
            match:['view-cache.book118.com/pptView.html','view.*.book118.com'],
            initFunc:wenkuInit.max_book_ppt
        },
        {
            match:['doc.mbalib.com/view/.*'],
            initFunc:wenkuInit.mbalib
        },
        {
            match:['wenku.baidu.com/view/.*','wenku.baidu.com/tfview/.*'],
            initFunc:wenkuInit.bdwk
        },
        {
            match:['wenku.so.com/d/.*'],
            initFunc:wenkuInit.sodoc
        },
        {
            match:['.*.iqiyi.com/v_.*'],
            platform:'iqiyi_pc',
            initFunc:videoInit
            
        },
        {
            match:['v.youku.com/v_show/.*'],
            platform:'youku_pc',
            initFunc:videoInit
        },
        {
            match:['m.youku.com/alipay_video/.*','m.youku.com/video/.*'],
            platform:'wap_youku',
            initFunc:mobileVideoInit
        }
    ]

    //生成正则表达式
    function createReg(arr){
        return new RegExp(arr.join('|'))
    }

    //根据网址匹配
    for (const site of siteMap) {
            let reg = createReg(site.match)
            let host = window.location.hostname + window.location.pathname
            let result = reg.test(host)
            if(result){
                let platform = site.platform||'';
                //添加公共样式
                Utils.appendStyle(COMMON_STYLE);
                return site.initFunc(platform);
            }
    }
    // Your code here...
})();