// ==UserScript==
// @name         芯位网课刷课助手
// @version      1.2.5
// @description  自动下一集，自动答题（暂时下线，推荐安装"题海 x 划词搜题"脚本进行搜题），自动静音，(脚本有视频讲解) 完成课程设定进度百分比后自动下一集（节约时间）
// @match        https://teaching.51xinwei.com/*
// @icon         https://teaching.51xinwei.com/*
// @grant        none
// @author       CoderWyh
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @run-at document-end
// @license AGPL-3.0 license
// @namespace https://greasyfork.org/users/797839
// @downloadURL https://update.greasyfork.org/scripts/455181/%E8%8A%AF%E4%BD%8D%E7%BD%91%E8%AF%BE%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/455181/%E8%8A%AF%E4%BD%8D%E7%BD%91%E8%AF%BE%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==



(function() {
    'use strict';
    init()
    //window.onhashchange=function(event){
        //if (getLearnType()) {
            //if ($('.mainInfo').length==0) {
                //addClick()
           // }
       // }else {
            //$('.autoSet').remove()
            //$('.mainInfo').remove()
            //$('.outer').remove()
        //}
    //}
    const body = document.querySelector('body');
    let obServer = new MutationObserver(handler);
    const options = {
        childList: true
    }
    obServer.observe(body, options)

})();


function searchAnswer() {
    let questionApi = 'http://cx.icodef.com/wyn-nb?v=4'
    let title = $('#titleIpt').val().trim()
    axios({
        method: 'post',
        url: questionApi,
        data: 'question=' + title,

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then(function (res) {
        if (res.data.code==1) {
            $('#answerBody').html('答案：' + res.data.data)
        }else{
            if (res.data.data.indexOf('李恒雅忙不过来啦,触发流控限制')!=-1) {
                $('#answerBody').html('搜题速度太快啦，受不了啦，请间隔至少一秒以上~')
            }else {
                $('#answerBody').html('抱歉，这道题我也不会，可以尝试只搜题目的一部分，如果一直不行就只能自己做了')
            }
        }
    }
           )

}


function autoHomeWork() {
    let questions = []
    let questionApi = 'http://cx.icodef.com/wyn-nb?v=4'
    let answers = []

    document.querySelectorAll('.topic-title').forEach(item => {
        questions.push(item.innerText)
    })
    formatQuestion(questions)
    if (questions.length<1) {
        warning_prompt("该作业不支持自动完成，请自行完成",1500)
        document.getElementsByClassName("mainInfo").item(0).style.display = 'none'
        return
    }else {
        for (let i = 0;i<questions.length;i++) {
            if (i==questions.length - 1) {
                setTimeout(()=>{axios({
                    method: 'post',
                    url: questionApi,
                    data: 'question=' + questions[i],

                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }).then(function (res) {
                    if (res.data.code==1) {
                        answers[i] = res.data.data
                    }else {setTimeout(()=>{
                        axios({
                            method: 'post',
                            url: questionApi,
                            data: 'question=' + questions[i].substring(0,questions[i].length-4),

                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            }
                        }).then(function (res) {
                            if (res.data.code==1) {
                                answers[i] = res.data.data
                            }
                        })},600)
                          }
                })
                                setAnswer(answers)
                                document.getElementsByClassName("mainInfo").item(0).style.display = 'none'
                               },i*1000)
            }else {
                setTimeout(()=>{axios({
                    method: 'post',
                    url: questionApi,
                    data: 'question=' + questions[i],

                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }).then(function (res) {
                    if (res.data.code==1) {
                        answers[i] = res.data.data
                    }else {setTimeout(()=>{
                        axios({
                            method: 'post',
                            url: questionApi,
                            data: 'question=' + questions[i].substring(0,questions[i].length-4),

                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            }
                        }).then(function (res) {
                            if (res.data.code==1) {
                                answers[i] = res.data.data
                            }
                        })},600)
                          }
                })},i*700)
            }
        }
    }
}

