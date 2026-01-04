// ==UserScript==
// @name         Auto Login For Greasy Fork
// @name-en      Auto Login For Greasy Fork
// @name-zh      自动登录 Greasy Fork
// @namespace    https://zfdev.com/
// @version      0.1
// @description  Don't want to click to log in
// @description-zh  不想每次打开网站都重新登录
// @author       greendev
// @match        https://greasyfork.org/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/374197/Auto%20Login%20For%20Greasy%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/374197/Auto%20Login%20For%20Greasy%20Fork.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 如果你想加密
    // You can achieve their own
    let encryption = function(s){
        return s;
    }, decrypt =function(s){
        return s;
    }

    let $$$ = document.querySelector.bind(document),
        $$$$ = document.querySelectorAll.bind(document),
        local = {
            en:{
                btnName: 'Auto Login',
                tips: 'Requested login',
            },
            'zh-CN':{
                btnName: '自动登录',
                tips: '已请求登录',
            },
            'zh-TW':{
                btnName: '自動登入',
                tips: '已請求登錄',
            },
        },
        username , password, lang;

    let savePwd = function(u, p ){
        if (u && u.replace(/ /g,"") && p && p.replace(/ /g,"")){
            localStorage.setItem('zfdevAutoLoginU', encryption(u));
            localStorage.setItem('zfdevAutoLoginP', encryption(p));
            setSetting(true);
            return true;
        }
        return false;
    }, loadPwd = function(){
        let u = localStorage.getItem('zfdevAutoLoginU'),p = localStorage.getItem('zfdevAutoLoginP');
        if(u && p){
            username = decrypt(u); password = decrypt(p);
            return true;
        }
        return false;
    }, setSetting = function(state){
        localStorage.setItem('zfdevAutoLoginState', state);
    }, getSetting = function(){
        let s = localStorage.getItem('zfdevAutoLoginState');
        return s === null ? false : s==='true';
    }, getLang = function(){
        if(lang){return lang;};
        let l = $$$('html').lang;
        if(local.hasOwnProperty(l)){
            lang = 'en';
            return l;
        }
        lang = 'en';
        return 'en';
    };


    let loginPage = function(){
        let from = $$$('#new_user');
        let $loginBtn = document.createElement('div');
        $loginBtn.className = "zfdev-auto-login";
        let btnName = 'Auto Login';
        let lang = getLang();
        btnName = local[lang].btnName;
        let butHTML = '<div id="zfdev-auto-login" style="display:block;width:100%;min-height:34px;box-sizing:border-box;margin:0.5em 0 0 0;padding:6px 8px;font-size:14px;font-weight:bold;line-height:20px;text-align:center;vertical-align:middle;color:#fff;background-color:#670000;background-image:linear-gradient(#900,#670000);border:1px solid #ddd;border-radius:3px;cursor:pointer;">'+btnName+'</div>';
        $loginBtn.innerHTML = butHTML;
        from.appendChild($loginBtn);
        $loginBtn.onclick = function(){
            let u = $$$('#new_user input#user_email').value,
                p = $$$('#new_user input#user_password').value;
            savePwd(u, p) && from.submit();
            console.log('保存密码');
        }
    },
        isLogin = function(){
            let s = $$$('#site-nav .sign-in-link');
            return s ? false : true;
        },
        post = function(url, data){
            return new Promise(function(resolve, reject){
                var  xhr = new XMLHttpRequest();
                xhr.open("post", url, true);
                xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
                xhr.send(data);
                xhr.onreadystatechange = function(){
                    if (xhr.readyState == 4) {
                        if ( xhr.status >= 200 && xhr.status < 300 ) {
                            resolve(xhr);
                        }else if(xhr.status == 302){
                            resolve(xhr);
                        }
                    };
                }
            });
        };

    if(location.pathname.indexOf('users/sign_in') > 0){
        loginPage();
    }else{
        if(!isLogin()){
            if(getSetting() && loadPwd()){
                let token =$$$('meta[name="csrf-token"]').content;
                let data = 'utf8=%E2%9C%93&authenticity_token='+ encodeURIComponent(token) + '&user%5Bemail%5D=' + encodeURIComponent(username) + '&user%5Bpassword%5D=' + encodeURIComponent(password) + '&user%5Bremember_me%5D=1';
                let url ='/en/users/sign_in';
                post(url, data).then(r=>{
                    let s = $$$('#site-nav .sign-in-link a');
                    s.innerHTML = local[getLang()].tips;
                });

            }
        }else{
            $$$('#site-nav .sign-out-link').onclick = function(){
                setSetting(false);
            }

        }
    }


})();