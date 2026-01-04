// ==UserScript==
// @name         运营工作台会话助手2
// @namespace    https://us.icityup.com/
// @license    MIT
// @version      20230808
// @description  运营工作台会话助手2-获取TOKEN
// @author       lohasle
// @match               ms-test.icityup.com
// @match               https://us.icityup.com/**
// @match               https://us-test.icityup.com/**
// @match               https://us-uat.icityup.com/**
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          opera
// @compatible          brave
// @compatible          vivaldi
// @compatible          waterfox
// @compatible          librewolf
// @compatible          ghost
// @compatible          qq
// @resource css      https://cdnjs.cloudflare.com/ajax/libs/layui/2.8.12/css/layui.css
// @require     https://cdnjs.cloudflare.com/ajax/libs/layui/2.8.12/layui.js
// @icon                https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/media/icons/openai-favicon48.png
// @icon64              https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/media/icons/openai-favicon64.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant      GM_addStyle
// @grant      GM_getResourceText


// @downloadURL https://update.greasyfork.org/scripts/473352/%E8%BF%90%E8%90%A5%E5%B7%A5%E4%BD%9C%E5%8F%B0%E4%BC%9A%E8%AF%9D%E5%8A%A9%E6%89%8B2.user.js
// @updateURL https://update.greasyfork.org/scripts/473352/%E8%BF%90%E8%90%A5%E5%B7%A5%E4%BD%9C%E5%8F%B0%E4%BC%9A%E8%AF%9D%E5%8A%A9%E6%89%8B2.meta.js
// ==/UserScript==

(function () {

    GM_addStyle(GM_getResourceText("css"))


    const initTimer = setTimeout(initByLazy, 3000)


    function openTokenWin(token, xtoken) {
        layer.open({
            title: '当前US用户token，请复制',
            type: 1,
            area: ['600px', '400px'], // 宽高
            content: '<form class="layui-form" action="">' +
                '<div class="layui-form-item">' +
                '<label class="layui-form-label">saas-auth</label>' +
                '<div class="layui-input-block">' +
                '<input type="text" name="saas-auth" id="token" lay-verify="required" autocomplete="off" class="layui-input" value="bearer ' + token + '">' +
                '</div>' +
                '</div>' +
                '<div class="layui-form-item">' +
                '<label class="layui-form-label">access_token</label>' +
                '<div class="layui-input-block">' +
                '<input type="text" name="token" id="token" lay-verify="required" autocomplete="off" class="layui-input" value="' + token + '">' +
                '</div>' +
                '</div>' +
                '<div class="layui-form-item">' +
                '<label class="layui-form-label">x-token</label>' +
                '<div class="layui-input-block">' +
                '<input type="text" name="x-token" id="x-token" lay-verify="required" autocomplete="off" class="layui-input" value="' + xtoken + '">' +
                '</div>' +
                '</div>' +
                '</form>'
        });
    }


    function initByLazy() {
        clearTimeout(initTimer);
        // 增加设置按钮
        if(!localStorage.getItem("saber-userInfo")){
            return
        }
        const button = document.createElement('button');
        button.innerHTML = '会话';
        button.style.position = 'fixed';
        button.style.bottom = '65px';
        button.style.right = '30px';
        button.style.zIndex = '999999999';
        button.style.backgroundColor = '#ff8642';
        button.style.border = '0';
        button.style.borderRadius = '100%';
        button.style.height = '50px';
        button.style.width = '50px';
        button.style.color = '#fff';
        button.style.fontSize = '15px';
        button.style.cursor = 'pointer';
        button.id = "usOrderStBtn"
        document.body.appendChild(button);
        // 点击设置按钮时的处理函数
        button.addEventListener('click', function () {
            if(localStorage.getItem("saber-userInfo")){
                const token = JSON.parse(localStorage.getItem("saber-userInfo"))['content']['access_token']
                const xtoken = JSON.parse(localStorage.getItem("saber-userInfo"))['content']['x-token']
                openTokenWin(token,xtoken)
            }
        });

    }

})();