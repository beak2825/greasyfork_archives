// ==UserScript==
// @name         Wizard101_答题快速导航
// @namespace    http://tampermonkey.net/
// @version      0.6.9
// @description  搭配自动答题脚本一起食用的导航
// @author       lsmhq
// @match        https://www.wizard101.com/quiz/trivia/game/*
// @match        https://www.wizard101.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://www.wizard101.com
// @require      https://greasyfork.org/scripts/446229-nav-list/code/nav_list.js?version=1059140
// @require      https://greasyfork.org/scripts/446167-quiz-answer/code/quiz_answer.js?version=1059141
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446226/Wizard101_%E7%AD%94%E9%A2%98%E5%BF%AB%E9%80%9F%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/446226/Wizard101_%E7%AD%94%E9%A2%98%E5%BF%AB%E9%80%9F%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let questAddress = window.questAddress
    var questions = window.questions
    let basePath = 'https://www.wizard101.com/quiz/trivia/game/'
    let index = 0
    let index_done = 0
    let style = `
        display:flex;
        flex-direction: column;
        width:280px;
        padding:20px 0;
        position:fixed;
        text-align:center;
        bottom:20%;
        right:1%;
        background:rgb(57 57 57 / 85%);
        z-index:1000;
        border-radius:10px;
        color:white;
        user-select:none;
        overflow:hidden;
    `
    let done_style = `
        display:flex;
        flex-direction: column;
        width:100%;
        text-align:center;
        z-index:1000;
        color:white;
    `
    let btn_style = `
        width:100%;
        position:relative;
        height:24px;
        line-height:24px;
        text-align:center;
        cursor:pointer;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding:0 15px;
        box-sizing:border-box;
    `
    // 节点元素
    let container, h22, h2, noDo, h2_noDo, done, h2_done, move_btn, answer_container, answer, answer_text
    // let clientX, clientY, innerX, innerY // 坐标
    // 用户名
    let userName = document.getElementById('userNameOverflow').innerText
    // 记录值
    if(localStorage.getItem(`${userName}_quiz`) == null){
        localStorage.setItem(`${userName}_quiz`,JSON.stringify([]))
    }
    function createBtnGroup(){
        // 创建容器
        createContainer()
        // 创建List
        createList()
        container.append(noDo)
        container.append(done)
        document.body.append(container)
        h2_noDo.innerText = `😨Not Finished(${document.getElementsByClassName('btn_no').length})`
        h2_done.innerText = `😛Finished(${document.getElementsByClassName('btn_yes').length})`
    }
    // Main
    function main(){
        let quiz = document.getElementsByClassName('quizQuestion')
        let quizs = JSON.parse(localStorage.getItem(`${userName}_quiz`))
        let btn_sub = document.getElementsByClassName('kiaccountsbuttongreen')

        // 只有在结算时才出现
        let href = 'https://www.wizard101.com/game/earn-crowns'
        if((quiz.length === 0 && btn_sub.length > 0 && btn_sub[0].innerText === 'TAKE ANOTHER QUIZ!') || window.location.href === href){
            checkFinished(quizs)
            createBtnGroup()
        }else if(document.getElementById('nextQuestion')){
            // 创建答案
            createAnswer()
            document.body.append(answer_container)
        }
        //https://www.wizard101.com/quiz/trivia/game/wizard101-mystical-trivia
        // 答完题的页面
        if(window.location.href.split('www.wizard101.com/quiz/trivia/game/').length > 1 && btn_sub.length === 0 && quiz.length === 0){
            checkFinished(quizs)
            createBtnGroup()
        }
        // 进入领皇冠页面
        if(btn_sub.length > 0 && btn_sub[0].innerText === 'CLAIM YOUR REWARD' ){
            if(window.openIframeSecure){
                window.openIframeSecure('/auth/popup/LoginWithCaptcha/game?fpSessionAttribute=QUIZ_SESSION');
            }// 弹出验证

            // if(window.submitForm){
            //     window.submitForm()
            // } // 提交弹窗
            notification()// 消息提示

        }
        if(btn_sub.length > 0 && btn_sub[0].innerText === 'TAKE ANOTHER QUIZ!' ){
            // 直接跳转
        }
    }
    // 判断是否结束
    function checkFinished(quizs){
        let item = window.location.href.split('/')
        if(questAddress.includes(item[item.length - 1]) && !quizs.includes(item[item.length - 1])){
            quizs.push(item[item.length - 1])
            localStorage.setItem(`${userName}_quiz`,JSON.stringify(quizs))
        }
        if(quizs.length >= 10){
            localStorage.setItem(`${userName}_quiz`,JSON.stringify([]))
        }
    }
    // Answer
    function createAnswer(){
        answer_container = document.createElement('div')
        answer_container.style = style
        answer_container.style.bottom = '5%'
        answer_container.classList.add('fadeIn')
        answer_container.id = 'answer_container'


        answer = document.createElement('h2')
        answer.innerText = 'Answer:'
        answer.style = `
            height: 30px;
            line-height: 20px;
            font-size:24px;
            color:white;
            font-weight: normal;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 30px;
        `

        answer_text = document.createElement('h2')
        answer_text.innerText = findAnswer()
        answer_text.style = `
            height: 30px;
            line-height: 20px;
            font-size:20px;
            color:white;
            font-weight: normal;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 30px;
        `
        answer_container.append(answer)
        answer_container.append(answer_text)
    }
    // Nav
    function createContainer(){
        // 总容器
        container = document.createElement('div')
        container.style = style
        container.classList.add('fadeIn')
        container.id = 'container'
        // 大标题
        h22 = document.createElement('h2')
        h22.innerText = `Welcome! ${userName}`
        h22.style = `
            height: 30px;
            line-height: 20px;
            font-size:21px;
            color:white;
            font-weight: normal;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 30px;
        `
        container.append(h22)
        // 未完成
        noDo = document.createElement('div')
        noDo.style = done_style
        h2_noDo = document.createElement('h2')
        h2_noDo.innerText = '😨Not Finished'
        h2_noDo.style = `
            color: #00ceff !important;
        `
        noDo.append(h2_noDo)
        //已完成
        done = document.createElement('div')
        noDo.style = done_style
        h2_done = document.createElement('h2')
        h2_done.innerText = '😛Finished'
        h2_done.style =`
            color: #00ff6c !important;
        `
        done.append(h2_done)
    }
    // 创建List
    function createList(){
        let quizs = JSON.parse(localStorage.getItem(`${userName}_quiz`))
        //未完成list
        questAddress.forEach((element,idx) => {
            if(!quizs.includes(element)){
                let btn = document.createElement('div')
                btn.style = btn_style
                // btn.style.color = 'rgb(92,230,251)'
                btn.innerText = `${++index}、${element}`
                btn.style.transition = 'all ease 0.3s'
                btn.classList.add('btn_no')
                btn.onclick = ()=>{
                    // 记录值
                    window.location.href = basePath + element
                }
                btn.onmouseenter = ()=>{
                    btn.style.transform = 'scale(1.2)'
                    btn.style.backgroundColor = 'black'
                }
                btn.onmouseleave = ()=>{
                    btn.style.transform = 'scale(1)'
                    btn.style.backgroundColor = ''
                }
                noDo.append(btn)
            }
        });
        // 已完成list
        quizs.forEach((element,idx) => {
            let btn = document.createElement('div')
            btn.style = btn_style
            btn.style.color = '#ffe200'
            btn.style.cursor = ''
            btn.style.textDecoration = 'line-through'
            btn.innerText = `${++index_done}、${element}`
            btn.classList.add('btn_yes')
            done.append(btn)
        })
    }
    // 提示消息
    function notification(){
        if (!("Notification" in window)) {
            console.log("This browser not support Notification");
        }else if (Notification.permission === "granted") {
            var n = new Notification('✨答✨题✨完✨成✨', {
                image:'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-479328cb-417a-467c-9512-83793cb72c1e/372504d5-cee3-46cd-af21-742f97cccafb.png',
                body: '领皇冠辣！！！' ,
            });
            setTimeout(n.close, 10000)
            n.onclick = () => {
                window.focus();
                // 点击之后触发方法
            };
        }else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    var notification = new Notification("✨授✨权✨完✨成✨");
                    setTimeout(() => {
                        notification.close()
                    }, 1000);
                }
            });
        }
    }
    // 寻找答案
    function findAnswer(){
        let quiz = document.getElementsByClassName('quizQuestion')
        let title = quiz.length > 0 ? quiz[0].innerText.trim() : ''
        let answerr = questions[title]
        // console.log('title:',title)
        return answerr || '未找到'
    }
    // 检测平台类型
    function checkIsMobile() {
        const { userAgent } = navigator;
        if (userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
          return true;
        } else {
          return false;
        }
    }
    // 执行
    function run(){
        let time = 500
        if(checkIsMobile()){
            //手机
            time = 1500
        } else{
            //电脑
            time = 500
        }
        setTimeout(() => {
            main()
        }, time);
    }
    // 执行
    run()
})();