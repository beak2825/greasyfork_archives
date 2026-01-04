// ==UserScript==
// @name         答题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match       https://degree.qingshuxuetang.com/sylg/Student/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405958/%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/405958/%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){

        $('iframe').each(function(){
            $(this).prop('contentWindow').document.body.onkeydown=function(ev){
                if(ev.keyCode==18){
                    var person=prompt("请输入你的名字","");
                    if (person!=null && person!=""){
                        $(this).html(person)
                    }
                    return false;
                }
            }
        })
    }

    // Your code here...
})();