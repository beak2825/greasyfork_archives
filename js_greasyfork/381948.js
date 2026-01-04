// ==UserScript==
// @name         论剑37区小号
// @namespace    http://tampermonkey.net/
// @include      http://*.yytou.cn*
// @version      1.8
// @description  脚本有风险 使用需谨慎
// @author       3区专用
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381948/%E8%AE%BA%E5%89%9137%E5%8C%BA%E5%B0%8F%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/381948/%E8%AE%BA%E5%89%9137%E5%8C%BA%E5%B0%8F%E5%8F%B7.meta.js
// ==/UserScript==
/**
 * Created by 随风他哥 on 20/5/2018
 */

// 论剑小号
var urllist0 = [
    "http://sword-direct37.yytou.cn:8086/?id=6759488&time=1516587338053&key=0c6728b2cf8941ccca2ad64066ad59d8&s_line=1",
    "http://sword-direct37.yytou.cn:8086/?id=6759498&time=1516587436190&key=3ae64a869ed3ee2ee95783b4a7a27314&s_line=1",
    "http://sword-direct37.yytou.cn:8086/?id=6759458&time=1516587466814&key=5847022078c533c95f1d0c21ac68de11&s_line=1",
    "http://sword-direct37.yytou.cn:8086/?id=6759492&time=1516587376765&key=af09af3a34db56a999696955cc95dde0&s_line=1",
    "http://sword-direct37.yytou.cn:8086/?id=6759497&time=1516587496671&key=f65957c0592953d983def9ec4534fb57&s_line=1",
    "http://res.yytou.cn/site/jian/sword.html?key=57c91fab15ac91efcec22b33aa7cb7a8&id=7245058&name=laodap11&time=1526014825532&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=6dfc516abddddc85b52e861f0e457762&id=7245076&name=laodap22&time=1526014906679&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=eceec41a23598e239e35c9c2484bded7&id=7245061&name=laodap33&time=1526014969209&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=a4d5355e45ca5a38cb2de116ed823907&id=7245031&name=laodap44&time=1526015028998&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=75700f2918afdfdb895e77c865ca6272&id=7245082&name=laodap55&time=1526015090256&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=8241fb4639ae8199eb99e5625c6ea9cf&id=7245153&name=laodap66&time=1526015150731&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=805efc26503c0c656f3d71b20c8df6a6&id=7245033&name=laodap77&time=1526015255469&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=b436c5f06923c7f6010c294ca021ce83&id=7245124&name=laodap88&time=1526015297914&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=5b90f0a99f0686942cc6f0951b400c37&id=7245468&name=laodap99&time=1526015346848&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=c6bb25085da84e3effcbdde29e7a969e&id=7245483&name=laodap1010&time=1526015390150&area=37&port=8086&jian=1"
];

var storage = window.localStorage;

var knownlist = [];

var curstamp = 0;

var prestamp = 0;

var cmdlist = [];

var deadlock = 0;

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
function overrideclick(cmd) {
    deadlock = 1;

    cmdlist.push(cmd);

    //console.log(cmdlist);

    deadlock = 0;
}

function newoverrideclick() {
    if (cmdlist.length === 0) {
        setTimeout(function() {
            newoverrideclick();
        }, 10);
    } else {
        if (cmdlist.length > 0 && deadlock == 1) {
            //有指令写入 不动数组

            setTimeout(function() {
                newoverrideclick();
            }, 10);
        } else if (deadlock === 0 && cmdlist.length > 0) {
            curstamp = new Date().valueOf();

            if (curstamp - prestamp > 200) {
                if (cmdlist.length !== 0) {
                    //console.log("发送指令"+cmdlist[0]);
                    if(cmdlist[0]){
                        // console.log(cmdlist[0]);
                        clickButton(cmdlist[0]);
                    }

                    cmdlist.shift();

                    prestamp = curstamp;
                }

                setTimeout(function() {
                    newoverrideclick();
                }, 10);
            } else {
                setTimeout(function() {
                    newoverrideclick();
                }, 10); //等待10毫秒执行下一次
            }
        }
    }
}

newoverrideclick();

