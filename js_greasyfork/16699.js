// ==UserScript==
// @name        批量找图脚本正式版
// @namespace   https://greasyfork.org/users/14059
// @author      setycyas
// @homepage    http://blog.sina.com.cn/u/1365265583
// @description 批量找图脚本正式版,已经为批量下载做好了准备
// @include     http://www.uumt.cc/*
// @include     http://mm.xmeise.com/*
// @include     http://www.mm131.com/*
// @include     http://www.du114.com/*
// @version     1.01
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/16699/%E6%89%B9%E9%87%8F%E6%89%BE%E5%9B%BE%E8%84%9A%E6%9C%AC%E6%AD%A3%E5%BC%8F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/16699/%E6%89%B9%E9%87%8F%E6%89%BE%E5%9B%BE%E8%84%9A%E6%9C%AC%E6%AD%A3%E5%BC%8F%E7%89%88.meta.js
// ==/UserScript==

/****************************************
######## version 20160130_01 #########
脚本主要过程开始,根据图片站点不同,主要修改
global_picReg和global_numReg两个找图地址与
图总数的正则表达式.global_titleReg最好匹配
,错了也能运行
****************************************/

console.log("setycyas的批量找图脚本开始执行!");

//注册菜单
GM_registerMenuCommand('批量找图',mass_FindPic_Normal);
GM_registerMenuCommand('批量找图自动保存',mass_FindPic_AutoSave);
GM_registerMenuCommand('测试本页找图',_CurrentPageTest);

//根据网站不同而修改的变量
var global_picReg //查找图片链接的正则表达式
var global_numReg //查找图片总数的正则表达式
var global_titleReg //查找标题的正则表达式

