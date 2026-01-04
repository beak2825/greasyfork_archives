// ==UserScript==
// @name         南方教师网络培训学院中小学教师远程培训管理平台::nfjspx_gjsjmfs
// @namespace    https://greasyfork.org/
// @version      v1.0
// @description  南方教师网络培训学院::nfjspx_gjsjmfs
// @author       Cosil.C
// @match        http*://nfjspx.gjsjmfs.cn/*
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/430297-qos-handler/code/QOS-Handler.js
// @require      https://greasyfork.org/scripts/430439-randint-getter/code/RandInt-Getter.js
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/448481/%E5%8D%97%E6%96%B9%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD%E5%AD%A6%E9%99%A2%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%3A%3Anfjspx_gjsjmfs.user.js
// @updateURL https://update.greasyfork.org/scripts/448481/%E5%8D%97%E6%96%B9%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD%E5%AD%A6%E9%99%A2%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%3A%3Anfjspx_gjsjmfs.meta.js
// ==/UserScript==

if (qos.record()) {
    let timeout = new Date().getTime() + 300000;
    let reloadInterval = setInterval(() => {
        let secLeft = Math.floor((timeout - new Date().getTime()) / 1000);
        if (secLeft >= 0) {
            console.log('secLeft:', secLeft);
        } else {
            qos.clearRecord();
            clearInterval(reloadInterval)
            location.reload();
        }
    }, 1000);
    return;
}
init();

function init() {
    if (location.pathname.includes(`/nts/goLogin`)) {
        //登录页
        handleLogin();
    } else if (location.pathname.includes(`userCenter`)) {
        //课程中心
        handleUserCenter();
    } else if (location.pathname.includes(`/study/course/progess`)) {
        //学习进度
        handleProgress();
    } else if (location.pathname.includes(`/study/course/`)) {
        //学习页
        handleCourse();
    }
}

function handleLogin() {
    console.log('进入登录页');
}
function handleUserCenter() {
    console.log('进入课程中心');
}
function handleProgress() {
    console.log('进入学习进度');
}

function handleCourse() {
    console.log('进入学习页');
    //任务描述
    let promptDesc = document.querySelector(`.g-study-prompt`).innerText;
    if (promptDesc.includes('文档')) {
        //文档
        handleStudyDocument();
    } else if (promptDesc.includes('视频')) {
        //视频
        handleStudyVideo();
    } else if (promptDesc.includes('评论')) {
        //评论
        handleStudyComment();
    } else if (promptDesc.includes('作业')) {
        //作业
        handleStudyAssignment();
    }
}

function handleStudyDocument() {
    console.log('开始学习文档');
    let studyInterval = setInterval(() => {
        let promptTimesArr = Array.from(document.querySelectorAll(`.g-study-prompt span`)).map(v => parseInt(v.innerText)),
            target = promptTimesArr[0],
            progress = promptTimesArr[1];
        if (target <= progress) {
            clearInterval(studyInterval);
            nextAct();
        }
    }, 500);
}
function handleStudyVideo() {
    console.log('开始学习视频');
    if (document.querySelector(`.g-study-prompt`).innerText.includes('您已完成观看')) {
        nextAct();
        return;
    }
    varsInit('player', 'isComplete');
    let studyInterval = setInterval(() => {
        if (isComplete) {
            clearInterval(studyInterval);
            nextAct();
        } else {
            console.log('定时器存活');
            //已播放完毕
            if (player.error) {
                //错误刷新
                console.log('视频加载出错，即将刷新页面');
                setTimeout(() => { location.reload() }, 1000);
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
            //解决30分钟跳出，这里28分钟刷新
            setTimeout(function () {
                localStorage.clear();
                location.reload();
            }, 1680000);
        }
    }, 500);
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
}
function handleStudyComment() {
    console.log('开始学习评论');
    let promptTimesArr = Array.from(document.querySelectorAll(`.g-study-prompt span`)).map(v => parseInt(v.innerText)),
        target = promptTimesArr[0],
        progress = promptTimesArr[1];
    if (target <= progress) {
        nextAct();
    } else {
        //在本页随机选一个评论填充
        let commentArr = Array.from(document.querySelectorAll(`.cmt-dt`)).map(v => v.innerText);
        let sourceComment = commentArr[getRandInt(`[0,${commentArr.length}]`)];
        $('#postContent').val(sourceComment);
        savePost();
    }
}
function handleStudyAssignment() {
    console.log('正在跳过课程作业');
    nextAct();
}

function nextAct() {
    if (document.querySelector('.btn.next.disable')) {
        document.querySelector('[item=progess] a').click();
    } else {
        goNext();
    }
}

/**
 * 等待变量载入
 */
function varsInit() {
    if (!checkVars(Array.from(arguments), 10)) {
        location.reload();
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
