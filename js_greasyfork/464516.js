// ==UserScript==
// @name         WaitFor
// @namespace    http://bbs.91wc.net/?wait-for
// @version      0.1
// @description  一直等待并执行回调函数
// @author       Wilson
// ==/UserScript==

function WaitFor(cond, callback, delay) {
    delay = delay || 100;
    var timer = setTimeout(function(){
	if(timer) clearTimeout(timer);
        if(cond && cond()) callback();
	WaitFor(cond, callback, delay);
    }, delay);
}

//使用：
//WaitFor(()=>{return true}, ()=>{console.log(1)});
//cond 条件回调函数，当cond()为真则执行callback
//callback 回调函数
//delay 多久检查一次条件，单位ms，默认100
