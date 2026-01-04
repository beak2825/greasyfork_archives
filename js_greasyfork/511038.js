// ==UserScript==
// @name         HiMCBBS审核综合增强
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  提高审核效率!
// @author       乱杖先生, HiTech0926
// @license MIT
// @match        https://www.himcbbs.com/approval-queue/*
// @icon         https://www.himcbbs.com/data/assets/favicon/himcbbs-favicon-black-4x.png
// @icon64       data:image/png;base64,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
// @connect      raw.githubusercontent.com
// @connect      ipinfo.io
// @connect      ip.cn
// @connect      api.oioweb.cn
// @connect      127.0.0.1
// @connect      minebbs.goldlog.net
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_notification
// @grant GM_log
// @downloadURL https://update.greasyfork.org/scripts/511038/HiMCBBS%E5%AE%A1%E6%A0%B8%E7%BB%BC%E5%90%88%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/511038/HiMCBBS%E5%AE%A1%E6%A0%B8%E7%BB%BC%E5%90%88%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


// 违禁词的API 
const PROHIBITEDWORDS_URL = 'http://minebbs.goldlog.net/api/prohibitedWords';
// 通过审核的按钮文字
const AUTO_APPROVE_BUTTON_TEXT = '通过审核';
// 无操作的按钮文字
const NO_OPERATION_BUTTON_TEXT = '无操作';
// 需要人工判断的其他按钮暂不列入考虑范围
const BATCH_SIZE = 15; // 分批次处理内容
// 分批次处理IP
const BATCH_SIZE_IP = 20;


/*
    类
*/
// 配置类
class Config {
    // 邮箱检查模式 true表示白名单
    emailMode = true;
    // 短词精准匹配
    shortContentAccurateMode = true;
    // 短词模糊匹配
    shortContentFuzzyMode = true;
    // 长句精准匹配
    longContentAccurateMode = true;
    // IP增强
    ipCheck = true;
    // 自动批准
    autoApprove = true;
    // 本地短词违禁词
    #shortContentTextProhibitedWords = [];
    // 本地句子违禁词
    #longContentTextProhibitedWords = [];
    // 邮箱后缀
    #emailList = [];

    get shortContentTextProhibitedWords() {
        return this.#shortContentTextProhibitedWords.join(';');
    }
    set shortContentTextProhibitedWords(value) {
        this.#shortContentTextProhibitedWords = value.split(';').filter(Boolean);
    }
    get longContentTextProhibitedWords() {
        return this.#longContentTextProhibitedWords.join(';');
    }
    set longContentTextProhibitedWords(value) {
        this.#longContentTextProhibitedWords = value.split(';').filter(Boolean);
    }
    get emailList() {
        return this.#emailList.join(';');
    }
    set emailList(value) {
        this.#emailList = value.split(';').filter(Boolean);
    }
    // 得到本地违禁词数组
    getlocalShortProhibitedWordsArray() {

        return this.#shortContentTextProhibitedWords.filter(str => str !== "");
    }
    // 得到本地违数组
    getlocalLongProhibitedWordsArray() {
        return this.#longContentTextProhibitedWords.filter(str => str !== "");
    }
    // 得到邮箱列表个数
    getEmailListArray() {
        return this.#emailList;
    }
    saveData() {
        GM_setValue('himcbbs:config', {
            emailMode: this.emailMode,
            shortContentAccurateMode: this.shortContentAccurateMode,
            shortContentFuzzyMode: this.shortContentFuzzyMode,
            longContentAccurateMode: this.longContentAccurateMode,
            ipCheck: this.ipCheck,
            autoApprove: this.autoApprove,
            shortContentTextProhibitedWords: this.#shortContentTextProhibitedWords,
            longContentTextProhibitedWords: this.#longContentTextProhibitedWords,
            emailList: this.#emailList
        })
    }
    getData() {
        // 尝试从持久化设备中读取数据  
        const storedConfig = GM_getValue('himcbbs:config');
        if (storedConfig) {
            // 读取成功，更新当前对象的属性  
            this.emailMode = storedConfig.emailMode;
            this.shortContentAccurateMode = storedConfig.shortContentAccurateMode;
            this.shortContentFuzzyMode = storedConfig.shortContentFuzzyMode;
            this.longContentAccurateMode = storedConfig.longContentAccurateMode;
            this.ipCheck = storedConfig.ipCheck;
            this.autoApprove = storedConfig.autoApprove;
            this.#shortContentTextProhibitedWords = storedConfig.shortContentTextProhibitedWords || [];
            this.#longContentTextProhibitedWords = storedConfig.longContentTextProhibitedWords || [];
            this.#emailList = storedConfig.emailList || [];
        }
    }
}


// 创建配置对象
const conf = new Config();

// 获取加载旗帜, 用于判断是否为首次加载
const loadflag = GM_getValue("himcbbs:loadflag", 0);
if (!loadflag) {
    GM_log('初始化:首次载入插件, 即将开始初始化!');

    // =========== 插件提供的原始数据(START) ===============
    // 提供默认的邮箱后缀
    conf.emailList = 'petalmail.com;hotmail.com;outlook.com;gmail.com;foxmail.com;qq.com;vip.qq.com;163.com;vip.163.com;126.com;vip.126.com;sina.com;sina.cn;yeah.net;189.cn;139.com;wo.cn;game.com;163vip.com;tom.com;vip.tom.com;sohu.com'
    // =========== 插件提供的原始数据(END) ===============

    // 持久化数据
    conf.saveData();
    GM_log('初始化:配置数据持久化完成!');
    sendNotification('首次加载: 审核插件初始化成功!');
    // 插旗
    GM_setValue("himcbbs:loadflag", 1);
}else{
    // 加载数据
    conf.getData();
}


