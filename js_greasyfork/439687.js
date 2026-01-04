// ==UserScript==
// @name         fenbiCopy
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  通过ctrl+q复制粉笔练习题，导出错题为json格式
// @author       You
// @match        *://*.fenbi.com/*
// @match        *://*.mbadashi.com/*
// @icon         https://www.google.com/s2/favicons?domain=fenbi.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439687/fenbiCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/439687/fenbiCopy.meta.js
// ==/UserScript==


(function() {
    'use strict';
var $ = selector => {
    return document.querySelector(selector)
}

var $$ = selector => {
    return document.querySelectorAll(selector)
}

/**
 * Export JSON
 */
function exportJSON(data = {}, filename) {
    let link = document.createElement('a')
    if (!filename) {
        filename = `${Date.now()}.json`
    }
    if (!/\.json$/.test(filename)) {
        filename += '.json'
    }
    link.download = filename
    link.href =
        'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(data))
    link.click()
    link = null
}

const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
}

function get(url) {
    return fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: headers,
    })
        .then(response => {
            return handleResponse(url, response)
        })
        .catch(error => {
            console.error(`GET Request fail. url:${url}. message:${error}`)
            return Promise.reject({
                error: {
                    message: 'GET Request failed.',
                },
            })
        })
}

function post(url, data) {
    return fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
    })
        .then(response => {
            return handleResponse(url, response)
        })
        .catch(err => {
            console.error(`Request failed. Url = ${url} . Message = ${err}`)
            return { error: { message: 'Request failed.' } }
        })
}


function handleResponse(url, response) {
    let res = response
    if (res.status === 200) {
        return res.json()
    } else {
        console.error(`Request fail. url:${url}`)
        Promise.reject({
            error: {
                message: 'Request failed due to server error',
            },
        })
    }
}

/**
 * 查询题目列表的id
 * @param {*} categoryId
 * 言语：22017
 * 数量：22018
 * 判断：22019
 * 资料：22020
 * 常识：22021
 * @returns Promise
 */
const getQuestionIdByCategoryId = categoryId => {
    const url = `https://tiku.fenbi.com/api/xingce/errors?categoryId=${categoryId}&offset=0&limit=10000&order=asc&timeRange=0&app=web&kav=12&version=3.0.0.0`

    return get(url)
}

const getCategoryTree = () => {
    const url = `https://tiku.fenbi.com/api/xingce/errors/keypoint-tree?timeRange=0&app=web&kav=12&version=3.0.0.0`

    return get(url)
}

// 通过题目id查询题目内容以及解析
const getSolutionById = ids => {
    const url = `https://tiku.fenbi.com/api/xingce/solutions?ids=${ids}&app=web&kav=12&version=3.0.0.0`
    // get(url).then(res => {
    //     // content: 内容
    //     // correctAnswer: 正确答案
    //     // accessories 选项
    //     // solution: 解析
    //     // source：来源
    //     // keyPoint: { id, name } 题目分类
    //     // questionMeta: { mostWrongAnswer }
    // })
    return get(url)
}

// 通过题目id查询题目内容以及解析
const getSolutionByIds = async questionIds => {
    const sliceQuestionIds = []
    for (let i = 0; i < questionIds.length; i += 500) {
        sliceQuestionIds.push(questionIds.slice(i, i+500))
    }
    let solution = []
    for (let i = 0; i < sliceQuestionIds.length; i++) {
        const s = await get(`https://tiku.fenbi.com/api/xingce/solutions?ids=${sliceQuestionIds[i].toString()}&app=web&kav=12&version=3.0.0.0`)
        console.log('插入一次', sliceQuestionIds[i], s)
        solution = solution.concat(s)
    }
    return solution
}

const exportWrongQuestion = async () => {
    // 言语：22017
    // 数量：22018
    // 判断：22019
    // 资料：22020
    // 常识：22021
    // const categoryList = [22017, 22018, 22019, 22020, 22021]
    const data = {}
    const questionIds = []
    const keyPointTree = await getCategoryTree()
    keyPointTree &&
        keyPointTree.forEach(item => {
            questionIds.push(...item.questionIds)
        })
    // 试着
    console.log('questionIds', questionIds)
    const sliceQuestionIds = []
    for (let i = 0; i < questionIds.length; i += 500) {
        sliceQuestionIds.push(questionIds.slice(i, i+500))
    }
    let solution = []
    for (let i = 0; i < sliceQuestionIds.length; i++) {
        const s = await getSolutionById(sliceQuestionIds[i].toString())
        console.log('插入一次', sliceQuestionIds[i], s)
        solution = solution.concat(s)
    }
    data.question = solution
    data.category = keyPointTree
    exportJSON(data, 'fenbiData')
}

