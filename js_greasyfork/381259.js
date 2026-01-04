// ==UserScript==
// @name         jhmud_plugins
// @namespace    knva
// @version      0.0.0.12
// @description  江湖论道插件
// @author       knva
// @match        http://jh.92mud.com/*
// @match        http://47.96.151.43/*
// @homepage     https://greasyfork.org/zh-CN/scripts/381259-jhmud-plugins/code
// @run-at       document-start
// @grant        unsafeWindow
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/381259/jhmud_plugins.user.js
// @updateURL https://update.greasyfork.org/scripts/381259/jhmud_plugins.meta.js
// ==/UserScript==

(function () {
    'use strict';
    Array.prototype.baoremove = function (dx) {
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        this.splice(dx, 1);
    }
    String.prototype.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    };
    //data start
    const C = {
        path: {
            "扬州城-中央广场": "jh fam 0 start ;",
            "扬州城-杂货铺": "jh fam 0 start ;go east ;go south ;",
            "扬州城-药铺": "jh fam 0 start ;go east ;go east ;go north ;",
            "扬州城-打铁铺": "jh fam 0 start ;go east ;go east ;go south ;",
            "扬州城-醉仙楼": "jh fam 0 start ;go north ;go north ;go east ;",
            "华山派-镇岳宫": "jh fam 3 start ;",
            "逍遥派-青草坪": "jh fam 5 start ;",
            "扬州城-书房二楼": "jh fam 0 start ;go east ;go north ;go up ;"
        },
        sm: {
            "华山派": {
                room: "华山派-镇岳宫",
                npc: "高根明"
            },
             "逍遥派": {
                room: "逍遥派-青草坪",
                npc: "苏星河"
            }
        },
        goods: {
            "米饭": {
                "id": null,
                "type": "wht",
                "sales": "Npc 店小二",
                "place": "扬州城-醉仙楼"
            },
            "包子": {
                "id": null,
                "type": "wht",
                "sales": "Npc 店小二",
                "place": "扬州城-醉仙楼"
            },
            "鸡腿": {
                "id": null,
                "type": "wht",
                "sales": "Npc 店小二",
                "place": "扬州城-醉仙楼"
            },
            "面条": {
                "id": null,
                "type": "wht",
                "sales": "Npc 店小二",
                "place": "扬州城-醉仙楼"
            },
            "扬州炒饭": {
                "id": null,
                "type": "wht",
                "sales": "Npc 店小二",
                "place": "扬州城-醉仙楼"
            },
            "米酒": {
                "id": null,
                "type": "wht",
                "sales": "Npc 店小二",
                "place": "扬州城-醉仙楼"
            },
            "花雕酒": {
                "id": null,
                "type": "wht",
                "sales": "Npc 店小二",
                "place": "扬州城-醉仙楼"
            },
            "女儿红": {
                "id": null,
                "type": "wht",
                "sales": "Npc 店小二",
                "place": "扬州城-醉仙楼"
            },
            "醉仙酿": {
                "id": null,
                "type": "hig",
                "sales": "Npc 店小二",
                "place": "扬州城-醉仙楼"
            },
            "神仙醉": {
                "id": null,
                "type": "hiy",
                "sales": "Npc 店小二",
                "place": "扬州城-醉仙楼"
            },
            //扬州城-杂货铺
            "布衣": {
                "id": null,
                "type": "wht",
                "sales": "Npc 杂货铺老板 杨永福",
                "place": "扬州城-杂货铺"
            },
            "钢刀": {
                "id": null,
                "type": "wht",
                "sales": "Npc 杂货铺老板 杨永福",
                "place": "扬州城-杂货铺"
            },
            "木棍": {
                "id": null,
                "type": "wht",
                "sales": "Npc 杂货铺老板 杨永福",
                "place": "扬州城-杂货铺"
            },
            "英雄巾": {
                "id": null,
                "type": "wht",
                "sales": "Npc 杂货铺老板 杨永福",
                "place": "扬州城-杂货铺"
            },
            "布鞋": {
                "id": null,
                "type": "wht",
                "sales": "Npc 杂货铺老板 杨永福",
                "place": "扬州城-杂货铺"
            },
            "铁戒指": {
                "id": null,
                "type": "wht",
                "sales": "Npc 杂货铺老板 杨永福",
                "place": "扬州城-杂货铺"
            },
            "簪子": {
                "id": null,
                "type": "wht",
                "sales": "Npc 杂货铺老板 杨永福",
                "place": "扬州城-杂货铺"
            },
            "长鞭": {
                "id": null,
                "type": "wht",
                "sales": "Npc 杂货铺老板 杨永福",
                "place": "扬州城-杂货铺"
            },
            "钓鱼竿": {
                "id": null,
                "type": "wht",
                "sales": "Npc 杂货铺老板 杨永福",
                "place": "扬州城-杂货铺"
            },
            "鱼饵": {
                "id": null,
                "type": "wht",
                "sales": "Npc 杂货铺老板 杨永福",
                "place": "扬州城-杂货铺"
            },
            "铁剑": {
                "id": null,
                "type": "wht",
                "sales": "Npc 铁匠铺老板 铁匠",
                "place": "扬州城-打铁铺"
            },
            "钢刀": {
                "id": null,
                "type": "wht",
                "sales": "Npc 铁匠铺老板 铁匠",
                "place": "扬州城-打铁铺"
            },
            "铁棍": {
                "id": null,
                "type": "wht",
                "sales": "Npc 铁匠铺老板 铁匠",
                "place": "扬州城-打铁铺"
            },
            "铁杖": {
                "id": null,
                "type": "wht",
                "sales": "Npc 铁匠铺老板 铁匠",
                "place": "扬州城-打铁铺"
            },

            "钢针": {
                "id": null,
                "type": "wht",
                "sales": "Npc 铁匠铺老板 铁匠",
                "place": "扬州城-打铁铺"
            },
            "金创药": {
                "id": null,
                "type": "hig",
                "sales": "Npc 药铺老板 平一指",
                "place": "扬州城-药铺"
            },
            "引气丹": {
                "id": null,
                "type": "hig",
                "sales": "Npc 药铺老板 平一指",
                "place": "扬州城-药铺"
            },
            "养精丹": {
                "id": null,
                "type": "hig",
                "sales": "Npc 药铺老板 平一指",
                "place": "扬州城-药铺"
            },
        },
        npcs: {
           "店小二": ""
        }
    }
    //data end
    function ab2str(u, f) {
        var b = new Blob([u]);
        var r = new FileReader();
        r.readAsText(b, 'utf-8');
        r.onload = function () {
            if (f) f.call(null, r.result)
        }
    }
    if (WebSocket) {
        var _ws = WebSocket,
            ws, ws_on_message;
        unsafeWindow.WebSocket = function (uri) {
            ws = new _ws(uri);
        };
        unsafeWindow.WebSocket.prototype = {
            CONNECTING: _ws.CONNECTING,
            OPEN: _ws.OPEN,
            CWGOSING: _ws.CWGOSING,
            CWGOSED: _ws.CWGOSED,
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
                console.log({
                    "type": "send",
                    "msg": text
                });
              //  $('.content-message').append("<hiy>" + text + "<nor>;");

                ws.send(text);
            },
            close: function () {
                ws.close();
            }
        };
    }
    var messageAppend = function (data) {
        console.log(data);
    }
    var WG = {
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
            var mdata = '';
            if (msg.data instanceof Blob) {
                var reader = new FileReader();
                reader.readAsText(msg.data, "GB2312");
                reader.onload = function (e) {
                    var receivedData = this.result.split("^^");
                    var maxWGength = receivedData.length;
                    for (var i = 0; i < maxWGength; i++) {
                        var data = receivedData[i];

                        if (data == "" || data == " " || data == "\r\n")
                            continue;
                        if ((data[0] == '{' || data[0] == '[') && data.indexOf("[44m") == -1) {
                            if (data[data.length - 1] == '}' || data[data.length - 1] == "]") {
                                var func = new Function("return " + data + ";");
                                mdata = func();
                            } else {
                                mdata = {
                                    type: 'text',
                                    msg: data
                                };
                            }
                        } else {
                            mdata = {
                                type: 'text',
                                msg: data
                            };
                        }
                        try {
                            console.log(JSON.parse(mdata));
                        } catch (e) {
                            console.log(mdata);
                        }

                        WG.run_hook(mdata.type, mdata);
                    }
                }

            } else {
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
                console.log(data);
                WG.run_hook(data.type, data);
            }
        },
        Send: function (cmd) {
            if (cmd) {
                cmd = cmd instanceof Array ? cmd : cmd.split(';');
                for (var c of cmd) {
                    switch (c) {
                        case 'sm':
                            WG.sm_button();
                            break;
                        case 'upid':
                            WG.update_id_all();
                            break;
                        case 'cs':
                            WG.chaoshu();
                            break;
                        case 'fb':
                            WG.fb();
                            break;
                        case 'k':
                            WG.kill_all();
                            break;
                        case 'g':
                            WG.get_all();
                            break;
                        default:
                            ws.send(c + "\n");
                            break;
                    }

                };
            }
        },
        todo: function (fn) {
            var h = WG.add_hook('text', function (data) {
                if (data.msg.indexOf("你要看什麽？") >= 0) {
                    WG.remove_hook(h);
                    if (typeof fn === 'function') {
                        fn();
                    } else {
                        WG.Send(fn);
                    }
                }
            });
            WG.Send('look 1');
        },
        go: async function (p) {
            if (WG.at(p)) return;
            if (C.path[p] != undefined) WG.Send(C.path[p]);
            else {
                console.log(p + "无法到达");
            }
            WG.sleep(950);
        },
        at: function (p) {
            return G.room_name == p;
        },
        find_item: function (name) {
            for (let [k, v] of G.items) {
                if (v.name.indexOf(name) >= 0) {
                    return k;
                }
            }
            return null;
        },
        find_sm_items: function (item) {
            for (let data of C.sm_items) {
                for (let j = 0; j < data.items.length; j++) {
                    if (data.items[j] == item) {
                        return data;
                    }
                }
            }
            if (WG.inArray(item, C.store_list)) return {
                type: "store",
            };
            return null;

        },
        inArray: function (val, arr) {
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if (item.length < 2) continue;
                if (item[0] == "<") {
                    if (item == val) return true;
                } else {
                    if (val.indexOf(item) >= 0) return true;
                }
            }
            return false;

        },
        sleep: function (time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        },
        update_goods_id: function () {
            var lists = $(".dialog-list > .obj-list:first");
            var id;
            var name;
            if (lists.length) {
                messageAppend("检测到商品清单");
                for (var a of lists.children()) {
                    a = $(a);
                    id = a.attr("obj");
                    name = $(a.children()[0]).html().split("<nor>")[0];
                    C.goods[name].id = id;
                    messageAppend(name + ":" + id);
                }
                GM_setValue("goods", C.goods);
                return true;
            } else {
                messageAppend("未检测到商品清单");
                return false;
            }
        },
        update_npc_id: function () {
            var lists = $(".room_items .room-item");

            for (var npc of lists) {
                if (npc.lastElementChild.innerText.indexOf("Npc") >= 0) {
                    C.npcs[npc.lastElementChild.innerText] = $(npc).attr("itemid")
                    messageAppend(npc.lastElementChild.innerText + " 的ID:" + $(npc).attr("itemid"));
                }

            }
            GM_setValue("npcs", C.npcs);
        },
        update_id_all: function () {

            var t = [];
            Object.keys(C.goods).forEach(function (key) {
                if (t[C.goods[key].place] == undefined)
                    t[C.goods[key].place] = C.goods[key].sales;
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
                            WG.go("扬州城-中央广场");
                            clearInterval(timer);
                            return;
                        }
                        place = keys[i];
                        sales = t[place];
                        WG.go(place);
                        state = 1;
                        break;
                    case 1:
                        WG.update_npc_id();
                        var id = C.npcs[sales];
                        WG.Send("list");
                        state = 2;
                        break;
                    case 2:
                        if (WG.update_goods_id()) {
                            state = 0;
                            i++;
                        } else
                            state = 1;
                        break;
                }
            }, 1000);
        },
        buy: function (good) {
            var tmp = C.npcs[good.sales];
            if (tmp == undefined) {
                WG.update_npc_id();
                return false;
            }
            WG.Send("list");
            WG.Send("buy 1 " + good.id + " from " + tmp);
            return true;
        },
        sm_state: undefined,
        sm_item: "",
        sm: function () {

            switch (WG.sm_state) {
                case 0:
                    //前往师门接收任务
                    WG.go(C.sm[G.family].room);
                    WG.sm_state = 1;
                    setTimeout(WG.sm, 1100);
                    break;
                case 1:
                    var lists = $(".room_items .room-item");
                    var id = null;
                    for (var npc of lists) {
                        if (npc.lastElementChild.innerText.indexOf(C.sm[G.family].npc) >= 0 &&
                            npc.lastElementChild.innerText.indexOf("Npc") >= 0) {
                            id = $(npc).attr("itemid");
                        }
                    }
                    if (id != undefined) {
                        WG.Send("task sm " + id);
                        WG.Send("task sm " + id);
                        WG.sm_state = 2;
                    } else {
                        WG.update_npc_id();
                        WG.sm_state = 0;
                    }
                    setTimeout(WG.sm, 1100);
                    break;
                case 2:
                    //获取师门任务物品
                    var item = $("span[cmd$='giveup']:last").parent().prev();
                    if (item.length == 0) {
                        WG.sm_state = 0;
                        setTimeout(WG.sm, 1100);
                        return;
                    };
                    var itemName = item.html().split('<nor>')[0];
                    item = item[0].outerHTML.split("，")[0];

                    //能上交直接上交
                    var tmpObj = $("span[cmd$='giveup']:last").prev();
                    for (let i = 0; i < 6; i++) {
                        if (tmpObj.children().html()) {
                            if (tmpObj.html().indexOf(item) >= 0) {
                                tmpObj.click();
                                messageAppend("自动上交" + item);
                                WG.sm_state = 0;
                                setTimeout(WG.sm, 1100);
                                return;
                            }
                            tmpObj = tmpObj.prev();
                        }
                    }
                    //不能上交自动购买
                    WG.sm_item = C.goods[itemName];

                    if (WG.sm_item != undefined && item.indexOf(WG.sm_item.type) >= 0) {
                        WG.go(WG.sm_item.place);
                        messageAppend("自动购买" + item);
                        WG.sm_state = 3;
                        setTimeout(WG.sm, 1100);
                    } else {
                        messageAppend("无法购买" + item);

                        $("span[cmd$='giveup']:last").click();
                        messageAppend("放弃任务");
                        WG.sm_state = 0;
                        setTimeout(WG.sm, 1100);
                        return;

                    }
                    break;
                case 3:
                    WG.go(WG.sm_item.place);
                    if (WG.buy(WG.sm_item)) {
                        WG.sm_state = 0;
                    }
                    setTimeout(WG.sm, 1100);
                    break;
            }

        },
        sm_button: function () {
            if (WG.sm_state >= 0) {
                WG.sm_state = -1;
                   $(".sm").text("师门");
            } else {
                WG.sm_state = 0;
                  $(".sm").text("停止");
                setTimeout(WG.sm, 1100);
            }
        },
        chaoshu:function(){
            WG.go('扬州城-书房二楼');
            WG.Send("work");
        },
        fb:function(){
          var cmd = 'go_fuben /fuben/fuben/gaoshou ;go_fuben over'
          var time = 0;
          var a = setInterval(()=>{
            if (time>20)
            {
              clearInterval(a)
            }else{
              WG.Send(cmd);
              time++;
            }
          },2000);
    } ,          kill_all: function () {
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
    }
    var H = {
        init: function () {
            WG.add_hook("login", (data) => {
                H.Login();
            })
        },
        Login: function () {
            $("span[command=showcombat]").click();
            setTimeout(() => {
                $(".combat-panel").after(UI.sendinput);
                    let px = $('.tool-bar.right-bar').css("bottom");
                        px.replace("px", "");
                        px = parseInt(px);
                        px = px + 16;
                        $('.tool-bar.right-bar').css("bottom", px + "px");
                $("#send").on('click', function (event) {
                    var d = $("#sendinput").val();
                    WG.Send(d);
                });
                WG.Send('score');
                C.goods = GM_getValue("goods", C.goods);
                C.npcs = GM_getValue("npcs", C.npcs);
                $("<pre></pre>").append("初次使用,请先输入upid 目前功能有华山师门(sm)20次进退副本(fb) 抄书(cs)  .")
                GM_addStyle(UI.css);
                $('.content-message').after(UI.btn);
                $('.sm').on('click',()=>{WG.sm_button()});
                $('.cs').on('click',()=>{WG.chaoshu()});
                $('.ki').on('click',()=>{WG.kill_all()});
                $('.ga').on('click',()=>{WG.get_all()});

            }, 500);
        }
    }
    var UI = {
        css: ` .zdy-item{
                display: inline-block;border: solid 1px gray;color: gray;background-color: black;
                text-align: center;cursor: pointer;border-radius: 0.25em;min-width: 2.5em;margin-right: 0em;
                margin-left: 0.4em;position: relative;padding-left: 0.4em;padding-right: 0.4em;line-height: 24px;}
                .WG_button { width: calc(100% - 40px);}`,
        btn : `<div class='WG_button'>
        <span class="zdy-item sm" >师门</span>
        <span class="zdy-item cs" >抄书</span>
        <span class="zdy-item ki" >击杀</span>
        <span class="zdy-item ga" >拾取</span>
        </div>
        `,
        sendinput:`<div style="
    overflow: hidden;
"><input style="width:70%;float:left" id="sendinput" value="" ><input style="width:29%; float:left" type="button" value="send" id="send"></div>`
    }

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
        auto_preform: false,
        can_auto: false,
        level: undefined,
        getitemShow: undefined,
        wk_listener: undefined,
        status: new Map(),

    };

    var GI = {
        init: function () {
            WG.add_hook("dialog", (data) => {
                if (data.dialog == "score") {
                    G.id = data.id;
                    G.family = data.family;
                }
            });
            WG.add_hook("room", (data) => {
                G.room_name = data.ame;
            });
            WG.add_hook(['items', 'itemadd', 'itemremove'], (data) => {

                if (data.type == "items") {
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

                            G.items.set(item.id, {
                                name: n,
                                title: t,
                                state: s,
                                max_hp: item.max_hp,
                                max_mp: item.max_mp,
                                hp: item.hp,
                                mp: item.mp,
                                p: item.p,
                                damage: 0
                            });
                        }

                    }
                } else if (data.type == "itemadd") {
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
                        G.items.set(data.id, {
                            name: n,
                            title: t,
                            state: s,
                            max_hp: data.max_hp,
                            max_mp: data.max_mp,
                            hp: data.hp,
                            mp: data.mp,
                            p: data.p,
                            damage: 0
                        });
                    }
                } else if (data.type == "itemremove") {
                    G.items.delete(data.id);
                }
            });
        }
    }
    $(document).ready(function () {
        H.init();
        GI.init();
    });
})();