// ==UserScript==
// @name        京东金融-小游戏
// @namespace   https://greasyfork.org/zh-CN/scripts/400136
// @match	    https://prodev.m.jd.com/jdjr/active/4VE6AewA8CFAiLtykFc2wEjbWaVy/index.html
// @match       https://*.jr.jd.com/uc-fe-wxgrowing/cloudpig/index/*
// @match       https://*.jr.jd.com/uc-fe-wxgrowing/moneytree/index/*
// @match       https://active.jd.com/forever/btgoose/*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.7
// @author      Lucas(?????????@qq.com)
// @update      Lucas(?????????@qq.com)
// @description 京东金融里面的一些小游戏. 实际上就猪和鹅可以挂挂。有可能会出现“提示抱歉，您暂时无法参加此活动”/“请使用金融APP”这个就不能用了。F12调试模式手机模式：https://prodev.m.jd.com/jdjr/active/4VE6AewA8CFAiLtykFc2wEjbWaVy/index.html
// @downloadURL https://update.greasyfork.org/scripts/400136/%E4%BA%AC%E4%B8%9C%E9%87%91%E8%9E%8D-%E5%B0%8F%E6%B8%B8%E6%88%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/400136/%E4%BA%AC%E4%B8%9C%E9%87%91%E8%9E%8D-%E5%B0%8F%E6%B8%B8%E6%88%8F.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
        reloadpage();
        Everyoneisplaying();
        goodapple();
        pig();
        goose();
    }, 4000);
})();

function log() {
    var text = '%c';
    for(var i=0;i<arguments.length;i++){
        text += arguments[i]+' ';
    }
    console.log(text, 'color: #43bb88;font-size: 14px;font-weight: bold');
}

function reloadpage() {
    let timeid = setInterval(function() {
        var myDate = new Date();
        var hours=myDate.getHours();
        var reload_page = GM_getValue("reload_page");
        if (typeof(reload_page)=="undefined") {
            GM_setValue("reload_page","start");
        }

        //每4小时刷新一下当前页面
        var reload=(hours%4);
        if (reload==0&&reload_page=="start") {
            GM_setValue("reload_page","stop")
            window.location.reload();
        };
        if (reload!=0&&reload_page=="stop") {
            GM_setValue("reload_page","start")
        };
        log("reload_page",reload_page,"reload",reload)
    }, 10000);
}

function Everyoneisplaying() {
    log('奥利给！！！大家都在玩，开干~');
    log(new Date());

    let timeid = setInterval(function() {
        var myDate = new Date();
        var hours=myDate.getHours();
        var mins=myDate.getMinutes();
        var secs=myDate.getSeconds();
        var url=window.location.href;

        var uua="https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/?Channel=jhy"
        var u="https://u.jr.jd.com/uc-fe-wxgrowing/moneytree/index/?channelLV=dao"

        //判断是否在任务中心
        var reg = RegExp(/prodev.m.jd.com\/jdjr\/active/);
        if (url.match(reg)){
            //每5小时跳转到金果页面看看
            var jump=(hours%5);
            if (jump==0&&mins==0&&secs<10) {
                window.location.replace(uua);
            };
        }
    }, 60000);
}


function goodapple() {
    log('奥利给！！！种摇钱树，开干~');
    log(new Date());

    let timeid = setInterval(function() {
        var myDate = new Date();
        var hours=myDate.getHours();
        var mins=myDate.getMinutes();
        var secs=myDate.getSeconds();

        //金果==========================================
        if (document.getElementsByClassName("modal-btn")[0]) {
            log("需要APP,退出");
            setTimeout(function() {
                document.getElementsByClassName("modal-close")[0].click();
            },4000);
            //返回到主页
            window.location.replace("https://prodev.m.jd.com/jdjr/active/4VE6AewA8CFAiLtykFc2wEjbWaVy/index.html");
        }
        else {
            if (document.getElementsByClassName("tree-volume")[0]) {
                var s = document.getElementsByClassName("tree-volume")[0].innerText;
                var num = document.getElementsByClassName("tree-curnum")[0].innerText;
                var numup= s.replace(/[^0-9]/ig,"");
                num = num.replace(/[^0-9]/ig,"");
                numup = parseFloat(numup);
                num = parseFloat(num);
                log("金果 ->> " + num + "/" + numup );
                if (num >= 20) {
                    log("金果到" + num);
                    document.getElementsByClassName("tree-btn")[0].children[0].click();
                    //返回到主页
                    window.location.replace("https://prodev.m.jd.com/jdjr/active/4VE6AewA8CFAiLtykFc2wEjbWaVy/index.html");
                };
            };
        }

    }, 10000);
}





