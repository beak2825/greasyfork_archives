// ==UserScript==
// @name         find highlight
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  find next diff for compare ite
// @author       ke rui
// @match        https://neil.fraser.name/software/diff_match_patch/demos/diff.html
// @grant        n
//
// @downloadURL https://update.greasyfork.org/scripts/381098/find%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/381098/find%20highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var button = document.createElement("input"); //创建一个input对象（提示框按钮）
    button.setAttribute("type", "button");
    button.setAttribute("id","findBtn");
    button.setAttribute("value", "next");
    button.style.width = "60px";
    button.style.align = "center";
    button.style.marginLeft = "250px";
    button.style.marginBottom = "10px";
    //button.style.background = "#80DCA9";
    button.style.border = "1px solid #000000";//52
    //button.style.color = "white";
    button.style.position = "fixed";
    button.style.right = "5px";
    var j = 0;
    var oriBc = ""
    var preH = 0;
    document.getElementsByTagName("P")[0].appendChild(button);
    document.getElementById("findBtn").onclick = function(){

        var aElements=document.getElementById("outputdiv").childNodes;
        var aEle=[];
        var currScroH = window.scrollY;
        for(var i=0;i<aElements.length-1;i++)
        {
            //alert(aElements[i].getAttribute("style"))
            if(aElements[i].getAttribute("style") !== null){
                aEle.push( aElements[i]);
            }
        }
                if (j !==0){
            aEle[j-1].style.background = oriBc;
            }
        //alert(aEle[j].offsetTop);
        if (j == aEle.length ){
            alert("We’ve finished searching the document")
          	j = 0;
            window.scrollTo(0, 0);
        }else{
         while (aEle[j].offsetTop < currScroH){
             j +=1
                }
                if (aEle[j].offsetTop-preH > window.innerHeight){
                window.scrollTo(0, aEle[j].offsetTop);
                preH = aEle[j].offsetTop
            }
            oriBc = aEle[j].style.background;
            aEle[j].style.backgroundColor = "yellow";
            j +=1
        }
    }
    function getScrollTop()
    {
        var scrollTop=0;
        if(document.documentElement&&document.documentElement.scrollTop)
        {
            scrollTop=document.documentElement.scrollTop;
        }
        else if(document.body)
        {
            scrollTop=document.body.scrollTop;
        }
        return scrollTop;
    }



    // Your code here...
})();