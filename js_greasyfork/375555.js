// ==UserScript==
// @name         南理工教务处修复&一键教评
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  修复南京理工大学教务处教评无法弹出窗口的BUG 以及成绩认定处 无法滚动的问题 一键教评
// @author       Bryan_lzh
// @include      *://202.119.81.11*:9080/*
// @include      *://202.119.81.11*:8080/*
// @grant        none
// @supportURL   https://github.com/BryanSer/NJUST-jwc-repair/issues
// @downloadURL https://update.greasyfork.org/scripts/375555/%E5%8D%97%E7%90%86%E5%B7%A5%E6%95%99%E5%8A%A1%E5%A4%84%E4%BF%AE%E5%A4%8D%E4%B8%80%E9%94%AE%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/375555/%E5%8D%97%E7%90%86%E5%B7%A5%E6%95%99%E5%8A%A1%E5%A4%84%E4%BF%AE%E5%A4%8D%E4%B8%80%E9%94%AE%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.showModalDialog = function(URL,name,specs){
        window.open(URL,name,specs,null);
    };
    var leftf = document.getElementById("leftFrame")
    if(leftf != undefined){
        leftf.scrolling = "yes";
    }
    select();
})();
//一键教评
function select(){
    var table = document.getElementById("table1");
    if(table == undefined){
        return;
    }
    table = table.children;
    var trs = table[0].children;
    deep(table[0],[0]);
    var tj = document.getElementById("tj");
    if(tj != undefined){
        tj.click();
    }
}

function deep(sub,arr){
    if(Object.prototype.toString.call(sub) == "[object HTMLCollection]"){
        for(var x in sub.children){
            deep(x,arr);
        }
    } else {
        if(sub.childElementCount > 0){
            for(var i = 0; i < sub.childElementCount; i++){
                var t = sub.children[i]
                deep(t,arr);
            }
        }else{
            if(sub.type == "radio"){
                if(arr[0] % 5 == 0 || arr[0] == 1){
                    sub.checked = true;
                }
                arr[0]++
            }
        }
    }
}