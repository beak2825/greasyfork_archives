// ==UserScript==
// @name         WaitUntil
// @namespace    http://bbs.91wc.net/?wait-until
// @version      0.1.3.2
// @description  等待满足某种条件后执行，支持嵌套调用
// @author       Wilson
// ==/UserScript==

var WaitUntil = function(cond, callback, interval, trys, times) {
    var timer = null;
    var tryCount = 0;
    var runCount = 0;
    interval = interval || 100;
    trys = trys || 300;
    times = times || 1;
    var wait = function(cond, callback, interval, trys, times) {
        if(timer) clearTimeout(timer);
        timer = setTimeout(function(){
            tryCount++;
            if(tryCount > trys) {
                return;
            }
            if(cond()){
                runCount++;
                if(callback) callback('OK');
                if(times < 0 || runCount < times) {
                    wait(cond, callback, interval, trys, times);
                }
            } else {
                wait(cond, callback, interval, trys, times);
            }
        }, interval);
    }
    wait(cond, callback, interval, trys, times);
}

//使用示例
//WaitUntil(function(){return typeof jQuery !=="undefined" && $(".test").length>0}, function(){
//    alert($(".test").html());
//});

//其他参数
//cond 满足条件的函数
//callback 条件满足后执行的回调函数
//interval 监听满足条件的时间间隔，单位毫秒，默认100
//trys 尝试次数，超过这个数值就停止监听，默认为300（因默认间隔是100毫秒，所以默认停止监控时间为300*100毫秒，即30秒）
//times 执行次数，默认执行1次，-1为无限次，0会忽略，等同于1次
