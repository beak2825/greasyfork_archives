// ==UserScript==
// @name         Njord平台插件
// @namespace    Njord Script
// @description  Njord平台增强插件
// @author       yhw
// @version      2.2.10
// @match        http://mark.meituan.com/*
// @match        https://mark.meituan.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_info
// @grant		     GM_getValue
// @grant		     GM_setValue
// @require      https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.min.js
// @require      http://cdn.staticfile.org/TimeMe.js/2.0.0/timeme.min.js
// @downloadURL https://update.greasyfork.org/scripts/481912/Njord%E5%B9%B3%E5%8F%B0%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/481912/Njord%E5%B9%B3%E5%8F%B0%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==///

(function () {
    'use strict';

    const VERSION = GM_info.script.version; // 脚本@version
    const ADDRESS = 'http://ai.speechocean.com'; // 预识别服务器地址
    const WAVEITEMS = new Array(); // 音频信息集合
    const USER = {}; // 用户信息
    const PROJECT = {}; // 项目信息
    const queryTimeOut = 1000; // 长音频轮询间隔
    var APIKEY = ""; // 预识别apikey
    var Type = 0;
    var IsStopObserver = false;

    const log_body = {
        project_id: -1, // 当前的项目id
        user_id: -1, // 当前用户id
        user_group: "0", // 客户平台的用户所属供应商标识，需要与pm沟通确认
        role: "0", // 当前用户的角色
        user_action: "", // 用户做的操作
        others: ""
    }
    const send_log = (log_body) => {
        log_body.crx_code = "b556d7bb-ce3e-4d8b-9f17-a1a777b8308b"; // 插件代号，每个插件代号唯一
        log_body.crx_platform = "Meituan-Njord" + "-" + APIKEY; // 插件平台，插件应用的客户平台
        const timestamp = Date.parse(new Date());
        //console.log(timestamp + log_body);
        const signature = md5(`unQaoqsPZhSuX5ni${timestamp}`);
        sendLog(signature, {
            ...log_body,
            timestamp: timestamp
        });
    }

    function appendInput() {
        const style = ".__j-container { top: 15%; font-size: 12px; right: 0px; background:violet; padding:5px; position: fixed; z-index: 100000; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none}.__j-input { width: 100px; }";
        var html =
            '<div class="__j-container">' +
            '<div>\n' +
            '    <label class="__j-label">语言设置</label>\n' +
            '    <select class="__j-input" id="__j-language">\n' +
            '        <option>普通话</option>\n' +
            '        <option>粤语(中国广州)</option>\n' +
            '        <option>广东粤语</option>\n' +
            '        <option>粤语(中国香港)</option>\n' +
            '    </select>\n' +
            '</div>' +
            '<div>\n' +
            '    <label class="__j-label">API KEY</label>\n' +
            '    <input class="__j-input" id="__j-apikey" type="text" name="APIKEY"></input>\n' +
            '</div>' +
            '</div>'
        '';
        var stylenode = document.createElement('style');
        stylenode.setAttribute("type", "text/css");
        if (stylenode.styleSheet) {// IE
            stylenode.styleSheet.cssText = style;
        } else {// w3c
            var cssText = document.createTextNode(style);
            stylenode.appendChild(cssText);
        }
        var node = document.createElement('div');
        node.innerHTML = html;
        document.head.appendChild(stylenode);
        document.body.appendChild(node);
        Type = GM_getValue(GM_info.script.name + "-Type", "");
        document.getElementById("__j-language").options.selectedIndex = Type;
        document.getElementById("__j-language").onchange = (e) => {
            Type = e.srcElement.selectedIndex;
            GM_setValue(GM_info.script.name + "-Type", Type);
        };
        APIKEY = GM_getValue(GM_info.script.name + "-APIKEY", "");
        document.getElementById("__j-apikey").value = APIKEY;
        document.getElementById("__j-apikey").onchange = (e) => {
            APIKEY = e.srcElement.value;
            GM_setValue(GM_info.script.name + "-APIKEY", APIKEY);
        };
    }
    // appendInput();

    // 页面元素监控，如果添加片段，重新进行文本检查
    var observer = new MutationObserver(function (mutations, observer1) {
        if (IsStopObserver) return;
        console.log('-------------------事件触发-----------------------');
        queryCheck();
        addElement();
    });

    /**
     * 重载fetch，用于拦截网页发送的fetch请求
     */
    let originFetch = fetch;
    window.unsafeWindow.fetch = async function (...args) {
        const response = await originFetch(...args);
        if (USER["info"] == null && localStorage["user"] != null) {
            USER = JSON.parse(localStorage["user"]);
        }
        if (PROJECT["info"] == null && localStorage["project"] != null) {
            PROJECT = JSON.parse(localStorage["project"]);
        }
       if(args[0].url.startsWith('https://mark.meituan.com/process/file/proxy')) {
            /*observer.observe(getObserverElement(), {
                childList: true,
                subtree: true,
            });
            addTextElement("加载中...");
            let url = args[0].url;
            //let waveInfo = Object.fromEntries(new URLSearchParams(url.substring(url.indexOf('?'))).entries());
            let waveURL = decodeURIComponent(url.substring(url.indexOf("jump=") + 5));
            // 开启页面有效停留计时器
            TimeMe.resetRecordedPageTime(waveURL);
            TimeMe.initialize({
                currentPageName: waveURL,
                idleTimeoutInSeconds: 10 // seconds
            });*/
            queryCheck();
            addElement();
       }
       return response;
    }

    /**
     * 重载xhr的send，用于拦截网页发送的xhr请求
     */
    let xhr = XMLHttpRequest.prototype;
    let open = xhr.open;
    let send = xhr.send;
    xhr.open = function (method, url) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
    };

    xhr.send = async function (postData) {
        if (this._method.toLowerCase() === 'post') {
            this.addEventListener('load', function () { // 获取响应数据
                /// 用户信息
                if (this._url.indexOf('/process/user/profile') > -1) {
                //if (this._url.startsWith('/process/user/profile')) {
                    console.log('--------用户信息');
                    let user = JSON.parse(this.response)['data'];
                    USER["valid"] = user['departmentName'] == "HT";
                    USER["info"] = user;
                    localStorage["user"] = JSON.stringify(USER);
                }
                /// 选择项目
                if (this._url.indexOf('/process/acl/switchproject') > -1) {
                //if (this._url.startsWith('/process/acl/switchproject')) {
                    console.log('--------选择项目');
                    let project = JSON.parse(this.response)['data'];
                    PROJECT["info"] = project;
                    localStorage["project"] = JSON.stringify(PROJECT);
                }
            });
            // if (this._url.startsWith('/process/assist/autoquality')) {
            // 	console.log('--------提交检查');
            // 	let vue = getVueInstance();
            // 	if (vue != null) {
            // 		var time = TimeMe.getTimeOnPageInMilliseconds(vue["sourceData"]["content"]);
            // 		TimeMe.stopTimer();
            // 		let data = getSubmitData(postData, time);
            // 		let ret = await postResult({ address: ADDRESS, authKey: APIKEY, version: VERSION, data: data });
            // 		log_body.others = JSON.stringify(data);
            // 		log_body.user_action = "SubmitCheck";
            // 		send_log(log_body);
            // 		console.log(ret);
            // 	}
            // }
            /// 提交质检数据（只取提交的请求信息）
            if (this._url.indexOf('/process/annotate/updatetask') > -1) {
            // if (this._url.startsWith('/process/annotate/updatetask')) {
                console.log('--------提交数据');
                /*let vue = getVueInstance();
                if (vue != null) {
                    var time = TimeMe.getTimeOnPageInMilliseconds(vue["sourceData"]["content"]);
                    TimeMe.stopTimer();
                    let data = getSubmitData(postData, time);
                    let ret = await postResult({ address: ADDRESS, authKey: APIKEY, version: VERSION, data: data });
                    log_body.others = JSON.stringify(data);
                    log_body.user_action = "Submit";
                    send_log(log_body);
                    console.log(ret);
                }*/
            }
        }
        return send.apply(this, arguments);
    };

    function getLastWaveItem(waveURL) {
        let items = WAVEITEMS.filter(v => v['waveSource'] == waveURL);
        return items.length > 0 ? items[items.length - 1] : null;
    }

    function getSubmitData(postData, time) {
        let vue = getVueInstance();
        if (vue != null) {
            let submit = Object.fromEntries(new URLSearchParams(postData).entries());
            submit['sourceData'] = vue['sourceData'];
            submit['meta'] = JSON.parse(submit['meta']);
            submit['meta']['data']['markarea'] = submit['meta']['data']['markarea'] != undefined ? JSON.parse(submit['meta']['data']['markarea']) : [];
            let isQaData = submit['sourceData']['data']['recordId'] != null; // 有recordId的是质检数据，否则是标注数据
            let waveURL = submit['meta']['content'];
            let waveItem = getLastWaveItem(waveURL);
            if (waveItem != null) {
                let taskid = waveItem['waveTaskId'];
                let json = {
                    project_name: PROJECT["info"]['projectName'] + "[" + submit['annLogId'] + "]",
                    task_id: taskid,
                    info: {
                        provider: "meituan",
                        name: "Njord",
                        time: time,
                        audioDuration: submit['sourceData']['data']['duration_ms'],
                        label: !isQaData,
                        valid: submit['meta']['data']['has_invalid'] == "1",
                        text: submit['meta']['data']['custom'],
                        user: USER["info"] == null ? null : USER["info"]['userName'],
                        row: submit,
                        userFull: USER,
                    },
                    data: submit['meta']['data']['markarea'].map(item => {
                        return {
                            min: item['area'].split(',')[0],
                            max: item['area'].split(',')[1],
                            text: item['content'],
                            noise: item['has-noise'],
                            accent: item['has-accent'],
                            sex: item['sex'],
                        };
                    }),
                    origin: waveItem["origin"]["data"],
                    full: waveItem,
                    version: VERSION
                };
                return json;
            }

        }
    }

    function getVueInstance() {
        var elements = document.getElementsByClassName("now-wrap");
        if (elements.length > 0) {
            return elements[0].__vue__;
        }
        return null;
    }

    /**
     * 获取音频预识别id
     * @param {{
     * address:String;
     * authKey:String;
     * bolbUrl:String;
     * language:String;
     * type:Number;
     * normal:Boolean;
     * version:String;
     * }} waveInfo 音频信息
     */
    function getWaveId(waveInfo) {
        return new Promise((resolve, reject) => {
            try {
                if (waveInfo.type == 2) {
                    GM_xmlhttpRequest({
                        url: `${waveInfo.address}/speech/api/v1/asr/create_task`,
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + waveInfo.authKey,
                            "Version": waveInfo.version
                        },
                        onreadystatechange: function (responseDetails) {
                            if (responseDetails.readyState === 4) {
                                let d = JSON.parse(responseDetails.response);
                                d.data = { "task_id": d.task_id };
                                resolve(d);
                            }
                        }
                    });
                }
                else if (waveInfo.type == 1) {
                    getLongAudioId(waveInfo).then(v => resolve(v));
                }
                else {
                    reject(`audio type error ${waveInfo.type}`);
                }
            } catch (ex) {
                reject(ex);
            }
        });
    }

    function getLongAudioId(waveInfo) {
        return new Promise((reslove, reject) => {
            fetch(waveInfo.bolbUrl)
                .then(response => response.blob())
                .then(blob => {
                    let formdata = new FormData();
                    formdata.append("domain", waveInfo.language);
                    formdata.append("file_path", blob, "proxy.wav");
                    let headerdata = {
                        "Authorization": "Bearer " + waveInfo.authKey,
                        "Version": waveInfo.version,
                    };
                    if (waveInfo.normal == true)
                        headerdata["Knative-Serving-Tag"] = "normal";
                    GM_xmlhttpRequest({
                        url: `${waveInfo.address}/speech/api/v1/asr/task/create`,
                        method: "POST",
                        headers: headerdata,
                        data: formdata,
                        onreadystatechange: function (responseDetails) {
                            if (responseDetails.readyState === 4) {
                                reslove(JSON.parse(responseDetails.response));
                            }
                        }
                    });
                }).catch(e => reject(e));
        });
    }

    function queryWaveId(waveInfo, taskid) {
        return new Promise((reslove, reject) => {
            fetch(waveInfo.bolbUrl)
                .then(response => response.blob())
                .then(blob => {
                    let headerdata = {
                        "Authorization": "Bearer " + waveInfo.authKey,
                        "Version": waveInfo.version,
                    };

                    if (waveInfo.normal == true)
                        headerdata["Knative-Serving-Tag"] = "normal";
                    if (waveInfo.type == 2) { // 短音频
                        let formdata = new FormData();
                        formdata.append("domain", waveInfo.language);
                        formdata.append("wav_path", blob, "proxy.wav");
                        formdata.append("task_id", taskid)
                        GM_xmlhttpRequest({
                            url: `${waveInfo.address}/speech/api/v2/asr/recognize`,
                            method: "POST",
                            headers: headerdata,
                            data: formdata,
                            onreadystatechange: function (responseDetails) {
                                if (responseDetails.readyState === 4) {
                                    reslove(JSON.parse(responseDetails.response));
                                }
                            }
                        });
                    }
                    else if (waveInfo.type == 1) { // 长音频
                        queryTaskId(waveInfo, taskid, reslove);
                    } else {
                        reject(`audio type error ${waveInfo.type}`);
                    }
                }).catch(e => reject(e));

        });
    }

    function queryTaskId(waveInfo, taskId, reslove) {
        let ids = new Array();
        ids.push(taskId);
        GM_xmlhttpRequest({
            url: `${waveInfo.address}/speech/api/v1/asr/task/query`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + waveInfo.authKey,
                "Version": waveInfo.version,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                task_ids: ids
            }),
            onreadystatechange: function (responseDetails) {
                if (responseDetails.readyState === 4) {
                    let queryResponse = JSON.parse(responseDetails.response);
                    if (queryResponse["data"][0]["task_status"].toLowerCase() == "succeed") {
                        queryResponse["data"] = queryResponse["data"][0];
                        reslove(queryResponse);
                    }
                    else {
                        // 根据指定的时间间隔轮询
                        setTimeout(queryTaskId, waveInfo.queryInterval, waveInfo, taskId, reslove);
                    }
                }
            }
        });
    }

    /**
     * 提交音频进行预识别
     * @param {{
     * address:String;
     * authKey:String;
     * bolbUrl:String;
     * type:Number;
     * normal:Boolean;
     * queryInterval:Number;
     * version:String;
     * }} waveInfo 音频信息
     * @returns {Promise} aa
     */
    function postWave(waveInfo) {
        return new Promise((reslove, reject) => {
            fetch(waveInfo.bolbUrl)
                .then(response => response.blob())
                .then(blob => {
                    let headerdata = {
                        "Authorization": "Bearer " + waveInfo.authKey,
                        "Version": waveInfo.version,
                    };
                    if (waveInfo.normal == true)
                        headerdata["Knative-Serving-Tag"] = "normal";
                    if (waveInfo.type == 2) { // 短音频
                        let formdata = new FormData();
                        formdata.append("domain", "zh_cn");
                        formdata.append("wav_path", blob, "proxy.wav");
                        GM_xmlhttpRequest({
                            url: `${waveInfo.address}/speech/api/v2/asr/recognize`,
                            method: "POST",
                            headers: headerdata,
                            data: formdata,
                            onreadystatechange: function (responseDetails) {
                                if (responseDetails.readyState === 4) {
                                    reslove(JSON.parse(responseDetails.response));
                                }
                            }
                        });
                    }
                    else if (waveInfo.type == 1) { // 长音频
                        let formdata = new FormData();
                        formdata.append("domain", "zh_cn");
                        formdata.append("file_path", blob, "proxy.wav");
                        GM_xmlhttpRequest({
                            url: `${waveInfo.address}/speech/api/v1/asr/task/create`,
                            method: "POST",
                            headers: headerdata,
                            data: formdata,
                            onreadystatechange: function (responseDetails) {
                                if (responseDetails.readyState === 4) {
                                    let createResponse = JSON.parse(responseDetails.response);
                                    queryTaskId(waveInfo, createResponse["data"]["task_id"], reslove);
                                }
                            }
                        });
                    } else {
                        reject(`audio type error ${waveInfo.type}`);
                    }
                }).catch(e => reject(e));

        });
    }

    /**
     * 提交数据到后端服务
     * @param {{
     * address:String;
     * authKey:String;
     * version:String;
     * data:object;
     * }} postData
     * @param {*} callback
     */
    function postResult(postData) {
        return new Promise((reslove, reject) => {
            try {
                GM_xmlhttpRequest({
                    url: `${postData.address}/speech/api/v1/asr/label_result`,
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + postData.authKey,
                        "Version": postData.version,
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(postData.data),
                    onreadystatechange: function (responseDetails) {
                        if (responseDetails.readyState === 4) {
                            reslove(JSON.parse(responseDetails.response));
                        }
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        })
    }

    function autoSplit(vueInstance, data) {
        if (vueInstance != null) {
            let userData = vueInstance['userData'];
            /// 如果没有标注结果，自动填充预识别结果
            if (userData['markarea'] == null && userData["recordId"] == null) {
                if ((data.length > 1 || data[0].text != "")) {
                    let markarea = new Array();
                    let reg6 = new RegExp("[。？！]$", "g");
                    for (let i = 0; i < data.length; i++) {
                        let start = data[i]['start'];
                        start = start == 0 ? 0.05 : start;
                        let end = data[i]['end'];
                        let text = data[i]['text'];
                        text = reg6.test(text) ? text : text.replace(/[,.?!，]+$/g, "") + "。";
                        markarea.push({
                            area: start + "," + end,
                            'has-noise': "无",
                            'has-accent': "无",
                            sex: "男",
                            content: text
                        });
                    }
                    IsStopObserver = true;
                    try {
                        userData['has_invalid'] = 1;
                        userData['markarea'] = JSON.stringify(markarea);
                        vueInstance.updateValue();
                    } finally {
                        IsStopObserver = false;
                    }
                }
            }
        }
    }

    function addTextElement(text) {
        var labels = document.getElementsByClassName('source-content');
        if (labels.length > 0) {
            let label = labels[0];
            if (label.childElementCount > 0) {
                var audioSource = label.children[0];
                if (audioSource.childElementCount > 0) {
                    if (audioSource.__SPOC__ == null) {
                        let div = document.createElement("div");
                        div.className = "flex";
                        let span = document.createElement("span");
                        span.id = "SPOC"
                        let name = document.createElement("div");
                        name.innerText = "参考内容";
                        name.style["left"] = "-100px";
                        name.style["font-size"] = "10px";
                        name.style["z-index"] = "1000";
                        name.style["color"] = "#409eff";
                        name.style["margin-top"] = "3px";
                        name.style["position"] = "absolute";
                        div.appendChild(span);
                        div.appendChild(name);
                        audioSource.appendChild(div);
                        audioSource.__SPOC__ = true;
                    }
                    document.getElementById("SPOC").innerText = text;
                }
            }
        }
    }

    function getObserverElement() {
        // var forms = document.getElementsByTagName("form");
        // for (let i = 0; i < forms.length; i++) {
        //     let form = forms[i];
        //     if (form.innerText.startsWith("音频截取")) {
        //         return form;
        //     }
        // }
        // return null;
        return document.getElementsByClassName('el-main')[0];
    }

    function queryCheck() {
        // if (USER["valid"] != true) return;
        observer.disconnect();
        try {
            const elementMain = document.getElementsByClassName('el-main')[0];
            var buttons = elementMain.getElementsByClassName('el-button--default');
            var buttonsCount = buttons.length;
            for (var i = 0; i < buttonsCount; i++) {
                var button = buttons[i];
                var spans = button.getElementsByTagName('span');
                if (spans != null && spans.length == 1) {
                    if (spans[0].innerText.startsWith('删除("')) {
                        buttonCheck(buttons[i]);
                    }
                }
            }
            var textareas = elementMain.getElementsByClassName('el-textarea__inner');
            var textareasCount = textareas.length;
            for (var i = 0; i < textareasCount; i++) {
                var textarea = textareas[i];
                if (textarea.__SPOC__ == null) {
                    textarea.__SPOC__ = textareaCheck;
                    if (textarea.onkeyup == null) {
                        textarea.onkeyup = function () {
                            this.__SPOC__(this);
                        }
                    }
                }
                textarea.__SPOC__(textarea);
            }
        } finally {
            observer.observe(getObserverElement(), {
                childList: true,
                subtree: true,
            });
        }
    }


    function addElement() {
        if (USER["valid"] != true) return;
        observer.disconnect();
        try {
            let ds = document.getElementsByClassName('el-pagination');
            if (ds.length == 0) return;
            let d = ds[0].parentElement;
            let divCount = d.childElementCount;
            for (let i = 1; i < divCount; i++) {
                let item = d.children[i];
                if (item.children[0].childElementCount == 3) {
                    let tmp = document.createElement('div');
                    tmp.innerHTML = '<button type="button" class="el-button el-button--default" style="margin-left: 10px;"><span>插入{}</span></button>'
                        + '<button type="button" class="el-button el-button--default" style="margin-left: 10px;"><span>插入{er}</span></button>';
                    var buttonCount = tmp.childElementCount;
                    for (let j = 0; j < buttonCount; j++) {
                        let button = tmp.children[0]; // 被使用的button会从tmp中移除，每次都取第一个即可
                        button.onclick = function () {
                            var textarea = this.parentElement.parentElement.getElementsByTagName('textarea')[0];
                            let startPos = textarea.selectionStart; // 获取光标开始的位置
                            let endPos = textarea.selectionEnd; // 获取光标结束的位置
                            if (startPos === undefined || endPos === undefined) return; // 如果没有光标位置 不操作
                            let oldText = textarea.value; // 获取输入框的文本内容
                            let insertText = this.innerText.match(new RegExp("{[^{}]*}", "g"))[0];
                            let newText = oldText.substring(0, startPos) + insertText + oldText.substring(endPos); // 将文本插入
                            textarea.value = newText; // 将拼接好的文本设置为输入框的值
                            textarea.focus(); // 重新聚焦输入框
                            textarea.selectionStart = startPos + (insertText.length == 2 ? 1 : insertText.length);
                            textarea.selectionEnd = startPos + (insertText.length == 2 ? 1 : insertText.length);
                            textarea.dispatchEvent(new Event('input')); // 触发input事件
                            textareaCheck(textarea);
                        };
                        item.children[0].append(button);
                    };
                }
            }
        } finally {
            observer.observe(getObserverElement(), {
                childList: true,
                subtree: true,
            });
        }
    }




    function textareaCheck(textarea) {
        let target = textarea;
        let results = checkText(target.value);
        let errors = results['errors'];
        let warns = results['warns'];
        // 先清理掉之前的错误提示
        target.style.borderColor = null;
        let parent = target.parentNode;
        if (parent != null) {
            let span = parent.getElementsByClassName('error-tip')[0];
            if (span != undefined) {
                target.parentNode.removeChild(span);
            }
            // 如果有错误，则添加错误+警告
            if (errors.length > 0) {
                target.style.borderColor = 'red';
                let span = document.createElement('span');
                span.className = "error-tip";
                span.innerText = errors.concat(warns).join('，');
                span.style.color = 'red';
                parent.appendChild(span);
            } else if (warns.length > 0) {
                target.style.borderColor = 'orange';
                let span = document.createElement('span');
                span.className = "error-tip";
                span.innerText = warns.join('，');
                span.style.color = 'orange';
                parent.appendChild(span);
            }
        }
    }

    function buttonCheck(button) {
        var target = button;
        var text = button.getElementsByTagName("span")[0].innerText;
        var hasError = checkTime(text);
        // 先清理掉之前的错误提示
        target.style.borderColor = null;
        var parent = target.parentNode;
        if (parent != null) {
            var span = parent.getElementsByClassName('error-tip')[0];
            if (span != undefined) {
                target.parentNode.removeChild(span);
            }
            // 如果有错误，则添加错误提示
            if (!hasError) {
                target.style.borderColor = 'red';
                var span = document.createElement('span');
                span.className = "error-tip";
                span.innerText = '时长错误';
                span.style.color = 'red';
                parent.appendChild(span);
            }
        }
    }


    function checkTime(text) {
        var timeStr = text.split('"')[1];
        var time = timeStr.split(',');
        var min = parseFloat(time[0]);
        var max = parseFloat(time[1]);
        return (max - min) <= 20;
    }

    function checkText(text) {
        //console.info('文本检查:', text)
        let errors = new Array();
        let warns = new Array();
        if (text == undefined) return { errors: errors, warns: warns };
        // 空文本
        if (text.length == 0) {
            errors.push('文本为空');
            return { errors: errors, warns: warns };
        }
        let regEnglish = new RegExp("([A-Za-z]+['-]+[A-Za-z]+)|([A-Za-z]+)", "g");
        /// 一个字符或者一个英文单词
        if (text.length == 1 || text.match(regEnglish) == text) {
            errors.push('字数过少');
            return { errors: errors, warns: warns };
        }
        let letterText = text.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\、|\，|\；|\。|\？|\！|\“|\”|\‘|\’|\：|\（|\）|\─|\…|\—|\·|\《|\》]/g, "");
        let regUseless = new RegExp("[嗯啊呀哇哦啦呢咚呐吧吗呵呃唔嘛唉哎诶]+", "g");
        if (letterText.match(regUseless) == letterText || letterText.match(/(.)\1+/g) == letterText) {
            errors.push('全部语气词或重复');
            return { errors: errors, warns: warns };
        }
        // 判断标签是否正确
        let regTag = new RegExp("{[^{}]*}", "g");
        let tags = text.match(regTag);
        if (tags != null) {
            tags.forEach(function (item) {
                if (!checkTag(item))
                    errors.push("标签错误" + item);
            })
        }
        let noTagText = text.replace(regTag, ''); // 无标签文本
        // 有数字
        let reg1 = new RegExp("[0-9]+", "g");
        if (noTagText.match(reg1) != null) {
            errors.push("有数字");
        }
        // 英文首字母大写
        let reg11Match = noTagText.match(regEnglish);
        if (reg11Match != null) {
            let reg111 = new RegExp("^[^A-Z]", "g");
            let enErr = false;
            reg11Match.forEach(function (item) {
                if (item.match(reg111) != null)
                    enErr = true;
            })
            if (enErr)
                errors.push("英文首字母非大写");
        }
        // 英文和英文间有标点
        let reg13 = new RegExp("[a-zA-Z][,.!.，。？！]+[a-zA-Z]", "g");
        if (noTagText.match(reg13) != null) {
            errors.push("英文和英文间有标点");
        }

        // 英文连续大写错误
        let reg12 = new RegExp("[A-Z]{2,}", "g");
        if (noTagText.match(reg12) != null) {
            errors.push("连续大写错误");
        }

        let reg3 = new RegExp("[A-Za-z]+\\s+[\u4e00-\u9fa5]+", "g");
        if (text.match(reg3) != null) {
            errors.push("英文和中文有空格");
        }
        let reg4 = new RegExp("[\u4e00-\u9fa5]+\\s+[A-Za-z]+", "g");
        if (text.match(reg4) != null) {
            errors.push("中文和英文有空格");
        }
        let reg41 = new RegExp("[\u4e00-\u9fa5]+\\s+[\u4e00-\u9fa5]+", "g");
        if (text.match(reg41) != null) {
            errors.push("中文和中文有空格");
        }
        let reg5 = new RegExp("^\\s+", "g");
        if (text.match(reg5) != null) {
            errors.push("句头多余空格");
        }
        let reg5a = new RegExp("\\s{2,}", "g");
        if (text.trim().match(reg5a) != null) {
            errors.push("句中有多余空格");
        }
        let reg5b = new RegExp("\\s$", "g");
        if (text.match(reg5b) != null) {
            errors.push("句尾多余空格");
        }
        let reg6 = new RegExp("[。？！]$", "g");
        if (text.trim().match(reg6) == null) {
            errors.push("句尾标点错误");
        }
        let reg72 = new RegExp("( [，。？！])|([，。？！] )", "g");
        if (noTagText.match(reg72) != null) {
            errors.push("标点前后后空格");
        }
        let reg71 = new RegExp("[，。？！]{2,}", "g");
        if (noTagText.match(reg71) != null) {
            errors.push("有连续标点");
        }
        let reg7 = new RegExp("[^\u4e00-\u9fa5，。？！\\s\\w\\d]", "g");
        if (noTagText.match(reg7) != null) {
            errors.push("有非中文标点");
        }
        let reg8 = noTagText.match(/[^0-9\W]+|[\u4e00-\u9fa5]/g);
        if (reg8 != null && reg8.length == 1) {
            errors.push("只有一个字或单词");
        }
        if (noTagText.indexOf('儿') >= 0)
            warns.push('儿化音需输入{er},请确认"儿"书写正确');

        return { errors: errors, warns: warns };
    }

    function checkTag(text) {
        text = text.substring(1, text.length - 1);
        var reg = new RegExp("^[a-z]+[0-9]*", "g");
        return text.match(reg) == text;
    }

})();