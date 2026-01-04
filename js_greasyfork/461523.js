// ==UserScript==
// @name         【高等继续教育网】【高等学历继续教育网络学习平台】自动刷课刷题
// @namespace    http://greasyfork.org/
// @version      1.4
// @description  【高等继续教育网】【高等学历继续教育网络学习平台】自动刷课刷题，请注意该脚本只适用于该网址：【.jxjypt.cn】
// @author       Roc.w
// @match        http*://*.jxjypt.cn/*
// @icon         https://www.jxjypt.cn/indexpage/images/icon.ico
// @license      AGPL License
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/461523/%E3%80%90%E9%AB%98%E7%AD%89%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E3%80%91%E3%80%90%E9%AB%98%E7%AD%89%E5%AD%A6%E5%8E%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E3%80%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%88%B7%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/461523/%E3%80%90%E9%AB%98%E7%AD%89%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E3%80%91%E3%80%90%E9%AB%98%E7%AD%89%E5%AD%A6%E5%8E%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E3%80%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%88%B7%E9%A2%98.meta.js
// ==/UserScript==

console.log('您已进入高等继续教育网')
console.log('欢迎使用树懒脚本! 联系作者:771185858@qq.com')
console.log('采用纯原生JS写法 高性能、高可用、高兼容!')

init()
var access_token = '';
let submitCount = 0;

//初始化元素
function init() {
    //创建按钮元素
    craeateButtonElement()
    //创建消息提示元素
    craeateMsgElement()
    //登录百度
    getBiduAccessToken('w6siyOoEdKPfGV8CO1nGlzUG', 'LlIru7D6ugGsr3xbX70ZYq4d2DaqMZ2U');
    //识别当前位置
    recognitionSite();
    //移除弹窗
    removeConfirm();
    //开始答题监听
    setStartClickMonitor();
    //自动展开答案
    zkjxs();
}

//自动展开答案
function zkjxs() {
    var zkjxs = document.getElementsByClassName('zkjx')
    for (let i = 0; i < zkjxs.length; i++) {
        zkjxs[i].click()
    }
}

//识别位置
function recognitionSite() {
    //初始化未答题(不在试卷页面)
    //初始化重新答题(不在试卷页面)
    let path = document.location.pathname;
    if (path != '/paper/start') {
        console.log('-----初始化localStorage缓存------')
        window.localStorage.setItem('is-it-ongoing', 0)
        window.localStorage.setItem('is-again', 0)
    }
    var courses = document.getElementsByClassName('z-gery-icon');
    if (courses.length > 0) {
        msg('您已进入课程学习目录，请点击按钮进行观看学习视频并课后答题', 3000)
    }
    var zkjxs = document.getElementsByClassName('zkjx');
    if (zkjxs.length > 0) {
        msg('您已进入课程作业试卷，请点击按钮进行作答并提交试卷', 3000)
        setTimeout(() => {
            let isAgain = window.localStorage.getItem('is-again')
            console.log('是否重答答题：',isAgain)
            if (isAgain == 0) {
                answer();
            }
        }, 1000);
    }
}

//开始答题监听
function setStartClickMonitor() {
    var zts = document.getElementsByClassName("zt zt-goto");
    if (zts.length == 0) {
        return;
    }
    let tablecon = document.getElementsByClassName("lo-tablecon")[0];
    tablecon.onclick = function (event) {
        if (event.target.text == '重答') {
            console.log('-----点击重答答题------')
            window.localStorage.setItem('is-again', 1)
        }
        if (event.target.className == 'zt zt-goto') {
            event.target.style.backgroundColor = 'red'
        }
    }
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

//获取图片Base64
function getBase64(imgUrl) {
    window.URL = window.URL || window.webkitURL;
    var xhr = new XMLHttpRequest();
    xhr.open("get", imgUrl, true);
    // 至关重要
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (this.status == 200) {
            var blob = this.response;
            let oFileReader = new FileReader();
            oFileReader.onloadend = function (e) {
                let base64 = e.target.result;
                return base64;
            };
            oFileReader.readAsDataURL(blob);
        }
    }
    xhr.send();
}

//base64转urlencode
function getUrlencode(str) {
    str = (str + '').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
};

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
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.send(param);
}