/**
 * 记录自动批准的次数
 * @param {*} num 如果为0则表示读取, 正数加,负数减
 * @returns 当前总计次数
 */
function approvalFrequency(num = 0) {
    let approval_frequency = GM_getValue("himcbbs:approval_frequency", 0);
    if (num == 0) {
        return approval_frequency;
    }
    GM_setValue("himcbbs:approval_frequency", approval_frequency + num)
    return GM_getValue("himcbbs:approval_frequency", 0);
}
/**
 * 发送插件通知
 * @param {*} text 通知的文本内容 
 */
function sendNotification(text) {
    const noticDetails = {
        title: "HiMCBBS审核增强插件",
        text,
        url: 'https://www.himcbbs.com/approval-queue/',
        image: 'https://www.himcbbs.com/data/assets/favicon/himcbbs-favicon-black-4x.png',
        tag: 'notic:himcbbs',
        silent: true,
        timeout: 5000
    }
    GM_notification(noticDetails);
}
/**
 * 根据tagName创建一个标签, 并添加多个类名
 * @param string tagName 元素标签
 * @param string classNames 类名,多个用空格隔开
 * @returns 
 */
function createElementWithClass(tagName, classNames) {
    const element = document.createElement(tagName);
    classNames.split(' ').forEach(className => element.classList.add(className));
    return element;
}

/**
 * 简化setAttribute, 使其更加美观
 * @param element element 元素对象
 * @param string attributeName 属性名
 * @param string attributeValue  属性值
 */
function setAttribute(element, attributeName, attributeValue) {
    element.setAttribute(attributeName, attributeValue);
}

/**
 * 提供一个简易的块, 仿筛选器BAR块
 * 顶级块元素提供方法,获得存放内容的元素块
 * @returns 顶级块元素
 */
function createElement_simpleBlock() {
    let block = createElementWithClass('div', 'block');
    let blockContainer = createElementWithClass('div', 'block-container block-container--none');
    let blockFilterBar = createElementWithClass('div', 'block-filterBar block-filterBar--standalone');
    let filterBar = createElementWithClass('div', 'filterBar');
    blockFilterBar.appendChild(filterBar);
    blockContainer.appendChild(blockFilterBar);
    block.appendChild(blockContainer);
    block.getContentElement = function () {
        return filterBar;
    }
    return block;
}

/**
 * 创建一个简单的按钮样式
 * @param {*} text  按钮上的文字
 * @param {*} callback 按钮被点击时的回调
 * @returns 
 */
function createElement_simplButton(text, callback) {
    let el = document.createElement('button');
    el.setAttribute('type', 'button');
    el.classList.add("button", "rippleButton")
    let text_el = document.createElement('span')
    text_el.classList.add("button-text");
    text_el.innerText = text;
    el.appendChild(text_el);
    el.style.marginRight = '0.4vh'
    el.addEventListener('click', callback);
    return el;
}

/**
 * 创建菜单
 * @param {*} title  标题
 */
