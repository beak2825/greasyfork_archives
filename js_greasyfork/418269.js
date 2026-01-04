// ==UserScript==
// @name           lazada回复机器人
// @namespace	  www.hqf.pub
// @description   此lazada脚本注意事项：1.一个站点的url仅仅会回复当前站点的信息(需要打开多个站点标签页，回复比较稳定) 2.lazada需设置魔自动回复模板(默认回复第一条信息)
// @version       0.0.1
// @include       https://sellercenter.lazada.com.my/apps/im/*
// @include       https://sellercenter.lazada.co.th/apps/im/*
// @include       https://sellercenter.lazada.vn/apps/im/*
// @include       https://sellercenter.lazada.com.ph/apps/im/*
// @include       https://sellercenter.lazada.co.id/apps/im/*
// @include       https://sellercenter.lazada.sg/apps/im/*

// @grant		  unsafeWindow
// @noframes
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @connect	  hqf.ngrok.hqf.pub
// @downloadURL https://update.greasyfork.org/scripts/418269/lazada%E5%9B%9E%E5%A4%8D%E6%9C%BA%E5%99%A8%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/418269/lazada%E5%9B%9E%E5%A4%8D%E6%9C%BA%E5%99%A8%E4%BA%BA.meta.js
// ==/UserScript==

//respToContent 回复的文本信息
// var respToContent = 'Dear customer, we are on the weekend and have no access to your message. But rest assured, we will reply to you as soon as possible on Monday, you can：\n 1.Make an order directly, early order early delivery.\n 2.For logistics issues, please kindly contact with lazada customer care. ';
//waitMessageLoadTime 打开未读消息后等待对话框加载的时间 需小于respToNextTime
var waitMessageLoadTime = 3000;
//respToNextTime 每条消息回复的间隔时间 需大于waitMessageLoadTime
var respToNextTime = waitMessageLoadTime+7000;
//indexNum 当前经过了多少个页面间隔时间 禁止修改
var indexNum = 0;
//openORCloseTime 打开新页面或者关闭之前打开页面的间隔时间
var openORCloseTime = 15000;

(function() {
    'use strict';
    console.log('1:进入lazada客服自动回复js脚本');
    var zhiziLazada = {
        //初始化函数
        init:function (){
            window.setInterval(function() {
            // window.setTimeout(function () {
                console.log('2:lazada自动回复检测消息')
                //检测站点的匹配：
                //一个站点，需要打开一个网址进行检测，防止消息回复出错
                var allSites = $(".im-page-header-right .simple-tab .tab-item");
                var currentSite = "";
                for (var i = 0; i < allSites.length; i++) {
                    var currentSelect = allSites.eq(i);
                    if (currentSelect.attr("class").indexOf("selected")>-1){
                        currentSite = currentSelect.text().substring(0,2);
                        break;
                    }
                }
                var currentSiteMap =  zhiziLazada.getMapSite(currentSite);
                if ( currentSiteMap != window.location.origin){
                    console.log("当前【聊天站点】与【网址不匹配】，不回复消息，当前【聊天站点】：" +currentSite +"，网址站点："+ window.location.origin );
                    alert("当前【聊天站点】与【网址不匹配】，不回复消息，当前【聊天站点】：" +currentSite +"，网址站点："+ window.location.origin );
                    return ;
                }else {
                    console.log("站点匹配成功，自动回复。当前【聊天站点】：" +currentSite +"，网址站点："+ window.location.origin );
                }
                //点击到右侧的[Assign to me]
                // $(".search-bar li.tab-item").eq(1).click();
                var badge = $(".content .badge");
                if (badge.length > 0) {
                    console.log('3:进入未读回话框，回话数为' + badge.eq(0).text());
                    //点击出聊天框
                    badge.click();
                    window.setTimeout(function () {
                        //信息数大于0，则进行回复
                        if (0 < document.getElementsByClassName("message-row").length) {
                            //点击快速回复列表
                            $(".im-icon-dialogue").click()
                            //点击第一个魔板进行发送
                            $(".quick-reply__item").eq(0).click();
                            //点击发送按钮
                            $(".im-icon-paper-plane").click()
                        }
                        //点击左侧[all]
                        // $(".search-bar li.tab-item").eq(0).click()
                    }, waitMessageLoadTime);
                }else {
                    console.log("当前无最新消息")
                }
            }, respToNextTime);
        },
        /**
         * 根据站点，匹配
         * @param currentSite
         * @returns {any}
         */
        getMapSite:function (currentSite){
            var mapObj = new Map();
            mapObj.set("SG", "https://sellercenter.lazada.sg");
            mapObj.set("TH", "https://sellercenter.lazada.co.th");
            mapObj.set("VN", "https://sellercenter.lazada.vn");
            mapObj.set("PH", "https://sellercenter.lazada.com.ph");
            mapObj.set("ID", "https://sellercenter.lazada.co.id");
            mapObj.set("MY", "https://sellercenter.lazada.com.my");
            var site = mapObj.get(currentSite);
            return site;
        }
    }
    //调用函数后，自动运行
    zhiziLazada.init();
    unsafeWindow.zhiziLazada = zhiziLazada;
})();