/*************************一条华丽的分割线 业务代码块*****************************/

//获取百度 Access Token
function getBiduAccessToken(apiKey, secretKey) {
    GM.xmlHttpRequest({
        method: 'POST',
        url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + apiKey + '&client_secret=' + secretKey,
        onload: response => {
            var result = JSON.parse(response.response)
            access_token = result.access_token
            console.log('access_token---' + access_token)
        }
    });
}

//百度识图
function getBiduBasic(urlencode) {
    new Promise(function (res, rej) {
        GM.xmlHttpRequest({
            method: 'POST',
            url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=' + access_token + '&image=' + urlencode,
            onload: response => {
                var result = JSON.parse(response.response)
                var answer = result.words_result[0].words.split('：')[1]
                res(answer)
            }
        });
    })
}

//点击开始按钮
function start() {
    let path = document.location.pathname;
    //课程作业--作业答题列表
    if (path == '/classroom/exercise') {
        exercise();
    }
    //课程首页--视频学习
    else if (path == '/classroom/start') {
        watch();
    }
    //试卷答题
    else if (path == '/paper/start') {
        answer();
    }
}

//课程作业--作业答题列表
function exercise() {
    const list = $(".zt-goto:contains('开始答题')");
    let index = 0;
    function clickAndContinue() {
        let isOngoing = window.localStorage.getItem("is-it-ongoing");
        if (isOngoing == 0 && index < list.length) {
            console.log('正在进行第：'+(index+1))
            window.localStorage.setItem("is-it-ongoing", 1);
            list[index].style.backgroundColor = 'red'
            list[index].focus();
            openNewWindow(list[index].href)
            // 等待isOngoing变为0再执行下一个
            waitForOngoing().then(() => {
                index++;
                clickAndContinue();
            });
        }
    }
    function waitForOngoing() {
        return new Promise(resolve => {
            // 检查isOngoing的值
            function checkOngoing() {
                let isOngoing = window.localStorage.getItem("is-it-ongoing");
                console.log('正在第'+(index+1)+'项 检查isOngoing的值：' + isOngoing)
                if (isOngoing != 0) {
                    setTimeout(checkOngoing, 3000);
                } else {
                    resolve();
                }
            }
            checkOngoing();
        });
    }
    clickAndContinue();
}

function openNewWindow(url) {
    setTimeout(() => {
         const newWindow = window.open(url, "_blank");
         newWindow.onload = function () {
             setTimeout(() => {
                 document.getElementsByClassName('zt-goto')[0].focus();
             }, 1000);
         };
    }, 5000);
}

