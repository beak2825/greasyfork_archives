// ==UserScript==
// @name         智慧树查成绩助手
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.3
// @description  用于查询智慧树期末考试成绩
// @author       洛白
// @match        https://hiexam.zhihuishu.com/atHomeworkExam/stu/examQ/doExamnew/*
// @grant GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @connect    *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458156/%E6%99%BA%E6%85%A7%E6%A0%91%E6%9F%A5%E6%88%90%E7%BB%A9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458156/%E6%99%BA%E6%85%A7%E6%A0%91%E6%9F%A5%E6%88%90%E7%BB%A9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var _self = unsafeWindow;
    var $ = _self.jQuery;
    var url = self.location.href;
    var mybutton, beasetag;
    //创建新元素
    mybutton = document.createElement("div");
    //搜寻body元素
    beasetag = document.querySelector("body");
    //将新元素作为子节点插入到body元素的最后一个子节点之后
    beasetag.appendChild(mybutton);
    //可以通过mybutton.innerHTML = "<button type='button'>启动</button><br><button type='button'>关闭</button>"来写入其他元素，如多个按钮
    mybutton.innerHTML = "查看成绩";
    //css样式为
    //position:fixed;生成固定定位的元素，相对于浏览器窗口进行定位。元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。
    //bottom:15px;距窗口底部15px
    //right:15px;距窗口右边15px
    //width:60px;内容的宽度60px
    //height:60px;内容的高度60px
    //background:black;内边距的颜色和内容的颜色设置为黑色，不包括外边距和边框
    //opacity:0.75;不透明度设置为0.75，1为完全不透明
    //color:white;指定文本的颜色为白色
    //text-align:center;指定元素文本的水平对齐方式为居中对齐
    //line-height:60px;设置行高，通过设置为等于该元素的内容高度的值，配合text-align:center;可以使div的文字居中
    //cursor:pointer;定义了鼠标指针放在一个元素边界范围内时所用的光标形状为一只手
    mybutton.style = "position:fixed;bottom:15px;right:15px;width:100px;height:60px;background:black;opacity:0.75;color:white;text-align:center;line-height:60px;cursor:pointer;";
    //通过匿名函数，设置点击该悬浮按钮后执行的函数
    let match = url.match(/doExamnew\/(\d+)\//);
    var number = match[1];
    var url_use = "http://hike-examstu.zhihuishu.com/zhsathome/examStuDir/Info?homeworkId=" + number + "&isDoHomework=0&date=2022-12-29T16:10:18.170Z&ticket=ST-91222-2f5fmR1KO6hp21SETcVP-passport.zhihuishu.com";
    mybutton.onclick = function () {
        GM_xmlhttpRequest({
            method: "GET",
            url: url_use,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                var json_data=JSON.parse(response.responseText);
                console.log(json_data);
                var ans="<div>总成绩"+json_data.rt.homeworkScore+"</div>";
                ans+="<div>答对率"+json_data.rt.relaScore+"%</div>";
                ans+="<div>折合成绩"+json_data.rt.answerScore+"</div>";

                $(
                    '<div style="border: 4px dashed rgb(217 75 75); width: 330px; height:750px;position: fixed; top: 0; left: 0; z-index: 99999; background-color: rgb(0 0 0 / 70%);color:rgb(255 255 255);overflow-y: auto;">' +
                    '<span style="font-size: 20px;"></span>' +
                    '<div style="font-size: medium;"><h2 text-align: center;>你的成绩</h2> ' + ans +
                    '</div>'
                ).appendTo('body');
            }
        });
    };
    console.log(url_use);

    // Your code here...
})();