function createElement_simpleContainerOfSetting(title) {
    let overlayContainer = document.createElement('div');
    overlayContainer.classList.add('overlay-container', 'is-active');
    overlayContainer.setAttribute('id', 'mb-container');
    overlayContainer.addEventListener('click', function (event) {
        if (event.target === overlayContainer) {
            overlayContainer.remove();
        } else {
            event.stopPropagation();
            return;
        }

    })
    overlayContainer.style.overflowY = 'auto';
    let overlay = document.createElement('div');
    overlay.classList.add("overlay");
    overlay.setAttribute('tabindex', '-1');
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-hidden', 'false')
    let overlayTitle = document.createElement('div');
    overlayTitle.classList.add("overlay-title");
    let overlayTitleText = document.createTextNode(title);
    let overlayCloseBtn = document.createElement('a');
    overlayCloseBtn.classList.add('overlay-titleCloser', 'js-overlayClose');
    overlayCloseBtn.setAttribute('role', 'button');
    overlayCloseBtn.setAttribute('tabindex', '0');
    overlayCloseBtn.setAttribute('aria-label', '关闭');
    overlayTitle.appendChild(overlayCloseBtn);
    overlayTitle.appendChild(overlayTitleText);
    overlayCloseBtn.addEventListener('click', () => {
        overlayContainer.remove();
    })
    let overlayContent = document.createElement('div');
    overlayContent.classList.add("overlay-content");
    let block = document.createElement('div');
    block.classList.add("block");
    let blockContainer = document.createElement('div')
    blockContainer.classList.add("block-container")
    let blockBody = document.createElement('div');
    blockBody.classList.add("block-body");
    blockBody.setAttribute('id', 'mb-menu--block')
    let menu_1 = createFormRow_Input({ text: '名称本地违禁词', hint: '字符串' }, {
        id: 'm1',
        value: conf.shortContentTextProhibitedWords,
        hint: '最终词库 = 在线词库 + 本地词库, 请使用 ;(英标分号) 隔开每个字词',
        placeholder: '检查用户名称的违禁词库,建议您从编辑器粘贴到此处',
        callback: function () {
            conf.shortContentTextProhibitedWords = this.value;
        }
    })
    let menu_3 = createFormRow_Input({ text: '内容本地违禁词', hint: '字符串' }, {
        value: conf.longContentTextProhibitedWords,
        hint: '最终词库 = 在线词库 + 本地词库  , 请使用 ;(英标分号) 隔开每个表达式',
        placeholder: '检查审核内容的词库, 建议您从编辑器粘贴到此处',
        callback: function () {
            conf.longContentTextProhibitedWords = this.value;
        }
    })
    let menu_5 = createFormRow_Checkbox({ text: '名称精准匹配', hint: '开关' }, {
        text: '启用名称精准匹配',
        callback: function (event) {
            conf.shortContentAccurateMode = event.target.checked;
        },
        checked: conf.shortContentAccurateMode
    })
    let menu_6 = createFormRow_Checkbox({ text: '名称模糊匹配', hint: '开关' }, {
        text: '启用名称模糊匹配',
        callback: function (event) {
            conf.shortContentFuzzyMode = event.target.checked;
        },
        checked: conf.shortContentFuzzyMode
    })
    let menu_7 = createFormRow_Checkbox({ text: '发布内容检查', hint: '开关' }, {
        text: '启用内容精准匹配',
        callback: function (event) {
            conf.longContentAccurateMode = event.target.checked;
        },
        checked: conf.longContentAccurateMode
    })

    let menu_8 = createFormRow_Button({ text: '便捷操作', 'hint': '功能' }, [{
        'text': '一键无操作',
        'callback': function () {
            for (let i = 0; i < blockArrayList.length - 1; i++) {
                let block = blockArrayList[i];
                selectOperation(block, NO_OPERATION_BUTTON_TEXT);
                overlayContainer.remove();
            }
            GM_log("'一键无操作完成!");
        }
    },
    {
        'text': '重置插件',
        'callback': function () {
            removeAllValues();
            location.reload();
        }
    }
    ]);
    let menu_9 = createFormRow_Checkbox({ text: 'IP属地', hint: '开关' }, {
        text: '启用IP地址增强,显示IP属地',
        callback: function (event) {
            conf.ipCheck = event.target.checked;
        },
        checked: conf.ipCheck
    })
    let menu_10 = createFormRow_Checkbox({ text: '邮箱检查', hint: '开关' }, {
        text: '启用白名单模式',
        callback: function (event) {
            conf.emailMode = event.target.checked;
        },
        checked: conf.emailMode
    })
    let menu_11 = createFormRow_Input({ text: '邮箱后缀', hint: '字符串' }, {
        id: 'm11',
        value: conf.emailList,
        hint: '检查注册用户邮箱是否满足设定条件, 白名单',
        placeholder: '留空表示不执行,每个后缀使用;分割',
        callback: function () {
            conf.emailList = this.value;
        }
    })
    let menu_12 = createFormRow_Checkbox({ text: '自动批准', hint: '开关' }, {
        text: '符合条件时自动批准(IP+Email+无违禁词)',
        callback: function (event) {
            conf.autoApprove = event.target.checked;
        },
        checked: conf.autoApprove
    })
    let save_el = createElement_saveButton('保存数据', function (event) {
        conf.saveData();
        GM_log('保存按钮被点击, 数据持久化!')
        overlayContainer.remove();
    })
    let info = createFormRow_Info({ text: '统计信息', hint: '信息' }, { 'default': '无消息' })
    info.setSpanHtml(
        `本地单词违禁词个数: ${conf.getlocalShortProhibitedWordsArray().length}<br>
        本地内容违禁词个数: ${conf.getlocalLongProhibitedWordsArray().length}<br>
        邮箱后缀个数: ${conf.getEmailListArray().length}<br>
        插件为您自动点击了 ${approvalFrequency()} 次批准`
    )
    block.appendChild(menu_8);
    block.appendChild(menu_1);
    block.appendChild(menu_3);
    block.appendChild(menu_5);
    block.appendChild(menu_6);
    block.appendChild(menu_7);
    block.appendChild(menu_9);
    block.appendChild(menu_10);
    block.appendChild(menu_11);
    block.appendChild(menu_12);
    block.appendChild(info);
    block.appendChild(save_el);
    blockContainer.appendChild(blockBody);
    block.appendChild(blockContainer);
    overlayContent.appendChild(block);
    overlay.appendChild(overlayTitle);
    overlay.appendChild(overlayContent);
    overlayContainer.appendChild(overlay);
    return overlayContainer;
}

/**
 * 创建一行 输入框
 * @param {*} labelObj  
 * @param {*} inputObj  输入框的callback 失去焦点时触发
 * @returns 
 */
function createFormRow_Input(labelObj = { text: '输入框', hint: '必填' }, inputObj = { value: '', hint: '输入框备注', placeholder: '输入框提示', callback: function () { } }) {
    const dl = createElementWithClass('dl', 'formRow formRow--input');
    const dt = dl.appendChild(document.createElement('dt'));
    const div = dt.appendChild(createElementWithClass('div', 'formRow-labelWrapper'));
    div.appendChild(createElementWithClass('label', 'formRow-label')).textContent = labelObj['text'];
    div.appendChild(createElementWithClass('dfn', 'formRow-hint')).textContent = labelObj['hint'];
    const dd = dl.appendChild(document.createElement('dd'));
    const input = dd.appendChild(createElementWithClass('input', 'input'));
    input.value = inputObj['value'];
    input.placeholder = inputObj['placeholder'];
    input.type = 'text';
    input.setAttribute('data-xf-init', 'input-validator');
    input.setAttribute('required', 'required');
    input.setAttribute('autofocus', 'autofocus');
    input.addEventListener('blur', inputObj['callback']);
    dd.appendChild(createElementWithClass('div', 'inputValidationError js-validationError'));
    dd.appendChild(createElementWithClass('div', 'formRow-explain')).textContent = inputObj['hint'];
    return dl;
}

