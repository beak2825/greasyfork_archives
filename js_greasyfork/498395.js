// ==UserScript==
// @name         爱上学习掌上助手
// @namespace    http://greasyfork.org/
// @version      1.7
// @description  自动刷课、获取考试答案
// @author       Roc.w
// @match        http*://*.ishangstudy.com/*
// @icon         https://www.ishangstudy.com/Shared/favicon.ico
// @license      AGPL License
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498395/%E7%88%B1%E4%B8%8A%E5%AD%A6%E4%B9%A0%E6%8E%8C%E4%B8%8A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498395/%E7%88%B1%E4%B8%8A%E5%AD%A6%E4%B9%A0%E6%8E%8C%E4%B8%8A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//是否设置为全自动脚本，在课程包处自动刷课
const automatic = false;

init()


//初始化元素
function init() {
    //创建按钮元素
    craeateButtonElement()
    //创建消息提示元素
    craeateMsgElement()
    //位置判定
    if (automatic) {
        positionIf();
    }
    //解除文字不可复制
    removeCopyText();
}


//创建按钮元素
function craeateButtonElement() {
    let btnParam = {
        ele: document.createElement('div'),
        css: "display: flex;" +
            "cursor: pointer;" +
            "position: fixed;" +
            "right:40px;" +
            "top: 100px;" +
            "background: #aaa;" +
            "width: 50px;" +
            "height: 50px;" +
            "z-index:1000;" +
            "border-radius: 100%;",
        iconcss: "margin: auto;" +
            "width: 35px;" +
            "height: 35px;" +
            "line-height: 35px;" +
            "background: #fff;" +
            "animation:kite 5s infinite;" +
            "text-align: center;" +
            "font-size: 22px;" +
            "border-radius: 100%;"
    };

    document.querySelector('body').appendChild(((ele) => {
        ele.id = 'sloth-topic';
        // 添加允许拖拽属性
        ele.setAttribute('draggable', true)
        ele.innerHTML = '<div style="' + btnParam.iconcss + '">🎶🦥</div>';
        ele.style.cssText = btnParam.css;
        return ele;
    })(btnParam.ele));

    //动态创建keyframes动画
    //document.styleSheets[0].insertRule(`@keyframes kite{100%{transform:rotate(360deg);}}`,0)
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(`@keyframes kite{100%{transform:rotate(360deg);}}`));
    document.getElementById('sloth-topic').appendChild(style);
    // 拖拽事件
    document.getElementById('sloth-topic').addEventListener('dragend', function (e) {
        e.stopPropagation()
        const btn = document.getElementById('sloth-topic');
        if (e.target.style['right'] > 0) e.target.style['right'] = 0
        btn.style.cssText += btnParam.css + `left:${e.clientX}px;top:${e.clientY}px;`;
    });
    //按钮点击操作
    document.getElementById("sloth-topic").addEventListener("click", function () {
        start();
    });
}

//创建消息元素
function craeateMsgElement() {
    let msgParam = {
        ele: document.createElement('div'),
        css: "background: rgba(0,0,0,0.5);" +
            "position: fixed;" +
            "inset: 0px;" +
            "margin: auto;" +
            "padding: 10px;" +
            "border-radius: 5px;" +
            "color: #fff;" +
            "font-size: 14px;" +
            "letter-spacing: 1.5px;" +
            "display: none;" +
            "z-index: 99999;"
    };
    document.querySelector('body').appendChild(((ele) => {
        ele.id = 'sloth-msg';
        ele.innerHTML = '';
        ele.style.cssText = msgParam.css;
        return ele;
    })(msgParam.ele));
}

//消息提示
function msg(msg, timeout = 2500) {
    document.getElementById('sloth-msg').style.display = 'inline-table';
    document.getElementById('sloth-msg').innerHTML = msg;
    setTimeout(() => {
        document.getElementById('sloth-msg').style.display = 'none';
    }, timeout);
}

//psot请求
function postData(url, param, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                callback && callback(xhr.responseText);
            }
        }
    }
    xhr.open('POST', url, true);
    //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    //xhr.setRequestHeader('access-token', access_token);
    xhr.send(param);
}

/*************************一条华丽的分割线 业务代码块*****************************/

