// ==UserScript==
// @name         UR便筏标签页 Test
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  UR页面下将指向地址 显示在logo边，作为便签使用
// @author       You
// @match        https://prtrack.tpv-tech.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tpv-tech.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468260/UR%E4%BE%BF%E7%AD%8F%E6%A0%87%E7%AD%BE%E9%A1%B5%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/468260/UR%E4%BE%BF%E7%AD%8F%E6%A0%87%E7%AD%BE%E9%A1%B5%20Test.meta.js
// ==/UserScript==

(function() {
    'use strict';
     const Thead=document.querySelector("#SiteHeader > div.logo_row > div.header_logo")
     //a.id="a1"
    //a.style.color="white"
    //Thead.appendChild(a)
    //遍历保存到localStorage的key：value值，若有发现人为保存的包含DUT字眼的key则在logo边新建a控件，href值为对应value值，点击后能跳转对应页面
     for(var i=0;i<localStorage.length;i++)
    {
        var Tkey=localStorage.key(i)
       if (Tkey.includes("DUT"))
       {
         var a1=document.createElement("a")
         a1.style.color="white"
         a1.href=localStorage.getItem(Tkey)
         a1.innerText=Tkey
         Thead.appendChild(a1)
         var space = document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0");
          Thead.insertBefore(space, a1);

       }
    }

  
    // Your code here...
})();

