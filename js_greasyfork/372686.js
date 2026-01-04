// ==UserScript==
// @name         门派战专用
// @namespace    cqv1
// @version      0.0.22.8集成3.2追捕+BOSS重复地名+自动技能挖矿
// @date         01/07/2018
// @modified     27/08/2018
// @homepage     https://greasyfork.org/zh-CN/scripts/371372
// @description  武神传说 MUD
// @author       fjcqv(源程序) & zhzhwcn(提供websocket监听)& knva(做了一些微小的贡献)
// @match        http://game.wsmud.com/*
// @run-at       document-start
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/372686/%E9%97%A8%E6%B4%BE%E6%88%98%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/372686/%E9%97%A8%E6%B4%BE%E6%88%98%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==
// 2018年9月1日10:08:31 优化师门任务
(function () {
    'use strict';
    Array.prototype.baoremove = function (dx) {
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        this.splice(dx, 1);
    }

    if (WebSocket) {
        console.log('插件可正常运行,Plugins can run normally');
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

                ws.send(text);
            },
            close: function () {
                ws.close();
            }
        };
    } else {
        console.log("插件不可运行,请打开'https://greasyfork.org/zh-CN/forum/discussion/41547/x',按照操作步骤进行操作,Plugins are not functioning properly.plase open https://greasyfork.org/zh-CN/forum/discussion/41547/x");
    }
    var roomItemSelectIndex = -1;
    var timer = 0;
    var cnt = 0;
    var ch;
    var xx =0;
    var getboss;
    var BOSS;
    var luj = new Array();
    var i =0;
    var zb_npc;
    var zb_place;
    var zidongjineng;
    var myTime = new Array();
    var xtime = new Array();
    var ktime = new Array();
    var mingzi = new Array();
    var xuel = new Array();
    var shuchul = new Array();
    var smitem;
    var next = 0;
    var myboss = new Array("东方不败","慕容博","丁春秋","谢逊","欧阳锋","黄药师","左全","邀月","涟星");/////////////////////////可杀boss
    var heimingdan = new Array("枯荣大师","张无忌","天山童姥","六大门派弟子");/////////////////////////不可碰
    var jnm = new Array("unarmed","blade","club","staff","sword","force","throwing","whip","dodge","parry","qiufengfuchen","jinshejianfa","xiaoyaoyou2","dagoubang2","xianglongzhang2","mingyugong","shedaoqigong","hengshanwushenjian","wuhuduanmendao","feixingshu");/////练习技能默认排序
    var jnph = 0
    var kuanggao = "mh3m250900b"; //矿镐id
    var roomData = [];
    var equip = {
        "铁镐": 0,
    };
    var npcs = {
        "店小二": 0
    };
    var place = {
        "住房": "jh fam 0 start;go west;go west;go north;go enter",
        "巨木旗": "go north;go west;go northwest;go north;go north;go north;go north;go west",
        "豪宅-花园": "jh fam 0 start;go west;go west;go north;go enter;go northeast",
        "豪宅-练功房": "jh fam 0 start;go west;go west;go north;go enter;go west",
        "扬州城-醉仙楼": "jh fam 0 start;go north;go north;go east",
        "扬州城-武庙": "jh fam 0 start;go north;go north;go west",
        "扬州城-钱庄": "jh fam 0 start;go north;go west",
        "扬州城-杂货铺": "jh fam 0 start;go east;go south",
        "扬州城-打铁铺": "jh fam 0 start;go east;go east;go south",
        "扬州城-药铺": "jh fam 0 start;go east;go east;go north",
        "扬州城-衙门正厅": "jh fam 0 start;go west;go north;go north",
        "扬州城-矿山": "jh fam 0 start;go west;go west;go west;go west",
        "扬州城-喜宴": "jh fam 0 start;go north;go north;go east;go up",
        "扬州城-擂台": "jh fam 0 start;go west;go south",
        "扬州城-当铺": "jh fam 0 start;go south;go east",
        "扬州城-帮派": "jh fam 0 start;go south;go south;go east",
        "扬州城-扬州武馆": "jh fam 0 start;go south;go south;go west",
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
        "襄阳城-广场": "jh fam 7 start",
        "武道塔": "jh fam 8 start",
        "仓库": "jh fam 0 start;go north;go west;store",
    };
    var role;
    var family = null;
    var wudao_pfm = "1";
    var ks_pfm = "2000";
    var automarry = null;
    var autoKsBoss = null;
    var go_lxjineng_auto = null;
    var showHP = null;

    //快捷键功能
    var KEY = {
        keys: [],
        roomItemSelectIndex: -1,
        init: function () {
            //添加快捷键说明
            $("span[command=stopstate] span:eq(0)").html("S");
            $("span[command=showcombat] span:eq(0)").html("A");
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

            $(document).on("keydown", this.e);

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
            this.add(188, function () {
                KEY.do_command("setting");
            });

            this.add(81, function () {
                WG.lianzhaoyi();
            });
            this.add(87, function () {
                WG.lianzhaoer();
            });
            this.add(69, function () {
                WG.kill_all();
            });
            this.add(70, function () {
                WG.liaoshang();
            });
            this.add(71, function () {
                WG.allStop();
            });
            this.add(82, function () {
                WG.get_all();
            });
            this.add(84, function () {
                WG.sell_all();
            });
            this.add(89, function () {
                WG.zdwk();
            });

            this.add(9, function () {
                KEY.onRoomItemSelect();
                return false;
            });

            //方向
            this.add(102, function () {
                WG.Send("go east");
                KEY.onChangeRoom();
            });
            this.add(39, function () {
                WG.Send("go east");
                KEY.onChangeRoom();
            });
            this.add(100, function () {
                WG.Send("go west");
                KEY.onChangeRoom();
            });
            this.add(37, function () {
                WG.Send("go west");
                KEY.onChangeRoom();
            });
            this.add(98, function () {
                WG.Send("go down");
                KEY.onChangeRoom();
            });
            this.add(40, function () {
                WG.Send("go south");
                KEY.onChangeRoom();
            });
            this.add(104, function () {
                WG.Send("go up");
                KEY.onChangeRoom();
            });
            this.add(38, function () {
                WG.Send("go north");
                KEY.onChangeRoom();
            });
            this.add(99, function () {
                WG.Send("go southeast");
                KEY.onChangeRoom();
            });
            this.add(97, function () {
                WG.Send("go southwest");
                KEY.onChangeRoom();
            });
            this.add(105, function () {
                WG.Send("go northeast");
                KEY.onChangeRoom();
            });
            this.add(103, function () {
                WG.Send("go northwest");
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
            if ($(".channel-box").is(":visible")) {
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
    function messageClear() {
        $(".WG_log pre").html("");
    }
   function jiluClear() {
        $(".content-message pre").html("");
       }
   function shuxing(name,xue)
    {
    this.name=name;
    this.xue=xue;
    }
    var log_line = 0;
    function messageAppend(m, t = 0) {
        100 < log_line && (log_line = 0, $(".WG_log pre").empty());
        var ap = m + "\n";
        if (t == 1) {
            ap = "<hiy>" + ap + "</hiy>";
        }
        if (t == 2) {
            ap = "<hig>" + ap + "</hig>";
        }
        if (t == 3) {
            ap = "<hiw>" + ap + "</hiw>";
        }
        $(".WG_log pre").append(ap);
        log_line++;
        $(".WG_log")[0].scrollTop = 99999;
    }
    var WG = {
            sm_state: -1,
            sm_item: null,
            init: function () {
            $("li[command=SelectRole]").on("click", function () {
                WG.login();
            });
                   },
        login: function () {
            role = $('.role-list .select').text().split(/[\s\n]/).pop();
            $(".bottom-bar").append("<span class='item-commands' style='display:none'><span WG='WG' cmd=''></span></span>"); //命令行模块
            var html = `
<div class='WG_log'><pre></pre></div>
<div>
<span class='zdy-item kill_all'>击杀(E))</span>
<span class='zdy-item get_all)'>拾取(R)</span>
<span class='zdy-item sell_all'>清包(T)</span>
<span class='zdy-item wuxingzhuang'>悟性装</span>
<span class='zdy-item zhandouzhuang'>战斗装</span>
<span class='zdy-item PKzhuang'>PK装</span>
<span class='zdy-item dachengzhuang'>打橙装</span>
<span class='zdy-item shanghaizhuang'>公会打橙装</span>
</div>
<div>
<span class='zdy-item zdwk'>挖矿(Y)</span>
<span class='zdy-item lianzhaoyi'>连招一(Q)</span>
<span class='zdy-item lianzhaoer'>连招二(W)</span>
<span class='zdy-item liaoshang'>疗伤(F)</span>
<span class='zdy-item allStop'>停(G)</span>
<span class='zdy-item tongJ'>伤害统计</span>
</div>
`;
            $(".content-message").after(html);
            var css = `.zdy-item{
display: inline-block;border: solid 1px gray;color: yellow;background-color: black;
text-align: center;cursor: pointer;border-radius: 0.25em;min-width: 1.5em;margin-right: 0.4em;
margin-left: 0.4em;position: relative;padding-left: 0.4em;padding-right: 0.4em;line-height: 1.5em;}
.WG_log{flex: 1;overflow-y: auto;border: 1px solid #404000;max-height: 12em;width: calc(100% - 40px);}
.WG_log > pre{margin: 0px; white-space: pre-line;}
`;
            GM_addStyle(css);
            npcs = GM_getValue("npcs", npcs);
            equip = GM_getValue(role + "_equip", equip);
            showHP = GM_getValue(role + "_showHP", showHP);
            ks_pfm = GM_getValue(role + "_ks_pfm", ks_pfm);
            if (family == null) {
                family = $('.role-list .select').text().substr(0, 2);
            }
            wudao_pfm = GM_getValue(role + "_wudao_pfm", wudao_pfm);
            $(".kill_all").on("click", WG.kill_all);
            $(".get_all").on("click", WG.get_all);
            $(".sell_all").on("click", WG.sell_all);
            $(".wuxingzhuang").on("click", WG.wuxingzhuang);
            $(".zhandouzhuang").on("click", WG.zhandouzhuang);
            $(".PKzhuang").on("click", WG.PKzhuang);
            $(".dachengzhuang").on("click", WG.dachengzhuang);
            $(".shanghaizhuang").on("click", WG.shanghaizhuang);
            $(".zdwk").on("click", WG.zdwk);
            $(".lianzhaoyi").on("click", WG.lianzhaoyi);
            $(".lianzhaoer").on("click", WG.lianzhaoer);
            $(".liaoshang").on("click", WG.liaoshang);
            $(".allStop").on("click", WG.allStop);
            $(".tongJ").on("click", WG.tongJ);
            setTimeout(() => {
                var logintext = '';
                if (WebSocket) {
                    if (npcs['店小二'] == 0) {
                        logintext = `
<hiy>欢迎${role},插件已加载！第一次使用,请在设置中,初始化ID,并且设置一下是否自动婚宴,自动传送boss
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
<hiy>欢迎${role},插件已加载！第一次使用,请在设置中,初始化ID,当前浏览器不支持自动喜宴自动boss,请使用火狐浏览器
插件版本: ${GM_info.script.version}
</hiy>`;
                }
                messageAppend(logintext);
                KEY.do_command("showtool");
                KEY.do_command("pack");

                KEY.do_command("pack");
                KEY.do_command("showcombat");
            }, 1000);
        },
        updete_goods_id: function () {
            var lists = $(".dialog-list > .obj-list:first");
            var id;
            var name;
            if (lists.length) {
                messageAppend("检测到商品清单");
                for (var a of lists.children()) {
                    a = $(a);
                    id = a.attr("obj");
                    name = $(a.children()[0]).html();
                    goods[name].id = id;
                    messageAppend(name + ":" + id);
                }
                GM_setValue("goods", goods);
                return true;
            } else {
                messageAppend("未检测到商品清单");
                return false;
            }
        },
        updete_npc_id: function () {
            var lists = $(".room_items .room-item");

            for (var npc of lists) {
                if (npc.lastElementChild.lastElementChild == null) {
                    npcs[npc.lastElementChild.innerText] = $(npc).attr("itemid");
                    messageAppend(npc.lastElementChild.innerText + " 的ID:" + $(npc).attr("itemid"));
                }
            }
            GM_setValue("npcs", npcs);
        },
        updete_id_all: function () {
            var t = [];
            Object.keys(goods).forEach(function (key) {
                if (t[goods[key].place] == undefined)
                    t[goods[key].place] = goods[key].sales;
            });

            var keys = Object.keys(t);
            var i = 0;
            var state = 0;
            var place, sales;
            //获取
            var timer = setInterval(() => {
                switch (state) {
                    case 0:
                        if (i >= keys.length) {
                            messageAppend("初始化完成");
                            WG.go("武当派-广场");
                            clearInterval(timer);
                            return;
                        }
                        place = keys[i];
                        sales = t[place];
                        WG.go(place);
                        state = 1;
                        break;
                    case 1:
                        WG.updete_npc_id();
                        var id = npcs[sales];
                        WG.Send("list " + id);
                        state = 2;
                        break;
                    case 2:
                        if (WG.updete_goods_id()) {
                            state = 0;
                            i++;
                        } else
                            state = 1;
                        break;
                }
            }, 1000);
        },
        Send: function (cmd) {
            if (cmd) {
                cmd = cmd.split(";");
                for (var c of cmd) {
                    $("span[WG='WG']").attr("cmd", c).click();
                };
            }
        },
        go: function (p) {
            if (WG.at(p)) return;
            if (place[p] != undefined) WG.Send(place[p]);
        },
        at: function (p) {
            var w = $(".room-name").html();
            return w.indexOf(p) == -1 ? false : true;
        },
        eq: function (e) {
            WG.Send("eq " + equip[e]);
        },
        tongJ: function() {
            jiluClear();
            messageAppend("伤害统计开始");
            clearTimeout(ktime[2]);
            var mingZ = new Array();
            mingzi=[];
            xx =0;
            shuchul=[];
            $(".room_items .room-item").each(function(){
                mingZ = $(this).text().split(' ');
                mingzi[xx] = mingZ[mingZ.length-1].substr(0,2);
                xuel[xx] = $(this).find(".progress-bar:first").attr("max");
                xx++;
            });
            ktime[2]=setTimeout(WG.tongJ2,5000);
            var renshu;
            if(mingzi.length<6){ renshu =mingzi.length}
            else{renshu=6; }
            for(xx =1;xx<renshu;xx++){ shuchul[xx]=0;}
        },
        tongJ2: function() {
            clearTimeout(ktime[2]);
            var ming = $(".content-message pre").text();
            var renshu;
            if(mingzi.length<6){ renshu =mingzi.length}
            else{renshu=6; }
            jiluClear();
            var tongji ="";
            for(xx =1;xx<renshu;xx++){
                if(mingzi[xx].length==2){
                    var xxx ='(';
                    xxx = xxx.concat(mingzi[xx])
                    var shuz = ming.split(xxx);
                    for(var tt=0;tt<shuz.length-1;tt++){
                        shuz[tt]=shuz[tt].substr(-15);
                        var score=new Array();
                        score[tt]=parseInt(shuz[tt].substr(shuz[tt].indexOf("造成")+2));///,shuz[tt].indexOf("点伤")-shuz[tt].indexOf("造成")-2));
                        shuchul[xx]+=score[tt];
                    }
                    var sum = (shuchul[xx]*100)/xuel[xx];
                    sum = sum.toFixed(1);
                    var shu = shuchul[xx]/10000;
                    shu = shu.toFixed(1);
                    tongji = tongji.concat(mingzi[xx]);
                    tongji = tongji.concat(":");
                    tongji = tongji.concat(shu);
                    tongji = tongji.concat("W;");
                    tongji = tongji.concat(sum);
                    tongji = tongji.concat("% ");
                }}
            messageAppend(tongji);
            ktime[2]=setTimeout(WG.tongJ2,5000);
    },
         zdwk: function () {
            WG.Send("stopstate");
            WG.go("扬州城-矿山");
            WG.Send("eq "+kuanggao+";wa");
        },
         sell_all: function () {
            WG.go("扬州城-打铁铺");
            WG.Send("sell all");
        },
        liaoshang: function () {
            WG.Send("stopstate");
            WG.go("扬州城-武庙");
            WG.Send("liaoshang");
		},
        wuxingzhuang:function () {
            WG.Send("stopstate;eq f5sz28e93a6;eq b12728f4920;eq krm628ca61f;eq uebp28e93a7;eq req82bb0783;eq qlr021345f0;eq 1k8a2b430d9")///////狂风刀8i3w245d317
             },
        zhandouzhuang:function () {
            WG.Send("stopstate;eq zzs72920206;eq 8gvp291f966;eq ps5d2456669;eq dzz523f3f88;eq xluw2887068;eq lt652b57479;eq totp2816ae0;eq 9mqp26da802;enable parry hengshanwushenjian;enable sword jinshejianfa")
             },
        PKzhuang:function () {
            WG.Send("stopstate;eq zzs72920206;eq 8gvp291f966;eq ps5d2456669;eq dzz523f3f88;eq xluw2887068;eq lt652b57479;eq 7itt2b81753;eq 9mqp26da802;enable parry yihuajiemu;enable sword jinshejianfa")
             },
        dachengzhuang:function () {
            WG.Send("stopstate;eq zzs72920206;eq 8gvp291f966;eq f5sz28e93a6;eq dzz523f3f88;eq xluw2887068;eq lt652b57479;eq 2we92ddceab;eq 9mqp26da802;enable parry hengshanwushenjian;enable sword jinshejianfa")
             },
        shanghaizhuang:function () {
            WG.Send("stopstate;eq zzs72920206;eq 8gvp291f966;eq f5sz28e93a6;eq dzz523f3f88;eq xluw2887068;eq lt652b57479;eq 2we92ddceab;eq 9mqp26da802;enable parry yihuajiemu;enable sword jinshejianfa")
             },
        lianzhaoer: function () {
            clearTimeout(xtime[5]);
            WG.Send("perform force.power;perform force.wang;perform dodge.lingbo;perform parry.wu;perform parry.yi;perform club.chan;perform blade.chan;perform sword.duo;perform throwing.jiangg");
            xtime[5] = setTimeout(function(){ WG.Send("perform sword.wu;perform throwing.jiang");},1500);
        },
        lianzhaoyi: function () {
            clearTimeout(xtime[5]);
            WG.Send("perform force.power;perform force.wang;perform dodge.lingbo;perform parry.wu;perform unarmed.qi;perform club.chan;perform blade.chan;perform sword.duo;perform sword.wu;perform throwing.jiang;perform parry.yi;perform club.wu;perform unarmed.shiba");
            xtime[5] = setTimeout(function(){ WG.Send("perform club.chan;perform club.wu;perform throwing.jiang");},6000)
        },
        kill_all: function () {
            WG.allStop();
            WG.tongJ();
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
            for(xx in heimingdan){
                if (npc.innerText.indexOf(heimingdan[xx]) != -1) {
                    $(npc).attr("itemid","");
            }}}
            for (var npcc of lists) {
                WG.Send("kill " + $(npcc).attr("itemid"));
            }
        },
        get_all: function () {
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                WG.Send("get all from " + $(npc).attr("itemid"));
            }
        },
        allStop: function () {
            for(xx in xtime){clearTimeout(xtime[xx])}
            for(xx in ktime){clearTimeout(ktime[xx])}
            for(xx in myTime){clearTimeout(myTime[xx])}
            messageAppend("已重置所有计时器");
        },
        fbnum: 0,
        needGrove: 0,
        oncegrove: function () {
            this.fbnum += 1;
            messageAppend("第" + this.fbnum + "次");
            WG.Send("cr yz/lw/shangu;cr over");
            if (this.needGrove == this.fbnum) {
                messageAppend("<hiy>" + this.fbnum + "次副本小树林秒进秒退已完成</hiy>");
                this.timer_close();
            }
        },
        grove_ask_info: function () {
            return prompt("请输入需要秒进秒退的副本次数", "");
        },
        grove_auto: function () {
            if (timer == 0) {
                this.needGrove = this.grove_ask_info();
                if (this.needGrove) //如果返回的有内容
                {
                    if (parseFloat(this.needGrove).toString() == "NaN") {
                        messageAppend("请输入数字");
                        return;
                    }
                    messageAppend("开始秒进秒退小树林" + this.needGrove + "次");

                    timer = setInterval(() => {
                        this.oncegrove()
                    }, 1000);
                }
            }

        },
        showhideborad: function () {
            if ($('.WG_log').css('display') == 'none') {
                $('.WG_log').show();
            } else {
                $('.WG_log').hide();
            }

        },
        calc: function () {
            messageClear();
            var html = `
<div>
<label>潜能计算器</label>
<input type="number" id="c" placeholder="初始等级" style="width:30%" class="mui-input-speech"><br/>
<input type="number" id="m" placeholder="目标等级" style="width:30%"><br/>
<select id="se" style="width:30%">
<option value='0'>选择技能颜色</option>
<option value='1' style="color: #c0c0c0;">白色</option>
<option value='2' style="color:#00ff00;">绿色</option>
<option value='3' style="color:#00ffff;">蓝色</option>
<option value='4' style="color:#ffff00;">黄色</option>
<option value='5' style="color:#912cee;">紫色</option>
<option value='6' style="color: #ffa600;">橙色</option>
</select><br/>
<input type="button" value="计算" style="width:30%"  id="qnjs"><br/>

<label>开花计算器</label>
<input type="number" id="nl" placeholder="当前内力" style="width:30%" class="mui-input-speech"><br/>
<input type="number" id="xg" placeholder="先天根骨" style="width:30%"><br/>
<input type="number" id="hg" placeholder="后天根骨" style="width:30%"><br/>
<input type="button" value="计算" id = "kaihua" style="width:30%" class="mui-btn mui-btn-danger mui-btn-outlined"><br/>
<label>人花分值：5000  地花分值：6500  天花分值：8000</label>

</div>`;
            messageAppend(html);
            $("#qnjs").on('click', function () {
                messageAppend("需要潜能:" + Helper.dian(Number($("#c").val()), Number($("#m").val()), Number($("#se").val())));
            });
            $("#kaihua").on('click', function () {
                messageAppend("你的分值:" + Helper.gen(Number($("#nl").val()), Number($("#xg").val()), Number($("#hg").val())));
            });
        },
        setting: function () {
            messageClear();
            var a = `<div style='text-align:right;width:280px'>
            <a target="_blank"  href="https://github.com/knva/wsmud_plugins">https://github.com/knva/wsmud_plugins</a>
<span>
<label for="family">门派选择：</label><select style='width:80px' id="family">
<option value="武当">武当</option>
<option value="华山">华山</option>
<option value="少林">少林</option>
<option value="峨眉">峨眉</option>
<option value="逍遥">逍遥</option>
<option value="丐帮">丐帮</option>
</select>
</span>
<span><label for="show_hp">全局显血： </label><select style='width:80px' id = "show_hp">
<option value="已停止">已停止</option>
<option value="已开启">已开启</option>
</select>
</span>
<div class="item-commands"><span class="updete_id_all">初始化ID</span></div></div>
`;
            messageAppend(a);
            $('#show_hp').val(showHP);
            $('#show_hp').change(function () {
                showHP = $('#show_hp').val();
                GM_setValue(role + "_showHP", showHP);
                Helper.showallhp();
            });

            $(".updete_id_all").on("click", WG.updete_id_all);
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
        showhp(id) {
            let re = '';
            for (let i = 0; i < roomData.length; i++) {
                if (roomData[i] != 0) {
                    if (roomData[i].id == id) {
                        re = "角色名:" + roomData[i].name + "\n";
                        re += "血量:" + roomData[i].hp + "/" + roomData[i].max_hp + "\n";
                        re += "蓝量:" + roomData[i].mp + "/" + roomData[i].max_mp;
                        return re;
                    }
                }
            }
            return '';
        },
        saveRoomstate(data) {
            roomData = data.items;
        },
        showallhp() {
            var myshow = GM_getValue(role + "_showHP", showHP);
            if (myshow == "已开启") {
                roomData.forEach(function (v, k) {
                    if (v != 0) {
                        if (v.hp) {
                            $(".item-plushp[itemid=" + v.id + "]").remove();
                            $("[itemid=" + v.id + "] .item-status").after("<span class='item-plushp' itemid='"+v.id+"'></span>").next();
                            $(".item-plushp[itemid=" + v.id + "]").html("<hig>hp:" + v.hp + "(" + Math.floor(v.hp / v.max_hp * 100) + "%)</hig>");
                        }
                    }
                });
            } else if (myshow == "已停止") {
                $(".plushp").remove();

            }
        },
        };
    $(document).ready(function () {
        $('head').append('<link href="https://s1.pstatp.com/cdn/expire-1-y/jquery-contextmenu/2.6.3/jquery.contextMenu.min.css" rel="stylesheet">');
        KEY.init();
        WG.init();
        WG.add_hook("items", function (data) {
            Helper.saveRoomstate(data);
            Helper.showallhp();
        });
        WG.add_hook("sc", function (data) {
            if ("hp" in data) {
                roomData.forEach(function (v, k) {
                    if (v.id == data.id) {
                        v.hp = data.hp;
                    }
                });
                Helper.showallhp();
            }
        });
        WG.add_hook("itemadd", function (data) {
            roomData.push(data);
            Helper.showallhp();
        });
        WG.add_hook("itemremove", function (data) {
            roomData.forEach(function (v, k) {
                if (v.id == data.id) {
                    $(".plushp[itemid=" + v.id + "]").remove();
                    roomData.splice(k, 1);
                }
            });
            Helper.showallhp();
        });
        $.contextMenu({
            selector: '.container',
            items: {
                "关闭自动": {
                    name: "关闭自动",
                    visible: function (key, opt) {
                        return timer != 0;
                    },
                    callback: function (key, opt) {
                        WG.timer_close();
                    },
                },
                "自动": {
                    name: "自动",
                    visible: function (key, opt) {
                        return timer == 0;
                    },
                    "items": {
                        "自动小树林": {
                            name: "自动小树林",
                            callback: function (key, opt) {
                                WG.grove_auto();
                            }
                        }
                    },
                },
                "快捷传送": {
                    name: "常用地点",
                    "items": {
                        "mp0": {
                            name: "豪宅",
                            callback: function (key, opt) {
                                WG.go("住房");
                            },
                        },
                        "mp1": {
                            name: "当铺",
                            callback: function (key, opt) {
                                WG.go("扬州城-当铺");
                            },
                        },
                        "mp2": {
                            name: "擂台",
                            callback: function (key, opt) {
                                WG.go("扬州城-擂台");
                            },
                        },
                        "mp3": {
                               name: "帮派",
                               callback: function (key, opt) {
                                WG.go("扬州城-帮派");
                            },
                        },
                        "mp4": {
                            name: "武道",
                            callback: function (key, opt) {
                                WG.go("武道塔");
                            },
                        },
                        "mp5": {
                            name: "矿山",
                            callback: function (key, opt) {
                                WG.go("扬州城-矿山");
                            },
                        },
                        "mp6": {
                            name: "药铺",
                            callback: function (key, opt) {
                                WG.go("扬州城-药铺");
                            },
                        }
                    },
                },
                "门派传送": {
                    name: "门派传送",
                    "items": {
                        "mp0": {
                            name: "武当",
                            callback: function (key, opt) {
                                WG.go("武当派-林间小径");
                            },
                        },
                        "mp1": {
                            name: "少林",
                            callback: function (key, opt) {
                                WG.go("少林派-后殿");
                            },
                        },
                        "mp2": {
                            name: "华山",
                            callback: function (key, opt) {
                                WG.go("华山派-玉女峰");
                            },
                        },
                        "mp3": {
                            name: "峨眉",
                            callback: function (key, opt) {
                                WG.go("峨眉派-走廊");
                            },
                        },
                        "mp4": {
                            name: "逍遥",
                            callback: function (key, opt) {
                                WG.go("逍遥派-青草坪");
                            },
                        },
                        "mp5": {
                            name: "丐帮",
                            callback: function (key, opt) {
                                WG.go("丐帮-树洞内部");
                            },
                        },
                        "mp6": {
                            name: "襄阳",
                            callback: function (key, opt) {
                                WG.go("襄阳城-广场");
                            },
                        }
                    },
                },
                "打开仓库": {
                    name: "打开仓库",
                    callback: function (key, opt) {
                        WG.go("仓库");
                    },
                },
                "更新ID": {
                    name: "更新ID",
                    callback: function (key, opt) {
                        WG.updete_goods_id();
                        WG.updete_npc_id();
                    },
                },
                "调试BOSS": {
                    name: "调试BOSS",
                    visible: false,
                    callback: function (key, opt) {
                        Helper.kksBoss({
                            "content": "听说殇月出现在逍遥派-林间小道一带。"
                        });
                    },
                },
                "设置": {
                    name: "设置",
                    callback: function (key, opt) {
                        WG.setting();
                    },
                },
                "打开面板": {
                    name: "打开面板",
                    visible: function (key, opt) {
                        return $('.WG_log').css('display') == 'none';
                    },
                    callback: function (key, opt) {
                        WG.showhideborad();
                    },
                },
                "关闭面板": {
                    name: "关闭面板",
                    visible: function (key, opt) {
                        return $('.WG_log').css('display') != 'none';
                    },
                    callback: function (key, opt) {
                        WG.showhideborad();
                    },
                }
            }
        });
    });
})();