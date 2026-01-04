// ==UserScript==
// @name         知乎回答排序插件2021修复版
// @description  为知乎问题页面多添加两种排序方式，使用时建议下滑刷新足够的回答，再返回页头点击排序
// @match        https://www.zhihu.com/question/*
// @exclude      https://www.zhihu.com/question/*/answer/*
// @copyright    2017+, @余博伦
// @version 0.0.1.20211221031320
// @namespace https://greasyfork.org/users/473469
// @downloadURL https://update.greasyfork.org/scripts/437343/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E6%8E%92%E5%BA%8F%E6%8F%92%E4%BB%B62021%E4%BF%AE%E5%A4%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/437343/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E6%8E%92%E5%BA%8F%E6%8F%92%E4%BB%B62021%E4%BF%AE%E5%A4%8D%E7%89%88.meta.js
// ==/UserScript==
/**  
参考自https://greasyfork.org/zh-CN/scripts/30295-%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E6%8E%92%E5%BA%8F%E6%8F%92%E4%BB%B6 
十分感谢原作者
去除了对jquery的依赖

*/
(function() {
    'use strict';
    let wrapper = document.querySelector('#QuestionAnswers-answers')
    let toolbar = document.querySelector('#root > div > main > div > div:nth-child(10) > div:nth-child(2) > div > div.QuestionHeader-footer > div > div > div.QuestionButtonGroup')

    toolbar.style.width= '24rem'
    let byVoteBtn = document.createElement('button')
    byVoteBtn.id = "orderByVote"
    byVoteBtn.className = "Button Button--primary Button--green"
    byVoteBtn.innerText = "按赞数排序"
    toolbar.append(byVoteBtn);
    let byCommentsBtn = document.createElement('button')
    byCommentsBtn.id = "orderByComments"
    byCommentsBtn.className = "Button Button--primary Button--red"
    byCommentsBtn.innerText = "按评论数排序"
    toolbar.append(byCommentsBtn);
    // Your code here...
    var orderByVote = function(){
        let answerList = wrapper.querySelector(".List")
        let answerItems = answerList.querySelectorAll(".List-item")
        answerList.innerHTML=""
        let orderedAnswers = [].slice.call(answerItems).sort(function(a, b) {
        return b.querySelector('.VoteButton--up').innerText.split(" ")[1] - a.querySelector('.VoteButton--up').innerText.split(" ")[1];
        })
        orderedAnswers.forEach(function (p) {
            answerList.appendChild(p);
        });
    };

    var orderByComments = function () {
        let answerList = wrapper.querySelector(".List")
        let answerItems = answerList.querySelectorAll(".List-item")
        answerList.innerHTML=""
        let orderedAnswers = [].slice.call(answerItems).sort(function(a, b) {
        return b.querySelector('.ContentItem-actions .Button--plain').innerText.replace(/ 条评论/g, '') - a.querySelector('.ContentItem-actions .Button--plain').innerText.replace(/ 条评论/g, '')
        })
        orderedAnswers.forEach(function (p) {
            answerList.appendChild(p);
        });
    };
    //event listeners
    byVoteBtn.addEventListener("click", orderByVote);
    byCommentsBtn.addEventListener("click", byCommentsBtn);
})();