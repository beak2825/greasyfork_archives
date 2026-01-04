// ==UserScript==
// @name         问卷星自动填写
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  根据配置文件自动填写相关问卷星问题
// @author       itsdapi
// @run-at       document-start
// @match        *://*.wjx.cn/*/*
// @match        *://*.wjx.top/*/*
// @match        *://*.wjx.com/*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464195/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/464195/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==


(function () {
    'use strict';
    app()

    const config = [
        {
            match: /姓名|名字|名称|昵称/gm,
            answer: '张大飞'
        },
    ]

    async function app() {
        console.log('Script is running!')
        try{
            await waitForContentLoad()
            const questionsList = getQuestionList()
            // 防止内容没有完全加载完 
            await preventContentNotfinishedLoading(2000)
            matchAndFillIn(questionsList)
        } catch(error) {
            console.error('Script Error!', error)
        }
    }

    function getQuestionList() {
        const questions = document.querySelectorAll('.field')
        // console.log(questions)
        let questionsList = []
        for (let [index, q] of questions.entries()) {
            const inputEle = q.children[1].children[0]
            const question = q.children[0].innerText
            // console.log(inputEle)
            questionsList = [...questionsList, {
                id: index,
                question,
                inputEle
            }]
        }
        // console.log(questionsList)
        return questionsList
    }

    function matchAndFillIn(qList) {
        console.log('Questions List', qList)
        for (let [index, q] of qList.entries()) {
            for(let [index, a] of config.entries()) {
                if(a.match.test(q.question)) {
                    console.log(`Answer to ${q.question} is ${a.answer}`)
                    q.inputEle.value = a.answer
                    break
                } else {
                    console.log(`Answer to ${q.question} not found!`)
                }
            }
        }
    }

    function waitForContentLoad() {
        return new Promise((res) => {
            for (let index = 0; index < 10; index++) {
                setTimeout(() => {
                    if (document.getElementById('pageDiv') !== null) {
                        res()
                    }
                }, 500);
            }
        })
    }

    async function preventContentNotfinishedLoading(t) {
        return new Promise((res) => {
            setTimeout(() => {
                res()
            },t)
        })
    }
})()