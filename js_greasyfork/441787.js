// ==UserScript==
// @name         什么值得买
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @include        https://faxian.smzdm.com/h*s*
// @include        https://faxian.smzdm.com/9kuai9/h*s*
// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441787/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/441787/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var count = 0;
    var articleID;

    //localStorage.clear();
    if (localStorage.ID) {
        articleID = localStorage.ID.split(',');
        console.log(articleID.length);
    } else {
        articleID = [];
    }

    var mytimer;

    mytimer = setInterval(function () { Scroll(); }, 1500);
    console.log("开始滚动");
    function Scroll() {

        var h = $(document).height() - $(window).height();
        $(document).scrollTop(h);
        count += 1;
        console.log("第" + count + "次下拉结束");
        if (count >= 6) {
            clearInterval(mytimer);
            clear();
        }

    }

    function clear() {
        console.log("开始清除");

        console.log("清除售光");
        $('.sold-out').parent().remove();

        console.log("清除已读文章");
        articleID.forEach(myFunction2);
        function myFunction2(item, index) {
            $("li[articleid*='" + item + "']").remove();
        }

        //值数量为0清除
        if ($(".unvoted-wrap").text() == 0) {
            $(".unvoted-wrap").parent().parent().parent().parent().parent()
        }

        $(".unvoted-wrap").each(function(){
            if($(this).text()=="0"){
                console.log("清除值为0文章");
                $(this).parent().parent().parent().parent().parent().parent().remove();
            }
        });

        console.log("清除屏蔽关键词");
        var arr = [
            "日20点",
            "日0点",
            "点开始",
            //—————————————————————————— 食物
            //——————————归档
            "肥牛卷",
            "羊肉串",
            "生蚝",
            "火锅底料",
            "黑虎虾",
            "基围虾",
            "小龙虾",
            "腊肠",
            "腊肉",
            "牛肉酱",
            //——————————品牌
            "蟹状元",
            "旺旺",
            "百草味",
            "三只松鼠",
            "周黑鸭",
            "徐福记",
            "趣多多",
            "百事可乐",
            "友臣",
            "巧乐兹",
            "元气森林",
            "葡萄假日",
            "脆香米",
            "汉堡王",
            //——————————酒
            "白酒",
            "红酒",
            "葡萄酒",
            "啤酒",
            "白兰地",
            "解百纳",
            "茅台酒",
            "梅酒",
            "米酒",
            "麦德基",
            "气泡酒",
            "威士忌",
            //——————————饮料
            "加多宝",
            "酸奶",
            "可乐",
            "汽水",
            "冰红茶",
            "柠檬茶",
            //——————————水果
            "丑橘",
            "冰糖橙",
            "榴莲",
            "菠萝蜜",
            "粑粑柑",
            //——————————零食
            "蛋糕",
            "火腿肠",
            "披萨",
            "鸭脖",
            "螺蛳粉",
            "软糖",
            "酸辣粉",
            "牛肉干",
            "肉脯",
            "大麻花",
            "酸牛奶",
            "麦丽素",
            "饼干",
            "沙琪玛",
            "手抓饼",
            "玉米肠",
            "薯片",
            "烤肠",
            "泡椒凤爪",
            "巴旦木",
            "锅巴",
            "火鸡面",
            "果冻",
            "肉松饼",
            "鸭胗",
            "亲嘴烧",
            //—————————————————————————— 数码产品
            "电视盒子",
            "平板电脑",
            "蓝牙耳机",
            //—————————— 游戏
            "Xbox",
            "PlayStation",
            "任天堂",
            //—————————— 电脑
            "带鱼屏",
            "显示器",
            "显卡",
            "游戏本",
            //—————————————————————————— 家用电器
            "燃气热水器",
            "空气炸锅",
            "液晶电视",
            "微波炉",
            "电动牙刷",
            "除湿机",
            "壁挂式空调",
            "多门冰箱",
            "对开门冰箱",
            "电饭煲",
            "洗碗机",
            //—————————————————————————— 杂项
            "面膜",
            "猫粮",
            "狗粮",
            "犬粮",
            "猫砂",
            "无人机",
            "机油",
            "口罩",
            "中国联通",
            "滤水壶",
            "润滑油",
            "划船机",
            "卫生巾",
            "改良旗袍",
            "凉拖鞋",
            "洛丽塔",
            "雨刮器",
            "马桶盖",
        ];

        arr.forEach(myFunction);
        function myFunction(item, index) {
            //按字段清除
            if ($(".feed-ver-title:contains('" + item + "')").length > 0) {
                console.log("清除 " + item + " " + $(".feed-ver-title:contains('" + item + "')").length + "个");
                console.log($(".feed-ver-title:contains('" + item + "')").text().trim().replace(/\s+/g, ""));
                $(".feed-ver-title:contains('" + item + "')").parent().parent().remove();
            }
        }

        $(".feed-list-col>li").each(
            function () {
                articleID.push($(this).attr("articleid").slice(2));
            }
        );
        localStorage.setItem("ID", $.unique(articleID) );
        console.log(articleID.length);
    }

    //localStorage.clear();

})();