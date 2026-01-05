/**
 * Created by zhang on 2017/5/27.
 */


// ==UserScript==
// @name         66ysGetUrl
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://chrome.google.com/webstore/category/extensions
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30055/66ysGetUrl.user.js
// @updateURL https://update.greasyfork.org/scripts/30055/66ysGetUrl.meta.js
// ==/UserScript==

(function() {


    // Your code here...

    //找到页面中的所有table

    var tabArray = document.getElementsByTagName("table");
    var realTable = [];
    //find all Tbody
    for(var i=0,a=0,len=tabArray.length; i<len; i++){
        if(tabArray[i].getAttribute("bgcolor") === "#0099cc"){
            realTable[a] = tabArray[i];
            a++;
        }
    }

    var linkList = [];
    var j = 0;
    //变量有3 i为体 j为连续的数组下标 o为单个体内a的个数
    for(var i=0,len=realTable.length; i<len; i++){

        var linkContent = realTable[i].getElementsByTagName("a");
        var strs = realTable[i].getElementsByTagName("strong")[0];

        // tBody Head info
        if(strs){
            linkList[j] = "\n" + "\n" +strs.lastChild.nodeValue + "\n" + "\n";
            j++;
        }
        //

        for(var o = 0; o<linkContent.length; j++,o++){
            if(linkContent[o].getAttribute("thunderpid")){
                //黑恶势力做斗争
                linkList[j] = linkContent[o].getAttribute("thunderrestitle")+ "\n";
            }
            else {
                linkList[j] =   linkContent[o].getAttribute("href") + "\n";
            }
        }

    }

    //creat textarea button to body!
    var linkTagTextArea = document.createElement("textarea");
    linkTagTextArea.setAttribute("cols",150);
    linkTagTextArea.setAttribute("rows",50);
    linkTagTextArea.setAttribute("id","UrlArea");

    for(var i=0,len=linkList.length; i<len; i++){
        linkTagTextArea.appendChild(document.createTextNode(linkList[i]));
    }

    document.body.appendChild(linkTagTextArea);

    //TODO 添加按钮 增加事件 拷贝到粘贴板

    var btn = document.createElement("input");
    btn.setAttribute("type","button");
    btn.setAttribute("value","复制到粘贴板");

    btn.addEventListener("click",function (e) {

        var textArea = document.getElementById("UrlArea");
        var clipboardData = window.clipboardData; //for IE
        if (!clipboardData) { // for chrome
            alert("浏览器不支持复制 请手动 CTRL+C");
            return;
        }

        clipboardData.setData('Text', textArea.firstChild.nodeValue);
        alert("复制成功");

    })

    document.body.appendChild(btn);
    document.body.appendChild(linkTagTextArea);
    //end
})();