//位置判定
function positionIf() {
    var position = window.location.href;
    //课程包详情页
    if (position.indexOf('/member/pkglearn/detail') > -1) {
        console.log('当前位置：课程包详情页');
    }
    //课程详情页
    else if (position.indexOf('/member/zxcourse/detail') > -1) {
        console.log('当前位置：课程详情页');
        setTimeout(() => {
            console.log('保存课程记录');
            courseFinish().then(function () {
                console.log('准备完成课程');
                courseFinish().then(function () {
                    console.log('开始返航');
                    if (automatic) {
                        window.close()
                    }
                });
            })
        }, 500);
    }
}


//点击开始按钮
function start() {
    var position = window.location.href;
    //考试页面（需GPT回答）
    if (position.indexOf('/member/alonexam/exam') > -1 && position.indexOf('random') == -1) {
        gptExamination();
    }
    //考试页面(带答案类型)
    else if (position.indexOf('/member/alonexam/random_exam') > -1) {
        examination();
    }
    //题库刷题页面
    else if (position.indexOf('/member/zxstudy/study') > -1) {
        questionBankAnswer();
    }
    else {
        //学习页面
        if (automatic) {
            //课程包列表
            courseList();
        } else {
            //完成课程
            courseFinish()
        }
    }
}

//课程完成
function courseFinish() {
    let promise = new Promise(function (resolve, reject) {
        var courseid = $("#courseid").val();
        var gamelearnid = $("#gamelearnid").val();
        var pkglearnid = $("#pkglearnid").val();
        var offtcid = $("#offtcid").val();
        var current_time = $("#current_time").val();
        var video_duration = $("#video_duration").val();
        var startmarking = $("#start_stay_time").val();
        let fd = new FormData();
        fd.append("courseid", courseid);
        fd.append("gamelearnid", gamelearnid);
        fd.append("pkglearnid", pkglearnid);
        fd.append("offtcid", offtcid);
        fd.append("current_time", startmarking);
        fd.append("video_duration", video_duration);
        fd.append("startmarking", startmarking);

        //savereadingtime.html
        GM.xmlHttpRequest({
            method: 'POST',
            data: fd,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            url: 'https://www.ishangstudy.com/member/zxcourse/savereadingtime.html',
            onload: response => {
                var result = response;
                console.log("响应信息：", result);
                const parsedObject = JSON.parse(result.response);
                if (parsedObject.code == 1) {
                    msg("课程已完成");
                    completed();
                } else {
                    msg("响应错误：" + parsedObject.des);
                }
                resolve(result)
            }
        });
    })
    return promise;
}

//课程包列表
async function courseList() {
    var courses = $('.courseitem');
    for (let i = 0; i < courses.length; i++) {
        await (function () {
            let name = $(courses[i]).find('.sectioninfo')[0].className;
            if (name.indexOf('havepass') == -1) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        let tit = $(courses[i]).find('.sectioninfo')[0].innerText
                        console.log('正在进行 第' + (i + 1) + "项", tit)
                        let href = $(courses[i]).find('a')[0].href
                        $($(courses[i]).find('.sectioninfo')[0]).addClass("havepass")
                        resolve('打开新窗口进行完成作业')
                        window.open(href);
                    }, 500)
                })
            }
        }())
    }
}

//考试答案
function examination() {
    var formData = new FormData();
    let starttime = document.getElementById('starttime').value;
    formData.append('starttime', starttime);
    let eid = document.getElementById('eid').value;
    formData.append('eid', eid);
    let qid = document.getElementsByName('qid')[0].value;
    formData.append('qid', qid);
    let examid = document.getElementById('examid').value;
    formData.append('examid', examid);
    formData.append('aid[]', '111');
    var callback = function (res) {
        var data = JSON.parse(res);
        var vals = JSON.parse(data.info.val)
        console.log('答案：', vals)
        var inputs = document.querySelectorAll('input[name="aid[]"]');
        if (inputs.length > 0) {
            for (let i = 0; i < inputs.length; i++) {
                const id = inputs[i].value;
                if (vals.indexOf(id) != -1) {
                    inputs[i].click()
                }
            }
        }
        msg('答案获取成功');
    }
    postData('/member/alonexam/random_exam_save.html', formData, callback)
}


