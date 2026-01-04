// ==UserScript==
// @name        京喜财福岛
// @namespace   https://greasyfork.org/zh-CN/scripts/401011
// @match       https://wqs.jd.com/fortune_island/index.html*
// @match       https://wq.jd.com/webportal/event/*
// @match       https://wqsd.jd.com/pingou/taskcenter/index.html
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.3
// @author      lucas(xxxxx@qq.com)
// @update      lucas(xxxxx@qq.com)
// @description 京东财福岛.自动完成任务/自动偷钱币/自动收取打工仔的钱币 F12调试模式手机模式：https://wqs.jd.com/fortune_island/index.html#
// @downloadURL https://update.greasyfork.org/scripts/401011/%E4%BA%AC%E5%96%9C%E8%B4%A2%E7%A6%8F%E5%B2%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/401011/%E4%BA%AC%E5%96%9C%E8%B4%A2%E7%A6%8F%E5%B2%9B.meta.js
// ==/UserScript==
(function() {
    setTimeout(function(){
        reloadpage();
        lifecycle();
        tasklist();
    },4000);
})();

function sleep(ms) {
    var start = new Date().getTime()
    while (new Date().getTime() < start + ms);
}

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
    }, 10000);
}

function sign() {
    if (document.getElementsByClassName("new-user-guider old_user")[0] ) {
        document.getElementsByClassName("new-user-guider old_user")[0].click()
    }
    if (document.getElementsByClassName("rpk-list")[0]) {
        var i=0
        var singlist=document.getElementsByClassName("rpk-list")[0].children.length
        while (i<singlist) {
            if (document.getElementsByClassName("rpk-list")[0].children[i].getElementsByClassName("every-rpk")[0].children[3].innerText=="领取") {
                document.getElementsByClassName("rpk-list")[0].children[i].getElementsByClassName("every-rpk")[0].children[3].click();
            }
            i++;
        }
    }
}


function island() {
    //岛主
    if (document.getElementsByClassName("is-has-money")[0]||document.getElementsByClassName("is-has-money")[1]) {
        if (document.getElementsByClassName("is-has-money")[0].className=="is-has-money") {
            log("岛主收钱")
            document.getElementsByClassName("is-has-money")[0].click();
        }
        if (document.getElementsByClassName("is-has-money")[1].className=="is-has-money") {
            log("岛主收钱")
            document.getElementsByClassName("is-has-money")[1].click();
        }
    }
}

function worker() {
    //打工
    if (document.getElementsByClassName("head-icon has-money")[0]) {
        var worker=document.getElementsByClassName("head-icon has-money").length
        var i=0
        log("发现工人：",worker)
        if(worker>0) {
            while (i<worker) {
                //log(i);
                if (document.getElementsByClassName("head-icon has-money")[i].className=="head-icon has-money") {
                    log("收工钱:",i)

                    document.getElementsByClassName("head-icon has-money")[i].click();

                }
                i++
            }
        }
    }
}

function lifecycle() {
    log('奥利给！！！京喜财富岛，开干~');
    log(new Date());

    var start_time = new Date();
    start_time=start_time.toLocaleString();
    GM_setValue("start_time",start_time);
    var i=0;

    let timeid = setInterval(function() {

        var myDate = new Date();
        var hours=myDate.getHours();
        var mins=myDate.getMinutes();
        var secs=myDate.getSeconds();

        var now_time=myDate.toLocaleString();
        log(now_time);

        //收岛主
        island()
        //收打工
        worker()


        //好友圈
        if (document.getElementsByClassName("friend-circle")[0]) {
            document.getElementsByClassName("friend-circle")[0].click()
            setTimeout(function(){
                if (document.getElementsByClassName("pop-window")) {
                    var friends=document.getElementsByClassName("friends-content-detail").length;
                    i=0
                    log("发现好友:",friends)
                    if(friends>0) {
                        while (i<friends) {
                            //log(i);
                            var text=document.getElementsByClassName("friends-content-detail")[i].children[3].innerText
                            //log("好友",i,text)
                            if (text=="偷财富") {
                                log("好友",i,"可偷")
                                document.getElementsByClassName("friends-content-detail")[i].lastChild.click();
                            }
                            i++
                        };
                    };
                    document.getElementsByClassName("friends-layer-close")[0].click()
                };
            },1000);
        }
    }, 3600000);
}



function tasklist() {
    //log('奥利给！！！京喜财富岛，开干~');
    log(new Date());

    var start_time = new Date();
    start_time=start_time.toLocaleString();
    GM_setValue("start_time",start_time);
    var i=0;

    let timeid = setInterval(function() {
        sign()
        setTimeout(function(){
            log("sign close")
            document.getElementsByClassName("close")[0].click();
        },1000);
        var myDate = new Date();
        var hours=myDate.getHours();
        var mins=myDate.getMinutes();
        var secs=myDate.getSeconds();

        var now_time=myDate.toLocaleString();
        log(now_time);
        //任务
        if (document.getElementsByClassName("main-btn")[0]) {
            document.getElementsByClassName("main-btn")[0].click();
            setTimeout(function(){
                var task=document.getElementsByClassName("target-list")[0].children.length;
                log("任务总数:",task);
                i=0;
                while(i<task) {
                    if (document.getElementsByClassName("target-list")[0].children[i].children[0].getElementsByClassName("target-list-deatil-award-btn")[0]) {
                        var text=document.getElementsByClassName("target-list")[0].children[i].children[0].getElementsByClassName("target-list-deatil-award-btn")[0].innerText
                        log("任务",i,text);
                        if (text=="去逛逛") {
                            document.getElementsByClassName("target-list")[0].children[i].children[0].getElementsByClassName("target-list-deatil-award-btn")[0].click();
                        }
                        if (text=="加购") {
                            document.getElementsByClassName("target-list")[0].children[i].children[0].getElementsByClassName("target-list-deatil-award-btn")[0].click();
                        }
                    }

                    if (document.getElementsByClassName("target-list")[0].children[i].children[0].getElementsByClassName("target-list-deatil-process-btn")[0]) {
                        var text1=document.getElementsByClassName("target-list")[0].children[i].children[0].getElementsByClassName("target-list-deatil-process-btn")[0].innerText
                        log("任务",i,text);
                        if (text1=="领奖励") {
                            document.getElementsByClassName("target-list")[0].children[i].children[0].getElementsByClassName("target-list-deatil-process-btn")[0].click();
                        }
                    }
                    i++
                };
                document.getElementsByClassName("target-close")[0].click();

            },1000);
            //完成加购任务
            if (document.getElementsByClassName("sku-list")[0]) {
                var mall=document.getElementsByClassName("sku-list")[0].children.length
                i=0;
                while (i<mall) {
                    var text2=document.getElementsByClassName("sku-list")[0].children[i].children[2].innerText;
                    if(text2=="加购"){
                        document.getElementsByClassName("sku-list")[0].children[i].children[2].click();
                    }
                    i++
                }
                setTimeout(function(){
                    log("close")
                    document.getElementsByClassName("close")[0].click();
                },2000);
            }

        } else {


            //如果在其他岛主那里，那么是没有任务列表的，返回自家岛。
            setTimeout(function(){
                //document.getElementsByClassName("page-back-home-img")[0].click();
                window.location.replace("https://wqs.jd.com/fortune_island/index.html#");
            },6000);
        }
    }, 60000);
}
