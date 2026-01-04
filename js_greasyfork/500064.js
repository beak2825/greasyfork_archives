// ==UserScript==
// @name         密码与版本
// @version      2025-09-03-1500
// @description  自用于自身应用的脚本，作为密码生成和版本切换的快捷方式
// @author       RiseDmc
// @match        *://*/akx-admin-center/
// @match        *://*/qqadmin/passport/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/1330506
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/500064/%E5%AF%86%E7%A0%81%E4%B8%8E%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/500064/%E5%AF%86%E7%A0%81%E4%B8%8E%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

const cr_script = document.createElement('script');
// cr_script.src = window.location.origin + '/plugin/js/Crypto-JS.js';
cr_script.src = 'https://web.akxing.com/plugin/js/Crypto-JS.js';
document.head.appendChild(cr_script);
const jq_script = document.createElement('script');
// jq_script.src = window.location.origin + '/plugin/js/jquery_360.js';
jq_script.src = 'https://web.akxing.com/plugin/js/jquery_360.js';
document.head.appendChild(jq_script);
// GM_xmlhttpRequest({
//   method: "GET",
//   url: "https://web.akxing.com/plugin/js/jquery_360.js",
//   onload: function(response) {
//     script.textContent = response.responseText;
//     document.head.appendChild(script);
//   }
// });
// GM_xmlhttpRequest({
//   method: "GET",
//   url: "https://web.akxing.com/plugin/js/Crypto-JS.js",
//   onload: function(response) {
//     script.textContent = response.responseText;
//     document.head.appendChild(script);
//   }
// });


var vue_app = null,web_version = null,api_domain='',api_url='';
var _w = unsafeWindow,$ = _w.jQuery || top.jQuery, CryptoJS = _w.CryptoJS || window.CryptoJS;

class DateHandler{
    getDateYmd(){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        month = (month > 9) ? month : ("0" + month);
        day = (day < 10) ? ("0" + day) : day;
        return year + "-" + month + "-" + day;
    }
}

function httpGet(url, params = {}, headers = {}, withCredentials = false) {
    return new Promise((resolve, reject) => {
        // 创建 XMLHttpRequest 对象
        const xhr = new XMLHttpRequest();

        // 将参数拼接到 URL 中
        const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        const requestUrl = queryString ? `${url}?${queryString}` : url;

        // 初始化请求
        xhr.open('GET', requestUrl, true);
        xhr.withCredentials = withCredentials;

        // 设置请求头
        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
        }

        // 监听请求完成事件
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                // 请求成功，解析响应
                try {
                    const response = xhr.responseText;
                    resolve(response);
                } catch (error) {
                    resolve(xhr.responseText); // 如果响应不是 JSON，直接返回原始文本
                }
            } else {
                // 请求失败
                reject(new Error(`请求失败: ${xhr.statusText}`));
            }
        };

        // 监听请求错误事件
        xhr.onerror = function () {
            reject(new Error('请求出错'));
        };

        // 发送请求
        xhr.send();
    });
}

class PwdHandler{
    constructor() {
        let self = this;
        if(web_version == 'akx'){
            this.username_input = $('#app .login-box input[placeholder="账号"]');
            this.password_input = document.querySelector('#app .login-box input[placeholder="密码"]');
            $('#app').on('click','.login-box .title',function(){
                self.getPwd();
            });
        }else{
            this.username_input = $('#user_name');
            this.password_input = document.querySelector("#password");
            this.click_dom = document.querySelector('.login-box-msg');
            this.click_dom.addEventListener('click', function(){
                self.getPwd();
            });
        }
    }
    getPwd(){
        let name = this.username_input.val();
        if(name.trim()){
            let pwd = name+'@'+(new DateHandler()).getDateYmd();
            pwd = _w.CryptoJS.MD5(pwd)+"@#!";
            // const inputEl = document.querySelector('#app .login-box input[placeholder="密码"]');
            this.password_input.value = pwd;
            this.password_input.dispatchEvent(new Event('input'));
        }
    }
}

