// ==UserScript==
// @name         天眼查共享会员
// @namespace    http://tampermonkey.net/
// @version      0.7
// @license      ***
// @description  纯爱发电，希望能对你有所帮助，如你有余力也希望一起携手共创共享
// @author       Detom
// @match        https://www.tianyancha.com/*
// @icon         https://www.tianyancha.com/favicon.ico
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499386/%E5%A4%A9%E7%9C%BC%E6%9F%A5%E5%85%B1%E4%BA%AB%E4%BC%9A%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/499386/%E5%A4%A9%E7%9C%BC%E6%9F%A5%E5%85%B1%E4%BA%AB%E4%BC%9A%E5%91%98.meta.js
// ==/UserScript==

(function() {
    var time_space = 300;
    var reload_count = 0;
    let cloud_script = $('<script></script>')
    cloud_script.on('load',chech_login_status);
    $('body').append( cloud_script );
    cloud_script.attr('src','https://urlcode.cn/TYC_account.php');
    $('body').append( $('<script src="https://urlcode.cn/TYC_auth_token.js"></script>') );
    function changeReactInputValue(inputDom,newText){
        let lastValue = inputDom.value;
        inputDom.value = newText;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = inputDom._valueTracker;
        if (tracker) {
          tracker.setValue(lastValue);
        }
        inputDom.dispatchEvent(event);
    }
    function setCookie(name,value){
        document.cookie = `${name}=${value}; path=/; domain=.tianyancha.com;`;
    }
    function getCookie(name){
        let res = document.cookie.match(`${name}=[^;]*;?`);
        if( res ){
            res = res[0].replace(name+'=','');
            res = res.replace(';','');
            return res;
        }
        return res;
    }

    function chech_login_status(){
        // 登录、注册按钮 未登录状态下的
        var unlogin_flag_btn = $('.tyc-header-nav-item.tyc-nav-user .tyc-nav-user-btn').eq(0);
        // 关闭二维码登录按钮
        var close_qrcode_login_btn = '.login-toggle.-scan';
        // 选择账号密码登录按钮
        var set_account_password_login_btn = '.title-password';
        // 账号输入框
        var account_input = '.phone ._cc76e._7c380._03321';
        // 密码输入框
        var password_input = '.password ._cc76e._7c380._03321';
        // 用户协议 勾选按钮
        var liscent_check = '.login-bottom input[type="checkbox"]';
        // 登录按钮
        var login_btn = '._50ab4._c9d44._52bf6';

        if(location.pathname == '/login'){
            // 关闭二维码登录按钮
            close_qrcode_login_btn = '.toggle_box.-qrcode';
            // 选择账号密码登录按钮
            set_account_password_login_btn = '.title:nth-child(2)';
            // 账号输入框
            account_input = '#mobile';
            // 密码输入框
            password_input = '#password';
            // 用户协议 勾选按钮
            liscent_check = '#agreement-checkbox-account';
            // 登录按钮
            login_btn = '.sign-in .btn.btn-primary';
        }


        if( (unlogin_flag_btn.length>0 || location.pathname == '/login') && typeof(tyc_auth_token)!=='undefined'){
            reload_count = getCookie('reload_count');
            reload_count = reload_count == null? 0 : parseInt(reload_count);

            console.log("getCookie('auth_token')|| reload_count < 3",getCookie('auth_token') && reload_count < 3);
            if(getCookie('auth_token') == null && reload_count < 3){
                setCookie('auth_token',tyc_auth_token);
                if(reload_count<3){
                    reload_count += 1;
                    setCookie('reload_count', reload_count);
                    location.reload();
                }
            }else{
                console.log('unlogin_flag_btn',unlogin_flag_btn);
                unlogin_flag_btn.click();

                console.log('unlogin_flag_btn.click');

                setTimeout(function(){
                    if( $(close_qrcode_login_btn).length>0 ){
                        $(close_qrcode_login_btn).click();

                        console.log('close_qrcode_login_btn.click');

                        setTimeout(function(){
                            if( ! $(set_account_password_login_btn).hasClass('title-active') ){
                                $(set_account_password_login_btn).click();
                            }

                            if( $(liscent_check).length>0){
                                if( ! $(liscent_check)[0].checked ){
                                    $(liscent_check).click();
                                }
                            }

                            if($(account_input).length>0){
                                changeReactInputValue($(account_input)[0],tyc_account);
                            }

                            if($(password_input).length>0){
                                changeReactInputValue($(password_input)[0],tyc_password);
                            }

                            if($(login_btn)){
                                $(login_btn).click();
                            }


                            setTimeout(chech_login_status,1000);

                        },time_space);
                    }else{
                        setTimeout(chech_login_status,1000);
                    }
                },time_space)
            }
        }else{

            if(document.cookie.indexOf('auth_token=') != -1 && typeof(tyc_auth_token)!=='undefined'){
                let cookie_auth_token  =getCookie('auth_token');
                console.log('更新token：',cookie_auth_token);
                if(cookie_auth_token !== tyc_auth_token){
                    setCookie('reload_count',0);
                    $('body').append( $(`<script src="https://urlcode.cn/TYC_auth_token.php?auth_token=${cookie_auth_token}"></script>`) );
                }
            }
            setTimeout(chech_login_status,1000);
        }
    }
})();