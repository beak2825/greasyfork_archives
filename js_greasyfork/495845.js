// ==UserScript==
// @name         雷大宇专用--网课学习（学习，作业，考试究极版）
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  考试前，需要把作业全部刷一遍，该脚本适用于网址：【.jxjypt.cn】
// @author       JDL
// @match        https://kc.jxjypt.cn/*
// @icon         https://pic1.zhimg.com/v2-05c8ec332666cfa2dc12ab2f743cdbe1_l.jpg?source=32738c0c
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495845/%E9%9B%B7%E5%A4%A7%E5%AE%87%E4%B8%93%E7%94%A8--%E7%BD%91%E8%AF%BE%E5%AD%A6%E4%B9%A0%EF%BC%88%E5%AD%A6%E4%B9%A0%EF%BC%8C%E4%BD%9C%E4%B8%9A%EF%BC%8C%E8%80%83%E8%AF%95%E7%A9%B6%E6%9E%81%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/495845/%E9%9B%B7%E5%A4%A7%E5%AE%87%E4%B8%93%E7%94%A8--%E7%BD%91%E8%AF%BE%E5%AD%A6%E4%B9%A0%EF%BC%88%E5%AD%A6%E4%B9%A0%EF%BC%8C%E4%BD%9C%E4%B8%9A%EF%BC%8C%E8%80%83%E8%AF%95%E7%A9%B6%E6%9E%81%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const QUESTION = "question"
    var question = GM_getValue(QUESTION) || {}
    watch();
    // 遍历开始答题
    // traverse();
    openSolution();
    // 提交
    setTimeout(() => {
        // GM_setValue(QUESTION,{});
        submit();
    }, 6000)

    function init() {
        let param = {
            ele: document.createElement('div'),
            css: "position:fixed;" +
                "bottom:100px;" +
                "box-shadow:10px 10px 10px gray;" +
                "right:20px;" +
                "display:block;" +
                "font-size:14px;" +
                "color:#fff;" +
                "z-index:1000;" +
                "height:70px;" +
                "width:70px;" +
                "background:#3693ff;" +
                "border-radius:8px;" +
                "line-height:70px;" +
                "text-align:center;" +
                "cursor: pointer;"
        };
        document.querySelector('body').appendChild(((ele) => {
            ele.id = 'smart-topic';
            ele.innerHTML = '一键学答';
            ele.style.cssText = param.css;
            return ele;
        })(param.ele));
    }

    // 废弃，由于系统检测，只能一套一套来
    function traverse() {
        var traverse = document.getElementsByClassName('zt zt-goto')
        for (let i = 0; i < traverse.length; i++) {
            var text = traverse[i].innerHTML
            if (text === '开始答题') {
                traverse[i].click()
            }
        }
    }

    //自动展开答案
    function openSolution() {
        var zkjxs = document.getElementsByClassName('zkjx')
        if (zkjxs && zkjxs.length > 0) {
            for (let i = 0; i < zkjxs.length; i++) {
                zkjxs[i].click()
            }
            // 答题
            setTimeout(() => {
                answer();
            }, 1500)
        } else {
            // 在线考试
            onlineExam()
        }
    }

    // 提交
    function submit() {
        var submit = document.getElementById('btn_submit')
        submit && submit.click()
    }
    // 正则匹配
    function removeFirstMatch(str, regex) {
        const match = str.match(regex);
        if (match) {
            const replaceWith = ''; // 用空字符串替换第一个匹配项
            return str.replace(regex, replaceWith);
        }
        return str; // 如果没有匹配，返回原字符串
    }

    // 在线考试
    function onlineExam() {
        var timus = document.getElementsByClassName('sub-dotitle')
        for (let i = 0; i < timus.length; i++) {
            var timuString = timus[i].innerText.replace(/\[(.*?)\]/, '').replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
            const regex = /\d+/; // 匹配数字
            const timu = removeFirstMatch(timuString, regex);
            const timidaan = question[timu]
            var answers = document.getElementsByClassName('sub-answer sub-picon-no clearfix ')
            if(answers[i] && answers[i].children && answers[i].children.length > 0) {
                for (let j = 0; j < answers[i].children.length; j++) {
                    var val = answers[i].children[j].getAttribute('data-value');
                    for (let k = 0; k < timidaan.length; k++) {
                        if (timidaan[k] == val) {
                            answers[i].children[j].click()
                        }
                    }
                }
            } else {
                var textarea = document.getElementsByClassName('e__textarea')
                for (let k = 0; k < textarea.length; k++) {
                    var areaIndex = textarea[k].getAttribute('data-orderid')
                    if(i+1 == areaIndex) {
                        textarea[k].value = timidaan
                    }
                }
            }
        }
    }
    //作业答题
    function answer() {
        var timus = document.getElementsByClassName('sub-dotitle')
        var wenzis = document.getElementsByClassName('solution')
        for (let i = 0; i < wenzis.length; i++) {
            var timuString = timus[i].innerText.replace(/\[(.*?)\]/, '').replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
            const regex = /\d+/; // 匹配数字
            const timu = removeFirstMatch(timuString, regex);
            console.log('题目=====', timu)

            var answers = document.getElementsByClassName('sub-answer sub-picon-no clearfix ')
            if(answers[i] && answers[i].children && answers[i].children.length > 0) {
                // 自动选择选择题答案
                var daan = wenzis[i].innerHTML
                console.log('qqqq=====', daan)
                var daanZimu = daan.replace(/[^a-zA-Z]/g, '')
                console.log('题目真正的答案============', daanZimu)
                question[timu] = daanZimu
                GM_setValue(QUESTION,question);
                for (let j = 0; j < answers[i].children.length; j++) {
                    var val = answers[i].children[j].getAttribute('data-value');
                    for (let k = 0; k < daan.length; k++) {
                        if (daan[k] == val) {
                            answers[i].children[j].click()
                        }
                    }
                }
            } else {
                var textarea = document.getElementsByClassName('e__textarea')
                if (textarea.length > 0) {
                    // 自动填充填空、简答题答案
                    var txt = wenzis[i].innerHTML.substring(5)
                    for (let k = 0; k < textarea.length; k++) {
                        var areaIndex = textarea[k].getAttribute('data-orderid')
                        if(i+1 == areaIndex) {
                            console.log('dddd=====', txt)
                            question[timu] = txt.substring(0, txt.length - 7)
                            textarea[k].value = txt.substring(0, txt.length - 7)
                            GM_setValue(QUESTION,question);
                        }
                    }
                }
            }
        }
    }

    function watchanswer() {
        var answers = document.getElementsByClassName('sub-answer')
        if (answers && answers.length) {
            console.log('dddd==0000===', answers[0].children)
            for (let i = 0; i < answers[0].children.length; i++) {
                var val = answers[0].children[i].getAttribute('data-value');
                answers[0].children[i].click()
            }
        }
    }

    //观看课程
    function watch() {
        var courses = document.getElementsByClassName('course-list-txt')
        for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < courses[i].children[0].children.length; j++) {
                courses[i].children[0].children[j].click();
                watchanswer();
            }
        }
    }
})();