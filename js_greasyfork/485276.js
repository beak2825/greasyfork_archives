// ==UserScript==
// @name         版主工具-检查非原创
// @namespace    http://www.cool18.com/bbs6
// @version      0.1
// @description  YOLO!
// @license      MIT
// @author       lyabc@6park.com
// @match        https://www.cool18.com/bbs6/index.php
// @match        https://www.cool18.com/bbs6/index.php?app=forum&act=threadview&tid*
// @match        https://www.cool18.com/bbs6/index.php?app=forum&act=cachepage&cp=tree*
// @match        https://www.cool18.com/bbs6/index.php?app=forum&act=list&pre=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/485276/%E7%89%88%E4%B8%BB%E5%B7%A5%E5%85%B7-%E6%A3%80%E6%9F%A5%E9%9D%9E%E5%8E%9F%E5%88%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/485276/%E7%89%88%E4%B8%BB%E5%B7%A5%E5%85%B7-%E6%A3%80%E6%9F%A5%E9%9D%9E%E5%8E%9F%E5%88%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function doStatsAgainstGoldPage(){
        var gold_list;
        var gold_list_url="https://www.cool18.com/bbs6/index.php?app=forum&act=gold";
        GM.xmlHttpRequest({
            method: "GET",
            url: gold_list_url,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/xml"
            },
            onload: function(response) {
                var doc=null;
                doc=new DOMParser()
                    .parseFromString(response.responseText, "text/html");
                gold_list=Array.from(doc.querySelectorAll("#thread_list > li> a"))
                var url=location.href;var ret='';
                if (url.indexOf("act=threadview")==-1){
                    ret= get_stats_multiple(gold_list);
                } else {
                    ret= get_stats_single(gold_list);
                }
                console.log(ret);
                GM_setClipboard(ret);

            }
        });
    }
    function getAbsoluteURL(baseURL, relativeURL) {
        var url = new URL(relativeURL, baseURL);
        return url.href;
    }

    function isYuanchuang(text){
        if(text.indexOf("自行贴上分享")!=-1){
            return false;
        }else if(text.indexOf("原创内容")!=-1){
            return true;
        }
    }
    function generateReply(title,content){
        var subElement=document.querySelector("#subject");
        var conElement=document.querySelector("#content");
        if(subElement) subElement.value=title; subElement.scrollIntoView();
        if(conElement) conElement.value=content;

    }
    function remFeiYuanChuang() {
        var title="🕵️🕵️🕵️未标注原创，请入内:";
        var content=`
<b>版主提示：</b>
请注意标注来源为原创
一：私房自拍不允许转载内容
二：原创作品超过6篇，可以举荐申请为原创大V
修改教程以及原创大V相关见：
<u>【版务】原创大V统一申请贴跟原创标注</u>
https://www.cool18.com/bbs6/index.php?app=forum&act=threadview&tid=14630498`
        generateReply(title,content);
    }
    function checkFeiYuanChuang(){
        //检查哪个链接不是原创
        function checkElementContentBySelector(title,url,selector) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET',url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var responseHTML = xhr.responseText;
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(responseHTML, 'text/html');
                    var element = doc.querySelector(selector);

                    if (element) {
                        var elementContent = element.innerHTML;
                        if(!isYuanchuang(elementContent)){
                            window.open(url, "_blank");
                            console.log(title+"\n" + url+"\n");
                        }
                        //console.log(title+"\n" + elementContent+"\n");
                    } else {
                        console.log("找不到指定的元素。");
                    }
                }
            };
            xhr.send();
        }




      
        var selector = 'body > table:nth-child(4) > tbody > tr:nth-child(6) > td'; // 示例 CSS 选择器


        var items=document.querySelectorAll("#d_list > ul > li> a:nth-child(1)")
        Array.prototype.forEach.call( items, function ( elem ) {
            var url = elem.href
            url=getAbsoluteURL(location.href,url)
            var title=elem.textContent
            checkElementContentBySelector(title,url,selector);
        });

    }

    //Create button
    var zNode = document.createElement ('div');
    zNode.innerHTML = '<button id="myButtonYC" type="button">'
        + '原创贴</button>';
    zNode.setAttribute ('id', 'myContainerYC');
    document.body.appendChild (zNode);
    document.getElementById ("myButtonYC").addEventListener (
        "click", ButtonClickAction, false
    );
    //Button click function
    function ButtonClickAction (zEvent) {

        var curURL=location.href
        if(curURL.indexOf("threadview")===-1){

            checkFeiYuanChuang();
        }else{
            console.log(" remFeiYuanChuang()")
            remFeiYuanChuang();
        }
    }
    //Button style
    GM_addStyle ( `
    #myContainerYC {
        position:               fixed;
        top:                    160px;
        left:                   30px;
        font-size:              10px;
        background:             orange;
        border:                 1px outset black;
        margin:                 3px;
        opacity:                0.5;
        z-index:                9999;
        padding:                2px 2px;
    }
    #myButtonYC {
        cursor:                 pointer;
    }
    #myContainerYC p {
        color:                  red;
        background:             white;
    }
` );
})();