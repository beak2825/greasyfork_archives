// ==UserScript==
// @name         3DM黑名单屏蔽留言
// @namespace    妖伊社
// @version      0.2
// @description  如需新增黑名单用户，请修改代码第17行
// @author       妖伊社
// @match        https://*.3dmgame.com/news/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463950/3DM%E9%BB%91%E5%90%8D%E5%8D%95%E5%B1%8F%E8%94%BD%E7%95%99%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/463950/3DM%E9%BB%91%E5%90%8D%E5%8D%95%E5%B1%8F%E8%94%BD%E7%95%99%E8%A8%80.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    function hideSB(){
        var names = document.getElementsByClassName("cont-name cont_w");
        var sb = ["河山硕正在呼唤神蛆们共赴国难","owen23456","woaiziyuanwo","龍域朙王[涅槃重","老九","ddr10668899","3dm_15795754"];
        for (var i=0; i<names.length; i++)
        {
            try {
                var n = names[i].innerHTML;
                var n1 = n;
                for(var j=0; j<sb.length; j++){ n1 = n1.replace(sb[j], "")}
                if (n1 != n){
                    names[i].innerHTML = "";
                    var nodes = names[i].parentNode.children;
                    for(var k=0; k<nodes.length; k++){nodes[k].innerHTML="";}
                }
            }
            catch (e) {
                continue;
            }
        }
        setTimeout(function() { hideSB(); }, 1000);
    }
    hideSB();
})();