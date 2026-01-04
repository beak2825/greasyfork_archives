// ==UserScript==
// @name         邯郸综素小工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  仅供学习js测试使用。切勿用于其他用途。安装本代码后，会在顶部增加 “点我-则-全部通过”按钮。
// @author       You
// @match        http://zspj.hdjy.net.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436620/%E9%82%AF%E9%83%B8%E7%BB%BC%E7%B4%A0%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/436620/%E9%82%AF%E9%83%B8%E7%BB%BC%E7%B4%A0%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.querySelector(".nav")!=null){
    var li = document.createElement('li');
var b = document.createElement('a');
    b. setAttribute("href","javascript:void (0)")
    b.onclick=()=>{
        for(var one of document.querySelectorAll("button.btn"))
        {
            if(one.textContent=="通过")
            {
                one.click();
            }
        }
    };
			b.textContent="点我-则-全部通过";
    li.appendChild(b);
			document.querySelector(".nav").appendChild(li);
    }
    // Your code here...
})();