function Go(dir) {
    var d = dir.split(";");

    for (var i = 0; i < d.length; i++) overrideclick(d[i], 0);
}

var btnList = {}; // 按钮列表

var buttonWidth = "60px";

var buttonHeight = "20px";

var currentPos = 30;

var delta = 25;

function createButton(btnName, func) {
    btnList[btnName] = document.createElement("button"); //生成按钮

    var myBtn = btnList[btnName];

    myBtn.innerText = btnName;

    myBtn.style.position = "absolute";

    myBtn.style.right = "0px";

    myBtn.style.top = currentPos + "px";

    currentPos = currentPos + delta;

    myBtn.style.width = buttonWidth + 12;

    myBtn.style.height = buttonHeight;

    myBtn.addEventListener("click", func);

    document.body.appendChild(myBtn); // 按钮加入窗体中
}

var urllist1 = [
    "http://res.yytou.cn/site/jian/sword.html?key=161f9f4f47136342b23568540f29063e&id=7598616&name=yu1521026&time=1537779119627&area=1&port=8081&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=82711827d227ba10425a133820e18c54&id=7598668&name=yu1521025&time=1537779110002&area=1&port=8081&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=a296fe6886cb39a51749f7295f0157d2&id=7598633&name=yu1521024&time=1537779096493&area=1&port=8081&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=0ef1f8212c5a34d99f44f26d6da3443c&id=7598643&name=yu1521023&time=1537779078956&area=1&port=8081&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=202bae216edfe78d1ce8239a0b738088&id=7598681&name=yu1521022&time=1537779060065&area=1&port=8081&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=d4eb5216304a26d366771fde2f17b744&id=7598688&name=yu1521021&time=1537779039212&area=1&port=8081&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=72cea56f71cadcb6185bb7b6c3ec7024&id=7598640&name=yu1521020&time=1537779008615&area=1&port=8081&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=aa2492e6afe53c81900adc46f7b59d06&id=7598524&name=yu152102&time=1537778997467&area=1&port=8081&jian=1"
];

