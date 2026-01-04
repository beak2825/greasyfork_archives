// ==UserScript==
// @name         wxxy学工一体化平台打卡
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  自动完成wxxy学工一体化平台打卡
// @author       皖西靓仔
// @match        https://xgpt.wxc.edu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @param time
// @param desc
// @downloadURL https://update.greasyfork.org/scripts/441134/wxxy%E5%AD%A6%E5%B7%A5%E4%B8%80%E4%BD%93%E5%8C%96%E5%B9%B3%E5%8F%B0%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/441134/wxxy%E5%AD%A6%E5%B7%A5%E4%B8%80%E4%BD%93%E5%8C%96%E5%B9%B3%E5%8F%B0%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

let time=setInterval(()=>{
    if(document.querySelector("#userName")==null){
        return
    }
    document.querySelector('#userName').value='学号'
    document.querySelector('.password').value='密码'
    document.querySelector('.login-line-btn').click()
    clearInterval(time)
},1000
);

let time1=setInterval(()=>{
    if(document.querySelector("#menuList > div:nth-child(8) > div:nth-child(1)")==null){
        return
    }
    document.querySelector('#menuList > div:nth-child(8) > div:nth-child(1)').click()
    clearInterval(time1)
},1000
);

let time2=setInterval(()=>{
    if (document.querySelector('#newsShow > div > div.quantity > button')==null) {
    document.querySelector('#newsShow > div:nth-child(1) > div.quantity > button').click()
} else {
    document.querySelector('#newsShow > div > div.quantity > button').click()
}
    clearInterval(time2)
},1000
);

let time3=setInterval(()=>{
    if(document.querySelector("#newsShow > div > div.operating3 > span")==null){
        return
    }
    document.querySelector('#newsShow > div > div.operating3 > span').click()
    clearInterval(time3)
},1000
);

let time4=setInterval(()=>{
    if(document.querySelector("#topic > div:nth-child(1) > div.title")==null){
        return
    }
    document.querySelector('#topic > div:nth-child(1) > div.mainBody > div:nth-child(2) > div:nth-child(2) > div > i').click()
    document.querySelector('#topic > div:nth-child(2) > div.mainBody > div:nth-child(2) > div:nth-child(1) > div').click()
    document.querySelector('#topic > div:nth-child(2) > div.mainBody > div:nth-child(2) > div:nth-child(5) > div').click()
    document.querySelector('#topic > div:nth-child(3) > div.mainBody > div:nth-child(2) > input').value='36.7'
    document.querySelector('#topic > div:nth-child(4) > div.mainBody > div:nth-child(2) > input').value='否'
    document.querySelector('#topic > div:nth-child(5) > div.mainBody > div:nth-child(2) > textarea').value='本人承诺以上所填报的全部内容均属实、准确，不存在任何隐瞒与不实的情况，更无遗漏之处。'
    clearInterval(time4)
},1000
);

let time5=setInterval(()=>{
    if(document.querySelector("#\\32 32b1ee846f14788a34f848c5fc8417c")==null){
        return
    }
    document.querySelector("#\\32 32b1ee846f14788a34f848c5fc8417c").click()
    clearInterval(time5)
},1000
);

let time6=setInterval(()=>{
    if(document.querySelector("body > div.weui-picker-container.weui-picker-container-visible > div > div.toolbar > div > a")==null){
        return
    }
    document.querySelector("body > div.weui-picker-container.weui-picker-container-visible > div > div.toolbar > div > a").click()
    clearInterval(time6)
},1000
);

let time7=setInterval(()=>{
    if(document.querySelector("#resetSubmit > button")==null){
        return
    }
    document.querySelector('#resetSubmit > button').click()
    clearInterval(time7)
},3000
);

let time8=setInterval(()=>{
    if(document.querySelector("#layui-layer7 > div.layui-layer-btn.layui-layer-btn- > a.layui-layer-btn0")==null){
        return
    }
    document.querySelector('#layui-layer7 > div.layui-layer-btn.layui-layer-btn- > a.layui-layer-btn0').click()
    clearInterval(time8)
},1000
);
})();