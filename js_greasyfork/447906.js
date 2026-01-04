// ==UserScript==
// @name         您立马离开CSDN，去往某某某某
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在点击CSDN中的跳转链接时，不需再次点击继续就能立马离开CSDN，去往某某某某目的地！
// @author       Huang Sir
// @match        http*://link.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      everyone
// @downloadURL https://update.greasyfork.org/scripts/447906/%E6%82%A8%E7%AB%8B%E9%A9%AC%E7%A6%BB%E5%BC%80CSDN%EF%BC%8C%E5%8E%BB%E5%BE%80%E6%9F%90%E6%9F%90%E6%9F%90%E6%9F%90.user.js
// @updateURL https://update.greasyfork.org/scripts/447906/%E6%82%A8%E7%AB%8B%E9%A9%AC%E7%A6%BB%E5%BC%80CSDN%EF%BC%8C%E5%8E%BB%E5%BE%80%E6%9F%90%E6%9F%90%E6%9F%90%E6%9F%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    /*
var target = document.getElementById('linkPage').getElementsByTagName('a');
console.log('target[1] ='+target[1]+'\n'+(target[1] != null));
if(target[1] != null){
    window.location.href=target[1];
    console.log('target[1]跳转成功！\n');
    var target_go = target[1].attributes.href.value;
    console.log(target_go+'\n'+(target_go != null));
    if(target_go != null){
        window.location.href=target_go;
        console.log('跳转成功！\n');
    }
}
*/
    var url = window.location.href;
    // console.log(url)
var target = url.substring(30);
// window.location.href=target;
console.log('target = '+ target)
// location.href=target;
target = target.replace(/%2F/g,"/").replace("%3A",":")
window.location.href=target;

//console.log(target[1]+'\n跳转失败！\n');
})();