/**
 * 表单创建一行 : CheckBox
 * @param {*} labelObj  text 介绍, hint 提示
 * @param {*} inputObj  text 说明, callback 点击时触发 , checked 是否默认选中
 * @returns 顶级元素
 */
function createFormRow_Checkbox(labelObj = { text: '单选框', hint: '开关' }, inputObj = { text: '这是一个选择框', callback: function () { }, checked: true }) {
    const dl = createElementWithClass('dl', 'formRow');
    const dt = document.createElement('dt');
    const div = createElementWithClass('div', 'formRow-labelWrapper');
    const labelEl = createElementWithClass('label', 'formRow-label');
    labelEl.textContent = labelObj['text'];
    const dfn = createElementWithClass('dfn', 'formRow-hint');
    dfn.textContent = labelObj['hint'];
    div.appendChild(labelEl);
    div.appendChild(dfn);
    dt.appendChild(div);
    dl.appendChild(dt);
    const dd = document.createElement('dd');
    const ul = createElementWithClass('ul', 'inputChoices');
    const li = createElementWithClass('li', 'inputChoices-choice');
    const checkboxLabel = createElementWithClass('label', 'iconic');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'email_choice';
    checkbox.checked = inputObj['checked'];
    checkbox.addEventListener('click', inputObj['callback'])
    const icon = document.createElement('i');
    setAttribute(icon, 'aria-hidden', 'true'); 
    const span = createElementWithClass('span', 'iconic-label');
    span.textContent = inputObj['text'];
    checkboxLabel.appendChild(checkbox);
    checkboxLabel.appendChild(icon);
    checkboxLabel.appendChild(span);
    li.appendChild(checkboxLabel);
    ul.appendChild(li);
    dd.appendChild(ul);
    dl.appendChild(dd);
    return dl;
}
/**
 * 表单创建一行 按钮
 * @param {*} labelObj 标签介绍  text 文本  hint文本提示
 * @param {*} buttons  text按钮内容 callback 是点击事件
 * @returns 
 */
function createFormRow_Button(labelObj = { text, hint }, buttons = [{ 'text': '按钮', 'callback': function () { } }]) {
    const dl = createElementWithClass('dl', 'formRow formRow--button');
    const dt = document.createElement('dt');
    const div = createElementWithClass('div', 'formRow-labelWrapper');
    const label = createElementWithClass('label', 'formRow-label');
    label.textContent = labelObj['text'];
    const dfn = createElementWithClass('dfn', 'formRow-hint');
    dfn.textContent = labelObj['hint'];
    div.appendChild(label);
    div.appendChild(dfn);
    dt.appendChild(div);
    dl.appendChild(dt);
    const dd = document.createElement('dd');
    const ul = createElementWithClass('ul', 'listHeap');
    for (let btn = 0; btn < buttons.length; btn++) {
        let btn_obj = buttons[btn];
        const li = document.createElement('li');
        const a = createElementWithClass('a', 'button');
        const span = createElementWithClass('span', 'button-text');
        span.textContent = btn_obj['text'];
        a.addEventListener('click', btn_obj['callback']);
        a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);
    }
    dd.appendChild(ul);
    dl.appendChild(dd);
    return dl;
}

// 信息
function createFormRow_Info(labelObj = { text: '普通信息', hint: '调试' }, textObj = { default: '暂无消息' }) {
    const dl = createElementWithClass('dl', 'formRow');
    const dt = document.createElement('dt');
    const div = createElementWithClass('div', 'formRow-labelWrapper');
    const label = createElementWithClass('label', 'formRow-label');
    label.textContent = labelObj['text'];
    const dfn = createElementWithClass('dfn', 'formRow-hint');
    dfn.textContent = labelObj['hint'];
    div.appendChild(label);
    div.appendChild(dfn);
    dt.appendChild(div);
    const dd = document.createElement('dd');
    const ul = createElementWithClass('ul', 'inputChoices');
    const li = createElementWithClass('li', 'inputChoices-choice');
    const labelIconic = createElementWithClass('label', 'iconic');
    const span = document.createElement('span');
    setAttribute(span, 'className', 'iconic-label');
    setAttribute(span, 'id', 'himcbbs-menu-info');
    span.innerHTML = textObj['default'];
    labelIconic.appendChild(span);
    li.appendChild(labelIconic);
    dl.setSpanHtml = function (newHtml) {
        span.innerHTML = newHtml;
    };
    ul.appendChild(li);
    dd.appendChild(ul);
    dl.appendChild(dt);
    dl.appendChild(dd);
    return dl;
}

