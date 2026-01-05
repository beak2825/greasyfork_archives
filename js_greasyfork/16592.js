// ==UserScript==
// @name        FindSrcPic_lib(uumt测试版)
// @namespace   https://greasyfork.org/users/14059
// @author      setycyas
// @homepage    http://blog.sina.com.cn/u/1365265583
// @description 批量找图代码库,以优优美图网站做执行测试
// @include     http://www.uumt.cc/*
// @version     1.00
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/16592/FindSrcPic_lib%28uumt%E6%B5%8B%E8%AF%95%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/16592/FindSrcPic_lib%28uumt%E6%B5%8B%E8%AF%95%E7%89%88%29.meta.js
// ==/UserScript==

/****************************************
############ FindSrcPic_lib ################
批量找图代码库
主函数是FindSrcPic
给出例如uumt之类的图片站的图集首地址(形如http://*.html)
自动获取整个图集的所有图片地址并存放于_FindSrcPic_Result中
每次更新_FindSrcPic_Result都会刷新显示结果的文本框的文本
查找结束前,也可以通过立即显示结果菜单先看看找到的图片地址
如果有些请求没返回,会一直处于查找状态,只能刷新页面恢复
未查找状态了,这是目前的一个不足.但是只要参数正确一般没问题
****************************************/

var _FindSrcPic_Result="";//存放找到的图片地址
var _FindSrcPic_ResponNum=0;//已返回或超时的响应数目
var _FindSrcPic_IsRunning=0;//是否运行中,0表示非运行中

//添加显示结果的显隐div
AddMaskDiv("_FindSrcPic_ResultDiv","<br/><b>找到的图片地址:</b><br/><br/><textarea id=_FindSrcPic_ResultTextArea></textarea><br/>");
$('#_FindSrcPic_ResultTextArea').css({'width':'70%','height':'70%'});

function FindSrcPic(startURL,picSrcReg,picNum){
  
  //查看startURL是否合法
  if(!startURL.match(/^http:.*html$/)){
    alert("FindSrcPic需要输入格式化的地址才能正确运行!");
    return;
  }
  
  //查看是否查找中
  if(_FindSrcPic_IsRunning>0){
    alert("上次寻找仍进行中,请不要急于重新查找,可尝试先看看已找到的结果");
    return;
  }
  
  //开始查找前初始化记录变量
  _FindSrcPic_Result="";
  _FindSrcPic_ResponNum=0;
  _FindSrcPic_IsRunning=1;
  $('#_FindSrcPic_ResultTextArea').val(_FindSrcPic_Result);
  
  //开始遍历发送消息,获取图片链接.遍历地址的形式如需改变就改这里
  console.log("开始批量发送请求");
  for(var i=1;i<picNum+1;i++){
    
    var picURL;
    if(i==1){
      picURL=startURL;
    }else{
      picURL=startURL.substr(0,startURL.length-5)+"_"+i+".html";
    }
    
    
    $.get(    
     picURL,
     {},     
     function(data) {
      _FindSrcPic_ResponNum++;
       
　　　 var temp2=data.match(picSrcReg);
      if(temp2){       
       _FindSrcPic_Result+=temp2[1]+"\n";
       $('#_FindSrcPic_ResultTextArea').val(_FindSrcPic_Result);
       console.log("返回一个成功的请求,找到图片: "+temp2[1]);
      }else{
       console.log("返回一个成功的请求,但找不到图片");
      }
      console.log("目前已返回请求数/总请求数 ="+_FindSrcPic_ResponNum+"/"+picNum);
       
      if(_FindSrcPic_ResponNum==picNum){
       $('#_FindSrcPic_ResultDiv').css({display:'block'});
       _FindSrcPic_IsRunning=0;
      }
     }
    );
    console.log("已发送请求: "+picURL);
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

/****************************************
############ MaskDiv_lib ################
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

/****************************************
以下是本库在uumt的实现与测试,复制库时不需要复制下面内容
****************************************/

//注册菜单
GM_registerMenuCommand('uumt找图',uumt_FindPic);

console.log("setycyas的批量找图代码库,uumt批量找图测试脚本成功加载!");

function uumt_FindPic(){
  
  //在当前页查找图集的图片总数,修改查找图片总数的方法就改这里的正则表达式
  var uumt_PicNum=_GetPicNum(document.getElementsByTagName("body")[0].innerHTML,/<ul><li><a>共(\d+)图:/);
  if(uumt_PicNum<0){
    alert("在本页找不到图片总数信息");
    return;
  }
  
  //用当前页地址格式化图集查找的首页地址
  var startURL=window.location.href;
  if(startURL.substr(startURL.length-1,1)=="#"){
    startURL=startURL.substr(0,dir.length-1);
  }
  if(startURL.substr(startURL.length-1,1)=="/"){
    startURL+="index.html";
  }
  console.log("经过格式化,图集首页地址是: "+startURL);
  
  //开始查找,修改从网页中提取图片地址的方法,就改这里的正则表达式
  FindSrcPic(startURL,/<div class="articleBody">\s{0,1}<p align="center">.*<img[^>]*src="([^>]*jpg)"/,uumt_PicNum);
  
}