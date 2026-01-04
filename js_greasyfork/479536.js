// ==UserScript==
// @name         青龙JD_COOKIE助手
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  一键获取京东Cookie并更新到青龙，使用前请先编辑配置address、client_id和client_secret，桌面端请使用Tampermonkey BETA版本(红色图标的油猴)，手机端可使用ChromeXt，需支持GM_cookie否则无法获取pt_pin和pt_key
// @author       You
// @match        *://*.jd.com/*
// @connect      *
// @icon         https://home.m.jd.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479536/%E9%9D%92%E9%BE%99JD_COOKIE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/479536/%E9%9D%92%E9%BE%99JD_COOKIE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 请务必先配置以下参数才能使用
const address = "http://example.com:5700"; // 青龙面板地址
const client_id = "your-client_id"; // 青龙面板后台-系统设置-应用设置创建:Client ID
const client_secret = "your-client_secret"; // 青龙面板后台-系统设置-应用设置创建:Client Secret

var currentUser;
var needSync = false;
function Request(url, opt = {}) {
    Object.assign(opt, {
        url,
        timeout: 5000
    })
    return new Promise((resolve, reject) => {
        opt.onerror = opt.ontimeout = reject
        opt.onload = resolve
        GM_xmlhttpRequest(opt)
    })
}
 
// 为了兼容手机和电脑，优先使用浏览器的fetch，如果有跨域问题则使用GM_xmlhttpRequest
async function fetch(url, opt = {}){
    // 先尝试使用浏览器的fetch接口，目前手机测无跨域问题，而电脑上会有
    try {
        let res = await window.fetch(url,opt);
        return res;
    } catch (error) {
        console.error(error);
        showLog(`fetch请求失败，将使用GM_xmlhttpRequest请求`);
    }
 
    // 再尝试使用GM_xmlhttpRequest封装的请求，注意body要转为data
    if(opt.body) opt.data = opt.body;
    let res = await Request(url, opt);
    try {
        // 电脑版返回res.response而手机直接返回结果
        let json = res.response && JSON.parse(res.response) || JSON.parse(res);
        return {json:()=>json};
    } catch (error) {
        showLog(error);
        return res;
    }
}
var overlay = document.createElement('div');
var syncBtn = document.createElement('div');
var switchBtn = document.createElement('div');
var addBtn = document.createElement('div');
var ui = [overlay,syncBtn,switchBtn,addBtn];
function showPanel(show){
    if(show) overlay.style.display = 'block';
    else overlay.style.display = 'none';
}
function createUI() {
	// 创建悬浮按钮
    let btnStyle = "font-size:small;background: red;position: fixed;bottom: 60px;right: 20px;color: white;z-index: 9999;padding: 5px;";
	syncBtn.innerHTML = '同步到青龙';
    syncBtn.style = btnStyle;
    syncBtn.style.bottom = "60px";
	document.body.appendChild(syncBtn);
 
    switchBtn.innerHTML = '切换账号';
    switchBtn.style = btnStyle;
    switchBtn.style.bottom = "90px";
	document.body.appendChild(switchBtn);
 
    addBtn.innerHTML = '增加账号';
    addBtn.style = btnStyle;
    addBtn.style.bottom = "120px";
	document.body.appendChild(addBtn);
 
	// 创建浮层
	overlay.innerHTML = '';
	overlay.style = "font-size:small;position: fixed; bottom: 0px; width: 60%; max-height: 90%; background-color: rgba(0, 0, 0, 0.8); color: white; padding: 20px; z-index: 10000; display: none; word-wrap: break-word; overflow-y: auto;"
	document.body.appendChild(overlay);
}
function showLog(str){
    overlay.innerHTML += str + "<br>"
}
class QL {
    constructor(address, id, secret) {
        this.address = address;
        this.id = id;
        this.secret = secret;
        this.valid = true;
        this.auth = '';
    }
 
    log(content) {
        showLog(content);
        console.log(content);
    }
 