//观看课程
async function watch() {
    var courses = document.getElementsByClassName('z-gery-icon');
    if (courses.length == 0) {
        return;
    }
    for (let i = 0; i < courses.length; i++) {
        await (function () {
            return new Promise(function (resolve, reject) {
                //点击左侧导航栏
                courses[i].click();
                console.log('正在进行第1步', '点击左侧导航栏')
                resolve('正在进行第1步');
            }).then(() => {
                //等待加载完成后点击展开解析
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('正在进行第2步', '等待加载完成后点击展开解析')
                        var jid = courses[i].getAttribute('data-jie-id');
                        if (jid) {
                            document.getElementsByClassName('zkjx')[0].click()
                        }
                        resolve('正在进行第2步')
                    }, 500)
                })
            }).then(() => {
                //获取答案图片地址并转为base64
                return new Promise((resolve, reject) => {
                    console.log('正在进行第3步', '获取答案图片地址并转为base64')
                    var jid = courses[i].getAttribute('data-jie-id');
                    if (jid) {
                        var imgUrl = document.getElementsByClassName('solution')[0].children[0].src;
                        window.URL = window.URL || window.webkitURL;
                        var xhr = new XMLHttpRequest();
                        xhr.open("get", imgUrl, true);
                        // 至关重要
                        xhr.responseType = "blob";
                        xhr.onload = function () {
                            if (this.status == 200) {
                                var blob = this.response;
                                let oFileReader = new FileReader();
                                oFileReader.onloadend = function (e) {
                                    let base64 = e.target.result;
                                    resolve(base64)
                                };
                                oFileReader.readAsDataURL(blob);
                            }
                        }
                        xhr.send();
                    } else {
                        resolve('正在进行第3步')
                    }
                })
            }).then(function (base64) {
                return new Promise((resolve, reject) => {
                    var jid = courses[i].getAttribute('data-jie-id');
                    if (jid) {
                        //创建画布
                        var canvas = document.createElement('canvas');
                        var context = canvas.getContext("2d");
                        //创建图片
                        var img = new Image();
                        img.src = base64;
                        img.addEventListener("load", function () {
                            // 绘制图片到canvas上
                            canvas.width = img.width;
                            canvas.height = img.height;
                            context.drawImage(img, 0, 0);
                            // 将canvas的透明背景设置成白色
                            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                            for (var i = 0; i < imageData.data.length; i += 4) {
                                // 当该像素是透明的，则设置成白色
                                if (imageData.data[i + 3] == 0) {
                                    imageData.data[i] = 255;
                                    imageData.data[i + 1] = 255;
                                    imageData.data[i + 2] = 255;
                                    imageData.data[i + 3] = 255;
                                }
                            }
                            context.putImageData(imageData, 0, 0);
                            var dataUrl = canvas.toDataURL("image/jpeg");
                            resolve(dataUrl)
                        })
                    } else {
                        resolve('正在进行第4步')
                    }
                })
            }).then(function (base64) {
                //通过百度识图获取答案详情
                return new Promise((resolve, reject) => {
                    console.log('正在进行第5步', '通过百度识图获取答案详情')
                    var jid = courses[i].getAttribute('data-jie-id');
                    if (jid) {
                        //var urlencode = getUrlencode(base64);
                        var fd = new FormData();
                        fd.append("access_token", access_token);
                        fd.append("image", base64);
                        GM.xmlHttpRequest({
                            method: 'POST',
                            url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic',
                            responseType: 'json',
                            data: fd,
                            onload: response => {
                                var result = response.response
                                console.log('百度识图结果：', result)
                                if (result.error_code == 17) {
                                    return msg('百度识图API Key 已达到最大次数限制', 5000);
                                }
                                var answer = result.words_result[0].words.split('：')[1]
                                resolve(answer)
                            }
                        });
                    } else {
                        resolve('正在进行第5步')
                    }
                })
            }).then(function (answer) {
                //提交答案完成作答
                return new Promise((resolve, reject) => {
                    console.log('正在进行第6步', '提交答案完成作答')
                    var jid = courses[i].getAttribute('data-jie-id');
                    if (jid) {
                        var pid = document.getElementsByClassName('sub-content m-question')[0].getAttribute('data-pid');
                        var qid = document.getElementsByClassName('sub-content m-question')[0].getAttribute('data-qid');
                        var sid = document.getElementsByClassName('sub-content m-question')[0].getAttribute('data-sid');
                        var param = 'sid=' + sid + '&jid=' + jid + '&qid=' + qid + '&pid=' + pid + '&answer=' + answer + ''
                        console.log('答案：', param)
                        var callback = function (data) { console.log('已完成作答') }
                        postData('/classroom/question/submit', param, callback)
                    }
                    resolve('正在进行第6步')
                })
            })
        }())
    }
    if (courses.length > 0) {
        location.reload()
    }
}

