// ==UserScript==
// @name         华医网自动答题（仅限刷完视频的课程）
// @namespace    http://tampermonkey.net/
// @version      2024-11-04
// @description  123
// @author       You
// @match        https://cme28.91huayi.com/pages/course.aspx?cid=*
// @match        https://cme28.91huayi.com/pages/exam.aspx?cwid=*
// @match        https://cme28.91huayi.com/pages/exam_result.aspx?cwid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91huayi.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516325/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E4%BB%85%E9%99%90%E5%88%B7%E5%AE%8C%E8%A7%86%E9%A2%91%E7%9A%84%E8%AF%BE%E7%A8%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/516325/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E4%BB%85%E9%99%90%E5%88%B7%E5%AE%8C%E8%A7%86%E9%A2%91%E7%9A%84%E8%AF%BE%E7%A8%8B%EF%BC%89.meta.js
// ==/UserScript==

(function () {

    // 一秒后执行
    setTimeout(start, 1000);

    // 启动方法
    function start() {
        // 待考试url
        const todoUrl = 'https://cme28.91huayi.com/pages/exam_result.aspx?cwid=';
        const doingUrl = 'https://cme28.91huayi.com/pages/exam.aspx?cwid=';
        const courseUrl = 'https://cme28.91huayi.com/pages/course.aspx?cid=';

        // 考试通过页面
        if (window.location.href.includes(todoUrl)) {
            if (document.getElementsByClassName('tips_text')[0].innerText.includes('未通过')) {
                // 考试未通过，采集答案
                const answerTitle = localStorage.getItem("answer");
                let answerTitleMap;
                if (answerTitle === null || answerTitle === undefined) {
                    answerTitleMap = new Map()
                } else {
                    answerTitleMap = jsonToMap(answerTitle);
                }

                const state_cour_lis = document.getElementsByClassName('state_cour_lis');
                // 题目集合
                for (let stateCour of state_cour_lis) {
                    // 正确答案，跳过
                    const flag = stateCour.getElementsByClassName('state_error')[0].getAttribute('src').includes('bar_img.png');
                    if (flag) {
                        continue;
                    }
                    const state_lis_text = stateCour.getElementsByClassName('state_lis_text');
                    const questionTitle = getContentAfterFirstSeparator(state_lis_text[0].getAttribute('title')); // 题目标题
                    const answerTitle = state_lis_text[1].getAttribute('title'); // 答案标题
                    if (answerTitleMap.has(questionTitle)) {
                        answerTitleMap.set(questionTitle, answerTitleMap.get(questionTitle) + ',' + answerTitle)
                    } else {
                        answerTitleMap.set(questionTitle, answerTitle)
                    }
                }
                console.log('缓存错误答案：', answerTitleMap);
                localStorage.setItem('answer', mapToJson(answerTitleMap));
                setTimeout(() => {
                    document.getElementsByClassName('state_foot_btn state_edu')[1].click();
                }, 3000);
            } else {
                // 考试通过，更新缓存
                const todo = getCache(false);
                todo.set(new URLSearchParams(window.location.search).get('cwid'), '已完成')
                localStorage.setItem('todo', mapToJson(todo))
                localStorage.removeItem('answer');
                // 查找待考试
                const cwrid = findKeyByValueInMap(todo, '待考试');

                setTimeout(()=>{
                    // 跳转考试页面
                    window.location.href = doingUrl + cwrid;
                },3000)
            }
        }
        // 答题页面
        if (window.location.href.includes(doingUrl)) {
            console.log("开始答题");
            const q_nameList = document.getElementsByClassName('tablestyle');
            console.log(`页面一共有${q_nameList.length}道题目`)

            // 循环题目
            for (let q_nameTmp of q_nameList) {
                let q_name = q_nameTmp.getElementsByClassName('q_name')[0];
                // 题目id
                const data_qid = q_name.getAttribute('data-qid');
                const q_nametitle = getContentAfterFirstSeparator(q_name.textContent);

                // 选项集合
                const qo_nameList = document.getElementsByClassName('qo_name');

                // 已选标记位
                let breakFlag = false;

                // 循环选项
                for (let qo_name of qo_nameList) {
                    const elementsByTagNameElement = q_nameTmp.getElementsByTagName('tbody')[0];
                    const elementsByTagName = elementsByTagNameElement.getElementsByTagName('label');

                    for (let elementsByTagNameElement1 of elementsByTagName) {
                        const label = elementsByTagNameElement1.textContent;
                        const labelText = removeExtraSpacesAndNewlines(label);
                        const qo_nameId = qo_name.getAttribute('name');
                        if (breakFlag || !qo_nameId.includes(data_qid)) {
                            // 执行跳出循环后的逻辑
                            continue;
                        }
                        console.log(`开始答题，题目：${q_name.innerText},答案：${labelText}`)
                        // 获取缓存Cache
                        const answerCache = localStorage.getItem('answer');
                        // 首次加载，没有缓存情况，直接使用第一次遇到的选项
                        if (answerCache === null || answerCache === undefined) {
                            // 点击选项
                            elementsByTagNameElement1.click();
                            // 已选标记位
                            breakFlag = true;
                        } else {
                            let map = jsonToMap(answerCache);
                            let value = map.get(q_nametitle);
                            if (value === null || value === undefined) {
                                // 点击
                                elementsByTagNameElement1.click();
                                breakFlag = true;
                            } else {
                                value = String(value);
                                if (value.includes(labelText)) {
                                    console.log(`排除答案：${labelText}`)
                                } else {
                                    // 点击
                                    elementsByTagNameElement1.click();
                                    breakFlag = true;
                                }
                            }

                        }
                    }


                }
            }

            console.log('模拟提交')
            setTimeout(() => {
                document.getElementById('btn_submit').click()
            }, 3000)
        }

        // 课程页面
        if (window.location.href.includes(courseUrl)) {
            const todo = getCache(true);
            console.log(todo);
            // 查找待考试
            const cwrid = findKeyByValueInMap(todo, '待考试');
            // 跳转考试页面
            window.location.href = doingUrl + cwrid;
            console.log("课程页面")
        }
    }

    function removeExtraSpacesAndNewlines(str) {
        return str.replace(/\s+/g, ' ').replace(/\n/g, '').trim();
    }

    function getCache(needUpdate) {
        // 查看缓存是否有有未考试的课程
        let todo = localStorage.getItem('todo')
        if (todo === null || needUpdate) {
            let todoMap = new Map();
            const course = document.getElementsByClassName('course');
            if (course.length === 0) {
                return;
            }
            for (let courseElement of course) {
                const spans = courseElement.getElementsByTagName('span');
                const value = spans[0].innerText + '';
                const key = spans[1].getAttribute('data-cwrid') + '';
                todoMap.set(key, value);
                console.log('已添加课程：%s，当前状态：%s', key, value)
            }
            localStorage.setItem('todo', mapToJson(todoMap));
            return todoMap;
        } else {
            return jsonToMap(todo);
        }
    }

    function getContentAfterFirstSeparator(str) {
        let strTmp = String(str)
        let index = strTmp.indexOf('、');
        if (index!== -1) {
            return strTmp.substring(index + 1);
        } else {
            return strTmp;
        }
    }

    function findKeyByValueInMap(map, value) {
        for (const [key, val] of map) {
            if (val === value) {
                return key;
            }
        }
        return null;
    }

    function jsonToMap(jsonStr) {
        const obj = JSON.parse(jsonStr);
        const map = new Map();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                map.set(key, obj[key]);
            }
        }
        return map;
    }

    function mapToJson(map) {
        if (map === null || map.size === 0) {
            return;
        }
        const obj = {};
        for (const [key, value] of map) {
            obj[key] = value;
        }
        return JSON.stringify(obj);
    }
})();
