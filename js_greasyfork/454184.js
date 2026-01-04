// ==UserScript==
// @name         LOL战绩查询
// @namespace    mscststs
// @version      0.12
// @description  一个在网页端查询 LOL 战绩的方法
// @author       mscststs
// @match        https://www.wegame.com.cn/ioi
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wegame.com.cn
// @license      ISC
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/454184/LOL%E6%88%98%E7%BB%A9%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/454184/LOL%E6%88%98%E7%BB%A9%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addElement(tag = "script", options = {}, parent = document.body){
        let ele = document.createElement(tag);
        Object.entries(options).forEach(([key,val])=>{
            ele[key] = val;
        });
        parent.appendChild(ele);
        return new Promise((resolve,reject)=>{
            ele.onload = (...args)=>{resolve(...args); options.onload && options.onload(...args)};
            ele.onerror = (...args)=>{reject(...args); options.onerror && options.onerror(...args)};;
        });
    }


    async function init(){
        await addElement("style",{
            innerText:`
            body{
               background:#1a2026 !important;
            }
            body:after{
               content:none;
            }
            body:before{
               content:none;
            }
            .frame-nodata-wrap:before, .frame-nodata-wrap:after{
               content:none;
            }
            `
        })

        document.title = "LOL 战绩查询"
        document.querySelector("#content").innerText = "加载中";

        await addElement("script", {src:"https://wegame.gtimg.com/g.55555-r.c4663/lib/vue/2.6.10/vue.min.js"});
        await addElement("script", {src:"https://www.wegame.com.cn/middle/login/login.sdk.js"});
        console.log("loginSDK 加载完毕")
        const WegameLogin = unsafeWindow.WegameLogin;
        await WegameLogin.default.readyPromise;

        while(!WegameLogin.default.isLogin()){
            // 确保能够唤起登录
            await new Promise((resolve, reject)=>{
                document.querySelector("#content").innerText = "拉起登录中...";
                WegameLogin.default.popup();
                WegameLogin.default.onLogin(resolve);
                let v = setInterval(()=>{
                    if(document.querySelector(".widget-login-mask[style*=none]")){
                        resolve();
                        clearInterval(v);
                    }
                },1000)
            })
        }

        document.querySelector("#content").innerText = "正在初始化";
        await addElement("style",{
            innerText:`
            .frame-nodata-wrap{
               transition:opacity 0.5s;
               opacity:0;
            }
            `
        });
        await addElement("script", {src:"https://lol-tft.pages.dev/lol/lol.umd.js"});
        new unsafeWindow.Vue({
            render: h => h("lol")
        }).$mount('#app');
    }

    const MainPage = `https://www.wegame.com.cn/ioi`;

    if(location.href.startsWith(MainPage)){
        init();
    }


    GM_registerMenuCommand("打开查询页面",()=>{
        GM_openInTab(MainPage, {
            active:true,
        })
    });


})();