// ==UserScript==
// @name         明乐鼠标点击特效修改
// @namespace    http://www.cliwen.com/
// @version      1.0
// @description  鼠标点击时出现文字
// @author       mengle
// @match        *://*/*
// @icon         https://q.qlogo.cn/headimg_dl?dst_uin=1141605242&spec=100
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443735/%E6%98%8E%E4%B9%90%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/443735/%E6%98%8E%E4%B9%90%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    jQuery(document).ready(function ($) {
    $("html,body").click(function (e) {
        var dfs = [
            "您刚才的点击使计生局放开了" + Math.floor(Math.random() * 100) + "胎政策。",
            "您刚才的点击使黄石超级火山爆发了",
            "您刚才的点击使罗辑又换了一个女朋友",
            "您刚才的点击使小米公司收购了高通公司",
            "您刚才的点击引爆了" + Math.random() * 10000 + "光年外的一颗恒星",
            "您刚才的点击使头发变得乌黑浓密了",
            "您刚才的点击使您的波函数坍塌了",
            "您刚才的点击使您的银行卡被盗刷了",
            "您刚才的点击使普朗克常数扩大了十倍",
            "您刚才的点击熄灭了蓝色空间号二号主引擎",
            "您刚才的点击创造了一个小宇宙",
            "您刚才的点击使宇宙由开放转为闭合",
            "您刚才的点击让云天明和关一帆在一起了",
            "您刚才的点击使三体第" + Math.floor(Math.random() * 100) + "舰队起航了",
            "您刚才的点击使第" + Math.floor(Math.random() * 10000) + "号宇宙毁灭了",
            "您刚才的点击向太阳发射了一颗光粒",
            "您刚才的点击导致三体行星撞上他的主星",
            "您刚才的点击令人类文明将在" + (new Date()).getFullYear() + "年" + ((new Date()).getMonth() + 1) + "月" + (new Date()).getUTCDate() + "日23:59:59毁灭",
            "您刚才的点击启动了威慑系统",
            "您刚才的点击使谢顿计划脱离了正轨",
            "您刚才的点击使程心按下了威慑开关",
            "您刚才的点击引起了" + Math.random() * 10000 + "光年外一个行星的爆炸",
            "您刚才的点击使宇宙中产生了一些暗物质",
            "您刚才的点击引起了所有行星上的地震",
            "您刚才的点击使一台诺基亚摔碎了",
            "您刚才的点击使360云盘倒闭了",
            "您刚才的点击小米发布了MIX概念手机",
            "千万不要再次点击鼠标",
            "真的千万不要再次点击鼠标"
        ];
        var n = Math.floor(Math.random() * dfs.length + 1) - 1;   //随机获取一条数据
        var $i = $("<p/>").text(dfs[n]);      //新建一个b标签，并显示随机的话语
        var x = e.pageX, y = e.pageY;            //获取鼠标点击的x，和y
        $i.css({                            //为标签赋予css值
            "z-index": 99999,
            "top": y - 20,
            "left": x,
            "position": "absolute",
            "color": "#E94F06",
            "font-family": "微软雅黑",
            "cursor": "default",
            "-moz-user-select": "none",
            "-webkit-user-select": "none",
            "-ms-user-select": "none",
            "-khtml-user-select": "none",
            "user-select": "none",
        });
        $("body").append($i);               //在尾部插入
        $i.animate({ "top": y - 180, "opacity": 0 }, 1500, function () { $i.remove(); });     //动画消除
        e.stopPropagation();
    });
});
})();