const registerExportBtn = () => {
    var html = `<button class="export-question">导出错题</button>`
    var wrap = document.querySelector('#keypoint-list .sort-filter')
    wrap && wrap.insertAdjacentHTML('beforeend', html)
    wrap && wrap.addEventListener('click', e => {
        var el = e.target
        if (el && el.classList.contains('export-question')) {
            console.log('导出错题')
            exportWrongQuestion()
        }
    })
}

var sleep = (timeout = 1000) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}

// 导出阅读题
var exportRead = async () => {
    const set = new Set()
    for (let i = 0; i < 15; i++) {
        const data = await post(
            'https://tiku.fenbi.com/api/xingce/exercises?app=web&kav=12&version=3.0.0.0',
            'type=3&keypointId=22339&limit=100&exerciseTimeMode=2'
        )
        await sleep(3000)
        data.sheet.questionIds.forEach(item => set.add(item))
        console.log(`第${i + 1}次加载100题`)
    }
    const result = await getSolutionByIds([...set])
    exportJSON(result, 'fenbiData')
}

window.exportRead = exportRead

var insertInputEl = () => {
    const el = document.createElement('input')
    const btn = document.createElement('button')
    el.className = 'input-answer'
    btn.className = 'btn-answer'
    btn.innerHTML = '点击提交'
    $('.exam-detail') && $('.exam-detail').appendChild(el)
    $('.exam-detail') && $('.exam-detail').appendChild(btn)
    $('.btn-answer') && $('.btn-answer').addEventListener('click', () => {
        selectAnswer()
    })
    console.log('插入成功吗')
}

var copyText = text => {
    var textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    // 隐藏此输入框
    textarea.style.position = 'fixed'
    textarea.style.clip = 'rect(0 0 0 0)'
    textarea.style.top = '10px'
    // 赋值
    textarea.value = text
    // 选中
    textarea.select()
    // 复制
    document.execCommand('copy', true)
    // 移除输入框
    document.body.removeChild(textarea)
}

var fbRegisterEventTotal = (pos) => {
    const html = $('.exam-detail').children
    const items = $$('.chapter-control-item')
    if (!items) return ;

    const item = items[pos]
    console.log('item', item)
    const question = item.querySelectorAll('span')
    const start = parseInt(question[0].textContent) - 1
    const end = parseInt(question[question.length-1].textContent)
    const html2 = Array.from(html).filter((item, index) => index >= start && index < end)
    let str = ''
    html2.forEach(item => str += item.innerHTML)
    const result = `<section _ngcontent-fenbi-web-exams-c64="" class="exam-detail bg-color-gray-bold">${str}</section>`
    return result.replaceAll('\x3C!---->', '')
}

var fbRegisterEvent = () => {
    // 按ctrl + Q， 复制到剪切板。
    window.addEventListener('keydown', e => {
        if (e.ctrlKey && e.keyCode === 81) {
            console.log('已粘贴到剪切板')
            var html = ''
            if (window.location.href.includes('www.mbadashi.com')) {
               html = $('.multiple-choice-content').innerHTML.replace(/<pre/g, "<div").replace(/<\/pre>/g, "</div>")
            } else {
                html = $('.exam-detail').innerHTML
            }
            copyText(html)
        } else if (e.altKey && e.keyCode >= 49 && e.keyCode <= 53) {
            html = fbRegisterEventTotal(e.keyCode-49)
            copyText(html)
        }
    })
}

var selectAnswer = () => {
    const questionList = $$('.exam-detail .options')

    const answer = $('.input-answer').value.replace(/ /g, '')
    for (let i = 0; i < questionList.length; i++) {
        // 选项
        const options = questionList[i].querySelectorAll('.theme-ques-option')
        const s = parseInt(answer[i])
        options[s-1].click()
    }
}

var fbMain = () => {
    fbRegisterEvent()
    setTimeout(() => {
        registerExportBtn()
        insertInputEl()
    }, 3000)
}

fbMain()

    // Your code here...
})();