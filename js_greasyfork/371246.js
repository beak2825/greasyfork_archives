// ==UserScript==
// @name         wsmud_plugins
// @description  武神传说 MUD
// @author       kotokz
// @match        http://game.wsmud.com/*
// @require      http://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require      http://cdn.staticfile.org/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.js
// @require      http://cdn.staticfile.org/semantic-ui/2.4.1/components/tab.min.js
// @require      http://cdn.staticfile.org/semantic-ui/2.4.1/components/modal.min.js
// @require      http://cdn.staticfile.org/semantic-ui/2.4.1/components/dimmer.min.js
// @require      http://cdn.staticfile.org/semantic-ui/2.4.1/components/transition.min.js
// @require      http://cdn.staticfile.org/semantic-ui/2.4.1/components/form.min.js
// @require      http://cdn.staticfile.org/semantic-ui/2.4.1/components/checkbox.min.js
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @version      0.3.21
// @ts-check
// @namespace cqv
// @downloadURL https://update.greasyfork.org/scripts/371246/wsmud_plugins.user.js
// @updateURL https://update.greasyfork.org/scripts/371246/wsmud_plugins.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 控制型主动， 包括昏迷和忙乱
    // 此类技能安先后顺序判断
    var default_busy_pfms = new Map([
        ['破气诀', 'sword.poqi'],
        ['缠字诀', 'sword.chan'],
        ['绊字决', 'club.chan'],
        ['夺魄', 'unarmed.duo'],
        ['无形剑气', 'unarmed.qi'],
        ['金蛇追魂', 'sword.duo'],
        ['无我', 'force.wuwo'],
        ['呆若木鸡', 'unarmed.dai'],
        ['金蛇狂舞', 'sword.wu'],
        ['无影掌', 'unarmed.chan'],
        ['金蛇游身', 'dodge.snake'],
        ['凌波', 'dodge.lingbo'],
        ['血祭', 'force.power']
    ]);

    // 给敌人上的debuff， 适合cd时间比持续时间短的
    var default_debuff_pfms = new Map([
        ['唯我独尊', {
            pfm: 'force.power',
            sid: 'chidun',
            name: '迟钝',
        }],
        ['灭剑', {
            pfm: 'sword.mie',
            sid: 'damage',
            name: '灭剑',
        }],
        // ['呆若木鸡', {
        //     pfm: 'unarmed.dai',
        //     sid: 'unarmed',
        //     name: '迟钝',
        // }],
        // ['重剑无锋', {
        //     pfm: 'sword.zhong',
        //     sid: 'xuantie',
        //     name: '残缺',
        // }]
    ]);

    const jiuYangBlackListPfms = [
        'unarmed.liu',
        'throwing.jiang',
    ]
    // 攻击类主动， 或者主动冷却时间很长不值得判断是否存在的buff类主动也可以
    // 这里的主动都只会判断冷却，如果能用就用
    var default_attack_pfms = new Map([
        // ['移花', 'parry.yi'],
        ['重剑无锋', 'sword.zhong'],
        ['定影', 'throwing.ding'],
        ['绝剑', 'sword.jue'],
        ['生死符', 'unarmed.zhong'],
        ['落花', 'throwing.luo'],
        ['阳关三叠', 'unarmed.san'],
        ['白虹掌力', 'unarmed.po'],
        ['血海魔刀', 'blade.xue'],
        ['六脉纵横', 'unarmed.liu'],
        ['倚天剑决', 'sword.yi'],
        ['十步杀一人', 'force.shi'],
        ['三阴毒爪', 'unarmed.san'],
        ['一气化三清', 'force.san'],
        ['无我', 'force.wuwo'],
        ['海潮汹涌', 'sword.chao'],
        ['震字决', 'unarmed.zhen;parry.zhen'],
        ['连字诀', 'sword.lian'],
        [' 随字决', 'sword.sui'],
        ['千蛇出洞', 'sword.jiang'],
        ['断字诀', 'blade.chan'],
        ['断字诀', 'blade.ref'],
        ['千蛇出洞', 'throwing.jiang'],
        ['星雨', 'throwing.jiang'],
        ['拳经', 'unarmed.quan'],
        ['降龙', 'unarmed.qi'],
        ['十八掌', 'unarmed.shiba'],
        ['天下无狗', 'club.wu'],
        ['破字诀', 'parry.pojian'],
        ['唱仙法', 'parry.chang'],
        ['破玉', 'unarmed.po'],
        ['无中生有', 'unarmed.wu'],
        ['五神剑', 'sword.jiang'],
        ['追魂爪', 'unarmed.zhui'],
        ['风卷残云', 'unarmed.juan'],
        ['不老长春', 'force.xi'],
    ]);

    // buff 类主动， id需要自己查， 这类主动特点是必须等待buff消失才能使用
    // 所以必须要buff id来判断是否消失
    var default_buff_pfms_with_name = new Map([
        ['无招', {
            pfm: 'sword.wu',
            id: 'weapon'
        }],
        ['无我', {
            pfm: 'force.wuwo',
            id: 'weapon'
        }],
        ['嗜血', {
            pfm: 'blade.shi',
            id: 'weapon'
        }],
        ['血魔', {
            pfm: 'force.mo',
            id: 'force'
        }],
        ['九阳护体', {
            pfm: 'force.power',
            id: 'force'
        }],
        ['逆转九阴', {
            pfm: 'force.cui',
            id: 'force'
        }],
        ['明玉', {
            pfm: 'force.power',
            id: 'force'
        }],
        ['斩杀', {
            pfm: 'force.power',
            id: 'force'
        }],
        ['真武除邪', {
            pfm: 'force.chu',
            id: 'force'
        }],
        ['白首太玄', {
            pfm: 'force.power',
            id: 'force'
        }],
        ['紫气东来', {
            pfm: 'force.xi',
            id: 'force'
        }],
        ['太上忘情', {
            pfm: 'force.wang',
            id: 'mingyu'
        }],
        ['踏歌行', {
            pfm: 'dodge.power',
            id: 'dodge'
        }],
        ['五神赋', {
            pfm: 'parry.wu',
            id: 'parry'
        }],
        ['移花', {
            pfm: 'parry.yi',
            id: 'yihua'
        }],
        ['星移', {
            pfm: 'parry.yi',
            id: 'xingyi'
        }],
        ['万佛化身', {
            pfm: 'dodge.zhen',
            id: 'dodge'
        }],
        ['仙游', {
            pfm: 'dodge.lingbo',
            id: 'dodge'
        }],
        ['无痕', {
            pfm: 'dodge.power',
            id: 'dodge'
        }],
    ]);
    //~~~~~~~~~~~自动出招设置~~~~~~~~~~~~~~~~~

    //~~~~~~~~~~~~~~~~~~~~用户设定结束~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var timer = undefined;
    var zb_npc;
    var zb_place;
    var equip = {
        "铁镐": "",
    };
    var npcs = {
        "店小二": 0
    };
    var place = {
        "住房": "jh fam 0 start;go west;go west;go north;go enter",
        "住房-小花园": "jh fam 0 start;go west;go west;go north;go enter;go northeast",
        "住房-练功房": "jh fam 0 start;go west;go west;go north;go enter;go west",
        "住房-卧室": "jh fam 0 start;go west;go west;go north;go enter;go north",
        "扬州城-钱庄": "jh fam 0 start;go north;go west;",
        "扬州城-醉仙楼": "jh fam 0 start;go north;go north;go east",
        "扬州城-武庙": "jh fam 0 start;go north;go north;go west",
        "扬州城-杂货铺": "jh fam 0 start;go east;go south",
        "扬州城-打铁铺": "jh fam 0 start;go east;go east;go south",
        "扬州城-药铺": "jh fam 0 start;go east;go east;go north",
        "扬州城-衙门正厅": "jh fam 0 start;go west;go north;go north",
        "扬州城-矿山": "jh fam 0 start;go west;go west;go west;go west",
        "扬州城-擂台": "jh fam 0 start;go west;go south",
        "扬州城-当铺": "jh fam 0 start;go south;go east",
        "扬州城-帮派": "jh fam 0 start;go south;go south;go east",
        "扬州城-扬州武馆": "jh fam 0 start;go south;go south;go west",
        "扬州城-镖局正厅": "jh fam 0 start;go west;go west;go south;go south",
        "武当派-广场": "jh fam 1 start;",
        "武当派-三清殿": "jh fam 1 start;go north",
        "武当派-石阶": "jh fam 1 start;go west",
        "武当派-练功房": "jh fam 1 start;go west;go west",
        "武当派-太子岩": "jh fam 1 start;go west;go northup",
        "武当派-桃园小路": "jh fam 1 start;go west;go northup;go north",
        "武当派-舍身崖": "jh fam 1 start;go west;go northup;go north;go east",
        "武当派-南岩峰": "jh fam 1 start;go west;go northup;go north;go west",
        "武当派-乌鸦岭": "jh fam 1 start;go west;go northup;go north;go west;go northup",
        "武当派-五老峰": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup",
        "武当派-虎头岩": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup",
        "武当派-朝天宫": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north",
        "武当派-三天门": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north",
        "武当派-紫金城": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north",
        "武当派-林间小径": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north;go north",
        "武当派-后山小院": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north;go north;go north;go north",
        "少林派-广场": "jh fam 2 start;",
        "少林派-山门殿": "jh fam 2 start;go north",
        "少林派-东侧殿": "jh fam 2 start;go north;go east",
        "少林派-西侧殿": "jh fam 2 start;go north;go west",
        "少林派-天王殿": "jh fam 2 start;go north;go north",
        "少林派-大雄宝殿": "jh fam 2 start;go north;go north;go northup",
        "少林派-钟楼": "jh fam 2 start;go north;go north;go northeast",
        "少林派-鼓楼": "jh fam 2 start;go north;go north;go northwest",
        "少林派-后殿": "jh fam 2 start;go north;go north;go northwest;go northeast",
        "少林派-练武场": "jh fam 2 start;go north;go north;go northwest;go northeast;go north",
        "少林派-罗汉堂": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go east",
        "少林派-般若堂": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go west",
        "少林派-方丈楼": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north",
        "少林派-戒律院": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go east",
        "少林派-达摩院": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go west",
        "少林派-竹林": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go north",
        "少林派-藏经阁": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go north;go west",
        "少林派-达摩洞": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go north;go north;go north",
        "华山派-镇岳宫": "jh fam 3 start;",
        "华山派-苍龙岭": "jh fam 3 start;go eastup",
        "华山派-舍身崖": "jh fam 3 start;go eastup;go southup",
        "华山派-峭壁": "jh fam 3 start;go eastup;go southup;jumpdown",
        "华山派-山谷": "jh fam 3 start;go eastup;go southup;jumpdown;go southup",
        "华山派-山间平地": "jh fam 3 start;go eastup;go southup;jumpdown;go southup;go south",
        "华山派-林间小屋": "jh fam 3 start;go eastup;go southup;jumpdown;go southup;go south;go east",
        "华山派-玉女峰": "jh fam 3 start;go westup",
        "华山派-玉女祠": "jh fam 3 start;go westup;go west",
        "华山派-练武场": "jh fam 3 start;go westup;go north",
        "华山派-练功房": "jh fam 3 start;go westup;go north;go east",
        "华山派-客厅": "jh fam 3 start;go westup;go north;go north",
        "华山派-偏厅": "jh fam 3 start;go westup;go north;go north;go east",
        "华山派-寝室": "jh fam 3 start;go westup;go north;go north;go north",
        "华山派-玉女峰山路": "jh fam 3 start;go westup;go south",
        "华山派-玉女峰小径": "jh fam 3 start;go westup;go south;go southup",
        "华山派-思过崖": "jh fam 3 start;go westup;go south;go southup;go southup",
        "华山派-山洞": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;go enter",
        "华山派-长空栈道": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;go enter;go westup",
        "华山派-落雁峰": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;go enter;go westup;go westup",
        "华山派-华山绝顶": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;go enter;go westup;go westup;jumpup",
        "峨眉派-金顶": "jh fam 4 start",
        "峨眉派-庙门": "jh fam 4 start;go west",
        "峨眉派-广场": "jh fam 4 start;go west;go south",
        "峨眉派-走廊": "jh fam 4 start;go west;go south;go east",
        "峨眉派-休息室": "jh fam 4 start;go west;go south;go east;go south",
        "峨眉派-厨房": "jh fam 4 start;go west;go south;go east;go east",
        "峨眉派-练功房": "jh fam 4 start;go west;go south;go west;go west",
        "峨眉派-小屋": "jh fam 4 start;go west;go south;go west;go north;go north",
        "峨眉派-清修洞": "jh fam 4 start;go west;go south;go west;go south;go south",
        "峨眉派-大殿": "jh fam 4 start;go west;go south;go south",
        "峨眉派-睹光台": "jh fam 4 start;go northup",
        "峨眉派-华藏庵": "jh fam 4 start;go northup;go east",
        "逍遥派-青草坪": "jh fam 5 start",
        "逍遥派-林间小道": "jh fam 5 start;go east",
        "逍遥派-练功房": "jh fam 5 start;go east;go north",
        "逍遥派-木板路": "jh fam 5 start;go east;go south",
        "逍遥派-工匠屋": "jh fam 5 start;go east;go south;go south",
        "逍遥派-休息室": "jh fam 5 start;go west;go south",
        "逍遥派-木屋": "jh fam 5 start;go north;go north",
        "逍遥派-地下石室": "jh fam 5 start;go down",
        "丐帮-树洞内部": "jh fam 6 start",
        "丐帮-树洞下": "jh fam 6 start;go down",
        "丐帮-暗道": "jh fam 6 start;go down;go east",
        "丐帮-破庙密室": "jh fam 6 start;go down;go east;go east;go east",
        "丐帮-土地庙": "jh fam 6 start;go down;go east;go east;go east;go up",
        "丐帮-林间小屋": "jh fam 6 start;go down;go east;go east;go east;go east;go east;go up",
        "杀手楼-大门": "jh fam 7 start",
        "杀手楼-大厅": "jh fam 7 start;go north",
        "杀手楼-暗阁": "jh fam 7 start;go north;go up",
        "杀手楼-铜楼": "jh fam 7 start;go north;go up;go up",
        "杀手楼-休息室": "jh fam 7 start;go north;go up;go up;go east",
        "杀手楼-银楼": "jh fam 7 start;go north;go up;go up;go up;go up",
        "杀手楼-练功房": "jh fam 7 start;go north;go up;go up;go up;go up;go east",
        "杀手楼-金楼": "jh fam 7 start;go north;go up;go up;go up;go up;go up;go up",
        "杀手楼-书房": "jh fam 7 start;go north;go up;go up;go up;go up;go up;go up;go west",
        "杀手楼-平台": "jh fam 7 start;go north;go up;go up;go up;go up;go up;go up;go up",
        "襄阳城-广场": "jh fam 8 start",
        "武道塔-入口": "jh fam 9 start"
    };
    let path2 = {
        "武当派-林间小径": "go north",
        "少林派-竹林": "go north",
        "峨眉派-走廊": "go west;go west;go north;go north;go south;go south;go south;go south",
        "逍遥派-林间小道": "go west;go north;go south;go west;go east;go south;go north",
        "逍遥派-木屋": "go south;go south;go south;go south",
        "逍遥派-地下石室": "go down",
        "丐帮-暗道": "go east;go east;go east;go east",
    };
    let xiangyang_fullpath = "jh fam 8 start;go west;go west;go west;go west;go west;go east;go north;go north;go north;go north;go east;go east;go east;go east;go north;go south;go east;go east;go east;go east;go south;go south;go south;go south;go east;go west;go south;go south;go south;go south;go south;go west;go west;go west;go west;go south;go north;go west;go west;go west;go west;go north;go north;go north;go north;jh fam 8 start;go north;go north;go north;go north;jh fam 8 start;go south;go south;go south;go south;jh fam 8 start;go east;go east;go east;go east;go west;go north";
    var role;
    let family = null;
    //快捷键功能
    var KEY = {
        keys: [],
        roomItemSelectIndex: -1,
        init: function () {
            //添加快捷键说明
            document.querySelector('span[command=stopstate] span:first-child').innerHTML = "S";
            document.querySelector("span[command=showcombat] span:first-child").innerHTML = "A";
            document.querySelector("span[command=showtool] span:first-child").innerHTML = "C";
            document.querySelector("span[command=pack] span:first-child").innerHTML = "B";
            document.querySelector("span[command=tasks] span:first-child").innerHTML = "L";
            document.querySelector("span[command=score] span:first-child").innerHTML = "O";
            document.querySelector("span[command=jh] span:first-child").innerHTML = "J";
            document.querySelector("span[command=skills] span:first-child").innerHTML = "K";
            document.querySelector("span[command=message] span:first-child").innerHTML = "U";
            document.querySelector("span[command=shop] span:first-child").innerHTML = "P";
            document.querySelector("span[command=stats] span:first-child").innerHTML = "I";
            // document.querySelector("span[command=setting] span:first-child").innerHTML = ",";


            // $(document).on("keydown", this.e);
            document.addEventListener('keydown', this.e);

            this.add(27, function () {
                KEY.dialog_close();
            });
            this.add(192, function () {
                $(".map-icon").click();
            });
            this.add(32, function () {
                KEY.dialog_confirm();
            });
            this.add(83, function () {
                KEY.do_command("stopstate");
            });
            this.add(13, function () {
                KEY.do_command("showchat");
            });
            this.add(65, function () {
                KEY.do_command("showcombat");
            });
            this.add(67, function () {
                KEY.do_command("showtool");
            });
            this.add(66, function () {
                KEY.do_command("pack");
            });
            this.add(76, function () {
                KEY.do_command("tasks");
            });
            this.add(79, function () {
                KEY.do_command("score");
            });
            this.add(74, function () {
                KEY.do_command("jh");
            });
            this.add(75, function () {
                KEY.do_command("skills");
            });
            this.add(73, function () {
                KEY.do_command("stats");
            });
            this.add(85, function () {
                KEY.do_command("message");
            });
            this.add(80, function () {
                KEY.do_command("shop");
            });
            // this.add(188, function () {
            //     KEY.do_command("setting");
            // });

            this.add(81, function () {
                AS.auto_sm_task();
            });
            this.add(87, function () {
                AS.go_yamen_task();
            });
            this.add(69, function () {
                WG.kill_all();
            });
            this.add(82, function () {
                WG.get_all();
            });
            this.add(84, function () {
                // WG.sell_all();
                AS.auto_pack();
            });
            this.add(89, function () {
                WG.zdwk();
            });

            this.add(112, function () {
                WG.auto_pfm_button();
            });

            this.add(113, function () {
                WG.combat_stat_finish();
            });

            this.add(115, function () {
                AS.oneButtonXuruoWushen();
            });
            this.add(9, function () {
                KEY.onRoomItemSelect();
                return false;
            });

            //方向
            this.add(102, function () {
                send_cmd("go east");
                KEY.onChangeRoom();
            });
            this.add(39, function () {
                send_cmd("go east");
                KEY.onChangeRoom();
            });
            this.add(100, function () {
                send_cmd("go west");
                KEY.onChangeRoom();
            });
            this.add(37, function () {
                send_cmd("go west");
                KEY.onChangeRoom();
            });
            this.add(98, function () {
                send_cmd("go south");
                KEY.onChangeRoom();
            });
            this.add(40, function () {
                send_cmd("go south");
                KEY.onChangeRoom();
            });
            this.add(104, function () {
                send_cmd("go north");
                KEY.onChangeRoom();
            });
            this.add(38, function () {
                send_cmd("go north");
                KEY.onChangeRoom();
            });
            this.add(99, function () {
                send_cmd("go southeast");
                KEY.onChangeRoom();
            });
            this.add(97, function () {
                send_cmd("go southwest");
                KEY.onChangeRoom();
            });
            this.add(105, function () {
                send_cmd("go northeast");
                KEY.onChangeRoom();
            });
            this.add(103, function () {
                send_cmd("go northwest");
                KEY.onChangeRoom();
            });

            this.add(49, function () {
                KEY.combat_commands(0);
            });
            this.add(50, function () {
                KEY.combat_commands(1);
            });
            this.add(51, function () {
                KEY.combat_commands(2);
            });
            this.add(52, function () {
                KEY.combat_commands(3);
            });
            this.add(53, function () {
                KEY.combat_commands(4);
            });
            this.add(54, function () {
                KEY.combat_commands(5);
            });
            this.add(55, function () {
                KEY.combat_commands(6);
            });
            this.add(56, function () {
                KEY.combat_commands(7);
            });
            this.add(57, function () {
                KEY.combat_commands(8);
            });
            this.add(58, function () {
                KEY.combat_commands(9);
            });
            this.add(59, function () {
                KEY.combat_commands(10);
            });
            //alt
            this.add(49 + 512, function () {
                KEY.onRoomItemAction(0);
            });
            this.add(50 + 512, function () {
                KEY.onRoomItemAction(1);
            });
            this.add(51 + 512, function () {
                KEY.onRoomItemAction(2);
            });
            this.add(52 + 512, function () {
                KEY.onRoomItemAction(3);
            });
            this.add(53 + 512, function () {
                KEY.onRoomItemAction(4);
            });
            this.add(54 + 512, function () {
                KEY.onRoomItemAction(5);
            });
            //ctrl
            this.add(49 + 1024, function () {
                KEY.room_commands(0);
            });
            this.add(50 + 1024, function () {
                KEY.room_commands(1);
            });
            this.add(51 + 1024, function () {
                KEY.room_commands(2);
            });
            this.add(52 + 1024, function () {
                KEY.room_commands(3);
            });
            this.add(53 + 1024, function () {
                KEY.room_commands(4);
            });
            this.add(54 + 1024, function () {
                KEY.room_commands(5);
            });
        },
        add: function (k, c) {
            var tmp = {
                key: k,
                callback: c,
            };
            this.keys.push(tmp);
        },
        e: function (event) {
            if ($(".channel-box").is(":visible") || $(".setting").is(":visible") || $(".ui.long.modal").is(":visible")) {
                KEY.chatModeKeyEvent(event);
                return;
            }

            if ($(".dialog-confirm").is(":visible") &&
                ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)))
                return;

            var kk = (event.ctrlKey || event.metaKey ? 1024 : 0) + (event.altKey ? 512 : 0) + event.keyCode;
            for (var k of KEY.keys) {
                if (k.key == kk)
                    return k.callback();
            }
        },
        dialog_close: function () {
            $(".dialog-close").click();
        },
        dialog_confirm: function () {
            $(".dialog-btn.btn-ok").click();
        },
        do_command: function (name) {
            $("span[command=" + name + "]").click();
        },
        room_commands: function (index) {
            $("div.combat-panel div.room-commands span:eq(" + index + ")").click();
        },
        combat_commands: function (index) {
            $("div.combat-panel div.combat-commands span.pfm-item:eq(" + index + ")").click();
        },
        chatModeKeyEvent: function (event) {
            switch (event.keyCode) {
                case 27:
                    // ESC
                    KEY.dialog_close();
                    break;
                case 84:
                    // T
                    if (event.altKey) {
                        KEY.dialog_close();
                    }
                    break;
                case 13:
                    // Enter
                    if ($(".sender-box").val()) $(".sender-btn").click();
                    else KEY.dialog_close();
                    break;
            }
        },
        onChangeRoom: function () {
            this.roomItemSelectIndex = -1;
        },
        onRoomItemSelect: function () {
            if (this.roomItemSelectIndex != -1) {
                $(".room_items div.room-item:eq(" + this.roomItemSelectIndex + ")").css("background", "#000");
            }
            this.roomItemSelectIndex = (this.roomItemSelectIndex + 1) % $(".room_items div.room-item").length;
            var curItem = $(".room_items div.room-item:eq(" + this.roomItemSelectIndex + ")");
            curItem.css("background", "#444");
            curItem.click();
        },
        onRoomItemAction: function (index) {
            //NPC下方按键
            $(".room_items .item-commands span:eq(" + index + ")").click();
        },
    }

    function get_map_id(path) {
        var i = path.indexOf('/');
        return i >= 0 ? path.substr(0, i) : path;
    }

    function get_text(str) {
        return $.trim($('<body>' + str + '</body>').text());
    }

    function get_name(name_str) {
        let name = get_text(name_str);
        let i = name.lastIndexOf(' ');

        if (i >= 0) {
            name = name.substr(i + 1).replace(/<.*>/g, '');
        }
        return name;
    }

    // function get_title(name_str) {
    //     var name = get_text(name_str);
    //     var i = name.lastIndexOf(' ');
    //     if (i >= 0) {
    //         return name.substr(0, i);
    //     }
    //     return '';
    // }

    function find_item(name) {
        for (let [key, value] of game_items) {
            if (value.name.indexOf(name) != -1) {
                return key;
            }
        }

        return null;
    }


    function find_npc(name) {
        for (let [key, value] of game_items) {
            if (value.name.indexOf(name) != -1 && !value.isPlayer) {
                return key;
            }
        }

        return null;
    }

    function find_pack_item(name) {
        for (var [key, value] of pack_items) {

            if (value.name.indexOf(name) !== -1) {
                return key;
            }
        }
        return null;
    }

    var _ws = window['WebSocket'],
        ws, ws_on_message;
    var message_listeners = [];
    var listener_seq = 0;

    function add_listener(types, fn) {
        var listener = {
            'id': ++listener_seq,
            'types': types,
            'fn': fn
        };
        message_listeners.push(listener);
        return listener.id;
    }

    function remove_listener(id) {
        for (var i = 0; i < message_listeners.length; i++) {
            if (message_listeners[i].id == id) {
                message_listeners.splice(i, 1);
            }
        }
    }

    function fire_listener(data) {
        for (var i = 0; i < message_listeners.length; i++) {
            var listener = message_listeners[i];
            if (listener.types == data.type || (listener.types instanceof Array && $
                .inArray(data.type, listener.types) >= 0)) {
                listener.fn(data);
            }
        }
    }
    var my_receive_message = function (evt) {
        ws_on_message.apply(this, arguments);
        if (!evt || !evt.data) return;
        var data;

        if (evt.data[0] == '{' || evt.data[0] == '[') {
            var func = new Function("return " + evt.data + ";");
            data = func();
        } else {
            data = {
                type: 'text',
                msg: evt.data
            };
        }
        if (data.type !== "msg" && GS.console_debug) {
            console.log(data);
        }
        fire_listener(data);
    };

    function show_msg(msg) {
        ws_on_message({
            data: msg
        });
    }

    function log(msg) {
        show_msg('<hio>' + msg + '</hio>');
    }

    unsafeWindow["WebSocket"] = function (uri) {
        ws = new _ws(uri);
    };

    unsafeWindow["WebSocket"].prototype = {
        CONNECTING: _ws.CONNECTING,
        OPEN: _ws.OPEN,
        CLOSING: _ws.CLOSING,
        CLOSED: _ws.CLOSED,
        get url() {
            return ws.url;
        },
        get protocol() {
            return ws.protocol;
        },
        get readyState() {
            return ws.readyState;
        },
        get bufferedAmount() {
            return ws.bufferedAmount;
        },
        get extensions() {
            return ws.extensions;
        },
        get binaryType() {
            return ws.binaryType;
        },
        set binaryType(t) {
            ws.binaryType = t;
        },
        get onopen() {
            return ws.onopen;
        },
        set onopen(fn) {
            ws.onopen = fn;
        },
        get onmessage() {
            return ws.onmessage;
        },
        set onmessage(fn) {
            ws_on_message = fn;
            ws.onmessage = my_receive_message;
        },
        get onclose() {
            return ws.onclose;
        },
        set onclose(fn) {
            ws.onclose = fn;
        },
        get onerror() {
            return ws.onerror;
        },
        set onerror(fn) {
            ws.onerror = fn;
        },
        send: function (text) {
            if (echo) {
                show_msg('<hiy>' + text + '</hiy>');
            }
            //console.log(data);
            ws.send(text);
        },
        close: function () {
            ws.close();
        }
    };
    var my_id, room, map_id,
        game_items = new Map(),
        my_basic_skills = new Map(),
        my_special_skills = new Map(),
        my_eq = new Array(),
        pack_items = new Map(),
        combat_stats = new Map(),
        combat_start_time,
        current_target_id = null,
        in_combat = false,
        i_am_ready = true,
        cooldowns = new Map(),
        my_buffs = new Map(),
        all_targets = new Map()


    function check_pickaxe(item) {
        if (item && item.id && item.name && item.name.indexOf("★铁镐") !== -1) {
            equip["铁镐"] = item.id;
            messageAppend("发现铁镐， 更新id完毕");
        }
    }

    var busy_timer;

    function fmt_number(t) {
        if (isNaN(t)) {
            return 0;
        }
        return Number(t).toFixed(1);
    }

    function setTargetByName(name) {
        let trimedName = strip(name);
        if (trimedName) {
            for (const [key, item] of game_items) {
                if (key != my_id && item.name.includes(trimedName)) {
                    current_target_id = key;
                }
            }
        }
        GS.console_debug && log(`目前攻击目标为${game_items.get(current_target_id).name}`);
    }
    // 自动吸内
    // var suck_target = null;
    // add_listener(['text', 'combat', 'sc'], function (data) {
    //     if (data.type == 'combat' && data.end) {
    //         log("战斗结束");
    //         send_cmd("liaoshang");
    //         setTimeout(() => {
    //             log(`疗伤结束，继续比试,  ${suck_target}`);
    //             send_cmd(`fight ${suck_target}`);
    //         }, 10000);
    //     } else if (data.type == 'sc' && data.id != my_id) {
    //         suck_target = data.id;
    //     } else if (data.type == 'text' && data.msg.includes("状态不是很好，你想趁人之危吗？")) {
    //         setTimeout(() => {
    //             log(`继续比试,  ${suck_target}`);
    //             send_cmd(`fight ${suck_target}`);
    //         }, 2000);
    //     } else if (data.type == 'text' && data.msg.includes('你先调整好自己的状态再来找别人比试吧')) {
    //         send_cmd("liaoshang");
    //         setTimeout(() => {
    //             log(`疗伤结束，继续比试,  ${suck_target}`);
    //             send_cmd(`fight ${suck_target}`);
    //         }, 5000);
    //     }
    // })

    add_listener(['login', 'room', 'items', 'item', 'itemadd', 'itemremove', 'dialog', 'dispfm', 'status', 'sc', 'msg', 'combat', 'text', 'state'], function (data) {
        if (data.type == 'login') {
            my_id = data.id;
            if (data.setting.auto_work && data.setting.auto_work != 1 && data.setting.auto_work.indexOf('xiulian') !== -1) {
                WG.xiulian = true;
            } else {
                WG.xiulian = false;
            }
        } else if (data.type == 'room') {
            room = data;
            map_id = get_map_id(room.path);
            WG.room_name = data.name;
            WG.room_path = data.path;
        } else if (data.type == 'items') {
            // items = new Map();
            var corpseRegex = />(.+)的尸体</g;
            data.items.forEach(item => {
                if (!item.name) return;

                var match = corpseRegex.exec(item.name);

                if (match && match[1]) {
                    // id changed after the npc became a corpse
                    // so we removed the died npc from target, and set the npc to zero HP.
                    var npc_id = find_item(match[1]);
                    var npc = game_items.get(npc_id);
                    if (npc && npc.hp) npc.hp = 0;
                    all_targets.delete(npc_id);

                } else {
                    var name = get_name(item.name);

                    let match = item.name.match(/lt;([^&]+)&gt;<\/hig>$/);
                    let status = match ? match[1] : "";
                    var dupe = find_item(name);
                    const isPlayer = item.p ? true : false;
                    if (dupe && dupe.isPlayer == isPlayer) {
                        game_items.delete(dupe);
                    }
                    if (name != undefined) {
                        game_items.set(item.id, {
                            name: name,
                            fullname: item.name,
                            hp: item.hp,
                            max_hp: item.max_hp,
                            mp: item.mp,
                            max_mp: item.max_mp,
                            status: status,
                            isPlayer: isPlayer,
                        });
                    } else {
                        console.log(`非法名字， ${item.name}`);
                    }
                }
            });
            WG.show_hp();
        } else if (data.type == 'dialog' && data.dialog == 'skills') {
            if (data.items) {
                data.items.forEach(skill => {

                    if (skill.id && skill.name) {
                        var name = jQuery(skill.name).text();

                        if (name.indexOf("基本") !== -1) {
                            my_basic_skills.set(skill.id, {
                                name: name,
                                id: skill.id,
                                level: skill.level,
                                enable_skill: skill.enable_skill
                            });
                        } else {
                            my_special_skills.set(skill.id, {
                                name: name,
                                level: skill.level
                            });
                        }
                    }
                });
                messageAppend("更新练习技能完毕");
            } else if (data.level) {
                var skill = my_basic_skills.get(data.id);
                var d = new Date();
                if (!skill) {
                    skill = my_special_skills.get(data.id);
                }

                if (skill) {
                    messageAppend(`${skill.name} 等级:  ${data.level} ${d.toLocaleTimeString()}`);

                    if ((data.level - skill.level) === 1) {
                        $(document).unbind('resumejob');
                        $(document).bind('resumejob', function () {
                            WG.lianxi(data.id)
                        });
                    }
                    skill.level = data.level;

                    if (GS.max_skill_level != 0 && skill.level >= GS.max_skill_level) {
                        WG.zdwk();
                    }
                }
            } else if (data.enable) {
                let skill = my_basic_skills.get(data.id);
                skill.enable_skill = data.enable;
            }
        } else if (data.type == 'dialog' && data.dialog == 'pack') {
            if (data.items) {
                pack_items = new Map();
                for (var i = 0; i < data.items.length; i++) {
                    if (data.items[i]) {
                        pack_items.set(data.items[i].id, {
                            name: data.items[i].name,
                            count: data.items[i].count
                        });
                        check_pickaxe(data.items[i]);
                    }

                }
                if (data.eqs.length > 0) my_eq = new Array();

                for (var i = 0; i < data.eqs.length; i++) {
                    if (data.eqs[i]) {
                        pack_items.set(data.eqs[i].id, {
                            name: data.eqs[i].name,
                            count: data.eqs[i].count
                        });
                        my_eq.push(data.eqs[i].id);
                        check_pickaxe(data.eqs[i]);
                    }
                }

            } else if (data.id && data.count) {
                var item = pack_items.get(data.id);
                if (fenjieList.includes(data.name)) {
                    send_cmd(`fenjie ${data.id}`);
                } else {
                    if (item) {

                        battleMsgAppend(`你获得了 ${data.name} ${data.count - item.count}${data.unit} 一共有 ${data.count}${data.unit}`);
                        item.count = data.count;
                    } else {
                        battleMsgAppend(`你获得了 ${data.name} 一共有 ${data.count} ${data.unit}`);
                        pack_items.set(data.id, {
                            name: data.name,
                            count: data.count,
                        })
                    }
                }

                if ((/养精丹/).test(data.name)) send_cmd("use " + data.id);
            } else {
                if ('eq' in data) {
                    my_eq.push(data.id)
                } else if ('uneq' in data) {
                    let index = my_eq.indexOf(data.id);
                    if (index !== -1) my_eq.splice(index, 1);
                }
            }


        } else if (data.type == 'dialog' && data.dialog == 'score') {
            if (data.id && data.id === my_id && data.family) {
                family = data.family.substr(0, 2);
            } if (data.level && data.level.includes('武帝')) {
                WG.xiulian = true;
            }

        } else if (data.type == 'itemadd') {
            var corpseRegex = />(.+)的尸体</g;
            var match = corpseRegex.exec(data.name);
            if (match && match[1]) {
                // id changed after the npc became a corpse
                var npc_id = find_item(match[1]);
                var npc = game_items.get(npc_id);
                if (npc && npc.hp) npc.hp = 0;
                all_targets.delete(npc_id);

            } else {

                var name = get_name(data.name);
                let match = data.name.match(/lt;([^&]+)&gt;<\/hig>/);
                let status = match ? match[1] : "";

                if (name != undefined) {
                    var dupe = find_item(name);
                    const isPlayer = data.p ? true : false;
                    if (dupe && dupe.isPlayer == isPlayer) {
                        game_items.delete(dupe);
                    }
                    game_items.set(data.id, {
                        name: name,
                        fullname: data.name,
                        hp: data.hp,
                        max_hp: data.max_hp,
                        mp: data.mp,
                        max_mp: data.max_mp,
                        status: status,
                        isPlayer: isPlayer,
                    });
                }
            }
            WG.show_hp();
            if (GS.xy_auto_kill && (data.name.includes('蒙古兵') || data.name.includes('夫长'))) {
                kill_cmd(data.id);
            }
        } else if (data.type == 'item') {
            var item = game_items.get(data.id);
            if (item)
                log(item.name + " hp = " + item.hp + "/" + item.max_hp);
            WG.show_hp();
        } else if (data.type == 'itemremove') {
            all_targets.delete(data.id);
            // var npc = game_items.get(data.id);
            // if (npc && npc.hp) npc.hp = 0;
            WG.show_hp();
        } else if (data.type == 'msg') {
            if ((map_id == 'home' || map_id == 'yz') && data.ch == 'sys' &&
                /^(.+)和(.+)于今日大婚，在醉仙楼大摆宴席，婚礼将在一分钟后开始。$/.test(data.content)) {
                setTimeout(() => {
                    $(document).trigger('resumejob');
                }, 5000);
                var h = add_listener(['items', 'cmds', 'text'], function (data) {
                    if (data.type == 'items') {
                        for (var i = 0; i < data.items.length; i++) {
                            if (data.items[i].name == '<hio>婚宴礼桌</hio>' || data.items[i].name == '<hiy>婚宴礼桌</hiy>') {
                                remove_listener(h);
                                send_cmd('get all from ' + data.items[i].id);

                                messageAppend("领取喜宴完毕");
                                break;
                            }
                        }
                    } else if (data.type == 'text') {
                        if (/^店小二拦住你说道：(怎么又是你|这位.*不好意思)(.+)$/.test(data.msg)) {
                            remove_listener(h);
                            messageAppend("领取喜宴失败");
                        }
                    } else if (data.type == 'cmds') {
                        for (var i = 0; i < data.items.length; i++) {
                            if (data.items[i].name == '9金贺礼') {
                                send_cmd(data.items[i].cmd + ';go up');
                                break;
                            }
                        }
                    }
                });
                send_cmd('stopstate;jh fam 0 start;go north;go north;go east;go up');
            }
        } else if (data.type == 'combat') {
            if (data.start) {
                in_combat = true;
                // current_target_id = null;
                // combat_stats = new Map();
                combat_start_time = performance.now();
                remove_listener(WG.damagelistner);
                if (WG.dmg_timer) {
                    clearInterval(WG.dmg_timer);
                }
                WG.damagelistner = add_listener(['text'], function (data) {

                    if (data.type == 'text' && data.msg) {
                        let dmgRegex = /造成.*\>(\d+).*点.*伤害.*[\s\S]+\(([^>]+|<.*>)</g;
                        let xingyiRegex = /而来，(.*)一时慌乱被打个正着，受到了(\d+).*伤害/g;
                        let dmg = 0;
                        let target;
                        let match = dmgRegex.exec(data.msg);
                        if (match && match[0] && match[1]) {
                            dmg = parseInt(match[1]);
                            target = strip(match[2]);
                        } else {
                            match = xingyiRegex.exec(data.msg);
                            if (match && match[0] && match[1]) {
                                dmg = parseInt(match[2]);
                                target = match[1];
                            } else if (data.msg == "你要用绝招对付谁？" && in_combat) {
                                WG.combat_finish();
                            } else if (data.msg.includes('只能在战斗中使用') && in_combat) {
                                WG.combat_finish();
                            }
                        }

                        if (target && target !== "" && dmg > 0) {
                            if (combat_stats.has(target)) {
                                combat_stats.set(target, combat_stats.get(target) + dmg);
                            } else {
                                combat_stats.set(target, dmg);
                            }

                            if (target != '你') {
                                setTargetByName(target);
                                var dps_text = "";
                                combat_stats.forEach((value, name) => {
                                    var npc_id = find_item(name);
                                    var max_hp = 0;
                                    if (npc_id && name !== '你') {
                                        var npc = game_items.get(npc_id);
                                        max_hp = npc.max_hp;
                                        if (dps_text == "") {
                                            dps_text += `<hir>伤害:${name}:(${Math.floor(value / max_hp * 100)}%)`
                                        } else {
                                            dps_text += `|${name}:(${Math.floor(value / max_hp * 100)}%)`
                                        }
                                    }

                                })
                                $(".item-dps").html(dps_text + "</hir>");
                            }
                        }

                        // if (data.msg === "<hig>恭喜你战胜了武道塔守护者，你现在可以进入下一层。</hig>" || data.msg === "<hir>你的挑战失败了。</hir>") {
                        if (data.msg === "<hig>恭喜你战胜了武道塔守护者，你现在可以进入下一层。</hig>" || (!GS.jyLbNotAttack && data.msg === "<hir>你的挑战失败了。</hir>")) {
                            WG.combat_finish();
                            WG.combat_stat_finish();
                        }

                    }
                });

                battleMsgAppend("进入战斗");
            } else if (data.end) {
                in_combat = false;
                WG.combat_finish();
            }
        } else if (data.type == 'text') {

            let r = data.msg.match(/你对著(.+)喝道：「.*！今日不是你死就是我活！」|^(.*)说道：既然.*赐教.*只好奉陪|你扑向(.*)！|你对著<[^>]*>([^>]+)<\/.*>喝道：「.*！今日不是你|^<hir>看起来(.+)想杀死你！<\/hir>/);
            if (r) {
                let result = r[1] || r[2] || r[3] || r[4] || r[5];
                result && setTargetByName(result);
            }
            if (data.msg.match(/^\<hig\>你获得了\d+点经验，\d+点潜能。\<\/hig\>/)) {
                $(document).unbind('resumejob');
                $(document).bind('resumejob', function () {
                    WG.zdwk()
                });
            }
            // if (in_combat) {
            //     let r = data.msg.match(/^<hir>看起来(.+)想杀死你！<\/hir>/);
            //     if (r && r[1]) {
            //         setTargetByName(r[1]);
            //     }
            // } else {


            // }
        } else if (data.type == 'dispfm') {
            if (data.rtime) {
                i_am_ready = false;
                var _id = data.id;
                setTimeout(function () {
                    if (!i_am_ready && !my_buffs.has('busy') && !my_buffs.has('faint') && !my_buffs.has('rash')) {
                        i_am_ready = true;
                    }
                    fire_listener({
                        type: 'pfm_ok',
                        id: _id
                    });
                }, data.rtime);
            }
            if (data.id && data.distime) {
                cooldowns.set(data.id, true);
                var _id = data.id;
                setTimeout(function () {
                    cooldowns.set(_id, false);
                    fire_listener({
                        type: 'pfm_ok',
                        id: _id
                    });
                }, data.distime);
            }
        } else if (data.type == 'status') {
            if (data.id == my_id) {
                if (data.action == 'add') {
                    my_buffs.set(data.sid, data.name);
                    if (data.sid == 'busy' || data.sid == 'faint') {
                        var _id = data.id;
                        battleMsgAppend(`你被${data.name}了${data.duration / 1000}秒`);
                        if (data.name == '绊字诀') return;
                        i_am_ready = false;
                        setTimeout(function () {
                            cooldowns.set(_id, false);
                            if (!my_buffs.has('busy') && !my_buffs.has('faint')) {
                                i_am_ready = true;
                            }
                            fire_listener({
                                type: 'pfm_ok',
                                id: _id
                            });
                        }, data.duration);
                    }

                } else if (data.action == 'refresh' && data.count) {

                    my_buffs.set(data.sid, data.count);
                } else if (data.action == 'remove') {
                    if (Array.isArray(data.sid)) {
                        data.sid.forEach(id =>
                            my_buffs.delete(id)
                        );
                    } else {
                        my_buffs.delete(data.sid);
                    }
                    if (!my_buffs.has('busy') && !my_buffs.has('faint')) {
                        i_am_ready = true;
                    }
                    fire_listener({
                        type: 'pfm_ok',
                        id: _id
                    });
                } else if (data.action == 'clear') {
                    my_buffs.clear();
                    fire_listener({
                        type: 'pfm_ok',
                        id: _id
                    });
                }
            } else {
                let npc = game_items.get(data.id);
                // if (npc && npc.isPlayer) {
                //     // ignore player status check and return.
                //     return;
                // }
                var target = all_targets.get(data.id);
                if (data.action == 'add') {
                    if (!target) {
                        target = createTarget(data.id);
                    }
                    target.buffs.set(data.sid, data.name);
                    target.ttl = new Date().getTime();
                    if (data.sid == 'busy' || data.sid == 'faint' || data.sid == 'chidun' || data.sid == 'unarmed') {
                        npc = game_items.get(data.id);
                        battleMsgAppend(`${npc.name}被${data.name}了${data.duration / 1000}秒`);
                    }
                } else if (data.action == 'remove') {
                    if (target) {
                        if (Array.isArray(data.sid)) {
                            data.sid.forEach(id =>
                                target.buffs.delete(id)
                            );
                        } else {
                            target.buffs.delete(data.sid);
                        }
                        target.ttl = new Date().getTime();
                    }
                } else if (data.action == 'clear') {
                    if (target) {
                        target.buffs.clear();
                        target.ttl = new Date().getTime();
                    }
                }
            }

        } else if (data.type == 'sc') {
            let npc = game_items.get(data.id);
            if (!npc || (npc.isPlayer && data.id != my_id)) {
                return;
            }
            if (data.hp)
                npc.hp = data.hp;
            else if (data.mp)
                npc.mp = data.mp;

            if (data.id != my_id) {
                if (data.hp > 0) {
                    let target = all_targets.get(data.id);
                    if (!target) {
                        target = createTarget(data.id);
                    }
                    target.hp = data.hp;
                    target.ttl = new Date().getTime();
                } else if (data.hp == 0) {
                    all_targets.delete(data.id);
                }
            }
            WG.show_hp(data.id);
        } else if (data.type == 'state') {
            let mystatus = "";
            if (data.state) {
                mystatus = data.state;
            }

            let my_profile = game_items.get(my_id);
            my_profile.status = mystatus;
        }
    });

    // for mingjiao
    add_listener('items', function (data) {
        for (let item of data.items) {
            if (item.name && item && !item.p && /冷谦|张中|周颠|颜垣|闻苍松|庄铮|辛然|唐洋/g.test(item.name)) {
                send_cmd(`kill ${item.id}`);
            }
        }
    });

    var echo = false;

    var send_cmd = function (cmd) {
        if (cmd && ws && ws.readyState == 1) {
            cmd = cmd instanceof Array ? cmd : cmd.split(';');
            for (var c of cmd) {
                send_singlecmd(c)
            };
        }
    };

    const kill_cmd = (id) => {
        current_target_id = id;
        send_cmd(`kill ${id}`);
    }
    var send_singlecmd = function (cmd) {
        try {
            if (GS.console_debug) {
                show_msg('<hiy>' + cmd + '</hiy>');
            }
            ws.send(cmd);
        } catch (e) {
            show_msg(e);
        }
    }

    function check_buff() {
        var pfms = [];
        if (GS.jyLbNotAttack && my_buffs.has('force') && my_buffs.get('force') == '阳焰') {
            return;
        }
        default_buff_pfms_with_name.forEach((skill, name) => {
            if (skill.pfm === 'force.wuwo') {
                if (GS.wuwo_type == 'wuwo_weapon_buff') {
                    perform_busy(true);
                } else {
                    return;
                }
            }
            if (!my_buffs.has(skill.id) && can_perform(skill.pfm, name)) {
                pfms.push(`perform ${skill.pfm}`);
            }
        })
        if (pfms.length > 0 && in_combat) {
            send_cmd(pfms.join(';'));
            return true;
        }
        return false;
    }

    function perform_debuff_remove() {

        let perform = false;
        if (my_buffs.has('busy') || my_buffs.has('xuantie') || my_buffs.has('chidun') || my_buffs.has('miss')) {
            perform = true;
        } else if (my_buffs.has('force') && my_buffs.get('force') == '阳焰') {
            if (current_target_id) {
                let target = getTarget(current_target_id);
                if (target && GS.jyLbNotAttack &&
                    (target.buffs.has('force') && target.buffs.get('force') === '九阳护体')) {
                    return false;
                }
            }
            // perform = true;
        }
        if (perform) {
            if (can_perform('force.huifu', '游龙庄') && GS.youlongjiekong) {
                send_cmd('perform force.huifu');
            } else if (can_perform('parry.dao', '倒转乾坤') && GS.nuoyijiekong) {
                send_cmd('perform parry.dao');
            }
        }
    }

    function perform_healing() {
        const me = game_items.get(my_id);
        if ((me.hp / me.max_hp) < 0.2 && GS.hexiangz && can_perform('parry.dao', '倒转乾坤')) {
            try_perform('parry.dao', '倒转乾坤');
        } else if ((me.hp / me.max_hp) < 0.4 && GS.hexiangz && can_perform('force.xi', '鹤翔庄')) {
            try_perform('force.xi', '鹤翔庄');
        }
    }

    function perform_busy(weapon_only = false, force = false) {
        let target;
        if (current_target_id) {
            target = getTarget(current_target_id);
            if (target && target.hp <= 0) {
                target = getTarget();
            }
        } else {
            target = getTarget();
        }
        var pfms = [];
        if (target && GS.jyLbNotAttack &&
            ((target.buffs.has('force') && target.buffs.get('force') === '九阳护体') ||
                (target.buffs.has('dodge') && target.buffs.get('dodge') === '凌波'))) {
            return false;
        }
        let pfmBusy = false;
        // check for busy/faint only skills, which idealy shouldn't overlay with each other
        if (force || (target && !target.buffs.has('busy') && !target.buffs.has('faint'))) {
            pfmBusy = true;
        }


        if (pfmBusy) {
            // (!my_buffs.has('dodge') || family != '逍遥' || !has_perform('dodge.lingbo'))) {

            default_busy_pfms.forEach((pfm, name) => {
                if (pfm === 'force.wuwo' && GS.wuwo_type !== 'wuwo_control') {
                    return;
                }
                if (weapon_only && !/sword|blade/.test(pfm)) {
                    return;
                }

                if (pfm === 'dodge.lingbo' && target && target.buffs.has('unarmed') && target.buffs.get('unarmed') === '迟钝') {
                    return;
                }
                if (pfm !== 'dodge.lingbo' && my_buffs.has('force') && my_buffs.get('force') == '阳焰') {
                    return false;
                }
                if (pfms.length < 1 && can_perform(pfm, name)) {
                    pfms.push(`perform ${pfm}`);
                }
            })
        }

        // check target debuff which can overlap with busy/faint
        default_debuff_pfms.forEach((skill, name) => {
            if (target && can_perform(skill.pfm, name) && !target.buffs.has(skill.sid)) {
                pfms.push(`perform ${skill.pfm}`);
            }
        })

        if (!weapon_only && can_perform('parry.duo', '空手入白刃')) {
            pfms.push('perform parry.duo')
        }

        if (pfms.length > 0 && in_combat) {
            send_cmd(pfms.join(';'));
            return true;
        }
        return false;
    }

    function perform_attack(n, skill) {
        var pfms = [];
        let hasJiuYang = false;
        if (GS.jyLbNotAttack) {
            if (my_buffs.has('force') && my_buffs.get('force') == '阳焰') {
                return false;
            }
            let target;
            if (current_target_id) {
                target = getTarget(current_target_id);
                if (target && target.hp <= 0) {
                    target = getTarget();
                }
            } else {
                target = getTarget();
            }

            if (target && ((target.buffs.has('force') && target.buffs.get('force') === '九阳护体') ||
                (target.buffs.has('dodge') && target.buffs.get('dodge') === '凌波'))) {
                return false;
            }


            if (target && target.buffs.has('force2')) {
                hasJiuYang = true;
            }

        }

        default_attack_pfms.forEach((pfm, name) => {
            let pfm_list = pfm.split(";");
            for (var c of pfm_list) {
                if ((!skill || c == skill) && (!n || pfms.length < n) && can_perform(c, name)) {
                    if ((c !== 'force.wuwo' || GS.wuwo_type === 'wuwo_damage')) {
                        if (GS.noThrowing && c == 'throwing.jiang' && name == '千蛇出洞') {
                            continue;
                        }
                        if (!(GS.jyLbNotAttack && jiuYangBlackListPfms.includes(c) && hasJiuYang))
                            pfms.push(`perform ${c}`);
                    }
                }
            };

        })
        if (pfms.length > 0 && in_combat) {
            send_cmd(pfms.join(';'));
            return true;
        }
        return false;
    }

    function has_perform(id, name) {
        return $('span.pfm-item[pid="' + id + '"]').length > 0;
    }

    function can_perform(id, name) {
        if (name && name != "" && $('span.pfm-item[pid="' + id + '"]').text() != name) {
            return false;
        }
        if (id === 'sword.chao' && !GS.haichao && name === '海潮汹涌') {
            return false;
        }

        if (id.match(/sword|blade/) && GS.wuwo_type === 'wuwo_weapon_buff' && has_perform('force.wuwo') && (my_buffs.has('weapon') || !cooldowns.get('force.wuwo'))) {
            return false;
        }

        if (id === 'unarmed.zhong' && name === '生死符' && !cooldowns.get(id)) {
            if (!GS.auto_zhong) return false;
            let target;
            if (current_target_id) {
                target = getTarget(current_target_id);
            }
            if (target && (target.buffs.has('busy') || target.buffs.has('faint') ||
                (my_buffs.has('dodge') && has_perform('dodge.lingbo')))) {
                const target = game_items.get(current_target_id);
                const me = game_items.get(my_id);
                const max_hp = GS.wuwo_type === 'wuwo_weapon_buff' ? me.max_hp * 1.6 : me.max_hp * 1.2;
                const min_hp = me.max_hp * 0.5;
                if (target.hp < max_hp && target.hp > min_hp) {
                    return true;
                }
            }
            return false;
        }

        if (name === '唱仙法' && my_buffs.has('parry') && my_buffs.get('parry') === 10)
            return false;
        return !cooldowns.get(id) && has_perform(id, name) && in_combat;
    }

    function try_perform(id, name) {
        if (!can_perform(id, name)) {
            return false;
        }
        send_cmd('perform ' + id);
        return true;
    }

    // function try_perform_zhong() {
    //     if (!GS.auto_zhong) return;

    //     const target = game_items.get(current_target_id);
    //     const me = game_items.get(my_id);
    //     const max_hp = GS.wuwo_type === 'wuwo_weapon_buff' ? me.max_hp * 1.6 : me.max_hp * 1.2;
    //     const min_hp = me.max_hp * 0.5;
    //     if (target.hp < max_hp && target.hp > min_hp) {
    //         try_perform('unarmed.zhong', '生死符');
    //     }
    // }

    function createTarget(target_id) {
        if (all_targets.size > 20) {
            for (var [id, target] of all_targets) {
                if (new Date().getTime() - target.ttl > 900000) {
                    all_targets.delete(id);
                }
            }
        }
        let new_target = {
            buffs: new Map(),
            hp: 0,
            ttl: 0
        };
        all_targets.set(target_id, new_target);
        return new_target;
    }

    function getTarget(target_id) {
        if (target_id) {
            const target = all_targets.get(target_id);
            if (target) {
                return target;
            } else {
                return createTarget(target_id);
            }
        }
        console.log("计算最新敌人");
        var ret, targetId;
        for (var [id, target] of all_targets) {
            if (!ret || ret.ttl < target.ttl) {
                ret = target;
                targetId = id
            }
        }
        return ret;
    }

    function strip(html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    function messageClear() {
        $(".WG_log pre").html("");
    }
    var log_line = 0;

    function messageAppend(m) {
        100 < log_line && (log_line = 0, $(".WG_log pre").empty());
        $(".WG_log pre").append(m + "\n");
        log_line++;
        $(".WG_log")[0].scrollTop = 99999;
    }

    function battleMsgAppend(m) {
        100 < log_line && (log_line = 0, $(".WG_battle_log pre").empty());
        $(".WG_battle_log pre").append(m + "\n");
        log_line++;
        $(".WG_battle_log")[0].scrollTop = 99999;
    }

    function tip(t) {
        $(".WG_Tip").html(t);
    }

    var sm_array = {
        '武当': {
            place: "武当派-三清殿",
            npc: "宋远桥"
        },
        '华山': {
            place: "华山派-客厅",
            npc: "岳不群"
        },
        '少林': {
            place: "少林派-天王殿",
            npc: "道觉禅师"
        },
        '逍遥': {
            place: "逍遥派-青草坪",
            npc: "苏星河"
        },
        '丐帮': {
            place: "丐帮-树洞下",
            npc: "左全"
        },
        '峨眉': {
            place: "峨眉派-大殿",
            npc: "静心"
        },
        "无门": {
            place: "扬州城-扬州武馆",
            npc: "武馆教习"
        },
        '杀手': {
            place: "杀手楼-大厅",
            npc: "何小二",
        },
    };

    var can_auto_submit_task_items = [
        '<hig>金创药</hig>',
        '<hig>引气丹</hig>',
        '<hic>金创药</hic>',
        '<hic>引气丹</hic>',
        '<hiy>金创药</hiy>',
        '<hiy>引气丹</hiy>',
        '<hio>聚气丹</hio>',
        '<wht>当归</wht>',
        '<wht>芦荟</wht>',
        '<wht>山楂叶</wht>',
        '<hig>柴胡</hig>',
        '<hig>金银花</hig>',
        '<hig>石楠叶</hig>',
        '<hic>熟地黄</hic>',
        '<hic>茯苓</hic>',
        '<hic>沉香</hic>',
        '<hiy>九香虫</hiy>',
        '<hiy>络石藤</hiy>',
        '<hiy>冬虫夏草</hiy>',
        '<HIZ>人参</HIZ>',
        '<HIZ>何首乌</HIZ>',
        '<HIZ>凌霄花</HIZ>',
        '<hio>盘龙参</hio>',
        '<hio>天仙藤</hio>',
        '<hio>灵芝</hio>',
        '<wht>鲢鱼</wht>',
        '<wht>鲤鱼</wht>',
        '<wht>草鱼</wht>',
        '<hig>鲂鱼</hig>',
        '<hig>鲮鱼</hig>',
        '<hig>鳊鱼</hig>',
        '<hic>太湖银鱼</hic>',
        '<hic>黄颡鱼</hic>',
        '<hic>黄金鳉</hic>',
        '<hiy>反天刀</hiy>',
        '<hiy>虹鳟</hiy>',
        '<hiy>孔雀鱼</hiy>',
        '<HIZ>罗汉鱼</HIZ>',
        '<HIZ>黑龙鱼</HIZ>',
        '<HIZ>银龙鱼</HIZ>',
        '<hio>七星刀鱼</hio>',
        '<hio>巨骨舌鱼</hio>',
        '<hio>帝王老虎魟</hio>',
        '<hig>聚气丹</hig>',
        '<hic>聚气丹</hic>',
        '<hiy>聚气丹</hiy>',
        '<HIZ>聚气丹</HIZ>',
        '<hig>碎裂的红宝石</hig>',
        '<hig>碎裂的黄宝石</hig>',
        '<hig>碎裂的蓝宝石</hig>',
        '<hig>碎裂的绿宝石</hig>',
        '<hic>红宝石</hic>',
        '<hic>黄宝石</hic>',
        '<hic>蓝宝石</hic>',
        '<hic>绿宝石</hic>',
        '<hiy>精致的黄宝石</hiy>',
        '<hiy>精致的蓝宝石</hiy>',
        '<HIZ>完美的黄宝石</HIZ>',
        '<HIZ>完美的蓝宝石</HIZ>',
        '<wht>动物皮毛</wht>',
        '<wht>高级皮毛</wht>',
        '<wht>家丁服</wht>',
        '<wht>家丁鞋</wht>',
        '<wht>基本内功秘籍</wht>',
        '<wht>基本轻功秘籍</wht>',
        '<wht>基本招架秘籍</wht>',
        '<wht>基本剑法秘籍</wht>',
        '<wht>基本刀法秘籍</wht>',
        '<wht>基本拳脚秘籍</wht>',
        '<wht>基本暗器秘籍</wht>',
        '<wht>基本棍法秘籍</wht>',
        '<wht>基本鞭法秘籍</wht>',
        '<wht>基本杖法秘籍</wht>',
        '<hig>五虎断门刀残页</hig>',
        '<hig>太祖长拳残页</hig>',
        '<hig>流氓巾</hig>',
        '<hig>流氓衣</hig>',
        '<hig>流氓鞋</hig>',
        '<hig>流氓护腕</hig>',
        '<hig>流氓短剑</hig>',
        '<hig>流氓闷棍</hig>',
        '<hig>千斤拳</hig>',
        '<hig>黑虎单刀</hig>',
        '<hig>短衣劲装</hig>',
        '<hig>员外披肩</hig>',
        '<hig>军刀</hig>',
        '<hig>军服</hig>',
        '<hig>官服</hig>',
        '<hig>齐眉棍</hig>',
        '<hig>拂尘</hig>',
        '<hic>将军剑</hic>',
        '<hic>金丝宝甲</hic>',
        '<hic>鳌拜匕首</hic>',
        '<hic>云龙剑</hic>',
        '<hic>神龙袍</hic>',
        '<hic>神龙冠</hic>',
        '<hic>神龙靴</hic>',
        '<hic>神龙护腕</hic>',
        '<hic>神龙腰带</hic>',
        '<hic>神龙杖</hic>',
        '<hic>神龙令</hic>',
        '<hig>熊胆</hig>',
        '<hiy>闯王宝刀</hiy>',
        '<wht>米饭</wht>',
        '<wht>包子</wht>',
        '<wht>鸡腿</wht>',
        '<wht>面条</wht>',
        '<wht>扬州炒饭</wht>',
        '<wht>米酒</wht>',
        '<wht>花雕酒</wht>',
        '<wht>女儿红</wht>',
        '<hig>醉仙酿</hig>',
        '<hiy>神仙醉</hiy>',
        '<wht>布衣</wht>',
        '<wht>钢刀</wht>',
        '<wht>木棍</wht>',
        '<wht>英雄巾</wht>',
        '<wht>布鞋</wht>',
        '<wht>铁戒指</wht>',
        '<wht>簪子</wht>',
        '<wht>长鞭</wht>',
        '<wht>铁剑</wht>',
        '<wht>钢刀</wht>',
        '<wht>铁棍</wht>',
        '<wht>铁杖</wht>',
        '<hig>金创药</hig>',
        '<hig>引气丹</hig>',
    ];

    const fenjieList = [
        '<hic>真武道靴</hic>',
        '<hic>真武道袍</hic>',
        '<hic>真武腰带</hic>',
        '<hic>真武道簪</hic>',
        '<hic>真武护腕</hic>',
        '<hic>真武剑</hic>',
        '<hig>真武道靴</hig>',
        '<hig>真武剑</hig>',
        '<hig>真武道袍</hig>',
        '<hig>真武腰带</hig>',
        '<hig>真武道簪</hig>',
        '<hig>真武护腕</hig>',
        '<hig>曙光鞋</hig>',
        '<hic>曙光鞋</hic>',
        '<hig>大宋军靴</hig>',
        '<hig>蒙古军靴</hig>',
        '<hig>大宋军服</hig>',
        '<hig>大宋军枪</hig>',
        '<hig>笠子帽</hig>',
        '<hig>蒙古军服</hig>',
        '<hig>大宋军靴</hig>',
        '<hig>大宋军帽</hig>',
        '<hig>蒙古枪</hig>',
        '<hic>大宋军靴</hic>',
        '<hic>蒙古军靴</hic>',
        '<hic>大宋军服</hic>',
        '<hic>大宋军枪</hic>',
        '<hic>笠子帽</hic>',
        '<hic>蒙古军服</hic>',
        '<hic>大宋军靴</hic>',
        '<hic>大宋军帽</hic>',
        '<hic>蒙古枪</hic>',
        '<hic>君子靴</hic>',
        '<hic>君子鞶带</hic>',
        '<hiy>曙光佛衣</hiy>',
        '<hiy>真武道靴</hiy>',
    ]
    const map = {
        'wd/guangchang': {
            'wd/sanqing': 'go north',
            'wd/shijie1': 'go west',
        },
        'wd/sanqing': {
            'wd/guangchang': 'go south',
        },
        'wd/shijie1': {
            'wd/guangchang': 'go east',
            'wd/liangong': 'go west',
            'wd/taiziyan': 'go northup',
        },
        'wd/liangong': {
            'wd/shijie1': 'go east',
        },
        'wd/taiziyan': {
            'wd/shijie1': 'go southdown',
            'wd/tylu': 'go north',
        },
        'wd/tylu': {
            'wd/taiziyan': 'go south',
            'wd/sheshen': 'go east',
            'wd/nanyan': 'go west',
        },
        'wd/sheshen': {
            'wd/tylu': 'go west',
        },
        'wd/nanyan': {
            'wd/tylu': 'go east',
            'wd/wuya': 'go northup'
        },
        'wd/wuya': {
            'wd/nanyan': 'go southdown',
            'wd/wulao': 'go northup',
        },
        'wd/wulao': {
            'wd/wuya': 'go southdown',
            'wd/hutou': 'go northup',
        },
        'wd/hutou': {
            'wd/wulao': 'go southdown',
            'wd/chaotian': 'go north',
        },
        'wd/chaotian': {
            'wd/hutou': 'go south',
            'wd/santian': 'go north',
        },
        'wd/santian': {
            'wd/chaotian': 'go south',
            'wd/zijin': 'go north',
        },
        'wd/zijin': {
            'wd/santian': 'go south',
            'wd/xiaolu': 'go north',
        },
        'wd/xiaolu': {
            'wd/zijin': 'go south',
            'wd/xiaolu2': 'go north',
        },
        'wd/xiaolu2': {
            'wd/xiaolu': 'go south',
            'wd/xiaoyuan': 'go north'
        },
        'wd/xiaoyuan': {
            'wd/xiaolu2': 'go south',
        },
        'gaibang/shudong': {
            'gaibang/shudongxia': 'go down',
        },
        'gaibang/shudongxia': {
            'gaibang/shudong': 'go up',
            'gaibang/andao1': 'go east',
        },
        'gaibang/andao1': {
            'gaibang/shudongxia': 'go west',
            'gaibang/andao2': 'go east',
        },
        'gaibang/andao2': {
            'gaibang/andao1': 'go west',
            'gaibang/mishi': 'go east',
        },
        'gaibang/mishi': {
            'gaibang/andao2': 'go west',
            'gaibang/pomiao': 'go up',
            'gaibang/andao3': 'go east',
        },
        'gaibang/pomiao': {
            'gaibang/mishi': 'go down',
        },
        'gaibang/andao3': {
            'gaibang/mishi': 'go west',
            'gaibang/andao4': 'go east',
        },
        'gaibang/andao4': {
            'gaibang/andao3': 'go west',
            'gaibang/xiaowu': 'go up',
        },
        'gaibang/xiaowu': {
            'gaibang/andao4': 'go down',
        },
        'shaolin/guangchang': {
            'shaolin/shanmen': 'go north',
        },
        'shaolin/shanmen': {
            'shaolin/guangchang': 'go south',
            'shaolin/liangong2': 'go west',
            'shaolin/liangong1': 'go east',
            'shaolin/twdian': 'go north',
        },
        'shaolin/liangong2': {
            'shaolin/shanmen': 'go east',
        },
        'shaolin/liangong1': {
            'shaolin/shanmen': 'go west',
        },
        'shaolin/twdian': {
            'shaolin/shanmen': 'go south',
            'shaolin/daxiong': 'go northup',
            'shaolin/zhonglou': 'go northeast',
            'shaolin/gulou': 'go northwest',
        },
        'shaolin/daxiong': {
            'shaolin/twdian': 'go southdown',
        },
        'shaolin/gulou': {
            'shaolin/twdian': 'go southeast',
            'shaolin/houdian': 'go northeast',
        },
        'shaolin/houdian': {
            'shaolin/gulou': 'go southwest',
            'shaolin/zhonglou': 'go southeast',
            'shaolin/lianwu': 'go north',
        },
        'shaolin/zhonglou': {
            'shaolin/twdian': 'go southwest',
            'shaolin/houdian': 'go northwest',
        },
        'shaolin/lianwu': {
            'shaolin/houdian': 'go south',
            'shaolin/banruo': 'go west',
            'shaolin/luohan': 'go east',
            'shaolin/fangzhang': 'go north',
        },
        'shaolin/banruo': {
            'shaolin/lianwu': 'go east',
        },
        'shaolin/luohan': {
            'shaolin/lianwu': 'go west',
        },
        'shaolin/fangzhang': {
            'shaolin/lianwu': 'go south',
            'shaolin/damo': 'go west',
            'shaolin/jielv': 'go east',
            'shaolin/zhulin1': 'go north',
        },
        'shaolin/damo': {
            'shaolin/fangzhang': 'go east',
        },
        'shaolin/jielv': {
            'shaolin/fangzhang': 'go west',
        },
        'shaolin/zhulin1': {
            'shaolin/fangzhang': 'go south',
            'shaolin/cangjing': 'go west',
            'shaolin/zhulin2': 'go north'
        },
        'shaolin/cangjing': {
            'shaolin/zhulin1': 'go east'
        },
        'shaolin/zhulin2': {
            'shaolin/zhulin1': 'go south',
            'shaolin/damodong': 'go north'
        },
        'shaolin/damodong': {
            'shaolin/zhulin2': 'go south'
        },
        'emei/jinding': {
            'emei/duguangtai': 'go northup',
            'emei/miaomen': 'go west',
        },
        'emei/duguangtai': {
            'emei/jinding': 'go southdown',
            'emei/huacang': 'go east'
        },
        'emei/huacang': {
            'emei/duguangtai': 'go west',
        },
        'emei/miaomen': {
            'emei/jinding': 'go east',
            'emei/guangchang': 'go south'
        },
        'emei/guangchang': {
            'emei/miaomen': 'go north',
            'emei/dadian': 'go south',
            'emei/zoulang1': 'go east',
            'emei/zoulang2': 'go west',
        },
        'emei/dadian': {
            'emei/guangchang': 'go north'
        },
        'emei/zoulang1': {
            'emei/guangchang': 'go west',
            'emei/chufang': 'go east',
            'emei/xiuxishi': 'go south'
        },
        'emei/chufang': {
            'emei/zoulang1': 'go west',
        },
        'emei/xiuxishi': {
            'emei/zoulang1': 'go north',
        },
        'emei/zoulang2': {
            'emei/guangchang': 'go east',
            'emei/liangong': 'go west',
            'emei/zoulang4': 'go north',
            'emei/zoulang3': 'go south',
        },
        'emei/liangong': {
            'emei/zoulang2': 'go east',
        },
        'emei/zoulang4': {
            'emei/zoulang2': 'go south',
            'emei/xiaowu': 'go north'
        },
        'emei/xiaowu': {
            'emei/zoulang4': 'go south',
        },
        'emei/zoulang3': {
            'emei/zoulang2': 'go north',
            'emei/qingxiu': 'go south',
        },
        'emei/qingxiu': {
            'emei/zoulang3': 'go north',
        },
        'xiaoyao/qingcaop': {
            'xiaoyao/linjian1': 'go north',
            'xiaoyao/linjian3': 'go west',
            'xiaoyao/linjian2': 'go south',
            'xiaoyao/linjian': 'go east',
            'xiaoyao/shishi': 'go down',
        },
        'xiaoyao/linjian1': {
            'xiaoyao/qingcaop': 'go south',
            'xiaoyao/muwu2': 'go north',
        },
        'xiaoyao/muwu2': {
            'xiaoyao/linjian1': 'go south',
        },
        'xiaoyao/linjian3': {
            'xiaoyao/qingcaop': 'go east',
            'xiaoyao/xiuxishi': 'go south'
        },
        'xiaoyao/xiuxishi': {
            'xiaoyao/linjian3': 'go north',
        },
        'xiaoyao/linjian2': {
            'xiaoyao/qingcaop': 'go north',
            'xiaoyao/muwu1': 'go south'
        },
        'xiaoyao/muwu1': {
            'xiaoyao/linjian2': 'go north',
        },
        'xiaoyao/linjian': {
            'xiaoyao/qingcaop': 'go west',
            'xiaoyao/liangong': 'go north',
            'xiaoyao/muban': 'go south',
        },
        'xiaoyao/liangong': {
            'xiaoyao/linjian': 'go south',
        },
        'xiaoyao/muban': {
            'xiaoyao/linjian': 'go north',
            'xiaoyao/muwu3': 'go south'
        },
        'xiaoyao/muwu3': {
            'xiaoyao/muban': 'go north',
        },
        'xiaoyao/shishi': {
            'xiaoyao/qingcaop': 'go up',
            'xiaoyao/shishi2': 'go down',
        },
        'xiaoyao/shishi2': {
            'xiaoyao/shishi': 'go up',
        },
        'huashan/zhenyue': {
            'huashan/yunv': 'go westup',
            'huashan/canglong': 'go eastup',
        },
        'huashan/yunv': {
            'huashan/zhenyue': 'go eastdown',
            'huashan/yunvci': 'go west',
            'huashan/lianwu': 'go north',
            'huashan/shanlu': 'go south',
        },
        'huashan/yunvci': {
            'huashan/yunv': 'go east',
        },
        'huashan/lianwu': {
            'huashan/yunv': 'go south',
            'huashan/liangong': 'go east',
            'huashan/keting': 'go north',
        },
        'huashan/liangong': {
            'huashan/lianwu': 'go west',
        },
        'huashan/keting': {
            'huashan/lianwu': 'go south',
            'huashan/pianting': 'go east',
            'huashan/woshi': 'go north',
        },
        'huashan/pianting': {
            'huashan/keting': 'go west',
        },
        'huashan/woshi': {
            'huashan/keting': 'go south',
        },
        'huashan/shanlu': {
            'huashan/yunv': 'go north',
            'huashan/xiaojing': 'go southup',
        },
        'huashan/xiaojing': {
            'huashan/shanlu': 'go northdown',
            'huashan/siguoya': 'go southup',
        },
        'huashan/siguoya': {
            'huashan/xiaojing': 'go northdown',
            'huashan/hole': 'break bi;go enter',
        },
        'huashan/hole': {
            'huashan/siguoya': 'go out',
            'huashan/zhandao': 'go westup',
        },
        'huashan/zhandao': {
            'huashan/hole': 'go eastdown',
            'huashan/luoyan': 'go westup'
        },
        'huashan/luoyan': {
            'huashan/zhandao': 'go eastdown',
            'huashan/jueding': 'jumpup',
        },
        'huashan/jueding': {
            'huashan/luoyan': 'go down',
        },
        'huashan/canglong': {
            'huashan/zhenyue': 'go eastdown',
            'huashan/sheshen': 'go southup'
        },
        'huashan/sheshen': {
            'huashan/zhenyue': 'go eastdown',
            'huashan/qiaobi': 'jumpdown'
        },
        'huashan/qiaobi': {
            'huashan/sheshen': 'go up',
            'huashan/shangu': 'go southup',
        },
        'huashan/shangu': {
            'huashan/qiaobi': 'go northdown',
            'huashan/pingdi': 'go south'
        },
        'huashan/pingdi': {
            'huashan/shangu': 'go north',
            'huashan/xiaowu': 'go east'
        },
        'huashan/xiaowu': {
            'huashan/pingdi': 'go west'
        }
    }

    var GS = {
        zb_wait_time: 6000,
        wd_retry_time: 10,
        max_skill_level: 0,
        fenjie_list: '移花宫履;移花宫装',
        nuoyijiekong: true,
        youlongjiekong: true,
        hexiangz: true,
        haichao: true,
        wuxiangguimei: true,
        wuxiangduopo: true,
        jyLbNotAttack: false,
        noThrowing: false,
        wuwo_type: 'wuwo_control',
        auto_pfm_system: true,
        console_debug: false,
        wuxiangwz: false,
        auto_zhong: true,
        xy_auto_kill: false,

        init: () => {

            let wuxiangwz = document.getElementById("wuxiangwz");
            // @ts-ignore
            wuxiangwz.checked = GS.wuxiangwz;
            let auto_zhong = document.getElementById("auto_zhong");
            // @ts-ignore
            auto_zhong.checked = GS.auto_zhong;

            let auto_pfm_system_input = document.getElementById("auto_pfm_system");
            // @ts-ignore
            auto_pfm_system_input.checked = GS.auto_pfm_system;

            let jyLbNotAttack = document.getElementById("jyLbNotAttack");
            // @ts-ignore
            jyLbNotAttack.checked = GS.jyLbNotAttack;

            let noThrowing = document.getElementById("noThrowing");
            // @ts-ignore
            noThrowing.checked = GS.noThrowing;

            let wd_retry_time = document.getElementById("wd_retry_time");
            // @ts-ignore
            wd_retry_time.value = GS.wd_retry_time + "";

            let max_skill_level = document.getElementById("max_skill_level");
            // @ts-ignore
            max_skill_level.value = GS.max_skill_level + "";

            let fenjie_list = document.getElementById("fenjie_list");
            // @ts-ignore
            fenjie_list.value = GS.fenjie_list + "";

            let zb_input = document.getElementById("zb_wait_time");
            // @ts-ignore
            zb_input.value = GS.zb_wait_time + "";

            let wuwo_btn = document.getElementById(GS.wuwo_type);
            // @ts-ignore
            wuwo_btn.checked = true;

            let nuoyijiekong = document.getElementById("nuoyijiekong");
            // @ts-ignore
            nuoyijiekong.checked = GS.nuoyijiekong;


            let console_debug = document.getElementById("console_debug");
            // @ts-ignore
            console_debug.checked = GS.console_debug;

            let youlongjiekong = document.getElementById("youlongjiekong");
            // @ts-ignore
            youlongjiekong.checked = GS.youlongjiekong;

            let hexiangz = document.getElementById("hexiangz");
            // @ts-ignore
            hexiangz.checked = GS.hexiangz;

            let haichao = document.getElementById("haichao");
            // @ts-ignore
            haichao.checked = GS.haichao;

            let wuxiangguimei = document.getElementById("wuxiangguimei");
            // @ts-ignore
            wuxiangguimei.checked = GS.wuxiangguimei;

            let wuxiangduopo = document.getElementById("wuxiangduopo");
            // @ts-ignore
            wuxiangduopo.checked = GS.wuxiangduopo;


            let xy_auto_kill = document.getElementById("xy_auto_kill");
            // @ts-ignore
            xy_auto_kill.checked = GS.xy_auto_kill;
        }
    }

    class AS {
        static wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        static async process_delay(cmds, delay) {
            for (var i = 0; i < cmds.length; i += 3) {
                let chunk = cmds.slice(i, i + 3);
                await AS.wait(delay);
                send_cmd(chunk);
            }
        }

        static async retry(operation, delay, time) {
            try {
                return await operation();
            } catch (err) {
                if (time === 0) throw err;
                messageAppend(`尝试次数还剩下${time}次, ${err}`);
                await AS.wait(delay);
                return AS.retry(operation, delay, time - 1);
            }
        }

        static go(p) {
            return new Promise((resolve, reject) => {
                if (WG.safe_go_listener) {
                    remove_listener(WG.safe_go_listener);
                    WG.safe_go_listener = undefined;
                }

                if (WG.at(p)) {
                    return resolve(`已到达${p}`);
                }

                WG.safe_go_listener = add_listener(["room"], function (data) {
                    if (data.type == 'room' && data.name === p) {
                        remove_listener(WG.safe_go_listener);
                        WG.safe_go_listener = undefined;
                        return resolve(`到达${p}!`);
                    }
                });

                if (place[p] != undefined) {
                    let path = place[p];
                    let cmds = path.split(';');
                    AS.process_delay(cmds, 550);
                }
                setTimeout(() => { reject('超时') }, 3000);
            })
        }

        static async go_retry(p, after) {
            await AS.retry(AS.go.bind(null, p), 600, 3);
            return send_cmd(after);
        }

        static async liaoshang(action = 'liaoshang') {
            try {
                let go_wumiao = AS.go_retry('扬州城-武庙', action);
                let open_listener = AS.healing();

                await Promise.all([go_wumiao, open_listener]);
                messageAppend(`<hio>自动疗伤</hio>结束`);

            } catch (err) {
                messageAppend(`<hio>自动疗伤</hio>失败：${err}`);
            }
        }

        static healing() {
            remove_listener(this.healingListener);
            return new Promise(resolve => {
                this.healingListener = add_listener(['text'], async (data) => {
                    if (data.type == 'text') {
                        if (data.msg == "<hiy>你停止疗伤，深深吸了口气，站了起来。</hiy>" ||
                            data.msg == "<hiy>你疗伤完毕，深深吸了口气，脸色看起来好了很多。</hiy>" ||
                            data.msg.includes('你运功完毕，深深吸了口气，站了起来。') ||
                            data.msg == "<hig>你目前气血充沛，没有受到任何伤害。</hig>") {
                            if (my_buffs.has('xuruo')) {
                                messageAppend(`<hio>自动武道</hio>: 处于虚弱，3秒后再继续`);
                                await AS.wait(3000);
                                send_cmd('liaoshang');
                            } else {
                                await AS.wait(500);
                                send_cmd('stopstate');
                                remove_listener(this.healingListener);
                                return resolve('治疗完成');
                            }
                        } else if (data.msg == "你内力不够，无法治疗自身伤势。") {
                            await AS.wait(3000);
                            send_cmd('liaoshang');
                        } else if (data.msg.includes('你内力枯竭无法治疗伤势')) {
                            send_cmd('dazuo');
                        }
                    }
                });
            })
        }

        static async fightChuanCheng() {
            const items = $(".room_items .room-item");
            let targetId;
            for (var npc of items) {
                const id = $(npc).attr("itemid");
                const tempNpc = game_items.get(id);
                if (tempNpc.name.includes('武道传承者')) {
                    targetId = id;
                }
            }

            let fightState = 0;

            this.fightListener = add_listener(['combat', 'status'], async (data) => {
                if (data.type == 'status' && data.action == 'add') {
                    if (data.sid == 'dodge' && data.name == '凌波' && data.id == targetId) {
                        fightState = 1;
                        log('骗出凌波，准备攻击');
                        await AS.wait(data.duration - 100);
                        if (!WG.auto_pfm) { WG.auto_pfm_button() }
                        fightState = 2;
                        send_cmd('stopstate');
                        kill_cmd(targetId);

                    }
                } else if (data.type == 'combat' && data.end) {
                    log('战斗结束，准备下一轮');
                    send_cmd('dazuo');
                    while (cooldowns.get('force.cui') || cooldowns.get('blade.shi')) {
                        WG.combat_stat_finish();
                        log('等技能CD');
                        await AS.wait(1000);
                    }
                    if (WG.auto_pfm) {
                        log('攻击准备好，准备骗凌波');
                        WG.auto_pfm_button();
                        send_cmd('stopstate');
                        kill_cmd(targetId);
                    }
                }

            });
            kill_cmd(targetId);
        }

        static async oneButtonXuruoWushen() {
            if (!my_buffs.has('xuruo') && !has_perform('parry.wu')) {
                log('没有虚弱，不需要刷五神');
                return;
            }
            send_cmd('stopstate');
            remove_listener(this.buffListener);
            if (WG.auto_pfm) { WG.auto_pfm_button() }
            await AS.go_retry("武道塔-入口");
            await AS.wait(200);
            send_cmd("go enter");
            this.buffListener = add_listener(["items", "room"], async (data) => {
                if (data.type == "items") {
                    const guard = data.items.find(npc => npc.name && npc.name.match(/守护者|武道镇守者|武道传承者/));
                    if (guard && guard.id != my_id) {
                        WG.kill_id = guard.id;
                        kill_cmd(WG.kill_id);
                        send_cmd('perform parry.wu');
                        WG.wudao_state = 1;
                        remove_listener(this.buffListener);
                        return;
                    }
                } else if (data.type == 'room') {
                    if (data.name != "武道塔-第一百层") {
                        remove_listener(this.buffListener);
                        log('只支持100层清虚弱');
                        return;
                    }
                }
            });


        }

        static async auto_pack() {
            let stores = [];
            WG.packup_listener = add_listener(["dialog", "text"], async (data) => {
                if (data.type == "dialog" && data.dialog == "list") {
                    if (data.stores == undefined) {
                        return;
                    }
                    stores = [];
                    //去重
                    for (let i = 0; i < data.stores.length; i++) {
                        stores.push(data.stores[i].name);
                    }

                } else if (data.type == "dialog" && data.dialog == "pack" && data.items) {
                    let cmds = [];
                    let fenjie_list = GS.fenjie_list.toString().split(';');
                    for (var i = 0; i < data.items.length; i++) {
                        //仓库
                        if (WG.inArray(data.items[i].name, stores)) {
                            if (!data.items[i].can_eq) {
                                cmds.push("store " + data.items[i].count + " " + data.items[i].id);
                                messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "储存到仓库");
                            }
                        }
                        let name = get_name(data.items[i].name);
                        if (fenjie_list.includes(name)) {
                            if (data.items[i].name.startsWith('<hio>')) {
                                messageAppend("<hio>包裹整理</hio>" + data.items[i].name + ", 橙色物品不分解");
                            } else {
                                cmds.push("fenjie " + data.items[i].id);
                                messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "分解");
                            }
                        }
                    }

                    KEY.dialog_close();
                    if (cmds.length > 0) {
                        await AS.process_delay(cmds, 650);
                    }
                    await AS.go_retry('扬州城-药铺');
                    send_cmd('sell all');
                    messageAppend("<hio>包裹整理</hio>完成");
                    remove_listener(WG.packup_listener);
                    WG.packup_listener = undefined;
                }
            });

            messageAppend("<hio>包裹整理</hio>开始");
            await AS.go_retry('住房-卧室');
            send_cmd('store;pack');
        }

        static sm_submit_listener() {
            let task = null;
            let task_npc_id = null;
            return new Promise((resolve, reject) => {
                WG.smListenr = add_listener(['cmds', 'text', 'dialog', 'items'], async (data) => {
                    if (data.type == 'cmds' && data.items) {
                        for (let item of data.items) {
                            const match = item.name.match("上交(<[^>]*>.*?<\/[^>]*>)");
                            if (match && match[1] && item.cmd) {
                                const matched = match[1];
                                if (can_auto_submit_task_items.includes(matched)) {
                                    messageAppend("自动上交" + matched);
                                    send_cmd(item.cmd);
                                    return;
                                }
                            }
                        }
                        if (!can_auto_submit_task_items.includes(WG.task_item))
                            return;

                        if (WG.sm_state >= 0) {
                            // WG.sm_item = goods[WG.item];
                            task = sm_items.find(type => type.items.includes(WG.task_item));
                            if (task) {
                                switch (task.type) {
                                    case 'shop':
                                        messageAppend("<hio>师门任务</hio>自动购买" + WG.task_item);
                                        await AS.go_retry(task.room);

                                        break;
                                    default:
                                        messageAppend("<hio>师门任务</hio>自动检查仓库" + WG.task_item);
                                        WG.sm_state = 1;
                                        resolve('自动检查');
                                        remove_listener(WG.smListenr);
                                        return;
                                }
                            } else {

                                messageAppend("<hio>师门任务</hio>自动检查仓库" + WG.task_item);
                                WG.sm_state = 1;
                                resolve('自动检查');
                                remove_listener(WG.smListenr);
                            }
                        }
                    } else if (data.type == 'items' && data.items) {
                        let merchant = data.items.find(p => p.name && p.name.includes(task.npc));
                        if (merchant) {
                            task_npc_id = merchant.id;
                            send_cmd("list " + merchant.id);
                        }
                    } else if (data.type == 'text') {
                        let r = data.msg.match(/^(.+)对你说道：我要的是(.+)，你要是找不到就换别的吧。$/);
                        if (r && r[2]) {
                            WG.task_item = r[2];
                            messageAppend("<hio>师门任务</hio>当前需要" + WG.task_item);
                        } else if (data.msg.includes('辛苦了， 你先去休息一下吧')) {
                            messageAppend("师门任务结束");
                            WG.sm_state = 3;
                            resolve('任务结束');
                            remove_listener(WG.smListenr);
                            return;
                        } else if (data.msg.includes('最近师门物资紧缺') ||
                            data.msg.includes('最近师门扩招') ||
                            data.msg.includes('需要一些武功秘籍来参考一下') ||
                            data.msg.includes('突然想尝一下')) {
                            WG.sm_state = 0;
                            await AS.wait(500);
                            send_cmd(`task sm ${WG.sm_npc_id}`);
                        } else if (/^(.+)对你说道：好吧，师父让别人去找，你就先去休息吧。$/.test(data.msg)) {
                            WG.sm_state = 0;
                            resolve('任务提交');
                            remove_listener(WG.smListenr);
                            return;
                        } else {
                            r = data.msg.match(/^你的师门任务完成了，目前完成(\d+)\/(\d+)个，连续完成(\d+)个。$/);
                            if (r) {
                                WG.sm_state = 0;
                                messageAppend(`<hio>师门任务</hio>已完成${r[1]}个`);
                                resolve('任务提交');
                                remove_listener(WG.smListenr);
                                return;
                            }
                        }
                    } else if (data.type == 'dialog' && data.dialog == 'list' && data.seller == task_npc_id) {
                        let item = data.selllist.find(item => item.name == WG.task_item);
                        if (item) {
                            send_cmd('buy 1 ' + item.id + ' from ' + task_npc_id);
                            await AS.wait(500);
                            WG.sm_state = 0;
                            resolve('自动购买');
                            remove_listener(WG.smListenr);
                            return;
                        }
                    }
                });
            });
        }

        static sm_store_check() {
            return new Promise((resolve, reject) => {
                WG.store_check_listener = add_listener(['dialog'], async (data) => {
                    if (data.type == 'dialog' && data.dialog == 'list' && data.stores) {
                        let item = data.stores.find(item => item.name == WG.task_item);
                        if (item && item.id) {
                            send_cmd('qu 1 ' + item.id + ';pack');
                            await AS.wait(500);
                            WG.sm_state = 0;
                            resolve('取出物品');
                            remove_listener(WG.store_check_listener);
                        } else {
                            await AS.wait(500);
                            messageAppend("<hio>师门任务</hio>仓库未发现" + WG.task_item);
                            WG.sm_state = 2;
                            reject('没有物品');
                            remove_listener(WG.store_check_listener);
                        }
                    }
                });
            });
        }

        static async sm_task() {
            if (!WG.sm_start) return;
            switch (WG.sm_state) {
                case 0:
                    //前往师门接收任务
                    await AS.go_retry(sm_array[family].place);
                    await AS.wait(500);
                    if (!WG.sm_npc_id) {
                        WG.sm_npc_id = find_item(sm_array[family].npc);
                    }
                    if (WG.sm_npc_id) {
                        let go_family = AS.go_retry(sm_array[family].place, `task sm ${WG.sm_npc_id}`);
                        let submit_task = AS.sm_submit_listener();
                        try {
                            await Promise.all([go_family, submit_task]);
                        } catch (err) {
                            messageAppend(`<hio>师门任务</hio>查找出错:${err}`);
                        }
                    } else {
                        throw "无法找到师门npc";
                    }
                    return AS.sm_task();
                case 1:
                    let go_store = AS.go_retry('扬州城-钱庄', 'store');
                    let pick_item = AS.sm_store_check();
                    try {
                        await Promise.all([go_store, pick_item]);
                    } catch (err) {
                        messageAppend(`<hio>师门任务</hio>查找出错::${err}`);
                    }
                    return AS.sm_task();
                case 2: // 自动放弃
                    await AS.go_retry(sm_array[family].place);
                    if (WG.sm_npc_id && WG.auto_give_up) {
                        send_cmd(`task sm ${WG.sm_npc_id} giveup`);
                        await AS.wait(200);
                        WG.sm_state = 0;
                    } else {
                        WG.sm_state = 0;
                        messageAppend("<hio>师门任务</hio>请手动提交或取消");
                        await AS.sm_submit_listener();
                    }
                    return AS.sm_task();
                case 3: // complete
                    WG.sm_state = -1;
                    return true;
                default:
                    return false;
            }
        }

        static async auto_sm_task() {
            if (WG.sm_start) {
                messageAppend("<hio>自动师门</hio>停止");
                $(".sm_button").text("师门(Q)");
                remove_listener(WG.smListenr);
                remove_listener(WG.store_check_listener);
                WG.sm_start = false;
                WG.sm_state = -1;
                await AS.wait(500);
                WG.zdwk();
                return;
            }
            WG.sm_start = true;
            $(".sm_button").text("停止(Q)");
            WG.auto_give_up = false;
            if (confirm('是否自动放弃？')) {
                WG.auto_give_up = true;
            }
            WG.sm_state = 0;

            let result = await AS.sm_task();
            if (result) AS.auto_sm_task();
        }

        static huaShanFightCheck() {
            let huaShanState = 0;
            return new Promise((resolve, reject) => {
                this.huShanListener = add_listener(['text', 'combat', 'items', 'itemadd'], async (data) => {
                    if (data.type == 'text' && data.msg) {
                        if (data.msg.includes('黄药师说道：先过我这关再说')) {
                            messageAppend(`华山论剑，击杀黄药师`);
                            huaShanState = 1;
                        } else if (data.msg.includes('一灯大师双手合十：阿弥陀佛')) {
                            messageAppend(`华山论剑，击杀一灯大师`);
                            huaShanState = 2;
                        } if (data.msg.includes('欧阳锋桀桀笑道：找死！')) {
                            messageAppend(`华山论剑，击杀欧阳锋`);
                            huaShanState = 3;
                        } if (data.msg.includes('洪七公哈哈笑道：就让我老乞丐来会会你！')) {
                            messageAppend(`华山论剑，击杀洪七公`);
                            huaShanState = 4;
                        } if (data.msg.includes('看起来王重阳想杀死你')) {
                            messageAppend(`华山论剑，击杀王重阳`);
                            huaShanState = 5;
                        }
                    } else if (data.type == 'combat' && data.end) {
                        WG.combat_stat_finish();
                        if (huaShanState == 5) {
                            messageAppend('五绝已杀，开箱子');
                            send_cmd('look bi;jump bi');

                        } else {
                            remove_listener(this.huShanListener);
                            return reject(huaShanState);
                        }
                    } else if (data.type == 'items' && data.items) {
                        let item = data.items.find(item => item && item.name && item.name.includes('五绝宝箱'));
                        send_cmd(`get all from ${item.id};cr over`);
                        remove_listener(this.huShanListener);
                        return resolve('done');
                    } else if (data.type == 'itemadd' && data.name && data.id) {
                        switch (data.name) {
                            case '<hiy>东邪</hiy> 黄药师':
                            case '<hiy>南帝</hiy> 一灯大师':
                            case '<hiy>西毒</hiy> 欧阳锋':
                            case '<hiy>北丐</hiy> 洪七公':
                            case '<hiy>中神通</hiy> 王重阳':
                                send_cmd(`kill ${data.id}`);
                                current_target_id = data.id;
                            default:
                                break;
                        }
                    }
                });
            })
        }

        static async huashanluanjian() {
            if (WG.huashanStart) return;
            WG.huashanStart = true;
            if (!WG.auto_pfm) { WG.auto_pfm_button() }
            try {
                let input = Number(prompt("请输入华山论剑副本次数", ""));
                if (input <= 0) {
                    log('数字必须大于0');
                    WG.huashanStart = false;
                    return;
                }
                for (let i = 0; i < input; i++) {
                    send_cmd("cr huashan/lunjian/leitaixia;go up");
                    await AS.huaShanFightCheck();
                    messageAppend(`完成${i + 1}次华山论剑`);
                    await AS.wait(500);
                    await AS.liaoshang();
                }

                WG.zdwk();
            } catch (err) {
                messageAppend(`华山论剑失败:${err}`);
                WG.huashanStart = false;
                return false;
            }

            WG.huashanStart = false;
            return true;
        }

        static async smurf_daily() {
            if (WG.sm_start) return;
            WG.sm_start = true;
            WG.auto_give_up = true;
            $(".sm_button").text("停止(Q)");
            WG.sm_state = 0;

            try {
                log('进行师门任务');
                send_cmd('stopstate');
                const result = await AS.sm_task();
                if (!result) {
                    log('师门任务失败');
                }
                log('20次小树林');
                for (let i = 0; i < 20; i++) {
                    send_cmd("cr yz/lw/shangu;cr over");
                    log(`完成${i + 1}次小树林`);
                    await AS.wait(1000);
                }

                log('领取日常奖励');
                send_cmd('taskover signin');
                await AS.wait(1000);
                log('购买20张扫荡');
                send_cmd('shop 0 20');
                log('扫荡衙门任务');
                await AS.go_retry("扬州城-衙门正厅");
                await AS.wait(1000);
                const count = await new Promise((resolve) => {
                    this.yamen_count_listener = add_listener(['dialog'], async (data) => {
                        if (data.dialog == 'tasks' && data.items) {
                            const task = data.items.find(task => task.id == 'yamen');
                            const r = task.desc.match(/扬州知府委托你追杀逃犯.*共连续完成(\d+)个。$/)
                            if (r && r[1]) {


                                remove_listener(this.yamen_count_listener);
                                return resolve(r[1]);
                            }
                        }
                    });
                    KEY.do_command("tasks");
                    KEY.dialog_close();
                });
                if (count <= 20) {
                    WG.ask("程药发", 3);
                } else {
                    WG.ask("程药发", 1);
                    WG.ask("程药发", 2);
                    WG.ask("程药发", 3);
                    await AS.wait(1000);
                }
                WG.zdwk();
            } catch (err) {
                log(`小号日常失败:${err}`);
            }
            $(".sm_button").text("师门(Q)");
            remove_listener(WG.smListenr);
            remove_listener(WG.store_check_listener);
        }

        static purchaseFromShop() {
            return new Promise((resolve) => {
                this.purchaseShopListener = add_listener(['dialog'], (data) => {
                    if (data.type === 'dialog' && data.dialog == 'shop' && data.selllist) {
                        let saoDang = data.selllist.find(item => item.name && item.name.includes('扫荡符'))
                    }
                })
            })
        }

        static dfs(current, limit = 0, depth = 0) {
            if (!depth) {
                this.visited = [];
                this.parent = [];
                this.cmds = [];
            }

            depth += 1;

            this.visited[current] = true;

            if (!limit || depth < limit) {
                for (let item of Object.keys(map[current])) {
                    if (!this.visited[item]) {
                        this.parent[item] = current;
                        this.cmds.push(map[current][item]);
                        AS.dfs(item, limit, depth);
                    }
                }
            }

            depth = depth - 1;
            let pa = this.parent[current];
            if (pa) {
                this.cmds.push(map[current][pa]);
            } else if (current == 'huashan/sheshen') {
                this.cmds.push('go eastdown');
            }
        }

        static async shaoHuang() {

            if (this.pathTraversalListerner) {

                AS.shaoHuangStop();
                return;
            }
            AS.dfs('wd/guangchang');

            messageAppend(`<hio>自动扫黄</hio>: 开始武当扫黄`);
            this.cmds.unshift('jh fam 1 start');
            $(".saoHuang").text("停止武当扫黄");
            // AS.dfs('huashan/zhenyue');

            // messageAppend(`<hio>自动扫黄</hio>: 开始武当扫黄`);
            // this.cmds.unshift('jh fam 3 start');
            try {
                await AS.pathTraversal('代弟子|道童', true);
                AS.shaoHuangStop();
            } catch (err) {
                messageAppend(`<hio>自动扫黄</hio>: ${err}`);
            }
        }

        static shaoHuangStop() {
            $(".saoHuang").text("武当扫黄");
            fire_listener({
                type: 'stopListen',
                id: 'stop'
            });
            this.pathTraversalListerner = null;
        }

        static async pathTraversal(target, killAll = false) {
            let path = this.cmds;
            let index = 0;
            let path_timer;
            messageAppend(`<hio>自动寻路击杀</hio>: 开始寻路`);
            return new Promise((resolve, reject) => {
                this.pathTraversalListerner = add_listener(['combat', 'items', 'text', 'stopListen'], async (data) => {

                    if (data.type == 'combat') {
                        if (data.start) {
                            messageAppend(`<hio>自动寻路击杀</hio>: 进入战斗`);
                            if (path_timer) {
                                clearTimeout(path_timer);
                            }
                        } else if (data.end) {
                            WG.combat_stat_finish();
                            await AS.wait(600);
                            if (killAll) {
                                messageAppend(`<hio>自动寻路击杀</hio>: 继续寻找`);
                                send_cmd(path[index++]);
                            } else {
                                remove_listener(this.pathTraversalListerner);
                                this.pathTraversalListerner = null;
                                messageAppend(`<hio>自动寻路击杀</hio>: 成功击杀${target}`);
                                return resolve('击杀完毕');
                            }
                        }
                    } else if (data.type == 'items' && data.items) {
                        let kill_check = false;
                        let re = new RegExp(target);
                        for (let item of data.items) {
                            if (item.name && item && !item.p && !/首席弟子|宋远桥|谷虚|清乐比丘|道觉禅师|慧合尊者|澄净|苏梦清|静心|周芷若|灭绝/g.test(item.name) &&
                                re.test(item.name)) {

                                kill_cmd(item.id);
                                kill_check = true;
                            }
                        }
                        if (!kill_check && !in_combat) {
                            if (index < path.length) {
                                path_timer = setTimeout(function () {
                                    send_cmd(path[index++]);
                                }, 500);
                            } else {
                                messageAppend(`<hio>自动寻路击杀</hio>: 完成搜索`);
                                remove_listener(this.pathTraversalListerner);
                                this.pathTraversalListerner = null;
                                await AS.wait(800);
                                reject('搜索完成');
                            }
                        }
                    } else if (data.type == 'stopListen') {
                        messageAppend(`<hio>自动寻路击杀</hio>: 完成搜索`);
                        remove_listener(this.pathTraversalListerner);
                        this.pathTraversalListerner = null;
                        return resolve('done');
                    }
                });
                send_cmd(path[index++]);
            })
        }

        static yamenExtraSearch(path) {
            return new Promise((resolve, reject) => {
                if (!path) return reject('没有命令');
                let ym_paths = path.split(";");
                let ym_index = 0;
                let ym_found = false;
                let auto_search = true;
                this.yamen_path_listner = add_listener(['items', 'text', 'combat'], async (data) => {
                    if (data.type == 'items' && data.items) {
                        data.items.forEach(item => {
                            if (item.name && item.name.includes(zb_npc)) {
                                kill_cmd(item.id);
                                ym_found = true;
                            }
                        });
                        if (ym_index && ym_paths && ym_index < ym_paths.length && !ym_found) {
                            await AS.wait(300);
                            if (!ym_found) send_cmd(ym_paths[ym_index++]);
                        } else if (auto_search) {
                            auto_search = false;
                            remove_listener(this.yamen_path_listner);
                            if (!ym_found)
                                return reject('遍历结束');
                        }
                    } if (data.type == 'text' && data.msg == '你要攻击谁？' && !in_combat) {
                        remove_listener(this.yamen_path_listner);
                        return reject('查找失败');
                    } else if (data.type == 'combat') {
                        if (data.start) {
                            messageAppend(`${(new Date()).toLocaleTimeString()} <hio>自动追捕</hio>: 找到${zb_npc}，自动击杀！！！`);
                        } else if (data.end) {
                            remove_listener(this.yamen_path_listner);
                            return resolve('查找成功')
                        }
                    }
                });
                send_cmd(ym_paths[ym_index++]);
            })
        }
        static async go_yamen_task(v) {
            send_cmd("stopstate");
            if (WG.yamen_job) {
                if (!v || v != 'next') {
                    remove_listener(this.yamen_path_listner);
                    remove_listener(this.yamen_npc_listner);
                    remove_listener(this.pathTraversalListerner);
                    WG.yamen_job = false;
                    messageAppend(`<hio>自动追捕</hio>: 取消自动任务，请再按一次W键接任务`);
                    return;
                }
            }
            await AS.go_retry("扬州城-衙门正厅");
            await AS.wait(1000);
            WG.ask("程药发", 1);
            WG.yamen_job = true;
            await AS.wait(1000);
            AS.check_yamen_task();
        }

        static async check_yamen_task() {
            tip("查找任务中");

            try {
                remove_listener(this.yamen_npc_listner);
                remove_listener(this.yamen_path_listner);

                const task = await WG.ask_task_promise();
                zb_npc = task.desc.match("犯：([^%]+)，据")[1];
                zb_place = task.desc.match("在([^%]+)出")[1];

                messageAppend("<hio>自动追捕</hio>: 追捕任务npc：" + zb_npc + "   地点：" + zb_place);

                let zbTimeout = setTimeout(() => { throw ('超时') }, 15000);

                this.yamen_npc_listner = add_listener(['text', 'die'], async (data) => {
                    if (data.type == 'text' && data.msg) {
                        let result = data.msg.match(/^<hig>你的追捕任务完成了，目前完成(\d+)\/(\d+)个，已连续完成(\d+)个。<\/hig>$/);
                        if (result) {
                            //WG.combat_finish();
                            WG.combat_stat_finish();
                            remove_listener(this.yamen_npc_listner);
                            remove_listener(this.pathTraversalListerner);
                            clearTimeout(zbTimeout);
                            messageAppend(`${(new Date()).toLocaleTimeString()} <hio>自动追捕</hio>: 任务完成,${result[1]}/${result[2]}, 2秒后武庙疗伤`);
                            await AS.wait(2000);
                            if (WG.yamen_job) {
                                await AS.liaoshang();
                                if (result[1] >= 20) {
                                    messageAppend(`<hio>自动追捕</hio>: 恭喜，今日追捕任务全部完成`);
                                    WG.zdwk();
                                } else {
                                    messageAppend(`${(new Date()).toLocaleTimeString()} <hio>自动追捕</hio>: ${GS.zb_wait_time / 1000}秒后将自动接下个任务,或者请手动按W键接任务`);
                                    await AS.wait(GS.zb_wait_time);
                                    if (WG.yamen_job) {
                                        AS.go_yamen_task("next");
                                    }
                                }
                            }
                        }
                    } else if (data.type == 'die') {
                        await AS.wait(500);
                        send_cmd('relive');
                        clearTimeout(zbTimeout);
                        await AS.wait(500);
                        await AS.liaoshang();
                        AS.go_yamen_task("next");
                    }
                });

                await AS.go_retry(zb_place);
                await AS.wait(300);
                let extraPath;
                let zb_npc_id = find_item(zb_npc);
                if (zb_npc_id) {
                    current_target_id = zb_npc_id;
                    extraPath = "kill " + zb_npc_id;
                }
                if (path2[zb_place]) {
                    extraPath = extraPath ? `${extraPath};${path2[zb_place]}` : path2[zb_place];
                }
                try {
                    await AS.yamenExtraSearch(extraPath);
                } catch (err) {
                    if (map[WG.room_path]) {
                        messageAppend(`${(new Date()).toLocaleTimeString()} <hio>自动追捕</hio>: ${WG.room_path}尝试6步遍历寻找`);
                        AS.dfs(WG.room_path, 6);
                        await AS.pathTraversal(zb_npc);
                        messageAppend(`${(new Date()).toLocaleTimeString()} <hio>自动追捕</hio>: 尝试4步遍历寻找结束`);
                    } else {
                        throw (`${WG.room_path}不支持4步遍历`);
                    }
                }
            } catch (error) {
                messageAppend(`${(new Date()).toLocaleTimeString()} <hio>自动追捕</hio>: 失败 ${error}`);
                remove_listener(this.yamen_npc_listner);
                remove_listener(this.yamen_path_listner);
                await AS.wait(1000);
                AS.go_yamen_task("next");
            }
        }

        static async goYunbiao() {
            if (WG.yunbiaoStart) return;
            WG.yunbiaoStart = true;
            if (!WG.auto_pfm) { WG.auto_pfm_button() }
            let input = Number(prompt("请输入自动运镖次数", ""));
            if (input <= 0) {
                log('数字必须大于0');
                WG.huashanStart = false;
                return;
            }
            for (let i = 0; i < input; i++) {
                await AS.yunBiaoStart();
                messageAppend(`完成${i + 1}次运镖`);
            }
            WG.yunbiaoStart = false;
            WG.zdwk();
        }

        static async goJieBiao() {
            if (!WG.auto_pfm) { WG.auto_pfm_button() }
            send_cmd("stopstate");
            await AS.go_retry("扬州城-镖局正厅");
            await AS.wait(1000);
            const npc = find_item('林震南');
            send_cmd(`biao ${npc};task yunbiao ${npc} start ok;task yunbiao ${npc} begin;go east`);
        }

        static async yunBiaoStart() {
            send_cmd("stopstate");
            await AS.go_retry("扬州城-镖局正厅");
            await AS.wait(1000);
            const npc = find_item('林震南');
            send_cmd(`biao ${npc};task yunbiao ${npc} start ok;task yunbiao ${npc} begin;go east`);

            try {
                await AS.yunbiaoJob();
                return true;
            } catch (err) {
                log(`<hio>自动运镖</hio>: 失败 ${err}`);
                await AS.wait(500);
                await AS.liaoshang();
                return AS.yunBiaoStart();
            }
        }

        static async yunbiaoJob() {
            return new Promise((resolve, reject) => {
                WG.yunbiaoListener = add_listener(['combat', 'itemadd', 'die', 'cmds', 'text'], async (data) => {
                    if (data.type == 'combat') {
                        if (data.end) {
                            messageAppend(`<hio>自动运镖</hio>: 战斗结束`);
                            WG.combat_stat_finish();
                            await AS.wait(500);
                            const me = game_items.get(my_id);
                            const remain = me.hp / me.max_hp;
                            const mp_remain = me.mp / me.max_mp;
                            if (remain > 0.8 && mp_remain > 0.4) {
                                await AS.wait(GS.zb_wait_time);
                                send_cmd('go east');
                            } else {
                                if (mp_remain <= 0.4) {
                                    send_cmd('dazuo');
                                } else {
                                    send_cmd('liaoshang');
                                }
                            }
                        }
                    } else if (data.type == 'itemadd' && data.name) {
                        if (data.name.startsWith('蒙面大盗')) {
                            kill_cmd(data.id);
                        }
                    } else if (data.type == 'die') {
                        await AS.wait(500);
                        send_cmd('relive');
                        remove_listener(WG.yunbiaoListener);
                        reject('运镖死亡');
                    } else if (data.type == 'cmds' && data.items) {
                        // const cmd = data.items.find((cmd) => cmd && cmd.name == '交镖银');
                        // if (cmd) {

                        //     send_cmd(`${cmd.cmd}`);
                        //     remove_listener(WG.yunbiaoListener);
                        //     resolve('运镖完成');
                        // }
                    } else if (data.type == 'text') {
                        if (data.msg == "<hiy>你停止疗伤，深深吸了口气，站了起来。</hiy>" ||
                            data.msg == "<hiy>你疗伤完毕，深深吸了口气，脸色看起来好了很多。</hiy>" ||
                            data.msg.includes('你运功完毕，深深吸了口气，站了起来。') ||
                            data.msg == "<hig>你目前气血充沛，没有受到任何伤害。</hig>") {
                            if (my_buffs.has('xuruo')) {
                                messageAppend(`<hio>自动疗伤</hio>: 处于虚弱，3秒后再继续`);
                                await AS.wait(3000);
                                send_cmd('liaoshang');
                            } else {
                                await AS.wait(500);
                                send_cmd('stopstate;go east');
                            }
                        } else if (data.msg == "你内力不够，无法治疗自身伤势。") {
                            await AS.wait(3000);
                            send_cmd('liaoshang');
                        } else if (data.msg.includes('你内力枯竭无法治疗伤势')) {
                            send_cmd('dazuo');
                        } else if (data.msg.includes('林震南说道：你先等等，客户好像不见了')) {
                            remove_listener(WG.yunbiaoListener);
                            reject('客户不见了');
                        }
                        else {
                            let r = data.msg.match(/你推着镖银风尘仆仆地来到.*，只要把镖银交给(.*)就完成了/);
                            if (r && r[1]) {
                                let targetId = find_npc(r[1]);
                                send_cmd(`task yunbiao ${targetId} give`);
                                remove_listener(WG.yunbiaoListener);
                                resolve('运镖完成');
                            } else {
                                r = data.msg.match(/这里有一批镖银需要交给(.*)，你现在就出发吧。/);
                                if (r && r[1]) {
                                    let targetId = find_item(r[1]);
                                    game_items.delete(targetId);
                                }
                            }
                        }
                    }
                });

            })
        }

        static async saveEqSkill() {
            log('目前装备为：');
            for (let itemId of my_eq) {
                const item = pack_items.get(itemId);
                log(`${item.name}: ${itemId}`);
            }
            log('目前装备技能为：');
            let skillList = new Map();
            for (let skill of my_basic_skills.values()) {
                const spSkill = my_special_skills.get(skill.enable_skill);
                log(`${skill.id} 装备了${spSkill.name} : ${skill.enable_skill}`);
                skillList.set(skill.id, skill.enable_skill);
            }
            let saveCheck = Number(prompt("输入1确认则保存为练功套，输入2确认则保存为战斗套,其他数字放弃保存", ""));
            switch (saveCheck) {
                case 1:
                    WG.myWuxingSkill = skillList;
                    WG.myWuxingEq = [...my_eq];
                    GM_setValue(role + "_WuxingSkill", JSON.stringify(strMapToObj(WG.myWuxingSkill)));
                    GM_setValue(role + "_WuxingEq", JSON.stringify(WG.myWuxingEq));
                    log('练功套更新成功');
                    break;
                case 2:
                    WG.myBattleSkill = skillList;
                    WG.myBattleEq = [...my_eq];
                    GM_setValue(role + "_myBattleSkill", JSON.stringify(strMapToObj(WG.myBattleSkill)));
                    GM_setValue(role + "_myBattleEq", JSON.stringify(WG.myBattleEq));
                    log('战斗套更新成功');
                    break;
                default:
                    log('不保存');
            }

        }

        static fetchStore() {
            return new Promise((resolve) => {
                this.fetchStoreListner = add_listener(["items", "dialog"], function (data) {
                    if (data.type == 'dialog') {
                        //console.log(data);
                        if (data.dialog == 'list') {
                            remove_listener(this.fetchStoreListner);
                            return resolve(data.stores);
                        } else if (data.dialog == 'pacl') {
                            remove_listener(this.fetchStoreListner);
                            return resolve(data.items);
                        }
                    }
                });
            })
        }

        static async repackStore() {
            const storeList = AS.fetchStore();
            const goStore = AS.go_retry("住房-卧室", "store");
            await Promise.all([storeList, goStore]);
            console.log(storeList);
            // for (let item in storeList) {
            //     if ()
            // }
        }
    }

    // @ts-ignore
    function sortByAttribute(array, ...attrs) {
        // generate an array of predicate-objects contains
        // property getter, and descending indicator
        let predicates = attrs.map(pred => {
            let descending = pred.charAt(0) === '-' ? -1 : 1;
            pred = pred.replace(/^-/, '');
            return {
                getter: o => o[pred],
                descend: descending
            };
        });
        // schwartzian transform idiom implementation. aka: "decorate-sort-undecorate"
        return array.map(item => {
            return {
                src: item,
                compareValues: predicates.map(predicate => predicate.getter(item))
            };
        })
            .sort((o1, o2) => {
                let i = -1, result = 0;
                while (++i < predicates.length) {
                    if (o1.compareValues[i] < o2.compareValues[i]) result = -1;
                    if (o1.compareValues[i] > o2.compareValues[i]) result = 1;
                    if (result *= predicates[i].descend) break;
                }
                return result;
            })
            .map(item => item.src);
    }

    function strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k, v] of strMap) {
            // We don’t escape the key '__proto__'
            // which can cause problems on older engines
            obj[k] = v;
        }
        return obj;
    }
    function objToStrMap(obj) {
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }
    const sm_items = [
        {
            items: [
                "<wht>米饭</wht>",
                "<wht>包子</wht>",
                "<wht>鸡腿</wht>",
                "<wht>面条</wht>",
                "<wht>扬州炒饭</wht>",
                "<wht>米酒</wht>",
                "<wht>花雕酒</wht>",
                "<wht>女儿红</wht>",
                "<hig>醉仙酿</hig>",
                "<hiy>神仙醉</hiy>",
            ],
            type: "shop",
            npc: "店小二",
            room: "扬州城-醉仙楼",
        },
        {
            items: [
                "<wht>布衣</wht>",
                "<wht>钢刀</wht>",
                "<wht>木棍</wht>",
                "<wht>英雄巾</wht>",
                "<wht>布鞋</wht>",
                "<wht>铁戒指</wht>",
                "<wht>簪子</wht>",
                "<wht>长鞭</wht>",
            ],
            type: "shop",
            npc: "杨永福",
            room: "扬州城-杂货铺",
        },
        {
            items: [
                "<wht>铁剑</wht>",
                "<wht>钢刀</wht>",
                "<wht>铁棍</wht>",
                "<wht>铁杖</wht>",
            ],
            type: "shop",
            npc: "铁匠",
            room: "扬州城-打铁铺",
        },
        {
            items: [
                "<hig>金创药</hig>",
                "<hig>引气丹</hig>",
            ],
            type: "shop",
            npc: "平一指",
            room: "扬州城-药铺",
        },
        {
            items: [
                "<wht>当归</wht>",
                "<wht>芦荟</wht>",
                "<wht>山楂叶</wht>",
                "<hig>柴胡</hig>",
                "<hig>金银花</hig>",
                "<hig>石楠叶</hig>",
                "<hic>熟地黄</hic>",
                "<hic>茯苓</hic>",
                "<hic>沉香</hic>",
                "<hiy>九香虫</hiy>",
                "<hiy>络石藤</hiy>",
                "<hiy>冬虫夏草</hiy>",
                "<HIZ>人参</HIZ>",
                "<HIZ>何首乌</HIZ>",
                "<HIZ>凌霄花</HIZ>",
                "<hio>盘龙参</hio>",
                "<hio>天仙藤</hio>",
                "<hio>灵芝</hio>",
            ],
            type: "give",
            npc: "采药",
            room: "住房-小花园",
        },
        {
            items: [
                "<wht>鲢鱼</wht>",
                "<wht>鲤鱼</wht>",
                "<wht>草鱼</wht>",
                "<hig>鲂鱼</hig>",
                "<hig>鲮鱼</hig>",
                "<hig>鳊鱼</hig>",
                "<hic>太湖银鱼</hic>",
                "<hic>黄颡鱼</hic>",
                "<hic>黄金鳉</hic>",
                "<hiy>反天刀</hiy>",
                "<hiy>虹鳟</hiy>",
                "<hiy>孔雀鱼</hiy>",
                "<HIZ>罗汉鱼</HIZ>",
                "<HIZ>黑龙鱼</HIZ>",
                "<HIZ>银龙鱼</HIZ>",
                "<hio>七星刀鱼</hio>",
                "<hio>巨骨舌鱼</hio>",
                "<hio>帝王老虎魟</hio>",
            ],
            type: "give",
            npc: "钓鱼",
            room: "住房-小花园",
        }
    ];

    var WG = {
        show_hp_enable: 1,
        room_name: "",
        init: function () {
            $("li[command=SelectRole]").on("click", function () {
                WG.login();
                GS.init();
            });

        },
        show_hp: function (id) {
            if (WG.show_hp_enable) {
                if (id) {
                    let v = game_items.get(id);
                    if (v) {
                        let s = $(".room-item[itemid=" + id + "] .item-hp");
                        if (s.length == 0) {
                            s = $(".room-item[itemid=" + id + "] .item-name").after("<span class='item-hp'></span>").next();
                        }
                        if (v.hp != undefined) {
                            s.html("<hij>  HP:" + v.hp + "(" + Math.floor(v.hp / v.max_hp * 100) + "%)</hij>");
                        }
                    } else {
                        $(".room-item[itemid=" + id + "] .item-hp").remove();
                    }

                    return;
                }
                for (let [k, v] of game_items) {
                    let s = $(".room-item[itemid=" + k + "] .item-hp");
                    if (s.length == 0) {
                        s = $(".room-item[itemid=" + k + "] .item-name").after("<span class='item-hp'></span>").next();
                    }
                    if (v.hp != undefined) {
                        s.html("<hij>  HP:" + v.hp + "(" + Math.floor(v.hp / v.max_hp * 100) + "%)</hij>");
                    }
                }
            } else {
                $(".item-hp").remove();
            }

        },
        login: function () {
            role = $('.role-list .select').text().split(/[\s\n]/).pop();
            var html = `
                <div class="ui grid ">
                    <div class="ui long modal">
                        <div class="header">
                            基本设置
                        </div>
                        <div class="content">
                            <form class="ui form">
                                <div class="inline fields">
                                    <div class="field">
                                        <label>追捕/运镖等待时间</label>
                                        <input type="text" placeholder="追捕/运镖等待时间" name="zb_wait_time" id="zb_wait_time">
                                    </div>
                                    <div class="field">
                                        <label>武道塔失败尝试次数</label>
                                        <input type="text" placeholder="武道塔失败尝试次数" name="wd_retry_time" id="wd_retry_time">
                                    </div>      
                                    <div class="field">
                                        <label>最大练习等级</label>
                                        <input type="text" placeholder="最大练习等级" name="max_skill_level" id="max_skill_level">
                                     </div>    
                                     <div class="field">
                                     <label>自动分解列表</label>
                                     <input type="text" placeholder="自动分解列表" name="fenjie_list" id="fenjie_list">
                                  </div>                                                                   
                                </div>
                                <div class="inline fields">
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="auto_pfm_system" id="auto_pfm_system">
                                            <label>系统出招优先</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="nuoyijiekong" id="nuoyijiekong">
                                            <label>挪移解控</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                       <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="haichao" id="haichao">
                                            <label>自动海潮</label>
                                         </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="youlongjiekong" id="youlongjiekong">
                                            <label>游龙解控</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="hexiangz" id="hexiangz">
                                            <label>鹤翔桩/乾坤治疗</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="jyLbNotAttack" id="jyLbNotAttack">
                                            <label>九阳不出招</label>
                                        </div>
                                    </div>   
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="noThrowing" id="noThrowing">
                                            <label>不用锥法</label>
                                        </div>
                                    </div>                                         
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="xy_auto_kill" id="xy_auto_kill">
                                            <label>襄阳自动叫杀</label>
                                        </div>
                                    </div>                                                                       
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="console_debug" id="console_debug">
                                            <label>debug</label>
                                        </div>
                                    </div>                                                                                                                                                               
                                </div>
                                <div class="inline fields">
                                    <label for="wuwo_type">无我类型:</label>
                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input type="radio" name="wuwo_type" value="wuwo_control" id="wuwo_control">
                                            <label>控制</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input type="radio" name="wuwo_type" value="wuwo_damage" id="wuwo_type">
                                             <label>伤害</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input type="radio" name="wuwo_type" value="wuwo_weapon_buff" id="wuwo_weapon_buff">
                                             <label>兵器buff</label>
                                        </div>
                                    </div> 
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="wuxiangguimei" id="wuxiangguimei">
                                            <label>无相鬼魅/九阴/嗜血</label>
                                        </div>
                                    </div>  
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="wuxiangduopo" id="wuxiangduopo">
                                            <label>无相夺魄/剑气</label>
                                        </div>
                                    </div>    
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="wuxiangwz" id="wuxiangwz">
                                            <label>无相无招</label>
                                        </div>
                                    </div>    
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" tabindex="0" name="auto_zhong" id="auto_zhong">
                                            <label>昏迷后生死符</label>
                                        </div>
                                    </div>                                                                            
                                </div>
                                <div class="actions">
                                <div class="ui black deny mini button">取消</div>
                                <div class="ui positive right labeled icon mini button">确定</div>
                            </div>
                            </form>
                        </div>

                    </div>

                    <div><span class='item-dps'></span></div>

                    <div class="ui inverted compact mini secondary tabular menu">
                        <div class="item" data-tab="tab-mpbuttons">日常</div>
                        <div class="item" data-tab="tab-combatbuttons">战斗</div>
                        <div class="item" data-tab="tab-autobuttons">自动</div>
                        <div class="active item" data-tab="tab-message">记录</div>
                        <div class="item" data-tab="battle-message">战斗记录</div>
                    </div>

                    <div class="ui tab" data-tab="tab-mpbuttons">
                        <div class="mini inverted blue ui buttons zdy-item">
                            <button class='ui compact button shaolin'>少林</button>
                            <button class='ui compact button wudang'>武当</button>
                            <button class='ui compact button emei'>峨嵋</button>
                            <button class='ui compact button huashan'>华山</button>
                            <button class='ui compact button xiaoyao'>逍遥</button>
                            <button class='ui compact button gaibang'>丐帮</button>
                        </div>
                        <div class="mini inverted brown ui compact buttons zdy-item">
                            <button class='ui button sm_button'>师门(Q)</button>
                            <button class='ui button go_yamen_task'>追捕(W)</button>
                            <button class='ui button zdwk'>挖矿/修炼(Y)</button>
                            <button class='ui button settings_button'>设置</button>
                        </div>
                    </div>
                    <div class="ui tab" data-tab="tab-combatbuttons">
                        <div class="mini inverted brown ui compact buttons zdy-item">
                            <button class='ui button kill_all'>击杀(E)</button>
                            <button class='ui button get_all'>拾取(R)</button>
                            <button class='ui button sell_all'>清包(T)</button>
                            <button class='ui button wuxingzhuang'>悟性装</button>
                            <button class='ui button zhandouzhuang'>战斗装</button>                            
                            <!-- <button class='ui button repackStore'>整理仓库</button> -->
                        </div>
                        <div class="mini inverted brown ui compact buttons zdy-item">
                            <button class='ui button autopfm'>停止出招(F1)</button>
                            <button class='ui button combat_stat_finish'>结束统计(F2)</button>
                            <button class='ui button onebuttonXuruo'>清除虚弱(F4)</button>
                            <button class='ui button liaoshang'>疗伤</button>
                            <button class='ui button cangku'>仓库</button>
                        </div>
                    </div>
                    <div class="ui tab" data-tab="tab-autobuttons">
                        <div class="mini inverted brown ui compact buttons zdy-item">
                            <button class='ui button wudao'>自动武道</button>
                            <button class='ui button yunbiao'>自动运镖</button>
                            <button class='ui button autoGumu'>困难古墓</button>
                            <button class='ui button mitan'>襄阳密探</button>
                            <button class='ui button saoHuang'>武当扫黄</button>
                            <!-- <button class='ui button fightAuto'>传承</button> -->
                        </div>
                        <div class="mini inverted brown ui compact buttons zdy-item">
                        <button class='ui button manualyunbiao'>手动运镖</button>
                            <button class='ui button hslj'>华山论剑</button>
                            <button class='ui button smurf'>小号日常</button>
                        </div>
                    </div>                    
                    <div class="ui active tab" data-tab="tab-message">
                        <div class='ui black tiny floating message WG_log'><pre></pre></div>
                    </div>
                    <div class="ui tab" data-tab="battle-message">
                        <div class='ui black tiny floating message WG_battle_log'><pre></pre></div>
                    </div>                    
                </div>
                `;

            $(".content-message").after(html);
            var css = `
                .ui.buttons {
                    width: 70%;
                }
                .WG_log{overflow-y: auto;max-height: 8em;width: calc(100% - 40px);}
                .WG_battle_log{overflow-y: auto;max-height: 8em;width: calc(100% - 40px);}
                 .dialog-stats .top-item{
                    white-space: normal;
                }
                .WG_log::-webkit-scrollbar { width: 0 !important }
                .item-dps{float: left;width: calc(100% - 40px);line-height: 2em;font-size:120%;}                
                `;
            GM_addStyle(css);
            // goods = GM_getValue("goods", goods);
            // npcs = GM_getValue("npcs", npcs);
            $('.tabular.menu .item').tab();
            equip = GM_getValue(role + "_equip", equip);

            const tmp_settings = JSON.parse(GM_getValue(role + "_GS", JSON.stringify(GS)));
            let tmp_skill = GM_getValue(role + "_WuxingSkill", undefined);
            if (tmp_skill) {
                WG.myWuxingSkill = objToStrMap(JSON.parse(tmp_skill));
            }
            let tmpEq = GM_getValue(role + "_WuxingEq", undefined);
            if (tmpEq) {
                WG.myWuxingEq = JSON.parse(tmpEq);
            }

            tmp_skill = GM_getValue(role + "_myBattleSkill", undefined);
            if (tmp_skill) {
                WG.myBattleSkill = objToStrMap(JSON.parse(tmp_skill));
            }
            tmpEq = GM_getValue(role + "_myBattleEq", undefined);
            if (tmpEq) {
                WG.myBattleEq = JSON.parse(tmpEq);
            }

            console.log(tmp_settings);
            Object.keys(tmp_settings).forEach(function (key) {
                GS[key] = tmp_settings[key];
            });

            // $(".sm_button").on("click", WG.sm_button);

            $(".sm_button").on("click", AS.auto_sm_task);
            $(".go_yamen_task").on("click", AS.go_yamen_task);
            $(".wuxingzhuang").on("click", WG.wuxingzhuang);
            $(".zhandouzhuang").on("click", WG.zhandouzhuang);
            $(".wudang").on("click", WG.wudang);
            $(".shaolin").on("click", WG.shaolin);
            $(".emei").on("click", WG.emei);
            $(".huashan").on("click", WG.huashan);
            $(".xiaoyao").on("click", WG.xiaoyao);
            $(".gaibang").on("click", WG.gaibang);
            $(".liaoshang").on("click", WG.liaoshang);
            $(".cangku").on("click", WG.cangku);
            $(".repackStore").on("click", AS.repackStore);
            $(".kill_all").on("click", WG.kill_all);
            $(".get_all").on("click", WG.get_all);
            $(".sell_all").on("click", AS.auto_pack);
            $(".zdwk").on("click", WG.zdwk);
            $(".autopfm").on("click", WG.auto_pfm_button);
            $(".combat_stat_finish").on("click", WG.combat_stat_finish);
            $(".settings_button").on("click", WG.settings_button);
            $(".wudao").on("click", WG.wudao_auto);
            $(".autoGumu").on("click", WG.grove_auto);
            $(".mitan").on("click", WG.check_xy_mitan);
            $(".saoHuang").on("click", () => AS.shaoHuang());
            $(".hslj").on("click", AS.huashanluanjian);
            $(".smurf").on("click", AS.smurf_daily);
            $('.yunbiao').on('click', AS.goYunbiao);
            $('.manualyunbiao').on('click', AS.goJieBiao);
            $('.onebuttonXuruo').on('click', AS.oneButtonXuruoWushen);
            $('.fightAuto').on('click', AS.fightChuanCheng);
            setTimeout(function () {
                KEY.do_command("pack");
                KEY.do_command("skills");
                KEY.do_command("score");
                KEY.dialog_close();
                var logintext = `
                <hiy>欢迎${role},插件已加载！
                插件版本: ${GM_info.script.version}
                                </hiy>`;
                messageAppend(logintext);
                KEY.do_command("showtool");
                KEY.do_command("showcombat");
                WG.auto_pfm_button();
                $(document).bind('resumejob', function () {
                    WG.zdwk();
                });
                $('.ui .item').on('click', function () {
                    $('.ui .item').removeClass('active');
                    $(this).addClass('active');
                });
                setTimeout(() => {
                    if ($(".dialog-score").is(":visible")) $(".dialog-close").click();
                }, 100);
            }, 1000);
        },
        setting: function () {
            var a = `
            <span>门派选择： <select id="family">
                                    <option value="武当">武当</option>
                                    <option value="华山">华山</option>
                                    <option value="少林">少林</option>
                                    <option value="峨嵋">峨嵋</option>
                                    <option value="逍遥">逍遥</option>
                                    <option value="丐帮">丐帮</option>
                                    <option value="无门无派">无门</option>
                                    <option value="杀手楼">杀手</option>
                                </select></span>
                                `;
            messageAppend(a);
            $('#family').val(family);
            $("#family").change(function () {
                family = $("#family").val().toString();
                GM_setValue(role + "_family", family);
            });
        },
        updete_npc_id: function () {
            var lists = $(".room_items .room-item");
            messageClear();

            for (var npc of lists) {
                if (npc.lastElementChild.lastElementChild == null) {
                    npcs[npc.lastElementChild.innerHTML] = $(npc).attr("itemid");
                    messageAppend(npc.lastElementChild.innerHTML + " 的ID:" + $(npc).attr("itemid") + "\n");
                }
            }
            //GM_setValue("npcs", npcs);
        },
        go: function (p, after) {
            if (WG.at(p)) {
                if (after) send_cmd(after);
                return;
            }
            if (place[p] != undefined) {
                let path = place[p];
                if (after) {
                    path = `${path};${after}`;
                    let cmds = path.split(';');
                    if (cmds.length < 5) {
                        send_cmd(cmds);
                    } else {
                        AS.process_delay(cmds, 500);
                    }
                } else {
                    send_cmd(path);
                }

            }
        },
        at: function (p) {
            var w = $(".room-name").html();
            return w.indexOf(p) == -1 ? false : true;
        },
        sm_id: null,
        auto_pfm: false,
        auto_pfm_button: function () {
            if (WG.auto_pfm) {
                WG.auto_pfm = false;
                $(".autopfm").text("开始出招(F1)");
                log(`<hio>自动出招已经关闭</hio>`);
                if (WG.preform_timer) clearInterval(WG.preform_timer);
                remove_listener(WG.autopfmlistner);
            } else {
                WG.auto_pfm = true;
                $(".autopfm").text("停止出招(F1)");
                log(`<hio>自动出招已经开启</hio>`);

                WG.autopfmlistner = add_listener(['combat', 'status', 'pfm_ok', 'text', 'sc'], async (data) => {
                    if (data.type == 'combat' && data.start) {
                        if (!GS.auto_pfm_system) {
                            in_combat = true;
                            if (GS.wuwo_type === 'wuwo_weapon_buff' && family === '逍遥' && !my_buffs.has('weapon')) {
                                try_perform('parry.yi', '移花');
                                try_perform('sword.zhong', '重剑无锋');
                                try_perform('sword.chao', '海潮汹涌');
                                check_buff();
                                perform_busy(false, true);
                                perform_attack();
                            } else if (has_perform('unarmed.duo')) {
                                console.log('夺魄控制后出');
                                check_buff();
                                perform_attack();
                                perform_busy(false, true);
                            } else {
                                check_buff();
                                perform_busy(false, true);
                                perform_attack();
                            }
                        }
                        WG.preform_timer = setInterval(() => {
                            if (!in_combat && WG.preform_timer) clearInterval(WG.preform_timer);
                            if (i_am_ready) {
                                console.log('autopfm timer triggered');
                                check_buff();
                                perform_busy();
                                perform_attack(3);
                            }
                        }, 350);
                        // } else if (in_combat && data.type == 'status' && data.id == my_id && data.action == 'remove') {
                        //     if (!i_am_ready && !my_buffs.has('busy') && !my_buffs.has('faint')) {
                        //         i_am_ready = true;
                        //     }
                        //     check_buff();
                        //     perform_busy();
                        // } else if (in_combat && data.type == 'status' && data.id != my_id && data.action == 'remove') {
                        //     check_buff();
                        //     perform_busy();
                    } else if (in_combat && data.type == 'status' && data.action == 'remove') {
                        if (!i_am_ready && !my_buffs.has('busy') && !my_buffs.has('faint') && !my_buffs.has('rash')) {
                            i_am_ready = true;
                        }
                        if (GS.jyLbNotAttack && (data.sid == 'force' || data.sid == 'dodge')) {
                            if (data.id == my_id) {
                                my_buffs.delete(data.sid);
                            } else {
                                let target = getTarget(data.id);
                                target && target.buffs.delete(data.sid);
                            }

                            check_buff();
                            perform_busy();
                            perform_attack();
                        } else {
                            check_buff();
                            perform_busy();
                        }
                    } else if (in_combat && data.type == 'pfm_ok' && i_am_ready) {
                        perform_debuff_remove();
                        perform_healing();
                        check_buff();
                        perform_busy();
                        perform_attack(1, data.id);
                    } else if (in_combat && data.type == 'pfm_ok') {
                        setTimeout(function () {
                            perform_debuff_remove();
                        }, 250);
                    } else if (in_combat && data.type == 'text' && data.msg) {
                        if (data.msg.includes("快步上前，将全身九阴真气贯于左手，猛地抓向")) {
                            try_perform('parry.dou', '斗转');
                        } else if (GS.wuxiangguimei && data.msg.includes("运起葵花神功，整个人如同被烟雾笼罩一般")) {
                            try_perform('force.duo', '无相');
                        } else if (GS.wuxiangduopo && data.msg.includes("冷笑数声，手指微微弯曲成爪，身形疾转，飞向你头顶抓下")) {
                            try_perform('force.duo', '无相');
                        } else if (GS.wuxiangguimei && data.msg.includes('逆转九阴，双眼血红，状若疯魔，竟自不加防守，一味凌厉进攻！')) {
                            const r = data.msg.match(/^<hir>(.*)逆转九阴/);
                            if (current_target_id && r && r[1]) {
                                // let target = find_item(r[1]);
                                let target = game_items.get(current_target_id);
                                if (target && target.name.includes(r[1]))
                                    try_perform('force.duo', '无相');
                            }
                        } else if (GS.wuxiangguimei && data.msg.includes('闭目凝神，心如点转，双手抱环划破虚空，周身灵气如指引般汇聚在他周身，一阴一阳仿若真灵护体。')) {
                            const r = data.msg.match(/^>(.*)闭目凝神/);
                            if (current_target_id && r && r[1]) {
                                // let target = find_item(r[1]);
                                let target = game_items.get(current_target_id);
                                if (target && target.name.includes(r[1]))
                                    try_perform('force.duo', '无相');
                            }
                        } else if (GS.wuxiangguimei && data.msg.includes('咬破舌尖，大喝一声，全身弥漫起一片血雾！！') && !data.msg.includes('你咬破舌尖')) {
                            if (!my_buffs.has('weapon'))
                                try_perform('force.duo', '无相');
                        } else if (data.msg.includes('中指一按，一股凌厉无伦的无形剑气直奔你胸前射去') && GS.wuxiangduopo) {
                            try_perform('force.duo', '无相');
                            // } else if (GS.auto_zhong && data.msg.includes('只觉得眼前一黑，接着什么都不知道')) {
                            //     //const targetStatus = getTarget(current_target_id);
                            //     const r = data.msg.match(/>(.*)只觉得眼前一黑/);
                            //     if (r && r[1]) {
                            //         const target_id = find_item(r[1]);
                            //         if (target_id == current_target_id) {
                            //             try_perform_zhong();
                            //         }
                            //     }
                            // } else if (GS.auto_zhong && data.msg.includes('只见你施展凌波微步，神光离合，乍阴乍阳，动无常则，进止难期')) {
                            //     try_perform_zhong();
                        } else if (GS.wuxiangwz) {
                            const r = data.msg.match(/^<him>(.*)凝神聚气，挥洒手中兵器，进入无招无我，剑心通明境界/);
                            if (current_target_id && r && r[1]) {
                                let target = game_items.get(current_target_id);
                                if (target && target.name.includes(r[1]) && !my_buffs.has('weapon'))
                                    try_perform('force.duo', '无相');
                            }
                        } else if (data.msg.includes('的九阳神功摧毁了你的真元')) {
                            const r = data.msg.match(/^<hir>(.*)的九阳神功摧毁了你的真元/);
                            if (current_target_id && r && r[1]) {
                                // let target = find_item(r[1]);
                                let npc = game_items.get(current_target_id);
                                if (npc && npc.name.includes(r[1])) {
                                    let target = all_targets.get(current_target_id);
                                    target && target.buffs.set('force2', '九阳内功');
                                }

                            }
                        }
                    } else if (in_combat && data.type == 'status') {
                        if (data.id == my_id) {
                            if (data.action == 'add') {
                                perform_debuff_remove();
                            }
                        }
                    } else if (in_combat && data.type == 'sc') {
                        perform_healing();
                    }
                });
            }
        },
        combat_stat_finish: function () {
            if (WG.dmg_timer) {
                clearInterval(WG.dmg_timer);
            }
            combat_stats.forEach((value, name) => {
                let npc_id = find_item(name);
                // var npc_id = npcs[name];
                let max_hp = 0;
                if (npc_id && name !== '你') {
                    let npc = game_items.get(npc_id);
                    max_hp = npc.max_hp;
                    battleMsgAppend(`你对${name}总共造成了${fmt_number(value / 10000)}万伤害, 占总血量${fmt_number(value * 100 / max_hp)}%`);
                } else {
                    if (name == '你') {
                        battleMsgAppend(`你受到了${value / 10000}万伤害`);
                    } else {
                        battleMsgAppend(`你对${name}总共造成了${value / 10000}万伤害`);
                    }
                }

                $(".item-dps").html("");
            });
            remove_listener(WG.damagelistner);

            if (busy_timer) {
                clearInterval(busy_timer);
            }
            combat_stats = new Map();
            all_targets = new Map();
            in_combat = false;
        },
        settings_button: () => {
            $('.ui.long.modal')
                .modal({
                    onApprove: function () {
                        WG.save_settings();
                    }
                })
                .modal('show');
        },
        save_settings: () => {

            let formData = $('.ui.form input').serializeArray();
            formData = formData.concat(
                jQuery('.ui.form input[type=checkbox]:not(:checked)').map(
                    function () {
                        // @ts-ignore
                        return { "name": this.name, "value": 'off' }
                    }).get()
            );

            formData.forEach(item => {
                switch (item.name) {
                    case 'zb_wait_time':
                    case 'wd_retry_time':
                    case 'max_skill_level':
                        console.log(`${item.name} = ${item.value}`);
                        GS[item.name] = Number(item.value);
                        break;
                    case 'fenjie_list':
                        GS[item.name] = item.value.toString();
                        break;
                    case 'auto_pfm_system':
                    case 'nuoyijiekong':
                    case 'youlongjiekong':
                    case 'hexiangz':
                    case 'wuxiangguimei':
                    case 'wuxiangduopo':
                    case 'haichao':
                    case 'console_debug':
                    case 'wuxiangwz':
                    case 'auto_zhong':
                    case 'xy_auto_kill':
                    case 'jyLbNotAttack':
                    case 'noThrowing':
                        GS[item.name] = item.value == 'off' ? false : true;
                        console.log(`${item.name} = ${GS[item.name]}, ${item.value}`);
                        break;
                    case 'wuwo_type':
                        console.log(`无我类型${item.value}`);
                        GS.wuwo_type = item.value;
                        break;
                    default:
                        console.log(`unexpected type ${item.name}, value ${item.value}`);
                }
            });
            console.log(formData);

            GM_setValue(role + "_GS", JSON.stringify(GS));
        },
        combat_finish: function () {
            in_combat = false;
            if (WG.preform_timer) clearInterval(WG.preform_timer);
            let combat_time = (performance.now() - combat_start_time) / 1000;
            let total_dmg = 0;
            if (WG.dmg_timer) {
                clearInterval(WG.dmg_timer);
            }
            if (current_target_id == null) return;
            battleMsgAppend(`战斗结束, 总耗时${combat_time} 秒`);
            combat_stats.forEach((value, name) => {
                if (name != '你') {
                    total_dmg += value;
                }
            });
            battleMsgAppend(`本次战斗总计伤害${fmt_number(total_dmg / 10000)}万, 秒伤为${fmt_number((total_dmg / combat_time) / 10000)}万`);
            remove_listener(WG.damagelistner);

            current_target_id = null;
        },
        eq: function (e) {
            send_cmd("eq " + equip[e]);
        },
        ask: function (npc, i) {
            npc = find_item(npc);

            if (npc != undefined)
                send_cmd("ask" + i + " " + npc);
            else
                WG.updete_npc_id();
        },
        check_xy_mitan: function () {
            let path = xiangyang_fullpath.split(";");

            let index = 0;
            remove_listener(WG.xy_mitan_listener);
            let mitan_timer;
            messageAppend(`<hio>自动襄阳密探</hio>: 开始寻找密探`);
            WG.xy_mitan_listener = add_listener(['combat', 'items'], function (data) {

                if (data.type == 'combat') {
                    if (data.start) {
                        messageAppend(`<hio>自动襄阳密探</hio>: 进入战斗`);
                        if (mitan_timer) {
                            clearTimeout(mitan_timer);
                        }
                    } else if (data.end) {
                        messageAppend(`<hio>自动襄阳密探</hio>: 继续寻找密探`);
                        WG.combat_stat_finish();
                        mitan_timer = setTimeout(function () {
                            send_cmd(path[index++] + '');
                        }, 500);
                    }
                } else if (data.type == 'items' && data.items) {
                    let kill_check = false;
                    for (let item of data.items) {
                        if (item.name && item && !item.p && !item.name.includes('郭靖')) {
                            kill_cmd(item.id);
                            kill_check = true;
                            if (item.name.includes("蒙古密探")) {
                                messageAppend(`<hio>自动襄阳密探</hio>: 找到${item.name}，自动击杀！！！`);
                                remove_listener(WG.xy_mitan_listener);
                            }
                        }
                    }
                    if (!kill_check) {
                        if (index < path.length) {
                            mitan_timer = setTimeout(function () {
                                send_cmd(path[index++]);
                            }, 500);
                        } else {
                            messageAppend(`<hio>自动襄阳密探</hio>: 完成搜索,恢复挂机`);
                            remove_listener(WG.xy_mitan_listener);
                            setTimeout(function () {
                                $(document).trigger('resumejob');
                            }, 800);

                        }
                    }
                }
            });
            send_cmd(path[index++]);
        },
        yamen_job: false,

        ask_task_promise: () => new Promise((resolve) => {
            WG.yamen_listener = add_listener(['dialog'], async (data) => {
                if (data.dialog == 'tasks' && data.items) {
                    const task = data.items.find(task => task.id == 'yamen');
                    if (task && task.desc.includes('寻找他')) {

                        console.log(`Found Yamen Task ${task.desc} state = ${task.state}`);
                        remove_listener(WG.yamen_listener);
                        resolve(task);
                    }
                }
            });
            KEY.do_command("tasks");
            KEY.dialog_close();
        }),
        kill_all: function () {
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                send_cmd("kill " + $(npc).attr("itemid"));
            }
        },

        get_all: function () {
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                send_cmd("get all from " + $(npc).attr("itemid"));
            }
        },
        wuxingzhuang: function () {
            send_cmd("stopstate");

            if (WG.myWuxingSkill && WG.myWuxingSkill.size > 0 && WG.myWuxingEq.length > 0) {
                let cmds = [];
                for (let [skill, spSkill] of WG.myWuxingSkill) {
                    const curnSill = my_basic_skills.get(skill);
                    if (spSkill === curnSill.enable_skill) {
                        log(`已经装备了${my_special_skills.get(spSkill).name}`)
                    } else {
                        cmds.push(`enable ${skill} ${spSkill}`);
                    }
                }
                for (let item of WG.myWuxingEq) {
                    if (!my_eq.includes(item))
                        cmds.push(`eq ${item}`);
                    else {
                        const i = pack_items.get(item);
                        log(`已经装备了${i.name}`)
                    }
                }
                AS.process_delay(cmds, 500);
            } else {
                messageAppend("技能装备失败，没有定义角色技能");
            }

        },
        zhandouzhuang: function () {
            send_cmd("stopstate");
            if (WG.myBattleSkill && WG.myBattleSkill.size > 0 && WG.myBattleEq.length > 0) {
                let cmds = [];
                for (let [skill, spSkill] of WG.myBattleSkill) {
                    const curnSill = my_basic_skills.get(skill);
                    if (spSkill === curnSill.enable_skill) {
                        log(`已经装备了${my_special_skills.get(spSkill).name}`)
                    } else {
                        cmds.push(`enable ${skill} ${spSkill}`);
                    }
                }
                for (let item of WG.myBattleEq) {
                    if (!my_eq.includes(item))
                        cmds.push(`eq ${item}`);
                    else {
                        const i = pack_items.get(item);
                        log(`已经装备了${i.name}`)
                    }
                }
                AS.process_delay(cmds, 500);
            } else {
                messageAppend("技能装备失败，没有定义角色技能");
            }

        },
        wudang: function () {
            send_cmd("stopstate");
            WG.go("武当派-林间小径");
        },
        shaolin: function () {
            send_cmd("stopstate");
            WG.go("少林派-后殿");
        },
        emei: function () {
            send_cmd("stopstate");
            WG.go("峨眉派-广场");
            send_cmd("go west;go south");
        },
        huashan: function () {
            send_cmd("stopstate");
            WG.go("华山派-玉女峰");
        },
        gaibang: function () {
            send_cmd("stopstate");
            WG.go("丐帮-林间小屋");
        },
        xiaoyao: function () {
            send_cmd("stopstate");
            WG.go("逍遥派-地下石室");
        },
        sell_all: function () {
            WG.go("扬州城-药铺");
            send_cmd("sell all");
        },
        packup_listener: null,
        inArray: function (val, arr) {
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if (item[0] == "<") {
                    if (item == val) return true;

                } else {
                    if (val.indexOf(item) >= 0) return true;
                }
            }
            return false;

        },
        liaoshang: function () {
            // send_cmd("stopstate");
            WG.go("扬州城-武庙", "liaoshang");
        },
        cangku: function () {
            send_cmd("stopstate");
            WG.go("住房-卧室", "store");
        },
        lianxi: function (jineng) {
            send_cmd("stopstate");
            WG.go("住房-练功房");
            send_cmd("lianxi" + " " + jineng);

            $(document).unbind('resumejob');
            $(document).bind('resumejob', function () {
                WG.lianxi(jineng)
            });
        },
        default_lianxi_callback: function (key, skill) {
            console.log("将要练习：" + skill);
            WG.lianxi(skill);
        },
        zdwk: async () => {

            $(document).unbind('resumejob');
            $(document).bind('resumejob', function () {
                WG.zdwk()
            });

            // var t = $(".room_items .room-item:first .item-name").text();
            // t = t.indexOf("<挖矿");
            if (WG.xiulian) {
                send_cmd("stopstate");
                AS.go_retry("住房-练功房", "xiulian");
                return;
            }
            if (!equip["铁镐"] || 0 === equip["铁镐"].length) {
                KEY.do_command("pack");
            }
            send_cmd("stopstate");
            await AS.go_retry("扬州城-矿山");
            WG.eq("铁镐");
            send_cmd("wa");
        },
        timer_close: function () {
            if (timer) {
                clearInterval(timer);
                timer = undefined;
            }
            WG.xiangyang_mitan = false;
            WG.wudao_auto("stop");
        },
        auto_check: function () {
            if (timer) return true;
            if (WG.wd_linstener) return true;
            return false;
        },
        wudao_state: 0,
        wudao_auto: async (v) => {

            if (v == "stop" || WG.wd_linstener) {
                remove_listener(WG.wd_linstener);
                WG.wd_linstener = undefined;
                WG.kill_id = "";
                $(".wudao").text("自动武道");
                messageAppend("<hio>自动武道</hio>停止");
                return;
            }

            $(".wudao").text("停止武道");

            let reset = false;
            if (confirm('是否重置？')) {
                reset = true
            }

            remove_listener(WG.wd_linstener);
            WG.kill_id = "";
            WG.wudao_failureCount = 0;
            await AS.go_retry("武道塔-入口");

            if (reset) {
                await AS.wait(200);
                let id = find_item('守门人');

                if (id) {
                    send_cmd("ask1 " + id + ";go enter;");
                } else {
                    messageAppend("<hio>自动武道</hio>未发现守门人");
                    return;
                }
            }
            send_cmd("go enter");

            if (!WG.auto_pfm) { WG.auto_pfm_button() }

            WG.wd_linstener = add_listener(["items", "text", "combat", "room"], async (data) => {
                if (data.type == "items") {
                    // let r = WG.room_name.match(/^武道塔-第(.+)层$/);
                    const guard = data.items.find(npc => npc.name && npc.name.match(/武道塔守护者|武道镇守者|武道传承者/));
                    if (guard && guard.name.includes("武道塔守护者") && guard.id != my_id) {
                        WG.kill_id = guard.id;
                        kill_cmd(WG.kill_id);
                        WG.wudao_state = 1;
                        return;
                    }
                } else if (data.type == 'room') {
                    if (data.name == '武道塔-第一百层') {
                        WG.wudao_auto("stop");
                        WG.zdwk();
                        return;
                    }
                }
                else if (data.type == 'text' && data.msg == '<hig>恭喜你战胜了武道塔守护者，你现在可以进入下一层。</hig>') {
                    const me = game_items.get(my_id);
                    WG.wudao_state = 0;
                    WG.wudao_failureCount = 0;
                    const remain = me.hp / me.max_hp;
                    const mp_remain = me.mp / me.max_mp;
                    if (remain > 0.8 && mp_remain > 0.2) {
                        await AS.wait(1000);
                        await AS.go_retry('武道塔-入口');
                        send_cmd('go enter');
                    } else {
                        messageAppend(`${(new Date()).toLocaleTimeString()} <hio>自动武道</hio>: 血量不足，治疗后自动武道`);
                        if (mp_remain < 0.2) {
                            WG.wudao_busy_handle('dazuo');
                        } else {
                            WG.wudao_busy_handle();
                        }
                    }
                } else if (data.type == 'text' && data.msg == '<hir>你的挑战失败了。</hir>') {
                    WG.wudao_state = 2;
                    messageAppend("<hio>自动武道</hio>失败，自动回血");
                    send_cmd('relive');
                    WG.wudao_failureCount++;
                    messageAppend(`${(new Date()).toLocaleTimeString()} <hio>自动武道</hio>: 已失败${WG.wudao_failureCount}次，武庙治疗`);
                    WG.wudao_busy_handle();
                } else if (data.type == 'combat' && data.end) {
                    if (my_buffs.has('busy') || my_buffs.has('faint') || my_buffs.has('rash')) {
                        await AS.wait(1000);
                        if (WG.wudao_state === 1) {
                            messageAppend("<hio>自动武道</hio>战斗结束");
                            WG.wudao_state = 2;
                            WG.wudao_busy_handle();
                        }
                    }
                }
            });
        },
        wudao_busy_handle: async (action = 'liaoshang') => {
            await AS.wait(3000);
            await AS.liaoshang(action);
            WG.wudao_cure_hook();
        },
        wudao_cure_hook: async () => {
            if (WG.wudao_failureCount >= GS.wd_retry_time) {
                messageAppend(`<hio>自动武道</hio>连续失败${GS.wd_retry_time}次，停止自动,2秒后自动挖矿/修炼`);
                WG.wudao_auto("stop");
                setTimeout(WG.zdwk, 2000);
            } else if (my_buffs.has('xuruo')) {
                messageAppend(`<hio>自动武道</hio>: 处于虚弱，3秒后再继续`);
                WG.wudao_busy_handle();
            } else if (WG.wd_linstener) {
                messageAppend(`<hio>自动武道</hio>: 继续武道塔`);
                await AS.go_retry("武道塔-入口");
                await AS.wait(500);
                send_cmd("go enter");
                kill_cmd(WG.kill_id);
            } else {
                WG.zdwk();
            }
        },
        fbnum: 0,
        needGrove: 0,
        oncegrove: function () {
            this.fbnum += 1;
            messageAppend("第" + this.fbnum + "次");
            send_cmd("cr gumu/gumukou 1 0;cr over");
            if (this.needGrove == this.fbnum) {
                messageAppend("<hiy>" + this.fbnum + "次副本困难古墓秒进秒退已完成</hiy>");
                this.timer_close();
            }
        },
        grove_auto: function () {
            if (timer == undefined) {
                let input = prompt("请输入需要秒进秒退的困难古墓副本次数", "");
                this.fbnum = 0;
                if (input) //如果返回的有内容
                {
                    this.needGrove = parseFloat(input);
                    if (this.needGrove.toString() == "NaN") {
                        messageAppend("请输入数字");
                        return;
                    }
                    messageAppend("开始秒进秒退困难古墓" + this.needGrove + "次");

                    timer = setInterval(() => {
                        this.oncegrove()
                    }, 1000);
                }
            }

        },
    };
    $(document).ready(function () {
        KEY.init();
        WG.init();
        $('head').append('<link href="http://cdn.staticfile.org/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.css" rel="stylesheet">');
        $('head').append('<link href="http://cdn.staticfile.org/semantic-ui/2.4.1/components/button.min.css" rel="stylesheet">');
        $('head').append('<link href="http://cdn.staticfile.org/semantic-ui/2.4.1/components/message.min.css" rel="stylesheet">');
        $('head').append('<link href="http://cdn.staticfile.org/semantic-ui/2.4.1/components/menu.min.css" rel="stylesheet">');
        $('head').append('<link href="http://cdn.staticfile.org/semantic-ui/2.4.1/components/tab.min.css" rel="stylesheet">');
        $('head').append('<link href="http://cdn.staticfile.org/semantic-ui/2.4.1/components/modal.min.css" rel="stylesheet">');
        $('head').append('<link href="http://cdn.staticfile.org/semantic-ui/2.4.1/components/dimmer.min.css" rel="stylesheet">');
        $('head').append('<link href="http://cdn.staticfile.org/semantic-ui/2.4.1/components/transition.min.css" rel="stylesheet">');
        $('head').append('<link href="http://cdn.staticfile.org/semantic-ui/2.4.1/components/form.min.css" rel="stylesheet">');
        $('head').append('<link href="http://cdn.staticfile.org/semantic-ui/2.4.1/components/checkbox.min.css" rel="stylesheet">');
        $('head').append('<link href="http://cdn.staticfile.org/semantic-ui/2.4.1/components/label.min.css" rel="stylesheet">');
        $('head').append('<link href="http://cdn.staticfile.org/semantic-ui/2.4.1/components/input.min.css" rel="stylesheet">');
        $.contextMenu({
            selector: '.container',
            build: function ($trigger) {
                var setup = {
                    callback: function (key, options) {
                        console.log("点击了：" + key);
                    },
                    items: {
                        "练习技能": {
                            name: "练习技能",
                            "items": {},
                        },
                        "快捷传送": {
                            name: "常用地点",
                            "items": {
                                "kj0": {
                                    name: "豪宅",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("住房");
                                    },
                                },
                                "kj1": {
                                    name: "仓库",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("扬州城-钱庄");
                                        send_cmd("store")
                                    },
                                },
                                "kj2": {
                                    name: "衙门",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("扬州城-衙门正厅");
                                    },
                                },
                                "kj3": {
                                    name: "帮派",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("扬州城-帮派");
                                    },
                                },
                                "kj4": {
                                    name: "擂台",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("扬州城-擂台");
                                    },
                                },
                                "kj5": {
                                    name: "当铺",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("扬州城-当铺");
                                    },
                                },
                                "kj6": {
                                    name: "杂货铺",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("扬州城-杂货铺");
                                    },
                                },
                                "kj7": {
                                    name: "打铁铺",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("扬州城-打铁铺");
                                    },
                                },
                                "kj8": {
                                    name: "药铺",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("扬州城-药铺");
                                    },
                                },
                            },
                        },
                        "门派传送": {
                            name: "门派传送",
                            "items": {
                                "mp0": {
                                    name: "豪宅",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("住房");
                                    },
                                },
                                "mp1": {
                                    name: "武当",
                                    "items": {
                                        "wd1": {
                                            name: "广场",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-广场");
                                            },
                                        },
                                        "wd2": {
                                            name: "三清殿",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-三清殿");
                                            },
                                        },
                                        "wd3": {
                                            name: "石阶",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-石阶");
                                            },
                                        },
                                        "wd4": {
                                            name: "练功房",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-练功房");
                                            },
                                        },
                                        "wd5": {
                                            name: "太子岩",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-太子岩");
                                            },
                                        },
                                        "wd6": {
                                            name: "桃园小路",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-桃园小路");
                                            },
                                        },
                                        "wd7": {
                                            name: "舍身崖",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-舍身崖");
                                            },
                                        },
                                        "wd8": {
                                            name: "南岩峰",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-南岩峰");
                                            },
                                        },
                                        "wd9": {
                                            name: "乌鸦岭",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-乌鸦岭");
                                            },
                                        },
                                        "wd10": {
                                            name: "五老峰",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-五老峰");
                                            },
                                        },
                                        "wd11": {
                                            name: "虎头岩",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-虎头岩");
                                            },
                                        },
                                        "wd12": {
                                            name: "朝天宫",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-朝天宫");
                                            },
                                        },
                                        "wd13": {
                                            name: "三天门",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-三天门");
                                            },
                                        },
                                        "wd14": {
                                            name: "紫金城",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-紫金城");
                                            },
                                        },
                                        "wd15": {
                                            name: "林间小径",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-林间小径");
                                            },
                                        },
                                        "wd16": {
                                            name: "后山小院",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("武当派-后山小院");
                                            },
                                        },
                                    },
                                },
                                "mp2": {
                                    name: "少林",
                                    "items": {
                                        "sl1": {
                                            name: "广场",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-广场");
                                            },
                                        },
                                        "sl2": {
                                            name: "山门殿",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-山门殿");
                                            },
                                        },
                                        "sl3": {
                                            name: "东侧殿",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-东侧殿");
                                            },
                                        },
                                        "sl4": {
                                            name: "西侧殿",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-西侧殿");
                                            },
                                        },
                                        "sl5": {
                                            name: "天王殿",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-天王殿");
                                            },
                                        },
                                        "sl6": {
                                            name: "大雄宝殿",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-大雄宝殿");
                                            },
                                        },
                                        "sl7": {
                                            name: "钟楼",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-钟楼");
                                            },
                                        },
                                        "sl8": {
                                            name: "鼓楼",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-鼓楼");
                                            },
                                        },
                                        "sl9": {
                                            name: "后殿",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-后殿");
                                            },
                                        },
                                        "sl10": {
                                            name: "练武场",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-练武场");
                                            },
                                        },
                                        "sl11": {
                                            name: "罗汉堂",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-罗汉堂");
                                            },
                                        },
                                        "sl12": {
                                            name: "般若堂",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-般若堂");
                                            },
                                        },
                                        "sl13": {
                                            name: "方丈楼",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-方丈楼");
                                            },
                                        },
                                        "sl14": {
                                            name: "戒律院",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-戒律院");
                                            },
                                        },
                                        "sl15": {
                                            name: "达摩院",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-达摩院");
                                            },
                                        },
                                        "sl16": {
                                            name: "竹林",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-竹林");
                                            },
                                        },
                                        "sl17": {
                                            name: "藏经阁",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-藏经阁");
                                            },
                                        },
                                        "sl18": {
                                            name: "达摩洞",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("少林派-达摩洞");
                                            },
                                        },
                                    },
                                },
                                "mp3": {
                                    name: "华山",
                                    "items": {
                                        "hs1": {
                                            name: "镇岳宫",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-镇岳宫");
                                            },
                                        },
                                        "hs2": {
                                            name: "苍龙岭",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-苍龙岭");
                                            },
                                        },
                                        "hs3": {
                                            name: "舍身崖",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-舍身崖");
                                            },
                                        },
                                        "hs4": {
                                            name: "峭壁",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-峭壁");
                                            },
                                        },
                                        "hs5": {
                                            name: "山谷",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-山谷");
                                            },
                                        },
                                        "hs6": {
                                            name: "山间平地",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-山间平地");
                                            },
                                        },
                                        "hs7": {
                                            name: "林间小屋",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-林间小屋");
                                            },
                                        },
                                        "hs8": {
                                            name: "玉女峰",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-玉女峰");
                                            },
                                        },
                                        "hs9": {
                                            name: "玉女祠",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-玉女祠");
                                            },
                                        },
                                        "hs10": {
                                            name: "练武场",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-练武场");
                                            },
                                        },
                                        "hs11": {
                                            name: "练功房",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-练功房");
                                            },
                                        },
                                        "hs12": {
                                            name: "客厅",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-客厅");
                                            },
                                        },
                                        "hs13": {
                                            name: "偏厅",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-偏厅");
                                            },
                                        },
                                        "hs14": {
                                            name: "寝室",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-寝室");
                                            },
                                        },
                                        "hs15": {
                                            name: "玉女峰山路",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-玉女峰山路");
                                            },
                                        },
                                        "hs16": {
                                            name: "玉女峰小径",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-玉女峰小径");
                                            },
                                        },
                                        "hs17": {
                                            name: "思过崖",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-思过崖");
                                            },
                                        },
                                        "hs18": {
                                            name: "山洞",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-山洞");
                                            },
                                        },
                                        "hs19": {
                                            name: "长空栈道",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-长空栈道");
                                            },
                                        },
                                        "hs20": {
                                            name: "落雁峰",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-落雁峰");
                                            },
                                        },
                                        "hs21": {
                                            name: "华山绝顶",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("华山派-华山绝顶");
                                            },
                                        },
                                    },
                                },
                                "mp4": {
                                    name: "峨眉",
                                    "items": {
                                        "em1": {
                                            name: "金顶",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("峨眉派-金顶");
                                            },
                                        },
                                        "em2": {
                                            name: "庙门",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("峨眉派-庙门");
                                            },
                                        },
                                        "em3": {
                                            name: "广场",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("峨眉派-广场");
                                            },
                                        },
                                        "em4": {
                                            name: "走廊",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("峨眉派-走廊");
                                            },
                                        },
                                        "em5": {
                                            name: "休息室",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("峨眉派-休息室");
                                            },
                                        },
                                        "em6": {
                                            name: "厨房",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("峨眉派-厨房");
                                            },
                                        },
                                        "em7": {
                                            name: "练功房",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("峨眉派-练功房");
                                            },
                                        },
                                        "em8": {
                                            name: "小屋",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("峨眉派-小屋");
                                            },
                                        },
                                        "em9": {
                                            name: "清修洞",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("峨眉派-清修洞");
                                            },
                                        },
                                        "em10": {
                                            name: "大殿",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("峨眉派-大殿");
                                            },
                                        },
                                        "em11": {
                                            name: "睹光台",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("峨眉派-睹光台");
                                            },
                                        },
                                        "em12": {
                                            name: "华藏庵",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("峨眉派-华藏庵");
                                            },
                                        },
                                    },
                                },
                                "mp5": {
                                    name: "逍遥",
                                    "items": {
                                        "xy1": {
                                            name: "青草坪",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("逍遥派-青草坪");
                                            },
                                        },
                                        "xy2": {
                                            name: "林间小道",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("逍遥派-林间小道");
                                            },
                                        },
                                        "xy3": {
                                            name: "练功房",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("逍遥派-练功房");
                                            },
                                        },
                                        "xy4": {
                                            name: "木板路",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("逍遥派-木板路");
                                            },
                                        },
                                        "xy5": {
                                            name: "工匠屋",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("逍遥派-工匠屋");
                                            },
                                        },
                                        "xy6": {
                                            name: "休息室",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("逍遥派-休息室");
                                            },
                                        },
                                        "xy7": {
                                            name: "木屋",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("逍遥派-木屋");
                                            },
                                        },
                                        "xy8": {
                                            name: "地下石室",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("逍遥派-地下石室");
                                            },
                                        },
                                    },
                                },
                                "mp6": {
                                    name: "丐帮",
                                    "items": {
                                        "gb1": {
                                            name: "树洞内部",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("丐帮-树洞内部");
                                            },
                                        },
                                        "gb2": {
                                            name: "树洞下",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("丐帮-树洞下");
                                            },
                                        },
                                        "gb3": {
                                            name: "暗道",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("丐帮-暗道");
                                            },
                                        },
                                        "gb4": {
                                            name: "破庙密室",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("丐帮-破庙密室");
                                            },
                                        },
                                        "gb5": {
                                            name: "土地庙",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("丐帮-土地庙");
                                            },
                                        },
                                        "gb6": {
                                            name: "林间小屋",
                                            // @ts-ignore
                                            callback: function (key, opt) {
                                                WG.go("丐帮-林间小屋");
                                            },
                                        },
                                    },
                                },
                                "mp7": {
                                    name: "襄阳",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("襄阳城-广场");
                                    },
                                },
                                "mp8": {
                                    name: "武道",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("武道塔-入口");
                                    },
                                },
                                "mp9": {
                                    name: "武庙",
                                    // @ts-ignore
                                    callback: function (key, opt) {
                                        WG.go("扬州城-武庙");
                                    },
                                },
                            },
                        },
                        "设置": {
                            name: "设置",
                            // @ts-ignore
                            callback: function (key, opt) {
                                WG.setting();
                            },
                        },
                        "保存技能和装备": {
                            name: "保存技能和装备",
                            callback: AS.saveEqSkill,
                        },
                        "显血开关(开)": {
                            name: "显血开关(开)",
                            // @ts-ignore
                            visible: function (key, opt) {
                                return WG.show_hp_enable == 0;
                            },
                            // @ts-ignore
                            callback: function (key, opt) {
                                WG.show_hp_enable = 1;
                                WG.show_hp();
                            },
                        },
                        "显血开关(关)": {
                            name: "显血开关(关)",
                            // @ts-ignore
                            visible: function (key, opt) {
                                return WG.show_hp_enable == 1;
                            },
                            // @ts-ignore
                            callback: function (key, opt) {
                                WG.show_hp_enable = 0;
                                WG.show_hp();
                            },
                        }
                    }
                };

                for (var [skillid, skill] of my_special_skills) {
                    // var slevel = my_special_skills_level.get(skillid);
                    if (skill.level > 200) {
                        setup.items["练习技能"]["items"][skillid] = {
                            name: skill.name,
                            callback: WG.default_lianxi_callback,
                        };
                    }
                }
                for (var [skillid, skill] of my_basic_skills) {
                    setup.items["练习技能"]["items"][skillid] = {
                        name: skill.name,
                        callback: WG.default_lianxi_callback,
                    };
                }

                return setup;
            },

        });
    });
})();