// ==UserScript==
// @name         斗鱼抢鱼丸
// @namespace    
// @version      1.3.2
// @description  斗鱼的快速抢鱼丸!会自动关闭窗口。
// @copyright    随便
// @include      http://www.douyutv.com/*
// @match        http://www.douyutv.com/*
// @supportURL   https://greasyfork.org/zh-CN/scripts/16577-斗鱼抢鱼丸/feedback
// @license      LGPLv3
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/16577/%E6%96%97%E9%B1%BC%E6%8A%A2%E9%B1%BC%E4%B8%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/16577/%E6%96%97%E9%B1%BC%E6%8A%A2%E9%B1%BC%E4%B8%B8.meta.js
// ==/UserScript==

(function () {
    var ii = 0,TT = true,zb_name;
    function dy() {
        var aa = setInterval(function () {
            //  console.log('bb');
            if ($(".peck-cdn").text() == "领取" && !$(".peck-cdn").is(":hidden")) {
                $(".peck-cdn,#right_col_peck").click();
                console.log("点击");
                TT = false;
                ii=ii+1;
            } else if ($(".peck-cdn").is(":hidden")) {
                console.log("!点击");
                clearInterval(aa);
            }
        }, 10);        
        var bb = setInterval(function () {
            // console.log('aa');
            if (!$(".peck-cdn").is(":hidden")) {
                // console.log($("#sendmsg span").text());

                $("#chart_content").val('喜欢 ' + zb_name + ' 的朋友请点一下关注~！    ' + textRandom(4));
                $("#sendmsg_but").click();
                ctrlclear('chat_line_list');
                console.log("发送");
                TT = false;
                ii=ii+1;
            } else {
                clearInterval(bb);
                console.log("!发送");
                // 关闭窗口
                if($('#right_col_peck').css("display")=="none" && $(".js_r_btn.follow_btn.yet").css("display")=="none" && ii>=2){
                    console.log("即将关闭窗口");
                    popUp();
                }
                $("#chart_content").val('');
                TT = true;
            }
        }, 250);
    }
    function _start__() {
        if(document.getElementById("chat_line_list")!=null){
            $(".peck-cdn").bind('DOMNodeInserted',function (){
                if($(".peck-cdn").is(":hidden")){
                    TT = true;
                }
                // console.log(TT);
                if(TT == true && $(".loginShow.fl.js_login_no").css("display")=="none"){
                    zb_name = $('.zb_name').text();
                    dy();
                }
            });
            clearInterval(EE);
            console.log('t');
        }else{
            console.info('当前不是在直播间');
            clearInterval(EE);
        }
    }
    // 随机字符串、数字、符号
    function textRandom(num)
    {
        var text="";
        for(i=1;i<=num;i++)
        {
            var strRadom=Math.floor(Math.random() * 100) +1;
            text = String.fromCharCode(strRadom) + text;
        }
        return text;
    }
    function popUp(){
        var e;
        $.dialog({icon: "question",content:'如果不想看到这个提示，<br/>请点一下<a class="js_r_btn follow_btn gz" href="javascript:;" title="关注">关注</a>，<br/>以后就没有这个提示了！',lock: true,cancelVal: "取消",cancel: function() {
            clearInterval(e);
            $.dialog.tips_black("已取消关闭窗口！", 3);
        },init: function() {
            var h = this, f = 12;
            var g = function() {
                h.title("<b style='color: #F3FF00;'>" + f + "</b>秒后关闭当前窗口！");
                if(!$(".peck-cdn").is(":hidden")){
                    $.dialog.tips_black("检测到火箭，取消关闭窗口！", 3);
                    h.close();
                }
                if(f===0){
                    window.close();
                }
                !f && h.close();
                f--
            };
            e = setInterval(g, 1000);
            g();
            // 点击关注
            $(".js_r_btn.follow_btn.gz").click(function (){
                clearInterval(e);
                follow_room();
                h.close();
                $.dialog.tips_black("已取消关闭窗口！", 3);
            }).css({"float":"none","display":"none"});
            $(".js_r_btn.follow_btn.gz").fadeIn(1000);
        },close: function() {
            clearInterval(e);
        }}).show();
    }
    var EE = setInterval(function () {
        if($(".peck-cdn").text()!=""){
            console.log('EE');
            _start__();
        }
    }, 3000);
})();