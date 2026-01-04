// ==UserScript==
// @name         自动暴击谜
// @namespace    http://tampermonkey.net/
// @version      25.17 会员点
// @description  try to take over the world!
// @author       You
// @include      http://*.yytou.cn*
// @include      http://*.hero123.cn*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40618/%E8%87%AA%E5%8A%A8%E6%9A%B4%E5%87%BB%E8%B0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/40618/%E8%87%AA%E5%8A%A8%E6%9A%B4%E5%87%BB%E8%B0%9C.meta.js
// ==/UserScript==
var assistant = 'u6965572(1)';
var assistant1 = 'u4253282(1)';
var miCookies = 'miCookies';
// var assistant = 'u7905194';
var btnList = {};
var buttonWidth = '90px';
var buttonHeight = '20px';
var currentPos = 10;
var delta = 23;
youxia_id = null;
steps = 0;
var imultiplePuzzle = 0;
var questionTxt = '';
var firstQuestion = true;
var hasDoOneQuestion = false;
var hasDoneMap = false;
var hasDoneQuestion = false;
var storage = window.localStorage;
var gameOption = {
    LingshiSwitch: 1
};
var mySkillLists = "排云掌法;九天龙吟剑法;如来神掌;无相金刚掌;六脉神剑;天师灭神剑;辟邪剑法;天师剑法;茅山道术;基本剑法;扑击格斗之技";
var qxNpcList = "浪唤雨;王蓉;庞统;李宇飞;步惊鸿;风行骓;郭济;吴缜;风南;火云邪神;逆风舞;狐苍雁;护竺;巫夜姬;妙无心;夏岳卿;厉沧若;风无痕;李玄霸;宇文无敌;穆妙羽;烈九州;狼居胥;玄月研;八部龙将";
var QixiaList = ['段老大', '二娘', '岳老三', '云老四', '剧盗', '恶棍', '流寇', '管家', '洗老板', '朱先生', '泼皮头子', '无一', '铁二', '追三', '冷四', '黄衣捕快', '红衣捕快', '锦衣捕快', "空空儿", "白老板", "汤掌柜", "哑太婆", "左冷禅", "九戒大师", "柳云烟", "公孙浩", "秦卷帘", "丰不为", "刘守财", "书生", "小糖人", "光棍", "周年小【贰】", "双旦使者", "浪唤雨", "王蓉", "庞统", "李宇飞", "步惊鸿", "风行骓", "郭济", "吴缜", "风南", "火云邪神", "逆风舞", "狐苍雁", "护竺", "八部龙将", "玄月研", "狼居胥", "烈九州", "穆妙羽", "宇文无敌", "李玄霸", "风无痕", "厉沧若", "夏岳卿", "妙无心", "巫夜姬", "玄阴符兵", "金甲符兵", "庙祝", "蒙面剑客", "柳绘心", "红娘", "柳小花", "凌云", "凌中天", "采花贼", "方寡妇", "冯铁匠", "曲姑娘", "丐帮长老", "游客", "公平子", "岳师妹", "六猴儿", "令狐大师哥", "小林子", "林师弟", "小尼姑", "铁匠", "程大人", "公孙岚", "刘步飞", "顽童", "贵公子", "花店伙计", "青书少侠", "雷横天", "欧阳少主", "藏剑楼剑客", "韦蝠王", "辛旗使", "庄旗使", "唐旗使", "颜旗使", "冷步水", "冷文臻", "董老头", "唐怒", "方媃", "唐鹤", "唐芳", "苟书痴", '任侠', '暗刺客', '金刀客', '追命', '无花', '传鹰', '令东来', '西门吹雪', '石之轩', '朱大天王', '楚昭南', '阿青', '楚留香', '天山童姥', '乾罗', '令狐冲', '乔峰', '浪翻云', '三少爷', '石幽明', '胡铁花', '蒙赤行', '厉工', '叶孤城', '祝玉妍', '萧秋水', '凌未风', '白猿', '石观音', '李秋水', '方夜羽', '东方不败', '慕容博', '庞斑', '燕十三'];

function webSocketSet(){
    if (window.WebSocket) {
        //http://192.168.4.200
        // window.ws = new WebSocket('ws://106.12.144.197:8001');
        window.ws = new WebSocket('ws://81.70.145.184:12345');
        window.ws.onopen = function () {
            var params = getUrlParams(window.location.href);
            window.ws.send(JSON.stringify({
                name: params.id,
                type: 'setname'
            }))
        }
    }
}

function senWebMsg(msg) {
    window.ws.send(JSON.stringify({
        message: msg,
        type: 'chat'
    }));
}

//go函数
var isDelayCmd = 1,	// 是否延迟命令
    cmdCache = [],		// 命令池
    cmd = null,         //当前命令
    cmd_stop = 0,    //等待
    cmd_room = null,    //当前房间
    cmd_roomb = null,    //之前房间
    cmd_room1 = null,    //yell目的地
    cmd_room2 = null,    //event目的地
    cmd_target = null,    //目标npc
    cmd_target_id = null, //npc的id
    cmdBack = [],       //命令池备份
    timeCmd = null,		// 定时器句柄
    cmdDelayTime = 250;	// 命令延迟时间
// 执行命令串
window.go = function (str) {
    var arr = [];
    if (str.indexOf(';') > -1) {
        arr = str.split(";");
    } else {
        arr = str.split(",");
    }
    if (isDelayCmd && cmdDelayTime) {
        // 把命令存入命令池中
        cmdCache = cmdCache.concat(arr);

        // 当前如果命令没在执行则开始执行
        if (!timeCmd) delayCmd();
    } else {
        for (var i = 0; i < arr.length; i++) clickButton(arr[i]);
    }
}