function pig() {
    log('奥利给！！！全民养小猪，开干~');
    log(new Date());

    GM_setValue("sign","签到")

    let timeid = setInterval(function() {
        var myDate = new Date();
        var hours=myDate.getHours();
        var mins=myDate.getMinutes();
        var secs=myDate.getSeconds();

        //0:6:0~0:0:10刷新一次
        if (hours==6&&mins==0&&(secs>=0&&secs<=10)) {
            window.location.reload();
        }

        //小猪礼盒
        if (document.getElementsByClassName("precious precious-one precious-pos-1 springback")[0]) {
            log("小猪礼盒1");
            document.getElementsByClassName("precious precious-one precious-pos-1 springback")[0].click();
        };
        if (document.getElementsByClassName("precious precious-one precious-pos-2 springback")[0]) {
            log("小猪礼盒2");
            document.getElementsByClassName("precious precious-one precious-pos-2 springback")[0].click();
        };
        //签到
        var sign=GM_getValue("sign");
        if (hours==7&&sign=="签到") {
            if ( document.getElementsByClassName("main-icon main-icon-sign")[0]) {
                document.getElementsByClassName("main-icon main-icon-sign")[0].click();
            };
            if (document.getElementsByClassName("sign-btn-disable")[0]) {
                GM_setValue("sign","已签");
            }
            if (document.getElementsByClassName("sign-btn")[0]) {
                document.getElementsByClassName("sign-btn")[0].click();
                GM_setValue("sign","已签");
            };
            if ( document.getElementsByClassName("sign-close")[0]) {
                document.getElementsByClassName("sign-close")[0].click();
            };
        } else if(hours!=7) {
            GM_setValue("sign","签到")
        }
        //30分钟查看一下能否免费抽奖
        var Min=parseInt(myDate.getMinutes());
        if ( Min%30 === 0&&document.getElementsByClassName("cloud-foot")[0] ) {
            document.getElementsByClassName("cloud-foot")[0].children[0].click();
            var str = document.getElementsByClassName("luck-btngroup")[0].children[0].innerText;
            var reg = RegExp(/免费/);
            var reg1 = RegExp(/金币/);
            if(str.match(reg)){
                log("免费抽");
                document.getElementsByClassName("luck-btngroup")[0].children[0].click();
                if (document.getElementsByClassName("precious-btn")[0]) {
                    document.getElementsByClassName("precious-btn")[0].click();
                };
            }
            else if (str.match(reg1)){
                log("要金币，退出");
                document.getElementsByClassName("luck-close")[0].click();
                if (document.getElementsByClassName("precious-btn")[0]) {
                    document.getElementsByClassName("precious-btn")[0].click();
                };
            }
        }
        //小猪吃完了么,看看能否喂食了
        if (document.getElementsByClassName("draw-feed-btn")[0]) {
            log("喂小猪吃食啦！");
            setTimeout(function(){
                document.getElementsByClassName("draw-trough-img")[0].click();
                //document.getElementsByClassName("feed-list")[0].children[0].click();
                document.getElementsByClassName("feed-item-btn")[0].click();
                document.getElementsByClassName("feed-close")[0].click();
            }, 1000);
        };
    }, 2000);
}


function goose() {

    log('奥利给！！！天天提鹅	，开干~');
    log(new Date());

    let timeid = setInterval(function() {
        var myDate = new Date();
        var hours=myDate.getHours();
        var mins=myDate.getMinutes();
        var secs=myDate.getSeconds();

        //鹅=========================================
        if (document.getElementsByClassName("stage-num udc-bold")[0]) {
            var egg=document.getElementsByClassName("stage-num udc-bold")[0].innerText
            egg=parseFloat(egg);
            log("鹅蛋->>" + egg );
            if (egg>=30) {
                log("收鹅蛋了");
                if (document.getElementsByClassName("main-stage")[0].children[0]) {
                    document.getElementsByClassName("main-stage")[0].children[0].click();
                };
            };
        };

        if (document.getElementsByClassName("dialog-btn-area")[0]) {
            document.getElementsByClassName("dialog-btn-area")[0].children[0].click();
        };



    }, 60000);
}