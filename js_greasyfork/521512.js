// ==UserScript==
// @name         重庆法制考试答题-复制标题
// @namespace    http://tampermonkey.net/
// @version      0.3.6
// @description  点击题目后，自动复制标题（便于搜索题目）
// @author       moxiaoying
// @match        http://121.43.156.136/exam/user/exam/into*
// @match        https://ks.cqsdx.cn/exam/user/exam/into*
// @match        https://ks.cqsdx.cn/exam/user/bind*
// @match        http://121.43.156.136/exam/user/exam_record/view*
// @match        https://ks.cqsdx.cn/exam/user/exam_record/view*
// @match        https://ks.cqsdx.cn/exam/user/exam/submit
// @grant        GM_addElement
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521512/%E9%87%8D%E5%BA%86%E6%B3%95%E5%88%B6%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98-%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/521512/%E9%87%8D%E5%BA%86%E6%B3%95%E5%88%B6%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98-%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

const span = createMessage()

const sleep = async (time_delay) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time_delay * 1000)
    })
}
function createMessage() {
    const span = document.createElement('span')
    let style = `position: fixed; right: 10px; top: 80px; width: 500px; text-align: left; background-color: rgba(255, 255, 255, 0.9); z-index: 99; padding: 10px 20px; border-radius: 5px; color: #222; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); font-weight: bold;`
    span.setAttribute('style', style)
    span.innerText = '脚本启动成功'
    document.body.appendChild(span)
    return span
}

function message(text = '') {
    span.innerHTML = text
}


// 添加按钮到指定父元素
const addBtn = (content, click_func = null, parent_element = '.panel-title') => {
    let heasers = document.querySelector(parent_element);
    let button = document.createElement('button');
    button.innerHTML = content;
    button.className = 'layui-btn layui-btn-warm';
    button.onclick = click_func;
    heasers.append(button);
}


// 格式化title（去除空格）
function formatTitle(title) {
    return title.textContent.trim();
}
function getCurrentTitle() {
    const title = document.querySelector('#questions .badge').nextElementSibling
    return formatTitle(title);
}
function copyCurrentTitle() {
    let title = getCurrentTitle()
    title = title.slice(4, -7)
    if (title.length > 10) {
        title = title.substr(0,20)
    }
    GM_setClipboard(title)
}


function hookGen(originalFunc) {
    return function(...args) {
        const result = originalFunc.apply(this, args);
        
        copyCurrentTitle()
        
        // 返回原始函数的结果
        return result;
    }
}
// 替换原始函数
gen = hookGen(gen);