class CookieHandler{
    //设置cookies
    setCookie(name,value){
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";path=/;expires=" + exp.toGMTString();
    }

    //读取cookies
    getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

        if(arr=document.cookie.match(reg)){
            return (arr[2]);
        }
        else{
            return null;
        }
    }

    //删除cookies
    delCookie(name)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=this.getCookie(name);
        if(cval!=null){
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        }
    }
}

class GrayHandler{
    constructor() {
        let self = this;
        (new DateHandler()).getDateYmd()
        httpGet(api_url+"getVersionList").then(response => {
            let versions = response.data || JSON.parse(response);
            if(web_version == 'akx'){
                self.initAKX(versions.data);
            }else{
                self.initHT(versions);
            }
        });
    }
    initAKX(options){
        let html = `<div data-v-b3b023b8="" class="form-item"><div data-v-b3b023b8="" class="input-with-icon"><select class="form-control" id="grayVersionSelect">`
        for(let item of options){
            html += `<option value='${item.version}'>${item.name}</option>`;
        }
        html+=`</select></div></div>`;
        this.mainForm = $('#app .login-box');
        this.mainForm.append(html);
        this.grayVersionSelect = document.getElementById('grayVersionSelect');
        let cookies = new CookieHandler();
        for (var i = 0; i < this.grayVersionSelect.options.length; i++) {
            if (this.grayVersionSelect.options[i].value === cookies.getCookie("GARY_VERSION")) {
                this.grayVersionSelect.selectedIndex = i;
                console.log(api_url+"doInVersion?version="+cookies.getCookie("GARY_VERSION"));
                httpGet(api_url+"doInVersion?version="+cookies.getCookie("GARY_VERSION"),{},{},true).then(response => {});
                break;
            }
        }
        this.grayVersionSelect.addEventListener('change', function(event){
            cookies.setCookie("GARY_VERSION",event.target.value);
            window.location.href = window.location.origin + '/?timestamp=' + new Date().getTime();
        });
    }
    initHT(options){
        let html = `<div class="form-group has-feedback" id="grayVersion"><select class="form-control" id="grayVersionSelect">`
        for(let item of options){
            html += `<option value='${item.version}'>${item.name}</option>`;
        }
        html+=`</select></div>`;
        this.mainForm = $('#mainForm');
        this.mainForm.prepend(html);
        this.grayVersionSelect = document.getElementById('grayVersionSelect');
        let cookies = new CookieHandler();
        for (var i = 0; i < this.grayVersionSelect.options.length; i++) {
            if (this.grayVersionSelect.options[i].value === cookies.getCookie("GARY_VERSION")) {
                this.grayVersionSelect.selectedIndex = i;
                break;
            }
        }
        this.grayVersionSelect.addEventListener('change', function(event){
            cookies.setCookie("GARY_VERSION",event.target.value);
            window.location.href = window.location.origin + '/?timestamp=' + new Date().getTime();
        });
    }
}

function Init(){
        $ = _w.jQuery;
        CryptoJS = _w.CryptoJS;
        let dom = document.getElementById('app');
        vue_app = dom ? document.getElementById('app').__vue_app__ : '';

        if(vue_app){
            if(!document.querySelector("#app")){return false;}
            api_domain = vue_app.config.globalProperties.$env.baseApi.match(/https?:\/\/[^\/?#]+/i)[0];
            api_url = api_domain + '/api/common/';
            web_version = 'akx';
        }else{
            web_version = 'ht';
        }

        new PwdHandler();

        new GrayHandler();
}

(function() {
    'use strict';
    setInterval(()=>{
        if((document.querySelector(".login-box-body") || document.querySelector(".login-box")) && !document.querySelector("#grayVersionSelect")){
            Init();
        }
    },1000);
    // Your code here...
})();
