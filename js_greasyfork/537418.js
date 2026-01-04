// ==UserScript==
// @name         点击删除
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在页面加载一个悬浮窗，双击后可以任意消除网页内的元素，包括广告等，不会影响网页的原本功能。
// @author       Huangfu
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537418/%E7%82%B9%E5%87%BB%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/537418/%E7%82%B9%E5%87%BB%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==
(function(){
  'use strict';
    var deleteMode = 0;
    if(self != top) return;//不要再iframe里再加载一次
    var new_element_N=document.createElement("style"); 
    new_element_N.innerHTML = '#drager {' +
        '   position: fixed;' +
        '   width: 35px;' +
        '   height: 35px;' +
        '   background-color: rgba(0, 0, 0, 0.2);' +
        '   z-index: 10000;' +
        '   cursor: pointer;' +
        '   top: 0px;' +
        '   left: 0px;' +
        '   border-radius: 30%;' +
        '   padding: 6px;' +
        ' }' +
        ' ' +
        ' #drager>div {' +
        '   border-radius: 50%;' +
        '   width: 100%;' +
        '   height: 100%;' +
        '   background-color: rgba(0, 0, 0, 0.3);' +
        '   transition: all 0.2s;' +
        '  -webkit-transition: all 0.2s;' +
        '  -moz-transition: all 0.2s;' +
        '  -o-transition: all 0.2s;' +
        ' }' +
        ' #drager:hover>div{' +
        '   background-color: rgba(0, 0, 0, 0.6);' +
        ' } '+
        '.chosenBorder{border:1px solid #00F;} ';
    document.body.appendChild(new_element_N);
    new_element_N=document.createElement('div'); 
    new_element_N.setAttribute("id","drager");
    new_element_N.style.top="80px";
    new_element_N.style.left = (document.body.clientWidth-45)+"px";
    new_element_N.innerHTML = ' <div></div>' ;
    document.body.appendChild(new_element_N);
    // 
    var posX;
    var posY;   
    var screenWidth =document.documentElement.clientWidth;
    var screenHeight = document.documentElement.clientHeight;  
    var fdiv = document.getElementById("drager"); 
    fdiv.onmousedown=function(e)
    { 
      screenWidth =document.documentElement.clientWidth;
      screenHeight = document.documentElement.clientHeight;  
      if(!e){ e = window.event; } //IE
      posX = e.clientX - parseInt(fdiv.style.left);
      posY = e.clientY - parseInt(fdiv.style.top);
      document.onmousemove = mousemove;      
    }
    document.onmouseup = function()//释放时自动贴到最近位置
    {
      document.onmousemove = null;
      if((parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2)<=(screenHeight/2)){//在上半部分
        if((parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)<=(screenWidth/2)){//在左半部分
          if((parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2)<=(parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)){//靠近上方
            fdiv.style.top="0px";
          }else{//靠近左边
            fdiv.style.left="0px";
          }
        }else{//在右半部分
          if((parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2)<=(screenWidth-(parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)) ){//靠近上方
            fdiv.style.top="0px";
          }else{//靠近右边
            fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
          } 
        }
      }else{ //下半部分
         if((parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)<=(screenWidth/2)){//在左半部分
          if( (screenHeight-(parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2))<=(parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)){//靠近下方
            fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
          }else{//靠近左边
            fdiv.style.left="0px";
          }
        }else{//在右半部分
          if( (screenHeight-(parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2))<=(screenWidth-(parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)) ){//靠近上方
            fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
          }else{//靠近右边
            fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
          } 
        }
      } 
    }
    function mousemove(ev)
    {
      if(ev==null){ ev = window.event;}//IE
      if((ev.clientY - posY)<=0){//超过顶部
         fdiv.style.top="0px";
      }else if((ev.clientY - posY) >(screenHeight-parseInt(fdiv.clientHeight))){//超过底部
        fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
      }else{
        fdiv.style.top = (ev.clientY - posY) + "px";
      }
        
       if((ev.clientX- posX)<=0){//超过左边
         fdiv.style.left="0px";
      }else if((ev.clientX - posX) >(screenWidth-parseInt(fdiv.clientWidth))){//超过右边
        fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
      }else{
        fdiv.style.left = (ev.clientX - posX) + "px";
      }
      // console.log( posX +" "+ fdiv.style.left);
        
    }
    window.onload = window.onresize = function() { //窗口大小改变事件
      screenWidth =document.documentElement.clientWidth;
      screenHeight = document.documentElement.clientHeight;  
      if( (parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight))>screenHeight){//窗口改变适应超出的部分
         fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
      }  
      if( (parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth))>screenWidth){//窗口改变适应超出的部分
         fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
      }  
      document.onmouseup.apply()
    };
    fdiv.addEventListener('touchstart', fdiv.onmousedown, false);  
    fdiv.addEventListener('touchmove', function(event) {
            // 如果这个元素的位置内只有一个手指的话
            if (event.targetTouches.length == 1) {
          　　　　 event.preventDefault();// 阻止浏览器默认事件，重要 
              var touch = event.targetTouches[0]; 
              if((touch.pageY)<=0){//超过顶部
                fdiv.style.top="0px";
              }else if(touch.pageY>(screenHeight-parseInt(fdiv.clientHeight))){//超过底部
                fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
              }else{
                fdiv.style.top = (touch.pageY-parseInt(fdiv.clientHeight)/2) + "px";
              }
                
              if(touch.pageX<=0){//超过左边
                fdiv.style.left="0px";
              }else if( touch.pageX >(screenWidth-parseInt(fdiv.clientWidth))){//超过右边
                fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
              }else{
                fdiv.style.left = (touch.pageX-parseInt(fdiv.clientWidth)/2) + "px";
              }
            }
          }, false); 
    fdiv.addEventListener('touchend', document.onmouseup , false);
   if (typeof(jQuery) == 'undefined'||$("drager").on==undefined) {
        let script = document.createElement('script');
        script.setAttribute('src', 'https://code.jquery.com/jquery-3.1.1.min.js');
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    fdiv.ondblclick=function(){//双击事件可能在手机端浏览器会与网页缩放事件冲突
      if(deleteMode==0){//进入删除模式
        deleteMode = 1;
        //加边框知道选中了哪个
        $("*").hover(
            function(event){
                if(deleteMode==1){
                  if(event.currentTarget.id=="drager"||event.currentTarget.parentNode.id=="drager") return false;
                  $(this).addClass("chosenBorder");
                  return false;
                }
            },
            function(){
              if(deleteMode==1){
                $(this).removeClass("chosenBorder");
              }
            }
        );
        //点击隐藏，使用on方法，保留原来的事件
        $("*").on("click",function (event){ 
                if(event.currentTarget.id=="drager"||event.currentTarget.parentNode.id=="drager") return false;
                $(this).hide();
                return false;
        }); 
        //单独操作iframe里的广告
        $("iframe").each(function(){
          //console.log($(this).attr("id"));
          $(window.frames[$(this).attr("id")].document).find("*").on("click",function (event){
                if(event.currentTarget.id=="drager"||event.currentTarget.parentNode.id=="drager") return false;
                $(this).hide();
                return false;
          }); 
        })
      }else{//删除结束
            deleteMode = 0;
            //去掉点击事件
            $("*").off("click");
            $(window.frames[$(this).attr("id")].document).find("*").off("click");
      }
    }
    
})();