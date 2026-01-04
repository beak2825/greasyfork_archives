// ==UserScript==
// @name         2021改2022广东省教师继续教育信息管理平台公需课刷课
// @namespace    https://greasyfork.org/
// @version      2022.6.1 修改减少页面刷新时间为8分钟
// @description  广东省教师继续教育信息管理平台公需课刷课
// @author       原作者Cosil.C
// @match        http*://jsxx.gdedu.gov.cn/*
// @match        https://jsglpt.gdedu.gov.cn/teacher/index.do
// @match        http*://jsglpt.gdedu.gov.cn/login*
// @icon         https://jsglpt.gdedu.gov.cn/favicon.ico
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/445589/2021%E6%94%B92022%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%85%AC%E9%9C%80%E8%AF%BE%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/445589/2021%E6%94%B92022%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%85%AC%E9%9C%80%E8%AF%BE%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

/**
 * jsxx.gdedu.gov.cn域名流控
 */
if (window.location.href.includes('jsxx.gdedu.gov.cn')) {
    let timestamp = new Date().getTime();
    let historyArr;
    try {
        historyArr = JSON.parse(sessionStorage.getItem('historyArr') || '[]');
    } catch (e) {
        sessionStorage.removeItem('historyArr');
        historyArr = [];
    }
    historyArr.push(timestamp);
    if (historyArr.length > 5) {
        let shift;
        do {
            shift = parseInt(historyArr.shift());
        } while (historyArr.length > 5);
        //8秒内访问了6次页面
        if (timestamp - shift <= 8000) {
            //中断脚本并在5分钟后刷新
            console.log(timestamp, shift, timestamp - shift);
            let timeout = new Date().getTime() + 300000;
            let reloadInterval = setInterval(() => {
                let secLeft = Math.floor((timeout - new Date().getTime()) / 1000);
                if (document.querySelector('button.mylayer-btn.type1') && secLeft >= 0) {
                    document.querySelector('button.mylayer-btn.type1').innerText = '等待' + ((secLeft - secLeft % 60) / 60) + ':' + (secLeft % 60) + '后的刷新';
                } else {
                    sessionStorage.removeItem('historyArr');
                    window.location.reload;
                }
            }, 1000);
            varsInit('mylayerFn');
            mylayerFn.btns({
                title: '不必惊慌，这里是脚本弹出的提醒',
                content: '检测到频繁的访问，可能会引起平台对您的拉黑，脚本将为您挂起5分钟',
                icon: 3,
                btns: [
                    {
                        content: '等待5:00后的刷新', type: 1, close: false, fn: function () {
                            return;
                        }
                    },
                    {
                        content: '忽略并继续使用脚本', type: 2, close: true, fn: function () {
                            clearInterval(reloadInterval);
                            sessionStorage.removeItem('historyArr');
                            init();
                        }
                    }
                ]
            });
            return;
        }
    }
    sessionStorage.setItem('historyArr', JSON.stringify(historyArr));
}
init();

/**
 * 执行入口
 */
function init() {
    if (window.location.href.includes('jsglpt.gdedu.gov.cn/login')) {
        //登录页
        console.log('准备执行登录页脚本');
        handleLogin();
    } else if (window.location.pathname.includes('courseRegister')) {
        //课程超市
        console.log('准备执行课程超市脚本');
        handleCourseRegister();
    } else if(/\/study\/course/.test(window.location.pathname)){
        if (window.location.pathname.includes('progess')) {
            //学习进度
            console.log('准备执行学习进度脚本');
            handleCourseProgress();
        }else{
            //视频页面
            console.log('准备执行视频页面脚本');
            handleCourseStudy();
        }
    }
}

/**
 * 登录页面
 */
