// ==UserScript==
// @name         智慧树互动分Helper
// @namespace   无名
// @version      1.1.4
// @description  让你愉快的水问答分
// @author       洛白
// @match        https://qah5.zhihuishu.com/*
// @connect      cx.icodef.com
// @connect      v.api.aa1.cn
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @connect    hike-ai-course.zhihuishu.com
// @connect    *

// @downloadURL https://update.greasyfork.org/scripts/452668/%E6%99%BA%E6%85%A7%E6%A0%91%E4%BA%92%E5%8A%A8%E5%88%86Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/452668/%E6%99%BA%E6%85%A7%E6%A0%91%E4%BA%92%E5%8A%A8%E5%88%86Helper.meta.js
// ==/UserScript==
const input = document.createEvent("HTMLEvents");
input.initEvent("input", true, false);
const e = document.createEvent("MouseEvents");
e.initEvent("click", true, true);
var _self = unsafeWindow;
var url = location.pathname;
var $ = _self.jQuery;
var xhr = _self.XMLHttpRequest;
var json1 = {};
var Ans = '';
var l = 0;
let ComentsArray = [];
var Data = 0;
var text = 0;
var USE = 0;//Data 是否赋值
let answer=["我认为","我觉得","我认为主要有以下几点","就一般普遍性而言","应该是可以的把","从我个人而言，我更加偏向于","以我拙见，我认为有以下几个理由："]
_self.XMLHttpRequest = function () {//先设置请求
    var ajax = new xhr();
    ajax.onload = function (e) {
        Ans = ''
        console.log(this.responseURL);
        if (this.status != 200 || !this.responseURL.match(/getAnswerInInfoOrderByTime/)) return;
        var obj = JSON.parse(this.responseText);
        var conments = obj.rt.answerInfos;
        l = conments.length;
        for (var i = 0; i < conments.length; i++) {
            ComentsArray.push(conments[i].answerContent);
        }
        GM_xmlhttpRequest({
            headers: { "Content-Type": "application/json;charset=UTF-8" },
            method: 'POST',
            url: 'http://127.0.0.1:5000/print',
            dataType: "json",
            data: JSON.stringify(obj.rt.answerInfos),
            onload: function (xhr) {
                console.log('ok');
                console.log(xhr.response);
                var dataAt = xhr.response.replace(/(\r\n)|(\n)/g, '\\n');
                Data = JSON.parse(dataAt);
                USE = 1;
                dataStr = dataAt;
                var ans = "",ans1="";
                var IdSentence = "DivSentence";
                var IdWord = "DivWord";
                var IdAnswer = "DivAnswer";
                for (var i = 0; i < Data.sentence.length; i++) {
                    IdSentence += i.toString();
                    ans += '<div id=';
                    ans += IdSentence + " >";
                    ans += "【"+Data.sentence[i][0] + "  " + (Data.sentence[i][1]).toString()+"】";
                    ans += '</div>\n';
                    IdSentence = "DivSentence";
                }
                ans += '<h2 text-align: center;>词语</h2>\n'
                for (var i = 0; i < Data.word.length; i++) {
                    IdWord += i.toString();
                    ans += '<div id=';
                    ans += IdWord + " >";
                    ans += "【"+Data.word[i][0] + "  " + (Data.word[i][1]).toString()+"】";
                    ans += '</div>\n';
                    IdWord = "DivWord";
                }
                for (var i = 0; i < answer.length; i++) {
                    IdAnswer += i.toString();
                    ans1 += '<div id=';
                    ans1 += IdAnswer + " >";
                    ans1 += "【"+answer[i]+"】";
                    ans1 += '</div>\n';
                    IdAnswer = "DivAnswer";
                }
                ans1+="</div>"
                text = document.querySelector('textarea');//获取输入框
                $(
                    '<div style="border: 4px dashed rgb(217 75 75); width: 330px; height:750px;position: fixed; top: 0; left: 0; z-index: 99999; background-color: rgb(0 0 0 / 70%);color:rgb(255 255 255);overflow-y: auto;">' +
                    '<span style="font-size: 20px;"></span>' +
                    '<div style="font-size: medium;"><h2 text-align: center;>句子</h2> ' + ans +
                    '</div>'
                ).appendTo('body');
                $(
                    '<div style="border: 4px dashed rgb(217 75 75); width: 330px;height:750px; position: fixed; top: 0; right: 0; z-index: 99999; background-color:rgb(0 0 0 / 70%);color:rgb(255 255 255);overflow-y: auto;">' +
                    '<span style="font-size: medium;"></span>' +
                    '<div style="font-size: medium;"><h2 text-align: center;>常用水词</h2>' + ans1 +
                    '</div>'
                ).appendTo('body');
                //$('body {-webkit-user-select: true;-moz-user-select: true;-ms-user-select: true;user-select: true;}').appendTo('head');
                if(Data.sentence[Data.sentence.length - 1][0]!=null)
              { text.value = Data.sentence[Data.sentence.length - 1][0];}
                //console.log(Data.word.length);
                for (var i1 = 0; i1 < Data.sentence.length; i1++) {
                    //   console.log(type(i1));
                    (function (i1) {
                        $("#DivSentence" + i1.toString()).on("click", function () {
                           // console.log(i1.toString());
                           text.innerText = Data.sentence[i1][0];
                           text.value = Data.sentence[i1][0];
                        });
                    })(i1)
                }
                for (var i2 = 0; i2 < Data.word.length; i2++) {
                    console.log($("#DivWord" + i2.toString()));
                   (function (i2) {
                        $("#DivWord" + i2.toString()).on("click", function () {
                           text.innerText =text.value+ Data.word[i2][0];
                           text.value =text.value+ Data.word[i2][0];
                        });
                    })(i2)
                }
                for (var i2 = 0; i2 < answer.length; i2++) {
                    console.log($("#DivAnswer" + i2.toString()));
                   (function (i2) {
                        $("#DivAnswer" + i2.toString()).on("click", function () {
                           text.innerText =answer[i2]+text.value;
                           text.value =answer[i2]+text.value;
                        });
                    })(i2)
                }
                text.value = Data.sentence[Data.sentence.length - 1][0];
            }
        });
        console.log("======================ANS=====================");

        $('#app > div > div.my-answer-btn.tool-show').click();
        setTimeout(detail, 100);
        console.log("======================ANS=====================");

        //     $(
        //      '<div style="border: 2px dashed rgb(0, 85, 68); width: 330px; position: fixed; top: 0; left: 0; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow: auto;">' +
        //   '<span style="font-size: medium;"></span>' +
        //   '<div style="font-size: medium;">答案：+'+Ans+'</div>'
        // ).appendTo('body');
    };
    return ajax;
};

async function detail() {
    const btn = document.querySelector('.my-answer-btn');//我来回答
    if (btn == null) return//如果没有回答按钮
    btn.dispatchEvent(e)//向一个指定的事件目标派发一个事件,  并以合适的顺序同步调用目标元素相关的事件处理函数。标准事件处理规则(包括事件捕获和可选的冒泡过程)同样适用于通过手动的使用dispatchEvent()方法派发的事件。
    setTimeout(() => {
        const text = document.querySelector('textarea')//获取输入框
        if (USE) { }


        const dialog = document.querySelector('.header-title')
        if (!text) return;
        text.oncut = "return true"
        text.onpaste = "return true"
        text.oncopy = "return true"
        // Participles();
        text.dispatchEvent(input)
        const btn = document.querySelector('div.up-btn.set-btn')
        if (btn == null) return
        $('#app > div > div.questionDialog > div > div > div.el-dialog__body > div > div.dialog-bottom.clearfix > div').click();
        console.log(btn);
        btn.click();
        //dialog.innerHTML += Render()
        //  binding()
    }, 200)
    setTimeout(function () {
    }, 1000);
}