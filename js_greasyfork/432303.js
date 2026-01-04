

    // ==UserScript==
    // @name         purplename
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  getpurplename
    // @author       You
    // @match        https://www.luogu.com.cn/*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432303/purplename.user.js
// @updateURL https://update.greasyfork.org/scripts/432303/purplename.meta.js
    // ==/UserScript==
     
    (function() {
        'use strict';
    setInterval(()=>
                {
        var name=document.querySelectorAll("span[data-v-6eed723a]");
        for(let i2 in name)
        {
            if(name[i2].innerText=="whhsteven")
            {
                name[i2].innerHTML="<span data-v-6eed723a=\"\" style=\"font-weight: bold; color: rgb(142, 68, 173);\" data-v-303bbf52=\"\">\n  whhsteven\n</span>";
            }
        }
     
        //<a class="lg-fg-red lg-bold" href="/user/383079" target="_blank">Acc_Robin</a>
        var benben=document.querySelectorAll("a[class=\"lg-fg-red lg-bold\"]");
        for(let i in benben)
        {
            if(benben[i].innerText=="whhsteven")
            {
                benben[i].innerHTML="<span class=\"feed-username\"><a class=\"lg-fg-brown lg-bold\" href=\"/user/118109\" target=\"_blank\">whhsteven</a> <span class=\"am-badge am-radius lg-bg-purple\">OIer</span></span>"
            }
        }
    },1000);
        // Your code here...
    })();

