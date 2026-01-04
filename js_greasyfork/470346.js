// ==UserScript==
// @name         机器人web界面自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  此脚本用于机器人web界面账号密码自动填充
// @author       halfbottle
// @match        http://734105g62e.imdo.co:43476/
// @match        http://q549594f16.goho.co:32811/
// @match        http://734p10y614.goho.co/
// @match        http://j7p3410552.zicp.fun:15778
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470346/%E6%9C%BA%E5%99%A8%E4%BA%BAweb%E7%95%8C%E9%9D%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/470346/%E6%9C%BA%E5%99%A8%E4%BA%BAweb%E7%95%8C%E9%9D%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

let time=setInterval(()=>{
    if(document.querySelector('[name="loginUsername-inputEl"]')!==null){
            clearInterval(time)
    }
    if(document.querySelector('[name="loginUsername-inputEl"]')==null){
        return
    }
    document.querySelector('[name="loginUsername-inputEl"]').value='admin'
    document.querySelector('[name="loginPassword-inputEl"]').value='admin123'
    document.querySelector('[id="loginButton-btnIconEl"]').click()
    clearInterval(time)
},1000
)