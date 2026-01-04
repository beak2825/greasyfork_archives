// ==UserScript==
// @name        京东京喜-收取电力
// @namespace   https://greasyfork.org/zh-CN/scripts/400135
// @match       https://wqs.jd.com/pingou/dream_factory/*.html
// @match       https://wqs.jd.com/pingou/dream_factory/*.html?*
// @match       https://wqs.jd.com/pingou/dream_factory/market.html
// @match       https://wqs.jd.com/pingou/dream_factory/market.html?*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     2.2
// @author      lucas(xxxxx@qq.com)
// @update      lucas(xxxxx@qq.com)
// @description 京东惊喜梦工厂.自动收电力，如需自动加电力把 hours>=70改为 hours>=7就可以了。还有在货架可加工商品点进去后会自动抢商品。 F12调试模式手机模式：https://wqs.jd.com/pingou/dream_factory/index.html
// @downloadURL https://update.greasyfork.org/scripts/400135/%E4%BA%AC%E4%B8%9C%E4%BA%AC%E5%96%9C-%E6%94%B6%E5%8F%96%E7%94%B5%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/400135/%E4%BA%AC%E4%B8%9C%E4%BA%AC%E5%96%9C-%E6%94%B6%E5%8F%96%E7%94%B5%E5%8A%9B.meta.js
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






function lifecycle() {
    log('奥利给！！！京喜工厂自动收取电力，开干~');
    log('每天7～21点之间自动加电~');
    log(new Date());

    var myDate = new Date();
    var hours=myDate.getHours();
    var mins=myDate.getMinutes();
    var secs=myDate.getSeconds();
    var start_time = new Date();
    start_time=start_time.toLocaleString();
    GM_setValue("start_time",start_time);



    //初始化加电状态
    var add_dream = GM_getValue("add_dream");
    if (typeof(add_dream)=="undefined") {
        GM_setValue("add_dream","加电");
    }



    let timeid = setInterval(function() {

        var myDate = new Date();
        var hours=myDate.getHours();
        var mins=myDate.getMinutes();
        var secs=myDate.getSeconds();

        //点击需要抢购商品的页面，会自动抢购，该功能未测试。
        if (document.getElementsByClassName("sku_detail_btn")[0]) {
            var a=0;
            while (a<10) {
                log("正在抢购");
                if (document.getElementsByClassName("sku_detail_btn")[0].className=="sku_detail_btn") {
                    document.getElementsByClassName("sku_detail_btn")[0].click();
                }
                a++;
            }
        }



        //自动加电力 7~21点，电力大于100
        add_dream = GM_getValue("add_dream");

        if (document.getElementsByClassName("top-l-info-n")[0]) {
            var now_count= document.getElementsByClassName("top-l-info-n")[0].innerText;
        }
        //console.log(mytime + " add_dream:" + add_dream);
        if (hours>=70&&hours<=20&&add_dream=="加电"&&now_count>=100) {
            log("工作时间，加电力。")
            document.getElementsByClassName("icon icon_add")[0].click();
            if (document.getElementsByClassName("g_error_body")[0]) {
                var reg = RegExp(/加电上限/);
                var ERR = document.getElementsByClassName("g_error_body")[0].innerText;
                if (ERR.match(reg)){
                    log("已达加电上限");
                    GM_setValue("add_dream","满电");
                }
            }
        } else if (hours<7||hours>20) {
            //log("未在加电时间，恢复变量.");
            GM_setValue("add_dream","加电");
        }
        if (document.getElementsByClassName("g_error_btn")[0]) {
            document.getElementsByClassName("g_error_btn")[0].click();
        }

        //自动获取电力
        if (document.querySelector(".alternator-num-n")) {
            var num = document.querySelector(".alternator-num-n").innerText;
            num = parseFloat(num);
            //console.log("监测电力值 ->> " + num);
            if (num >= 300&&hours>=6) {
                document.getElementById("alternator").click();
                setTimeout(function() {
                    if (document.getElementsByClassName('simple_dialog_btn')[0]) {
                        reg=RegExp(/逛集市翻倍电力/);
                        var market=document.getElementsByClassName('simple_dialog_btn')[0].innerText
                        if (market.match(reg)){
                            document.getElementsByClassName('simple_dialog_btn')[0].click()
                            clearInterval(timeid);
                            setTimeout(function() {
                                log("重新开始0")
                                lifecycle();
                            }, 2000)
                        } else {
                            setTimeout(function() {
                                if (document.getElementsByClassName('simple_dialog_txt_btn_txt')[0]) {
                                    document.getElementsByClassName('simple_dialog_txt_btn_txt')[0].click();
                                    log("重新开始1")
                                    //lifecycle();
                                }
                                if (document.getElementsByClassName("close")[0]) {
                                    document.getElementsByClassName("close")[0].click();
                                }
                            }, 2000)
                        }
                    }
                }, 1000)
                //显示电力-----
                setTimeout(function() {
                    //获取当前电量
                    var start_count=GM_getValue("start_count");
                    if (typeof(start_count)=="undefined"||start_count==0) {
                        start_count= document.getElementsByClassName("top-l-info-n")[0].innerText;
                        GM_setValue("start_count",start_count);
                    }
                    var now_time=myDate.toLocaleString();
                    var now_count= document.getElementsByClassName("top-l-info-n")[0].innerText;
                    log("开始时间：" + start_time + " 开始电力：" + start_count,'\n',"当前时间: " + now_time + " 现在电力：" + now_count);},5000);
                //显示电力-----
            }
        } else if (document.getElementsByClassName("floating")[0]) {
            var secStr = document.querySelector(".floating_title").innerText;
            log("监测倒计时 ->> " + secStr)
            if (secStr === "已完成") {
                log("完成啦")
                document.getElementsByClassName("floating_name")[0].click() || document.getElementsByClassName("floating_finish")[0].click()
                document.getElementsByClassName("floating_finish")[0].click();
                clearInterval(timeid);
                setTimeout(function() {
                    log("重新开始2")
                    lifecycle();
                }, 2000)
            } else if (secStr === "10s") {
                log("滑动页面")
                document.querySelector(".scroll-view").scrollTo(0, 800);
            }
        }
    }, 1000)
    }

//自动收已完成的任务
function tasklist() {
    //log("task1");
    let timeid = setInterval(function() {
        //log("task2");

        //收取昨日别人帮忙打工的电力
        if (document.getElementsByClassName("m_power_bolt p0 anim")[0]) {
            //log("task3");
            document.getElementsByClassName("m_power_bolt p0 anim")[0].click();
        }

        //tasklist
        if (document.getElementsByClassName("icon icon_task")[0]) {
            //log("task4");
            document.getElementsByClassName("icon icon_task")[0].click()
        }

        setTimeout(function() {
            if (document.getElementsByClassName("scroll-view task_box_scroll scroll-y")[0] ) {
                //log("task5");
                var task=document.getElementsByClassName("scroll-view task_box_scroll scroll-y")[0].children.length;
                var i=0;
                while (i<task) {
                    var taskclassname=document.getElementsByClassName("scroll-view task_box_scroll scroll-y")[0].children[i].children[2].children[1].className
                    //log(taskclassname)
                    if (taskclassname=="task_item_btn btn_type_2") {
                        log("task6");
                        document.getElementsByClassName("scroll-view task_box_scroll scroll-y")[0].children[i].children[2].children[1].click()
                    };
                    i++;
                };
                setTimeout(function() {
                    //close
                    document.getElementsByClassName("close")[0].click();
                    //log("close")
                }, 2000)
            };
        }, 4000)
    }, 1200000);
}