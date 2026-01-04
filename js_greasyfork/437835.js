// ==UserScript==
// @name        编玩边学退出账号悬浮按钮
// @namespace   Violentmonkey Scripts
// @match       *://hz.edu.codepku.com/
// @match       *://hz.edu.codepku.com/online/*
// @match       *://hz.edu.codepku.com/offline*
// @match       *://hz.edu.codepku.com/my_works
// @match       *://hz.edu.codepku.com/study_ground/presentation
// @match       *://hz.edu.codepku.com/message_notice
// @grant       none
// @version     1.01
// @author      澈云
// @description  问题反馈位置： https://bk.cheyunya.com/软件推荐/137.html

// @downloadURL https://update.greasyfork.org/scripts/437835/%E7%BC%96%E7%8E%A9%E8%BE%B9%E5%AD%A6%E9%80%80%E5%87%BA%E8%B4%A6%E5%8F%B7%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/437835/%E7%BC%96%E7%8E%A9%E8%BE%B9%E5%AD%A6%E9%80%80%E5%87%BA%E8%B4%A6%E5%8F%B7%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

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
    '   background-color: rgba(240,255,255, 0.3);' +
    '   transition: all 0.2s;' +
    '  -webkit-transition: all 0.2s;' +
    '  -moz-transition: all 0.2s;' +
    '  -o-transition: all 0.2s;' +
    ' }' +
    ' #drager:hover>div{' +
    '   background-color: rgba(0, 0, 0, 0.6);' +
    ' } ';
 
  document.body.appendChild(new_element_N);
  new_element_N=document.createElement('div'); 
  new_element_N.setAttribute("id","drager");
  new_element_N.style.top="500px";//初始放在屏幕右
  new_element_N.style.left="400px";
  new_element_N.innerHTML = ' <div></div>' ;
  document.body.appendChild(new_element_N);
  // 
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
    fdiv.ondblclick=function(){//双击事件可能在手机端浏览器会与网页缩放事件冲突
    k_exit();
    }
function k_exit(){
  if(window.confirm('你是否确定退出登录? '))
  {
      if(window.confirm('请先确定作品已保存，退出登录后，作品则无法保存！'))
      {
        window.location.replace("https://hz.edu.codepku.com/admin/login?redirect_uri=https://hz.edu.codepku.com");
          return true;
      }
  }else
  {
    return false;
  }
  
     /*like=window.confirm("是否确定退出登录?");
　　if(like==true)
　　　　document.write("谢谢你的夸奖");//确定
　　else
　　　　document.write("希望得到你的夸奖");//取消*/
}




