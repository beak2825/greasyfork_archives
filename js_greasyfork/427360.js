// ==UserScript==
// @name         xkcdjerry Cheater
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  xkcdjerry屎名了，tcl！！！
// @author       You
// @match        https://www.luogu.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427360/xkcdjerry%20Cheater.user.js
// @updateURL https://update.greasyfork.org/scripts/427360/xkcdjerry%20Cheater.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(()=>
            {
    var name=document.querySelectorAll("span[data-v-6eed723a]");
    for(let i2 in name)
    {
        if(name[i2].innerText=="xkcdjerry")
        {
            name[i2].innerHTML="<span data-v-6eed723a=\"\" style=\"font-weight: bold; color: rgb(173, 139, 0);\" data-v-303bbf52=\"\">\n  xkcdjerry\n</span>";
        }
    }

    //<a class="lg-fg-red lg-bold" href="/user/383079" target="_blank">Acc_Robin</a>
    var benben=document.querySelectorAll("a[class=\"lg-fg-red lg-bold\"]");
    for(let i in benben)
    {
        if(benben[i].innerText=="xkcdjerry")
        {
            benben[i].innerHTML="<span class=\"feed-username\"><a class=\"lg-fg-brown lg-bold\" href=\"/user/298051\" target=\"_blank\">xkcdjerry</a> <span class=\"am-badge am-radius lg-bg-brown\">作弊者</span></span>"
        }
    }
},1000);
    // Your code here...
})();