function setAnswer(answers) {
    let answerAll = []
    let tmp = $(".topic-title").siblings()
    for (let i=0;i<tmp.length;i++){
        answerAll[i] = []
        for (let j=0;j<tmp.get(i).children.length;j++){
            answerAll[i].push(tmp[i].children[j].children[0].children[1])
        }
    }
    answers.forEach((item,index)=>{
        answerAll[index].forEach((item2,index2,self2)=>{
            if (item2.innerText.trim().indexOf(item)!=-1) {
                item2.click()
            }
        })
    })
    success_prompt("答题完成，请检查无误后手动点击提交",1500)
}


function init() {

    $('head').append('<script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>');
    $('head').append('<script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>');
    const style = `
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: consolas;
        }
            .outer{
                position: fixed;
                top: 25%;
                right: 20%;
                border-radius: 50%;
                color: #999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                cursor: pointer;
                z-index: 9;
            }
            .core {
                position: fixed;
            }
            .searchBox{
                position: relative;
                width: 65px;
                height: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: 0.5s;
        }
            .searchBox:hover{
            width: 400px !important;
        }
            .searchBox::before{
            content: '';
            position: absolute;
            top:0;
            left: 0;
            width: 7%;
            height: 100%;
            background: linear-gradient(#fff,#fff,#e3e3e3);
            z-index: 1;
            filter: blur(1px);
        }
            .searchBox::after{
            content: '';
            position: absolute;
            top:0;
            right: -1px;
            width: 7%;
            height: 100%;
            background:#9d9d9d;
            z-index: 1;
            filter: blur(1px);
        }
            .shadow{
            position: absolute;
            top:0;
            left: -50px;
            width: calc(100% + 50px);
            height: 300px;
            background: linear-gradient(180deg,rgba(0,0,0,0.1),
            transparent,transparent);
            transform-origin: top;
            transform: skew(45deg);
            pointer-events:none
        }
            .shadow::before{
            content: '';
            position: absolute;
            width: 50px;
            height: 50px;
            background: #cfd1e1;
            z-index:1;
        }
            .searchBox input{

            position: relative;
            width: 86%;
            height: 100%;
            border: none;
            padding: 10px 25px;
            outline: none;
            font-size: 15px;
            color: #555;
            background: linear-gradient(#dbdae1,#a3aaba);
            box-shadow: 5px 5px 5px rgba(0,0,0,0.1),
            15px 15px 15px rgba(0,0,0,0.1),
            20px 20px 15px rgba(0,0,0,0.1),
            30px 30px 15px rgba(0,0,0,0.1),
            inset 1px 1px 2px #fff
        }

            .searchBox:hover input
            {
                color:#555
            }
            .answerAre {
                display: none;
                width: 420px;
                color: black;
            }
            .searchBox:hover .answerAre {
                display: block !important;
                position: absolute;
                margin-top: 50%;
            }

            .answerText {
                width: 100%;
                white-space:pre-wrap;
            }
            .titleText{
                 overflow:hidden;
                 white-space: nowrap;
                text-overflow: ellipsis;
            }
            .mainInfo {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.4) center;
                align-items: center;
                justify-content: center;
                display: none;
           }
           .mainInfo h3 {
           position: absolute;
           top:50%;
           buttom:50%;
           left:20%;

                color: black;
                text-align: center;
           }
            ion-icon{
            position: absolute;
            right: 25px;
        }
        .autoSet {
                position: fixed;
                top: 15%;
                right: 15%;
                border-radius: 50%;
                color: #999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                cursor: pointer;
                z-index: 9;
            }
        `

    var styles = document.createElement('style')
    styles.type = 'text/css'
    styles.innerHTML = style;
    document.getElementsByTagName('head').item(0).appendChild(styles)
}

function formatQuestion(questions) {
    questions.forEach(function(item,index,self){
        item.trim()
        if (item.substring(0,1)==(index+1)) {
            item = item.substring(1,item.length+1)
        } else if (item.substring(0,2)==(index+1)) {
            item = item.substring(2,item.length+1)
        }else {
            return
        }
        if (item.substring(0,1)=='、') {
            self[index] = item.substring(1,item.length)
        }
    })
}

