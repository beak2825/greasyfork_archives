// ==UserScript==
// @name         逛丢
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  blacklist for guangdiu.com
// @author       digiprospector
// @match        guangdiu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410070/%E9%80%9B%E4%B8%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/410070/%E9%80%9B%E4%B8%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let blacklist = ["一叶子","花洒","燕窝","虾选","硒鼓","高仕","羽森蛇毒","BB霜","发胶","胶原蛋白","蔻驰","防撞贴","马扎","采乐","雅顿","后视镜","集成灶","美迪惠尔","滋源","珂润","宝路华","项链","古驰","电饼铛","婴儿推车"
                    ,"大麦茶","理肤泉","吸乳器","宅知味","奶瓶","辣木籽","卫生巾","威士忌","磷虾油","药都仁和","自然之珍","ThinkPad","葆丽匙","茅台镇","妈咪宝贝","游戏本","阿道夫","Dermazulene","吃鸡神器","山地自行车","车载","北欧海盗"
                    ,"糖果","抹胸","每日坚果","粉底","美瞳","面膜","打印纸","空调","酵母","玻璃水","草本相宜","文胸","车蜡","汽车轮胎","方向盘套","滋色","电磁炉","护肤","粉扑","酮康唑","锁骨链","猫砂","热水器","冰箱","科莱丽","KRAUS"
                    ,"简丹","百年修正","瓜子养车","移动电源","狗粮","燃气灶","彩色激光一体机","宠物","彩色喷墨无线一体机","彩色喷墨一体机","铁观音","汽油添加剂","激光一体机","天梭","蓝牙音箱","枸杞","胎压监测器","Sofy","维多利亚的秘密"
                    ,"白酒","遮瑕盘","精华液","眼霜","减肥","防晒喷雾","路亚","白兰地","SWAROVSKI","钢笔","饮水机","红参","SOFINA","瑜伽环","床垫","蕾丝","红酒","电饭煲","破壁","小肝茶","桃胶","驱虫药","化妆品","拉拉裤","家居摆件","脚气"
                    ,"乳胶枕","挂烫机","碧生源","雨衣","雅诗兰黛","蒸汽眼罩","双人床","热水袋","兰蔻","深海鱼油","彩妆","丁字裤","CC霜","围兜","阿玛尼","笔记本电脑","牙胶", "藏红花","软骨素","眼部精华"]
    let node_lis = document.querySelectorAll(".gooditem");
    let len = node_lis.length;
    //console.log(node_lis)
    for (let i = 0; i < len; i++) {
        let a = node_lis[i];
        //console.log(a.querySelector("a.goodname").title)
        for (let j = 0; j < blacklist.length; j++)
        {
            if (a.querySelector("a.goodname").title.includes(blacklist[j]))
            {
                a.style.display = "none"
                break
            }
        }
    }
    // Your code here...
})();