var urllist37 = [
    "http://res.yytou.cn/site/jian/sword.html?key=57c91fab15ac91efcec22b33aa7cb7a8&id=7245058&name=laodap11&time=1526014825532&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=6dfc516abddddc85b52e861f0e457762&id=7245076&name=laodap22&time=1526014906679&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=eceec41a23598e239e35c9c2484bded7&id=7245061&name=laodap33&time=1526014969209&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=a4d5355e45ca5a38cb2de116ed823907&id=7245031&name=laodap44&time=1526015028998&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=75700f2918afdfdb895e77c865ca6272&id=7245082&name=laodap55&time=1526015090256&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=8241fb4639ae8199eb99e5625c6ea9cf&id=7245153&name=laodap66&time=1526015150731&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=805efc26503c0c656f3d71b20c8df6a6&id=7245033&name=laodap77&time=1526015255469&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=b436c5f06923c7f6010c294ca021ce83&id=7245124&name=laodap88&time=1526015297914&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=5b90f0a99f0686942cc6f0951b400c37&id=7245468&name=laodap99&time=1526015346848&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/jian/sword.html?key=c6bb25085da84e3effcbdde29e7a969e&id=7245483&name=laodap1010&time=1526015390150&area=37&port=8086&jian=1",
    "http://res.yytou.cn/site/sword/sword.html?key=8bb8931bab16ec87838446a391778f9d&id=4228147&name=fory77&time=1503586175200&area=37&port=8086",
    "http://res.yytou.cn/site/sword/sword.html?key=97f38eb8d043d253a7401fb8a9f74bf5&id=4214022&name=ribilang1&time=1497234296930&area=37&port=8086",
    "http://res.yytou.cn/site/sword/sword.html?key=e7f1b459a7426de3f502bcff9f23a3d2&id=4255266&name=z19961104&time=1503585130874&area=37&port=8086",
    "http://res.yytou.cn/site/sword/sword.html?key=5a3641ff5dc5c9d8fa3cdc3dc12c088e&id=4331515&name=lflun11&time=1497796098326&area=37&port=8086",
    "http://res.yytou.cn/site/sword/sword.html?key=655318a4507fdbb8983ea1f467617f2a&id=4215424&name=jun522&time=1497013947405&area=37&port=8086",
    "http://res.yytou.cn/site/sword/sword.html?key=fca1c3b794d2482afaea355564c23cae&id=4307628&name=x8301780&time=1495453688561&area=37&port=8086",
    "http://res.yytou.cn/site/sword/sword.html?key=779f6e227b6ad6ce27cdb4721d03903c&id=4214108&name=jun521&time=1497013893640&area=37&port=8086",
    "http://res.yytou.cn/site/sword/sword.html?key=9b3fbc063e83a8a979cc866a57248c75&id=4285621&name=lflun1&time=1497796004483&area=37&port=8086",
];
var urllist37_1 = [
    // 'http://sword-server37.yytou.cn/?id=4254240&time=1496395399029&key=b1e7b956bb0d1807e57a6a798db73ee1&s_line=1',
    'http://sword-direct37.yytou.cn:8086/?id=6759436&time=1516587241983&key=ecf4ab96f8044d55ccb23ed29b7d485a&s_line=1',
    "http://sword-direct37.yytou.cn:8086/?id=6759488&time=1516587338053&key=0c6728b2cf8941ccca2ad64066ad59d8&s_line=1",
    "http://sword-direct37.yytou.cn:8086/?id=6759498&time=1516587436190&key=3ae64a869ed3ee2ee95783b4a7a27314&s_line=1",
    "http://sword-direct37.yytou.cn:8086/?id=6759458&time=1516587466814&key=5847022078c533c95f1d0c21ac68de11&s_line=1",
    "http://sword-direct37.yytou.cn:8086/?id=6759492&time=1516587376765&key=af09af3a34db56a999696955cc95dde0&s_line=1",
    "http://sword-direct37.yytou.cn:8086/?id=6759497&time=1516587496671&key=f65957c0592953d983def9ec4534fb57&s_line=1",
    "http://sword-direct37.yytou.cn:8086/?key=04dc381d32aeb16037bd9c61bc0a1287&id=4228290&name=ad_UE1x77rJh4lC&time=1494001589195&s_line=1",
    "http://sword-direct37.yytou.cn:8086/?key=f7e1510913526c4f0b50b661d5933168&id=3594649&name=zx849747&time=1509947200779&s_line=1",
    "http://sword-direct37.yytou.cn:8086/?key=843f94e6972516967752defc4e6fcf68&id=4240258&name=xlyunshan&time=1502907117205&s_line=1"
];
function set1Qu() {
    storage.clear();
    storage.setItem("qu", 1);
    jumpUrl(urllist1[0])
}
function set37Qu() {
    storage.clear();
    storage.setItem("qu", 37);
    jumpUrl(urllist37[0])
}

function set37Qu1() {
    storage.clear();
    storage.setItem("qu", "37_1");
    jumpUrl(urllist37_1[0])
}

createButton("1区小号", set1Qu);

createButton("37区小号", set37Qu);

createButton("37区大号", set37Qu1);

function selectCorrectUrl(type){
    if(type){
        let portTxt = getQueryString("port");
        if (portTxt == '8081') {
            urllist0 = urllist1;
        } else if (portTxt == '8086') {
            urllist0 = urllist37_1;
        } else {
            urllist0 = urllist37;
        } 
    }else{
        let area = getQueryString("area")
        if (area == 1) {
            urllist0 = urllist1;
        } else if (area == 37) {
            urllist0 = urllist37;
        } else {
            urllist0 = urllist37_1;
        } 
    }
}

selectCorrectUrl();


createButton("挂机", SwordsReport);