function addClick() {
    $('head').append('<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">');

    const htmlContent = `

    <div class="autoSet">
    <div class="core">
        <button id="autoAnswer">自动答题</button>
    </div>
  </div>
  <div class="mainInfo">
        <h3>自动答题中，请等待  答题时间随题目数量有关，如一分钟还没完成请刷新页面，多次尝试无用请反馈</h3>
</div>
    <div class="outer">
    <div class="core">
        <div class="searchBox">
         <div style="position: absolute; right: 23px; top: 15px; z-index: 999; cursor: pointer; display: none;" class="input_clear">
		<ion-icon name="trash"></ion-icon>
        </div>
            <input id="titleIpt" type="text">
            <ion-icon id="searchAnswer" name="search-outline"></ion-icon>
            <div class="answerAre">
                <p class="titleText"></p>
                <p class="answerText" id="answerBody"></p>
            </div>
        </div>
    </div>
</div>`

    $('body').append(htmlContent)
    document.getElementById("titleIpt").addEventListener("focus", function () {
        document.getElementsByClassName("searchBox").item(0).style.width = '400px'
        document.getElementsByClassName("answerAre").item(0).style.display = 'block';
        document.getElementsByClassName("answerAre").item(0).style.position = 'absolute';
        document.getElementsByClassName("answerAre").item(0).style.marginTop = '50%';
    })
    document.getElementById("titleIpt").addEventListener("blur", function () {
        this.parentElement.style.width = '65px'
        document.getElementsByClassName("answerAre").item(0).style.display = 'none';
        document.getElementsByClassName("answerAre").item(0).style.display = 'none';

    })
    document.getElementById("searchAnswer").addEventListener("click",function () {
        document.getElementsByClassName("searchBox").item(0).style.width = '400px'
        document.getElementsByClassName("answerAre").item(0).style.display = 'block';
        document.getElementsByClassName("answerAre").item(0).style.position = 'absolute';
        document.getElementsByClassName("answerAre").item(0).style.marginTop = '50%';
        searchAnswer()
        document.getElementsByClassName("titleText").item(0).innerHTML = '题目：'+ document.getElementById("titleIpt").value
    })
    document.getElementById("autoAnswer").addEventListener("click",function () {
        document.getElementsByClassName("mainInfo").item(0).style.display = 'block'
        if ($('.score-info').length!=0) {
            fail_prompt("当前作业已经完成，请不要重复点击",1500)
            document.getElementsByClassName("mainInfo").item(0).style.display = 'none'
        }else {
            autoHomeWork()
        }

    })

    $("input").focus(function(){
        $(this).parent().children(".input_clear").show();
    });
    $("input").blur(function(){
        if($(this).val()=='')
        {
            $(this).parent().children(".input_clear").hide();
        }
    });
    $(".input_clear").click(function(){
        $(this).parent().find('input').val('');
        $(this).hide();
    });
}

let v,listenerInt,startInt,saveLearnInt
function videoMute() {
    v = document.querySelector("video")
    if (v!= null) {
        v.muted = true
        listenerInt = setInterval(function() {listener()},15000);
        clearInterval(startInt)
        saveLearnInt = setInterval(function() {saveLearnTime()},10000);
    }
}

function start(){
    stopFunction()
    startInt = setInterval(function() {videoMute()},1500)
}

function guard() {
    if (typeof(listenerInt) != 'number'||typeof(saveLearnInt) != 'number') {
        start()
    }
}

function handler(mutationRecordList) {
    for (let i = 0; i < mutationRecordList.length; i++) {
        let addedNodes = mutationRecordList[i].addedNodes
        if (addedNodes) {
            for (let i = 0; i < addedNodes.length; i++) {
                if ((addedNodes[i].id == 'root' && addedNodes[i].childNodes.length>0) || (typeof(addedNodes[i].id) == 'string' && addedNodes[i].id.indexOf('layui-layer')>=0)) {
                    start()
                }
                let innerText = addedNodes[i].innerText
                if (innerText && innerText.indexOf('学习下一课节') >= 0) {
                    obsClick('.layui-layer.layui-layer-dialog .layui-layer-btn0');
                    break;
                }
            }
        }
    }
    obsDocumentPage()

}