// 执行命令池中的命令
function delayCmd() {
    if (g_gmain.is_fighting) {
        cmd_go();
        return 0;
    }
    var r = g_obj_map.get("msg_room");
    if (cmd_stop == 0) {
        cmd = cmdCache.shift();
        if (cmd.indexOf('jh') != -1) {
            cmdBack = [];
            cmdBack.push(cmd);
        } else {
            cmdBack.push(cmd);
        }
        if (cmd.indexOf('-') != -1 && cmd.indexOf('_') == -1) {
            if (cmd.indexOf('yell') != -1) {
                cmd_room1 = cmd.split('-')[1];
                cmd = cmd.split('-')[0];
                cmd_roomb = r.get('short').replace(/\u001b.*?m|\u001b\d{1,2}\u001b/g, "");
                clickButton(cmd);
                cmd_stop = 0;
            }
            if (cmd.indexOf('event') != -1) {
                cmd_room2 = cmd.split('-')[1];
                cmd = cmd.split('-')[0];
                cmd_roomb = r.get('short').replace(/\u001b.*?m|\u001b\d{1,2}\u001b/g, "");
                clickButton(cmd);
                cmd = 'event';
                cmd_stop = 0;
            }
            if (cmd.indexOf('kill') != -1 || cmd.indexOf('fight') != -1 || cmd.indexOf('ask') != -1) {
                cmd_target = cmd.split('-')[1];
                cmd = cmd.split('-')[0];
                cmd_stop = 1;
            }
        } else {
            clickButton(cmd);
            cmd_stop = 0;
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
            case 'kill': ;
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

function stopDelayCmd() {
    clearTimeout(timeCmd);
    timeCmd = null;
    cmd_stop = 0;
    cmdCache = [];
    cmdBack = [];
}

function isContains(str, substr) {
    return str.indexOf(substr) >= 0
}

createButton('买卡', GoBuyCard);
createButton('回主页', GoHomeFunc);
createButton('下一个号', nexturl);
createButton('是否谜题', isDoMiMaster);
createButton("清储存", clearStorage);
createButton('自动战斗', AutoKillFunc);
createButton('清谜题', clearPuzzleFunc);
createButton('自动迷题', listenPuzzleFunc);
createButton('进度', PuzzleNextFunc);
createButton('进度设置', PuzzleNPCGoFunc);
createButton('迷题扫图', GetNPCStart);
createButton("雪亭镇", btnWayClick);
createButton("洛阳", btnWayClick);
createButton("华山村", btnWayClick);
createButton("华山", btnWayClick);
createButton("扬州", btnWayClick);
createButton("丐帮", btnWayClick);
createButton("乔阴县", btnWayClick);
createButton("恒山", btnWayClick);
createButton("武当山", btnWayClick);
createButton("水烟阁", btnWayClick);
// createButton("少林寺", btnWayClick);
// createButton("峨眉山", btnWayClick);
createButton("唐门", btnWayClick);
createButton("逍遥林", btnWayClick);
createButton("开封", btnWayClick);
createButton("明教", btnWayClick);
createButton("全真教", btnWayClick);
createButton("白驼山", btnWayClick);
// createButton("嵩山", btnWayClick);
// createButton("泰山", btnWayClick);
// createButton("大昭寺", btnWayClick);

var Puzzletrigger = 0;
function listenPuzzleFunc() {
    if (Puzzletrigger == 0) {
        Puzzletrigger = 1;
        btnList["自动迷题"].innerText = '手动迷题'
    } else if (Puzzletrigger == 1) {
        Puzzletrigger = 0;
        // clearInterval(PuzzleActIntervalFunc);
        btnList["自动迷题"].innerText = '自动迷题'
    }
}
var kfMonitor = 0;
var kfKind = "";
var kf = "";
var killtimes = 0;
function createButton(btnName, func) {
    btnList[btnName] = document.createElement('button');
    var myBtn = btnList[btnName];
    myBtn.innerText = btnName;
    myBtn.style.position = 'absolute';
    myBtn.style.right = '2px';
    myBtn.style.top = currentPos + 'px';
    currentPos = currentPos + delta;
    myBtn.style.width = buttonWidth;
    myBtn.style.height = buttonHeight;
    myBtn.addEventListener('click', func);
    document.body.appendChild(myBtn)
}
function GoHomeFunc() {
    clickButton('home')
}
function GoBuyCard() {
    clickButton('shop buy shop46')
    clickButton('items use obj_buqianka');
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true
        }
    }
    return false
};
function clearPuzzleFunc() {
    go('auto_tasks cancel')
}

String.prototype.trim = function (char, type) {
    if (char) {
        if (type == 'left') {
            return this.replace(new RegExp('^\\' + char + '+', 'g'), '')
        } else if (type == 'right') {
            return this.replace(new RegExp('\\' + char + '+$', 'g'), '')
        }
        return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '')
    }
    return this.replace(/^\s+|\s+$/g, '')
};
var hasEndQuesion = false;
var lastcmd;
var lastpuzzlelink;
var lastpuzzleid;
var lastpuzzlename;
var singlePuzzleMsg = '';
function init() {
    function QinglongMon() {
        this.dispatchMessage = function (b) {
            var type = b.get("type"),
                subType = b.get("subtype");

            var ctype = b.get("ctype");
            var cmsg = b.get("msg");
            if (type == 'main_msg' && ctype == 'text' && /：ASSIST\//.test(cmsg)) {
                if (cmsg.indexOf('baoji') > 0 && cmsg.indexOf('go') > 0) {
                    setQuestionMapQuestion('-1');
                    GoStartXTZ();
                }
            }
            //href;0;find_task_road3 henshan_henshan11云问天0道：href;0;find_task_road henshan_henshan11恒山-山蛇0十分嚣张，去让他见识见识厉害！[2;37;0m
            if (type == "main_msg" || type == "notice") {
                var base_msg = b.get("msg");
                var msg = g_simul_efun.replaceControlCharBlank(base_msg);
                if (msg.indexOf("今日已达到谜题数量限制") > -1 && Puzzletrigger == 1) {
                    // listenPuzzleFunc()
                    hasEndQuesion = true;
                    console.log(getTimes() + '今日已达到谜题数量限制,稍后将切换账号');
                    alertMask('今日已达到谜题数量限制,稍后将切换账号')
                    setTimeout(() => {
                        nexturl();
                    }, 10 * 1000);
                    return false;
                }
                // if (iBatchAskStart >= 1) {
                //     if (msg.indexOf("练武奇才") > -1) {
                //         setTimeout(PuzzleNPCAsk, 2000)
                //     }
                //     if (msg.indexOf("今日奇侠") > -1 || msg.indexOf("已不在这") > -1 || msg.indexOf("你想干什么") > -1 || msg.indexOf("挺有兴致地跟你聊了起来") > -1 || msg.indexOf("盯着你看了一会儿") > -1 || msg.indexOf("你在这做什么") > -1 || msg.indexOf("江湖上好玩吗") > -1 || msg.indexOf("似乎想问你天气怎么样") > -1) {
                //         setTimeout(PuzzleNextFunc, 2000)
                //     }
                //     if (msg.indexOf('find_task_road') > -1) {
                //         if (iBatchAskStart >= iValidPuzzleNum) {
                //             iBatchAskStart = 0;
                //             listenPuzzleFunc();
                //             // eval("clickButton('task_quest')");
                //             return
                //         } else {
                //             iBatchAskStart = iBatchAskStart + 1;
                //             // setTimeout(PuzzleNextFunc, 1000)
                //         }
                //     }
                // }
                /* bb */
                if (Puzzletrigger == 1) {
                    if (msg.indexOf("完成谜题") > -1 && msg.indexOf("你") < 0) {
                        ISAFTERGO();
                        oldPath = '';
                        hasDoOneQuestion = true;
                        var strfinishNum = msg.match(/完成谜题\((\d+)\//);
                        // var strpuzzlename = msg.split('：')[1].split('，')[0];
                        var strexp = msg.match(/经验x(.*)/);
                        // var strpotential = msg.match(/潜能x(.*)/);
                        var strmoney = msg.match(/银两x(.*)/);
                        // var lexp = parseInt(strexp[1]);
                        var city = btnList["迷题扫图"].innerText;
                        // console.log(msg);
                        // console.log('潜能：' + strpotential[1]);
                        // console.log('经验：' + strexp[1]);
                        // console.log('银两' + strmoney[1]);
                        if (strmoney[1] > 1800) {
                            var newMsg = city + '--' + msg.replace(/\s+/g, "");
                            var tellText = ' QUESTION/new/' + newMsg;
                            // console.log(tellText);
                            senWebMsg(tellText);
                            clickButton('tell ' + assistant + tellText);
                            clickButton('tell ' + assistant1 + tellText);
                        }
                        if (parseInt(strfinishNum[1]) <= 10) {
                            iValidPuzzleNum = 5
                        } else {
                            iValidPuzzleNum = 15 - parseInt(strfinishNum[1])
                        }
                        // console.log('iValidPuzzleNum:' + iValidPuzzleNum)
                        if (iValidPuzzleNum == 0) {
                            console.log(getTimes() + '已完成15个谜,稍后将切换账号');
                            alertMask('已完成15个谜,稍后将切换账号');
                            hasEndQuesion = true;
                            setTimeout(() => {
                                nexturl();
                            }, 10 * 1000);
                            return false;
                        }
                        if (parseInt(strfinishNum[1]) == 15) {
                            listenPuzzleFunc()
                        } else {
                            if (imultiplePuzzle == 1) {
                                // eval("clickButton('task_quest')")
                                stopDelayCmd();
                                clickButton('task_quest');
                            } else {
                                if (iBatchAskModel == 1) {
                                    setTimeout(NpcBatchAskStartFunc, 1000)
                                } else {
                                    setTimeout(PuzzleNextFunc, 1000)
                                }
                            }
                        }
                        questionTxt = null;
                        firstQuestion = true
                    } else if (msg.indexOf('所接谜题过多') > -1) {
                        // if (Puzzletrigger == 1) {
                        //     listenPuzzleFunc()
                        // }
                        clearPuzzleFunc();
                        setTimeout(PuzzleNPCAsk, 2000)
                        // go('task_quest');
                        // console.log('所接谜题过多');
                    } else if (msg.indexOf("练武奇才") > -1) {
                        console.log(msg);
                        setTimeout(PuzzleNPCAsk, 2000)
                    } else if (msg.indexOf("来吧") > -1) {
                        setTimeout(PuzzleNPCKill, 2000)
                    } else if (msg.indexOf("今日奇侠") > -1 || msg.indexOf("你想干什么") > -1 || msg.indexOf("挺有兴致地跟你聊了起来") > -1 || msg.indexOf("盯着你看了一会儿") > -1 || msg.indexOf("你在这做什么") > -1 || msg.indexOf("江湖上好玩吗") > -1 || msg.indexOf("似乎想问你天气怎么样") > -1) {
                        setTimeout(PuzzleNextFunc, 2000)
                    } else if (msg.indexOf("你现在没有接到谜题任务") > -1) {
                        // imultiplePuzzle = 0
                        oldPath = '';
                        setTimeout(PuzzleNextFunc, 2000)
                    } else if (msg.indexOf("此人现在已不在") > -1) {
                        oldPath = '';
                        setTimeout(PuzzleNextFunc, 2000)
                    } else if (msg.indexOf('说道') > -1) {
                        var nextNpc = gmapNPCList[iPuzzleOrders];
                        if (nextNpc) {
                            nextNpc = nextNpc.split(";")[0];
                            // console.log('npc' + nextNpc);
                            var daoArr = ['多谢', '领教', '高招', '我知道了']
                            if (msg.indexOf(nextNpc) > -1) {
                                var hasDao = false;
                                // setTimeout(PuzzleNextFunc, 1000)
                                for (var i = 0; i < daoArr.length; i++) {
                                    if (msg.indexOf(daoArr[i]) > -1) {
                                        hasDao = true;
                                    }
                                }
                                if (!hasDao) {
                                    console.log(msg)
                                    setTimeout(PuzzleNextFunc, 2000)
                                }
                            }
                        }
                    }
                    // else if (msg.indexOf("没有这个方向") > -1) {
                    //     // oldPath = '';
                    //     // setTimeout(PuzzleNextFunc, 1000)
                    // }
                }
            }
        }
    }
    var qlMon = new QinglongMon;
    function Trigger(r, h, c, n) {
        this.regexp = r;
        this.handler = h;
        this.class = c;
        this.name = n;
        this.enabled = true;
        this.trigger = function (line) {
            if (!this.enabled) return;
            if (!this.regexp.test(line)) return;
            console.log("触发器: " + this.regexp + "触发了");
            var m = line.match(this.regexp);
            this.handler(m)
        };
        this.enable = function () {
            this.enabled = true
        };
        this.disable = function () {
            this.enabled = false
        }
    }
    function Triggers() {
        this.allTriggers = [];
        this.trigger = function (line) {
            var t = this.allTriggers.slice(0);
            for (var i = 0,
                l = t.length; i < l; i++) {
                t[i].trigger(line)
            }
        };
        this.newTrigger = function (r, h, c, n) {
            var t = new Trigger(r, h, c, n);
            if (n) {
                for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                    if (this.allTriggers[i].name == n) this.allTriggers.splice(i, 1)
                }
            }
            this.allTriggers.push(t);
            return t
        };
        this.enableTriggerByName = function (n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) t.enable()
            }
        };
        this.disableTriggerByName = function (n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) t.disable()
            }
        };
        this.enableByCls = function (c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.class == c) t.enable()
            }
        };
        this.disableByCls = function (c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.class == c) t.disable()
            }
        };
        this.removeByCls = function (c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t && t.class == c) this.allTriggers.splice(i, 1)
            }
        };
        this.removeByName = function (n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) this.allTriggers.splice(i, 1)
            }
        }
    }
    // window.triggers = new Triggers;
    window.attach = function () {
        if (!window.webSocketMsg) {
            return false;
        }
        var oldWriteToScreen = window.writeToScreen;
        window.writeToScreen = function (a, e, f, g) {
            oldWriteToScreen(a, e, f, g);
            // a = a.replace(/<[^>]*>/g, "");
            // triggers.trigger(a)
        };
        webSocketMsg.prototype.old = gSocketMsg.dispatchMessage;
        gSocketMsg.dispatchMessage = function (b) {
            this.old(b);
            qlMon.dispatchMessage(b)
        }
    };
    attach()
}

