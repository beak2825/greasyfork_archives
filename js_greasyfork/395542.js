
// ==UserScript==
// @name         秋哥视界
// @namespace    http://iqiuge.com/
// @version      1.8
// @description  try to improve the world for qiuge.
// @author       范伟
// @include      *
// @exclude      *://*.hga030.com/*
// @exclude      *://*.zgzcw.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395542/%E7%A7%8B%E5%93%A5%E8%A7%86%E7%95%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/395542/%E7%A7%8B%E5%93%A5%E8%A7%86%E7%95%8C.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var siteUrl = window.location.href;
    if (siteUrl.indexOf('hga030.com') > 0) {
        return;
    }
    if (siteUrl.indexOf('bf1.s168.com') > 0) {
        // 310v直接访问iframe嵌套网页
        window.location.href = "http://bf2.310v.com:3389/";
    }
    if (siteUrl.indexOf("ny.310v.com:3389/dt/index.html") > 0) {
        // 310v直接访问iframe嵌套网页
        window.location.href = siteUrl.replace("index", "indexxx");
    }
    // 90vs直接访问iframe嵌套网页
    // if (siteUrl.indexOf("ny.qw02.net:3389/dt/index.html") > 0) {
        // redirect90VsUrl(siteUrl);
    // }

    if (siteUrl.indexOf("ny.qw02.net") > 0) {
        // 在子frame中填充header
        ignoreError(function () {
            // fillHeader(siteUrl);
        })
    }
    if (siteUrl.indexOf("dsa3") > 0) {
        // 调用90vs自带函数设置大字体
        ignoreError(function () {
            font_set(13);
            // 显示大字体和盘路
            checkElmList(['#image_zzd', '#show_pan_tablex']);
        })
    }
    boldFont();
    imporoveFor90VsDetail(siteUrl);

    window.onload = function () {
        boldFont();
        if (siteUrl.indexOf('90vs.com') > 0) {
            improveShowFor90VS();
            notCheckElm("#opq_gg1");
        }
        if (siteUrl.indexOf('bf2.310v.com') > 0) {
            improveShowFor310V();
        }
        imporoveFor90VsDetail(siteUrl);
    };
})();

