// ==UserScript==
// @name         8boscore
// @namespace    com.oldtan.8boscore
// @version      1.1.5
// @description  8bo比分
// @author       oldtan
// @include       https://8bo.com/football/
// @include       https://8bo.com/football/end/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/510924/8boscore.user.js
// @updateURL https://update.greasyfork.org/scripts/510924/8boscore.meta.js
// ==/UserScript==
// function sleep(time){
//     var timeStamp = new Date().getTime();
//     var endTime = timeStamp + time;
//     while(true){
//         if (new Date().getTime() > endTime){
//             return;
//         }
//     }
// }

$(document).ready(function() {
    // 使用事件委托来为当前和未来的所有 .c0c.c0data 元素添加 mouseenter 事件
    $(document).on('mouseenter', '.c0c.c0data', function() {
        // 查找所有具有类名 'c0c c0data' 的元素下的超链接
        $(this).find('a').each(function() {
            // 获取超链接的 href 属性
            var href = $(this).attr('href');
            // 查找 href 中包含 'info-' 开头的路径
            var parts = href.split('/'); // 将 href 按 '/' 分割成数组
            for (var i = 0; i < parts.length; i++) {
                if (parts[i].startsWith('info-')) {
                    // 替换包含 'info-' 开头的路径为 'info-betfair'
                    parts[i] = 'info-betfair';
                    break; // 找到第一个匹配项后退出循环
                }
            }
            // 重新组合 href 并设置新的 href 属性
            var newHref = parts.join('/');
            $(this).attr('href', newHref);
        });
    });
});



function Toast(msg,duration){
      duration=isNaN(duration)?3000:duration;
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 60px;color: rgb(255, 255, 255);line-height: 60px;text-align: center;border-radius: 4px;position: fixed;top: 40%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
    }


function Toast2(msg,duration){
      duration=isNaN(duration)?3000:duration;
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 60px;color: rgb(255, 255, 255);line-height: 60px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
    }