//题库答案
function questionBankAnswer() {
    var formData = new FormData();
    let id = document.getElementsByName('id')[0].value;
    formData.append('id', id);
    let courseid = document.getElementsByName('courseid')[0].value;
    formData.append('courseid', courseid);
    let qid = document.getElementsByName('qid')[0].value;
    formData.append('qid', qid);
    let min_duration = document.getElementById('min_duration').value;
    formData.append('min_duration', min_duration);
    let max_duration = document.getElementById('max_duration').value;
    formData.append('max_duration', max_duration);
    formData.append('aid[]', '111');
    var callback = function (res) {
        var data = JSON.parse(res);
        console.log('响应信息：', data)
        var vals = JSON.parse(data.info.val)
        console.log('答案：', vals)
        var inputs = document.querySelectorAll('input[name="aid[]"]');
        if (inputs.length > 0) {
            for (let i = 0; i < inputs.length; i++) {
                const id = inputs[i].value;
                if (vals.indexOf(id) != -1) {
                    inputs[i].click()
                }
            }
        }
        msg('答案获取成功');
    }
    postData('/member/zxstudy/studysave.html', formData, callback)
}

//完成进度条
function completed() {
    let charts = document.getElementsByClassName('charts')[0];
    charts.style.width = '100%';
    charts.children[0].textContent = '100%';
}

//题库答案
function questionBankAnswer() {
    var formData = new FormData();
    let id = document.getElementsByName('id')[0].value;
    formData.append('id', id);
    let courseid = document.getElementsByName('courseid')[0].value;
    formData.append('courseid', courseid);
    let qid = document.getElementsByName('qid')[0].value;
    formData.append('qid', qid);
    let min_duration = document.getElementById('min_duration').value;
    formData.append('min_duration', min_duration);
    let max_duration = document.getElementById('max_duration').value;
    formData.append('max_duration', max_duration);
    formData.append('aid[]', '111');
    var callback = function (res) {
        var data = JSON.parse(res);
        console.log('响应信息：', data)
        var vals = JSON.parse(data.info.val)
        console.log('答案：', vals)
        var inputs = document.querySelectorAll('input[name="aid[]"]');
        if (inputs.length > 0) {
            for (let i = 0; i < inputs.length; i++) {
                const id = inputs[i].value;
                if (vals.indexOf(id) != -1) {
                    inputs[i].click()
                }
            }
        }
        msg('答案获取成功');
    }
    postData('/member/zxstudy/studysave.html', formData, callback)
}

//ChatGPT考试
function gptExamination() {
    //获取问题及选项
    msg('AI正在获取答案...');
    const q_type = document.getElementById('q_type').innerText
    let q = "问题：" + document.getElementById('q_title').innerText + "（题型：" + q_type + '）';
    const items = document.getElementById("q_a_list").children;
    for (let i = 0; i < items.length; i++) {
        const firstChild = items[i];
        let spanText = '';
        if (q_type != '判断题') {
            spanText = firstChild.querySelector('span').textContent;;
        }
        const labelText = firstChild.querySelector('label').textContent;
        const outputText = spanText + labelText.replace(spanText, '').trim();
        q += "\n" + outputText + ';'
        const checkbox = firstChild.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.checked = false;
        }
    }
    console.log(q)
    aiQuestions(q, function (res) {
        var data = JSON.parse(res);
        console.log('ChatGPT：', data)
        const content = data.choices[0].message.content;
        console.log('本题答案：', content)
        const answers = content.split(',');
        for (let i = 0; i < items.length; i++) {
            const firstChild = items[i];
            if (q_type == '判断题') {
                const spanText = firstChild.querySelector('label').textContent;
                if (answers.indexOf(spanText) > -1) {
                    firstChild.querySelector('label').click()
                }
            } else {
                const spanText = firstChild.querySelector('span').textContent.substring(0, 1);
                if (answers.indexOf(spanText) > -1) {
                    firstChild.querySelector('span').click()
                }
            }
        }
        msg('AI答案获取成功：' + content);
    })
}

//AI ChatGPT答题
function aiQuestions(q, callback) {
    var xhr = new XMLHttpRequest();
    let param = JSON.stringify({
        "model": "gpt-4o",
        "messages": [{
            "role": "user",
            "content": q + "\n\n" + '请你一定必须只回答问题的答案选项ABCD即可，如果是多选题请用","分割答案。单选题请只回答一个答案，多选题应不只一个答案，判断题应只回答选项中的正确或错误。'
        }]
    });
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                callback && callback(xhr.responseText);
            }
        }
    }
    xhr.open('POST', 'https://api.aabao.top/v1/chat/completions', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('authorization', 'Bearer sk-eoeOaVxuZ0FwON9j2cB0A766A77e449e9495E9D982F5Aa27');
    xhr.send(param);
}

//解除文字不可复制
function removeCopyText(){
    document.onselectstart = null;
    document.oncopy = null;
    document.oncontextmenu = null;
    const style = document.createElement('style');
    style.innerHTML = `
  * {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
  }
`;
    document.head.appendChild(style);
}