function AutoKillFunc() {
    if (btnList["自动战斗"].innerText == '自动战斗') {
        AutoKill1Func();
        btnList["自动战斗"].innerText = '手动战斗'
    } else {
        clearKill2(); {
            btnList["自动战斗"].innerText = '自动战斗'
        }
    }
    function AutoKill1Func() {
        AutoKill1FuncIntervalFunc = setInterval(AutoKill1, 1000)
    }
    function clearKill2() {
        clearInterval(AutoKill1FuncIntervalFunc)
    }
    function AutoKill1() {
        ninesword();
        if ($('span.outbig_text:contains(战斗结束)').length > 0) {
            clickButton('prev_combat')
        }
    }
}
var banSkills = "天师剑法|天师灭神剑|茅山道术|基本剑法|扑击格斗之技";
function ninesword() {
    zdskill = mySkillLists;
    setTimeout(ninesword1, 1000);
    if ($('span.outbig_text:contains(战斗结束)').length > 0) {
        clickButton('prev_combat')
    }
}
function ninesword1() {
    zdskill = mySkillLists;
    for (var i = 1; i < 8; i++) {
        skillName = $('#skill_' + i).children().children().text();
        if (skillName !== "" && isContains(zdskill, skillName)) {
            clickButton('playskill ' + i);
            return
        }
    }
    for (i = 1; i < 8; i++) {
        skillName = $('#skill_' + i).children().children().text();
        if (skillName !== "" && !isContains(banSkills, skillName)) {
            clickButton('playskill ' + i);
            return
        }
    }
}
itargetNPCOrder = 0;
iNPCOrder = 0;
var igoodsteps = 0;
var PuzzleActIntervalFunc = null;
// function PuzzleActFunc(lstrmsg, lsrslink, lsrsid, lsrsname) {
//     hasAskNpc = true;
//     clearInterval(PuzzleActIntervalFunc);
//     var lsacttype;
//     if (Puzzletrigger != 1) {
//         return
//     }
//     var peopleList = $(".cmd_click3");
//     var thisonclick = null;
//     var targetNPCListHere = [];
//     var countor = 0;
//     var lsrteval = null;
//     var lsnpcname = "";
//     if (lstrmsg.indexOf("可前去寻找") > -1) {
//         setQuestionTxt(lstrmsg);
//         lsrteval = "clickButton('room_sousuo')"
//     }
//     for (var i = 0; i < peopleList.length; i++) {
//         thisonclick = peopleList[i].getAttribute('onclick');
//         if (thisonclick != null && thisonclick.split("'")[1].split(" ")[0] == 'look_item') {
//             if (lsrsname[1] == peopleList[i].innerText) {
//                 lsrteval = "clickButton('get " + thisonclick.split("'")[1].split(" ")[1] + "')"
//             }
//         }
//         if (thisonclick != null && thisonclick.split("'")[1].split(" ")[0] == 'look_npc') {
//             var targetCode = thisonclick.split("'")[1].split(" ")[1];
//             if (typeof (targetCode) != "undefined" && targetCode.indexOf("bad") == -1 && targetCode.indexOf("eren") == -1 && targetCode.indexOf("taofan") == -1 && targetCode.indexOf("bukuai") == -1) {
//                 if (lstrmsg.indexOf("打探打探") > -1 && lsrsname[1] == peopleList[i].innerText) {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('npc_datan " + targetCode + "')"
//                 } else if (lstrmsg.indexOf("想要") > -1) {
//                     setTimeout(PuzzleNextFunc, 1000);
//                     return false;
//                 } else if (lstrmsg.indexOf("可前去打探一番") > -1 && lsrsname[1] == peopleList[i].innerText) {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('npc_datan " + targetCode + "')"
//                 } else if (lstrmsg.indexOf("可前去寻找") > -1) {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('room_sousuo')"
//                 } else if (lstrmsg.indexOf("去替我要回来吧") > -1 && (lsrsname[1] == peopleList[i].innerText || lsrsname[2] == peopleList[i].innerText)) {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('fight " + targetCode + "')"
//                 } else if (lstrmsg.indexOf("去替我要回来可好") > -1 && lsrsname[1] == peopleList[i].innerText) {
//                     setQuestionTxt(lstrmsg);
//                     if (peopleList[i].innerText == "苏小婉" || peopleList[i].innerText == '青楼小厮' || peopleList[i].innerText == '遇见北' || peopleList[i].innerText == '水烟阁武士' || peopleList[i].innerText == '大松鼠' || peopleList[i].innerText == '流氓' || peopleList[i].innerText == '小混混') {
//                         lsrteval = "clickButton('kill " + targetCode + "')"
//                     } else {
//                         lsrteval = "clickButton('fight " + targetCode + "')"
//                     }
//                 } else if (lstrmsg.indexOf("替我去教训教训") > -1 && lsrsname[1] == peopleList[i].innerText) {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('fight " + targetCode + "')"
//                 } else if (lstrmsg.indexOf("尝尝厉害") > -1 && lsrsname[1] == peopleList[i].innerText) {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('fight " + targetCode + "')"
//                 } else if (lstrmsg.indexOf("见识见识厉害") > -1 && lsrsname[1] == peopleList[i].innerText) {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('fight " + targetCode + "')"
//                 } else if (lstrmsg.indexOf("交差了") > -1 && lsrsname[0] == peopleList[i].innerText) {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('ask " + targetCode + "')"
//                 } else if (lstrmsg.indexOf("回去告诉") > -1 && lsrsname[0] == peopleList[i].innerText) {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('ask " + targetCode + "')"
//                 } else if (lstrmsg.indexOf("商量一点事情") > -1 && lsrsname[1] == peopleList[i].innerText) {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('ask " + targetCode + "')"
//                 } else if (lstrmsg.indexOf("回去转告") > -1 && lsrsname[0] == peopleList[i].innerText) {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('ask " + targetCode + "')"
//                 } else if (lstrmsg.indexOf("我有个事情想找") > -1 && lsrsname[1] == peopleList[i].innerText) {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('ask " + targetCode + "')"
//                 } else if (lstrmsg.indexOf("可否帮忙找来") > -1) {
//                     setQuestionTxt(lstrmsg)
//                 } else if (lstrmsg.indexOf("去杀了他") > -1 && lsrsname[1] == peopleList[i].innerText && lsrsname[1] != "龙儿") {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('kill " + targetCode + "')"
//                 } else if (lstrmsg.indexOf("真想杀掉他") > -1 && lsrsname[1] == peopleList[i].innerText && lsrsname[1] != "龙儿") {
//                     setQuestionTxt(lstrmsg);
//                     lsrteval = "clickButton('kill " + targetCode + "')"
//                 }
//                 if (lsrteval) {
//                     eval(lsrteval);
//                     if (lsrteval.indexOf("kill") > -1) {
//                         ninesword()
//                     }
//                     return
//                 }
//             }
//         }
//     }
//     if (lsrteval) {
//         eval(lsrteval)
//     }
//     PuzzleActIntervalFunc = setInterval(function () {
//         PuzzleActFunc(lastcmd, lastpuzzlelink, lastpuzzleid, lastpuzzlename)
//     },2000)
// }
var gstrNpcPath;
var gmapNPCList = [];
var gmapNPCPath = [];
var tempNPCList = [];
var gmapNPCCount = 0;
var iPuzzleOrders = 0;
var gstrMapPath = "";
var storageQuestionIndex = storage.hasOwnProperty("storage_question_mapquestion");

function GetNPCStart() {
    clickButton('home');
    // if (btnList["自动战斗"].innerText == '自动战斗') {
    //     AutoKillFunc()
    // }
    var w = null;
    if (!(w = prompt("请输入迷题地图名次", "雪亭镇"))) {
        return
    }
    GetNPCStartMap(w)
}
function GetNPCPath(dir) {
    var peopleList = $(".cmd_click3");
    var thisonclick = null;
    for (var i = 0; i < peopleList.length; i++) {
        thisonclick = peopleList[i].getAttribute('onclick');
        if (thisonclick != null && thisonclick.split("'")[1].split(" ")[0] == 'look_npc') {
            var targetCode = thisonclick.split("'")[1].split(" ")[1];
            if (isContains(qxNpcList, peopleList[i].innerText)) { } else {
                if (typeof (targetCode) != "undefined" && targetCode.indexOf("bad") == -1 && targetCode.indexOf("eren") == -1 && targetCode.indexOf("taofan") == -1 && targetCode.indexOf("bukuai") == -1) {
                    if (tempNPCList.contains(targetCode)) { } else if (!isQiXia(peopleList[i].innerText)) {
                        // console.log("发现NPC名字：" + (gmapNPCCount + 1) + ":" + peopleList[i].innerText + "，代号：" + targetCode);
                        tempNPCList[gmapNPCCount] = targetCode;
                        if (gstrNpcPath == '') {
                            gmapNPCList[gmapNPCCount] = peopleList[i].innerText + ';' + targetCode;
                            gmapNPCPath[gmapNPCCount] = ''
                        } else {
                            gmapNPCList[gmapNPCCount] = peopleList[i].innerText + ';' + targetCode;
                            gmapNPCPath[gmapNPCCount] = gstrNpcPath
                        }
                        gmapNPCCount = gmapNPCCount + 1
                    }
                }
            }
        }
    }
    var d = dir.split(";");
    if (steps < d.length) {
        clickButton(d[steps]);
        if (gstrNpcPath == '') {
            gstrNpcPath = d[steps]
        } else {
            gstrNpcPath = gstrNpcPath + ';' + d[steps]
        }
        steps += 1;
        setTimeout(function () {
            GetNPCPath(dir)
        }, 800)
    } else {
        steps = 0;
        gstrNpcPath = 0;
        var npcpathlog = 'NPC 数量：' + (gmapNPCList.length) + '\n';
        for (i = 0; i < gmapNPCList.length; i++) {
            npcpathlog = npcpathlog + gmapNPCList[i] + "路径--" + gmapNPCPath[i] + '\n'
        }
        // console.log(npcpathlog)
        setTimeout(function () {
            NpcBatchAskStartFunc()
        }, 1000)
    }
}
function isQiXia(name) {
    var hasQiXiaName = false;
    for (var i = 0; i < QixiaList.length; i++) {
        if (QixiaList[i] == name) {
            hasQiXiaName = true
        }
    }
    return hasQiXiaName
}
var isEndMap = 0;
window.afterAskNpc = null;
var hasAskNpc = false;

