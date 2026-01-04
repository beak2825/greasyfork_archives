// ==UserScript==
// @name         Sufe疫情自动申报
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  主页按钮、疫情情况自动填充
//try to save time for manga
// @author       yuiyui
// @include      http://portal.sufe.edu.cn/web/guest/graduate
// @include      http://portal.sufe.edu.cn/web/guest/student
// @include      https://login.sufe.edu.cn/cas/login*
// @include      http://stu.sufe.edu.cn/stu/ncp/ncpIndex.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411165/Sufe%E7%96%AB%E6%83%85%E8%87%AA%E5%8A%A8%E7%94%B3%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/411165/Sufe%E7%96%AB%E6%83%85%E8%87%AA%E5%8A%A8%E7%94%B3%E6%8A%A5.meta.js
// ==/UserScript==

(function() {
//    if (window.location.host == 'portal.sufe.edu.cn')
//    {if(confirm("疫情情况上报？？？？？？？？")){
//    window.location="http://stu.sufe.edu.cn/stu/ncp/ncpIndex.jsp"}
//    }
    if (window.location.host == 'login.sufe.edu.cn')

    {document.getElementsByClassName("tab_option user-login")[0].click();}
if (window.location.host == 'portal.sufe.edu.cn')
{var a=document.evaluate("//*[@id='p_p_id_jigsawMyMessage_WAR_shufeCustomportlet_']/div/div/div/ul", document).iterateNext()
var a0=document.createElement("li");
a.appendChild(a0)
var a1=document.createElement("a");
a0.appendChild(a1)
a1.href = "http://stu.sufe.edu.cn/stu/ncp/ncpIndex.jsp"
a1.target="_blank"                             //不希望打开新标签页进行上报则删去此行
var a3=document.createElement("i");
a1.appendChild(a3)
a3.className ='message_ico_2'
var a4=document.createElement("b");
a1.appendChild(a4)
var a2=document.createElement("font");
a4.appendChild(a2)
a2.innerHTML='疫情上报'
}
if (window.location.host == 'stu.sufe.edu.cn')
{document.getElementById('x12').click();
document.getElementById('x22').click();
document.getElementById('x02').click();
document.getElementById('x35').click();
$('#city_name')[0].value='江苏-南京'   //若在学校，则改为'上海-学校宿舍'或者直接将此行删去。换言之，想上报'中国-大陆'也是可以的（
document.getElementById('x52').click();
document.getElementById('x72').click();
document.getElementById('x92').click();
document.getElementById('x102').click();
document.getElementById('submit').click();
//$("#curCity")[0].innerHTML='no_use'
}})();