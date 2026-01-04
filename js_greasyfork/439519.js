// ==UserScript==
// 远程调用代码 ：   https://greasyfork.org/scripts/439519-jjkjs/code/jjkjs.user.js
//  <script src="https://greasyfork.org/scripts/439519-jjkjs/code/jjkjs.user.js<?php echo "?v=".rand(1,10000);?>"></script>
// @name            jjkjs
// @namespace       moe.canfire.flf

// @description     descjjkjs
// @author          mengzonefire
// @license         MIT
// @match           *
 
// @resource jquery         https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js
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
// @version 0.0.1.20220314074202
// @downloadURL https://update.greasyfork.org/scripts/439519/jjkjs.user.js
// @updateURL https://update.greasyfork.org/scripts/439519/jjkjs.meta.js
// ==/UserScript==
 
//找不到函数定义的解决方法
/*
不要用 function test(){};
而要： "use strict";
test=function(){ };或 String.test=function(){}; 
*/
 
 
//正则的特殊字符串处理
function myRegExp(regstr_spashMustDouble,igm){
	  /*
	  //正则表达式，
	  //第1步，检查其中本身有没有\,如果有，必须改成\\,否则\这字符会自动少掉；
	  //第2步，对元字符要加转义前加\
           // a.replace( myRegExp("ax\zff", "gm"), s2); //直接使用字符串，自动处理需要转义的字符；
	   */
	 var charlist='$*+.?\\^|(){}[]'.split(""); //\\只是代表\字符；
	 for(var kid in charlist){
		regstr_spashMustDouble=regstr_spashMustDouble.replace( charlist[kid],"\\"+charlist[kid]);
	 }
 	 return new RegExp(regstr_spashMustDouble,igm);
} ;
 
 
String.prototype.trim = function (char, type) {
// 去除字符串首尾的全部空白符，不仅仅是空格； str.trim()
// 去除字符串两侧指定字符str.trim('/')
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
  //无参时，默认匹配任意开头多个空白符 或 任意结尾多个空白符
  return this.replace(/^\s+|\s+$/g, '');
};
 
String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}
String.prototype.substrCount= function(sourcstr,substr) { //sourcstr 源字符串 substr特殊字符
     var count=0;
     while(sourcstr.indexOf(substr) != -1 ) {
        sourcstr = sourcstr.replace(substr,"")
        count++;
     }
     return count;
}
String.prototype.getBefore=function(sourcestr,str){
  var p=sourcestr.indexOf(str);
  if(p<0) return '';
  return sourcestr.substr(0,p);
}//
String.prototype.getAfter=function(sourcestr,str){
  var p=sourcestr.indexOf(str);
  if(p<0) return sourcestr;
  return sourcestr.substr(p+str.length);
}//
String.prototype.getBetween=function(fullstr,str1,str2){
   //注意转义问题
   return ''.getBefore(''.getAfter(fullstr,str1)+str2,str2);
}//
 
String.prototype.getBetween=function(fullstr,strBegin2,strEnd2){//返回一个数组
 var regstr=strBegin2+"(((?!"+strBegin2+").)*)"+strEnd2;
 var rx=new RegExp( regstr, 'gm');
 var result=[];
 var data;
 while( ( data= rx.exec( fullstr ) )!= null){	result.push(data[1]);}
  return result;
}//
function rawstring(fn) {//多行字符串表示法
   var str=fn.toString();
   var p1=str.indexOf("/*")+2;
   var p2=str.lastIndexOf("*/");
   return str.slice(p1,p2).trim() ;
}
var demostr=rawstring(function(){
  /*
  多行字符串表示法
  */
});
replaceAll=function(sourceStr , regexStr,replaceStr,gim) {
/*
//注意输入的字符串首先要转义，\\要先被当成\
alert( "ab(1\r3)cd".replace(  new RegExp("\r", "igm") ,'x')   );
alert( "ab(1\d3)cd".replace(  new RegExp("\d", "igm") ,'x')   );
alert( "ab(1\d3)cd".replace(  new RegExp("\\d", "igm") ,'x')   );
//字符串转义与正则表达式要区别下来；\r是转义，\d不是转义
//1式、正则中，首先是字符串转义\r，转义后实际内容是回车，因此，实际是替换回车符
//2式、正则中，首先是字符串转义\d，\被忽略，被当成d，因此，实际是替换d
//3式、正则中，首先是字符串转义\\，转义后实际内容是\d，正则含义是数字，因此，实际是替换数字；
*/
    if(gim==null)gim="gm";//使用正则中的\d\s\b\w这些，必须要写成\\d\\s\\b\\w,
    if (sourceStr!= null && regexStr!= null && replaceStr!= null) {
        return sourceStr.replace(new RegExp(regexStr,gim), replaceStr)
    }
}
 
toast=function(msg,duration){//toast('这是一个弹框',2000)
      duration=isNaN(duration)?500:duration;
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
}

showloading=function(visible,txt){
      window.jkinterval777=-1;
      if(txt==undefined)txt='waiting ';
      var obj=document.querySelector(".loadingMask");
      if(obj==null){
        obj= document.createElement("div");
        obj.className = 'loadingMask'; 
        document.body.appendChild(obj);
        obj.innerText='';
        obj.style.cssText="max-width:60%;min-width:60px;padding:0 14px;height:26px;line-height: 20px;color:#C0C0C0;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: #ffff;font-size:18px;";
     }
      if(visible){
		   obj.style.display='';
           window.jkinterval777=setInterval(function(){  
			   if(obj.innerText==''){ obj.innerText=txt+'∴';return;}
               if(obj.innerText==txt+'∴'){ obj.innerText=txt+'∵';return;}
               if(obj.innerText==txt+'∵'){ obj.innerText=txt+'∴';return;}
			   return;//100
           },550);
      }else {clearInterval(window.jkinterval777);obj.style.display='none';  obj.innerText='';}
}