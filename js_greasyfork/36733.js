// ==UserScript==
// @name         mud Lun
// @namespace    http://tampermonkey.net/
// @version      25.79 会员点
// @description  个人专用
// @author       Yu
// @include      http://*.yytou.cn*
// @include      http://*.hero123.cn*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/36733/mud%20Lun.user.js
// @updateURL https://update.greasyfork.org/scripts/36733/mud%20Lun.meta.js
// ==/UserScript==

var isOnline = true;
// 要突破的技能
var topoText = '神龙东来,冰月破魔枪,燎原百击,月夜鬼萧,移花接玉刀,左手刀法,天刀八诀,天魔妙舞,神剑慧芒,不凡三剑,天外飞仙,紫虚辟邪剑,折花百式,打狗棒法,释迦拈花指,降龙廿八掌,弹指神通,无相六阳掌,冰玄鞭法,子母龙凤环,九星定形针,九字真言印,紫血大法,白首太玄经,龙象般若功,九阴逆,长春不老功,云梦归月,踏月留香,孔雀翎,飞刀绝技,覆雨剑法,织冰剑法,翻云刀法,排云掌,如来神掌,拈花解语鞭,十怒蛟龙索,玄冥锤子,天火飞锤,四海断潮斩,昊天破周斧,玄天杖法,辉月杖法,破军棍诀,千影百伤棍,道种心魔经,生生造化功,万流归一,幽影幻虚步,十二都天神杖';

// 要使用的技能 //
var useSkills = '月夜鬼萧；天刀八诀；火贪一刀；天外飞仙；无剑之剑；总决式；哀霜泯灭；神龙东来；燎原百击；冰月破魔枪；如来神掌；九溪断月枪；燎原百破；排云掌法；九天龙吟剑法；覆雨剑法；雪饮狂刀；翻云刀法；独孤九剑；玄铁剑法；辟邪剑法；天师剑法';

// 要交好的游侠
var loveYouxia = '李玄霸';
var assistant = 'u6965572(1)';
// var assistant = 'u7598681';
var all_userName = '';
// miti
var knownlist = [];
var right0ButtonArray = [];
var dispatchMessageListener = {};
var dispatchMessageList = [];
var clickButtonListener = {};
var show_userListener = {};
var show_scoreListener = {};
var qiangdipiTrigger = 0;
var curstamp = 0;
var prestamp = 0;
var cmdlist = [];
var deadlock = 0;
//
var hasDoneBangPai4 = false;

var my_family_name = '';

window.searchName = null;
var nameObj = {
    '4253282': '东方',
    '7030223': '王佬跟班',
    '7894304': '火狼',
    '4219507': '王佬'
};

//go函数
var isDelayCmd = 1, // 是否延迟命令
    cmdCache = [],      // 命令池
    cmd = null,         //当前命令
    cmd_stop = 0,    //等待
    cmd_room = null,    //当前房间
    cmd_roomb = null,    //之前房间
    cmd_room1 = null,    //yell目的地
    cmd_room2 = null,    //event目的地
    cmd_target = null,    //目标npc
    cmd_target_id = null, //npc的id
    cmdBack = [],       //命令池备份
    timeCmd = null,     // 定时器句柄
    cmdDelayTime = 400; // 命令延迟时间
//-----------
function isContains(str, substr) {
    return str.indexOf(substr) >= 0;
}
//获取房间npc
var all_npc = [];
function fj_npc(name) {
    all_npc = [];
    var r = g_obj_map.get("msg_room");
    var id = null;
    if (r) {
        for (var b = 1; r.get("npc" + b); b++) {
            var l = r.get("npc" + b).split(',');
            all_npc.push(l[0]);
            if (name == ys_replace(l[1])) {
                id = l[0];
            }
        }
    }
    return id
}
//颜色去除
function ys_replace(a) {
    a = a.replace(/\u001b.*?m|\u001b\d{1,2}\u001b|\u0003/g, "");
    return a;
}
// 执行命令串
window.go = function (str) {
    var arr = str.split(";");
    if (isDelayCmd && cmdDelayTime) {
        // 把命令存入命令池中
        cmdCache = cmdCache.concat(arr);

        // 当前如果命令没在执行则开始执行
        if (!timeCmd) delayCmd();
    } else {
        for (var i = 0; i < arr.length; i++) {
            clickButton(arr[i])
        }
    }
};

// 执行命令池中的命令
function delayCmd() {
    if (g_gmain) {
        if (g_gmain.is_fighting) {
            cmd_go();
            return 0;
        }
    }

    var r = g_obj_map.get("msg_room");
    if (cmd_stop == 0) {
        cmd = cmdCache.shift();
        if (!cmd) {
            cmd_go();
            return 0;
        }
        if (cmd.indexOf('jh') != -1) {
            cmdBack = [];
            cmdBack.push(cmd);
        } else {
            cmdBack.push(cmd);
        }
        if (cmd.indexOf('trigger') != -1) {
            //trigger@btn-hitBang
            var id = cmd.split('@')[1];
            $('#' + id).trigger('click');
        } else if (cmd.indexOf('-') != -1) {
            if (cmd.indexOf('yell') != -1) {
                cmd_room1 = cmd.split('-')[1];
                cmd = cmd.split('-')[0];
                cmd_roomb = r.get('short').replace(/\u001b.*?m|\u001b\d{1,2}\u001b/g, "");
                clickButton(cmd);
                cmd_stop = 1;
            }
            else if (cmd.indexOf('event') != -1) {
                cmd_room2 = cmd.split('-')[1];
                cmd = cmd.split('-')[0];
                cmd_roomb = r.get('short').replace(/\u001b.*?m|\u001b\d{1,2}\u001b/g, "");
                clickButton(cmd);
                cmd = 'event';
                cmd_stop = 1;
            }
            else if (cmd.indexOf('kill') != -1 || cmd.indexOf('fight') != -1 || cmd.indexOf('ask') != -1 || cmd.indexOf('get') != -1) {
                cmd_target = cmd.split('-')[1];
                cmd = cmd.split('-')[0];
                cmd_stop = 1;
            }
            else {
                clickButton(cmd);
            }
        } else {
            if (cmd.indexOf('yell') != -1) {
                cmd_room1 = cmd.split('-')[1];
                cmd = cmd.split('-')[0];
                cmd_roomb = r.get('short').replace(/\u001b.*?m|\u001b\d{1,2}\u001b/g, "");
                clickButton(cmd);
                cmd_stop = 1;
            } else {
                clickButton(cmd);
            }
        }
    } else {
        cmd_room = r.get('short').replace(/\u001b.*?m|\u001b\d{1,2}\u001b/g, "");
        switch (cmd) {
            case 'yell': {
                if (cmd_room1 == cmd_room) {
                    cmd_room1 = null;
                    cmd_stop = 0;
                }
            }; break;
            case 'event': {
                if (cmd_room == cmd_room2) {
                    cmd_room2 = null;
                    cmd_stop = 0;
                } else if (cmd_room != cmd_roomb) {
                    cmdCache = cmdBack.concat(cmdCache);
                    cmd_room2 = null;
                    cmd_stop = 0;
                } else {
                    clickButton(cmd);
                }
            }; break;
            case 'kill': {
                if (cmd_target_id) {
                    if (g_obj_map.get("msg_combat_result")) {
                        if (all_npc.contains(g_obj_map.get("msg_combat_result").get('fail_uid').split(',')[0])) {
                            cmd_target = null;
                            cmd_target_id = null;
                            cmd_stop = 0;
                        }
                    }
                } else {
                    cmd_target_id = fj_npc(cmd_target);
                    if (cmd_target_id) {
                        clickButton(cmd + ' ' + cmd_target_id);
                    }
                }
            }; break;
            case 'fight': {
                if (cmd_target_id) {
                    if (g_obj_map.get("msg_combat_result")) {
                        if (all_npc.contains(g_obj_map.get("msg_combat_result").get('fail_uid').split(',')[0])) {
                            cmd_target = null;
                            cmd_target_id = null;
                            cmd_stop = 0;
                        }
                    }
                } else {
                    cmd_target_id = fj_npc(cmd_target);
                    if (cmd_target_id) {
                        clickButton(cmd + ' ' + cmd_target_id);
                    }
                }
            }; break;
            case 'get': {
                clickButton('golook_room');
                setTimeout(function () {
                    $("button.cmd_click3").each(function () {
                        var containNpc = isContains($(this).html(), cmd_target);
                        if (containNpc) {
                            cmd_target = null;
                            eval($(this).attr("onclick").replace("look_item corpse", "get corpse"));
                            cmd_stop = 0;
                        }
                    });
                }, 1000);
            }; break;
            case 'ask': {
                cmd_target_id = fj_npc(cmd_target);
                if (cmd_target_id) {
                    clickButton(cmd + ' ' + cmd_target_id);
                    cmd_stop = 0;
                }
            }; break;
        }
    }
    cmd_go();
}
function cmd_go() {
    // 如果命令池还有命令，则延时继续执行
    if (cmdCache.length > 0 || cmd_stop == 1) {
        timeCmd = setTimeout(delayCmd, cmdDelayTime);
    } else {
        // 没有命令 则归零
        timeCmd = 1;
        setTimeout(function () {
            if (cmdCache.length == 0)
                timeCmd = 0;
            else
                delayCmd();
        }, cmdDelayTime);
    }
}
(function () {

    var btnGroup = [
        {
            'id': '0',
            'name': '隐藏按键',
            'function': function (e) {
                hideShowBtn(e);
            }
        },
        {
            'id': '1',
            'name': '更换技能',
            'function': function (e) {
                interServerFn1(e);
            }
        },
        {
            'id': '2',
            'name': '签到',
            'function': function () {
                CheckIn();
            }
        }, {
            'id': '3',
            'name': '地图导航',
            'function': function () {
                // killDrunkManFunc();
                // 买理财6
                // buyLicai();
                // vipRiChang();
                DaoHang();
            }
        }, {
            'id': '4',
            'name': '正气中',
            'function': function (e) {
                hitScore(e);
            }
        },
        {
            'id': '51',
            'name': '搜尸',
            'function': function (e) {
                setCsearch(e);
                // killSomePerson();
            }
        },
        {
            'id': '5',
            'name': '江湖悬红',
            'function': function (e) {
                jhxh_Func(e);
            }
        }, {
            'id': '6',
            'name': '跨服',
            'function': function (e) {
                interServerFn(e);
            }
        }, {
            'id': '7',
            'name': '对招',
            'function': function (e) {
                fightAllFunc(e);
            }
        }, {
            'id': '8',
            'name': '自动战斗',
            'function': function (e) {
                autoKill(e);
            }
        }, {
            'id': '9',
            'name': '杀青龙',
            'function': function (e) {
                killQinglong(e);
            }
        },
        // {
        //     'id': '10',
        //     'name': '抢红包',
        //     'function': function (e) {
        //         killQLHB(e);
        //     }
        // }, 
        {
            'id': '11',
            'name': '杀天剑',
            'function': function (e) {
                killTianJianTargetFunc(e);
            }
        },
        {
            'id': '13',
            'name': '帮1走路',
            'function': function (e) {
                autoBang1Way(e);
            }
        },
        // {
        //     'id': '20',
        //     // 'name': '悬红眩晕',
        //     'name': '跨服狗卷',
        //     'function': function (e) {
        //         // autoKillXuanhong(e);
        //         getGouJuan();
        //     }
        // },
    ];

    var btnOtherGroup = [
        // {
        //     'id': 'o1',
        //     'name': '比试奇侠',
        //     'function': function (e) {
        //         startFightQixiaFn(e);
        //     }
        // }, 
        {
            'id': 'o18',
            'name': '给奇侠金',
            'function': function (e) {
                giveJinToQixiaFn(e);
            }
        }, {
            'id': 'o2',
            'name': '撩奇侠',
            'function': function (e) {
                // talkSelectQiXia(e);
                QiXiaTalkFunc();
            }
        },
        {
            'id': 'o3',
            'name': '试剑',
            'function': function (e) {
                CheckIn1(e);
            }
        }, {
            'id': 'o4',
            'name': '答题',
            'function': function (e) {
                answerQuestionsFunc(e)
            }
        }, {
            'id': 'o5',
            'name': '存东西',
            'function': function (e) {
                // putStore(e);
                baoguoZhengliFunc()
            }
        }, {
            'id': 'o6',
            'name': '逃犯',
            'function': function (e) {
                killKuaFuTaoFanFn(e);
            }
        },
        // {
        //     'id': 'o8',
        //     'name': '墨家主线1',
        //     'function': function (e) {
        //         mojiaZhuxian(e)
        //         //青龙装备  changeQinglong(e);
        //     }
        // }, 
        // {
        //     'id': 'o9',
        //     'name': '逃跑吃药',
        //     'function': function (e) {
        //         escapeAndEat(e);
        //     }
        // },
        // {
        //     'id': 'o10',
        //     'name': '怼人',
        //     'function': function (e) {
        //         fightAllFunc1(e);
        //     }
        // },
        {
            'id': 'o11',
            'name': '杀隐藏',
            'function': function (e) {
                // fightWithPlayer(e);
                killhideFunc(e);
            }
        }, {
            'id': 'o12',
            'name': '杀好人',
            'function': function (e) {
                killGoodNpc(e);
            }
        }, {
            'id': 'o13',
            'name': '杀坏人',
            'function': function (e) {
                killBadNpc(e);
            }
        }, {
            'id': 'o131',
            'name': '杀本10',
            'function': function (e) {
                // killSomeOne(e);
                killBen10();
            }
        }, {
            'id': 'o14',
            'name': '代码定时',
            'function': function (e) {
                //更换奇侠 changeQiXiaName(e);
                doDaiMa(e)
            }
        },
        // {
        //     'id' : 'o14',
        //     'name' : '新春使者',
        //     'function': function(e){
        //         clickXinChun(e);
        //     }
        // },
        // {
        //     'id' : 'o15',
        //     'name' : '卖花姑娘',
        //     'function': function(e){
        //         clickMaiHua(e);
        //     }
        // },
        {
            'id': 'o16',
            'name': '快捷路径',
            'function': function (e) {
                // getXuanTie()
                // mutourenFn()
                // 杨英雄 goYang()
                goFastWay(e)
            }
        },
        // {
        //     'id': 'o17',
        //     'name': '潜龙标记',
        //     'function': function (e) {
        //         showBiaoJi()
        //     }
        // },
        // {
        //     'id': 'o19',
        //     'name': '观舞',
        //     'function': function (e) {
        //         // ZhuangBei(e);
        //         guanWu();
        //     }
        // }, 
        // {
        //     'id': 'o20',
        //     'name': '京城赌博',
        //     'function': function (e) {
        //         // ZhuangBei(e);
        //         doBo();
        //     }
        // },
        // {
        //     'id' : 'o20',
        //     'name' : '新聊奇侠',
        //     'function': function(e){
        //         QiXiaTalkFunc();
        //     }
        // },
        {
            'id': 'o21',
            // 'name' : '地图碎片',
            'name': '突破',
            'function': function (e) {
                // ditusuipianFunc(e);
                tupoSkills2();
            }
        },
        // {
        //     'id': 'o22',
        //     'name': '突破火腿',
        //     'function': function (e) {
        //         // 交碎片 submitSuipian(e);
        //         tupoHuoTui();
        //     }
        // },
        // {
        //     'id': 'o23',
        //     'name': '对话奇侠',
        //     'function': function (e) {
        //         talkToQixiaFn(e);
        //     }
        // },
        // {
        //     'id' : 'o24',
        //     'name' : '监控年兽',
        //     'function': function(e){
        //         watchNianShou(e);
        //     }
        // },
        {
            'id': 'o25',
            'name': '合宝石',
            'function': function (e) {
                heBaoshi(e);
            }
        }, {
            'id': 'o28',
            'name': '掉线重连',
            'function': function (e) {
                //去给15金 give15Jin(e);
                openReLoad(e)
            }
        }, {
            'id': 'o26',
            'name': '定时恢复',
            'function': function (e) {
                recoverOnTimes(e);
            }
        }, {
            'id': 'o27',
            'name': '一键恢复',
            'function': function (e) {
                recoverOnByClick(e);
            }
        },
        {
            'id': 'o28',
            'name': '恢复内里',
            'function': function (e) {
                recoverOnByClick1(e);
            }
        },
        // {
        //     'id': 'o29',
        //     'name': '华山碎片',
        //     'function': function (e) {
        //         goHuashanSuipian(e);
        //     }
        // }, 
        {
            'id': 'o30',
            'name': '突破火腿',
            'function': function (e) {
                tupoHuoTui();
            }
        },
        {
            'id': 'o31',
            'name': '连吃火腿',
            'function': function (e) {
                tupoHuoTui1();
            }
        },
    ];

    var btnVipGroup = [
        {
            'id': 'v1',
            'name': 'VIP签到',
            'function': function (e) {
                CheckInFunc(e);
            }
        },
        // {
        //     'id': 'v2',
        //     'name': '开白银',
        //     'function': function (e) {
        //         // 侠客岛 newGetXiaKe(e);
        //         openBaiYin(e)
        //     }
        // }, {
        //     'id': 'v3',
        //     'name': '开青木',
        //     'function': function (e) {
        //         // 苗疆炼药 MjlyFunc(e)
        //         openQingMu(e)
        //     }
        // }, {
        //     'id': 'v31',
        //     'name': '开曜玉',
        //     'function': function (e) {
        //         openYaoYu(e)
        //     }
        // }, 
        // {
        //     'id': 'v14',
        //     'name': '吃花',
        //     'function': function (e) {
        //         eatHua(e)
        //         //天山玄冰 TianShanFunc(e)
        //     }
        // }, 
        {
            'id': 'v17',
            'name': '点日常',
            // 'name' : '买糖葫芦',
            'function': function (e) {
                // DaoHang(e)
                // BuyTang(e)
                vipRiChang();
            }
        },
        // {
        //     'id': 'v4',
        //     'name': '铁雪除魔',
        //     'function': function (e) {
        //         goZhuHou();
        //     }
        // }, 
        // {
        //     'id': 'v5',
        //     'name': '大昭壁画',
        //     'function': function (e) {
        //         MianBiFunc(e)
        //     }
        // }, 
        {
            'id': 'v6',
            'name': '完成其他',
            'function': function (e) {
                CheckInFunc1()
            }
        }, {
            'id': 'v7',
            'name': '冰月',
            'function': function (e) {
                getBingyue()
            }
        },
        // {
        //     'id': 'v8',
        //     'name': '十二宫',
        //     'function': function (e) {
        //         goCorrectJiWuPlace();
        //     }
        // }, 
        {
            'id': 'v9',
            'name': '跨服帮战',
            // 'name' : '跨服装备',
            'function': function (e) {
                // changeQinglong1();
                bangZhan_Func(e);
            }
        },
        // {
        //     'id': 'v10',
        //     'name': '打楼',
        //     'function': function (e) {
        //         fightLou(e);
        //     }
        // }, 
        {
            'id': 'v11',
            'name': '战斗装备',
            'function': function (e) {
                beforeFightTongren(e);
            }
        },
        //  {
        //     'id': 'v12',
        //     'name': '穿衣',
        //     'function': function (e) {
        //         fightTongren(e);
        //     }
        // },
        // {
        //     'id': 'v15',
        //     'name': '跟招',
        //     'function': function (e) {
        //         followPozhaoFn(e);
        //     }
        // }, 
        {
            'id': 'v16',
            'name': '买药',
            // 'name' : '天剑目标',
            'function': function (e) {
                maiYao()
                // changeTianJianTarget(e);
            }
        },
        {
            'id': 'v171',
            'name': '队长说话',
            'function': function (e) {
                teamSay(e);
            }
        }, {
            'id': 'v181',
            'name': '跟队长走',
            'function': function (e) {
                followTeam(e);
            }
        },
        {
            'id': 'v19',
            'name': '开鼻血',
            'function': function (e) {
                // 开鼻血
                openBiXue(e);
                // 开白首
                // openBaiShou(e);
            }
        }, {
            'id': 's1',
            'name': '秒突卡+丸',
            'function': function (e) {
                tupoSpeed(e);
            }
        }, {
            'id': 's2',
            'name': '练习',
            'function': function (e) {
                skillPritice(e);
            }
        }, {
            'id': 's3',
            'name': '突破+舍利',
            'function': function (e) {
                tupoSpeed1(e);
            }
        },
        // {
        //     'id': 's5',
        //     'name': '打雪山',
        //     'function': function (e) {
        //         killXue(e);
        //     }
        // },
        // {
        //     'id': 's6',
        //     'name': '打三楼',
        //     'function': function (e) {
        //         killThreeFloor(e);
        //     }
        // }
        // {
        //     'id': 's6',
        //     'name': '打雪山时间',
        //     'function': function (e) {
        //         setKillXueTime(e);
        //     }
        // }
    ];

    var btnSelfGroup = [
        {
            'id': 's4',
            'name': '加入队伍',
            'function': function (e) {
                tellJoinTeam(e);
            }
        },
        {
            'id': 's14',
            'name': '欢迎入伍',
            'function': function (e) {
                acceptTeam(e);
            }
        },
        {
            'id': 's15',
            'name': '进皮总队伍',
            'function': function (e) {
                joinPiTeam(e);
            }
        },
    ];
    var btnMoreGroup = [
        {
            'id': 'm1',
            'name': '杀正邪',
            'function': function (e) {
                killErNiangFn(e);
            }
        }, {
            'id': 'm2',
            'name': '杀逃犯',
            'function': function (e) {
                killTaoFanFn(e);
            }
        }, {
            'id': 'm3',
            'name': '清正邪',
            'function': function (e) {
                clearNpcFn(e);
            }
        }
    ];

    var btnWuYongGroup = [
        // {
        //     'id': 'w1',
        //     'name': '逃跑回坑',
        //     'function': function (e) {
        //         escapeStart(e);
        //     }
        // },
        // {
        //     'id': 'w2',
        //     'name': '逃跑换边',
        //     'function': function (e) {
        //         escapechangeStart(e);
        //     }
        // },
        {
            'id': 'w3',
            'name': '按钮代码',
            'function': function (e) {
                showCode(e);
            }
        },
        {
            'id': 'w4',
            'name': '揣摩技能',
            'function': function (e) {
                chuoMoSkills();
            }
        }
    ];

    var qianLongGroup = [
        {
            'id': '12',
            'name': '监视潜龙',
            'function': function (e) {
                JianQianlong(e);
            }
        }
    ];

    var jianghuGroup = [
        {
            'id': '15',
            'name': '监视江湖',
            'function': function (e) {
                JianJianghu(e);
            }
        }
    ];


    //江湖悬红提示
    var hairsfalling =
    {
        "奇侠秘境": {
            "石街": "jh 2;n;n;n;n;w;event_1_98995501;n",
            "桃花泉": "jh 3;s;s;s;s;s;nw;n;n;e",
            "潭畔草地": "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s;",
            "临渊石台": "jh 4;n;n;n;n;n;n;n;n;n;e;n",
            "沙丘小洞": "jh 6;event_1_98623439;ne;n;ne;ne;ne;event_1_97428251",
            "碧水寒潭": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;se;se;e",
            "小洞天": "jh 24;n;n;n;n;e;e",
            "青云坪": "jh 13;e;s;s;w;w",
            "湖边": "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w",
            "玉壁瀑布": "jh 16;s;s;s;s;e;n;e",
            "悬根松": "jh 9;n;w",
            "夕阳岭": "jh 9;n;n;e",
            "天梯": "jh 24;n;n;n",
            "山溪畔": "jh 22;n;n;w;n;n;n;n;look_npc songshan_songshan7;event_1_88705407;s;s",
            "奇槐坡": "jh 23;n;n;n;n;n;n;n;n",
            "启母石": "jh 22;n;n;w;w",
            "无极老姆洞": "jh 22;n;n;w;n;n;n;n",
            "草原": "jh 26;w",
            "戈壁": "jh 21",
            "云步桥": "jh 24;n;n;n;n;n;n;n;n;n",
            "寒水潭": "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;e;se",
            "危崖前": "jh 25;w",
            "千尺幢": "jh 4;n;n;n;n",
            "玉女峰": "jh 4;n;n;n;n;n;n;n;n;w",
            "长空栈道": "jh 4;n;n;n;n;n;n;n;n;n;e",
            "山坳": "jh 1;e;n;n;n;n;n",
            "猢狲愁": "jh 4;n;n;n;n;n;n;e;n;n",
            "无名山峡谷": "jh 29;n;n;n;n;event_1_60035830;event_1_65661209",
            "悬崖": "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;e",
            "观景台": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n",
            "九老洞": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;n;n;n;n;w;n;n;n;n;n;n;n;n;n;nw;sw;w;nw;w",
            "卢崖瀑布": "jh 22;n;n;n;n;e;n"
        },
        "雪山": {
            '雪婷活动': 'jh 1;e;e;s;ne;ne',
            '扬州活动': 'jh 5;n;n;n;n;n;e;n;e;n;w;n;n',
            '峨眉活动': 'jh 8;w;nw;n;n;n;n;e;e;n;n;e;n;n;n;n;w;n;n;n;n;n;n;n;n;n;nw;nw;n;n',
            '少林活动': 'jh 13;n;n;n;n;n;n;n;n;n;n',
            '明教活动': 'jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;se;se;e',
            '泰山活动': 'jh 24;n;n;n;n;n;n;n;n;w;n;n',
            '星宿活动': 'jh 28;n;w;w;w;w;w;w;nw;ne;nw;ne;nw;ne;nw;ne;nw;ne;nw;ne;e',
            '铁雪活动': 'jh 31;n;n;n;w;w;w;w;n;n;n',
            '冰火雪原活动': 'jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w',
            '冰火冰湖活动': 'jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;e',
            '冰火雪山活动': 'jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;ne;n',
            '绝情谷活动': 'jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne',
            '掩月黑岩活动': 'jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw',
            '掩月朝暮活动': 'jh 43;w;n;n;n;ne;nw;nw;ne',
        },
        // "通天塔" :{
        //     "严松祝老太婆高天威宋公迈灵音灵定元易灵真灵智": "rank go 192",
        // },
        // "红螺寺": {
        //     "项天寿言二娘郝湘震陆孤瞻石刚韩毅青衣秀土方子敬秦仲海": "rank go 193",
        // },
        // "越女剑楼": {
        //     "三少爷南仁通丹枫老人黄杉女子西门吹雪I独孤不败郭嵩阳张鸦九木道人陶弘景宫九曾从子沈浪烛庸子阿青欧冶子": "rank go 203",
        // },
        // "霹雳堂": {
        //     "唐经天慧明金世遗李布衣沈虎禅米苍穹关七方歌吟李沉舟": "rank go 221",
        // },
        // "葬剑谷": {
        //     "陈家洛萧中慧鳌拜夏雪宜华辉蓝凤凰郭靖苗人凤何足道黄裳青莲尊者剑魔慕容垂扫地僧重阳祖师": "rank go 222",
        // },
        // "五鼠": {
        // "「寒士列传」":"乔阴县-书生",
        // "金刚罩": "达摩",
        // "淑女剑": "龙儿",
        // "布鞋": "魏无极",
        // "玄苏剑": "柳淳风",
        // "铁戒指": "杜宽",
        // "烤鸡腿": "雪亭镇-店小二",
        // "绣花小鞋": "柳绘心",
        // "技能搭配秘籍": "魏无极",
        // "皮帽": "客商",
        // "绣鞋": "红娘",
        // "叫花鸡": "洪帮主",
        // "玉竹杖": "洪帮主",
        // "兽皮鞋": "盗墓贼",
        // "银戒": "玉娘",
        // "腰鼓": "龟兹舞女",
        // "风花琼酿": "方秀珣",
        // "青玉令牌": "玄甲卫士",
        // "观海令": "白衣剑客",
        // "莲蓬": "采莲",
        // "拆招基础": "王老二",
        // "金项链": "曲姑娘",
        // "长虹剑": "丐帮长老",
        // "金戒": "英白罗",
        // "白金项链": "公平子",
        // "银丝衣": "古三通",
        // "追风棍": "冼老板",
        // "竹杖": "梁长老",
        // "大环刀": "何不净",
        // "从寿衣撕下的布条": "孤魂野鬼",
        // "黑水伏蛟": "陆得财",
        // "乌檀木刀": "朦胧鬼影",
        // "桃木箱": "桃木箱",
        // "玉石琵琶": "琵琶鬼",
        // "银簪": "妇人",
        // "硫磺": "谜题或师门飞",
        // "馒头": "峨眉山-小贩",
        // "粗瓷大碗": "峨眉山-饭堂",
        // "菠菜粉条": "峨眉山-饭堂",
        // "钻石戒指": "日月神教头目",
        // "香茶": "武当山-小翠",
        // "水蜜桃": "武当山-小翠",
        // "千斤顶": "俞二侠",
        // "黄金令牌": "梦玉楼",
        // "女儿红": "曲馥琪",
        // "紫霜血蝉衣": "蓝止萍",
        // "魔鞭翩珑": "蓝止萍",
        // "柳玉刀": "昭仪",
        // "钻石胸针": "苗郁手",
        // "耳环": "苗郁手",
        // "绣花鞋": "昭仪",
        // "宝蓝缎衫": "瑷伦",
        // "腰带": "莫欣芳",
        // "银翅金餐": "昭蓉",
        // "紫玉宝剑": "安妮儿",
        // "吹雪残云巾": "萧辟尘",
        // "吹雪残云靴": "萧辟尘",
        // "吹雪残云衣": "萧辟尘",
        // "吹雪残云带": "萧辟尘",
        // "妖刀狗屠": "於兰天武",
        // "邪剑穿灵": "潘军禅",
        // "怒龙锦胄": "於兰天武",
        // "金钟罩": "达摩老祖",
        // "宝玉鞋": "澄观",
        // "齐眉棍": "澄灵",
        // "断水剑": "澄尚",
        // "漫天花雨匕": "唐风",
        // "银丝链甲衣": "唐芳",
        // "天心立命扇": "竺霁庵",
        // "紫狼刑天剑": "鹿熙吟",
        // "鬼赤剑": "程倾城",
        // "浣花令": "无名剑客",
        // "萧瑟无晴剑": "甄不恶",
        // "玄冰经天剑": "素厉铭",
        // "微雨落花剑": "骆祺樱",
        // "秋水长河剑": "谢麟玄",
        // "洞庭观潮剑": "祝公博",
        // "青色道袍": "青袍老道",
        // "黄色道袍": "黄袍老道",
        // "石锁": "青城山-黄衣镖师",
        // "紫花瓣儿": "小甜",
        // "轻罗绸衫": "小甜",
        // "满天星": "小甜",
        // "白羽箭囊": "兵器贩子",
        // "周易": "读千里",
        // "步步生莲": "湖边",
        // "羽衣霓裳": "湖边",
        // "小蒲团": "石室",
        // "踏云棍": "七煞堂堂主",
        // "麻辣豆腐": "明教食堂",
        // "珊瑚白菜": "明教食堂",
        // "清水葫芦": "明教食堂",
        // "圣火令": "张教主",
        // "淑文剑": "龙儿",
        // "银钥匙": "龙儿",
        // "豆浆": "肥肥",
        // "蛋糕": "肥肥",
        // "帝王剑": "夜皇",
        // "紫金杖": "灵空",
        // "舍利子": "大昭寺-乞丐",
        // "天龙枪": "杨延庆",
        // "无心锤": "巨灵",
        // "狂风鞭": "楚笑",
        // "夺魂叉": "赵长老",
        // "绣花针": "东方教主",
        // "日月神教腰牌": "外面船夫",
        // "暗灵": "张天师",
        // "飞花逐月之带": "雪鸳",
        // "虞姬剑": "雪蕊儿",
        // "内功心法秘笈": "白袍公",
        // "金算盘": "谜题飞",
        // "铁笛": "高侯爷",
        // "纺纱机": "纺纱女",
        // "凤凰单枞": "茶叶贩子",
        // "荀子": "江陵-书生",
        // "金饭碗": "江陵-乞丐",
        // "精铁秤砣": "米三江",
        // "护心镜": "江陵-巡城参将",
        // "仙桃蒸三元": "江陵-客栈小二",
        // "燕子风筝": "江小酒",
        // "五味子": "水掌柜",
        // "钧红花釉": "霍无双",
        // "桃花肚兜": "金莲",
        // "峨嵋剌": "截道恶匪",
        // "大青树叶": "天龙地上捡",
        // "鱼鳞叶明甲": "阴九幽",
        // "鬼杀剑": "阴九幽",
        // "杜鹃花": "南诏公主",
        // "流云剑": "谢逸紫",
        // "天龙降魔禅杖": "天龙方丈",
        // },
        "雪亭镇": {
            "逄义": "jh 1",
            "店小二": "jh 1",
            "苦力": "jh 1;e",
            "庙祝": "jh 1;e;e",
            "野狗": "jh 1;e;e;s;ne",
            "蒙面剑客": "jh 1;e;e;s;ne;ne",
            "刘安禄": "jh 1;e;n;e",
            "武馆弟子": "jh 1;e;n;e;e",
            "李火狮": "jh 1;e;n;e;e",
            "柳淳风": "jh 1;e;n;e;e;e",
            "柳绘心": "jh 1;e;n;e;e;e;e;n",
            "醉汉": "jh 1;e;n;n",
            "收破烂的": "jh 1;e;n;n",
            "花不为": "jh 1;e;n;n;n;n;e",
            "杜宽": "jh 1;e;n;n;n;n;w",
            "杜宽宽": "jh 1;e;n;n;n;n;w",
            "杨掌柜": "jh 1;e;n;n;n;w",
            "樵夫": "jh 1;e;n;n;n;w",
            "王铁匠": "jh 1;e;n;n;w",
            "安惜迩": "jh 1;e;n;w",
            "黎老八": "jh 1;e;s",
            "老农夫": "jh 1;e;s;w",
            "农夫": "jh 1;e;s;w",
            "魏无极": "jh 1;e;s;w;s",
            "疯狗": "jh 1;e;s;w;w",
            "星河大师": "jh 1;inn_op1",
            "崔元基": "jh 1;inn_op1"
        },
        "洛阳": {
            "农夫": "jh 2;n",
            "守城士兵": "jh 2;n;n",
            "客商": "jh 2;n;n;e",
            "蓑衣男子": "jh 2;n;n;e;s;luoyang317_op1",
            "乞丐": "jh 2;n;n;n",
            "金刀门弟子": "jh 2;n;n;n;e",
            "王霸天": "jh 2;n;n;n;e;s",
            "地痞": "jh 2;n;n;n;n",
            "小贩": "jh 2;n;n;n;n;e",
            "郑屠夫": "jh 2;n;n;n;n;e;s",
            "绿袍老者": "jh 2;n;n;n;n;n;e;e;n;n;e;n",
            "山贼": "jh 2;n;n;n;n;n;e;e;n;n;n",
            "守墓人": "jh 2;n;n;n;n;n;e;e;n;n;n;n",
            "凌云": "jh 2;n;n;n;n;n;e;e;n;n;n;n;e",
            "凌中天": "jh 2;n;n;n;n;n;e;e;n;n;n;n;e",
            "黑衣文士": "jh 2;n;n;n;n;n;e;e;n;n;n;n;n",
            "盗墓贼": "jh 2;n;n;n;n;n;e;e;n;n;n;n;n",
            "黑衣女子": "jh 2;n;n;n;n;n;e;e;n;n;n;n;n;get_silver",
            "白面书生": "jh 2;n;n;n;n;n;e;e;n;n;n;w",
            "护卫": "jh 2;n;n;n;n;n;e;e;n;n;w",
            "富家公子": "jh 2;n;n;n;n;n;e;n",
            "洪帮主": "jh 2;n;n;n;n;n;e;n;op1",
            "鲁长老": "jh 2;n;n;n;n;n;n;e",
            "卖花姑娘": "jh 2;n;n;n;n;n;n;n",
            "刘守财": "jh 2;n;n;n;n;n;n;n;e",
            "守城武将": "jh 2;n;n;n;n;n;n;n;n",
            "疯狗": "jh 2;n;n;n;n;n;n;n;n;n",
            "青竹蛇": "jh 2;n;n;n;n;n;n;n;n;n;e",
            "布衣老翁": "jh 2;n;n;n;n;n;n;n;n;n;e;n",
            "萧问天": "jh 2;n;n;n;n;n;n;n;n;n;e;n;n",
            "藏剑楼首领": "jh 2;n;n;n;n;n;n;n;n;n;e;n;n;n",
            "督察官": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s;s;event_1_54329477;n",
            "神秘黑衣人": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s;s;event_1_54329477;n",
            "李元帅": "jh 2;n;n;n;n;n;n;n;n;w;luoyang14_op1",
            "陈扒皮": "jh 2;n;n;n;n;n;n;w",
            "马倌": "jh 2;n;n;n;n;n;w;n;n;w",
            "守园老人": "jh 2;n;n;n;n;n;w;s",
            "赛牡丹": "jh 2;n;n;n;n;n;w;s;luoyang111_op1",
            "黑衣打手": "jh 2;n;n;n;n;n;w;w",
            "小偷": "jh 2;n;n;n;n;n;w;w;n",
            "玉娘": "jh 2;n;n;n;n;n;w;w;n;n;n;e",
            "张逍林": "jh 2;n;n;n;n;n;w;w;n;w;get_silver",
            "何九叔": "jh 2;n;n;n;n;w",
            "无赖": "jh 2;n;n;n;n;w;event_1_98995501;n",
            "甄大海": "jh 2;n;n;n;n;w;event_1_98995501;n;n;e",
            "红娘": "jh 2;n;n;n;n;w;s",
            "柳小花": "jh 2;n;n;n;n;w;s;w",
            "庙祝": "jh 2;n;n;n;w",
            "老乞丐": "jh 2;n;n;n;w;putuan"
        },
        "长安": {
            "胡商": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "城门卫兵": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "江湖大盗": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;e",
            "李贺": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "云梦璃": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_95312623",
            "游客": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "捕快": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e",
            "捕快统领": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e",
            "苗一郎": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;e",
            "王府总管": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n",
            "王府小厮": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n",
            "董老板": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;e",
            "龟兹乐师": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n",
            "上官小婉": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n;e",
            "龟兹舞女": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n;w",
            "卓小妹": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n;w",
            "护国军卫": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;w",
            "朱老板": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;w",
            "仇老板": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;w",
            "顾先生": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;w",
            "独孤须臾": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "金甲卫士": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "独孤皇后": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "刀僧卫": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w",
            "镇魂使": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s",
            "招魂师": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;w",
            "说书人": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;n;w",
            "客栈老板": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;n;w",
            "高铁匠": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;e",
            "哥舒翰": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;e",
            "樊天纵": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;e",
            "若羌巨商": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;e",
            "乌孙马贩": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n",
            "孙三娘": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;e",
            "白衣少侠": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n",
            "玄甲卫兵": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n",
            "杜如晦": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;e",
            "秦王": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n",
            "翼国公": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n;e",
            "尉迟敬德": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n;e",
            "程知节": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n;w",
            "房玄龄": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;w",
            "马夫": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;n",
            "大宛使者": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;n",
            "卫青": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;w",
            "方秀珣": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;w",
            "杨玄素": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;w",
            "游四海": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w",
            "糖人张": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w",
            "无影卫": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w",
            "紫衣追影": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w",
            "城门禁卫": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w",
            "禁卫统领": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w",
            "蓝色城门卫兵": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n",
            "血手天魔": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n",
            "先锋大将": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n",
            "霍骠姚": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "看门人": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s",
            "钦官": "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s;s"
        },
        "华山村": {
            "米不为": "",
            "泼皮": "jh 3",
            "松鼠": "jh 3;n",
            "野兔": "jh 3;n;e",
            "泼皮头子": "jh 3;s",
            "采花贼": "jh 3;s;e",
            "冯铁匠": "jh 3;s;e;n",
            "村民": "jh 3;s;s",
            "方老板": "jh 3;s;s;e",
            "跛脚汉子": "jh 3;s;s;e;s",
            "云含笑": "jh 3;s;s;e;s;huashancun24_op2",
            "英白罗": "jh 3;s;s;s",
            "刘三": "jh 3;s;s;s;s",
            "血尸": "jh 3;s;s;s;s;huashancun15_op1",
            "藏剑楼杀手": "jh 3;s;s;s;s;huashancun15_op1;event_1_46902878",
            "丐帮弟子": "jh 3;s;s;s;s;huashancun15_op1;event_1_46902878;kill-藏剑楼杀手;@藏剑楼杀手的尸体;jh 3;s;s;s;s;s;nw;n;n;n;w;give huashancun_huashancun_fb9",
            "毒蛇": "jh 3;s;s;s;s;s",
            "丐帮长老": "jh 3;s;s;s;s;s;e",
            "小狼": "jh 3;s;s;s;s;s;nw",
            "老狼": "jh 3;s;s;s;s;s;nw;n",
            "土匪": "jh 3;s;s;s;s;s;nw;n;n",
            "土匪头目": "jh 3;s;s;s;s;s;nw;n;n;e",
            "玉牡丹": "jh 3;s;s;s;s;s;nw;n;n;e;get_silver",
            "刘龟仙": "jh 3;s;s;s;s;s;nw;n;n;n;n",
            "萧独眼": "jh 3;s;s;s;s;s;nw;n;n;n;n;n",
            "刘寨主": "jh 3;s;s;s;s;s;nw;n;n;n;n;n;n",
            "受伤的曲右使": "jh 3;s;s;s;s;w;get_silver",
            "曲姑娘": "jh 3;s;s;s;s;w;n",
            "朱老伯": "jh 3;s;s;w",
            "剑大师": "jh 3;s;s;w;n",
            "方寡妇": "jh 3;s;s;w;n",
            "小男孩": "jh 3;w",
            "村中地痞": "jh 3;w;event_1_59520311",
            "抠脚大汉": "jh 3;w;event_1_59520311;n",
            "黑狗": "jh 3;s;s;s",
            "黑狗": "jh 3;w;event_1_59520311;n;n",
            "青衣守卫": "jh 3;w;event_1_59520311;n;n;n",
            "葛不光": "jh 3;w;event_1_59520311;n;n;n;n;n",
            "米义为": "jh 3;w;event_1_59520311;n;n;w;get_silver",
            "王老二": "jh 3;w;n"
        },
        "华山": {
            "陶钧": "",
            "赵辅徳": "",
            "丛云弃": "",
            "孙驼子": "jh 4",
            "吕子弦": "jh 4;n",
            "女弟子": "jh 4;n;n",
            "游客": "jh 4;n;n;n",
            "公平子": "jh 4;n;n;n;e",
            "白二": "jh 4;n;n;n;n;n;n",
            "山贼": "jh 4;n;n;n;n;n;n",
            "李铁嘴": "jh 4;n;n;n;n;n;n;e",
            "赵辅德": "jh 4;n;n;n;n;n;n;e;n",
            "猿猴": "jh 4;n;n;n;n;n;n;n",
            "剑宗弟子": "jh 4;n;n;n;n;n;n;n;event_1_91604710",
            "蒋天赐": "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s",
            "海昊天": "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s",
            "吴竟陵": "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s;s;e",
            "大松鼠": "jh 4;n;n;n;n;n;n;n;n",
            "英黑罗": "jh 4;n;n;n;n;n;n;n;n;n",
            "魔教喽喽": "jh 4;n;n;n;n;n;n;n;n;n;e",
            "史大哥": "jh 4;n;n;n;n;n;n;n;n;n;e;n",
            "卢大哥": "jh 4;n;n;n;n;n;n;n;n;n;e;n",
            "史老三": "jh 4;n;n;n;n;n;n;n;n;n;e;n;n",
            "闵老二": "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n",
            "藏剑楼刺客": "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;e;s;event_1_11292200",
            "戚老四": "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n",
            "葛长老": "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;e",
            "小林子": "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;n",
            "陈飞鱼": "jh 4;n;n;n;n;n;n;n;n;n;n",
            "许秋雨": "jh 4;n;n;n;n;n;n;n;n;n;n;n",
            "舒奇": "jh 4;n;n;n;n;n;n;n;n;n;n;n;n",
            "梁迎阳": "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e",
            "赵太平": "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;s",
            "小尼姑": "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;s;s",
            "劳朝元": "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "蓝怜云": "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;n;get_silver",
            "小猴": "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;w",
            "施剑客": "jh 4;n;n;n;n;n;n;n;n;n;n;w",
            "华山弟子": "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247",
            "蒙面剑客": "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247;s;s;s;s",
            "黑衣人": "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247;s;s;s;s;s;e",
            "许之瑶": "jh 4;n;n;n;n;n;n;n;n;w;s",
            "六猴儿": "jh 4;n;n;n;n;n;n;n;n;w;w",
            "令狐大师哥": "jh 4;n;n;n;n;n;n;n;n;w;w;n",
            "风老前辈": "jh 4;n;n;n;n;n;n;n;n;w;w;n;get_xiangnang2",
            "豪客": "jh 4;n;n;w"
        },
        "扬州": {
            "船运东主": "",
            "少林恶僧": "",
            "斗笠老人": "",
            "官兵": "jh 5",
            "大黑马": "jh 5;n;n",
            "双儿": "jh 5;n;n;e",
            "黑狗子": "jh 5;n;n;n",
            "武馆护卫": "jh 5;n;n;n;e",
            "武馆弟子": "jh 5;n;n;n;e;n",
            "方不为": "jh 5;n;n;n;e;n;n",
            "范先生": "jh 5;n;n;n;e;n;n;n",
            "古三通": "jh 5;n;n;n;e;n;n;n;e",
            "陈有德": "jh 5;n;n;n;e;n;n;n;n",
            "神秘客": "jh 5;n;n;n;e;n;n;w;n;get_silver",
            "王教头": "jh 5;n;n;n;e;n;w",
            "游客": "jh 5;n;n;n;n",
            "空空儿": "jh 5;n;n;n;n;n",
            "艺人": "jh 5;n;n;n;n;n",
            "朱先生": "jh 5;n;n;n;n;n;e;n;n;n",
            "马夫人": "jh 5;n;n;n;n;n;n",
            "润玉": "jh 5;n;n;n;n;n;n",
            "流氓": "jh 5;n;n;n;n;n;n",
            "醉仙楼伙计": "jh 5;n;n;n;n;n;n;e",
            "丰不为": "jh 5;n;n;n;n;n;n;e;n",
            "张总管": "jh 5;n;n;n;n;n;n;e;n;n",
            "胡神医": "jh 5;n;n;n;n;n;n;e;n;n;e",
            "胖商人": "jh 5;n;n;n;n;n;n;e;n;n;n",
            "冼老板": "jh 5;n;n;n;n;n;n;e;n;n;n;n",
            "计无施": "jh 5;n;n;n;n;n;n;e;n;n;w",
            "马员外": "jh 5;n;n;n;n;n;n;n",
            "茶社伙计": "jh 5;n;n;n;n;n;n;n;e",
            "云九天": "jh 5;n;n;n;n;n;n;n;e",
            "柳文君": "jh 5;n;n;n;n;n;n;n;e;get_silver",
            "毒蛇": "jh 5;n;n;n;n;n;n;n;n",
            "小混混": "jh 5;n;n;n;n;n;n;n;n;n;e",
            "北城门士兵": "jh 5;n;n;n;n;n;n;n;n;n;n",
            "扫地僧": "jh 5;n;n;n;n;n;n;n;n;n;w;w;n",
            "张三": "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;e",
            "火工僧": "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;n;n;e",
            "柳碧荷": "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;w",
            "恶丐": "jh 5;n;n;n;n;n;n;n;n;w",
            "顽童": "jh 5;n;n;n;n;n;n;n;n;w;w",
            "书生": "jh 5;n;n;n;n;n;n;n;n;w;w;n",
            "李丽君": "jh 5;n;n;n;n;n;n;n;n;w;w;n;get_silver",
            "青衣门卫": "jh 5;n;n;n;n;n;n;n;n;w;w;w",
            "玉娇红": "jh 5;n;n;n;n;n;n;n;n;w;w;w;s",
            "青楼小厮": "jh 5;n;n;n;n;n;n;n;n;w;w;w;s;e",
            "苏小婉": "jh 5;n;n;n;n;n;n;n;n;w;w;w;s;e;e;s;s;e;e;s;s;s",
            "赵明诚": "jh 5;n;n;n;n;n;n;n;n;w;w;w;s;w",
            "唐老板": "jh 5;n;n;n;n;n;n;n;w",
            "刘步飞": "jh 5;n;n;n;n;n;n;w",
            "赤练仙子": "jh 5;n;n;n;n;n;w",
            "衙役": "jh 5;n;n;n;n;n;w;w;n",
            "程大人": "jh 5;n;n;n;n;n;w;w;n;n;n",
            "楚雄霸": "jh 5;n;n;n;n;n;w;w;n;n;n;get_silver",
            "公孙岚": "jh 5;n;n;n;n;n;w;w;n;n;w",
            "白老板": "jh 5;n;n;n;n;n;w;w;s;s",
            "小飞贼": "jh 5;n;n;n;n;w",
            "账房先生": "jh 5;n;n;n;n;w",
            "飞贼": "jh 5;n;n;n;n;w;yangzhou16_op1",
            "黄掌柜": "jh 5;n;n;n;w",
            "铁匠": "jh 5;n;n;w",
            "花店伙计": "jh 5;n;w;w;n"
        },
        "丐帮": {
            "裘万家": "jh 6",
            "左全": "jh 6",
            "梁长老": "jh 6;event_1_98623439",
            "藏剑楼统领": "jh 6;event_1_98623439;ne;n",
            "何不净": "jh 6;event_1_98623439;ne;n;ne;ne",
            "马俱为": "jh 6;event_1_98623439;ne;n;ne;ne;ne",
            "余洪兴": "jh 6;event_1_98623439;ne;n;ne;ne;ne;event_1_97428251",
            "莫不收": "jh 6;event_1_98623439;ne;ne",
            "藏剑楼探子": "jh 6;event_1_98623439;ne;ne;ne;event_1_16841370",
            "何宏生": "jh 6;event_1_98623439;s",
            "解九风": "jh 6;event_1_98623439;s;w"
        },
        "乔阴县": {
            "朦胧鬼影": "jh 7;s;s;s;s;event_1_65599392",
            "桃木箱": "jh 7;s;s;s;s;event_1_65599392;n",
            "县城官兵": "jh 7",
            "琵琶鬼": "",
            "孤魂野鬼": "jh 7",
            "藏剑楼学者": "",
            "藏剑楼长老": "",
            "守城官兵": "jh 7",
            "陆得财": "jh 7;s",
            "卖饼大叔": "jh 7;s",
            "卖包子的": "jh 7;s;s;s",
            "怪人": "jh 7;s;s;s;s;event_1_65599392;w",
            "汤掌柜": "jh 7;s;s;s;s;s;s;e",
            "武官": "jh 7;s;s;s;s;s;s;e",
            "家丁": "jh 7;s;s;s;s;s;s;e;n",
            "贵公子": "jh 7;s;s;s;s;s;s;e;n",
            "酒楼守卫": "jh 7;s;s;s;s;s;s;e;n;n",
            "书生": "jh 7;s;s;s;s;s;s;s;s;e",
            "官家小姐": "jh 7;s;s;s;s;s;s;s;s;e;n;e",
            "丫鬟": "jh 7;s;s;s;s;s;s;s;s;e;n;e",
            "骆云舟": "jh 7;s;s;s;s;s;s;s;s;e;n;e;s;e",
            "乾瘪老太婆": "jh 7;s;s;s;s;s;s;s;sw;w",
            "妇人": "jh 7;s;s;s;s;s;s;s;sw;w;n"
        },
        "峨眉山": {
            "先锋军士": "jh 8;ne;e;e;e",
            "耶律霸": "jh 8;ne;e;e;e;e",
            "赤豹死士": "jh 8;ne;e;e;e;n",
            "守城军士": "jh 8;ne;e;e;e;n;n",
            "黑鹰死士": "jh 8;ne;e;e;e;n;n;n",
            "金狼死士": "jh 8;ne;e;e;e;n;n;n;n;n",
            "运输兵": "jh 8;ne;e;e;e;n;n;n;n;n;e",
            "王坚": "jh 8;ne;e;e;e;n;n;n;n;n;e;e;e",
            "参谋官": "jh 8;ne;e;e;e;n;n;n;n;n;e;e;e",
            "军械官": "jh 8;ne;e;e;e;n;n;n;n;n;e;e;n",
            "神箭手": "jh 8;ne;e;e;e;n;n;n;n;n;e;e;s",
            "黑羽刺客": "jh 8;ne;e;e;e;n;n;n;n;n;e;e;s",
            "黑羽敌将": "jh 8;ne;e;e;e;n;n;n;n;n;e;e;s",
            "粮库主薄": "jh 8;ne;e;e;e;n;n;n;n;n;e;n",
            "斥候": "jh 8;ne;e;e;e;n;n;n;n;n;e;s",
            "阿保甲": "jh 8;ne;e;e;e;n;n;n;n;n;e;s",
            "胡族军士": "jh 8;ne;e;e;e;n;n;n;n;n;e;s",
            "传令兵": "jh 8;ne;e;e;e;s",
            "文虚师太": "jh 8;w;nw;n;n;n;n;e;e;n;n;e",
            "看山弟子": "jh 8;w;nw;n;n;n;n;e;e;n;n;e",
            "文玉师太": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n",
            "文寒师太": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n",
            "巡山弟子": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n",
            "小女孩": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w",
            "小贩": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w",
            "静洪师太": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n",
            "静雨师太": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n",
            "贝锦瑟": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;e;e;n;n;e",
            "毒蛇": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;n",
            "护法弟子": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne",
            "护法大弟子": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne",
            "方碧翠": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne;n",
            "灭绝掌门": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne;n",
            "静慈师太": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne;se;e",
            "静玄师太": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;w;w;n;n;w",
            "尼姑": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;w;w;w;w;n",
            "饭堂": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;e;e;n;n;n;e",
            "女孩": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;w;w;w;w;n",
            "小尼姑": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;w;w;w;w;sw",
            "邱锦元": "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;n;e;e",
            "白猿": "jh 8;w;nw;n;n;n;n;w"
            //jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill-看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;nw;nw;n;n;
        },
        "恒山": {
            "山盗": "jh 9",
            "小娟": "jh 9;n",
            "郑婉儿": "jh 9;n;n",
            "敲钟婆婆": "jh 9;n;n;e",
            "云问天": "jh 9;n;n;n",
            "石高达": "jh 9;n;n;n;n",
            "公孙浩": "jh 9;n;n;n;n;e",
            "不可不戒": "jh 9;n;n;n;n;henshan15_op1",
            "山蛇": "jh 9;n;n;n;n;n",
            "嵩山弟子": "jh 9;n;n;n;n;n;event_1_85624865",
            "司马承": "jh 9;n;n;n;n;n;event_1_85624865;n;e",
            "沙江龙": "jh 9;n;n;n;n;n;event_1_85624865;n;n;n;henshan_zizhiyu11_op1",
            "史师兄": "jh 9;n;n;n;n;n;event_1_85624865;n;n;n;n",
            "赵志高": "jh 9;n;n;n;n;n;event_1_85624865;n;w",
            "问心师太": "jh 9;n;n;n;n;n;n;n",
            "心清": "jh 9;n;n;n;n;n;n;n;e;e",
            "心和": "jh 9;n;n;n;n;n;n;n;e;n",
            "吸血蝙蝠": "jh 9;n;n;n;n;n;n;n;n",
            "问过师太": "jh 9;n;n;n;n;n;n;n;n;n",
            "神教杀手": "jh 9;n;n;n;n;n;n;n;n;n;w",
            "魔教杀手": "jh 9;n;n;n;n;n;n;n;n;n;w;n;e;henshan_qinqitai23_op1",
            "魔教长老": "jh 9;n;n;n;n;n;n;n;n;n;w;n;e;n",
            "魔教护卫": "jh 9;n;n;n;n;n;n;n;n;n;w;n;e;n",
            "神秘人": "jh 9;n;n;n;n;n;n;n;n;n;w;n;event_1_89533343",
            "魔教头目": "jh 9;n;n;n;n;n;n;n;n;n;w;n;n;n;n",
            "日月神教头目": "jh 9;n;n;n;n;n;n;n;n;n;w;n;n;n;n",
            "小师太": "jh 9;n;n;n;n;n;n;n;w;n",
            "柳云烟": "jh 9;n;n;n;w",
            "戒嗔大师": "jh 9;n;w"
        },
        "武当山": {
            "土匪": "jh 10",
            "布衣弟子": "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n",
            "剑童": "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;n;n",
            "剑遇安": "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;n;n;n",
            "剑遇治": "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;ne;n;n",
            "剑遇山": "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;ne;n;n;e",
            "剑遇行": "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;ne;s;e",
            "剑遇鸣": "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;ne;s;sw",
            "剑遇南": "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;nw;nw",
            "剑遇穆": "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;nw;nw;n",
            "野兔": "jh 10;w;n;n;w",
            "进香客": "jh 10;w;n;n;w;w",
            "邱锦元": "jh 10;w;n;n;w;w",
            "知客道长": "jh 10;w;n;n;w;w;w;n;n;n",
            "道童": "jh 10;w;n;n;w;w;w;n;n;n;n",
            "蜜蜂": "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;n",
            "小蜜蜂": "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;n",
            "猴子": "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;s",
            "清虚道长": "jh 10;w;n;n;w;w;w;n;n;n;n;n",
            "邱元清": "jh 10;w;n;n;w;w;w;n;n;n;n;n",
            "张松溪": "jh 10;w;n;n;w;w;w;n;n;n;n;n;e",
            "俞二侠": "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;e;e",
            "小翠": "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;s",
            "俞莲舟": "jh 10;w;n;n;w;w;w;n;n;n;n;n;n",
            "张三丰": "jh 10;w;n;n;w;w;w;n;n;n;n;n;n;n;n;n"
        },
        "晚月庄": {
            "晚月庄": "jh 11",
            "蝴蝶": "jh 11;e;e;s",
            "小贩": "jh 11;e;e;s;n;nw;w;nw;e",
            "酒肉和尚": "jh 11;e;e;s;n;nw;w;nw;e;e;e;n;w",
            "陈子昂": "jh 11;e;e;s;n;nw;w;nw;e;e;e;se",
            "彩衣少女": "jh 11;e;e;s;sw",
            "金丝雀": "jh 11;e;e;s;sw;se;s;s;s;e;se;s;sw",
            "美珊": "jh 11;e;e;s;sw;se;s;s;s;e;se;s;sw",
            "小白兔": "jh 11;e;e;s;sw;se;s;s;s;e;se;s;sw;s;n;nw;w;nw;w;e;se",
            "颜慧如": "jh 11;e;e;s;sw;se;s;s;s;e;se;s;sw;s;n;nw;w;nw;w;e;se",
            "小金鼠": "jh 11;e;e;s;sw;se;s;s;s;e;se;s;sw;s;n;nw;w;nw;w;e;se;e;n;n;n;w;s;s;w",
            "上官钰翎": "jh 11;e;e;s;sw;se;s;s;s;e;se;s;sw;s;n;nw;w;nw;w;e;se;e;n;n;n;w;s;s;w",
            "袭人": "jh 11;e;e;s;sw;se;s;s;s;e;se;s;sw;s;n;nw;w;nw;w;e;se;e;n",
            "蓝小蝶": "jh 11;e;e;s;sw;se;s;s;s;e;se;s;sw;s;n;nw;w;nw;w;e;se;e;n;n;n;w;s;s;w;e;n",
            "曲馥琪": "jh 11;e;e;s;sw;se;s;s;s;e;se;s;sw;s;n;nw;w;nw;w;e;se;e;n;n;n;w;s;s;w;e;n;n;e;n;n;n;w;n;s;w;n;w;e;s;w;w;e;s;n;e;s;w;e;s;e;e;e",
            "梦玉楼": "jh 11;e;e;s;sw;se;s;s;s;e;se;s;sw;s;n;nw;w;nw;w;e;se;e;n;n;n;w;s;s;w;e;n;n;e;n;n;n;w;n;s;w;n;w;e;s;w;w;e;s;n;e;s;w;e;s;e;e;e;w;w;w;w;w;n;s;s",
            "芙云": "jh 11;e;e;s;sw;se;s;s;s;e;se;s;sw;s;n;nw;w;nw;w;e;se;e;n;n;n;w;s;s;w;e;n;n;e;n;n;n;w;n;s;w;n;w;e;s;w;w;e;s;n;e;s;w;e;s;e;e;e;w;w;w;w;w;n;s;s;n;e;s",
            "惜春": "jh 11;e;e;s;sw;se;s;s;s;e;se;s;sw;s;n;nw;w;nw;w;e;se;e;n;n;n;w;s;s;w;e;n;n;e;n;n;n;w;n;s;w;n;w;e;s;w;w;e;s;n;e;s;w;e;s;e;e;e;w;w;w;w;w;n;s;s;n;e;s;n;e;s;e;s;s;e;w;w;s;e;e;w;w;n;e;n;n;w;w;w;e;n;n;w;e;n;n;w",
            "婢女": "jh 11;e;e;s;sw;se;w",
            "蓝止萍": "jh 11;e;e;s;sw;se;w",
            "蓝雨梅": "jh 11;e;e;s;sw;se;w;n",
            "芳绫": "jh 11;e;e;s;sw;se;w;w;n;w",
            "昭蓉": "jh 11;e;e;s;sw;se;w;w;s;s;w",
            "昭仪": "jh 11;e;e;s;sw;se;w;w;w;w",
            "苗郁手": "jh 11;e;e;s;sw;se;w;w;s;s;s",
            "圆春": "jh 11;e;e;s;sw;se;w;w;s;s;s",
            "瑷伦": "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;e",
            "虞琼衣": "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w",
            "龙韶吟": "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s",
            "阮欣郁": "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s;e",
            "金仪彤": "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s;e;e",
            "凤凰": "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s;e;e"
        },
        "水烟阁": {
            "天邪虎": "jh 12;n;n;n",
            "水烟阁武士": "jh 12;n;n;n",
            "董老头": "jh 12;n;n;n;e;n;n",
            "潘军禅": "jh 12;n;n;n;n",
            "萧辟尘": "jh 12;n;n;n;n",
            "水烟阁红衣武士": "jh 12;n;n;n;w;n;nw",
            "水烟阁司事": "jh 12;n;n;n;w;n;nw;e",
            "於兰天武": "jh 12;n;n;n;w;n;nw;e;n",
            "天邪水烟阁": "jh 12"
        },
        "少林寺": {
            "澄知": "",
            "虚通": "jh 13",
            "虚明": "jh 13;n",
            "山猪": "jh 13",
            "渡云": "jh 13;e;s;s;w;w;w",
            "渡雨": "jh 13;e;s;s;w;w;w",
            "渡风": "jh 13;e;s;s;w;w;w",
            "僧人": "jh 13;n",
            "慧色尊者": "jh 13;n;n",
            "慧空尊者": "jh 13;n;n;n;n",
            "慧名尊者": "jh 13;n;n;n;n",
            "慧真尊者": "jh 13;n;n;n;n;n;n;n;n;n;n;n",
            "慧虚尊者": "jh 13;n;n;n;n;n;n;n;n;n;n;n",
            "慧修尊者": "jh 13;n;n;n;n;n;n;n;n;n;n;n;n",
            "慧合尊者": "jh 13;n;n;n;n;n;n;n;n;w",
            "慧洁尊者": "jh 13;n;n;n;n;n;n;n;n;w",
            "扫地和尚": "jh 13;n;n",
            "慧如尊者": "jh 13;n;n",
            "洒水僧": "jh 13;n;n;e",
            "小北": "jh 13;n;n;n",
            "玄痛大师": "jh 13;n;n;n",
            "进香客": "jh 13;n;n;n;n",
            "扫地僧": "jh 13;n;n;n;n;e",
            "行者": "jh 13;n;n;n;n;e",
            "道象禅师": "jh 13;n;n;n;n;n",
            "小南": "jh 13;n;n;n;n;n",
            "巡寺僧人": "jh 13;n;n;n;n;n;n",
            "托钵僧": "jh 13;n;n;n;n;n;n",
            "打坐僧人": "jh 13;n;n;n;n;n;n;e",
            "清晓比丘": "jh 13;n;n;n;n;n;n;n",
            "黑衣大汉": "jh 13;n;n;n;n;n;n;n",
            "清缘比丘": "jh 13;n;n;n;n;n;n;n",
            "清为比丘": "jh 13;n;n;n;n;n;n;n;n",
            "清无比丘": "jh 13;n;n;n;n;n;n;n;n",
            "小沙弥": "jh 13;n;n;n;n;n;n;n;n",
            "清闻比丘": "jh 13;n;n;n;n;n;n;n;n",
            "玄悲大师": "jh 13;n;n;n;n;n;n;n;n;e",
            "玄慈大师": "jh 13;n;n;n;n;n;n;n;n;n",
            "清乐比丘": "jh 13;n;n;n;n;n;n;n;n;n",
            "清善比丘": "jh 13;n;n;n;n;n;n;n;n;n",
            "清法比丘": "jh 13;n;n;n;n;n;n;n;n;n;n",
            "清观比丘": "jh 13;n;n;n;n;n;n;n;n;n;n",
            "立雪亭": "jh 13;n;n;n;n;n;n;n;n;n;n",
            "白眉老僧": "jh 13;n;n;n;n;n;n;n;n;n;n",
            "青松": "jh 13;n;n;n;n;n;n;n;n;n;n;n",
            "冷幽兰": "jh 13;n;n;n;n;n;n;n;n;n;n;n;e",
            "慧轮": "jh 13;n;n;n;n;n;n;n;n;n;n;n;n",
            "守药僧": "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;e",
            "砍柴僧": "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;w",
            "道相禅师": "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;w",
            "达摩老祖": "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;w;n;get_silver",
            "道一禅师": "jh 13;n;n;n;n;n;n;n;n;n;n;n;w",
            "玄难大师": "jh 13;n;n;n;n;n;n;n;n;n;n;n;w",
            "道正禅师": "jh 13;n;n;n;n;n;n;n;n;n;n;n;w",
            "叶十二娘": "jh 13;n;n;n;n;n;n;n;n;n;shaolin25_op1",
            "玄苦大师": "jh 13;n;n;n;n;n;n;n;n;w",
            "灰衣僧": "jh 13;n;n;n;n;n;n;n;shaolin27_op1",
            "萧远山": "jh 13;n;n;n;n;n;n;n;shaolin27_op1",
            "守经僧人": "jh 13;n;n;n;n;n;n;n;shaolin27_op1;event_1_34680156",
            "盈盈": "jh 13;n;n;n;n;n;n;w",
            "道尘禅师": "jh 13;n;n;n;n;w",
            "狱卒": "jh 13;n;n;n;n;w",
            "道成禅师": "jh 13;n;n;w",
            "挑水僧": "jh 13;n;n;w",
            "道品禅师": "jh 13;n;w",
            "田鼠": "jh 13;n;w",
            "道觉禅师": "jh 13;n;w;w",
            "小孩": "jh 13;n;w;w",

            "澄观": "jh 13;n;n;n;n;n;n;n;n;n;n;e",
            "澄知": "jh 13;n;n;n;n;n;n;n;n;n;n;e;s",
            "澄明": "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s",
            "澄净": "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s",
            "澄坚": "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s;s",
            "澄寂": "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s;s;s",
            "澄灭": "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s;s;s;s",
            "澄和": "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s;s;s;s;s",
            "澄心": "jh 13;n;n;n;n;n;n;n;n;n;n;w",
            "澄意": "jh 13;n;n;n;n;n;n;n;n;n;n;w;s",
            "澄思": "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s",
            "澄识": "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s",
            "澄志": "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s",
            "澄信": "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s",
            "澄灵": "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s;s",
            "澄欲": "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s;s;s",
            "澄尚": "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s;s;s;s"
        },
        "唐门": {
            "高一毅": "jh 14;e",
            "张之岳": "jh 14;e;event_1_10831808;n",
            "程倾城": "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e",
            "无名剑客": "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e",
            "默剑客": "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e",
            "竺霁庵": "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n",
            "甄不恶": "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne",
            "素厉铭": "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e",
            "骆祺樱": "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se",
            "谢麟玄": "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se",
            "祝公博": "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se;e",
            "黄衫少女": "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se;e;ne",
            "鹿熙吟": "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se;e;ne;n",
            "唐门弟子": "jh 14;w;n",
            "唐风": "jh 14;w;n;n",
            "唐看": "jh 14;w;n;n;n",
            "唐门弟子": "jh 14;w;n;n;n;e;e;n",
            "唐健": "jh 14;w;n;n;n;e;e;n",
            "(黄色)唐门弟子": "jh 14;w;n;n;n;e;e;n",
            "唐舌": "jh 14;w;n;n;n;e;e;n;e",
            "唐情": "jh 14;w;n;n;n;e;e;n;n",
            "唐刚": "jh 14;w;n;n;n;e;e;n;n",
            "欧阳敏": "jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n",
            "方媃": "jh 14;w;n;n;n;n",
            "唐怒": "jh 14;w;n;n;n;n",
            "唐鹤": "jh 14;w;n;n;n;w;s",
            "唐镖": "jh 14;w;n;n;n;w;w;s",
            "唐芳": "jh 14;w;n;n;n;w;w;w;n",
            "唐缘": "jh 14;w;n;n;n;w;w;w;s"
        },
        "青城山": {
            "海公公": "jh 15",
            "游方郎中": "jh 15;n",
            "孽龙之灵": "jh 15;n;nw;w;nw;n;event_1_14401179",
            "孽龙分身": "jh 15;n;nw;w;nw;n;event_1_14401179",
            "暗甲盟主": "jh 15;n;nw;w;nw;n;event_1_14401179;event_1_80293122;n;n",
            "暗甲将领": "jh 15;n;nw;w;nw;n;event_1_14401179;event_1_80293122;n;n",
            "青城弟子": "jh 15;n;nw;w;nw;w;s;s",
            "候老大": "jh 15;n;nw;w;nw;w;s;s",
            "青城派弟子": "jh 15;n;nw;w;nw;w;s;s",
            "罗老四": "jh 15;n;nw;w;nw;w;s;s;s",
            "吉人英": "jh 15;n;nw;w;nw;w;s;s;s;kill-罗老四;w;w",
            "贾老二": "jh 15;n;nw;w;nw;w;s;s;s;kill-罗老四;w;w;n",
            "小室": "jh 15;n;nw;w;nw;w;s;s;s;kill-罗老四;w;w;n",
            "余大掌门": "jh 15;n;nw;w;nw;w;s;s;s;kill-罗老四;w;w;w",
            "黄袍老道": "jh 15;n;nw;w;nw;w;s;s;s;kill-罗老四;w;w;w;n",
            "青袍老道": "jh 15;n;nw;w;nw;w;s;s;s;kill-罗老四;w;w;w;n",
            "于老三": "jh 15;n;nw;w;nw;w;s;s;s;kill-罗老四;w;w;w;n;w",
            "仵作": "jh 15;s;ne",
            "恶少": "jh 15;s;s",
            "仆人": "jh 15;s;s",
            "屠夫": "jh 15;s;s;e",
            "小甜": "jh 15;s;s;s;e",
            "读千里": "jh 15;s;s;s;s;e",
            "福州府尹": "jh 15;s;s;s;s;s;e",
            "背剑老人": "jh 15;s;s;s;s;s;s;s;s;s;e;s",
            "木道神": "jh 15;s;s;s;s;s;s;w",
            "兵器贩子": "jh 15;s;s;s;s;w",
            "阿美": "jh 15;s;s;s;w;w;n",
            "红衣镖师": "jh 15;s;s;s;w;w;s;s",
            "黄衣镖师": "jh 15;s;s;s;w;w;s;s",
            "镖局弟子": "jh 15;s;s;s;w;w;s;s",
            "林师弟": "jh 15;s;s;s;w;w;w;w;w;n",
            "店小二": "jh 15;s;s;w",
            "酒店老板": "jh 15;s;s;w",
            "女侍": "jh 15;s;s;w;n",
            "酒店女老板": "jh 15;s;s;w;n"
        },
        "逍遥林": {
            "石室": "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;w;w",
            "吴统领": "jh 16;s;s;s;s;e;e;s;w",
            "蒙面人": "jh 16;s;s;s;s;e;e;s;w",
            "范棋痴": "jh 16;s;s;s;s;e;e;s;w;n",
            "冯巧匠": "jh 16;s;s;s;s;e;e;s;w;s;s",
            "莫辩聪": "jh 16;s;s;s;s;e;e;s;w;w",
            "石师妹": "jh 16;s;s;s;s;e;e;s;w;w;n",
            "阎王敌": "jh 16;s;s;s;s;e;e;s;w;w;n;n",
            "康琴癫": "jh 16;s;s;s;s;e;e;s;w;w;s;s",
            "苟书痴": "jh 16;s;s;s;s;e;e;s;w;w;w",
            "李唱戏": "jh 16;s;s;s;s;e;e;s;w;w;w;w;s",
            "天山姥姥": "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637",
            "常一恶": "jh 16;s;s;s;s;e;n;e;event_1_56806815"
        },
        "开封": {
            "骆驼": "jh 17",
            "官兵": "jh 17;e",
            "七煞堂弟子": "jh 17;e;s",
            "七煞堂打手": "jh 17;e;s;s",
            "七煞堂护卫": "jh 17;e;s;s;s;s",
            "七煞堂堂主": "jh 17;e;s;s;s;s;s",
            "毒蛇": "jh 17;event_1_97081006",
            "野猪": "jh 17;event_1_97081006;s",
            "黑鬃野猪": "jh 17;event_1_97081006;s;s;s;s",
            "野猪王": "jh 17;event_1_97081006;s;s;s;s;s",
            "白面人": "jh 17;event_1_97081006;s;s;s;s;s;w;kaifeng_yezhulin05_op1",
            "鹤发老人": "jh 17;event_1_97081006;s;s;s;s;s;w;w",
            "鹿杖老人": "jh 17;event_1_97081006;s;s;s;s;s;w;w",
            "灯笼小贩": "jh 17;n",
            "小男孩": "jh 17;n",
            "欧阳春": "jh 17;n;e",
            "展昭": "jh 17;n;e",
            "包拯": "jh 17;n;e;s",
            "皮货商": "jh 17;n;n",
            "武官": "jh 17;n;n;e",
            "菜贩子": "jh 17;n;n;e;e",
            "玄衣少年": "jh 17;n;n;e;e",
            "码头工人": "jh 17;n;n;e;e;n",
            "落魄书生": "jh 17;n;n;e;e;n;get_silver",
            "船老大": "jh 17;n;n;e;e;n;n",
            "王老板": "jh 17;n;n;e;e;s",
            "高衙内": "jh 17;n;n;e;s",
            "护寺僧人": "jh 17;n;n;e;s;s",
            "烧香老太": "jh 17;n;n;e;s;s;s",
            "泼皮": "jh 17;n;n;e;s;s;s;e",
            "老僧人": "jh 17;n;n;e;s;s;s;e;e",
            "烧火僧人": "jh 17;n;n;e;s;s;s;e;s",
            "张龙": "jh 17;n;n;e;s;s;s;s",
            "孔大官人": "jh 17;n;n;e;s;s;s;s;w",
            "素斋师傅": "jh 17;n;n;e;s;s;s;w",
            "李四": "jh 17;n;n;n",
            "陈举人": "jh 17;n;n;n;e",
            "流浪汉": "jh 17;n;n;n;n",
            "富家弟子": "jh 17;n;n;n;n;e",
            "赵虎": "jh 17;n;n;n;n;n",
            "踏青妇人": "jh 17;n;n;n;n;n;e",
            "平夫人": "jh 17;n;n;n;n;n;e;n;n",
            "恶狗": "jh 17;n;n;n;n;n;e;n;n;n",
            "平怪医": "jh 17;n;n;n;n;n;e;n;n;n;event_1_27702191",
            "杨排风": "jh 17;n;n;n;n;w",
            "天波侍卫": "jh 17;n;n;n;n;w",
            "柴郡主": "jh 17;n;n;n;n;w;w;w",
            "穆桂英": "jh 17;n;n;n;n;w;w;w;n;n",
            "杨文姬": "jh 17;n;n;n;n;w;w;w;n;n;w",
            "侍女": "jh 17;n;n;n;n;w;w;w;s",
            "佘太君": "jh 17;n;n;n;n;w;w;w;s;s;w",
            "杨延昭": "jh 17;n;n;n;n;w;w;w;w",
            "新郎官": "jh 17;n;n;w",
            "混混张三": "jh 17;n;n;w;n",
            "铁翼": "jh 17;n;n;w;n;n",
            "刘财主": "jh 17;n;n;w;n;n",
            "赵大夫": "jh 17;n;w",
            "新娘": "jh 17;sw;nw",
            "耶律夷烈": "jh 17;sw;s;sw;nw;ne;event_1_38940168"
        },
        "光明顶": {
            "村民": "jh 18",
            "沧桑老人": "jh 18;e",
            "明教小圣使": "jh 18;n;nw;n;n;n;n;n",
            "闻旗使": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n",
            "韦蝠王": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n",
            "彭散玉": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n",
            "唐旗使": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e",
            "周散仙": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;n",
            "庄旗使": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;n;n",
            "冷步水": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n",
            "张散仙": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;e",
            "冷文臻": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n",
            "殷鹰王": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n",
            "明教教众": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n",
            "谢狮王": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;e",
            "张教主": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n",
            "范右使": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n;n",
            "小昭": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n;n;n",
            "黛龙王": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w",
            "明教食堂": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w",
            "九幽毒魔": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287",
            "青衣女孩": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287;event_1_39374335;kill mingjiao_jiuyoudutong;event_1_2077333",
            "九幽毒童": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287;event_1_39374335",
            "明教小喽啰": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w",
            "辛旗使": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w;w",
            "布袋大师": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w;w;n",
            "颜旗使": "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w;w;n;n",
            "村妇": "jh 18;w",
            "小男孩": "jh 18;w;n",
            "老太婆": "jh 18;w;n"
        },
        "全真教": {
            "终南山游客": "jh 19;s;s;s;sw;s",
            "男童": "jh 19;s;s;s;sw;s;e;n;nw",
            "全真女弟子": "jh 19;s;s;s;sw;s;e;n;nw;n",
            "迎客道长": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n",
            "程遥伽": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n",
            "尹志平": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n",
            "练功弟子": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n",
            "孙不二": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;e;e;e",
            "柴火道士": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;e;e;n;n",
            "马钰": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n",
            "丘处机": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n",
            "老道长": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;e",
            "王处一": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n",
            "鹿道清": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;e",
            "青年弟子": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n",
            "谭处端": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;e",
            "刘处玄": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;e;e",
            "掌厨道士": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;e;e;e",
            "小麻雀": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;e;e;e;n",
            "老人": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "挑水道士": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e",
            "蜜蜂": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;n",
            "观想兽": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;w",
            "赵师兄": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;w;n",
            "老顽童": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;w;w;n",
            "(藏经殿)小道童": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;w",
            "王重阳": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;w;w;s",
            "小道童": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;w;w;w;s",
            "郝大通": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;w;w;w;w;n;n;n",
            "健马": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;w;w;w;s",
            "李四": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;w;w;w;s",
            "(事为室)小道童": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;w"
        },
        "古墓": {
            "天蛾": "jh 20;w;w;s;e;s;s;s",
            "食虫虻": "jh 20;w;w;s;e;s;s;s;s;s;sw",
            "玉蜂": "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s",
            "玉蜂": "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;e",
            "龙儿": "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;e;e",
            "林祖师": "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;e;e;event_1_3723773;se;n;e;s;e;s;e",
            "孙婆婆": "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;s;s;s;e;e;e;e;s;e"
        },
        "白驼山": {
            "白驼山": "jh 21",
            "玉门守将": "jh 21;n;n;n;n;e",
            "匈奴杀手": "jh 21;n;n;n;n;e;n;n;n",
            "玉门守军": "jh 21;n;n;n;n;e;e",
            "玄甲骑兵": "jh 21;n;n;n;n;e;e;e",
            "车夫": "jh 21;n;n;n;n;e;e;e;e",
            "天策大将": "jh 21;n;n;n;n;e;e;e;e;e",
            "玄甲参将": "jh 21;n;n;n;n;e;e;e;e;e",
            "凤七": "jh 21;n;n;n;n;e;e;e;e;e;s;s;w",
            "慕容孤烟": "jh 21;n;n;n;n;e;e;e;e;e;e;e;s",
            "醉酒男子": "jh 21;n;n;n;n;e;e;e;e;e;e;e;s",
            "马匪": "jh 21;n;n;n;n;e;e;e;e;e;e;e;e;e",
            "花花公子": "jh 21;nw",
            "寡妇": "jh 21;nw;ne;ne",
            "小山贼": "jh 21;nw;ne;n;n",
            "山贼": "jh 21;nw;ne;n;n;ne;n",
            "侍杖": "jh 21;nw;ne;n;n;ne;w",
            "雷横天": "jh 21;nw;ne;n;n;ne;n;n",
            "金花": "jh 21;nw;ne;n;n;ne;n;n;w",
            "铁匠": "jh 21;nw;s",
            "农民": "jh 21;nw;w",
            "舞蛇人": "jh 21;nw;w",
            "店小二": "jh 21;nw;w;n",
            "村姑": "jh 21;nw;w;w",
            "小孩": "jh 21;nw;w;w;nw",
            "农家妇女": "jh 21;nw;w;w;nw;e",
            "樵夫": "jh 21;nw;w;w;nw;nw;nw",
            "门卫": "jh 21;nw;w;w;nw;n;n",
            "仕卫": "jh 21;nw;w;w;nw;n;n;n;w",
            "丫环": "jh 21;nw;w;w;nw;n;n;n;n",
            "欧阳少主": "jh 21;nw;w;w;nw;n;n;n;n",
            "李教头": "jh 21;nw;w;w;nw;n;n;n;n;n",
            "小青": "jh 21;nw;w;w;nw;n;n;n;n;n;w;s",
            "黑冠巨蟒": "jh 21;nw;w;w;nw;n;n;n;n;n;w;w;w;n",
            "蟒蛇": "jh 21;nw;w;w;nw;n;n;n;n;n;w;w;w;n;n;n",
            "教练": "jh 21;nw;w;w;nw;n;n;n;n;n;e",
            "陪练童子": "jh 21;nw;w;w;nw;n;n;n;n;n;e;ne",
            "管家": "jh 21;nw;w;w;nw;n;n;n;n;n;n",
            "白衣少女": "jh 21;nw;w;w;nw;n;n;n;n;n;n;n",
            "老毒物": "jh 21;nw;w;w;nw;n;n;n;n;n;n;n",
            "肥肥": "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;e",
            "老材": "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;e;e",
            "张妈": "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;nw",
            "白兔": "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne",
            "狐狸": "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;w",
            "老虎": "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;w",
            "野狼": "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;w",
            "雄狮": "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;w",
            "竹叶青蛇": "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;e",
            "金环蛇": "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;e"
        },
        "嵩山": {
            "嵩山": "jh 22",
            "脚夫": "jh 22",
            "秋半仙": "jh 22;n",
            "风骚少妇": "jh 22;n",
            "锦袍老人": "jh 22;n;n",
            "游客": "jh 22;n;n;w",
            "野狼": "jh 22;n;n;w;n",
            "山贼": "jh 22;n;n;w;n;n;n",
            "林立德": "jh 22;n;n;w;n;n",
            "修行道士": "jh 22;n;n;w;n;n;n;n",
            "黄色毒蛇": "jh 22;n;n;w;n;n;n;n;event_1_88705407",
            "麻衣刀客": "jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s",
            "白板煞星": "jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s;s;s",
            "小猴": "jh 22;n;n;w;n;n;n;n;n",
            "万大平": "jh 22;n;n;w;n;n;n;n;n;e",
            "芙儿": "jh 22;n;n;w;n;n;n;n;n;e;e",
            "嵩山弟子": "jh 22;n;n;w;n;n;n;n;n;e;n",
            "麻衣汉子": "jh 22;n;n;w;n;n;n;n;n;e;n;n;w;n",
            "史师兄": "jh 22;n;n;w;n;n;n;n;n;e;n;n;n",
            "白头仙翁": "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n",
            "左挺": "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n",
            "钟九曲": "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;e",
            "乐老狗": "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;w",
            "伙夫": "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;w;n;w",
            "沙秃翁": "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;w;w",
            "陆太保": "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n",
            "邓神鞭": "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n;n",
            "聂红衣": "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n;n;e",
            "高锦毛": "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n;e",
            "左盟主": "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n;n;n",
            "吸血蝙蝠": "jh 22;n;n;w;w;s",
            "瞎眼剑客": "jh 22;n;n;w;w;s;s",
            "瞎眼刀客": "jh 22;n;n;w;w;s;s;s;s;w",
            "瞎眼老者": "jh 22;n;n;w;w;s;s;s;s;s",
            "柳易之": "jh 22;n;n;n;n",
            "卢鸿一": "jh 22;n;n;n;n;e",
            "英元鹤": "jh 22;n;n;n;n;e;n"
        },
        "梅庄": {
            "柳府家丁": "jh 23",
            "老者": "jh 23;n;n",
            "柳玥": "jh 23;n;n",
            "筱西风": "jh 23;n;n;e",
            "梅庄护院": "jh 23;n;n;n",
            "梅庄家丁": "jh 23;n;n;n;n;n",
            "施令威": "jh 23;n;n;n;n;n;n",
            "丁管家": "jh 23;n;n;n;n;n;n;n",
            "黑老二": "jh 23;n;n;n;n;n;n;n;e;s",
            "瘦小汉子": "jh 23;n;n;n;n;n;n;n;n",
            "丹老四": "jh 23;n;n;n;n;n;n;n;n;e;n",
            "上官香云": "jh 23;n;n;n;n;n;n;n;n;n;n",
            "秃笔客": "jh 23;n;n;n;n;n;n;n;n;n;n;e",
            "黑衣刀客": "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n",
            "青衣剑客": "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n",
            "黄衫婆婆": "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n;n;e;n",
            "红衣僧人": "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n;n;n",
            "紫袍老者": "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n;w",
            "琴童": "jh 23;n;n;n;n;n;n;n;n;n;n;w",
            "黄老朽": "jh 23;n;n;n;n;n;n;n;n;n;n;w;n",
            "地牢看守": "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;kill-黄老朽;get-黄老朽的尸体;s;e;s;s;s;w;w;give meizhuang_meizhuang3",
            "地鼠": "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;kill-黄老朽;get-黄老朽的尸体;s;e;s;s;s;w;w;give meizhuang_meizhuang3;n;n",
            "柳蓉": "jh 23;n;n;n;n;n;n;n;n;w",
            "丁二": "jh 23;n;n;n;n;n;n;n;n;w;n",
            "聋哑老人": "jh 23;n;n;n;n;n;n;n;n;w;w",
            "向左使": "jh 23;n;n;n;n;n;n;n;w;w"
        },
        "泰山": {
            "泰山": "jh 24",
            "挑夫": "jh 24",
            "黄衣刀客": "jh 24;n",
            "瘦僧人": "jh 24;n;n",
            "柳安庭": "jh 24;n;n;n",
            "石云天": "jh 24;n;n;n;n",
            "程不为": "jh 24;n;n;n;n;w",
            "朱莹莹": "jh 24;n;n;n;n;e",
            "温青青": "jh 24;n;n;n;n;e;e",
            "易安居士": "jh 24;n;n;n;n;e;e",
            "欧阳留云": "jh 24;n;n;n;n;e;s",
            "吕进": "jh 24;n;n;n;n;n",
            "司马玄": "jh 24;n;n;n;n;n;n",
            "桑不羁": "jh 24;n;n;n;n;n;n;e",
            "鲁刚": "jh 24;n;n;n;n;n;n;w",
            "于霸天": "jh 24;n;n;n;n;n;n;n",
            "神秘游客": "jh 24;n;n;n;n;n;n;n;e",
            "海棠杀手": "jh 24;n;n;n;n;n;n;n;n;w",
            "路独雪": "jh 24;n;n;n;n;n;n;n;n;w;n;n",
            "铁云": "jh 24;n;n;n;n;n;n;n;n;w;n;n;n",
            "孔翎": "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;n;n",
            "姬梓烟": "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w",
            "朱樱林": "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n",
            "柳兰儿": "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n",
            "布衣男子": "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870",
            "阮小": "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n",
            "史义": "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;e",
            "阮大": "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;w",
            "司马墉": "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;n;n;w",
            "林忠达": "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;n;n;n",
            "铁面人": "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;n;n;n;n",
            "李三": "jh 24;n;n;n;n;n;n;n;n;n",
            "仇霸": "jh 24;n;n;n;n;n;n;n;n;n;e",
            "平光杰": "jh 24;n;n;n;n;n;n;n;n;n;n",
            "玉师弟": "jh 24;n;n;n;n;n;n;n;n;n;n;w",
            "玉师兄": "jh 24;n;n;n;n;n;n;n;n;n;n;n",
            "玉师伯": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n",
            "任娘子": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e",
            "黄老板": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;s",
            "红衣卫士": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e",
            "西门允儿": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;w",
            "白飞羽": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;e",
            "商鹤鸣": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;e",
            "钟逍林": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;n;n",
            "西门宇": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;n;n;n",
            "黑衣密探": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;w",
            "毒蛇": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;w;n",
            "筱墨客": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;w;n;n;w",
            "迟一城": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "泰山弟子": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "建除": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e",
            "天柏": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "天松": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "玉师叔": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w",
            "泰山掌门": "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n"
        },
        "铁血大旗门": {
            "铁血大旗门": "jh 25",
            "宾奴": "jh 25;w",
            "渔夫": "jh 25;e;e;e",
            "叶缘": "jh 25;e;e;e;e;s",
            "老婆子": "jh 25;e;e;e;e;s;yell-常春岛渡口",
            "潘兴鑫": "jh 25;e;e;e;e;s;yell-常春岛渡口;s",
            "罗少羽": "jh 25;e;e;e;e;s;yell-常春岛渡口;e",
            "青衣少女": "jh 25;e;e;e;e;s;yell-常春岛渡口;e;ne",
            "日岛主": "jh 25;e;e;e;e;s;yell-常春岛渡口;e;ne;se;e;e;e;e",
            "铁掌门": "jh 25;e;e;e;e;s;yell-常春岛渡口;s;e;event_1_81629028",
            "夜皇": "jh 25;e;e;e;e;s;yell-常春岛渡口;s;e;event_1_81629028;s;e;n;w;w",
            "红衣少女": "jh 25;e;e;e;e;s;yell-常春岛渡口;s;e;event_1_81629028;s;e;n;w;w;s;w",
            "紫衣少女": "jh 25;e;e;e;e;s;yell-常春岛渡口;s;e;event_1_81629028;s;e;n;w;w;s;w",
            "蓝衣少女": "jh 25;e;e;e;e;s;yell-常春岛渡口;s;e;event_1_81629028;s;e;n;w;w;s;w",
            "橙衣少女": "jh 25;e;e;e;e;s;yell-常春岛渡口;s;e;event_1_81629028;s;e;n;w;w;s;w",
            "小贩": "jh 11;e;e;s;n;nw;w;nw;e",
            "酒肉和尚": "jh 11;e;e;s;n;nw;w;nw;e;e;e;n;w",
            "陈子昂": "jh 11;e;e;s;n;nw;w;nw;e;e;e;se"
        },
        "大昭寺": {
            "李将军": "jh 26;w;w;n",
            "突厥先锋大将": "jh 26;w;w;n;n",
            "神秘甲士": "jh 26;w;w;n;w",
            "牧羊女": "jh 26",
            "草原狼": "jh 26;w",
            "小绵羊": "jh 26;w",
            "牧羊女": "jh 26;w;w",
            "大绵羊": "jh 26;w;w",
            "白衣少年": "jh 26;w;w;w",
            "小羊羔": "jh 26;w;w;w",
            "城卫": "jh 26;w;w;w;w;w",
            "紫衣妖僧": "jh 26;w;w;w;w;w;n",
            "塔僧": "jh 26;w;w;w;w;w;n",
            "关外旅客": "jh 26;w;w;w;w;w;w",
            "护寺喇嘛": "jh 26;w;w;w;w;w;w",
            "护寺藏尼": "jh 26;w;w;w;w;w;w;n",
            "卜一刀": "jh 26;w;w;w;w;w;w;n;n;e",
            "疯狗": "jh 26;w;w;w;w;w;w;n;n;w",
            "余洪兴": "jh 26;w;w;w;w;w;w;s",
            "店老板": "jh 26;w;w;w;w;w;w;s;e",
            "野狗": "jh 26;w;w;w;w;w;w;s;s;w;w;w;w",
            "收破烂的": "jh 26;w;w;w;w;w;w;s;s;w;w;w;w",
            "樵夫": "jh 26;w;w;w;w;w;w;s;s;w;w;w;w",
            "乞丐": "jh 26;w;w;w;w;w;w;s;s;w;w;w;w;n;n",
            "陶老大": "jh 26;w;w;w;w;w;w;s;w",
            "胭松": "jh 26;w;w;w;w;w;w;w;w;n;e",
            "塔祝": "jh 26;w;w;w;w;w;w;w;w;w",
            "灵空": "jh 26;w;w;w;w;w;w;w;w;w;w",
            "护寺藏尼": "jh 26;w;w;w;w;w;w;w;w;w;w",
            "葛伦": "jh 26;w;w;w;w;w;w;w;w;w;w;ask lama_master;event_1_91837538"
        },
        "黑木崖": {
            "冉无望": "jh 27;ne;n;ne",
            "外面船夫": "jh 27;ne;nw;w;nw;w;w",
            "蓝色魔教犯人": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地-空地;n;n;n;n;n;n;e;e;e;e;e;n",
            "红色魔教犯人": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;e;e;e;e;n",
            "青色魔教犯人": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;e;e;e;n",
            "紫色魔教犯人": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;e;n",
            "紫色魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n",
            "亮蓝色魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;n",
            "见钱开": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;e",
            "(蓝色)魔教犯人": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;e;e;e;e;e;n",
            "(红色)魔教犯人": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;e;e;e;e;n",
            "(青色)魔教犯人": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;e;e;e;n",
            "(紫色)魔教犯人": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;e;n",
            "(紫色)魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n",
            "独孤风": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;e",
            "杨延庆": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;e;e",
            "范松": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;e;e;e",
            "巨灵": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e",
            "楚笑": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e",
            "莲亭": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;n",
            "(亮蓝色)魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;n",
            "东方教主": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_57107759;e;e;n;w",
            "花想容": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;w",
            "曲右使": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;w;w",
            "张矮子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;w;w;w",
            "张白发": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w",
            "赵长老": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w",
            "王诚": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;ne",
            "上官云": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;w;n",
            "桑三娘": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;w;ne",
            "葛停香": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;w;nw",
            "罗烈": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;w;se",
            "贾布": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;w;sw",
            "鲍长老": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell-空地;n;n;n;n;n;n;w;w",
            "里面船夫": "jh 27;ne;nw;w;nw;w;w;yell",
            "(青色)魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n",
            "青色魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n",
            "魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n",
            "白色魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n",
            "(白色)魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n",
            "(蓝色)魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n",
            "蓝色魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n",
            "黄色魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n",
            "(黄色)魔教弟子": "jh 27;ne;nw;w;nw;w;w;kill-船夫;get-船夫的尸体;yell-饮马滩;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n",
            "店小二": "jh 27;ne;w",
            "客店老板": "jh 27;ne;w",
            "黑熊": "jh 27;se;e",
            "怪人": "jh 27;se;e;e;e"
        },
        "星宿海": {
            "波斯商人": "jh 28",
            "牧羊人": "jh 28;n",
            "星宿派钹手": "jh 28;n;n",
            "星宿派鼓手": "jh 28;n;n",
            "狮吼师兄": "jh 28;n;n",
            "星宿派号手": "jh 28;n;n",
            "摘星大师兄": "jh 28;n;n;n",
            "丁老怪": "jh 28;n;n;n;n;n",
            "采花子": "jh 28;n;n;n;n;n;n;nw;w",
            "紫姑娘": "jh 28;n;w",
            "天狼师兄": "jh 28;n;w;n",
            "出尘师弟": "jh 28;n;w;n;n",
            "采药人": "jh 28;n;w;w",
            "周女侠": "jh 28;n;w;w;w;w",
            "毒蛇": "jh 28;n;w;w;w;w",
            "牦牛": "jh 28;n;w;w;w;w;w;w;nw;ne;nw;w",
            "雪豹": "jh 28;n;w;w;w;w;w;w;nw;ne;nw;w",
            "唐冠": "jh 28;nw",
            "伊犁": "jh 28;nw",
            "矮胖妇女": "jh 28;nw",
            "巴依": "jh 28;nw;e",
            "小孩": "jh 28;nw;e",
            "阿凡提": "jh 28;nw;e;e",
            "伊犁马": "jh 28;nw;nw",
            "阿拉木罕": "jh 28;nw;nw",
            "买卖提": "jh 28;nw;w",
            "天梵密使": "jh 28;nw;w;buy /map/xingxiu/npc/obj/fire from xingxiu_maimaiti;e;se;sw;event_1_83637364",
            "梅师姐": "jh 28;sw",
            "铁尸": "jh 28;sw;nw;sw;sw;nw;nw;se;sw"
        },
        "茅山": {
            "茅山": "jh 29",
            "野猪": "jh 29;n",
            "张天师": "jh 29;n;n;n;n;event_1_60035830-平台;event_1_65661209-无名山峡谷;n",
            "万年火龟": "jh 29;n;n;n;n;event_1_60035830-平台;event_1_65661209-无名山峡谷;n",
            "阳明居士": "jh 29;n;n;n;n;event_1_60035830-平台;e",
            "道士": "jh 29;n;n;n;n;event_1_60035830-平台;event_1_65661209-洞口;n;n;n;n;n;e;n",
            "孙天灭": "jh 29;n;n;n;n;event_1_60035830-平台;event_1_65661209-洞口;n;n;n;n;n;n;n",
            "道灵": "jh 29;n;n;n;n;event_1_60035830-平台;event_1_65661209-洞口;n;n;n;n;n;n;n;event_1_98579273",
            "护山使者": "jh 29;n;n;n;n;event_1_60035830-平台;event_1_65661209-洞口;n;n;n;n;n;n;n;event_1_98579273;w",
            "林忌": "jh 29;n;n;n;n;event_1_60035830-平台;event_1_65661209-洞口;n;n;n;n;n;n;n;event_1_98579273;n"
        },
        "桃花岛": {
            "陆废人": "jh 30",
            "老渔夫": "jh 30;n;n;n;n;n;n",
            "桃花岛弟子": "jh 30;n;n;n;n;n;n;n",
            "(后院)桃花岛弟子": "jh 30;n;n;n;n;n;n;n",
            "曲三": "jh 30;n;n;n;n;n;n;n;n;n;n;e;e;n",
            "丁高阳": "jh 30;n;n;n;n;n;n;n;n;n;n;e;s",
            "黄岛主": "jh 30;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            "蓉儿": "jh 30;n;n;n;n;n;n;n;n;n;n;n;n;n;n;se;s",
            "桃花岛弟子": "jh 30;n;n;n;n;n;n;n;n;n;n;w",
            "(习武房)桃花岛弟子": "jh 30;n;n;n;n;n;n;n;n;n;n;w",
            "桃花岛弟子": "jh 30;n;n;n;n;n;n;n;n;n;n;w;w;s",
            "(药房)桃花岛弟子": "jh 30;n;n;n;n;n;n;n;n;n;n;w;w;s",
            "哑仆": "jh 30;n;n;n;n;n;n;n;n;n;n;w;w;s",
            "哑仆人": "jh 30;n;n;n;n;n;n;n;w;w",
            "神雕大侠": "jh 30;n;n;ne",
            "傻姑": "jh 30;yell-牛家村海边;w;n",
            "戚总兵": "jh 30;yell-牛家村海边;w;n;e"
        },
        "铁雪山庄": {
            "樵夫": "jh 31;n;n;n",
            "樵夫": "jh 31;n;n;n;w",
            "欧冶子": "jh 31;n;n;n;w;w;w",
            "老张": "jh 31;n;n;n;w;w;w;w;n",
            "雪鸳": "jh 31;n;n;n;w;w;w;w;n;n",
            "小翠": "jh 31;n;n;n;w;w;w;w;n;n;n",
            "雪蕊儿": "jh 31;n;n;n;w;w;w;w;n;n;n",
            "铁少": "jh 31;n;n;n;w;w;w;w;n;n;n",
            "白袍公": "jh 31;n;n;n;w;w;w;w;n;n;n;n",
            "黑袍公": "jh 31;n;n;n;w;w;w;w;n;n;n;n",
            "陳小神": "jh 31;n;se",
            "剑荡八荒": "jh 31;n;se;e",
            "魏娇": "jh 31;n;se;e;se",
            "神仙姐姐": "jh 31;n;se;e;se;s",
            "寒夜·斩": "jh 31;n;se;e;se;s;s",
            "他": "jh 31;n;se;e;se;s;s;sw",
            "出品人◆风云": "jh 31;n;se;e;se;s;s;sw;se",
            "二虎子": "jh 31;n;se;e;se;s;s;sw;se;se",
            "欢乐剑客": "jh 31;n;se;e;se;s;s;sw;se;se;e",
            "黑市老鬼": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw",
            "纵横老野猪": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e",
            "无头苍蝇": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne",
            "神弑☆铁手": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n",
            "禅师": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne",
            "道一": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n",
            "采菊隐士": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n",
            "【人间】雨修": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n",
            "汉时叹": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;e;e;event_1_47175535",
            "冷泉心影": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;e;n",
            "烽火戏诸侯": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;e;e;event_1_94442590",
            "阿不": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;w;w;event_1_57281457",
            "男主角◆番茄": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;w;n",
            "剑仙": "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;w;w;sw",
            "小飞": "jh 31;n;se;e;se;s;w"
        },
        "慕容山庄": {
            "家丁": "jh 32;n;n",
            "邓家臣": "jh 32;n;n;se",
            "朱姑娘": "jh 32;n;n;se;e;s;s",
            "船工小厮": "jh 32;n;n;se;e;s;s;event_1_99232080",
            "芳绫": "jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e",
            "无影斥候": "jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e;n",
            "柳掌门": "jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e;s;s;event_1_92057893;e;s;event_1_8205862",
            "慕容老夫人": "jh 32;n;n;se;n",
            "慕容侍女": "jh 32;n;n;se;n",
            "公冶家臣": "jh 32;n;n;se;n;n",
            "包家将": "jh 32;n;n;se;n;n;n;n",
            "风波恶": "jh 32;n;n;se;n;n;n;n;n",
            "慕容公子": "jh 32;n;n;se;n;n;n;n;w;w;n",
            "慕容家主": "jh 32;n;n;se;n;n;n;n;w;w;w;n;event_1_72278818;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;w",
            "小兰": "jh 32;n;n;se;n;n;n;n;w;w;w;n;w",
            "神仙姐姐": "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;e",
            "小茗": "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;n",
            "王夫人": "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;n",
            "严妈妈": "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;w"
        },
        "大理": {
            "摆夷女子": "jh 33;sw;sw",
            "士兵": "jh 33;sw;sw;s;s",
            "武将": "jh 33;sw;sw;s;s",
            "51": "jh 33;sw;sw;s;s",
            "台夷商贩": "jh 33;sw;sw;s;s;s;nw;n",
            "乌夷商贩": "jh 33;sw;sw;s;s;s;nw;n",
            "土匪": "jh 33;sw;sw;s;s;s;nw;n;ne;n;n;ne",
            "猎人": "jh 33;sw;sw;s;s;s;nw;n;nw;n",
            "皮货商": "jh 33;sw;sw;s;s;s;nw;n;nw;n",
            "牧羊女": "jh 33;sw;sw;s;s;s;nw;n;nw;n;n;n;n;e;e",
            "牧羊人": "jh 33;sw;sw;s;s;s;nw;n;nw;n;n;n;n;e;e",
            "僧人": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e",
            "贵公子": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;e;e",
            "恶奴": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;e;e",
            "枯大师": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;n",
            "平通镖局镖头": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s",
            "「平通镖局」镖头": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s",
            "游客": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e",
            "村妇": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e",
            "段公子": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne",
            "农夫": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e",
            "(阳宗镇)台夷商贩": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e",
            "台夷商贩": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e",
            "老祭祀": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;ne;e;n",
            "老祭司": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;ne;e;n",
            "采桑女": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;s",
            "竹叶青蛇": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw",
            "(阳宗镇)采笋人": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s",
            "采笋人": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s",
            "砍竹人": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;s",
            "养蚕女": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;s;e;e",
            "纺纱女": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;s;e;n;e;n",
            "麻雀": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s",
            "小道姑": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s;w",
            "刀俏尼": "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s;w;n",
            "毒蜂": "jh 33;sw;sw;s;s;s;s;e;e;n",
            "傅护卫": "jh 33;sw;sw;s;s;s;s;s;e",
            "褚护卫": "jh 33;sw;sw;s;s;s;s;s;e;n",
            "家丁": "jh 33;sw;sw;s;s;s;s;s;e;n;se",
            "丹顶鹤": "jh 33;sw;sw;s;s;s;s;s;e;n;se;e",
            "段王妃": "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e",
            "养花女": "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;e",
            "段无畏": "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n",
            "古护卫": "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n",
            "王府御医": "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n",
            "婉清姑娘": "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n;ne;e;e;n",
            "段皇爷": "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n;ne;n",
            "石人": "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;s",
            "范司马": "jh 33;sw;sw;s;s;s;s;s;e;n;se;n;e",
            "巴司空": "jh 33;sw;sw;s;s;s;s;s;e;n;se;n;n",
            "华司徒": "jh 33;sw;sw;s;s;s;s;s;e;n;se;n;w",
            "霍先生": "jh 33;sw;sw;s;s;s;s;s;e;n;se;w",
            "石匠": "jh 33;sw;sw;s;s;s;s;s;s;e;e",
            "薛老板": "jh 33;sw;sw;s;s;s;s;s;s;e;n",
            "江湖艺人": "jh 33;sw;sw;s;s;s;s;s;s;s",
            "太和居店小二": "jh 33;sw;sw;s;s;s;s;s;s;s;e",
            "歌女": "jh 33;sw;sw;s;s;s;s;s;s;s;e;n",
            "南国姑娘": "jh 33;sw;sw;s;s;s;s;s;s;s;s;e;s",
            "摆夷老叟": "jh 33;sw;sw;s;s;s;s;s;s;s;s;e;s",
            "大土司": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;n",
            "族头人": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;n;se;ne",
            "黄衣卫士": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;s",
            "盛皮罗客商": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s",
            "客店店小二": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;e",
            "古灯大师": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s",
            "族长": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;e;n;n",
            "祭司": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;e;n;n;n",
            "祭祀": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;s;e;n;n;n",
            "渔夫": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;n",
            "台夷猎人": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;s",
            "台夷妇女": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;w",
            "台夷姑娘": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw",
            "水牛": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;n",
            "台夷农妇": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;s",
            "采笋人": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;w",
            "(武定镇)采笋人": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;w",
            "野兔": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;se",
            "侍者": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se",
            "高侯爷": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n",
            "素衣卫士": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n",
            "傣族首领": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;n;e;e;se",
            "陪从": "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;n;w;se",
            "摆夷小孩": "jh 33;sw;sw;s;s;s;s;s;s;w",
            "锦衣卫士": "jh 33;sw;sw;s;s;s;s;s;w",
            "朱护卫": "jh 33;sw;sw;s;s;s;s;s;w",
            "太监": "jh 33;sw;sw;s;s;s;s;s;w;n;n",
            "宫女": "jh 33;sw;sw;s;s;s;s;s;w;n;n;n;n",
            "破嗔": "jh 33;sw;sw;s;s;s;s;w;w;n",
            "破疑": "jh 33;sw;sw;s;s;s;s;w;w;n",
            "段恶人": "jh 33;sw;sw;s;s;s;s;w;w;n;se",
            "神农帮弟子": "jh 33;sw;sw;s;s;s;s;w;w;s",
            "无量剑弟子": "jh 33;sw;sw;s;s;s;s;w;w;s;nw",
            "吴道长": "jh 33;sw;sw;s;s;s;s;w;w;w;w",
            "(镇雄)农夫": "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;e",
            "农夫": "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;e",
            "山羊": "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;n",
            "少女": "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;ne",
            "老祭祀": "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se",
            "老祭司": "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se",
            "孟加拉虎": "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;s;s;w;w"
        },
        "断剑山庄": {
            "断剑山庄": "jh 34",
            "黑袍老人": "jh 34;ne;e;e;e;e;e;n;e;n",
            "白袍老人": "jh 34;ne;e;e;e;e;e;n;e;n",
            "和尚": "jh 34;ne;e;e;e;e;e;n;n;n;n;n;w",
            "尼姑": "jh 34;ne;e;e;e;e;e;n;n;n;n;n;n;e",
            "摆渡老人": "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell-小船",
            "天怒剑客": "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell-断剑山庄;n;n;e;e",
            "任笑天": "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell-断剑山庄;n;n;w;w",
            "摘星老人": "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell-断剑山庄;n;n;w;s;w",
            "落魄中年": "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell-断剑山庄;n;n;w;s",
            "栽花老人": "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell-断剑山庄;n;n;n",
            "背刀人": "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell-断剑山庄;n;n;n;e;e",
            "雁南飞": "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell-断剑山庄;n;n;n;e;n;e",
            "梦如雪": "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell-断剑山庄;n;n;n;n;w;w",
            "剑痴": "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell-断剑山庄;n;n;n;n;n;n",
            "雾中人": "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell-断剑山庄;n;n;n;n;n;n;n",
            "独孤不败": "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell-断剑山庄;n;n;n;n;n;n;e;e;event_1_10251226"
        },
        "冰火岛": {
            "冰火岛": "jh 35",
            "火麒麟王": "jh 35;nw;nw;nw;n;ne;nw",
            "火麒麟": "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;n;nw",
            "麒麟幼崽": "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;n;nw",
            "游方道士": "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e",
            "梅花鹿": "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e",
            "雪狼": "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw",
            "白熊": "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw",
            "殷夫人": "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;e",
            "张五侠": "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;w;w;n;e;n;w;w;s;s",
            "赵郡主": "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n",
            "谢狮王": "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;ne;n",
            "黑衣杀手": "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw",
            "元真和尚": "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw;sw;se;s;sw;sw;se;se"
        },
        "侠客岛": {
            "侠客岛": "jh 36",
            "黄衣船夫": "jh 36;yell-侠客岛渡口",
            "侠客岛厮仆": "jh 36;yell-侠客岛渡口",
            "张三": "jh 36;yell-侠客岛渡口;e",
            "云游高僧": "jh 36;yell-侠客岛渡口;e;ne;ne",
            "王五": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;s",
            "白衣弟子": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;s",
            "店小二": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;s;e",
            "侠客岛闲人": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;s;w",
            "石公子": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;n",
            "书生": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;n",
            "丁当": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;n;n",
            "白掌门": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;n;w",
            "马六": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e",
            "侠客岛弟子": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e",
            "李四": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e;n",
            "蓝衣弟子": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e;n",
            "童子": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e;e",
            "龙岛主": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e;e",
            "木岛主": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e;e;fly;e",
            "侍者": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e;e;e",
            "史婆婆": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e;e;e;e",
            "矮老者": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;e;ne;nw",
            "高老者": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;e;ne;nw;w",
            "谢居士": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e;e;e;e;e;n;e;e;ne",
            "朱熹": "jh 36;yell-侠客岛渡口;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;w;w",
            "小猴子": "jh 36;yell-侠客岛渡口;e;se;e",
            "樵夫": "jh 36;yell-侠客岛渡口;e;se;e;e",
            "医者": "jh 36;yell-侠客岛渡口;e;se;e;e;e;e",
            "石帮主": "jh 36;yell-侠客岛渡口;e;se;e;e;n;e;s",
            "野猪": "jh 36;yell-侠客岛渡口;e;se;e;e;w",
            "渔家男孩": "jh 36;yell-侠客岛渡口;e;se;e;e;s;s;s;w",
            "渔夫": "jh 36;yell-侠客岛渡口;e;se;e;e;s;s;s;s",
            "渔家少女": "jh 36;yell-侠客岛渡口;e;se;e;e;s;s;s;e",
            "阅书老者": "jh 36;yell-侠客岛渡口;e;se;e;e;s;s;s;e;ne",
            "青年海盗": "jh 36;yell-侠客岛渡口;e;se;e;e;s;s;s;e;ne;e;e;n",
            "老海盗": "jh 36;yell-侠客岛渡口;e;se;e;e;s;s;s;e;ne;e;e;n;e;n"
        },
        "绝情谷": {
            "绝情谷": "jh 37",
            "土匪": "jh 37;n",
            "村民": "jh 37;n;e;e",
            "野兔": "jh 37;n;e;e;nw;nw;w;n;nw;n;n",
            "绝情谷弟子": "jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw",
            "天竺大师": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w",
            "养花女": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n",
            "侍女": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n",
            "谷主夫人": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw",
            "门卫": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw",
            "绝情谷谷主": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw;n;nw",
            "谷主分身": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw;n;nw",
            "白衣女子": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;ne;n;ne",
            "采花贼": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;ne;e;ne;e;n",
            "拓跋嗣": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne",
            "没藏羽无": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e",
            "野利仁嵘": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e;ne",
            "嵬名元昊": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e;ne;se",
            "雪若云": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;event_1_16813927",
            "养鳄人": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se",
            "鳄鱼": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se",
            "囚犯": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;s;s;s",
            "地牢看守": "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;s;s;s;w"
        },
        "碧海山庄": {
            "碧海山庄": "jh 38",
            "法明大师": "jh 38;n;n;w",
            "僧人": "jh 38;n;n;w",
            "隐士": "jh 38;n;n;n;n;w",
            "野兔": "jh 38;n;n;n;n;w;w",
            "护卫": "jh 38;n;n;n;n;n;n;n",
            "侍女": "jh 38;n;n;n;n;n;n;n;w;w;nw",
            "尹秋水": "jh 38;n;n;n;n;n;n;n;w;w;nw;w",
            "养花女": "jh 38;n;n;n;n;n;n;n;w;w;nw;w;w;n;n",
            "家丁": "jh 38;n;n;n;n;n;n;n;n",
            "耶律楚哥": "jh 38;n;n;n;n;n;n;n;n;n",
            "护卫总管": "jh 38;n;n;n;n;n;n;n;n;n",
            "易牙传人": "jh 38;n;n;n;n;n;n;n;n;n;e;se;s",
            "砍柴人": "jh 38;n;n;n;n;n;n;n;n;n;e;se;s;e",
            "独孤雄": "jh 38;n;n;n;n;n;n;n;n;n;n;n;e;e;se;se;e;n",
            "王子轩": "jh 38;n;n;n;n;n;n;n;n;n;n;n;e;e;se;se;e;n;n;n",
            "王昕": "jh 38;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n"
        },
        "天山": {
            "天山": "jh 39;ne",
            "周教头": "jh 39;ne",
            "辛怪人": "jh 39;ne;e;n;ne",
            "穆小哥": "jh 39;ne;e;n;ne;ne;n",
            "牧民": "jh 39;ne;e;n;nw",
            "塞外胡兵": "jh 39;ne;e;n;nw;nw;w;s;s",
            "胡兵头领": "jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w",
            "乌刀客": "jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w;s;w",
            "波斯商人": "jh 39;ne;e;n;ne;ne;se",
            "贺好汉": "jh 39;ne;e;n;ne;ne;se;e",
            "铁好汉": "jh 39;ne;e;n;ne;ne;se;e",
            "刁屠夫": "jh 39;ne;e;n;ne;ne;se;e;n",
            "金老板": "jh 39;ne;e;n;ne;ne;se;e;n",
            "韩马夫": "jh 39;ne;e;n;ne;ne;se;e;e",
            "蒙面女郎": "jh 39;ne;e;n;ne;ne;se;e;s;e;se",
            "宝箱": "jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w;s;w;n;w;event_1_69872740",
            "武壮士": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n",
            "程首领": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n;ne;nw",
            "菊剑": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n;ne;nw;nw;n",
            "石嫂": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n;ne;nw;nw;w;w",
            "兰剑": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n;ne;nw;nw;w;n",
            "符针神": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n;ne;nw;nw;w;n;n",
            "梅剑": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n;ne;nw;nw;w;n;n;e",
            "竹剑": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n;ne;nw;nw;w;n;n;w",
            "余婆": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n;ne;nw;nw;w;n;n;n;e;nw",
            "九翼": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n;ne;nw;nw;w;n;n;n;e;nw;w;ne",
            "天山死士": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n;ne;nw;nw;w;n;n;n;e;nw;w;nw",
            "天山大剑师": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n;ne;nw;nw;w;n;n;n;e;nw;w;nw",
            "护关弟子": "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;ts1;nw;n;ne;nw;nw;w;n;n;n;e;e;s",
            "楚大师兄": "jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939-星星峡;ts2",
            "傅奇士": "jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939-星星峡;ts2;ne;ne;nw",
            "杨英雄": "jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939-星星峡;ts2;ne;ne;nw;nw",
            "胡大侠": "jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939-星星峡;ts2;ne;ne;nw;nw;nw;w"
        },
        "苗疆": {
            "苗疆": "jh 40",
            "温青": "jh 40;s;s;s;s",
            "苗村长": "jh 40;s;s;s;s;w;w;w",
            "苗家小娃": "jh 40;s;s;s;s;w;w;w;n",
            "苗族少年": "jh 40;s;s;s;s;w;w;w;w",
            "苗族少女": "jh 40;s;s;s;s;w;w;w;w",
            "田嫂": "jh 40;s;s;s;s;e;s;se",
            "金背蜈蚣": "jh 40;s;s;s;s;e;s;se;sw;s;s",
            "人面蜘蛛": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;s;sw",
            "吸血蜘蛛": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;s;sw",
            "樵夫": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e",
            "蓝姑娘": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧峡;sw",
            "莽牯朱蛤": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s",
            "阴山天蜈": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;s",
            "食尸蝎": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s",
            "蛇": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e",
            "五毒教徒": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw",
            "沙护法": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n",
            "五毒弟子": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n",
            "毒郎中": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;e",
            "白鬓老者": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w",
            "何长老": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w;sw",
            "毒女": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n",
            "潘左护法": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n",
            "大祭司": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;e",
            "岑秀士": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw",
            "齐长老": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;ne;ne;se;se",
            "五毒护法": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;ne;ne;nw;ne;e",
            "何教主": "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914-澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;ne;ne;nw;ne;e"
        },
        "白帝城": {
            "白帝城": "jh 41",
            "白衣弟子": "jh 41;se;e;e",
            "白衣少年": "jh 41;se;e;e;se;se;se;se",
            "李峰": "jh 41;se;e;e;se;se;se;se;s;s",
            "李白": "jh 41;se;e;e;se;se;se;se;s;s;s",
            "“妖怪”": "jh 41;se;e;e;se;se;se;se;s;s;s;e",
            "庙祝": "jh 41;se;e;e;se;se;se;se;s;s;s;e;e;ne",
            "狱卒": "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;w;w;w",
            "白帝": "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n",
            "练武士兵": "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;e;e",
            "镇长": "jh 41;se;e;e;ne;ne;se;e;e;ne",
            "李巡": "jh 41;se;e;e;ne;ne;se;e;e;s;w",
            "守门士兵": "jh 41;se;e;e;nw;nw",
            "公孙将军": "jh 41;se;e;e;nw;nw;n;n;e;ne;e",
            "贴身侍卫": "jh 41;se;e;e;nw;nw;n;n;e;ne;e",
            "粮官": "jh 41;se;e;e;nw;nw;n;n;e;ne;n;nw;n",
            "白衣士兵": "jh 41;se;e;e;nw;nw;n;n;w;w",
            "文将军": "jh 41;se;e;e;nw;nw;n;n;w;w;n;n;e"
        },
        "墨家机关城": {
            "索卢参": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n",
            "墨家弟子": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n",
            "高孙子": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n",
            "燕丹": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;n;n",
            "荆轲": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;n;n",
            "庖丁": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;n;n;n;n;n",
            "县子硕": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;e",
            "魏越": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;n;e",
            "公尚过": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;n;n;e",
            "高石子": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;w",
            "大博士": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;w",
            "治徒娱": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;n;w",
            "黑衣人": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-非命崖底",
            "徐夫子": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-神龙山;e;s;e;s;ne;s;sw;nw;s;se;s;sw;s;s",
            "屈将子": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-神龙山;e;s;e;s;ne;s;sw;nw;s;se;s;e;e",
            "偷剑贼": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-神龙山;e;s;e;s;ne;s;sw;nw;s;se;s;e;e;e",
            "大匠师": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-神龙山;e;n;e;s;e;n;nw;e;nw;w;w",
            "随巢子": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-神龙山;e;n;e;s;e;n;nw;e;nw;e",
            "高何": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-神龙山;e;n;e;s;e;n;nw;e;nw;sw",
            "随师弟": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-神龙山;e;n;e;s;e;n;nw;e;nw;sw;sw",
            "曹公子": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-神龙山;e;n;e;s;e;n;nw;e;nw;n;e",
            "鲁班": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-神龙山;e;n;e;s;e;n;nw;e;nw;n;w",
            "耕柱子": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-神龙山;e;n;e;s;e;n;nw;e;nw;n;nw",
            "墨子": "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-神龙山;e;n;e;s;e;n;nw;e;nw;n;ne"
        },
        "掩月城": {
            "掩月城": "jh 43",
            "执定长老": "jh 43",
            "佩剑少女": "jh 43",
            "野狗": "jh 43",
            "穿山甲": "jh 43;n;ne;ne;n;e;e;se;se;e;ne",
            "黑衣老者": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;se;se;s;s;sw;s",
            "六道禅师": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;se;se;s;s;sw;s;sw;sw;sw;sw",
            "火狐": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw",
            "黄鹂": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se",
            "夜攸裳": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se",
            "云卫": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n",
            "云将": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e",
            "女眷": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e",
            "莫邪传人": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;n",
            "老仆": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;se;ne",
            "采莲": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;se;ne",
            "狄仁啸": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e",
            "青云仙子": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e",
            "秦东海": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e",
            "执剑长老": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e",
            "执典长老": "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e;event_1_89957254;ne;ne;se;s;s;s",
            "野兔": "jh 43;n;ne;ne;n;n;n;nw",
            "杂货脚夫": "jh 43;n;ne;ne;n;n;n;nw;n",
            "老烟杆儿": "jh 43;n;ne;ne;n;n;n;nw;n",
            "短衫剑客": "jh 43;n;ne;ne;n;n;n;nw;n;ne",
            "巧儿": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne",
            "青牛": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n",
            "骑牛老汉": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n",
            "书童": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w",
            "赤尾雪狐": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw",
            "泥鳅": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;sw",
            "灰衣血僧": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;sw;sw;s;s",
            "白鹭": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;sw;sw;s;s;s",
            "青衫女子": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw",
            "樊川居士": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw",
            "无影暗侍": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw",
            "琴仙子": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n",
            "百晓居士": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e",
            "清风童子": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se",
            "刀仆": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw",
            "天刀宗师": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw",
            "虬髯长老": "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw;s;e;s;s;s;event_1_69228002",
            "仆人": "jh 43;w",
            "醉酒男子": "jh 43;w",
            "候君凛": "jh 43;w;w;w",
            "紫衣仆从": "jh 43;w;n",
            "轻纱女侍": "jh 43;w;n;n",
            "抚琴女子": "jh 43;w;n;n",
            "黑纱舞女": "jh 43;w;n;n;w",
            "女官人": "jh 43;w;n;n;w",
            "小厮": "jh 43;w;n;n;n",
            "梅映雪": "jh 43;w;n;n;n;ne",
            "舞眉儿": "jh 43;w;n;n;n;ne;nw;nw;nw",
            "寄雪奴儿": "jh 43;w;n;n;n;ne;nw;nw;ne",
            "琴楚儿": "jh 43;w;n;n;n;ne;nw;nw;ne",
            "赤髯刀客": "jh 43;w;w",
            "华衣女子": "jh 43;w;w",
            "老乞丐": "jh 43;w;w",
            "马帮弟子": "jh 43;w;w;w",
            "养马小厮": "jh 43;w;w;w;n",
            "客栈掌柜": "jh 43;w;w;w;n;n",
            "店小二": "jh 43;w;w;w;n;n",
            "蝮蛇": "jh 43;w;w;w;w",
            "东方秋": "jh 43;w;w;w;w;nw;n;n",
            "函谷关官兵": "jh 43;w;w;w;w;nw;n;n;nw",
            "长刀敌将": "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw",
            "黑虎敌将": "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w",
            "长鞭敌将": "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw",
            "巨锤敌将": "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s",
            "狼牙敌将": "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw",
            "金刚敌将": "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw",
            "蛮斧敌将": "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n",
            "血枪敌将": "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw",
            "夜魔": "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw",
            "千夜精锐": "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;n",
            "胡人王子": "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;n;n;ne",
            "夜魔侍从": "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;n;n;ne;ne;ne",
            "行脚贩子": "jh 43;sw",
            "六婆婆": "jh 43;sw;sw;sw;w",
            "农家少妇": "jh 43;sw;sw;sw;w",
            "青壮小伙": "jh 43;sw;sw;sw;w;w",
            "店老板": "jh 43;sw;sw;sw;s;se;se;se",
            "白衣弟子": "jh 43;sw;sw;sw;s;se;se;se;e",
            "黑衣骑士": "jh 43;sw;sw;sw;s;se;se;se;e;n",
            "青衫铁匠": "jh 43;sw;sw;sw;s;se;se;se;e;e",
            "青鬃野马": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw",
            "牧民": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw",
            "小马驹儿": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se",
            "绛衣剑客": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;se",
            "白衣公子": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;se;ne",
            "的卢幼驹": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne",
            "乌骓马": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne",
            "秦惊烈": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s",
            "千小驹": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s",
            "牧羊犬": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e",
            "追风马": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e",
            "诸侯秘使": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne",
            "赤菟马": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne",
            "风如斩": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne",
            "白狐": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw",
            "小鹿": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw;nw",
            "破石寻花": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw;nw;w",
            "爪黄飞电": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se",
            "黑狗": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s",
            "照夜玉狮子": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s",
            "灰耳兔": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;sw;sw",
            "闻香寻芳": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;sw;sw;sw",
            "鲁总管": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;se",
            "风花侍女": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;se",
            "天玑童子": "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;se;e"
        },
        '海云阁': {
            '马夫': 'jh 44',
            '野狗': 'jh 44;n',
            '老镇长': 'jh 44;n;n',
            '烟袋老头': 'jh 44;n;n;w',
            '青年女子': 'jh 44;n;n;w',
            '背枪客': 'jh 44;n;n;n',
            '小孩': 'jh 44;n;n;n;n',
            '野兔': 'jh 44;n;n;n;n;w;w',
            '游客': 'jh 44;n;n;n;n;e;ne',
            '青年剑客': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;w;w;w',
            '九纹龙': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;w;w;w;w;w;w',
            '蟒蛇': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;w;w;w;w;w;w;n;n;n;n',
            '暗哨': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;w;w;w;w;w;w;n;n;n;n;n',
            '石邪王': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;w;w;w;w;w;w;n;n;n;n;n;e;e;s;s',
            '穿山豹': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;n;w;n;n;n;n;w;n;e;e;n',
            '地杀': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;n;w;n;n;n;n;w;n;e;e;n;n;n;n',
            '天杀': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;n;w;n;n;n;n;w;n;e;e;n;n;n;n;n;n',
            '海东狮': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;n;w;n;n;n;n;w;n;e;e;n;n;n;n;n;n;n',
            '海云长老': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;n;w;n;n;n;n;w;n;e;e;n;n;n;n;n;n;n',
            '红纱舞女': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;n;w;n;n;n;n;w;n;e;e;n;n;n;n;n;n;n',
            '青纱舞女': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;n;w;n;n;n;n;w;n;e;e;n;n;n;n;n;n;n',
            '紫纱舞女': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;n;w;n;n;n;n;w;n;e;e;n;n;n;n;n;n;n',
            '白纱舞女': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;n;w;n;n;n;n;w;n;e;e;n;n;n;n;n;n;n',
            '六如公子': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;n;w;n;n;n;n;w;n;w;w;n;n;n',
            '萧秋水': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;n;e;n;n;n;n;e;n;e;e;n;n',
            '啸林虎': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;e;e;e;e;e;e;n;n',
            '陆大刀': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e',
            '水剑侠': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne',
            '乘风客': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne',
            '血刀妖僧': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se',
            '花铁枪': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne',
            '狄小侠': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne;n;n;n;n;nw',
            '水姑娘': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne;n;n;n;n;nw',
            '虬髯犯人': 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;n;w;n;n;n;n;w;n;e;e;n;n;n;n;n;n;n;n;nw;w;w;nw',
        },
        '幽冥山庄': {
            '野狗': 'jh 45;ne',
            '毒蛇': 'jh 45;ne;ne;n;n',
            '樵夫': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n',
            '鲍龙': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;e',
            '过之梗': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne',
            '翁四': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n',
            '屈奔雷': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e',
            '伍湘云': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e;e',
            '殷乘风': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e;e',
            '辛仇': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n',
            '辛杀': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n',
            '蔡玉丹': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw',
            '辛十三娘': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n',
            '暗杀': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n',
            '巴司空': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;w',
            '追命': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e',
            '艳无忧': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e',
            '摄魂鬼杀': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e',
            '幽冥山庄': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e',
            '柳激烟': 'jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n',
            '龟敬渊': 'jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n',
            '凌玉象': 'jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n',
            '沈错骨': 'jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n',
            '慕容水云': 'jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n',
            '金盛煌': 'jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;w',
            '冷血': 'jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;e',
            '庄之洞': 'jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;n',
            '高山青': 'jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;n',
        },
        '花街': {
            '花札敖': 'jh 46;e',
            '尊信门杀手': 'jh 46;e',
            '山赤岳': 'jh 46;e;e',
            '鹰飞': 'jh 46;e;e;e',
            '由蚩敌': 'jh 46;e;e;e;e',
            '强望生': 'jh 46;e;e;e;e;e',
            '莫意闲': 'jh 46;e;e;e;e;e;e',
            '甄素善': 'jh 46;e;e;e;e;e;e;e',
            '谈应手': 'jh 46;e;e;e;e;e;e;e;e',
            '戚长征': 'jh 46;e;e;e;e;e;e;e;e;e',
            '怒蛟高手': 'jh 46;e;e;e;e;e;e;e;e;e',
            '韩柏': 'jh 46;e;e;e;e;e;e;e;e;e;e',
            '烈震北': 'jh 46;e;e;e;e;e;e;e;e;e;e;e',
            '赤尊信': 'jh 46;e;e;e;e;e;e;e;e;e;e;e;e',
            '乾罗': 'jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e',
            '厉若海': 'jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;e',
            '浪翻云': 'jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;e;e',
            '方夜羽': 'jh 46;e;e;e;e;e;e;e;e;n',
            '封寒': 'jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e',
            '盈散花': 'jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;n',
            '寒碧翠': 'jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;e',
            '薄昭如': 'jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;s',
            '攻击': 'jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;n',
            '血': 'jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;e',
            '内': 'jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;s',
        },
        '西凉城': {
            '响尾蛇': 'jh 47;ne',
            '官差': 'jh 47;ne;n;n;n;nw',
            '门外官兵': 'jh 47;ne;n;n;n;nw',
            '驿卒': 'jh 47;ne;n;n;n;ne;ne;e',
            '官兵': 'jh 47;ne;n;n;n;ne;ne;e;e;e',
            '苦力': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne',
            '樵夫': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n',
            '疯狗': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne',
            '野狗': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n',
            '伍定远': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;w;w',
            '捕快': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;w;w',
            '农民': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n',
            '马夫': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n',
            '黑衣镖师': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;nw',
            '齐润翔': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;nw',
            '镖师': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;nw;nw',
            '管家': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne',
            '李铁杉': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n',
            '铁剑': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n',
            '止观大师': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n',
            '慧清': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n',
            '佛灯': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n;n;ne;n;get xiliangcheng_fodeng',
            '屠凌心': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se',
            '昆仑杀手': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se',
            '金凌霜': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s',
            '醉汉': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s',
            '钱凌异': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s;s',
            '齐伯川': 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s;s;s',
        },
        '高昌迷宫': {
            '糟老头子': 'jh 48;e;ne',
            '阿曼': 'jh 48;e;ne',
            '苏普': 'jh 48;e;ne',
            '太行刀手': 'jh 48;e;ne',
            '陈达海': 'jh 48;e;ne',
            '哈卜拉姆': 'jh 48;e;ne;ne',
            '天铃鸟': 'jh 48;e;ne;ne;s',
            '牧民': 'jh 48;e;ne;ne;se',
            '霍元龙': 'jh 48;e;se',
            '恶狼': 'jh 48;e;se;se;e;ne;se',
            '响尾蛇': 'jh 48;e;se;se;e;ne;se;e',
            '铁门': 'jh 48;e;se;se;e;ne;se;e;e;e;ne;ne',
            '骆驼': 'jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s',
            '男尸': 'jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw',
            '老翁': 'jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw;sw;s',
            '李文秀': 'jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw;sw;s;sw;se',
            '苏鲁克': 'jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927',
            '车尔库': 'jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;n',
            '瓦耳拉齐': 'jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;n;n;n',
        },
        '京城': {
            '饥民': 'jh 49',
            '捕快': 'jh 49;n;n;n;n',
            '武将': 'jh 49;n;n;n;n',
            '小丫鬟': 'jh 49;n;n;n;n;n',
            '侯府小姐': 'jh 49;n;n;n;n;n',
            '九华山女弟子': 'jh 49;n;n;n;n;n;n',
            '娟儿': 'jh 49;n;n;n;n;n;n',
            '东厂侍卫': 'jh 49;n;n;n;n;n;n;n',
            '城门官兵': 'jh 49;n;n;n;n;n;n;n;n',
            '柳昂天': 'jh 49;n;n;n;n;n;n;n;n;n;n;n;n;n;n',
            '江充': 'jh 49;n;n;n;n;n;n;n;n;n;n;n;n;n;n',
            '柳府铁卫': 'jh 49;n;n;n;n;n;n;n;n;n;n;n;n;n;n',
            '莫凌山': 'jh 49;n;n;n;n;n;e',
            '昆仑弟子': 'jh 49;n;n;n;n;n;e',
            '安道京': 'jh 49;n;n;n;n;n;e;e',
            '郝震湘': 'jh 49;n;n;n;n;n;e;e;e',
            '锦衣卫': 'jh 49;n;n;n;n;n;e;e;e',
            '韦子壮': 'jh 49;n;n;n;n;n;e;e;e;e',
            '王府卫士': 'jh 49;n;n;n;n;n;e;e;e;e',
            '风流司郎中': 'jh 49;n;n;n;n;n;e;e;e;e;n',
            '伍崇卿': 'jh 49;n;n;n;n;n;e;e;s',
            '苏颖超': 'jh 49;n;n;n;n;n;e;e;s',
            '店伙计': 'jh 49;n;n;n;n;n;e;e;s',
            '学士': 'jh 49;n;n;n;n;n;w',
            '书生': 'jh 49;n;n;n;n;n;w;w',
            '胡媚儿': 'jh 49;n;n;n;n;n;w;w;s',
            '荷官': 'jh 49;n;n;n;n;n;w;w;s',
            '白虎': 'jh 49;n;n;n;n;n;w;w;s',
            '青龙': 'jh 49;n;n;n;n;n;w;w;n',
            '打手': 'jh 49;n;n;n;n;n;w;w;n',
            '藏六福': 'jh 49;n;n;n;n;n;w;w;n',
            '杂货贩子': 'jh 49;n;n;n;n;n;w;w;w',
            '苦力': 'jh 49;n;n;n;n;n;w;w;w;w',
            '掌柜': 'jh 49;n;n;n;n;n;w;w;w;w;s',
            '醉汉': 'jh 49;n;n;n;n;n;w;w;w;w;w',
            '游客': 'jh 49;n;n;n;n;n;w;w;w;w;w;w',
            '顾倩兮': 'jh 49;n;n;n;n;n;w;w;w;w;w;w;n',
            '通天塔': 'jh 49;n;n;n;n;n;n;n;n;n;e;e;ne;e;e;ne;ne;n;n',
            '王一通': 'jh 49;n;n;n;n;n;n;n;n;n;w;w;nw;w;n;n;n;w;nw',
            '贵妇': 'jh 49;n;n;n;n;n;n;n;n;n;w;w;nw;w;n;n;n;w;nw;nw',
            '红螺寺': 'jh 49;n;n;n;n;n;n;n;n;n;w;w;nw;w;n;n;n;w;nw;nw;nw;n',
        },
        '越王剑宫': {
            "樵夫": "jh 50",
            "毒蛇": "jh 50;ne;ne",
            "欧余刀客": "jh 50;ne;ne;n;n;n;ne",
            "山狼": "jh 50;ne;ne;n;n",
            "山狼王": "jh 50;ne;ne;n;n",
            "吴国暗探": "jh 50;ne;ne;n;n;n;ne",
            "山羊": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s",
            "文种": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e;w;n;n;n;n;n;w;e;n;n",
            "牧羊少女": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s",
            "猎人": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s",
            "白猿": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se",
            "老奶奶": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s",
            "范蠡": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e",
            "薛烛": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e;w;n;n;n;n;n;w;e;n;n;n",
            "西施": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e",
            "越王": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e;w;n;n;n;n;n;w;e;n;n",
            "采药人": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se",
            "采药少女": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne",
            "金衣剑士": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e;w;n;n;n;n;n;w;e;n;n",
            "铸剑师": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e;w;n;n;n;n;n;w;e;n;n;n",
            "锦衣剑士": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e;w;n;n",
            "青竹巨蟒": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s",
            "青衣剑士": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e;w;n;n;n;n",
            "青衣剑士": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e;w;n;n;n;n;n;w;e",
            "青衣剑士": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e;w;n;n;n;n;n;w;e;n",
            "风胡子": "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e"
        },
        '江陵': {
            "茶叶贩子": "jh 51",
            "书生": "jh 51;n",
            "乞丐": "jh 51;n;n;w;e;e;w",
            "王铁柱": "jh 51;n;n;n;n;n;n;n;nw;n",
            "水掌柜": "jh 51;n;n;n;n;n;n;n;nw;n",
            "妇人": "jh 51;n;n;w",
            "米店伙计": "jh 51;n;n;w",
            "米三江": "jh 51;n;n;w",
            "花小倩": "jh 51;n;n;w;e;e",
            "巡城参将": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e",
            "巡城府兵": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e",
            "客栈小二": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e",
            "酒保": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s",
            "江小酒": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s",
            "江老板": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n",
            "苦力": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e",
            "驿使": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e",
            "江陵府卫": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w",
            "萧劲": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n",
            "参将": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n",
            "江陵府兵": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s",
            "醉汉": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n",
            "金莲": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw",
            "邋遢男子": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w",
            "酒坊伙计": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e",
            "九叔": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e",
            "黑衣人": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n",
            "城门守卫": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e;w;w;w;e;e;n;n",
            "癞蛤蟆": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w",
            "霍无双": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e",
            "趟子手": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e;w;w;w;e;e",
            "余小鱼": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e",
            "渔老": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e",
            "分身": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e;w;w;w;e",
            "萧长河": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e;w;w;w;e",
            "脱不花马": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e;w;w;w",
            "周长老": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e;w;w;w",
            "截道恶匪": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e;w;w;w;e;e;n;n;nw;n",
            "漕帮好手": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e;w;w;w;e;e;n;n;nw;n;n;n",
            "扬子鳄": "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e;w;w;w;e;e;n;n;nw;n;n;n;e;e"
        }
    };
    //江湖悬红提示
    var xhts = {
        "雪亭镇": {
            "逄义": "逄义是封山派中和柳淳风同辈的弟子，但是生性好赌的他并不受师父及同门师兄弟的喜爱，因此辈分虽高，却未曾担任门中任何重要职务。逄义经常外出，美其名曰：旅行，实则避债，碍於门规又不敢做那打家劫舍的勾当，因此经常四处寻找赚钱发财的机会。",
            "店小二": "这位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。",
            "星河大师": "帅",
            "崔元基": "",
            "樵夫": "你看到一个粗壮的大汉，身上穿著普通樵夫的衣服。",
            "苦力": "一个苦力打扮的汉子在这里等人来雇用。",
            "黎老八": "这是位生性刚直，嫉恶如仇的丐帮八袋弟子。",
            "农夫": "你看到一位面色黝黑的农夫。",
            "老农夫": "你看到一位面色黝黑的农夫。",
            "疯狗": "一只浑身脏兮兮的野狗，一双眼睛正恶狠狠地瞪著你。",
            "魏无极": "魏无极是个博学多闻的教书先生，他年轻时曾经中过举人，但是因为生性喜爱自由而不愿做官，魏无极以教书为业，如果你付他一笔学费，就可以成为他的弟子学习读书识字。",
            "野狗": "一只浑身脏兮兮的野狗。",
            "蒙面剑客": "蒙着脸，身后背着一把剑，看上去武艺颇为不俗。",
            "庙祝": "这个老人看起来七十多岁了，看著他佝偻的身影，你忽然觉得心情沈重了下来。",
            "刘安禄": "刘安禄是淳风武馆的门房，除了馆主柳淳风没有人知道他的出身来历，只知到他的武艺不弱，一手快刀在这一带罕有敌手。",
            "武馆弟子": "你看到一位身材高大的汉子，正在辛苦地操练著。",
            "李火狮": "李火狮是个孔武有力的大块头，他正在训练他的弟子们习练「柳家拳法」。",
            "柳淳风": "柳淳风是个相当高大的中年儒生，若不是从他腰间挂著的「玄苏剑」你大概猜不到眼前这个温文儒雅的中年人竟是家大武馆的馆主。",
            "柳绘心": "柳绘心是淳风武馆馆主柳淳风的独生女。",
            "安惜迩": "安惜迩是个看起来相当斯文的年轻人，不过有时候会有些心不在焉的样子，雪亭镇的居民对安惜迩都觉得有点神秘莫测的感觉，为什麽他年纪轻轻就身为一家大钱庄的老板，还有他一身稀奇古怪的武功，所幸安惜迩似乎天性恬淡，甚至有些隐者的风骨，只要旁人不去惹他，他也绝不会去招惹旁人。",
            "醉汉": "一个喝得醉醺醺的年轻人。。。。。",
            "收破烂的": "这个人不但自己收破烂，身上也穿得破烂不堪。",
            "王铁匠": "王铁匠正用铁钳夹住一块红热的铁块放进炉中。打孔",
            "杨掌柜": "杨掌柜是这附近相当有名的大善人，常常施舍草药给付不起药钱的穷人。此外他的医术也不错，年轻时曾经跟著山烟寺的玄智和尚学医，一般的伤寒小病直接问他开药吃比医生还灵。",
            "花不为": "此人前几年搬到雪亭镇来，身世迷糊。",
            "杜宽": "杜宽担任雪亭驿的驿长已经有十几年了，虽然期间有几次升迁的机会，但是他都因为舍不得离开这个小山村而放弃了，雪亭镇的居民对杜宽的风评相当不错，常常会来到驿站跟他聊天。",
            "杜宽宽": "不要杀我~~~~~~~~~~"
        },
        "洛阳": {
            "农夫": "一个戴着斗笠，正在辛勤劳作的农夫。",
            "守城士兵": "一个守卫洛阳城的士兵",
            "客商": "长途跋涉至此的客商。",
            "蓑衣男子": "身穿蓑衣坐在船头的男子，头上的斗笠压得很低，你看不见他的脸。",
            "乞丐": "一个穿着破破烂烂的乞丐",
            "金刀门弟子": "这人虽然年纪不大，却十分傲慢。看来金刀门是上梁不正下梁歪。",
            "王霸天": "王霸天已有七十来岁，满面红光，颚下一丛长长的白须飘在胸前，精神矍铄，左手呛啷啷的玩着两枚鹅蛋大小的金胆。",
            "庙祝": "洛神庙的庙祝",
            "老乞丐": "一个穿着破破烂烂的乞丐",
            "地痞": "洛阳城里的地痞，人见人恶。",
            "小贩": "起早贪黑养家糊口的小贩。",
            "郑屠夫": "一个唾沫四溅，满身油星的屠夫。看上去粗陋鄙俗，有些碍眼。",
            "何九叔": "丐帮5袋弟子，衣着干净，看起来是净衣派的。",
            "无赖": "洛阳城无赖，专靠耍赖撒泼骗钱。",
            "甄大海": "洛阳地痞无赖头领，阴险狡黠，手段极其卑鄙。",
            "红娘": "一个肥胖的中年妇女，以做媒为生。",
            "柳小花": "洛阳武馆馆主的女儿，身材窈窕，面若桃花，十分漂亮。性格却是骄纵任性，大小姐脾气。",
            "富家公子": "此人一副风流倜傥的样子，一看就是个不知天高地厚的公子哥。",
            "洪帮主": "他就是丐帮第十七任帮主，号称洪老爷子。",
            "游客": "来白冢游玩的人，背上的包袱里鼓鼓囊囊，不知道装了什么？",
            "绿袍老者": "一身绿袍的老人，除了满头白发，强健的身姿和矍铄的眼神都不像一位老者。",
            "护卫": "大户人家的护卫，一身劲装。",
            "山贼": "隐藏在密林中打家劫舍的贼匪。",
            "白面书生": "书生打扮的中年男子，手中的折扇隐露寒光。",
            "守墓人": "负责看守白冢的老人，看起来也是有些功夫的。",
            "凌云": "败剑山庄少庄主，跟着父亲云游四海。",
            "凌中天": "好游山玩水的败剑山庄庄主。",
            "盗墓贼": "以盗窃古墓财宝为生的人。",
            "黑衣文士": "看样子很斯文，不像会欺负人哦～",
            "黑衣女子": "一身紧身黑衣将其身体勾勒的曲线毕露，黑纱遮住了面容，但看那剪水双眸，已经足以勾魂",
            "马倌": "这是是客栈的马倌，正在悉心照料客人的马匹。",
            "黑衣打手": "一身黑衣的打手，脚下功夫还是有点的。",
            "小偷": "混迹在赌坊里的小偷。",
            "张逍林": "来洛阳游玩的游客，被困在银钩赌坊一段时间了。",
            "玉娘": "肌肤如白玉般晶莹的美人，不知道在这赌坊雅舍中等谁？",
            "守园老人": "守护牡丹园的老人。因为洛阳城地痞不少，所以这守园老人可不轻松。",
            "赛牡丹": "人称赛牡丹，自然是个美人儿啦~",
            "鲁长老": "鲁长老虽然武功算不得顶尖高手，可是在江湖上却颇有声望。因为他在丐帮中有仁有义，行事光明磊落，深得洪帮主的器重。",
            "陈扒皮": "据洛阳城中最小气的人，号称陈扒皮，意思是见了谁都想赚个小便宜。",
            "卖花姑娘": "她总是甜甜的微笑，让人不忍拒绝她篮子里的鲜花。",
            "刘守财": "洛阳城的财主，开了一家钱庄，家财万贯。",
            "守城武将": "一个守卫洛阳城的武将",
            "李元帅": "吃了败仗的元帅逃在此密室，却不知是为了什么。",
            "疯狗": "一只四处乱窜的疯狗，顶着一身脏兮兮的的毛发。",
            "青竹蛇": "一条全身翠绿的毒蛇，缠绕在竹枝上。",
            "布衣老翁": "一身布衣，面容慈祥的老人。",
            "萧问天": "虽然身居陋室，衣着朴素，眼神的锐利却让人不能忽视他的存在。",
            "藏剑楼首领": "一名看上去风度非凡之人，正背手闭目养神中好像等候什么。",
        },
        "长安": {
            "胡商": " ",
            "城门卫兵": " ",
            "无影卫": " ",
            "紫衣追影": " ",
            "禁卫统领": " ",
            "城门禁卫": " ",
            "蓝色城门卫兵": " ",
            "血手天魔": " ",
            "看门人": " ",
            "钦官": " ",
            "先锋大将": " ",
            "霍骠姚": " ",
            "江湖大盗": " ",
            "李贺": " ",
            "云梦璃": " ",
            "游客": " ",
            "捕快统领": " ",
            "捕快": " ",
            "刀僧卫": " ",
            "镇魂使": " ",
            "招魂师": " ",
            "说书人": " ",
            "客栈老板": " ",
            "游四海": " ",
            "糖人张": " ",
            "高铁匠": " ",
            "哥舒翰": " ",
            "若羌巨商": " ",
            "樊天纵": " ",
            "杨玄素": " ",
            "乌孙马贩": " ",
            "卫青": " ",
            "方秀珣": " ",
            "孙三娘": " ",
            "大宛使者": " ",
            "马夫": " ",
            "白衣少侠": " ",
            "玄甲卫兵": " ",
            "房玄龄": " ",
            "杜如晦": " ",
            "秦王": " ",
            "程知节": " ",
            "尉迟敬德": " ",
            "翼国公": " ",
            "独孤须臾": " ",
            "金甲卫士": " ",
            "独孤皇后": " ",
            "仇老板": " ",
            "顾先生": " ",
            "苗一郎": " ",
            "董老板": " ",
            "护国军卫": " ",
            "朱老板": " ",
            "王府小厮": " ",
            "王府总管": " ",
            "龟兹乐师": " ",
            "龟兹舞女": " ",
            "卓小妹": " ",
            "上官小婉": " "
        },
        "华山村": {
            "松鼠": "一只在松林里觅食的小松鼠。",
            "野兔": "正在吃草的野兔。",
            "泼皮": "好吃懒做的无赖，整天无所事事，欺软怕硬。",
            "小男孩": "扎着双髻的小男孩，正在杏林里跟小伙伴们捉迷藏。",
            "王老二": "看起来跟普通村民没什么不同，但一双眼睛却透着狡黠。",
            "村中地痞": "村内地痞，人见人恶。",
            "抠脚大汉": "坐在土地面前抠脚的汉子",
            "黑狗": "一只黑色毛发的大狗。凶恶的黑狗，张开的大嘴露出锋利的獠牙。",
            "青衣守卫": "身穿青衣的守卫，武功招式看起来有些眼熟。",
            "葛不光": "四十岁左右的中年男子，颇为好色。",
            "泼皮头子": "好吃懒做的无赖，整天无所事事，欺软怕硬。",
            "采花贼": "声名狼藉的采花贼，一路潜逃来到了华山村。",
            "冯铁匠": "这名铁匠看上去年纪也不大，却是一副饱经沧桑的样子。",
            "村民": "身穿布衣的村民",
            "朱老伯": "一位德高望重的老人，须发已经全白。",
            "方寡妇": "颇有几分姿色的女子，是个寡妇。",
            "剑大师": "宗之潇洒美少年举觞白眼望青天皎如玉树临风前",
            "方老板": "平日行踪有些诡秘，看来杂货铺并不是他真正的营生。",
            "跛脚汉子": "衣着普通的中年男子，右脚有些跛。",
            "云含笑": "眸含秋水清波流盼，香娇玉嫩，秀靥艳比花娇，指如削葱根，口如含朱丹，一颦一笑动人心魂。",
            "英白罗": "这是华山派弟子，奉师命下山寻找游玩未归的小师妹。",
            "刘三": "这一代远近闻名的恶棍，欺男霸女无恶不作",
            "曲姑娘": "这是一名身穿翠绿衣裳的少女，皮肤白皙，脸蛋清秀可爱。",
            "受伤的曲右使": "他已经深受重伤，半躺在地上。",
            "血尸": "这是一具极为可怖的男子尸体，只见他周身肿胀，肌肤崩裂，眼角、鼻子、指甲缝里都沁出了鲜血，在这片美丽的花海里，这具尸体的出现实在诡异至极。",
            "藏剑楼杀手": "极为冷酷无情的男人，手上不知道沾满了多少无辜生命的鲜血。",
            "毒蛇": "一条色彩斑斓的毒蛇",
            "丐帮长老": "丐帮长老，衣衫褴褛，满头白发，看起来精神不错。",
            "小狼": "出来觅食的小狼",
            "老狼": "在山上觅食的老狼",
            "土匪": "清风寨土匪",
            "土匪头目": "清风寨土匪头目",
            "玉牡丹": "这是一名看不出年龄的男子，一身皮肤又白又细，宛如良质美玉，竟比闺门处子都要光滑细腻许多。若不是高大身材和脸颊上青色胡茬，他可能会让大多女子汗颜。",
            "刘龟仙": "清风寨军事，诡计多端。",
            "萧独眼": "清风寨二当家，一次劫镖时被刺伤一目，自此成了独眼龙。",
            "刘寨主": "清风寨寨主，对手下极为严厉。",
            "米不为": "一名青年男子，衣衫上血迹斑斑，奄奄一息的躺在地上。"
        },
        "华山": {
            "孙驼子": "一面容猥琐可憎，让人不忍直视，脊背高高隆起的驼子。",
            "吕子弦": "青衣长袍的书生，前来华山游玩。",
            "女弟子": "她是华山派女弟子，不施脂粉，衣着素雅。",
            "豪客": "一名满脸彪悍之色的江湖豪客",
            "游客": "这是一名来华山游玩的中年男子，背着包裹。",
            "公平子": "这是一位仙风道骨的中年道人，早年云游四方，性好任侠，公正无私。",
            "山贼": "拦路抢劫的山贼",
            "白二": "山贼头目，看起来很强壮。",
            "李铁嘴": "李铁嘴是个买卜算卦的江湖术士，兼代客写书信、条幅。",
            "赵辅徳": "负责打理群仙观的老人",
            "猿猴": "华山上的猿猴，时常骚扰过路人",
            "剑宗弟子": "华山剑宗弟子",
            "蒋天赐": "华山派传人。",
            "海昊天": "他是华山派剑宗派的第一高手。",
            "吴竟陵": "他是华山派剑宗派的第一高手。",
            "大松鼠": "一只在松林里觅食的小松鼠。",
            "许之瑶": "华山派掌门的爱女。她看起来十多岁，容貌秀丽，虽不是绝代美人，也别有一番可人之处。",
            "六猴儿": "六猴儿身材很瘦，又长的尖嘴猴腮的，但别看他其貌不扬，他在同门中排行第六，是华山派年轻一代中的好手。",
            "令狐大师哥": "他是华山派的大师兄，英气逼人。",
            "风老前辈": "这便是当年名震江湖的华山名宿。他身著青袍，神气抑郁脸如金纸。身材瘦长，眉宇间一直笼罩着一股淡淡的忧伤神色。",
            "英黑罗": "英白罗是岳不群的第八位弟子",
            "魔教喽喽": "日月神教小喽喽喽",
            "卢大哥": "日月神教教众",
            "史老三": "日月神教教众",
            "闵老二": "日月神教教众",
            "戚老四": "日月神教教众",
            "葛长老": "日月神教教众",
            "小林子": "气宗传人小林子，实力已是非同凡响。",
            "陈飞鱼": "此人整天拿着算盘，身材高大，长得很胖，但别看他其貌不扬，他在同门中排行第五，是华山派年轻一代中的好手。",
            "史望月": "同门中排行第四，是华山派年轻一代中的好手。",
            "华山弟子": "华山派门下的第子",
            "蒙面剑客": "手握长剑的蒙面人",
            "黑衣人": "戴着神秘的黑衣人，压低的帽檐遮住的他的面容。",
            "许秋雨": "华山掌门，他今年四十多岁，素以温文尔雅著称。",
            "舒奇": "华山派小弟子",
            "小猴": "这是一只调皮的小猴子，虽是畜牲，却喜欢模仿人样。",
            "劳朝元": "他就是华山排行第二的弟子。",
            "蓝怜云": "华山派掌门的夫人，眉宇间还少不了年轻时的英气。",
            "梁迎阳": "他就是华山排行第三的弟子。",
            "陶钧": "陶钧是岳不群的第七位弟子",
            "赵太平": "林师弟是华山众最小的一个弟子。",
            "小尼姑": "一个娇俏迷人的小尼姑。"
        },
        "扬州": {
            "官兵": "守城的官兵，相貌可长得不好瞧。",
            "花店伙计": "花店的伙计，正忙碌地给花淋水。",
            "大黑马": "一匹受惊的大黑马，一路狂奔到了闹市街头。",
            "铁匠": "看起来很强壮的中年男子",
            "双儿": "柔善良，善解人意，乖巧聪慧，体贴贤惠，清秀可人，腼腆羞涩，似乎男人喜欢的品质都集中在她身上了。",
            "黑狗子": "扬州街头人见人恶的地痞，嘴角一颗黑色痦子，看起来极为可憎。",
            "武馆护卫": "一名武馆护卫，专门对付那些想混进来闹事的人。",
            "武馆弟子": "在武馆拜师学艺的弟子，看来还是会些基本功。",
            "方不为": "武馆管家，馆中大小事务都需要向他禀报。",
            "王教头": "一名武馆内的教头，专门负责教新手武功。",
            "神秘客": "一名四十岁左右的中年男子，脸上一道刀疤给他平添了些许沧桑。",
            "范先生": "武馆账房先生，为人极为谨慎，账房钥匙通常带在身上。",
            "陈有德": "这就是武馆馆主，紫金脸庞，面带威严，威武有力，站在那里就象是一座铁塔。",
            "古三通": "一名看起来和蔼的老人，手里拿着一个旱烟袋，据说跟馆主颇有渊源。",
            "黄掌柜": "这就是武馆馆主，紫金脸庞，面带威严，威武有力，站在那里就象是一座铁塔。",
            "游客": "来扬州游玩的游客，背上的包裹看起来有些重。",
            "账房先生": "满脸精明的中年男子，手里的算盘拨的飞快。",
            "小飞贼": "一个年级尚幼的飞贼。",
            "飞贼": "一身黑色劲装，黑巾蒙面，眼露凶光。",
            "艺人": "一名四海为家的卖艺人，满脸沧桑。",
            "空空儿": "一个满脸风霜之色的老乞丐。",
            "马夫人": "一名体格魁梧的妇人，看起来极为彪悍。",
            "润玉": "买花少女，手中的花篮里装着时令鲜花。",
            "流氓": "扬州城里的流氓，经常四处游荡，调戏妇女。",
            "刘步飞": "龙门镖局的镖师，正在武庙里祭拜。",
            "马员外": "马员外是扬州有名的善人，看起来有点郁郁不乐。",
            "毒蛇": "一条毒蛇草丛窜出，正昂首吐信虎视眈眈地盯著你。",
            "扫地僧": "一名看起来很普通的僧人",
            "柳碧荷": "来禅智寺上香的女子，颇有几分姿色。",
            "张三": "看起来很邋遢的道士，似乎有些功夫。",
            "火工僧": "禅智寺中专做杂事的火工僧，身体十分地强壮",
            "书生": "一个摇头晃脑正在吟诗的书生。",
            "李丽君": "女扮男装的女子，容颜清丽，孤身一身住在魁星阁的阁楼上。",
            "小混混": "扬州城里的小混混，整天无所事事，四处游荡。",
            "北城门士兵": "看守城门的士兵",
            "青衣门卫": "浅月楼门口的侍卫。",
            "玉娇红": "浅月楼的老板娘，看似年不过三十，也是一个颇有姿色的女子。她抬起眼来，黛眉轻扫，红唇轻启，嘴角勾起的那抹弧度仿佛还带着丝丝嘲讽。当她眼波一转，流露出的风情似可让人忘记一切。红色的外袍包裹着洁白细腻的肌肤，她每走一步，都要露出细白水嫩的小腿。脚上的银铃也随着步伐轻轻发出零零碎碎的声音。",
            "赵明诚": "当朝仆射，也是一代名士，致力于金石之学，幼而好之，终生不渝。",
            "青楼小厮": "这是一个青楼的小侍从，不过十五六岁。",
            "苏小婉": "名满天下的第一琴姬，苏小婉是那种文人梦中的红颜知己。这样美貌才智具备的女子，怕是世间几百年才能出现一位。曾有人替她惋惜，说如若她是一大家闺秀，或许也能寻得一志趣相投之人，也会有“赌书消得泼茶香”的美谈。即使她只是一贫家女子，不读书亦不学艺，纵使是貌胜西子，或许仍可安稳一生。然而命运时常戏弄人，偏偏让那如花美眷落入淤泥，误了那似水流年。本想为一人盛开，却被众人窥去了芳颜。可她只是微微一笑，说道：『寻一平凡男子，日出而作日落而息，相夫教子，如湮没于历史烟尘中的所有女子一般。那样的生活，不是我做不到，只是不愿意。没有燃烧过的，只是一堆黑色的粉末，哪里能叫做烟火？』",
            "恶丐": "看守城门的士兵",
            "顽童": "一个顽皮的小童。",
            "唐老板": "广陵当铺老板，肩宽体壮，看起来颇为威严。",
            "云九天": "他是大旗门的掌刑长老，最是严厉不过。",
            "柳文君": "茶社老板娘，扬州闻名的才女，姿色娇美，精通音律，善弹琴。许多文人墨客慕名前来，茶社总是客满为患。",
            "茶社伙计": "提着茶壶的伙计，目露精光，看起来不简单。",
            "醉仙楼伙计": "这是醉仙楼伙计，看起来有些功夫。",
            "丰不为": "一个常在酒楼混吃混喝的地痞，不知酒店老板为何不将他逐出。",
            "张总管": "一名中年男子，目露凶光。",
            "计无施": "一名剑眉星目的白衣剑客。",
            "胡神医": "这就是江湖中有名的胡神医，看起来很普通。",
            "胖商人": "一名衣着华丽，体态臃肿，手脚看起来极短的中年男子。",
            "冼老板": "醉仙楼老板，能将这家祖传老店买下来，其来历应该没那么简单。",
            "赤练仙子": "她生得极为美貌，但冰冷的目光让人不寒而栗。",
            "白老板": "玉器店老板，对珍宝古玩颇为熟稔。",
            "衙役": "扬州官衙衙役，看起来一脸疲态。",
            "公孙岚": "扬州官衙有名的神捕，据说曾经抓获不少江湖大盗。",
            "程大人": "扬州知府，脸色阴沉，微有怒色，",
            "楚雄霸": "江湖有名的江洋大盗，五短身材，貌不惊人。",
            "朱先生": "这就是当今大儒朱先生。",
            "书生（书院）": "一个摇头晃脑正在吟诗的书生。",
            "少林恶僧": "因嗜酒如命，故从少林叛出，顺便盗取些许经书以便拿来换酒。",
            "船运东主": "此人一身黝黑的皮肤，几道深深的岁月的沟壑在他脸上烙下了印记。深邃凹进的眼眶中显露出干练的眼神。显露出不凡的船上阅历。"
        },
        "丐帮": {
            "左全": "这是位豪爽大方的丐帮七袋弟子，看来是个北地豪杰。",
            "裘万家": "这是位衣著邋塌，蓬头垢面的丐帮二袋弟子",
            "梁长老": "梁长老是丐帮出道最久，武功最高的长老，在武林中享名已久。丐帮武功向来较强，近来梁长老一力整顿，更是蒸蒸日上。",
            "何宏生": "他是丐帮新近加入的弟子，可也一步步升到了五袋。他长的极其丑陋，脸上坑坑洼洼",
            "莫不收": "这是位衣著邋塌，蓬头垢面的丐帮三袋弟子。",
            "藏剑楼统领": "此人似乎是这群人的头目，正在叮嘱手下办事。",
            "何不净": "这是位衣著邋塌，蓬头垢面的丐帮七袋弟子",
            "马俱为": "这是位武艺精强，却沉默寡言的丐帮八袋弟子。",
            "余洪兴": "这是位笑眯眯的丐帮八袋弟子，生性多智，外号小吴用。"
        },
        "乔阴县": {
            "守城官兵": "这是个正在这里站岗的守城官兵，虽然和许多武林人物比起来，官兵们的武功实在稀松平常，但是他们是有组织、有纪律的战士，谁也不轻易地招惹他们。",
            "卖饼大叔": "一个相貌朴实的卖饼大叔，憨厚的脸上挂著和蔼的笑容。",
            "陆得财": "陆得财是一个浑身脏兮兮的老丐，一副无精打采要死不活的样子，可是武林中人人都识得他身上打著二十三个结的皮酒囊，这不但是「花紫会」龙头的信物，更是名镇漠南的「黑水伏蛟」独门兵器，只不过陆得财行踪诡密，据说各处随时都有七、八的他的替身在四处活动，所以你也很难确定眼前这个陆得财到底是不是真的。",
            "卖包子的": "这个卖包子的小贩对你微微一笑，说道：热腾腾的包子，来一笼吧",
            "武官": "一位相貌威武的武官，独自一个人站在这里发呆，似乎正有什麽事困扰著他。",
            "怪人": "体型与小孩一般，脸上却满是皱纹，头发已经掉光。",
            "汤掌柜": "汤掌柜是这家大酒楼的主人，别看他只是一个小小的酒楼老板，乔阴县境内除了知县老爷以外，恐怕就属他最财大势大。",
            "家丁": "一个穿著家人服色的男子，必恭必敬地垂手站在一旁。",
            "贵公子": "一个相貌俊美的年轻贵公子正优雅地欣赏著窗外的景物。",
            "酒楼守卫": "一个身穿蓝布衣的人，从他锐利的眼神跟神情，显然是个练家子。",
            "书生": "一个看起来相当斯文的书生，正拿著一本书摇头晃脑地读著。",
            "丫鬟": "一个服侍有钱人家小姐的丫鬟，正无聊地玩弄著衣角。",
            "官家小姐": "一个看起来像是有钱人家的女子，正在这里游湖。",
            "乾瘪老太婆": "这个老太婆怀中抱了个竹篓，似乎在卖什麽东西，也许你可以跟她问问价钱？",
            "妇人": "一个衣饰华丽的妇人正跪在这里虔诚地膜拜著。",
            "骆云舟": "骆云舟本是世家公子，因喜爱诗酒剑法，不为家族中人所偏爱。因此他年少离家，常年在外漂泊，时至今日，倒是武有所成，在文学的造诣上，也是深不可测了。",
            "藏剑楼长老": "一名谈吐不凡的中年男子，备受手下尊崇",
            "藏剑楼学者": "此人文质彬彬，手持一本书册，正不断的翻阅似乎想在里面找到想要的答案。"
        },
        "峨眉山": {
            "白猿": "这是一头全身白色毛发的猿猴。",
            "文虚师太": "她是峨眉派的“文”辈弟子。",
            "看山弟子": "一个女弟子，手上拿着一把长剑。",
            "文寒师太": "她是峨眉派的“文”辈弟子。",
            "文玉师太": "她是峨眉派的“文”辈弟子。",
            "巡山弟子": "一个拿着武器，有点气势的巡山弟子。",
            "邱锦元": "他今年二十岁，乃是武当第三代中出类拔萃的人物。",
            "小女孩": "这是个小女孩。",
            "小贩": "峨眉山上做点小生意的小贩。",
            "静洪师太": "她是峨眉派的“静”辈弟子。",
            "静雨师太": "她是峨眉派的“静”辈弟子。",
            "女孩": "这是个少女，虽然只有十二、三岁，身材已经开始发育。",
            "尼姑": "这是一个年轻尼姑。",
            "小尼姑": "一个年纪赏小的尼姑。",
            "静玄师太": "她是峨眉派的“静”辈弟子。",
            "贝锦瑟": "她是峨嵋派的第四代俗家弟子。",
            "毒蛇": "一条剧毒的毒蛇。",
            "护法弟子": "她是一位年轻的师太。是灭绝石台座前的护法弟子。",
            "护法大弟子": "她是一位年轻的师太。是灭绝石台座前的护法弟子。",
            "静慈师太": "这是一位年纪不算很大的师太。",
            "灭绝掌门": "她是峨嵋派的第三代弟子，现任峨嵋派掌门人。",
            "方碧翠": "她是峨嵋派的第四代俗家弟子。",
            "传令兵": "钓鱼城派往长安求援的传令兵，行色匆匆，满面尘土。",
            "运输兵": "负责运送器械的士兵。",
            "斥候": "负责侦查敌情的军士",
            "军械官": "管理军械库的一位中年军官，健壮有力。",
            "神箭手": "钓鱼城守城大军的神箭手，百步穿杨，箭无虚发。",
            "耶律霸": "辽国皇族后裔，蒙古宰相耶律楚材之子，金狼军主帅。他骁勇善战，精通兵法，凭借着一手堪可开山破岳的好斧法杀得武林中人无人可挡闻之色变。视天波杨门为心腹之患欲处之而后快。",
            "先锋军士": "攻城大军的先锋军士，满脸凶狠，却也掩饰不住疲乏之色。",
            "先锋敌将": "攻城先锋大将，长期毫无进展的战事让他难掩烦躁。",
            "赤豹死士": "攻城大军的赤豹营死士，战力蛮横，重盔重甲，防御极好。",
            "守城军士": "守城的军士，英勇强悍，不畏生死。",
            "黑鹰死士": "攻城大军的黑鹰营死士，出手极准。",
            "金狼死士": "攻城大军将领的近身精锐。",
            "金狼大将": "攻城大将，曾是江湖上一等一的好手。",
            "粮库主薄": "管理粮库的军官，双眼炯炯有神，一丝一毫的细节都牢记于心。",
            "参谋官": "守军参谋军官，负责传递消息和提出作战意见。",
            "王坚": "钓鱼城守城大将，智勇双全，有条不紊地指挥着整座城市的防御工作。",
            "藏剑楼剑客": "此人手持长剑，正虎视眈眈的留神周围，准备伺机而动。"
        },
        "恒山": {
            "山盗": "一个盘踞山林的盗匪。",
            "小娟": "恒山派俗家弟子，脸上没有一丝表情，让人望而却步。",
            "戒嗔大师": "虽着一身袈裟，但一脸络腮胡让他看起来颇有些凶悍。",
            "郑婉儿": "恒山派俗家弟子，看起来清丽可人。",
            "敲钟婆婆": "一身黑衣，头发虽已花白，但俏丽的容颜却让人忍不住多看两眼",
            "云问天": "身背行囊的游客，看起来会些功夫。",
            "柳云烟": "一身短装的女子，头戴纱帽，一张俏脸在面纱后若隐若现，让人忍不住想掀开面纱瞧个仔细。",
            "石高达": "一名身份可疑的男子，最近常在山上游荡。",
            "公孙浩": "一名行走五湖四海的游侠，看起来功夫还不错。",
            "不可不戒": "曾经是江湖上有名的采花大盗，被不戒和尚用药迷倒，剪掉了作案工具，剃度后收为徒弟。",
            "山蛇": "一条吐着红舌头的毒蛇",
            "问心师太": "恒山派白云庵庵主，外刚内和，脾气虽然暴躁，心地却极慈祥。",
            "心和": "恒山派大弟子",
            "心清": "恒山派二弟子",
            "小师太": "恒山入门弟子",
            "吸血蝙蝠": "这是一只黑色的吸血蝙蝠",
            "问过师太": "恒山派掌门，心细如发，虽然平时极少出庵，但于江湖上各门各派的人物，无一不是了如指掌，其武功修为极高。",
            "神教杀手": "日月神教杀手，手段极其凶残。",
            "魔教杀手": "魔教杀手，一张黄脸让人过目难忘。",
            "魔教头目": "看起来风流倜傥的中年男子，魔教的小头目。",
            "嵩山弟子": "嵩山派弟子",
            "赵志高": "嵩山派高手，看起来颇有些修为。",
            "司马承": "嵩山派高手，看起来颇有些修为。",
            "沙江龙": "嵩山派高手，看起来颇有些修为。",
            "史师兄": "嵩山派大弟子，武功修为颇高。"
        },
        "武当山": {
            "土匪": "这家伙满脸横肉一付凶神恶煞的模样，令人望而生畏。",
            "土匪头": "这家伙满脸杀气，一付凶神恶煞的模样，令人望而生畏。",
            "王五": "一位邋邋遢遢的道士。",
            "野兔": "一只好可爱的小野兔。",
            "进香客": "一位前往武当山进香的人。",
            "邱锦元": "他今年二十岁，乃是武当第三代中出类拔萃的人物。",
            "知客道长": "他是武当山的知客道长。",
            "道童": "他是武当山的小道童。",
            "清虚道长": "他就是清虚道长。他今年四十岁，主管武当派的俗事。",
            "练功弟子": "一位正在练功的青年弟子，但似乎很不耐烦。",
            "邱元清": "他就是张三丰的大弟子、武当七侠之首。身穿一件干干净净的灰色道袍。他已年过六十，身材瘦长，满脸红光。恬淡冲和，沉默寡言。",
            "俞莲舟": "他就是张三丰的二弟子俞莲舟。他今年五十岁，身材魁梧，气度凝重。虽在武当七侠中排名第二，功夫却是最精。",
            "张三丰": "他就是武当派开山鼻祖、当今武林的泰山北斗，中华武功承先启后、继往开来的大宗师。身穿一件污秽的灰色道袍，不修边幅。身材高大，年满百岁，满脸红光，须眉皆白。",
            "张松溪": "他就是张三丰的四弟子张松溪。他今年四十岁，精明能干，以足智多谋著称。",
            "小翠": "这是个年年龄不大的小姑娘，但宽松的道袍也遮不住她过早发育的身体。一脸聪明乖巧，满口伶牙俐齿。见有人稍微示意，便过去加茶倒水。",
            "俞二侠": "服下丹药之后的他武功似乎提升了不少，实力不容小觑。",
            "蜜蜂": "这是一只蜜蜂，正忙着采蜜。",
            "小蜜蜂": "这是一只蜜蜂，正忙着采蜜。",
            "猴子": "这只猴子在在桃树间跳上跳下，还不时津津有味地啃几口着蜜桃。",
            "布衣弟子": "遇剑阁的一位弟子，不知是哪个长老门下的。",
            "剑童": "遇剑阁的一名剑童，长得十分可爱。",
            "剑遇安": "一位似乎身重剧毒的老前辈，但仍能看出其健康之时武功不凡。"
        },
        "晚月庄": {
            "蝴蝶": "一只翩翩起舞的小蝴蝶哦!",
            "彩衣少女": "小姑娘是晚月庄的女弟子，虽说身形单薄，可眼神里透出的傲气让人感到并不好欺负。",
            "婢女": "一名婢女，长的到也清秀。",
            "蓝止萍": "蓝止萍是一个十分出色的美女，她弹的一手琵琶更是闻名千里，许多王侯子弟，富商豪客都为她天下无双的美貌与琴艺倾倒。",
            "蓝雨梅": "蓝雨梅是晚月庄主蓝止萍的养女，由於庄主不信任男子，因此晚月庄接待外宾的工作向来由她负责。",
            "芳绫": "她看起来像个小灵精，头上梳两个小包包头。她坐在地上，看到你看她便向你作了个鬼脸!你想她一定是调皮才会在这受罚!",
            "昭仪": "她看起来非常可爱。身材玲珑有致，曲线苗条。第一眼印象，你觉的她舞蹈一定跳的不错，看她的一举一动有一种说不出的流畅优雅！",
            "昭蓉": "她长得十分漂亮！让你忍不住多瞧她几眼，从她身上你闻到淡淡的香气。她很有礼貌的向你点头，优雅的动作，轻盈的步伐，好美哦!",
            "苗郁手": "她看起来很有活力，两眼明亮有神。给你一种巾帼不让须眉的气势，但刚毅之中似又隐含著女孩子有的娇柔。",
            "圆春": "她是惜春的妹妹，跟姐姐从小就在晚月庄长大。因为与双亲失散，被庄主收留。平常帮忙庄内琐碎事务。",
            "惜春": "她看起来成熟中带有一些稚气。飘逸的长发十分迷人。她是个孤儿，从小与妹妹圆春被庄主收留，她很聪明，在第四代弟子中算是武功很出色的一个。",
            "凤凰": "火神「凤凰」乃勇士寒於的魂魄所化成的十三个精灵之一。由於其奇异神迹，被晚月庄供奉为护庄神兽。",
            "金仪彤": "她国色天香，娇丽无伦；温柔娴静，秀绝人寰。可惜眉心上有一道地煞纹干犯紫斗，恐要玉手染血，浩劫武林。",
            "瑷伦": "她已是步入老年，但仍风采依旧。",
            "曲馥琪": "她国色天香，娇丽无伦；温柔娴静，秀绝人寰。她姿容绝美，世所罕见。从她身旁你闻道一寒谷幽香。",
            "梦玉楼": "一个风尘仆仆的侠客。。",
            "安妮儿": "无描述",
            "虞琼衣": "无描述",
            "龙韶吟": "无描述",
            "阮欣郁": "无描述"
        },
        "水烟阁": {
            "天邪虎": "这是一只天邪派的灵兽「天邪虎」，火红的毛皮上有著如白银般的白纹，湛蓝色的眼珠中散发出妖异的光芒。",
            "水烟阁武士": "这是一个水烟阁武士。",
            "董老头": "於兰天武的亲兵，追随於兰天武多年，如今隐居于水烟阁，继续保护王爷",
            "水烟阁红衣武士": "这个人身著红色水烟阁武士服色，眼神十分锐利。",
            "水烟阁司事": "这个人看起来十分和蔼可亲，一双眼睛炯炯有神。",
            "萧辟尘": "萧辟尘自幼生长於岚城之中，看起来仙风道骨，不食人间烟火。",
            "潘军禅": "潘军禅是当今武林的一位传奇性人物，以他仅仅二十八岁的年龄竟能做到水烟阁执法使的职位，著实是一位不简单的人物。潘军禅是封山剑派掌门柳淳风的结拜义弟，但是他为人其实十分风趣，又好交朋友，丝毫不会摆出武林执法者的架子。",
            "於兰天武": "於兰天武是当今皇上的叔父，但是他毕生浸淫武学，甘愿抛弃荣华富以换取水烟阁传功使一职，以便阅读水烟阁中所藏的武学典籍，无论你有什麽武学上的疑难，他都能为你解答。"
        },
        "少林寺": {
            "山猪": "黑色山猪，披着一身刚硬的鬃毛。",
            "田鼠": "一只脏兮兮的田鼠，正在田间觅食。",
            "僧人": "少林寺僧人，负责看守山门。",
            "乔三槐": "勤劳朴实的山民，皮肤黝黑粗糙。",
            "小孩": "一个农家小孩，不知道在这里干什么。",
            "扫地和尚": "一名年轻僧人，身穿灰色僧衣。",
            "挑水僧": "一名年轻僧人，身穿灰色僧衣。",
            "洒水僧": "一名年轻僧人，身穿灰色僧衣。",
            "青松": "天真无邪的小沙弥",
            "小北": "这是一个天真活泼的小沙弥，刚进寺不久，尚未剃度",
            "小南": "青衣小沙弥，尚未剃度。",
            "巡寺僧人": "身穿黄色僧衣的僧人，负责看守藏经阁。",
            "进香客": "来寺里进香的中年男子，看起来满脸疲惫。",
            "狱卒": "一名看起来凶神恶煞的狱卒",
            "行者": "他是一位云游四方的行者，风霜满面，行色匆匆，似乎正在办一件急事。",
            "扫地僧": "一个年老的僧人，看上去老态龙钟，但是双目间却有一股精气？",
            "托钵僧": "他是一位未通世故的青年和尚，脸上挂着孩儿般的微笑。",
            "灰衣僧": "一名灰衣僧人，灰布蒙面，一双眼睛里透着过人的精明。",
            "守药僧": "一位守着少林药楼的高僧。",
            "砍柴僧": "一名年轻僧人，身穿灰色僧衣。",
            "澄": "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。",
            "虚": "他是一位身穿黄布袈裟的青年僧人。脸上稚气未脱，身手却已相当矫捷，看来似乎学过一点武功。",
            "禅师": "他是一位身材高大的中年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭灰布镶边袈裟，似乎有一身武艺。",
            "尊者": "他是一位两鬓斑白的老僧，身穿一袭青布镶边袈裟。他身材略高，太阳穴微凸，双目炯炯有神。",
            "比丘": "他是一位体格强健的壮年僧人，他身得虎背熊腰，全身似乎蕴含着无穷劲力。他身穿一袭白布黑边袈裟，似乎身怀武艺。",
            "玄难大师": "他是一位白须白眉的老僧，身穿一袭银丝棕黄袈裟。他身材极瘦，两手更象鸡爪一样。他双目微闭，一副没精打采的模样。",
            "玄慈大师": "他是一位白须白眉的老僧，身穿一袭金丝绣红袈裟。他身材略显佝偻，但却满面红光，目蕴慈笑，显得神完气足。",
            "玄痛大师": "他是一位白须白眉的老僧，身穿一袭银丝棕黄袈裟。他身材高大，两手过膝。双目半睁半闭，却不时射出一缕精光。",
            "玄苦大师": "他是一位白须白眉的老僧，身穿一袭银丝棕黄袈裟。他身材瘦高，脸上满布皱纹，手臂处青筋绽露，似乎久经风霜。",
            "玄悲大师": "他是一位白须白眉的老僧，身穿一袭银丝棕黄袈裟。他身材甚高，但骨瘦如柴，顶门高耸，双目湛然有神。",
            "盈盈": "魔教任教主之女，有倾城之貌，闭月之姿，流转星眸顾盼生辉，发丝随意披散，慵懒不羁。",
            "打坐僧人": "正在禅室打坐修行的僧人。",
            "守经僧人": "似乎常年镇守于藏经阁，稀稀疏疏的几根长须已然全白，正拿着经书仔细研究。",
            "小沙弥": "一名憨头憨脑的和尚，手里端着茶盘。",
            "黑衣大汉": "黑布蒙面，只露出一双冷电般的眼睛的黑衣大汉。",
            "萧远山": "契丹绝顶高手之一，曾随汉人学武，契丹鹰师总教头。",
            "白眉老僧": "少林寺高僧，武功修为无人能知。",
            "叶十二娘": "颇有姿色的中年女子，一双大眼里似乎隐藏着无穷愁苦、无限伤心。",
            "冷幽兰": "“吐秀乔林之下，盘根众草之旁。虽无人而见赏，且得地而含芳。”她如同空谷幽兰一般素雅静谧，纤巧削细，面若凝脂，眉目如画，神若秋水。",
            "慧轮": "少林寺弟子，虚竹的师傅，武功修为平平。",
            "达摩老祖": "这是少林派的开山祖师达摩老祖他身材高大，看起来不知有多大年纪，目光如炬，神光湛然！"
        },
        "唐门": {
            "高一毅": "五代十国神枪王后人，英气勃发，目含剑气。",
            "张之岳": "张宪之子，身形高大，威风凛凛",
            "唐门弟子": "这是唐门的弟子，不苟言笑。",
            "唐风": "唐风是唐门一个神秘之人，世人对他知之甚少。他在唐门默默地传授武艺，极少说话。",
            "唐看": "这是嫡系死士之一，一身的功夫却是不凡。",
            "唐怒": "唐门门主，在江湖中地位很高。",
            "方媃": "一个美丽的中年妇女，使得一手好暗器。",
            "唐鹤": "唐门中的高层，野心很大，一直想将唐门称霸武林。",
            "唐镖": "唐门中所有的绝门镖法，他都会用。",
            "唐缘": "人如其名，虽然年幼，但已是能看出美人胚子了。",
            "唐芳": "虽然是一个少女，但武艺已达精进之境界了。",
            "唐健": "他身怀绝技，心气也甚高。",
            "唐舌": "这是嫡系死士之一，一身的功夫却是不凡。用毒高手。",
            "唐情": "一个小女孩，十分可爱。",
            "唐刚": "一个尚未成年的小男孩，但也已经开始学习唐门的武艺。",
            "欧阳敏": "一个老妇人，眼睛中射出道道精光，一看就是武艺高强之人。",
            "程倾城": "曾是两淮一代最有天赋的年轻剑客，在观海庄追杀徽北剧盗之战一剑破对方七人刀阵，自此“倾城剑客”之名响彻武林。",
            "无名剑客": "一位没有名字的剑客，他很可能是曾经冠绝武林的剑术高手。",
            "默剑客": "这是一个沉默不语的剑客，数年来不曾说过一句话，专注地参悟着剑池绝学。",
            "竺霁庵": "湖竺家一门七进士，竺霁庵更是天子门生独占鳌头，随身喜携带一柄折扇。后因朝廷乱政心灰意冷，弃仕从武，更拜入少林成为俗家弟子。不足二十三岁便学尽少林绝学，武功臻至登峰造极之化境。后在燕北之地追凶时偶遇当时也是少年的鹿熙吟和谢麟玄，三人联手血战七日，白袍尽赤，屠尽太行十八夜骑。三人意气相投，志同道合，结为异姓兄弟，在鹿谢二人引荐下，终成为浣花剑池这一代的破军剑神。",
            "甄不恶": "他的相貌看起来是那么宁静淡泊、眼睛眉毛都透着和气，嘴角弯弯一看就象个善笑的人。他不象个侠客，倒象一个孤隐的君子。不了解的人总是怀疑清秀如竹的他怎么能拿起手中那把重剑？然而，他确是浣花剑派最嫉恶如仇的剑神，武林奸邪最惧怕的名字，因为当有恶人听到『甄不恶』被他轻轻从嘴里吐出，那便往往是他听到的最后三个字。",
            "素厉铭": "本是淮南渔家子弟，也并无至高的武学天赋，然其自幼喜观察鱼虫鸟兽，竟不自觉地悟出了一套气脉运转的不上心法。后因此绝学获难，被千夜旗余孽追杀，欲夺其心法为己用。上代封山剑主出手相救，并送至廉贞剑神门下，专心修炼内功，最终竟凭借其一颗不二之心，成就一代剑神。",
            "骆祺樱": "塞外武学世家骆家家主的千金，自幼聪慧无比，年纪轻轻便习尽骆家绝学，十八岁通过剑池试炼，成为剑池数百年来最年轻的七杀剑神。她双眸似水，却带着谈谈的冰冷，似乎能看透一切；四肢纤长，有仙子般脱俗气质。她一袭白衣委地，满头青丝用蝴蝶流苏浅浅绾起，虽峨眉淡扫，不施粉黛，却仍然掩不住她的绝世容颜。",
            "谢麟玄": "一袭青缎长衫，儒雅中透着英气，好一个翩翩公子。书香门第之后，其剑学领悟大多出自绝世的琴谱，棋谱，和书画，剑法狂放不羁，处处不合武学常理，却又有着难以言喻的写意和潇洒。他擅长寻找对手的薄弱环节，猛然一击，敌阵便土崩瓦解。",
            "祝公博": "曾经的湘西农家少年，全家遭遇匪祸，幸得上一代巨门剑神出手相救。剑神喜其非凡的武学天赋和不舍不弃的勤奋，收作关门弟子，最终得以承接巨门剑神衣钵。祝公博嫉恶如仇，公正不阿，视天道正义为世间唯一准则。",
            "黄衫少女": "身着鹅黄裙衫的少女，一席华贵的栗色秀发真达腰际，碧色的瞳孔隐隐透出神秘。她见你走过来，冲你轻轻一笑。",
            "鹿熙吟": "浣花剑派当世的首席剑神，他身形挺拔，目若朗星。虽然已是中年，但岁月的雕琢更显出他的气度。身为天下第一剑派的首席，他待人和善，却又不怒自威。百晓公见过鹿熙吟之后，惊为天人，三月不知如何下笔，最后据说在百晓图录贪狼剑神鹿熙吟那一页，只留下了两个字：不凡。他的家世出身是一个迷，从来无人知晓。",
            // "独臂剑客": "他一生守护在这，剑重要过他的生命。",
            // "无情剑客": "神秘的江湖侠客，如今在这里不知道作甚么。",
            // "黑衣剑客": "一身黑衣，手持长剑，就像世外高人一样。",
            // "青衣剑客": "一个风程仆仆的侠客。",
            // "紫衣剑客": "傲然而立，一脸严肃，好像是在瞪着你一样。"
        },
        "青城山": {
            "海公公": "海公公是皇帝身边的红人，不知为什么在此？",
            "仵作": "这是福州城外的一个仵作，专门检验命案死尸。",
            "恶少": "这是福州城中人见人恶的恶少，最好别惹。",
            "仆人": "恶少带着这个仆人，可是威风得紧的。",
            "屠夫": "一个卖肉的屠夫。",
            "酒店老板": "酒店老板是福州城有名的富人。",
            "店小二": "这个店小二忙忙碌碌，招待客人手脚利索。",
            "女侍": "这是一个女店小二，在福州城内，可是独一无二哦。",
            "酒店女老板": "一个漂亮的女老板，体格风骚。",
            "小甜": "花店中卖花的姑娘，花衬人脸，果然美不胜收。",
            "阿美": "此人三十来岁，专门福州驾驶马车。",
            "镖局弟子": "福威镖局的弟子。",
            "黄衣镖师": "这个镖师穿着一身黄衣。",
            "红衣镖师": "这个镖师穿着一身红衣。",
            "白衣镖师": "这个镖师穿着一身白衣。",
            "林师弟": "林师弟是华山众最小的一个弟子。",
            "兵器贩子": "一个贩卖兵器的男子，看不出有什么来历。",
            "读千里": "此人学富五车，摇头晃脑，只和人谈史论经。",
            "福州捕快": "福州的捕快，整天懒懒散散，不务正业。",
            "福州府尹": "此人官架子很大。",
            "童泽": "一个青年人，眼神有悲伤、亦有仇恨。",
            "木道神": "木道神是青城山的祖师级人物了，年纪虽大，但看不出岁月沧桑。",
            "童隆": "一个眼神凶恶的老头，身材有点佝偻。",
            "背剑老人": "背着一把普通的剑，神态自若，似乎有一股剑势与围于周身，退隐江湖几十年，如今沉醉于花道。",
            "游方郎中": "一个到处贩卖药材的赤脚医生。",
            "青城派弟子": "青城派的弟子，年纪刚过二十，武艺还过得去。",
            "青城弟子": "青城派的弟子，年纪刚过二十，武艺不错，资质上乘。",
            "侯老大": "他就是「英雄豪杰，青城四秀」之一，武功也远高同门。",
            "罗老四": "他就是「英雄豪杰，青城四秀」之一，武功也远高同门。",
            "吉人英": "他就是和申人俊焦孟不离的吉人通。",
            "贾老二": "他就是「青城派」中最为同门不齿、最下达的家伙。",
            "余大掌门": "青城派十八代掌门人",
            "黄袍老道": "一个穿着黄色道袍的老道士。",
            "青袍老道": "一个穿着青色道袍的老道士。",
            "于老三": "他就是「英雄豪杰，青城四秀」之一，武功也远高同门。",
            "林总镖头": "他就是「福威镖局」的总镖头。"
        },
        "逍遥林": {
            "蒙面人": "一个蒙着面部，身穿黑色夜行衣服的神秘人。",
            "吴统领": "他雅擅丹青，山水人物，翎毛花卉，并皆精巧。拜入师门之前，在大宋朝廷做过领军将军之职，因此大家便叫他吴统领",
            "冯巧匠": "据说他就是鲁班的后人，本来是木匠出身。他在精于土木工艺之学，当代的第一巧匠，设计机关的能手",
            "范棋痴": "他师从先生，学的是围棋，当今天下，少有敌手",
            "莫辩聪": "此人就是莫辩聪，据说他能言善辩，是一个武林中的智者，而他的武功也是无人能知。",
            "石师妹": "她精于莳花，天下的奇花异卉，一经她的培植，无不欣欣向荣。",
            "阎王敌": "据说他精通医理，可以起死回生。",
            "康琴癫": "只见他高额凸颡，容貌奇古，笑眯眯的脸色极为和谟，手中抱着一具瑶琴。",
            "苟书痴": "他看上去也是几十岁的人了，性好读书，诸子百家，无所不窥，是一位极有学问的宿儒，却是纯然一个书呆子的模样。",
            "李唱戏": "他看起来青面獠牙，红发绿须，形状可怕之极，直是个妖怪，身穿一件亮光闪闪的锦袍。他一生沉迷扮演戏文，疯疯颠颠，于这武学一道，不免疏忽了。",
            "常一恶": "马帮帮主，总管事，喜欢钱财的老狐狸。",
            "逍遥祖师": "他就是逍遥派开山祖师、但是因为逍遥派属于一个在江湖中的秘密教派，所以他在江湖中不是很多人知道，但其实他的功夫却是。。。。他年满七旬，满脸红光，须眉皆白。",
            "天山姥姥": "她乍一看似乎是个十七八岁的女子，可神情却是老气横秋。双目如电，炯炯有神，向你瞧来时，自有一股凌人的威严。"
        },
        "开封": {
            "皮货商": "这是一位皮货商，他自己也是满身皮裘。",
            "骆驼": "这是一条看起来有些疲惫的骆驼。",
            "新娘": "新郎官的未婚妻，被高衙内抓到此处。",
            "耶律夷烈": "辽德宗耶律大石之子，身材高大，满面虬髯。",
            "毒蛇": "一条剧毒的毒蛇。",
            "野猪": "一只四肢强健的野猪，看起来很饿",
            "黑鬃野猪": "这是一直体型较大的野猪，一身黑色鬃毛",
            "野猪王": "这是野猪比普通野猪体型大了近一倍，一身棕褐色鬃毛竖立着，看起来很凶残。",
            "鹿杖老人": "此人好色奸诈，但武功卓绝，乃是一代武林高手。经常与鹤发老人同闯武林。",
            "鹤发老人": "此人愚钝好酒，但武功卓绝，乃是一代武林高手。经常与鹿杖老人同闯武林。",
            "白面人": "一个套着白色长袍，带着白色面罩的人，犹如鬼魅，让人见之心寒",
            "官兵": "这是一名官兵，虽然武艺不能跟武林人士比，但他们靠的是人多力量大",
            "七煞堂弟子": "江湖上臭名昭著的七煞堂弟子，最近经常聚集在禹王台，不知道有什么阴谋。",
            "七煞堂打手": "七煞堂打手，还有点功夫的",
            "七煞堂护卫": "七煞堂护卫，似乎有一身武艺",
            "七煞堂护法": "武功高强的护卫，乃总舵主的贴身心腹。",
            "七煞堂总舵主": "这是七煞堂总舵主，看起道貌岸然，但眼神藏有极深的戾气。",
            "七煞堂堂主": "这是七煞堂堂主，看起来一表人才，不过据说手段极为残忍。",
            "小男孩": "一个衣衫褴褛，面有饥色的10多岁小男孩，正跪在大堂前，眼里布满了绝望！",
            "灯笼小贩": "这是一个勤劳朴实的手艺人，据说他做的灯笼明亮又防风。",
            "赵大夫": "赵大夫医术高明，尤其善治妇科各种疑难杂症。",
            "展昭": "这就是大名鼎鼎的南侠。",
            "欧阳春": "这是大名鼎鼎的北侠。",
            "包拯": "他就是朝中的龙图大学士包丞相。只见他面色黝黑，相貌清奇，气度不凡。让你不由自主，好生敬仰。",
            "新郎官": "这是一名披着大红花的新郎官，脸上喜气洋洋。",
            "混混张三": "他长得奸嘴猴腮的，一看就不像是个好人。",
            "铁翼": "他是大旗门的元老。他刚正不阿，铁骨诤诤。",
            "刘财主": "开封府中的富户，看起来脑满肠肥，养尊处优。",
            "武官": "这名武官看起来养尊处优，不知道能不能出征打仗。",
            "高衙内": "这就是开封府内恶名远扬的高衙内，专一爱调戏淫辱良家妇女。",
            "护寺僧人": "他是一位身材高大的青年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭白布镶边袈裟，似乎有一身武艺。",
            "烧香老太": "一个见佛烧香的老太太，花白的头发松散的梳着发髻，满是皱纹的脸上愁容密布",
            "张龙": "这便是开封府霍霍有名的捕头张龙，他身体强壮，看上去武功不错。",
            "孔大官人": "开封府中的富户，最近家中似乎有些变故。",
            "素斋师傅": "在寺庙中烧饭的和尚。",
            "泼皮": "大相国寺附近的泼皮，常到菜园中偷菜。",
            "老僧人": "一个老朽的僧人，脸上满是皱纹，眼睛都睁不开来了",
            "烧火僧人": "一名专职在灶下烧火的僧人",
            "玄衣少年": "一身玄衣的一个少年，似乎对开封的繁华十分向往。",
            "菜贩子": "一个老实巴交的农民，卖些新鲜的蔬菜",
            "王老板": "王家纸马店老板，为人热诚。",
            "码头工人": "这是一名膀大腰圆的码头工人，也许不会什么招式，但力气肯定是有的",
            "船老大": "看起来精明能干的中年男子，坚毅的眼神让人心生敬畏。",
            "落魄书生": "名衣衫褴褛的书生，右手摇着一柄破扇，面色焦黄，两眼无神。",
            "李四": "他长得奸嘴猴腮的，一看就不像是个好人。",
            "陈举人": "看起来有些酸腐的书生，正在查看贡院布告牌。",
            "张老知府": "开封的前任知府大人，如今虽退休多年，但仍然忧国忧民。",
            "富家弟子": "一个白白胖胖的年轻人，一看就知道是娇生惯养惯的富家子。",
            "天波侍卫": "天波府侍卫，个个均是能征善战的勇士！",
            "杨排风": "容貌俏丽，风姿绰约，自幼在天波杨门长大，性情爽直勇敢，平日里常跟穆桂英练功习武，十八般武艺样样在行。曾被封为“征西先锋将军”，大败西夏国元帅殷奇。因为是烧火丫头出身，且随身武器是烧火棍，所以被宋仁宗封为“火帅”。又因为，民间称赞其为“红颜火帅”。",
            "杨延昭": "杨延昭是北宋抗辽名将杨业的长子，契丹人认为北斗七星中的第六颗主镇幽燕北方，是他们的克星，辽人将他看做是天上的六郎星宿下凡，故称为杨六郎。",
            "侍女": "一个豆蔻年华的小姑娘，看其身手似也是有一点武功底子的呢。",
            "佘太君": "名将之女，自幼受其父兄武略的影响，青年时候就成为一名性机敏、善骑射，文武双全的女将。她与普通的大家闺秀不同，她研习兵法，颇通将略，把戍边御侵、保卫疆域、守护中原民众为己任，协助父兄练兵把关，具备巾帼英雄的气度。夫君边关打仗，她在杨府内组织男女仆人丫环习武，仆人的武技和忠勇之气个个都不亚于边关的士兵",
            "柴郡主": "六郎之妻，为后周世宗柴荣之女，宋太祖赵匡胤敕封皇御妹金花郡主。一名巾帼英雄、女中豪杰，成为当时著名的杨门女将之一，有当时天下第一美女之称。",
            "穆桂英": "穆柯寨穆羽之女，有沉鱼落雁之容，且武艺超群，巾帼不让须眉。传说有神女传授神箭飞刀之术。因阵前与杨宗保交战，穆桂英生擒宗保并招之成亲，归于杨家将之列，为杨门女将中的杰出人物。",
            "杨文姬": "乃天波杨门幺女。体态文秀儒雅、有惊鸿之貌，集万千宠爱于一身，被杨门一族视为掌上明珠。其武学集杨门之大成，却又脱胎于杨门自成一格，实属武林中不可多得的才女。",
            "赵虎": "这便是开封府霍霍有名的捕头赵虎，他身体强壮，看上去武功不错。",
            "踏青妇人": "春天出来游玩的妇人，略有姿色。",
            "平夫人": "方面大耳，眼睛深陷，脸上全无血色。",
            "恶狗": "这是一条看家护院的恶狗。",
            "平怪医": "他身材矮胖，脑袋极大，生两撇鼠须，摇头晃脑，形相十分滑稽。"
        },
        "光明顶": {
            "村民": "这是村落里的一个村名。",
            "沧桑老人": "这是一个满脸沧桑的老人。",
            "村妇": "一个村妇。",
            "老太婆": "一个满脸皱纹的老太婆。",
            "小男孩": "这是个七八岁的小男孩。",
            "神秘女子": "这是一个女子",
            "明教小圣使": "他是一个明教小圣使。",
            "闻旗使": "他是明教巨林旗掌旗使。",
            "韦蝠王": "明教四大护法之一，传说喜好吸人鲜血。",
            "彭散玉": "明教五散仙之一。",
            "明教小喽啰": "明教的一个小喽啰，看起来有点猥琐，而且还有点阴险。",
            "辛旗使": "他是明教烈焰旗掌旗使。",
            "布袋大师": "他是明教五散仙之一的布袋大师说不得，腰间歪歪斜斜的挂着几支布袋。",
            "颜旗使": "严垣是明教深土旗掌旗使。",
            "唐旗使": "他是明教白水旗掌旗使。",
            "周散仙": "明教五散仙之一",
            "庄旗使": "明教耀金旗掌旗使。",
            "杨左使": "明教光明左使。",
            "黛龙王": "她就是武林中盛传的紫衣龙王，她肤如凝脂，杏眼桃腮，容光照人，端丽难言。虽然已年过中年，但仍风姿嫣然。",
            "明教教众": "他是身材矮小，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一黑色圣衣，似乎有一身武艺",
            "九幽毒魔": "千夜旗至尊九长老之一，看似一个面容慈祥的白发老人，鹤发童颜，双手隐隐的黑雾却显露了他不世的毒功！",
            "九幽毒童": "负责管理九幽毒池的童子们，个个面色阴沉，残忍好杀。",
            "青衣女孩": "一个身着青衣的小女孩，被抓来此出准备炼毒之用，虽能感觉到恐惧，但双眼仍透出不屈的顽强。",
            "冷步水": "他是明教五散仙之一。在他僵硬的面孔上看不出一点表情。",
            "张散仙": "明教五散仙之一。长于风雅之做。",
            "冷文臻": "冷步水的侄子，较为自傲，且要面子。",
            "殷鹰王": "他就是赫赫有名的白眉鹰王，张大教主的外公，曾因不满明教的混乱，独自创立了飞鹰教，自从其外孙成为教主之后，便回归了明教",
            "谢狮王": "他就是赫赫有名的金发狮王，张大教主的义父，生性耿直，只因满心仇恨和脾气暴躁而做下了许多憾事。",
            "张教主": "年方二十多岁的年轻人。明教现今正统教主，武功集各家之长最全面，修为当世之罕见。",
            "范右使": "明教光明右使。",
            "小昭": "她双目湛湛有神，修眉端鼻，颊边微现梨涡，真是秀美无伦，只是年纪幼小，身材尚未长成，虽然容貌绝丽，却掩不住容颜中的稚气。",
            "蒙面人": "用厚厚面巾蒙着脸上的武士，看不清他的真面目"
        },
        "全真教": {
            "野马": "一匹健壮的野马。",
            "终南山游客": "一个来终南山游玩的游客。",
            "男童": "这是一个男童。",
            "全真女弟子": "这是一个女道姑。",
            "迎客道长": "他是全真教内负责接待客人的道士。",
            "程遥伽": "她长相清秀端庄。",
            "小道童": "他是全真教的一个小道童",
            "小道童": "一个全真教的小道童。",
            "练功弟子": "这是全真教的练功弟子。",
            "尹志平": "他是丘处机的得意大弟子尹志平，他粗眉大眼，长的有些英雄气概，在全真教第三代弟子中算得上年轻有为。身材不高，眉宇间似乎有一股忧郁之色。长的倒是长眉俊目，容貌秀雅，面白无须，可惜朱雀和玄武稍有不和。",
            "健马": "一匹健壮的大马",
            "李四": "这是一个中年道士。",
            "孙不二": "她就是全真教二代弟子中唯一的女弟子孙不二孙真人。她本是马钰入道前的妻子，道袍上绣着一个骷髅头。",
            "柴火道士": "一个负责柴火的道士。",
            "马钰": "他就是王重阳的大弟子，全真七子之首，丹阳子马钰马真人。他慈眉善目，和蔼可亲，正笑着看着你。",
            "重阳祖师": "他就是全真教的开山祖师，其身材消瘦，精神矍铄，飘飘然仿佛神仙中人",
            "郝大通": "他就是全真七子中的郝大通郝真人。他身材微胖，象个富翁模样，身上穿的道袍双袖皆无。",
            "老顽童": "此人年龄虽大但却顽心未改，一头乱糟糟的花白胡子，一双小眼睛透出让人觉得滑稽的神色。",
            "观想兽": "一只只有道家之所才有的怪兽",
            "王处一": "他就是全真七子之五王处一王真人。他身材修长，服饰整洁，三绺黑须飘在胸前，神态潇洒",
            "老道长": "这是一个年老的道人。",
            "青年弟子": "一个风程仆仆的侠客。",
            "谭处端": "他就是全真次徒谭处端谭真人，他身材魁梧，浓眉大眼，嗓音洪亮，拜重阳真人为师前本是铁匠出身。",
            "鹿道清": "他是全真教尹志平门下第四代弟子",
            "刘处玄": "他就是全真三徒刘处玄刘真人，他身材瘦小，但顾盼间自有一种威严气概。",
            "掌厨道士": "一个负责掌厨的道士。",
            "小麻雀": "一只叽叽咋咋的小麻雀。",
            "挑水道士": "这是全真教内负责挑水的道士。",
            "老人": "这是一个老人，在全真教内已有几十年了。",
            "蜜蜂": "一直忙碌的小蜜蜂。",
            "丘处机": "他就是江湖上人称‘长春子’的丘处机丘真人，他方面大耳，满面红光，剑目圆睁，双眉如刀，相貌威严，平生疾恶如仇。"
        },
        "古墓": {
            "天蛾": "蜜蜂的天敌之一。",
            "食虫虻": "食肉昆虫，蜜蜂的天敌之一。",
            "玉蜂": "这是一只玉色的蜜蜂，个头比普通蜜蜂大得多，翅膀上被人用尖针刺有字",
            "玉蜂": "这是一只玉色的蜜蜂，个头比普通蜜蜂大得多，翅膀上被人用尖针刺有字。",
            "毒蟒": "缺",
            "龙儿": "盈盈而站着一位秀美绝俗的女子，肌肤间少了一层血色，显得苍白异常。披著一袭轻纱般的白衣，犹似身在烟中雾里。",
            "林祖师": "她就是古墓派的开山祖师，虽然已经是四十许人，望之却还如同三十出头。当年她与全真教主王重阳本是一对痴心爱侣，只可惜有缘无份，只得独自在这古墓上幽居。",
            "孙婆婆": "这是一位慈祥的老婆婆，正看着你微微一笑。"
        },
        "白驼山": {
            "傅介子": "中原朝廷出使西域楼兰国的使臣，气宇轩昂，雍容华度，似也会一些武功。",
            "青衣盾卫": "身着青衣，手持巨盾，是敌军阵前的铁卫，看起来极难对付。",
            "飞羽神箭": "百发百中的神箭手，难以近身，必须用暗器武学方可隔空攻击",
            "银狼近卫": "主帅身侧的近卫，都是万里挑一的好手",
            "军中主帅": "敌军主帅，黑盔黑甲，手持长刀。",
            "玉门守将": "一位身经百战的将军，多年驻守此地，脸上满是大漠黄沙和狂风留下的沧桑。",
            "匈奴杀手": "匈奴人杀手，手持弯刀，眼露凶光。",
            "玉门守军": "玉门关的守卫军士，将军百战死，壮士十年归。",
            "玄甲骑兵": "黑盔黑甲的天策骑兵，连马也被锃亮的铠甲包裹着。",
            "车夫": "一名驾车的车夫，尘霜满面。",
            "天策大将": "天策府左将军，英勇善战，智勇双全。身穿黑盔黑甲，腰间有一柄火红的长刀。",
            "玄甲参将": "天策玄甲军的参将，双目专注，正在认真地看着城防图。",
            "凤七": "无影楼金凤堂堂主，武功卓绝自是不在话下，腕上白玉镯衬出如雪肌肤，脚上一双鎏金鞋用宝石装饰。",
            "慕容孤烟": "英姿飒爽的马车店女老板，汉族和鲜卑族混血，双目深邃，含情脉脉，细卷的栗色长发上夹着一个金色玉蜻蜓。",
            "醉酒男子": "此人看似已经喝了不少，面前摆着不下七八个空酒坛，两颊绯红，然而双目却仍是炯炯有神，身长不足七尺，腰别一把看似贵族名士方才有的长剑，谈笑之间雄心勃勃，睥睨天下。男子醉言醉语之间，似是自称青莲居士。",
            "马匪": "这是肆虐戈壁的马匪，长相凶狠，血债累累。",
            "花花公子": "这是个流里流气的花花公子。",
            "寡妇": "一个年轻漂亮又不甘寂寞的小寡妇。",
            "农民": "一个很健壮的壮年农民。",
            "小山贼": "这是个尚未成年的小山贼。",
            "雷震天": "雷横天的儿子，与其父亲不同，长得颇为英俊。",
            "山贼": "这是个面目可憎的山贼。",
            "侍杖": "他头上包着紫布头巾，一袭紫衫，没有一丝褶皱。",
            "雷横天": "这是个粗鲁的山贼头。一身膘肉，看上去内力极度强劲！",
            "金花": "一个年少貌美的姑娘。",
            "铁匠": "铁匠正用汗流浃背地打铁。",
            "舞蛇人": "他是一个西域来的舞蛇人。",
            "店小二": "这位店小二正笑咪咪地忙著招呼客人。",
            "村姑": "一个很清秀的年轻农村姑娘，挎着一只盖着布小篮子。",
            "小孩": "这是个农家小孩子",
            "樵夫": "一个很健壮的樵夫。",
            "农家妇女": "一个很精明能干的农家妇女。",
            "门卫": "这是个年富力强的卫兵，样子十分威严。",
            "仕卫": "这是个样子威严的仕卫。",
            "丫环": "一个很能干的丫环。",
            "欧阳少主": "他一身飘逸的白色长衫，手摇折扇，风流儒雅。",
            "李教头": "这是个和蔼可亲的教头。",
            "小青": "这是个聪明乖巧的小姑娘，打扮的很朴素，一袭青衣，却也显得落落有致。小青对人非常热情。你要是跟她打过交道就会理解这一点！",
            "黑冠巨蟒": "一只庞然大物，它眼中喷火，好象要一口把你吞下。",
            "金环蛇": "一只让人看了起毛骨悚然的金环蛇。",
            "竹叶青蛇": "一只让人看了起鸡皮疙瘩的竹叶青蛇。",
            "蟒蛇": "一只昂首直立，吐着长舌芯的大蟒蛇。",
            "教练": "这是个和蔼可亲的教练。",
            "陪练童子": "这是个陪人练功的陪练童子。",
            "管家": "一个老谋深算的老管家。",
            "白衣少女": "一个聪明伶俐的白衣少女。",
            "老毒物": "他是白驮山庄主，号称“老毒物”。",
            "肥肥": "一个肥头大耳的厨师，两只小眼睛不停地眨巴着。",
            "老材": "一个有名的吝啬鬼，好象他整日看守着柴房也能发财似的",
            "白兔": "一只雪白的小白兔，可爱之致。",
            "驯蛇人": "蛇园里面的驯蛇人，替白驼山庄驯养各种毒蛇。",
            "野狼": "一只独行的野狼，半张着的大嘴里露着几颗獠牙。",
            "雄狮": "一只矫健的雄狮，十分威风。",
            "狐狸": "一只多疑成性的狐狸。",
            "老虎": "一只斑斓猛虎，雄伟极了。",
            "张妈": "一个历经沧桑的老婆婆。"
        },
        "嵩山": {
            "脚夫": "五大三粗的汉子，看起来会些拳脚功夫。",
            "秋半仙": "一名算命道士，灰色道袍上缀着几个补丁。",
            "风骚少妇": "一个风骚的少妇，颇有几分姿色。",
            "锦袍老人": "神情威猛须发花白的老人，看起来武功修为颇高。",
            "柳易之": "朝廷通事舍人，负责传达皇帝旨意。",
            "卢鸿一": "一名布衣老者，慈眉善目，须发皆白。",
            "英元鹤": "这是一名枯瘦矮小的黑衣老人，一双灰白的耳朵看起来有些诡异。",
            "马帮精锐": "身材异常高大的男子，眼神中充满杀气，脸上满布虬龙似的伤疤。",
            "游客": "来嵩山游玩的男子，书生打扮，看来来颇为儒雅。",
            "吸血蝙蝠": "一只体型巨大的吸血蝙蝠。",
            "瞎眼剑客": "一名黑衣剑客，双面失明。",
            "瞎眼刀客": "一名黑衣刀客，双面失明。",
            "瞎眼老者": "这是一名黑衣瞎眼老者，看起来武功修为颇高。",
            "野狼": "山林觅食的野狼，看起来很饿。",
            "林立德": "在嵩阳书院进学的书生，看起来有些木讷。",
            "山贼": "拦路抢劫的山贼",
            "修行道士": "在嵩山隐居修行的道士",
            "黄色毒蛇": "一条吐舌蛇信子的毒蛇。",
            "麻衣刀客": "一身麻衣，头戴斗笠的刀客",
            "白板煞星": "没有鼻子，脸孔平平，像一块白板，看起来极为可怖",
            "小猴": "这是一只调皮的小猴子，虽是畜牲，却喜欢模仿人样。",
            "万大平": "嵩山弟子，看起来很普通。",
            "嵩山弟子": "这是一名嵩山弟子，武功看起来稀松平常。",
            "芙儿": "一名身穿淡绿衫子的少女，只见她脸如白玉，颜若朝华，真是艳冠群芳的绝色美人。",
            "麻衣汉子": "头戴斗笠，身材瘦长，一身麻衣的中年男子，看起来有些诡异。",
            "史师兄": "嵩山派大弟子，武功修为颇高。",
            "白头仙翁": "嵩山派高手，年纪不大，头花却已全白。",
            "左罗": "左掌门的侄子，武功平平，但多谋善断，有传闻说他是左掌门的亲生儿子。",
            "左挺": "冷面短髯，相貌堂皇的青年汉子。",
            "乐老狗": "这人矮矮胖胖，面皮黄肿，约莫五十来岁年纪，目神光炯炯，凛然生威，两只手掌肥肥的又小又厚。",
            "伙夫": "一名肥头大耳的伙夫，负责打理嵩山派一众大小伙食。",
            // "冷峻青年": "一个风程仆仆的侠客。",
            "沙秃翁": "这是一名秃头老者，一双鹰眼微闭。",
            "钟九曲": "脸白无须，看起来不像练武之人。",
            "陆太保": "面目凶光的中年汉子，虽是所谓名门正派，但手段极为凶残。",
            "高锦毛": "须发火红的中年汉子",
            "邓神鞭": "一名面容黯淡的老人，但看外表，很难想到他是一名内外皆修的高手。",
            "聂红衣": "一名体态风流的少妇，酥胸微露，媚眼勾人。",
            "左盟主": "身穿杏黄长袍，冷口冷面，喜怒皆不行于色，心机颇深。",
            "枯瘦的人": "身形枯瘦，似乎被困于此多年，但眼神中仍有强烈的生存意志"
        },
        "梅庄": {
            "柳府家丁": "这是杭州有名大户柳府的家丁，穿着一身考究的短衫，一副目中无人的样子。",
            "柳玥": "柳府二小姐，只见她眸含秋水清波流盼，香娇玉嫩，秀靥艳比花娇，指如削葱根，口如含朱丹，一颦一笑动人心魂，旖旎身姿在上等丝绸长裙包裹下若隐若现。听说柳府二千金芳名远扬，传闻柳府大小姐月夜逃婚，至今不知下落。",
            "老者": "一个姓汪的老者，似乎有什么秘密在身上。",
            "筱西风": "这是一名看起来很冷峻的男子，只见他鬓若刀裁，眉如墨画，身上穿着墨色的缎子衣袍，袍内露出银色镂空木槿花的镶边，腰上挂着一把长剑。",
            "武悼": "一个白发苍苍的老人，默默打扫着这万人景仰的武穆祠堂。",
            "梅庄护院": "一身家人装束的壮汉，要挂宝刀，看起来有些功夫。",
            "梅庄家丁": "一身家人装束的男子，看起来有些功夫。",
            "施令威": "一身家人装束的老者，目光炯炯，步履稳重，看起来武功不低。",
            "丁管家": "一身家人装束的老者，目光炯炯，步履稳重，看起来武功不低。",
            "黑老二": "这人虽然生的眉清目秀，然而脸色泛白，头发极黑而脸色极白，像一具僵尸的模样。据说此人酷爱下棋，为人工于心计。",
            "向左使": "这是一名身穿白袍的老人，容貌清癯，刻颏下疏疏朗朗一缕花白长须，身材高瘦，要挂弯刀。",
            "瘦小汉子": "脸如金纸的瘦小的中年男子，一身黑衣，腰系黄带。",
            "柳蓉": "这女子虽是一袭仆人粗布衣裳，却掩不住其俊俏的容颜。只见那张粉脸如花瓣般娇嫩可爱，樱桃小嘴微微轻启，似是要诉说少女心事。",
            "丁二": "这是一名满脸油光的中年男子，虽然其貌不扬，据说曾是京城御厨，蒸炒煎炸样样拿手。",
            "聋哑老人": "这是一名弯腰曲背的聋哑老人，须发皆白，满脸皱纹。据说他每天都去湖底地牢送饭。",
            "丹老四": "此人髯长及腹，一身酒气，据说此人极为好酒好丹青，为人豪迈豁达。",
            "上官香云": "这女子有着倾城之貌，闭月之姿，流转星眸顾盼生辉，发丝随意披散，慵懒不羁。她是江南一带有名的歌妓，据闻琴棋书画无不精通，文人雅士、王孙公子都想一亲芳泽。",
            "秃笔客": "这人身型矮矮胖胖，头顶秃得油光滑亮，看起来没有半点文人雅致，却极为嗜好书法。",
            "琴童": "这是一名青衣童子，扎着双髻，眉目清秀。",
            "黄老朽": "这是一名身型骨瘦如柴的老人，炯炯有神的双目却让内行人一眼看出其不俗的内力。",
            "黑衣刀客": "一身黑色劲装，手持大刀，看起来很凶狠。",
            "青衣剑客": "一身青衣，不知道练得什么邪门功夫，看起来脸色铁青。",
            "紫袍老者": "看起来气度不凡的老人，紫色脸膛在紫袍的衬托下显得更是威严。",
            "红衣僧人": "这人虽然身穿红色僧袍，但面目狰狞，看起来绝非善类。",
            "黄衫婆婆": "虽已满头白发，但眉眼间依旧可见年轻时的娟秀。",
            "地牢看守": "身穿灰布衣裳，脸色因为常年不见阳光，看起来有些灰白。",
            "地鼠": "一只肥大的地鼠，正在觅食。",
            "奎孜墨": "这是一名身穿黑衣的年轻男子，一张脸甚是苍白，漆黑的眉毛下是艺术按个深沉的眼睛，深沉的跟他的年龄极不相符。",
            "任教主": "这名老者身材甚高，一头黑发，穿的是一袭青衫，长长的脸孔，脸色雪白，更无半分血色，眉目清秀，只是脸色实在白得怕人，便如刚从坟墓中出来的僵尸一般。"
        },
        "泰山": {
            "镖师": "当地镖局的镖师，现在被狼军士兵团团围住，难以脱身。",
            "挑夫": "这青年汉子看起来五大三粗，估计会些三脚猫功夫。",
            "黄衣刀客": "这家伙满脸横肉，一付凶神恶煞的模样，令人望而生畏。",
            "瘦僧人": "他是一位中年游方和尚，骨瘦如柴，身上的袈裟打满了补丁。",
            "柳安庭": "这是个饱读诗书，却手无缚鸡之力的年轻书生。",
            "石云天": "生性豁达，原本是丐帮弟子，因为风流本性难改，被逐出丐帮。",
            "朱莹莹": "艳丽的容貌、曼妙的身姿，真是数不尽的万种风情。",
            "欧阳留云": "这是位中年武人，肩背长剑，长长的剑穗随风飘扬，看来似乎身怀绝艺。",
            "温青青": "这名女子神态娴静淡雅，穿着一身石青色短衫，衣履精致，一张俏脸白里透红，好一个美丽俏佳人。",
            "易安居士": "这是有“千古第一才女”之称的李清照，自幼生活优裕，其父李格非藏书甚丰，小时候就在良好的家庭环境中打下文学基础。少年时即负文学的盛名，她的词更是传诵一时。中国女作家中，能够在文学史上占一席地的，必先提李易安。她生活的时代虽在北宋南宋之间，却不愿意随着当时一般的潮流，而专意于小令的吟咏。她的名作象《醉花阴》，《如梦令》，有佳句象“花自飘零水自流，一种相思两处闲愁”等等，都脍炙人口。",
            "程不为": "此人出身神秘，常常独来独往，戴一副铁面具，不让人看到真面目，师承不明。",
            "吕进": "此人出身神秘，常常独来独往，戴一副铁面具，不让人看到真面目，师承不明。",
            "司马玄": "这是一名白发老人，慈眉善目，据说此人精通医术和药理。",
            "桑不羁": "此人身似猿猴，动作矫健，因轻功出众，江湖中难有人可以追的上他，故而以刺探江湖门派消息为生。",
            "鲁刚": "一名隐士，据闻此人精通铸剑。",
            "于霸天": "此人身材魁梧，身穿铁甲，看起来似乎是官府的人。",
            "神秘游客": "此人年纪虽不大，但须发皆白，一身黑袍，看起来气度不凡。",
            "海棠杀手": "这人的脸上看起来没有一丝表情，手里的刀刃闪着寒光。",
            "路独雪": "这人便是江湖有名的海棠杀手“三剑断命”，看起来倒也算是一表人才，只是双目透出的杀气却让人见之胆寒。",
            "铁云": "据说杀手无情便无敌，这人看起来风流倜傥，却是极为冷血之人。",
            "孔翎": "据说他就是海棠杀手组织的首领，不过看他的样子，似乎不像是一个能统领众多杀手的人。",
            "姬梓烟": "这是一名极为妖艳的女子，一身黑色的紧身衣将其包裹得曲线毕露，估计十个男人见了十个都会心痒难耐。",
            "柳兰儿": "这是一个看起来天真烂漫的少女，不过等她的剑刺穿你的身体时，你才会意识到天真是多么好的伪装。",
            "布衣男子": "这是一名身穿粗布衣服的男子，看起来很强壮。",
            "阮小": "这人五短身材，尖嘴猴腮。",
            "阮大": "这人五短身材，尖嘴猴腮。",
            "史义": "这人身穿粗布劲装，满脸络腮胡，双眼圆瞪，似乎随时准备发怒。",
            "司马墉": "这人穿着一身长袍，敏锐的双眼让人感觉到他的精明过人。",
            "林忠达": "这人看起来很普通，是那种见过后便会忘记的人。",
            "铁面人": "这人脸上蒙着一张黑铁面具，看不见他的模样，但面具后双眼却给人一种沧桑感。",
            "铁翼": "铁翼是铁血大旗门的元老。他刚正不阿，铁骨诤诤，如今被囚禁于此。",
            "黑衣人": "一个风程仆仆的侠客。",
            "李三": "此人无发无眉，相貌极其丑陋。",
            "仇霸": "此人独目秃顶，面目凶恶，来官府通缉要犯。",
            "平光杰": "这是一名身穿粗布衣服的少年，背上背着一个竹篓，里面放着一些不知名的药草。",
            "玉师弟": "此人一身道袍，看起来颇为狡诈。",
            "玉师兄": "这人面色灰白，双眼无神，看起来一副沉溺酒色的模样。",
            "玉师伯": "泰山掌门的师叔，此人看起来老奸巨猾。",
            "任娘子": "这是一名艳丽少妇，勾魂双面中透出一股杀气。",
            "黄老板": "双鞭客栈老板，看起来精明过人。",
            "红衣卫士": "一身红色劲装的卫士，看起来有些功夫。",
            "白飞羽": "这人算得上是一个美男子，长眉若柳，身如玉树。",
            "商鹤鸣": "这人生的有些难看，黑红脸膛，白发长眉，看起来有些阴郁。",
            "西门允儿": "这是一名极有灵气的女子，穿着碧绿纱裙。",
            "冯太监": "皇帝身边鹤发童颜的太监，权势滔天，眼中闪着精光。",
            "钟逍林": "这是一名魁梧的中年男子，看起来内家功夫造诣不浅。",
            "西门宇": "这是一名身材伟岸的中年男子，看起来霸气逼人。",
            "黑衣密探": "这是一名蒙面密探。",
            "毒蛇": "这是一条斑斓的大蛇，一眼看去就知道有剧毒",
            "筱墨客": "这人脸上挂着难以捉摸的笑容，看起来城府极深。",
            "铁恶人": "铁毅同父异母之弟，为了「大旗门」宝藏，时常算计其大哥铁毅。",
            "迟一城": "泰山弟子，剑眉星目，身姿挺拔如松。",
            "泰山弟子": "这是一名青衣弟子，手里握着一把长剑。",
            "建除": "泰山掌门的弟子，身形矫健，看起来武功不错。",
            "天柏": "泰山掌门的师弟，看起来英气勃勃。",
            "天松": "泰山掌门的师弟，嫉恶如仇，性子有些急躁。",
            "玉师叔": "泰山掌门的师叔，处事冷静，极有见识。",
            "泰山掌门": "此人为泰山掌门，此人看起来正气凛然。"
        },
        "铁血大旗门": {
            "陈子昂": "一个狂放书生，显是出自豪富之家，轻财好施，慷慨任侠。",
            "小贩": "这小贩左手提着个篮子，右手提着个酒壶。篮上系着铜铃，不住叮铛作响。",
            "酒肉和尚": "这是一个僧不僧俗不俗，满头乱发的怪人",
            "宾奴": "阴宾所养的波斯猫",
            "渔夫": "这是一个满脸风霜的老渔夫。",
            "叶缘": "刚拜入大旗门不久的青年。",
            "老婆子": "她面容被岁月侵蚀，风雨吹打，划出了千百条皱纹，显得那么衰老但一双眼睛，却仍亮如闪电，似是只要一眼瞧过去，任何人的秘密，却再也休想瞒过她。",
            "罗少羽": "刚拜入大旗门不久的青年。",
            "青衣少女": "一个身材苗条，身着青衣的少女。",
            "日岛主": "日岛主乃大旗门第七代掌门人云翼之妻，因看不惯大旗门人对其n妻子的无情，开创常春岛一派，以收容世上所有伤心女子。",
            "潘兴鑫": "刚到拜入大旗门不久的青年。",
            "铁掌门": "他是大旗门的传人。",
            "夜皇": "他容光焕发，须发有如衣衫般轻柔，看来虽是潇洒飘逸，又带有一种不可抗拒之威严。",
            "橙衣少女": "她身穿轻纱柔丝，白足如霜，青丝飘扬。",
            "阴宾": "她面上蒙着轻红罗纱，隐约间露出面容轮廓，当真美得惊人，宛如烟笼芍药，雾里看花",
            "朱藻": "风流倜傥",
            "隐藏-X衣少女": "她身穿轻纱柔丝，白足如霜，青丝飘扬。",
            "卓三娘": "闪电卓三娘轻功世无双，在碧落赋中排名第三。",
            "风老四": "风梭风九幽，但他现在走火入魔，一动也不能动了。",
            "小白兔": "小白兔白又白两只耳朵竖起来。",
            "水灵儿": "她满面愁容，手里虽然拿着本书，却只是呆呆的出神。",
            "隐藏-叶缘": "一个风程仆仆的侠客。",
            "隐藏-罗少羽": "一个风程仆仆的侠客。",
            "隐藏-潘兴鑫": "一个风程仆仆的侠客。"
        },
        "大昭寺": {
            "小绵羊": "一只全身雪白的的绵羊。",
            "大绵羊": "一只全身雪白的的绵羊。",
            "小羊羔": "一只全身雪白的的绵羊。",
            "牧羊女": "一个牧羊女正在放羊。",
            "草原狼": "一直凶残的草原狼。",
            "白衣少年": "年纪轻轻的少年，武功了得，却心狠手辣。",
            "李将军": "一个玄甲黑盔，身披白色披风的少年将军，虽面容清秀，却不掩眉宇之间的果决和坚毅。",
            "突厥先锋大将": "东突厥狼军先锋大将，面目凶狠，身披狼皮铠甲，背负长弓，手持丈余狼牙棒。",
            "神秘甲士": "身披重甲，手持长戟，不许旁人前进一步。",
            "地宫暗哨": "黑衣黑靴，一旦有外人靠近地宫，便手中暗器齐发。",
            "守山力士": "他们的双拳，便是镇守陵寝最好的武器。",
            "城卫": "一个年青的藏僧。",
            "紫衣妖僧": "附有邪魔之气的僧人。",
            "塔僧": "一个负责看管舍利塔的藏僧。",
            "关外旅客": "这是一位来大昭寺游览的旅客。",
            "护寺喇嘛": "一个大招寺的藏僧。",
            "护寺藏尼": "一个大招寺的藏尼。",
            "灵空": "灵空高僧是大昭寺现在的主持。",
            "葛伦": "葛伦高僧已在大昭寺主持多年。男女弟子遍布关外。",
            "塔祝": "这个老人看起来七十多岁了，看著他佝偻的身影，你忽然觉得心情沈重了下来。",
            "胭松": "胭松是葛伦高僧的得意二弟子。",
            "余洪兴": "这是位笑眯眯的丐帮八袋弟子，生性多智，外号小吴用。",
            "陶老大": "这是整天笑咪咪的车老板，虽然功夫不高，却也过得自在。",
            "店老板": "这位店老板正在招呼客人",
            "野狗": "一只浑身脏兮兮的野狗。",
            "樵夫": "你看到一个粗壮的大汉，身上穿著普通樵夫的衣服。",
            "收破烂的": "一个收破烂的。",
            "乞丐": "一个满脸风霜之色的老乞丐。",
            "疯狗": "一只浑身脏兮兮的野狗，一双眼睛正恶狠狠地瞪著你。",
            "卜一刀": "他是个看起来相当英俊的年轻人，不过点神秘莫测的感觉。",
            "镇魂将": "金盔金甲的护陵大将。",
            "头狼": "狼群之王，体型硕大，狼牙寒锋毕露。"
        },
        "黑木崖": {
            "怪人": "看起来像是只妖怪一般。",
            "黑熊": "一只健壮的黑熊。",
            "店小二": "这是一个忙忙碌碌的小二。",
            "客店老板": "一个贼眉鼠眼的商人。",
            "冉无望": "一个面容俊朗的少年，却眉头深锁，面带杀气。",
            "船夫": "一个船夫。",
            "魔教弟子": "这家伙满脸横肉，一付凶神恶煞的模样，令人望而生畏。",
            "见钱开": "此人十分喜好钱财。",
            "贾布": "他使得一手好钩法。",
            "鲍长老": "他一身横练的功夫，孔武有力。",
            "葛停香": "他天生神力，勇猛无比。",
            "上官云": "他使得一手好剑法。",
            "桑三娘": "她使得一手好叉法。",
            "罗烈": "他使得一手好枪法。",
            "童长老": "他使得一手好锤法",
            "王诚": "他使得一手好刀法。",
            "蓝色魔教犯人": "一个魔教的犯人，他们都是到魔教卧底的各大门派弟子事泄被捕的",
            "红色魔教犯人": "一个魔教的犯人，他们都是到魔教卧底的各大门派弟子事泄被捕的",
            "青色魔教犯人": "一个魔教的犯人，他们都是到魔教卧底的各大门派弟子事泄被捕的",
            "紫色魔教犯人": "一个魔教的犯人，他们都是到魔教卧底的各大门派弟子事泄被捕的",
            "花想容": "她使得一手好刀法。",
            "曲右使": "他使得一手好钩法。",
            "张矮子": "他使得一手好武功。",
            "张白发": "他使得一手好掌法。",
            "赵长老": "她使得一手好叉法。",
            "独孤风": "此人是用剑高手。",
            "杨延庆": "他使得一手好枪法。",
            "范松": "他使得一手好斧法。",
            "巨灵": "他使得一手好锤法。",
            "楚笑": "虽是女子，但武功绝不输于须眉。",
            "莲亭": "他身形魁梧，满脸虬髯，形貌极为雄健。",
            "东方教主": "他就是日月神教教主。号称无人可敌。"
        },
        "星宿海": {
            "梅师姐": "此人一脸干皱的皮肤，双眼深陷，犹如一具死尸。",
            "天梵密使": "天梵宗主密使，遮住了容貌，神秘莫测。",
            "波斯商人": "一个高鼻蓝眼的波斯商人。他看着你脸上露出狡猾的笑容。",
            "矮胖妇女": "一个很胖的中年妇女。",
            "唐冠": "唐门中的贵公子，父亲是唐门中的高层，看起来极自负",
            "波斯老者": "一个老者来自波斯，似乎是一个铁匠，脸上看起来有点阴险的感觉。",
            "买卖提": "买卖提是个中年商人，去过几次中原，能讲一点儿汉话",
            "阿拉木罕": "她身段不肥也不瘦。她的眉毛像弯月，她的眼睛很多情",
            "伊犁马": "这是一匹雄壮的母马，四肢发达，毛发油亮。",
            "巴依": "一个风尘仆仆的侠客。。",
            "小孩": "这是个小孩子",
            "阿凡提": "他头上包着头巾，长着向上翘的八字胡，最喜欢捉弄巴依、帮助穷人。他常给别人出谜语。",
            "牧羊人": "一个老汉，赶着几十只羊。",
            "紫姑娘": "她就是丁老怪弟子紫姑娘。她容颜俏丽，可眼神中总是透出一股邪气。",
            "采药人": "一个辛苦工作的采药人。",
            "玄衣刀妖": "一个白发老人，身着紫衣，眼神凶狠，太阳穴隆起，显是有不低的内力修为。",
            "周女侠": "身形修长，青裙曳地。皮肤白嫩，美若天人。恍若仙子下凡，是人世间极少的绝美女子。其武功修为十分了得。",
            "毒蛇": "一只有着三角形脑袋的蛇，尾巴沙沙做响。",
            "牦牛": "这是一头常见的昆仑山野牦牛",
            "雪豹": "这是一头通体雪白的昆仑山雪豹，极为罕有",
            "天狼师兄": "他就是丁老怪的三弟子。",
            "出尘师弟": "他就是丁老怪的八弟子。他身才矮胖，可手中握的钢杖又长又重。",
            "星宿派号手": "他是星宿派的吹号手。他手中拿着一只铜号，鼓足力气一脸沉醉地吹着。",
            "星宿派钹手": "他是星宿派的击钹手。他手中拿着一对铜钹，一边敲一边扯着嗓子唱些肉麻的话。",
            "星宿派鼓手": "他是星宿派的吹鼓手。他面前放着一只铜鼓，一边敲一边扯着嗓子唱些肉麻的话。",
            "狮吼师兄": "他就是丁老怪的二弟子。他三十多岁，狮鼻阔口，一望而知不是中土人士",
            "摘星大师兄": "他就是丁老怪的大弟子、星宿派大师兄。他三十多岁，脸庞瘦削，眼光中透出一丝乖戾之气。",
            "丁老怪": "他就是星宿派开山祖师、令正派人士深恶痛绝的星宿老怪丁老怪。可是他看起来形貌清奇，仙风道骨。",
            "采花子": "采花子是星宿派的一个小喽罗，武功虽不好，但生性淫邪，经常奸淫良家妇女，是官府通缉的犯人，故而星宿派名义上也不承认有这个弟子。",
            "铁尸": "这人全身干枯，不像一个人，倒像是一具干尸。"
        },
        "茅山": {
            "野猪": "一只笨笨的野猪",
            "阳明居士": "阳明居士潇洒俊逸，一代鸿儒，学识渊博且深谙武事，有「军神」之美誉，他开创的「阳明心学」更是打破了朱派独霸天下的局面。",
            "道士": "茅山派的道士，着一身黑色的道袍",
            "孙天灭": "孙天灭外号六指小真人，是林忌最喜爱的徒弟。他尽得林忌真传！",
            "道灵": "道灵真人是林忌的师弟，也是上代掌门的关门弟子，虽然比林忌小了几岁，但道行十分高深，「谷衣心法」已修炼到极高境界了。",
            "护山使者": "护山使者是茅山派的护法，着一身黑色的道袍",
            "林忌": "林忌是一位道行十分高深的修道者，你发现他的眼珠一个是黑色的，一个是金色的，这正是「谷衣心法」修炼到极高境界的徵兆。",
            "万年火龟": "一只尺许大小，通体火红的乌龟。",
            "张天师": "他是龙虎山太乙一派的嫡系传人，他法力高强，威名远播。",
            "心魔": "缺"
        },
        "桃花岛": {
            "陆废人": "他是黄岛主的三弟子。",
            "神雕大侠": "他就是神雕大侠，一张清癯俊秀的脸孔，剑眉入鬓。",
            "老渔夫": "一个看上去毫不起眼的老渔夫，然而……",
            "桃花岛弟子": "一个二十多岁的小伙子，身板结实，双目有神，似乎练过几年功夫。",
            "哑仆人": "又聋又哑，似乎以前曾是一位武林高手。",
            "哑仆": "这是一个桃花岛的哑仆。他们全是十恶不赦的混蛋，黄药师刺哑他们，充为下御。",
            "丁高阳": "曲三的一位好友，神态似乎非常着急。",
            "曲三": "他是黄岛主的四弟子。",
            "黄岛主": "他就是黄岛主，喜怒无常，武功深不可测。",
            "蓉儿": "她是黄岛主的爱女，长得极为漂亮。",
            "傻姑": "这位姑娘长相还算端正，就是一副傻头傻脑的样子。",
            "戚总兵": "此乃东南海防驻军主将，英武之气凛凛逼人，威信素著，三军皆畏其令，从不敢扰民。"
        },
        "铁雪山庄": {
            "樵夫": "一个砍柴为生的樵夫。",
            "欧冶子": "华夏铸剑第一人，许多神剑曾出自他手。",
            "老张": "铁血山庄的门卫。",
            "雪鸳": "神秘的绿衣女子，似乎隐居在铁雪山庄，无人能知其来历。",
            "铁少": "铁山是一个风流倜傥的公子。",
            "雪蕊儿": "雪蕊儿肤白如雪，很是漂亮。在这铁雪山庄中，和铁少过着神仙一般的日子。",
            "小翠": "铁雪山庄的一个丫鬟。",
            "白袍公": "一个一袭白衣的老翁。",
            "黑袍公": "一个一袭黑衣的老翁。",
            "陳小神": "快活林里小神仙，一个眉清目秀的江湖新人，据说机缘巧合下得到了不少江湖秘药，功力非同一般，前途不可限量。",
            "剑荡八荒": "虬髯大汉，要凭一把铁剑战胜天下高手，八荒无敌。",
            "魏娇": "女扮男装的青衣秀士，手持长剑，英姿飒爽，好一个巾帼不让须眉。",
            "神仙姐姐": "白裙袭地，仙气氤氲，武林中冉冉升起的新星，誓要问鼎至尊榜，执天下之牛耳。",
            "小飞": "『不落皇朝』的二当家，为人洒脱风趣，酷爱蹴鞠，酒量超群，以球入道。传闻只要饮下三杯佳酿，带醉出战，那么不论是踢全场、转花枝、大小出尖，流星赶月，他都能凭借出色的技艺独占鳌头。",
            "寒夜·斩": "一副浪荡书生打扮的中年剑客，据说他也曾是一代高手。",
            "他": "这人的名字颇为奇怪，只一个字。行为也颇为怪诞，总是藏在花丛里。不过武功底子看起来却一点都不弱。",
            "出品人◆风云": "江湖豪门『21世纪影业』的核心长老之一，与帮主番茄携手打下一片江山，江湖中威震一方的豪杰。",
            "二虎子": "一个已过盛年的江湖高手，像是曾有过辉煌，却早已随风吹雨打去。他曾有过很多名字，现在却连一个像样的都没有留下，只剩下喝醉后嘴里呢喃不清的“大师”，“二二二”，“泯恩仇”，你也听不出个所以然。",
            "老妖": "一个金眼赤眉的老人，传说来自遥远的黑森之山，有着深不可测的妖道修为。",
            "欢乐剑客": "『地府』威震江湖的右护法，手中大斧不知道收留了多少江湖高手的亡魂。",
            "黑市老鬼": "江湖人无人不知，无人不晓的黑市老鬼头，包裹里无奇不有，无所不卖，只要你有钱，什么稀奇的货品都有，比如黑鬼的凝视，眼泪，咆哮，微笑。。。一应俱全。",
            "纵横老野猪?": "两件普通的黑布衣衫罩在身上，粗犷的眉宇间英华内敛，目光凝实如玉，显出极高的修行。《参同契》有云：「故铅外黑，内怀金华，被褐怀玉，外为狂夫」。目睹此人，可窥一斑。",
            "无头苍蝇": "一个佝偻着身躯的玄衣老头，从后面看去，似是没有头一样，颇为骇人。",
            "神弑☆铁手": "武林中数一数二的后起之秀，和所有崛起的江湖高手一样，潜心修炼，志气凌云。",
            "禅师": "一个退隐的禅师，出家人连名字都忘怀了，只剩下眼中隐含的光芒还能看出曾是问鼎武林的高手。",
            "道一": "后起之秀，面若中秋之月，色如春晓之花，鬓若刀裁，眉如墨画。",
            "采菊隐士": "一个与世无争的清修高人，无心江湖，潜心修仙。用「美男子」来形容他一点也不为过。身高近七尺，穿着一袭绣绿纹的紫长袍，外罩一件亮绸面的乳白色对襟袄背子。",
            "【人间】雨修": "曾经的江湖第二豪门『天傲阁』的大当家，武勇过人，修为颇深。怎奈何门派日渐式微，江湖声望一日不如一日，让人不禁扼腕叹息，纵使一方霸主也独木难支。",
            "男主角◆番茄": "江湖豪门『21世纪影业』的灵魂，当世绝顶高手之一，正在此潜心修练至上武学心法，立志要在这腥风血雨的江湖立下自己的声威！",
            "剑仙": "白须白发，仙风道骨，离世独居的高人。",
            "冷泉心影": "『不落皇朝』当之无愧的君主和领袖，致力破除心中习武障魔，参得无上武道。头上戴着束发嵌宝紫金冠，齐眉勒着二龙抢珠金抹额，如同天上神佛降临人世。",
            "汉时叹": "身穿水墨色衣、头戴一片毡巾，生得风流秀气。『地府』帮的开山祖师，曾是武功横绝一时的江湖至尊。手中暗器『大巧不工』闻者丧胆，镖身有字『挥剑诀浮云』。",
            "烽火戏诸侯": "身躯凛凛，相貌堂堂。一双眼光射寒星，两弯眉浑如刷漆。胸脯横阔，有万夫难敌之威风。武林至尊榜顶尖剑客，一人一剑，手持『春雷』荡平天剑谷，天下武林无人不晓！神剑剑身一面刻“凤年”，一面刻着“天狼”。",
            "阿不": "器宇轩昂，吐千丈凌云之志气。?白衣黑发，双手负于背后，立于巨岩之顶，直似神明降世??。这是武林至尊榜第一高手，不世出的天才剑客，率『纵横天下』帮独尊江湖。手持一柄『穿林雨』长枪，枪柄上刻着一行小字：『归去，也无风雨也无晴』。"
        },
        "慕容山庄": {
            "家丁": "一个穿着仆人服装的家丁。",
            "邓家臣": "他是慕容家四大家臣之首，功力最为深厚。",
            "朱姑娘": "这是个身穿红衣的女郎，大约十七八岁，一脸精灵顽皮的神气。一张鹅蛋脸，眼珠灵动，别有一番动人风韵。",
            "慕容老夫人": "她身穿古铜缎子袄裙，腕带玉镯，珠翠满头，打扮的雍容华贵，脸上皱纹甚多，眼睛迷迷朦朦，似乎已经看不见东西。",
            "慕容侍女": "一个侍女，年龄不大。",
            "公冶家臣": "他是慕容家四大家臣之二，为人稳重。",
            "包家将": "他是慕容家四大家臣之三，生性喜欢饶舌。",
            "风波恶": "他是慕容家四大家臣之四，最喜欢打架，轻易却不服输。",
            "慕容公子": "他是姑苏慕容的传人，他容貌俊雅，风度过人，的确非寻常人可比。",
            "慕容家主": "他是姑苏慕容的传人，可以说是自慕容龙城以下武功最为杰出之人。不仅能贯通天下百家之长，更是深为精通慕容家绝技。",
            "小兰": "这是一个蔓陀山庄的丫环。",
            "严妈妈": "一个中年妇女，身上的皮肤黝黑，常年不见天日的结果。",
            "神仙姐姐": "她秀美的面庞之上，端庄中带有稚气，隐隐含着一丝忧色。见你注目看她不觉低头轻叹。只听得这轻轻一声叹息。霎时之间，你不由得全身一震，一颗心怦怦跳动。心想：“这一声叹息如此好听，世上怎能有这样的声音？”听得她唇吐玉音，更是全身热血如沸！",
            "王夫人": "她身穿鹅黄绸衫，眉目口鼻均美艳无伦，脸上却颇有风霜岁月的痕迹。",
            "小茗": "这是一个蔓陀山庄的丫环。",
            "船工小厮": "一位年轻的船工。表情看上去很消沉，不知道发生了什么。",
            "芳绫": "她看起来像个小灵精，头上梳两个小包包头。她坐在地上，看到你看她便向你作了个鬼脸!你想她一定是调皮才会在这受罚!",
            "无影斥候": "经常在孔府徘徊的斥候。",
            "柳掌门": "封山剑派掌门，看似中了某种迷香，昏昏沉沉的睡着。"
        },
        "大理": {
            "摆夷女子": "她是一个身着白衣的摆夷女子，长发飘飘，身态娥娜。",
            "士兵": "他是一个大理国禁卫军士兵，身着锦衣，手执钢刀，双目精光炯炯，警惕地巡视着四周的情形。",
            "武将": "他站在那里，的确有说不出的威风。",
            "台夷商贩": "一位台夷族的商贩，正在贩卖一竹篓刚打上来的活蹦乱跳的鲜鱼。",
            "乌夷商贩": "一位乌夷族的商贩，挑着一担皮毛野味在贩卖。",
            "土匪": "这家伙满脸横肉一付凶神恶煞的模样，令人望而生畏。",
            "猎人": "一位身强力壮的乌夷族猎手。",
            "皮货商": "一位来远道而来的汉族商人，来此采购皮货。",
            "牧羊女": "她是一个摆夷牧羊女子。",
            "牧羊人": "他一个摆夷牧羊男子。",
            "破嗔": "他是一个和尚，是黄眉大师的二弟子。",
            "破疑": "他是一个和尚，是黄眉大师的大弟子。",
            "段恶人": "他身穿一件青布长袍，身高五尺有余，脸上常年戴一张人皮面具，喜怒哀乐一丝不露。",
            "吴道长": "一个看起来道风仙骨的道士。",
            "农夫": "一位乌夷族的农夫，束发总于脑后，用布纱包着，上半身裸露，下著兽皮。",
            "老祭祀": "一个乌夷族的祭司，身披乌夷大麾，戴着颇多金银饰物，显示其地位不凡。",
            "少女": "一位乌夷族的少女，以酥泽发，盘成两环，上披蓝纱头巾，饰以花边。",
            "山羊": "一头短角山羊，大理地区常见的家畜。",
            "孟加拉虎": "一只斑斓孟加拉虎，雄伟极了。",
            "神农帮弟子": "这是一个神农帮的帮众，身穿黄衣，肩悬药囊，手持一柄药锄。",
            "无量剑弟子": "这是无量剑派的一名弟子，腰挎一柄长剑，神情有些鬼祟，象是惧怕些什么。",
            "朱护卫": "他是大理国四大护卫之一。一副书生酸溜溜的打扮行头。",
            "锦衣卫士": "这是位锦衣卫士，身着锦衣，手执钢刀，双目精光炯炯，警惕地巡视着四周的情形。",
            "太监": "一个风尘仆仆的侠客。。",
            "丹顶鹤": "一只全身洁白的丹顶鹤，看来是修了翅膀，没法高飞了。",
            "宫女": "一位大理皇宫乌夷族宫女，以酥泽发，盘成两环，一身宫装，目无表情。",
            "傅护卫": "他是大理国四大护卫之一。",
            "褚护卫": "他是大理国四大护卫之一。身穿黄衣，脸上英气逼人。手持一根铁杆。",
            "家丁": "他是大理国镇南王府的家丁。",
            "霍先生": "他一身邋遢，形容委琐，整天迷迷糊糊的睡不醒模样。可是他的账务十几年来无可挑剔。原来他就是伏牛派的崔百泉，为避仇祸隐居于此。",
            "华司徒": "他是大理国三大公之一。华司徒本名阿根，出身贫贱，现今在大理国位列三公，未发迹时，干部的却是盗墓掘坟的勾当，最擅长的本领是偷盗王公巨贾的坟墓。这些富贵人物死后，必有珍异宝物殉葬，华阿根从极远处挖掘地道，通入坟墓，然后盗取宝物。所花的一和虽巨，却由此而从未为人发觉。有一次他掘入一坟，在棺木中得到了一本殉葬的武功秘诀，依法修习，练成了一身卓绝的外门功夫，便舍弃了这下贱的营生，辅佐保定帝，累立奇功，终于升到司徒之职。",
            "范司马": "他是大理国三公之一。",
            "巴司空": "他是大理国三公之一。一个又瘦又黑的汉子，但他的擅长轻功。",
            "段王妃": "大理王妃，徐娘半老，风韵犹存。",
            "石人": "一个练功用的比武石人，雕凿得很精细，如同真人一般。",
            "段无畏": "他是大理国镇南王府管家。",
            "古护卫": "他是大理国四大护卫之一。",
            "王府御医": "一个风程仆仆的侠客。",
            "段皇爷": "他就是大理国的镇南王，当今皇太弟，是有名的爱情圣手。",
            "婉清姑娘": "她长得似新月清晕，如花树堆雪，一张脸秀丽绝俗，只是过于苍白，没半点血色，想是她长时面幕蒙脸之故，两片薄薄的嘴唇，也是血色极淡，神情楚楚可怜，娇柔婉转。",
            "薛老板": "这是一个经验老到的生意人，一双精明的眼睛不停的打量着你。",
            "石匠": "他是一个打磨大理石的石匠，身上只穿了一件坎肩，全身布满了厚实的肌肉。",
            "摆夷小孩": "一个幼小的摆夷儿童。",
            "江湖艺人": "他是一个外地来的江湖艺人，手里牵着一只金丝猴儿，满脸风尘之色。",
            "太和居店小二": "这位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。",
            "歌女": "她是一个卖唱为生的歌女。",
            "南国姑娘": "南国的大姑娘颇带有当地优美秀丽山水的风韵，甜甜的笑，又有天真的浪漫。她穿着白色上衣，蓝色的宽裤，外面套着黑丝绒领褂，头上缠着彩色的头巾。",
            "摆夷老叟": "一个摆夷老叟大大咧咧地坐在竹篱板舍门口，甩着三四个巴掌大的棕吕树叶，瞧着道上来来往往的人们，倒也快活自在。",
            "野兔": "一只好可爱的小野兔。",
            "盛皮罗客商": "这是一位从印度来的客商，皮肤黝黑，白布包头，大理把印度人叫作盛皮罗。",
            "客店店小二": "这位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。",
            "古灯大师": "他身穿粗布僧袍，两道长长的白眉从眼角垂了下来，面目慈祥，长须垂肩，眉间虽隐含愁苦，但一番雍容高华的神色，却是一望而知。大师一生行善，积德无穷。",
            "渔夫": "一位台夷族的渔夫，扛这两条竹桨，提着一个鱼篓。",
            "台夷猎人": "一位台夷族的猎手，擅用短弩，射飞鸟。",
            "台夷妇女": "一位中年的台夷妇女，上着无领衬花对襟，下穿五色筒裙，正在编织渔网。",
            "台夷姑娘": "一位年轻的台夷姑娘，上着无领衬花对襟，下穿五色筒裙。",
            "水牛": "一头南方山区常见的水牛，是耕作的主力，也用来拉车载物。由于水草茂盛，长得十分肥壮。",
            "台夷农妇": "一位年轻的台夷农妇，在田里辛勤地劳作着。",
            "采笋人": "一个卢鹿部的青年台夷妇女，背后背了个竹筐，手拿一把砍柴刀，来采竹笋。",
            "族长": "一位满脸皱纹的老年妇女，正是本村的族长。台夷时处母系氏族，族中权贵皆为妇女。",
            "祭祀": "一位满脸皱纹的老年妇女，是本村的大祭司，常年司守祭台。台夷时处母系氏族，祭司要职皆为妇女。",
            "侍者": "他看上去长的眉清目秀。",
            "高侯爷": "大理国侯爷，这是位宽袍大袖的中年男子，三缕长髯，形貌高雅",
            "素衣卫士": "这是位身怀绝技的武士。",
            "陪从": "一个部族头领的陪从。",
            "傣族首领": "这是一个身裹虎皮的高大男性。",
            "大土司": "大土司是摆夷族人氏，是苍山纳苏系的。他倒是长的肥头大耳的，每说一句话，每有一点表情，满脸的肉纹便象是洱海里的波浪一样。他身着彩绸，头带凤羽，脚踩藤鞋，满身挂着不同色彩的贝壳。只见他傲气凛然地高居上座，不把来人看在眼里。",
            "侍从": "这位倒也打扮的利索，一身短打，白布包头，翘起的裤腿，一双洁白的布鞋，格外醒目。他正准备出去筹备白尼族一年一度的大会。",
            "族头人": "这位是哈尼的族头人，哈尼是大理国的第三大族，大多聚在大都附近。此人貌甚精明，身穿对襟衣，亦是白布包头。他坐在大土司的右下首，对来人细细打量着。",
            "黄衣卫士": "这是位黄衣卫士，身着锦衣，手执钢刀，双目精光炯炯，警惕地巡视着四周的情形。",
            "毒蜂": "一只色彩斑斓大个野蜂，成群结队的。",
            "平通镖局镖头": "一个风尘仆仆的侠客。。",
            "麻雀": "一只叽叽喳喳，飞来飞去的小麻雀。",
            "小道姑": "玉虚观的小道姑，她是在这接待香客的。",
            "刀俏尼": "这是个容貌秀丽的中年道姑，是个摆夷族女子，颇有雍容气质。",
            "僧人": "一个精壮僧人。",
            "枯大师": "他的面容奇特之极，左边的一半脸色红润，皮光肉滑，有如婴儿，右边的一半却如枯骨，除了一张焦黄的面皮之外全无肌肉，骨头突了出来，宛然便是半个骷髅骨头。这是他修习枯荣禅功所致。",
            "恶奴": "他看上去膀大腰粗，横眉怒目，满面横肉。看来手下倒也有点功夫。",
            "贵公子": "这是一介翩翩贵公子，长得到也算玉树临风、一表人才，可偏偏一双眼睛却爱斜着瞟人。",
            "游客": "一个远道来的汉族游客，风尘仆仆，但显然为眼前美景所动，兴高彩烈。",
            "村妇": "一个年轻的摆夷村妇。",
            "段公子": "他是一个身穿青衫的年轻男子。脸孔略尖，自有一股书生的呆气。",
            "竹叶青蛇": "一只让人看了起鸡皮疙瘩的竹叶青蛇。",
            "台夷商贩": "一个台夷妇女，背着个竹篓贩卖些丝织物品和手工艺品。",
            "采桑女": "一个年轻的摆夷采桑姑娘。",
            "采笋人": "一个壮年村民，住在数里外的村庄，背后背了个竹筐，手拿一把砍柴刀，上山来采竹笋。",
            "砍竹人": "一个壮年村民，住在山下的村落里，是上山来砍伐竹子的。",
            "养蚕女": "一个年轻的摆夷村妇，养蚕纺丝为生。",
            "纺纱女": "一个年轻的摆夷村妇，心灵手巧，专擅纺纱。",
            "老祭祀": "一个颇老朽的摆夷老人，穿戴齐整，是本村的祭司，权力颇大，相当于族长。"
        },
        "断剑山庄": {
            "黑袍老人": "一生黑装的老人。",
            "白袍老人": "一生白装的老人。",
            "和尚": "出了家的人，唯一做的事就是念经了。",
            "尼姑": "一个正虔诚念经的尼姑。",
            "摆渡老人": "一个饱经风霜的摆渡老人。",
            "天怒剑客": "他是独孤求败的爱徒，但他和师傅的性格相差极远。他从不苟言笑，他的脸永远冰冷，只因他已看透了世界，只因他杀的人已太多。他永远只在杀人的时候微笑，当剑尖穿过敌人的咽喉，他那灿烂的一笑令人感到温暖，只因他一向认为——死者无罪！",
            "任笑天": "这是一个中年男子。正静静地站着，双目微闭，正在听海！",
            "摘星老人": "他站在这里已经有几十年了。每天看天上划过的流星，已经完全忘记了一切……甚至他自己。",
            "落魄中年": "一位落魄的中年人，似乎是一位铁匠。",
            "栽花老人": "一个饱经风霜的栽花老人。",
            "背刀人": "此人背着一把生锈的刀，他似乎姓浪，武功深不可测。",
            "雁南飞": "这是一个绝美的女子，正在静静地望着天上的圆月。她的脸美丽而忧伤，忧伤得令人心碎。",
            "梦如雪": "这是一个寻梦的人。他已厌倦事实。他只有寻找曾经的梦，不知道这算不算是一种悲哀呢？",
            "剑痴": "他是剑痴，剑重要过他的生命。",
            "雾中人": "这个人全身都是模糊的，仿佛是一个并不真正存在的影子。只因他一生都生活在雾中，雾朦胧，人亦朦胧。",
            "独孤不败": "这就是一代剑帝独孤求败。独孤求败五岁练剑，十岁就已经罕有人能敌。被江湖称为剑术天才。"
        },
        "冰火岛": {
            "火麒麟王": "浑身充满灼热的气息，嘴巴可吐出高温烈焰，拥有强韧的利爪以及锋利的尖齿，是主宰冰火岛上的兽王。岛上酷热的火山地带便是他的领地，性格极其凶残，会将所看到闯入其领地的生物物焚烧殆尽。",
            "火麒麟": "磷甲刀枪不入，四爪孔武有力速度奇快。浑身能散发极高温的火焰，喜热厌冷，嗜好吞噬火山晶元。现居于冰焰岛火山一侧。",
            "麒麟幼崽": "火麒麟的爱子，生人勿近。",
            "游方道士": "一名云游四海的道士，头束白色发带，身上的道袍颇为残旧，背驮着一个不大的行囊，脸上的皱纹显示饱经风霜的游历，双目却清澈异常，仿佛包容了天地。",
            "梅花鹿": "一身赭黄色的皮毛，背上还有许多像梅花白点。头上岔立着的一双犄角，看上去颇有攻击性。行动十分机敏。",
            "雪狼": "毛色净白，眼瞳红如鲜血，牙齿十分锐利，身形巨大强壮，速度极快。天性狡猾，通常都是群体出动。",
            "白熊": "全身长满白色长毛，双爪极度锋利，身材颇为剽悍，十分嗜血狂暴。是冰焰岛上最强的猎食者。",
            "殷夫人": "此女容貌娇艳无伦，虽已过中年但风采依稀不减。为人任性长情，智计百出，武功十分了得。立场亦正亦邪。乃张五侠结发妻子，张大教主亲生母亲。",
            "张五侠": "在武当七侠之中排行第五，人称张五侠。虽人已过中年，但脸上依然俊秀。为人彬彬有礼，谦和中又遮不住激情如火的风发意气。可谓文武双全，乃现任张大教主的亲生父亲。",
            "赵郡主": "天下兵马大元帅汝阳王之女，大元第一美人。明艳不可方物，艳丽非凡，性格精灵俊秀，直率豪爽，对张大教主一往情深，为爱放弃所有与其共赴冰焰岛厮守终身。",
            "谢狮王": "他就是明教的四大护法之一的金毛狮王。他身材魁伟异常，满头金发散披肩头。但双目已瞎。在你面前一站，威风凛凛，真如天神一般。",
            "黑衣杀手": "穿着极其神秘的黑衣人，黑色的面巾遮住了他的面容。武功十分高强。",
            "杀手头目": "颇为精明能干。闪烁的双眼散发毋容置疑的威望。乃是这群不明来历黑衣人的统领头目。",
            "元真和尚": "此人武功极高，极富智谋，心狠手辣杀人如麻。因与前明教教主私怨而恼羞成怒，出家剃度意图挑拨江湖各大派，以达歼灭明教颠覆武林之目的。与谢狮王也有过一段不为人知的恩怨情仇。",
            "蓬面老头": "蓬头垢面，衣服千丝万缕，显然被关在这里已经很久了。"
        },
        "侠客岛": {
            "黄衣船夫": "这是个身着黄衣的三十几岁汉子，手持木桨，面无表情。",
            "侠客岛厮仆": "他是岛上的一个仆人，手底下似乎很有两下子。",
            "张三": "乃江湖传闻中赏善罚恶使者之一，其精明能干，为人大公无私。但平时大大咧咧表情十分滑稽。",
            "云游高僧": "一位云游四方的行者，风霜满面，行色匆匆，似乎正在办一件急事。",
            "王五": "他大约二十多岁，精明能干，笑嘻嘻的和蔼可亲。",
            "白衣弟子": "乃侠客岛龙岛主门下的一个弟子。身上穿着洗得发白的锦衣，头上带着秀才帽，一脸的书呆子气，怎麽看也不象是个武林中人。",
            "丁三": "一个鹤发童颜的老头，穿得荒诞不经，但看似武功十分了得。",
            "店小二": "位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。",
            "侠客岛闲人": "他是岛上一个游手好闲的人。不怀好意。",
            "石公子": "这是一个年轻公子，面若中秋之月，色如春晓之花，鬓若刀裁，眉如墨画，鼻如悬胆，情若秋波，虽怒而时笑，即视而有情。",
            "书生": "他看过去像个落泊的书生，呆头呆脑的一付书呆子的样子。但只要你留心，你就发现他两眼深沉，而且腰挂一把长剑。",
            "丁当": "一个十七八岁的少女，身穿淡绿衫子，一张瓜子脸，秀丽美艳。",
            "白掌门": "他就是雪山剑派的掌门人，习武成性，自认为天下武功第一，精明能干，嫉恶如仇，性如烈火。",
            "马六": "他身材魁梧，圆脸大耳，笑嘻嘻地和蔼可亲。",
            "侠客岛弟子": "这是身材魁梧的壮汉，膀大腰圆，是岛主从中原招募来的。力气十分之大。",
            "李四": "身形甚高，但十分瘦削，留一撇鼠尾须，脸色阴沉。就是江湖传闻中赏善罚恶使者之一，其精明能干，但总是阴沉着脸。",
            "蓝衣弟子": "她是木岛主的女弟子，专管传授岛上弟子的基本功夫。",
            "童子": "这是一个十五六岁的少年，眉清目秀，聪明伶俐，深得岛主喜爱。",
            "龙岛主": "就是天下闻之色变的侠客岛岛主，号称“不死神龙”。他须眉全白，脸色红润，有如孩童。看不出他的实际年纪。",
            "木岛主": "他就是天下闻之色变的侠客岛岛主，号称“叶上秋露”。只见他长须稀稀落落，兀自黑多白少，但一张脸却满是皱纹。看不出他的实际年纪。",
            "侍者": "这是个身着黄衣的三十几岁汉子，垂手站立，面无表情。",
            "史婆婆": "她是雪山派白掌门的妻子，虽说现在人已显得苍老，但几十年前提起“江湖一枝花”史小妹来，武林中却是无人不知。",
            "矮老者": "此老身躯矮小，但气度非凡，令人不敢小窥。他与其师弟高老者闭关已久，江湖上鲜闻其名。武功之高，却令人震惊。",
            "高老者": "他身形高大硕状，满面红光。举止滑稽，带点傻气，武功却是极高。他因不常在江湖上露面，是以并非太多人知闻其名。",
            "谢居士": "他就是摩天崖的主人。是个亦正亦邪的高手，但信守承诺，年轻时好武成兴，无比骄傲，自认为天下第一。",
            "朱熹": "他是个精通诗理的学者，原本是被逼而来到侠客岛，但学了武功後死心塌地的留了下来。",
            "小猴子": "一只机灵的猴子，眼巴巴的看着你，大概想讨些吃的。",
            "樵夫": "一个一辈子以砍材为生的老樵夫，由于饱受风霜，显出与年龄不相称的衰老。",
            "医者": "一位白发银须的老者。据说当年曾经是江湖上一位著名的神医。但自从来到侠客岛上后，隐姓埋名，至今谁也不知道他真名是甚么了。他看起来懒洋洋的，你要是想请他疗伤的话恐怕不那么容易。",
            "石帮主": "为人忠厚老实，性情温和，天赋极高，记性极好。穿着一身破烂的衣服，却也挡不住他一身的英气。似乎身怀绝世武功。",
            "野猪": "这是一只凶猛的野猪，长得极为粗壮，嘴里还不断发出可怕的哄声。",
            "渔家男孩": "这是个渔家少年，大概由于长期在室外的缘故，皮肤已晒得黝黑，人也长得很粗壮了。",
            "渔夫": "看过去像个平平凡凡的渔夫，脸和赤裸的臂膀都晒得黑黑的。但只要你留心，你就发现他两眼深沉，而且腰挂一把长剑。",
            "渔家少女": "这是个渔家少女，虽然只有十二、三岁，但身材已经发育得很好了，眼睛水汪汪很是诱人。",
            "阅书老者": "一个精神矍烁的老者，他正手持书籍，稳站地上，很有姜太公之风。",
            "青年海盗": "一个青年海盗，颇为精壮，，眼角中展露出了凶相。",
            "老海盗": "一个年老的海盗，虽然胡子一大把了，但还是凶巴巴的。"
        },
        "绝情谷": {
            "土匪": "在山谷下烧伤抢掠的恶人。",
            "村民": "世代生活于此的人，每日靠着进山打打猎生活。",
            "野兔": "正在吃草的野兔。",
            "绝情谷弟子": "年纪不大，却心狠手辣，一直守候在绝情山庄。",
            "冰蛇": "身体犹如冰块透明般的蛇。",
            "千年寒蛇": "一条通体雪白的大蛇。",
            "天竺大师": "在绝情谷中研究怎么破解情花之毒的医学圣手。",
            "养花女": "照顾着绝情谷的花花草草的少女。",
            "侍女": "好色的绝情谷谷主从来劫来的少女。",
            "谷主夫人": "绝情谷上一任谷主的女儿，被现任谷主所伤，终日只得坐在轮椅之上。",
            "门卫": "这是个年富力强的卫兵，样子十分威严。",
            "绝情谷谷主": "好色、阴险狡诈的独眼龙。",
            "白衣女子": "一个宛如仙女般的白衣女子。",
            "采花贼": "声名狼藉的采花贼，一路潜逃来到了绝情谷。",
            "拓跋嗣": "鲜卑皇族后裔，自幼就表现出过人的军事天赋，十七岁时就远赴河套抗击柔然骑兵，迫使柔然不敢入侵。",
            "没藏羽无": "多权谋，善用计，所率西夏堂刺客素以神鬼莫测著称，让对头心惊胆战。",
            "野利仁嵘": "西夏皇族后裔，黑道威名赫赫的杀手头领，决策果断，部署周密，讲究战法，神出鬼没。",
            "嵬名元昊": "一副圆圆的面孔，炯炯的目光下，鹰勾鼻子耸起，刚毅中带着几分凛然不可侵犯的神态。中等身材，却显得魁梧雄壮，英气逼人。平素喜穿白色长袖衣，头戴黑色冠帽，身佩弓矢。此人城府心机深不可测，凭借一身最惊世骇俗的的锤法位居西夏堂最处尊居显之位，力图在天波杨门与燕云世家三方互相牵制各自鼎立态势下，为本门谋求最大之利益。",
            "雪若云": "身着黑色纱裙，面容精致秀美，神色冷若冰雪，嘴角却隐隐透出一股温暖的笑意。现在似是在被仇家围攻，已是身受重伤。",
            "养鳄人": "饲养鳄鱼的年轻汉子。",
            "鳄鱼": "悠闲的在鳄鱼潭边休息，看似人畜无害，但是无人敢靠近它们。",
            "囚犯": "被关押在暗无天日的地牢内，落魄的样子无法让你联想到他们曾是江湖好汉。",
            "地牢看守": "看守着地牢的武者，一脸严肃，不知道在想些什么。"
        },
        "碧海山庄": {
            "法明大师": "管理龙王殿的高僧，龙王殿大大小小的事物都是他在负责。",
            "僧人": "龙王殿僧人，负责每年祭祀龙王。",
            "隐士": "厌倦了这世间的纷纷扰扰，隐居于此的世外高人。",
            "野兔": "正在吃草的兔子。",
            "护卫": "他是一个身材高大的中年男子，看起来凶神恶煞，招惹不得。",
            "侍女": "打理碧海山庄上上下下的杂物。",
            "尹秋水": "她肌肤胜雪，双目犹似一泓清水，顾盼之际，自有一番清雅高华的气质，让人为之所摄、自惭形秽、不敢亵渎。但那冷傲灵动中颇有勾魂摄魄之态，又让人不能不魂牵蒙绕。",
            "养花女": "一位养花少女，她每天就是照顾这数也数不清的花。",
            "家丁": "碧海山庄的家丁。",
            "耶律楚哥": "出身契丹皇族，为人多智谋，善料敌先机，骑术了得，为大辽立下赫赫卓著战功。故而被奉为燕云世家之主。与天波杨门缠斗一生，至死方休。",
            "护卫总管": "身材瘦小，可是一身武艺超群，碧海山庄之内能胜他者不超过五人",
            "易牙传人": "一身厨艺已经傲世天下，煎、熬、燔、炙，无所不精。",
            "砍柴人": "碧海山庄所需木柴都由他来供给。",
            "独孤雄": "一个风程仆仆的侠客。",
            "王子轩": "碧海山庄少庄主，整日沉迷于一些稀奇古怪的玩意。",
            "王昕": "年过半百的中年男子，长相平庸，很难让人把他与碧海山庄庄主这个身份联想起来。"
        },
        "天山": {
            "周教头": "大内军教头，外表朴实无华，实则锋芒内敛。有着一腔江湖豪情。",
            "辛怪人": "性情古怪，不好交往，喜用新招，每每和对方对招之际，学会对方的招式，然后拿来对付对方，令到对方啼笑皆非。。是个狼养大的孩子，他很能打，打起来不要命，一个性情古怪的人，有着一段谜一样的过去。",
            "穆小哥": "一个只有十八九岁的小伙子，乐观豁达，无处世经验，对情感也茫然无措，擅长进攻，变化奇快。",
            "牧民": "这是一位边塞牧民，正在驱赶羊群。",
            "塞外胡兵": "一副凶神恶煞的长相，来自塞外。以掳掠关外牧民卫生。",
            "胡兵头领": "手持一根狼牙棒，背负一口长弓。身材高大，面目可憎。",
            "乌刀客": "他就是名动江湖的乌老大，昔日曾谋反童姥未遂而被囚禁于此。",
            "波斯商人": "这是一位来自波斯的商人，经商手段十分高明。",
            "贺好汉": "乃行走江湖的绿林好汉，脾气极为暴躁。",
            "铁好汉": "邱莫言重金雇佣的绿林好汉，贺兰山草寇。缺乏主见，使一柄没有太多特色的单刀，虽是为财而来，却也不失为江湖义士",
            "刁屠夫": "乃龙门客栈屠夫，此人凭借常年累月的剔骨切肉练就一身好刀法。",
            "金老板": "龙门客栈老板娘，为人八面玲珑。左手使镖，右手使刀，体态婀娜多姿，妩媚泼辣。",
            "韩马夫": "一位憨直的汉子，面容普通，但本性古道热肠，有侠义本色。",
            "蒙面女郎": "这是个身材娇好的女郎，轻纱遮面，一双秀目中透出一丝杀气。",
            "武壮士": "他身穿一件藏蓝色古香缎夹袍，腰间绑着一根青色蟒纹带，一头暗红色的发丝，有着一双深不可测眼睛，体型挺秀，当真是风度翩翩飒爽英姿。",
            "程首领": "她是「灵柩宫」九天九部中钧天部的副首领",
            "菊剑": "这是个容貌姣好的女子，瓜子脸蛋，眼如点漆，清秀绝俗。",
            "石嫂": "她是[灵柩宫]的厨师。",
            "兰剑": "这是个容貌姣好的女子，瓜子脸蛋。",
            "符针神": "她是「灵柩宫」九天九部中阳天部的首领她号称「针神」",
            "梅剑": "她有着白皙的面容，犹如梅花般的亲丽脱俗，堆云砌黑的浓发，整个人显得妍姿俏丽惠质兰心。",
            "竹剑": "这是个容貌姣好的女子，瓜子脸蛋，眼如点漆，清秀绝俗。你总觉得在哪见过她",
            "余婆": "她是「灵柩宫」九天九部中昊天部的首领。她跟随童姥多年，出生入死，饱经风霜。",
            "九翼": "他是西夏一品堂礼聘的高手，身材高瘦，脸上总是阴沉沉的他轻功极高，擅使雷公挡，凭一手雷公挡功夫，成为江湖的一流高手。",
            "天山死士": "是掌门从武林掳掠天资聪明的小孩至天山培养的弟子，自小就相互厮杀，脱颖而出者便会成为天山死士，只听命于掌门一人，倘若有好事者在天山大动干戈，他将毫不犹豫的将对方动武，至死方休。",
            "天山大剑师": "弃尘世而深居天山颠峰，数十年成铸剑宗师，铸成七把宝剑。此七把剑代表晦明大师在天山上经过的七个不同剑的境界。",
            "护关弟子": "这是掌门最忠心的护卫，武功高深莫测。正用警惕的眼光打量着你",
            "楚大师兄": "有“塞外第一剑客”之称、“游龙一出，万剑臣服”之勇。性傲、极度自信、重情重义、儿女情长，具有英雄气盖，但容易感情用事，做事走极端。乃天山派大师兄。",
            "傅奇士": "一个三绺长须、面色红润、儒冠儒服的老人，不但医术精妙，天下无匹，而且长于武功，在剑法上有精深造诣。除此之外，他还是书画名家。",
            "杨英雄": "一个有情有义的好男儿，他武功高强大义凛然，乃天山派二师兄。",
            "胡大侠": "因其武功高强神出鬼没。在江湖上人送外号「雪山飞狐」。他身穿一件白色长衫，腰间别着一把看起来很旧的刀。他满腮虬髯，根根如铁，一头浓发，却不结辫。"
        },
        "苗疆": {
            "温青": "此人俊秀异常，个性温和有风度，喜好游历山水是一位姿态优雅的翩翩君子",
            "苗村长": "这是本村的村长，凡是村里各家各户，老老少少的事他没有不知道的。",
            "苗家小娃": "此娃肥肥胖胖，走路一晃一晃，甚是可爱。",
            "苗族少年": "一个身穿苗族服饰的英俊少年。",
            "苗族少女": "一个身穿苗族服饰的妙龄少女。",
            "田嫂": "一个白皙丰满的中年妇人．",
            "金背蜈蚣": "一条三尺多长，张牙舞爪的毒蜈蚣。",
            "人面蜘蛛": "一只面盆大小，长着人样脑袋的大蜘蛛。",
            "吸血蜘蛛": "一只拳头大小，全身绿毛的毒蜘蛛。",
            "樵夫": "一位面色黑红，悠然自得的樵夫．",
            "蓝姑娘": "此女千娇百媚，风韵甚佳，声音娇柔宛转，荡人心魄。年龄约莫二十三四岁。喜欢养毒蛇，能炼制传说中苗族人的蛊毒，还善于配置各种剧毒。喜欢吹洞箫，口哨也很好。",
            "莽牯朱蛤": "一只拳头大小，叫声洪亮的毒蛤蟆。",
            "阴山天蜈": "一条三寸多长，长有一双翅膀剧毒蜈蚣。",
            "食尸蝎": "一条三尺来长，全身铁甲的毒蝎子。",
            "蛇": "一条七尺多长，手腕般粗细的毒蛇。十分骇人。",
            "五毒教徒": "一个五毒的基层教徒，看来刚入教不久。",
            "沙护法": "他就是五毒教的护法弟子，身材魁梧，方面大耳。在教中转管招募教众，教授弟子们的入门功夫。",
            "五毒弟子": "五毒教一个身体强壮的苗族青年，看来武功已小由所成。",
            "毒郎中": "一位身穿道服，干瘪黑瘦的中年苗人．",
            "白鬓老者": "一个须发皆白的老者，精神矍铄，满面红光。",
            "何长老": "她就是五毒教的长老，教主的姑姑。随然是教主的长辈，但功夫却是一块跟上代教主学的。据说她曾经被立为教主继承人，但后来犯下大错，所以被罚到此处面壁思过，以赎前罪。她穿着一身破旧的衣衫，满脸疤痕，长得骨瘦如柴，双目中满是怨毒之色。",
            "毒女": "年纪约20岁，冷艳绝伦，背景离奇，混身是毒，外号毒女曼陀罗，涉嫌下毒命案，其实她是个十分善良的女子。与铁捕快有一段缠绵悱恻的爱情，花耐寒而艳丽。",
            "潘左护法": "他就是五毒教的左护法，人称笑面阎罗。别看他一脸笑眯眯的，但是常常杀人于弹指之间，一手五毒钩法也已达到登峰造极的境界。",
            "大祭司": "乃苗疆最为德高望重的祭师。但凡祭祀之事皆是由其一手主持。",
            "岑秀士": "他就是五毒教的右护法，人称五毒秀士。经常装扮成一个白衣秀士的模样，没事总爱附庸风雅。",
            "齐长老": "他就是五毒教的长老，人称锦衣毒丐。乃是教主的同门师兄，在教中一向飞扬跋扈，大权独揽。他长的身材魁梧，面目狰狞，身穿一件五彩锦衣，太阳穴高高坟起。",
            "五毒护法": "乃帮主的贴身护法，为人忠心耿耿，武艺深不可测。帮主有难时，会豁尽全力以护佑她人身安全。",
            "何教主": "你对面的是一个一身粉红纱裙，笑靥如花的少女。她长得肌肤雪白，眉目如画，赤着一双白嫩的秀足，手脚上都戴着闪闪的金镯。谁能想到她就是五毒教的教主，武林人士提起她无不胆颤心惊。"
        },
        "白帝城": {
            "白衣弟子": "身穿白衣的青年弟子，似乎身手不凡，傲气十足。",
            "守门士兵": "身穿白帝城军服的士兵。",
            "白衣士兵": "身穿白衣的士兵，正在街上巡逻。",
            "文将军": "白帝城公孙氏的外戚，主要在紫阳城替白帝城防御外敌。",
            "粮官": "负责管理紫阳城的粮仓的官员。",
            "练武士兵": "正在奋力操练的士兵。",
            "近身侍卫": "公孙将军的近身侍卫，手执长剑。",
            "公孙将军": "公孙氏的一位将军，深受白帝信任，被派到紫阳城担任守城要务。",
            "白衣少年": "身穿白帝城统一服饰的少年，长相虽然一般，但神态看起来有点傲气。",
            "李峰": "精神奕奕的中年汉子，看起来非常自信。",
            "李白": "字太白，号青莲居士，又号“谪仙人”，他拿着一壶酒，似乎醉醺醺的样子。",
            "“妖怪”": "一个公孙氏的纨绔弟子，无聊得假扮妖怪到处吓人。",
            "庙祝": "一个风程仆仆的侠客。",
            "狱卒": "一个普通的狱卒，似乎在这发呆。",
            "白帝": "现任白帝，乃公孙氏族长，看起来威严无比，在他身旁能感受到不少压力。",
            "李巡": "白发苍苍的老头，貌似是李峰的父亲。",
            "镇长": "白发苍苍的镇长，看起来还挺精神的。"
        },
        "墨家机关城": {
            "墨家弟子": "一声正气禀然的装束，乃天下间心存侠义之人仰慕墨家风采而成为其中一员。",
            "索卢参": "此人乃墨子学生，为人特别诚恳，因此被指派负责接待外宾司仪一职。",
            "高孙子": "为墨子的学生，口才十分了得。故而负责机关城与外界联系。",
            "燕丹": "此人乃前朝皇族，灭国之后投身到墨家麾下四处行侠仗义神秘莫测。",
            "荆轲": "墨家绝顶刺客，剑法在墨家中出类拔萃，为人慷慨侠义。备受墨家弟子所敬重。",
            "庖丁": "一名憨厚开朗的大胖子，其刀法如神，是个烧遍天下美食的名厨。",
            "治徒娱": "为墨子的学生，有过目不忘之才数目分明之能，因此在节用市坐镇负责机关城资源调配。",
            "大博士": "对天下学术有着极高造诣的宗师，主管墨家学说的传承。",
            "高石子": "此人乃墨子的学生，深受墨子欣赏。曾经当过高官，现主管墨家日常政务。",
            "县子硕": "此人乃墨子学生，与高何一样无恶不作，后师从墨子，收心敛性，专职培养墨家人才。",
            "魏越": "为墨子的学生，此人天敏而好学，时常不耻下问，因此被墨子钦点在此顾守书籍。",
            "黑衣人": "一身蒙面黑衣，鬼鬼祟祟，不知是何人。",
            "徐夫子": "墨家最优秀的铸匠，毕生致力精研铸剑术，很多名震天下的神兵利刃皆是出自他手。",
            "屈将子": "此人乃资深航海师，墨家麾下的殸龙船便是由其掌控。",
            "偷剑贼": "身穿黑色夜行衣，举手投足之间尽显高手风范，实力不容小觑。",
            "高何": "此人乃墨子学生，面相凶神恶煞，因而负责机关城的安全事务。",
            "随师弟": "随巢子的师弟，因犯事被暂时关于此地。",
            "大匠师": "铸艺高超的墨家宗师，主管墨家兵器打造。",
            "随巢子": "此人乃墨子的学生，沉迷于打造大型机关兽，木鸢便是出自其手。",
            "鲁班": "机关术的专家，以善于发明各种机关而闻名。木匠出身，在机关术上有着天人一般的精湛技艺。如今不知为何来到墨家机关城。",
            "曹公子": "早年曾质疑墨子之道，后被博大精深的墨家机关术所折服，专职看守天工坞。",
            "耕柱子": "为墨子的学生，此人天资异禀，但骄傲自满，因此被墨子惩罚到兼爱祠看管。",
            "墨子": "墨家的开山祖师，以一人之力开创出机关流派，须眉皆白，已不知其岁数几何，但依然满脸红光，精神精神焕发。",
            "公尚过": "墨子的弟子，深得墨子器重，为人大公无私，现主管墨家的检察维持门内秩序。"
        },
        "掩月城": {
            "佩剑少女": "两个年方豆蔻的小女孩，身上背着一把短剑，腰间系着一块『出云』玉牌，脸上全是天真烂漫。",
            "野狗": "一条低头啃着骨头的野狗。",
            "执定长老": "出云阁四大长老之一，负责出云庄在城中的各种日常事务，也带一些难得下山的年轻小弟子来城中历练。虽表情严肃，却深受晚辈弟子的喜爱。",
            "醉酒男子": "一名喝得酩酊大醉的男子，看起来似是个浪荡的公子哥。",
            "仆人": "富家公子的仆人，唯唯诺诺地跟在身后。",
            "紫衣仆从": "身着紫衣的侍从，不像是青楼守卫，却更有豪门王府门卫的气派。",
            "候君凛": "一名中年男子，虽是平常侠客打扮，却颇有几分朝廷中人的气度。",
            "轻纱女侍": "一名身着轻纱的女子，黛眉轻扫，红唇轻启，嘴角勾起的那抹弧度仿佛还带着丝丝嘲讽。眼波一转。流露出的风情让人忘记一切。",
            "抚琴女子": "身着红衣的抚琴少女，红色的外袍包裹着洁白细腻的肌肤，她偶尔站起走动，都要露出细白水嫩的小腿。脚上的银铃也随着步伐轻轻发出零零碎碎的声音。纤细的手指划过古朴的琵琶。令人骚动的琴声从弦衫流淌下来。",
            "女官人": "犹怜楼的女主事，半老徐娘，风韵犹存。",
            "黑纱舞女": "一个在大厅中间舞台上表演的舞女，身着黑纱。她玉足轻旋，在地上留下点点画痕，水袖乱舞，沾染墨汁勾勒眼里牡丹，裙摆旋舞，朵朵莲花在她脚底绽放，柳腰轻摇，勾人魂魄，暗送秋波，一时间天地竞相为此美色而失色羞愧。可谓是丝竹罗衣舞纷飞！",
            "小厮": "楼里的小厮，看起来乖巧得很。",
            "梅映雪": "一名英姿飒爽的女剑客，身手非凡，负责把守通向后院的小路。",
            "舞眉儿": "犹怜楼内最善舞的女子，云袖轻摆招蝶舞、纤腰慢拧飘丝绦。她似是一只蝴蝶翩翩飞舞、一片落叶空中摇曳，又似是丛中的一束花、随着风的节奏扭动腰肢。若有若无的笑容始终荡漾在她脸上，清雅如同夏日荷花。",
            "寄雪奴儿": "一条从西域带来的波斯猫。",
            "琴楚儿": "女子长长的秀发随着绝美的脸庞自然垂下，月光下，长发上似乎流动着一条清澈的河流，直直泻到散开的裙角边，那翠色欲流的玉箫轻轻挨着薄薄的红唇，萧声凄美苍凉。她的双手洁白无瑕，轻柔的流动在乐声中，白色的衣裙，散落的长发，流离凄美。她眉宇间，忧伤像薄薄的晨雾一样笼罩着。没有金冠玉饰，没有尊贵华杉。她却比任何人都美。",
            "华衣女子": "衣着华贵的女子，年纪尚轻，身上似藏有一些秘密。",
            "赤髯刀客": "一名面向粗旷威武的刀客，胡髯全是火红之色，似是钟馗一般。",
            "老乞丐": "衣衫破烂却不污秽的老乞丐，身上有八个口袋，似是丐帮净衣八袋弟子。",
            "马帮弟子": "漠北马帮的得力弟子。",
            "养马小厮": "这是客栈门口负责为客人牵马喂马的小厮。",
            "客栈掌柜": "卧马客栈的大掌柜的。",
            "店小二": "一个跑前跑后的小二，忙得不可开交。",
            "蝮蛇": "当地特有的毒蛇，嘶嘶地发出警告，你最好不要靠近。",
            "东方秋": "一名年青剑客，腰插一块显是王府内的令牌，让人对其身份产生了好奇。",
            "函谷关官兵": "这是镇守函谷关的官兵，在渡口侦探敌情。",
            "函谷关武官": "函谷关统兵武官，驻守渡口监视着敌人的动向。",
            "长刀敌将": "这是一名手持长刀的敌将。",
            "穿山甲": "这是一只穿山甲。",
            "黑衣老者": "一个表情凶狠的黑衣老者，你最好还是不要招惹他。",
            "六道禅师": "曾经的武林禅宗第一高手，武功修为极高，内力深厚，一身真气护体的功夫，寻常人难以企及。",
            "雪若云": "这是无影楼长老雪若云，此刻正在榻上打坐静养。",
            "火狐": "这是一只红色皮毛的狐狸。",
            "黄鹂": "这是一只黄鹂鸟儿，吱吱呀呀地唱着。",
            "夜攸裳": "一个来自波斯国的女子，看似穿着华裙，内中却是劲衣。头上扎着一个侧髻，斜插着一支金玉双凤钗。",
            "云卫": "这是守卫出云庄大门的守卫，气度不凡。",
            "云将": "这是统管出云庄护卫的将领，龙行虎步，神威凛凛。",
            "女眷": "这是出云庄的女眷，虽为女流，却精通武艺。",
            "制甲师": "这是一个顶尖的制造甲胄的大师。",
            "试剑士": "这是一个试炼各式兵器和器械的武士。",
            "莫邪传人": "这是一个顶尖的铸炼天匠，据传曾是莫邪的弟子。",
            "老仆": "一名忠心耿耿的老仆人，一言不发地守在公子身后。",
            "狄啸": "这是一个能征战四方的将军，出云庄的得力大将。",
            "青云仙子": "这是一个游历四方的道姑，姿态飘逸，身负古琴，能成为出云庄的客人，怕也是来头不小。",
            "秦东海": "是出云庄的主人，也是出云部军队的大统帅。身穿狮头麒麟铠，腰佩神剑。",
            "执剑长老": "这是出云庄四大长老之一的执剑长老，负责传授庄中武士的武艺，其一身武功之高自是不在话下。",
            "执法长老": "这是出云庄四大长老之一的执法长老，负责庄中的法规制度的执行，严肃公正，一丝不苟。",
            "执典长老": "这是出云庄四大长老之一的执典长老，负责维护管理庄中重要的典籍和秘书。",
            "野兔": "这是一只灰耳白尾的野兔",
            "老烟杆儿": "一名白发苍苍的老人，手持一柄烟杆儿。",
            "杂货脚夫": "一个负责运送日常杂货的脚夫。",
            "短衫剑客": "一个身着短衫，利落干净的剑客。",
            "巧儿": "一个聪明伶俐，娇小可爱的小丫头。",
            "骑牛老汉": "一个黑衫华发的老人，腰佩长剑。",
            "青牛": "一头通体泛青，健硕无比的公牛。",
            "书童": "一名年不及二八的小书童，身上背着书篓。",
            "赤尾雪狐": "一只通体雪白，尾稍赤红如火的狐狸。",
            "泥鳅": "一条乌黑油亮的小泥鳅，在溪水中畅快地游着。",
            "灰衣血僧": "一个满面煞气，身着灰色僧袍，手持大环刀的中年恶僧。",
            "白鹭": "一只羽毛如雪的白鹭，双翅一展有丈许，直欲振翅上九天而去。",
            "青衫女子": "一名身着青衫，头戴碧玉簪的年青女子。手里拿着一支绿色玉箫。",
            "樊川居士": "百年难得一出的天纵英才，诗文当世无二，其诗雄姿英发。而人如其诗，个性张扬，如鹤舞长空，俊朗飘逸。",
            "无影暗侍": "这是一个无影楼守门的侍卫，全身黑衣，面带黑纱。",
            "琴仙子": "一个身着朴素白裙，满头青丝垂下的少女，手指轻动，天籁般的琴音便流淌而出。琴声之间还包含了极深的内力修为。",
            "百晓居士": "这是一个江湖事无所不晓的老头，总是一副若有所思的样子。",
            "清风童子": "这是无影楼的小侍童。",
            "刀仆": "这是天刀宗师的仆人，忠心耿耿。",
            "天刀宗师": "一个白发老人，身形挺拔，传说这是二十年前突然消失于武林的天下第一刀客。",
            "虬髯长老": "这是无影阁四大长老之一的虬髯公，满面赤色的虬髯，腰间一把帝王之剑。",
            "行脚贩子": "这是一个远道而来的商人，满面风尘。",
            "农家少妇": "附近农家的新婚妇人，一边带着孩子，一边浣洗着衣服。",
            "六婆婆": "年长的妇女，总忍不住要善意地指导一下年轻女孩们的家务。",
            "青壮小伙": "在井边打水的健壮少年，浑身都是紧实的肌肉，总是在有意无意之间展示着自己的力量。",
            "店老板": "马车店老板，年近不惑。",
            "白衣弟子": "出云庄的年轻弟子，第一次来到市集，看什么都是新鲜。",
            "黑衣骑士": "穿着马靴的黑衣少年，似是在维持市场的秩序。",
            "青衫铁匠": "一个深藏不露的铁匠，据说能打出最上乘的武器。",
            "牧民": "一个风霜满面却面带微笑的中年男子。",
            "青鬃野马": "野外的空阔辽远，青鬃马扬起鬃毛，收腰扎背，四蹄翻飞，跨阡度陌，跃丘越壑，尽情地奔驰在自由的风里。",
            "小马驹": "出生不足一年的小马驹，虽不知其名，但显是有着极纯正优秀的血统，世人皆说风花牧场尽收天下名驹，此言非虚。",
            "的卢幼驹": "额上有白点，通体黝黑的神骏幼驹。",
            "乌骓马": "通体黑缎子一样，油光放亮，唯有四个马蹄子部位白得赛雪。乌骓背长腰短而平直，四肢关节筋腱发育壮实，这样的马有个讲头，名唤“踢雪乌骓”。",
            "绛衣剑客": "一名身着绛色短衫的剑客，太阳穴微微鼓起，显是有着极强内力修为。",
            "白衣公子": "手持折扇，白衣飘飘的俊美公子，似是女扮男装。",
            "秦惊烈": "一个身高七尺的伟岸男子，腰里挂着弯刀，明明是满脸虬髯，脸上却总是带着温和的微笑。",
            "千小驹": "一个年近弱冠的小孩子，身着皮袄，手拿小鞭，自幼在牧场长大，以马驹为名，也极善与马儿相处，据说他能听懂马儿说话。",
            "小马驹儿": "一只刚出生不久的小马驹，虽步行踉跄，却也已能看出纯种烈血宝马的一二分风采。",
            "牧羊犬": "牧民们的牧羊犬，威风凛凛，忠心耿耿。",
            "追风马": "中原诸侯梦寐以求的军中良马，可日行六百，四蹄翻飞，逐风不休。",
            "诸侯秘使": "一个来求购良马的使者，不知道哪个诸侯派出，身份隐秘。",
            "赤菟马": "人中吕布，马中赤兔，如龙如神，日行千里，红影震慑千军阵！",
            "风如斩": "风花牧场上最好的牧人之一，左耳吊坠是一只狼王之齿，腰间的马刀也是功勋赫赫！",
            "爪黄飞电": "据说是魏武帝最爱的名驹，体型高大，气势磅礴，万马之中也可一眼看出。",
            "黑狗": "一条牧场上的黑狗，汪汪地冲你叫着。",
            "照夜玉狮子": "此马天下无双，通体上下，一色雪白，没有半根杂色，浑身雪白，传说能日行千里，产于西域，是极品中的极品。",
            "鲁总管": "风花牧场的总管，上上下下的诸多事情都归他打理，内务外交都会经他之手。他却一副好整以暇的样子，似是经纬尽在掌握。",
            "风花侍女": "风花牧场的侍女，虽名义上都是仆从，但却神色轻松，喜笑颜开，和主人管事们都亲热非常。",
            "灰耳兔": "一只白色的兔子，耳朵却是灰色。",
            "白狐": "一只通体雪白的小狐狸，在树洞里伸出头来看着你。",
            "小鹿": "一只满身梅花的小鹿，抬起头看着你。",
            "天玑童子": "天玑楼里的小童子，身穿青衫，头系蓝色发带。"
        },
        "海云阁": {
            "马夫": "这是一个等候主人的马夫，耐心地打扫着马车。",
            "野狗": "一只浑身脏兮兮的野狗",
            "老镇长": "这是海云镇的镇长，平日里也没啥事情可管，便拿着个烟袋闲逛。",
            "烟袋老头": "一个显然有着不低功夫底子的老头子，手拿一个烟袋。",
            "青年女子": "一个青年女剑客，年方二八，身姿矫健。",
            "背枪客": "这是一个青年武士，背后背着一把亮银长枪。",
            "小孩": "这是海云镇的一个小孩子，年方五六岁，天真烂漫。",
            "野兔": "正在吃草的兔子。",
            "游客": "这是一个游客，背着手享受着山海美景。",
            "青年剑客": "这是一个青年剑客，眼含剑气。",
            "九纹龙": "这是海云阁四大杀手之一的九纹龙，凶狠非常。",
            "蟒蛇": "一只昂首直立，吐着长舌芯的大蟒蛇。",
            "暗哨": "这是海云阁的暗哨，身穿平常的布衣，却掩饰不了眼神里的狡黠和敏锐。",
            "石邪王": "据说这曾是武林魔道名门掌门，其武学造诣也是登峰造极。",
            "穿山豹": "这事海云阁四大杀手之一的穿山豹，行动敏捷，狡黠异常。",
            "地杀": "这是一名海云阁高级杀手。",
            "天杀": "这是一名海云阁高级杀手。",
            "海东狮": "这是海云阁四大杀手之首的海东狮，近十年来从未失手，手底已有数十个江湖名门掌门的性命。",
            "海云长老": "这是海云阁内的长老级杀手。",
            "红纱舞女": "这是一个身着轻纱的舞女，穿着轻薄，舞姿极尽媚态，眉目轻笑之间却隐含着淡淡的杀气。",
            "青纱舞女": "这是一个身着轻纱的舞女，穿着轻薄，舞姿极尽媚态，眉目轻笑之间却隐含着淡淡的杀气。",
            "紫纱舞女": "这是一个身着轻纱的舞女，穿着轻薄，舞姿极尽媚态，眉目轻笑之间却隐含着淡淡的杀气。",
            "白纱舞女": "这是一个身着轻纱的舞女，穿着轻薄，舞姿极尽媚态，眉目轻笑之间却隐含着淡淡的杀气。",
            "六如公子": "这是一个隐士，武学修为极高，也似乎并不受海云阁辖制。",
            "萧秋水": "传闻他出自天下第一名门浣花剑派，却无人知晓他的名讳。",
            "啸林虎": "这事海云阁四大杀手之一的啸林虎，武功极高。",
            "陆大刀": "江湖南四奇之首，人称仁义陆大刀。",
            "水剑侠": "江湖南四奇之一，外号叫作“冷月剑”",
            "乘风客": "江湖南四奇之一，外号叫作“柔云剑”。",
            "血刀妖僧": "「血刀圣教」掌门人，自称「武林第一邪派高手」，门下都作和尚打扮，但个个都是十恶不赦的淫僧。",
            "花铁枪": "江湖南四奇之一，外号叫作“中平枪”",
            "狄小侠": "其貌不扬，但却有情有义，敢爱敢恨，性格鲜明。",
            "水姑娘": "白衫飘飘，样貌清秀俏丽，人品俊雅，嫉恶如仇。",
            "虬髯犯人": "这人满脸虬髯，头发长长的直垂至颈，衣衫破烂不堪，简直如同荒山中的野人"
        },
        '幽冥山庄': {
            "野狗": "一只浑身脏兮兮的野狗。",
            "毒蛇": "当地特有的毒蛇，嘶嘶地发出警告，你最好不要靠近。",
            "樵夫": "你看到一个粗壮的大汉，身上穿著普通樵夫的衣服。",
            "鲍龙": "虬髯怒目的大汉。",
            "过之梗": "年约四五十岁，长眉黑髯，样子十分刚正。",
            "翁四": "武功不弱，而且为人正义，素得侠名。",
            "屈奔雷": "行事于正邪之间，性格刚烈，脾气古怪，不过从不作伤天害理之事，只是明目张胆的抢劫烧杀，这人可干得多了；据说他武功很高，内功外功兼备，铁斧也使得出神入化。",
            "伍湘云": "一身彩衣，垂发如瀑，腰上挽了一个小花结，结上两柄玲珑的小剑，更显得人娇如花，容光照人。",
            "殷乘风": "身段颀长而略瘦，但眉宇之间，十分精明锐利，犹如琼瑶玉树，丰神英朗",
            "辛仇": "自幼残肢断臂，受人歧视，故苦练奇技，仇杀江湖，无人不畏之如神鬼也。",
            "辛杀": "一个风程仆仆的侠客。",
            "蔡玉丹": "家财万贯，是丝绸商人，但仁侠异常，喜助人，义疏财，武功很高。",
            "辛十三娘": "这女魔头似具有动物的本能护体色，如贴在树上动也不动，便像一张叶子一般，如坐在地上动也不动，便像一颗岩石一般；在黑夜里便像是夜色的一部分，在雪地上就变成了雪花，谁也认不出来。",
            "暗杀": "这是跟随辛十三娘的杀手。",
            "巴司空": "他是大理国三公之一。一个又瘦又黑的汉子，但他的擅长轻功。",
            "追命": "脚力无双，所以轻功也奇佳，追踪术一流，嗜酒如命。",
            "艳无忧": "江湖中一大魔头，年轻貌美，因她擅‘吸血功’，以别人之鲜血，保持她的青春与容貌。",
            "摄魂鬼杀": "这是跟随艳无忧的杀手，武功颇为高深。",
            "柳激烟": "五湖九州、黑白两道、十二大派都尊称为“捕神”的六扇门第一把好手。",
            "龟敬渊": "一名鹑衣百结、满脸黑须的老人，眼睛瞪得像铜钱一般大，粗眉大目，虽然比较矮，但十分粗壮，就像铁罩一般，一双粗手，也比常人粗大一二倍。这人身上并无兵器，但一身硬功，“铁布衫”横练，再加上“十三太保”与“童于功”，据说已有十一成的火候，不但刀剑不入，就算一座山塌下来，也未必把他压得住！",
            "凌玉象": "银眉白须，容貌十分清灌，身形颀长，常露慈蔼之色，背插长剑",
            "慕容水云": "一个白发斑斑，但脸色泛红的老者，腰问一柄薄而利的缅刀，终日不离身，左右太阳穴高高鼓起，显然内功已入化境。",
            "沈错骨": "一个装扮似道非道的老者，黑发长髯，态度冷傲，手中一把拂尘。",
            "金盛煌": "富甲一方，武功盖世的“三十六手蜈蚣鞭”。",
            "冷血": "善剑法，性坚忍，他的剑法是没有名堂的，他刺出一剑是一剑，快、准而狠，但都是没招式名称的。",
            "庄之洞": "腰间缠着椎链子，一副精明能干的样子。",
            "高山青": "高头大马，高山青拿着的是一条玉一般的桃木棍，棒身细滑，杖尖若刀，长七尺六寸。",
        },
        '花街': {
            "花札敖": "魔宗长老，紫色瞳孔彰显他天魔功法已经大成。",
            "尊信门杀手": "尊信门叛将带领的杀手，个个心狠手辣。",
            "山赤岳": "魔宗长老，使一对八角大锤。",
            "鹰飞": "魔宗后起高手，是魔宗的希望。",
            "由蚩敌": "蒙古两大高手之一，擅用连环索。",
            "强望生": "火须红发，蒙古两大高手之一。",
            "莫意闲": "江湖黑道邪派高手之一，列名十大高手榜。",
            "甄素善": "黑道最富有诱惑力的女人，风情万种。",
            "谈应手": "黑道高手，十恶庄庄主，一方霸主。",
            "戚长征": "江湖中的后起之秀，新一代高手中最好的刀客，得左手刀封寒亲传。",
            "怒蛟高手": "这是黑道第一大帮-怒蛟帮的顶尖高手。",
            "韩柏": "阴差阳错成为高手的小书童。",
            "烈震北": "黑道最负盛名的神医，义气干云。",
            "赤尊信": "尊信门门主，黑榜十大高手之一。",
            "乾罗": "山城门主，黑榜十大高手之一。",
            "厉若海": "黑道高手排名第三，也有人说他实力与浪翻云相较也不差半分。",
            "浪翻云": "黑榜之首，江湖第一大帮的核心人物。",
            "方夜羽": "「魔师」庞斑的关门弟子，有「小魔师」之称，文秀之极，肌肤比少女还滑嫩，但身形颇高，肩宽膊阔，秀气透出霸气，造成一种予人文武双全的感觉。",
            "封寒": "黑榜天下第二的高手，天下第一刀客。",
            "盈散花": "据说来自西域，擅长波斯舞，每日来观舞之人络绎不绝，虽耗费颇高，但据说观舞可以领悟出武学攻击招式的奥秘。",
            "薄昭如": "清雅十分，舞姿倾城，据说观舞可领悟出防御之道。",
            "寒碧翠": "优雅十分，舞姿倾城，据说观舞可领悟出长生之道。",
        },
        '西凉城': {
            "响尾蛇": "一条带有剧毒，尾环在御敌时发出嗡嗡响的响尾蛇。",
            "官差": "这是西凉城衙门的一名官差，呆呆的不言不动，只是浑身颤抖。",
            "官兵": "西凉城的官兵，透着几分疲惫。",
            "驿卒": "这是别的城市前来此处送信的驿卒，满面尘土。",
            "苦力": "一个苦力打扮的汉子在这里等人来雇用。",
            "疯狗": "一只浑身脏兮兮的野狗，一双眼睛正恶狠狠地瞪著你。",
            "捕快": "京城的捕快，自是与外地的不同。",
            "伍定远": "黝黑的四方脸上一派威严，一望便知是这些官差的头儿，衙门的捕头。",
            "农民": "一个戴着斗笠，正在辛勤劳作的农民。",
            "马夫": "这是一个等候主人的马夫，耐心地打扫着马车。",
            "黑衣镖师": "身着黑衣的镖师，一看就是经验丰富的老江湖。",
            "齐润翔": "一名老者坐在镖局大厅，须长及胸，生得一张紫膛脸，正是燕陵镖局的总镖头齐润翔。",
            "镖师": "燕陵镖局的年青镖师，正在发呆。",
            "管家": "铁剑山庄管家，约莫五十来岁。",
            "李铁杉": "一名红光满面的高大老者。",
            "止观大师": "一名白衣灰须的老僧，双眼炯炯有神。",
            "慧清": "止观大师的亲传弟子，灰色衣袍。",
            "屠凌心": "身材矮小，一张脸丑陋无比，满是刀疤伤痕。",
            "昆仑杀手": "一个风程仆仆的侠客。",
            "醉汉": "一个喝得醉醺醺的年轻人。。。。。",
            "金凌霜": "六十来岁年纪，双目神光湛然。",
            "钱凌异": "一名高瘦的汉子，眼神阴毒。",
            "齐伯川": "燕陵镖局的少镖头，平日里飞扬跋扈，现在却是一副落魄样子。",
        },
        '高昌迷宫': {
            "糟老头子": "他满头白发，竟无一根是黑的，身材甚是高大，只是弓腰曲背，衰老已极",
            "阿曼": "貌美如花的哈萨克女子，苏普的妻子。",
            "苏普": "年轻俊朗的小伙子，虎背熊腰，是大漠第一勇士苏鲁克的儿子。",
            "太行刀手": "当地的刀功绝活大师，随便放在江湖中都是个了不起的刀霸。",
            "陈达海": "一个身穿羊皮袄的高大汉子，虬髯满腮，他腰间上左右各插著一柄精光闪亮的短剑。两柄短剑的剑把一柄金色，一柄银色。",
            "哈卜拉姆": "铁延部中精通「可兰经」、最聪明最有学问的老人。",
            "天铃鸟": "这鸟儿的歌声像是天上的银铃。它只在晚上唱歌，白天睡觉。有人说，这是天上的星星掉下来之後变的。又有些哈萨克人说，这是草原上一个最美丽、最会唱歌的少女死了之後变的。她的情郎不爱她了，她伤心死的。",
            "牧民": "哈萨克牧民，正在做着晚餐。",
            "霍元龙": "虬髯大汉，身挎长刀，一脸凶神恶煞。",
            "恶狼": "一头大灰狼，闪着尖利的牙齿。",
            "响尾蛇": "戈壁滩上的响尾蛇，你要小心了！",
            "骆驼": "行走于沙漠的商队骆驼。",
            "男尸": "一具男尸，看身上的装束似是中原武士。",
            "老翁": "身形瘦弱，形容枯槁，愁眉苦脸，身上穿的是汉人装束，衣帽都已破烂不堪。但他头发卷曲，却又不大像汉人。",
            "李文秀": "身着哈萨克长袍的汉族少女，眉清目秀，貌美如花。有人说，她唱出的歌声，便如同那天铃鸟一般动人。",
            "苏鲁克": "哈萨克第一勇士，力大无穷。",
            "车尔库": "哈萨克第二勇士，苏鲁克的好朋友。",
            "瓦耳拉齐": "白衣白袍的哈萨克高手，为李文秀所救。",
        },
        '京城': {
            "饥民": "天下灾荒四起，流民失所，饥肠辘辘，只能上京城来乞食。",
            "武将": "京城武将，虎背熊腰，胆大心细。",
            "侯府小姐": "这是一个侯府的小姐，身着华丽，谈吐优雅。",
            "小丫鬟": "一个笑嘻嘻的小丫头，侯府的丫鬟，跟小姐显是关系亲密。",
            "娟儿": "青衣秀士徒弟，艳婷之师妹，对师傅师姐有极强的依赖心，情牵阿傻，然而阿傻恢复记忆后忘记与娟儿的一切经历，离娟儿而去。",
            "九华山女弟子": "九华剑派的女弟子，身姿绰约，腰带长剑。",
            "东厂侍卫": "东厂的鹰犬，怕是又在做什么坏事",
            "城门官兵": "镇守京城的官兵，银盔银甲，威风凛凛。",
            "柳昂天": "胆小的大将军，赳赳武夫，官拜大都督，统领数十万兵马，却是个怯懦政客。他表面是天下英雄的领袖和希望，然而却一再屈从于强权，虚伪而懦弱。他不是残害忠良之辈，但也不会为了公道正义损害自己的功名利禄；与奸臣斗，并非因为伸张正义，而是因为自己也不好过。弱小者的沉默也许还能借口能力有限自身难保，然而处在这样位高权重的位置，胆小却是他千秋万世的罪恶。",
            "柳府铁卫": "柳府的私人卫队。",
            "江充": "大奸臣，年约五十，十八省总按察，官拜太子太师。阴谋诡诈，多疑善变，是景泰王朝的第一权臣，与东厂刘敬、征北大都督柳昂天鼎足而立。为一宗多年尘封的旧案屡出天山，威势所逼，终令朝廷要员弃官亡命，也让许多江湖人物走投无路。一个没有武功、没有文才的矮胖小人，凭着三寸不烂之舌和掌控他人的心理，便能够驱使天下英杰如驱使猪狗。所有祸端皆应他而起，纵你有神佛之能也要被他诬陷、算计。都说只因奸臣当道，所以才有天下英雄皆不得志。然，哪朝没有奸臣，何曾有过断绝？当皇帝被蒙蔽、直言之人死于横祸、天下黎民尽皆哀嚎的时候，为何朝堂之上鸦雀无声；而元凶授首、挫骨扬灰之际，却又为何如此人声鼎沸、争先恐后？其实，胆怯的我们都曾是小人的帮凶，在每个时代里，扮演着每一个肮脏的庞然大物的吹鼓手。江充，便是所有沉默的天下人心里开出的恶之花。",
            "莫凌山": "昆仑剑派高手之一，心狠手辣。",
            "昆仑弟子": "昆仑剑派的弟子，白衣长剑。",
            "安道京": "东厂大太监之一，功夫深不可测。",
            "东厂高手": "东厂高手，面目冷漠。",
            "郝震湘": "本是一方名捕，奈何受人冤枉入狱，为保家人性命不得已委身于锦衣卫旗下，满面惆怅。",
            "锦衣卫": "本是朝廷卫士，却已受东厂所辖。",
            "韦子壮": "武当弟子，现为侯府卫士统领，功力深厚。",
            "王府卫士": "善穆侯府的卫士，双目炯炯有神，腰挂长刀。",
            "风流司郎中": "俊俏无比的当朝司郎中，风流倜傥，当朝大学士之子，也是少林天绝神僧关门弟子。",
            "伍崇卿": "伍定远的义子，本为一流浪儿，伍定远收养了他，并取名伍崇卿。武英帝复辟后为“义勇人”成员。后性情大变，怨伍定远懦弱退缩。想用自己的方式保护伍定远。曾在“魁星站五关”后蒙面黑衣独自一人杀入太医院，击败了包括苏颖超、哲尔丹在内的众多高手。",
            "苏颖超": "武林四大宗师之一华山派掌门宁不凡嫡传弟子，宁不凡退隐后，接任华山掌门，为武林新一代的俊杰。才貌双全的苏颖超，和「紫云轩」少阁主琼芳一见钟情，可谓青梅竹马。在太医院中被黑衣人伍崇卿击败后，接着练剑遭遇瓶颈，背负上了沉重的心理包袱。",
            "店伙计": "一个酒楼的小伙计，十五六岁上下。",
            "学士": "一个在六部任职的学士，虽着便服，但气度不凡。",
            "书生": "一个斯文的书生，穿着有些寒酸。",
            "打手": "赌坊打手，满脸横肉，手持大锤。",
            "藏六福": "青龙赌坊的老板，五十岁上下，腰间系着一块绝世玉璧，眼睛里闪着狡黠的光芒。",
            "胡媚儿": "绝美无比的性感尤物，她虽使毒厉害，但却是一个极重情义之人。她认死理，为江充办事，便是一心一意，纵然江充势败，也是全力为其寻找玉玺。后来遇见卢云，两人日久相处，产生爱意，更是愿意为了卢云牺牲自己的一切。后来在与卢云返回自己家乡的途中遭到“镇国铁卫”的追杀迫害，不得已成为“镇国铁卫”的一员，加入了“客栈”。",
            "荷官": "白虎赌坊的荷官，身姿曼妙，烟视媚行。",
            "杂货贩子": "一个卖杂货的贩子，你也许可以看看需要些什么。",
            "苦力": "进城找活路的苦力，衣着随便，满身灰尘。",
            "掌柜": "驿站的大掌柜，眼神深邃。",
            "醉汉": "赌坊里出来的醉汉，嘴里嘟嘟囔囔些什么，也许是一些赌坊的秘密。",
            "游客": "来京城游玩的外地人，对大城市的繁华目不暇接，满眼都是惊喜的神色。",
            "顾倩兮": "出生扬州，其父乃景泰朝兵部尚书顾嗣源，未婚夫是景泰朝状元卢云，后因为卢云掉入水瀑音讯全无，一边抚养卢云留下的小婴儿杨神秀，一边为父亲被正统皇帝下狱的事而四处奔波，后因其父在狱中自杀，为继承父亲的志向开办书林斋，批判朝政，与正统皇帝针锋相对。后嫁给佛国的创始人杨肃观。正统十年，再遇卢云。是典型的学识渊博，见识不凡的奇女子，当之无愧的扬州第一美女。",
            "王一通": "千万个小人物中的一个，读过书算过账，没有经世致用之才，没有平定一方之力，匡扶天下他没有这个志气，建功立业怕也没有这个本事。老婆刚又生了个孩子，家里却又有债主上门，正急得如热锅上的蚂蚁。",
            "贵妇": "城里大户人家的贵妇，正要上山拜佛还愿。"
        },
        '越王剑宫': {
            "金衣剑士": "越国最顶尖的剑士，身着金衣，手持长剑。",
            "越王": "越王身披锦袍，形貌拙异，头颈甚长，嘴尖如鸟，对你微微一笑，你却觉得毛骨悚然。",
            "文种": "春秋末期著名的谋略家。越王勾践的谋臣，和范蠡一起为勾践最终打败吴王夫差立下赫赫功劳。",
            "青衣剑士-极": "来自吴国的精英剑士，极度高傲自负。",
            "铸剑师": "一个风程仆仆的侠客。",
            "薛烛": "",
            "青衣剑士-御": "来自吴国的精英剑士，极度高傲自负。",
            "青衣剑士": "来自吴国的精英剑士，极度高傲自负。",
            "锦衣剑士": "越王剑宫的精英剑士，身佩长剑。",
            "西施": "施夷光，天下第一美女，世人称为西施，尊称其“西子“。越国苎萝村浣纱女。她天生丽质、秀媚出众。",
            "风胡子": "楚国铸剑师，身着玄色短衫，欧冶子的二位弟子之一。",
            "范蠡": "越国当朝大夫，越王倚重的重臣。",
            "山狼": "欧余山中的霸主，山狼，比一般的野狼大一倍有余。",
            "采药少女": "在山中采药户的小女孩，只有十二三岁，却已能熟练地行走山间，采集药材。",
            "山羊": "雪白的羊毛，在少女的驯服下，乖巧在吃草。",
            "青竹巨蟒": "青竹林中的巨型蟒蛇，通体翠绿，隐藏在竹林中，等待猎物自投罗网。",
            "牧羊少女": "这少女一张瓜子脸，睫长眼大，皮肤白晰，容貌甚是秀丽，身材苗条，弱质纤纤，手持一根长竹竿。",
            "白猿": "一头巨大的白猿，若是见生人来了，一声长啸，跃上树梢，接连几个纵跃，已窜出数十丈外，但听得啸声凄厉，渐渐远去，山谷间猿啸回声，良久不绝。",
            "采药人": "一个山中的采药人，年纪近五十了。",
            "老奶奶": "一个拄着拐杖的老奶奶，似是在等着孙女回家。",
            "猎人": "山中的猎户，正在寻觅今天的收获。",
            "吴国暗探": "来自吴国的暗探，隐藏在山中，负责刺探剑宫内的消息。",
            "欧余刀客": "欧余山中隐藏的刀客，武功深不可测。",
            "山狼王": "欧余山中的霸主，山狼，比一般的野狼大一倍有余。",
            "毒蛇": "一条外表看起来十分花哨的蛇，毒性巨强。",
            "樵夫": "一个砍柴为生的樵夫。"
        },
        '江陵': {
            "茶叶贩子": "来自外地的茶叶贩子，来此收购也贩卖茶叶。",
            "书生": "一个年纪轻轻的读书人，拿着书本，摇头晃脑。",
            "乞丐": "一个衣衫褴褛的乞丐，口中嘟囔着一些模糊的语句。",
            "妇人": "前来买米的妇人，手里拿着米袋。",
            "米店伙计": "米店的小伙计，正忙的不可开交。",
            "米三江": "一个青衣小帽的中年商人，是米店的大掌柜。",
            "花小倩": "一个二十出头，笑容动人的少女，有人说她是城中最美丽的少女，每天都会收到不少求爱的信笺呢。",
            "巡城参将": "江陵巡城参将，身材高大，脚步沉稳。",
            "巡城府兵": "江陵总兵府的巡城士兵，手持长矛，腰别钢刀。",
            "客栈小二": "手拿酒壶菜碟，脚步如飞，忙得不亦乐乎，抬头看你一眼，飞快地给你指了个座位。",
            "酒保": "客栈的小酒保，年纪大约十来岁而已。",
            "江小酒": "客栈老板的女儿，一笑起来脸上就有两个酒窝。",
            "江老板": "客栈的老板，身材不高，却自有一番气度。",
            "苦力": "一个衣衫褴褛的苦力，正在街角坐着等活儿上门。",
            "雷动山": "霹雳门两湖分舵的舵主，太阳穴高高鼓起，显然是有极深厚的内功。",
            "王铁柱": "一个前来求药的庄稼汉，看起来颇为着急。",
            "水掌柜": "江陵府远近几百里最出名的神医，对药材和医理的理解出神入化。",
            "驿使": "一个远方驿站来的信使，看起来颇为悠闲，应是没有公务在身。",
            "江陵府卫": "江陵总兵府的卫士，身披软甲，腰胯长刀。",
            "趟子手": "镖局的趟子手，是镖局最低级的打手。",
            "城门守卫": "江陵城的守卫士兵，铁剑铁甲。",
            "截道恶匪": "截道的恶匪，正恶狠狠地看着你。",
            "漕帮好手": "漕帮的好手，个个都是浪里白条。",
            "扬子鳄": "凶狠的鳄鱼，正不怀好意地盯着你。",
            "分身": "周长老的分身。",
            "萧长河": "江陵镖局总镖头，一身长衫，手握一对钢珠，颇有威不可犯之风。",
            "脱不花马": "大月氏远道而来的最好的宝马，可日行八百。",
            "周长老": "萧长河相交三十多年的生死之交，也是镖局日常事务最主要的负责人。",
            "余小鱼": "豆蔻年华的小女孩，长得颇为清秀，正在熟练的整理着小食店，一副有条不紊成竹在胸的样子。",
            "渔老": "念过半百的老人，精神很好，手中拿着一张渔网在仔细修复。",
            "醉汉": "一个醉醺醺的男人，嘴里不知道嘟囔着什么。",
            "黑衣人": "一个鬼鬼祟祟的黑衣人，腰间似乎藏着兵器。",
            "癞蛤蟆": "趴在城外泥路两旁的沼泽地，正呱呱呱地叫着，真让人心烦。",
            "霍无双": "两湖最好的手艺人，从他手里出品的瓷器，白若瑞雪，清透如浮云。",
            "金莲": "玉泉酒坊老板的相好，眉目流媚，身姿诱人。",
            "邋遢男子": "一个醉醺醺的邋遢男子，正在对墙小便，你只想赶紧捂着鼻子走开。",
            "酒坊伙计": "酒坊的小伙计，忙得不可开交，瘦骨嶙峋。",
            "九叔": "酒坊现在的老板，身上一派珠光宝气，却有人说他是盗了哥哥的产业。",
            "萧劲": "江陵府总兵，统管两湖地界，手握数万大军。",
            "参将": "江陵总兵府的参将，都是萧劲手下最得力的干将。",
            "江陵府兵": "江陵府统御下的士兵，一举一动都有干练之风，看起来颇为训练得法。"
        }
    };

    //杀死 比试 对话 打探-------给予，物品，搜索此地待完成
    function kill_task(npcName) {
        //var shuchutishi=npcName;
        if (g_gmain.is_fighting) {
            return;//战斗中
        }
        var r = g_obj_map.get("msg_room");
        if (r) {
            for (var b = 1; r.get("npc" + b); b++) {
                var l = r.get("npc" + b).split(',');
                if (g_simul_efun.replaceControlCharBlank(l[1]) == npcName) {
                    clickButton('kill ' + l[0]);

                }
            }
        }
    }
    function fight_task(npcName) {
        if (g_gmain.is_fighting) {
            return -1;//战斗中
        }
        var r = g_obj_map.get("msg_room");
        if (r) {
            for (var b = 1; r.get("npc" + b); b++) {
                var l = r.get("npc" + b).split(',');
                if (g_simul_efun.replaceControlCharBlank(l[1]) == npcName) {
                    clickButton('fight ' + l[0]);

                }
            }
        }
    }
    function ask_task(npcName) {
        if (g_gmain.is_fighting) {
            return -1;//战斗中
        }
        var r = g_obj_map.get("msg_room");
        if (r) {
            for (var b = 1; r.get("npc" + b); b++) {
                var l = r.get("npc" + b).split(',');
                if (g_simul_efun.replaceControlCharBlank(l[1]) == npcName) {
                    clickButton('ask ' + l[0]);
                    return 1;
                }
            }
        }
    }
    function dt_task(npcName) {
        if (g_gmain.is_fighting) {
            return -1;//战斗中
        }
        var r = g_obj_map.get("msg_room");
        if (r) {
            for (var b = 1; r.get("npc" + b); b++) {
                var l = r.get("npc" + b).split(',');
                if (g_simul_efun.replaceControlCharBlank(l[1]) == npcName) {
                    clickButton('npc_datan ' + l[0]);
                }
            }
        }
    }
    function cmd_task(cmdName) {
        var r = g_obj_map.get("msg_room");
        if (r) {
            for (var i = 1; r.get('cmd' + i); i++) {
                if (ys_replace(r.get('cmd' + i + '_name')).indexOf(cmdName) != -1) {
                    go(r.get('cmd' + i));
                    return 1;
                }
            }
        }
    }

    var isDelayCmd = 1, // 是否延迟命令
        cmdCache = [],      // 命令池
        timeCmd = null,     // 定时器句柄
        cmdDelayTime = 400; // 命令延迟时间

    var bixueSwitch = false;
    var bishouSwitch = false;

    //var hitKeys = "你一不留神|你已是血|你急|你难抗|纵使你|对准你|攻至你|抓破你|贯穿你|你面对|你已是|你只觉|罩了你|向了你|将你吞没|将你逼得|完全将你|瞬间将你|将你周身|在你眼前|打中你|落在你|在你右|按在你|击在你|往你|往而你|向身下的你|在了你|只在你|由你|射你|捣你|扫你|过你|拍你|点你|劈你|取你|向你|像你|奔你|着你|斩你|扑你|朝你|击你|打你|刺你|你急急|要你|扣你|令你|指你|冲你|渡你|卷你|由你|于你|气空力尽的你|你竭力破解|你挡无可挡|你无法分辨|你眼花瞭乱|你愕然间|你生命之火|你根本无法看清|你大惊失色|你被震|起首式|平平一剑|大超从前|四面八方响起|将周围生灵|顺刺|倒刺".split("|");
    var hitKeys = ["你如", "教你", "向你", "点你", "指你", "你只觉", "你为", "往你", "割向你", "你反应", "青城", "大嵩阳", "裹向你", "你的对攻无法击破", "推向你", "倒刺", "击向你",
        "准你", "你的姿态", "奔你", "渡你", "取你", "朝你", "刺你", "击你", "你面对", "你根本", "抓向你", "劈下", "砍向你", "扣你", "并力", "你这一招", "吹向你",
        "到你", "至你", "你被", "卷你", "将你", "了你", "于你", "你再", "你已是", "你已是", "双目内视",
        "你愕然", "扫你", "从你", "你的招式尽", "削你", "扑你", "取你", "令你",
        "单手舞动，单刀离背而出", "冲你", "你一时", "落在你", "拍你", "切你", "斩你",
        "砍你", "砸你", "趁你", "封你", "待你", "在你", "与你", "劈你", "然你",
        "你正搜寻", "你发现时", "你犹如", "袭你", "使你", "你受困", "你在极端",
        "钻你", "你未被击中却亦是身受", "你避无可避", "你分身乏术", "算你", "你被滚滚",
        "哪怕你", "你唯有", "你瞬不及", "你步步陷危", "你顿时", "你已呈九死", "锁你", "你观之",
        "中你", "只见你", "你受此浩劲", "你急急而挡", "你神识早已", "你纵使", "你难抗",
        "瞬间你已是", "你愕然", "使你", "你躲闪不及", "逼近你", "你宛如一叶", "你抵御不住",
        "你自感", "纵是你", "捣你", "你唯有", "你颓然", "你挡无可挡", "你心头一痛", "尽的你",
        "你当场受创", "你脸露惧", "管你"];
    var ignoreList = ['你招式之间组合', '将你的力道卸去大半', '你这几招配合起来', '你将招式连成'];

    var Jianshi = { tianming: 0, mohuang: 0, jianghu: 0, jianghuEnd: 0, showcode: 0, longxiang: 0, xuanyun: 0, wk: 0, sl: 0, zha: 0, xs: 0, dr: 0, chonglian: 0, qianlong: 0, tianjian: 0, jstimer: 0, qingzhengxie: 0, bangzhan: 0, bx: 0, bs: 0, sp: 0, sys: 1, renwu: 0, zhengxie: 0, teshu: 0, tf: 0, yx: 0, gw: 0, hd: 0, qx: 0, qxmj: 0, qxhg: 0, gensha: 0 };

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    //加入屏幕提示
    function InforOutFunc(text, goLink, type) {
        var node = document.createElement("span");
        node.className = "out2";
        node.style = "color:rgb(255, 127, 0)";
        if (goLink) {
            var anode = document.createElement("a");
            anode.style = "text-decoration:underline;color:yellow";
            anode.setAttribute("onClick", 'go("' + goLink + '")');
            if (type) {
                anode.appendChild(document.createTextNode(text));
            } else {
                anode.appendChild(document.createTextNode(text + ':' + goLink));
            }
            node.appendChild(anode);
        } else {
            var textnode = document.createTextNode(text);
            node.appendChild(textnode);
        }
        document.getElementById("out2").appendChild(node);
    }

    //加入屏幕提示
    function InforOutFuncClick(text, click) {
        var node = document.createElement("span");
        node.className = "out2";
        node.style = "color:rgb(255, 127, 0)";
        if (click) {
            var anode = document.createElement("a");
            anode.style = "text-decoration:underline;color:yellow";
            anode.setAttribute("onClick", '' + click + '');
            anode.appendChild(document.createTextNode(text));
            node.appendChild(anode);
        } else {
            var textnode = document.createTextNode(text);
            node.appendChild(textnode);
        }
        document.getElementById("out2").appendChild(node);
    };

    async function clickButtonAsync(s) {
        clickButton(s);
        await new Promise(function (resolve) {
            setTimeout(resolve, 400);
        });
    };

    var Base = {
        init: function () {
            this.skills();
            this.btnArrSet();
            this.writeBtn();
        },
        qi: 6,
        buttonWidth: '80px',
        buttonHeight: '20px',
        currentPos: 60,
        delta: 30,
        timeInter: 250,
        pozhaoNum: '1',
        DrunkMan_targetName: 'luoyang_luoyang26',
        correctQu: function () {

            var url = window.location.href;
            var qu = null;
            if (url.indexOf('direct37') != '-1') {
                qu = 37;
            }
            if (url.indexOf('direct38') != '-1') {
                qu = 38;
            }
            if (getQueryString('area') == '1') {
                qu = 1;
            }
            if (getQueryString('area') == '37') {
                qu = 37;
            }
            if (getQueryString('area') == '38') {
                qu = 38;
            }
            return qu;
        },
        getCorrectText: function (txt) {
            var url = window.location.href;
            var correctSwitch = false;
            if (url.indexOf(txt) != '-1') {
                correctSwitch = true;
            }
            return correctSwitch;
        },
        tianjianTarget: '',
        mySkillLists: useSkills,
        skills: function () {
            // 38区laodap123
            if (this.getCorrectText('4316804') && this.correctQu() == '38') {
                this.mySkillLists = '四海断潮斩；覆雨剑法；六脉神剑';
            }
            // 37区东方红
            if (this.getCorrectText('4253282')) {
                this.mySkillLists = '月夜鬼萧；降龙廿八掌；无剑之剑；同归绝剑；天极剑；步玄七诀';
            }
            // 王有财
            if (this.getCorrectText('4219507')) {
                this.mySkillLists = '月夜鬼萧；冰月破魔枪；九溪断月枪；神龙东来';
            }
            // 火狼
            if (this.getCorrectText('4238943')) {
                this.mySkillLists = '月夜鬼萧；冰月破魔枪；九溪断月枪；神龙东来';
            }
            // 跟班
            if (this.getCorrectText('7030223')) {
                this.mySkillLists = '月夜鬼萧；冰月破魔枪；九溪断月枪；神龙东来';
            }
        },
        btnArrSet: function () {
            var btnGroupArr = btnGroup;

            for (var i = 0; i < btnOtherGroup.length; i++) {
                btnGroupArr.push(btnOtherGroup[i]);
            }
            // if (isQianlongId()) {
            // for (var i = 0; i < qianLongGroup.length; i++) {
            //     btnGroupArr.push(qianLongGroup[i]);
            // }
            // }
            //jianghuGroup
            for (var i = 0; i < jianghuGroup.length; i++) {
                btnGroupArr.push(jianghuGroup[i]);
            }
            //vip
            // if (isVip()) {
            for (var i = 0; i < btnVipGroup.length; i++) {
                btnGroupArr.push(btnVipGroup[i]);
            }
            // } else {
            // for (var i = 0; i < btnMoreGroup.length; i++) {
            //     btnGroupArr.push(btnMoreGroup[i]);
            // }
            // }
            if (isLittleId()) {
                for (var i = 0; i < btnMoreGroup.length; i++) {
                    btnGroupArr.push(btnMoreGroup[i]);
                }
            }
            if (isSelfId()) {
                for (var i = 0; i < btnSelfGroup.length; i++) {
                    btnGroupArr.push(btnSelfGroup[i]);
                }
            }

            for (var i = 0; i < btnWuYongGroup.length; i++) {
                btnGroupArr.push(btnWuYongGroup[i]);
            }

            this.btnArr = btnGroupArr;
        },
        btnArr: [],
        writeBtn: function () {
            var btnArr = this.btnArr;
            for (var i = 0; i < btnArr.length; i++) {
                var rightPos = 0;
                if (i > 18) {
                    // rightPos = '360';
                    rightPos = '90';
                }
                if (i > 37) {
                    // rightPos = '450';
                    rightPos = '180';
                }
                if (i == 19) {
                    this.currentPos = 60;
                }
                if (i == 38) {
                    this.currentPos = 60;
                }
                var btnName = 'btn' + i;
                btnName = document.createElement('button');
                btnName.innerText = btnArr[i].name;
                btnName.style.width = this.buttonWidth;
                btnName.style.height = this.buttonHeight;
                btnName.style.position = 'absolute';
                btnName.style.zIndex = '10';
                btnName.style.right = rightPos + 'px';
                btnName.id = 'btn' + btnArr[i].id;
                btnName.className = 'btn-add btn-base';
                btnName.style.top = this.currentPos + 'px';
                this.currentPos = this.currentPos + this.delta;
                document.body.appendChild(btnName);
                // document.body.appendChild(btnName);
                if (btnArr[i].function) {
                    btnName.addEventListener('click', btnArr[i].function)
                }
            }
        }
    };

    var timeInter = Base.timeInter;
    var jhxh_Interval = null;
    function jhxh_Func(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '江湖悬红') {
            Dom.html('停止悬红');
            Jianshi.xuanhong = 1;
            Jianshi.xhnpc = [];
            go('jh 1;w;event_1_40923067;');
            jhxh_Interval = setInterval(function () {
                for (var i = 0; i < Jianshi.xhnpc.length; i++) {
                    if (ask_task(Jianshi.xhnpc[i]) == 1) {
                        Jianshi.xhnpc.splice(i, 1);
                    }
                }
            }, 300);
        } else {
            Jianshi.xuanhong = 0;
            clearInterval(jhxh_Interval);
            Dom.html('江湖悬红');
        }
    }
    
    var buttonhideButton = document.createElement("button");
    buttonhideButton.className = "show-btn";
    buttonhideButton.innerText = "显";
    buttonhideButton.style.position = "absolute";
    buttonhideButton.style.right = "20px";
    buttonhideButton.style.bottom = "150px";
    buttonhideButton.style.width = "30px";
    buttonhideButton.style.height = "30px";
    buttonhideButton.style.borderRadius = "50%";
    buttonhideButton.style.background = "#fff";
    // buttonhideButton.style.textAlign = "center";
    document.body.appendChild(buttonhideButton);
    buttonhideButton.addEventListener("click", buttonhideFunc);
    // 隐藏按钮
    function buttonhideFunc(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();

        if (DomTxt == '显') {
            showButton();
            Dom.html('隐');
        } else {
            hideButton();
            Dom.html('显');
        }
    }
    function hideButton() {
        $('.btn-add').hide();
        $('.btn-others').hide();
        $('.btn-place').hide();
        $('.btn-base').hide();
        showBtnSwitch = 0;
    }
    function showButton() {
        $('#btn0').html('显示按键0');
        $('.btn-add').show();
        $('.btn-others').hide();
        $('.btn-place').hide();
        $('.btn-base').each(function (i) {
            if (i > 1) {
                $(this).hide();
            }
        });
        $('.btn-searchWay').show();
        $('#btn-chuzhao').hide();
        showBtnSwitch = 1
    }
    var showBtnSwitch = 0;
    function hideShowBtn(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (showBtnSwitch == 0) {
            Dom.html('显示按键0');
            $('.btn-add').show();
            $('.btn-others').hide();
            $('.btn-place').hide();
            $('.btn-base').each(function (i) {
                if (i > 1) {
                    $(this).hide();
                }
            });
            $('.btn-searchWay').show();
            // $('#btn-chuzhao').hide();
            showBtnSwitch = 1
        } else if (showBtnSwitch == 1) {
            Dom.html('显示按键1');
            $('.btn-add').show();
            $('.btn-others').hide();
            $('.btn-place').hide();
            $('.btn-base').each(function (i) {
                if (i > 18) {
                    $(this).hide();
                }
            });
            $('.btn-searchWay').show();
            showBtnSwitch = 2
        } else if (showBtnSwitch == 2) {
            Dom.html('显示按键2');
            $('.btn-base').show();
            $('.btn-others').show();
            $('.btn-place').hide();
            $('#btn-chuzhao').show();
            $('.btn-ql-place').hide();
            showBtnSwitch = 3
        } else if (showBtnSwitch == 3) {
            Dom.html('隐藏按键');
            $('.btn-searchWay').show();
            // $('.btn-add').hide();
            $('.btn-base').each(function (i) {
                if (i > 18) {
                    $(this).hide();
                }
            });
            $('.btn-ql-place').show();
            $('.btn-place').show();
            showBtnSwitch = 0
        }
    }
    var AutoPaiHangFuncIntervalFunc = null;
    function PaiHangFunc(e) {
        var Dom = $(e);
        var DomTxt = Dom.html();
        if (DomTxt == '打榜') {
            Dom.html('停打榜');
            clickButton('sort');
            clickButton('fight_hero 1');
            AutoPaiHangFunc();
        } else {
            Dom.html('打榜');
            clearPaiHang();
        }
    }

    function AutoPaiHangFunc() {
        // 间隔1500毫秒查找打一次
        AutoPaiHangFuncIntervalFunc = setInterval(AutoPaiHang, 500);
    }
    function clearPaiHang() {
        clearInterval(AutoPaiHangFuncIntervalFunc);
        AutoPaiHangFuncIntervalFunc = null;
    }
    function AutoPaiHang() {
        if ($('span.outbig_text:contains(战斗结束)').length > 0) {
            isOnstep1 = false;
            // go('golook_room');
            go('prev_combat');
            clickButton('fight_hero 1');
        }
        else if (isContains($('span:contains(今日挑战)').text().slice(-19), '今日挑战高手的次数已达上限，明日再来。')) {
            clearPaiHang();
            $('#btn-hitBang').html('打榜');
            clickButton('home');
            console.log('打完收工！');
        }
    }

    function buyLicai() {
        //clickButton('touzi_jihua2 buy 6', 1);
        // clickButton('tzjh_lq', 1)
        go('jh 2;n;n;n;n;n;n;n;e;touzi_jihua2 buygo 6;tzjh_lq;home');
    };
    //Base.mySkillLists = '万流归一；云梦归月；天魔妙舞；凤舞九天；踏月留香';
    // Base.skills();
    /* 更换技能方法 :start */
    async function interServerFn1(e) {
        var skillsText = '凤舞九天；踏月留香；万流归一；云梦归月；天魔妙舞；步玄七诀';
        if (followTeamSwitch) {
            skillsText = '霹雳弹';
        }
        var skills = prompt("请输入要使用的技能", skillsText);
        if (skills) {
            Base.mySkillLists = skills;
            if (followTeamSwitch) {
                Base.qi = 6;
            }
            if (skills.indexOf('万流归一') > -1) {
                Base.qi = 5;
            }
        } else {
            Base.skills();
            Base.qi = 3;
        }
    };
    /* 更换技能方法 :end */

    function changeTianJianTarget(e) {
        var targetText = '天剑谷卫士';

        var targetsPro = prompt("请更改天剑目标", targetText);
        if (targetsPro) {
            Base.tianjianTarget = targetsPro;
        } else {
            Base.tianjianTarget = '';
        }
    }
    function teamSay(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '队长说话') {
            go1('cus|leader|1');
            Dom.html('停止说话');
        } else {
            go1('cus|leader|0');
            Dom.html('队长说话');
        }
    }
    function bindClickEvent() {
        $(document).on('click', '.cmd_click2', function () {
            var clickText = $(this).attr('onclick');
            if (Jianshi.showcode) {
                log(clickText);
            }
        });
        $(document).on('click', '.cmd_click3', function () {
            var clickText = $(this).attr('onclick');
            if (Jianshi.showcode) {
                log(clickText);
            }
        });
        $(document).on('click', "button[class^='cmd_click_exits']", function () {
            var clickText = $(this).attr('onclick');
            if (Jianshi.showcode) {
                log(clickText);
            }
        });
    }
    var followTeamSwitch = 0;
    function followTeam(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '跟队长走') {
            Dom.html('不跟走');
            followTeamClick();
        } else {
            Dom.html('跟队长走');
            followTeamClick();
            // followTeamSwitch = 0;
            // go1('cus|follow|');
        }
    }
    function followTeamClick() {
        if (followTeamSwitch){
            followTeamSwitch = 0;
            go1('cus|follow|');
        }else{
            followTeamSwitch = 1;
            clickButton("team");
            setTimeout(() => {
                var team_msg = g_obj_map.get("msg_team");
                if (team_msg) {
                    var team_elements = team_msg.elements;
                    for (var i = 0; i < team_elements.length; i++) {
                        if (team_elements[i].key.indexOf('member1') >= 0) {
                            var name = team_elements[i].value.split(',')[1];
                            followuser.userName = name;
                            go1('cus|follow|' + name);
                        }
                    }
                }
            }, 2000);
        }
    }
    var qianlongNumber = 0;
    function JianQianlong(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '监视潜龙') {
            // qianlongNumber = prompt("请输入要序号", qianlongNumber);
            Dom.html('不监视');
            Jianshi.qianlong = 1;
            isOnstep1 = false;
            setCookie(window.userId + 'qljs', '1')
        } else {
            Dom.html('监视潜龙');
            Jianshi.qianlong = 0;
            setCookie(window.userId + 'qljs', '0')
        }
    }
    function JianJianghu(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (g_obj_map){
            if (DomTxt == '监视江湖') {
                Dom.html('不打江湖');
                Jianshi.jianghu = 1;
                my_family_name = g_obj_map.get("msg_attrs").get("family_name");
                // my_family_name = prompt("请输入您的门派或释、道、儒", family_name);

                log('我的门派：' + my_family_name);
                var userTitle = g_obj_map.get("msg_attrs").get("title");
                var family_type = null;
                if (userTitle.indexOf('入室') > 0) {
                    family_type = returnRuShiType();
                    if (family_type) {
                        var family_type_text = '我的入室：' + family_type;
                        log(family_type_text);
                    } else {
                        family_type = '';
                    }
                }

                var word = family_type ? '，入室：' + family_type : '';

                g_gmain.notify_fail(HIG + "开始监听江湖门派：" + my_family_name + word + NOR);
                setCookie(window.userId + 'jianghu', '1')
            } else {
                Dom.html('监视江湖');
                Jianshi.jianghu = 0;
                setCookie(window.userId + 'jianghu', '0')
            }
        }else{
            JianJianghu(e);
        }
    }
    function openBiXue(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '开鼻血') {
            Dom.html('关鼻血');
            Jianshi.bx = 1;
        } else {
            Dom.html('开鼻血');
            Jianshi.bx = 0;
        }
    }
    function openBaiShou(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '开白首') {
            Dom.html('关白首');
            Jianshi.bs = 1;
        } else {
            Dom.html('开白首');
            Jianshi.bs = 0;
        }
    }
    function killThreeFloor(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '打三楼') {
            Dom.html('不打三楼');
            Jianshi.sl = 1;
            waitKillThreeFloor();
        } else {
            Dom.html('打三楼');
            Jianshi.sl = 0;
        }
    }
    // 循环查看击杀NPC
    function waitKillThreeFloor() {
        setTimeout(() => {
            var careNpc = ['分身'];
            for (var i = 0; i < careNpc.length; i++) {
                var hasNpc = hasSamePerson(careNpc[i]);
                // console.log(hasNpc);
                if (hasNpc.length > 0 && hasNpc.length <= 4) {
                    var npcId = hasNpc[0][0];
                    if (npcId) {
                        Base.mySkillLists = '万流归一；云梦归月；天魔妙舞';
                        clickButton('kill ' + npcId);
                    }
                }
            }
            if (Jianshi.sl) {
                waitKillThreeFloor();
            }
        }, 1000);
    }
    var isDoneXueShan = false;
    // 雪山弟子
    function killXue(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '打雪山') {
            if (isDoneXueShan) {
                return false;
            }
            Dom.html('不打雪山');
            Jianshi.xs = 1;
            waitKillXueShan();
            setCookie(window.userId + 'xsdz', '1')
            // dunXueShan();
        } else {
            Dom.html('打雪山');
            Jianshi.xs = 0;
            setCookie(window.userId + 'xsdz', '0')
        }
    }
    function openXueShan() {
        var dom = $('#btns5');
        if (dom.html() == '打雪山') {
            dom.trigger('click');
        }
    }
    function closeXueShan() {
        var dom = $('#btns5');
        if (dom.html() == '不打雪山') {
            dom.trigger('click');
        }
    }
    // 移除色彩符号
    function removeChart(text) {
        var txt = g_simul_efun.replaceControlCharBlank(
            text.replace(/\u0003.*?\u0003/g, "")
        );
        return txt;
    }
    //根据帮派信息 去相应地址
    var isGone = false;
    function goCorrectBingXue(msg) {

        if (g_gmain.is_fighting) {
            return;//战斗中
        }
        msg = removeChart(msg);
        //name    g_obj_map.get('msg_room').get('map_id')
        var splitMsg = msg.split('-');
        var place = splitMsg[1].replace(/\n/g, "");
        var name = splitMsg[0].split('位于')[1].replace(/\n/g, "");

        renturnObj = place;
        switch (name) {
            case 'snow':
                goWay = 'jh 1;e;e;s;ne;ne';
                break;
            case 'yangzhou':
                goWay = 'jh 5;n;n;n;n;n;e;n;e;n;w;n;n';
                break;
            case 'emei':
                goWay = 'jh 8;w;nw;n;n;n;n;e;e;n;n;e;n;n;n;n;w;n;n;n;n;n;n;n;n;n;nw;nw;n;n';
                break;
            case 'shaolin':
                goWay = 'jh 13;n;n;n;n;n;n;n;n;n;n';
                //立雪亭
                break;
            case 'mingjiao':
                goWay = 'jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;se;se;e';
                break;
            case 'heilongtan':
                goWay = 'jh 24;n;n;n;n;n;n;n;n;w;n;n';
                break;
            case 'xingxiu':
                goWay = 'jh 28;n;w;w;w;w;w;w;nw;ne;nw;ne;nw;ne;nw;ne;nw;ne;nw;ne;e';
                break;
            case 'resort':
                goWay = 'jh 31;n;n;n;w;w;w;w;n;n;n';
            case 'binghuo':
                if (place == '冰湖') {
                    goWay = 'jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;e';
                }
                if (place == '雪山峰顶') {
                    goWay = 'jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;ne;n';
                }
                if (place == '雪原温泉') {
                    goWay = 'jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w';
                }
                break;
            case 'jueqinggu':
                goWay = 'jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne';
                break;
            case 'yanyuecheng':
                if (place == '黑岩溪') {
                    goWay = 'jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw';
                }
                if (place == '朝暮阁') {
                    goWay = 'jh 43;w;n;n;n;ne;nw;nw;ne';
                }
                break;
        }
        if (!place || !goWay) {
            return false;
        }

        InforOutFunc(place, goWay);

        if (!Jianshi.xs) {
            return;
        }
        if (isDoneXueShan) {
            return;
        }
        if (isGone) {
            return;
        }
        if (hasPerson().length > 0) {
            return false;
        }

        dunXueShan(goWay, place, 'go');
        isGone = true;

        setTimeout(function () {
            isGone = false;
        }, 15 * 1000);
    }
    var renturnObj = '碧水寒潭';
    var goWay = hairsfalling['雪山']['明教活动'];
    /* 
    var renturnObj = '石亭';
    var goWay = hairsfalling['雪山']['泰山活动']; 
    var renturnObj = '碧水寒潭';
    var goWay = hairsfalling['雪山']['明教活动'];
    */
    // 蹲守雪山
    function dunXueShan(way, place, type) {

        if (hasPerson().length > 0) {
            return false;
        }

        var msg_room = g_obj_map.get("msg_room");
        if (msg_room) {
            if (place) {
                if (type) {
                    go(way)
                }
            } else {
                if (msg_room.get("short") != renturnObj) {
                    go(goWay)
                }
            }

        } else {
            if (way) {
                go(way)
            } else {
                go(goWay)
            }
        }
        if (place) {
            goInLine('去' + place + '杀雪山弟子了');
        }
    }
    //获取当前地图npcArr
    function getNpcArr() {
        var npcArr = [];
        var roomMsg = g_obj_map.get("msg_room");
        if (roomMsg) {
            var els = roomMsg.elements;
            for (var i = els.length - 1; i >= 0; i--) {
                if (els[i].key.indexOf("npc") > -1) {
                    npcArr.push(els[i].value);
                }
            }
        }
        return npcArr
    }
    // 判断当前地图中存在的Npc
    function hasSamePerson(name) {
        var npcList = getNpcArr();
        var personArr = [];
        for (var j = 0; j < npcList.length; j++) {
            var t = npcList[j].split(',');
            if (t[1].indexOf(name) > -1) {
                personArr.push(t);
            }
        }
        return personArr;
    }
    // 判断当前地图中存在的Npc
    function hasPerson() {
        var npcList = getNpcArr();
        var xueShanName = ['白衣神', '白自在'];
        var personArr = [];
        var hours = getHours();
        // if (hours > 9 && hours < 20) {
        //     // if (window.location.hostname.indexOf('laiwanqu') >-1){
        //     //     xueShanName = ['白衣神', '白自在', '老农夫'];
        //     // }else{
        //         xueShanName = ['白衣神'];
        //     // }
        // }
        for (var j = 0; j < npcList.length; j++) {
            var t = npcList[j].split(',');
            for (var i = 0; i < xueShanName.length; i++) {
                if (t[1].indexOf(xueShanName[i]) > -1) {
                    personArr.push(t);
                }
            }
        }
        return personArr;
    }
    var xueshanTime = 0;
    var waitIntervaltimer = null;

    // 根据"10分10秒"获取时间
    function getSecond(time) {
        var newtime = 0;
        var timeArr = time.match(/\d+/g);
        newtime = parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
        return newtime
    }

    // 根据剩余时间击杀NPC
    function waitKillNpc(id) {
        var npcMsg = g_obj_map.get("msg_npc");
        var time = null;
        if (npcMsg) {
            var txt = g_obj_map.get("msg_npc").get("long");
            var txtArr = txt.split('\n');
            for (var i = 0; i < txtArr.length; i++) {
                if (txtArr[i].indexOf('剩余时间') >= 0) {
                    var newText = removeChart(txtArr[i]);
                    time = newText.split('剩余时间：')[1];
                    if (getSecond(time) < 5) {
                        console.log('击杀倒计时:' + time);
                        Base.mySkillLists = '万流归一；云梦归月；天魔妙舞';
                        clickButton('kill ' + id);
                    }
                }
                if (txtArr[i].indexOf('正与') >= 0) {
                    var newText = removeChart(txtArr[i]);
                    var nameText = newText.split('正与')[1].split('激烈战斗')[0];
                    if (nameText.indexOf('风雨也') >= 0 || nameText.indexOf('惊喜队长') >= 0 || nameText.indexOf('大英雄') >= 0 || nameText.indexOf('雪织云') >= 0 || nameText.indexOf('风小皮') >= 0 || nameText.indexOf('李寻花') >= 0 || nameText.indexOf('摩诃王') >= 0 || nameText.indexOf('无头') >= 0 || nameText.indexOf('小飞') >= 0 || nameText.indexOf('阿牛') >= 0) {
                        console.log('跟大佬杀');
                        Base.mySkillLists = '万流归一；云梦归月；天魔妙舞';
                        clickButton('kill ' + id);
                    }
                }
            }
        } else {
            time = null;
        }
    }
    // 循环查看击杀NPC
    function waitKillXueShan() {
        setTimeout(() => {
            var careNpc = ['白衣神', '白自在'];
            if (!g_gmain.is_fighting) {
                for (var i = 0; i < careNpc.length; i++) {
                    var hasNpc = hasSamePerson(careNpc[i]);
                    if (hasNpc.length > 0) {
                        for (var j = 0; j < hasNpc.length; j++) {
                            var npcId = hasNpc[j][0];
                            if (npcId) {
                                clickButton('look_npc ' + npcId);
                                waitKillNpc(npcId);
                            }
                        }
                    }
                }
            }
            if (Jianshi.xs) {
                waitKillXueShan();
            }
        }, 1000);
    }
    // 定时杀雪山
    function waitKillXueShan1() {
        var post_list = hasPerson();
        if (waitIntervaltimer) clearTimeout(waitIntervaltimer);
        waitIntervaltimer = setTimeout(function () {
            if (g_gmain.is_fighting) {
                console.log('战斗中...重新定时');
            } else if (post_list.length > 0) {
                if (xueshanTime) {
                    var killtext = 'kill ' + post_list[0][0];
                    // 29分后开杀
                    if (new Date().getTime() > xueshanTime) {
                        Base.mySkillLists = '万流归一；云梦归月；天魔妙舞';
                        clickButton(killtext);
                        console.log('已过29.5分-开杀' + killtext);
                    }
                } else {
                    xueshanTime = new Date().getTime() * 1 + 29.5 * 60 * 1000;
                }
            } else {
                xueshanTime = 0;
            }
            if (Jianshi.xs) {
                waitKillXueShan();
            }
        }, 1000);
    }
    // 雪山弟子发现时间设置
    function setKillXueTime() {
        var timerText = getDate();
        var timer = prompt("请输入叫杀雪山弟子的时间", timerText);
        if (timer) {
            xueshanTime = new Date(timer).getTime();
        }
    }
    function getDate(startType) {
        var d = new Date();
        var year = d.getFullYear();
        var month = getHandledValue(d.getMonth() + 1);
        var date = getHandledValue(d.getDate());
        var hours = getHandledValue(d.getHours());
        var minutes = getHandledValue(d.getMinutes());
        var second = getHandledValue(d.getSeconds());
        var resStr = '';
        if (startType === 'year') {
            resStr = year + '/' + month + '/' + date + ' ' + hours + ':' + minutes + ':' + second;
        }
        else if (startType === 'date') {
            resStr = year + '/' + month + '/' + date;
        } else {
            resStr = year + '/' + month + '/' + date + ' ' + hours + ':' + minutes + ':' + second;
        }
        return resStr;
    }
    function getHandledValue(num) {
        return num < 10 ? '0' + num : num
    }
    // 更换代码
    var daimaInterval = null;
    var daimaText = 'ask tianlongsi_chaishao';
    function doDaiMa(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '代码定时') {
            var daima = prompt("请输入要代码", daimaText);
            if (daima) {
                daimaText = daima;
                if (daima.indexOf('|') > 0) {
                    var nums = daima.split('|')[1] || 1;
                    for (var i = 0; i < nums; i++) {
                        go(daima)
                    }
                } else {
                    daimaInterval = setInterval(function () {
                        go(daima)
                    }, 500)
                }
                Dom.html('停止代码');
            }
        } else {
            Dom.html('代码定时');
            clearInterval(daimaInterval);
        }
    }
    /* 更换奇侠 方法 :start */
    var QiXiaIndex = 0;
    function changeQiXiaName() {
        var qixiaText = qixiaObj.name;

        var qixiaName = prompt("请输入要比试的奇侠名字", qixiaText);
        if (qixiaName) {
            for (var i = 0; i < QixiaInfoList.length; i++) {
                if (QixiaInfoList[i].name == qixiaName) {
                    qixiaObj = QixiaInfoList[i];
                }
            }
        }
    }
    /* 更换奇侠 方法 :end */
    function beforeFightTongren(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '战斗装备') {
            Dom.html('悟性装备');
            // clickButton("enable unmap_all");
            // clickButton("auto_equip off");
            overrideclick('auto_equip on');       // 一键装备
            overrideclick('unwield tianlongsi_sb_libiegou');   // 脱离别钩
            overrideclick('unwield weapon_sb_sword11');   // 脱11级剑
            overrideclick('unwield weapon_sb_sword12');   // 脱12级剑
            overrideclick('unwield weapon_sb_whip12');    // 脱12级鞭
            overrideclick('unwield weapon_sb_throwing12');   // 脱12级暗
            overrideclick('unwield weapon_sb_stick11');   // 脱11级棍
            overrideclick('unwield weapon_sb_spear11');   // 脱11级枪
            overrideclick('unwield weapon_sb_stick12');   // 脱12级棍
            overrideclick('unwield weapon_sb_staff12');   // 脱12级杖
            overrideclick('unwield weapon_sb_spear12');   // 脱12级枪
            overrideclick('unwield weapon_sb_throwing12');   // 脱12级暗
            overrideclick('unwield weapon_sb_unarmed12');   // 脱12级拳
            overrideclick('unwield longwulianmoge_mojianlianhun');	//脱本3剑
            overrideclick('wield tianlongsi_sb_libiegou');	//装离别钩
            overrideclick('wield weapon_sb_staff12');   // 装12级杖
            overrideclick('wield weapon_sb_throwing12');   // 装12级暗
            overrideclick('wield weapon_sb_spear11');   // 装11级枪
            overrideclick('wield weapon_sb_spear12');   // 装12级枪
            overrideclick('wield weapon_sb_unarmed12');       // 装12级拳
            overrideclick('wield weapon_sb_sword11 rumai');       // 入脉11级剑
            overrideclick('wield weapon_sb_whip12 rumai');       // 入脉12级鞭
            overrideclick('wield weapon_sb_sword12 rumai');       // 入脉12级剑
            overrideclick('wield weapon_sb_stick11 rumai');   // 装11级棍
            overrideclick('wield weapon_sb_stick12 rumai');   // 装12级棍
        } else {
            Dom.html('战斗装备');
            overrideclick('unwield tianlongsi_sb_libiegou');   // 脱离别钩
            overrideclick('unwield weapon_sb_sword11');   // 脱11级剑
            overrideclick('unwield weapon_sb_sword12');   // 脱12级剑
            overrideclick('unwield weapon_sb_stick11');   // 脱11级棍
            overrideclick('unwield weapon_sb_spear11');   // 脱11级枪
            overrideclick('unwield weapon_sb_stick12');   // 脱12级棍
            overrideclick('unwield weapon_sb_spear12');   // 脱12级枪
            overrideclick('unwield weapon_sb_staff12');   // 脱12级杖
            overrideclick('unwield weapon_sb_whip12');   // 脱12级鞭
            overrideclick('unwield weapon_sb_throwing12');   // 脱12级暗
            overrideclick('wear equip_head_tianji_jiuxuan');       // 天机帽
            overrideclick('wear tianlongsi_mumianjiasha');			//木棉袈裟
            overrideclick('wear equip_finger_kongdong_bulao');     // 崆峒戒
            overrideclick('wield sword of windspring rumai');       // 入脉风泉
            overrideclick('wield weapon_stick_miaoyun_lhx');       // 装备笛子
            overrideclick('wield longwulianmoge_mojianlianhun');   // 装本3剑x
        }
    }
    function goYang() {
        go('jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939-星星峡;ts2;ne;ne;nw;nw');
    }
    // 签到--------------------------------------------------------
    function CheckInFunc() {
        timeCmd = 0;
        console.log(getTimes() + 'VIP签到');
        go('vip drops');//领通勤
        go('vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task');//10次暴击
        // clickButton('vip buy_task', 0)
        // go('vip buy_task;vip buy_task;vip buy_task;vip buy_task;vip buy_task'); // 购买5次
        // go('vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task');
        go('vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan');// 20次帮派
        // clickButton('vip finish_clan', 0) clickButton('vip finish_family', 0)
        go('vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family');//25次师门
        go('vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig');//挖宝
        go('vip finish_fb dulongzhai;vip finish_fb dulongzhai;vip finish_fb junying;vip finish_fb junying;vip finish_fb beidou;vip finish_fb beidou;vip finish_fb youling;vip finish_fb youling;vip finish_fb siyu;vip finish_fb changleweiyang;vip finish_fb heishuihuangling;vip finish_fb jiandangfenglingdu;vip finish_fb tianshanlongxue');//副本扫荡
        go('vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;');  //钓鱼
        // go('sort;sort fetch_reward;');//排行榜奖励
        // go('shop money_buy shop1_N_10;home;');//买引路蜂10个
        // go('exercise stop;exercise;');//打坐
        // go("share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;");//分享
        // clickButton('vip finish_fb siyu', 0)
        go('cangjian get_all;xueyin_shenbinggu blade get_all;xueyin_shenbinggu unarmed get_all;xueyin_shenbinggu throwing get_all;');//闯楼奖励
        // go('jh 5;n;n;n;w;sign7;home;');//扬州签到
        // go('jh 1;event_1_763634;home;');//雪亭立冬礼包
        // go('jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;home;');//消费积分和谜题卡
        // if(Base.getCorrectText('4253282')){
        //     go("jh 1;e;n;e;e;e;e;n;lq_bysf_lb;home;");//比翼双飞和劳模英豪
        // }
        go('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n;n;w;event_1_31320275;home');//采莲
        go('jh 26;w;w;n;e;e;event_1_18075497;home');//大招采矿
        go('jh 26;w;w;n;n;event_1_14435995;home');//大招破阵
        go("jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911;home");//绝情谷鳄鱼
        go('jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home'); //冰火岛玄重铁
    }

    function CheckInFunc1() {
        timeCmd = 0;
        console.log(getTimes() + 'VIP签到-正邪-逃犯-打榜');
        go('home');  //回主页
        go('clan fb saodang longwulianmoge');
        // go('vip buy_task;vip buy_task;vip buy_task;vip buy_task;vip buy_task'); // 购买5次暴击
        go('vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task');//暴击
        go('vip finish_task,vip finish_task,vip finish_task,vip finish_task,vip finish_task');
        if (killBadSwitch && !isBadBoy()) {
            // 获取正气
            go('vip finish_bad 1;vip finish_bad 1;vip finish_bad 1;vip finish_bad 1;vip finish_bad 1;vip finish_bad 1;vip finish_bad 1;vip finish_bad 1;vip finish_bad 1;vip finish_bad 1;');//10次正邪
        } else {
            // 获取负气
            go('vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;');//10次正邪
        }
        // go('vip finish_taofan 2;vip finish_taofan 2;vip finish_taofan 2;vip finish_taofan 2;vip finish_taofan 2;');//5次逃犯
        go('vip finish_sort;vip finish_sort;vip finish_sort;vip finish_sort;vip finish_sort;');//5次打榜
    }
    function goZhuHou() {
        go('jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;e;e;event_1_94442590;event_1_85535721');// 铁雪诸侯除魔
    }
    function BuyTang() {
        go('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w;event_1_712982 go;daily finish 11;daily finish 12'); // 洛阳买冰糖葫芦
    }
    function goHuashanSuipian() {
        go('items get_store /obj/quest/qinglong_suipian');
        go('jh 4;n;n;w;');
        for (var i = 0; i < 15; i++) {
            go('do_duihuan_qinglong_suipian gift15');
        }
    };

    /* 签到 方法 :start */
    async function CheckIn() {
        console.log(getTimes() + '签到一次！');
        g_gmain.notify_fail(HIG + getTimes() + "开始签到" + NOR);
        go('jh 1');        // 进入章节
        go('event_1_3006512');
        go('event_1_41564409');
        go('event_1_85373703');
        go('w;event_1_21318613;event_1_2882993'); // 潜龙
        setTimeout(function () {
            go('jh 1');
            // go('wsnjc clan');
            // go('wsnjc user');
            // go('look_npc snow_mercenary new_ym_lb');
            go('look_npc snow_mercenary');
            setTimeout(function () {
                getNewLibao();
            }, 2000);
        }, 2000);
        // clickJieRiNpc('小糖人');
        // setTimeout(function () {
        //     go('jh 17;n');
        //     // clickJieRiNpc('陈汤');
        //     setTimeout(function () {
        //         clickJieRiNpc('白玉堂');
        //     }, 2000);
        // }, 4000);
        setTimeout(function () {
            checkInList();
        }, 6000);
    };
    async function checkInList() {
        go('home');         //回主页
        go('items get_store /map/tianlongsi/obj/sanxiangmenmgzhuling');
        go('items use tianlongsi_nanguagu'); // 南瓜
        go('items use tianlongsi_sanxiangmenmgzhuling'); // 盟主令
        go('fudi houshan fetch');// 收后山
        go('fudi shennong fetch');// 收神农
        go('fudi juxian fetch_zhuguo'); // 收果子
        // go('jh 1');        // 进入章节
        // go('go west') ;     // 金庸
        // go('event_1_46497436');
        go('share_ok 1'); //分享
        go('share_ok 2'); //分享
        go('share_ok 3'); //分享
        go('share_ok 4'); //分享
        go('share_ok 5'); //分享
        // go('share_ok 6'); //分享
        go('share_ok 7'); //分享
        go('exercise stop'); //取消打坐
        go('exercise');     //打坐
        go('sleep_hanyuchuang'); // 睡床
        go('xls practice');
        go('jh 5');       // 进入扬州
        go('go north');     // 南门大街
        go('go north');   // 十里长街3
        go('go north');    // 十里长街2
        go('go west');    // 黄记杂货
        go('sign7');      //签到
        go('home');         //回主页
        go('jh 1');        // 进入章节
        go('give_ybjd');    // 每日礼包
        go('go east');     // 广场
        go('go north');     // 雪亭镇街道
        go('go east');     // 淳风武馆大门
        go('go east');    // 淳风武馆教练场
        go('event_1_8041045');//谜题卡
        go('event_1_8041045');//谜题卡
        go('event_1_44731074');//消费积分
        go('event_1_34254529');
        //clickButton('event_1_29721519', 1)
        go('event_1_29721519'); // 狗年礼券
        go('event_1_60133236'); // 暴击卡福利
        if (Base.getCorrectText('4253282')) {
            go('go east');     // 淳风武馆大门
            go('go east');    // 淳风武馆教练场
            go('go north');    // 淳风武馆教练场
            go('lq_bysf_lb');//谜题卡 event_1_59011358 go 2 1
            go('jh 1;e;n;n;n;n;w;event_1_59011358 go 1 1');
        }
        go('home');  //回主页
        // go('event_1_16891630'); // 狗年礼券
        go('clan buy 302');        // 帮派买金
        go('clan buy 302');        // 帮派买金
        go('clan buy 302');        // 帮派买金
        go('clan buy 302');        // 帮派买金
        go('clan buy 302');        // 帮派买金
        go('sort');//排行榜
        go('sort fetch_reward', 1);// 领取排行奖励
        go('jh 2');
        go('go north');  // 南郊小路
        go('go north');  // 南门
        go('go north');  // 南大街
        go('go north');  // 洛川街
        go('go north');  // 中心鼓楼
        go('go north');  // 中州街
        go('go north');  // 北大街
        go('go east');   // 钱庄
        // if (Base.getCorrectText('4253282')) {
        //     go('touzi_jihua2 buygo 7');
        //     go('touzi_jihua2 buygo 6');
        // } else {
        go('touzi_jihua2 buygo 7');
        go('touzi_jihua2 buygo 6');
        // }
        go('tzjh_lq');   // 钱庄  clickButton('tzjh_lq', 1) touzi_jihua2 buygo 6
        go('home');
        go('items use obj_bingzhen_suanmeitang');   // 酸梅汤
        go('items use obj_baicaomeijiu');           // 百草美酒
        go('items use obj_niangao');                // 年糕
        // go('shop money_buy mny_shop1_N_10');         // 买10个引路蜂
        go('cangjian get_all'); // 一键领取藏剑楼奖励
        go('xueyin_shenbinggu blade get_all'); // 一键领取霸刀楼奖励
        go('xueyin_shenbinggu unarmed get_all'); // 一键领取铁拳楼奖励
        go('xueyin_shenbinggu throwing get_all'); // 一键领取天机楼奖励
        go('xueyin_shenbinggu stick get_all'); // 一键领取棍楼
        go('xueyin_shenbinggu spear get_all');     // 枪楼
        go('xueyin_shenbinggu staff get_all'); // 杖
        go('xueyin_shenbinggu whip get_all'); // 辫
        // go('jh 16;event_1_34159245');
        // go('jh 33;sw;sw;s;s;event_1_20090664;event_1_97518803'); // 五一
        // go('jh 1;w;w;w;w;s;event_1_85028119;event_1_958380 go'); // 七夕
        //clickButton('event_1_20090664', 1)
        // await clickShuangEr();              // 双儿礼包
        // await clickLijing();
        go('home');     //回主页
    };
    // 领取礼包
    async function getNewLibao() {
        setTimeout(function () {
            clickLibaoBtn();
        }, 1000);
    };
    // 判断是什么礼包
    async function clickLibaoBtn() {
        var LiBaoName = ['兑换礼包', '1元礼包'];
        var btn = $('.cmd_click2');
        btn.each(function () {
            var txt = $(this).text();
            if (txt.indexOf('礼包') != '-1') {
                if ($.inArray(txt, LiBaoName) == -1) {
                    var clickText = $(this).attr('onclick'); // clickButton('event_1_41502934', 1)
                    var clickAction = getLibaoId(clickText);
                    triggerClick(clickAction);
                }
            }
        });

        clickButton('golook_room');
    };

    // 节日使者点击
    async function clickJieRiNpc(name) {
        setTimeout(function () {
            clickNpcAsk(name);
        }, 1000);
        setTimeout(function () { clickMaiHuaLibaoBtn() }, 3000);
    };

    // 看相应的人
    async function clickNpcAsk(name) {

        var btn = $('.cmd_click3');
        btn.each(function () {
            var txt = $(this).text();
            if (txt == name) {
                var clickText = $(this).attr('onclick');
                var clickAction = getLibaoId(clickText);
                triggerClick(clickAction);
            }
        })
    };
    async function clickShuangDan() {
        setTimeout(function () {
            clickShuangDan1();
        }, 6000)
    };
    async function clickShuangDan1() {
        go('home');     //回主页
        go('jh 1');
        go('look_npc snow_xiaotangren');
        setTimeout(function () { clickMaiHuaLibaoBtn() }, 3000);
    };

    async function clickShuangEr() {
        go('home');     //回主页
        go('jh 1');       // 进入扬州
        go('look_npc snow_zhounianxiaoer');
        setTimeout(function () { clickMaiHuaLibaoBtn() }, 3000);
    };
    async function clickMaiHua() {
        go('home');     //回主页
        go('jh 2');       // 进入扬州
        go('go north');     // 南门大街
        go('go north');   // 十里长街3
        go('go north');     // 南门大街
        go('go north');   // 十里长街3
        go('go north');     // 南门大街
        go('go north');   // 十里长街3
        go('go north');     // 南门大街
        go('look_npc luoyang_luoyang3');
        setTimeout(function () { clickMaiHuaLibaoBtn() }, 3000);
    };

    async function clickLijing() {
        go('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n');
        go('look_npc changan_lijing');
        go('event_1_89607833');
        setTimeout(function () { clickMaiHuaLibaoBtn() }, 40000);
    };

    // 判断是什么礼包
    async function clickMaiHuaLibaoBtn() {

        var btn = $('.cmd_click2');
        btn.each(function () {
            var txt = $(this).text();
            if (txt.indexOf('礼包') > 0) {
                var clickText = $(this).attr('onclick');
                var clickAction = getLibaoId(clickText);
                triggerClick(clickAction);
            }
        });
        setTimeout(() => {
            go('home');
        }, 10000);
    };

    // 判断是什么礼包
    async function clickXinChunLibaoBtn() {

        var btn = $('.cmd_click2');
        btn.each(function () {
            var txt = $(this).text();
            if (txt != "比试" && txt != "对话" && txt != "观战") {
                var clickText = $(this).attr('onclick');
                var clickAction = getLibaoId(clickText);
                triggerClick(clickAction);
            }
        });
        go('home');
    };
    // 获取礼包方法的名称
    function getLibaoId(text) {
        var arr = text.split(',');
        var newArr = arr[0].split('(');
        var nowArr = newArr[1].split("'");
        return nowArr[1];
    };
    // 触发领方法
    async function triggerClick(name) {
        go(name);
    };
    /* 签到 方法 :end */
    /* 刷碎片 方法 :start */
    var counthead = null;
    var killDrunkIntervalFunc = null;
    async function killDrunkManFunc() {
        Jianshi.sp = 1;
        counthead = 20;
        $('span:contains(胜利)').remove();
        go('jh 2');        // 进入章节
        go('go north');      // 南郊小路
        go('go north');     // 南门
        go('go north');     // 南大街
        go('go north');     // 洛川街
        killDrunkIntervalFunc = setInterval(killDrunMan, 3000);
    };
    async function killDrunMan() {
        getInfoFromDown('/20', getSuiPianNum);
        go('kill ' + Base.DrunkMan_targetName);
        doKillSetSuiPian();
    };

    // 获取碎片信息
    function getInfoFromDown(text, callback) {
        var out = $('#out2 .out2');
        out.each(function () {
            if ($(this).hasClass('doneCommon')) {
                return
            }
            $(this).addClass('doneCommon');
            var txt = $(this).text();
            // 获得朱雀碎片x1 (7/20)
            if (txt.indexOf(text) != '-1') {
                callback(txt);
            } else {
                // console.log('无碎片,请刷新取消刷碎片');
            }
        });
    }

    async function getSuiPianNum(text) {
        var num = 0;
        num = text.split('(')[1];
        if (num[1]) {
            num = num[1].split('/')[0];
            if (num >= 20) {
                Jianshi.sp = 0;
                console.log(getTimes() + '完成20个碎片');
                clickButton('home');
                clearInterval(killDrunkIntervalFunc);
            } else {
                console.log(getTimes() + '杀人一次，杀人次数：%d！', parseInt(num));
                clickButton('prev_combat');
                $('span:contains(胜利)').html('')
            }
        }
    };
    /* 刷碎片 方法 :end */
    /* 获取正气 方法 :start */
    var useDog = false,
        killBadSwitch = true;
    var killTargetArr = ['流寇', '恶棍', '剧盗', '段老大', '二娘', '岳老三', '云老四'];
    function hitScore(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '正气中') {
            killBadSwitch = false;
            killTargetArr = ['杨掌柜', '王铁匠', '柳绘心', '客商', '卖花姑娘', '刘守财', '柳小花', '朱老伯', '方寡妇', '方老板'];
            Dom.html('负气中');
        } else {
            killBadSwitch = true;
            killTargetArr = ['流寇', '恶棍', '剧盗', '段老大', '二娘', '岳老三', '云老四'];
            Dom.html('正气中')
        }
    }
    function hasDog() {
        var nameArr = [];
        var nameDom = $('.outkee_text');
        nameDom.each(function () {
            var name = $(this).prev().text();
            if (name != '') {
                nameArr.push(name);
            }
        });
        var dogName = ['金甲符兵', '玄阴符兵'];

        var arr3 = [];
        for (var i = 0; i < nameArr.length; i++) {
            for (var j = 0; j < dogName.length; j++) {
                if (nameArr[i] == dogName[j]) {
                    arr3.push(nameArr[i]);
                    break;
                }
            }
        }
        return arr3;
    }
    /* 获取正气 方法 :end */
    /* 搜尸 方法 :start */
    var doGetCorpse = null;
    function setCsearch(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '搜尸') {
            // doGetCorpse = setInterval(function () {
            //     getC();
            // }, 500);
            qiangdipiTrigger = 1;
            qiangItem();
            console.log(getTimes() + '开始搜尸');
            Dom.html('取消搜尸');
        } else {
            qiangdipiTrigger = 0;
            knownlist = [];
            // clearInterval(doGetCorpse);
            Dom.html('搜尸');
            console.log(getTimes() + '停止搜尸');
        }
    }

    function qiangItem() {
        if (qiangdipiTrigger == 1) {
            var Objectlist = g_obj_map.get("msg_room").elements;
            for (var i = 0; i < Objectlist.length; i++) {
                if (Objectlist[i].key.indexOf("item") >= 0) {
                    if (knownlist.indexOf(" " + Objectlist[i].value.split(",")[0]) < 0) {
                        clickButton("get " + Objectlist[i].value.split(",")[0], 0)
                    }
                }
            }
        }
    }

    function getC() {
        // clickButton('golook_room');
        $('.cmd_click3').each(function () {
            var txt = $(this).text();
            if (txt.indexOf('的尸体') != '-1') {
                if (killOneName) {
                    if (txt.indexOf(killOneName) != '-1') {
                        var npcText = $(this).attr('onclick');
                        var id = getId(npcText);
                        clickButton('get ' + id);
                    }
                } else {
                    var npcText = $(this).attr('onclick');
                    var id = getId(npcText);
                    clickButton('get ' + id);
                }
            }
        });
    }
    /* 搜尸 方法 :end */
    /* 地图碎片 */
    function submitSuipian() {
        go('clan bzmt puzz');
    }
    var suipianInterval = null;
    function ditusuipianFunc(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '地图碎片') {
            foundSuiPian();
            suipianInterval = setInterval(function () {
                foundSuiPian();
            }, 1 * 60 * 1000);
            console.log(getTimes() + '开始地图碎片');
            Dom.html('停止碎片');
        } else {
            clearInterval(suipianInterval);
            console.log(getTimes() + '停止地图碎片');
            Dom.html('地图碎片');
        }
    }
    function foundSuiPian() {
        var place = $('#out .outtitle').text();
        var placeArr = ['地室', '万蛊堂', '百毒池', '十恶殿', '千蛇窟'];
        var index = $.inArray(place, placeArr);

        if (index >= 0) {
            if (index == '0') {
                goPlaceBtnClick('地室');
                goPlaceBtnClick('万蛊堂');
            } else {
                var name = getBtnText();
                // console.log(name);
                if (name) {
                    if (name == '翼国公') {
                        clickButton('kill changan_yiguogong1');
                    }
                    if (name == '黑袍公') {
                        clickButton('kill changan_heipaogong1');
                    }
                    if (name == '云观海') {
                        clickButton('kill changan_yunguanhai1');
                    }
                    if (name == '独孤须臾') {
                        clickButton('kill changan_duguxuyu1');
                    }
                } else {
                    if (index == '4') {
                        index = 0;
                    }
                    goNextRoom(index + 1);
                }
            }
        }
    }
    function getBtnText() {
        var npcName = ['独孤须臾', '云观海', '黑袍公', '翼国公'];
        var targetName = null;
        var btn = $('.cmd_click3');
        for (var i = 0; i < npcName.length; i++) {
            var name = npcName[i];
            btn.each(function () {
                if ($(this).text() == name) {
                    targetName = name;
                }
            });
        }
        // console.log(targetName);
        return targetName;
    }

    function goNextRoom(index) {
        goPlaceBtnClick('地室');
        // console.log(index);
        setTimeout(function () {
            if (index == '1') {
                goPlaceBtnClick('万蛊堂');
            } else if (index == '2') {
                goPlaceBtnClick('百毒池');
            } else if (index == '3') {
                goPlaceBtnClick('十恶殿');
            } else if (index == '4') {
                goPlaceBtnClick('千蛇窟');
            }
        }, 2000)
    }
    /* 切磋 :start */
    var fightInterval = null;
    function fightWithPlayer(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '切磋') {
            var id = prompt("请输入要切磋的ID", "4316804");
            if (!id || id == '') {
                return
            }
            fightInterval = setInterval(function () {
                fightWithPlayerFn(id);
            }, 1000);
            console.log(getTimes() + '开启切磋');
            Dom.html('取消切磋');
        } else {
            clearInterval(fightInterval);
            Dom.html('切磋');
            console.log(getTimes() + '停止切磋');
        }
    }
    function fightWithPlayerFn(id) {
        clickButton('fight u' + id);
    }
    /* 切磋 :end*/
    /* 杀正邪 方法 :start */
    var badNameArr = [];
    var killErInterval = null;
    var killErSwitch = false;
    var killENum = 0;
    function killErNiangFn(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '杀正邪') {
            killENum = 0;
            console.log(getTimes() + '开始杀正邪');
            useDog = false;
            badNameArr = ['段老大', '二娘'];
            Dom.html('取消杀正邪');
            killErInterval = setInterval(function () {
                if (killENum > 10) {
                    clickButton('escape');
                    useDog = true;
                    console.log(getTimes() + '取消杀正邪');
                    $("#btnm1").html('杀正邪');
                    killErSwitch = false;
                    clearInterval(killErInterval);
                } else {
                    doClearNpc();
                    killErSwitch = true;
                    // doKillDogSet();
                }

            }, 10000)
        } else {
            useDog = true;
            console.log(getTimes() + '取消杀正邪');
            Dom.html('杀正邪');
            clearInterval(killErInterval);
        }
    }
    /* 杀正邪 方法 :end */
    /* 杀逃犯 方法 :start */
    var killTaoFanInterval = null;
    var taoPlaceStep = 1;
    function killTaoFanFn(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '杀逃犯') {
            console.log(getTimes() + '开始杀逃犯');
            useDog = true;
            badNameArr = ['段老大', '二娘'];
            Dom.html('取消逃犯');
            killTaoFanInterval = setInterval(function () {
                doClearTaoFan();
                doKillTaoFanSet();
            }, 4000);
        } else {
            useDog = false;
            console.log(getTimes() + '停止杀逃犯');
            Dom.html('杀逃犯');
            clearInterval(killTaoFanInterval);
        }
    }
    // 清狗技能
    function doKillTaoFanSet() {
        var skillArr = Base.mySkillLists.split('；');
        if (hasDog().length < 2 && useDog) {
            skillArr = ['茅山道术', '天师灭神剑'];
        }

        if ($('.out_top').find('.outkee_text').length > 1) {
            clickButton('escape');
            return false;
        }
        var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];
        var clickSkillSwitch = false;
        $.each(skillIdA, function (index, val) {
            var btn = $('#skill_' + val);
            var btnName = btn.text();
            for (var i = 0; i < skillArr.length; i++) {
                var skillName = skillArr[i];
                if (btnName == skillName) {
                    btn.find('button').trigger('click');
                    clickSkillSwitch = true;
                    break;
                }
            }
        });
        //clickButton('escape');
        if (!clickSkillSwitch && $('.cmd_skill_button').length > 0) {
            clickButton('playskill 1');
        }
    }
    // 开始打坏人
    function doClearTaoFan() {
        findTaoFan();
    }
    //去位置
    async function goTaoFanPlace(place) {
        // go('home');
        go('jh ' + place);
    };
    // 去下一个位置
    async function goNextTaoFanPlace() {
        if (taoPlaceStep < 10) {
            taoPlaceStep++
        } else {
            taoPlaceStep = 1;
        }
        await goTaoFanPlace(taoPlaceStep);
    };

    // 杀逃犯
    async function doKillTaoFan(arr) {
        var maxId = arr[0];
        killENum++;
        console.log(getTimes() + '当前第：' + killENum + '个，' + bad_target_name + ':' + maxId);
        await new Promise(function (resolve) {
            setTimeout(resolve, 1000);
        });
        await killE(maxId);
    };
    // 找打坏人
    async function findTaoFan() {
        goNpcPlace(taoPlaceStep);
        // javascript:clickButton('golook_room');
        var btn = $('.cmd_click3');
        idArr = [];
        for (var j = 0; j < badNameArr.length; j++) {
            var badName = badNameArr[j];

            for (var i = btn.length; i > 0; i--) {
                var txt = btn.eq(i).text();
                if (txt == badName) {
                    bad_target_name = badName;
                    var npcText = null;
                    if (killBadSwitch) {
                        npcText = btn.eq(i).attr('onclick');
                    } else {
                        npcText = btn.eq(i - 1).attr('onclick');
                    }
                    var id = getId(npcText);
                    idArr.push(id);
                }
                // clickButton('score u4185184-15a1a', 0)
                var btnClick = btn.eq(i).attr('onclick');
                // 有玩家就闪过去
                if (btnClick) {
                    if (btnClick.indexOf('score') != '-1') {
                        idArr = [];
                    }
                }
            }
        }

        // 有狗就闪过去
        if (getDogNum().length > 0) {
            goNextTaoFanPlace();
        } else {
            if (idArr.length == 0) {
                goNextTaoFanPlace();
            } else {
                await doKillTaoFan(idArr);
            }
        }

    };

    /* 杀逃犯 方法 :end */
    /* 清正邪 方法 :start */
    var clearNpcInterval = null;
    var placeArr = ['书房', '打铁铺子', '桑邻药铺', '南市', '绣楼', '北大街', '钱庄', '桃花别院', '杂货铺', '祠堂大门', '厅堂'];
    var placeStep = 0;
    var killENum = 0;
    var clearNpcIntervalSetSkill = null;
    var bad_target_name = null;
    function clearNpcFn(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '清正邪') {
            Jianshi.qingzhengxie = 1;
            useDog = true;
            badNameArr = ['段老大', '二娘', '岳老三', '云老四', '剧盗', '恶棍', '流寇'];
            console.log(getTimes() + '开始清正邪');
            Dom.html('取消正邪');
            doClearNpc();
            clearNpcInterval = setInterval(function () {
                doClearNpc();
            }, 10000);
            clearNpcIntervalSetSkill = setInterval(function () {
                doKillDogSet();
            }, 5000);
        } else {
            Jianshi.qingzhengxie = 0;
            useDog = false;
            console.log(getTimes() + '停止清正邪');
            Dom.html('清正邪');
            clearInterval(clearNpcInterval);
            clearInterval(clearNpcIntervalSetSkill);
        }

    }
    // 开始打坏人
    function doClearNpc() {
        findNpc();
    }
    // 清狗技能
    function doKillDogSet() {
        var skillArr = Base.mySkillLists.split('；');
        if (hasDog().length < 2 && useDog) {
            skillArr = ['茅山道术', '天师灭神剑'];
        }

        if (!killErSwitch) {
            if (hasDog().length > 0 && useDog || $('.out_top').find('.outkee_text').length > 1) {
                clickButton('escape');
                return false;
            }
        }

        var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];
        var clickSkillSwitch = false;
        $.each(skillIdA, function (index, val) {
            var btn = $('#skill_' + val);
            var btnName = btn.text();
            for (var i = 0; i < skillArr.length; i++) {
                var skillName = skillArr[i];
                if (btnName == skillName) {
                    btn.find('button').trigger('click');
                    clickSkillSwitch = true;
                    break;
                }
            }
        });
        if (!clickSkillSwitch && $('.cmd_skill_button').length > 0) {
            clickButton('playskill 1');
        }
    }
    // 找打坏人
    async function findNpc() {
        clickButton('golook_room');
        var btn = $('.cmd_click3');
        idArr = [];
        for (var j = 0; j < badNameArr.length; j++) {
            var badName = badNameArr[j];
            for (var i = btn.length; i > 0; i--) {
                var txt = btn.eq(i).text();
                if (txt == badName) {
                    bad_target_name = badName;
                    var npcText = null;
                    if (killBadSwitch) {
                        npcText = btn.eq(i).attr('onclick');
                    } else {
                        npcText = btn.eq(i - 1).attr('onclick');
                    }
                    var id = getId(npcText);
                    idArr.push(id);
                }
                var btnClick = btn.eq(i).attr('onclick');
                if (btnClick) {
                    if (btnClick.indexOf('score') != '-1') {
                        idArr = [];
                    }
                }
            }
        }

        if (getDogNum().length > 0 && !killErSwitch) {
            await goNextPlace();
        } else if (getPlayerNum().length > 0) {
            await goNextPlace();
        } else if ($('.cmd_skill_button').length == 0) {
            if (idArr.length == 0) {
                await goNextPlace();
            } else {
                await doKillBadNpc(idArr);
            }
        }
    };
    // 去下一个位置
    async function goNextPlace() {
        if (placeStep < 10) {
            placeStep++
        } else {
            placeStep = 0;
        }
        await goNpcPlace(placeArr[placeStep]);
    };
    // 获取Dog的数量
    function getDogNum() {
        var nameArr = [];
        var nameDom = $('.cmd_click3');
        var dogName = ['金甲符兵', '玄阴符兵'];
        var arr3 = [];
        nameDom.each(function () {
            var name = $(this).text();
            if (name != '') {
                nameArr.push(name);
            }
        });

        for (var i = 0; i < nameArr.length; i++) {
            for (var j = 0; j < dogName.length; j++) {
                if (nameArr[i] == dogName[j]) {
                    arr3.push(nameArr[i]);
                    break;
                }
            }
        }
        return arr3;
    }
    // 获取在场人的数量
    function getPlayerNum() {
        var nameArr = [];
        var nameDom = $('.cmd_click3');
        var dogName = ['score u'];
        var arr3 = [];
        nameDom.each(function () {
            var name = $(this).attr('onclick');
            if (name != '') {
                nameArr.push(name);
            }
        });

        for (var i = 0; i < nameArr.length; i++) {
            for (var j = 0; j < dogName.length; j++) {
                if (nameArr[i].indexOf(dogName[j]) != '-1') {
                    arr3.push(nameArr[i]);
                    break;
                }
            }
        }
        return arr3;
    }
    // 杀好人
    async function doKillBadNpc(arr) {
        var maxId = null;
        if (arr.length > 1) {
            var newIdArr = [];
            for (var i = 0; i < arr.length; i++) {
                if (killBadSwitch) {
                    newIdArr.push(idArr[i].replace('eren', ''));
                } else {
                    newIdArr.push(arr[i].replace('bad_target_', ''));
                }
            }
            maxId = newIdArr.max();;
            maxId = arr[maxId];
        } else {
            maxId = arr[0];
        }
        killENum++;
        console.log(getTimes() + '当前第：' + killENum + '个，' + bad_target_name + ':' + maxId);  //eren580108074
        await killE(maxId);
    };
    //去位置
    async function goNpcPlace(place) {
        switch (place) {
            case "书房":
                await goSfang();
                break;
            case "打铁铺子":
                await goTie();
                break;
            case "桑邻药铺":
                await goYao();
                break;
            case "南市":
                await goNan();
                break;
            case "绣楼":
                await goXiu();
                break;
            case "北大街":
                await goNStreet();
                break;
            case "钱庄":
                await goQian();
                break;
            case "桃花别院":
                await goTao();
                break;
            case "杂货铺":
                await goZa();
                break;
            case "祠堂大门":
                await goCi();
                break;
            case "厅堂":
                await goTing();
                break;
        }
    };
    /* 清正邪 方法 :end */
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    /* 跨服 方法 :start */
    var kuafuNpc = '';
    function interServerFn(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        var kuafutext = '36-40';
        if (getUrlParam('area') < 6) {
            kuafutext = '1-5';
        }
        if (DomTxt == '跨服') {
            kuafuNpc = '[' + kuafutext + '区]';
            console.log(getTimes() + '开始' + kuafutext + '跨服');
            Dom.html('取消跨服');
        } else {
            kuafuNpc = '';
            console.log(getTimes() + '停止' + kuafutext + '跨服');
            Dom.html('跨服');
        }

    }
    /* 跨服 方法 :end */

    function doOneSkillsJian() {
        var skillArr = ['九天龙吟剑法', '覆雨剑法'];
        var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];

        $.each(skillIdA, function (index, val) {
            var btn = $('#skill_' + val);
            var btnName = btn.text();

            for (var i = 0; i < skillArr.length; i++) {
                var skillName = skillArr[i];
                if (btnName == skillName) {
                    btn.find('button').trigger('click');
                    break;
                }
            }
        });
    }
    function doOneSkillsZhang() {
        var skillArr = ['排云掌法', '如来神掌'];
        var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];

        $.each(skillIdA, function (index, val) {
            var btn = $('#skill_' + val);
            var btnName = btn.text();

            for (var i = 0; i < skillArr.length; i++) {
                var skillName = skillArr[i];
                if (btnName == skillName) {
                    btn.find('button').trigger('click');
                    break;
                }
            }
        });
    }
    /* 打楼 方法 :start */
    var fightLouInterval = null;
    var daLouMode = 0;
    function fightLou(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '打楼') {
            daLouMode = 1;
            console.log(getTimes() + '开始打楼');
            Dom.html('取消打楼');
        } else {
            daLouMode = 0;
            console.log(getTimes() + '停止打楼');
            Dom.html('打楼');
        }
    }
    function chuzhaoNum() {
        $('#btn-chuzhao').html('出招+' + maxQiReturn);
    }
    var maxQiReturn = 0;
    /* 打楼 方法 :end */
    /* 对招 方法 :start */
    var duiZhaoMode = 0;
    function fightAllFunc(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '对招') {
            duiZhaoMode = 1;
            console.log(getTimes() + '开始对招');
            Dom.html('取消对招');
        } else {
            duiZhaoMode = 0;
            console.log(getTimes() + '停止对招');
            Dom.html('对招');
        }
    }
    var maxQiReturn = 0;
    function doFightAll() {
        if ($('span.out4:contains(切磋一番)').length > 0) {
            isOnstep1 = false;
            go('golook_room');
        }
        if ($('#skill_1').length == 0) {
            maxQiReturn = 0;
            chuzhaoNum();
            bixueEnd();
            hitMaxEnd();
            return;
        }
        if (hasQiLin()) {
            clickButton('escape');
            clickButton('home');
            setTimeout(function () {
                clickButton('home');
            }, 1000);
            setTimeout(function () {
                clickButton('home');
            }, 2000);
            return false;
        }

        var out = $('#out .out');
        out.each(function () {

            if ($(this).hasClass('done')) {
                return
            }

            $(this).addClass('done');

            var txt = $(this).text();
            var qiNumber = gSocketMsg.get_xdz();
            if (qiNumber < 3) {
                return;
            }

            var clickSkillSwitch = checkHeal();

            if (!clickSkillSwitch && $('.cmd_skill_button').length > 0) {
                // var hitDesList = ['刺你','扫你','指你','你如','至你','拍你','向你','在你','准你','点你','劈你','取你','往你','奔你','朝你','击你','斩你','扑你','取你','射你','你淬','卷你','要你','将你','涌向你','对准你','你急急','抓破你','对着你','你已是','你被震','钻入你','穿过你','你愕然','你一时','你难辨','你竭力','纵使你有','围绕着你','你生命之火','你扫荡而去','你反应不及','你再难撑持','你无处可避','贯穿你躯体','你挡无可挡','你大惊失色','你的对攻无法击破','你这一招并未奏效','你只好放弃对攻'];
                var hitDesList = hitKeys;
                for (var i = 0; i < hitDesList.length; i++) {
                    var hitText = hitDesList[i];
                    if (txt.indexOf('铁锁横江') == '-1' && txt.indexOf('金刚不坏功力') == '-1' && txt.indexOf('太极神功') == '-1') {
                        if (txt.indexOf(hitText) != '-1') {
                            if (Base.getCorrectText('4253282')) {
                                if (txt.indexOf('掌') != '-1' || txt.indexOf('拳') != '-1') {
                                    kezhi('2');
                                } else {
                                    kezhi('1');
                                }
                            } else {
                                doKillSet();
                            }
                            return
                        }
                    }
                }
            }
        });
        var qiText = gSocketMsg.get_xdz();
        if (qiText > 8) {
            kezhi('2');
        }
    }

    function hasQiLin() {
        var text = $('#vs11').text();
        if (text.indexOf('火麒麟王') != '-1') {
            return true;
        } else {
            return false;
        }
    }
    /* 对招 方法 :end */
    var healSpaceTime = true;
    function checkHeal() {
        var hp = geKeePercent();
        var qiNumber = gSocketMsg.get_xdz();
        if (qiNumber < 3) {
            return;
        }
        if (!healSpaceTime) {
            return true;
        }
        var neili = geForcePercent();
        var hasHeal = false;
        if (hp < 50) {
            var skillArr = ["紫血大法", "道种心魔经", "茅山道术"];
            if (maxQiReturn >= 30) {
                return false;
            }
            var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];
            $.each(skillArr, function (index, val) {
                var skillName = val;

                for (var i = 0; i < skillIdA.length; i++) {
                    var btnNum = skillIdA[i];
                    var btn = $('#skill_' + btnNum);
                    var btnName = btn.text();

                    if (btnName == skillName) {
                        btn.find('button').trigger('click');
                        // console.log(getTimes() + '血过少，使用技能【' + skillName + '】');
                        hasHeal = true;
                        maxQiReturn++;
                        chuzhaoNum();
                        healSpaceTime = false;
                        setTimeout(function () {
                            healSpaceTime = true;
                        }, 1000);
                        break;
                    }
                }
            });
        } else if (parseInt(neili) < 20) {
            var skillArr = ["紫血大法", "道种心魔经"];
            var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];
            if (Base.getCorrectText('4253282')) {
                skillArr = ['白首太玄经'];
            }
            $.each(skillArr, function (index, val) {
                var skillName = val;

                for (var i = 0; i < skillIdA.length; i++) {
                    var btnNum = skillIdA[i];
                    var btn = $('#skill_' + btnNum);
                    var btnName = btn.text();

                    if (btnName == skillName) {
                        btn.find('button').trigger('click');
                        // console.log(getTimes() + '内力过少，使用技能【' + skillName + '】');
                        healSpaceTime = false;
                        hasHeal = true;
                        setTimeout(function () {
                            healSpaceTime = true;
                        }, 2000);
                        break;
                    }
                }
            });
        } else if (hp < 50) {
            var zixueneigong = "紫血大法";
            for (var i = 1; i <= 8; i++) {
                if (g_obj_map.get("skill_button" + i) != undefined && ansi_up.ansi_to_text(g_obj_map.get("skill_button" + i).get("name")) == zixueneigong) {
                    clickButton("playskill " + i, 0);
                    healSpaceTime = false;
                    hasHeal = true;
                    setTimeout(function () {
                        healSpaceTime = true;
                    }, 2000);
                    return
                }
            }
        }

        if (!bixueSwitch && isBigBixue() && Jianshi.bx == 1) {
            var skillArr = ['碧血心法'];

            var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];

            $.each(skillArr, function (index, val) {
                var skillName = val;
                for (var i = 0; i < skillIdA.length; i++) {
                    var btnNum = skillIdA[i];
                    var btn = $('#skill_' + btnNum);
                    var btnName = btn.text();
                    if (btnName == skillName) {
                        btn.find('button').trigger('click');
                        console.log(getTimes() + '使用鼻血');
                    }
                }
            });
        }

        if (!bishouSwitch && Jianshi.bs == 1) {
            var skillArr = ['白首太玄经'];

            var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];

            $.each(skillArr, function (index, val) {
                var skillName = val;
                for (var i = 0; i < skillIdA.length; i++) {
                    var btnNum = skillIdA[i];
                    var btn = $('#skill_' + btnNum);
                    var btnName = btn.text();
                    if (btnName == skillName) {
                        btn.find('button').trigger('click');
                        console.log(getTimes() + '使用白首');
                    }
                }
            });
        }
        return hasHeal;
    }
    /* 怼人 方法 :start */
    var fightAllInter1 = null;
    var targetNpcName = null;
    function fightAllFunc1(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '怼人') {
            targetNpcName = prompt("请输入要使用的技能", "公主丞,未央公主,百夫长,孽龙之灵,真身,极武圣,拳斗师");
            if (targetNpcName) {
                Jianshi.dr = 1;
                // fightAllInter1 = setInterval(function () {
                //     doFightAll1(targetNpcName);
                // }, 200);
                console.log(getTimes() + '开始怼人');
                Dom.html('取消怼人');
            }
        } else {
            Jianshi.dr = 0;
            // clearInterval(fightAllInter1);
            console.log(getTimes() + '停止怼人');
            Dom.html('怼人');
        }
    }
    function doFightAll1(targetNpcName) {
        if ($('#skill_1').length == 0) {
            maxQiReturn = 0;
            chuzhaoNum();
            bixueEnd();
            hitMaxEnd();
            return;
        }
        var out = $('#out .out');
        out.each(function () {

            if ($(this).hasClass('doneTarget')) {
                return
            }

            $(this).addClass('doneTarget');

            var clickSkillSwitch = checkHeal();

            var qiText = gSocketMsg.get_xdz();
            if (qiText < 6 && targetNpcName) {
                return;
            }

            var txt = $(this).text();
            var hitDesList = null;
            // var OldList = ['刺你','扫你','指你','你如','至你','拍你','向你','在你','准你','点你','劈你','取你','往你','奔你','朝你','击你','斩你','扑你','取你','射你','你淬','卷你','要你','将你','涌向你','对准你','你急急','抓破你','对着你','你已是','你被震','钻入你','穿过你','你愕然','你一时','你难辨','你竭力','纵使你有','围绕着你','你生命之火','你扫荡而去','你反应不及','你再难撑持','你无处可避','贯穿你躯体','你挡无可挡','你大惊失色','你的对攻无法击破','你这一招并未奏效','你只好放弃对攻'];
            var OldList = hitKeys;
            if (targetNpcName) {
                hitDesList = targetNpcName.split(',').concat(killTargetArr);
            } else {
                hitDesList = OldList;
            }
            for (var i = 0; i < hitDesList.length; i++) {
                var hitText = hitDesList[i];
                if (txt.indexOf(hitText) != '-1') {
                    if (txt.indexOf('太极神功') != '-1' || txt.indexOf('金刚不坏功力') != '-1' || txt.indexOf('手脚迟缓') != '-1' || txt.indexOf('手脚无力') != '-1' || txt.indexOf('伤害') != '-1' || txt.indexOf('武艺不凡') != '-1' || txt.indexOf('我输了') != '-1' || txt.indexOf('脸色微变') != '-1' || txt.indexOf('直接对攻') != '-1') {
                        return;
                    }
                    else if (txt.indexOf('领教壮士的高招') == '-1' && txt.indexOf('深深吸了几口气') == '-1' && txt.indexOf('希望扰乱你') == '-1' && txt.indexOf('紧接着') == '-1' && txt.indexOf('同时') == '-1' && txt.indexOf('身形再转') == '-1' && txt.indexOf('迅疾无比') == '-1') {
                        if (txt.indexOf('掌') != '-1' || txt.indexOf('拳') != '-1') {
                            kezhi('2');
                        } else {
                            kezhi('1');
                        }
                        return;
                    }
                }
            }
        });
    }
    /* 怼人 方法 :end */
    /* 自动战斗 方法 :start */
    var autoKillInter = null;
    function autoKill(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '自动战斗') {
            autoKillInter = setInterval(function () {
                doKillSetAuto();
            }, timeInter);
            console.log(getTimes() + '开始自动战斗,内力少于30%回内力');
            Dom.html('取消自动');
        } else {
            clearInterval(autoKillInter);
            console.log(getTimes() + '停止自动战斗');
            Dom.html('自动战斗')
        }
    }
    var autoKillXuanhongInter = null;
    function autoKillXuanhong(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '悬红眩晕') {
            autoKillXuanhongInter = setInterval(function () {
                doKillSetXuanhong();
            }, timeInter);
            console.log(getTimes() + '开始悬红眩晕');
            Dom.html('停止眩晕');
        } else {
            clearInterval(autoKillXuanhongInter);
            console.log(getTimes() + '停止悬红眩晕');
            Dom.html('悬红眩晕')
        }
    }
    function doKillSetXuanhong() {
        if ($('span.outbig_text:contains(战斗结束)').length > 0 && !AutoPaiHangFuncIntervalFunc && Jianshi.sp == '0') {
            isOnstep1 = false;
            // go('golook_room');
            go('prev_combat');
        }
        if (!g_gmain.is_fighting) {
            Jianshi.xuanyun = 0;
            return;
        }
        var qiText = gSocketMsg.get_xdz();
        var hasHeal = false;
        if (qiText < 3) {
            return;
        }
        if (qiText >= 6) {
            // 改为枪在后
            setNewSkillsPosition('up');
        } else {
            setNewSkillsPosition('down');
        }
        var skillArr = Base.mySkillLists.split('；');
        if (Jianshi.tianjian == 1) {
            skillArr = ['月夜鬼萧', '破军棍诀', '千影百伤棍', '神龙东来', '冰月破魔枪'];
        }
        var vsName = g_obj_map.get("msg_vs_info").get("vs2_name1");
        if (vsName.indexOf('江洋大盗') >= 0) {
            if (Jianshi.xuanyun < 1) {
                Base.qi = 3;
                skillArr = ['步玄七诀', '意寒神功'];
            } else if (Jianshi.longxiang < 1) {
                skillArr = ['龙象般若功'];
            }
        } else {
            Base.qi = 6;
            hasHeal = checkHeal();
        }
        if (hasHeal || qiText < Base.qi) {
            return;
        }

        var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];
        var clickSkillSwitch = false;
        $.each(skillArr, function (index, val) {
            var skillName = val;

            for (var i = 0; i < skillIdA.length; i++) {
                var btnNum = skillIdA[i];
                var btn = $('#skill_' + btnNum);
                var btnName = btn.text();

                if (btnName == skillName) {
                    btn.find('button').trigger('click');
                    clickSkillSwitch = true;
                    break;
                }
            }
        });
    }
    function setNewSkillsArr(arr, key, type) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === key) {
                arr.splice(i, 1);
                break;
            }
        }
        if (type == 'up') {
            arr.unshift(key);
        } else {
            arr.push(key);
        }
        return arr;
    }
    function setNewSkillsPosition(type) {
        var skills = Base.mySkillLists;
        var skillsArr = skills.split('；');
        //破军棍诀,千影百伤棍,
        if (skills.indexOf('月夜鬼萧') > -1) {
            skillsArr = setNewSkillsArr(skillsArr, '月夜鬼萧', type);
        } else if (skills.indexOf('降龙廿八掌') > -1) {
            skillsArr = setNewSkillsArr(skillsArr, '降龙廿八掌', type);
        } else if (skills.indexOf('破军棍诀') > -1) {
            skillsArr = setNewSkillsArr(skillsArr, '破军棍诀', type);
        } else if (skills.indexOf('千影百伤棍') > -1) {
            skillsArr = setNewSkillsArr(skillsArr, '千影百伤棍', type);
        }
        Base.mySkillLists = skillsArr.join('；');
        // console.log(Base.mySkillLists)
    }
    window.doKillSet = function() {
        if ($('span.outbig_text:contains(战斗结束)').length > 0 && !AutoPaiHangFuncIntervalFunc && Jianshi.sp == '0') {
            isOnstep1 = false;
            // go('golook_room');
            go('prev_combat');
        }
        if (!g_gmain.is_fighting) {
            Jianshi.xuanyun = 0;
            return;
        }
        var qiText = gSocketMsg.get_xdz();
        if (qiText < 3) {
            return;
        }
        var skillArr = [];
        if (qiText >= 9){
            if (Base.getCorrectText('4253282')) {
                skillArr = ['月夜鬼萧', '同归绝剑', '天极剑', '无剑之剑'];
            }else{
                skillArr = Base.mySkillLists.split('；');
            }
        } else if (qiText >= 6) {
            // 改为棍在前
            setNewSkillsPosition('up');
            skillArr = Base.mySkillLists.split('；');
        } else {
            setNewSkillsPosition('down');
            skillArr = Base.mySkillLists.split('；');
        }

        var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];
        var clickSkillSwitch = false;
        $.each(skillArr, function (index, val) {
            var skillName = val;

            for (var i = 0; i < skillIdA.length; i++) {
                var btnNum = skillIdA[i];
                var btn = $('#skill_' + btnNum);
                var btnName = btn.text();

                if (btnName.indexOf(skillName) > -1) {
                    btn.find('button').trigger('click');
                    clickSkillSwitch = true;
                    break;
                }
            }
        });
    };
    function doKillSetSuiPian() {
        if ($('#skill_1').length == 0) {
            isOnstep1 = false;
            return;
        }

        var skillArr = Base.mySkillLists.split('；');

        var skillIdA = ['1', '2', '3', '4', '5', '6'];
        var clickSkillSwitch = false;
        $.each(skillArr, function (index, val) {
            var skillName = val;

            for (var i = 0; i < skillIdA.length; i++) {
                var btnNum = skillIdA[i];
                var btn = $('#skill_' + btnNum);
                var btnName = btn.text();

                if (btnName == skillName) {
                    btn.find('button').trigger('click');
                    clickSkillSwitch = true;
                    break;
                }
            }
        });
        if (!clickSkillSwitch) {
            go('playskill 1');
        }
    }
    function doKillSetAuto() {
        if ($('span.outbig_text:contains(战斗结束)').length > 0 && !AutoPaiHangFuncIntervalFunc && Jianshi.sp == '0') {
            isOnstep1 = false;
            // go('golook_room');
            go('prev_combat');
        }
        if ($('#skill_1').length == 0) {
            return;
        }
        var qiText = gSocketMsg.get_xdz();

        if (qiText < 3) {
            return;
        }

        var hasHeal = null;
        if (!followTeamSwitch) {
            hasHeal = checkHeal();
        }
        if (hasHeal) {
            return;
        }
        if (qiText < Base.qi) {
            return;
        }
        if (qiText >= 6) {
            // 改为枪在后
            setNewSkillsPosition('up');
        } else {
            setNewSkillsPosition('down');
        }
        var skillArr = Base.mySkillLists.split('；');

        if (daLouMode == 1) {
            skillArr = ["万流归一"];
        }

        var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];
        var clickSkillSwitch = false;
        $.each(skillArr, function (index, val) {
            var skillName = val;

            for (var i = 0; i < skillIdA.length; i++) {
                var btnNum = skillIdA[i];
                var btn = $('#skill_' + btnNum);
                var btnName = btn.text();

                if (btnName.indexOf(skillName) > -1) {
                    btn.find('button').trigger('click');
                    // console.log('自动技能：' + btnName);
                    clickSkillSwitch = true;
                    break;
                }
            }
        });
        // if (!clickSkillSwitch) {
        //     clickButton('playskill 1');
        // }
    }
    /* 自动战斗 方法 :end */
    /* 更换青龙装备 :start */
    var myCareList = "";    // 关注装备的名称
    function changeQinglong(e) {
        var careList = prompt("请输入要使用的技能", myCareList);
        if (careList) {
            myCareList = careList;
        }
    }
    /* 更换青龙装备 :end */
    /* 更换跨服青龙装备 :start */
    var myCareKuaFuList = "明月,碧玉锤,星月大斧,霸王枪,倚天剑,屠龙刀,墨玄掌套,冰魄银针,烈日棍,西毒蛇杖,碧磷鞭,月光宝甲衣";    // 关注装备的名称
    function changeQinglong1(e) {
        var txt = myCareKuaFuList;
        var careList = prompt("请输入要使用的技能", txt);
        if (careList) {
            myCareList = careList;
        }
    }
    /* 更换跨服青龙装备 :end */

    /* 更换非关注青龙装备 :start */
    var disCareList = "暴雨梨花针";    // 非关注装备的名称
    if (Base.getCorrectText('4253282')) {
        disCareList = "暴雨梨花针,轩辕剑碎片,破岳拳套碎片,玄冰凝魄枪碎片,胤武伏魔斧碎片,九天灭世锤碎片";        // 非关注装备的名称
    }
    if (Base.getCorrectText('4254240') && Base.correctQu() == '38') {
        disCareList = "暴雨梨花针,轩辕剑碎片,破岳拳套碎片,天神杖碎片,神龙怒火鞭碎片";        // 非关注装备的名称
    }
    if (Base.getCorrectText('3594649')) {
        disCareList = "暴雨梨花针,雷霆诛神刀碎片,轩辕剑碎片,破岳拳套碎片,玄冰凝魄枪碎片,胤武伏魔斧碎片,九天灭世锤碎片";    // 非关注装备的名称
    }
    // 有才
    if (Base.getCorrectText('4219507')) {
        disCareList = "暴雨梨花针,轩辕剑碎片,破岳拳套碎片,玄冰凝魄枪碎片,胤武伏魔斧碎片,九天灭世锤碎片";    // 非关注装备的名称
    }
    function setDisCareQingLong(e) {
        var careList = prompt("请输入要使用的技能", disCareList);
        if (careList) {
            disCareList = careList;
        }
    }
    /* 更换非关注青龙装备 :end */

    // 判断不是关注的青龙装备
    function getDisName(txt) {
        var _name = '';
        ALLNAME = disCareList.split(',');
        $.each(ALLNAME, function (n, v) {
            if (txt.indexOf(v) != '-1') {
                _name = v;
                return false;
            }
        });
        return _name;
    }
    /* 年兽 */
    var nianshouInterval = null;
    var nianshouChatInterval = null;
    function watchNianShou(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '监控年兽') {
            nianshouChatInterval = setInterval(autoGetBack, 2 * 60 * 1000);
            nianshouInterval = setInterval(function () {
                getNianInfo();
            }, 200);
            Dom.html('取消年兽');
        } else {
            clearInterval(nianshouInterval);
            clearInterval(nianshouChatInterval);
            Dom.html('监控年兽');
        }
    }
    function getNianInfo() {
        var len = $("#out>.out").length;
        var liCollection = $("#out>.out");

        $("#out>.out").each(function (i) {
            var Dom = liCollection.eq(len - i - 1);
            if (Dom.hasClass('doneNianshou')) {
                return
            }
            Dom.addClass('doneNianshou');
            var txt = Dom.text();

            if (txt.split('：').length > 2) {
                return;
            }

            if (txt.indexOf('听说年兽被') == '-1') {
                return;
            }

            console.log(getTimes() + txt);
            go('jh 1;e;n;n;n;n;n');
            setTimeout(function () {
                if ($('#btn5').html() == '搜尸') {
                    $('#btn5').trigger('click');
                }
            }, 2000);
            setTimeout(function () {
                if ($('#btn5').html() == '取消搜尸') {

                    $('#btn5').trigger('click');
                    clickButton('home');
                }
            }, 5 * 60 * 1000);
        });
    }
    /* 杀青龙 方法 :start */
    var Qname = '';     // 青龙恶人名称
    var idArr = [];     // 几个青龙人物的名称数组

    var ALLNAME = null;     // 装备名称字符串集合
    var qinglong = null;    // 定时查看是否有青龙
    var QLtrigger = 0;
    function killQinglong(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();

        if (DomTxt == '杀青龙') {
            Dom.html('取消青龙');
            //myCareList = prompt("请输入要监控的装备", "明月,烈日,墨玄掌套,冰魄银针,烈日棍,西毒蛇杖,碧磷鞭,月光宝甲衣,斩神刀,龙象掌套,暴雨梨花针,残阳棍,伏虎杖,七星鞭,日光宝甲衣,龙皮至尊甲衣,碎片,斩龙宝镯,小李飞刀");
            console.log(getTimes() + '开始杀青龙');
            myCareList = "紫芝,灵草,大还丹,狂暴丹,小还丹,乾坤再造丹,草,花,梅,木,菊,晚香玉,仙客来,雪英";
            if (kuafuNpc) {
                myCareList = "紫芝,灵草,大还丹,狂暴丹,小还丹,乾坤再造丹,碎片,草,花,梅,木,菊,晚香玉,仙客来,雪英";
            }

            if (Base.getCorrectText('4254240') && Base.correctQu() == '38') {
                myCareList = "斩龙宝靴,小李飞刀,碎片,草,花,梅,木,菊,晚香玉,仙客来,雪英";
            }

            if (Base.getCorrectText('4316804')) {
                myCareList = "天雷断龙斧,斩龙宝镯,碎片,草,花,梅,木,菊,晚香玉,仙客来,雪英";
            }

            if (Base.getCorrectText('4253282') && Base.correctQu() == '38') {

            }
            if (Base.getCorrectText('6759436') || Base.getCorrectText('6759458') || Base.getCorrectText('6759488') || Base.getCorrectText('6759492') || Base.getCorrectText('6759497') || Base.getCorrectText('6759498')) {
                myCareList = "星河剑,血屠刀,霹雳掌套,生死符,毒龙鞭,封魔杖,玉清棍,金丝宝甲衣,残雪,明月,倚天剑,屠龙刀,墨玄掌套,冰魄银针,烈日棍,西毒蛇杖,碧磷鞭,月光宝甲衣,";
            }

            QLtrigger = 1;
        } else {
            clearInterval(qinglong);
            clearTimeout(getNameTimeout);
            console.log(getTimes() + '停止杀青龙');
            QLtrigger = 0;
            Dom.html('杀青龙');
        }
    }
    // 获取最近出现的一个青龙
    Array.prototype.max = function () {
        var index = 0;
        var max = this[0];
        var len = this.length;
        for (var i = 1; i < len; i++) {
            if (Number(this[i]) >= Number(max)) {
                max = this[i];
                index = i;
            }
        }
        return index;
    };
    //去位置
    async function goPlace(place) {

        switch (place) {
            case "书房":
                await goSfang();
                break;
            case "打铁铺子":
                await goTie();
                break;
            case "桑邻药铺":
                await goYao();
                break;
            case "南市":
                await goNan();
                break;
            case "绣楼":
                await goXiu();
                break;
            case "北大街":
                await goNStreet();
                break;
            case "钱庄":
                await goQian();
                break;
            case "桃花别院":
                await goTao();
                break;
            case "杂货铺":
                await goZa();
                break;
            case "祠堂大门":
                await goCi();
                break;
            case "厅堂":
                await goTing();
                break;
        }
        await new Promise(function (resolve) {
            setTimeout(resolve, 500);
        });

        idArr = [];
        await killQ();
    };


    function QinglongMon() {
        this.dispatchMessage = function (b) {
            var type = b.get("type"), subType = b.get("subtype");

            if (type == "main_msg") {
                var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));

                // 无级别限制镖车
                if (msg.indexOf(kuafuNpc + '花落云') != '-1') {
                    console.log(getTimes() + msg);
                    Qname = kuafuNpc + '墟归一';
                    var urlSplitArr = msg.split("href;0;")[1].split("");
                    var url = urlSplitArr[0];
                    go(url);
                    killQ();
                    return false;
                }
                //监控有人开帮派拼图
                if (msg.match("宝藏地图。") != null) {
                    go('clan bzmt puzz');
                    go('clan bzmt puzz');
                    go('clan bzmt puzz');
                    go('clan bzmt puzz');

                    var json_msg = '帮派地图碎片已经开起';
                    var msg = '[CQ:at,qq=35994480] ' + json_msg.replace(/\n/g, "");
                    var json_str = '{"act":"101","groupid":"465355403","msg": "' + msg + '"}';
                    // if(webSocket)webSocket.send(json_str);
                    return;
                }

                if (msg.match("有人取代了你的连线") != null) {
                    isOnline = false;
                }

                //监控 青龙
                if (QLtrigger == 1) {

                    // var m = msg.match(/荣威镖局：\[36-40区\]花落云/);
                    // if (msg.indexOf('[36-40区]花落云') != '-1') {
                    //     console.log(getTimes() + msg);
                    //     Qname = '[36-40区]墟归一';
                    //     var urlSplitArr = msg.split("href;0;")[1].split("");
                    //     var url = urlSplitArr[0];
                    //     go(url);
                    //     killQ();
                    //     return false;
                    // }

                    if (msg.indexOf('新区') != '-1') {
                        return;
                    }

                    if (msg.indexOf('战利品') == '-1') {
                        return
                    }

                    if (isKuaFu()) {
                        if (msg.indexOf(kuafuNpc) == '-1') {
                            return false;
                        }
                    } else {
                        if (msg.indexOf('本大区') != '-1') {
                            return false;
                        }
                    }

                    // console.log(msg);
                    if (getDisName(msg)) {
                        return;
                    }

                    var pname = getPname(msg);

                    if (pname) {
                        console.log(getTimes() + msg);
                        if (msg.indexOf('href') < 0) return;
                        var urlSplitArr = msg.split("href;0;")[1].split("");
                        var url = urlSplitArr[0];
                        Qname = msg.split("组织：")[1].split("正在")[0];
                        getKuaFuNpc(msg);
                        if (Qname) {
                            if (isBigId()) {
                                go(url);
                                killQ();
                            } else {
                                var placeName = urlSplitArr[1];
                                goPlace(placeName);
                                console.log('还没开通Vip只能步行过去');
                            }
                        }
                    }
                }
            }
        }
    }
    var qlMon = new QinglongMon;

    async function quickKill(href) {
        window.location.href = href;
        idArr = [];
        killQ();
    };
    function isKuaFu() {
        var isTure = false;
        if (kuafuNpc != '') {
            isTure = true;
        }
        return isTure;
    }
    function getKuaFuNpc(msg) {
        if (isKuaFu() && !killBadSwitch) {
            getNameFromPlace(msg);
        }
    }
    function getNameFromPlace(msg) {
        if (msg.indexOf('打铁铺子') != '-1') {
            Qname = '王铁匠';
        } else if (msg.indexOf('桑邻药铺') != '-1') {
            Qname = '杨掌柜';
        } else if (msg.indexOf('书房') != '-1') {
            Qname = '柳绘心';
        } else if (msg.indexOf('南市') != '-1') {
            Qname = '客商';
        } else if (msg.indexOf('北大街') != '-1') {
            Qname = '卖花姑娘';
        } else if (msg.indexOf('钱庄') != '-1') {
            Qname = '刘守财';
        } else if (msg.indexOf('绣楼') != '-1') {
            Qname = '柳小花';
        } else if (msg.indexOf('祠堂大门') != '-1') {
            Qname = '朱老伯';
        } else if (msg.indexOf('厅堂') != '-1') {
            Qname = '方寡妇';
        } else if (msg.indexOf('杂货铺') != '-1') {
            Qname = '方老板';
        }
        Qname = kuafuNpc + Qname;
    }
    // 找到青龙目标
    var getNameTimeout = null;
    async function killQ() {
        idArr = [];
        var btn = $('.cmd_click3:contains(' + Qname + ')');
        if (btn.length == 0) {
            console.log('没有找到' + Qname + '重新找');
            clearTimeout(getNameTimeout);
            getNameTimeout = setTimeout(function () {
                killQ();
            }, 300);
            return;
        }

        for (var i = btn.length - 1; i >= 0; i--) {
            var THISBTN = btn.eq(i);
            var txt = THISBTN.text();

            if (txt == Qname) {
                var npcText = null;
                if (isKuaFu() && !killBadSwitch) {
                    npcText = THISBTN.attr('onclick');
                } else {
                    if (killBadSwitch) {
                        npcText = THISBTN.attr('onclick');
                    } else {
                        npcText = THISBTN.prev().attr('onclick');
                    }
                }
                // console.log(npcText);
                var id = getId(npcText);
                idArr.push(id);
                break;
            }
        }
        var maxId = null;
        if (idArr.length > 1) {
            var newIdArr = [];
            for (var i = 0; i < idArr.length; i++) {
                if (killBadSwitch) {
                    newIdArr.push(idArr[i].replace('eren', ''));
                } else {
                    newIdArr.push(arr[i].replace('bad_target_', ''));
                }
            }
            maxId = newIdArr.max();
            maxId = idArr[maxId];
        } else {
            maxId = idArr[0];
        }
        console.log(getTimes() + maxId);
        if (maxId) {
            await killE(maxId);
        }
        clearInterval(clearNpcInterval);
        setTimeout(function () {
            if ($('#skill_1').length == 0) {
                console.log('没有进入战斗，重新来过');
                clearTimeout(getNameTimeout);
                getNameTimeout = setTimeout(function () {
                    killQ();
                }, 100);
            } else {
                clearTimeout(getNameTimeout);
            }
        }, 300);
    };
    // 杀死青龙
    async function killE(name) {
        await clickButton('kill ' + name);
    };
    // 获取恶人的id
    function getId(text) {
        var arr = text.split(',');
        var newArr = arr[0].split('(');
        var nowArr = newArr[1].split(' ');
        var str = nowArr[1];
        var id = str.substr(0, str.length - 1);
        return id;
    }
    // 判断是不是关注的青龙装备
    function getPname(txt) {
        var _name = '';
        ALLNAME = myCareList.split(',');
        $.each(ALLNAME, function (n, v) {
            if (txt.indexOf(v) != '-1') {
                _name = v;
                return false;
            }
        });
        return _name;
    };
    // 去书院
    async function goSyuan() {
        go('home');
        go('jh 1');
        go('go east');  // 广场
        go('go south'); // 街口
        go('go west');  // 街道
        go('go south'); // 书院
    };
    // 去书房
    async function goSfang() {
        go('home');
        go('jh 1');
        go('go east');  // 广场
        go('go north'); // 街道
        go('go east');  // 大门
        go('go east');  // 教练场
        go('go east');  // 大厅
        go('go east');  // 天井
        go('go north'); // 进书房
    };
    // 去药店
    async function goYao() {
        go('home');
        go('jh 1');
        go('go east');  // 广场
        go('go north'); // 街道
        go('go north'); // 街道
        go('go north'); // 街道
        go('go west'); // 进药店
    };
    // 去铁匠铺
    async function goTie() {
        go('home');
        go('jh 1');
        go('go east');  // 广场
        go('go north'); // 街道
        go('go north'); // 街道
        go('go west')
    };
    // 去南市
    async function goNan() {
        go('home');
        go('jh 2');
        go('go north');  // 南郊小路
        go('go north');  // 南门
        go('go east');  // 南市
    };
    // 去北大街
    async function goNStreet() {
        go('home');
        go('jh 2');
        go('go north');  // 南郊小路
        go('go north');  // 南门
        go('go north');  // 南大街
        go('go north');  // 洛川街
        go('go north');  // 中心鼓楼
        go('go north');  // 中州街
        go('go north');  // 北大街
    };
    // 去北大街
    async function goQian() {
        go('home');
        go('jh 2');
        go('go north');  // 南郊小路
        go('go north');  // 南门
        go('go north');  // 南大街
        go('go north');  // 洛川街
        go('go north');  // 中心鼓楼
        go('go north');  // 中州街
        go('go north');  // 北大街
        go('go east');   // 钱庄
    };
    // 去桃花别院
    async function goTao() {
        go('home');
        go('jh 2');
        go('go north');  // 南郊小路
        go('go north');  // 南门
        go('go north');  // 南大街
        go('go north');  // 洛川街
        go('go west');   // 铜驼巷
        go('go south');  // 桃花别院
    };
    // 去绣楼
    async function goXiu() {
        go('home');
        go('jh 2');
        go('go north');  // 南郊小路
        go('go north');  // 南门
        go('go north');  // 南大街
        go('go north');  // 洛川街
        go('go west');   // 铜驼巷
        go('go south');  // 桃花别院
        go('go west');   // 绣楼
    };
    // 去杂货店
    async function goZa() {
        go('home');
        go('jh 3');
        go('go south');  // 青石街
        go('go south');  // 银杏广场
        go('go east');  // 杂货店
    };
    // 去祠堂大门
    async function goCi() {
        go('home');
        go('jh 3');
        go('go south');  // 青石街
        go('go south');  // 银杏广场
        go('go west');   // 祠堂大门
    };
    // 去厅堂
    async function goTing() {
        go('home');
        go('jh 3');
        go('go south');  // 青石街
        go('go south');  // 银杏广场
        go('go west');   // 祠堂大门
        go('go north');   // 厅堂
    };

    // 音乐地址
    // var myAudio = new Audio();
    // myAudio.src = 'http://front.52yingzheng.com/work/2018/Q2/wap-xjpsc/audio/wait.mp3';
    // 播放音乐
    // function playMp3() {
    //     myAudio.play();
    // }
    /* 杀青龙 方法 :end */
    // 红包
    var hongBaoInterval = null, chatInterval = null;
    function killQLHB(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();

        if (DomTxt == '抢红包') {

            Dom.html('取消红包');
            console.log(getTimes() + '开始抢红包');
            clickButton('go_chat');
            $('#out .out').addClass('doneHongB');
            hongBaoInterval = setInterval(function () {
                getQLHBName();
            }, 200);
            chatInterval = setInterval(function () {
                // autoGetBack();
            }, 1 * 60 * 1000);
        } else {
            clearInterval(hongBaoInterval);
            clearInterval(chatInterval);
            console.log(getTimes() + '停止抢红包');
            Dom.html('抢红包');
        }
    }
    function getQLHBName() {
        var out = $('#out .out');
        out.each(function () {

            if ($(this).hasClass('doneHongB')) {
                return
            }

            $(this).addClass('doneHongB');

            var txt = $(this).text();

            if (txt.split('：').length > 1) {
                return;
            }
            var txt = $(this).text();

            if (txt.indexOf('试试新年手气') != '-1') {
                var placeDom = $(this).find('a');
                if (placeDom.length > 0) {
                    // console.log(txt);
                    var href = placeDom.attr('href');
                    window.location.href = href;
                }
            }
        });
    }
    /* 玄铁: start */
    function getXuanTie() {
        console.log(getTimes() + '冰火岛玄铁');
        go('home;jh 5;n;n;n;n;n;n;n;n;n;n;ne;chuhaigo;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home'); //冰火岛玄重铁
    }

    function getBingyue() {
        console.log(getTimes() + '开始冰月');
        go('home;jh 14;w;n;n;n;n;event_1_32682066;event_1_35756630;kill bingyuegu_yueyihan;');
        setTimeout(function () {
            console.log(getTimes() + '开始打第二层');
            go('event_1_55319823;kill bingyuegu_xuanwujiguanshou');
            setTimeout(function () {
                go('event_1_17623983;event_1_6670148;kill bingyuegu_hundunyaoling;');
                setTimeout(function () {
                    go('s;kill bingyuegu_xianrenfenshen');
                }, 40000);
            }, 40000);
        }, 30000);
    }
    /* 玄铁: end */
    /* 钓鱼 方法 :start */
    var resFishingParas = 100;   // 系统里默认最多挖50次
    var diaoyu_buttonName = 'diaoyu';
    var firstFishingParas = true;
    var resFishToday = 10;
    var lastFishMsg = "";
    var fishFunc = null;
    function fishingFirstFunc() {
        console.log("开始走向冰火岛！");
        fishingFirstStage();
    };
    async function fishingFirstStage() {
        go('home');
        clearInterval(fishFunc);
        // 进入扬州
        go('jh 5');       // 进入章节
        go('go north');     // 南门大街
        go('go north');   // 十里长街3
        go('go north');    // 十里长街2
        go('go north');      // 十里长街1
        go('go north');      // 中央广场
        go('go north');      // 十里长街4
        go('go north');      // 十里长街5
        go('go north');      // 十里长街6
        go('go north');      // 北门大街
        go('go north');      // 镇淮门
        go('go northeast');     // 扬州港
        go('look_npc yangzhou_chuanyundongzhu');
        go('chuhai go');
        go('chuhaigo');
        await fishingSecondFunc();
    };
    // 挖鱼饵参数

    async function fishingSecondFunc() {
        resFishToday = 10;
        console.log("开始挖鱼饵、砍树、钓鱼！");
        fishingSecondStage();
    };
    async function fishingSecondStage() {
        // 到达冰火岛
        go('go northwest');      // 熔岩滩头
        go('go northwest');      // 海蚀涯
        go('go northwest');      // 峭壁崖道
        go('go north');      // 峭壁崖道
        go('go northeast');     // 炙溶洞口
        go('go northwest');      // 炙溶洞
        go('go west');     // 炙溶洞口
        go('go northwest');     // 熔岩小径
        go('go east');     // 熔岩小径
        go('go east');      // 石华林
        go('go east');      // 分岛岭
        go('go east');      // 跨谷石桥
        go('go east');     // 大平原
        go('go southeast');
        go('go east');
        // 开始钓鱼
        resFishingParas = 100;
        firstFishingParas = true;
        $('#out2 .out2').remove();
        fishIt();
        lastFishMsg = "";
        if (!fishFunc) {
            fishFunc = setInterval(fishIt, 6000);
        }
    };
    async function fishIt() {
        // 钓鱼之前先判断上次结果
        // 判断是否调出了东西
        go('golook_room');
        // console.log($('span:contains(突然)').text().slice(-9));

        if ($('span:contains(突然)').text().slice(-9) !== '没有钓上任何东西。' && !firstFishingParas) {
            if (lastFishMsg !== $('span:contains(突然)').text()) { // 防止钓鱼太快
                resFishToday = resFishToday - 1;
                console.log(getTimes() + '钓到一条鱼，剩余钓鱼次数：%d，剩余鱼的条数:%d', resFishingParas, resFishToday);
            } else {
                // console.log("应该是钓鱼太快了！");
            }
        }
        else {
            if (!firstFishingParas) {
                // console.log(getTimes() +'shit！什么也没钓到！');
            }
        }
        lastFishMsg = $('span:contains(突然)').text();
        if (resFishingParas > 0 && resFishToday > 0) {
            clickButton(diaoyu_buttonName);
            resFishingParas = resFishingParas - 1;
            console.log(getTimes() + '钓一次鱼，剩余钓鱼次数：%d，剩余鱼的条数:%d', resFishingParas, resFishToday);
            firstFishingParas = false;
            var hasYue = $('span:contains(钓鱼需要)').text().slice(-20);
            if (isContains(hasYue, '钓鱼需要鱼竿和鱼饵，你没有') && hasYue != '') {
                clearInterval(fishFunc);
                console.log(getTimes() + '鱼竿或鱼饵不足，停止钓鱼！');
            }
            var hasDoneYue = $('span:contains(被你钓光了)');
            if (hasDoneYue.length > 0) {
                clearInterval(fishFunc);
                console.log(getTimes() + '钓够10条了');
                if (Base.getCorrectText('4253282')) {
                    go('go west');
                    go('go north');
                    go('go north');
                    go('go west');
                    go('go north');
                    go('go west');
                    go('event_1_53278632');
                    setTimeout(function () {
                        go('sousuo');
                        go('sousuo');
                        go('home');
                    }, 5000);
                } else {
                    go('home');
                }
            }
        }
        else {
            clearInterval(fishFunc);
            if (Base.getCorrectText('4253282')) {
                go('go west');
                go('go north');
                go('go north');
                go('go west');
                go('go north');
                go('go west');
                go('event_1_53278632');
                setTimeout(function () {
                    go('sousuo');
                    go('sousuo');
                    go('home');
                }, 5000);
            } else {
                go('home');
            }
        }
    };
    /* 钓鱼 方法 :end */
    function removeByValue(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                arr.splice(i, 1);
            }
        }
    }
    /* 37 || 38 设置  :start */
    var QIxiaListText = '郭济；步惊鸿；火云邪神；浪唤雨；吴缜；护竺；李宇飞；王蓉；庞统；风行骓；风南；逆风舞；狐苍雁';
    var qixiaPlace = false;
    function doPlace() {
        if (Base.correctQu() == '38') {
            qixiaPlace = true;
        }
    }
    doPlace();
    /* 37 || 38 设置  :end */
    /* 比试奇侠  :start */
    var giveJinSwitch = 0;
    function give15Jin(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '去给15金') {
            Dom.html('在给15金');
            giveJinSwitch = 1;
            console.log(getTimes() + '设置给15金');
        } else if (DomTxt == '在给15金') {
            Dom.html('在给1金');
            giveJinSwitch = 2;
            console.log(getTimes() + '设置给1金');
        } else {
            giveJinSwitch = 0;
            Dom.html('去给15金');
            console.log(getTimes() + '不设置给金');
        }
    }
    var QixiaInfoList = [];
    var QixiaIdList = [
        {
            'name': '浪唤雨',
            'id': qixiaPlace ? 'langfuyu_1494082366_3948' : 'langfuyu_1493782694_7241',
        }, {
            'name': '王蓉',
            'id': qixiaPlace ? 'wangrong_1494083286_5287' : 'wangrong_1493782958_7306',
        }, {
            'name': '庞统',
            'id': qixiaPlace ? 'pangtong_1494084207_2639' : 'pangtong_1493783879_4255',
        }, {
            'name': '李宇飞',
            'id': qixiaPlace ? 'liyufei_1494085130_5201' : 'liyufei_1493784259_6382',
        }, {
            'name': '步惊鸿',
            'id': qixiaPlace ? 'bujinghong_1494086054_1635' : 'bujinghong_1493785173_9368',
        }, {
            'name': '风行骓',
            'id': qixiaPlace ? 'fengxingzhui_1499611328_9078' : 'fengxingzhui_1499611243_9634',
        }, {
            'name': '郭济',
            'id': qixiaPlace ? 'guoji_1494086978_5597' : 'guoji_1493786081_9111',
        }, {
            'name': '吴缜',
            'id': qixiaPlace ? 'wuzhen_1499612120_4584' : 'wuzhen_1499612120_7351',
        }, {
            'name': '风南',
            'id': qixiaPlace ? 'fengnan_1494087902_8771' : 'fengnan_1493786990_415',
        }, {
            'name': '火云邪神',
            'id': qixiaPlace ? 'huoyunxieshen_1494088826_8655' : 'huoyunxieshen_1493787900_1939',
        }, {
            'name': '逆风舞',
            'id': qixiaPlace ? 'niwufeng_1494089750_5660' : 'niwufeng_1493788811_7636',
        }, {
            'name': '狐苍雁',
            'id': qixiaPlace ? 'hucangyan_1499613025_5192' : 'hucangyan_1499613026_2522',
        }, {
            'name': '护竺',
            'id': qixiaPlace ? 'huzhu_1499613932_2191' : 'huzhu_1499613933_1522',
        }, {
            'name': '八部龙将',
            'id': qixiaPlace ? 'babulongjiang_1521719740_7754' : 'babulongjiang_1521719730_537',
        }, {
            'name': '玄月研',
            'id': qixiaPlace ? 'xuanyueyan_1521600969_7372' : 'xuanyueyan_1521600969_8119',
        }, {
            'name': '狼居胥',
            'id': qixiaPlace ? 'langjuxu_1521715080_132' : 'langjuxu_1521715081_4559',
        }, {
            'name': '烈九州',
            'id': qixiaPlace ? 'liejiuzhou_1521716031_1449' : 'liejiuzhou_1521716024_5316',
        }, {
            'name': '穆妙羽',
            'id': qixiaPlace ? 'mumiaoyu_1521716956_979' : 'mumiaoyu_1521716949_346',
        }, {
            'name': '宇文无敌',
            'id': qixiaPlace ? 'yuwenwudi_1521717883_6285' : 'yuwenwudi_1521717874_9561',
        }, {
            'name': '李玄霸',
            'id': qixiaPlace ? 'lixuanba_1521718813_5916' : 'lixuanba_1521718806_7259',
        }, {
            'name': '风无痕',
            'id': qixiaPlace ? 'fengwuhen_1521720667_2927' : 'fengwuhen_1521720658_2332',
        }, {
            'name': '厉沧若',
            'id': qixiaPlace ? 'licangruo_1521721595_4149' : 'licangruo_1521721586_3467',
        }, {
            'name': '夏岳卿',
            'id': qixiaPlace ? 'xiaqing_1521722519_8891' : 'xiaqing_1521722508_7807',
        }, {
            'name': '妙无心',
            'id': qixiaPlace ? 'miaowuxin_1521723444_5139' : 'miaowuxin_1521723435_7261',
        }, {
            'name': '巫夜姬',
            'id': qixiaPlace ? 'wuyeju_1521724375_3924' : 'wuyeju_1521724367_482',
        }
    ];
    function GetNewQiXiaList() {
        clickButton('open jhqx');
        setTimeout(function () {
            getQiXiaList();
        }, 2000);
    }

    function getQiXiaList() {
        var html = g_obj_map.get("msg_html_page");
        if (html == undefined) {
            setTimeout(function () { GetNewQiXiaList(); }, 3000);
        } else if (g_obj_map.get("msg_html_page").get("msg").match("江湖奇侠成长信息") == null) {
            setTimeout(function () { GetNewQiXiaList(); }, 3000);
        } else {
            console.log('获取奇侠列表成功');
            var firstQiXiaList = formatQx(g_obj_map.get("msg_html_page").get("msg"));
            QixiaInfoList = SortNewQiXia(firstQiXiaList);
            giveSoreQiXiaListId();
            setQiXiaObj();
        }
    }
    // 给排序的奇侠列表赋予id
    function giveSoreQiXiaListId() {
        for (var i = 0; i < QixiaIdList.length; i++) {
            var name = QixiaIdList[i].name;
            for (var j = 0; j < QixiaInfoList.length; j++) {
                var cname = QixiaInfoList[j].name;
                if (cname == name) {
                    QixiaInfoList[j].id = QixiaIdList[i].id;
                }
            }
        }
    }
    function SortNewQiXia(firstQiXiaList) {//冒泡法排序
        var temp = {};
        var temparray = [];
        var newarray = [];
        for (var i = 0; i < firstQiXiaList.length; i++) {
            for (var j = 1; j < firstQiXiaList.length - i; j++) {
                if (parseInt(firstQiXiaList[j - 1]["degree"]) < parseInt(firstQiXiaList[j]["degree"])) {
                    temp = firstQiXiaList[j - 1];
                    firstQiXiaList[j - 1] = firstQiXiaList[j];
                    firstQiXiaList[j] = temp;
                }
            }
        }
        var tempcounter = 0;
        // console.log("奇侠好感度排序如下:");
        // console.log(firstQiXiaList);
        //首次排序结束 目前是按照由小到大排序。现在需要找出所有的超过25000 小于30000的奇侠。找到后 排序到最上面；
        var newList = [];
        for (var i = 0; i < firstQiXiaList.length; i++) {
            if (parseInt(firstQiXiaList[i]["degree"]) >= 30000) {
                temparray[tempcounter] = firstQiXiaList[i];
                tempcounter++;
                newarray.push(firstQiXiaList[i]);
            } else {
                newList.push(firstQiXiaList[i]);
            }
        }
        var firstInsertIndex = 4;
        for (var i = 0; i < newarray.length; i++) {
            newList.splice(firstInsertIndex, 0, newarray[i]);
            firstInsertIndex++;
        }
        return newList;
    }

    function getQiXiaObj(name) {
        var newArr = [];
        if (name) {
            for (var i = 0; i < QixiaInfoList.length; i++) {
                if (QixiaInfoList[i].name == name) {
                    qixiaObj = QixiaInfoList[i];
                }
            }
        }
    }

    var fightQixiaSwitch = true;
    var qixiaObj = {};

    function setQiXiaObj() {
        getQiXiaObj(loveYouxia);
        if (Base.getCorrectText('4254240')) {
            getQiXiaObj('夏岳卿');
        }
        // 37区大号
        if (Base.getCorrectText('4253282')) {
            getQiXiaObj('夏岳卿');
        }
        //38区 张三丰
        else if (Base.getCorrectText('4316804') && Base.correctQu() == '38') {
            getQiXiaObj('风行骓');
        }
        // 37区小号  西方失败
        else if (Base.getCorrectText('4316804') && Base.correctQu() == '37') {
            getQiXiaObj('风行骓');
        } else {
            getQiXiaObj('狐苍雁');
        }
        if (Base.getCorrectText('4254240')) {
            getQiXiaObj('狐苍雁');
        }
        //38区 东方大侠
        if (Base.getCorrectText('4254240') && Base.correctQu() == '38') {
            getQiXiaObj('逆风舞');
        }
        // 37区东方1-6号
        if (isSixId()) {
            getQiXiaObj('狐苍雁');
        }
        // 37区东方1-6号
        if (isSmallId()) {
            getQiXiaObj('狐苍雁');
        }
        //37区 老王跟班
        if (Base.getCorrectText('7030223')) {
            getQiXiaObj('夏岳卿');
        }
        // 37区 火狼
        if (Base.getCorrectText('7894304')) {
            getQiXiaObj('夏岳卿');
        }
        //37区 王有财
        if (Base.getCorrectText('4219507')) {
            getQiXiaObj('夏岳卿');
        }
        // console.log(qixiaObj);
    }

    var fightSkillInter = null,
        setFight = null,
        zhaobing = true;

    var mijingNum = 0;
    var isTalkQiXia = false;

    // 给奇侠1金锭
    var qixiaDone = false;
    var giveJinInterval = null;
    var giveQixiaSwitch = false;
    // 对话奇侠
    function talkToQixiaFn(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();

        if (DomTxt == '对话奇侠') {
            if (qixiaDone) {
                return;
            }
            isTalkQiXia = true;
            $('#out2 .out2').addClass('done');
            console.log(getTimes() + '开始对话' + qixiaObj.name + '！');
            $('#out2 .out2').addClass('doneQiXia1');
            giveQixiaSwitch = true;
            Dom.html('停止对话');
            giveJinQiXiaFunc();
        } else {
            isTalkQiXia = false;
            giveQixiaSwitch = false;
            clearInterval(giveJinInterval);
            Dom.html('对话奇侠');
        }
    }

    // 给奇侠1金
    function giveJinToQixiaFn(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '给奇侠金') {
            if (qixiaDone) {
                return;
            }
            $('#out2 .out2').addClass('done');
            console.log(getTimes() + '开始给奇侠金' + qixiaObj.name + '！');
            isTalkQiXia = false;
            giveQixiaSwitch = true;
            isInMijing = false;
            $('#out2 .out2').addClass('doneQiXia1');
            Dom.html('取消给金');
            // clickButton('open jhqx');
            GetNewQiXiaList();
            setTimeout(function () {
                giveJinQiXiaFunc();
            }, 4000);
        } else {
            giveQixiaSwitch = false;
            clearInterval(giveJinInterval);
            Dom.html('给奇侠金');
        }
    }

    function giveJinQiXiaFunc() {
        clearInterval(giveJinInterval);
        // clickButton('home');
        // clickButton('open jhqx');
        clickButton('find_task_road qixia ' + qixiaObj.index);
        if (giveQixiaSwitch) {
            setTimeout(function () {
                var QiXiaId = getNewQiXiaId(qixiaObj.name, qixiaObj.index);
                var qixiaName1 = QiXiaId.split('_')[0];
                // if(!isTalkQiXia){
                if (giveJinSwitch == 0) {
                    if (mijingNum == 3) {
                        eval("clickButton('auto_zsjd_" + qixiaName1 + "')");
                    } else if (mijingNum == 5) {
                        eval("clickButton('ask " + QiXiaId + "')");
                    } else if (mijingNum > 3) {
                        eval("clickButton('auto_zsjd20_" + qixiaName1 + "')");
                    } else {
                        eval("clickButton('ask " + QiXiaId + "')");
                    }
                } else if (giveJinSwitch == 1) {
                    eval("clickButton('auto_zsjd20_" + qixiaName1 + "')");
                } else if (giveJinSwitch == 2) {
                    eval("clickButton('auto_zsjd_" + qixiaName1 + "')");
                }
                // }else{
                //     eval("clickButton('ask " + QiXiaId + "')");
                // }

            }, 1000);
            giveJinInterval = setInterval(function () {
                geiJinQiXiaInfo();
            }, 1000);
        }
    }

    // 获取面板信息
    var isInMijing = false;
    var doGiveSetTimeout = null;
    function geiJinQiXiaInfo() {
        var out = $('#out2 .out2');
        out.each(function () {
            if ($(this).hasClass('doneQiXia1')) {
                return
            }
            $(this).addClass('doneQiXia1');
            var txt = $(this).text();
            if (txt.indexOf('悄声') != '-1') {
                mijingNum++;
                giveQixiaSwitch = false;
                var place = getQxiaQuestionPlace(txt);
                console.log(getTimes() + '这是第' + mijingNum + '次秘境，地址是：' + place);
                isInMijing = true;
                doGiveSetTimeout = setTimeout(function () {
                    $('#out2 .out2').addClass('doneQiXia1');
                    GoPlaceInfo(place);
                }, 1500);
            } else if (txt.indexOf('20/20') != '-1') {
                isInMijing = false;
                giveQixiaSwitch = false;
                isTalkQiXia = false;
                qixiaDone = true;
                clearInterval(giveJinInterval);
                clickButton('home');
                $('#btno18').html('给奇侠金');
                $('#btno23').html('对话奇侠');
            } else if (txt.indexOf('太多关于亲密度') != '-1') {
                isInMijing = false;
                giveQixiaSwitch = false;
                isTalkQiXia = false;
                qixiaDone = true;
                clearInterval(giveJinInterval);
                clickButton('home');
                $('#btno18').html('给奇侠金');
                $('#btno23').html('对话奇侠');
            } else if (txt.indexOf('你搜索到一些') != '-1') {
                doGiveSetTimeout = setTimeout(function () {
                    clickBtnByName('仔细搜索');
                }, 2000);
            } else if (txt.indexOf('秘境') != '-1') {
                doGiveSetTimeout = setTimeout(function () {
                    clickBtnByName('仔细搜索');
                }, 2000);
            } else if (txt.indexOf('秘密地图') != '-1') {
                doGiveSetTimeout = setTimeout(function () {
                    clickBtnByName('仔细搜索');
                }, 2000);
            } else if (txt.indexOf('你开始四处搜索') != '-1') {
                if (!hasSaoDan()) {
                    doGiveSetTimeout = setTimeout(function () {
                        isInMijing = false;
                        giveQixiaSwitch = true;
                        giveJinQiXiaFunc();
                    }, 1500);
                } else {
                    clickBtnByName('仔细搜索');
                    clickBtnByName('扫荡');
                    doGiveSetTimeout = setTimeout(function () {
                        $('.cmd_click2').trigger('click');
                    }, 2000);
                }
            } else if (txt.indexOf('扫荡成功') != '-1') {
                doGiveSetTimeout = setTimeout(function () {
                    isInMijing = false;
                    giveQixiaSwitch = true;
                    giveJinQiXiaFunc();
                }, 3000);
            } else if (txt.indexOf('今日亲密度操作次数') != '-1') {
                if (!isInMijing) {
                    doGiveSetTimeout = setTimeout(function () {
                        if (giveQixiaSwitch) {
                            giveJinQiXiaFunc();
                        }
                    }, 2500);
                }
            } else if (txt.indexOf('此地图还未解锁') != '-1') {
                doGiveSetTimeout = setTimeout(function () {
                    giveQixiaSwitch = true;
                    isInMijing = false;
                    giveJinQiXiaFunc();
                }, 10000);
            } else if (txt.match(qixiaObj.name + "往(.*?)离开。")) {
                if (isInMijing) {
                    return;
                }
                clearTimeout(doGiveSetTimeout);
                doGiveSetTimeout = setTimeout(function () {
                    giveQixiaSwitch = true;
                    isInMijing = false;
                    giveJinQiXiaFunc();
                }, 3000);
            }
        });
    }
    // 是否可以扫荡
    function hasSaoDan() {
        var btns = $('.cmd_click3');
        var hasSD = false;
        btns.each(function () {
            if ($(this).text() == '扫荡') {
                hasSD = true;
            }
        });
        return hasSD;
    }
    // 扫荡
    function clickBtnByName(txt) {
        var btns = $('.cmd_click3');
        btns.each(function () {
            if ($(this).text() == txt) {
                $(this).trigger('click');
                setTimeout(function () {
                    console.log(getTimes() + '点击扫荡');
                }, 1000);
            }
        });
    }
    // 打奇侠方法
    function startFightQixiaFn(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();

        if (DomTxt == '比试奇侠') {
            $('#out2 .out2').addClass('doneQiXia');
            fightQixiaSwitch = true;
            Dom.html('取消奇侠');
            fightQiXiaFunc();
        } else {
            fightQixiaSwitch = false;
            clearInterval(fightSkillInter);
            clearInterval(setFight);
            Dom.html('比试奇侠');
        }
    }

    //
    function getNewQiXiaId(name, QXindex) {
        console.log("开始寻找奇侠：" + name);
        var QX_ID = "";
        var npcindex = 0;
        var els = g_obj_map.get("msg_room").elements;
        for (var i = els.length - 1; i >= 0; i--) {
            if (els[i].key.indexOf("npc") > -1) {
                if (els[i].value.indexOf(",") > -1) {
                    var elsitem_ar = els[i].value.split(',');
                    if (elsitem_ar.length > 1 && elsitem_ar[1] == name) {
                        // console.log(elsitem_ar[0]);
                        npcindex = els[i].key;
                        QX_ID = elsitem_ar[0];
                    }
                }
            }
        }
        if (QX_ID) {
            return QX_ID
        }
        return false;

    }
    // 打奇侠定时器
    function fightQiXiaFunc() {
        clickButton('home');
        zhaobing = true;
        console.log(getTimes() + '开始比试' + qixiaObj.name + '！');
        clickButton('open jhqx');
        clickButton('find_task_road qixia ' + qixiaObj.index);
        if (fightQixiaSwitch) {
            setTimeout(function () {
                var QiXiaId = getNewQiXiaId(qixiaObj.name, qixiaObj.index);
                eval("clickButton('fight " + QiXiaId + "')");
                // eval("clickButton('fight " + qixiaObj.id + "')");
                // clickButton('fight huoyunxieshen_1493787900_1939');
                fightSkillInter = setInterval(function () {
                    getQiXiaInfo();
                }, 2000);
                setFight = setInterval(function () {
                    dofightQixiaSet();
                }, 2000);
            }, 1000);
        }
    }

    // 比试奇侠技能
    function dofightQixiaSet() {
        var skillArr = Base.mySkillLists.split('；');
        if (zhaobing) {
            skillArr = ['茅山道术', '天师灭神剑'];
        }

        if (hasDog().length > 0 && zhaobing) {
            clickButton('escape');
            return false;
        }
        var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];
        var clickSkillSwitch = false;
        $.each(skillIdA, function (index, val) {
            var btn = $('#skill_' + val);
            var btnName = btn.text();
            for (var i = 0; i < skillArr.length; i++) {
                var skillName = skillArr[i];
                if (btnName == skillName) {
                    btn.find('button').trigger('click');
                    clickSkillSwitch = true;
                    break;
                }
            }
        });
        //clickButton('escape');
        if (!clickSkillSwitch && $('.cmd_skill_button').length > 0) {
            clickButton('playskill 1');
        }
    }

    // 获取面板信息
    function getQiXiaInfo() {
        var out = $('#out2 .out2');
        out.each(function () {
            if ($(this).hasClass('doneQiXia')) {
                return
            }
            $(this).addClass('doneQiXia');
            var txt = $(this).text();
            if (txt.indexOf('悄声') != '-1') {
                mijingNum++;
                fightQixiaSwitch = false;
                clearInterval(fightSkillInter);
                clearInterval(setFight);
                var place = getQxiaQuestionPlace(txt);
                console.log(getTimes() + '这是第' + mijingNum + '次秘境，地址是：' + place);
                setTimeout(function () {
                    fightQixiaSwitch = false;
                    clearInterval(fightSkillInter);
                    clearInterval(setFight);
                    GoPlaceInfo(place);
                }, 2000);
            } else if (txt.indexOf('20/20') != '-1') {
                fightQixiaSwitch = false;
                clearInterval(fightSkillInter);
                clearInterval(setFight);
            } else if (txt.indexOf('逃跑成功') != '-1') {
                //clearInterval(fightSkillInter);
                // clickButton('golook_room');
                clickButton('home');
                clickButton('open jhqx');
                clickButton('find_task_road qixia ' + qixiaObj.index);
                setTimeout(function () {
                    fightDog();
                }, 1000);
            } else if (txt.indexOf('今日亲密度操作次数') != '-1') {
                // fightQixiaSwitch = false;
                clearInterval(fightSkillInter);
                clearInterval(setFight);
                setTimeout(function () {
                    fightQiXiaFunc();
                }, 1000);
            } else if (txt.match(qixiaObj.name + "往(.*?)离开。")) {
                clearInterval(fightSkillInter);
                clearInterval(setFight);
                setTimeout(function () {
                    fightQiXiaFunc();
                }, 1000);
            }
        });
    }
    // 比试狗
    function fightDog() {
        if (getDogNum().length > 0) {
            doFightDog();
        }
    }
    function doFightDog() {
        var nameArr = [];
        var nameDom = $('.cmd_click3');
        console.log(getTimes() + '开始打兵');
        nameDom.each(function () {
            var name = $(this).text();
            if (name == '金甲符兵' || name == '玄阴符兵') {
                var npcText = $(this).attr('onclick');
                var id = getId(npcText);
                clickButton('fight ' + id);
                zhaobing = false;
            }
        })
    }
    function getQxiaQuestionPlace(txt) {
        var correctPlace = txt.split('，')[0].split('去')[1];
        return correctPlace;
    }
    // east  west south north northeast northwest northsouth southeast
    //
    // northwest    north(上)     northeast
    //
    // west(左)                   east(右)
    //
    // southwest    south(下)     southeast
    //
    function GoPlaceInfo(place) {
        var placeNum = '';
        var placeSteps = [];
        switch (place) {
            case '卢崖瀑布':
                placeNum = '22';
                placeSteps = [{ 'road': 'north' }];
                break;
            case '戈壁':
                placeNum = '21';
                placeSteps = [{ 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '草原':
                placeNum = '26';
                placeSteps = [{ 'road': 'west' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '天梯':
                placeNum = '24';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '观景台':
                placeNum = '24';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'east' }, { 'road': 'east' }, { 'road': 'north' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '启母石':
                placeNum = '22';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'west' }, { 'road': 'west' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '无极老姆洞':
                placeNum = '22';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'west' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '千尺幢':
                placeNum = '4';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '猢狲愁':
                placeNum = '4';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'event': 'event_1_91604710' }, { 'road': 'northwest' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '潭畔草地':
                placeNum = '4';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'event': 'event_1_91604710' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '临渊石台':
                placeNum = '4';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'east' }, { 'road': 'north' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '玉女峰':
                placeNum = '4';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'west' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '长空栈道':
                placeNum = '4';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'east' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '山坳':
                placeNum = '1';
                placeSteps = [{ 'road': 'east' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '山溪畔':
                placeNum = '22';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'west' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'event': 'event_1_88705407' }, { 'road': 'south' }, { 'road': 'south' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '小洞天':
                placeNum = '24';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'east' }, { 'road': 'east' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '观景台':
                placeNum = '24';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'east' }, { 'road': 'east' }, { 'road': 'north' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '云步桥':
                placeNum = '24';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '桃花泉':
                placeNum = '3';
                placeSteps = [{ 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'northwest' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'east' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '碧水寒潭':
                placeNum = '18';
                placeSteps = [{ 'road': 'north' }, { 'road': 'northwest' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'northeast' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'east' }, { 'road': 'east' }, { 'road': 'southeast' }, { 'road': 'southeast' }, { 'road': 'east' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '玉壁瀑布':
                placeNum = '16';
                placeSteps = [{ 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'east' }, { 'road': 'north' }, { 'road': 'east' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '湖边':
                placeNum = '16';
                placeSteps = [{ 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'east' }, { 'road': 'north' }, { 'road': 'east' }, { 'event': 'event_1_5221690' }, { 'road': 'south' }, { 'road': 'west' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '悬根松':
                placeNum = '9';
                placeSteps = [{ 'road': 'north' }, { 'road': 'west' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '夕阳岭':
                placeNum = '9';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'east' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '沙丘小洞':
                placeNum = '6';
                placeSteps = [{ 'event': 'event_1_98623439' }, { 'road': 'northeast' }, { 'road': 'north' }, { 'road': 'northeast' }, { 'road': 'northeast' }, { 'road': 'northeast' }, { 'event': 'event_1_97428251' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '寒水潭':
                placeNum = '20';
                placeSteps = [{ 'road': 'west' }, { 'road': 'west' }, { 'road': 'south' }, { 'road': 'east' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'southwest' }, { 'road': 'southwest' }, { 'road': 'south' }, { 'road': 'east' }, { 'road': 'southeast' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '青云坪':
                placeNum = '13';
                placeSteps = [{ 'road': 'east' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'west' }, { 'road': 'west' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '悬崖':
                placeNum = '20';
                placeSteps = [{ 'road': 'west' }, { 'road': 'west' }, { 'road': 'south' }, { 'road': 'east' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'southwest' }, { 'road': 'southwest' }, { 'road': 'south' }, { 'road': 'south' }, { 'road': 'east' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '奇槐坡':
                placeNum = '23';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '无名山峡谷':
                placeNum = '29';
                placeSteps = [{ 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }];
                break;
            case '危崖前':
                placeNum = '25';
                placeSteps = [{ 'road': 'west' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
            case '九老洞':
                placeNum = '8';
                placeSteps = [{ 'road': 'west' }, { 'road': 'northwest' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'east' }, { 'road': 'east' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'east' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'west' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'north' }, { 'road': 'northwest' }, { 'road': 'southwest' }, { 'road': 'west' }, { 'road': 'northwest' }, { 'road': 'west' }, { 'event': 'find_task_road secret' }, { 'event': 'secret_op1' }];
                break;
        }

        GoPlace(placeNum, placeSteps);
    };
    async function GoPlace(num, steps) {
        go('home');
        go('jh ' + num);
        //clickButton('go south');
        for (var i = 0; i < steps.length; i++) {
            for (var j in steps[i]) {
                if (j == 'road') {
                    go('go ' + steps[i][j]);
                } else if (j == 'event') {
                    go(steps[i][j]);
                }
            }
        }
    };
    /* 比试奇侠  :end */
    /* 撩奇侠  :start */

    function talkSelectQiXia() {
        GetNewQiXiaList();
        setTimeout(function () {
            startTalk();
        }, 3000);
    }
    function startTalk() {
        var isLive = true;
        for (var i = 0; i < 4; i++) {
            if (!QixiaInfoList[i].isOk) {
                isLive = false;
            }
        }
        if (!isLive) {
            console.log(getTimes() + '前4排名奇侠在浪中，请稍后再试');
            return;
        }
        for (var i = 0; i < QixiaInfoList.length; i++) {
            doTalkWithQixia(QixiaInfoList[i]);
        }
    }

    function doTalkWithQixia(info) {
        var maxLength = 5;
        var QiXiaId = info.id;

        if (!QiXiaId) {
            return;
        }
        if (!info.isOk) {
            console.log(getTimes() + '没找到' + info.name + ",请稍后再试");
            return;
        }

        console.log(getTimes() + "开始撩" + info.name + "！");
        go('open jhqx');
        go('find_task_road qixia ' + info.index);

        for (var i = 0; i < maxLength; i++) {
            go('ask ' + QiXiaId);
        };
        go('home');
    }

    String.prototype.trim = function (char, type) { // 去除字符串中，头部或者尾部的指定字符串
        if (char) {
            if (type == 'left') {
                return this.replace(new RegExp('^\\' + char + '+', 'g'), '');
            } else if (type == 'right') {
                return this.replace(new RegExp('\\' + char + '+$', 'g'), '');
            }
            return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
        }
        return this.replace(/^\s+|\s+$/g, '');
    };
    /* 撩奇侠  :end */
    /* 杀天剑  :start */
    var TianJianNPCList = [];
    var BaseTarget = [];
    var TianJianNPCList1 = ["农夫", "食虫虻", "天剑谷卫士", "十夫长", "百夫长", "银狼军", "铁狼军", "金狼军", "金狼将", "镇擂斧将", "赤豹死士", "黑鹰死士", "金狼死士", "暗灵杀手", "暗灵旗主", "镇谷神兽", "守谷神兽", "饕餮幼崽", "饕餮分身", "饕餮兽魂", "饕餮战神", "镇潭神兽", "守潭神兽", "螣蛇幼崽", "螣蛇分身", "螣蛇兽魂", "螣蛇战神", "镇山神兽", "守山神兽", "应龙幼崽", "应龙兽魂", "应龙分身", "应龙战神", "镇殿神兽", "守殿神兽", "幽荧幼崽", "幽荧兽魂", "幽荧分身", "幽荧战神"];
    var killTianJianIntervalFunc = null;
    var currentNPCIndex = 0;
    var fubenWalkTimeer = false;
    function killTianJianTargetFunc(e) {
        var Dom = $(e.target);
        if (Dom.html() == '杀天剑') {
            Base.skills();
            Base.qi = 6;
            currentNPCIndex = 0;
            if (Base.tianjianTarget != '') {
                BaseTarget = Base.tianjianTarget.split(',');
            }
            TianJianNPCList = BaseTarget.concat(TianJianNPCList1);
            console.log("开始杀天剑目标NPC！");
            Dom.html('停天剑');
            killTianJianIntervalFunc = setInterval(killTianJian, 2000);
            fubenWalkTimeer = true;
            goInFuben();
            Jianshi.tianjian = 1;

        } else {
            console.log("停止杀天剑目标NPC！");
            Dom.html('杀天剑');
            clearInterval(killTianJianIntervalFunc);
            fubenWalkTimeer = false;
            Jianshi.tianjian = 0;
        }
    };
    async function killTianJian() {
        if ($('.cmd_skill_button').length > 0) {
            return false;
        }
        // clickButton('golook_room')
        lookRoow();
        if ($('span').text().slice(-7) == "不能杀这个人。") {
            currentNPCIndex = currentNPCIndex + 1;
            console.log("不能杀这个人！");
            //        return;
        }
        getTianJianTargetCode();
        if (genZhaoMode != '1') {
            setTimeout(doKillSet, 1000);
        }
        if ($('span:contains(胜利)').text().slice(-3) == '胜利！' || $('span:contains(战败了)').text().slice(-6) == '战败了...') {
            currentNPCIndex = 0;
            console.log(getTimes() + '杀人一次！');
            go('golook_room');
        }
    };
    async function lookRoow() {
        if ($('.cmd_change_line').length > 0) {
            go('golook_room');
        }
    };
    async function getTianJianTargetCode() {
        var peopleList = $(".cmd_click3");
        var thisonclick = null;
        var targetNPCListHere = [];
        var countor = 0;
        for (var i = 0; i < peopleList.length; i++) { // 从第一个开始循环
            // 打印 NPC 名字，button 名，相应的NPC名
            thisonclick = peopleList[i].getAttribute('onclick');
            var btnText = peopleList[i].innerText;
            if (btnText.indexOf('尸体') != '-1') {
                continue;
            }
            if (btnText.indexOf('离开') != '-1') {
                continue;
            }
            if (btnText.indexOf('接引') != '-1') {
                continue;
            }
            if (btnText.indexOf('骸骨') != '-1') {
                continue;
            }
            if (TianJianNPCList.contains(btnText)) {
                var targetCode = thisonclick.split("'")[1].split(" ")[1];
                //           console.log("发现NPC名字：" +  peopleList[i].innerText + "，代号：" + targetCode);
                targetNPCListHere[countor] = peopleList[i];
                countor = countor + 1;
            }
        }
        // targetNPCListHere 是当前场景所有满足要求的NPC button数组
        if (currentNPCIndex >= targetNPCListHere.length) {
            currentNPCIndex = 0;
        }
        if (targetNPCListHere.length > 0) {
            thisonclick = targetNPCListHere[currentNPCIndex].getAttribute('onclick');
            var targetCode = thisonclick.split("'")[1].split(" ")[1];
            var neili = geForcePercent();
            if (neili < 50) {
                go('items use snow_wannianlingzhi');
                go('items use snow_wannianlingzhi');
                go('items use snow_wannianlingzhi');
            }
            console.log("准备杀目标NPC名字：" + targetNPCListHere[currentNPCIndex].innerText + "，代码：" + targetCode + "，目标列表中序号：" + (currentNPCIndex));
            go('kill ' + targetCode); // 点击杀人
            setTimeout(detectKillTianJianInfo, 1000); // 200 ms后获取杀人情况，是满了还是进入了
        }
    };
    function detectKillTianJianInfo() {
        var TianJianInfo = $('span').text();
        if (TianJianInfo.slice(-15) == "已经太多人了，不要以多欺少啊。") {
            currentNPCIndex = currentNPCIndex + 1;
        } else {
            currentNPCIndex = 0;
        }
    }
    Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
            if (obj.indexOf(this[i]) != '-1') {
                return true;
            }
            // if (this[i] === obj) {
            //     return true;
            // }
        }
        return false;
    };
    var finishFubenOneline = false;
    var finishFubenLeft = false;
    var finishFubenRight = false;

    function goInFuben() {
        // 在副本1
        if (hasTargetNameIndex('尸体')) {
            // 完成副本
            if (finishFubenOneline) {
                if ($(".cmd_click_exits_s")[0]) { // 下边
                    clickButton('go south');
                    finishFubenOneline = false;
                    finishFubenLeft = false;
                    finishFubenRight = false;
                } else {
                    if ($(".cmd_click_exits_w")[0] && $(".cmd_click_exits_e")[0] && !$(".cmd_click_exits_s")[0]) { // 有左右无下时
                        clickButton('go west');
                    } else if ($(".cmd_click_exits_w")[0] && !$(".cmd_click_exits_e")[0]) { // 单左
                        clickButton('go west');
                    } else if (!$(".cmd_click_exits_w")[0] && $(".cmd_click_exits_e")[0]) { // 有左右时
                        clickButton('go east');
                    }
                }
            } else {
                // 没完成左边
                if (!finishFubenLeft) {
                    if ($(".cmd_click_exits_w")[0] && $(".cmd_click_exits_e")[0]) { // 有左右时
                        clickButton('go west');
                    }
                    if (!$(".cmd_click_exits_w")[0] && $(".cmd_click_exits_e")[0]) { // 有左右时
                        clickButton('go east');
                        finishFubenLeft = true;
                    }
                    //完成左边
                } else {
                    //没完成右边
                    if (!finishFubenRight) {
                        if ($(".cmd_click_exits_w")[0] && $(".cmd_click_exits_e")[0]) { // 有左右时
                            clickButton('go east');
                        }
                        if ($(".cmd_click_exits_w")[0] && !$(".cmd_click_exits_e")[0]) { // 有左右时
                            clickButton('go west');
                            finishFubenRight = true;
                        }
                        //完成右边
                    } else {
                        if ($(".cmd_click_exits_w")[0] && $(".cmd_click_exits_e")[0]) { // 有左右时
                            clickButton('go west');
                            finishFubenOneline = true;
                        }
                    }
                }
            }
        }
        if (fubenWalkTimeer) {
            setTimeout(function () {
                // goInFuben()
            }, 1000);
        };
    }
    function checkInFubenOne() {
        var npcArr = ["食虫虻", "镇谷神兽", "守谷神兽", "饕餮幼崽", "饕餮分身", "饕餮兽魂", "饕餮战神", "镇潭神兽", "守潭神兽", "螣蛇幼崽", "螣蛇分身", "螣蛇兽魂", "螣蛇战神", "镇山神兽", "守山神兽", "应龙幼崽", "应龙兽魂", "应龙分身", "应龙战神", "镇殿神兽", "守殿神兽", "幽荧幼崽", "幽荧兽魂", "幽荧分身", "幽荧战神"];
        var npcBtn = $('.cmd_click3');
        var hasName = false;
        for (var i = 0; i < npcArr.length; i++) {
            var hasTarget = hasTargetName(npcArr[i]);
            if (hasTarget) { hasName = true }
        };
        return hasName
    }
    function hasTargetNameIndex(name) {
        var hasName = false;
        var peopleList = $(".cmd_click3");
        peopleList.each(function () {
            var peopleName = $(this).text();
            if (peopleName.indexOf(name) >= 0) {
                hasName = true;
            }
        });
        return hasName
    }
    /* 杀天剑  :end */
    /* 喂鳄鱼+侠客岛  :start */
    function newGetXiaKe() {
        goXiaKe();
    };
    async function goXiaKe() {
        go('home');
        go('jh 36');
        go('yell');
        setTimeout(function () {
            goRead();
        }, 25000);
    };
    async function goRead() {
        go('go east');
        go('go northeast');
        go('go northeast');
        go('go northeast');
        go('go east');
        go('go east');
        go('go east');
        // clickButton('event_1_9179222');     // 进入侧厅
        setTimeout(function () {
            clickBtn('进入侧厅');
            readBoard();
        }, 3000);
    };
    async function readBoard() {
        go('go east');
        // clickButton('event_1_11720543');    // 观阅
        setTimeout(function () {
            clickBtn('观阅');
            goJump();
        }, 3000);
    };
    async function goJump() {
        go('go west');
        go('go north');
        go('go east');
        go('go east');
        go('go south');
        go('go east');
        // clickButton('event_1_44025101');    // 跳下去
        setTimeout(function () {
            clickBtn('跳下去');
            setTimeout(function () {
                isCorrectJump();
            }, 2000);
        }, 3000);
    };
    async function startJump() {
        clickBtn('跳下去');
        setTimeout(function () {
            isCorrectJump();
        }, 2000);
    };
    async function goBackXiaKe() {
        go('go northwest');
        go('go west');
        go('go southwest');
        go('go west');
        go('go north');
        go('go north');
        go('go north');
        go('go west');
        go('go west');
        go('go south');
        go('go west');
        go('go northwest');
        go('go west');
        go('go east');
        go('go northeast');
        go('go northeast');
        go('go northeast');
        go('go east');
        go('go east');
        go('go east');
        go('go east');
        go('go east');
        go('go south');
        go('go east');
        setTimeout(function () {
            clickBtn('跳下去');
            setTimeout(function () {
                isCorrectJump();
            }, 2000);
        }, 10000);

    };
    async function isCorrectJump() {
        var clickName = getClickName('进入甬道');
        if (clickName) {
            clickBtn('进入甬道');
            setTimeout(function () {
                clickButtonAsync('go east');
                clickButtonAsync('go east');
                clickButtonAsync('go south');
                setTimeout(function () {
                    clickBtn('领悟');
                }, 2000);
            }, 2000);
        } else {
            setTimeout(function () {
                clickBtn('游出去');
            }, 2000);
            setTimeout(function () {
                goBackXiaKe();
            }, 4000);
        }
    };
    function clickBtn(name) {
        var btn = $('.cmd_click3');
        btn.each(function () {
            var _name = $(this).text();
            if (_name == name) {
                $(this).trigger('click');
            }
        })
    }
    function getClickName(name) {
        var nameSwitch = false;
        var btn = $('.cmd_click3');
        btn.each(function () {
            var _name = $(this).text();
            if (_name == name) {
                nameSwitch = true;
            }
        });
        return nameSwitch;
    }
    /* 喂鳄鱼+侠客岛  :end */
    /* 试剑  :start */
    var zdskill111 = Base.mySkillLists;
    var killDrunkIntervalFunc1 = null;
    function CheckIn1(e) {
        go('home');
        window.Dom = $(e.target);
        if (Dom.html() == "试剑") {
            console.log(getTimes() + '开始试剑');
            Dom.html("停止");
            go('swords report go');
            go('swords');
            go('swords select_member heimuya_dfbb');   // 东方
            go('swords select_member qingcheng_mudaoren');   //木道人
            go('swords select_member tangmen_madam');  //欧阳敏
            go('swords fight_test go');
            killDrunkIntervalFunc1 = setInterval(killDrunMan1, 2000);//code
        }
        else {
            console.log(getTimes() + '停止试剑');
            Dom.html("试剑");
            clearInterval(killDrunkIntervalFunc1)
        }
    }
    function isContains1(str, substr) {
        if (!str) {
            return -1;
        }
        return str.indexOf(substr) >= 0;
    }
    function killDrunMan1() {
        var doneShijian = $('span:contains(你今天试剑次数已达限额)');
        if (doneShijian.length > 0) {
            Dom.html("试剑");
            clearInterval(killDrunkIntervalFunc1);
            return;
        } else {
            clickButton('swords fight_test go');
            doKillSet();
        }
    }
    /* 试剑  :end */
    /* 答题  :start */
    var answerQuestionsInterval = null;
    var QuestAnsLibs = {
        "首次通过乔阴县不可以获得那种奖励？": "a",
        "“白玉牌楼”场景是在哪个地图上？": "c",
        "“百龙山庄”场景是在哪个地图上？": "b",
        "“冰火岛”场景是在哪个地图上？": "b",
        "“常春岛渡口”场景是在哪个地图上？": "c",
        "“跪拜坪”场景是在哪个地图上？": "b",
        "“翰墨书屋”场景是在哪个地图上？": "c",
        "“花海”场景是在哪个地图上？": "a",
        "“留云馆”场景是在哪个地图上？": "b",
        "“日月洞”场景是在哪个地图上？": "b",
        "“蓉香榭”场景是在哪个地图上？": "c",
        "“三清殿”场景是在哪个地图上？": "b",
        "“三清宫”场景是在哪个地图上？": "c",
        "“双鹤桥”场景是在哪个地图上？": "b",
        "“无名山脚”场景是在哪个地图上？": "d",
        "“伊犁”场景是在哪个地图上？": "b",
        "“鹰记商号”场景是在哪个地图上？": "d",
        "“迎梅客栈”场景是在哪个地图上？": "d",
        "“子午楼”场景是在哪个地图上？": "c",
        "8级的装备摹刻需要几把刻刀": "a",
        "NPC公平子在哪一章地图": "a",
        "瑷伦在晚月庄的哪个场景": "b",
        "安惜迩是在那个场景": "c",
        "黯然销魂掌有多少招式？": "c",
        "黯然销魂掌是哪个门派的技能": "a",
        "八卦迷阵是哪个门派的阵法？": "b",
        "八卦迷阵是那个门派的阵法": "a",
        "白金戒指可以在哪位那里获得？": "b",
        "白金手镯可以在哪位那里获得？": "a",
        "白金项链可以在哪位那里获得？": "b",
        "白蟒鞭的伤害是多少？": "a",
        "白驼山第一位要拜的师傅是谁": "a",
        "白银宝箱礼包多少元宝一个": "d",
        "白玉腰束是腰带类的第几级装备？": "b",
        "拜师风老前辈需要正气多少": "b",
        "拜师老毒物需要蛤蟆功多少级": "a",
        "拜师铁翼需要多少内力": "b",
        "拜师小龙女需要容貌多少": "c",
        "拜师张三丰需要多少正气": "b",
        "包家将是哪个门派的师傅": "a",
        "包拯在哪一章": "d",
        "宝石合成一次需要消耗多少颗低级宝石？": "c",
        "宝玉帽可以在哪位那里获得？": "d",
        "宝玉鞋击杀哪个可以获得": "a",
        "宝玉鞋在哪获得": "a",
        "暴雨梨花针的伤害是多少？": "c",
        "北斗七星阵是第几个的组队副本": "c",
        "北冥神功是哪个门派的技能": "b",
        "北岳殿神像后面是哪位": "b",
        "匕首加什么属性": "c",
        "碧海潮生剑在哪位师傅处学习": "a",
        "碧磷鞭的伤害是多少？": "b",
        "镖局保镖是挂机里的第几个任务": "d",
        "冰魄银针的伤害是多少？": "b",
        "病维摩拳是哪个门派的技能": "b",
        "不可保存装备下线多久会消失": "c",
        "不属于白驼山的技能是什么": "b",
        "沧海护腰可以镶嵌几颗宝石": "d",
        "沧海护腰是腰带类的第几级装备？": "a",
        "藏宝图在哪个NPC处购买": "a",
        "藏宝图在哪个处购买": "b",
        "藏宝图在哪里那里买": "a",
        "草帽可以在哪位那里获得？": "b",
        "成功易容成异性几次可以领取易容成就奖": "b",
        "成长计划第七天可以领取多少元宝？": "d",
        "成长计划六天可以领取多少银两？": "d",
        "成长计划需要多少元宝方可购买？": "a",
        "城里打擂是挂机里的第几个任务": "d",
        "城里抓贼是挂机里的第几个任务": "b",
        "充值积分不可以兑换下面什么物品": "d",
        "出生选武学世家增加什么": "a",
        "闯楼第几层可以获得称号“藏剑楼护法”": "b",
        "闯楼第几层可以获得称号“藏剑楼楼主”": "d",
        "闯楼第几层可以获得称号“藏剑楼长老”": "c",
        "闯楼每多少层有称号奖励": "a",
        "春风快意刀是哪个门派的技能": "b",
        "春秋水色斋需要多少杀气才能进入": "d",
        "从哪个处进入跨服战场": "a",
        "摧心掌是哪个门派的技能": "a",
        "达摩在少林哪个场景": "c",
        "达摩杖的伤害是多少？": "d",
        "打开引路蜂礼包可以得到多少引路蜂？": "b",
        "打排行榜每天可以完成多少次？": "a",
        "打土匪是挂机里的第几个任务": "c",
        "打造刻刀需要多少个玄铁": "a",
        "打坐增长什么属性": "a",
        "大保险卡可以承受多少次死亡后不降技能等级？": "b",
        "大乘佛法有什么效果": "d",
        "大旗门的修养术有哪个特殊效果": "a",
        "大旗门的云海心法可以提升哪个属性": "c",
        "大招寺的金刚不坏功有哪个特殊效果": "a",
        "大招寺的铁布衫有哪个特殊效果": "c",
        "当日最低累积充值多少元即可获得返利？": "b",
        "刀法基础在哪掉落": "a",
        "倒乱七星步法是哪个门派的技能": "d",
        "等级多少才能在世界频道聊天？": "c",
        "第一个副本需要多少等级才能进入": "d",
        "貂皮斗篷是披风类的第几级装备？": "b",
        "丁老怪是哪个门派的终极师傅": "a",
        "丁老怪在星宿海的哪个场景": "b",
        "东方教主在魔教的哪个场景": "b",
        "斗转星移是哪个门派的技能": "a",
        "斗转星移阵是哪个门派的阵法": "a",
        "毒龙鞭的伤害是多少？": "a",
        "毒物阵法是哪个门派的阵法": "b",
        "独孤求败有过几把剑？": "d",
        "独龙寨是第几个组队副本": "a",
        "读书写字301-400级在哪里买书": "c",
        "读书写字最高可以到多少级": "b",
        "端茶递水是挂机里的第几个任务": "b",
        "断云斧是哪个门派的技能": "a",
        "锻造一把刻刀需要多少玄铁碎片锻造？": "c",
        "锻造一把刻刀需要多少银两？": "a",
        "兑换易容面具需要多少玄铁碎片": "c",
        "多少消费积分换取黄金宝箱": "a",
        "多少消费积分可以换取黄金钥匙": "b",
        "翻译梵文一次多少银两": "d",
        "方媃是哪个门派的师傅": "b",
        "飞仙剑阵是哪个门派的阵法": "b",
        "风老前辈在华山哪个场景": "b",
        "风泉之剑加几点悟性": "c",
        "风泉之剑可以在哪位那里获得？": "b",
        "风泉之剑在哪里获得": "d",
        "疯魔杖的伤害是多少？": "b",
        "伏虎杖的伤害是多少？": "c",
        "副本完成后不可获得下列什么物品": "b",
        "副本一次最多可以进几人": "a",
        "副本有什么奖励": "d",
        "富春茶社在哪一章": "c",
        "改名字在哪改？": "d",
        "丐帮的绝学是什么": "a",
        "丐帮的轻功是哪个": "b",
        "干苦力是挂机里的第几个任务": "a",
        "钢丝甲衣可以在哪位那里获得？": "d",
        "高级乾坤再造丹加什么": "b",
        "高级乾坤再造丹是增加什么的？": "b",
        "高级突破丹多少元宝一颗": "d",
        "割鹿刀可以在哪位npc那里获得？": "b",
        "葛伦在大招寺的哪个场景": "b",
        "根骨能提升哪个属性": "c",
        "功德箱捐香火钱有什么用": "a",
        "功德箱在雪亭镇的哪个场景？": "c",
        "购买新手进阶礼包在挂机打坐练习上可以享受多少倍收益？": "b",
        "孤独求败称号需要多少论剑积分兑换": "b",
        "孤儿出身增加什么": "d",
        "古灯大师是哪个门派的终极师傅": "c",
        "古灯大师在大理哪个场景": "c",
        "古墓多少级以后才能进去？": "d",
        "寒玉床睡觉修炼需要多少点内力值": "c",
        "寒玉床睡觉一次多久": "c",
        "寒玉床需要切割多少次": "d",
        "寒玉床在哪里切割": "a",
        "寒玉床在那个地图可以找到？": "a",
        "黑狗血在哪获得": "b",
        "黑水伏蛟可以在哪位npc那里获得？": "c",
        "红宝石加什么属性": "b",
        "洪帮主在洛阳哪个场景": "c",
        "虎皮腰带是腰带类的第几级装备？": "a",
        "花不为在哪一章": "a",
        "铁手镯 可以在哪位npc那里获得？": "a",
        "花花公子在哪个地图": "a",
        "华山村王老二掉落的物品是什么": "a",
        "华山施戴子掉落的物品是什么": "b",
        "华山武器库从哪个NPC进": "d",
        "黄宝石加什么属性": "c",
        "黄岛主在桃花岛的哪个场景": "d",
        "黄袍老道是哪个门派的师傅": "c",
        "积分商城在雪亭镇的哪个场景？": "c",
        "技能柳家拳谁教的？": "a",
        "技能数量超过了什么消耗潜能会增加": "b",
        "嫁衣神功是哪个门派的技能": "b",
        "剑冢在哪个地图": "a",
        "街头卖艺是挂机里的第几个任务": "a",
        "金弹子的伤害是多少？": "a",
        "金刚不坏功有什么效果": "a",
        "金刚杖的伤害是多少？": "a",
        "金戒指可以在哪位npc那里获得？": "d",
        "金手镯可以在哪位npc那里获得？": "b",
        "金丝鞋可以在哪位npc那里获得？": "b",
        "金项链可以在哪位npc那里获得？": "d",
        "金玉断云是哪个门派的阵法": "a",
        "锦缎腰带是腰带类的第几级装备？": "a",
        "精铁棒可以在哪位那里获得？": "d",
        "九区服务器名称": "d",
        "九阳神功是哪个门派的技能": "c",
        "九阴派梅师姐在星宿海哪个场景": "a",
        "军营是第几个组队副本": "b",
        "开通VIP月卡最低需要当天充值多少元方有购买资格？": "a",
        "可以召唤金甲伏兵助战是哪个门派？": "a",
        "客商在哪一章": "b",
        "孔雀氅可以镶嵌几颗宝石": "b",
        "孔雀氅是披风类的第几级装备？": "c",
        "枯荣禅功是哪个门派的技能": "a",
        "跨服是星期几举行的": "b",
        "跨服天剑谷每周六几点开启": "a",
        "跨服需要多少级才能进入": "c",
        "跨服在哪个场景进入": "c",
        "兰花拂穴手是哪个门派的技能": "a",
        "蓝宝石加什么属性": "a",
        "蓝止萍在哪一章": "c",
        "蓝止萍在晚月庄哪个小地图": "b",
        "老毒物在白驮山的哪个场景": "b",
        "老顽童在全真教哪个场景": "b",
        "莲花掌是哪个门派的技能": "a",
        "烈火旗大厅是那个地图的场景": "c",
        "烈日项链可以镶嵌几颗宝石": "c",
        "林祖师是哪个门派的师傅": "a",
        "灵蛇杖法是哪个门派的技能": "c",
        "凌波微步是哪个门派的技能": "b",
        "凌虚锁云步是哪个门派的技能": "b",
        "领取消费积分需要寻找哪个NPC？": "c",
        "鎏金缦罗是披风类的第几级装备？": "d",
        "柳淳风在哪一章": "c",
        "柳淳风在雪亭镇哪个场景": "b",
        "柳文君所在的位置": "a",
        "六脉神剑是哪个门派的绝学": "a",
        "陆得财是哪个门派的师傅": "c",
        "陆得财在乔阴县的哪个场景": "a",
        "论剑每天能打几次": "a",
        "论剑是每周星期几": "c",
        "论剑是什么时间点正式开始": "a",
        "论剑是星期几进行的": "c",
        "论剑是星期几举行的": "c",
        "论剑输一场获得多少论剑积分": "a",
        "论剑要在晚上几点前报名": "b",
        "论剑在周几进行？": "b",
        "论剑中步玄派的师傅是哪个": "a",
        "论剑中大招寺第一个要拜的师傅是谁": "c",
        "论剑中古墓派的终极师傅是谁": "d",
        "论剑中花紫会的师傅是谁": "c",
        "论剑中青城派的第一个师傅是谁": "a",
        "论剑中青城派的终极师傅是谁": "d",
        "论剑中逍遥派的终极师傅是谁": "c",
        "论剑中以下不是峨嵋派技能的是哪个": "b",
        "论剑中以下不是华山派的人物的是哪个": "d",
        "论剑中以下哪个不是大理段家的技能": "c",
        "论剑中以下哪个不是大招寺的技能": "b",
        "论剑中以下哪个不是峨嵋派可以拜师的师傅": "d",
        "论剑中以下哪个不是丐帮的技能": "d",
        "论剑中以下哪个不是丐帮的人物": "a",
        "论剑中以下哪个不是古墓派的的技能": "b",
        "论剑中以下哪个不是华山派的技能的": "d",
        "论剑中以下哪个不是明教的技能": "d",
        "论剑中以下哪个不是魔教的技能": "a",
        "论剑中以下哪个不是魔教的人物": "d",
        "论剑中以下哪个不是全真教的技能": "d",
        "论剑中以下哪个不是是晚月庄的技能": "d",
        "论剑中以下哪个不是唐门的技能": "c",
        "论剑中以下哪个不是唐门的人物": "c",
        "论剑中以下哪个不是铁雪山庄的技能": "d",
        "论剑中以下哪个不是铁血大旗门的技能": "c",
        "论剑中以下哪个是大理段家的技能": "a",
        "论剑中以下哪个是大招寺的技能": "b",
        "论剑中以下哪个是丐帮的技能": "b",
        "论剑中以下哪个是花紫会的技能": "a",
        "论剑中以下哪个是华山派的技能的": "a",
        "论剑中以下哪个是明教的技能": "b",
        "论剑中以下哪个是青城派的技能": "b",
        "论剑中以下哪个是唐门的技能": "b",
        "论剑中以下哪个是天邪派的技能": "b",
        "论剑中以下哪个是天邪派的人物": "a",
        "论剑中以下哪个是铁雪山庄的技能": "c",
        "论剑中以下哪个是铁血大旗门的技能": "b",
        "论剑中以下哪个是铁血大旗门的师傅": "a",
        "论剑中以下哪个是晚月庄的技能": "a",
        "论剑中以下哪个是晚月庄的人物": "a",
        "论剑中以下是峨嵋派技能的是哪个": "a",
        "论语在哪购买": "a",
        "骆云舟在哪一章": "c",
        "骆云舟在乔阴县的哪个场景": "b",
        "落英神剑掌是哪个门派的技能": "b",
        "吕进在哪个地图": "a",
        "绿宝石加什么属性": "c",
        "漫天花雨匕在哪获得": "a",
        "茅山的绝学是什么": "b",
        "茅山的天师正道可以提升哪个属性": "d",
        "茅山可以招几个宝宝": "c",
        "茅山派的轻功是什么": "b",
        "茅山天师正道可以提升什么": "c",
        "茅山学习什么技能招宝宝": "a",
        "茅山在哪里拜师": "c",
        "每次合成宝石需要多少银两？": "a",
        "每个玩家最多能有多少个好友": "b",
        "vip每天不可以领取什么": "b",
        "每天的任务次数几点重置": "d",
        "每天分享游戏到哪里可以获得20元宝": "a",
        "每天能挖几次宝": "d",
        "每天能做多少个谜题任务": "a",
        "每天能做多少个师门任务": "c",
        "每天微信分享能获得多少元宝": "d",
        "每天有几次试剑": "b",
        "每天在线多少个小时即可领取消费积分？": "b",
        "每突破一次技能有效系数加多少": "a",
        "密宗伏魔是哪个门派的阵法": "c",
        "灭绝师太在第几章": "c",
        "灭绝师太在峨眉山哪个场景": "a",
        "明教的九阳神功有哪个特殊效果": "a",
        "明月帽要多少刻刀摩刻？": "a",
        "摹刻10级的装备需要摩刻技巧多少级": "b",
        "摹刻烈日宝链需要多少级摩刻技巧？": "c",
        "摹刻扬文需要多少把刻刀？": "a",
        "魔鞭诀在哪里学习": "d",
        "魔教的大光明心法可以提升哪个属性": "d",
        "莫不收在哪一章": "a",
        "墨磷腰带是腰带类的第几级装备？": "d",
        "木道人在青城山的哪个场景": "b",
        "慕容家主在慕容山庄的哪个场景": "a",
        "慕容山庄的斗转星移可以提升哪个属性": "d",
        "哪个NPC掉落拆招基础": "a",
        "哪个处可以捏脸": "a",
        "哪个分享可以获得20元宝": "b",
        "哪个技能不是魔教的": "d",
        "哪个门派拜师没有性别要求": "d",
        "哪个npc属于全真七子": "b",
        "哪样不能获得玄铁碎片": "c",
        "能增容貌的是下面哪个技能": "a",
        "捏脸需要花费多少银两？": "c",
        "捏脸需要寻找哪个NPC？": "a",
        "欧阳敏是哪个门派的？": "b",
        "欧阳敏是哪个门派的师傅": "b",
        "欧阳敏在哪一章": "a",
        "欧阳敏在唐门的哪个场景": "c",
        "排行榜最多可以显示多少名玩家？": "a",
        "逄义是在那个场景": "a",
        "披星戴月是披风类的第几级装备？": "d",
        "劈雳拳套有几个镶孔": "a",
        "霹雳掌套的伤害是多少": "b",
        "辟邪剑法是哪个门派的绝学技能": "a",
        "辟邪剑法在哪学习": "b",
        "婆萝蜜多心经是哪个门派的技能": "b",
        "七宝天岚舞是哪个门派的技能": "d",
        "七星鞭的伤害是多少？": "c",
        "七星剑法是哪个门派的绝学": "a",
        "棋道是哪个门派的技能": "c",
        "千古奇侠称号需要多少论剑积分兑换": "d",
        "乾坤大挪移属于什么类型的武功": "a",
        "乾坤一阳指是哪个师傅教的": "a",
        "青城派的道德经可以提升哪个属性": "c",
        "青城派的道家心法有哪个特殊效果": "a",
        "清风寨在哪": "b",
        "清风寨在哪个地图": "d",
        "清虚道长在哪一章": "d",
        "去唐门地下通道要找谁拿钥匙": "a",
        "全真的道家心法有哪个特殊效果": "a",
        "全真的基本阵法有哪个特殊效果": "b",
        "全真的双手互搏有哪个特殊效果": "c",
        "日月神教大光明心法可以提升什么": "d",
        "如何将华山剑法从400级提升到440级？": "d",
        "如意刀是哪个门派的技能": "c",
        "山河藏宝图需要在哪个NPC手里购买？": "d",
        "上山打猎是挂机里的第几个任务": "c",
        "少林的混元一气功有哪个特殊效果": "d",
        "少林的易筋经神功有哪个特殊效果": "a",
        "蛇形刁手是哪个门派的技能": "b",
        "什么影响打坐的速度": "c",
        "什么影响攻击力": "d",
        "什么装备不能镶嵌黄水晶": "d",
        "什么装备都能镶嵌的是什么宝石？": "c",
        "什么装备可以镶嵌紫水晶": "c",
        "神雕大侠所在的地图": "b",
        "神雕大侠在哪一章": "a",
        "神雕侠侣的时代背景是哪个朝代？": "d",
        "神雕侠侣的作者是?": "b",
        "升级什么技能可以提升根骨": "a",
        "生死符的伤害是多少？": "a",
        "师门磕头增加什么": "a",
        "师门任务每天可以完成多少次？": "a",
        "师门任务每天可以做多少个？": "c",
        "师门任务什么时候更新？": "b",
        "师门任务一天能完成几次": "d",
        "师门任务最多可以完成多少个？": "d",
        "施令威在哪个地图": "b",
        "石师妹哪个门派的师傅": "c",
        "使用朱果经验潜能将分别增加多少？": "a",
        "首次通过桥阴县不可以获得那种奖励？": "a",
        "受赠的消费积分在哪里领取": "d",
        "兽皮鞋可以在哪位那里获得？": "b",
        "树王坟在第几章节": "c",
        "双儿在扬州的哪个小地图": "a",
        "孙天灭是哪个门派的师傅": "c",
        "踏雪无痕是哪个门派的技能": "b",
        "踏云棍可以在哪位那里获得？": "a",
        "唐门的唐门毒经有哪个特殊效果": "a",
        "唐门密道怎么走": "c",
        "天蚕围腰可以镶嵌几颗宝石": "d",
        "天蚕围腰是腰带类的第几级装备？": "d",
        "天山姥姥在逍遥林的哪个场景": "d",
        "天山折梅手是哪个门派的技能": "c",
        "天师阵法是哪个门派的阵法": "b",
        "天邪派在哪里拜师": "b",
        "天羽奇剑是哪个门派的技能": "a",
        "铁戒指可以在哪位那里获得？": "a",
        "铁血大旗门云海心法可以提升什么": "a",
        "通灵需要花费多少银两？": "d",
        "通灵需要寻找哪个NPC？": "c",
        "突破丹在哪里购买": "b",
        "屠龙刀法是哪个门派的绝学技能": "b",
        "屠龙刀是什么级别的武器": "a",
        "挖剑冢可得什么": "a",
        "弯月刀可以在哪位那里获得？": "b",
        "玩家每天能够做几次正邪任务": "c",
        "玩家想修改名字可以寻找哪个NPC？": "a",
        "晚月庄的内功是什么": "b",
        "晚月庄的七宝天岚舞可以提升哪个属性": "b",
        "晚月庄的小贩在下面哪个地点": "a",
        "晚月庄七宝天岚舞可以提升什么": "b",
        "晚月庄主线过关要求": "a",
        "王铁匠是在那个场景": "b",
        "王重阳是哪个门派的师傅": "b",
        "魏无极处读书可以读到多少级？": "a",
        "魏无极身上掉落什么装备": "c",
        "魏无极在第几章": "a",
        "闻旗使在哪个地图": "a",
        "乌金玄火鞭的伤害是多少？": "d",
        "乌檀木刀可以在哪位npc那里获得？": "d",
        "钨金腰带是腰带类的第几级装备？": "d",
        "武当派的绝学技能是以下哪个": "d",
        "武穆兵法提升到多少级才能出现战斗必刷？": "d",
        "武穆兵法通过什么学习": "a",
        "武学世家加的什么初始属性": "a",
        "舞中之武是哪个门派的阵法": "b",
        "西毒蛇杖的伤害是多少？": "c",
        "吸血蝙蝠在下面哪个地图": "a",
        "下列哪项战斗不能多个玩家一起战斗？": "a",
        "下列装备中不可摹刻的是": "c",
        "下面哪个不是古墓的师傅": "d",
        "下面哪个不是门派绝学": "d",
        "下面哪个不是魔教的": "d",
        "下面哪个地点不是乔阴县的": "d",
        "下面哪个门派是正派": "a",
        "下面哪个是天邪派的师傅": "a",
        "下面有什么是寻宝不能获得的": "c",
        "向师傅磕头可以获得什么？": "b",
        "逍遥步是哪个门派的技能": "a",
        "逍遥林是第几章的地图": "c",
        "逍遥林怎么弹琴可以见到天山姥姥": "b",
        "逍遥派的绝学技能是以下哪个": "a",
        "萧辟尘在哪一章": "d",
        "小李飞刀的伤害是多少？": "d",
        "小龙女住的古墓是谁建造的？": "b",
        "小男孩在华山村哪里": "a",
        "新人礼包在哪个npc处兑换": "a",
        "新手礼包在哪里领取": "a",
        "新手礼包在哪领取？": "c",
        "需要使用什么衣服才能睡寒玉床": "a",
        "选择孤儿会影响哪个属性": "c",
        "选择商贾会影响哪个属性": "b",
        "选择书香门第会影响哪个属性": "b",
        "选择武学世家会影响哪个属性": "a",
        "学习屠龙刀法需要多少内力": "b",
        "雪莲有什么作用": "a",
        "雪蕊儿是哪个门派的师傅": "a",
        "雪蕊儿在铁雪山庄的哪个场景": "d",
        "扬文的属性": "a",
        "扬州询问黑狗能到下面哪个地点": "a",
        "扬州在下面哪个地点的处可以获得玉佩": "c",
        "羊毛斗篷是披风类的第几级装备？": "a",
        "阳刚之劲是哪个门派的阵法": "c",
        "杨过小龙女分开多少年后重逢?": "c",
        "杨过在哪个地图": "a",
        "夜行披风是披风类的第几级装备？": "a",
        "夜皇在大旗门哪个场景": "c",
        "一个队伍最多有几个队员": "c",
        "一天能完成谜题任务多少个": "b",
        "一天能完成师门任务有多少个": "c",
        "一天能完成挑战排行榜任务多少次": "a",
        "一张分身卡的有效时间是多久": "c",
        "一指弹在哪里领悟": "b",
        "移开明教石板需要哪项技能到一定级别": "a",
        "以下不是步玄派的技能的哪个": "c",
        "以下不是天宿派师傅的是哪个": "c",
        "以下不是隐藏门派的是哪个": "d",
        "以下哪个宝石不能镶嵌到戒指": "c",
        "以下哪个宝石不能镶嵌到内甲": "a",
        "以下哪个宝石不能镶嵌到披风": "c",
        "以下哪个宝石不能镶嵌到腰带": "c",
        "以下哪个宝石不能镶嵌到衣服": "a",
        "以下哪个不是道尘禅师教导的武学？": "d",
        "以下哪个不是何不净教导的武学？": "c",
        "以下哪个不是慧名尊者教导的技能？": "d",
        "以下哪个不是空空儿教导的武学？": "b",
        "以下哪个不是梁师兄教导的武学？": "b",
        "以下哪个不是论剑的皮肤？": "d",
        "以下哪个不是全真七子？": "c",
        "以下哪个不是宋首侠教导的武学？": "d",
        "以下哪个不是微信分享好友、朋友圈、QQ空间的奖励？": "a",
        "以下哪个不是岳掌门教导的武学？": "a",
        "以下哪个不是在洛阳场景": "d",
        "以下哪个不是在雪亭镇场景": "d",
        "以下哪个不是在扬州场景": "d",
        "以下哪个不是知客道长教导的武学？": "b",
        "以下哪个门派不是隐藏门派？": "c",
        "以下哪个门派是正派？": "d",
        "以下哪个门派是中立门派？": "a",
        "以下哪个是步玄派的祖师": "b",
        "以下哪个是封山派的祖师": "c",
        "以下哪个是花紫会的祖师": "a",
        "以下哪个是晚月庄的祖师": "d",
        "以下哪些物品不是成长计划第二天可以领取的？": "c",
        "以下哪些物品不是成长计划第三天可以领取的？": "d",
        "以下哪些物品不是成长计划第一天可以领取的？": "d",
        "以下哪些物品是成长计划第四天可以领取的？": "a",
        "以下哪些物品是成长计划第五天可以领取的？": "b",
        "以下属于邪派的门派是哪个": "b",
        "以下属于正派的门派是哪个": "a",
        "以下谁不精通降龙十八掌？": "d",
        "以下有哪些物品不是每日充值的奖励？": "d",
        "倚天剑加多少伤害": "d",
        "倚天屠龙记的时代背景哪个朝代？": "a",
        "易容后保持时间是多久": "a",
        "易容面具需要多少玄铁兑换": "c",
        "易容术多少级才可以易容成异性NPC": "a",
        "易容术可以找哪位NPC学习？": "b",
        "易容术向谁学习": "a",
        "易容术在哪里学习": "a",
        "易容术在哪学习？": "b",
        "银手镯可以在哪位那里获得？": "b",
        "银丝链甲衣可以在哪位npc那里获得？": "a",
        "银项链可以在哪位那里获得？": "b",
        "尹志平是哪个门派的师傅": "b",
        "隐者之术是那个门派的阵法": "a",
        "鹰爪擒拿手是哪个门派的技能": "a",
        "影响你出生的福缘的出生是？": "d",
        "油流麻香手是哪个门派的技能": "a",
        "游龙散花是哪个门派的阵法": "d",
        "玉蜂浆在哪个地图获得": "a",
        "玉女剑法是哪个门派的技能": "b",
        "岳掌门在哪一章": "a",
        "云九天是哪个门派的师傅": "c",
        "云问天在哪一章": "a",
        "在洛阳萧问天那可以学习什么心法": "b",
        "在庙祝处洗杀气每次可以消除多少点": "a",
        "在哪个NPC可以购买恢复内力的药品？": "c",
        "在哪个处可以更改名字": "a",
        "在哪个处领取免费消费积分": "d",
        "在哪个处能够升级易容术": "b",
        "在哪里可以找到“香茶”？": "a",
        "在哪里捏脸提升容貌": "d",
        "在哪里消杀气": "a",
        "在逍遥派能学到的技能是哪个": "a",
        "在雪亭镇李火狮可以学习多少级柳家拳": "b",
        "在战斗界面点击哪个按钮可以进入聊天界面": "d",
        "在正邪任务中不能获得下面什么奖励？": "d",
        "怎么样获得免费元宝": "a",
        "赠送李铁嘴银两能够增加什么": "a",
        "张教主在明教哪个场景": "d",
        "张三丰在哪一章": "d",
        "张三丰在武当山哪个场景": "d",
        "张松溪在哪个地图": "c",
        "张天师是哪个门派的师傅": "a",
        "张天师在茅山哪个场景": "d",
        "长虹剑在哪位那里获得？": "a",
        "长剑在哪里可以购买？": "a",
        "正邪任务杀死好人增长什么": "b",
        "正邪任务一天能做几次": "a",
        "正邪任务中客商的在哪个地图": "a",
        "正邪任务中卖花姑娘在哪个地图": "b",
        "正邪任务最多可以完成多少个？": "d",
        "支线对话书生上魁星阁二楼杀死哪个NPC给10元宝": "a",
        "朱姑娘是哪个门派的师傅": "a",
        "朱老伯在华山村哪个小地图": "b",
        "追风棍可以在哪位npc那里获得？": "a",
        "追风棍在哪里获得": "b",
        "紫宝石加什么属性": "d",
        "下面哪个npc不是魔教的": "d",
        "藏宝图在哪里npc那里买": "a",
        "从哪个npc处进入跨服战场": "a",
        "钻石项链在哪获得": "a",
        "在哪个npc处能够升级易容术": "b",
        "扬州询问黑狗子能到下面哪个地点": "a",
        "北岳殿神像后面是哪位npc": "b",
        "兽皮鞋可以在哪位npc那里获得？": "b",
        "在哪个npc处领取免费消费积分": "d",
        "踏云棍可以在哪位npc那里获得？": "a",
        "钢丝甲衣可以在哪位npc那里获得？": "d",
        "哪个npc处可以捏脸": "a",
        "草帽可以在哪位npc那里获得？": "b",
        "铁戒指可以在哪位npc那里获得？": "a",
        "银项链可以在哪位npc那里获得？": "b",
        "在哪个npc处可以更改名字": "a",
        "长剑在哪里可以购买？": "a",
        "宝玉帽可以在哪位npc那里获得？": "d",
        "论剑中以下哪个不是晚月庄的技能": "d",
        "清风寨在哪": "b",
        "精铁棒可以在哪位npc那里获得？": "d",
        "弯月刀可以在哪位npc那里获得？": "b",
        "密宗伏魔是哪个门派的阵法": "c",
        "vip每天不可以领取什么": "b",
        "华山施戴子掉落的物品是什么": "b",
        "钻石项链在哪获得": "a",
        "藏宝图在哪个npc处购买": "b",
        "宝玉鞋击杀哪个npc可以获得": "a",
        "银手镯可以在哪位npc那里获得？": "b",
        "莲花掌是哪个门派的技能": "a",
        "九区服务器名称": "d",
        "以下哪个不是在洛阳场景": "d",
        "红宝石加什么属性": "b",
        "摹刻10级的装备需要摩刻技巧多少级": "b",
        "军营是第几个组队副本": "b",
        "朱姑娘是哪个门派的师傅": "a",
        "金项链可以在哪位npc那里获得？": "d",
        "魏无极在第几章": "a",
        "清风寨在哪": "b",
        "以下哪个不是在洛阳场景": "d",
        "风泉之剑可以在哪位npc那里获得？": "b",
        "魔鞭诀在哪里学习": "d",
        "副本一次最多可以进几人": "a",
        "城里抓贼是挂机里的第几个任务": "b",
        "扬州在下面哪个地点的npc处可以获得玉佩": "c",
        "白金戒指可以在哪位npc那里获得？": "b",
        "长虹剑在哪位npc那里获得？": "a",
        "跨服天剑谷是星期几举行的": "b",
        "白金手镯可以在哪位npc那里获得？": "a",
        "白金项链可以在哪位npc那里获得？": "b"
    };
    function answerQuestionsFunc21(e) {
        clickButton('home');
        window.Dom = $(e.target);
        if (Dom.html() == "答题") {
            answerTrigger = 1;
            console.log("准备自动答题！");
            Dom.html("停答题");
            answerQuestions21();
        } else {
            answerTrigger = 0;
            console.log("停止自动答题！");
            Dom.html("答题");
            clearInterval(answerQuestionsInterval);
        }
    }
    function answerQuestionsFunc(e) {
        clickButton('home');
        window.Dom = $(e.target);
        if (Dom.html() == "答题") {
            console.log("准备自动答题！");
            answerQuestions();
            answerQuestionsInterval = setInterval(answerQuestions, 5000);
            Dom.html("停答题");
        } else {
            console.log("停止自动答题！");
            Dom.html("答题");
            clearInterval(answerQuestionsInterval);
        }
    }
    function answerQuestions() {
        if ($('span:contains(每日武林知识问答次数已经)').text().slice(-46) == "每日武林知识问答次数已经达到限额，请明天再来。每日武林知识问答次数已经达到限额，请明天再来。") {
            // 今天答题结束了
            console.log("完成自动答题！");
            Dom.html("答题");
            clearInterval(answerQuestionsInterval);
            return;
        }
        clickButton('question');
        setTimeout(getAndAnsQuestion, 2000); // 300 ms之后提取问题，查询答案，并回答
    }
    function getAndAnsQuestion() {
        // 提取问题
        var firstSplitArr = $(".out").text().split("题");
        if (firstSplitArr.length < 2) {
            return;
        }
        var theQuestion = firstSplitArr[1].split("A")[0];
        // 左右去掉空格
        // theQuestion = theQuestion.trim(" ","left").trim(" ","right");
        theQuestion = theQuestion.replace(/^\theQuestion*/, "");
        theQuestion = theQuestion.replace(/\theQuestion*$/, "");
        theQuestion = $.trim(theQuestion);
        // theQuestion=theQuestion.slice(1);
        // 查找某个问题，如果问题有包含关系，则
        var theAnswer = getAnswer2Question(theQuestion);
        if (theAnswer !== "failed") {
            eval("clickButton('question " + theAnswer + "')");
        } else {
            // alert("没有找到答案，请手动完成该题目！");
            console.log("停止自动答题！");
            Dom.html("答题");
            clearInterval(answerQuestionsInterval);
            return;
        }
        console.log($('span:contains(知识问答第)').text().split("继续答题")[0]);
        printAnswerInfo(theAnswer);
    }
    function printAnswerInfo(theAnswer) {
        console.log("完成一道武林知识问答：" + "答案是：" + theAnswer);
        console.log($('span:contains(知识问答第)').text().split("继续答题")[0]);
    }
    function getAnswer2Question(localQuestion) {
        // 如果找到答案，返回响应答案，a,b,c或者d
        // 如果没有找到答案，返回 "failed"

        if (localQuestion.indexOf('铁手镯') >= 0) {
            return 'a';
        }
        var resultsFound = [];
        var countor = 0;
        for (var quest in QuestAnsLibs) {
            if (isContains(quest, localQuestion)) { //包含关系就可
                resultsFound[countor] = quest;
                countor = countor + 1;
            } else if (isContains(quest, localQuestion.replace("npc", "")) || isContains(quest, localQuestion.replace("NPC", ""))) {

            }
        }
        if (resultsFound.length >= 1) {
            return QuestAnsLibs[resultsFound[0]];
        }
        else {
            console.log("题目 " + localQuestion + " 找不到答案或存在多个答案，请手动作答！");
            return "failed";
        }
    }
    /* 答题  :end */

    /* 跨服逃犯 */
    var chatJianTing = null;
    var userClickMouse = false;
    var autoGetBackInterval = null;
    var autoGetBackCMDExced = true;
    var autoGetBackCMDInterval = null;
    var allQLHFinishedFlag = false;

    function killKuaFuTaoFanFn(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '逃犯') {
            Jianshi.tf = 1;
            console.log(getTimes() + '开始逃犯');
            Dom.html('取消逃犯');
        } else {
            Jianshi.tf = 0;
            console.log(getTimes() + '结束逃犯');
            Dom.html('逃犯')
        }
    }
    // 一键恢复
    function recoverOnByClick() {
        recoverIntervalFn();
    }

    function recoverOnByClick1() {
        bulan();
    }
    // 定时恢复
    var recoverInterval = null;
    function recoverOnTimes(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();

        if (DomTxt == '定时恢复') {
            recoverInterval = setInterval(recoverIntervalFn, 3 * 60 * 1000);
            console.log(getTimes() + '开始定时恢复');
            Dom.html('取消恢复');
        } else {
            clearInterval(recoverInterval);
            console.log(getTimes() + '结束定时恢复');
            Dom.html('定时恢复')
        }
    }

    function recoverIntervalFn() {
        if ($("#skill_1")[0] == undefined) {
            recoverFn();
        }
    }
    function recoverFn() {
        healFunc();
    }
    function bulan() {
        var p = g_obj_map.get('msg_attrs');
        var max_neili = parseInt(p.get('max_force'));;
        var neili = parseInt(p.get('force'));
        var BulanInterval = setInterval(function () {
            if (neili < max_neili- 5000) {
                go('items use snow_wannianlingzhi');
                neili += 30000;
            }else {
                // go('golook_room');
                clearInterval(BulanInterval);
            }
        }, 120, max_neili, neili);
    }
    function healFunc() {
        var kee = parseInt(g_obj_map.get("msg_attrs").get("kee"));
        var max_kee = parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
        var force = parseInt(g_obj_map.get("msg_attrs").get("force"));
        var max_force = parseInt(g_obj_map.get("msg_attrs").get("max_force"));
        // console.log("血量是: " + kee + "/" + max_kee);
        // console.log("内力是: " + force + "/" + max_force);
        if (g_gmain.is_fighting) {
            return -1;//战斗中
        }
        if (kee < max_kee) {
            if (force > 0) {
                clickButton('recovery', 0);
            } else {
                clickButton('items use snow_wannianlingzhi');
            }
            // console.log("治疗中.....");
            setTimeout(function () { healFunc() }, 200);
        } else {
            if (force < max_force -5000) {
                clickButton('items use snow_wannianlingzhi');
                // console.log("治疗中.....");
                setTimeout(function () { healFunc() }, 200);
            }
        }
    }

    /* 跨服逃犯 end*/
    var userClickMouse = false;
    var autoGetBackInterval = null;
    var autoGetBackCMDExced = true;
    var autoGetBackCMDInterval = null;
    var allQLHFinishedFlag = false;
    var currentPos = null;
    var scanEscaped = null;
    var maikuli_i = null;
    var duancha_i = null;
    var dalie_i = null;
    // 领取奖励 ------------------------------------------------------------------------------------------------------
    //document.body.removeChild(getRewardsButton);

    var isAutoOn = false;
    function doOnAuto(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();

        if (DomTxt == '定时任务') {
            isAutoOn = true;
            Dom.html('取消定时');
        } else {
            isAutoOn = false;
            Dom.html('定时任务');
        }
    }

    var getRewardsInterval = 30 * 60 * 1000; // 30min
    function getRewardsFunc() {
        if (getRewardsButton.innerText == '开领奖') { // 处于未领奖状态，单击开始领奖,并将状态置于停领奖状态
            console.log("开始自动领取奖励！");
            scanEscapedFish();
            scanEscaped = setInterval(scanEscapedFish, getRewardsInterval);
            getRewardsButton.innerText = '停领奖';
        } else {
            console.log("停止自动领取奖励！");
            clearInterval(scanEscaped);
            clearInterval(maikuli_i);
            clearInterval(duancha_i);
            clearInterval(dalie_i);
            clearInterval(autoGetBackInterval);
            getRewardsButton.innerText = '开领奖';
        }
    }
    function maikuli() {
        go('work click maikuli');
    }
    function duancha() {
        go('work click duancha');
    }
    function dalie() {
        go('work click dalie');
    }
    function baobiao() {
        go('work click baobiao');
    }
    function maiyi() {
        go('work click maiyi');
    }
    function xuncheng() {
        go('work click xuncheng');
    }
    function datufei() {
        go('work click datufei');
    }
    function dalei() {
        go('work click dalei');
    }
    function kangjijinbin() {
        go('work click kangjijinbin');
    }
    function zhidaodiying() {
        go('work click zhidaodiying');
    }
    function dantiaoqunmen() {
        go('work click dantiaoqunmen');
    }
    function shenshanxiulian() {
        go('work click shenshanxiulian');
        go('work click jianmenlipai');
        go('work click dubawulin');
        go('work click youlijianghu');
        go('work click yibangmaoxiang');
        go('work click zhengzhanzhongyuan');
    }
    function scanEscapedFish() {
        maikuli();
        duancha();
        dalie();
        baobiao();
        maiyi();
        xuncheng();
        datufei();
        dalei();
        kangjijinbin();
        zhidaodiying();
        dantiaoqunmen();
        shenshanxiulian();
        go('public_op3'); // 向师傅磕头
    }

    /**/
    // 开始挖宝
    //document.body.removeChild(CheckInButton);

    // 吃药 ------------------------------------------------------------------------------------------------------
    function userMedecineFunc() {
        clickButton('items use snow_qiannianlingzhi');
    }

    // 出招 ------------------------------------------------------------------------------------------------------
    function useSkillsFunc() {
        doKillSet();
    }
    // 随机跑
    var randomRunJianIntervalFunc = null;
    function randomRunButtonFunc() {
        if (randomRunButton.innerText == '随机跑') {
            randomRunButton.innerText = '停跑步';
            randomRunJianIntervalFunc = setInterval(function () { RandomRunOnce() }, 400);
        } else {
            console.log("停止自动切图！");
            randomRunButton.innerText = '随机跑';
            clearInterval(randomRunJianIntervalFunc);
        }
    };
    async function RandomRunOnce() {

        var randDirect = { 1: 'west', 2: 'east', 3: 'north', 4: 'south', 5: 'northwest', 6: 'northeast', 7: 'southwest', 8: 'southeast' };
        var direct = Math.floor(Math.random() * 8 + 1);
        var dicListHere = $("button[class*=cmd_click_exits]");
        var findBetterWay = false;
        var cmd = "";
        if ($('#skill_1').length > 0 || $(".cmd_click3").length == 0 || $('.prev').length > 0) {
            return;
        }
        //if(hasTianjian()){

        //}else
        if (Base.tianjianTarget != '' && hasTianjianShiwei()) {

        } else {/*
                for(var i = 0; i < dicListHere.length; i ++){
                    if(isContains(dicListHere[i].innerText,"湖边")){
                        findBetterWay = true;
                        cmd = dicListHere[i].getAttribute('onclick');
                        break;
                    }
                }
                console.log('随机跑一次！');
                if(findBetterWay){
                    eval(cmd);
                    return;
                }else{*/
            var cmd = clickButton('go ' + randDirect[direct]);
            eval(cmd);
            return;
            /*}*/
        }
    };

    function hasTianjianShiwei(name) {
        return hasTargetName('天剑谷卫士');
    }
    function hasTianjian() {
        return hasTargetName('天剑');
    }
    function hasTargetName(name) {
        var hasName = false;
        var peopleList = $(".cmd_click3");
        peopleList.each(function () {
            var peopleName = $(this).text();
            if (peopleName == name) {
                hasName = true;
            }
        });
        return hasName
    }

    /**/
    // 寻目标 ------------------------------------------------------------------------------------------------------
    var searchedLocList = [];
    var continuedSearch = false;
    var chapList = ['雪亭镇', '洛阳', '华山村', '华山', '扬州', '丐帮', '乔阴县', '峨眉山', '恒山', '武当山',
        '晚月庄', '水烟阁', '少林寺', '唐门', '青城山', '逍遥林', '开封', '光明顶', '全真教', '古墓',
        '白驼山', '嵩山', '梅庄', '泰山', '铁血大旗门', '大昭寺', '魔教', '星宿海', '茅山', '桃花岛',
        '铁雪山庄', '慕容山庄', '大理', '断剑山庄', '冰火岛'];
    // var findSpecTagerInfo = "雪亭镇-王铁匠";
    var findSpecTagerInfo = "";
    function findSpecargetFunc() {
        if (!(findSpecTagerInfo = prompt("请输入寻找目标（章节名-目标名）：", findSpecTagerInfo))) {
            findSpecTagerInfo = '';
            return;
        };
        continuedSearch = false;
        if (isContains(findSpecTagerInfo, '-')) {
            // 包含‘-’
            var tempTargetInfo = findSpecTagerInfo.split('-');
            removeByValue(tempTargetInfo, ""); // 删除空字符串
            for (var i = 0; i < tempTargetInfo.length; i++) {
                tempTargetInfo[i] = tempTargetInfo[i].trim(" ", "left").trim(" ", "right"); // 去除空白
            }
            if (tempTargetInfo.length !== 3) {
                searchedLocList = []; // 清空搜索路径
            } else {
                continuedSearch = true;
            }
            var chapName = tempTargetInfo[0];
            var TargetName = tempTargetInfo[1];
            var ChapIndex = getChapIndex(chapName);
            if (ChapIndex > 0) {
                // searchForSpecificTarget(ChapIndex, TargetName);
                goFindNpcInPlace(chapName, TargetName)
            }
        } else {
            // （1） 如果不包含 -，证明只输入目标名，从第一章找起
            writeScreenBtns(findSpecTagerInfo);
        }
    }

    function writeScreenBtns(name) {
        var TargetName = name.trim(" ", "left").trim(" ", "right");
        var wayArr = [];
        for (var j in hairsfalling) {
            for (var k in hairsfalling[j]) {
                if (k.indexOf(TargetName) > -1) {
                    var way = hairsfalling[j][k];
                    wayArr.push({ name: j + '-' + k, way: way });
                }
            }
        }
        addScreenBtn(wayArr);
    }

    function autoFindSpecargetFunc() {
        continuedSearch = false;
        if (isContains(findSpecTagerInfo, '-')) {
            // 包含‘-’
            var tempTargetInfo = findSpecTagerInfo.split('-');
            removeByValue(tempTargetInfo, ""); // 删除空字符串
            for (var i = 0; i < tempTargetInfo.length; i++) {
                tempTargetInfo[i] = tempTargetInfo[i].trim(" ", "left").trim(" ", "right"); // 去除空白
            }
            if (tempTargetInfo.length !== 3) {
                searchedLocList = []; // 清空搜索路径
            } else {
                continuedSearch = true;
            }
            var chapName = tempTargetInfo[0];
            var TargetName = tempTargetInfo[1];
            var ChapIndex = getChapIndex(chapName);
            if (ChapIndex > 0) {
                searchForSpecificTarget(ChapIndex, TargetName);
            }
        } else {
            // （1） 如果不包含 -，证明只输入目标名，从第一章找起
            TargetName = targetInfo.trim(" ", "left").trim(" ", "right");
            var wayArr = [];
            for (var j in hairsfalling) {
                for (var k in hairsfalling[j]) {
                    if (k == TargetName) {
                        var way = hairsfalling[j][k];
                        wayArr.push({ name: k, way: way });
                    }
                }
            }
            addScreenBtn(wayArr);
        }
    }

    function getChapIndex(chap) {
        var findChaps = false;
        for (var i = 0; i < chapList.length; i++) {
            if (chapList[i] == chap) {
                findChaps = true;
                return (i + 1);
            }
        }
        if (!findChaps) {
            // 如果没找到，发出警告
            console.error('## 找不到该目的地：' + chap + '！');
            return -1;
        }

    };

    async function clickButtonMapAsync(s) {
        clickButton(s);
        if (s == "client_map") {
            // 从场景切地图
            while (true) {
                await new Promise(function (resolve) {
                    setTimeout(resolve, 300);
                });
                if ($('.out_line')[0]) {
                    break;
                }
            }
            await new Promise(function (resolve) {
                setTimeout(resolve, 300);
            });
        } else if (s == "prev") {
            //从地图切场景
            while (true) {
                await new Promise(function (resolve) {
                    setTimeout(resolve, 300);
                });
                if (!$('.out_line')[0]) {
                    break;
                }
            }
            await new Promise(function (resolve) {
                setTimeout(resolve, 300);
            });
        } else if (s == "golook_room") {
            //从地图切场景
            while (true) {
                await new Promise(function (resolve) {
                    setTimeout(resolve, 300);
                });
                if (!$('.out_line')[0]) {
                    break;
                }
            }
            await new Promise(function (resolve) {
                setTimeout(resolve, 300);
            });
        }
    };


    async function isCurrentLocSearched(locID) {
        // 判断loc位置，是否已经在列表中
        var descrip = $(".out")[0].textContent.split("这儿有：")[0]; // 获取描述
        var currentLocID = descrip + locID;
        return searchedLocList.includes(currentLocID);
    };

    async function addCurrLoc2List(locID) {
        // 判断loc位置，是否已经在列表中
        var descrip = $(".out")[0].textContent.split("这儿有：")[0]; // 获取描述
        var currentLocID = descrip + locID;
        searchedLocList.push(currentLocID);
        // console.log(currentLocID);
        // console.log(searchedLocList);
    };

    async function searchTheMap(targetName) {
        await clickButtonMapAsync('client_map');

        var currentLocID = $("button[style*='room_in.png']")[0];
        if (currentLocID !== undefined) {
            currentLocID = currentLocID.parentNode.getAttribute('id');   // 获取在大地图中的位置：
        } else {
            currentLocID = "大地图中不存在该位置！";
        }
        await clickButtonMapAsync('prev');

        if (await isCurrentLocSearched(currentLocID)) {
            // console.log("此位置已经搜索过：" + $(".cmd_click_room")[0].innerText);
            return;
        }
        if ($(".cmd_click_room").length > 0) {
            console.log('搜寻位置： ' + $(".cmd_click_room")[0].innerText);
        }
        await addCurrLoc2List(currentLocID);
        // 判断该位置是否发现目标
        if (findObjectHere(targetName)) {
            console.log("发现目标！");
            killQixia(targetName);
            throw new Error('发现目标！', 1);
        }

        // 分别判断8个方向
        if ($(".cmd_click_exits_n")[0]) { // 北边
            await clickButtonAsync('go north');
            await searchTheMap(targetName);
            await clickButtonAsync('go south');
        }
        if ($(".cmd_click_exits_s")[0]) { // 南
            await clickButtonAsync('go south');
            await searchTheMap(targetName);
            await clickButtonAsync('go north');
        }
        if ($(".cmd_click_exits_e")[0]) { // 东边
            await clickButtonAsync('go east');
            await searchTheMap(targetName);
            await clickButtonAsync('go west');
        }
        if ($(".cmd_click_exits_w")[0]) { // 西
            await clickButtonAsync('go west');
            await searchTheMap(targetName);
            await clickButtonAsync('go east');
        }
        if ($(".cmd_click_exits_ne")[0]) { // 东北边
            await clickButtonAsync('go northeast');
            await searchTheMap(targetName);
            await clickButtonAsync('go southwest');
        }

        if ($(".cmd_click_exits_se")[0]) { // 东南
            await clickButtonAsync('go southeast');
            await searchTheMap(targetName);
            await clickButtonAsync('go northwest');
        }

        if ($(".cmd_click_exits_sw")[0]) { // 西南
            await clickButtonAsync('go southwest');
            await searchTheMap(targetName);
            await clickButtonAsync('go northeast');
        }

        if ($(".cmd_click_exits_nw")[0]) { // 西北
            await clickButtonAsync('go northwest');
            await searchTheMap(targetName);
            await clickButtonAsync('go southeast');
        }
    };
    function findObjectHere(local_obj) {
        var NPCList = $(".cmd_click3");  // 先查当前目录下NPC
        for (var i = 0; i < NPCList.length; i++) {
            if (NPCList[i].innerText == "探查此地") {
                eval(NPCList[i].getAttribute('onclick'));
                console.log("探索一次地方！");
            }
            if (NPCList[i].innerText == local_obj || NPCList[i].innerText == (local_obj + "的尸体")) {
                return true;
            }
            if (NPCList[i].innerText.indexOf(local_obj) >= 0) {
                return true;
            }
        }
        var localLocList = $("button[class*='cmd_click_']"); // 再查当前目录下所有地点按钮
        for (var i = 0; i < localLocList.length; i++) {
            if (localLocList[i].innerText == local_obj) {
                // 走到那边，且返回true
                if (localLocList[i].getAttribute('class') !== "cmd_click_room") {
                    eval(localLocList[i].getAttribute('onclick')); // 朝这个方向走去
                }
                return true;
            }
        }
        return false;
    };

    async function searchForSpecificTarget(chapIndex, targetName) {
        try {
            searchName = targetName;
            console.log("开始在第 " + chapIndex + " 章搜寻目标 " + targetName);
            if (!continuedSearch) {
                // 返回主页
                await clickButtonAsync('home');
                while (true) {
                    await new Promise(function (resolve) {
                        setTimeout(resolve, 300);
                    });
                    if ($('.cmd_main_jh')[0])
                        break;
                }
                await new Promise(function (resolve) {
                    setTimeout(resolve, 300);
                });

                await clickButtonAsync('jh ' + chapIndex);
                // 如果在峨眉，或者嵩山，停止搜寻
                if (chapIndex == 6 || chapIndex == 8 || chapIndex == 22) {
                    console.error("在丐帮、峨眉山、嵩山，取消自动搜索！");
                    return;
                }
                while (true) {
                    await new Promise(function (resolve) {
                        setTimeout(resolve, 300);
                    });
                    if (!$('.cmd_main_jh')[0])
                        break;
                }
                await new Promise(function (resolve) {
                    setTimeout(resolve, 300);
                });

            }
            await clickButtonMapAsync('client_map');
            await new Promise(function (resolve) {
                setTimeout(resolve, 300);
            });
            await clickButtonMapAsync('prev');
            await searchTheMap(targetName);
        }
        catch (e) {
            console.log(e);
        }
        console.log("搜索完毕！");
        await clickButtonAsync('home');
    };

    // 找到青龙目标
    function killQixia(name) {
        var btn = $('.cmd_click3');
        idArr = [];
        for (var i = 0; i < btn.length; i++) {
            var txt = btn.eq(i).text();

            if (txt == name) {
                var npcText = btn.eq(i).attr('onclick');
                var id = getId(npcText);
                idArr.push(id);
            }
        }
        console.log(idArr);
        var maxId = idArr[0];

        // console.log(maxId);  //eren580108074

        // followNPC(maxId);

        killE(maxId);
        sendToQQ('杀' + name);
        setTimeout(function () {
            killE(maxId);
        }, 1000);
        // $('#btn5').trigger('click')    // 搜尸
        // setTimeout(function(){
        //     $('#btn4').trigger('click')    // 搜尸
        // },3*60*1000)
    }

    function followNPC(name) {
        clickButton('follow_play ' + name);
    };

    /**/
    async function findQLHPath(targetLocation) {
        switch (targetLocation) {
            case '打铁铺子':
                // 打铁铺子：饮风客栈 --> 广场 -->  雪亭镇街道 --> 雪亭镇街道 --> 打铁铺子                                          # 王铁匠 # 或者 # 坏人 #
                go('jh 1');       // 进入章节
                go('go east');     // 广场
                go('go north');   // 雪亭镇街道
                go('go north');    // 雪亭镇街道
                go('go west');      // 打铁铺子
                break;
            case '桑邻药铺':
                // 桑林药铺：迎风客栈 --> 广场 -->  雪亭镇街道 --> 雪亭镇街道 --> 雪亭镇街道 --> 桑林药铺                           # 杨掌柜 # 或者 # 坏人 #
                go('jh 1');        // 进入章节
                go('go east');      // 广场
                go('go north');     // 雪亭镇街道
                go('go north');    // 雪亭镇街道
                go('go north');     // 雪亭镇街道
                go('go west');    // 桑林药铺
                break;
            case '书房':
                // 书房：迎风客栈 --> 广场 -->  雪亭镇街道 --> 淳风武馆大门 --> 淳风武馆教练场 --> 淳风武馆大厅 -->  天井 --> 书房  # 柳绘心 #  或者 # 坏人 #
                go('jh 1');        // 进入章节
                go('go east');     // 广场
                go('go north');     // 雪亭镇街道
                go('go east');     // 淳风武馆大门
                go('go east');    // 淳风武馆教练场
                go('go east');     // 淳风武馆大厅
                go('go east');    // 天井
                go('go north');    // 书房
                break;
            case '南市':
                // 南市：  龙门石窟 --> 南郊小路 -->  南门 --> 南市 # 客商#  或者 # 坏人#
                go('jh 2');        // 进入章节
                go('go north');     // 南郊小路
                go('go north');     // 南门
                go('go east');     // 南市
                break;
            case '北大街':
                // 北大街： 龙门石窟 --> 南郊小路 -->  南门 --> 南大街 -->  洛川街 --> 中心鼓楼 --> 中州街 --> 北大街              # 卖花姑娘 #  或者 # 坏人 #
                go('jh 2');        // 进入章节
                go('go north');      // 南郊小路
                go('go north');     // 南门
                go('go north');     // 南大街
                go('go north');     // 洛川街
                go('go north');     // 中心鼓楼
                go('go north');     // 中州街
                go('go north');     // 北大街
                break;
            case '钱庄':
                // 钱庄：  龙门石窟 --> 南郊小路 -->  南门 --> 南大街 -->  洛川街 --> 中心鼓楼 --> 中州街 --> 北大街--> 钱庄       # 刘守财 #  或者 # 坏人 #
                go('jh 2');        // 进入章节
                go('go north');      // 南郊小路
                go('go north');     // 南门
                go('go north');     // 南大街
                go('go north');     // 洛川街
                go('go north');     // 中心鼓楼
                go('go north');     // 中州街
                go('go north');     // 北大街
                go('go east');     // 钱庄
                break;
            case '绣楼':
                // 绣楼：  龙门石窟 --> 南郊小路 -->  南门 --> 南大街 -->  洛川街 --> 铜锣巷 --> 桃花别院 --> 绣楼                 # 柳小花 #  或者 # 坏人 #
                go('jh 2');        // 进入章节
                go('go north');      // 南郊小路
                go('go north');     // 南门
                go('go north');     // 南大街
                go('go north');     // 洛川街
                go('go west');    // 铜锣巷
                go('go south');     // 桃花别院
                go('go west');     // 绣楼
                break;
            case '祠堂大门':
                // 祠堂大厅：华山村村口 --> 青石街 -->  银杏广场 --> 祠堂大门            # 朱老伯 #  或者 # 坏人 #
                go('jh 3');        // 进入章节
                go('go south');      // 青石街
                go('go south');     // 银杏广场
                go('go west');    // 祠堂大门
                break;
            case '厅堂':
                // 厅堂：华山村村口 --> 青石街 -->  银杏广场 --> 祠堂大门 -->  厅堂      # 方寡妇 #  或者 # 坏人 #
                go('jh 3');        // 进入章节
                go('go south');      // 青石街
                go('go south');     // 银杏广场
                go('go west');     // 祠堂大门
                go('go north');     // 厅堂
                break;
            case '杂货铺':
                // 杂货铺：华山村村口 --> 青石街 -->  银杏广场 --> 杂货铺                # 方老板 #  或者 # 坏人 #
                go('jh 3');        // 进入章节
                go('go south');      // 青石街
                go('go south');     // 银杏广场
                go('go east');     // 杂货铺
                break;
            case '洛阳寺庙':
                // 杂货铺：华山村村口 --> 青石街 -->  银杏广场 --> 杂货铺                # 方老板 #  或者 # 坏人 #
                go('jh 2');        // 进入章节
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go north');
                go('go west');
                go('go south');
                go('go south');
                go('go south');
                go('go south');
                go('go east');
                break;
            default:
                // 如果没找到，发出警告
                console.log('## 找不到该目的地：' + targetLocation + '！');
        }
    };
    currentPos = 60;
    var delta = 30;
    var chapMapButton = [];
    var dis_right = "30";

    function makePlaceBtns() {
        currentPos = 60;
        delta = 30;
        dis_right = "30";
        for (var i = 0; i < chapList.length; i++) {
            if (i < 17) {
                // dis_right = "180";
                dis_right = "180";
            } else if (i == 17) {
                dis_right = "270";
                // dis_right = "90";
                currentPos = 60;
            }
            chapMapButton[i] = document.createElement('button');
            chapMapButton[i].innerText = chapList[i];
            chapMapButton[i].style.position = 'absolute';
            chapMapButton[i].style.zIndex = '10';
            chapMapButton[i].style.right = dis_right + 'px';
            chapMapButton[i].style.top = currentPos + 'px';
            currentPos = currentPos + delta;
            chapMapButton[i].style.width = Base.buttonWidth;
            chapMapButton[i].style.height = Base.buttonHeight;
            chapMapButton[i].className = 'btn-add btn-others btn-place';
            document.body.appendChild(chapMapButton[i]);
            (function (i) {
                chapMapButton[i].onclick = function () {
                    var cmd = "clickButton('jh " + (i + 1) + "')";
                    eval(cmd);
                }
            })(i);
        }
    }

    var QLHLocList = ['主页', '背包', '技能', '打榜', '监控Q群', '使用令牌', '府邸游侠', '打铁铺子', '桑邻药铺', '书房', '南市', '北大街', '钱庄', '绣楼', '祠堂大门', '厅堂', '杂货铺', '洛阳寺庙'];
    var QLHchapMapButton = [];
    function makeOtherBtns() {
        currentPos = 60;
        delta = 30;
        for (var i = 0; i < QLHLocList.length; i++) {
            // dis_right = "450";
            dis_right = "90";
            QLHchapMapButton[i] = document.createElement('button');
            QLHchapMapButton[i].innerText = QLHLocList[i];
            QLHchapMapButton[i].style.position = 'absolute';
            QLHchapMapButton[i].style.zIndex = '10';
            QLHchapMapButton[i].style.right = dis_right + 'px';
            QLHchapMapButton[i].style.top = currentPos + 'px';
            currentPos = currentPos + delta;
            QLHchapMapButton[i].style.width = Base.buttonWidth;
            QLHchapMapButton[i].style.height = Base.buttonHeight;
            QLHchapMapButton[i].className = 'btn-add btn-others btn-ql-place';
            if (QLHLocList[i] == "监控Q群") {
                QLHchapMapButton[i].id = 'btn-watchQQ';
            }
            if (QLHLocList[i] == "打榜") {
                QLHchapMapButton[i].id = 'btn-hitBang';
            }

            document.body.appendChild(QLHchapMapButton[i]);
            if (QLHLocList[i] == "府邸游侠") {
                currentPos = currentPos + 30;
            }

            (function (i) {
                QLHchapMapButton[i].onclick = function () {
                    if (QLHLocList[i] == "主页") {
                        clickButton('quit_chat');
                        clickButton('home');
                    } else if (QLHLocList[i] == "使用令牌") {
                        // clickButton('quit_chat');
                        // clickButton('score');

                        doLingPai();
                        doUseLingPai();
                    } else if (QLHLocList[i] == "府邸游侠") {
                        // clickButton('fudi');
                        clickButton('fudi juxian');
                        setTimeout(() => {
                            upFuDi();
                        }, 2000);
                    } else if (QLHLocList[i] == "背包") {
                        clickButton('quit_chat');
                        clickButton('items');
                    } else if (QLHLocList[i] == "技能") {
                        clickButton('quit_chat');
                        clickButton('skills');
                    } else if (QLHLocList[i] == "监控Q群") {
                        jianKong(this);
                    } else if (QLHLocList[i] == "打榜") {
                        // lunJian(this);
                        PaiHangFunc(this);
                    } else {
                        findQLHPath(QLHLocList[i]);
                    }
                }
            })(i);
        }
    }
    var startAutoOnTimeButton = null;
    var getRewardsButton = null;
    var digTreasureButton = null;
    var userMedecineButton = null;
    var useSkillsButton = null;
    var randomRunButton = null;
    var findSpecTargetButton = null;
    function makeMoreBtns() {

        startAutoOnTimeButton = document.createElement('button');
        startAutoOnTimeButton.innerText = '定时任务';
        startAutoOnTimeButton.style.position = 'absolute';
        startAutoOnTimeButton.style.zIndex = '10';
        startAutoOnTimeButton.style.right = '0px';
        startAutoOnTimeButton.style.top = '30px';
        currentPos = Base.currentPos + Base.delta;
        startAutoOnTimeButton.style.width = Base.buttonWidth;
        startAutoOnTimeButton.style.height = Base.buttonHeight;
        startAutoOnTimeButton.className = 'btn-add';
        startAutoOnTimeButton.id = 'btnOnTime';
        document.body.appendChild(startAutoOnTimeButton);
        startAutoOnTimeButton.addEventListener('click', doOnAuto);

        // getRewardsButton = document.createElement('button');
        // getRewardsButton.innerText = '开领奖';
        // getRewardsButton.style.position = 'absolute';
        // getRewardsButton.style.right = '270px';
        // getRewardsButton.style.top = '240px';
        // currentPos = Base.currentPos + Base.delta;
        // getRewardsButton.style.width = Base.buttonWidth;
        // getRewardsButton.style.height = Base.buttonHeight;
        // getRewardsButton.className = 'btn-add';
        // document.body.appendChild(getRewardsButton);
        // getRewardsButton.addEventListener('click', getRewardsFunc);

        // userMedecineButton = document.createElement('button');
        // userMedecineButton.innerText = '吃补药';
        // userMedecineButton.style.position = 'absolute';
        // userMedecineButton.style.right = '270px';
        // userMedecineButton.style.top = '30px';
        // currentPos = Base.delta;
        // userMedecineButton.style.width = Base.buttonWidth;
        // userMedecineButton.style.height = Base.buttonHeight;
        // userMedecineButton.id = 'btnS';
        // userMedecineButton.className = 'btn-add btn-others';
        // document.body.appendChild(userMedecineButton);
        // userMedecineButton.addEventListener('click', userMedecineFunc);

        // useSkillsButton = document.createElement('button');
        // useSkillsButton.innerText = '出招';
        // useSkillsButton.style.position = 'absolute';
        // useSkillsButton.style.zIndex = '10';
        // useSkillsButton.style.right = '180px';
        // useSkillsButton.style.bottom = '2px';
        // currentPos = Base.delta;
        // useSkillsButton.style.width = Base.buttonWidth;
        // useSkillsButton.style.height = '30px';
        // useSkillsButton.className = 'btn-add';
        // useSkillsButton.id = 'btn-chuzhao';
        // document.body.appendChild(useSkillsButton);
        // useSkillsButton.addEventListener('click', useSkillsFunc);

        // randomRunButton = document.createElement('button');
        // randomRunButton.innerText = '随机跑';
        // randomRunButton.style.position = 'absolute';
        // randomRunButton.style.right = '450px';
        // randomRunButton.style.top = '600px';
        // currentPos = Base.delta;
        // randomRunButton.style.width = Base.buttonWidth;
        // randomRunButton.style.height = Base.buttonHeight;
        // randomRunButton.className = 'btn-add btn-others btn-place';
        // document.body.appendChild(randomRunButton);
        // randomRunButton.addEventListener('click', randomRunButtonFunc);

        findSpecTargetButton = document.createElement('button');
        // findSpecTargetButton.innerText = '寻目标';
        findSpecTargetButton.innerText = '挖矿';
        findSpecTargetButton.style.position = 'absolute';
        findSpecTargetButton.style.zIndex = '10';
        findSpecTargetButton.style.right = '180px';
        findSpecTargetButton.style.top = '30px';
        findSpecTargetButton.style.width = Base.buttonWidth;
        findSpecTargetButton.style.height = Base.buttonHeight;
        findSpecTargetButton.className = 'btn-add btn-others btn-wakuang';
        document.body.appendChild(findSpecTargetButton);
        // findSpecTargetButton.addEventListener('click', findSpecargetFunc);
        findSpecTargetButton.addEventListener('click', waKuang);

        digTreasureButton = document.createElement('button');
        digTreasureButton.innerText = '寻路';
        digTreasureButton.style.position = 'absolute';
        digTreasureButton.style.zIndex = '10';
        digTreasureButton.style.right = '90px';
        digTreasureButton.style.top = '30px';
        currentPos = Base.delta;
        digTreasureButton.style.width = Base.buttonWidth;
        digTreasureButton.style.height = Base.buttonHeight;
        digTreasureButton.className = 'btn-add btn-others btn-searchWay';
        document.body.appendChild(digTreasureButton);
        //挖宝藏 digTreasureButton.addEventListener('click', WabaoFunc);
        digTreasureButton.addEventListener('click', findSpecargetFunc);

        bixueTishi = document.createElement('span');
        bixueTishi.style.position = 'absolute';
        bixueTishi.style.left = '2px';
        bixueTishi.innerText = '';
        bixueTishi.style.color = 'red';
        bixueTishi.style.fontSize = '13px';
        bixueTishi.style.top = '53px';
        bixueTishi.className = 'bixueText';
        document.body.appendChild(bixueTishi);

        jichuTishi = document.createElement('span');
        jichuTishi.style.position = 'absolute';
        jichuTishi.style.left = '200px';
        jichuTishi.innerText = '';
        jichuTishi.style.color = 'red';
        jichuTishi.style.fontSize = '13px';
        jichuTishi.style.top = '53px';
        jichuTishi.className = 'jichuText';
        document.body.appendChild(jichuTishi);

        bixueTishi = document.createElement('span');
        bixueTishi.style.position = 'absolute';
        bixueTishi.style.left = '42px';
        bixueTishi.innerText = '';
        bixueTishi.style.color = 'red';
        bixueTishi.style.fontSize = '13px';
        bixueTishi.style.top = '0px';
        bixueTishi.className = 'hitMax';
        document.body.appendChild(bixueTishi);
    }

    // 监控Q群
    function jianKong(obj) {
        // console.log(obj);
        var Dom = $(obj);
        var text = Dom.html();
        if (text == '监控Q群') {
            Dom.html('停止监控');
            webSocketConnet();
        } else {
            Dom.html('监控Q群');
            webSocketClose();
        }

    }
    // 论剑
    var lunjianInterval = null;
    function lunJian(obj) {
        var Dom = $(obj);
        var text = Dom.html();
        if (text == '论剑') {
            Dom.html('停止论剑');
            lunjianInterval = setInterval(function () {
                doLunjianSkills();
            }, 600);
        } else {
            Dom.html('论剑');
            clearInterval(lunjianInterval);
        }
    }
    var lunjianUseDog = false;
    // 论剑释放技能
    function doLunjianSkills() {

        if ($('#skill_1').length == 0) {
            lunjianUseDog = true;
            return;
        }
        // var qiNumber = $('#combat_xdz_text').text().split('/')[0];
        var qiNumber = gSocketMsg.get_xdz();
        if (qiNumber < 3) {
            return;
        }

        var skillArr = Base.mySkillLists.split('；');
        if (hasDog().length > 0 && lunjianUseDog) {
            lunjianUseDog = false;
        }

        if (lunjianUseDog) {
            skillArr = ['茅山道术', '天师灭神剑'];
            var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];
            var clickSkillSwitch = false;
            $.each(skillIdA, function (index, val) {
                var btn = $('#skill_' + val);
                var btnName = btn.text();
                for (var i = 0; i < skillArr.length; i++) {
                    var skillName = skillArr[i];
                    if (btnName == skillName) {
                        btn.find('button').trigger('click');
                        clickSkillSwitch = true;
                        break;
                    }
                }
            });
        } else {
            var targetName = '九四浪,花飞,东方末明,七武器拳头,魔泣神君,罗将神,爱尔奎特,邱鸣,慕云乐,皮宪泰,邵为浩,稀饭无心,轮回之境,何为江湖';
            var qiText = gSocketMsg.get_xdz();
            if (qiText > 3) {
                doFightAll1(targetName);
            }
        }
        if (qiNumber > 9) {
            doFightAll();
        }
    }

    function showCode() {
        Jianshi.showcode = Jianshi.showcode ? 0 : 1;
        var txt = Jianshi.showcode ? '开始' : '关闭';
        g_gmain.notify_fail(HIG + txt + "输出按键代码" + NOR);
    }

    // 跟招
    var genZhaoMode = 0;
    function followPozhaoFn(e) {
        var Dom = $(e.target);
        var text = Dom.html();
        if (text == '跟招') {
            Dom.html('停止跟招');
            genZhaoMode = 1;
        } else {
            genZhaoMode = 0;
            Dom.html('跟招');
        }
    }
    // 获取对战方的名字
    function getVsName() {
        var c = g_obj_map.get("msg_vs_info"),
            a = gSocketMsg.get_vs_type(),
            nameArr = [];
        a = 1 == a ? 2 : 1;
        var d, e, f, g, h, j, l = gSocketMsg.get_vs_max_vs();

        for (var d = 1; d <= l; d++) {
            var b = '';
            1 < d && 0 == (d - 1) % 4 && (b += "</tr><tr>"),
                c.get("vs" + a + "_pos" + d) ? (e = c.get("vs" + a + "_name" + d),
                    b += e) : b = "";
            if (b != '') {
                nameArr.push(g_simul_efun.replaceControlCharBlank(b));
            }
        }
        return nameArr;
    }

    function getPozhaoNpcName() {
        var correctNameArr = [];
        for (var k = 0; k < killTargetArr.length; k++) {
            var name = killTargetArr[k];
            var vsNameArr = getVsName();
            if (vsNameArr.length > 0) {
                for (var i = 0; i < vsNameArr.length; i++) {
                    var vsName = vsNameArr[i];
                    if (vsName.indexOf(name) != '-1') {
                        correctNameArr.push(vsName);
                    }
                }
            } else {
                return killTargetArr;
            }
        }
        return correctNameArr;
    }
    var correctNameArr = [];

    // 苗疆炼药
    function MjlyFunc() {
        var msg = "毒藤胶和毒琥珀准备好了吗？\n苗疆地图开了吗？\n没有就点取消！";
        if (confirm(msg) === true) {
            console.log("去苗疆。");
            setTimeout(Mjly1Func, 200);
        } else {
            return false;
        }
    }
    function Mjly1Func() {
        go('jh 40;s;s;s;s;e;s;se;sw;s;sw;e;e;sw;se;sw;se;');
        console.log("铁索桥。");
        go('event_1_8004914;');
        setTimeout(Mjly2Func, 10000);
    }
    function Mjly2Func() {
        var place = $('#out .outtitle').text();
        if (place !== "澜沧江南岸") {
            console.log("重新跑。");
            setTimeout(Mjly1Func, 2000);
        } else {
            console.log("继续走。");
            go('se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w;');
            setTimeout(Mjly3Func, 5000);
        }
    }
    function Mjly3Func() {
        if (isContains($('span.out2:contains(炼药的丹炉)').text().slice(-6), '明天再来吧！')) {
            console.log("炼完了。");
            go('home');
        } else {
            go('lianyao;');
            setTimeout(Mjly3Func, 6000);
        }
    }

    // 天山玄冰
    function TianShanFunc() {
        var msg = "御寒衣和掌门手谕准备好了吗？\n天山地图开了吗？\n没有就点取消！";
        if (confirm(msg) === true) {
            console.log("去天山。");
            setTimeout(TianShan1Func, 200);
        } else {
            return false;
        }
    }
    function TianShan1Func() {
        go('jh 39;ne;e;n;ne;ne;n;ne;nw;');
        console.log("攀山绳。");
        go('event_1_58460791;');
        setTimeout(TianShan2Func, 6000);
    }
    function TianShan2Func() {
        var place = $('#out .outtitle').text();
        if (place !== "失足岩") {
            console.log("重新跑。");
            setTimeout(TianShan1Func, 100);
        } else {
            console.log("继续走。");
            go('nw;n;ne;nw;nw;w;n;n;n;e;e;s;');
            go('give tianshan_hgdz');
            setTimeout(TianShan3Func, 3000);
        }
    }
    function TianShan3Func() {
        go('ask tianshan_hgdz');
        go('ask tianshan_hgdz');
        setTimeout(TianShan4Func, 3000);
    }
    function TianShan4Func() {
        go('s');
        go('event_1_34855843');
        setTimeout(TianShan5Func, 3000);
    }

    function TianShan5Func() {
        if (isContains($('span.out2:contains(此打坐许久)').text().slice(-8), '离开了千年玄冰。')) {
            console.log("天山玄冰完了。");
            go('home');
        } else {
            setTimeout(TianShan5Func, 3000);
        }
    }

    // 挖宝
    function WabaoFunc() {
        go('cangbaotu_op1', 1)
    }
    function Trigger(r, h, c, n) {
        this.regexp = r;
        this.handler = h;
        this.class = c;
        this.name = n;

        this.enabled = true;

        this.trigger = function (line) {
            if (!this.enabled) return;

            if (!this.regexp.test(line)) return;

            // console.log("触发器: " + this.regexp + "触发了");
            var m = line.match(this.regexp);
            this.handler(m);
        };

        this.enable = function () {
            this.enabled = true;
        };

        this.disable = function () {
            this.enabled = false;
        };

    }

    var jh = function (w) {
        if (w == 'xt') w = 1;
        if (w == 'ly') w = 2;
        if (w == 'hsc') w = 3;
        if (w == 'hs') w = 4;
        if (w == 'yz') w = 5;
        if (w == 'gb') w = 6;
        if (w == 'qy') w = 7;
        if (w == 'em') w = 8;
        if (w == 'hs2') w = 9;
        if (w == 'wd') w = 10;
        if (w == 'wy') w = 11;
        if (w == 'sy') w = 12;
        if (w == 'sl') w = 13;
        if (w == 'tm') w = 14;
        if (w == 'qc') w = 15;
        if (w == 'xx') w = 16;
        if (w == 'kf') w = 17;
        if (w == 'gmd') w = 18;
        if (w == 'qz') w = 19;
        if (w == 'gm') w = 20;
        if (w == 'bt') w = 21;
        if (w == 'ss') w = 22;
        if (w == 'mz') w = 23;
        if (w == 'ts') w = 24;


        go("jh " + w, 0);
    };


    function Triggers() {
        this.allTriggers = [];

        this.trigger = function (line) {
            var t = this.allTriggers.slice(0);
            for (var i = 0, l = t.length; i < l; i++) {
                t[i].trigger(line);
            }
        };

        this.newTrigger = function (r, h, c, n) {
            var t = new Trigger(r, h, c, n);
            if (n) {
                for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                    if (this.allTriggers[i].name == n) this.allTriggers.splice(i, 1);
                }
            }

            this.allTriggers.push(t);

            return t;
        };

        this.enableTriggerByName = function (n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) t.enable();
            }
        };

        this.disableTriggerByName = function (n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) t.disable();
            }
        };

        this.enableByCls = function (c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.class == c) t.enable();
            }
        };

        this.disableByCls = function (c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.class == c) t.disable();
            }
        };

        this.removeByCls = function (c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t && t.class == c) this.allTriggers.splice(i, 1);
            }
        };

        this.removeByName = function (n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) this.allTriggers.splice(i, 1);
            }
        };
    }

    window.triggers = new Triggers;

    triggers.newTrigger(/似乎以下地方藏有宝物(.*)/, function (m) {
        m = m[1].split(/\d+/);
        var bl_found = false;
        for (i = 0; i < m.length; i++) {
            var a = m[i];
            // console.log(a);
            if (/一片翠绿的草地/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/大诗人白居易之墓，墓碑上刻着“唐少傅白公墓”。四周环绕着冬青。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正站在雪亭镇南边的一家小客栈里，这家客栈虽小，却是方圆五百里/.test(a)) {
                jh('xt');
                go('dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇镇前广场的空地，地上整齐地铺著大石板。广场中央有一个木头搭的架子，经过多年的风吹日晒雨淋，看来非常破旧。四周建筑林立。往西你可以看到一间客栈，看来生意似乎很好。/.test(a)) {
                jh('xt');
                go('e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间十分老旧的城隍庙，在你面前的神桌上供奉著一尊红脸的城隍，庙虽老旧，但是神案四周已被香火薰成乌黑的颜色，显示这里必定相当受到信徒的敬仰。/.test(a)) {
                jh('xt');
                go('e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条普通的黄土小径，弯弯曲曲往东北一路盘旋上山，北边有一间城隍庙，往西则是雪亭镇的街道。/.test(a)) {
                jh('xt');
                go('e;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条普通的黄土小径，小径往西南通往一处山间的平地，从这里可以望见不少房屋错落在平地上，往东北则一路上山。/.test(a)) {
                jh('xt');
                go('e;e;s;ne;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条说宽不宽，说窄倒也不窄的山路，路面用几块生满青苔的大石铺成，西面是一段坡地，从这里可以望见西边有几间房屋错落在林木间，东面则是山壁，山路往西南衔接一条黄土小径，往北则是通往山上的石阶。/.test(a)) {
                jh('xt');
                go('e;e;s;ne;ne;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的街口，往北是一个热闹的广场，南边是条小路通往一座林子，东边则有一条小径沿著山腰通往山上，往西是一条比较窄的街道，参差不齐的瓦屋之间传来几声犬吠。从这里向东南走就是进出关的驿道了。/.test(a)) {
                jh('xt');
                go('e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的街道，你的北边有一家客栈，从这里就可以听到客栈里人们饮酒谈笑/.test(a)) {
                jh('xt');
                go('e;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间宽敞的书院，虽然房子看起来很老旧了，但是打扫得很整洁，墙壁上挂著一幅山水画，意境颇为不俗，书院的大门开在北边，西边有一扇木门通往边厢。/.test(a)) {
                jh('xt');
                go('e;s;w;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条宽敞坚实的青石板铺成的大道，路上车马的痕迹已经在路面上留下一条条明显的凹痕，往东是一条较小的街道通往雪亭镇。/.test(a)) {
                jh('xt');
                go('e;s;w;w;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正走在雪亭镇的街道上，东边不远处有一间高大的院子，门口立著一根粗大的旗杆/.test(a)) {
                jh('xt');
                go('e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间素来以公平信用著称的钱庄，钱庄的老板还是个曾经中过举人的读书人/.test(a)) {
                jh('xt');
                go('e;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正站在一间大宅院的入口，两只巨大的石狮镇守在大门的两侧，一阵阵吆喝与刀剑碰撞的声音从院子中传来，通过大门往东可以望见许多身穿灰衣的汉子正在操练。/.test(a)) {
                jh('xt');
                go('e;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正站在一个宽敞的教练场中，地上铺著黄色的细砂，许多人正在这里努力地操练著，北边是一间高大的兵器厅，往东则是武馆师父们休息的大厅。/.test(a)) {
                jh('xt');
                go('e;n;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间堆满各式兵器、刀械的储藏室，各式武器都依照种类、长短、依次放在一起，并且擦拭得一尘不染，储藏室的出口在你的南边，面对出口的左手边有一个架子/.test(a)) {
                jh('xt');
                go('e;n;e;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是淳风武馆的正厅，五张太师椅一字排开面对著门口，这是武馆中四位大师傅与馆主柳淳风的座位/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是淳风武馆中的天井，往西走可以回到正厅/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间整理得相当乾净的书房，红木桌椅上铺著蓝绸巾，显得十分考究，西面的立著一个书架，上面放著一排排的古书，往南走出房门可以看到天井。/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间布置得相当雅致的厢房，从窗子可以看到北边的天井跟南边的庭园中各式各样的奇花异草，以及他们所带来的淡淡香气，厢房的东面墙上还挂著一幅仕女图/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这里是淳风武馆的内院，平常武馆弟子没有馆主的允许是不敢到这里来的/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正走在雪亭镇的大街，往南直走不远处是镇上的广场，在你的东边是一间大宅院/.test(a)) {
                jh('xt');
                go('e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间打铁铺子，从火炉中冒出的火光将墙壁映得通红，屋子的角/.test(a)) {
                jh('xt');
                go('e;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的大街，东边有一栋陈旧的建□，看起来像是什麽店铺，但是并没有任何招牌，只有一扇门上面写著一个大大的/.test(a)) {
                jh('xt');
                go('e;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一家中等规模的当铺，老旧的柜台上放著一张木牌/.test(a)) {
                jh('xt');
                go('e;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是丰登当铺的储藏室，有时候当铺里的大朝奉会把铺里存不下的死当货物拿出来拍卖/.test(a)) {
                jh('xt');
                go('e;n;n;n;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的大街，一条小巷子通往东边，西边则是一间驿站/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是负责雪亭镇官府文书跟军令往来的雪亭驿/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/一间小木屋，在这北方的风中吱吱作响。/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一处山坳，往南就是雪亭镇，一条蜿蜒的小径往东通往另一个邻近的小山村/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里便是有名的龙门石窟，石窟造像，密布于两岸的崖壁上。远远可以望见琵琶峰上的白冢。/.test(a)) {
                jh('ly');
                go('dig go');
                bl_found = true;
                break;
            }
            if (/城南官道，道路两旁是一片树林，远处是一片片的农田了。田地里传来农人的呼号，几头黄牛悠闲的趴卧着。/.test(a)) {
                jh('ly');
                go('n;dig go');
                bl_found = true;
                break;
            }
            if (/由此洛阳城南门出去，就可以通往南市的龙门石窟。城门处往来客商络绎不绝，几名守城官兵正在检查过往行人。/.test(a)) {
                jh('ly');
                go('n;n;dig go');
                bl_found = true;
                break;
            }
            if (/洛阳最繁华的街市，这里聚集着各国客商。/.test(a)) {
                jh('ly');
                go('n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里便是洛水渡口静静的洛水由此向东，汇入滚滚黄河。码头上正泊着一艘船坞，常常的缆绳垂在水中。/.test(a)) {
                jh('ly');
                go('n;n;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/一艘普通的船坞，船头坐着一位蓑衣男子。/.test(a)) {
                jh('ly');
                go('n;n;e;s;luoyang317_op1;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是洛阳的南面了，街上有好几个乞丐在行乞。/.test(a)) {
                jh('ly');
                go('n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是一座供奉洛神的小庙。小庙的地上放着几个蒲团。/.test(a)) {
                jh('ly');
                go('n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这儿就是洛阳金刀世家了。金刀门虽然武功不算高，但也是有两下子的。/.test(a)) {
                jh('ly');
                go('n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/金刀世家的练武场。金刀门的门主王天霸在这儿教众弟子习武。/.test(a)) {
                jh('ly');
                go('n;n;n;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是洛神庙下面的地道，上面人走动的声音都隐约可听见。/.test(a)) {
                jh('ly');
                go('n;n;n;w;putuan;dig go');
                bl_found = true;
                break;
            }
            if (/湿润的青石路显然是刚刚下过雨，因为来往行人过多，路面多少有些坑坑凹凹，一不留神很容易被绊到。/.test(a)) {
                jh('ly');
                go('n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这儿就是菜市口。各种小贩商人十分嘈杂，而一些地痞流氓也混迹人群伺机作案。/.test(a)) {
                jh('ly');
                go('n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/一个猪肉摊，在这儿摆摊卖肉已经十多年了。/.test(a)) {
                jh('ly');
                go('n;n;n;n;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/你刚踏进巷子，便听得琴韵丁冬，小巷的宁静和外面喧嚣宛如两个世界/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/小院四周满是盛开的桃花，穿过一条长廊，一座别致的绣楼就在眼前了。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;s;dig go');
                bl_found = true;
                break;
            }
            if (/绣楼内挂着湖绿色帐幔，一名女子斜靠在窗前的美人榻上。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;s;w;dig go');
                bl_found = true;
                break;
            }
            // if (/这里就是背阴巷了，站在巷口可以万剑阴暗潮湿的窄巷，这里聚集着洛阳的地痞流氓，寻常人不敢近前。/.test(a)) {
            //     jh('ly');
            //     go('n;n;n;n;w;event_1_98995501;dig go');
            //     bl_found = true;
            //     break;
            // }
            // if (/黑暗的街道，几个地痞无赖正慵懒的躺在一旁。/.test(a)) {
            //     jh('ly');
            //     go('n;n;n;n;w;event_1_98995501;n;dig go;n;dig go');
            //     bl_found = true;
            //     break;
            // }
            // if (/这是一家酒肆，洛阳地痞头目甄大海正坐在里面小酌。/.test(a)) {
            //     jh('ly');
            //     go('n;n;n;n;w;event_1_98995501;n;n;e;dig go');
            //     bl_found = true;
            //     break;
            // }
            // if (/院落里杂草丛生，东面的葡萄架早已枯萎。/.test(a)) {
            //     jh('ly');
            //     go('n;n;n;n;w;event_1_98995501;n;w;dig go');
            //     bl_found = true;
            //     break;
            // }
            if (/一座跨街大青砖砌的拱洞高台谯楼，矗立在城中心。鼓楼为二层木瓦建筑，设有大鼓大钟，晨钟暮鼓，用以报时。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/相传春秋时代，楚王在此仰望周王城，问鼎重几何。周室暗弱，居然隐忍不发。这便是街名的由来。银钩赌坊也在这条街上。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里便是洛阳有名的悦来客栈，只见客栈大门处人来人往，看来生意很红火。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/客栈大院，院内紫藤花架下放着几张桌椅，东面是一座马厩。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/客栈马倌正在往马槽里添草料，旁边草料堆看起来有些奇怪。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/房间布置的极为雅致，没有太多的装饰，唯有屋角放着一个牡丹屏风。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/赌坊二楼走廊，两旁房间里不时床来莺声燕语，看来这里不止可以赌。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通往赌坊二楼的楼梯，上面铺着大红色地毯。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/大厅满是呼庐喝雉声、骰子落碗声、银钱敲击声，男人和女人的笑声，/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/走出赌坊后门，桂花清香扑面而来，桂花树下的水缸似乎被人移动过。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/赌坊门口人马喧哗，门上一支银钩在风中摇晃，不知道多少人咬上了这没有鱼饵的钩/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;dig go');
                bl_found = true;
                break;
            }
            if (/自古以来，洛阳墨客骚人云集，因此有“诗都”之称，牡丹香气四溢，又有“花都”的美誉/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;s;dig go');
                bl_found = true;
                break;
            }
            // if (/这儿是牡丹园内的一座小亭子，布置得十分雅致。/.test(a)) {
            //     jh('ly');
            //     go('n;n;n;n;n;w;s;luoyang111_op1;dig go');
            //     bl_found = true;
            //     break;
            // }
            if (/也许由于连年的战乱，使得本来很热闹的街市冷冷清清，道路两旁的店铺早已破旧不堪，一眼望去便知道有很久没有人居住了。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这间当铺处于闹市，位置极好。当铺老板正半眯着双眼在高高的柜台上打盹。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/你无意中走进一条青石街，这里不同于北大街的繁华热闹，两边是一些小店铺，北面有一家酒肆，里面出入的人看起来衣衫褴褛。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间小酒肆，里面黑暗潮湿，满是油垢的桌旁，几名无赖正百无聊赖的就着一盘花生米喝酒。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是洛阳北边街道，人群熙熙攘攘甚是热闹。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/洛阳城的钱庄，来往的商客往往都会将银两存于此处。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/就是洛阳北门，门口站着的是守城官兵。站在城楼望出去，外面是一片茅草路。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/城北通往邙山的小路，路旁草丛中时有小兽出没。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/一片绿云般的竹林隔绝了喧嚣尘世，步入这里，心不由平静了下来。青石小路在竹林中蜿蜒穿行，竹林深处隐约可见一座小院。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/绿竹环绕的小院，院内几间房舍都用竹子打造，与周围竹林颇为和谐。这小院的主人显然有些独特之处。院内一名老翁正在劈柴。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/一间雅致的书斋，透过窗户可以见到青翠修竹，四周如此清幽，竹叶上露珠滴落的声音都能听见。靠墙的书架看起来很别致。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/ 就是洛阳城墙上的城楼，驻守的官兵通常会在这儿歇个脚，或是聊下天。如果心细之人，能看到角落里似乎有一个隐秘的把手。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            // if (/ 这个城楼上的密室显然是守城军士秘密建造的，却不知有何用途。/.test(a)) {
            //     jh('ly');
            //     go('n;n;n;n;n;n;n;n;w;luoyang14_op1;dig go');
            //     bl_found = true;
            //     break;
            // }
            if (/这就是洛阳城的城墙。洛阳是重镇，因此城墙上驻守的官兵格外多。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/由于连年的战乱，整条金谷街的不少铺子已经荒废掉了。再往东走就是洛阳地痞流氓聚集的背阴巷。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是洛阳首富的庄院，据说家财万贯，富可敌国。庄院的的中间有一棵参天大树。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是富人家的储藏室，因此有不少奇珍异宝。仔细一看，竟然还有一个红光满面的老人家半躺在角落里。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;n;op1;dig go');
                bl_found = true;
                break;
            }
            if (/一座朴实的石拱桥，清澈河水从桥下流过。对面可见一座水榭。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/荷池旁的水榭，几名游客正在里面小憩。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/回廊两旁便是碧绿荷塘，阵阵荷香拂过。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/荷塘中的观景台，两名女子在这里游玩。远远站着几名护卫，闲杂人等一律被挡在外面。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/隐藏在一片苍翠树林中的小路，小路尽头有座草屋。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/简陋的茅草小屋，屋内陈设极其简单。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/石阶两侧山泉叮咚，林木森森。漫步而上，可见山腰有亭。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这就是听伊亭，据说白居易曾与好友在此品茗、论诗。一旁的松树上似乎有什么东西。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/丛林小径，因为走得人少，小径已被杂草覆盖。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/听着松涛之音，犹如直面大海/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是华山村村口，几个草垛随意的堆放在路边，三两个泼皮慵懒躺在那里。/.test(a)) {
                jh('hsc');
                go('dig go');
                bl_found = true;
                break;
            }
            if (/这是一条穿过村口松树林的小路。/.test(a)) {
                jh('hsc');
                go('n;dig go');
                bl_found = true;
                break;
            }
            if (/这就是有名的神女冢，墓碑前散落着游人墨客烧的纸钱，前面不远处有一间破败的土地庙。/.test(a)) {
                jh('hsc');
                go('n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一片溪边的杏树林，一群孩童在此玩耍。/.test(a)) {
                jh('hsc');
                go('w;dig go');
                bl_found = true;
                break;
            }
            if (/村口一个简易茶棚，放着几张木质桌椅，干净齐整，过往路人会在这里喝杯热茶歇歇脚，村里的王老二常常会混在这里小偷小摸。/.test(a)) {
                jh('hsc');
                go('w;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间破败的土地庙门口，门旁的对联已经模糊不清，隐约只见上联“德之不修/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;dig go');
                bl_found = true;
                break;
            }
            if (/土地庙庙堂，正中供奉着土地，香案上堆积这厚厚的灰尘。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;dig go');
                bl_found = true;
                break;
            }
            if (/隐藏在佛像后的地道入口，两只黑狗正虎视眈眈的立在那里。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通往西侧的通道，前面被铁栅栏挡住了。/.test(a)) {
                jh('hsc');
                bl_found = true;
                go('w;event_1_59520311;n;n;w;dig go');
                break;
            }
            if (/通往地下通道的木楼梯/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通道两侧点着油灯，昏暗的灯光让人看不清楚周围的环境。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通往东侧的通道，前面传来有水声和痛苦的呻吟。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一件宽敞的大厅，正中间摆着一张太师椅，两侧放着一排椅子。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一件布置极为简单的卧房，显然只是偶尔有人在此小憩。床上躺着一名半裸女子，满脸惊恐。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条古老的青石街，几个泼皮在街上游荡。/.test(a)) {
                jh('hsc');
                go('s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条碎石小路，前面有一个打铁铺。/.test(a)) {
                jh('hsc');
                go('s;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间打铁铺，炉火烧的正旺，一名汉子赤膊挥舞着巨锤，锤落之处但见火花四溅。/.test(a)) {

                jh('hsc');
                go('s;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/一棵千年银杏树屹立在广场中央，树下有一口古井，据说这口古井的水清澈甘甜，村里的人每天都会来这里挑水。/.test(a)) {
                jh('hsc');
                go('s;s;dig go');
                bl_found = true;
                break;
            }
            if (/村里的杂货铺，店老板正在清点货品。/.test(a)) {
                jh('hsc');
                go('s;s;e;dig go');
                bl_found = true;
                break;
            }
            if (/杂货铺后院，堆放着一些杂物，东边角落里放着一个马车车厢，一个跛脚汉子坐在一旁假寐。/.test(a)) {
                jh('hsc');
                go('s;s;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一个普通的马车车厢，粗布帘挡住了马车车窗和车门，地板上面躺着一个人。/.test(a)) {
                jh('hsc');
                go('s;s;e;s;huashancun24_op2;dig go');
                bl_found = true;
                break;
            }
            if (/这是村内宗祠大门，门口一棵古槐，树干低垂。/.test(a)) {
                jh('hsc');
                go('s;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/宗祠的大厅，这里供奉着宗室先祖。/.test(a)) {
                jh('hsc');
                go('s;s;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/青石板铺就的小桥，几棵野草从石缝中钻出，清澈的溪水自桥下湍湍流过。/.test(a)) {
                jh('hsc');
                go('s;s;s;dig go');
                bl_found = true;
                break;
            }
            if (/田间泥泞的小路，一个稻草人孤单的立在一旁，似乎在指着某个地方。一个男子神色慌张的从一旁田地里钻出。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间竹篱围城的小院，院内种着几株桃花，屋后竹林环绕，颇为雅致。旁边的西厢房上挂着一把铜制大锁，看起来有些奇怪。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/这是小院的厅堂，迎面墙壁上挂着一幅山水画，看来小院的主人不是普通农人。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间普通的厢房，四周窗户被布帘遮得严严实实。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;w;get_silver;dig go');
                bl_found = true;
                break;
            }
            if (/一条杂草丛生的乡间小路，时有毒蛇出没。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;dig go');
                bl_found = true;
                break;
            }
            if (/一间看起来有些破败的小茅屋，屋内角落里堆着一堆稻草，只见稻草堆悉悉索索响了一阵，竟然从里面钻出一个人来。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;e;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨山脚，站在此处可以摇摇望见四面悬崖的清风寨。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;dig go');
                bl_found = true;
                break;
            }
            if (/通往清风寨唯一的山路，一侧便是万丈深渊。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;dig go');
                bl_found = true;
                break;
            }
            if (/两扇包铁木门将清风寨与外界隔绝开来，门上写着“清风寨”三字。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里就是桃花泉，一片桃林环绕着清澈泉水，据说泉水一年四季不会枯竭。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨前院，地面由坚硬岩石铺就。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨练武场，四周放置着兵器架。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨议事厅，正中放置着一张虎皮椅。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是清风寨后院，远角有一颗大树，树旁有一扇小门。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里就是清风寨兵器库了，里面放着各色兵器。角落里一个上锁的黑铁箱不知道装着什么。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里的空气中充满清甜的味道，地上堆积着已经晒干的柿子。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是清风寨寨主的卧房，床头挂着一把大刀。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是通往二楼大厅的楼梯，楼梯扶手上的雕花精美绝伦，看来这酒楼老板并不是一般的生意人/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/二楼是雅座，文人学士经常在这里吟诗作画，富商土豪也在这里边吃喝边作交易。/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/进门绕过一道淡绿绸屏风，迎面墙上挂着一副『芙蓉出水』图。厅内陈列奢华，雕花楠/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/进门绕过一道淡黄绸屏风，迎面墙上挂着一副『芍药』图，鲜嫩欲滴/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/进门绕过一道淡红绸屏风，迎面墙上挂着一副『牡丹争艳』图，牡丹素以富贵著称。图侧对联：“幽径天姿呈独秀，古园国色冠群芳”。/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/你站在观景台上眺望，扬州城的美景尽收眼底。东面是就是小秦淮河岸，河岸杨柳轻拂水面，几簇粉色桃花点缀其间。/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;n;n;dig go');
                bl_found = true;
                break;
            }

        }
        if (bl_found) go("cangbaotu_op1");
        //      window.setTimeout('go("cangbaotu_op1")', 3000);
    }, "", "cbt");


    // 大昭寺壁画
    function MianBiFunc() {
        console.log(getTimes() + '大昭壁画');
        go('jh 26;w;w;n;w;w;w;n;n;e;event_1_12853448'); //大昭壁画
    }

    window.onerror = function () {
        // return true
    };
    //-------------------------------------------------------------------------------------------------

    // 破招
    function kezhi(zhaoshi) { //1是剑法 2是拳法 3是刀法 4是暗器 5棍子 6枪
        var chuzhao = 0; //1剑法 2拳法 3刀法 4暗器 5棍子 6枪
        var skillname = "";
        var skillbutton = [];
        if (g_obj_map.get("skill_button1") != undefined)
            skillbutton[0] = ansi_up.ansi_to_text(g_obj_map.get("skill_button1").get("name"));
        else
            skillbutton[0] = 0;
        if (g_obj_map.get("skill_button2") != undefined)
            skillbutton[1] = ansi_up.ansi_to_text(g_obj_map.get("skill_button2").get("name"));
        else
            skillbutton[1] = 0;
        if (g_obj_map.get("skill_button3") != undefined)
            skillbutton[2] = ansi_up.ansi_to_text(g_obj_map.get("skill_button3").get("name"));
        else
            skillbutton[2] = 0;
        if (g_obj_map.get("skill_button4") != undefined)
            skillbutton[3] = ansi_up.ansi_to_text(g_obj_map.get("skill_button4").get("name"));
        else
            skillbutton[3] = 0;

        if (zhaoshi == 1) { //找自己的技能里有没有剑法
            // 枪法 燎原百击 冰月破魔枪
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "神龙东来" || skillbutton[i - 1] == "燎原百击" || skillbutton[i - 1] == "冰月破魔枪" || skillbutton[i - 1] == "九溪断月枪" || skillbutton[i - 1] == "燎原百破") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }

            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "九天龙吟剑法" || skillbutton[i - 1] == "覆雨剑法" || skillbutton[i - 1] == "织冰剑法") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }

            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "排云掌法" || skillbutton[i - 1] == "如来神掌") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
            // 棍法
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "月夜鬼萧" || skillbutton[i - 1] == "破军棍诀" || skillbutton[i - 1] == "千影百伤棍") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "翻云刀法" || skillbutton[i - 1] == "雪饮狂刀") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "飞刀绝技" || skillbutton[i - 1] == "孔雀翎") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
            //还他妈没有？你是不是没有武墓或者没有江湖绝学啊？那你破个屁招啊
        } else if (zhaoshi == 2) {  //找自己的技能里有没有拳法
            // 枪法 燎原百击 冰月破魔枪
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "神龙东来" || skillbutton[i - 1] == "燎原百击" || skillbutton[i - 1] == "冰月破魔枪" || skillbutton[i - 1] == "九溪断月枪" || skillbutton[i - 1] == "燎原百破") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "排云掌法" || skillbutton[i - 1] == "如来神掌") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "九天龙吟剑法" || skillbutton[i - 1] == "覆雨剑法" || skillbutton[i - 1] == "织冰剑法") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "飞刀绝技" || skillbutton[i - 1] == "孔雀翎") {

                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "翻云刀法" || skillbutton[i - 1] == "雪饮狂刀") {

                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
            // 棍法
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "月夜鬼萧" || skillbutton[i - 1] == "破军棍诀" || skillbutton[i - 1] == "千影百伤棍") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
        } else if (zhaoshi == 3) {
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "翻云刀法" || skillbutton[i - 1] == "雪饮狂刀") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
            // 枪法 燎原百击 冰月破魔枪
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "神龙东来" || skillbutton[i - 1] == "燎原百击" || skillbutton[i - 1] == "冰月破魔枪" || skillbutton[i - 1] == "九溪断月枪" || skillbutton[i - 1] == "燎原百破") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "排云掌法" || skillbutton[i - 1] == "如来神掌") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "飞刀绝技" || skillbutton[i - 1] == "孔雀翎") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }

            }
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "九天龙吟剑法" || skillbutton[i - 1] == "覆雨剑法" || skillbutton[i - 1] == "织冰剑法") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }

            // 棍法
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "月夜鬼萧" || skillbutton[i - 1] == "破军棍诀" || skillbutton[i - 1] == "千影百伤棍") {
                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
            }

        } else if (zhaoshi == 4) { //暗器绝学，无所谓什么招。找到一个绝学就上。
            for (var i = 1; i <= 7; i++) {
                if (skillbutton[i - 1] == "翻云刀法" || skillbutton[i - 1] == "雪饮狂刀") {

                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
                // 枪法 燎原百击 冰月破魔枪
                for (var i = 1; i <= 7; i++) {
                    if (skillbutton[i - 1] == "神龙东来" || skillbutton[i - 1] == "燎原百击" || skillbutton[i - 1] == "冰月破魔枪" || skillbutton[i - 1] == "九溪断月枪" || skillbutton[i - 1] == "燎原百破") {
                        skillname = skillbutton[i - 1];
                        lianzhen(skillname, i);
                        return;
                    }
                }
                if (skillbutton[i - 1] == "九天龙吟剑法" || skillbutton[i - 1] == "覆雨剑法" || skillbutton[i - 1] == "织冰剑法") {

                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
                if (skillbutton[i - 1] == "飞刀绝技" || skillbutton[i - 1] == "孔雀翎") {

                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
                if (skillbutton[i - 1] == "排云掌法" || skillbutton[i - 1] == "如来神掌") {

                    skillname = skillbutton[i - 1];
                    lianzhen(skillname, i);
                    return;
                }
                // 棍法
                for (var i = 1; i <= 7; i++) {
                    if (skillbutton[i - 1] == "月夜鬼萧" || skillbutton[i - 1] == "破军棍诀" || skillbutton[i - 1] == "千影百伤棍") {
                        skillname = skillbutton[i - 1];
                        lianzhen(skillname, i);
                        return;
                    }
                }
            }
        }
    }
    function checkzhen(skillname, skillbutton) {//按照按钮编号返回数值 0就是没有可以成阵的按钮
        // console.log(skillname+"是我刚刚用的");
        if (skillname == "神龙东来") {
            if (skillbutton.indexOf("月夜鬼萧") >= 0)
                return skillbutton.indexOf("月夜鬼萧");
            return -1;
        }
        if (skillname == "燎原百击") {
            if (skillbutton.indexOf("九溪断月枪") >= 0)
                return skillbutton.indexOf("九溪断月枪");
            if (skillbutton.indexOf("燎原百破") >= 0)
                return skillbutton.indexOf("燎原百破");
            return -1;
        }
        if (skillname == "九天龙吟剑法") {
            if (skillbutton.indexOf("排云掌法") >= 0)
                return skillbutton.indexOf("排云掌法");
            if (skillbutton.indexOf("雪饮狂刀") >= 0)
                return skillbutton.indexOf("雪饮狂刀");
            return -1;
        }
        if (skillname == "排云掌法") {
            if (skillbutton.indexOf("九天龙吟剑法") >= 0)
                return skillbutton.indexOf("九天龙吟剑法");
            if (skillbutton.indexOf("雪饮狂刀") >= 0)
                return skillbutton.indexOf("雪饮狂刀");
            return -1;
        }
        if (skillname == "雪饮狂刀") {
            if (skillbutton.indexOf("排云掌法") >= 0)
                return skillbutton.indexOf("排云掌法");
            if (skillbutton.indexOf("九天龙吟剑法") >= 0)
                return skillbutton.indexOf("九天龙吟剑法");
            return -1;
        }
        if (skillname == "翻云刀法") {
            if (skillbutton.indexOf("覆雨剑法") >= 0)
                return skillbutton.indexOf("覆雨剑法");
            if (skillbutton.indexOf("飞刀绝技") >= 0)
                return skillbutton.indexOf("飞刀绝技");
            return -1;
        }
        if (skillname == "覆雨剑法") {
            if (skillbutton.indexOf("如来神掌") >= 0)
                return skillbutton.indexOf("如来神掌");
            if (skillbutton.indexOf("翻云刀法") >= 0)
                return skillbutton.indexOf("翻云刀法");
            return -1;
        }
        if (skillname == "飞刀绝技") {
            if (skillbutton.indexOf("翻云刀法") >= 0)
                return skillbutton.indexOf("翻云刀法");
            if (skillbutton.indexOf("织冰剑法") >= 0)
                return skillbutton.indexOf("织冰剑法");
            return -1;
        }
        if (skillname == "织冰剑法") {
            if (skillbutton.indexOf("飞刀绝技") >= 0)
                return skillbutton.indexOf("飞刀绝技");
            if (skillbutton.indexOf("孔雀翎") >= 0)
                return skillbutton.indexOf("孔雀翎");
            return -1;
        }
        if (skillname == "孔雀翎") {
            if (skillbutton.indexOf("织冰剑法") >= 0)
                return skillbutton.indexOf("织冰剑法");
            if (skillbutton.indexOf("如来神掌") >= 0)
                return skillbutton.indexOf("如来神掌");
            return -1;
        }
        if (skillname == "如来神掌") {
            if (skillbutton.indexOf("孔雀翎") >= 0)
                return skillbutton.indexOf("孔雀翎");
            if (skillbutton.indexOf("覆雨剑法") >= 0)
                return skillbutton.indexOf("覆雨剑法");
            return -1;
        }
        if (skillname == "破军棍诀") {
            if (skillbutton.indexOf("翻云刀法") >= 0)
                return skillbutton.indexOf("翻云刀法");
            if (skillbutton.indexOf("飞刀绝技") >= 0)
                return skillbutton.indexOf("飞刀绝技");
            if (skillbutton.indexOf("如来神掌") >= 0)
                return skillbutton.indexOf("如来神掌");
            return -1;
        }
        if (skillname == "九溪断月枪") {
            if (skillbutton.indexOf("如来神掌") >= 0)
                return skillbutton.indexOf("如来神掌");
            if (skillbutton.indexOf("孔雀翎") >= 0)
                return skillbutton.indexOf("孔雀翎");
            return -1;
        }
    }
    function lianzhen(skillname, i) {//连阵 连阵毕竟是危险的事情，那么只有在几种情况下。第一 对面敌人数目只有一人。 第二 我的气大于等于6 敌人小于等于3 这样我出阵 大不了敌人破招而已。
        var enemycounter = 0;
        // console.log("*目前我有气"+gSocketMsg.get_xdz() + '*');
        for (i = 1; i <= 8; i++) {
            if (g_obj_map.get("msg_vs_info").get("vs" + obside + "_name" + i) != undefined) {
                enemycounter++;
            }
        }
        var skillbutton = [];
        if (g_obj_map.get("skill_button1") != undefined)
            skillbutton[0] = ansi_up.ansi_to_text(g_obj_map.get("skill_button1").get("name"));
        else
            skillbutton[0] = 0;
        if (g_obj_map.get("skill_button2") != undefined)
            skillbutton[1] = ansi_up.ansi_to_text(g_obj_map.get("skill_button2").get("name"));
        else
            skillbutton[1] = 0;
        if (g_obj_map.get("skill_button3") != undefined)
            skillbutton[2] = ansi_up.ansi_to_text(g_obj_map.get("skill_button3").get("name"));
        else
            skillbutton[2] = 0;
        if (g_obj_map.get("skill_button4") != undefined)
            skillbutton[3] = ansi_up.ansi_to_text(g_obj_map.get("skill_button4").get("name"));
        else
            if (g_obj_map.get("skill_button5") != undefined)
                skillbutton[4] = ansi_up.ansi_to_text(g_obj_map.get("skill_button5").get("name"));
            else
                if (g_obj_map.get("skill_button6") != undefined)
                    skillbutton[5] = ansi_up.ansi_to_text(g_obj_map.get("skill_button6").get("name"));
                else
                    skillbutton[3] = 0;
        skillname = ansi_up.ansi_to_text(skillname);
        // console.log("使用按钮"+i);
        // console.log("出招"+skillname);
        var enemyxdz = 0;
        if (enemycounter != 1) {
            for (var i = 1; i <= 4; i++) {
                if (g_obj_map.get("msg_vs_info") != undefined && g_obj_map.get("msg_vs_info").get("vs" + obside + "_xdz" + i) != undefined) {
                    enemyxdz = g_obj_map.get("msg_vs_info").get("vs" + obside + "_xdz" + i);
                    break;
                }
            }
        }

        clickButton('playskill ' + (skillbutton.indexOf(skillname) + 1), 0); //无论是谁，我先反击一下
        var xdz = gSocketMsg.get_xdz(); //获取我当时的行动值
        //重新获取我们按钮的布局
        if (g_obj_map.get("skill_button1") != undefined)
            skillbutton[0] = ansi_up.ansi_to_text(g_obj_map.get("skill_button1").get("name"));
        else
            skillbutton[0] = 0;
        if (g_obj_map.get("skill_button2") != undefined)
            skillbutton[1] = ansi_up.ansi_to_text(g_obj_map.get("skill_button2").get("name"));
        else
            skillbutton[1] = 0;
        if (g_obj_map.get("skill_button3") != undefined)
            skillbutton[2] = ansi_up.ansi_to_text(g_obj_map.get("skill_button3").get("name"));
        else
            skillbutton[2] = 0;
        if (g_obj_map.get("skill_button4") != undefined)
            skillbutton[3] = ansi_up.ansi_to_text(g_obj_map.get("skill_button4").get("name"));
        else
            if (g_obj_map.get("skill_button5") != undefined)
                skillbutton[4] = ansi_up.ansi_to_text(g_obj_map.get("skill_button5").get("name"));
            else
                if (g_obj_map.get("skill_button6") != undefined)
                    skillbutton[5] = ansi_up.ansi_to_text(g_obj_map.get("skill_button6").get("name"));
                else
                    skillbutton[3] = 0;
        var checkbutton = -1;
        checkbutton = checkzhen(skillname, skillbutton);
        if (checkbutton >= 0) {//enemyxdz<=3
            if (xdz >= 6) {
                // console.log("连阵按钮"+(checkbutton+1));
                // console.log("我要出的绝学是"+g_obj_map.get("skill_button"+(checkbutton+1)).get("name"));
                clickButton('playskill ' + (checkbutton + 1), 0);
            }
        }
    }

    function fighttype(msg) {
        var sword, cuff, blade;//判断哪个值大，用来判断最后一个阵法出现的位置
        sword = msg.lastIndexOf("剑");
        cuff = msg.lastIndexOf("掌");
        if (msg.lastIndexOf("拳") > cuff) {
            cuff = msg.lastIndexOf("拳");
        }
        blade = msg.lastIndexOf("刀");
        if (sword > cuff && sword > blade) {
            return 2
        } else if (cuff > sword && cuff > blade) {
            return 3;
        } else if (blade > sword && blade > cuff) {
            return 1;
        } else {
            return 4;
        }
    }

    var obside = 0;

    function ZhuangBei(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '战斗装备') {
            console.log("切换战斗装备！");
            go('wield weapon_sb_sword10');      // 九天龙吟剑
            go('wear equip_moke_finger10');     // 斩龙戒指
            go('wear equip_moke_head10');       // 斩龙帽子
            go('wield weapon_sb_sword11');      // 11套剑
            go('wear equip_moke_finger11');     // 11套戒指
            go('wear equip_moke_head11');       // 11套帽子
            Dom.html('打坐装备');
        } else {
            console.log("切换打坐装备！");
            go('wield longwulianmoge_mojianlianhun');   // 帮3剑
            go('wear tianlongsi_mumianjiasha'); // 木棉袈裟
            go('wield sword of windspring rumai'); // 入脉风泉
            go('wield weapon_stick_miaoyun_lhx'); // 箫
            go('wear equip_finger_kongdong_bulao');  // 戒指
            go('wear equip_head_tianji_jiuxuan');   // 帽子
            Dom.html('战斗装备');
        }
    };
    // 逃跑吃药
    async function escapeAndEat() {
        clickButton('escape');
        clickButton('items use snow_wannianlingzhi');
    };

    // 面板触发
    // window.game = this;

    window.attach = function () {
        if (!window.webSocketMsg) {
            return false;
        }

        var oldWriteToScreen = window.writeToScreen;
        window.writeToScreen = function (a, e, f, g) {
            oldWriteToScreen(a, e, f, g);
            a = a.replace(/<[^>]*>/g, "");
            triggers.trigger(a);
        };
        window.userId = getQueryString('id');
        loadAfter();
        window._dispatch_message = webSocketMsg.prototype.old = gSocketMsg.dispatchMessage;
        gSocketMsg.dispatchMessage = function (b) {
            var type = b.get("type");
            var subType = b.get("subtype");
            var ctype = b.get("ctype");
            var msg = b.get("msg");

            if (type == 'main_msg' && ctype == 'text' && /：ASSIST\//.test(msg)) {
                
                // if (msg.indexOf('record') > 0) {
                //     reSaveQianLong(msg);
                // }
                if (msg.indexOf('告诉你：ASSIST') > 0 && msg.indexOf('join') > 0) {
                    joinTeam(msg);
                }
                if (msg.indexOf('告诉你：ASSIST') > 0 && msg.indexOf('followme') > 0) {
                    followTeamClick();
                }
                if (msg.indexOf('告诉你：ASSIST') > 0 && msg.indexOf('reload') > 0) {
                    window.location.reload();
                }
                if (msg.indexOf('告诉你：ASSIST') > 0 && msg.indexOf('bang') > 0) {
                    doBang1(msg);
                }
                if (msg.indexOf('告诉你：ASSIST') > 0 && msg.indexOf('you') > 0) {
                    goYouMing()
                }
                if (msg.indexOf('告诉你：ASSIST') > 0 && msg.indexOf('XUESHAN') > 0) {
                    goCorrectBingXue(msg);
                    msg = removeChart(msg);
                    if (msg.indexOf('find') > 0) {
                        var new_msg = msg.split('find/')[1];
                        g_gmain.clickButton('team chat ' + new_msg);
                    }
                }
                // if (msg.indexOf('告诉你：ASSIST') > 0 && msg.indexOf('zha') > 0) {
                //     console.log(msg);
                //     goZha(msg);
                // }
                // if (msg.indexOf('告诉你：ASSIST') > 0 ) {
                //     if (Base.getCorrectText('4253282')) {
                //         goDoByAsk(msg);
                //     }
                // }
                return false;
            } else if (type == 'channel' && subType == 'tell' && /你告诉.+：ASSIST\//.test(msg)) {
                return false;
            } else if (type == 'channel' && subType == 'tell' && /告诉你：ASSIST\//.test(msg)) {
                return false;
            }
            if (type == 'main_msg' && ctype == 'text' && /：QUESTION\//.test(msg)) {
                var txt = g_simul_efun.replaceControlCharBlank(
                    msg.replace(/\u0003.*?\u0003/g, "")
                );
                if (!txt) {
                    return false;
                }
                if (txt.indexOf('谜题密码') > 0) {
                    var txtArr = txt.split('：');
                    var txtMima = txtArr ? txtArr[txtArr.length - 1] : '';
                    if (txtMima) {
                        txtMima = txtMima.replace(/\s+/g, "");
                        // var submitCode = 'event_1_65953349 ' + txtMima;
                        var goPath = 'jh 1;e;n;n;n;n;w;event_1_65953349 ' + txtMima;
                        var txtPush = [
                            {
                                name: '【交密码】',
                                way: goPath
                            }
                        ];
                        addScreenBtn(txtPush);
                        var place = txt.split('--')[0].split('/').length > 0 ? txt.split('--')[0].split('/')[2] : '';
                        var puzzleFinish = /完成谜题\((\d+)\/\d+\)：(.*)的谜题\S*\s*\S*x(\d+)\s*\S*x\d+\s*\S*银两x(\d{1,})/.exec(txt);
                        writeScreenBtns(puzzleFinish[2]);
                        findSpecTagerInfo = puzzleFinish[2];
                        log('暴击npc：' + place + '-' + puzzleFinish[2]);
                    }
                } else {
                    var place = txt.split('--')[0].split('/').length > 0 ? txt.split('--')[0].split('/')[2] : '';
                    var puzzleFinish = /完成谜题\((\d+)\/\d+\)：(.*)的谜题\S*\s*\S*x(\d+)\s*\S*x\d+\s*\S*银两x(\d{1,})/.exec(txt);
                    writeScreenBtns(puzzleFinish[2]);
                    findSpecTagerInfo = puzzleFinish[2];
                    log('暴击npc：' + place + '-' + puzzleFinish[2]);
                }
                return;
            }

            if (this.old) {
                this.old(b);
            }
            qlMon.dispatchMessage(b);
            // if (genZhaoMode==1){
            //     genZhaoView.dispatchMessage(b);
            // }
            if (escapeTrigger == 1) {
                escapeFunc.dispatchMessage(b)
            }
            // if (duiZhaoMode == 1 || genZhaoMode == 1 || daLouMode == 1) {
            zhanDouView.dispatchMessage(b);
            // }
            setTimeout(function () {
                var userId = g_obj_map.get("msg_attrs").get('id');
                window.qianlongCookieName = 'ql-' + userId;
            }, 200);

            if (type == "disconnect" && subType == "change") {
                if (!hasSendReload) {
                    hasSendReload = true;
                    var sendid = getQueryString('id');
                    var sendqu = Base.correctQu();
                    var sendtext = '';
                    if (all_userName) {
                        sendtext = 'Duang,' + sendqu + '区，' + all_userName + '被顶下线了!';
                        // goInLine(sendtext);
                        webSocket.send(JSON.stringify({
                            message: sendtext,
                            type: 'chat'
                        }))
                    }
                    if (Jianshi.chonglian == 1) {
                        setTimeout(function () {
                            reloadGame();
                        }, 20 * 1000);
                    }
                }
            }
        }
    };

    // 获取气血的百分比
    function geKeePercent() {
        var max_kee = g_obj_map.get("msg_attrs").get("max_kee");
        var kee = g_obj_map.get("msg_attrs").get("kee");
        var keePercent = parseInt(kee / max_kee * 100);
        return keePercent;
    }
    // 获取内力的百分比
    function geForcePercent() {
        var max_force = g_obj_map.get("msg_attrs").get("max_force");
        var force = g_obj_map.get("msg_attrs").get("force");
        var forcePercent = parseInt(force / max_force * 100);
        return forcePercent;
    }
    // 加入队伍
    function joinTeam(msg) {
        var txt = g_simul_efun.replaceControlCharBlank(
            msg.replace(/\u0003.*?\u0003/g, "")
        );
        var uid = txt.split('join/')[1];
        uid = $.trim(uid);
        clickButton('team join ' + uid);
    }
    function tellJoinTeam() {
        clickButton('team create');
        clickButton('tell u4219507(1) ASSIST/join/u4253282(1)');
        clickButton('tell u7894304(1) ASSIST/join/u4253282(1)');
        clickButton('tell u7030223(1) ASSIST/join/u4253282(1)');
    }

    function doBang1(msg) {
        var txt = g_simul_efun.replaceControlCharBlank(
            msg.replace(/\u0003.*?\u0003/g, "")
        );
        if (txt.indexOf('close') > 0) {
            openOnTime();
            closeTianJian();
        } else {
            var num = txt.split('bang/')[1];
            num = $.trim(num);
            num = parseInt(num);
            doBang(num);
        }
    }
    function tellGoBang1(num) {
        stopJianghu();
        clickButton('tell u4219507(1) ASSIST/bang/' + num);
        clickButton('tell u7894304(1) ASSIST/bang/' + num);
        clickButton('tell u7030223(1) ASSIST/bang/' + num);
        doBang(num);
    }
    function tellGoBang2(num, place) {
        stopJianghu();
        clickButton('tell u4219507(1) ASSIST/bang/' + num);
        clickButton('tell u7894304(1) ASSIST/bang/' + num);
        clickButton('tell u7030223(1) ASSIST/bang/' + num);
        doBang(num, place);
    }
    function tellBangClose() {
        clickButton('tell u4219507(1) ASSIST/bang/close11');
        clickButton('tell u7894304(1) ASSIST/bang/close11');
        clickButton('tell u7030223(1) ASSIST/bang/close11');
    }

    function tellGoYouMing() {
        clickButton('tell u4219507(1) ASSIST/you/go');
        clickButton('tell u7894304(1) ASSIST/you/go');
        clickButton('tell u7030223(1) ASSIST/you/go');
        goYouMing();
        setTimeout(() => {
            $('#houyuanbtn').trigger('click');
        }, 20 * 1000);
    }

    function goYouMing() {
        go('jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e;event_1_77775145 ymsz_houyuan');
    }

    function acceptTeam() {
        clickButton('team');
        setTimeout(() => {
            var team_msg = g_obj_map.get("msg_team");
            if (team_msg) {
                var team_elements = team_msg.elements;
                for (var i = 0; i < team_elements.length; i++) {
                    if (team_elements[i].key.indexOf('try_member') >= 0) {
                        var id = team_elements[i].value.split(',')[0];
                        if (id) {
                            clickButton('team allow ' + id);
                        }
                    }
                }
            }
        }, 2000);
        // clickButton('team allow u4219507');
        // clickButton('team allow u7894304');
        // clickButton('team allow u7030223');
    }
    function joinPiTeam(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '进皮总队伍') {
            Dom.html('出皮总队伍');
            joinMohuangTeam();
        } else {
            Dom.html('进皮总队伍');
            clearInterval(joinTeamTimer);
        }
    }

    function triggerJoinTeamOn() {
        if ($('#btns15').html() == "进皮总队伍") {
            $('#btns15').trigger('click');
        }
    }

    function triggerJoinTeamOff() {
        if ($('#btns15').html() == "出皮总队伍") {
            $('#btns15').trigger('click');
        }
    }

    var joinTeamTimer = null;
    function joinMohuangTeam() {
        var uid = 'u5921792';   // 皮总
        // var uid = 'u4219507';

        clearInterval(joinTeamTimer);
        joinTeamTimer = setInterval(() => {
            clickButton('golook_room');
            var msg_room = g_obj_map.get("msg_room");
            if (msg_room) {
                var room_name = msg_room.get("short");
                if (room_name.indexOf('魔皇殿') < 0) {
                    go('rank go 236');
                }
                clickButton('team');
            } else {
                go('jh 2');
            }
            setTimeout(() => {
                var team_msg = g_obj_map.get("msg_team");
                if (team_msg) {
                    var team_elements = team_msg.elements;
                    var isInTeam = false;
                    for (var i = 0; i < team_elements.length; i++) {
                        if (team_elements[i].key.indexOf('member') >= 0) {
                            var id = team_elements[i].value.split(',')[0];
                            if (id === uid) {
                                isInTeam = true;
                                console.log('在队伍中');
                                g_gmain.notify_fail(HIG + "在队伍中！！" + NOR);
                                clearInterval(joinTeamTimer);
                            }
                        }
                    }
                    if (!isInTeam) {
                        //4219507
                        clickButton('team join ' + uid);
                    }
                }
            }, 2000);

        }, 6000);
    }
    // 告诉炸
    // function tellZha(text) {
    //     clickButton('tell u4219507 ASSIST/zha/' + text);
    // }
    // function stopZha(text) {
    //     clickButton('tell u4219507 ASSIST/zha/' + text);
    // }
    // 去炸
    function goZha(text) {
        if (g_gmain.is_fighting) {
            warnning('战斗中...');
            return;//战斗中
        }
        if (text.indexOf('停止')) {
            go('home');
            clearInterval(killGoodSetInterval);
            Base.skills();
            return false;
        }
        if (killGoodSetInterval) {
            clearInterval(killGoodSetInterval);
        }
        text = removeChart(text);
        text = text.replace(/炸/g, '');
        var placetext = text.split('zha/')[1];
        var zhaObj = placetext.split('-');
        var place = zhaObj[0];
        var name = zhaObj[1];
        name = name.replace(/\n/g, "");
        var hasPerson = hasSamePerson(name);
        Base.mySkillLists = '霹雳弹';
        if (hasPerson.length > 0) {
            killGoodSetInterval = setInterval(function () {
                var hp = geKeePercent();
                if (hp > 95) {
                    killSet([name]);
                }
            }, 300);
        } else {
            Jianshi.zha = 1;
            isOnstep1 = false;
            goFindNpcInPlace(place, name);
        }
    }

    function doBang(num, way) {
        if (num > 4) {
            //clickButton('clan fb enter_51 daxuemangongdao', 0)
            go('clan fb enter_' + num + ' daxuemangongdao');
        } else {
            go('clan fb enter shenshousenlin');
            switch (num) {
                case 1:
                    go('event_1_40313353');
                    break;
                case 2:
                    go('event_1_2645997');
                    break;
                case 3:
                    go('event_1_43755600');
                    break;
                case 4:
                    go('event_1_64156549');
                    break;
            }
        }
        openTianJian();
        removeOnTime(null, way);
    }

    // attach();
    // 开启本地服务
    window.webSocket = null;

    function webSocketClose() {
        webSocket.close();
        webSocket = null;
    }
    function webSocketConnet() {
        // webSocket = new WebSocket("ws://106.12.144.197:12345");
        webSocket = new WebSocket("ws://81.70.145.184:12345");

        webSocket.onerror = function (event) {
            console.log(event);
        };

        webSocket.onopen = function (event) {
            console.log(event);
            var id = getUrlParam('id');
            var name = g_obj_map.get("msg_attrs").get("name");
            name = removeChart(name) ? id + '_' + removeChart(name) : id + '_game';
            webSocket.send(JSON.stringify({
                name,
                type: 'setname'
            }))
        };

        webSocket.onclose = function (event) {
            console.log(event);
        };

        webSocket.onmessage = function (event) {
            onMessage(event)
        };
    }

    function onMessage(e) {
        var data = JSON.parse(e.data);

        if (data.type !== 'chatterList') {
            if (Base.getCorrectText('4253282') && data.name.indexOf('4253282') >= 0) {
                if (data.message.indexOf('重连') != '-1'){
                    window.location.reload();
                }
                if (data.message.indexOf('提交密码') != '-1') {
                    var mimatext = data.message.split('-')[1];
                    var submitCode = 'event_1_65953349 ' + mimatext;
                    var goPath = 'jh 1;e;n;n;n;n;w;' + submitCode;
                    var msg_room = g_obj_map.get("msg_room");
                    if (msg_room) {
                        if (msg_room.get("short") == '雪亭驿') {
                            goPath = submitCode;
                        }
                    }
                    go(goPath);
                }
                goDoByAsk(data.message);
            } else if (data.name.indexOf(getUrlParam('id')) >= 0) {
                if (data.message.indexOf('提交密码') != '-1') {
                    var mimatext = data.message.split('-')[1];
                    var submitCode = 'event_1_65953349 ' + mimatext;
                    var goPath = 'jh 1;e;n;n;n;n;w;' + submitCode;
                    var msg_room = g_obj_map.get("msg_room");
                    if (msg_room) {
                        if (msg_room.get("short") == '雪亭驿') {
                            goPath = submitCode;
                        }
                    }
                    go(goPath);
                }
                goDoByAsk(data.message);
            }
            if (isBigBixue()) {
                if (data.message.indexOf('question-') != '-1' || data.message.indexOf('q-') != '-1'){
                    startQuestion(data.message);
                }
            } else if (data.name == getUrlParam('id')) {
                if (data.message.indexOf('question-') != '-1' || data.message.indexOf('q-') != '-1') {
                    startQuestion(data.message);
                }
            }
        }
        //console.log(obj);
        // if (obj.fromGroup != '291849393') {
        //     return;
        // } else {
        //     var txt = obj.msg;
        //     if (isKuaFu()) {
        //         if (txt.indexOf('跨服时空') != '-1') {
        //             getKuaPlace(txt);
        //         }
        //         return;
        //     } else {
        //         // 出游侠
        //         var qu = Base.correctQu();
        //         // console.log(qu);
        //         if (txt.indexOf('出游侠') != '-1') {
        //             if (txt.indexOf(qu) != '-1') {
        //                 goQixia(txt);
        //             }
        //         }
        //         if (obj.fromQQ == '348728733') {
        //             if (txt.indexOf('重连') != '-1') {
        //                 goInLine("开始" + txt);
        //                 window.location.reload();
        //             }
        //         }
        //         if (obj.fromQQ == '35994480') {
                    // if (txt.indexOf('do签到') != '-1') {
                    //     goInLine("开始" + txt);
                    //     CheckIn();
                    // }
                    // if (txt.indexOf('发现') != '-1' && txt.indexOf('位于') != '-1') {
                    //     goCorrectBingXue(txt);
                    //     // g_gmain.clickButton('team chat ' + msg);
                    // }
                    // if (txt.indexOf('英雄队伍') != '-1') {
                    //     goInLine("申请加入" + txt);
                    //     clickButton('team join u7598502');
                    // }
                    // if (txt.indexOf('皮队伍') != '-1') {
                    //     goInLine("申请加入" + txt);
                    //     go('rank go 235');
                    //     clickButton('team join u5921792');
                    // }
                    // if (txt.indexOf('苍蝇队伍') != '-1') {
                    //     goInLine("申请加入" + txt);
                    //     clickButton('team join u2626349')
                    // }
                    // if (txt.indexOf('挂机江湖') != '-1') {
                    //     goInLine(txt);
                    //     startJianghu();
                    // }
                    // if (txt.indexOf('东方队伍') != '-1') {
                    //     goInLine("小号申请加入" + txt);
                    //     tellJoinTeam();
                    // }
                    // if (txt.indexOf('go挖矿') != '-1') {
                    //     goInLine(txt);
                    //     goWaKuang();
                    // }
                    // if (txt.indexOf('question-') != '-1') {
                    //     // goInLine(txt);
                    //     startQuestion(txt);
                    // }
                    // if (txt.indexOf('go幽冥3') != '-1') {
                    //     goInLine("去" + txt);
                    //     tellGoYouMing();
                    // }
                    // if (txt.indexOf('go钓鱼') != '-1') {
                    //     goInLine("去" + txt);
                    //     startDiaoYu();
                    // }
                    // if (txt.indexOf('go铁剑') != '-1') {
                    //     goInLine("去" + txt);
                    //     go('jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n;event_1_10117215');
                    // }
                    // if (txt.indexOf('go白猿') != '-1') {
                    //     goInLine("去" + txt);
                    //     go('rank go 210;sw;s;s;s;s;s;s;s;s;s;s;s;w;w;n;n;n;n;nw;nw;nw;n;n;n;event_1_86676244')
                    // }
                    // if (txt.indexOf('go阎王') != '-1') {
                    //     goInLine("去" + txt);
                    //     go('rank go 223;nw;event_1_42827171;kill yanwangshidian_zhuanlunwang');
                    // }
                    // if (txt.indexOf('帮派副本1-1') != '-1') {
                    //     goInLine("去" + txt);
                    //     tellGoBang1(1);
                    // }
                    // if (txt.indexOf('帮派副本1-2') != '-1') {
                    //     goInLine("去" + txt);
                    //     tellGoBang1(2);
                    // }
                    // if (txt.indexOf('帮派副本1-3') != '-1') {
                    //     goInLine("去" + txt);
                    //     tellGoBang1(3);
                    // }
                    // if (txt.indexOf('帮派副本1-4') != '-1') {
                    //     goInLine("去" + txt);
                    //     tellGoBang1(4);
                    // }
                    // if (txt.indexOf('帮派副本2-') != '-1') {
                    //     goInLine("去" + txt);
                    //     var bangPaiFubenNum = txt.split('-')[1];
                    //     var place = txt.split('-')[2];
                    //     tellGoBang2(bangPaiFubenNum, place);
                    // }
                    // if (txt.indexOf('帮派副本3') != '-1') {
                    //     goInLine("扫荡帮派副本3");
                    //     clickButton('clan');
                    //     clickButton('clan fb go_saodang longwulianmoge');
                    //     // 扫荡副本3
                    // }
                    // if (txt.indexOf('欢迎入队') != '-1') {
                    //     goInLine('欢迎加入东方队伍');
                    //     acceptTeam();
                    // }
                    // if (txt.indexOf('doVip签到') != '-1') {
                    //     goInLine("开始" + txt);
                    //     CheckInFunc();
                    // }
                    // // if (txt.indexOf('do刷碎片') != '-1') {
                    // // goInLine("开始" + txt);
                    // // killDrunkManFunc();
                    // // }
                    // if (txt.indexOf('do存东西') != '-1') {
                    //     goInLine("开始" + txt);
                    //     baoguoZhengliFunc();
                    // }
                    // if (txt.indexOf('do其他') != '-1') {
                    //     goInLine("开始" + txt);
                    //     CheckInFunc1();
                    // }
                    // if (txt.indexOf('do冰月') != '-1') {
                    //     goInLine("开始" + txt);
                    //     getBingyue();
                    // }
                    // if (txt.indexOf('do打榜') != '-1') {
                    //     goInLine("开始" + txt);
                    //     $('#btn-hitBang').trigger('click');
                    // }
                    // if (txt.indexOf('do令牌') != '-1') {
                    //     goInLine("开始" + txt);
                    //     doLingPai();
                    // }
                    // if (txt.indexOf('秒突') != '-1') {
                    //     goInLine("开始" + txt);
                    //     tupoSpeed();
                    // }
                    // if (txt.indexOf('突破加速') != '-1') {
                    //     goInLine("开始" + txt);
                    //     tupoSpeed1();
                    // }
                    // if (txt.indexOf('练习技能') != '-1') {
                    //     goInLine("开始" + txt);
                    //     skillPritice();
                    // }
                    // if (txt.indexOf('do use 令牌') != '-1') {
                    //     goInLine("开始" + txt);
                    //     doUseLingPai();
                    // }
                    // if (txt.indexOf('do突破') != '-1') {
                    //     goInLine("开始" + txt);
                    //     tupoSkills2();
                    // }
                    // if (txt.indexOf('重连') != '-1') {
                    //     goInLine("开始" + txt);
                    //     window.location.reload();
                    // }
                    // if (txt.indexOf('炸') != '-1' && txt.indexOf('-') != '-1') {
                    //     goInLine("开始" + txt);
                    //     tellZha(txt);
                    // }
                    // if (txt.indexOf('炸') != '-1' && txt.indexOf('停止') != '-1') {
                    //     goInLine("开始" + txt);
                    //     stopZha(txt);
                    // }
                // }

            // }
        // }
    }

    function goDoByAsk(txt) {
        console.log(txt);
        if (txt.indexOf('东方队伍') != '-1') {
            tellJoinTeam();
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "小号申请加入队伍");
        }
        if (txt.indexOf('欢迎入队') != '-1') {
            acceptTeam();
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "已经加入队伍");
        }
        if (txt.indexOf('go幽冥3') != '-1') {
            tellGoYouMing();
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去幽冥3");
        }
        if (txt.indexOf('goVip') != '-1') {
            CheckInFunc();
            CheckInFunc1();
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去VIP签到");
        }
        if (txt.indexOf('go铁剑') != '-1') {
            go('jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n;event_1_10117215');
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去铁剑");
        }
        if (txt.indexOf('go白猿') != '-1') {
            go('rank go 210;sw;s;s;s;s;s;s;s;s;s;s;s;w;w;n;n;n;n;nw;nw;nw;n;n;n;event_1_86676244');
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去白猿");
        }
        if (txt.indexOf('go阎王') != '-1') {
            go('rank go 223;nw;event_1_42827171;kill yanwangshidian_zhuanlunwang');
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去阎王");
        }
        if (txt.indexOf('帮派副本1-1') != '-1') {
            tellGoBang1(1);
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去帮派副本1-1");
        }
        if (txt.indexOf('帮派副本1-2') != '-1') {
            tellGoBang1(2);
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去帮派副本1-2");
        }
        if (txt.indexOf('帮派副本1-3') != '-1') {
            tellGoBang1(3);
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去帮派副本1-3");
        }
        if (txt.indexOf('帮派副本1-4') != '-1') {
            tellGoBang1(4);
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去帮派副本1-4");
        }
        if (txt.indexOf('帮派副本2-') != '-1') {
            var bangPaiFubenNum = txt.split('-')[1];
            var place = txt.split('-')[2];
            tellGoBang2(bangPaiFubenNum, place);
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去派副本2-" + bangPaiFubenNum + '-'+ place);
        }
        if (txt.indexOf('帮派副本3') != '-1') {
            clickButton('clan');
            clickButton('clan fb go_saodang longwulianmoge');
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "扫荡帮派副本3");
        }
        if (txt.indexOf('双修') != '-1') {
            go('rank go 233;s;s;s;e;ne;event_1_66728795');
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去双修");
        }
        if (txt.indexOf('本10') != '-1') {
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去本10");
            killBen10();
        }
        if (txt.indexOf('三树') != '-1') {
            goKillSanShu();
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去三树");
        }
        if (txt.indexOf('小号重进') != '-1') {
            tellReload();
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "小号重连");
        }
        if (txt.indexOf('小号跟随') != '-1') {
            tellFollow();
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "小号跟随");
        }
        if (txt.indexOf('去柴绍') != '-1') {
            goAskChaiShao();
            clickButton('tell ' + assistant + ' ASSIST/reTell/' + "去柴绍");
        }
    }

    function tellReload(){
        clickButton('tell u4219507(1) ASSIST/reload');
        clickButton('tell u7894304(1) ASSIST/reload');
        clickButton('tell u7030223(1) ASSIST/reload');
    }
    function tellFollow() {
        clickButton('tell u4219507(1) ASSIST/followme');
        clickButton('tell u7894304(1) ASSIST/followme');
        clickButton('tell u7030223(1) ASSIST/followme');
    }
    // 去杀三树
    function goKillSanShu(){
        go('rank go 233;s;s;s;s;s;s;sw;se;sw;sw;s;s;s;sw;sw;event_1_10567243;w;sw;s;s;se;se;se;nw;nw;nw;se;se;se');
        setTimeout(() => {
            killSomePerson();
        }, 1000*20);
    }
    function sendToQQ(txt) {
        var msgObject = { "act": "101", "groupid": "291849393" };
        msgObject["msg"] = getTimes() + txt.replace(/\n/g, "");
        console.log(txt);
        // if (webSocket) webSocket.send(JSON.stringify(msgObject));
    }

    function goQixia(txt) {
        txt = txt.split(',');
        findSpecTagerInfo = txt[1];

        autoFindSpecargetFunc();
    }

    function getGouJuan(){
        go('jh 1;home');
        setTimeout(() => {
            isCorrectBangZhanPlace('八荒谷');
        }, 3000);
        setTimeout(() => {
            go('n;event_1_18378233');
        }, 8000);
    }

    function getGouJuan1() {
        go('jh 1;home');
        setTimeout(() => {
            isCorrectBangZhanPlace('聚义厅');
        }, 3000);
        setTimeout(() => {
            //javascript:clickButton('sort global fetch_reward', 0);
            go('sort global fetch_reward');
        }, 8000);
    }
    // 去柴绍
    function goAskChaiShao() {
        go('rank go 233;s;s;s;s;s;s;sw;se;sw;sw;s;s;s;sw;sw;event_1_10567243');
        setTimeout(() => {
            triggerAskChaiShao();
        }, 10 * 1000);
    }

    var hasDoOnece = false;
    var hasSendMsg = false;
    // 到时做XXX
    function doOnTime() {
        var hours = getHours();
        var minTime = getMin();
        // var week = getWeek();
        // if (kuafuNpc != ''){
        //     return false;
        // }
        // 去领狗卷
        if (Jianshi.bangzhan){
            if (hours == 12) {
                getGouJuan();
            }
            if (hours == 19) {
                getGouJuan1();
            }
            return false;
        }
        if (stopOnTime) {
            return false;
        }

        // 
        if (hours == 3 || hours == 12 || hours == 15 || hours == 19) {
            hasDoOnece = false;
        }
        if (g_gmain.is_fighting) {
            warnning('战斗中...');
            return;//战斗中
        }
        // 0点 观舞
        if (hours == 0) {
            $('span:contains(你今天试剑次数已达限额)').html('');
            mijingNum = 0;
            qixiaDone = false;
            if (minTime > 30) {
                if (isBigId()) {
                    guanWu();
                }
            } else {
                CheckIn();
            }
        }

        // 5点买药
        if (hours == 5) {
            // closeXueShan();
            if (minTime > 30) {
                if (isBigId()) {
                    CheckInFunc1();
                    vipRiChang();
                }
                maiYao();
            } else {
                if (isSelfId() && Jianshi.tianming == 0) {
                    // 柴绍
                    goAskChaiShao();
                }else{
                    maiYao();
                }
            }
        }
        // 6点 签到
        if (hours == 6) {
            clearAskChaiShao();
            openBangFu();
            CheckIn();
            isDoneXueShan = false;
            hasDoneBangPai4 = false;
            // if (isBigBixue()) {
            //     startTaoFan();
            // }
            Jianshi.jianghuEnd = 0;
            Jianshi.mohuang = 0;
            // if (Base.getCorrectText('4253282')) {
            //     startJianghu();
            // }
        }
        // 7点整理包袱
        if (hours == 7) {
            Jianshi.tianming = 0;
            baoguoZhengliFunc();
        }
        // 8点双修
        if (hours == 8) {
            go('rank go 233;s;s;s;e;ne;event_1_66728795');
        }

        // 10 撩奇侠
        if (hours == 10) {
            Jianshi.sp = 0;
            GetNewQiXiaList(); // 生成奇侠列表
            setTimeout(function () {
                GiveMoneyOnTime();
            }, 5000);
        }
        // 11 试剑
        if (hours == 11) {
            go('home');
            go('swords report go');
            go('swords');
            if ($('#btno3').html() == "试剑") {
                $('#btno3').trigger('click');
            }
        }
        // // 12点 秒突
        // if (hours == 12) {
        //     doOnce(1)
        // }
        // 13 使用令牌打榜
        if (hours == 13) {
            // if (isLittleId() || isSmallId() || isSixId()) {
            //     waKuang();
            // }
            if (isBigBixue()) {
                doOnce('6');    // 令牌 打榜
            }
        }

        // 14点突破
        if (hours == 14) {
            tupoSpeed1();
        }

        // 15点冰月或签到
        if (hours == 15) {
            if (isBigId()) {
                getBingyue();
            }
            skillPritice();
        }

        // 16点 答题
        if (hours == 16) {
            doOnce(4);
        }

        // 17点与奇侠聊天
        if (hours == 17) {
            if (minTime > 30) {
                talkSelectQiXia();
            }
        }

        // 18点领奖励
        if (hours == 18) {
            doReplay();
        }
        // 19点去三树
        if (hours == 19 && isSelfId()) {
            goKillSanShu();
        }

        // 21 回帮派 打坐
        if (hours == 21) {
            // openBangFu();
            if (getWeek() == '3') {
                go('swords get_drop go');   // 领取论剑奖励
            }
            // go('clan scene');
            // if (Base.getCorrectText('7598640')) {
            //     go('clan open_double go');
            //     go('clan open_triple go');
            // }
        }
        // 23点去本10
        if (hours == 23 && isSelfId()) {
            doOnce(2);
        }
        if (hours == 1 || hours == 2 || hours == 3 ) {
            // 钓鱼
            startDiaoYu();
        }
    }

    // 挂机号签到
    function doOnTimeGuaJi() {
        var hours = getHours();
        // var week = getWeek();
        // 6点签到
        if (hours == 6) {
            if (Base.getCorrectText('7905194')) {
                stopTaofanOntime()
            }
            if (Base.getCorrectText('6965572')) {
                openBangFu();
            }
            CheckIn();
        }
        if (hours == '7') {
            if (Base.getCorrectText('7905194')) {
                doTaofanOntime()
            }
        }
        // 19点签到
        if (hours == 19) {
            // if(Base.getCorrectText('6965572')){
            //     go('clan fb go_saodang shenshousenlin');
            // }
            if (Base.getCorrectText('7905194')) {
                stopTaofanOntime()
            }
            CheckIn();
        }
        // 20点签到
        if (hours == 20) {
            if (Base.getCorrectText('7905194')) {
                doTaofanOntime()
            }
        }
        // 21 回帮派 打坐
        if (hours == 21) {
            if (getWeek() == '3') {
                go('swords get_drop go');   // 领取论剑奖励
            }
        }
    }
    function doTaofanOntime() {
        if (Jianshi.qingzhengxie == '1') {
            return;
        } else {
            $('#btnm3').trigger('click');
        }
    }
    function stopTaofanOntime() {
        if (Jianshi.qingzhengxie == '1') {
            $('#btnm3').trigger('click');
        } else {
            return
        }
    }
    // 每天执行一次
    function doOnce(type) {

        if (!hasDoOnece) {
            hasDoOnece = true;
            if (type == '1') {
                // fishingFirstFunc();     // 钓鱼
                tupoSpeed(); // 秒突
            }
            if (type == '2') {
                // killDrunkManFunc();     // 刷碎片
                killBen10();
            }
            if (type == '3') {
                newGetXiaKe();          // 侠客岛
            }
            if (type == '4') {
                $('#btno4').trigger('click')    // 答题
            }
            if (type == '6') {
                doLingPai(); //换取令牌
                doUseLingPai(); //使用令牌
            }
        }

        if (type == '5') {            // 签到
            doReplay();
        }

    }
    // 获取当前时间
    function getHours() {
        var date = new Date();
        var currentdate = date.getHours();
        return currentdate;
    }
    // 获取当前分钟
    function getMin() {
        var date = new Date();
        var currentdate = date.getMinutes();
        return currentdate;
    }
    // 获取当前时间
    function getTimes() {
        var date = new Date();
        return date.toLocaleString();
    }
    function getWeek() {
        var week = new Date().getDay();
        return week;
    }
    function doReplay() {
        $('span:contains(你今天试剑次数已达限额)').html('');
        CheckIn();
    }

    // 技能对象
    var skillsList = [
        // 枪法
        {
            "name": "神龙东来",
            "id": "shenlongdonglai",
            "who": "",
        }, {
            "name": "冰月破魔枪",
            "id": "bingyuepomoqiang",
            "who": "",
        }, {
            "name": "燎原百击",
            "id": "liaoyuanbaiji",
            "who": "",
        }, {
            "name": "九溪断月枪",
            "id": "jxdyq",
            "who": "",
        }, {
            "name": "燎原百破",
            "id": "lybp",
            "who": "",
        },
        // 棍子
        {
            "name": "月夜鬼萧",
            "id": "yueyeguixiao",
            "who": "",
        }, {
            "name": "破军棍诀",
            "id": "pjgj",
            "who": "",
        }, {
            "name": "千影百伤棍",
            "id": "qybsg",
            "who": "",
        }, {
            // new
            "name": "打狗棒法",
            "id": "dagoubangfa",
            "who": "",
        },
        // 锤子
        {
            "name": "玄冥锤子",
            "id": "huimengwuheng",
            "who": "",
        }, {
            "name": "天火飞锤",
            "id": "thfc",
            "who": "",
        },
        // 斧子
        {
            "name": "四海断潮斩",
            "id": "shdcz",
            "who": "",
        }, {
            "name": "昊天破周斧",
            "id": "hypzf",
            "who": "",
        },
        // 剑法
        {
            "name": "覆雨剑法",
            "id": "fuyu-sword",
            "who": "",
        }, {
            "name": "织冰剑法",
            "id": "binggong-jianfa",
            "who": "",
        }, {
            "name": "九天龙吟剑法",
            "id": "jiutian-sword",
            "who": "",
        }, {
            "name": "紫虚辟邪剑",
            "id": "zixubixiejian",
            "who": "",
        }, {
            //new
            "name": "神剑慧芒",
            "id": "shenjianhuimang",
            "who": "",
        }, {
            //new
            "name": "天外飞仙",
            "id": "tianwaifeixian",
            "who": "",
        },
        // 掌法
        {
            "name": "释迦拈花指",
            "id": "shijianianhuazhi",
            "who": "",
        },
        {
            "name": "降龙廿八掌",
            "id": "xianglongnianbazhang",
            "who": "",
        },
        {
            "name": "弹指神通",
            "id": "tanzhishentong",
            "who": "",
        },
        {
            "name": "折花百式",
            "id": "zhehuabaishi",
            "who": "",
        },
        {
            "name": "排云掌",
            "id": "paiyun-zhang",
            "who": "",
        }, {
            "name": "如来神掌",
            "id": "rulai-zhang",
            "who": "",
        }, {
            // new
            "name": "无相六阳掌",
            "id": "wuxiangliuyangzhang",
            "who": "",
        },
        // 刀法
        {
            "name": "翻云刀法",
            "id": "fanyun-blade",
            "who": "",
        }, {
            "name": "雪饮狂刀",
            "id": "xueyin-blade",
            "who": "",
        }, {
            "name": "左手刀法",
            "id": "zuoshoudaofa",
            "who": "",
        }, {
            "name": "移花接玉刀",
            "id": "yihuajieyudao",
            "who": "",
        }, {
            "name": "天刀八诀",
            "id": "tiandaobajue",
            "who": "",
        },
        // 杖法
        {
            "name": "玄天杖法",
            "id": "xtzf",
            "who": "",
        },
        {
            "name": "辉月杖法",
            "id": "hyzf",
            "who": "",
        },
        {
            "name": "十二都天神杖",
            "id": "tianshenzhang",
            "who": "",
        },
        // 鞭法
        {
            "name": "拈花解语鞭",
            "id": "zhjyb",
            "who": "",
        }, {
            "name": "十怒蛟龙索",
            "id": "snjls",
            "who": "",
        }, {
            //new
            "name": "冰玄鞭法",
            "id": "bingxuanbianfa",
            "who": "",
        },
        // 暗器
        {
            "name": "孔雀翎",
            "id": "kongqueling",
            "who": "",
        }, {
            "name": "飞刀绝技",
            "id": "feidao",
            "who": "",
        }, {
            //new
            "name": "子母龙凤环",
            "id": "zimulongfenghuan",
            "who": "",
        }, {
            //new
            "name": "九星定形针",
            "id": "jiuxingdingxingzhen",
            "who": "",
        }, {
            //new
            "name": "九字真言印",
            "id": "jiuzizhenyanyin",
            "who": "",
        },
        // 内功
        {
            "name": "紫血大法",
            "id": "zixuedafa",
            "who": "",
        }, {
            "name": "白首太玄经",
            "id": "baishoutaixuanjing",
            "who": "",
        }, {
            "name": "道种心魔经",
            "id": "dzxinmojing",
            "who": "",
        }, {
            "name": "生生造化功",
            "id": "sszaohuagong",
            "who": "",
        }, {
            "name": "龙象般若功",
            "id": "longxiangbanruogong",
            "who": "",
        }, {
            "name": "九阴逆",
            "id": "jiuyinni",
            "who": "",
        }, {
            "name": "长春不老功",
            "id": "changchunbulaogong",
            "who": "",
        },
        // 轻功
        {
            "name": "万流归一",
            "id": "wanliuguiyi",
            "who": "",
        }, {
            "name": "幽影幻虚步",
            "id": "yyhuanxubu",
            "who": "",
        }, {
            "name": "云梦归月",
            "id": "yunmengguiyue",
            "who": "",
        }, {
            "name": "天魔妙舞",
            "id": "tianmomiaowu",
            "who": "",
        }, {
            "name": "踏月留香",
            "id": "tayueliuxiang",
            "who": "",
        },
        // 练习
        {
            "name": "慈悲刀",
            "id": "cibei-dao",
            "who": "",
        }, {
            "name": "魔叉诀",
            "id": "mo-cha-jue",
            "who": "",
        }, {
            "name": "魔刀诀",
            "id": "mo-dao-jue",
            "who": "",
        }, {
            "name": "回风拂柳剑",
            "id": "fuliu-jian",
            "who": "",
        }, {
            "name": "天山杖法",
            "id": "tianshan-zhang",
            "who": "",
        }, {
            "name": "秋风步法",
            "id": "fall-steps",
            "who": "",
        }, {
            "name": "魔戟诀",
            "id": "mo-ji-jue",
            "who": "",
        }, {
            "name": "天罡指",
            "id": "tiangang-zhi",
            "who": "",
        }, {
            "name": "金顶绵掌",
            "id": "jinding-mianzhang",
            "who": "",
        }, {
            "name": "小步玄剑",
            "id": "mystsword",
            "who": "",
        }, {
            "name": "六阴追魂剑",
            "id": "six-chaos-sword",
            "who": "",
        }
    ];
    //秋风步法 魔戟诀 天罡指 金顶绵掌 小步玄剑 六阴追魂剑
    // 通过名称数组获取id数组
    function getSkillIdArr(arr) {
        var skillsIdArr = [];
        for (var j = 0; j < arr.length; j++) {
            var arr_name = arr[j];
            for (var i = 0; i < skillsList.length; i++) {
                if (skillsList[i].name == arr_name) {
                    skillsIdArr.push(skillsList[i].id);
                }
            }
        }

        return skillsIdArr
    }
    function tupoHuoTui() {
        go('items use obj_huotuizongzi');
    }
    var topoTimes = 0;
    function tupoHuoTui1() {
        topoTimes ++;
        if (topoTimes > 10){
            topoTimes = 0;
            log('已完成10次突破');
        }else{
            tupoSkills2();
            setTimeout(() => {
                go('items use obj_huotuizongzi');
                log('火腿次数' + topoTimes);
                setTimeout(() => {
                    tupoHuoTui1();
                }, 12*1000);
            }, 20 * 1000);
        }
    }
    // 获取人物的技能列表
    function getSkills(practice) {
        var skillsArr = [];
        var msg_skills = g_obj_map.get("msg_skills");
        if (msg_skills) {
            var elements = msg_skills.elements;
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].key.indexOf('skill') > -1) {
                    var val = elements[i].value;
                    if (val) {
                        var valArr = val.split(',');
                        if (practice) {
                            if (valArr[1] && valArr[2] > 250 && valArr[2] < 500 && valArr[4] != 'known' && valArr[4] != 'force') {
                                var skillsname = g_simul_efun.replaceControlCharBlank(
                                    valArr[1].replace(/\u0003.*?\u0003/g, "")
                                );
                                if (skillsname.indexOf('天魔焚身') == -1 && skillsname.indexOf('同归绝剑') == -1) {
                                    skillsArr.push({ 'name': skillsname, 'id': valArr[0] });
                                }
                            }
                        } else {
                            if (valArr[1] && valArr[2] > 250 && valArr[4] != 'known') {
                                var skillsname = g_simul_efun.replaceControlCharBlank(
                                    valArr[1].replace(/\u0003.*?\u0003/g, "")
                                );
                                skillsArr.push({ 'name': skillsname, 'id': valArr[0] });
                            }
                        }
                    }
                }
            }
        }
        return skillsArr;
    }

    // 获取人物的技能列表
    function getYouXia() {
        var arr = [];
        var msg = g_obj_map.get("msg_fudi_juxian");
        if (msg) {
            var elements = msg.elements;
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].key.indexOf('yx') > -1) {
                    var val = elements[i].value;
                    if (val) {
                        var valArr = val.split(',');

                        if (valArr[1] && valArr[4] < 2000 && valArr[4] != 600) {
                            var name = g_simul_efun.replaceControlCharBlank(
                                valArr[1].replace(/\u0003.*?\u0003/g, "")
                            );
                            arr.push({ 'name': name, 'id': valArr[0], leavel: valArr[4] });
                        }
                    }
                }
            }
        }
        return arr;
    }

    function upFuDi() {
        var youxia = getYouXia();
        for (var i = 0; i < youxia.length; i++) {
            if (youxia[i].leavel / 100 > 4) {
                go('fudi juxian upgrade go ' + youxia[i].id + ' 100');
                go('fudi juxian upgrade go ' + youxia[i].id + ' 100');
                go('fudi juxian upgrade go ' + youxia[i].id + ' 100');
                go('fudi juxian upgrade go ' + youxia[i].id + ' 100');
                go('fudi juxian upgrade go ' + youxia[i].id + ' 100');
            } else {
                var dev = parseInt(5 - youxia[i].leavel / 100);
                for (var j = 0; j < dev; j++) {
                    go('fudi juxian upgrade go ' + youxia[i].id + ' 100');
                }
            }
        }
    }

    // 获取人物的技能列表
    function getChuoMoSkills() {
        var skillsArr = [];
        var msg_skills = g_obj_map.get("msg_skills");
        if (msg_skills) {
            var elements = msg_skills.elements;
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].key.indexOf('skill') > -1) {
                    var val = elements[i].value;
                    if (val) {
                        var valArr = val.split(',');
                        if (valArr[1] && valArr[2] >= 500 && valArr[2] < 600 && valArr[4] != 'known' && valArr[4] != 'force') {
                            var skillsname = g_simul_efun.replaceControlCharBlank(
                                valArr[1].replace(/\u0003.*?\u0003/g, "")
                            );
                            skillsArr.push({ 'name': skillsname, 'id': valArr[0], 'num': valArr[2] });
                        }
                    }
                }
            }
        }
        return skillsArr;
    }
    // 获取突破技能列表
    function getCanTupoSkills(sk_list, practice) {
        if (!sk_list) {
            sk_list = skillsList;
        }
        var mySkills = getSkills(practice);
        var willDoSkills = [];
        for (var i = 0; i < sk_list.length; i++) {
            var skillsName = sk_list[i].name || sk_list[i];

            for (var j = 0; j < mySkills.length; j++) {
                var mySkillsName = mySkills[j].name;
                if (mySkillsName.indexOf(skillsName) > -1) {
                    willDoSkills.push(mySkills[j]);
                }
            }

        }
        var arr1 = [...willDoSkills, ...mySkills];
        var newArr = [...new Set(arr1)];

        if (practice) {
            return newArr;
        }
        return willDoSkills
    }

    function chuoMoSkills() {
        if (g_gmain.is_fighting) {
            warnning('战斗中禁止揣磨');
            return;//战斗中
        }
        clickButton('skills');
        setTimeout(() => {
            var mySkills = getChuoMoSkills();
            if (mySkills.length === 0) {
                return false;
            }
            for (var i = 0; i < mySkills.length; i++) {
                var id = mySkills[i].id;
                if (id) {
                    go('enable ' + id);
                    var forNum = 600 - mySkills[i].num;
                    for (var j = 0; j < forNum; j++) {
                        go('chuaimo go,' + id);
                    }
                }
            }
        }, 2000);
    }

    // 突破技能
    function TuPoMySkills(sk_list, type) {
        if (g_gmain.is_fighting) {
            warnning('战斗中禁止突破');
            return;//战斗中
        }
        var skills = getCanTupoSkills(sk_list);

        var skillsNameArr = [];
        if (type == '1') {
            var dom = $('#out').text();
            // 6个突破+ 舍利
            if (dom.indexOf('突破中') > 0) {
                warnning('正在突破中...暂时不能新突破技能');
                return false;
            }
            for (var i = 0; i < skills.length; i++) {
                var id = skills[i].id;
                if (id) {
                    go('enable ' + id);
                    go('tupo go,' + id);
                    go('tupo_speedup4_1 ' + id + ' go');
                    skillsNameArr.push(skills[i].name);
                }
            }

        } else if (type == '2') {
            var dom = $('#out').text();
            // 单突破
            for (var i = 0; i < skills.length; i++) {
                var id = skills[i].id;
                if (id) {
                    go('enable ' + id);
                    go('tupo go,' + id);
                    skillsNameArr.push(skills[i].name);
                }
            }
        } else {
            var dom = $('#out').text();
            if (dom.indexOf('突破中') > 0) {
                warnning('正在突破中...暂时不能新突破技能');
                return false;
            }
            // 突破加超突 + 丸子
            for (var i = 0; i < skills.length; i++) {
                var id = skills[i].id;
                if (id) {
                    go('enable ' + id);
                    go('tupo go,' + id);
                    go('tupo_speedup3 ' + id + ' go');
                    go('tupo_speedup3_1 ' + id + ' go');
                    skillsNameArr.push(skills[i].name);
                }
            }
        }

        go('enable mapped_skills restore go 1');
        var logtext = '当前突破技能列表：' + skillsNameArr.join('、');
        if (skillsNameArr.length == 0) {
            logtext = '暂无可突破技能';
            warnning(logtext);
            return;
        }
        log(logtext);
    }
    //tupoSpeed
    function tupoSpeed() {
        clickButton('skills');
        go('items put_store tianlongsi_jingangsheli');
        // go('items put_store obj_tongtianwan');
        go('items get_store /obj/shop/tongtianwan');
        go('items get_store /obj/shop/tupo_jiasuka3');
        // go('items get_store /map/tianlongsi/obj/jingangsheli');
        // var selfTopoText = '移花接玉刀,云梦归月,左手刀法,天魔妙舞,折花百式,紫虚辟邪剑,九阴逆,紫血大法,白首太玄经,龙象般若功,降龙廿八掌,弹指神通,天刀八诀,长春不老功,释迦拈花指';
        var selfTopoText = '无剑之剑,同归绝剑,上元先天功,天罡北斗阵,天极剑,披罗紫气,火贪一刀,天雷落,天魔策,凤舞九天,小李飞刀,踏月留香,朝天一棍,九幽棍魔,温候戟舞,天魔场,天魔焚身,日月鞭法,真武七截阵,太极神拳,纯阳无极功,菩萨回生咒,护身斗法符,天音摄魂针,总诀式,高山流水,擒龙功,此彼还施,曼华清音,浣花七诀,天外飞仙,天刀八诀,九星定形针,九字真言印,飞鸿鞭法,紫虚辟邪剑,神剑慧芒,不凡三剑,左手刀法,移花接玉刀,释迦拈花指,降龙廿八掌,弹指神通,折花百式,九阴逆,长春不老功,云梦归月,天魔妙舞,紫血大法,白首太玄经,龙象般若功,降魔杖法,神龙东来,冰月破魔枪,燎原百击,月夜鬼萧,冰玄鞭法,打狗棒法,无相六阳掌';
        var topoArr = selfTopoText.split(',');
        // var idArr = getSkillIdArr(topoArr);
        setTimeout(function () {
            TuPoMySkills(topoArr);
            // var dom = $('#out').text();
            // if (dom.indexOf('突破中') > 0) {
            //     console.log('正在突破中...');
            //     return false;
            // }
            // for (var i = 0; i < idArr.length; i++) {
            //     var id = idArr[i];
            //     go('enable ' + id);
            //     go('tupo go,' + id);
            //     go('tupo_speedup3 ' + id + ' go');
            //     go('tupo_speedup3_1 ' + id + ' go');
            // }
            // go('enable mapped_skills restore go 1');
        }, 2000);
    }
    //tupoSpeed
    function tupoSpeed1() {
        clickButton('skills');
        go('items put_store obj_tongtianwan');
        go('items get_store /map/tianlongsi/obj/jingangsheli');

        // go('items put_store tianlongsi_jingangsheli');
        // go('items get_store /obj/shop/tongtianwan');
        var selfTopoText = '无剑之剑,同归绝剑,上元先天功,天罡北斗阵,天极剑,披罗紫气,火贪一刀,天雷落,天魔策,凤舞九天,小李飞刀,踏月留香,朝天一棍,九幽棍魔,温候戟舞,天魔场,天魔焚身,日月鞭法,真武七截阵,太极神拳,纯阳无极功,菩萨回生咒,护身斗法符,天音摄魂针,总诀式,高山流水,擒龙功,此彼还施,曼华清音,浣花七诀,天外飞仙,天刀八诀,九星定形针,九字真言印,飞鸿鞭法,紫虚辟邪剑,神剑慧芒,不凡三剑,左手刀法,移花接玉刀,释迦拈花指,降龙廿八掌,弹指神通,折花百式,九阴逆,长春不老功,云梦归月,天魔妙舞,紫血大法,白首太玄经,龙象般若功,降魔杖法,神龙东来,冰月破魔枪,燎原百击,月夜鬼萧,冰玄鞭法,打狗棒法,无相六阳掌';
        var topoArr = selfTopoText.split(',');
        // var idArr = getSkillIdArr(topoArr);
        setTimeout(function () {
            TuPoMySkills(topoArr, 1);
        }, 2000);
        // for (var i = 0; i < 4; i++) {
        //     var id = idArr[i];
        //     go('enable ' + id);
        //     go('tupo go,' + id);
        //     go('tupo_speedup4_1 ' + id + ' go');
        // }
        // go('enable mapped_skills restore go 1');
    }
    // 突破技能列表
    //移花接玉刀、左手刀法、天魔妙舞、天刀八诀、弹指神通和折花百式
    function tupoSkills2() {
        clickButton('skills');
        if (Base.getCorrectText('4253282')) {
            topoText = '日月鞭法,纯阳无极功,菩萨回生咒,护身斗法符';
        }
        var topoArr = topoText.split(',');
        // var idArr = getSkillIdArr(topoArr);
        // console.log(idArr);
        setTimeout(function () {
            TuPoMySkills(topoArr, 2);
        }, 2000);

        //clickButton('enable taosword', 1) // 准备技能
        //clickButton('tupo go,taosword', 1) // 突破技能
        //clickButton('tupo go,xueyin-blade', 1) // 突破秘术
        //clickButton('tupo go,binggong-jianfa', 1) // 高级突破秘术
        //clickButton('tupo go,lingshe-zhangfa', 1) // 超级突破秘术
        //clickButton('tupo_speedup3 bingyuepomoqiang go', 1) 超突卡
        //clickButton('tupo_speedup3_1 bingyuepomoqiang go', 1) 通天
        //clickButton('tupo_speedup4_1 baishoutaixuanjing go', 1) 舍利
        //clickButton('practice taosword', 1) // 练习技能
        //clickButton('enable mapped_skills restore go 1', 1) // 导出技能配置1
    }

    //练习技能
    function skillPritice() {
        if (g_gmain.is_fighting) {
            warnning('战斗中禁止练习');
            return;//战斗中
        }
        clickButton('skills');
        var selfTopoText = '秋风步法,魔刀决,回风拂柳剑,六阴追魂剑,小步玄剑,天罡指,金顶绵掌,逍遥掌,同归剑法,天山杖法,无常杖法,魔戟诀,一指禅,火蝠身法,轻烟飘渺掌,鹰爪擒拿手,魔钩诀,伏魔剑,养心拳,混元掌,罗汉拳,普渡杖法,风云手,韦陀棍,修罗刀';
        var topoArr = selfTopoText.split(',');

        // var idArr = getSkillIdArr(topoArr);
        setTimeout(function () {
            var dom = $('#out').text();
            if (dom.indexOf('练习中') > 0) {
                warnning('正在练习中...');
                return false;
            }
            var skills = getCanTupoSkills(topoArr, 1);
            // 单练习
            if (skills.length > 0) {
                var id = skills[0].id;
                if (id) {
                    go('enable ' + id);
                    go('practice ' + id);
                }
            }
            go('enable mapped_skills restore go 1');
            var logtext = '';
            if (skills.length == 0) {
                logtext = '暂无可练习技能';
                warnning(logtext);
                return;
            } else {
                logtext = '当前练习技能：' + skills[0].name
            }
            log(logtext);
        }, 2000);
    }

    function baiu() {
        var _hmt = _hmt || [];
        (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?abcbaab681a05e1245b8357c01172a94";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    }

    function openBangFu() {
        if (Base.getCorrectText('4253282') || Base.getCorrectText('4259178') || Base.getCorrectText('6965572') || Base.getCorrectText('7598640')) {
            go('home');
            go('clan fb open shenshousenlin');
            go('clan fb open daxuemangongdao');
            go('clan fb open longwulianmoge');
            openBangSuiPian();
        }
    }
    function openBangSuiPian() {
        go('clan bzmt cancel go');
        go('clan bzmt select go 1');
    }
    function isLittleId() {
        var littleIdArr = ['4316804', '4240258', '4316804', '4259178', '4254240', '6759436', '6759488', '6759498', '6759458', '6759492', '6759497', '7245058', '7245076', '7245061', '7245031', '7245082', '7245153', '7245033', '7245124', '7245468', '7245483'];
        var isLittle = false;
        for (var i = 0; i < littleIdArr.length; i++) {
            if (Base.getCorrectText(littleIdArr[i])) {
                isLittle = true;
                return true;
            }
        }
        return isLittle;
    }
    function isSmallId() {
        var littleIdArr = ['7245058', '7245076', '7245061', '7245031', '7245082', '7245153', '7245033', '7245124', '7245468', '7245483'];
        var isLittle = false;
        for (var i = 0; i < littleIdArr.length; i++) {
            if (Base.getCorrectText(littleIdArr[i])) {
                isLittle = true;
                return true;
            }
        }
        return isLittle;
    }
    function isSixId() {
        var littleIdArr = ['6759436', '6759488', '6759498', '6759458', '6759492', '6759497', '7905194'];
        var isLittle = false;
        for (var i = 0; i < littleIdArr.length; i++) {
            if (Base.getCorrectText(littleIdArr[i])) {
                isLittle = true;
                return true;
            }
        }
        return isLittle;
    }
    function isBigId() {
        var bigIdArr = ['4253282', '4238943', '4240258', '3594649', '4219507', '4213224', '4253282', '7030223', '7894304'];
        var isBig = false;
        for (var i = 0; i < bigIdArr.length; i++) {
            if (Base.getCorrectText(bigIdArr[i])) {
                isBig = true;
                return true;
            }
        }
        return isBig;
    }

    function isQQJianKong() {
        var bigIdArr = ['4253282'];
        var isBig = false;
        for (var i = 0; i < bigIdArr.length; i++) {
            if (Base.getCorrectText(bigIdArr[i])) {
                isBig = true;
                return true;
            }
        }
        return isBig;
    }

    function isBigBixue() {
        var bigIdArr = ['4219507', '7030223', '7894304', '4253282'];
        var isBig = false;
        for (var i = 0; i < bigIdArr.length; i++) {
            if (Base.getCorrectText(bigIdArr[i])) {
                isBig = true;
                return true;
            }
        }
        return isBig;
    }

    function isBangPaiStore() {
        var bigIdArr = ['4316804', '4238943', '4219507', '5515016'];
        var isBig = false;
        for (var i = 0; i < bigIdArr.length; i++) {
            if (Base.getCorrectText(bigIdArr[i])) {
                isBig = true;
                return true;
            }
        }
        return isBig;
    }

    function isSelfId() {
        var bigIdArr = ['4253282'];
        var isBig = false;
        for (var i = 0; i < bigIdArr.length; i++) {
            if (Base.getCorrectText(bigIdArr[i])) {
                isBig = true;
                return true;
            }
        }
        return isBig;
    }
    function isBigQiamlong() {
        var bigIdArr = ['4253282', '4255266', '7018334'];
        var isBig = false;
        for (var i = 0; i < bigIdArr.length; i++) {
            if (Base.getCorrectText(bigIdArr[i])) {
                isBig = true;
                return true;
            }
        }
        return isBig;
    }
    function isBadBoy() {
        var bigIdArr = ['7030223', '7894304', '4219507'];
        var isBig = false;
        for (var i = 0; i < bigIdArr.length; i++) {
            if (Base.getCorrectText(bigIdArr[i])) {
                isBig = true;
                return true;
            }
        }
        return isBig;
    }
    function isQianlongId() {
        var idMap = { "4247985": "司空", "4004413": "御剑飞行", "4219507": "老王家的", "4228120": "小锦鲤", "4247470": "曲无心[38区]", "4253282": "挑灯夜战", "4255266": "地府-秦广王", "4257225": "时麟[38区]", "4260402": "通天剑帝", "7018334": "何为江湖", "7030223": "王佬的跟班[37区]", "7828780": "攻城狮", "7894304": "碧血染银枪[37区]" };
        var bigIdArr = [];
        for (var i in idMap) {
            bigIdArr.push(i);
        }
        var isBig = false;
        for (var i = 0; i < bigIdArr.length; i++) {
            if (Base.getCorrectText(bigIdArr[i])) {
                isBig = true;
                return true;
            }
        }
        return isBig;
    }

    function isGuaJiId() {
        var bigIdArr = ['6965572', '6984251'];
        var isBig = false;
        for (var i = 0; i < bigIdArr.length; i++) {
            if (Base.getCorrectText(bigIdArr[i])) {
                isBig = true;
                return true;
            }
        }
        return isBig;
    }

    function isVip() {
        var bigIdArr = ['3594649', '4219507', '4238943', '4240258', '4253282', '4316804', '4581683', '5515016', '7894304', '7030223'];
        var isBig = false;
        for (var i = 0; i < bigIdArr.length; i++) {
            if (Base.getCorrectText(bigIdArr[i])) {
                isBig = true;
                return true;
            }
        }
        return isBig;
    }

    function GiveMoneyOnTime() {
        // o18
        var btn = $('#btno18');
        btn.trigger('click');
    }
    function AskOnTime() {
        // o23
        var btn = $('#btno23');
        btn.trigger('click');
    }
    // Your code here...

    //去位置
    function getKuaPlace(txt) {
        var step = getPlace2(txt);
        findKuaTaoFan(step);
    };
    // 找打坏人
    async function findKuaTaoFan(step) {
        await goTaoFanPlace(step);
        await new Promise(function (resolve) {
            setTimeout(resolve, 6000);
        });
        // goNpcPlace(taoPlaceStep);
        // javascript:clickButton('golook_room');
        var btn = $('.cmd_click3');
        idArr = [];
        badNameArr = [kuafuNpc + '段老大', '厉工', '蒙赤行', '胡铁花', '石幽明', '段老大', '二娘', '岳老三', '云老四', '剧盗', '恶棍', '流寇'];
        if (!killBadSwitch) {
            badNameArr = [kuafuNpc + '无一', '令东来', '传鹰', '无花', '追命', '无一', '铁二', '追三', '冷四', '黄衣捕快', '红衣捕快', '锦衣捕快'];
        }

        for (var j = 0; j < badNameArr.length; j++) {
            var badName = badNameArr[j];

            for (var i = 0; i <= btn.length; i++) {
                var txt = btn.eq(i).text();
                if (txt.indexOf(badName) > -1) {
                    bad_target_name = txt;
                    var npcText = null;
                    npcText = btn.eq(i).attr('onclick');
                    var id = getId(npcText);
                    idArr.push(id);
                }
            }
        }
        console.log(idArr);
        if (idArr.length > 0) {
            setTimeout(function () {
                doKillTaoFan(idArr);
            }, 2000);
        }
    };
    //

    function getPlace2(txt) {
        var _place = null;
        var PLACE = ['雪亭镇', '洛阳', '华山村', '华山', '扬州', '丐帮', '乔阴县', '峨眉山', '恒山', '武当山', '晚月庄', '水烟阁', '少林寺', '唐门', '青城山', '逍遥林', '开封', '光明顶', '全真教', '古墓', '白驼山', '嵩山', '梅庄', '泰山', '铁血大旗门', '大昭寺'];
        // var place = ['饮风客栈','龙门石窟','华山村村口','华山山脚','安定门','树洞内部','乔阴县城北门','十二盘','大字岭','林中小路','竹林','青石官道','丛林山径','蜀道','北郊','青石大道','朱雀门','小村','终南山路','山路','戈壁','太室阙','柳树林','岱宗坊','小路']
        // $.each(place,function(n,v){
        //     if(txt.indexOf(v) != '-1'){
        //         _place = PLACE[n];
        //         _place = n;
        //         return false;
        //     }
        // })
        $.each(PLACE, function (n, v) {
            if (txt.indexOf(v) != '-1') {
                _place = n;
                return false;
            }
        });
        if (_place != null) {
            _place++;
        }
        return _place;
    }


    function bindKey() {
        console.log(getTimes() + '欢迎使用游戏助手!\nwsad表示上下左右\nq左上，z左下，e右上，右下c');
        $(document).keydown(function (e) {
            if (e) {
                switch (e.keyCode) {
                    case 87: clickButton('go north', 0); break;  //上w
                    case 83: clickButton('go south', 0); break; //下s
                    case 65: clickButton('go west', 0); break; //左a
                    case 68: clickButton('go east', 0); break; //右d

                    case 81: clickButton('go northwest', 0); break; //左上q
                    case 69: clickButton('go northeast', 0); break; //左下z
                    case 90: clickButton('go southwest', 0); break; //右上e
                    case 67: clickButton('go southeast', 0); break; //右下c clickButton('home', 1)

                    // case 13:clickButton('home', 1);break;//回主页


                    // case 49:clickButton('jh 1', 0);break;//直接进入第1章
                    // case 50:clickButton('jh 2', 0);break;//2
                    // case 51:clickButton('jh 3', 0);break;//3
                    // case 52:clickButton('jh 4', 0);break;//4
                    // case 53:clickButton('jh 5', 0);break;//5
                    // case 54:clickButton('jh 6', 0);break;//6
                    // case 55:clickButton('jh 7', 0);break;//7
                    // case 56:clickButton('jh 8', 0);break;//8
                    // case 57:clickButton('jh 9', 0);break;//9
                    // case 48:clickButton('jh 10', 0);break;//9

                    // case 107:clickButton('items', 0);break;// 小键盘+号 打开背包
                    // case 109:clickButton('score_info', 0);break;//小键盘-号 打开江湖属性
                    // case 106:clickButton('score_base', 0);break;//小键盘*号 打开人物属性
                }
            }
        });
    }

    //          0                 2        3        4                                            9        10
    var jiwuPlaceName = ['麒麟宫', '苍鹰宫', '白虎宫', '金狮宫', '凤凰宫', '银豹宫', '云兽宫', '赤龙宫', '玄武宫', '朱雀宫', '荒狼宫', '神猿宫'];
    var correctPlace = "正厅";
    window.step = 0;
    var jiwuInter = null;
    function killFirstJiWu() {
        var msg = '十二宫顺序是：' + jiwuPlaceName.join(',') + '请到十二宫正厅再点击开始\n没有准备好就点取消！';

        if (confirm(msg) === true) {
            console.log("开始打十二宫");
            goJiWuPlaceWarp();
        } else {
            return false;
        }
    }
    function goCorrectJiWuPlace() {
        clearInterval(jiwuInter);
        jiwuInter = setInterval(function () {
            getJiWuInfo();
        }, 1000);
    }
    function goJiWuPlaceWarp() {
        clearInterval(jiwuInter);
        if (isCorrectJiWuPlace()) {
            // 杀
            killJiwuGong();
        } else if (inZhengTing()) {
            gojiwuPlace();
        } else {
            goZhengTing();
            setTimeout(function () {
                gojiwuPlace();
            }, 4000);

            setTimeout(function () {
                if (isCorrectJiWuPlace()) {
                    killJiwuGong();
                }
            }, 8000);
        }
    }
    // 杀十二宫BOSS
    function killJiwuGong() {
        var step = window.step;
        console.log(getTimes() + '杀' + jiwuPlaceName[step]);
        switch (step) {
            case '0':
                clickButton('kill jiwutan_tianhai', 1);
                break;
            case '1':
                clickButton('kill jiwutan_kunpeng', 1);
                break;
            case '2':
                clickButton('kill jiwutan_xuetong', 1);
                break;
            case '3':
                clickButton('kill jiwutan_zuifa', 1);
                break;
            case '4':
                clickButton('kill jiwutan_jinxi', 1);
                break;
            case '5':
                clickButton('kill jiwutan_yinbao', 1);
                break;
            case '6':
                clickButton('kill jiwutan_shouxu', 1);
                break;
            case '7':
                clickButton('kill jiwutan_xiaori', 1);
                break;
            case '8':
                clickButton('kill jiwutan_diehun', 1);
                break;
            case '9':
                clickButton('kill jiwutan_huokuang', 1);
                break;
            case '10':
                clickButton('kill jiwutan_dianxing', 1);
                break;
            case '11':
                clickButton('kill jiwutan_daoxing', 1);
                break;
        }
        goCorrectJiWuPlace();
    }
    function isCorrectJiWuPlace() {
        var step = window.step;
        var placeName = jiwuPlaceName[step];
        var roomName = $('#out .outtitle').text();
        if (roomName == placeName) {
            return true;
        }
        return false;
    }
    // 去正厅
    function goZhengTing() {
        if (inJiWuArr()) {
            goPlaceBtnClick('甬道');
            setTimeout(function () {
                goPlaceBtnClick('正厅');
            }, 1000);
        } else {
            goPlaceBtnClick('正厅');
        }
    }

    // 位置点击
    function goPlaceBtnClick(placeName) {
        var btn = $('#out button');

        btn.each(function () {
            var btnName = $(this).text();
            if (btnName == placeName) {
                $(this).trigger('click');
            }
        });
    }

    // 去十二宫里
    function gojiwuPlace() {
        var step = window.step;
        if (step == '0' || step == '2' || step == '3' || step == '4' || step == '9' || step == '10') {
            go('nw');
        } else {
            go('ne');
        }

        setTimeout(function () {
            goJiWuPlace();
        }, 1000);
    }

    function goJiWuPlace() {
        var placeName = jiwuPlaceName[step];;
        var btn = $('#out button');

        btn.each(function () {
            var btnName = $(this).text();
            if (btnName == placeName) {
                $(this).trigger('click');
            }
        });
    }

    // 当前位置是否是12宫中
    function inJiWuArr() {
        var roomName = $('#out .outtitle').text();
        if ($.inArray(roomName, jiwuPlaceName) != '-1') {
            return true;
        }
        return false;
    }

    // 是否在正厅
    function inZhengTing() {
        var roomName = $('#out .outtitle').text();
        var roomName1 = "正厅";
        if (roomName == roomName1) {
            return true;
        }
        return false;
    }

    // 获取十二宫面板信息
    function getJiWuInfo() {
        var out = $('#out2 .out2');
        out.each(function () {
            if ($(this).hasClass('done12')) {
                return;
            }
            $(this).addClass('done12');
            var txt = $(this).text();
            var hasName = false;
            var npcName = '极武坛十二宫主';
            if (txt.indexOf(npcName) != '-1') {
                window.step = $.trim(txt.split(':')[1].split('/')[0]);
                clickButton('golook_room');
                if (window.step >= 12) {
                    console.log(getTimes() + '已经打完十二宫主');
                    clearInterval(jiwuInter);
                } else {
                    setTimeout(function () {
                        goJiWuPlaceWarp();
                    }, 2000);
                }
            }

        });
    }
    //
    var killGoodSetInterval = null;
    function killGoodNpc(e) {
        var player = ['任侠', '暗刺', '金刀', '追命', '无花', '传鹰', '令东来', '西门吹雪', '石之轩', '朱大天王', '楚昭南', '阿青', '楚留香', '天山童姥', '乾罗', '令狐冲', '乔峰', '浪翻云', '三少爷', '花无缺', '云梦璃', '无『双』公主', '守楼虎将', '天剑真身', '王铁匠', '杨掌柜', '柳绘心', '客商', '卖花姑娘', '刘守财', '柳小花', '朱老伯', '方寡妇', '方老板'];

        var Dom = $(e.target);
        var DomTxt = Dom.html();

        clearInterval(killGoodSetInterval);

        if (DomTxt == '杀好人') {
            killGoodSetInterval = setInterval(function () {
                killSet(player);
            }, 400);
            console.log(getTimes() + '开始杀好人');
            Dom.html('取消杀好人');
        } else {
            clearInterval(killGoodSetInterval);
            killGoodSetInterval = null;
            Dom.html('杀好人');
            console.log(getTimes() + '停止杀好人');
        }
    }
    //
    var killBadSetInterval = null;
    function killBadNpc(e) {
        var player = ['石幽明', '胡铁花', '蒙赤行', '厉工', '叶孤城', '祝玉妍', '萧秋水', '凌未风', '白猿', '石观音', '李秋水', '方夜羽', '东方不败', '慕容博', '庞斑', '燕十三', '小鱼儿', '夜魔', '不『二』剑客', '攻楼死士', '天魔真身', '段老大', '二娘', '岳老三', '云老四', '剧盗', '恶棍', '流寇'];

        var Dom = $(e.target);
        var DomTxt = Dom.html();
        clearInterval(killBadSetInterval);

        if (DomTxt == '杀坏人') {
            killBadSetInterval = setInterval(function () {
                killSet(player);
            }, 400);
            console.log(getTimes() + '开始杀坏人');
            Dom.html('取消杀坏人');
        } else {
            clearInterval(killBadSetInterval);
            killBadSetInterval = null;
            Dom.html('杀坏人');
            console.log(getTimes() + '停止杀坏人');
        }
    }

    // 本10
    function killBen10(){
        go('fb 8');
        setTimeout(() => {
            goPlaceAndFight("fb 10;event_1_31980331;fb 10;event_1_23348240;fb 10;event_1_84015482;fb 10;event_1_25800358;event_1_24864938;fb 10;event_1_84015482;event_1_5916858;event_1_5376728;event_1_43541317;event_1_5914414");
        }, 1000);
    }

    var killSomeOneSetInterval = null;
    var killSomeOneName = '';
    var killOneName = '';
    function killSomeOne(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '杀指定') {
            if (killSomeOneName != '') {
                killSomeOneSetInterval = setInterval(function () {
                    killSet([killSomeOneName]);
                }, 300)
            } else {
                killOneName = prompt("请输入要杀的人", "");
                if (!killOneName || killOneName == '') {
                    return
                }
                killSomeOneSetInterval = setInterval(function () {
                    killSet([killOneName]);
                }, 300)
            }
            Dom.html('取消指定')
        } else {
            clearInterval(killSomeOneSetInterval);
            killSomeOneName = '';
            killOneName = '';
            Dom.html('杀指定')
        }
    }
    // 杀指定目标
    function killSet(player) {
        if ($('.cmd_skill_button').length > 0) {
            if (killGoodSetInterval) {
                clearInterval(killGoodSetInterval);
            }
            return false;
        }
        var btn = $('.cmd_click3');
        var idArr = [];
        var isSamePlayer = false;
        for (var i = 0; i < player.length; i++) {
            var Qname = player[i];
            for (var j = 0; j < btn.length; j++) {
                var txt = btn.eq(j).text();
                if (txt == Qname) {
                    var npcText = btn.eq(j).attr('onclick');
                    if (npcText.indexOf('score') >= 0) break;
                    var id = getId(npcText);
                    idArr.push(id);
                    if (player == '任侠' || player == '金刀客' || player == '暗刺客') {
                        isSamePlayer = true;
                    }
                    break;
                }
            }
        }

        var maxId = idArr[0];
        if (idArr.length > 1 && isSamePlayer && killBadSwitch) {
            maxId = idArr[1];
        }
        if (maxId) {
            killE(maxId);
        } else {
            stopOnTime = false;
        }
    }

    // 新奇侠

    var QXretried = 0;
    var QXStop = 0;
    var QXTalkcounter = 1;
    var QxTalking = 0;
    function GetQXID(name, QXindex) {
        if (QXStop == 1 && qinmiFinished == 1) {
            return;
        } else if (g_obj_map.get("msg_room") == undefined || QXStop == 1) {
            setTimeout(function () { GetQXID(name, QXindex); }, 500);
        } else {
            console.log("开始寻找" + name + QXindex);
            var QX_ID = "";
            var npcindex = 0;
            var els = g_obj_map.get("msg_room").elements;
            for (var i = els.length - 1; i >= 0; i--) {
                if (els[i].key.indexOf("npc") > -1) {
                    if (els[i].value.indexOf(",") > -1) {
                        var elsitem_ar = els[i].value.split(',');
                        if (elsitem_ar.length > 1 && elsitem_ar[1] == name) {
                            console.log(elsitem_ar[0]);
                            npcindex = els[i].key;
                            QX_ID = elsitem_ar[0];
                        }
                    }
                }
            }
            if (QX_ID == null || QX_ID == undefined || QX_ID == 0) {
                clickButton('find_task_road qixia ' + QXindex);
                setTimeout(function () { GetQXID(name, QXindex); }, 500);
            } else {
                console.log("找到奇侠编号" + QX_ID);
                if (QXTalkcounter <= 5) {
                    // console.log("开始与"+name+"第"+QXTalkcounter+"对话")
                    QXTalkcounter++;
                    clickButton('ask ' + QX_ID);
                    clickButton('find_task_road qixia ' + QXindex);
                    setTimeout(function () { GetQXID(name, QXindex) }, 500);
                    if (QXindex == finallist[finallist.length - 1].index && QXTalkcounter == 5) {
                        setTimeout(function () {
                            goeasyGetZhu();
                        }, 6000)
                    }
                } else if (QXTalkcounter > 5) {
                    QXTalkcounter = 1;
                    console.log("与" + name + "对话完成");
                    QixiaTotalCounter++;
                    if (QixiaTotalCounter > 25) {

                        console.log("今日奇侠已经完成");
                    } else {
                        console.log("下一个目标是" + finallist[QixiaTotalCounter]["name"]);
                    }
                    talktoQixia();
                }
            }
        }
    }
    var QixiaTotalCounter = 0;
    function TalkQXBase(name, QXindex) {
        var QX_NAME = name;
        console.log("开始撩" + QX_NAME + "！");
        if (g_obj_map.get("msg_room") != undefined)
            g_obj_map.get("msg_room").clear();
        go('find_task_road qixia ' + QXindex);
        go('golook_room');
        setTimeout(function () { GetQXID(QX_NAME, QXindex); }, 500);
    }

    var currentTime = 0;
    var delta_Time = 2000;
    var QXStop = 0;
    var qinmiFinished = 0;
    var QiXiaList = [], finallist = [];
    function QXWhisper() {
        this.dispatchMessage = function (b) {
            var type = b.get("type"), subtype = b.get("subType");
            if (type == "notice") {
                var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
                if (msg.match("对你悄声道") != null) {
                    QXStop = 1;
                    // console.log(msg);
                    QiXiaTalkButton.innerText = '继续奇侠';
                }
                // console.log(msg);
            } else if (type == "main_msg") {
                var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
                if (msg.match("今日亲密度操作次数") != null) {
                    var qinmi = parseInt(msg.split("(")[1].split("/")[0]);
                    if (qinmi == 20) {
                        QXStop = 1;
                        qinmiFinished = 1;
                        // console.log("今日亲密度操作已经达到20，奇侠功能暂停。再次使用请重新点击开始领取果子。");
                        QXTalking = 0;
                    }
                }
            }
        }
    }
    var whipser = new QXWhisper;
    var easyGetZhu = [];
    async function GetQiXiaList() {
        var html = g_obj_map.get("msg_html_page");
        QxTalking = 1;
        if (html == undefined) {
            setTimeout(function () { GetQiXiaList(); }, 500);
        } else if (g_obj_map.get("msg_html_page").get("msg").match("江湖奇侠成长信息") == null) {
            setTimeout(function () { GetQiXiaList(); }, 500);
        } else {
            var returnArr = await setEasyZhu();
            console.log(returnArr);
            if (returnArr.length >= 25) {
                console.log('直接领取朱果');
                goeasyGetZhu();
            } else {
                console.log('奇侠开始排序');
                QiXiaList = formatQx(g_obj_map.get("msg_html_page").get("msg"));
                SortQiXia();
            }
        }
    };
    var easyGetZhu = [];
    function setEasyZhu() {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var zhuGuoLink = $('.out table').find('a:contains(朱果)');
                for (var i = 0; i < zhuGuoLink.length; i++) {
                    var zhuguoHref = zhuGuoLink[i].href;
                    var clickFn = zhuguoHref.split("'")[1];
                    easyGetZhu.push(clickFn);
                }
                resolve(easyGetZhu);
            }, 5000);
        })
    }
    function SortQiXia() {//冒泡法排序
        var temp = {};
        var temparray = [];
        var newarray = [];
        for (var i = 0; i < QiXiaList.length; i++) {
            for (var j = 1; j < QiXiaList.length - i; j++) {
                if (parseInt(QiXiaList[j - 1]["degree"]) < parseInt(QiXiaList[j]["degree"])) {
                    temp = QiXiaList[j - 1];
                    QiXiaList[j - 1] = QiXiaList[j];
                    QiXiaList[j] = temp;
                }
            }
        }
        var tempcounter = 0;
        // console.log("奇侠好感度排序如下:");
        // console.log(QiXiaList);
        //首次排序结束 目前是按照由小到大排序。现在需要找出所有的超过25000 小于30000的奇侠。找到后 排序到最上面；
        for (var i = 0; i < QiXiaList.length; i++) {
            if (parseInt(QiXiaList[i]["degree"]) >= 25000 && parseInt(QiXiaList[i]["degree"]) < 30000) {
                temparray[tempcounter] = QiXiaList[i];
                tempcounter++;
                newarray.push(i);
            }
        }
        // console.log("提取满朱果好感度排序如下:");
        for (var i = 0; i < QiXiaList.length; i++) {
            if (newarray.indexOf(i) == -1) {
                temparray[tempcounter] = QiXiaList[i];
                tempcounter++;
            }
        }
        finallist = [];
        finallist = temparray;
        console.log("奇侠好感度排序如下:");
        console.log(finallist);
        getZhuguo();
    }
    function getZhuguo() {
        var msg = "";
        // console.log(finallist);
        for (var i = 0; i < 4; i++) {//只检查 头四个奇侠是不是在师门，是不是已经死亡。
            if (finallist[i]["isOk"] != true) {
                msg += finallist[i]["name"] + " ";
            }
        }
        if (msg != "") {
            console.log("根据您的奇侠亲密好感度，目前可以最优化朱果数目的以下奇侠不在江湖或者已经死亡：" + msg + "。请您稍后再尝试使用奇侠领取朱果服务。");
        } else {//头四位奇侠都在江湖中，可以开始领取朱果
            talktoQixia();
        }
    }
    var unfinish = "";
    function talktoQixia() {
        if (QixiaTotalCounter <= 24) {// 奇侠list仍然有元素。开始调取排列第一个的奇侠
            var Qixianame = "";
            var QixiaIndex = 0;
            // console.log(finallist[0]["name"]);
            Qixianame = finallist[QixiaTotalCounter]["name"];
            QixiaIndex = finallist[QixiaTotalCounter]["index"];
            if (finallist[QixiaTotalCounter]["isOk"] != true) {
                console.log("奇侠" + Qixianame + "目前不在江湖，可能死亡，可能在师门。领取朱果中断，请在一段时间之后重新点击领取朱果按钮。无需刷新页面");
                QixiaTotalCounter++;
                talktoQixia();
                return;
            } else {
                clickButton('find_task_road qixia ' + QixiaIndex);
                GetQXID(Qixianame, QixiaIndex);
            }
        } else {
            clickButton('home');
        }
    }

    function goeasyGetZhu() {
        for (var i = 0; i < easyGetZhu.length; i++) {
            go(easyGetZhu[i]);
        }
    }

    var finallist = [];
    function QiXiaTalkFunc() {
        // console.log('stard:奇侠领朱果');
        var QiXiaList_Input = "";
        //打开 江湖奇侠页面。
        if (QXStop == 0) {
            clickButton('open jhqx');
            GetQiXiaList();
        } else if (QXStop == 1 && qinmiFinished == 0) {
            QXStop = 0;
            QiXiaTalkButton.innerText = '奇侠领朱果';
        } else if (QXStop == 1 && qinmiFinished == 1) {
            QXStop = 0;
            QixiaList = [];
            finallist = [];
            QXTalkcounter = 1;
            QixiaTotalCounter = 0;
            clickButton('open jhqx', 0);
            GetQiXiaList();
        }
    }
    // 格式话奇侠数据并返回数组
    function formatQx(str) {
        var tmpMsg = removeSpec(str);
        var arr = tmpMsg.match(/<tr>(.*?)<\/tr>/g);
        var qxArray = [];
        var qxInfo = {};
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].indexOf('-') > 0) {
                    continue;
                }
                qxInfo = {};
                arr[i] = arr[i].replace('朱果', '');
                arr2 = arr[i].match(/<td[^>]*>([^\d\(]*)\(?(\d*)\)?<\/td><td[^>]*>(.*?)<\/td><td[^>]*>(.*?)<\/td><td[^>]*>.*?<\/td>/);
                qxInfo["name"] = arr2[1].replace('(', '').replace(')', '');
                qxInfo["degree"] = arr2[2] == "" ? 0 : arr2[2];
                if (arr2[3].match("未出世") != null || arr2[4].match("师门") != null) {
                    qxInfo["isOk"] = false;
                } else {
                    qxInfo["isOk"] = true;
                }
                qxInfo["index"] = i;
                qxArray.push(qxInfo);

            }
            return qxArray;
        }
        return [];
    }

    // 去除链接以及特殊字符
    function removeSpec(str) {
        var tmp = g_simul_efun.replaceControlCharBlank(str.replace(/\u0003.*?\u0003/g, ""));
        tmp = tmp.replace(/[\x01-\x09|\x11-\x20]+/g, "");
        return tmp;
    }

    function getItemId(str) {
        var name = '';
        var strA = str.split(' info ')[1];
        name = strA.split("'")[0];
        return name;
    }
    function sameItem(item) {
        var itemArr = ['狂暴丹', '乾坤再造丹', '百年灵草', '百年紫芝', '小还丹', '大还丹','碎片', '宝石', '宝箱', '钥匙', '残页', '隐武', '令', '龙庭魄', '昆仑印', '帝玺碎', '东海碧', '钜子墨', '轩辕烈', '九天落'];
        if (itemArr.indexOf(item) >= 0) {
            return true;
        }
        return false;
    }
    function isOneItem(name) {
        var itemArr = ['『秘籍木盒』', '玫瑰花', '高级乾坤袋', '乾坤袋', '突破丹礼包', '突破丹大礼包', '舞鸢尾', '狗粮', '保险卡'];
        for (var i = 0; i < itemArr.length; i++) {
            if (name.indexOf(itemArr[i]) >= 0) {
                return true;
            }
        }
        return false;
    }
    function zhengli(itemName, itemid, action, limit) {
        var tr = $('#out table:eq(2) tr');
        tr.each(function () {
            var td = $(this).find('td').eq(0);
            var tdName = td.text();
            if (sameItem(itemName)) {
                if (tdName.indexOf(itemName) >= 0) {
                    var m = td.siblings().find('span').filter(function () {
                        return new RegExp("[0-9]+").test($(this).text());
                    });
                    itemid = getItemId($(this).attr('onclick')) || itemid;
                    var num = m.text().match(/(\d+)/);
                    if (num == null)
                        return;
                    var exec = "items " + action + " " + itemid;

                    num = parseInt(num[0]);
                    if (action == "put_store")
                        num = 1;
                    if (limit != null)
                        num = limit;
                    var larger100 = parseInt(num / 100);
                    if(action == 'sell'){
                        var newExec = exec + '_N_' + num;
                        go(newExec);
                    }else{
                        if (isOneItem(itemName)) {
                            for (var i = 0; i < num; ++i) {
                                go(exec);
                            }
                        } else if (larger100 > 0) {
                            var newExec = exec + '_N_100';
                            for (var i = 0; i < larger100; i++) {
                                go(newExec);
                            }
                        } else {
                            if (action == "put_store") {
                                go(exec);
                            } 
                            else {
                                var itemNum = num % 100;
                                var newExec = exec + '_N_' + itemNum;
                                go(newExec);
                            }
                        }
                    }
                }
            } else {
                if (tdName == itemName) {
                    var m = td.siblings().find('span').filter(function () {
                        return new RegExp("[0-9]+").test($(this).text());
                    });
                    itemid = getItemId($(this).attr('onclick')) || itemid;
                    var num = m.text().match(/(\d+)/);
                    if (num == null)
                        return;
                    var exec = "items " + action + " " + itemid;

                    num = parseInt(num[0]);
                    if (action == "put_store")
                        num = 1;
                    if (limit != null)
                        num = limit;
                    if (action == 'sell') {
                        var newExec = exec + '_N_' + num;
                        go(newExec);
                    } else {
                        var larger100 = parseInt(num / 100);
                        if (isOneItem(itemName)) {
                            for (var i = 0; i < num; ++i) {
                                go(exec);
                            }
                        } else if (larger100 > 0) {
                            var newExec = exec + '_N_100';
                            for (var i = 0; i < larger100; i++) {
                                go(newExec);
                            }
                        } else {
                            if (action == "put_store") {
                                go(exec);
                            } else {
                                var itemNum = num % 100;
                                var newExec = exec + '_N_' + itemNum;
                                go(newExec);
                            }
                        }
                    }
                }
            }
        })
    }

    function baoguoZhengli1Func() {
        timeCmd = 0;

        // zhengli("灵草", "", "put_store");
        // zhengli("紫芝", "", "put_store");
        // zhengli("乾坤再造丹", "", "put_store");
        // zhengli("狂暴丹", "", "put_store");
        // zhengli("小还丹", "", "put_store");
        // zhengli("大还丹", "", "put_store");

        zhengli("宝石", "", "put_store");
        zhengli("碎片", "", "put_store");
        zhengli("隐武", "", "put_store");
        zhengli("宝箱", "", "put_store");
        zhengli("钥匙", "", "put_store");
        zhengli("残页", "", "put_store");
        zhengli("令", "", "put_store");
        zhengli("『秘籍木盒』", "", "put_store");

        zhengli("龙庭魄", "obj_longtingpo1", "put_store");
        zhengli("昆仑印", "obj_kunlunyin1", "put_store");
        zhengli("帝玺碎", "obj_dixisui1", "put_store");
        zhengli("东海碧", "obj_donghaibi1", "put_store");
        zhengli("钜子墨", "obj_juzimo1", "put_store");
        zhengli("轩辕烈", "obj_xuanyuanlie1", "put_store");
        zhengli("九天落", "obj_jiutianluo1", "put_store");

        zhengli("武穆遗书", "obj_wumu-", "put_store");
        zhengli("状元贴", "", "put_store");
        zhengli("烧香符", "", "put_store");
        zhengli("玄重铁", "", "put_store");
        zhengli("秘籍木盒", "", "put_store");
        zhengli("左手兵刃研习", "", "put_store");
        zhengli("驻颜丹", "", "put_store");
        zhengli("玫瑰花", "", "put_store");
        zhengli("空识卷轴", "", "put_store");
        zhengli("舞鸢尾", "", "put_store");

        // sell
        zhengli("钢剑", "", "sell");
        zhengli("钢剑", "", "sell");
        zhengli("鬼头刀", "", "sell");
        zhengli("割鹿刀", "", "sell");
        zhengli("铁戒", "", "sell");
        zhengli("破披风", "", "sell");
        zhengli("长斗篷", "", "sell");
        zhengli("军袍", "", "sell");
        zhengli("丝质披风", "", "sell");
        zhengli("木盾", "", "sell");
        zhengli("牛皮带", "", "sell");
        zhengli("铁盾", "", "sell");
        zhengli("藤甲盾", "", "sell");
        zhengli("青铜盾", "", "sell");
        zhengli("麻带", "", "sell");
        zhengli("鞶革", "", "sell");
        zhengli("锦缎腰带", "", "sell");
        zhengli("树枝", "", "sell");
        zhengli("鲤鱼", "", "sell");
        zhengli("鲫鱼", "", "sell");
        zhengli("破烂衣服", "", "sell");
        zhengli("水草", "", "sell");
        zhengli("莲蓬", "", "sell");
        zhengli("剑术基础", "", "sell");
        zhengli("搏斗基础", "", "sell");
        zhengli("刀法基础", "", "sell");
        zhengli("拆招基础", "", "sell");
        zhengli("丝绸衣", "", "sell");
        zhengli("钢丝甲衣", "", "sell");
        zhengli("铁手镯", "", "sell");
        zhengli("银手镯", "", "sell");
        zhengli("鹿皮手套", "", "sell");
        zhengli("长虹剑", "", "sell");
        zhengli("粉红绸衫", "", "sell");
        zhengli("绣花小鞋", "", "sell");
        zhengli("铁项链", "", "sell");
        zhengli("银项链", "", "sell");
        zhengli("铁戒", "", "sell");
        zhengli("银戒", "", "sell");
        zhengli("布鞋", "", "sell");
        zhengli("黑狗血", "", "sell");
        zhengli("桃符纸", "", "sell");
        zhengli("旧书", "", "sell");
        zhengli("牛皮酒袋", "", "sell");
        zhengli("银丝甲", "", "sell");
        zhengli("匕首", "", "sell");
        zhengli("羊角匕", "", "sell");
        zhengli("梅花匕", "", "sell");
        zhengli("逆钩匕", "", "sell");
        zhengli("拜月掌套", "", "sell");
        zhengli("金弹子", "", "sell");
        zhengli("铁甲", "", "sell");
        zhengli("精铁甲", "", "sell");
        zhengli("重甲", "", "sell");
        zhengli("软甲衣", "", "sell");
        zhengli("斩空刀", "", "sell");
        zhengli("新月棍", "", "sell");
        zhengli("白蟒鞭", "", "sell");
        zhengli("金刚杖", "", "sell");
        zhengli("飞羽剑", "", "sell");

        zhengli("羊毛斗篷", "", "splite");
        zhengli("红光匕", "", "splite");
        zhengli("无心匕", "", "splite");
        zhengli("青鸾护臂", "", "splite");
        zhengli("苍狼护臂", "", "splite");
        zhengli("翎眼赤护", "", "splite");
        zhengli("夜行披风", "", "splite");
        zhengli("破军盾", "", "splite");
        zhengli("玄武盾", "", "splite");
        zhengli("金狮盾", "", "splite");
        zhengli("玉清棍", "", "splite");
        zhengli("金丝甲", "", "splite");
        zhengli("金丝宝甲衣", "", "splite");
        zhengli("天寒匕", "", "splite");
        zhengli("虎皮腰带", "", "splite");
        zhengli("沧海护腰", "", "splite");
        zhengli("宝玉甲", "", "splite");
        zhengli("毒龙鞭", "", "splite");
        zhengli("生死符", "", "splite");
        zhengli("貂皮斗篷", "", "splite");
        zhengli("白玉腰带", "", "splite");
        zhengli("疯魔杖", "", "splite");
        zhengli("血屠刀", "", "splite");
        zhengli("残雪戒", "", "splite");
        zhengli("残雪手镯", "", "splite");
        zhengli("残雪帽", "", "splite");
        zhengli("残雪项链", "", "splite");
        zhengli("残雪鞋", "", "splite");

        zhengli("神秘宝箱", "", "use");
        zhengli("长生石宝箱", "", "use");
        zhengli("狂暴丹", "", "use");
        zhengli("乾坤再造丹", "", "use");
        zhengli("百年灵草", "", "use");
        zhengli("百年紫芝", "", "use");
        zhengli("小还丹", "", "use");
        zhengli("大还丹", "", "use");
        zhengli("顶级乾坤补丸", "", "use");
        zhengli("顶级狂暴补丸", "", "use");
        zhengli("万年灵草", "", "use");
        zhengli("万年紫芝", "", "use");

        zhengli("突破丹礼包", "", "use");
        zhengli("突破丹大礼包", "", "use");
        zhengli("狗粮", "obj_wuyiwei", "use");
        zhengli("云梦青", "obj_wuyiwei", "use");
        zhengli("乾坤袋", "qiankundai", "use");
        zhengli("九花玉露丸", "obj_wuyiwei", "use", 1);
        zhengli("玄冰碧火酒", "obj_wuyiwei", "use", 1);
        zhengli("冰镇酸梅汤", "obj_bingzhen_suanmeitang", "use", 1);
        zhengli("百草美酒", "obj_baicaomeijiu", "use", 1);
        zhengli("元宵", "obj_yuanxiao", "use", 1);
        zhengli("八宝粥", "obj_labazhou", "use", 1);
        zhengli("年糕", "obj_niangao", "use", 1);
        zhengli("冰糖葫芦", "obj_bingtanghulu", "use", 1);
        zhengli("茉莉汤", "obj_molitang", "use", 1);
        zhengli("兰陵美酒", "obj_wuyiwei", "use", 1);
        zhengli("巧果儿", "", "use", 1);
        zhengli("保险卡", "", "use");
        zhengli("高级乾坤袋", "", "use");
        zhengli("技能书", "", "use");
        zhengli("宝葫芦", "", "use");
        zhengli("千年紫芝", "", "use");
        zhengli("千年灵草", "", "use");
    }

    function baoguoZhengliFunc() {
        clickButton('quit_chat');
        clickButton('items');
        setTimeout(baoguoZhengli1Func, 3000);
    }


    function heBaoshi() {
        go("score");
        go("items", 0);
        setTimeout(heBaoshiFunc, 3000);
    }
    function heBaoshiFunc() {

        timeCmd = 0;
        baoshi("碎裂的红宝石", "hongbaoshi1");
        baoshi("裂开的红宝石", "hongbaoshi2");
        baoshi("红宝石", "hongbaoshi3");
        baoshi("无暇的红宝石", "hongbaoshi4");
        baoshi("完美的红宝石", "hongbaoshi5");
        baoshi("碎裂的绿宝石", "lvbaoshi1");
        baoshi("裂开的绿宝石", "lvbaoshi2");
        baoshi("绿宝石", "lvbaoshi3");
        baoshi("无暇的绿宝石", "lvbaoshi4");
        baoshi("完美的绿宝石", "lvbaoshi5");
        baoshi("碎裂的黄宝石", "huangbaoshi1");
        baoshi("裂开的黄宝石", "huangbaoshi2");
        baoshi("黄宝石", "huangbaoshi3");
        baoshi("无暇的黄宝石", "huangbaoshi4");
        baoshi("完美的黄宝石", "huangbaoshi5");
        baoshi("碎裂的紫宝石", "zishuijing1");
        baoshi("裂开的紫宝石", "zishuijing2");
        baoshi("紫宝石", "zishuijing3");
        baoshi("无暇的紫宝石", "zishuijing4");
        baoshi("完美的紫宝石", "zishuijing5");
        baoshi("碎裂的蓝宝石", "lanbaoshi1");
        baoshi("裂开的蓝宝石", "lanbaoshi2");
        baoshi("蓝宝石", "lanbaoshi3");
        baoshi("无暇的蓝宝石", "lanbaoshi4");
        baoshi("完美的蓝宝石", "lanbaoshi5");
    }

    function baoshi(itemName, itemid, action, limit) {
        var m = $('#out table:eq(2) tr span:contains(' + itemName + ')');
        if (m.length == 0) {
            return;
        }
        if (m != null) {
            if (m.length > 1) {
                m.each(function () {
                    var that = this;
                    if ($(that).text() == itemName) {
                        var SPANbao = $(that).parent().parent().find('span');
                        SPANbao.each(function (i) {
                            if (new RegExp("[0-9]+").test(SPANbao.eq(i).text())) {
                                m = SPANbao.eq(i);
                            }
                        })
                    }
                })
            } else {
                if ($(m).text() == itemName) {
                    m = m.parent().parent().find('span').filter(function () {
                        return new RegExp("[0-9]+").test($(this).text());
                    });
                }
            }
            var num = m.text().match(/(\d+)/);

            if (num == null)
                return;

            var exec = "items hecheng" + " " + itemid;

            num = parseInt(num[0]);

            if (action == "put_store")
                num = 1;
            if (limit != null)
                num = limit;
            var larger10 = parseInt(num / 30);

            if (larger10 > 0) {
                var smallNum = parseInt(num % 30);
                var endNum = parseInt(smallNum / 3);

                var newExec = exec + '_N_10';

                for (var i = 0; i < larger10; i++) {
                    go(newExec);
                }

                for (var i = 0; i < endNum; i++) {
                    exec = exec + '_N_1';
                    go(exec);
                }

            } else {
                var endNum = parseInt(num / 3);
                for (var i = 0; i < endNum; i++) {
                    exec = exec + '_N_1';
                    go(exec);
                }
            }
        }
    }

    var pozhao_ok_patterns = [/(.+)的招式尽数被(.+)所破！/, /(.+)这一招正好击向了(.+)的破绽！/, /(.+)一不留神，招式被(.+)所破！/];
    var pozhao_fail_patterns = [/(.+)的对攻无法击破(.+)的攻势，处于明显下风！/, /(.+)的招式并未有明显破绽，(.+)只好放弃对攻！/, /(.+)这一招并未奏效，仍被(.+)招式紧逼！/, /(.+)使出急忙使出“.+”闪躲，但差了一着，仍被(.+)招式紧逼！/, /(.+)使出急忙使出“.+”闪躲，但步法慢了一步，(.+)的招式迎面而来！/, /(.+)使出急忙使出“.+”闪躲，但(.+)招式更快，并未放弃攻击！/, /(.+)急忙施展“.+”企图防御，但(.+)的真气并未占据上风，失去了防御之势！/, /(.+)急忙施展“.+”企图防御，但真气仍旧无法完全将(.+)逼开！/, /(.+)急忙施展“.+”企图防御，但(.+)招式在真气之中仍旧施展自如！/];
    var normal_attack_patterns = [/(.+！|.+，|.+。|^)(.+)对准(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)用力挥出一拳！/m, /(.+！|.+，|.+。|^)(.+)往(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)狠狠地踢了一脚！/m, /(.+！|.+，|.+。|^)(.+)挥拳攻击(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)！/m, /(.+！|.+，|.+。|^)(.+)的.+往(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)狠狠地一捅！/m, /(.+！|.+，|.+。|^)(.+)往(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)一抓！/m, /(.+！|.+，|.+。|^)(.+)提起拳头往(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)捶去！/m, /(.+！|.+，|.+。|^)(.+)用.+往(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)刺去！/m, /(.+！|.+，|.+。|^)(.+)用.+往(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)直戳过去！/m, /(.+！|.+，|.+。|^)(.+)挥动.+，斩向(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)！/m, /(.+！|.+，|.+。|^)(.+)用.+往(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)砍去！/m, /(.+！|.+，|.+。|^)(.+)挥舞.+，对准(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)一阵乱砍！/m, /(.+！|.+，|.+。|^)(.+)挥舞.+，往(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)用力一□！/m, /(.+！|.+，|.+。|^)(.+)高高举起.+，往(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)当头砸下！/m, /(.+！|.+，|.+。|^)(.+)手握.+，眼露凶光，猛地对准(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)挥了过去！/m, /(.+！|.+，|.+。|^)(.+)的.+朝著(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)劈将过去！/m, /(.+！|.+，|.+。|^)(.+)对准(.+)的(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚|胸口)用力挥出一拳！/m];

    function is_pozhao_ok(vs_text) {
        for (var i = 0; i < pozhao_ok_patterns.length; i++) {
            if (pozhao_ok_patterns[i].test(vs_text)) {
                return true;
            }
        }
        return false;
    }
    function is_pozhao_fail(vs_text) {
        for (var i = 0; i < pozhao_fail_patterns.length; i++) {
            if (pozhao_fail_patterns[i].test(vs_text)) {
                return true;
            }
        }
        return false;
    }

    function is_normal_attack(vs_text) {
        for (var i = 0; i < normal_attack_patterns.length; i++) {
            if (normal_attack_patterns[i].test(vs_text)) {
                return true;
            }
        }
        return false;
    }

    var pozhao = 0;

    function ZhanDouView() {
        this.dispatchMessage = function (b) {
            var type = b.get("type"), subType = b.get("subtype");

            if (type == 'notice' || type == 'main_msg') {
                var notice_msg = b.get('msg');
                if (!notice_msg) {
                    return;
                }
                // console.log(notice_msg);
                // console.log(type);
                // console.log(subType);
                notice_msg = g_simul_efun.replaceControlCharBlank(notice_msg.replace(/\u0003.*?\u0003/g, ""));
                // console.log('notice&main_msg:' + notice_msg);
                // console.log(notice_msg);
                if (notice_msg.indexOf('基础攻击') > 0) {
                    setJichu(notice_msg);
                }
                if (notice_msg.indexOf('玄武碎片') > 0 || notice_msg.indexOf('白虎碎片') > 0 || notice_msg.indexOf('青龙碎片') > 0 || notice_msg.indexOf('朱雀碎片') > 0) {
                    // getSuiPianNum(notice_msg);
                }
                if (notice_msg.indexOf('转轮王死了') > 0) {
                    goInLine('转轮王死了，2秒后领取奖励。');
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/转轮王死了，2秒后领取奖励。');
                    setTimeout(() => {
                        go('event_1_45876452');
                    }, 2000);
                }
                if (notice_msg.indexOf('领取') > -1 && notice_msg.indexOf('奖励') > -1) {
                    goInLine(notice_msg);
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                }
                // if (notice_msg.indexOf('领取阎王') > -1) {
                //     goInLine(notice_msg);
                // }
                if (notice_msg.indexOf('挑战') > -1 && notice_msg.indexOf('胜利') > -1) {
                    goInLine(notice_msg);
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                }
                if (notice_msg.indexOf('逃犯任务') > 0 && notice_msg.indexOf('明天') > 0) {
                    // 逃犯任务达到上限
                    stopTaoFan();
                }
                // 这是你今天完成的第3/5个活动任务
                if (notice_msg.indexOf('活动任务') > 0 && notice_msg.indexOf('5/5') > 0) {
                    // 活动任务达到上限
                    stopJianghu();
                    go('home');
                }

                if (notice_msg.indexOf('雪山派活动任务') > 0 && notice_msg.indexOf('明天') > 0) {
                    // 雪山任务达到上限
                    isDoneXueShan = true;
                    closeXueShan();
                }
                // 这是你今天王恒的第1/5个雪山派活动任务
                if (notice_msg.indexOf('雪山派活动任务') > 0 && notice_msg.indexOf('完成') > 0) {
                    // 雪山任务达到上限
                    Base.skills();
                    if (notice_msg.split('第')[1].split('/') >= 5) {
                        isDoneXueShan = true;
                        closeXueShan();
                    }
                }
                // 道场魔皇
                if (notice_msg.indexOf("风小皮") != "-1" && notice_msg.indexOf("设下道场") != "-1") {
                    if (isSelfId()) {
                        if (!Jianshi.mohuang) {
                            triggerJoinTeamOn();
                            setTimeout(() => {
                                go('event_1_73749113');
                            }, 30*1000);
                        }
                    }
                }
                if (notice_msg.indexOf('谷子死了') > 0) {
                    goInLine('谷子死了，10秒后领取奖励。');
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/谷子死了，10秒后领取奖励。');
                    setTimeout(() => {
                        go('event_1_73749113');
                        Jianshi.mohuang = 1;
                    }, 10000);
                }
                //突破到最大限制
                // if (notice_msg.indexOf('专属称号后') > 0 && notice_msg.indexOf('同时突破') > 0) {
                //     isTuPoMax = true;
                // }
                //潜龙在渊圣上特赐
                if (notice_msg.indexOf('潜龙在渊') > 0 && notice_msg.indexOf('圣上特赐') > 0) {
                    addTuBtn(notice_msg);
                }
                if (Jianshi.wk > 0 && notice_msg.indexOf('你觉得体力耗尽') >= 0 && notice_msg.indexOf('便往洞外走去') >= 0) {
                    waKuang1();
                }
                if (notice_msg.indexOf('逃犯任务') > 0 && notice_msg.indexOf('今天完成') > 0 && notice_msg.indexOf('已做完') < 0) {
                    goInLine(notice_msg);
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                }

                if (notice_msg.indexOf('今天') > 0 && notice_msg.indexOf('杀生太多') > 0 && notice_msg.indexOf('已做完') < 0) {
                    stopJianghu();
                    go('home');
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                }

                // if (notice_msg.indexOf('今天') > 0 && notice_msg.indexOf('已做完') < 0) {
                //     // stopJianghu();
                //     // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                // }
                // 你得到天命丹x1。
                if (notice_msg.indexOf('你得到天命丹x') >= 0){
                    Jianshi.tianming = Jianshi.tianming +1;
                    if (Jianshi.tianming >= 10){
                        clearAskChaiShao();
                        go('home');
                        goInLine('已领取10次天命丹');
                        // clickButton('tell ' + assistant + ' ASSIST/reTell/已领取10次天命丹');
                    }
                }
                if (notice_msg.indexOf('获得了战利品') >= 0 && notice_msg.indexOf('青木宝箱') >= 0) {
                    setKilledQianlong1(notice_msg);
                }
                if (notice_msg.indexOf('你退出了队伍') >= 0) {
                    clickButton('team create');
                }
                if (notice_msg.indexOf('探秘积分x') >= 0 ) {
                    webSocket.send(JSON.stringify({
                        message: notice_msg,
                        type: 'chat'
                    }))
                }
                if (notice_msg.indexOf('扫荡成功') >= 0) {
                    webSocket.send(JSON.stringify({
                        message: notice_msg,
                        type: 'chat'
                    }))
                }
                if (notice_msg.indexOf('完成') >= 0 && notice_msg.indexOf('光明顶') > 0) {
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                    goInLine(notice_msg);
                }
                if (notice_msg.indexOf('获得') >= 0 && notice_msg.indexOf('黄阁令') > 0) {
                    goUseXiang(1);
                }
                if (notice_msg.indexOf('获得') >= 0 && notice_msg.indexOf('风云令') > 0) {
                    goUseXiang(2);
                }
                if (notice_msg.indexOf('获得') >= 0 && notice_msg.indexOf('风云宝箱') > 0) {
                    goUseXiang(3);
                }
                if (notice_msg.indexOf('获得') >= 0 && notice_msg.indexOf('锦鲤') > 0 && (notice_msg.indexOf('获得') < notice_msg.indexOf('锦鲤'))) {
                    // clickButton('tell ' + assistant + ' ASSIST/锦鲤/add/' + notice_msg);
                    goInLine(notice_msg);
                }
                if (notice_msg.indexOf('完成') >= 0 && notice_msg.indexOf('活动任务') > 0) {
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                    goInLine(notice_msg);
                }
                if (notice_msg.indexOf('完成') >= 0 && notice_msg.indexOf('关卡') > 0) {
                    goInLine(notice_msg);
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                }
                if (notice_msg.indexOf('获得') >= 0 && notice_msg.indexOf('锦袋') > 0) {
                    goInLine(notice_msg);
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                }
                if (notice_msg.indexOf('获得') >= 0 && notice_msg.indexOf('百宜雪梅') > 0 && notice_msg.indexOf('蟠桃') > 0) {
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                    goInLine(notice_msg);
                }
                if (notice_msg.indexOf('获得') >= 0 && notice_msg.indexOf('魔皇殿') >= 0) {
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                    goInLine(notice_msg);
                    triggerJoinTeamOff();
                }
                if (notice_msg.indexOf('获得') >= 0 && notice_msg.indexOf('采茶') > 0) {
                    // clickButton('tell ' + assistant + ' ASSIST/锦鲤/add/' + notice_msg);
                    goInLine(notice_msg);
                }
                if (notice_msg.indexOf('大显神威') > 0 && notice_msg.indexOf('[1区]地府') > 0) {
                    clearKillBeforeBangzhan();
                }
                var duboName = doBoZhu().name;
                if (isBigId() && Jianshi.tf > 0 && notice_msg.indexOf(duboName + "略胜一筹") != "-1" && notice_msg.indexOf("进入决赛") != "-1") {
                    doBo('1');
                    return;
                }
                if (notice_msg.indexOf(duboName + "力挫群雄") != "-1" && Jianshi.tf > 0) {
                    doBo('2');
                    return;
                }
                if (notice_msg.indexOf('开始观舞') != '-1') {
                    // sendToQQ(notice_msg)
                }
                if (notice_msg.indexOf('帮派副本') != '-1') {
                    console.log(notice_msg)
                }
                // 五鼠寻找
                if (notice_msg.indexOf('需要你帮忙找') != '-1') {
                    wushuSearch(notice_msg);
                }
                //五鼠杀人
                if (notice_msg.indexOf('需要你帮忙杀') != '-1') {
                    wushuKill(notice_msg);
                }
                // 五鼠回去
                if (notice_msg.indexOf('回去回复它吧') != '-1') {
                    var wayArr = [{ 'name': '五鼠', way: 'jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n' }];
                    addScreenBtn(wayArr);
                }
                if (notice_msg.indexOf('帮派副本') >= 0 && notice_msg.indexOf('失败') >= 0) {
                    if (Base.getCorrectText('4253282')) {
                        // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                        goInLine(notice_msg);
                    }
                    closeTianJian();
                    startJianghu();
                    setTimeout(function () {
                        // sendToQQ('帮派副本失败，开始挂机');
                        openOnTime();
                    }, 2 * 60 * 1000);
                }
                if (notice_msg.indexOf('帮派副本') >= 0 && notice_msg.indexOf('完成') >= 0 && notice_msg.indexOf('第一关') < 0) {
                    // sendToQQ(notice_msg);
                    if (Base.getCorrectText('4253282')) {
                        // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                        goInLine(notice_msg);
                    }
                    startJianghu();
                    openOnTime();
                    closeTianJian();
                }
                if (notice_msg.indexOf('帮派副本') >= 0 && notice_msg.indexOf('完成') >= 0 && notice_msg.indexOf('十月围城') > 0) {
                    hasDoneBangPai4 = true;
                }
                if (notice_msg.indexOf('帮派副本') >= 0 && notice_msg.indexOf('失败') >= 0 && notice_msg.indexOf('十月围城') > 0) {
                    hasDoneBangPai4 = true;
                }
                //【帮派】地府-转轮王开启了帮派副本**十月围城**【二】
                if (!hasDoneBangPai4 && notice_msg.indexOf('开启了帮派副本') != '-1' && notice_msg.indexOf('十月围城') != '-1') {
                    removeOnTime(1);
                    if (Base.getCorrectText('4253282')) {
                        goInLine(notice_msg);
                        // clickButton('tell ' + assistant + ' ASSIST/reTell/' + notice_msg);
                    }
                    // 【帮派】地府-转轮王开启了帮派副本**十月围城**【三】
                    var fubenIndex = 2;
                    if (notice_msg.indexOf('三') > 0) {
                        fubenIndex = 3;
                    }
                    if (notice_msg.indexOf('一') > 0) {
                        fubenIndex = 1;
                    }
                    stopJianghu();
                    setTimeout(function () {
                        clickButton('clan fb enter shiyueweiqiang-' + fubenIndex);
                        
                        if (Base.getCorrectText('4253282')){
                            goInLine(notice_msg);
                            // clickButton('tell ' + assistant + ' ASSIST/reTell/' + '开始帮派副本4-' + fubenIndex);
                        }
                    }, 6000);
                }
            }
            if (type == 'channel') {
                var msg = b.get('msg');
                msg = g_simul_efun.replaceControlCharBlank(msg.replace(/\u0003.*?\u0003/g, ""));
                //监控大快朵颐
                if (Base.getCorrectText('4253282') && msg.indexOf("大快朵颐") != '-1') {
                    // clickButton('tell ' + assistant + ' ASSIST/reTell/' + msg);
                    goInLine(notice_msg);
                    return;
                }
                if (Base.getCorrectText('4253282') && isAutoOn && msg.indexOf('游侠会') >= 0) {
                    // addTuBtn(msg);
                    setTimeout(function () {
                        youXiaHui(msg);
                    }, 1000 * 60);
                }
                // console.log('channel:' + msg);

                if (msg.indexOf('判师而出') > 0) {
                    console.log(msg);
                    //if (my_family_name && msg.indexOf(my_family_name)>0){
                    addTuBtn1(msg);
                    //}
                }

                //【帮派】『天&&马』：发现白衣神君位于binghuo-冰湖
                if (Jianshi.xs > 0 && msg) {
                    if (msg.indexOf('发现') > -1 && msg.indexOf('位于') > -1) {
                        console.log('channel帮派' + msg);
                        goCorrectBingXue(msg);
                        // g_gmain.clickButton('team chat ' + msg);
                    }
                }
                // 【系统】雪乱江湖：雪山派弟子白衣神君哈哈大笑：大爷来了，把值钱的都交出来!
                if (msg.indexOf('雪乱江湖') > -1 && msg.indexOf('哈哈大笑') > -1) {
                    // console.log('channel' + msg);
                }

                if (Jianshi.tf > 0) {
                    if (msg.indexOf('逃犯任务') > 0 && msg.indexOf('明天') > 0) {
                        // 逃犯任务达到上限
                        stopTaoFan();
                    }
                    if ($("#skill_1")[0] != undefined) {
                        return;
                    }
                    // var indexText = ['段老大','二娘','岳老三','云老四','剧盗','恶棍','流寇'];
                    var indexText = [
                        "二娘",
                        "夜魔",
                        // "岳老三"
                    ];
                    for (var i = 0; i < indexText.length; i++) {
                        var name = '【系统】' + indexText[i];
                        if (msg.indexOf(name) != '-1') {
                            var place = getPlace2(msg);
                            if (place) {
                                findKuaTaoFan(place);
                            }
                        }
                    }

                    var indexTextKuFu = '【系统】' + kuafuNpc + '段老大';
                    if (msg.indexOf(indexTextKuFu) != '-1') {
                        var place = getPlace2(msg);
                        if (place) {
                            findKuaTaoFan(place);
                        }
                    }
                }
            }
            if (Jianshi.bangzhan > 0) {
                var msg = b.get('msg');
                if (!msg) {
                    return;
                }
                msg = g_simul_efun.replaceControlCharBlank(
                    msg.replace(/\u0003.*?\u0003/g, "")
                );
                if (msg.indexOf("帮派风云战") != "-1" && msg.indexOf('地府') != "-1" && msg.indexOf('镇守') != "-1") {
                    goBangZhan(msg);
                    return;
                }
            }
            if (Jianshi.xuanhong > 0) {
                var msg = b.get('msg');
                if (type == 'notice') {
                    msg = g_simul_efun.replaceControlCharBlank(msg.replace(/\u0003.*?\u0003/g, ""));
                    if (msg.indexOf('【江湖悬红榜】任务已完成。') != -1) {
                        Jianshi.xhnpc = [];
                        go('jh 1;w;event_1_40923067;event_1_40923067');
                    }
                    if (msg.indexOf('请稍候再试') != -1 || msg.indexOf('等下再来') != -1) {
                        Jianshi.xhnpc = [];
                        go('event_1_40923067');
                    }
                    if (msg.match(/此地图还未解锁/)) {
                        Jianshi.xhnpc = [];
                    }
                } else if (type == 'main_msg') {
                    msg = g_simul_efun.replaceControlCharBlank(msg.replace(/\u0003.*?\u0003/g, ""));
                    // console.log(msg)
                    if (msg.indexOf('江湖悬红榜') != -1) {
                        var xh = msg.match('『(.*)』的『(.*)』');
                        var xh1 = xh[1], xh2 = xh[2];
                        // xh1 是地址  xh2是描述
                        var hasXuanhongWay = false;
                        if (xhts[xh1]) {
                            $.each(xhts[xh1], function (key, val) {
                                if (val.indexOf(xh2) != -1) {
                                    hasXuanhongWay = true;
                                    InforOutFunc(key);
                                    Jianshi.xhnpc.push(key);
                                    if (hairsfalling[xh1][key]) {
                                        InforOutFunc(key, hairsfalling[xh1][key]);
                                        go(hairsfalling[xh1][key]);
                                    };
                                }
                            });
                        }

                        if (!hasXuanhongWay) {
                            go('event_1_72202956 go;event_1_40923067');
                        }
                    }
                }
            }
            if (type == 'main_msg') {
                var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
                //监控大快朵颐
                if (Base.getCorrectText('4253282') && msg.indexOf("大快朵颐") != '-1') {
                    if (Base.getCorrectText('4253282')) {
                        clickButton('tell ' + assistant + ' ASSIST/reTell/' + msg);
                    }
                    return;
                }

                if (msg.indexOf('逃犯任务') > 0 && msg.indexOf('明天') > 0) {
                    // 逃犯任务达到上限
                    stopTaoFan();
                }
                if (msg.indexOf('队伍') >= 0 && msg.indexOf('位于') >= 0) {
                    goCorrectBingXue(msg);
                    return;
                }

                // if (msg.indexOf('队伍') == '-1' || followTeamSwitch == '0') {
                //     return;
                // }

                // var actionName = null;
                // var actionCode = null;
                // if (msg.indexOf('ask') > 0) {
                //     actionName = msg.split('click')[1].split("'，")[0];
                //     actionName = 'click' + actionName + "')";
                //     actionName = actionName.split('ask');
                //     actionCode = actionName[0] + 'ask ' + actionName[1];
                // }
                // if (msg.indexOf('jh') > 0) {
                //     actionName = msg.split('clickButton')[1];
                //     actionName = actionName.split('jh');
                //     actionCode = 'clickButton ' + actionName[0] + 'jh ' + actionName[1];
                // }

                // if (msg.indexOf('go') > 0) {
                //     actionName = msg.split('click')[1].split('。')[0];
                //     actionName = 'click' + actionName + "')";
                //     actionName = actionName.split('go');
                //     actionCode = actionName[0] + 'go ' + actionName[1];
                // }
                // if (msg.indexOf('kill') > 0) {
                //     actionName = msg.split('click')[1].split('，')[0];
                //     actionName = 'click' + actionName + ")";
                //     actionName = actionName.split('kill');
                //     actionCode = actionName[0] + 'kill ' + actionName[1];
                // }
                // if (msg.indexOf('fight') > 0) {
                //     actionName = msg.split('click')[1].split('，')[0];
                //     actionName = 'click' + actionName + ")";
                //     actionName = actionName.split('fight');
                //     actionCode = actionName[0] + 'fight ' + actionName[1];
                // }
                // if (msg.indexOf('event') > 0) {
                //     actionName = msg.split('click')[1].split('，')[0];
                //     actionName = 'click' + actionName + ")";
                //     actionCode = actionName;
                // }
                // // console.log(actionCode);
                // eval(actionCode);
            }
            if ($('#skill_1').length == 0) {
                maxQiReturn = 0;
                chuzhaoNum();
                bixueEnd();
                hitMaxEnd();
                return;
            }
            if (type == "vs" && subType == "text") {
                var msg = b.get('msg');
                if (!msg) {
                    return;
                }
                msg = g_simul_efun.replaceControlCharBlank(msg.replace(/\u0003.*?\u0003/g, ""));
                // console.log('msg_r' + msg)
                if (msg.indexOf("你骤地怒吼一声") > -1) {
                    bixueStart();
                }
                if (msg.indexOf("玄天之志") > -1 && msg.indexOf("。你短时间内提升了") > -1) {
                    bishouStart();
                }
                //longxiang
                if (msg.indexOf("你的筋骨") > -1 && msg.indexOf("攻击力") > -1) {
                    Jianshi.longxiang = 1;
                    longxiangStart();
                }
                //longxiang
                if (msg.indexOf("你运起天邪神功") > -1) {
                    tianxieStart();
                }
                // 步玄眩晕
                if (msg.indexOf("四处飘动") > -1 && msg.indexOf("头晕目眩") > -1) {
                    var my_name = g_obj_map.get("msg_attrs").get('name');
                    my_name = removeChart(my_name);
                    if (msg.indexOf(my_name) >= 0) {
                        Jianshi.xuanyun = 1;
                        if (Jianshi.xuanhong == 1) {
                            Base.qi = 4;
                            xuanyunStart('步玄')
                        }
                    }
                }
                // 意寒眩晕
                if (msg.indexOf("你爆出大量") > -1 && msg.indexOf("瑟瑟发抖") > -1) {
                    Jianshi.xuanyun = 1;
                    if (Jianshi.xuanhong == 1) {
                        Base.qi = 4;
                        xuanyunStart('意寒')
                    }
                }


                if (msg.indexOf("断潮一击") > -1 || msg.indexOf("回天之力") > -1) {
                    hitMax();
                    // if (
                    //     Jianshi.tf > 0 &&
                    //     Base.getCorrectText(
                    //         "4316804"
                    //     ) &&
                    //     Base.correctQu() == "37" &&
                    //     kuafuNpc == ""
                    // ) {
                    //     clickButton("escape");
                    // }
                    // sendToQQ('已打过血上限')
                }

                // 跟招
                if (genZhaoMode == 1) {
                    if (msg !== "" && (msg.indexOf("--燎原百击--") > -1 || msg.indexOf("--破军棍诀--") > -1 || msg.indexOf("--千影百伤棍--") > -1) || msg.indexOf("--九溪断月枪--") > -1) {
                        var qiNumber = gSocketMsg.get_xdz();
                        var qiText = gSocketMsg.get_xdz();

                        var hasHeal = checkHeal();
                        if (hasHeal) {
                            return;
                        }
                        if (qiText > 3) {
                            doKillSet();
                        }
                    }
                }
                // 怼人
                if (Jianshi.dr == 1) {
                    var txt = msg;
                    var hitDesList = null;
                    var OldList = hitKeys;
                    if (targetNpcName) {
                        hitDesList = targetNpcName.split(',').concat(killTargetArr);
                    } else {
                        hitDesList = OldList;
                    }
                    for (var i = 0; i < hitDesList.length; i++) {
                        var hitText = hitDesList[i];
                        if (txt.indexOf(hitText) != '-1') {
                            if (txt.indexOf('太极神功') != '-1' || txt.indexOf('金刚不坏功力') != '-1' || txt.indexOf('手脚迟缓') != '-1' || txt.indexOf('手脚无力') != '-1' || txt.indexOf('伤害') != '-1' || txt.indexOf('武艺不凡') != '-1' || txt.indexOf('我输了') != '-1' || txt.indexOf('脸色微变') != '-1' || txt.indexOf('直接对攻') != '-1') {
                                return;
                            }
                            else if (txt.indexOf('领教壮士的高招') == '-1' && txt.indexOf('深深吸了几口气') == '-1' && txt.indexOf('希望扰乱你') == '-1' && txt.indexOf('紧接着') == '-1' && txt.indexOf('同时') == '-1' && txt.indexOf('身形再转') == '-1' && txt.indexOf('迅疾无比') == '-1') {
                                console.log('出招～～～' + txt);
                                kezhi('1');
                                return;
                            } else {
                                console.log('其他～～～' + txt);
                            }
                        }
                    }
                }

                // 打楼
                if (daLouMode == 1) {
                    var txt = msg;
                    // var hp = geKeePercent();
                    var qiNumber = gSocketMsg.get_xdz();
                    if (qiNumber < 3) {
                        return;
                    }
                    var hasHeal = checkHeal();
                    if (hasHeal) {
                        return;
                    }

                    // 对面使用内功 我就使用轻功
                    var hitDesList = ['涌向你'];
                    var vsForce = g_obj_map.get("msg_vs_info").get("vs2_force1");
                    var hasDoDU = false;
                    if (vsForce > 100) {
                        for (var i = 0; i < hitDesList.length; i++) {
                            var hitText = hitDesList[i];
                            if (txt.indexOf(hitText) != '-1') {
                                var skillArr = ["无影毒阵"];
                                var skillIdA = ['1', '2', '3', '4', '5', '6', '7'];
                                var userSkillsSwitch = false;
                                $.each(skillArr, function (index, val) {
                                    var skillName = val;

                                    for (var i = 0; i < skillIdA.length; i++) {
                                        var btnNum = skillIdA[i];
                                        var btn = $('#skill_' + btnNum);
                                        var btnName = btn.text();
                                        if (btnName == skillName) {
                                            btn.find('button').trigger('click');
                                            userSkillsSwitch = true;
                                            hasDoDU = true;
                                            break;
                                        }
                                    }
                                });
                                if (!userSkillsSwitch) {
                                    kezhi('1');
                                }
                                return
                            }
                        }
                    }
                    if (!hasDoDU && $('.cmd_skill_button').length > 0) {
                        // var hitDesList = ['刺你','扫你','指你','你如','至你','拍你','向你','在你','准你','点你','劈你','取你','往你','奔你','朝你','击你','斩你','扑你','取你','射你','你淬','卷你','要你','将你','涌向你','对准你','你急急','抓破你','对着你','你已是','你被震','钻入你','穿过你','你愕然','你一时','你难辨','你竭力','纵使你有','围绕着你','你生命之火','你扫荡而去','你反应不及','你再难撑持','你无处可避','贯穿你躯体','你挡无可挡','你大惊失色','你的对攻无法击破','你这一招并未奏效','你只好放弃对攻'];
                        var hitDesList = hitKeys;
                        for (var i = 0; i < hitDesList.length; i++) {
                            var hitText = hitDesList[i];
                            if (txt.indexOf('铁锁横江') == '-1' && txt.indexOf('金刚不坏功力') == '-1' && txt.indexOf('太极神功') == '-1') {
                                if (txt.indexOf(hitText) != '-1') {
                                    // console.log('打楼当前信息：'+ txt);
                                    // if (Base.getCorrectText('4253282')) {
                                    //     if (txt.indexOf('掌') != '-1' || txt.indexOf('拳') != '-1' || txt.indexOf('指') != '-1') {
                                    //         kezhi('2');
                                    //     } else {
                                    //         kezhi('1');
                                    //     }
                                    // } else {
                                    doKillSet();
                                    // }
                                    return
                                }
                            }

                        }
                    }
                }

                // 对招
                if (duiZhaoMode == 1) {
                    if (hasQiLin()) {
                        go('escape');
                        setTimeout(function () {
                            go('home');
                        }, 1000);
                        return false;
                    }

                    var txt = msg;

                    if ($('.cmd_skill_button').length > 0) {
                        var qiNumber = gSocketMsg.get_xdz();
                        if (pozhao == 1 || qiNumber < 3) {
                            return;
                        }

                        var hasHeal = checkHeal();
                        if (hasHeal) {
                            return;
                        }
                        // console.log('is_pozhao_fail:' + is_pozhao_fail(txt));
                        // console.log('is_normal_attack:' + is_normal_attack(txt));
                        // var hitDesList = ['刺你','扫你','指你','你如','至你','拍你','向你','在你','准你','点你','劈你','取你','往你','奔你','朝你','击你','斩你','扑你','取你','射你','你淬','卷你','要你','将你','涌向你','对准你','你急急','抓破你','对着你','你已是','你被震','钻入你','穿过你','你愕然','你一时','你难辨','你竭力','纵使你有','围绕着你','你生命之火','你扫荡而去','你反应不及','你再难撑持','你无处可避','贯穿你躯体','你挡无可挡','你大惊失色','你的对攻无法击破','你这一招并未奏效','你只好放弃对攻'];
                        var hitDesList = hitKeys;
                        for (var i = 0; i < hitDesList.length; i++) {
                            var hitText = hitDesList[i];
                            if (txt.indexOf('铁锁横江') == '-1' && txt.indexOf('金刚不坏功力') == '-1' && txt.indexOf('太极神功') == '-1') {
                                if (txt.indexOf(hitText) >= 0) {
                                    // console.log('出招当前信息：'+ txt);
                                    // if (Base.getCorrectText('4253282')) {
                                    //     if (txt.indexOf('掌') != '-1' || txt.indexOf('拳') != '-1' || txt.indexOf('指') != '-1') {
                                    //         kezhi('2');
                                    //     } else {
                                    //         kezhi('1');
                                    //     }
                                    // } else {
                                    for (var j = 0; j < ignoreList.length; j++) {
                                        if (txt.indexOf(ignoreList[j]) >= 0) {
                                            return;
                                        }
                                    }
                                    pozhao = 1;
                                    doKillSet();
                                    setTimeout(function () { pozhao = 0 }, 400);
                                    // }
                                    return
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // 使用令牌
    function goUseXiang(type) {
        go('clan scene');
        if (type == '1') {
            go('give_geling')
        }
        if (type == '2') {
            go('give_fengyunling')
        }
        if (type == '3') {
            go('items use obj_fengyunbaoxiang')
        }
    }
    var zhanDouView = new ZhanDouView;

    function bixueStart() {
        bixueArr.push('鼻血');
        $('.bixueText').html('已开启' + bixueArr.join('、'));
        bixueSwitch = true;
        g_gmain.notify_fail(HIG + "狂吐一口血：" + RED + "恭喜你碧血成功！！" + NOR);
        // console.log('已开启鼻血');
    }
    function longxiangStart() {
        bixueArr.push('龙象');
        $('.bixueText').html('已开启' + bixueArr.join('、'));
        g_gmain.notify_fail(HIG + "龙象爆发出骇人威力：" + RED + "恭喜你龙象成功！！" + NOR);
        // console.log('已开启鼻血');
    }
    function tianxieStart() {
        bixueArr.push('天邪');
        $('.bixueText').html('已开启' + bixueArr.join('、'));
        g_gmain.notify_fail(HIG + "你运起天邪神功：" + RED + "恭喜你红眼成功！！" + NOR);
        // console.log('已开启鼻血');
    }
    function bishouStart() {
        bixueArr.push('白首');
        $('.bixueText').html('已开启' + bixueArr.join('、'));
        bishouSwitch = true;
        g_gmain.notify_fail(HIG + "玄天之志：" + RED + "恭喜你白首成功！！" + NOR);
        // console.log('已开启鼻血');
    }
    function xuanyunStart(name) {
        bixueArr.push(name);
        $('.bixueText').html('已开启' + bixueArr.join('、'));
    }
    function hitMax() {
        $('.hitMax').html('已打过血上限');
        // goInLine(getTimes() + '已打过血上限')
    }
    var attack = 0;
    var attack_times = 0;
    function setJichu(txt) {
        var addNum = txt.split('+')[1];
        attack = parseInt(attack) + parseInt(addNum);
        attack_times++;
        // $('.jichuText').html('使用次数：' + attack_times + '，基础攻击+：' + attack);
    }

    var bixueArr = [];
    function bixueEnd() {
        if (g_gmain) {
            if (!g_gmain.is_fighting) {
                bixueSwitch = false;
                bishouSwitch = false;
                Jianshi.longxiang = 0;
                bixueArr = [];
                $('.bixueText').html('');
            }
        }
    }

    function hitMaxEnd() {
        if (g_gmain) {
            if (!g_gmain.is_fighting) {
                $('.hitMax').html('');
            }
        }
    }

    function btnInit() {
        $('#btn0').trigger('click');
        if (Base.getCorrectText('4253282')) {
            $('#btn7').trigger('click');
            $('#btn8').trigger('click');
            // $('#btn9').trigger('click');
            // $('#btno26').trigger('click');
            $('#btnOnTime').trigger('click');
            // $('#btn-watchQQ').trigger('click');
        } else if (Base.getCorrectText('7905194')) {
            $('#btn4').trigger('click');
            $('#btn8').trigger('click');
            $('#btnOnTime').trigger('click');
        } else if (isSelfId() && Base.correctQu() != '1') {
            $('#btn7').trigger('click');
            $('#btn8').trigger('click');
            // $('#btn9').trigger('click');
            // $('#btno26').trigger('click');
            $('#btnOnTime').trigger('click');
        } else if (isLittleId()) {
            $('#btn7').trigger('click');
            $('#btn8').trigger('click');
            $('#btnOnTime').trigger('click');
        } else if (isGuaJiId()) {
            $('#btn7').trigger('click');
            $('#btn8').trigger('click');
            // $('#btn10').trigger('click');
            $('#btnOnTime').trigger('click');
        } else if (isVip()) {
            $('#btn7').trigger('click');        // 对招
            $('#btn8').trigger('click');        // 自动
            // $('#btno26').trigger('click');      // 自动恢复
            $('#btnOnTime').trigger('click');   // 定时任务
            // $('#btnv15').trigger('click');   // 跟招
        } else {
            $('#btn7').trigger('click');
            $('#btn8').trigger('click');
            // $('#btno26').trigger('click');
            $('#btnOnTime').trigger('click');
        }
        if (Base.getCorrectText('7905194')) {
            $('#btn4').trigger('click');
        }
        // if (isBigBixue()) {
        //     $('#btnv19').trigger('click');  // 鼻血
        //     $('#btno6').trigger('click');   // 逃犯
        // }
        // if (getCookie(window.userId + 'qljs') == '1') {
        //     $('#btn12').trigger('click');
        // }
        if (getCookie(window.userId + 'cljs') == '1') {
            $('#btno28').trigger('click');
        }
        if (getCookie(window.userId + 'jianghu') == '1') {
            setTimeout(function () {
                $('#btn15').trigger('click');
            }, 2000);
        }
        // if (isBigBixue()) {
            // $('#btn-watchQQ').trigger('click');
        // }
        // if (getCookie(window.userId + 'xsdz') == '1') {
        //     $('#btns5').trigger('click');
        // }
    }
    function triggerAskChaiShao(){
        if ($('#btno14').html() == '代码定时') {
            $('#btno14').html('停止代码');
            daimaInterval = setInterval(function () {
                go('ask tianlongsi_chaishao')
            }, 500)
        }
    }
    function clearAskChaiShao() {
        if ($('#btno14').html() == '停止代码'){
            $('#btno14').trigger('click');
        }
    }
    // 停止逃犯
    function stopTaoFan() {
        if (Jianshi.tf > 0) {
            $('#btno6').trigger('click');   // 逃犯
            go('home');
        }
    }
    // 停止江湖
    function stopJianghu() {
        if (Jianshi.jianghu > 0) {
            // $('#btn15').trigger('click');   // 江湖
            Jianshi.jianghuEnd = 1;
        }
    }
    // 开始江湖
    function startJianghu() {
        // if (Jianshi.jianghu == 0) {
        //     Jianshi.jianghuEnd = 0;
        //     $('#btn15').trigger('click');   // 江湖
        // }else{
            Jianshi.jianghuEnd = 0;
        // }
    }
    // 开始逃犯
    function startTaoFan() {
        if (Jianshi.tf == 0) {
            $('#btno6').trigger('click');   // 逃犯
        }
    }
    // vip 点日常
    function vipRiChang() {
        go('clan fb go_saodang shenshousenlin');
        go('clan fb go_saodang daxuemangongdao');
        go('home');
        go('public_op12');
        // setTimeout(function () {
        //     clickRiChang();
        // }, 2000);
    }

    function waKuang(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '挖矿') {
            Dom.html('关挖矿');
            Jianshi.wk = 1;
            var roomName = $('#out .outtitle').text();
            var action = 'event_1_39762344';  // 地矿
            var action1 = 'event_1_64388826';  // 挖地矿
            if (killBadSwitch) {
                action = 'event_1_7898524';
                action1 = 'event_1_22920188';
            }
            //event_1_22920188
            //clickButton('event_1_64388826', 0)
            if (roomName.indexOf('矿洞入口') >= 0) {
                go(action);
            } else {
                go('jh 2;n;n;n;n;n;n;n;n;n;n;w;w;event_1_85329567;w;w');
                go(action);
            }
            for (var i = 0; i < 5; i++) {
                go(action1);
            }
        } else {
            Dom.html('挖矿');
            Jianshi.wk = 0;
        }
    }


    function waKuang1() {
        var roomName = $('#out .outtitle').text();
        var action = 'event_1_39762344';  // 地矿
        var action1 = 'event_1_64388826';  // 挖地矿
        if (killBadSwitch) {
            action = 'event_1_7898524';
            action1 = 'event_1_22920188';
        }
        //clickButton('event_1_64388826', 0)
        if (roomName.indexOf('矿洞入口') >= 0) {
            go(action);
        } else {
            go('jh 2;n;n;n;n;n;n;n;n;n;n;w;w;event_1_85329567;w;w');
            go(action);
        }
        for (var i = 0; i < 5; i++) {
            go(action1);
        }

    }

    function goWaKuang() {
        removeOnTime();
        clickWakuangBtn();
    }

    function clickRiChang() {
        var btn = $('.cmd_click2');
        btn.each(function () {
            var txt = $(this).text();
            if (txt.indexOf('立即完成') != '-1') {
                var clickText = $(this).attr('onclick');
                var clickAction = getLibaoId(clickText);
                triggerClick(clickAction);
            }
        })
    }
    // 令牌
    function doLingPai() {
        // go('home;jh 1');
        go('items get_store /obj/shop/zhengxieling;items get_store /obj/med/zhuangyuantie;items get_store /obj/shop/zhengxieling;items get_store /obj/shop/bangpailing;items get_store /obj/shop/jianghuling;items get_store /obj/shop/shimenling;');
        go('home');
        console.log(getTimes() + '完成令牌兑换');
    }
    // 开白银
    var openBaiyinTimer = null;
    function openBaiYin(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '开白银') {
            Dom.html('不开白银');
            go('items get_store /obj/shop/box1');
            openBaiyinTimer = setInterval(function () {
                go('items use baiyin box_N_100');
            }, 1000);
        } else {
            Dom.html('开白银');
            clearInterval(openBaiyinTimer);
        }
    }
    // 开青木
    var openQingmuTimer = null;
    function openQingMu(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '开青木') {
            Dom.html('不开青木');
            go('items get_store /obj/shop/qingmubaoxiang');
            openQingmuTimer = setInterval(function () {
                go('items use obj_qingmubaoxiang_N_100');
            }, 1000);
        } else {
            Dom.html('开青木');
            clearInterval(openQingmuTimer);
        }
    }
    // 开曜玉
    var openYaoYuTimer = null;
    function openYaoYu(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '开曜玉') {
            Dom.html('不开曜玉');
            go('items get_store /obj/shop/yaoyuyaoshi');
            go('items get_store /obj/shop/yaoyubaoxiang');
            openYaoYuTimer = setInterval(function () {
                go('items use obj_yaoyubaoxiang');
            }, 500);
        } else {
            Dom.html('开曜玉');
            clearInterval(openYaoYuTimer);
        }
    }
    //eatHua
    var eatHuaTimer = null;
    function eatHua(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '吃花') {
            Dom.html('不吃花');
            go('items get_store /obj/shop/wuyiwei');
            eatHuaTimer = setInterval(function () {
                go('items use obj_wuyiwei');
            }, 500);
        } else {
            Dom.html('吃花');
            clearInterval(eatHuaTimer);
        }
    }
    // 墨家主线
    // function mojiaZhuxian(e) {
    //     var Dom = $(e.target);
    //     var DomTxt = Dom.html();
    //     if (DomTxt == '墨家主线1') {
    //         go1();
    //         Dom.html('墨家主线2');
    //     }
    //     if (DomTxt == '墨家主线2') {
    //         go2();
    //         Dom.html('墨家主线3');
    //     }
    //     if (DomTxt == '墨家主线3') {
    //         go3();
    //         Dom.html('墨家主线4');
    //     }
    //     if (DomTxt == '墨家主线4') {
    //         go4();
    //         Dom.html('墨家主线5');
    //     }
    //     if (DomTxt == '墨家主线5') {
    //         go5();
    //         Dom.html('墨家主线1');
    //     }
    // }
    // function go1() {
    //     go('jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;ask mojiajiguancheng_suolucan');
    // }
    // function go2() {
    //     go('n;n;n;n;n;ask mojiajiguancheng_yandan;ask mojiajiguancheng_jingke');
    // }
    // function go3() {
    //     go('s;s;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818-神龙山;e;n;e;s;e;n;nw;e;nw;w;w;ask mojiajiguancheng_dajiangshi');
    // }
    // function go4() {
    //     go('e;e;se;w;se;s;w;n;w;s;w;e;s;e;s;ne;s;sw;nw;s;se;s;sw;s;s;ask mojiajiguancheng_xufuzi');
    // }
    // function go5() {
    //     go('n;n;ne;n;nw;n;se;ne;n;sw;n;w;n;w;e;s;e;s;ne;s;sw;nw;s;se;s;e;e;e');
    // }
    // 令牌
    function doUseLingPai() {
        go('home');
        go('items use obj_zhengxieling');
        go('items use obj_zhengxieling');
        go('items use obj_zhengxieling');
        go('items use obj_zhuangyuantie');
        go('items use obj_zhuangyuantie');
        go('items use obj_zhuangyuantie');
        go('items use obj_shimenling');
        go('items use obj_shimenling');
        go('items use obj_shimenling');
        go('items use obj_bangpailing');
        go('items use obj_bangpailing');

        if (Base.getCorrectText('4253282')) {
            go('items use obj_jianghuling');
            go('items use obj_jianghuling');
            go('items use obj_jianghuling');
        }
        // 完成师门
        for (var i = 0; i < 100; i++) {
            go('vip finish_family');
        }
        // 完成帮派
        for (var i = 0; i < 60; i++) {
            go('vip finish_clan');
        }
        console.log(getTimes() + '完成使用令牌');
        go('trigger@btn-hitBang');
    }
    // 看舞
    function guanWu() {
        // 血n event_1_48561012 go
        // 内力s event_1_29896809 go
        go('rank go 169;w;w;w;w;w;n;n;n;e;e;s;event_1_29896809 go');
    }

    // 偃月
    function yanYue() {
        go('rank go 183;e;s;s;sw;sw;s;se;s;s;sw;sw;s;w;n;n;n;ne');
    }

    // 京城赌博
    function doBo(add) {
        go('rank go 195');
        // go('go south');
        // go('go south');
        var obj = doBoZhu();
        go('event_1_28816059 bet go ' + obj.id + ' 1');
        if (add == '1') {
            // 追加元宝
            go('event_1_28816059 rebet go 1', 1)
        }
        if (add == '2') {
            // 领取奖励
            go('event_1_28816059 get');
            setTimeout(function () {
                go('event_1_28816059 get');
            }, 5000);
        }
    }
    var doboRen = [
        {
            "name": "乔峰",
            "id": "0"
        },
        {
            "name": "黄衫女子",
            "id": "1"
        },
        {
            "name": "西门吹雪",
            "id": "4"
        },
        {
            "name": "陆小凤",
            "id": "5"
        },
        {
            "name": "寇准",
            "id": "7"
        }
    ];
    // 赌博押注
    function doBoZhu() {
        var renturnObj = doboRen[4];
        // 37区东方红
        if (Base.getCorrectText('4253282')) {
            renturnObj = doboRen[0];
        }
        // 王有财
        if (Base.getCorrectText('4219507')) {
            renturnObj = doboRen[1];
        }
        // 火狼
        if (Base.getCorrectText('4238943')) {
            renturnObj = doboRen[2];
        }
        // 跟班
        if (Base.getCorrectText('7030223')) {
            renturnObj = doboRen[3];
        }
        return renturnObj;
    }
    // 木头人
    function mutourenFn() {
        go('jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n');
    }
    function bangZhan_Func(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '跨服帮战') {
            Jianshi.bangzhan = 1;
            Dom.html('停止帮战');
        } else {
            Jianshi.bangzhan = 0;
            Dom.html('跨服帮战');
        }
    }
    // 开启掉线重连
    function openReLoad(e) {
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if (DomTxt == '掉线重连') {
            Jianshi.chonglian = 1;
            Dom.html('停止重连');
            setCookie(window.userId + 'cljs', '1')
        } else {
            Jianshi.chonglian = 0;
            Dom.html('掉线重连');
            setCookie(window.userId + 'cljs', '0')
        }
    }
    function reloadGame() {
        window.location.reload();
    }
    // 去帮战
    function goBangZhan(text) {
        clearKillBeforeBangzhan();
        go('jh 1');      // 进入章节
        go('home');     // 广场
        killBangZhan(text);
    }
    // 取消杀人
    function clearKillBeforeBangzhan() {
        if (killBadSetInterval != null) {
            $('#btno13').trigger('click');
        }
        if (killGoodSetInterval != null) {
            $('#btno12').trigger('click');
        }
    }
    function goBangzhanPlace(name, text) {
        name = name ? name : '至尊殿';
        var stepNum = isCorrectBangZhanPlace(name);

        if (stepNum) {
            go('go south');
            go('go west');
        }
    }
    function goHuangGe() {
        go('go south');
        go('go east');
    }
    function goXuanGe() {
        go('go south');
        go('go southeast');
    }
    function killBangZhan(text) {
        var name = '';
        var bad = true;
        console.log(text);
        name = text.split('】')[1].split('战场')[0];
        bad = text.indexOf('37区') > text.indexOf('镇守') ? true : false;
        console.log(name);
        setTimeout(function () {
            goBangzhanPlace(name, text);
        }, 2000);
        setTimeout(function () {
            // o12
            if (bad) {
                // 杀好人
                $('#btno12').trigger('click');
            } else {
                // 杀坏人
                $('#btno13').trigger('click');
            }
        }, 12000);
    }
    // 确认帮战地图
    function isCorrectBangZhanPlace(placeName) {
        var roomName = $('#out .outtitle').text();
        var placeNum = getBangzhanPlaceNum(placeName);
        var placeSpace = 0;
        console.log('before:' + roomName + '|| end:' + placeName);
        if (roomName == placeName) {
            return false;
        } else if (roomName == '聚义厅') {
            placeSpace = 10 - placeNum;
        } else {
            var thatPlaceNum = sureBangZhanPlace(roomName);
            if (thatPlaceNum > placeNum) {
                placeSpace = thatPlaceNum - placeNum;
                for (var i = 0; i < placeSpace; i++) {
                    go('go west');
                }
            } else {
                placeSpace = placeNum - thatPlaceNum;
                for (var i = 0; i < placeSpace; i++) {
                    go('go east');
                }
            }
        }
        return true;
        // 武林广场10  聚义厅
    }
    function getBangzhanPlaceNum(name) {
        var place = ['至尊殿', '翰海楼', '八荒谷', '九州城', '怒蛟泽', '凌云峰'];
        var placeNum = 0;
        for (var i = 0; i < place.length; i++) {
            if (name == place[i]) placeNum = i + 1;
        }
        if (name == '聚义厅'){
            placeNum = 11;
        }
        return placeNum;
    }
    function sureBangZhanPlace(name) {
        return name.replace('武林广场', '');
    }
    // 买药
    function maiYao() {
        go('jh 1;e;n;n;n;w');
        for (var i = 0; i < 10; i++) {
            go('buy /map/snow/obj/qiannianlingzhi_N_10 from snow_herbalist');
        }
        for (var i = 0; i < 10; i++) {
            go('buy /map/snow/obj/wannianlingzhi_N_10 from snow_herbalist');
        }
    }
    // 导航
    function DaoHang() {
        var placeName = [];
        for (var i in hairsfalling) {
            placeName.push(i);
            InfoOutDaohang(i);
        }
        log('输出成功！');
    }
    function InfoOutDaohang(text) {
        // var node = document.createElement("span");
        // node.className = "out2";
        // node.style = "color:rgb(255, 127, 0)";
        // var anode = document.createElement("a");
        // anode.style= "text-decoration:underline;color:yellow";
        // anode.setAttribute("onClick",'daoHangPlace("'+ text +'")');
        // anode.appendChild(document.createTextNode(text));
        // node.appendChild(anode);
        // document.getElementById("out2").appendChild(node);
        var html = "<a style='text-decoration:underline;color:yellow' onclick=daoHangPlace(\"" + text + "\")>" + text + "</a>";
        WriteToScreen(html);
    }
    function WriteToScreen(e) {
        var n = new Map;
        n.put("type", "main_msg"),
            n.put("subtype", "html"),
            n.put("msg", e),
            gSocketMsg.dispatchMessage(n);
    }
    // 找游侠会
    window.youXiaHui = function (txt) {
        var uname = getNpcName(txt);
        //
        var careYouxia = ['楚留香'];
        if ($.inArray(uname, careYouxia) == -1) {
            return false;
        }
        var place = '';
        for (var i = 0; i < chapList.length; i++) {
            if (txt.indexOf(chapList[i]) > 0) {
                place = chapList[i];
            }
        }
        goFindNpcInPlace(place, uname);
    };
    function getNpcName(txt) {
        var _name = "";
        var _name = txt.split("听说")[1].split("出来")[0];
        return _name;
    }
    //goFastWay 快捷路径
    function goFastWay(e) {
        var wayArr = [
            // {
            //     name: '大昭壁画',
            //     way: 'jh 26;w;w;n;w;w;w;n;n;e;event_1_12853448'
            // }, 
            // {
            //     name: '破除魔障',
            //     way: 'jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;e;e;event_1_94442590;event_1_22950681'
            // }, 
            // {
            //     name: '佳人觅香',
            //     way: 'jh 32;n;n;se;e;s;s;look_npc murong_azhu;event_1_99232080;e;e;s;e;s;e;e;e;look_npc murong_fangling;event_1_2207248'
            // }, 
            // {
            //     name: '十八木人',
            //     way: 'jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705;e;e;e'
            // }, 
            // {
            //     name: '破石寻花',
            //     way: 'jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw;nw;w;event_1_95874671'
            // }, 
            // {
            //     name: '闻香寻芳',
            //     way: 'jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;sw;sw;sw'
            // }, 
            {
                name: '十八木人',
                way: 'jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705;e;e;e'
            }, {
                name: '四大绝杀',
                way: 'jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;e;n;n;n;n;n;w;w;n;n;n;n;n;n;n;n'
            }, {
                name: '偃月-百晓居士',
                way: 'jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e'
            }, {
                name: '天山-杨英雄',
                way: 'jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939-星星峡;ts2;ne;ne;nw;nw'
            }, {
                name: '海云镇-血刀妖僧',
                way: 'jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se'
            }, {
                name: '长安-游四海',
                way: 'jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w'
            }, {
                name: '花街-观舞',
                way: 'rank go 170;w;w;w;w;w;n;n;n;e;e;n;event_1_5392021 go'
            }, {
                name: '通天塔',
                way: 'rank go 193'
            }, {
                name: '红螺寺',
                way: 'rank go 194'
            }, {
                name: '葬剑谷',
                way: 'rank go 223'
            }, {
                name: '无相楼',
                way: 'rank go 230'
            }, {
                name: '魔皇楼',
                way: 'rank go 236'
            }, {
                name: '霹雳堂',
                way: 'rank go 222'
            }, {
                name: '铸剑洞',
                way: 'rank go 209'
            }, {
                name: '越女剑楼',
                way: 'rank go 204'
            }, {
                name: '格斗城',
                way: 'rank go 195'
            }, {
                name: '铁剑',
                way: 'jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n'
            }, {
                name: '白猿',
                way: 'rank go 210;sw;s;s;s;s;s;s;s;s;s;s;s;w;w;n;n;n;n;nw;nw;nw;n;n;n'
            }, {
                name: '闯入冥庄',
                way: 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e;event_1_77775145'
            }, {
                name: '钓鱼',
                way: 'rank go 233;s;s;s;s;s;s;sw;se;sw'
            }, {
                name: '双修',
                way: 'rank go 233;s;s;s;e;ne;event_1_66728795'
            }, {
                name: '柴绍',
                way: 'rank go 233;s;s;s;s;s;s;sw;se;sw;sw;s;s;s;sw;sw;event_1_10567243'
            }, {
                name: '三树',
                way: 'rank go 233;s;s;s;s;s;s;sw;se;sw;sw;s;s;s;sw;sw;event_1_10567243;w;sw;s;s;se;se;se;nw;nw;nw;se;se;se'
            }, {
                name: '修补长城',
                way: 'jh 53;nw;nw;nw;nw;n;nw;ne;n;n;n;nw;nw;nw;nw;;sw;sw;sw;sw;sw;nw;nw;n;nw;sw;sw;sw'
            }, {
                name: '哈日巴特尔',
                way: 'jh 53;nw;nw;nw;nw;n;nw;ne;n;n;n;nw;nw;nw;nw;sw;sw;sw;sw;sw;nw;nw;n;nw;ne;e;n;n;n;n;nw;n;n;ne'
            }, {
                name: '九翼道人',
                way: 'jh 53;nw;nw;nw;nw;n;nw;ne;n;n;n;nw;nw;nw;nw;sw;sw;sw;sw;sw;nw;nw;n;nw;nw;nw;nw;w;nw;nw;nw;nw;nw'
            }, {
                name: '金换帮贡',
                way: 'clan incense jx;clan incense jx;clan incense jx;clan incense jx;clan incense jx;clan incense jx;clan incense jx;clan incense jx;clan incense jx;clan incense jx'
            },
            // {
            //     name: '打西夏',
            //     type: 5,
            //     click: hitXiXia
            // },
            // {
            //     name: '打魔皇',
            //     type: 5,
            //     click: hitMoHuang
            // },
            // {
            //     name: '打三楼',
            //     type: 5,
            //     click: hitSanLou
            // },
            // {
            //     name: '打一个NPC',
            //     type: 5,
            //     click: killOneNpc
            // },
            // {
            //     name: '同步潜龙',
            //     type: 5,
            //     click: getQianlongMsg
            // },
        ];

        addScreenBtn(wayArr);
    }
    window.hitXiXia = function () {
        clickButton('kill xixiaxunbao_tieyaozi 1');
    };
    window.hitMoHuang = function () {
        clickButton('kill jingcheng_tongtiantafenshen 1');
    };
    window.hitSanLou = function () {
        clickButton('kill tianlongsi_difenshen 1');
    };
    window.killOneNpc = function () {
        killOnePerson();
    };
    window.getQianlongMsg = function () {
        clickButton('tell ' + assistant + ' ASSIST/潜龙/get');
    };

    function killOnePerson() {
        clickButton('golook_room');
        var objs = g_obj_map.get("msg_room").elements.filter(function (item) {
            return item.key.indexOf("npc") == 0 && !isNaN(item.key.replace("npc", ""))
        });
        if (objs.length > 0) {
            clickButton("kill " + objs[0].value.split(",")[0] + ' 1');
        }
    }
    function killSomePerson() {
        clickButton('golook_room');
        var objs = g_obj_map.get("msg_room").elements.filter(function (item) {
            return item.key.indexOf("npc") == 0 && !isNaN(item.key.replace("npc", ""))
        });
        if (objs.length > 0) {
            clickButton("kill " + objs[0].value.split(",")[0]);
        }
    }
    function reSaveQianLong(msg) {
        var txt = g_simul_efun.replaceControlCharBlank(
            msg.replace(/\u0003.*?\u0003/g, "")
        );
        var record = txt.split('record')[1];
        record = $.trim(record);
        var map = {};
        if (record != 'null' && record != '{}') {
            var recordArr = record.split('，');
            var hasDoneText = [];
            for (var i = 0; i < recordArr.length; i++) {
                var newArr = recordArr[i].split('-');
                map[newArr[0]] = newArr[1];
                hasDoneText.push(newArr[0] * 1 + 1);
            }
            console.log(map);
            setCookie(qianlongCookieName, JSON.stringify(map));
            log('已打过' + hasDoneText.join(','));
        }
        log('已同步记录成功！')
    }
    // 去钓鱼
    function startDiaoYu() {
        var msg_room = g_obj_map.get("msg_room");
        if (msg_room) {
            if (msg_room.get("short") != '桃溪') {
                go('rank go 233;s;s;s;s;s;s;sw;se;sw;diaoyu')
            } else {
                go('diaoyu')
            }
        } else {
            go('rank go 233;s;s;s;s;s;s;sw;se;sw;diaoyu')
        }
    }
    /**
     * 
     * 
     */
    var steps = 0;
    var isOnstep1 = false;

    window.qianlongNpcArray = ['任侠', '暗刺客', '金刀客', '追命', '无花', '传鹰', '令东来', '西门吹雪', '石之轩', '朱大天王', '楚昭南', '阿青', '楚留香', '天山童姥', '乾罗', '令狐冲', '乔峰', '浪翻云', '三少爷', '花无缺', '云梦璃'];
    window.qianlongNpcArray2 = ['任侠', '暗刺', '金刀', '石幽明', '胡铁花', '蒙赤行', '厉工', '叶孤城', '祝玉妍', '萧秋水', '凌未风', '白猿', '石观音', '李秋水', '方夜羽', '东方不败', '慕容博', '庞斑', '燕十三', '小鱼儿', '夜魔'];
    window.setCookie = function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + 100);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    };
    window.getCookie = function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    };
    // 记录潜龙标记
    window.saveQianlongCookies = function (name, index, obj) {
        if (index == null) index = getIndexFromArr(name, qianlongNpcArray);
        var thisCookies = getCookie(qianlongCookieName);
        var saveParams = null;
        if (index != null) {
            saveParams = thisCookies ? JSON.parse(thisCookies) : {};
            saveParams[index] = 1;
            console.log(saveParams);
            setCookie(qianlongCookieName, JSON.stringify(saveParams));
            var newIndex = index * 1 + 1;
            if (obj) {
                obj.innerText = "已记" + newIndex + qianlongNpcArray[index];
                obj.style = "background:#EDEDED;color:#000;margin:5px;";
                obj.setAttribute("onClick", 'delBiaoji(this, ' + index + ')');
            }
            // else {
            //     sendToQQ('写标记' + qianlongNpcArray[index]);
            // }
            clickButton('tell ' + assistant + ' ASSIST/潜龙/add/' + qianlongNpcArray[index]);
            log(newIndex + '已记' + qianlongNpcArray[index])
        }
    };
    // 移除潜龙标记
    window.delBiaoji = function (obj, index) {
        if (!obj) {
            setCookie(qianlongCookieName, '{}');
            return false;
        }
        var cookies = getCookie(qianlongCookieName);
        if (!cookies) {
            cookies = '{}';
        }
        cookies = JSON.parse(cookies);
        if (cookies[index]) {
            delete cookies[index];
            setCookie(qianlongCookieName, JSON.stringify(cookies));
            console.log('清除标记' + index);
        }
        var newIndex = index * 1 + 1;
        obj.innerText = "标记" + newIndex + qianlongNpcArray[index];
        obj.style = "background:#FF6B00;color:#fff;margin:5px;";
        obj.setAttribute("onClick", 'saveQianlongCookies("",' + index + ',this)');
        clickButton('tell ' + assistant + ' ASSIST/潜龙/del/' + qianlongNpcArray[index]);
        warnning('已清除' + qianlongNpcArray[index] + '标记');
    };
    function getIndexFromArr(txt, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (txt.indexOf(arr[i]) != '-1') {
                return i
            }
        };
        return null;
    }
    function killhideFunc() {
        if (g_obj_map.get("msg_vs_info")) {
            if (g_obj_map.get("msg_vs_info").get("vs2_pos1")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs2_pos1") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs2_pos1") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs2_pos1") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs2_pos2")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs2_pos2") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs2_pos2") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs2_pos2") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs2_pos3")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs2_pos3") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs2_pos3") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs2_pos3") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs2_pos4")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs2_pos4") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs2_pos4") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs2_pos4") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs2_pos5")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs2_pos5") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs2_pos5") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs2_pos5") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs2_pos6")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs2_pos6") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs2_pos6") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs2_pos6") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs2_pos7")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs2_pos7") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs2_pos7") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs2_pos7") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs2_pos8")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs2_pos8") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs2_pos8") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs2_pos8") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs1_pos1")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs1_pos1") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs1_pos1") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs1_pos1") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs1_pos2")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs1_pos2") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs1_pos2") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs1_pos2") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs1_pos3")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs1_pos3") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs1_pos3") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs1_pos3") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs1_pos4")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs1_pos4") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs1_pos4") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs1_pos4") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs1_pos5")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs1_pos5") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs1_pos5") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs1_pos5") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs1_pos6")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs1_pos6") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs1_pos6") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs1_pos6") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs1_pos7")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs1_pos7") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs1_pos7") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs1_pos7") + "')\">切磋</a>]", 2, 1)
            }
            if (g_obj_map.get("msg_vs_info").get("vs1_pos8")) {
                writeToScreen(g_obj_map.get("msg_vs_info").get("vs1_pos8") + " [<a href=\"javascript:clickButton('kill " + g_obj_map.get("msg_vs_info").get("vs1_pos8") + "')\">杀</a> , <a href=\"javascript:clickButton('fight " + g_obj_map.get("msg_vs_info").get("vs1_pos8") + "')\">切磋</a>]", 2, 1)
            }
        }
    }

    // 展示潜龙标记
    function showBiaoJi() {
        var cookies = getCookie(qianlongCookieName);
        if (!cookies) {
            cookies = '{}'
        }
        cookies = JSON.parse(cookies);
        var indexArr = [];
        var qianlongArr = [];
        var doneArr = [];
        for (var i in cookies) {
            indexArr.push(i);
        }
        for (var i = 0; i < qianlongNpcArray.length; i++) {
            var hasSame = false;
            for (var j = 0; j < indexArr.length; j++) {
                if (i == indexArr[j]) {
                    hasSame = true;
                }
            }
            var index = i + 1;
            if (!hasSame) {
                qianlongArr.push({ name: '标记' + index + qianlongNpcArray[i], type: 1, click: 'saveQianlongCookies("' + qianlongNpcArray[i] + '",' + i + ',this)' });
            } else {
                doneArr.push({ name: '已记' + index + qianlongNpcArray[i], type: 2, click: 'delBiaoji(this' + ',"' + i + '")' });
            }
        }
        var returnArr = [...doneArr, ...qianlongArr];
        isOnstep1 = false;
        addScreenBtn(returnArr);
    }
    function isDoneThisQianlong(name) {
        var cookies = getCookie(qianlongCookieName);
        if (!cookies) {
            cookies = '{}'
        }
        cookies = JSON.parse(cookies);
        var indexArr = [];
        var qianlongArr = [];
        var doneArr = [];
        for (var i in cookies) {
            indexArr.push(i);
        }
        for (var i = 0; i < qianlongNpcArray.length; i++) {
            var hasSame = false;
            for (var j = 0; j < indexArr.length; j++) {
                if (i == indexArr[j]) {
                    hasSame = true;
                }
            }
            if (!hasSame) {
                qianlongArr.push(qianlongNpcArray[i]);
            } else {
                doneArr.push(qianlongNpcArray[i]);
            }
        }
        if (doneArr.length == 0) {
            return null;
        }
        var index = getIndexFromArr(name, doneArr);
        var index1 = getIndexFromArr(name, qianlongNpcArray);
        if (index != null) {
            return index1;
        }
        return null;
    }
    function getDoneQianlongNumber() {
        var cookies = getCookie(qianlongCookieName);
        if (!cookies) {
            cookies = '{}'
        }
        cookies = JSON.parse(cookies);
        var indexArr = [];
        for (var i in cookies) {
            indexArr.push(i);
        }
        return indexArr.length;
    }
    // 将数组内容写到屏幕中
    function addScreenBtn(arr) {
        if (!arr) {
            return;
        }
        if (arr.length == 0) {
            return;
        }
        var node = document.createElement("span");
        node.className = "out2";
        for (var i = 0; i < arr.length; i++) {
            var button = document.createElement("button");
            button.innerText = arr[i].name;
            button.style = "background:#FF6B00;color:#fff;margin:5px;";
            if (arr[i].type == 1) {
                button.setAttribute("onClick", arr[i].click);
            } else if (arr[i].type == 2) {
                button.style = "background:#EDEDED;color:#000;margin:5px;";
                button.setAttribute("onClick", arr[i].click);
            } else if (arr[i].type == 5) {
                button.addEventListener('click', arr[i].click)
            } else {
                button.setAttribute("onClick", "go(\'" + arr[i].way + "\')");
            }
            node.appendChild(button);
        }
        document.getElementById("out2").appendChild(node);
        log('输出成功');
    }
    window.stopOnTime = false;
    window.goFindNpcInPlace = function (w, name, type) {
        if ($('#skill_1').length > 0) {
            return;
        }
        if (type == '3') {
            isOnstep1 = false;
        }
        var qlcookies = getCookie(qianlongCookieName);
        if (!qlcookies) {
            qlcookies = '{}';
        }
        qlcookies = JSON.parse(qlcookies);

        var saveArr = [];
        var saveArr2 = [];
        for (var i in qlcookies) {
            saveArr.push(qianlongNpcArray[i]);
            saveArr2.push(qianlongNpcArray2[i])
        }
        if (getIndexFromArr(name, saveArr) != null) {
            // console.log('已打过');
            return false;
        }
        if (getIndexFromArr(name, saveArr2) != null) {
            // console.log('已打过');
            return false;
        }

        clickButton('home');

        var go_path = '';
        if (w.startsWith("雪亭镇")) {
            go_path = "jh 1;inn_op1;w;e;n;s;e;w;s;e;s;w;s;n;w;e;e;e;ne;ne;sw;sw;n;w;n;w;e;e;e;n;s;e;e;n;s;s;n;e;w;w;w;w;w;n;w;e;n;w;e;e;e;w;w;n;e;w;w;e;n";
        } else if (w.startsWith("洛阳")) {
            go_path = "jh 2;n;n;e;s;luoyang317_op1;n;n;w;n;w;putuan;n;e;e;s;n;w;n;e;s;n;w;w;event_1_98995501;n;w;e;n;e;w;s;s;s;s;w;e;n;e;n;w;s;luoyang111_op1;e;n;w;n;w;get_silver;s;e;n;n;e;get_silver;n;w;s;s;s;e;n;n;w;e;s;s;e;e;n;op1;s;s;e;n;n;w;e;e;n;s;w;n;w;e;n;e;w;n;w;e;s;s;s;s;s;w;w;n;w;e;e;n;s;w;n;e;w;n;w;luoyang14_op1;n;e;e;w;n;e;n;n;n;s;s;s;w;n;w;w;w;w;e;e;e;e;n;n;n;n";
        } else if (w.startsWith("华山村")) {
            go_path = "jh 3;n;e;w;s;w;n;s;event_1_59520311;n;n;w;get_silver;s;e;n;n;e;get_silver;n;w;n;e;w;s;s;s;s;s;e;e;s;e;n;s;w;s;e;s;huashancun24_op2;w;n;w;w;n;s;e;s;s;w;get_silver;n;n;s;e;huashancun15_op1;event_1_46902878;kill-藏剑楼杀手;@藏剑楼杀手的尸体;w;w;s;e;w;nw;n;n;e;get_silver;s;w;n;w;give huashancun_huashancun_fb9;e;e;n;n;w;e;n;s;e";
        } else if (w.startsWith("华山")) {
            go_path = "jh 4;n;n;w;e;n;e;w;n;n;n;n;event_1_91604710;s;s;s;w;get_silver;s;e;s;e;w;n;n;n;n;nw;s;s;w;n;n;w;s;n;w;n;get_xiangnang2;w;s;e;e;n;e;n;n;w;w;event_1_26473707;e;e;e;n;e;s;event_1_11292200;n;n;w;n;e;w;n;s;s;s;s;s;w;n;n;n;w;e;n;get_silver;s;s;e;n;n;s;s;s;s;n;n;w;s;s;w;event_1_30014247;s;w;e;s;e;w;s;s;s;e";
        } else if (w.startsWith("扬州")) {
            go_path = "jh 5;n;w;w;n;s;e;e;e;w;n;w;e;e;w;n;w;e;e;n;w;e;n;w;n;get_silver;s;s;e;e;get_silver;n;w;n;n;s;e;w;s;s;s;w;n;w;yangzhou16_op1;e;e;n;e;n;n;n;s;s;w;n;e;n;n;s;s;w;n;n;e;n;n;event_1_89774889;s;s;s;e;s;s;s;w;s;w;w;w;n;n;w;n;n;n;s;s;s;e;n;get_silver;s;s;e;e;w;w;s;s;s;s;n;n;e;e;n;w;e;e;n;n;n;n;s;s;e;w;w;e;s;s;w;n;w;e;e;get_silver;s;w;n;w;w;n;get_silver;s;s;w;s;w;e;e;e;s;s;e;e;s;s;s;n;n;n;w;w;n;n;w;w;n;e;e;e;n;e;s;e;s;s;s;n;n;n;w;n;w;n;ne;sw;s;w;s;n;w;n;w;e;e;w;n;n;w;n;s;e;e;s;n;w;n;s;s;s;s;e;e;s;s;s;w;event_1_69751810";
        } else if (w.startsWith("丐帮")) {
            go_path = "jh 6;event_1_98623439;s;w;e;n;ne;n;ne;ne;ne;event_1_97428251;n;sw;sw;sw;s;ne;ne;event_1_16841370";
        } else if (w.startsWith("乔阴县")) {
            go_path = "jh 7;s;s;s;w;s;w;w;w;e;e;e;e;event_1_65599392;n;s;w;e;ne;s;s;e;n;n;e;w;s;s;w;s;w;w;w;n;s;s;e;n;s;e;ne;s;e;n;e;s;e";
        } else if (w.startsWith("峨眉山")) {
            go_path = "jh 8;w;nw;n;n;n;n;w;e;se;nw;e;n;s;e;n;n;e;n;n;n;n;e;e;w;w;w;n;n;n;w;w;s;e;w;w;e;s;e;w;w;e;n;n;w;w;n;s;sw;ne;e;e;n;e;w;w;e;n;e;w;w;e;n;w;w;w;n;n;n;s;s;s;e;e;e;e;e;s;s;s;e;e;s;w;e;e;w;s;w;e;e;w;n;n;e;e;w;w;n;w;e;e;w;n;w;e;e;w;n;e;e;w;w;w;w;n;w;w;e;n;s;s;n;e;n;n;n;n;s;s;nw;nw;n;n;s;s;se;sw;w;nw;w;e;se;e;ne;se;ne;se;s;se;nw;n;nw;ne;n;s;se;e";
        } else if (w.startsWith("恒山")) {
            go_path = "jh 9;n;w;e;n;e;get_silver;w;w;n;w;e;n;henshan15_op1;e;e;w;n;event_1_85624865;n;w;event_1_27135529;e;e;e;w;n;n;n;s;henshan_zizhiyu11_op1;e;s;s;s;w;n;n;w;n;s;s;n;e;e;e;w;n;s;w;n;n;w;n;e;n;s;w;n;n;w;get_silver;s;e;n";
        } else if (w.startsWith("武当山")) {
            go_path = "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;n;s;s;n;e;e;n;s;e;w;s;s;s;n;n;n;w;w;w;n;w;n;w;w;w;w;n;w;n;s;e;e;e;s;n;e;e;w;w;w;w;n;n;n;n;jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;w;nw;sw;ne;n;nw;event_1_5824311";
        } else if (w.startsWith("晚月庄")) {
            go_path = "jh 11;e;e;s;sw;se;w;n;s;w;w;s;n;w;e;e;s;w;e;s;e;e;e;w;w;w;w;s;n;w;n;s;s;n;e;e;s;w;w;e;e;e;e;w;w;s;e;e;w;w;n;e;n;n;w;n;n;n;e;e;s;s;s;w;s;s;w;e;se;e;se;ne;n;nw;w;s;s;s;se;s";
        } else if (w.startsWith("水烟阁")) {
            go_path = "jh 12;n;e;w;n;n;n;s;w;n;n;e;w;s;nw;e;e;sw;n;s;s;e;w;n;ne;w;n";
        } else if (w.startsWith("少林寺")) {
            go_path = "jh 13;e;s;s;w;w;w;event_1_38874360;jh 13;n;w;w;n;shaolin012_op1;s;s;e;e;n;w;e;e;w;n;n;w;e;e;w;n;n;w;e;e;w;n;shaolin27_op1;event_1_34680156;s;w;n;w;e;e;w;n;shaolin25_op1;w;n;w;s;s;s;get_silver;w;s;s;s;s;s;n;n;n;n;n;n;n;n;e;e;s;s;s;s;get_silver;w;s;s;s;get_silver;w;s;n;n;n;n;n;n;n;n;w;n;w;e;e;w;n;e;w;w;n;get_silver";
        } else if (w.startsWith("唐门")) {
            go_path = "jh 14;e;w;w;n;n;n;n;s;w;n;s;s;n;w;n;s;s;n;w;n;s;s;n;w;e;e;e;e;e;s;n;e;n;e;w;n;n;s;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;s;s;e";
        } else if (w.startsWith("青城山")) {
            go_path = "jh 15;s;s;e;w;w;n;s;e;s;e;w;w;w;n;s;s;s;n;n;w;w;w;n;s;w;e;e;e;e;e;e;s;e;w;w;e;s;e;w;s;w;s;ne;s;s;s;e;s;n;w;n;n;n;n;n;n;n;n;n;n;nw;w;nw;n;s;w;s;s;s";
        } else if (w.startsWith("逍遥林")) {
            go_path = "jh 16;s;s;s;s;e;e;s;w;n;s;s;s;n;n;w;n;n;s;s;s;s;n;n;w;w;n;s;s;n;w;e;e;e;e;e;e;n;n;e;event_1_5221690;s;w;event_1_57688376;n;n;w;w;e;n;s;e;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637;s;s;e;n;n;w;n;e;jh 16;s;s;s;s;e;n;e;event_1_56806815;jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366";
        } else if (w.startsWith("开封")) {
            go_path = "jh 17;n;w;e;e;s;n;w;n;w;s;n;n;n;s;s;e;e;e;s;n;n;n;s;s;w;s;s;s;w;e;s;w;e;n;e;n;s;s;n;e;e;jh 17;n;n;n;e;w;n;e;w;n;e;se;s;n;nw;n;n;n;event_1_27702191;jh 17;n;n;n;n;w;w;n;s;s;n;w;w;e;n;n;w;e;s;s;s;s;w;jh 17;sw;nw;se;s;sw;nw;ne;event_1_38940168;jh 17;e;s;s;s;e;kaifeng_yuwangtai23_op1;s;w;s;s;w;jh 17;n;n;e;e;n;get_silver";
        } else if (w.startsWith("明教") || w.startsWith("光明顶")) {
            go_path = "jh 18;w;n;s;e;e;w;n;nw;sw;ne;n;n;w;e;n;n;n;ne;n;n;e;w;w;e;n;e;w;w;e;n;n;e;e;se;se;e;w;nw;nw;n;w;w;w;w;s;s;n;e;w;n;n;n;e;nw;nw;se;se;e;s;w;e;e;w;n;e;e;se;e;w;sw;s;w;w;n;e;w;n;n;n;n;n;w;e;n;event_1_90080676;event_1_56007071;ne;n;nw;se;s;s;e;n;w;nw;sw;se;e;se;nw;s;s;s;s;w;nw;nw";
        } else if (w.startsWith("全真教")) {
            go_path = "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;w;e;e;w;n;w;w;w;s;n;w;s;n;e;e;e;e;e;n;s;e;n;n;s;s;e;w;w;w;n;n;n;w;e;e;s;n;e;n;n;n;n;s;e;s;n;n;n;w;n;w;w;w;s;s;s;s;s;e;n;n;n;s;w;s;n;w;n;s;s;s;w;n;n;n;s;w;s;s;s;s;e;s;s;n;n;e;s;s;n;n;e;e;n;n;n;n;w;w;w;n;n;e;n;e;e;n;n";
        } else if (w.startsWith("古墓")) {
            go_path = "jh 20;s;s;n;n;w;w;s;e;s;s;s;s;s;sw;sw;s;e;se;nw;w;s;w;e;e;w;s;s;w;w;e;s;sw;ne;e;s;s;w;w;e;e;s;n;e;e;e;e;s;e;w;n;w;n;n;s;e;w;w;s;n;n;n;n;s;e;w;w";
        } else if (w.startsWith("白驼山")) {
            go_path = "jh 21;nw;s;n;ne;ne;sw;n;n;ne;w;e;n;n;n;s;w;w;jh 21;nw;w;n;s;w;nw;e;w;nw;nw;n;w;sw;ne;s;event_1_47975698;s;sw;s;ne;e;s;s;jh 21;nw;w;w;nw;n;e;w;n;n;w;e;n;n;e;e;w;nw;se;e;ne;sw;e;se;nw;w;n;s;s;n;w;w;n;n;n;n;s;s;s;s;e;e;e;n;n;w;e;e;e;w;w;n;nw;se;ne;w;e;e;w;n";
        } else if (w.startsWith("嵩山")) {
            go_path = "jh 22;n;n;w;w;s;s;e;w;s;s;w;e;s;n;n;n;n;n;e;n;n;n;n;n;e;n;e;e;w;w;n;w;n;s;e;n;n;n;e;songshan33_op1;n;w;w;w;e;n;w;e;n;s;s;e;n;e;w;n;e;w;n;get_silver;jh 22;n;n;n;n;e;n;event_1_1412213;s;event_1_29122616;jh 22;n;n;n;n;n;n;n";
        } else if (w.startsWith("寒梅庄") || w.startsWith("梅庄")) {
            go_path = "jh 23;n;n;e;w;n;n;n;n;n;w;w;e;e;e;s;n;w;n;w;n;s;w;e;e;e;n;s;w;n;n;e;w;event_1_8188693;n;n;w;e;n;e;n;s;w;n;s;s;s;s;s;w;n";
        } else if (w.startsWith("泰山")) {
            go_path = "jh 24;se;nw;n;n;n;n;w;e;e;e;w;s;n;w;n;n;w;e;e;w;n;e;w;n;w;n;n;n;n;n;s;s;w;n;s;e;s;s;s;e;n;e;w;n;w;e;n;n;e;s;n;e;n;e;w;n;w;e;e;w;n;n;s;s;s;s;s;w;w;n;n;w;e;e;w;n;n;w;e;e;w;n;s;s;s;s;s;w;n;e;w;n;w;e;n;n;e";
        } else if (w.startsWith("铁血大旗门")) {
            go_path = "jh 11;e;e;s;n;nw;w;nw;e;e;e;n;w;e;s;se;jh 25;e;e;e;e;s";
        } else if (w.startsWith("大昭寺")) {
            go_path = "jh 26;w;w;w;w;w;n;s;w;s;w;e;e;e;w;w;s;w;w;w;s;n;w;n;n;n;n;n;e;e;e;e;e;w;s;s;w;w;n;w;e;e;w;s;w;n;s;s;n;w;ask lama_master;ask lama_master;ask lama_master;event_1_91837538";
        } else if (w.startsWith("黑木崖")) {
            go_path = "jh 27;ne;nw;w;nw;w;w;yell";
        }
        if (go_path && !isOnstep1) {
            GetNPCPath(go_path, name);
            isOnstep1 = true;
            stopOnTime = true;
        }
        if (killGoodSetInterval) {
            clearInterval(killGoodSetInterval);
        }
    };

    window.goFindNpcInPlace1 = function (w, name, type) {

        if ($('#skill_1').length > 0) {
            return;
        }
        var go_path = '';
        if (w.startsWith("雪亭镇")) {
            go_path = "jh 1;inn_op1;w;e;n;s;e;w;s;e;s;w;s;n;w;e;e;e;ne;ne;sw;sw;n;w;n;w;e;e;e;n;s;e;e;n;s;s;n;e;w;w;w;w;w;n;w;e;n;w;e;e;e;w;w;n;e;w;w;e;n";
        } else if (w.startsWith("洛阳")) {
            go_path = "jh 2;n;n;e;s;luoyang317_op1;n;n;w;n;w;putuan;n;e;e;s;n;w;n;e;s;n;w;w;event_1_98995501;n;w;e;n;e;w;s;s;s;s;w;e;n;e;n;w;s;luoyang111_op1;e;n;w;n;w;get_silver;s;e;n;n;e;get_silver;n;w;s;s;s;e;n;n;w;e;s;s;e;e;n;op1;s;s;e;n;n;w;e;e;n;s;w;n;w;e;n;e;w;n;w;e;s;s;s;s;s;w;w;n;w;e;e;n;s;w;n;e;w;n;w;luoyang14_op1;n;e;e;w;n;e;n;n;n;s;s;s;w;n;w;w;w;w;e;e;e;e;n;n;n;n";
        } else if (w.startsWith("华山村")) {
            go_path = "jh 3;n;e;w;s;w;n;s;event_1_59520311;n;n;w;get_silver;s;e;n;n;e;get_silver;n;w;n;e;w;s;s;s;s;s;e;e;s;e;n;s;w;s;e;s;huashancun24_op2;w;n;w;w;n;s;e;s;s;w;get_silver;n;n;s;e;huashancun15_op1;event_1_46902878;kill-藏剑楼杀手;@藏剑楼杀手的尸体;w;w;s;e;w;nw;n;n;e;get_silver;s;w;n;w;give huashancun_huashancun_fb9;e;e;n;n;w;e;n;s;e";
        } else if (w.startsWith("华山")) {
            go_path = "jh 4;n;n;w;e;n;e;w;n;n;n;n;event_1_91604710;s;s;s;w;get_silver;s;e;s;e;w;n;n;n;n;nw;s;s;w;n;n;w;s;n;w;n;get_xiangnang2;w;s;e;e;n;e;n;n;w;w;event_1_26473707;e;e;e;n;e;s;event_1_11292200;n;n;w;n;e;w;n;s;s;s;s;s;w;n;n;n;w;e;n;get_silver;s;s;e;n;n;s;s;s;s;n;n;w;s;s;w;event_1_30014247;s;w;e;s;e;w;s;s;s;e";
        } else if (w.startsWith("扬州")) {
            go_path = "jh 5;n;w;w;n;s;e;e;e;w;n;w;e;e;w;n;w;e;e;n;w;e;n;w;n;get_silver;s;s;e;e;get_silver;n;w;n;n;s;e;w;s;s;s;w;n;w;yangzhou16_op1;e;e;n;e;n;n;n;s;s;w;n;e;n;n;s;s;w;n;n;e;n;n;event_1_89774889;s;s;s;e;s;s;s;w;s;w;w;w;n;n;w;n;n;n;s;s;s;e;n;get_silver;s;s;e;e;w;w;s;s;s;s;n;n;e;e;n;w;e;e;n;n;n;n;s;s;e;w;w;e;s;s;w;n;w;e;e;get_silver;s;w;n;w;w;n;get_silver;s;s;w;s;w;e;e;e;s;s;e;e;s;s;s;n;n;n;w;w;n;n;w;w;n;e;e;e;n;e;s;e;s;s;s;n;n;n;w;n;w;n;ne;sw;s;w;s;n;w;n;w;e;e;w;n;n;w;n;s;e;e;s;n;w;n;s;s;s;s;e;e;s;s;s;w;event_1_69751810";
        } else if (w.startsWith("丐帮")) {
            go_path = "jh 6;event_1_98623439;s;w;e;n;ne;n;ne;ne;ne;event_1_97428251;n;sw;sw;sw;s;ne;ne;event_1_16841370";
        } else if (w.startsWith("乔阴县")) {
            go_path = "jh 7;s;s;s;w;s;w;w;w;e;e;e;e;event_1_65599392;n;s;w;e;ne;s;s;e;n;n;e;w;s;s;w;s;w;w;w;n;s;s;e;n;s;e;ne;s;e;n;e;s;e";
        } else if (w.startsWith("峨眉山")) {
            go_path = "jh 8;w;nw;n;n;n;n;w;e;se;nw;e;n;s;e;n;n;e;n;n;n;n;e;e;w;w;w;n;n;n;w;w;s;e;w;w;e;s;e;w;w;e;n;n;w;w;n;s;sw;ne;e;e;n;e;w;w;e;n;e;w;w;e;n;w;w;w;n;n;n;s;s;s;e;e;e;e;e;s;s;s;e;e;s;w;e;e;w;s;w;e;e;w;n;n;e;e;w;w;n;w;e;e;w;n;w;e;e;w;n;e;e;w;w;w;w;n;w;w;e;n;s;s;n;e;n;n;n;n;s;s;nw;nw;n;n;s;s;se;sw;w;nw;w;e;se;e;ne;se;ne;se;s;se;nw;n;nw;ne;n;s;se;e";
        } else if (w.startsWith("恒山")) {
            go_path = "jh 9;n;w;e;n;e;get_silver;w;w;n;w;e;n;henshan15_op1;e;e;w;n;event_1_85624865;n;w;event_1_27135529;e;e;e;w;n;n;n;s;henshan_zizhiyu11_op1;e;s;s;s;w;n;n;w;n;s;s;n;e;e;e;w;n;s;w;n;n;w;n;e;n;s;w;n;n;w;get_silver;s;e;n";
        } else if (w.startsWith("武当山")) {
            go_path = "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;n;s;s;n;e;e;n;s;e;w;s;s;s;n;n;n;w;w;w;n;w;n;w;w;w;w;n;w;n;s;e;e;e;s;n;e;e;w;w;w;w;n;n;n;n;jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;w;nw;sw;ne;n;nw;event_1_5824311";
        } else if (w.startsWith("晚月庄")) {
            go_path = "jh 11;e;e;s;sw;se;w;n;s;w;w;s;n;w;e;e;s;w;e;s;e;e;e;w;w;w;w;s;n;w;n;s;s;n;e;e;s;w;w;e;e;e;e;w;w;s;e;e;w;w;n;e;n;n;w;n;n;n;e;e;s;s;s;w;s;s;w;e;se;e;se;ne;n;nw;w;s;s;s;se;s";
        } else if (w.startsWith("水烟阁")) {
            go_path = "jh 12;n;e;w;n;n;n;s;w;n;n;e;w;s;nw;e;e;sw;n;s;s;e;w;n;ne;w;n";
        } else if (w.startsWith("少林寺")) {
            go_path = "jh 13;e;s;s;w;w;w;event_1_38874360;jh 13;n;w;w;n;shaolin012_op1;s;s;e;e;n;w;e;e;w;n;n;w;e;e;w;n;n;w;e;e;w;n;shaolin27_op1;event_1_34680156;s;w;n;w;e;e;w;n;shaolin25_op1;w;n;w;s;s;s;get_silver;w;s;s;s;s;s;n;n;n;n;n;n;n;n;e;e;s;s;s;s;get_silver;w;s;s;s;get_silver;w;s;n;n;n;n;n;n;n;n;w;n;w;e;e;w;n;e;w;w;n;get_silver";
        } else if (w.startsWith("唐门")) {
            go_path = "jh 14;e;w;w;n;n;n;n;s;w;n;s;s;n;w;n;s;s;n;w;n;s;s;n;w;e;e;e;e;e;s;n;e;n;e;w;n;n;s;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;s;s;e";
        } else if (w.startsWith("青城山")) {
            go_path = "jh 15;s;s;e;w;w;n;s;e;s;e;w;w;w;n;s;s;s;n;n;w;w;w;n;s;w;e;e;e;e;e;e;s;e;w;w;e;s;e;w;s;w;s;ne;s;s;s;e;s;n;w;n;n;n;n;n;n;n;n;n;n;nw;w;nw;n;s;w;s;s;s";
        } else if (w.startsWith("逍遥林")) {
            go_path = "jh 16;s;s;s;s;e;e;s;w;n;s;s;s;n;n;w;n;n;s;s;s;s;n;n;w;w;n;s;s;n;w;e;e;e;e;e;e;n;n;e;event_1_5221690;s;w;event_1_57688376;n;n;w;w;e;n;s;e;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637;s;s;e;n;n;w;n;e;jh 16;s;s;s;s;e;n;e;event_1_56806815;jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366";
        } else if (w.startsWith("开封")) {
            go_path = "jh 17;n;w;e;e;s;n;w;n;w;s;n;n;n;s;s;e;e;e;s;n;n;n;s;s;w;s;s;s;w;e;s;w;e;n;e;n;s;s;n;e;e;jh 17;n;n;n;e;w;n;e;w;n;e;se;s;n;nw;n;n;n;event_1_27702191;jh 17;n;n;n;n;w;w;n;s;s;n;w;w;e;n;n;w;e;s;s;s;s;w;jh 17;sw;nw;se;s;sw;nw;ne;event_1_38940168;jh 17;e;s;s;s;e;kaifeng_yuwangtai23_op1;s;w;s;s;w;jh 17;n;n;e;e;n;get_silver";
        } else if (w.startsWith("明教") || w.startsWith("光明顶")) {
            go_path = "jh 18;w;n;s;e;e;w;n;nw;sw;ne;n;n;w;e;n;n;n;ne;n;n;e;w;w;e;n;e;w;w;e;n;n;e;e;se;se;e;w;nw;nw;n;w;w;w;w;s;s;n;e;w;n;n;n;e;nw;nw;se;se;e;s;w;e;e;w;n;e;e;se;e;w;sw;s;w;w;n;e;w;n;n;n;n;n;w;e;n;event_1_90080676;event_1_56007071;ne;n;nw;se;s;s;e;n;w;nw;sw;se;e;se;nw;s;s;s;s;w;nw;nw";
        } else if (w.startsWith("全真教")) {
            go_path = "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;w;e;e;w;n;w;w;w;s;n;w;s;n;e;e;e;e;e;n;s;e;n;n;s;s;e;w;w;w;n;n;n;w;e;e;s;n;e;n;n;n;n;s;e;s;n;n;n;w;n;w;w;w;s;s;s;s;s;e;n;n;n;s;w;s;n;w;n;s;s;s;w;n;n;n;s;w;s;s;s;s;e;s;s;n;n;e;s;s;n;n;e;e;n;n;n;n;w;w;w;n;n;e;n;e;e;n;n";
        } else if (w.startsWith("古墓")) {
            go_path = "jh 20;s;s;n;n;w;w;s;e;s;s;w;s;s;s;sw;sw;s;e;se;nw;w;s;e;w;w;e;s;s;s;s;s;e;e;e;n;n;s;e;w;s;e;s;e;w;n;w;w;w;w;s;n;w;w;e;e;n;n;w;sw;ne;e;n;e;e;e;w;n;n;s;s;s;s;n;e;e;w;s;e;s;e;w;n;w;w;w;w;n;n;n;w;w;e;s;n;e;e;e;event_1_3723773;se;n;e;s;e;s;e";
        } else if (w.startsWith("白驼山")) {
            go_path = "jh 21;nw;s;n;ne;ne;sw;n;n;ne;w;e;n;n;n;s;w;w;jh 21;nw;w;n;s;w;nw;e;w;nw;nw;n;w;sw;ne;s;event_1_47975698;s;sw;s;ne;e;s;s;jh 21;nw;w;w;nw;n;e;w;n;n;w;e;n;n;e;e;w;nw;se;e;ne;sw;e;se;nw;w;n;s;s;n;w;w;n;n;n;n;s;s;s;s;e;e;e;n;n;w;e;e;e;w;w;n;nw;se;ne;w;e;e;w;n";
        } else if (w.startsWith("嵩山")) {
            go_path = "jh 22;n;n;w;w;s;s;e;w;s;s;w;e;s;n;n;n;n;n;e;n;n;n;n;n;e;n;e;e;w;w;n;w;n;s;e;n;n;n;e;songshan33_op1;n;w;w;w;e;n;w;e;n;s;s;e;n;e;w;n;e;w;n;get_silver;jh 22;n;n;n;n;e;n;event_1_1412213;s;event_1_29122616;jh 22;n;n;n;n;n;n;n";
        } else if (w.startsWith("寒梅庄") || w.startsWith("梅庄")) {
            go_path = "jh 23;n;n;e;w;n;n;n;n;n;w;w;e;e;e;s;n;w;n;w;n;s;w;e;e;e;n;s;w;n;n;e;w;event_1_8188693;n;n;w;e;n;e;n;s;w;n;s;s;s;s;s;w;n";
        } else if (w.startsWith("泰山")) {
            go_path = "jh 24;se;nw;n;n;n;n;w;e;e;e;w;s;n;w;n;n;w;e;e;w;n;e;w;n;w;n;n;n;n;n;s;s;w;n;s;e;s;s;s;e;n;e;w;n;w;e;n;n;e;s;n;e;n;e;w;n;w;e;e;w;n;n;s;s;s;s;s;w;w;n;n;w;e;e;w;n;n;w;e;e;w;n;s;s;s;s;s;w;n;e;w;n;w;e;n;n;e";
        } else if (w.startsWith("铁血大旗门")) {
            go_path = "jh 11;e;e;s;n;nw;w;nw;e;e;e;n;w;e;s;se;jh 25;e;e;e;e;s";
        } else if (w.startsWith("大昭寺")) {
            go_path = "jh 26;w;w;w;w;w;n;s;w;s;w;e;e;e;w;w;s;w;w;w;s;n;w;n;n;n;n;n;e;e;e;e;e;w;s;s;w;w;n;w;e;e;w;s;w;n;s;s;n;w;ask lama_master;ask lama_master;ask lama_master;event_1_91837538";
        } else if (w.startsWith("黑木崖")) {
            go_path = "jh 27;ne;nw;w;nw;w;w;yell";
        } else if (w.startsWith("星宿海")) {
            go_path = "jh 28;sw;ne;nw;nw;se;w;e;sw;ne;e;e;w;w;se;n;n;e;ne;n;s;sw;w;n;n;n;s;ne;nw;sw;w;se;nw;e;se;s;s;s;w;n;n;n;s;se;nw;s;s;w;w;w;n;w;e;s;w;w;nw;ne;nw;w;e;ne;nw;ne;e;w;nw;ne;nw;w;e;ne;nw;ne;e;w;nw";
        } else if (w.startsWith("茅山")) {
            go_path = "jh 29;n;n;n;n;event_1_60035830;event_1_65661209;n;n;n;n;n;e;n;n;n;event_1_98579273;w;nw;e;n;e;e";
        } else if (w.startsWith("桃花岛")) {
            go_path = "jh 30;n;n;ne;sw;n;n;n;w;e;e;w;n;n;w;w;e;e;e;s;n;n;s;w;n;n;n;w;w;s;s;n;n;e;e;e;e;e;n;s;s;n;w;n;s;w;n;s;s;n;w;nw;w;e;se;n;n;n;e;e;w;n;s;w;n;se;s";
        } else if (w.startsWith("铁雪山庄")) {
            go_path = "jh 31;n;n;n;w;w;w;w;n;n;n;n;w;e";
        } else if (w.startsWith("慕容山庄")) {
            go_path = "jh 32;n;n;se;e;s;s;n;n;w;w;e;n;w;e;ne;sw;n;n;n;e;w;w;s;n;w;n;s;w;n;w;n;e;n;e;n;w;e;e;w;n";
        } else if (w.startsWith("大理")) {
            go_path = "jh 33;sw;sw;s;s;s;nw;n;nw;n;n;n;n;n;e;n;s;e;sw;w;w;s;s;e;s;w;se;e;s;s;s;w;w;se;e;s;ne;e;se;n;n;n;n;n;w;ne;se;s;w;w;n;se;w;w;s;nw;n;e;se;n;n;w;se;e;se;e;se;e;e;n;s;e;e;se;e;e;se;n;n;n;n;n;n;e;n;n;n;e;e;se;e;s;ne;e;se;e;e;s;ne;e;n;sw;s;s;e;n;e;n;e;s;e;s;e;e;e;s;w;n;n;s;s;s;w;n;n;n;n;w;e;n;e;n;se;w;n;w;e;n;e;e;s;n;n;w;e;n;ne;n;e;e;n;s;e;ne;se;se;n;n;n;e;s;w;w;e;n;e;s;s;e;n;s;w;n;se;n;ne;s;w;e;n;s;s;e;s;w;se;s;s;s;e;n;sw;sw;w;s;n;n;s;e;n;n;n;s;e;se;s;sw;n;w;s";
        } else if (w.startsWith("断剑山庄")) {
            go_path = "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;n;n;w;n;e;e;n;n";
        } else if (w.startsWith("冰火岛")) {
            go_path = "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;w;w;n;e;n;w;w;s;s";
        } else if (w.startsWith("侠客岛")) {
            go_path = "";
        } else if (w.startsWith("绝情谷")) {
            go_path = "jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw;se;s;sw;s;s;se;e;n;e;e;e;ne;ne;ne;se;s;s;s;w;e;n;n;n;nw;sw;sw;nw;w;n;nw;n;ne;e;ne;se;nw;sw;w;sw;nw;w;n;nw;n;s;se;s;e;n;nw;n;nw;se;s;se;s;ne;n;ne;sw;s;sw;n;ne;e;ne;e;n";
        } else if (w.startsWith("碧海山庄")) {
            go_path = "jh 38;n;n;n;n;w;w;e;e;n;n;n;w;w;nw;w;w;n;n;s;s;e;e;se;e;e;n;n;e;se;s;e;w;n;nw;w;n;n;e;e;se;se;e;n;n;n;s;s;s;w;nw;nw;w;w;n;n;n;n";
        } else if (w.startsWith("天山")) {
            go_path = "jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w;s;w;n;w;";
        } else if (w.startsWith("苗疆")) {
            go_path = "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se";
        } else if (w.startsWith("白帝城")) {
            go_path = "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;e;e;w;w;n;n;n;s;s;s;w;w;w";
        } else if (w.startsWith("墨家机关城")) {
            go_path = "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;n;n;e;w;s;s;s;e;e;e;e;n;n;n;w";
        } else if (w.startsWith("掩月城")) {
            go_path = "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw;s;e;s;s;s";
        } else if (w.startsWith("海云阁")) {
            go_path = "jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne;n;n;n;n;nw";
        } else if (w.startsWith("幽冥山庄")) {
            go_path = "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e";
        } else if (w.startsWith("花街")) {
            go_path = "jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;e;e;w;w;w;w;w;w;w;n;n;n;e;e;e;w;w;e;s;n;n";
        } else if (w.startsWith("西凉城")) {
            go_path = "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n;n;ne;n";
        } else if (w.startsWith("高昌迷宫")) {
            go_path = "jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw;sw;s;sw;se";
        } else if (w.startsWith("越王剑宫")) {
            go_path = "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e;w;n;n;n;n;n;w;e;n;n;n";
        } else if (w.startsWith("江陵")) {
            go_path = "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e;w;w;w;e;e;n;n;nw;n;n;n;e;e";
        }
        if (go_path) {
            clickButton('home');
            GetNPCPath(go_path, name);
        }
        if (killGoodSetInterval) {
            clearInterval(killGoodSetInterval);
        }
    };
    // 五鼠寻找
    function wushuSearch(txt) {
        // txt = '翻江鼠_丙需要你帮忙找到：绣花鞋x 0 / 1 、大青树叶x 0 / 1 、轻罗绸衫x 0 / 1 、断水剑x 0 / 1 、彼岸花x 0 / 1 、金锭x 118018 / 100 、天龙降魔禅杖x 0 / 1 、火 云 战 甲x 0 / 1 、金饭碗x 0 / 1 、金算盘x 0 / 1 、白金项链x 0 / 1 、青色道袍x 0 / 1 、无心锤x 0 / 1 、铁扇剑x 0 / 1 。任务时间剩余：09分50秒';
        // var keyword = txt.split('帮忙找到：')[1].split('。任务时间')[0];
        // var keyArr = keyword.split('、');
        // ckeckIsGetObj(keyArr);
    }
    function ckeckIsGetObj(arr) {
        var wayArr = [];
        for (var i = 0; i < arr.length; i++) {
            var firstSplit = arr[i].split('x ');
            var num = firstSplit[1].split('/')[0];
            var name = firstSplit[0];
            if (num < 1) {
                var map = goGetPosition(name);
                if (map) {
                    wayArr.push(map);
                }
            }
        }
        addScreenBtn(wayArr);
    }
    // 五鼠杀人
    function wushuKill(txt) {
        // txt = '展昭需要你帮忙杀死艳无忧。任务时间剩余：23分36秒。';
        var keyword = txt.split('杀死')[1].split('。任务时间')[0];
        // goKillPosition(keyword)
    }
    // 去物品或人
    function goGetPosition(key) {
        if (!key) {
            return false;
        }
        var map = hairsfalling['五鼠'];
        if (map[key]) {
            var TargetName = map[key];
            var way = '';
            if (TargetName.indexOf('-') > 0) {
                var place = TargetName.split('-');
                var targetPlace = place[1];
                for (var k in hairsfalling[place[0]]) {
                    if (k.indexOf(targetPlace) > -1) {
                        way = hairsfalling[place[0]][k];
                    } else if (targetPlace.indexOf(k) > -1) {
                        way = hairsfalling[place[0]][k];
                    }
                }
            } else {
                for (var j in hairsfalling) {
                    for (var k in hairsfalling[j]) {
                        if (k.indexOf(TargetName) > -1) {
                            way = hairsfalling[j][k];
                        } else if (TargetName.indexOf(k) > -1) {
                            way = hairsfalling[j][k];
                        }
                    }
                }
            }
            var newMap = { 'name': key + '-' + map[key], way: way };
            return newMap
        }
    }
    function goKillPosition(name) {
        console.log(name);
        writeScreenBtns(name);
        findSpecTagerInfo = name;
    }
    /**
     * 无用逃跑回坑、逃跑换边
     *  */
    var changeTrigger = 0;
    var escapeTrigger = 0;
    var escapeTimer = null;
    function escapechangeStart() {
        escapeTrigger = 1;
        changeTrigger = 1;
        escapeloop()
    }
    function escapeStart() {
        escapeTrigger = 1;
        clearInterval(escapeTimer);
        escapeTimer = setInterval(escapeloop, 500)
    }
    function escapeloop() {
        clickButton("escape", 0);
        if (is_fighting == 0 || g_gmain.g_delay_connect > 0) {
            escapeTrigger = 0;
            clearInterval(escapeTimer)
        }
    }
    function EscapeFunc() {
        this.dispatchMessage = function (b) {
            var type = b.get("type"),
                subType = b.get("subtype");
            console.log(type);
            console.log(subType);
            var combat = g_obj_map.get("msg_vs_info");
            if (combat == undefined) {
                return
            }
            var npcid;
            var opnpc;
            var me = g_obj_map.get("msg_attrs").get("id");
            for (var i = 0; i < 8; i++) {
                if (combat.get("vs1_pos" + i) == me) {
                    opnpc = combat.get("vs1_pos1");
                    npcid = combat.get("vs2_pos1")
                } else {
                    if (combat.get("vs2_pos" + i) == me) {
                        opnpc = combat.get("vs2_pos1");
                        npcid = combat.get("vs1_pos1")
                    }
                }
            }
            if (type == "notice" && subType == "escape") {
                var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
                console.log(msg);
                if (msg.match("逃跑成功") != null) {
                    escapeTrigger = 0;
                    if (changeTrigger == 1) {
                        restartFight(opnpc)
                    } else {
                        if (changeTrigger == 0) {
                            restartFight(npcid)
                        }
                    }
                }
            }
        };
        var restartFight = function (npcid) {
            if (!npcid) {
                return;
            }
            if (changeTrigger == 1) {
                changeTrigger = 0
            }
            console.log(npcid);
            clickButton("fight " + npcid, 0);
            clickButton("kill " + npcid, 0)
        }
    }

    var escapeFunc = new EscapeFunc;

    function GetNPCPath(dir, name) {
        if (name && name.indexOf('n')) {
            name = name.replace(/\n/g, "");
        }
        var hasFindName = false;
        if (is_fighting) {
            setTimeout(function () {
                GetNPCPath(dir, name);
            },
                300);
            return
        }
        var npcArr = hasSamePerson(name);
        if (npcArr.length > 0) {
            console.log(npcArr);
            hasFindName = true;
        }
        if (hasFindName) {
            killSomeOneName = name;
            var p = dir.split(";");
            var way = p.splice(0, steps);
            if (Jianshi.qianlong || Jianshi.zha || Jianshi.jianghu) {
                isOnstep1 = false;
                steps = 0;
                killGoodSetInterval = setInterval(function () {
                    killSet([name]);
                }, 300);
            }
            sendToLine(name, way);
            return false;
        }
        var d = dir.split(";");

        if (steps < d.length) {
            var cmd = d[steps];
            clickButton(cmd);
            steps += 1;
            setTimeout(function () {
                GetNPCPath(dir, name);
            }, 400);
        } else {
            stopOnTime = false;
            steps = 0;
            isOnstep1 = false;
            console.log('未找到NPC' + name);
        }
    }
    function sendToLine(name, way) {
        var npcList = getNpcNameList();
        var npcName = '';
        if (npcList.length > 0) {
            npcName = '-' + npcList[0];
        }
        var roomname = g_obj_map.get("msg_room").get("short");
        roomname = removeChart(roomname);

        var msg = '找到' + name + ',在' + roomname + npcName + '-way:' + '"' + way.join(';') + '"';
        clickButton('tell ' + assistant + ' ASSIST/reTell/' + msg);
    }
    function getNpcNameList() {
        var npcList = getNpcArr();
        var QixiaList = ['段老大', '二娘', '岳老三', '云老四', '剧盗', '恶棍', '流寇', '无一', '铁二', '追三', '冷四', '黄衣捕快', '红衣捕快', '锦衣捕快', "浪唤雨", "王蓉", "庞统", "李宇飞", "步惊鸿", "风行骓", "郭济", "吴缜", "风南", "火云邪神", "逆风舞", "狐苍雁", "护竺", "八部龙将", "玄月研", "狼居胥", "烈九州", "穆妙羽", "宇文无敌", "李玄霸", "风无痕", "厉沧若", "夏岳卿", "妙无心", "巫夜姬", "玄阴符兵", "金甲符兵", '任侠', '暗刺客', '金刀客', '追命', '无花', '传鹰', '令东来', '西门吹雪', '石之轩', '朱大天王', '楚昭南', '阿青', '楚留香', '天山童姥', '乾罗', '令狐冲', '乔峰', '浪翻云', '三少爷', '石幽明', '胡铁花', '蒙赤行', '厉工', '叶孤城', '祝玉妍', '萧秋水', '凌未风', '白猿', '石观音', '李秋水', '方夜羽', '东方不败', '慕容博', '庞斑', '燕十三'];
        var noCareNpc = QixiaList.join(',');
        var newArr = [];
        for (var i = 0; i < npcList.length; i++) {
            var npcName = npcList[i].split(',')[1];
            npcName = removeChart(npcName);
            if (noCareNpc.indexOf(npcName) < 0) {
                newArr.push(npcName);
            }
        }
        return newArr;
    }

    function setKilledQianlong1(txt) {
        stopOnTime = false;
        var qingmuNum = txt.split('：')[1].split('x')[1];
        console.log(txt);
        var getQingNum = qingmuNum / 50;
        if (getQingNum) {
            var killedName = qianlongNpcArray[getQingNum - 1];
            saveQianlongCookies(killedName, getQingNum - 1);
            console.log('根据青木判断已击杀：' + killedName)
        }
    }
    /**
     * 
     * 帮派本自动走
     */
    function autoBang1Way() {
        var dir = 's;e;e;e;e;e;e;e;e;e;w;w;w;w;w;w;e;e;e;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s';
        if (Base.getCorrectText('4253282')) {
            dir = 's;w;w;w;w;w;w;w;e;e;e;e;e;e;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s';
        }
        var name = TianJianNPCList1;
        GetNPCPath1(dir, name);
    }
    function GetNPCPath1(dir, name) {
        var peopleList = $(".cmd_click3");
        var thisonclick = null;
        var hasFindName = false;
        for (var i = 0; i < peopleList.length; i++) {
            thisonclick = peopleList[i].getAttribute('onclick');
            if (thisonclick != null && thisonclick.split("'")[1].split(" ")[0] == 'look_npc') {
                var targetCode = thisonclick.split("'")[1].split(" ")[1];
                if (name) {
                    if (isContains(name, peopleList[i].innerText)) {
                        // console.log("发现NPC名字：" + peopleList[i].innerText + "，代号：" + targetCode);
                        hasFindName = true;
                    }
                }
            }
        }
        if (peopleList.length > 0) {
            if (hasFindName) {
                setTimeout(function () {
                    GetNPCPath1(dir, name);
                }, 1000);
            } else {
                var d = dir.split(";");
                if (steps < d.length) {
                    clickButton(d[steps]);
                    steps += 1;
                    setTimeout(function () {
                        GetNPCPath1(dir, name);
                    }, 1000);
                } else {
                    sendToQQ('走完路线，结束走路');
                    if (Base.getCorrectText('4253282')) {
                        closeBangWay();
                    }
                    steps = 0;
                }
            }
        } else {
            setTimeout(function () {
                GetNPCPath1(dir, name);
            }, 1000);
        }
    }

    function closeBangWay() {
        var timeNum = 25 * 60 * 1000;
        var shortName = g_obj_map.get("msg_room").get("short");
        if (!shortName) {
            setTimeout(function () {
                closeBangWay();
            }, 3000);
            return;
        }
        if (shortName.indexOf("圣坛") >= 0) {
            timeNum = 5 * 60 * 1000;
        }
        console.log(timeNum);
        setTimeout(function () {
            startJianghu();
            tellBangClose();
            sendToQQ('打完副本继续挂机');
            openOnTime();
            closeTianJian();
        }, timeNum);
    }

    function clickWakuangBtn() {
        var dom = $('.btn-wakuang');
        if (dom.html() == '挖矿') {
            dom.trigger('click');
        }
    }
    // 关闭定时与潜龙
    function removeOnTime(type, way) {
        var dom = $('#btnOnTime');
        if (dom.html() == '取消定时') {
            dom.trigger('click');
        }
        var dom1 = $('#btn12');
        if (dom1.html() == '不监视') {
            dom1.trigger('click');
        }
        var dom2 = $('#btns5');
        if (dom2.html() == '不打雪山') {
            dom2.trigger('click');
        }
        if (Base.getCorrectText('4253282')) {
            openTianJian();
            setTimeout(function () {
                if (way) {
                    go(way);
                } else {
                    autoBang1Way();
                }
            }, 6000);
        } else if (type) {
            openTianJian();
            setTimeout(function () {
                autoBang1Way();
            }, 6000);
        }
    }
    // 开启定时与潜龙
    function openOnTime() {
        var dom = $('#btnOnTime');
        if (dom.html() == '定时任务') {
            dom.trigger('click');
        }
        // if (Base.getCorrectText('4253282')) {
        var dom1 = $('#btn12');
        if (dom1.html() == '监视潜龙') {
            dom1.trigger('click');
        }
        // }
        // var dom2 = $('#btns5');
        // if (dom2.html() == '打雪山') {
        //     dom2.trigger('click');
        // }
        closeTianJian();
    }
    function openTianJian() {
        var dom2 = $('#btn11');
        if (dom2.html() == '杀天剑') {
            dom2.trigger('click');
        }
    }
    function closeTianJian() {
        var dom2 = $('#btn11');
        if (dom2.html() == '停天剑') {
            dom2.trigger('click');
        }
    }
    function goPlaceAndFight(way, callback) {
        if (!hasGoToEnd() || !window.hasReachRoom || is_fighting) {
            setTimeout(function () {
                goPlaceAndFight(way, callback)
            }, 1000);
            return
        }
        var objs = [];
        if (g_obj_map.get("msg_room")){
            objs = g_obj_map.get("msg_room").elements.filter(function (item) {
                return item.key.indexOf("npc") == 0 && !isNaN(item.key.replace("npc", ""))
            });
        }
        if (objs.length > 0) {
            window.singleBattleTrigger = 1;
            window.singleBattleInstance = new window.singleBattle(function () {
                setTimeout(function () {
                    goPlaceAndFight(way, callback)
                }, 1000)
            });
            clickButton("kill " + objs[0].value.split(",")[0]);
            return
        }
        var ways = way.split(";");
        // console.log(ways);
        if (ways.length > 0) {
            window.hasReachRoom = false;
            // var wayWord = getDirectionFullName(ways.shift());
            var wayWord = ways.shift();
            // console.log(wayWord)
            if (wayWord) {
                // clickButton("go " + wayWord);
                go(wayWord);
                if (ways.length > 0) {
                    setTimeout(function () {
                        goPlaceAndFight(ways.join(";"), callback)
                    }, 300);
                }
            }
            return
        } else {
            // if (callback) {
            //     callback()
            // }
        }
    }
    function getDirectionFullName(sname) {
        switch (sname) {
            case "w":
                return "west";
            case "e":
                return "east";
            case "s":
                return "south";
            case "n":
                return "north";
            case "sw":
                return "southwest";
            case "se":
                return "southeast";
            case "ne":
                return "northeast";
            case "nw":
                return "northwest";
            default:
                return sname
        }
    }
    function MiGongNavi() {
        return {
            Append: function (name, cmd) {
                if ($("#out #MiGongNaviPanel").length == 0) {
                    $("#out table:eq(1)").after('<div id="MiGongNaviPanel"><div>马车：</div></div>')
                }
                // button.setAttribute("onClick", 'go("' + arr[i].way + '")');
                $("#out #MiGongNaviPanel").append('<button type="button" cellpadding="0" cellspacing="0" onclick="go(\'' + cmd + '\')" class="cmd_click3"><font style="color:yellow">' + name + "</font></button>")
            },
            Clear: function () {
                $("#out #MiGongNaviPanel").remove()
            }
        }
    }
    var miGongNavi = new MiGongNavi();

    function addMiGongWatch() {
        window.oldgSocketMsg2 = gSocketMsg2;
        gSocketMsg2.old_show_room = gSocketMsg2.show_room;
        gSocketMsg2.show_room = function () {
            gSocketMsg2.old_show_room();
            miGongNavi.Clear();
            var elements = g_obj_map.get("msg_room").elements;
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].value == 'task_quest') {
                    miGongNavi.Append("清空谜题", "auto_tasks cancel");
                    miGongNavi.Append("使用谜题卡", "items use miticska");
                    break;
                }
            }
            switch (g_obj_map.get("msg_room").get("map_id")) {
                case "mojiajiguancheng":
                    if (g_obj_map.get("msg_room").get("short") == "墨攻御阵" && g_obj_map.get("msg_room").get("south") == "云海山谷") {
                        miGongNavi.Append("机关城", "w;n;e;e;nw;w;ne;se;n;nw");
                    }
                    if (g_obj_map.get("msg_room").get("short") == "变化道" && g_obj_map.get("msg_room").get("west") == "神龙山") {
                        miGongNavi.Append("石板大道", "n;e;s;e;n;nw;e;nw");
                        miGongNavi.Append("盘龙湖", "s;e;s;ne;s;sw;nw;s;se;s");
                    }
                    if (g_obj_map.get("msg_room").get("short") == "变化道" && g_obj_map.get("msg_room").get("northwest") == "石板大道") {
                        miGongNavi.Append("神龙山", "e;se;s;w");
                    }
                    if (g_obj_map.get("msg_room").get("short") == "变化道" && g_obj_map.get("msg_room").get("south") == "盘龙湖") {
                        miGongNavi.Append("神龙山", "nw;w;ne;n;w");
                    }
                    break;
                case "miaojiang":
                    if (g_obj_map.get("msg_room").get("obj_p") == "4583") {
                        miGongNavi.Append("江边小路", "sw;e;e;sw;se;sw");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "4540") {
                        miGongNavi.Append("噬生沼泽", "s;s;e;n;n;e");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "4600") {
                        miGongNavi.Append("上山小路", "s;e;ne;s;sw;e;e;ne");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "4568") {
                        miGongNavi.Append("澜沧江南岸", "event_1_41385370;e;ne;nw;e;sw;se;s;ne;e;e;n;nw");
                    }
                    break;
                case "xiakedao":
                    if (g_obj_map.get("msg_room").get("short") == "瀑布") {
                        var pbbtn = '<button type="button" cellpadding="0" cellspacing="0" id="pbbtn" class="cmd_click3">去甬道</button>';
                        $("#out .out .cmd_click3:first").before(pbbtn).before("<br>");
                        $("body").off("click", "#pbbtn").on("click", "#pbbtn",
                            function () {
                                startJump();
                            })
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "4018") {
                        miGongNavi.Append("平原平地", "e;s;s;s");
                        miGongNavi.Append("养心居", "e;e;e;e");
                        miGongNavi.Append("石壁", "e;s;n;e;s");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "3987") {
                        miGongNavi.Append("土路", "n;w;w;w;s;w");
                        miGongNavi.Append("养心居", "n;n;e;e");
                        miGongNavi.Append("石壁", "n;w;n;e;s");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "4028") {
                        miGongNavi.Append("平原平地", "w;s;s;s;s");
                        miGongNavi.Append("土路", "w;w;w;w;s;w");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "3998") {
                        miGongNavi.Append("平原平地", "n;e;s;s");
                        miGongNavi.Append("土路", "n;w;w;s;w");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "3994") {
                        miGongNavi.Append("山顶", "n;n;n;e;ne;nw");
                        miGongNavi.Append("摩天崖", "n;e;e;ne");
                        miGongNavi.Append("木屋", "n;n;n;w;w");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "3992") {
                        miGongNavi.Append("后山山路", "se;s;s;s");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "3980") {
                        miGongNavi.Append("后山山路", "sw;s;s;s");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "3982") {
                        miGongNavi.Append("后山山路", "e;s;s;s");
                    }
                    break;
                case "binghuo":
                    if (g_obj_map.get("msg_room").get("obj_p") == "3931") {
                        miGongNavi.Append("彩虹瀑布", "nw;s;s;s;s;s;s;e");
                        miGongNavi.Append("雪松林海深处", "nw;s;s;s;s;s;s;w;w;n;e;n;w;w;s");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "3881") {
                        miGongNavi.Append("雪松林海深处", "w;w;w;n;e;n;w;w;s");
                        miGongNavi.Append("雪原温泉", "w;n;e;e;n;se");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "3930") {
                        miGongNavi.Append("彩虹瀑布", "n;n;s;s;s;s;e");
                        miGongNavi.Append("雪原温泉", "n;n;s;s;s;s;n;e;e;n;se");
                    }
                case "wudang":
                    if (g_obj_map.get("msg_room").get("short") == "山谷通道" && g_obj_map.get("msg_room").get("south") == "山谷口") {
                        miGongNavi.Append("环山之地", "sw;nw;w;ne");
                    }
                    break;
                case "baituo":
                    if (g_obj_map.get("msg_room").get("short") == "密林" && g_obj_map.get("msg_room").get("north") == "山庄大门") {
                        miGongNavi.Append("正堂", "sw;s;ne;e;s;s");
                    }
                    if (g_obj_map.get("msg_room").get("short") == "戈壁" && g_obj_map.get("msg_room").get("north") == "戈壁") {
                        miGongNavi.Append("天山", "jh 39");
                    }
                    break;
                case "tianshan":
                    if (g_obj_map.get("msg_room").get("short") == "官道" && g_obj_map.get("msg_room").get("northeast") == "官道") {
                        miGongNavi.Append("星星峡", "ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939");
                    }
                    if (g_obj_map.get("msg_room").get("short") == "天池瀑布") {
                        miGongNavi.Append("去白驼山", "jh 21");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "4448") {
                        miGongNavi.Append("大漠深处", "s;s;sw;n;nw;e;sw");
                    }
                    if (g_obj_map.get("msg_room").get("short") == "雪谷" && g_obj_map.get("msg_room").get("southeast") == "雪谷") {
                        miGongNavi.Append("失足岩", "se;s;e;n;ne;nw;event_1_58460791");
                        miGongNavi.Append("星星峡", "se;s;e;n;ne;nw;ne;nw;event_1_17801939");
                    }
                    if (g_obj_map.get("msg_room").get("short") == "星星峡") {
                        miGongNavi.Append("杨英雄", "ts2;ne;ne;nw;nw");
                    }
                    if (g_obj_map.get("msg_room").get("obj_p") == "4507") {
                        miGongNavi.Append("闭关室入口", "nw;n;ne;nw;nw;w;n;n;n;e;e;s");
                    }
                    break;
                case "luoyang":
                    if (g_obj_map.get("msg_room").get("obj_p") == "112") {
                        miGongNavi.Append("长安", "n;n;n;n;n;n;n;n;n;n;n;n;n;n");
                        miGongNavi.Append("矿场", "n;n;n;n;n;n;n;n;n;n;w;w");
                        miGongNavi.Append("五鼠广场", "n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n");
                        miGongNavi.Append("游记货栈", "n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w");
                    }
                    break;
                case "changan":
                    if (g_obj_map.get("msg_room").get("obj_p") == "4367") {
                        miGongNavi.Append("落魄池", "n;n;w;s;s;s;s;e;event_1_2215721");
                        miGongNavi.Append("凌烟阁", "n;n;n;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;event_1_95312623");
                        miGongNavi.Append("风花酒馆", "n;n;w;w;w;w;n;n;n;w");
                        miGongNavi.Append("游记货栈", "n;n;w;w;w;w;n;w");
                    }
                    break;
                case "yanyuecheng":
                    if (g_obj_map.get("msg_room").get("short") == "越女玉雕") {
                        miGongNavi.Append("百里原", "sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;sw;sw;sw");
                        miGongNavi.Append("璃云石", "sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw;nw;w");
                        miGongNavi.Append("千叶飞瀑", "n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e");
                    }
                    if (g_obj_map.get("msg_room").get("short") == "璃云石") {
                        miGongNavi.Append("百里原", "e;se;se;sw;sw;se;s;s;sw;sw;sw");
                    }
                    break;
                case "baidicheng":
                    if (g_obj_map.get("msg_room").get("short") == "岸边路" && g_obj_map.get("msg_room").get("southeast") == "岸边路") {
                        miGongNavi.Append("璇玑宫", "se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705");
                    }
                    break;
                case "xiliangcheng":
                    if (g_obj_map.get("msg_room").get("short") == "荒漠" && g_obj_map.get("msg_room").get("northeast") == "荒漠") {
                        miGongNavi.Append("铁剑", "ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n");
                    }
                    break;
                case "haiyunge":
                    if (g_obj_map.get("msg_room").get("short") == "海运镇" && g_obj_map.get("msg_room").get("north") == "海云镇") {
                        miGongNavi.Append("海云堂", "n;n;n;n;w;n;nw;n;n;ne;n;n;e;n;n;n;n;e;n;n;n;n;n;w;w;n;n;n;n;n;n;n;n");
                        miGongNavi.Append("雪山山脚", "n;n;n;n;w;n;nw;n;n;ne;n;n;e;n;n;n;n;e;n;n;n;n;n;w;w;n;n;n;n;n;n;e;e;e;e;e;e;s;e;e;ne;ne;e;se;se;se");
                    }
                    break;
                case "snow":
                    if (g_obj_map.get("msg_room").get("obj_p") == "21") {
                        miGongNavi.Append("沁芳阁", "rank go 160;w;w;w;w;w;n;n;n;e;e;e");
                    }
                    break;
                case "tangmen":
                    if (g_obj_map.get("msg_room").get("short") == "蜀山小径" && g_obj_map.get("msg_room").get("northeast") == "蜀道" && g_obj_map.get("msg_room").get("south") == "蜀山小径") {
                        miGongNavi.Append("七杀剑阁", "s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;");
                    }
                    break;
                case "murong":
                    if (g_obj_map.get("msg_room").get("obj_p") == "3197") {
                        miGongNavi.Append("孔府大门", "n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e")
                    }
                    break;
                case "youmingshanzhuang":
                    if (g_obj_map.get("msg_room").get("short") == "幽暗山路" && g_obj_map.get("msg_room").get("northeast") == "幽暗山路" && g_obj_map.get("msg_room").get("north") == undefined && g_obj_map.get("msg_room").get("northwest") == undefined && g_obj_map.get("msg_room").get("west") == undefined && g_obj_map.get("msg_room").get("southwest") == undefined && g_obj_map.get("msg_room").get("south") == undefined && g_obj_map.get("msg_room").get("southeast") == undefined && g_obj_map.get("msg_room").get("east") == undefined) {
                        miGongNavi.Append("闯入冥庄", "ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e;event_1_77775145")
                    }
                    break;
                case "huajie":
                    if (g_obj_map.get("msg_room").get("short") == "西城门" && g_obj_map.get("msg_room").get("east") == "花街") {
                        miGongNavi.Append("二楼", "e;e;e;e;e;e;e;e;n;n;n;e;e")
                    }
                    if (g_obj_map.get("msg_room").get("short") == "藏娇阁") {
                        var gwbtn2 = '<button type="button" cellpadding="0" cellspacing="0" id="gwbtn" class="cmd_click3">观舞</button>';
                        $("#out .out .cmd_click3:first").before(gwbtn2).before("<br>");
                        $("body").off("click", "#gwbtn").on("click", "#gwbtn",
                            function () {
                                var gwtimer = setInterval(function () {
                                    clickButton("event_1_5392021 go");
                                    if ($("#out2 .out2:contains('你今天已经观舞过了。')").length > 0) {
                                        clearInterval(gwtimer)
                                    }
                                },
                                    500)
                            })
                    }
                    if (g_obj_map.get("msg_room").get("short") == "沁芳阁") {
                        var gwbtn1 = '<button type="button" cellpadding="0" cellspacing="0" id="gwbtn" class="cmd_click3">观舞</button>';
                        $("#out .out .cmd_click3:first").before(gwbtn1).before("<br>");
                        $("body").off("click", "#gwbtn").on("click", "#gwbtn",
                            function () {
                                var gwtimer = setInterval(function () {
                                    clickButton("event_1_48561012 go");
                                    if ($("#out2 .out2:contains('你今天已经观舞过了。')").length > 0) {
                                        clearInterval(gwtimer)
                                    }
                                },
                                    500)
                            })
                    }
                    if (g_obj_map.get("msg_room").get("short") == "凝香阁") {
                        var gwbtn3 = '<button type="button" cellpadding="0" cellspacing="0" id="gwbtn" class="cmd_click3">观舞</button>';
                        $("#out .out .cmd_click3:first").before(gwbtn3).before("<br>");
                        $("body").off("click", "#gwbtn").on("click", "#gwbtn",
                            function () {
                                var gwtimer = setInterval(function () {
                                    clickButton("event_1_29896809 go");
                                    if ($("#out2 .out2:contains('你今天已经观舞过了。')").length > 0) {
                                        clearInterval(gwtimer)
                                    }
                                },
                                    500)
                            })
                    }
                    break;
                case "jiwutan":
                    if (g_obj_map.get("msg_room").get("short") == "泥泞小路" && g_obj_map.get("msg_room").get("east") == undefined && g_obj_map.get("msg_room").get("west") == "泥泞小路") {
                        var btn = '<button type="button" cellpadding="0" cellspacing="0" id="fbbtn" class="cmd_click3">开始</button>';
                        $("#out .out .cmd_click3:first").before(btn).before("<br>");
                        $("body").off("click", "#fbbtn").on("click", "#fbbtn",
                            function () {
                                goPlaceAndFight("w;s;e;e;e;e;e;nw;w;nw;nw;se;se;ne;se;nw;sw;nw;e;w;se;nw;ne;sw;se;nw;w;e;se;ne;n;s;sw;ne;ne;sw;sw;ne;e;w;sw;ne;nw;se;sw;nw;n;s;se;nw;sw;ne;se;ne;w;e;sw")
                            })
                    }
                    break;
                case "ymsz_qianyuan":
                    if (g_obj_map.get("msg_room").get("short") == "幽冥山庄前院") {
                        var btn = '<button type="button" cellpadding="0" cellspacing="0" id="qianyuanbtn" class="cmd_click3">开始</button>';
                        $("#out .out .cmd_click3:first").before(btn).before("<br>");
                        $("body").off("click", "#qianyuanbtn").on("click", "#qianyuanbtn",
                            function () {
                                goPlaceAndFight("e;e;n;s;s;n;e;e;ne;sw;s;s;s;e")
                            })
                    }
                    break;
                case "ymsz_huayuan":
                    if (g_obj_map.get("msg_room").get("short") == "幽冥山庄花园") {
                        var btn = '<button type="button" cellpadding="0" cellspacing="0" id="qianyuanbtn" class="cmd_click3">开始</button>';
                        $("#out .out .cmd_click3:first").before(btn).before("<br>");
                        $("body").off("click", "#qianyuanbtn").on("click", "#qianyuanbtn",
                            function () {
                                goPlaceAndFight("e;e;ne;nw;se;ne;ne;sw;se;se;e;w;sw;sw;se;nw;sw;sw")
                            })
                    }
                    break;
                case "ymsz_houyuan":
                    if (g_obj_map.get("msg_room").get("short") == "幽冥山庄后院") {
                        var btn = '<button type="button" cellpadding="0" cellspacing="0" id="houyuanbtn" class="cmd_click3">开始</button>';
                        $("#out .out .cmd_click3:first").before(btn).before("<br>");
                        $("body").off("click", "#houyuanbtn").on("click", "#houyuanbtn",
                            function () {
                                goPlaceAndFight("se;se;s;w;e;e;w;s;s;s;w;e;e;s;n;e;e;n;s;e;e;n;event_1_1121")
                            })
                    }
                    break;
                case "zhenwuwendao":
                    if (g_obj_map.get("msg_room").get("short") == "兑泽阁") {
                        var btn = '<button type="button" cellpadding="0" cellspacing="0" id="houyuanbtn" class="cmd_click3">开始</button>';
                        $("#out .out .cmd_click3:first").before(btn).before("<br>");
                        $("body").off("click", "#houyuanbtn").on("click", "#houyuanbtn",
                            function () {
                                goPlaceAndFight("n;n;n;n;n;n;n;n;n;n;n;n")
                            })
                    }
                    break;
                case "jingcheng":
                    if (g_obj_map.get("msg_room").get("short") == "入城大道" && g_obj_map.get("msg_room").get("south") == undefined && g_obj_map.get("msg_room").get("north") == "入城大道") {
                        miGongNavi.Append("青龙赌坊", "n;n;n;n;n;w;w;n");
                        miGongNavi.Append("通天塔", "n;n;n;n;n;n;n;n;n;e;e;ne;e;e;ne;ne;n;n");
                        miGongNavi.Append("红螺寺", "n;n;n;n;n;n;n;n;n;w;w;nw;w;n;n;n;w;nw;nw;nw;n")
                    }
                    break;
                case "yuewangjiangong":
                    if (g_obj_map.get("msg_room").get("short") == "欧余山路" && g_obj_map.get("msg_room").get("northeast") == "欧余山路" && g_obj_map.get("msg_room").get("southeast") == undefined && g_obj_map.get("msg_room").get("south") == undefined && g_obj_map.get("msg_room").get("north") == undefined && g_obj_map.get("msg_room").get("east") == undefined && g_obj_map.get("msg_room").get("north") == undefined && g_obj_map.get("msg_room").get("southwest") == undefined) {
                        miGongNavi.Append("铸剑洞", "ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n;n;ne");
                        miGongNavi.Append("越女剑楼", "ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;w")
                    }
                    break;
                case "jiangling":
                    if (g_obj_map.get("msg_room").get("short") == "霹雳门" && g_obj_map.get("msg_room").get("east") == "长平街") {
                        //clickButton('event_1_98432051 go gift1', 1)
                        miGongNavi.Append("买霹雳弹", "event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;");
                    }
                    // if (g_obj_map.get("msg_room").get("short") == "长平街" && g_obj_map.get("msg_room").get("north") == "长平街" && g_obj_map.get("msg_room").get("south") == undefined ) {
                    //     miGongNavi.Append("霹雳堂", "event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;event_1_98432051 go gift1;");
                    // }
                    break;
            }
            $("#out .out").html($("#out .out").html().replace("&nbsp;&nbsp;&nbsp;" + g_obj_map.get("msg_room").get("long"), '<div style="height:40px;overflow:hidden;">&nbsp;&nbsp;&nbsp;' + g_obj_map.get("msg_room").get("long") + "</div>"));
            var centertr = $("#out .out table:eq(1) td:has(.cmd_click_room)").parent("tr");
            if (centertr.prev().length == 0) {
                centertr.before("<tr><td></td><td></td><td></td></tr>")
            }
            if (centertr.next().length == 0) {
                centertr.after("<tr><td></td><td></td><td></td></tr>")
            }
            $("#out .out table:eq(1) td").css({
                "width": $(".cmd_click_room").width(),
                "height": $(".cmd_click_room").height()
            })
        };
    }
    /**
     * 
     * 
     */
    window.daoHangPlace = function (key) {
        var data = null;
        for (var i in hairsfalling) {
            if (key == i) {
                data = hairsfalling[i];
            }
        };
        for (var k in data) {
            InforOutFunc(k, data[k]);
            // var html = '<a style="text-decoration:underline;color:yellow" onclick=go("'+ data[k] + '")>' + k + '</a>';
            // WriteToScreen(html);
        }
        log('输出成功！');
    };
    // 获取同步潜龙信息
    function getOption() {
        if (!g_obj_map.get("msg_attrs") || !g_obj_map.get("msg_attrs").get('id')) {
            setTimeout(() => {
                getOption();
            }, 2000);
            return;
        }
        getQianlongMsg();
    }

    // 去做暴击
    function startQuestion(txt) {
        var txtSplit = txt.split('-');
        var name = txtSplit[1];
        var place = null;
        if (txtSplit.length > 2) {
            place = txtSplit[1];
            name = txtSplit[2];
        }
        var TargetName = name.trim(" ", "left").trim(" ", "right");
        var wayArr = [];

        if (place) {
            if(place == '明教'){
                place = '光明顶';
            }
            var placeData = hairsfalling[place];
            for (var k in placeData) {
                if (k.indexOf(TargetName) > -1) {
                    var way = placeData[k];
                    wayArr.push({ name: place + '-' + k, way: way, npc: k });
                }
            }
        } else {
            for (var j in hairsfalling) {
                for (var k in hairsfalling[j]) {
                    if (k.indexOf(TargetName) > -1) {
                        var way = hairsfalling[j][k];
                        wayArr.push({ name: j + '-' + k, way: way, npc: k });
                    }
                }
            }
        }

        addScreenBtn(wayArr);
        if (wayArr.length > 1) {
            var newArr = wayArr.filter(item => (item.npc == name));
            if(newArr.length >0){
                go(newArr[0].way);
                askGoQuestion(newArr[0].way, name);
                // setTimeout(() => {
                //     doAskNpc(name);
                //     setTimeout(() => {
                //         var href = $('.go-btn:last').attr('href');
                //         eval(href)
                //     }, 2000);
                // }, 10000); 
            }
        } else if (wayArr.length == 1) {
            go(wayArr[0].way);
            askGoQuestion(wayArr[0].way, name);
            // setTimeout(() => {
            //     doAskNpc(name);
            //     setTimeout(() => {
            //         var href = $('.go-btn:last').attr('href');
            //         eval(href)
            //     }, 2000);
            // }, 10000);
        }
    }

    function askGoQuestion(text, name){
        const textArr = text.split(';');
        setTimeout(() => {
            doAskNpc(name);
            setTimeout(() => {
                var href = $('.go-btn:last').attr('href');
                eval(href)
            }, 2000);
        }, textArr.length * 500 + 2000);
    }

    function doAskNpc(name) {
        var hasNpc = hasSamePerson(name);
        if (hasNpc.length > 0) {
            for (var j = 0; j < hasNpc.length; j++) {
                var npcId = hasNpc[j][0];
                if (npcId) {
                    clickButton('ask ' + npcId);
                }
            }
        }
    }

    function loadAfter() {
        // Base.init();
        // makePlaceBtns();
        // makeOtherBtns();
        // makeMoreBtns();
        // GetNewQiXiaList();
        baiu();
        hideButton();
        setTimeout(() => {
            btnInit();
            hideButton();
            addMiGongWatch();
            questionFn1();
            questionFn2();
            bindClickEvent(); 
            setTimeout(() => {
                $('#btn-watchQQ').trigger('click');
                setTimeout(() => {
                    goInLine();
                    setTimeout(() => {
                        var ip = `${returnCitySN["cip"]},${returnCitySN["cname"]}`;
                        var ipTxt = `我的IP：${ip}`;
                        goInLine(ipTxt);
                    }, 500);
                }, 1000);
            }, 1000);
        }, 1000);
        window.standForPuzzle = new StandForPuzzle();
        var doOntimeInterval = setInterval(function () {
            if (isAutoOn) {
                if (Base.getCorrectText('6984251') || Base.getCorrectText('6965572')) {
                    doOnTimeGuaJi();
                } else {
                    doOnTime();
                }
            }
        }, 15 * 60 * 1000);
        // getOption();
    }
    function goInLine(msg) {
        var name = g_obj_map.get("msg_attrs").get("name");
        all_userName = removeChart(name);
        msg = msg ? msg : `噔噔噔噔，${all_userName}上线了！`;
        // if (Base.getCorrectText('4253282')) {
            // var json_str = {
            //     "act": "101",
            //     "groupid": "291849393",
            // };
            // json_str["msg"] = '[CQ:at,qq=35994480] ' + msg;
            // console.log(json_str);
            // if (webSocket) webSocket.send(JSON.stringify(json_str));
            webSocket.send(JSON.stringify({
                message: msg,
                type: 'chat'
            }))
        // }
    }
    function addTuBtn(txt) {
        if (g_gmain.is_fighting) {
            warnning('战斗中');
            return;//战斗中
        }
        var btnArr = [];
        // chapList.forEach((item, index) => {
        //     if (txt.indexOf(item) > 0) {
        //         btnArr.push({ name: item, num: index + 1 });
        //     }
        // });
        var firstSplit = txt.split('前往');
        if (firstSplit.length > 0) {
            // if (txt.indexOf('游侠会') >= 0){
            //     btnArr = firstSplit[1].split('的路上')[0];
            // }else{
            btnArr = firstSplit[1].split('捕获')[0].split('，');
            // }
        } else {
            console.log('不符合' + txt);
            return false;
        }

        //13红14黑15红16红17黑18红
        var NPCNAME = txt.split('赐下')[1].split('VS')[0];    // 红
        var CookiesNpc = txt.split('赐下')[1].split('VS')[0]; // 黑
        if (killBadSwitch) {
            if (NPCNAME == '楚留香' || NPCNAME == '乾罗' || NPCNAME == '令狐冲' || NPCNAME == '浪翻云') {
                NPCNAME = txt.split('赐下')[1].split('VS')[0]; // 红
            } else {
                NPCNAME = txt.split('VS')[1].split('三对')[0]; // 黑
            }
        } else {
            if (NPCNAME == '楚留香' || NPCNAME == '乾罗' || NPCNAME == '令狐冲' || NPCNAME == '浪翻云') {
                NPCNAME = txt.split('VS')[1].split('三对')[0]; // 黑
            } else {
                NPCNAME = txt.split('赐下')[1].split('VS')[0]; // 红
            }
        }
        CookiesNpc = $.trim(CookiesNpc);
        NPCNAME = $.trim(NPCNAME);
        var arr = [];

        for (var i = 0; i < btnArr.length; i++) {
            arr.push({ name: btnArr[i] + '-' + NPCNAME, click: 'goFindNpcInPlace("' + btnArr[i] + '", "' + NPCNAME + '", 3)', type: 1 });
        }
        // btnArr.forEach((item) => {
        //     arr.push({ name: item + '-' + NPCNAME, click: 'goFindNpcInPlace("' + item + '", "' + NPCNAME + '", 3)', type: 1 });
        // });
        var index = isDoneThisQianlong(CookiesNpc);
        if (index != null) {
            arr.push({ name: '已记过' + CookiesNpc, type: 2, click: 'delBiaoji(this' + ',"' + index + '")' });
        } else {
            arr.push({ name: '标记' + CookiesNpc, click: 'saveQianlongCookies("' + CookiesNpc + '", null, this)', type: 1, stype: 1 });
        }
        addScreenBtn(arr);
        var doneNumber = getDoneQianlongNumber();
        if (doneNumber >= 6) {
            // console.log('已经杀满潜龙');
            return false;
        }
        // console.log('已经击杀' + doneNumber + '个潜龙');
        if (Jianshi.qianlong) {
            isOnstep1 = false;
            var qianlongIndex = getIndexFromArr(CookiesNpc, qianlongNpcArray);
            // 不到前几个
            if (qianlongIndex < 15 && CookiesNpc != '西门吹雪') {
                return false;
            }
            if (qianlongIndex < 16 && CookiesNpc != '西门吹雪' && isBigQiamlong()) {
                return false;
            }
            if (Base.getCorrectText('4253282')) {
                if (btnArr[0] != '峨眉山' && btnArr[0] != '铁血大旗门' && !btnArr[0].stype && btnArr[0] != '黑木崖') {
                    goFindNpcInPlace(btnArr[0], NPCNAME);
                } else if (btnArr[1] != '峨眉山' && btnArr[1] != '铁血大旗门' && !btnArr[1].stype && btnArr[1] != '黑木崖') {
                    goFindNpcInPlace(btnArr[1], NPCNAME);
                } else if (btnArr[2] != '峨眉山' && btnArr[2] != '铁血大旗门' && !btnArr[2].stype && btnArr[2] != '黑木崖') {
                    goFindNpcInPlace(btnArr[2], NPCNAME);
                }
            } else {
                var btnIndexArr = [];
                if (btnArr[0] != '峨眉山' && btnArr[0] != '铁血大旗门' && !btnArr[0].stype && btnArr[0] != '黑木崖') {
                    btnIndexArr.push(0);
                }
                if (btnArr[1] != '峨眉山' && btnArr[1] != '铁血大旗门' && !btnArr[1].stype && btnArr[1] != '黑木崖') {
                    btnIndexArr.push(1);
                }
                if (btnArr[2] != '峨眉山' && btnArr[2] != '铁血大旗门' && !btnArr[2].stype && btnArr[2] != '黑木崖') {
                    btnIndexArr.push(2);
                }
                var index = Math.floor((Math.random() * btnIndexArr.length));
                goFindNpcInPlace(btnArr[btnIndexArr[index]], NPCNAME);
            }
        }
    }

    function sideNpc(name) {
        var npcMap = {
            '杨肃观': '卢云',
            '荆无命': '阿飞',
            '顾惜朝': '戚少商',
            '风际中': '陈近南',
        };
        var sideName = '';
        for (var i in npcMap) {
            if (name.indexOf(i) > -1) {
                sideName = npcMap[name]
            }
        }
        return sideName;
    }

    function returnRuShiType() {
        var menpai = {
            "道": '武当、全真、茅山',
            "儒": '华山、步玄、慕容',
            "释": '少林、大理、峨眉',
            "异": '天邪、风花牧场、日月神教',
            "隐": '逍遥、桃花岛、唐门',
            "密": '青城、古墓、大昭',
        };
        var menpaiType = '';
        var new_key = my_family_name.replace('派', '');
        new_key = new_key.replace('世家', '');
        for (var i in menpai) {
            if (menpai[i].indexOf(new_key) > -1) {
                menpaiType = i;
            }
        }
        return menpaiType;
    }

    // 【系统】【江湖纷争】：镜星府、断剑山庄门派的荆无命剑客伤害同门，欺师灭组，判师而出，却有全真派、封山剑派坚持此种另有别情而强行庇护，两派纷争在越王剑宫-铸剑洞七层一触即发，江湖同门速速支援！
    // 【系统】【江湖纷争】：断剑山庄门派的风际中剑客伤害同门，欺师灭组，判师而出，却有风花牧场、白驼山派、逍遥派、大理段家、荣威镖局坚持此种另有别情而强行庇护，两派纷争在茅山-无名山峡谷一触即发，江湖同门速速支援！
    // 道、释流派的风际中剑客伤害同门，欺师灭组，判师而出，却有儒坚持此种另有别情而强行庇护，两派纷争在铁雪山庄-踏云小径一触即发，江湖同门速速支援！
    function addTuBtn1(txt) {
        if (g_gmain.is_fighting) {
            warnning('战斗中');
            return; // 战斗中
        }
        if (Jianshi.jianghuEnd){
            return; // 已经打完
        }
        var isRuShi = false;
        var rushiType = '';
        var userTitle = g_obj_map.get("msg_attrs").get("title");
        if (userTitle.indexOf('入室') > 0) {
            isRuShi = true;
            rushiType = returnRuShiType();
            console.log('您的入室类型：' + rushiType);
        }

        var place = '';

        var firstSplit = txt.split('两派纷争在');
        if (firstSplit.length > 0) {
            place = firstSplit[1].split('一触')[0].split('-')[0];
        } else {
            console.log('不符合' + txt);
            return false;
        }

        var npc = txt.split('剑客伤害')[0].split('派的')[1];
        console.log('npc:' + npc);

        if (!my_family_name) {
            console.log('未选择门派');
            return false;
        }
        var hours = getHours();

        if (rushiType.indexOf('道') < 0 && (hours > 5 && hours < 13)){
            return false;
        }

        if (hours < 6 && hours > 3) {
            if (npc != '风际中') {
                if (Jianshi.jianghu) {
                    if (firstSplit[0].indexOf(my_family_name) > 0) {
                        if (firstSplit[0].indexOf(my_family_name) < firstSplit[0].indexOf('欺师灭组')) {
                            npc = sideNpc(npc);
                            console.log('sideNpc:' + npc);
                        }
                        goFindNpcInPlace1(place, npc);
                        addJianghuToScreen(place, npc);
                    } else if (isRuShi && firstSplit[0].indexOf(rushiType) > 0) {
                        if (firstSplit[0].indexOf(rushiType) < firstSplit[0].indexOf('欺师灭组')) {
                            npc = sideNpc(npc);
                            console.log('sideNpc:' + npc);
                        }
                        goFindNpcInPlace1(place, npc);
                        addJianghuToScreen(place, npc);
                    }
                }
            }
        } else if (hours >= 6 && hours <= 18 ){
            if (npc != '风际中' && npc != '顾惜朝' && npc != '荆无命') {
                if (Jianshi.jianghu) {
                    if (firstSplit[0].indexOf(my_family_name) > 0) {
                        if (firstSplit[0].indexOf(my_family_name) < firstSplit[0].indexOf('欺师灭组')) {
                            npc = sideNpc(npc);
                            console.log('sideNpc:' + npc);
                        }
                        goFindNpcInPlace1(place, npc);
                        addJianghuToScreen(place, npc);
                    } else if (isRuShi && firstSplit[0].indexOf(rushiType) > 0) {
                        if (firstSplit[0].indexOf(rushiType) < firstSplit[0].indexOf('欺师灭组')) {
                            npc = sideNpc(npc);
                            console.log('sideNpc:' + npc);
                        }
                        goFindNpcInPlace1(place, npc);
                        addJianghuToScreen(place, npc);
                    }
                }
            }
        } else {
            if (npc != '风际中' && npc != '顾惜朝') {
                if (Jianshi.jianghu) {
                    if (firstSplit[0].indexOf(my_family_name) > 0) {
                        if (firstSplit[0].indexOf(my_family_name) < firstSplit[0].indexOf('欺师灭组')) {
                            npc = sideNpc(npc);
                            console.log('sideNpc:' + npc);
                        }
                        goFindNpcInPlace1(place, npc);
                        addJianghuToScreen(place, npc);
                    } else if (isRuShi && firstSplit[0].indexOf(rushiType) > 0) {
                        if (firstSplit[0].indexOf(rushiType) < firstSplit[0].indexOf('欺师灭组')) {
                            npc = sideNpc(npc);
                            console.log('sideNpc:' + npc);
                        }
                        goFindNpcInPlace1(place, npc);
                        addJianghuToScreen(place, npc);
                    }
                }
            }
        }
    }

    function addJianghuToScreen(place, npc) {
        var logText = '位置：' + place + '，NPC' + npc;
        log(logText);

        var arr = [];
        arr.push({ name: npc + '-' + place, click: 'goFindNpcInPlace1("' + place + '", "' + npc + '", 3)', type: 1 });
        addScreenBtn(arr);
    }

    function log(text) {
        var msg = new Map();
        msg.put('type', 'main_msg');
        msg.put('ctype', 'text');
        msg.put('msg', HIG + text);
        _dispatch_message(msg);
        console.log(text);
    }
    function warnning(text) {
        var msg = new Map();
        msg.put('type', 'main_msg');
        msg.put('ctype', 'text');
        msg.put('msg', RED + text);
        _dispatch_message(msg);
        console.log(text);
    }


    // 加载完后运行
    $(function () {
        // if (Base.getCorrectText('3594649') || Base.getCorrectText('4238943')) {
        //     bindKey();
        // }
        Base.init();
        makePlaceBtns();
        makeOtherBtns();
        makeMoreBtns();
        attach();
    });
    window.hasSendReload = false;
})();

var aotucangbaotuTrigger = 0;

dispatchMessageList.push(function (b) {
    var type = b.get("type"),
        msg = b.get("msg"),
        subtype = b.get("subtype");
    if (type == "channel" && subtype == "sys" && msg && msg.indexOf("今天你可是在我的地盘，看来你是在劫难逃！") > -1) {
        var lastlocation = "";
        var npc = "";
        var npcid = "";
        if (msg.indexOf("巫蛊王") > -1) {
            lastlocation = "n";
            npc = "巫蛊王";
            // npcid = $(cangbaotuRadio1).is(":checked") ? "changan_yunguanhai1" : "changan_wuguwang"
        } else {
            if (msg.indexOf("夜千麟") > -1) {
                lastlocation = "s";
                npc = "夜千麟";
                // npcid = $(cangbaotuRadio1).is(":checked") ? "changan_yiguogong1" : "changan_yeqianlin"
            } else {
                if (msg.indexOf("百毒旗主") > -1) {
                    lastlocation = "w";
                    npc = "百毒旗主";
                    // npcid = $(cangbaotuRadio1).is(":checked") ? "changan_heipaogong1" : "changan_baiduqizhu"
                } else {
                    if (msg.indexOf("十方恶神") > -1) {
                        lastlocation = "e";
                        npc = "十方恶神";
                        // npcid = $(cangbaotuRadio1).is(":checked") ? "changan_duguxuyu1" : "changan_shifangeshen"
                    }
                }
            }
        }
        var cmd = "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;e;event_1_2215721;" + lastlocation;
        writeToScreen("<span style='color:rgb(118, 235, 32)'>宝藏秘图碎片-" + npc + "</span> [<a href=\"javascript:go('" + cmd + "')\">GO</a>]", 2, 1);
    }
});
function addListener(listenList, funcname, func) {
    listenList[funcname] = func
}
function removeListener(listenList, funcname) {
    delete listenList[funcname]
}
function fireListener(listenList, args) {
    for (var name in listenList) {
        listenList[name].apply(this, args)
    }
}
function overrideclick(cmd) {
    deadlock = 1;
    cmdlist.push(cmd);
    deadlock = 0;
}
function newoverrideclick() {
    if (cmdlist.length == 0) {
        setTimeout(function () {
            newoverrideclick();
        }, 10);
    } else {
        if (cmdlist.length > 0 && deadlock == 1) {
            setTimeout(function () {
                newoverrideclick();
            }, 10);
        } else {
            if (deadlock == 0 && cmdlist.length > 0) {
                curstamp = (new Date()).valueOf();
                if ((curstamp - prestamp) > 200) {
                    if (cmdlist.length != 0) {
                        if (qiangdipiTrigger == 0) {
                            if (cmdlist[0].match("get1") == null) {
                                clickButton(cmdlist[0]);
                                cmdlist.shift();
                                prestamp = curstamp;
                            } else {
                                cmdlist.shift();
                                prestamp = curstamp;
                            }
                        } else {
                            if (qiangdipiTrigger == 1) {
                                if (cmdlist[0].match("get1") == null) {
                                    clickButton(cmdlist[0]);
                                    cmdlist.shift();
                                    prestamp = curstamp
                                } else {
                                    if (knownlist.indexOf(cmdlist[0].split("get1")[1]) < 0 && cmdlist[0].split("get1")[1].match("corpse") != null) {
                                        knownlist.push(cmdlist[0].split("get1")[1])
                                    }
                                    clickButton("get" + cmdlist[0].split("get1")[1]);
                                    cmdlist.shift();
                                    prestamp = curstamp
                                }
                            }
                        }
                    }
                    setTimeout(function () {
                        newoverrideclick()
                    }, 10);
                } else {
                    setTimeout(function () {
                        newoverrideclick()
                    }, 10);
                }
            }
        }
    }
}

function Base64() {
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64
            } else {
                if (isNaN(chr3)) {
                    enc4 = 64
                }
            }
            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4)
        }
        return output
    };
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2)
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3)
            }
        }
        output = _utf8_decode(output);
        return output
    };
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c)
            } else {
                if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128)
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128)
                }
            }
        }
        return utftext
    };
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++
            } else {
                if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3
                }
            }
        }
        return string
    }
}

// 无用跟随
function FollowUserClass() {
    addListener(show_userListener, "followuser",
        function () {
            if ($(".cusbtn-follow").length == 0) {
                var rank = g_obj_map.get("msg_attrs").get("rank").split("★")[0];
                var flg = g_obj_map.get("msg_user").get("long").indexOf(rank) > -1;
                flg = flg || (window.idcheck[i].indexOf(g_obj_map.get("msg_user").get("id")) > -1);
                if (flg) {
                    if ($("#out .out table:last tr:last td").length >= 4) {
                        $("#out .out table:last tr:last").append("<tr></tr>")
                    }
                    var name = g_obj_map.get("msg_user").get("name").replace(/^\[.*★\[2;37;0m/, "");
                    if (followuser.userName == name) {
                        $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="go1(\'cus|follow|\')" class="cmd_click2 cusbtn-follow">取消<br>跟随</button></td>')
                    } else {
                        $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="go1(\'cus|follow|' + name + '\')" class="cmd_click2 cusbtn-follow">跟随</button></td>')
                    }
                }
            }
        });
    addListener(show_scoreListener, "leaduser",
        function () {
            if ($(".cusbtn-follow").length == 0) {
                if ($("#out .out table:last tr:last td").length >= 4) {
                    $("#out .out table:last tr:last").append("<tr></tr>")
                }
                if (followuser.isLeader) {
                    $("#out .out table:last tr:last").append('<td><button type="button" onclick="go1(\'cus|leader|0\')" class="cmd_click2 cusbtn-follow">停止<br>带队</button></td>')
                } else {
                    $("#out .out table:last tr:last").append('<td><button type="button" onclick="go1(\'cus|leader|1\')" class="cmd_click2 cusbtn-follow">带队</button></td>')
                }
            }
        });
    return {
        allowedcmds: ["go", 'fb', 'rank', "fight", "kill", "escape", "jh", "open", "ask", "npc_datan", "give", "room_sousuo"],
        userName: "",
        follow: function (uname) {
            var that = this;
            that.userName = uname;
            var listenerName = "followUserListener";
            if (that.userName) {
                addListener(dispatchMessageListener, listenerName,
                    function (c) {
                        var a = c.get("type"),
                            b = c.get("subtype"),
                            d = c.get("msg");
                        var userName = that.userName;
                        if (a == "channel" && b == "clan") {
                            if (d.indexOf(userName) > 0) {
                                if (d.indexOf("【帮派】") > 0) {
                                    // href;0;clan【帮派】0[1;34m99号：Z-2-8-g-c-2-9-1-d-G-g-u-O-D-A-z-N-z-c-5-M-w-=-=[2; 37; 0m
                                    var cmd = d.replace("href;0;clan【帮派】0[1;34m" + userName + "：", "").replace("[2;37;0m", "");
                                    // var cmd = d.split('：')[1].replace("[2;37;0m", "");
                                    var base64 = new Base64();
                                    cmd = cmd.replace(/-/g, "");
                                    cmd = base64.decode(cmd);
                                    cmd = cmd.replace(/\n/g, "");
                                    console.log(cmd);
                                    if (that.allowedcmds.indexOf(cmd.split(" ")[0]) > -1 || cmd.indexOf("open") == 0 || cmd.indexOf("find_") == 0 || cmd.indexOf("event_") == 0 || cmd.indexOf("give_") == 0 || cmd === 'w' || cmd === 'e' || cmd === 's' || cmd === 'n' || cmd === 'se' || cmd === 'sw' || cmd === 'ne' || cmd === 'nw') {
                                        clickButton(cmd);
                                        if (cmd.indexOf("fight ") == 0 || cmd.indexOf("kill ") == 0) {
                                            setTimeout(function () {
                                                if (g_obj_map.get("msg_vs_info")) {
                                                    var vsinfo = g_obj_map.get("msg_vs_info").elements.filter(function (item) {
                                                        return item.key.indexOf("vs1_") == 0 && item.value == that.userName
                                                    });
                                                    $("#out2 .out2 td#" + vsinfo[0].key.replace("_name", "")).click()
                                                }
                                            },
                                                800)
                                        }
                                    }
                                }
                            }

                        }
                    })
            } else {
                removeListener(dispatchMessageListener, listenerName);
            }
            clickButton("score " + g_obj_map.get("msg_user").get("id"));
        },
        isLeader: false,
        toBeLeader: function (isLeader) {
            var that = this;
            that.isLeader = isLeader;
            var listenerName = "leadUserListener";
            if (that.isLeader) {
                addListener(clickButtonListener, listenerName,
                    function (cmd, e) {
                        if (that.allowedcmds.indexOf(cmd.split(" ")[0]) > -1 || cmd.indexOf("find_") == 0 || cmd.indexOf("open") == 0 || cmd.indexOf("event_") == 0 || cmd.indexOf("give_") == 0 || cmd === 'w' || cmd === 'e' || cmd === 's' || cmd === 'n' || cmd === 'se' || cmd === 'sw' || cmd === 'ne' || cmd === 'nw') {
                            var base64 = new Base64();
                            cmd = base64.encode(cmd);
                            cmd = cmd.split("").join("-");
                            // send("team chat " + cmd + "\n");
                            send("clan chat " + cmd + "\n")
                        }
                    })
            } else {
                removeListener(clickButtonListener, listenerName)
            }
            // clickButton("score")
        },
    }
}
var followuser = new FollowUserClass();

function StandForPuzzle() {
    var standForObj = {};
    return {
        add: function (puzzleid, objname, action, npcname) {
            standForObj[puzzleid] = {
                "objname": objname,
                "action": action,
                "npcname": npcname,
            };
            this.scan()
        },
        remove: function (puzzleid) {
            delete standForObj[puzzleid]
        },
        stand: function (c) {
            var type = c.get("type"),
                subType = c.get("subtype");
            if (type != "jh") {
                return
            }
            if (subType != "new_item" && subType != "new_npc") {
                return
            }
            var name = ansi_up.ansi_to_text(c.get("name")),
                id = c.get("id");
            if (subType == "new_item") {
                for (var key in standForObj) {
                    if (standForObj[key].objname == name) {
                        clickButton("get " + id)
                    } else {
                        if (standForObj[key].action == "killget" && (standForObj[key].npcname + "的尸体" == name || name == "腐烂的尸体" || name == "一具枯乾的骸骨")) {
                            clickButton("get " + id)
                        }
                    }
                }
            } else {
                if (subType == "new_npc") {
                    for (var key in standForObj) {
                        if (standForObj[key].objname == name || standForObj[key].npcname == name) {
                            if (standForObj[key].action == "killget") {
                                window.singleBattleTrigger = 1;
                                window.singleBattleInstance = new window.singleBattle();
                                clickButton("kill " + id)
                            } else {
                                clickButton(standForObj[key].action + " " + id);
                                if (standForObj[key].action == "npc_datan" || standForObj[key].action == "ask" || standForObj[key].action == "give") {
                                    this.remove(key)
                                }
                            }
                        }
                    }
                }
            }
        },
        scan: function () {
            var msg_room = g_obj_map.get("msg_room");
            for (var key in standForObj) {
                if (standForObj[key].action == "killget" || standForObj[key].action == "get") {
                    for (var i = 1; i <= msg_room.size(); i++) {
                        var objkey = "item" + i;
                        if (msg_room.containsKey(objkey)) {
                            var name = ansi_up.ansi_to_text(msg_room.get(objkey).split(",")[1]);
                            if (name == "") {
                                continue
                            }
                            var id = msg_room.get(objkey).split(",")[0];
                            if (name == standForObj[key].objname) {
                                clickButton("get " + id)
                            } else {
                                if (standForObj[key].action == "killget" && (name == standForObj[key].npcname + "的尸体" || name == "腐烂的尸体" || name == "一具枯乾的骸骨")) {
                                    clickButton("get " + id)
                                }
                            }
                        } else {
                            break
                        }
                    }
                }
                if (standForObj[key].action != "get") {
                    for (var i = 1; i <= msg_room.size(); i++) {
                        var objkey = "npc" + i;
                        if (msg_room.containsKey(objkey)) {
                            var name = ansi_up.ansi_to_text(msg_room.get(objkey).split(",")[1]);
                            if (name == "") {
                                continue
                            }
                            var id = msg_room.get(objkey).split(",")[0];
                            if (name == standForObj[key].npcname || name == standForObj[key].objname) {
                                if (standForObj[key].action == "killget") {
                                    window.singleBattleTrigger = 1;
                                    window.singleBattleInstance = new window.singleBattle();
                                    clickButton("kill " + id)
                                } else {
                                    clickButton(standForObj[key].action + " " + id)
                                }
                            }
                            if (standForObj[key].action == "npc_datan" || standForObj[key].action == "ask" || standForObj[key].action == "give") {
                                this.remove(key)
                            }
                        } else {
                            break
                        }
                    }
                }
            }
        },
        isstanding: function () {
            return !$.isEmptyObject(standForObj)
        },
        endstandingGet: function (str) {
            for (var key in standForObj) {
                if ((standForObj[key].action == "killget" || standForObj[key].action == "get") && str.indexOf(standForObj[key].objname) > -1) {
                    this.remove(key)
                }
            }
        },
        endstandingKill: function () {
            if (!g_obj_map.containsKey("msg_vs_info")) {
                return
            }
            for (var key in standForObj) {
                if (standForObj[key].action == "kill" || standForObj[key].action == "fight") {
                    for (var i = 1; i <= +g_obj_map.get("msg_vs_info").get("max_vs"); i++) {
                        if (g_obj_map.get("msg_vs_info").containsKey("vs2_name" + i) && ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs2_name" + i)) == standForObj[key].objname) {
                            this.remove(key)
                        }
                    }
                }
            }
        },
        getaction: function (puzzleid) {
            return (puzzleid in standForObj) ? standForObj[puzzleid].action : ""
        }
    }
}
function AutoPuzzle() {
    puzzleList = {};
    puzzleWating = {};
    return {
        puzzleList: puzzleList,
        puzzleWating: {},
        analyzePuzzle: function (puzzle) {
            var puzzleid = "";
            var publisherName = "";
            var targetName = "";
            var publisherResult = /<a[^>]*find_task_road2 [^>]*>((?!<a[^>]*>).)+<\/a>/.exec(puzzle);
            if (publisherResult && publisherResult.length > 0) {
                publisherName = publisherResult[0].replace(/<\/?a[^>]*>/g, "");
                if (publisherName.indexOf("-") > -1) {
                    publisherName = publisherName.split("-")[1]
                }
                publisherName = publisherName.replace(//g, "").replace(/^<\/span>/, "");
                var result1 = /find_task_road2 [^>^']*/.exec(publisherResult[0]);
                puzzleid = result1[0].replace(/find_task_road2 /g, "")
            }
            var targetResult = puzzle.match(/<a[^>]*find_task_road [^>]*>((?!<a[^>]*>).)+<\/a>/g);
            if (targetResult && targetResult.length > 0) {
                var targetInfoIndex = 0;
                if (/抢走了，去替我要回来吧！/.test(puzzle)) {
                    targetInfoIndex = targetResult.length - 1
                }
                targetName = targetResult[targetInfoIndex].replace(/<\/?a[^>]*>/g, "");
                if (targetName.indexOf("-") > -1) {
                    targetName = targetName.split("-")[1]
                }
                targetName = targetName.replace(//g, "").replace(/^<\/span>/, "");
                if (!puzzleid) {
                    var result1 = /find_task_road [^>^']*/.exec(targetResult[targetInfoIndex]);
                    puzzleid = result1[0].replace(/find_task_road /g, "")
                }
            }
            if (!puzzleid) {
                return ""
            }
            if (puzzleid in this.puzzleList) {
                $.extend(this.puzzleList[puzzleid], {
                    puzzle: puzzle,
                    publisherName: publisherName,
                    targetName: targetName,
                })
            } else {
                this.puzzleList[puzzleid] = {
                    puzzle: puzzle,
                    publisherName: publisherName,
                    targetName: targetName,
                    firstPublisherName: publisherName,
                    firstStep: puzzle.replace(/<[^>]*>/g, ""),
                    publisherMap: g_obj_map.get("msg_room").get("map_id"),
                    publisherRoom: g_obj_map.get("msg_room").get("short")
                }
            }
            return puzzleid
        },
        startpuzzle: function (puzzleid) {
            var puzzle = this.puzzleList[puzzleid].puzzle;
            if (/看上去好生奇怪，/.test(puzzle) || /鬼鬼祟祟的叫人生疑，/.test(puzzle)) {
                this.puzzleWating = {
                    puzzleid: puzzleid,
                    action: "npc_datan",
                    actionCode: "npc_datan",
                    target: window.puzzleList[puzzleid].targetName,
                    status: "start",
                }
            } else {
                if (/你一番打探，果然找到了一些线索，回去告诉/.test(puzzle) || /你一番搜索，果然找到了，回去告诉/.test(puzzle) || /好，我知道了。你回去转告/.test(puzzle) || /老老实实将东西交了出来，现在可以回去找/.test(puzzle) || /好，好，好，我知错了……你回去转告/.test(puzzle) || /脚一蹬，死了。现在可以回去找/.test(puzzle)) {
                    this.puzzleWating = {
                        puzzleid: puzzleid,
                        action: "answer",
                        actionCode: "ask",
                        target: window.puzzleList[puzzleid].publisherName,
                        status: "start"
                    }
                } else {
                    if (/我想找/.test(puzzle) || /我有个事情想找/.test(puzzle)) {
                        this.puzzleWating = {
                            puzzleid: puzzleid,
                            action: "ask",
                            actionCode: "ask",
                            target: window.puzzleList[puzzleid].targetName,
                            status: "start"
                        }
                    } else {
                        if (/我十分讨厌那/.test(puzzle) || /好大胆，竟敢拿走了我的/.test(puzzle) || /竟敢得罪我/.test(puzzle) || /抢走了，去替我要回来吧！/.test(puzzle) || /十分嚣张，去让[他她]见识见识厉害！/.test(puzzle)) {
                            this.puzzleWating = {
                                puzzleid: puzzleid,
                                action: "fight",
                                actionCode: "fight",
                                target: window.puzzleList[puzzleid].targetName,
                                status: "start"
                            }
                        } else {
                            if (/上次我不小心，竟然吃了/.test(puzzle) || /竟对我横眉瞪眼的，真想杀掉[他她]！/.test(puzzle) || /昨天捡到了我几十辆银子，拒不归还。钱是小事，但人品可不好。/.test(puzzle)) {
                                this.puzzleWating = {
                                    puzzleid: puzzleid,
                                    action: "kill",
                                    actionCode: "kill",
                                    target: window.puzzleList[puzzleid].targetName,
                                    status: "start"
                                }
                            } else {
                                if (/突然想要一/.test(puzzle) || /唉，好想要一/.test(puzzle)) {
                                    this.puzzleWating = {
                                        puzzleid: puzzleid,
                                        action: "get",
                                        actionCode: "get",
                                        target: window.puzzleList[puzzleid].targetName,
                                        status: "start",
                                    }
                                } else {
                                    if (/可前去寻找/.test(puzzle)) {
                                        this.puzzleWating = {
                                            puzzleid: puzzleid,
                                            action: "room_sousuo",
                                            actionCode: "room_sousuo",
                                            target: "",
                                            status: "start"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.gotoPuzzle(puzzleid)
        },
        gotoPuzzle: function (puzzleid) {
            if (puzzleid != this.puzzleWating.puzzleid) {
                return
            }
            var that = this;
            switch (this.puzzleWating.action) {
                case "npc_datan":
                case "ask":
                case "fight":
                case "kill":
                case "room_sousuo":
                    this.puzzleWating.status = "trace";
                    go1("find_task_road " + puzzleid);
                    break;
                case "get":
                    if (g_obj_map.get("msg_room").get("map_id") == this.puzzleList[puzzleid].publisherMap && g_obj_map.get("msg_room").get("short") == this.puzzleList[puzzleid].publisherRoom) {
                        var npc = g_obj_map.get("msg_room").elements.filter(function (item) {
                            return item.key.indexOf("npc") == 0 && that.ansiToHtml(item.value.split(",")[1]) == that.puzzleList[puzzleid].publisherName
                        });
                        if (npc.length > 0) {
                            this.puzzleWating.waitTimer = setTimeout(function () {
                                that.puzzleWating.status = "trace";
                                go1("find_task_road " + puzzleid)
                            },
                                2000);
                            this.puzzleWating.status = "give";
                            var npcArr = {};
                            for (var i = 0; i < npc.length; i++) {
                                var npcinfo = npc[i].value.split(",");
                                npcArr[npcinfo[0]] = npc[i]
                            }
                            this.puzzleWating.waitCount = 0;
                            for (var npcid in npcArr) {
                                go1("give " + npc[0].value.split(",")[0]);
                                this.puzzleWating.waitCount++
                            }
                            return
                        }
                    }
                    this.puzzleWating.status = "trace";
                    go1("find_task_road " + puzzleid);
                    break;
                case "answer":
                    this.puzzleWating.status = "trace";
                    go1("find_task_road2 " + puzzleid);
                    break
            }
        },
        doPuzzle: function (puzzleid) {
            if (puzzleid != this.puzzleWating.puzzleid) {
                return
            }
            var that = this;
            switch (this.puzzleWating.action) {
                case "npc_datan":
                case "answer":
                case "ask":
                case "fight":
                case "kill":
                    that.puzzleWating.status = "wait";
                    var npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                        return item.key.indexOf("npc") == 0 && that.ansiToHtml(item.value.split(",")[1]) == that.puzzleWating.target
                    });
                    if (npcs.length > 0) {
                        var distinctNpcs = {};
                        for (var i = 0; i < npcs.length; i++) {
                            distinctNpcs[npcs[i].value.split(",")[0]] = 1
                        }
                        if (this.puzzleWating.action == "fight") {
                            for (var npcid in distinctNpcs) {
                                go1("fight " + npcid);
                                go1("kill " + npcid)
                            }
                        } else {
                            for (var npcid in distinctNpcs) {
                                go1(this.puzzleWating.actionCode + " " + npcid)
                            }
                        }
                    }
                    break;
                case "get":
                    if (that.puzzleWating.status == "traced") {
                        that.puzzleWating.status = "wait";
                        var objs = g_obj_map.get("msg_room").elements.filter(function (item) {
                            return item.key.indexOf("item") == 0 && that.ansiToHtml(item.value.split(",")[1]) == that.puzzleWating.target
                        });
                        if (objs.length > 0) {
                            for (var index in objs) {
                                go1("get " + objs[index].value.split(",")[0])
                            }
                        } else {
                            var npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                                return item.key.indexOf("npc") == 0 && !isNaN(item.key.replace("npc", "")) && item.value.indexOf("金甲符兵") == -1 && item.value.indexOf("玄阴符兵") == -1
                            });
                            that.lookNpcForBuy(npcs,
                                function () {
                                    that.puzzleWating.status = "return";
                                    go1("find_task_road2 " + puzzleid)
                                },
                                function () {
                                    npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                                        return item.key.indexOf("npc") == 0 && !isNaN(item.key.replace("npc", "")) && item.value.indexOf("金甲符兵") == -1 && item.value.indexOf("玄阴符兵") == -1
                                    });
                                    that.lookNpcForKillGet(npcs)
                                })
                        }
                    } else {
                        if (that.puzzleWating.status == "returned") {
                            var npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                                return item.key.indexOf("npc") == 0 && that.ansiToHtml(item.value.split(",")[1]) == that.puzzleWating.target
                            });
                            if (npcs.length > 0) {
                                for (var index in npcs) {
                                    if (npcs[index].value) go1("give " + npcs[index].value.split(",")[0])
                                }
                            }
                        }
                    }
                    break;
                case "room_sousuo":
                    go1("room_sousuo");
                    break
            }
        },
        lookNpcForBuy: function (npcs, foundcallback, notfoundcallback) {
            if (this.puzzleWating.actionCode != "get") {
                return
            }
            if (npcs.length > 0) {
                var that = this;
                var npc = npcs.shift();
                var npcid = npc.value.split(",")[0];
                go1("look_npc " + npcid);
                setTimeout(function () {
                    that.getNpcInfoForBuy(npcid, npcs, foundcallback, notfoundcallback)
                },
                    200)
            } else {
                if (notfoundcallback) {
                    notfoundcallback()
                }
            }
        },
        getNpcInfoForBuy: function (npcid, othernpcs, foundcallback, notfoundcallback) {
            if (this.puzzleWating.actionCode != "get") {
                return
            }
            var that = this;
            if (!g_obj_map.get("msg_npc") || g_obj_map.get("msg_npc").get("id") != npcid) {
                setTimeout(function () {
                    that.getNpcInfoForBuy(npcid, othernpcs, foundcallback, notfoundcallback)
                },
                    200);
                return
            }
            cmds = g_obj_map.get("msg_npc").elements.filter(function (item) {
                return item.value == "购买"
            });
            if (cmds.length > 0) {
                go1("buy " + npcid);
                setTimeout(function () {
                    that.getNpcBuyInfo(npcid, othernpcs, foundcallback, notfoundcallback)
                },
                    200)
            } else {
                if (othernpcs.length > 0) {
                    var npc = othernpcs.shift();
                    var npcid = npc.value.split(",")[0];
                    go1("look_npc " + npcid);
                    setTimeout(function () {
                        that.getNpcInfoForBuy(npcid, othernpcs, foundcallback, notfoundcallback)
                    }, 200)
                } else {
                    if (notfoundcallback) {
                        notfoundcallback()
                    }
                }
            }
        },
        getNpcBuyInfo: function (npcid, othernpcs, foundcallback, notfoundcallback) {
            if (this.puzzleWating.actionCode != "get") {
                return
            }
            var that = this;
            if (!g_obj_map.get("msg_buys") || g_obj_map.get("msg_buys").get("npcid") != npcid) {
                setTimeout(function () {
                    that.getNpcBuyInfo(npcid, othernpcs, foundcallback, notfoundcallback)
                },
                    200);
                return
            }
            var buyitems = g_obj_map.get("msg_buys").elements.filter(function (item) {
                return item.key.indexOf("item") == 0 && that.ansiToHtml(item.value.split(",")[1]) == that.puzzleWating.target
            });
            if (buyitems.length > 0) {
                for (var i = 0; i < buyitems.length; i++) {
                    go1("buy " + buyitems[i].value.split(",")[0] + " from " + npcid)
                }
                if (foundcallback) {
                    foundcallback()
                }
            } else {
                if (othernpcs.length > 0) {
                    var npc = othernpcs.shift();
                    var npcid = npc.value.split(",")[0];
                    go1("look_npc " + npcid);
                    setTimeout(function () {
                        that.getNpcInfoForBuy(npcid, othernpcs, foundcallback, notfoundcallback)
                    },
                        200)
                } else {
                    if (notfoundcallback) {
                        notfoundcallback()
                    }
                }
            }
        },
        lookNpcForKillGet: function (npcs, foundcallback, notfoundcallback) {
            if (this.puzzleWating.actionCode != "get") {
                return
            }
            if (npcs.length > 0) {
                var that = this;
                var npc = npcs.shift();
                var npcid = npc.value.split(",")[0];
                go1("look_npc " + npcid);
                setTimeout(function () {
                    that.getNpcInfoForKillGet(npcid, npcs, foundcallback, notfoundcallback)
                },
                    200)
            } else {
                if (notfoundcallback) {
                    notfoundcallback()
                }
            }
        },
        getNpcInfoForKillGet: function (npcid, othernpcs, foundcallback, notfoundcallback) {
            if (this.puzzleWating.actionCode != "get") {
                return
            }
            var that = this;
            if (!g_obj_map.get("msg_npc") || g_obj_map.get("msg_npc").get("id") != npcid) {
                setTimeout(function () {
                    that.getNpcInfoForKillGet(npcid, othernpcs, foundcallback, notfoundcallback)
                },
                    200);
                return
            }
            cmds = g_obj_map.get("msg_npc").elements.filter(function (item) {
                return item.value == "杀死"
            });
            if (cmds.length > 0 && g_obj_map.get("msg_npc").get("long").indexOf(that.puzzleWating.target) > -1) {
                that.puzzleWating.waitTarget = npcid;
                go1("kill " + npcid);
                if (foundcallback) {
                    foundcallback()
                }
            } else {
                if (othernpcs.length > 0) {
                    var npc = othernpcs.shift();
                    var npcid = npc.value.split(",")[0];
                    go1("look_npc " + npcid);
                    setTimeout(function () {
                        that.getNpcInfoForKillGet(npcid, othernpcs, foundcallback, notfoundcallback)
                    },
                        200)
                } else {
                    if (notfoundcallback) {
                        notfoundcallback()
                    }
                }
            }
        },
        puzzlekillget: function () {
            var npcname = prompt("请输入要杀的npc名称", "");
            if (npcname) {
                this.puzzleWating.actionCode = "killget";
                this.puzzleWating.waitTargetName = npcname
            }
        },
        ansiToHtml: function (str) {
            return ansi_up.ansi_to_html(str).replace(//g, "")
        },
        puzzlesubmit: function (puzzleid) {
            var serverurl = "http://www.11for.cn:8100/home/log";
            var mapList = {
                "snow": "雪亭镇",
                "luoyang": "洛阳",
                "huashancun": "华山村",
                "huashan": "华山",
                "yangzhou": "扬州",
                "gaibang": "丐帮",
                "choyin": "乔阴县",
                "emei": "峨眉山",
                "henshan": "恒山",
                "wudang": "武当山",
                "latemoon": "晚月庄",
                "waterfog": "水烟阁",
                "shaolin": "少林寺",
                "tangmen": "唐门",
                "qingcheng": "青城山",
                "xiaoyao": "逍遥林",
                "kaifeng": "开封",
                "mingjiao": "光明顶",
                "quanzhen": "全真教",
                "gumu": "古墓",
                "baituo": "白驮山",
                "songshan": "嵩山",
                "meizhuang": "寒梅庄",
                "taishan": "泰山",
                "tieflag": "大旗门",
                "guanwai": "大昭寺",
                "heimuya": "魔教",
                "xingxiu": "星宿海",
                "taoguan": "茅山",
                "taohua": "桃花岛",
                "resort": "铁雪山庄",
                "murong": "慕容山庄",
                "dali": "大理",
                "duanjian": "断剑山庄",
                "binghuo": "冰火岛",
                "xiakedao": "侠客岛",
                "jueqinggu": "绝情谷",
                "bihaishanzhuang": "碧海山庄",
                "tianshan": "天山",
                "miaojiang": "苗疆",
                "baidicheng": "白帝城",
                "mojiajiguancheng": "墨家机关城",
                "yanyuecheng": "掩月城",
                "haiyunge": "海云阁",
                "beiyinxiang": "洛阳",
                "yingoudufang": "洛阳",
                "baizhong": "洛阳",
                "tudimiao": "华山村",
                "qingfengzhai": "华山村",
                "tianshengxia": "华山",
                "luoyanya": "华山",
                "wuqiku": "华山",
                "wuguan": "扬州",
                "yangzhouguanya": "扬州",
                "zuixianlou": "扬州",
                "zizhiyu": "恒山",
                "qinqitai": "恒山",
                "luohantang": "少林寺",
                "banruotang": "少林寺",
                "yezhulin": "开封",
                "yuwangtai": "开封",
                "moyundong": "嵩山",
                "jishanlvgu": "嵩山",
                "xinglinxiaoyuan": "寒梅庄",
                "hudidinao": "寒梅庄",
                "heilongtan": "泰山",
                "tianshengzhai": "泰山",
                "yuhuangding": "泰山",
            };
            var mapname = mapList[this.puzzleList[puzzleid].publisherMap] ? mapList[this.puzzleList[puzzleid].publisherMap] : this.puzzleList[puzzleid].publisherMap;
            var value = this.puzzleList[puzzleid].prize + "\n位置：" + mapname + "-" + ansi_up.ansi_to_html(this.puzzleList[puzzleid].publisherRoom).replace(/<[^>]*>/g, "") + "\n首步：" + this.puzzleList[puzzleid].firstStep;
            // console.log(value);
            $.post(serverurl, {
                value: value
            })
        }
    }
}
newoverrideclick();
function Qiang() {
    this.dispatchMessage = function (b) {
        var type = b.get("type"),
            subType = b.get("subtype");
        if (type == "jh" && subType == "new_item") {
            clickButton("get " + b.get("id"))
        }
    }
}
var qiang = new Qiang;
// var lingshi = new Lingshi();
// window.gameOption = {LingshiSwitch: false};
// setTimeout(function () {
//     if (gameOption && gameOption.LingshiSwitch) {
//         lingshi.init()
//     }
// },3000);
function GoSlowAction(cmds) {
    if (cmds.length <= 0) {
        return
    }
    if (!hasGoToEnd()) {
        setTimeout(function () {
            GoSlowAction(cmds)
        },
            200);
        return
    }
    var cmd = cmds.shift();
    if (cmd == "delay") {
        setTimeout(function () {
            GoSlowAction(cmds)
        },
            200);
        return
    }
    go(cmd);
    setTimeout(function () {
        GoSlowAction(cmds)
    },
        200)
}
function openXiang(obj, obj1) {
    var items = g_obj_map.get("msg_items").elements.filter(function (item) {
        return item.key.indexOf("items") > -1
    });
    var cmds = [];
    var itemId = null;
    var itemName = null;
    var itemNums = 0;
    var itemNums0 = 0;

    var itemId1 = null;
    var itemName1 = null;
    var itemNums1 = 0;

    for (var i = 0; i < items.length; i++) {
        var id = items[i].value.split(",")[0];
        var name = items[i].value.split(",")[1];
        var nums = items[i].value.split(",")[2];
        var txt = g_simul_efun.replaceControlCharBlank(
            name.replace(/\u0003.*?\u0003/g, "")
        );
        if (txt.indexOf(obj) != '-1') {
            itemId = id;
            itemName = txt;
            itemNums = nums;
            break;
        }
    }
    itemNums0 = itemNums;
    if (obj1) {
        for (var i = 0; i < items.length; i++) {
            var id = items[i].value.split(",")[0];
            var name = items[i].value.split(",")[1];
            var nums = items[i].value.split(",")[2];
            var txt = g_simul_efun.replaceControlCharBlank(
                name.replace(/\u0003.*?\u0003/g, "")
            );
            // console.log(id + '----' + txt)
            if (txt.indexOf(obj1) != '-1') {
                itemId1 = id;
                itemName1 = txt;
                itemNums1 = nums;
                break;
            }
        }
        if (itemNums1) {
            if (itemNums1 * 1 > itemNums * 1) {
                itemNums0 = itemNums;
            } else {
                itemNums0 = itemNums1;
            }
            openXiangCode(itemId, itemNums0)
        }
    } else {
        openXiangCode(itemId, itemNums0)
    }
    // if (cmds.length > 0) {
    //     GoSlowAction(cmds)
    // }
}
function openXiangCode(id, num) {
    console.log(id + '--' + num);
    if (id == 'huangjin box' || id == 'obj_box3' || id == 'obj_yaoyubaoxiang') {
        if (num / 100 > 0) {
            var doNum = parseInt(num / 10);
            for (var i = 0; i < doNum * 10; i++) {
                go('items use ' + id);
            }
        }
    } else {
        if (num / 100 > 0) {
            var doNum = parseInt(num / 100) + 1;
            for (var i = 0; i < doNum; i++) {
                go('items use ' + id + "_N_100");
            }
        } else if (num / 30 > 0) {
            var doNum = parseInt(num / 30) + 1;
            for (var i = 0; i < doNum; i++) {
                go('items use ' + id + "_N_30");
            }
        } else if (num / 10 > 0) {
            var doNum = parseInt(num / 10) + 1;
            for (var i = 0; i < doNum; i++) {
                go('items use ' + id + "_N_10");
            }
        } else {
            go('items use ' + id + "_N_10");
        }
    }

    //clickButton(\'items use ' + item.get("id") + "_N_" + item.get("amount") + '\', 1)
    //clickButton('items use obj_yaoyubaoxiang', 0)
}
window.spliteALlItem = function (text) {
    var itemArr = text.split(',');
    var id = itemArr[0];
    var amount = itemArr[1];
    if (amount > 100) {
        var useTimes = amount / 100;
        var useLeast = amount % 100;
        useTimes = parseInt(useTimes);
        for (var i = 0; i < useTimes; i++) {
            go('items splite ' + id + '_N_100');
        }
        if (useLeast > 0) {
            go('items splite ' + id + '_N_' + useLeast);
        }
    } else {
        clickButton('items splite ' + id + '_N_' + amount);
    }
    // 'onclick="clickButton(\'items use ' + item.get("id") + "_N_" + item.get("amount") + '\', 1)"'
};
window.userALlItem = function (text) {
    var itemArr = text.split(',');
    var id = itemArr[0];
    var amount = itemArr[1];
    if (amount > 100) {
        var useTimes = amount / 100;
        var useLeast = amount % 100;
        useTimes = parseInt(useTimes);
        for (var i = 0; i < useTimes; i++) {
            go('items use ' + id + '_N_100');
        }
        if (useLeast > 0) {
            go('items use ' + id + '_N_' + useLeast);
        }
    } else {
        clickButton('items use ' + id + '_N_' + amount);
    }
    // 'onclick="clickButton(\'items use ' + item.get("id") + "_N_" + item.get("amount") + '\', 1)"'
};
window.userALlKuangItem = function (text) {
    var itemArr = text.split(',');
    var id = itemArr[0];
    var amount = itemArr[1];
    if (amount > 100) {
        var useTimes = amount / 100;
        var useLeast = amount % 100;
        useTimes = parseInt(useTimes);
        for (var i = 0; i < useTimes; i++) {
            go('' + id + '');
        }
    }
    // 'onclick="clickButton(\'items use ' + item.get("id") + "_N_" + item.get("amount") + '\', 1)"'
};
window.mokeALlItem = function (text) {
    var itemArr = text.split(',');
    var id = itemArr[0];
    var amount = itemArr[1];

    for (var i = 0; i < amount; i++) {
        go('moke ' + id);
    }

    // 'onclick="clickButton(\'items use ' + item.get("id") + "_N_" + item.get("amount") + '\', 1)"'
};


var url = 'http://47.94.105.83:9099/test';	//服务器地址

var version = 't3.1.87-200120';
function clearTrigger() {
    TriggerFuc = function () { }
}
var _$ = function (url, param, fun = function () { }, errorFun = function () { }) {
    param.version = version;
    $.ajax({
        type: "post",
        url: url,
        // timeout:2000,
        data: param,
        cache: false,
        dataType: 'jsonp',
        jsonp: 'jsonpCallback',
        tryCount: 0,
        retryLimit: 3,
        success: function (data) {
            if (data != null) {
                if (data.code != 200) {
                    InforOutFunc(data.msg);
                    //return;
                }
                fun(data);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + ' --- ' + errorThrown);
            console.log(XMLHttpRequest);
            this.tryCount++;
            errorFun();
            return;
            if (this.tryCount <= this.retryLimit) {
                //try again
                $.ajax(this);
                return;
            }
        }
    });
};
// 答题
function answerQuestions21() {
    if (answerTrigger == 0) return;
    TriggerFuc = function (b) {
        var type = b.get('type');
        var ll, l;
        if (type == 'show_html_page') {
            var msg = b.get('msg');
            if (msg.indexOf('回答正确') > -1) {
                clearTrigger();
                setTimeout(answerQuestions, cmdDelayTime);
                return;
            } else if (msg.indexOf('回答错误') > -1) {
                clearTrigger();
                InforOutFunc('回答错误');
                setTimeout(answerQuestions, 300);
                return;
            }
            l = msg.split(/\n/g);
            if (l.length > 2 && l[0].match(/知识问答第 (.*)\/(.*) 题<\/p>/)) {
                var question = g_simul_efun.replaceControlCharBlank(l[1]);
                if (question.trim() == '')
                    question = g_simul_efun.replaceControlCharBlank(l[2]);
                var param = {
                    types: 'answerQuestion',
                    question: question,
                    userID: g_obj_map.get("msg_attrs").get('id'),
                    qu: g_area_id,
                };
                _$(url, param, function (data) {
                    var aswdata = data.data;
                    if (!aswdata) {
                        InforOutFunc('没有找到答案！！');
                        return;
                    }
                    clickButton('question ' + aswdata);
                }, function () {
                    InforOutFunc('没有找到答案！！');
                });
            }
        } else if (type == 'notice' && b.get('msg').indexOf('每日武林知识问答次数已经达到限额') > -1) {
            console.log('完成自动答题！');
            clearTrigger();
            answerTrigger = 0;
            $('#btno4').trigger('click');
            return;
        }
    };
    clickButton('question')
}

function append_button(btn) {
    var $tr = $('#out > span.out button.cmd_click2:last').parent('td').parent();
    if ($('> td', $tr).length >= 4) {
        var $tbl = $tr.parent();
        $tr = $('<tr></tr>');
        $tbl.append($tr);
    }
    $tr.append(btn);
}

var TriggerFuc = function () { };

function questionFn1() {
    window.go1 = function (dir) {
        dir = $.trim(dir);
        if (dir.indexOf("cus|") == 0) {
            var dirarr = dir.split("|");
            switch (dirarr[1]) {
                case "talk":
                    talkparamarr = dirarr[2].split(",");
                    custalkQX(talkparamarr[0], talkparamarr[1]);
                    return;
                case "playCustomSkill_0":
                    customSkillClass.playCustomSkill(0);
                    return;
                case "playCustomSkill_1":
                    customSkillClass.playCustomSkill(1);
                    return;
                case "setCustomSkill_0":
                    customSkillClass.setCustomSkill(0);
                    return;
                case "setCustomSkill_1":
                    customSkillClass.setCustomSkill(1);
                    return;
                case "setCustomSkillName_0":
                    customSkillClass.setCustomSkillName(0);
                    return;
                case "setCustomSkillName_1":
                    customSkillClass.setCustomSkillName(1);
                    return;
                case "standforpuzzle":
                    var npcname = "";
                    if (dirarr[4] == "killget") {
                        npcname = prompt("请输入要杀的npc名称", "");
                        if (npcname == "") {
                            return
                        }
                    }
                    standForPuzzle.add(dirarr[2], dirarr[3], dirarr[4], npcname);
                    return;
                case "follow":
                    var username = dirarr[2];
                    followuser.follow(username);
                    return;
                case "leader":
                    var tobeleader = dirarr[2];
                    followuser.toBeLeader(tobeleader == "1");
                    return;
                case "startpuzzle":
                    var puzzleid = dirarr[2];
                    autoPuzzle.startpuzzle(puzzleid);
                    return;
                case "puzzlekillget":
                    autoPuzzle.puzzlekillget();
                    return;
                case "puzzlesubmit":
                    autoPuzzle.puzzlesubmit(dirarr[2]);
                    return;
                case "vipclick":
                    shimenvipFunc()
            }
        }
        var d = dir.split(";");
        for (var i = 0; i < d.length; i++) {
            overrideclick(d[i], 0)
        }
    };
    window.singleBattleTrigger = 0;
    window.singleBattleInstance = null;
    window.singleBattle = function (callback) {
        this.timer = null;
        this.callback = callback;
        this.dispatchMessage = function (b) {
            var type = b.get("type"),
                subType = b.get("subtype");
            if ((type == "vs" && subType == "vs_info") || (this.timer == null && is_fighting)) {
                neigongPlayCount = 0;
                clearInterval(this.timer);
                // setTimeout(autoSkill, 500);
                // this.timer = setInterval(autoSkill, 1000)
            } else {
                if ((type == "vs" && subType == "combat_result") || (this.timer != null && !is_fighting)) {
                    window.singleBattleTrigger = 0;
                    clearInterval(this.timer);
                    this.timer = null;
                    if (callback) {
                        callback()
                    }
                }
            }
        }
    };
    window.hasGoToEnd = function () {
        return cmdlist.length <= 0 && $("#img_loading:visible").length == 0
    };

    var old_adjustLayout = g_gmain.adjustLayout;
    g_gmain.adjustLayout = function () {
        old_adjustLayout();
        g_gmain.notifyEndTop = 0;
        g_gmain.notifyStartTop = 50
    };

    jh = function (w) {
        if (w == "xt") {
            w = 1
        }
        if (w == "ly") {
            w = 2
        }
        if (w == "hsc") {
            w = 3
        }
        if (w == "hs") {
            w = 4
        }
        if (w == "yz") {
            w = 5
        }
        if (w == "gb") {
            w = 6
        }
        if (w == "qy") {
            w = 7
        }
        if (w == "em") {
            w = 8
        }
        if (w == "hs2") {
            w = 9
        }
        if (w == "wd") {
            w = 10
        }
        if (w == "wy") {
            w = 11
        }
        if (w == "sy") {
            w = 12
        }
        if (w == "sl") {
            w = 13
        }
        if (w == "tm") {
            w = 14
        }
        if (w == "qc") {
            w = 15
        }
        if (w == "xx") {
            w = 16
        }
        if (w == "kf") {
            w = 17
        }
        if (w == "gmd") {
            w = 18
        }
        if (w == "qz") {
            w = 19
        }
        if (w == "gm") {
            w = 20
        }
        if (w == "bt") {
            w = 21
        }
        if (w == "ss") {
            w = 22
        }
        if (w == "mz") {
            w = 23
        }
        if (w == "ts") {
            w = 24
        }
        overrideclick("jh " + w, 0)
    };
    window.game = this;
    window.attach = function () {
        window.oldWriteToScreen = window.writeToScreen;
        window.writeToScreen = function (a, e, f, g) {
            if (!window.definedAutoPuzzle && e == 2 && a.indexOf("find_task_road") > -1) {
                a = a.replace(/find_task_road3/g, "find_task_road2");
                var puzzleItems = a.split("<br/><br/>");
                for (var i = 0; i < puzzleItems.length; i++) {
                    var result = /<a[^>]*find_task_road [^>]*>.*<\/a>/.exec(puzzleItems[i]);
                    if (result && result.length > 0) {
                        var objname = result[0].replace(/<[^>]*>/g, "");
                        if (objname.indexOf("-") > -1) {
                            objname = objname.split("-")[1];
                            objname = ansi_up.ansi_to_text(objname)
                        }
                    } else {
                        continue
                    }
                    var result2 = /<a[^>]*find_task_road2 [^>]*>.*<\/a>/.exec(puzzleItems[i]);
                    if (result2 && result2.length > 0) {
                        var oldobjname = result2[0].replace(/<[^>]*>/g, "");
                        if (oldobjname.indexOf("-") > -1) {
                            oldobjname = oldobjname.split("-")[1];
                            oldobjname = ansi_up.ansi_to_text(oldobjname)
                        }
                    }
                    var result1 = /find_task_road [^>^']*/.exec(puzzleItems[i]);
                    if (!result1 || result1.length == 0) {
                        continue
                    }
                    var puzzleid = result1[0].replace(/find_task_road /g, "");
                    var curpuzzleaction = standForPuzzle.getaction(puzzleid);
                    if (/看上去好生奇怪，/.test(puzzleItems[i]) || /鬼鬼祟祟的叫人生疑，/.test(puzzleItems[i])) {
                        puzzleItems[i] += "<a style='color:green' href=\"javascript:go1('cus|standforpuzzle|" + puzzleid + "|" + objname + "|npc_datan', 0);go1('task_quest')\">[打探" + (curpuzzleaction == "" ? "" : "中") + "]</a>"
                    } else {
                        if (/你一番打探，果然找到了一些线索，回去告诉/.test(puzzleItems[i]) || /我想找/.test(puzzleItems[i]) || /好，我知道了。你回去转告/.test(puzzleItems[i]) || /我有个事情想找/.test(puzzleItems[i]) || /老老实实将东西交了出来，现在可以回去找/.test(puzzleItems[i]) || /脚一蹬，死了。现在可以回去找/.test(puzzleItems[i])) {
                            puzzleItems[i] += "<a style='color:green' href=\"javascript:go1('cus|standforpuzzle|" + puzzleid + "|" + objname + "|ask', 0);go1('task_quest')\">[对话" + (curpuzzleaction == "" ? "" : "中") + "]</a>"
                        } else {
                            if (/我十分讨厌那/.test(puzzleItems[i]) || /好大胆，竟敢拿走了我的/.test(puzzleItems[i]) || /竟敢得罪我/.test(puzzleItems[i]) || /抢走了，去替我要回来吧！/.test(puzzleItems[i])) {
                                puzzleItems[i] += "<a style='color:green' href=\"javascript:go1('cus|standforpuzzle|" + puzzleid + "|" + objname + "|fight', 0);go1('task_quest')\">[比试" + (curpuzzleaction == "fight" ? "中" : "") + "]</a> ";
                                puzzleItems[i] += "<a style='color:green' href=\"javascript:go1('cus|standforpuzzle|" + puzzleid + "|" + objname + "|kill', 0);go1('task_quest')\">[杀" + (curpuzzleaction == "kill" ? "中" : "") + "]</a>"
                            } else {
                                if (/上次我不小心，竟然吃了/.test(puzzleItems[i]) || /竟对我横眉瞪眼的，真想杀掉他！/.test(puzzleItems[i]) || /昨天捡到了我几十辆银子，拒不归还。钱是小事，但人品可不好。/.test(puzzleItems[i])) {
                                    puzzleItems[i] += "<a style='color:green' href=\"javascript:go1('cus|standforpuzzle|" + puzzleid + "|" + objname + "|kill', 0);go1('task_quest')\">[杀" + (curpuzzleaction == "" ? "" : "中") + "]</a>"
                                } else {
                                    if (/突然想要一/.test(puzzleItems[i]) || /唉，好想要一/.test(puzzleItems[i])) {
                                        puzzleItems[i] += "<a style='color:green' href=\"javascript:go1('cus|standforpuzzle|" + puzzleid + "|" + objname + "|get', 0);go1('task_quest')\">[捡" + (curpuzzleaction == "get" ? "中" : "") + "]</a> ";
                                        puzzleItems[i] += "<a style='color:green' href=\"javascript:go1('cus|standforpuzzle|" + puzzleid + "|" + objname + "|killget', 0);go1('task_quest')\">[杀&捡" + (curpuzzleaction == "killget" ? "中" : "") + "]</a> "
                                    }
                                }
                            }
                        }
                    }
                }
                a = puzzleItems.join("<br/><br/>");
                oldWriteToScreen(a, e, f, g);
                return
            }
            if (e == 2 && a.indexOf("你没有引路蜂，无法直接去往此地。") > -1) {
                go1("shop buy shop13;items use yinlufeng libao;golook_room");
                oldWriteToScreen(a, e, f, g);
                return
            }
            oldWriteToScreen(a, e, f, g);
            if (e == 2 && standForPuzzle.isstanding() && (/你从\S+的尸体里搜出\S+/.test(a) || /你捡起\S+/.test(a))) {
                standForPuzzle.endstandingGet(a);
                return
            }

            if (e == 2 && a.indexOf("你停止了打坐。") > -1) {
                go1("exercise");
                return
            }
            if (window.singleBattleTrigger == 1 && e == 2 && (a.indexOf("已经太多人了，不要以多欺少啊。") > -1 || a.indexOf("这儿没有这个人。") > -1)) {
                window.singleBattleTrigger = 0;
                if (window.singleBattle) {
                    if (window.singleBattle.timer) {
                        clearInterval(window.singleBattle.timer);
                        window.singleBattle.timer = null
                    }
                    if (window.singleBattle.callback) {
                        window.singleBattle.callback()
                    }
                }
                return
            }
        };
        window.oldgSocketMsg = gSocketMsg;
        gSocketMsg.old_change_room_object = gSocketMsg.change_room_object;
        gSocketMsg.change_room_object = function (c) {
            if (standForPuzzle.isstanding()) {
                standForPuzzle.stand(c)
            }
            gSocketMsg.old_change_room_object(c)
        };
        window.hasReachRoom = true;
        gSocketMsg.old_dispatchMessage = gSocketMsg.dispatchMessage;
        gSocketMsg.dispatchMessage = function (b) {
            gSocketMsg.old_dispatchMessage(b);
            TriggerFuc(b);
            for (var name in dispatchMessageListener) {
                dispatchMessageListener[name](b)
            }
            var a = b.get("type"),
                c = b.get("subtype");
            if (!is_fighting && "jh" == a && "info" == c) {
                window.hasReachRoom = true
            }



            if (qiangdipiTrigger == 1) {
                qiang.dispatchMessage(b)
            }


            if (window.singleBattleTrigger == 1 && window.singleBattleInstance) {
                window.singleBattleInstance.dispatchMessage(b)
            }
            if (dispatchMessageList.length > 0) {
                for (var i = 0; i < dispatchMessageList.length; i++) {
                    dispatchMessageList[i](b)
                }
            }
        };
        window.oldgSocketMsg2 = gSocketMsg2;
        gSocketMsg2.old_show_item_info = gSocketMsg2.show_item_info;
        gSocketMsg2.show_item_info = function () {
            gSocketMsg2.old_show_item_info();
            var item = g_obj_map.get("msg_item");
            var foundsplit = false;
            var founduse = false;
            var foundhecheng = false;
            var foundhechengys = false;
            var foundsellall = false;
            var foundmoke = false;
            var foundkuang = false;
            var foundkuangType = false;
            var tiankuangCode = 'event_1_16645435';
            var dikuangCode = 'event_1_98215522';
            if (item) {
                for (var i = 1; i <= item.size(); i++) {
                    if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf("client_prompt items splite") == 0) {
                        foundsplit = true;
                        continue
                    }
                    if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf("items use") == 0 && item.get("cmd" + i).indexOf("N_10") > 0 && !item.containsValue("use_all")) {
                        founduse = true;
                        continue
                    }
                    if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf("items hecheng ") >= 0) {
                        foundhecheng = true;
                        continue
                    }
                    if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf("hhjz hecheng_ys ") >= 0) {
                        foundhechengys = true;
                        continue
                    }
                    if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf("items sell ") >= 0) {
                        foundsellall = true;
                        continue
                    }
                    if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf("moke ") >= 0) {
                        foundmoke = true;
                        continue
                    }
                    if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf(dikuangCode) >= 0) {
                        foundkuangType = false;
                        foundkuang = true;
                        continue
                    }
                    if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf(tiankuangCode) >= 0) {
                        foundkuangType = true;
                        foundkuang = true;
                        continue
                    }
                }
                if (foundmoke) {
                    if ($("#out .out table:last tr:last td").length == 4) {
                        $("#out .out table:last").append('<tr algin="center"></tr>')
                    }
                    $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="mokeALlItem(\'' + item.get("id") + ',' + item.get("amount") + '\')" class="cmd_click2">全部<br>摩刻</button></td>')
                }
                if (foundsellall) {
                    if ($("#out .out table:last tr:last td").length == 4) {
                        $("#out .out table:last").append('<tr algin="center"></tr>')
                    }
                    $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="clickButton(\'client_prompt items sell ' + item.get("id") + "_N_" + item.get("amount") + '\', 1)" class="cmd_click2">全部<br>卖出</button></td>')
                }
                if (foundsplit) {
                    if ($("#out .out table:last tr:last td").length == 4) {
                        $("#out .out table:last").append('<tr algin="center"></tr>')
                    }
                    // $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="clickButton(\'items splite ' + item.get("id") + "_N_" + item.get("amount") + '\', 1)" class="cmd_click2">全部<br>分解</button></td>')
                    $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="spliteALlItem(\'' + item.get("id") + ',' + item.get("amount") + '\')" class="cmd_click2">全部<br>分解</button></td>')
                }
                if (founduse) {
                    if ($("#out .out table:last tr:last td").length == 4) {
                        $("#out .out table:last").append('<tr algin="center"></tr>')
                    }
                    $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="userALlItem(\'' + item.get("id") + ',' + item.get("amount") + '\')" class="cmd_click2">全部<br>使用</button></td>')
                }
                if (foundkuang){
                    if ($("#out .out table:last tr:last td").length == 4) {
                        $("#out .out table:last").append('<tr algin="center"></tr>')
                    }
                    if (foundkuangType){
                        $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="userALlKuangItem(\'' + tiankuangCode + ',' + item.get("amount") + '\')" class="cmd_click2">整百<br>挖</button></td>')
                    }else{
                        $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="userALlKuangItem(\'' + dikuangCode + ',' + item.get("amount") + '\')" class="cmd_click2">整百<br>挖</button></td>')
                    }
                }
                if (foundhecheng) {
                    if (["lanbaoshi1", "lvbaoshi1", "hongbaoshi1", "zishuijing1", "huangbaoshi1"].indexOf(item.get("id")) > -1) {
                        if (item.get("amount") / 9 >= 1) {
                            if ($("#out .out table:last tr:last td").length == 4) {
                                $("#out .out table:last").append('<tr algin="center"></tr>')
                            }
                            $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="clickButton(\'items hecheng ' + item.get("id") + "_N_" + (Math.floor(item.get("amount") / 9) * 3) + '\', 1)" class="cmd_click2">合' + (Math.floor(item.get("amount") / 9) * 3) + "次</button></td>")
                        }
                    } else {
                        if (item.get("amount") / 3 >= 2) {
                            if ($("#out .out table:last tr:last td").length == 4) {
                                $("#out .out table:last").append('<tr algin="center"></tr>')
                            }
                            $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="clickButton(\'items hecheng ' + item.get("id") + "_N_" + (Math.floor(item.get("amount") / 3)) + '\', 1)" class="cmd_click2">合' + (Math.floor(item.get("amount") / 3)) + "次</button></td>")
                        }
                    }
                }
                if (foundhechengys) {
                    if (item.get("amount") / 7 > 1) {
                        if ($("#out .out table:last tr:last td").length == 4) {
                            $("#out .out table:last").append('<tr algin="center"></tr>')
                        }
                        $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="clickButton(\'hhjz hecheng_ys ' + item.get("id") + "_N_" + (Math.floor(item.get("amount") / 7)) + '\', 1)" class="cmd_click2">合' + (Math.floor(item.get("amount") / 7)) + "次<br>玉石</button></td>")
                    }
                }
            }
        };

        gSocketMsg2.old_show_items = gSocketMsg2.show_items;
        gSocketMsg2.show_items = function (b) {
            gSocketMsg2.old_show_items(b);
            $(".out table:eq(1) tbody:eq(0) td:eq(0)").css("vertical-align", "top");
            
            var cangkuclone = $(".out table:eq(1) table:eq(1) tr[onclick]").clone();
            cangkuclone = cangkuclone.sort(function (a, b) {
                return ansi_up.ansi_to_text($(a).text()) > ansi_up.ansi_to_text($(b).text()) ? 1 : -1
            });
            $(".out table:eq(1) table:eq(1) tr[onclick]").remove();
            $(".out table:eq(1) table:eq(1)").prepend(cangkuclone);

            // var baoclone = $(".out table:eq(1) table:eq(0) tr[onclick]").clone();
            // baoclone = baoclone.sort(function (a, b) {
            //     return ansi_up.ansi_to_text($(a).text()) < ansi_up.ansi_to_text($(b).text()) ? 1 : -1
            // });
            // $(".out table:eq(1) table:eq(0) tr[onclick]").remove();
            // $(".out table:eq(1) table:eq(0)").prepend(baoclone);

            if ($("#items-div #items-zhengli").length == 0) {
                $("#out .out table:first").after("<div id='items-div'><button id='items-zhengli' class='cmd_click3'><span class='out2'>整理</span></button><button id='items-baiyin' class='cmd_click3'><span class='out2'>开白银</span></button><button id='items-huangjin' class='cmd_click3'><span class='out2'>开黄金</span></button><button id='items-bojin' class='cmd_click3'><span class='out2'>开铂金</span></button><button id='items-qingmu' class='cmd_click3'><span class='out2'>开青木</span></button><button id='items-yaoyu' class='cmd_click3'><span class='out2'>开曜玉</span></button><button id='items-openGold' class='cmd_click3'><span class='out2'>换金矿</span></button><button id='items-openSilver' class='cmd_click3'><span class='out2'>换银矿</span></button><button id='items-changeDa' class='cmd_click3'><span class='out2'>解石(大)</span></button><button id='items-changeMiddle' class='cmd_click3'><span class='out2'>解石(中)</span></button></div>");
                $("#items-div #items-zhengli").off("click").on("click",
                    function () {
                        var stores = g_obj_map.get("msg_items").elements.filter(function (item) {
                            return item.key.indexOf("stores") > -1
                        });
                        var items = g_obj_map.get("msg_items").elements.filter(function (item) {
                            return item.key.indexOf("items") > -1
                        });
                        var cmds = [];
                        for (var i = 0; i < stores.length; i++) {
                            var name = stores[i].value.split(",")[1];
                            var sameitems = items.filter(function (item) {
                                return item.value.indexOf("," + name + ",") > -1
                            });
                            for (var j = 0; j < sameitems.length; j++) {
                                cmds.push("items put_store " + sameitems[j].value.split(",")[0])
                            }
                        }
                        if (cmds.length > 0) {
                            GoSlowAction(cmds)
                        }
                    });
                $("#items-div #items-baiyin").off("click").on("click",
                    function () {

                        var stores = g_obj_map.get("msg_items").elements.filter(function (item) {
                            return item.key.indexOf("stores") > -1
                        });

                        for (var i = 0; i < stores.length; i++) {
                            var name = stores[i].value.split(",")[1];
                            var txt = g_simul_efun.replaceControlCharBlank(
                                name.replace(/\u0003.*?\u0003/g, "")
                            );
                            if (txt.indexOf('白银宝箱') != '-1') {
                                clickButton('items get_store /obj/shop/box1');
                            }
                        }

                        setTimeout(function () {
                            openXiang('白银宝箱');
                        }, 2000);
                    });
                $("#items-div #items-huangjin").off("click").on("click",
                    function () {
                        var stores = g_obj_map.get("msg_items").elements.filter(function (item) {
                            return item.key.indexOf("stores") > -1
                        });

                        for (var i = 0; i < stores.length; i++) {
                            var name = stores[i].value.split(",")[1];
                            var txt = g_simul_efun.replaceControlCharBlank(
                                name.replace(/\u0003.*?\u0003/g, "")
                            );
                            if (txt.indexOf('黄金宝箱') != '-1') {
                                clickButton('items get_store /obj/shop/box2');
                            }
                            if (txt.indexOf('黄金钥匙') != '-1') {
                                clickButton('items get_store /obj/shop/huangjin_key');
                            }
                        }
                        setTimeout(function () {
                            openXiang('黄金宝箱', '黄金钥匙');
                        }, 2000);
                    });
                $("#items-div #items-bojin").off("click").on("click",
                    function () {
                        var stores = g_obj_map.get("msg_items").elements.filter(function (item) {
                            return item.key.indexOf("stores") > -1
                        });

                        for (var i = 0; i < stores.length; i++) {
                            var name = stores[i].value.split(",")[1];
                            var txt = g_simul_efun.replaceControlCharBlank(
                                name.replace(/\u0003.*?\u0003/g, "")
                            );
                            if (txt.indexOf('铂金宝箱') != '-1') {
                                clickButton('items get_store /obj/shop/box3');
                            }
                            if (txt.indexOf('铂金钥匙') != '-1') {
                                clickButton('items get_store /obj/shop/bojin_key');
                            }
                        }
                        setTimeout(function () {
                            openXiang('铂金宝箱', '铂金钥匙');
                        }, 2000);
                    });
                $("#items-div #items-qingmu").off("click").on("click",
                    function () {
                        var stores = g_obj_map.get("msg_items").elements.filter(function (item) {
                            return item.key.indexOf("stores") > -1
                        });

                        for (var i = 0; i < stores.length; i++) {
                            var name = stores[i].value.split(",")[1];
                            var txt = g_simul_efun.replaceControlCharBlank(
                                name.replace(/\u0003.*?\u0003/g, "")
                            );
                            if (txt.indexOf('青木宝箱') != '-1') {
                                clickButton('items get_store /obj/shop/qingmubaoxiang');
                            }
                        }

                        setTimeout(function () {
                            openXiang('青木宝箱');
                        }, 2000);
                    });
                $("#items-div #items-yaoyu").off("click").on("click",
                    function () {
                        var stores = g_obj_map.get("msg_items").elements.filter(function (item) {
                            return item.key.indexOf("stores") > -1
                        });

                        for (var i = 0; i < stores.length; i++) {
                            var name = stores[i].value.split(",")[1];
                            var txt = g_simul_efun.replaceControlCharBlank(
                                name.replace(/\u0003.*?\u0003/g, "")
                            );
                            if (txt.indexOf('曜玉宝箱') != '-1') {
                                clickButton('items get_store /obj/shop/yaoyubaoxiang');
                            }
                            if (txt.indexOf('曜玉钥匙') != '-1') {
                                clickButton('items get_store /obj/shop/yaoyuyaoshi');
                            }
                        }
                        setTimeout(function () {
                            openXiang('曜玉宝箱', '曜玉钥匙');
                        }, 2000);
                    });
                $("#items-div #items-openGold").off("click").on("click",
                    function () {
                        
                        if (window.MoneyTimer){
                            clearInterval(window.MoneyTimer);
                            window.MoneyTimer = null;
                            return;
                        }
                        window.MoneyTimer = setInterval(() => {
                            //items-openSilver
                            go('event_1_70038009');
                        }, 500);
                    });
                $("#items-div #items-openSilver").off("click").on("click",
                    function () {

                        if (window.MoneyTimer) {
                            clearInterval(window.MoneyTimer);
                            window.MoneyTimer = null;
                            return;
                        }
                        window.MoneyTimer = setInterval(() => {
                            go('event_1_70129098');
                        }, 500);
                    });
                    $("#items-div #items-changeDa").off("click").on("click",
                    function () {

                        if (window.MoneyTimer) {
                            clearInterval(window.MoneyTimer);
                            window.MoneyTimer = null;
                            return;
                        }
                        window.MoneyTimer = setInterval(() => {
                            go('event_1_53776944');
                        }, 500);
                    });

                    $("#items-div #items-changeMiddle").off("click").on("click",
                    function () {

                        if (window.MoneyTimer) {
                            clearInterval(window.MoneyTimer);
                            window.MoneyTimer = null;
                            return;
                        }
                        window.MoneyTimer = setInterval(() => {
                            go('event_1_92804818');
                        }, 500);
                    });
            }
        };
        gSocketMsg2.old_show_user = gSocketMsg2.show_user;
        gSocketMsg2.show_user = function () {
            gSocketMsg2.old_show_user();
            fireListener(show_userListener)
        };
        gSocketMsg2.old_show_score = gSocketMsg2.show_score;
        gSocketMsg2.show_score = function () {
            gSocketMsg2.old_show_score();
            fireListener(show_scoreListener)
        };
        var _go_combat = window.gSocketMsg.go_combat;
        window.gSocketMsg.go_combat = function () {
            _go_combat.apply(this, arguments);
            enhance_combat();
        };
        g_gmain.old_clickButton = g_gmain.clickButton;
        g_gmain.clickButton = function (a, e) {
            g_gmain.old_clickButton(a, e);
            fireListener(clickButtonListener, [a, e])
        };
        gSocketMsg.move_lose_kee_gif = function (c) {
            var a = document.getElementById("lose_kee_gif" + c);
            if (a) {
                setTimeout(function () {
                    a.parentNode.removeChild(a)
                }, 300)
            }
        };
        gSocketMsg.old_show_html_page = gSocketMsg.show_html_page;
        gSocketMsg.show_html_page = function () {
            gSocketMsg.old_show_html_page();

            if ($("#out .out button:contains('传十次'),#out .out button:contains('学十次')").length > 0) {
                $("#out .out button:contains('传十次'),#out .out button:contains('学十次')").each(function () {
                    var btn1 = $(this).clone();
                    btn1.attr("onclick", btn1.attr("onclick").replace("10", "100")).html(btn1.html().replace("十", "百"));
                    $(this).after(btn1)
                })
            }
            if ($("#out .out button:contains('升40级'),#out .out button:contains('升40级')").length > 0) {
                $("#out .out button:contains('升40级'),#out .out button:contains('升40级')").each(function () {
                    var btn1 = $(this).clone();
                    btn1.attr("onclick", btn1.attr("onclick").replace("40", "100")).html(btn1.html().replace("4", "10"));
                    $(this).after(btn1)
                })
            }
            if ($("#out .out button:contains('兑换一个')").length > 0) {
                $("#out .out button:contains('兑换一个')").each(function () {
                    var btn1 = $(this).clone();
                    var clickText = btn1.attr("onclick");
                    clickText = clickText.replace('client_prompt ', '');
                    clickText = clickText.replace('clickButton(', '');
                    clickText = clickText.replace(')', '');
                    //fudi shennong exch 1
                    // clickButton('client_prompt fudi shennong exch 1', 0)
                    btn1.attr("onclick", 'doClickButtonTime(' + clickText + ')').html(btn1.html().replace("一", "十"));
                    $(this).after(btn1)
                })
            }
        };

        // var qixia_id_pattern = /^(langfuyu|wangrong|pangtong|liyufei|bujinghong|fengxingzhui|guoji|wuzhen|fengnan|huoyunxieshen|niwufeng|hucangyan|huzhu|xuanyueyan|langjuxu|liejiuzhou|mumiaoyu|yuwenwudi|lixuanba|babulongjiang|fengwuhen|licangruo|xiaqing|miaowuxin|wuyeju)_/;
        // var _show_npc = window.gSocketMsg2.show_npc;
        // window.gSocketMsg2.show_npc = function () {
        //     _show_npc.apply(this, arguments);
        //     var id = g_obj_map.get('msg_npc').get('id');
        //     var $n = $('div#out > span.out > br:first');
        //     $('<span>&nbsp;(' + id + ')</span>').insertBefore($n);
        //     if (qixia_id_pattern.test(id)) {
        //         var cmd = 'ask ' + id + '\\n' + 'ask ' + id + '\\n' + 'ask ' + id + '\\n' + 'ask ' + id + '\\n' + 'ask ' + id;
        //         append_button('<td align="center"><button type="button" onclick="clickButton(\'' + cmd + '\', 1)" class="cmd_click2"><span style="color:red;">领朱果</span></button></td>');
        //     } else if (id == 'jingcheng_cangliufu') {
        //         var $td = $('<td align="center"><button type="button" class="cmd_click2"><span style="color:red;">自动<br/>赌钱</span></button></td>');
        //         $('button', $td).click(function () {
        //             command_center.execute('#bet');
        //         });
        //         append_button($td);
        //     } else{
        //         var $e, do_kill = false, $e_click = null;
        //         $('#out > span.out button.cmd_click2').each(function () {
        //             $e = $(this);
        //             if ($e.text() == '杀死') {
        //                 do_kill = true;
        //                 $e_click = $e.attr("onclick");
        //                 return false;
        //             }
        //         });
        //         if (do_kill) {
        //             $e_click = $e_click.replace('clickButton(', '');
        //             $e_click = $e_click.split('\',')[0];
        //             $e_click = $e_click.replace('\'', '');
        //             var $td1 = $('<td align="center"><button onclick="clickButton(\'' + $e_click + ' 1\')" type="button" class="cmd_click2"><span style="color:red;">杀一个</span></button></td>');
        //             append_button($td1);
        //         }
        //     }
        // };
    };
    attach()
}

function enhance_combat() {
    var $skill_zhaohuan = $('.out2 td#skill_zhaohuan');
    if ($skill_zhaohuan.length > 0) {
        $skill_zhaohuan.html('<button type="button" class="cmd_skill_button"><span style="color:red;">出招</span></button>');
        $('button', $skill_zhaohuan).click(function () {
            doKillSet();
        });
    }
}

window.doClickButtonTime = function (text) {
    for (var i = 0; i < 10; i++) {
        go(text);
    }
};
function questionFn2() {
    window.attach = function () {
        var oldWriteToScreen = window.writeToScreen;
        window.writeToScreen = function (a, e, f, g) {
            if (e == 2 && a.indexOf("find_task_road") > -1) {
                a = a.replace(/find_task_road3/g, "find_task_road2");
                var puzzleItems = a.split("<br/><br/>");
                var puzzleid = "";
                for (var i = 0; i < puzzleItems.length; i++) {
                    if (puzzleItems[i].indexOf("find_task_road") == -1) {
                        continue
                    }
                    puzzleid = autoPuzzle.analyzePuzzle(puzzleItems[i]);
                    puzzleItems[i] += " <a class='go-btn' href='javascript:go1(\"cus|startpuzzle|" + puzzleid + "\")'>【GO】</a>";
                    if (autoPuzzle.puzzleWating && puzzleid == autoPuzzle.puzzleWating.puzzleid) {
                        if (autoPuzzle.puzzleWating.actionCode == "get" && autoPuzzle.puzzleWating.status == "wait") {
                            puzzleItems[i] += " <a href='javascript:go1(\"cus|puzzlekillget\")'>【杀】</a>"
                        }
                        if (puzzleItems[i].indexOf("谜题") == -1) {
                            autoPuzzle.startpuzzle(puzzleid)
                        }
                    }
                }
                a = puzzleItems.join("<br/><br/>")
            } else {
                if (e == 2 && a.indexOf("不接受你给的东西。") > -1 && autoPuzzle.puzzleWating && autoPuzzle.puzzleWating.puzzleid && autoPuzzle.puzzleWating.status == "give") {
                    autoPuzzle.puzzleWating.waitCount--;
                    if (autoPuzzle.puzzleWating.waitCount <= 0) {
                        clearTimeout(autoPuzzle.puzzleWating.waitTimer);
                        autoPuzzle.puzzleWating.status = "trace";
                        go1("find_task_road " + autoPuzzle.puzzleWating.puzzleid)
                    }
                } else {
                    if (e == 2 && autoPuzzle.puzzleWating && autoPuzzle.puzzleWating.puzzleid && (autoPuzzle.puzzleWating.status == "wait" || autoPuzzle.puzzleWating.status == "traced") && autoPuzzle.puzzleWating.action == "get" && (a.indexOf("你捡起") > -1 || /你从.*的尸体里搜出.*。/.test(a) || /你用.*向.*买下.*。/.test(a)) && a.indexOf(autoPuzzle.puzzleWating.target) > -1) {
                        autoPuzzle.puzzleWating = {
                            puzzleid: autoPuzzle.puzzleWating.puzzleid,
                            action: "get",
                            actionCode: "give",
                            target: window.puzzleList[autoPuzzle.puzzleWating.puzzleid].publisherName,
                            status: "return"
                        };
                        go1("find_task_road2 " + autoPuzzle.puzzleWating.puzzleid)
                    } else {
                        if (e == 2 && a.indexOf("我就不给，你又能怎样？") > -1 && autoPuzzle.puzzleWating && autoPuzzle.puzzleWating.puzzleid && autoPuzzle.puzzleWating.actionCode == "fight") {
                            autoPuzzle.doPuzzle(autoPuzzle.puzzleWating.puzzleid)
                        } else {
                            if (e == 2 && autoPuzzle.puzzleWating && autoPuzzle.puzzleWating.puzzleid && /完成谜题\((\d+)\/\d+\)：(.*)的谜题\S*\s*\S*x(\d+)\s*\S*x\d+\s*\S*银两x(\d{1,})/.test(a)) {
                                var puzzleFinish = /完成谜题\((\d+)\/\d+\)：(.*)的谜题\S*\s*\S*x(\d+)\s*\S*x\d+\s*\S*银两x(\d{1,})/.exec(a);
                                puzzleFinish[2] = puzzleFinish[2].replace(/^<\/span>/, "").replace(//g, "");
                                if (puzzleFinish[2] == autoPuzzle.puzzleList[autoPuzzle.puzzleWating.puzzleid].firstPublisherName) {
                                    autoPuzzle.puzzleList[autoPuzzle.puzzleWating.puzzleid].prize = puzzleFinish[0].replace(/<\/?span[^>]*>/g, "").replace(/<br\/>/g, "\n");
                                    if (+ puzzleFinish[4] > 1800) {
                                        a += "<br/><button onClick='go1(\"cus|puzzlesubmit|" + autoPuzzle.puzzleWating.puzzleid + "\")' style='background: #FF6B00; color: #fff; margin: 5px;'>【提交】</button>";
                                    }
                                    if (a.indexOf('当前谜题密码') >= 0) {
                                        var mimatext = a.split('当前谜题密码：')[1].split('<')[0];
                                        var submitCode = 'event_1_65953349 ' + mimatext;
                                        var goPath = 'jh 1;e;n;n;n;n;w;' + submitCode;
                                        a += "<button onClick='go(\"" + goPath + "\")' style='background: #FF6B00; color: #fff; margin: 5px;'>【交密码】</button>";
                                    }
                                    if (window.webSocket){
                                        window.webSocket.send(JSON.stringify({
                                            message: '完成谜题：'+ autoPuzzle.puzzleList[autoPuzzle.puzzleWating.puzzleid].firstPublisherName,
                                            type: 'chat'
                                        }))
                                    }
                                    autoPuzzle.puzzleWating = {}
                                }
                            }
                        }
                    }
                }
            }
            oldWriteToScreen(a, e, f, g)
        }
    };
    window.hasReachRoom = true;
    var old_dispatchMessage = gSocketMsg.dispatchMessage;
    gSocketMsg.dispatchMessage = function (b) {
        old_dispatchMessage(b);
        var a = b.get("type"),
            c = b.get("subtype");
        if ("jh" == a && "info" == c) {
            window.hasReachRoom = true;
            if (autoPuzzle.puzzleWating.puzzleid) {
                if (autoPuzzle.puzzleWating.status == "trace") {
                    autoPuzzle.puzzleWating.status = "traced";
                    autoPuzzle.doPuzzle(autoPuzzle.puzzleWating.puzzleid)
                } else {
                    if (autoPuzzle.puzzleWating.status == "return") {
                        autoPuzzle.puzzleWating.status = "returned";
                        autoPuzzle.doPuzzle(autoPuzzle.puzzleWating.puzzleid)
                    }
                }
            }
        }
    };
    var old_change_room_object = gSocketMsg.change_room_object;
    gSocketMsg.change_room_object = function (c) {
        var type = c.get("type"),
            subType = c.get("subtype");
        if (type == "jh" && (subType == "new_item" || subType == "new_npc")) {
            var name = autoPuzzle.ansiToHtml(c.get("name")),
                plainName = ansi_up.ansi_to_text(c.get("name")),
                id = c.get("id");
            if (autoPuzzle.puzzleWating && autoPuzzle.puzzleWating.puzzleid && autoPuzzle.puzzleWating.status == "wait") {
                if (subType == "new_npc") {
                    if (["npc_datan", "answer", "ask", "fight", "kill", "give"].indexOf(autoPuzzle.puzzleWating.actionCode) > -1 && name == autoPuzzle.puzzleWating.target) {
                        go1(autoPuzzle.puzzleWating.actionCode + " " + id)
                    } else {
                        if (autoPuzzle.puzzleWating.actionCode == "killget" && plainName == autoPuzzle.puzzleWating.waitTargetName) {
                            go1("kill " + id)
                        }
                    }
                } else {
                    if (subType == "new_item" && ["get"].indexOf(autoPuzzle.puzzleWating.actionCode) > -1) {
                        if (name == autoPuzzle.puzzleWating.target || id.indexOf("corpse") > -1) {
                            go1("get " + id)
                        }
                    }
                }
            }
        }
        old_change_room_object(c)
    };
    window.attach();
    var autoPuzzle = window.autoPuzzle = new AutoPuzzle();
    window.definedAutoPuzzle = true
}