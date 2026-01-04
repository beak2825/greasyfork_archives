// ==UserScript==
// @name        自动翻页 - 01bz.info
// @namespace   Violentmonkey Scripts
// @match       http://www.01bz.info/*
// @match       http://www.diyibanzhu6.in/*
// @match       http://www.diyibanzhu5.in/*
// @include     http://www.diyibanzhu*
// @grant       none
// @version     1.011
// @author      -
// @description 2020/2/16 下午3:51:20
// @downloadURL https://update.greasyfork.org/scripts/396502/%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%20-%2001bzinfo.user.js
// @updateURL https://update.greasyfork.org/scripts/396502/%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%20-%2001bzinfo.meta.js
// ==/UserScript==
(
  function(){
    window.isAutoTurnPage = true;
    
    document.querySelector("body > div.container > div:nth-child(4)").innerHTML = document.querySelector("body > div.container > div:nth-child(4)").innerHTML+"<button>自动翻页:true</button>";
    var button = document.querySelector("body > div.container > div:nth-child(4) > button");
    button.onclick = function(){
        window.isAutoTurnPage = window.isAutoTurnPage==true?false:true; 
        document.querySelector("body > div.container > div:nth-child(4) > button").innerText = "自动翻页:"+window.isAutoTurnPage.toString();
    }
    
    $(window).scroll(function(){
　　var scrollTop = $(this).scrollTop();
　　var scrollHeight = $(document).height();
　　var windowHeight = $(this).height();
　　if(window.isAutoTurnPage == true && scrollTop + windowHeight >= scrollHeight && document.querySelector("body > div.container > h1") != null){
    　　//当滚动到底部时,执行此代码框中的代码
　　　　//alert("you are in the bottom");
        var list = document.querySelector("#ChapterView > div.bd > div > div > center");
        var count = list.childElementCount;
        var flag = 0;
        for(var i = 1;i<=count;i++){
            if(list.children[i-1].className == "curr"){
                flag = i;
            }
        }
        if(flag<count){
          document.querySelector("#ChapterView > div.bd > div > div > center > a:nth-child("+(flag+1).toString()+")").click();
        }
        else{
          document.querySelector("body > div.container > div.mod.page-control > div > a.next").click();
        }
　　  }
    });
    
    /*window.changeState = function(){
        
    }*/
  }
)()