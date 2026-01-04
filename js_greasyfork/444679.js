// ==UserScript==
// @name        steam csgo社区商店 页面跳转 - steamcommunity.com
// @namespace   Violentmonkey Scripts
// @match       https://steamcommunity.com/market/listings/730/*
// @grant       none
// @version     1.0
// @author      -
// @description 2022/5/8 16:10:20
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/444679/steam%20csgo%E7%A4%BE%E5%8C%BA%E5%95%86%E5%BA%97%20%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%20-%20steamcommunitycom.user.js
// @updateURL https://update.greasyfork.org/scripts/444679/steam%20csgo%E7%A4%BE%E5%8C%BA%E5%95%86%E5%BA%97%20%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%20-%20steamcommunitycom.meta.js
// ==/UserScript==
(function() {
  
      var style = document.createElement("style");
    style.type = "text/css";
　　style.appendChild(document.createTextNode(".myBtnStyle{display:inline-block;background-color:#799905; font-size:10px;color:#FFF;margin-left:15px;padding:2px;border-radius:3px;cursor:pointer;}"));
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
  
  let appendSpan = document.createElement("SPAN");
  appendSpan.innerHTML = "<input id='appendSpanInput' /><div id='gotoPage' class='myBtnStyle'>跳转</div>"
  
  document.getElementsByClassName('market_paging_summary')[0].appendChild(appendSpan) 
  
    document.getElementById("gotoPage").addEventListener("click",function(event){
    let v = document.getElementById("appendSpanInput").value + "0";

      fetch(window.location.href +'/render/?query=&start='+v+'&count=10&country=CN&language=schinese&currency=23',{
    method:'GET',
    // headers:Headers,
    mode:'cors'

}).then(Response=> Response.json()).then(
    data => {
      if(data == null){
        alert("请求次数过多或页数输入错误，请稍后再试！")
      }
      else{
        document.getElementById("searchResultsRows").innerHTML = data['results_html'];
      }
      

    }
);


    
    
  })
        })();