// ==UserScript==
// @name         司机社优化论坛视觉
// @license Jam
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  司机社优化论坛视觉!
// @author       You
// @include        https://sijishes.com/forum.php?mod=forumdisplay*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sijishes.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477665/%E5%8F%B8%E6%9C%BA%E7%A4%BE%E4%BC%98%E5%8C%96%E8%AE%BA%E5%9D%9B%E8%A7%86%E8%A7%89.user.js
// @updateURL https://update.greasyfork.org/scripts/477665/%E5%8F%B8%E6%9C%BA%E7%A4%BE%E4%BC%98%E5%8C%96%E8%AE%BA%E5%9D%9B%E8%A7%86%E8%A7%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.7.1.slim.js';
    script.type = 'text/javascript';
    document.head.appendChild(script);

    // 在 jQuery 加载完成后执行你的代码
    script.onload = function() {
        // 在这里你可以使用 jQuery
        $(document).ready(function() {
            $(".sd").remove()
            $(".nex_bkjsbg").remove()
            $(".nex_Product_unextend").remove()
            console.log($(".mn"))
            document.getElementsByClassName("mn")[0].style.cssText ="width:100% !important"
            $("div.nex_forumlist_pics a").css({
                "width":"15.5vw",
                "height":"180px"
            })
            $(".nex_forumlist_pics").css("width","100%")
            $(".nex_forumlist_pics ul").css("width","100%")
            // 在这里编写你的 jQuery 代码
            // document.getElementsByClassName("sd")[0].remove()
            //document.getElementsByClassName("nex_bkjsbg")[0].remove()
            //document.getElementsByClassName("nex_Product_unextend")[0].remove()
            //
        });
    };

    //*[@id="normalthread_109855"]/div[2]/div/div[3]/ul/li[1]/div/a
    // Your code here...
})();