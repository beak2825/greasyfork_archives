// ==UserScript==
// @name         过图自定义
// @namespace    https://greasyfork.org/zh-CN/scripts/381167
// @version      0.0.08
// @description  给手机网站增加一个可以删除图片的按钮
// @homepage     https://greasyfork.org/zh-CN/scripts/381167
// @author       unmht001
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381167/%E8%BF%87%E5%9B%BE%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/381167/%E8%BF%87%E5%9B%BE%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==
// 
var __clearflag=false;
var __clearhistory=[];
function clearzindex(c){
  if (__clearflag){
    console.log("clear z-index > 100.");
    Array.from(top.document.querySelectorAll('body *')).map(function (x){
      ((+window.getComputedStyle(x).zIndex || 0) >100) && (x.id != "cleartooldiv")?(x.style.cssText+=";z-index:-1;display:none"):"";
    });
    setTimeout(function (){clearzindex(c);},c)    
  }else{
    console.log("stop clear z-index");
  } 
}




function addbtn(){

  
  var div =top.document.createElement("div");
  div.id="cleartooldiv";
  div.style.cssText+=";position:fixed;z-index:2147483647;right:0px";
  var b1=top.document.createElement("button");
  b1.innerText = "弹出文字";  
  b1.onclick=function () {
    alert(top.document.body.innerText);
    window.scrollTo(0,top.document.body.clientHeight)
  };
  div.appendChild(b1);

  var b2=top.document.createElement("button");
  b2.innerText = "关闭图片";
  b2.onclick=function () {
    Array.from(top.document.getElementsByTagName("img")).map(
      function (x){x.style.cssText+=";display:none;width:0px;height:0px";}
    );
  };
  div.appendChild(b2);  
  
  var b3=top.document.createElement("button");
  b3.innerText = __clearflag?"正在清理":"清理上层";
  b3.onclick=function () {
    __clearflag = !__clearflag;
    this.innerText=__clearflag?"正在清理":"清理上层";
    if (__clearflag){
      clearzindex(1000);
    }
  };

  div.appendChild(b3);
  var b4=top.document.createElement("button");
  b4.innerText = "还原消除";

  b4.onclick=function () {
    top.document.execCommand("Undo");
  }

  div.appendChild(b4);
  var b5=top.document.createElement("button");
  b5.innerText = "上层消除";
  
  b5.onclick=function () {
    var _b5=[];
    var _z=0
    Array.from(top.document.querySelectorAll('body *')).map( function (x){
      var _x =(+window.getComputedStyle(x).zIndex || 0)
      if (_x==_z){
        x.id=="cleartooldiv"?"":(_b5.push(x));
        
      }else if(_x >_z){
        if (x.id!="cleartooldiv"){
          _b5=[];            
          _b5.push(x);
          _z=_x;
        
        }        
      }      
    });
    
    if (_z>0){
      _b5.map(function (x){      
        x.style.cssText+=";z-index:-1;display:none";
      });

      __clearhistory.push(_z);  
      console.log(_z,_b5,_b5.length);
    }else{
      console.log(_z,"nothing to clear");
    }
  
  }

  div.appendChild(b5);
  
  top.document.body.insertBefore(div, top.document.body.firstElementChild);  
  clearzindex(1000);
  

}
addbtn();