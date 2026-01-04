// ==UserScript==
// @name         知乎谢邀自动不感兴趣功能
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可以自动点击不感兴趣
// @author       Kaze.Liu
// @match        https://www.zhihu.com/creator/featured-question/invited
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420110/%E7%9F%A5%E4%B9%8E%E8%B0%A2%E9%82%80%E8%87%AA%E5%8A%A8%E4%B8%8D%E6%84%9F%E5%85%B4%E8%B6%A3%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/420110/%E7%9F%A5%E4%B9%8E%E8%B0%A2%E9%82%80%E8%87%AA%E5%8A%A8%E4%B8%8D%E6%84%9F%E5%85%B4%E8%B6%A3%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var setting = false;
    var kazeBtn = document.createElement('KazeBtn');
    kazeBtn.innerHTML = `<div class="kazeArea"><div class='btnArea'><div class="notInterested">开始自动不感兴趣</div><span class="kazesetting">设置</span></div>` +
        `<div style="margin-top:10px"><span>回答数达到</span><input type='number' class="kazeanswer" value='30'/><span>以上的不清除</span></div>` +
        `<div style="margin-top:10px"><span>关注数达到</span><input type='number' class="kazeattention" value='30'/><span>以上的不清除</span></div>`;
    document.getElementsByTagName('main')[0].appendChild(kazeBtn);
    var kazestyle = document.createElement('style');
    kazestyle.innerHTML = `
    .kazeArea {
        position: fixed;
        top: 62px;
        right: 10px;
        display: flex;
        flex-direction: column;
        background: #fff;
        align-items: flex-end;
        overflow: hidden;
        width: 220px;
        height: 40px;
        padding: 5px;
        transition: all 0.5s;
    }
    .kazeanswer,.kazeattention{
        width:50px;
    }
    .kazeArea .btnArea {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 210px;
    }
    
    .kazeArea .notInterested,
    .kazeArea .kazesetting {
        border: 1px solid #0084ff;
        color: #fff;
        background: #0084ff;
        padding: 10px;
        cursor: pointer;
    }
    
    .kazeArea.active {
        width: 230px;
        height: 127px;
    }
    .kazeError{
        background: #23ade5;
        color: #fff;
    }
    `;
    document.getElementsByTagName('main')[0].appendChild(kazestyle);
    let answerIndex = 0;
    let removeAnswer = 0;
    let removeAnswerError = 0;
    document.querySelectorAll(`.notInterested`)[0].addEventListener('click', event => {
        var el = document.querySelectorAll(`.QuestionItem`);
        answerIndex = el.length;
        for (let index = 0; index < el.length; index++) {
            const element = el[index];
            if (index == 2) debugger;
            var a = element.querySelectorAll(`.ContentItem-statusItem`);
            if (a != null && a.length > 0) {
                let statusItem = a[0].innerText.split(' ');
                //标准格式
                if (statusItem != null && statusItem.length == 5) {
                    if (statusItem[1] == "万浏览") {
                        //热
                        var answer = parseFloat(statusItem[3]);
                        let kazeanswer = parseFloat(document.querySelectorAll(`.kazeanswer`)[0].value);
                        if (kazeanswer > answer) {
                            removeAnswer++;
                            console.log(`删除 ${element.querySelectorAll(`.QuestionItem-title`)[0].innerText} ,该问题关注${attention}，回答${answer}`);
                            element.querySelectorAll(`button[data-tooltip-classname='QuestionItem-ignoreButtonTooltip']`)[0].click();
                        }
                    } else {
                        try {
                            var attention = parseFloat(statusItem[3]);
                            var answer = parseFloat(statusItem[0]);
                            let kazeanswer = parseFloat(document.querySelectorAll(`.kazeanswer`)[0].value);
                            let kazeattention = parseFloat(document.querySelectorAll(`.kazeattention`)[0].value);
                            if (kazeanswer > answer && kazeattention > attention) {
                                removeAnswer++;
                                console.log(`删除 ${element.querySelectorAll(`.QuestionItem-title`)[0].innerText} ,该问题关注${attention}，回答${answer}`);
                                element.querySelectorAll(`button[data-tooltip-classname='QuestionItem-ignoreButtonTooltip']`)[0].click();
                            }
                        } catch (error) {
                            removeAnswerError++;
                            console.log('解析失败 ' + element.querySelectorAll(`.QuestionItem-title`)[0].innerText);
                            element.querySelectorAll(`.QuestionItem-title`)[0].classList.add('kazeError');
                        }
                    }
                } else if (statusItem != null && statusItem.length == 4) {
                    if (statusItem[0] == '好物推荐') {
                        var answer = parseFloat(statusItem[2]);
                        let kazeanswer = parseFloat(document.querySelectorAll(`.kazeanswer`)[0].value);
                        if (kazeanswer > answer) {
                            removeAnswer++;
                            console.log(`删除 ${element.querySelectorAll(`.QuestionItem-title`)[0].innerText} ,该问题关注${attention}，回答${answer}`);
                            element.querySelectorAll(`button[data-tooltip-classname='QuestionItem-ignoreButtonTooltip']`)[0].click();
                        }
                    }
                } else {
                    removeAnswerError++;
                    console.log('解析失败 ' + element.querySelectorAll(`.QuestionItem-title`)[0].innerText);
                    element.querySelectorAll(`.QuestionItem-title`)[0].classList.add('kazeError');
                }
            }
        }
        alert(`处理完毕，点击确定后请等待服务器和页面响应，白屏为正常现象。共有问题${answerIndex}个，清除${removeAnswer}个，失败${removeAnswerError}个（已标记），保留${answerIndex-removeAnswer-removeAnswerError}个,详情请去控制台查看`);
    });

    document.querySelectorAll(`.kazesetting`)[0].addEventListener('click', event => {
        setting = !setting;
        if (setting) {
            document.querySelectorAll(`.kazeArea`)[0].classList.add('active');
        } else {
            document.querySelectorAll(`.kazeArea`)[0].classList.remove('active');
        }
    })
})();