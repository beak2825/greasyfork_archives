// ==UserScript==
// @name         哈哩哈哩_上一集下一集_halihali
// @namespace    http://tampermonkey.net/
// @version      0.5.4
// @description  添加上一集和下一集按钮 看柯南必备!!!
// @author       lishunsheng
// @match        http://halihali5.com/*/*.html
// @match        http://halihali4.com/*/*.html
// @match        http://halihali3.com/*/*.html
// @match        http://halihali2.com/*/*.html
// @match        http://halihali1.com/*/*.html
// @icon         http://halihali1.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434171/%E5%93%88%E5%93%A9%E5%93%88%E5%93%A9_%E4%B8%8A%E4%B8%80%E9%9B%86%E4%B8%8B%E4%B8%80%E9%9B%86_halihali.user.js
// @updateURL https://update.greasyfork.org/scripts/434171/%E5%93%88%E5%93%A9%E5%93%88%E5%93%A9_%E4%B8%8A%E4%B8%80%E9%9B%86%E4%B8%8B%E4%B8%80%E9%9B%86_halihali.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    var nowUrl=window.location.href;
    var regex=/(\/[0-9]*)/g;
    var regexResult=nowUrl.match(regex);
    var now=parseInt(regexResult[regexResult.length-1].substring(1,4))
    var re= /\/\d{1,10}.html/g
    var url=nowUrl.replace(re,"/"+(now+1)+".html")
    var lasturl=nowUrl.replace(re,"/"+(now-1==0?1:now-1)+".html")
    //var node=document.getElementsByClassName("wrap head clearfix")[0].getElementsByClassName("logo")[0].getElementsByTagName("a")[0].setAttribute("href", url)

    var node=document.createElement("a");
    var textnode=document.createTextNode("上一集");
    if(now==1){
        node.setAttribute("title","这已经是第一集了")
    }
    node.appendChild(textnode);
    node.style.border='1px solid #666'
    node.style.background= '#222';
    node.style.color= '#aaa';
    node.style.padding= '5px 10px';
    node.style.margin= '5px 5px';
    node.style.textDecoration= 'none';
    node.style.borderRadius='2px';
    node.style.mozborderradius= '2px';
    node.style.webkitborderradius= '2px';
    node.setAttribute("href",lasturl)
    document.getElementsByClassName("h2")[0].appendChild(node);

    var node1=document.createElement("a");
    var textnode1=document.createTextNode("下一集");
    if(document.getElementsByClassName("dramaNumList  clearfix")[0].getElementsByTagName("li")[0]==null){
        alert("本集可能暂未上线")
    }
    node1.appendChild(textnode1);
    node1.style.border='1px solid #666'
    node1.style.background= '#222';
    node1.style.color= '#aaa';
    node1.style.padding= '5px 10px';
    node1.style.margin= '5px 5px';
    node1.style.textDecoration= 'none';
    node1.style.borderRadius='2px';
    node1.style.mozborderradius= '2px';
    node1.style.webkitborderradius= '2px';
    node1.setAttribute("href", url)
    document.getElementsByClassName("h2")[0].appendChild(node1);
})();