function ISAFTERGO() {
    if (afterAskNpc) {
        clearTimeout(afterAskNpc);
    }
    afterAskNpc = setTimeout(() => {
        if (!hasAskNpc) {
            if (g_gmain.is_fighting) {
                setTimeout(() => {
                    ISAFTERGO();
                }, 10 * 1000);
            } else {
                PuzzleNextFunc();
            }
        }
    }, 2 * 60 * 1000);
}
window.CHANGETU = false;
var oldPath = '';
var noChange = false;
function PuzzleNextFunc() {
    if (g_gmain.is_fighting) {
        setTimeout(() => {
            PuzzleNextFunc();
        }, 3000);
        return;
    }
    hasAskNpc = true;
    if (hasEndQuesion) {
        return false;
    }
    hasAskNpc = false;
    iPuzzleOrders = iPuzzleOrders + 1;
    if (iPuzzleOrders < gmapNPCList.length - 1) {
        btnList["进度"].innerText = '[' + (iPuzzleOrders + 1) + ' -> ' + gmapNPCList.length + ']' + gmapNPCList[iPuzzleOrders].split(";")[0];
        let path = returnMinpath(gmapNPCPath[iPuzzleOrders]);
        // if (iPuzzleOrders<2) console.log(gmapNPCPath[iPuzzleOrders]);
        setQuestionMapQuestion(iPuzzleOrders);
        go(path);
        go("ask " + gmapNPCList[iPuzzleOrders].split(";")[1])
        ISAFTERGO();
        // var nextNpc = gmapNPCList[iPuzzleOrders];
        // if (nextNpc) nextNpc = nextNpc.split(";")[0];
        // console.log('更换npc' + nextNpc);
    } else {
        hasDoneMap = true;
        // isEndMap = 1;
        if (!window.CHANGETU) {
            alertMask('已完成当前地图扫暴击,稍后将切换地图')
            console.log(getTimes() + '已完成当前地图扫暴击,稍后将切换地图')
            window.CHANGETU = true;
            setTimeout(function () {
                window.CHANGETU = false;
                removeAlert();
                startNextMap();
            }, 20 * 1000)
        }
    }
}
function startNextMap() {
    iPuzzleOrders = -1;
    setQuestionMapQuestion('-1');
    setQuestionMapAdd();
    getMapPlace(1)
}
function returnMinpath(path) {
    var newpath = '';
    if (oldPath) {
        newpath = path.replace(oldPath, '');
        oldPath = path;
    } else {
        newpath = path;
        oldPath = path;
    }
    return newpath;
}
function PuzzleNPCGoFunc() {

    var num = 0;
    if (!(num = prompt("请输入谜题NPC顺序：", "1"))) {
        return
    }

    num = parseInt(num);
    num = num - 1;
    if (gmapNPCList.length <= 0) {
        return
    }
    if (num < 0 && num >= gmapNPCList.length) {
        return
    }
    iPuzzleOrders = num;
    stopDelayCmd();
    if (iPuzzleOrders < gmapNPCList.length) {
        btnList["进度"].innerText = '[' + (iPuzzleOrders + 1) + ' -> ' + gmapNPCList.length + ']' + gmapNPCList[iPuzzleOrders].split(";")[0];
        let path = returnMinpath(gmapNPCPath[iPuzzleOrders]);
        setQuestionMapQuestion(iPuzzleOrders);
        go(path);
        go("ask " + gmapNPCList[iPuzzleOrders].split(";")[1])
    } else { }
}
function PuzzleNPCAsk() {
    if (g_gmain.is_fighting) {
        setTimeout(() => {
            PuzzleNPCAsk();
        }, 3000);
        return;
    }
    if (iPuzzleOrders < gmapNPCList.length && iPuzzleOrders >= 0) {
        console.log(gmapNPCList[iPuzzleOrders]);
        go("ask " + gmapNPCList[iPuzzleOrders].split(";")[1]);
        console.log(getTimes() + '重新询问')
    }
}
function PuzzleNPCKill() {
    if (g_gmain.is_fighting) {
        setTimeout(() => {
            PuzzleNPCKill();
        }, 3000);
        return;
    }
    if (iPuzzleOrders < gmapNPCList.length && iPuzzleOrders >= 0) {
        console.log(gmapNPCList[iPuzzleOrders]);
        go("kill " + gmapNPCList[iPuzzleOrders].split(";")[1]);
        console.log('杀掉')
    }
}
// 是否做谜题
function isDoMiMaster() {
    var storageDoMi = storage.hasOwnProperty(miCookies);
    if (storageDoMi) {
        var storeMiType = parseInt(storage.getItem(miCookies));
        if (storeMiType == '1') {
            storage.setItem(miCookies, 0);
        } else {
            storage.setItem(miCookies, 1);
        }
    } else {
        storage.setItem(miCookies, 1);
    }
    checkIsMi();
}
function checkIsMi() {
    var storageDoMi = storage.hasOwnProperty(miCookies);
    if (storageDoMi) {
        var storeMiType = parseInt(storage.getItem(miCookies));
        if (storeMiType == '1') {
            btnList["是否谜题"].innerText = '找谜题中';
        } else {
            btnList["是否谜题"].innerText = '不在谜题';
        }
    } else {
        btnList["是否谜题"].innerText = '不在谜题';
    }
}
iBatchAskModel = 0;
function NpcBatchAskFunc() {
    if (Puzzletrigger == 1) {
        listenPuzzleFunc()
    }
    if (iBatchAskModel == 0) {
        iBatchAskModel = 1;
        btnList["单谜题"].innerText = '多谜题'
    } else if (iBatchAskModel == 1) {
        iBatchAskModel = 0;
        iBatchAskStart = 0;
        btnList["单谜题"].innerText = '单谜题'
    }
}
iBatchAskStart = 0;
iValidPuzzleNum = 1;
function NpcBatchAskStartFunc() {
    if (iBatchAskModel == 1) {
        if (Puzzletrigger == 1) {
            listenPuzzleFunc()
        }
        iBatchAskStart = 1
    }
    iPuzzleOrders = iPuzzleOrders + 1;
    if (iPuzzleOrders < gmapNPCList.length) {
        btnList["进度"].innerText = '[' + (iPuzzleOrders + 1) + ' -> ' + gmapNPCList.length + ']' + gmapNPCList[iPuzzleOrders].split(";")[0];
        let path = returnMinpath(gmapNPCPath[iPuzzleOrders]);
        setQuestionMapQuestion(iPuzzleOrders);
        go(path);
        firstQuestion = true;
        go("ask " + gmapNPCList[iPuzzleOrders].split(";")[1])
    } else {
        isEndMap = 1;
        stopDelayCmd();
        go('task_quest');
        // eval("clickButton('task_quest')");
        return false;
    }
}
function GetNPCStartMap(w) {
    isEndMap = 0;
    clickButton('home');
    if (btnList["自动战斗"].innerText == '自动战斗') {
        AutoKillFunc()
    }
    gstrNpcPath = '';
    gmapNPCList = [];
    gmapNPCPath = [];
    tempNPCList = [];
    gmapNPCCount = 0;
    steps = 0;
    iPuzzleOrders = -1;
    if (storageQuestionIndex) {
        var storePuzzleIndex = parseInt(storage.getItem("storage_question_mapquestion"));
        console.log(getTimes() + '开始序号：' + (storePuzzleIndex * 1 + 1));
        iPuzzleOrders = parseInt(storePuzzleIndex);
    }
    var mapNum = null;
    if (w.startsWith("雪亭镇")) {
        mapNum = '1';
        go_path = "jh 1;e;s;w;w;e;s;n;e;e;ne;ne;sw;sw;n;w;n;e;e;n;s;e;e;n;s;e;w;s;n;w;w;w;w;w;e;n;w;e;n;w;e;e;e;w;w;n;n;s;e;w;w"
    } else if (w.startsWith("洛阳")) {
        mapNum = '2';
        go_path = "jh 2;n;n;e;s;n;w;n;e;s;n;w;w;e;n;w;s;w;e;n;e;e;s;n;w;n;w;n;n;w;e;s;s;s;n;w;n;n;n;e;w;s;s;w;e;s;e;e;e;n;s;e;n;n;w;e;e;n;s;w;n;w;e;n;e;w;n;w;e;s;s;s;s;s;w;w;n;w;e;e;n;s;w;n;e;w;n;w;e;e;w;n;e;n;n"
    } else if (w.startsWith("华山村")) {
        mapNum = '3';
        go_path = "jh 3;n;e;w;s;w;n;s;event_1_59520311;n;n;n;n;n;s;s;s;s;s;e;e;s;e;n;s;w;s;e;w;w;n;s;e;s;s;w;n;s;e;s;e;w;n;w;s;nw;n;n;e;get_silver;s;w;n;w;e;n;n;e;w;w;e;n"
    } else if (w.startsWith("华山")) {
        mapNum = '4';
        go_path = "jh 4;n;n;w;e;n;e;w;n;n;n;e;n;n;s;s;w;n;n;w;s;n;w;n;s;e;e;n;e;n;n;w;w;e;e;n;e;w;n;e;w;n;s;s;s;s;s;w;n;w;event_1_30014247;s;w;e;s;s;s;s;e;w;n;n;n;n;n;se;e;n;n;w;e;n;s;s;e;n;n;s;s;s;s"
    } else if (w.startsWith("扬州")) {
        mapNum = '5';
        go_path = "jh 5;n;w;w;n;s;e;e;e;w;n;w;e;e;w;n;w;e;n;w;e;n;w;w;s;s;n;n;n;n;w;n;n;n;s;s;s;e;e;w;n;s;s;s;e;e;e;n;n;n;s;s;w;n;e;n;n;s;s;e;n;n;w;n;n;s;s;w;s;s;e;e;s;w;s;w;n;w;e;e;n;n;e;w;w;e;n;n;s;s;s;s;w;n;w;e;e;w;n;w;w;n;s;e;e;n;e;s;e;s;s;s;n;n;n;w;n;w;w;s;n;w;n;w;e;e;w;n;n;w;n;s;e;e;s;n;w;n"
    } else if (w.startsWith("丐帮")) {
        mapNum = '6';
        go_path = "jh 6;event_1_98623439;s;w;e;n;ne;n;ne;ne;ne;event_1_97428251;n;sw;sw;sw;s;ne;ne;event_1_16841370"
    } else if (w.startsWith("乔阴县")) {
        mapNum = '7';
        go_path = "jh 7;s;s;s;w;s;w;w;w;e;e;e;e;event_1_65599392;n;s;w;e;ne;s;s;e;n;n;e;w;s;s;w;s;w;w;w;n;s;s;e;n;s;e;ne;s;e;n;e;s;e"
    } else if (w.startsWith("峨眉山")) {
        mapNum = '8';
        go_path = "jh 8;w;nw;n;n;n;n;w;e;e;e;n;n;e;n;n;n;n;e;e;w;w;w;n;n;n;e;e;e;e;w;w;n;e;w;w;e;n;e;w;w;e;n;e;e;w;w;w;w;w;w;s;w;e;e;w;s;w;e;e;w;s;w;w;sw;ne;n;s;e;e;s;e;w;w;e;s;e;w;w;e;n;n;e;e;n;n;n;n;w;w;e;s;n;n;s;e;n;n;nw;sw;w;nw;se;e;ne;nw;n;n;s;s;se;se;n;n;s;s;ne;se;s;se;nw;n;nw;ne;n;s"
    } else if (w.startsWith("恒山")) {
        mapNum = '9';
        go_path = "jh 9;n;w;e;n;e;w;n;w;e;n;e;e;w;n;event_1_85624865;n;n;n;n;s;s;s;e;w;w;e;s;w;n;n;e;e;w;n;s;w;w;n;s;s;n;e;n;n;w;n;n;n;w;e;n"
    } else if (w.startsWith("武当山")) {
        mapNum = '10';
        go_path = "jh 10;w;n;n;w;w;w;n;n;n;n;n;w;n;s;e;n;n;n;n;s;s;s;s;e;e;s;n;e;e;w;w;w;w;s;e;e;e;e;s;e;s;e;n;s;s;n;e;e;n;s;e;w;s;s;s"
    } else if (w.startsWith("晚月庄")) {
        mapNum = '11';
        go_path = "jh 11;e;e;n;e;s;sw;se;s;s;s;s;s;s;se;s;n;ne;n;nw;w;w;s;s;w;e;se;e;n;n;n;n;n;n;w;n;s;w;n;w;e;s;w;w;e;s;n;e;s;w;e;s;e;e;e;w;w;w;w;w;n;s;s;n;e;s;n;e;s;w;w;e;e;e;s;s;e;w;w;s;e;e;w;w;n;e;w;w;w;e;n;n;n;s;w;e;s;e;s;n;n;e"
    } else if (w.startsWith("水烟阁")) {
        mapNum = '12';
        go_path = "jh 12;n;e;w;n;n;n;s;w;n;n;e;w;s;nw;e;e;sw;n;s;s;e;w;n;ne;w;n"
    } else if (w.startsWith("少林寺")) {
        mapNum = '13';
        go_path = "jh 13;n;w;w;n;s;e;e;n;n;n;w;e;e;w;n;n;w;e;e;w;n;n;w;e;e;w;n;n;n;n;w;e;e;w;s;e;w;w;e;s;e;s;s;s;s;s;s;s;s;n;n;n;n;n;n;n;n;w;w;s;s;s;s;s;s;s;s"
    } else if (w.startsWith("唐门")) {
        mapNum = '14';
        go_path = "jh 14;e;w;w;n;n;n;n;s;w;n;s;s;n;w;n;s;s;n;w;n;s;s;n;w;e;e;e;e;e;s;n;e;n;e;w;n;n;s"
    } else if (w.startsWith("青城山")) {
        mapNum = '15';
        go_path = "jh 15;s;s;e;w;w;n;s;e;s;e;w;w;w;n;s;s;s;n;n;w;w;w;n;s;w;e;e;e;e;e;e;s;e;w;w;e;s;e;w;s;w;s;ne;s;s;s;e;s;n;w;n;n;n;n;n;n;n;n;n;n;nw;w;nw;n;s;w;s;s;s"
    } else if (w.startsWith("逍遥林")) {
        mapNum = '16';
        go_path = "jh 16;s;s;s;s;e;n;e;event_1_56806815;jh 16;s;s;s;s;e;e;e;s;w;n;s;s;s;n;n;w;n;n;s;s;s;s;n;n;w;w;n;s;s;n;w"
    } else if (w.startsWith("开封")) {
        mapNum = '17';
        go_path = "jh 17;event_1_97081006;s;s;s;e;w;s;s;w;w;e;e;n;n;n;n;n;e;e;s;s;s;s;s;w;e;n;n;n;n;n;w;n;e;s;n;w;w;e;n;e;s;s;s;s;w;e;n;w;e;e;e;e;w;w;n;s;s;n;w;n;n;n;e;n;n;s;s;s;n;w;w;w;n;n;s;s;s;n;e;e;w;n;e;w;n;e;w;w;e;n;e;se;s;nw;n;n;n;event_1_27702191"
    } else if (w.startsWith("明教") || w.startsWith("光明顶")) {
        mapNum = '18';
        go_path = "jh 18;e;w;w;n;s;e;n;nw;n;n;w;e;n;n;n;ne;n;n;w;e;e;w;n;w;e;e;w;n;n;w;w;s;n;n;e;e;e;e;s;se;se;e;w;nw;nw;w;w;n;w;w;n;n;e;nw;se;e;e;e;se;e;w;sw;s;w;w;n;e;w;n;e;w;w;e;n;n;n;n;w;e;n;event_1_90080676;event_1_56007071;ne;n"
    } else if (w.startsWith("全真教")) {
        mapNum = '19';
        go_path = "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;e;w;w;e;n;e;n;s;e;e;w;n;n;s;s;w;w;w;w;w;w;s;n;e;s;n;e;e;e;n;n;w;w;s;s;n;n;w;s;s;n;n;w;n;n;n;n;n;n;e;n;e;e;n;n;s;s;e;e;e;e;s;e;s;s;s;n;w;n;s;s;s;s;w;s;n;w;n;e;n;n;n;s;w;n;n;n;s;s;s;w;n;s;w;n;s;s;s;e;n;n;e;s;s;s;w"
    } else if (w.startsWith("古墓")) {
        mapNum = '20';
        go_path = "jh 20;s;s;n;n;w;w;s;e;s;s;s;s;s;sw;sw;s;e;se;nw;w;s;w;e;e;w;s;s;w;w;e;s;sw;ne;e;s;s;w;w;e;e;s;n;e;e;e;e;s;e;w;n;w;n;n;s;e;w;w;s;n;n;n;n;s;e;w;w"
    } else if (w.startsWith("白驼山")) {
        mapNum = '21';
        go_path = "jh 21;nw;s;n;ne;ne;sw;n;n;ne;w;e;n;n;w;w;e;e;s;s;sw;s;s;sw;w;n;s;w;nw;e;w;nw;nw;n;w;sw;ne;e;s;se;se;n;e;w;n;n;w;e;n;n;w;w;w;n;n;n;n;s;s;s;e;e;e;n;s;s;n;e;e;e;w;ne;sw;n;n;w;e;e;e;w;w;n;nw;se;ne;w;e;e;w;n"
    } else if (w.startsWith("嵩山")) {
        mapNum = '22';
        go_path = "jh 22;n;n;w;w;s;s;s;s;s;n;w;e;n;n;e;w;n;n;e;n;n;n;n;n;e;n;e;w;n;w;n;s;e;n;n;n;w;w;e;n;w;e;n;s;s;e;e;w;n;e;w;n;e;w;n"
    } else if (w.startsWith("寒梅庄")) {
        mapNum = '23';
        go_path = "jh 23;n;n;e;w;n;n;n;n;n;w;w;e;e;e;s;n;w;n;w;w;e;n;s;e;e;n;s;w;n;n;e;w;w;n"
    } else if (w.startsWith("泰山")) {
        mapNum = '24';
        go_path = "jh 24;se;nw;n;n;n;n;w;e;e;e;w;s;n;w;n;n;w;e;e;w;n;e;w;n;w;n;n;n;n;n;s;s;w;n;s;e;s;s;s;e;n;e;w;n;w;e;n;n;e;s;n;e;n;e;w;n;w;e;e;w;n;n;s;s;s;s;s;w;w;n;n;w;e;e;w;n;n;w;e;e;w;n;s;s;s;s;s;w;n;e;w;n;w;e;n;n;e"
    } else if (w.startsWith("大旗门")) {
        mapNum = '25';
        go_path = "jh 25;w;e;e;e;e;e;s"
    } else if (w.startsWith("大昭寺")) {
        mapNum = '26';
        go_path = "jh 26;w;w;w;w;w;n;s;w;s;w;e;e;e;w;w;s;w;w;w;s;n;w;n;n;n;n;n;e;e;e;e;e;w;s;s;w;w;n;w;e;e;w;s;w;n;s;s;n;w";
    }
    else {
        w = null;
        return
    }
    gstrMapPath = go_path;
    btnList["迷题扫图"].innerText = w;
    // var chatText = '当前扫暴地图,#map' + mapNum;
    setTimeout(function () {
        GetNPCPath(go_path)
    }, 1000)
}
// 按钮点击路径
function btnWayClick(e) {
    var Dom = $(e.target);
    var DomTxt = Dom.html();
    clearPuzzleFunc();
    setQuestionMapQuestion('-1');
    switch (DomTxt) {
        case '雪亭镇':
            GoStartXTZ();
            break;
        case '洛阳':
            GoStartLY();
            break;
        case '华山村':
            GoStartHSC();
            break;
        case '华山':
            GoStartHS();
            break;
        case '扬州':
            GoStartYZ();
            break;
        case '丐帮':
            GoStartGB();
            break;
        case '乔阴县':
            GoStartQYX();
            break;
        case '恒山':
            GoStartHS1();
            break;
        case '武当山':
            GoStartWDS();
            break;
        case '少林寺':
            GoStartSLS();
            break;
        case '水烟阁':
            GoStartSYG();
            break;
        case '唐门':
            GoStartTM();
            break;
        case '逍遥林':
            GoStartXYL();
            break;
        case '开封':
            GoStartKF();
            break;
        case '明教':
            GoStartMJ();
            break;
        case '全真教':
            GoStartQZJ();
            break;
        case '白驼山':
            GoStartBTS();
            break;
        case '嵩山':
            GoStartSS();
            break;
        case '寒梅庄':
            GoStartHMZ();
            break;
        case '泰山':
            GoStartTS();
            break;
        case '大昭寺':
            GoStartDZS();
            break;
    }
}
function GoStartXTZ() {
    setQuestionMap('0');
    GetNPCStartMap("雪亭镇");
}
function GoStartLY() {
    setQuestionMap('1');
    GetNPCStartMap("洛阳");
}
function GoStartHSC() {
    setQuestionMap('2');
    GetNPCStartMap("华山村");
}
function GoStartHS() {
    setQuestionMap('3');
    GetNPCStartMap("华山");
}
function GoStartYZ() {
    setQuestionMap('4');
    GetNPCStartMap("扬州");
}
function GoStartGB() {
    setQuestionMap('5');
    GetNPCStartMap("丐帮");
}
function GoStartQYX() {
    setQuestionMap('6');
    GetNPCStartMap("乔阴县");
}
function GoStartHS1() {
    setQuestionMap('7');
    GetNPCStartMap("恒山");
}
function GoStartWDS() {
    setQuestionMap('8');
    GetNPCStartMap("武当山");
}
// function GoStartEMS() {
//     GetNPCStartMap("峨眉山");
// }
function GoStartSYG() {
    setQuestionMap('9');
    GetNPCStartMap("水烟阁");
}
function GoStartSLS() {
    GetNPCStartMap("少林寺");
}
function GoStartTM() {
    setQuestionMap('10');
    GetNPCStartMap("唐门");
}
function GoStartXYL() {
    setQuestionMap('11');
    GetNPCStartMap("逍遥林");
}
function GoStartKF() {
    setQuestionMap('12');
    GetNPCStartMap("开封");
}
function GoStartMJ() {
    setQuestionMap('13');
    GetNPCStartMap("明教");
}
function GoStartQZJ() {
    setQuestionMap('14');
    GetNPCStartMap("全真教");
}
function GoStartGM() {
    setQuestionMap('15');
    GetNPCStartMap("古墓");
}
function GoStartBTS() {
    setQuestionMap('16');
    GetNPCStartMap("白驼山");
}
function GoStartSS() {
    setQuestionMap('17');
    GetNPCStartMap("嵩山");
}
function GoStartHMZ() {
    setQuestionMap('18');
    GetNPCStartMap("寒梅庄");
}
function GoStartTS() {
    setQuestionMap('19');
    GetNPCStartMap("泰山");
}
function GoStartDZS() {
    setQuestionMap('20');
    GetNPCStartMap("大昭寺");
}


