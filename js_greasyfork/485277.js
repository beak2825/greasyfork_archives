// ==UserScript==
// @name         版主工具-检查金币贴
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
// @downloadURL https://update.greasyfork.org/scripts/485277/%E7%89%88%E4%B8%BB%E5%B7%A5%E5%85%B7-%E6%A3%80%E6%9F%A5%E9%87%91%E5%B8%81%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/485277/%E7%89%88%E4%B8%BB%E5%B7%A5%E5%85%B7-%E6%A3%80%E6%9F%A5%E9%87%91%E5%B8%81%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const strJinBiTieRule="https://www.cool18.com/bbs6/index.php?app=forum&act=threadview&tid=14645229"
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
    function cerJinBiTie(){

        var preElement=document.querySelector("body > table:nth-child(4) > tbody > tr:nth-child(2) > td > pre");
        if(!preElement){
            console.log("error retrieving pre element");
            return;
        }
        var nImage=0;
        var nVideo=0;
        var imgElements = preElement.querySelectorAll("img");
        var vidElements = preElement.querySelectorAll("embed");

        if (imgElements) {
            nImage = imgElements.length;
        }

        if (vidElements) {
            nVideo = vidElements.length;
        }
        var title="✡✡🕵️🕵️✡✡已阅✡✡🕵️🕵️✡✡"+"["+nImage+"P"+nVideo+"V"+"]";
        var content="包括未隐藏的，一共: "+nImage+"张照片"+nVideo+"段视频";

        if(nVideo>0){
            var strVideoInfo="";
            if (nVideo === 1) {
                strVideoInfo="视频长度为：";
            } else if (nVideo > 1) {
                strVideoInfo = "视频1长度为：";
                for (var i = 2; i <= nVideo; i++) {
                    strVideoInfo += "\n视频" + i + "长度为：";
                }
            }
            content +="\n"+strVideoInfo;
        }
        var tempMsg="\n金币贴新规讨论中，欢迎大家发表意见：\n"+strJinBiTieRule
        content +="\n"+tempMsg;
        generateReply(title,content);
    }
    function generateReply(title,content){
        var subElement=document.querySelector("#subject");
        var conElement=document.querySelector("#content");
        if(subElement) subElement.value=title; subElement.scrollIntoView();
        if(conElement) conElement.value=content;

    }
    function checkJinBiTie(){
        //检查哪个链接是金币帖
        function checkElementContentBySelector(title,url,selector) {
            var xhr = new XMLHttpRequest();
            var slt2="body > table:nth-child(4) > tbody > tr:nth-child(2) > td > pre"
            xhr.open('GET',url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var responseHTML = xhr.responseText;
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(responseHTML, 'text/html');
                    var element = doc.querySelector(selector);


                    if (element) {
                        var elementContent = element.innerHTML;
                        if(isJinBiTie(elementContent)){
                            console.log(title+"\n" + url+"\n");
                            console.log(elementContent);

                        }else{
                            console.log(elementContent);
                        }
                        //console.log(title+"\n" + elementContent+"\n");
                    } else {
                        /*                         console.log("找不到指定的元素。");
                        var e2 = doc.querySelector(slt2);
                        if(e2){
                            var e2Content = e2.innerHTML;
                            console.log(e2Content);
                        } else{

                        } */

                    }
                }
            };
            xhr.send();
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
        function isJinBiTie(text){
            if(text.indexOf("帖主已设置")!=-1){
                return true;
            }else {
                return false;
            }
        }
        // 测试代码
        var selector = 'body > table:nth-child(4) > tbody > tr:nth-child(2) > td > pre > h3'; // 示例 CSS 选择器


        var items=Array.from(document.querySelectorAll("#d_list > ul > li> a:nth-child(1)"))
        Array.prototype.forEach.call( items, function ( elem ) {
            var url = elem.href
            url=getAbsoluteURL(location.href,url)
            var title=elem.textContent
            checkElementContentBySelector(title,url,selector);
        });

    }
    //Create button
    var zNode = document.createElement ('div');
    zNode.innerHTML = '<button id="myButtonJBT" type="button">'
        + '金币贴</button>';
    zNode.setAttribute ('id', 'myContainerJBT');
    document.body.appendChild (zNode);
    document.getElementById ("myButtonJBT").addEventListener (
        "click", ButtonClickAction, false
    );
    //Button click function
    function ButtonClickAction (zEvent) {
        var curURL=location.href
        if(curURL.indexOf("threadview")===-1){

            checkJinBiTie();
        }else{
            console.log(" cerJinBiTie();")
            cerJinBiTie();
        }

    }
    //Button style
    GM_addStyle ( `
    #myContainerJBT {
        position:               fixed;
        top:                    120px;
        left:                   30px;
        font-size:              10px;
        background:             orange;
        border:                 1px outset black;
        margin:                 3px;
        opacity:                0.5;
        z-index:                9999;
        padding:                2px 2px;
    }
    #myButtonJBT {
        cursor:                 pointer;
    }
    #myContainerJBT p {
        color:                  red;
        background:             white;
    }
` );
})();