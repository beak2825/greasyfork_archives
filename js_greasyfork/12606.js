// ==UserScript==
// @name        新浪微博屏蔽关键字
// @author      林岑影
// @description 新浪微博屏蔽关键字和垃圾用户
// @namespace   
// @icon        http://disk.yun.uc.cn/favicon.ico
// @license     GPL version 3
// @encoding    utf-8
// @date        22/09/2015
// @modified    22/09/2015
// @include     http://weibo.com/*
// @include     http://www.weibo.com/*
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @run-at      document-end
// @version     1.0.3
// @downloadURL https://update.greasyfork.org/scripts/12606/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/12606/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E5%AD%97.meta.js
// ==/UserScript==

function sblock() {
    var sinablock = ["特惠", "瘦身", "减肥", "促销", "折扣", "开网店", "开店", "瘦腿", "丰胸", "特卖", "店主", "狐臭", "加Q", "腋臭", "魔白", "玛卡", "特卖", "全场满", "汇美丽", "活动价", "现价", "活动期间", "团购", "最低价", "贫乳妹", "事业线", "减肥贴", "正品", "特价", "痘痘", "私信", "私 信"],
        userblock = ["专业", "健身", "发型", "服饰", "搭配", "旅行"],
        feed = document.querySelectorAll('.WB_feed > .WB_cardwrap:not(.blocked)'),
        wblength = feed.length,
        blenth = sinablock.length,
        ulenth = userblock.length,
        i, j;
    if (wblength > 0) {
        console.log("开始从" + wblength + "条数据中查找...");
        for (i=0; i<wblength; i++) {
            var that = feed[i],
                text = that.querySelector(".WB_text") ? gettext(that.querySelectorAll(".WB_text")) : "";
            var user = that.querySelector(".WB_info") ? gettext(that.querySelectorAll(".WB_info")) : "";
            if (text!="") {
                for (j=0; j<blenth; j++) {
                    var val = sinablock[j];
                    if (text.indexOf(val)>-1) {
                        console.log("发现关键字: "+val);
                        that.innerHTML = "广告...";
                        that.style.padding = '10px';
                        break;
                    }
                }
            }
            if (user!="") {
                for (k=0; k<ulenth; k++) {
                    var val = userblock[k];
                    if (user.indexOf(val)>-1) {
                        console.log("发现垃圾用户: "+val);
                        that.innerHTML = "垃圾用户...";
                        that.style.padding = '10px';
                        break;
                    }
                }
            }
            that.className += ' blocked';
        }
        console.log("查找结束...");
    }
}
function gettext(dom) {
    var text = "", i, l = dom.length;
    for (i = 0; i<l; i++) {
        text+=(text == "" ? "": " | ")+dom[i].innerText;
    }
    return text;
}
sblock();
setInterval(function(){
    sblock();
}, 5000);