function clearStorage() {
    storage.removeItem('storage_question_urlindex');
    storage.removeItem('storage_question_mapindex');
    storage.removeItem('storage_question_mapquestion');
}
function getUrlParams(url) {
    var url = url || window.location.hash
    if (url.indexOf('?')) {
        var search = url.substring(url.lastIndexOf("?") + 1)
        var obj = {}
        var reg = /([^?&=]+)=([^?&=]*)/g
        search.replace(reg, function (rs, $1, $2) {
            var name = decodeURIComponent($1)
            var val = decodeURIComponent($2)
            val = String(val)
            obj[name] = val
            return rs
        })
    }
    return obj
}
var urllist = [];
function setUrlList() {
    var params = getUrlParams(window.location.href);
    if (params.area == '37') {
        urllist = urllist37;
    }
    if (params.area == '1') {
        urllist = urllist1;
    }
}
// 去下一个链接
function nexturl() {
    var urlindex = 0;
    console.log(getTimes() + '切换账号中...');
    // if (storage.hasOwnProperty("storage_question_urlindex")) {
    //     urlindex = parseInt(storage.getItem("storage_question_urlindex"));
    //     if (urlindex >= urllist.length -1) {
    //         var params = getUrlParams(window.location.href);
    //         var tellText = ' QUESTION/new/' + params.area +'区重新开始循环号！';
    //         console.log(tellText)
    //         clickButton('tell ' + assistant + tellText);
    //         clearStorage();
    //         urlindex = 0;
    //     }else{
    //         urlindex++;
    //     }
    // } else {
    urlindex = getUrlIndex();
    urlindex++;
    if (urlindex >= urllist.length) {
        var params = getUrlParams(window.location.href);
        if (params.area == '1') {
            var hours = getHours();
            if (hours == 10 || hours == 20) {
                var tellText = ' QUESTION/new/' + params.area + '区重新开始循环号！';
            }
            console.log(tellText)
            clickButton('tell ' + assistant + tellText);
        }
        urlindex = 0;
    }
    // }

    // setQuestionUrlindex(urlindex);

    console.log(getTimes() + '切换账号' + urlindex);
    if (window.location.host.indexOf('laiwanqu') > -1 || window.location.host.indexOf('localhost') > -1) {
        golaiwanqu(urllist[urlindex]);
    } else {
        window.location.href = urllist[urlindex];
    }
}
function golaiwanqu(url) {
    var link = url.substring(url.indexOf("?") + 1);
    window.location.href = "./y-bao.html?" + link;
}
// 存储url序号
function setQuestionUrlindex(index) {
    storage.setItem("storage_question_urlindex", index);
}
// 存储谜题地图序号
function setQuestionMap(index) {
    storage.setItem("storage_question_mapindex", index);
}
// 存储谜题地图序号
function setQuestionMapQuestion(index) {
    storage.setItem("storage_question_mapquestion", index);
}
function setQuestionMapAdd() {
    var mapIndex = 0;
    if (storage.hasOwnProperty("storage_question_mapindex")) {
        mapIndex = parseInt(storage.getItem("storage_question_mapindex"));
    }
    mapIndex++;
    return mapIndex
}
// 存储谜题地图序号
function getQuestionMap() {
    var mapIndex = 0;
    if (storage.hasOwnProperty("storage_question_mapindex")) {
        mapIndex = parseInt(storage.getItem("storage_question_mapindex"));
    }
    return mapIndex
}

