// ==UserScript==
// @name         半自动填写插件
// @namespace    https://github.com/balala8/semi_autofill_plugin/
// @version      0.2
// @description  半自动填写插件，匹配并尝试填写网页，填写失败则写入剪贴板。可用于在线网页填写简历等等
// @author       obalala
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/balala8/semi_autofill_plugin/main/logo-256.ico
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473934/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/473934/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


let information = {
    "姓名": ["张三"],
    "性别": ["男"],
    "身高": ["180"],
    "体重": ["70"],
    "籍贯": ["北京"],
    "民族": ["汉族"],
    "婚姻状况": ["未婚"],
    "职业": ["学生"],
    "微信号": ["test"],
    "邮箱": ["test@test.com"],
    "手机电话号码": ["12345678901"],
    "证件类型": ["身份证"],
    "证件号码": ["123456789012345678"],
    "当前地址": ["北京市海淀区"],
    "户口所在地": ["北京市海淀区"],
    "外语分数": ["750"],
    "紧急联系人姓名": ["李四"],
    "紧急联系人电话": ["12345678901"],
    "学历": ["本科", "硕士"],
    "毕业学校": ["北京大学", "清华大学"],
    "院系": ["计算机系", "软件工程系"],
    "专业": ["计算机", "软件工程"],
    "导师": ["张三", "李四"],
    "实验室": ["张三实验室", "李四实验室"],
    "研究方向": ["计算机视觉", "机器学习"],
    "论文": ["论文1", "论文2"],
    "获奖": ["奖项1", "奖项2"],
    "竞赛": ["竞赛1", "竞赛2"],
    "任职公司": ["公司1", "公司2"],
    "职位": ["职位1", "职位2"],
    "任职描述": ["描述1", "描述2"],
    "项目名称": ["项目1", "项目2"],
    "项目描述": ["描述1", "描述2"],
    "项目职责": ["职责1", "职责2"],
    "项目角色": ["技术1", "技术2"],
}

const popupWindow = document.createElement('div');
popupWindow.className = 'popup-window';
popupWindow.style.display = 'none';
popupWindow.style.position = 'fixed';
popupWindow.style.backgroundColor = 'rgb(46, 196, 182)';
popupWindow.style.zIndex = '9999';
document.body.appendChild(popupWindow);

var alertBox = document.createElement("div");
alertBox.textContent = "这是一个提示框";
alertBox.style.position = "fixed";
alertBox.style.top = "50%";
alertBox.style.left = "50%";
alertBox.style.transform = "translate(-50%, -50%)";
alertBox.style.backgroundColor = 'rgb(46, 196, 182)';
alertBox.style.padding = "10px";
alertBox.style.border = "1px solid rgb(46, 196, 182)";
alertBox.style.borderRadius = "5px";
alertBox.style.transition = "opacity 0.5s";
alertBox.style.display = "none";
alertBox.style.zIndex = '9999';
document.body.appendChild(alertBox);

let uponElement = null;

// 在页面加载后3秒执行
setTimeout(function() {
    // const inputElements = document.querySelectorAll('input[type="text"], textarea');
    // inputElements.forEach(input => {
    //     input.addEventListener('click', popupWindowClick);
    // });

    document.addEventListener('click', function(event) {
        if (event.target.tagName === 'INPUT' && event.target.type==='text' || event.target.tagName === 'TEXTAREA') {
            popupWindowClick(event);
        }
    });
    

    // 监听页面滚动事件
    window.addEventListener('scroll', function() {
        popupWindow.style.display = 'none';
    });
}, 3000);


