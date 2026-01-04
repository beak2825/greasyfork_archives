// ==UserScript==
// @name         wsmud_plugins日常一条龙
// @namespace    cqv
// @version      2.2
// @date         01/07/2018
// @modified     11/07/2018
// @homepage     https://greasyfork.org/zh-CN/scripts/370135
// @run-at       document-start
// @description  武神传说 MUD
// @author       fjcqv
// @match        http://game.wsmud.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/378008/wsmud_plugins%E6%97%A5%E5%B8%B8%E4%B8%80%E6%9D%A1%E9%BE%99.user.js
// @updateURL https://update.greasyfork.org/scripts/378008/wsmud_plugins%E6%97%A5%E5%B8%B8%E4%B8%80%E6%9D%A1%E9%BE%99.meta.js
// ==/UserScript==
(
    function () {
        'use strict';

        var kuanggao;
        var donext = "xuexi";
        var skills;
        var shifu;
        var next = 0;
        var roomData = [];
        var drop_list = [];
        var fenjie_list = [];
        var wudao_pfm = "1";
        var role;
        var heimingdan = new Array("枯荣大师","张无忌","天山童姥","木头人","首席弟子","门派后勤","峨眉大师姐","少林派大师兄","铜人");/////////////////////////叫杀时会略过这些目标
        var wkjy = 80;//////////是否挖矿判断值、是否使用指南
        var auto_pfm;
        var zdjn;
        var zdz;
        var wxjn;
        var wxz;
        var practice_skill = new Array("force","zixiashengong","sword","dodge","kuangfengkuaijian", "unarmed", "poyuquan");
        var practice_index = 0;
        var skill_limit = 930;
        var ckwp;
        var wdTCD;
        var ZhuiBuCD;
        var wdt_ceng = 70;
        var wdt_ceng_ms = 30;
        var zbindex = 0;
        var shouxi ={"丐帮":"丐帮-破庙密室","华山":"华山派-练武场","武当":"武当派-太子岩","峨眉":"峨眉派-广场","峨嵋":"峨眉派-广场","少林":"少林派-练武场","逍遥":"逍遥派-首席",};
        var roomItemSelectIndex = -1;
        var cnt = 0;
        var ch;
        var rwResult ="";
        var luj = new Array();;
        var i =0;
        var getboss;
        var fzkg=2;
        var BOSS;
        var ymBOSS;
        var xx =0;
        var myTime = new Array();
        var xtime = new Array();
        var ktime = new Array();
        var mingzi = new Array();
        var xuel = new Array();
        var smitem;
        var yaoyan;
        var ymrwlimit = 0;
        var zb_npc;
        var zb_place;
        var Doing = null;
        var autobusy;
        var autobusy_skill;
        var autofaint_skill;
        var family = "华山";
        var sm_loser = "开启";
        var in_setting = 0;
        var eqlist = {
            1: [],
            2: [],
            3: []
        };
        var skilllist = {
            1: [],
            2: [],
            3: []
        };
        var equip = {
            "铁镐": 0,
        };
        var npcs = {
            "店小二": 0
        };
        var goods = {
            //扬州城-醉仙楼-店小二
            "米饭": {
                "id": null,
                "sales": "店小二",
                place: "扬州城-醉仙楼"
            },
            "包子": {
                "id": null,
                "sales": "店小二",
                place: "扬州城-醉仙楼"
            },
            "鸡腿": {
                "id": null,
                "sales": "店小二",
                place: "扬州城-醉仙楼"
            },
            "面条": {
                "id": null,
                "sales": "店小二",
                place: "扬州城-醉仙楼"
            },
            "扬州炒饭": {
                "id": null,
                "sales": "店小二",
                place: "扬州城-醉仙楼"
            },
            "米酒": {
                "id": null,
                "sales": "店小二",
                place: "扬州城-醉仙楼"
            },
            "花雕酒": {
                "id": null,
                "sales": "店小二",
                place: "扬州城-醉仙楼"
            },
            "女儿红": {
                "id": null,
                "sales": "店小二",
                place: "扬州城-醉仙楼"
            },
            "醉仙酿": {
                "id": null,
                "sales": "店小二",
                place: "扬州城-醉仙楼"
            },
            "神仙醉": {
                "id": null,
                "sales": "店小二",
                place: "扬州城-醉仙楼"
            },
            //扬州城-杂货铺
            "布衣": {
                "id": null,
                "sales": "杂货铺老板 杨永福",
                place: "扬州城-杂货铺"
            },
            "钢刀": {
                "id": null,
                "sales": "杂货铺老板 杨永福",
                place: "扬州城-杂货铺"
            },
            "木棍": {
                "id": null,
                "sales": "杂货铺老板 杨永福",
                place: "扬州城-杂货铺"
            },
            "英雄巾": {
                "id": null,
                "sales": "杂货铺老板 杨永福",
                place: "扬州城-杂货铺"
            },
            "布鞋": {
                "id": null,
                "sales": "杂货铺老板 杨永福",
                place: "扬州城-杂货铺"
            },
            "铁戒指": {
                "id": null,
                "sales": "杂货铺老板 杨永福",
                place: "扬州城-杂货铺"
            },
            "簪子": {
                "id": null,
                "sales": "杂货铺老板 杨永福",
                place: "扬州城-杂货铺"
            },
            "长鞭": {
                "id": null,
                "sales": "杂货铺老板 杨永福",
                place: "扬州城-杂货铺"
            },
            "钓鱼竿": {
                "id": null,
                "sales": "杂货铺老板 杨永福",
                place: "扬州城-杂货铺"
            },
            "鱼饵": {
                "id": null,
                "sales": "杂货铺老板 杨永福",
                place: "扬州城-杂货铺"
            },

            //扬州城-打铁铺
            "铁剑": {
                "id": null,
                "sales": "铁匠铺老板 铁匠",
                place: "扬州城-打铁铺"
            },
            "钢刀": {
                "id": null,
                "sales": "铁匠铺老板 铁匠",
                place: "扬州城-打铁铺"
            },
            "铁棍": {
                "id": null,
                "sales": "铁匠铺老板 铁匠",
                place: "扬州城-打铁铺"
            },
            "铁杖": {
                "id": null,
                "sales": "铁匠铺老板 铁匠",
                place: "扬州城-打铁铺"
            },
            "飞镖": {
                "id": null,
                "sales": "铁匠铺老板 铁匠",
                place: "扬州城-打铁铺"
            },
            "铁镐": {
                "id": null,
                "sales": "铁匠铺老板 铁匠",
                place: "扬州城-打铁铺"
            },

            //扬州城-药铺
            "金创药": {
                "id": null,
                "sales": "药铺老板 平一指",
                place: "扬州城-药铺"
            },
            "引气丹": {
                "id": null,
                "sales": "药铺老板 平一指",
                place: "扬州城-药铺"
            },
            "养精丹": {
                "id": null,
                "sales": "药铺老板 平一指",
                place: "扬州城-药铺"
            },
        };
        var place = {
            "巨木旗": "go north;go west;go northwest;go north;go north;go north;go north;go west",
            "住房-花园": "jh fam 0 start;go west;go west;go north;go enter;go northeast",
            "住房-练功房": "jh fam 0 start;go west;go west;go north;go enter;go west",
            "扬州城-醉仙楼": "jh fam 0 start;go north;go north;go east",
            "扬州城-喜宴": "jh fam 0 start;go north;go north;go east;go up",
            "扬州城-武庙": "jh fam 0 start;go north;go north;go west",
            "扬州城-钱庄": "jh fam 0 start;go north;go west",
            "扬州城-杂货铺": "jh fam 0 start;go east;go south",
            "扬州城-打铁铺": "jh fam 0 start;go east;go east;go south",
            "扬州城-药铺": "jh fam 0 start;go east;go east;go north",
            "扬州城-衙门正厅": "jh fam 0 start;go west;go north;go north",
            "扬州城-矿山": "jh fam 0 start;go west;go west;go west;go west",
            "扬州城-药林": "jh fam 0 start;go east;go east;go east;go south",
            "扬州城-扬州武馆": "jh fam 0 start;go south;go south;go west",
            "帮会-练功房": "jh fam 0 start;go south;go south;go east;go east;go east;go north",
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
            "峨眉派-走廊1": "jh fam 4 start;go west;go south;go west",
            "峨眉派-休息室": "jh fam 4 start;go west;go south;go east;go south",
            "峨眉派-厨房": "jh fam 4 start;go west;go south;go east;go east",
            "峨眉派-练功房": "jh fam 4 start;go west;go south;go west;go west",
            "峨眉派-小屋": "jh fam 4 start;go west;go south;go west;go north;go north",
            "峨眉派-清修洞": "jh fam 4 start;go west;go south;go west;go south;go south",
            "峨眉派-大殿": "jh fam 4 start;go west;go south;go south",
            "峨眉派-睹光台": "jh fam 4 start;go northup",
            "峨眉派-华藏庵": "jh fam 4 start;go northup;go east",
            "逍遥派-青草坪": "jh fam 5 start",
            "逍遥派-首席": "jh fam 5 start;go west",
            "逍遥派-林间小道": "jh fam 5 start;go east",
            "逍遥派-林间小道1": "jh fam 5 start;go west",
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
            "襄阳城-广场": "jh fam 7 start",
            "武道塔": "jh fam 8 start"
        };
        Array.prototype.baoremove = function (dx) {
            if (isNaN(dx) || dx > this.length) {
                return false;
            }
            this.splice(dx, 1);
        }

        if (WebSocket) {
            console.log('插件可正常运行,Plugins can run normally');
            function show_msg(msg) {
                ws_on_message({
                    data: msg
                });

            }
            var _ws = WebSocket,
                ws, ws_on_message;
            unsafeWindow.WebSocket = function (uri) {
                ws = new _ws(uri);
            };
            unsafeWindow.WebSocket.prototype = {
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
                    ws.onmessage = WG.receive_message;
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
                    if (G.cmd_echo) {
                        show_msg('<hiy>' + text + '</hiy>');
                    }
                    ws.send(text);
                },
                close: function () {
                    ws.close();
                }
            };
        } else {
            console.log("插件不可运行,请打开'https://greasyfork.org/zh-CN/forum/discussion/41547/x',按照操作步骤进行操作,Plugins are not functioning properly.plase open https://greasyfork.org/zh-CN/forum/discussion/41547/x");
        }
        //快捷键功能
        var KEY = {
            init: function () {
                //添加快捷键说明
                $("span[command=showtool] span:eq(0)").html("C");
                $("span[command=pack] span:eq(0)").html("B");
                $("span[command=tasks] span:eq(0)").html("L");
                $("span[command=score] span:eq(0)").html("O");
                $("span[command=jh] span:eq(0)").html("J");
                $("span[command=skills] span:eq(0)").html("K");
                $("span[command=message] span:eq(0)").html("U");
                $("span[command=shop] span:eq(0)").html("P");
                $("span[command=stats] span:eq(0)").html("I");
                $("span[command=setting] span:eq(0)").html(",");
                this.do_command("showtool");
                this.do_command("showcombat");
                $(document).on("keydown", this.e);
            },

            e: function (event) {
                //快捷键绑定
                var ctrlKey = event.ctrlKey || event.metaKey;
                var altKey = event.altKey;
                 // 聊天模式单独处理
                if ($(".channel-box").is(":visible") || in_setting == 1) {
                    KEY.chatModeKeyEvent(event);
                    return;
                }
                if ($(".dialog-confirm").is(":visible") &&
                    ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)))
                    return;

                if ($('input').is(':focus') || $('textarea').is(':focus')) {

                    return;
                }
                switch (event.keyCode) {
                        //////////////////////////////
                        //         杂项
                        //////////////////////////////
                    case 27:
                        // ESC
                        KEY.dialog_close();
                        break;
                    case 192:
                        // `
                        $(".map-icon").click();
                        break;
                    case 32:
                        // Space
                        KEY.dialog_confirm();
                        break;
                        //////////////////////////////
                        //       命令栏控制
                        //////////////////////////////
                    case 83:
                        // S 连招二
                        WG.lianzhaoer();
                        break;
                    case 13:
                        // 回车 聊天
                        KEY.do_command("showchat");
                        return false;
                    case 65:
                        // A 连招一
                        WG.lianzhaoyi();
                        break;
                    case 67:
                        // C 打开工具框
                        KEY.do_command("showtool");
                        break;
                    case 66:
                        // B 打开背包
                        KEY.do_command("pack");
                        break;
                    case 76:
                        // L 打开任务
                        KEY.do_command("tasks");
                        break;
                    case 79:
                        // O 打开属性
                        KEY.do_command("score");
                        break;
                    case 74:
                        // J 江湖
                        KEY.do_command("jh");
                        break;
                    case 75:
                        // K 技能
                        KEY.do_command("skills");
                        break;
                    case 73:
                        // Q 任务
                        KEY.do_command("stats");
                        break;
                    case 85:
                        // U 消息
                        KEY.do_command("message");
                        break;
                    case 80:
                        // P 商城
                        KEY.do_command("shop");
                        break;
                    case 188:
                        // , 设置
                        KEY.do_command("setting");
                        break;
                    case 81:
                        // Q 门派任务
                        WG.go_family();
                        break;
                    case 87:
                        // W 自动门派任务
                        WG.auto_family_task();
                        break;
                    case 69:
                        // E,一键追捕
                        WG.go_yamen_task();
                        break;
                    case 68:
                        // D 一键击杀
                        WG.kill_all();
                        break;
                    case 70:
                        // F, 一键拾取
                        WG.get_all();
                        break;
                    case 71:
                        // G, 挖矿
                        WG.zdwk();
                        break;
                    case 82:
                        // R, 疗伤
                        WG.liaoshang();
                        break;
                    case 84:
                        // T, 练习技能
                        WG.xuejineng();
                        break;
                        //////////////////////////////
                        //         动作栏控制
                        // 无修饰键：个人房间动作
                        // Alt 键：个人命令动作
                        // Crtl 键：房间人物列表动作
                        //////////////////////////////
                    case 49:
                        // 1
                        if (altKey) {
                            KEY.onRoomItemAction(0);
                        } else if (ctrlKey) {
                            KEY.room_commands(0);
                        } else {
                            KEY.combat_commands(0);

                        }
                        return false;
                    case 50:
                        // 2
                        if (altKey) {
                            KEY.onRoomItemAction(1);
                        } else if (ctrlKey) {
                            KEY.room_commands(1);
                        } else {
                            KEY.combat_commands(1);

                        }
                        return false;
                    case 51:
                        // 3
                        if (altKey) {
                            KEY.onRoomItemAction(2);
                        } else if (ctrlKey) {
                            KEY.room_commands(2);
                        } else {
                            KEY.combat_commands(2);

                        }
                        return false;
                    case 52:
                        // 4
                        if (altKey) {
                            KEY.onRoomItemAction(3);
                        } else if (ctrlKey) {
                            KEY.room_commands(3);
                        } else {
                            KEY.combat_commands(3);

                        }
                        return false;
                    case 53:
                        // 5
                        if (altKey) {
                            KEY.onRoomItemAction(4);
                        } else if (ctrlKey) {
                            KEY.room_commands(4);
                        } else {
                            KEY.combat_commands(4);

                        }
                        return false;
                        //////////////////////////////
                        //       房间人物控制
                        //////////////////////////////
                    case 9:
                        // Tab
                        KEY.onRoomItemSelect();
                        return false;
                        //////////////////////////////
                        //         地图控制
                        //////////////////////////////
                    case 38:
                        // Up Arrow
                        WG.Send("go north");
                        KEY.onChangeRoom();
                        break;
                    case 37:
                        // Left Arrow
                        WG.Send("go west");
                        KEY.onChangeRoom();
                        break;
                    case 39:
                        // Right Arrow
                        WG.Send("go east");
                        KEY.onChangeRoom();
                        break;
                    case 40:
                        // Down Arrow
                        WG.Send("go south");
                        KEY.onChangeRoom();
                        break;
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
                    case 70:
                        // F
                        if (event.altKey) {
                            KEY.dialog_close();
                        }
                        break;
                    case 13:
                        // Enter
                        if ($(".sender-box").val().length){
                            $(".sender-btn").click();}
                        else {KEY.dialog_close();}
                        break;
                }
            },
            onChangeRoom: function () {
                roomItemSelectIndex = -1;
            },
            onRoomItemSelect: function () {
                if (roomItemSelectIndex != -1) {
                    $(".room_items div.room-item:eq(" + roomItemSelectIndex + ")").css("background", "#000");
                }
                roomItemSelectIndex = (roomItemSelectIndex + 1) % $(".room_items div.room-item").length;
                var curItem = $(".room_items div.room-item:eq(" + roomItemSelectIndex + ")");
                curItem.css("background", "#444");
                curItem.click();
            },
            onRoomItemAction: function (index) {
                //NPC下方按键
                $(".room_items .item-commands span:eq(" + index + ")").click();
            },
        }
        function messageClear() {
            $(".content-message pre").html("");
        }
        function messageAppend(m,c) {
            if(m == undefined){return}
            if(typeof(m) == "number"){m = m.toString()}
            if(c == undefined){
                $(".content-message pre").append(m.concat("<br>"));
            }
            else if(c == 1){
                var text = "<hic>".concat(m).concat("</hic><br>")
                $(".content-message pre").append(text);
            }
            else if(c == 2){
                text = "<hir>".concat(m).concat("</hir><br>")
                $(".content-message pre").append(text);
            }
        }
        function tip(t) {
            $(".WG_Tip").html(t);
        }
        function shuxing(name,xue)
        {
            this.name=name;
            this.xue=xue;
        }
        function contains(arr,str){
            if(arr == undefined){
                return false;
            }
            for(var j = 0;j < arr.length;j++){
                if(arr[j] == str){
                    return true;
                }
            }
            return false;
        }
        var WG = {
            init: function () {
                $("li[command=SelectRole]").on("click", function () {
                    WG.login();
                });
                $(".bottom-bar").append("<span class='item-commands' style='display:none'><span WG='WG' cmd=''></span></span>"); //命令行模块
                //$(".bottom-bar span:eq(2)").after("<span class='tool-item' style='line-height:17px;vertical-align:top;color:white'><span class='fuzhucaidan'>☆</br>辅助</span></span>");
                var t;
                $(".content-message").after("<div class='fuzhuanjian' style='width:48%;right:45px;margin-bottom:-2em;'>" + "提示： <span class='WG_Tip'></span><br>" +"<span class='zdy-item liaoshang'>疗伤(R)</span>" + "<span class='zdy-item wkzidong'>挖矿(G)</span>"+ "<span class='zdy-item cangku'>仓库</span>" + "<span class='zdy-item go_family'>师门(Q)</span>" + "<span class='zdy-item allStop'>停</span>" + "</div>");
                var css = `.zdy-item{
display:inline-block; border:solid 1px gray; color:gray; background-color:black;
text-align:left; cursor:pointer; border-radius:0.4em; min-width:3.5em; margin-right:0.5em; color:yellow;
margin-left:0.4em; position:relative; padding-left:0.4em; padding-right:0.4em; line-height:1.5em;}
.item-plushp{display: inline-block;float: right;width: 120px;text-align: right}
.item-dps{display: inline-block;float: left;width: 100px;text-align: right}`;
                GM_addStyle(css);
                $(".go_family").on("click", WG.go_family);
                $(".tongJ").on("click", WG.tongJ);
                $(".fuzhucaidan").on("click", WG.fzkg);
                $(".check_lianxi_auto").on("click", WG.check_lianxi_auto);
                $(".check_dazuo_auto").on("click", WG.check_dazuo_auto);
                $(".allStop").on("click", WG.allStop);
                $(".getAllid").on("click", WG.getAllid);
                $(".go_yamen_task").on("click", WG.go_yamen_task);
                $(".lianzhaoyi").on("click", WG.lianzhaoyi);
                $(".lianzhaoer").on("click", WG.lianzhaoer);
                $(".wuxingzhuang").on("click", WG.wuxingzhuang);
                $(".zhandouzhuang").on("click", WG.zhandouzhuang);
                $(".wudang").on("click", WG.wudang);
                $(".shaolin").on("click", WG.shaolin);
                $(".emei").on("click", WG.emei);
                $(".huashan").on("click", WG.huashan);
                $(".xiaoyao").on("click", WG.xiaoyao);
                $(".gaibang").on("click", WG.gaibang);
                $(".kill_all").on("click", WG.kill_all);
                $(".wdT").on("click", WG.wdT);
                $(".get_all").on("click", WG.get_all);
                $(".liaoshang").on("click", WG.liaoshang);
                $(".cangku").on("click", WG.cangku);
                $(".sell_all").on("click", WG.sell_all);
                $(".wkzidong").on("click", WG.wkzidong);
                $(".qiandao").on("click", WG.qiandao);
            },
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
            login: function () {
                role = $('.role-list .select').text().split(/[\s\n]/).pop();
                npcs = GM_getValue("npcs", npcs);
                kuanggao = GM_getValue(role + "_kuanggao", kuanggao);
                equip = GM_getValue(role + "_equip", equip);
                skilllist = GM_getValue(role + "_skilllist", skilllist);
                family = GM_getValue(role + "_family", family);
                eqlist = GM_getValue(role + "_eqlist", eqlist);
                sm_loser = GM_getValue(role + "_sm_loser", sm_loser);
                ymrwlimit = GM_getValue(role + "_ymrwlimit", ymrwlimit);
                skill_limit = GM_getValue(role + "_skill_limit", skill_limit);
                shifu = GM_getValue(role + "_shifu", shifu);
                practice_skill = GM_getValue(role + "_practice_skill", practice_skill);
                ckwp = GM_getValue(role + "_ckwp", ckwp);
                if(eqlist[1] != ""){weapon = eqlist[1][0].id};
                setTimeout(() => {
                    var logintext = '';
                    document.title = role + "-MUD游戏-武神传说";
                    if (WebSocket) {
                        if (family == null) {
                            logintext = `
<hiy>欢迎${role},插件已加载！请设置门派
插件版本: ${GM_info.script.version}
</hiy>`;
                        } else {
                            logintext = `
<hiy>欢迎${role},插件已加载！
插件版本: ${GM_info.script.version}
</hiy>`;
                        }
                    } else {
                        logintext = `
<hiy>欢迎${role},插件未正常加载！
当前浏览器不支持自动喜宴自动boss,请使用火狐浏览器或QQ浏览器
谷歌系浏览器,请在network中勾选disable cache,多刷新几次,直至提示已加载!
插件版本: ${GM_info.script.version}
</hiy>`;
                    }
                    messageAppend(logintext);
                    KEY.do_command("showtool");
                    KEY.do_command("skills");
                    KEY.do_command("skills");
                    KEY.do_command("score")
                    KEY.do_command("showcombat");
                    WG.dingshi_rw();
                }, 1000);
            },
            setting: function () {
                in_setting = 1;
                messageClear();
                var a = `<div style='text-align:right;width:400px'>
<span>
<label for="family">门派选择：</label><select style='width:80px' id="family">
<option value="武当">武当</option>
<option value="华山">华山</option>
<option value="少林">少林</option>
<option value="峨眉">峨眉</option>
<option value="逍遥">逍遥</option>
<option value="丐帮">丐帮</option>
<option value="武馆">武馆</option>
</select>

<span><label for="auto_pfm">连招一： </label><input style='width:300px' type="text" id="auto_pfm" name="auto_pfm" value=""></span>

<span><label for="practice_skill">练功技能： </label><input style='width:300px' type="text" id="practice_skill" name="practice_skill" value=""></span>
<span><label for="biguan_room">闭关地点： </label><input style='width:80px' type="text" id="biguan_room" name="biguan_room" value=""><label for="skill_limit">练功上限： </label><input style='width:80px' type="text" id="skill_limit" name="skill_limit" value=""></span>

<span><label for="ZhuiBuCD">追捕冷却： </label><input style='width:80px' type="text" id="ZhuiBuCD" name="ZhuiBuCD" value="">&nbsp<label for="wdTCD">打塔冷却： </label><input style='width:80px' type="text" id="wdTCD" name="wdTCD" value=""></span>

<span><label for="ymrwlimit">衙门任务放弃： </label><input style='width:50px' type="text" id="ymrwlimit" name="ymrwlimit" value="">&nbsp<label for="sm_loser">师门自动放弃： </label><select style='width:50px' id = "sm_loser">
<option value="关闭">关闭</option>
<option value="开启">开启</option>
</select>
<label for="ckwp">师门遇到以下物品去仓库取（物品中文名）： </label>
<input style='width:350px' type="text" id="ckwp" name="ckwp" value=""></span>
</span>
</span>
<div class="item-commands"><span class="updete_id_all">更新所有ID</span><span class="setting_over">完成设置</span></div>
</div>
`;
                messageAppend(a);
                $('#family').val(family);
                $("#family").change(function () {
                    family = $("#family").val();
                    GM_setValue(role + "_family", family);
                });
                $('#sm_loser').val(sm_loser);
                $('#sm_loser').focusout(function () {
                    sm_loser = $('#sm_loser').val();
                    GM_setValue(role + "_sm_loser", sm_loser);
                });
                $('#auto_pfm').val(auto_pfm);
                $('#auto_pfm').focusout(function () {
                    auto_pfm = $('#auto_pfm').val();
                    GM_setValue(role + "_auto_pfm", auto_pfm);
                });
                $('#practice_skill').val(practice_skill);
                $('#practice_skill').focusout(function () {
                    practice_skill = $('#practice_skill').val().split(',');
                    GM_setValue(role + "_practice_skill", practice_skill);
                });
                $('#skill_limit').val(skill_limit);
                $('#skill_limit').focusout(function () {
                    skill_limit = $('#skill_limit').val();
                    GM_setValue(role + "_skill_limit", skill_limit);
                });
                $('#wdt_ceng').val(wdt_ceng);
                $('#wdt_ceng').focusout(function () {
                    wdt_ceng = $('#wdt_ceng').val();
                    GM_setValue(role + "_wdt_ceng", wdt_ceng);
                });
                $('#wdt_ceng_ms').val(wdt_ceng_ms);
                $('#wdt_ceng_ms').focusout(function () {
                    wdt_ceng_ms = $('#wdt_ceng_ms').val();
                    GM_setValue(role + "_wdt_ceng_ms", wdt_ceng_ms);
                });
                $('#ZhuiBuCD').val(ZhuiBuCD);
                $('#ZhuiBuCD').focusout(function () {
                    ZhuiBuCD = $('#ZhuiBuCD').val();
                    GM_setValue(role + "_ZhuiBuCD", ZhuiBuCD);
                });
                $('#wdTCD').val(wdTCD);
                $('#wdTCD').focusout(function () {
                    wdTCD = $('#wdTCD').val();
                    GM_setValue(role + "_wdTCD", wdTCD);
                });
                $('#ymrwlimit').val(ymrwlimit);
                $('#ymrwlimit').focusout(function () {
                    ymrwlimit = $('#ymrwlimit').val();
                    GM_setValue(role + "_ymrwlimit", ymrwlimit);
                });
                $('#ckwp').val(ckwp);
                $('#ckwp').focusout(function () {
                    ckwp = $('#ckwp').val();
                    if(ckwp.indexOf(",") != -1){
                        ckwp = ckwp.split(",")
                    }
                    else if(ckwp.indexOf("，") != -1){
                        ckwp = ckwp.split("，")
                    }
                    else{
                        ckwp = "物品,".concat(ckwp).split(",")
                    }
                    GM_setValue(role + "_ckwp", ckwp);
                });
                $(".updete_id_all").on("click", WG.getAllid);
                $(".setting_over").on("click", WG.setting_over);
            },
            setting_over: function () {
                in_setting = 0;
                messageClear();
            },
            hooks: [],
            hook_index: 0,
            add_hook: function (types, fn) {
                var hook = {
                    'index': WG.hook_index++,
                    'types': types,
                    'fn': fn
                };
                WG.hooks.push(hook);
                return hook.index;
            },
            remove_hook: function (hookindex) {
                var that = this;
                console.log("remove_hook");
                for (var i = 0; i < that.hooks.length; i++) {
                    if (that.hooks[i].index == hookindex) {
                        that.hooks.baoremove(i);
                    }
                }
            },
            run_hook: function (type, data) {
                //console.log(data);
                for (var i = 0; i < this.hooks.length; i++) {
                    // if (this.hooks[i] !== undefined && this.hooks[i].type == type) {
                    //     this.hooks[i].fn(data);
                    // }
                    var listener = this.hooks[i];
                    if (listener.types == data.type || (listener.types instanceof Array && $
                                                        .inArray(data.type, listener.types) >= 0)) {
                        listener.fn(data);
                    }
                }
            },
            receive_message: function (msg) {
                ws_on_message.apply(this, arguments);
                if (!msg || !msg.data) return;
                var data;
                if (msg.data[0] == '{' || msg.data[0] == '[') {
                    var func = new Function("return " + msg.data + ";");
                    data = func();
                } else {
                    data = {
                        type: 'text',
                        msg: msg.data
                    };
                }
                WG.run_hook(data.type, data);
            },
            fzkg: function () {
                fzkg++;
                if(fzkg%2==1){ $(".fuzhuanjian").hide();$(".content-message").attr("style","margin-bottom:-2.4em")}
                else{$(".fuzhuanjian").show();$(".content-message").attr("style","margin-bottom:0em")}
            },
            updete_goods_id: function () {
                var lists = $(".dialog-list .obj-list:first");
                var id;
                var name;
                $(".content-message pre").html("");
                if (lists.length) {
                    messageAppend("检测到商品清单\n");
                    for (var a of lists.children()) {
                        a = $(a);
                        id = a.attr("obj");
                        name = $(a.children()[0]).html();
                        console.log(name + ":" + id);
                        goods[name].id = id;
                        messageAppend(name + ":" + id + '\n');
                    }
                    GM_setValue("goods", goods);
                } else {
                    messageAppend("未检测到商品清单\n");
                }
            },
            updete_npc_id: function () {
                var lists = $(".room_items .room-item");
                $(".content-message > pre").html("");

                for (var npc of lists) {
                    if (npc.lastElementChild.lastElementChild == null) {
                        npcs[npc.lastElementChild.innerText] = $(npc).attr("itemid");
                        messageAppend(npc.lastElementChild.innerText + " 的ID:" + $(npc).attr("itemid") + "\n");
                    }
                }
                GM_setValue("npcs", npcs);
            },
            getAllid: function(){
                in_setting = 0;
                clearTimeout(xtime[0]);
                var room =$(".room-title span.room-name").text();
                WG.go("扬州城-杂货铺");
                xtime[0] = setTimeout(function(){WG.getAllids();}, 600);
                xtime[0] = setTimeout(function(){WG.updete_goods_id();WG.Send("go north;go east;go north")}, 1200);
                xtime[0] = setTimeout(function(){WG.getAllids();}, 1800);
                xtime[0] = setTimeout(function(){WG.updete_goods_id();WG.Send("go south;go south")}, 2400);
                xtime[0] = setTimeout(function(){WG.getAllids();}, 3000);
                xtime[0] = setTimeout(function(){WG.updete_goods_id();WG.go("扬州城-醉仙楼")}, 3600);
                xtime[0] = setTimeout(function(){WG.getAllids();}, 4200);
                xtime[0] = setTimeout(function(){WG.updete_goods_id();WG.go(room);for(xx in xtime){clearTimeout(xtime[xx])}}, 4800);
            },
            getAllids: function(){
                WG.updete_npc_id();
                WG.Send("list "+$(".room_items .room-item:first").next().attr("itemid"));
            },

            Send: function (cmd) {
                console.log(cmd);
                cmd=cmd.split(";");
                for(var c of cmd){
                    $("span[WG='WG']").attr("cmd", c).click();
                };
            },
            go: function (p) {
                if(WG.at(p)) {return;};
                if (place[p] != undefined) WG.Send(place[p]);
            },
            at: function (p) {
                var w = $(".room-name").html();
                return w.indexOf(p) == -1 ? false : true;
            },
            dingshi_rw: function(){
                var time = new Date();
                var hour = time.getHours();
                var minute = time.getMinutes();
                if(hour == 7 && minute == 0){
                    WG.go_family()
                }
                var message = $(".content-message pre").text();
                var offline = "你的连接中断了"
                if(message.indexOf(offline) != -1){
                    messageClear();
                    setTimeout(function(){WG.Send("wa") },1000);
                }
                setTimeout(function(){ WG.dingshi_rw(); },60000);
            },
            go_family: function () {
                //family = $('.room_items .room-item:first .item-name').text().substr(0, 2);//无门派，提取门派
                WG.Send("stopstate");
                if(goods["飞镖"].id == null){goods = GM_getValue("goods", goods)}
                switch (family) {
                    case '武当':
                        WG.go("武当派-三清殿");
                        WG.sm("武当派第二代弟子 武当首侠 宋远桥");
                        break;
                    case '华山':
                        WG.go("华山派-镇岳宫");
                        WG.sm("市井豪杰 高根明");
                        break;
                    case '少林':
                        WG.go("少林派-天王殿");
                        WG.sm("少林寺第三十九代弟子 道觉禅师");
                        break;
                    case '逍遥':
                        WG.go("逍遥派-青草坪");
                        WG.sm("聪辩老人 苏星河");
                        break;
                    case '丐帮':
                        WG.go("丐帮-树洞下");
                        WG.sm("丐帮七袋弟子 左全");
                        break;
                    case '峨眉':
                        WG.go("峨眉派-大殿");
                        WG.sm("峨嵋派第四代弟子 静心");
                        break;
                    case '武馆':
                        WG.go("扬州城-扬州武馆");
                        WG.sm("武馆教习");
                        break;
                    default:
                        tip("请在设置中设定门派")
                        break;
                }
            },
            sm: function (master) {
                clearTimeout(xtime[6]);
                xtime[6] = setTimeout(function(){
                    WG.updete_npc_id();
                    master = npcs[master];
                    if(master.length != 11){WG.sm(master);return;}
                    messageClear();
                    WG.Send("task sm " + master);
                    WG.getsm(master);
                },1000)
            },
            getsm: function (master) {
                clearTimeout(xtime[6]);
                xtime[6] = setTimeout(function(){
                    //获取师门任务物品
                    var item = $("span[cmd$='giveup']:last").parent().prev();
                    if (item.length == 0) {
                        var message = $(".content-message pre").text();
                        if(message.indexOf("对你点头道：辛苦了， 你先去休息一下吧") != -1){
                            rwResult =rwResult.concat("师门任务20/20,")
                            tip("师门任务已完成，3秒后自动开始衙门任务")
                            xtime[6] = setTimeout(function(){WG.yangjingdan();},3000);
                            return;
                        }
                        else{
                            WG.Send("task sm " + master);
                            WG.getsm(master);
                            return;
                        }
                    };
                    item = item.html();
                    //能上交直接上交
                    var tmpObj = $("span[cmd$='giveup']:last").prev();
                    for (let i = 0; i < 6; i++) {
                        if (tmpObj.children().html() == item) {
                            tmpObj.click();
                            //messageAppend("自动上交" + item);
                            setTimeout(function(){ WG.go_family(); },100)
                            return;
                        }
                        tmpObj = tmpObj.prev();
                    }
                    WG.gosm(master,item);
                },1000)
            },
            gosm: function (master,smitem) {
                clearTimeout(xtime[6]);
                for(xx in ckwp){
                    if(smitem == ckwp[xx]){
                        WG.ckqu(smitem);
                        return;
                    }
                }
                var good = goods[smitem];
                if (good != undefined) {
                    tip("自动购买" + smitem);
                    WG.go(good.place);
                    xtime[6] = setTimeout(function(){ WG.buy(good); },1000)
                    return;
                }
                tip("无法自动购买" + smitem);
                if(sm_loser == "开启"){WG.Send("task sm "+master+" giveup");WG.go_family();}
            },
            ckqu: function (good) {
                clearTimeout(xtime[6]);
                WG.cangku();
                xtime[6] = setTimeout(function(){
                    $(".obj-item").each(function(){
                        if($(this).text().indexOf(good) != -1){
                            var id = $(this).attr("obj")
                            WG.Send("qu 1 "+id);
                        }
                    })
                    WG.go_family();
                },1000)
            },
            buy: function (good) {
                var tmp = npcs[good.sales];
                //WG.Send("list " + tmp);
                WG.Send("buy 1 " + good.id + " from " + tmp);
                xtime[6] = setTimeout(function(){WG.go_family(); },1000)
            },
            qiandao: function () {
                WG.Send("stopstate");
                WG.Send("taskover signin");
                WG.go(shouxi[family]);
                xtime[4] = setTimeout(function(){
                    messageClear();
                    var lists = $(".room_items .room-item");
                    for (var npc of lists) {
                        if (npc.innerText.indexOf("首席") != -1 || npc.innerText.indexOf("大师兄") != -1 || npc.innerText.indexOf("大师姐") != -1) {
                            WG.Send("ask2 "+ $(npc).attr("itemid"));
                        }
                    }
                },1000);
                xtime[4] = setTimeout(function(){
                    if($(".content-message pre").text().indexOf("恭恭敬敬的一鞠躬")!=-1){ rwResult =rwResult.concat("请安完成。")}
                },1100);
            },
            eq: function (e) {
                WG.Send("eq " + equip[e]);
            },
            ask: function (n,npc) {
                WG.updete_npc_id();
                npc = npcs[npc];
                WG.Send("ask"+n+" "+npc);
            },
            go_yamen_task: function () {
                WG.allStop();
                WG.zhandouzhuang();
                xtime[0] = setTimeout(function(){WG.go("扬州城-衙门正厅");}, 1000);
                xtime[0] = setTimeout(WG.getTask, 3800);
            },
            getTask: function () {
                WG.ask(1,"扬州知府 程药发");
                xtime[0] = setTimeout(WG.ask(2,"扬州知府 程药发"), 1000);
                xtime[1] = setTimeout(WG.ask(3,"扬州知府 程药发"), 2000);
                xtime[2] = setTimeout(function(){WG.learn_skill();}, 20000);
            },
            /////////////////////////////
            //////////////////////////////
            //////   自动挖矿练习   /////
            ////////////////////////////

            wkzidong: function (){
                //$(".channel pre hir").text("");
                //$(".content-message pre hig").text("");
                WG.allStop();
                Doing = "挖矿"
                xx=0;
                WG.zdwk();
            },
            checkZT:function() {
                clearTimeout(xtime[3]);
                var xue =$("div.progress-bar:first").attr("style");
                xue = xue.substr(6,4);
                xue = parseInt(xue);
                if(xue > 99){
                    xtime[3] =setTimeout(function(){WG.zdwk(); }, 2000);
                }
                else{
                    xtime[3] =setTimeout(function(){WG.checkZT(); }, 2000);
                }
            },
            allStop: function () {
                WG.Send("stopstate");
                Doing = null;
                practice_index = 0;
                for(xx in xtime){clearTimeout(xtime[xx])};
                for(xx in ktime){clearTimeout(ktime[xx])};
                for(xx in myTime){clearTimeout(myTime[xx])};
                ktime[6]= setTimeout(function(){clearTimeout(ktime[6]);tip("已重置所有计时器");},3000)
            },
            /////////////////////////////////////////
            /////////////////////////////////////////

            kill_all: function () {
                var lists = $(".room_items .room-item");
                var dontkill = 0;
                for (var npc of lists) {
                    if($(npc).attr("itemid") == G.id){
                        dontkill = 1;
                    }
                    else{
                        for(xx in heimingdan){
                            if (npc.innerText.indexOf(heimingdan[xx]) != -1) {
                                dontkill = 1;
                            }
                        }
                    }
                    if(dontkill == 0){
                        WG.Send("kill " + $(npc).attr("itemid"));
                    }
                    else{
                        dontkill = 0
                    }
                }
            },

            get_all: function () {
                var lists = $(".room_items .room-item");
                if(BOSS != null){
                    for (var npc of lists) {
                        if(npc.innerText.indexOf(zb_npc) != -1){
                            WG.Send("get all from " + $(npc).attr("itemid"));
                            return;
                        }
                    }
                }
                else{
                    for (npc of lists) {
                        WG.Send("get all from " + $(npc).attr("itemid"));
                    }
                }
            },
            wuxingzhuang: function () {
                WG.Send("stopstate");
            },
            zhandouzhuang: function () {
                WG.Send("stopstate");
            },
            wudang: function () {
                WG.Send("stopstate");
                WG.go("武当派-林间小径");
            },
            shaolin: function () {
                WG.Send("stopstate");
                WG.go("少林派-后殿");
            },
            emei: function () {
                WG.Send("stopstate");
                WG.Send("jh fam 4 start;go west;go south;go west");
            },
            huashan: function () {
                WG.Send("stopstate");
                WG.go("华山派-落雁峰");
                setTimeout(function(){WG.learn("风清扬","kuangfengkuaijian")}, 1500);
            },
            gaibang: function () {
                WG.Send("stopstate");
                WG.go("丐帮-破庙密室");
                WG.Send("go east");
            },
            xiaoyao: function () {
                WG.Send("stopstate");
                WG.go("逍遥派-地下石室");
            },
            learn:function(master,skill){
                var roomlist = $(".room_items .room-item");
                for (var fubennpc of roomlist) {
                    if (fubennpc.innerText.indexOf(master) != -1) {
                      var target = $(fubennpc).attr("itemid");
                        messageAppend("xue "+skill+" from "+target+"<br>")
                        WG.Send("xue "+skill+" from "+target)
                    }
                }
            },
            sell_all: function () {
                WG.Send("stopstate");
                WG.go("扬州城-打铁铺");
                WG.Send("sell all");
            },
            liaoshang: function () {
                WG.Send("stopstate");
                WG.go("扬州城-武庙");
                WG.Send("liaoshang");
            },
            cangku: function () {
                WG.Send("stopstate");
                WG.go("扬州城-钱庄");
                WG.Send("store");
            },
            zdwk: function () {
                WG.Send("stopstate");
                WG.go("扬州城-矿山");
                WG.Send("wa");
            },
            yangjingdan:function(){
                KEY.do_command("pack");
                KEY.do_command("pack");
                xtime[0] =setTimeout(function(){ WG.fenjie_zhuangbei(); }, 2000);
            },
            //分解背包中的蓝绿鲲鹏装备
            fenjie_zhuangbei:function(){
                clearTimeout(xtime[114]);
                var eqname = $(".obj-list .obj-item:eq("+zbindex+")").html();
                if(eqname != ""){
                    if(eqname.indexOf("养精丹") != -1 || eqname.indexOf("培元丹") != -1 || eqname.indexOf("朱果") != -1 || eqname.indexOf("潜灵果") != -1 || eqname.indexOf("突破丹") != -1 || eqname.indexOf("顿悟丹") != -1){
                        $(".obj-list .obj-item:eq("+zbindex+")").click()
                        var eqid=$(".obj-list .obj-item:eq("+zbindex+") span.item-commands span:eq(2)").attr("cmd").split(/[\s\n]/).pop(); //获取装备ID
                        WG.Send("use "+eqid)
                        xtime[0] = setTimeout(function(){WG.fenjie_zhuangbei();}, 500);
                    }
                    else{
                        zbindex++;
                        xtime[0] = setTimeout(function(){WG.fenjie_zhuangbei();}, 500);
                    }
                }
                else{
                    tip("吃完养精丹");
                    //KEY.do_command("pack");
                    xtime[0] = setTimeout(function(){WG.auto_fuben1();}, 5000);
                    zbindex = 0;
                }

            },
            //拜师指定中文名的NPC
            baishi:function(name){
                var npc_id = "";
                roomData.forEach(function(v,k){
                    if(v.name.indexOf(name) != -1){
                        npc_id = v.id
                    }
                })
                WG.Send("bai "+npc_id)
                shifu = name;
                GM_setValue(role + "_shifu", shifu);
            },
            learn_skill:function(){
                WG.Send("stopstate");
                WG.Send("cha")
                //KEY.do_command("score")
                var item = undefined;
                xtime[0] = setTimeout(function(){
                    switch(shifu){
                        case undefined:
                            WG.go("华山派-镇岳宫")
                            setTimeout(function(){WG.baishi("高根明");practice_index = 0}, 1000);
                            setTimeout(function(){WG.learn_skill()}, 2000);
                            return;
                        case "高根明":
                            item = G.skill_list.get("huashanjianfa")
                            //alert(typeof(item))
                            if(item != undefined){
                                if(item.level >= 100){
                                    WG.go("华山派-客厅")
                                    setTimeout(function(){WG.baishi("岳不群");practice_index = 0}, 1000);
                                    setTimeout(function(){WG.learn_skill()}, 2000);
                                    return
                                }
                            }
                            practice_skill = ["force","sword","dodge","unarmed", "parry","huashanxinfa","huashanjianfa"]
                            WG.go("华山派-镇岳宫");
                            break;
                        case "岳不群":
                            item = G.skill_list.get("poyuquan")
                            if(item){
                                if(item.level >= 500){
                                    WG.go("华山派-林间小屋")
                                    setTimeout(function(){WG.baishi("封不平");practice_index = 0}, 1000);
                                    setTimeout(function(){WG.learn_skill()}, 2000);
                                    return
                                }
                            }
                            practice_skill = ["force","sword","huashanjianfa","dodge","unarmed", "parry","zixiashengong","poyuquan"]
                            WG.go("华山派-客厅");
                            break;
                        case "封不平":
                            item = G.skill_list.get("kuangfengkuaijian")
                            if(item){
                                if(item.level >= 500){
                                    WG.go("华山派-落雁峰")
                                    setTimeout(function(){WG.baishi("风清扬");practice_index = 0}, 1000);
                                    setTimeout(function(){WG.learn_skill()}, 2000);
                                    return
                                }
                            }
                            practice_skill = ["kuangfengkuaijian"]
                            WG.go("华山派-林间小屋");
                            break;
                        case "风清扬":
                            item = G.skill_list.get("poyuquan")
                            if(item){
                                if(item.level >= 800){
                                    practice_skill = ["force","zixiashengong"]
                                    practice_index = 0
                                    WG.practice_skill();
                                    return
                                }
                            }
                            practice_skill = ["force","sword","dodge","unarmed", "parry","zixiashengong", "kuangfengkuaijian", "poyuquan"]
                            WG.go("华山派-落雁峰");
                            break;
                    }
                }, 1000);
                setTimeout(function(){WG.learn_skill1()}, 2000);

            },
            learn_skill1:function(){
                Doing = "学习"
                if(practice_skill[practice_index] == "huashanjianfa"){
                    let item = G.skill_list.get("huashanjianfa")
                    if(item){
                        if(item.level >= 200){
                            practice_index ++
                        }
                    }
                };
                if(practice_skill[practice_index] == undefined){
                    WG.auto_dazuo();
                    return;
                }

                WG.learn(shifu, practice_skill[practice_index]);
            },
            levelup:function(){
                WG.Send("jh fam 0 start")
                var npc_id = "";
                roomData.forEach(function(v,k){
                    if(v.name.indexOf("金古易") != -1){
                        npc_id = v.id
                    }
                })
                WG.Send("levelup "+npc_id)
            },
            //打坐
            auto_dazuo: function(){
                clearTimeout(xtime[0]);
                WG.Send("stopstate");
                Doing = "打坐";
                WG.go("住房-练功房");//去豪宅练功房练功，如果1秒后发现不在练功房而在卧室说明没有豪宅则去帮会练功房
                xtime[0] = setTimeout(function(){
                    if(!WG.at("住房-卧室")){
                        WG.go("帮会-练功房");
                    }
                }, 1000);
                xtime[0] = setTimeout(function(){WG.Send("dazuo");}, 2000);
            },
            //练习个人数据中设置的技能，挨个查看每个技能是否达到接近上限的整百级或者达到上限
            practice_skill: function(){
                clearTimeout(xtime[0]);
                WG.Send("stopstate;cha");
                Doing = "练功";
                tip("去豪宅练功房练功，没有豪宅则会自动去帮会练功房");
                WG.go("住房-练功房");//去豪宅练功房练功，如果1秒后发现不在住宅练功房则去帮会练功房
                xtime[0] = setTimeout(function(){
                    if(!WG.at("住房-练功房")){
                        WG.go("帮会-练功房");
                        setTimeout(function(){WG.wuxingzhuang();}, 3500);
                        setTimeout(function(){WG.practice_skill2();}, 5000);
                    }
                    else{
                        setTimeout(function(){WG.wuxingzhuang();}, 1000);
                        setTimeout(function(){WG.practice_skill2();}, 4000);
                    }
                }, 1000);
            },
            practice_skill2:function(){
                clearTimeout(xtime[0]);
                //如果当前要修炼的技能已经修炼到上限，则换下一个技能
                if(WG.lx_check_skill(practice_skill[practice_index])){
                    practice_index++;
                    xtime[0] = setTimeout(function(){WG.practice_skill2();}, 200);
                    return;
                }
                if(practice_skill[practice_index]==undefined){
                    tip("所有技能都已经修炼完成")
                    xtime[0] = setTimeout(function(){
                        WG.Send("dazuo");
                    }, 3000)
                    return;
                }
                WG.Send("lianxi "+practice_skill[practice_index]);
                xtime[1] = setTimeout(function(){WG.lx_check_skill2();}, 1000);
            },
            //检查指定的技能是否已经修炼到上限
            lx_check_skill:function(skill_id){
                if(skill_id == undefined){messageAppend("全部修炼完成",1);return false}
                let skill = G.skill_list.get(skill_id)
                if(skill){
                    if(skill.level >= skill_limit){
                        messageAppend("技能上限是"+skill_limit+" 技能"+skill_id+"等级为"+skill.level+"已经修炼完成");
                        return true
                    }
                    else{
                        messageAppend("技能上限是"+skill_limit+" 技能"+skill_id+"等级为"+skill.level+"没有修炼完成",2);
                        return false
                    }
                }
                else{
                    messageAppend("你不会"+skill_id+"这个技能")
                    return true;
                }
                for(var skills in G.skill_list){
                    //messageAppend(G.skill_list[skills].id+":"+G.skill_list[skills].level)
                    if(G.skill_list[skills].id == skill_id){
                        if(G.skill_list[skills].level >= skill_limit){
                            messageAppend("技能上限是"+skill_limit+" 技能"+skill_id+"等级为"+G.skill_list[skills].level+"已经修炼完成");
                            return true
                        }
                        else{
                            messageAppend("技能上限是"+skill_limit+" 技能"+skill_id+"等级为"+G.skill_list[skills].level+"没有修炼完成",2);
                            return false
                        }
                    }
                }
                messageAppend("你不会"+skill_id+"这个技能")
                return true;
            },
            //检查技能是否基本功不够无法练等问题
            lx_check_skill2:function(){
                var message = $(".content-message pre").text();
                var jinengman = "未到，必须先打好基础";
                var jinengma = "也许是缺乏实战经验，你觉得";
                var jinengcw = "你不会这个技能";
                var offline = "你的连接中断了"
                var offline2 = "有人使用你的角色"
                if(message.indexOf(jinengman) != -1 || message.indexOf(jinengma) != -1 || message.indexOf(jinengcw) != -1){
                    messageClear();
                    practice_index++;
                    xtime[1] = setTimeout(function(){WG.practice_skill();}, 500);
                }
                else if(message.indexOf(offline) != -1 && message.indexOf(offline2) == -1){
                    WG.Send("wa");
                    messageClear();
                    xtime[1] = setTimeout(function(){WG.lx_check_skill2();}, 5000);
                }
                else{
                    xtime[1] = setTimeout(function(){WG.lx_check_skill2();}, 5000);
                }
            },
            //搜寻称号+名称中包含指定中文的目标，存在返回ture否则返回false
            search_target:function(name){
                var lists = $(".room_items .room-item");
                for (var npc of lists) {
                    if (npc.innerText.indexOf(name) != -1) {
                        return true;
                    }
                }
                return false;
            },
            //根据id在房间内搜寻目标，存在返回ture否则返回false
            search_target_byid:function(id){
                var lists = $(".room_items .room-item");
                for (var npc of lists) {
                    if ($(npc).attr("itemid") == id) {
                        return true;
                    }
                }
                return false;
            },
            //击杀指定目标，参数目标名字（中文）
            kill_target: function (name) {
                var roomlist = $(".room_items .room-item");
                for (var fubennpc of roomlist) {
                    if (fubennpc.innerText.indexOf(name) != -1) {
                        WG.Send("kill " + $(fubennpc).attr("itemid"));
                        return true;
                    }
                }
                return false;
            },
            auto_fuben1: function(){
                messageAppend("<hir>开始自动小树林20次<hir><br>")
                for(var j = 0;j < 20; j++){
                    xtime[j] = setTimeout(function(){WG.Send("cr yz/lw/shangu")}, j*1000);
                    xtime[j*2+1] = setTimeout(function(){WG.Send("cr over")}, j*1000+100);
                }
                xtime[51] = setTimeout(function(){WG.qiandao()}, 30000);
                xtime[52] = setTimeout(function(){WG.Send("shop 0 20");WG.go_yamen_task();}, 35000);
            },
            test_test:function(){
                shifu = GM_getValue(role + "_shifu", shifu);
                //shifu = GM_getValue(role + "_family", family);
                messageAppend(role+shifu)
            },
        };
        var Switch = {
            SaohuangSwitch:function(){
                if(join_bangzhan == "关闭"){
                    join_bangzhan = "开启";
                    tip("自动扫黄已打开")
                }
                else{
                    join_bangzhan = "关闭";
                    tip("自动扫黄已关闭")
                }
            },
            AutoBusySwitch:function(){
                if(autobusy == "关闭"){
                    autobusy = "开启";
                    tip("自动忙乱已打开")
                }
                else{
                    autobusy = "关闭";
                    tip("自动忙乱已关闭")
                }
            },
            ShowIDSwitch:function(){
                if(G.cmd_echo == true){
                    G.cmd_echo = false;
                    tip("显示ID已关闭")
                }
                else{
                    G.cmd_echo = true
                    tip("显示ID已打开")
                }
            },
        };
        var Helper = {
            formatCurrencyTenThou: function (num) {
                num = num.toString().replace(/\$|\,/g, '');
                if (isNaN(num)) num = "0";
                var sign = (num == (num = Math.abs(num)));
                num = Math.floor(num * 10 + 0.50000000001); //cents = num%10;
                num = Math.floor(num / 10).toString();
                for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
                    num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
                }
                return (((sign) ? '' : '-') + num);
            },

            gen: function (nl, xg, hg) {
                var jg = nl / 100 + xg * hg / 10;
                var sd = this.formatCurrencyTenThou(jg);
                return sd;
            },

            dian: function (c, m, se) {
                var j = c + m;
                var jj = m - c;
                var jjc = jj / 2;
                var z = j * jjc * se * 5;
                var sd = this.formatCurrencyTenThou(z);
                return sd;
            },
            ksboss: '',
            marryhy: '',
            xiyan: function () {
                WG.Send("stopstate");
                WG.go("扬州城-喜宴");
                this.marryhy = WG.add_hook(['items', 'cmds', 'text', 'msg'], function (data) {

                    if (data.type == 'items') {

                        for (let idx = 0; idx < data.items.length; idx++) {
                            if (data.items[idx] != 0) {
                                if (data.items[idx].name.indexOf(">婚宴礼桌<") >= 0) {
                                    console.log("拾取");
                                    WG.Send('get all from ' + data.items[idx].id);
                                    console.log("xy" + this.index);
                                    WG.remove_hook(this.index);

                                    break;
                                }
                            }
                        }
                    } else if (data.type == 'text') {
                        if (data.msg == "你要给谁东西？") {
                            console.log("没人");
                            WG.remove_hook(this.index);
                        }
                        if (/^店小二拦住你说道：怎么又是你，每次都跑这么快，等下再进去。$/.test(data.msg)) {
                            console.log("cd");
                            messageAppend("<hiy>你太勤快了,</hiy><br>")
                            console.log("xy" + this.index);
                            WG.remove_hook(this.index);
                        }
                        if (/^店小二拦住你说道：这位(.+)，不好意思，婚宴宾客已经太多了。$/.test(data.msg)) {
                            console.log("客满");
                            messageAppend("<hiy>你来太晚了</hiy><br>")

                        }
                    } else if (data.type == 'cmds') {

                        for (let idx = 0; idx < data.items.length; idx++) {
                            if (data.items[idx].name == '1金贺礼') {
                                WG.Send(data.items[idx].cmd + ';go up');
                                console.log("交钱");
                                break;
                            }
                        }
                    }
                });
                setTimeout(() => {
                    console.log("挖矿");
                    WG.remove_hook(this.marryhy);
                    WG.afterBossBack();
                    next = 0;
                }, 5000);
            },
            saveRoomstate(data) {
                roomData = new Array()
                data.items.forEach(function (v,k){
                    if((v.hp && !v.p) || v.id == G.id){
                        roomData.push(data.items[k])
                    }
                })
            },
            eqx: null,
            eqhelper(type) {
                if (type == undefined || type == 0 || type > eqlist.length) {
                    return;
                }
                if (type < 10){
                    this.eqx = WG.add_hook("dialog", (data) => {
                        if (data.dialog == "pack" && data.eqs != undefined) {
                            eqlist[type] = data.eqs;
                            GM_setValue(role + "_eqlist", eqlist);
                        }
                        else if (data.dialog == "skills" && data.items != undefined) {
                            skilllist[type] = data.items;
                            GM_setValue(role + "_skilllist", skilllist);
                            WG.remove_hook(this.eqx);
                            if(type == 1){messageAppend("战斗装记录成功", 1);}
                            else if(type == 2){messageAppend("悟性装记录成功", 1);}
                            else if(type == 3){messageAppend("躺尸装记录成功", 1);}
                            else if(type == 4){messageAppend("打坐装记录成功", 1);}
                            else if(type == 5){messageAppend("追捕装记录成功", 1);}
                            else if(type == 6){messageAppend("打橙装记录成功", 1);}
                        }
                    });
                }
                else if (type == 99){
                    //记录矿镐
                    this.eqx = WG.add_hook("dialog", (data) => {
                        if (data.dialog == "pack" && data.eqs != undefined) {
                            kuanggao = data.eqs[0].id;
                            GM_setValue(role + "_kuanggao", kuanggao);
                            messageAppend("记录成功，当前装备的矿镐的ID为" + kuanggao, 1);
                            WG.remove_hook(this.eqx);
                        }
                    });
                }
                WG.Send("pack");
                WG.Send("cha");
            },
            eqhelperdel: function (type) {
                eqlist = GM_getValue(role + "_eqlist", eqlist);
                eqlist[type] = [];
                GM_setValue(role + "_eqlist", eqlist);
                messageAppend("清除套装" + type + "设置成功!", 1);
            },
            eqwear: function (type,wtime) {
                if(eqlist[type] == undefined){
                    if(type == 1){Switch.AutoPerformSwitch(1);messageAppend("未记录战斗装", 2);return}
                    else if(type == 2){messageAppend("未记录悟性装", 2);return}
                    else if(type == 3){messageAppend("未记录躺尸装", 2);return}
                    else if(type == 4){messageAppend("未记录打坐装", 2);return}
                    else if(type == 5){type = 1;Switch.AutoPerformSwitch(1);messageAppend("未记录追捕装，将更换战斗装", 2)}//如果未记录追捕装则换战斗装
                    else if(type == 6){type = 1;Switch.AutoPerformSwitch(1);messageAppend("未记录打橙装，将更换战斗装", 2)}//如果未记录追捕装则换战斗装
                };
                if(wtime == undefined){wtime = 0}
                KEY.do_command("pack");
                KEY.do_command("pack");
                var eqlistnow = $(".eq-list").text();
                for (let i = 1; i < eqlist[type].length; i++) {
                    if (eqlist[type][i] != null) {
                        if(eqlistnow.indexOf(eqlist[type][i].name.match(">([^%]+)<")[1]) == -1){
                            WG.Send("eq " + eqlist[type][i].id);
                        }
                    }
                }
                if (eqlist[type][0] != null){
                    if(eqlistnow.indexOf(eqlist[type][0].name.match(">([^%]+)<")[1]) == -1) {
                        WG.Send("eq " + eqlist[type][0].id);
                    }
                }
                Helper.enable_skill(type,wtime)
            },
            enable_skill:function(type,wtime) {
                if(skilllist[type] == undefined){
                    if(type == 5){type = 1}//如果未记录追捕装则换战斗装
                    else if(type == 6){type = 1}//如果未记录追捕装则换战斗装
                    else{return}
                };
                for(var i = 0;i < skilllist[type].length;i++){
                    let item = G.skill_list.get(skilllist[type][i].id)
                    //messageAppend(item.enable_skill+":"+skilllist[type][i].enable_skill)
                    if(item){
                        if(item.enable_skill != skilllist[type][i].enable_skill){
                            WG.Send("enable "+skilllist[type][i].id+" "+skilllist[type][i].enable_skill)
                        }
                    }
                }
                if(type == 1){Switch.AutoPerformSwitch(1);messageAppend("战斗装更换成功！", 1);}
                else if(type == 2){messageAppend("悟性装更换成功！", 1)}
                else if(type == 3){messageAppend("躺尸装更换成功！", 1)}
                else if(type == 4){messageAppend("打坐装更换成功！", 1)}
                else if(type == 5){Switch.AutoPerformSwitch(1);messageAppend("追捕装更换成功！", 1)}
                else if(type == 6){Switch.AutoPerformSwitch(1);messageAppend("打橙装更换成功！", 1)}
            },

            in_fight:false
            ,
        };
        //全局变量
        var G = {
            id: undefined,
            state: undefined,
            room_name: undefined,
            family: undefined,
            items: new Map(),
            skill_list: new Map(),
            stat_boss_success: 0,
            stat_boss_find: 0,
            stat_xiyan_success: 0,
            stat_xiyan_find: 0,
            cds: new Map(),
            in_fight: false,
            auto_preform: true,
            can_auto: false,
        };
        $(document).ready(function () {
            $('head').append('<link href="https://s1.pstatp.com/cdn/expire-1-y/jquery-contextmenu/2.6.3/jquery.contextMenu.min.css" rel="stylesheet">');
            KEY.init();
            WG.init();
            WG.add_hook(["login", "items", "text" , "dialog", "msg"], function (data) {
                if (data.type == "login") {
                    G.id = data.id;
                }
                else if (data.type == "items") {
                    Helper.saveRoomstate(data);
                    G.items = new Map();
                    for (var i = 0; i < data.items.length; i++) {
                        let item = data.items[i];
                        if (!item.p || item.id == G.id) {
                            let n = $.trim($('<body>' + item.name + '</body>').text());
                            let i = n.lastIndexOf(' ');
                            let j = n.lastIndexOf('<');
                            let t = "";
                            let s = "";
                            if (j >= 0) {
                                s = n.substr(j + 1, 2);
                            }
                            if (i >= 0) {
                                t = n.substr(0, i);
                                n = n.substr(i + 1).replace(/<.*>/g, '');
                            }

                            G.items.set(item.id, { name: n, title: t, state: s, max_hp: item.max_hp, max_mp: item.max_mp, hp: item.hp, mp: item.mp, p: item.p, damage: 0 });
                        }
                    }
                }
                else if (data.type == "dialog"){
                    if(data.dialog == "score"){
                        shifu = data.master;
                        GM_setValue(role + "_shifu", shifu)
                        messageAppend("你的师父是"+shifu+"<br>")
                    }
                    else if(data.dialog == "skills"){
                        if(data.items){
                            for (var ii = 0; ii < data.items.length; ii++) {
                                let item = data.items[ii];
                                G.skill_list.set(item.id, {id: item.id, level: item.level , enable_skill: item.enable_skill});
                            }
                        }
                        else if(data.level){
                            let item = G.skill_list.get(data.id)
                            item.level = data.level
                            if (Doing == "练功"){
                                if(data.level >= skill_limit){
                                    messageAppend("技能上限是"+skill_limit+" 当前技能"+data.id+"等级为"+data.level+"已修炼完成");
                                    WG.Send("stopstate");
                                    practice_index++;
                                    WG.practice_skill2();
                                }
                                else{
                                    tip("技能上限是"+skill_limit+" 当前技能"+data.id+"等级为"+data.level+"尚未修炼完成");
                                }
                            }
                            else if(Doing == "学习"){
                                if(data.id == "huashanjianfa" && data.level >= 200){
                                    practice_index++;
                                    WG.learn_skill();
                                }
                            }
                        }
                    }
                }
                else if (data.type == "text") {
                    var msg = data.msg
                    if (Helper.in_fight) {
                    }
                    else{
                        if(data.msg.indexOf("你已经吃太多养精丹了，要注意身体。") != -1){
                            zbindex++;
                        }
                        else if(msg.indexOf("不会这个技能。") != -1 || msg.indexOf("这项技能你的程度已经") != -1 || msg.indexOf("也许是基本功火候未到，你对") != -1 || msg.indexOf("也许是缺乏实战经验") != -1){
                            if(Doing == "学习"){
                                practice_index ++;
                                xtime[0] = setTimeout(function(){WG.learn_skill();}, 1000);
                            }
                        }
                        else if(msg.indexOf("你的内力不够1000") != -1){
                            WG.Send("enable force huashanxinfa")
                            xtime[0] = setTimeout(function(){WG.levelup();}, 1000);
                            xtime[1] = setTimeout(function(){WG.auto_dazuo();}, 4000);
                        }
                        else if(msg.indexOf("你觉得你的经脉充盈") != -1){
                            let item = G.skill_list.get("huashanjianfa")
                            if(item == undefined){
                                WG.learn_skill();
                            }
                        }
                        else if(msg.indexOf("等级不够300，无法学习") != -1){
                            practice_index ++;
                            xtime[0] = setTimeout(function(){WG.learn_skill();}, 1000);
                        }
                        else if(msg.indexOf("石壁的石头掉了下来，把出口又给封死了...") != -1){
                            WG.Send("break bi;go enter;go westup;go westup");
                            setTimeout(function(){WG.learn_skill();}, 1000);
                        }
                        else if(msg.indexOf("你的内力不够3000") != -1){
                            WG.Send("enable force zixiashengong")
                            WG.auto_dazuo();
                        }
                    }
                }
                else if(data.type == "msg"){
                    switch(data.ch){
                        case "chat":
                            if(data.name == "矿场工头" && data.content.indexOf("挖矿指南已结束！！！") != -1 && role == "王二狼"){
                                WG.Send("stopstate;use 0ww14bee71d;wa")
                            }
                            break;
                    }
                }
            });

            $.contextMenu({
                selector: '.container',
                items: {
                    "自动": {
                        name: "自动",
                        "items": {
                            "练功": {
                                name: "练功+BOSS喜宴",
                                callback: function (key, opt) {
                                    WG.practice_skill();
                                },
                            },
                            "打坐": {
                                name: "打坐+BOSS喜宴",
                                callback: function (key, opt) {
                                    WG.auto_dazuo();
                                },
                            },
                            "自动小树林": {
                                name: "自动小树林20次",
                                callback: function (key, opt) {
                                    WG.auto_fuben1();
                                },
                            },
                            "吃药": {
                                name: "吃药",
                                callback: function (key, opt) {
                                    WG.fenjie_zhuangbei();
                                },
                            },
                            "学习": {
                                name: "学习",
                                callback: function (key, opt) {
                                    WG.learn_skill();
                                },
                            },
                        },
                    },
                    "记录id": {
                        name: "记录id",
                        "items": {
                            "rec_eq1": {
                                name: "记录战斗装",
                                callback: function (key, opt) {
                                    Helper.eqhelper(1);
                                },
                            },
                            "rec_eq2": {
                                name: "记录悟性装",
                                callback: function (key, opt) {
                                    Helper.eqhelper(2);
                                },
                            },
                            "rec_eq3": {
                                name: "记录躺尸装（武器剑，以及减忙乱装）",
                                callback: function (key, opt) {
                                    Helper.eqhelper(3);
                                },
                            },
                            "rec_eq4": {
                                name: "记录打坐装",
                                callback: function (key, opt) {
                                    Helper.eqhelper(4);
                                },
                            },
                            "rec_eq5": {
                                name: "记录追捕装（不记录会更换战斗装）",
                                callback: function (key, opt) {
                                    Helper.eqhelper(5);
                                },
                            },
                            "rec_eq99": {
                                name: "记录矿镐",
                                callback: function (key, opt) {
                                    Helper.eqhelper(99);
                                },
                            },
                        }
                    },
                    "扫黄": {
                        name: "扫黄",
                        callback: function (key, opt) {
                            WG.Saohuang();
                        },
                    },
                    "开关": {
                        name: "开关",
                        "items": {
                            "扫黄开关": {
                                name: "扫黄开关",
                                callback: function (key, opt) {
                                    Switch.SaohuangSwitch();
                                },
                            },
                            "自动忙乱开关": {
                                name: "自动忙乱",
                                callback: function (key, opt) {
                                    Switch.AutoBusySwitch();
                                },
                            },
                            "显示ID开关": {
                                name: "显示ID",
                                callback: function (key, opt) {
                                    Switch.ShowIDSwitch();
                                },
                            },
                        },
                    },
                    "更新ID": {
                        name: "更新ID",
                        callback: function (key, opt) {
                            WG.getAllid();
                            //WG.setting();
                        },
                    },
                    "调试功能": {
                        name: "调试",
                        visible: true,
                        callback: function (key, opt) {
                            WG.test_test();
                        },
                    },
                },
            });
        });
    })();