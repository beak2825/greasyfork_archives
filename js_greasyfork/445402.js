// ==UserScript==
// @name         广东省教师公需课::jsxx.gdedu
// @namespace    https://greasyfork.org/
// @version      2.5
// @description  广东省教师公需课
// @author       yonghui
// @match        http*://jsxx.gdedu.gov.cn/study/course/*
// @match        http*://jsxx.gdedu.gov.cn/*/study/course/*
// @icon         https://*.gdedu.gov.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/445402/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E5%85%AC%E9%9C%80%E8%AF%BE%3A%3Ajsxxgdedu.user.js
// @updateURL https://update.greasyfork.org/scripts/445402/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E5%85%AC%E9%9C%80%E8%AF%BE%3A%3Ajsxxgdedu.meta.js
// ==/UserScript==

var errChecking, viewMinuteFlag, viewMinuteStandMilis = new Date().getTime();
setTimeout(function () {
    //502刷新页面
    if (document.title != '课程学习') {
        console.log('页面加载失败，即将刷新页面')
        location.reload();
    }
 //   if(/https:\/\/jsxx.gdedu.gov.cn\/.*\/study\/course\/progess/.test(window.location.href)){
 //       if(document.querySelector('#progress')){
 //           if(document.querySelector('#progress').innerText.includes('100')){
 //               //alert("恭喜，你已完成该课程的所有内容")
  //              window.location.href = document.querySelector('[item=progess] a').getAttribute('href')
  //          }
 //       }
  //      return;
 //   }
    //进行考核
    if(document.querySelector('.txt').innerText.includes( '考核')){
        window.location.href = document.querySelector('[item=progess] a').getAttribute('href');
    }
    if(document.querySelector('a.section.tt-s.z-crt').innerText == '考核'){
        if(handleTest() == '100'){
            //if(nextChanger()){
                window.location.href = document.querySelector('[item=progess] a').getAttribute('href');
           // }
        }
    }
    try {
        !player;
    } catch (e) {
        goNext();
        return;
    }
    //静音
    player.videoMute();
    interval = 35;
    console.log('速率调整为35s，即35s=1min')
    console.log($.cookie('last_study_aid_0c61a9cd65c2486fa43c0b7757dbfb29_c_b898edfac2344887b59036cc3b738807', 'a_79db10297c574b4891e95d798d8faaf4|sc_8e1f8be7359942fdb2b645b064197f3d', { expires: 3600, path: '/' }));
    if (isComplete) {
        console.log('该课时已完成观看，正在跳转下一章节')
        //nextChanger();
        goNext()
        return;
    }
    player.V.onended = () => {
        if(!isComplete){
            console.log('视频播放完毕,未达到考核时长,正在回退到00:00')
            player.V.currentTime = 0;
        }
    }
    errChecking = setInterval(function () {
        //console.log('定时器存活');
        if(player.error){
            console.log('视频加载出错，即将刷新页面')
            location.reload();
        }
        //自动关闭答题弹窗
        if (document.querySelector('.mylayer-layer')) {
            if(document.querySelector('.mylayer-layer .mylayer-title .title').innerText.includes('请作答')){
                console.log('检测到题目弹窗，正在关闭弹窗并重启播放')
                console.log('题目内容：'+document.querySelector('.mylayer-layer').innerText)
                document.querySelector('.mylayer-closeico').click()
                player.videoPlay();
            }
        }
        if (document.querySelector('.mylayer-layer')) {
            if(document.querySelector('.mylayer-layer .mylayer-title .title').innerText.includes('提示')){
                console.log('检测到题目弹窗，正在关闭弹窗并重启播放')
                console.log('题目内容：'+document.querySelector('.mylayer-layer').innerText)
                document.querySelector('.mylayer-btn').click()
                player.videoPlay();
            }
        }
        //播放完毕
        if (isComplete) {
            console.log('该课时已完成观看，正在跳转下一章节')
            goNext();
            return;
        }
        //暂停时自动开始播放
        if (player.V.paused) {
            console.log('视频已暂停，正在重启播放')
            player.videoPlay();
        }
        let viewTimeTxtEle = document.querySelector('#viewTimeTxt')
        if(viewTimeTxtEle){
            let viewMinute = parseInt(viewTimeTxtEle.innerText);
            //初始化flag
            if(viewMinute >= 0){
                if(viewMinuteFlag == null || viewMinute > viewMinuteFlag){
                    viewMinuteFlag = viewMinute;
                    viewMinuteStandMilis = new Date().getTime();
                }else if(viewMinute == viewMinuteFlag){
                    if((new Date().getTime() - viewMinuteStandMilis)/1000 > 180){
                        console.log('已经间隔'+Math.floor((new Date().getTime() - viewMinuteStandMilis)/60000)+'分钟没有更新已观看时长了，正在发送更新请求');
                        location.reload();
                        //updateLastViewTime(true);
                    }
                }
            }
        }
    }, 1000)//错误自动刷新
}, 1000);//延时1秒进行

