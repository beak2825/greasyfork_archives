// ==UserScript==
// @name         开源中国去用户标签
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去除开源中国乱弹中用户的特殊标签
// @author       MYL
// @match        https://**.oschina.net/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383622/%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E5%8E%BB%E7%94%A8%E6%88%B7%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/383622/%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E5%8E%BB%E7%94%A8%E6%88%B7%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    removeUserLabel();
    document.getElementById("tweetList").addEventListener('DOMNodeInserted', function(e) {
        removeUserLabel();
    });
})();
/*去除标签的方法*/
function removeUserLabel(){
    console.log("开始执行去标签脚本");
    var list=document.getElementsByClassName("__user");
    for(var i=0; i<list.length; i++){
        // console.log(list[i].text);
        var item = list[i].parentNode.getElementsByTagName("span")
        for(var j=0; j<item.length; j++){
            // class=memo表示不是标签
            if (item[j].getAttribute("class")!="memo"){
                console.log(list[i].text + "标签长度" + item.length + "获取到了标签：" + item[j]);
                item[j].remove();
                --j;
            }
        }
    }
    console.log("结束执行去标签脚本");
}