// 悬浮窗口添加点击事件监听器
function popupWindowClick(event) {
    const clicked = event.target;
    uponElement = clicked;
    const inputRect = clicked.getBoundingClientRect();
    let contents = "-1"
    // 尝试从placehollder中获取关键字
    if (uponElement.placeholder !== '') {
        let keyword = uponElement.placeholder;
        contents = keyword2index(keyword);
    }
    // 从placeholder中获取失败，从dom树中获取关系上最近且排版上最近的元素
    if (contents == '-1') {
        contents = getNearLabelElement(uponElement)
    }
    if (contents == '-1') {
        showText("未找到匹配的信息");
        return;
    }

    while (popupWindow.firstChild){
        popupWindow.removeChild(popupWindow.firstChild);
    }
    for (const line of contents) {
        const div = document.createElement('div');
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.margin = '5px';
        div.style.border = '1px solid white';
        div.style.cursor = 'pointer';
        div.style.color = 'rgb(46, 196, 182)';
        div.textContent = line;
        div.addEventListener('click', answerClick);
        popupWindow.appendChild(div);
    }
    popupWindow.style.position = 'absolute';
    popupWindow.style.top = (event.clientY + window.scrollY) + 'px';
    popupWindow.style.left = (event.clientX + window.scrollX) + 'px';
    popupWindow.style.display = 'flex'
}

// 答案item被点击事件监听器，点击选择答案并隐藏popupWindow
function answerClick(event) {
    const clickedDiv = event.target;
    const text = clickedDiv.textContent;
    console.log(`Clicked: ${text}`);
    if (text !== "") {
        uponElement.value = text;
    }
    uponElement.focus();
    popupWindow.style.display = 'none';

    var clipboardItem = new ClipboardItem({ "text/plain": new Blob([text], { type: "text/plain" }) });
    navigator.clipboard.write([clipboardItem]).then(function () {
        showText("已成功复制到剪贴板");
    }).catch(function (err) {
        console.error("复制到剪贴板失败: ", err);
        showText("复制到剪贴板失败");
    });

}

// 根据关键字获取自身信息
function keyword2index(keyword) {
    keyword = trimKeyword(keyword);
    if (keyword === false) {
        return "-1";
    }
    let maxSimilarity = 0;
    let mostSimilarKey = null;
    for (const key in information) {
        const similarity = calculateJaccardSimilarity(keyword, key);
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            mostSimilarKey = key;
        }
    }
    if (maxSimilarity == 0) {
        return "-1";
    }
    console.log("最匹配的 key 是:", mostSimilarKey, "相似度:", maxSimilarity, "值：", information[mostSimilarKey]);
    return information[mostSimilarKey];
}

function getNearLabelElement(element) {
    const siblings = Array.from(element.parentNode.children);
    siblings.sort((a, b) => {
        const distanceToA = Math.abs(a.getBoundingClientRect().top - element.getBoundingClientRect().top);
        const distanceToB = Math.abs(b.getBoundingClientRect().top - element.getBoundingClientRect().top);
        return distanceToA - distanceToB;
    });

    for (let i = 0; i < siblings.length; i++) {
        let html = siblings[i].innerHTML;
        let htmlText = html.replace(/<[^>]+>/g, '');
        if (htmlText == null || htmlText == undefined || htmlText == "") {
            continue;
        }
        console.log("htmlText:", htmlText);
        let res = keyword2index(htmlText);
        console.log("res:", res);
        if (res != "-1") {
            return res;
        }
    }
    return getNearLabelElement(element.parentNode);
}

function trimKeyword(keyword) {
    keyword = keyword.replace(/请|输入|\s/g, '');
    if (keyword === null || keyword === undefined || keyword === '') {
        return false;
    }
    return keyword;
}

// 计算 Jaccard 相似度
function calculateJaccardSimilarity(str1, str2) {
    const set1 = new Set(str1.split(''));
    const set2 = new Set(str2.split(''));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
}

function showText(text) {
    alertBox.textContent = text;
    alertBox.style.display = "flex";
    alertBox.style.opacity = "1";
    setTimeout(function () {
        alertBox.style.opacity = "0";
        setTimeout(function () {
            alertBox.style.display = "none";
        }, 500);
    }, 500);
}

