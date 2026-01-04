// ==UserScript==
// @name         SEU lwReportEpidemicSeu dailyReport Automator
// @name:zh      东南大学健康打卡自动化
// @name:zh-CN   东南大学健康打卡自动化
// @namespace    http://seu.saltfish.moe/
// @version      0.20.1
// @license      Anti 996 License
// @description  Automatically completes the health daily report during the Wuhan pneumonia pandemic.
// @description:zh 自动完成东南大学线上服务健康打卡过程。
// @description:zh-CN 自动完成东南大学线上服务健康打卡过程。
// @author       SaltfishAmi
// @include      *://newids.seu.edu.cn/authserver/login?service=http://ehall.seu.edu.cn/qljfwapp2/sys/lwReportEpidemicSeu/index.do*
// @include      *://ehall.seu.edu.cn/qljfwapp2/sys/lwReportEpidemicSeu/index.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398138/SEU%20lwReportEpidemicSeu%20dailyReport%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/398138/SEU%20lwReportEpidemicSeu%20dailyReport%20Automator.meta.js
// ==/UserScript==

//======================CONFIG======================
// Credentials for auto-login
    var username = "username";
    var password = "password";
// Timeout settings in ms
    var timeoutBeforeLogin = 1500;
    var timeoutBeforeClickingAdd = 8000;
    var timeoutBeforeClickingSave = 3000;
    var timeoutBeforeClickingConfirm = 3000;
//Temperature setting
    var temperature = String((361 + Math.floor(Math.random() * 10))/10.0);
//==================================================

    function $(id){
        return document.getElementById(id);
    }
    function $$(classname){
        return document.getElementsByClassName(classname);
    }

    var clickevt = document.createEvent("MouseEvents");
    clickevt.initEvent("click", true, true);

(function() {
    'use strict';

/**
 * Console History v1.5.1
 * console-history.js
 *
 * Licensed under the MIT License.
 *
 * Written by lesander <github.com/lesander>
 * For Doorbell.io <3
 * https://git.io/console
 * https://doorbell.io
 */
/* Allow only one instance of console-history.js */
if (typeof window.console.history !== 'undefined') {
  throw new Error('Only one instance of console-history.js can run at a time.')
}

/* Store the original log functions. */
window.console._log = window.console.log
window.console._info = window.console.info
window.console._warn = window.console.warn
window.console._error = window.console.error
window.console._debug = window.console.debug

/* Declare our console history variable. */
window.console.history = []

/* Redirect all calls to the collector. */
window.console.log = function () { return window.console._intercept('log', arguments) }
window.console.info = function () { return window.console._intercept('info', arguments) }
window.console.warn = function () { return window.console._intercept('warn', arguments) }
window.console.error = function () { return window.console._intercept('error', arguments) }
window.console.debug = function () { return window.console._intercept('debug', arguments) }

/* Give the developer the ability to intercept the message before letting
   console-history access it. */
window.console._intercept = function (type, args) {
  window.console._collect(type, args)
}

/* Define the main log catcher. */
window.console._collect = function (type, args) {
  var time = new Date().toUTCString()
  if (!type) type = 'log'
  if (!args || args.length === 0) return
  window.console['_' + type].apply(window.console, args)
  var stack = false
  try { throw Error('') } catch (error) {
    var stackParts = error.stack.split('\n')
    stack = []
    for (var i = 0; i < stackParts.length; i++) {
      if (stackParts[i].indexOf('console-history.js') > -1 ||
      stackParts[i].indexOf('console-history.min.js') > -1 ||
      stackParts[i] === 'Error') {
        continue
      }
      stack.push(stackParts[i].trim())
    }
  }
  window.console.history.push({ type: type, timestamp: time, arguments: args, stack: stack })
}
/* End of console-history.js (c) 2016-2019 lesander*/

    if(username=="username"){
        // username check
        alert("Please edit the script and set your username & password! \n请编辑脚本，指定你的用户名和密码！");
        alert("The script will now terminate. \n脚本执行中断。");
        return false;
    }

    if(window.location.hostname != "ehall.seu.edu.cn"){
        // login
        // This will not work for login pages with role checking, as they have initial onClick functions of "return false".
        // use the url https://newids.seu.edu.cn/authserver/login?service=http://ehall.seu.edu.cn/qljfwapp2/sys/lwReportEpidemicSeu/index.do
        $("username").value = username;
        $("password").value = password;

        setTimeout(function(){
            $$("auth_login_btn")[0].dispatchEvent(clickevt);
        }, timeoutBeforeLogin);

    } else {
        //dailyreport
        setTimeout(function(){
            $$("bh-mb-16")[1].childNodes[1].dispatchEvent(clickevt);
            //save
            setTimeout(function(){
                $$("bh-mb-36")[3].childNodes[0].childNodes[0].childNodes[1].childNodes[1].value = temperature;
                $("save").dispatchEvent(clickevt);
                //confirm
                //setTimeout(function(){
                //    $$("bh-dialog-btn")[0].dispatchEvent(clickevt);
                //}, timeoutBeforeClickingConfirm);

            //if empty fields block the way, fuck them up by filling them with 0
            let coll = document.getElementsByClassName('jqx-dropdownlist-state-normal');
            window.console.history.forEach(function(item, index){
                //window.console._log(index);
                //window.console._log(item.arguments[0]);
                if(item.arguments[0].toString().substring(0,5) == "校验未通过"){
                    var name = item.arguments[0].split(' ')[2];
                    for(var i=0; i< coll.length; i++){
                        if(coll[i].getAttribute('data-name') == name){
                            coll[i].lastElementChild.value = 0;
                            //window.console._log(coll[i]);
                            break;
                        }
                    }
                }
            });

            //save again
            //setTimeout(function(){
                //$$("bh-mb-36")[3].childNodes[0].childNodes[0].childNodes[1].childNodes[1].value = temperature;
                if(!$$("bh-dialog-btn")[0])$("save").dispatchEvent(clickevt);
                //confirm
                setTimeout(function(){
                    $$("bh-dialog-btn")[0].dispatchEvent(clickevt);
                }, timeoutBeforeClickingConfirm);
            }, timeoutBeforeClickingSave);
        }, timeoutBeforeClickingAdd);
    }
})();
