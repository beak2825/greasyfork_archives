// ==UserScript==
// @name         УдалитьРекламуЖЖ
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  убираем баннеры в ЖЖ
// @author       You
// @match        https://*.livejournal.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400968/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%D0%A0%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%83%D0%96%D0%96.user.js
// @updateURL https://update.greasyfork.org/scripts/400968/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%D0%A0%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%83%D0%96%D0%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let reklama1=document.getElementsByClassName("pagewide-wrapper");
    let reklama2=document.getElementsByClassName("j-w j-beta-w su57ggr3 j-w--s2-sidebar-before-widgets");
    let reklama3=document.getElementsByClassName("j-w j-beta-w su57ggr3 j-w--s2-sidebar-after-first-widget");
    let reklama4=document.getElementsByClassName("box-after-first-post");

    let reklama5=document.getElementsByClassName("sjf9ukt17b4rn44aauhmq5");
     let reklama6=document.getElementsByClassName("mainpage__aside");
    let reklama7=document.getElementsByClassName("sj4ow8k               ng-isolate-scope");


  try{

    for(var i=0;i<reklama1.length;i++)
    {
       reklama1[i].innerHTML="";
    };
    } catch(ex){alert(ex)};

      try{

    for( i=0;i<reklama2.length;i++)
    {
       reklama2[i].innerHTML="";
    };
    } catch(ex){alert(ex)};

      try{

    for( i=0;i<reklama3.length;i++)
    {
       reklama3[i].innerHTML="";
    };
    } catch(ex){alert(ex)};

      try{

    for( i=0;i<reklama4.length;i++)
    {
       reklama4[i].innerHTML="";
    };
    } catch(ex){alert(ex)};


     try{

    for( i=0;i<reklama5.length;i++)
    {
       reklama5[i].innerHTML="";
    };
    } catch(ex){alert(ex)};

    try{

    for( i=0;i<reklama6.length;i++)
    {
       reklama6[i].innerHTML="";
    };
    } catch(ex){alert(ex)};

     try{

    for( i=0;i<reklama7.length;i++)
    {
       reklama7[i].innerHTML="";
    };
    } catch(ex){alert(ex)};


})();