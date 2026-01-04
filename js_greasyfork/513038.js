// ==UserScript==
// @name         CME Test Helper
// @namespace    https://yinr.cc/
// @version      0.2.1
// @description  好医生继续教育考试助手
// @author       Yinr
// @license      MIT
// @match        https://www.cmechina.net/cme/exam.jsp*
// @match        https://www.cmechina.net/cme/examQuizFail.jsp*
// @icon         https://www.cmechina.net/favicon.ico
// @require      https://update.greasyfork.org/scripts/458769/1147575/Yinr-libs.js
// @run-at       document-idle
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/513038/CME%20Test%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/513038/CME%20Test%20Helper.meta.js
// ==/UserScript==

/* global YinrLibs */

(function() {
    'use strict';

    /** TestRecord
     * @typedef {object} TestRecord
     * @prop {string} course_id
     * @prop {string} paper_id
     * @prop {string} cw_id
     * @prop {string} test_title
     * @prop {number} ques_num
     * @prop {QuesRecord[]} ques
     */
    /** QuesRecord
     * @typedef {object} QuesRecord
     * @prop {string} ques_id
     * @prop {string} ques_text
     * @prop {AnswerRecord[]} answer
     */
    /** AnswerRecord
     * @typedef {object} AnswerRecord
     * @prop {string} answer A, B, C, D, E
     * @prop {string} text
     * @prop {boolean?} right is this answer right?
     * @prop {boolean?} selected is last selected?
     */

    const cfg = new YinrLibs.Config({})
    /**
     * @param {string} course_id 
     * @param {string} paper_id 
     * @returns {string}
     */
    const getTestKey = (course_id, paper_id) => `${course_id}:${paper_id}`
    /**
     * @param {string} course_id 
     * @param {string} paper_id 
     * @returns {TestRecord}
     */
    const getTest = (course_id, paper_id) => {
        return cfg.getValue(getTestKey(course_id, paper_id), undefined)
    }
    /**
     * @param {string} course_id 
     * @param {string} paper_id 
     * @param {TestRecord} testRec 
     */
    const setTest = (course_id, paper_id, testRec) => {
        cfg.setValue(getTestKey(course_id, paper_id), testRec)
    }
    /**
     * @param {TestRecord} testRec 
     * @param {string} ques_id 
     */
    const getQues = (testRec, ques_id) => {
        let ques = testRec.ques.find(q => q.ques_id == ques_id)
        if (ques === undefined) {
            ques = {ques_id, answer: []}
            testRec.ques.push(ques)
        }
        return ques
    }
    /**
     * @param {QuesRecord} ques 
     * @param {string} answer 
     * @param {boolean} right 
     */
    const setAnswer = (ques, answer, right) => {
        let ans = ques.answer.find(a => a.answer == answer)
        if (ans === undefined) {
            ques.answer.push({answer, text: '', right, selected: false})
        } else {
            ans.right = right
            ans.selected = false
        }
    }

    /**
     * 标记选项是否正确
     * @param {string} ques_id 问题 ID
     * @param {string} answer 答案
     * @param {\boolean} right 是否正确
     */
    const markAnswer = (ques_id, answer, right) => {
        /** @type {HTMLOptionElement} */
        const opt = document.querySelector(`input[name=ques_${ques_id}][value=${answer}]`)
        if (right) {
            opt.parentElement.classList.add('ansRight')
            opt.click()
        } else {
            opt.parentElement.classList.add('ansWrong')
        }
    }

    /** 优化回答界面选项选择体验，可以点击文本选择
     * @param {HTMLParagraphElement} answerEl <p><input></input>{{text}}</p>
     */
    const enhanceAnswerLabel = (answerEl) => {
        const inputEl = answerEl.getElementsByTagName('input')[0]
        /** @type {Node} */
        const textNode = inputEl.nextSibling
        const id = `${inputEl.name}_${inputEl.value}`
        inputEl.id = id
        const labelEl = document.createElement('label')
        labelEl.setAttribute('for', id)
        labelEl.appendChild(textNode)
        answerEl.append(labelEl)
    }
    
    const path = document.location.pathname
    if (path.includes('examQuizFail.jsp')) {
        // 考试结果页
        const search = new URLSearchParams(document.location.search)
        const course_id = search.get('course_id')
        const paper_id = search.get('paper_id')
        const cw_id = search.get('cw_id')
        const error_order = search.get('error_order').split(',').map(i => parseInt(i) - 1)
        const error_ques = search.get('error_ques').split(',')
        const ansList = search.get('ansList').split(',')
        const testRec = {
            course_id, paper_id, cw_id, ques: [],
            ...getTest(course_id, paper_id),
        }
        for (let i = 0; i < error_order.length; i++) {
            const order = error_order[i]
            const ques_id = error_ques[i]
            const answer = ansList[order]
            const ques = getQues(testRec, ques_id)
            setAnswer(ques, answer, false)
        }
        testRec.ques.forEach(q => {
            q.answer.forEach(a => {
                if (a.selected) {
                    a.right = true
                    a.selected = false
                }
            })
        })
        
        setTest(course_id, paper_id, testRec)
        console.log(testRec)
    } else if (path.includes('exam.jsp')) {
        // 考试页
        GM_addStyle(`
            .exam_list li p label { cursor: pointer; }
            .exam_list li p.ansWrong { color: red; }
            .exam_list li p.ansRight { color: green; }
        `)
        /** @type {HTMLDivElement} */
        const box = document.querySelector('div.ks_box')
        /** @type {string} */
        const course_id = box.querySelector('input[name=course_id]').value
        /** @type {string} */
        const paper_id = box.querySelector('input[name=paper_id]').value
        /** @type {string} */
        const cw_id = box.querySelector('input[name=cw_id').value
        /** @type {string} */
        const test_title = box.querySelector('div.page_tit > h2').innerText
        /** @type {string} */
        const ques_num = parseInt(box.querySelector('input[name=ques_num]').value)
        /** @type {string[]} */
        const ques_ids = box.querySelector('input[name=ques_list]').value.split(',')
        /** @type {HTMLLIElement[]} */
        const ques_els = Array.from(box.querySelectorAll('ul.exam_list>li'))
        /** @type {string[]} */
        const ques_texts = ques_els.map(el => el.querySelector('h3.name').innerText)

        /** @type {TestRecord} */
        const testRec = {
            course_id, paper_id, cw_id, test_title, ques_num, ques: [],
            ...getTest(course_id, paper_id),
        }
        for (let ques_idx = 0; ques_idx < ques_num; ques_idx++) {
            const ques_el = ques_els[ques_idx]
            const ques_id = ques_ids[ques_idx]
            const ques_text = ques_texts[ques_idx]
            /** 答案库检索结果 */
            const ques = getQues(testRec, ques_id)
            ques.ques_text = ques_text
            const ans_els = Array.from(ques_el.querySelectorAll('p'))
            ans_els.forEach(el => {
                enhanceAnswerLabel(el)
                const ans_text = el.textContent.trim()
                const answer = el.querySelector('input').value
                let ans = ques.answer.find(a => a.answer == answer)
                if (ans === undefined) {
                    ans = {answer, text: ans_text, right: undefined, selected: false}
                    ques.answer.push(ans)
                } else {
                    ans.text = ans_text
                }
                if (ans.right !== undefined) {
                    markAnswer(ques_id, answer, ans.right)
                }
            })
        }
        setTest(course_id, paper_id, testRec)

        box.querySelector('ul.exam_list').addEventListener('click', e => {
            /** @type {HTMLInputElement} */
            const el = e.target
            if (el.tagName === 'INPUT' && el.type === 'radio') {
                const ques_id = el.name.replace(/^ques_/, '')
                const answer = el.value
                const testRec = getTest(course_id, paper_id)
                const ques = testRec.ques.find(q => q.ques_id == ques_id)
                const ans = ques.answer.find(a => a.answer == answer)
                ques.answer.forEach(a => a.selected = false)
                ans.selected = true
                console.log(`select ${ques_id}: ${answer}`)
                setTest(course_id, paper_id, testRec)
            }
        })

        // 自动选择未答题目
        for (let ques_idx = 0; ques_idx < ques_num; ques_idx++) {
            const ques_el = ques_els[ques_idx]
            const ques_id = ques_ids[ques_idx]
            /** 答案库检索结果 */
            const ques = getQues(testRec, ques_id)
            const ans_els = Array.from(ques_el.querySelectorAll('p'))
            const rightAns = ques.answer.find(a => a.right)
            if (!rightAns) {
                const unknowAns = ques.answer.filter(a => a.right === undefined)
                // 随机选择
                const choose = unknowAns[Math.floor(Math.random()*unknowAns.length)]
                console.log('自动选择', choose.text)
                ans_els.find(el => {
                    const answer = el.querySelector('input').value
                    return answer == choose.answer
                }).querySelector('input').click()

            }
        }
        const title = box.querySelector('div.page_tit>p:last-child')
        const btn = document.createElement('span')
        btn.innerText = '【快捷提交】'
        btn.style.cursor = 'pointer'
        btn.addEventListener('click', () => {
            document.getElementById('tjkj').click()
        })
        title.append(btn)
    }
})();