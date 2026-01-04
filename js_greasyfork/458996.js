// ==UserScript==
// @name         Bug收集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  掘金bug收集！
// @author       You
// @match        https://juejin.cn/user/center/bugfix?enter_from=bugFix_bar*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/458996/Bug%E6%94%B6%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/458996/Bug%E6%94%B6%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        setInterval(function(){
            console.log('启动中',new Date())
       
            console.log("do check bug!!",$('.bug-item-web').length)
            if($('.bug-item-web').length){
                $('.bug-item-web').click()
            }
            //setTimeout(function(){
            //    location.reload();
            //},1000)
          },6*1000)
    })

    // Your code here...
})();