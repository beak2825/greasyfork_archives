// ==UserScript==
// @name          微博第三方登录恢复
// @description 微博网页版第三方登录恢复
// @version      1.0
// @namespace   https://space.bilibili.com/482343
// @author      古海沉舟
// @license     古海沉舟
// @include      https://weibo.com/
// @exclude     https://weibo.com/a*
// @run-at       document-end
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/434166/%E5%BE%AE%E5%8D%9A%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95%E6%81%A2%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/434166/%E5%BE%AE%E5%8D%9A%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95%E6%81%A2%E5%A4%8D.meta.js
// ==/UserScript==
setTimeout(function (){
    var x=document.querySelector("#pl_login_form > div > div:nth-child(3) > div.info_list.login_btn > a");
    var y;
    var c="";
    if (x==null) return;
    x = document.evaluate('//*[@id="pl_login_form"]/div/comment()', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    console.log("x  : ",x);
    if (x.snapshotLength>0) {
        for (var i = 0; i < x.snapshotLength; i++) {
            //console.log(i+" : ");
            //console.log(x.snapshotItem(i));
            y=x.snapshotItem(i).textContent;
            if(y.indexOf("<a target")>-1 && y.indexOf("</a>")>-1) {
               // console.log("有链接");
                y=y.replace("<!--","").replace("-->","");
                c+=y;
            }
        }
    }
    if (c!=""){
        x=document.querySelector("#pl_login_form > div");
        if (x!=null){
            x.innerHTML+=c;
        }
    }
},1000);


