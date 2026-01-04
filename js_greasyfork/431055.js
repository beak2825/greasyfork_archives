// ==UserScript==
// @name         百词斩爱阅读自动展开翻译
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  百词斩爱阅读会员自动展开翻译
// @author       XY
// @match       http://stool.baicizhan.com/react_reading/reading/article/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431055/%E7%99%BE%E8%AF%8D%E6%96%A9%E7%88%B1%E9%98%85%E8%AF%BB%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/431055/%E7%99%BE%E8%AF%8D%E6%96%A9%E7%88%B1%E9%98%85%E8%AF%BB%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

document.onkeydown=function(event){

var e = event || window.event || arguments.callee.caller.arguments[0];

   if(e && e.keyCode==32){ // 按 空格
    e.preventDefault();
   document.getElementById("under_bar_audio").click();
   }

    if(e && e.keyCode==37){ // 按 Left
    document.getElementsByClassName("app-javascript-packs-styles-reading__article_under_bar_div__1Ojgz")[1].click();
    }

   if(e && e.keyCode==39){ // 按 Right
    document.getElementsByClassName("app-javascript-packs-styles-reading__article_under_bar_div__1Ojgz")[3].click();
   }
}


var scrollFunc = function (e) {
    e = e || window.event;
var oldOne=document.getElementById("shield");
if(oldOne!=null) oldOne.parentNode.removeChild(oldOne);
   }
   //给页面绑定滑轮滚动事件
   if (document.addEventListener) {//firefox
    document.addEventListener('DOMMouseScroll', scrollFunc, false);
   }
   //滚动滑轮触发scrollFunc方法 //ie 谷歌
   window.onmousewheel = document.onmousewheel = scrollFunc;


function ch(c){
var audio = new Audio(c);
audio.play();
 }


