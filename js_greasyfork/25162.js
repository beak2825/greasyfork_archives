// ==UserScript==
// @name         合肥考试系统
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://www.bsuc.cn:8126/exercise/exercise.asp?courseID=*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/25162/%E5%90%88%E8%82%A5%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/25162/%E5%90%88%E8%82%A5%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==
/* jshint -W097 */
//获取显示
var b = '<div style="border: 2px dashed rgb(0, 85, 68); width: 350px; min-height: 100px; max-height: 500px; font-size: 12px; text-align: left; position: fixed; top:0%; right:0%; z-index: 9999; background-color: rgb(255, 128, 0);overflow: auto;"><a style="text-decoration: none;font-size: large;width: 350px;display: block;float: left;" id="toNext" href="javascript:">正在收录答案...</a><button disabled="disabled" style="text-decoration: none;font-size: large;width: 115px;display: block;float: left;" href="javascript:location.reload()" onclick="location.reload()">重新查询</button><a style="background: url(http://hnkjxy.tsk.erya100.com/resource/images/student/baocun2.gif);border:0px;text-decoration: none;font-size: large;width: 100px;display: block;float: right;" href="javascript:void(0)" id="zhedie">折叠面板</a><a style="background: url(http://hnkjxy.tsk.erya100.com/resource/images/student/baocun2.gif);border:0px;text-decoration: none;font-size: large;width: 100px;display: block;float: left;" target="_blank" href="http://www.superstarcool.com">在线搜题</a><table width="100%" id="antable" border="1"><tr><td width="60%">题目</td><td width="40%">答案</td></tr></table></div>';
$(function(){
    $("#d").after(b);
});
//获取题目
$(document).ready(function(){ 
document.getElementById("zhedie").addEventListener("click",
function() {
$("#antable").fadeToggle(1E3)
},
!1); 
        var question =$().val();
        var answer =$().val();
        for (var i = 1; i < 95; i++) {
        var key="collectanswer";
$.ajax({
url: "http://www.superstarcool.com/CollectAnswer.php",
type: "POST",
data: {question:question,answer:answer},
async: !0,
timeout: 1E4,
success: function(a) {
a = (a = a.trim()) && "2" != a ? "\u65b0\u589e": "2" == a ? "\u66f4\u65b0": "\u670d\u52a1\u5668\u5f02\u5e38";
$("#antable").append("<tr><td style='overflow:hidden;'>" + question + "</td><td>" + answer + "-" + a + "</td></tr>")
},
error: function(a) {
$("#antable").append("<tr><td style='overflow:hidden;'>" + question + "</td><td>" + answer + "-\u670d\u52a1\u5668\u65e0\u54cd\u5e94</td></tr>")
}
});
var question =$("#question"+i).val();
var answer =$("#answer"+i).val();
            //$("#antable").append("<tr><td style='overflow:hidden;'>" + question + "</td><td>" +"正确答案："+ answer + "</td></tr>");
        }
    });