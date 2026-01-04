// ==UserScript==
// @name         微信昵称头像
// @namespace    https://www.v587.com/
// @version      1.00
// @description  更新微信公众号对应和昵称和头像
// @author       penrcz
// @match        https://mp.weixin.qq.com/cgi-bin/user_tag*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/440037/%E5%BE%AE%E4%BF%A1%E6%98%B5%E7%A7%B0%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/440037/%E5%BE%AE%E4%BF%A1%E6%98%B5%E7%A7%B0%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;

    //获取token
    var token = getQueryVariable("token");
    //_p(token);

    //一键更新
    $(".tool_area").after('<a class="btn updateAllimg">一键更新</a>');
    $(".updateAllimg").click(function(){


        //$(".js_msgSenderRemark").before(ob);
        $.each($(".js_msgSenderRemark"),function(i,n){
            var openid = $(n).attr("data-fakeid");
            updateImg(openid);
        });
    });




    function updateImg(user_openid){
        //var _this = $(this);
        var url = "https://mp.weixin.qq.com/cgi-bin/user_tag?action=get_fans_info";
        //_this.html("更新中...");
        var random = Math.random();//随机数
        //var user_openid = $(this).attr("openid");
        //token=565647482&lang=zh_CN&f=json&ajax=1&random=0.6307453250577834&user_openid=oKZpvs3-_3xBg8eg0gOIdAFTLIsk
        $.post(url, { token: token, lang: "zh_CN", f: "json", ajax: "1", random: random, user_openid: user_openid } ,function(data){
            var user_info = data.user_list.user_info_list[0];
            var user_name = user_info.user_name;
            var user_head_img = user_info.user_head_img;
            var user_remark = user_info.user_remark;//备注
            //替换头像
            user_head_img = user_head_img.replace("http://wx.qlogo.cn/", "//thirdwx.qlogo.cn/");
            user_head_img = user_head_img.replace("/0", "/132");
            _p(user_head_img);

            //上传昵称和头像
            var up_url = "https://signin.v587.com/weixin/refreshWxNameFromMp?n="+user_name+"&img="+user_head_img+"&openid="+user_openid;
            $.get(up_url,function(redata){
                var status = redata.status;
                var info = redata.info;
                if(status == 'y'){
                    //_this.html("更新成功");
                    $(".js_msgSenderRemark").attr("data-fakeid",user_openid).html("更新成功");
                    if(user_remark != info){
                        //判断是否更新备注
                        var random = Math.random();//随机数
                        //token=565647482&lang=zh_CN&f=json&ajax=1&random=0.9639168182274337&user_openid=oKZpvs4reAQHOS_rKeI8OIuk76Ac&mark_name=%E9%99%88
                        var mark_url = "https://mp.weixin.qq.com/cgi-bin/user_tag?action=add_mark";
                        $.post(mark_url, { token: token, lang: "zh_CN", f: "json", ajax: "1", random: random, user_openid: user_openid,mark_name:info } ,function(data){

                        });
                    }

                }else{
                    alert("更新失败:"+info);


                }
            });


        });
    };

})();

/**
 * 打印
 */
function _p(obj){
    console.log(obj);
}

/**
 * 获取url参数
 *
 */
function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

