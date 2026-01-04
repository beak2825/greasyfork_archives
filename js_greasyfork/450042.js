// ==UserScript==
// @name         TUOutGoing1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  use tamp to change world
// @author       CEJjls1
// @match        https://serv.tju.edu.cn/verifyqr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/450042/TUOutGoing1.user.js
// @updateURL https://update.greasyfork.org/scripts/450042/TUOutGoing1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() =>{
        $(()=>{



            let g = document.querySelector("#qrContent > span:nth-child(3)");
            let f = document.querySelector("#qrContent > span:nth-child(1)");
            console.log("引入完成");
            if ( $(g).html() == '核酸检测')
            {
                $(g).html("西门");
                console.log("修改为进入西门");
            }
            else
            {
                $(f).html("您已离开");
                $(g).html("西门，再见！");
                console.log("修改为离开西门");
            }
            console.log("修改完成");


        })
    },1000);

    // Your code here...

})();