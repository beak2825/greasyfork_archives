// ==UserScript==
// @name         三费审核
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  建议使用
// @author       jialiang_z
// @match        */NCMS-TELE/asserts/tpl/tele/billaccount/auditing.html*
// @match        */NCMS-TELE/asserts/tpl/tele/billaccount/auditing_check.html*
// @match        */NCMS-TELE/asserts/tpl/tele/telecontractcuring/auditCuring.html*
// @match        */NCMS-TELE/asserts/tpl/tele/telecontractcuring/elecContractAuditNewsCuring.html*
// @match        */NCMS-TELE/asserts/tpl/tele/payment/auditing.html*
// @match        */NCMS-TELE/asserts/tpl/tele/payment/auditing_check.html*
// @icon         https://www.google.com/s2/favicons?domain=240.219
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452203/%E4%B8%89%E8%B4%B9%E5%AE%A1%E6%A0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/452203/%E4%B8%89%E8%B4%B9%E5%AE%A1%E6%A0%B8.meta.js
// ==/UserScript==
function func1(){
    var flag = 0
    flag = window.location.href.search(/billacount\/auditing_check/i)>=0?1:0//1是报账点审核的界面
    flag = window.location.href.search(/elecContractAuditNewsCuring/i)>=0?2:0//2是固话审核的界面
    flag = window.location.href.search(/payment\/auditing_check/i)>=0?3:0//3是缴费单的界面
    if(flag!=0){
        $('#auditNote').text('通过')
        $('#nextUsersSelect').click()
        var name_list = $('#firstUsersSelect tr td:nth-of-type(2)')
        for(var i = 0; i < name_list.length; i++){
            if(name_list[i].innerText == '李智杰'){
                $(name_list[i]).click();break;
            }
        }
        $('#nextUsersList > div > div > div.modal-footer > input').click()
        var c = window.document.body.scrollHeight;

        window.scroll(0,c);
        var temp_now = new Date()

        var temp_past = new Date($('table#tb tr:last-of-type td:nth-of-type(3)').text())

        var time_btw = (temp_now.getTime() - temp_past.getTime())/(1000*60)
        if($('#nextUsersName').val() == '李智杰' && time_btw > 2){
            if(flag==2){
                auditNewsFormSubmit();
            }
            else{
                $('#saveSet').click()
            }
        }else{
            alert('不能提交')
        }
    }
    else{
        $('#tb > tbody > tr:last-of-type > td > input[type=checkbox]').click()
        $('body > div.btn-toolbar > button:nth-child(1)').click()
    }
}
(function() {
    'use strict';
    var nodetext = "\
    <div style='position: fixed;top: 250px;right: 20px;z-index: 999999999999;padding-right: 25px;' id='my_button'>\
        <button onclick='func1();' class='btn btn-info btn-lg' >审单</button>\
    </div>"
    $('body').append(nodetext)
    $('#my_button').click(function(){func1()})
})();