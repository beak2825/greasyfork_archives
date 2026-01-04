// ==UserScript==
// @name         局OA-短信发送辅助
// @namespace    http://nbeea.com/
// @version      0.2
// @description  局OA短信发送辅助
// @author       qqhugo
// @match        http://jyj.nbedu.net.cn/EduOAOld/Personal/MessageSend*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/426060/%E5%B1%80OA-%E7%9F%AD%E4%BF%A1%E5%8F%91%E9%80%81%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/426060/%E5%B1%80OA-%E7%9F%AD%E4%BF%A1%E5%8F%91%E9%80%81%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
})();


//考务系统各页面附加功能
$(document).ready(function () {
    //指定页面执行指定函数模式
    console.log(location.pathname)
    //定义对象，不同的location.pathname，指定相应的do_script函数
    let page_action = {
        // 笔试审核已完成列表
        "/EduOAOld/Personal/MessageSend.aspx": {
            "do_script": MessageSend,
        },
    }
    //如果访问页面的pathname在page_action中已定义，则执行对应的功能函数
    if (page_action.hasOwnProperty(location.pathname)) {
        page_action[location.pathname].do_script()
    }
});

function MessageSend() {
    let phone_number_textarea = $("textarea[name='txt_InputMobilePhone']")
    phone_number_textarea.parent().prepend(
        "<textarea rows=\"2\" cols=\"20\" id=\"mytext\" style=\"height:50px;width:400px;\"></textarea>" +
        "<div>↑↑↑在上面粘贴用换行隔开的手机号↑↑↑</div>"
    )
    $("#mytext").bind('input propertychange', function () {
        phone_number_textarea.val($(this).val().replace(/\n/g, ','))
        $(this).css("height", $(this).val().split("\n").length * 15.475 + 20)
    })

    $("#txt_SignName").val("宁波市教育考试院")

    $("#tr_VerifyCode").after("<td class='f2'></td><td><input type='button' id='autoinput' class=\"btnClassic_big\" value='自动填入验证码'/></td>")
    $("#autoinput").click(function () {
        $.ajax({
            type: 'get',
            url: '/EduOAOld/Personal/MessageSendBox.aspx',
            success: function (html) {
                let action_txt = $(html).find(".RowStyle").eq(0).find("td").eq(1).attr("onclick")
                let link = action_txt.replace("window.document.location.href='", "").replace("';", "")
                $.get(link, function (html2) {
                    // console.log(html2)
                    let a = $(html2).find("textarea:contains('短信发送验证码：')").text().replace("短信发送验证码：", "")
                    $("#txt_VerifyCode").val(a)
                    console.log(a)
                })
            }
        })
    })
}