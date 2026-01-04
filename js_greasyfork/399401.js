// ==UserScript==
// @name         jiraBugTemplateForSui
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  jira 提单辅助填充神器
// @author       mocobk
// @match        https://jira.sui.work/browse/*
// @match        https://jira.sui.work/projects/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399401/jiraBugTemplateForSui.user.js
// @updateURL https://update.greasyfork.org/scripts/399401/jiraBugTemplateForSui.meta.js
// ==/UserScript==

// 随手记所有开发
const words = [
    "苏丹", "彭钢", "曾康", "吴晓桂", "陈翔", "徐德铨", "胡俊华", "张帆", "陈桂豪", "沈攀", "刘荣耀", "邵珠彬", "黎琳", "罗锦源", "刘家源", "张浩", "郭欢", "谢瑜", "林新城", "梁思远", "梅帆", "耿超", "叶日旋", "汤鹏辉", "张巍", "杨平安", "吴中尚", "洪中义", "戴灵飞", "钱凯", "叶伟钊", "陈伟", "李则意", "何贞铝", "庄洪森", "刘鹏忠", "吕子谋", "刘亿平", "汤嘉浩", "郑加颖", "房海灏", "梁伟楠", "王永煌", "蔡金武", "葛兵", "申昊", "郭小龙",
];

// 业务类型（各业务线可以在这里定义自己的业务类型）
const business = ['零售web', "零售账本", "美业账本", "收钱账本", "收银POS", "零售版App"];

// 默认测试环境
const env = '测试服';

// 默认 jira 描述内容模板
const descContent = `

<p><img class="emoticon" src="/images/icons/emoticons/help_16.png" alt="" width="16" height="16" align="absmiddle" border="0" data-mce-src="/images/icons/emoticons/help_16.png"><strong>【问题描述】</strong></p>

`;



// 匹配开发出现次数最多的那个
function maxTimesWord(targetString) {
    // return {name: words, times: n} or undefined
    let result = [];
    for (let word of words) {
        const pattern = new RegExp(word, 'g');
        const matchTimes = targetString.match(pattern);
        if (matchTimes) {
            result.push({name: word, times: matchTimes.length})
        }
    }
    return result.sort((a, b) => {
        return b.times - a.times
    })[0]
}




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


    // 关联
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

// 根据匹配的开发人员姓名，触发填充经办开发
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


// 根据匹配的sprint，触发填充sprint
function addFillSprintListener() {
    let sprintInput = $('#customfield_10004-field')[0];
    //console.log(sprintInput);
    const sprintInfo = $('.js-rapidboard-operation-sprint')[0];
    //console.log("sprintInfo", sprintInfo);
    if (!sprintInfo) {
        sprintInput.value = ' 当前 JIRA 未关联 Sprint';
        return
    }
    if (!!sprintInput) {
        if (sprintInfo.parentElement.parentElement.firstElementChild.innerText==="活动中的Sprint:"){
            sprintInput.value = ' 点击自动获取当前 Sprint';
            sprintInput.addEventListener(
            'click',
            () => {
                    // 这里因为必须要用户主动触发按键才能选择，采用空格触发
                    sprintInput.value = sprintInfo.innerText + ' 按空格键确认！';
                    sprintInput.focus();
                    sprintInput.setSelectionRange(sprintInfo.innerText.length, -1);
                    autoInputEnter(sprintInput);
            })

        }
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
        for (let type of business) {
            const tag = `<a href='#' style="margin-right: 10px">${type}</a>`;
            aTag.push(tag)
        }
        const fieldHtml = `<div id="bug-type-field" class="field-group"><label>业务类型</label><div style="padding: 5px 0 0;">${aTag.join('')}</div></div>`;
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
    // 获取页面创建按钮对象
    let createBtn = document.getElementById('create_link');
    // 添加创建按钮监听事件
    createBtn.addEventListener(
        'click',
        function () {
            let i = 0;
            let timer = setInterval(
                function () {
                    if ($('#create-issue-dialog').length === 1 && $('iframe')[0] && $('#issuetype-field')[0].value === '故障') {
                        console.log('=====================进入了提弹框==========================')
                        setBugType();
                        autoFill();
                        assignDeveloper();
                        addFillSprintListener();
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

