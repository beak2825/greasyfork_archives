// ==UserScript==
// @name         hifini蓝奏云链接跳转
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  hifini蓝奏云分享地址生成自动填充和自动下载链接
// @author       Pr
// @match        https://www.hifini.com/*
// @match        https://*.lanzoui.com/*
// @match        https://*.lanzouo.com/*
// @match        https://*.lanzoux.com/*
// @icon         https://www.hifini.com/view/img/logo.png
// @grant        none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469315/hifini%E8%93%9D%E5%A5%8F%E4%BA%91%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/469315/hifini%E8%93%9D%E5%A5%8F%E4%BA%91%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let doc_obj = document.querySelectorAll('.alert.alert-success')

    doc_obj.forEach((doc_div)=>{
        let click_flag;
        let url_flag;
        let captcha_flag;

        click_flag = setInterval(get_code, 1000);
        function get_code() {
            let get_code_btn = document.getElementById("lp_code")
            if(get_code_btn){
                clearInterval(click_flag)
                get_code_btn.click()

                captcha_flag = setInterval(captcha, 1000);
            }
        }

        function captcha() {
            let captcha = document.getElementsByClassName("geetest_box_wrap")[0];
            if(captcha){
                let vail_display = window.getComputedStyle(captcha,null).getPropertyValue('display');
                if(vail_display == 'block') {
                    console.log("skip!");
                    return;
                }
                url_flag = setInterval(general_url, 2000);
                clearInterval(captcha_flag);
            }else{
                url_flag = setInterval(general_url, 2000);
                clearInterval(captcha_flag);
            }
        }


        function general_url(){
            let inner_text = doc_div.innerText
            if(inner_text.indexOf("lanzou") != -1){
                inner_text = inner_text.substring(inner_text.indexOf("http"), inner_text.length).replace(/\s*/g, "");
                let href = inner_text.substring(0, inner_text.indexOf(inner_text.match(/[^\x00-\xff]/g)[0]));
                console.log("href：" + href);
                let password = inner_text.replace(href, "").replace(/[^\x00-\xff]/g, "").replace(":", "");
                console.log("password：" + password);

                let download_link = href+"?pwd="+password
                console.log("download_link: " + download_link)
                let auto_download_link = href+"?pwd="+password+"&auto=y"
                console.log("auto_download_link: " + auto_download_link)

                let download_tip = document.createElement('span');
                let auto_download_tip = document.createElement('span');
                download_tip.style.paddingLeft = "10px";
                auto_download_tip.style.paddingLeft = "10px";
                download_tip.innerHTML = `<a id="hrefBtn" href="${download_link}" target="_blank" padding="5px">填充密码</a>`;
                auto_download_tip.innerHTML = `<a id="hrefBtn" href="${auto_download_link}" target="_blank" padding="5px">自动下载</a>`;
                doc_div.appendChild(download_tip);
                doc_div.appendChild(auto_download_tip);
            }
            clearInterval(url_flag)
        }
    })

    let url = document.location.href;
    let urlR = "lanzou"
    if (url.indexOf(urlR) != -1) {
        let pwd = document.getElementById("pwd");
        let searchParams = new URLSearchParams(document.location.search);
        if (pwd) {
            let passwddiv_btn = document.getElementsByClassName("passwddiv-btn")[0];
            let btnpwd = document.getElementsByClassName("btnpwd")[0];
            pwd.value = searchParams.get('pwd');
            if (passwddiv_btn) {
                passwddiv_btn.click();
            } else if (btnpwd) {
                btnpwd.click();
            }
        }

        if(searchParams.get('auto')){
            let down_flag = setInterval(auto_download, 500);
            function auto_download() {
                let download_btn = document.getElementById("downajax")
                if(download_btn.childNodes[0]){
                    clearInterval(down_flag)
                    download_btn.childNodes[0].click()
                }
            }
        }
    }
})();