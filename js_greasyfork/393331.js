// ==UserScript==
// @name         随行课堂脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  此脚本可以进行随行课堂的自动答题和提交
// @author       乱舞神菜
// @match        *://course.sflep.com/student/StudyCourse.aspx?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393331/%E9%9A%8F%E8%A1%8C%E8%AF%BE%E5%A0%82%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/393331/%E9%9A%8F%E8%A1%8C%E8%AF%BE%E5%A0%82%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
//定位到iframe界面
var $iFrame=$("#contentFrame");
//src属性判断iframe加载
$iFrame.prop("src","//centercourseware.sflep.com/new progressive college english integrated course 3");
//iframe界面加载载入函数
$iFrame.load(function(){
    var answer = $iFrame.contents().find("[data-solution]");
    var button = $iFrame.contents().find("[data-controltype='submit']");
    for (var i=0;i<answer.length;i++){
    var ansewer_target = answer.eq(i).attr("data-solution");
    if (ansewer_target.length > 0 ){
    answer.eq(i).val(answer.eq(i).attr("data-solution"));
    }
else {
    answer.eq(i).click();
}
}
    button[0].click();
    //设立回调函数点击按钮事件
    function callback(){
        var button1 = $iFrame.contents().find("[class='layui-layer-btn0']");
        button1[0].click();
    }
    setTimeout(callback,100);
});