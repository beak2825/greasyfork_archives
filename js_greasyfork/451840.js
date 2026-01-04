// ==UserScript==
// @name         Quasar文档快速跳转
// @namespace    https://github.com/wanqqq29
// @version      0.1
// @description  用于quasarchs.com和quasar.dev之间的相互跳转
// @author       万能青年
// @match        http://www.quasarchs.com/*
// @match        https://quasar.dev/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADB0lEQVQ4jZ2TX0iddRjHP7/f+55z3Mm/5zjPcLTEBCFi5s6StjLN2tYSjwnBqXbTDhmEF8HqYolRsLZBEKXUxSI2JzEwqAsRt8nQTsdkZHHmYhvEtrxI353ZpuGfle/7/p4uTrVJd32vnz88z/fzVfwjEYVSwhmJUE6SZVpYpgqAQmYoZIzfGORZdfvfWkBxryYlxS1zRF1Mx/TUaXCug/FRlTX4Dc8hW5tyRHU3O9Vx1m0GmJDDDDii61slAK5Vt8dVR9O+7sv6xNvdELh2vE0YcERPyOF1vUxKipOzYkervJAV9mwQ3dlnmBbDx1kTfqzDgBbAC5ZXe/TPCpOSyp9wRiLK47K80Rg71b3fn/t9xXorc1Ps1w/hHXtHxa+N8s25Yfn67DjRjRXq5s+X/FTvl5b6KJ0Tm4d0YDNJyQzFEg8WeS+lUla0wBbKNilrpF/x1fuoDffR+/kXqiJSqlp3Ncv+ri6ro6bIk4mhWGAzSVsWaSF7jsJwAYDocBGcOsCfGCq31HL12i/0HDwAVhm1dQ/T+8EhiZSWwA+jmNZECwzLVOiJFwXw3zz4nsnN3xIrWCoVlTUy59wQJzcv91c+ILqhQ+h3hPo2o8C3diaFYZnS+WcKAJeyPxI0azQ//RSray5aW4jxcVUAkx3DLghi18YJAKi8ATYlzPjF5dutxn3mbFOntaUlKdbMT2p5ZYFtjzyKb4eYv71A2YYgC+dHhFffxbo+bSjZqClhxqaYMbNt9wv69GdIc5NaqksLU6MEf73M3HdDcGWcT46dIOSu0JldQkVQau0P/PpnoJgxjcOg7Ejk1OqSrfs/9dWFcWWvLsrak/uEOyv0vN1D12uvyJxzQ8BT+sRxnztLtuxI5HAYzIOU+Ruk8movBB5oeXz382Y6mzUiYo5+2GcAKbDCXiBa5XFyVsjkQfoPyqHtbQK4Lyfa3SsXsv7336b99l17XMANxVuFAUe4B+X1YcpIikVzRF9Mx8z5EXCuoi0Ls6ka3bAXs7UpR6nupvFumO4O+J9x/gvEJXg7sYUq6wAAAABJRU5ErkJggg==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451840/Quasar%E6%96%87%E6%A1%A3%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/451840/Quasar%E6%96%87%E6%A1%A3%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
    button.id = "id001";
    button.style.width = "120px";
    button.style.height = "50px";
    button.style.bakcground = "#0052d9";
    button.style.align = "center";

    var chsUrl = 'http://www.quasarchs.com'
    var devUrl = 'https://quasar.dev'
    let baseUrl = window.location.href;
    let toUrl = ''
    let params
    if (baseUrl.search(chsUrl)!= -1){
        button.textContent = "跳转到dev";
        toUrl = devUrl
    }else if(baseUrl.search(devUrl)!= -1){
        button.textContent = "跳转到chs";
        toUrl = chsUrl
    }
    //绑定按键点击功能
    button.onclick = function (){
        if (toUrl == devUrl){
            params ='/' + window.location.href.split('com/')[1]
        }else if(toUrl == chsUrl){
            params = '/' + window.location.href.split('dev/')[1]
        }
        window.open(toUrl + params,"_blank")
        return;
    };
    window.onload=function(){
        setTimeout(()=>{
            var x = document.getElementsByClassName('q-toolbar row no-wrap items-center q-px-none')[0]
            x.appendChild(button);
        },500)
    }
})();