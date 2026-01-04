// ==UserScript==
// @name         易班考试
// @namespace    http://tampermonkey.net/
// @license Common
// @version      2.0.2
// @description  只可共享题库使用，考试之前看一下题库数量，如果答案太少就不要用，推荐使用万能答题脚本。
// @author       木木
// @match        *.yooc.me/*
// @match        *.yiban.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yooc.me
// @grant        none
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/457443/%E6%98%93%E7%8F%AD%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/457443/%E6%98%93%E7%8F%AD%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function () {
    // ================== 修复版网络劫持模块 ===================
    window.NetInterceptor = (() => {
        const rules = [];

        /**
         * 添加劫持规则
         * @param {Object} config
         * config.matchUrl: 字符串或正则，用于匹配 URL
         * config.beforeRequest(url, bodyOrInit): 修改请求 body 或 fetch init
         * config.afterResponse(response, url): 修改 fetch 返回结果，可返回新的 Response
         * config.streamHandler(reader, url): 对流式响应处理，返回新的字符串或 ArrayBuffer
         */
        function addRule(config) {
            rules.push(config);
        }

        // ===== 劫持 fetch =====
        const _fetch = window.fetch;
        window.fetch = async function (input, init = {}) {
            let url = (typeof input === 'string') ? input : input.url;
            let matchedRules = rules.filter(rule => {
                if (rule.matchUrl instanceof RegExp) return rule.matchUrl.test(url);
                if (typeof rule.matchUrl === 'string') return url.includes(rule.matchUrl);
                return false;
            });

            // 处理请求前
            let modifiedInit = {...init};
            for (const rule of matchedRules) {
                if (rule.beforeRequest) {
                    modifiedInit = rule.beforeRequest(url, modifiedInit) || modifiedInit;
                }
            }

            const response = await _fetch(input, modifiedInit);

            // 处理流式响应
            if (response.body && matchedRules.some(r => r.streamHandler)) {
                const originalReader = response.body.getReader();
                const streamHandlerRules = matchedRules.filter(r => r.streamHandler);

                // 创建一个新的可读流
                const stream = new ReadableStream({
                    async start(controller) {
                        try {
                            while (true) {
                                const {done, value} = await originalReader.read();
                                if (done) break;

                                let processedValue = value;
                                for (const rule of streamHandlerRules) {
                                    processedValue = await rule.streamHandler(
                                        {read: () => Promise.resolve({done: false, value: processedValue})},
                                        url
                                    ) || processedValue;
                                }

                                controller.enqueue(processedValue);
                            }
                        } catch (error) {
                            console.error("Stream processing error:", error);
                        } finally {
                            controller.close();
                            originalReader.releaseLock();
                        }
                    }
                });

                // 返回新的响应，保留原始响应头
                const responseHeaders = new Headers(response.headers);
                return new Response(stream, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: responseHeaders
                });
            }

            // 处理普通响应
            let finalResponse = response;
            for (const rule of matchedRules) {
                if (rule.afterResponse) {
                    // 克隆响应以避免污染原始响应
                    const clonedResponse = finalResponse.clone();
                    const modifiedResponse = await rule.afterResponse(clonedResponse, url);
                    if (modifiedResponse instanceof Response) {
                        finalResponse = modifiedResponse;
                    }
                }
            }

            return finalResponse;
        };

        // ===== 劫持 XMLHttpRequest =====
        const _xhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, ...args) {
            this._netInterceptorUrl = url;
            return _xhrOpen.call(this, method, url, ...args);
        };

        const _xhrSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (body) {
            const url = this._netInterceptorUrl;
            let matchedRules = rules.filter(rule => {
                if (rule.matchUrl instanceof RegExp) return rule.matchUrl.test(url);
                if (typeof rule.matchUrl === 'string') return url.includes(rule.matchUrl);
                return false;
            });

            // 处理请求前
            let modifiedBody = body;
            for (const rule of matchedRules) {
                if (rule.beforeRequest) {
                    modifiedBody = rule.beforeRequest(url, modifiedBody) || modifiedBody;
                }
            }

            // 添加响应拦截
            const _xhrOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = function () {
                if (this.readyState === 4) {
                    try {
                        let finalResponse = this.response;
                        let finalResponseText = this.responseText;

                        for (const rule of matchedRules) {
                            if (rule.afterResponse) {
                                // 创建一个模拟的响应对象
                                const mockResponse = {
                                    status: this.status,
                                    statusText: this.statusText,
                                    headers: this.getAllResponseHeaders(),
                                    url: this.responseURL,
                                    arrayBuffer: () => Promise.resolve(finalResponse),
                                    text: () => Promise.resolve(finalResponseText),
                                    json: () => Promise.resolve(JSON.parse(finalResponseText)),
                                    clone: () => ({...mockResponse})
                                };

                                // 调用响应处理函数
                                const result = rule.afterResponse(mockResponse, url);
                                if (result && typeof result.then === 'function') {
                                    // 如果是Promise，等待它完成
                                    result.then(modifiedResponse => {
                                        if (modifiedResponse && typeof modifiedResponse.text === 'function') {
                                            modifiedResponse.text().then(text => {
                                                // 修改XHR的响应数据
                                                Object.defineProperty(this, 'response', {
                                                    value: text,
                                                    writable: true
                                                });
                                                Object.defineProperty(this, 'responseText', {
                                                    value: text,
                                                    writable: true
                                                });
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    } catch (e) {
                        console.error("NetInterceptor xhr afterResponse error", e);
                    }
                }

                if (_xhrOnReadyStateChange) {
                    _xhrOnReadyStateChange.apply(this, arguments);
                }
            };

            return _xhrSend.call(this, modifiedBody);
        };

        return {
            addRule
        };
    })();
// 修复版响应处理工具
    const ResponseHelper = {
        async processResponse(response, processor) {
            // 克隆原始响应以保留原始数据
            const clonedResponse = response.clone();

            try {
                const text = await clonedResponse.text();
                let jsonData;

                try {
                    jsonData = JSON.parse(text);
                } catch {
                    // 如果不是JSON，直接返回原始响应
                    console.warn('响应不是JSON格式，返回原始响应');
                    return response;
                }

                // 调用处理器函数
                const processedData = processor(jsonData, response);

                // 如果处理器返回了数据，创建新响应
                if (processedData !== undefined) {
                    const newResponse = new Response(JSON.stringify(processedData), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: new Headers(response.headers)
                    });
                    return newResponse;
                }

                // 如果处理器没有返回数据，返回原始响应
                return response;

            } catch (error) {
                console.error('响应处理错误:', error);
                return response; // 出错时返回原始响应
            }
        }
    };

// 使用示例
    NetInterceptor.addRule({
        matchUrl: 'api/',
        afterResponse: async (response) => {
            return ResponseHelper.processResponse(response, (jsonData, originalResponse) => {
                console.log("考试接口返回:", jsonData);

                // 在这里可以修改数据
                // jsonData.processed = true;

                // 必须返回修改后的数据
                return jsonData;
            });
        }
    });
    NetInterceptor.addRule({
        matchUrl: '5721',
        afterResponse: async (response) => {
            return ResponseHelper.processResponse(response, (jsonData, originalResponse) => {
                console.log("考试接口返回:", jsonData);

                // 在这里可以修改数据
                // jsonData.processed = true;

                // 必须返回修改后的数据
                return jsonData;
            });
        }
    });

    let originalPlay = HTMLVideoElement.prototype.play;
    HTMLVideoElement.prototype.play = function () {
        this.pause();
    };

    /*document.addEventListener("touchstart", function(event) {
        const x = event.clientX; // 点击位置的 X 坐标
        const y = event.clientY; // 点击位置的 Y 坐标
        alert(`${x},${y}`)
    });
    document.addEventListener("touchmove", function(event) {
        const x = event.clientX; // 点击位置的 X 坐标
        const y = event.clientY; // 点击位置的 Y 坐标
        alert(`${x},${y}`)
    });
    document.addEventListener("touchend", function(event) {
        const x = event.clientX; // 点击位置的 X 坐标
        const y = event.clientY; // 点击位置的 Y 坐标
        alert(`${x},${y}`)
    });*/


    function simulateComplexClick(element, offsetX, offsetY) {
        let rect = element.getBoundingClientRect();
        let click_x = rect.left + offsetX;
        let click_y = rect.top + offsetY;
        ["mousedown", "mouseup", "click",/* "touchstart"*/].forEach((eventType) => {
            const event = new MouseEvent(eventType, {
                bubbles: true, cancelable: true, view: window, clientX: click_x, clientY: click_y,
            });
            element.dispatchEvent(event);
        });
    }


    let bg_url = '';
    window.simulateComplexClick = simulateComplexClick
    const interval = setInterval(() => {
        let element = document.querySelector('.shumei_captcha_loaded_img_bg');
        if (element) {
            if (element.src.indexOf('https') !== -1 && bg_url !== element.src) {
                clearInterval(interval);
                bg_url = element.src;
                fetch('https://43.128.107.237:5721/predict/' + "?bg_img=" + element.src, {
                    method: 'GET', mode: 'cors', headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(r => {
                    if (r.ok) {
                        r.json().then(j => {
                            simulateComplexClick(document.querySelector('.shumei_captcha_img_wrapper'), j['min_area_center'][0] / 2, j['min_area_center'][1] / 2)
                        })
                    } else {
                        alert('请求失败，可能是服务器未放行，前往放行https://43.128.107.237:5721')
                    }
                })
            }

        }
    }, 100);


    let has_init = false;
    let tk;
    let id;
    let button_init = false;
    let user_data;

    //=========替换特殊字符防止匹配不上=======================
    window.my_replace = function my_replace(text) {
        text = text.replace(new RegExp(/ |	|\\t|\\r|\\n|<br>|<br\/>|&nbsp;|—|\s/g), "");
        return text;
    }

    const localStorage = window.localStorage;

    function set_value(key, value) {
        localStorage.setItem(key, value);
    }

    function get_value(key) {
        return localStorage.getItem(key);
    }

    // =========试卷的一些信息存储，包括易班id，cookie，考试名称===============
    user_data = JSON.parse(get_value('data') != null ? get_value('data') : '{}');

    function update_data(key, value) {
        user_data[key] = value;
        set_value('data', JSON.stringify(user_data));
    }

    if (window.location.href.endsWith('take')) {
        localStorage.clear();
    }

    // ==========获取token=============================
    let token = get_value("token");
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith('exam-paper')) {
            let value = localStorage[key];
            localStorage.removeItem(key);
            set_value('back-' + key, value);
        }
    }

    function get_token() {
        /*let t = prompt("请输入token(进群691977572免费获取)", token === null ? '' : token);
        if (t.length !== 16) {
            alert("长度不对");
            get_token();
        } else {
            token = t;
            set_value("token", token);
        }*/
    }


    // ============判断当前页面链接，如果是电脑版则跳转到手机版=====================


    let u = window.location.href;
    if (u === ('https://www.yooc.me/')) {
        window.location.replace('https://www.yooc.me/mobile/yooc')
    }
    // https://group.yooc.me/group/8399364/index
    // https://www.yooc.me/group/8399364/courses
    const match = u.match(/www\.yooc\.me\/group\/(\d+)\/courses/);
    if (match) {
        const groupId = match[1];
        const result = confirm("是否切换成手机页面进行考试");
        if (result) {
            window.location.replace(`https://group.yooc.me/group/${groupId}/index`)
        }
    }
    const exam_match = u.match(/www\.yooc\.me\/group\/(\d+)\/exams/);
    if (exam_match) {
        const groupId = exam_match[1];
        const result = confirm("是否切换成手机页面进行考试");
        if (result) {
            window.location.replace(`https://group.yooc.me/group/${groupId}/exams`)
        }
    }

    //正则匹配当前链接是否为exam.yooc.me/group/6540630/exams?
    const exams_reg = new RegExp(/exam.yooc.me\/group\/\d+\/exams/);
    if (exams_reg.test(u)) {

        // alert("脚本暂时不能考试")
    }
    if (u.indexOf('user_data=') !== -1) {
        const user_data_str = u.match('(?<=user_data=)\\w+')[0];
        const data = JSON.parse(decodeURIComponent(atob(user_data_str)));
        user_data = Object.assign(user_data, data);
        set_value('data', JSON.stringify(user_data));
    }
    /*if (u.indexOf('cookie') !== -1) {
        //获取cookie的值
        const base64_cookie = u.match('(?<=cookie=)\\w+')[0];
        const cookie = decodeURIComponent(atob(base64_cookie));
        //清空页面cookie并重新设置, cookie解密后的一个可能值为
        const cookie_obj = eval('(' + cookie + ')');
        for (const key in cookie_obj) {
            document.cookie = key + '=' + cookie_obj[key];
        }
        //去掉当前链接的cookie参数并重新加载当前链接
        window.location.replace(u.replace('cookie=' + base64_cookie, ''));
    }*/
    if (u.startsWith('https://www.yooc.me/group/') && u.endsWith('topics')) {
        window.location.replace(u.replace('www', 'group').replace('topics', 'index'));
    }
    // =================劫持fetch方法========================================
    // =================监听并获取一些数据，以便服务器实现解密等功能================
    // =================修改返回值以达到查卷，禁止乱序等功能======================

    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        // console.log('request', url)
        const xhr = this;
        const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "response").get;
        Object.defineProperty(xhr, "responseText", {
            get: () => {
                let result = getter.call(xhr);
                try {
                    if (url.indexOf('api/group/info') !== -1) {
                        const json = JSON.parse(result);
                        let invite_code = json.data.code;
                        let group_name = json.data.name;
                        update_data('invite_code', invite_code);
                        update_data('group_name', group_name);
                        // let invite_code = result.match('(?<=code...)\\w+')[0];
                        let title = document.getElementsByClassName('title')[0];
                        title.innerText = title.innerText + '邀请码' + invite_code;
                    }
                    if (url.indexOf('api/group/module') !== -1) {
                        let js = JSON.parse(result);
                        for (let i = 0; i < js['data']['modules'].length; i++) {
                            if (js['data']['modules'][i]['module'].indexOf('exam') !== -1) {
                                const user_data_str = btoa(encodeURIComponent(JSON.stringify(user_data)));
                                js['data']['modules'][i]['url'] += '?user_data=' + encodeURI(user_data_str);
                            }
                        }
                        return JSON.stringify(js);
                    }
                    return result;
                } catch (e) {
                    return result;
                }
            },
        });
        originOpen.apply(this, arguments);
    };
    window.au_fetch = window.fetch;
    window.fetch = function (url) {
        if (url.indexOf('api') === -1) {
            return au_fetch(url);
        }
        if (url.indexOf("yibanId") !== -1) {
            id = url.match('(?<=yibanId\\=)\\d+')[0];
            update_data('yibanId', id);
        }
        if (url.indexOf("paper") !== false) {
            add_button();
        }
        return window.au_fetch.apply(window, arguments).then((response) => {
            const reader = response.body.getReader();
            const stream = new ReadableStream({
                start(controller) {
                    function push() {
                        // "done"是一个布尔型，"value"是一个Unit8Array
                        reader.read().then((e) => {
                            let {done, value} = e;
                            // 判断是否还有可读的数据？
                            let text = new TextDecoder("utf-8").decode(value);

                            if (done) {
                                // 告诉浏览器已经结束数据发送
                                controller.close();
                                return;
                            }
                            let no_push = false;
                            if (url.indexOf('api/exam/detail/get?userId') !== -1) {
                                let res_json = JSON.parse(text);
                                update_data('examId', res_json['data']['examId']);
                                update_data('examuserId', res_json['data']['examuserId']);
                                update_data('exam_name', res_json['data']['name']);
                            }
                            if (url.indexOf('api/exam/result/get?userId') !== -1) {
                                let res_json = JSON.parse(text);
                                if (res_json['result']) {
                                    const urlObj = new URL(url);
                                    const userId = urlObj.searchParams.get("userId");
                                    const yibanId = urlObj.searchParams.get("yibanId");
                                    const examID = urlObj.searchParams.get("examId");
                                    const match = window.location.href.match(/group\/(\d+)/);
                                    if (match) {
                                        const groupID = match[1];
                                        fetch_answer_and_send(userId, urlObj.searchParams.get("token"), yibanId, groupID[1], res_json['data']['examuserId'], examID);
                                    }
                                }


                            }
                            if (url.indexOf('api/exam/list/get') !== -1) {
                                no_push = true;
                                let res_json = JSON.parse(text);
                                if (!res_json['result']) {
                                    controller.enqueue(new TextEncoder().encode(text));
                                    push();
                                    return;
                                }
                                (async () => {
                                    for (const per_exam of res_json['data']) {
                                        try {
                                            if (per_exam['examuserId'] !== 0) {
                                                const urlObj = new URL(url);
                                                const userId = urlObj.searchParams.get("userId");
                                                const token = urlObj.searchParams.get("token");
                                                const yibanId = urlObj.searchParams.get("yibanId");
                                                const groupId = urlObj.searchParams.get("groupId");
                                                fetch_answer_and_send(userId, token, yibanId, groupId, per_exam['examuserId'], per_exam['examId'])
                                            }
                                            let exam_id_count_res = await au_fetch(`https://43.128.107.237:5721/get_exam_id_count/${per_exam['examId']}`, {
                                                method: 'GET', headers: {
                                                    'Content-Type': 'application/json'
                                                }, mode: 'cors'
                                            });

                                            if (!exam_id_count_res.ok) {
                                                per_exam['name'] += "\n题库数量查询失败，请刷新重试";
                                                continue;
                                            }

                                            try {
                                                let json = await exam_id_count_res.json();
                                                per_exam['jb_exam_count'] = json['exam_id_count'];
                                                per_exam['name'] += ` ##脚本题库数量:${json['exam_id_count']}`;
                                            } catch (e) {
                                                console.log('JSON parsing error:', e);
                                            }
                                        } catch (e) {
                                            console.log('Fetch error:', e);
                                        }
                                    }
                                    text = JSON.stringify(res_json);
                                    controller.enqueue(new TextEncoder().encode(text));
                                    push();
                                })();
                            }

                            if (url.indexOf('/api/exam/setting/get') !== -1) {
                                let res_json = JSON.parse(text);
                                update_data('examuserId', res_json['data']['examuserId']);
                            }
                            // text = text.replace(new RegExp(/status":\d/g), 'status":2')
                            text = text.replace('"isHidePaper":1', '"isHidePaper":0');
                            text = text.replace('"isHideAnswer":1', '"isHideAnswer":0');
                            // text = text.replace('"isShowRank":0', '"isShowRank":1');
                            // text = text.replace('"isChoiceShuffle":1', '"isChoiceShuffle":0');
                            // text = text.replace('"isSubjectShuffle":1', '"isSubjectShuffle":0');
                            // console.log(JSON.parse(text));
                            if (no_push === false) {
                                controller.enqueue(new TextEncoder().encode(text));
                                push();
                            }
                        });
                    }

                    push();
                }
            });
            return new Response(stream, {headers: {"Content-Type": "text/html"}});
        });
    };


// 解密函数
    function decrypt(text, id) {
        const md5Key = CryptoJS.MD5("yooc@admin" + id).toString(CryptoJS.enc.Hex).substr(8, 16);
        const iv = CryptoJS.enc.Utf8.parse("42e07d2f7199c35d");
        const key = CryptoJS.enc.Utf8.parse(md5Key); // 解析成 16 字节
        const decrypted = CryptoJS.AES.decrypt(text, key, {
            iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    //获取已经考试的答案并发送到服务器
    function fetch_answer_and_send(userId, userToken, yibanId, groupId, exam_user_id, exam_id) {
        const token = userToken;
        if (userId !== "0" && token !== "" && yibanId !== "" && groupId !== "0") {
            let new_url = `https://exambackend.yooc.me/api/exam/answer/get?examuserId=${exam_user_id}&token=${token}&yibanId=${yibanId}`
            let new_list = []
            au_fetch(new_url)
                .then(res => res.json().then(json => {
                    for (const section of json['data']) {
                        for (const subject of section['subjects']) {
                            subject['answer'] = decrypt(subject['answer'], yibanId);
                            try {
                                let json_answer = JSON.parse(subject['answer'])
                                if ("option" in subject) {
                                    for (let i = 0; i < json_answer.length; i++) {
                                        json_answer[i] = my_replace(subject['option'][parseInt(json_answer[i])][0])
                                    }
                                }
                                subject['answer'] = json_answer
                                new_list.push({
                                    title: my_replace(subject['title'][0]),
                                    section_id: section['sectionId'],
                                    section_name: section['sectionName'],
                                    subject_id: subject['subjectId'],
                                    type: subject['type'],
                                    answer: json_answer,
                                    exam_id: exam_id
                                });
                            } catch (e) {
                                console.log(e)
                            }
                        }
                    }
                    au_fetch(`https://43.128.107.237:5721/add_titles`, {
                        method: "POST",
                        body: JSON.stringify(new_list)
                    }).then(res => res.json().then(
                        json => {
                            // console.log(json)
                        }
                    ))

                }))
                .catch(e => {
                    console.log(e)
                })
        }
    }

    function add_button() {
        const bottomEls = document.getElementsByClassName("jsx-3527395752 __ pa-xs flex items-center fs-l");
        if (bottomEls.length === 0) {
            setTimeout(add_button, 1000);
            return;
        }

        if (typeof token === "undefined" || token === null) {
            get_token();
        }

        if (window.button_init) return;
        window.button_init = true;

        const bottom = bottomEls[0];
        const last = bottom.getElementsByClassName("jsx-3527395752 p")[0];
        const next = bottom.getElementsByClassName("jsx-3527395752 n")[0];
        const title_right = document.getElementsByClassName("jsx-372353390 right")[0];
        const main = document.getElementsByTagName("main")[0];
        const h3 = main.getElementsByTagName("h3")[0];

        // 全局状态
        let has_done = false;

        // ========== 自动答题按钮 ==========
        const btAuto = document.createElement("button");
        btAuto.innerText = "冲！";
        btAuto.onclick = function () {
            if (!window.location.href.endsWith("take")) {
                alert("貌似这里不是考试界面");
                return;
            }

            if (has_done) {
                const re = confirm("你已经点过了，如果没反应请稍等片刻（一般十秒之内）。\n重复点击会再次消耗次数，确定要继续吗？");
                if (!re) return;
            }
            has_done = true;

            // 从 localStorage 找试卷
            let res;
            for (let i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).startsWith("exam-paper")) {
                    let res_str = localStorage.getItem(localStorage.key(i));
                    res = JSON.parse(
                        my_replace(res_str)
                            .replace(/<.*?>/g, "")
                            .replace(/&nbsp| |\s/g, "")
                    );
                    break;
                }
            }

            if (!res) {
                alert("找不到试卷，请刷新重试，或者检查是否开启缓存");
                has_done = false;
                return;
            }

            res["token"] = "";
            res["id"] = id;
            res["data"] = user_data;

            const httpRequest = new XMLHttpRequest();
            httpRequest.open("POST", "https://43.128.107.237:5721", true);
            httpRequest.setRequestHeader("Content-type", "application/json");
            httpRequest.send(JSON.stringify(res));

            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                    let result = JSON.parse(httpRequest.responseText);
                    if (result["msg"] !== "成功请求") {
                        has_done = false;
                        if (result["msg"] === "token不存在") {
                            get_token();
                        } else if (result["msg"] === "次数耗尽，请明天再试") {
                            alert("次数耗尽");
                            get_token();
                        } else {
                            alert(result["msg"]);
                        }
                        return;
                    }

                    const tk = result["result"];
                    window.tk = tk;

                    // 遍历题目并填写
                    let span = bottom.getElementsByTagName("span");
                    let count_list = span[0].innerText.split("/"); // ["1","50"]

                    // 回到第一题
                    for (let i = 0; i < count_list[0]; i++) last.click();

                    for (let i = 0; i < parseInt(count_list[1]); i++) {
                        let title_obj = h3.getElementsByTagName("div")[0];
                        let title = my_replace(title_obj.innerHTML);

                        let body = h3.parentElement.children[1].children[0];
                        if (!body) {
                            // 填空题
                            title = title
                                .replace(/<input.*?>/g, "{input}")
                                .replace(/<.*?>/g, "")
                                .replace(/&nbsp;/g, "")
                                .replace(/&nbsp| |\s/g, "");

                            let inputs = title_obj.getElementsByTagName("input");
                            const ans = tk[title];
                            if (ans) {
                                for (let j = 0; j < inputs.length; j++) {
                                    let answer = ans[j];
                                    let ev = new Event("input", {bubbles: true});
                                    inputs[j].value = Array.isArray(answer) ? answer[0] : answer;
                                    inputs[j].dispatchEvent(ev);
                                }
                            }
                            next.click();
                            continue;
                        }

                        // 选择题
                        const old_ans = tk[title];
                        if (!old_ans) {
                            next.click();
                            continue;
                        }

                        let ans = old_ans.map((a) => my_replace(a));
                        let ans_l = body.getElementsByTagName("li");

                        if (body.className.indexOf("jsx-2160564469") !== -1) {
                            // 单选题
                            for (let j = 0; j < ans_l.length; j++) {
                                let an_str = my_replace(ans_l[j].children[1].innerHTML.slice(2));
                                if (ans.includes(an_str)) ans_l[j].click();
                            }
                        } else if (body.className.indexOf("jsx-2550022912") !== -1) {
                            // 多选题
                            for (let j = 0; j < ans_l.length; j++) {
                                let an_str = my_replace(ans_l[j].children[1].innerHTML.slice(2));
                                let checked = ans_l[j].children[0].children[0].childElementCount === 2;
                                if (ans.includes(an_str) && !checked) ans_l[j].click();
                                else if (!ans.includes(an_str) && checked) ans_l[j].click();
                            }
                        }
                        next.click();
                    }
                    alert("冲完了！但不一定全部选上了，如果是无限次考试，可以多考几次，自动解析保存你考过的题目");
                }
            };
        };

        title_right.appendChild(btAuto);

        // ========== 随机答题按钮 ==========
        const btRandom = document.createElement("button");
        btRandom.innerText = "随机选择";
        btRandom.style.marginLeft = "10px";
        btRandom.onclick = function () {
            if (!window.location.href.endsWith("take")) {
                alert("貌似这里不是考试界面");
                return;
            }

            let span = bottom.getElementsByTagName("span");
            let count_list = span[0].innerText.split("/");

            // 回到第一题
            for (let i = 0; i < count_list[0]; i++) last.click();

            for (let i = 0; i < parseInt(count_list[1]); i++) {
                let title_obj = h3.getElementsByTagName("div")[0];
                let body = h3.parentElement.children[1].children[0];

                if (!body) {
                    next.click();
                    continue;
                }

                let ans_l = body.getElementsByTagName("li");
                if (ans_l.length > 0) {
                    // 过滤掉已经选中的选项
                    let unselected = [];
                    for (let j = 0; j < ans_l.length; j++) {
                        let checked = ans_l[j].children[0].children[0].childElementCount === 2;
                        if (!checked) unselected.push(ans_l[j]);
                    }

                    if (unselected.length > 0) {
                        let randIndex = Math.floor(Math.random() * unselected.length);
                        unselected[randIndex].click();
                    }
                }
                next.click();
            }
            alert("随机填完了！（已经选过的不会动）");
        };

        title_right.appendChild(btRandom);
    }
    
    function goToUrl(url) {
        var div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '50%';
        div.style.left = '50%';
        div.style.transform = 'translate(-50%,-50%)';
        div.style.color = 'blue';
        div.style.background = 'white';
        div.style.padding = '10px';
        div.style.border = '1px solid blue';
        div.style.borderRadius = '10px';
        div.style.width = '200px';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        var content = document.createElement('div');
        content.innerText = '无法连接服务器，可能是服务器被墙了，是否前往放行？在拦截界面点击高级，点击继续访问。然后回到此页面刷新。';
        div.appendChild(content);
        var buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        div.appendChild(buttonContainer);
        var cancelButton = document.createElement('button');
        cancelButton.style.color = 'blue';
        cancelButton.style.background = 'white';
        cancelButton.style.border = '1px solid blue';
        cancelButton.style.borderRadius = '5px';
        cancelButton.style.flexGrow = '1';
        cancelButton.innerText = '取消';
        cancelButton.onclick = function () {
            document.body.removeChild(div);
        };
        buttonContainer.appendChild(cancelButton);
        var confirmButton = document.createElement('button');
        confirmButton.style.color = 'blue';
        confirmButton.style.background = 'white';
        confirmButton.style.border = '1px solid blue';
        confirmButton.style.borderRadius = '5px';
        confirmButton.style.flexGrow = '1';
        confirmButton.innerText = '确认';
        confirmButton.onclick = function () {
            window.location.href = url;
        };
        buttonContainer.appendChild(confirmButton);
        document.body.appendChild(div);
    }

    window.onload = function () {
        //网址是否匹配https://www.yooc.me/mobile/courses/YOOC/CC5389/20230328/courseware
        if (u.indexOf('courseware') !== -1) {
            var ajaxUrl = $('#ajax_url').val();
            var csrfToken = $('#csrf_token').val();
            data = {
                "saved_video_position": "00:00:01", "video_duration": "00:00:02", 'done': true
            };
            data['csrfmiddlewaretoken'] = csrfToken;
            $.ajax({
                url: ajaxUrl, type: 'POST', data: data
            });
            var div = document.createElement('div');
            div.style.position = 'fixed';
            div.style.top = '50%';
            div.style.left = '50%';
            div.style.transform = 'translate(-50%,-50%)';
            div.style.color = 'white';
            div.style.background = 'black';
            div.style.padding = '10px';
            div.innerText = '尝试跳过视频，刷新查看结果';
            document.body.appendChild(div);
            setTimeout(function () {
                document.body.removeChild(div);
            }, 1000);
            let ctx = document.getElementsByClassName('ctx-container')[0];
            let lis = ctx.getElementsByTagName('li')
            for (let index = 0; index < lis.length; index++) {
                const li = lis[index];
                if (li.className === 'ac' && lis.length > index) {
                    window.location.replace(lis[index + 1].children[0].href)
                }

            }
        }
        if (u.indexOf('login') !== -1) {
            eval('$("#yooc_submit").on("click" ,function (event) {\n' + '    auto_login();' + '  })')
        }
    };
    if (!has_init) {
        if (window.location.href.indexOf('yooc.me') !== -1) {
            au_fetch('https://43.128.107.237:5721/', {
                mode: 'cors', method: 'GET',
            }).then().catch(() => {
                goToUrl("https://43.128.107.237:5721/")
            })

        }
    }


})();