    async login() {
        const url = `${this.address}/open/auth/token?client_id=${this.id}&client_secret=${this.secret}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.code === 200) {
                this.auth = `${data.data.token_type} ${data.data.token}`;
            } else {
                this.log(`登录失败：${data.message}`);
                this.valid = false;
            }
        } catch (error) {
            this.valid = false;
            this.log(`登录失败：${error}`);
        }
        return this.valid;
    }
 
    async getEnvs() {
        const url = `${this.address}/open/envs?searchValue=`;
        const headers = {"Authorization": this.auth};
        try {
            const response = await fetch(url, { headers });
            const data = await response.json();
            if (data.code === 200) {
                return data.data;
            } else {
                this.log(`获取环境变量失败：${data.message}`);
            }
        } catch (error) {
            this.log(`获取环境变量失败：${error}`);
        }
    }
 
    async deleteEnvs(ids) {
        const url = `${this.address}/open/envs`;
        const headers = {"Authorization": this.auth, "Content-Type": "application/json"};
        try {
            const response = await fetch(url, { method: 'DELETE', headers, body: JSON.stringify(ids) });
            const data = await response.json();
            if (data.code === 200) {
                this.log(`删除环境变量成功：${ids.length}`);
                return true;
            } else {
                this.log(`删除环境变量失败：${data.message}`);
                return false;
            }
        } catch (error) {
            this.log(`删除环境变量失败：${error}`);
            return false;
        }
    }
 
    async addEnvs(envs) {
        const url = `${this.address}/open/envs`;
        const headers = {"Authorization": this.auth, "Content-Type": "application/json"};
        try {
            const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(envs) });
            const data = await response.json();
            if (data.code === 200) {
                this.log(`新建环境变量成功：${envs.length}`);
                return true;
            } else {
                this.log(`新建环境变量失败：${data.message}`);
                return false;
            }
        } catch (error) {
            this.log(`新建环境变量失败：${error}`);
            return false;
        }
    }
 
    async updateEnv(env) {
        const url = `${this.address}/open/envs`;
        const headers = {"Authorization": this.auth, "Content-Type": "application/json"};
        try {
            const response = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(env) });
            const data = await response.json();
            if (data.code === 200) {
                this.log(`更新环境变量成功`);
                return true;
            } else {
                this.log(`更新环境变量失败：${data.message}`);
                return false;
            }
        } catch (error) {
            this.log(`更新环境变量失败：${error}`);
            return false;
        }
    }
}
 
async function getJDCookie(){
    return new Promise((resolve, reject) => {
        let cookie = {};
        try{
            GM_cookie.list({domain: '.jd.com'}, (cookies, error) => {
                if(error) {
                    showLog(error);
                    return resolve(cookie);
                }
                if(!cookies) {
                    return resolve(cookie);
                }
                for (let i = 0; i < cookies.length; i++) {
                    if(cookies[i].name == "pt_pin") cookie["pt_pin"] = cookies[i].value;
                    if(cookies[i].name == "pt_key") cookie["pt_key"] = cookies[i].value;
                    if(cookie["pt_pin"] && cookie["pt_key"]) {
                        if(GM_getValue(cookie["pt_pin"]) != cookie["pt_key"]) needSync = true;
                        GM_setValue(cookie["pt_pin"], cookie["pt_key"]);
                        currentUser = cookie["pt_pin"];
                        break;
                    }
                }
                resolve(cookie);
            });
        } catch(e){
            showLog(e);
            resolve(cookie);
        }
    });
}
function addAccount(){
    try{
        showLog("尝试删除当前cookie pt_key，若成功则会自动跳转到登录页");
        GM_cookie.delete({name:"pt_key", domain: '.jd.com',}, (error)=>{ // 手机WebView需要增加domain，否则删除无效
            if (error) {
                showLog("Cookie deleted error:" + error);
            } else {
                showLog('Cookie deleted successfully');
                showLog("跳转到登录界面...");
                setTimeout(function() {
                    window.location.href = "https://plogin.m.jd.com/login/login";
                }, 3000);
            }
        });
    } catch(e){
        showLog(e);
    }
 
}
async function switchAccount(){
    const keys = GM_listValues();
    let index = 0;
    showLog(`当前:${currentUser}, 本地列表:${JSON.stringify(keys)}`);
    if(keys.length == 0 || (keys.length == 1 && keys[0] == currentUser)) {
        showLog("本地无更多京东账号");
        //return;
    }
    if(currentUser) {
        for (let i = 0; i < keys.length; i++) {
            if(keys[i] == currentUser) {
                index = i+1;
                break;
            }
        }
    }
    if(index >= keys.length) index = 0;
    showLog(`准备切换到:${keys[index]}`);
    GM_cookie.set({
        domain: '.jd.com',
        path: '/',
        secure: true,
        httpOnly: true,
        expirationDate: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), // Expires in 30 days
        name: 'pt_pin',
        value: keys[index]
    }, function(error) {
        if (error) {
            showLog(error);
        } else {
            showLog('Cookie pt_pin set successfully.');
        }
    });
    GM_cookie.set({
        domain: '.jd.com',
        name: 'pt_key',
        path: '/',
        secure: true,
        httpOnly: true,
        expirationDate: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), // Expires in 30 days
        value: GM_getValue(keys[index])
    }, function(error) {
        if (error) {
            showLog(error);
        } else {
            showLog('Cookie pt_key set successfully.');
            showLog("跳转中...");
            setTimeout(function() {
                window.location.href = "https://home.m.jd.com/myJd/newhome.action";
            }, 3000);
        }
    });
 
}
async function sync(force){
    const cookie = await getJDCookie();
    if(!needSync && !force) {
        showLog("已经同步过");
        return;
    }
    showPanel(true);
    if(!cookie["pt_pin"] || !cookie["pt_key"]) {
        return showLog("未获取到pt_pin和pt_key");
    }
    showLog(`成功获取Cookie:pt_key=${cookie["pt_key"]};pt_pin=${cookie["pt_pin"]}`)
    if(address == "http://example.com:5700") return showLog("请先配置参数address、client_id和client_secret!");
    const ql = new QL(address, client_id, client_secret);
    showLog("开始登陆青龙面板:" + address);
    if(!await ql.login()) return;
    showLog("开始获取青龙环境变量");
    const envs = await ql.getEnvs();
    console.log(envs);
    let qlJDCookies = [];
    let jdEnv = {};
    for (let i = 0; i < envs.length; i++) {
        if(envs[i].name == "JD_COOKIE" && envs[i].value != "" ) {
            qlJDCookies = envs[i].value.split("\n");
            jdEnv = envs[i];
            break;
        }
    }
    if(!jdEnv.value){
        return showLog("青龙面板内无JD_COOKIE环境变量,请创建!");
    }
    const cookieStr = `pt_key=${cookie["pt_key"]};pt_pin=${cookie["pt_pin"]};`;
    if(jdEnv.value.indexOf(cookie["pt_pin"]) == -1){ // 新增
        qlJDCookies.push(cookieStr);
    } else {
        for (let j = 0; j < qlJDCookies.length;j++) {
            if(qlJDCookies[j].indexOf(cookie["pt_pin"]) >= 0){ // 更新
                qlJDCookies[j] = cookieStr;
                break;
            }
        }
    }
 
    // 更新JD_COOKIE
    showLog("开始更新青龙环境JD_COOKIE");
    await ql.updateEnv({
        "id": jdEnv["id"],
        "name": jdEnv["name"],
        "value": qlJDCookies.join("\n")
    });
}
(function() {
    'use strict';
    createUI();
	// 点击悬浮按钮
	syncBtn.addEventListener('click', function() {
		showPanel(true);
        sync(true);
	});
	switchBtn.addEventListener('click', async function() {
        showPanel(true);
        await sync();
        switchAccount();
	});
	addBtn.addEventListener('click', async function() {
        showPanel(true);
        await sync();
        addAccount();
	});
	// 点击浮层外部隐藏浮层
	document.addEventListener('click', function(e) {
        for (let i = 0; i < ui.length; i++) {
            if(e.target === ui[i]) return;
        }
        showPanel(false);
	});
	setTimeout(sync, 1000);
})();