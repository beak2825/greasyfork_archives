// ==UserScript==
// @name           google_hack镜像助手
// @author         wusuluren
// @description    在google_hack上使用谷歌镜像
// @require        http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match          http://www.hi-ourlife.com/google_hack.html
// @supportURL     https://github.com/Wusuluren
// @version        0.0.1
// @grant          None
// @namespace https://greasyfork.org/users/194747
// @downloadURL https://update.greasyfork.org/scripts/370198/google_hack%E9%95%9C%E5%83%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/370198/google_hack%E9%95%9C%E5%83%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
 
    $(function(){
        $("input[type='submit']").click(function() {
          getURL()
          var timerId = setInterval(function() {
            var content = document.getElementById("content").innerHTML
            if(content !== undefined) {
                document.getElementById("content").innerHTML = content.replace(/www.google.com/g, 'google.uulucky.com');
                clearInterval(timerId)
             }   
          }, 100)
        })
    }) 
})();
