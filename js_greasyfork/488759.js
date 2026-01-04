// ==UserScript==
// @name         关键字替换-关键字屏蔽-replaceKeyWordsText
// @namespace    http://replaceText.net/
// @version      2024.04.01
// @description  将所有网页内你不想看到的关键字替换或屏蔽，replace key words  Text，chanage key words Text to NewText
// @author       anonymous
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488759/%E5%85%B3%E9%94%AE%E5%AD%97%E6%9B%BF%E6%8D%A2-%E5%85%B3%E9%94%AE%E5%AD%97%E5%B1%8F%E8%94%BD-replaceKeyWordsText.user.js
// @updateURL https://update.greasyfork.org/scripts/488759/%E5%85%B3%E9%94%AE%E5%AD%97%E6%9B%BF%E6%8D%A2-%E5%85%B3%E9%94%AE%E5%AD%97%E5%B1%8F%E8%94%BD-replaceKeyWordsText.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //初始化变量
    var i= 0;
    var keywords = new Array();


    //示例，如下修改或添加关键字和替换字
    //keywords.push({'text':'关键字','newText':'替换后的关键字'});
    keywords.push({'text':'百度','newText':'吸血度'});
    //在下面添加即可



    // Your code here...
    //运行代码
    console.log("tampermonkey 开始替换关键字，tampermonkey replaceText code start");


    function replaceTextOnPage(){
        //获取所有文档节点
        var elementsInsideBody =[...document.body.getElementsByTagName("*")];
        elementsInsideBody.forEach(element =>{
            element.childNodes.forEach(child =>{
                //节点为文字
                if (child.nodeType ===3){
                    //对每个关键字进行一次替换
                    for (i=0;i<keywords.length;i++){
                        //console.log(keywords[i].text,keywords[i].newText);
                        //替换
                        child.textContent = child.textContent.replaceAll(keywords[i].text,keywords[i].newText);
                    }
                }
            });
        });
    }

    //开始运行
    replaceTextOnPage();
})();