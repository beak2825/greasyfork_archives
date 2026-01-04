// ==UserScript==
// @name         爱学习会议系统
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  try to take over the world!
// @author       You
// @match        huiyi.gaosiedu.com/outlook/update/*
// @match        huiyi.gaosiedu.com/meeting/sing/*
// @match        huiyi.gaosiedu.com/meeting/create*
// @match        huiyi.gaosiedu.com/meeting/calendar*
// @match        huiyi.gaosiedu.com/meeting/homeQuickbooking*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418341/%E7%88%B1%E5%AD%A6%E4%B9%A0%E4%BC%9A%E8%AE%AE%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/418341/%E7%88%B1%E5%AD%A6%E4%B9%A0%E4%BC%9A%E8%AE%AE%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    $(function () {
        if (window.location.href.indexOf('calendar') > 0) {
            setTimeout(function () {

                $('.booking').each(function (index, element) {
                    var meetingId = $(this).attr('uid');
                    $(this).append(' <a href="/weixin/checkin/' + meetingId + '"  class="btn btn-primary btn-danger" target="_blank">签到</a>')
                })
            }, 3000);


        }
        $('#submit').after(' <button id="customer_btn" type="button" class="btn btn-primary btn-warning">解析邮箱</button>');
        $('#obj_externalParticipant').parent().parent().after('<div class="form-group"><label class="control-label col-lg-2 col-sm-2 col-xs-4"><span style="color:red">自定义解析邮箱</span></label><div class="col-lg-10 col-sm-8"><textarea class="form-control " id="obj_customer_emails" rows="4" placeholder="这里输入从企业微信拷贝的邮箱地址【复制群成员邮箱地址】"></textarea></div></div>');
        // $('#obj_customer_emails').html('这里输入从企业微信拷贝的邮箱地址【复制群成员邮箱地址】')
        $("#customer_btn").click(function () {

            var emails = $('#obj_customer_emails').val().replace('这里输入从企业微信拷贝的邮箱地址【复制群成员邮箱地址】', '').trim()

            if (emails.indexOf('@') > -1) {
                // alert(emails);

                $("#participants").empty(); // 首先清空select现在有的内容
                var emailArr = emails.split(';');
                var notFoundEmail;
                var total = 0;

                for (var i = 0; i < emailArr.length; i++) {
                    var emailItem = emailArr[i].trim();
                    if (emailItem.length < 1) {
                        continue;
                    }
                    total++;
                    console.log(emailItem);
                    $.ajax({
                        type: "post",
                        dataType: 'json',
                        url: "//huiyi.gaosiedu.com/organization/user/sySearch",
                        data: { departmentId: '', keyword: emailItem },
                        async: false,
                        success: function (data) {
                            if (data.usersArray) {
                                for (var userIndex = 0; userIndex < data.usersArray.length; userIndex++) {
                                    var userInfo = data.usersArray[userIndex];
                                    $("#participants").append("<option selected value=" + userInfo.id + ">" + userInfo.name + "</option>");
                                }
                            } else {
                                notFoundEmail += emailItem + ';';
                            }
                        }
                    });
                }

                toastr.success(total + '个参会人自动设置成功', '参会人设置成功')
                if (notFoundEmail) {
                    alert('未匹配到的邮箱地址：' + notFoundEmail)

                }


            } else {
                alert('请输入需要解析的邮箱地址');
                return;
            }

        });

        setTimeout(function () {

               var cancelMeetingItem = $('.cancelMeeting');
        debugger
        if(cancelMeetingItem.length==0){
        cancelMeetingItem=$('.mtheadtime');
        }

        if (cancelMeetingItem.length > 0) {
            var meetingId = $('.meetingId').val();
            // <a href="/weixin/checkin/"  class="btn btn-primary btn-danger" target="_blank">签到</a>
            cancelMeetingItem.after(' <a href="/weixin/checkin/' + meetingId + '"  class="btn btn-primary btn-danger" target="_blank">签到</a>');
        }
            }, 3000);
        // 签到开始
       
    });
})();