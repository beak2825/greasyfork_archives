// ==UserScript==
// @name         Specific task
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Hides columns
// @author       You
// @match        *://codereview.appspot.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28169/Specific%20task.user.js
// @updateURL https://update.greasyfork.org/scripts/28169/Specific%20task.meta.js
// ==/UserScript==

function highlight(){
  if(!busy){
    busy=true;
    news=document.querySelectorAll("[id^='newcode']");
    olds=document.querySelectorAll("[id^='oldcode']");
    if(toggle==0){
      toggle=1;
      //helpbox.style.top="0";
      message.innerHTML="Select: NEW";
      showhide(news,1);
      showhide(olds,0);
    }else if(toggle==1){
      toggle=2;
      //helpbox.style.top="0";
      message.innerHTML="Select: OLD";
      showhide(news,0);
      showhide(olds,1);
    }else if(toggle==2){
      toggle=0;
      message.innerHTML="Select: ALL";
      showhide(news,1);
      showhide(olds,1);
      //helpbox.style.top="10px";
    }
    busy=false;
  }
}

function showhide(x,which){
  var i, templength=x.length;
  if(which){
    for(i=0;i<templength;i++){
      x[i].classList.remove("noselectAXC");
      //x[i].style.visibility="visible";
    }
  }else{
    for(i=0;i<templength;i++){
      x[i].classList.add("noselectAXC");
      //x[i].style.visibility="hidden";
    }
  }
}

if(document.getElementById("thecode")){
var helpbox=document.createElement("div"), message=document.createElement("div"), toggle=0, busy=false,
y = document.createElement("style");
y.innerHTML=".x_src{user-select:none; cursor:pointer; display:flex; justify-content:center; align-items:center; position:fixed; top:-30px; left:50%; padding:4px 0; height:auto; width:200px; transform:translateX(-50%); background-color:#eeeeec; border-style:solid; border-width:0 1px 1px; border-color:#d3d3d3; border-radius:0 0 10px 10px; -webkit-transition:top 1s; transition:top 1s; box-sizing:border-box;} .x_rfa{display:flex; color:gray; align-items:center; text-align:center; height:auto; width:auto;} .noselectAXC{opacity:0.4; -webkit-user-select:none; -moz-user-select:none; user-select:none;}";
document.body.appendChild(y);
helpbox.className="x_src";
message.className="x_rfa";
message.innerHTML="Select: ALL";
helpbox.onclick=function(){highlight();};
helpbox.appendChild(message);
document.body.appendChild(helpbox);
window.setTimeout(function(){helpbox.style.top="0";},1000);
}

