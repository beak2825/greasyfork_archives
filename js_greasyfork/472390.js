// ==UserScript==
// @name         🥇优学院小助手[改]（APP专版）|自动搜索|稳定维护|用过都说好
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  🆕上次更新：2023.08.04 优学院小助手[改]，目前用于仅限APP的试题搜索(非自动答题)，功能逐步完善中。
// @author       白山茶
// @match        https://*.ulearning.cn/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/472390/%F0%9F%A5%87%E4%BC%98%E5%AD%A6%E9%99%A2%E5%B0%8F%E5%8A%A9%E6%89%8B%5B%E6%94%B9%5D%EF%BC%88APP%E4%B8%93%E7%89%88%EF%BC%89%7C%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%7C%E7%A8%B3%E5%AE%9A%E7%BB%B4%E6%8A%A4%7C%E7%94%A8%E8%BF%87%E9%83%BD%E8%AF%B4%E5%A5%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/472390/%F0%9F%A5%87%E4%BC%98%E5%AD%A6%E9%99%A2%E5%B0%8F%E5%8A%A9%E6%89%8B%5B%E6%94%B9%5D%EF%BC%88APP%E4%B8%93%E7%89%88%EF%BC%89%7C%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%7C%E7%A8%B3%E5%AE%9A%E7%BB%B4%E6%8A%A4%7C%E7%94%A8%E8%BF%87%E9%83%BD%E8%AF%B4%E5%A5%BD.meta.js
// ==/UserScript==
(function() {
    const $version = GM_info.script.version.replaceAll('.',''),
        getCookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift(),
        $uid = JSON.parse(unescape(getCookie('USER_INFO'))).userId,
        $t = getCookie('token'),
        jsonpRequest = (url) => {
            return new Promise((resolve, reject) => {
                let div = $d.getElementById('jsonp');
                if (div == null) {
                let d = $d.createElement('div');
                d.id = 'jsonp';
                $d.getElementsByTagName('body')[0].appendChild(d);
                div = $d.getElementById('jsonp');
                } else {
                div.innerHTML = '';
                }
                let s = $d.createElement('script');
                s.src = url;
                div.appendChild(s);

                const checkResult = () => {
                if ($w.jsonpValue) {
                    let result = $w.jsonpValue;
                    $w.jsonpValue = false;
                    resolve(result);
                } else if (Date.now() - startTime >= 3000) {
                    resolve(false);
                } else {
                    setTimeout(checkResult, 100);
                }
                };
                const startTime = Date.now();
                checkResult();
            });
        },
        sleep = (interval)=>{
            return new Promise((success,fail)=>{
                setTimeout(success,interval);
            });
        };
    let $w = unsafeWindow,
        $l = $w.location.href,
        $d = $w.document;
    //页面匹配函数
    function checkAndExecute() {
        if($l.includes('/exam/')){
            //相似度匹配
            function similar(s, t, f) {
                if (!s || !t) {
                    return 0
                }
                if (s === t) {
                    return 100;
                }
                var l = s.length > t.length ? s.length : t.length;
                var n = s.length;
                var m = t.length;
                var d = [];
                f = f || 2;
                var min = function (a, b, c) {
                    return a < b ? (a < c ? a : c) : (b < c ? b : c)
                };
                var i, j, si, tj, cost;
                if (n === 0) return m
                if (m === 0) return n
                for (i = 0; i <= n; i++) {
                    d[i] = [];
                    d[i][0] = i;
                }
                for (j = 0; j <= m; j++) {
                    d[0][j] = j;
                }
                for (i = 1; i <= n; i++) {
                    si = s.charAt(i - 1);
                    for (j = 1; j <= m; j++) {
                        tj = t.charAt(j - 1);
                        if (si === tj) {
                            cost = 0;
                        } else {
                            cost = 1;
                        }
                        d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
                    }
                }
                let res = (1 - d[n][m] / l) * 100;
                return res.toFixed(f)
            }

            //正则处理
            function re_text(text) {
                text = text.replace(/<\/?.+?\/?>/g,'');
                text = text.replace(/\t/g, "");
                text = text.replace(/\n/g, "");
                text = text.replace(/\r/g, "");
                text = text.replace(/&.*?;/g, "");
                return $.trim(text.substr(0,text.length));
            }
            function checkForSecondPage() {
                var specialElement = $d.getElementsByClassName('user-name');
                return specialElement.length > 0;
            }
            function waitUntilSecondPage() {
                return new Promise((resolve, reject) => {
                    var intervalId = setInterval(function() {
                        if (checkForSecondPage()) {
                            clearInterval(intervalId);
                            resolve("PC");
                        } else {
                            console.log($d.getElementsByClassName('exam-tip-top'))
                            if ($d.getElementsByClassName('exam-tip-top').length > 0){
                                clearInterval(intervalId); 
                                resolve("APP");                           
                            } 
                        }
                    }, 1000); 
                });
            }  
            async function main(){
                let host = false,
                    pageType = '';
                await waitUntilSecondPage().then((value) =>{
                    pageType = value;
                })
                if (pageType == 'APP'){
                    let checkResult = await jsonpRequest('https://tk.fm90.cn/tk/api_jsonp.php?act=status&temp='+String(Date.now())+'&version='+$version);
                    if(checkResult !=='true'){
                        $d.body.innerHTML=checkResult;
                        return ;
                    }
                    let innerLogsHTML = `
                        <div class="exam-info">
                            <div class="title">
                            <i class="iconfont icon-moble_edit"></i>
                            <span>App端作答日志</span>
                            </div>
                            <div class="detail"><div class="time-item-wrapper app-logs"></div></div>
                        </div>
                        `,
                        appLogs = $d.getElementsByClassName('exam-info-wrapper')[0],
                        examId = $l.split('exam/')[1].split('?')[0];  
                    appLogs.insertAdjacentHTML('beforeend', innerLogsHTML);
                    let log = $d.createElement('div'),
                        s1 = $d.createElement('script'),
                        s2 = $d.createElement('script'),
                    logs = {
                        "logArry": [],
                        "addLog": function(str, color = "black",progress) {
                            let nowTime = new Date(),
                                nowHour = (Array(2).join(0) + nowTime.getHours()).slice(-2),
                                nowMin = (Array(2).join(0) + nowTime.getMinutes()).slice(-2),
                                nowSec = (Array(2).join(0) + nowTime.getSeconds()).slice(-2),
                                logElement = $d.getElementById('log'),
                                logStr = "";
                            this.logArry.push("<span class='index'>进度:</span><span class='mark_info' style='color: " + color + "'>[" + nowHour + ":" + nowMin + ":" +
                                nowSec + "] " + str + "</span><span class='tag in-progress'>"+ progress +"</span>");
                            for (let logI = 0, logLen = this.logArry.length; logI < logLen; logI++) {
                                logStr += this.logArry[logI] + "<br>";
                            }
                            logElement.innerHTML = logStr;
                            logElement.scrollTop = logElement.scrollHeight;
                        }
                    };
                    log.setAttribute('class', 'time-item app-logs');
                    log.id = 'log';
                    log.style.height = '200px';
                    log.style.overflowY = 'scroll'; 
                    $d.getElementsByClassName('app-logs')[0].appendChild(log);
                    s1.src = 'https://cdn.bootcdn.net/ajax/libs/layui/2.7.6/layui.js';s2.src = 'https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js';
                    $d.head.appendChild(s1);$d.head.appendChild(s2);
                    setTimeout(()=>{
                        $w.layer.alert('本脚本根据“ Miss. ”的脚本“优学院小助手”重制修改。<br>此脚本仅保有搜题功能,后续可能开发自动作答。<br>脚本目前免费使用，正在逐步完善功能，如有侵权请联系详情页面邮箱。<br>因对接三方题库有次数限制，所以后期答题可能会收费。', {icon: 6});
                    },500);
                    await sleep(2000)
                    let PaperInfo = await jsonpRequest('https://tk.fm90.cn/tk/api_jsonp.php?act=enter&uid='+ $uid +'&examid='+ examId +'&author='+$t),
                        paperParse = JSON.parse(PaperInfo);
                        console.log(paperParse)
                    if(paperParse['code']!==1)
                    logs.addLog('尝试进入APP失败','red','请检查');
                    else{
                        logs.addLog('开始APP考试','green','已打开');
                        let questionNum = paperParse['data'].length,
                            finishdQuestionNum = 0;
                        for(let questionElement of paperParse['data']){
                            let ansApp = await jsonpRequest('https://tk.fm90.cn/tk/api_jsonp.php?act=query&question='+ re_text(questionElement['title']) +'&type=' + questionElement['type'] + '&token='),
                                ansApps = ansApp.replace(/[\r|\n|\t]/g,""),
                                ctResult = JSON.parse(ansApps),
                                answer = ctResult['data'],
                                hasAnswer = false,
                                answerArray = answer[0].answer;
                                if(ctResult['code'!==1]){
                                    logs.addLog(questionElement['title'],'red','无答案(已回传服务器)');
                                }
                                else{
                                    logs.addLog(questionElement['title'],'',answerArray);
                                    hasAnswer = true
                                }
                            if(hasAnswer){
                                finishdQuestionNum++;
                            }
                            await sleep(2000);
                        }
                        logs.addLog('已关闭查询 - 总题目数:'+questionNum +' | 题库命中数:'+finishdQuestionNum,'green','搜索完毕');
                        
                    }
                    
                }
                else{
                    //pass pc页面
                }

                
            }
            main();
        }
        else if($l.includes('course/exam')){
            async function intercept() {
                const open = unsafeWindow.XMLHttpRequest.prototype.open;
                unsafeWindow.XMLHttpRequest.prototype.open = function () {
                    let url = arguments[1];
                    if (url && url.match(/\/student?/)) {
                        this.addEventListener('load', () => {
                            let data = JSON.parse(this.responseText);
                            console.log(data);

                            if (Array.isArray(data.examList)) {
                                data.examList.forEach(exam => {
                                    if (exam.examType === 2) {
                                        addAppButton(exam);
                                    }
                                });
                            }
                        });
                    } else {
                        console.log("未进入指定页面");
                    }
                    return open.apply(this, arguments);
                };
            }

            function addAppButton(exam) {
                const examNameElement = document.querySelector(`.exam-name[title="${exam.title}"]`);
                if (examNameElement) {
                    const examRow = examNameElement.closest('tr');
                    if (!examRow.querySelector('.app-button')) {
                        const examActionCell = examRow.querySelector('.exam-action-cell');
                        if (examActionCell) {
                            const appButton = document.createElement('button');
                            appButton.classList.add('button', 'button-blue-solid', 'app-button'); 
                            appButton.innerText = 'APP答题';

                            appButton.addEventListener('click', () => {
                                window.open(
                                    `https://utest.ulearning.cn/?v=${String(Date.now())}#/exam/${exam.examId}?mode=1&lang=zh`,
                                    "考试",
                                    "width=" +
                                    (window.screen.availWidth - 10) +
                                    ",height=" +
                                    (window.screen.availHeight - 30) +
                                    ",fullscreen=yes,toolbar=no,scrollbars=yes,resizable=no"
                                );
                            });
                            const startExamButton = examActionCell.querySelector('button[data-bind="text: $component.exam18nText.startExam"]');
                            if (startExamButton) {
                                examActionCell.insertBefore(appButton, startExamButton.nextSibling);
                            } else {
                                examActionCell.appendChild(appButton);
                            }
                        }
                    }
                }
            }
            $d.addEventListener("DOMContentLoaded", () => {
                intercept();
            });
           intercept();
        }
    }
    checkAndExecute();
    const intervalId = setInterval(() => {
        if ($w.location.href !== $l &&$w.location.href.includes('course/exam')) {
            $l = $w.location.href;
            checkAndExecute();
            //循环清除
            clearInterval(intervalId);
            console.log('refresh')
        }
    }, 100);
})();

