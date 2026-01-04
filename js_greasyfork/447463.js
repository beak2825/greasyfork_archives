// ==UserScript==
// @author       MetaQiu
// @name         河北大学自动登录
// @namespace    http://metaqiu.art/
// @version      2.1
// @description  盒带教务系统自动登录 请自行替换脚本中的账号密码！你可以在脚本下拉页面选择登陆模式
// @match        *://v.hbu.cn/*
// @license MIT
// @icon         https://metaqiu.art/upload/2022/07/64x64-3d12f2a3d90d49d3ad878d85186cb6a1.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @note         2022/07/09 优化代码，增加了一种登录逻辑，在脚本的下拉菜单中选择
// @note         2022/07/19 无用的更新

// @downloadURL https://update.greasyfork.org/scripts/447463/%E6%B2%B3%E5%8C%97%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/447463/%E6%B2%B3%E5%8C%97%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==


;(function () {
    'use strict'
    $(document).ready(function () {

    var user = '这里替换你的学号'
    var password= '这里替换你的密码'
    var url = window.location.href
    var webvpn = /v.hbu.cn\/login/
    var urp1 = /77726476706e69737468656265737421eaff4b8b69386a45300b87\/login/
    var urp2 = /77726476706e69737468656265737421a2a713d275603e1e2f46d8f4c9\/login/
    // 如果你能提供更多的 `河北大学教务管理系统` 登陆网址，欢迎在issue中提交给我 我将在下次更新中完善相关功能
    var xhr = new XMLHttpRequest();

    // 菜单
    const menu = [
      {
        key: 'mode1',
        name: '登陆模式1(模拟点击)',
        value:false,
        tip: {
          open: '✅',
          close: '❌'
        },
        click: null
      },
      {
        key: 'mode2',
        name: '登陆模式2(Http请求)',
        value: false,
        tip: {
          open: '✅',
          close: '❌'
        },
        click: refresh
      }
    ]

    // 保存已注册的菜单
    const munuRegister = []

    // 配置默认菜单
    menu.forEach(v => {
      if (GM_getValue(v.key) === undefined || GM_getValue(v.key) === null) GM_setValue(v.key, v.value)
    })

    // 注册菜单
    function registerMenuCommand() {
      if (munuRegister.length === menu.length) {
        munuRegister.forEach(v => {
          GM_unregisterMenuCommand(v)
        })
      }
      menu.forEach((v, i) => {
        v.value = GM_getValue(v.key)
        munuRegister[i] = GM_registerMenuCommand(`${v.value ? v.tip.open : v.tip.close} ${v.name}`, () => {
          menuSwitch(v)
        })
      })
    }

    // 切换菜单
    function menuSwitch(item) {
      // 设置数据
      item.value = !item.value
      GM_setValue(item.key, item.value)
      // 系统通知
      GM_notification({
        text: `已${item.value ? item.tip.open : item.tip.close}[${item.name}] 功能`,
        title: '盒带登录助手',
        timeout: 3000
      })
      // 如果有点击事件，执行
      if (item.click) item.click()
      // 重新注册
      registerMenuCommand()
    }

    //点击按钮刷新页面
    function refresh() {
        location.reload();
    }
    //操作模块
    if( GM_getValue('mode1') ) {
        if(webvpn.test(url)) {
            (function() {
             $("#user_name").val(user);
             $(":password").val(password);
             $("#login").click();

            })();

           }else if(urp1.test(url) || urp2.test(url)) {

            (function() {
             $("#username").val(user);
             $("#password").val(password);
             $("#cas").submit();

           })();

           return
           }

    }else if (( GM_getValue('mode2') )) {
        if (webvpn.test(url)) {
            (function() {
               xhr.open('POST','https://v.hbu.cn/do-login');
               xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
               xhr.send(`auth_type=local&username=${user}&sms_code=&password=${password}&captcha=&needCaptcha=false`);
               open('https://v.hbu.cn/')

            })();

          }else if(urp1.test(url) || urp2.test(url)) {

            (function() {
              xhr.open('POST','https://v.hbu.cn/http/77726476706e69737468656265737421eaff4b8b69386a45300b87/sigin');
              xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
              xhr.send(`username=${user}&password=${password}`);
              open('https://v.hbu.cn/http/77726476706e69737468656265737421eaff4b8b69386a45300b87/index');

            })();

            return
          }
    }


    // 注册菜单
    registerMenuCommand()

    });

  })()
