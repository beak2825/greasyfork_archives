// ==UserScript==
// @name         Quantity detection
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://resource.yunshuxie.com/home/mine/views/index_V2.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31513/Quantity%20detection.user.js
// @updateURL https://update.greasyfork.org/scripts/31513/Quantity%20detection.meta.js
// ==/UserScript==

(function() {
    'use strict';
     // Your code here...
     var oHtml="<div style='position:fixed;top:0; left:0; z-index:9999;'><textarea rows='6' id='content' cols='100'  placeholder='请输入书目!'></textarea><input type='submit' value='提交' id='js-sub'><div>";
     var oBody=document.body;
    oBody.insertAdjacentHTML('beforeend',oHtml);
    var dom=document.getElementById('js-sub');
    dom.addEventListener('click',function(){
        var oVal=document.getElementById('content').value;
        var str=iGetInnerText(oVal);
        str = str.replace(/【/g,"[").replace(/】/g,"]").replace(/（/g,"(").replace(/）/g,")") ;
        if(typeof(mycourses_for_test)=="undefined"){
              alert('请你跳转到互动讨论页面，再点击！');
              return false;
        }else{
          for(var i= 0,len=mycourses_for_test.length;i<len;i++){
            var c = mycourses_for_test[i];
            var name = c.courseName.replace(/【/g,"[").replace(/】/g,"]").replace(/（/g,"(").replace(/）/g,")") ;
            var x = str.indexOf(name);
            if(x>=0){
                str = str.replace(name,"");
                console.log(true);
            }else{
                console.log("我多了一本-----"+c.courseName);
            }
          }
          console.log("总数："+len );
          if(str.length>0) console.log("缺少的书：" +str);
        }
    });
    function iGetInnerText(testStr) {
        var resultStr = testStr.replace(/\ +/g, "");
        resultStr = testStr.replace(/[ ]/g, "");
        resultStr = testStr.replace(/[\r\n]/g, "");
        return resultStr;
    }
})();