function obsDocumentPage() {
    obsText('#page_learn_courseware_document .transcode-file-area.text-center', '该文档类型不支持预览，请点击 这里 下载文档')
        .then((res) => {
        let coursewareMenuItem = document.querySelectorAll('#menu_tarr_content .courseware_menu_item.pull-left.ng-scope')
        if (coursewareMenuItem.length > 2) {
            let activeCoursewareMenuItem = document.querySelector('#menu_tarr_content .courseware_menu_item.pull-left.ng-scope.active')
            let activeCoursewareMenuItemText = activeCoursewareMenuItem.innerText
            for (let i = 0; i < coursewareMenuItem.length; i++) {
                if (activeCoursewareMenuItemText == coursewareMenuItem[i].innerText) {
                    let next = i + 1
                    coursewareMenuItem[next].click()
                    if (coursewareMenuItem.length > next+1) {
                        obsDocumentPage()
                        return
                    }
                    break;
                }
            }
        }

        let courseChapterItem = document.querySelectorAll('.course_chapter_item.user-no-select.ng-scope')
        let activeItem = document.querySelector('.course_chapter_item.user-no-select.ng-scope.active')

        let activeItemText = activeItem.innerText
        for (let i = 0; i < courseChapterItem.length; i++) {
            if (activeItemText == courseChapterItem[i].innerText) {
                courseChapterItem[i + 1].children[1].click()
                break;
            }
        }
    })

}

let obsClickTimer = null

function nextNode() {
    let currentNodeVideo = $('#menu_tarr_content')[0]
    let currentVideoNum
    let currentNodeVideoNum = currentNodeVideo.children.length
    for (let i =0;i<currentNodeVideoNum;i++) {
        if (currentNodeVideo.children[i].className.indexOf('active')!=-1) {
            currentVideoNum = i
        }
    }
    if (currentNodeVideoNum != currentVideoNum + 1) {
        if (currentNodeVideo.children[currentVideoNum+1].innerText.indexOf('视频')!=-1) {
            currentNodeVideo.children[currentVideoNum+1].click()
            start()
            return
        }
    }
    let courseChapterItem = document.querySelectorAll('.course_chapter_item.user-no-select.ng-scope')
    let activeItem = document.querySelector('.course_chapter_item.user-no-select.ng-scope.active')
    let activeItemText = activeItem.innerText
    for (let i = 0; i < courseChapterItem.length; i++) {
        if (activeItemText == courseChapterItem[i].innerText) {
            courseChapterItem[i + 1].children[1].click()
            break;
        }
    }
    console.log("22")
    start()
}


function obsClick(selector) {
    return new Promise((resolve, reject) => {
        let startExecutionTime = new Date().getTime()
        if (obsClickTimer) {
            clearInterval(obsClickTimer)
        }
        obsClickTimer = setInterval(() => {
            let target = document.querySelector(selector)
            if (target) {
                clearInterval(obsClickTimer)
                target.click()
                resolve({
                    element: selector,
                    operation: 'click'
                })
            } else {
                return
            }

            let executionTime = new Date().getTime()
            if (startExecutionTime - executionTime > 1000 * 10) {
                clearInterval(obsClickTimer)
                reject('超时')
            }
        }, 500)
    })
}

function activation() {
    const localStorage = window.localStorage;
    const activationCodeKey = 'xinwei_activation_code';
    let activationCode = localStorage.getItem(activationCodeKey)
    if (!activationCode) {
        const str ='%u8BF7%u8F93%u5165%u6FC0%u6D3B%u7801%uFF08%u6FC0%u6D3B%u7801%u4E24%u5143%u6C38%u4E45%uFF0C%u53EF%u8054%u7CFB%u5FAE%u4FE1%uFF1Awuwang1873%uFF09%uFF1A'
        let code = prompt(unescape(str), '');
        if (window.atob(code).indexOf('xinweijiaoyu') >= 0) {
            localStorage.setItem(activationCodeKey, code)
            alert(unescape('%u6FC0%u6D3B%u6210%u529F'))
        } else {
            alert(unescape('%u6FC0%u6D3B%u5931%u8D25'))
            return false
        }
    }
    return true
}

