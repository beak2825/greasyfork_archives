// ==UserScript==
// @name         虚幻引擎蓝图文档机翻v1.0.1
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  使用百度翻译API翻译虚幻引擎蓝图文档，包含API条目与API内容描述翻译
// @author       苦旅Zz
// @match        https://dev.epicgames.com/documentation/*/unreal-engine/BlueprintAPI*
// @match        https://dev.epicgames.com/documentation/*/unreal-engine/BlueprintAPI/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epicgames.com
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/518032/%E8%99%9A%E5%B9%BB%E5%BC%95%E6%93%8E%E8%93%9D%E5%9B%BE%E6%96%87%E6%A1%A3%E6%9C%BA%E7%BF%BBv101.user.js
// @updateURL https://update.greasyfork.org/scripts/518032/%E8%99%9A%E5%B9%BB%E5%BC%95%E6%93%8E%E8%93%9D%E5%9B%BE%E6%96%87%E6%A1%A3%E6%9C%BA%E7%BF%BBv101.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("==================== 欢迎使用 虚幻引擎蓝图文档机翻脚本v1.0.1 ====================");
    const fanyiAPI = "https://fanyi-api.baidu.com/api/trans/vip/translate";
    const timestamp = Math.floor(Date.now() / 1000); // 当前时间戳，单位：秒
    let appid = "";
    let key = "";

    let pageKey = "";
    let lastUrl = "";
    let getRootBlockRenderDivInterval = null;
    let transferDatas = [];
    let renderIndex = 0;
    let renderRun = false;

    let rootBlockRenderDiv = null;



    let overlay = null;
    let modal = null;

    function modelStrust(){
        // 添加样式
        const style = document.createElement('style');
        style.innerHTML = `
        #custom-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            width: 400px;
            background: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            overflow: hidden;
            font-family: Arial, sans-serif;
        }
        #custom-modal-header {
            background: #007bff;
            color: white;
            padding: 10px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
        }
        #custom-modal-body {
            padding: 20px;
        }
        #custom-modal-footer {
            padding: 10px;
            text-align: right;
            background: #f1f1f1;
        }
        #custom-modal-footer button {
            padding: 8px 12px;
            margin-left: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #btn-submit {
            background: #007bff;
            color: white;
        }
        #btn-cancel {
            background: #d9534f;
            color: white;
        }
        #custom-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        }
    `;
        document.head.appendChild(style);

        // 创建弹窗 HTML
        const modalHTML = `
        <div id="custom-modal-overlay" style="display: none;"></div>
        <div id="custom-modal" style="display: none;">
            <div id="custom-modal-header">输入百度翻译开发者秘钥</div>
            <div id="custom-modal-body">
                   <label style="color:#000;">注册链接：<a style="color:blue;" href="https://fanyi-api.baidu.com/manage/developer">百度翻译开放平台</a></label><br>
                <form id="custom-form">
                    <label style="color:#000;" for="name">APP ID:</label><br>
                    <input type="text" id="name" value="${appid}" name="appid" style="width: 100%; padding: 5px; margin-bottom: 10px; color: #000;"><br>
                    <label style="color:#000; for="email">秘钥:</label><br>
                    <input type="email" id="email" value="${key}" name="key" style="width: 100%; padding: 5px; margin-bottom: 10px; color: #000;"><br>
                </form>
            </div>
            <div id="custom-modal-footer">
                <button id="btn-submit">提交</button>
                <button id="btn-cancel">取消</button>
            </div>
        </div>
    `;

        // 将弹窗插入到页面
        const div = document.createElement('div');
        div.innerHTML = modalHTML;
        document.body.appendChild(div);

        // 获取元素
        overlay = document.getElementById('custom-modal-overlay');
        modal = document.getElementById('custom-modal');
        const btnSubmit = document.getElementById('btn-submit');
        const btnCancel = document.getElementById('btn-cancel');
        const form = document.getElementById('custom-form');

        // 提交按钮点击事件
        btnSubmit.addEventListener('click',async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            console.log('表单数据:', data);
            const db = await openDatabase();
            await addData(db, {id: "baiduTransferApi", data: data});
            closeModal();
            location.reload();
        });

        // 取消按钮点击事件
        btnCancel.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }

    // 关闭弹窗
    function closeModal() {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }

    // 打开弹窗
    function openModal() {
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }


    GM_registerMenuCommand("设置百度翻译key", function(){
        console.log("123")
        openModal()
    })

    setInterval(function(){
        let current = window.location.href;
        if(lastUrl !== current){
            if(getRootBlockRenderDivInterval){
                clearInterval(getRootBlockRenderDivInterval);
            }
            lastUrl = current;
            init();
        }
    },1000)

    async function init(){
        transferDatas = [];
        renderIndex = 0;
        renderRun = false;

        const db = await openDatabase();
        let cacheData = await getData(db, "baiduTransferApi");
        if(!cacheData || cacheData.length === 0){
            console.error("百度翻译key未设置!!!!")
            modelStrust();
            return
        }else{
            appid = cacheData.data.appid
            key = cacheData.data.key
            modelStrust();
        }

        getRootBlockRenderDivInterval = setInterval(function(){
            console.log("尝试获取文档根元素。。。。")
            rootBlockRenderDiv = document.getElementById("content-blocks-renderer");
            if(rootBlockRenderDiv){
                console.log("已成功获取元素");
                let h1Doms = document.querySelectorAll("h1");
                if(h1Doms.length > 0){
                    console.log("找到h1标题");
                    if("Unreal Engine Blueprint API Reference" === h1Doms[0].innerText){
                        pageKey = "home";
                    }else{
                        pageKey = h1Doms[0].innerText;
                    }
                }
                console.log("pageKey ->", pageKey);
                rootBlockRenderSuccess();
            }
        },2000)
    }


    // 打开数据库
    async function openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('TransferDatabase', 1);

            request.onerror = () => reject('Database failed to open');
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('MyStore')) {
                    db.createObjectStore('MyStore', { keyPath: 'id' });
                }
            };
        });
    }

    // 添加数据
    async function addData(db, data) {
        const transaction = db.transaction(['MyStore'], 'readwrite');
        const store = transaction.objectStore('MyStore');
        return store.add(data);
    }

    async function getData(db, id) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['MyStore'], 'readonly'); // 创建只读事务
            const store = transaction.objectStore('MyStore');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject('Failed to fetch data');
        });
    }



    function rootBlockRenderSuccess(){
        console.log("页面加载完成");
        clearInterval(getRootBlockRenderDivInterval);
        let inputDom = document.getElementById("inputs");
        let outputsDom = document.getElementById("outputs");
        if(inputDom && outputsDom){
            console.log("API页面")
            getApiDir();
        }else{
            getBlockDir();
        }
    }

    async function getApiDir(){
        let colIndex = 3;
        let renderDoms = []
        let markdownDom = document.getElementById("navigation").parentElement;
        let ps = markdownDom.querySelectorAll("p");
        for(let i = 1; i < ps.length; i++){
            renderDoms.push(ps[i])
        }
        let tabelDoms = markdownDom.querySelectorAll("table");
        for(let i = 0; i < tabelDoms.length; i++){
            let tableDom = tabelDoms[i];
            let tds = tableDom.querySelectorAll("tr td");
            for(let j = 1; j <= tds.length; j++){
                if(j % 3 === 0){
                    let td = tds[j-1];
                    if(td.innerText.trim() !== ''){
                        renderDoms.push(td);
                    }
                }
            }
        }
        console.log("renderDoms ->", renderDoms);

        const db = await openDatabase();
        let cacheData = await getData(db, pageKey);

        if(!cacheData || cacheData.length === 0){
            let batchTransferWords = [];
            let words = [];
            for(let i = 0; i < renderDoms.length; i++){
                words.push(renderDoms[i].innerText)
            }
            batchTransferWords.push(words);

            arrayToString(batchTransferWords);
        }else{
            console.log("找到 cache key = ", pageKey)
            transferDatas = cacheData.data
        }
        renderRun = true;
        renderHtml(renderDoms);
    }


    async function getBlockDir(){
        let blockItems = rootBlockRenderDiv.querySelectorAll("block-dir-item");

        let pdoms = [];
        let batchTransferWords = [];
        let words = [];
        for(let i = 0; i < blockItems.length; i++){
            let item = blockItems[i];
            let titleDom = item.querySelector(".title");
            pdoms.push(titleDom);
            words.push(titleDom.innerText);
            if(words.length === 50){
                batchTransferWords.push(words);
                words = [];
            }
        }
        batchTransferWords.push(words);

        const db = await openDatabase();
        let cacheData = await getData(db, pageKey);
        console.log("cacheData ->",cacheData)
        if(!cacheData || cacheData.length === 0){
            arrayToString(batchTransferWords);
        }else{
            console.log("找到 cache key = ", pageKey)
            transferDatas = cacheData.data
        }
        renderRun = true;
        renderHtml(pdoms);
    }

    // 翻译后中文 渲染页面
    async function renderHtml(blockItems){
        console.log("开始渲染 ->", transferDatas, renderIndex)
        for(;renderIndex < transferDatas.length; renderIndex++){
            let item = blockItems[renderIndex];
            //console.log(item)
            let newSpan = document.createElement("span");
            newSpan.textContent = " ("+ transferDatas[renderIndex].dst + ")";
            newSpan.style.color = "#fff";
            newSpan.style.fontWeight = "bold";
            item.appendChild(newSpan);
        }

        if(renderRun){
            if(renderIndex < blockItems.length){
                setTimeout(function(){
                    renderHtml(blockItems);
                },3000);
            }else{
                console.log("渲染完成！")
                //插入 indexedDB
                const db = await openDatabase();
                await addData(db, { id: pageKey, data: transferDatas, length: transferDatas.length});
            }
        }else{
            console.log("渲染停止...")
        }
    }

    //翻译前 words参数构造
    function arrayToString(batchTransferWords){
        console.log("batchTransferWords ->",batchTransferWords)
        batchTransferWords.forEach(item =>{
            let words = item.join("\n");
            //console.log(words)
            setTimeout(function(){
                transferCN(words);
            },5000);
        })
    }

    //百度翻译 英译中
    function transferCN(words){
        let params = fanyiAPI + "?q="+encodeURI(words)+"&from=en&to=zh&appid="+appid+"&salt="+timestamp+"&sign="+getBaiduFanyiSign(words)+"&needIntervene="+1;

        GM_xmlhttpRequest({
            method: 'GET', // 请求方法
            url: params, // 第三方接口地址
            headers: {
                'Content-Type': 'application/json' // 可选：设置请求类型
            },
            onload: function (response) {
                let transferData = JSON.parse(response.responseText);
                transferDatas.splice(transferDatas.length, 0, ...transferData.trans_result);
            },
            onerror: function (error) {
                console.error('Error:', error); // 处理错误
            }
        });
    }

    //获取百度翻译sign
    function getBaiduFanyiSign(words){
        console.log(words);
        let signStr = appid + words + timestamp + key;
        let md5sign = CryptoJS.MD5(signStr).toString();
        console.log("sign =", md5sign);
        return md5sign;
    }
})();