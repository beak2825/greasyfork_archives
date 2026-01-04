// ==UserScript==
// @icon         https://mp.weixin.qq.com/favicon.ico
// @name         微信公众平台-数据助手
// @namespace    http://www.yuchunlai.com/
// @version      1.0.0
// @description  在微信后台增加数据助手
// @author       余春来
// @match        https://mp.weixin.qq.com/cgi-bin/*
// @grant        none
// @require      https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/382683/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%B9%B3%E5%8F%B0-%E6%95%B0%E6%8D%AE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/382683/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%B9%B3%E5%8F%B0-%E6%95%B0%E6%8D%AE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var biz = window.wx.commonData.data.uin_base64
    var nick_name = window.wx.commonData.data.nick_name;
    var param = window.wx.commonData.data.param;
    //获取当前日期加减天数后的日期
    function get_wx_date(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        var date = y+"-"+m+"-"+d;
        //date = String(date.replace(/\b\d{1}\b/g,'0$&').replace(/\//g,'-'));
        return date;
    }
    var begin_date = get_wx_date(-101);
    var end_date = get_wx_date(-1);
    var usurl = "https://mp.weixin.qq.com/misc/useranalysis?&download=1&begin_date="+begin_date+"&end_date="+end_date+"&source=99999999"+param;
    var msurl = "https://mp.weixin.qq.com/misc/appmsganalysis?action=report&begin_date="+begin_date+"&end_date="+end_date+"&type=daily&download=1&source=99999999"+param
    var dburl = "https://mp.weixin.qq.com/cgi-bin/frame?t=ad_system/common_frame&t1=publisher/publisher_report&pos_type=bottom"+param
    var wzurl = "https://mp.weixin.qq.com/cgi-bin/frame?t=ad_system/common_frame&t1=publisher/publisher_report&pos_type=middle"+param
    var down_html = '<div class="weui-desktop-panel">\
<a style="margin : 0px 10px 0px 10px;" href='+usurl+'>\
下载用户分析数据\
</a>\
<a style="margin : 0px 10px 0px 10px;" href='+msurl+'>\
下载图文分析数据\
</a>\
<a style="margin : 0px 10px 0px 10px;" href='+dburl+'>\
下载底部广告数据\
</a>\
<a style="margin : 0px 10px 0px 10px;" href='+wzurl+'>\
下载文中广告数据\
</a>\
</div>'

    //首页插入下载链接
    function main_bd()
    {
        var div_tag = $("div.main_bd");
        if (div_tag)
        {
            div_tag.prepend(down_html)
        }
    }

    $(main_bd);


    // Your code here...
})();