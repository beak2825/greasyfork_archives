// ==UserScript==
// @name         USTCmisTeacherAssessment
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  不自动的完成对老师的评分：使用方法：安装脚本，点开评课页面，观察是否全部按钮被选中。
// @author       Tianyi Cui
// @require      https://cdn.staticfile.org/jquery/3.1.1/jquery.min.js
// @match        http://mis.teach.ustc.edu.cn/pgwj.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26304/USTCmisTeacherAssessment.user.js
// @updateURL https://update.greasyfork.org/scripts/26304/USTCmisTeacherAssessment.meta.js
// ==/UserScript==
function bad_review()
{
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(
        i=>{var t=document.getElementById("answ&"+i.toString()+"&1&5");
            if(t)
                t.click();
           });
}

function good_review()
{
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(
        i=>{var t=document.getElementById("answ&"+i.toString()+"&1&1");
            if(t)
                t.click();
           });
}

(function() {
    good_review();
    $("body > div > form > table > tbody > tr > td > table:nth-child(1) > tbody > tr > td:nth-child(1)")
    .append('<input type=submit onclick="return check()" value="提交"></input><input type=\'radio\' name=\'review\' value=\'good\' id="hplsradio" checked></input>好评<input type=\'radio\' name=\'review\' value=\'bad\' id="cplsradio"></input>差评');
    $('#cplsradio').click(bad_review);
     $('#hplsradio').click(good_review);
    //window.check();

    // Your code here...
})();
