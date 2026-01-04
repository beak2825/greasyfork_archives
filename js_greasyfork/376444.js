// ==UserScript==
// @name         wsmud_黑帮
// @namespace    MG
// @version      0.01.20
// @date         10/07/2019
// @modified     01/04/2019
// @homepage     https://greasyfork.org/zh-CN/scripts/376444
// @description  武神传说 MUD
// @author       小乞儿
// @match        http://game.wsmud.com/*
// @match        http://www.wsmud.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require      https://cdn.bootcss.com/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376444/wsmud_%E9%BB%91%E5%B8%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/376444/wsmud_%E9%BB%91%E5%B8%AE.meta.js
// ==/UserScript==

(function () {
    "use strict";
    //快捷键功能
    //忽略油猴脚本检查
    var $ = jQuery;
    var send_cmd = unsafeWindow.send_cmd;
    var add_listener = unsafeWindow.add_listener;
    var remove_listener = unsafeWindow.remove_listener;
    //前置检查
    if (send_cmd == undefined) {

        document.getElementsByClassName("signinfo")[0].innerHTML += "<br><HIY>请安装前置</HIY><a target='_blank'  href='https://greasyfork.org/zh-CN/scripts/373168'><HIY>https://greasyfork.org/zh-CN/scripts/373168</HIY></a>"
        console.log("请安装前置https://greasyfork.org/zh-CN/scripts/373168");
        return;
    }
//自命令数组
    var role;
    var zml = [];
    //自定义存取
    var zdy_item_store = '';
    //状态监控 type 类型 0 =其他人 1= 本人 send 命令数组
    //[{"name":"","type":"status","action":"remove","keyword":"busy","ishave":"0","send":"","isactive":"1"}]
    var ztjk_item = [];
    //快捷键功能
        var KEY = {
        keys: [],
        roomItemSelectIndex: -1,
        init: function () {
            //添加快捷键说明
            $("span[command=stopstate] span:eq(0)").html("S");
            $(document).on("keydown", this.e);

            this.add(76, function () {
                KEY.do_command("tasks");
            });
            this.add(13, function () {
                KEY.do_command("showchat");
            });
            this.add(83, function () {
                KEY.do_command("stopstate");
            });
            this.add(81, function () {
                WG.sm_button();
            });
            this.add(87, function () {
                WG.go_yamen_task();
            });
            this.add(69, function () {
                WG.kill_all();
            });
            this.add(82, function () {
                WG.get_all();
            });
            this.add(84, function () {
                WG.packup();
            });
            this.add(68, function () {
                WG.wmls();
            });
            this.add(89, function () {
                WG.zdwk();
            });
            this.add(9, function () {
                KEY.onRoomItemSelect();
                return false;
            });

            //方向
            this.add(39, function () {
                WG.Send("go east");
                KEY.onChangeRoom();
            });
            this.add(37, function () {
                WG.Send("go west");
                KEY.onChangeRoom();
            });
            this.add(40, function () {
                WG.Send("go south");
                KEY.onChangeRoom();
            });
            this.add(38, function () {
                WG.Send("go north");
                KEY.onChangeRoom();
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
            if ($(".channel-box").is(":visible")) {
                KEY.chatModeKeyEvent(event);
                return;
            }

            if ($(".dialog-confirm").is(":visible") &&
                ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)))
                return;

            if ($('input').is(':focus') || $('textarea').is(':focus') ) {

                return;
            }
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
            if (event.keyCode == 27) {
                KEY.dialog_close();
            } else if (event.keyCode == 13) {
                if ($(".sender-box").val().length) $(".sender-btn").click();
                else KEY.dialog_close();
            }
        },
        onChangeRoom: function () {
            KEY.roomItemSelectIndex = -1;
        },
        onRoomItemSelect: function () {
            if (KEY.roomItemSelectIndex != -1) {
                $(".room_items div.room-item:eq(" + KEY.roomItemSelectIndex + ")").css("background", "#000");
            }
            KEY.roomItemSelectIndex = (KEY.roomItemSelectIndex + 1) % $(".room_items div.room-item").length;
            var curItem = $(".room_items div.room-item:eq(" + KEY.roomItemSelectIndex + ")");
            curItem.css("background", "#444");
            curItem.click();
        },
        onRoomItemAction: function (index) {
            //NPC下方按键
            $(".room_items .item-commands span:eq(" + index + ")").click();
        },
    }

    var log_line = 0;
    function messageAppend(m, t = 0) {
        100 < log_line && (log_line = 0, $(".WG_log pre").empty());
        var ap = m + "\n";
        if (t == 1) {
            ap = "<hiy>" + ap + "</hiy>";
        } else if (t == 2) {
            ap = "<hig>" + ap + "</hig>";
        } else if (t == 3) {
            ap = "<hiw>" + ap + "</hiw>";
        }
        $(".WG_log pre").append(ap);
        log_line++;
        $(".WG_log")[0].scrollTop = 99999;
    }
    function messageClear() {
        $(".WG_log pre").html("");
    }
    //常量
    const C = {
        sm: {
            "武当派": { room: "武当派-三清殿", npc: "谷虚道长" },
            "华山派": { room: "华山派-镇岳宫", npc: "高根明" },
            "少林派": { room: "少林派-天王殿", npc: "道觉禅师" },
            "逍遥派": { room: "逍遥派-青草坪", npc: "苏星河" },
            "丐帮": { room: "丐帮-树洞下", npc: "左全" },
            "峨眉派": { room: "峨眉派-大殿", npc: "静心" },
            "杀手楼": { room: "杀手楼-大厅", npc: "何小二" },
            "无门无派": { room: "扬州城-扬州武馆", npc: "武馆教习" },
        },
        path: {
            "住房": "jh fam 0 start;go west;go west;go north;go enter",
            "住房-小花园": "jh fam 0 start;go west;go west;go north;go enter;go northeast",
            "住房-练功房": "jh fam 0 start;go west;go west;go north;go enter;go west",
            "扬州城-钱庄": "jh fam 0 start;go north;go west",
            "扬州城-武庙": "jh fam 0 start;go north;go north;go west",
            "扬州城-醉仙楼": "jh fam 0 start;go north;go north;go east",
            "扬州城-杂货铺": "jh fam 0 start;go east;go south",
            "扬州城-打铁铺": "jh fam 0 start;go east;go east;go south",
            "扬州城-药铺": "jh fam 0 start;go east;go east;go north",
            "扬州城-衙门正厅": "jh fam 0 start;go west;go north;go north",
            "扬州城-镖局正厅": "jh fam 0 start;go west;go west;go south;go south",
            "扬州城-矿山": "jh fam 0 start;go west;go west;go west;go west",
            "扬州城-擂台": "jh fam 0 start;go west;go south",
            "扬州城-当铺": "jh fam 0 start;go south;go east",
            "扬州城-帮派": "jh fam 0 start;go south;go south;go east",
            "扬州城-扬州武馆": "jh fam 0 start;go south;go south;go west",
            "武当派-广场": "jh fam 1 start",
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
            "少林派-广场": "jh fam 2 start",
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
            "华山派-镇岳宫": "jh fam 3 start",
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
            "武道塔": "jh fam 9 start",
            "武当派-紫": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north;go north;go north",
            "华山派-紫": "jh fam 3 start;go westup;go north",
            "少林派-紫": "jh fam 2 start;go north;go north;go northwest;go northeast;go north",
            "峨眉派-紫": "jh fam 4 start;go west;go south;go west;go south",
            "逍遥派-紫": "jh fam 5 start;go west;go east;go down",
            "丐帮-紫": "jh fam 6 start;go down;go east;go east;go east;go east;go east",
        },
        path2:
        {
            "武当派-林间小径": "go north",
            "少林派-竹林": "go north",
            "峨眉派-走廊": "go west;go west;go north;go north;go south;go south;go south;go south",
            "逍遥派-林间小道": "go west;go north;go south;go west;go east;go south;go north",
            "逍遥派-木屋": "go south;go south;go south;go south",
            "逍遥派-地下石室": "go down",
            "丐帮-暗道": "go east;go east;go east;go east",
        },
        sm_items: [
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
                    "<wht>飞镖</wht>",
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
            },
        ],
        store_list: [
            "<hic>红宝石</hic>",
            "<hic>黄宝石</hic>",
            "<hic>蓝宝石</hic>",
            "<hic>绿宝石</hic>",
            "<hiy>精致的红宝石</hiy>",
            "<hiy>精致的黄宝石</hiy>",
            "<hiy>精致的蓝宝石</hiy>",
            "<hiy>精致的绿宝石</hiy>",
            "<hiz>完美的红宝石</hiz>",
            "<hiz>完美的黄宝石</hiz>",
            "<hiz>完美的蓝宝石</hiz>",
            "<hiz>完美的绿宝石</hiz>",
            "<wht>基本内功秘籍</wht>",
            "<wht>基本轻功秘籍</wht>",
            "<wht>基本招架秘籍</wht>",
            "<wht>基本剑法秘籍</wht>",
            "<wht>基本刀法秘籍</wht>",
            "<wht>基本拳脚秘籍</wht>",
            "<wht>基本暗器秘籍</wht>",
            "<wht>基本棍法秘籍</wht>",
            "<wht>基本鞭法秘籍</wht>",
            "<wht>基本杖法秘籍</wht>",
            "<wht>动物皮毛</wht>",
            "<wht>家丁服</wht>",
            "<wht>家丁鞋</wht>",
            "<hig>五虎断门刀残页</hig>",
            "<hig>太祖长拳残页</hig>",
            "<hig>流氓巾</hig>",
            "<hig>流氓衣</hig>",
            "<hig>流氓鞋</hig>",
            "<hig>流氓护腕</hig>",
            "<hig>流氓短剑</hig>",
            "<hig>流氓闷棍</hig>",
            "<hig>军服</hig>",
            "<hig>官服</hig>",
            "<hic>崔莺莺的手镯</hic>",
            "<hig>崔员外的戒指</hig>",
            "<hig>黑虎单刀</hig>",
            "<hig>员外披肩</hig>",
            "<hig>短衣劲装</hig>",
            "<hig>拂尘</hig>",
            "<hig>军刀</hig>",
            "<hic>将军剑</hic>",
            "进阶残页",
            "突破丹",
            "师门令牌",
        ],
        //'武当在两个林间小径;
        //少林在后殿和练武场;
        //华山在玉女峰和练武场;
        //峨眉在清修洞的上面两个走廊;
        //逍遥在左边林间小道和下去第一个地下石室;
        //丐帮在最后两个暗道'
        mpz_path: {
            "武当派": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north;go north;go north",
            "华山派": "jh fam 3 start;go westup;go north",
            "少林派": "jh fam 2 start;go north;go north;go northwest;go northeast;go north",
            "峨眉派": "jh fam 4 start;go west;go south;go west;go south",
            "逍遥派": "jh fam 5 start;go west;go east;go down",
            "丐帮": "jh fam 6 start;go down;go east;go east;go east;go east;go east",
        },
    };

    //全局变量
    var G = {
        id: undefined,
        state: undefined,
        room_name: undefined,
        family: undefined,
        items: new Map(),
        stat_boss_success: 0,
        stat_boss_find: 0,
        stat_xiyan_success: 0,
        stat_xiyan_find: 0,
        cds: new Map(),
        in_fight: false,
        auto_preform: true,
        can_auto: false,
        level: undefined,
    };

    var storage = {
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get(key) {
            return JSON.parse(localStorage.getItem(key));
        },
        remove(key) {
            localStorage.removeItem(key);
        }
    };

    var WG = {
        sm_state: -1,
        sm_item: null,

        init: function () {
            add_listener(["login", "room", "items", "itemadd", "itemremove", "sc", "text", "state", "msg", "perform", "dispfm", "combat"], function (data) {
                if (data.type == "login") {
                    G.id = data.id;
                    WG.login(); WG.setting.load(data.setting);
                } else if (data.type == "room") {
                    let tmp = data.path.split("/");
                    G.map = tmp[0];
                    G.room = tmp[1];
                    if (G.map == 'home' || G.room == 'kuang')
                        G.can_auto = true;
                    else
                        G.can_auto = false;

                    G.room_name = data.name;
                }
                else if (data.type == "items") {
                    G.items = new Map();
                    for (var i = 0; i < data.items.length; i++) {
                        let item = data.items[i];
                        if (item.id) {
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
                    G.items.delete(data.id);
                } else if (data.type == "sc") {
                    let item = G.items.get(data.id);
                    if (data.hp !== undefined) {
                        item.hp = data.hp;
                        if (data.id != G.id) {
                            G.scid = data.id;    //伤害统计需要
                        }
                    }
                    if (data.mp !== undefined) {
                        item.mp = data.mp;
                    }
                }
                else if (data.type == "state") {
                    if (data.state) {
                        G.state = data.state.substring(3, 5);
                    } else {
                        G.state = undefined;
                    }
                }
                else if (data.type == 'msg') {
                    //自动喜宴
                    if (S.auto_xiyan && G.can_auto && data.ch == 'sys'
                        && /^(.+)和(.+)于今日大婚，在醉仙楼大摆宴席，婚礼将在一分钟后开始。$/.test(data.content)) {
                        G.stat_xiyan_find++;
                        WG.xiyan();
                    }
                    //自动BOSS

                    if (S.auto_boss && G.can_auto && data.ch == 'rumor') {
                        let r = data.content.match(/^听说(.+)出现在(.+)一带。$/);
                        if (r) {
                            G.stat_boss_find++;
                            WG.boss(r[1], r[2]);
                        }
                    }
                    //自动门派
                    if (S.auto_bpz && G.can_auto && data.ch == 'pty') {
                        let r = data.content.match(/^.+成员听令，即刻起开始进攻(.+)。$/);
                        if (r) {
                            WG.mpz(r[1], true);
                        }
                        /*
                        <hiy>
你的门派和华山派的战斗开始了，请回门派防守或者进攻对方门派。
战斗时间30分钟，结束条件是对方或己方掌门被击杀。</hiy>*/
                    }
                }
                else if (data.type == "perform") {
                    G.skills = data.skills;
                }
                else if (data.type == 'dispfm') {
                    if (data.id) {
                        if (data.distime) { }
                        G.cds.set(data.id, true);
                        var _id = data.id;
                        setTimeout(function () {
                            G.cds.set(_id, false);
                        }, data.distime);
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
                        G.in_fight = true;
                        WG.auto_preform();
                    }
                    if (data.end) {
                        G.in_fight = false;
                        WG.auto_preform("stop");
                    }
                }
            });
            add_listener("dialog", function (data) {
                if (data.dialog == "score") {
                    G.family = data.family;
                    G.level = data.level;
                    messageAppend("<hiy>开花分值为" + Math.floor(data.max_mp / 100 + data.con * data.con_add / 10) + "</hiy>");
                    messageAppend("<hiy>门派为" + G.family + "</hiy>");
                    remove_listener(this.id);
                    setTimeout(() => {
                        if ($(".dialog-score").is(":visible")) $(".dialog-close").click();
                    }, 100);
                }
            });
        },
        login: function () {
            G.role = $(".role-list .select").text().split(/[\s\n]/).pop();
            if ($(".WG_log").length == 0) {
                var html = `
                <div class="WG_log"><pre></pre></div>
                <div style=" width: calc(100% - 40px);">
                <span class="zdy-item eq1">未设置</span>
                <span class="zdy-item eq2">未设置</span>
                <span class="zdy-item eq3">未设置</span>

                <span class="zdy-item auto_perform" style="float:right;">自动攻击</span>
                <span class="zdy-item cmd_echo" style="float:right;">代码</span>
                </div>
                <div style=" width: calc(100% - 40px);">
                <span class="zdy-item sk1">未设置</span>
                <span class="zdy-item sk2">未设置</span>

                <div style=" width: calc(100% - 40px);">
                <span class="zdy-item sm_button">师门(Q)</span>
                <span class="zdy-item ym_button">追捕(W)</span>
                <span class="zdy-item kill_all">叫杀(E)</span>
                <span class="zdy-item get_all">拾取(R)</span>
                <span class="zdy-item packup">整理(T)</span>
                <span class="zdy-item wmls">疗伤(D)</span>
                <span class="zdy-item zdwk">挖矿(Y)</span>
                </div>
                ` ;
                $(".content-message").after(html);
                var css = `.zdy-item{
                display: inline-block;border: solid 1px gray;color: gray;background-color: black;
                text-align: center;cursor: pointer;border-radius: 0.25em;min-width: 2.5em;margin-right: 0.4em;
                margin-left: 0.4em;position: relative;padding-left: 0.4em;padding-right: 0.4em;line-height: 2em;}
                .WG_log{flex: 1;overflow-y: auto;border: 1px solid #404000;max-height: 10em;width: calc(100% - 40px);}
                .WG_log > pre{margin: 0px; white-space: pre-line;}
                .item-hp{display: inline-block;float: right;width: 100px;}
                .item-dps{display: inline-block;float: right;width: 100px;}
                .progress {width: 5em;}`;
                GM_addStyle(css);
                $(".sm_button").on("click", WG.sm);
                $(".ym_button").on("click", WG.yamen);
                $(".kill_all").on("click", WG.kill_all);
                $(".get_all").on("click", WG.get_all);
                $(".packup").on("click", WG.packup);
                $(".wmls").on("click", WG.wmls);
                $(".zdwk").on("click", WG.zdwk);
                $(".auto_perform").on("click", WG.auto_preform_switch);
                $(".cmd_echo").on("click", WG.cmd_echo_button);
                $(".eq1").on("click", function () { if (G.eq1) { send_cmd(G.eq1); } else { messageAppend("未设置"); } });
                $(".eq2").on("click", function () { if (G.eq2) { send_cmd(G.eq2); } else { messageAppend("未设置"); } });
                $(".eq3").on("click", function () { if (G.eq3) { send_cmd(G.eq3); } else { messageAppend("未设置"); } });
                $(".sk1").on("click", function () { if (G.sk1) { send_cmd(G.sk1); } else { messageAppend("未设置"); } });
                $(".sk2").on("click", function () { if (G.sk2) { send_cmd(G.sk2); } else { messageAppend("未设置"); } });
            }
            setTimeout(() => {
                var logintext = `<hiy>欢迎${G.role},插件已加载！插件版本: ${GM_info.script.version}</hiy>`;
                messageAppend(logintext);
                if (S.alt == 0) document.title = G.role;
                KEY.do_command("showtool");
                KEY.do_command("showcombat");
                $("span[command='tasks']").click();
                send_cmd("score");
            }, 500);
        },
        todo: function (fn) {
            var h = add_listener('text', function (data) {
                if (data.msg == '你要看什么？') {
                    remove_listener(h);
                    if (typeof fn === 'function') {
                        fn();
                    } else {
                        send_cmd(fn);
                    }
                }
            });
            send_cmd('look 1');
        },
        go: function (p) {
            if (WG.at(p)) return;
            if (C.path[p] != undefined) send_cmd(C.path[p]);
            else { messageAppend(p + "无法到达"); }
        },
        at: function (p) {
            return G.room_name == p;
        },
            wmls: function () {
            WG.go("扬州城-武庙");
            send_cmd("liaoshang");
        },
        sm: function (v, callback) {
            if (G.sm_listener || v == "stop") {
                remove_listener(G.sm_listener);
                G.sm_listener = undefined;
                $(".sm_button").text("师门(Q)");
                messageAppend("<hio>师门任务</hio><RED>停止</RED>");
                if (typeof callback == "function") callback();
                return;
            }
            let auto_giveup = false;
            if (v == "auto") auto_giveup = true;
            let state;
            let item_name, task;
            let sm_npc_id;
            let sm_path = C.sm[G.family].room;
            let sm_npc = C.sm[G.family].npc;
            var task_sm = function (item_id) {
                state = 0;
                WG.go(sm_path);
                if (sm_npc_id) {
                    if (item_id) {
                        if (item_id == "giveup") send_cmd('task sm ' + sm_npc_id + ' giveup ');
                        else send_cmd('task sm ' + sm_npc_id + ' give ' + item_id);
                    } else {
                        send_cmd('task sm ' + sm_npc_id); send_cmd('task sm ' + sm_npc_id);
                    }
                } else {
                    WG.todo(function () {
                        var id = WG.find_item(sm_npc);
                        if (id) {
                            sm_npc_id = id;
                            task_sm(item_id);
                        } else {
                            messageAppend("<hio>师门任务</hio>未发现师门NPC" + sm_npc); WG.sm("stop", callback);
                        }
                    });
                }
            };

            G.sm_listener = add_listener(["text", "dialog", "cmds"], (data) => {
                switch (state) {
                    case 0://任务判断
                        if (data.type == "cmds") {
                            if (data.items[0].cmd.indexOf("task sm") > -1) {
                                for (let i = 0; i < data.items.length; i++) {
                                    let item = data.items[i];
                                    if (item.name.indexOf(item_name) > -1) {
                                        send_cmd(item.cmd);
                                        task_sm();
                                        return;
                                    }
                                }
                                if (task) {
                                    if (task.type == "shop") {
                                        messageAppend("<hio>师门任务</hio>商店" + task.npc + "购买" + item_name);
                                        WG.go(task.room); send_cmd("look 1");
                                        state = 2;
                                    } else if (task.type == "give") {
                                        messageAppend("<hio>师门任务</hio>随从获取" + item_name);
                                        WG.go(task.room); send_cmd("look 1");
                                        state = 3;
                                    } else if (task.type == "store") {
                                        messageAppend("<hio>师门任务</hio>仓库获取" + item_name);
                                        WG.go("扬州城-钱庄"); send_cmd("store");
                                        state = 4;
                                    }
                                } else {
                                    messageAppend("<hio>师门任务</hio>任务物品：" + item_name + " 不在列表");
                                    if (auto_giveup) task_sm("giveup");
                                    else WG.sm("stop", callback);
                                }
                            }

                        }
                        if (data.type == "text") {
                            let r = data.msg.match(/^(.+)对你说道：我要的是(.+)，你要是找不到就换别的吧。$/);
                            if (r && item_name != r[2]) {
                                item_name = r[2];
                                task = WG.find_sm_items(item_name);
                                messageAppend("<hio>师门任务</hio>当前需要" + item_name);
                            } else {
                                r = data.msg.match(/^你的师门任务完成了，目前完成(\d+)\/(\d+)个，连续完成(\d+)个。$/);
                                if (r) {
                                    item_name = undefined;
                                    state = 0;
                                    if (parseInt(r[1]) >= parseInt(r[2])) {
                                        WG.sm("stop", callback);
                                    } else {
                                        messageAppend("<hio>师门任务</hio>已完成" + parseInt(r[1]) + "环");
                                        setTimeout(function () {
                                            task_sm();
                                        }, 500);
                                    }
                                } else if (/^(.+)对你点头道：辛苦了， 你先去休息一下吧。$/.test(data.msg)) {
                                    WG.sm("stop", callback);
                                }
                                else if (/^(.+)对你说道：好吧，师父让别人去找，你就先去休息吧。$/.test(data.msg)) {
                                    setTimeout(function () {
                                        task_sm();
                                    }, 500);
                                }
                            }
                        }
                        if (data.type == 'dialog' && data.dialog == 'pack') {
                            //自动服用养精
                            if ((/养精丹/).test(data.name)) send_cmd("use " + data.id);
                        }
                        break;
                    case 1: //背包搜索
                        if (data.type == 'dialog' && data.dialog == 'pack') {
                            let item_id;
                            if (data.name) {
                                if (data.name == item_name) {
                                    item_id = data.id;
                                }
                            } else if (data.items) {
                                for (let i = 0; i < data.items.length; i++) {
                                    let item = data.items[i];
                                    if (item.name == item_name) {
                                        item_id = item.id;
                                        break;
                                    }
                                }
                            }
                            if (item_id) {
                                setTimeout(function () {
                                    task_sm(item_id);
                                }, 1000);
                            }
                        }
                        break;
                    case 2://商店购买
                        if (data.type == 'text' && data.msg == '你要看什么？') {
                            let id = WG.find_item(task.npc);
                            if (id) {
                                task.npc_id = id;
                                send_cmd('list ' + id);
                            } else {
                                messageAppend("<hio>师门任务</hio>未发现商店NPC" + task.npc); WG.sm("stop", callback);
                            }
                        }
                        if (data.type == 'dialog' && data.dialog == 'list' && data.seller == task.npc_id) {
                            let item_id;
                            for (let i = 0; i < data.selllist.length; i++) {
                                let item = data.selllist[i];
                                if (item.name == item_name) {
                                    item_id = item.id;
                                    break;
                                }
                            }
                            if (item_id) {
                                send_cmd('buy 1 ' + item_id + ' from ' + task.npc_id);
                                state = 1;
                            } else {
                                messageAppend("<hio>师门任务</hio>商店无法购买" + item_name);
                                if (auto_giveup) task_sm("giveup");
                                else WG.sm("stop", callback);
                            }
                        }
                        break;
                    case 3://随从获取
                        if (data.type == 'text' && data.msg == '你要看什么？') {
                            let id = WG.find_state(task.npc);
                            if (id) {
                                task.npc_id = id;
                                send_cmd('pack ' + id);
                            } else {
                                messageAppend("<hio>师门任务</hio>未发现随从" + task.npc);
                                if (auto_giveup) task_sm("giveup");
                                else {
                                    WG.go(sm_path); WG.sm("stop", callback);
                                }
                            }
                        }
                        if (data.type == 'dialog' && data.dialog == 'pack2' && data.id == task.npc_id) {
                            let item_id;
                            for (let i = 0; i < data.items.length; i++) {
                                let item = data.items[i];
                                if (item.name == item_name) {
                                    item_id = item.id;
                                    break;
                                }
                            }
                            if (item_id) {
                                send_cmd('dc ' + task.npc_id + ' stopstate;dc ' + task.npc_id + ' give ' + G.id + ' 1 ' + item_id);
                                if (task.npc == '采药') {
                                    send_cmd('dc ' + task.npc_id + ' cai');
                                } else if (task.npc == '钓鱼') {
                                    send_cmd('dc ' + task.npc_id + ' diao');
                                }
                                state = 1;
                            } else {
                                messageAppend("<hio>师门任务</hio>随从身上未发现" + item_name);
                                if (auto_giveup) task_sm("giveup");
                                else {
                                    WG.go(sm_path); WG.sm("stop", callback);
                                }
                            }
                        }
                        break;
                    case 4://仓库取出
                        if (data.type == 'dialog' && data.dialog == 'list') {
                            let item_id;
                            for (let i = 0; i < data.stores.length; i++) {
                                let item = data.stores[i];
                                if (item.name == item_name) {
                                    item_id = item.id;
                                    break;
                                }
                            }
                            if (item_id) {
                                send_cmd('qu 1 ' + item_id + ';pack');
                                state = 1;
                            } else {
                                messageAppend("<hio>师门任务</hio>仓库未发现" + item_name);
                                if (auto_giveup) task_sm("giveup");
                                else {
                                    WG.go(sm_path); WG.sm("stop", callback);
                                }
                            }
                        }
                        break;
                }
            });
            task_sm();
            messageAppend("<hio>师门任务</hio><MAG>开始</MAG>");
            $(".sm_button").text("停止(Q)");
        },
        xiyan: function () {
            let t, h;
            t = setTimeout(() => {
                messageAppend("<hio>自动喜宴</hio><MAG>超时</MAG>");
                remove_listener(h);
                WG.guaji();
            }, 30000);
            h = add_listener(['items', 'cmds', 'text'], function (data) {
                if (data.type == 'items') {
                    for (var i = 0; i < data.items.length; i++) {
                        if (data.items[i].name == '<hio>婚宴礼桌</hio>' || data.items[i].name == '<hiy>婚宴礼桌</hiy>') {
                            remove_listener(h);
                            send_cmd('get all from ' + data.items[i].id);
                            if (t) clearTimeout(t);
                            messageAppend("<hio>自动喜宴</hio><MAG>完成</MAG>");
                            G.stat_xiyan_success++;
                            WG.guaji();
                            break;
                        }
                    }
                } else if (data.type == 'text') {
                    let tmp = /^店小二拦住你说道：怎么又是你，每次都跑这么快，等下再进去。$/.test(data.msg);
                    if (tmp || /^店小二拦住你说道：这位(.+)，不好意思，婚宴宾客已经太多了。$/.test(data.msg)) {
                        messageAppend("<hio>自动喜宴</hio><MAG>失败</MAG>" + tmp ? "今天已经领过了吧！" : "脚本党太多！");
                        remove_listener(h);
                        if (t) clearTimeout(t);
                        WG.guaji();
                    }
                } else if (data.type == 'cmds') {
                    for (let i = 0; i < data.items.length; i++) {
                        if ( data.items[i].name == '1金贺礼') {
                            send_cmd(data.items[i].cmd + ';go up');
                            break;
                        }
                    }
                }
            });
            WG.guaji_stop();
            send_cmd('stopstate;jh fam 0 start;go north;go north;go east;go up');
            messageAppend("<hio>自动喜宴</hio><MAG>开始</MAG>");

        },
        mpz: function (mpz_party, bpz) {
            if (mpz_party == "stop") {
                if (G.mpz_listener) {
                    remove_listener(G.mpz_listener);
                    messageAppend("<hio>门派战</hio><MAG>结束</MAG>");
                }
                setTimeout(() => {
                    if (bpz) send_cmd("pty 风紧跑路，我去挂机了");
                    WG.guaji();
                }, 3000);
                return;
            }
            if (G.bpz_listener) {
                remove_listener(G.mpz_listener);
            }
            let state = 0;
            let path = C.mpz_path[mpz_party].split(";");
            let path_index = 0;
            let kill_target = [];
            let kill_now = [];
            let mpz_wait_timer = undefined;
            G.mpz_listener = add_listener(['items', 'sc', 'itemremove', 'die', "dispfm", "text", "status"], function (data) {
                if (state == 0 && data.type == 'items') {
                    kill_target = [];
                    kill_now = [];
                    for (var i = 0; i < data.items.length; i++) {
                        if (data.items[i].max_hp == 2000000 && data.items[i].p == undefined) {
                            //发现紫
                            kill_target.push(data.items[i].id);
                        }
                    }
                    if (kill_target.length > 0) {
                        messageAppend("<hio>门派战</hio>发现紫色目标");
                        if (bpz) send_cmd("pty 我在" + G.room_name + "等你们5分钟，你们先手，我就上。");
                        $(".eq1").click();
                        $(".sk1").click();
                        send_cmd("liaoshang");
                        state = 1;
                        mpz_wait_timer = setTimeout(() => {
                            messageAppend("<hio>门派战</hio>5分钟没人打，超时返回挂机");
                            WG.mpz("stop", bpz);
                        }, 5 * 60 * 1000);
                    } else {
                        if (path_index < path.length) {
                            send_cmd(path[path_index++]);
                        }
                        else {
                            WG.mpz("stop", bpz);
                        }

                    }
                }
                else if (state == 1 && kill_target.length && data.type == 'sc') {
                    for (let i = 0; i < kill_target.length; i++) {
                        if (kill_target[i] == data.id) {
                            send_cmd("stopstate;kill " + data.id);
                            kill_target.splice(i, 1);
                            kill_now.push(data.id);
                            messageAppend("<hio>门派战</hio>叫杀目标，剩余目标" + kill_target.length);
                        }
                        if (mpz_wait_timer) {
                            clearTimeout(mpz_wait_timer);
                            mpz_wait_timer = undefined;
                            if (kill_target.length) {
                                mpz_wait_timer = setTimeout(() => {
                                    messageAppend("<hio>门派战</hio>未全部击杀超时");
                                    WG.mpz("stop", bpz);
                                }, 5 * 60 * 1000);
                            }
                        }
                    }
                }
                else if (state == 1 && kill_now.length && data.type == "itemremove") {
                    for (let i = 0; i < kill_now.length; i++) {
                        if (kill_now[i] == data.id) {
                            kill_now.splice(i, 1);
                        }
                    }
                    //击杀完成
                    if (kill_now.length == 0) {
                        if (G.in_fight) {
                            //修正战斗不结束
                            test({ data: '{type:"combat",end:1}' });
                        }
                        if (mpz_wait_timer) {
                            clearTimeout(mpz_wait_timer);
                            mpz_wait_timer = undefined;
                        }
                        if (path_index < path.length) {
                            setTimeout(() => {
                                send_cmd(path[path_index++]);
                            }, 3000);
                            state = 0;

                            messageAppend("<hio>门派战</hio>叫杀完成，前往下一地点");
                        }
                        else {
                            WG.mpz("stop");
                        }
                    }
                }
                else if (state == 1 && kill_now.length > 1 && data.type == "dispfm") {
                    //输出平均
                    let min, max, min_id;
                    min_id = kill_now[0];
                    min = max = G.items.get(kill_now[0]).damage;
                    for (let i = 1; i < kill_now.length; i++) {
                        let tmp = G.items.get(kill_now[i]).damage;
                        if (tmp < min) {
                            min = tmp;
                            min_id = kill_now[i];
                        }
                        if (tmp > max)
                            max = tmp;
                    }
                    //dps差距过大，转换目标
                    if (max > (min * 2)) {
                        send_cmd("kill " + min_id);
                    }

                }
                else if (state < 2 && data.type == 'die') {
                    messageAppend("<hio>门派战</hio>击杀失败，复活挖矿");
                    send_cmd('relive');
                    setTimeout(function () {
                        send_cmd('liaoshang');
                    }, 500);
                    state = 2;
                } else if (state == 2 && data.type == 'text' && data.msg == '你内力不够，无法治疗自身伤势。') {
                    setTimeout(function () {
                        send_cmd('liaoshang');
                    }, 3000);
                } else if (state == 2 && data.type == 'status' && data.id == G.id && data.action == 'remove' && data.sid == 'xuruo') {
                    WG.mpz("stop", bpz);
                    state = 0;
                }
            });
            WG.guaji_stop();
            $(".eq1").click();
            $(".sk1").click();
            send_cmd(path[path_index++]);
            messageAppend("<hio>门派战</hio><MAG>开始</MAG>");
            if (bpz) send_cmd("pty 大家走起");
        },
        boss: function (boss_name, boss_path) {
            if (boss_name == "stop") {
                if (G.kill_listener) {
                    remove_listener(G.kill_listener);
                }
                WG.guaji();
                return;
            }
            if (G.kill_listener) {
                remove_listener(G.kill_listener);
            }
            let boss_id, state = 1, index = 0, paths;
            let path2 = C.path2[boss_path];
            let kill_time;
            if (path2) {
                paths = path2.split(";");
            }
            else {
                paths = [];
            }
            //清除火龙王等标红
            boss_name = $.trim($('<body>' + boss_name + '</body>').text());
            G.kill_listener = add_listener(['sc', 'dispfm', 'status', 'die', 'text', 'msg', "dialog", "itemremove"], function (data) {
                if (state == 1 && data.type == 'text' && data.msg == '你要看什么？') {
                    var id = WG.find_item(boss_name);
                    if (id) {
                        messageAppend("<hio>世界BOSS</hio>发现" + boss_name);
                        $(".eq1").click();
                        $(".sk1").click();
                        kill_time = new Date().getTime();
                        boss_id = id;
                        state = 2;
                    } else if (index < paths.length) {
                        setTimeout(function () {
                            send_cmd(paths[index++] + ';look 1');
                        }, 200);
                    } else {
                        messageAppend("<hio>世界BOSS</hio>未发现" + boss_name);
                        setTimeout(function () {
                            WG.boss("stop");
                        }, 1000);
                        state = 0;
                    }
                } else if (state == 2 && data.type == 'dispfm') {
                    kill_time = new Date().getTime() + data.rtime;
                } else if (state == 2 && data.type == 'text') {
                    var r = data.msg.match(/(.+)对著(.+)喝道：「.+！今日不是你死就是我活！」/);
                    if (r && r[2] == boss_name) {
                        setTimeout(function () {
                            var t = kill_time - new Date().getTime();
                            if (t <= 0) {
                                send_cmd("kill " + boss_id);
                            } else {
                                setTimeout(function () {
                                    send_cmd("kill " + boss_id);
                                }, t);
                            }
                        }, 1000);
                        state = 3;
                    }
                } else if (state == 2 && data.type == 'sc' && data.id == boss_id) {
                    //检测boss血量
                    let item = G.items.get(data.id);
                    //血量低于0.95强制立马攻击
                    if (item.hp / item.max_hp < 0.85) {
                        send_cmd("kill " + boss_id); state = 3; return;
                    }
                    setTimeout(function () {
                        var t = kill_time - new Date().getTime();
                        if (t <= 0) {
                            send_cmd("kill " + boss_id);
                        } else {
                            setTimeout(function () {
                                send_cmd("kill " + boss_id);
                            }, t);
                        }
                    }, 1000);
                    state = 3;

                } else if (state == 3 && data.type == 'text') {
                    var fail = false;
                    if (data.msg == '你要攻击谁？') {
                        fail = true;
                    } else {
                        let r = data.msg.match(/(.+)对你拱手说道：这位.+，不知.+有何得罪之处？/);
                        if (r && r[1] == boss_name) {
                            fail = true;
                        }
                    }
                    if (fail) {
                        messageAppend("<hio>世界BOSS</hio>击杀BOSS失败");
                        setTimeout(function () {
                            WG.boss("stop");
                        }, 1000);
                        state = 0;
                    }
                } else if (state == 3 && data.type == 'status' && data.id == G.id && data.action == 'remove') {
                    //自身状态
                } else if (state == 3 && data.type == 'status' && data.id == boss_id && data.action == 'remove') {
                    //boss状态
                } else if ((state == 2 || state == 3) && data.type == 'itemremove' && data.id == boss_id) {
                    if (G.in_fight) {
                        //修正BOSS战斗不结束
                        test({ data: '{type:"combat",end:1}' });
                    }
                    messageAppend("<hio>世界BOSS</hio>击杀BOSS完成");
                    G.stat_boss_success++;
                    setTimeout(function () {
                        WG.boss("stop");
                        state = 0;
                    }, 5000);

                } else if (state == 3 && data.type == 'dialog' && data.dialog == 'pack') {
                    if (/^<wht>.+<\/wht>$/.test(data.name)) {
                        send_cmd('drop ' + data.id);
                    }
                } else if (state > 0 && data.type == 'die') {
                    messageAppend("<hio>世界BOSS</hio>击杀失败，复活挖矿");
                    send_cmd('relive');
                    setTimeout(function () {
                        send_cmd('liaoshang');
                    }, 500);
                    state = 4;
                } else if (state == 4 && data.type == 'text' && data.msg == '你内力不够，无法治疗自身伤势。') {
                    setTimeout(function () {
                        send_cmd('liaoshang');
                    }, 3000);
                } else if (state == 4 && data.type == 'status' && data.id == G.id && data.action == 'remove' && data.sid == 'xuruo') {
                    WG.boss("stop");
                    state = 0;
                }
            });
            WG.guaji_stop();
            WG.go(boss_path);
            send_cmd("look 1");

        },
        find_sm_items: function (item) {
            for (let data of C.sm_items) {
                for (let j = 0; j < data.items.length; j++) {
                    if (data.items[j] == item) {
                        return data;
                    }
                }
            }
            if (WG.inArray(item, C.store_list)) return { type: "store", };
            return null;

        },
        find_item: function (name) {
            for (let [k, v] of G.items) {
                if (v.name == name) {
                    return k;
                }
            }
            return null;
        },
        find_state: function (name) {
            for (let [k, v] of G.items) {
                if (v.state == name) {
                    return k;
                }
            }
            return null;
        },
        yamen: function (v) {
            if (G.ym_listener || v == "stop") {
                remove_listener(G.ym_listener);
                G.ym_listener = undefined;
                $(".ym_button").text("追捕(w)");
                messageAppend("<hio>衙门追捕</hio><RED>停止</RED>");
                return;
            }
            let state;
            let ym_target, ym_target_id, ym_path, ym_cnt = 0;
            let ym_npc_id;
            let ym_index, ym_paths;
            let ym_timer;
            let ym_normal, ym_try, ym_max;
            let ym_level;
            let kill_id;
            let r = S.yamen.match(/^(\d+),(\d+),(\d+)$/);
            if (r) {
                ym_normal = parseInt(r[1]);
                ym_try = parseInt(r[2]);
                ym_max = parseInt(r[3]);
            } else {
                messageAppend("<hio>衙门追捕</hio>衙门设置参数错误，应为(快速环,修整环,追捕上限)"); return;
            }
            var task_ym = function (restart) {
                state = 0;
                WG.go("扬州城-衙门正厅");
                if (ym_npc_id) {
                    if (restart) { send_cmd('ask2 ' + ym_npc_id); }
                    send_cmd('ask1 ' + ym_npc_id);
                    send_cmd('tasks ');
                }
                else {
                    WG.todo(function () {
                        var id = WG.find_item("程药发");
                        if (id) {
                            ym_npc_id = id;
                            task_ym(restart);
                        } else {
                            messageAppend("<hio>衙门追捕</hio>未发现程药发"); WG.yamen("stop");
                        }
                    });
                }
            };

            G.ym_listener = add_listener(["text", "dialog", "items", "status", "status", "die"], (data) => {
                switch (state) {
                    case 0://任务判断
                        if (data.type == 'dialog' && data.dialog == 'tasks') {
                            let r;
                            for (let i = 0; i < data.items.length; i++) {
                                if (data.items[i].id == "yamen") {
                                    r = data.items[i].desc.match(/^扬州知府委托你追杀逃犯：(.*)目前完成(\d+)\/20个，共连续完成(\d+)个。$/);
                                    break;
                                }
                            }
                            if (r) {
                                ym_cnt = parseInt(r[2]) + 1;
                                ym_level = parseInt(r[3]);
                                if (ym_cnt > 20) { WG.yamen("stop"); }
                                else if (ym_level > ym_max) { task_ym(true); }
                                else {
                                    r = r[1].match(/^(.+)，据说最近在(.+)出现过，你还有.+去寻找他，$/);
                                    if (r) {

                                        ym_target = r[1];
                                        ym_path = r[2];
                                        state = 1;
                                        let path2 = C.path2[ym_path];
                                        if (path2) {
                                            ym_paths = path2.split(";");
                                        }
                                        else {
                                            ym_paths = [];
                                        }
                                        ym_index = 0;
                                        WG.go(ym_path);
                                        send_cmd("look 1");
                                        messageAppend("<hio>衙门追捕</hio>" + ym_cnt + "环任务：" + ym_target + "，位于" + ym_path);
                                    } else {
                                        task_ym();
                                    }
                                }
                            }
                            else {
                                WG.yamen("stop");
                            }
                        }
                        break;
                    case 1: //自动寻路并击杀
                        if (data.type == 'text' && data.msg == '你要看什么？') {
                            var id = WG.find_item(ym_target);
                            if (id) {
                                messageAppend("<hio>衙门追捕</hio>" + ym_cnt + "环任务（难度" + ym_level + ")：发现" + ym_target);
                                ym_target_id = id;
                                send_cmd("kill " + ym_target_id);
                                state = 3;
                            } else if (ym_index < ym_paths.length) {
                                setTimeout(function () {
                                    send_cmd(ym_paths[ym_index++] + ';look 1');
                                }, 200);
                            } else {
                                messageAppend("<hio>衙门追捕</hio>" + ym_cnt + "环任务（难度" + ym_level + ")：" + ym_path + "未发现" + ym_target + "，请自行查找");
                                state = 2;
                                if (ym_timer) clearTimeout(ym_timer);
                                ym_timer = setTimeout(() => {
                                    if (state == 2) {
                                        messageAppend("<hio>衙门追捕</hio>" + ym_cnt + "环任务（难度" + ym_level + ")：未进行手动查找");
                                        WG.yamen("stop");
                                    }
                                }, 20000);
                            }
                        }
                        break;
                    case 2:// 自动失效，进入手动阶段，超时追捕失败
                        if (data.type == "items") {
                            let id = WG.find_item(ym_target);
                            if (id) {
                                messageAppend("<hio>衙门追捕</hio>" + ym_cnt + "环任务（难度" + ym_level + ")：发现" + ym_target);
                                ym_target_id = id;
                                send_cmd("kill " + ym_target_id);
                                state = 3;
                                if (ym_timer) {
                                    ym_timer = undefined;
                                    clearTimeout(ym_timer);
                                }
                            }
                        }
                        break;
                    case 3: //战斗处理
                        if (data.type == 'status' && data.id == G.id && data.action == 'remove') {
                            //自身状态
                        } else if (data.type == 'status' && data.id == ym_target_id && data.action == 'remove') {
                            //boss状态
                        } else if (data.type == 'text' && data.msg.match(/^<hig>你的追捕任务完成了，目前完成(\d+)\/(\d+)个，已连续完成(\d+)个。<\/hig>$/)) {
                            messageAppend("<hio>衙门追捕</hio>任务完成");
                            if (ym_level > ym_normal) {
                                messageAppend("<hio>衙门追捕</hio>修整");
                                WG.yamen("stop");
                            }
                            else {
                                send_cmd("tasks");
                            }
                            state = 0;

                        } else if (data.type == 'die') {
                            messageAppend("<hio>衙门追捕</hio>击杀失败，请设置衙门环数");
                            send_cmd('relive');
                            setTimeout(function () {
                                send_cmd('liaoshang');
                            }, 500);
                            state = 4;
                        }
                        break;
                    case 4://   死亡处理
                        if (state == 4 && data.type == 'text' && data.msg == '你内力不够，无法治疗自身伤势。') {
                            setTimeout(function () {
                                send_cmd('liaoshang');
                            }, 3000);
                        } else if (state == 4 && data.type == 'status' && data.id == G.id && data.action == 'remove' && data.sid == 'xuruo') {
                            WG.yamen("stop");
                            state = 0;
                        }
                        break;
                }
            });
            state = 0;
            send_cmd("tasks");
            messageAppend("<hio>衙门追捕</hio><MAG>开始</MAG>");
            $(".ym_button").text("停止(Q)");
        },
        kill_all: function () {
              if (WebSocket) {
                for (let [k, v] of G.items) {
                    if (k == G.id) continue;
                     WG.Send("kill " + k);

                }
              } else {
                var lists = $(".room_items .room-item");
                for (var npc of lists) {
                    send_cmd("kill " + $(npc).attr("itemid"));
                }

            }
        },

        get_all: function () {
            if(WebSocket){
                for (let [k, v] of G.items) {
                    if (k == G.id) continue;
                    if (v.name.match(/^(.+)的尸体$/)) {
                         WG.Send("get all from " + k);
                    }
                }
            }
            else{
                var lists = $(".room_items .room-item");
                for (var npc of lists) {
                    send_cmd("get all from " + $(npc).attr("itemid"));
                }

            }
        },
        inArray: function (val, arr) {
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if (item.length < 2) continue;
                if (item[0] == "<") {
                    if (item == val) return true;
                }
                else {
                    if (val.indexOf(item) >= 0) return true;
                }
            }
            return false;

        },
        packup: function () {
            if (G.packup_listener) {
                messageAppend("<hio>包裹整理</hio>运行中");
                return;
            }
            let stores = [];
            G.packup_listener = add_listener(["dialog", "text"], (data) => {
                if (data.type == "dialog" && data.dialog == "list") {
                    if (data.stores == undefined) {
                        return;
                    }
                    stores = [];
                    //去重
                    for (let i = 0; i < data.stores.length; i++) {
                        let s = null;
                        for (let j = 0; j < stores.length; j++) {
                            if (stores[j].name == data.stores[i].name) {
                                s = stores[j]; break;
                            }
                        }
                        if (s != null) {
                            s.count += data.stores[i].count;
                        }
                        else {
                            stores.push(data.stores[i]);
                        }
                    }

                } else if (data.type == "dialog" && data.dialog == "pack" && data.items) {
                    let cmds = [];
                    let drop_list = S.drop_list == "" ? [] : S.drop_list.split(",");
                    let fenjie_list = S.fenjie_list == "" ? [] : S.fenjie_list.split(",");
                    for (var i = 0; i < data.items.length; i++) {
                        //仓库
                        if (WG.inArray(data.items[i].name, C.store_list)) {
                            if (data.items[i].can_eq) {
                                //装备物品，不能叠加，计算总数
                                let store = null;
                                for (let j = 0; j < stores.length; j++) {
                                    if (stores[j].name == data.items[i].name) {
                                        store = stores[j]; break;
                                    }
                                }
                                if (store != null) {
                                    if (store.count < S.packup_max) {
                                        store.count += data.items[i].count;
                                        cmds.push("store " + data.items[i].count + " " + data.items[i].id);
                                        messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "储存到仓库");
                                    }
                                    else {
                                        messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "超过设置的储存上限");
                                    }
                                }
                                else {
                                    stores.push(data.items[i]);
                                    cmds.push("store " + data.items[i].count + " " + data.items[i].id);
                                    messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "储存到仓库");
                                }
                            }
                            else {
                                cmds.push("store " + data.items[i].count + " " + data.items[i].id);
                                messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "储存到仓库");
                            }
                        }
                        //丢弃
                        if (drop_list.length && WG.inArray(data.items[i].name, drop_list)) {
                            cmds.push("drop " + data.items[i].count + " " + data.items[i].id);
                            messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "丢弃");

                        }
                        //分解，2级强化以上不分解
                        if (fenjie_list.length && WG.inArray(data.items[i].name, fenjie_list) && data.items[i].name.indexOf("★") == -1) {
                            cmds.push("fenjie " + data.items[i].id);
                            messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "分解");

                        }
                    }
                    if (cmds.length > 0) {
                        send_cmd(cmds);
                    }
                    WG.go("扬州城-杂货铺");
                    send_cmd("sell all");
                    send_cmd("look3 1");
                }
                else if (data.type == 'text' && data.msg == '没有这个玩家。') {
                    messageAppend("<hio>包裹整理</hio>完成");
                    remove_listener(G.packup_listener);
                    G.packup_listener = undefined;
                }
            });

            messageAppend("<hio>包裹整理</hio>开始");
            WG.go("扬州城-钱庄");
            send_cmd("store;pack");
        },
        xiulian: function (v) {
            if (v == "stop") {
                if (G.xl_listener) {
                    remove_listener(G.xl_listener);
                    messageAppend("<hio>自动修炼</hio>结束");
                    G.xl_listener = undefined;
                }
                return;
            } else if (G.xl_listener) {
                messageAppend("<hio>自动修炼</hio>已开启自动修炼");
                return;
            } else if (v == "now") {
                if (G.state == "练习" || G.state == "打坐" || G.state == "学习") {
                    messageAppend("<hio>自动修炼</hio>当前完成自动挖矿");
                    G.xiulian_now = true;
                    G.xl_skills = [];
                }
                else {
                    messageAppend("<hio>自动修炼</hio>当前非修炼状态");
                    return;
                }
            }
            else {
                if (S.xl_skills.length == 0) {
                    messageAppend("<hio>自动修炼</hio>未设置修炼列表");
                    return;
                }
                G.xiulian_now = false;
                G.xl_skills = S.xl_skills.split(",");
            }
            G.xl_index = 0;
            G.xl_flag = true;
            G.xl_listener = add_listener(['msg', 'text'], function (data) {
                if (data.type == 'text') {
                    if (data.msg.match(/^也许是缺乏实战经验，你觉得你的.+已经到了瓶颈了。$/)
                        || data.msg.match(/^你的.+等级不够100，无法练习。$/)
                        || data.msg == '你的基本功火候未到，必须先打好基础才能继续提高。'
                        || data.msg == '<hic>你觉得你的经脉充盈，已经没有办法再增加内力了。</hic>'
                        || data.msg == "你不会这个技能。"
                        || data.msg == '你必须找把刀才能学五虎断门刀。'
                        || data.msg == "这项技能你的程度已经不输你师父了。") {
                        if (++G.xl_index < G.xl_skills.length) {
                            if (G.xl_skills[G.xl_index] == "dazuo") {
                                send_cmd("stopstate;dazuo");
                            }
                            else {
                                send_cmd('stopstate;lianxi ' + G.xl_skills[G.xl_index]);
                            }
                        } else {
                            setTimeout(function () {
                                WG.xiulian("stop");
                                WG.zdwk();
                            }, 1000);
                        }
                    } else if (data.msg == '你的潜能不够，无法继续练习下去了。') {
                        setTimeout(function () {
                            WG.xiulian("stop");
                            WG.zdwk();
                        }, 1000);
                    } else {
                        var r = data.msg.match(/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/);
                        if (r) {
                            if (parseInt(r[2]) < 80) {
                                messageAppend("<hio>自动修炼</hio>挖矿收益过低，返回修炼");
                                send_cmd("stopstate");
                                WG.go("住房-练功房");
                                $(".eq3").click();
                                $(".sk2").click();
                                if (G.xl_skills[G.xl_index] == "dazuo") {
                                    send_cmd("stopstate;dazuo");
                                }
                                else {
                                    send_cmd('stopstate;lianxi ' + G.xl_skills[G.xl_index]);
                                }
                            }
                        }
                    }
                } else if (data.type == 'msg' && data.ch == 'sys' && G.map == "home" && !G.xiulian_now) {
                    let r = data.content.match(/^(.+)捡到一本挖矿指南，学会了里面记载的挖矿技巧，所有人的挖矿效率都提高了。$/);
                    if (G.xl_skills.length && r) {
                        //挖矿指南，前往挖矿
                        messageAppend("<hio>自动修炼</hio>检测到挖矿指南，前往挖矿");
                        send_cmd("stopstate");
                        WG.zdwk();
                    }
                }
            });
            if (G.xiulian_now) {

            } else {
                send_cmd("stopstate");
                WG.go("住房-练功房");
                $(".eq3").click();
                $(".sk2").click();
                if (G.xl_skills[G.xl_index] == "dazuo") {
                    send_cmd("stopstate;dazuo");
                }
                else {
                    send_cmd('stopstate;lianxi ' + G.xl_skills[G.xl_index]);
                }
                messageAppend("<hio>自动修炼</hio>开始");
            }

        },
        auto_fight: function () {
            let name = prompt();
            let id = WG.find_item(name);
            if (id == null) return;
            if (G.fight_listener) {
                messageAppend("<hio>自动比试</hio>结束");
                remove_listener(G.fight_listener);
                G.fight_listener = undefined;
            }
            G.fight_listener = add_listener(["sc", "combat"], function (data) {
                if (data.type == "combat" && data.end) {
                    WG.recover(1, 1, 0, function () { });
                }
                else if (data.type == "sc" && data.id == id) {
                    let item = G.items.get(id);
                    if (item.hp >= item.max_hp) {
                        WG.recover(0, 1, 0, function () { });
                        send_cmd("stopstate;fight " + id);
                    }
                }

            });
            send_cmd("stopstate;fight " + id);
            messageAppend("<hio>自动比试</hio>开始");
        },
        auto_xy: function () {
            if (G.xy_listener) {
                messageAppend("<hio>自动襄阳</hio>结束");
                remove_listener(G.xy_listener);
                G.xy_listener = undefined;
                return;
            }
            let kill_targets = ["万夫长","千夫长","百夫长", "十夫长", "蒙古兵"];
            let has_stopstate = false;
            G.xy_listener = add_listener(["items", "itemadd", "combat", "die"], function (data) {
                if (data.type == "items") {
                    for (let [k, v] of G.items) {
                        if (v.p) continue;
                        if (WG.inArray(v.title, kill_targets) || WG.inArray(v.name, kill_targets)) {
                            send_cmd("kill " + k);
                        }
                    }
                }
                else if (data.type == "itemadd") {
                    let v = G.items.get(data.id);
                    if (WG.inArray(v.title, kill_targets) || WG.inArray(v.name, kill_targets)) {
                        if (has_stopstate == false) {
                            has_stopstate = true;
                            send_cmd("stopstate");
                            setTimeout(() => {
                                has_stopstate = false;
                            }, 3000);
                        }
                        send_cmd("kill " + data.id);
                        WG.recover(0);
                    }
                }
                else if (data.type == "combat" && data.end) {
                    //WG.recover(1, 0.7, 0, function () { });
                }
                else if (data.type == "die") {
                    messageAppend("<hio>自动襄阳</hio>太水了，结束");
                    remove_listener(G.xy_listener);
                    G.xy_listener = undefined;
                }
            });
            messageAppend("<hio>自动襄阳</hio>开始");
        },
        zdwk: function (v) {
            if (G.level) {
                if (G.level.indexOf('武帝') >= 0||G.level.indexOf('武神') >= 0) {
                    WG.go("住房-练功房");;
                    send_cmd("xiulian");
                    return;
                }
            }
            if (v == "remove") {
                if (G.wk_listener) {
                    remove_listener(G.wk_listener);
                    G.wk_listener = undefined;
                }
                return;
            }
            if (G.wk_listener) return;
            let tiejiang_id;
            let wk_busy = false;
            G.wk_listener = add_listener(["dialog", "text"], function (data) {
                if (data.type == "dialog" && data.dialog == "pack") {
                    //检查是否装备铁镐
                    let tiegao_id;
                    if (data.name) {
                        if (data.name == "<wht>铁镐</wht>") {
                            send_cmd("eq " + data.id);
                            WG.go("扬州城-矿山"); send_cmd("wa"); return;
                        }
                    } else if (data.items) {
                        if (data.eqs[0] && data.eqs[0].name.indexOf("铁镐") > -1) {
                            WG.go("扬州城-矿山"); send_cmd("wa"); return;
                        }
                        else {
                            for (let i = 0; i < data.items.length; i++) {
                                let item = data.items[i];
                                if (item.name.indexOf("铁镐") > -1) {
                                    tiegao_id = item.id;
                                    break;
                                }
                            }
                            if (tiegao_id) {
                                send_cmd("eq " + tiegao_id);
                                WG.go("扬州城-矿山"); send_cmd("wa"); return;
                            }
                            else {
                                WG.go("扬州城-打铁铺"); send_cmd("look 1");
                            }
                        }
                    }
                }
                if (data.type == 'text' && data.msg == '你要看什么？') {
                    let id = WG.find_item("铁匠");
                    if (id) {
                        tiejiang_id = id;
                        send_cmd('list ' + id);
                    } else {
                        messageAppend("<hio>自动挖矿</hio>未发现铁匠"); WG.zdwk("remove");
                    }
                } else if (data.type == 'text') {
                    if (data.msg == '你挥着铁镐开始认真挖矿。') WG.zdwk("remove");
                    else if ((data.msg == "你现在正忙。" || data.msg == "你正在战斗，待会再说。") && wk_busy == false) {
                        wk_busy = true;

                        setTimeout(() => {
                            wk_busy = false;
                            send_cmd("stopstate;pack");
                        }, 5000);
                    }

                }
                if (data.type == 'dialog' && data.dialog == 'list' && data.seller == tiejiang_id) {
                    let item_id;
                    for (let i = 0; i < data.selllist.length; i++) {
                        let item = data.selllist[i];
                        if (item.name == "<wht>铁镐</wht>") {
                            item_id = item.id;
                            break;
                        }
                    }
                    if (item_id) {
                        send_cmd('buy 1 ' + item_id + ' from ' + tiejiang_id);
                    } else {
                        messageAppend("<hio>自动挖矿</hio>无法购买<wht>铁镐</wht>"); WG.zdwk("remove");
                    }
                }

            });
            send_cmd("stopstate;pack");
        },
        auto_check: function () {
            if (G.xl_listener) return true;
            if (G.wd_linstener) return true;
            return false;
        },
        guaji: function () {
            if (G.xl_flag) WG.xiulian();
            else WG.zdwk();
        },
        guaji_stop: function () {
            if (G.state) send_cmd("stopstate");
            if (!G.xl_listener) G.xl_flag = false;
            if (G.wd_linstener) WG.wudao("stop");
            WG.xiulian("stop");
        },
        Ch2Num: function (chnStr) {
            var chnNumChar = { 零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
            var chnNameValue = { 十: { value: 10, secUnit: false }, 百: { value: 100, secUnit: false }, 千: { value: 1000, secUnit: false }, 万: { value: 10000, secUnit: true }, 亿: { value: 100000000, secUnit: true } };
            var rtn = 0;
            var section = 0;
            var number = 0;
            var secUnit = false;
            var str = chnStr.split('');
            for (var i = 0; i < str.length; i++) {
                var num = chnNumChar[str[i]];
                if (typeof num !== 'undefined') {
                    number = num;
                    if (i === str.length - 1) {
                        section += number;
                    }
                } else {
                    var unit = chnNameValue[str[i]].value;
                    secUnit = chnNameValue[str[i]].secUnit;
                    if (i == 0) {
                        section += 10
                    }
                    if (secUnit) {
                        section = (section + number) * unit;
                        rtn += section;
                        section = 0;
                    } else {
                        section += (number * unit);
                    }
                    number = 0;
                }
            }
            return rtn + section;
        },
        recover: function (hp, mp, cd, callback) {
            //返回定时器
            if (hp == 0) {
                if (WG.recover_timer) {
                    clearTimeout(WG.recover_timer);
                    WG.recover_timer = undefined;
                }
                return;
            }
            send_cmd("dazuo");
            WG.recover_timer = setInterval(function () {
                //检查状态
                let item = G.items.get(G.id);
                if (item.mp / item.max_mp < mp) {//内力控制
                    if (item.state != "打坐") { send_cmd("stopstate;dazuo"); } return;
                }
                if (item.hp / item.max_hp < hp) {
                    //血满
                    if (item.state != "疗伤") { send_cmd("stopstate;liaoshang"); } return;
                }
                if (item.state) send_cmd("stopstate");
                if (cd) {
                    for (let [k, v] of G.cds) {
                        if (k == "force.tu") continue;
                        if (v) return;
                    }
                }
                clearInterval();
                callback();
            }, 1000);
        },
        wudao: function (v) {
            if (v == "stop") {
                if (G.wd_timer) {
                    clearInterval(G.wd_timer);
                    G.wd_timer = undefined;
                }
                if (G.wd_linstener) {
                    remove_listener(G.wd_linstener);
                    G.wd_linstener = undefined;
                    return;
                }
            }
            if (G.wd_linstener) return;
            let lv = 0;
            let lv_normal, lv_try, lv_max;
            let kill_id;
            let r = S.wudao.match(/^(\d+),(\d+),(\d+)$/);
            if (r) {
                lv_normal = parseInt(r[1]);
                lv_try = parseInt(r[2]);
                lv_max = parseInt(r[3]);
            } else {
                messageAppend("<hio>自动武道</hio>武道设置参数错误，应为数字,数字(快速层,30,50)"); return;
            }
            G.wd_linstener = add_listener(["items", "text",], (data) => {
                if (data.type == "items") {
                    let r = G.room_name.match(/^武道塔-第(.+)层$/);
                    if (r) {
                        lv = WG.Ch2Num(r[1]);
                        if (lv > lv_max) {
                            messageAppend("<hio>自动武道</hio>当前层数超过设置层数，请手动武道。"); WG.wudao("stop");
                        }
                        else {
                            messageAppend("<hio>自动武道</hio>当前层数为" + lv);
                        }
                        for (let [k, v] of G.items) {
                            if (v.title = "武道塔守护者") {
                                kill_id = k;
                                send_cmd("kill " + kill_id);
                                break;
                            }
                        }
                    } else {
                        kill_id = undefined;
                        lv = 0;
                    }
                }
                else if (data.type == 'text' && data.msg == '<hig>恭喜你战胜了武道塔守护者，你现在可以进入下一层。</hig>') {
                    if (lv > lv_normal) {
                        messageAppend("<hio>自动武道</hio>修整");
                        WG.wudao("stop");
                    }
                    else {
                        setTimeout(function () {
                            send_cmd('go up');
                        }, 500);
                    }
                } else if (data.type == 'text' && data.msg == '<hir>你的挑战失败了。</hir>') {
                    messageAppend("<hio>自动武道</hio>失败"); WG.wudao("stop");
                }
            });
            if (G.room == "ta") {
                send_cmd("go out;go enter");
            } else {
                WG.go("武道塔");
                WG.todo(function () {
                    var id = WG.find_item("守门人");
                    if (id) {
                        send_cmd("ask1 " + id + ";go enter");
                    } else {
                        messageAppend("<hio>自动武道</hio>未发现守门人"); WG.wudao("stop");
                    }
                });
            }
        },
        richang: function () {
            let need_sm = 0;
            let need_fb = 0;
            let h = add_listener("dialog", (data) => {
                if (data.type == 'dialog' && data.dialog == 'tasks') {
                    let r, state;
                    if (data.items) {
                        for (let i = 0; i < data.items.length; i++) {
                            if (data.items[i].id == "signin") {
                                r = data.items[i].desc.match(/师门任务：<\w+>(\d+)\/(\d+).*副本：<\w+>(\d+)\/(\d+)/);
                                state = data.items[i].state;
                                break;
                            }
                        }
                    } else if (data.id) {
                        r = data.desc.match(/师门任务：<\w+>(\d+)\/(\d+).*副本：<\w+>(\d+)\/(\d+)/);
                        state = data.state;
                    }
                    console.log(state);
                    if (state == 3) {
                        messageAppend("<hio>自动日常</hio>已完成，自动挖矿");
                        remove_listener(h);
                        setTimeout(() => {
                            WG.zdwk();
                        }, 1000);

                        return;
                    }
                    if (r && state == 1) {
                        need_sm = r[2] - r[1];
                        need_fb = r[4] - r[3];
                        if (need_sm > 0) {
                            messageAppend("<hio>自动日常</hio>自动师门" + need_sm + "次");
                            WG.sm("auto", function () {
                                messageAppend("<hio>自动日常</hio>师门任务完成，再次检测");
                                send_cmd("tasks");
                            });
                            return;
                        }
                        messageAppend("<hio>自动日常</hio>自动小树林" + need_fb + "次");
                        for (let i = 0; i < need_fb; i++)send_cmd("cr yz/lw/shangu;cr over");
                        send_cmd("taskover signin");
                    }
                    else {
                        messageAppend("<hio>自动日常</hio>出错，自动挖矿");
                        remove_listener(h);
                        setTimeout(() => {
                            WG.zdwk();
                        }, 1000);
                    }
                }
            });
            send_cmd("stopstate;tasks");
            messageAppend("<hio>自动日常</hio>开始检测");
        },
        cmd_echo_button: function () {
            if (G.cmd_echo) {
                G.cmd_echo = false;
                messageAppend("<hio>命令代码关闭</hio>");
            }
            else {
                G.cmd_echo = true;
                messageAppend("<hio>命令代码显示</hio>");
            }
            cmd_echo(G.cmd_echo);
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
        auto_preform_switch: function () {
            if (G.auto_preform) {
                G.auto_preform = false;
                messageAppend("<hio>自动施法</hio>关闭");
                WG.auto_preform("stop");

            } else {
                G.auto_preform = true;
                messageAppend("<hio>自动施法</hio>开启");
                WG.auto_preform();
            }

        },
        auto_preform: function (v) {
            if (v == "stop") {
                if (G.preform_timer) {
                    clearInterval(G.preform_timer);
                    G.preform_timer = undefined;
                    $(".auto_perform").css("background", "");
                }
                return;
            }
            if (G.preform_timer || G.auto_preform == false) return;
            $(".auto_perform").css("background", "#3E0000");
            G.preform_timer = setInterval(() => {
                if (G.in_fight == false) WG.auto_preform("stop");
                for (var skill of G.skills) {
                 G.blackpfm = []
                 G.blackpfm = S.blackpfm.split(",");
             if (WG.inArray(skill.id, G.blackpfm)) {
                        continue;
                    }
                    if (!G.gcd && !G.cds.get(skill.id)) {
                        send_cmd("perform " + skill.id); break;
                    }
                }
            }, 350);
        },
    };

    //设置
    var S = {
        yamen: "",
        packup_max: 4,
        auto_xiyan: 0,
        auto_boss: 0,
        auto_bpz: 0,
        xl_skills: "",
        eq1: "",
        eq2: "",
        eq3: "",
        sk1: "",
        sk2: "",
        wudao: "",
        blackpfm: "",
        drop_list: "",
        fenjie_list: "",
        alt: 0,
        kill_player: 0,
        kill_maxHp: 39999999,
        load: function (e) {
            if (e) for (var t in e) (this[t] == undefined || (this.set_prop(t, e[t]), this[t] = e[t]));
        },
        set_prop: function (e, t) {
            switch (e) {
                case "eq1":
                case "eq2":
                case "eq3":
                case "sk1":
                case "sk2":
                    {
                        if (typeof (t) != "string") {
                            $("." + e).text("未设置");
                            G[e] = undefined;
                            break;
                        }
                        let tmp = t.split(":");
                        if (tmp.length == 2) {
                            $("." + e).text(tmp[0]);
                            G[e] = tmp[1].replace(/,/g, ";");
                        }
                    }
                    break;
                case "alt":
                    if (t) document.title = G.role + "【小号】";
                    else document.title = G.role;
                    break;
            }
        },
        save: function (e, t) {
            if (this[e] != t) {
                this[e] = t; send_cmd("setting " + e + " " + t);
            }
            this.set_prop(e, t);
        },
    }
    WG.setting = {
        load: function (e) {
            S.load(e);
            this.html();
            for (let w = $(".setting>.setting-item2"), t = 0; t < w.length; t++) {
                var s = $(w[t]), i = s.attr("for");
                if (i) {
                    var n = S[i];
                    switch (i) {
                        case "eq1":
                        case "eq2":
                        case "eq3":
                        case "sk1":
                        case "sk2":
                        case "xl_skills":
                        case "wudao":
                        case "yamen":
                        case "blackpfm":
                        case "drop_list":
                        case "fenjie_list":
                        case "kill_maxHp":
                            $("#" + i).show().val(n);
                            break;
                        default:
                            1 == n && (s.find(".switch2").addClass("on"), s.find(".switch-text").html("开"))
                    }
                }
            }
        },
        html_switch: function (prop, title) {
            return `
            <div class="setting-item setting-item2 " for="${prop}" style='display: inline-block;'>
            <span class="title"> ${title}</span>
            <span class="switch2">
            <span class="switch-button"></span>
            <span class="switch-text">关</span>
            </span>
            </div>
            `;
        },
        html_input: function (prop, title, attr, br) {
            return `
            <div class="setting-item setting-item2" for="${prop}" ${br ? "style='display: inline-block;'" : ""} >
            <span class="title"> ${title}</span>
            <input class="settingbox2 hide" spellcheck="false" id="${prop}"  ${attr}></input>
            </div>
            `;
        },
        html_textarea: function (prop, title, attr) {
            return `
            <div class="setting-item setting-item2" for="${prop}">
            <span class="title"> ${title}</span><br>
            <textarea class="settingbox2 hide" spellcheck="false" id="${prop}"  ${attr}></textarea>
            </div>
            `;
        },
        html: function () {
            if ($(".WG_setting").length) return;
            var setting_html = "<h3 class='WG_setting'>插件设置</h3>" +
                this.html_switch("auto_xiyan", "自动喜宴") +
                this.html_switch("auto_boss", "自动BOSS") +
                this.html_switch("auto_bpz", "自动门派战") +
                this.html_switch("kill_player", "叫杀玩家") +
                this.html_switch("alt", "小号设置") +
                "<br>" +
                this.html_input("kill_maxHp", "叫杀限制", `style='width:80px;' placeholder="叫杀血量限制" oninput="value=value.replace(/[^\\d]/g,'');"`, true) +
                this.html_input("yamen", "追捕设置", `style='width:200px;' placeholder="快速上限,修整上限，重置上限" oninput="value=value.replace(/[^\\d\\,]/g,'');"`, true) +
                this.html_input("wudao", "武道设置", `style='width:200px;' placeholder="快速上限,修整上限，停止上限" oninput="value=value.replace(/[^\\d\\,]/g,'');"`, true) +
                this.html_input("eq1", "自定义装备1（日常）", `placeholder="标签:代码1,代码2……"`) +
                this.html_input("eq2", "自定义装备2（日常）", `placeholder="标签:代码1,代码2……"`) +
                this.html_input("eq3", "自定义装备3（练习）", `placeholder="标签:代码1,代码2……"`) +
                this.html_input("sk1", "自定义技能1（战斗）", `placeholder="标签:代码1,代码2……"`) +
                this.html_input("sk2", "自定义技能2（练习）", `placeholder="标签:代码1,代码2……"`) +
                this.html_textarea("xl_skills", "修炼列表", `style='width:90%;height:2.5rem;'`) +
                this.html_textarea("blackpfm", "不自动出招", `style='width:90%;height:2.5rem;'`) +
                this.html_textarea("drop_list", "整理丢弃清单", `style='width:90%;height:2.5rem;' placeholder="物品1,物品2……(注意，这边的丢弃没有提示)"`) +
                this.html_textarea("fenjie_list", "整理分解清单", `style='width:90%;height:2.5rem;' placeholder="物品1,物品2……(注意，这边的分解没有提示，2级强化的物品不会分解)"`) +
                "<button class='setting-save'>保存插件设置</button><h3>原设置</h3>";
            $(".dialog-custom").prepend(setting_html);
            let css = `.setting > .setting-save {border:1px solid gray;background-color:transparent;color:unset;
width:7rem;height:1.7rem;margin-left: 0.625em;}
.setting-item2{color:#fff;}
.switch2 {display: inline-block;position: relative;height: 1.25em;width: 3.125em;line-height: 1.25em;
border-radius: 0.875em;background: #dedede;cursor: pointer;-ms-user-select: none;-moz-user-select: none;
-webkit-user-select: none;user-select: none;vertical-align: middle;text-align: center;}
.switch2 > .switch-button {position: absolute;left: 0px;height: 1.25em;width: 1.25em;
border-radius: 0.875em;background: #fff;box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
transition: 0.3s;-webkit-transition: 0.3s;left: 0px;}
.switch2 > .switch-text {color:#898989;margin-left: 0.625em;}
.on {background-color:#008000;}
.on>.switch-button {right:0px;left:auto;}
.on > .switch-text {margin-right: 0.625em;margin-left: 0px;color: white;}
.settingbox2{margin-left: 0.625em;border: 1px solid gray;background-color: transparent;
color: unset;resize: none;width: 80%;height: 1rem;margin-bottom: 0px;padding: 0px;}
.dialog-custom { min-height: 35em; }
`;
            GM_addStyle(css);
            $(".dialog-custom").on("click", ".switch2", this.switchClick);
            $(".dialog-custom").on("click", ".setting-save", this.saveClick);
        },
        switchClick: function (e) {
            let t = $(this),
                s = t.parent().attr("for");
            if (t.is(".on")) { t.removeClass("on"); t.find(".switch-text").html("关") }
            else { t.addClass("on"); t.find(".switch-text").html("开"); }
        },
        saveClick: function () {
            for (let w = $(".setting>.setting-item2"), t = 0; t < w.length; t++) {
                let s = $(w[t]), i = s.attr("for"), t1, t2;
                if (i) {
                    t1 = s.find(".settingbox2");
                    t2 = s.find(".switch2");

                    if (t1.length) {
                        S.save(i, t1.val().length ? t1.val() : 0);
                    } else if (t2.length) {

                        S.save(i, t2.hasClass("on") ? 1 : 0);
                    }

                }
            }
            messageAppend("<hic>设置已保存。</hic>");
            KEY.dialog_close();
        },
    };
    unsafeWindow.WG = WG;
    unsafeWindow.G = G;
    unsafeWindow.S = S;
    unsafeWindow.messageClear = messageClear;
    unsafeWindow.messageAppend = messageAppend;
    $(document).ready(function () {
        KEY.init();
        WG.init();
        $("head").append("<link href='https://cdn.staticfile.org/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.css' rel='stylesheet'>");
        $.contextMenu({
            selector: ".container",
            autoHide: 0,
            items: {
                "关闭自动": {
                    name: "关闭自动", visible: function (key, opt) { return WG.auto_check(); },
                    callback: function (key, opt) { WG.guaji_stop(); },
                },
                "自动": {
                    name: "自动", visible: function (key, opt) { return !WG.auto_check(); },
                    "items": {
                        "自动修炼": { name: "自动修炼", callback: function (key, opt) { WG.xiulian(); }, },
                        "修炼当前": { name: "修炼当前", callback: function (key, opt) { WG.xiulian("now"); }, },
                        "自动武道": { name: "自动武道", callback: function (key, opt) { WG.wudao(); }, },
                        "自动日常": { name: "自动日常", visible: function (key, opt) { return S.alt; }, callback: function (key, opt) { WG.richang(); }, },
                        "自动比试": { name: "自动比试", visible: function (key, opt) { return G.fight_listener == undefined; }, callback: function (key, opt) { WG.auto_fight(); }, },
                        "关闭比试": { name: "关闭比试", visible: function (key, opt) { return G.fight_listener != undefined; }, callback: function (key, opt) { WG.auto_fight(); }, },
                        "自动襄阳": { name: "自动襄阳", visible: function (key, opt) { return G.xy_listener == undefined; }, callback: function (key, opt) { WG.auto_xy(); }, },
                        "关闭襄阳": { name: "关闭襄阳", visible: function (key, opt) { return G.xy_listener != undefined; }, callback: function (key, opt) { WG.auto_xy(); }, },
                        "自动副本": { name: "自动副本", callback: function (key, opt) { if (unsafeWindow.ToRaid) { unsafeWindow.ToRaid.menu(); } else { messageAppend("插件未安装,请访问 https://greasyfork.org/zh-CN/scripts/375851-wsmud-raid 下载并安装");  } },},
                    },
                },
                "快捷传送": {
                    name: "常用地点",
                    "items": {
                        "kj0": { name: "豪宅", callback: function (key, opt) { WG.go("住房"); }, },
                        "kj1": { name: "仓库", callback: function (key, opt) { WG.go("扬州城-钱庄"); send_cmd("store") }, },
                        "kj2": { name: "武庙", callback: function (key, opt) { WG.go("扬州城-武庙"); send_cmd("liaoshang") }, },
                        "kj3": { name: "衙门", callback: function (key, opt) { WG.go("扬州城-衙门正厅"); }, },
                        "kj4": { name: "帮派", callback: function (key, opt) { WG.go("扬州城-帮派"); }, },
                        "kj10": { name: "镖局", callback: function (key, opt) { WG.go("扬州城-镖局正厅"); }, },
                        "kj5": { name: "擂台", callback: function (key, opt) { WG.go("扬州城-擂台"); }, },
                        "kj6": { name: "当铺", callback: function (key, opt) { WG.go("扬州城-当铺"); }, },
                        "kj7": { name: "杂货铺", callback: function (key, opt) { WG.go("扬州城-杂货铺"); }, },
                        "kj8": { name: "打铁铺", callback: function (key, opt) { WG.go("扬州城-打铁铺"); }, },
                        "kj9": { name: "药铺", callback: function (key, opt) { WG.go("扬州城-药铺"); }, },
                    },
                },
                "门派传送": {
                    name: "门派传送",
                    "items": {
                        "mp1": { name: "武当", callback: function (key, opt) { WG.go("武当派-紫"); }, },
                        "mp2": { name: "少林", callback: function (key, opt) { WG.go("少林派-紫"); }, },
                        "mp3": { name: "华山", callback: function (key, opt) { WG.go("华山派-紫"); }, },
                        "mp4": { name: "峨眉", callback: function (key, opt) { WG.go("峨眉派-紫"); }, },
                        "mp5": { name: "逍遥", callback: function (key, opt) { WG.go("逍遥派-紫"); }, },
                        "mp6": { name: "丐帮", callback: function (key, opt) { WG.go("丐帮-紫"); }, },
                        "mp7": { name: "襄阳", callback: function (key, opt) { WG.go("襄阳城-广场"); }, },
                        "mp8": { name: "武道", callback: function (key, opt) { WG.go("武道塔"); }, },
                        "mp9": { name: "杀手楼", callback: function (key, opt) { WG.go("杀手楼-大门"); }, },
                    },
                },
                "设置": { name: "设置", callback: function (key, opt) { $("span[command='setting']").click(); $(".footer-item[for='custom']").click(); }, },

            }
        });
        //设置界面

    });
})();
