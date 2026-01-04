// ==UserScript==
// @name         自动全选
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自定义查询自动全选
// @author       晴天
// @match        http://220.181.130.161/smartbi/vision/openresource*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445508/%E8%87%AA%E5%8A%A8%E5%85%A8%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/445508/%E8%87%AA%E5%8A%A8%E5%85%A8%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        //关闭自动更新
        document.getElementById("cbAutoUpdate").checked = false;
        //点击显示字段
        if(document.getElementById("freequery-gen262") != null) {
            document.getElementById("freequery-gen262").click();
        }
        if(document.getElementById("freequery-gen310") != null) {
            document.getElementById("freequery-gen310").click();
        }
        if(document.getElementById("freequery-gen378") != null) {
            document.getElementById("freequery-gen378").click();
        }
        if(document.getElementById("freequery-gen274") != null) {
            document.getElementById("freequery-gen274").click();
        }
        if(document.getElementById("freequery-gen284") != null) {
            document.getElementById("freequery-gen284").click();
        }
        //展开所有字段
        var allColumn = document.getElementsByClassName("_tabFieldsTr")[0].getElementsByClassName("tree_expander");
        for(var i = 1;i < allColumn.length;i++){
            if(allColumn[i].src.indexOf("img/tree/P1.png") > 0) {
                triggerMouseEvent(allColumn[i],"mousedown");
            }
        }
        //等待字段显示
        setTimeout(function(){
            var allFields = document.getElementsByClassName("tree_checkbox");
            var unCheckFields = new Array();
            //将所有未被选中的Object存放
            for(var j = 0;j < allFields.length;j++){
                if(allFields[j].src.indexOf("CheckBoxUnChecked") > 0) {
                    unCheckFields.push(allFields[j]);
                }
            }
            //给未选中的元素每隔三秒进行一次点击
            for(var k = 1;k < unCheckFields.length;k++){
                (function(k){//自执行函数，获取i
                    setTimeout(function() {
                        triggerMouseEvent(unCheckFields[k],"mousedown");
                    }, k*3000)//将 i 的值传进来 ，这样就可以每个一秒输出一个值
                })(k)
            }
        },3000);
    },5000);
    function triggerMouseEvent (node, eventType) {
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }
})();