// 保存按钮
function createElement_saveButton(text, callback) {
    const dl = createElementWithClass('dl', 'formRow formSubmitRow');
    const dt = document.createElement('dt');
    dl.appendChild(dt);
    const dd = document.createElement('dd');
    const formSubmitRowMain = createElementWithClass('div', 'formSubmitRow-main');
    const formSubmitRowBar = createElementWithClass('div', 'formSubmitRow-bar');
    formSubmitRowMain.appendChild(formSubmitRowBar);
    const formSubmitRowControls = createElementWithClass('div', 'formSubmitRow-controls');
    const button = createElementWithClass('button', 'button--primary button button--icon button--icon--save');
    setAttribute(button, 'type', 'submit');
    button.textContent = text; 
    button.addEventListener('click', callback)
    formSubmitRowControls.appendChild(button);
    formSubmitRowMain.appendChild(formSubmitRowControls);
    dd.appendChild(formSubmitRowMain);
    dl.appendChild(dd);
    return dl;
}


// 选择点击
function selectOperation(blockElement, text = NO_OPERATION_BUTTON_TEXT) {
    let btnArrayList = blockElement.querySelectorAll('.iconic--radio');
    let flag = false;
    for (let i = 0; i < btnArrayList.length; i++) {
        let label_el = btnArrayList[i];
        let input_el = label_el.querySelector('input')
        input_el.checked = false;
        let blockContainer = blockElement.querySelector('.block-container');
        for (let i = 0; i < blockContainer.classList.length; i++) {
            if (blockContainer.classList[i].startsWith("approvalQueue-item--")) {
                blockContainer.classList.remove(blockContainer.classList[i]);
            }
        }
        if (text == AUTO_APPROVE_BUTTON_TEXT) {
            blockContainer.classList.add('approvalQueue-item--approve')
        } else if (text == '删除') {
            blockContainer.classList.add('approvalQueue-item--delete')
        }
        if (label_el.innerText.includes(text)) {
            input_el.checked = true;
            flag = true;
        }
    }
    return flag;
}

// 提取ip和邮箱
function extractIPAndEmail(divElement) {
    const result = {
        ipAddress: null,
        emailAddress: null
    };
    const ipPattern = /(?:(?:\d{1,3}\.){3}\d{1,3}|(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})/g;
    const ipElements = divElement.querySelectorAll('a[href^="/misc/ip-info"]');
    for (const element of ipElements) {
        const match = element.textContent.trim().match(ipPattern);
        if (match && match[0]) {
        result.ipAddress = match[0];
        break; 
        }
    }
    const innerText = divElement.textContent.trim();
    const innerIpMatch = innerText.match(ipPattern);
    if (innerIpMatch && innerIpMatch[0]) {
        result.ipAddress = innerIpMatch[0];
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const allTextNodes = divElement.childNodes;
    for (const node of allTextNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent.trim();
        const emailMatch = textContent.match(emailPattern);
        if (emailMatch && emailMatch[0]) {
            result.emailAddress = emailMatch[0];
            break; 
        }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'a' && node.href.startsWith('mailto:')) {
        const mailtoEmail = node.href.replace('mailto:', '').trim();
        const emailMatchFromLink = mailtoEmail.match(emailPattern);
        if (emailMatchFromLink && emailMatchFromLink[0]) {
            result.emailAddress = emailMatchFromLink[0];
            break;
        }
        }
    }
    return result;
}
// 提取邮箱域名
function extractEmailDomain(email) {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1) {
        return email.slice(atIndex + 1);
    }
    return null; 
}
// 判断IP是何种类型
function identifyIP(ipString) {
    const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    if (ipv4Regex.test(ipString)) {
        return "IPv4";
    } else if (ipv6Regex.test(ipString)) {
        return "IPv6";
    } else {
        return "其他";
    }
}




// 封装 GM_xmlhttpRequest 为一个返回 Promise 的函数
function fetchIpAddressIPV6(ip) {
    return new Promise((resolve, reject) => {
        const url = `https://ipinfo.io/${ip}`;
        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: function (response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const address = {
                    Country: doc.querySelector('.geo-table').children[0].children[2].children[1].textContent,
                    State: doc.querySelector('.geo-table').children[0].children[1].children[1].textContent,
                    City: doc.querySelector('.geo-table').children[0].children[0].children[1].textContent
                }
                const addr = `${address.Country} ${address.State} ${address.City}`
                resolve(address ? addr : null);
            },
            onerror: function (error) {
                reject(error);
            }
        });
    });
}
// 封装 GM_xmlhttpRequest 为一个返回 Promise 的函数
function fetchIpAddressIPV4(ip) {
    return new Promise((resolve, reject) => {
        const url = `https://ip.cn/ip/${ip}.html`;
        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const address = doc.querySelector('#tab0_address');
                resolve(address ? address.textContent : null);
            },
            onerror: function(error) {
                reject(error);
            }
        });
    });
}

function fetchProhibitedWords(messageContent, publisherName) {
    return new Promise((resolve, reject) => {
        const url = `${PROHIBITEDWORDS_URL}`; 
        GM_xmlhttpRequest({
            method: "POST",
            url,
            data : JSON.stringify({
                shortContentAccurateMode : conf.shortContentAccurateMode,
                shortContentFuzzyMode : conf.shortContentFuzzyMode,
                longContentAccurateMode : conf.longContentAccurateMode,
                shortContentTextProhibitedWords : conf.getlocalShortProhibitedWordsArray(),
                longContentTextProhibitedWords : conf.getlocalLongProhibitedWordsArray(),
                shortWordsFuzzyThreshold : 0.5,
                shortContentText : publisherName,
                longContentText : messageContent
            }),
            onload: function(response) {
                resolve(JSON.parse(response.responseText));
            },
            onerror: function(error) {
                reject(error);
            }
        });
    });
}

