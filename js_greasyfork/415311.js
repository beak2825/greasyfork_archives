// ==UserScript==
// @name         知乎批量提交
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎批量提交1
// @author       You
// @require	     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require	     https://lib.baomitu.com/vue/2.6.12/vue.min.js
// @match        *://www.zhihu.com/question/*
// @match        *://zhuanlan.zhihu.com/p/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/415311/%E7%9F%A5%E4%B9%8E%E6%89%B9%E9%87%8F%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/415311/%E7%9F%A5%E4%B9%8E%E6%89%B9%E9%87%8F%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

// 地址 https://greasyfork.org/zh-CN/scripts/387914-%E7%9F%A5%E9%81%93%E5%90%88%E4%BC%99%E4%BA%BA%E7%BC%96%E8%BE%91%E7%95%8C%E9%9D%A2%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7

$(function () {
    let key = "answerQueue";
    let answerQueue = GM_getValue(key) || [];
    let left = $(".Question-main,.WriteIndexLayout-main")[0].offsetWidth / 2 + 210;
    $(`<div id="my-app" style='display:flex;flex-direction:column;position: fixed;left:calc(50% - ${left}px);top:100px;width: 200px'>
            <button @click="clear" class='Button Button--blue' style="margin-bottom: 10px;" >清空</button>
            <button @click="add" class='Button Button--blue' style="margin-bottom: 10px;" >加入队列</button>
            <button @click="submit" class='Button Button--blue' style="margin-bottom: 10px;" >批量提交</button>
            <p style="max-width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
             v-for="(answer,index) in answerQueue" >
             <a href="javascript:void(0)" @click="removeThis(index)" title="删除此项">X </a><span :title="answer.text">{{answer.text}}</span></p>
        </div>`)
        .appendTo("body");

    new Vue({
        el: "#my-app",
        data: {
            answerQueue: answerQueue
        },
        mounted: function () {
            GM_addValueChangeListener(key, (name, old_value, new_value, remote) => {
                this.answerQueue = new_value;
                let submit = false;
                let newArray = [];
                for (let answer of new_value) {
                    if (answer.href === location.href && answer.needSubmit) {
                        answer.needSubmit = false;
                        submit = true;
                    }else{
                        newArray.push(answer);
                    }
                }

                GM_setValue('answerQueue', newArray);
                $(".AnswerForm-submit,.PublishPanel-button").click();
            });
        },
        methods: {
            add: function (event) {
                let answerQueue = GM_getValue(key);
                if (!answerQueue) {
                    answerQueue = [];
                }
                let type, text;
                if (/^https:\/\/www\.zhihu\.com\/question\/\d+\/answer\/\d+$/.test(location.href)) {//回答
                    if (!$(".AnswerForm-submit").length) {
                        alert(`点击“修改”使页面出现“修改”按钮再加入队列`);
                        return;
                    }
                    type = "回答";
                    text = $(".QuestionHeader-title").text();
                } else if (/^https:\/\/zhuanlan\.zhihu\.com\/p\/\d+\/edit$/.test(location.href)) {//文章
                    let gxButton = $(".PublishPanel-triggerButton");
                    if (!gxButton.length) {
                        // if (!$(".PublishPanel-button").length) {
                        alert(`点击“修改文章”使页面出现“更新”按钮再加入队列`);
                        return;
                    }
                    setTimeout(() => {
                        gxButton.click()
                    }, 100);

                    type = "文章";
                    text = $(".WriteIndex-titleInput textarea").val();
                }
                answerQueue.push({
                    href: location.href,
                    text: text,
                    type: type,
                });
                let map = new Map();
                for (let answer of answerQueue) {
                    map.set(answer.href, answer);
                }
                console.log(map);
                console.log(answerQueue);
                GM_setValue('answerQueue', Array.from(map.values()));
            },
            clear: function () {
                GM_setValue(key, []);
            },
            submit: function () {
                let answerQueue = GM_getValue(key);
                for (let answer of answerQueue) {
                    answer.needSubmit = true;
                }
                if (/^https:\/\/zhuanlan\.zhihu\.com\/p\/\d+\/edit$/.test(location.href)) {//文章
                    setTimeout(() => {
                        gxButton.click();
                        GM_setValue('answerQueue', answerQueue);
                    }, 100);
                }else{
                    GM_setValue('answerQueue', answerQueue);
                }
            },
            removeThis: function (index) {
                let answerQueue = GM_getValue(key);
                answerQueue.splice(index, 1);
                GM_setValue('answerQueue', answerQueue);
            }
        }
    });
});