function SwordsReport() {
    if ($("div#page>div#out>span.out>table>tbody>tr>td").length !== 0) {
        Go("home"); //;shop buy shop9;items use quanqinka');

        setTimeout(function() {
            var out = $("#out > span > table > tbody > tr > td > span");

            out.each(function() {
                if (
                    $(this)
                        .text()
                        .indexOf("等级") > -1
                ) {
                    var level = parseInt(
                        $(this)
                            .text()
                            .substring(4)
                    );

                    var date = new Date();

                    var H = date.getHours();

                    var W = date.getDay();

                    if (level < 100) {
                        setTimeout(function() {
                            Chap();
                        }, 1000);

                        // Go('work do maikuli');setTimeout(function(){nexturl();}, 500);

                        // }else if(level < 20){

                        // Go('work do duancha');setTimeout(function(){nexturl();}, 500);

                        // }else if(level < 30){

                        // Go('work do dalie');setTimeout(function(){nexturl();}, 500);

                        // }else if(level < 50){

                        // Go('work do baobiao');setTimeout(function(){nexturl();}, 500);

                        // }else if(level < 70){

                        // Go('work do maiyi');setTimeout(function(){nexturl();}, 500);

                        // }else if(level < 100){

                        // Go('work do xuncheng');setTimeout(function(){nexturl();}, 500);

                        // }else if(level < 120){

                        // if(H > 11)Go('items use meigui hua');

                        // Go('work do datufei;items use obj_bingzhen_suanmeitang;jh 1;look_npc snow_mercenary');setTimeout(function(){clickLibaoBtn();}, 1500);setTimeout(function(){Go('home');}, 1600);setTimeout(function(){nexturl();}, 2000);
                    } else {
                        // if (W === 3 && H > 19 && H < 21) {
                        //     setTimeout(function () {
                        //         nexturl();
                        //     }, 100);
                        //     return;
                        // }

                        // if (H > 11) Go('items use meigui hua');

                        if (W === 3 && H < 20) Go("swords report go");

                        if (W === 3 && H > 20) Go("swords get_drop go");
                        // Go('jh 2;n;n;n;n;w;s;muqinjie_lb;');

                        Go(
                            "jh 1;look_npc snow_mercenary;share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 7;items use meigui hua"
                        );

                        setTimeout(function() {
                            clickLibaoBtn();
                        }, 1000);

                        //setTimeout(function(){Go('jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;event_1_16891630;event_1_16891630');}, 2000);

                        // setTimeout(function () {
                        //     nexturl();
                        // }, 5000);
                    }
                }
            });
        }, 2000);
    } else if ($("#out > span > p > button").length !== 0) {
        step2();
    } else {
        setTimeout(function() {
            SwordsReport();
        }, 100);
    }
}

// createButton("登录签到", CheckIn);

//var checkinstep=0;

function CheckIn() {

    // setTimeout(function() {
    //     overrideclick("jh");
    // }, 500);

    // if (g_obj_map.get("msg_jh_list") === undefined) {
    //     setTimeout(function() {
    //         CheckIn();
    //     }, 500);
    // } else {
        // showName();
        // Go("jh 1;look_npc snow_mercenary");

        setTimeout(function() {
            Go("jh 1;look_npc snow_mercenary");
            clickLibaoBtn(); //每周礼包

            // Go("jh 5;n;n;e;look_npc yangzhou_yangzhou9"); // 双儿
        }, 3000);
        setTimeout(function() {
            Go("home;fudi houshan fetch;fudi shennong fetch;fudi juxian fetch_zhuguo;share_ok ;share_ok ;share_ok ;share_ok ;share_ok 5;share_ok ;exercise stop;exercise;sleep_hanyuchuang;jh 5;n;n;e;event_1_44528211;jh 5;n;n;n;w;sign7;home;jh 1;e;n;e;e;event_1_8041045;event_1_8041045;event_1_44731074;event_1_34254529;event_1_29721519;event_1_60133236;home;sort;sort fetch_reward;home;jh 2;n;n;n;n;n;n;n;e;tzjh_lq;touzi_jihua2 buygo 6;home;cangjian get_all;xueyin_shenbinggu blade get_all;xueyin_shenbinggu unarmed get_all;xueyin_shenbinggu throwing get_all;xueyin_shenbinggu stick get_all;xueyin_shenbinggu spear get_all;home")
            // clickLibaoBtn(); // 双儿礼包
            //分享每天一次
            // Go(
            //     "share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 7"
            // );

            //Go('jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;event_1_16891630;event_1_16891630');//李火狮
            //理财
            // Go("jh 2;n;n;n;n;n;n;n;e;look_npc luoyang_luoyang4;tzjh_lq");

            // Go('jh 2;n;n;n;n;w;s;muqinjie_lb;'); //520礼包
            // Go("jh 5;n;n;n;w;sign7;home;exercise"); //扬州签到每天一次
            //clickButton('swords fight_test go', 0)
            // Go("swords fight_test go");
            Go('swords get_drop go;swords report go');
        }, 5000);
        // setTimeout(function() {
        //     showName();
        // },12000)
    // }
}