/*
    样式注入
*/
// 获取审核列表的块 + 保存按钮的块
let blocks = document.querySelector('.blocks');
// 获取要审核的块 + 保存的块
let blockArrayList = blocks != null ? blocks.children : [];
// 网页主体
let body_el = document.querySelector('body');
// 获取审核队列下的块
let pageContent_el = document.querySelector('.p-body-pageContent');
// 新建的和筛选bar相同的块
let menu_bar = createElement_simpleBlock();
// 获取菜单bar的最后一层
let menu_bar_content = menu_bar.getContentElement();


// 创建一键审批按钮
let approvalAllButton_el = createElement_simplButton('一键批准', function (event) {
    for (let i = 0; i < blockArrayList.length - 1; i++) {
        let block = blockArrayList[i];
        selectOperation(block, AUTO_APPROVE_BUTTON_TEXT);
    }
    if(blockArrayList.length > 1){
        approvalFrequency(blockArrayList.length - 1);
    }
    GM_log("自动批准操作完成!")
});

// 创建菜单按钮
let menuButton_el = createElement_simplButton('功能菜单', function () {
    GM_log('功能菜单被点击, 唤起菜单');
    let menuContainer = createElement_simpleContainerOfSetting("功能菜单 - 风纪委员综合插件");
    body_el.insertBefore(menuContainer, body_el.firstChild)
})

// 添加按钮到bar
menu_bar_content.appendChild(approvalAllButton_el);
menu_bar_content.appendChild(menuButton_el);

// 将新建的菜单条载入页面
pageContent_el.insertBefore(menu_bar, pageContent_el.childNodes[2])


// 待审核块
let pendingReviewBlock = [];
 
// 遍历审核块, 剔除保存块    帖子 个人空间评论 会员  资源   资源更新   资源版本  个人空间留言   
for (let i = 0; i < blockArrayList.length - 1; i++) {
    let block = blockArrayList[i];
    if(block.querySelector('.message-attribution-opposite') == null){
        // 遇到了封面/无法识别的块, 不处理
        continue;
    }

    let pendingReviewBlockObject = {
        id : i,
        type : block.querySelector('.message-attribution-opposite').textContent.trim(),
        publisherName: block.querySelector('.username').children[0].textContent.trim(),
        messageContent: wordsToRemoveTextContent(getTextContentUnderElement(block.querySelector('.message-userContent'))).trim().replace(/\s+/g, ' ') 
    }
    if(pendingReviewBlockObject.type === '会员'){
        // 获取IP和邮箱
        const ipAndEmailObj = extractIPAndEmail(block.querySelector('.messageNotice'));
        if(ipAndEmailObj.hasOwnProperty('ipAddress')){
            pendingReviewBlockObject.ip = ipAndEmailObj.ipAddress;
        }
        if(ipAndEmailObj.hasOwnProperty('emailAddress')){
            pendingReviewBlockObject.email = ipAndEmailObj.emailAddress;
        }
    }
    pendingReviewBlock.push(pendingReviewBlockObject);
}

// 异步处理所有的用户IP, 获取属地
async function* fetchAndYieldIpAddress(userData) {
    if (!userData || !userData.ip) {
        console.warn(`用户数据缺失或未包含IP信息，ID：${userData.id}`);
        yield { ...userData, ipAddressInfo: null };
    } else {
        let ipAddressInfo = null;
        const identifyIPType = identifyIP(userData.ip)
        if(identifyIPType == 'IPv4') {
            try {
                ipAddressInfo = await fetchIpAddressIPV4(userData.ip);
                yield { ...userData, ipAddressInfo };
            } catch (error) {
                console.error(`获取ID为${userData.id}的IP地址信息失败  -> IPV4`, error);
                yield { ...userData, ipAddressInfo: null };
            }
        }else if(identifyIPType == 'IPv6'){
            try {
                ipAddressInfo = await fetchIpAddressIPV6(userData.ip);
                yield { ...userData, ipAddressInfo };
            } catch (error) {
                console.error(`获取ID为${userData.id}的IP地址信息失败 -> IPV6`, error);
                yield { ...userData, ipAddressInfo: null };
            } 
        }else{
            yield { ...userData, ipAddressInfo: null };
        }
    }
}

