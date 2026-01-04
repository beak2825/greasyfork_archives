// ==UserScript==
// @name         库
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自用
// @author       Mr Liu
// @match        *
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.6.0/jquery.min.js
// ==/UserScript==
 
function Input(ele,val){//键盘输入函数  可调用
    ele.value = val;
    let event = new Event('input', { bubbles: true });
    let tracker = ele._valueTracker;
    if (tracker) {
        tracker.setValue('');
    }
    ele.dispatchEvent(event);
}
function ysjt(ele,fun){//元素监听
    const targetNode = ele;//content监听的元素id
    //options：监听的属性
    const config = {
         childLIst :true,
         attributes :true,
         characterData:true,
         subtree:true,
         characterDataOldValue:true
        };
    //回调事件
    const mutationObserver = new MutationObserver(()=>{
        fun(mutationObserver)//要执行的
    });
    mutationObserver.observe(ele, config);
}
function mdjt(fun){//锚点监听  检测url变化
    window.onpopstate = function (event) {
        fun();
    }
}
function Pd(input) {//判断是否为数字
    const a = /^[0-9]+.?[0-9]*/
    return a.test(input)
}