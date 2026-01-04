// ==UserScript==
// @name         数字广东教育一体化学校疫情防控系统登录填充
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  用于数字广东教育一体化学校疫情防控系统登录页面的手机号自动填充
// @author       Cosil
// @match        https://xtbg.gdzwfw.gov.cn/zwdsj_qmfy/jytmanage/login.html
// @icon         https://xtbg.gdzwfw.gov.cn/zwdsj_qmfy/jytmanage/favicon.ico
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/430243/%E6%95%B0%E5%AD%97%E5%B9%BF%E4%B8%9C%E6%95%99%E8%82%B2%E4%B8%80%E4%BD%93%E5%8C%96%E5%AD%A6%E6%A0%A1%E7%96%AB%E6%83%85%E9%98%B2%E6%8E%A7%E7%B3%BB%E7%BB%9F%E7%99%BB%E5%BD%95%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/430243/%E6%95%B0%E5%AD%97%E5%B9%BF%E4%B8%9C%E6%95%99%E8%82%B2%E4%B8%80%E4%BD%93%E5%8C%96%E5%AD%A6%E6%A0%A1%E7%96%AB%E6%83%85%E9%98%B2%E6%8E%A7%E7%B3%BB%E7%BB%9F%E7%99%BB%E5%BD%95%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

let loadingWatcher = setInterval(() => {
    //页面加载监听
    if (document.querySelector('#username')) {
        clearInterval(loadingWatcher);
        console.log('dom加载完毕')
        init();
    }
}, 100);

function init() {
    //获取用户名的输入框
    let usernameEle = document.querySelector('#username');
    //填充缓存中的用户名
    inputSimulator(usernameEle, localStorage.getItem('username_rem') || '');
    {
        //按钮相关
        let remEle = document.createElement('button');
        remEle.innerHTML = '点击记住当前号码';
        remEle.classList.add('gd-button');
        remEle.style.float = 'right';
        remEle.onclick = function () {
            let rem = document.querySelector('#username').value;
            localStorage.setItem('username_rem', rem)
            alert(`已记住'${rem}'`)
        }
        usernameEle.style.width = 'auto';
        usernameEle.parentElement.append(remEle);
        console.log('按钮注入完毕')
    }
}

/**
 * 输入模拟
 * @param dom 节点
 * @param st 内容
 */
function inputSimulator(dom, st) {
    let evt = new InputEvent('input', {
        inputType: 'insertText',
        data: st,
        dataTransfer: null,
        isComposing: false
    });
    dom.value = st;
    dom.dispatchEvent(evt);
}