function getMapPlace(type) {
    var index = getQuestionMap();
    if (type) {
        index = setQuestionMapAdd();
    }
    oldPath = '';
    var mapObject = [
        {
            'id': '1',
            'name': '雪亭镇',
            "fun": GoStartXTZ
        },
        {
            'id': '2',
            'name': '洛阳',
            "fun": GoStartLY
        },
        {
            'id': '3',
            'name': '华山村',
            "fun": GoStartHSC
        },
        {
            'id': '4',
            'name': '华山',
            "fun": GoStartHS
        },
        {
            'id': '5',
            'name': '扬州',
            "fun": GoStartYZ
        },
        {
            'id': '6',
            'name': '丐帮',
            "fun": GoStartGB
        },
        {
            'id': '7',
            'name': '乔阴县',
            "fun": GoStartQYX
        },
        {
            'id': '8',
            'name': '恒山',
            "fun": GoStartHS1
        },
        {
            'id': '9',
            'name': '武当山',
            "fun": GoStartWDS
        },
        {
            'id': '10',
            'name': '水烟阁',
            "fun": GoStartSYG
        },
        {
            'id': '11',
            'name': '唐门',
            "fun": GoStartTM
        },
        {
            'id': '12',
            'name': '逍遥林',
            "fun": GoStartXYL
        },
        {
            'id': '13',
            'name': '开封',
            "fun": GoStartKF
        },
        {
            'id': '14',
            'name': '明教',
            "fun": GoStartMJ
        },
        {
            'id': '15',
            'name': '全真教',
            "fun": GoStartQZJ
        },
        {
            'id': '16',
            'name': '白驼山',
            "fun": GoStartBTS
        },
        {
            'id': '17',
            'name': '嵩山',
            "fun": GoStartSS
        },
        {
            'id': '18',
            'name': '寒梅庄',
            "fun": GoStartHMZ
        },
        {
            'id': '19',
            'name': '泰山',
            "fun": GoStartTS
        },
        {
            'id': '20',
            'name': '大昭寺',
            "fun": GoStartDZS
        }
    ]
    if (index > mapObject.length - 1) {
        index = 0;
        // clearStorage();
        iPuzzleOrders = -1;
        setQuestionMapQuestion('-1');
        var msg = '已走完谜图，重制属性'
        alertMask(msg);
        console.log(getTimes() + msg);
        var tellText = ' QUESTION/new/' + msg;
        // console.log(tellText);
        clickButton('tell ' + assistant + tellText);
        mapObject[index].fun();
    } else {
        mapObject[index].fun();
    }
}

function getUrlIndex() {
    let index = 0;
    var id = getUrlParams(window.location.href).id;
    for (var i = 0; i < urllist.length; i++) {
        var pid = getUrlParams(urllist[i]).id;
        if (pid == id) {
            index = i;
        }
    }
    return index
}

// 判断是不是第一个url
function setUrlIndex() {
    var index = getUrlIndex();
    setQuestionUrlindex(index);
}
function goQuestion() {
    console.log(getTimes() + '准备开始做谜题')
    // setUrlIndex();
    go('jh 1');
    go('items get_store /obj/shop/baibaoling');
    go('dh_baibaoling 2 1');
    go('home');
    go('items use obj_mitiling');
    go('items use miticska');
    go('items use miticska');
    go('items use miticska');
    go('items use miticska');
    go('items use miticska');
    go('shop buy shop14');
    go('items use yinlufeng libao');
    setTimeout(function () {
        listenPuzzleFunc();
        getMapPlace();
    }, 10 * 1000)
}
function alertMask(msg) {
    var html = `<div id="alertMask" style="position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.5)"><div style="position: absolute;left: 50%;top: 30%;transform: translate(-50%, -50%);text-align: center;"><div style="color:#fff;font-size: 24px;text-align: center;">` + msg + `</div><div><button onclick="removeAlert()">关闭</button></div></div></div>`
    $('body').append(html);
}



function clearReset() {
    stopDelayCmd()
    if (isEndMap) {
        getMapPlace();
    } else {
        clearPuzzleFunc();
        PuzzleNextFunc();
    }
}
// 获取当前时间
function getHours() {
    var date = new Date();
    var currentdate = date.getHours();
    return currentdate;
}

window.removeAlert = function () {
    $('#alertMask').remove();
}
// 号切换

