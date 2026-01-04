// ==UserScript==
// @name         洛谷按钮层叠顺序优化 Luogu ZIndex Optimization (LZO)
// @namespace    https://www.luogu.com.cn/user/237530
// @version      1.0
// @description  优化洛谷首页按钮层叠顺序，使“应用”菜单覆盖左右箭头
// @author       rzh123
// @match        https://www.luogu.com.cn/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435379/%E6%B4%9B%E8%B0%B7%E6%8C%89%E9%92%AE%E5%B1%82%E5%8F%A0%E9%A1%BA%E5%BA%8F%E4%BC%98%E5%8C%96%20Luogu%20ZIndex%20Optimization%20%28LZO%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435379/%E6%B4%9B%E8%B0%B7%E6%8C%89%E9%92%AE%E5%B1%82%E5%8F%A0%E9%A1%BA%E5%BA%8F%E4%BC%98%E5%8C%96%20Luogu%20ZIndex%20Optimization%20%28LZO%29.meta.js
// ==/UserScript==

function LZO(){
    var nodes=document.all;
    for(var i=0;i<nodes.length;++i){
        var obj=nodes[i];
        var cls;
        //alert(obj.tagName+','+obj.nodeType+','+obj.sourceIndex);
        if(obj.tagName=="A"){
            cls=obj.className;
            if(cls=="am-prev"||cls=="am-next"){
                //obj.style.zIndex=3;
            }
        }
        if(obj.tagName=="NAV"){
            cls=obj.className;
            if(cls=="lfe-body"){
                obj.style.zIndex=999999;
            }
        }
    }
    //"am-prev"
}
function LZO_main(){
    'use strict';
    LZO();
}
window.onload=LZO_main;