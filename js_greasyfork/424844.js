// ==UserScript==
// @name         N0ts - 美和易思自动考试答题
// @namespace    mail@n0ts.cn
// @version      0.1.9
// @description  看文档熬
// @author       N0ts，Lu
// @match        *://www.51moot.net/*
// @match        *://www.51moot.cn/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/424844/N0ts%20-%20%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9D%E8%87%AA%E5%8A%A8%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/424844/N0ts%20-%20%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9D%E8%87%AA%E5%8A%A8%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';
    createDom();
})();

// 创建隐藏元素
function createDom() {
    // 文本框
    let dom = document.createElement("div");
    dom.classList.add("n0ts");
    dom.innerHTML = `<div class="n0tsTip"></div>
    <div class="n0tsResult"></div>
    <input type="text" class="n0tsInput">`;
    document.body.appendChild(dom);
    // css
    let css = document.createElement("style");
    css.innerHTML = `*::selection {
        background: transparent;
    }

    html,
    body {
        position: relative;
        height: 100%;
    }

    .n0ts {
        position: fixed;
        left: 0;
        bottom: 0;
        opacity: 0;
        padding: 10px;
    }

    .n0ts:hover {
        opacity: 1;
    }

    .n0tsInput {
        outline: none;
        border: none;
        background: transparent;
        color: gray;
        border-bottom: 1px solid gray;
    }

    .n0tsTip,
    .n0tsResult {
        font-size: .6rem;
        color: gray;
    }`;
    document.body.appendChild(css);
    start();
}

// 文件路径
let fileUrl = [];
// 选择是否完成
let selectStatus = false;
// 是否自动答题
let autoGo = false;
// 当前题库数量
let resultCountNum = 0;
// 错误题库数量
let errResult = 0;
// 答案
let result = [];
// 答题间隔 毫秒
let autoTime = 10;
// 计时器
let timeOut;
// 当前答题数
let timeIndex = 0;

// 开始选择
function start() {
    // 文本框
    let inputDom = document.querySelector(".n0tsInput");
    // 提示框
    let tipDom = document.querySelector(".n0tsTip");
    // 结果
    let resultDom = document.querySelector(".n0tsResult");

    // 初始文本
    tipDom.innerText = "题库地址(txt)：";

    // 回车监听
    inputDom.onkeydown = function (e) {
        // 是否为回车
        if (e.keyCode != 13) {
            return;
        }

        // 内容存储
        let text = e.target.value;

        // 清空文本框
        inputDom.value = "";

        // fileUrl 清空
        fileUrl = [];

        // 重置程序
        if (text == "reload") {
            fileUrl = "";
            selectStatus = false;
            autoGo = false;
            resultCountNum = 0;
            errResult = 0;
            result = [];
            resultDom.innerText = "";
            return tipDom.innerText = "【已重制】题库地址(txt)：";
        }

        // 自动答题
        if (text == "autogo") {
            if (selectStatus) {
                if (!autoGo) {
                    tipDom.innerText = "已开启自动答题，再次输入关闭";
                } else {
                    tipDom.innerText = "已关闭自动答题，再次输入开启";
                }
                autoGo = !autoGo
                return startTimeOut();
            }
        }

        // 多套题库指定
        if (text.includes("=")) {
            text = text.substring(1, text.length);
            tipDom.innerText = "正在获取多套题库内容";
            // 获取题库
            axios.get(`https://api.n0ts.cn/${text}.txt`).then(res => {
                text = ">" + res.data.split(",");
                start2(text);
            }, err => {
                errResult++;
                return tipDom.innerText = `成功！当前题库数量：${resultCountNum}，错误题库数量：${errResult}`;
            })
        } else {
            start2(text);
        }
    }
}

function start2(text) {
    // 提示框
    let tipDom = document.querySelector(".n0tsTip");

    // 如果地址采用我的接口
    if (text.includes(">")) {
        text = text.substring(1, text.length);
        text = text.split(",");
        for (let i = 0; i < text.length; i++) {
            fileUrl.push(`https://api.n0ts.cn/${text[i]}.txt`);
        }
    } else {
        // 录入其他地址
        fileUrl.push(text);
    }

    // 如果都填写的话发送请求
    if (fileUrl) {
        tipDom.innerText = "正在获取题库";
        for (let i = 0; i < fileUrl.length; i++) {
            axios.get(fileUrl[i]).then(res => {
                go(res.data);
            }, err => {
                errResult++;
                tipDom.innerText = `失败！当前题库数量：${resultCountNum}，错误题库数量：${errResult}`;
            })
        }
    }
}