// 判断是什么礼包

function clickLibaoBtn() {
    var LiBaoName = ["兑换礼包", "1元礼包"];

    var btn = $(".cmd_click2");

    btn.each(function() {
        var txt = $(this).text();

        if (txt.indexOf("礼包") != "-1") {
            if ($.inArray(txt, LiBaoName) == -1) {
                var clickText = $(this).attr("onclick"); // clickButton('event_1_41502934', 1)

                var clickAction = getLibaoId(clickText);

                overrideclick(clickAction);
            }
        }
    });
}

// 获取礼包的名称

function getLibaoId(text) {
    var arr = text.split(",");

    var newArr = arr[0].split("(");

    var nowArr = newArr[1].split("'");

    return nowArr[1];
}

// createButton('自动判断', NewFunc);

function NewFunc() {
    var host = window.location.host;

    if (host == "login.mobile.yytou.com") {
        step0();
    } else if (host == "entry.sword.yytou.cn") {
        step1();
    } else {
        setTimeout(function() {
            step2();
        }, 2000);
    }
}

// createButton('新建小号', createNew);

function createNew() {
    window.location.href = "http://jians.yytou.cn/?area=37";
}

// createButton('注册', step0);

function step0() {
    goReg();

    $("#random_btn").click();

    setTimeout(function() {
        var loginBtn = document.getElementById("login_btn");

        loginBtn.click();
    }, 2000);
}

// createButton('选区', step1);

function step1() {
    window.location.href = "http://entry.sword.yytou.cn/selArea.do?area=37";
}

// createButton('继续', step2);

function step2() {
    var r = Math.random();

    if (r > 0.5) {
        overrideclick("男性");
    } else {
        overrideclick("女性");
    }

    setTimeout(function() {
        $("#b_input_1").click();
    }, 5000);

    setTimeout(function() {
        step3();
    }, 10000);
}

function step3() {
    Go("孤儿;ask start_zhongshanglaozhe;fight start_mengmianren");

    SkillInter = setInterval(skillSet, 1000);

    setTimeout(function() {
        step4();
    }, 5000);
}

function step4() {
    if ($("#skill_1")[0] === undefined) {
        clearInterval(SkillInter);

        Go(
            "ask start_zhongshanglaozhe;go south;guanchaxuanya;tiaoxiaxuanya;qiguaiguozi;go east;guanchashendiao;ask start_shendiao;shouze ok"
        );

        setTimeout(function() {
            inputStorage();

            Go("home;work do maikuli");
        }, 10 * 1000);

        setTimeout(function() {
            SwordsReport();
        }, 15 * 1000);
    } else {
        setTimeout(function() {
            step4();
        }, 2000);
    }
}

// 使用技能

function skillSet() {
    if ($("#skill_1")[0] !== undefined) {
        var skillArr = ["扑击格斗之技"];

        var skillIdA = ["1", "2", "3", "4"];

        var clickSkillSwitch = false;

        $.each(skillIdA, function(index, val) {
            var btn = $("#skill_" + val);

            var btnName = btn.text();

            for (var i = 0; i < skillArr.length; i++) {
                var skillName = skillArr[i];

                if (btnName == skillName) {
                    btn.find("button").trigger("click");

                    clickSkillSwitch = true;

                    break;
                }
            }
        });

        if (!clickSkillSwitch && $(".cmd_skill_button").length > 0) {
            clickButton("auto_fight 1");
        }
    }
}

skillset_i = setInterval(skillSet, 1000);

