// ==UserScript==
// @name         商城信息写入
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  信息自动填写!编辑脚本的config字段:第一个是名字,第二个是电话,第三个是地址,第四个是备注,
// @author       乌贼•tentacles
// @homepage     https://www.acfun.cn/u/205408
// @match        https://www.acfun.cn/member/mall/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455455/%E5%95%86%E5%9F%8E%E4%BF%A1%E6%81%AF%E5%86%99%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/455455/%E5%95%86%E5%9F%8E%E4%BF%A1%E6%81%AF%E5%86%99%E5%85%A5.meta.js
// ==/UserScript==

let config= ["名字","337845818","收件地址应为5-255个字符","我的备注"];
let yanshi = 3000;//延时写入信息一般为2000-3000.要看本地的加载时间


window.onload = fill;
//setTimeout(fill,yanshi);
function fill(){
    let acinput = document.getElementsByClassName('ac-input');
    acinput[1].value = config[0];
    acinput[2].value =config[1];
    acinput[3].value =config[2];
    acinput[4].value =config[3];

    var event = document.createEvent('HTMLEvents');
    event.initEvent("input",true,true);
    event.eventType= 'message';
    acinput[1].dispatchEvent(event);
    acinput[2].dispatchEvent(event);
    acinput[3].dispatchEvent(event);
    acinput[4].dispatchEvent(event);
}