// ==UserScript==
// @name         Acc Purple Name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Acc_Robin紫名金钩了，太聚了！！！
// @author       You
// @match        https://www.luogu.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427356/Acc%20Purple%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/427356/Acc%20Purple%20Name.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(()=>
            {
    var name=document.querySelectorAll("span[data-v-6eed723a]");
    for(let i2 in name)
    {
        if(name[i2].innerText=="Acc_Robin")
        {
            name[i2].innerHTML="<span data-v-6eed723a=\"\" data-v-0ee625fe=\"\" class=\"wrapper\"><a data-v-303bbf52=\"\" data-v-6eed723a=\"\" href=\"/user/383079\" target=\"_blank\" colorscheme=\"none\" class=\"color-none\"><span data-v-6eed723a=\"\" style=\"font-weight: bold; color: rgb(157, 61, 207);\" data-v-303bbf52=\"\">\n  Acc_Robin\n</span></a> <span data-v-6eed723a=\"\"><a data-v-303bbf52=\"\" href=\"/discuss/show/142324\" target=\"_blank\" colorscheme=\"none\" class=\"color-none\"><svg data-v-303bbf52=\"\" aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fad\" data-icon=\"badge-check\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" class=\"svg-inline--fa fa-badge-check fa-w-16\" style=\"--fa-primary-color:#fff; --fa-secondary-color:#ffc116; --fa-secondary-opacity:1;\"><g data-v-303bbf52=\"\" class=\"fa-group\"><path data-v-303bbf52=\"\" fill=\"currentColor\" d=\"M512 256a88 88 0 0 0-57.1-82.4A88 88 0 0 0 338.4 57.1a88 88 0 0 0-164.8 0A88 88 0 0 0 57.1 173.6a88 88 0 0 0 0 164.8 88 88 0 0 0 116.5 116.5 88 88 0 0 0 164.8 0 88 88 0 0 0 116.5-116.5A88 88 0 0 0 512 256zm-144.8-44.25l-131 130a11 11 0 0 1-15.55-.06l-75.72-76.33a11 11 0 0 1 .06-15.56L171 224a11 11 0 0 1 15.56.06l42.15 42.49 97.2-96.42a11 11 0 0 1 15.55.06l25.82 26a11 11 0 0 1-.08 15.56z\" class=\"fa-secondary\"></path><path data-v-303bbf52=\"\" fill=\"currentColor\" d=\"M367.2 211.75l-131 130a11 11 0 0 1-15.55-.06l-75.72-76.33a11 11 0 0 1 .06-15.56L171 224a11 11 0 0 1 15.56.06l42.15 42.49 97.2-96.42a11 11 0 0 1 15.55.06l25.82 26a11 11 0 0 1-.06 15.56z\" class=\"fa-primary\"></path></g></svg></a></span> <!----></span>"
        }
    }

    //<a class="lg-fg-red lg-bold" href="/user/383079" target="_blank">Acc_Robin</a>
    var benben=document.querySelectorAll("a[class=\"lg-fg-red lg-bold\"]");
    for(let i in benben)
    {
        if(benben[i].innerText=="Acc_Robin")
        {
            benben[i].innerHTML="<span data-v-6eed723a=\"\" data-v-0ee625fe=\"\" class=\"wrapper\"><a data-v-303bbf52=\"\" data-v-6eed723a=\"\" href=\"/user/383079\" target=\"_blank\" colorscheme=\"none\" class=\"color-none\"><span data-v-6eed723a=\"\" style=\"font-weight: bold; color: rgb(157, 61, 207);\" data-v-303bbf52=\"\">\n  Acc_Robin\n</span></a> <span data-v-6eed723a=\"\"><a data-v-303bbf52=\"\" href=\"/discuss/show/142324\" target=\"_blank\" colorscheme=\"none\" class=\"color-none\"><svg data-v-303bbf52=\"\" aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fad\" data-icon=\"badge-check\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" class=\"svg-inline--fa fa-badge-check fa-w-16\" style=\"--fa-primary-color:#fff; --fa-secondary-color:#ffc116; --fa-secondary-opacity:1;\"><g data-v-303bbf52=\"\" class=\"fa-group\"><path data-v-303bbf52=\"\" fill=\"currentColor\" d=\"M512 256a88 88 0 0 0-57.1-82.4A88 88 0 0 0 338.4 57.1a88 88 0 0 0-164.8 0A88 88 0 0 0 57.1 173.6a88 88 0 0 0 0 164.8 88 88 0 0 0 116.5 116.5 88 88 0 0 0 164.8 0 88 88 0 0 0 116.5-116.5A88 88 0 0 0 512 256zm-144.8-44.25l-131 130a11 11 0 0 1-15.55-.06l-75.72-76.33a11 11 0 0 1 .06-15.56L171 224a11 11 0 0 1 15.56.06l42.15 42.49 97.2-96.42a11 11 0 0 1 15.55.06l25.82 26a11 11 0 0 1-.08 15.56z\" class=\"fa-secondary\"></path><path data-v-303bbf52=\"\" fill=\"currentColor\" d=\"M367.2 211.75l-131 130a11 11 0 0 1-15.55-.06l-75.72-76.33a11 11 0 0 1 .06-15.56L171 224a11 11 0 0 1 15.56.06l42.15 42.49 97.2-96.42a11 11 0 0 1 15.55.06l25.82 26a11 11 0 0 1-.06 15.56z\" class=\"fa-primary\"></path></g></svg></a></span> <!----></span>"
        }
    }
},1000);
    // Your code here...
})();