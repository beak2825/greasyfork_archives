// ==UserScript==
// @name         QianDao Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  web qiandao script.
// @author       LaoTie
// @match        https://www.7xjia.com/mission/today
// @match        https://juejin.cn/*
// @icon
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477767/QianDao%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/477767/QianDao%20Script.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // denglu();
    // Task(Defaultsave);

    Start();
})();

function save(data) {
    GM_setValue('data', data);
}

async function Start() {
    formattedDate();
    if(document.location.host==='juejin.cn'){
        window.addEventListener('load',function(){
            Task(juejin).then(juejin_click1);
        },false);
    }
    if (document.location.host==='www.7xjia.com') {
        await Task(qiandaoObs).then(dengluObs).then(denglu())
        setInterval(
            await Task(qiandaoObs).then(dengluObs).then(denglu()), 1000 * 60 * 60
        );
    }    
}

async function juejin(){
    const btn= document.querySelector('.btn-text');
    if(btn!=null){
        btn.click();
    }
}

function juejin_click1(){
    const btn=document.querySelector('.signin.btn');
    if(btn!=null){
        btn.click();
    }
}

async function denglu() {
    const btn = document.querySelector('.header-login-button button');
    if (btn != null) {
        btn.click();
    }
}

const event = document.createEvent('HTMLEvents')
event.initEvent('input', false, true)

async function dengluObs() {
    var node = document.querySelector('.modal');
    var conf = { attributes: true };
    const callback = async (mutationList) => {
        for (const element of mutationList) {
            if (element.type == 'attributes') {
                console.log('登录observer-count:', element);
                await taskUser();
                nodeobserver.disconnect();
            }
        };
    }
    var nodeobserver = new MutationObserver(callback);
    nodeobserver.observe(node, conf);
}

function qiandaoObs() {
    const node = document.querySelector('.custom-page-title.box.b2-radius.b2-pd.mg-b');
    var conf = { attributes: true, childList: true, subtree: true }
    const callback = async (mutationList) => {
        for (const element of mutationList) {
            if (element.type == 'childList') {
                console.log('签到observer-count:', element);
                await Task(qiandao);
                await Task(LoginOut);
                nodeobserver.disconnect();
                return;
            }
        };
    }
    var nodeobserver = new MutationObserver(callback);
    nodeobserver.observe(node, conf);
}

async function taskUser() {
    let users = await GM_getValue('data');
    for (u of users) {
        console.log(u.name);
        if (Date.now() - u.date > 1000 * 60 * 60 * 24) {
            const username = document.querySelector('.login-form-item input[name=username]');
            username.value = u.name;
            username.dispatchEvent(event);
            const pass = document.querySelector('.login-form-item input[name=password]');
            pass.value = u.pass;
            pass.dispatchEvent(event);
            document.querySelector('.login-bottom button').click();
            u.date = Date.now();
            await Task(save, users);
            return;
        }
    }
}

async function qiandao() {
    const has = document.querySelector('.custom-page-row.gold-row.mg-t span b');
    if (has != null && has.innerText == '今日未签到') {
        document.querySelector('.custom-page-row.gold-row.mg-t button').click();
    }
}

async function LoginOut() {
    const logout = document.querySelector('.top-user-avatar.avatar-parent img');
    if (logout != null) {
        logout.click();
        document.querySelector('.login-out.user-tips a').click();
    }
}

function formattedDate(){
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    console.log(formattedDate);
}

function Task(t) {
    return new Promise((r, j) => {
        r(t())
    });
}

function Task(t, d) {
    return new Promise((r, j) => {
        r(t(d))
    });
}

function Defaultsave() {
    let users = [{ name: 'lihui7800@163.com', pass: '3402690', date: 0 }, { name: 'qixijia001@163.com', pass: '3402690', date: 0 },
    { name: 'qixijia002@163.com', pass: '3402690', date: 0 }, { name: 'qixijia003@163.com', pass: '3402690', date: 0 }];
    GM_setValue('data', users);
}