function handleLogin() {
    $("#userName").bind('input propertychange', () => {
        // debugger;
        //纠正X输成x
        if ($("#userName").val().includes('x')) { $("#userName").val($("#userName").val().replaceAll('x', 'X')) }
        //身份证正则
        if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/.test($("#userName").val())) {
            loginJs.indexs.accountPopupHint({
                txt: "身份证格式不正确！"
            });
            return;
        }
        //隐藏报错气泡
        loginJs.indexs.PopupHintHide(document);
        //明文
        $('#password').removeAttr('type');
        //填充
        $('#password').val($("#userName").val().slice(-6) + '@Gd');
           return;
          setTimeout(function () {
          localStorage.clear();
          window.location.reload();
      }, 1000);
    })
}

/**
 * 在学课程页面
 */
function handleCourseRegister() {
    //本标签页跳转学习页面
    console.log('尝试点击开始学习');
    if ($('a:contains(\'开始学习\')').length) {
        window.location.href = $('a:contains(\'开始学习\')').attr('href');
    }else {
        console.log('请进行选课')
    }
}

/**
 * 学习进度页面
 */
function handleCourseProgress() {
    //更新缓存中的已学习章节
    let finishedCourseArr = JSON.parse(sessionStorage.getItem('finishedCourseArr') || '[]');
    Array.from(document.querySelectorAll('tbody tr td i.u-ico-finish'))
        .forEach(v => finishedCourseArr.push(v.parentElement.parentElement.querySelector('a').innerText.trim()));
    finishedCourseArr = distinctArr(finishedCourseArr);
    sessionStorage.setItem('finishedCourseArr', JSON.stringify(finishedCourseArr));
    if (document.querySelector('#progress')) {
        //全部学完
        if (finishedCourseArr.length == document.querySelectorAll('tbody tr a').length) {
            //考核100分
            if (document.querySelector('span.get').innerText.includes('100')) {
                alert("恭喜，你已完成该课程的所有内容");
            } else {
                $('tbody tr td a:(\'考核\')').click();
            }
        } else {
            //跳转去未完成的章节
            for (let i of Array.from(document.querySelectorAll('tbody tr a'))) {
                if (!finishedCourseArr.includes(i.innerText)) {
                    i.click();
                    return;
                }
            }
        }
    }
}

/**
 * 学习视频页面
 */
