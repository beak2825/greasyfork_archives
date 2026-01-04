// ==UserScript==
// @name         MetaLoop2Aria2
// @namespace    http://tampermonkey.net/
// @version      0.0.1.6
// @description  获取MetaLoop文件下载地址，发送Aria2下载请求，同时复制下载链接到剪贴板，方便本地IDM直接从剪贴板创建任务，适配 Chrome浏览器。@Aria2下载:https://github.com/aria2/aria2
// @author       neuzyy
// @license      AGPL-3.0-or-later
// @match        http://data.deepglint.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// @grant             GM_info
// @grant             GM_registerMenuCommand
// @grant             GM_cookie
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/459883/MetaLoop2Aria2.user.js
// @updateURL https://update.greasyfork.org/scripts/459883/MetaLoop2Aria2.meta.js
// ==/UserScript==

// aria2c RPC 连接设置
let rpc_domain = "http://127.0.0.1";
let rpc_port = 6800;
let rpc_token = "dghf";
let rpc_path = "/jsonrpc";
let rpc_dir = "/mnt/data/Download";

let g_url = null;
let g_openState = false;
let g_body = null;
let g_total_count = null;

let g_success_num = 0;
let g_fail_num = 0;
let g_rpc_connection = true;

// 解析URL参数
function parseURL(url) {
    var params = {};
    // 如果 URL 不包含查询字符串，则直接返回空字典
    if (url.indexOf('?') === -1) {
        return params;
    }
    // 获取查询字符串部分
    var queryString = url.split('?')[1];
    // 将查询字符串按 "&" 分割成键值对数组
    var keyValuePairs = queryString.split('&');
    // 遍历键值对数组，将每个键值对分割成键和值，并添加到字典中
    keyValuePairs.forEach(function(keyValuePair) {
        var pair = keyValuePair.split('=');
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1] || '');
        params[key] = value;
    });
    return params;
}

