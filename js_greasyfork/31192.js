// ==UserScript==
// @name         bawang
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://evt.dianping.com/midas/1activities/a7037Ie879zZAlYYQ/index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31192/bawang.user.js
// @updateURL https://update.greasyfork.org/scripts/31192/bawang.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var imgURL,
        vcode,
        signature,
        canDrawDay = 7,
        canDrawTime = 10;
    var getCaptcha = function() {
        $('.J_pop .pop_input').val('');
        $.ajax({
            // url:  '//w.51ping.com/account/ajax/getCaptcha',
            url: '//www.dianping.com/account/ajax/getCaptcha',
            dataType: 'jsonp',
            success: function(data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                if (data.code == 200) {
                    imgURL = data.msg.url;
                    signature = data.msg.signature;
                    $('.J_pop .pop_img img').attr('src',imgURL);
                }
            }
        });
    };

    var sechdule = function(target, callback){
        var t = new Date();
        var str = t.toLocaleString("zh-cn",{ hour12: false }).split(" ")[0];
        var start = t.getTime();
        var end = new Date(str + " " + target + ":00:00").getTime();
        setTimeout(callback, (end - start) / 1);

    };

    setTimeout(function(){
        console.log(1);
        var t = $(".has-certification").text() + " 外挂激活成功";
        $(".has-certification").text(t);
        $('.submit img').attr('src','img/useful_btn.png');
        $('.submit').unbind("click").click(function () {
            Stts.special('确认提交');
            getCaptcha();
            $('.J_pop').removeClass('hide');
            $(".overlay.J_pop").css("background","none");
            $('.pop').css("background","black");
            $(".has-certification").text("请输入验证码 10点自动提交");
            var t = new Date();
            if(t.getHours()<=10){
                sechdule(10, function(){$('.J_pop .pop_sure').click();});
            }else{
                alert("请10点前使用外挂");
            }
        });
    }, 5000);
})();