function Chap() {
    if ($("div#page>div#out>span.out>table>tbody>tr>td").length !== 0) {
        Go("home;jh");

        setTimeout(function() {
            var buttonDom = $("button.cmd_med");

            buttonDom.each(function() {
                if (
                    $(this)
                        .text()
                        .indexOf("进入") > -1
                ) {
                    var jhText = $(this).attr("onclick");

                    if (jhText.indexOf("jh 1") > -1) {
                        Chap1();
                    } else if (jhText.indexOf("jh 2") > -1) {
                        Chap2();

                        // }else if(jhText.indexOf('jh 3') > -1){

                        // Chap3();

                        // }else if(jhText.indexOf('jh 4') > -1){

                        // Chap4();

                        // nexturl();
                    } else {
                        // nexturl();

                        TaskChap2();
                    }
                }
            });
        }, 1000);
    }
}

function Chap1() {
    Go("jh 1;ask snow_waiter;ask snow_mercenary;e;fight snow_worker");

    var steplist = ["n;e;give snow_guard;home"];

    var firstask =
        "jh 1;e;s;w;w;e;s;n;e;n;n;w;e;n;w;e;n;w;e;n;w;e;n;s;e;w;s;e;e;w;w;s;s;e;e;n;s;e;e;n;s;s;n;e;w;w;w;w;w;s;e;s;go northeast;go northeast;home";

    setTimeout(function() {
        NextStep(steplist);
    }, 2000);
}

function Chap2() {
    Go("jh 2;n;ask luoyang_luoyang18;n;kill luoyang_xiaotou");

    var steplist = [
        "n;kill luoyang_xiaotou",
        "e;kill luoyang_xiaotou",
        "fight luoyang_luoyang27",
        "s;kill luoyang_xiaotou",
        "home"
    ];

    setTimeout(function() {
        NextStep(steplist);
    }, 2000);
}

function TaskChap2() {
    Go(
        "jh 2;n;n;n;n;n;e;e;n;ask luoyang_luoyang_fb6;ask luoyang_luoyang_fb6;ask luoyang_luoyang_fb6;s;w;w;n;n;n;ask luoyang_luoyang22;ask luoyang_luoyang22;ask luoyang_luoyang22;give luoyang_luoyang22;use_all;n;e;n;n;ask luoyang_luoyang2;ask luoyang_luoyang2;ask luoyang_luoyang2;n"
    );

    killcjlsl_i = setInterval(killcjlsl, 0.5 * 1000);
}

function killcjlsl() {
    if ($("#skill_1")[0] === undefined) {
        var out = $("#out2 .out2");

        out.each(function() {
            if ($(this).hasClass("done")) {
                return;
            }

            $(this).addClass("done");

            var txt = $(this).text();

            if (txt.indexOf("对著藏剑楼首领喝道") != "-1") {
                Go("kill luoyang_canjianloushouling");
            } else if (txt.indexOf("获得藏剑楼腰牌") != "-1") {
                clearInterval(killcjlsl_i);

                Go("s;s;s;w;s;give luoyang_luoyang22;use_all;home");

                setTimeout(function() {
                    nexturl();
                }, 2000);
            }
        });
    } else {
        clearInterval(skillset_i);

        Go("auto_fight 0");
    }
}

function Chap3() {
    Go("jh 3;ask huashancun_huashancun12;fight huashancun_huashancun12");

    var steplist = [
        "n",
        "event_1_38583676;event_1_38583676;event_1_38583676;event_1_38583676;event_1_38583676",
        "s;s;fight huashancun_popitouzi",
        "s;fight huashancun_huashancun1",
        "w;give huashancun_huashancun6",
        "home"
    ];

    setTimeout(function() {
        NextStep(steplist);
    }, 2000);
}

function Chap4() {
    Go("jh 4;ask huashan_huashan14;fight huashan_huashan14");

    var steplist = [
        "n;n;fight huashan_huashan2",
        "n;n;fight huashan_huashan25",
        "n;n;fight huashan_huashan26",
        "n;fight huashan_huashan27",
        "n;kill huashan_huashan24",
        "n;fight huashan_huashan8",
        "n;ask huashan_gao;n;n;n;ask huashan_lao;fight huashan_lao",
        "s;w;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725;event_1_60189725",
        "e;s;ask huashan_yue;home"
    ];

    setTimeout(function() {
        NextStep(steplist);
    }, 2000);
}