function fillHeader(siteUrl) {
    var mid = getQueryVariable("mid");

    // 获取基础变量, important！
    //  var info = [11742473,1021,114,100230,100241,'','','2020-05-29(星期五)02:30','','','','','05-29&nbsp;02:30'];
    //  var mt={1021:['德乙','德乙','GER2','#DB31EE']};
    //  var tt={100230:['史特加','斯图加特','VfB Stuttgart','jpg'],100241:['漢堡','汉堡','Hamburger SV','jpg']};
    //  var zs=[0,1,0];
    //  var ds=[397,8,470,274,245,512];
    //  var zh=[1,1,1,1,1,1];
    //  var op100 = 1;
    //  var matchTime = new Date(2020, 4, 29, 2, 30);
    //  var mb_jp={};
    let varJs = 'http://ny.qw02.net:3389/dt/head_fx/' + Math.floor(mid / 1000) + '/' + mid + '.js?d=' + new Date().getTime();
    var varResult = ajaxGet(varJs);
    eval(varResult);
    var ty_id = info[1];
    // 数据
    var dataDiv = document.createElement("div");
    dataDiv.setAttribute("id", "header-data");
    dataDiv.setAttribute("style", "min-width: 205px;text-align: right; ");

    var teamFx = document.createElement("a");
    teamFx.innerText = '球队往绩';
    teamFx.setAttribute('href', 'http://ny.qw02.net:3389/dt/team_fx.html?mid=' + mid + "&ty_id=" + ty_id);
    teamFx.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 3px 10px;');

    if (siteUrl.indexOf("team_fx") > 0) {
        teamFx.setAttribute("style", 'padding: 2px; color: #fff; background: #6099d3; margin: 3px 10px;');
    } else {
        teamFx.addEventListener("mouseover", function () {
            teamFx.setAttribute('style', 'padding: 2px; color: #199CDF; margin: 3px 10px;');
        })
        teamFx.addEventListener("mouseout", function () {
            teamFx.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 3px 10px;');
        })
    }

    dataDiv.append(teamFx);
    var matchFx = document.createElement("a");
    matchFx.innerText = '赛前分析';
    matchFx.setAttribute('href', 'http://ny.qw02.net:3389/dt/match_fx.html?mid=' + mid + "&ty_id=" + ty_id + "&?mid=" + mid);
    matchFx.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 3px 10px;');
    if (siteUrl.indexOf("match_fx") > 0) {
        matchFx.setAttribute("style", 'padding: 2px; color: #fff; background: #6099d3; margin: 3px 10px;')
    } else {
        matchFx.addEventListener("mouseover", function () {
            matchFx.setAttribute('style', 'padding: 2px; color: #199CDF; margin: 3px 10px;');
        })
        matchFx.addEventListener("mouseout", function () {
            matchFx.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 3px 10px;');
        })
    }
    dataDiv.append(matchFx);
    var cup = document.createElement("a");
    let dataDivHr = document.createElement("hr");
    dataDivHr.setAttribute('style', 'height: 5px !important; visibility: hidden !important;')
    dataDiv.append(dataDivHr);
    cup.innerText = '联赛统计';
    cup.setAttribute('href', 'http://ny.qw02.net:3389/db/cup.html?mid=' + mid + "&ty_id=" + ty_id);
    cup.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 3px 10px;');
    if (siteUrl.indexOf("cup") > 0) {
        cup.setAttribute("style", 'padding: 2px; color: #fff; background: #6099d3; margin: 3px 10px;')
    } else {
        cup.addEventListener("mouseover", function () {
            cup.setAttribute('style', 'padding: 2px; color: #199CDF; margin: 3px 10px;');
        })
        cup.addEventListener("mouseout", function () {
            cup.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 3px 10px;');
        })
    }
    dataDiv.append(cup);
    var matchLive = document.createElement("a");
    matchLive.innerText = '现场数据';
    matchLive.setAttribute('href', 'http://ny.qw02.net:3389/dt/match_live.html?mid=' + mid + "&ty_id=" + ty_id);
    matchLive.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 3px 10px;');
    if (siteUrl.indexOf("match_live") > 0) {
        matchLive.setAttribute("style", 'padding: 2px; color: #fff; background: #6099d3; margin: 3px 10px;')
    } else {
        matchLive.addEventListener("mouseover", function () {
            matchLive.setAttribute('style', 'padding: 2px; color: #199CDF; margin: 3px 10px;');
        })
        matchLive.addEventListener("mouseout", function () {
            matchLive.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 3px 10px;');
        })
    }
    dataDiv.append(matchLive);

    // 基础信息
    var leftImg = document.createElement("img");
    leftImg.setAttribute('src', 'http://ny.qw02.net:3389/img/icon/tm/' + info[3] + '.' + tt[info[3]][3])
    leftImg.setAttribute('style', 'width: 30px; height: 30px; padding: 0 30px;')

    var matchName = document.createElement('a');
    matchName.innerText = mt[ty_id][1];
    matchName.setAttribute('style', 'padding: 2px;color: #fff;background-color: ' + mt[ty_id][3])
    matchName.setAttribute('href', 'http://ny.qw02.net:3389/db/cup.html?mid=' + mid + "&ty_id=" + ty_id);

    var leftTeamName = document.createElement('a');
    leftTeamName.innerText = tt[info[3]][1];
    if (info[5]) {
        leftTeamName.innerText = '[' + info[5] + ']' + tt[info[3]][1];
    }
    leftTeamName.setAttribute('href', 'http://ny.qw02.net:3389/dt/team_info.html?mid=' + mid + "&ty_id=" + ty_id + '&tid=' + info[3]);
    leftTeamName.setAttribute('style', 'padding: 0 10px;')
    leftTeamName.addEventListener("mouseover", function () {
        leftTeamName.setAttribute('style', 'padding: 0 10px; color: #199CDF;');
    })
    leftTeamName.addEventListener("mouseout", function () {
        leftTeamName.setAttribute('style', 'padding: 0 10px; color: #000;');
    })


    var vsSpan = document.createElement('span');
    vsSpan.innerText = 'VS'
    vsSpan.setAttribute('style', 'padding: 0 10px; color: #6099d3');

    let rightTeamName = document.createElement('a');
    rightTeamName.innerText = tt[info[4]][1];
    if (info[6]) {
        rightTeamName.innerText = tt[info[4]][1] + '[' + info[6] + ']';
    }
    rightTeamName.setAttribute('href', 'http://ny.qw02.net:3389/dt/team_info.html?mid=' + mid + "&ty_id=" + ty_id + '&tid=' + info[4]);
    rightTeamName.setAttribute('style', 'padding: 0 10px;')
    rightTeamName.addEventListener("mouseover", function () {
        rightTeamName.setAttribute('style', 'padding: 0 10px; color: #199CDF;');
    })
    rightTeamName.addEventListener("mouseout", function () {
        rightTeamName.setAttribute('style', 'padding: 0 10px; color: #000;');
    })


    var rightImg = document.createElement("img");
    rightImg.setAttribute('src', 'http://ny.qw02.net:3389/img/icon/tm/' + info[4] + '.' + tt[info[4]][3]);
    rightImg.setAttribute('style', 'width: 30px; height: 30px; padding: 0 30px;');

    if (info[8]) {
        var weatherSpan = document.createElement('span');
        weatherSpan.innerText = info[8].split('|')[1];
        weatherSpan.setAttribute('style', 'color: #199CDF;padding-right: 20px');
    }

    var matchTimeSpan = document.createElement('span');
    matchTimeSpan.innerText = info[7];
    matchTimeSpan.setAttribute('style', 'color: #2518ad;');
    matchTimeSpan.setAttribute('id', 'matchTimeSpan');

    var restTimeSpan = document.createElement('span');
    restTimeSpan.setAttribute('style', 'padding-left: 20px; color: #199CDF; font-size: 10px')
    restTimeSpan.setAttribute('id', 'restTimeSpan');
    setInterval(calMatchRestTime, 1000, matchTime);

    var baseDiv = document.createElement("div");
    baseDiv.setAttribute("id", "base-data");
    baseDiv.setAttribute("style", "min-width: 640px;text-align: center;");
    baseDiv.append(leftImg);
    baseDiv.append(matchName);
    baseDiv.append(leftTeamName);
    baseDiv.append(vsSpan);
    baseDiv.append(rightTeamName);
    baseDiv.append(rightImg);
    baseDiv.append(document.createElement("br"))
    if (info[8]) {
        baseDiv.append(weatherSpan);
    }
    baseDiv.append(matchTimeSpan);
    baseDiv.append(restTimeSpan);

    // 指数
    var indexDiv = document.createElement("div");
    indexDiv.setAttribute("id", "index-data");
    indexDiv.setAttribute("style", "min-width: 350px;  text-align: left;");

    const dsMap = {397: 'SB', 8: '澳门', 470: '小利', 474: '沙巴', 274: 'B365', 245: '小易', 589: '小明', 512: '小金', 516: '12B'};
    ds.forEach(function (item) {
        var itemElm = document.createElement("a");
        itemElm.innerText = dsMap[item];
        itemElm.setAttribute('href', 'http://ny.qw02.net:3389/dt/dsa3.html?wf=a11&mid=' + mid + "&ty_id=" + ty_id + '&cid=' + item);
        itemElm.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 1px 6px;');
        if (siteUrl.indexOf('cid=' + item) > 0) {
            itemElm.setAttribute("style", 'padding:2px;color: #fff; background: #6099d3; margin: 3px 10px;');
        } else {
            itemElm.addEventListener("mouseover", function () {
                itemElm.setAttribute('style', 'padding: 2px; color: #199CDF; margin: 1px 6px;');
            })
            itemElm.addEventListener("mouseout", function () {
                itemElm.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 1px 6px;');
            })
        }
        indexDiv.append(itemElm);
    })
    let indexDivHr = document.createElement("hr");
    indexDivHr.setAttribute('style', 'height: 5px !important; visibility: hidden !important;')
    indexDiv.append(indexDivHr);

    var obElm = document.createElement("a");
    obElm.innerText = "欧赔指数";
    obElm.setAttribute('href', 'http://ny.qw02.net:3389/oupei_bf/shuju.html?mid=' + mid + "&ty_id=" + ty_id);
    obElm.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 1px 4px;');
    if (siteUrl.indexOf("oupei_bf") > 0) {
        obElm.setAttribute("style", 'padding: 2px; color: #fff; background: #6099d3; margin: 1px 4px;')
    } else {
        obElm.addEventListener("mouseover", function () {
            obElm.setAttribute('style', 'padding: 2px; color: #199CDF; margin: 1px 4px;');
        })
        obElm.addEventListener("mouseout", function () {
            obElm.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 1px 4px;');
        })
    }
    indexDiv.append(obElm);

    const obMap = [["zh_abe", "亚大欧"], ["zh_sd", "单双"], ["zh_ha", "半全场"], ["zh_gg", "波胆"], ["zh_ag", "入球数"], ["zh_flg", "先后进球"]];
    zh.forEach(function (item, index) {
        if (item === 1) {
            var itemElm = document.createElement("a");
            itemElm.innerText = obMap[index][1];
            itemElm.setAttribute('href', 'http://ny.qw02.net:3389/dt/' + obMap[index][0] + '.html?mid=' + mid + "&ty_id=" + ty_id);
            itemElm.setAttribute('style', 'padding: 2px; color: #2518ad; margin: 1px 4px;');
            if (siteUrl.indexOf(obMap[index][0]) > 0) {
                itemElm.setAttribute("style", 'padding: 2px; color: #fff; background: #6099d3; margin: 1px 4px;')
            } else {
                itemElm.addEventListener("mouseover", function () {
                    itemElm.setAttribute('style', 'padding: 2px; color: #199CDF; margin:  1px 4px;');
                })
                itemElm.addEventListener("mouseout", function () {
                    itemElm.setAttribute('style', 'padding: 2px; color: #2518ad; margin:  1px 4px;');
                })
            }
            indexDiv.append(itemElm);
        }
    })

    // 头
    var headerDiv = document.createElement("div");
    headerDiv.setAttribute("id", "my-header");
    if (siteUrl.indexOf('oupei_bf') > 0) {
        headerDiv.setAttribute("style", "background: linear-gradient(#fff, #eef2f4); font-size:12px; line-height: 12px; height: 50px; width: 1200px;padding-top: 5px; margin: auto;display: flex;");
    } else {
        headerDiv.setAttribute("style", "background: linear-gradient(#fff, #eef2f4); font-size:12px; height: 50px; width: 1185px;padding-top: 5px; margin: auto;display: flex;");
    }
    headerDiv.append(dataDiv);
    headerDiv.append(baseDiv);
    headerDiv.append(indexDiv);

    var parentDiv = document.createElement("div");
    parentDiv.setAttribute("id", "parent-header");
    parentDiv.setAttribute("style", "background: linear-gradient(#fff, #eef2f4); margin: auto;");
    parentDiv.append(headerDiv);

    document.body.insertBefore(parentDiv, document.body.firstElementChild);
}

