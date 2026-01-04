// ==UserScript==
// @name         2022广东省公需课登录界面自动填入默认密码
// @description  功能：1、自动填入默认密码：身份证末6位+'@Gd'；2、登录成功后，自动关闭弹出的修改密码对话框。
// @namespace    小南88
// @version      2.0
// @description  try to take over the world!
// @author       You
// @match        https://jsglpt.gdedu.gov.cn/login*
// @match        https://jsglpt.gdedu.gov.cn/teacher/index*
// @icon         https://jsglpt.gdedu.gov.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429163/2022%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%85%AC%E9%9C%80%E8%AF%BE%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5%E9%BB%98%E8%AE%A4%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/429163/2022%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%85%AC%E9%9C%80%E8%AF%BE%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5%E9%BB%98%E8%AE%A4%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    var href = window.location.href
    if(href.indexOf("/login") != -1) {
        //输入身份证号码后，自动在密码框填入默认密码
        $('#userName').bind('input propertychange', function() {
            if($('#userName').val().length === 18){
                $('#password').val($('#userName').val().slice(-6) + '@Gd');
            }
        });
    }

    if(href.indexOf("/index") != -1) {
        //登录成功后，自动关闭弹出的修改密码窗口
        $('.layui-layer-close').click();
    }
})();