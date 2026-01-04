// ==UserScript==
// @name         阿里云盘签到
// @namespace    https://yiso.fun
// @version      1.0.2
// @author       yiso
// @match        https://www.aliyundrive.com/*
// @icon         https://img.alicdn.com/imgextra/i1/O1CN01JDQCi21Dc8EfbRwvF_!!6000000000236-73-tps-64-64.ico
// @description  阿里云盘签到 开启插件 只要每天打开过有关阿里云盘的相关连接 即可默认完成签到
// @run-at       document-body
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      aliyundrive.com
// @downloadURL https://update.greasyfork.org/scripts/459244/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/459244/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';
    unsafeWindow = unsafeWindow || window;
    var $ = $ || window.$;
    //当前浏览器的地址
    let url = window.location.href
    var visitorId;
    if (url.includes('https://www.aliyundrive.com/drive', 0)) {
        setTimeout(function() {
            aliHomeButtonHeader();
            sign();

        }, 1000)
    } else if(url.includes('https://www.aliyundrive.com/s', 0)){
         setTimeout(function() {
            aliHomeButtonHeader();
            sign();

        }, 1000)
    }

    /**
     *alihome页导航栏按钮
     */
    function aliHomeButtonHeader() {
        let header = document.querySelector('.nav-menu--Lm1q6');
        if (header == null) {
            setTimeout(function() {
                aliHomeButtonHeader();
            },
                       1000)
        }
        setAliYunSign(header);
    }



    /**
     * 阿里云签到初始化
     */
    function setAliYunSign(header) {
        // Initialize the agent at application startup.


        let div = document.createElement('div');
        div.innerHTML ='<li class="nav-menu-item--Jz5IC"> '
            +'<span class="nav-menu-item-icon--8GI-g">'
            +'<span data-role="icon" data-render-as="svg" data-icon-type="PDSFavorite" class="icon--d-ejA ">'
            +'<svg t="1675234646771" class="icon--D3kMk" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1469" width="32" height="32"><path d="M704 170.666667H320v53.333333a21.333333 21.333333 0 0 1-42.666667 0V170.666667h-42.666666a106.666667 106.666667 0 0 0-106.666667 106.666666v85.333334h768v-85.333334a106.666667 106.666667 0 0 0-106.666667-106.666666h-42.666666v53.333333a21.333333 21.333333 0 0 1-42.666667 0V170.666667z m42.666667-42.666667h42.666666a149.333333 149.333333 0 0 1 149.333334 149.333333v512a149.333333 149.333333 0 0 1-149.333334 149.333334H234.666667a149.333333 149.333333 0 0 1-149.333334-149.333334V277.333333a149.333333 149.333333 0 0 1 149.333334-149.333333h42.666666V96a21.333333 21.333333 0 0 1 42.666667 0V128h384V96a21.333333 21.333333 0 0 1 42.666667 0V128z m149.333333 277.333333H128v384a106.666667 106.666667 0 0 0 106.666667 106.666667h554.666666a106.666667 106.666667 0 0 0 106.666667-106.666667V405.333333zM327.210667 642.304a21.333333 21.333333 0 0 1 28.245333-32l98.048 86.549333a21.333333 21.333333 0 0 0 29.866667-1.642666l179.882666-197.568a21.333333 21.333333 0 0 1 31.552 28.714666l-179.861333 197.568a64 64 0 0 1-89.664 4.906667l-98.069333-86.528z" fill="#d81e06" p-id="1470"></path></svg>'
            +'</span>'
            +'</span>'
            +'<div class="name-wrapper--uJRgS">'
            +'<span class="sign" style="color:red">点击签到</span>'
            +'</div>'
            +'</li>';
        header.insertBefore(div, header.children[0]);
        let sign = document.querySelector('.sign');
        sign.addEventListener('click',() =>{
            let tokenInfo= localStorage.getItem('token');
            let tokenInfoJson=JSON.parse(tokenInfo);
            let user_id=tokenInfoJson.user_id;
            let dto = '{"":"" }';
            GM_xmlhttpRequest({
                method: "post",
                url: 'https://member.aliyundrive.com/v1/activity/sign_in_list',
                headers: {
                    "Content-Type": "application/json",
                    "authorization":tokenInfoJson.access_token
                },
                data:dto,
                onload: function(r) {
                    let resultJson = JSON.parse(r.response);
                    console.log(resultJson)
                    if (resultJson.success == true) {
                        //领取礼物
                        let signInCount= resultJson.result.signInCount
                        console.log(signInCount)
                        signInReward(signInCount,tokenInfoJson.access_token)
                        alert('签到成功');

                    } else {
                        alert('系统异常，签到失败，请稍微再试');
                    }
                }
            });

        });
    }
    /**
     * 签到
     */
    function sign(){
         let tokenInfo= localStorage.getItem('token');
            let tokenInfoJson=JSON.parse(tokenInfo);
            let user_id=tokenInfoJson.user_id;
            let dto = '{"":"" }';
            GM_xmlhttpRequest({
                method: "post",
                url: 'https://member.aliyundrive.com/v1/activity/sign_in_list',
                headers: {
                    "Content-Type": "application/json",
                    "authorization":tokenInfoJson.access_token
                },
                data:dto,
                onload: function(r) {
                    let resultJson = JSON.parse(r.response);
                    console.log(resultJson)
                    if (resultJson.success == true) {
                        //领取礼物
                        let signInCount= resultJson.result.signInCount
                         console.log(resultJson)
                        signInReward(signInCount,tokenInfoJson.access_token)

                    } else {
                        alert('系统异常，签到失败，请稍微再试');
                    }
                }
            });
    }
    /**
     * 领取礼物
     */
    function signInReward(signInDay,token ){
        let dto = '{"signInDay":'+signInDay+"}";
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://member.aliyundrive.com/v1/activity/sign_in_reward',
            headers: {
                "Content-Type": "application/json",
                "authorization":token
            },
            data:dto,
            onload: function(r) {
                let resultJson = JSON.parse(r.response);
                console.log(resultJson)
                if (resultJson.success == true) {
                    //
                     console.log('自动领取礼物成功');
                } else {
                    alert('系统异常，领取礼物失败，请稍微再试');
                }
            }
        });

    }


    // Your code here...
})();