// 跳转答案提取，自动分析文档类型
function go(res) {
    // 提示框
    let tipDom = document.querySelector(".n0tsTip");

    // word 检测
    go1(res).then(res => {
        result = result.concat(res);
        resultCountNum++;
        tipDom.innerText = `成功！当前题库数量：${resultCountNum}，错误题库数量：${errResult}`;
    }, err => {
        // excel 检测
        go2(res).then(res => {
            result = result.concat(res);
            resultCountNum++;
            tipDom.innerText = `成功！当前题库数量：${resultCountNum}，错误题库数量：${errResult}`;
        }, err => {
            errResult++;
            tipDom.innerText = `失败！当前题库数量：${resultCountNum}，错误题库数量：${errResult}`;
            fileUrl = "";
        });
    });
}

// Word 答案提取
function go1(word) {
    return new Promise(function (resolve, reject) {
        // 获取题目数量
        let wordNum;
        // 提取题目数量语句判断题目数
        let wordNumCache = word.substring(0, word.indexOf("题_共"));
        for (let i = 0; i < wordNumCache.length; i++) {
            let isnum = wordNumCache.substring(wordNumCache.length - i, wordNumCache.length);
            // 如果不是数字则存储
            if (isnum != null && isnum != "" && isNaN(isnum)) {
                wordNum = Number(isnum.substring(1, isnum.length).trim());
                break;
            }
        }

        // 数据判断
        if (word == null || wordNum == null) {
            return reject();
        }

        // 正确选项过滤
        let rightOptionText = word.substring(word.indexOf(`1：`), word.length).trim();
        let rightOption = [];
        for (let i = 1; i < wordNum + 1; i++) {
            let cache;
            // 是否为最后一题
            let lastCache = `${i + 1}：`;
            if (i == wordNum) {
                // 最后一题的处理
                let textCache;
                for (let j = 0; j < 10; j++) {
                    let lastCache = rightOptionText.substring(rightOptionText.indexOf(`${i}：`), rightOptionText.indexOf(`${i}：`) + j).trim();
                    if (textCache == lastCache) {
                        cache = lastCache;
                        break;
                    }
                    textCache = lastCache;
                }
            } else {
                // 提取单独选项
                cache = rightOptionText.substring(rightOptionText.indexOf(`${i}：`), rightOptionText.indexOf(lastCache)).trim();
            }
            // 去掉排序数字
            cache = cache.substring(cache.indexOf("：") + 1, cache.length);
            // 选项分割
            rightOption[i] = cache.split("", cache.length);
        }

        // 题目与答案过滤
        let wordResult = [];
        for (let i = 1; i <= wordNum; i++) {
            // 是否为最后一题，如果是则用 “t” 结尾
            let lastCache = word.indexOf(`第${i + 1}题`);
            if (i == wordNum) {
                lastCache = word.length;
            }
            // 根据 “第几题” 提取全部题目与答案
            let data = word.substring(word.indexOf(`第${i}题`), lastCache).trim();

            // 获取题目，去掉 “第几题“ 一行
            data = data.replace("【多选】", "");
            data = data.replace("【选两项】", "");
            let subject = (data.substring(data.lastIndexOf("】") + 1, data.length)).trim();

            // 去掉选项
            subject = subject.substring(0, subject.lastIndexOf("A.")).trim();

            // 存入结果与答案
            wordResult[i - 1] = {
                subject,
                rightOption: rightOption[i]
            };
        }

        // 检验结果
        if (wordResult.length != wordNum || wordResult.length == 0) {
            return reject();
        }

        // 启用答题
        selectStatus = true;

        // 返回结果
        return resolve(wordResult);
    })
}

// Excel 答案提取
function go2(excelData) {
    return new Promise(function (resolve, reject) {
        // 根据 “\t” 分割内容
        let excel = excelData.split("\t");

        // 数据检查
        if(excel.length <= 1) {
            return reject();
        }

        // 题目与答案索引
        let subjectIndex;
        let excelResultIndex;

        // 获取标题
        let title = [];
        for (let i = 0; i < excel.length; i++) {
            if (excel[i].includes("题干")) {
                subjectIndex = i;
            } else if (excel[i].includes("答案")) {
                excelResultIndex = excelResultIndex ? excelResultIndex : i;
            }
            if (excel[i].indexOf("\n") >= 0) {
                title.push(excel[i].substring(0, excel[i].indexOf("\n")).trim());
                break;
            }
            title.push(excel[i]);
        }

        // 格式纠正与数量计算
        let excelNum = 0;
        let indexCache = 0;
        for (let i = 0; i < excel.length; i++) {
            if (indexCache == title.length - 1) {
                indexCache = 0;
                excelNum++;
                excel.splice(i, 1, excel[i].substring(0, excel[i].indexOf("\n")).trim(), excel[i].substring(excel[i].indexOf("\n")).trim());
            } else {
                indexCache++;
            }
        }

        // 题目库中删除标题
        excelNum--;
        excel.splice(0, title.length);

        // 分割题目
        let excelResult = [];
        for (let i = 0; i < excelNum; i++) {
            let rCache = [];
            for (let j = 0; j < title.length; j++) {
                if (excel[j + i * title.length]) {
                    rCache.push(excel[j + i * title.length].trim());
                }
            }
            excelResult.push(rCache);
        }

        // 题目与答案过滤
        for (let i = 0; i < excelResult.length; i++) {
            excelResult[i] = {
                subject: excelResult[i][subjectIndex],
                rightOption: excelResult[i][excelResultIndex].split("", excelResult[i][excelResultIndex].length)
            }
        }

        // 检验结果
        if (excelResult.length != excelNum || excelResult.length == 0) {
            return reject();
        }

        // 启用答题
        selectStatus = true;

        // 返回结果
        return resolve(excelResult);
    })
}

