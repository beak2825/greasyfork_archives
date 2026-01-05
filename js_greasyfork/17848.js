// ==UserScript==
// @name AC-百度去广告
// @namespace ACNoAdd
// @description 去掉百度的推广链接
// @include http://www.baidu.com/*
// @include https://www.baidu.com/*
// @version 5.0
// @grant none
// @author AC
// @icon            https://coding.net/u/zb227/p/zbImg/git/raw/master/img0/icon.jpg
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/17848/AC-%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/17848/AC-%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
document.body.addEventListener("DOMNodeInserted", removeAD, false);

function removeAD(){
    var no = document.getElementById("content_right");
    if(no != null) no.remove();
    if(document.querySelectorAll("#content_left")[0] != null){
        var fathers = document.querySelectorAll("#content_left")[0].childNodes;
        var lastId = 0;
        for(var i = 0; i < fathers.length; i++){
            var currentNode = fathers[i];
            if(fathers[i].tagName=="DIV" && fathers[i].getAttribute("dealAD") == null){
                if(null == currentNode.id || "" == currentNode.id){
                    // 米有ID的貌似都是广告
                    console.log("移除 CLASS="+currentNode.className);
                    currentNode.remove();
                } else if(currentNode.id == "clone"){
                    // ID 显示为CLONE的也是广告
                    console.log("移除 ID="+currentNode.id);
                    currentNode.remove();
                } else if(currentNode.className.indexOf("result") != 0 && /^\d+$/.test(currentNode.id)){
                    // class不是result...的，并且id是纯粹数字的(很大)
                    console.log("移除 ID="+currentNode.id);
                    currentNode.remove();
                } else{
                    var node = currentNode.querySelectorAll(".f13>span")[0];
                    if(node != null && node.innerHTML == "广告"){
                        console.log("移除 ID="+currentNode.id);
                        currentNode.remove();
                    }
                    //document.querySelectorAll("#content_left>div[id='"+ currentNode.id +"']")[0].remove();
                }
                currentNode.setAttribute("dealAD", 1);
            }
        }
    }
}