// ==UserScript==
// @name         前程无忧垃圾过滤器（培训、骗子etc）
// @namespace    shunrong@me.com
// @version      1.0
// @description  过滤掉前程无忧的垃圾信息，需要自定义添加公司名
// @author       oushun
// @include      http://search.51job.com/*
// @include      https://search.51job.com/*
// @grant        GM_xmlhttpRequest
// @note         2017.05.31-V1.0
// @downloadURL https://update.greasyfork.org/scripts/30154/%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%E5%9E%83%E5%9C%BE%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88%E5%9F%B9%E8%AE%AD%E3%80%81%E9%AA%97%E5%AD%90etc%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/30154/%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%E5%9E%83%E5%9C%BE%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88%E5%9F%B9%E8%AE%AD%E3%80%81%E9%AA%97%E5%AD%90etc%EF%BC%89.meta.js
// ==/UserScript==

(function(){
    /*
      敬告：下列黑名单由由本人辛苦筛选、逐个添加而来的，若出现错漏，或误判，造成您的损失的，有种顺着网线过来打我啊（@-@）
    */

    /*
      自定义黑名单列表（若公司名过长,出现...,亦可直接复制，如深圳牵引力教育科技有限公司广州分...）

      以下是JAVA培训公司，具体列表可能不全，但几乎所有无经验、包吃住的开发都是培训
    */
    var blackList = [
        "深圳牵引力教育科技有限公司广州分...",
        "广州迈络信息科技股份有限公司",
        "广州即明网络科技有限公司",
        "广州码神信息科技有限公司",
        "广州市川石信息技术有限公司",
        "广州蜂陶信息技术有限公司",
        "广州森迪信息科技有限公司",
        "深圳前海星粤文化科技有限公司",
        "北京亨隆伟业财富投资管理有限公司",
        "广州庞昆科技有限公司",
        "广州东紫华清信息科技有限公司",
        "广州弗明雅网络科技有限公司",
        "广州东软睿道教育咨询有限公司",
        "广州森迪信息科技有限公司",
        "广州市舜然网络科技有限公司",
        "广州市民宇网络科技有限公司",
        "广州沃课信息技术有限公司",
        "广州神骏网络科技有限公司",
        "广州中卓信息技术有限公司",
        "广州市迅赢信息科技有限公司",
        "广州市酷卓网络科技有限公司",
        "广州市宏龙网络科技有限公司",
        "北京优才创智科技有限公司广州分公司",
        "创新工场-优才创智科技",
        "广州市颐创信息科技有限公司",
        "广东方堃科技有限公司",
        "广州凯佳卓软件科技有限公司",
        "海辰科技有限公司",
        "广州优才创智科技有限公司",
        "广州市云麓信息科技有限公司",
        "广州中弈信息科技有限公司",
        "广州八百方信息技术有限公司",
        "广州成教网络科技有限公司",
        "广州市汉威信息科技有限公司",
        "广州电软信息科技有限公司",
        "广州清汇信息科技有限公司",
        "广州思普计算机科技有限公司",
        "深圳市创友互联科技有限公司",
        "广州朝旭信息科技有限公司",
        "广州市享迪网络科技有限公司",
        "广州市中拓信息科技有限公司",
        "广州泾科网络有限公司",
        "义乌市鹊兴贸易商行",
        "广州澳源智享信息科技有限公司"
    ];

    var target = document.querySelectorAll("div.el");
    console.log("前程无忧信息过滤:");

    for (var i = 0;i < target.length; i++){
        if (target[i].querySelectorAll("span.t2>a")[0] != null){
            var node = target[i].querySelectorAll("span.t2>a")[0];

            for (var j = 0 ;j < blackList.length; j++){
                //公司名在黑名单中则删掉
                if (node.innerHTML.indexOf(blackList[j]) > -1){
                    target[i].remove();
                    console.log(node);
                }
            }
        }
    }

})();