function Chap5() {
    Go("jh 5;n;n;n;w;sign7;e;s;e;look_npc yangzhou_yangzhou9"); // 双儿

    setTimeout(function() {
        clickLibaoBtn();
        nexturl();
    }, 3000);
}

function NextStep(steplist) {
    var a = arguments;

    if ($("#skill_1")[0] !== undefined) {
        setTimeout(function() {
            NextStep(steplist);
        }, 2000);
    } else {
        var step = steplist.shift();

        Go(step);

        if (steplist.length > 0) {
            setTimeout(function() {
                NextStep(steplist);
            }, 2000);
        } else {
            setTimeout(function() {
                nexturl();
            }, 1000);
        }
    }
}

// createButton("我是谁", showName);

function showName() {
    Go("home_prompt"); // 主页
    Go("score"); // 状态
    var elem = $("span.out3:contains(】)").first();
    var m = elem.text().match(/】(.*)/);

    if (m != null) {
        myname = m[1];
        console.log(myname)
        btnList["我是谁"].innerText = myname;
    }
}

createButton("清储存", clearStorage);

createButton("读储存", showStorage);

// createButton("读num", showNum);

function inputStorage() {
    var r = Math.random();

    var url = window.location;

    storage.setItem(r, url);
}

function showNum() {
    var urlindex = parseInt(storage.storage_urlindex);

    console.log("小号序号 " + urlindex);

    btnList["读num"].innerText = "小号" + urlindex;
}

function showStorage() {
    for (var i = 0; i < storage.length; i++) {
        //key(i)获得相应的键，再用getItem()方法获得对应的值

        console.log(storage.getItem(storage.key(i)));
    }
}

function clearStorage() {
    for (var i = 0; i < storage.length; i++) {
        //key(i)获得相应的键，再用getItem()方法获得对应的值

        console.log(storage.getItem(storage.key(i)));

        storage.clear();
    }
}

createButton("小号数量", countNum);

function countNum() {
    alert("小号数量 " + urllist.length);
}

createButton("下个小号", nexturl);

function Newurl() {
    var CurrentURL = window.location + "";

    var str = CurrentURL.slice(37, 73);

    for (i = 0; i < urllist.length; i++) {
        if (urllist[i].indexOf(str) > -1) {
            if (i == urllist.length - 1) i = -1;

            i++;


            jumpUrl(urllist[i])

            break;
        }
    }
}

function nexturl() {

    var urlindex = 0;

    var urlsnum = urllist.length - 1;

    if (storage.hasOwnProperty("storage_urlindex")) {
        urlindex = parseInt(storage.getItem("storage_urlindex"));

        if (urlindex > urllist.length - 2){
            urlindex = -1;
            // 切换账号
            storage.clear();
            selectCorrectUrl(true)
        } 

        urlindex++;
        storage.setItem("storage_urlindex", urlindex);
        //storage.storage_urlindex = urlindex;

        console.log("小号序号 " + urlindex);
    } else {
        urlindex = -1;

        urlindex++;

        storage.storage_urlindex = urlindex;
    }

    jumpUrl(urllist[urlindex])

    //setTimeout((function(){window.location.href = urllist[urlindex];}), 3000);
}

function jumpUrl(url){

    if (window != top){
        top.location.href = url;
    }else{
        window.location.href = url;
    }
}

var urllist = urllist0;
// for (i = 0; i < urllist0.length - 1; i += 1) urllist.push(urllist0[i]);

// showNum();

// 判断是不是第一个url
function goFirstUrl(){
    if (!storage.hasOwnProperty("storage_urlindex")) {
        if(window.location.href != urllist[0]){
            storage.setItem("storage_urlindex", 0);
            jumpUrl(urllist[0])
        }
    }
}

// SwordsReport();
goFirstUrl();

$(function(){
    CheckIn();
    setTimeout(function() {
        nexturl();
    }, 1 * 60 * 1000);
})
//setTimeout((function(){Newurl();}), 10*1000);

//setTimeout((function(){NewFunc();}), 5*1000);

//setTimeout((function(){createNew();}), 60*1000);