function redirect90VsUrl(siteUrl) {
    if (siteUrl.indexOf("ny.qw02.net:3389/dt/index.html") > 0) {
        //球队往绩
        if (siteUrl.indexOf("team_fx") > 0) {
            window.location.href = siteUrl.replace("dt/index", "dt/team_fx");
        }
        //赛前分析
        if (siteUrl.indexOf("match_fx") > 0) {
            window.location.href = siteUrl.replace("dt/index", "dt/match_fx");
        }
        //联赛统计
        if (siteUrl.indexOf("cup") > 0) {
            window.location.href = siteUrl.replace("dt/index", "db/cup");
        }
        //现场数据
        if (siteUrl.indexOf("match_live") > 0) {
            window.location.href = siteUrl.replace("dt/index", "dt/match_live");
        }
        //博彩公司
        if (siteUrl.indexOf("ds") > 0) {
            window.location.href = siteUrl.replace("dt/index", "dt/dsa3");
        }
        //百家欧指
        if (siteUrl.indexOf("shuju") > 0) {
            window.location.href = siteUrl.replace("dt/index", "oupei_bf/shuju");
        }
        //亚大欧
        if (siteUrl.indexOf("zh_abe") > 0) {
            window.location.href = siteUrl.replace("dt/index", "dt/zh_abe");
        }
    }
}

