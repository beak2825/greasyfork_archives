// ==UserScript==
// @name         wsmud_丐帮自用
// @namespace    xqr
// @version      1.15
// @date         24/08/2018
// @modified     25/08/2018
// @homepage     https://greasyfork.org/zh-CN/scripts/371521
// @description  武神传说 MUD
// @author       小乞儿
// @match        http://game.wsmud.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/371521/wsmud_%E4%B8%90%E5%B8%AE%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/371521/wsmud_%E4%B8%90%E5%B8%AE%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==
(
    function () {
    'use strict';

    var kuanggao = "q959270a006"; //矿镐id
    //var pfm = new Array("dodge.lingbo","parry.wu","force.power","force.wang","parry.yi","club.chan","unarmed.qi","club.wu","blade.chan","throwing.jiang","unarmed.shiba");/////连招一pfm顺序
    //var zdjn = new Array("xianglongshibazhang");///战斗技能
    var zdz = new Array("vwpt28f3862","laim2725036","cmmg2aec811");/////战斗装id
    //var wxjn = new Array("unarmed canhezhi");///悟性技能
    var wxz = new Array("lurh2b01af8","swgq2be2e73","1pqt25b420c");/////悟性装id
   // var jnm = new Array("xianglongzhang","dagoubang2","xiaoyaoyou2","shedaoqigong","canhezhi","qiufengfuchen","hengshanwushenjian","mingyugong");/////练习技能默认排序
    var myboss = new Array("田伯光","何红药","火龙王","玉玑子","左冷禅","黄药师","欧阳锋",);/////////////////////////可杀boss
    //var heimingdan = new Array("枯荣大师","张无忌","天山童姥");/////////////////////////不可碰

        ///////////////////////////////////以上为个人数据/////////////////////////////////j1m029ab02e   ij2q29ab02e

    var roomItemSelectIndex = -1;
    var cnt = 0;
    var ch;
    var luj = new Array();;
    var i =0;
    var getboss;
    var bosskg=2;
    var fzkg=2;
    var BOSS;
    var jnph = 0;
    var xx =0;
    var myTime = new Array();
    var xtime = new Array();
    var ktime = new Array();
    var mingzi = new Array();
    var xuel = new Array();
    var smitem;
    var yaoyan;
    var zb_npc;
    var zidongjineng;
    var shuchul = new Array();
    var zb_place;
    var family = null;
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
        "武道塔": "jh fam 8 start"
    };

    //快捷键功能
    var KEY = {
        init: function () {
            //添加快捷键说明
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
    function shuxing(name,xue)
    {
    this.name=name;
    this.xue=xue;
    }
    var WG = {
        init: function () {
            $(".bottom-bar").append("<span class='item-commands' style='display:none'><span WG='WG' cmd=''></span></span>"); //命令行模块
            $(".bottom-bar span:eq(2)").after("<span class='tool-item' style='line-height:17px;vertical-align:top;color:white'><span class='fuzhucaidan'>☆</br>辅助</span></span>");
            var t;
            $(".content-message").after("<div class='fuzhuanjian' style='width:48%;right:45px;margin-bottom:-0.5em;'>" + "提示： <span class='WG_Tip'></span><br>" 
                                        +"手动：<span class='zdy-item lianzhaoyi'>连招</span>" +"<span class='zdy-item getAllid'>刷新物品ID</span>"  + "<span class='zdy-item wuxingzhuang'>悟性装</span>" 
                                        +  "<span class='zdy-item zhandouzhuang'>战斗装</span>" +"<span class='zdy-item liaoshang'>疗伤</span>"+ "<span class='zdy-item bossKG'>开关</span>" 
                                        + "<span class='zdy-item wkzidong'>挖矿</span><br>"+"门派：<span class='zdy-item shaolin' style='margin:0.02in'>少林</span>"
                                        + "<span class='zdy-item wudang'>武当</span>"+ "<span class='zdy-item emei'>峨眉</span>"+ "<span class='zdy-item huashan'>华山</span>"
                                        + "<span class='zdy-item xiaoyao'>逍遥</span>"+ "<span class='zdy-item gaibang'>丐帮</span>"+ "<span class='zdy-item sell_all'>清包</span>"  
                                        +"<span class='zdy-item cangku'>仓库</span>"+"<span class='zdy-item qiandao'>签到</span><br>"+ "快捷：<span class='zdy-item kill_all'>杀</span>" 
                                        + "<span class='zdy-item get_all'>捡</span>" + "<span class='zdy-item tongJ'>统计</span>"+"<span class='zdy-item go_family'>师门</span>" 
                                        + "<span class='zdy-item go_yamen_task'>追捕</span>" + "<span class='zdy-item wdT'>武道</span>"  
                                        + "<span class='zdy-item allStop'>停</span>" + "</div>");
            var css = ".zdy-item{display: inline-block; border: solid 1px gray;color: gray;background-color: black;" + "color:yellow;text-align: center;cursor: pointer;border-radius: 0.25em;min-width: 2em;margin-right: 0.4em;" + "margin-left: 0.4em;position: relative;padding-left: 0.4em;padding-right: 0.4em;}";
            GM_addStyle(css);
            goods = GM_getValue("goods", goods);
            npcs = GM_getValue("npcs", npcs);
            equip = GM_getValue("equip", equip);

            $(".go_family").on("click", WG.go_family);
            $(".tongJ").on("click", WG.tongJ);
            $(".fuzhucaidan").on("click", WG.fzkg);
           // $(".check_lianxi_auto").on("click", WG.check_lianxi_auto);
            $(".getAllid").on("click", WG.getAllid);
            $(".check_dazuo_auto").on("click", WG.check_dazuo_auto);
            $(".allStop").on("click", WG.allStop);
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
            $(".bossKG").on("click", WG.bossKG);
            $(".cangku").on("click", WG.cangku);
            $(".sell_all").on("click", WG.sell_all);
            $(".wkzidong").on("click", WG.wkzidong);
            $(".qiandao").on("click", WG.qiandao);
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
        go_family: function () {
            family = $('.room_items .room-item:first .item-name').text().substr(0, 2);//无门派，提取门派
            WG.Send("stopstate");

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
                case '峨嵋':
                    WG.go("峨眉派-大殿");
                    WG.sm("峨嵋派第四代弟子 静心");
                    break;
                default:
                    tip("请设为门派称号")
                    break;
            }
        },
        sm: function (master) {
            clearTimeout(xtime[6]);
            xtime[6] = setTimeout(function(){
                WG.updete_npc_id();
                master = npcs[master];
                if(master.length != 11){WG.sm(master);return;}
                WG.Send("task sm " + master);
                WG.getsm(master);
                },1000)
        },
        getsm: function (master) {
            clearTimeout(xtime[6]);
                KEY.do_command("tasks");
            xtime[6] = setTimeout(function(){
                smitem = $(".dialog-tasks .task-item:eq(1)").text();         //////////////////////////////   新手任务没完成要  eq(2)
                var rws = smitem.match("目前([^%]+)，共")[1];  
                 //   if(rws == "完成20/20个"){
                 //       if(bosskg%2 ==0){WG.go_yamen_task();return;}
                 //       else{WG.wkzidong();}}},800)
                      if(rws == "完成20/20个"){              
                        WG.wkzidong();}},800)
            xtime[6] = setTimeout(function(){
                try{smitem = smitem.match("寻找([^%]+)，你")[1];}
                catch(error){
                    WG.getsm(master);return;}
                WG.gosm(master);
            },1000)
        },
        gosm: function (master) {
            KEY.do_command("tasks");
            clearTimeout(xtime[6]);
            messageClear();
            WG.Send("task sm " + master);
            xtime[6] = setTimeout(function(){
                var rw = $(".item-commands").text();
                if(rw.indexOf(smitem) != -1){
                eval('$(".item-commands").find("span:contains('+smitem+')").click()');
                WG.go_family();
                return;}
            var ckwp = new Array("草鱼","鲤鱼","鲢鱼")
            for(xx in ckwp){
                if(smitem == ckwp[xx]){WG.ckqu(smitem);return;}
            }
            var good = goods[smitem];
            if (good != undefined) {
                tip("自动购买" + smitem);
                WG.go(good.place);
                xtime[6] = setTimeout(function(){ WG.buy(good); },2000)
                return;
            }
            tip("无法自动购买" + smitem);
            if(bosskg%2 ==0){WG.Send("task sm "+master+" giveup");WG.go_family();}
            },1000)
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
            WG.Send("list " + tmp);
            WG.Send("buy 1 " + good.id + " from " + tmp);
            WG.go_family();
        },
        lianxi: function (jineng) {
            jineng = [jineng];
            WG.Send("stopstate");
            WG.go("豪宅-练功房");
          WG.wuxingzhuang();
          //  WG.Send("enable unarmed canhezhi"); //装备参合指增加悟性
            WG.Send("lianxi" +" "+ jineng);
        },
        qiandao: function () {
            WG.Send("taskover signin");
        },
      //  lianzhaoyi: function () {
       //    WG.Send("zhua l67029fe2df;kill snmk29fe2df;perform blade.chan;perform throwing.jiang;perform unarmed.shiba");
       //     xx = 0;
       //    var buff =$(".room_items .room-item .item-status-bar:first").text();
       //     if (buff.indexOf("仙游") == -1){WG.Send("perform "+pfm[xx]);}xx++;
       //     if (buff.indexOf("石廪") == -1 && buff.indexOf("鹤翔") == -1 && buff.indexOf("祝融") == -1 && buff.indexOf("天柱") == -1 && buff.indexOf("芙蓉") == -1){WG.Send("perform "+pfm[xx]);}xx++;
       //     if (buff.indexOf("明玉功") == -1){WG.Send("perform "+pfm[xx]);}xx++;
      //      if (buff.indexOf("太上忘情") == -1){WG.Send("perform "+pfm[xx]);}xx++;
      //      try{while(pfm[xx].length>1){WG.Send("perform "+pfm[xx]);xx++;}}
      //      catch(error){return;}
    //    },
        //lianzhaoer: function () {
      //      clearTimeout(xtime[5]);
      //      WG.Send("perform dodge.lingbo;perform parry.wu;perform parry.yi;perform force.power;perform force.wang;perform unarmed.qi;perform club.chan;perform club.wu;eq jpzn26af5cc");
      //      xtime[5] = setTimeout(function(){ WG.Send("perform blade.chan;perform throwing.jiang;perform unarmed.shiba");}, 3200);
      //  },
        eq: function (e) {
            WG.Send("eq " + equip[e]);
        },
        ask: function (n,npc) {
            npc = npcs[npc];
            if (npc != undefined)
            {WG.Send("ask"+n+" "+npc);}
            else
            {WG.updete_npc_id();
            xtime[12]=setTimeout(WG.ask(n,npc), 100);}
        },
                go_yamen_task: function () {
                 WG.allStop();
                  WG.Send("stopstate")
         //   WG.zhandouzhuang();
        //    WG.Send("enable parry yihuajiemu");
            WG.go("扬州城-衙门正厅");
            xtime[0] = setTimeout(WG.getTask, 800);
        },
        getTask: function () {
            WG.ask(1,"扬州知府 程药发");
            xtime[1] = setTimeout(function(){KEY.do_command("tasks");}, 500);
            xtime[1] = setTimeout(function(){WG.check_yamen_task();}, 1200);
        },
        check_yamen_task: function () {
            for(xx in xtime){clearTimeout(xtime[xx])}
            var task = $(".task-desc:last").text();
                BOSS = null;
                try{zb_npc = task.match("犯：([^%]+)，据")[1];
                zb_place = task.match("在([^%]+)出")[1];}
                catch(error){WG.getTask();return;}
                tip("追捕" +"：" + zb_npc + " " + zb_place);
            while(zb_place == "武当派-林间小径"){ WG.ymwdLJ();return; }
            while(zb_place == "峨眉派-走廊"){ WG.ymemZL();return; }
            while(zb_place == "丐帮-暗道"){ WG.ymgbAD();return; }
            while(zb_place == "逍遥派-林间小道"){ WG.ymxyXD();return; }
            while(zb_place == "少林派-竹林"){ WG.ymslZL();return; }
            while(zb_place == "逍遥派-地下石室"){ WG.ymxySS();return; }
            while(zb_place == "华山派-镇岳宫"){ WG.ymhsZY();return; }
            while(zb_place == "华山派-苍龙岭"){ WG.ymhsZY();return; }
            while(zb_place == "华山派-舍身崖"){ WG.ymhsZY();return; }
            while(zb_place == "华山派-峭壁"){ WG.ymhsZY();return; }
            while(zb_place == "华山派-山谷"){ WG.ymhsSG();return; }
            while(zb_place == "华山派-山间平地"){ WG.ymhsSG();return; }
            while(zb_place == "华山派-林间小屋"){ WG.ymhsSG();return; }
                WG.go(zb_place);
            xtime[0] = setTimeout(function(){WG.zhaoymBoss(2)},800);
        },
        ////////////////////
        ymlj: function (d) {
            xtime[1] = setTimeout(function(){WG.check_yamen_task();}, 1000);
            if(d==0){return;}
            i=0;
            luj=[];
            $(".room_exits svg rect").each(function(){luj[i] = $(this).attr("dir");i++;});
            i=1;
            WG.zu(0);
            WG.zu(1);
            WG.zu(2);
            WG.zu(3);
            WG.zu(4);
        },
        zu: function(t){
            xtime[2]=setTimeout(WG.zou, 800*t+50);
            xtime[2]=setTimeout(WG.zulu, 800*(t+1));},
        zou: function(){if(luj[i]==undefined){return;}WG.Send("go "+ luj[i])},
        zulu: function (){if(luj[i]==undefined){return;}
                   switch (luj[i])
                     {
                   case "east": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go west");break;
                   case "west": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go east");break;
                   case "south": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go north");break;
                   case "north": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go south");break;
                       case "up": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go down");break;
                       case "down": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go up");break;
                       case "enter": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go out");break;
                       case "out":WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go enter");break;
                       case "eastup": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go westdown");break;
                   case "westup": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go eastdown");break;
                   case "southup": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go northdown");break;
                   case "northup": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go southdown");break;
                       case "eastdown": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go westup");break;
                   case "westdown": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go eastup");break;
                   case "southdown": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go northup");break;
                   case "northdown": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go southup");break;
                       case "southeast": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go northwest");break;
                   case "northeast": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go southwest");break;
                       case "southwest": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go northeast");break;
                   case "northwest": WG.zhaoymBoss(1);if(BOSS != null){return;};WG.Send("go southeast");break;
                   default: alert("方向"+luj[i]+"没添加！");break;
               }
            i++;
        },

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        zhaoymBoss: function (d){
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                if (npc.innerText.indexOf(zb_npc) != -1) {
                    for(xx in xtime){clearTimeout(xtime[xx])}
                    BOSS =$(npc).attr("itemid");
                    WG.killymBoss();
                    return;
                }}
            if(d!=1){WG.ymlj(d);}
        },
        killymBoss: function () {
            WG.Send("kill " + BOSS);
            xtime[0] = setTimeout(function(){WG.huiK();}, 5000);
        },
        huiK: function(){
            var xue =$("div.progress-bar:first").attr("style");
            xue = xue.substr(6,4);
            xue = parseInt(xue);
            if(xue > 90){
           //     WG.Send("enable parry hengshanwushenjian");
           //     WG.zdwk();
                xtime[1] = setTimeout(function(){KEY.do_command("tasks");}, 500);
                xtime[1] = setTimeout(function(){
                KEY.do_command("tasks");
                var rwss = $("pre.task-desc:last").text();
                var rws = rwss.match("目前([^%]+)，共")[1];
                tip("衙门任务" + rws );
                if(rws == "完成20/20个"){
                clearTimeout(xtime[xx]);WG.wkzidong();return;}
                },800);
                myTime[3] = setTimeout(function(){WG.go_yamen_task();}, 1000);
            }
            else{
                WG.Send("relive");
                WG.liaoshang();
                xtime[2] = setTimeout(function(){WG.huiK();}, 5500);
            }
        },
        ////////////////////////////////////
        ////////////////////////////////////
        /////////    衙门寻图       ////////
        ////////////////////////////////////华山派-舍身崖
        ////////////////////////////////////

        ymemZL: function(){
            WG.go("峨眉派-走廊");
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go west;go west");}, 800)
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go north");}, 1600);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go south;go south");}, 2400);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go south");}, 3200);
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go north;go north;go west");}, 4000)
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go east;go north;go north");}, 4800);
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go south;go south;go east");}, 5600);
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go east;go south");}, 6400);
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go north;go east");}, 7200);
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go west;go north");}, 8000);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(0);}, 8800);
        },
        ymwdLJ: function(){
            WG.go("武当派-林间小径");
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go north"); }, 800);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go north"); }, 1600);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go south;go south;go south"); }, 2400);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(0);}, 3200);
        },
        ymslZL: function(){
            WG.go("少林派-竹林");
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go north"); }, 800);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go north"); }, 1600);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go south;go south;go south"); }, 2400);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go north;go west"); }, 3200);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(0);}, 4000);
        },
        ymxyXD: function(){
            WG.go("逍遥派-林间小道");
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go west;go west"); }, 800);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go east;go north"); }, 1600);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go south;go south"); }, 2400);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go south");}, 3200);
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go north;go north");}, 4000)
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go west;go south");}, 4800);
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go north;go east;go north;go north");}, 5600);
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go south;go south;go east;go north");}, 6400);
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go south;go south");}, 7200);
                xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go south");}, 8000);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(0);}, 8800);
        },
        ymgbAD: function(){
            WG.go("丐帮-暗道");
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go east;"); }, 800);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go east;go east"); }, 1600);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go east"); }, 2400);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go up;"); }, 3200);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go down;go west;go west"); }, 4000);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go up"); }, 4800);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go down;go west;go west;go west"); }, 5600);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(0);},6400);
        },
        ymxySS: function(){
            WG.go("逍遥派-地下石室");
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go down"); }, 800);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go up;go up"); }, 1600);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(0);}, 2400);
        },
        ymhsZY: function(){
            WG.go("华山派-镇岳宫");
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go westup;"); }, 800);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go eastdown;go eastup"); }, 1600);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go southup"); }, 2400);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("jumpdown;"); }, 3200);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go southup"); }, 4000);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(0);}, 4800);
        },
        ymhsSG: function(){
            WG.go("华山派-山谷");
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go northdown;"); }, 800);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go southup;go south"); }, 1600);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(1);if(BOSS != null){return;}WG.Send("go east"); }, 2400);
            xtime[5] =setTimeout(function(){WG.zhaoymBoss(0);}, 3200);
        },

        //////////////////////////////
        //////   自动挖矿打坐     /////////
        ////////////////////////////
        check_dazuo_auto: function () {
            $(".content-message pre hig").text("Begin now!");
            $(".channel pre hir").text("Good job!");
            $(".channel pre him").text("Good job!");
            WG.allStop();
            WG.Send("stopstate;eq do95250c21e");///////////////////////////////////////打坐腰带
            WG.go("扬州城-矿山");
            WG.Send("eq q959270a006;wa");
            myTime[0] = setInterval(function(){ WG.go_kuang_dazuo();}, 6000);
        },

        go_kuang_dazuo: function(){
            clearTimeout(xtime[0]);
            var wakuang = $(".content-message pre hig").text();
            var wuzhinan = "你获得了5";/////////////////没有指南
            if (wakuang.indexOf(wuzhinan) != -1){
                tip("指南");
                WG.Send("stopstate");
                $(".channel pre hir").text("Good job!");
                WG.dazuo_kuang();
                return;
            }
            else{ tip("有指南");
            var xiyan = $(".channel pre").text();
            var xiyanget = "，婚礼将在一分钟后开始。";
            var xiyangett = "：婚礼现在正式开始，新";
            if (zhinan.indexOf(xiyanget) != -1 || zhinan.indexOf(xiyangett) != -1){
                WG.Send("stopstate");
                $(".channel pre hir").text("Good job!");
                WG.xiyan();
                xtime[0] = setTimeout(function(){ WG.check_dazuo_auto(); }, 3000);
            }
                xtime[0] = setTimeout(function(){ WG.go_boss(3); }, 5000);
                }
        },

        dazuo_kuang: function (){
            WG.allStop();
            WG.go("豪宅-练功房");WG.Send("dazuo");
            myTime[0] = setInterval(function(){ WG.go_dazuo();}, 6000);
        },
        go_dazuo: function(){
            clearTimeout(xtime[0]);
            var zhinan = $(".channel pre hir").text();
            var zhinanming ="学会了里面记载的挖矿技巧";
            if (zhinan.indexOf(zhinanming) != -1){
                WG.Send("stopstate");
                $(".content-message pre hig").text("!!");
                WG.check_dazuo_auto();
                return;
            }
            else{tip("无指南");
            var xiyan = $(".channel pre").text();
            var xiyanget = "，婚礼将在一分钟后开始。";
            var xiyangett = "：婚礼现在正式开始，新";
            if (zhinan.indexOf(xiyanget) != -1 || zhinan.indexOf(xiyangett) != -1){
                WG.Send("stopstate");
                $(".channel pre hir").text("Good job!");
                WG.xiyan();
                xtime[0] = setTimeout(function(){ WG.dazuo_kuang(); }, 3000);
            }
                xtime[0] = setTimeout(function(){ WG.go_boss(4); }, 5000);
                }
            },
          /////////////////////////////
         //////////////////////////////
        //////   自动挖矿练习   /////
        ////////////////////////////

        check_lianxi_auto: function () {
            WG.wuxingzhuang();
           zidongjineng = prompt("练习什么技能?","huntianqigong2");
            WG.check_lianxi_auto_go();
        },
        check_lianxi_auto_go: function () {
            $(".content-message pre hig").text("Begin now!");
            $(".channel pre hir").text("Good job!");
            $(".channel pre him").text("Good job!");
            WG.zdwk();
            WG.allStop();
            myTime[0] = setInterval(function(){ WG.go_kuang();}, 6000);
        },

        go_kuang: function(){
            clearTimeout(xtime[0]);
            var wakuang = $(".content-message pre hig").text();
            var wuzhinan = "你获得了5";/////////////////没有指南
            if (wakuang.indexOf(wuzhinan) != -1){
                $(".channel pre hir").text("Good job!");
                WG.lxjineng();
                return;
            }
            else{
            var xiyan = $(".channel pre").text();
            var xiyanget = "，婚礼将在一分钟后开始。";
            var xiyangett = "：婚礼现在正式开始，新";
            if (zhinan.indexOf(xiyanget) != -1 || zhinan.indexOf(xiyangett) != -1){
                $(".channel pre hir").text("Good job!");
                WG.xiyan();
                xtime[0] = setTimeout(function(){ WG.check_lianxi_auto_go(); }, 3000);
            }
                xtime[0] = setTimeout(function(){ WG.go_boss(1); }, 5000);
                }
        },

        lxjineng: function (){
            WG.allStop();
           WG.wuxingzhuang();
            WG.lianxi(zidongjineng);
            myTime[0] = setInterval(function(){ WG.go_lxjineng();}, 6000);
        },
        go_lxjineng: function(){
            var zhinan = $(".channel pre hir").text();
            var zhinanming ="学会了里面记载的挖矿技巧";
            if (zhinan.indexOf(zhinanming) != -1){
                $(".content-message pre hig").text("!!");
                WG.check_lianxi_auto_go();
                return;
            }
            else{tip("无指南");
                clearTimeout(xtime[0]);
                var wakuang = $(".content-message pre").text();
                var jinengman = "未到，必须先打好基础";
                var jinengma = "也许是缺乏实战经验，你觉得";
                if(wakuang.indexOf(jinengman) != -1 || wakuang.indexOf(jinengma) != -1 ){ messageClear();zidongjineng =jnm[jnph];WG.lianxi(zidongjineng);jnph++;}  /////////你的基本功火候未到，必须先打好基础才能继续提高。也许是缺乏实战经验，你觉得你的打狗棒已经到了瓶颈了。*/
                var xiyanget = "，婚礼将在一分钟后开始。";
            var xiyangett = "：婚礼现在正式开始，新";
            if (zhinan.indexOf(xiyanget) != -1 || zhinan.indexOf(xiyangett) != -1){
                $(".channel pre hir").text("Good job!");
                WG.xiyan();
                xtime[0] = setTimeout(function(){ WG.lxjineng(); }, 3000);
            }
                xtime[0] =  setTimeout(function(){ WG.go_boss(2); }, 5000);
                 }
            },
        wkzidong: function (){
            messageClear();
            $(".channel pre hir").text("Good job!");
            WG.allStop();
            WG.zdwk();
            myTime[0] = setInterval(function(){ WG.wkxiyan();}, 6000);
        },
        wkxiyan: function(){
            var wakuang = $(".content-message pre").text();
            var wuzhinan = "你获得了5";/////////////////没有指南
            var wushu = "你身上没有这个东西";
            if (wakuang.indexOf(wuzhinan) != -1 && wakuang.indexOf(wushu) == -1){
                messageClear();
                WG.Send("stopstate;use t0bx2883c76;wa");////////////////////////////lan t0bx2883c76; lv nec827ae619; huang 5rab296ba5b
            }
            clearTimeout(xtime[0]);
            var zhinan = $(".channel pre").text();
            var xiyanget = "，婚礼将在一分钟后开始。";
            var xiyangett = "：婚礼现在正式开始，新";
            if (zhinan.indexOf(xiyanget) != -1 || zhinan.indexOf(xiyangett) != -1){
                $(".channel pre hir").text("Good job!");
                WG.xiyan();
                xtime[0] = setTimeout(function(){ WG.zdwk(); }, 3000);
            }
                xtime[0] = setTimeout(function(){ WG.go_boss(5); }, 5000);
            },
        ////////////////////////////////give udbs278bc54 10000 money    ：婚礼现在正式开始，新  nec827ae619   t0bx2883c76 hjsr291921c
        /////////////////////////////get all from fuow286c17e     ，婚礼将在一分钟后开始。
        xiyan: function(){
                WG.Send("stopstate");
                WG.go("扬州城-醉仙楼");
                WG.Send("go up;give 1fx729c402f 10000 money");  //////////////////////////////小二id 1fx729c402f怎么又是你，每次都跑这么快
                myTime[9] = setTimeout(function(){ WG.get_all();$(".channel pre").text("");}, 2000);
        },
        //////////////////////////////
        //////   抓boss     /////////
        ////////////////////////////
        go_boss: function(d){
            if(bosskg%2 ==1){return;}
            var yaoyan = $(".channel pre him:contains('一带。'):last").text();
            try{
            zb_npc = yaoyan.match("听说([^%]+)出现")[1];
            zb_place = yaoyan.match("现在([^%]+)一带。")[1];
            }
            catch(error){return;}
            if(myboss.indexOf(zb_npc) == -1){
                return;
            }
            tip("boss：" + zb_npc + zb_place );
            BOSS = null;
                WG.allStop();
                WG.Send("stopstate");
            while(zb_place == "武当派-林间小径"){ WG.wdLJ(d);return; }
            while(zb_place == "峨眉派-走廊"){ WG.emZL(d);return; }
            while(zb_place == "丐帮-暗道"){ WG.gbAD(d);return; }
            while(zb_place == "逍遥派-林间小道"){ WG.xyXD(d);return; }
            while(zb_place == "少林派-竹林"){ WG.slZL(d);return; }
            while(zb_place == "逍遥派-地下石室"){ WG.xySS(d);return; }
                 WG.go(zb_place);
                ktime[0] = setTimeout(function(){ WG.zhaoBoss(0,d); }, 800);
        },
        zhaoBoss: function (s,d){
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                if (npc.innerText.indexOf(zb_npc) != -1) {
                    BOSS =$(npc).attr("itemid");
                    tip("找到" + zb_npc);
                    $(".channel pre him").text("Good job!");
                    WG.kill_boss(d);
                    return;
                }}
            if(s!=1){WG.Goback(d);}
        },
        Goback: function (d){
                    tip("找不到" + zb_npc);
             $(".channel pre him").text("Good job!");
             ktime[1] =setTimeout(function(){
                 WG.wuxingzhuang();
                 switch (d)
               {
                   case 1: WG.check_lianxi_auto_go();break;
                   case 2: WG.lxjineng();break;
                   case 3: WG.check_dazuo_auto();break;
                   case 4: WG.dazuo_kuang();break;
                   default:WG.wkzidong();break;
               }}, 4000);
        },

        kill_boss: function (d){
            for(xx in ktime){clearTimeout(ktime[xx]);}
            ktime[0] =setTimeout(function(){ WG.zhandouzhuang();WG.kBoss();}, 3500);
        },
        kBoss: function (d){
            clearTimeout(ktime[1]);
            var aa =eval("$('[itemid="+BOSS+"]').find('.progress-bar').attr('style')");
            ktime[1] =setTimeout(function(){
            if(aa == "width:100%"){ tip("boss 满血");WG.kBoss(d)}
             else{ WG.Send("kill " + BOSS);
                  ktime[2] =setTimeout(function(){WG.afterBoss(d);},5000);
                 }}, 1000)
        },
        killing: function(d){///////////////、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、未知错误，已设置跳过此函数
            clearTimeout(ktime[1]);
            var aa =eval("$('[itemid="+BOSS+"]').find('.progress-bar').attr('style')");
            ktime[1] =setTimeout(function(){
                if( aa == "width:0%"){
                    WG.get_all();WG.afterBoss(d);}
                else{ WG.lianzhaoyi();WG.killing(d);}
            },4000)
        },
        afterBoss: function(d){
            clearTimeout(ktime[4]);
            var xue =$("div.progress-bar:first").attr("style");
            xue = xue.substr(6,4);
            xue = parseInt(xue);
            if(xue > 90){
                WG.lianzhaoyi();
                WG.get_all();
                WG.go("武当派-广场");
                ktime[3] =setTimeout(function(){ WG.afterBossBack(d); }, 1000);}
            else{
                WG.lianzhaoyi();
                WG.get_all();
                WG.Send("relive");
                WG.liaoshang();
                ktime[4] =setTimeout(function(){ WG.afterBoss(d); }, 6000);
            }},
        afterBossBack: function(d){
            if(WG.at("武当派-广场")){
            ktime[4] =setTimeout(function(){
                WG.wuxingzhuang();
                switch (d)
               {
                   case 1: WG.check_lianxi_auto_go();break;
                   case 2: WG.lxjineng();break;
                   case 3: WG.check_dazuo_auto();break;
                   case 4: WG.dazuo_kuang();break;
                   default:WG.wkzidong();break;
               }
                                           }, 4000);}
            else{WG.afterBoss(d);}
        },
        ////////////////////////////////////
        ////////////////////////////////////
        /////////    寻图           ////////
        ////////////////////////////////////
        ////////////////////////////////////

        emZL: function(d){
            WG.go("峨眉派-走廊");
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Send("go west;go west");}, 800);
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Send("go north");}, 1600);
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Send("go south;go south");}, 2400);
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Goback(d);}, 3200);
        },
        wdLJ: function(d){
            WG.go("武当派-林间小径");
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Send("go north"); }, 800);
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Goback(d);}, 1600);
        },
        slZL: function(d){
            WG.go("少林派-竹林");
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Send("go north"); }, 800);
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Goback(d);}, 1600);
        },
        xyXD: function(d){
            WG.go("逍遥派-林间小道");
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Send("go west;go west"); }, 800);
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Send("go east;go north"); }, 1600);
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Send("go south;go south"); }, 2400);
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Goback(d);}, 3200);
        },
        gbAD: function(d){
            WG.go("丐帮-暗道");
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Send("go east;"); }, 800);
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Send("go east;go east"); }, 1600);
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Send("go east"); }, 2400);
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Goback(d);}, 3200);
        },
        xySS: function(d){
            WG.go("逍遥派-地下石室");
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Send("go down"); }, 800);
            ktime[5] =setTimeout(function(){WG.zhaoBoss(1,d);if(BOSS != null){return;}WG.Goback(d);}, 1600);
        },

        bossKG:function () {
            bosskg++;
            if(bosskg%2 ==0){tip("自动BOSS、师门重置、一键日常开启")}else{tip("自动BOSS、师门重置、一键日常关闭")}
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
                    if(ceng > 90){
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
            tip("挑战至"+cengs+"层");
            if(cengs<60){WG.wdtd();} ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////秒杀层
            else{if(cengs<85){xtime[0] =setTimeout(function(){WG.wdtg();}, 3000);}//////////////////////////////////////////////////////////////////////////////力战层
                else{xtime[0] =setTimeout(function(){WG.Send("go out");WG.ask(2,"守门人");WG.ask(3,"守门人");}, 3000);tip("武道塔完成");
                     xtime[0] =setTimeout(function(){
                         if(bosskg%2 ==0){WG.go_family();return;}
                         WG.wkzidong();}, 10000)}}//////////////////////////////////////////////////////////////////////////////////////////////////////////////不敌层
       },
        wdtd:function() {
            clearTimeout(xtime[1]);
            WG.kill_all();
           // WG.lianzhaoyi();
            xtime[1] =setTimeout(function(){WG.Send("go up");}, 300);
            xtime[1] =setTimeout(function(){WG.goWD();}, 1500);
        },
        wdtg:function() {
            clearTimeout(xtime[2]);
            WG.kill_all();
         //   WG.lianzhaoer();
            xtime[2] =setTimeout(function(){
                WG.liaoshang();
                WG.checkZT();}, 7500);
            xtime[2] =setTimeout(function(){
                WG.Send("stopstate;eq 85b829d408f");
                WG.go("武道塔");
                WG.Send("go enter");
            xtime[4] =setTimeout(function(){ WG.goWD(); }, 1500);
                }, 55000);
        },
        checkZT:function() {
            clearTimeout(xtime[3]);
            var xue =$("div.progress-bar:first").attr("style");
            xue = xue.substr(6,4);
            xue = parseInt(xue);
            if(xue > 90){
                WG.zdwk();}
            else{
                xtime[3] =setTimeout(function(){ WG.checkZT(); }, 2000);
            }
        },
        allStop: function () {
            for(xx in xtime){clearTimeout(xtime[xx])}
            for(xx in ktime){clearTimeout(ktime[xx])}
            for(xx in myTime){clearTimeout(myTime[xx])}
            tip("已重置所有计时器");
        },
        tongJ: function() {
            messageClear();
            tip("伤害统计开始");
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
            messageClear();
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
            tip(tongji);
            ktime[2]=setTimeout(WG.tongJ2,5000);
    },
        /////////////////////////////////////////
        /////////////////////////////////////////

        kill_all: function () {
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
        wuxingzhuang: function () {
            WG.Send("stopstate");
         //  for(xx in wxjn){if(wxjn[xx].length>1){WG.Send("enable "+wxjn[xx])}}
            for(xx in wxz){if(wxz[xx].length>1){WG.Send("eq "+wxz[xx])}}
        },
        zhandouzhuang: function () {
            WG.Send("stopstate");
   //         for(xx in zdjn){if(zdjn[xx].length>1){WG.Send("enable "+zdjn[xx])}}
            for(xx in zdz){if(zdz[xx].length>1){WG.Send("eq "+zdz[xx])};}
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
        zdwk: function () {
            WG.Send("stopstate");
            WG.go("扬州城-矿山");
            WG.Send("eq "+kuanggao+";wa");
        },
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
                    "mp0": { name: "五虎", callback: function (key, opt) { WG.lianxi("wuhuduanmendao"); }, },
                    "mp1": { name: "混天", callback: function (key, opt) { WG.lianxi("huntianqigong2"); }, },
                    "mp2": { name: "逍遥", callback: function (key, opt) { WG.lianxi("xiaoyaoyou2"); }, },
                    "mp3": { name: "打狗", callback: function (key, opt) { WG.lianxi("dagoubang"); }, },
                    "mp4": { name: "蛇岛", callback: function (key, opt) { WG.lianxi("shedaoqigong"); }, },
                    "mp5": { name: "降龙", callback: function (key, opt) { WG.lianxi("xianglongzhang"); }, },
                    "mp6": { name: "云龙", callback: function (key, opt) { WG.lianxi("yunlongbian"); }, },
                    "mp7": { name: "五神", callback: function (key, opt) { WG.lianxi("hengshanwushenjian"); }, },
                },
            },
            "更新商品": { name: "更新所有ID", callback: function (key, opt) { WG.getAllid(); }, },
            "更新NPC": { name: "更新NPC", callback: function (key, opt) { WG.updete_npc_id(); }, }
        }
    });

})();