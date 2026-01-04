// ==UserScript==
// @name         Anti RemoveFan 空格不是空嗝
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  反删粉脚本。打开B站UP主uid为303582386的账号主页时，每隔30秒刷新检测是否被删粉，如果被删除则自动添加。如果失效请刷新网页。开个新窗口单独打开主页，然后挂后台就行
// @author       FallingStar - 1870332922@qq.com
// @match        https://space.bilibili.com/303582386
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.5.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/415410/Anti%20RemoveFan%20%E7%A9%BA%E6%A0%BC%E4%B8%8D%E6%98%AF%E7%A9%BA%E5%97%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/415410/Anti%20RemoveFan%20%E7%A9%BA%E6%A0%BC%E4%B8%8D%E6%98%AF%E7%A9%BA%E5%97%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function(){
        if($(".h-follow").length == 1){
            $(".h-follow").trigger("click");
        }
        location.reload();
    },30000);
})();