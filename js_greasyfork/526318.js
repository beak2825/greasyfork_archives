// ==UserScript==
// @name         漫游者哨站-快速注册
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  快速注册账号
// @author       dx
// @match        https://pilgrimoutpost.techlandgg.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://greasyfork.org/zh-TW/scripts/526318
// @downloadURL https://update.greasyfork.org/scripts/526318/%E6%BC%AB%E6%B8%B8%E8%80%85%E5%93%A8%E7%AB%99-%E5%BF%AB%E9%80%9F%E6%B3%A8%E5%86%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/526318/%E6%BC%AB%E6%B8%B8%E8%80%85%E5%93%A8%E7%AB%99-%E5%BF%AB%E9%80%9F%E6%B3%A8%E5%86%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //
    let time_reload = 1000; // 执行完整流程后延时1s自刷新 看网速情况修改
    //
    window.addEventListener('load', function() {
        console.log('嘿嘿嘿已加载');
        initBtn();
    });

    function initBtn(){
        const node = document.querySelector('.signin');
        const btn_main = document.createElement('button');
        btn_main.style.height = '28px';
        btn_main.style.borderRadius = '15px';
        btn_main.style.background = '#000';
        btn_main.style.borderColor = '#707070';
        btn_main.style.marginLeft = '6px';
        btn_main.style.display = 'flex';
        btn_main.style.justifyContent = 'center';
        btn_main.style.alignItems = 'center';
        btn_main.style.fontWeight = '400';
        btn_main.innerText = `嘿嘿(${localStorage.getItem('dx')??0})`;
        btn_main.onclick = async ()=>{
            let text_clipboard = '';
            if (navigator.clipboard) {
                text_clipboard = await navigator.clipboard.readText();
            }
            const val_inp = prompt('请输入一些内容：', text_clipboard);
            if(val_inp){
                fillMailInp(val_inp);
                fillPwdInp(val_inp);
                fillPPwdInp(val_inp);
                checkAll();
                setTimeout(() => {
                    submit();
                }, 50);
                btn_main.innerText = `嘿嘿(${record()})`;
                setTimeout(()=>{
                    location.reload();
                },time_reload)
            }
        }
        node?.appendChild(btn_main);
        //
        const btn_clear = document.createElement('button');
        btn_clear.style.height = '28px';
        btn_clear.style.borderRadius = '15px';
        btn_clear.style.background = '#000';
        btn_clear.style.borderColor = '#707070';
        btn_clear.style.marginLeft = '6px';
        btn_clear.style.display = 'flex';
        btn_clear.style.justifyContent = 'center';
        btn_clear.style.alignItems = 'center';
        btn_clear.style.fontWeight = '400';
        btn_clear.innerText = ` 清除计数`;
        btn_clear.onclick = ()=>{
            localStorage.removeItem('dx');
            alert('已清除');
            location.reload();
        }
        node?.appendChild(btn_clear);
    }

    function fillMailInp(val){
        const el = document.querySelector(`input[name='mail']`);
        if(el){
            el.value = val;
        }
    }

    function fillPwdInp(val){
        const el = document.querySelector(`input[name='pwd']`);
        if(el){
            el.value = val;
        }
    }

    function fillPPwdInp(val){
        const el = document.querySelector(`input[name='ppwd']`);
        if(el){
            el.value = val;
        }
    }

    function checkAll(){
        const els = document.querySelectorAll(`[type='checkbox']`);
        els?.forEach((el)=>{
            el.checked = true;
        });
    }

    function submit(){
        const btn = document.querySelector(`[type='submit']`);
        btn?.click();
    }

    function record(){
        const count = Number(localStorage.getItem('dx'))+1;
        localStorage.setItem('dx',count?.toString());
        return count;
    }
})();