(function() {
    'use strict';
    // 拦截fetch请求
    const targetScriptUrl = '/8256.62bf29da72fdf4b4.async.js';
    const targetScriptUrl1 = '/src__pages__dataManage__viewDataset__index.5cf734494da69f08.async.js';

    // 重写 document.createElement 方法
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName, options) {
        const element = originalCreateElement.call(document, tagName, options);
        if (tagName.toLowerCase() === 'script') {
            Object.defineProperty(element, 'src', {
                set(url) {
                    // console.log(url)
                    if (url === targetScriptUrl) {
                        // 拦截到目标 script 请求
                        fetch(url)
                            .then(response => response.text())
                            .then(text => {
                            // 修改内容
                            const modifiedText = text.replace('(0,g.jsx)(L.ZP,{type:\"primary\",onClick:function(){return v(r?r.obj_url:\"\")},children:\"\\u672C\\u5730\\u64AD\\u653E\"})', '(0,g.jsx)(L.ZP,{type:\"primary\",onClick:function(){return v(r?decodeURIComponent(r.obj_url):\"\")},children:\"\\u672C\\u5730\\u64AD\\u653E\"})');
                            // 创建一个 Blob 对象
                            const blob = new Blob([modifiedText], { type: 'application/javascript' });
                            // 创建一个本地 URL
                            const modifiedUrl = URL.createObjectURL(blob);
                            // 设置 script 元素的 src 为本地 URL
                            element.setAttribute('src', modifiedUrl);
                        });
                    }
                    else if(url === targetScriptUrl1){
                        // 拦截到目标 script 请求
                        fetch(url)
                            .then(response => response.text())
                            .then(text => {
                            // 修改内容
                            const modifiedText = text.replace('onClick:function(){return We(e)},children:\"\\u8840\\u7F18\"', 'onClick:function(){const link=document.createElement("a");link.href=decodeURIComponent(e.obj_url);link.download=decodeURIComponent(e.obj_url).split("/").pop();document.body.appendChild(link);link.click();document.body.removeChild(link);},children:\"\\u4e0b\\u8f7d\"');
                            // 创建一个 Blob 对象
                            const blob = new Blob([modifiedText], { type: 'application/javascript' });
                            // 创建一个本地 URL
                            const modifiedUrl = URL.createObjectURL(blob);
                            // 设置 script 元素的 src 为本地 URL
                            element.setAttribute('src', modifiedUrl);
                        });
                    }else {
                        element.setAttribute('src', url);
                    }
                },
                get() {
                    return element.getAttribute('src');
                },
                configurable: true
            });
        }

        return element;
    };

    //aria2c 下载相关
    function post(url, data, headers, type) {
        if (Object.prototype.toString.call(data).replace(/^\[object (.+)\]$/, '$1').toLowerCase() === 'object') {
            data = JSON.stringify(data);
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST", url, headers, data,
                responseType: type || 'json',
                onload: (res) => {
                    type === 'blob' ? resolve(res) : resolve(res.response || res.responseText);
                },
                onerror: (err) => {
                    reject(err);
                },
            });
        });
    }

    async function sendLinkToRPC(filename, link) {
        let rpc = {
            domain: rpc_domain,
            port: rpc_port,
            path: rpc_path,
            token: rpc_token,
            dir: rpc_dir,
        };

        let url = `${rpc.domain}:${rpc.port}${rpc.path}`;
        let rpcData = {
            id: new Date().getTime(),
            jsonrpc: '2.0',
            method: 'aria2.addUri',
            params: [`token:${rpc.token}`, [link], {
                dir: rpc.dir,
                out: filename,
                header: []
            }]
        };
        try {
            let res = await post(url, rpcData, {}, '');
            if (res.result) return 'success';
            return 'fail';
        } catch (e) {
            return 'fail';
        }
    }
    // get aria2c version
    async function getAria2Version() {
        let rpc = {
            domain: rpc_domain,
            port: rpc_port,
            path: rpc_path,
            token: rpc_token,
            dir: rpc_dir,
        };

        let url = `${rpc.domain}:${rpc.port}${rpc.path}`;
        let rpcData = {
            id: new Date().getTime(),
            jsonrpc: '2.0',
            method: 'aria2.getVersion',
            params: [`token:${rpc.token}`,]
        };
        try {
            let res = await post(url, rpcData, {}, '');
            if (res.result) return res.result.version;
            return 'fail';
        } catch (e) {
            return 'fail';
        }
    }
    getAria2Version().then((result_version)=>{
        if(result_version == "fail")
        {
            g_rpc_connection = false;
            alert(`${rpc_domain} Aria2 RPC 连接失败，请检查连接参数！！！`);
        }
        else
        {
            alert(`${rpc_domain} Aria2 ${result_version} connect success!`);
        }
    })
    // 获取搜索结果
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        if (url.includes("/api/v1/search/dataset/")) {
            g_url = url;
            g_openState = true;
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    const res = JSON.parse(this.responseText);
                    g_total_count = res.total_count;
                    console.log("g_total_count", g_total_count)
                    // console.log(res.data)
                    // let ret_json = JSON.parse(res.responseText);
                    // let search_ret = res.data;
                    // for(let i = 0; i < search_ret.length; i++)
                    // {
                    //     let urlPath = search_ret[i].obj_url;
                    //     let fileName = search_ret[i].name;
                    //     let filePath =search_ret[i].path;
                    //     search_ret[i].path = search_ret[i].path + "1";
                    //     console.log(filePath, urlPath,filePath);
                    // }
                    // // 当前 xhr 对象上定义 responseText
                    // Object.defineProperty(this, "responseText", {
                    //     writable: true,
                    // });
                    // res.data = search_ret;
                    // this.responseText = JSON.stringify(res);
                    // console.log(this.responseText);
                }
            });
        }
        if (url.includes("async.js")) {
            // 在这里修改JSX文件的内容
            let modifiedResponse = this.responseText.replace('本地播放', '本地播放1');
            console.log('XHR Original JSX content:', this.responseText);
            console.log('XHR Modified JSX content:', modifiedResponse);

            // 使用defineProperty修改responseText
            //             Object.defineProperty(this, 'responseText', {
            //                 get: () => modifiedResponse,
            //             });
        }
        originOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.mySend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        if(g_openState){
            try{
                g_body = JSON.parse(body);
            }catch(e){
            }
            g_openState = false;
            console.info("body",body);
        }
        // g_body = JSON.parse(body);
        // body_copy.limit = 10000;
        // console.info("body_copy",JSON.stringify(body_copy));
        // this.mySend(JSON.stringify(body_copy));
        this.mySend(body);
    };

    async function handleClick(){
        let href = document.location.href
        var parsedParams = parseURL(href)
        // console.log(parsedParams)
        var name = ""
        var version = ""
        if("name" in parsedParams)
        {
            name = parsedParams.name
        }
        if("version" in parsedParams)
        {
            version = parsedParams.version
        }
        let dataSetName = ""
        if ("dataset" in parsedParams)
        {
            dataSetName = parsedParams.dataset
        }else
        {
            if(name.length > 0 && version.length > 0)
            {
                dataSetName = `${name}_V${version}`;
            }else if(name.length > 0)
            {
                dataSetName = `${name}_None`;
            }
        }

        // console.log(dataSetName)
        if(!g_body)
        {
            alert("请先点击搜索!");
            return ;
        }
        g_body.offset = 0;
        g_body.limit = g_total_count;
        // g_body.limit = 10;
        // delete g_body.limit;
        if(g_body.hasOwnProperty("only_count"))
        {
            g_body.only_count = false;
        }
        let ret_json = await post(`http://data.deepglint.com${g_url}`,g_body,{},"");
        console.info("ret_json",ret_json)
        if(ret_json.code = 200)
        {
            // console.log(JSON.parse(res.responseText));
            // let ret_json = JSON.parse(res.responseText);
            let search_ret = ret_json.data;
            let downloadURL = "";
            let annos = "";
            g_success_num = 0;
            g_fail_num = 0;
            let sendRetList = [];
            let valid_num = 0;
            for(let i = 0; i < search_ret.length; i++)
            {
                let urlPath = search_ret[i].obj_url;
                let fileName = search_ret[i].name;
                let bearberry_dic = {};
                // console.log("result:",search_ret[i])
                if(search_ret[i].hasOwnProperty("bearberry") && search_ret[i].bearberry.length > 0)
                {
                    bearberry_dic = JSON.parse(search_ret[i].bearberry);
                }else{
                    bearberry_dic = {}
                }
                bearberry_dic.obj_url = urlPath;
                let anno_dic = {"urlPath":urlPath,"ret":bearberry_dic};
                if(anno_dic.ret.length>0){
                    annos += `${JSON.stringify(anno_dic)} \n`;
                }
                let filePath =`${dataSetName}/${search_ret[i].path}/${fileName}`;
                // if (fileName.includes("R.mp4"))
                // {
                //     continue;
                // }
                valid_num += 1;
                if(g_rpc_connection)
                {
                    sendRetList.push(sendLinkToRPC(filePath, urlPath));
                    // console.log(filePath, urlPath)
                }
                // console.log(filePath, urlPath);
                downloadURL += `${urlPath} ${filePath} \n`;
                if (sendRetList.length > 800 || (i == search_ret.length - 1 && sendRetList.length > 0)){
                    let rets = await Promise.all(sendRetList);
                    for (var rei_i = 0; rei_i < rets.length; rei_i++){
                        if(rets[rei_i] == "success")
                        {
                            g_success_num+=1;
                        }else{
                            g_fail_num += 1;
                        }
                    }
                    sendRetList = [];
                }
            }
            let logtxt = `${valid_num}/${ret_json.total_count}下载链接已复制`;
            GM_setClipboard(downloadURL,'text');
            if(g_rpc_connection)
            {
                logtxt += `\naria2c 发送成功 ${g_success_num} \n  发送失败 ${g_fail_num}`;
                if(g_fail_num > 0)
                {
                    logtxt += "\n！！！请检查aria2 RPC 连接配置是否正确！！！";
                }
                // console.info(annos.length)
                if(annos.length > 0){
                    // 创建一个Blob对象
                    var blob = new Blob([annos], {type: "text/plain;charset=utf-8"});
                    // 创建一个下载链接
                    var downloadLink = document.createElement("a");
                    downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.download = "label.txt";
                    downloadLink.textContent = "标注结果下载";
                    // 创建弹窗
                    var popupWindow = window.open("", "_blank", "width=600,height=200");
                    popupWindow.document.write("<html><body>");
                    // popupWindow.document.write("<h1>下载链接</h1>");
                    popupWindow.document.write(`<p>${logtxt}</p>`);
                    popupWindow.document.write("<p>点击下面的链接下载文件：</p>");
                    popupWindow.document.write(downloadLink.outerHTML);
                    popupWindow.document.write("</body></html>");
                }
                else{
                    alert(logtxt);
                }
            }else
            {
                alert(logtxt);
            }

        }
    }
    // 添加下载按钮
    setInterval(function() {
        let ant_btn_list = document.getElementsByClassName("ant-btn ant-btn-primary");

        if(ant_btn_list)
        {
            let button_list = null;
            for(let b_i = 0; b_i < ant_btn_list.length; b_i++)
            {
                if(ant_btn_list[b_i].innerText == "批量下载" || ant_btn_list[b_i].innerText == "全 选" || ant_btn_list[b_i].innerText == "删除选中" || ant_btn_list[b_i].innerText == "下 载")
                {
                    button_list = ant_btn_list[b_i].parentNode;
                    break;
                }
            }
            if(button_list && button_list.lastChild.textContent != "aria2c 下载")
            {
                let btn = button_list.firstChild.cloneNode(true);
                btn.disabled=false;
                btn.style = "margin-left: 8px;";
                btn.textContent = "aria2c 下载";
                btn.addEventListener('click',handleClick);
                button_list.append(btn);
            }
        }
    },500)
})();