var urllist37 = [
    "http://sword-direct37.hero123.cn/?id=7905194&time=1555931805749&key=add1a9bbdef032a4ef055356e68ec38e&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=4254240&time=1496395399029&key=b1e7b956bb0d1807e57a6a798db73ee1&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=7245058&time=1526014825532&key=57c91fab15ac91efcec22b33aa7cb7a8&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=7245076&time=1526014906679&key=6dfc516abddddc85b52e861f0e457762&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=7245061&time=1526014969209&key=eceec41a23598e239e35c9c2484bded7&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=7245031&time=1526015028998&key=a4d5355e45ca5a38cb2de116ed823907&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=7245082&time=1526015090256&key=75700f2918afdfdb895e77c865ca6272&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=7245153&time=1526015150731&key=8241fb4639ae8199eb99e5625c6ea9cf&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=7245033&time=1526015255469&key=805efc26503c0c656f3d71b20c8df6a6&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=7245124&time=1526015297914&key=b436c5f06923c7f6010c294ca021ce83&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=7245468&time=1526015346848&key=5b90f0a99f0686942cc6f0951b400c37&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=7245483&time=1526015390150&key=c6bb25085da84e3effcbdde29e7a969e&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=6759497&time=1516587496671&key=f65957c0592953d983def9ec4534fb57&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=3594649&time=1509947200779&key=f7e1510913526c4f0b50b661d5933168&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=4240258&time=1502907117205&key=843f94e6972516967752defc4e6fcf68&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=4228290&time=1494001589195&key=04dc381d32aeb16037bd9c61bc0a1287&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=4228147&time=1503586175200&key=8bb8931bab16ec87838446a391778f9d&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=4214022&time=1497234296930&key=97f38eb8d043d253a7401fb8a9f74bf5&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=4255266&time=1503585130874&key=e7f1b459a7426de3f502bcff9f23a3d2&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=4331515&time=1497796098326&key=5a3641ff5dc5c9d8fa3cdc3dc12c088e&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=4215424&time=1497013947405&key=655318a4507fdbb8983ea1f467617f2a&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=4307628&time=1495453688561&key=fca1c3b794d2482afaea355564c23cae&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=4214108&time=1497013893640&key=779f6e227b6ad6ce27cdb4721d03903c&s_line=1&jian=1&area=37&port=8086",
    "http://sword-direct37.hero123.cn/?id=4285621&time=1497796004483&key=9b3fbc063e83a8a979cc866a57248c75&s_line=1&jian=1&area=37&port=8086",

    // "http://res.hero123.cn/site/jian/sword.html?key=57c91fab15ac91efcec22b33aa7cb7a8&id=7245058&name=laodap11&time=1526014825532&area=37&port=8086&jian=1",
    // "http://res.hero123.cn/site/jian/sword.html?key=6dfc516abddddc85b52e861f0e457762&id=7245076&name=laodap22&time=1526014906679&area=37&port=8086&jian=1",
    // "http://res.hero123.cn/site/jian/sword.html?key=eceec41a23598e239e35c9c2484bded7&id=7245061&name=laodap33&time=1526014969209&area=37&port=8086&jian=1",
    // "http://res.hero123.cn/site/jian/sword.html?key=a4d5355e45ca5a38cb2de116ed823907&id=7245031&name=laodap44&time=1526015028998&area=37&port=8086&jian=1",
    // "http://res.hero123.cn/site/jian/sword.html?key=75700f2918afdfdb895e77c865ca6272&id=7245082&name=laodap55&time=1526015090256&area=37&port=8086&jian=1",
    // "http://res.hero123.cn/site/jian/sword.html?key=8241fb4639ae8199eb99e5625c6ea9cf&id=7245153&name=laodap66&time=1526015150731&area=37&port=8086&jian=1",
    // "http://res.hero123.cn/site/jian/sword.html?key=805efc26503c0c656f3d71b20c8df6a6&id=7245033&name=laodap77&time=1526015255469&area=37&port=8086&jian=1",
    // "http://res.hero123.cn/site/jian/sword.html?key=b436c5f06923c7f6010c294ca021ce83&id=7245124&name=laodap88&time=1526015297914&area=37&port=8086&jian=1",
    // "http://res.hero123.cn/site/jian/sword.html?key=5b90f0a99f0686942cc6f0951b400c37&id=7245468&name=laodap99&time=1526015346848&area=37&port=8086&jian=1",
    // "http://res.hero123.cn/site/jian/sword.html?key=c6bb25085da84e3effcbdde29e7a969e&id=7245483&name=laodap1010&time=1526015390150&area=37&port=8086&jian=1",

    // 'http://res.hero123.cn/site/jian/sword.html?id=6759497&time=1516587496671&key=f65957c0592953d983def9ec4534fb57&area=37&port=8086&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?key=f7e1510913526c4f0b50b661d5933168&id=3594649&name=zx849747&time=1509947200779&area=37&port=8086&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?key=843f94e6972516967752defc4e6fcf68&id=4240258&name=xlyunshan&time=1502907117205&area=37&port=8086&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?key=04dc381d32aeb16037bd9c61bc0a1287&id=4228290&name=ad_UE1x77rJh4lC&time=1494001589195&area=37&port=8086&jian=1',

    // "http://res.hero123.cn/site/sword/sword.html?key=8bb8931bab16ec87838446a391778f9d&id=4228147&name=fory77&time=1503586175200&area=37&port=8086",
    // "http://res.hero123.cn/site/sword/sword.html?key=97f38eb8d043d253a7401fb8a9f74bf5&id=4214022&name=ribilang1&time=1497234296930&area=37&port=8086",
    // "http://res.hero123.cn/site/sword/sword.html?key=e7f1b459a7426de3f502bcff9f23a3d2&id=4255266&name=z19961104&time=1503585130874&area=37&port=8086",
    // "http://res.hero123.cn/site/sword/sword.html?key=5a3641ff5dc5c9d8fa3cdc3dc12c088e&id=4331515&name=lflun11&time=1497796098326&area=37&port=8086",
    // "http://res.hero123.cn/site/sword/sword.html?key=655318a4507fdbb8983ea1f467617f2a&id=4215424&name=jun522&time=1497013947405&area=37&port=8086",
    // "http://res.hero123.cn/site/sword/sword.html?key=fca1c3b794d2482afaea355564c23cae&id=4307628&name=x8301780&time=1495453688561&area=37&port=8086",
    // "http://res.hero123.cn/site/sword/sword.html?key=779f6e227b6ad6ce27cdb4721d03903c&id=4214108&name=jun521&time=1497013893640&area=37&port=8086",
    // "http://res.hero123.cn/site/sword/sword.html?key=9b3fbc063e83a8a979cc866a57248c75&id=4285621&name=lflun1&time=1497796004483&area=37&port=8086",
];
// 00  0 01 02 移除监听
var urllist1 = [
    // "http://sword-direct1.hero123.cn/?id=7598524&time=1537778997467&key=aa2492e6afe53c81900adc46f7b59d06&s_line=1&jian=1&area=1",
    // "http://sword-direct1.hero123.cn:8081/?id=7598640(1)&time=1537779008615&key=6273c473d2ff95650d884c0bb21a3246&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=7598640(1)&time=1537779008615&key=6273c473d2ff95650d884c0bb21a3246&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=7598688(1)&time=1537779039212&key=3cfcb026f3e1cb6758b2f5782f928df2&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=7598681(1)&time=1537779060065&key=dbaaa61cc89a698432f82d377ff3d75a&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=7598643(1)&time=1537779078956&key=094fd0e65e11c61eee873182ffabc7a7&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=7598633(1)&time=1537779096493&key=86d6e0a9f19fc0e46fa68ca7ee121386&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=7598668(1)&time=1537779110002&key=5a20329c5b1ba1071a4cb2b24682dfdb&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=7598616(1)&time=1537779119627&key=bd4873dd81c8079ec26a3a41d6bb076d&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=4254240(1)&time=1496395399029&key=ac25de546a0dea683bd85f8f8d2c5f92&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=6759436(1)&time=1516587241983&key=b3facabadc7f06318d9a496683a3c893&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=6759488(1)&time=1516587338053&key=3ac19f6e23f5b61ccded06aae5d532a3&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=6759498(1)&time=1516587436190&key=aeef4aa106e1446f0e5bb2836e433490&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=6759458(1)&time=1516587466814&key=cd15db6039b99ce19c477e787c8119ff&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=6759492(1)&time=1516587376765&key=8312ddac0fcafd986d868202c7eb47fd&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=6759497(1)&time=1516587496671&key=92a99788bcd31296e1d31124f1c14a55&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=4259178(1)&time=1495772952446&key=21f2b1c7b7eb64049266312e04ba4875&jian=1&select=1&s_line=1&area=1&port=8081",
    "http://sword-direct1.hero123.cn:8081/?id=4219507(1)&time=1550463271929&key=6e6339b86668c2189e8a2fec882de078&jian=1&select=1&s_line=1&area=1&port=8081",    // 老王
    "http://sword-direct1.hero123.cn:8081/?id=7894304(1)&time=1550464593104&key=97606b44ff9596ec5ec3781a791bdfff&jian=1&select=1&s_line=1&area=1&port=8081",    // 货郎
    "http://sword-direct1.hero123.cn:8081/?id=7030223(1)&time=1550463463445&key=062cf95d92dbc026fa05e2fa66bbd3d7&jian=1&select=1&s_line=1&area=1&port=8081",    // 跟班


    // 'http://res.hero123.cn/site/jian/sword.html?key=aa2492e6afe53c81900adc46f7b59d06&id=7598524&name=yu152102&time=1537778997467&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?key=72cea56f71cadcb6185bb7b6c3ec7024&id=7598640&name=yu1521020&time=1537779008615&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?key=d4eb5216304a26d366771fde2f17b744&id=7598688&name=yu1521021&time=1537779039212&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?key=202bae216edfe78d1ce8239a0b738088&id=7598681&name=yu1521022&time=1537779060065&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?key=0ef1f8212c5a34d99f44f26d6da3443c&id=7598643&name=yu1521023&time=1537779078956&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?key=a296fe6886cb39a51749f7295f0157d2&id=7598633&name=yu1521024&time=1537779096493&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?key=82711827d227ba10425a133820e18c54&id=7598668&name=yu1521025&time=1537779110002&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?key=161f9f4f47136342b23568540f29063e&id=7598616&name=yu1521026&time=1537779119627&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?id=6759436&time=1516587241983&key=ecf4ab96f8044d55ccb23ed29b7d485a&s_line=1&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?id=6759488&time=1516587338053&key=0c6728b2cf8941ccca2ad64066ad59d8&s_line=1&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?id=6759498&time=1516587436190&key=3ae64a869ed3ee2ee95783b4a7a27314&s_line=1&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?id=6759458&time=1516587466814&key=5847022078c533c95f1d0c21ac68de11&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?id=6759492&time=1516587376765&key=af09af3a34db56a999696955cc95dde0&area=1&port=8081&jian=1',
    // 'http://res.hero123.cn/site/jian/sword.html?id=6759497&time=1516587496671&key=f65957c0592953d983def9ec4534fb57&area=1&port=8081&jian=1',
];

/* 签到 方法 :start */
async function CheckIn() {
           // 进入章节
    setTimeout(function () {
        go('jh 1'); 
        go('look_npc snow_mercenary');
        setTimeout(() => {
            getNewLibao();
        }, 2000);
    },2000)
    // setTimeout(() => {
    //     go('jh 17;n');
    //     setTimeout(() => {
    //         clickJieRiNpc('白玉堂');
    //     }, 2000);
    // }, 4000);
    setTimeout(function () {
        checkInList();
    }, 6000);
    var id = getUrlParams(window.location.href).id;
    var tellText = ' QUESTION/myId/' + id;
    // console.log(tellText);
    clickButton('tell ' + assistant + tellText);
};
// 节日使者点击
async function clickJieRiNpc(name) {
    setTimeout(function () {
        clickNpcAsk(name);
    }, 1000);
    setTimeout(function () { clickLibaoBtn() }, 3000);
};
// 看相应的人
async function clickNpcAsk(name) {

    var btn = $('.cmd_click3');
    btn.each(function () {
        var txt = $(this).text();
        if (txt == name) {
            var clickText = $(this).attr('onclick');
            var clickAction = getLibaoId(clickText);
            go(clickAction);
        }
    })
};
// 判断是什么礼包
async function clickLibaoBtn() {

    var btn = $('.cmd_click2');
    btn.each(function () {
        var txt = $(this).text();
        if (txt.indexOf('礼包') > 0) {
            var clickText = $(this).attr('onclick');
            var clickAction = getLibaoId(clickText);
            triggerClick(clickAction);
        }
    });
    go('home');
};
async function checkInList() {
    var params = getUrlParams(window.location.href);
    go('items use obj_buqianka');
    go('home');         //回主页
    go('fudi houshan fetch');// 收后山
    go('fudi shennong fetch');// 收神农
    go('fudi juxian fetch_zhuguo'); // 收果子
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
    go('jh 1');       // 进入xueting
    go('event_1_3006512');
    go('event_1_41564409');
    go('event_1_85373703');
    go('w;event_1_21318613;event_1_2882993'); // 潜龙
    go('jh 5');       // 进入扬州
    go('go north');     // 南门大街
    go('go north');   // 十里长街3
    go('go north');    // 十里长街2
    go('go west');    // 黄记杂货
    go('sign7');      //签到
    go('home');         //回主页
    go('jh 1');        // 进入章节
    go('give_ybjd');    // 每日礼包
    go('event_1_85373703')  // 会员点
    go('go east');     // 广场
    go('go north');     // 雪亭镇街道
    go('go east');     // 淳风武馆大门
    go('go east');    // 淳风武馆教练场
    go('event_1_8041045');//谜题卡
    go('event_1_8041045');//谜题卡
    go('event_1_44731074');//消费积分
    go('event_1_29721519'); // 狗年礼券
    go('home');  //回主页
    go('jh 2');
    go('go north');  // 南郊小路
    go('go north');  // 南门
    go('go north');  // 南大街
    go('go north');  // 洛川街
    go('go north');  // 中心鼓楼
    go('go north');  // 中州街
    go('go north');  // 北大街
    go('go east');   // 钱庄
    go('touzi_jihua2 buygo 6');
    go('tzjh_lq');   // 钱庄  clickButton('tzjh_lq', 1) touzi_jihua2 buygo 6
    // go('jh 16;event_1_34159245');
    go('home');     //回主页
    go('swords report go');
    go('swords');
    // go('jh 1;w;w;w;w;s;event_1_85028119;event_1_958380 go'); // 七夕
    // if (params.area == '1') {
    //     go('clan incense cx;clan incense cx;clan incense cx;clan incense cx;clan incense cx;')
    // }
    // var hours = getHours();
    // if (hours == 12 || hours == 20) {
    //     go('jh 1;e;n;n;n;n;w;event_1_90287255 go 8;event_1_1804449;event_1_20090664;event_1_97518803'); // 五一
    // }
    // go('home');         //回主页
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
                clickButton(clickAction);
            }
        }
    });

    clickButton('golook_room');
};
// 获取礼包方法的名称
function getLibaoId(text) {
    var arr = text.split(',');
    var newArr = arr[0].split('(');
    var nowArr = newArr[1].split("'");
    return nowArr[1];
};
var nowPuzzleId = '';

function doOnTime() {
    var storageDoMi = storage.hasOwnProperty(miCookies);
    if (storageDoMi) {
        var storeMiType = parseInt(storage.getItem(miCookies));
        if (storeMiType == '1') {
            doTime(1);
        } else {
            doTime(0);
        }
    } else {
        doTime(0);
    }
}

// 获取当前时间
function getTimes() {
    var date = new Date();
    return date.toLocaleString();
}

function doTime(type) {
    var hours = getHours();
    if (type) {
        goQuestion();
    } else {
        // if (hours == 6 || hours == 8 || hours == 19 || hours == 20 || hours == 21) {
            nexturl();
        // } else {
        //     setTimeout(() => {
        //         doOnTime();
        //     }, 6 * 60 * 1000);
        // }
    }
}

