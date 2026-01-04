// ==UserScript==
// @name         2022年公需课刷课
// @namespace    https://greasyfork.org/
// @version      5.03
// @description  广东省教师继续教育信息管理平台公需课刷课
// @match        http*://jsxx.gdedu.gov.cn/*study/course/*
// @match        http*://jsglpt.gdedu.gov.cn/login*
// @icon         https://jsglpt.gdedu.gov.cn/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445917/2022%E5%B9%B4%E5%85%AC%E9%9C%80%E8%AF%BE%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/445917/2022%E5%B9%B4%E5%85%AC%E9%9C%80%E8%AF%BE%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
if (window.location.href.includes('jsglpt.gdedu.gov.cn/login')) {
    $("#userName").bind('input propertychange', () => {
        debugger;
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
    })
} else {
    setTimeout(function () {
        //502刷新页面
        if (document.title != '课程学习') {
            setTimeout(() => {
                console.log('页面加载失败，即将刷新页面');
                location.reload();
            }, 5000);
        }
        if (/.+\/study\/course\/progess/.test(window.location.pathname)) {
            if (document.querySelector('#progress')) {
                //进度100%
                if (document.querySelector('#progress').innerText.includes('100')) {
                    //考核100分
                    if (document.querySelector('span.get').innerText.includes('100')) {
                        alert("恭喜，你已完成该课程的所有内容");
                    } else {
                        [].slice.call(document.querySelectorAll('tbody tr td a')).filter(v => v.innerText.includes('考核')).shift().click();
                    }
                } else {
                    [].slice.call(document.querySelectorAll('tbody tr'))
                        .filter(v => v.innerText.includes('未完成')).shift().querySelector('a').click();
                }
            }
            return;
        }
        //进行考核
        if (document.querySelector('a.section.tt-s.z-crt').innerText == '考核') {
            if (handleTest() == '100') {
                window.location.href = document.querySelector('[item=progess] a').getAttribute('href');
                return;
            }
        }
        if (document.querySelector('.g-study-dt .g-study-prompt p').innerText.includes('您已完成观看')) {
            window.location.href = document.querySelector('[item=progess] a').getAttribute('href');
        }
        try {
            !player;
        } catch (e) {
            window.location.reload();
            return;
        }
        //静音
        player.videoMute();
        let errChecking = setInterval(function () {
            console.log('定时器存活');
            if (player.error) {
                console.log('视频加载出错，即将刷新页面');
                window.location.reload();
            }
            //自动关闭答题弹窗
            if (document.querySelector('.mylayer-layer')) {
                if (document.querySelector('.mylayer-layer .mylayer-title .title').innerText.includes('请作答')) {
                    if (document.querySelectorAll('.mylayer-layer .mylayer-loading').length > 0) {
                        return;
                    }
                    console.log('检测到题目弹窗，即将进行答题');
                    getAnswerList().forEach(v => document.querySelector('input[name=\'response\'][value=\'' + v + '\']').click());
                    finishTest();
                }
            }
            //播放完毕
            if (isComplete) {
                console.log('该课时已完成观看，正在跳转下一章节');
                window.location.href = document.querySelector('[item=progess] a').getAttribute('href');
                clearInterval(errChecking);
                return;
            }
            //暂停时自动开始播放
            if (player.V.paused) {
                console.log('视频已暂停，正在重启播放');
                player.videoPlay();
            }
        }, 1000)//错误自动刷新
    }, 1000);//延时1秒进行
}

//解决30分钟跳出，这里28分钟刷新
setTimeout(function () {
    localStorage.clear();
    window.location.reload();
}, 1680000);

function handleTest() {
    //有无分数
    let gradeEle = document.querySelector('.m-studyTest-grade strong');
    if (gradeEle != null) {
        //已经满分
        if (gradeEle.innerText == '100') {
            window.location.href = document.querySelector('[item=progess] a').getAttribute('href');
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