function handleCourseStudy() {
    //502刷新页面
    if (document.title != '课程学习') {
        setTimeout(() => {
            console.log('页面加载失败，即将刷新页面');
            location.reload();
        }, 5000);
    }
    //获取学习进度
    let finishedCourseArr = sessionStorage.getItem('finishedCourseArr');
    if (!finishedCourseArr) {
        //无缓存，跳转到学习进度进行进度缓存
        window.location.href = document.querySelector('[item=progess] a').getAttribute('href');
        return;
    } else {
        finishedCourseArr = JSON.parse(finishedCourseArr);
    }
    //进行考核
    if (document.querySelector('a.section.tt-s.z-crt').innerText == '考核') {
        if (handleTest() == '100') {
            window.location.href = document.querySelector('[item=progess] a').getAttribute('href');
            return;
        }
    }
    let playingInterval;
    varsInit('player', 'isComplete');
    checkCourseStatus();
    playingInterval = setInterval(function () {
        console.log('定时器存活');
        //已播放完毕
        if (checkCourseStatus()) {
            return;
        }
        if (player.error) {
            //错误刷新
            console.log('视频加载出错，即将刷新页面');
            setTimeout(function () { window.location.reload() }, 1000);
            return false;
        }
        //自动关闭答题弹窗
        if (document.querySelector('.mylayer-layer')) {
            if (document.querySelector('.mylayer-layer .mylayer-title .title').innerText.includes('请作答')) {
                if (document.querySelectorAll('.mylayer-layer .mylayer-loading').length > 0) {
                    return;
                }
                console.log('检测到题目弹窗，即将进行答题');
                getAnswerList().forEach(v => document.querySelector('input[name=\'response\'][value=\'' + v + '\']').click());
                varsInit('finishTest');
                finishTest();
                return;
            }
        }
        //强制静音
        if (player.volume) {
            player.videoMute();
        }
        //暂停时自动开始播放
        if (player.V.paused) {
            console.log('视频已暂停，正在重启播放');
            player.videoPlay();
        }
    }, 1000)

    //解决30分钟跳出，这里8分钟刷新
    setTimeout(function () {
        localStorage.clear();
        window.location.reload();
    }, 480000);

    /**
     * 查看章节观看状态
     */
    function checkCourseStatus() {
        //已完成
        if ($('.mylayer-content:contains(\'您已完成这个活动\')').length || $('.g-study-dt .g-study-prompt p:contains(\'您已完成观看\')').length || isComplete) {
            if (playingInterval) {
                clearInterval(playingInterval);
            }
            console.log('该课时已完成观看，正在跳转下一章节');
            nextCourse();
            return true;
        }
        return false;
    }

    /**
     * 视频题目弹窗相关
     */
    function getAnswerList() {
        let answerStr = eval(/(?<=if \()'.+'(?=\.includes\(','\))/.exec(finishTest.toString())[0]);
        let answerList = [];
        if (answerStr.includes(',')) {
            answerList = JSON.parse(answerStr);
        } else {
            answerList = [answerStr];
        }
        return answerList;
    }

    /**
     * 考核相关
     */
    function handleTest() {
        varsInit('finishTest');
        //有无分数
        let gradeEle = document.querySelector('.m-studyTest-grade strong');
        if (gradeEle != null) {
            //已经满分
            if (gradeEle.innerText == '100') {
                nextCourse();
                return '100';
            }
            finishTest();
            return;
        }
        //答案
        let data = {
            "碳达峰、碳中和的实现路径与广东探索专题": [
                'D','C','C','A','A',
                'B','C','D','A','A',
                'ACD','BDE','BCD','ABC','BCD',
                'ABD','ABCD','AC','ABCD','BD',
                'B','B','B','B','A',
                'A','B','A','B','A'
            ],
            "数字化转型与产业创新发展专题": [
                'C','C','C','D','A',
                'B','A','A','A','C',
                'ABCD','ABCD','ABCD','ABD','ABCD',
                'ABC','ABC','ABCD','ABC','ACD',
                'A','A','A','A','A',
                'A','B','B','A','B'
            ]
        }
        let map = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
        let answerArr = data[/(?<=\$\(\'\.topCourseName\'\)\.text\(\').*?(?=\')/.exec($('script:contains(\'.topCourseName\')').text())[0]];
        $('.m-topic-item').each(function (index, queEle) {
            answerArr[index].split('').forEach(op => {
                $(queEle).find('.m-question-lst span')[map[op]].click();
            });
        });
        finishTest();
    }

    function nextCourse() {
        //更新学习进度
        finishedCourseArr.push(document.querySelector('a.section.tt-s.z-crt').innerText.trim());
        sessionStorage.setItem('finishedCourseArr', JSON.stringify(distinctArr(finishedCourseArr)));
        //全部学完
        if (document.querySelectorAll('.section.tt-s').length == finishedCourseArr.length) {
            window.location.href = document.querySelector('[item=progess] a').getAttribute('href');
        }
        //跳转章节
        for (let i of Array.from(document.querySelectorAll('.section.tt-s'))) {
            if (!finishedCourseArr.includes(i.parentElement.innerText.trim())) {
                i.click();
                return true;
            }
        }
    }
}

/**
 * 数组去重
 */
function distinctArr(arr) {
    return Array.from(new Set(arr))
}

/**
 * 等待变量载入
 */
function varsInit() {
    if (!checkVars(Array.from(arguments), 10)) {
        window.location.reload();
    }
    async function checkVars(paramArr, retry) {
        return await new Promise(resolve => {
            if (retry <= 0) {
                resolve(false);
            }
            let failArr = [];
            paramArr.forEach(v => {
                try {
                    eval(v);
                    console.log(v + '加载成功')
                } catch (e) {
                    failArr.push(v);
                }
            });
            if (failArr.length > 0) {
                console.log(retry);
                setTimeout(function () {
                    resolve(checkVars(failArr, retry - 1));
                }, 500);
            } else resolve(true);
        })
    }
}