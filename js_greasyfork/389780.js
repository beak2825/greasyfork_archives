// ==UserScript==
// @name         YugiH5 Free Chat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Free Chat for YugiH5
// @author       PhiHungTF
// @match        *://id.yugih5.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389780/YugiH5%20Free%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/389780/YugiH5%20Free%20Chat.meta.js
// ==/UserScript==

(window.onload = function() {
    ClientData.sendProtoMsg = function(c) {
        if (c.type != 200) {
            console.log(c);
        };
        if (c.type == 2163) {
            //
        } else {
            null != ClientData._socket && (c.dt = 1E3 * ClientData.getRunningTime(), ClientData._socket.sendProtoMsg(c));
        }
    };

    BattleUi.prototype.initUiControl = function() {
        var a = this,
            b = cc.Node.create();
        b.setContentSize(ClientView.SCR_SIZE);
        b.setAnchorPoint(.5, .5);
        lc.addChildToCenter(a._scene, b, BattleScene.ZOrder.ui);
        a._layer = b;
        var e = function(c, e, f, g, h) {
                c = ClientView.createShaderButton(c,
                    function(b) {
                        a.onButtonEvent(b)
                    });
                var n;
                lc.V(e) ? n = lc.createSprite(e) : lc.V(f) && (n = cc.isObject(f) ? ClientView.createBMFont(f._font, f._str) : ClientView.createBMFont(ClientView.BMFont.huali_32, f));
                n && (lc.addChildToPos(c, n, cc.p(lc.w(c) / 2, lc.h(c) / 2)), c._icon = n);
                g && (e = ClientView.createBMFont(ClientView.BMFont.huali_26, g), e.setColor(ClientView.COLOR_BUTTON_TITLE), lc.addChildToPos(c, e, cc.p(lc.w(c) / 2, -6)), c._title = e);
                lc.V(h) ? h.addChild(c) : b.addChild(c);
                return c
            },
            f = 12 + ClientView.SCR_EDGE;
        a._btnEndRound = e("bat_btn_6");
        a._btnEndRound.setPosition(ClientView.SCR_W - 40, 150 - ClientView.SCR_EDGE / 2);
        a._btnEndRound.setRotation(20);
        a._btnEndRound.setTouchEnabled(!1);
        a._pRoundTitle = lc.createSprite("bat_label_atk");
        lc.addChildToPos(a._btnEndRound, a._pRoundTitle, cc.p(52, 52));
        a._pRoundTitle.setRotation(-20);
        a._pRoundLabel = ClientView.createBMFont(ClientView.BMFont.huali_26, "0");
        lc.addChildToPos(a._btnEndRound, a._pRoundLabel, cc.p(100, 30));
        a._pRoundLabel.setRotation(-20);
        a._btnSetting = e("bat_btn_2", "bat_btn_set");
        a._btnSetting.setPosition(lc.cw(a._btnSetting) +
            f, ClientView.SCR_H - 80 - lc.ch(a._btnSetting));
        a._btnMusic = e(ClientData._isMusicOn ? "bat_btn_3" : "bat_btn_2", null, Str(ClientData._isMusicOn ? STR.ON : STR.OFF), Str(STR.AUDIO_MUSIC));
        a._btnSndEffect = e(ClientData._isEffectOn ? "bat_btn_3" : "bat_btn_2", null, Str(ClientData._isEffectOn ? STR.ON : STR.OFF), Str(STR.AUDIO_EFFECT));
        a._btnHelp = e("bat_btn_2", "bat_btn_icon_help", null, Str(STR.HELP));
        a._btnManualGuide = e("bat_btn_2", "bat_btn_icon_guide", null, Str(STR.GUIDE));
        a._btnMusic.setVisible(!1);
        a._btnSndEffect.setVisible(!1);
        a._btnHelp.setVisible(!1);
        a._btnManualGuide.setVisible(!1);
        a._btnTask = e("bat_btn_2", "bat_btn_icon_task", null, Str(STR.PASS_CONDITION));
        a._btnRetreat = e("bat_btn_2", "bat_btn_icon_retreat", null, a._retreatReturn ? Str(STR.BATTLE_RETURN) : Str(STR.BATTLE_RETREAT));
        a._btnReturn = e("bat_btn_2", "bat_btn_icon_back", null, Str(STR.RETURN));
        a._btnTask.setVisible(!1);
        a._btnRetreat.setVisible(!1);
        a._btnReturn.setVisible(!1);
        var g = e("bat_btn_2", "bat_btn_icon_pause");
        g.setPosition(f + lc.w(g) / 2, lc.bottom(a._btnSetting) - lc.ch(g));
        a._btnReplay = g;
        var h = e("bat_btn_2", "bat_btn_icon_auto", null, Str(STR.AUTO));
        h.setPosition(g.getPosition());
        lc.offset(h._title, 0, 16);
        a._btnAuto = h;
        a.setBtnAuto(a._autoConfig);
        var n = e("bat_btn_2", null, string.format("x%d", a._battleSpeed));
        n.setTouchRect(cc.rect(-6, -6, lc.w(n) + 12, lc.h(n) + 12));
        a._battleType == Data.BattleType.teach || a._battleType == Data.BattleType.kill_boss ? n.setPosition(f + lc.w(n) / 2, lc.bottom(a._btnSetting) - lc.ch(n)) : n.setPosition(f + lc.w(n) / 2, lc.bottom(g) - lc.ch(n));
        a._btnSpeed = n;
        var p = e("bat_btn_2",
            "bat_btn_icon_switch");
        p.setTouchRect(cc.rect(-6, -6, lc.w(p) + 12, lc.h(p) + 12));
        p.setPosition(f + lc.w(p) / 2, lc.bottom(a._btnSetting) - lc.ch(p));
        a._btnSwitchView = p;
        if (51 >= P._guideID && a._battleType == Data.BattleType.guidance) {
            var r = e("bat_btn_2", "bat_btn_icon_back", null, lc.str(382), a._layer);
            r._icon.setRotation(180);
            r.setLocalZOrder(BattleScene.ZOrder.dialog + 1);
            r.setPosition(f + lc.w(r) / 2, lc.bottom(a._btnSetting) - lc.ch(r));
            a._btnSkipGuide = r
        }
        if (lc._isNeedReport) {
            var t = e("bat_btn_2", "clash_report", null, lc.str(41563));
            t.setTouchRect(cc.rect(-6, -6, lc.w(t) + 12, lc.h(t) + 12));
            t.setPosition(f + lc.w(t) / 2, lc.bottom(a._btnAuto) - lc.ch(t));
            lc.offset(t._title, 0, 16);
            a._btnReport = t;
            var u = e("bat_btn_2", null, null, lc.str(41564));
            u.setTouchRect(cc.rect(-6, -6, lc.w(u) + 12, lc.h(u) + 12));
            u.setPosition(f + lc.w(u) / 2, lc.bottom(a._btnReport) - lc.ch(u));
            u.addLabel(this._reportInfo ? this._reportInfo.score : 0);
            lc.offset(u._title, 0, 16);
            a._btnScore = u
        }
        var _u = e("bat_btn_2", null, null, "Click Here");
        _u.setTouchRect(cc.rect(-6, -6, lc.w(_u) + 12, lc.h(_u) + 12));
        _u.setPosition(f + lc.w(_u) / 2, lc.bottom(a._btnScore) - lc.ch(_u));
        _u.addLabel("Chat");
        lc.offset(_u._title, 0, 16);
        a._btnChat = _u;
        r = e("res/updater/initiativeSkill.png");
        r.setPosition(ClientView.SCR_W - 200 - ClientView.SCR_EDGE, 40);
        r.setDisabledShader(ClientView.SHADER_DISABLE);
        a._btnInitiative = r;
        var y = function() {
            var b = e("bat_btn_1", "bat_icon_guide_npc", null, Str(STR.TIP));
            b.setPosition(f + lc.w(b) / 2, f + lc.h(b) / 2);
            lc.offset(b._icon, -9, 7);
            b.setVisible(!1);
            a._btnGuideHelp = b;
            b = lc.createImageView({
                _name: "img_com_bg_11",
                _crect: ClientView.CRECT_COM_BG11
            });
            b.setVisible(!1);
            lc.addChildToPos(a._layer, b, cc.p(ClientView.SCR_CW, 740), BattleScene.ZOrder.ui);
            a._guideHelp = b
        };
        r = [h, g, n, p];
        lc._isNeedReport && (r.push(t), r.push(u));
        var A = [];
        a._baseBattleType == Data.BattleType.base_PVP ? (A = a._battleType ==
                Data.BattleType.PVP_clash || a._battleType == Data.BattleType.PVP_friend || a._battleType == Data.BattleType.PVP_ladder || a._battleType == Data.BattleType.PVP_duel || a._battleType == Data.BattleType.PVP_Season || a._battleType == Data.BattleType.PVP_new_clash ? a._isObserver ? [p] : [h] : [h], lc._isNeedReport && a._needReport && A.push(t, u)) : a._baseBattleType == Data.BattleType.base_PVE ? A = a._isObserver ? [p] : a._battleType == Data.BattleType.kill_boss ? [n] : [h, n] : a._baseBattleType == Data.BattleType.base_replay ? A = [g, n, p] : a._baseBattleType ==
            Data.BattleType.base_guidance ? (y(), A = []) : a._battleType == Data.BattleType.test ? A = [g, n] : a._battleType == Data.BattleType.test_story ? A = [n, h] : a._battleType == Data.BattleType.unittest ? A = [n, h] : a._battleType == Data.BattleType.teach && (A = isDebug() ? [h] : [n]);
        for (g = 0; g < r.length; g++) h = r[g], h.setVisible(!1);
        for (g = 0; g < A.length; g++) h = A[g], h.setVisible(!0);
        g = lc.createMaskLayer(200, lc.Color3B.black, cc.size(ClientView.SCR_W + 50, ClientView.SCR_H + 50));
        g.setAnchorPoint(.5, .5);
        a._mask = g;
        a._layer.addChild(g, BattleScene.ZOrder.form);
        g.resetAction = function() {
            this.setPosition(ClientView.SCR_CW, ClientView.SCR_CH);
            this.setVisible(!1);
            this.setOpacity(200);
            this.stopAllActions()
        };
        g.resetAction();
        21 <= P._guideID && a._battleType != Data.BattleType.unittest && (g = cc.DragonBonesNode.createWithDecrypt("res/effects/vs.lcres", "vs", "vs"), lc.addChildToPos(a._scene, g, cc.p(ClientView.SCR_CW + ClientView.SCR_EDGE, ClientView.SCR_CH), BattleScene.ZOrder.top), g.gotoAndPlay("effect1"), g.setScale(1.3), a._vsBones = g, a._audioEngine.playEffect("e_vs"));
        if (a._battleType ==
            Data.BattleType.unittest) {
            cc.assert(!1, "self._battleType == Data.BattleType.unittest not supported");
            a._testMaskLayer = lc.createMaskLayer(128);
            lc.addChildToCenter(b, a._testMaskLayer);
            a._btnBatch = e("bat_btn_2", "bat_btn_icon_play", null, Str(STR.BATCH));
            a._btnLayout = e("bat_btn_2", "bat_btn_set", null, Str(STR.LAYOUT));
            a._btnLoad = e("bat_btn_2", "bat_btn_icon_back", null, Str(STR.LOAD));
            a._btnRunFree = e("bat_btn_2", "bat_btn_icon_manual", null, Str(STR.RUN_FREE));
            a._btnExport = e("bat_btn_2", "bat_btn_icon_retreat",
                null, Str(STR.EXPORT));
            a._btnRunTest = e("bat_btn_2", "bat_btn_icon_play", null, Str(STR.RUN_TEST));
            h = [a._btnBatch, a._btnLayout, a._btnLoad, a._btnRunFree, a._btnExport, a._btnRunTest];
            for (g = 0; g < h.length; g++) lc.offset(h[g]._title, 0, 20), h[g].setPosition(80 + 70 * (g + 1) + ClientView.SCR_EDGE, lc.h(b) - lc.ch(h[g]) - 2), h[g].setVisible(2 >= g);
            a.createTestProgress()
        }
    };

    BattleUi.prototype.onButtonEvent = function(a) {
        var b = this;
        if (a == b._btnReturn) b.tryExitScene();
        else if (a == b._btnEndRound) b._player.getActionPlayer().getIsNeedDrop() ? b.showDropHand() : (b._timeOutTimes =
            0, b.operateEnd(), b.hideTip(), b.setGuideHelpButtonVisible(!1));
        else if (a == b._btnSpeed) {
            a = 0 != P._id ? P.getMaxCharacterLevel() : b._player._level;
            var e = lc.D(P._vip, b._player._vip),
                f = b._battleSpeed;
            b._baseBattleType == Data.BattleType.base_replay ? f = 4 == f ? 1 : f + 1 : 1 == f && a < Data._globalInfo._2xSpeedLevel && e < Data._globalInfo._2xSpeedVip ? ToastManager.push(string.format(Str(STR.LORD_UNLOCK_LEVEL), Data._globalInfo._2xSpeedLevel) + Str(STR.BATTLE_SPEED_2X)) : 2 == f && a < Data._globalInfo._3xSpeedLevel && e < Data._globalInfo._3xSpeedVip ?
                (ToastManager.push(string.format(Str(STR.LORD_UNLOCK_LEVEL), Data._globalInfo._3xSpeedLevel) + Str(STR.BATTLE_SPEED_3X)), f = 1) : f = 3 == f ? 1 : f + 1;
            b.setBattleSpeed(f);
            b.updatePvpTimingRope()
        } else if (a == b._btnReplay) b._isPaused = !b._isPaused, b._isPaused ? (b.pause(), b._btnReplay._icon.setSpriteFrame("bat_btn_icon_play")) : (b.resume(), b._btnReplay._icon.setSpriteFrame("bat_btn_icon_pause"));
        else if (a == b._btnAuto) a = 0 != P._id ? P.getMaxCharacterLevel() : b._player._level, 10 > a && !b._isAuto ? (a = string.format(Str(STR.LORD_UNLOCK_LEVEL),
            10) + lc.breakCharacter() + Str(STR.BATTLE_AUTO), ToastManager.push(a)) : (b._autoConfig = !b._autoConfig, b.autoOperate(!b._isAuto));
        else if (a == b._btnSetting) null == b._settingLayer ? b.showSetting() : b.hideSetting();
        else if (a == b._btnMusic) ClientData.toggleAudio(lc.Audio.Behavior.music, !ClientData._isMusicOn), b._btnMusic._icon.setString(Str(ClientData._isMusicOn ? STR.ON : STR.OFF)), b._btnMusic.loadTextureNormal(ClientData._isMusicOn ? "bat_btn_3" : "bat_btn_2", ccui.TextureResType.plistType);
        else if (a == b._btnSndEffect) ClientData.toggleAudio(lc.Audio.Behavior.effect,
            !ClientData._isEffectOn), b._btnSndEffect._icon.setString(Str(ClientData._isEffectOn ? STR.ON : STR.OFF)), b._btnSndEffect.loadTextureNormal(ClientData._isEffectOn ? "bat_btn_3" : "bat_btn_2", ccui.TextureResType.plistType), ClientData._isEffectOn || cc.SimpleAudioEngine.getInstance().stopAllEffects();
        else if (a == b._btnRetreat) b.hideSetting(), b.showRetreat();
        else if (a == b._btnHelp) b.hideSetting(), BattleHelpForm.create().show();
        else if (a == b._btnManualGuide) b.hideSetting(), b._scene.enterManualGuideMode(1, !0);
        else if (a ==
            b._btnGuideHelp) b._guideTipVals && (b._guideTipVals.t.touch = 1, b._guideTipVals.t.hl_type == GuideManager.HighlightType.battle_skill && (b._guideTipVals.t.hl_type = null), b.showTip(b._guideTipVals));
        else if (a == b._btnTask) b.hideSetting(), b.showTask();
        else if (a == b._btnLayout) b.hideTestProgress(), b.setLoadRelativeButtonsVisbile(!1), ClientData._unitTestFile = null, lc.pushScene(BattleTestScene.create(b._scene));
        else if (a == b._btnLoad) cc.assert(!1, "sender == self._btnLoad not supported"), b.hideTestProgress(), a = lc.App.getOpenFileName(),
            null != a && "" != a && (ClientData._unitTestFile = null, ClientData._battleDebugLog = "", BattleTestData._curOpType = BattleTestData.OperationType._load, BattleTestData._singleFileName = a, BattleTestData.resetUsedCards(), b.loadUnitTestFile(a));
        else if (a == b._btnBatch) cc.assert(!1, "sender == self._btnBatch not supported"), b.showTestProgress(), b.setLoadRelativeButtonsVisbile(!1), a = lc.App.getOpenFileName(), null != a && "" != a && (ClientData._unitTestFile = null, e = string.reverse(a).indexOf("\\"), a = a.substring(0, a.length - e), e = io.open('dir "' +
            a + '"').read("*all"), BattleTestData._batch._filenames = b.parseFileList(e, a), BattleTestData._batch._batchCount = BattleTestData._batch._filenames.length, BattleTestData._batch._callback = function() {
            b.startBatchSingle()
        }, b.startBatchSingle());
        else if (a == b._btnRunFree) b.hideTestProgress(), b._testMaskLayer.setVisible(!1), b._player._playerType = BattleData.PlayerType.player;
        else if (a == b._btnRunTest) ClientData._unitTestFile == BattleTestData.DEFAULT_FILE ? ToastManager.push("EXPORT FIRST") : (b.hideTestProgress(), BattleTestData._curOpType =
            BattleTestData.OperationType._runTest, b._testMaskLayer.setVisible(!1), b._player._playerType = BattleData.PlayerType.enviroment, b._player.step());
        else if (a == b._btnExport) b.hideTestProgress(), b.onExportUnitTestData();
        else if (a == b._btnSwitchView) b.reverse();
        else if (a == b._btnSkipGuide) b.showSkipGuideDialog(function() {
            GuideManager.setGuideIDandSave(101, !0);
            lc.replaceScene(ResSwitchScene.create(ClientData.SceneId.battle))
        });
        else if (a == b._btnInitiative) {
            if (b._isAddingBoardCard) return b._playerUi.sendEvent(PlayerUi.EventType.dialog_adding_board_card),
                !0;
            a = b._playerUi._player.getBattleCardsByCanCastInitiativeSkill("BHSDGR");
            a.shift();
            a = a.shift();
            var g = BattleInitiativeSkillsDialog.create(a, 6);
            g.registerItemTouchHandles(function() {}, function() {}, function(a, c) {
                if (b._skillArea) b._skillArea.removeFromParent(), b._skillArea = null;
                else {
                    g.hide();
                    var e = a._skill;
                    b._playerUi.castInitiativeSkill(e._owner, e)
                }
            }, function(a, c) {
                b.showSkill(a, c)
            });
            g.show()
        }
        else if (a == b._btnChat) {
            InputForm.create(InputForm.Type.BATTLE_CHAT, null, null, b).show();
        } else a == b._btnReport ? this._reportInfo.battle_id && 0 != this._reportInfo.battle_id ? ToastManager.push(lc.str(41559)) :
            this._reportInfo.num >= Data._globalInfo._VSReport[2] ? ToastManager.push(lc.str(41558)) : this._reportInfo.score < Data._globalInfo._VSReport[4] ? ToastManager.push(lc.str(41797)) : (g = Dialog.showDialog(lc.str(41560)), g._okHandler = function() {
                this._reportInfo.battle_id = 1;
                this._reportInfo.num++;
                ClientData.sendWorldReport();
                ToastManager.push(lc.str(41557));
                this._reportInfo.score -= Data._globalInfo._VSReport[4];
                0 > this._reportInfo.score && (this._reportInfo.score = 0);
                b._btnScore._label.setString(this._reportInfo.score);
                P._report_info = this._reportInfo
            }.bind(this)) : a == b._btnScore && ToastManager.push(lc.str(41561))
    };

    var InputForm = function() {
        var b = cc.size(720, 280),
            a = [STR.RATE_ADVICE, Str(STR.CHANGE) + Str(STR.REMARK), Str(STR.SEND), Str(STR.INPUT_MESSAGE), "Nhập nội dung chat"],
            c = [Str(STR.SEND), Str(STR.CHANGE), Str(STR.SEND), Str(STR.SEND)],
            e = BaseForm.extend({
                init: function(e, g, h, gg) {
                    BaseForm.prototype.init.call(this, b, a[e], 0);
                    this._type = e;
                    this._param = g;
                    this._callback = h;
                    this._battleUi = gg;
                    g = this._form;
                    h = ClientView.createEditBox("img_com_bg_3", ClientView.CRECT_COM_BG3, cc.size(600, 60), e != 4 ? Str(STR.INPUT_SHARE_TEXT) : "không quá 100 ký tự");
                    lc.addChildToPos(g, h, cc.p(lc.w(g) / 2, lc.bottom(this._titleFrame) -
                        20 - lc.h(h) / 2));
                    this._editor = h;
                    var f = ClientView.createScale9ShaderButton("img_btn_2", function() {
                        this.send()
                    }.bind(this), ClientView.CRECT_BUTTON, 120);
                    f.addLabel(c[e - 1]);
                    lc.addChildToPos(g, f, cc.p(lc.right(h) - lc.w(f) / 2, 80));
                    this._btnSend = f
                },
                send: function() {
                    var a = this._editor.getText(),
                        b = this._type;
                    b == e.Type.FEEDBACK ? 400 < lc.utf8len(a) ? ToastManager.push(Str(STR.MESSAGE) + string.format(Str(STR.CANNOT_MORE_THAN), 400)) : 0 == lc.utf8len(a) ? ToastManager.push(Str(STR.INPUT_MESSAGE)) : (ClientData.sendFeedback(Feedback_pb.PB_FEEDBACK_SUGGESTION,
                        a), ToastManager.push(Str(STR.FEEDBACK_THANKS)), this.hide()) : b == e.Type.TROOP_REMARK ? (b = ClientView.createTTF(a, ClientView.FontSize.S2), "" == a || 200 < lc.w(b) ? ToastManager.push(Str(STR.REMARK_INVALID)) : (b = this._param, P._troopRemarks[b - 1] = a, ClientData.sendTroopRemark(b, a), this.hide())) : b == e.Type.UNION_CHAT && (lc.utf8len(a) > ClientData.MAX_INPUT_LEN ? ToastManager.push(Str(STR.MESSAGE) + string.format(Str(STR.CANNOT_MORE_THAN), ClientData.MAX_INPUT_LEN)) : 0 == lc.utf8len(a) ? ToastManager.push(Str(STR.INPUT_MESSAGE)) :
                        "" !== a && Str(STR.INPUT_SHARE_TEXT) !== a && (b = P._playerUnion, b = b.canOperate(b.Operate.send_message), b == Data.ErrorType.ok ? ClientData.sendChat(Chat_pb.PB_CHAT_UNION, P._unionId, a) : ToastManager.push(ClientData.getUnionErrorStr(b)), this.hide()));
                    b == e.Type.BATTLE_CHAT && (lc.utf8len(a) > 100 ? ToastManager.push(Str(STR.MESSAGE) + string.format(Str(STR.CANNOT_MORE_THAN), 100)) : 0 == lc.utf8len(a) ? ToastManager.push(Str(STR.INPUT_MESSAGE)) :
                        "" !== a && Str(STR.INPUT_SHARE_TEXT) !== a && (ClientData.sendBattleChat(a), this._battleUi.addChat(this._battleUi._player, a), this.hide()));
                },
                hide: function(a) {
                    BaseForm.prototype.hide.call(this, a);
                    this._callback && this._callback()
                }
            });
        e.Type = {
            FEEDBACK: 1,
            TROOP_REMARK: 2,
            UNION_CHAT: 3,
            BATTLE_CHAT: 4
        };
        e.create = function(a, b, c, d) {
            var f = new e;
            f.init(a, b, c, d);
            return f
        };
        return e
    }();
});