let obsTextTimer = null

function obsText(selector, text) {
    return new Promise((resolve, reject) => {
        let startExecutionTime = new Date().getTime()
        if (obsTextTimer) {
            clearInterval(obsTextTimer)
        }
        obsTextTimer = setInterval(() => {
            let target = document.querySelector(selector)
            if (target && target.textContent.trim() == text) {
                clearInterval(obsTextTimer)
                resolve(selector)
            } else {
                return
            }

            let executionTime = new Date().getTime()
            if (startExecutionTime - executionTime > 1000 * 10) {
                clearInterval(obsTextTimer)
                reject('超时')
            }
        }, 500)
    })
}



function stopFunction(){
    clearInterval(listenerInt)
    clearInterval(startInt)
    clearInterval(saveLearnInt)
}

let learn_time_old = ''

function listener() {
    if (document.querySelector(".time_text")==null) {
        return
    }
    if (learn_time_old=='') {
        learn_time_old = document.querySelectorAll(".time_text")[1].innerText
        return
    }
    let learn_time = document.querySelectorAll(".time_text")[1].innerText
    if (learn_time_old==learn_time) {
        stopFunction()
        location.reload(true)
    }
    // v.currentTime = v.duration
    learn_time_old = learn_time
    setTimeout(formatTime(learn_time),30000)
}

let timerIndex = 0
function formatTime(time) {
    if (timerIndex > 3) {
        location.reload(true)
    }
    let minute = parseInt(time.substring(0,2))
    let second = parseInt(time.substring(3,5))
    if ((minute*60 + second) < 60) {
        timerIndex ++
    }
}

const BASEURL = "https://teaching.51xinwei.com/learning/student/studentDataAPI.action?functionCode=sendVideoLearnRecord"

function saveLearnTime() {
    axios({
        method: 'post',
        url: BASEURL,
        data: {
            courseId: getUrlParams("courseId"),
            itemId: getUrlParams("itemId"),
            recordCount: 60,
            playPosition: parseInt(v.currentTime),
            playbackRate: 1,
            key: Date.now()
        },
        transformRequest: [
            function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                ret = ret.substring(0, ret.lastIndexOf('&'));
                return ret
            }
        ],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (res) {
        if (res.data.learnRecord.state==2) {
            nextNode()
        }
    })
}

function getUrlParams(name) { // 不传name返回所有值，否则返回对应值
    let url = window.location.hash;
    url = url.split("?")[1];
    url = url.split('&');
    let nameres;
    for(var i=0;i<url.length;i++) {
        var info = url[i].split('=');
        var obj = {};
        obj[info[0]] = decodeURI(info[1]);
        url[i] = obj;
    }
    if (name) {
        for(let i=0;i<url.length;i++) {
            for (const key in url[i]) {
                if (key == name) {
                    nameres = url[i][key];
                }
            }
        }
    } else {
        nameres = url;
    }
    return nameres;
}

function getLearnType() {
    return window.location.hash.includes("homeworkId");

}

function prompt(message, style, time)
{
    style = (style === undefined) ? 'alert-success' : style;
    time = (time === undefined) ? 1200 : time;
    $('<div id="promptModal">')
        .appendTo('body')
        .addClass('alert '+ style)
        .css({"display":"block",
              "z-index":99999,
              "left":($(document.body).outerWidth(true) - 120) / 2,
              "top":($(window).height() - 45) / 2,
              "position": "absolute",
              "padding": "20px",
              "border-radius": "5px"})
        .html(message)
        .show()
        .delay(time)
        .fadeOut(10,function(){
        $('#promptModal').remove();
    });
};

// 成功提示
function success_prompt(message, time)
{
    prompt(message, 'alert-success', time);
};

// 失败提示
function fail_prompt(message, time)
{
    prompt(message, 'alert-danger', time);
};

// 提醒
function warning_prompt(message, time)
{
    prompt(message, 'alert-warning', time);
};