//作业答题
async function answer() {
    //重置自动提交次数
    submitCount = 0;
    var index = 0;
    //选择题、简单题等自动答题
    var choices = document.getElementsByClassName('sub-content')
    for (let i = 0; i < choices.length; i++) {
        await (function () {
            //百度识图获取答案并点击选择
            try {
                var answers = $(choices[i]).find('.solution').html().split('：')[1].replace('\n答案解析', "");
                var items = document.getElementsByClassName('sub-content')[i].getElementsByClassName('sub-answer').length;
                //选择题判断题
                if (items > 0) {
                    var options = document.getElementsByClassName('sub-content')[i].getElementsByClassName('sub-answer')[0].children
                    for (let j = 0; j < options.length; j++) {
                        var val = options[j].getAttribute('data-value').toUpperCase();
                        for (let k = 0; k < answers.length; k++) {
                            if (answers[k] == val) {
                                options[j].click()
                            }
                            if (answers[k] == '对' || answers[k] == '错') {
                                if (answers[k] == '对' && val == '正确') {
                                    options[j].click()
                                }
                                if (answers[k] == '错' && val == '错误') {
                                    options[j].click()
                                }
                            }
                        }
                    }
                    console.log('已完成作答 第' + (i + 1) + '题', answers)
                } else {
                    //填空简答题
                    let solu = $(choices[i]).find('.solution').html();
                    if (solu.indexOf('答案解析') > -1) {
                        const answerRegex = /参考答案：([\s\S]+?)答案解析/;
                        const match = answerRegex.exec($(choices[i]).find('.solution').html());
                        document.getElementsByClassName('sub-content')[i].getElementsByClassName('e__textarea')[0].value = match[1];
                    } else {
                        document.getElementsByClassName('sub-content')[i].getElementsByClassName('e__textarea')[0].value = answers;
                    }
                    console.log('已完成作答 第' + (i + 1) + '题', answers)
                }
                index++;
            } catch (error) {
                msg('发现错误，请主动处理！  第' + (i + 1) + '题')
            }
        }())
    }
    //自动提交试卷
    submitQuestionnaire(index);

}

//自动提交试卷
function submitQuestionnaire(index) {
    //自动提交次数+1
    submitCount++;
    if (submitCount > 3) {
        window.close();
        return;
    }
    //自动提交试卷
    var choices = document.getElementsByClassName('sub-content')
    var courses = document.getElementsByClassName('z-gery-icon');
    if (courses.length == 0 && choices.length > 1) {
        setTimeout(() => {
            if (choices.length > 0 && index == choices.length) {
                window.confirm = () => { return true }
                document.getElementById('btn_submit').click()
                var imgUrl = document.getElementById('kaptcha_img').src
                new Promise(function (resolve, reject) {
                    window.URL = window.URL || window.webkitURL;
                    var xhr = new XMLHttpRequest();
                    xhr.open("get", imgUrl, true);
                    xhr.responseType = "blob";
                    xhr.onload = function () {
                        if (this.status == 200) {
                            var blob = this.response;
                            let oFileReader = new FileReader();
                            oFileReader.onloadend = function (e) {
                                let base64 = e.target.result;
                                resolve(base64)
                            };
                            oFileReader.readAsDataURL(blob);
                        }
                    }
                    xhr.send();
                }).then(function (base64) {
                    //var urlencode = getUrlencode(base64);
                    var fd = new FormData();
                    fd.append("access_token", access_token);
                    fd.append("image", base64);
                    GM.xmlHttpRequest({
                        method: 'POST',
                        //url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic',
                        url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic',
                        responseType: 'json',
                        data: fd,
                        onload: response => {
                            var result = response.response
                            var answer = '8888';
                            if (result.words_result[0]) {
                                answer = result.words_result[0].words;
                            }
                            document.getElementById('kap_input').value = answer;
                            document.getElementsByClassName('layui-layer-btn0')[0].click()
                            //当验证码输入不正确时
                            setTimeout(() => {
                                let laybtn = $('.layui-layer-btn0').length
                                if (laybtn == 2) {
                                    //关闭确认错误验证码
                                    $('.layui-layer-btn0')[1].click()
                                    //清空图片验证码，重新输入
                                    document.getElementById('kap_input').value = ''
                                    //递归提交
                                    setTimeout(() => {
                                        submitQuestionnaire(index)
                                        console.log('正在重新识别验证码，提交中...');
                                    }, 1000);
                                } else {
                                    console.log('---------本试卷答题完成---------');
                                    //window.localStorage.setItem('is-it-ongoing', 0)
                                    $('.layui-layer-btn0')[0].click()
                                }
                            }, 500);
                        }
                    });
                })
            } else {
                msg('检测到有未完成的答题，请手动作答后提交试卷', 5000)
            }
        }, 1000);
    }
}

//移除弹窗
function removeConfirm() {
    const script = document.createElement('script');
    script.innerText = 'window.confirm = () => {return true;}';
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script)
    console.log('window.confirm弹窗移除成功')
}
