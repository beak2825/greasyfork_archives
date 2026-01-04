// ==UserScript==
// @name         自己修改的反图片防盗链
// @name:en      Anti-anti-pic-stealing-link
// @namespace    hoothin
// @version      0.3
// @description  破解图片防盗链
// @description:en  crack Anti-pic-stealing-link to show real picture
// @author       hoothin
// @include      http*://*/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/38489/%E8%87%AA%E5%B7%B1%E4%BF%AE%E6%94%B9%E7%9A%84%E5%8F%8D%E5%9B%BE%E7%89%87%E9%98%B2%E7%9B%97%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/38489/%E8%87%AA%E5%B7%B1%E4%BF%AE%E6%94%B9%E7%9A%84%E5%8F%8D%E5%9B%BE%E7%89%87%E9%98%B2%E7%9B%97%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const sites={
        "qq.com":          "photo\.store\.qq\.com",
        "baidu.com":       "imgsa\.baidu\.com",
//原脚本是后面这样写的,上面是我自己改的,改的方法是查看百度的图床网址,现在是imgsa.baidu.com  "baidu.com":       "a\.hiphotos\.baidu\.com\/image",

    };
    var customRule=GM_getValue("aaslr");
    function refererChanger(item){
        var frameid = 'frameimg' + Math.random();
        unsafeWindow.img = '<img id="aapslImg" src="'+item.src+'?'+Math.random()+'"/><script>window.onload=function(){parent.document.getElementById("'+frameid+'").height=document.getElementById("aapslImg").height+"px";}</script>';
        var iframe=document.createElement("iframe");
        iframe.id=frameid;
        iframe.src="javascript:parent.img;";
        iframe.frameBorder="0";
        iframe.scrolling="no";
        iframe.width="100%";
        item.parentNode.replaceChild(iframe,item);
    }
    GM_registerMenuCommand("Anti-anti-pic-stealing-link rule", function(){
        var input=prompt("Set up Anti-anti-pic-stealing-link rule:",customRule?customRule:"");
        if(input){
            customRule=input;
            GM_setValue("aaslr",customRule);
        }
    });
    [].forEach.call(document.querySelectorAll("img"),function(item){
        for (var i in sites) {
            var sitePatt=new RegExp(sites[i],"i");
            if(sitePatt.test(item.src)){
                if(!(new RegExp(i,"i")).test(location.href)){
                    refererChanger(item);
                }
                break;
            }
        }
        if(customRule && (new RegExp(customRule,"i")).test(item.src)){
            refererChanger(item);
        }
    });
})();
