// ==UserScript==
// @name         vividict_tool
// @namespace    http://tampermonkey.net/
// @version      1.0.0.20200107
// @description  To break non-VIP searching restrictions of Vividict!
// @author       小常小常非比寻常
// @match        http://www.vividict.com/Public/index/page/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421525/vividict_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/421525/vividict_tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    document.cookie="t3word="+"";
    function delete_element(classname){
        var i=0;
        //通过class获取元素
        var paras = document.getElementsByClassName(classname);
        for(i=0;i<paras.length;i++){
            //删除元素 元素.parentNode.removeChild(元素);
            if (paras[i] !== null){
                paras[i].parentNode.removeChild( paras[i]);
            }
            break;
        }
    }
    delete_element("annunciate box");
    delete_element("right");
    delete_element("dialog");

    //alert("OK");
})();