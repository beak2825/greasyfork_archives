// ==UserScript==
// @name         河洛论坛自动农场
// @namespace    https://greasyfork.org/users/433510
// @version      0.10.2
// @description  限定河洛论坛专用，每日自动签到，自动领取红包任务，自动种植农场
// @author       lingyer
// @match        https://www.horou.com/plugin.php?id=jnfarm*
// @match        https://www.horou.com/home.php?mod=task*
// @match        https://www.horou.com/plugin.php?id=k_misign:sign*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/405830/%E6%B2%B3%E6%B4%9B%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%86%9C%E5%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/405830/%E6%B2%B3%E6%B4%9B%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%86%9C%E5%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const const_pages = [ //有效的分区列表，每条信息的格式为“匹配字符串，网页类型，网页url”
        ["plugin.php?id=k_misign:sign", 11, "https://www.horou.com/plugin.php?id=k_misign:sign"], //类型11 签到页面

        ["mod=task&item=new", 21, "https://www.horou.com/home.php?mod=task&item=new"], //类型21 新任务页面
        ["mod=task&item=done", 23, "https://www.horou.com/home.php?mod=task&item=done"], //类型23 已完成的任务页面
        ["mod=task&do=view", 24, "https://www.horou.com/home.php?mod=task&&do=view&id=*"], //类型24 任务查看页面

        ["plugin.php?id=jnfarm", 31, "https://www.horou.com/plugin.php?id=jnfarm"], //类型31 农场页面
    ];

    var env_numfarms; //当前田地数
    var env_formhash; //当前formhash
    var env_error; //已发生的错误数
    var env_flagfuse; //保险标志位，防止脚本意外停止

    var run_pagenow; //当前所处页面
    var run_stat; //脚本当前运行状态
    var run_todo; //脚本下一步要做的事情（控制流程走向）

    var run_questid; //用于领取每日任务

    var run_listhtime; //土地收获时间列表
    var run_farmid; //当前操作的土地farmid
    var run_hpneed; //下一步收菜需要的体力
    var run_numhp; //当前体力
    var run_numhppack; //持有体力包数量
    var run_numspeedup; //持有加速包数量
    var run_usehppack; //本轮打算使用的体力包数量
    var run_usespeedup; //本轮打算使用的加速包数量
    var run_flagcrop; //是否有库存作物
    var run_numseed; //当前持有种子数量

    var run_timenow; //服务器当前时间
    var run_timehavest; //当前土地收获时间
    var run_timerefresh; //当前刷新时间

    var httpRequest = new XMLHttpRequest();

    var tmp_num,tmp_str,tmp_ary,tmp_element,tmp_element2,tmp_loop;

    //设置保险，保险时间到仍未完成全部任务，则认为脚本运行出错，重新载入页面，重投来过
    env_flagfuse = 0;
    setTimeout(fuse_act, (15 * 60 * 1000)); //保险时间设置为15min

    run_pagenow = getpagecode();
    switch (run_pagenow) { //根据当前所处页面，采取对应处理方法
        case 11: //当前页面在签到页面
            console.log("当前页面在签到页面，自动签到。run_pagenow = " + run_pagenow);

            //尝试自动签到
            tmp_element = document.getElementById("JD_sign"); //获取签到按钮
            if (tmp_element != null) {
                //console.log("自动签到触发");
                tmp_element.click();
            } else {
                console.log("未获取到签到按钮，可能是已经签到");
            }

            //延时2s跳转到新任务页面
            run_pagenow = 21;
            setTimeout(delay_go, 2000);
            return;
            break;

        case 21: //当前页面在新任务页面
            console.log("当前页面在新任务页面，自动领取可用任务。run_pagenow = " + run_pagenow);
            //自动领取任务
            tmp_ary = document.getElementsByClassName("bbda ptm pbm");
            //console.log(elements_array);
            for (tmp_loop = 0; tmp_loop < tmp_ary.length; tmp_loop++) {
                //console.log(tmp_ary[tmp_loop].parentNode.innerHTML);
                //console.log(tmp_ary[tmp_loop].parentNode.innerHTML.indexOf("无法申请此任务"));
                if (tmp_ary[tmp_loop].parentNode.innerHTML.indexOf("无法申请此任务") == -1) { //当前任务可用
                    //console.log(missions[tmp_loop].parentNode.childNodes[7].childNodes[1]);
                    tmp_ary[tmp_loop].parentNode.childNodes[7].childNodes[1].click(); //点击接受可用任务
                    return;
                }
            }

            //无可领取的任务，跳转到河洛农场页面
            run_pagenow = 31;
            setTimeout(delay_go, 2000);
            return;
            break;

        case 23: //当前页面在已完成的任务页面
            console.log("当前页面在已完成的任务页面，跳转到新任务页面。run_pagenow = " + run_pagenow);
            //跳转到新任务页面，检查是否还有可领取的任务
            run_pagenow = 21;
            setTimeout(delay_go, 2000);
            return;
            break;

        case 24: //成功接受任务，当前页面在任务查看页面
            console.log("当前页面在任务查看页面。run_pagenow = " + run_pagenow);
            //跳转到新任务页面，检查是否还有可领取的任务
            run_pagenow = 21;
            setTimeout(delay_go, 2000);
            return;
            break;

        case 31: //当前页面在农场页面
            console.log("当前页面在农场页面。run_pagenow = " + run_pagenow);

            //获取页面当前时间并与本地时钟比对，用于解决firefox重开页面时，页面时间显示不正常的问题
            tmp_str = document.getElementById("txt").innerHTML;
            //console.log(tmp_str);
            tmp_ary = tmp_str.match(/\d+/g);
            run_timenow = new Date(tmp_ary[0],tmp_ary[1]-1,tmp_ary[2],tmp_ary[3],tmp_ary[4],tmp_ary[5]);
            //console.log("timenow:" + run_timenow);
            run_timerefresh = new Date();
            //console.log("localtime:" + run_timerefresh);
            if ((run_timerefresh - run_timenow) > 300000) { //页面当前时间比本地时钟慢5min以上，刷新页面
                console.log("页面当前时间比本地时钟慢5min以上，延迟2秒刷新页面");
                setTimeout(pagereload, 2000);
                return;
            }

            //获取formhash
            tmp_str = document.getElementById("jnland").innerHTML;
            //console.log(tmp_str);
            tmp_ary = tmp_str.match(/(?<=formhash=)[0123456789abcdef]{8}/g);
            //console.log(tmp_ary);
            env_formhash = tmp_ary[0];
            //console.log("formhash:" + env_formhash);

            //获取当前田地数
            tmp_ary = tmp_str.match(/(?<=id="ok)\d+/g);
            //console.log(tmp_ary);
            env_numfarms = tmp_ary.length - 1;
            //console.log("当前田地数：" + env_numfarms);

            //初始化
            env_error = 0;
            run_stat = 11;
            run_timerefresh.setTime(run_timenow.getTime() + 12*3600*1000); //至少12小时刷新一次

            //开始
            setTimeout(step, 2000);

            break;

        default:
            //当前页面不在触发范围内，退出脚本
            console.log("当前页面不在触发范围内，退出脚本。run_pagenow = " + run_pagenow);
            env_flagfuse = 1;//保险解除
            console.log("保险解除。");
            return;
    } //end of switch


    //sub_function area 以下为子函数定义区域
    function step() {

        switch (run_stat) { //根据当前任务状态，采取对应处理方法
            case 11: //检测土地状况，无空地则尝试收菜，有空地则检查种子准备种植
                tmp_ary = document.getElementsByClassName("thispop");
                if (tmp_ary.length != 0) { //存在空地，检查种子准备种植
                    console.log("存在空地，检查种子准备种植");
                    run_todo = 2; //设置当前流程为种植流程
                    run_stat = 21; //尝试打开仓库
                    setTimeout(step, 2000);
                    return;
                } else { //目前无空地，尝试收菜
                    console.log("目前无空地，尝试收菜");

                    run_stat = 12; //下一步是尝试收菜
                    run_farmid = 1;
                    setTimeout(step, 2000);
                    return;
                }
                break;

            case 12: //尝试收菜
                //获取当前时间
                tmp_str = document.getElementById("txt").innerHTML;
                //console.log(tmp_str);
                tmp_ary = tmp_str.match(/\d+/g);
                run_timenow = new Date(tmp_ary[0],tmp_ary[1]-1,tmp_ary[2],tmp_ary[3],tmp_ary[4],tmp_ary[5]);
                //console.log("timenow:" + run_timenow);

                httpRequest.open("GET", "./plugin.php?id=jnfarm&do=harvest&jfid=" + run_farmid + "&formhash=" + env_formhash + "&timestamp=" + Math.floor(run_timenow.getTime()/1000), true);
                httpRequest.send();
                console.log("收获 jfid:" + run_farmid + " timestamp:" + Math.floor(run_timenow.getTime()/1000));
                run_farmid++;
                if (run_farmid > env_numfarms) { //全部地块收菜完成，尝试打开仓库，卖菜
                    run_todo = 1; //设置当前流程为卖菜/查看收获时间流程
                    run_stat = 21; //尝试打开仓库
                    setTimeout(step, 2000);
                    return;
                } else {
                    setTimeout(step, 2000);
                    return;
                }
                break;

            case 21: //尝试打开仓库
                tmp_ary = document.getElementsByClassName("thistore");
                 if (tmp_ary != null) { //打开仓库
                    tmp_ary[0].click();
                    //console.log("打开仓库");
                    run_stat = 22; //下一步是查看仓库
                    setTimeout(step, 5000);
                    return;
                } else { //获取元素失败，可能是网络延迟，error+1，延迟5s重试
                     env_error++;
                    if (env_error > 20) { //累计错误超过20次，刷新页面，从头再来
                        location.reload();
                        return;
                    }
                    console.log("未正确获取到元素，可能是网络延迟，延时5秒重新获取。 error: " + env_error);
                    setTimeout(step, 5000);
                    return;
                }
                break;

           case 22: //查看仓库
                tmp_element = document.getElementById("jnfarm_pop");
                //console.log(tmp_element);
                if (tmp_element != null) { //正确获取到仓库页面
                    run_flagcrop = 0;
                    run_numseed = 0;
                    run_numhppack = 0;
                    tmp_ary = tmp_element.children[3].children;
                    //console.log(tmp_ary);
                    for (tmp_loop = 0; tmp_loop < tmp_ary.length; tmp_loop++) {
                        //console.log(tmp_ary[tmp_loop]);
                        tmp_str = tmp_ary[tmp_loop].innerHTML;
                        //判断当前项目是否为分隔符
                        if (tmp_str != "") { //当前项目不是分隔符，继续判断
                            tmp_num = tmp_str.indexOf("加速");
                            if (tmp_num >= 0) { //发现加速包，获取当前加速包数量
                                run_numspeedup = parseInt(tmp_str.match(/(?<=value=")\d+/g)[1]);
                                console.log("当前加速包数量:" + run_numspeedup);
                            } else { //当前项目不是加速包，继续判断
                                //继续判断体力包
                                tmp_num = tmp_str.indexOf("+10点体力");
                                //console.log(tmp_num);
                                if (tmp_num >= 0){ //发现体力包，获取当前体力包数量
                                    //console.log(tmp_str.match(/(?<=value=")\d+/g));
                                    run_numhppack = parseInt(tmp_str.match(/(?<=value=")\d+/g)[1]);
                                    console.log("当前体力包数量:" + run_numhppack);
                                } else { //当前项目不是体力包，继续判断
                                    tmp_num = tmp_str.indexOf("种子");
                                    if (tmp_num >= 0) { //当前项目为种子
                                        run_numseed = run_numseed + parseInt(tmp_str.match(/(?<=value=")\d+/g)[1]);
                                        //console.log("run_numseed = " + run_numseed);
                                    } else { //当前项目为收获的作物
                                        run_flagcrop = 1;
                                        tmp_ary[tmp_loop].children[0].children[1].children[0].children[0].checked = true; //选中该项作物，准备卖出
                                    }
                                }
                            }
                        }


                    }

                    if (run_flagcrop == 1) { //仓库检查完毕，有库存作物，说明有地块成功收获，卖出作物，根据当前流程代码决定下一步是转向买种子/种地还是刷新页面
                        console.log("仓库检查完毕，有库存作物，卖出库存作物");
                        //console.log(tmp_element.children[2].children[1]);
                        tmp_element.children[2].children[1].click();

                        if (run_todo == 1) { //无空地，且有收获，延迟2s刷新页面
                            setTimeout(pagereload, 2000);
                            return;
                        }
                    }
                    //仓库检查完毕，关闭仓库
                    run_stat = 23; //下一步是尝试关闭仓库
                    setTimeout(step, 2000);
                    return;
                } else { //未正确获取到仓库页面，error数+1，延时5秒重新获取
                    env_error++;
                    if (env_error > 20) { //累计错误超过20次，刷新页面，从头再来
                        location.reload();
                        return;
                    }
                    console.log("未正确获取到仓库页面，延时5秒重新获取。 error: " + env_error);
                    setTimeout(step, 5000);
                    return;
                }
                break;

            case 23: //尝试关闭仓库，根据当前流程代码决定下一步是转向买种子/种地还是检查收获时间
                document.getElementsByClassName("layui-layer-close")[0].click(); //关闭仓库页面

                if (run_todo == 2) { //下一步是买种子/种地

                    //检查种子数量，判断是不是需要买种子
                    if (run_numseed < env_numfarms) { //库存种子数不满足下次种植需求
                        run_stat = 31; //下一步是尝试打开商店
                        setTimeout(step, 2000);
                        return;
                    } else { //库存种子数满足下次种植需求
                        //console.log("当前种子库存" + run_numseed + "个，暂时不需要购买");
                        //console.log("run_todo = " + run_todo);
                        run_stat = 41; //下一步是尝试种菜
                        setTimeout(step, 2000);
                        return;
                   }
                } else { //下一步是检查收获时间
                    console.log("检查各地块收获时间");
                    run_stat = 51; //下一步是检查各地块收获时间
                    run_farmid = 1;
                    run_listhtime = [];
                    run_hpneed = 0;
                    setTimeout(step, 2000);
                    return;
                }
                break;

            case 31: //尝试打开商店
                tmp_ary = document.getElementsByClassName("thishop");
                 if (tmp_ary != null) { //打开商店
                    tmp_ary[0].click();
                    //console.log("打开商店");
                    run_stat = 32; //下一步是查看商店
                    setTimeout(step, 5000);
                    return;
                } else { //获取元素失败，可能是网络延迟，error+1，延迟5s重试
                     env_error++;
                    if (env_error > 20) { //累计错误超过20次，刷新页面，从头再来
                        location.reload();
                        return;
                    }
                    console.log("未正确获取到元素，可能是网络延迟，延时5秒重新获取。 error: " + env_error);
                    setTimeout(step, 5000);
                    return;
                }
                break;

           case 32: //查看商店
                //获取当前时间
                tmp_str = document.getElementById("txt").innerHTML;
                //console.log(tmp_str);
                tmp_ary = tmp_str.match(/\d+/g);
                run_timenow = new Date(tmp_ary[0],tmp_ary[1]-1,tmp_ary[2],tmp_ary[3],tmp_ary[4],tmp_ary[5]);
                //console.log("timenow:" + run_timenow);

                tmp_element = document.getElementById("jnfarm_pop");
                //console.log(tmp_element);
                if (tmp_element != null) { //正确获取到商店页面
                    // 获取种子jsid
                    tmp_ary = tmp_element.children[3].children;
                    //console.log(tmp_ary[0]);
                    tmp_num = tmp_ary[0].innerHTML.match(/(?<=jsid\[)\d+/g)[0];

                    //尝试买种子
                    httpRequest.open("GET", "./plugin.php?id=jnfarm&do=shop&submit=true&timestamp=" + Math.floor(run_timenow.getTime()/1000) + "&formhash=" + env_formhash + "&shopsubmit=yes&jsid[" + tmp_num + "]=1&qty[" + tmp_num + "]=" + (env_numfarms - run_numseed), true);
                    httpRequest.send();
                    //console.log("买入" + (env_numfarms - run_numseed) +"个种子 jsid = " + tmp_num);

                    run_stat = 33; //下一步是尝试关闭商店
                    setTimeout(step, 2000);
                    return;

                } else { //未正确获取到商店页面，error数+1，延时5秒重新获取
                    env_error++;
                    if (env_error > 20) { //累计错误超过20次，刷新页面，从头再来
                        location.reload();
                        return;
                    }
                    console.log("未正确获取到商店页面，延时5秒重新获取。 error: " + env_error);
                    setTimeout(step, 5000);
                    return;
                }
                break;

            case 33: //尝试关闭商店
                document.getElementsByClassName("layui-layer-close")[0].click(); //关闭商店页面

                //console.log("run_todo = " + run_todo);
                if (run_todo == 2) { //下一步是买种子/种地
                    run_stat = 41; //下一步是尝试种菜
                    setTimeout(step, 2000);
                    return;
                } else { //下一步是检查收获时间
                    console.log("检查各地块收获时间");
                    run_stat = 51; //下一步是检查各地块收获时间
                    run_farmid = 1;
                    run_listhtime = [];
                    run_hpneed = 0;
                    setTimeout(step, 2000);
                    return;
                }
                break;

            case 41: //尝试种菜，首先打开种植页面
                tmp_ary = document.getElementsByClassName("thispop");
                tmp_ary[0].click(); //点击首块空地，打开种植页面
                run_stat = 42; //下一步是尝试种植作物
                setTimeout(step, 5000);
                return;
                break;

            case 42: //尝试种植作物
                tmp_element = document.getElementById("try");
                //console.log(tmp_element);
                if (tmp_element == null) { //未正确获取到种植信息，认为种植已完成，下一步是检查收获时间
                    console.log("检查各地块收获时间");
                    run_stat = 51; //下一步是检查各地块收获时间
                    run_farmid = 1;
                    run_listhtime = [];
                    run_hpneed = 0;
                    setTimeout(step, 2000);
                    return;
                }
                //console.log(tmp_element.children[2].children[1].children[0].children[0]);
                tmp_element.children[2].children[1].children[0].children[0].children[1].click(); //点击种植最前面的种子
                setTimeout(step, 2000);
                return;
                break;

            case 51: //尝试打开地块信息
                if (run_farmid <= env_numfarms) {
                    tmp_element = document.getElementById("ok"+run_farmid);
                    tmp_ary = tmp_element.getElementsByClassName("thisfarm");
                    //console.log(tmp_ary);
                    if (tmp_ary.length > 0) { //正确获取到地块元素
                        //console.log("尝试打开地块信息。 farmid = " + run_farmid);
                        tmp_ary[0].click(); //点击打开地块信息
                        run_stat = 52; //下一步是检查地块信息
                        setTimeout(step, 5000);
                        return;
                    } else { //未获取到地块元素，出错了，延迟2s刷新，从头来过
                        setTimeout(pagereload, 2000);
                        return;
                    }
                } else { //所有地块均已查看完毕
                    console.log("所有地块均已查看完毕！");
                    //console.log(run_listhtime);

                    //获取当前时间
                    tmp_str = document.getElementById("txt").innerHTML;
                    //console.log(tmp_str);
                    tmp_ary = tmp_str.match(/\d+/g);
                    run_timenow = new Date(tmp_ary[0],tmp_ary[1]-1,tmp_ary[2],tmp_ary[3],tmp_ary[4],tmp_ary[5]);
                    //console.log("timenow:" + run_timenow);

                    //获取当前体力
                    tmp_ary = document.getElementById("userinfo").textContent.match(/\d+(?=\/\d+)/)
                    run_numhp = parseInt(tmp_ary[0]);
                    //console.log("当前体力:" + run_numhp);
                    //console.log("当前体力包数量:" + run_numhppack);

                    //console.log("当前体力需求:" + run_hpneed);
                    //console.log("当前加速包数量:" + run_numspeedup);
                    //判断是否可以使用加速包
                    tmp_num = 9999;
                    for (tmp_loop = 1; tmp_loop <= env_numfarms; tmp_loop++) {
                        run_listhtime[tmp_loop][2] = run_numhp + (run_numhppack * 10) + Math.floor((run_listhtime[tmp_loop][1].getTime() - run_timenow.getTime()) / (20 * 60 * 1000)) - (env_numfarms + 1 - tmp_loop);
                        console.log("jfid = " + run_listhtime[tmp_loop][0] + run_listhtime[tmp_loop][1] + "成熟，此时剩余体力（当前体力值+体力包+随时间回复-收获消耗）：" + run_listhtime[tmp_loop][2]);
                        if (run_listhtime[tmp_loop][2] < tmp_num) {
                            tmp_num = run_listhtime[tmp_loop][2];
                        }
                    }

                    run_usespeedup = tmp_num - Math.floor(env_numfarms / 5);
                    if (run_usespeedup > env_numfarms) {
                        run_usespeedup = env_numfarms;
                    }
                    console.log("本轮打算使用的加速包数量：" + run_usespeedup);

                    run_stat = 61; //下一步是尝试使用加速包
                    setTimeout(step, 2000);
                    return;
                }
                break;

            case 52: //检查地块信息，视情况进行：收获/使用肥料加速/记录收获时间
                //获取当前时间
                tmp_str = document.getElementById("txt").innerHTML;
                //console.log(tmp_str);
                tmp_ary = tmp_str.match(/\d+/g);
                run_timenow = new Date(tmp_ary[0],tmp_ary[1]-1,tmp_ary[2],tmp_ary[3],tmp_ary[4],tmp_ary[5]);
                //console.log("timenow:" + run_timenow);

                tmp_element = document.getElementById("thisfarm" + run_farmid);
                //console.log(tmp_element);
                if (tmp_element != null) {
                    tmp_str = tmp_element.textContent; //获取当前地块作物成熟/枯萎时间
                    //console.log(tmp_str);
                    if (tmp_str.match(/已枯萎/) != null) { //当前作物已枯萎，清除作物
                        console.log("jfid = " + run_farmid + "，当前作物已枯萎，清除作物");
                        httpRequest.open("GET", "./plugin.php?id=jnfarm&do=normal&ac=thisfarm&eradicate=true&jfid=" + run_farmid + "&formhash=" + env_formhash + "&inajax=1&ajaxtarget=theun", true);
                        httpRequest.send();
                        run_listhtime[run_farmid] = [run_farmid, run_timenow];
                        //console.log(run_listhtime);
                    } else if (tmp_str.match(/枯萎/) != null) { //获取到作物枯萎时间，当前作物已经成熟
                        console.log("jfid = " + run_farmid + "，获取到作物枯萎时间，当前作物已经成熟");
                        run_listhtime[run_farmid] = [run_farmid, run_timenow];
                        //console.log(run_listhtime);
                        run_hpneed++;
                        //console.log("run_hpneed = " + run_hpneed);
                    } else if (tmp_str.match(/成熟/) != null) { //正确获取到作物成熟时间
                        tmp_ary = tmp_str.match(/\d+-\d+-\d+\s+\d+:\d+:\d+成熟/);
                        //console.log(tmp_ary);
                        tmp_ary = tmp_ary[0].match(/\d+/g);
                        run_timehavest = new Date(tmp_ary[0],tmp_ary[1]-1,tmp_ary[2],tmp_ary[3],tmp_ary[4],tmp_ary[5]);
                        //console.log("current farm id:"+ run_farmid + ", havest time:" + run_timehavest);
                        run_listhtime[run_farmid] = [run_farmid, run_timehavest];
                        tmp_loop = 1;
                        while (tmp_loop < run_farmid) {
                            if (run_listhtime[tmp_loop][1].getTime() < run_listhtime[run_farmid][1].getTime()) {
                                tmp_element = run_listhtime[run_farmid];
                                run_listhtime[run_farmid] = run_listhtime[tmp_loop];
                                run_listhtime[tmp_loop] = tmp_element;
                            }
                            tmp_loop++;
                        }
                        //console.log(run_listhtime);
                    }
                    run_stat = 53; //下一步是关闭地块信息
                    setTimeout(step, 2000);
                    return;
                } else { //未正确获取到地块信息，error数+1，延时5秒重新获取
                    env_error++;
                    if (env_error > 20) { //累计错误超过20次，刷新页面，从头再来
                        location.reload();
                        return;
                    } else {
                        console.log("未正确获取到地块信息，延时5秒重新获取。 error:" + env_error);
                        setTimeout(step, 5000);
                        return;
                    }
                }
                break;

            case 53: //关闭地块信息
                tmp_element = document.getElementById("try");
                //console.log(tmp_element);
                if (tmp_element != null) {
                    //console.log("关闭当前地块信息");
                    tmp_element.parentNode.parentNode.getElementsByClassName("layui-layer-close1")[0].click();//关闭当前地块信息
                }

                run_farmid++;
                run_stat = 51; //继续检查下一个地块
                setTimeout(step, 2000);
                return;
                break;

            case 61: //尝试使用加速包
                if ((run_usespeedup > 0) && (run_numspeedup > 0)) { //打算使用加速，并且有加速包，继续判断体力是否够
                    //console.log("打算使用加速，并且有加速包。run_usespeedup = " + run_usespeedup + " run_numspeedup = " + run_numspeedup);
                    if ((run_numhp + (run_numhppack * 10)) > run_hpneed) { //加速后有足够体力收获
                        //获取当前时间
                        tmp_str = document.getElementById("txt").innerHTML;
                        //console.log(tmp_str);
                        tmp_ary = tmp_str.match(/\d+/g);
                        run_timenow = new Date(tmp_ary[0],tmp_ary[1]-1,tmp_ary[2],tmp_ary[3],tmp_ary[4],tmp_ary[5]);
                        //console.log("timenow:" + run_timenow);

                        //检查剩余时间，超过235min才使用加速（加速包成本按50计，种葡萄平均收益64，种植时长243min(考虑红土)，低于此时间的均不使用加速）
                        //console.log("jfid = " + run_listhtime[1][0] + "时间" + run_listhtime[1][1]);
                        if ((run_listhtime[1][1].getTime() - run_timenow.getTime()) > (235 * 60 * 1000)) {
                            //console.log("加速。jfid = " + run_listhtime[1][0]);
                            httpRequest.open("GET", "./plugin.php?id=jnfarm&do=usefertilize&jfid=" + run_listhtime[1][0] + "&feid=17&formhash=" + env_formhash + "&timestamp=" + Math.floor(run_timenow.getTime()/1000) + "&inajax=1&ajaxtarget=thisfarm" + run_listhtime[1][0], true);
                            httpRequest.send();
                            run_numspeedup--;
                            run_hpneed++;

                            tmp_ary = run_listhtime[1];
                            tmp_ary[1] = run_timenow;
                            tmp_loop = 1;
                            while (tmp_loop < env_numfarms) {
                                run_listhtime[tmp_loop] = run_listhtime[tmp_loop + 1];
                                tmp_loop++;
                            }
                            run_listhtime[env_numfarms] = tmp_ary;
                            //console.log(run_listhtime);

                            run_usespeedup--;
                            run_stat = 61; //继续尝试使用加速包
                            setTimeout(step, 2000);
                            return;
                        } else {
                            console.log("剩余时间不足235min，放弃加速。jfid = " + run_listhtime[1][0] + " 剩余时间" + Math.floor((run_listhtime[1][1].getTime() - run_timenow.getTime()) / 60 / 1000));
                        }
                    } else {
                        console.log("加速后没有足够体力收获，放弃加速。run_numhp = " + run_numhp + " run_numhppack = " + run_numhppack + " run_hpneed = " + run_hpneed);
                    }
                }

                //尝试使用体力包
                console.log("尝试使用体力包");
                run_stat = 71;
                setTimeout(step, 2000);
                return;
                break;

            case 71: //尝试使用体力包
                if (run_numhp >= run_hpneed) { //当前体力满足收菜需求
                    if (run_hpneed > 0) {
                        tmp_num = 2000;
                    } else {
                        //获取当前时间
                        tmp_str = document.getElementById("txt").innerHTML;
                        //console.log(tmp_str);
                        tmp_ary = tmp_str.match(/\d+/g);
                        run_timenow = new Date(tmp_ary[0],tmp_ary[1]-1,tmp_ary[2],tmp_ary[3],tmp_ary[4],tmp_ary[5]);
                        //console.log("timenow:" + run_timenow);

                        tmp_num = run_listhtime[env_numfarms][1].getTime() - run_timenow.getTime();
                    }
                    if (tmp_num < 2000) { //至少延时2s
                        tmp_num = 2000;
                    }
                    if (tmp_num > 60000) { //刷新时间超过10min，延时跳转到签到页面，领取每日任务
                        console.log("刷新时间：" + run_listhtime[env_numfarms][1]);
                        //设置延时跳转到签到页面
                        run_pagenow = 11;
                        setTimeout(delay_go, tmp_num);
                        env_flagfuse = 1;//保险解除
                        console.log("保险解除。");
                        run_questid = 0;
                        setTimeout(quests, 2000); //领取每日任务奖励
                        console.log("领取每日任务奖励");
                        return;
                    } else {
                        console.log("刷新时间：" + run_listhtime[env_numfarms][1]);
                        setTimeout(pagereload, tmp_num);
                        return;
                    }
                } else { //当前体力不满足收菜需求
                    if (run_numhppack > 0) { //库存有体力包
                        httpRequest.open("GET", "./plugin.php?id=jnfarm&do=tiliitem&jsid=1&timestamp=" + Math.floor(run_timenow.getTime()/1000) + "&formhash=" + env_formhash, true);
                        httpRequest.send();
                        run_numhp = run_numhp + 10;
                        run_numhppack--;
                        console.log("使用体力包，run_numhp = " + run_numhp + " run_numhppack = " + run_numhppack + " run_hpneed = " + run_hpneed);
                        run_stat = 71; //继续尝试使用体力包
                        setTimeout(step, 2000);
                        return;
                    } else { //没有体力包
                        if (run_numhp > 0) { //当前体力大于0
                            //延时2s刷新，去收菜
                            console.log("体力不足，但有体力，延迟2s刷新，先收菜");
                            setTimeout(pagereload, 2000);
                            return;
                        } else { //体力为0
                            //延时20min刷新，等体力恢复
                            console.log("体力为0，等待20min，体力恢复再刷新");
                            setTimeout(pagereload, (20 * 60 * 1000));
                            env_flagfuse = 1;//保险解除
                            console.log("保险解除。");
                            return;
                        }
                    }
                }
                break;

        } //end of switch

    } //end of function step

    function quests() {
        if (run_questid <= 40) {
            httpRequest.open("GET", "./plugin.php?id=jnfarm&do=dailyquest&questid=" + run_questid + "&formhash=" + env_formhash, true);
            httpRequest.send();
            run_questid++;
            setTimeout(quests, 2000);
        } else {
            console.log("每日任务奖励领取完成。");
        }

    }

    function getpagecode() {
        var tmp_localloop;
        for (tmp_localloop = 0; tmp_localloop < const_pages.length; tmp_localloop++) {
            if (window.location.href.indexOf(const_pages[tmp_localloop][0]) != -1) {
                return const_pages[tmp_localloop][1];
            }
        }
        return 99;
    }

    function delay_go() {
        var tmp_localloop;
        for (tmp_localloop = 0; tmp_localloop < const_pages.length; tmp_localloop++) {
            if (const_pages[tmp_localloop][1] == run_pagenow) {
                window.location.assign(const_pages[tmp_localloop][2]); //跳转到相应页面
                return;
            }
        }
        console.log("未找到对应页面！run_pagenow = " + run_pagenow);
    }

    function fuse_act() { //保险函数，如果触发，说明在设定时间内没有完成全部的动作
        if (env_flagfuse == 0) {
            location.reload();
        } else {
            console.log("保险已解除！");
        }
    }

    function pagereload() {
        location.reload();
    }

})();