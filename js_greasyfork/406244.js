// ==UserScript==
// @name         帮你下批量下载
// @namespace    https://bangnixia.com/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://bangnixia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406244/%E5%B8%AE%E4%BD%A0%E4%B8%8B%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/406244/%E5%B8%AE%E4%BD%A0%E4%B8%8B%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function AddToStr(para){
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', para, true);
        httpRequest.send();
    
        var htmlObj;
        var link;
    
    
    
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = httpRequest.responseText;
                htmlObj = json;
                var el = document.createElement( 'html' );
                el.innerHTML = htmlObj;
    
                var dlist = el.getElementsByClassName( 'download_group' );
    
                // 最后需要的下载连接
                link = dlist[0].children[1].firstElementChild.getAttribute("href");
    
                // arr.push(link)
                console.log(link);
    
                var oTest = document.getElementsByClassName("row")[0];
                var newNode = document.createElement("div");
                newNode.innerHTML = link;
                oTest.insertBefore(newNode,null);
            }
        };
    }
    
    
    var objList = document.getElementsByClassName("table table-striped")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    
    var totalDownStr = new String("")
    var linkArray = [];
    for  (var obj of objList){
        var downBtn = obj.getElementsByClassName("text-white");
        if (downBtn.length != 0){
            var link = downBtn[0].getAttribute("href");
            AddToStr(link);
        }
    
    }
    
})();