function checkElm(checkSelector) {
    try {
        var checkboxElement = document.querySelector(checkSelector);
        if (!checkboxElement.checked) {
            checkboxElement.click();
        }
    } catch (e) {
        console.error(e);
    }
}

function checkElmList(checkSelectorList) {
    checkSelectorList.forEach(function (item) {
        checkElm(item);
    })
}

function notCheckElm(checkSelector) {
    try {
        var checkboxElement = document.querySelector(checkSelector);
        if (checkboxElement.checked) {
            checkboxElement.click();
        }
    } catch (e) {
        console.error(e);
    }
}

function improveShowFor90VS() {
    // 不可切换为简体，否则点不开联赛
    // checkElm("#gongneng1 > li:nth-child(4) > i > span");
    // 显示红牌、黄牌、排名
    checkElm("#match_red");
    checkElm("#match_yellow");
    checkElm("#qdpm");
    // 隐藏所有全局广告
    document.querySelectorAll("[id^='g_zd']").forEach(function (item) {
        item.style.display = "none";
    });
    // 隐藏所有列表广告
    document.querySelectorAll("[id^='gg']").forEach(function (item) {
        item.style.display = "none";
    });
    // 隐藏header
    document.querySelector("#header").style.height = 0;
    document.querySelector("#header > div.logo").style.display = "none";
    // 隐藏提示
    document.querySelector("#c_con > span").style.display = "none";
    // 隐藏大baner图
    document.querySelector("#box_pei > div:nth-child(3)").remove()

}


