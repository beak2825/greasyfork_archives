// ==UserScript==
// @name         虚拟货币提醒【嘀嘀】
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  通过设置指定数量高亮并提醒
// @author       Anders
// @match        http://*.natappfree.cc/wx.php*
// @require      https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403134/%E8%99%9A%E6%8B%9F%E8%B4%A7%E5%B8%81%E6%8F%90%E9%86%92%E3%80%90%E5%98%80%E5%98%80%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/403134/%E8%99%9A%E6%8B%9F%E8%B4%A7%E5%B8%81%E6%8F%90%E9%86%92%E3%80%90%E5%98%80%E5%98%80%E3%80%91.meta.js
// ==/UserScript==

(function() {
    $("#data").after(`<audio src="http://hao.haolingsheng.com/ring/000/994/428667bc54ad582ada5aefff9b60bab6.mp3" id="bibibi" style="display: none;"/>`);
    //定时器 异步运行
    function hello(){
        window.location.reload();
    }
    //使用方法名字执行方法
    var t1 = window.setTimeout(hello,5000);

    var cookies_min_count = $.cookie('min_count');
    if (cookies_min_count === undefined) {
        cookies_min_count = 100;
    }

    // 在页面中生成一个表单
    $("#data").after(`输入要最小数量：<input value="${cookies_min_count}" id="min_count" /><button type="button" id="stop_reload">保存</button>`);

    var str_data = $("#data").text();
    var json_data = JSON.parse(str_data);
    $.each(json_data.dataList, function(i,item) {
        if(item.cointotal >= cookies_min_count) {
            $(document).find("#bibibi")[0].play();
            $("#tr"+i).css("background-color", "pink")
            return false;
        }
    });

    $(document).find("#stop_reload").click(function(){
        console.log("保存");
        var min_count = $("#min_count").val();
        $.cookie('min_count', min_count, { expires: 365 });
    })
})();