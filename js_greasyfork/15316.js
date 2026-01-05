// ==UserScript==
// @name         自动评教
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       mountainguan
// @match        http://jwc.dgut.edu.cn/jyk/student.asp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15316/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/15316/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

var dododo = function(){
    var selectlist = ['a1_0','a2_2','a3_2','a4_0','a5_2','a6_2','a7_0','a8_2','a9_0','a10_2','a11_0','a12_0','a13_1','a14_1','a15_0']; //选项
    for(var i=0;i < selectlist.length;i++){
        document.getElementById(selectlist[i]).checked=true;
    }
    document.getElementsByName("aSug1")[0].innerHTML="没有";
    document.getElementsByName("aSug2")[0].innerHTML="没有";

    $("input[name='submit']").trigger("click");
};
var getUrlParam = function (name)//获取参数
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r!==null) return unescape(r[2]); return null; //返回参数值
};

if(window.location.pathname=="/jyk/student.asp"){
    if(window.location.href=="http://jwc.dgut.edu.cn/jyk/student.asp"){
        window.location = "http://jwc.dgut.edu.cn/jyk/student.asp?s=4";
    } //进入第一个界面
    else if(window.location.search=="?s=4"){
        ////进入第二个界面
        if($("center span[class='fnotic']")[0].innerHTML=="所有课程评价已完成！"){
            alert("恭喜，你已经完成所有评教！！");
        }else{
            for(var i=0;i < $("form[name='kclist'] a").length;i++){
                var str1 = $("form[name='kclist'] a")[i].innerHTML;
                if(str1=="进行评价") window.location =$("form[name='kclist'] a")[i].href;
            }
        }
    }else if(getUrlParam("a")=="tj"){ //提交后立即转跳
            window.location = "http://jwc.dgut.edu.cn/jyk/student.asp?s=4";
    }else{
        /***开始评教***/
        dododo();
    }
}