function imporoveFor90VsDetail(siteUrl) {
    if (siteUrl.indexOf("ny.qw02.net") > 0) {

        if (siteUrl.indexOf("team_fx") > 0 || siteUrl.indexOf("match_fx") > 0 || siteUrl.indexOf("team_info") > 0) {
            checkElmList(["#bss", "#bbs", "#pms", "#yds", "#jfs", "#jqs"])
            ignoreError(function () {
                document.querySelector("#jfy1").click();
            })
            ignoreError(function () {
                document.getElementsByName('jfy')[1].click();
            })
        }
        if (siteUrl.indexOf("cup") > 0) {
            checkElmList(["#chk_pm", "#chk_bs", "#chk_yd"])
            ignoreError(function () {
                document.querySelector("#language2").click();
            })
        }
        if (siteUrl.indexOf("cup") > 0) {
            checkElmList(["#chk_pm", "#chk_bs", "#chk_yd"])
            ignoreError(function () {
                document.querySelector("#language2").click();
            })
        }
        var obList = ["zh_abe", "zh_sd", "zh_ha", "zh_gg", "zh_ag", "zh_flg"];
        obList.forEach(function (item) {
            if (siteUrl.indexOf(item) > 0) {
                // 调用90vs自带函数设置大字体
                ignoreError(function () {
                    font_set(13);
                })
            }
        })
        if (siteUrl.indexOf('team_info') > 0) {
            // 球队首发阵容显示不出来（90vs的bug， JFY=0 -> JFY='0'）故手动切换一下
            ignoreError(function () {
                document.getElementsByName('jfy')[0].click();
                document.getElementsByName('jfy')[1].click();
            })
        }
    }
}

function improveShowFor310V() {
    // 隐藏header
    document.querySelector("#idad_23_jia").style.display = "none";
    document.querySelector("#ggg_top_jia").style.display = "none";
    document.querySelector("body > table:nth-child(5) > tbody > tr:nth-child(1) > td:nth-child(1)").style.display = "none";
    // 点击功能设置
    document.querySelector("#idm2 > td:nth-child(21)").click();
    document.getElementById("id_m").style.display = "none";
    // 国语
    checkElm("#jfy1");
    // 角球
    checkElm("#id_jq");
    // 球队排名
    checkElm("#id_qdpm");
    // 让球
    checkElm("#id_otp0");
    // 大小球
    checkElm("#id_otp1");
    // 欧赔
    checkElm("#id_otp2");
    // 语音提示
    checkElm("#yyts2");
    // 球队语言
    checkElm("#jfy_1");
    // 舒适大字体
    checkElm("#zt_11");
    // 不显示入球
    notCheckElm("#id_m > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(31) > td > input[type=checkbox]");
    // 显示积分
    checkElm("#id_m > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(35) > td > input[type=radio]:nth-child(2)");
    SFX = sfxOverride;
}

function ignoreError(func) {
    try {
        func();
    } catch (e) {
        console.error(e);
    }
}

