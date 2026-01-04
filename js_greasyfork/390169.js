// ==UserScript==
// @name         jiraBugTemplate
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  jira 提单自动填充模板
// @author       mocobk
// @match        https://jira.sui.work/browse/*
// @match        https://jira.sui.work/projects/*
// @require      https://greasyfork.org/scripts/390554-getdeveloper/code/getDeveloper.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390169/jiraBugTemplate.user.js
// @updateURL https://update.greasyfork.org/scripts/390169/jiraBugTemplate.meta.js
// ==/UserScript==

// 测试环境
var env = '测试服';
// jira描述内容模板
var descContent = `

<p><img class="emoticon" src="/images/icons/emoticons/help_16.png" alt="" width="16" height="16" align="absmiddle" border="0" data-mce-src="/images/icons/emoticons/help_16.png"><strong>【问题描述】</strong></p>
<br>
<p><img class="emoticon" src="/images/icons/emoticons/information.png" alt="" width="16" height="16" align="absmiddle" border="0" data-mce-src="/images/icons/emoticons/information.png"><strong>【测试数据】</strong></p>
<br>
<p><img class="emoticon" src="/images/icons/emoticons/check.png" alt="" width="16" height="16" align="absmiddle" border="0" data-mce-src="/images/icons/emoticons/check.png"><strong>【预期结果】</strong></p>
<br>
<p><img class="emoticon" src="/images/icons/emoticons/error.png" alt="" width="16" height="16" align="absmiddle" border="0" data-mce-src="/images/icons/emoticons/error.png"><strong>【实际结果】</strong></p>

`;

var bugType = ['功能类', "数据类", "界面类", "环境类", "需求类", "性能类", "安全类", "自动化类"];


// 指定次数和时间间隔重复执行
function timesInterval(handler, intervalTime, times) {
    let curTimes = 0;
    let timer = setInterval(() => {
        handler();
        curTimes++;
        if (curTimes >= times) {
            clearInterval(timer);
        }
    }, intervalTime)
}

function autoFill() {
    let defaultElement = {value: '', innerHTML: ''};

    // jira 编号
    let issueKey = $('#key-val')[0].getAttribute('data-issue-key') || defaultElement;

    // huanj
    let environment = $('#environment')[0] || defaultElement;

    // 描述
    let descIframe = $('iframe')[0];
    let description = descIframe.contentWindow.document.querySelector('#tinymce');

    let relatesTo = $('#issuelinks-issues-textarea')[0] || defaultElement;

    environment.value = env;
    relatesTo.value = issueKey;
    // 因描述信息框会刷新，所以要重复填充
    timesInterval(() => {
        if (!description.innerHTML.includes('<br>')) {
            description.innerHTML = descContent + '<br>';
        }
    }, 200, 10);

    relatesTo.focus();

    $('#create-issue-dialog .form-body')[0].scrollTop = 0;
    $('#summary')[0].focus();

}

// 网上找的一份代码，试过chrome中只有enter键是生效的
function fireKeyEvent(el, evtType, keyCode) {
    var doc = el.ownerDocument,
        win = doc.defaultView || doc.parentWindow,
        evtObj;
    if (doc.createEvent) {
        if (win.KeyEvent) {
            evtObj = doc.createEvent('KeyEvents');
            evtObj.initKeyEvent(evtType, true, true, win, false, false, false, false, keyCode, 0);
        } else {
            evtObj = doc.createEvent('UIEvents');
            Object.defineProperty(evtObj, 'keyCode', {
                get: function () {
                    return this.keyCodeVal;
                }
            });
            Object.defineProperty(evtObj, 'which', {
                get: function () {
                    return this.keyCodeVal;
                }
            });
            evtObj.initUIEvent(evtType, true, true, win, 1);
            evtObj.keyCodeVal = keyCode;
            if (evtObj.keyCode !== keyCode) {
                console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
            }
        }
        el.dispatchEvent(evtObj);
    } else if (doc.createEventObject) {
        evtObj = doc.createEventObject();
        evtObj.keyCode = keyCode;
        el.fireEvent('on' + evtType, evtObj);
    }
}

// 监听有空格输入后，延时500ms后自动按 enter 确认键
function autoInputEnter(element) {
    function handleKeydown(e) {
        if (e.keyCode === 32) {
            setTimeout(() => {
                fireKeyEvent(element, 'keydown', 13);
                element.removeEventListener('keydown', handleKeydown);
            }, 500)
        }
    }

    element.addEventListener('keydown', handleKeydown);
}

// 根据匹配的开发人员姓名，自动填充经办开发
function assignDeveloper() {
    const bodyText = $('.issue-body-content')[0].innerText;
    const developer = maxTimesWord(bodyText);

    if (developer) {
        console.log('自动识别到开发', developer.name);
        let assigneeField = $('#assignee-field')[0];
        assigneeField.addEventListener(
            'click',
            () => {
                if (assigneeField.value !== developer.name) {
                    // 这里因为必须要用户主动触发按键才能选择，采用空格触发
                    assigneeField.value = developer.name + ' 按空格键确认！';
                    assigneeField.focus();
                    assigneeField.setSelectionRange(developer.name.length, -1);
                    autoInputEnter(assigneeField);
                }
            })
    }
}


// 设置问题类型
function setBugType() {
    function fillBugType(type) {
        let summary = $('#summary')[0];
        const typePattern = /^【.+?】/g;
        summary.value = summary.value.replace(typePattern, "");
        summary.value = `【${type}】` + summary.value;
    }

    let summaryField = $('#summary').parent();
    if (summaryField) {
        let aTag = [];
        for (let type of bugType) {
            const tag = `<a href='#' style="margin-right: 10px">${type}</a>`;
            aTag.push(tag)
        }
        const fieldHtml = `<div id="bug-type-field" class="field-group"><label>问题类型</label><div style="padding: 5px 0 0;">${aTag.join('')}</div></div>`;
        summaryField.before(fieldHtml);
        $('#bug-type-field a').each((index, element) => {
            console.log('添加监听')
            element.addEventListener('click', () => {
                fillBugType(element.innerText)
            })
        });
    }


}

(function () {
    let createBtn = document.getElementById('create_link');
    // 添加创建按钮监听事件
    createBtn.addEventListener(
        'click',
        function () {
            let i = 0;
            let timer = setInterval(
                function () {
                    if ($('#create-issue-dialog').length === 1 && $('iframe')[0] && $('#issuetype-field')[0].value === '故障') {
                        setBugType();
                        autoFill();
                        assignDeveloper();
                        clearInterval(timer);
                    } else {
                        i++;
                        if (i >= 100) {
                            // 100 次轮询都未找到对象则停止
                            clearInterval(timer);
                        }
                    }
                }, 500)
        }
    )
})();

