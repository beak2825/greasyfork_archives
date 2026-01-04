// ==UserScript==
// @name         yang京东试用
// @icon         https://www.jd.com/favicon.ico
// @namespace    http://tampermonkey.net/bakyang
// @version      10.2
// @description  try to take over the world!
// @author       Welldo_Yang
// @include       *//try.jd.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413018/yang%E4%BA%AC%E4%B8%9C%E8%AF%95%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/413018/yang%E4%BA%AC%E4%B8%9C%E8%AF%95%E7%94%A8.meta.js
// ==/UserScript==



(function() {
    'use strict';

    //试用地址：http://try.jd.com/
var count = 0;
var list =[];
//是否关注店铺？
var followed = true;
//试用数量设置，低于该数量不申请
var sysl = 9;
//试用商品价格设置，低于该价格不申请
var jiage = 30;
var navall =[];
navall  = document.querySelectorAll('#nav-all .box .clearfix li a');
for(var i = 0; i<navall.length; i++) {
navall[i].target="_self";
//console.log(navall[i].target);
}
  GM_setValue('stop','flase','flase');
  GM_setValue('blackList',['贴膜','美白','面膜','墨水','手机壳','钢化','iphone','妇女','妇科','少女','胸罩','文胸','减肥','避孕','流量卡','宠物','狗粮','犬粮','猫粮','网课','课程','万门大学']);
  GM_setValue('whiteList', ['mate','v30','5G','手环','智能','洗碗机','空调','消毒柜','净水','华为','路由器']);


    function inWhiteList(string) {
        return GM_getValue('whiteList').some(function (i) {
            i = i.toLowerCase().trim();
            return i ? (string.toLowerCase().indexOf(i) !== -1) : false;
        });
    }

    function inBlackList(string) {
        return GM_getValue('blackList').some(function (i) {
            i = i.toLowerCase().trim();
            return i ? (string.toLowerCase().indexOf(i) !== -1) : false;
        });
    }

  
var hideNode = document.createElement('li');
hideNode.innerHTML = `
			<li id="ttbar-home"><a href="javascript:void(0)" class="dorpdown" style="">京东试用</a> <button id="startBtn">开始</button> <button id="stopBtn">停止</button></li> `;
var loginOutBtn = document.querySelector('#shortcut-2014 #ttbar-home');
loginOutBtn.parentElement.insertBefore(hideNode, loginOutBtn);
let startBtn = document.getElementById('startBtn')
let stopBtn = document.getElementById('stopBtn')

startBtn.onclick = function(){
if (document.cookie.indexOf('limited=1') != -1) return;
var d = new Date();  
d.setDate(d.getHours() + 23);; //有效期当天 
document.cookie = 'stop=0;expires='+d.toGMTString();//设置cookie 	
window.location.reload();	
}

stopBtn.onclick = function(){
var d = new Date();  
d.setDate(d.getHours() + 23); //有效期当天 
document.cookie = 'stop=1;expires='+d.toGMTString();//设置cookie 	
}

//获取 我要试用 数组
        if (document.querySelector('.root61').innerText.indexOf('try.jd.local') !== -1)  location.replace(location.href)
        var locationHref = document.location.href;
        if(locationHref.indexOf("try.jd.com/activity/getActivityList")>=0){
            // debugger;
           if (locationHref.indexOf("page") == -1) document.location.href = locationHref.replace(/getActivityList/,"getActivityList?page=1");
           var c = setTimeout(function(){
                var nodes = document.querySelectorAll(".items .item");
                for(var i=0;i<nodes.length;i++){
                    var node = nodes[i]; 
                    if(node.className.indexOf("applied")>0){
                        
                    }else{
                        var price = + node.querySelector(".p-price span").innerHTML.replace("￥","");
                        var pname = node.querySelector(".p-name").innerHTML;
                         //console.log(pname)
                        var yang=node.querySelector(".t1").innerHTML.indexOf("\<\/b\>份")-5;
                        var quantity = + node.querySelector(".t1").innerHTML.substr(5,yang);
                        if (inBlackList(pname)){
                             console.log("Black【"+pname.substr(0,16)+"】");
                        }else if((quantity > sysl) && (price > jiage) && (node.attributes["sys_time"].value < node.attributes["end_time"].value)) {
                            list.push(node.attributes["activity_id"].value);
                            console.log("N【"+pname.substr(0,16)+"】（"+node.attributes["activity_id"].value+"）："+quantity+ "份，"+price+"￥"); 
                        }else if (inWhiteList(pname)){
                            list.push(node.attributes["activity_id"].value);
                            console.log("W【"+pname.substr(0,16)+"】（"+node.attributes["activity_id"].value+"）："+quantity+ "份，"+price+"￥"); 
                        }
                    }
                }
                console.log(list.join(";"));
                
                makeOne(0,function(){
                    // debugger;
                   // var mywin=window.open("about:blank","mywindow"); 
                    if (locationHref.indexOf("page") !== -1) var currentPage = + locationHref.match(/page=(\d*)/)[1];
                    var d = document.querySelector(".fp-text i");
                    var maxPage = + d.innerHTML;
                    if(currentPage> maxPage){
                       console.log("全部完成了");   
                    }else{
                        currentPage ++;
                        var url = locationHref.replace(/page=\d*/,function(a,b,c){
                            return 'page=' + currentPage;
                        });
                        console.log(url);
                        document.location.href = url;
                    }
                   console.log('0stop=' + document.cookie.indexOf('stop=1'));
                });
             },3000);
   }
   if(locationHref.match(/http[s]?:\/\/try.jd.com\/[0-9-]{3,15}.html/)){
      console.log('2stop=' + document.cookie.indexOf('stop=1'));
      $(document).ready(function(){   
        if (document.cookie.indexOf('stop=1') != -1) return;
        //点击我要试用
        setTimeout(function() {
        var btn = $(".btn-wrap>.app-btn.btn-application");
      if  (btn.length != 0) {
           btn.click();
          //followed = true;
       }
          followed && setTimeout(function() {
          //setTimeout(function() {
            var follow = $(".btn>.y");
            if (follow.length != 0)  follow.click();
         //取消店铺关注
         var follows = $(".btn-def.follow-shop.J-follow-shop");
         console.log("试用申请成功，准备取消店铺关注");
         setTimeout(function() {
           if (document.querySelector('.btn-def.follow-shop.J-follow-shop').innerText.indexOf('已关注') !== -1) follows.click();
         }, 1500);
         //取消店铺关注
          }, 1500);

 
            setTimeout(function() {
                   var tiptit=$(".tip-tit");
                   if ((tiptit.length != 0)&&(document.querySelector('.tip-tit').innerText.indexOf('申请成功') !== -1))
		               {
                         showMsg("试用申请成功，准备关闭网页");
		  	                 window.opener = null; 
		  	                 window.open(' ', '_self', ' '); 
			                   window.close(); 
                         GM_setValue('stop','flase','flase');
                   }
              else if ((tiptit.length != 0)&&(document.querySelector('.tip-tit').innerText.indexOf('种草官') !== -1))
		               {
                         showMsg("需要种草官级别，准备关闭网页");
		  	                 window.opener = null; 
		  	                 window.open(' ', '_self', ' '); 
			                   window.close(); 
                         GM_setValue('stop','flase','flase');
                   }
                    else if ((tiptit.length != 0)&&(document.querySelector('.tip-tit').innerText.indexOf('超过上限') !== -1)){
                         var d = new Date();  
                         d.setHours(d.getHours() + 23); //有效期当天，隔天恢复  
                         //d.setDate(d.getDate() + 1); //有效期当天 
                         document.cookie = 'stop=1;expires='+d.toGMTString();//设置cookie  
                         document.cookie = 'limited=1;expires='+d.toGMTString();//设置cookie 
                         console.log("您的申请次数已超过上限，准备关闭网页");
                         window.opener = null; 
		  	                 window.open(' ', '_self', ' '); 
                         window.close(); 
                         //GM_setValue('stop',flase');
                  }                              
              }, 4000);
    }, 2000);     
    
     //关闭提示 
     $(".ui-dialog-close").click;
   
   
    });       
  }
    function makeOne(index, cb){
      if (document.cookie.indexOf('stop=1') != -1) {
         console.log("停止申请" + document.cookie.indexOf('stop=1')); 
         return;
      }          
    
     //var mywin=window.open("about:blank","mywindow"); 
     showMsg( "正在申请" + (index+1)+"/"+ list.length);
     //console.log('正在申请' + index);
    if(index>=list.length){
        console.log("done");
        if(cb){
            cb();
        }
        return;
    }
    var id = list[index];
      //if (mywin){
      console.log('正在申请' + index +'：' +id);
     // mywin.target = "mywindow";
     // mywin.location.href="http://try.jd.com/"+id+".html";
     // console.log('正在申请_mywin' + index +'：' + id +'：' + mywin.location.href);
     // }
      if (!GM_getValue('stop','flase'))  console.log('正在1' + GM_getValue('stop','flase'));
      
       newWin("http://try.jd.com/"+id+".html","mywindow")
      console.log('正在2' + GM_getValue('stop','flase'));
      $(document).ready(function(){ 
      setTimeout(function(){
            makeOne(index+1, cb);
        },8500);
     });
          
   }
  
function showMsg(msg) {
	let style=`
		 position:fixed;
		 background-color:black;
		 top:100px;
		 left:50%;
		 margin-left:-80px;
		 width:160px;
		 color:#FFF;
		 font-size:14px;
         text-align:center;
         z-index:10000;
		 padding:12px;
		 border-radius:4px;
	 `
 
	 let div = document.createElement('div')
	 div.innerHTML = `<div style="${style}" id="show_tips">
		 ${msg}
	 </div>`
	 document.body.appendChild(div)
 
	 setTimeout(()=>{
		 let el = document.getElementById('show_tips')
		 el&&el.remove&&el.remove()
	   }, 5000);
   }
function newWin(url, id) {
        if (document.cookie.indexOf('stop=1') != -1) return;
        //if (GM_getValue('stop','flase')) return;
              let a = document.createElement('a');
              a.setAttribute('href',url);
              a.setAttribute('target',id);
              a.setAttribute('id',id);
              // 防止反复添加
              if(!document.getElementById(id)) {                     
                  document.body.appendChild(a);
                  GM_setValue('stop','flase','true');
              }
               a.click();
         }

})();
