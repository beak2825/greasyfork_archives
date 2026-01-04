// ==UserScript==
// @name         newstudio.tv - autoLogin
// @namespace    https://zfdev.com/
// @version      0.1
// @description  autoLogin
// @author       greendev
// @exclude      http://newstudio.tv/login.php
// @match        http://newstudio.tv/
// @match        http://newstudio.tv/index.php
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374170/newstudiotv%20-%20autoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/374170/newstudiotv%20-%20autoLogin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $profile = document.querySelector('#profile');
    let username = "",
        password = "";

    let setPwd = function(){
        let u = prompt("input username:"), p = prompt("input password:");
        if (u && u.replace(/ /g,"") && p && p.replace(/ /g,"")){
            username = u;
            password = p;
            localStorage.setItem('u', u);
            localStorage.setItem('p', p);
            return true;
        }
    }, getPwd = function(){

        let u =localStorage.getItem('u'),
            p = localStorage.getItem('p');
        if(u && p){
            username = u;
            password = p;
            return true;
        }else{
            if (setPwd()){
                return true;
            }
        }
        return false;

    }, autoLogin = function(){
        // let $profile = document.querySelector('#profile');
        if(!$profile){
            let $loginModal = document.querySelector('#login');
            let u =document.querySelector('#login input[name="login_username"]'), p=document.querySelector('#login input[name="login_password"]');
            if(u && p && u){
                u.value = username, p.value = password;
                $('.form-signin').submit();
                return true;
            }
        }
    };
    setTimeout(function(){
        if(!$profile && getPwd()){
            autoLogin();
        }
    },3000);
})();

