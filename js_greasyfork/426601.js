// ==UserScript==
// @name         三亚学院新教务评教
// @namespace    http://tampermonkey.net/
// @version      0.4
// @author       初七
// @description  借鉴了南昌航空大学教务处一键评教，使用方法：打开评教页面会自动选中评分，用户手动点击提交即可
// @include      http://jwxt.sanyau.edu.cn/syxy_jsxsd/xspj/xspj_list.do*
// @include      http://jwxt.sanyau.edu.cn/syxy_jsxsd/xspj/xspj_edit_syxy.do*
// @grant        unsafeWindow
// @grant        window
// @reqire       http://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/426601/%E4%B8%89%E4%BA%9A%E5%AD%A6%E9%99%A2%E6%96%B0%E6%95%99%E5%8A%A1%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/426601/%E4%B8%89%E4%BA%9A%E5%AD%A6%E9%99%A2%E6%96%B0%E6%95%99%E5%8A%A1%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
var markPosition=1
var flag1=0;
var href=document.location.href;
if(href.search('jwxt.sanyau.edu.cn/syxy_jsxsd/xspj/xspj_list.do')!=-1){//判断是否为加载网页
    hook();
    addBtn()
}else {
    remark();
}
function hook() {
    unsafeWindow.JsMod = function (htmlurl, tmpWidth, tmpHeight) {
        htmlurl = getRandomUrl(htmlurl);
        var newwin = window.open(htmlurl, window, "dialogWidth:" + tmpWidth + "px;status:no;dialogHeight:" + tmpHeight + "px")
        if (newwin == "refresh" || newwin == "ok") {
            if (getOs() == "chrome") {
                alert(getOs());
                window.location.reload();// 谷歌浏览器要用此方法刷新
            } else {
                window.location.reload()
                //window.location.href = window.location.href;
            }
        }

    }
}
function remark() {
    //hookRemark();
    //hookAlert()
    //执行评分
   var length=$("input[type='radio']").length;
    $("input[type='radio']").each(function (index) {
        //if(length-1-index<4){
            var position=3;
            if((length-1)-index==position){
                $(this).attr('checked','checked')
            }
        /*}else*/ if(index%5==0){
            $(this).attr('checked','checked')
        }
    })
    $('textarea').val('老师的课很好听');
}
})();