// ==UserScript==
// @name         (持续更新)爱奇艺iqiyi页面完全过滤净化(让你专注于视频|不影响功能使用|非跳过广告插件)
// @namespace    https://github.com/AdlerED
// @version      1.1.2
var version = "1.1.2";
// @description  轻量级TamperMonkey插件：屏蔽爱奇艺所有浮窗和非必要按钮/调整重要功能位置 By Adler(非屏蔽视频广告,不影响功能使用体验)
// @author       Adler
// @connect      www.iqiyi.com
// @include      *://*.iqiyi.com/*
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @note         19-03-01 1.0.6 更新了插件描述
// @note         19-02-26 1.0.5 增加了屏蔽"相关商品"的规则
// @note         19-02-25 1.0.4 修复了控制台疯狂报错的问题
// @note         19-02-24 1.0.3 修复了部分页面选择角色评论失效的问题
// @note         19-02-24 1.0.2 修复了泡泡广场无法消除的问题
// @note         19-02-14 1.0.1 更新了插件名和插件介绍
// @note         19-02-14 1.0.0 初版发布
// @downloadURL https://update.greasyfork.org/scripts/378207/%28%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%29%E7%88%B1%E5%A5%87%E8%89%BAiqiyi%E9%A1%B5%E9%9D%A2%E5%AE%8C%E5%85%A8%E8%BF%87%E6%BB%A4%E5%87%80%E5%8C%96%28%E8%AE%A9%E4%BD%A0%E4%B8%93%E6%B3%A8%E4%BA%8E%E8%A7%86%E9%A2%91%7C%E4%B8%8D%E5%BD%B1%E5%93%8D%E5%8A%9F%E8%83%BD%E4%BD%BF%E7%94%A8%7C%E9%9D%9E%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/378207/%28%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%29%E7%88%B1%E5%A5%87%E8%89%BAiqiyi%E9%A1%B5%E9%9D%A2%E5%AE%8C%E5%85%A8%E8%BF%87%E6%BB%A4%E5%87%80%E5%8C%96%28%E8%AE%A9%E4%BD%A0%E4%B8%93%E6%B3%A8%E4%BA%8E%E8%A7%86%E9%A2%91%7C%E4%B8%8D%E5%BD%B1%E5%93%8D%E5%8A%9F%E8%83%BD%E4%BD%BF%E7%94%A8%7C%E9%9D%9E%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("欢迎, 正在执行爱奇艺净化插件! PoweredBy Adler WeChat: 1101635162");
    var count = 0;
    if (count == 0){
        console.log("正在进行第一次Kill操作......");
        killAll();
    }
    var starting = setInterval(function(){
        count++;
        if (count > 50) {
            console.log("净化已完成! 请享受绿色的爱奇艺~");
            $("#green").html("已净化");
            clearInterval(starting);
        } else {
            if (count == 5) {
                //将猜你在追置顶(观看历史)
                console.log("正在置顶观看历史......");
                var today = $(".qy-focus-today").prop("outerHTML");
                $(".qy-focus-today").remove();
                $("#block-CZ").after(today);
                $(".qy-index-content").prepend(history);
                //所有页脚添加本插件信息
                $(".footer-copyright").append("<br>爱奇艺净化插件V" + version + "成功执行完毕 By Adler WeChat: 1101635162");
                $("#AR_copyright").append("<br>爱奇艺净化插件V" + version + "成功执行完毕 By Adler WeChat: 1101635162");
                //插件菜单
                var menuHead = '<div class="func-item func-like-v1" onclick="javascript:alert(\'爱奇艺净化插件V' + version + '已成功加载!\\n如有问题请联系WeChat: 1101635162\');"><div rseat="80521_function_like" class="func-inner"><span class="func-name" id="green">净化中...</span></div></div>';
                $(".qy-flash-func").append(menuHead);
                $("#green").html("净化10%");
            }
            //进度条
            if (count == 10)$("#green").html("净化20%");if (count == 15)$("#green").html("净化30%");if (count == 20)$("#green").html("净化40%");if (count == 25)$("#green").html("净化50%");if (count == 30)$("#green").html("净化60%");if (count == 35)$("#green").html("净化70%");if (count == 40)$("#green").html("净化80%");if (count == 45)$("#green").html("净化90%");
            console.log("正在干掉遗漏的浮窗(不会影响性能, 请无视该消息)......");
            killAll();
        }
    }, 100);
    //由于部分交互非即时打开, 所以一直循环
    setInterval(function(){
        //泡泡广场
        $(".csPp_square_entry").remove();
        //演员评论
        $(".csPpCircle_relatedWrap").remove();
        //相关商品
        $(".shop-flicker").remove();
        //替换"泡泡"
        var bubble = $(".csPpFeed_hd").prop("outerHTML");
        try {
           bubble = bubble.replace("泡泡", "评论");
        } catch(err) {}
        $(".csPpFeed_hd").prop("outerHTML", bubble);
    }, 500);
})();
function killAll() {
    //核心代码
    // ****** 主页 *****
    //顶栏VIP
    $("#nav_renewBtn").remove();
    //主页VIP按钮图片
    $(".nav-item-vip-imgN").remove();
    //主页VIP按钮文字
    $("#nav_sec_Z3").remove();
    $("#nav_sec_K5").remove();
    //主页分类栏
    //$(".qy-nav-wrap").remove();
    //顶栏客户端下载按钮
    $("#nav_appDown").remove();
    //右上角头像内选项卡
    $(".micro-userInfo-card").remove();
    $(".userFunWrap").remove();
    $(".user-point").remove();
    $(".detail-sd").remove();
    $(".nav-login-bottom").remove();
    //主页推广广告
    $(".qy-mod-ad").remove();
    //精彩推荐
    $(".qy-mod-wrap-side").remove();
    // ****** 视频播放页 *****
    //顶栏导航内会员精选
    $("#navFloat_Z3").remove();
    //右侧浮窗
    $("#block-V").remove();
    $("#block-V1").remove();
    //左侧浮窗
    $("#block-TP").remove();
    //右侧正品周边
    $(".qy-shop-bag").remove();
    //猜你喜欢
    $("#block-G").remove();
    //排行榜
    $("#block-K").remove();
    //推荐视频
    $(".qy-play-role-empty").remove();
    //举报按钮
    $(".func-report").remove();
    // ***** 其它页面 *****
    //播放历史记录右侧浮窗
    $("#block-W1").remove();
}