function boldFont() {
    // 微软雅黑+加粗
    var css = '*:not([class*="icon"]):not([class*="fa"]):not([class*="logo"]):not([class*="mi"]):not([class*="code"]):not(i){font-family: "Microsoft Yahei",Arial,"Material Icons Extended",stonefont,iknow-qb_share_icons,review-iconfont,mui-act-font,fontAwesome,tm-detail-font,office365icons,MWF-MDL2,global-iconfont,"Bowtie",myfont !important;font-weight:900 !important;}';
    var style = document.createElement('style');
    style.innerHTML = css
    ignoreError(function () {
        document.head.appendChild(style);
    })
}

// 获取参数
function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
}

function ajaxGet(url) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', url, false);
    httpRequest.send();
    return httpRequest.responseText;
}

function calMatchRestTime(matchTime) {
    let now = new Date();
    let restTime = matchTime.getTime() - now.getTime();
    if (restTime <= 0 && restTime > -100 * 60 * 1000) {
        document.querySelector("#restTimeSpan").innerText = '比赛已开始';
    }
    if (restTime < -100 * 60 * 1000) {
        document.querySelector("#restTimeSpan").innerText = '比赛已结束';
    }
    if (restTime >= 0) {
        var restTimeStr = "距开赛还有: ";

        let days = Math.floor(restTime / (1000 * 60 * 60 * 24));
        let hours = Math.floor((restTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((restTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((restTime % (1000 * 60)) / 1000);

        if (days > 0) {
            restTimeStr += days + '天'
        }
        if (hours > 0) {
            restTimeStr += (Array(2).join(0) + hours).slice(-2) + '小时'
        }
        if (minutes >= 0) {
            restTimeStr += (Array(2).join(0) + minutes).slice(-2) + '分'
        }
        if (seconds >= 0) {
            restTimeStr += (Array(2).join(0) + seconds).slice(-2) + '秒'
        }

        document.querySelector("#restTimeSpan").innerText = '' + restTimeStr;
    }
}

// 覆盖310v点击函数, index.html -> indexxx.html
function sfxOverride(fg, match_id, type_id) {
    if (!match_id) {
        var e = window.event || arguments.callee.caller.arguments[0], o = e.srcElement ? e.srcElement : e.target, r = o,
            a;
        while (r.tagName != "TR") r = r.parentNode;
        var tr_i = r.getAttribute('i');
        k = d0[1][tr_i];
        match_id = k[0];
    }
    if (fg == 2) {
        if (pl == 0) fg = "e100";
        else if (pl == 1) fg = "a100";
        else fg = "b100";
    }
    switch (fg) {
        //v=[['inall','入球数'],['half','半全场'],['bd100','波胆'],['sd100','单双'],['b100','大小'],['a100','亚赔'],['e100','欧赔'],['a','盘路'],[4,'往绩']];
        case 'info':
            window.open(neiye_url + "/dt/indexxx.html?mid=" + match_id + "&ty_id=" + type_id + "&tp=cup");
            break;
        case 1:
            window.open(neiye_url + "/dt/indexxx.html?mid=" + match_id + "&tp=team_fx");
            break;
        case "inall":
            window.open(neiye_url + "/dt/indexxx.html?mid=" + match_id + "&tp=ag");
            break;
        case "half":
            window.open(neiye_url + "/dt/indexxx.html?mid=" + match_id + "&tp=half");
            break;
        case "bd100":
            window.open(neiye_url + "/dt/indexxx.html?mid=" + match_id + "&tp=bd");
            break;
        case "sd100":
            window.open(neiye_url + "/dt/indexxx.html?mid=" + match_id + "&tp=sd");
            break;
        case "b100":
            window.open(neiye_url + "/dt/indexxx.html?mid=" + match_id + "&tp=b100");
            break;
        case "a100":
            window.open(neiye_url + "/dt/indexxx.html?mid=" + match_id + "&tp=a100");
            break;
        case "e100":
            window.open(neiye_url + "/dt/indexxx.html?mid=" + match_id + "&tp=e100");
            break;
        case "a":
        case 3:
            var cid = type_id;
            if (cid && cid.substr(0, 1) == 'z') {
                window.open(neiye_url + "/dt/indexxx.html?mid=" + match_id + "&cid=" + cid.substr(1) + "&tp=zd");
            } else {
                window.open(neiye_url + "/dt/indexxx.html?mid=" + match_id + "&cid=" + CCID + "&tp=ds");
            }
            break;
        case "4":
        case 4:
            window.open(neiye_url + "/dt/indexxx.html?mid=" + match_id + "&tp=match_fx");
            break;
    }
}