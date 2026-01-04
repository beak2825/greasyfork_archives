// ==UserScript==
// @name         赛?克
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  take over the world!
// @author       define9
// @match        https://edu.saikr.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=saikr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454745/%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454745/%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==

(function () {
    option = {
        searchUrl: 'https://syhu.com.cn:8084/question/search',
        putUrl: 'https://syhu.com.cn:8084/question/put',
        // searchUrl: 'https://localhost:8084/question/search',
        // putUrl: 'https://localhost:8084/question/put',
        username: 'define9',
        questionCount: 50
    }

    const c2i = {
        'A': 0,
        'B': 1,
        'C': 2,
        'D': 3
    }

    function getTitle(questionTag) {
        var div = questionTag.querySelector('.testpaper-question-stem p')
        if (div == null) {
            console.warn('???, div为空, questionTag: ' + questionTag.querySelector('.testpaper-question-stem'))
        }
        return div.innerText
    }

    function getAnswer(questionTag) {
        var answer = questionTag.querySelector('.testpaper-question-result .color-success').innerText
        // 如果是选择题
        if ($(questionTag).hasClass('testpaper-question-choice')) {
            var ul = questionTag.querySelector('.testpaper-question-choices')
            var li = $(ul).children('li')
            answer = li[c2i[answer]].innerText
        }

        return answer
    }

    function getAnalysis(questionTag) {
        return questionTag.querySelector('.testpaper-question-analysis').innerText
    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function examination(dom) {
        var allQuestionTag = dom.querySelectorAll('.testpaper-question')
        console.log(`found question: ${allQuestionTag.length}`)
        for (var i = 0; i < allQuestionTag.length; i++) {
            const questionTag = allQuestionTag[i]
            var title = getTitle(questionTag)
            
            await sleep(100).then(
                $.ajax({
                    url: option['searchUrl'],
                    type: 'POST',
                    data: {
                        title,
                        username: option['username']
                    },
                    success(res) {
                        addInfo(questionTag, {
                            answer: res['content']['answer'],
                            analysis: res['content']['analysis'],
                            show: res['found'],
                            msg: '没有找到答案'
                        })
                    }
                })
            )
        }
    }

    async function crawling(dom) {
        var allQuestionTag = dom.querySelectorAll('.testpaper-question')

        for (let i = 0; i < allQuestionTag.length; i++) {
            var title = getTitle(allQuestionTag[i])
            var answer= getAnswer(allQuestionTag[i])
            var analysis = getAnalysis(allQuestionTag[i])

            await sleep(100).then(
                $.ajax({
                    url: option['putUrl'],
                    type: 'POST',
                    data: {
                        username: option['username'],
                        title,
                        answer,
                        analysis
                    },
                    success(res) {
                        addInfo(allQuestionTag[i], {
                            msg: res['content'],
                            found: false
                        })
                    }
                })
            )
        }

    }

    function work(dom) {
        console.log('🎈work start')

        var status = dom.querySelector('.testpaper-status').innerText
        console.log(status)

        if (status == '答题中') {
            examination(dom)
        } else if (status == '已评阅') {
            crawling(dom)
        }
    }
    
    /**
     * 检查dom是否合法
     */
    var task = setInterval(() => {
        var dom = window.frames['task-content-iframe'].contentWindow.document
        var body = dom.querySelector('body')
        var allQuestionTag = dom.querySelectorAll('.testpaper-question')
        
        body == null && console.log(allQuestionTag.length)

        if (body != null && allQuestionTag.length >= option['questionCount']) {
            clearInterval(task)
            work(dom)
        }
    }, 1000)
})();

/**
 * UI 相关
 * @param {*} questionTag 
 * @param {*} info 
 */
function addInfo(questionTag, info) {
    var footer = questionTag.querySelector('.testpaper-question-footer')
    
    if(info.show) {
        $(footer).append(`<div class="testpaper-question-result">
        正确答案是
        <strong class="color-success">${info['answer']}</strong>
        </div><br>
        <div class="testpaper-question-analysis">${info['analysis']}</div>`)
    } else {
        $(footer).append(`<div class="testpaper-question-result">${info['msg']}</div>`)
    }
}
