// ==UserScript==
// @name         wsmud_plugins修正版by将来
// @namespace    cqv
// @version      2.8.25
// @date         01/07/2018
// @modified     11/07/2018
// @homepage     https://greasyfork.org/zh-CN/scripts/370135
// @run-at       document-start
// @description  武神传说 MUD
// @author       fjcqv
// @match        http://*.wsmud.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/377248/wsmud_plugins%E4%BF%AE%E6%AD%A3%E7%89%88by%E5%B0%86%E6%9D%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/377248/wsmud_plugins%E4%BF%AE%E6%AD%A3%E7%89%88by%E5%B0%86%E6%9D%A5.meta.js
// ==/UserScript==
(
    function () {
        'use strict';

        var mpz_time_wd;
        var mpz_time_em;
        var mpz_time_sl;
        var mpz_time_hs;
        var mpz_time_xy;
        var mpz_time_gb;
        var mpz_msg = "";
        var auto_sortout_pack = 0;
        var auto_bingxindan = 0;
        var id_bingxindan = "";
        var in_busy = 0;
        var autouse_dao = 0;
        var dacheng_pfm = "";
        var eqlistNow = [];
        var autotoken = "关闭";
        var fenpei_player = "玩家1，玩家2";
        var changepercent = 11;
        var autoperform = "开启";
        var autorelive = "关闭";
        var kuanggao;
        var join_bangzhan;
        var next = 0;
        var roomData = [];
        var role;
        var automarry = null;
        var autoKsBoss = null;
        var showHP = null;
        var heimingdan = new Array("枯荣大师","张无忌","天山童姥","木头人","首席弟子","门派后勤","峨眉大师姐","少林派大师兄","铜人","的尸体");/////////////////////////叫杀时会略过这些目标
        var auto_perform;
        var auto_perform2;
        var auto_perform3;
        var practice_skill;
        var practice_index = 0;
        var skill_limit;
        var myboss;
        var ckwp;
        var weapon;
        var wdTCD;
        var ZhuiBuCD;
        var wdt_ceng;
        var wdt_ceng_ms;
        var SaohuangIndex = 0;
        var SaohuangTarget;
        var Saohuang_zhangmen = "关闭";
        var Saohuang_zhangmen0 = "不打";
        var Saohuang_zhangmen1 = "不打";
        var Saohuang_zhangmen2 = "不打";
        var Saohuang_zhangmen3 = "不打";
        var unenable_skill = "sword,blade,unarmed,whip,club,staff,parry";
        var SaohuangHP = 99;
        var shouxi ={"丐帮":"丐帮-破庙密室","华山":"华山派-练武场","武当":"武当派-太子岩","峨眉":"峨嵋派-广场","峨嵋":"峨嵋派-广场","少林":"少林派-练武场","逍遥":"逍遥派-首席","杀手":"杀手楼-练功房"};
        var roomItemSelectIndex = -1;
        var ch;
        var rwResult ="";
        var luj = new Array();;
        var i =0;
        var fzkg=1;
        var BOSS;
        var ymBOSS;
        var xx =0;
        var myTime = new Array();
        var xtime = new Array();
        var ktime = new Array();
        var nCTime = new Array();
        var smitem;
        var ymrwlimit = 0;
        var zb_npc;
        var zb_place;
        var Doing;
        var autobusy;
        var autobusy_skill = "";
        var autofaint_skill = "";
        var family;
        var sm_loser;
        var get_dipo = 0;
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
            "扬州城-当铺": "jh fam 0 start;go south;;go east",
            "扬州城-喜宴": "jh fam 0 start;go north;go north;go east;go up",
            "扬州城-武庙": "jh fam 0 start;go north;go north;go west",
            "扬州城-钱庄": "jh fam 0 start;go north;go west",
            "扬州城-杂货铺": "jh fam 0 start;go east;go south",
            "扬州城-打铁铺": "jh fam 0 start;go east;go east;go south",
            "扬州城-药铺": "jh fam 0 start;go east;go east;go north",
            "扬州城-衙门正厅": "jh fam 0 start;go west;go north;go north",
            "扬州城-矿山": "jh fam 0 start;go west;go west;go west;go west",
            "扬州城-扬州武馆": "jh fam 0 start;go south;go south;go west",
            "扬州城-镖局正厅": "jh fam 0 start;go west;go west;go south;go south",
            "帮会-练功房": "jh fam 0 start;go south;go south;go east;go east;go east;go north",
            "帮会-大院": "jh fam 0 start;go south;go south;go east;go east;go east",
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
            "峨嵋派-金顶": "jh fam 4 start",
            "峨嵋派-庙门": "jh fam 4 start;go west",
            "峨嵋派-广场": "jh fam 4 start;go west;go south",
            "峨嵋派-走廊": "jh fam 4 start;go west;go south;go east",
            "峨嵋派-走廊1": "jh fam 4 start;go west;go south;go west",
            "峨嵋派-休息室": "jh fam 4 start;go west;go south;go east;go south",
            "峨嵋派-厨房": "jh fam 4 start;go west;go south;go east;go east",
            "峨嵋派-练功房": "jh fam 4 start;go west;go south;go west;go west",
            "峨嵋派-小屋": "jh fam 4 start;go west;go south;go west;go north;go north",
            "峨嵋派-清修洞": "jh fam 4 start;go west;go south;go west;go south;go south",
            "峨嵋派-大殿": "jh fam 4 start;go west;go south;go south",
            "峨嵋派-睹光台": "jh fam 4 start;go northup",
            "峨嵋派-华藏庵": "jh fam 4 start;go northup;go east",
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
            "逍遥派-逍遥子": "jh fam 5 start;go down;go down",
            "丐帮-树洞内部": "jh fam 6 start",
            "丐帮-树洞下": "jh fam 6 start;go down",
            "丐帮-暗道": "jh fam 6 start;go down;go east",
            "丐帮-破庙密室": "jh fam 6 start;go down;go east;go east;go east",
            "丐帮-土地庙": "jh fam 6 start;go down;go east;go east;go east;go up",
            "丐帮-林间小屋": "jh fam 6 start;go down;go east;go east;go east;go east;go east;go up",
            "杀手楼-大厅": "jh fam 7 start;go north",
            "杀手楼-练功房": "jh fam 7 start;go north;go up;go up;go up;go up;go east",
            "襄阳城-广场": "jh fam 8 start",
            "武道塔": "jh fam 9 start"
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
                var exit1 = undefined;
                var exit2 = undefined;
                var exit3 = undefined;
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
                        // W 押镖
                        WG.yabiao();
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
                        WG.wkzidong();
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
                    case 37:
                        // Left Arrow←
                        exit1 = G.exits.get("west")
                        exit2 = G.exits.get("westup")
                        exit3 = G.exits.get("westdown")
                        if(exit1){WG.Send("go west")}
                        else if(exit2){{WG.Send("go westup")}}
                        else if(exit3){{WG.Send("go westdown")}}
                        KEY.onChangeRoom();
                        break;
                    case 100:
                        // NumPad 4 等同于←
                        exit1 = G.exits.get("west")
                        exit2 = G.exits.get("westup")
                        exit3 = G.exits.get("westdown")
                        if(exit1){WG.Send("go west")}
                        else if(exit2){{WG.Send("go westup")}}
                        else if(exit3){{WG.Send("go westdown")}}
                        KEY.onChangeRoom();
                        break;
                    case 38:
                        // Up Arrow↑
                        exit1 = G.exits.get("north")
                        exit2 = G.exits.get("northup")
                        exit3 = G.exits.get("northdown")
                        if(exit1){WG.Send("go north")}
                        else if(exit2){{WG.Send("go northup")}}
                        else if(exit3){{WG.Send("go northdown")}}
                        KEY.onChangeRoom();
                        break;
                    case 104:
                        // NumPad 8 等同于↑
                        exit1 = G.exits.get("north")
                        exit2 = G.exits.get("northup")
                        exit3 = G.exits.get("northdown")
                        if(exit1){WG.Send("go north")}
                        else if(exit2){{WG.Send("go northup")}}
                        else if(exit3){{WG.Send("go northdown")}}
                        KEY.onChangeRoom();
                        break;
                    case 39:
                        // Right Arrow→
                        exit1 = G.exits.get("east")
                        exit2 = G.exits.get("eastup")
                        exit3 = G.exits.get("eastdown")
                        if(exit1){WG.Send("go east")}
                        else if(exit2){{WG.Send("go eastup")}}
                        else if(exit3){{WG.Send("go eastdown")}}
                        KEY.onChangeRoom();
                        break;
                    case 102:
                        // NumPad 6 等同于→
                        exit1 = G.exits.get("east")
                        exit2 = G.exits.get("eastup")
                        exit3 = G.exits.get("eastdown")
                        if(exit1){WG.Send("go east")}
                        else if(exit2){{WG.Send("go eastup")}}
                        else if(exit3){{WG.Send("go eastdown")}}
                        KEY.onChangeRoom();
                        break;
                    case 40:
                        // Down Arrow↓
                        exit1 = G.exits.get("south")
                        exit2 = G.exits.get("southup")
                        exit3 = G.exits.get("southdown")
                        if(exit1){WG.Send("go south")}
                        else if(exit2){{WG.Send("go southup")}}
                        else if(exit3){{WG.Send("go southdown")}}
                        KEY.onChangeRoom();
                        break;
                    case 98:
                        // NumPad 2 等同于↓
                        exit1 = G.exits.get("south")
                        exit2 = G.exits.get("southup")
                        exit3 = G.exits.get("southdown")
                        if(exit1){WG.Send("go south")}
                        else if(exit2){{WG.Send("go southup")}}
                        else if(exit3){{WG.Send("go southdown")}}
                        KEY.onChangeRoom();
                        break;
                    case 97:
                        // NumPad 1
                        WG.Send("go southwest");
                        KEY.onChangeRoom();
                        break;
                    case 99:
                        // NumPad 3
                        WG.Send("go southeast");
                        KEY.onChangeRoom();
                        break;
                    case 101:
                        // NumPad 3 控制down,按住alt时为up
                        if (altKey) {
                            WG.Send("go up");
                        }
                        else{
                            WG.Send("go down");
                        }
                        KEY.onChangeRoom();
                        break
                    case 103:
                        // NumPad 7
                        WG.Send("go northwest");
                        KEY.onChangeRoom();
                        break;
                    case 105:
                        // NumPad 9
                        WG.Send("go northeast");
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
                //var t;
                $(".bottom-bar span:eq(2)").after("<span class='tool-item' style='line-height:17px;vertical-align:top;color:white'><span class='fuzhucaidan'>☆</br>辅助</span></span>");
                $(".content-message").after("<div class='fuzhuanjian' style='width:100%;right:45px;margin-bottom:0em;'>" + "提示： <span class='WG_Tip'></span><br>" +"<span class='zdy-item lianzhaoyi'>连招(A)</span>"+"<span class='zdy-item lianzhaoer'>连招(S)</span>"+"<span class='zdy-item wuxingzhuang'>悟性装</span>"+"<span class='zdy-item zhandouzhuang'>战斗装</span>"+"<span class='zdy-item clearxr'>清虚弱</span>"+"<span class='zdy-item auto_perform'>AUTOPFM</span>"+"<span class='zdy-item liaoshang'>疗伤(R)</span>" + "<span class='zdy-item wkzidong'>挖矿(G)</span><br>" + "<span class='zdy-item shaolin'>少林</span>" + "<span class='zdy-item wudang'>武当</span>" + "<span class='zdy-item huashan'>华山</span>" + "<span class='zdy-item emei'>峨眉</span>" + "<span class='zdy-item xiaoyao'>逍遥</span>" + "<span class='zdy-item gaibang'>丐帮</span>"+ "<span class='zdy-item bhck'>帮会</span>" + "<span class='zdy-item cangku'>仓库</span><br>"+ "<span class='zdy-item kill_all'>杀(D)</span>"+ "<span class='zdy-item get_all'>捡(F)</span>"+ "<span class='zdy-item yabiao'>押镖(W)</span>"+ "<span class='zdy-item go_family'>师门(Q)</span>"+ "<span class='zdy-item go_yamen_task'>追捕(E)</span>" + "<span class='zdy-item wdT'>武道</span>"+ "<span class='zdy-item sell_all'>清包</span>"+ "<span class='zdy-item allStop'>停止</span>" + "</div>");
                if(window.navigator.userAgent.indexOf("Android") != -1){
                }
                else if(window.navigator.userAgent.indexOf("Windows") != -1){
                }
                var css = `.zdy-item{
display:inline-block; border:solid 1px gray; color:gray; background-color:black;
text-align:left; cursor:pointer; border-radius:0.2em; min-width:3.5em; margin-right:0.5em; color:yellow;
margin-left:0.4em; position:relative; padding-left:0.4em; padding-right:0.4em; line-height:1.5em;}
.item-plushp{display: inline-block;float: right;width: 120px;text-align: right}
.item-dps{display: inline-block;float: left;width: 100px;text-align: right}`;
                GM_addStyle(css);
                $(".go_family").on("click", WG.go_family);
                $(".fuzhucaidan").on("click", WG.fzkg);
                $('.allStop').on('click', function () {WG.allStop()});
                $(".getAllid").on("click", WG.getAllid);
                $(".go_yamen_task").on("click", WG.go_yamen_task);
                $(".lianzhaoyi").on("click", WG.lianzhaoyi);
                $(".lianzhaoer").on("click", WG.lianzhaoer);
                $(".wuxingzhuang").on("click", WG.wuxingzhuang);
                $(".zhandouzhuang").on("click", WG.zhandouzhuang);
                $(".yabiao").on("click", function () {WG.yabiao()});
                $(".kill_all").on("click", WG.kill_all);
                $(".wdT").on("click", WG.wdT);
                $(".get_all").on("click", WG.get_all);
                $(".liaoshang").on("click", WG.liaoshang);
                $(".cangku").on("click", WG.cangku);
                $(".sell_all").on("click", WG.sell_all);
                $(".wkzidong").on("click", WG.wkzidong);
                $(".qiandao").on("click", WG.qiandao);
                $(".clearxr").on("click", WG.clear_xuruo);
                $('.shaolin').on('click', function () {WG.go("少林派-方丈楼")});
                $('.wudang').on('click', function () {WG.go("武当派-后山小院")});
                $('.huashan').on('click', function () {WG.go("华山派-客厅")});
                $('.emei').on('click', function () {WG.go("峨嵋派-清修洞")});
                $('.xiaoyao').on('click', function () {WG.go("逍遥派-逍遥子")});
                $('.gaibang').on('click', function () {WG.go("丐帮-林间小屋")});
                $('.bhck').on('click', function () {WG.go("帮会-大院")});
                $('.auto_perform').on('click', function () {Switch.AutoPerformSwitch()});
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
                equip = GM_getValue(role + "_equip", equip);
                skilllist = GM_getValue(role + "_skilllist", skilllist);
                family = GM_getValue(role + "_family", family);
                automarry = GM_getValue(role + "_automarry", automarry);
                autoKsBoss = GM_getValue(role + "_autoKsBoss", autoKsBoss);
                showHP = GM_getValue(role + "_showHP", showHP);
                eqlist = GM_getValue(role + "_eqlist", eqlist);
                sm_loser = GM_getValue(role + "_sm_loser", sm_loser);
                join_bangzhan = GM_getValue(role + "_join_bangzhan", join_bangzhan);
                auto_perform = GM_getValue(role + "_auto_perform", auto_perform);
                auto_perform2 = GM_getValue(role + "_auto_perform2", auto_perform2);
                auto_perform3 = GM_getValue(role + "_auto_perform3", auto_perform3);
                autoperform = GM_getValue(role + "_autoperform", autoperform);
                autobusy = GM_getValue(role + "_autobusy", autobusy);
                auto_sortout_pack = GM_getValue(role + "_auto_sortout_pack", auto_sortout_pack);
                autobusy_skill = GM_getValue(role + "_autobusy_skill", autobusy_skill);
                autofaint_skill = GM_getValue(role + "_autofaint_skill", autofaint_skill);
                practice_skill = GM_getValue(role + "_practice_skill", practice_skill);
                dacheng_pfm = GM_getValue(role + "_dacheng_pfm", dacheng_pfm);
                skill_limit = GM_getValue(role + "_skill_limit", skill_limit);
                auto_bingxindan = GM_getValue(role + "_auto_bingxindan", auto_bingxindan);
                myboss = GM_getValue(role + "_myboss", myboss);
                wdt_ceng = GM_getValue(role + "_wdt_ceng", wdt_ceng);
                wdt_ceng_ms = GM_getValue(role + "_wdt_ceng_ms", wdt_ceng_ms);
                Saohuang_zhangmen0 = GM_getValue(role + "_Saohuang_zhangmen0", Saohuang_zhangmen0);
                Saohuang_zhangmen1 = GM_getValue(role + "_Saohuang_zhangmen1", Saohuang_zhangmen1);
                Saohuang_zhangmen2 = GM_getValue(role + "_Saohuang_zhangmen2", Saohuang_zhangmen2);
                Saohuang_zhangmen3 = GM_getValue(role + "_Saohuang_zhangmen3", Saohuang_zhangmen3);
                changepercent = GM_getValue(role + "_changepercent", changepercent);
                autorelive = GM_getValue(role + "_autorelive", autorelive);
                SaohuangHP = GM_getValue(role + "_SaohuangHP", SaohuangHP);
                kuanggao = GM_getValue(role + "_kuanggao", kuanggao);
                ZhuiBuCD = GM_getValue(role + "_ZhuiBuCD", ZhuiBuCD);
                wdTCD = GM_getValue(role + "_wdTCD", wdTCD);
                ymrwlimit = GM_getValue(role + "_ymrwlimit", ymrwlimit);
                autouse_dao = GM_getValue(role + "_autouse_dao", autouse_dao);
                ckwp = GM_getValue(role + "_ckwp", ckwp);
                autotoken = GM_getValue(role + "_autotoken", autotoken);
                fenpei_player = GM_getValue(role + "_fenpei_player", fenpei_player);
                setTimeout(() => {
                    var logintext = '';
                    document.title = role + "-MUD游戏-武神传说";
                    if (WebSocket) {
                        if (family == undefined) {
                            logintext = `
<hiy>欢迎${role},插件已加载！第一次使用,请在设置中,更新所有ID,并进行个人数据设置
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
如果使用的浏览器是火狐浏览器或QQ浏览器，尝试多刷新几次或关闭浏览器重开
如果使用的是谷歌系浏览器,请按F12，在network中勾选disable cache,多刷新几次,直至提示已加载!
插件版本: ${GM_info.script.version}
</hiy>`;
                    }
                    messageAppend(logintext);
                    KEY.do_command("showtool");
                    KEY.do_command("showcombat");
                    WG.Send("pack")
                    KEY.do_command("skills")
                    KEY.do_command("skills")
                    if(typeof(autobusy_skill) != "string"){messageAppend("由于此版本的修改，设置中忙乱消失时释放的技能需要删除后重新设置并在设置后刷新游戏，否则会出现BUG", 2)}
                    if(typeof(autofaint_skill) != "string"){messageAppend("由于此版本的修改，设置中昏迷消失时释放的技能需要删除后重新设置并在设置后刷新游戏，否则会出现BUG", 2)}
                    if(autoperform == "开启"){WG.lianzhao_concat();}
                    WG.timer_job();
                    if(autoperform == "开启"){$(".auto_perform").css("background", "#00FFFF");}
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
<option value="杀手">杀手</option>
<option value="武馆">武馆</option>
</select>&nbsp&nbsp<label for="show_hp">全局显血： </label><select style='width:80px' id = "show_hp">
<option value="关闭">关闭</option>
<option value="开启">开启</option>
</select>
</span>
<span><label for="marry_kiss">自动喜宴： </label><select style='width:80px' id = "marry_kiss">
<option value="关闭">关闭</option>
<option value="开启">开启</option>
</select>&nbsp&nbsp<label for="ks_Boss">自动boss： </label><select  style='width:80px' id = "ks_Boss">
<option value="关闭">关闭</option>
<option value="开启">开启</option>
</select>
</span>
<span><label for="auto_perform">连招一： </label><input style='width:300px' type="text" id="auto_perform" name="auto_perform" value=""></span>
<span><label for="auto_perform2">连招二： </label><input style='width:300px' type="text" id="auto_perform2" name="auto_perform2" value=""></span>
<span><label for="auto_perform3">自动出招黑名单： </label><input style='width:245px' type="text" id="auto_perform3" name="auto_perform3" value=""></span>
<span><label for="autobusy">自动接忙乱： </label><select  style='width:80px' id = "autobusy">
<option value="关闭">关闭</option>
<option value="开启">开启</option>
</select>
<label for="autobusy_skill">忙乱消失时释放技能： </label><input style='width:230px' type="text" id="autobusy_skill" name="autobusy_skill" value=""></span>
<label for="autofaint_skill">昏迷消失时释放技能： </label><input style='width:230px' type="text" id="autofaint_skill" name="autofaint_skill" value=""></span>

<span><label for="practice_skill">练功技能： </label><input style='width:300px' type="text" id="practice_skill" name="practice_skill" value=""></span>
<label for="auto_bingxindan">自动吃冰心丹： </label><select style='width:50px' id = "auto_bingxindan">
<option value="0">关闭</option>
<option value="1">开启</option>
</select><label for="skill_limit">练功上限： </label><input style='width:80px' type="text" id="skill_limit" name="skill_limit" value=""></span>

<span><label for="myboss">可杀的BOSS： </label><input style='width:300px' type="text" id="myboss" name="myboss" value=""></span>

<span><label for="wdt_ceng_ms">塔冷却层： </label><input style='width:80px' type="text" id="wdt_ceng_ms" name="wdt_ceng_ms" value="">&nbsp<label for="wdt_ceng">塔扫荡层： </label><input style='width:80px' type="text" id="wdt_ceng" name="wdt_ceng" value=""></span>
<span><label for="ZhuiBuCD">追捕冷却： </label><input style='width:80px' type="text" id="ZhuiBuCD" name="ZhuiBuCD" value="">&nbsp<label for="wdTCD">打塔冷却： </label><input style='width:80px' type="text" id="wdTCD" name="wdTCD" value=""></span>

<span>扫黄相关设置
<label for="join_bangzhan">自动扫黄： </label><select  style='width:80px' id = "join_bangzhan">
<option value="关闭">关闭</option>
<option value="开启">开启</option>
</select>&nbsp&nbsp<label for="SaohuangHP">黄叫杀百分比： </label><input style='width:76px' type="text" id="SaohuangHP" name="SaohuangHP" value=""></span>
<label for="Saohuang_zhangmen0">12点掌门： </label><select style='width:80px' id = "Saohuang_zhangmen0">
<option value="不打">不打</option>
<option value="打">打</option>
</select>&nbsp&nbsp&nbsp<label for="Saohuang_zhangmen1">1点掌门： </label><select style='width:80px' id = "Saohuang_zhangmen1">
<option value="不打">不打</option>
<option value="打">打</option>
</select>
<label for="Saohuang_zhangmen2">2点掌门： </label><select style='width:80px' id = "Saohuang_zhangmen2">
<option value="不打">不打</option>
<option value="打">打</option>
</select>&nbsp&nbsp&nbsp<label for="Saohuang_zhangmen3">3点掌门： </label><select style='width:80px' id = "Saohuang_zhangmen3">
<option value="不打">不打</option>
<option value="打">打</option>
</select>
<label for="changepercent">转火百分比： </label><input style='width:80px' type="text" id="changepercent" name="changepercent" value=""></span>&nbsp&nbsp<label for="autorelive">自动复活： </label><select style='width:80px' id = "autorelive">
<option value="关闭">关闭</option>
<option value="开启">开启</option>
</select>
<span><label for="dacheng_pfm">打橙时的自动出招： </label><input style='width:380px' type="text" id="dacheng_pfm" name="dacheng_pfm" value=""></span>

<span><label for="ymrwlimit">衙门任务放弃： </label><input style='width:46px' type="text" id="ymrwlimit" name="ymrwlimit" value="">&nbsp<label for="sm_loser">师门自动放弃： </label><select style='width:50px' id = "sm_loser">
<option value="关闭">关闭</option>
<option value="开启">开启</option>
</select>
<label for="autotoken">自动上交令牌： </label><select style='width:50px' id = "autotoken">
<option value="关闭">关闭</option>
<option value="开启">开启</option>
</select>&nbsp<label for="auto_sortout_pack">自动整理背包： </label><select style='width:50px' id = "auto_sortout_pack">
<option value="0">关闭</option>
<option value="1">开启</option>
</select>
<label for="ckwp">师门遇到以下物品去仓库取（物品中文名）： </label>
<input style='width:350px' type="text" id="ckwp" name="ckwp" value=""></span>
</span>
<label for="fenpei_player">分配紫的玩家： </label>
<input style='width:350px' type="text" id="fenpei_player" name="fenpei_player" value=""></span>
</span>
<label for="autouse_dao">血量低于多少百分比自动使用倒转乾坤： </label><input style='width:50px' type="text" id="autouse_dao" name="autouse_dao" value=""></span>
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
                $('#marry_kiss').val(automarry);
                $('#marry_kiss').change(function () {
                    automarry = $('#marry_kiss').val();
                    GM_setValue(role + "_automarry", automarry);
                });
                $('#ks_Boss').val(autoKsBoss);
                $('#ks_Boss').change(function () {
                    autoKsBoss = $('#ks_Boss').val();
                    GM_setValue(role + "_autoKsBoss", autoKsBoss);
                });
                $('#join_bangzhan').val(join_bangzhan);
                $('#join_bangzhan').change(function () {
                    join_bangzhan = $('#join_bangzhan').val();
                    GM_setValue(role + "_join_bangzhan", join_bangzhan);
                });
                $('#show_hp').val(showHP);
                $('#show_hp').change(function () {
                    showHP = $('#show_hp').val();
                    GM_setValue(role + "_showHP", showHP);
                    Helper.showallhp();
                });
                $('#auto_bingxindan').val(auto_bingxindan);
                $('#auto_bingxindan').change(function () {
                    auto_bingxindan = $('#auto_bingxindan').val();
                    GM_setValue(role + "_auto_bingxindan", auto_bingxindan);
                });
                $('#auto_perform').val(auto_perform);
                $('#auto_perform').focusout(function () {
                    auto_perform = $('#auto_perform').val();
                    GM_setValue(role + "_auto_perform", auto_perform);
                });
                $('#auto_perform2').val(auto_perform2);
                $('#auto_perform2').focusout(function () {
                    auto_perform2 = $('#auto_perform2').val();
                    GM_setValue(role + "_auto_perform2", auto_perform2);
                });
                $('#auto_perform3').val(auto_perform3);
                $('#auto_perform3').focusout(function () {
                    auto_perform3 = $('#auto_perform3').val();
                    GM_setValue(role + "_auto_perform3", auto_perform3);
                });
                $('#autobusy').val(autobusy);
                $('#autobusy').change(function () {
                    autobusy = $('#autobusy').val();
                    GM_setValue(role + "_autobusy", autobusy);
                });
                $('#autobusy_skill').val(autobusy_skill);
                $('#autobusy_skill').focusout(function () {
                    autobusy_skill = $('#autobusy_skill').val();
                    GM_setValue(role + "_autobusy_skill", autobusy_skill);
                });
                $('#autofaint_skill').val(autofaint_skill);
                $('#autofaint_skill').focusout(function () {
                    autofaint_skill = $('#autofaint_skill').val();
                    GM_setValue(role + "_autofaint_skill", autofaint_skill);
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
                $('#myboss').val(myboss);
                $('#myboss').focusout(function () {
                    myboss = $('#myboss').val();
                    if(myboss.indexOf(",") != -1){
                        myboss = myboss.split(",");
                    }
                    else if(myboss.indexOf("，") != -1){
                        myboss = myboss.split("，");
                    }
                    else{
                        myboss = "缺省1,".concat(myboss).split(",")
                    }
                    GM_setValue(role + "_myboss", myboss);
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
                $('#Saohuang_zhangmen0').val(Saohuang_zhangmen0);
                $('#Saohuang_zhangmen0').change(function () {
                    Saohuang_zhangmen0 = $('#Saohuang_zhangmen0').val();
                    GM_setValue(role + "_Saohuang_zhangmen0", Saohuang_zhangmen0);
                });
                $('#Saohuang_zhangmen1').val(Saohuang_zhangmen1);
                $('#Saohuang_zhangmen1').change(function () {
                    Saohuang_zhangmen1 = $('#Saohuang_zhangmen1').val();
                    GM_setValue(role + "_Saohuang_zhangmen1", Saohuang_zhangmen1);
                });
                $('#Saohuang_zhangmen2').val(Saohuang_zhangmen2);
                $('#Saohuang_zhangmen2').change(function () {
                    Saohuang_zhangmen2 = $('#Saohuang_zhangmen2').val();
                    GM_setValue(role + "_Saohuang_zhangmen2", Saohuang_zhangmen2);
                });
                $('#Saohuang_zhangmen3').val(Saohuang_zhangmen3);
                $('#Saohuang_zhangmen3').change(function () {
                    Saohuang_zhangmen3 = $('#Saohuang_zhangmen3').val();
                    GM_setValue(role + "_Saohuang_zhangmen3", Saohuang_zhangmen3);
                });
                $('#dacheng_pfm').val(dacheng_pfm);
                $('#dacheng_pfm').focusout(function () {
                    dacheng_pfm = $('#dacheng_pfm').val();
                    GM_setValue(role + "_dacheng_pfm", dacheng_pfm);
                });
                $('#changepercent').val(changepercent);
                $('#changepercent').focusout(function () {
                    changepercent = $('#changepercent').val();
                    GM_setValue(role + "_changepercent", changepercent);
                });
                $('#autorelive').val(autorelive);
                $('#autorelive').change(function () {
                    autorelive = $('#autorelive').val();
                    GM_setValue(role + "_autorelive", autorelive);
                });
                $('#auto_sortout_pack').val(auto_sortout_pack);
                $('#auto_sortout_pack').change(function () {
                    auto_sortout_pack = $('#auto_sortout_pack').val();
                    GM_setValue(role + "_auto_sortout_pack", auto_sortout_pack);
                });
                $('#SaohuangHP').val(SaohuangHP);
                $('#SaohuangHP').focusout(function () {
                    SaohuangHP = $('#SaohuangHP').val();
                    GM_setValue(role + "_SaohuangHP", SaohuangHP);
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
                $('#autotoken').val(autotoken);
                $('#autotoken').change(function () {
                    autotoken = $('#autotoken').val();
                    GM_setValue(role + "_autotoken", autotoken);
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
                        ckwp = "物品1,".concat(ckwp).split(",")
                    }
                    GM_setValue(role + "_ckwp", ckwp);
                });
                $('#fenpei_player').val(fenpei_player);
                $('#fenpei_player').focusout(function () {
                    fenpei_player = $('#fenpei_player').val();
                    GM_setValue(role + "_fenpei_player", fenpei_player);
                });
                $('#autouse_dao').val(autouse_dao);
                $('#autouse_dao').focusout(function () {
                    autouse_dao = $('#autouse_dao').val();
                    GM_setValue(role + "_autouse_dao", autouse_dao);
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
                /*
                if (G.cmd_echo) {
                    console.log(data);
                }*/
                WG.run_hook(data.type, data);
            },
            fzkg: function () {
                if(fzkg == 1){fzkg = 2;$(".fuzhuanjian").hide();}
                else if(fzkg == 2){fzkg = 1;$(".fuzhuanjian").show();}
            },
            listhide: function () {
                $(".fuzhuanjian1").hide();$(".fuzhuanjian2").hide();
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
                for(var i = 0;i < roomData.length;i++){
                    if(roomData[i].id && !roomData[i].p){
                        npcs[roomData[i].name] = roomData[i].id;
                        messageAppend(roomData[i].name + " 的ID:" + roomData[i].id + "\n");
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
            sleep: function (time) {
                console.log(time);
                return new Promise((resolve) => setTimeout(resolve, time));
            },
            go: function (p) {
                if(WG.at(p)) {return;};
                if (place[p] != undefined) WG.Send(place[p]);
            },
            at: function (p) {
                var w = $(".room-name").html();
                return w.indexOf(p) == -1 ? false : true;
            },
            go_family: function () {
                //family = $('.room_items .room-item:first .item-name').text().substr(0, 2);//无门派，提取门派
                WG.Send("stopstate");
                try{
                    if(goods["飞镖"].id == null){goods = GM_getValue("goods", goods)}
                }
                catch(error){
                    messageAppend("数据出错了，请刷新游戏后先更新所有ID再点师门",2);
                    return;
                }
                switch (family) {
                    case '武当':
                        WG.go("武当派-三清殿");
                        WG.sm("武当派第二代弟子 武当首侠 宋远桥");
                        break;
                    case '华山':
                        WG.go("华山派-客厅");
                        WG.sm("华山派掌门 君子剑 岳不群");
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
                        WG.go("峨嵋派-大殿");
                        WG.sm("峨眉派第四代弟子 静心");
                        break;
                    case '杀手':
                        WG.go("杀手楼-大厅");
                        WG.sm("杀手教习 何小二");
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
                            xtime[6] = setTimeout(function(){WG.go_yamen_task();},3000);
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
            checkObj:function(obj1){
                for(var tmp in obj1){
                    return true
                }
                return false
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
                if (autotoken == "开启"){
                    //自动上交放弃命令前面一个命令中的令牌，建议从仓库中取出令牌的顺序按照令牌的颜色倒序取出，这样可以先交最低等的令牌
                    var tmpObj = $("span[cmd$='giveup']:last").prev();
                    var tmpObjtext = $("span[cmd$='giveup']:last").prev().html();
                    if(tmpObjtext != "" && tmpObjtext != undefined){
                        if(tmpObjtext.indexOf("师门令牌") != -1) {
                            tmpObj.click();
                            setTimeout(function(){ WG.go_family(); },100)
                            return;
                        }
                    }
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
                    for(var i = 0; i < roomData.length; i++){
                        if(roomData[i].id && !roomData[i].p){
                            WG.Send("ask2 "+roomData[i].id)
                        }
                    }
                },1000);
            },
            //检查房间中的第一个人身上是否有指定中文名的BUFF，没有返回true否则返回false
            buff_not_exist:function(text){
                var buff =$(".room_items .room-item .item-status-bar:first").text();
                if(buff.indexOf(text) == -1){
                    return true;
                }
                else{
                    return false;
                }
            },
            lianzhao_concat:function(){
                var autopf = "";
                if(auto_perform2 != undefined && auto_perform2 != ""){
                    var pfm = auto_perform2.split(",");
                    var buff_text;
                    var buff_pfm;
                    for(var j = 0;j < pfm.length; j++){
                        try{
                            buff_text = pfm[j].match(":([^%]+)")[1];
                            buff_pfm = pfm[j].match("([^%]+):")[1];
                        }
                        catch(error){
                            messageAppend("连招二格式错误，参考 force.xi:紫气东来,sword.wu:无招 逗号和冒号均为英文符号",2);
                            return;
                        }
                        if(WG.buff_not_exist(buff_text)){
                            autopf = autopf.concat(buff_pfm+",")
                        }
                    }
                }
                if(G.skills.indexOf("parry.wu") != -1){
                    if(WG.buff_not_exist("祝融") && WG.buff_not_exist("芙蓉") && WG.buff_not_exist("天柱") && WG.buff_not_exist("鹤翔") && WG.buff_not_exist("石廪")){
                        autopf = autopf.concat("parry.wu,")
                    }
                }
                if(auto_perform != undefined && auto_perform != ""){
                    pfm = auto_perform.split(',');
                    for(j = 0;j < pfm.length; j++){
                        if(G.skills.indexOf(pfm[j]) != -1){
                            autopf = autopf.concat(pfm[j]+",")
                        }
                    }
                }
                autopf = autopf.substr(0, autopf.length-1)
                //messageAppend("当前自动出招是"+autopf)
                WG.Send("setting auto_pfm "+autopf);
            },
            lianzhaoyi: function () {
                if(auto_perform == undefined || auto_perform == ""){return};
                if(G.skills.indexOf("parry.wu")){
                    if(WG.buff_not_exist("祝融") && WG.buff_not_exist("芙蓉") && WG.buff_not_exist("天柱") && WG.buff_not_exist("鹤翔") && WG.buff_not_exist("石廪")){
                        WG.Send("perform parry.wu")
                    }
                }
                var pfm = auto_perform.split(',');
                for(var j = 0;j < pfm.length; j++){
                    if(!G.gcd && !G.cds.get(pfm[j]) && G.skills.indexOf(pfm[j]) != -1){
                        WG.Send("perform "+pfm[j])
                    }
                }
            },
            lianzhaoer: function () {
                if(auto_perform2 == undefined || auto_perform2 == ""){return};
                var pfm = auto_perform2.split(",");
                var buff_text;
                var buff_pfm;
                for(var j = 0;j < pfm.length; j++){
                    try{
                        buff_text = pfm[j].match(":([^%]+)")[1];
                        buff_pfm = pfm[j].match("([^%]+):")[1];
                    }
                    catch(error){
                        messageAppend("连招二格式错误，参考 force.xi:紫气东来,sword.wu:无招 逗号和冒号均为英文符号",2);
                        return;
                    }
                    if(WG.buff_not_exist(buff_text) && !G.gcd && !G.cds.get(buff_pfm) && G.skills.indexOf(buff_pfm) != -1){
                        WG.Send("perform "+buff_pfm);
                    }
                }
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
                //更换追捕装，如果没有记录则会更换战斗装
                Helper.eqwear(5);
                xtime[0] = setTimeout(function(){WG.go("扬州城-衙门正厅");}, 1000);
                xtime[0] = setTimeout(WG.getTask, 3800);
            },
            getTask: function () {
                WG.ask(1,"扬州知府 程药发");
                xtime[1] = setTimeout(function(){KEY.do_command("tasks");KEY.do_command("tasks");}, 500);
                xtime[1] = setTimeout(function(){WG.check_yamen_task();}, 1200);
            },
            check_yamen_task: function () {
                for(xx in xtime){clearTimeout(xtime[xx])}
                var task = $(".dialog-tasks").html();
                var task_1 = task.indexOf("<hir>衙门追捕</hir>")
                var task_2 = task.indexOf("<hiw>运镖</hiw>")
                task = task.substr(task_1, task_2-task_1)
                //查看任务如果已经完成了20个，则结束衙门任务，去签到
                try{var rws = task.match("目前([^%]+)，共")[1];
                   }
                catch(error){
                    setTimeout(function(){WG.check_yamen_task();}, 1000);
                    return;
                }
                var rwlx = parseInt(task.match("共连续完成([^%]+)个")[1]);
                if(ymrwlimit != 0 && rwlx >= ymrwlimit){WG.ask(2,"扬州知府 程药发");WG.getTask();}
                if(rws == "完成20/20个"){WG.afterYm();return;}
                //如果没有完成20个，则开始衙门任务
                ymBOSS = null;
                try{zb_npc = task.match("犯：([^%]+)，据")[1];
                    zb_place = task.match("在([^%]+)出")[1];
                   }
                catch(error){WG.getTask();return;}
                tip("追捕" +"：" + zb_npc + " " + zb_place);
                while(zb_place == "武当派-林间小径"){ WG.ymwdLJ();return; }
                while(zb_place == "武当派-后山小院"){ WG.ymwdHS();return; }
                while(zb_place == "峨嵋派-走廊"){ WG.ymemZL();return; }
                while(zb_place == "丐帮-暗道"){ WG.ymgbAD();return; }
                while(zb_place == "逍遥派-林间小道"){ WG.ymxyXD();return; }
                while(zb_place == "少林派-竹林"){ WG.ymslZL();return; }
                while(zb_place == "逍遥派-地下石室"){ WG.ymxySS();return; }
                while(zb_place == "逍遥派-木屋"){ WG.ymxyMW();return; }
                while(zb_place == "华山派-镇岳宫"){ WG.ymhsZY();return; }
                while(zb_place == "华山派-苍龙岭"){ WG.ymhsZY();return; }
                while(zb_place == "华山派-舍身崖"){ WG.ymhsZY();return; }
                while(zb_place == "华山派-峭壁"){ WG.ymhsZY();return; }
                while(zb_place == "华山派-山谷"){ WG.ymhsSG();return; }
                while(zb_place == "华山派-山间平地"){ WG.ymhsSG();return; }
                while(zb_place == "华山派-林间小屋"){ WG.ymhsSG();return; }
                WG.go(zb_place);
                xtime[0] = setTimeout(function(){WG.zhaoymBoss(2)},1000);
            },

            /////////////////////////////////////////////////////////////衙门任务1分钟找不到开启planB，遍历整个门派////////////////////////////////////////////////////
            yamen_task_planB:function(){
                SaohuangIndex = 0;
                var zb_family = zb_place.substr(0, 2)
                switch(zb_family){
                    case "武当":WG.yamen_task_wudang();break;
                    case "少林":WG.yamen_task_shaolin();break;
                    case "华山":WG.yamen_task_huashan();break;
                    case "峨嵋":WG.yamen_task_emei();break;
                    case "峨眉":WG.yamen_task_emei();break;
                    case "逍遥":WG.yamen_task_xiaoyao();break;
                    case "丐帮":WG.yamen_task_gaibang();break;
                }
                tip("启动planB，开始遍历"+zb_family);
            },
            yamen_task_wudang:function(){
                WG.zhaoymBoss(1);
                if(ymBOSS != null){return;};
                switch(SaohuangIndex){
                    case 0: WG.go("武当派-广场");break;
                    case 1: WG.Send("go north");break;
                    case 2: WG.Send("go south;go west");break;
                    case 3: WG.Send("go west");break;
                    case 4: WG.Send("go east;go northup");break;
                    case 5: WG.Send("go north");break;
                    case 6: WG.Send("go east");break;
                    case 7: WG.Send("go west;go west");break;
                    case 8: WG.Send("go northup");break;
                    case 9: WG.Send("go northup");break;
                    case 10:WG.Send("go northup");break;
                    case 11:WG.Send("go north");break;
                    case 12:WG.Send("go north");break;
                    case 13:WG.Send("go north");break;
                    case 14:WG.Send("go north");break;
                    case 15:WG.Send("go north");break;
                    case 16:WG.Send("go north");break;
                    case 17:WG.Send("go north");break;
                }
                if(SaohuangIndex < 17){
                    SaohuangIndex ++;
                    xtime[0] = setTimeout(function(){WG.yamen_task_wudang()},500);
                }
                else{
                    WG.check_yamen_task();
                }
            },
            yamen_task_shaolin:function(){
                WG.zhaoymBoss(1);
                if(ymBOSS != null){return;};
                switch(SaohuangIndex){
                    case 0: WG.go("少林派-广场");break;
                    case 1: WG.Send("go north");break;
                    case 2: WG.Send("go west");break;
                    case 3: WG.Send("go east;go east");break;
                    case 4: WG.Send("go west;go north");break;
                    case 5: WG.Send("go northup");break;
                    case 6: WG.Send("go southdown;go northwest");break;
                    case 7: WG.Send("go southeast;go northeast");break;
                    case 8: WG.Send("go northwest");break;
                    case 9: WG.Send("go north");break;
                    case 10:WG.Send("go west");break;
                    case 11:WG.Send("go east;go east");break;
                    case 12:WG.Send("go west;go north");break;
                    case 13:WG.Send("go west");break;
                    case 14:WG.Send("go east;go east");break;
                    case 15:WG.Send("go west;go north");break;
                    case 16:WG.Send("go west");break;
                    case 17:WG.Send("go east;go north");break;
                    case 18:WG.Send("go north");break;
                }
                if(SaohuangIndex < 18){
                    SaohuangIndex ++;
                    xtime[0] = setTimeout(function(){WG.yamen_task_shaolin()},500);
                }
                else{
                    WG.check_yamen_task();
                }
            },
            yamen_task_huashan:function(){
                WG.zhaoymBoss(1);
                if(ymBOSS != null){return;};
                switch(SaohuangIndex){
                    case 0: WG.go("华山派-镇岳宫");break;
                    case 1: WG.Send("go westup");break;
                    case 2: WG.Send("go west");break;
                    case 3: WG.Send("go east;go north");break;
                    case 4: WG.Send("go east");break;
                    case 5: WG.Send("go west;go north");break;
                    case 6: WG.Send("go east");break;
                    case 7: WG.Send("go west;go north");break;
                    case 8: WG.Send("go south;go south;go south;go south;");break;
                    case 9: WG.Send("go southup");break;
                    case 10:WG.Send("go southup");break;
                    case 11:WG.Send("break bi;go enter");break;
                    case 12:WG.Send("go westup");break;
                    case 13:WG.Send("go westup");break;
                    case 14:WG.Send("jumpup");break;
                    case 15:WG.go("华山派-苍龙岭");break;
                    case 16:WG.Send("go southup");break;
                    case 17:WG.Send("jumpdown");break;
                    case 18:WG.Send("go southup");break;
                    case 19:WG.Send("go south");break;
                    case 20:WG.Send("go east");break;
                }
                if(SaohuangIndex < 20){
                    SaohuangIndex ++;
                    xtime[0] = setTimeout(function(){WG.yamen_task_huashan()},500);
                }
                else{
                    WG.check_yamen_task();
                }
            },
            yamen_task_emei:function(){
               WG.zhaoymBoss(1);
                if(ymBOSS != null){return;};
                switch(SaohuangIndex){
                    case 0: WG.go("峨嵋派-金顶");break;
                    case 1: WG.Send("go northup");break;
                    case 2: WG.Send("go east");break;
                    case 3: WG.go("峨嵋派-庙门");break;
                    case 4: WG.Send("go south");break;
                    case 5: WG.Send("go south");break;
                    case 6: WG.Send("go north;go east");break;
                    case 7: WG.Send("go south");break;
                    case 8: WG.Send("go north;go east");break;
                    case 9: WG.Send("go west;go west;go west");break;
                    case 10:WG.Send("go west");break;
                    case 11:WG.Send("go east");break;
                    case 12:WG.Send("go south");break;
                    case 13:WG.Send("go south");break;
                    case 14:WG.Send("go north;go north;go north");break;
                    case 15:WG.Send("go north");break;
                }
                if(SaohuangIndex < 15){
                    SaohuangIndex ++;
                    xtime[0] = setTimeout(function(){WG.yamen_task_emei()},500);
                }
                else{
                    WG.check_yamen_task();
                }
            },
            yamen_task_xiaoyao:function(){
               WG.zhaoymBoss(1);
                if(ymBOSS != null){return;};
                switch(SaohuangIndex){
                    case 0: WG.go("逍遥派-木屋");break;
                    case 1: WG.Send("go south");break;
                    case 2: WG.Send("go south");break;
                    case 3: WG.Send("go south");break;
                    case 4: WG.Send("go south");break;
                    case 5: WG.Send("go north;go north;go west");break;
                    case 6: WG.Send("go south");break;
                    case 7: WG.Send("go north;go east;go east");break;
                    case 8: WG.Send("go north");break;
                    case 9: WG.Send("go south;go south");break;
                    case 10:WG.Send("go south");break;
                    case 11:WG.Send("go north;go north;go west;go down");break;
                    case 12:WG.Send("go down");break;
                }
                if(SaohuangIndex < 12){
                    SaohuangIndex ++;
                    xtime[0] = setTimeout(function(){WG.yamen_task_xiaoyao()},500);
                }
                else{
                    WG.check_yamen_task();
                }
            },
            yamen_task_gaibang:function(){
                WG.zhaoymBoss(1);
                if(ymBOSS != null){return;};
                switch(SaohuangIndex){
                    case 0: WG.go("丐帮-树洞内部");break;
                    case 1: WG.Send("go down");break;
                    case 2: WG.Send("go east");break;
                    case 3: WG.Send("go east");break;
                    case 4: WG.Send("go east");break;
                    case 5: WG.Send("go up");break;
                    case 6: WG.Send("go down;go east");break;
                    case 7: WG.Send("go east");break;
                    case 8: WG.Send("go up");break;
                }
                if(SaohuangIndex < 8){
                    SaohuangIndex ++;
                    xtime[0] = setTimeout(function(){WG.yamen_task_gaibang()},500);
                }
                else{
                    WG.check_yamen_task();
                }
            },

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            zhaoymBoss: function (d){
                var lists = $(".room_items .room-item");
                for (var npc of lists) {
                    if (npc.innerText.indexOf(zb_npc) != -1) {
                        for(xx in xtime){clearTimeout(xtime[xx])}
                        ymBOSS =$(npc).attr("itemid");
                        WG.killymBoss();
                        return;
                    }}
                if(d!=1){WG.yamen_task_planB();}
            },
            killymBoss: function () {
                WG.Send("kill " + ymBOSS);
                xtime[0] = setTimeout(function(){KEY.do_command("tasks");KEY.do_command("tasks");}, 4000);
                xtime[1] = setTimeout(function(){WG.yamen_boss_check();}, 5000);
                //xtime[2] = setTimeout(function(){WG.wudao_autopfm();}, 2000);
            },
            yamen_boss_check:function(){
                var task = $(".dialog-tasks").html();
                var task_1 = task.indexOf("<hir>衙门追捕</hir>")
                var task_2 = task.indexOf("<hiw>运镖</hiw>")
                var rwss = task.substr(task_1, task_2-task_1)
                if(rwss.indexOf("追杀逃犯：目前") != -1){
                    var rws = rwss.match("目前([^%]+)，共")[1];
                    if(rws == "完成20/20个"){
                        WG.afterYm();
                    }else{
                        WG.huiK();
                    }
                }
                else{
                    let item = G.items.get(G.id)
                    if(item.hp == 0){
                        WG.Send("relive");
                        xtime[0] = setTimeout(function(){WG.huiK();}, 2000);
                        tip("没打赢逃犯，挂啦！");
                    }
                    else{
                        let item = G.items.get(ymBOSS)
                        if(item){
                            xtime[0] = setTimeout(function(){KEY.do_command("tasks");KEY.do_command("tasks");}, 1000);
                            xtime[0] = setTimeout(function(){WG.yamen_boss_check();}, 2000);
                        }
                        else{
                            WG.check_yamen_task();
                        }
                    }
                }
            },
            huiK: function(){
                var xue =$("div.progress-bar:first").attr("style");
                var lan =$("div.progress-bar:eq(1)").attr("style");
                var xue_safe = 99;
                if(G.skills.indexOf("blade.xue") != -1){xue_safe = 0}
                xue = xue.substr(6,4);
                xue = parseInt(xue);
                lan = lan.substr(6,4);
                lan = parseInt(lan);
                if(xue > xue_safe && lan > 50){
                    //追捕冷却时间如果在10秒内则不去挖矿，防止换铁镐无法换回来
                    if(ZhuiBuCD > 10000){
                        WG.zdwk();
                    }
                    myTime[3] = setTimeout(function(){WG.go_yamen_task();}, ZhuiBuCD);
                }
                else{
                    WG.liaoshang();
                    xtime[2] = setTimeout(function(){WG.huiK();}, 5500);
                }
            },
            afterYm: function(){
                rwResult =rwResult.concat("衙门任务20/20。");
                WG.allStop();
                xtime[1] = setTimeout(function(){WG.qiandao();},2000);
                xtime[1] = setTimeout(function(){WG.sortout_pack();},5000);
            },
            ////////////////////////////////////
            ////////////////////////////////////
            /////////    衙门寻图       ////////
            ////////////////////////////////////华山派-舍身崖
            ////////////////////////////////////

            ymemZL: function(){
                WG.go("峨嵋派-走廊");
                xtime[0] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go west;go west");}, 800)
                xtime[1] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north");}, 1600);
                xtime[2] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go south;go south");}, 2400);
                xtime[3] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go south");}, 3200);
                xtime[4] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north;go north;go west");}, 4000)
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go east;go north;go north");}, 4800);
                xtime[6] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go south;go south;go east");}, 5600);
                xtime[7] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go east;go south");}, 6400);
                xtime[8] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north;go east");}, 7200);
                xtime[9] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go west;go north");}, 8000);
                xtime[10] =setTimeout(function(){WG.zhaoymBoss(0);}, 8800);
            },
            ymwdHS: function(){
                WG.go("武当派-虎头岩");
                xtime[0] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north;go north;go north"); }, 1000);
                xtime[1] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north"); }, 2000);
                xtime[2] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north"); }, 2500);
                xtime[3] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north"); }, 3000);
                xtime[4] =setTimeout(function(){WG.zhaoymBoss(0);}, 3200);
            },
            ymwdLJ: function(){
                WG.go("武当派-虎头岩");
                xtime[0] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north;go north;go north"); }, 1000);
                xtime[1] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north"); }, 2000);
                xtime[2] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north"); }, 2500);
                xtime[3] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north"); }, 3000);
                xtime[4] =setTimeout(function(){WG.zhaoymBoss(0);}, 3200);
            },
            ymslZL: function(){
                WG.go("少林派-竹林");
                xtime[0] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north"); }, 800);
                xtime[1] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north"); }, 1600);
                xtime[2] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go south;go south;go south"); }, 2400);
                xtime[3] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north;go west"); }, 3200);
                xtime[4] =setTimeout(function(){WG.zhaoymBoss(0);}, 4000);
            },
            ymxyXD: function(){
                WG.go("逍遥派-林间小道");
                xtime[0] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go west;go west"); }, 800);
                xtime[1] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go east;go north"); }, 1600);
                xtime[2] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go south;go south"); }, 2400);
                xtime[3] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go south");}, 3200);
                xtime[4] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north;go north");}, 4000)
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go west;go south");}, 4800);
                xtime[6] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north;go east;go north;go north");}, 5600);
                xtime[7] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go south;go south;go east;go north");}, 6400);
                xtime[8] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go south;go south");}, 7200);
                xtime[9] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go south");}, 8000);
                xtime[10] =setTimeout(function(){WG.zhaoymBoss(0);}, 8800);
            },
            ymgbAD: function(){
                WG.go("丐帮-暗道");
                xtime[0] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go east;"); }, 800);
                xtime[1] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go east;go east"); }, 1600);
                xtime[2] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go east"); }, 2400);
                xtime[3] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go up;"); }, 3200);
                xtime[4] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go down;go west;go west"); }, 4000);
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go up"); }, 4800);
                xtime[6] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go down;go west;go west;go west"); }, 5600);
                xtime[7] =setTimeout(function(){WG.zhaoymBoss(0);},6400);
            },
            ymxyMW: function(){
                WG.go("逍遥派-木屋");
                xtime[0] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go south;go south;go south;go south"); }, 800);
                xtime[1] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north"); }, 1600);
                xtime[2] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go north;go north"); }, 2400);
                xtime[3] =setTimeout(function(){WG.zhaoymBoss(0);}, 3200);
            },
            ymxySS: function(){
                WG.go("逍遥派-地下石室");
                xtime[0] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go down"); }, 800);
                xtime[1] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go up;go up"); }, 1600);
                xtime[2] =setTimeout(function(){WG.zhaoymBoss(0);}, 2400);
            },
            ymhsZY: function(){
                WG.go("华山派-镇岳宫");
                xtime[0] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go westup;"); }, 800);
                xtime[1] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go eastdown;go eastup"); }, 1600);
                xtime[2] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go southup"); }, 2400);
                xtime[3] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("jumpdown;"); }, 3200);
                xtime[4] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go southup"); }, 4000);
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(0);}, 4800);
            },
            ymhsSG: function(){
                WG.go("华山派-山谷");
                xtime[0] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go northdown;"); }, 800);
                xtime[1] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go southup;go south"); }, 1600);
                xtime[2] =setTimeout(function(){WG.zhaoymBoss(1);if(ymBOSS != null){return;}WG.Send("go east"); }, 2400);
                xtime[3] =setTimeout(function(){WG.zhaoymBoss(0);}, 3200);
            },
            /////////////////////////////
            //////////////////////////////
            //////   自动挖矿练习   /////
            ////////////////////////////

            wkzidong: function (){
                WG.Send("stopstate");
                Doing = "挖矿"
                xx=0;
                WG.zdwk();
            },
            //////////////////////////////
            //////   抓boss     /////////
            ////////////////////////////
            go_boss: async function(data){
                for(xx in xtime){clearTimeout(xtime[xx])};
                zb_place =  data.content.match("出现在([^%]+)一带。")[1];
                zb_npc = data.content.match("听说([^%]+)出现在")[1];
                tip("boss：" + zb_npc + zb_place );
                BOSS = null;
                WG.Send("stopstate")
                if(zb_npc == "枯荣大师" || zb_npc == "天山童姥"){WG.zhandouzhuang();WG.sleep(4000)}else{Switch.AutoPerformSwitch(1);}
                ktime[0] = setTimeout(function(){
                    while(zb_place == "武当派-林间小径"){ WG.wdLJ();return; }
                    while(zb_place == "武当派-后山小院"){ WG.wdHY();return; }
                    while(zb_place == "峨嵋派-走廊"){ WG.emZL();return; }
                    while(zb_place == "丐帮-暗道"){ WG.gbAD();return; }
                    while(zb_place == "逍遥派-林间小道"){ WG.xyXD();return; }
                    while(zb_place == "少林派-竹林"){ WG.slZL();return; }
                    while(zb_place == "逍遥派-地下石室"){ WG.xySS();return; }
                    while(zb_place == "逍遥派-木屋"){ WG.xyMW();return; }
                    WG.go(zb_place);
                }, 1000);
                ktime[1] = setTimeout(function(){WG.zhaoBoss(0);}, 2000);
            },
            zhaoBoss: function (s){
                for(var i = 0; i < roomData.length;i++){
                    if(roomData[i].name){
                        if (roomData[i].name.indexOf(zb_npc) != -1 && roomData[i].hp) {
                            BOSS = roomData[i].id
                            console.log("找到" + zb_npc);
                            WG.kill_boss();
                            return;
                        }
                    }
                }
                if(s!=1){WG.Goback();}
            },
            Goback: function (){
                console.log("找不到" + zb_npc);
                ktime[1] =setTimeout(function(){
                    WG.afterBossBack();
                }, 5000);
            },

            kill_boss: function (){
                for(xx in ktime){clearTimeout(ktime[xx]);}
                //查询自己是否死亡，如果血量为0表示已死亡，复活结束BOSS战
                let item = G.items.get(G.id)
                if(item.hp == 0){
                    WG.Send("relive");
                    ktime[1] =setTimeout(function(){WG.liaoshang();WG.afterBoss();}, 2000);
                    return;
                }
                //查询BOSS是否存在，如果不存在说明已被击杀
                let target = G.items.get(BOSS)
                if(target){
                    if(!Helper.in_fight){
                        if(zb_npc == "枯荣大师" || zb_npc == "天山童姥"){
                            messageAppend("boss的血量百分比是"+target.hp / target.max_hp)
                            if(target.hp / target.max_hp <= 0.99){
                                WG.Send("kill "+BOSS)
                            }
                        }
                        else{
                            WG.Send("kill "+BOSS)
                        }
                    }
                }
                else{
                    if(!Helper.in_fight){
                        messageAppend("BOSS战结束")
                        WG.get_all();
                        ktime[1] =setTimeout(function(){WG.liaoshang();WG.afterBoss();}, 2000);
                        return;
                    }
                }
                ktime[0] =setTimeout(function(){WG.kill_boss()}, 2000)
            },
            afterBoss: function(){
                clearTimeout(ktime[4]);
                BOSS = null;
                var xue =$("div.progress-bar:first").attr("style");
                xue = xue.substr(6,4);
                xue = parseInt(xue);
                tip(xue);
                if(xue > 99){
                    ktime[3] =setTimeout(function(){ WG.afterBossBack(); }, 2000);}
                else{
                    WG.liaoshang();
                    ktime[4] =setTimeout(function(){ WG.afterBoss(); }, 6000);
                }},
            afterBossBack: function(){
                WG.Send("stopstate");
                switch(Doing){
                    case "练功": WG.practice_skill();break;
                    case "打坐": WG.auto_dazuo();break;
                    default: WG.zdwk();break;
                }
            },
            ////////////////////////////////////
            ////////////////////////////////////
            /////////    寻图           ////////
            ////////////////////////////////////
            ////////////////////////////////////

            emZL: function(){
                WG.go("峨嵋派-走廊");
                ktime[0] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go west;go west");}, 800);
                ktime[1] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go north");}, 1600);
                ktime[2] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go south;go south");}, 2400);
                ktime[3] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Goback();}, 3200);
            },
            wdLJ: function(){
                ktime[0] =setTimeout(function(){WG.go("武当派-林间小径"); }, 1000);
                ktime[1] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go north"); }, 1800);
                ktime[2] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Goback();}, 2600);
            },
            wdHY: function(){
                ktime[0] =setTimeout(function(){WG.go("武当派-虎头岩"); }, 1000);
                ktime[1] =setTimeout(function(){WG.Send("go north;go north;go north;go north;go north;go north;"); }, 2000);
                ktime[2] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Goback();}, 3000);
            },
            slZL: function(){
                WG.go("少林派-竹林");
                ktime[0] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go north"); }, 800);
                ktime[1] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Goback();}, 1600);
            },
            xyXD: function(){
                WG.go("逍遥派-林间小道");
                ktime[0] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go west;go west"); }, 800);
                ktime[1] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go east;go north"); }, 1600);
                ktime[2] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go south;go south"); }, 2400);
                ktime[3] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Goback();}, 3200);
            },
            gbAD: function(){
                WG.go("丐帮-暗道");
                ktime[0] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go east;"); }, 800);
                ktime[1] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go east;go east"); }, 1600);
                ktime[2] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go east"); }, 2400);
                ktime[3] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Goback();}, 3200);
            },
            xySS: function(){
                WG.go("逍遥派-地下石室");
                ktime[0] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go down"); }, 800);
                ktime[1] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Goback();}, 1600);
            },
            xyMW: function(){
                WG.go("逍遥派-木屋");
                xtime[0] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Send("go south;go south;go south;go south"); }, 800);
                ktime[1] =setTimeout(function(){WG.zhaoBoss(1);if(BOSS != null){return;}WG.Goback();}, 1600);
            },
            wdT:function() {
                clearTimeout(xtime[0]);
                WG.zhandouzhuang();
                WG.go("武道塔");
                messageClear();
                xtime[0]=setTimeout( function(){
                    var wdt = $(".content-message pre").text();
                    var ceng = wdt.match(/\d+/);
                    ceng = parseInt(ceng);
                    if(ceng > wdt_ceng){
                        WG.ask(1,"守门人");
                        WG.Send("go enter")}
                    else{
                        WG.Send("go enter")
                    }}, 400);
                xtime[0] =setTimeout(function(){WG.goWD();}, 2000);
            },
            goWD: function(){
                clearTimeout(xtime[0]);
                var cengs= $(".room_exits svg text:first").text();
                var zshuzi = new Array("一","二","三","四","五","六","七","八","九","十","第","层");
                var yshuzi = new Array("1","2","3","4","5","6","7","8","9","0","","");
                for(xx=0;xx<zshuzi.length;xx++){
                    cengs =cengs.replace(new RegExp(zshuzi[xx], 'g'), yshuzi[xx]);}
                if(cengs.length>2){ cengs =cengs.replace("0","")}
                cengs = parseInt(cengs);
                if(cengs<wdt_ceng_ms){WG.wudao_auto();} ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////秒杀层
                else{
                    if(cengs<=wdt_ceng){xtime[0] =setTimeout(function(){WG.wudao_auto2();}, 3000);}//////////////////////////////////////////////////////////////////////////////力战层
                    else{
                        xtime[0] =setTimeout(function(){WG.Send("go out");WG.ask(2,"守门人");WG.ask(3,"守门人");}, 3000);tip("武道塔完成");
                        xtime[0] =setTimeout(function(){WG.go_family();}, 15000)
                    }
                }//////////////////////////////////////////////////////////////////////////////////////////////////////////////不敌层
            },
            wudao_auto: function () {
                clearTimeout(xtime[1]);
                var wdt_guard = $(".room_items .room-item:last").attr("itemid");
                if (wdt_guard != G.id) {
                    if(!Helper.in_fight){WG.Send("kill " + wdt_guard)}else{
                        //WG.wudao_autopfm()
                    }
                    xtime[1] =setTimeout(function(){WG.wudao_auto();}, 1000);
                }
                else {
                    WG.Send("go up");
                    xtime[1] =setTimeout(function(){WG.goWD();}, 1500);
                }
            },
            wudao_auto2:function(){  //一秒扫描一次武道塔守护者是否存在，如果还存在就使用技能，如果不存在就去疗伤
                clearTimeout(xtime[1]);
                if(Helper.in_fight){
                    //WG.wudao_autopfm()
                }
                else{
                    var wdt_guard = $(".room_items .room-item:last").attr("itemid");
                    let item = G.items.get(G.id)
                    if(in_busy == 0){
                        //区分是否用血刀，用血刀的不管血量只看血刀cd好了直接打，不用血刀的血不满去疗伤
                        if(G.skills.indexOf("blade.xue") != -1){
                            if(!G.cds.get("blade.xue") && wdt_guard == G.id){
                                messageAppend("有血刀无需疗伤",1)
                                WG.Send("go up");
                                WG.goWD();
                                return;
                            }
                            else if(wdt_guard != G.id){
                                WG.Send("kill " + wdt_guard)
                            }
                        }
                        else if(item.hp != item.max_hp || wdt_guard == G.id){
                            messageAppend("去疗伤",1)
                            xtime[1] =setTimeout(function(){WG.liaoshang();WG.checkZT();}, 1000)
                            return;
                        }
                        else{
                            WG.Send("kill " + wdt_guard)
                        }
                    }
                }
                xtime[1] =setTimeout(function(){WG.wudao_auto2();}, 1000);
            },
            wudao_autopfm: function () {
                clearTimeout(nCTime[0]);
                if(Helper.in_fight && autoperform == "开启"){
                    nCTime[0] = setTimeout(function(){
                        WG.lianzhaoer();
                        if(auto_perform3 == undefined){auto_perform3 = ""};
                        let item  = G.items.get(G.scid)
                        if(item != undefined){
                            var buff =eval("$('[itemid="+G.scid+"]').find('.item-status-bar').text()");
                            if(buff.indexOf("凌波") != -1){
                                WG.wudao_autopfm();
                                return;
                            }
                        }
                        var pfm = G.skills.split(',');
                        for(var j = 0;j < pfm.length; j++){
                            if(!G.gcd && !G.cds.get(pfm[j]) && auto_perform3.indexOf(pfm[j]) == -1){
                                WG.Send("perform "+pfm[j]);
                                break;
                            }
                        }
                        WG.wudao_autopfm();
                    }, 300);
                }
                else{
                    messageAppend("自动出招停止");
                }
            },
            checkZT:function() {
                clearTimeout(xtime[3]);
                var xue =$("div.progress-bar:first").attr("style");
                var xue_safe = 99;
                if(G.skills.indexOf("blade.xue") != -1){xue_safe = 0}
                xue = xue.substr(6,4);
                xue = parseInt(xue);
                if(xue > xue_safe){
                    if(wdTCD > 10000){
                        xtime[3] =setTimeout(function(){WG.zdwk(); }, 2000);
                    }
                    myTime[0] =setTimeout(function(){
                        WG.Send("stopstate");
                        WG.go("武道塔");
                        WG.Send("go enter");
                        WG.zhandouzhuang();
                        xtime[3] =setTimeout(function(){ WG.goWD(); }, 1500);
                    }, wdTCD);
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
                //关闭临时hook
                WG.remove_hook(this.hslj);
                tip("已停止所有定时器")
            },
            /////////////////////////////////////////
            /////////////////////////////////////////

            kill_all: function () {
                for(var i = 0;i < roomData.length;i++){
                    var dontkill = 0
                    if(roomData[i].hp && !roomData[i].p){
                        for(xx in heimingdan){
                            if (roomData[i].name.indexOf(heimingdan[xx]) != -1) {
                                dontkill = 1
                                break;
                            }
                        }
                        if(dontkill == 0){WG.Send("kill "+roomData[i].id)}
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
            wuxingzhuang:async function () {
                WG.Send("stopstate");
                Helper.eqwear(2);
            },
            zhandouzhuang:async function () {
                WG.Send("stopstate");
                Helper.eqwear(1);
            },
            sell_all: function () {
                WG.Send("stopstate");
                WG.go("扬州城-当铺");
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
                if(Doing == "挖矿" || Doing == "练功" || Doing == "打坐"){Doing = "挖矿";tip("挖矿中，可触发自动boss自动喜宴")}
                var roomtitle = $('.room_items .room-item:first .item-name').text()
                if(roomtitle.indexOf("武帝") != -1 || roomtitle.indexOf("武神") != -1){
                    WG.go("住房-练功房");
                    setTimeout(function(){WG.Send("xiulian")}, 500);
                }
                else{
                    WG.go("扬州城-矿山");
                    WG.Send("eq "+kuanggao);
                    WG.Send("wa");
                    if(role == "矿场工头"){
                        WG.wakuangzn();
                    }
                }
            },
            wakuangzn:function(){
                var monitor = 0;
                var zhinan = 0;
                var zhinan_last = 0;
                var zhinan_base = 40;
                var datelast = new Date();
                var time_minute = 0;
                var time_second = 0;
                mpz_time_wd = GM_getValue(role + "_mpz_time_wd", mpz_time_wd);
                mpz_time_em = GM_getValue(role + "_mpz_time_em", mpz_time_em);
                mpz_time_sl = GM_getValue(role + "_mpz_time_sl", mpz_time_sl);
                mpz_time_hs = GM_getValue(role + "_mpz_time_hs", mpz_time_hs);
                mpz_time_xy = GM_getValue(role + "_mpz_time_xy", mpz_time_xy);
                mpz_time_gb = GM_getValue(role + "_mpz_time_gb", mpz_time_gb);
                mpz_msg = GM_getValue(role + "_mpz_msg", mpz_msg);
                var timeMarry = new Date();
                this.wkzn = WG.add_hook(["text", "msg", "room"], function (data) {
                    if(data.type == "text"){
                        if(data.msg.indexOf("<hig>你获得了") != -1){
                            var exp = data.msg.match("了([^%]+)点经验")[1]
                            if(exp >= 160){return}
                            var datenow = new Date();
                            zhinan = parseInt((exp - zhinan_base) / 10)*10
                            if(zhinan != zhinan_last){
                                if(zhinan == 0 && zhinan_last != 0){
                                    WG.Send("chat 挖矿指南已结束！！！！！！！！！")
                                }
                                zhinan_last = zhinan;
                                datelast = datenow;
                                time_minute = 0;
                                time_second = 0;
                                if(zhinan != 0){
                                    //刚启动时不确定时间不播报
                                    if(monitor == 0){
                                        monitor = 1;
                                        return;
                                    }
                                    WG.Send("chat 当前的挖矿指南是+"+zhinan+"，已持续"+time_minute+"分"+time_second+"秒")
                                }
                            }
                        }
                    }
                    else if(data.type == "msg"){
                        if(data.ch == "sys"){
                            if(data.content.indexOf("今日大婚，在醉仙楼大摆宴席") != -1){
                                timeMarry = new Date();
                            }
                        }
                        else if(data.ch == "chat"){
                            if(data.name == "岳不群"){
                                var hs_vs = data.content.match(/^[\u0391-\uFFE5]+门下/)
                                if(hs_vs){
                                    mpz_time_hs = new Date();
                                    hs_vs = hs_vs[0].substr(0, 2)
                                    messageAppend("收集到新的门派战信息，华山VS"+hs_vs, 1)
                                    if(mpz_msg.length >= 20){mpz_msg = ""}
                                    switch(hs_vs){
                                        case "武当":
                                            mpz_time_wd = mpz_time_hs
                                            mpz_msg = mpz_msg+"华山VS武当 "
                                            break;
                                        case "少林":
                                            mpz_time_sl = mpz_time_hs
                                            mpz_msg = mpz_msg+"华山VS少林 "
                                            break;
                                        case "逍遥":
                                            mpz_time_xy = mpz_time_hs
                                            mpz_msg = mpz_msg+"华山VS逍遥 "
                                            break;
                                        case "丐帮":
                                            mpz_time_gb = mpz_time_hs
                                            mpz_msg = mpz_msg+"华山VS丐帮 "
                                            break;
                                        case "峨眉":
                                            mpz_time_em = mpz_time_hs
                                            mpz_msg = mpz_msg+"华山VS峨眉 "
                                            break;
                                    }
                                    GM_setValue(role + "_mpz_time_wd", mpz_time_wd);
                                    GM_setValue(role + "_mpz_time_hs", mpz_time_hs);
                                    GM_setValue(role + "_mpz_time_em", mpz_time_em);
                                    GM_setValue(role + "_mpz_time_xy", mpz_time_xy);
                                    GM_setValue(role + "_mpz_time_sl", mpz_time_sl);
                                    GM_setValue(role + "_mpz_time_gb", mpz_time_gb);
                                    GM_setValue(role + "_mpz_msg", mpz_msg);
                                }
                            }
                            else if(data.name == "张三丰"){
                                var wd_vs  = data.content.match(/^[\u0391-\uFFE5]+门下/)
                                if(wd_vs){
                                    mpz_time_wd = new Date();
                                    wd_vs = wd_vs[0].substr(0, 2)
                                    messageAppend("收集到新的门派战信息，武当VS"+wd_vs, 1)
                                    if(mpz_msg.length >= 20){mpz_msg = ""}
                                    switch(wd_vs){
                                        case "华山":
                                            mpz_time_hs = mpz_time_wd
                                            mpz_msg = mpz_msg+"武当VS华山 "
                                            break;
                                        case "少林":
                                            mpz_time_sl = mpz_time_wd
                                            mpz_msg = mpz_msg+"武当VS少林 "
                                            break;
                                        case "逍遥":
                                            mpz_time_xy = mpz_time_wd
                                            mpz_msg = mpz_msg+"武当VS逍遥 "
                                            break;
                                        case "丐帮":
                                            mpz_time_gb = mpz_time_wd
                                            mpz_msg = mpz_msg+"武当VS丐帮 "
                                            break;
                                        case "峨眉":
                                            mpz_time_em = mpz_time_wd
                                            mpz_msg = mpz_msg+"武当VS峨眉 "
                                            break;
                                    }
                                    GM_setValue(role + "_mpz_time_wd", mpz_time_wd);
                                    GM_setValue(role + "_mpz_time_hs", mpz_time_hs);
                                    GM_setValue(role + "_mpz_time_em", mpz_time_em);
                                    GM_setValue(role + "_mpz_time_xy", mpz_time_xy);
                                    GM_setValue(role + "_mpz_time_sl", mpz_time_sl);
                                    GM_setValue(role + "_mpz_time_gb", mpz_time_gb);
                                    GM_setValue(role + "_mpz_msg", mpz_msg);
                                }
                            }
                            else if(data.name == "灭绝"){
                                var em_vs  = data.content.match(/^[\u0391-\uFFE5]+欺人/)
                                if(em_vs){
                                    mpz_time_em = new Date();
                                    em_vs = em_vs[0].substr(0, 2)
                                    messageAppend("收集到新的门派战信息，峨眉VS"+em_vs, 1)
                                    if(mpz_msg.length >= 20){mpz_msg = ""}
                                    switch(em_vs){
                                        case "华山":
                                            mpz_time_hs = mpz_time_em
                                            mpz_msg = mpz_msg+"峨眉VS华山 "
                                            break;
                                        case "少林":
                                            mpz_time_sl = mpz_time_em
                                            mpz_msg = mpz_msg+"峨眉VS少林 "
                                            break;
                                        case "逍遥":
                                            mpz_time_xy = mpz_time_em
                                            mpz_msg = mpz_msg+"峨眉VS逍遥 "
                                            break;
                                        case "丐帮":
                                            mpz_time_gb = mpz_time_em
                                            mpz_msg = mpz_msg+"峨眉VS丐帮 "
                                            break;
                                        case "武当":
                                            mpz_time_wd = mpz_time_em
                                            mpz_msg = mpz_msg+"峨眉VS武当 "
                                            break;
                                    }
                                    GM_setValue(role + "_mpz_time_wd", mpz_time_wd);
                                    GM_setValue(role + "_mpz_time_hs", mpz_time_hs);
                                    GM_setValue(role + "_mpz_time_em", mpz_time_em);
                                    GM_setValue(role + "_mpz_time_xy", mpz_time_xy);
                                    GM_setValue(role + "_mpz_time_sl", mpz_time_sl);
                                    GM_setValue(role + "_mpz_time_gb", mpz_time_gb);
                                    GM_setValue(role + "_mpz_msg", mpz_msg);
                                }
                            }
                            else if(data.name == "洪七公"){
                                var gb_vs  = data.content.match(/^[\u0391-\uFFE5]+门下/)
                                if(gb_vs){
                                    mpz_time_gb = new Date();
                                    gb_vs = gb_vs[0].substr(0, 2)
                                    messageAppend("收集到新的门派战信息，丐帮VS"+gb_vs, 1)
                                    if(mpz_msg.length >= 20){mpz_msg = ""}
                                    switch(gb_vs){
                                        case "华山":
                                            mpz_time_hs = mpz_time_gb
                                            mpz_msg = mpz_msg+"丐帮VS华山 "
                                            break;
                                        case "少林":
                                            mpz_time_sl = mpz_time_gb
                                            mpz_msg = mpz_msg+"丐帮VS少林 "
                                            break;
                                        case "逍遥":
                                            mpz_time_xy = mpz_time_gb
                                            mpz_msg = mpz_msg+"丐帮VS逍遥 "
                                            break;
                                        case "峨眉":
                                            mpz_time_em = mpz_time_gb
                                            mpz_msg = mpz_msg+"丐帮VS峨眉 "
                                            break;
                                        case "武当":
                                            mpz_time_wd = mpz_time_gb
                                            mpz_msg = mpz_msg+"丐帮VS武当 "
                                            break;
                                    }
                                    GM_setValue(role + "_mpz_time_wd", mpz_time_wd);
                                    GM_setValue(role + "_mpz_time_hs", mpz_time_hs);
                                    GM_setValue(role + "_mpz_time_em", mpz_time_em);
                                    GM_setValue(role + "_mpz_time_xy", mpz_time_xy);
                                    GM_setValue(role + "_mpz_time_sl", mpz_time_sl);
                                    GM_setValue(role + "_mpz_time_gb", mpz_time_gb);
                                    GM_setValue(role + "_mpz_msg", mpz_msg);
                                }
                            }
                            else if(data.name == "逍遥子"){
                                var xy_vs  = data.content.match(/^[\u0391-\uFFE5]+门下/)
                                if(xy_vs){
                                    mpz_time_xy = new Date();
                                    xy_vs = xy_vs[0].substr(0, 2)
                                    messageAppend("收集到新的门派战信息，逍遥VS"+xy_vs, 1)
                                    if(mpz_msg.length >= 20){mpz_msg = ""}
                                    switch(xy_vs){
                                        case "华山":
                                            mpz_time_hs = mpz_time_xy
                                            mpz_msg = mpz_msg+"逍遥VS华山 "
                                            break;
                                        case "少林":
                                            mpz_time_sl = mpz_time_xy
                                            mpz_msg = mpz_msg+"逍遥VS少林 "
                                            break;
                                        case "丐帮":
                                            mpz_time_gb = mpz_time_xy
                                            mpz_msg = mpz_msg+"逍遥VS丐帮 "
                                            break;
                                        case "峨眉":
                                            mpz_time_em = mpz_time_xy
                                            mpz_msg = mpz_msg+"逍遥VS峨眉 "
                                            break;
                                        case "武当":
                                            mpz_time_wd = mpz_time_xy
                                            mpz_msg = mpz_msg+"逍遥VS武当 "
                                            break;
                                    }
                                    GM_setValue(role + "_mpz_time_wd", mpz_time_wd);
                                    GM_setValue(role + "_mpz_time_hs", mpz_time_hs);
                                    GM_setValue(role + "_mpz_time_em", mpz_time_em);
                                    GM_setValue(role + "_mpz_time_xy", mpz_time_xy);
                                    GM_setValue(role + "_mpz_time_sl", mpz_time_sl);
                                    GM_setValue(role + "_mpz_time_gb", mpz_time_gb);
                                    GM_setValue(role + "_mpz_msg", mpz_msg);
                                }
                            }
                            else if(data.name == "玄难"){
                                var sl_vs = data.content.match(/！[\u0391-\uFFE5]+门下/)
                                if(sl_vs){
                                    mpz_time_sl = new Date();
                                    sl_vs = sl_vs[0].substr(1, 2)
                                    messageAppend("收集到新的门派战信息，少林VS"+sl_vs, 1)
                                    if(mpz_msg.length >= 20){mpz_msg = ""}
                                    switch(sl_vs){
                                        case "华山":
                                            mpz_time_hs = mpz_time_sl
                                            mpz_msg = mpz_msg+"少林VS华山 "
                                            break;
                                        case "逍遥":
                                            mpz_time_xy = mpz_time_sl
                                            mpz_msg = mpz_msg+"少林VS逍遥 "
                                            break;
                                        case "丐帮":
                                            mpz_time_gb = mpz_time_sl
                                            mpz_msg = mpz_msg+"少林VS丐帮 "
                                            break;
                                        case "峨眉":
                                            mpz_time_em = mpz_time_sl
                                            mpz_msg = mpz_msg+"少林VS峨眉 "
                                            break;
                                        case "武当":
                                            mpz_time_wd = mpz_time_sl
                                            mpz_msg = mpz_msg+"少林VS武当 "
                                            break;
                                    }
                                    GM_setValue(role + "_mpz_time_wd", mpz_time_wd);
                                    GM_setValue(role + "_mpz_time_hs", mpz_time_hs);
                                    GM_setValue(role + "_mpz_time_em", mpz_time_em);
                                    GM_setValue(role + "_mpz_time_xy", mpz_time_xy);
                                    GM_setValue(role + "_mpz_time_sl", mpz_time_sl);
                                    GM_setValue(role + "_mpz_time_gb", mpz_time_gb);
                                    GM_setValue(role + "_mpz_msg", mpz_msg);
                                }
                            }
                            else if(data.content.match(/^mpz$/) || data.content.match(/^MPZ/)){
                                if(mpz_time_wd == undefined || mpz_time_sl == undefined || mpz_time_hs == undefined || mpz_time_em == undefined || mpz_time_xy == undefined || mpz_time_gb == undefined){
                                    WG.Send("chat 暂未收集到全部门派战时间信息，请稍后再查询")
                                    return;
                                }
                                var timeNow = new Date();
                                var timeMinute = timeNow.getMinutes();
                                if(timeMinute > 50 && mpz_msg != ""){mpz_msg = ""}
                                var timeWD = Math.max(3600000 - (timeNow - mpz_time_wd), 0)
                                var timeWD_m = parseInt(timeWD/60000)
                                var timeWD_s = parseInt((timeWD - timeWD_m*60000)/1000)

                                var timeHS = Math.max(3600000 - (timeNow - mpz_time_hs), 0)
                                var timeHS_m = parseInt(timeHS/60000)
                                var timeHS_s = parseInt((timeHS - timeHS_m*60000)/1000)

                                var timeEM = Math.max(3600000 - (timeNow - mpz_time_em), 0)
                                var timeEM_m = parseInt(timeEM/60000)
                                var timeEM_s = parseInt((timeEM - timeEM_m*60000)/1000)

                                var timeXY = Math.max(3600000 - (timeNow - mpz_time_xy), 0)
                                var timeXY_m = parseInt(timeXY/60000)
                                var timeXY_s = parseInt((timeXY - timeXY_m*60000)/1000)

                                var timeSL = Math.max(3600000 - (timeNow - mpz_time_sl), 0)
                                var timeSL_m = parseInt(timeSL/60000)
                                var timeSL_s = parseInt((timeSL - timeSL_m*60000)/1000)

                                var timeGB = Math.max(3600000 - (timeNow - mpz_time_gb), 0)
                                var timeGB_m = parseInt(timeGB/60000)
                                var timeGB_s = parseInt((timeGB - timeGB_m*60000)/1000)

                                WG.Send("chat 上一场门派战对战方："+mpz_msg+"距离下一次门派战可开启： 【武当】"+timeWD_m+"分"+timeWD_s+"秒  "+"【少林】"+timeSL_m+"分"+timeSL_s+"秒  "+"【华山】"+timeHS_m+"分"+timeHS_s+"秒  "+"【峨眉】"+timeEM_m+"分"+timeEM_s+"秒  "+"【逍遥】"+timeXY_m+"分"+timeXY_s+"秒  "+"【丐帮】"+timeGB_m+"分"+timeGB_s+"秒")
                            }
                            else if(data.content.match(/^k$/) || data.content.match(/^K$/) || data.content.match(/^wkzn$/) || data.content.match(/^WKZN$/)){
                                datenow = new Date();
                                var time = datenow - datelast
                                time_minute = parseInt(time/60000)
                                time_second = parseInt((time - time_minute*60000)/1000)
                                WG.Send("chat 当前的挖矿指南是+"+zhinan+"，已持续"+time_minute+"分"+time_second+"秒")
                            }
                            else if(data.content.match(/^jh$/) || data.content.match(/^JH$/)){
                                if(timeMarry == undefined){WG.Send("chat 暂未收集到结婚信息，请稍后查询");return}
                                timeNow = new Date();
                                var marrytime = Math.max(7200000 - (timeNow - timeMarry), 0)
                                var marrytime_h = parseInt(marrytime/3600000)
                                var marrytime_m = parseInt((marrytime - marrytime_h*3600000)/60000)
                                var marrytime_s = parseInt((marrytime - marrytime_h*3600000 - marrytime_m*60000)/1000)
                                if(marrytime_h == 0 && marrytime_m == 0 && marrytime_s == 0){
                                    WG.Send("chat 婚礼主持空闲中，现在可以结婚")
                                }
                                else{
                                    WG.Send("chat 有婚礼正在进行，还有"+marrytime_h+"时"+marrytime_m+"分"+marrytime_s+"秒可以结婚")
                                    //messageAppend("有婚礼正在进行，还有"+marrytime_h+"时"+marrytime_m+"分"+marrytime_s+"秒可以结婚")
                                }
                            }
                        }
                    }
                });
            },
            Saohuang:function(){
                var time = new Date();
                var hour = time.getHours();
                var minutes = time.getMinutes();
                messageAppend("已获得帝魄碎片数量为"+get_dipo);
                switch(hour){
                    case(12):
                        if(Saohuang_zhangmen0 == "打" && get_dipo < 5){
                            Saohuang_zhangmen = "开启";
                        }
                        else{
                            Saohuang_zhangmen = "关闭";
                        }
                        break;
                    case(13):
                        if(Saohuang_zhangmen1 == "打" && get_dipo < 5){
                            Saohuang_zhangmen = "开启";
                        }
                        else{
                            Saohuang_zhangmen = "关闭";
                        }
                        break;
                    case(14):
                        if(Saohuang_zhangmen2 == "打" && get_dipo < 5){
                            Saohuang_zhangmen = "开启";
                        }
                        else{
                            Saohuang_zhangmen = "关闭";
                        }
                        break;
                    case(15):
                        if(Saohuang_zhangmen3 == "打" && get_dipo < 5){
                            Saohuang_zhangmen = "开启";
                        }
                        else{
                            Saohuang_zhangmen = "关闭";
                        }
                        break;
                    default:
                        if(Saohuang_zhangmen0 == "打" || Saohuang_zhangmen1 == "打" || Saohuang_zhangmen2 == "打" || Saohuang_zhangmen3 == "打"){
                            if(get_dipo < 5){
                                Saohuang_zhangmen = "开启";
                            }
                        }
                }
                SaohuangIndex = 0;
                WG.allStop();
                Doing = "帮战";
                if(unenable_skill != "" || unenable_skill != undefined){
                    WG.unenable_skill();
                }
                xtime[0] = setTimeout(function(){Switch.AutoPerformSwitch(0);}, 1000);
                xtime[1] = setTimeout(function(){
                    if(role =="王大叔"){WG.Send("enable unarmed dasongyangshenzhang;eq 3kbn441e866")}
                    WG.SaohuangGo();
                }, 2000);
                myTime[0] = setTimeout(function(){if(role =="王大叔"){WG.Send("pty *群殴");};WG.Saohuang();}, 301000);
            },
            SaohuangGo:function(){
                clearTimeout(xtime[0]);
                WG.Send("stopstate");
                var time = new Date();
                var minute = time.getMinutes();
                switch(SaohuangIndex){
                    case(0):
                        WG.Send("jh fam 5 start;go north;go north");
                        xtime[0] = setTimeout(function(){if(WG.at("逍遥派-木屋")){SaohuangIndex++;WG.SaohuangScan();}else{WG.SaohuangGo();}}, 1000);
                        break;
                    case(1):
                        WG.Send("jh fam 5 start;go north");
                        xtime[0] = setTimeout(function(){if(WG.at("逍遥派-林间小道")){SaohuangIndex++;WG.SaohuangScan();}else{WG.SaohuangGo();}}, 1000);
                        break;
                    case(2):
                        WG.Send("jh fam 5 start");
                        xtime[0] = setTimeout(function(){if(WG.at("逍遥派-青草坪")){SaohuangIndex++;WG.SaohuangScan();}else{WG.SaohuangGo();}}, 1000);
                        break;
                    case(3):
                        WG.Send("jh fam 5 start;go south");
                        xtime[0] = setTimeout(function(){if(WG.at("逍遥派-林间小道")){SaohuangIndex++;WG.SaohuangScan();}else{WG.SaohuangGo();}}, 1000);
                        break;
                    case(4):
                        WG.Send("jh fam 5 start;go south;go south");
                        xtime[0] = setTimeout(function(){if(WG.at("逍遥派-木屋")){SaohuangIndex++;WG.SaohuangScan();}else{WG.SaohuangGo();}}, 1000);
                        break;
                    case(5):
                        WG.Send("jh fam 5 start;go west");
                        xtime[0] = setTimeout(function(){if(WG.at("逍遥派-林间小道")){SaohuangIndex++;WG.SaohuangScan();}else{WG.SaohuangGo();}}, 1000);
                        break;
                    case(6):
                        WG.Send("jh fam 5 start;go west;go south");
                        xtime[0] = setTimeout(function(){if(WG.at("逍遥派-休息室")){SaohuangIndex++;WG.SaohuangScan();}else{WG.SaohuangGo();}}, 1000);
                        break;
                    case(7):
                        WG.Send("jh fam 5 start;go east");
                        xtime[0] = setTimeout(function(){if(WG.at("逍遥派-林间小道")){SaohuangIndex++;WG.SaohuangScan();}else{WG.SaohuangGo();}}, 1000);
                        break;
                    case(8):
                        WG.Send("jh fam 5 start;go east;go north");
                        xtime[0] = setTimeout(function(){if(WG.at("逍遥派-练功房")){SaohuangIndex++;WG.SaohuangScan();}else{WG.SaohuangGo();}}, 1000);
                        break;
                    case(9):
                        WG.Send("jh fam 5 start;go east;go south");
                        xtime[0] = setTimeout(function(){if(WG.at("逍遥派-木板路")){SaohuangIndex++;WG.SaohuangScan();}else{WG.SaohuangGo();}}, 1000);
                        break;
                    case(10):
                        WG.Send("jh fam 5 start;go east;go south;go south");
                        xtime[0] = setTimeout(function(){if(WG.at("逍遥派-工匠屋")){SaohuangIndex++;WG.SaohuangScan();}else{WG.SaohuangGo();}}, 1000);
                        break;
                    case(11):
                        if(Doing == "打紫"){
                            Helper.enable_skill(1);
                            xtime[0] = setTimeout(function(){WG.Send("jh fam 5 start;go west");Switch.AutoPerformSwitch(0);}, 3000);
                            xtime[1] = setTimeout(function(){WG.SaohuangDazi();}, 4000);
                            tip("开始打紫,5分钟后自动开启下一轮扫黄");
                        }
                        else{
                            WG.Send("jh fam 5 start;go down");
                            xtime[0] = setTimeout(function(){if(WG.at("逍遥派-地下石室")){SaohuangIndex++;WG.SaohuangScan();}else{WG.SaohuangGo();}}, 1000);
                        }
                        break;
                    case(12):
                        if(minute >= 54){
                            WG.allStop();
                            if( Saohuang_zhangmen == "开启"){
                                WG.SaohuangZhangmen();
                            }
                            else{
                                WG.go("扬州城-武庙")
                            }
                            return;
                        }
                        else{
                            tip("本轮扫黄完成,5分钟后自动开启下一轮");
                            xtime[0] = setTimeout(function(){WG.fenjie_zhuangbei();}, 1000);
                        }
                        break;
                }
            },
            SaohuangScan:function(){
                clearTimeout(xtime[0]);
                var number_lanlv = 0;
                var number_huang = 0;
                var object = null;
                var target = null;
                var hp_huang = 100;
                var lists = $(".room_items .room-item");
                for (var npc of lists) {
                    if (npc.innerText.indexOf("逍遥派第一代") != -1  && $(npc).attr("itemid") != G.id) {
                        Doing = "打紫";
                        WG.SaohuangGo();
                        return
                    }
                    if (npc.innerText.indexOf("逍遥派第二代") != -1  && $(npc).attr("itemid") != G.id) {
                        number_huang++;
                        object =$(npc).attr("itemid");
                        var buff =eval("$('[itemid="+object+"]').find('.item-status-bar').text()");
                        if (buff.indexOf("凌波") == -1){
                            var hp =$("[itemid="+object+"]").find('.progress-bar').attr('style');
                            hp = hp.substr(6,4);
                            hp = parseInt(hp);
                            if(hp <= hp_huang){
                                hp_huang = hp;
                                target = object;
                            }
                        }
                    }
                    if (npc.innerText.indexOf("逍遥派第三代") != -1  && $(npc).attr("itemid") != G.id) {
                        number_lanlv++;
                    }
                    if (npc.innerText.indexOf("逍遥派第四代") != -1  && $(npc).attr("itemid") != G.id) {
                        number_lanlv++;
                    }
                }
                //tip("共有黄"+number_huang+" 蓝绿"+number_lanlv+"血量最低的黄怪("+target+":"+hp_huang+")");
                if(number_huang >= 1){
                    if(hp_huang <= SaohuangHP){
                        if(!Helper.in_fight){
                            WG.kill_all();
                        }
                        if(SaohuangTarget != target){
                            WG.Send("kill "+target);
                            SaohuangTarget = target;
                        }
                    }
                    xtime[0] = setTimeout(function(){WG.SaohuangScan();}, 500);
                    return;
                }
                if(number_lanlv >= 1){
                    if(!Helper.in_fight){
                        WG.kill_all();
                    }
                    xtime[0] = setTimeout(function(){WG.SaohuangScan();}, 500);
                    return;
                }
                if(!Helper.in_fight){
                    WG.SaohuangGo();
                }
                else{
                    xtime[0] = setTimeout(function(){WG.SaohuangScan();}, 500);
                }
            },
            SaohuangDazi:function(){
                clearTimeout(xtime[0]);
                clearTimeout(xtime[1]);
                var lists = $(".room_items .room-item");
                var number_zi = 0;
                var hp_zi = 100;
                var object = null;
                var target = null;
                for (var npc of lists) {
                    if (npc.innerText.indexOf("逍遥派第一代") != -1 && $(npc).attr("itemid") != G.id) {
                        number_zi++;
                        object =$(npc).attr("itemid");
                        var buff =eval("$('[itemid="+object+"]').find('.item-status-bar').text()");
                        if (buff.indexOf("凌波") == -1){
                            var hp =$("[itemid="+object+"]").find('.progress-bar').attr('style');
                            hp = hp.substr(6,4);
                            hp = parseInt(hp);
                            if(hp <= hp_zi){
                                hp_zi = hp;
                                target = object;
                            }
                        }
                    }
                }
                if(number_zi>=1){
                    var zi_percent = 99
                    if(G.id == "1iv8277a2c4"){zi_percent = 100}
                    if(hp_zi <= zi_percent){ //等有人先动手再叫杀，如果不需要等别人先动手的把99改成100
                        if(!Helper.in_fight){
                            WG.kill_all();
                        }
                        if(SaohuangTarget != target){
                            WG.Send("kill "+target);
                            SaohuangTarget = target;
                        }
                    }
                    xtime[0] = setTimeout(function(){WG.SaohuangDazi();}, 1000);
                    return;
                }
                if(WG.at("逍遥派-林间小道")){
                    if(!Helper.in_fight){
                        WG.Send("jh fam 5 start;go down")
                        xtime[1] = setTimeout(function(){WG.SaohuangDazi();}, 1000);
                    }
                    else{
                        xtime[0] = setTimeout(function(){WG.SaohuangDazi();}, 500);
                    }
                }
                if(WG.at("逍遥派-地下石室")){
                    Doing = "帮战";
                    if(!Helper.in_fight){
                        WG.fenjie_zhuangbei()
                    }
                    else{
                        xtime[0] = setTimeout(function(){WG.SaohuangDazi();}, 500);
                    }

                }
            },
            SaohuangZhangmen:async function(){
                if(G.id == "1iv8277a2c4" && Doing != "打掌门"){WG.Send("pty 扫黄完毕，准备打橙")}
                WG.go("逍遥派-逍遥子")
                await WG.sleep(4000)
                Helper.eqwear(6);
                await WG.sleep(3000)
                Doing = "打掌门"
                //if(dacheng_pfm != ""){WG.Send("setting auto_pfm "+dacheng_pfm)}
                var lists = $(".room_items .room-item");
                var zhanglao1 = null;
                var zhanglao2 = null;
                var zhangmen = null;
                for (var npc of lists) {
                    if (npc.innerText.indexOf("逍遥子") != -1) {
                        zhangmen = $(npc).attr("itemid");
                    }
                    if (npc.innerText.indexOf("逍遥派长老") != -1) {
                        if(zhanglao1 == undefined){
                            zhanglao1 = $(npc).attr("itemid");
                        }
                        else if(zhanglao2 == undefined){
                            zhanglao2 = $(npc).attr("itemid");
                        }
                    }
                }
                if(zhangmen == null){messageAppend("找不到掌门，自动打掌门执行失败！请手动",2);return}
                messageClear();
                messageAppend("长老1："+zhanglao1+"<br>长老2："+zhanglao2+"<br>掌门："+zhangmen);
                WG.SaohuangZhanglao_fight(zhanglao1,zhanglao2,zhangmen);

            },
            SaohuangZhanglao_fight:function(zhanglao1,zhanglao2,zhangmen){
                clearTimeout(xtime[0]);
                let item1 = G.items.get(zhanglao1);
                let item2 = G.items.get(zhanglao2);
                let item3 = G.items.get(zhangmen);
                if(!item3){return;}//如果掌门已经死了则不再继续执行
                var damageper1;
                var damageper2;
                var fighting = 0;

                if(!Helper.in_fight){
                    if(G.id == "1iv8277a2c4"){
                        if(zhanglao1 != null && zhanglao2 != null && zhangmen != null)WG.Send("pty 做好准备，我将在1秒后开怪")
                        xtime[0] = setTimeout(function(){
                            WG.Send("kill " + zhangmen);
                            SaohuangTarget = zhanglao1;
                            setTimeout(function(){WG.SaohuangZhanglao_fight(zhanglao1,zhanglao2,zhangmen);}, 500);
                        }, 1000);
                    }
                    else{
                        this.hslj = WG.add_hook(["sc" , "room"], function (data) {
                            if(data.type == "sc"){
                                if(data.id == zhanglao1 || data.id == zhanglao2 || data.id == zhangmen){
                                    if(!G.gcd && fighting == 0){
                                        fighting = 1;
                                        WG.remove_hook(this.index);
                                        if(dacheng_pfm != ""){WG.Send("setting auto_pfm "+dacheng_pfm)}
                                        WG.Send("kill " + zhangmen);
                                        SaohuangTarget = zhanglao1;
                                        xtime[0] = setTimeout(function(){WG.SaohuangZhanglao_fight(zhanglao1,zhanglao2,zhangmen);}, 200);
                                    }
                                }
                            }
                            else if(data.type == "room"){
                                WG.remove_hook(this.index);
                            }
                        });
                    }
                }
                else{
                    if(item1 == undefined){damageper1 = 100}else{damageper1 = Math.floor(item1.damage / item1.max_hp * 100)};
                    if(item2 == undefined){damageper2 = 100}else{damageper2 = Math.floor(item2.damage / item2.max_hp * 100)};
                    var buff =eval("$('[itemid="+SaohuangTarget+"]').find('.item-status-bar').text()");
                    if(SaohuangTarget == zhanglao1){
                        if((damageper1 >= changepercent && damageper2 <changepercent) || buff.indexOf("凌波") != -1){
                            tip("长老1伤害超过11%，转火长老2");
                            WG.Send("kill " + zhanglao2);
                            SaohuangTarget = zhanglao2;
                        }
                    }
                    else if(SaohuangTarget == zhanglao2){
                        if((damageper2 >= changepercent && damageper1 <changepercent) || buff.indexOf("凌波") != -1){
                            tip("长老2伤害超过11%，转火长老1");
                            WG.Send("kill " + zhanglao1);
                            SaohuangTarget = zhanglao1;
                        }
                    }
                    if(damageper1 >= changepercent && damageper2 >= changepercent){
                        if(SaohuangTarget != zhangmen){
                            tip("两个长老伤害都已超过11，转火掌门");
                            WG.Send("kill " + zhangmen);
                            SaohuangTarget = zhangmen;
                        }
                        else{
                            if(item3.damage / item3.max_hp * 100 >= changepercent){
                                tip("对掌门的输出已达标，等待战斗结束")
                                WG.Send("uneq " + weapon);
                                Switch.AutoPerformSwitch(0);
                                return;
                            }
                        }
                    }
                    xtime[0] = setTimeout(function(){WG.SaohuangZhanglao_fight(zhanglao1,zhanglao2,zhangmen);}, 300);
                }
            },
            mpz_dahong:function(){
                Switch.AutoPerformSwitch(0)
                WG.Send("enable parry douzhuanxingyi")
                WG.go("丐帮-林间小屋")
                messageAppend("开始自动监测18掌出招",1)
                this.hslj = WG.add_hook(['text'], function (data) {
                    if(data.type == "text"){
                        if(data.msg.indexOf("行墨凝神聚气") != -1){
                            if(WG.buff_not_exist("逆转九阴") && G.cds.get("force.cui")){return}
                            if(G.cds.get("parry.dou")){return}
                            var lists = $(".room_items .room-item");
                            for (var npc of lists) {
                                if(npc.innerText.indexOf("行墨") != -1){
                                    if(!Helper.in_fight){WG.Send("kill "+$(npc).attr("itemid"))}
                                    var leftindex = npc.innerText.indexOf("[");
                                    var rightindex = npc.innerText.indexOf("]")
                                    var damageper = parseInt(npc.innerText.slice(leftindex+1, rightindex-1))
                                    if(damageper >= changepercent){
                                        messageAppend("伤害已达到11%，停止出招")
                                        WG.remove_hook(this.index);
                                    }
                                    else{
                                        WG.lianzhaoer();
                                        WG.lianzhaoyi();
                                        WG.Send("perform parry.dou")
                                    }
                                }
                            }
                        }
                    }
                });
            },
            mpz_dahong2:async function(){
                Switch.AutoPerformSwitch(0)
                WG.go("华山派-客厅")
                await WG.sleep(1000)
                WG.kill_target("独孤败天")
                messageAppend("开始自动送死",1)
                this.hslj = WG.add_hook(['die'], async function (data) {
                    if(data.type == "die" && !data.relive){
                        var lists = $(".room_items .room-item");
                        for (var npc of lists) {
                            if(npc.innerText.indexOf("独孤败天") != -1){
                                var leftindex = npc.innerText.indexOf("[");
                                var rightindex = npc.innerText.indexOf("]")
                                var damageper = parseInt(npc.innerText.slice(leftindex+1, rightindex-1))
                                if(damageper >= changepercent){
                                    messageAppend("伤害已达标，停止出招")
                                    WG.remove_hook(this.index);
                                    WG.Send("relive")
                                    await WG.sleep(1000)
                                    WG.go("华山派-客厅")
                                }
                                else{
                                    WG.Send("relive")
                                }
                            }
                        }
                    }
                    else if(data.type == "die" && data.relive){
                        if(G.cds.get("force.cui")){
                            await WG.sleep(500)
                        }
                        else{
                            await WG.sleep(5000)
                        }
                        WG.go("华山派-客厅")
                        await WG.sleep(500)
                        WG.kill_target("独孤败天")
                        WG.Send("perform force.cui")
                    }
                });
            },
            unenable_skill:function(){
                if(unenable_skill == undefined || unenable_skill == ""){return};
                var unenable_list = unenable_skill.split(",");
                for(var j = 0;j < unenable_list.length;j++){
                    WG.Send("enable "+unenable_list[j]+" none");
                }
            },
            //去武庙自杀清鼓舞
            ClearGuwu:async function(){
                for(xx in xtime){clearTimeout(xtime[xx])};
                Helper.eqwear(3);
                Switch.AutoPerformSwitch(0);
                await WG.sleep(3000);
                WG.go("武道塔")
                await WG.sleep(1000);
                WG.kill_target("守门人");
                WG.Send("perform sword.wu");
                await WG.sleep(6000);
                Switch.AutoPerformSwitch(1);
                WG.Send("relive");
                WG.go("扬州城-武庙");
            },
            //一轮扫黄完成后去武庙疗伤，满血后回家练功
            Saohuang_liaoshang:function(){
                clearTimeout(xtime[0]);
                WG.go("扬州城-武庙");
                xtime[0] =setTimeout(function(){WG.Send("liaoshang");WG.Saohuang_checkzt();}, 1000);
            },
            Saohuang_checkzt:function(){
                clearTimeout(xtime[0]);
                 var xue =$("div.progress-bar:first").attr("style");
                var lan =$("div.progress-bar:eq(1)").attr("style");
                xue = xue.substr(6,4);
                xue = parseInt(xue);
                lan = lan.substr(6,4);
                lan = parseInt(lan);
                if(xue == 100 && lan == 100){
                    WG.Send("stopstate")
                    //如果角色名是王大叔去盘点仓库，否则回家练功
                    if(role == "王大叔"){WG.pandian_cangku()}else{WG.practice_skill()};
                }
                else{
                    xtime[0] = setTimeout(function(){ WG.Saohuang_checkzt(); }, 2000);
                }
            },
            //分解襄阳和6大门派的绿蓝黄且没精炼过的装备
            fenjie_equip: async function(){
                messageAppend("开始分解装备", 1)
                this.fenjie = WG.add_hook(['dialog'], async function (data) {
                    if(data.dialog == "pack"){
                        if(data.items){
                            for(var i = 0;i < data.items.length; i++){
                                if(data.items[i].can_eq){
                                    //hig:绿色 hic:蓝色 hiy:黄色
                                    if(data.items[i].name.indexOf("<hig>大宋") != -1 ||
                                       data.items[i].name.indexOf("<hic>大宋") != -1 ||
                                       data.items[i].name.indexOf("<hiy>大宋") != -1 ||
                                       data.items[i].name.indexOf("<hig>蒙古") != -1 ||
                                       data.items[i].name.indexOf("<hic>蒙古") != -1 ||
                                       data.items[i].name.indexOf("<hiy>蒙古") != -1 ||
                                       data.items[i].name.indexOf("<hig>笠子") != -1 ||
                                       data.items[i].name.indexOf("<hic>笠子") != -1 ||
                                       data.items[i].name.indexOf("<hiy>笠子") != -1 ||
                                       data.items[i].name.indexOf("<hig>鲲鹏") != -1 ||
                                       data.items[i].name.indexOf("<hic>鲲鹏") != -1 ||
                                       data.items[i].name.indexOf("<hiy>鲲鹏") != -1 ||
                                       data.items[i].name.indexOf("<hig>真武") != -1 ||
                                       data.items[i].name.indexOf("<hic>真武") != -1 ||
                                       data.items[i].name.indexOf("<hiy>真武") != -1 ||
                                       data.items[i].name.indexOf("<hig>罗汉") != -1 ||
                                       data.items[i].name.indexOf("<hic>罗汉") != -1 ||
                                       data.items[i].name.indexOf("<hiy>罗汉") != -1 ||
                                       data.items[i].name.indexOf("<hig>君子") != -1 ||
                                       data.items[i].name.indexOf("<hic>君子") != -1 ||
                                       data.items[i].name.indexOf("<hiy>君子") != -1 ||
                                       data.items[i].name.indexOf("<hig>曙光") != -1 ||
                                       data.items[i].name.indexOf("<hic>曙光") != -1 ||
                                       data.items[i].name.indexOf("<hiy>曙光") != -1 ||
                                       data.items[i].name.indexOf("<hig>混天") != -1 ||
                                       data.items[i].name.indexOf("<hic>混天") != -1 ||
                                       data.items[i].name.indexOf("<hiy>混天") != -1 ||
                                       data.items[i].name.indexOf("<hig>铁镐") != -1 ||
                                       data.items[i].name.indexOf("<hic>铁镐") != -1 ||
                                       data.items[i].name.indexOf("<hiy>铁镐") != -1 ||
                                       data.items[i].name.indexOf("<hig>铁镐") != -1 ||
                                       data.items[i].name.indexOf("<hic>药王") != -1 ||
                                       data.items[i].name.indexOf("<hiy>药王") != -1 ||
                                       data.items[i].name.indexOf("<hiy>药王") != -1 )
                                    {
                                        WG.Send("fenjie "+data.items[i].id);
                                        await WG.sleep(250)
                                    }
                                }
                            }
                            WG.remove_hook(this.index);
                            messageAppend("装备分解完毕", 1)
                        }
                    }
                });
                WG.Send("pack")
            },
            //分解背包中的蓝绿鲲鹏装备
            fenjie_zhuangbei:function(){
                WG.fenjie_equip();
                xtime[0] = setTimeout(function(){WG.Saohuang_liaoshang() }, 5000);
            },
            sortout_pack: async function(){
                if(auto_sortout_pack == 1){
                    WG.sell_all();
                    await WG.sleep(3000)
                    WG.cangku();
                    await WG.sleep(1000)
                    WG.store_pack();
                }
                else{
                    WG.zdwk();
                }
            },
            store_pack: async function(){
                messageAppend("开始整理背包", 1)
                this.fenjie = WG.add_hook(['dialog'], async function (data) {
                    if(data.dialog == "pack"){
                        if(data.items){
                            for(var i = 0;i < data.items.length; i++){
                                    //hig:绿色 hic:蓝色 hiy:黄色
                                    if((data.items[i].name.indexOf("师门令牌") != -1 && autotoken == "关闭") ||
                                       data.items[i].name.indexOf("残页</hig>") != -1 ||
                                       data.items[i].name.indexOf("残页</hic>") != -1 ||
                                       data.items[i].name.indexOf("残页</hiy>") != -1 ||
                                       data.items[i].name.indexOf("残页</HIZ>") != -1 ||
                                       data.items[i].name.indexOf("残页</hio>") != -1 ||
                                       data.items[i].name.indexOf("金创药") != -1 ||
                                       data.items[i].name.indexOf("引气丹") != -1 )
                                    {
                                        WG.Send("store "+data.items[i].count + " " +data.items[i].id);
                                        await WG.sleep(250)
                                    }
                            }
                            WG.remove_hook(this.index);
                            messageAppend("整理完毕", 1)
                            await WG.sleep(3000)
                            WG.zdwk();
                        }
                    }
                });
                WG.Send("pack")
            },
            //打坐
            auto_dazuo: async function(){
                clearTimeout(xtime[0]);
                WG.Send("stopstate");
                Doing = "打坐";
                WG.go("住房-练功房");//去豪宅练功房练功，如果1秒后发现不在住宅练功房则去帮会练功房
                await WG.sleep(1000);
                if(!WG.at("住房-练功房")){
                    WG.go("帮会-练功房");
                    await WG.sleep(3000);
                };
                Helper.eqwear(4);
                await WG.sleep(3000);
                WG.Send("dazuo");
            },
            //练习个人数据中设置的技能，挨个查看每个技能是否达到接近上限的整百级或者达到上限
            practice_skill: async function(){
                WG.Send("stopstate;cha");
                tip("去豪宅练功房练功，没有豪宅则会自动去帮会练功房");
                WG.go("住房-练功房");//去豪宅练功房练功，如果1秒后发现不在住宅练功房则去帮会练功房
                await WG.sleep(3000);
                if(!WG.at("住房-练功房")){
                    WG.go("帮会-练功房");
                    await WG.sleep(3000);
                }
                Helper.eqwear(2);
                await WG.sleep(3000);
                Doing = "练功";
                WG.practice_skill2();
            },
            practice_skill2:async function(){
                clearTimeout(xtime[0]);
                //如果当前要修炼的技能已经修炼到上限，则换下一个技能
                if(WG.lx_check_skill(practice_skill[practice_index])){
                    practice_index++;
                    xtime[0] = setTimeout(function(){WG.practice_skill2();}, 200);
                    return;
                }
                if(practice_skill[practice_index]==undefined){
                    tip("所有技能都已经修炼完成")
                    xtime[0] = setTimeout(function(){WG.zdwk()}, 3000)
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
                if(message.indexOf(jinengman) != -1 || message.indexOf(jinengma) != -1){
                    messageClear();
                    practice_index++;
                    xtime[1] = setTimeout(function(){WG.practice_skill();}, 500);
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
            //击杀指定目标，参数目标名字（中文）
            kill_target: function (name) {
                var roomlist = $(".room_items .room-item");
                for (var fubennpc of roomlist) {
                    if (fubennpc.innerText.indexOf(name) != -1) {
                        WG.Send("kill " + $(fubennpc).attr("itemid"));
                        //return true;
                    }
                }
                //return false;
            },
            auto_fuben1: function(){
                messageAppend("开始自动小树林20次", 1)
                for(var j = 0;j < 20; j++){
                    xtime[j] = setTimeout(function(){WG.Send("cr yz/lw/shangu")}, j*500);
                    xtime[j*2+1] = setTimeout(function(){WG.Send("cr over")}, j*500+100);
                }
            },
            clear_xuruo:function(){
                Helper.eqwear(3);
                Switch.AutoPerformSwitch(0);
                xtime[0] = setTimeout(function(){WG.Send("jh fam 2 start;go north;go west")}, 3000);
                xtime[1] = setTimeout(function(){WG.kill_target("木头人");WG.Send("perform sword.wu")}, 3500);
            },
            pandian_cangku:function(){
                if(!WG.at("帮会-仓库")){
                    WG.Send("jh fam 0 start;go south;go south;go east;go east;go east;go east;go north")
                    xtime[0] = setTimeout(function(){WG.pandian_cangku()}, 3000);
                    return;
                }
                var donext = 0;  //0不做操作，1查看伤害列表，2查看分配列表 3分配到人 4分解
                var fenpei_list = fenpei_player.split(",")
                var fenpei_cmd = "";
                var fenjie_cmd = "";
                var fenpei_target = null;
                var damage_msg;
                WG.Send("alloc");
                this.hslj = WG.add_hook(["text", "cmds", "msg"], function (data) {
                    if(data.type == "text"){
                        if(data.msg.indexOf("请选择对<HIZ>") != -1){
                            //messageAppend("紫装，查看伤害列表", 1)
                            donext = 1;
                        }
                        else if(data.msg.indexOf("请选择对<hiy>") != -1){
                            //messageAppend("黄装直接分解")
                            donext = 4;
                        }
                        else if(data.msg.indexOf("以下成员参与战斗，需要造成3%以上伤害") != -1){
                            for(var i = 0;i < fenpei_list.length;i++){
                                if(data.msg.indexOf(fenpei_list[i]) != -1){
                                    var damage = data.msg.match(fenpei_list[i]+"([^%]+)%")[1]
                                    messageAppend(fenpei_list[i]+":"+damage)
                                    if(damage >= 3){
                                        xtime[1] = setTimeout(function(){WG.Send(fenpei_cmd)}, 500);
                                        donext = 3;
                                        fenpei_target = fenpei_list[i]
                                        return;
                                    }
                                }
                            }
                            //如果走到这里说明没有一个需求紫装的人伤害超过3%，则直接分解
                            //messageAppend("没有一个需求紫装的人伤害超过3%，分解", 1)
                            WG.Send(fenjie_cmd);
                            donext = 0;
                            fenpei_target = null;
                            fenjie_cmd = "";
                            fenpei_cmd = "";
                            if(damage_msg != data.msg){
                                WG.Send("pty "+data.msg)
                                damage_msg = data.msg
                                xtime[3] = setTimeout(function(){ WG.Send("alloc");}, 6000);
                            }
                            else{
                                xtime[3] = setTimeout(function(){ WG.Send("alloc");}, 500);
                            }
                        }
                        else if(data.msg.indexOf("仓库中目前没有可用的战利品") != -1){
                            messageAppend("盘点仓库结束",1)
                            WG.remove_hook(this.index);
                            xtime[4] = setTimeout(function(){ WG.practice_skill()}, 3000);
                        }
                    }
                    else if(data.type == "cmds"){
                        if(donext == 1){
                            //items[0] 分解
                            //items[1] 分配给玩家
                            //items[2] 查看伤害列表
                            xtime[0] = setTimeout(function(){WG.Send(data.items[2].cmd);}, 500);
                            fenpei_cmd = data.items[1].cmd;
                            fenjie_cmd = data.items[0].cmd;
                            donext = 2;
                        }
                        else if(donext == 3){
                            for(var j = 0;j < data.items.length;j++){
                                if(data.items[j].name == fenpei_target){
                                    messageAppend("分配给"+fenpei_target,1)
                                    donext = 0;
                                    fenpei_target = null;
                                    fenjie_cmd = "";
                                    fenpei_cmd = "";
                                    WG.Send(data.items[j].cmd);
                                    xtime[3] = setTimeout(function(){ WG.Send("alloc");}, 1000);
                                    return;
                                }
                            }
                        }
                        else if(donext == 4){
                            donext = 0;
                            fenpei_target = null;
                            fenjie_cmd = "";
                            fenpei_cmd = "";
                            WG.Send(data.items[0].cmd)
                            xtime[3] = setTimeout(function(){ WG.Send("alloc");}, 1000);
                        }
                    }
                });
            },
            //自动出招，跳过自动忙乱和自动昏迷里的技能
            fb_autopfm: function () {
                if(auto_perform == undefined || auto_perform == ""){return};
                WG.lianzhaoer();
                /*
                var buff0 =$(".room_items .room-item .item-status-bar:first").text();//获取玩家的BUFF列表
                var buff1 =$(".room_items .room-item .item-status-bar:last").text();//获取敌人的BUFF列表
                //如果自己没有破招BUFF，敌人也没有忙乱和吸气BUFF，就自动使用破气
                if(buff1.indexOf("忙乱") == -1){
                    if(buff1.indexOf("吸气") == -1){
                        WG.Send("perform sword.poqi")
                    }
                    else{
                        WG.Send("perform parry.pojian")
                    }
                    if(G.cds.get("sword.poqi")){
                        WG.Send("perform parry.pojian")
                    }
                }
                let target = G.items.get(G.scid)
                if(target){
                    //敌人的血量在20%以下且自己的破气还没冷却好时不释放技能，等待破气冷却
                    if(target.hp / target.max_hp < 0.4  && G.cds.get("sword.poqi")){
                        ktime[0] = setTimeout(function(){ WG.fb_autopfm();}, 500);
                        return;
                    }
                }
                */
                var pfm = auto_perform.split(',');
                for(var j = 0;j < pfm.length; j++){
                    if(autobusy_skill.indexOf(pfm[j]) == -1 && autofaint_skill.indexOf(pfm[j]) == -1){
                        if(!G.gcd && !G.cds.get(pfm[j]) && G.skills.indexOf(pfm[j]) != -1){
                            WG.Send("perform "+pfm[j]);
                            break;
                        }
                    }
                }
                ktime[0] = setTimeout(function(){ WG.fb_autopfm();}, 500);
            },
            //自动华山论剑
            fb_huashanlunjian: async function(index){
                WG.go("扬州城-武庙")
                if(role == "王元姬"){WG.Send("enable parry douzhuanxingyi");auto_perform = "parry.yi,sword.lian,sword.sui,unarmed.san,throwing.jiang,unarmed.zhui";auto_perform3 = "sword.chan"}
                var xue =$("div.progress-bar:first").attr("style");
                var lan =$("div.progress-bar:eq(1)").attr("style");
                xue = xue.substr(6,4);
                xue = parseInt(xue);
                if(xue == 100){
                    messageClear();
                    WG.Send("cr huashan/lunjian/leitaixia;go up")
                    WG.lianzhaoer()
                    WG.lianzhaoyi()
                    this.hslj = WG.add_hook(["text", "itemremove", "itemadd","combat", "items", "status"], async function (data) {
                        if (data.type == "combat") {
                            if (data.end) {
                                clearTimeout(ktime[0]);
                                WG.Send("jump bi")
                            }
                        }
                        else if(data.type == "text"){
                            if(data.msg.indexOf("你的精力不够，不能开启副本。") != -1){
                                WG.allStop();
                                WG.remove_hook(this.index);
                                messageAppend("精力不足，自动副本结束", 2)
                                WG.Send("taskover signin");
                                auto_perform = GM_getValue(role + "_auto_perform", auto_perform);
                                auto_perform3 = GM_getValue(role + "_auto_perform3", auto_perform3);
                                setTimeout(function(){ WG.zdwk();}, 3000);
                            }
                        }
                        else if(data.type == "itemremove"){
                            WG.lianzhaoyi();
                        }
                        else if(data.type == "itemadd"){
                            if(data.name.indexOf("洪七公") != -1){
                                WG.Send("perform parry.pojian")
                            }
                        }
                        else if(data.type == "status"){
                            if(data.id == G.id && data.sid == "busy" && data.action == "add"){
                                if( G.skills.indexOf("parry.dao") != -1 && !G.cds.get("parry.dao")){
                                    WG.Send("perform parry.dao")
                                }
                            }
                        }
                        else if(data.type == "items"){
                            for(var i = 0; i < data.items.length; i++){
                                if(data.items[i].name.indexOf("五绝宝箱") != -1){
                                    WG.Send("get all from "+data.items[i].id)
                                    await WG.sleep(500)
                                    WG.Send("cr over")
                                    WG.remove_hook(this.index);
                                    await WG.sleep(500)
                                    messageAppend("本次副本结束，如不点击停止按钮则将在回满血或10秒后自动下一次", 1)
                                    var b = "<div class=\"item-commands\"><span  id = 'onekeyjh'>停止</span></div>"
                                    messageAppend(b);
                                    $('#onekeyjh').on('click', function () {
                                        WG.allStop();
                                    });
                                    ktime[2] = setTimeout(function(){ WG.fb_huashanlunjian();}, 10000);
                                }
                            }
                        }
                    });
                }
                else{
                    ktime[1] = setTimeout(function(){ WG.fb_huashanlunjian();}, 10000);
                }
            },
            //自动古墓困难-杀死杨过小龙女就退出
            fb_gumu2: async function(index){
                WG.go("扬州城-武庙")
                var xue =$("div.progress-bar:first").attr("style");
                var lan =$("div.progress-bar:eq(1)").attr("style");
                xue = xue.substr(6,4);
                xue = parseInt(xue);
                if(xue == 100){
                    messageClear();
                    WG.Send("cr gumu/gumukou 1 0;go enter;go east")
                    this.hslj = WG.add_hook(["text", "itemadd","combat", "room", "die"], async function (data) {
                        if (data.type == "room") {
                            if(data.path == "gumu/houtang"){
                                if(role == "王大叔"){
                                    Switch.AutoPerformSwitch(0);
                                    auto_perform = "parry.pojian,unarmed.san,throwing.jiang,unarmed.zhui"
                                    auto_perform3 = "force.zhui,force.xi,dodge.power,sword.wu,parry.pojian,sword.poqi"
                                    await WG.sleep(1000)
                                    Switch.AutoPerformSwitch(1);
                                }
                                xtime[0] = setTimeout(function(){WG.kill_target("杨过")}, 1000);
                                xtime[1] = setTimeout(function(){WG.Send("perform sword.poqi")}, 1100);
                                xtime[2] = setTimeout(function(){WG.Send("perform parry.pojian")}, 10000);
                            }
                        }
                        else if (data.type == "itemadd"){
                            if(data.name == "<wht>杨过的尸体</wht>"){
                                WG.remove_hook(this.index);
                                WG.Send("cr over")
                                messageAppend("本次副本结束，如不点击停止按钮则将在回满血或10秒后自动下一次", 1)
                                var b = "<div class=\"item-commands\"><span  id = 'onekeyjh'>停止</span></div>"
                                messageAppend(b);
                                $('#onekeyjh').on('click', function () {
                                    WG.allStop();
                                });
                                ktime[1] = setTimeout(function(){ WG.fb_gumu2();}, 10000);
                            }
                        }
                        else if(data.type == "text"){
                            if(data.msg.indexOf("你的精力不够，不能开启副本。") != -1){
                                WG.allStop();
                                WG.remove_hook(this.index);
                                messageAppend("精力不足，自动副本结束", 2)
                                WG.Send("taskover signin");
                                auto_perform = GM_getValue(role + "_auto_perform", auto_perform);
                                auto_perform2 = GM_getValue(role + "_auto_perform2", auto_perform2);
                                auto_perform3 = GM_getValue(role + "_auto_perform3", auto_perform3);
                                await WG.sleep(1000);
                                WG.zdwk();
                            }
                        }
                        else if(data.type == "die"){
                            if(data.commands){
                                ktime[0] = setTimeout(function(){ WG.Send("relive locale");}, 10000);
                            }
                        }
                    });
                }
            },
            //襄阳扫城墙
            xy_chengqiang:function(index){
                clearTimeout(xtime[0])
                if(!Helper.in_fight){
                    var message = $(".content-message pre").text();
                    var jungongmsg = "你获得了一点军功，目前500/500"
                    if(message.indexOf(jungongmsg) != -1){
                        WG.wkzidong();
                        setTimeout(function(){ tip("已打满500军功");}, 2000);
                        return;
                    }
                    switch(index){
                        case 0:WG.Send("jh fam 8 start;go north;go north;go north;go north;go west");break;
                        case 1:WG.Send("go west");break;
                        case 2:WG.Send("go west");break;
                        case 3:WG.Send("go west");break;
                        case 4:WG.Send("go south");break;
                        case 5:WG.Send("go south"); break;
                        case 6:WG.Send("go south");break;
                        case 7:WG.Send("go south");break;
                        case 8:WG.Send("go south");break;
                        case 9:WG.Send("go south");break;
                        case 10:WG.Send("go south");break;
                        case 11:WG.Send("go south");break;
                        case 12:WG.Send("go east");break;
                        case 13:WG.Send("go east");break;
                        case 14:WG.Send("go east");break;
                        case 15:WG.Send("go east");break;
                        case 16:WG.Send("go east");break;
                        case 17:WG.Send("go east");break;
                        case 18:WG.Send("go east");break;
                        case 19:WG.Send("go east");break;
                        case 20:WG.Send("go north");break;
                        case 21:WG.Send("go north");break;
                        case 22:WG.Send("go north");break;
                        case 23:WG.Send("go north");break;
                        case 24:WG.Send("go north");break;
                        case 25:WG.Send("go north");break;
                        case 26:WG.Send("go north");break;
                        case 27:WG.Send("go north");break;
                        case 28:WG.Send("go north");break;
                        case 29:WG.Send("go west");break;
                        case 30:WG.Send("go west");break;
                        case 31:WG.Send("go west");break;
                        case 32:WG.Send("go west");break;
                        case 33:
                            WG.Send("go west")
                            WG.fenjie_equip();
                            xtime[0] = setTimeout(function(){ WG.xy_chengqiang(1);}, 5000);
                            return;
                            break;
                    }
                    index++;
                }
                else{
                    WG.lianzhaoer();
                    WG.lianzhaoyi();
                }
                xtime[0] = setTimeout(function(){ WG.xy_chengqiang(index);}, 1000);
            },
            //襄阳定点守门
            xy_shoumen:function(){
                var jungong = 0
                messageAppend("开始守门，请勿移动",1)
                //if(autoperform == "开启"){Switch.AutoPerformSwitch(0)}
                this.hslj = WG.add_hook(["text", "itemadd", "combat", "room", "dialog"], function (data) {
                    if (data.type == "itemadd") {
                        //if(data.name.indexOf("百夫长")!= -1 || data.name.indexOf("千夫长")!= -1 || data.name.indexOf("万夫长")!= -1){
                        if(!data.p && data.hp){
                            clearTimeout(xtime[0]);
                            xtime[0] = setTimeout(function(){
                                WG.kill_all();
                                WG.lianzhaoer();
                                //WG.lianzhaoyi();
                            }, 100);
                        }
                    }
                    else if(data.type == "combat"){
                        if(data.start){

                        }
                        else if(data.end){
                            if(jungong >= 500){
                                WG.remove_hook(this.index);
                                Switch.AutoPerformSwitch(1);
                                WG.fenjie_equip();
                                setTimeout(function(){ tip("已打满500军功");}, 4000);
                                setTimeout(function(){WG.wkzidong();}, 3000);
                            }
                        }
                    }
                    else if(data.type == "text"){
                        if(data.msg.indexOf("点军功，目前") != -1){
                            jungong = parseInt(data.msg.match("目前([^%]+)/500")[1]);
                            tip("军功："+jungong)
                        }
                    }
                    else if(data.type == "dialog"){
                        if(data.dialog == "pack" && data.can_eq){
                            WG.Send("fenjie "+data.id)
                        }
                    }
                    else if(data.type == "room"){
                        messageAppend("定点守门已停止", 2)
                        WG.remove_hook(this.index);
                        Switch.AutoPerformSwitch(1)
                    }
                });
            },
            yabiao:async function(){
                if(WG.at("运镖-")){
                    WG.Send("go east");
                    WG.lianzhaoer();
                    WG.lianzhaoyi();
                }
                else{
                    WG.Send("jh fam 0 start;go west;go west;go south;go south")
                    setTimeout(function(){
                        var lists = $(".room_items .room-item");
                        for (var npc of lists) {
                            if(npc.innerText.indexOf("福威镖局当家的 林震南") != -1){
                                WG.Send("biao "+$(npc).attr("itemid"))
                            }
                        }
                    }, 500);
                }
            },
            timer_job:function(){
                setInterval(function(){
                    var screenmsg = $(".content-message pre").text();
                    if(screenmsg.indexOf("你的连接中断了") != -1 && screenmsg.indexOf("有人使用你的角色从别的地址登陆游戏") == -1){
                        messageClear();
                        WG.Send("wa");
                    }
                    if(role == "王大叔"){
                        var time = new Date();
                        var hour = time.getHours();
                        var minutes = time.getMinutes();
                        messageAppend("当前的时间是"+hour+"点"+minutes+"分")
                        if((hour == 12 || hour == 13 || hour == 14 || hour == 15) && minutes == 30){
                            if(Doing != "帮战" && Doing != "打紫"){
                                WG.allStop();
                                WG.Send("jh fam 0 start;go south;go south;go east;go east;go east")
                                setTimeout(function(){WG.Send("party fam XIAOYAO");}, (hour-12)*10000);
                            }
                        }
                    }
                }, 60000);
            },
            auto_zhangmen:function(){
                messageAppend("开始自动打橙，橙怪刷新时会自动叫杀，请勿移动", 1)
                this.hslj = WG.add_hook(["itemadd" , "room"], function (data) {
                    if(data.type == "itemadd"){
                        if(!data.p && data.name.indexOf("<hio>") != -1){
                            WG.kill_all();
                        }
                    }
                    else if(data.type == "room"){
                        messageAppend("自动打橙已停止", 2)
                        WG.remove_hook(this.index);
                    }
                });
            },
            killer:function(){
                var target = "九头蛇"
                messageAppend("开始追杀"+target,1)
                this.hslj = WG.add_hook(["itemadd" , "items"], function (data) {
                    if(data.type == "itemadd"){
                        if(data.name.indexOf(target) != -1){
                            WG.Send("kill "+data.id);
                        }
                    }
                    else if(data.type == "items"){
                        for(var i = 0; i < items.length; i++){
                            if(items[i].name.indexOf(target) != -1){
                                WG.Send("kill "+data.id)
                            }
                        }
                    }
                });
            },
            test_test:function(){
                
                WG.Send("perform force.foguang")
                xtime[0] = setInterval(function(){WG.Send("perform force.foguang")},18000)
                xtime[1] = setTimeout(function(){
                    WG.Send("perform force.zhao")
                    xtime[2] = setInterval(function(){WG.Send("perform force.zhao")},18000)
                },9000)
                messageAppend("忙乱状态是"+in_busy)
                messageAppend("当前在做的事情是"+Doing)
                messageAppend("已获得帝魄数量："+get_dipo)
            },
            fb_yywd:async function(){
                WG.Send("enable force none")
                await WG.sleep(1000)
                WG.zhandouzhuang();
                WG.Send("cr wuyue/qingcheng/shanlu")
                await WG.sleep(500)
                WG.Send("go westup;go north;look cao")
                await WG.sleep(500)
                WG.Send("tiao cao;yywd ok")
                await WG.sleep(1000)
                WG.Send("pa tu")
                this.hslj = WG.add_hook(["text","cmds"],async function (data) {
                    if(data.type == "text"){
                        if(data.msg.indexOf("男人们都像天神般威武雄壮，女人们都像仙子般高贵，你在黑暗中看得痴了") != -1){
                            await WG.sleep(2000)
                            WG.Send("answer s2");
                        }
                        else if(data.msg.indexOf("这洞穴幽暗无比，加上着诡异的壁画，让人心神不宁") != -1){
                            await WG.sleep(2000)
                            WG.Send("answer s4");
                        }
                        else if(data.msg.indexOf("你向后退，终于看见了这个人是一个梳高髻") != -1){
                            await WG.sleep(2000)
                            WG.Send("answer s5");
                        }
                        else if(data.msg.indexOf("那丽人嫣然道：我不是鬼，我有名字的") != -1){
                            await WG.sleep(2000)
                            WG.Send("answer s7");
                        }
                        else if(data.msg.indexOf("青青轻笑道：我虽不是鬼，但我是个狐仙") != -1){
                            await WG.sleep(2000)
                            WG.Send("answer s9");
                        }
                        else if(data.msg.indexOf("青青说道：此处叫做忧愁谷，这个山洞的壁画会引诱人心深处的贪念") != -1){
                            await WG.sleep(2000)
                            WG.Send("answer s10");
                        }
                        else if(data.msg.indexOf("青青往北方走去。") != -1) {
                            await WG.sleep(200)
                            WG.Send("go north")
                        }
                        else if(data.msg.indexOf("青青往南方走去。") != -1) {
                            await WG.sleep(200)
                            WG.Send("go south")
                        }
                        else if(data.msg.indexOf("青青往东方走去。") != -1) {
                            await WG.sleep(200)
                            WG.Send("go east")
                        }
                        else if(data.msg.indexOf("青青往西方走去。") != -1) {
                            await WG.sleep(200)
                            WG.Send("go west")
                        }
                        else if(data.msg.indexOf("这只鹰忽然流星般向岩石上的忘忧草俯冲下去。") != -1){
                            await WG.sleep(1000)
                            WG.Send("answer s1;cai cao");
                        }
                        else if(data.msg.indexOf("骑鹰的老头忽然仰天而笑：果然是这把刀，老天有眼") != -1){
                            await WG.sleep(1000)
                            WG.Send("answer s3");
                        }
                        else if(data.msg.indexOf("青青看你醒过来，脸色有些奇怪，") != -1){
                            WG.Send("go west;go north;liaoshang")
                        }
                        else if(data.msg.indexOf("老婆婆冷冷地看着你：你是青青救回来的，是几十年来第") != -1){
                            //await WG.sleep(601000)
                            //WG.Send("go west;go north")
                        }
                        else if(data.msg.indexOf("一个极其魁梧的中年男人冒出来拦住你：这位") != -1){
                            await WG.sleep(5000)
                            WG.Send("go north")
                        }
                    }
                    else if(data.type == "cmds"){
                        if(data.items[0].cmd == "ofb ok"){
                            WG.remove_hook(this.index);
                        }
                    }
                });
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
            AutoReliveSwitch:function(){
                if(autorelive == "关闭"){
                    autorelive = "开启";
                    tip("自动复活已打开")
                }
                else{
                    autorelive = "关闭";
                    tip("自动复活已关闭")
                }
            },
            AutoPerformSwitch:function(para1){
                if(para1 == undefined){
                    if(autoperform == "关闭"){
                        autoperform = "开启";
                        WG.lianzhao_concat();
                        $(".auto_perform").css("background", "#00FFFF");
                        messageAppend("自动出招已打开", 1)
                    }
                    else{
                        autoperform = "关闭";
                        WG.Send("setting auto_pfm 0")
                        $(".auto_perform").css("background", "");
                        messageAppend("自动出招已关闭" ,2)
                    }
                }
                else{
                    if(para1 == 1){
                        autoperform = "开启";
                        WG.lianzhao_concat();
                        $(".auto_perform").css("background", "#00FFFF");
                        messageAppend("自动出招已打开", 1)
                    }
                    else{
                        autoperform = "关闭";
                        WG.Send("setting auto_pfm 0")
                        $(".auto_perform").css("background", "");
                        messageAppend("自动出招已关闭" ,2)
                    }
                }
                GM_setValue(role + "_autoperform", autoperform);
            },
            AutoZhangmenSwitch:function(){
                if(Saohuang_zhangmen == "关闭"){
                    Saohuang_zhangmen = "开启";
                    tip("自动掌门已打开")
                }
                else{
                    Saohuang_zhangmen = "关闭";
                    tip("自动掌门已关闭")
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
                            if (data.items[idx].name == '9金贺礼') {
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
                roomData = data.items
            },
            showallhp() {
                if (showHP == "开启") {
                    roomData.forEach(function (v, k) {
                        if (v != 0) {
                            if (v.hp) {
                                $(".item-plushp[itemid=" + v.id + "]").remove();
                                $("[itemid=" + v.id + "] .item-status").after("<span class='item-plushp' itemid='" + v.id + "'></span>").next();
                                $(".item-plushp[itemid=" + v.id + "]").html("<hig>" + v.hp + "(" + Math.floor(v.hp / v.max_hp * 100) + "%)</hig>");
                            }
                        }
                    });
                } else if (showHP == "停止") {
                    $(".plushp").remove();
                }
            },
            show_DPS: function (id, item) {
                if (showHP == "开启") {
                    let s = $(".room-item[itemid=" + id + "] .item-dps");
                    if (s.length == 0) {
                        s = $(".room-item[itemid=" + id + "] .item-status").after("<span class='item-dps'></span>").next();
                    }
                    let html = "";
                    if (item.damage){
                        html = "<hir>" + item.damage + "(" + Math.floor(item.damage / item.max_hp * 100) + "%)</hir>";
                        //html = "<hir>" + item.damage + "(" + Math.floor(item.damage / item.max_hp * 1000)/10 + "%)</hir>";//这条可以精确到小数点后面1位
                    }
                    s.html(html);
                }
            },
            eqx: null,
            eqhelper: function (type) {
                if (type == undefined || type == 0) {
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
            eqhelperdel: function () {
                eqlist = {
                    1: [],
                    2: [],
                    3: []
                };
                GM_setValue(role + "_eqlist", eqlist);
                messageAppend("清除套装设置成功!", 1);
            },
            eqwear:async function (type,wtime) {
                eqlist = GM_getValue(role + "_eqlist", eqlist)
                if(eqlist[type] == undefined){
                    if(type == 1){messageAppend("未记录战斗装", 2);return}
                    else if(type == 2){messageAppend("未记录悟性装", 2);return}
                    else if(type == 3){messageAppend("未记录躺尸装", 2);return}
                    else if(type == 4){messageAppend("未记录打坐装", 2);return}
                    else if(type == 5){type = 1;messageAppend("未记录追捕装，将更换战斗装", 2)}//如果未记录追捕装则换战斗装
                    else if(type == 6){type = 1;messageAppend("未记录打橙装，将更换战斗装", 2)}//如果未记录追捕装则换战斗装
                };
                if(wtime == undefined){wtime = 0}
                for (var i = 1; i < eqlist[type].length; i++) {
                    //如果记录中对应的部位没有记录装备则不更换
                    if(eqlist[type][i]){
                        //检查对应的部位是否有装备，如果有则查看ID与记录的是否相同
                        if (eqlist[type][i].id != eqlistNow[i]) {
                            WG.Send("eq " + eqlist[type][i].id);
                            if(wtime != 0){await WG.sleep(wtime);}
                        }
                    }
                }
                //最后换上武器
                if(eqlist[type][0]){
                    if (eqlist[type][0].id != eqlistNow[0]){
                        WG.Send("eq " + eqlist[type][0].id);
                    }
                }
                Helper.enable_skill(type,wtime)
            },
            enable_skill: async function(type,wtime) {
                if(skilllist[type] == undefined){
                    if(type == 5){type = 1}//如果未记录追捕装则换战斗装
                    else if(type == 6){type = 1}//如果未记录追捕装则换战斗装
                    else{return}
                };
                if(wtime == undefined){wtime = 0}
                for(var i = 0;i < skilllist[type].length;i++){
                    let item = G.skill_list.get(skilllist[type][i].id)
                    //messageAppend(item.enable_skill+":"+skilllist[type][i].enable_skill)
                    if(item){
                        if(item.enable_skill != skilllist[type][i].enable_skill && skilllist[type][i].enable_skill != undefined){
                            WG.Send("enable "+skilllist[type][i].id+" "+skilllist[type][i].enable_skill)
                            if(wtime != 0){await WG.sleep(wtime);}
                        }
                    }
                }
                await WG.sleep(100);
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
            WG.add_hook(["login", "room", "items", "itemadd", "itemremove", "sc", "text", "state", "msg", "perform", "dispfm", "clearDistime", "combat","status","die", "exits"], function (data) {
                if (data.type == "login") {
                    G.id = data.id;
                }
                else if (data.type == "exits"){
                    G.exits = new Map();
                    if(data.items["north"]){G.exits.set("north", {exits:data.items["north"]})}
                    else if(data.items["northup"]){G.exits.set("northup", {exits:data.items["northup"]})}
                    else if(data.items["northdown"]){G.exits.set("northdown", {exits:data.items["northdown"]})}
                    if(data.items["south"]){G.exits.set("south", {exits:data.items["south"]})}
                    else if(data.items["southup"]){G.exits.set("southup", {exits:data.items["southup"]})}
                    else if(data.items["southdown"]){G.exits.set("southdown", {exits:data.items["southdown"]})}
                    if(data.items["east"]){G.exits.set("east", {exits:data.items["east"]})}
                    else if(data.items["eastup"]){G.exits.set("eastup", {exits:data.items["eastup"]})}
                    else if(data.items["eastdown"]){G.exits.set("eastdown", {exits:data.items["eastdown"]})}
                    if(data.items["west"]){G.exits.set("west", {exits:data.items["west"]})}
                    else if(data.items["westup"]){G.exits.set("westup", {exits:data.items["westup"]})}
                    else if(data.items["westdown"]){G.exits.set("westdown", {exits:data.items["westdown"]})}
                    if(data.items["up"]){G.exits.set("up", {exits:data.items["up"]})}
                    if(data.items["down"]){G.exits.set("down", {exits:data.items["down"]})}
                    if(data.items["enter"]){G.exits.set("enter", {exits:data.items["enter"]})}
                    if(data.items["out"]){G.exits.set("out", {exits:data.items["out"]})}
                }
                else if (data.type == "room") {
                    let tmp = data.path.split("/");
                    G.map = tmp[0];
                    G.room = tmp[1];
                    G.room_name = data.name;
                    if(Helper.in_fight == true){Helper.in_fight = false}
                }
                else if (data.type == "items") {
                    Helper.saveRoomstate(data);
                    Helper.showallhp();
                    G.items = new Map();
                    for (i = 0; i < data.items.length; i++) {
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
                else if (data.type == "itemadd") {
                    if (data.id) {
                        if(showHP == "开启"){
                            Helper.showallhp();
                        }
                        for(i = 0; i < roomData.length; i++){
                            if(roomData[i].id == data.id){
                                return
                            }
                        }
                        roomData.push(data);
                    }
                    if((data.hp &&!data.p) || data.id == G.id){
                        let n = $.trim($('<body>' + data.name + '</body>').text());
                        let i = n.lastIndexOf(' ');
                        let j = n.lastIndexOf('<');
                        let t = "";
                        let s = "";
                        if (i >= 0) {
                            t = n.substr(0, i);
                            if (j >= 0) {
                                s = n.substr(j + 1, 2);
                            }
                            n = n.substr(i + 1).replace(/<.*>/g, '');
                        }
                        G.items.set(data.id, { name: n, title: t, state: s, max_hp: data.max_hp, max_mp: data.max_mp, hp: data.hp, mp: data.mp, p: data.p, damage: 0 });
                    }
                }
                else if (data.type == "itemremove") {
                    roomData.forEach(function (v, k) {
                        if (v.id == data.id) {
                            $(".plushp[itemid=" + v.id + "]").remove();
                            roomData.splice(k, 1);
                            Helper.showallhp();
                        }
                    });
                    G.items.delete(data.id);
                }
                else if (data.type == "sc") {
                    //显示血量处理
                    if ("hp" in data && showHP == "开启") {
                        roomData.forEach(function (v, k) {
                            if (v.id == data.id) {
                                v.hp = data.hp;
                            }
                        });
                    }

                    let item = G.items.get(data.id);
                    if(item){
                        if (data.hp !== undefined) {
                            item.hp = data.hp;
                            if (data.id != G.id) {
                                G.scid = data.id;    //伤害统计需要
                            }
                            else{
                                if(data.hp/item.max_hp * 100 < autouse_dao && Helper.in_fight){
                                    if(!G.cds.get("parry.dao") && G.skills.indexOf("parry.dao") != -1){
                                        WG.Send("perform parry.dao")
                                    }
                                }
                            }
                            Helper.showallhp();
                        }
                        if (data.mp !== undefined) {
                            item.mp = data.mp;
                        }
                    }
                }
                else if (data.type == "text") {
                    if(data.msg.indexOf("你似乎听到禅院内部有些异响，衣袂声起，几个压阵的僧人迅速") != -1){
                        WG.Send("go north;go northwest")
                    }
                    if (Helper.in_fight) {
                        let dps_index1 = data.msg.indexOf("造成<");
                        if (dps_index1 >= 0) {
                            let dps_index2 = data.msg.indexOf("/", dps_index1);
                            let item = G.items.get(G.scid);
                            if (item) {
                                item.damage += parseInt(data.msg.slice(dps_index1 + 7, dps_index2 - 1));
                                Helper.show_DPS(G.scid, item);
                            }
                        }
                        else if(data.msg.indexOf("只能在战斗中使用") != -1){
                            if(Helper.in_fight){Helper.in_fight = false}
                        }
                        else if(data.msg.indexOf("最近没有使用绝招，你无法模仿") != -1){
                            G.cds.set("force.duo", true);
                            G.cds.set("parry.dou", true);
                            setTimeout(function () {
                                G.cds.set("force.duo", false);
                                G.cds.set("parry.dou", false);
                            }, 3000);
                        }
                        else if(data.msg.indexOf("只可以模仿武器和拳脚技能") != -1){
                            G.cds.set("parry.dou", true);
                            setTimeout(function () { G.cds.set("parry.dou", false)}, 3000);
                        }
                    }
                    else{
                        if(data.msg.indexOf("帮会管理员说道：帮派活跃度不够，无法开启门派战。") != -1){
                            WG.zdwk();
                        }
                        else if(data.msg.indexOf("帮会管理员说道：我们帮派正在进攻别的门派。") != -1){
                            ktime[0] = setTimeout(function(){WG.Send("party fam XIAOYAO")}, 1000);
                        }
                    }
                }
                else if (data.type == "perform") {
                    G.skills = "";
                    for(i = 0;i < data.skills.length;i++){
                        G.skills = G.skills.concat(data.skills[i].id)
                        G.skills = G.skills.concat(",")
                    }
                    //G.skills = data.skills;
                }
                else if(data.type == "clearDistime"){
                    //当使用长生诀天地诀时重置除了内功以外所有cd
                    messageAppend("cd clear!",2)
                    G.cds.forEach(function (v, k) {
                        if (k.indexOf("force") == -1) {
                            v = false
                        }
                    });
                }
                else if (data.type == 'dispfm') {
                    if (data.id) {
                        if (data.distime) {}
                        G.cds.set(data.id, true);
                        var _id = data.id;
                        setTimeout(function () {
                            G.cds.set(_id, false);
                        }, data.distime);
                        if(data.id == "unarmed.shiba"){
                            in_busy += 1;
                            setTimeout(function(){in_busy -= 1}, data.rtime);
                            messageAppend("使用了降龙，需要等待出招结束")
                        }
                    }
                    if (data.rtime) {
                        G.gcd = true;
                        setTimeout(function () {
                            G.gcd = false;
                        }, data.rtime);
                    } else {
                        G.gcd = false;
                    }
                }
                else if (data.type == "combat") {
                    if (data.start) {
                        Helper.in_fight = true;
                        WG.wudao_autopfm();
                    }
                    if (data.end) {
                        Helper.in_fight = false;
                        if(autoperform == "开启"){WG.lianzhao_concat()};
                    }
                }
                else if (data.type == "status") {
                    if(data.action == "remove" && data.id != G.id && autobusy == "开启"){
                        let item = G.items.get(data.id)
                        if(item){
                            if(data.sid == "busy"){
                                if(autobusy_skill != undefined){
                                    var  autobusy_skill1 = autobusy_skill.split(',')
                                    for(var j = 0;j < autobusy_skill1.length; j++){
                                        WG.Send("perform "+autobusy_skill1[j])
                                    }
                                }
                            }
                            else if(data.sid == "faint"){
                                if(autofaint_skill != undefined){
                                    var autofaint_skill1 = autofaint_skill.split(',')
                                    for(var k = 0;k < autofaint_skill1.length; k++){
                                        WG.Send("perform "+autofaint_skill1[k])
                                    }
                                }
                            }
                            //自动接迟钝
                            else if(data.sid == "chidun"){
                                if(G.skills.indexOf("force.xi") != -1 && G.skills.indexOf("force.power") != -1){
                                    WG.Send("perform force.power")
                                }
                            }
                        }
                    }
                    else if(data.action == "add"){
                        if((data.sid == "busy" || data.sid == "faint") && data.id == G.id){
                            messageAppend("进入忙乱状态",2)
                            in_busy += 1;
                            setTimeout(function(){
                                messageAppend("脱离忙乱状态",2);
                                in_busy -= 1;
                            }, data.duration);
                        }
                    }
                    else if(data.id == G.id && autoperform == "开启"){
                        /*
                        if(data.action == "remove" && Helper.in_fight){
                            WG.lianzhaoer();
                        }
                        else*/
                        if(!Helper.in_fight){
                            WG.lianzhao_concat();
                        }
                    }
                }
                else if (data.type == "die"){
                    if(autorelive == "开启" && data.commands != undefined){
                        if(Doing == "打长老" || Doing == "打掌门" || Doing == "帮战"){
                            for(xx in xtime){clearTimeout(xtime[xx])};
                            WG.Send("relive");
                            if(Doing == "打长老"){
                                xtime[1] = setTimeout(function(){WG.Send("jh fam 5 start;go down;go down");}, 5000);
                                xtime[2] = setTimeout(function(){WG.get_all();WG.SaohuangZhanglao()}, 6000);
                            }
                            else if(Doing == "打掌门"){
                                xtime[1] = setTimeout(function(){WG.Send("jh fam 5 start;go down;go down");}, 5000);
                                xtime[2] = setTimeout(function(){WG.get_all();WG.SaohuangZhangmen()}, 6000);
                            }
                            else if(Doing == "帮战"){
                                xtime[1] = setTimeout(function(){WG.Send("liaoshang");}, 5000);
                                xtime[2] = setTimeout(function(){WG.Send("stopstate");}, 20000);
                                xtime[3] = setTimeout(function(){
                                    WG.unenable_skill();
                                    Switch.AutoPerformSwitch(0);
                                    WG.SaohuangGo();
                                }, 21000);
                            }
                            else if(Doing == "打紫"){
                                xtime[1] = setTimeout(function(){WG.Send("jh fam 5 start;go west");}, 5000);
                                xtime[2] = setTimeout(function(){WG.SaohuangDazi();}, 6000);
                            }
                        }
                    }
                }
            });
            WG.add_hook("dialog", function (data) {
                //console.dir(data);
                if(data.dialog == "skills"){
                    if(data.items){
                        for (var ii = 0; ii < data.items.length; ii++) {
                            let item = data.items[ii];
                            G.skill_list.set(item.id, {level: item.level , enable_skill: item.enable_skill});
                        }
                    }
                    else if(data.exp){
                        var buff0 =$(".room_items .room-item .item-status-bar:first").text();
                        if(buff0.indexOf("冰心丹") == -1 && auto_bingxindan == 1 && Doing == "练功"){
                            WG.Send("stopstate");
                            WG.Send("use "+id_bingxindan);
                            xtime[0] = setTimeout(function(){WG.practice_skill2();}, 1000);
                        }
                        if(data.level){
                            if (Doing == "练功"){
                                let item = G.skill_list.get(data.id)
                                item.level = data.level
                                if(data.level >= skill_limit){
                                    //messageAppend("技能上限是"+skill_limit+" 当前技能"+data.id+"等级为"+data.level+"已修炼完成");
                                    WG.Send("stopstate");
                                    practice_index++;
                                    WG.practice_skill2();
                                }
                                else{
                                    tip("技能上限是"+skill_limit+" 当前技能"+data.id+"等级为"+data.level+"尚未修炼完成");
                                }
                            }
                        }
                    }
                    else if(data.enable != undefined){
                        let item = G.skill_list.get(data.id)
                        //G.skill_list.set(item.id, {level: item.level , enable_skill: data.enable});
                        item.enable_skill = data.enable
                    }
                }
                else if(data.dialog == "pack"){
                    if(data.items){
                        for(var i = 0;i < data.items.length; i++){
                            if(data.items[i].name.indexOf("冰心丹") != -1){
                                id_bingxindan = data.items[i].id
                                //messageAppend("冰心丹的ID是"+id_bingxindan)
                            }
                        }
                    }
                    if(data.eqs){
                        if(data.eqs[0]){weapon = data.eqs[0].id}
                        for(i = 0;i < data.eqs.length; i++){
                            if(data.eqs[i]){
                                eqlistNow[i] = data.eqs[i].id
                            }
                            else{
                                eqlistNow[i] = ""
                            }
                        }
                        //eqlistNow = data.eqs;
                    }
                    else if(data.eq != undefined){
                        eqlistNow[data.eq] = data.id
                        if(data.eq == 0){weapon = data.id}
                    }
                    else if(data.uneq != undefined){
                        eqlistNow[data.uneq] = "";
                    }
                    else if(data.name == "<hio>帝魄碎片</hio>"){get_dipo++;}
                }
            });
            WG.add_hook("msg", function (data) {
                switch(data.ch){
                    case "sys":
                        var automarry = GM_getValue(role + "_automarry", automarry);
                        if (data.content.indexOf("，婚礼将在一分钟后开始。") >= 0) {
                            //console.dir(data);
                            if (automarry == "开启" && (Doing == "挖矿" || Doing == "练功" || Doing == "打坐")) {
                                console.log("xiyan");
                                messageAppend("自动前往婚宴地点")
                                Helper.xiyan();
                            }
                            else{
                                /*
                                var b = "<div class=\"item-commands\"><span  id = 'onekeyjh'>参加喜宴</span></div>"
                                messageClear();
                                messageAppend("<hiy>点击参加喜宴</hiy>");
                                messageAppend(b);
                                $('#onekeyjh').on('click', function () {
                                    Helper.xiyan();
                                });
                                */
                            }
                        }
                        break;
                    case "rumor":
                        if (data.content.indexOf("听说") >= 0 &&
                            data.content.indexOf("出现在") >= 0 &&
                            data.content.indexOf("一带。") >= 0) {
                            zb_npc = data.content.match("听说([^%]+)出现在")[1];
                            //console.dir(data);
                            if(autoKsBoss == "开启" && contains(myboss, zb_npc) && (Doing == "挖矿" || Doing == "练功" || Doing == "打坐")){
                                WG.go_boss(data);
                            }
                            else{
                                /*
                                var c = "<div class=\"item-commands\"><span id = 'onekeyKsboss'>传送到boss</span></div>";
                                messageClear();
                                messageAppend("boss已出现");
                                messageAppend(c);
                                $('#onekeyKsboss').on('click', function () {
                                    WG.go_boss(data);
                                });
                                */
                            }
                        }
                        break;
                    case "pty":
                        if(join_bangzhan == "开启"){
                            if (data.content.indexOf("眷诚斋成员听令，即刻起开始进攻逍遥派。") != -1 ){
                                //console.dir(data);
                                WG.Saohuang();
                                var time = new Date();
                                var hour = time.getHours();
                                if(hour == 12){get_dipo = 0};//重置获得帝魄的数量
                            }
                            else if (data.content.indexOf("和逍遥派的战争结束了") != -1){
                                Doing = "";
                                messageAppend("门派战结束，5秒后开始分解装备",2)
                                WG.allStop();
                                setTimeout(function(){WG.fenjie_zhuangbei();}, 5000);
                            }
                            else if(data.content.indexOf("王大叔声嘶力竭地叫道") != -1){
                                if(role == "王大叔"){return}
                                if(unenable_skill != "" || unenable_skill != undefined){//卸掉技能，一圈扫黄完再自动装上
                                    WG.Send("stopstate")
                                    WG.Send("uneq "+weapon)
                                    WG.unenable_skill()
                                }
                                setTimeout(function(){WG.Saohuang()}, 1000);
                            }
                        }
                        break;
                    case "chat":
                        if(data.name == "王大叔" && data.content.indexOf("孩儿们") != -1){
                            WG.Send("chat 老板，有何吩咐！")
                        }
                        else if(data.name == "矿场工头" && data.content.indexOf("挖矿指南已结束！！！！！！！！！") != -1){
                           //WG.Send("stopstate;use avw24f3a4b2;xiulian")
                        }
                        break;
                    case "fam":
                        if(data.content.indexOf("表现突出，提升为金牌杀手") != -1){
                            //if(role =="王大叔"){WG.go_family();}
                        }
                        break;
                }
            });
            //献祭内力
            WG.add_hook("cmds", function (data) {
                if(data.items){
                    if(data.items[0].cmd == "wqcy next"){
                        WG.Send("wqcy next")
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
                            "打掌门": {
                                name: "打掌门",
                                callback: function (key, opt) {
                                    WG.SaohuangZhangmen();
                                },
                            },
                            "盘点仓库": {
                                name: "盘点仓库",
                                callback: function (key, opt) {
                                    WG.pandian_cangku();
                                },
                            },
                            "分解装备": {
                                name: "分解装备",
                                callback: function (key, opt) {
                                    WG.fenjie_equip();
                                },
                            },
                            "襄阳-扫城墙": {
                                name: "襄阳-扫城墙",
                                callback: function (key, opt) {
                                    WG.xy_chengqiang(0);
                                },
                            },
                            "襄阳-定点守门": {
                                name: "襄阳-定点守门",
                                callback: function (key, opt) {
                                    WG.xy_shoumen();
                                },
                            },
                            "打公共橙": {
                                name: "打公共橙",
                                callback: function (key, opt) {
                                    WG.auto_zhangmen();
                                },
                            },
                            "打红-斗转": {
                                name: "打红-斗转",
                                callback: function (key, opt) {
                                    WG.mpz_dahong();
                                },
                            },
                            "打红-送死": {
                                name: "打红-送死",
                                callback: function (key, opt) {
                                    WG.mpz_dahong2();
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
                            "rec_eq6": {
                                name: "记录打橙装（不记录会更换战斗装）",
                                callback: function (key, opt) {
                                    Helper.eqhelper(6);
                                },
                            },
                            "rec_eq99": {
                                name: "记录矿镐",
                                callback: function (key, opt) {
                                    Helper.eqhelper(99);
                                },
                            },
                            "clear_rec": {
                                name: "清除所有套装记录",
                                callback: function (key, opt) {
                                    Helper.eqhelperdel();
                                },
                            },
                        }
                    },
                    "快速换装": {
                        name: "快速换装",
                        "items": {
                            "eq6": {
                                name: "打橙装",
                                callback: function (key, opt) {
                                    Helper.eqwear(6);
                                },
                            },
                            "eq4": {
                                name: "打坐装",
                                callback: function (key, opt) {
                                    Helper.eqwear(4);
                                },
                            },
                        }
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
                            "自动复活开关": {
                                name: "自动复活",
                                callback: function (key, opt) {
                                    Switch.AutoReliveSwitch();
                                },
                            },
                            "自动出招开关": {
                                name: "自动出招",
                                callback: function (key, opt) {
                                    Switch.AutoPerformSwitch();
                                },
                            },
                            "自动掌门开关": {
                                name: "自动掌门",
                                callback: function (key, opt) {
                                    Switch.AutoZhangmenSwitch();
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
                    "副本": {
                        name: "副本",
                        "items": {
                            "华山论剑": {
                                name: "华山论剑",
                                callback: function (key, opt) {
                                    WG.fb_huashanlunjian(0);
                                },
                            },
                            "困难古墓": {
                                name: "困难古墓",
                                callback: function (key, opt) {
                                    WG.fb_gumu2(0);
                                },
                            },
                            "圆月弯刀": {
                                name: "圆月弯刀",
                                callback: function (key, opt) {
                                    WG.fb_yywd();
                                },
                            },
                        },
                    },
                    "扫黄": {
                        name: "扫黄",
                        callback: function (key, opt) {
                            WG.Saohuang();
                        },
                    },
                    "清虚弱": {
                        name: "清虚弱",
                        callback: function (key, opt) {
                            WG.clear_xuruo();
                        },
                    },
                    "设置": {
                        name: "设置",
                        callback: function (key, opt) {
                            WG.setting();
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