// ==UserScript==
// @name         Friendly Uncle
// @namespace    NyaggerSquad
// @icon         https://i.imgur.com/JeyA6ks.png
// @version      1.1
// @description  Use the log viewer to send messages and friend requests to unsuspecting anons. A bit creepy if you ask me.
// @author       anon
// @include      https://mahjongsoul.game.yo-star.com/
// @include      https://game.mahjongsoul.com/
// @include      https://game.maj-soul.com/1/
// @downloadURL https://update.greasyfork.org/scripts/440093/Friendly%20Uncle.user.js
// @updateURL https://update.greasyfork.org/scripts/440093/Friendly%20Uncle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function InappropriateTouch(){
        if (view.DesktopMgr.Inst.paipu_config & view.EMJMode.live_broadcast) return;
        uiscript.UI_DesktopInfo.Inst.btn_seeinfo = function(e) {
            if (view.DesktopMgr.Inst.gameing) {
                var i = view.DesktopMgr.Inst.player_datas[view.DesktopMgr.Inst.localPosition2Seat(e)].account_id;
                if (i) {
                    var n = 1 == view.DesktopMgr.Inst.game_config.category,
                        a = 1,
                        r = view.DesktopMgr.Inst.game_config.meta;
                    r && r.mode_id == game.EMatchMode.shilian && (a = 4), uiscript.UI_OtherPlayerInfo.Inst.show(i, view.DesktopMgr.Inst.game_config.mode.mode < 10 ? 1 : 2, n ? 1 : 2, a)
                }
            }
        }
        uiscript.UI_DesktopInfo.Inst.refreshSeat = function(t) {
            void 0 === t && (t = !1);
            view.DesktopMgr.Inst.seat;
            for (var e = view.DesktopMgr.Inst.player_datas, i = 0; i < 4; i++) {
                var n = view.DesktopMgr.Inst.localPosition2Seat(i),
                    a = this._player_infos[i];
                if (n < 0) a.container.visible = !1;
                else {
                    a.container.visible = !0;
                    var r = view.DesktopMgr.Inst.getPlayerName(n);
                    game.Tools.SetNickname(a.name, r), a.head.id = e[n].avatar_id, a.head.set_head_frame(e[n].account_id, e[n].avatar_frame);
                    var s = cfg.item_definition.item.get(e[n].avatar_frame);
                    if (s && s.iargs[0] ? a.head.me.y = a.head_origin_y - s.iargs[0] / 100 * this.head_offset_y : a.head.me.y = a.head_origin_y, a.avatar = e[n].avatar_id, 0 != i) {
                        var o = e[n].account_id && 0 != e[n].account_id,
                            l = e[n].account_id && 0 != e[n].account_id && view.DesktopMgr.Inst.mode == view.EMJMode.play,
                            h = view.DesktopMgr.Inst.mode != view.EMJMode.play;
                        t ? a.headbtn.onChangeSeat(o, l, h) : a.headbtn.reset(o, l, h)
                    }
                    e[n].title ? a.title.id = game.Tools.titleLocalization(e[n].account_id, e[n].title) : a.title.id = 0
                }
            }
        }
        for (let i = 0; i < 4; i++){
            let head = uiscript.UI_DesktopInfo.Inst._player_infos[i].container.getChildByName("btn_head");
            if (!head)
                continue;
            head.clickHandler.caller.showinfo = true;
            head.clickHandler.caller.btn_seeinfo.visible = true;
            head.clickHandler.caller.enable = false;
        }
    }

    var LazyCheck = setInterval(function(){
        if (uiscript?.UI_DesktopInfo?.Inst?.initRoom){
            uiscript.UI_DesktopInfo.Inst.initRoom = (function(){
                var cacheF = uiscript.UI_DesktopInfo.Inst.initRoom;
                return function(){
                    InappropriateTouch();
                    var result = cacheF.apply(this, arguments);
                    return result;
                };
            })();
            clearInterval(LazyCheck);
        }
    },2000);
})();