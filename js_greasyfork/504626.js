// ==UserScript==
// @name         ChatGPT 小优化
// @namespace    binger.cc
// @version      1.0
// @description  ChatGPT：点击不登录；按回车发送
// @author       Ervoconite@yeah.net
// @match        http*://chatgpt.com/*
// @icon         https://openai.com/favicon.ico
// @license      GPLv3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504626/ChatGPT%20%E5%B0%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/504626/ChatGPT%20%E5%B0%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

/**
更新日志：

🌟 2024年8月22日：初版
 - 自动点击掉登录提醒，保持未登录
 - 文本框绑定回车按钮为发送，方便窄窗口使用

*/

window.addEventListener('load', ()=>{
    //console.log('ok');
    let itv = setInterval(()=>{
        let a, diag = document.getElementById('radix-:r4:')
        if(diag && (a = diag.querySelector('a'))){
            a.click();
            clearInterval(itv);
        }
        //else { console.log('no') }
    }, 100)
    setTimeout(()=>{clearInterval(itv);}, 3000)


    function modifyText(ml, obs) {
        let text = document.getElementById('prompt-textarea');
        if(!text) {
            alert('无法找到文本框，脚本或已过期，请在插件中禁用或更新！');
            if(obs) obs.disconnect();
            return;
        }
        //let sendbtn = text.parentElement.nextSibling; // 存储后失效
        text.addEventListener('keydown', (e)=>{
            if(e.key == 'Enter' && e.ctrlKey===false && e.shiftKey===false ) {
                //console.log(text, sendbtn, e);
                e.preventDefault();
                e.stopPropagation();
                text.parentElement.nextSibling.click();
            }
        })
    }
    let obs = new MutationObserver(modifyText)
    obs.observe(
        document.body.querySelector('main'), {childList: true}
    );
    modifyText([], obs);
})