// 传入userData数组
async function fetchAndProcessEachIpAddressConcurrently(userDataList) {
    for await (const processedUser of userDataList.flatMap(async user => {
        const genIterator = fetchAndYieldIpAddress(user);
        let result;
        do {
            result = await genIterator.next();
            if (!result.done) {
                let res = result.value;
                let prohibitedWordsFlag = false; 
                if(res.messageContent == ''){
                    if(conf.shortContentAccurateMode || conf.shortContentFuzzyMode){
                        let res_pw = await fetchProhibitedWords('',res.publisherName);
                        let prohibitedWords_innerHTML = '';
                        if(res_pw.shortContentAccurate != null && res_pw.shortContentAccurate.length > 0){
                            prohibitedWords_innerHTML += ` 名称违禁词: <span style='color:red'>${(res_pw.shortContentAccurate).join(',')}</span>`
                            prohibitedWordsFlag = true;
                        }
                        if(res_pw.shortContentFuzzy != null && res_pw.shortContentFuzzy.length > 0){
                            prohibitedWords_innerHTML += ` 名称模糊违禁词: <span style='color:red'>${(res_pw.shortContentFuzzy).join(',')}</span>`
                            prohibitedWordsFlag = true;
                        }
                        if(prohibitedWordsFlag){
                            let infoBlock_prohibitedWords = createInfoBlock(['highlighted','warning']);
                            infoBlock_prohibitedWords.appendInfo(prohibitedWords_innerHTML);
                            let block = blockArrayList[res.id];
                            
                            let messageContent = block.querySelector('.message-content')
                            messageContent.insertBefore(infoBlock_prohibitedWords,messageContent.firstChild)
                            selectOperation(block,NO_OPERATION_BUTTON_TEXT);
                        }
                    }
                }
                let isEmailInWhiteList = false;
                if(conf.emailMode){ 
                    let eDomain = extractEmailDomain(res.email);
                    if (eDomain != null) {
                        if (conf.getEmailListArray().includes(eDomain)) {
                            isEmailInWhiteList = true;
                        }
                    }
                }
                let isIPInWhiteList = false;
                if(conf.ipCheck){
                    if (res.hasOwnProperty('ipAddressInfo')) {
                        let ip_Address = res.ipAddressInfo;
                        if (ip_Address.trim().includes("China") || ip_Address.trim().startsWith("中国")) {
                            isIPInWhiteList = true;
                        }
                    }
                }
                if (conf.autoApprove) {
                    if (isIPInWhiteList & isEmailInWhiteList && !prohibitedWordsFlag) {
                        let block = blockArrayList[res.id];
                        selectOperation(block, AUTO_APPROVE_BUTTON_TEXT);
                        approvalFrequency(1)
                    }
                }
                const ipCheckAndEmailMode = {
                    bothOn: conf.ipCheck && conf.emailMode,
                    ipOnEmailOff: conf.ipCheck && !conf.emailMode,
                    ipOffEmailOn: !conf.ipCheck && conf.emailMode,
                    bothOff: !conf.ipCheck && !conf.emailMode,
                  };
                  
                  let emailAndIpHint;
                  let classes = ['warning', 'highlighted'];
                  
                  if (ipCheckAndEmailMode.bothOn) {
                    if (isIPInWhiteList && isEmailInWhiteList) {
                        emailAndIpHint = createInfoBlock(['moderated']);
                        emailAndIpHint.appendInfo(`<span>${res.ipAddressInfo}</span> | <span>${res.email}在预设白名单内</span>`)
        
                    } else if (isIPInWhiteList) {
                        emailAndIpHint = createInfoBlock(classes);
                        emailAndIpHint.appendInfo(`<span>${res.ipAddressInfo}</span> | <span style="color:red">${res.email}不在白名单</span>`)
                    } else if (isEmailInWhiteList) {
                        emailAndIpHint = createInfoBlock(classes);
                        emailAndIpHint = createInfoBlock(`<span style="color:red">${res.ipAddressInfo}</span> | <span>${res.email}在预设白名单内</span>`, ['moderated']);
                    } else {
                      emailAndIpHint = createInfoBlock(classes);
                      emailAndIpHint.appendInfo(`<span style="color:red">${res.ipAddressInfo}</span> | <span style="color:red">${res.email}不在白名单</span>`);
                    }
                  } else if (ipCheckAndEmailMode.ipOnEmailOff) { 
                    if (isIPInWhiteList) {
                        emailAndIpHint = createInfoBlock(['moderated']);
                        emailAndIpHint.appendInfo(`<span>${res.ipAddressInfo}</span>`);
                    } else {
                        emailAndIpHint = createInfoBlock(classes);
                        emailAndIpHint.appendInfo(`<span style="color:red">${res.ipAddressInfo}</span>`);
                    }
                  } else if (ipCheckAndEmailMode.ipOffEmailOn) {
                    if (isEmailInWhiteList) {
                        emailAndIpHint = createInfoBlock(['moderated']);
                        emailAndIpHint.appendInfo(`<span>${res.email}在预设白名单内</span>`);
                    } else {
                        emailAndIpHint = createInfoBlock(classes);
                        emailAndIpHint.appendInfok(`<span style="color:red">${res.email}不在白名单</span>`);
                    }
                  }
                  
                  if (emailAndIpHint !== null) {
                    const block = blockArrayList[res.id];
                    const messageContent = block.querySelector('.message-content');
                    messageContent.insertBefore(emailAndIpHint, messageContent.firstChild);
                  }
            }
        } while (!result.done);
    })) {
    }
}

async function processAllBatchesUsers() {
    const memberObjectsWithIp = pendingReviewBlock
        .filter(item => item.type === '会员' && item.ip)
        .map(member => ({ ...member }));
    for (let i = 0; i < memberObjectsWithIp.length; i += BATCH_SIZE_IP) {
        const batch = memberObjectsWithIp.slice(i, i + BATCH_SIZE_IP);
        await fetchAndProcessEachIpAddressConcurrently(batch);
    }
}

// 调用封装好的异步函数处理所有批次
processAllBatchesUsers();


