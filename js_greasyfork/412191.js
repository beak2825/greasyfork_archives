// ==UserScript==
// @name         河洛农场-手机用
// @namespace    https://greasyfork.org/users/433510
// @version      0.0.3
// @description  限定河洛论坛专用，自动种植农场，纯脚本版，手机可用
// @author       lingyer
// @match        https://www.horou.com/plugin.php?id=jnfarm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412191/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA-%E6%89%8B%E6%9C%BA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/412191/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA-%E6%89%8B%E6%9C%BA%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //程序控制逻辑：
    //1.首先检测是否存在空地，若有空地则开始种地，种完刷新页面
    //2.不存在空地，则：
    //  2.1.依次点开各地块
    //    2.1.1.若可以收获，则收获
    //    2.1.2.若可以加速，则加速
    //    2.1.3.记录作物成熟时间
    //  2.2.若收获过作物，则刷新页面（补种作物）
    //3.延时到作物成熟时间后刷新页面

    var farmlist;
    var currentfarm;
    var farmid;
    var spanlist;
    var spanid;
    var stat;
    var gothavest; //收获标志位，记录本轮是否收获过作物
    var timeout;
    var timenow = new Date();
    var timehavest = new Date();
    var timerefresh = new Date();
    var timestr,timeary;
    var speedup;
    var error;

    //初始化
    error = 0;
    stat = 1; //置状态位为：检测土地状况
    timeout = 2;
    //console.log("延迟" + timeout +"秒开启脚本");
    setTimeout(step, timeout*1000);

    //sub_function area 以下为子函数定义区域

    function step() {
        switch (stat) { //根据当前任务状态，采取对应处理方法
            case 1: //首先检测土地状况
                farmlist = document.getElementsByClassName("thispop");
                if (farmlist.length != 0) { //存在空地，准备种植
                    //console.log("poplist = ");
                    //console.log(farmlist);
                    farmlist[0].click(); //点击打开种植页面
                    stat = 2; //置状态位为：种植作物
                } else {
                    farmlist = document.getElementsByClassName("thisfarm");
                    if (farmlist.length != 0) { //获取到土地列表，准备查看作物信息
                        //console.log("farmlist = ");
                        //console.log(farmlist);
                        farmid = 0;
                        gothavest = 0;
                        timerefresh.setHours(timerefresh.getHours() + 48);
                        //console.log("current refresh time:" + timerefresh);
                        stat = 3; //置状态位为：打开地块信息
                    } else {//未获取到土地列表，刷新页面，从头再来
                        location.reload();
                        return;
                    }
                }
                timeout = 3;
                setTimeout(step, timeout*1000);
                return;
                break;
            case 2: //尝试种菜
                currentfarm = document.getElementById("try");
                //console.log(currentfarm);
                if (currentfarm == null) { //未正确获取到种植信息，认为种植已完成，刷新页面
                    location.reload();
                    return;
                }
                //console.log(currentfarm.children[2].children[1].children[0].children[0].children[0]);
                currentfarm.children[2].children[1].children[0].children[0].children[0].click(); //点击种植最前面的种子
                timeout = 3;
                setTimeout(step, timeout*1000);
                return;
                break;
            case 3: //打开地块信息
                if (farmlist[farmid] != null) {
                    farmlist[farmid].click(); //点击打开地块信息
                    //console.log("farmid : " + farmid);
                    stat = 4; //置状态位为：判断地块信息
                    timeout = 3;
                    setTimeout(step, timeout*1000);
                    return;
                } else { //所有地块均已查看完毕
                    //console.log("所有地块均已查看完毕！");
                    if (gothavest != 0) { //此轮有作物收获，需要补种，立刻刷新
                        location.reload();
                        return;
                    } else { //记录最短收获时间，设置延时定时器
                        console.log("timenow:" + timenow);
                        console.log("timerefresh:" + timerefresh);
                        timeout = Math.floor((timerefresh - timenow) / 1000);
                        console.log("timeout:" + timeout);
                        if (timeout > 3600) { //最短收获时间超过3600秒，则将刷新时间设置为3600秒
                            timeout = 3600;
                        }
                        console.log("set reload time:" + timeout);
                        setTimeout(reloadpage, timeout*1000);
                    }
                }
                break;
            case 4: //判断地块信息，视情况进行：收获/使用肥料加速/记录收获时间
                currentfarm = document.getElementById("try");
                //console.log(currentfarm);
                if (currentfarm == null) { //未正确获取到地块信息，error数+1，延时5秒重新获取
                    error++;
                    if (error > 20) { //累计错误超过20次，刷新页面，从头再来
                        location.reload();
                        return;
                    } else {
                        console.log("未正确获取到地块信息，延时5秒重新获取。 error:" + error);
                        timeout = 5;
                        setTimeout(step, timeout*1000);
                        return;
                    }
                    break;
                }
                spanlist = currentfarm.children[2].children[0].children[1].children[1].children;
                //console.log(spanlist);
                timestr = spanlist[0].textContent; //获取当前地块作物成熟/枯萎时间
                //console.log(timestr);
                if (timestr.match(/枯萎/) != null) { //获取到作物枯萎时间，点击收获
                    console.log("获取到作物枯萎时间，点击收获");
                    spanlist[1].click(); //点击收获
                    gothavest = 1;
                    farmid++;
                    stat = 3; //置状态位为：打开地块信息
                    timeout = 5;
                    setTimeout(step, timeout*1000);
                    return;
                } //作物收获部分结束
                if (timestr.match(/成熟/) != null) { //正确获取到作物成熟时间
                    timeary = timestr.match(/\d+/g);
                    timehavest = new Date(timeary[0],timeary[1]-1,timeary[2],timeary[3],timeary[4],timeary[5]);
                    console.log("current farm id:"+ farmid + ", havest time:" + timehavest);

                    if (timehavest < timerefresh) {
                        timerefresh = timehavest;
                        //console.log("current refresh time:" + timerefresh);
                    }

                    timestr = document.getElementById("txt").innerHTML;
                    //console.log(timestr);
                    timeary = timestr.match(/\d+/g);
                    timenow = new Date(timeary[0],timeary[1]-1,timeary[2],timeary[3],timeary[4],timeary[5]);
                    //console.log("timenow:" + timenow);

                    //继续获取加速按钮
                    if (spanlist[1] != null) {//加速可用
                        //console.log("加速信息:" + spanlist[spanid].textContent);
                        spanlist = spanlist[1].children;
                        //console.log(spanlist);
                        for (spanid = 0; spanid < spanlist.length; spanid=spanid+2) {
                            speedup = spanlist[spanid].textContent.match(/\d+/)[0];
                            //console.log("speedup : " + speedup);
                            if (spanlist[spanid].textContent.match(/小时/) != null) {//按钮为加速n小时
                                speedup = speedup * 3600 * 1000;
                            } else {//按钮为加速n分钟
                                speedup = speedup * 60 * 1000;
                            }
                            //console.log("加速(ms):" + speedup);

                            //判断剩余时间
                            //console.log("timediff:" + (timehavest - timenow));
                            if ((timehavest - timenow) > (speedup - 300000)) { //剩余时间超过加速时间，可以使用加速
                                console.log("点击加速, 加速(ms):" + speedup);
                                spanlist[spanid].click(); //点击加速

                                //延时5s重新判断作物成熟时间
                                currentfarm.parentNode.parentNode.getElementsByClassName("layui-layer-close1")[0].click();//关闭当前地块信息
                                stat = 3;
                                timeout = 5;
                                setTimeout(step, timeout*1000);
                                return;
                           }
                        }//end of for
                    }

                    //关闭当前地块信息，继续打开下一个地块
                    currentfarm.parentNode.parentNode.getElementsByClassName("layui-layer-close1")[0].click();//关闭当前地块信息
                    farmid++;
                    stat = 3;
                    timeout = 5;
                    setTimeout(step, timeout*1000);
                    return;
                }

                //运行到这一部分说明出问题了，直接刷新重来
                location.reload();
                return;
                break;
        } //end of switch
    }

    function reloadpage() {
        location.reload();
    }

})();