$(function () {
    init();
    webSocketSet();
    setUrlList();
    checkIsMi();
    setTimeout(() => {
        AutoKillFunc();
        CheckIn();
    }, 3000);
    setTimeout(() => {
        doOnTime();
    }, 30 * 1000);
    // 抢物品
    var buttonHeight = "20px";
    var knownlist = [];
    var right0ButtonArray = [];
    var dispatchMessageListener = {};
    var dispatchMessageList = [];
    var clickButtonListener = {};
    var show_userListener = {};
    var show_scoreListener = {};
    var curstamp = 0;
    var prestamp = 0;
    var cmdlist = [];
    var deadlock = 0;

    var qiangdipiButton = document.createElement("button");
    qiangdipiButton.innerText = "开始抢物品";
    right0ButtonArray.push(qiangdipiButton);
    qiangdipiButton.addEventListener("click", qiangdipiFunc);
    var qiangdipiTrigger = 0;
    function qiangdipiFunc() {
        if (qiangdipiTrigger == 0) {
            qiangdipiButton.innerText = "停止抢物品";
            qiangdipiTrigger = 1;
            qiangItem()
        } else {
            if (qiangdipiTrigger == 1) {
                qiangdipiButton.innerText = "开始抢物品";
                qiangdipiTrigger = 0;
                knownlist = []
            }
        }
    }
    function qiangItem() {
        if (qiangdipiTrigger == 1) {
            var Objectlist = g_obj_map.get("msg_room").elements;
            for (var i = 0; i < Objectlist.length; i++) {
                if (Objectlist[i].key.indexOf("item") >= 0) {
                    if (knownlist.indexOf(" " + Objectlist[i].value.split(",")[0]) < 0) {
                        overrideclick("get1 " + Objectlist[i].value.split(",")[0], 0)
                    }
                }
            }
        }
    }
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
                    if ((curstamp - prestamp) > 150) {
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
    newoverrideclick();
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
                400);
            return
        }
        go(cmd);
        setTimeout(function () {
            GoSlowAction(cmds)
        },
            400)
    }
    //
    (function (window) {
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
                    setTimeout(autoSkill, 500);
                    this.timer = setInterval(autoSkill, 1000)
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
                oldWriteToScreen(a, e, f, g);
                if (e == 2 && standForPuzzle.isstanding() && (/你从\S+的尸体里搜出\S+/.test(a) || /你捡起\S+/.test(a))) {
                    standForPuzzle.endstandingGet(a);
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
                if (item) {
                    for (var i = 1; i <= item.size(); i++) {
                        if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf("client_prompt items splite") == 0) {
                            foundsplit = true;
                            continue
                        }
                        if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf("items use") == 0 && !item.containsValue("use_all")) {
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
                        $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="clickButton(\'items splite ' + item.get("id") + "_N_" + item.get("amount") + '\', 1)" class="cmd_click2">全部<br>分解</button></td>')
                    }
                    if (founduse) {
                        if ($("#out .out table:last tr:last td").length == 4) {
                            $("#out .out table:last").append('<tr algin="center"></tr>')
                        }
                        $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="userALlItem(\'' + item.get("id") + ',' + item.get("amount") + '\')" class="cmd_click2">全部<br>使用</button></td>')
                        // $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="clickButton(\'items use ' + item.get("id") + "_N_" + item.get("amount") + '\', 1)" class="cmd_click2">全部<br>使用</button></td>')
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
                var cangkuclone = $(".out table:eq(1) table:eq(1) tr[onclick]").clone();
                cangkuclone = cangkuclone.sort(function (a, b) {
                    return ansi_up.ansi_to_text($(a).text()) > ansi_up.ansi_to_text($(b).text()) ? 1 : -1
                });
                $(".out table:eq(1) table:eq(1) tr[onclick]").remove();
                $(".out table:eq(1) table:eq(1)").prepend(cangkuclone);
                if ($("#items-div #items-zhengli").length == 0) {
                    var lingshibuttontxt = "吃零食中";
                    // if (!gameOption.LingshiSwitch) {
                    //     lingshibuttontxt = "屯零食中"
                    // }
                    $("#out .out table:first").after("<div id='items-div'><button id='items-zhengli' class='cmd_click3'><span class='out2'>整理</span></button> <button id='items-lingshi' class='cmd_click3'><span class='out2'>" + lingshibuttontxt + "</span></button></div>");
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
        };
        attach()
    })(window);

    var standForPuzzle = new StandForPuzzle();
    //
    (function (window) {
        window.attach = function () {
            var oldWriteToScreen = window.writeToScreen;
            window.writeToScreen = function (a, e, f, g) {
                if (e == 2 && a.indexOf("find_task_road") > -1) {
                    ISAFTERGO();
                    a = a.replace(/find_task_road3/g, "find_task_road2");
                    var puzzleItems = a.split("<br/><br/>");
                    var puzzleid = "";
                    for (var i = 0; i < puzzleItems.length; i++) {
                        if (puzzleItems[i].indexOf("find_task_road") == -1) {
                            continue
                        }
                        puzzleid = autoPuzzle.analyzePuzzle(puzzleItems[i]);
                        puzzleItems[i] += " <a href='javascript:go1(\"cus|startpuzzle|" + puzzleid + "\")'>【GO】</a>";
                        if (autoPuzzle.puzzleWating && puzzleid == autoPuzzle.puzzleWating.puzzleid) {
                            if (autoPuzzle.puzzleWating.actionCode == "get" && autoPuzzle.puzzleWating.status == "wait") {
                                puzzleItems[i] += " <a href='javascript:go1(\"cus|puzzlekillget\")'>【杀】</a>"
                            }
                            if (puzzleItems[i].indexOf("谜题") == -1) {
                                autoPuzzle.startpuzzle(puzzleid)
                            }
                        }
                    }
                    a = puzzleItems.join("<br/><br/>");
                    // console.log('oldPath:' +oldPath);
                    if (oldPath != '') {
                        autoPuzzle.startpuzzle(puzzleid);
                    }
                    oldPath = '';
                } else {
                    if (e == 2 && a.indexOf("不接受你给的东西。") > -1 && autoPuzzle.puzzleWating && autoPuzzle.puzzleWating.puzzleid && autoPuzzle.puzzleWating.status == "give") {
                        console.log('不接受你给的东西。');
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
                                console.log('我就不给，你又能怎样？');
                                autoPuzzle.doPuzzle(autoPuzzle.puzzleWating.puzzleid)
                            } else {
                                if (e == 2 && autoPuzzle.puzzleWating && autoPuzzle.puzzleWating.puzzleid && /完成谜题\((\d+)\/\d+\)：(.*)的谜题\S*\s*\S*x(\d+)\s*\S*x\d+\s*\S*银两x(\d{1,})/.test(a)) {
                                    var puzzleFinish = /完成谜题\((\d+)\/\d+\)：(.*)的谜题\S*\s*\S*x(\d+)\s*\S*x\d+\s*\S*银两x(\d{1,})/.exec(a);
                                    puzzleFinish[2] = puzzleFinish[2].replace(/^<\/span>/, "").replace(//g, "");
                                    if (puzzleFinish[2] == autoPuzzle.puzzleList[autoPuzzle.puzzleWating.puzzleid].firstPublisherName) {
                                        autoPuzzle.puzzleList[autoPuzzle.puzzleWating.puzzleid].prize = puzzleFinish[0].replace(/<\/?span[^>]*>/g, "").replace(/<br\/>/g, "\n");
                                        if (+ puzzleFinish[4] > 1800) {
                                            a += "<br/><a href='javascript:go1(\"cus|puzzlesubmit|" + autoPuzzle.puzzleWating.puzzleid + "\")'>【提交】</a>"
                                            go1("cus|puzzlesubmit|" + autoPuzzle.puzzleWating.puzzleid);
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
                                setTimeout(() => {
                                    go1(autoPuzzle.puzzleWating.actionCode + " " + id)
                                }, 200);
                            } else {
                                if (autoPuzzle.puzzleWating.actionCode == "killget" && plainName == autoPuzzle.puzzleWating.waitTargetName) {
                                    setTimeout(() => {
                                        go1("kill " + id)
                                    }, 200);
                                }
                            }
                        } else {
                            if (subType == "new_item" && ["get"].indexOf(autoPuzzle.puzzleWating.actionCode) > -1) {
                                if (name == autoPuzzle.puzzleWating.target || id.indexOf("corpse") > -1) {
                                    setTimeout(() => {
                                        go1("get " + id)
                                    }, 200);
                                }
                            }
                        }
                    }
                }
                old_change_room_object(c)
            };
        };
        window.attach();
        var autoPuzzle = window.autoPuzzle = new AutoPuzzle();
        window.definedAutoPuzzle = true
    })(window);

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
                                    if (npc[i].value) {
                                        var npcinfo = npc[i].value.split(",");
                                        npcArr[npcinfo[0]] = npc[i]
                                    }
                                }
                                this.puzzleWating.waitCount = 0;
                                console.log(npcArr);
                                for (var npcid in npcArr) {
                                    go1("give " + npcArr[npcid].value.split(",")[0]);
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
                                    if (objs[index].value) {
                                        go1("get " + objs[index].value.split(",")[0])
                                    }
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
                                        that.lookNpcForKillGet(npcs,
                                            function () {
                                                that.puzzleWating.status = "return";
                                                go1("find_task_road2 " + puzzleid)
                                            }
                                        )
                                    })
                            }
                        } else {
                            if (that.puzzleWating.status == "returned") {
                                var npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                                    return item.key.indexOf("npc") == 0 && that.ansiToHtml(item.value.split(",")[1]) == that.puzzleWating.target
                                });
                                if (npcs.length > 0) {
                                    for (var index in npcs) {
                                        if (npcs[index].value) {
                                            if (npcs[index].value) {
                                                go1("give " + npcs[index].value.split(",")[0])
                                            }
                                        }
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
                        },
                            200)
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
                        if (buyitems[i].value) {
                            go1("buy " + buyitems[i].value.split(",")[0] + " from " + npcid)
                        }
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
                    "baituo": "白驼山",
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
                // var mapname = mapList[this.puzzleList[puzzleid].publisherMap] ? mapList[this.puzzleList[puzzleid].publisherMap] : this.puzzleList[puzzleid].publisherMap;
                var mapname = btnList["迷题扫图"].innerText;
                if (puzzleid) {
                    var value = this.puzzleList[puzzleid].prize + "\n位置：" + mapname + "-" + ansi_up.ansi_to_html(this.puzzleList[puzzleid].publisherRoom).replace(/<[^>]*>/g, "") + "\n首步：" + this.puzzleList[puzzleid].firstStep;
                    var tellText = ' QUESTION/new/' + value.replace(/\s+/g, "");
                    console.log(tellText)
                    clickButton('tell ' + assistant + tellText);
                    // $.post(serverurl, {
                    //     value: value
                    // })
                }
            }
        }
    }
})