// 鼠标选择题目触发
let titleList = document.querySelectorAll(".test-title-details-list-tit");
titleList.forEach(item => {
    item.onmouseup = function () {
        selectText();
    }
});

// 自动答题
// 启用/停用计时器
function startTimeOut() {
    // 提示框
    let tipDom = document.querySelector(".n0tsTip");
    // 结果
    let resultDom = document.querySelector(".n0tsResult");

    // 获取题目
    let details = document.querySelectorAll(".test-title-details-list-tit > h4");

    // 判断是否启用
    if (autoGo) {
        timeOut = setInterval(() => {
            if (timeIndex == details.length) {
                setTimeout(() => {
                    autoGo = false;
                    tipDom.innerText = "答题完毕！请检查空题！";
                    resultDom.innerText = "";
                    clearInterval(timeOut);
                    timeIndex = 0;
                }, 0);
            }
            selectText(details[timeIndex]);
            timeIndex++;
        }, autoTime);
    } else {
        clearInterval(timeOut);
        timeIndex = 0;
    }
}

// 填写答案
// 传入题目则根据题目填写
// 不传入则根据鼠标选择文字模糊搜索题目
function selectText(text) {
    // 提示框
    let tipDom = document.querySelector(".n0tsTip");
    // 结果
    let resultDom = document.querySelector(".n0tsResult");

    // 答案获取完毕后才允许进入
    if (!selectStatus) {
        return;
    }

    // 题目选项
    let selectItem;

    // 自动答题
    if (typeof (text) != "undefined" && text.innerText) {
        selectItem = document.querySelectorAll(`#${text.parentNode.parentNode.id} li > div`);
        text = text.innerText;
        if (text.length >= 40) {
            let n = Number(text.length * .2) / 2;
            if (text.includes("(")) {
                text = text.substring(n, text.indexOf("("));
            } else if (text.includes("\n")) {
                text = text.substring(n, text.indexOf("\n"));
            } else if (text.includes("【")) {
                text = text.substring(n, text.indexOf("【"));
            } else {
                text = text.substring(n, text.length - n);
            }
        } else {
            text = text.substring(4, text.length - 4);
        }
    }

    // 鼠标点击或选择题目
    try {
        // 获取文字
        if (!text) {
            text = window.getSelection();
            selectItem = document.querySelectorAll(`#${text.focusNode.parentNode.parentNode.parentNode.getAttribute('id')} li > div`);
        }
        // 没有文字则获取全部内容
        if (text.toString() == "") {
            text = text.focusNode.data;
            if (text.length >= 40) {
                let n = Number(text.length * .2) / 2;
                if (text.includes("(")) {
                    text = text.substring(n, text.indexOf("("));
                } else if (text.includes("\n")) {
                    text = text.substring(n, text.indexOf("\n"));
                } else if (text.includes("【")) {
                    text = text.substring(n, text.indexOf("【"));
                } else {
                    text = text.substring(n, text.length - n);
                }
            } else {
                text = text.substring(4, text.length - 4);
            }
        }
    } catch {
        return;
    }

    // 清空内容
    tipDom.innerText = "";
    resultDom.innerText = "";

    // 遍历答案
    for (let i = 0; i < result.length - 1; i++) {
        // 匹配题目
        if (result[i].subject.indexOf(text) > -1) {
            // 显示题目
            tipDom.innerText = "题目：" + result[i].subject;
            // 如果存在选择就取消
            for (let j = 0; j < selectItem.length; j++) {
                if (selectItem[j].className.includes("layui-form-checked")) {
                    selectItem[j].click();
                }
            }
            // 显示答案 && 自动点击
            resultDom.innerText = "答案："
            for (let j = 0; j < result[i].rightOption.length; j++) {
                resultDom.innerText += result[i].rightOption[j] + " ";
                switch (result[i].rightOption[j]) {
                    case "A":
                        selectItem[0].click();
                        break;
                    case "B":
                        selectItem[1].click();
                        break;
                    case "C":
                        selectItem[2].click();
                        break;
                    case "D":
                        selectItem[3].click();
                        break;
                    case "E":
                        selectItem[4].click();
                        break;
                    default:
                        break;
                }
            }
            break;
        }
        // 未找到题目
        resultDom.innerText = "未找到，请重试！"
    }
}