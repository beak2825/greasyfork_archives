// ==UserScript==
// @name         OnlyTrials Latest
// @version      0.1.1
// @description  Gets free trials for OnlyFans
// @author       Mandogy
// @match        https://redditsearch.io/*
// @match        https://onlyfans/*
// @grant        https://redditsearch.io/*
// @match        https://onlyfans.com/
// @namespace https://greasyfork.org/users/771507
// @downloadURL https://update.greasyfork.org/scripts/426397/OnlyTrials%20Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/426397/OnlyTrials%20Latest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var name = window.location.hostname;
    console.log(name);
    if(name.includes("onlyfan") == true)
   {
    setTimeout(function(){
     var help = document.getElementsByClassName("b-recommended__wrapper");
     help = help[0];
     help.outerHTML = '<button class="b-recommended__wrapper" id="btn" onclick="test2()" style=\'box-shadow: 0px 1px 0px 0px #f0f7fa; background:linear-gradient(to bottom, #33bdef 5%, #019ad2 100%); background-color:#33bdef; border-radius:6px; border:1px solid #057fd0; display:inline-block; cursor:pointer; color:#ffffff; font-family:Arial; font-size:16px; font-weight:bold; padding:11px 16px; text-decoration:none; text-shadow:0px -1px 0px #5b6178;\'>Click me to get free OnlyFans</button>';
     console.log("test");
     document.getElementById('btn').onclick = function() {
      var help = document.getElementsByClassName("b-recommended__wrapper");
      help = help[0];
      help.outerHTML = '<iframe src="https://redditsearch.io/?term=https://onlyfans.com/action/trial/&dataviz=false&aggs=false&subreddits=&searchtype=posts,comments&search=true&size=100"></iframe>'
     }
    },6000);
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventer(messageEvent,function(e) {
        console.log(e.data);
        var test = e.data;
        var result = Object.values(test);
        var text = document.getElementsByClassName("b-post__text");
        text = text[0];
        text = text.children[0].children[0].children[0];
        text.outerHTML = '<a class="link_changer" href="https://onlyfans.com/action/trial/u5cmrnp0rkf1fnclq9l6gua3xkhg7oue">New Link</a></p>'
        text = document.getElementsByClassName("link_changer");
        text = text[0];
        var i;
        var num = 0;
        var other;
        function myLoop(){
        setTimeout(function(){
          console.log(result[num]);
          text.innerText = result[num];
          text.href = result[num];
          num++;
          text.click();
            setTimeout(function(){
            if(document.getElementsByClassName("g-btn m-transparent-bg").length > 1){
           document.getElementsByClassName("g-btn m-transparent-bg")[1].click();
            }else{
                document.getElementsByClassName("g-btn m-transparent-bg")[0].click();
            }
          if(num < result.length){
              myLoop();
          }
           },1000);
         },10000);
        }
        myLoop();
    },false);
}else{
    setTimeout(function(){
       var links = []
       var temp = document.getElementsByClassName("title");
       for(var i = 0; i < temp.length; i++){
        var text = temp[i].innerText;
        var start = text.indexOf("https://onlyfans.com/action/")
        text = text.substring(start);
        text = text.substring(0, 66);
        if(text.includes("/action/trial/") == true){
          links.push(text);
          console.log(text);
        }
       };
       parent.postMessage(links,"*");
   },2000);
}
})();