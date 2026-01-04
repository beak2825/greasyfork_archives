// ==UserScript==
// @name         wsmud_plugins 修正版by将来
// @namespace    cqv
// @version      1.3.6
// @date         01/07/2018
// @modified     11/07/2018
// @homepage     https://greasyfork.org/zh-CN/scripts/370135
// @description  武神传说 MUD
// @author       fjcqv
// @match        http://game.wsmud.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/371320/wsmud_plugins%20%E4%BF%AE%E6%AD%A3%E7%89%88by%E5%B0%86%E6%9D%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/371320/wsmud_plugins%20%E4%BF%AE%E6%AD%A3%E7%89%88by%E5%B0%86%E6%9D%A5.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var roomItemSelectIndex = -1;
    var timer = 0;
    var cnt = 0;
    var ch;
    var btime;
    var xuetime;
    var ktime;
    var btimetwo;
    var dztime;
    var dazuotime;
    var yaoyan;
    var zb_npc;
    var zidongjineng;
    var zb_place;
    ///var maptime = setInterval(function(){ $("svg").css("margin-left","-280");}, 300);///////////////////css  地图调整///
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
    var equip = {
        "铁镐": 0,
    };
    var npcs = {
        "店小二": 0
    };
    var place = {
        "巨木旗": "go north;go west;go northwest;go north;go north;go north;go north;go west",
        "豪宅-花园": "jh fam 0 start;go west;go west;go north;go enter;go northeast",
        "豪宅-卧室": "jh fam 0 start;go west;go west;go north;go enter;go north",
        "豪宅-练功房": "jh fam 0 start;go west;go west;go north;go enter;go west",
        "豪宅-练药房": "jh fam 0 start;go west;go west;go north;go enter;go east",
        "扬州城-醉仙楼": "jh fam 0 start;go north;go north;go east",
        "扬州城-武庙": "jh fam 0 start;go north;go north;go west",
        "扬州城-钱庄": "jh fam 0 start;go north;go west",
        "扬州城-杂货铺": "jh fam 0 start;go east;go south",
        "扬州城-打铁铺": "jh fam 0 start;go east;go east;go south",
        "扬州城-药铺": "jh fam 0 start;go east;go east;go north",
        "扬州城-衙门正厅": "jh fam 0 start;go west;go north;go north",
        "扬州城-矿山": "jh fam 0 start;go west;go west;go west;go west",
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
        "华山派-山洞": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;enter",
        "华山派-长空栈道": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;enter;go westup",
        "华山派-落雁峰": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;enter;go westup;go westup",
        "峨眉派-金顶": "jh fam 4 start",
        "峨眉派-庙门": "jh fam 4 start;go west",
        "峨眉派-广场": "jh fam 4 start;go west;go south",
        "峨眉派-走廊": "jh fam 4 start;go west;go south;go west",
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
        "襄阳城-广场": "jh fam 7 start",
        "武道塔": "jh fam 8 start"
    };
    var family = null;

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
            if ($(".channel-box").is(":visible")) {
                KEY.chatModeKeyEvent(event);
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
                    // S 卧室
                    WG.woshi();
                    break;
                case 90:
                    // Z 炼药房
                    WG.lianyaofang();
                    break;
                case 88:
                    // X 醉仙楼
                    WG.zuixianlou();
                    break;
                case 13:
                    // 回车 聊天
                    KEY.do_command("showchat");
                    return false;
                case 65:
                    // A 小花园
                    WG.xiaohuayuan();
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
                    WG.liangongfang();
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
                case 54:
                    // 6
                    if (altKey) {
                        KEY.onRoomItemAction(5);
                    } else if (ctrlKey) {
                        KEY.room_commands(5);
                    } else {
                        KEY.combat_commands(5);

                    }
                    return false;
                 case 55:
                    // 7
                    if (altKey) {
                        KEY.onRoomItemAction(6);
                    } else if (ctrlKey) {
                        KEY.room_commands(6);
                    } else {
                        KEY.combat_commands(6);

                    }
                    return false;
                 case 56:
                    // 8
                    if (altKey) {
                        KEY.onRoomItemAction(7);
                    } else if (ctrlKey) {
                        KEY.room_commands(7);
                    } else {
                        KEY.combat_commands(7);

                    }
                    return false;
                 case 57:
                    // 9
                    if (altKey) {
                        KEY.onRoomItemAction(8);
                    } else if (ctrlKey) {
                        KEY.room_commands(8);
                    } else {
                        KEY.combat_commands(8);

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
  //              case 103:
  //                // NumPad 7
  //              WG.Send("go northwest");
  //            KEY.onChangeRoom();
  //          break;
  //              case 104:
                    // NumPad 8
                case 38:
                    // Up Arrow
                    WG.Send("go north");
                    KEY.onChangeRoom();
                    break;
  //              case 105:
                    // NumPad 9
  //                  WG.Send("go northeast");
  //                  KEY.onChangeRoom();
  //                  break;
    //            case 100:
                    // NumPad 4
                case 37:
                    // Left Arrow
                    WG.Send("go west");
                    KEY.onChangeRoom();
                    break;
   //             case 102:
                    // NumPad 6
                case 39:
                    // Right Arrow
                    WG.Send("go east");
                    KEY.onChangeRoom();
                    break;
   //             case 97:
                    // NumPad 1
   //                 WG.Send("go southwest");
   //                 KEY.onChangeRoom();
   //                 break;
   //             case 98:
                    // NumPad 2
                case 40:
                    // Down Arrow
                    WG.Send("go south");
                    KEY.onChangeRoom();
                    break;
    //            case 99:
                    // NumPad 3
    //                WG.Send("go southeast");
    //                KEY.onChangeRoom();
    //                break;
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
    function messageAppend(m) {
        $(".content-message pre").append(m);
    }
    function tip(t) {
        $(".WG_Tip").html(t);
    }

    var WG = {
        init: function () {
            $(".bottom-bar").append("<span class='item-commands' style='display:none'><span WG='WG' cmd=''></span></span>"); //命令行模块
            var t
            $(".content-message").after("<div class='' style='right:45px;bottom:3em;'>" +"手动指令：<span class='zdy-item xiaohuayuan'>小花园(A)</span>" +"<span class='zdy-item woshi'>卧室(S)</span>" + "<span class='zdy-item liangongfang'>练功房(T)</span>" + "<span class='zdy-item lianyaofang'>炼药房(Z)</span>" + "<span class='zdy-item zuixianlou'>醉仙楼(X)</span>" +  "<span class='zdy-item wuxingzhuang'>悟性装</span>" + "<span class='zdy-item zhandouzhuang'>战斗装</span>" +"<span class='zdy-item liaoshang'>疗伤(R)</span>" + "<span class='zdy-item zdwk'>挖矿(G)</span><br>"+"快速传送：<span class='zdy-item shaolin'>少林</span>"+ "<span class='zdy-item wudang'>武当</span>"+ "<span class='zdy-item emei'>峨眉</span>"+ "<span class='zdy-item huashan'>华山</span>"+ "<span class='zdy-item xiaoyao'>逍遥</span>"+ "<span class='zdy-item gaibang'>丐帮</span>"+ "<span class='zdy-item sell_all'>清包</span>"  +"<span class='zdy-item zahuopu'>杂货铺</span>"+"<span class='zdy-item yaopu'>药铺</span>"+ "<span class='zdy-item check_dazuo_auto'>自动打坐</span><br>"+ "快捷：<span class='zdy-item kill_all'>击杀(D)</span>" + "<span class='zdy-item get_all'>拾取(F)</span>"  + "<span class='zdy-item go_family'>接(Q)</span>" + "<span class='zdy-item auto_family_task'>自动(W)</span>" + "<span class='zdy-item go_yamen_task'>追捕(E)</span>" + "<span class='zdy-item check_boss_auto'>抓boss</span>" + "<span class='zdy-item check_lianxi_auto'>自动练习</span>" + "<span class='zdy-item boss_stop'>停</span>" + "<span class='WG_Tip'></span>" + "</div>");
            var css = ".zdy-item{display: inline-block; border: solid 1px gray;color: gray;background-color: black;" + "text-align: center;cursor: pointer;border-radius: 0.25em;min-width: 2em;margin-right: 0.4em;" + "margin-left: 0.4em;position: relative;padding-left: 0.4em;padding-right: 0.4em;}";
            GM_addStyle(css);
            goods = GM_getValue("goods", goods);
            npcs = GM_getValue("npcs", npcs);
            equip = GM_getValue("equip", equip);

            $(".go_family").on("click", WG.go_family);
            $(".auto_family_task").on("click", WG.auto_family_task);
            $(".check_boss_auto").on("click", WG.check_boss_auto);
            $(".check_lianxi_auto").on("click", WG.check_lianxi_auto);
            $(".check_dazuo_auto").on("click", WG.check_dazuo_auto);
            $(".boss_stop").on("click", WG.boss_stop);
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
            $(".get_all").on("click", WG.get_all);
            $(".liaoshang").on("click", WG.liaoshang);
            $(".xuejineng").on("click", WG.xuejineng);
            $(".cangku").on("click", WG.cangku);
            $(".sell_all").on("click", WG.sell_all);
            $(".zdwk").on("click", WG.zdwk);
            $(".qiandao").on("click", WG.qiandao);
            $(".xiaohuayuan").on("click", WG.xiaohuayuan);
            $(".woshi").on("click", WG.woshi);
            $(".liangongfang").on("click", WG.liangongfang);
            $(".lianyaofang").on("click", WG.lianyaofang);
            $(".zuixianlou").on("click", WG.zuixianlou);
            $(".zahuopu").on("click", WG.zahuopu);
            $(".yaopu").on("click", WG.yaopu);
        },
        updete_goods_id: function () {
            var lists = $(".dialog-list > .obj-list:first");
            var id;
            var name;
            $(".content-message > pre").html("");
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

        Send: function (cmd) {
            console.log(cmd);
            cmd=cmd.split(";");
            for(var c of cmd){
                $("span[WG='WG']").attr("cmd", c).click();
            };
        },
        go: function (p) {
            if (WG.at(p)) return;
            if (place[p] != undefined) WG.Send(place[p]);
        },
        at: function (p) {
            var w = $(".room-name").html();
            return w.indexOf(p) == -1 ? false : true;
        },
        go_family: function () {
            //无门派，提取门派
            if (family == null) {
                family = $('.role-list .select').text().substr(0, 2);
            }
            console.log(family);
            switch (family) {
                case '武当':
                    WG.go("武当派-后山小院");
                    WG.sm("邋遢真人 张三丰");
                    break;
                case '华山':
                    WG.go("华山派-客厅");
                    WG.sm("华山派掌门 君子剑 岳不群");
                    break;
                case '丐帮':
                    WG.go("丐帮-树洞下");
                    WG.sm("丐帮七袋弟子 左全");
                    break;
                case '逍遥':
                    WG.go("逍遥派-青草坪");
                    WG.sm("聪辩老人 苏星河");
                    break;
                case '峨嵋':
                    WG.go("峨眉派-大殿");
                    WG.sm("峨嵋派第四代弟子 静心");
                    break;
                default:
                    tip("识别门派为" + family + "，无法工作");
                    family = $('.role-list .select').text().substr(0, 2);
                    break;
            }
        },
        sm: function (master) {
            master = npcs[master];
            if (master != undefined){
                WG.Send("task sm " + master);
            }
            else{
                WG.updete_npc_id();
            }
        },
        auto_family_task: function () {
            WG.Send("stopstate");
            //获取师门任务道具
            var item = $("span[cmd$='giveup']:last").parent().prev();
            if (item.length == 0) {
                tip("自动接收师门任务");
                WG.go_family();
                return
            };
            item = item.html();
            //能直接上交
            if ($("span[cmd$='giveup']:last").prev().children().html() == item) {
                $("span[cmd$='giveup']:last").prev().click();
                tip("自动上交" + item);
                messageClear();
                return;
            }
            var good = goods[item];
            if (good != undefined) {
                tip("自动购买" + item);
                WG.go(good.place);
                if (WG.buy(good)) {
                    WG.go_family();
                }
                return;
            }
            tip("无法自动购买" + item);
        },
        buy: function (good) {
            var tmp = npcs[good.sales];
            if (tmp == undefined) {
                WG.updete_npc_id();
                return false;
            }
            WG.Send("list " + tmp);
            WG.Send("buy 1 " + good.id + " from " + tmp);
            return true;
        },
        lianxi: function (jineng) {
            jineng = [jineng];
            WG.Send("stopstate");
            WG.go("豪宅-练功房");
    //        WG.Send("enable unarmed canhezhi");
            WG.Send("lianxi" +" "+ jineng);
        },
        xuejineng: function () {
          //  var jinengming = prompt("练习什么技能?","hengshanwushenjian");
            WG.lianxi("hengshanwushenjian");
        },
        qiandao: function () {
            WG.Send("taskover signin");
        },
        lianzhaoyi: function () {
          //  WG.Send("fight mxn22884226;zhua oea92884226;kill mxn22884226;perform unarmed.shiba");
            WG.Send("perform dodge.lingbo;perform parry.wu;perform force.power;perform club.chan;perform unarmed.qi;perform club.wu;perform blade.chan;perform throwing.jiang;perform unarmed.shiba");
        },
        lianzhaoer: function () {
            WG.Send("perform dodge.lingbo;perform parry.wu;perform parry.yi;perform force.power;perform unarmed.qi;perform club.chan;perform club.wu;eq jpzn26af5cc");
            setTimeout(function(){ WG.Send("perform blade.chan;perform throwing.jiang;perform unarmed.shiba");}, 3000);
        },
        eq: function (e) {
            WG.Send("eq " + equip[e]);
        },
        ask: function (npc) {
            npc = npcs[npc];
            if (npc != undefined)
            {WG.Send("ask1 " + npc);}
            else
            {WG.updete_npc_id();}
        },
        go_yamen_task: function () {
            WG.Send("stopstate");
            WG.go("扬州城-衙门正厅");
            WG.ask("扬州知府 程药发");
            setTimeout(KEY.do_command("tasks"),1000);

            setTimeout(WG.check_yamen_task, 2000);
        },
        check_yamen_task: function () {
            tip("查找任务中");
            var task = $(".task-desc:last").text();
            if (task.length == 0) {
                setTimeout(WG.check_yamen_task, 1000);
                return;
            }
            try {
                zb_npc = task.match("犯：([^%]+)，据")[1];
                zb_place = task.match("在([^%]+)出")[1];
                tip("追捕：" + zb_npc + "  " + zb_place);
                WG.go(zb_place);
                setTimeout(WG.check_zb_npc, 1000);
            }
            catch (error) {
                tip("查找追捕失败");
                setTimeout(WG.check_yamen_task, 1000);
            }
        },
        check_zb_npc: function () {
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                if (npc.innerText.indexOf(zb_npc) != -1) {
                    WG.Send("kill " + $(npc).attr("itemid"));
                    tip("找到" + zb_npc );
                    return;
                }}
            setTimeout(WG.check_zb_npc, 1000);
        },
        //////////////////////////////
        //////   自动挖矿打坐     /////////
        ////////////////////////////

        check_dazuo_auto: function () {
            WG.Send("stopstate;eq do95250c21e");
            WG.zdwk();
            $("hig").text("YEAH!");
            WG.check_dazuo_auto_go();
        },
        check_dazuo_auto_go: function () {
            dztime = setInterval(function(){ WG.go_kuang_dazuo();}, 10050);
        },

        go_kuang_dazuo: function(){
            var wakuang = $(".content-message").text();
            var wuzhinan = "你获得了4";/////////////////没有指南
            if (wakuang.indexOf(wuzhinan) != -1){
                tip("无指南");
                clearInterval(dztime);
                WG.Send("stopstate;eq 5ppd244e210");
                $("hir").text("Good job!");
                setTimeout(function(){ WG.go("豪宅-练功房");WG.Send("dazuo"); }, 1000);
                setTimeout(function(){ WG.dazuo_kuang(); }, 5000);
                return;
            }
            else{ tip("有指南");
            var xiyan = $(".channel").text();
            var xiyanget = "礼现在正式开始，新";
            if (xiyan.indexOf(xiyanget) != -1){
                clearInterval(dztime);
                WG.Send("stopstate");
                $("hic").text("Good job!");
                WG.xiyan_auto();
                WG.zdwk();
                WG.check_dazuo_auto_go();
                return;
            }}
        },

        dazuo_kuang: function (){
            dazuotime = setInterval(function(){ WG.go_dazuo();}, 3000);
        },
        go_dazuo: function(){
            var zhinan = $(".channel").text();
            var zhinanming ="学会了里面记载的挖矿技巧";
            if (zhinan.indexOf(zhinanming) != -1){
                clearInterval(dazuotime);
                WG.Send("stopstate");
                $("hig").text("YEAH!");
                WG.zdwk();
                setTimeout(function(){ WG.check_dazuo_auto_go(); }, 90000);
                return;
            }
            else{tip("无指南");
                var xiyanget = "礼现在正式开始，新";
            if (zhinan.indexOf(xiyanget) != -1){
                clearInterval(dazuotime);
                WG.Send("stopstate");
                $("hic").text("Good job!");
                WG.xiyan_auto();
                WG.go("豪宅-练功房");WG.send("dazuo");
                WG.dazuo_kuang();
                return;
            }}
            },
        ////////////////////////////////give udbs278bc54 10000 money    ：婚礼现在正式开始，新
        /////////////////////////////
         //////////////////////////////
        //////   自动挖矿练习     /////////
        ////////////////////////////

        check_lianxi_auto: function () {
            $("hig").text("YEAH!");
            zidongjineng = prompt("练习什么技能?","hengshanwushenjian");
            WG.zdwk();
            WG.check_lianxi_auto_go();
        },
        check_lianxi_auto_go: function () {
            ktime = setInterval(function(){ WG.go_kuang();}, 10050);
        },

        go_kuang: function(){
            var wakuang = $(".content-message").text();
            var wuzhinan = "你获得了4";/////////////////没有指南
            if (wakuang.indexOf(wuzhinan) != -1){
                clearInterval(ktime);
                tip("无指南");
                $("hir").text("Good job!");
                setTimeout(function(){ WG.lianxi(zidongjineng); }, 1000);
                setTimeout(function(){ WG.lxjineng(); }, 5000);
                return;
            }
            else{ tip("有指南");
            var xiyan = $(".channel").text();
            var xiyanget = "礼现在正式开始，新";
            if (xiyan.indexOf(xiyanget) != -1){
                clearInterval(ktime);
                $("hic").text("Good job!");
                WG.xiyan_auto();
                WG.zdwk();
                WG.check_lianxi_auto_go();
                return;
            }}
        },

        lxjineng: function (){
            xuetime = setInterval(function(){ WG.go_lxjineng();}, 4000);
        },
        go_lxjineng: function(){
            var zhinan = $(".channel").text();
            var zhinanming ="学会了里面记载的挖矿技巧";
            if (zhinan.indexOf(zhinanming) != -1){
                clearInterval(xuetime);
                $("hig").text("YEAH!");
                WG.zdwk();
                setTimeout(function(){ WG.check_lianxi_auto_go(); }, 90000);
                return;
            }
            else{tip("无指南");
                var xiyanget = "礼现在正式开始，新";
            if (zhinan.indexOf(xiyanget) != -1){
                clearInterval(xuetime);
                $("hic").text("Good job!");
                WG.xiyan_auto();
                WG.lianxi(zidongjineng);
                WG.lxjineng();
                return;
            }}
            },
        ////////////////////////////////give udbs278bc54 10000 money    ：婚礼现在正式开始，新
        /////////////////////////////get all from fuow286c17e
        xiyan_auto: function(){
            WG.Send("stopstate");
            WG.go("扬州城-醉仙楼");
            var npc = npcs[npc];
            if (npc != undefined)
            {WG.Send("give "+ npc +" 10000 money");}
            else
            {WG.updete_npc_id();
             WG.Send("give "+ npc +" 10000 money");}
             WG.get_all();
        },
        //////////////////////////////
        //////   抓boss     /////////
        ////////////////////////////

        check_boss_auto: function () {
            zb_npc = null;
            btime = setInterval(function(){ WG.go_boss();}, 1000);
        },

        go_boss: function(){
            var yaoyan = null;
            tip("没有boss");
            yaoyan = $("him:visible").text();
            zb_npc = yaoyan.match("听说([^%]+)出现")[1];
            zb_place = yaoyan.match("现在([^%]+)一带")[1];
            tip("boss：" + zb_npc );
            if (zb_npc.length != 0 ){
                clearInterval(btime);
                WG.Send("stopstate");
                WG.zhandouzhuang();
                WG.go(zb_place);
                setTimeout(function(){ WG.kill_boss(); }, 5000); }
        },

        kill_boss: function (){
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                if (npc.innerText.indexOf(zb_npc) != -1) {
                    WG.Send("kill " + $(npc).attr("itemid"));
                    tip("找到" + zb_npc); }
                else{
                    tip("找不到" + zb_npc); }
            }
            setTimeout(function(){WG.get_all(); }, 6000);
            setTimeout(function(){WG.get_all(); }, 8000);
            setTimeout(function(){WG.get_all(); }, 10000);
            setTimeout(function(){WG.get_all(); }, 12000);
            setTimeout(function(){WG.get_all(); }, 14000);
            setTimeout(function(){WG.get_all(); }, 16000);
            setTimeout(function(){WG.get_all(); }, 18000);
            setTimeout(function(){WG.get_all(); }, 20000);
            setTimeout(function(){WG.get_all();WG.zdwk(); }, 24000);
            btimetwo = setTimeout(function(){WG.check_boss_auto(); }, 240000);
        },

        boss_stop: function () {

            // $("svg").css("margin-left","-280");
            tip("停止");
            clearInterval(btime);
            clearInterval(ktime);
            clearInterval(dztime);
            clearInterval(dazuotime);
            clearInterval(xuetime);
            clearTimeout(btimetwo);

        },
        ////////////////////////////////
        /////////////////////////////

        kill_all: function () {
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                WG.Send("kill " + $(npc).attr("itemid"));
            }
        },

        get_all: function () {
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                WG.Send("get all from " + $(npc).attr("itemid"));
            }
        },
        wuxingzhuang: function () {
            WG.Send("stopstate");
            //          黄真武道簪     黄曙光束腰     黄真武道靴     黄真武道袍     神龙令         嘤嘤镯
            WG.Send("eq qm5u274e42a;eq z2e8277793c;eq f99r2761a02;eq 9slh270f2cf;eq a1h52377a5e;eq j3ov22fb634;");
            //          黄真武道簪     黄曙光束腰     黄真武道靴     黄真武道袍     神龙令         嘤嘤镯
            WG.Send("eq lix028ded11;eq 904p28df12a;eq xcc428deac1;eq o0q62860a92;eq 64gk24b6e2f;eq jdnb23c44af;");
        },
        zhandouzhuang: function () {
            WG.Send("stopstate");
            //          黄君子青衫     黄浑天麻鞋     疤面面具       黄真武护腕     黄鲲鹏腰带     温仪香囊       黄君子剑
            WG.Send("eq cxl426badc7;eq 69o327779c5;eq vvgw261adfd;eq pqvv27224eb;eq wqx82490f90;eq q96h24a0b97;eq 8rtt26f940c;");
            //          黄真武道袍     黄浑天麻鞋     疤面面具       黄真武护腕     黄混天腰带     温仪香囊       黄君子剑
            WG.Send("eq o0q62860a92;eq jqaz28ca066;eq tvci27ad70b;eq 4cxc2934c8f;eq goxh2860b4a;eq qpw6274282f;eq ivbd260faeb;");
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
            WG.go("峨眉派-走廊");
        },
        huashan: function () {
            WG.Send("stopstate");
            WG.go("华山派-玉女峰");
        },
        gaibang: function () {
            WG.Send("stopstate");
            WG.go("丐帮-林间小屋");
        },
        xiaoyao: function () {
            WG.Send("stopstate");
            WG.go("逍遥派-地下石室");
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
        xiaohuayuan: function () {
            WG.Send("stopstate");
            WG.go("豪宅-花园");
        },
        woshi: function () {
            WG.Send("stopstate");
            WG.go("豪宅-卧室");
            WG.Send("store");
        },
        liangongfang: function () {
            WG.Send("stopstate");
            WG.go("豪宅-练功房");
            WG.Send("store");
        },
        lianyaofang: function () {
            WG.Send("stopstate");
            WG.go("豪宅-练药房");
        },
        zuixianlou: function () {
            WG.Send("stopstate");
            WG.go("扬州城-醉仙楼");
        },
        zahuopu: function () {
            WG.Send("stopstate");
            WG.go("扬州城-杂货铺");
        },
        yaopu: function () {
            WG.Send("stopstate");
            WG.go("扬州城-药铺");
        },
        zdwk: function () {
            WG.Send("stopstate");
            WG.go("扬州城-矿山");
            WG.Send("eq e0iu250f5dc;eq egib243d29b;wa");
        },
        timer_close: function () {
            if (timer) {
                clearInterval(timer);
                timer = 0;
            }
        },
        wudao_auto: function () {
            //创建定时器
            if (timer == 0) {
                timer = setInterval(WG.wudao_auto, 2000);
            }
            if (!WG.at("武道塔")) {
                //进入武道塔
                WG.go("武道塔");
                WG.ask("守门人");
                WG.Send("go enter");
            }
            else {
                //武道塔内处理
                tip("武道塔");
                var w = $(".room_items .room-item:last");
                var t = w.text();
                if (t.indexOf("守护者") != -1) {
                    WG.Send("kill " + w.attr("itemid"));
                }
                else {
                    WG.Send("go up");
                }
            }
        },
        xue_auto: function () {
            var t = $(".room_items .room-item:first .item-name").text();
            t = t.indexOf("<打坐") != -1 || t.indexOf("<学习") != -1;
            //创建定时器
            if (timer == 0) {
                if (t == false) {
                    tip("当前不在打坐或学习状态");
                    return;
                }
                timer = setInterval(WG.xue_auto, 1000);
            }
            if (t == false) {
                //学习状态中止，自动去挖矿
                WG.timer_close();
                WG.zdwk();
            }
            else {
                tip("自动打坐学习中");
            }
        }
    };
    KEY.init();
    WG.init();
    $('head').append('<link href="https://cdn.bootcss.com/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.css" rel="stylesheet">');
    $.contextMenu({
        selector: '.content-message',
        callback: function (key, options) {
            console.log("点击了：" + key);
        },
        "items": {
            "练习技能": {
                name: "练习技能",
                "items": {
                    "mp0": { name: "降龙", callback: function (key, opt) { WG.lianxi("xianglongzhang2"); }, },
                    "mp1": { name: "明玉", callback: function (key, opt) { WG.lianxi("mingyugong"); }, },
                    "mp2": { name: "五神", callback: function (key, opt) { WG.lianxi("hengshanwushenjian"); }, },
                    "mp3": { name: "蛇岛", callback: function (key, opt) { WG.lianxi("shedaoqigong"); }, },
                    "mp4": { name: "蛇锥", callback: function (key, opt) { WG.lianxi("jinshezhui"); }, },
                    "mp5": { name: "拂尘", callback: function (key, opt) { WG.lianxi("qiufengfuchen"); }, },
                    "mp6": { name: "逍遥", callback: function (key, opt) { WG.lianxi("xiaoyaoyou2"); }, },
                    "mp7": { name: "参合", callback: function (key, opt) { WG.lianxi("canhezhi"); }, },
                    "mp8": { name: "斗转", callback: function (key, opt) { WG.lianxi("douzhuanxiyi"); }, },
                },
            },
            "关闭自动": {name: "关闭自动", callback: function (key, opt) { WG.timer_close(); }, },
            "自动武道": { name: "自动武道", callback: function (key, opt) { WG.Send("stopstate;eq hsn922ebc42");WG.wudao_auto(); }, },
            "更新商品": { name: "更新商品", callback: function (key, opt) { WG.updete_goods_id(); }, },
            "更新NPC": { name: "更新NPC", callback: function (key, opt) { WG.updete_npc_id(); }, }
        }
    });

})();