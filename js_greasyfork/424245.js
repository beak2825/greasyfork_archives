// ==UserScript==
// @name         河洛农场vip脚本
// @namespace    https://greasyfork.org/users/433510
// @version      0.4.0
// @description  限定河洛论坛农场VIP账号专用，自动种植农场
// @author       lingyer
// @match        https://www.horou.com/plugin.php?id=jnfarm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424245/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BAvip%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/424245/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BAvip%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const const_userprofile = [ ["uid", "seedid", "use_speedup", "use_hppack"],
                           [271688, 11, 1, 0], //lingyer
                           [351795, 0, 1, 0], // linye
                           [409951, 0, 1, 0], // kasumi
                           [410012, 0, 1, 0], // 搬砖的
                           [410041, 0, 1, 0], // 工具人
                           [410087, 3, 0, 0], // yy633927
                           [410090, 1, 0, 0], // kiwi0
                           [410091, 0, 0, 0], // zsl1
                           [410990, 0, 0, 0], // bxm334187
                           [410991, 0, 0, 0], // glenda
                         ];

    const const_seedinfo = [ ["name", "jsid", "price", "prod", "ptime", "level"],
    // 种子信息列表，格式为：作物名称、种子购买jsid、种子购买价格、作物卖出prod、作物成长时间（h）、购买等级
                       ["小麦", 1, 50, 1, 1, 1], //1.小麦
                       ["胡萝卜", 2, 100, 2, 2, 3], //2.胡萝卜
                       ["玉米", 5, 150, 3, 3, 5], //3.玉米
                       ["土豆", 6, 200, 4, 4, 10], //4.土豆
                       ["花生", 19, 220, 5, 4.5, 15], //5.花生
                       ["番茄", 7, 250, 6, 5, 20], //6.番茄
                       ["棉花", 20, 270, 7, 5.5, 25], //7.棉花
                       ["豌豆", 8, 300, 8, 6, 30], //8.豌豆
                       ["葡萄", 21, 320, 9, 6.5, 35], //9.葡萄
                       ["辣椒", 9, 350, 10, 7, 40], //10.辣椒
                       ["卷心菜", 22, 370, 11, 7.5, 45], //11.卷心菜
                       ["南瓜", 10, 400, 12, 8, 50], //12.南瓜
                       ["灯笼椒", 23, 420, 13, 8.5, 55], //13.灯笼椒

                       ["草莓", 11, 450, 0, 9, 60], //14.草莓
                       ["黄瓜", 0, 470, 0, 9.5, 65], //15.黄瓜
                       ["甘蔗", 12, 500, 0, 10, 70], //16.甘蔗
                       ["芦荟", 0, 520, 0, 10.5, 75], //17.芦荟
                       ["番薯", 13, 550, 0, 11, 80], //18.番薯
                       ["洋葱", 0, 570, 0, 11.5, 85], //19.洋葱
                       ["咖啡", 14, 600, 0, 12, 90], //20.咖啡
                       ["玫瑰", 0, 650, 0, 13, 93], //21.玫瑰
                       ["向日葵", 0, 700, 0, 14, 96], //22.向日葵
                       ["风信子", 0, 750, 0, 15, 99], //23.风信子
                     ];

    var env_uid; //当前用户uid
    var env_numfarms; //当前田地数
    var env_formhash; //当前formhash
    var env_error; //已发生的错误数
    var env_flagfuse; //保险标志位，防止脚本意外停止
    var env_countspeedup; //记录当前使用加速的轮次，避免长时间加速触发保险

    var user_seedid; //当前种植的作物id
    var user_flagspeedup; //是否使用加速包
    var user_flaghppack; //是否使用体力包

    var run_stat; //脚本当前运行状态
    var run_questid; //用于领取每日任务

    var run_numhp; //当前体力
    var run_usehppack; //使用体力包数量
    var run_numhppack; //持有体力包数量
    var run_flagcrop; //是否有库存作物
    var run_numseed; //当前持有种子数量
    var run_flagrland; //当前土地是否为红土
    var run_ptime; //当前土地上种植作物的成熟时间
    var run_timenow; //服务器当前时间
    var run_timehavest; //当前土地收获时间
    var run_timerefresh; //当前刷新时间

    var httpRequest = new XMLHttpRequest();

    var tmp_num,tmp_str,tmp_ary,tmp_element,tmp_element2,tmp_loop,tmp_loop2;

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

    //判断当前帐号是否为vip
    tmp_str = document.getElementById("txt").parentNode.innerHTML;
    //console.log(tmp_str);
    if (tmp_str.match(/VIP/g) == null) {
        console.log("当前帐号不是农场VIP！");
        return; //不是农场VIP，退出脚本
    }

    //获取当前uid
    tmp_str = document.getElementById("thistop").innerHTML;
    //console.log(tmp_str);
    tmp_ary = tmp_str.match(/(?<=uid=)\d+/g);
    //console.log(tmp_ary);
    env_uid = tmp_ary[0];
    //console.log("uid:" + env_uid);

    //根据uid获取cashkeep、seedid和肥料加速标志位
    user_seedid = 0;
    user_flagspeedup = 0;
    user_flaghppack = 0;
    for (tmp_num = 1; tmp_num < const_userprofile.length; tmp_num++) {
        if (const_userprofile[tmp_num][0] == env_uid) {
            user_seedid = const_userprofile[tmp_num][1];
            user_flagspeedup = const_userprofile[tmp_num][2];
            user_flaghppack = const_userprofile[tmp_num][3];
            break;
        }
    }
    if (user_seedid == 0) { //未匹配到uid，设置seedid为可种植的最高级种子
        tmp_ary = tmp_str.match(/\d+(?= <div style="display: inline-block; width: )/g);
        //console.log(tmp_ary);
        tmp_num = parseInt(tmp_ary[0]); //获取当前级别
        //console.log("level : " + tmp_num);
        while ((user_seedid < (const_seedinfo.length - 1)) && (tmp_num >= const_seedinfo[user_seedid + 1][5])) {
            user_seedid++;
        }
    }
    //console.log("seedid : " + user_seedid);

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
/*
    //获取当前体力
    tmp_ary = document.getElementById("userinfo").textContent.match(/\d+(?=\/\d+)/)
    run_numhp = parseInt(tmp_ary[0]);
    //console.log("当前体力:" + run_numhp);
*/
    //初始化
    env_error = 0;
    env_countspeedup = 0;
    run_stat = 1;

    //开始
    setTimeout(step, 2000);

    //设置保险，保险时间到仍未完成全部任务，则认为脚本运行出错，重新载入页面，重投来过
    env_flagfuse = 0;
    setTimeout(fuse_act, 300*1000); //保险时间设置为5min

    //第一步：建立所需的对象
    //var httpRequest = new XMLHttpRequest();
    //第二步：打开连接  将请求参数写在url中  true:请求为异步  false:同步
    //httpRequest.open('GET', './plugin.php?id=jnfarm&do=harvest&jfid=4&formhash=c855597c', true);
    //第三步：发送请求  将请求参数写在URL中
    //httpRequest.send();

    //sub_function area 以下为子函数定义区域
    function step() {
        //获取当前时间
        tmp_str = document.getElementById("txt").innerHTML;
        //console.log(tmp_str);
        tmp_ary = tmp_str.match(/\d+/g);
        run_timenow = new Date(tmp_ary[0],tmp_ary[1]-1,tmp_ary[2],tmp_ary[3],tmp_ary[4],tmp_ary[5]);
        //console.log("timenow:" + run_timenow);

        switch (run_stat) { //根据当前任务状态，采取对应处理方法
            case 1: //尝试打开仓库
                run_timerefresh.setTime(run_timenow.getTime() + 12*3600*1000); //至少12小时刷新一次

                tmp_ary = document.getElementsByClassName("thistore");
                 if (tmp_ary != null) { //打开仓库
                    tmp_ary[0].click();
                    console.log("打开仓库");
                    run_stat = 2; //下一步是查看仓库
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

           case 2: //查看仓库
                tmp_element = document.getElementById("jnfarm_pop");
                //console.log(tmp_element);
                if (tmp_element != null) { //正确获取到仓库页面
                    run_flagcrop = 0;
                    run_numseed = 0;
                    run_numhppack = 0;
                    tmp_ary = tmp_element.children[3].children;
                    //console.log(tmp_ary);
                    for (tmp_loop = 0; tmp_loop < tmp_ary.length; tmp_loop++) {
                        tmp_str = tmp_ary[tmp_loop].innerHTML;
                        //console.log(tmp_str);
                        //判断当前项目是否为库存的作物或种子
                        for (tmp_loop2 = 1; tmp_loop2 < const_seedinfo.length; tmp_loop2++) {
                            tmp_num = tmp_str.indexOf(const_seedinfo[tmp_loop2][0]);
                            if (tmp_num >= 0) { //仓库中有未卖出的作物或种子
                                tmp_num = tmp_str.indexOf("种子");
                                if (tmp_num >= 0) { //当前项目为种子
                                    if (tmp_loop2 == user_seedid) { //当前项目为正在种植的作物种子
                                        //console.log(tmp_str);
                                        //console.log(tmp_str.match(/(?<=value=")\d+/g));
                                        run_numseed = tmp_str.match(/(?<=value=")\d+/g)[1];
                                        console.log("[" + const_seedinfo[user_seedid][0] + "]种子库存" + run_numseed + "个");
                                    }
                                } else { //当前项目为作物
                                    run_flagcrop = 1;
                                    tmp_element2 = tmp_ary[tmp_loop].children[0].children[1].children[0].children[0];
                                    //console.log(tmp_element2);
                                    tmp_element2.checked = true;
                                }
                            }
                        } //end for loop2

                        //继续判断体力包
                        tmp_num = tmp_str.indexOf("+10点体力");
                        //console.log(tmp_num);
                        if ((tmp_num >= 0)){ //发现体力包，获取当前体力包数量
                            //console.log(ttmp_str.match(/(?<=value=")\d+/g));
                            run_numhppack = parseInt(tmp_str.match(/(?<=value=")\d+/g)[1]);
                            console.log("当前体力包数量:" + run_numhppack);
                        }

                    }

                    if (run_flagcrop == 1) { //仓库检查完毕，有库存作物，卖出作物
                        console.log("仓库检查完毕，有库存作物，卖出库存作物");
                        //console.log(tmp_element.children[2].children[1]);
                        tmp_element.children[2].children[1].click();
                    }

                    run_stat = 3; //下一步是尝试买种子
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

           case 3: //尝试买种子，使用体力包

                //关闭仓库页面
                document.getElementsByClassName("layui-layer-close")[0].click();

                //判断并尝试买种子
                if (run_numseed < env_numfarms) { //库存种子数不满足下次种植需求
                    //尝试买种子
                    httpRequest.open("GET", "./plugin.php?id=jnfarm&do=shop&submit=true&timestamp=" + Math.floor(run_timenow.getTime()/1000) + "&formhash=" + env_formhash + "&shopsubmit=yes&jsid[" + const_seedinfo[user_seedid][1] + "]=1&qty[" + const_seedinfo[user_seedid][1] + "]=" + (env_numfarms - run_numseed), true);
                    httpRequest.send();
                    console.log("买入" + (env_numfarms - run_numseed) +"个[" + const_seedinfo[user_seedid][0] + "]种子 timestamp:" + Math.floor(run_timenow.getTime()/1000));
                } else { //库存种子数满足下次种植需求
                    console.log("当前[" + const_seedinfo[user_seedid][0] + "]种子库存" + run_numseed + "个，暂时不需要购买");
                }

                //重新获取体力
                tmp_ary = document.getElementById("userinfo").textContent.match(/\d+(?=\/\d+)/)
                run_numhp = parseInt(tmp_ary[0]);
                //console.log("当前体力:" + run_numhp);

                //检查当前体力
                if (run_numhp < env_numfarms) { //当前体力不够一轮收获
                    if (user_flaghppack == 1) { //可以使用体力包
                        run_usehppack = Math.ceil((env_numfarms - run_numhp) / 10);
                    } else { //禁止使用体力包
                        run_usehppack = 0;
                    }
                    if ((run_usehppack > run_numhppack) || (user_flaghppack != 1)){//体力包不够，延时一小时后刷新，等待体力恢复
                        console.log("当前体力不够一轮收获，且体力包不够或禁止使用体力包，延时一小时后刷新，等待体力恢复");
                        setTimeout(pagereload, 3600000);
                        return;
                    }
                    console.log("当前体力:" + run_numhp + " 当前体力包数量:" + run_numhppack + " 使用数量:" + run_usehppack);
                    run_numhp = run_numhp + run_usehppack * 10;
                    run_numhppack = run_numhppack - run_usehppack;
                    setTimeout(usehppack, 2000);
                } else { //剩余体力足够，不需要使用体力包
                     run_usehppack = 0;
                }

                //console.log("num_hp + 10 * num_hppack = " + (run_numhp + 10 * run_numhppack));
                if ((run_numhp + user_flaghppack * 10 * run_numhppack) < (2 * env_numfarms)) { //剩余体力不够下一轮收获，禁止使用加速包
                    console.log("体力不够下一轮收获，禁止使用加速包。当前体力:" + run_numhp + " 当前体力包数量:" + run_numhppack);
                    user_flagspeedup = 0;
                }

                run_stat = 4; //下一步是收菜
                setTimeout(step, (run_usehppack + 1) * 2000); //延时2秒，每使用一个体力包额外延时2秒
                return;
                break;

            case 4: //尝试一键收菜
                httpRequest.open("GET", "./plugin.php?id=jnfarm&do=vip&ac=fastharvest&formhash=" + env_formhash, true);
                httpRequest.send();
                console.log("一键收菜");
                run_numhp = run_numhp - env_numfarms;
                //console.log("当前体力:" + num_hp + " 当前体力包数量:" + num_hppack);
                run_stat = 5; //下一步是种菜
                setTimeout(step, 2000);
                return;
                break;

            case 5: //尝试种菜
                httpRequest.open("GET", "./plugin.php?id=jnfarm&do=vip&ac=fastputseed&formhash=" + env_formhash + "&timestamp=" + Math.floor(run_timenow.getTime()/1000) + "&jfid=1&seed=" + const_seedinfo[user_seedid][1] , true);
                httpRequest.send();
                console.log("一键种菜");
                run_stat = 6; //下一步是打开地块信息
                setTimeout(step, 2000);
                return;
                break;

            case 6: //打开最后一个地块的信息
                //console.log("打开地块信息 jfid:" + num_farm);
                tmp_element = document.getElementById("ok" + env_numfarms);
                //console.log(tmp_element.innerHTML);
                //判断当前土地是否为红土
                if (tmp_element.innerHTML.match(/r-land/g) != null) {
                    //console.log("当前土地为红土！");
                    run_flagrland = 1;
                } else {
                    run_flagrland = 0;
                }

                tmp_ary = tmp_element.getElementsByClassName("thisfarm");
                if (tmp_ary != null) { //打开地块信息
                    tmp_ary[0].click();
                    run_stat = 7;
                    setTimeout(step, 5000);
                    return;
                } else { //最后一个地块上没有作物，可能出错了，刷新页面重新来
                    console.log("最后一个地块上没有作物，可能出错了，延迟2秒刷新页面，从头来过。");
                    setTimeout(pagereload, 2000);
                    return;
                }
                break;

            case 7: //查看收获时间，使用肥料加速
                tmp_element = document.getElementById("thisfarm" + env_numfarms);
                //console.log("current_farm:");
                //console.log(tmp_element);
                if (tmp_element != null) { //获取到地块信息
                    //获取当前地块作物成熟时间
                    tmp_ary = tmp_element.textContent.match(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}成熟/);
                    //console.log("timestr:" + tmp_ary);
                    if (tmp_ary != null) { //正确获取到作物成熟时间
                        tmp_ary = tmp_ary[0].match(/\d+/g);
                        run_timehavest = new Date(tmp_ary[0],tmp_ary[1]-1,tmp_ary[2],tmp_ary[3],tmp_ary[4],tmp_ary[5]);
                        console.log("current farm id:" + env_numfarms + ", havest time:" + run_timehavest);
                        if (run_timehavest < run_timerefresh) {
                            run_timerefresh = run_timehavest;
                        }
                        //console.log("current refresh time:" + run_timerefresh);

                        //console.log("user_flagspeedup:" + user_flagspeedup);
                        if (user_flagspeedup == 1) { //肥料加速标志位有效，继续获取加速按钮
                            tmp_ary = tmp_element.textContent.match(/施肥: 加速.*\(\d+\)/);
                            //console.log(tmp_ary);
                            if (tmp_ary != null) { //肥料加速可用，继续获取肥料数量
                                tmp_str = tmp_ary[0];
                                tmp_ary = tmp_str.match(/\d+/g);
                                //console.log(tmp_ary);
                                if (tmp_ary[1] >= env_numfarms) { //剩余肥料数量不低于田地数，可以一键加速
                                    //判断剩余时间
                                    //获取作物成熟时间
                                    run_ptime = const_seedinfo[user_seedid][4] * 3600;//获取当前作物成长时间h，并转化成s
                                    run_ptime = run_ptime * 0.9;//vip加速
                                    run_ptime = run_ptime * (1- (0.1 * run_flagrland));//红土加速
                                    run_ptime = run_ptime * 1000; //转化成ms
                                    console.log("当前作物成熟时间（ms） : " + run_ptime);

                                    if ((run_timehavest - run_timenow) > (run_ptime - 300000)) { //剩余时间超过种植时间-300s，可以使用加速
                                        httpRequest.open("GET", "./plugin.php?id=jnfarm&do=vip&ac=fastfert&formhash=" + env_formhash + "&timestamp=" + Math.floor(run_timenow.getTime()/1000) + "&jfid=1&feid=17", true);
                                        httpRequest.send();
                                        console.log("一键加速");
                                        tmp_element.parentNode.parentNode.parentNode.getElementsByClassName("layui-layer-close1")[0].click();//关闭地块信息
                                        env_countspeedup++;
                                        if (env_countspeedup >= 10) { //已经连续加速10轮，为避免触发保险，主动刷新页面
                                            setTimeout(pagereload, 2000); //延迟2秒后刷新页面
                                        } else { //回到步骤1，从检查仓库继续
                                            run_stat = 1;
                                            setTimeout(step, 2000);
                                        }
                                        return;
                                    } else {
                                        console.log("剩余时间不足，不适合用肥料加速！");
                                    }
                                } else {
                                    console.log("剩余肥料不足！");
                                }
                            } else {
                                console.log("无可用的加速！");
                            }
                        }

                        //记录收获时间，设置延时定时器
                        console.log("timenow:" + run_timenow);
                        console.log("timerefresh:" + run_timerefresh);
                        tmp_num = Math.floor(run_timerefresh - run_timenow);
                        if (tmp_num < 2000) { //最小刷新间隔为2s，若收获时间距当前时间小于2s，则设置为2s
                            tmp_num = 2000;
                        }
                        console.log("timeout:" + tmp_num);
                        setTimeout(pagereload, tmp_num);

                        tmp_element.parentNode.parentNode.parentNode.getElementsByClassName("layui-layer-close1")[0].click();//关闭地块信息

                        env_flagfuse = 1; //全部动作完成，保险解除
                        //console.log("All done.");

                        if (tmp_num > 300000) { //刷新时间超过5min，领取每日任务
                            run_questid = 0;
                            setTimeout(quests, 2000); //领取每日任务奖励
                        }

                        return;
                    } else {
                        tmp_str = tmp_element.textContent.match(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}枯萎/);
                        if (tmp_str.length != 0) { //获取到作物枯萎时间，延迟2秒刷新页面，重新开始
                            console.log("获取到作物枯萎时间，延迟2秒刷新页面，重新开始");
                            setTimeout(pagereload, 2000);
                            return;
                        } else { //未正确获取到作物成熟时间，error数+1，延时5秒重新获取
                            env_error++;
                            if (env_error > 20) { //累计错误超过20次，刷新页面，从头再来
                                location.reload();
                                return;
                            }
                            console.log("未正确获取到作物成熟时间，延时5秒重新获取。 error: " + env_error);
                            setTimeout(step, 5000);
                            return;
                        }
                    }
                } else { //未正确获取到地块信息，error数+1，延时5秒重新获取
                    env_error++;
                    if (env_error > 20) { //累计错误超过20次，刷新页面，从头再来
                        location.reload();
                        return;
                    }
                    console.log("未正确获取到地块信息，延时5秒重新获取。 error:" + env_error);
                    setTimeout(step, 5000);
                    return;
                }
                break;

        } //end of switch

    }

    function usehppack() {
        console.log("使用体力包");
        httpRequest.open("GET", "./plugin.php?id=jnfarm&do=tiliitem&jsid=1&timestamp=" + Math.floor(run_timenow.getTime()/1000) + "&formhash=" + env_formhash, true);
        httpRequest.send();
        run_usehppack--;
        if (run_usehppack > 0) {
            setTimeout(usehppack, 2000);
        }
    }


    function quests() {
        if (run_questid <= 10) {
            httpRequest.open("GET", "./plugin.php?id=jnfarm&do=dailyquest&questid=" + run_questid + "&formhash=" + env_formhash, true);
            httpRequest.send();
            console.log("领取每日任务奖励。questid:" + run_questid);
            run_questid++;
            setTimeout(quests, 2000);
            }
    }

    function fuse_act() { //保险函数，如果触发，说明在设定时间内没有完成全部的动作
        if (env_flagfuse == 0) {
            location.reload();
        } else {
            console.log("保险解除！");
        }
    }

    function pagereload() {
        location.reload();
    }

})();