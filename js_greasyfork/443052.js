// ==UserScript==
// @name         AnswerTip
// @description  http://tampermonkey.net/
// @version      0.32
// @author       polygon
// @icon         data:image/png;base64,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
// @match        https://changjiang.yuketang.cn/*/exercise/*
// @match        https://changjiang-exam.yuketang.cn/exam/*
// @match        https://changjiang.yuketang.cn/*
// @match        https://www.xuetangx.com/*/exercise/*
// @match        https://mooc1.chaoxing.com/work/doHomeWorkNew*
// @match        https://examination.xuetangx.com/exam/*
// @match        https://onlineexamh5new.zhihuishu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addElement
// @run-at       document-end
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/443052/AnswerTip.user.js
// @updateURL https://update.greasyfork.org/scripts/443052/AnswerTip.meta.js
// ==/UserScript==
(function() {
    const order = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    const n = 10
    const wait = 3  // s
    const configs = {
        'onlineexamh5new.zhihuishu.com': {
            main: '.examPaper_subject',  // 答案要展示的父级元素节点，会append到该Node下
            question: '.subject_describe',  // 问题，题目所在位置，其innerText属性是问题（不含选项）
            options: '.subject_node p span, .node_detail p',  // 每个选项的位置，会根据它匹配多个Node
            select: 'onChecked',  // 点击后，相应属性增加值，因为有的选项需要多次点击，所以增加此用于判断是否点击上
            // 一些自定义添加的答案区域style
            style: `
                background-color: #f5f5f5;
                height: 200px;
                overflow-y: scroll;
            `
        },
        'changjiang.yuketang.cn': {
            main: '.item-body',  // 答案要展示的父级元素节点，会append到该Node下
            question: '.problem-body',  // 问题，题目所在位置，其innerText属性是问题（不含选项）
            options: '.item-body ul li label',  // 每个选项的位置，会根据它匹配多个Node
            select: 'is-checked',  // 点击后，相应属性增加值，因为有的选项需要多次点击，所以增加此用于判断是否点击上
            // 一些自定义添加的答案区域style
            style: `
                background-color: #f5f5f5;
            `
        },
        'changjiang-exam.yuketang.cn': {
            main: '.item-body',
            question: 'h4',
            options: '.item-body ul li label',
            select: 'is-checked',
            style: `
                background-color: #f5f5f5;
                height: 200px;
                overflow-y: scroll;
            `
        },
        'www.xuetangx.com': {
            main: '.courseActionLesson',
            question: '.leftQuestion',
            options: '.leftradio',
            select: 'active',
            style: `
                background-color: #fcfcfc;
                border: 1px solid hsla(0,0%,81.2%,.31);
                width: 500px;
                height: 200px;
                overflow-y: scroll;
            `
        },
        'mooc1.chaoxing.com': {
            main: '.TiMu',
            question: '.Zy_TItle div p',
            options: 'ul li',
            select: 'Hover',
            style: `
                background-color: #fcfcfc;
                height: 200px;
                overflow-y: scroll;
            `
        },
        'examination.xuetangx.com': {
            main: '.subject-item',
            question: '.item-body',
            options: 'ul li',
            select: 'is-checked',
            style: `
                background-color: #fcfcfc;
                height: 200px;
                overflow-y: scroll;
            `
        }
    }
    let url = window.location.href
    let host = Object.keys(configs).filter((host) => {
        if (url.includes(host)) {
            return true
        }
        return false
    })
    if (host.length == 0) return
    const config = configs[host[0]]
    GM_addStyle(`
            .answer-polygon {
                ${config.style};
                font-size: 14px;
                border-radius: 4px;
                padding: 10px 15px;
                margin-bottom: 20px;
                text-align: left;
                font-family: -apple-system,SF UI Text,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,"sans-serif";
            }
        `)
    let cookieSet = () => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://tiku.fenbi.com/android/tourist/enter',
            responseType: 'json',
            onload: (xhr) => {
                const data = xhr.response
                let cookie = `userid=${data.userId}; tourist=${data.touristToken};`
                console.log(cookie)
            }
        })
    }
    let clickOption = (optionNodes, text) => {
        optionNodes.forEach((optionNode) => {
            let option_text = optionNode.innerText.replaceAll('[p]', '').replaceAll('[/p]', '').split('\n').slice(-1)
            console.log(option_text, text)
            if (option_text.includes(text)||text.includes(option_text)) {
                let id = setInterval(() => {
                    if (!optionNode.innerHTML.includes(config.select)) {
                        optionNode.click()
                    } else {
                        clearInterval(id)
                    }
                }, 3000)
            }
        })
    }
    let answerParser = (data, answerNode, optionNodes, mainNode) => {
        let s = ''
        let answer_groups = []
        for (let i=0;i<n;i++) {
            let item = data['questionList'][i]
            // 1 题目
            s += item['content'].replaceAll('[', '<').replaceAll(']', '>') + '<br/>'
            const re = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*()——|{}【】‘；：”“'。，、？%+_]", 'g');
            let same = item['content'].replaceAll(re, '').includes(mainNode.getAttribute('currentQuestion').replaceAll(re, '').split('\n')[0])
            if (same) {
                answer_groups.push([])
            }
            // 2 正确答案
            // 2.1 选项形式 ABCD
            if (item['correctAnswer'].hasOwnProperty('choice')) {
                let choice_indexes = item['correctAnswer']['choice'].split(',')
                if (choice_indexes.length > 0) {
                    let choice_orders = []
                    for (let j=0;j<choice_indexes.length;j++) {
                        let choice_order = order[parseInt(choice_indexes[j])]
                        if (!choice_orders.includes(choice_order)) {
                            choice_orders.push(choice_order)
                        }
                    }
                    s += '<p>' + choice_orders.join('') + '</p><br/>'
                    // choice_orders = ['A', 'B', 'C']
                    // 选项
                    if (item['accessories'].length > 0){
                        item['accessories'] = item['accessories'].filter((item) => {
                            return (item.hasOwnProperty('options'))
                        })
                        if (item['accessories'].length > 0 && item['accessories'][0]['options'].length > 0) {
                            let options = item['accessories'][0]['options']
                            for (let j=0;j<options.length;j++) {
                                let option = options[j].replace('[p]', '').replace('[/p]', '')
                                if (choice_orders.includes(order[j])) {
                                    if (same) {
                                        answer_groups[answer_groups.length-1].push(options[j])
                                    }
                                    // if (same) clickOption(optionNodes, options[j])
                                    s += `<b>[${order[j]}] ` + option + '</b><br/>'
                                } else {
                                    s += `[${order[j]}] ` + option + '<br/>'
                                }

                            }

                        }
                    }
                }
            // 2.2 文字描述形式
            } else if (item['correctAnswer'].hasOwnProperty('answer')) {
                let text = item['correctAnswer']['answer']
                    .replace('', '<br/>')
                    .replace('\u0001', '<br/>')
                    .replace('\x01', '<br/>')
                    .replace(/-+/g, '<br/>')
                    .replaceAll('[', '<')
                    .replaceAll(']', '>')
                    .replace(';;', ';')
                if (same) {
                    text.replace('<p>', '')
                        .replace('</p>', '')
                        .split('<br/>')
                        .forEach((option_text) => {
                            answer_groups[answer_groups.length-1].push(option_text)
                            // clickOption(optionNodes, option_text)
                        })
                }
                s += '<b>' + text + '</b>'
            }
            if (i < n-1) {
                s += '<br/><hr/><br/>'
            }
        }
        // 判断是否为多选
        let multi = false
        answer_groups.forEach((group) => {
            if (group.length > 1) {
                multi = true
            }
        })
        if (multi) {
            answer_groups = answer_groups.filter((group) => {
                return group.length > 1
            })
        }
        let answers = []
        if (answer_groups.length == 1) {
            answers = answer_groups[0]
        } else {
            // 取交集
            // 得到所有答案元素
            let answer_items = []
            answer_groups.forEach((group) => {
                group.forEach((item) => {
                    if (!answer_items.includes(item)) {
                        answer_items.push(item)
                    }
                })
            })
            answers = answer_items.filter((item) => {
                let b = true
                answer_groups.forEach((group) => {
                    if (!group.includes(item)) {
                        b = false
                    }
                })
                return b
            })
        }
        console.log(answers)
        answers.forEach((answer) => {
            clickOption(optionNodes, answer)
        })
        answerNode.innerHTML = s
    }
    let searchAnswer = (text, answerNode, optionNodes, mainNode) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://schoolapi.fenbi.com/college/android/search-item/search?format=ubb&searchType=2&text=' + encodeURIComponent(text),
            responseType: 'json',
            onload: (xhr) => {
                let res = xhr.response
                let enc = res['data']
                if (enc == null) {
                    if (res.errMessage.includes('次数')) {
                        cookieSet()
                    }
                    answerNode.innerHTML = xhr.response.errMessage
                    setTimeout(() => {
                        mainNode.setAttribute('currentQuestion', '')
                    }, wait * 1000);
                    return
                }
                // 解密
                let t = new Date().valueOf()
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `http://101.35.131.22:5500/decrypt`,
                    headers:  {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: `enc=${enc}`,
                    responseType: 'text',
                    onload: (xhr) => {
                        let data = JSON.parse(xhr.responseText)
                        answerParser(data, answerNode, optionNodes, mainNode)
                    }
                })
            },
            ontimeout: function () {
                answer.innerHTML = "No Sugesstion"
            }
        })
    }
    cookieSet()
    let id = setInterval(() => {
        let mainNodes = document.querySelectorAll(config.main)
        if (mainNodes.length == 0) return
        clearInterval(id)
        mainNodes.forEach(function(mainNode) {
            mainNode.setAttribute('currentQuestion', '')
            setInterval(() => {
                let questionNode = mainNode.querySelector(config.question)
                if (questionNode == null) return
                let text = questionNode.innerText.slice(0, 233)
                if (text == mainNode.getAttribute('currentQuestion')) return
                mainNode.setAttribute('currentQuestion', text)
                let answerNode = mainNode.querySelector('.answer-polygon')
                if (answerNode == null) {
                    answerNode = document.createElement('div')
                    answerNode.setAttribute('class', 'answer-polygon')
                    mainNode.append(answerNode)
                }
                try {
                    answerNode.innerHTML = 'searching...'
                } catch {
                    return
                }
                let optionNodes = mainNode.querySelectorAll(config.options)
                searchAnswer(text, answerNode, optionNodes, mainNode)
            }, 6000)
        })
    }, 233)
})();