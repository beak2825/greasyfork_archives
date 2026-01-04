// ==UserScript==
// @name         wsmud
// @namespace    cqv1
// @version      0.0.25.57
// @date         01/07/2018
// @modified     27/08/2018
// @homepage     https://greasyfork.org/zh-CN/scripts/372747
// @description  武神传说 MUD
// @author       fjcqv(源程序)
// @match        http://game.wsmud.com/*
// @run-at       document-start
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/372747/wsmud.user.js
// @updateURL https://update.greasyfork.org/scripts/372747/wsmud.meta.js
// ==/UserScript==
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
    var my = {};
    var timer = 0;
    var cnt = 0;
    var mima=null;
    var zb_npc;
    var zb_place;
    var next = 0;
    var cmds = [];
    var cmder = '旋风镖';
    var mp_kg = false,mp_kg1 = false,auto_kill = true;
    var bao = [],bao_kg = false;
    var roomData = [];
    var needfind = {
        "武当派-林间小径": [116],
        "峨眉派-走廊": [410,411,414],
        "丐帮-暗道": [604,607,608],
        "逍遥派-林间小道": [506,510,508],
        "少林派-竹林": [218],
        "逍遥派-地下石室": [513],
        "逍遥派-木屋": [511]
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
        }
    };
    var my_wq = 0
    var npcs = {
        "店小二": 0
    };
    var sm_loser = null;
    var jn_wxk= null;
    var place = {
        "住房": "jh fam 0 start;go west;go west;go north;go enter;go west",
        "仓库": "jh fam 0 start;go north;go west;store",
        "扬州城-武庙": "jh fam 0 start;go north;go north;go west",
        "扬州城-醉仙楼": "jh fam 0 start;go north;go north;go east",
        "扬州城-杂货铺": "jh fam 0 start;go east;go south",
        "扬州城-打铁铺": "jh fam 0 start;go east;go east;go south",
        "扬州城-药铺": "jh fam 0 start;go east;go east;go north",
        "扬州城-衙门正厅": "jh fam 0 start;go west;go north;go north",
        "扬州城-矿山": "jh fam 0 start;go west;go west;go west;go west",
        "扬州城-喜宴": "jh fam 0 start;go north;go north;go east;go up",
        "扬州城-擂台": "jh fam 0 start;go west;go south",
        "扬州城-当铺": "jh fam 0 start;go south;go east",
        "扬州城-帮派": "jh fam 0 start;go south;go south;go east",
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
        "武当派-林间小径": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north;go north;go north",
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
        "少林派-竹林": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go north;go north",
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
        "逍遥派-地下石室": "jh fam 5 start;go down;go down",
        "丐帮-树洞内部": "jh fam 6 start",
        "丐帮-树洞下": "jh fam 6 start;go down",
        "丐帮-暗道": "jh fam 6 start;go down;go east",
        "丐帮-破庙密室": "jh fam 6 start;go down;go east;go east;go east",
        "丐帮-土地庙": "jh fam 6 start;go down;go east;go east;go east;go up",
        "丐帮-林间小屋": "jh fam 6 start;go down;go east;go east;go east;go east;go east;go up",
        "襄阳城-广场": "jh fam 8 start",
        "武道塔": "jh fam 9 start"
    };
    var role;
    var my_id=null;
    var family = null;
    var fb_x = null;
    var wudao_pfm = "1";
    var ks_pfm = "2000";
    var automarry = null;
    var autoKsBoss = null;
    var showHP = null;
    var eqlist = {
        1: [],
        2: [],
        3: []
    };
    var map ={
        "1": {
            "name": "扬州城-广场",
            "path": "yz/guangchang",
            "exits": {
                "go east": 10,
                "go south": 20,
                "go west": 34,
                "go north": 2
            }
        },
        "2": {
            "name": "扬州城-北大街",
            "path": "yz/beidajie1",
            "exits": {
                "go east": 4,
                "go south": 1,
                "go west": 3,
                "go north": 5
            }
        },
        "3": {
            "name": "扬州城-钱庄",
            "path": "yz/qianzhuang",
            "exits": {
                "go east": 2
            }
        },
        "4": {
            "name": "扬州城-有间客栈",
            "path": "yz/kedian",
            "exits": {
                "go west": 2
            }
        },
        "5": {
            "name": "扬州城-北大街",
            "path": "yz/beidajie2",
            "exits": {
                "go north": 8,
                "go west": 6,
                "go south": 2,
                "go east": 7
            }
        },
        "6": {
            "name": "扬州城-武庙",
            "path": "yz/wumiao",
            "exits": {
                "go east": 5
            }
        },
        "7": {
            "name": "扬州城-醉仙楼",
            "path": "yz/zuixianlou",
            "exits": {
                "go west": 5
            }
        },
        "8": {
            "name": "扬州城-北门",
            "path": "yz/beimen",
            "exits": {
                "go south": 5
            }
        },
        "9": {
            "exits": {
                "go south": 8
            },
            "name": "扬州城-江边",
            "path": "yz/hanshui"
        },
        "10": {
            "exits": {
                "go east": 14,
                "go south": 12,
                "go west": 1,
                "go north": 11
            },
            "name": "扬州城-东大街",
            "path": "yz/dongdajie1"
        },
        "11": {
            "exits": {
                "go south": 10
            },
            "name": "扬州城-书院",
            "path": "yz/shuyuan"
        },
        "12": {
            "exits": {
                "go north": 10,
                "go up": 13
            },
            "name": "扬州城-杂货铺",
            "path": "yz/zahuopu"
        },
        "13": {
            "exits": {
                "go down": 12
            },
            "name": "扬州城-成衣店",
            "path": "yz/garments"
        },
        "14": {
            "exits": {
                "go east": 18,
                "go south": 17,
                "go west": 10,
                "go north": 15
            },
            "name": "扬州城-东大街",
            "path": "yz/dongdajie2"
        },
        "15": {
            "exits": {
                "go south": 14,
                "go north": 16
            },
            "name": "扬州城-药铺",
            "path": "yz/yaopu"
        },
        "16": {
            "exits": {
                "go south": 15
            },
            "name": "扬州城-内室",
            "path": "yz/neishi"
        },
        "17": {
            "exits": {
                "go north": 14
            },
            "name": "扬州城-打铁铺",
            "path": "yz/datiepu"
        },
        "18": {
            "exits": {
                "go south": 19,
                "go west": 14
            },
            "name": "扬州城-东门",
            "path": "yz/dongmen"
        },
        "19": {
            "exits": {
                "go north": 18
            },
            "name": "扬州城-药林",
            "path": "yz/yaolin"
        },
        "20": {
            "exits": {
                "go east": 21,
                "go south": 23,
                "go west": 22,
                "go north": 1
            },
            "name": "扬州城-南大街",
            "path": "yz/nandajie1"
        },
        "21": {
            "exits": {
                "go west": 20
            },
            "name": "扬州城-当铺",
            "path": "yz/dangpu"
        },
        "22": {
            "exits": {
                "go east": 20
            },
            "name": "扬州城-赌场",
            "path": "yz/duchang"
        },
        "23": {
            "exits": {
                "go east": 24,
                "go south": 31,
                "go west": 33,
                "go north": 20
            },
            "name": "扬州城-南大街",
            "path": "yz/nandajie2"
        },
        "24": {
            "exits": {
                "go west": 23,
                "go east": 25
            },
            "name": "扬州城-帮派驻地",
            "path": "yz/banghui"
        },
        "25": {
            "exits": {
                "go west": 24,
                "go east": 26
            },
            "name": "帮会-大门",
            "path": "banghui/damen"
        },
        "26": {
            "exits": {
                "go west": 25,
                "go east": 29,
                "go south": 28,
                "go north": 27
            },
            "name": "帮会-大院",
            "path": "banghui/yuanzi"
        },
        "27": {
            "exits": {
                "go south": 26
            },
            "name": "帮会-练功房",
            "path": "banghui/liangong"
        },
        "28": {
            "exits": {
                "go north": 26
            },
            "name": "帮会-炼药房",
            "path": "banghui/lianyao"
        },
        "29": {
            "exits": {
                "go west": 26,
                "go north": 30
            },
            "name": "帮会-聚义堂",
            "path": "banghui/juyitang"
        },
        "30": {
            "exits": {
                "go south": 29
            },
            "name": "帮会-仓库",
            "path": "banghui/cangku"
        },
        "31": {
            "exits": {
                "go west": 32,
                "go north": 23
            },
            "name": "扬州城-南门",
            "path": "yz/nanmen"
        },
        "32": {
            "exits": {
                "go east": 31
            },
            "name": "扬州城-谷物加工厂",
            "path": "yz/work"
        },
        "33": {
            "exits": {
                "go east": 23
            },
            "name": "扬州城-扬州武馆",
            "path": "yz/wuguan"
        },
        "34": {
            "exits": {
                "go west": 38,
                "go north": 35,
                "go south": 37,
                "go east": 1
            },
            "name": "扬州城-西大街",
            "path": "yz/xidajie1"
        },
        "35": {
            "exits": {
                "go south": 34,
                "go north": 36
            },
            "name": "扬州城-衙门大门",
            "path": "yz/yamen"
        },
        "36": {
            "exits": {
                "go south": 35
            },
            "name": "扬州城-衙门正厅",
            "path": "yz/ymzhengting"
        },
        "37": {
            "exits": {
                "go north": 34
            },
            "name": "擂台-擂台",
            "path": "yz/leitai/ltx"
        },
        "38": {
            "exits": {
                "go east": 34,
                "go south": 45,
                "go west": 47,
                "go north": 39
            },
            "name": "扬州城-西大街",
            "path": "yz/xidajie2"
        },
        "39": {
            "exits": {
                "go south": 38,
                "go enter": 40
            },
            "name": "扬州城-大门",
            "path": "yz/home"
        },
        "40": {
            "exits": {
                "go out": 39,
                "go west": 41,
                "go north": 42,
                "go east": 44,
                "go northeast": 43
            },
            "name": "住房-院子",
            "path": "home/yuanzi"
        },
        "41": {
            "exits": {
                "go east": 40
            },
            "name": "住房-练功房",
            "path": "home/liangong"
        },
        "42": {
            "exits": {
                "go south": 40
            },
            "name": "住房-卧室",
            "path": "home/woshi"
        },
        "43": {
            "exits": {
                "go southwest": 40
            },
            "name": "住房-小花园",
            "path": "home/huayuan"
        },
        "44": {
            "exits": {
                "go west": 40
            },
            "name": "住房-炼药房",
            "path": "home/lianyao"
        },
        "45": {
            "exits": {
                "go south": 46,
                "go north": 38
            },
            "name": "扬州城-福威镖局",
            "path": "yz/biaoju"
        },
        "46": {
            "exits": {
                "go north": 45
            },
            "name": "扬州城-镖局正厅",
            "path": "yz/zhengting"
        },
        "47": {
            "exits": {
                "go east": 38,
                "go west": 48
            },
            "name": "扬州城-西门",
            "path": "yz/ximen"
        },
        "48": {
            "exits": {
                "go east": 47
            },
            "name": "扬州城-矿山",
            "path": "yz/kuang"
        },
        "101": {
            "exits": {
                "go north": 102,
                "go west": 103
            },
            "name": "武当派-广场",
            "path": "wd/guangchang"
        },
        "102": {
            "exits": {
                "go south": 101
            },
            "name": "武当派-三清殿",
            "path": "wd/sanqing"
        },
        "103": {
            "exits": {
                "go northup": 105,
                "go east": 101,
                "go west": 104
            },
            "name": "武当派-石阶",
            "path": "wd/shijie1"
        },
        "104": {
            "exits": {
                "go east": 103
            },
            "name": "武当派-练功房",
            "path": "wd/liangong"
        },
        "105": {
            "exits": {
                "go southdown": 103,
                "go north": 106
            },
            "name": "武当派-太子岩",
            "path": "wd/taiziyan"
        },
        "106": {
            "exits": {
                "go south": 105,
                "go east": 107,
                "go west": 108
            },
            "name": "武当派-桃园小路",
            "path": "wd/tylu"
        },
        "107": {
            "exits": {
                "go west": 106
            },
            "name": "武当派-舍身崖",
            "path": "wd/sheshen"
        },
        "108": {
            "exits": {
                "go east": 106,
                "go northup": 109
            },
            "name": "武当派-南岩峰",
            "path": "wd/nanyan"
        },
        "109": {
            "exits": {
                "go southdown": 108,
                "go northup": 110
            },
            "name": "武当派-乌鸦岭",
            "path": "wd/wuya"
        },
        "110": {
            "exits": {
                "go southdown": 109,
                "go northup": 111
            },
            "name": "武当派-五老峰",
            "path": "wd/wulao"
        },
        "111": {
            "exits": {
                "go southdown": 110,
                "go north": 112
            },
            "name": "武当派-虎头岩",
            "path": "wd/hutou"
        },
        "112": {
            "exits": {
                "go south": 111,
                "go north": 113
            },
            "name": "武当派-朝天宫",
            "path": "wd/chaotian"
        },
        "113": {
            "exits": {
                "go south": 112,
                "go north": 114
            },
            "name": "武当派-三天门",
            "path": "wd/santian"
        },
        "114": {
            "exits": {
                "go south": 113,
                "go north": 115
            },
            "name": "武当派-紫金城",
            "path": "wd/zijin"
        },
        "115": {
            "exits": {
                "go south": 114,
                "go north": 116
            },
            "name": "武当派-林间小径",
            "path": "wd/xiaolu"
        },
        "116": {
            "exits": {
                "go south": 115,
                "go north": 117
            },
            "name": "武当派-林间小径",
            "path": "wd/xiaolu2"
        },
        "117": {
            "exits": {
                "go south": 116
            },
            "name": "武当派-后山小院",
            "path": "wd/xiaoyuan"
        },
        "201": {
            "exits": {
                "go north": 202
            },
            "name": "少林派-广场",
            "path": "shaolin/guangchang"
        },
        "202": {
            "exits": {
                "go north": 205,
                "go south": 201,
                "go west": 204,
                "go east": 203
            },
            "name": "少林派-山门殿",
            "path": "shaolin/shanmen"
        },
        "203": {
            "exits": {
                "go west": 202
            },
            "name": "少林派-东侧殿",
            "path": "shaolin/liangong1"
        },
        "204": {
            "exits": {
                "go east": 202
            },
            "name": "少林派-西侧殿",
            "path": "shaolin/liangong2"
        },
        "205": {
            "exits": {
                "go south": 202,
                "go northwest": 208,
                "go northeast": 206,
                "go northup": 207
            },
            "name": "少林派-天王殿",
            "path": "shaolin/twdian"
        },
        "206": {
            "exits": {
                "go southwest": 205,
                "go northwest": 209
            },
            "name": "少林派-钟楼",
            "path": "shaolin/zhonglou"
        },
        "207": {
            "exits": {
                "go southdown": 205
            },
            "name": "少林派-大雄宝殿",
            "path": "shaolin/daxiong"
        },
        "208": {
            "exits": {
                "go southeast": 205,
                "go northeast": 209
            },
            "name": "少林派-鼓楼",
            "path": "shaolin/gulou"
        },
        "209": {
            "exits": {
                "go southeast": 206,
                "go southwest": 208,
                "go north": 210
            },
            "name": "少林派-后殿",
            "path": "shaolin/houdian"
        },
        "210": {
            "exits": {
                "go south": 209,
                "go north": 213,
                "go west": 212,
                "go east": 211
            },
            "name": "少林派-练武场",
            "path": "shaolin/lianwu"
        },
        "211": {
            "exits": {
                "go west": 210
            },
            "name": "少林派-罗汉堂",
            "path": "shaolin/luohan"
        },
        "212": {
            "exits": {
                "go east": 210
            },
            "name": "少林派-般若堂",
            "path": "shaolin/banruo"
        },
        "213": {
            "exits": {
                "go south": 210,
                "go east": 214,
                "go west": 215,
                "go north": 216
            },
            "name": "少林派-方丈楼",
            "path": "shaolin/fangzhang"
        },
        "214": {
            "exits": {
                "go west": 213
            },
            "name": "少林派-戒律院",
            "path": "shaolin/jielv"
        },
        "215": {
            "exits": {
                "go east": 213
            },
            "name": "少林派-达摩院",
            "path": "shaolin/damo"
        },
        "216": {
            "exits": {
                "go south": 213,
                "go west": 217,
                "go north": 218
            },
            "name": "少林派-竹林",
            "path": "shaolin/zhulin1"
        },
        "217": {
            "exits": {
                "go east": 216
            },
            "name": "少林派-藏经阁",
            "path": "shaolin/cangjing"
        },
        "218": {
            "exits": {
                "go south": 216,
                "go north": 219
            },
            "name": "少林派-竹林",
            "path": "shaolin/zhulin2"
        },
        "219": {
            "exits": {
                "go south": 218
            },
            "name": "少林派-达摩洞",
            "path": "shaolin/damodong"
        },
        "301": {
            "exits": {
                "go eastup": 302,
                "go westup": 308
            },
            "name": "华山派-镇岳宫",
            "path": "huashan/zhenyue"
        },
        "302": {
            "exits": {
                "go southup": 303,
                "go eastdown": 301
            },
            "name": "华山派-苍龙岭",
            "path": "huashan/canglong"
        },
        "303": {
            "exits": {
                "go eastdown": 301,
                "jumpdown": 304
            },
            "name": "华山派-舍身崖",
            "path": "huashan/sheshen"
        },
        "304": {
            "exits": {
                "go up": 303,
                "go southup": 305
            },
            "name": "华山派-峭壁",
            "path": "huashan/qiaobi"
        },
        "305": {
            "exits": {
                "go northdown": 304,
                "go south": 306
            },
            "name": "华山派-山谷",
            "path": "huashan/shangu"
        },
        "306": {
            "exits": {
                "go north": 305,
                "go east": 307
            },
            "name": "华山派-山间平地",
            "path": "huashan/pingdi"
        },
        "307": {
            "exits": {
                "go west": 306
            },
            "name": "华山派-林间小屋",
            "path": "huashan/xiaowu"
        },
        "308": {
            "exits": {
                "go eastdown": 301,
                "go west": 314,
                "go south": 315,
                "go north": 309
            },
            "name": "华山派-玉女峰",
            "path": "huashan/yunv"
        },
        "309": {
            "exits": {
                "go south": 308,
                "go north": 311,
                "go east": 310
            },
            "name": "华山派-练武场",
            "path": "huashan/lianwu"
        },
        "310": {
            "exits": {
                "go west": 309
            },
            "name": "华山派-练功房",
            "path": "huashan/liangong"
        },
        "311": {
            "exits": {
                "go south": 309,
                "go north": 313,
                "go east": 312
            },
            "name": "华山派-客厅",
            "path": "huashan/keting"
        },
        "312": {
            "exits": {
                "go west": 311
            },
            "name": "华山派-偏厅",
            "path": "huashan/pianting"
        },
        "313": {
            "exits": {
                "go south": 311
            },
            "name": "华山派-寝室",
            "path": "huashan/woshi"
        },
        "314": {
            "exits": {
                "go east": 308
            },
            "name": "华山派-玉女祠",
            "path": "huashan/yunvci"
        },
        "315": {
            "exits": {
                "go north": 308,
                "go southup": 316
            },
            "name": "华山派-玉女峰山路",
            "path": "huashan/shanlu"
        },
        "316": {
            "exits": {
                "go northdown": 315,
                "go southup": 317
            },
            "name": "华山派-玉女峰小径",
            "path": "huashan/xiaojing"
        },
        "317": {
            "exits": {
                "go northdown": 316,
                "break bi;go enter": 318
            },
            "name": "华山派-思过崖",
            "path": "huashan/siguoya"
        },
        "318": {
            "exits": {
                "go out": 317,
                "go westup": 319
            },
            "name": "华山派-山洞",
            "path": "huashan/hole"
        },
        "319": {
            "exits": {
                "go eastdown": 318,
                "go westup": 320
            },
            "name": "华山派-长空栈道",
            "path": "huashan/zhandao"
        },
        "320": {
            "exits": {
                "jumpup": 321,
                "go eastdown": 319
            },
            "name": "华山派-落雁峰",
            "path": "huashan/luoyan"
        },
        "321": {
            "exits": {
                "go down": 320
            },
            "name": "华山派-华山绝顶",
            "path": "huashan/jueding"
        },
        "401": {
            "exits": {
                "go northup": 402,
                "go west": 404
            },
            "name": "峨眉派-金顶",
            "path": "emei/jinding"
        },
        "402": {
            "exits": {
                "go southdown": 401,
                "go east": 403
            },
            "name": "峨眉派-睹光台",
            "path": "emei/duguangtai"
        },
        "403": {
            "exits": {
                "go west": 402
            },
            "name": "峨眉派-华藏庵",
            "path": "emei/huacang"
        },
        "404": {
            "exits": {
                "go east": 401,
                "go south": 405
            },
            "name": "峨眉派-庙门",
            "path": "emei/miaomen"
        },
        "405": {
            "exits": {
                "go east": 406,
                "go west": 410,
                "go south": 409,
                "go north": 404
            },
            "name": "峨眉派-广场",
            "path": "emei/guangchang"
        },
        "406": {
            "exits": {
                "go east": 407,
                "go south": 408,
                "go west": 405
            },
            "name": "峨眉派-走廊",
            "path": "emei/zoulang1"
        },
        "407": {
            "exits": {
                "go west": 406
            },
            "name": "峨眉派-厨房",
            "path": "emei/chufang"
        },
        "408": {
            "exits": {
                "go north": 406
            },
            "name": "峨眉派-休息室",
            "path": "emei/xiuxishi"
        },
        "409": {
            "exits": {
                "go north": 405
            },
            "name": "峨眉派-大殿",
            "path": "emei/dadian"
        },
        "410": {
            "exits": {
                "go east": 405,
                "go west": 413,
                "go south": 414,
                "go north": 411
            },
            "name": "峨眉派-走廊",
            "path": "emei/zoulang2"
        },
        "411": {
            "exits": {
                "go north": 412,
                "go south": 410
            },
            "name": "峨眉派-走廊",
            "path": "emei/zoulang4"
        },
        "412": {
            "exits": {
                "go south": 411
            },
            "name": "峨眉派-小屋",
            "path": "emei/xiaowu"
        },
        "413": {
            "exits": {
                "go east": 410
            },
            "name": "峨眉派-练功房",
            "path": "emei/liangong"
        },
        "414": {
            "exits": {
                "go south": 415,
                "go north": 410
            },
            "name": "峨眉派-走廊",
            "path": "emei/zoulang3"
        },
        "415": {
            "exits": {
                "go north": 414
            },
            "name": "峨眉派-清修洞",
            "path": "emei/qingxiu"
        },
        "501": {
            "exits": {
                "go west": 508,
                "go east": 502,
                "go north": 506,
                "go south": 510,
                "go down": 512
            },
            "name": "逍遥派-青草坪",
            "path": "xiaoyao/qingcaop"
        },
        "502": {
            "exits": {
                "go west": 501,
                "go south": 504,
                "go north": 503
            },
            "name": "逍遥派-林间小道",
            "path": "xiaoyao/linjian"
        },
        "503": {
            "exits": {
                "go south": 502
            },
            "name": "逍遥派-练功房",
            "path": "xiaoyao/liangong"
        },
        "504": {
            "exits": {
                "go north": 502,
                "go south": 505
            },
            "name": "逍遥派-木板路",
            "path": "xiaoyao/muban"
        },
        "505": {
            "exits": {
                "go north": 504
            },
            "name": "逍遥派-工匠屋",
            "path": "xiaoyao/muwu3"
        },
        "506": {
            "exits": {
                "go north": 507,
                "go south": 501
            },
            "name": "逍遥派-林间小道",
            "path": "xiaoyao/linjian1"
        },
        "507": {
            "exits": {
                "go south": 506
            },
            "name": "逍遥派-木屋",
            "path": "xiaoyao/muwu2"
        },
        "508": {
            "exits": {
                "go east": 501,
                "go south": 509
            },
            "name": "逍遥派-林间小道",
            "path": "xiaoyao/linjian3"
        },
        "509": {
            "exits": {
                "go north": 508
            },
            "name": "逍遥派-休息室",
            "path": "xiaoyao/xiuxishi"
        },
        "510": {
            "exits": {
                "go south": 511,
                "go north": 501
            },
            "name": "逍遥派-林间小道",
            "path": "xiaoyao/linjian2"
        },
        "511": {
            "exits": {
                "go north": 510
            },
            "name": "逍遥派-木屋",
            "path": "xiaoyao/muwu1"
        },
        "512": {
            "exits": {
                "go up": 501,
                "go down": 513
            },
            "name": "逍遥派-地下石室",
            "path": "xiaoyao/shishi"
        },
        "513": {
            "exits": {
                "go up": 512
            },
            "name": "逍遥派-地下石室",
            "path": "xiaoyao/shishi2"
        },
        "601": {
            "exits": {
                "go down": 602
            },
            "name": "丐帮-树洞内部",
            "path": "gaibang/shudong"
        },
        "602": {
            "exits": {
                "go east": 603,
                "go up": 601
            },
            "name": "丐帮-树洞下",
            "path": "gaibang/shudongxia"
        },
        "603": {
            "exits": {
                "go east": 604,
                "go west": 602
            },
            "name": "丐帮-暗道",
            "path": "gaibang/andao1"
        },
        "604": {
            "exits": {
                "go west": 603,
                "go east": 605
            },
            "name": "丐帮-暗道",
            "path": "gaibang/andao2"
        },
        "605": {
            "exits": {
                "go west": 604,
                "go up": 606,
                "go east": 607
            },
            "name": "丐帮-破庙密室",
            "path": "gaibang/mishi"
        },
        "606": {
            "exits": {
                "go down": 605
            },
            "name": "丐帮-土地庙",
            "path": "gaibang/pomiao"
        },
        "607": {
            "exits": {
                "go west": 605,
                "go east": 608
            },
            "name": "丐帮-暗道",
            "path": "gaibang/andao3"
        },
        "608": {
            "exits": {
                "go west": 607,
                "go up": 609
            },
            "name": "丐帮-暗道",
            "path": "gaibang/andao4"
        },
        "609": {
            "exits": {
                "go down": 608
            },
            "name": "丐帮-林间小屋",
            "path": "gaibang/xiaowu"
        },
        "701": {
            "exits": {
                "go east": 707,
                "go west": 717,
                "go south": 712,
                "go north": 702
            },
            "name": "襄阳城-广场",
            "path": "xiangyang/guangchang"
        },
        "702": {
            "exits": {
                "go south": 701,
                "go north": 703
            },
            "name": "襄阳城-北大街",
            "path": "xiangyang/northjie1"
        },
        "703": {
            "exits": {
                "go south": 702,
                "go north": 704
            },
            "name": "襄阳城-北大街",
            "path": "xiangyang/northjie2"
        },
        "704": {
            "exits": {
                "go south": 703,
                "go north": 705
            },
            "name": "襄阳城-北大街",
            "path": "xiangyang/northjie3"
        },
        "705": {
            "exits": {
                "go east": 722,
                "go west": 750,
                "go south": 704,
                "go north": 706
            },
            "name": "襄阳城-北城门",
            "path": "xiangyang/northgate1"
        },
        "706": {
            "exits": {
                "go south": 705
            },
            "name": "襄阳城-北门外",
            "path": "xiangyang/northgate2"
        },
        "707": {
            "exits": {
                "go east": 708,
                "go west": 701
            },
            "name": "襄阳城-东大街",
            "path": "xiangyang/eastjie1"
        },
        "708": {
            "exits": {
                "go east": 707,
                "go west": 709
            },
            "name": "襄阳城-东大街",
            "path": "xiangyang/eastjie2"
        },
        "709": {
            "exits": {
                "go east": 710,
                "go west": 708,
                "go north": 751
            },
            "name": "襄阳城-东大街",
            "path": "xiangyang/eastjie3"
        },
        "710": {
            "exits": {
                "go west": 709,
                "go east": 711,
                "go south": 729,
                "go north": 728
            },
            "name": "襄阳城-东城门",
            "path": "xiangyang/eastgate1"
        },
        "711": {
            "exits": {
                "go west": 710
            },
            "name": "襄阳城-东门外",
            "path": "xiangyang/eastgate2"
        },
        "712": {
            "exits": {
                "go south": 713,
                "go north": 701
            },
            "name": "襄阳城-南大街",
            "path": "xiangyang/southjie1"
        },
        "713": {
            "exits": {
                "go south": 714,
                "go north": 712
            },
            "name": "襄阳城-南大街",
            "path": "xiangyang/southjie2"
        },
        "714": {
            "exits": {
                "go south": 715,
                "go north": 713
            },
            "name": "襄阳城-南大街",
            "path": "xiangyang/southjie3"
        },
        "715": {
            "exits": {
                "go east": 736,
                "go west": 737,
                "go south": 716,
                "go north": 714
            },
            "name": "襄阳城-南城门",
            "path": "xiangyang/southgate1"
        },
        "716": {
            "exits": {
                "go north": 715
            },
            "name": "襄阳城-南门外",
            "path": "xiangyang/southgate2"
        },
        "717": {
            "exits": {
                "go east": 701,
                "go west": 718
            },
            "name": "襄阳城-西大街",
            "path": "xiangyang/westjie1"
        },
        "718": {
            "exits": {
                "go east": 717,
                "go west": 719
            },
            "name": "襄阳城-西大街",
            "path": "xiangyang/westjie2"
        },
        "719": {
            "exits": {
                "go east": 718,
                "go west": 720
            },
            "name": "襄阳城-西大街",
            "path": "xiangyang/westjie3"
        },
        "720": {
            "exits": {
                "go south": 743,
                "go north": 744,
                "go west": 721,
                "go east": 719
            },
            "name": "襄阳城-西城门",
            "path": "xiangyang/westgate1"
        },
        "721": {
            "exits": {
                "go east": 720
            },
            "name": "襄阳城-西门外",
            "path": "xiangyang/westgate2"
        },
        "722": {
            "exits": {
                "go east": 723,
                "go west": 705
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle7"
        },
        "723": {
            "exits": {
                "go east": 724,
                "go west": 722
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle6"
        },
        "724": {
            "exits": {
                "go east": 725,
                "go west": 723
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle5"
        },
        "725": {
            "exits": {
                "go west": 724,
                "go south": 726
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle4"
        },
        "726": {
            "exits": {
                "go south": 727,
                "go north": 725
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle3"
        },
        "727": {
            "exits": {
                "go south": 728,
                "go north": 726
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle2"
        },
        "728": {
            "exits": {
                "go south": 710,
                "go north": 727
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle1"
        },
        "729": {
            "exits": {
                "go north": 710,
                "go south": 730
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle29"
        },
        "730": {
            "exits": {
                "go north": 710,
                "go south": 731
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle28"
        },
        "731": {
            "exits": {
                "go north": 730,
                "go south": 732
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle27"
        },
        "732": {
            "exits": {
                "go north": 731,
                "go south": 733
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle26"
        },
        "733": {
            "exits": {
                "go north": 732,
                "go west": 734
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle25"
        },
        "734": {
            "exits": {
                "go east": 733,
                "go west": 735
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle24"
        },
        "735": {
            "exits": {
                "go east": 734,
                "go west": 736
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle23"
        },
        "736": {
            "exits": {
                "go east": 735,
                "go west": 715
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle22"
        },
        "737": {
            "exits": {
                "go east": 715,
                "go west": 738
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle21"
        },
        "738": {
            "exits": {
                "go east": 737,
                "go west": 739
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle20"
        },
        "739": {
            "exits": {
                "go east": 738,
                "go west": 740
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle19"
        },
        "740": {
            "exits": {
                "go east": 739,
                "go north": 741
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle18"
        },
        "741": {
            "exits": {
                "go south": 740,
                "go north": 742
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle17"
        },
        "742": {
            "exits": {
                "go south": 741,
                "go north": 743
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle16"
        },
        "743": {
            "exits": {
                "go south": 742,
                "go north": 720
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle15"
        },
        "744": {
            "exits": {
                "go south": 720,
                "go north": 745
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle14"
        },
        "745": {
            "exits": {
                "go south": 744,
                "go north": 746
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle13"
        },
        "746": {
            "exits": {
                "go south": 745,
                "go north": 747
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle12"
        },
        "747": {
            "exits": {
                "go east": 748,
                "go south": 746
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle11"
        },
        "748": {
            "exits": {
                "go east": 749,
                "go west": 747
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle10"
        },
        "749": {
            "exits": {
                "go east": 750,
                "go west": 748
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle9"
        },
        "750": {
            "exits": {
                "go east": 705,
                "go west": 749
            },
            "name": "襄阳城-城墙",
            "path": "xiangyang/walle8"
        },
        "751": {
            "exits": {
                "out": 701
            },
            "name": "襄阳城-兵营",
            "path": "xiangyang/bingying2"
        },
        "900": {
            "exits": {
                "enter": 901
            },
            "name": "武道塔-入口",
            "path": "wudao/men"
        },
        "1400": {
            "exits": {
                "go west": 1406,
                "go east": 1409
            },
            "name": "衡山-衡阳城(副本区域)",
            "path": "wuyue/henshan/hengyang"
        },
        "1401": {
            "name": "衡山-刘府大门(副本区域)",
            "path": "wuyue/henshan/liufumen",
            "exits": {
                "go south": 1406,
                "go north": 1402
            }
        },
        "1402": {
            "name": "衡山-刘府大院(副本区域)",
            "path": "wuyue/henshan/liufudayuan",
            "exits": {
                "go south": 1401,
                "go north": 1403
            }
        },
        "1403": {
            "name": "衡山-刘府大厅(副本区域)",
            "path": "wuyue/henshan/liufudating",
            "exits": {
                "go west": 1404,
                "go east": 1405,
                "go south": 1402
            }
        },
        "1404": {
            "name": "衡山-西厢房(副本区域)",
            "path": "wuyue/henshan/liufuwest",
            "exits": {
                "go east": 1403
            }
        },
        "1405": {
            "name": "衡山-东厢房(副本区域)",
            "path": "wuyue/henshan/liufueast",
            "exits": {
                "go west": 1403
            }
        },
        "1406": {
            "name": "衡山-衡阳西街(副本区域)",
            "path": "wuyue/henshan/jiedao",
            "exits": {
                "go north": 1401,
                "go east": 1400,
                "go west": 1407
            }
        },
        "1407": {
            "name": "衡山-林间小道(副本区域)",
            "path": "wuyue/henshan/xiaolu",
            "exits": {
                "go east": 1406,
                "go west": 1408
            }
        },
        "1408": {
            "name": "衡山-山涧(副本区域)",
            "path": "wuyue/henshan/shanjian",
            "exits": {
                "go east": 1407
            }
        },
        "1409": {
            "name": "衡山-山路(副本区域)",
            "path": "wuyue/henshan/shanlu",
            "exits": {
                "go west": 1400,
                "go southeast": 1410
            }
        },
        "1410": {
            "name": "衡山-南天门(副本区域)",
            "path": "wuyue/henshan/nantianmen",
            "exits": {
                "go northwest": 1409,
                "go south": 1411
            }
        },
        "1411": {
            "name": "衡山-狮子岩(副本区域)",
            "path": "wuyue/henshan/shiziyan",
            "exits": {
                "go east": 1412,
                "go north": 1410
            }
        },
        "1412": {
            "name": "衡山-望日台(副本区域)",
            "path": "wuyue/henshan/wangritai",
            "exits": {
                "go south": 1413,
                "go west": 1411
            }
        },
        "1413": {
            "name": "衡山-祝融殿(副本区域)",
            "path": "wuyue/henshan/zhurongdian",
            "exits": {
                "go north": 1412,
                "go south": 1414
            }
        },
        "1414": {
            "name": "衡山-祝融峰(副本区域)",
            "path": "wuyue/henshan/zhurongfeng",
            "exits": {
                "go north": 1413
            }
        },
        "1601": {
            "exits": {
                "go north": 1602
            },
            "name": "嵩山-太室阙(副本区域)",
            "path": "wuyue/songshan/taishi"
        },
        "1602": {
            "exits": {
                "go north": 1603,
                "go south": 1601
            },
            "name": "嵩山-天中阁(副本区域)",
            "path": "wuyue/songshan/tianzhongge"
        },
        "1603": {
            "exits": {
                "go northup": 1604,
                "go south": 1602
            },
            "name": "嵩山-中岳大殿(副本区域)",
            "path": "wuyue/songshan/dadian"
        },
        "1604": {
            "exits": {
                "go northeast": 1605,
                "go southdown": 1603
            },
            "name": "嵩山-险峻山道(副本区域)",
            "path": "wuyue/songshan/shandao"
        },
        "1605": {
            "exits": {
                "go northup": 1606,
                "go southwest": 1604
            },
            "name": "嵩山-铁梁峡(副本区域)",
            "path": "wuyue/songshan/tieliang"
        },
        "1606": {
            "exits": {
                "go northup": 1607,
                "go southdown": 1605
            },
            "name": "嵩山-朝天门(副本区域)",
            "path": "wuyue/songshan/chaotianmen"
        },
        "1607": {
            "exits": {
                "go northup": 1610,
                "go southdown": 1606,
                "go westup": 1608
            },
            "name": "嵩山-峻极山门(副本区域)",
            "path": "wuyue/songshan/shanmen"
        },
        "1608": {
            "exits": {
                "go eastdown": 1607,
                "go westup": 1609
            },
            "name": "嵩山-极顶山道(副本区域)",
            "path": "wuyue/songshan/shandao2"
        },
        "1609": {
            "exits": {
                "go eastdown": 1608
            },
            "name": "嵩山-封禅台(副本区域)",
            "path": "wuyue/songshan/fengshantai"
        },
        "1610": {
            "exits": {
                "go southdown": 1607,
                "go north": 1611
            },
            "name": "嵩山-前庭(副本区域)",
            "path": "wuyue/songshan/qianting"
        },
        "1611": {
            "exits": {
                "go south": 1610,
                "go north": 1612
            },
            "name": "嵩山-峻极禅院(副本区域)",
            "path": "wuyue/songshan/chanyuan"
        },
        "1612": {
            "exits": {
                "go north": 1613,
                "go south": 1611
            },
            "name": "嵩山-中门(副本区域)",
            "path": "wuyue/songshan/zhongmen"
        },
        "1613": {
            "exits": {
                "go north": 1616,
                "go south": 1612,
                "go east": 1615,
                "go west": 1614
            },
            "name": "嵩山-会盟堂(副本区域)",
            "path": "wuyue/songshan/huimengtang"
        },
        "1614": {
            "exits": {
                "go east": 1613
            },
            "name": "嵩山-西廊(副本区域)",
            "path": "wuyue/songshan/xilang"
        },
        "1615": {
            "exits": {
                "go west": 1613
            },
            "name": "嵩山-东廊(副本区域)",
            "path": "wuyue/songshan/donglang"
        },
        "1616": {
            "exits": {
                "go south": 1613
            },
            "name": "嵩山-剑池(副本区域)",
            "path": "wuyue/songshan/jianchi"
        },
        "1901": {
            "exits": {
                "go north": 1902
            },
            "name": "白驼山-大门(副本区域)",
            "path": "baituo/damen"
        },
        "1902": {
            "exits": {
                "go north": 1903,
                "go west": 1906
            },
            "name": "白驼山-练功场(副本区域)",
            "path": "baituo/liangong"
        },
        "1903": {
            "exits": {
                "go north": 1904,
                "go south": 1902
            },
            "name": "白驼山-门廊(副本区域)",
            "path": "baituo/menlang"
        },
        "1904": {
            "exits": {
                "go north": 1905,
                "go south": 1903
            },
            "name": "白驼山-花园(副本区域)",
            "path": "baituo/huayuan"
        },
        "1905": {
            "exits": {
                "go south": 1904
            },
            "name": "白驼山-大厅(副本区域)",
            "path": "baituo/dating"
        },
        "1906": {
            "exits": {
                "go south": 1907,
                "go west": 1908,
                "go east": 1902
            },
            "name": "白驼山-长廊(副本区域)",
            "path": "baituo/changlang"
        },
        "1907": {
            "exits": {
                "go north": 1906
            },
            "name": "白驼山-药房(副本区域)",
            "path": "baituo/yaofang"
        },
        "1908": {
            "exits": {
                "go west": 1909,
                "go east": 1906
            },
            "name": "白驼山-西门(副本区域)",
            "path": "baituo/ximen"
        },
        "1909": {
            "exits": {
                "go east": 1908,
                "go north": 1910
            },
            "name": "白驼山-草丛(副本区域)",
            "path": "baituo/cao1"
        },
        "1910": {
            "exits": {
                "go east": 1909,
                "go north": 1911
            },
            "name": "白驼山-草丛(副本区域)",
            "path": "baituo/cao2"
        },
        "1911": {
            "exits": {
                "go south": 1910,
                "go north": 1912
            },
            "name": "白驼山-竹林(副本区域)",
            "path": "baituo/zhulin"
        },
        "1912": {
            "exits": {
                "go south": 1911
            },
            "name": "白驼山-岩洞(副本区域)",
            "path": "baituo/dong"
        },
        "2001": {
            "exits": {
                "go northeast": 2006,
                "go northwest": 2002
            },
            "name": "星宿海-星宿海(副本区域)",
            "path": "xingxiu/xxh6"
        },
        "2002": {
            "exits": {
                "go north": 2003,
                "go southeast": 2001
            },
            "name": "星宿海-星宿海(副本区域)",
            "path": "xingxiu/xxh4"
        },
        "2003": {
            "exits": {
                "go south": 2002,
                "go northeast": 2004
            },
            "name": "星宿海-星宿海(副本区域)",
            "path": "xingxiu/xxh2"
        },
        "2004": {
            "exits": {
                "go north": 2007,
                "go southwest": 2003,
                "go southeast": 2005
            },
            "name": "星宿海-星宿海(副本区域)",
            "path": "xingxiu/xxh1"
        },
        "2005": {
            "exits": {
                "go south": 2006,
                "go northwest": 2004
            },
            "name": "星宿海-星宿海(副本区域)",
            "path": "xingxiu/xxh3"
        },
        "2006": {
            "exits": {
                "go north": 2005,
                "go southwest": 2001
            },
            "name": "星宿海-星宿海(副本区域)",
            "path": "xingxiu/xxh5"
        },
        "2007": {
            "exits": {
                "go south": 2004
            },
            "name": "星宿海-日月洞(副本区域)",
            "path": "xingxiu/riyuedong"
        },
        "2201": {
            "exits": {
                "go south": 2202
            },
            "name": "移花宫-山道(副本区域)",
            "path": "huashan/yihua/shandao"
        },
        "2202": {
            "exits": {
                "go south": 2203
            },
            "name": "移花宫-花径(副本区域)",
            "path": "huashan/yihua/yihua0"
        },
        "2203": {
            "exits": {
                "go south": 2204
            },
            "name": "移花宫-宫门(副本区域)",
            "path": "huashan/yihua/damen"
        },
        "2204": {
            "exits": {
                "go south": 2205,
                "go north": 2203
            },
            "name": "移花宫-花海阁(副本区域)",
            "path": "huashan/yihua/yihuage"
        },
        "2205": {
            "exits": {
                "go south": 2206,
                "go north": 2204
            },
            "name": "移花宫-桂花廊(副本区域)",
            "path": "huashan/yihua/changlang"
        },
        "2206": {
            "exits": {
                "go north": 2205,
                "go southwest": 2208,
                "go southeast": 2207
            },
            "name": "移花宫-玫瑰廊(副本区域)",
            "path": "huashan/yihua/changlang1"
        },
        "2207": {
            "exits": {
                "go southwest": 2209,
                "go northwest": 2206
            },
            "name": "移花宫-涟星宫(副本区域)",
            "path": "huashan/yihua/lianxinggong"
        },
        "2208": {
            "exits": {
                "go southeast": 2209,
                "go northeast": 2206
            },
            "name": "移花宫-邀月宫(副本区域)",
            "path": "huashan/yihua/yaoyuegong"
        },
        "2209": {
            "exits": {
                "go northwest": 2208,
                "go northeast": 2207,
                "go down": 2210
            },
            "name": "移花宫-宫主卧室(副本区域)",
            "path": "huashan/yihua/woshi"
        },
        "2210": {
            "exits": {
                "go up": 2209,
                "fire;go west": 2211
            },
            "name": "移花宫-密道(副本区域)",
            "path": "huashan/yihua/midao"
        },
        "2211": {
            "exits": {
                "go east": 2210,
                "go west": 2212
            },
            "name": "移花宫-密道(副本区域)",
            "path": "huashan/yihua/midao2"
        },
        "2212": {
            "exits": {
                "go east": 2211
            },
            "name": "移花宫-小径(副本区域)",
            "path": "huashan/yihua/xiaojing"
        },
        "2301": {
            "exits": {
                "go east": 2302
            },
            "name": "燕子坞-岸边(副本区域)",
            "path": "murong/anbian"
        },
        "2302": {
            "exits": {
                "go west": 2301,
                "go east": 2303
            },
            "name": "燕子坞-花丛(副本区域)",
            "path": "murong/hc1"
        },
        "2303": {
            "exits": {
                "go west": 2302,
                "go east": 2304
            },
            "name": "燕子坞-庄门(副本区域)",
            "path": "murong/zhuangmen"
        },
        "2304": {
            "exits": {
                "go west": 2303,
                "go south": 2308,
                "go east": 2305
            },
            "name": "燕子坞-前院(副本区域)",
            "path": "murong/qianyuan"
        },
        "2305": {
            "exits": {
                "go west": 2304,
                "go east": 2306
            },
            "name": "燕子坞-练武场(副本区域)",
            "path": "murong/wuchang"
        },
        "2306": {
            "exits": {
                "go west": 2305,
                "go east": 2307,
                "go north": 2313
            },
            "name": "燕子坞-大厅(副本区域)",
            "path": "murong/dating"
        },
        "2307": {
            "exits": {
                "go west": 2306
            },
            "name": "燕子坞-书房(副本区域)",
            "path": "murong/shufang"
        },
        "2308": {
            "exits": {
                "go north": 2304,
                "go east": 2309
            },
            "name": "燕子坞-小径(副本区域)",
            "path": "murong/xiaojing"
        },
        "2309": {
            "exits": {
                "go west": 2308,
                "go south": 2310
            },
            "name": "燕子坞-听雨居(副本区域)",
            "path": "murong/tingyuju"
        },
        "2310": {
            "exits": {
                "go north": 2309,
                "go south": 2311
            },
            "name": "燕子坞-后院(副本区域)",
            "path": "murong/houyuan"
        },
        "2311": {
            "exits": {
                "go north": 2310,
                "go east": 2312
            },
            "name": "燕子坞-云锦楼(副本区域)",
            "path": "murong/yunjinlou"
        },
        "2312": {
            "exits": {
                "go west": 2311
            },
            "name": "燕子坞-小厅(副本区域)",
            "path": "murong/xiaoting"
        },
        "2313": {
            "exits": {
                "bai pai;bai pai;bai pai;go north": 2315,
                "go south": 2306,
                "go east": 2314
            },
            "name": "燕子坞-后厅(副本区域)",
            "path": "murong/houting"
        },
        "2314": {
            "exits": {
                "go west": 2313
            },
            "name": "燕子坞-内堂(副本区域)",
            "path": "murong/neitang"
        },
        "2315": {
            "exits": {
                "go south": 2313
            },
            "name": "燕子坞-还施水阁(副本区域)",
            "path": "murong/hssg"
        },
        "2601": {
            "exits": {
                "go north": 2602
            },
            "name": "光明顶-山门(副本区域)",
            "path": "mj/shanmen"
        },
        "2602": {
            "exits": {
                "go west": 2603,
                "go south": 2601
            },
            "name": "光明顶-栈道(副本区域)",
            "path": "mj/zhandao"
        },
        "2603": {
            "exits": {
                "go northwest": 2604,
                "go east": 2602
            },
            "name": "光明顶-山路(副本区域)",
            "path": "mj/shanlu"
        },
        "2604": {
            "exits": {
                "go southeast": 2603,
                "go north": 2605
            },
            "name": "光明顶-半山厅(副本区域)",
            "path": "mj/banshanting"
        },
        "2605": {
            "exits": {
                "go east": 2606,
                "go north": 2609,
                "go south": 2604
            },
            "name": "光明顶-半山腰(副本区域)",
            "path": "mj/banshanyao"
        },
        "2606": {
            "exits": {
                "go east": 2607,
                "go west": 2605
            },
            "name": "光明顶-山坡(副本区域)",
            "path": "mj/shanpo1"
        },
        "2607": {
            "exits": {
                "go east": 2608,
                "go west": 2606
            },
            "name": "光明顶-半山腰(副本区域)",
            "path": "mj/shanpo2"
        },
        "2608": {
            "exits": {
                "go west": 2607
            },
            "name": "光明顶-悬天石(副本区域)",
            "path": "mj/xuantianshi"
        },
        "2609": {
            "exits": {
                "go north": 2610,
                "go south": 2605
            },
            "name": "光明顶-林间小路(副本区域)",
            "path": "mj/xiaolu1"
        },
        "2610": {
            "exits": {
                "go north": 2611,
                "go south": 2609
            },
            "name": "光明顶-光明顶(副本区域)",
            "path": "mj/guangmingding"
        },
        "2611": {
            "exits": {
                "go north": 2614,
                "go south": 2610,
                "go east": 2615,
                "go west": 2612
            },
            "name": "光明顶-厚土旗(副本区域)",
            "path": "mj/qi_houtu"
        },
        "2612": {
            "exits": {
                "go east": 2611,
                "go north": 2613
            },
            "name": "光明顶-巨木旗(副本区域)",
            "path": "mj/qi_jumu"
        },
        "2613": {
            "exits": {
                "go south": 2612,
                "go east": 2614
            },
            "name": "光明顶-锐金旗(副本区域)",
            "path": "mj/qi_ruijin"
        },
        "2614": {
            "exits": {
                "go south": 2611,
                "go east": 2617,
                "go north":2619,
                "go west": 2613
            },
            "name": "光明顶-练武场(副本区域)",
            "path": "mj/lianwu"
        },
        "2615": {
            "exits": {
                "go north": 2617,
                "go east": 2616,
                "go west": 2611
            },
            "name": "光明顶-洪水旗(副本区域)",
            "path": "mj/qi_hongshui"
        },
        "2616": {
            "exits": {
                "go west": 2615
            },
            "name": "光明顶-山崖(副本区域)",
            "path": "mj/shanya"
        },
        "2617": {
            "exits": {
                "go south": 2615,
                "go east": 2618,
                "go west": 2614
            },
            "name": "光明顶-烈火旗(副本区域)",
            "path": "mj/qi_liehuo"
        },
        "2618": {
            "exits": {
                "go east":2617
            },
            "name": "光明顶-断崖(副本区域)",
            "path": "mj/duanya"
        },
        "2619": {
            "exits": {
                "go south": 2614,
                "go north": 2620
            },
            "name": "光明顶-聚议厅(副本区域)",
            "path": "mj/juyiting"
        },
        "2620": {
            "exits": {
                "go south": 2619,
                "go west": 2621
            },
            "name": "光明顶-圣火堂(副本区域)",
            "path": "mj/shenghuotang"
        },
        "2621": {
            "exits": {
                "go north": 2622,
                "go east": 2620
            },
            "name": "光明顶-小厅(副本区域)",
            "path": "mj/xiaoting"
        },
        "2622": {
            "exits": {
                "go north": 2624,
                "go west": 2623,
                "go south": 2621
            },
            "name": "光明顶-后院(副本区域)",
            "path": "mj/houyuan"
        },
        "2623": {
            "exits": {
                "go east": 2622
            },
            "name": "光明顶-西厢房(副本区域)",
            "path": "mj/xixiang"
        },
        "2624": {
            "exits": {
                "go south": 2622
            },
            "name": "光明顶-北厢房(副本区域)",
            "path": "mj/beixiang"
        }
    };
    var MAP = {
        getpath:function (x,y){
            var path = {};
            var st = [x]; //等待搜索表
            var sidt = []; //已经搜索表
            while (!MAP.inArray(y,sidt)) {
                //	console.log('等待搜索',st);
                //	console.log('已经搜索',sidt);
                //	console.log('path',path);
                var a = st.shift();
                sidt.push(a);
                for (var i in map[a].exits) {
                    var b = map[a].exits[i];
                    if(!MAP.inArray(b,sidt)){
                        if(path[a] != undefined){
                            path[b] = path[a] + ';' + i;
                        } else {
                            path[b] = i;
                        }
                        st.push(b);
                    }
                }
            }
            //	log(path[y]);
            return path[y];
        },
        inArray:function (val, arr) {
            for (let i = 0; i < arr.length; i++) {
                if (val == arr[i]) return true;
            }
            return false;
        },
        goto:function (val) {
            if(!room.id){
                S("<hir>本房间数据不存在</hir>");
                return
            }
            var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
            if(!re.test(val)){
                var y = this.find_room(val);
                if(!y){
                    S("<hir>目的房间数据不存在</hir>");
                    return
                }
            }else{
                if(!map[val]){
                    S("<hir>目的房间数据不存在</hir>");
                    return
                }
                y = val;
            }
            if(room.id == y){
                S("<hir>已经到了目的房间</hir>");
                if (mp_kg && role != cmder) {WG.get_all();WG.kill_all();}
                return
            }
            //S("目前在 <hiy>" + map[room.id].name + "</hiy>  要到 <hiy>" + map[y].name +"</hiy> 去");
            var t = $(".room_items .room-item:first .item-name").text();
            t = t.indexOf("<挖矿") != -1 || t.indexOf("<疗伤") != -1 || t.indexOf("<打坐") != -1 || t.indexOf("<学习") != -1 || t.indexOf("<练习") != -1;
            if (t) {
                var pp = 'stopstate';
            } else {
                pp = '';
            }
            if(parseInt(room.id/100) != parseInt(y/100)){
                if(parseInt(y/100) == 19){
                    pp = pp + ';cr baituo/damen';
                } else if(parseInt(y/100) == 20){
                    pp = pp + ';cr1 xingxiu/xxh6';
                } else if(parseInt(y/100) == 22){
                    pp = pp + ';cr huashan/yihua/shandao';
                } else if(parseInt(y/100) == 23){
                    pp = pp + ';cr murong/anbian';
                } else if(parseInt(y/100) == 26){
                    pp = pp + ';cr mj/shanmen';
                } else if(parseInt(y/100) == 7){
                    pp = pp + ';jh fam 8 start';
                } else {
                    pp = pp + ';jh fam ' + parseInt(y/100) + ' start';
                }

                var x = parseInt(y/100) * 100 + 1;
            } else {
                x = room.id;
            }
            if (x != y) {
                pp = pp + ';' + this.getpath(x,y);
            }
            c(pp);
            if (mp_kg) {
                setTimeout(() => {MAP.goto(y);},500);
            }
        },
        find_room:function (str1,str2) {
            if(str2 && str2 == 'wudao/ta'){
                return 901;
            }
            for (var i in map) {
                if(str2){
                    if(map[i].name == str1 && map[i].path == str2){
                        return i;
                    }
                } else {
                    if(map[i].name == str1){
                        return i;
                    }
                }
            }
            return false;
        }
    };
    function log(str1){
        console.log(str1);
    };
    var exe_time=0;
    function exe(cmd){
        if (cmd.indexOf(';') != -1) {
            var cmd2 = cmd.split(';');
            for (var x of cmd2) {
                cmds.push(x)
            }
        }else{
            cmds.push(cmd)
        }
        if(exe_time == 0){
            exe_time=self.setInterval(function(){clock()},500);
        }
        function clock(){
            if(cmds.length > 0){
                var x = cmds.shift();
                if (x != 'wait'){
                    c(x);
                }
            }else{
                clearInterval(exe_time);
                exe_time=0;
            }
        }

    };
    function find_npc(str){
        for (var x in roomData){
            if(roomData[x].name && roomData[x].name.indexOf(str) != -1){
                return roomData[x].id;
            }
        }
        return false;
    };
    function find_npc2(str){
        var lists = $(".room_items .room-item");
        for (var npc of lists) {
            if(npc.innerText.indexOf(str) != -1){
                return $(npc).attr("itemid");
            }
        }
        return false;
    };
    function find_npc3(str){
        for (var x in roomData){
            if(roomData[x].name && roomData[x].name == str){
                return roomData[x].id;
            }
        }
        return false;
    };
    function find_wuping (str1,str2){
        if(str2){
            for (var wuping of bao) {
                if(wuping.name.indexOf(str1) != -1 && wuping.name.indexOf(str2) != -1){
                    return [wuping.id,wuping.count];
                }
            }
        } else {
            for (wuping of bao) {
                if(wuping.name.indexOf(str1) != -1){
                    return [wuping.id,wuping.count];
                }
            }
        }
        return false;
    }
    var chnNumChar = {
        零:0,
        一:1,
        二:2,
        三:3,
        四:4,
        五:5,
        六:6,
        七:7,
        八:8,
        九:9
    };
    var chnNameValue = {
        十:{value:10, secUnit:false},
        百:{value:100, secUnit:false},
        千:{value:1000, secUnit:false},
        万:{value:10000, secUnit:true},
        亿:{value:100000000, secUnit:true}
    };
    function ChineseToNumber(chnStr){
        var rtn = 0;
        var section = 0;
        var number = 0;
        var secUnit = false;
        var str = chnStr.split('');

        for(var i = 0; i < str.length; i++){
            var num = chnNumChar[str[i]];
            if(typeof num !== 'undefined'){
                number = num;
                if(i === str.length - 1){
                    section += number;
                }
            }else{
                var unit = chnNameValue[str[i]].value;
                secUnit = chnNameValue[str[i]].secUnit;
                if(secUnit){
                    section = (section + number) * unit;
                    rtn += section;
                    section = 0;
                }else{
                    section += (number * unit);
                }
                number = 0;
            }
        }
        return rtn + section;
    };
    var autoeq = 999;
    //快捷键功能
    var KEY = {
        keys: [],
        roomItemSelectIndex: -1,
        init: function () {
            //添加快捷键说明
            /*		$("span[command=stopstate] span:eq(0)").html("S");
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
			$("span[command=setting] span:eq(0)").html(","); */

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
            /*		this.add(188, function () {
				KEY.do_command("setting");
			}); */

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
                WG.Send("go south");
                KEY.onChangeRoom();
            });
            this.add(40, function () {
                WG.Send("go south");
                KEY.onChangeRoom();
            });
            this.add(104, function () {
                WG.Send("go north");
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
    var sm_array = {
        '武当': {
            place: "武当派-三清殿",
            npc: "武当派第二代弟子 武当首侠 宋远桥"
        },
        '华山': {
            place: "华山派-镇岳宫",
            npc: "市井豪杰 高根明"
        },
        '少林': {
            place: "少林派-天王殿",
            npc: "少林寺第三十九代弟子 道觉禅师"
        },
        '逍遥': {
            place: "逍遥派-青草坪",
            npc: "聪辩老人 苏星河"
        },
        '丐帮': {
            place: "丐帮-树洞下",
            npc: "丐帮七袋弟子 左全"
        },
        '峨眉': {
            place: "峨眉派-大殿",
            npc: "峨眉派第四代弟子 静心"
        },
    };
    function clearCookie(){
        var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i =  keys.length; i--;)
                document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
        }
    };
    var user = '';
    var LG = {
        init: function () {
            var html = `
<div>
<span class='zdy-item ttiny18'>旋风镖</span>
<span class='zdy-item ttiny19'>淺色年華</span>
</div>
<div>
<span class='zdy-item a8001'>1</span>
<span class='zdy-item a8002'>2</span>
<span class='zdy-item a8003'>3</span>
<span class='zdy-item a8004'>4</span>
<span class='zdy-item a8005'>5</span>
</div>
<div>
<span class='zdy-item a8006'>6</span>
<span class='zdy-item a8007'>7</span>
<span class='zdy-item a8008'>8</span>
<span class='zdy-item a8009'>9</span>
<span class='zdy-item a8010'>10</span>
</div>
<div>
<span class='zdy-item a8011'>11</span>
<span class='zdy-item a8012'>12</span>
<span class='zdy-item a8013'>13</span>
<span class='zdy-item a8014'>14</span>
<span class='zdy-item a8015'>15</span>
</div>
<div>
<span class='zdy-item a8016'>16</span>
<span class='zdy-item a8017'>17</span>
<span class='zdy-item a8018'>18</span>
<span class='zdy-item a8019'>19</span>
<span class='zdy-item a8020'>20</span>
</div>
<div>
<span class='zdy-item a8021'>21</span>
<span class='zdy-item a8022'>22</span>
<span class='zdy-item a8023'>23</span>
<span class='zdy-item a8024'>24</span>
<span class='zdy-item a8025'>25</span>
</div>
<div>
<span class='zdy-item a8026'>26</span>
<span class='zdy-item a8027'>27</span>
<span class='zdy-item a8028'>28</span>
<span class='zdy-item a8029'>29</span>
<span class='zdy-item a8030'>30</span>
</div>
<div>
<span class='zdy-item a8031'>31</span>
<span class='zdy-item a8032'>32</span>
<span class='zdy-item a8033'>33</span>
<span class='zdy-item a8034'>34</span>
<span class='zdy-item a8035'>35</span>
</div>
<div>
<span class='zdy-item a8036'>36</span>
<span class='zdy-item a8037'>37</span>
<span class='zdy-item a8038'>38</span>
<span class='zdy-item a8039'>39</span>
<span class='zdy-item a8040'>40</span>
</div>
<div>
<span class='zdy-item a8041'>41</span>
<span class='zdy-item a8042'>42</span>
<span class='zdy-item a8043'>43</span>
<span class='zdy-item a8044'>44</span>
<span class='zdy-item a8045'>45</span>
</div>
<div>
<span class='zdy-item a8046'>46</span>
<span class='zdy-item a8047'>47</span>
<span class='zdy-item a8048'>48</span>
<span class='zdy-item a8049'>49</span>
<span class='zdy-item a8050'>50</span>
</div>
`;
            var css = `.zdy-item{
display: inline-block;border: solid 1px gray;color: gray;background-color: black;
text-align: center;cursor: pointer;border-radius: 0.25em;min-width: 2em;margin-right: 0em;
margin-left: 0em;position: relative;padding-left: 0.4em;padding-right: 0.4em;line-height: 2em;}
`;
            $("li[command=LoginIn]").after(html);
            GM_addStyle(css);
            $(".ttiny18").on("click", LG.loginttiny18);
            $(".ttiny19").on("click", LG.loginttiny19);
            $(".a8001").on("click", LG.login1);
            $(".a8002").on("click", LG.login2);
            $(".a8003").on("click", LG.login3);
            $(".a8004").on("click", LG.login4);
            $(".a8005").on("click", LG.login5);
            $(".a8006").on("click", LG.login6);
            $(".a8007").on("click", LG.login7);
            $(".a8008").on("click", LG.login8);
            $(".a8009").on("click", LG.login9);
            $(".a8010").on("click", LG.login10);
            $(".a8011").on("click", LG.login11);
            $(".a8012").on("click", LG.login12);
            $(".a8013").on("click", LG.login13);
            $(".a8014").on("click", LG.login14);
            $(".a8015").on("click", LG.login15);
            $(".a8016").on("click", LG.login16);
            $(".a8017").on("click", LG.login17);
            $(".a8018").on("click", LG.login18);
            $(".a8019").on("click", LG.login19);
            $(".a8020").on("click", LG.login20);
            $(".a8021").on("click", LG.login21);
            $(".a8022").on("click", LG.login22);
            $(".a8023").on("click", LG.login23);
            $(".a8024").on("click", LG.login24);
            $(".a8025").on("click", LG.login25);
            $(".a8026").on("click", LG.login26);
            $(".a8027").on("click", LG.login27);
            $(".a8028").on("click", LG.login28);
            $(".a8029").on("click", LG.login29);
            $(".a8030").on("click", LG.login30);
            $(".a8031").on("click", LG.login31);
            $(".a8032").on("click", LG.login32);
            $(".a8033").on("click", LG.login33);
            $(".a8034").on("click", LG.login34);
            $(".a8035").on("click", LG.login35);
            $(".a8036").on("click", LG.login36);
            $(".a8037").on("click", LG.login37);
            $(".a8038").on("click", LG.login38);
            $(".a8039").on("click", LG.login39);
            $(".a8040").on("click", LG.login40);
            $(".a8041").on("click", LG.login41);
            $(".a8042").on("click", LG.login42);
            $(".a8043").on("click", LG.login43);
            $(".a8044").on("click", LG.login44);
            $(".a8045").on("click", LG.login45);
            $(".a8046").on("click", LG.login46);
            $(".a8047").on("click", LG.login47);
            $(".a8048").on("click", LG.login48);
            $(".a8049").on("click", LG.login49);
            $(".a8050").on("click", LG.login50);
            $(".relogin").on("click", WG.relogin);
        },
        loginttiny18: function () {
            LG.tianxie('ttiny18');
            user = 1018;
        },
        loginttiny19: function () {
            LG.tianxie('ttiny19');
            user = 1019;
        },
        login11: function () {
            LG.tianxie('a8011');
            user = 11;
        },
        login12: function () {
            LG.tianxie('a8012');
            user = 12;
        },
        login13: function () {
            LG.tianxie('a8013');
            user = 13;
        },
        login14: function () {
            LG.tianxie('a8014');
            user = 14;
        },
        login15: function () {
            LG.tianxie('a8015');
            user = 15;
        },
        login16: function () {
            LG.tianxie('a8016');
            user = 16;
        },
        login17: function () {
            LG.tianxie('a8017');
            user = 17;
        },
        login18: function () {
            LG.tianxie('a8018');
            user = 18;
        },
        login19: function () {
            LG.tianxie('a8019');
            user = 19;
        },
        login20: function () {
            LG.tianxie('a8020');
            user = 20;
        },
        login21: function () {
            LG.tianxie('a8021');
            user = 21;
        },
        login22: function () {
            LG.tianxie('a8022');
            user = 22;
        },
        login23: function () {
            LG.tianxie('a8023');
            user = 23;
        },
        login24: function () {
            LG.tianxie('a8024');
            user = 24;
        },
        login25: function () {
            LG.tianxie('a8025');
            user = 25;
        },
        login26: function () {
            LG.tianxie('a8026');
            user = 26;
        },
        login27: function () {
            LG.tianxie('a8027');
            user = 27;
        },
        login28: function () {
            LG.tianxie('a8028');
            user = 28;
        },
        login29: function () {
            LG.tianxie('a8029');
            user = 29;
        },
        login30: function () {
            LG.tianxie('a8030');
            user = 30;
        },
        login31: function () {
            LG.tianxie('a8031');
            user = 31;
        },
        login32: function () {
            LG.tianxie('a8032');
            user = 32;
        },
        login33: function () {
            LG.tianxie('a8033');
            user = 33;
        },
        login34: function () {
            LG.tianxie('a8034');
            user = 34;
        },
        login35: function () {
            LG.tianxie('a8035');
            user = 35;
        },
        login36: function () {
            LG.tianxie('a8036');
            user = 36;
        },
        login37: function () {
            LG.tianxie('a8037');
            user = 37;
        },
        login38: function () {
            LG.tianxie('a8038');
            user = 38;
        },
        login39: function () {
            LG.tianxie('a8039');
            user = 39;
        },
        login40: function () {
            LG.tianxie('a8040');
            user = 40;
        },
        login41: function () {
            LG.tianxie('a8041');
            user = 41;
        },
        login42: function () {
            LG.tianxie('a8042');
            user = 42;
        },
        login43: function () {
            LG.tianxie('a8043');
            user = 43;
        },
        login44: function () {
            LG.tianxie('a8044');
            user = 44;
        },
        login45: function () {
            LG.tianxie('a8045');
            user = 45;
        },
        login46: function () {
            LG.tianxie('a8046');
            user = 46;
        },
        login47: function () {
            LG.tianxie('a8047');
            user = 47;
        },
        login48: function () {
            LG.tianxie('a8048');
            user = 48;
        },
        login49: function () {
            LG.tianxie('a8049');
            user = 49;
        },
        login50: function () {
            LG.tianxie('a8050');
            user = 50;
        },
        login1: function () {
            LG.tianxie('a8001');
            user = 1;
        },
        login2: function () {
            LG.tianxie('a8002');
            user = 2;
        },
        login3: function () {
            LG.tianxie('a8003');
            user = 3;
        },
        login4: function () {
            LG.tianxie('a8004');
            user = 4;
        },
        login5: function () {
            LG.tianxie('a8005');
            user = 5;
        },
        login6: function () {
            LG.tianxie('a8006');
            user = 6;
        },
        login7: function () {
            LG.tianxie('a8007');
            user = 7;
        },
        login8: function () {
            LG.tianxie('a8008');
            user = 8;
        },
        login9: function () {
            LG.tianxie('a8009');
            user = 9;
        },
        login10: function () {
            LG.tianxie('a8010');
            user = 10;
        },
        tianxie: function (str) {
            $("#login_name").val(str);
            mima = GM_getValue("mima", mima);
            if (mima == null) {
                mima = WG.grove_ask_info();
                GM_setValue("mima", mima);
            };
            $("#login_pwd").val(mima);
            $("li[command=LoginIn]").click();
            timer = setInterval(LG.login, 200);
        },
        login: function () {
            if($('div#slist_panel.mypanel').css('display')=='block')
                $("li[command=SelectServer]").click();
            if($('div#role_panel.mypanel').css('display')=='block'){
                $("li[command=SelectRole]").click();
                WG.timer_close();
            }
        }
    };
    var WG = {
        sm_state: -1,
        sm_item: null,
        init: function () {
            $("li[command=SelectRole]").on("click", function () {
                clearCookie();
                WG.login();
            });
        },
        login: function () {
            role = $('.role-list .select').text().split(/[\s\n]/).pop();
            my_id = $('.role-list .select').attr("roleid");
            document.title = user;
            $(".bottom-bar").append("<span class='item-commands' style='display:none'><span WG='WG' cmd=''></span></span>"); //命令行模块
            var html = `
<div class="WG_log"><pre></pre></div>
<div>
<span class='zdy-item sm_button'>师门</span>
<span class='zdy-item go_yamen_task'>请安</span>
<span class='zdy-item kill_all'>击杀</span>
<span class='zdy-item get_all'>拾取</span>
<span class='zdy-item sell_all'>刷新</span>
<span class='zdy-item zdwk'>挖矿</span>
</div>
`;
            $(".content-message").after(html);
            var css = `.zdy-item{
display: inline-block;border: solid 1px gray;color: gray;background-color: black;
text-align: center;cursor: pointer;border-radius: 0.25em;min-width: 2em;margin-right: 0em;
margin-left: 0em;position: relative;padding-left: 0.4em;padding-right: 0.4em;line-height: 2em;}
.WG_log{flex: 1;overflow-y: auto;border: 1px solid #404000;max-height: 15em;width: calc(100% - 40px);}
.WG_log > pre{margin: 0px; white-space: pre-line;}
`;
            GM_addStyle(css);
            goods = GM_getValue("goods", goods);
            npcs = GM_getValue("npcs", npcs);
            //       equip = GM_getValue(role + "_equip", equip);
            //		family = GM_getValue(role + "_family", family);
            if(user == 1 || user == 2 || user == 5 || user == 8){
                family = '峨眉';
                wudao_pfm ='unarmed.juan,sword.hao,sword.yi,dodge.power,force.power,force.wang,parry.wu,throwing.jiang,blade.kuang,unarmed.duo,parry.yi';
            } else if(user == 6 || user == 7 || user == 9 || user == 10){
                family = '武当';
                wudao_pfm ='sword.chan,unarmed.zhen,unarmed.chan,sword.lian,sword.sui,force.chu,force.san,force.power,force.wang,parry.wu,parry.zhen,dodge.power,unarmed.zhen,throwing.jiang,unarmed.san,unarmed.zhui,blade.kuang';
            } else {
                family = '华山';
                // wudao_pfm ='sword.wu,sword.poqi,force.power,force.qi,unarmed.chan,dodge.power,throwing.jiang';
                wudao_pfm ='unarmed.chan,sword.poqi,dodge.power,force.xi,force.power,force.wang,sword.wu,parry.wu,unarmed.po,parry.pojian,throwing.jiang,unarmed.san,unarmed.zhui';

            }

            automarry = GM_getValue(role + "_automarry", automarry);
            autoKsBoss = GM_getValue(role + "_autoKsBoss", autoKsBoss);
            showHP = GM_getValue(role + "_showHP", showHP);
            ks_pfm = GM_getValue(role + "_ks_pfm", ks_pfm);
            eqlist = GM_getValue(role + "_eqlist", eqlist);
            sm_loser = GM_getValue(role + "_sm_loser", sm_loser);
            jn_wxk = GM_getValue(role + "_jn_wxk", jn_wxk);
            autoeq = GM_getValue(role + "_auto_eq", autoeq);
            if (family == null) {
                //	family = $('.role-list .select').text().substr(0, 2);
            };
            if (autoKsBoss == null) {
                autoKsBoss = "已停止";
            };
            if (automarry == null) {
                automarry = "已停止";
            };
            if (showHP == null) {
                showHP = "已停止";
            };
            if (sm_loser == null) {
                sm_loser = "已开启";
            };
            if (jn_wxk == null) {
                jn_wxk = "已停止";
            };
            if (autoeq == null) {
                autoeq ='1';
            };
            //unarmed.san,unarmed.po,blade.wuwo,unarmed.zhen,sword.chan,sword.lian,sword.sui,blade.chan
            //wudao_pfm = GM_getValue(role + "_wudao_pfm", wudao_pfm);

            $(".sm_button").on("click", WG.sm_button);
            $(".go_yamen_task").on("click", WG.drop);
            $(".kill_all").on("click", WG.kill_all);
            $(".get_all").on("click", WG.get_all);
            $(".sell_all").on("click", WG.sell_all);
            $(".zdwk").on("click", WG.zdwk);
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
                c('team out ' + my_id);
                KEY.do_command("pack");
                KEY.do_command("pack");
                KEY.do_command("score");
                //$("div.tool-bar.right-bar span.tool-item:eq(8)").click();
                KEY.do_command("showcombat");
            }, 1000);
            setTimeout(KEY.dialog_close,1500);
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
                cmd = cmd instanceof Array ? cmd : cmd.split(';');
                for (var c of cmd) {
                    $("span[WG='WG']").attr("cmd", c).click();
                };
            }
        },
        go: function (p) {
            if (needfind[p] == undefined) {
                if (WG.at(p)) {
                    return;
                }
            }
            if (place[p] != undefined) {
                c('stopstate');
                WG.Send(place[p]);
            }
        },
        at: function (p) {
            var w = $(".room-name").html();
            return w.indexOf(p) == -1 ? false : true;
        },
        smhook: undefined,
        sm_over:false,
        sm: function () {
            if (!WG.smhook) {
                WG.smhook = WG.add_hook('text', function (data) {
                    if (data.msg.indexOf("辛苦了， 你先去休息") >= 0 ||
                        data.msg.indexOf("和本门毫无瓜葛") >= 0 ||
                        data.msg.indexOf("你没有") >= 0
                       ) {
                        WG.remove_hook(WG.smhook);
                        WG.smhook = undefined;
                        WG.sm_over = true;
                    }
                });
            }
            switch (WG.sm_state) {
                case 0:
                    //前往师门接收任务
                    if (WG.sm_over) {
                        c("taskover signin");
                        WG.sm_state = -1;
                        sm_kg=false;
                        WG.sm_over = false;
                        $(".sm_button").text("师门");
                        return yamen();
                    }
                    sm_kg = true;
                    if(room.name == sm_array[family].place){
                        WG.sm_state = 1;
                    } else {
                        MAP.goto(sm_array[family].place);
                    }
                    setTimeout(WG.sm, 500);
                    break;
                case 1:
                    //接受任务
                    var lists = $(".room_items .room-item");
                    var id = null;
                    for (var npc of lists) {
                        if (npc.lastElementChild.lastElementChild == null) {
                            if (npc.lastElementChild.innerText == sm_array[family].npc)
                                id = $(npc).attr("itemid");
                        }
                    }
                    //console.log(id);
                    if (id != undefined) {
                        WG.Send("task sm " + id);
                        WG.Send("task sm " + id);
                        WG.sm_state = 2;
                    } else {
                        WG.updete_npc_id();
                    }
                    setTimeout(WG.sm, 300);
                    break;
                case 2:
                    if (WG.sm_over) {
                        c("taskover signin");
                        WG.sm_state = -1;
                        sm_kg=false;
                        WG.sm_over = false;
                        $(".sm_button").text("师门");
                        return yamen();
                    }
                    var mysm_loser =  GM_getValue(role + "_sm_loser", sm_loser);
                    //获取师门任务物品
                    var item = $("span[cmd$='giveup']:last").parent().prev();
                    if (item.length == 0) {
                        WG.sm_state = 0;
                        setTimeout(WG.sm, 1000);
                        return;
                    };
                    var itemName = item.html();
                    item = item[0].outerHTML;
                    //(逗比写法)
                    //能上交直接上交
                    var tmpObj = $("span[cmd$='giveup']:last").prev();
                    for (let i = 0; i < 6; i++) {
                        if(tmpObj.children().html()){
                            if (tmpObj.html().indexOf(item) >= 0) {
                                tmpObj.click();
                                messageAppend("自动上交" + item);
                                WG.sm_state = 0;
                                setTimeout(WG.sm, 100);
                                return;
                            }
                            tmpObj = tmpObj.prev();
                        }
                    }
                    //不能上交自动购买
                    WG.sm_item = goods[itemName];
                    if ((WG.sm_item != undefined && WG.sm_item.place != '扬州城-药铺') || (WG.sm_item != undefined && WG.sm_item.place == '扬州城-药铺' && item.indexOf('hig') != -1)) {
                        messageAppend("自动购买" + item);
                        WG.sm_state = 3;
                        setTimeout(WG.sm, 100);
                    } else {
                        messageAppend("无法购买" + item);
                        if (mysm_loser == '已停止') {
                            WG.sm_state = -1;
                            $(".sm_button").text("师门(Q)");
                        } else {
                            $("span[cmd$='giveup']:last").click();
                            messageAppend("放弃任务");
                            WG.sm_state = 0;
                            setTimeout(WG.sm, 100);
                            return;
                        }
                    }
                    break;
                case 3:
                    if(room.name == WG.sm_item.place){
                        WG.sm_state = 4;
                    } else {
                        MAP.goto(WG.sm_item.place);
                    }
                    setTimeout(WG.sm, 500);
                    break;
                case 4:
                    if (WG.buy(WG.sm_item)) {
                        WG.sm_state = 0;
                        setTimeout(WG.sm, 500);
                    }
                    break;
                default:
                    break;
            }
        },
        sm_button: function () {
            if (WG.sm_state >= 0) {
                WG.sm_state = -1;
                sm_kg=false;
                $(".sm_button").text("师门");
                setTimeout(yamen, 200);
            } else {
                WG.sm_state = 0;
                WG.sm_over = false;
                $(".sm_button").text("停止");
                setTimeout(WG.sm, 200);
            }
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
        Give: function (items) {
            var tmp = npcs["店小二"];
            if (tmp == undefined) {
                WG.updete_npc_id();
                return false;
            }
            WG.Send("give " + tmp + " " + items);
            return true;

        },
        eq: function (e) {
            WG.Send("eq " + e);
        },
        ask: function (npc, i) {
            npc = npcs[npc];
            if (npc != undefined)
                WG.Send("ask" + i + " " + npc);
            else
                WG.updete_npc_id();
        },
        kill_all: function () {
            var lists = $(".room_items .room-item");
            if(role == cmder && mp_kg){
                c('pty ' + room.id);
            }
            for (var npc of lists) {
                if(npc.innerText.indexOf('宗师') == -1 && npc.innerText.indexOf('武圣') == -1 && npc.innerText.indexOf('武帝') == -1 && npc.innerText.indexOf('武师') == -1 && npc.innerText.indexOf('武士') == -1 && npc.innerText.indexOf('的尸体') == -1){
                    WG.Send("kill " + $(npc).attr("itemid"));

                }
            }
        },

        get_all: function () {
            clearCookie();
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                if(npc.innerText.indexOf('尸体') != -1)
                    WG.Send("get all from " + $(npc).attr("itemid"));
            }
        },

        sell_all: function () {
            document.location.reload();
        },
        drop: function () {
            FB.init();
        },
        xy: function () {
            c('stopstate;jh fam 8 start');
            setTimeout(function(){c('baoming '+ find_npc('郭靖'));}, 1000);
            setTimeout(() => {
                if(user == 1 || user == 2){
                    MAP.goto(721);
                } else if(user == 6 || user == 7){
                    MAP.goto(716);
                } else if(user == 5 || user == 8 || user == 1018){
                    MAP.goto(711);
                } else if(user == 9 || user == 10 || user == 1019){
                    MAP.goto(706);
                }
            }, 3000);
            setTimeout(EQ.toxy, 6000);
            setTimeout(function(){c('liaoshang');}, 9000);
        },
        zdwk: function () {
            WG.timer_close();
            if(user > 1000){setTimeout(function(){c("taskover signin;taskover zz1;jh fam 0 start;go west;go west;go north;go enter;go west;xiulian");}, 2000);} else {c("taskover signin;taskover zz1;wakuang");}
        },

        timer_close: function () {
            if (timer) {
                clearInterval(timer);
                timer = 0;
            }
        },
        wudao_i: '',
        wudao_a:0,
        wudao_auto: function (){
            FB.score_kg = false;
            WG.wudao_i = "去武道塔";
            if(timer == 0){
                timer = self.setInterval(function(){WG.wudao_auto1()},1000);
            }
        },
        buff:'',
        wudao_auto1: function (){
            var hp = $(".progress:eq(0) [style]").attr('style').match(/\d+/g)[0];
            var mp = $(".progress:eq(1) [style]").attr('style').match(/\d+/g)[0];
            if(!FB.score_kg){
                var t = $(".room_items .room-item:first .item-name").text();
                if(hp < 0.0001 && room.id != 6){
                    c('relive;jh fam 0 start;go north;go north;go west');
                } else if(mp < 50){
                    if(t.indexOf("打坐") == -1){
                        c('stopstate;dazuo');
                    }
                } else if((t.indexOf("打坐") == -1 && hp < 95) || (t.indexOf("打坐") != -1 && mp == 100)){
                    if(t.indexOf("疗伤") == -1){
                        c('stopstate;liaoshang');
                    }
                } else if(mp >= 50 && hp >= 95 && t.indexOf("打坐") == -1 && t.indexOf("疗伤") == -1){
                    FB.score_kg = true;
                    if(room.id == 6){c('jh fam 9 start;go enter');}
                }
                if(!FB.score_kg){
                    return;
                }
            }
            if(room.path == 'wudao/ta'){
                WG.wudao_a = ChineseToNumber(room.name.match("第([^%]+)层")[1]);
                if((user > 100) && WG.wudao_a > 99){
                    return WG.zdwk();
                } else if((user == 3 || user == 4) && WG.wudao_a > 78){
                    return WG.zdwk();
                } else if((user == 6 || user == 7 || user == 9 || user == 10) && WG.wudao_a > 78){
                    return WG.zdwk();
                } else if((user == 1 || user == 2 || user == 5 || user == 8) && WG.wudao_a > 78){
                    return WG.zdwk();
                }
            }
            switch (WG.wudao_i){

                case '去武道塔':
                    if (room.name == '武道塔-入口') {
                        c('ask1 ' + find_npc('守门人'));
                        WG.Send("go enter");
                        WG.wudao_i='杀怪';
                    } else {
                        c('jh fam 9 start');
                    }
                    break;
                case '杀怪':
                    if(mp < 50 || hp < 95){
                        FB.score_kg = false;
                        return;
                    }


                    if (WG.jn_c()) {
                        if (room.id == 6){c('jh fam 9 start;go enter');}
                        WG.kill_all();
                        WG.wudao_i='怪死';
                    } else if (WG.wudao_a >= 60 && !(WG.jn_c())){
                        S('目前正在 ' + room.name);
                        if(mp < 50 || hp < 95){
                            FB.score_kg = false;
                        }
                        WG.wudao_i='等待技能CD';
                    }
                    break;
                case '等待技能CD':
                    if(room.id == 6){
                        if(mp < 50 || hp < 95){
                            FB.score_kg = false;
                            return;
                        }

                        if (WG.jn_c()) {

                            if(WG.wudao_a >= 60 && WG.wudao_a < 100){
                                c('jh fam 9 start;go enter');
                                WG.wudao_i='杀怪';
                            } else if(WG.wudao_a >= 100){
                                WG.wudao_i = '祝融';
                            }
                        }
                    } else {
                        c('jh fam 0 start;go north;go north;go west');
                    }
                    break;
                case '怪死':
                    if(!kk_kg){
                        c('go up');
                        if (WG.wudao_a < 60){
                            WG.wudao_i = '杀怪';
                        } else {
                            S('目前正在 ' + room.name);
                            WG.wudao_i = '等待技能CD';
                        }

                    }
                    break;
                case '祝融':
                    if(room.id == 104){
                        auto_kill = false;
                        c('setting auto_pfm 0;kill ' + find_npc('木头人') + ';perform parry.wu;go east');
                        WG.wudao_i = '祝融检查';
                    } else {
                        MAP.goto(104);
                    }
                    break;
                case '祝融检查':
                    if(WG.buff == '祝融' && !kk_kg){
                        c('setting auto_pfm force.xi,force.power,force.wang,dodge.power,parry.wu,sword.wu,throwing.jiang,unarmed.chan;jh fam 9 start;go enter');
                        auto_kill = true;
                        WG.wudao_i = '杀怪';
                    } else if(WG.jn_check('parry.wu',false)){
                        WG.wudao_i = '祝融';
                    }
                    break;
            }

        },
        wudao_autopfm: function () {
            var pfm = wudao_pfm.split(','),y='';
            for (var i=0;i<$("div.combat-panel div.combat-commands.combat-wrap span.pfm-item").length;i++){
                y=y + $("div.combat-panel div.combat-commands.combat-wrap span.pfm-item:eq(" + i + ")").attr( "pid" );
            }
            if(y && y.indexOf("blade") == -1 && y.indexOf("club") == -1 && y.indexOf("sword") == -1){
                c('eq ' + my_wq);
                return;
            }
            if(user == 1 || user == 2 || user == 5 || user == 8){
                for (var p of pfm) {
                    var hp = $(".progress:eq(0) [style]").attr('style').match(/\d+/g)[0];
                    if(hp < 60){
                        if(WG.jn_check('force.huifu',true)){
                            return;
                        } else if(WG.jn_check('force.xi',true)){
                            return;
                        }
                    }
                    for (i=0;i<$("div.combat-panel div.combat-commands.combat-wrap span.pfm-item").length;i++){
                        if ($("div.combat-panel div.combat-commands.combat-wrap span.pfm-item:eq(" + i + ") span").css("left") == "0px" && $("div.combat-panel div.combat-commands.combat-wrap span.pfm-item:eq(" + i + ")").attr( "pid" )==p && !((p == 'parry.yi') && FB.status1)){
                            $("div.combat-panel div.combat-commands.combat-wrap span.pfm-item:eq(" + i + ") ").click();
                            return;
                        }
                    }
                }
            } else {
                for (p of pfm) {
                    hp = $(".progress:eq(0) [style]").attr('style').match(/\d+/g)[0];
                    if(hp < 0 && user > 100){
                        if(WG.jn_check('parry.dao',true)){
                            return;
                        }
                    }
                    for (i=0;i<$("div.combat-panel div.combat-commands.combat-wrap span.pfm-item").length;i++){
                        if ($("div.combat-panel div.combat-commands.combat-wrap span.pfm-item:eq(" + i + ") span").css("left") == "0px" && $("div.combat-panel div.combat-commands.combat-wrap span.pfm-item:eq(" + i + ")").attr( "pid" )==p && !((p == 'sword.poqi' || p == 'unarmed.chan' || p == 'sword.chan') && FB.status)){
                            $("div.combat-panel div.combat-commands.combat-wrap span.pfm-item:eq(" + i + ") ").click();
                            return;
                        }
                    }
                }
            }
        },
        t0:0,
        jn_c: function () {
            if(WG.wudao_a < 50){
                return true;
            } else if(WG.wudao_a >= 50 && WG.wudao_a < 60){
                if(user > 100){
                    return true;
                } else if(user == 3 || user == 4){
                    if(WG.jn_check('sword.wu',false) && (WG.jn_check('unarmed.chan',false) || WG.jn_check('sword.poqi',false))){return true;}
                } else if(user == 1 || user == 2 || user == 5 || user == 8){
                    if(WG.jn_check('unarmed.duo',false)){return true;}
                } else if(user == 6 || user == 7 || user == 9 || user == 10){
                    if(WG.jn_check('sword.chan',false)){return true;}
                }
            } else if(WG.wudao_a >= 60 && WG.wudao_a < 70){
                if(user > 100){
                    return true;
                    //    if(WG.jn_check('sword.wu',false) && (WG.jn_check('unarmed.chan',false) || WG.jn_check('sword.poqi',false))){return true;}
                } else if(user == 3 || user == 4){
                    if(WG.jn_check('sword.wu',false) && WG.jn_check('force.xi',false) && WG.jn_check('unarmed.chan',false) && WG.jn_check('sword.poqi',false)){return true;}
                } else if(user == 1 || user == 2 || user == 5 || user == 8){
                    if(WG.jn_check('unarmed.duo',false) && WG.jn_check('force.xi',false)){return true;}
                } else if(user == 6 || user == 7 || user == 9 || user == 10){
                    if(WG.jn_check('sword.chan',false)){return true;}
                }
            } else if(WG.wudao_a >= 70 && WG.wudao_a < 80){
                if(user > 100){
                    return true;
                } else if(user == 3 || user == 4){
                    if(WG.jn_check('sword.wu',false) && WG.jn_check('force.xi',false) && WG.jn_check('unarmed.chan',false) && WG.jn_check('sword.poqi',false)){return true;}
                } else if(user == 1 || user == 2 || user == 5 || user == 8){
                    if(WG.jn_check('unarmed.duo',false) && WG.jn_check('force.xi',false)){return true;}
                } else if(user == 6 || user == 7 || user == 9 || user == 10){
                    if(WG.jn_check('sword.chan',false)){return true;}
                }
            } else if(WG.wudao_a >= 80 && WG.wudao_a < 90){
                if(user > 100){
                    if(WG.jn_check('sword.wu',false) && WG.jn_check('force.xi',false) && WG.jn_check('force.power',false) && WG.jn_check('sword.poqi',false)){return true;}
                } else if(user == 3 || user == 4){
                    if(WG.jn_check('sword.wu',false) && WG.jn_check('force.xi',false) && WG.jn_check('unarmed.chan',false) && WG.jn_check('sword.poqi',false)){return true;}
                } else if(user == 1 || user == 2 || user == 5 || user == 8){
                    if(WG.jn_check('unarmed.duo',false) && WG.jn_check('force.xi',false)){return true;}
                } else if(user == 6 || user == 7 || user == 9 || user == 10){
                    if(WG.jn_check('sword.chan',false)){return true;}
                }
            } else if(WG.wudao_a >= 90 && WG.wudao_a < 100){
                if(user > 100){
                    if(WG.jn_check('sword.wu',false) && WG.jn_check('force.xi',false) && WG.jn_check('force.power',false) && WG.jn_check('sword.poqi',false)){return true;}
                } else if(user == 3 || user == 4){
                    if(WG.jn_check('sword.wu',false) && WG.jn_check('force.xi',false) && WG.jn_check('unarmed.chan',false) && WG.jn_check('sword.poqi',false)){return true;}
                } else if(user == 1 || user == 2 || user == 5 || user == 8){
                    if(WG.jn_check('unarmed.duo',false) && WG.jn_check('force.xi',false)){return true;}
                } else if(user == 6 || user == 7 || user == 9 || user == 10){
                    if(WG.jn_check('sword.chan',false)){return true;}
                }
            }
            return false;
        },
        jn_run: function () {
            for (var i=0;i<$("div.combat-panel div.combat-commands.combat-wrap span.pfm-item").length;i++){
                var y=y + $("div.combat-panel div.combat-commands.combat-wrap span.pfm-item:eq(" + i + ")").attr( "pid" );
            };
            if(y && y.indexOf("blade") == -1 && y.indexOf("club") == -1 && y.indexOf("sword") == -1){
                WG.eq(my_wq);
            };
            var t=(new Date()).getTime();
            if(t >= WG.t0+7700 && t <= WG.t0+8300){
                WG.jn_check('sword.wuwo',true);
            }else if(t >= WG.t0+19700 && t <= WG.t0+20300 ){
                WG.jn_check('unarmed.wuwo',true);
            }
        },
        jn_check: function (str,c) {
            for (var i=0;i<$("div.combat-panel div.combat-commands.combat-wrap span.pfm-item").length;i++){
                if ($("div.combat-panel div.combat-commands.combat-wrap span.pfm-item:eq(" + i + ") span").css("left") == "0px" && $("div.combat-panel div.combat-commands.combat-wrap span.pfm-item:eq(" + i + ")").attr( "pid" )==str){
                    if(c){
                        $("div.combat-panel div.combat-commands.combat-wrap span.pfm-item:eq(" + i + ") ").click();
                    }
                    return true;
                }
            }
            return false;
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
                this.needGrove = 0;
                this.fbnum = 0;
                return WG.sm_button();
            }
        },
        grove_ask_info: function () {
            return prompt("请输入需要秒进秒退的副本次数", "");
        },
        grove_auto: function () {
            if (timer == 0) {
                //		this.needGrove = this.grove_ask_info();
                this.needGrove = 20;
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
<div style="width:50%;float:left">
<span>潜能计算器</span>
<input type="number" id="c" placeholder="初始等级" style="width:50%" class="mui-input-speech"><br/>
<input type="number" id="m" placeholder="目标等级" style="width:50%"><br/>
<select id="se" style="width:50%">
<option value='0'>选择技能颜色</option>
<option value='1' style="color: #c0c0c0;">白色</option>
<option value='2' style="color:#00ff00;">绿色</option>
<option value='3' style="color:#00ffff;">蓝色</option>
<option value='4' style="color:#ffff00;">黄色</option>
<option value='5' style="color:#912cee;">紫色</option>
<option value='6' style="color: #ffa600;">橙色</option>
</select><br/>
<input type="button" value="计算" style="width:50%"  id="qnjs"><br/>
</div>
<div style="width:50%;float:left">
<span>开花计算器</span>
<input type="number" id="nl" placeholder="当前内力" style="width:50%" class="mui-input-speech"><br/>
<input type="number" id="xg" placeholder="先天根骨" style="width:50%"><br/>
<input type="number" id="hg" placeholder="后天根骨" style="width:50%"><br/>
<input type="button" value="计算" id = "kaihua" style="width:50%" <br/>
<label>人花分值：5000  地花分值：6500  天花分值：8000</label>
</div>

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
<option value="武馆">武馆</option>
</select>
</span>
<span><label for="sm_loser">师门自动放弃： </label><select style='width:80px' id = "sm_loser">
<option value="已停止">已停止</option>
<option value="已开启">已开启</option>
</select>
</span>
<span><label for="jn_wxk">无限控： </label><select style='width:80px' id = "jn_wxk">
<option value="已停止">已停止</option>
<option value="已开启">已开启</option>
</select>
</span>
<span><label for="wudao_pfm">武道自动攻击： </label><input style='width:80px' type="text" id="wudao_pfm" name="wudao_pfm" value="">
</span>
<span><label for="marry_kiss">自动喜宴： </label><select style='width:80px' id = "marry_kiss">
<option value="已停止">已停止</option>
<option value="已开启">已开启</option>
</select>
</span>
<span><label for="ks_Boss">自动传到boss： </label><select  style='width:80px' id = "ks_Boss">
<option value="已停止">已停止</option>
<option value="已开启">已开启</option>
</select>
</span>
<span><label for="show_hp">全局显血： </label><select style='width:80px' id = "show_hp">
<option value="已停止">已停止</option>
<option value="已开启">已开启</option>
</select>
</span>
</span>
<span><label for="auto_eq">BOSS击杀时自动换装： </label><select style='width:80px' id = "auto_eq">
<option value="0">已停止</option>
<option value="1">套装1</option>
<option value="2">套装2</option>
<option value="3">套装3</option>
</select>
</span>
<span><label for="ks_pfm">叫杀延时(ms)： </label><input style='width:80px' type="text" id="ks_pfm" name="ks_pfm" value=""></span>
<div class="item-commands"><span class="updete_id_all">初始化ID</span></div>
</div>
`;
            messageAppend(a);
            $('#family').val(family);
            $("#family").change(function () {
                family = $("#family").val();
                GM_setValue(role + "_family", family);
            });
            $('#wudao_pfm').val(wudao_pfm);
            $('#wudao_pfm').focusout(function () {
                wudao_pfm = $('#wudao_pfm').val();
                GM_setValue(role + "_wudao_pfm", wudao_pfm);
            });
            $('#sm_loser').val(sm_loser);
            $('#sm_loser').focusout(function () {
                sm_loser = $('#sm_loser').val();
                GM_setValue(role + "_sm_loser", sm_loser);
            });
            $('#jn_wxk').val(jn_wxk);
            $('#jn_wxk').focusout(function () {
                jn_wxk = $('#jn_wxk').val();
                GM_setValue(role + "_jn_wxk", jn_wxk);
            });
            $('#ks_pfm').val(ks_pfm);
            $('#ks_pfm').focusout(function () {
                ks_pfm = $('#ks_pfm').val();
                GM_setValue(role + "_ks_pfm", ks_pfm);
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
            $('#show_hp').val(showHP);
            $('#show_hp').change(function () {
                showHP = $('#show_hp').val();
                GM_setValue(role + "_showHP", showHP);
                Helper.showallhp();
            });
            $('#auto_eq').val(autoeq);
            $('#auto_eq').change(function () {
                autoeq = $('#auto_eq').val();
                GM_setValue(role + "_auto_eq", autoeq);

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
    function c(str){
        WG.Send(str);
    }
    function S(str){
        messageAppend(str);
    }
    var my_skills = {};
    function xuexi(){
        var a,b;
        KEY.dialog_close();
        $("div.tool-bar.right-bar span.tool-item:eq(6)").click();
        setTimeout(() => {a = xuexi_check();log(a);},1000);
        setTimeout(() => {MAP.goto(a[0]);},2000);
        setTimeout(() => {
            if(a[1] == '练习'){
                exe('setting auto_work lianxi force 900,lianxi zixiashengong 900,wakuang;lianxi force 900;lianxi zixiashengong 900;wakuang');
                return;
            } else if(a[1] == '打坐'){
                c('enable force zixiashengong;dazuo');
                return;
            }
            b = find_npc2(a[1]);
            if(b){
                c('bai ' + b + ';xue ' + a[2] + ' from ' + b);
            } else {
                return WG.zdwk();
            }
        },3000);
    }
    function xuexi_check(){
        var skills = ['literate','unarmed','force','dodge','sword','parry','huashanxinfa','huashanjianfa'];
        var skills1 = ['unarmed','force','dodge','sword','parry'];
        var skills2 = ['literate','zixiashengong','huashanjianfa','feiyanhuixiang','poyuquan'];
        var skills3 = ['literate','unarmed','force','dodge','sword','parry','zixiashengong','poyuquan'];
        var skills4 = ['kuangfengkuaijian'];
        var skills5 = ['literate','unarmed','force','dodge','sword','parry','zixiashengong','poyuquan','kuangfengkuaijian'];
        var skills6 = ['force','zixiashengong'];
        log(my_skills);
        for(var x of skills){
            if(!my_skills[x] || my_skills[x] < 100){
                return [301,'高根明',x];
            }
        }
        if(my.max_mp < 1000){
            return [27,'打坐',x];
        }
        for(var x1 of skills1){
            if(!my_skills[x1] || my_skills[x1] < 300){
                return [33,'武馆教习',x1];
            }
        }
        for(var x2 of skills2){
            if(!my_skills[x2] || my_skills[x2] < 300){
                return [311,'岳不群',x2];
            }
        }
        if(my.max_mp < 10000){
            return [27,'打坐',x2];
        }
        for(var x3 of skills3){
            if(!my_skills[x3] || my_skills[x3] < 500){
                return [311,'岳不群',x3];
            }
        }
        for(var x4 of skills4){
            if(!my_skills[x4] || my_skills[x4] < 500){
                return [307,'封不平',x4];
            }
        }
        for(var x5 of skills5){
            if(!my_skills[x5] || my_skills[x5] < 800){
                return [320,'风清扬',x5];
            }
        }
        for(var x6 of skills6){
            if(!my_skills[x6] || my_skills[x6] < 900){
                return [27,'练习',x5];
            }
        }
        return [27,'打坐',x5];
    }

    var EQ = {
        tokill: function (){
            var str = 'stopstate',zb1,zb2,zb3;
            if(user == 3 || user == 4){str = str + ';enable sword dugujiujian2;enable unarmed dasongyangshenzhang;enable force zixiashengong2';}
            if(user == 1018 || user == 1019){str = str + ';enable sword dugujiujian2;enable unarmed sanyinzhua;enable force bahuanggong;enable dodge tagexing;enable blade kuangfengkuaidao';}
            if(user == 1 || user == 2 || user == 5 || user == 8){str = str + ';enable sword yitianjianfa2;enable unarmed jiuyinbaiguzhao2;enable force linjizhuang2';}
            if(user == 6 || user == 7 || user == 9 || user == 10){str = str + ';enable sword taijijian2;enable unarmed dasongyangshenzhang;enable force taijishengong2';}
            zb1 = find_wuping('软猬甲','★★★');
            zb2 = find_wuping('混天蓑衣1','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            } else if(zb2){
                str = str + ';eq ' +zb2[0];
            }
            zb1 = find_wuping('罗汉僧鞋','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            zb1 = find_wuping('疤面面具','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            zb1 = find_wuping('天龙遗珠','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            zb1 = find_wuping('温仪的香囊','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            zb1 = find_wuping('邀月的手镯','★');
            if(zb1){
                str = str + ';eq ' + zb1[0];
            }
            zb1 = find_wuping('混天腰带','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            if(user > 100){
                zb1 = find_wuping('倚天剑','★★★');
            } else {
                zb1 = find_wuping('君子剑','★★★');
                zb2 = find_wuping('真武剑','★★★');
                zb3 = find_wuping('曙光剑','★★★');
            }
            if(zb1){
                str = str + ';eq ' +zb1[0];
            } else if(zb2){
                str = str + ';eq ' +zb2[0];
            } else if(zb3){
                str = str + ';eq ' +zb3[0];
            }
            str = str + ';pack';
            c(str);
        },
        tolx: function (){
            var str = 'stopstate',zb1,zb2,zb3;
            log(bao);
            if(user == 1018 || user == 1019){
                str = str + ';enable sword quanzhenjianfa;enable unarmed canhezhi;enable dodge tiannanbu;enable blade hujiadaofa';
            } else {
                str = str + ';enable sword quanzhenjianfa;enable unarmed canhezhi';
            }
            zb1 = find_wuping('真武道袍','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            zb1 = find_wuping('曙光鞋','★★★');
            zb2 = find_wuping('真武道靴','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            } else if(zb2){
                str = str + ';eq ' +zb2[0];
            }
            zb1 = find_wuping('涟星的冰玉簪','★★★');//真武道簪
            zb2 = find_wuping('真武道簪','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            } else if(zb2){
                str = str + ';eq ' +zb2[0];
            }
            zb1 = find_wuping('杨不悔的项链','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            zb1 = find_wuping('药王神篇','★★★');
            zb2 = find_wuping('花无缺的玉佩','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            } else if(zb2){
                str = str + ';eq ' +zb2[0];
            }
            zb1 = find_wuping('崔莺莺的手镯','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            zb1 = find_wuping('曙光束腰','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            if(user > 100){
                zb1 = find_wuping('倚天剑','★★★');
            } else {
                zb1 = find_wuping('铁镐');
            }
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            str = str + ';pack';
            c(str);
        },
        toxy: function (){
            var str = 'stopstatec;setting off_plist 0',zb1,zb2,zb3;
            log(bao);
            if(user == 1018 || user == 1019){
                str = str + ';enable sword dugujiujian2;enable unarmed sanyinzhua;enable force mingyugong;enable blade kuangfengkuaidao';
            } else if(user == 3 || user == 4){
                str = str + ';enable sword dugujiujian2;enable unarmed dasongyangshenzhang;enable force mingyugong';
            } else if(user == 1 || user == 2 || user == 5 || user == 8){
                str = str + ';enable sword yitianjianfa2;enable unarmed jiuyinbaiguzhao2;enable force mingyugong';
            } else if(user == 6 || user == 7 || user == 9 || user == 10){
                str = str + ';enable sword taijijian2;enable unarmed taijiquan2;enable force mingyugong';
            }
            zb1 = find_wuping('软猬甲1','★★★');
            zb2 = find_wuping('混天蓑衣','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            } else if(zb2){
                str = str + ';eq ' +zb2[0];
            }
            zb1 = find_wuping('罗汉僧鞋','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            zb1 = find_wuping('疤面面具','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            zb1 = find_wuping('天龙遗珠','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            zb1 = find_wuping('温仪的香囊','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            zb1 = find_wuping('邀月的手镯','★★★');
            zb2 = find_wuping('混天护腕','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            } else if(zb2){
                str = str + ';eq ' +zb2[0];
            }
            zb1 = find_wuping('混天腰带','★★★');
            if(zb1){
                str = str + ';eq ' +zb1[0];
            }
            if(user == 3){
                zb1 = find_wuping('真武剑','★★★');
            } else if(user == 4){
                zb1 = find_wuping('曙光剑','★★★');
            } else if(user == 1018 || user == 1019){
                zb1 = find_wuping('倚天剑','★★★');
            } else {
                zb1 = find_wuping('罗汉戒刀','★★★');
            }
            if(zb1){
                str = str + ';eq ' + zb1[0];
            }
            str = str + ';pack';
            c(str);
        }
    }
    function lianxi(){
        var t = 0;
        if(room.id != 41){
            t = 2000;
            setTimeout(() => {MAP.goto(41);},t);
        }

        setTimeout(() => {
            if (user < 11){
                var x = 2500;
            } else if (user > 100){
                x = 3000;
            }
            EQ.tolx();
            //exe('stopstate;setting auto_work lianxi sword '+x+',lianxi unarmed '+x+',lianxi staff '+x+',lianxi whip '+x+',lianxi blade '+x+',lianxi club '+x+',lianxi dodge '+x+',lianxi throwing '+x+',lianxi force '+x+',lianxi parry '+x+',wakuang;lianxi sword '+x+';lianxi unarmed '+x+';lianxi staff '+x+';lianxi whip '+x+';lianxi blade '+x+';lianxi club '+x+';lianxi dodge '+x+';lianxi throwing '+x+';lianxi force '+x+';lianxi parry '+x+';wakuang');
           if (user < 11){
                exe('stopstate;setting auto_work wakuang');
            } else if (user > 100){
                exe('stopstate;setting auto_work xiulian');
            }
            exe('lianxi quanzhenjianfa;lianxi canhezhi;lianxi taijijian2;lianxi taijiquan12;lianxi taijishengong2;lianxi dugujiujian2;lianxi zixiashengong2;lianxi jiuyinbaiguzhao2;lianxi yitianjianfa2;lianxi linjizhuang2;lianxi tagexing;lianxi kuangfengkuaidao;lianxi zhongpingqiang;lianxi shedaoqigong;lianxi qiufengfuchen;lianxi yunlongbian;lianxi jinshezhui;lianxi yihuajiemu');
            if (user < 11){
                exe('wakuang');
            } else if (user > 100){
                exe('xiulian');
            }
        }, t+2000);
    }

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


        //找boss,boss不在,-1,
        findboss: function (data, bossname, callback) {
            for (let i = 0; i < data.items.length; i++) {
                if (data.items[i] != 0) {
                    if (data.items[i].name.indexOf(bossname) >= 0) {
                        callback(data.items[i].id);
                    }
                }
            }
            callback(-1);
        },
        ksboss: '',
        marryhy: '',
        kksBoss: function (data) {
            var boss_place = boss_place = data.content.match("出现在([^%]+)一带。");
            var boss_name = data.content.match("听说([^%]+)出现在");
            if (boss_name == null || boss_place == null) {
                return;
            }
            boss_name = data.content.match("听说([^%]+)出现在")[1];
            boss_place = data.content.match("出现在([^%]+)一带。")[1];
            var autoKsBoss = GM_getValue(role + "_autoKsBoss", autoKsBoss);
            var ks_pfm_p = GM_getValue(role + "_ks_pfm", ks_pfm);
            var autoeq = GM_getValue(role + "_auto_eq", autoeq);
            console.log("boss");
            console.log(boss_place);
            messageAppend("自动前往BOSS地点");
            WG.Send("stopstate");
            WG.go(boss_place);
            this.ksboss = WG.add_hook(["items", "itemadd", "die"], function (data) {
                if (data.type == "items") {
                    if (!WG.at(boss_place)) {
                        return;
                    }
                    Helper.findboss(data, boss_name, function (bid) {
                        if (bid != -1) {
                            next = 999;
                            EQ.tokill();
                            setTimeout(() => {
                                WG.Send("kill " + bid);
                                //WG.Send("select " + bid);
                                WG.wudao_autopfm();
                                next = 0;
                            }, Number(ks_pfm_p));
                        } else {
                            if (next == 999) {
                                console.log('found');
                                return;
                            }
                            let lj = needfind[boss_place];
                            if (needfind[boss_place] != undefined && next < lj.length) {
                                setTimeout(() => {
                                    console.log(lj[next]);
                                    WG.Send(lj[next]);
                                    next++;
                                }, 1000);


                            } else {
                                console.log("not found");
                            }
                        }
                    });

                }
                if (data.type == "itemadd") {
                    if (data.name.indexOf(boss_name) >= 0) {
                        next = 0;
                        WG.get_all();
                        console.log(this.index);
                        WG.remove_hook(this.index);
                    }
                }
                if (data.type == "die") {
                    next = 0;
                    WG.Send('relive');
                    console.log(this.index);
                    WG.remove_hook(this.index);
                }
            });
            console.log(this.ksboss);
            setTimeout(() => {
                console.log("复活挖矿");
                WG.Send('relive');
                WG.remove_hook(this.ksboss);
                WG.zdwk();
                next = 0;
            }, 30000);

        },

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
                        messageAppend("<hiy>你太勤快了, 1秒后回去挖矿</hiy>")
                        console.log("xy" + this.index);
                        WG.remove_hook(this.index);
                    }
                    if (/^店小二拦住你说道：这位(.+)，不好意思，婚宴宾客已经太多了。$/.test(data.msg)) {
                        console.log("客满");
                        messageAppend("<hiy>你来太晚了, 1秒后回去挖矿</hiy>")

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
                WG.zdwk();
                next = 0;
            }, 30000);
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
        }
    };
    var room,kk_timer=0,sm_kg=false,kk_kg;
    var wen_kg,wen_i='恢复';
    var FB={
        fb_i: '去请安',
        init_kg:false,
        status:false,
        status1:false,
        init: function (){
            switch (FB.fb_i){
                case '去请安':
                    //	武当派-太子岩
                    c('stopstate');
                    if(family=='武当'){
                        WG.go('武当派-太子岩');
                    }else if(family=='峨眉'){
                        WG.go('峨眉派-广场');
                    }else if(family=='华山'){
                        WG.go('华山派-练武场');
                    }else if(family=='逍遥'){
                        c('jh fam 5 start;go west');
                    }
                    FB.fb_i = '请安';
                    setTimeout(FB.init, 700);
                    break;
                case "请安":
                    var lists = $(".room_items .room-item");
                    var id = null;
                    for (var npc of lists) {
                        if (npc.innerText.indexOf("首席弟子") != -1 || npc.innerText.indexOf("峨眉大师姐") != -1)
                            id = $(npc).attr("itemid");
                    };
                    //console.log(id);
                    if (id != undefined) {
                        WG.Send("ask2 " + id);
                        FB.fb_i = '包命令';
                    } else {
                        WG.updete_npc_id();
                    }
                    setTimeout(FB.init, 300);
                    break;
                case '包命令':
                    bao_kg = false;
                    c("pack");
                    FB.fb_i = '检查养精丹';
                    setTimeout(FB.init, 500);
                    break;
                case '检查养精丹':
                    if(bao_kg){
                        KEY.dialog_close();
                        var x=find_wuping('<hig>养精丹</hig>');
                        var y=find_wuping('<hic>养精丹</hic>');
                        S(y);
                        if(y){
                            for (var i=0;i<12;i++)
                            {
                                exe('use '+ y[0]);
                            }
                        }

                        S(x);
                        if(!x || (x && x[1]<10)){
                            FB.fb_i = '去药铺';
                        }else{
                            for (i=0;i<12;i++)
                            {
                                exe('use '+ x[0]);
                            }
                            FB.fb_i = '去住房';
                        }
                    }else{
                        FB.fb_i = '包命令';
                    }
                    setTimeout(FB.init, 500);
                    break;
                case '去药铺':
                    WG.go('扬州城-药铺');
                    FB.init_kg = true;
                    if (!FB.buy('养精丹')) {
                        setTimeout(FB.init, 1000);
                    }else{
                        FB.fb_i = '包命令';
                        setTimeout(FB.init, 500);
                    }
                    break;
                case '去住房':
                    WG.go('住房');
                    setTimeout(FB.init, 10000);
                    FB.fb_i = '去副本';
                    break;
                case '去副本':
                    FB.fb_i = '去请安';
                    EQ.tokill();
                    setTimeout(FB.start, 2000);
                    //  setTimeout(WG.sm_button, 2000);
                    break;
            }
        },
        buy: function (good) {
            var tmp = npcs["药铺老板 平一指"];
            if (tmp == undefined) {
                WG.updete_npc_id();
                return false;
            }
            WG.Send("list " + tmp);
            WG.Send("buy 100 " + goods[good].id + " from " + tmp);
            return true;
        },
        start: function () {
            if(user == 1018){
                return FB.q_fb('cr xuedao/shankou 0 10');
            } else if(user == 1019){
                return FB.q_fb('cr xuedao/shankou 0 10');
            } else if(user == 1){
                return FB.q_fb('cr lingjiu/shanjiao 0 10');
            } else if(user == 2){
                return FB.q_fb('cr lingjiu/shanjiao 0 10');
            } else if(user == 3){
                return FB.q_fb('cr mj/shanmen 0 10');
            } else if(user == 4){
                return FB.q_fb('cr lingjiu/shanjiao 0 10');
            } else if(user == 5){
                return FB.q_fb('cr lingjiu/shanjiao 0 10');
            } else if(user == 6){
                return FB.q_fb('cr lingjiu/shanjiao 0 10');
            } else if(user == 7){
                return FB.q_fb('cr lingjiu/shanjiao 0 10');
            } else if(user == 8){
                return FB.q_fb('cr lingjiu/shanjiao 0 10');
            } else if(user == 9){
                return FB.q_fb('cr lingjiu/shanjiao 0 10');
            } else if(user == 10){
                return FB.q_fb('cr lingjiu/shanjiao 0 10');
            } else {
                return WG.grove_auto();
            }
        },
        int:0,
        lj:[],
        x:0,
        y:0,
        need_x:0,
        huifu_hp:false,
        huifu_mp:false,
        score_kg:false,
        //cr xingxiu/xxh6
        //2002 天狼子的尸体
        //2003 摘星子的尸体
        //2004 狮吼子的尸体
        //2005 阿紫的尸体
        //2006 出尘子的尸体
        //2007 丁春秋的尸体
        //<hiy>三阴蜈蚣爪残页</hiy>
        xingxiu: function (){
            FB.score_kg = false;
            FB.i = "进副本";
            FB.x = 0;
            FB.need_x = 0;
            KEY.dialog_close();
            $("div.tool-bar.right-bar span.tool-item:eq(5)").click();
            c('pack');
            FB.lj = [2002,2003,2004,2005,2006,2007];
            if(timer == 0){
                timer = self.setInterval(function(){FB.xingxiu1()},500);
            }
        },
        xingxiu1: function (){
            if(!FB.score_kg){
                var t = $(".room_items .room-item:first .item-name").text();
                var hp = $(".progress:eq(0) [style]").attr('style').match(/\d+/g)[0];
                var mp = $(".progress:eq(1) [style]").attr('style').match(/\d+/g)[0];
                if(hp < 0.5 && room.id != 6){
                    c('relive;jh fam 0 start;go north;go north;go west');
                    FB.i = "进副本";
                } else if(mp >= 50 && hp >= 95){
                    FB.score_kg = true;
                    if(t.indexOf("疗伤") != -1 || t.indexOf("打坐") != -1){
                        c('stopstate');
                    }
                } else if(mp < 50){
                    if(t.indexOf("打坐") == -1){
                        c('stopstate;dazuo');
                    }
                } else if((t.indexOf("打坐") == -1 && hp < 95) || (t.indexOf("打坐") != -1 && mp == 100 && hp < 95)){
                    if(t.indexOf("疗伤") == -1){
                        c('stopstate;liaoshang');
                    }
                }
                return;
            }
            switch (FB.i){
                case '进副本':
                    if(room.id == 2001){
                        FB.i = "杀怪";
                    } else {
                        var a = find_wuping('<hiy>三阴蜈蚣爪残页</hiy>');
                        S('<hiy>三阴蜈蚣爪残页</hiy>有' + a[1] + '个');
                        S('已经完成副本' + FB.need_x + '次.');
                        if(a[1] > 49 || FB.need_x > 19){
                            S("<hir>******停止自动副本******</hir>");
                            WG.timer_close();
                            return WG.sm_button();
                        }
                        MAP.goto(2001);
                    }
                    break;
                case '杀怪':

                    if(room.id == FB.lj[FB.x]){
                        if(!kk_kg){
                            if (find_npc2('的尸体')){
                                FB.x++;
                                if(FB.x >= FB.lj.length){
                                    FB.i = "出副本";
                                }
                            } else {
                                WG.kill_all();
                            }
                        }
                    } else {
                        MAP.goto(FB.lj[FB.x]);
                    }
                    break;
                case '出副本':
                    FB.x = 0;
                    c('cr over;pack;tasks');
                    FB.score_kg = false;
                    FB.i = "进副本";
                    break;
            }
        },


        //包不同的尸体 2303
        //慕容复的尸体 2307
        //王夫人的尸体 2311
        //慕容博的尸体 2313 search
        murong: function (){
            FB.score_kg = false;
            FB.i = "进副本";
            FB.x = 0;
            FB.need_x = 0;
            KEY.dialog_close();
            $("div.tool-bar.right-bar span.tool-item:eq(5)").click();
            c('pack;enable force mingyugong');
            if(timer == 0){
                timer = self.setInterval(function(){FB.murong1()},500);
            }
        },
        murong1: function (){
            var hp = $(".progress:eq(0) [style]").attr('style').match(/\d+/g)[0];

            if(!FB.score_kg){
                var t = $(".room_items .room-item:first .item-name").text();
                var mp = $(".progress:eq(1) [style]").attr('style').match(/\d+/g)[0];
                if(hp < 0.05 && room.id != 6){
                    c('relive;jh fam 0 start;go north;go north;go west');
                    FB.i = "进副本";
                } else if(mp >= 50 && hp >= 95 && !my_debuff){
                    FB.score_kg = true;
                    if(t.indexOf("疗伤") != -1 || t.indexOf("打坐") != -1){
                        c('stopstate');
                    }
                } else if(mp < 50){
                    if(t.indexOf("打坐") == -1){
                        c('stopstate;dazuo');
                    }
                } else if((t.indexOf("打坐") == -1 && hp < 95) || (t.indexOf("打坐") != -1 && mp == 100 && hp < 95)){
                    if(t.indexOf("疗伤") == -1){
                        c('stopstate;liaoshang');
                    }
                }
                return;
            }
            switch (FB.i){
                case '进副本':
                    if(room.id == 2301){
                        FB.i = "杀包不同";
                    } else {
                        var a = find_wuping('<HIZ>参合指残页</HIZ>');
                        S('<HIZ>参合指残页</HIZ>有' + a[1] + '个');
                        S('已经完成副本' + FB.need_x + '次.');
                        if(a[1] > 99 || FB.need_x > 19){
                            S("<hir>******停止自动副本******</hir>");
                            c('enable force zixiashengong2');
                            WG.timer_close();
                            return WG.sm_button();
                        }
                        MAP.goto(2301);
                    }
                    break;
                case '杀包不同':
                    if(room.id == 2303){
                        if(!kk_kg){
                            if (find_npc('包不同的尸体')){
                                FB.i = "杀慕容复";
                            } else {
                                WG.kill_all();
                            }
                        }
                    } else {
                        MAP.goto(2303);
                    }
                    break;
                case '杀慕容复':
                    if(room.id == 2307){
                        if(!kk_kg){
                            if (find_npc('慕容复的尸体')){
                                FB.i = "杀王夫人";
                            } else {
                                if(hp < 95){
                                    FB.score_kg = false;
                                } else {
                                    WG.kill_all();
                                }
                            }
                        }
                    } else {
                        MAP.goto(2307);
                    }
                    break;
                case '杀王夫人':
                    if(room.id == 2311){
                        if(!kk_kg){
                            if (find_npc('王夫人的尸体')){
                                FB.i = "搜索";
                            } else {
                                if(hp < 95){
                                    FB.score_kg = false;
                                } else {
                                    WG.kill_all();
                                }
                            }
                        }
                    } else {
                        MAP.goto(2311);
                    }
                    break;
                case '搜索':
                    if(room.id == 2315){
                        c('search');
                        FB.score_kg = false;
                        FB.i = "杀慕容博";
                    } else {
                        MAP.goto(2315);
                    }
                    break;
                case '杀慕容博':
                    if(room.id == 2313){
                        if(!kk_kg){
                            if (find_npc('慕容博的尸体')){
                                FB.i = "出副本";
                            } else {
                                if(hp < 95){
                                    FB.score_kg = false;
                                } else {
                                    WG.kill_all();
                                }
                            }
                        }
                    } else if (WG.jn_check('sword.wu',false) && WG.jn_check('unarmed.chan',false) && WG.jn_check('sword.poqi',false)) {
                        MAP.goto(2313);
                    }
                    break;
                case '出副本':
                    FB.x = 0;
                    c('cr over;pack;tasks');
                    FB.score_kg = false;
                    FB.i = "进副本";
                    break;
            }
        },

        //cr huashan/yihua/shandao
        //2203 花月奴的尸体
        //2205 移花宫女弟子的尸体
        //2206 移花宫女弟子的尸体
        //2207 涟星的尸体
        //2208 邀月的尸体
        //{"type":"item","desc":"这是一丛美丽的玫瑰花丛，你数了下大概有5朵花。"}  look hua
        //2209 pushleft bed   pushright bed
        //2211 花无缺的尸体 open xia
        left:0,
        right:0,
        yihua: function (){
            FB.score_kg = false;
            FB.i = "进副本";
            if(timer == 0){
                timer = self.setInterval(function(){FB.yihua1()},500);
            }
        },
        yihua1: function (){
            if(!FB.score_kg){
                var t = $(".room_items .room-item:first .item-name").text();
                var hp = $(".progress:eq(0) [style]").attr('style').match(/\d+/g)[0];
                var mp = $(".progress:eq(1) [style]").attr('style').match(/\d+/g)[0];
                if(mp >= 50 && hp >= 95 && !my_debuff){
                    FB.score_kg = true;
                    if(t.indexOf("疗伤") != -1 || t.indexOf("打坐") != -1){
                        c('stopstate');
                    }
                } else if(hp < 0.05 && room.id != 6){
                    c('relive');
                    MAP.goto(6);
                    FB.i = "进副本";
                } else if(mp < 50){
                    if(t.indexOf("打坐") == -1){
                        c('stopstate;dazuo');
                    }
                } else if((t.indexOf("打坐") == -1 && hp < 95) || (t.indexOf("打坐") != -1 && mp == 100 && hp < 95)){
                    if(t.indexOf("疗伤") == -1){
                        c('stopstate;liaoshang');
                    }
                }
                return;
            }
            switch (FB.i){
                case '进副本':
                    if(room.id == 2201){
                        FB.i = "过花丛";
                    } else {
                        var a = find_wuping('<HIZ>移花接木残页</HIZ>');
                        S('<HIZ>移花接木残页</HIZ>有' + a[1] + '个');
                        if(my.jingli == 0 || a[1] > 99){
                            S("<hir>******停止自动副本******</hir>");
                            WG.timer_close();
                            return;
                        }
                        MAP.goto(2201);
                    }
                    break;
                case '过花丛':
                    exe('go south;go south;go south;go south;go south;go south;go south;go south;go south');
                    FB.i = "恢复";
                    break;
                case '恢复':
                    if (cmds.length == 0) {
                        FB.score_kg = false;
                        FB.i = "去杀花月奴";
                    }
                    break;
                case '去杀花月奴':
                    if(room.id == 2203){
                        FB.score_kg = false;
                        FB.i = "杀花月奴";
                    } else if (cmds.length == 0) {
                        MAP.goto(2203);
                    }
                    break;
                case '杀花月奴':
                    if(room.id == 2203){
                        if(!kk_kg){
                            if (find_npc('花月奴的尸体')){
                                FB.i = "杀女弟子1";
                            } else {
                                WG.kill_all();
                            }
                        }
                    } else {
                        MAP.goto(2203);
                    }
                    break;
                case '杀女弟子1':
                    if(room.id == 2205){
                        if(!kk_kg){
                            if (find_npc('移花宫女弟子的尸体')){
                                FB.i = "杀女弟子2";
                            } else {
                                WG.kill_all();
                            }
                        }
                    } else {
                        MAP.goto(2205);
                    }
                    break;
                case '杀女弟子2':
                    if(room.id == 2206){
                        if(!kk_kg){
                            if (find_npc('移花宫女弟子的尸体')){
                                FB.score_kg = false;
                                FB.i = "杀涟星";
                            } else {
                                WG.kill_all();
                            }
                        }
                    } else {
                        MAP.goto(2206);
                    }
                    break;
                case '杀涟星':
                    if(room.id == 2207){
                        if(!kk_kg){
                            if (find_npc('涟星的尸体')){
                                FB.i = "杀邀月";
                            } else {
                                c('look hua');
                                if(user == 3 || user ==4){
                                    c('setting auto_pfm force.xi,dodge.power,parry.wu,sword.wu,throwing.jiang,sword.poqi')
                                }
                                WG.kill_all();
                            }
                        }
                    } else if (FB.yihua_jn()) {
                        MAP.goto(2207);
                    }
                    break;
                case '杀邀月':
                    if(room.id == 2208){
                        if(!kk_kg){
                            if (find_npc('邀月的尸体')){
                                FB.i = "去推床";
                            } else {
                                c('look hua');
                                if(user == 3 || user ==4){
                                    c('setting auto_pfm force.xi,dodge.power,parry.wu,sword.wu,throwing.jiang,unarmed.chan')
                                }
                                WG.kill_all();
                            }
                        }
                    } else if(FB.yihua_jn2()){
                        MAP.goto(2208);
                    }
                    break;
                case '去推床':
                    if(room.id == 2209){
                        for (var i=0;i<FB.left;i++) {
                            exe('pushleft bed');
                        }
                        for (i=0;i<FB.right;i++) {
                            exe('pushright bed');
                        }
                        exe('wait;wait');
                        FB.i = "杀花无缺";
                    } else {
                        MAP.goto(2209);
                    }
                    break;
                case '杀花无缺':
                    if(room.id == 2211){
                        if(!kk_kg){
                            if (find_npc('花无缺的尸体')){
                                c('open xia;pack;cr over');
                                FB.score_kg = false;
                                FB.i = "进副本";
                            } else {
                                WG.kill_all();
                            }
                        }
                    } else if (cmds.length == 0) {
                        MAP.goto(2211);
                    }
                    break;
            }
        },
        yihua_jn: function (){
            if(user == 1 || user == 2 || user == 5 || user == 8){
                if(WG.jn_check('unarmed.duo',false)){
                    return true;
                }
            } else if(user == 3 || user == 4){
                if(WG.jn_check('sword.wu',false) && WG.jn_check('unarmed.chan',false) && WG.jn_check('sword.poqi',false)){
                    return true;
                }
            } else if(user == 6 || user == 7 || user == 9 || user == 10){
                if(WG.jn_check('sword.chan',false)){
                    return true;
                }
            }
            return false;
        },
        yihua_jn2: function (){
            if(user == 1 || user == 2 || user == 5 || user == 8){
                if(WG.jn_check('unarmed.duo',false)){
                    return true;
                }
            } else if(user == 3 || user == 4){
                return true;
            } else if(user == 6 || user == 7 || user == 9 || user == 10){
                if(WG.jn_check('sword.chan',false)){
                    return true;
                }
            }
            return false;
        },
        //cr mj/shanmen

        mj:function (){
            FB.score_kg = false;
            FB.i = "进副本";
            if(timer == 0){
                timer = self.setInterval(function(){FB.mj1()},500);
            }
        },
        mj1:function (){
            if(!FB.score_kg){
                var t = $(".room_items .room-item:first .item-name").text();
                var hp = $(".progress:eq(0) [style]").attr('style').match(/\d+/g)[0];
                var mp = $(".progress:eq(1) [style]").attr('style').match(/\d+/g)[0];
                if(mp >= 50 && hp >= 95 && !my_debuff){
                    FB.score_kg = true;
                    if(t.indexOf("疗伤") != -1 || t.indexOf("打坐") != -1){
                        c('stopstate');
                    }
                } else if(hp < 0.05 && room.id != 6){
                    c('relive');
                    MAP.goto(6);
                    FB.i = "进副本";
                } else if(mp < 50){
                    if(t.indexOf("打坐") == -1){
                        c('stopstate;dazuo');
                    }
                } else if((t.indexOf("打坐") == -1 && hp < 95) || (t.indexOf("打坐") != -1 && mp == 100 && hp < 95)){
                    if(t.indexOf("疗伤") == -1){
                        c('stopstate;liaoshang');
                    }
                }
                return;
            }
            switch (FB.i){
                case '进副本':
                    if(room.id == 2601){
                        FB.i = "杀冷谦";
                    } else {
                        MAP.goto(2601);
                    }
                    break;
                    //2604 冷谦的尸体
                    //2605 张中的尸体
                    //2609 周颠的尸体
                    //2611 颜垣的尸体
                    //2612 闻苍松的尸体
                    //2613 庄铮的尸体
                    //2617 辛然的尸体
                    //2615 唐洋的尸体
                    //2610 说不得的尸体 彭莹玉的尸体
                case '杀冷谦':
                    if(room.id == 2604){
                        if(!kk_kg){
                            if (find_npc('冷谦的尸体')){
                                FB.i = "杀张中";
                            } else {
                                c('kill ' + find_npc('冷谦'));
                            }
                        }
                    } else {
                        MAP.goto(2604);
                    }
                    break;
                case '杀张中':
                    if(room.id == 2605){
                        if(!kk_kg){
                            if (find_npc('张中的尸体')){
                                FB.i = "杀周颠";
                            } else {
                                c('kill ' + find_npc('张中'));
                            }
                        }
                    } else {
                        MAP.goto(2605);
                    }
                    break;
                case '杀周颠':
                    if(room.id == 2609){
                        if(!kk_kg){
                            if (find_npc('周颠的尸体')){
                                FB.i = "杀颜垣";
                            } else {
                                c('kill ' + find_npc('周颠'));
                            }
                        }
                    } else {
                        MAP.goto(2609);
                    }
                    break;
                case '杀颜垣':
                    if(room.id == 2611){
                        if(!kk_kg){
                            if (find_npc('颜垣的尸体')){
                                FB.i = "杀闻苍松";
                            } else {
                                c('kill ' + find_npc('颜垣'));
                            }
                        }
                    } else {
                        MAP.goto(2611);
                    }
                    break;
                case '杀闻苍松':
                    if(room.id == 2612){
                        if(!kk_kg){
                            if (find_npc('闻苍松的尸体')){
                                FB.i = "杀庄铮";
                            } else {
                                c('kill ' + find_npc('闻苍松'));
                            }
                        }
                    } else {
                        MAP.goto(2612);
                    }
                    break;
                case '杀庄铮':
                    if(room.id == 2613){
                        if(!kk_kg){
                            if (find_npc('庄铮的尸体')){
                                FB.i = "杀辛然";
                            } else {
                                c('kill ' + find_npc('庄铮'));
                            }
                        }
                    } else {
                        MAP.goto(2613);
                    }
                    break;
                case '杀辛然':
                    if(room.id == 2617){
                        if(!kk_kg){
                            if (find_npc('辛然的尸体')){
                                FB.i = "杀唐洋";
                            } else {
                                c('kill ' + find_npc('辛然'));
                            }
                        }
                    } else {
                        MAP.goto(2617);
                    }
                    break;
                case '杀唐洋':
                    if(room.id == 2615){
                        if(!kk_kg){
                            if (find_npc('唐洋的尸体')){
                                FB.i = "杀说不得";
                            } else {
                                c('kill ' + find_npc('唐洋'));
                            }
                        }
                    } else {
                        MAP.goto(2615);
                    }
                    break;
                case '杀说不得':
                    if(room.id == 2610){
                        if(!kk_kg){
                            if (find_npc('说不得的尸体') && find_npc('彭莹玉的尸体')){
                                FB.i = "杀";
                            } else {
                                c('kill ' + find_npc('说不得') + ';kill ' + find_npc('彭莹玉'));
                            }
                        }
                    } else {
                        MAP.goto(2610);
                    }
                    break;
            }
        },
        yunbao_kg:false,
        yunbao:function (){
            FB.score_kg = false;
            FB.yunbao_kg = true;
            FB.i = "接任务";
            if(timer == 0){
                timer = self.setInterval(function(){FB.yunbao1()},1000);
            }
        },
        yunbao1:function (){
            if(!FB.score_kg){
                var t = $(".room_items .room-item:first .item-name").text();
                var hp = $(".progress:eq(0) [style]").attr('style').match(/\d+/g)[0];
                var mp = $(".progress:eq(1) [style]").attr('style').match(/\d+/g)[0];
                if(mp >= 50 && hp >= 95 && !my_debuff){
                    FB.score_kg = true;
                    if(t.indexOf("疗伤") != -1 || t.indexOf("打坐") != -1){
                        c('stopstate');
                    }
                } else if(hp < 0.05 && room.id != 6){
                    c('relive');
                    MAP.goto(6);
                    FB.i = "接任务";
                } else if(mp < 50){
                    if(t.indexOf("打坐") == -1){
                        c('stopstate;dazuo');
                    }
                } else if((t.indexOf("打坐") == -1 && hp < 95) || (t.indexOf("打坐") != -1 && mp == 100 && hp < 95)){
                    if(t.indexOf("疗伤") == -1){
                        c('stopstate;liaoshang');
                    }
                }
                return;
            }
            switch (FB.i){
                case '接任务':
                    if(room.name == '扬州城-镖局正厅'){
                        c('task yunbiao ' + find_npc('福威镖局当家的 林震南') + ' start ok;task yunbiao ' + find_npc('福威镖局当家的 林震南') + ' begin');
                        FB.i = "判断运镖";
                    } else {
                        c('jh fam 0 start;go west;go west;go south;go south');
                    }
                    break;
                case '判断运镖':
                    if(room.name.indexOf("运镖") != -1){
                        if(!kk_kg && WG.jn_check('parry.yi',false) && WG.jn_check('unarmed.san',false) && WG.jn_check('unarmed.zhui',false)){
                            c('go east;perform parry.yi;perform dodge.power;perform sword.wu;perform throwing.jiang;perform unarmed.san;perform unarmed.zhui;perform force.xi;perform force.power;perform sword.poqi');
                            FB.score_kg = false;
                        }
                    } else if(room.id == 46){
                        WG.timer_close();
                        FB.yunbao_kg = false;
                        return WG.zdwk();
                    } else {
                        FB.i = "完成";
                    }
                    break;
                case '完成':
                    var lists = $(".room_items .room-item");
                    for (var npc of lists) {
                        WG.Send("select " + $(npc).attr("itemid"));
                    }
                    break;
            }
        },
        q_fb: function (str){
            sm_kg = true;
            exe('jh fam 0 start;go south;go east;shop 0 20;' + str + ';' + str);
            setTimeout(() => {c('sell all');sm_kg = false;},10000);
            setTimeout(() => {return WG.sm_button();},11000);
        }
    }
    var yamen_kg=false,yamen_kg2=false,yamen_i='恢复',yamen_guai,yamen_guai_difang,yamen_x,find_guai_lj,find_guai_i=0,guai_id='',last_x=0,max_x=0;
    function yamen(){
        max_x = 0;
        last_x=0;
        FB.score_kg = false;
        yamen_i='去衙门';
        return yamen1();
    }
    function yamen1(){
        if(!FB.score_kg){
            var t = $(".room_items .room-item:first .item-name").text();
            var hp = $(".progress:eq(0) [style]").attr('style').match(/\d+/g)[0];
            var mp = $(".progress:eq(1) [style]").attr('style').match(/\d+/g)[0];
            if(mp >= 50 && hp >= 95 && !my_debuff){
                FB.score_kg = true;
                if(t.indexOf("疗伤") != -1 || t.indexOf("打坐") != -1){
                    c('stopstate');
                }
            } else if(hp < 0.05 && room.id != 6){
                c('relive');
                MAP.goto(6);
            } else if(mp < 50){
                if(t.indexOf("打坐") == -1){
                    c('stopstate;dazuo');
                }
            } else if((t.indexOf("打坐") == -1 && hp < 95) || (t.indexOf("打坐") != -1 && mp == 100 && hp < 95)){
                if(t.indexOf("疗伤") == -1){
                    c('stopstate;liaoshang');
                }
            }
            setTimeout(yamen1,500);
            return;
        }
        switch (yamen_i){
            case '去衙门':
                if (room.name == '扬州城-衙门正厅') {
                    if (user > 10 && user <= 100) {
                        c('shop 0 20');
                        WG.ask("扬州知府 程药发", 3);
                        WG.ask("扬州知府 程药发", 1);
                        WG.ask("扬州知府 程药发", 2);
                        WG.ask("扬州知府 程药发", 3);
                        yamen_i='结束';
                        setTimeout(yamen1,1000);
                        return
                    }
                    yamen_kg = true;
                    yamen_kg2 = false;
                    KEY.dialog_close();
                    WG.ask("扬州知府 程药发", 1);
                    find_guai_i=0;
                    $("div.tool-bar.right-bar span.tool-item:eq(5)").click();
                    yamen_i='判断';
                    return
                } else {
                    MAP.goto("扬州城-衙门正厅");
                }
                setTimeout(yamen1,1000);
                break;
            case '判断':
                if(last_x == yamen_x){
                    max_x++;
                    S('<HIY>本次衙门连续'+yamen_x+'次已经试过'+max_x+'次</HIY>')
                } else {
                    last_x = yamen_x;
                    max_x = 0;
                }
                if(max_x >= 3){
                    max_x = 0;
                    yamen_i='放弃去衙门';
                } else {
                    yamen_i='找第一遍';
                }
                setTimeout(yamen1,10);
                break;
            case '找第一遍':
                if (room.name == zb_place) {
                    guai_id = find_npc(yamen_guai);
                    if(guai_id){
                        yamen_i='杀怪';
                    } else {
                        yamen_i='检查重复地方';
                    }
                } else {
                    MAP.goto(zb_place);
                }
                setTimeout(yamen1,1000);
                break;
            case '检查重复地方':
                var x = '武当派-林间小径 峨眉派-走廊 丐帮-暗道 逍遥派-林间小道 少林派-竹林 逍遥派-地下石室 逍遥派-木屋';
                if(x.indexOf(zb_place) != -1){
                    find_guai_lj = needfind[zb_place];
                    find_guai_i = 0;
                    yamen_i='寻找重复地方';

                }else{
                    yamen_i='再找一遍';

                }
                setTimeout(yamen1,10);
                break;
            case '寻找重复地方':
                if (room.id == find_guai_lj[find_guai_i]) {
                    guai_id = find_npc(yamen_guai);
                    if(guai_id){
                        yamen_i='杀怪';
                    } else {
                        find_guai_i++;
                        if(find_guai_i < find_guai_lj.length){
                            yamen_i='寻找重复地方';
                        }else{
                            yamen_i='再找一遍';
                        }
                    }
                } else {
                    MAP.goto(find_guai_lj[find_guai_i]);
                }
                setTimeout(yamen1,500);
                break;
            case '再找一遍':
                yamen_kg2 = true;
                yamen_kg = false;
                if(yamen_guai_difang=='武当派'){
                    var lj='jh fam 1 start;go north;go south;go west;go west;go east;go northup;go north;go east;go west;go west;go northup;go northup;go northup;go north;go north;go north;go north;go north;go north';
                    find_guai_lj=lj.split(';');
                }else if(yamen_guai_difang=='少林派'){
                    lj='jh fam 2 start;go north;go west;go east;go east;go west;go north;go northup;go southdown;go northwest;go northeast;go southeast;go northwest;go north;go west;go east;go east;go west;go north;go west;go east;go east;go west;go north;go west;go east;go north;go north';
                    find_guai_lj=lj.split(';');
                }else if(yamen_guai_difang=='华山派'){
                    lj='jh fam 3 start;go eastup;go southup;jumpdown;go southup;go south;go east;jh fam 3 start;go westup;go north;go east;go west;go north;go north;go south;go east;go west;go south;go south;go west;go east;go south;go southup;go southup;go enter;go westup;go westup;jumpup';
                    find_guai_lj=lj.split(';');
                }else if(yamen_guai_difang=='峨眉派'){
                    lj='jh fam 4 start;go northup;go east;jh fam 4 start;go west;go south;go east;go south;go north;go east;go west;go west;go south;go north;go west;go south;go south;go north;go north;go west;go east;go north;go north';
                    find_guai_lj=lj.split(';');
                }else if(yamen_guai_difang=='逍遥派'){
                    lj='jh fam 5 start;go east;go north;go south;go south;go south;go north;go north;go west;go north;go north;go south;go south;go west;go south;go north;go east;go south;go south;go north;go north;go down;go down';
                    find_guai_lj=lj.split(';');
                }else if(yamen_guai_difang=='丐帮'){
                    lj='jh fam 6 start;go down;go east;go east;go east;go up;go down;go east;go east;go up';
                    find_guai_lj=lj.split(';');
                }else{
                    yamen_i='放弃去衙门';
                    setTimeout(yamen1,500);
                    return
                }
                find_guai_i = 0;
                yamen_i='找怪';
                setTimeout(yamen1,500);
                break;
            case '找怪':
                if(find_guai_i<find_guai_lj.length){
                    c(find_guai_lj[find_guai_i]);
                }else{
                    yamen_i='去衙门';
                    setTimeout(yamen1,300);
                }
                break;
            case '杀怪':
                if(!kk_kg){
                    hp = $(".progress:eq(0) [style]").attr('style').match(/\d+/g)[0];
                    if (find_npc(yamen_guai + '的尸体') || hp < 0.05){
                        FB.score_kg = false;
                        yamen_i='去衙门';
                    } else if (find_npc(yamen_guai)) {
                        c('kill ' + guai_id);
                    } else {
                        yamen_i='再找一遍';
                    }
                }
                setTimeout(yamen1,500);
                break;
            case '放弃去衙门':
                if (room.name == "扬州城-衙门正厅") {
                    WG.ask("扬州知府 程药发", 2);
                    yamen_i='去衙门';
                } else {
                    MAP.goto("扬州城-衙门正厅");
                }
                setTimeout(yamen1,500);
                break;
            case '结束':
                yamen_i='恢复';
                yamen_kg=false;
                yamen_kg2=false;
                if(user > 1000 || user < 11){return WG.wudao_auto();} else {return WG.zdwk();}
                break;
        }
    };
    var XY = {
        i:'',
        x:0,
        kg:false,
        start: function (){
            FB.score_kg = false;
            XY.i = "巡城";
            XY.x = 722;
            if(timer == 0){
                timer = self.setInterval(function(){XY.run()},300);
            }
        },
        //<hiy>你获得了一点军功，目前2/500</hiy>
        run: function (){
            if(!FB.score_kg){
                var t = $(".room_items .room-item:first .item-name").text();
                var hp = $(".progress:eq(0) [style]").attr('style').match(/\d+/g)[0];
                var mp = $(".progress:eq(1) [style]").attr('style').match(/\d+/g)[0];
                if(hp < 0.00001){
                    if(room.id != 6){
                        c('relive');
                        MAP.goto(6);
                    }
                    XY.i = "巡城";
                    XY.x = 722;
                    return;
                } else if(mp < 10 && t.indexOf("打坐") == -1){
                    c('stopstate;dazuo');
                } else if((t.indexOf("打坐") == -1 && hp < 95) || (t.indexOf("打坐") != -1 && mp == 100)){
                    if(t.indexOf("疗伤") == -1){
                        c('stopstate;liaoshang');
                    }
                } else if(mp >= 10 && hp >= 95 && t.indexOf("打坐") == -1 && t.indexOf("疗伤") == -1){
                    FB.score_kg = true;
                } else {
                    // S(hp);S(mp);S(t);
                }
                return;
            }
            switch (XY.i){
                case "去襄阳":
                    break;
                case "巡城":
                    if (room.id == XY.x) {
                        if(find_npc2('蒙古兵') || find_npc2('夫长') || find_npc2('蒙古密探')){
                            WG.kill_all();
                        }
                        XY.i = "判断";
                    }else if (!kk_kg) {
                        MAP.goto(XY.x);
                    }
                    break;
                case "判断":
                    if(!find_npc2('蒙古兵') && !find_npc2('夫长') && !find_npc2('蒙古密探')){
                        XY.x++;
                        if (XY.x == 751){
                            XY.x = 722;
                        }
                        kk_kg = false;
                        FB.score_kg = false;
                        XY.i = "巡城";
                    }
                    break;
            }
        }

    }

    var aa = 2601;
    var my_debuff = false;
    var diu_kg = false;
    $(document).ready(function () {
        $('head').append('<link href="https://s1.pstatp.com/cdn/expire-1-y/jquery-contextmenu/2.6.3/jquery.contextMenu.min.css" rel="stylesheet">');
        //  KEY.init();
        LG.init();
        WG.init();
        WG.add_hook("items", function (data) {
            Helper.saveRoomstate(data);
            Helper.showallhp();
            FB.walk_kg=true;
            if(yamen_kg2 && data.items){
                if(yamen_i=='找怪'){
                    guai_id = find_npc(yamen_guai);
                    //console.log(x);
                    if(guai_id){
                        yamen_i='杀怪';
                    } else {
                        find_guai_i++;
                    }
                    setTimeout(yamen1,500);
                }
            }
            //(data.name.indexOf('<hiz>武当派第一代弟子</hiz>') != -1 || data.name.indexOf('<hiz>峨眉派第三代弟子</hiz>') != -1 ) &&
            if(mp_kg1){
                if(find_npc2('蒙古兵') || find_npc2('夫长') || find_npc2('蒙古密探')){
                    WG.kill_all();
                }
            }
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
        //{"type":"itemadd",id:"lzqh2eb2076",name:"<wht>刘正风的尸体</wht>"}
        //{"type":"itemadd",id:"gtfw3159c44",name:"<hiz>武当派第一代弟子</hiz> 锺离娴",mp:500000,hp:2000000,max_mp:500000,max_hp:2000000}
        //{"type":"itemadd",id:"wvxz3159c5f",name:"<hiz>峨眉派第三代弟子</hiz> 颛孙婵",mp:500000,hp:2000000,max_mp:500000,max_hp:2000000}
        WG.add_hook("itemadd", function (data) {
            roomData.push(data);
            Helper.showallhp();
            if(mp_kg1 && data.hp && (data.name.indexOf('蒙古兵') != -1 || data.name.indexOf('夫长') != -1)){
                c('kill ' + data.id);
            }
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
        //{"type":"item","desc":"这是一丛美丽的玫瑰花丛，你数了下大概有5朵花。"}
        WG.add_hook("item", function (data) {
            if (data.id != null) {
                messageAppend(Helper.showhp(data.id));
            }
            if (data.desc) {
                if (room.id == 2207) {
                    FB.right = data.desc.match("大概有([^%]+)朵花")[1];
                } else if (room.id == 2208) {
                    FB.left = data.desc.match("大概有([^%]+)朵花")[1];
                }
            }
        });
        //{type:"status","action":"add",id:"owaf2a3edec",sid:"parry","name":"鹤翔","duration":28800}
        WG.add_hook("status", function (data) {
            if(data.action == 'add' && data.id != my_id && (data.name == '忙乱' || data.name == '昏迷')){
                FB.status = true;
                FB.status1 = true;
                //S('敌人忙乱或昏迷' + data.duration/1000 + '秒');
                setTimeout(() => {FB.status1 = false;},data.duration - 500);
                setTimeout(() => {FB.status = false;},data.duration);
            }
            if(data.action == 'add' && data.id == my_id ){
                if(data.name == '虚弱'){
                    my_debuff = true;
                    //S('敌人忙乱或昏迷' + data.duration/1000 + '秒');
                    setTimeout(() => { my_debuff = false;}, data.duration);
                } else {
                    WG.buff = data.name;
                }
            }
        });

        WG.add_hook("die", function (data) {
            if (mp_kg){
                c('relive');
            }
        });
        //{type:"cmds",items:[{cmd:"task sm d1072f816e7 give 72hr2f834f7",name:"上交<wht>米酒</wht>"},{cmd:"task sm d1072f816e7 giveup",name:"放弃"}]}
        //{type:"cmds",items:[{cmd:"team reply ok",name:"同意"},{cmd:"team reply no",name:"不同意"}]}
        //{type:"cmds",items:[{cmd:"task yunbiao a3qs3ed89e4 give",name:"交镖银"}]}
        //{type:"cmds",items:[{cmd:"wqcy next",name:"献祭内力"}]}
        WG.add_hook("cmds", function (data) {
            WG.sm_cmds == data;
            if(mp_kg && data.items && data.items[0].cmd.indexOf('team reply ok') != -1){
                c('team reply ok');
            }
            if(FB.yunbao_kg && data.items && data.items[0].name.indexOf('交镖银') != -1){
                c(data.items[0].cmd);
                FB.i = "接任务";
            }
            /*   if(data.items && data.items[0].name.indexOf('献祭内力') != -1){
                c(data.items[0].cmd);
            }*/
        });

        WG.add_hook("room", function (data) {
            room = data;
            room.id = MAP.find_room(room.name,room.path);
            if(room.id == 317){
                c('break bi');
            }
            //         S(room.id);
        });
        //{"type":"exits","items":{"east":"西大街","west":"矿山"}}
        WG.add_hook("exits", function (data) {
            room.exits = data.items;
            /*         	if(!room.id){
				var txt={};
				txt.exits = {};
				txt.name = room.name;
				txt.path = room.path;
				for (var i in room.exits) {
					txt.exits['go ' + i] = '燕子坞-' + room.exits[i];
				}
				map[aa] = txt;
				aa++;
				GM_setValue("map", map);
			} */
        });

        WG.add_hook("combat", function (data) {
            kk_kg = true;
            //  auto_kill = false;
            if(data.start && room.path != 'cd/wen/dating'){
                if (kk_timer == 0 && auto_kill) {
                    WG.wudao_autopfm();
                    kk_timer = self.setInterval(() => {WG.wudao_autopfm()}, 300);
                }
            }
            if(data.end){
                //messageAppend("战斗停止");
                FB.status = false;
                kk_kg=false;
                if (kk_timer) {
                    clearInterval(kk_timer);
                    kk_timer = 0;
                }
                if(wen_kg){
                    if(wen_i=='杀5人'){
                        wen_i='恢复2';
                        setTimeout(FB.wen,500);//杀温仪
                    }else if(wen_i=='杀温仪'){
                        wen_i='本次副本结束';
                        setTimeout(FB.wen,500);
                    }
                }
            }
        });
        WG.add_hook("dialog", function (data) {
            //console.dir(data);
            var drop_wuping='<hiy>松风剑法残页</hiy><hiy>五毒钩法残页</hiy><hiy>泰山剑法残页</hiy><hiy>恒山剑法残页</hiy><hiy>七伤拳残页</hiy><hic>玉女身法残页</hic><hiy>五毒烟萝步残页</hiy><hic>流云掌残页</hic><hiy>全真剑法残页</hiy><hiy>移风剑法残页</hiy><hic>身空行残页</hic><hic>摘星功残页</hic><hiy>白云心法残页</hiy><hiy>镇岳诀残页</hiy><hiy>段家剑残页</hiy><hiy>落英神剑残页</hiy><HIZ>先天功残页</HIZ><hic>神龙心法残页</hic><hic>金蛇锥法残页</hic><hic>蟾蜍步法残页</hic><hiy>圣火神功残页</hiy><hic>圣火令法残页</hic><hiy>中平枪法残页</hiy><hiy>天长掌法残页</hiy><hiy>千蛛万毒手残页</hiy><hiy>狂风快刀残页</hiy><hig>猴拳残页</hig><hic>无常杖残页</hic><hic>碧波神功残页</hic><hic>蒙古心法残页</hic><hig>唐诗剑法残页</hig><hiy>蒙古骑枪残页</hiy><hic>踏歌行残页</hic><hic>神剑诀残页</hic><hiy>玉女素心剑残页</hiy><hiy>天羽奇剑残页</hiy><hic>云龙剑残页</hic><hic>青蝠身法残页</hic> <hic>泰山拳法残页</hic><hiy>磐石神功残页</hiy><hic>四象步法残页</hic><hiy>摧心掌残页</hiy><hig>云龙鞭法残页</hig><hic>穿云纵残页</hic> <hig>云龙身法残页</hig><hic>绝情掌残页</hic><hig>唐诗剑法残页</hig><hic>五毒神功残页</hic><hig>云龙心法残页</hig><hic>蛇岛奇功残页</hic><hic>恒山身法残页</hic><hig>金雁功残页</hig><hig>绝门棍残页</hig><hig>秋风拂尘残页</hig><hig>冷月神功残页</hig><hig>密宗大手印残页</hig><hig>密宗心法残页</hig><hig>冷月神功残页</hig><wht>欠条</wht><hig>意形步法残页</hig><hig>神龙剑残页</hig><hic>化骨绵掌残页</hic><hiy>金蛇游身掌残页</hiy><hic>八卦棍法残页</hic><hic>八卦拳残页</hic><hig>五虎断门刀残页</hig><wht>布衣</wht><wht>家丁鞋</wht><wht>家丁服</wht><wht>钢刀</wht><wht>木棍</wht><wht>英雄巾</wht><wht>布鞋</wht><wht>铁戒指</wht><wht>簪子</wht><wht>长鞭</wht><wht>铁剑</wht><wht>铁棍</wht><wht>铁杖</wht>';
            var fenjie_wuping='<hiy>钓鱼竿</hiy> <hig>流氓巾</hig><hiy>金蛇剑</hiy><hiy>八卦棍</hiy><hig>流氓鞋</hig><hic>温仪的香囊</hic><hic>金蛇披风</hic><hig>金蛇锥</hig><hic>金蛇戒</hic><hic>神龙靴</hic><hic>神龙袍</hic><hic>神龙冠</hic><hic>神龙护腕</hic><hic>神龙腰带</hic><hic>神龙杖</hic><hic>神龙令</hic><hig>短衣劲装</hig><hig>流氓衣</hig><hig>流氓护腕</hig><hig>流氓短剑</hig><hic>黑龙鞭</hic><hig>黑虎单刀</hig><hig>官服</hig><hig>韦春芳的项链</hig>';

            if (data.dialog == "pack" && data.items != undefined && data.items.length >= 0) {
                bao = data.items;
                bao_kg = true;
                if(!my_wq){
                    for (var i = 0; i < data.items.length; i++) {
                        if (data.items[i].name.indexOf('剑') != -1 && data.items[i].name.indexOf('★★★★') != -1) {
                            my_wq = data.items[i].id;
                            messageAppend(data.items[i].name + " " + data.items[i].id);
                        }
                    }
                    for (var j = 0; j < data.eqs.length; j++) {
                        if (data.eqs[j] != null && data.eqs[j].name.indexOf('剑') != -1 && data.eqs[j].name.indexOf('★★★★') != -1) {
                            my_wq = data.eqs[j].id;
                            messageAppend(data.eqs[j].name + " " + data.eqs[j].id);
                        }
                    }
                }
                var qlg = false;
                for (i = 0; i < data.items.length; i++) {
                    if (data.items[i].name.indexOf('潜灵果') >= 0 || data.items[i].name.indexOf('朱果') >= 0 ) {
                        qlg = data.items[i].id;
                    }
                }
                if(qlg){
                    exe('stopstate');
                    for (i=0;i<10;i++)
                    {
                        exe('use '+ qlg);
                    }
                    exe('wakuang');
                }
                if(diu_kg){
                    for (i = 0; i < data.items.length; i++) {
                        if (drop_wuping.indexOf(data.items[i].name) != -1) {
                            exe('drop ' + data.items[i].count + ' ' + data.items[i].id);
                        }
                        if(fenjie_wuping.indexOf(data.items[i].name)!=-1){
                            exe('fenjie '+data.items[i].id);
                        }
                    }
                    var fj1 = ['罗汉','混天','鲲鹏','曙光','君子','真武','蒙古','大宋','笠子帽'];
                for (var fj of fj1){
                    if(data.name.indexOf(fj) != -1 && (data.name.indexOf("<hig>") != -1 || data.name.indexOf("<hic>") != -1 || data.name.indexOf("<hiy>") != -1) && (data.name.indexOf("★") == -1 || data.name.indexOf("☆") == -1 )){
                        exe('fenjie '+ data.id);
                    }
                }
                    diu_kg = false;
                }
            }
            if(data.name && data.dialog=='pack'){
                if(data.name == '<hic>养精丹</hic>'){
                    c('use '+ data.id);
                }
                if(!sm_kg && drop_wuping.indexOf(data.name) != -1){
                    exe('drop ' + data.count + ' ' + data.id);
                }
                if(fenjie_wuping.indexOf(data.name) != -1){
                    exe('fenjie ' + data.id);
                }
                fj1 = ['罗汉','混天','鲲鹏','曙光','君子','真武','蒙古','大宋','笠子帽'];
                for (fj of fj1){
                    if(data.name.indexOf(fj) != -1 && (data.name.indexOf("<hig>") != -1 || data.name.indexOf("<hic>") != -1 || data.name.indexOf("<hiy>") != -1) && (data.name.indexOf("★") == -1 || data.name.indexOf("☆") == -1 )){
                        exe('fenjie '+ data.id);
                    }
                }
            };
            if(data.dialog=='score'){
                my = data;
            };
            //{type:"dialog",dialog:"skills",id:"zixiashengong2",level:2064,exp:1}
            if(data.dialog == 'skills'){
                if(data.items){
                    for (i = 0; i < data.items.length; i++) {
                        my_skills[data.items[i].id] = data.items[i].level;
                    }

                } else if(data.id && data.level && my_skills){
                    my_skills[data.id] = data.level;
                }
            };
            if (data.dialog == 'tasks' && data.items) {
                if(data.items[0].title.indexOf('成长计划') != -1){
                    FB.need_x=data.items[1].desc;
                }else{
                    FB.need_x=data.items[0].desc;
                };
                FB.need_x = FB.need_x.match("副本：<hi.+>([^%]+)/20")[1];
                log(FB.need_x);
            }
            //"扬州知府委托你追杀逃犯：王枝，据说最近在逍遥派-林间小道出现过，你还有9分56秒去寻找他，目前完成0/20个，共连续完成3个。"
            if(yamen_kg && data.dialog == 'tasks'){
                if(data.items[0].title.indexOf('成长计划') != -1){
                    var task=data.items[3].desc;
                }else{
                    task=data.items[2].desc;
                };
                console.log(task);
                if(task.indexOf('据说最近在')>0){
                    yamen_guai = task.match("犯：([^%]+)，据")[1];
                    yamen_guai_difang= task.match("在([^%]+)-")[1];
                    zb_place = task.match("在([^%]+)出")[1];
                    yamen_x= task.match("连续完成([^%]+)个。")[1];//共连续完成13个。
                    console.log('怪物名字'+yamen_guai+' 怪物地方'+yamen_guai_difang+' 目前连续打了'+yamen_x+'次');
                    yamen_i="判断";
                }else{
                    yamen_i="结束";
                }
                setTimeout(yamen1,500);
                return;
            }

        });
        WG.add_hook("text", function (data) {
            //console.log(data);你目前气血充沛，没有受到任何伤害,你疗伤完毕，深深吸了口气，脸色看起来好了很多
            if(data.msg.indexOf('只能在战斗中使用') != -1 && kk_timer) {
                clearInterval(kk_timer);
                kk_timer = 0;
            };
            //<hiy>你获得了一点军功，目前5/500</hiy>
            //<hic>你本次守城共获得210军功，已经自动保存。</hic>
            if(mp_kg1){
                if((data.msg.indexOf('你获得了') != -1 && data.msg.indexOf('点军功') != -1) || data.msg.indexOf('你本次守城共获得') != -1) {
                    S(data.msg);
                }
            }
        });
        WG.add_hook("msg", function (data) {
            if (data.ch == "sys") {
                var automarry = GM_getValue(role + "_automarry", automarry);
                if (data.content.indexOf("，婚礼将在一分钟后开始。") >= 0) {
                    console.dir(data);
                    if (automarry == "已开启") {
                        console.log("xiyan");
                        messageAppend("自动前往婚宴地点")
                        Helper.xiyan();
                    } else if (automarry == "已停止") {
                        var b = "<div class=\"item-commands\"><span  id = 'onekeyjh'>参加喜宴</span></div>"
                        messageClear();
                        messageAppend("<hiy>点击参加喜宴</hiy>");
                        messageAppend(b);
                        $('#onekeyjh').on('click', function () {
                            Helper.xiyan();
                        });
                    }
                }
            }
            if (data.ch == "rumor") {
                if (data.content.indexOf("听说") >= 0 &&
                    data.content.indexOf("出现在") >= 0 &&
                    data.content.indexOf("一带。") >= 0) {
                    console.dir(data);
                    if (autoKsBoss == "已开启") {
                        Helper.kksBoss(data);
                    } else if (autoKsBoss == "已停止") {
                        var cc = "<div class=\"item-commands\"><span id = 'onekeyKsboss'>传送到boss</span></div>";
                        messageClear();
                        messageAppend("boss已出现");
                        messageAppend(cc);
                        $('#onekeyKsboss').on('click', function () {
                            Helper.kksBoss(data);
                        });
                    }
                }
            }
            //{"type":"msg","ch":"pty","content":"goto","uid":"ivxw2a257af","name":"淺色年華"}

            if (data.ch == "pty") {
                var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
                if(re.test(data.content) && mp_kg && role != cmder && data.name == cmder){
                    MAP.goto(data.content);
                } else if (data.content == 'j'){
                    EQ.tokill();
                } else if (data.content == 'lx'){
                    lianxi();
                } else if (data.content == 'xx'){
                    xuexi();
                } else if (data.content == 'mp'){
                    cmder = data.name;
                    mp_kg = true;
                    mp_kg1 = false;
                    S('<hir>门派战模式开始</hir>');
                    MAP.goto(29);
                    setTimeout(() => {EQ.tokill();}, 5000);
                } else if (data.content == 'diu'){
                    diu_kg = true;
                    c('pack');
                } else if (data.content == 'xy'){
                    mp_kg1 = true;
                    S('<hir>襄阳模式开始</hir>');
                    WG.xy();
                } else if (data.content == 'wa'){
                    WG.zdwk();
                } else if (mp_kg && role != cmder && data.name == cmder && role != cmder){
                    exe(data.content);
                }
            }
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
                        "自动练习": {
                            name: "自动练习",
                            callback: function (key, opt) {
                                lianxi();
                            },
                        },
                        "自动学习": {
                            name: "自动学习",
                            callback: function (key, opt) {
                                xuexi();
                            },
                        },
                        "自动衙门": {
                            name: "自动衙门",
                            callback: function (key, opt) {
                                yamen();
                            },
                        },
                        "自动武道": {
                            name: "自动武道",
                            callback: function (key, opt) {
                                WG.wudao_auto();
                            },
                        },
                        "自动襄阳": {
                            name: "自动襄阳",
                            callback: function (key, opt) {
                                XY.start();
                            }
                        },
                        "自动慕容": {
                            name: "自动慕容",
                            callback: function (key, opt) {
                                FB.murong();
                            }
                        },
                        "自动移花": {
                            name: "自动移花",
                            callback: function (key, opt) {
                                FB.yihua();
                            }
                        },
                        "自动明教": {
                            name: "自动明教",
                            callback: function (key, opt) {
                                FB.mj();
                            }
                        },
                        "自动运镖": {
                            name: "自动运镖",
                            callback: function (key, opt) {
                                FB.yunbao();
                            }
                        },
                        "自动小树林": {
                            name: "自动小树林",
                            visible: false,
                            callback: function (key, opt) {
                                WG.grove_auto();
                            }
                        }
                    },
                },
                "换装设置": {
                    name: "换装设置",
                    "items": {
                        "xx0": {
                            name: "战斗装备",
                            callback: function (key, opt) {
                                EQ.tokill();
                            },
                        },
                        "xx1": {
                            name: "悟性装备",
                            callback: function (key, opt) {
                                EQ.tolx();
                            },
                        },
                        "xx2": {
                            name: "襄阳装备",
                            callback: function (key, opt) {
                                EQ.toxy();
                            },
                        }
                    }
                },
                "手动喜宴": {
                    name: "手动喜宴",
                    visible: false,
                    callback: function (key, opt) {
                        Helper.xiyan();

                    },
                },
                "快捷传送": {
                    name: "常用地点",
                    "items": {
                        "帮派仓库": {
                            name: "帮派仓库",
                            callback: function (key, opt) {
                                MAP.goto(30);
                            },
                        },
                        "打开仓库": {
                            name: "打开仓库",
                            callback: function (key, opt) {
                                c("stopstate;jh fam 0 start;go north;go west;store");
                            },
                        },

                        "当铺卖东西": {
                            name: "当铺卖东西",
                            callback: function (key, opt) {
                                WG.go("扬州城-当铺");
                            },
                        },
                        "襄阳模式": {
                            name: "襄阳模式",
                            callback: function (key, opt) {
                                mp_kg1 = true;
                                S('<hir>襄阳模式开始</hir>');
                                WG.xy();
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
                                MAP.goto(115);
                            },
                        },
                        "mp1": {
                            name: "少林",
                            visible: false,
                            callback: function (key, opt) {
                                WG.go("少林派-广场");
                            },
                        },
                        "mp2": {
                            name: "华山",
                            visible: false,
                            callback: function (key, opt) {
                                WG.go("华山派-镇岳宫");
                            },
                        },
                        "mp3": {
                            name: "峨眉",
                            callback: function (key, opt) {
                                MAP.goto(414);
                            },
                        },
                        "mp4": {
                            name: "逍遥",
                            visible: false,
                            callback: function (key, opt) {
                                WG.go("逍遥派-青草坪");
                            },
                        },
                        "mp5": {
                            name: "丐帮",
                            visible: false,
                            callback: function (key, opt) {
                                WG.go("丐帮-树洞内部");
                            },
                        },
                        "mp6": {
                            name: "襄阳",
                            visible: false,
                            callback: function (key, opt) {
                                WG.go("襄阳城-广场");
                            },
                        }
                    },
                },
                "武庙恢复": {
                    name: "武庙恢复",
                    callback: function (key, opt) {
                        WG.go("扬州城-武庙");
                    },
                },
                "练功房": {
                    name: "练功房",
                    callback: function (key, opt) {
                        WG.go("住房");
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