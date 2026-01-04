// ==UserScript==
// @name         党课学习
// @namespace    victotyhilling
// @version      0.2.0
// @description  自动播放党课
// @author       aaa
// @match        http://dypx.dlut.edu.cn/jjfz/play*
// @icon         https://www.google.com/s2/favicons?domain=dlut.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427674/%E5%85%9A%E8%AF%BE%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/427674/%E5%85%9A%E8%AF%BE%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

var ids=new Array(
"2046 6550",
"2046 6550",
"2053 6603",
"2053 6610",
"2084 6765",
"2084 6765",
"2085 6766",
"2085 6769",
"2087 6771",
"2087 6785",
"2089 6787",
"2089 6787",
"2114 6843",
"2114 6853",
"2071 6748",
"2071 6752",
"2074 6755",
"2074 6755",
"2099 6806",
"2099 6806",
"2126 6869",
"2126 6873",
"2127 6874",
"2127 6878",
"2129 6880",
"2129 6883",
"2132 6886",
"2132 6888",
"2142 6904",
"2142 6915",
"2143 6916",
"2143 6922",
"2144 6923",
"2144 6923",
"2145 6924",
"2145 6924",
"2146 6925",
"2146 6926")
/*
* url 目标url
* arg 需要替换的参数名称
* arg_val 替换后的参数的值
* return url 参数替换后的url
*/
function changeURLArg(url,arg,arg_val){
    var pattern=arg+'=([^&]*)';
    var replaceText=arg+'='+arg_val;
    if(url.match(pattern)){
        var tmp='/('+ arg+'=)([^&]*)/gi';
        tmp=url.replace(eval(tmp),replaceText);
        return tmp;
    }else{
        if(url.match('[\?]')){
            return url+'&'+replaceText;
        }else{
            return url+'?'+replaceText;
        }
    }
    return url+'\n'+arg+'\n'+arg_val;
}
function GetRequest() {
         var url = location.search; //获取url中"?"符后的字串
         if (url.indexOf("?") != -1) { //判断是否有参数
                  var str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
                  var strs = str.split("="); //用等号进行分隔 （因为知道只有一个参数
                                          //所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）
                  return strs; //直接弹出第一个参数 （如果有多个参数 还要进行循环的）
         }
  }
(function() {
    'use strict';
     for (var i = 0; i <ids.length; ++i) {
         var url1 = window.location.href;
         var index=url1.indexOf("v_id=");
         var vid=url1.slice(index+5,index+9);
         if(ids[i].split(" ")[0]==vid)
         {
             break;
         }
     }
    setInterval(() => {
        var buttonEle = document.getElementsByClassName('public_submit')[0];
        const text = document.getElementsByClassName('public_text')[0];
        if(document.getElementsByClassName('public_cancel').length!=0){
            buttonEle=document.getElementsByClassName('public_cancel')[0];
        }
        if (buttonEle){
            buttonEle.click();
        }

        if(buttonEle.innerHTML=="我知道了" && text.innerHTML.length!=93)
        {
            var vid=ids[i].split(" ")[0];
            var end=ids[i+1].split(" ")[1];
            var url1 = window.location.href;
            var index=url1.indexOf("r_id=");
            var rid=url1.slice(index+5,index+9);
            rid=String(parseInt(rid)+1);
            if(rid>end){
                i=i+2;
                vid=ids[i].split(" ")[0]
                rid=ids[i].split(" ")[1];
                end=ids[i+1].split(" ")[1];
            }
             var a=changeURLArg(window.location.href,"v_id",vid);
             var tar=changeURLArg(a,"r_id",rid);
             window.location.href=tar;

        }

    }, 3000);
    setInterval(() => {
        location.reload()
         },1800000);

})();