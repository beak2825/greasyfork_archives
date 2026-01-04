// ==UserScript==
// @name            超星泛雅平台学习通表格转填空题
// @namespace       moe.canfire.flf
// @version         1.0.0
// @description     desc超星泛雅平台学习通表格转填空题
// @author          mengzonefire
// @license         MIT
// @compatible      firefox Tampermonkey
// @compatible      firefox Violentmonkey
// @compatible      chrome Violentmonkey
// @compatible      chrome Tampermonkey
// @contributionURL https://afdian.net/@mengzonefire
// @match           *://mooc1-1.chaoxing.com/*

// @resource jquery         https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @resource sweetalert2Css https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css
// @require         https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js
// @require         https://cdn.jsdelivr.net/npm/js-base64
// @require         https://cdn.staticfile.org/spark-md5/3.0.0/spark-md5.min.js
// @require         https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @grant           unsafeWindow
// @run-at          document-start
// @connect         *
// @downloadURL https://update.greasyfork.org/scripts/429941/%E8%B6%85%E6%98%9F%E6%B3%9B%E9%9B%85%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%A1%A8%E6%A0%BC%E8%BD%AC%E5%A1%AB%E7%A9%BA%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/429941/%E8%B6%85%E6%98%9F%E6%B3%9B%E9%9B%85%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%A1%A8%E6%A0%BC%E8%BD%AC%E5%A1%AB%E7%A9%BA%E9%A2%98.meta.js
// ==/UserScript==
"use strict";
var url=window.location.href;

String.prototype.trim = function (char, type) {
// 去除字符串两侧指定字符str.trim('/')
// 去除字符串首尾的全部空白  ' Zhou '.trim()
// 去除字符串左侧指定字符  str.trim('/', 'left'))
// 去除字符串右侧指定字符  str.trim('/', 'right')
  if (char) {
    if (type == 'left') {
      return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
    } else if (type == 'right') {
      return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
    }
    return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
  }
  return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}
String.prototype.substrCount= function(sourcstr,str) { //sourcstr 源字符串 str 特殊字符
     var count=0;
     while(sourcstr.indexOf(str) != -1 ) {
        sourcstr = sourcstr.replace(str,"")
        count++;
     }
     return count;
}
String.prototype.getBefore=function(nvstr,nvSplit){
  var p=nvstr.indexOf(nvSplit);
  if(p<0) return '';
  return nvstr.substr(0,p);
}//
String.prototype.getAfter=function(nvstr,nvSplit){
  var p=nvstr.indexOf(nvSplit);
  if(p<0) return nvstr;
  return nvstr.substr(p+nvSplit.length);
}//

//正则的特殊字符串处理
String.prototype.handleRegExSpecialChar=function( str ){
	var ss="*.?+$^[](){}|\/";
	var str2='';
 for(var i=0;i<str.length;i++){//转义字符处理
    var ch=str.substr(i,1);
	if(ss.indexOf(ch)!=-1){str2=str2+'\\'+ch;}
	else{ 	str2=str2+ch; }
 };
  return str2;
}

String.prototype.getBetween=function(fullstr,strBegin,strEnd){//返回一个数组
   var ss="*.?+$^[](){}|\/";
 var strBegin2=''.handleRegExSpecialChar(strBegin) ;
 var strEnd2=''.handleRegExSpecialChar(strEnd) ;

 var regstr=strBegin2+"(((?!"+strBegin2+").)*)"+strEnd2;
 var rx=new RegExp( regstr, 'gm');
 var result=[];
 var data;
 while( ( data= rx.exec( fullstr ) )!= null){
	result.push(data[1]);
}
  return result;
}//
function heredoc(fn) {
   var str=fn.toString();
   var p1=str.indexOf("/*")+2;
   var p2=str.lastIndexOf("*/");
   return str.slice(p1,p2).trim() ;
}
var str=heredoc(function(){
  /*
  多行字符串表示法
  */
});
String.prototype.parseQuestion=function(rawstr){
    //选择题请填写.{{是/否/上/A}} 最后一个是答案
    var s="".getBefore(rawstr,'{{');
    var q="".getBetween(rawstr,'{{','}}');
    var arr=q.toString().split("/");
    var html='';
     html=html+'<p><span>&nbsp;</span></p>';
    html=html+'<p><span>1、'+s+'</span></p>';
     for(x=0;x<arr.length-1;x++){
        html=html+'<p><span>'+String.fromCodePoint(65+x)+'.'+arr[x]+''+'</span></p>';
     }
    var answer=arr[arr.length-1].toUpperCase();
    if( "ABCDEFG对错".indexOf(answer)==-1){
      html=html+'<p><span>答案：X</span></p>';  //未写答案，随便给一个；
    }else{
      html=html+'<p><span>答案：'+answer+'</span></p>';
    }//if
    return html;
 }


//总是出现找不到函数的问题；偏门方法，将函数绑定到String对象上；
String.prototype.jkimport=function(){
   var tabedStr=prompt("复制表格标题，在此粘帖(分隔符\\t及~):\n若标题复杂，可先在记事本中替换\\t为~\n 注：\\t为制表符，格式如下：","学号~姓名~性别____.{{男/女/A}}");
    //TAB改为|
   if (tabedStr== null) return;

   var html='';
   tabedStr=tabedStr.trim();
    tabedStr=tabedStr.replaceAll("\t","~");
    tabedStr=tabedStr.replaceAll("~~","~");
    tabedStr=tabedStr.replaceAll("~","~");
   var arr=tabedStr.split("~");
   for(i=0;i<arr.length;i++){
       /*
       默认转为填空题
       选择题请填写.{{是/否/上：A}}
       */
     if(arr[i].toString().indexOf('}}')!=-1){
         //选择题格式：
         html=html+"".parseQuestion(arr[i]);
     }else{
        //默认填空题
        html=html+'<p><span>&nbsp;</span></p>';
        html=html+'<p><span>'+(i+1)+'、'+arr[i]+''+'</span></p>';//  请填写____.
	    html=html+'<p><span>答案：无；'+'</span></p>';
        html=html+'<p><span>题型：填空题'+'</span></p>';
     }
   }//for
  $("#questionText").html(  html.trim()  );
}

$(function(){
     var btn;
     var s;
 if( url.match(/gotoimportpage?/g) ){
    btn=$("body > div.wid1260 > p.mainTop > a.Import");
   s=$(btn).prop("outerHTML");
    s=s.replace("模版导入","填表格转填空")
    s=s.replace("onclick=\"checkFile()\"","onclick=\" ''.jkimport();\"")
    $(btn).after(s);
    $(btn).next().css("border","1px solid red");
 }
 if( url.match(/goToWorkEditor/g) ){//创建作业界面，
    btn=$("#workForm > div > div.Exam-right.fl > div.Left-btn > li:nth-child(8) > a");
    s=$(btn).prop("outerHTML");
    s=s.replace("智能导入","快速导入")
    s=s.replace("smart-import","gotoimportpage")
    $(btn).after(s);
    $(btn).next().css("border","1px solid red");
 }
});
