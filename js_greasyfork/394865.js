// ==UserScript==
// @name         好书友论坛挂机
// @namespace    https://greasyfork.org/users/433510
// @version      0.7.0
// @description  限定好书友论坛专用，每天自动签到，自动领取矿工收益
// @author       lingyer
// @match        https://www.zzld.cn/kuang.php
// @match        https://www.zzld.cn/plugin.php?id=k_misign:sign
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/394865/%E5%A5%BD%E4%B9%A6%E5%8F%8B%E8%AE%BA%E5%9D%9B%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/394865/%E5%A5%BD%E4%B9%A6%E5%8F%8B%E8%AE%BA%E5%9D%9B%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

//自动刷新部分源码源自shenyi的S1挂机脚本https://greasyfork.org/zh-CN/scripts/393812-s1%E6%8C%82%E6%9C%BA
//特此致谢

(function() {
    'use strict';

    const pages_type = [ //页面类型，每条信息的格式为“匹配字符串，网页url”
            ["plugin.php?id=k_misign:sign", "https://www.zzld.cn/plugin.php?id=k_misign:sign"], //代码0 签到页面
            ["kuang.php", "https://www.zzld.cn/kuang.php"], //代码1 矿场页面
        ];

    var env_formhash;
    var ctl_page,ctl_status,ctl_fuse,ctl_diff,ctl_refresh;
    var tmp_int,tmp_str,tmp_ary,tmp_element;

    var httpRequest = new XMLHttpRequest();
    var httpRequest_data;

    //获取formhash
    tmp_element = document.getElementById("scbar_form");
    if (tmp_element == null) { //未取到正确的formhash，当前状态不正常，退出脚本
        console.log("未取到正确的formhash，当前状态不正常，退出脚本!!");
        return;
    }
    //console.log(tmp_element);
    tmp_str = tmp_element.innerHTML;
    //console.log(tmp_str);
    tmp_ary = tmp_str.match(/[0123456789abcdef]{8}/g);
    //console.log(tmp_ary);
    env_formhash = tmp_ary[0];
    //console.log("formhash:" + env_formhash);

    //设置保险，脚本运行不正常时，延时2小时跳转到签到页面
    ctl_fuse = 0;
    setTimeout(delay_fuse, 2*3600*1000);

    //检测所处页面，判断当前状态
    for (ctl_page = 0; ctl_page < pages_type.length; ctl_page++) {
        if (window.location.href.indexOf(pages_type[ctl_page][0]) != -1) {
            break;
        }
    }
    switch (ctl_page) { //根据当前所处页面，采取对应处理方法
        case 0: //当前页面在签到页面
            console.log("当前页面在签到页面，ctl_page:" + ctl_page);

            //尝试自动签到
            tmp_element = document.getElementById("JD_sign"); //获取签到按钮
            if (tmp_element != null) {
                //console.log("自动签到触发");
                tmp_element.click();
            } else {
                console.log("未获取到签到按钮，可能是已经签到");
            }

            //延时5s跳转到矿场页面
            ctl_page = 1;
            setTimeout(delay_go, 5000);
            return;
            break;
        case 1: //当前页面在矿场页面
            console.log("当前页面在矿场页面，ctl_page:" + ctl_page);
            var ctl_timenow = new Date();
            var ctl_timelast = new Date();
            ctl_status = 1; //设置当前任务为收矿
            setTimeout(mine_step, 2000); //延时2s启动任务序列
            break;

        default:
            //当前页面不在触发范围内，退出脚本
            console.log("当前页面不在触发范围内，退出脚本，ctl_page:" + ctl_page);
            ctl_fuse = 1;//保险解除
            return;
    } //end of switch

    function delay_fuse() {
        if (ctl_fuse == 0) { //保险激活，跳转到签到页面
            window.location.assign(pages_type[1][1]);
        } else {
            console.log("保险解除，什么都不做");
        }
    }

    function delay_go() {
        window.location.assign(pages_type[ctl_page][1]); //跳转到url_go
    }

    function pagereload() {
        location.reload();
    }

    function mine_step() {
        switch (ctl_status) { //根据当前任务状态，采取对应处理方法
            case 1: //当前任务是收矿
                ctl_timenow = new Date(); //获取当前时间
                ctl_refresh = 6 * 3600 *1000; //初始化刷新时间，最迟6h刷新一次

                //只检查4#矿场
                tmp_element = document.getElementById("kaicaiform_4");
                //获取上次收矿时间
                //console.log(tmp_element.textContent);
                tmp_ary = tmp_element.textContent.match(/\d+/g);
                //console.log(tmp_ary);
                ctl_timelast.setMonth(Number(tmp_ary[2]) - 1);
                ctl_timelast.setDate(Number(tmp_ary[3]));
                ctl_timelast.setHours(Number(tmp_ary[4]));
                ctl_timelast.setMinutes(Number(tmp_ary[5]));
                console.log("上次收矿时间：" + ctl_timelast.toLocaleString());
                console.log("当前时间：" + ctl_timenow.toLocaleString());
                ctl_diff = ctl_timelast.getTime() + (24 * 3600 * 1000) - ctl_timenow.getTime();
                console.log("time_diff: " + ctl_diff);
                if (ctl_diff <= 0) { //当前矿已到时间，可以收矿
                    console.log("已到时间，收矿");
                    httpRequest.open('GET', './kuang.php?mod=mining&op=lingqu&mineid=4&formhash=' + env_formhash, true);
                    httpRequest.send();

                    setTimeout(pagereload, 2000); //延时2s刷新页面
                    return;

                } else if (ctl_diff < ctl_refresh) {
                    ctl_refresh = ctl_diff
                }

                ctl_status = 2; //设置当前任务为检查矿石库存
                setTimeout(mine_step, 2000); //延时2s继续任务序列
                break;
            case 2: //当前任务是检查矿石库存
                tmp_element = document.getElementById("mod-userinfo").children[0].children[1].children[8];
                //console.log(tmp_element);
                tmp_str = tmp_element.outerText.match(/\d+/g)[0];
                //console.log(tmp_str);
                if (tmp_str != 0) { //有金矿石，呼出卖矿石界面
                    console.log("有金矿石库存，呼出卖矿石界面");
                    tmp_element.children[0].click();

                    ctl_status = 3; //设置当前任务为卖矿
                    setTimeout(mine_step, 2000); //延时2s继续任务序列
                } else { //无金矿石
                    console.log("无金矿石库存");
                    ctl_fuse = 1;//保险解除
                    console.log("下一次刷新间隔: " + ctl_refresh);
                    ctl_status = 1;
                    setTimeout(delay_go, ctl_refresh);
                    return;
                }
                break;
            case 3: //当前任务是卖矿
                tmp_element = document.getElementById("exchangeform");
                //console.log(tmp_element);
                tmp_str = tmp_element.outerText.match(/(?<=你目前最多可以兑换 )\d+/g)[0];
                console.log(tmp_str);
                tmp_element = document.getElementById("submit");
                console.log(tmp_element);
                tmp_element.parentNode.children[0].value = tmp_str; //填入数值
                tmp_element.click(); //卖出金矿石

                ctl_fuse = 1;//保险解除
                console.log("下一次刷新间隔: " + ctl_refresh);
                ctl_status = 1;
                setTimeout(delay_go, ctl_refresh);
                return;

                break;

            default:
                //当前任务不在任务列表内，退出任务序列
                console.log("当前任务不在任务列表内，退出任务序列。任务代码：" + ctl_status);
                return;
        } //end of switch
    }

})();