window.setTimeout(function() {


var oldOne=document.getElementById("shield");
if(oldOne!=null) oldOne.parentNode.removeChild(oldOne);
window.alert = function(a,b,c,d,pa,pt,x,y)
{

	var shield = document.createElement("DIV");
var oldOne=document.getElementById("shield");
if(oldOne!=null) oldOne.parentNode.removeChild(oldOne);
	shield.id = "shield";
	shield.style.position = "absolute";
    shield.style.borderRadius="10px";
	//shield.style.left = x-30+"px";
    shield.style.left = 5+"px";
	shield.style.top = y+"px";
	shield.style.width = "width:fit-content";
	shield.style.height = "width:fit-content";
	shield.style.textAlign = "left";
	shield.style.zIndex = "10000";
shield.style.paddingLeft="10px";
shield.style.paddingRight="10px";
//shield.style.padding="10px";
shield.style.margin = "10px";
	shield.style.background = "#333";
shield.style.color="#fff";
shield.onclick = function (e) {
e.stopPropagation();//阻止事件冒泡
}
shield.onblur=function(){ console.log("?"); };
    var strHtml;
	if(!d) d="";
if(null==pa) {
    strHtml = "<div id=\"topTri\"; style=\"border-style: solid;  display: none; border-width: 0px 10px 10px 10px; border-color: transparent transparent #333 transparent; width: 0px; height: 0px;   position:relative; top:-10px; left:10px;  \" ></div>  <div style=\"font-size: 20pt; font-weight:bold;\">"+a+"</div> <a> <div style=\"color:#bbb\";  id=\"pnc\" tabindex=\"0\"  onclick=ch(\""+c+"\")>"+d+"</div></a> <div>"+b+"</div><div id=\"botTri\" style=\"border-style: solid; border-width: 10px 10px 0px 10px; border-color: #333 transparent transparent transparent; width: 0px; height: 0px;   position:relative; top:10px; left:10px;  \" ></div>";
}else {
   strHtml = "<div id=\"topTri\"; style=\"border-style: solid;  display: none; border-width: 0px 10px 10px 10px; border-color: transparent transparent #333 transparent; width: 0px; height: 0px;   position:relative; top:-10px; left:10px;  \" ></div>  <div style=\"font-size: 20pt; font-weight:bold;\">"+a+"</div> <a> <div style=\"color:#bbb\";  id=\"pnc\" tabindex=\"0\"  onclick=ch(\""+c+"\")>"+d+"</div></a> <div>"+b+"</div><br><div style=\"font-size: 16pt;\">"+pa+"</div> <div>"+pt+"</div><div id=\"botTri\" style=\"border-style: solid; border-width: 10px 10px 0px 10px; border-color: #333 transparent transparent transparent; width: 0px; height: 0px;   position:relative; top:10px; left:10px;  \" ></div>";
}
    shield.innerHTML = strHtml;
	document.body.appendChild(shield);
  if((parseInt(shield.style.left)+shield.offsetWidth-30)>x){
      document.getElementById("topTri").style.left=x-25+"px";
      document.getElementById("botTri").style.left=x-25+"px";
     console.log("11");
     }else if(shield.offsetWidth+x<1100){
         shield.style.left = x-30+"px";
}else if(shield.offsetWidth/2+x<1100){
         shield.style.left = x-shield.offsetWidth/2-30+"px";
         document.getElementById("topTri").style.left=shield.offsetWidth/2+20+"px";
         document.getElementById("botTri").style.left=shield.offsetWidth/2+20+"px";
    console.log("111");
}else {
         shield.style.left = x-shield.offsetWidth+50+"px";
         document.getElementById("topTri").style.left=x-(parseInt(shield.style.left))-20+"px";
         document.getElementById("botTri").style.left=x-(parseInt(shield.style.left))-20+"px";
    console.log("110");
}




//      var oldLeft=shield.style.left;
//    while(1){
//console.log("111111111111111111111111111111111111111");
//        oldLeft=shield.style.left;
//         var oldHeight=shield.offsetHeight;
//console.log("oldHeight"+oldHeight);
//        shield.style.left = (parseInt(shield.style.left)-50)+"px";
//if(shield.offsetHeight==oldHeight){
//console.log("newHeight"+shield.offsetHeight);
//    console.log("00000000000000000000000000");
//    break;
// }
//}
//    if(parseInt(shield.style.left+shield.style.width)>1000){
//	shield.style.left = (parseInt(shield.style.left)-100)+"px";
//	document.getElementById("topTri").style.left="110px";
//	document.getElementById("botTri").style.left="110px";
//}


shield.style.top = (parseInt(shield.style.top)-shield.offsetHeight-15)+"px";
if(parseInt(shield.style.top)<0){
	shield.style.top = (parseInt(shield.style.top)+shield.offsetHeight+45)+"px";
	document.getElementById("topTri").style.display="block";
	document.getElementById("botTri").style.display="none";
    shield.style.paddingBottom="10px";
}



//shield.style.top = (y+20)+"px";
//document.getElementById("pnc").click();

}






var span = document.getElementsByClassName("span app-javascript-packs-styles-reading__article_span__2Qq_h");

for(var index = 0; index< span.length; ++ index){
 span [index] .addEventListener('click', function(e){

e.stopPropagation();//阻止事件冒泡
if(document.getElementById("app-javascript-packs-styles-base__circular_progress_container__3TPM0"))
{
document.getElementById("under_bar_audio").click();
}
ch(this.getAttribute("audio_src"));
alert(this.getAttribute("word"),this.getAttribute("trans").replace(/\n|\r/g, '<br/>'),this.getAttribute("audio_src"),this.getAttribute("pnc"),this.getAttribute("porigin"),this.getAttribute("ptrans"),this.getBoundingClientRect ( ).left,this.getBoundingClientRect ( ).top);
}); }
document.onclick = function () {
var oldOne=document.getElementById("shield");
if(oldOne!=null) {
//console.log("?");
oldOne.parentNode.removeChild(oldOne);

}
}

 function ch(c){
var audio = new Audio(c);
audio.play();
 }
 ch("");
console.log("\n\n function ch(c){ \n var audio = new Audio(c);  \n  audio.play(); \n }\n\n\n\n   document.getElementById(\"wrapper\").style.backgroundColor= \"black\";  document.getElementById(\"wrapper\").style.color= \"#000\";\n\n\n\n\n\n");

    document.getElementsByClassName("app-javascript-packs-styles-reading__article_trans_div__3yfaD")[0].style.display="none";


document.getElementById("trans_para_0").style.display="block";
document.getElementById("trans_para_1").style.display="block";
document.getElementById("trans_para_2").style.display="block";
document.getElementById("trans_para_3").style.display="block";
document.getElementById("trans_para_4").style.display="block";
document.getElementById("trans_para_5").style.display="block";
document.getElementById("trans_para_6").style.display="block";
document.getElementById("trans_para_7").style.display="block";
document.getElementById("trans_para_8").style.display="block";
document.getElementById("trans_para_9").style.display="block";
document.getElementById("trans_para_10").style.display="block";
document.getElementById("trans_para_11").style.display="block";
document.getElementById("trans_para_12").style.display="block";
document.getElementById("trans_para_13").style.display="block";
document.getElementById("trans_para_14").style.display="block";
document.getElementById("trans_para_15").style.display="block";
document.getElementById("trans_para_16").style.display="block";
document.getElementById("trans_para_17").style.display="block";
document.getElementById("trans_para_18").style.display="block";
document.getElementById("trans_para_19").style.display="block";
document.getElementById("trans_para_20").style.display="block";
document.getElementById("trans_para_21").style.display="block";
document.getElementById("trans_para_22").style.display="block";
document.getElementById("trans_para_23").style.display="block";
document.getElementById("trans_para_24").style.display="block";
document.getElementById("trans_para_25").style.display="block";
document.getElementById("trans_para_26").style.display="block";
document.getElementById("trans_para_27").style.display="block";
document.getElementById("trans_para_28").style.display="block";
document.getElementById("trans_para_29").style.display="block";
document.getElementById("trans_para_30").style.display="block";
document.getElementById("trans_para_31").style.display="block";
document.getElementById("trans_para_32").style.display="block";
document.getElementById("trans_para_33").style.display="block";
document.getElementById("trans_para_34").style.display="block";
document.getElementById("trans_para_35").style.display="block";
document.getElementById("trans_para_36").style.display="block";
document.getElementById("trans_para_37").style.display="block";
document.getElementById("trans_para_38").style.display="block";
document.getElementById("trans_para_39").style.display="block";
document.getElementById("trans_para_40").style.display="block";

//页面背景黑,非当前句子字体黑，听写模式。
//document.getElementById("wrapper").style.backgroundColor= "black";
//document.getElementById("wrapper").style.color= "#000";




 }, 1000);