function nextChanger() {
    var learnlist = [].slice.call(document.querySelectorAll('[childsectionactivitieid]'))
        .filter(v =>
                //排除未完成
                v.querySelectorAll('i.u-state-ico.done').length == 0 &&
                //排除考核
                //v.innerText.indexOf('考核') == -1 &&
                //排除正在进行
                v.querySelectorAll('.z-crt').length == 0)
    if (learnlist.length > 0) {
        let next = learnlist[0].querySelector('a');
        if (next) {
            next.click()
            return false;
        }
    }
    if(learnlist.length == 0 && document.querySelector('a.section.tt-s.z-crt').innerText != '考核'){
        $('[childsectionactivitieid]:contains("考核") a')[0].click();
        return false;
    }
    if (errChecking) {
        clearInterval(errChecking);
    }
    return true;
}

function handleTest(){
    //有无分数
    gradeEle = document.querySelector('.m-studyTest-grade strong');
    if(gradeEle != null){
        //已经满分
        if(gradeEle.innerText.includes('100')){
          window.location.href = document.querySelector('[item=progess] a').getAttribute('href')
           return '100';
        }
       finishTest();
       window.location.href = document.querySelector('[item=progess] a').getAttribute('href')
        return;
    }
    //答案
    data = {
        "人工智能发展与产业应用": [
            "A", "A", "B", "B", "B",
            "A", "A", "B", "A", "A",
            "A", "B", "C", "B", "B",
            "B", "A", "A", "D", "B",
            "AC", "ABD", "ABCD", "ACD", "ACD",
            "AB", "ABCD", "ABCD", "BD", "ABC"
        ],
        "科技创新现状与发展趋势": [
            "A","A","B","B","A",
            "A","B","B","B","A",
            "B","A","A","A","C",
            "B","A","A","A","B",
            "ABC","ABCD","BCD","ABC","ABC",
            "ABD","ABC","ABCD","ABC","ABC"
        ],
        "新发展格局": [
            "C","C","C","D","A",
            "B","A","A","A","C",
            "ABCD","ABCD","ABCD","ABD","ABCD",
            "ABC","ABC","ABCD","ABC","ACD",
            "A","A","A","A","A",
            "A","B","B","A","B"
        ],
        "碳达峰": [
            "D","C","C","A","A",
            "B","C","D","A","A",
            "ACD","BDE","BCD","ABC","BCD",
            "ABD","ABCD","AC","ABCD","BD",
            "B","B","B","B","A",
            "A","B","A","B","A"
        ],
        "构建高水平": [
            "D","A","B","B","C",
            "C","D","B","C","D",
            "B","C","ABCD","ABCD","ABCD",
            "ABC","ABCD","ABCD","B","A",
            "A","A","A","A","A",
            "B","A","B","A","B"
        ],
        "中国式现代化": [
            "C","C","A","A","D",
            "A","C","A","C","A",
            "ABCD","ABCD","AB","ABCD","ABCD",
            "ABCD","ABCD","ACD","ABC","BCD",
            "B","A","B","A","A",
            "A","A","B","A","A"
        ]
    }
    map = {'A':0,'B':1,'C':2,'D':3,'E':4};
    if(document.querySelector('.sxtctl').innerText.includes('新发展格局')){
        answerArr=data['新发展格局'];
    }
    if(document.querySelector('.sxtctl').innerText.includes('碳达峰')){
        answerArr=data['碳达峰'];
    }
    if(document.querySelector('.sxtctl').innerText.includes('构建高水平')){
        answerArr=data['构建高水平'];
    }

    //let answerArr = data[document.querySelector('.g-course-catalog .sxtctl').innerText];
    //let testPageButton = $('[childsectionactivitieid]:contains("考核")')[0];
    $('.m-topic-item').each(function(index, queEle){
        answerArr[index].split('').forEach(ol =>{
            $(queEle).find('.m-question-lst span')[map[ol]].click()
        })
    })
    finishTest();
}
