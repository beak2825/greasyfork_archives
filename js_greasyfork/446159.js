// ==UserScript==
// @name         游戏👑自动答题脚本
// @namespace    http://tampermonkey.net/
// @version      0.6.3
// @description  wizard101游戏网页的自动答题脚本
// @author       lsmhq
// @match        https://www.wizard101.com/quiz/trivia/game/*
// @icon         https://www.google.com/s2/favicons?domain=www.wizard101.com
// @grant        none
// @license      MIT
// @require      https://greasyfork.org/scripts/446167-quiz-answer/code/quiz_answer.js?version=1059141
// @downloadURL https://update.greasyfork.org/scripts/446159/%E6%B8%B8%E6%88%8F%F0%9F%91%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/446159/%E6%B8%B8%E6%88%8F%F0%9F%91%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    var questions = window.questions
    var alertAble = true
    checkLocalStroage('max', 15)
    checkLocalStroage('min', 10)
    checkLocalStroage('select', 2)
    var max = localStorage.getItem('max') * 1, min = localStorage.getItem('min') * 1
    // 寻找答案
    function findAnswer(){
        let quiz = document.getElementsByClassName('quizQuestion')
        let title = quiz.length > 0 ? quiz[0].innerText.trim() : ''
        let answerr = questions[title]
        // console.log('title:',title)
        if(answerr){
            alertAble = true
            return answerr || ''
        }else{
            if(quiz.length === 0){
                return ''
            }
            if(alertAble){
                alertAble = false
                alert('⭐适用于wizard101题目(9个)和pirate101 Valencia题目(1个)⭐')
            }
            return ''
        }
    }
    // 选答案并提交
    function answer(answerVal){
        // console.log('answerVal:',answerVal)
        if(answerVal === ''){
            // console.log('未找到答案...')
            return
        }
        let answerVall = answerVal.trim()
        let answerText = document.getElementsByClassName('answerText')
        let answer = document.getElementsByClassName('answer')
        let nextQuestion = document.getElementById('nextQuestion')
        // console.log('answerText:',answerText)
        // 快速显示选项
        quickShow(answer, nextQuestion).then(()=>{
            // 选中
            checkValue(answerText, answerVall).then(()=>{
                // 下一道题
                nextQuiz()
            }).catch(error=>{console.error('下一题错误：',error)})
        }).catch(error=>{console.error('快速显示错误：',error)})
    }
    // 快速显示
    function quickShow(list, nextQuestion){
        return new Promise((resolve, reject)=>{
            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                element.style = 'visibility: visible;'
                element.classList.add('fadeIn')
            }
            nextQuestion.classList.add('fadeIn')
            nextQuestion.style = 'visibility: visible;'
            resolve();
        }) 
    }
    // 选择选项
    function checkValue(answerText, answerVall){
        return new Promise((resolve, reject)=>{
            let largecheckbox = document.getElementsByClassName('largecheckbox')
            for (let i = 0; i < answerText.length; i++) {
                let answerTextt
                if(answerText[i]){
                    answerTextt = answerText[i].innerText.trim()
                }
                // console.log('innerText:',answerText[i].innerText)
                // console.log(answerTextt,answerVall,answerTextt === answerVall)
                if(answerTextt === answerVall){
                    console.log('⭐答⭐案⭐')
                    console.log(`🍁${answerVall}🍁`)
                    // console.log(answerTextt)
                    // console.log(answerVall)
                    setTimeout(()=>{
                        largecheckbox[i].click()
                        console.log('✨✨✨结束✨✨✨')
                    },(min - 1) * 1000)
                }
            }
            resolve();
        })
    }
    // 下一题
    function nextQuiz(){
        setTimeout(()=>{
            document.getElementById('nextQuestion').click()
        },(Math.random() * (max - min) + min).toFixed(1) * 1000)
    }
    // 主函数
    function main() {
        // window.addEventListener('load', ()=>{
            if(document.getElementsByClassName('quizQuestion').length === 0){
                return
            }
            console.log('⭐⭐⭐开始⭐⭐⭐')
            answer(findAnswer())
            createMode()
        // })
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
    // 创建模式选择
    function createMode(){
        let container = document.createElement('div')
        container.classList.add('fadeIn')
        container.style = `        
            display:flex;
            flex-direction: column;
            width:280px;
            padding:20px;
            position:fixed;
            text-align:center;
            top:5%;
            right:1%;
            background:rgb(57 57 57 / 85%);
            z-index:1000;
            border-radius:10px;
            color:white;
            user-select:none;
            overflow:hidden;
        `
        let answer = document.createElement('h2')
        answer.innerText = 'Mode:'
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
        let select = document.createElement('select')
        select.onchange = (e)=>{
            console.log(typeof e.target.value)
            switch (e.target.value) {
                case '0':
                    localStorage.setItem('min', 0)
                    localStorage.setItem('max', 0)
                    break;
                case '1':
                    localStorage.setItem('min', 2)
                    localStorage.setItem('max', 3)
                    break;
                case '2':
                    localStorage.setItem('min', 5)
                    localStorage.setItem('max', 10)
                    break
                case '3':
                    localStorage.setItem('min', 10)
                    localStorage.setItem('max', 15)
                    break
            }
            localStorage.setItem('select', e.target.value)
        }
        let arr = ['🚀超级模式（???秒/道）','🤐封号模式（2~3秒/道）','😊常人模式（5~10秒/道）','😶发呆模式（10~15秒/道）']
        arr.forEach((val, idx)=>{
            let option = document.createElement('option')
            option.innerText = val
            option.value = idx
            if(localStorage.getItem('select') == idx){
                option.selected = true
            }
            select.append(option) 
        })
        container.append(answer)
        container.append(select)
        document.body.append(container)
    }
    // 检查数据
    function checkLocalStroage(key, val){
        if(localStorage.getItem(key) == null){
            localStorage.setItem(key, val)
        }
    }
    // 执行
    function run(){ 
        let time = 500
        if(checkIsMobile()){
            //手机
            time = 1000
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