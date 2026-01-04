// ==UserScript==
// @name         易班考试
// @namespace    http://tampermonkey.net/
// @license Common
// @version      1.5.4
// @description  理论上所有选择题考试都可以用，需要加QQ获取token，但是只是为了防止滥用，不会收费，也不会发广告，请看下方的详细说明。
// @author       木木
// @match        *.yooc.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yooc.me
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/476571/%E6%98%93%E7%8F%AD%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/476571/%E6%98%93%E7%8F%AD%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let has_init = false;
    let tk;
    let id;
    let button_init = false;
    let user_data;

    //=========替换特殊字符防止匹配不上=======================
    window.my_replace = function my_replace(text) {
        text = text.replace(new RegExp(/ |	|\\t|\\r|\\n|<br>|<br\/>|&nbsp;|\s/g), "");
        return text;
    }

    const localStorage = window.localStorage;

    function set_value(key, value) {
        localStorage.setItem(key, value);
    }

    function get_value(key) {
        return localStorage.getItem(key);
    }


    localStorage.removeItem('examAnswersAtom');
    localStorage.removeItem('examTakePosAtom');

    // =========试卷的一些信息存储，包括易班id，cookie，考试名称===============
    user_data = JSON.parse(get_value('data') != null ? get_value('data') : '{}');

    function update_data(key, value) {
        user_data[key] = value;
        set_value('data', JSON.stringify(user_data));
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
        let t = prompt("21008253b8f4f4c9", token === null ? '' : token);
        if (t.length !== 16) {
            alert("长度不对");
            get_token();
        } else {
            token = t;
            set_value("token", token);
        }
    }

    let example = {
        382232: {
            exam_name: '',
            subjects: [
                {'题目': '答案'},
                {'题目': '答案'}
            ]
        },
    }


    /**
     * @fileoverview 提供文本（如JSON），使用JavaScript创建文件并下载文件
     * @author AcWrong
     * @param {string} textTowrite
     * @param {string} fileNameToSaveAs
     * @param {string} fileType
     */
    function saveTextAsFile(textTowrite, fileNameToSaveAs, fileType) {
        //提供文本和文件类型用于创建一个Blob对象
        let textFileAsBlob = new Blob([textTowrite], {type: fileType});
        //创建一个 a 元素
        let downloadLink = document.createElement('a');
        //指定下载过程中显示的文件名
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = 'Download File';
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        //模式鼠标左键单击事件
        downloadLink.click();
    }

    //将答案保存到本地
    function save_paper(obj) {
        const local_paper_str = get_value('local_paper');
        let local_paper = JSON.parse(local_paper_str != null ? local_paper_str : '{}');
        let now_subject = local_paper[user_data['examId']];
        if (now_subject === undefined) {
            local_paper[user_data['examId']] = {
                exam_name: user_data['exam_name'],
                subjects: obj['result'],
            }
        } else {
            let old = local_paper[user_data['examId']]['subjects'];
            let new_ = obj['result'];
            local_paper[user_data['examId']]['subjects'] = Object.assign(old, new_);
        }
        set_value('local_paper', JSON.stringify(local_paper));
        window.paper = local_paper;
    }

    function download_to_local() {
        const local_paper_str = get_value('local_paper');
        if (local_paper_str === null) {
            alert('本地没有保存有你的做题记录');
            return;
        }
        let local_paper = JSON.parse(local_paper_str);
        const exam_id_list = Object.keys(local_paper);

        for (const exam_id of exam_id_list) {
            let s = '';
            let exam_name = local_paper[exam_id]['exam_name'];
            const title_keys = Object.keys(local_paper[exam_id]['subjects']);
            for (const titleKey of title_keys) {
                s += "题目：" + titleKey + "\n答案：" + local_paper[exam_id]['subjects'][titleKey];
                s += '\n\n';
            }
            saveTextAsFile(s, exam_name + '.txt', 'text/plain')
        }
    }

    // ============判断当前页面链接，如果是电脑版则跳转到手机版=====================
    let u = window.location.href;

    if (u === ('https://www.yooc.me/')) {
        window.location.replace('https://www.yooc.me/mobile/yooc')
    }
    if (u.indexOf('group_name') !== -1) {
        update_data('group_name', decodeURI(u.slice(u.indexOf('group_name') + 11)));
    }
    if (u.startsWith('https://www.yooc.me/group/') && u.endsWith('topics')) {
        window.location.replace(u.replace('www', 'group').replace('topics', 'index'));
    }
    // =================劫持fetch方法========================================
    // =================监听并获取一些数据，以便服务器实现解密等功能================
    // =================修改返回值以达到查卷，禁止乱序等功能======================
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        const xhr = this;
        const getter = Object.getOwnPropertyDescriptor(
            XMLHttpRequest.prototype,
            "response"
        ).get;
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
                            if (js['data']['modules'][i]['module'].indexOf('exam')!==-1) {
                                js['data']['modules'][i]['url'] += '?' + 'group_name=' + user_data['group_name'];
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
                            if (url.indexOf('api/exam/detail/get?userId') !== -1) {
                                let res_json = JSON.parse(text);
                                update_data('examId', res_json['data']['examId']);
                                update_data('examuserId', res_json['data']['examuserId']);
                                update_data('exam_name', res_json['data']['name']);
                            }
                            text = text.replace('"isHidePaper":1', '"isHidePaper":0');
                            text = text.replace('"isHideAnswer":1', '"isHideAnswer":0');
                            text = text.replace('"isShowRank":0', '"isShowRank":1');
                            text = text.replace('"isChoiceShuffle":1', '"isChoiceShuffle":0');
                            text = text.replace('"isSubjectShuffle":1', '"isSubjectShuffle":0');
                            // console.log(JSON.parse(text));
                            controller.enqueue(new TextEncoder().encode(text));
                            push();
                        });
                    }

                    push();
                }
            });
            return new Response(stream, {headers: {"Content-Type": "text/html"}});
        });
    };

    function add_button() {
        if (!document.getElementsByClassName("jsx-3527395752 __ pa-xs flex items-center fs-l").length > 0) {
            setTimeout(function () {
                add_button();
            }, 1000);
            return;
        }
        if (token === null) {
            get_token();
            return;
        }
        if (button_init) return;
        button_init = true;
        let bottom = document.getElementsByClassName("jsx-3527395752 __ pa-xs flex items-center fs-l")[0];
        let last = bottom.getElementsByClassName("jsx-3527395752 p")[0];
        let next = bottom.getElementsByClassName("jsx-3527395752 n")[0];
        let title_right = document.getElementsByClassName("jsx-372353390 right")[0];
        let bt = document.createElement("button");
        bt.innerText = "冲！";
        let main = document.getElementsByTagName("main")[0];
        let h3 = main.getElementsByTagName("h3")[0];
        let has_done = false;
        bt.onclick = function () {
            if (!window.location.href.endsWith('take')) {
                alert('貌似这里不是考试界面');
                return;
            }
            if (has_done) {
                const re = confirm('你已经点过了，如果没反应请稍等片刻（一般在十秒钟之内）.重复点击会再次消耗，是否确定要再次消耗次数');
                if (!re) {
                    return;
                }
            }
            has_done = true;
            let res;
            // ===============在网页存储找到试卷并发送到服务器解密================
            for (let i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).startsWith("exam-paper")) {
                    let res_str = localStorage.getItem(localStorage.key(i));
                    res = JSON.parse(my_replace(res_str));
                    break;
                }
            }
            if (res === undefined) {
                alert("找不到试卷，请刷新重试，或者检查是否开启缓存");
                has_done = false;
                return;
            }
            res['token'] = token;
            res['id'] = id;
            res['data'] = user_data;
            const httpRequest = new XMLHttpRequest();
            httpRequest.open('POST', 'https://124.222.110.105:5721', true);
            httpRequest.setRequestHeader("Content-type", "application/json");
            httpRequest.send(JSON.stringify(res));
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                    let result = JSON.parse(httpRequest.responseText);
                    if (result['msg'] !== '成功请求') {
                        has_done = false;
                        if (result['msg'] === 'token不存在') {
                            get_token();
                        } else if (result['msg'] === '次数耗尽，请明天再试') {
                            alert('次数耗尽，请明天再试，或者输入新的token');
                            get_token();
                        } else {
                            alert(result['msg']);
                        }
                        return;
                    }
                    save_paper(result);
                    tk = result['result'];
                    window.tk = tk;
                    // console.log(result);
                    let span = bottom.getElementsByTagName("span");
                    let count_text = span[0].innerText;
                    let count_list = count_text.split("/");//目前题目位置1/50，分割之后为["1","50"]
                    for (let i = 0; i < count_list[0]; i++) {
                        //点回第一题
                        last.click();
                    }
                    for (let i = 0; i < parseInt(count_list[1]); i++) {
                        let title_obj = h3.getElementsByTagName("div")[0];
                        let title = my_replace(title_obj.innerHTML);

                        let body = h3.parentElement.children[1].children[0];
                        // =========如果body是空则不是选择题=====================
                        if (body === undefined) {
                            title = title.replace(new RegExp(/<input.*?>/g), "{input}").replace(new RegExp(/<.*?>/g), "");
                            let inputs = title_obj.getElementsByTagName('input');
                            const ans = tk[title];
                            for (let j = 0; j < inputs.length; j++) {
                                let answer = ans[j];
                                let ev = new Event('input', {bubbles: true});
                                ev.simulated = true;
                                inputs[j].value = (Array.isArray(answer) ? answer[0] : answer);
                                inputs[j].dispatchEvent(ev);
                            }
                            next.click();
                            continue;
                        }
                        //=====如果是填空题在上面的if已经continue了，所以下面的是选择题的代码====
                        const ans = tk[title];
                        let ans_l = body.getElementsByTagName("li");
                        //不是未初始化，说明返回的数据中有这个题目
                        if (ans !== undefined) {
                            //单选题，答案是哪个就点哪个就可以了
                            if (body.className.indexOf('jsx-2160564469') !== -1) {
                                for (let j = 0; j < ans_l.length; j++) {
                                    let an_str = my_replace(ans_l[j].children[1].innerHTML.slice(2));
                                    if (ans.indexOf(an_str) !== -1) {
                                        ans_l[j].click();
                                    }
                                }

                            } else if (body.className.indexOf('jsx-2550022912') !== -1) {//多选题需要判断有没有选对，没选对的取消勾选，对的没选的就选上
                                for (let j = 0; j < ans_l.length; j++) {
                                    let an_str = my_replace(ans_l[j].children[1].innerHTML.slice(2));
                                    if (ans.indexOf(an_str) !== -1 && ans_l[j].children[0].children[0].childElementCount === 2) {
                                        ans_l[j].click();
                                    } else if (ans.indexOf(an_str) === -1 && ans_l[j].children[0].children[0].childElementCount === 1) {
                                        ans_l[j].click();
                                    }

                                }
                            }

                        }
                        next.click();
                    }
                    alert('答题成功请检查后等待一段时间再交卷以免因为时长问题被发现');
                } else if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 0) {
                        alert('在解密过程中，向服务器发送原始试卷失败，可能是被浏览器拦截或者服务器故障，如果你是苹果设备请更换设备后再试。');
                    } else {
                        alert('发生错误，请进群691977572联系作者。服务器数据：' + httpRequest.responseText);
                    }

                }
            }
        };
        let bt2 = document.createElement('button');
        bt2.innerText = '导出';
        bt2.onclick = download_to_local;
        title_right.appendChild(bt);
        title_right.appendChild(bt2);
    }

    if (!has_init) {
        if (window.location.href.indexOf('yooc.me') !== -1) {
            const httpRequest = new XMLHttpRequest();
            httpRequest.open('GET', 'https://124.222.110.105:5721/', true);
            httpRequest.send();
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === 4 && httpRequest.status === 0) {
                    has_init = true;
                    alert('无法连接服务器，可能被拦截或者服务器down了，如果是苹果请更换安卓或Windows设备，如果是电脑端请访问https://124.222.110.105:5721/，在拦截界面点击高级，点击继续访问。然后回到此页面刷新。');
                }
            }
        }
    }
    // =============在进入考试之前判断是否能够连接服务器，连不上就提示用户========


})();