// 处理违禁词
async function* asyncGeneratorForProhibitedWords(ReviewBlock) {
    try {
        const response = await fetchProhibitedWords(ReviewBlock.messageContent,ReviewBlock.publisherName);
        const shortContentAccurate = response.shortContentAccurate;
        const shortContentFuzzy = response.shortContentFuzzy;
        const longContentAccurate = response.longContentAccurate;
        const ProhibitedWordsArr = { shortContentAccurate, shortContentFuzzy ,longContentAccurate};
        const resultReviewBlock = {...ReviewBlock, ProhibitedWords: ProhibitedWordsArr};
        yield resultReviewBlock;
    } catch (error) {
        console.error(`获取块 ${ReviewBlock.id} 的违禁词信息失败`, error);
        yield {...ReviewBlock,ProhibitedWordsArr: null };
    }
}

// 使用异步生成器函数
async function fetchAndProcessEachProhibitedWordsConcurrently(pendingReviewBlock) {
    for await (const ReviewBlock of pendingReviewBlock.flatMap(async block => {
        const genIterator = asyncGeneratorForProhibitedWords(block);
        let result;
        do {
            result = await genIterator.next();
            if (!result.done) {
                let res = result.value;
                let prohibitedWords_innerHTML = ''
                let prohibitedWords = res.ProhibitedWords;
                let prohibitedWordsFlag = false;
                if(prohibitedWords.shortContentAccurate.length > 0){
                    prohibitedWords_innerHTML += ` 名称违禁词: <span style='color:red'>${(prohibitedWords.shortContentAccurate).join(',')}</span>`
                    prohibitedWordsFlag = true;
                }
                if(prohibitedWords.shortContentFuzzy.length > 0){
                    prohibitedWords_innerHTML += ` 名称模糊违禁词: <span style='color:red'>${(prohibitedWords.shortContentFuzzy).join(',')}</span>`
                    prohibitedWordsFlag = true;
                }
                if(prohibitedWords.longContentAccurate.length > 0){
                    prohibitedWords_innerHTML += ` 内容违禁词: <span style='color:red'>${(prohibitedWords.longContentAccurate).join(',')}</span>`
                    prohibitedWordsFlag = true;
                }
                if(prohibitedWordsFlag){
                    // 渲染到页面
                    let infoBlock_prohibitedWords = createInfoBlock(['highlighted','warning']);
                    infoBlock_prohibitedWords.appendInfo(prohibitedWords_innerHTML);
                    let block = blockArrayList[res.id];
                    
                    let messageContent = block.querySelector('.message-content')
                    messageContent.insertBefore(infoBlock_prohibitedWords,messageContent.firstChild)
                    selectOperation(block,NO_OPERATION_BUTTON_TEXT)
                    
                }
            }
        } while (!result.done);
    })) {}
}


async function processAllBatchesProhibitedWords() {
    const notEmptyMessageObjects = pendingReviewBlock.filter(item => item.hasOwnProperty('messageContent') && item.messageContent.trim());
    for (let i = 0; i < notEmptyMessageObjects.length; i += BATCH_SIZE) {
        const batch = notEmptyMessageObjects.slice(i, i + BATCH_SIZE);
        await fetchAndProcessEachProhibitedWordsConcurrently(batch);
    }
}

// 调用封装好的异步函数处理所有批次
processAllBatchesProhibitedWords();

/**
 * 删除本脚本创建的所有持久化数据
 */
function removeAllValues() {
    let arr = GM_listValues();
    for (let i = 0; i < arr.length; i++) {
        GM_deleteValue(arr[i])
    }
}


// 拟真一个信息框,并且可以持续添加内容
function createInfoBlock(status = []) {
    // highlighted 已审核(绿盾牌 变灰色)
    // moderated  已处理(绿色小盾牌)
    // warning 警告小图标(绿色警告标)

    let divElement = document.createElement('div');
    divElement.classList.add('messageNotice');
    for (let i = 0; i < status.length; i++) {
        divElement.classList.add(`messageNotice--${status[i]}`);
    }
    // 提供方法让调用者添加内容
    divElement.appendInfo = function (info) {
        let pElement = document.createElement('span');
        pElement.innerHTML = info;
        this.appendChild(pElement);
    }
    
    return divElement;
}

// 去除论坛常见内容
function wordsToRemoveTextContent(text){
    // 要被移除掉的单词
    let wordsToRemove = ["更改日志","字段名称","旧值","新值","QQ","BiliBili主页","个人信息","下载","用户名","手机号码","邮箱","邮件选项","头像","接收新闻和更新电子邮件","接收活动摘要电子邮件","头像日期","空间封面","出生日期","显示生日","显示出生年份","所在地","主页","性别","Xbox ID","Github主页","字号","风格","语言","接收新闻和更新电子邮件","接收活动摘要电子邮件","收到私信消息后邮件提醒","回复内容接收邮件提醒","回复内容接收邮件提醒","显示他人的签名","点击展开...","阅读关于此资源更多信息...","推广者"]
    let wordsAndPhrasesToMatch = wordsToRemove.flatMap(w => {
        if (/\W/.test(w)) {
            return [w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')];
        } else {
            // 对于普通单词，使用单词边界`\b`
            return [`\\b${w}\\b`];
        }
    });
    let regex = new RegExp(wordsAndPhrasesToMatch.join('|'), 'gi');
    let newText = text.replace(regex, '');

    return newText;
}

// 获取所有标签的文本内容
function getTextContentUnderElement(element) {
    
    let textContent = '';
    if(element == null) return '';
    const nodes = element.childNodes;
    for (let i = 0; i < nodes.length; ++i) {
        const node = nodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
            textContent += node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            textContent += getTextContentUnderElement(node);
        }
    }

    return textContent;
}