// ==UserScript==
// @name         HioTest Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  help you better to pass the test
// @author       yaochuan
// @match        https://hio.oppo.com/servlet/*
// @match        https://hio.oppo.com/web/html/learner/*
// @icon         https://hio.oppo.com/user/user.png
// @grant        GM_addStyle
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/447534/HioTest%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/447534/HioTest%20Helper.meta.js
// ==/UserScript==


(function() {
    'use strict';
    console.log('########## start');

    setTimeout(function() {
        var allsubject = document.querySelector('#over > div.left');
        var list = allsubject.getElementsByClassName('mainContent');
        //    var subject = document.querySelector('#over > div.left > div:nth-child(1) > dl > dd');
        //    var title = subject.querySelector('#over > div.left > div:nth-child(1) > dl > dd > div');

        console.log('list.length=%d', list.length);
        var content = '';
        for (var i = 0; i < list.length; i++) {
            content += getSubjectText(list[i]);
        }

        // 添加一个“copy”按钮，用于点击复制所有题目
        var x = document.querySelector('body > div.upper > div > div.upper-tool');
        var copyButton = document.createElement("copyButton");
        copyButton.textContent = 'copy';
        copyButton.style.width = '100px';
        copyButton.style.height = '30px';
        copyButton.style.align = 'center';
        copyButton.onclick = function() {
            //console.log('click');
            clipboardCopy(content);
        }
        x.appendChild(copyButton);
    }, 3000);

    console.log('########## end');
})();

function getSubjectText(subject) {
    var SCH = '\t'; //', '// 间隔使用\t可以直接粘贴到excel中
    var TRIM_REGEX = /\t|\r|\n|\s+/g;
    var subjectContent = '';
    var type = subject.querySelector('table > tbody > tr > td > span.TitleText');
    var title = subject.querySelector('dl > dd > div');
    var optionList = subject.getElementsByClassName('list-info');
    if (optionList.length == 0) {
        optionList = subject.getElementsByClassName('dcmess');
    }

    console.log(title.innerText.trim());
    console.log("==============");
    subjectContent += "[";
    subjectContent += type.innerText.trim()[0].replace(TRIM_REGEX, "");
    subjectContent += "]";
    subjectContent += title.innerText.trim().replace(TRIM_REGEX, "");
    subjectContent += SCH; // 留一列用于放答案

    for (var i = 0; i < optionList.length; i++) {
        var label = optionList[i].querySelector('label');
        var labelValue = label.innerText.trim();
        var labelValueTrimmed = labelValue.replace(TRIM_REGEX, "");
        //console.log("%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d|%d", labelValue.charCodeAt(0)
        //           , labelValue.charCodeAt(1)
        //           , labelValue.charCodeAt(2)
        //           , labelValue.charCodeAt(3)
        //           , labelValue.charCodeAt(4)
        //           , labelValue.charCodeAt(5)
        //           , labelValue.charCodeAt(6)
        //           , labelValue.charCodeAt(7)
        //           , labelValue.charCodeAt(8)
        //           , labelValue.charCodeAt(9)
        //           , labelValue.charCodeAt(10)
        //           , labelValue.charCodeAt(11)
        //           , labelValue.charCodeAt(12)
        //           , labelValue.charCodeAt(13)
        //           , labelValue.charCodeAt(14)
        //           , labelValue.charCodeAt(15)
        //           , labelValue.charCodeAt(16)
        //           , labelValue.charCodeAt(17)
        //           , labelValue.charCodeAt(18)
        //           , labelValue.charCodeAt(19)
        //           , labelValue.charCodeAt(20)
        //           , labelValue.charCodeAt(21));
        console.log(labelValueTrimmed);
        subjectContent += SCH;
        subjectContent += labelValueTrimmed; // 题目的答案选项
    }

    subjectContent += '\n';
    return subjectContent;
}

function clipboardCopy(text) {
    if (navigator.clipboard) { // 如果浏览器兼容该 API
        return navigator.clipboard.writeText(text).catch(function (err) {
            throw (err !== undefined ? err : new DOMException('The request is not allowed', 'NotAllowedError'))
        })
    }

    // 或者使用 document.execCommand()

    // 把需要复制的文本放入 <span>
    const span = document.createElement('span')
    span.textContent = text

    // 保留文本样式
    span.style.whiteSpace = 'pre'

    // 把 <span> 放进页面
    document.body.appendChild(span)

    // 创建选择区域
    const selection = window.getSelection()
    const range = window.document.createRange()
    selection.removeAllRanges()
    range.selectNode(span)
    selection.addRange(range)

    // 复制文本到剪切板
    let success = false
    try {
        success = window.document.execCommand('copy')
    } catch (err) {
        console.log('error', err)
    }

    // 清除战场
    selection.removeAllRanges()
    window.document.body.removeChild(span)

    return success
        ? Promise.resolve()
    : Promise.reject(new DOMException('The request is not allowed', 'NotAllowedError'))
}
