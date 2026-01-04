// ==UserScript==
// @name         自动完成注册
// @namespace    测试部件
// @version      0.3
// @description  自动完成注册-测试部件
// @author       jinfeng.yan
// @match        *://b2b.wmyf.cn/wechat/register.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428779/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E6%B3%A8%E5%86%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/428779/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E6%B3%A8%E5%86%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log($);
    $(function(){
        $('#getSecurityCodeForRegister').after($('<div class="button button-big button-fill color-pink get-click-verify" id="getSendCode">点击获取</div>'));
        $('#getSecurityCodeForRegister').remove();
        $('#getSendCode').click(function(){
           var mobile = $('.item-input-lg-input[placeholder="手机号码"]').val();
            if(mobile){
                $.ajax({
                    url:'http://b2b.wmyf.cn/wechatmember/api/json/queryMember',
                    method:'post',
                    data:{"mobile":mobile},
                    success:function(data){
                        console.log(data.tip);
                        if(data.tip && !data.member){
                            $.ajax({
                                url:'http://b2b.wmyf.cn/wechatmember/api/json/sendCode',
                                method:'post',
                                data:{"mobile":mobile,"from":"weixin"},
                                success:function(data){
                                    console.log(data);
                                    // 验证码
                                    $('#mobile2').val(data.code);
                                    // 修改登录密码
                                    $('#password1').val(123123);
                                    // 修改推荐人
                                    $('input[placeholder="选填项"]').val('15034093621');
                                }
                            })
                        }else{
                            alert('手机号注册了');
                        }
                    }
                })
            }else{
                alert('输入正确手机号')
            }
        })
    })
})();