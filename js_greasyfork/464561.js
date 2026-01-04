// ==UserScript==
// @name         学习通作业/考试题库提取（自用）
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  提取学习通写过的作业/考试个人答案转成文本题库便于浏览或分享给他人。
// @author       纸鸢花的花语
// @icon         https://p1.xywm.ltd/2023/04/21/a6b79200ba6260e62e9cf4a9f100d2a4.png
// @grant        none
// @match      *://mooc1.chaoxing.com/mooc2/work/view*
// @match      *://mooc1.chaoxing.com/exam-ans/exam/test/reVersionPaperMarkContentNew*
// @match      *://mooc1.chaoxing.com/mooc-ans/mooc2/work/*



// @downloadURL https://update.greasyfork.org/scripts/464561/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95%E9%A2%98%E5%BA%93%E6%8F%90%E5%8F%96%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/464561/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95%E9%A2%98%E5%BA%93%E6%8F%90%E5%8F%96%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 导入菜单栏样式
    function insertStyle() {
        const qStyle = document.createElement("style");
        qStyle.setAttribute("type", "text/css");
        qStyle.innerHTML = `

    ul {
        list-style: none;
    }

    #qBox {
        min-width: 250px;
        z-index: 9999;
        position: fixed;
        left: 20px;
        top: 20px;
        border-radius: 5px;
        border: 2.5px solid black;
        background-color: white;
    }

    #qBox>div {
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 10px;
        font-weight: bold;
    }

    #qBox span {
        margin: 5px;
    }

    #qBox span button {
        border: 0;
        display: inline-block;
        height: 30px;
        border-radius: 2px;
        min-width: 30px;
    }

    #qList {
        max-width: 500px;
        max-height: 100px;
        overflow: hidden;
        overflow-y: scroll;
    }
    #logo {
        width: 35px;
        height: 35px;
        border-radius: 2.5px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
        background-image: url('https://p1.xywm.ltd/2023/04/21/a6b79200ba6260e62e9cf4a9f100d2a4.png');
        background-size: cover;
    }
`;
    let headNode = document.querySelector('head');
    headNode.appendChild(qStyle);
}
    insertStyle();

    // 解析题库后显示在菜单栏
    function displayQS(qObject) {
        let qULs = "";

        for (let qNodeIndex = 0; qNodeIndex < qObject.length; qNodeIndex++) {
            let qNode = qObject[qNodeIndex];

            let qLIs = ""
            for (let qItemIndex = 0; qItemIndex < qNode["nodeList"].length; qItemIndex++) {
                let qItem = qNode["nodeList"][qItemIndex];
                let qSlt = qItem["slt"];
                let qSltString = "";
                for (let i = 0; i < qSlt.length; i++) {
                    qSltString +=
                        `
                <li>`
                    + qSlt[i] +
                        `
                </li>

                `
            }
                let qLI = `
            <li style="padding-left: 5px;margin: 10px 0;">
                <div>` + qItem["q"] + `</div>
                `+ qSltString + `<div style="color:blue;">` +
                    qItem["myAn"] +
                    `

                </div>` +
                    `
                <div style="color: red;text-align: right">` + qItem["an"] + `</div>
            </li>
        `;
            qLIs += qLI;
        }
        let qUL = `
        <ul style="padding: 0;">
            ` + qNode["nodeName"] + qLIs +
            `</ul>`;
        qULs += qUL;
    }
    const qList = document.getElementById("qList");
    qList.innerHTML = qULs;

}
    // 文本转下载成TXT文件
    function funDownload(content, filename) {
        if (content.length == 0) {
            alert("解析参数为空");
        } else {
            const eleLink = document.createElement('a');
            eleLink.download = filename;
            eleLink.style.display = 'none';
            const blob = new Blob([content]);
            eleLink.href = URL.createObjectURL(blob);
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
        }

    }
    // 获取作业标题
    const qTitle = document.querySelector(".mark_title").innerText;
    // console.log(qTitle);
    // 创建小菜单盒子
    let qBox = document.createElement("div");
    qBox.id = "qBox";
    qBox.innerHTML = `

<div style="background-color: #B2C6DF;" id="qTop">
    <span>
        学习通题库提取：
    </span>
    <span id="logoBox">
        <a href="http://zyhflower.xyz/" title="By 纸鸢花的花语">
            <div id="logo"></div>
        </a>
    </span>
</div>
<div>
    <span id="qTitle" style="color:blue">标题</span>
    <span>
        <button id="jxBtn">解析</button>
        <button id="xzBtn">下载</button>
    </span>
</div>
<hr style="margin: 0;">
<div style="display: block;">
    <div style="margin: 5px 0;">题目信息:</div>
    <div id="qList"></div>
</div>


`;
    document.body.insertBefore(qBox, document.body.firstElementChild);
    document.getElementById("qTitle").innerHTML = qTitle;



    // 获取要拖拽的标签元素
    const tag = document.querySelector('#qBox');
    const qTop = document.querySelector('#qTop');

    let isDragging = false; // 是否正在拖拽
    let startX, startY; // 开始拖拽时的鼠标位置
    let offsetX, offsetY; // 鼠标点与标签左上角的偏移量

    qTop.addEventListener('mousedown', e => {
        startX = e.clientX;
        startY = e.clientY;
        offsetX = startX - tag.offsetLeft;
        offsetY = startY - tag.offsetTop;
        isDragging = true;
    });

    document.addEventListener('mousemove', e => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            tag.style.left = `${x}px`;
            tag.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });




    // 解析按钮点击
    let jxBtn = document.getElementById("jxBtn");
    jxBtn.onclick = function () {
        mainQuestionS();
    }
    // 下载按钮点击
    let xzBtn = document.getElementById("xzBtn");
    xzBtn.onclick = function () {
        downloadQStr();
    }

    // 题库对象基本结构
    let allQsObject = [
        // {
        //     nodeName: "",
        //     nodeList: [
        //         {
        //             q: "",
        //             slt: [],
        //             an: "",
        //         },{}
        //     ]
        // },{}
    ]
    // 所有题目文本集合
    let allStr = "";
    // 解析网页标签
    function mainQuestionS() {
        allQsObject = [];
        allStr = "";
        let nodeBox = document.getElementsByClassName("mark_item");
        // console.log(nodeBox);
        // 遍历大题节点
        for (let nodeIndex = 0; nodeIndex < nodeBox.length; nodeIndex++) {

            // 创建每大题节点结构
            let node = {
                nodeName: "",
                nodeList: []
            }

            // 对象循环定位
            let qNode = nodeBox[nodeIndex]
            let typeTitle = "";
            if (qNode.querySelector(".type_tit")) {
               typeTitle = qNode.querySelector(".type_tit").innerText;
            }
            // console.log(typeTitle);
            allStr += typeTitle + "\n";
            // 标题加入表结构
            node["nodeName"] = typeTitle;

            let questions = qNode.querySelectorAll(".questionLi");
            for (let qIndex = 0; qIndex < questions.length; qIndex++) {
                // 创建每小题结构
                let qItem = {
                    slt: []
                }

                // 题目标签定位
                let question = questions[qIndex];
                // console.log(question);
                // 题目
                let qName = question.querySelector(".mark_name").innerText;
                // console.log(qName);
                allStr += qName + "\n";
                qItem["q"] = qName;

                // 题目选项
                let qSelectBox = question.querySelector(".mark_letter");
                // console.log(qSelectBox);
                // 判断是否为选择题
                if (qSelectBox) {
                    let qSelect = qSelectBox.getElementsByTagName("li");
                    for (let qSelectItemIndex = 0; qSelectItemIndex < qSelect.length; qSelectItemIndex++) {
                        let qSelectItem = qSelect[qSelectItemIndex].innerText;
                        if (qSelectItem) {
                            // console.log(qSelectItem);
                            allStr += qSelectItem + "\n";
                            qItem["slt"].push(qSelectItem);
                        }
                    }
                }
                try {
                // 题目正确答案,答案拼接
                let qAnwser = question.querySelector(".mark_answer").querySelectorAll(".colorGreen");
                let answerStr = "";
                for (let answersIndex = 0; answersIndex < qAnwser.length; answersIndex++) {
                    answerStr += qAnwser[answersIndex].innerText;
                }
                // 获取我的答案
                let qMyAnwser = question.querySelector(".mark_answer").querySelectorAll(".colorDeep");
                let myAnswerStr = qMyAnwser[0].innerText;
                console.log(myAnswerStr);
                allStr += myAnswerStr + "\n";
                qItem["myAn"] = myAnswerStr;
                // console.log(answerStr);
                allStr += answerStr + "\n";
                qItem["an"] = answerStr;

                node["nodeList"].push(qItem);
                } catch(err) {
                    console.log(err);
                }
            }
            allQsObject.push(node);
        }
        // console.log(allQsObject);
        displayQS(allQsObject);
    };

    // 题库本地下载
    function downloadQStr() {
        funDownload(allStr, qTitle + ".txt");
    }
})();