/*******************************
增加新网站支持就在这里!!!!记得
在开头的include也补上
********************************/
if(window.location.href.match("www.uumt.cc")){
  console.log("该页属于网站 www.uumt.cc");
  global_picReg=/<div class="articleBody">\s{0,1}<p align="center">.*<img[^>]*src="([^>]*jpg)"/;
  global_numReg=/<ul><li><a>共(\d+)图:/;
  global_titleReg=/<div\s+class="articleTitle">\s+<h1>([^\(]*)/
}
if(window.location.href.match("mm.xmeise.com")){
  console.log("该页属于网站 mm.xmeise.com");
  global_picReg=/<div id="big-pic">\s{0,10}.*<img[^>]*src="([^>]*jpg)"/;
  global_numReg=/<ul><a>共(\d+)页/;
  global_titleReg=/<title>([^<\(]*)[<\(]/
}
if(window.location.href.match("www.mm131.com")){
  console.log("该页属于网站 www.mm131.com");
  global_picReg=/<div\sclass="content\-pic">s{0,10}[\s\S]{0,250}<img[^>]*src="([^>]+jpg)"/;
  global_numReg=/<span\sclass="page\-ch">共(\d+)页<\/span>/;
  global_titleReg=/<title>([^<\(]*)[<\(]/
}
if(window.location.href.match("www.du114.com")){
  console.log("该页属于网站 www.du114.com");
  global_picReg=/<div[^>]*id="picBody">s{0,10}[\s\S]{0,450}<img[^>]*src="([^>]+jpg)"/;
  global_numReg=/<ul><li><a>共(\d+)页/;
  global_titleReg=/<title>([^<\(]*)[<\(]/
}
/*此网站图太刺激,不明确提供支持
if(window.location.href.match("www.gaoxiaola")){
  console.log("该页属于网站 www.gaoxiaola.com 或 www.gaoxiaola.net");
  global_picReg=/src="([^>]*(gif|jpg|png))"\salt="/;
  global_numReg=/<b>\d+<\/b>\/<b>(\d+)<\/b>/;
  global_titleReg=/<title>([^<\(]*)[<\(]/
}*/

//开始主函数,一般显示模式
function mass_FindPic_Normal(){
  
  //在当前页查找图集的图片总数,修改查找图片总数的方法就改这里的正则表达式
  var mass_PicNum=_GetPicNum(document.getElementsByTagName("body")[0].innerHTML,global_numReg);
  if(mass_PicNum<0){
    alert("在本页找不到图片总数信息");
    return;
  }
  //开始查找,修改从网页中提取图片地址的方法,就改这里的正则表达式
  FindSrcPic(window.location.href,global_picReg,mass_PicNum,global_titleReg,_finishNormal);
  
}

//开始主函数,自动保存模式
function mass_FindPic_AutoSave(){
  
  //在当前页查找图集的图片总数,修改查找图片总数的方法就改这里的正则表达式
  var mass_PicNum=_GetPicNum(document.getElementsByTagName("body")[0].innerHTML,global_numReg);
  if(mass_PicNum<0){
    alert("在本页找不到图片总数信息");
    return;
  }
  //开始查找,修改从网页中提取图片地址的方法,就改这里的正则表达式
  FindSrcPic(window.location.href,global_picReg,mass_PicNum,global_titleReg,_finishAutoSave);
  alert("自动保存成功!标题是: "+_GetTitle(global_titleReg)+'('+mass_PicNum+')');
  
}

/****************************************
############ FindSrcPic_lib ################
######## version = 20160130_02 ############
批量找图代码库
主函数是FindSrcPic
给出例如uumt之类的图片站的图集首地址(形如http://*.html)
自动获取整个图集的所有图片地址并存放于_FindSrcPic_Result中
每次更新_FindSrcPic_Result都会刷新显示结果的文本框的文本
查找结束前,也可以通过立即显示结果菜单先看看找到的图片地址
如果有些请求没返回,会一直处于查找状态,只能刷新页面恢复
未查找状态了,这是目前的一个不足.但是只要参数正确一般没问题
****************************************/

var _FindSrcPic_Result="" //存放找到的图片地址
var _FindSrcPic_ResponNum=0 //已返回或超时的响应数目
var _FindSrcPic_IsRunning=0 //是否运行中,0表示非运行中
var _FindSrcPic_Record="picSrcRecord" //记录已找到的图集链接的数据库名

//添加显示结果的显隐div
var _FindSrcPic_maskDivHtml='<br/><b>交互消息框:</b><br/><br/><textarea id="_FindSrcPic_ResultTextArea"></textarea><br/>'

_FindSrcPic_maskDivHtml+='<input type=button value=Save id="_FindSrcPic_Save"/>&nbsp;&nbsp;&nbsp;<input type=button value=ClearRecord id="_FindSrcPic_Clear"/>'
_FindSrcPic_maskDivHtml+='&nbsp;&nbsp;&nbsp;<input type=button value=ShowRecord id="_FindSrcPic_Show"/><br/>'
AddMaskDiv("_FindSrcPic_ResultDiv",_FindSrcPic_maskDivHtml)
$('#_FindSrcPic_ResultTextArea').css({'width':'70%','height':'70%'});
$('#_FindSrcPic_Save').click(function(){
  var temp=GM_getValue(_FindSrcPic_Record, "")
  temp+=$('#_FindSrcPic_ResultTextArea').val()
  GM_setValue(_FindSrcPic_Record,temp)
  alert("成功将文本框内容加入到记录中!")
})
$('#_FindSrcPic_Clear').click(function(){if(confirm("确定要清空记录吗?")) GM_setValue(_FindSrcPic_Record,"")})
$('#_FindSrcPic_Show').click(function(){$('#_FindSrcPic_ResultTextArea').val(GM_getValue(_FindSrcPic_Record, ""))})

//根据referURL地址(一般传入本页地址),尝试获取图集目录字符串
function _GetDir(referURL){
  var temp3;
  temp3=referURL.match(/(.*)\/[^\/]*/)
  if(temp3){
    return (temp3[1]+'/');
  }else{
    console.log("无法根据地址获取图集目录");
    return ""
  }
}

//根据referURL地址(一般传入本页地址),获取图集页面类型,如果地址只有目录则默认为html
function _GetPageType(referURL){
  var temp0=referURL;
  if(temp0.substr(temp0.length-1,1)=="/"){
    return 'html';
  }
  if(temp0.substr(temp0.length-2,1)=="/"){
    return 'html';
  }
  var temp4;
  temp4=temp0.match(/.*\.([^\.#]*)#{0,1}$/);
  if(temp4){
    return temp4[1];
  }else{
    console.log("无法根据地址获取页面类型");
    return ""
  }
}

//根据referURL地址(一般传入本页地址),获取站点名称类型
function _GetWebName(referURL){
  var temp0=referURL;
  var temp4;
  temp4=temp0.match(/http:\/\/([^\/]+)\//);
  if(temp4){
    return temp4[1];
  }else{
    console.log("无法根据地址获取站点名称");
    return ""
  }
}

//根据referURL地址(一般传入本页地址),尝试获取图集首文件名(不包括扩展名),地址只有目录时默认index
function _GetStartFile(referURL){
  var temp0=referURL;
  if(temp0.substr(temp0.length-1,1)=="/"){
    return "index";
  }
  if(temp0.substr(temp0.length-2,1)=="/"){
    return "index";
  }
  temp4=temp0.match(/([^\/_]+)[\._][^\/]*$/);
  if(temp4){
    return temp4[1];
  }else{
    console.log("无法根据地址获取首文件名");
    return ""
  }
}

//从bodyHTML中,通过picNumReg正则表达式找到图片总数,返回-1表示找不到
function _GetPicNum(bodyHTML,picNumReg){
  
  var temp;
  if(temp=bodyHTML.match(picNumReg)){
    return temp[1]-0;
  }else{
    return -1;
  }
  
}

//从当前页的body的html中,通过titleReg正则表达式找到标题,返回空字符串表示找不到
function _GetTitle(titleReg){
  
  var temp;
  if(temp=document.getElementsByTagName('html')[0].innerHTML.match(titleReg)){
    return temp[1];
  }else{
    return "";
  }
 
}

//找图主函数,referURL是传入的参考url,一般是本页地址,为了增加可重用性运行传参数.失败返回-1,成功返回0.但只要请求发送了就是成功,与回应无关
function FindSrcPic(referURL,picSrcReg,picNum,titleReg,onFinish){
  
  //查看是否查找中
  if(_FindSrcPic_IsRunning>0){
    alert("上次寻找仍进行中,请不要急于重新查找,可尝试先看看已找到的结果");
    return -1
  }
  
  var pageType=_GetPageType(referURL)
  var startFile=_GetStartFile(referURL)
  var dir=_GetDir(referURL)
  var webName=_GetWebName(referURL)
  if(pageType==""){
    alert("无法识别网页文件类型");
    return -1
  }
  if(startFile==""){
    alert("无法判断首文件名");
    return -1
  }
  if(dir==""){
    alert("无法判断图集目录");
    return -1
  }
  if(webName==""){
    alert("无法获取站点名");
    return -1
  }
  
  //开始查找前初始化记录变量
  var tempTitle=_GetTitle(titleReg)
  if(tempTitle==""){
    var tempDate=new Date()
    _FindSrcPic_Result='['+tempDate.getTime()+'('+picNum+')'+']\n';
  }else{
    _FindSrcPic_Result='['+tempTitle+'('+picNum+')'+']\n'
  }
  _FindSrcPic_ResponNum=0;
  _FindSrcPic_IsRunning=1;
  $('#_FindSrcPic_ResultTextArea').val(_FindSrcPic_Result);
  
  //开始遍历发送消息,获取图片链接.遍历地址的形式如需改变就改这里
  console.log("开始批量发送请求");
  for(var i=1;i<picNum+1;i++){
    
    var picURL;
    if(i==1){
      picURL=dir+startFile+"."+pageType
    }else{
      picURL=dir+startFile+"_"+i+"."+pageType
    }
    
    
    $.get(    
     picURL,
     {},     
     function(data) {
      _FindSrcPic_ResponNum++;
       
　　　 var temp2=data.match(picSrcReg);
      if(temp2){       
        if(!temp2[1].match("http:")) 
         temp2[1]="http://"+webName+temp2[1]
       _FindSrcPic_Result+=temp2[1]+"\n";
       $('#_FindSrcPic_ResultTextArea').val(_FindSrcPic_Result);
       console.log("返回一个成功的请求,找到图片: "+temp2[1]);
      }else{
       console.log("返回一个成功的请求,但找不到图片");
      }
      console.log("目前已返回请求数/总请求数 ="+_FindSrcPic_ResponNum+"/"+picNum);
       
      if(_FindSrcPic_ResponNum==picNum){
       onFinish()
      }
     }
    ).fail(function(XMLHttpRequest){
     _FindSrcPic_ResponNum++;
     console.log("返回一个失败的请求");
     console.log("目前已返回请求数/总请求数 ="+_FindSrcPic_ResponNum+"/"+picNum);
       
     if(_FindSrcPic_ResponNum==picNum){
      onFinish()
     }
    });
    console.log("已发送请求: "+picURL);
  }
  
}

//找图完结时,一般显示
function _finishNormal(){
  $('#_FindSrcPic_ResultDiv').css({display:'block'});
  _FindSrcPic_IsRunning=0;
}

//找图完结时,自动保存
function _finishAutoSave(){
  var temp=GM_getValue(_FindSrcPic_Record, "")
  temp+=$('#_FindSrcPic_ResultTextArea').val()
  GM_setValue(_FindSrcPic_Record,temp)
  _FindSrcPic_IsRunning=0
}

//测试本页的找图结果
function _CurrentPageTest(){
  console.log('当前页面找图测试开始')
  console.log('获取图集图片总数= '+_GetPicNum(document.getElementsByTagName("body")[0].innerHTML,global_numReg))
  console.log('获取图集标题= '+_GetTitle(global_titleReg))
  var temp=document.getElementsByTagName("html")[0].innerHTML.match(global_picReg)
  if(temp){
   console.log('获取图片地址= '+temp[1]);
  }else{
   console.log('无法获取图片地址')
  }
  
}
/****************************************
############ MaskDiv_lib ################
####version = 20160129_01 ######
显示覆盖原页面的上层div的库
主函数是AddMaskDiv,添加目标div
除了目标div外,内部html的css,绑定函数等需自行
另外处理
****************************************/

//添加一个隐藏的层,maskDivId为该层的div的Id,maskDivInnerHTML为内部html
//至于css则需要在外部添加.函数只管maskDiv的css,以及额外赠送的一个重新隐藏该层的按钮
//最后注册一个GM菜单用于显示该层
function AddMaskDiv(maskDivId,maskDivInnerHTML){
  
  var htmlAppend='<div id=' + maskDivId +">"+maskDivInnerHTML+"<br/>&nbsp;&nbsp;<input type=button id="+maskDivId+"_return value=Return></input><br /></div>";
  $('body').append(htmlAppend);
  $('#'+maskDivId).css({'position':'fixed','left':'10%','top':'10%','width':'70%','height':'70%','background-color':'#ffffff','z-index':'10001','display':'none','text-align':'center','border':'1px solid #00F'});
  $('#'+maskDivId+'_return').click(function(){$('#'+maskDivId).css({display:'none'});});
  GM_registerMenuCommand('显示'+maskDivId,function(){$('#'+maskDivId).css({display:'block'});});
 
}
