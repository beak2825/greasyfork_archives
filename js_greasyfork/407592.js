// ==UserScript==
// @name         我全都要
// @namespace    http://tampermonkey.net/
// @version      2.5.3
// @license MIT
// @description  本地解锁角色皮肤装扮
// @author       88826
// @match        *://majsoul.com/1/
// @match        *://www.majsoul.com/1/
// @match        *://game.maj-soul.com/1/
// @match        *://game.mahjongsoul.com/
// @match        *://mahjongsoul.game.yo-star.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407592/%E6%88%91%E5%85%A8%E9%83%BD%E8%A6%81.user.js
// @updateURL https://update.greasyfork.org/scripts/407592/%E6%88%91%E5%85%A8%E9%83%BD%E8%A6%81.meta.js
// ==/UserScript==

(function () {

    'use strict';
    let hook = function () {
  const args = {};
    const redbull_item_id = ["305501", "309018"];
    class WQDY {
        constructor() {
            this.readSetting();
            this._init();
        }
        get args() {
            return {
                char_id: cfg.item_definition.skin.map_[GameMgr.Inst.account_data.avatar_id].character_id,
                avatar_id: GameMgr.Inst.account_data.avatar_id,
                title: GameMgr.Inst.account_data.title,
                views: uiscript.UI_Sushe.commonViewList,
                view_index: uiscript.UI_Sushe.using_commonview_index,
                finished_endings: uiscript.UI_Sushe.finished_endings_map,
                star_chars: uiscript.UI_Sushe.star_chars,
                characters: uiscript.UI_Sushe.characters,
                isUseOriginEmoji: args.isUseOriginEmoji,
                isSexSort: args.isSexSort
            };
        }
        readSetting() {
            args.setcharacter = Number(localStorage.getItem("char_id"));
            args.setskin = Number(localStorage.getItem("avatar_id"));
            args.title = Number(localStorage.getItem("title"));
            if (localStorage.getItem("views") && localStorage.getItem("views") != "[]") {
                try {
                    args.views = JSON.parse(localStorage.getItem("views"));
                    if (args.views[0].slot != undefined) {
                        args.views[0] = args.views.concat();
                        args.views = args.views.slice(0, 1);
                    }
                } catch (e) {
                    console.log("Failed to load Views,Error Message: " + e);
                }
            };
            args.view_index = Number(localStorage.getItem("view_index"));
            if (localStorage.getItem("finished_endings") && localStorage.getItem("finished_endings") != "[]" && localStorage.getItem("finished_endings") != "{}") {
                try {
                    args.finished_endings = JSON.parse(localStorage.getItem("finished_endings"));
                } catch (e) {
                    console.log("Failed to load Finished Endings,Error Message: " + e);
                }
            };
            if (localStorage.getItem("star_chars") && localStorage.getItem("star_chars") != "[]" && localStorage.getItem("star_chars") != "{}") {
                try {
                    args.star_chars = JSON.parse(localStorage.getItem("star_chars"));
                } catch (e) {
                    console.log("Failed to load Star Chars,Error Message: " + e);
                }
            };
            if (localStorage.getItem("characters") && localStorage.getItem("characters") != "[]" && localStorage.getItem("characters") != "{}") {
                try {
                    args.characters = JSON.parse(localStorage.getItem("characters"));
                } catch (e) {
                    console.log("Failed to load Characters,Error Message: " + e);
                }
            };
            args.isUseOriginEmoji = false;
            if (localStorage.getItem("isUseOriginEmoji")) {
                try {
                    args.isUseOriginEmoji = isUseOriginEmoji ? isUseOriginEmoji : JSON.parse(localStorage.getItem("isUseOriginEmoji"));
                } catch (e) {
                    console.log("Failed to load isUseOriginEmoji,Error Message: " + e);
                }
            }
            args.isSexSort = false;
            if (localStorage.getItem("isSexSort")) {
                try {
                    args.isSexSort = isSexSort ? isSexSort : JSON.parse(localStorage.getItem("isSexSort"));
                } catch (e) {
                    console.log("Failed to load isSexSort,Error Message: " + e);
                }
            }
        }
        writeSetting() {
            let char_id = cfg.item_definition.skin.map_[GameMgr.Inst.account_data.avatar_id].character_id;
            let char = uiscript.UI_Sushe.main_character_id;
            localStorage.setItem("char_id", char_id);
            localStorage.setItem("avatar_id", GameMgr.Inst.account_data.avatar_id);
            localStorage.setItem("title", GameMgr.Inst.account_data.title);
            localStorage.setItem("views", JSON.stringify(uiscript.UI_Sushe.commonViewList));
            localStorage.setItem("view_index", uiscript.UI_Sushe.using_commonview_index);
            localStorage.setItem("finished_endings", JSON.stringify(uiscript.UI_Sushe.finished_endings_map));
            localStorage.setItem("star_chars", JSON.stringify(uiscript.UI_Sushe.star_chars));
            localStorage.setItem("characters", JSON.stringify(uiscript.UI_Sushe.characters));
            localStorage.setItem("isUseOriginEmoji", args.isUseOriginEmoji);
            localStorage.setItem("isSexSort", args.isSexSort);
            console.log("wqdy角色配置保存成功")
        }
        _init() {
            //修改牌桌上角色(改皮肤)
            const _AuthSuccess = game.MJNetMgr.prototype._AuthSuccess;
            game.MJNetMgr.prototype._AuthSuccess = function (e, i, n) {
                e.forEach(v => {
                    if (v.account_id === GameMgr.Inst.account_id) {
                        v.title = GameMgr.Inst.account_data.title;
                        v.character.charid = uiscript.UI_Sushe.main_character_id;
                        v.character.skin = GameMgr.Inst.account_data.avatar_id;
                        v.character.level = 5;
                        v.character.is_upgraded = true;
                        v.character.views = [];
                        v.views = [];
                        v.avatar_frame = game.GameUtility.get_view_id(game.EView.head_frame);
                        console.log(v);
                        let CurrentViewList = uiscript.UI_Sushe.commonViewList[0] && uiscript.UI_Sushe.commonViewList[0].slot != undefined ? uiscript.UI_Sushe.commonViewList : uiscript.UI_Sushe.commonViewList[uiscript.UI_Sushe.using_commonview_index];
                        console.log(CurrentViewList);
                        if (CurrentViewList) {
                            v.views = CurrentViewList;
                            CurrentViewList.forEach(w => {
                                if (w.slot < 5) {
                                    v.character.views.push({
                                        slot: w.slot + 1,
                                        item_id: w.item_id
                                    });
                                } else
                                    return;
                            })
                        }
                        v.avatar_id = GameMgr.Inst.account_data.avatar_id;
                    }
                })
                return _AuthSuccess.call(this, e, i, n)
            }
            //本地解锁背包(覆盖)
            uiscript.UI_Bag.fetch = function () {
                this._item_map = {};
                var items = cfg.item_definition.item.map_;
                for (var id in items) {
                    if (!redbull_item_id.includes(id)) { //不该有的东西
                        if (items[id].category != 1 && items[id].category != 2 && items[id].category != 6 || items[id].category == 6 && items[id].is_unique == 1) //过滤一次性道具、礼物、活动物品
                            this._item_map[id] = {
                                item_id: id,
                                count: 1,
                                category: items[id].category
                            }
                    } else {
                        console.log("removed " + id)
                    }
                }
                app.NetAgent.sendReq2Lobby("Lobby", "fetchBagInfo", {}, (i, n) => {
                    if (i || n.error)
                        uiscript.UIMgr.Inst.showNetReqError("fetchBagInfo", i, n);
                    else {
                        app.Log.log("背包信息：" + JSON.stringify(n));
                        console.log(n);
                        n.bag.items.forEach(item => uiscript.UI_Bag._item_map[item.item_id] = {
                                item_id: item.item_id,
                                count: item.stack,
                                category: items[item.item_id].category
                            })
                        /*
                        uiscript.UI_Bag._item_map[309036] = {
                        item_id: 309036,
                        count: 99,
                        category: items[309036].category
                        }
                         */
                    }
                })
            }
            //本地解锁称号(覆盖)
            uiscript.UI_TitleBook.Init = function () {
                var e = this;
                var n = cfg.item_definition.title.map_;
                for (var a in cfg.item_definition.title.map_) {
                    e.owned_title.push(a)
                }
            }
            uiscript.UI_TitleBook.prototype.changeTitle = function (e) {
                var n = this,
                a = GameMgr.Inst.account_data.title,
                r = 0;
                r = e >= 0 && e < this._showindexs.length ? uiscript.UI_TitleBook.owned_title[this._showindexs[e]] : 600001,
                GameMgr.Inst.account_data.title = r;
                for (var s = -1, o = 0; o < this._showindexs.length; o++)
                    if (a == uiscript.UI_TitleBook.owned_title[this._showindexs[o]]) {
                        s = o;
                        break
                    }
                uiscript.UI_Lobby.Inst.enable && uiscript.UI_Lobby.Inst.top.refresh(),
                uiscript.UI_PlayerInfo.Inst.enable && uiscript.UI_PlayerInfo.Inst.refreshBaseInfo(),
                -1 != s && this._scrollview.wantToRefreshItem(s)
            }
            //本地解锁宿舍(覆盖)
            uiscript.UI_Sushe.init = function (e) {
                let i = this;
                console.group("wqdy读取表");
                console.log(args);
                console.groupEnd();
                // 用于强制解锁语音和传记
                args.spot = [];
                const deleteLimit = (item) => {
                    if (item.jieju != undefined) {
                        args.spot.push(JSON.parse(JSON.stringify(item)));
                    }
                    item.level_limit = 0,
                    item.bond_limit = 0,
                    item.is_married = 0;
                }
                cfg.voice.sound.rows_.forEach(deleteLimit, "voice"),
                cfg.spot.spot.rows_.forEach(deleteLimit, "spot");
                if (args.finished_endings != undefined) {
                    i.finished_endings_map = args.finished_endings;
                }
                if (args.star_chars != undefined) {
                    i.star_chars = args.star_chars;
                }
                i.characters = cfg.item_definition.character.rows_.map(v => {
                    return {
                        charid: v.id,
                        level: 5,
                        exp: 0,
                        views: [],
                        skin: v.init_skin,
                        is_upgraded: true,
                        extra_emoji: cfg.character.emoji.groups_[v.id] ? cfg.character.emoji.groups_[v.id].map(v => v.sub_id) : []
                    }
                });
                if (args.characters != undefined) {
                    for (var j = 0; j < i.characters.length; j++)
                        for (var k = 0; k < args.characters.length; k++)
                            if (i.characters[j].charid == args.characters[k].charid) {
                                i.characters[j].skin = args.characters[k].skin;
                            }
                }
                if (args.isSexSort) {
                    console.log(args.isSexSort);
                    for (var j = i.characters.length - 1; j >= 0; j--) {
                        if (cfg.item_definition.character.map_[i.characters[j].charid].sex == 1) {
                            for (var k = j - 1; k >= 0; k--) {
                                if (cfg.item_definition.character.map_[i.characters[k].charid].sex == 2) {
                                    let _character = i.characters[j];
                                    i.characters[j] = i.characters[k];
                                    i.characters[k] = _character;
                                    break;
                                }
                            }
                        }
                    }
                }
                i.main_character_id = cfg.item_definition.character.map_[args.setcharacter] ? args.setcharacter : 200001;
                i.main_chara_info.charaid = cfg.item_definition.character.map_[args.setcharacter] ? args.setcharacter : 200001;
                if (cfg.item_definition.skin.map_[args.setskin]) {
                    GameMgr.Inst.account_data.avatar_id = args.setskin;
                    i.main_chara_info.skin = args.setskin;
                }
                GameMgr.Inst.account_data.title = args.title;
                app.NetAgent.sendReq2Lobby("Lobby", "fetchCharacterInfo", {}, (n, a) => {
                    if (n || a.error)
                        uiscript.UIMgr.Inst.showNetReqError("fetchCharacterInfo", n, a);
                    else {
                        app.Log.log("fetchCharacterInfo: " + JSON.stringify(a));
                        args.originalCharacterInfo = a;
                        i.send_gift_count = a.send_gift_count;
                        i.send_gift_limit = a.send_gift_limit;
                        if (a.finished_endings) {
                            for (r = 0; r < a.finished_endings.length; r++) {
                                i.finished_endings_map[a.finished_endings[r]] = 1;
                            }
                        }
                        if (a.rewarded_endings)
                            for (var r = 0; r < a.rewarded_endings.length; r++)
                                i.rewarded_endings_map[a.rewarded_endings[r]] = 1;
                        console.group("原有角色");
                        console.log(args.originalCharacterInfo);
                        console.groupEnd();
                        var _a = a.characters.assign();
                        uiscript.UI_Sushe.characters.forEach(c => {
                            if (_a.length > 0) {
                                if (c["charid"] === _a[0]["charid"]) {
                                    c["exp"] = _a[0]["exp"];
                                    c["level"] = _a[0]["level"];
                                    c["is_upgraded"] = _a[0]["is_upgraded"];
                                    _a.shift();
                                }
                            }
                        })
                    }
                })
                if (!args.views || args.view_index === undefined) {
                    app.NetAgent.sendReq2Lobby("Lobby", "fetchAllCommonViews", {}, function (e, n) {
                        if (e || n.error)
                            t.UIMgr.Inst.showNetReqError("fetchAllCommonViews", e, n);
                        else {
                            i.using_commonview_index = n.use,
                            i.commonViewList = [];
                            var a = n.views;
                            if (a)
                                for (var r = 0; r < a.length; r++) {
                                    var s = a[r].values;
                                    s && i.commonViewList.push(s)
                                }
                        }
                    })
                } else {
                    uiscript.UI_Sushe.commonViewList = args.views;
                    uiscript.UI_Sushe.using_commonview_index = args.view_index;
                }
                GameMgr.Inst.load_mjp_view();
                //2021/10/28
                GameMgr.Inst.load_touming_mjp_view();
                e.run();
            }

            const on_data_updata = uiscript.UI_Sushe.on_data_updata;
            uiscript.UI_Sushe.on_data_updata = function (e) {
                if (e.character) {
                    let a = e.character.characters,
                    b = [];
                    uiscript.UI_Sushe.characters.forEach(c => {
                        if (a.length > 0) {
                            if (c["charid"] === a[0]["charid"]) {
                                c["exp"] = a[0]["exp"];
                                c["level"] = a[0]["level"];
                                c["is_upgraded"] = a[0]["is_upgraded"];
                                a.shift();
                                b.push(c);
                            }
                            console.log("人物数据更新", c);
                        }
                    })
                    e.character.characters = b;
                }
                return on_data_updata.call(this, e);
            }

            //解决当前皮肤问题(宿舍更换皮肤)
            const onClickAtHead = uiscript.UI_Sushe_Select.prototype.onClickAtHead;
            uiscript.UI_Sushe_Select.prototype.onClickAtHead = function (e) {
                if (this.select_index == e) {
                    uiscript.UI_Sushe.main_character_id = uiscript.UI_Sushe.characters[e].charid,
                    GameMgr.Inst.account_data.avatar_id = uiscript.UI_Sushe.characters[e].skin;
                }
                return onClickAtHead.call(this, e)
            }
            //记忆皮肤（覆盖）
            uiscript.UI_Sushe.prototype.onChangeSkin = function (t) {
                uiscript.UI_Sushe.characters[this._select_index].skin = t,
                this.change_select(this._select_index),
                uiscript.UI_Sushe.characters[this._select_index].charid == uiscript.UI_Sushe.main_character_id && (GameMgr.Inst.account_data.avatar_id = t),
                window.wqdy.writeSetting();
            }
            //刷新当前皮肤(防止刷新皮肤)(新版本不需要锁定皮肤)
            const refreshInfo = uiscript.UI_Lobby.prototype.refreshInfo;
            uiscript.UI_Lobby.prototype.refreshInfo = function () {
                if (uiscript.UI_Sushe.main_chara_info)
                    GameMgr.Inst.account_data.avatar_id = uiscript.UI_Sushe.main_chara_info.skin;
                window.wqdy.writeSetting();
                return refreshInfo.call(this)
            }
            //皮肤全开
            uiscript.UI_Sushe.skin_owned = t => 1;
            //友人房(更改皮肤)
            const updateData = uiscript.UI_WaitingRoom.prototype.updateData;
            uiscript.UI_WaitingRoom.prototype.updateData = function (t) {
                t.persons.forEach(v => {
                    if (v["account_id"] === GameMgr.Inst.account_id) {
                        v["avatar_id"] = GameMgr.Inst.account_data.avatar_id
                            v["title"] = GameMgr.Inst.account_data.title
                    }
                })
                return updateData.call(this, t)
            }
            const _refreshPlayerInfo = uiscript.UI_WaitingRoom.prototype._refreshPlayerInfo;
            uiscript.UI_WaitingRoom.prototype._refreshPlayerInfo = function (t) {
                if (t.account_id == GameMgr.Inst.account_id) {
                    t.avatar_id = GameMgr.Inst.account_data.avatar_id;
                    t.title = GameMgr.Inst.account_data.title;
                }
                return _refreshPlayerInfo.call(this, t)
            }
            //解决更换装扮问题（覆盖）
            const Container_Zhuangban = function () {};
            for (let i in uiscript.zhuangban.Container_Zhuangban.prototype) {
                if (typeof uiscript.zhuangban.Container_Zhuangban.prototype[i] == "function")
                    Container_Zhuangban.prototype[i] = uiscript.zhuangban.Container_Zhuangban.prototype[i];
            }
            uiscript.zhuangban.Container_Zhuangban = function (i, n, a) {
                var r = this;
                this.page_items = null,
                this.page_headframe = null,
                this.page_desktop = null,
                this.page_bgm = null,
                this.tabs = [],
                this.tab_index = -1,
                this.select_index = -1,
                this.cell_titles = [2193, 2194, 2195, 1901, 2214, 2624, 2856, 2412, 2413, 2826],
                this.cell_names = [411, 412, 413, 417, 414, 415, 416, 0, 0, 0],
                this.cell_default_img = ["myres/sushe/slot_liqibang.jpg", "myres/sushe/slot_hule.jpg", "myres/sushe/slot_liqi.jpg", "myres/sushe/slot_mpzs.jpg", "myres/sushe/slot_hand.jpg", "myres/sushe/slot_liqibgm.jpg", "myres/sushe/slot_head_frame.jpg", "", "", ""],
                this.cell_default_item = [0, 0, 0, 0, 0, 0, 305501, 305044, 305045, 307001],
                this.slot_ids = [0, 1, 2, 10, 3, 4, 5, 6, 7, 8],
                this.slot_map = {},
                this._changed = !1,
                this._locking = null,
                this._locking = a,
                this.container_zhuangban0 = i,
                this.container_zhuangban1 = n;
                for (var s = this.container_zhuangban0.getChildByName("tabs"), o = function (e) {
                    var i = s.getChildAt(e);
                    l.tabs.push(i),
                    i.clickHandler = new Laya.Handler(l, function () {
                        r.locking || r.tab_index != e && (r._changed ? t.UI_SecondConfirm.Inst.show(game.Tools.strOfLocalization(3022), Laya.Handler.create(r, function () {
                                    r.change_tab(e)
                                }), null) : r.change_tab(e))
                    })
                }, l = this, h = 0; h < s.numChildren; h++)
                    o(h);
                this.page_items = new uiscript.zhuangban.Page_Items(this.container_zhuangban1.getChildByName("page_items")),
                this.page_headframe = new uiscript.zhuangban.Page_Headframe(this.container_zhuangban1.getChildByName("page_headframe")),
                this.page_bgm = new uiscript.zhuangban.Page_Bgm(this.container_zhuangban1.getChildByName("page_bgm")),
                this.page_desktop = new uiscript.zhuangban.Page_Desktop(this.container_zhuangban1.getChildByName("page_zhuobu")),
                this.scrollview = this.container_zhuangban1.getChildByName("page_slots").scriptMap["capsui.CScrollView"],
                this.scrollview.init_scrollview(new Laya.Handler(this, this.render_view)),
                this.btn_using = this.container_zhuangban1.getChildByName("page_slots").getChildByName("btn_using"),
                this.btn_save = this.container_zhuangban1.getChildByName("page_slots").getChildByName("btn_save"),
                this.btn_save.clickHandler = new Laya.Handler(this, function () {
                    for (var e = [], i = 0; i < r.cell_titles.length; i++) {
                        var n = r.slot_ids[i];
                        if (r.slot_map[n]) {
                            var a = r.slot_map[n];
                            if (!a || a == r.cell_default_item[i])
                                continue;
                            e.push({
                                slot: n,
                                item_id: a
                            })
                        }
                    }
                    r.btn_save.mouseEnabled = !1;
                    var s = r.tab_index;
                    if (uiscript.UI_Sushe.commonViewList.length < s)
                        for (var a = uiscript.UI_Sushe.commonViewList.length; a <= s; a++)
                            uiscript.UI_Sushe.commonViewList.push([]);
                    if (uiscript.UI_Sushe.commonViewList[s] = e, uiscript.UI_Sushe.using_commonview_index == s && r.onChangeGameView(), r.tab_index != s)
                        return;
                    r.btn_save.mouseEnabled = !0,
                    r._changed = !1,
                    r.refresh_btn()
                }),
                this.btn_use = this.container_zhuangban1.getChildByName("page_slots").getChildByName("btn_use"),
                this.btn_use.clickHandler = new Laya.Handler(this, function () {
                    r.btn_use.mouseEnabled = !1;
                    var e = r.tab_index;
                    uiscript.UI_Sushe.using_commonview_index = e,
                    r.refresh_btn(),
                    r.refresh_tab(),
                    r.onChangeGameView()
                })
                    GameMgr.Inst.account_data.avatar_frame = game.GameUtility.get_view_id(game.EView.head_frame);
            }
            uiscript.zhuangban.Container_Zhuangban.prototype = Container_Zhuangban.prototype;
            //不管怎样,在本地显示发送的表情;如果表情通过网络验证时,表情会被显示两次(仅在网络连接极差时)
            const sendReq2MJ = app.NetAgent.sendReq2MJ;
            app.NetAgent.sendReq2MJ = function (a, b, c, d) {
                if (a === "FastTest" && b === "broadcastInGame") {
                    let i = JSON.parse(c.content);
                    console.log("发送表情", i.emo);
                    if (i.emo > 9)
                        uiscript.UI_DesktopInfo.Inst.onShowEmo(0, i.emo);
                }
                return sendReq2MJ.call(this, a, b, c, d);
            }
            //解决详细资料显示问题
            const sendReq2Lobby = app.NetAgent.sendReq2Lobby;
            app.NetAgent.sendReq2Lobby = function (a, b, c, d) {
                if (a === "Lobby" && b === "fetchAccountInfo") {
                    var d_back = d;
                    d = function (i, n) {
                        if (i || n.error)
                            uiscript.UIMgr.Inst.showNetReqError("fetchAccountInfo", i, n);
                        else {
                            var a = n.account;
                            if (a.account_id == GameMgr.Inst.account_id) {
                                a.avatar_id = GameMgr.Inst.account_data.avatar_id;
                                a.title = GameMgr.Inst.account_data.title;
                            }
                        }
                        return d_back.call(this, i, n);
                    }
                }
                return sendReq2Lobby.call(this, a, b, c, d);
            }
            //解决传记结局羁绊不够问题（覆盖）
            uiscript.UI_Spot.prototype.end_spot = function () {
                var e = {};
                e.character_id = this.spot_character_id,
                e.story_id = this.spot_id,
                console.log(e.story_id),
                e.ending_id = this.current_spot.rewardid;
                var i = this.current_spot.rewardid;
                //在本地验证等级
                var ableToSend = false;
                if (args.spot && args.originalCharacterInfo.characters) {
                    args.spot.forEach(a => {
                        if (a.unique_id == e.story_id) {
                            args.originalCharacterInfo.characters.forEach(b => {
                                if (b.charid == a.id) {
                                    if (b.level >= a.level_limit && b.is_upgraded >= a.is_married) {
                                        ableToSend = true;
                                    }
                                }
                            })
                        }
                    })
                }
                if (ableToSend) {
                    app.NetAgent.sendReq2Lobby("Lobby", "addFinishedEnding", e, function (e, n) {
                        e || n.error ? uiscript.UIMgr.Inst.showNetReqError("addFinishedEnding", e, n) : uiscript.UI_Sushe.add_finish_ending(i)
                    });
                } else {
                    uiscript.UI_Sushe.add_finish_ending(i);
                }
                var n = cfg.spot.rewards.get(this.current_spot.rewardid),
                a = n ? n.type : 1;
                uiscript.UI_Spot_End.Inst.show("spot_end" + a);
                window.wqdy.writeSetting();
            }
            //删除角色标星的服务器请求
            uiscript.UI_Sushe.change_char_star = function (t) {
                var e = this.star_chars.indexOf(t);
                -1 != e ? this.star_chars.splice(e, 1) : this.star_chars.push(t);
                console.log(this.star_chars);
            }
            //解决友尽房界面更换人物、皮肤问题
            uiscript.zhuangban.Page_Waiting_Head.prototype.close = function (e) {
                var i = this;
                if (this.me.visible)
                    if (e)
                        this.me.visible = !1;
                    else {
                        var n = this.chara_infos[this.choosed_chara_index];
                        if (n.chara_id != uiscript.UI_Sushe.main_character_id) {
                            uiscript.UI_Sushe.main_character_id = n.chara_id;
                        }
                        if (this.choosed_skin_id != GameMgr.Inst.account_data.avatar_id)
                            for (var a = 0; a < uiscript.UI_Sushe.characters.length; a++)
                                if (uiscript.UI_Sushe.characters[a].charid == n.chara_id) {
                                    uiscript.UI_Sushe.characters[a].skin = this.choosed_skin_id;
                                    break;
                                }
                        GameMgr.Inst.account_data.avatar_id = this.choosed_skin_id;
                        if (uiscript.UI_WaitingRoom && uiscript.UI_WaitingRoom.Inst && uiscript.UI_WaitingRoom.Inst._refreshPlayerInfo) {
                            for (var t = 0, e = 0; e < uiscript.UI_WaitingRoom.Inst.players.length; e++)
                                0 != uiscript.UI_WaitingRoom.Inst.players[e].category && (uiscript.UI_WaitingRoom.Inst._refreshPlayerInfo(uiscript.UI_WaitingRoom.Inst.players[e]), t++);
                        }
                        uiscript.UIBase.anim_alpha_out(this.me, {
                            x: 0
                        }, 200, 0, Laya.Handler.create(this, function () {
                                i.me.visible = !1
                            }))
                    }
            }
            //将表情设置为原人物表情
            const initRoom = uiscript.UI_DesktopInfo.prototype.initRoom;
            uiscript.UI_DesktopInfo.prototype.initRoom = function () {
                if (args.isUseOriginEmoji && view.DesktopMgr.Inst.mode == view.EMJMode.play && args.originalCharacterInfo) {
                    view.DesktopMgr.Inst.main_role_character_info.charid = args.originalCharacterInfo.main_character_id;
                }
                return initRoom.call(this);
            }
            const changeCharacter = function () {
                if (args.isUseOriginEmoji) {
                    for (var i = 0; i < view.DesktopMgr.Inst.player_datas.length; i++) {
                        if (view.DesktopMgr.Inst.player_datas[i].account_id == GameMgr.Inst.account_id) {
                            view.DesktopMgr.Inst.player_datas[i].character.charid = uiscript.UI_Sushe.main_character_id;
                        }
                    }
                }
            }
            const shout = uiscript.UI_DesktopInfo.prototype.shout; //在表情加载好后，将语音换回原人物
            uiscript.UI_DesktopInfo.prototype.shout = function (a, b, c) {
                changeCharacter();
                return shout.call(this, a, b, c);
            }
            const playMindVoice = view.DesktopMgr.prototype.playMindVoice;
            view.DesktopMgr.prototype.playMindVoice = function () {
                changeCharacter();
                return playMindVoice.call(this);
            }
            uiscript.UI_DesktopInfo.prototype.onShowEmo = function (t, e) { //确保发送的表情显示正常
                var i = this._player_infos[t];
                if (args.isUseOriginEmoji && i.avatar == GameMgr.Inst.account_data.avatar_id) {
                    view.DesktopMgr.Inst.player_datas[view.DesktopMgr.Inst.localPosition2Seat(t)].character.charid = args.originalCharacterInfo.main_character_id;
                }
                0 != t && i.headbtn.emj_banned || i.emo.show(t, e)
                console.log(i);
                if (args.isUseOriginEmoji && i.avatar == GameMgr.Inst.account_data.avatar_id) {
                    view.DesktopMgr.Inst.player_datas[view.DesktopMgr.Inst.localPosition2Seat(t)].character.charid = uiscript.UI_Sushe.main_character_id;
                }
            }
            const init = uiscript.UI_Achievement.init;
            uiscript.UI_Achievement.init = function (t) {
                cfg.achievement.achievement.forEach(function (achievement) {
                    if (achievement.deprecated) {
                        //console.log(achievement)
                    }
                    achievement.locked = 0;
                })
                init.call(this, t);
            }
        }
    }

    function isCurrentVersion(ver) {
        var scripts = document.getElementsByTagName("script");
        for (i = 0; i < scripts.length; i++) {
            if (scripts[i].outerHTML.includes("code.js")) {
                if (scripts[i].outerHTML.includes(ver)) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
        return -1;
    }

    function getCurrentVersion() {
        request = new XMLHttpRequest();
        request.onload = function () {
            if (request.status === 200) {
                current_version = request.responseText;
                console.log("Current Version: " + current_version);
            } else {
                alert("[我全都要]\n版本号获取异常，请回报作者。");
            }
            var versionStatus = isCurrentVersion(current_version);
            if (versionStatus === 0) {
                alert("[我全都要]\n当前code.js版本与云端/更新时版本号不同，建议直到更新为止暂停使用。");
            } else if (versionStatus === -1) {
                alert("[我全都要]\n未检测到code.js，建议暂停使用并回报作者。");
            } else if (versionStatus != 1) {
                alert("[我全都要]\ncode.js因不明原因检测失败，建议暂停使用并回报作者。");
            }
        }
        request.open("GET", "https://gateway.sykj.site:20006/wqdy");
        request.send()
    }

    if (!window.wqdy) {
        getCurrentVersion();
        window.wqdy = new WQDY();
        window.wqdy.readSetting();
        Majsoul_Plus["wqdy"] = {
            name: "我全都要",
            actions: {
                "手动保存配置": () => window.wqdy.writeSetting(),
                "切换表情显示": () => {
                    args.isUseOriginEmoji = !args.isUseOriginEmoji;
                    localStorage.setItem("isUseOriginEmoji", args.isUseOriginEmoji);
                    return "应用成功，下一局游戏生效。"
                },
                "按性别排序角色": () => {
                    args.isSexSort = !args.isSexSort;
                    localStorage.setItem("isSexSort", args.isSexSort);
                    return "应用成功，重新启动游戏后生效。"
                }
            }
        }
        console.log("我全都要 加载完毕");
    } else {
        console.warn("")
}
           
    }
    let inv = setInterval(hook, 3000)

})();
