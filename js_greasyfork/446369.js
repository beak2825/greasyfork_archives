// ==UserScript==
// @name         ʀꜱᴛʟ+
// @namespace	http://tampermonkey.net/
// @version		1.0.3
// @description	extend script for senpai clients
// @author		you
// @match		http://caffe.senpai-agar.online/lwga/
// @match		http://senpai-agar.online/lwga/
// @grant		none
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/446369/%CA%80%EA%9C%B1%E1%B4%9B%CA%9F%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/446369/%CA%80%EA%9C%B1%E1%B4%9B%CA%9F%2B.meta.js
// ==/UserScript==
window.gVar = {
    Waves: []
}, PIXI = null, "undefined" == typeof gts && (gts = gTargetSite);
var tcfg = {},
    biggest = null,
    halfbiggest = null,
    stopMouse = !1,
    MAIN_RENDERER, SUB_RENDERER, GAMEPLAY_STYLE, MINIMAP_STYLE;
jQuery.getScript("https://pixijs.download/v6.3.2/pixi-legacy.min.js").done(() => {
    init(), start()
}), $("title").html("ʀꜱᴛʟ");
const GENERAL_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$%",
    init = () => {
        console.clear(), PIXI.utils.sayHello("WebGL 2"), console.log("ʀꜱᴛʟ+"), GAMEPLAY_STYLE = new PIXI.TextStyle({
            fontFamily: "Meiryo, Arial",
            fontWeight: "bold",
            fill: 16777215,
            fontSize: 104,
            stroke: "#000000",
            strokeThickness: 12
        }), PIXI.BitmapFont.from("GAMEPLAY_MASS", GAMEPLAY_STYLE, {
            chars: [...PIXI.BitmapFont.NUMERIC, ".K"],
            resolution: 1,
            textureWidth: 1440,
            textureHeight: 1440
        }), MINIMAP_STYLE = new PIXI.TextStyle({
            fontFamily: "Meiryo, Arial",
            fontSize: 15,
            fill: 16777215,
            stroke: "#000000",
            strokeThickness: 1.25
        }), PIXI.BitmapFont.from("MINIMAP_MASS", MINIMAP_STYLE, {
            chars: [...PIXI.BitmapFont.NUMERIC, ".K"],
            resolution: 4
        })
    },
    start = () => ! function(t) {
        var e = {};

        function n(i) {
            if (e[i]) return e[i].exports;
            var o = e[i] = {
                i: i,
                l: !1,
                exports: {}
            };
            return t[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports
        }
        n.m = t, n.c = e, n.d = function(t, e, i) {
            n.o(t, e) || Object.defineProperty(t, e, {
                configurable: !1,
                enumerable: !0,
                get: i
            })
        }, n.r = function(t) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            })
        }, n.n = function(t) {
            var e = t && t.__esModule ? function() {
                return t.default
            } : function() {
                return t
            };
            return n.d(e, "a", e), e
        }, n.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, n.p = "", n(n.s = 40)
    }([function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(1),
            o = n(3),
            r = n(2),
            s = (function() {
                function t() {
                    this.procs = []
                }
                t.prototype.Add = function(t) {
                    this.procs.push(t)
                }, t.prototype.Fire = function() {
                    this.procs.forEach(function(t) {
                        return t()
                    })
                }
            }(), function() {
                function t() {
                    this.FieldSize = 14e3, this.ShowDualSkinInputUi = r.AppConfigurator.instance.showDualSkinInputUi, this.ShowPartyCodeInputUi = r.AppConfigurator.instance.showPartyCodeInputUi, this.IsolateBlankTagPlayers = !0, this.NoskinFallbackUrl = "http://ixagar.net/skins/noskin5.png", this.MaxCellsNum = 200, this.MaxPlayerUnitNum = 100, this.MaxTeamNum = 100, this.MaxClientsNum = 100, this.ShowTeamRanking = r.AppConfigurator.instance.showTeamRanking, this.ShowAlwaysAllPlayersInMap = !1, this.ShowAlwaysAllPlayersSkin = !1
                }
                return t.prototype.UpdateFieldSize = function(t) {
                    this.FieldSize != t && (this.FieldSize = t)
                }, t
            }());
        e.GameConfig = s;
        var a = function() {
            function t() {
                this.isMainPanelVisible = !0, this.isDeadSpectation = !1, this.isSkinFilterPanelVisible = !1, this.chatRoomSig = "", this.playerDeadTimeStamp = 0, this.enableTeamChatSeparationCurrent = null
            }
            return Object.defineProperty(t.prototype, "isRealtimeMode", {
                get: function() {
                    return !this.isReplayMode
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "isRealtimeModePlaying", {
                get: function() {
                    return this.isRealtimeMode && this.isPlaying
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "isSpectate", {
                get: function() {
                    return !this.isPlaying
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.setMainPanelVisible = function(t) {
                this.isMainPanelVisible = t, this.mainPanelVisibleChangedProc()
            }, t
        }();
        e.GameStates = a;
        var l = function() {
            this.clGameBackground = 4282668424, this.clGameForeground = 4294967295, this.clFieldBorder = 4294967295, this.clFieldCoords = 2298478591, this.clLeaderboardBack = 1711276083, this.clLeaderboardHeader = 4278255615, this.clMapBackground = 2281701376, this.clChatBackground = 2281701376, this.clOverlayBack = 1140850688, this.clMainPanelBack = 2281710216, this.clPanelForeground = 4278255615, this.clPanelHeader = 4278190148, this.clReplayBar = 4278225151, this.clMenuButtons = 4278225151, this.clMainButtons = 4294901896, this.clUiSymbols = 4294967295, this.clUiButtonActive = 4278190335, this.clCursorLine = 4294967295, this.clVirusOuterStroke = 4278255360, this.clVirusInnerFill = 2286175300, this.clVirusRangeHint = 2286175300, this.clChatTimeString = 4289374890, this.clChatSenderName = 4278225151, this.clChatMessage = 4294967295, this.clMarkerA = 14483643, this.clMarkerB = 16711680, this.clMarkerC = 16737792, this.clMarkerD = 16776960, this.clMarkerE = 65535, this.clMarkerF = 2003199, this.clMarkerG = 2154272, this.clMarkerH = 32e3,this.clHalfMarker = 4294901761,
            this.clMarkerRing = 4290969855,
            this.clMarkerRing2 = 4294967295
        };
        e.ColorDefs = l;
        var c, h = function() {
            function t() {
                this.colorDefs = new l, this.cssColors = {}, this.changedProcs = {}, this.Load()
            }
            return t.prototype.RegisterChangedProc = function(t, e) {
                this.changedProcs[t] || (this.changedProcs[t] = []), this.changedProcs[t].push(e)
            }, t.prototype.Load = function() {
                var t = localStorage.getItem("lwga11_color_defs");
                if (t) {
                    var e = JSON.parse(t);
                    i.Objects.CopyObjectProps(this.colorDefs, e)
                }
                for (var n in this.colorDefs) this.UpdateDerivedColorDefs(n)
            }, t.prototype.Save = function() {
                var t = JSON.stringify(this.colorDefs);
                localStorage.setItem("lwga11_color_defs", t)
            }, t.prototype.UpdateDerivedColorDefs = function(t) {
                var e = this.colorDefs[t],
                    n = o.ColorHelper.ColorToCssColorString(e);
                this.cssColors[t] = n
            }, t.prototype.GetCssColor = function(t) {
                return this.cssColors[t]
            }, t.prototype.GetColor = function(t) {
                return this.colorDefs[t]
            }, t.prototype.GetAlpha = function(t) {
                return (this.colorDefs[t] >> 24 & 255) / 255
            }, t.prototype.SetConfigColor = function(t, e) {
                this.colorDefs[t] = e, this.UpdateDerivedColorDefs(t), this.changedProcs[t] && this.changedProcs[t].forEach(function(t) {
                    return t()
                }), this.Save()
            }, t
        }();
        e.ColorConfigModel = h,
            function(t) {
                t[t.Shift = 256] = "Shift", t[t.Ctrl = 512] = "Ctrl", t[t.Alt = 1024] = "Alt"
            }(c = e.ModificationKeyCode || (e.ModificationKeyCode = {}));
        var d = function() {
            function t() {
                this.ShowHalfSplit = !1;
            this.ShowOrderRing = !1,
            this.ShowOrderRing2 = !1,this.ShowName = !0, this.ShowMass = !0, this.ShowCursorLine = !0, this.ShowSkin = !0, this.ShowPelletSkin = 0, this.ShowEnemySkin = !0, this.ShowEnemyHint = !0, this.ShowFood = !0, this.ShowSelfName = !0, this.ShowSelfSkin = !0, this.ShowReplayBar = !0, this.SimpleVirus = !0, this.VirusSplitHint = !0, this.VirusRangeHint = !1, this.ShowCoord = !0, this.GlowingBorder = !0, this.SimplifiedMass = !1, this.AutoHideText = !0, this.GlowingCells = !1, this.GlowingNonPlayerCells = !1, this.ShowLeaderboard = !0, this.ShowMap = !0, this.ShowChatBox = !0, this.ShowClientStatus = !0, this.ShowServerStatus = !1, this.ShowDetailedScore = !1, this.ShowSpecAimCursor = !0, this.AffectZoomingOnReplay = !0, this.Antialias = !0, this.HDMode = !1, this.HideMenuAfterDeath = !1, this.useSpawnSignal = !0, this.ShowSplitIndicator = !1, this.ShowSplitCount = !1, this.ShowEatLimitMarker = !1, this.ShowSplitPrediction = !1, this.ShowAutoSplitAlert = !1, this.ShowMassMarker = !1, this.OperationWithMouseButton = !1, this.SwapMouseButtons = !1, this.Debug_DisableSkinLoad = !1, this.ShowCircularName = !1, this.ShowTripKey = !1, this.MarkerThin = !1, this.MarkerLight = !0, this.MarkerExtend = !1, this.ShowCellDirectionMarker = !1, this.TogglePlayerTransparentCells = !1, this.AnotherSectionCellsAlpha = .5, this.RenderQuality = 1, this.CameraZoomSpeed = 100, this.CameraMovementSpeed = 0, this.InterpolationType = 1, this.InterpolationSpeed = .5, this.QuickCaptureTimeOption = 2, this.FrameRateOption = 4, this.MarkerAlpha = 1, this.CursorLineThickness = 5, this.PlayerCellsAlpha = 1, this.PelletCellsAlpha = .75, this.fieldBackImageUri = r.AppConfigurator.instance.defaultFieldBackImageUri, this.fieldBackImageAlpha = "0.6", this.fieldBackImageDrawingMode2 = !1, this.panelBackImageUri = r.AppConfigurator.instance.defaultPanelBackImageUri, this.panelBackImageAlpha = "0.6", this.changedProcs = {}, this.changedProcsForViewModel = {}, this.acceptNewSkins = !0, this.TextZoom = 100,this.toggleHotKeys = {
                    ShowName: 78,
                    ShowMass: -1,
                    ShowCursorLine: -1,
                    ShowSkin: -1,
                    ShowPelletSkin: -1,
                    ShowEnemySkin: -1,
                    ShowEnemyHint: -1,
                    ShowFood: -1,
                    ShowSelfName: -1,
                    ShowSelfSkin: -1,
                    ShowSplitIndicator: -1,
                    ShowSplitCount: -1,
                    ShowEatLimitMarker: -1,
                    ShowSplitPrediction: -1,
                    ShowAutoSplitAlert: -1,
                    ShowMassMarker: -1,
                    ShowCellDirectionMarker: -1,
                    TogglePlayerTransparentCells: -1,
                    GlowingCells: !1,
                    GlowingNonPlayerCells: !1,
                    ShowUI: !0,
                    ShowHalfSplit: -1,
                    ShowOrderRing: -1,
                    ShowOrderRing2: -1
                }, this.holdHotKeys = {
                    ShowName: 78,
                    ShowMass: -1,
                    ShowCursorLine: -1,
                    ShowSkin: -1,
                    ShowPelletSkin: -1,
                    ShowEnemySkin: -1,
                    ShowEnemyHint: -1,
                    ShowFood: -1,
                    ShowSelfName: -1,
                    ShowSelfSkin: -1,
                    ShowSplitIndicator: -1,
                    ShowSplitCount: -1,
                    ShowEatLimitMarker: -1,
                    ShowSplitPrediction: -1,
                    ShowAutoSplitAlert: -1,
                    ShowMassMarker: -1,
                    ShowCellDirectionMarker: -1,
                    TogglePlayerTransparentCells: -1,
                    GlowingCells: !1,
                    GlowingNonPlayerCells: !1,
                    ShowUI: -1,
                    ShowHalfSplit: -1,
                    ShowOrderRing: -1,
                    ShowOrderRing2: -1
                }, this.controlHotKeys = {
                    hkSplit: 32,
                    hkFeedOne: 87,
                    hkFeed: 69,
                    hkChangeUnit: 9,
                    hkDoubleSplit: 84,
                    hkTripleSplit: -1,
                    hkQuadSplit: 71,
                    hkSuperQuadSplit: -1,
                    hkInfernoSplit: -1,
                    hk4xLineSplit: -1,
                    hkSuspend: 83,
                    hkToggleSuspend: 83 + c.Alt,
                    hkStartNewGame: 90,
                    hkToggelSpectateTarget: 81,
                    hkQuickReplayCapture: -1,
                    hkToggleReplayRecording: -1,
                    hkPlaybackReplay: -1,
                    ShowUI: -1,
                    ShowHalfSplit: -1,
                    ShowOrderRing: -1,
                    ShowOrderRing2: -1
                }, this.RegisterChangedProc("ShowEnemyHint", () => {
                    e.gs.gconfig.ShowAlwaysAllPlayersSkin = !this.ShowEnemyHint, MAIN_RENDERER.cells.forEach(t => {
                        t.edgeColor = -1
                    })
                }), this.RegisterChangedProc("HDMode", () => {
                    MAIN_RENDERER.resolution = .5 * this.HDMode + 1, MAIN_RENDERER.resize(window.innerWidth, window.innerHeight), SUB_RENDERER.resolution = .5 * this.HDMode + 1, SUB_RENDERER.resize(window.innerWidth, window.innerHeight)
                }),
                    this.RegisterChangedProc("ShowUI", () => {
                    (this.ShowUI && this.ShowLeaderboard) ? $('.leaderboard_outer').show() : $('.leaderboard_outer').hide();
                    (this.ShowUI && this.ShowMap) ? $('#map_outer').show() : $('#map_outer').hide();
                    (this.ShowUI && this.ShowReplayBar) ? $('.replay_bar_area_outer').show() : $('.replay_bar_area_outer').hide();
                    (this.ShowUI && this.ShowChatBox) ? $('#chat_view').show() : $('#chat_view').hide();
                    (this.ShowUI && this.ShowChatBox) ? $('.skin_filter_button').show() : $('.skin_filter_button').hide();
                    (this.ShowUI && this.ShowChatBox) ? $('.ex_chat_icon_box').show() : $('.ex_chat_icon_box').hide();
                    (this.ShowUI && this.ShowChatBox) ? $('.server_client_status_area').show() : $('.server_client_status_area').hide();
                    (this.ShowUI && this.ShowChatBox) ? $('#server_user_num_text').show() : $('#server_user_num_text').hide();
                    (this.ShowUI && this.ShowChatBox) ? $('.self_state_info').show() : $('.self_state_info').hide();
                    }),
                    this.StoreDefaultConfig(), this.Load()
            }
            return t.prototype.RegisterChangedProc = function(t, e) {
                this.changedProcs[t] = e
            }, t.prototype.GetBgImageAlphaValue = function(t) {
                var e = parseFloat(this[t]);
                return isNaN(e) ? .5 : e
            }, t.prototype.SetValue = function(t, e) {
                this[t] != e && (this[t] = e, this.Store(), this.changedProcs[t] && this.changedProcs[t](t, e), this.changedProcsForViewModel[t] && this.changedProcsForViewModel[t]())
            }, t.prototype.SetControlHotKey = function(t, e) {
                this.controlHotKeys[t] != e && (this.controlHotKeys[t] = e, this.Store())
            }, t.prototype.SetToggleHotKey = function(t, e) {
                this.toggleHotKeys[t] != e && (this.toggleHotKeys[t] = e, this.Store())
            }, t.prototype.SetHoldHotKey = function(t, e) {
                this.holdHotKeys[t] != e && (this.holdHotKeys[t] = e, this.Store())
            }, t.prototype.SetAcceptNewSkins = function(t) {
                this.acceptNewSkins = t, this.Store()
            }, t.prototype.Load = function() {
                var e = localStorage.getItem(t.storage_key);
                e && o.StorageHelper.LoadObjectProps(this, e)
            }, t.prototype.Store = function() {
                var e = JSON.stringify(this);
                localStorage.setItem(t.storage_key, e)
            }, t.prototype.StoreDefaultConfig = function() {
                t.default_config_json_text = JSON.stringify(this)
            }, t.prototype.RecoverDefaultConfig = function() {
                o.StorageHelper.LoadObjectProps(this, t.default_config_json_text), this.Store(), this.resetListenerProc()
            }, t.cellDisplayOptionPropNames = ["ShowName", "ShowMass", "ShowSelfName", "ShowSelfSkin", "ShowSkin", "ShowPelletSkin", "ShowEnemySkin", "ShowEnemyHint", "ShowFood", "ShowCursorLine", "ShowMassMarker", "ShowSplitPrediction", "ShowAutoSplitAlert", "ShowSplitIndicator", "ShowEatLimitMarker", "ShowCellDirectionMarker", "TogglePlayerTransparentCells", "GlowingCells", "GlowingNonPlayerCells","ShowUI","ShowHalfSplit","ShowOrderRing","ShowOrderRing2"], t.gameDisplayOptionPropNames = ["useSpawnSignal", "SimpleVirus", "VirusSplitHint", "VirusRangeHint", "ShowCoord", "GlowingBorder", "SimplifiedMass", "AutoHideText", "ShowReplayBar", "ShowChatBox", "ShowClientStatus", "ShowServerStatus", "ShowLeaderboard", "ShowMap", "ShowSpecAimCursor", "ShowCircularName", "ShowTripKey", "MarkerThin", "MarkerLight", "MarkerExtend"], t.basicBehaviorPropNames = ["OperationWithMouseButton", "SwapMouseButtons", "AffectZoomingOnReplay", "Antialias", "HDMode", "HideMenuAfterDeath"], t.controlPropNames = ["hkSplit", "hkFeedOne", "hkFeed", "hkChangeUnit", "hkDoubleSplit", "hkTripleSplit", "hkQuadSplit", "hkSuperQuadSplit", "hkInfernoSplit", "hk4xLineSplit", "hkSuspend", "hkToggleSuspend", "hkStartNewGame", "hkToggelSpectateTarget", "hkQuickReplayCapture", "hkToggleReplayRecording", "hkPlaybackReplay"], t.storage_key = "lwga11_user_config", t
        }();
        e.UserConfig = d;
        var u = function() {
            function t() {
                this.renderQuality = 800, this.isJapanese = r.AppConfigurator.instance.isJapanese, this.interpolationType = ["Fast", "Linear", "Preceding"], this.renderQualityTextSourceJp = ["低", "中", "高"], this.renderQualityTextSourceEn = ["Low", "Mid", "High"], this.quickCaptureTimeSource = [10, 20, 30, 40, 50, 60], this.frameRateSource = [10, 15, 20, 30, 60]
            }
            return Object.defineProperty(t.prototype, "RenderQualityText", {
                get: function() {
                    const t = e.gs.uconfig.RenderQuality,
                        n = 200 << t;
                    return this.renderQuality != n && (this.renderQuality = n, GAMEPLAY_STYLE.fontSize = .13 * n >> 0, GAMEPLAY_STYLE.strokeThickness = .015 * n >> 0, PIXI.BitmapFont.from("GAMEPLAY_MASS", GAMEPLAY_STYLE, {
                        chars: [...PIXI.BitmapFont.NUMERIC],
                        resolution: 1,
                        textureWidth: 1440,
                        textureHeight: 1440
                    })), (this.isJapanese ? this.renderQualityTextSourceJp : this.renderQualityTextSourceEn)[t]
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "InterpolationTypeText", {
                get: function() {
                    var t = e.gs.uconfig.InterpolationType;
                    return this.interpolationType[t]
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "InterpolationSpeedText", {
                get: function() {
                    var t, n = -50 + 100 * e.gs.uconfig.InterpolationSpeed;
                    return parseInt(n, 10)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "QuickCaptureTimeSec", {
                get: function() {
                    var t = e.gs.uconfig.QuickCaptureTimeOption;
                    return this.quickCaptureTimeSource[t]
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "FrameRateText", {
                get: function() {
                    let t;
                    var n;
                    return [16, 25, 33, 50, 100][e.gs.uconfig.FrameRateOption]
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "TargetFrameRate", {
                get: function() {
                    var t = e.gs.uconfig.FrameRateOption;
                    return this.frameRateSource[t]
                },
                enumerable: !0,
                configurable: !0
            }), t
        }();
        e.UserConfigSupport = u;
        var p = function() {
                function t() {}
                return t.texts_jp = {
                    clGameBackground: "ゲーム背景",
                    clGameForeground: "ゲーム前景",
                    clFieldBorder: "フィールド枠",
                    clFieldCoords: "フィールド座標",
                    clLeaderboardBack: "LB背景",
                    clLeaderboardHeader: "LBヘッダ",
                    clMapBackground: "マップ背景",
                    clChatBackground: "チャット背景",
                    clOverlayBack: "オーバーレイ背景",
                    clMainPanelBack: "パネル背景",
                    clPanelForeground: "パネル前景",
                    clPanelHeader: "パネルヘッダ",
                    clReplayBar: "リプレイバー",
                    clMenuButtons: "メニューボタン",
                    clMainButtons: "メインボタン",
                    clUiSymbols: "シンボル",
                    clUiButtonActive: "ボタン(アクティブ)",
                    clCursorLine: "カーソルライン",
                    clVirusOuterStroke: "棘枠",
                    clVirusInnerFill: "棘塗り",
                    clVirusRangeHint: "棘の射程ヒント",
                    clChatSenderName: "チャット送信者名",
                    clChatTimeString: "チャット時刻",
                    clChatMessage: "チャットメッセージ",
                    clMarkerA: "質量マーカー ロケパンと食われる",
                    clMarkerB: "質量マーカー 飛ばれると食われる",
                    clMarkerC: "質量マーカー 重なると食われる",
                    clMarkerD: "質量マーカー 重なれる",
                    clMarkerE: "質量マーカー 重なると食える",
                    clMarkerF: "質量マーカー 分裂で重ねられる",
                    clMarkerG: "質量マーカー 分裂で食える",
                    clMarkerH: "質量マーカー ロケパンで食える",
                    clHalfMarker: "clHalfMarker",
                    clMarkerRing: "clMarkerRing",
                    clMarkerRing2: "clMarkerRing2",
                    OperationWithMouseButton: "マウス操作",
                    SwapMouseButtons: "左右ボタンの機能を入れ替える",
                    AffectZoomingOnReplay: "リプレイ中にズーム操作を再現",
                    Antialias: "アンチエイリアス",
                    HDMode: "1.5倍解像度",
                    HideMenuAfterDeath: "死後のメニューを隠す",
                    ShowName: "名前",
                    ShowMass: "質量",
                    ShowSelfName: "自分の名前",
                    ShowSelfSkin: "自分のスキン",
                    ShowSkin: "スキン",
                    ShowPelletSkin: "ペレットのスキン",
                    ShowEnemySkin: "敵のスキン",
                    ShowEnemyHint: "敵のヒント",
                    ShowFood: "食物",
                    ShowCursorLine: "カーソルライン",
                    ShowMassMarker: "質量マーカー",
                    ShowSplitPrediction: "分裂順序マーカー",
                    ShowAutoSplitAlert: "自然分裂アラート",
                    ShowSplitIndicator: "スプリットインジケータ",
                    ShowEatLimitMarker: "捕食判定",
                    ShowCellDirectionMarker: "移動方向マーカー",
                    TogglePlayerTransparentCells: "細胞の透過",
                    SimpleVirus: "円形棘",
                    useSpawnSignal: "スポーンシグナル",
                    VirusSplitHint: "棘の分裂ヒント",
                    VirusRangeHint: "棘の射程ヒント",
                    ShowCoord: "フィールド座標",
                    GlowingBorder: "枠の外発光",
                    SimplifiedMass: "質量表示簡略化",
                    AutoHideText: "名前/質量の自動非表示",
                    GlowingCells: "細胞外発光",
                    GlowingNonPlayerCells: "非プレイヤー細胞外発光",
                    ShowUI: "ShowUI",
                    ShowHalfSplit:"ShowHalfSplit",
                    ShowOrderRing: "ShowOrderRing(type1)",
                    ShowOrderRing2: "ShowOrderRing(type2)",
                    ShowReplayBar: "リプレイバー",
                    ShowChatBox: "チャット",
                    ShowDetailedScore: "詳細スコア",
                    ShowClientStatus: "クライアントステータス",
                    ShowServerStatus: "サーバステータス",
                    ShowLeaderboard: "スコアボード",
                    ShowMap: "マップ",
                    ShowSpecAimCursor: "観戦ターゲットのカーソルを表示",
                    ShowCircularName: "名前ラベルを円形に配置",
                    ShowTripKey: "トリップキーを表示",
                    MarkerThin: "マーカー薄くなること",
                    MarkerLight: "マーカー軽量化",
                    MarkerExtend: "マーカー拡張",
                    hkSplit: "分裂",
                    hkFeedOne: "餌単発",
                    hkFeed: "餌連射",
                    hkChangeUnit: "ユニット切り替え",
                    hkDoubleSplit: "ダブル分裂",
                    hkTripleSplit: "トリプル分裂",
                    hkQuadSplit: "全分裂",
                    hkSuperQuadSplit: "スーパー全分裂",
                    hkInfernoSplit: "インフェルノ分裂",
                    hk4xLineSplit: "直線全分裂モード",
                    hkSuspend: "その場で停止",
                    hkToggleSuspend: "その場で停止(トグル)",
                    hkStartNewGame: "ゲーム開始",
                    hkToggelSpectateTarget: "観戦モード",
                    hkQuickReplayCapture: "クイックキャプチャ",
                    hkToggleReplayRecording: "録画/停止",
                    hkPlaybackReplay: "リプレイを再生",
                    hdrConfiguration: "設定",
                    hdrCellDisplay: "セル表示",
                    hdrGameDisplay: "ゲーム表示",
                    hdrBasicOperation: "基本動作",
                    hdrControl: "操作",
                    lbtResetConfig: "設定初期化",
                    lbtOutputConfig: "OutputConfig",
                    lbtCameraZoomSpeed: "カメラズーム速度",
                    lbtCameraMovementSpeed: "カメラ移動速度",
                    lbtInterpolationType: "補間タイプ",
                    lbtInterpolationResponce: "補間応答速度",
                    lbtMarkerOpacity: "マーカーAlpha",
                    lbtCursorLineThickness: "カーソルラインの太さ",
                    lbtPlayerCellsAlpha: "細胞の透明度",
                    lbtPelletCellsAlpha: "ペレット細胞の透明度",
                    lbtAnotherSectionCellsAlpha: "別セクションの細胞透明度（カフェ）",
                    lbtRenderQuality: "画質",
                    lbtCaptureDuration: "キャプチャ時間",
                    lbtFrameRate: "フレームレート",
                    lbtTextZoom: "TextZoom",
                    hdrTheme: "テーマ",
                    hdrColor: "色",
                    hdrWallpaper: "壁紙"
                }, t.texts_en = {
                    clGameBackground: "Game Background",
                    clGameForeground: "Game Foreground",
                    clFieldBorder: "Field Outer Frame",
                    clFieldCoords: "Field Coordinate",
                    clLeaderboardBack: "LB Background",
                    clLeaderboardHeader: "LB Header",
                    clMapBackground: "Map Background",
                    clChatBackground: "Chat Background",
                    clOverlayBack: "Overlay Background",
                    clMainPanelBack: "Panel Background",
                    clPanelForeground: "Panel Foreground",
                    clReplayBar: "Replay Bar",
                    clMenuButtons: "Menu Buttons",
                    clMainButtons: "Main Buttons",
                    clUiSymbols: "UI Symbols",
                    clUiButtonActive: "Buttons(Active)",
                    clCursorLine: "Cursor Line",
                    clVirusOuterStroke: "Virus Frame",
                    clVirusInnerFill: "Virus Fill",
                    clVirusRangeHint: "Virus Range Hint",
                    clChatSenderName: "Chat Sender Name",
                    clChatTimeString: "Chat Time Stamp",
                    clChatMessage: "Chat Message",
                    clMarkerA: "Mass Marker Can Be Eaten By Double Split",
                    clMarkerB: "Mass Marker Can Be Eaten By Split",
                    clMarkerC: "Mass Marker Can Be Eaten If Overlaping",
                    clMarkerD: "Mass Marker Can't Eat If Overlaping",
                    clMarkerE: "Mass Marker Can Eat If Overlaping",
                    clMarkerF: "Mass Marker Can Overlap If Split",
                    clMarkerG: "Mass Marker Can Eat By Split",
                    clMarkerH: "Mass Marker Can Eat By Double Split",
                    clHalfMarker: "clHalfMarker",
                    clMarkerRing: "clMarkerRing",
                    clMarkerRing2: "clMarkerRing2",
                    OperationWithMouseButton: "Enable Mouse Operation",
                    SwapMouseButtons: "Swap Mouse Buttons",
                    AffectZoomingOnReplay: "Auto Zooming in Replay",
                    Antialias: "Antialias",
                    HDMode: "1.5X Resolution",
                    HideMenuAfterDeath: "Hide Menu After Death",
                    ShowName: "Name",
                    ShowMass: "Mass",
                    ShowSelfName: "Self Name",
                    ShowSelfSkin: "Self Skin",
                    ShowSkin: "Skin",
                    ShowPelletSkin: "Pellet Skin",
                    ShowEnemySkin: "Enemy Skin",
                    ShowEnemyHint: "Enemy Hint",
                    ShowFood: "Show Food",
                    ShowCursorLine: "Cursor Line",
                    ShowMassMarker: "Mass Marker",
                    ShowSplitPrediction: "Split Order Marker",
                    ShowAutoSplitAlert: "Auto Split Alert",
                    ShowSplitIndicator: "Split Indicator",
                    ShowEatLimitMarker: "Collision Marker",
                    ShowCellDirectionMarker: "Direction Marker",
                    TogglePlayerTransparentCells: "Toggle Transparent Cells",
                    SimpleVirus: "Simple Virus",
                    useSpawnSignal: "SpawnSignal",
                    VirusSplitHint: "Virus Split Hint",
                    VirusRangeHint: "Virus Range Hint",
                    ShowCoord: "Field Coord",
                    GlowingBorder: "Glowing Border",
                    SimplifiedMass: "Simplified Mass Display",
                    AutoHideText: "Auto Hide Name/Mass",
                    GlowingCells: "Glowing Cells",
                    GlowingNonPlayerCells: "Glowing Non-player Cells",
                    ShowUI: "ShowUI",
                    ShowHalfSplit:"ShowHalfSplit",
                    ShowOrderRing: "ShowOrderRing(type1)",
                    ShowOrderRing2: "ShowOrderRing(type2)",
                    ShowReplayBar: "Replay Bar",
                    ShowChatBox: "Chat",
                    ShowClientStatus: "Client Status",
                    ShowServerStatus: "Server Status",
                    ShowLeaderboard: "Scoreboard",
                    ShowMap: "Map",
                    ShowSpecAimCursor: "Show Cursor Line of Spec Target",
                    ShowCircularName: "Place Circular Name Label",
                    ShowTripKey: "ShowTripKey",
                    MarkerThin: "Marker Thin",
                    MarkerExtend: "Marker Extend",
                    MarkerLight: "Marker Light",
                    hkSplit: "Split",
                    hkFeedOne: "Single Feed",
                    hkFeed: "Continuous Feed",
                    hkChangeUnit: "Alter Operation Unit",
                    hkDoubleSplit: "Double Split",
                    hkTripleSplit: "Triple Split",
                    hkQuadSplit: "Full Split",
                    hkSuperQuadSplit: "Super Quad Split",
                    hkInfernoSplit: "Inferno Split",
                    hk4xLineSplit: "4x Line Split Mode",
                    hkSuspend: "Stop Motion",
                    hkToggleSuspend: "Stop Motion(Toggle)",
                    hkStartNewGame: "Start New Game",
                    hkToggelSpectateTarget: "Spectation Mode",
                    hkQuickReplayCapture: "Quick Capture",
                    hkToggleReplayRecording: "Start/Stop Recording",
                    hkPlaybackReplay: "Playback Replay",
                    Debug_DisableSkinLoad: "Don't Load Images(debug)",
                    UseFastInterpolation: "Fast Interpolation",
                    hdrConfiguration: "Configuration",
                    hdrCellDisplay: "Cell Display",
                    hdrGameDisplay: "Game Display",
                    hdrBasicOperation: "Basic Behavior",
                    hdrControl: "Operation",
                    lbtResetConfig: "Reset Config",
                    lbtOutputConfig: "OutputConfig",
                    lbtCameraZoomSpeed: "Camera Zoom Speed",
                    lbtCameraMovementSpeed: "Camera Movement Speed",
                    lbtInterpolationType: "Interpolation Type",
                    lbtInterpolationResponce: "Interpolation Speed",
                    lbtMarkerOpacity: "Maker Alpha",
                    lbtCursorLineThickness: "Thickness of Cursor Line",
                    lbtPlayerCellsAlpha: "Player Cells Alpha",
                    lbtPelletCellsAlpha: "Pellet Cells Alpha",
                    lbtAnotherSectionCellsAlpha: "Another Section Cells Alpha(Caffe)",
                    lbtRenderQuality: "Render Quality",
                    lbtCaptureDuration: "Capture Time",
                    lbtFrameRate: "Framerate",
                    lbtTextZoom: "TextZoom",
                    hdrTheme: "Theme",
                    hdrColor: "Color",
                    hdrWallpaper: "Wallpaper"
                }, t
            }(),
            g = function() {
                this.gconfig = new s, this.gstates = new a, this.uconfig = new d, this.ucolors = new h, this.utexts = r.AppConfigurator.instance.isJapanese ? p.texts_jp : p.texts_en, this.usupport = new u
            };
        e.GlobalObject = g, e.gs = new g
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = function() {
            function t() {}
            return t.Confirm = function(t) {}, t
        }();
        e.Utils = i;
        var o = function() {
            function t() {}
            return t.RandF = function() {
                return Math.random()
            }, t.RandFD = function() {
                return 2 * Math.random() - 1
            }, t.RandI = function(e) {
                return t.RandF() * e >> 0
            }, t.InRange = function(t, e, n) {
                return e <= t && t <= n
            }, t.Clamp = function(t, e, n) {
                return Math.max(e, Math.min(t, n))
            }, t.VMap = function(t, e, n, i, o, r) {
                void 0 === r && (r = !1);
                var s = (t - e) * (o - i) / (n - e) + i;
                if (r) {
                    var a = Math.min(i, o),
                        l = Math.max(i, o);
                    return this.Clamp(s, a, l)
                }
                return s
            }, t.MapTo = function(t, e, n) {
                return t * (n - e) + e
            }, t.Lerp = function(t, e, n) {
                return (1 - n) * t + n * e
            }, t.EasyFilter = function(t, e, n) {
                return n * t + (1 - n) * e
            }, t.HiLimit = function(t, e) {
                return Math.min(t, e)
            }, t.LoLimit = function(t, e) {
                return Math.max(t, e)
            }, t
        }();
        e.Nums = o;
        var r = function() {
            function t() {}
            return t.Remove = function(t, e) {
                var n = t.indexOf(e);
                return n >= 0 && (t.splice(n, 1), !0)
            }, t.Count = function(t, e) {
                for (var n = 0, i = 0, o = t; i < o.length; i++) e(o[i]) && n++;
                return n
            }, t.Exclude = function(t, e) {
                for (var n = [], i = 0, o = t; i < o.length; i++) {
                    var r = o[i]; - 1 == e.indexOf(r) && n.push(r)
                }
                return n
            }, t.First = function(t, e) {
                for (var n = 0, i = t; n < i.length; n++) {
                    var o = i[n];
                    if (e(o)) return o
                }
                return null
            }, t
        }();
        e.Arrays = r;
        var s = function() {
            function t() {}
            return t.CopyObjectProps = function(t, e) {
                for (var n in e) t.hasOwnProperty(n) && (t[n] = e[n])
            }, t
        }();
        e.Objects = s;
        var a = function() {
            function t() {}
            return t.FormatDate = function(t, e) {
                function n(t) {
                    return ("0" + t).slice(-2)
                }
                e || (e = new Date);
                var i = {
                        YYYY: e.getFullYear(),
                        YY: n(e.getFullYear()),
                        MM: n(e.getMonth() + 1),
                        DD: n(e.getDate()),
                        hh: n(e.getHours()),
                        mm: n(e.getMinutes()),
                        ss: n(e.getSeconds())
                    },
                    o = t;
                for (var r in i) o = o.replace(r, i[r]);
                return o
            }, t.GetCurrentTimeStamp = function() {
                return t.FormatDate("YY/MM/DD hh:mm:ss")
            }, t.GetTodayString = function() {
                return t.FormatDate("YYMMDD")
            }, t.GetHourMinutesString = function() {
                return t.FormatDate("hh:mm")
            }, t.GetSystemTimeSec = function() {
                return Date.now() / 1e3
            }, t
        }();
        e.DateTimeHelper = a;
        var l = function() {
            function t(t, e) {
                void 0 === t && (t = 0), void 0 === e && (e = 0), this.x = t, this.y = e
            }
            return Object.defineProperty(t.prototype, "Norm", {
                get: function() {
                    return Math.sqrt(this.x * this.x + this.y * this.y)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "Angle", {
                get: function() {
                    return Math.atan2(this.y, this.x)
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.Normalize = function() {
                var t = this.Norm;
                return t >= 1.1754943e-38 && (this.x = this.x / t, this.y = this.y / t), this
            }, t.prototype.Scale = function(t) {
                return this.x *= t, this.y *= t, this
            }, t.prototype.Add = function(t) {
                return this.x += t.x, this.y += t.y, this
            }, t.prototype.Set = function(t, e) {
                return this.x = t, this.y = e, this
            }, t.prototype.CopyFrom = function(t) {
                return this.x = t.x, this.y = t.y, this
            }, t.Subtract = function(e, n) {
                return new t(e.x - n.x, e.y - n.y)
            }, t.prototype.ClampXY = function(t, e, n, i) {
                return this.x = o.Clamp(this.x, t, n), this.y = o.Clamp(this.y, e, i), this
            }, t.IsEqual = function(t, e) {
                return t.x == e.x && t.y == e.y
            }, t.GetDist = function(t, e) {
                var n = e.x - t.x,
                    i = e.y - t.y;
                return Math.sqrt(n * n + i * i)
            }, t.GetAngle = function(t, e) {
                var n = t.x - e.x,
                    i = t.y - e.y;
                return Math.atan2(i, n)
            }, t.FromPolar = function(e, n) {
                return new t(Math.cos(e) * n, Math.sin(e) * n)
            }, t.prototype.AddPolar = function(t, e) {
                this.x += Math.cos(t) * e, this.y += Math.sin(t) * e
            }, t.prototype.MakeCopy = function() {
                return new t(this.x, this.y)
            }, t.DotProduct = function(t, e) {
                return t.x * e.x + t.y * e.y
            }, t.CrossProduct = function(t, e) {
                return t.x * e.y - t.y * e.x
            }, t
        }();
        e.Vector = l
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(3),
            o = function() {
                function t() {
                    this.MaxProfileNum = 32, this.useUniChat = !1, this.gameServerAddress = null, this.showDualSkinInputUi = !1, this.showPartyCodeInputUi = !0, this.defaultFieldBackImageUri = "", this.defaultPanelBackImageUri = "", this.siteTitleString = "", this.leaderboardHeaderText = "Leaderboard", this.showTeamRanking = !1, this.useIxTrackerServer = !1, this.trackerServerUri = null, this.trackerServerTargetSite = null, this.showAllServers = !1, this.insertionContent = null, this.allowOnlyForJapaneseLangUser = !1, this.Setup()
                }
                return t.prototype.SetupUnichat = function(t, e, n, i) {
                    this.useUniChat = !0, this.uniChatServerAddress = t, this.uniChatSiteSignature = e, this.uniChatServerSignature = n, this.useTeamSeparatedChat = i
                }, t.prototype.Setup = function() {
                    this.isJapanese = navigator.language.startsWith("ja");
                    var t = "ws://chat2.ixagar.net:4590",
                        e = gts;
                    "sao" == e ? (this.gameServerAddress = "ws://sv-sao.senpai-agar.online:2525", this.SetupUnichat(t, "ix", "EA-SAO1", !0), this.showPartyCodeInputUi = !0, this.siteTitleString = "SENPAI-AGAR.ONLINE", this.leaderboardHeaderText = "S.A.O.", this.showTeamRanking = !0) : "blank" == e ? (this.gameServerAddress = "ws://133.130.111.204:2527", this.SetupUnichat(t, "ix", "EA-SAO-BC", !0), this.showPartyCodeInputUi = !0, this.leaderboardHeaderText = "Leaderboard", this.showTeamRanking = !0) : "caffe" == e ? (this.gameServerAddress = "ws://sv-caffe.senpai-agar.online:2520", this.SetupUnichat(t, "_caffe", "caffe", !1), this.showTeamRanking = !0, this.leaderboardHeaderText = "Caffe") : "caffe2" == e ? (this.gameServerAddress = "ws://sv-caffe2.senpai-agar.online:2521", this.SetupUnichat(t, "_caffe2", "caffe2", !1), this.showTeamRanking = !0, this.leaderboardHeaderText = "caffe2", this.allowOnlyForJapaneseLangUser = !0) : "kouhaku" == e ? (this.gameServerAddress = "ws://sv-caffe2.senpai-agar.online:2521", this.showTeamRanking = !0, this.leaderboardHeaderText = "紅白戦", this.allowOnlyForJapaneseLangUser = !0) : "dad" == e ? (this.gameServerAddress = "ws://133.18.168.210:2521", this.SetupUnichat(t, "_dad", "dad", !0), this.showTeamRanking = !0, this.leaderboardHeaderText = "dad", this.showPartyCodeInputUi = !0) : "ix" == e ? (this.SetupUnichat(t, "ix", "default", !0), this.showPartyCodeInputUi = !0, this.defaultFieldBackImageUri = "http://ixagar.net/gr/ixagar_bg.png", this.defaultPanelBackImageUri = "http://ixagar.net/gr/ixagar_fg.png", this.siteTitleString = "IXAGAR.NET", this.leaderboardHeaderText = "IX AGAR", this.showTeamRanking = !0, this.useIxTrackerServer = !0, this.trackerServerUri = "http://hub.ixagar.net:4701", this.trackerServerTargetSite = "ixagar") : "dual" == e ? (this.showDualSkinInputUi = !0, this.useIxTrackerServer = !0, this.trackerServerUri = "http://hub1.dual-agar.online:4703", this.trackerServerTargetSite = "dual-agar", this.SetupUnichat(t, "_dual", "_dual", !0)) : "caffe_beta" == e || "dev" == e && (this.gameServerAddress = "ws://153.127.253.45:2520", this.SetupUnichat(t, "_dev", "dev", !1)), this.targetSite = e;
                    var n = i.AppHelper.GetQueryObject();
                    if (n.target) {
                        var o = n.target;
                        o.startsWith("localhost") && (this.gameServerAddress = "ws://" + o, this.useIxTrackerServer = !1)
                    }
                    n.showAll && (this.showAllServers = !0)
                }, t.instance = new t, t
            }();
        e.AppConfigurator = o
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(1),
            o = function() {
                function t() {}
                return t.GenerateRandomUserEnvSig = function(e) {
                    for (var n = "", i = t.CodeChars, o = 0; o < e; o++) n += i[Math.floor(Math.random() * i.length)];
                    return n
                }, t.GetUserEnironmentSignature = function() {
                    var e = localStorage.getItem("UniChatUserSignature");
                    return e || (e = t.GenerateRandomUserEnvSig(6), localStorage.setItem("UniChatUserSignature", e)), e
                }, t.EmbedHyperlink = function(t) {
                    return t.replace(/(http:\/\/[\x21-\x7e]+)/gi, '<a href=$1 target="_blank">$1</a>')
                }, t.GetQueryObject = function() {
                    var t = {};
                    return location.search.replace("?", "").split("&").forEach(function(e) {
                        var n = e.split("=");
                        if (2 == n.length) {
                            var i = n[0],
                                o = n[1];
                            t[i] = o
                        }
                    }), t
                }, t.CodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t
            }();
        e.AppHelper = o;
        var r = function() {
            function t() {}
            return t.LoadObjectProps = function(t, e) {
                try {
                    var n = JSON.parse(e);
                    for (var o in n)
                        if (t.hasOwnProperty(o)) {
                            var r = t[o],
                                s = n[o];
                            r instanceof Object ? i.Objects.CopyObjectProps(r, s) : t[o] = s
                        }
                } catch (t) {}
            }, t
        }();
        e.StorageHelper = r;
        var s = function() {
            function t() {}
            return t.ColorFromConfigColorString = function(t) {
                if ("#" != t[0]) return 0;
                var e = 255,
                    n = 0,
                    i = 0,
                    o = 0;
                return 8 == (t = t.slice(1, t.length)).length ? (e = parseInt(t.slice(0, 2), 16), n = parseInt(t.slice(2, 4), 16), i = parseInt(t.slice(4, 6), 16), o = parseInt(t.slice(6, 8), 16)) : 6 == t.length ? (n = parseInt(t.slice(0, 2), 16), i = parseInt(t.slice(2, 4), 16), o = parseInt(t.slice(4, 6), 16)) : 4 == t.length ? (e = 17 * parseInt(t[0], 16), n = 17 * parseInt(t[1], 16), i = 17 * parseInt(t[2], 16), o = 17 * parseInt(t[3], 16)) : 3 == t.length && (n = 17 * parseInt(t[0], 16), i = 17 * parseInt(t[1], 16), o = 17 * parseInt(t[2], 16)), isNaN(e) || isNaN(n) || isNaN(i) || isNaN(o) ? 0 : e << 24 | n << 16 | i << 8 | o
            }, t.ColorToCssColorString = function(t) {
                return "rgba(" + (t >> 16 & 255) + "," + (t >> 8 & 255) + "," + (255 & t) + "," + (t >> 24 & 255) / 255 + ")"
            }, t.GetAlpha = function(t) {
                return (t >> 24 & 255) / 255
            }, t.FormatColorByte = function(t) {
                var e = t.toString(16).toUpperCase();
                return 1 == e.length && (e = "0" + e), e
            }, t.ColorToHtmlString = function(t) {
                var e = t >> 16 & 255,
                    n = t >> 8 & 255,
                    i = 255 & t;
                return "#" + this.FormatColorByte(e) + this.FormatColorByte(n) + this.FormatColorByte(i)
            }, t.ColorFromHtmlString = function(t) {
                if (7 != t.length || "#" != t[0]) return 8947848;
                var e = parseInt(t.slice(1, 3), 16),
                    n = parseInt(t.slice(3, 5), 16),
                    i = parseInt(t.slice(5, 7), 16);
                return isNaN(e) || isNaN(n) || isNaN(i) ? 8947848 : e << 16 | n << 8 | i
            }, t.ColorFromHtmlStringInput = function(t, e) {
                if (7 != t.length || "#" != t[0]) return -1;
                var n = parseInt(t.slice(1, 3), 16),
                    i = parseInt(t.slice(3, 5), 16),
                    o = parseInt(t.slice(5, 7), 16);
                return isNaN(n) || isNaN(i) || isNaN(o) ? -1 : e << 24 || n << 16 | i << 8 | o
            }, t.GetHSV = function(t) {
                var e = (t >> 16 & 255) / 255,
                    n = (t >> 8 & 255) / 255,
                    i = (255 & t) / 255,
                    o = Math.max(e, n, i),
                    r = Math.min(e, n, i),
                    s = 0;
                if (o != r) {
                    var a = o - r;
                    (s = (e == o ? (n - i) / a : n == o ? 2 + (i - e) / a : 4 + (e - n) / a) / 6) < 0 && (s += 1)
                }
                return [s, (o - r) / o, o]
            }, t.ColorFromHSVA = function(t, e, n, i) {
                var o = (1 - e) * n,
                    r = n - o,
                    s = 6 * t,
                    a = 0,
                    l = 0,
                    c = 0;
                return s < 1 ? (a = n, l = s * r + o, c = o) : s < 2 ? (a = (2 - s) * r + o, l = n, c = o) : s < 3 ? (a = o, l = n, c = (s - 2) * r + o) : s < 4 ? (a = o, l = (4 - s) * r + o, c = n) : s < 5 ? (a = (s - 4) * r + o, l = o, c = n) : (a = n, l = o, c = (6 - s) * r + o), 255 * i >> 0 << 24 | 255 * a >> 0 << 16 | 255 * l >> 0 << 8 | 255 * c >> 0
            }, t.ReplaceAlpha = function(t) {
                var e = this.GetHSV(t);
                return this.ColorFromHSVA(e[0], e[1], e[2], 0)
            }, t
        }();
        e.ColorHelper = s;
        var a = function() {
            function t() {}
            return t.RadiusToMass = function(t) {
                return t * t / 100
            }, t.MassToRadius = function(t) {
                return Math.sqrt(100 * t)
            }, t.GenarateRandomColor = function() {
                var t = [255, i.Nums.RandI(100), i.Nums.RandI(256)].sort(function() {
                    return i.Nums.RandFD()
                });
                return t[0] << 16 | t[1] << 8 | t[2]
            }, t.CheckIsInEatableSection = function(t, e) {
                return t == e || "**" == t || "**" == e
            }, t.DecodePlayerId = function(t) {
                return [65534 & t, 1 & t]
            }, t.GetDist = function(t, e, n, i) {
                var o = n - t,
                    r = i - e;
                return Math.sqrt(o * o + r * r)
            }, t.VectorDotProduct = function(t, e, n, i) {
                return t * n + e * i
            }, t.VectorCrossProduct = function(t, e, n, i) {
                return t * i - e * n
            }, t.GetLinePointDist = function(t, e, n, o, r, s) {
                var a = new i.Vector(n - t, o - e),
                    l = new i.Vector(r - t, s - e);
                if (i.Vector.DotProduct(a, l) < 0) return l.Norm;
                var c = new i.Vector(t - n, e - o),
                    h = new i.Vector(r - n, s - o);
                return i.Vector.DotProduct(c, h) < 0 ? h.Norm : Math.abs(i.Vector.CrossProduct(a, l)) / a.Norm
            }, t.HitTestAABB = function(t, e, n, i, o) {
                var r = n - t,
                    s = i - i;
                return -o <= r && r <= o && -o <= s && s <= o
            }, t.TrimNameAndTeamName = function(t, e) {
                if (t.length > 15) t = t.substring(0, 15), e = "";
                else {
                    var n = 15 - t.length;
                    e.length > n && (e = e.substring(0, n))
                }
                return [t, e]
            }, t
        }();
        e.GameHelper = a;
        var l = function() {
            function t() {}
            return t.Start = function(e) {
                t.sig = e, t.t0 = performance.now()
            }, t.Stop = function() {
                if (performance.now() - t.t0 > 50) {
                    var e = t.sig;
                    console.log("long execution : " + e)
                }
            }, t
        }();
        e.TimeChecker = l;
        var c = function() {
            function t(t, e) {
                this.capacity = t, this.pool = Array(t);
                for (var n = 0; n < t; n++) this.pool[n] = e();
                this.genProc = e
            }
            return t.prototype.Gain = function() {
                return this.pool.length <= 0 ? this.genProc() : this.pool.pop();
                var t
            }, t.prototype.Release = function(t) {
                this.pool.length <= 1.125 * this.capacity && this.pool.push(t)
            }, t
        }();
        e.ObjectPool = c;
        var h = function() {
            function t() {
                this.activeKeepTimeSec = 180, this.deactivedTick = 0, this.t0 = 0
            }
            return Object.defineProperty(t.prototype, "IsHidden", {
                get: function() {
                    return document.hidden
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.Update = function() {
                var t = performance.now(),
                    e = t - this.t0;
                this.t0 = t, document.hasFocus() ? this.deactivedTick = 0 : this.deactivedTick += .001 * e
            }, Object.defineProperty(t.prototype, "IsActive", {
                get: function() {
                    return this.deactivedTick < this.activeKeepTimeSec
                },
                enumerable: !0,
                configurable: !0
            }), t.Instance = new t, t
        }();
        e.PageHelper = h
    }, function(t, e, n) {
        "use strict";
        var i;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = n(1),
            r = n(38),
            s = n(37),
            a = n(13),
            l = n(36),
            c = n(35),
            h = n(34),
            d = n(0),
            u = n(2),
            p = n(33),
            g = n(3),
            f = n(13),
            m = n(31),
            y = n(30),
            v = n(29),
            S = function() {
                this.avgDuration = 0, this.avgRate = 0, this.avgFps = 0, this.numCellsRendered = 0, this.replayBufferBytes = 0, this.debugObj = {}
            };
        e.GamePerformanceStateModel = S;
        var b = function() {
            function t() {
                var t = this;
                this.tick = 0, this.seqUseInfoStrSent = null, this.perfModel = new S, this.serverUriCash = null, this.userEntryMan = new c.UserEntryManager, this.userEntryMan.Load(), this.uMan = new r.UserInfoManager, this.dataRecorder = new s.DataRecorder, this.nodeMan = new a.NodeManager(this), this.conn = new l.ConnectionBridge, this.sight = new h.SightCoord(this), this.benchDataFeeder = new m.PerfBenchDataFeeder(this), this.conn.packetHandlerProc = this.dataRecorder.PostPacketFromServer.bind(this.dataRecorder), this.conn.connectionOpenProc = function() {
                    t.conn.SendSessionInitialize(g.AppHelper.GetUserEnironmentSignature()), t.SendSelfEntryInfoIfChanged(), t.conn.SendRequestStartSpectate()
                }, this.conn.connectionClosedProc = function(e) {
                    console.log("connection closed " + e), (e = e.indexOf("serverMaxConnections (") >= 0 ? "Server is full house. Please access after a while.</br>満員です。しばらく時間をおいてからアクセスしてください。" : "") && t.gameHudModel.PostServerInstructionText(e)
                };
                var e = u.AppConfigurator.instance;
                e.useUniChat && (this.chatAppModel = new p.ChatAppModel, this.chatAppModel.SetUserEnvSig(g.AppHelper.GetUserEnironmentSignature()), this.chatAppModel.SetChatServerUri(e.uniChatServerAddress), this.chatAppModel.SetGameTeamChatSessionEnabled(e.useTeamSeparatedChat), this.chatAppModel.SetSiteSignature(e.uniChatSiteSignature), this.chatAppModel.SetServerSignature(e.uniChatServerSignature, !1), this.chatAppModel.gameChatMessageReceiverProc = this.nodeMan.PostExternalChatMessage.bind(this.nodeMan), window.chatAppModel = this.chatAppModel), e.useIxTrackerServer && (this.serverListModel = new y.ServerListModel(this)), this.gameHudModel = new v.GameHudModel
            }
            return t.prototype.ShowDebugValue = function(t, e) {
                this.perfModel.debugObj[t] = e
            }, Object.defineProperty(t.prototype, "ReplayControllerModel", {
                get: function() {
                    return this.dataRecorder
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.SendSplitAction = function(t) {
                d.gs.gstates.isSpectate || (this.gameHudModel.specTargetName = null, this.sight.splitting = !0, this.conn.SendPlayerAction(0, t))
            }, t.prototype.StartPlay = function() {
                d.gs.gstates.isBenchmarkMode || (d.gs.gstates.isPlaying || (this.SendSelfEntryInfoIfChanged(), this.conn.SendSpecifySpecTarget(-1), this.conn.SendRequestStartPlay(), d.gs.gstates.isPlaying = !0, d.gs.gstates.isDeadSpectation = !1, this.gameHudModel.ResetMaxScore()), this.userEntryMan.SaveIfChanged(), d.gs.gstates.setMainPanelVisible(!1))
            }, t.prototype.StartSpectate = function() {
                d.gs.gstates.isBenchmarkMode || (d.gs.gstates.isPlaying ? d.gs.gstates.setMainPanelVisible(!1) : (this.SendSelfEntryInfoIfChanged(), this.userEntryMan.SaveIfChanged(), d.gs.gstates.isDeadSpectation = !1, d.gs.gstates.setMainPanelVisible(!1)))
            }, t.prototype.ToggleBenchMarkMode = function() {
                d.gs.gstates.isBenchmarkMode ? (d.gs.gstates.isBenchmarkMode = !1, this.benchDataFeeder.Stop(), d.gs.gstates.setMainPanelVisible(!0), this.ConnectToGameServer()) : (d.gs.gstates.isBenchmarkMode = !0, this.CloseConnection(), this.nodeMan.OnEnterBenchMarkMode(), d.gs.gconfig.FieldSize, this.benchDataFeeder.Start(), d.gs.gstates.setMainPanelVisible(!1))
            }, t.prototype.KeyboardInputHandler = function(t, e) {
                if ("INPUT" == document.activeElement.tagName) return !1;
                if (e && 27 == t.keyCode && d.gs.gstates.setMainPanelVisible(!d.gs.gstates.isMainPanelVisible), !e && 9 == t.KeyCode) return !0;
                if (this.sight.initDone && !d.gs.gstates.isBenchmarkMode) {
                    var n = t.keyCode;
                    t.ctrlKey && (n += d.ModificationKeyCode.Ctrl), t.shiftKey && (n += d.ModificationKeyCode.Shift), t.altKey && (n += d.ModificationKeyCode.Alt);
                    var o = d.gs.uconfig.controlHotKeys;
                    const c = () => {
                        const t = this.sight,
                            e = (t.mouseX - t.scw / 2) / t.eyeScale + t.eyeX,
                            n = (t.mouseY - t.sch / 2) / t.eyeScale + t.eyeY;
                        this.conn.SendAimCursor(e, n), t.aimXSent = e, t.aimYSent = n
                    };
                    if (d.gs.gstates.isRealtimeMode) {
                        if (n == o.hkSuspend) return stopMouse = 0, this.conn.SendPlayerAction(5, e ? 0 : 1), !0;
                        if (n == o.hk4xLineSplit) {
                            if (!e) return;
                            let t = this.nodeMan.operationUnitIndex;
                            const n = this.nodeMan.selfNodeIds[t];
                            if (1 != n.length) return void(stopMouse = 0);
                            const o = this.sight,
                                r = n[0],
                                s = this.nodeMan.nodes.get(r),
                                a = s.nx,
                                l = s.ny;
                            return a == o.aimXSent && l == o.aimYSent || (this.conn.SendAimCursor(a, l), o.aimXSent = a >> 0, o.aimYSent = l >> 0), (stopMouse = !stopMouse) ? i = setInterval(() => {
                                1 == n.length ? s.nx == o.aimXSent && s.ny == o.aimYSent && (setTimeout(() => {
                                    1 == n.length && (this.gameHudModel.specTargetName = "4x Line Split is available", this.gameHudModel.SetSpecTargetScore(0))
                                }, 1e3), clearInterval(i)) : clearInterval(i)
                            }, 35) : (this.gameHudModel.specTargetName = null, clearInterval(i)), !0
                        }
                        if (e && n == o.hkToggleSuspend && (this.isSuspend = !this.isSuspend, this.conn.SendPlayerAction(5, this.isSuspend ? 0 : 1)), d.gs.gstates.isPlaying && n == o.hkFeed) return stopMouse && (stopMouse = 0), this.conn.SendPlayerAction(4, e ? 1 : 0), !0;
                        if (n == o.hkDoubleSplit) return stopMouse = 0, c(), stopMouse = e ? 1 : 0, e && this.SendSplitAction(2), setTimeout(() => stopMouse = 0, 600), !0;
                        if (n == o.hkTripleSplit) {
                            c();
                            const t = stopMouse;
                            return stopMouse = e ? 1 : 0, this.conn.SendPlayerAction(5, e ? 0 : 1), e && !t && this.SendSplitAction(3), !0
                        }
                        if (n == o.hkSuperQuadSplit) {
                            c();
                            const t = stopMouse;
                            return stopMouse = e ? 1 : 0, this.conn.SendPlayerAction(5, e ? 0 : 1), e && !t && this.SendSplitAction(4), !0
                        }
                    }
                    var r = !1,
                        s = d.gs.uconfig;
                    for (var a in s.holdHotKeys)
                        if (n == s.holdHotKeys[a]) {
                            var l = s[a];
                            s.SetValue(a, !l), r = !0
                        } if (e) {
                        if (n == o.hkStartNewGame) {
                            if (d.gs.gstates.isBenchmarkMode) return !1;
                            if (!d.gs.gstates.isPlaying) return this.StartPlay(), !0
                        }
                        if (n == o.hkChangeUnit){
                                if(!d.gs.gstates.isPlaying){
                                    this.StartPlay();
                                }
                                else{
                                    i && clearInterval(i),
                                    this.conn.SendPlayerAction(3, -1),
                                    c(),
                                    stopMouse = 0;
                                }
                                return  !0;
                        }
                        if (n == o.hkToggelSpectateTarget) return -1 == this.sight.aimPlayerId ? this.conn.SendSpecifySpecTarget(0) : this.conn.SendSpecifySpecTarget(-1), !0;
                        if (n == o.hkQuickReplayCapture) return this.dataRecorder.DoInstantCapture(), !0;
                        if (n == o.hkToggleReplayRecording) return this.dataRecorder.ToggleRecording(), !0;
                        if (n == o.hkPlaybackReplay) return this.dataRecorder.isReplayMode ? this.dataRecorder.EndReplayMode() : this.dataRecorder.TogglePlayback(), !0;
                        if (d.gs.gstates.isRealtimeModePlaying) {
                            if (n == o.hkSplit) return stopMouse = 0, c(), this.SendSplitAction(1), !0;
                            if (n == o.hkFeedOne) return this.conn.SendPlayerAction(1, -1), stopMouse = 0, !0;
                            if (n == o.hkQuadSplit) return this.SendSplitAction(4), !0;
                            if (n == o.hkInfernoSplit) return this.SendSplitAction(2), this.conn.SendPlayerAction(3, -1), c(), stopMouse = 0, this.SendSplitAction(4), !0
                        }
                        for (var a in s.toggleHotKeys) n == s.toggleHotKeys[a] && (l = s[a], s.SetValue(a, !l), r = !0)
                    }
                    return !!r && (this.gameHudModel.configUpdatedProc(), !0)
                }
            }, t.prototype.MouseInputHandler = function(t, e) {
                if (!d.gs.gstates.isBenchmarkMode) {
                    var n = d.gs.uconfig,
                        i = 0,
                        o = 2;
                    if (e) {
                        if (d.gs.gstates.isRealtimeMode && d.gs.gstates.isSpectate) {
                            if (t == o) {
                                var r = this.sight.ScreenToWorld(this.sight.mouseX, this.sight.mouseY),
                                    s = r[0],
                                    a = r[1],
                                    l = this.nodeMan.GetPlayerIdUnderCursor(s, a);
                                this.conn.SendSpecifySpecTarget(l)
                            }
                            t == i && (this.conn.SendSpecifySpecTarget(-1), this.isSuspend && (this.isSuspend = !1, this.conn.SendPlayerAction(5, this.isSuspend ? 0 : 1)))
                        }
                        t == i && d.gs.gstates.isBenchmarkMode, d.gs.gstates.isReplayMode && (t == i && this.dataRecorder.TogglePlayback(), t == o && (this.dataRecorder.EndReplayMode(), this.dataRecorder.Notify()))
                    }
                    n.OperationWithMouseButton && (n.SwapMouseButtons && (i = 2, o = 0), d.gs.gstates.isRealtimeModePlaying && (t == i && e ? this.SendSplitAction(1) : t == o ? this.conn.SendPlayerAction(4, e ? 1 : 0) : 1 == t && e && this.SendSplitAction(4)))
                }
            }, t.prototype.SelfUnitsDeadProc = function() {
                var t = this;
                stopMouse = 0, this.gameHudModel.specTargetName = null, d.gs.gstates.isPlaying && !this.dataRecorder.isLoading && (d.gs.gstates.isPlaying = !1, d.gs.gstates.isDeadSpectation = !0, this.sight.OnPlayerDead(), this.gameHudModel.ResetMaxScore(), d.gs.gstates.playerDeadCallbackProc(), d.gs.gstates.playerDeadTimeStamp = Date.now(), t.conn.SendRequestStartSpectate())
            }, t.prototype.SendSelfEntryInfoIfChanged = function() {
                var t = this.userEntryMan.curInfo,
                    e = t.MakeSequenceString(),
                    n = g.AppHelper.GetUserEnironmentSignature(),
                    i = t.usig != n;
                if (i && (n = t.usig ? t.usig : n, t.usig = n, localStorage.setItem("UniChatUserSignature", t.usig), this.chatAppModel.SetUserEnvSig(n), this.userEntryMan.infos.forEach(t => t.usig = n)), i || this.seqUseInfoStrSent != e) {
                    var r = t.code;
                    d.gs.gconfig.IsolateBlankTagPlayers && "" == t.team && (r = n);
                    var s = g.GameHelper.TrimNameAndTeamName(t.team, t.name),
                        a = s[0],
                        l = s[1];
                    o.Utils.Confirm(a.length + l.length <= 15), this.conn.SendUserEntryInfo(l, a, r, t.skinUrl + "?RL", t.skinUrl2), this.chatAppModel && this.chatAppModel.SetUserEntryInfo(l, a, r, t.skinUrl, t.profileIndex), this.seqUseInfoStrSent = e
                }
            }, t.prototype.SendChatMessage = function(t) {
                if (this.chatAppModel) this.chatAppModel.SendMessageOnGameChatSession(t);
                else {
                    var e = this.uMan.selfUserId;
                    this.conn.SendChatMessage(t, e)
                }
            }, t.prototype.StatesUpdationProc = function() {
                setTimeout(this.StatesUpdationProc.bind(this), 1e3), g.TimeChecker.Start("StatusUpdationProc"), this.nodeMan.RecordLatencyCheckStartTime(), this.conn.SendLatencyCheckRequest(), this.nodeMan.UpdateSelfScore(), this.perfModel.replayBufferBytes = this.dataRecorder.totalBytes, this.dataRecorder.DiscardUnnecessaryPackets(), this.perfModel.debugObj, f.TNodeData.Pool.capacity, f.TNodeData.Pool.pool.length, g.TimeChecker.Stop()
            }, t.prototype.Initialize = function() {
                var t = this;
                this.dataRecorder.Initialize(this.nodeMan);
                var e = document.querySelector("#game_control_overlay");
                window.addEventListener("keydown", function(e) {
                    e.repeat || t.KeyboardInputHandler(e, !0) && e.preventDefault()
                }), window.addEventListener("keyup", function(e) {
                    t.KeyboardInputHandler(e, !1) && e.preventDefault()
                }), window.onmousedown = function(e) {
                    d.gs.gstates.isMainPanelVisible || t.MouseInputHandler(e.button, !0)
                }, window.onmouseup = function(e) {
                    d.gs.gstates.isMainPanelVisible || t.MouseInputHandler(e.button, !1)
                }, window.oncontextmenu = function(t) {
                    return t.preventDefault(), !1
                }, window.onmousemove = function(e) {
                    t.sight.mouseX = e.clientX, t.sight.mouseY = e.clientY
                };
                var n = function(e) {
                    var n = e.wheelDelta / 120 * d.gs.uconfig.CameraZoomSpeed / 100;
                    d.gs.gstates.isBenchmarkMode || t.sight.ShiftScale(n)
                };
                navigator.userAgent.indexOf("Firefox") >= 0 ? e.addEventListener("DOMMouseScroll", n, !1) : e.onmousewheel = n, this.nodeMan.selfUnitsDeadCallback = this.SelfUnitsDeadProc.bind(this), this.StatesUpdationProc()
            }, t.prototype.Reset = function() {
                this.seqUseInfoStrSent = null, this.isSuspend = !1
            }, t.prototype.ConnectToGameServer = function(t) {
                void 0 === t && (t = null), t || (t = this.serverUriCash || u.AppConfigurator.instance.gameServerAddress);
                var e = t.split("//")[1].split(":"),
                    n = e[0],
                    i = parseInt(e[1]);
                window.GameServerHost = n, window.GameServerPort = i, this.sight.initDone = !1, this.isSuspend = !1, this.gameHudModel.ClearChatMessages(), this.nodeMan.ResetToInitialiState(), this.dataRecorder.Reset(), this.uMan.Reset(), this.Reset(), this.conn.ConnectToGameServer(t), this.serverUriCash = t
            }, t.prototype.ConnectToGameServerEx = function(t, e) {
                d.gs.gstates.chatRoomSig = e, this.ConnectToGameServer(t)
            }, t.prototype.CloseConnection = function() {
                this.sight.initDone = !1, this.conn.CloseConnection()
            }, t
        }();
        e.GameCore = b, console.log("gamecore 240322"), e.gameCore = new b
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = function() {
            function t() {
                riot.observable(this)
            }
            return t.prototype.on = function(t, e) {}, t.prototype.one = function(t, e) {}, t.prototype.off = function(t) {}, t.prototype.trigger = function(t) {
                for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n]
            }, t
        }();
        e.Observable = i;
        var o = function() {
            function t() {}
            return t.prototype.update = function(t) {}, t.prototype.unmount = function(t) {}, t.prototype.on = function(t, e) {}, t.prototype.one = function(t, e) {}, t.prototype.off = function(t) {}, t.prototype.trigger = function(t) {
                for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n]
            }, t.prototype.mixin = function(t, e) {}, t.createElement = function(t) {
                var e = this.prototype.tagName,
                    n = document.createElement(e);
                return riot.mount(n, e, t), n
            }, t
        }();

        function r(t) {
            var n;
            if (void 0 === t.prototype.template) throw "template property not specified";
            var i, o = t.prototype.template;
            o.indexOf("<") < 0 ? void 0 !== e.precompiledTags[o] ? n = e.precompiledTags[o] : (o = function(t) {
                var e = new XMLHttpRequest;
                if (e.open("GET", t, !1), e.send(), 200 == e.status) return e.responseText;
                throw e.responseText
            }(o), n = riot.compile(o, !0, {
                entities: !0
            })[0]) : n = riot.compile(o, !0, {
                entities: !0
            })[0], t.prototype.tagName = (i = n, riot.tag2(i.tagName, i.html, i.css, i.attribs, function(e) {
                ! function(t, e) {
                    var n = Object.keys(e.prototype).reduce(function(t, n) {
                        return t[n] = Object.getOwnPropertyDescriptor(e.prototype, n), t
                    }, {});
                    Object.defineProperties(t, n)
                }(this, t), t.call(this, e), void 0 !== t.prototype.mounted && this.on("mount", this.mounted), void 0 !== t.prototype.unmounted && this.on("unmount", this.unmounted), void 0 !== t.prototype.updating && this.on("update", this.updating), void 0 !== t.prototype.updated && this.on("updated", this.updated)
            }, riot.settings.brackets), i.tagName)
        }
        e.Element = o, e.precompiledTags = {}, e.registerClass = r, e.template = function(t) {
            return function(e) {
                e.prototype.template = t, r(e)
            }
        }
    }, function(t, e) {
        t.exports = PIXI
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(8),
            o = function() {
                function t() {}
                return t.SessionInitialize = function(t) {
                    var e = new i.DataFrameWriter;
                    return e.WriteUint8(252), e.WriteStringEx("lwga-110"), e.WriteStringEx(t), e.ArrayBuffer
                }, t.AimCursor = function(t, e) {
                    var n = new i.DataFrameWriter;
                    return n.WriteUint8(16), n.WriteInt32(t >> 0), n.WriteInt32(e >> 0), n.ArrayBuffer
                }, t.UserEntryInfo = function(t, e, n, o, r) {
                    var s = new i.DataFrameWriter;
                    return s.WriteUint8(30), s.WriteStringEx(t), s.WriteStringEx(e), s.WriteStringEx(o), s.WriteStringEx(n), s.WriteStringEx(r), s.ArrayBuffer
                }, t.RequestStartPlay = function() {
                    var t = new i.DataFrameWriter;
                    return t.WriteUint8(31), t.ArrayBuffer
                }, t.RequestStartSpectate = function() {
                    var t = new i.DataFrameWriter;
                    return t.WriteUint8(1), t.ArrayBuffer
                }, t.PlayerAction = function(t, e) {
                    var n = new i.DataFrameWriter;
                    return n.WriteUint8(25), n.WriteUint8(t), n.WriteUint8(e), n.ArrayBuffer
                }, t.ChatMessage = function(t, e) {
                    var n = new i.DataFrameWriter;
                    return n.WriteUint8(128), n.WriteUint16(e), n.WriteStringEx(""), n.WriteStringEx(t), n.ArrayBuffer
                }, t.LatencyCheckRequest = function() {
                    var t = new i.DataFrameWriter;
                    return t.WriteUint8(130), t.ArrayBuffer
                }, t.SpecifySpecTarget = function(t) {
                    var e = new i.DataFrameWriter;
                    return e.WriteUint8(27), e.WriteInt32(t), e.ArrayBuffer
                }, t
            }();
        e.Packets = o;
        var r = function() {
            function t() {}
            return t.NodeRemoval = function(t) {
                var e = new i.DataFrameWriter;
                return e.WriteUint8(161), e.WriteUint32(t), e.ArrayBuffer
            }, t.UserEntryInfo = function(t, e, n, o, r, s) {
                var a = new i.DataFrameWriter;
                return a.WriteUint8(162), a.WriteUint16(t), a.WriteStringEx(e), a.WriteStringEx(n), a.WriteUint16(o), a.WriteStringEx(r), a.WriteStringEx(s), a.ArrayBuffer
            }, t.PlayerColor = function(t, e) {
                var n = new i.DataFrameWriter;
                return n.WriteUint8(163), n.WriteUint16(t), n.WriteUint32(e), n.ArrayBuffer
            }, t.TeamColor = function(t, e) {
                var n = new i.DataFrameWriter;
                return n.WriteUint8(164), n.WriteUint16(t), n.WriteUint32(e), n.ArrayBuffer
            }, t.MoveSightToward = function(t, e, n) {
                var o = new i.DataFrameWriter;
                return o.WriteUint8(165), o.WriteInt32(t >> 0), o.WriteInt32(e >> 0), o.WriteFloat32(n), o.ArrayBuffer
            }, t.SightState = function(t, e, n, o, r, s, a) {
                var l = new i.DataFrameWriter;
                return l.WriteUint8(166), l.WriteInt32(t >> 0), l.WriteInt32(e >> 0), l.WriteFloat32(n), l.WriteInt32(o >> 0), l.WriteInt32(r >> 0), l.WriteUint8(s ? 1 : 0), l.WriteUint16(a), l.ArrayBuffer
            }, t
        }();
        e.InternalPackets = r
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = function() {
            function t(t) {
                this.bytes = new Uint8Array(t), this.pos = 0
            }
            return Object.defineProperty(t.prototype, "Length", {
                get: function() {
                    return this.bytes.length
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.ReadUint8 = function() {
                return this.bytes[this.pos++]
            }, t.prototype.ReadUint16 = function() {
                return this.ReadUint8() | this.ReadUint8() << 8
            }, t.prototype.ReadUint32 = function() {
                var t = this.ReadUint8(),
                    e = this.ReadUint8(),
                    n = this.ReadUint8();
                return this.ReadUint8() << 24 | n << 16 | e << 8 | t
            }, t.prototype.ReadInt16 = function() {
                var t = this.ReadUint16();
                return t >= 32768 && (t -= 65536), t
            }, t.prototype.ReadInt32 = function() {
                var t = this.ReadUint32();
                return t >= 2147483648 && (t -= 4294967295), t
            }, t.prototype.ReadFloat32 = function() {
                var t = this.ReadUint32(),
                    e = new ArrayBuffer(4);
                return new Uint32Array(e)[0] = t, new Float32Array(e)[0]
            }, t.prototype.ReadStringEx = function() {
                for (var t = this.ReadUint16(), e = "", n = 0; n < t; n++) e += String.fromCharCode(this.ReadUint16());
                return e
            }, t
        }();
        e.DataFrameReader = i;
        var o = function() {
            function t() {
                this.bytes = []
            }
            return Object.defineProperty(t.prototype, "Buffer", {
                get: function() {
                    return this.bytes
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "ArrayBuffer", {
                get: function() {
                    return new Uint8Array(this.bytes).buffer
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.WriteUint8 = function(t) {
                this.bytes.push(t)
            }, t.prototype.WriteUint16 = function(t) {
                this.bytes.push(255 & t), this.bytes.push(t >> 8 & 255)
            }, t.prototype.WriteInt16 = function(t) {
                t < 0 && (t += 65536), this.WriteUint16(t)
            }, t.prototype.WriteUint32 = function(t) {
                this.bytes.push(255 & t), this.bytes.push(t >> 8 & 255), this.bytes.push(t >> 16 & 255), this.bytes.push(t >> 24 & 255)
            }, t.prototype.WriteUint64 = function(t) {
                this.bytes.push(255 & t), this.bytes.push(t >> 8 & 255), this.bytes.push(t >> 16 & 255), this.bytes.push(t >> 24 & 255), this.bytes.push(t >> 32 & 255), this.bytes.push(t >> 40 & 255), this.bytes.push(t >> 48 & 255), this.bytes.push(t >> 56 & 255)
            }, t.prototype.WriteInt32 = function(t) {
                t < 0 && (t += 4294967295), this.WriteUint32(t)
            }, t.prototype.WriteFloat32 = function(t) {
                var e = new ArrayBuffer(4);
                new Float32Array(e)[0] = t;
                var n = new Uint32Array(e)[0];
                this.WriteUint32(n)
            }, t.prototype.WriteStringEx = function(t) {
                this.WriteUint16(t.length);
                for (var e = 0; e < t.length; e++) this.WriteUint16(t.charCodeAt(e))
            }, t
        }();
        e.DataFrameWriter = o
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(0),
            o = n(3),
            r = n(1),
            s = function() {
                function t(t, e, n) {
                    this.key = t, this.text = e, this.SetColor(n)
                }
                return t.prototype.SetColor = function(t, e) {
                    void 0 === e && (e = !1), this.color = t, this.htmlColor = o.ColorHelper.ColorToHtmlString(t), this.cssColor = o.ColorHelper.ColorToCssColorString(t), e && i.gs.ucolors.SetConfigColor(this.key, t)
                }, t
            }();
        e.ColorConfigEntry = s;
        var a = function() {
            function t() {
                this.SetColor(16711680)
            }
            return t.prototype.SetColor = function(t) {
                var e;
                this.color = t, this.htmlColor = o.ColorHelper.ColorToHtmlString(t), e = o.ColorHelper.GetHSV(t), this.hue = e[0], this.sat = e[1], this.bri = e[2], this.alpha = o.ColorHelper.GetAlpha(t)
            }, t.prototype.SetHue = function(t) {
                var e = o.ColorHelper.ColorFromHSVA(t, this.sat, this.bri, this.alpha);
                this.SetColor(e), this.hue = t
            }, t.prototype.SetAlpha = function(t) {
                var e = this.hue,
                    n = o.ColorHelper.ColorFromHSVA(this.hue, this.sat, this.bri, t);
                this.SetColor(n), this.hue = e
            }, t.prototype.SetSV = function(t, e) {
                var n = this.hue,
                    i = o.ColorHelper.ColorFromHSVA(this.hue, t, e, this.alpha);
                this.SetColor(i), this.hue = n, this.sat = t
            }, t.prototype.SetByHtmlColor = function(t) {
                var e = o.ColorHelper.ColorFromHtmlStringInput(t, this.alpha); - 1 != e && this.SetColor(e)
            }, t
        }();
        e.ColorEditModel = a;
        var l = function() {
                function t() {}
                return t.HotKeyToText = function(e) {
                    if (e <= 0) return "";
                    var n = 255 & e,
                        o = e - n,
                        r = "";
                    o > 0 && (o & i.ModificationKeyCode.Shift && (r = "sft+"), o & i.ModificationKeyCode.Ctrl && (r = "ctl+"), o & i.ModificationKeyCode.Alt && (r = "alt+"));
                    var s = t.keyCodeToTextTable[n];
                    return s || (s = String.fromCharCode(n)), r + s
                }, t.keyCodeToTextTable = {
                    32: "Space",
                    13: "Enter",
                    9: "Tab",
                    37: "Left",
                    38: "Up",
                    39: "Right",
                    40: "Down",
                    96: "Num0",
                    97: "Num1",
                    98: "Num2",
                    99: "Num3",
                    100: "Num4",
                    101: "Num5",
                    102: "Num6",
                    103: "Num7",
                    104: "Num8",
                    105: "Num9",
                    106: "*",
                    107: "+",
                    109: "-",
                    110: ".",
                    111: "/",
                    112: "F1",
                    113: "F2",
                    114: "F3",
                    115: "F4",
                    116: "F5",
                    117: "F6",
                    118: "F7",
                    119: "F8",
                    120: "F9",
                    121: "F10",
                    122: "F11",
                    123: "F12",
                    186: ":",
                    187: ";",
                    188: ",",
                    189: "-",
                    190: ".",
                    191: "/",
                    192: "@",
                    219: "[",
                    220: "\\",
                    221: "]",
                    222: "^",
                    226: "\\"
                }, t
            }(),
            c = function() {
                function t(t, e, n, o, r) {
                    this.key = t, this.text = e, this.value = n, this.toggleHotKey = o, this.holdHotKey = r, this.toggleHotKeyText = l.HotKeyToText(o), this.holdHotKeyText = l.HotKeyToText(r), i.gs.uconfig.changedProcsForViewModel[t] = this.UpdateState.bind(this)
                }
                return t.prototype.UpdateState = function() {
                    this.value = i.gs.uconfig[this.key]
                }, t.prototype.SetValue = function(t) {
                    this.value = t, i.gs.uconfig.SetValue(this.key, t)
                }, t.prototype.SetToggleHotKey = function(t) {
                    this.toggleHotKey = t, this.toggleHotKeyText = l.HotKeyToText(t), i.gs.uconfig.SetToggleHotKey(this.key, t)
                }, t.prototype.SetHoldHotKey = function(t) {
                    this.holdHotKey = t, this.holdHotKeyText = l.HotKeyToText(t), i.gs.uconfig.SetHoldHotKey(this.key, t)
                }, t.prototype.PullModelState = function() {
                    this.value = i.gs.uconfig[this.key], this.toggleHotKey = i.gs.uconfig.toggleHotKeys[this.key], this.holdHotKey = i.gs.uconfig.holdHotKeys[this.key], this.toggleHotKeyText = l.HotKeyToText(this.toggleHotKey), this.holdHotKeyText = l.HotKeyToText(this.holdHotKey)
                }, t
            }();
        e.ConfigEntry = c;
        var h = function() {
            function t(t, e, n) {
                this.key = t, this.text = e, this.hotKey = n, this.hotKeyText = l.HotKeyToText(n)
            }
            return t.prototype.SetHotKey = function(t) {
                this.hotKey = t, this.hotKeyText = l.HotKeyToText(t), i.gs.uconfig.SetControlHotKey(this.key, t)
            }, t.prototype.PullModelState = function() {
                this.hotKey = i.gs.uconfig.controlHotKeys[this.key], this.hotKeyText = l.HotKeyToText(this.hotKey)
            }, t
        }();
        e.ControlHotkeyConfigEntry = h;
        var d = function() {
            function t() {
                var t = i.gs.ucolors.colorDefs;
                this.colorEntries = Object.keys(t).map(function(e) {
                    var n = i.gs.utexts[e],
                        o = t[e];
                    return new s(e, n, o)
                }), this.curColorEntry = this.colorEntries[0], this.cellDisplayEntries = i.UserConfig.cellDisplayOptionPropNames.map(function(t) {
                    var e = i.gs.utexts[t],
                        n = i.gs.uconfig[t],
                        o = i.gs.uconfig.toggleHotKeys[t],
                        r = i.gs.uconfig.holdHotKeys[t];
                    return new c(t, e, n, o, r)
                }), this.gameDisplayEntries = i.UserConfig.gameDisplayOptionPropNames.map(function(t) {
                    var e = i.gs.utexts[t],
                        n = i.gs.uconfig[t],
                        o = i.gs.uconfig.toggleHotKeys[t];
                    return new c(t, e, n, o, -1)
                }), this.basicBehaviorEntries = i.UserConfig.basicBehaviorPropNames.map(function(t) {
                    var e = i.gs.utexts[t],
                        n = i.gs.uconfig[t];
                    return new c(t, e, n, -1, -1)
                }), this.controlEntries = i.UserConfig.controlPropNames.map(function(t) {
                    var e = i.gs.utexts[t],
                        n = i.gs.uconfig.controlHotKeys[t];
                    return new h(t, e, n)
                }), i.gs.uconfig.resetListenerProc = this.UpdateAll.bind(this)
            }
            return t.prototype.selectColorCard = function(t) {
                var e = r.Arrays.First(this.colorEntries, function(e) {
                    return e.key == t
                });
                e && (this.curColorEntry = e)
            }, t.prototype.UpdateAll = function() {
                this.cellDisplayEntries.forEach(function(t) {
                    return t.PullModelState()
                }), this.gameDisplayEntries.forEach(function(t) {
                    return t.PullModelState()
                }), this.basicBehaviorEntries.forEach(function(t) {
                    return t.PullModelState()
                }), this.controlEntries.forEach(function(t) {
                    return t.PullModelState()
                })
            }, t.instance = new t, t
        }();
        e.ConfigHub = d
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(24),
            o = n(0),
            r = function() {
                function t() {
                    this.bus = new i.EventBus, this.skins = {}
                }
                return t.prototype.addSkinUrl = function(t) {
                    null == this.skins[t] && (this.skins[t] = o.gs.uconfig.acceptNewSkins, this.bus.emit("render"))
                }, t.prototype.removeSkinUrl = function(t) {
                    null != this.skins[t] && (delete this.skins[t], this.bus.emit("render"))
                }, t.prototype.setImageAvailability = function(t, e) {
                    this.skins[t] = e
                }, t.prototype.setImageAvailabilityAll = function(t) {
                    for (var e in this.skins) this.skins[e] = t
                }, t.prototype.getSkinAvailability = function(t) {
                    return this.skins[t]
                }, t.instance = new t, t
            }();
        e.SkinImageManager = r
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = function() {
            function t(t) {
                this.procsOnSettled = [], this.loadPhase = 0, this.TryToLoad(t, 0)
            }
            return t.Initialize = function() {
                t.canvas = document.createElement("canvas"), t.ctx = t.canvas.getContext("2d")
            }, t.prototype.OnImageLoaded = function() {
                var t = this.image,
                    e = this.fname;
                this.isSettled = !0, t.width <= 1200 && t.height <= 1200 || (console.log("image size too large: " + e + ", " + t.width + "x" + t.height), this.image = this.GetFallBackImage()), this.FireSettled()
            }, t.prototype.OnImageError = function() {
                if (0 == this.loadPhase) {
                    var t = "http://gr.ixagar.net:9400/?uri=" + this.uri;
                    this.TryToLoad(t, 1)
                } else this.isSettled = !0, this.image = this.GetFallBackImage(), this.FireSettled()
            }, t.prototype.TryToLoad = function(e, n) {
                this.uri = e;
                var i = t.GetFileName(e);
                this.fname = i;
                var o = new Image;
                o.crossOrigin = "Anonymous", o.onload = this.OnImageLoaded.bind(this), o.onerror = this.OnImageError.bind(this), this.loadPhase = n, this.image = o, o.src = e
            }, t.GetFileName = function(t) {
                const e = t.match(/.+\/(.*)$/);
                return e ? e[1] : ""
            }, t.prototype.GetFallBackImage = function() {
                return document.querySelector("#img_no_image_fallback")
            }, t.prototype.FireSettled = function() {
                var t = this;
                this.procsOnSettled.forEach(function(e) {
                    return e(t.image)
                }), this.procsOnSettled = []
            }, t.prototype.ExecAfterLoad = function(t) {
                this.isSettled ? t(this.image) : this.procsOnSettled.push(t)
            }, t.LoadImageThen = function(e, n) {
                var i = t.cash.get(e);
                i || (i = new t(e), t.cash.set(e, i)), i.ExecAfterLoad(n)
            }, t.cash = new Map, t
        }();
        e.ImageWrapper = i;
        var o = function() {
            function t() {
                this.imageCash = new Map
            }
            return t.prototype.LoadImageThen = function(t, e, n) {
                if (t) {
                    var i = this.imageCash.get(t);
                    i && i.flagLoaded ? n(i) : i || ((i = new Image).crossOrigin = "Anonymous", this.imageCash.set(t, i), i.addEventListener("load", function() {
                        i.flagLoaded = !0, n(i)
                    }), i.onerror = function() {
                        console.log("failed to load " + t), n(null)
                    }, i.src = e ? t : "http://gr.ixagar.net:9400/?uri=" + t)
                } else n(null)
            }, t.CheckIsValidImageUri = function(t) {
                var e = t.match(/^http[s]?\:\/\/.*\.(png|jpg|gif|jpeg)$/);
                return e && e.length > 0
            }, t.Instance = new t, t
        }();
        e.ImageLoader = o
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(3),
            o = n(11),
            r = n(0),
            s = n(6),
            a = function() {
                function t(t) {
                    var n = this,
                        a = new s.Container;
                    this.box = a, this.baseSize = t ? 3200 : 200;
                    var l = this.baseSize,
                        c = l / 5,
                        h = r.gs.uconfig,
                        d = r.gs.ucolors;
                    if (t) {
                        var u = new s.Sprite;
                        u.anchor.x = .5, u.anchor.y = .5, u.position.x = l / 2, u.position.y = l / 2, a.addChild(u);
                        var p = new s.Graphics;
                        p.beginFill(0), p.drawRect(0, 0, l, l), p.endFill(), p.visible = !1, a.addChild(p);
                        var g = function() {
                            u.alpha = h.GetBgImageAlphaValue("fieldBackImageAlpha");
                            var t = h.fieldBackImageUri;
                            if (o.ImageLoader.CheckIsValidImageUri(t)) {
                                var e = h.fieldBackImageDrawingMode2;
                                o.ImageLoader.Instance.LoadImageThen(t, !0, function(t) {
                                    if (t) {
                                        t.width, t.height;
                                        var i = Math.min(t.width, t.height),
                                            o = n.baseSize / i * (e ? 2 : 1);
                                        u.scale.x = o, u.scale.y = o, u.texture = s.Texture.from(t.src), u.mask = e ? null : p, u.visible = !0
                                    }
                                })
                            } else u.visible = !1
                        };
                        g(), h.RegisterChangedProc("fieldBackImageUri", g), h.RegisterChangedProc("fieldBackImageAlpha", g), h.RegisterChangedProc("fieldBackImageDrawingMode2", g)
                    }
                    var f = new s.Container;
                    a.addChild(f), this.gridContainer = f;
                    var m = new s.Graphics;
                    f.addChild(m);
                    for (var y = [], v = 0; v < 25; v++) {
                        var S = v % 5,
                            b = v / 5 >> 0,
                            C = String.fromCharCode(65 + b) + (S + 1),
                            x = new s.Text(C);
                        x.style.fontSize = .09 * this.baseSize >> 0, x.style.fontFamily = "CustomFont2, Arial", x.x = S * c + c / 2 - x.width / 2, x.y = b * c + c / 2 - x.height / 2, f.addChild(x), y.push(x)
                    }
                    var _ = function() {
                        var e, o;
                        ! function() {
                            var e = d.GetColor("clFieldCoords");
                            m.alpha = i.ColorHelper.GetAlpha(e), m.clear();
                            var o = t ? .002 : .006,
                                r = n.baseSize * o >> 0,
                                s = r / 2;
                            m.lineStyle(r, e);
                            for (var a = 0; a < 6; a++) {
                                var h = a * c;
                                m.moveTo(h, -s), m.lineTo(h, l + s), m.moveTo(-s, h), m.lineTo(l + s, h)
                            }
                        }(), e = d.GetColor("clFieldCoords"), o = i.ColorHelper.ColorToHtmlString(e), y.forEach(function(t) {
                            return t.style.fill = o
                        }), f.alpha = d.GetAlpha("clFieldCoords")
                    };
                    setTimeout(_, 1), d.RegisterChangedProc("clFieldCoords", _);
                    var w = new s.Sprite;
                    a.addChild(w), w.canvas = document.createElement("canvas"), w.texture = new s.Texture.from(w.canvas);
                    let k = 15,
                        I = 151;
                    var P = function() {
                        var t = .015 * n.baseSize >> 0,
                            e = .003 * n.baseSize >> 0,
                            o = r.gs.uconfig.GlowingBorder ? 9 * t : 0,
                            s = t + o;
                        const a = d.GetColor("clFieldBorder");
                        w.alpha = i.ColorHelper.GetAlpha(a), w.position.set(-s);
                        const c = w.canvas;
                        c.width = c.height = l + 2 * t + 2 * o;
                        const h = c.getContext("2d");
                        h.clearRect(0, 0, l + 2 * t + 2 * o, l + 2 * t + 2 * o), h.beginPath(), h.lineWidth = t, h.strokeStyle = i.ColorHelper.ColorToHtmlString(a), h.globalAlpha = 1, h.shadowBlur = o, h.shadowColor = i.ColorHelper.ColorToHtmlString(a), h.rect(t / 2 + o, t / 2 + o, l + t, l + t), h.save(), h.clip(), h.stroke(), h.shadowBlur = o / 2, h.stroke(), h.stroke(), h.globalAlpha /= 2, h.stroke(), h.restore(), h.shadowBlur = o / 4, h.globalAlpha = 1, h.stroke(), w.texture.update()
                    };
                    0 == e && (P(), w.blendMode = PIXI.BLEND_MODES.SCREEN, h.RegisterChangedProc("GlowingBorder", P), d.RegisterChangedProc("clFieldBorder", P), e++)
                }
                let e = 0;
                return t.prototype.SetScale = function(t) {
                    this.box.scale.x = t, this.box.scale.y = t
                }, t.prototype.SetCoordVisibility = function(t) {
                    this.gridContainer.visible = t
                }, t
            }();
        e.FieldGraphics = a
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(1),
            o = n(1),
            r = n(8),
            s = n(7),
            a = n(14),
            l = n(3),
            c = n(0),
            h = n(2),
            d = function() {
                function t() {}
                return t.prototype.Initialize = function(t, e, n, o, r) {
                    this.nodeId = t, this.cellType = e, this.ownerPlayerId = n, this.color = o, this.ox = 0, this.oy = 0, this.or = 0, this.x, this.y, this.r, this.nx = 0, this.ny = 0, this.nr = 0, this.mass = 0, this.updateStamp = r, this.motionAngle = 0, this.motionSpeed = 0, this.canEat = !1, this.canEaten = !1, this.splitNum = -1, this.splitOrderWeight = -1, this.canSplit = !1, this.showMark = !1, this.sizeLevel = -1, this.velocity = new i.Vector(0, 0),this.splitOrder = 0,
                    this.isHalfSplit = false
                }, t.prototype.UpdateProps = function(t, e, n, i, o) {
                    var r = this.nx,
                        s = this.ny;
                    this.nx = t, this.ny = e, this.nr = l.GameHelper.MassToRadius(n), this.mass = n, this.motionAngle = i, this.motionSpeed = o, this.velocity.Set(t - r, e - s)
                }, t.prototype.LinearUpdate = function(t) {
                    var e = (t - this.updateStamp) / i.Nums.MapTo(c.gs.uconfig.InterpolationSpeed, 179, 49);
                    e = Math.max(Math.min(e, 1), 0), this.x = this.ox + (this.nx - this.ox) * e, this.y = this.oy + (this.ny - this.oy) * e, this.r = this.or + (this.nr - this.or) * e
                }, t.Pool = new l.ObjectPool(c.gs.gconfig.MaxCellsNum, function() {
                    return new t
                }), t
            }();
        e.TNodeData = d;
        var u = function(t, e, n, i) {
                this.eaterId = t, this.eatenId = e, this.limitRadius = n, this.canEat = i
            },
            p = function() {
                function t() {
                    this.nodeId = -1
                }
                return t.prototype.SetTarget = function(t, e, n) {
                    this.nodeId = t, this.canEat = e, this.canPushAll = n
                }, t
            }(),
            g = function() {
                function t(t) {
                    this.eatingLimitList = [], this.AimTargetData = new p, this.gameCore = t
                }
                return t.prototype.UpdateNodeAnalysisProps = function() {
                    var t = this;
                    if (!c.gs.gstates.isBenchmarkMode) {
                        var e = this.gameCore.nodeMan,
                            n = e.nodes,
                            r = e.operationUnitIndex,
                            s = e.selfNodeIds[r].length;
                        if (this.gameCore.gameHudModel.SetSplitNum(s), s > 0) {
                            var a = [];
                            e.selfNodeIds[r].forEach(t => a.push(e.nodes.get(t))), h = a[0], a.forEach(function(t) {
                                t.mass > h.mass && (h = t)
                            }), biggest = h;
                            var d = a.slice(0).sort(function(t, e) {
                                return t.nodeId - e.nodeId
                            });
                            p = d.length, g = 16 - p, f = 0


                            var possibleSplitCount = 0,
                            impossibleSplitCount = 0;
                            var newIndex = 0;
                            d.forEach(function(t, e) {
                            var n = 0;
                            f < g ? t.mass >= 44 ? (n = 0,
                                                    f++,
                                                    t.canSplit = !0,possibleSplitCount+=1,newIndex+=1,t.splitOrder = newIndex) : (n = 1,
                                                                        t.canSplit = !1,impossibleSplitCount+=1,t.splitOrder = 0) : (n = o.Nums.VMap(e, g, p - 1, .4, 1, !0),
                                                                                            t.canSplit = !1,impossibleSplitCount+=1,t.splitOrder = 0),
                                t.splitOrderWeight = n
                            });
                        var x = 3 * possibleSplitCount + impossibleSplitCount + biggest.splitOrder
                        if(x > 16 && x <= (16 + possibleSplitCount)){
                            biggest.isHalfSplit = !0;
                            halfbiggest = biggest;
                        }
                        else{
                            biggest.isHalfSplit = !1;
                            halfbiggest = null;
                        }
                            var m = this.gameCore.sight,
                                y = e.GetNodeIdUnderCursor(m.aimCursorX, m.aimCursorY),
                                v = e.nodes.get(y);
                            v && v.ownerPlayerId == e.activeSelfPlayerId && (y = -1, v = null);
                            var S = !1,
                                b = !1;
                            if (v) {
                                var C = 2 * v.mass * 1.3;
                                a.forEach(function(t) {
                                    t.mass > C && l.GameHelper.GetDist(t.nx, t.ny, v.nx, v.ny) < 780 + t.nr && t.canSplit && (S = !0)
                                });
                                var x = a.length;
                                if (x < 8) {
                                    var _ = void 0;
                                    _ = 1 == x ? 16 : 2 == x ? 8 : x <= 4 ? 4 : 2, this.gameCore.ShowDebugValue("div", _);
                                    var w = h.mass / _;
                                    v.mass > 1.3 * w && (b = !0)
                                }
                            }
                            this.AimTargetData.SetTarget(y, S, b), n.forEach(function(t) {
                                t.showMark = !1, t.canEat = !1, t.canEaten = !1, t.sizeLevel = -1
                            }), n.forEach(function(t) {
                                var e = t.mass,
                                    n, i = 4 * (n = h.mass) * 1.3,
                                    o = 2 * n * 1.3,
                                    r = 1.3 * n,
                                    s = n / 1.3,
                                    a = n / 2 * 1.3,
                                    l = n / 2 / 1.3,
                                    d = n / 4 / 1.3,
                                    u = n / 8 * 1.3,
                                    p = n / 8 / 1.3,
                                    n = c.gs.uconfig.MarkerLight ? d : p;
                                c.gs.uconfig.MarkerExtend ? t.sizeLevel = e > i ? 0 : e > o ? 1 : e > r ? 2 : e > s ? 3 : e > a ? 4 : e > l ? 5 : e > d ? 6 : e > u ? 7 : e > p ? 8 : -1 : t.sizeLevel = e > o ? 0 : e > r ? 1 : e > s ? 2 : e > l ? 3 : e > n ? 4 : c.gs.uconfig.MarkerLight ? -1 : 5
                            }), a.forEach(function(e) {
                                var o = .5 * e.mass * .77;
                                n.forEach(function(n) {
                                    if (!(a.indexOf(n) >= 0) && l.GameHelper.HitTestAABB(e.nx, e.ny, n.nx, n.ny, 1200)) {
                                        var r = t.gameCore.sight,
                                            s = new i.Vector(r.aimCursorX - e.nx, r.aimCursorY - e.ny);
                                        s.Normalize(), s.Scale(1200);
                                        var c = e.nx + s.x,
                                            d = e.ny + s.y;
                                        if (!(l.GameHelper.GetLinePointDist(e.nx, e.ny, c, d, n.nx, n.ny) > e.nr + n.nr)) {
                                            n.showMark = !0;
                                            var u = l.GameHelper.GetDist(e.nx, e.ny, n.nx, n.ny);
                                            if (n.mass < o && e.canSplit && u < 720 + e.nr && (n.canEat = !0), e == h && u < 720 + e.nr) {
                                                var p = 2 * e.mass * 1.3;
                                                n.mass > p && (n.canEaten = !0, n.showMark = !0)
                                            }
                                        }
                                    }
                                })
                            }), a.forEach(function(t) {
                                return t.splitNum = a.length
                            })
                        }
                        this.eatingLimitList = [], n.forEach(function(e) {
                            0 == e.cellType && n.forEach(function(n) {
                                if (0 == n.cellType && e.ownerPlayerId != n.ownerPlayerId && l.GameHelper.HitTestAABB(e.nx, e.ny, n.nx, n.ny, e.nr + n.nr)) {
                                    var i = e.nr > n.nr ? e : n,
                                        r = e == i ? n : e;
                                    if (l.GameHelper.GetDist(e.nx, e.ny, n.nx, n.ny) < i.nr) {
                                        var s = i.mass > 1.3 * r.mass,
                                            a = i.nr - .41 * r.nr,
                                            c = o.Arrays.First(t.eatingLimitList, function(t) {
                                                return t.eaterId == i.nodeId
                                            });
                                        c ? a > c.limitRadius && (c.limitRadius = a, c.eatenId = r.nodeId) : t.eatingLimitList.push(new u(i.nodeId, r.nodeId, a, s))
                                    }
                                }
                            })
                        })
                    }
                }, t
            }();
        e.NodeAnalyzer = g;
        var f = function() {
            function t(t) {
                this.nodes = new Map, this.selfNodeIds = [
                    [],
                    []
                ], this.activeSelfPlayerId = -1, this.gameCore = t, this.nodeAnalyzer = new g(t)
            }
            return Object.defineProperty(t.prototype, "uMan", {
                get: function() {
                    return this.gameCore.uMan
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "gameHud", {
                get: function() {
                    return this.gameCore.gameHudModel
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "dataReceiver", {
                get: function() {
                    return this.gameCore.dataRecorder
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "sight", {
                get: function() {
                    return this.gameCore.sight
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "operationUnitIndex", {
                get: function() {
                    return this.activeSelfPlayerId == this.uMan.selfUserId ? 0 : 1
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "hasSelfNode", {
                get: function() {
                    return this.selfNodeIds[0].length > 0 || this.selfNodeIds[1].length > 0
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.PostClearAllNodes = function() {
                this.selfNodeIds = [
                    [],
                    []
                ], this.nodes.forEach(function(t) {
                    d.Pool.Release(t)
                }), this.nodes.clear()
            }, t.prototype.ResetToInitialiState = function() {
                this.uMan.ClearUserInfos(), this.PostClearAllNodes()
            }, t.prototype.SyncGameViewToModel = function() {
                this.nodeAnalyzer.UpdateNodeAnalysisProps(), this.gameViewSyncNodesToListProc()
            }, t.prototype.CalcurateCenterPointOfAllSelfCells = function() {
                for (var t = 0, e = 0, n = 0, i = 0; i < 2; i++)
                    for (var o = 0, r = this.selfNodeIds[i]; o < r.length; o++) {
                        var s = r[o],
                            a = this.nodes.get(s);
                        t += a.nx * a.mass, e += a.ny * a.mass, n += a.mass
                    }
                return [t /= n, e /= n]
            }, t.prototype.CalcurateCenterPointOfEachSelfCells = function() {
                for (var t = 0, e = 0, n = 0, i = 0, o = this.selfNodeIds[0]; i < o.length; i++) {
                    var r = o[i],
                        s = this.nodes.get(r);
                    t += s.nx * s.mass, e += s.ny * s.mass, n += s.mass
                }
                for (var a = 0, l = 0, c = 0, h = 0, d = this.selfNodeIds[1]; h < d.length; h++) {
                    var u = d[h],
                        p = this.nodes.get(u);
                    a += p.nx * p.mass, l += p.ny * p.mass, c += p.mass
                }
                return [t /= n, e /= n, a /= c, l /= c]
            }, t.prototype.UpdateSelfScore = function() {
                var t = 0;
                if (!c.gs.gstates.isBenchmarkMode)
                    for (var e = 0; e < 2; e++)
                        for (var n = 0, i = this.selfNodeIds[e]; n < i.length; n++) {
                            var o = i[n];
                            t += this.nodes.get(o).mass
                        }
                this.gameHud.PostSelfScoreData(t)
            }, t.prototype.PostNodeData = function(t, e, n, i, r, s, a, h, u, p) {
                var g = this.nodes.get(t),
                    f = !1;
                if (!g && (g = d.Pool.Gain(), o.Utils.Confirm(g), g.Initialize(t, e, s, a, p), this.nodes.set(t, g), g.nx = g.ox = g.x = n, g.ny = g.oy = g.y = i, g.nr = g.or = g.r = l.GameHelper.MassToRadius(r), 0 == g.cellType)) {
                    var m = l.GameHelper.DecodePlayerId(s),
                        y = m[0],
                        v = m[1];
                    y == this.uMan.selfUserId && (0 == this.selfNodeIds[v].length && (f = !0), this.selfNodeIds[v].push(t), this.selfNodeIds[v].sort())
                }
                if (1 == c.gs.uconfig.InterpolationType) {
                    const t = p;
                    g.LinearUpdate(t), g.updateStamp = t, g.ox = g.x, g.oy = g.y, g.or = g.r
                }
                g.UpdateProps(n, i, r, h, u), f && this.sight.SetSpawned()
            }, t.prototype.PostNodeRemoval = function(t) {
                var e = this.nodes.get(t);
                e && (this.nodes.delete(t), d.Pool.Release(e), (o.Arrays.Remove(this.selfNodeIds[0], t) || o.Arrays.Remove(this.selfNodeIds[1], t)) && 0 == this.selfNodeIds[0].length && 0 == this.selfNodeIds[1].length && this.selfUnitsDeadCallback && this.selfUnitsDeadCallback())
            }, t.prototype.RecordLatencyCheckStartTime = function() {
                this.latencyCheckStartTime = Date.now()
            }, t.prototype.PostExternalChatMessage = function(t, e, skin, trip) {
                var n = o.DateTimeHelper.GetHourMinutesString();
                this.gameHud.PostChatMessage(n, t, e, null, skin, trip)
            }, t.prototype.OnEnterBenchMarkMode = function() {
                this.gameHud.PostLeaderboardData([]), this.gameHud.PostTeamRankingData([]), this.gameHud.PostMapData([]), this.PostClearAllNodes(), this.SyncGameViewToModel(), this.gameHud.PostServerStatusData(""), this.gameHud.PostLatencyData(0), this.gameHud.PostServerUserNumData(0, 0, 0, 0)
            }, t.prototype.GetPlayerIdUnderCursor = function(t, e) {
                var n = -1;
                return this.nodes.forEach(function(i) {
                    -1 == n && 0 == i.cellType && l.GameHelper.GetDist(i.nx, i.ny, t, e) < i.nr && (n = i.ownerPlayerId)
                }), n
            }, t.prototype.GetNodeIdUnderCursor = function(t, e) {
                var n = -1;
                return this.nodes.forEach(function(i) {
                    -1 == n && 0 == i.cellType && l.GameHelper.GetDist(i.nx, i.ny, t, e) < i.nr && (n = i.nodeId)
                }), n
            }, t.prototype.DecodeFrame = function(t, e, n) {
                var i = new r.DataFrameReader(t);
                switch (i.ReadUint8()) {
                    case 43:
                        var d = i.ReadUint16();
                        this.uMan.PostSelfUserId(d);
                        break;
                    case 65:
                        i.ReadFloat32(), i.ReadFloat32();
                        var u = i.ReadFloat32();
                        i.ReadFloat32(), c.gs.gconfig.UpdateFieldSize(u), this.sight.Init();
                        break;
                    case 42:
                        for (var p = i.ReadUint16(), g = 0; g < p; g++) {
                            var f = i.ReadUint16(),
                                m = i.ReadStringEx(),
                                y = i.ReadStringEx(),
                                v = i.ReadStringEx(),
                                S = i.ReadUint8() > 0,
                                b = i.ReadUint16(),
                                C = i.ReadStringEx(),
                                x = i.ReadStringEx();
                            if (e) {
                                if ((tt = this.uMan.GetUserInfoById(f)) != this.uMan.fallbackUserInfo) {
                                    var _ = s.InternalPackets.UserEntryInfo(f, m, y, b, v, x);
                                    this.dataReceiver.PostInternalRecordingPacket(_)
                                }
                                tt.clientId, this.uMan.selfUserId
                            }
                            this.uMan.PostUserInfoData(f, m, y, b, v, x, S, C)
                        }
                        break;
                    case 45:
                        for (p = i.ReadUint16(), g = 0; g < p; g++) {
                            var w = i.ReadUint16();
                            this.uMan.PostUserLeave(w)
                        }
                        break;
                    case 39:
                        for (p = i.ReadUint16(), g = 0; g < p; g++) {
                            var k = i.ReadUint16(),
                                I = (f = i.ReadUint16(), i.ReadUint8()),
                                P = i.ReadUint8(),
                                M = i.ReadUint8(),
                                T = i.ReadUint8(),
                                R = I << 16 | P << 8 | M;
                            if (e && (tt = this.uMan.GetUserInfoById(k)) != this.uMan.fallbackUserInfo) {
                                var U = tt.colors[1 & T];
                                this.dataReceiver.PostInternalRecordingPacket(s.InternalPackets.PlayerColor(k, U))
                            }
                            this.uMan.PostPlayerColorData(k, R)
                        }
                        break;
                    case 36:
                        for (p = i.ReadUint16(), g = 0; g < p; g++) {
                            b = i.ReadUint16();
                            var A = i.ReadStringEx(),
                                E = i.ReadStringEx(),
                                F = i.ReadStringEx();
                            if (R = l.ColorHelper.ColorFromHtmlString(E), e && (et = this.uMan.GetTeamInfoById(b)) != this.uMan.fallbackTeamInfo) {
                                var N = et.color;
                                this.dataReceiver.PostInternalRecordingPacket(s.InternalPackets.TeamColor(b, N))
                            }
                            this.uMan.PostTeamInfoData(b, R, A, F)
                        }
                        break;
                    case 35:
                        for (p = i.ReadUint16(), g = 0; g < p; g++) b = i.ReadUint16(), this.uMan.PostTeamInfoRemoval(b);
                        break;
                    case 18:
                        this.PostClearAllNodes(), n || this.SyncGameViewToModel();
                        break;
                    case 15:
                        var O = i.ReadFloat32(),
                            D = i.ReadFloat32();
                        if (i.ReadFloat32(), i.ReadFloat32(), this.sight.SetServerEyePos(O, D), i.ReadUint8() > 0) {
                            k = i.ReadUint16();
                            var H = i.ReadFloat32(),
                                B = i.ReadFloat32(),
                                G = i.ReadUint8(),
                                L = i.ReadUint32(),
                                z = (1 & G) > 0,
                                j = (f = 65534 & k, c.gs.gstates);
                            f != this.uMan.selfUserId ? this.sight.setAimCursorProps(k, H, B, z) : this.sight.aimPlayerId = k, j.isRealtimeMode && j.isSpectate && this.gameHud.SetSpecTargetScore(L), f == this.uMan.selfUserId && (this.activeSelfPlayerId = k)
                        } else this.sight.aimPlayerId = -1, this.activeSelfPlayerId = -1;
                        var V = this.sight.aimPlayerId > 0 ? 65534 & this.sight.aimPlayerId : -1;
                        let t = performance.now();
                        for (this.gameHud.SetAimPlayerClient(V); 0 != (Z = i.ReadUint32());) {
                            var W = i.ReadUint8(),
                                K = i.ReadFloat32(),
                                X = i.ReadFloat32(),
                                Y = i.ReadUint16(),
                                q = (k = i.ReadUint16(), 0);
                            1 == W && (q = i.ReadUint32());
                            var Q = 0,
                                J = 0;
                            i.ReadUint8() && (Q = i.ReadFloat32(), J = i.ReadFloat32()), e && !this.nodes.has(Z) && (_ = s.InternalPackets.NodeRemoval(Z), this.dataReceiver.PostInternalRecordingPacket(_)), n && (J = 0), this.PostNodeData(Z, W, K, X, Y, k, q, Q, J, t)
                        }
                        for (p = i.ReadUint16(), g = 0; g < p; g++) {
                            var Z = i.ReadUint32();
                            this.PostNodeRemoval(Z)
                        }
                        n || this.SyncGameViewToModel();
                        break;
                    case 47:
                        if (n) break;
                        p = i.ReadUint8();
                        var $ = [];
                        for (g = 0; g < p; g++) {
                            k = i.ReadUint16(), Y = i.ReadUint32();
                            var tt = this.uMan.GetUserInfoById(k),
                                et = this.uMan.GetTeamInfoById(tt.teamId);
                            $.push(new a.TLeaderboardData(tt.fullName, Y, et.colorStr))
                        }
                        this.gameHud.PostLeaderboardData($);
                        break;
                    case 46:
                        if (n) break;
                        for (p = i.ReadUint8(), $ = [], g = 0; g < p; g++) {
                            b = i.ReadUint16();
                            var nt = i.ReadUint16(),
                                it = this.uMan.GetTeamInfoById(b);
                            $.push(new a.TLeaderboardData(it.teamName, nt, it.colorStr))
                        }
                        this.gameHud.PostTeamRankingData($);
                        break;
                    case 41:
                        if (n) break;
                        p = i.ReadUint16();
                        var ot = [];
                        for (g = 0; g < p; g++) k = i.ReadUint16(), K = i.ReadInt16(), X = i.ReadInt16(), Y = i.ReadUint16(), ot.push(new a.TMapData(k, K, X, Y));
                        this.gameHud.PostMapData(ot);
                        break;
                    case 128:
                        f = i.ReadUint16(), i.ReadStringEx();
                        var rt = i.ReadStringEx(),
                            st = o.DateTimeHelper.GetHourMinutesString(),
                            at = (tt = this.uMan.GetUserInfoById(f), et = this.uMan.GetTeamInfoById(tt.teamId), !0);
                        h.AppConfigurator.instance.useTeamSeparatedChat && et != this.uMan.selfTeamInfo && (at = !1), at ? this.gameHud.PostChatMessage(st, tt.fullName, rt, et.colorStr) : console.log("stray chat message: " + st + " " + tt.fullName + " " + rt);
                        break;
                    case 14:
                        break;
                    case 131:
                        if (n) break;
                        var lt = Date.now() - this.latencyCheckStartTime;
                        this.gameHud.PostLatencyData(lt);
                        break;
                    case 133:
                        var ct = i.ReadStringEx();
                        console.log(ct);
                        break;
                    case 200:
                        var ht = i.ReadStringEx(),
                            dt = JSON.parse(ht);
                        c.gs.gconfig.ShowAlwaysAllPlayersInMap = !dt.enableTeamMapSeparation, c.gs.gconfig.ShowAlwaysAllPlayersSkin = !dt.enableTeamSkinSeparation;
                        var ut = this.gameCore.chatAppModel;
                        ut && ut.SetGameTeamChatSessionEnabled(dt.enableTeamChatSeparation);
                        var pt = c.gs.gstates.enableTeamChatSeparationCurrent != dt.enableTeamChatSeparation;
                        c.gs.gstates.enableTeamChatSeparationCurrent = dt.enableTeamChatSeparation, ut && ut.SetServerSignature(c.gs.gstates.chatRoomSig, pt);
                        break;
                    case 201:
                        ht = i.ReadStringEx(), this.gameHud.PostServerInstructionText(ht);
                        break;
                    case 202:
                        ct = i.ReadStringEx(), this.gameHud.PostServerDisplayMessage(ct);
                        break;
                    case 203:
                        if (n) break;
                        ht = i.ReadStringEx(), this.gameHud.PostServerStatusData(ht);
                        break;
                    case 91:
                        if (n) break;
                        i.ReadUint16();
                        var gt = i.ReadUint16(),
                            ft = i.ReadUint16(),
                            mt = i.ReadUint16(),
                            yt = i.ReadUint16();
                        i.ReadStringEx(), i.ReadUint32(), this.gameHud.PostServerUserNumData(gt, mt, ft, yt);
                        break;
                    case 161:
                        Z = i.ReadUint32(), this.PostNodeRemoval(Z);
                        break;
                    case 162:
                        f = i.ReadUint16();
                        var vt = i.ReadStringEx();
                        y = i.ReadStringEx(), b = i.ReadUint16(), v = i.ReadStringEx(), x = i.ReadStringEx(), this.uMan.PostUserInfoData(f, vt, y, b, v, x);
                        break;
                    case 163:
                        k = i.ReadUint16(), R = i.ReadUint32(), this.uMan.PostPlayerColorData(k, R);
                        break;
                    case 164:
                        b = i.ReadUint16(), R = i.ReadUint32(), this.uMan.PostTeamInfoData(b, R);
                        break;
                    case 166:
                        var St = i.ReadInt32(),
                            bt = i.ReadInt32(),
                            Ct = i.ReadFloat32(),
                            xt = (H = i.ReadInt32(), B = i.ReadInt32(), z = i.ReadUint8() > 0, i.ReadUint16());
                        this.sight.FeedReplaySightState(St, bt, Ct, H, B, z, xt);
                        break;
                    case 19:
                        i.ReadUint8();
                        var _t = i.ReadInt32(),
                            wt = i.ReadInt32(),
                            kt = i.ReadInt32(),
                            It = Date.now();
                        this.sight.teamCircleX = _t, this.sight.teamCircleY = wt, this.sight.teamCircleRadius = kt, this.sight.teamCircleTimeStamp = It
                }
            }, t
        }();
        e.NodeManager = f
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = function() {
            function t() {}
            return t.PermanentKeeped = [42, 45, 39, 36, 35, 65], t.NotForRecord = [43, 200, 201, 131, 133, 202], t
        }();
        e.OpcodeGroups = i;
        var o = function(t, e, n, i) {
            this.playerId = t, this.nx = e, this.ny = n, this.mass = i
        };
        e.TMapData = o;
        var r = function(t, e, n) {
            this.name = t, this.score = e, this.colorStr = n
        };
        e.TLeaderboardData = r
    }, function(t, e, n) {
        "use strict";
        var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(t, e) {
                    t.__proto__ = e
                } || function(t, e) {
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
                },
                function(t, e) {
                    function n() {
                        this.constructor = t
                    }
                    i(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
                }),
            r = this && this.__decorate || function(t, e, n, i) {
                var o, r = arguments.length,
                    s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i);
                else
                    for (var a = t.length - 1; a >= 0; a--)(o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
                return r > 3 && s && Object.defineProperty(e, n, s), s
            };
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = n(5),
            a = n(10),
            l = n(0),
            c = function(t) {
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    return e.uconfig = l.gs.uconfig, e.skinMan = a.SkinImageManager.instance, e
                }
                return o(e, t), e.prototype.mounted = function() {
                    this.skinMan.bus.on("render", this.update.bind(this)), window.ondragstart = function() {
                        return !1
                    }
                }, e.prototype.onCellClick = function(t) {
                    var e = t.item.uri,
                        n = t.item.allowed;
                    this.skinMan.setImageAvailability(e, !n)
                }, e.prototype.onButton = function(t) {
                    var e = t.target.dataset.sig;
                    "acceptNewSkins" == e && this.uconfig.SetAcceptNewSkins(!0), "declineNewSkins" == e && this.uconfig.SetAcceptNewSkins(!1), "acceptAll" == e && this.skinMan.setImageAvailabilityAll(!0), "declineAll" == e && this.skinMan.setImageAvailabilityAll(!1)
                }, r([s.template("\n<skin-filter-panel>\n\t<style>\n\t\t.skin_filter_panel_root{\n\t\t\twidth: 400px;\n\t\t\theight: 530px;\n\t\t\tbackground-color: #F0F6FF;\n\t\t\tposition: absolute;\n\t\t\ttop: 34px;\n\t\t\tright: 6px;\n\t\t\tborder: solid 1px #44A;\n\t\t\tborder-radius: 2px;\n\t\t\tcolor: #448;\n\t\t\tpadding: 8px;\n\t\t\tfont-size: 16px;\n\t\t}\n\n\t\t.sf_skinlistbox_outer{\n\t\t\theight: 400px;\n\t\t\toverflow-y: scroll;\n\t\t\tborder: solid 1px #CCE;\n\t\t}\n\n\t\t.sf_skinlistbox{\n\t\t\tdisplay: flex;\n\t\t\tflex-wrap: wrap;\n\t\t\talign-items: flex-start;\n\t\t}\n\n\t\t.sf_skinlistbox > div{\n\t\t\twidth: 60px;\n\t\t\theight: 60px;\n\t\t\tdisplay: flex;\n\t\t\tborder: solid 1px #CCE;\n\t\t\tposition: relative;\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.sf_skinlistbox > div > *{\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t}\n\t\t.sf_skinlistbox > div img{\n\t\t\tmax-width: 100%;\n\t\t\tmax-height: 100%;\n\t\t\tleft: 0;\n\t\t\tright: 0;\n\t\t\ttop: 0;\n\t\t\tbottom: 0;\n\t\t\tmargin: auto;\n\t\t}\n\n\t\t.sf_skinlistbox > div > .cover{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tbackground-color: rgba(0, 0, 0, 0.4);\n\t\t}\n\n\t\t.sf_img_block{\n\t\t\topacity: 0.2;\n\t\t}\n\n\t\t.sf_box{\n\t\t\tmargin-bottom: 10px;\n\t\t}\n\n\t\t.sfbt{\n\t\t\tdisplay: inline-block;\n\t\t\tbackground-color: #FFF;\n\t\t\tcolor: #008;\n\t\t\tborder-radius: 2px;\n\t\t\tpadding: 0 4px;\n\t\t\tcursor: pointer;\n\t\t\tborder: solid 1px #008;\n\t\t}\n\n\t\t.sfbt_active{\n\t\t\tbackground-color: #0CF;\n\t\t}\n\t</style>\n\n\t<div class='skin_filter_panel_root'>\n\t\t<div class='sf_box'>\n\t\t\tスキン画像フィルタ\n\t\t</div>\n\n\t\t<div class='sf_skinlistbox_outer sf_box'>\n\t\t\t<div class='sf_skinlistbox'>\n\t\t\t\t<div each={allowed, uri in skinMan.skins} onclick={onCellClick}>\n\t\t\t\t\t<img src={uri} />\n\t\t\t\t\t<div class='cover' show={!allowed}>\n\t\t\t\t\t\t<img src='gr/blocked.png' class='sf_img_block' />\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class='sf_box'>\n\t\t\t<div class='sfbt' onclick={onButton} data-sig='acceptAll'>\n\t\t\t\t全て許可\n\t\t\t</div>\n\n\t\t\t<div class='sfbt' onclick={onButton} data-sig='declineAll'>\n\t\t\t\t全て拒否\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class='sf_box'>\n\t\t\t新規画像:\n\n\t\t\t<div class={sfbt: true, sfbt_active: uconfig.acceptNewSkins} onclick={onButton} data-sig='acceptNewSkins'>\n\t\t\t\t許可\n\t\t\t</div>\n\n\t\t\t<div class={sfbt: true, sfbt_active: !uconfig.acceptNewSkins} onclick={onButton} data-sig='declineNewSkins'>\n\t\t\t\t拒否\n\t\t\t</div>\n\n\t\t</div>\n\n\t</div>\n</skin-filter-panel>\n")], e)
            }(s.Element);
        e.SkinFilterPanelTag = c
    }, function(t, e, n) {
        "use strict";
        var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(t, e) {
                    t.__proto__ = e
                } || function(t, e) {
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
                },
                function(t, e) {
                    function n() {
                        this.constructor = t
                    }
                    i(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
                }),
            r = this && this.__decorate || function(t, e, n, i) {
                var o, r = arguments.length,
                    s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i);
                else
                    for (var a = t.length - 1; a >= 0; a--)(o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
                return r > 3 && s && Object.defineProperty(e, n, s), s
            };
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = n(5),
            a = n(2),
            l = n(0),
            c = n(9),
            h = n(1),
            d = 260,
            u = function(t) {
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    return e.uconfig = l.gs.uconfig, e.cssColors = l.gs.ucolors.cssColors, e.appConfig = a.AppConfigurator.instance, e.utexts = l.gs.utexts, e.isJapanese = a.AppConfigurator.instance.isJapanese, e.model = c.ConfigHub.instance, e.editModel = new c.ColorEditModel, e.windowMouseHandlerProc = null, e.pickerEndX = d - 6, e
                }
                return o(e, t), e.prototype.mounted = function() {
                    this.editModel.SetColor(this.model.curColorEntry.color), this.UpdateColorView(), window.addEventListener("mousemove", this.onWindowMouseMove.bind(this)), window.addEventListener("mouseup", this.onWindowMouseUp.bind(this))
                }, e.prototype.onCardSelected = function(t) {
                    var e = t.currentTarget.value;
                    this.model.selectColorCard(e), this.editModel.SetColor(this.model.curColorEntry.color)
                }, e.prototype.onCardSelected2 = function(t) {
                    this.UpdateColorView()
                }, e.prototype.onMainCanvasClick = function() {}, e.prototype.onWindowMouseMove = function(t) {
                    this.windowMouseHandlerProc && this.windowMouseHandlerProc(t)
                }, e.prototype.onWindowMouseUp = function() {
                    this.windowMouseHandlerProc = null
                }, e.prototype.ReflectEditModelColorToModel = function() {
                    this.model.curColorEntry.SetColor(this.editModel.color, !0), this.UpdateColorView(), this.update(), this.appRoot.update()
                }, e.prototype.removeFocusOnPage = function() {
                    var t = document.activeElement;
                    t && t.blur(), window.getSelection().removeAllRanges()
                }, e.prototype.onHueGaugeMouseDown = function(t) {
                    var e = this,
                        n = t.target.getBoundingClientRect().left,
                        i = function(t) {
                            var i = t.pageX - n,
                                o = h.Nums.VMap(i, 0, e.pickerEndX, 0, .999, !0);
                            e.editModel.SetHue(o), e.ReflectEditModelColorToModel(), e.update()
                        };
                    return i(t), this.windowMouseHandlerProc = i, t.preventDefault(), !1
                }, e.prototype.onMainGaugeMouseDown = function(t) {
                    var e = this,
                        n = t.target.getBoundingClientRect(),
                        i = n.left,
                        o = n.top,
                        r = function(t) {
                            var n = t.pageX - i,
                                r = t.pageY - o,
                                s = h.Nums.VMap(n, 0, e.pickerEndX, 0, 1, !0),
                                a = h.Nums.VMap(r, 0, e.pickerEndX, 0, 1, !0);
                            e.editModel.SetSV(s, 1 - a), e.ReflectEditModelColorToModel()
                        };
                    return r(t), this.windowMouseHandlerProc = r, t.preventDefault(), !1
                }, e.prototype.onAlphaGaugeMouseDown = function(t) {
                    var e = this,
                        n = t.target.getBoundingClientRect().left,
                        i = function(t) {
                            var i = t.pageX - n,
                                o = h.Nums.VMap(i, 0, e.pickerEndX, 0, 1, !0);
                            e.editModel.SetAlpha(o), e.ReflectEditModelColorToModel()
                        };
                    return i(t), this.windowMouseHandlerProc = i, t.preventDefault(), !1
                }, e.prototype.onColorTextInput = function(t) {
                    var e = t.target.value;
                    this.editModel.SetByHtmlColor(e), this.ReflectEditModelColorToModel()
                }, e.prototype.UpdateColorView = function() {
                    this.drawAlphaCanvas(), this.drawMainCanvas();
                    var t = this.pickerEndX;
                    this.refs.knob_hue.style.left = this.editModel.hue * t + "px", this.refs.knob_alpha.style.left = this.editModel.alpha * t + "px", this.refs.knob_main.style.left = this.editModel.sat * t + "px", this.refs.knob_main.style.top = (1 - this.editModel.bri) * t + "px"
                }, e.prototype.drawMainCanvas = function() {
                    var t = this.refs.picker_main_canvas,
                        e = t.width,
                        n = t.height,
                        i = t.getContext("2d");
                    i.clearRect(0, 0, e, n);
                    for (var o = 360 * this.editModel.hue, r = 0; r < n; r++) {
                        var s = i.createLinearGradient(0, 0, e, 0),
                            a = "hsl(" + o + ",0%," + h.Nums.VMap(r, 0, n, 100, 0) + "%)",
                            l = "hsl(" + o + ",100%," + h.Nums.VMap(r, 0, n, 50, 0) + "%)";
                        s.addColorStop(0, a), s.addColorStop(1, l), i.fillStyle = s, i.fillRect(0, r, e, 1)
                    }
                }, e.prototype.drawAlphaCanvas = function() {
                    var t = this.refs.picker_alpha_canvas,
                        e = t.width,
                        n = t.height,
                        i = t.getContext("2d");
                    i.clearRect(0, 0, e, n), i.beginPath();
                    var o = i.createLinearGradient(0, 0, e, 0),
                        r = this.model.curColorEntry.color,
                        s = r >> 16 & 255,
                        a = r >> 8 & 255,
                        l = 255 & r;
                    o.addColorStop(0, "rgba(" + s + "," + a + "," + l + ",0.0)"), o.addColorStop(1, "rgba(" + s + "," + a + "," + l + ",1.0)"), i.fillStyle = o, i.rect(0, 0, e, n), i.fill()
                }, e.prototype.optionChanged = function(t, e) {
                    t.item.SetValue(e)
                }, e.prototype.checkChanged = function(t) {
                    this.optionChanged(t, t.target.checked)
                }, Object.defineProperty(e.prototype, "appRoot", {
                    get: function() {
                        return this.parent.parent
                    },
                    enumerable: !0,
                    configurable: !0
                }), e.prototype.onConfigTextInput = function(t) {
                    l.gs.uconfig.SetValue(t.target.name, t.target.value)
                }, e.prototype.onConfigCheckChanged = function(t) {
                    l.gs.uconfig.SetValue(t.target.name, t.target.checked)
                }, r([s.template("\n<color-config-panel>\n\t<style>\n\t\t.panel_content_box{\n\t\t\theight: 632px;\n\t\t\t_overflow-y: scroll;\n\t\t\t_padding: 0 10px;\n\t\t}\n\n\t\t.header_box{\n\t\t\theight: 48px;\n\t\t\tfont-size: 24px;\n\t\t\tpadding-left: 12px;\n\t\t\tline-height: 48px;\n\t\t}\n\n\t\t.panel_content_inner{\n\t\t\twidth: 700px;\n\t\t\tmargin: 0 auto;\n\t\t\tmargin-top: 50px;\n\t\t}\n\n\t\t.box_frame{\n\t\t\tborder: solid 1px;\n\t\t\tborder-radius: 5px;\n\t\t\tmargin-bottom: 10px;\n\t\t}\n\n\t\t.box_header{\n\t\t\twidth: 100%;\n\t\t\tpadding-top: 2px;\n\t\t\tpadding-left: 5px;\n\t\t\tborder-radius: 3px 3px 0 0;\n\t\t\tfont-size: 20px;\n\t\t}\n\n\t\t.box_content{\n\t\t\tpadding: 10px;\n\t\t}\n\n\t\t.ui_config{\n\t\t\theight: 28px;\n\t\t}\n\t\t\n\t\t.ui_checkbox{\n\t\t\twidth: 18px;\n\t\t\theight: 18px;\n\t\t\tvertical-align: middle;\n\t\t}\n\t\t\n\t\t.ui_color_text_input{\n\t\t\twidth: 100px;\n\t\t}\n\n\t\t.main_config_panel_root{\n\t\t}\n\n\t\t.color_edit_part{\n\t\t\theight: 320px;\n\t\t}\n\t\t.color_entries_outer{\n\t\t\tborder: solid 1px #AAA;\n\t\t\twidth: 380px;\n\t\t\theight: 100%;\n\t\t\toverflow-y: scroll;\n\t\t\tuser-select: none;\n\t\t\tcursor: default;\n\t\t\tfloat: left;\n\t\t}\n\n\t\t.color_entry_card{\n\t\t}\n\n\t\t.card_selected{\n\t\t\tbackground-color: #0BF;\n\t\t}\n\n\t\t.color_header{\n\t\t\tdisplay: inline-block;\n\t\t\twidth: 335px;\n\t\t\twhite-space: nowrap;\n\t\t\toverflow: hidden;\n\t\t\tvertical-align: middle;\n\t\t\tpadding-left: 8px;\n\t\t}\n\n\t\t.color_cell{\n\t\t\twidth: 14px;\n\t\t\theight: 14px;\n\t\t\tdisplay: inline-block;\n\t\t\tborder: solid 1px #000;\n\t\t\tvertical-align: middle;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.color_cell > *{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t}\n\n\t\t.color_picker_outer{\n\t\t\twidth: 280px;\n\t\t\theight: 100%;\n\t\t\t_border: solid 1px #AAA;\n\t\t\tfloat: left;\n\t\t\tdisplay: flex;\n\t\t}\n\n\t\t.color_picker_inner{\n\t\t\tmargin: auto auto;\n\t\t\twidth: " + d + "px;\n\t\t\theight: " + (d + 60) + "px;\n\t\t}\n\n\t\t.color_text_input_outer{\n\t\t\tmargin-bottom: 10px;\n\t\t}\n\n\t\tinput.color_text_input{\n\t\t\tborder: none;\n\t\t\twidth: 70px;\n\t\t\theight: 26px;\n\t\t\tpadding-left: 8px;\n\t\t}\n\n\t\t.gauge_box{\n\t\t\twidth: " + d + "px;\n\t\t\t_border: solid 1px #AAA;\n\t\t\tuser-select: none;\n\t\t\tposition: relative;\n\t\t\tcursor: default;\n\t\t}\n\n\t\t.gauge_box_I{\n\t\t\theight: 30px; \n\t\t}\n\n\t\t.gauge_box_L{\n\t\t\theight: " + d + "px;\n\t\t}\n\n\t\t.picker_main_canvas_outer{\n\t\t\t_border: solid 1px #AAA;\n\t\t\tuser-select: none;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.gauge_box > *{\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t}\n\n\t\t.bar_image{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t}\n\n\t\t.gauge_cover{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t}\n\n\t\t.knob{\n\t\t\tborder: solid 1px #000;\n\t\t\tposition: absolute;\n\t\t\tbackground-color: rgba(255, 255, 255, 1.0);\n\t\t}\n\n\t\t.knob_I{\n\t\t\twidth: 6px;\n\t\t\theight: 30px;\n\t\t}\n\n\t\t.knob_L{\n\t\t\twidth: 6px;\n\t\t\theight: 6px;\n\t\t}\n\n\t\t.config_box{}\n\t</style>\n\t<div class=\"main_config_panel_root\">\n\t\t<div class=\"header_box\">\n\t\t\t{utexts.hdrTheme}\n\t\t</div>\n\n\t\t<div class=\"panel_content_box\">\n\t\t\t<div class='panel_content_inner'>\n\n\t\t\t\t<div class='box_frame' style='border-color: {cssColors.clPanelForeground}'>\n\t\t\t\t\t<div class='box_header' style='background-color: {cssColors.clPanelForeground}; color:{cssColors.clPanelHeader}'>\n\t\t\t\t\t　<span style='font-family: IConFont1'>&#xe90d</span><span>{utexts.hdrColor}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class='box_content' style='padding: 15px'>\n\n\t\t\t\t\t\t<div class='color_edit_part'>\n\t\t\t\t\t\t\t<div class='color_entries_outer' onmousedown={onCardSelected2}\n\t\t\t\t\t\t\t\tstyle='border-color: {cssColors.clPanelForeground}'>\n\t\t\t\t\t\t\t\t<virtual each={m in model.colorEntries}>\n\t\t\t\t\t\t\t\t\t<div class='color_entry_card' \n\t\t\t\t\t\t\t\t\t\tstyle='background: {m == model.curColorEntry ? cssColors.clUiButtonActive : \"none\"}'\n\t\t\t\t\t\t\t\t\t\tvalue={m.key} onmousedown={onCardSelected}>\n\t\t\t\t\t\t\t\t\t\t<div class='color_header'>\n\t\t\t\t\t\t\t\t\t\t\t{m.text}\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class='color_cell'>\n\t\t\t\t\t\t\t\t\t\t\t<img src='gr/checker_cell.png' />\n\t\t\t\t\t\t\t\t\t\t\t<div style='background: {m.cssColor}' />\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</virtual>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class='color_picker_outer'>\n\t\t\t\t\t\t\t\t<div class='color_text_input_outer' if={false}>\n\t\t\t\t\t\t\t\t\t<input class='color_text_input' value={model.curColorEntry.htmlColor} oninput={onColorTextInput} />\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class='color_picker_inner'>\n\t\t\t\t\t\t\t\t\t<div class='gauge_box gauge_box_I'>\n\t\t\t\t\t\t\t\t\t\t<img src='gr/huebar.png' class='bar_image' />\n\t\t\t\t\t\t\t\t\t\t<div class='knob knob_I' ref='knob_hue' />\n\t\t\t\t\t\t\t\t\t\t<div class='gauge_cover' onmousedown={onHueGaugeMouseDown} />\n\t\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t\t<div class='gauge_box gauge_box_L'>\n\t\t\t\t\t\t\t\t\t\t<canvas width='" + d + "' height='" + d + "' ref='picker_main_canvas' onclick={onMainCanvasClick}/>\n\t\t\t\t\t\t\t\t\t\t<div class='knob knob_L' ref='knob_main' />\n\t\t\t\t\t\t\t\t\t\t<div class='gauge_cover' onmousedown={onMainGaugeMouseDown} />\n\t\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t\t<div class='gauge_box gauge_box_I'>\n\t\t\t\t\t\t\t\t\t\t<img src='gr/checkbar.png' class='bar_image' />\n\t\t\t\t\t\t\t\t\t\t<canvas width='" + d + '\' height=\'30\' ref=\'picker_alpha_canvas\' />\n\t\t\t\t\t\t\t\t\t\t<div class=\'knob knob_I\' ref=\'knob_alpha\' />\n\t\t\t\t\t\t\t\t\t\t<div class=\'gauge_cover\' onmousedown={onAlphaGaugeMouseDown} />\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\'clear_both\' />\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\'box_frame\' style=\'border-color: {cssColors.clPanelForeground}\'>\n\t\t\t\t\t<div class=\'box_header\' style=\'background-color: {cssColors.clPanelForeground}; color:{cssColors.clPanelHeader}\'>\n\t\t\t\t\t　<span style=\'font-family: IConFont1\'>&#xe90d</span><span>{utexts.hdrWallpaper}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\'box_content\'>\n\n\t\t\t\t\t\t<div class=\'config_box\'>\n\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t{isJapanese ? \'フィールド背景\' : \'Field\'}\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t<input type="text" class="ui_config" style="width:200px" \n\t\t\t\t\t\t\t\t\t\t\tname="fieldBackImageUri"\n\t\t\t\t\t\t\t\t\t\t\tvalue={uconfig.fieldBackImageUri} onchange={onConfigTextInput} />\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td style="font-family: Arial">\n\t\t\t\t\t\t\t\t\t\t&#x03B1;\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t<input type="text" class="ui_config" style="width:30px" \n\t\t\t\t\t\t\t\t\t\t\tname="fieldBackImageAlpha"\n\t\t\t\t\t\t\t\t\t\t\tvalue={uconfig.fieldBackImageAlpha} oninput={onConfigTextInput} />\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\tL\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t<input type="checkbox" class="ui_config ui_checkbox"\n\t\t\t\t\t\t\t\t\t\t\tname="fieldBackImageDrawingMode2"\n\t\t\t\t\t\t\t\t\t\t\tchecked="{uconfig.fieldBackImageDrawingMode2}" onchange={onConfigCheckChanged}/>\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t</tr>\n\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t{isJapanese ? \'パネル背景\' : \'Panel\'}\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t<input type="text" class="ui_config" style="width:200px" \n\t\t\t\t\t\t\t\t\t\t\tname="panelBackImageUri"\n\t\t\t\t\t\t\t\t\t\t\tvalue={uconfig.panelBackImageUri} oninput={onConfigTextInput} />\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td style="font-family: Arial">\n\t\t\t\t\t\t\t\t\t\t&#x03B1;\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t<input type="text" class="ui_config" style="width:30px" \n\t\t\t\t\t\t\t\t\t\t\tname="panelBackImageAlpha"\n\t\t\t\t\t\t\t\t\t\t\tvalue={uconfig.panelBackImageAlpha} oninput={onConfigTextInput} />\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</color-config-panel>\n')], e)
            }(s.Element);
        e.ColorConfigPanelTag = u
    }, function(t, e, n) {
        "use strict";
        var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(t, e) {
                    t.__proto__ = e
                } || function(t, e) {
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
                },
                function(t, e) {
                    function n() {
                        this.constructor = t
                    }
                    i(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
                }),
            r = this && this.__decorate || function(t, e, n, i) {
                var o, r = arguments.length,
                    s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i);
                else
                    for (var a = t.length - 1; a >= 0; a--)(o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
                return r > 3 && s && Object.defineProperty(e, n, s), s
            };
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = n(5),
            a = n(4),
            l = n(2),
            c = n(0),
            h = n(9),
            d = function(t) {
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    return e.uconfig = c.gs.uconfig, e.userEntry = a.gameCore.userEntryMan, e.cssColors = c.gs.ucolors.cssColors, e.appConfig = l.AppConfigurator.instance, e.gstates = c.gs.gstates, e.usupport = c.gs.usupport, e.utexts = c.gs.utexts, e.configHub = h.ConfigHub.instance, e.isJapanese = l.AppConfigurator.instance.isJapanese, e
                }
                return o(e, t), e.prototype.optionChanged = function(t, e) {
                    t.item.m.SetValue(e)
                }, e.prototype.checkChanged = function(t) {
                    this.optionChanged(t, t.target.checked)
                }, e.prototype.colorChanged = function(t) {
                    return t.item.SetColor(t.target.value), this.appRoot.update(), !1
                }, e.prototype.mounted = function() {
                    a.gameCore.gameHudModel.configUpdatedProc = this.update.bind(this)
                }, Object.defineProperty(e.prototype, "appRoot", {
                    get: function() {
                        return this.parent.parent
                    },
                    enumerable: !0,
                    configurable: !0
                }), e.prototype.getHotKeyFromKeyEvent = function(t, e) {
                    if (void 0 === e && (e = !1), t.repated) return -2;
                    var n = t.which;
                    if (16 == n || 17 == n || 18 == n || 229 == n) return -2;
                    if (8 == n || 46 == n) return -1;
                    var i = t.keyCode;
                    t.ctrlKey && (i += c.ModificationKeyCode.Ctrl), t.shiftKey && (i += c.ModificationKeyCode.Shift), t.altKey && (i += c.ModificationKeyCode.Alt);
                    var o = this.configHub;
                    return (e ? o.controlEntries.every(function(t) {
                        return t.hotKey != i
                    }) && o.gameDisplayEntries.every(function(t) {
                        return t.toggleHotKey != i
                    }) : o.controlEntries.every(function(t) {
                        return t.hotKey != i
                    }) && o.cellDisplayEntries.every(function(t) {
                        return t.toggleHotKey != i && t.holdHotKey != i
                    }) && o.gameDisplayEntries.every(function(t) {
                        return t.toggleHotKey != i
                    })) ? i : -2
                }, e.prototype.setToggleHotKey_Cells = function(t) {
                    var e = this.getHotKeyFromKeyEvent(t, !0);
                    return -2 != e && t.item.m.SetToggleHotKey(e), t.preventDefault(), !1
                }, e.prototype.setHoldHotKey_Cells = function(t) {
                    var e = this.getHotKeyFromKeyEvent(t, !0);
                    return -2 != e && t.item.m.SetHoldHotKey(e), t.preventDefault(), !1
                }, e.prototype.setToggleHotKey_Game = function(t) {
                    var e = this.getHotKeyFromKeyEvent(t);
                    return -2 != e && t.item.m.SetToggleHotKey(e), t.preventDefault(), !1
                }, e.prototype.setControlHotKey = function(t) {
                    var e = this.getHotKeyFromKeyEvent(t);
                    return -2 != e && t.item.m.SetHotKey(e), t.preventDefault(), !1
                }, e.prototype.onConfigTextInput = function(t) {
                    c.gs.uconfig.SetValue(t.target.name, t.target.value)
                }, e.prototype.onConfigCheckChanged = function(t) {
                    c.gs.uconfig.SetValue(t.target.name, t.target.checked)
                }, e.prototype.rangeInputChanged = function(t) {
                    c.gs.uconfig.SetValue(t.target.name, t.target.value)
                }, e.prototype.onResetButtonCliecked = function() {
                    c.gs.uconfig.RecoverDefaultConfig()
                }, e.prototype.onInputButtonCliecked = function() {
                    const fileUploader = document.querySelector('#input-Button');
                    var data = {};
                    fileUploader.addEventListener('change', (e) => {
                        const reader = new FileReader();
                        reader.addEventListener('loadend', (e) => {
                            const text = e.srcElement.result;
                            data = JSON.parse(text)
                            data.lwga11_user_config && localStorage.setItem("lwga11_user_config",data.lwga11_user_config)
                            data.profileExData && localStorage.setItem("profileExData",data.profileExData)
                            data.lwga_user_entries && localStorage.setItem("lwga_user_entries",data.lwga_user_entries)
                            data.lwga11_color_defs && localStorage.setItem("lwga11_color_defs",data.lwga11_color_defs)
                        });
                        reader.readAsText(e.target.files[0]);
                    });

                },
                e.prototype.onOutputButtonCliecked = function() {
                    var data = {
                        "lwga11_user_config" : localStorage.getItem("lwga11_user_config") ?? "" ,
                        "profileExData" : localStorage.getItem("profileExData") ?? "",
                        "lwga_user_entries" : localStorage.getItem("lwga_user_entries") ?? "",
                        "lwga11_color_defs" : localStorage.getItem("lwga11_color_defs") ?? ""
                    }
                    let dataStr = JSON.stringify(data);
                    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

                    let exportFileDefaultName = 'lwga-config.json';

                    let linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                },    r([s.template(`<main-config-panel>
	<style>
		.panel_content_box{
			height: 632px;
			overflow-y: scroll;
			padding: 10px;
			margin-right: 4px;
		}

		.header_box{
			height: 48px;
			font-size: 24px;
			padding-left: 12px;
			line-height: 48px;
		}

		.content_column{
			width: 380px;
			float: left;
			margin: 0 8px;
		}

		.box_frame{
			border: solid 1px;
			border-radius: 5px;
			margin-bottom: 10px;
		}

		.box_header{
			width: 100%;
			padding-top: 2px;
			padding-left: 5px;
			border-radius: 3px 3px 0 0;
			font-size: 20px;
		}

		.box_content{
			padding: 5px 10px;
		}

		.td_text{
			white-space: nowrap;
			overflow: hidden;
		}

		.range_input{
			width: 140px;
			vertical-align: top;
		}

		td.centered{
			text-align: center;
		}

		.ui_config{
			height: 28px;
		}

		.ui_checkbox{
			width: 18px;
			height: 18px;
			vertical-align: middle;
		}

		.ui_hotkey_input{
			width: 50px;
			border: solid 1px #888;
		}

		.range_table td{
			padding-right: 4px;
			font-size: 15px;
		}

		.reset_button{
			float: right;
			height: 28px;
			padding: 2px;
			font-family: Meiryo, Arial;
			cursor: pointer;
		}
        #configButtons{
            display:flex;
        }
	</style>
	<div class="main_config_panel_root">
		<div class="header_box">
			<span>{utexts.hdrConfiguration}</span>
		</div>
		<div class="panel_content_box">
			<div class='content_column'>
				<div class='box_frame' style='border-color: {cssColors.clPanelForeground}'>
					<div class='box_header' style='background-color: {cssColors.clPanelForeground}; color:{cssColors.clPanelHeader}'>
					　<span style='font-family: IConFont1'>&#xe994</span><span>{utexts.hdrCellDisplay}</span>
					</div>
					<div class='box_content'>
						<table>
							<tr>
								<td colspan='2'></td>
								<td class='centered'>key1</td>
								<td class='centered'>key2</td>
							</tr>
							<tr each={m in configHub.cellDisplayEntries}>
								<td>
									<input type="checkbox" class="ui_config ui_checkbox" checked={m.value} onchange={checkChanged}>
								</td>
								<td>
									<div class='td_text' style='width:220px'>{m.text}</div>
								</td>
								<td>
									<input type="text" class="ui_config ui_hotkey_input" value={m.toggleHotKeyText} onkeydown={setToggleHotKey_Cells} />
								</td>
								<td>
									<input type="text" class="ui_config ui_hotkey_input" value={m.holdHotKeyText} onkeydown={setHoldHotKey_Cells} />
								</td>
							</tr>
						</table>
						<div style='height:5px' />
						<div if={isJapanese}>
							<div>key1:キーを押したときにon/offを反転</div>
							<div>key2:キーを押している間on/offを反転</div>
						</div>
						<div if={!isJapanese}>
							<div>key1:Option inverted when key press</div>
							<div>key2:Option inverted while key hold</div>
						</div>
					</div>
				</div>

				<div class='box_frame' style='border-color: {cssColors.clPanelForeground}'>
					<div class='box_header' style='background-color: {cssColors.clPanelForeground}; color:{cssColors.clPanelHeader}'>
					　<span style='font-family: IConFont1'>&#xe994</span><span>{utexts.hdrGameDisplay}</span>
					</div>
					<div class='box_content'>
						<table>
							<tr>
								<td colspan='2'></td>
								<td if={false}>key1</td>
							</tr>
							<tr each={m in configHub.gameDisplayEntries}>
								<td>
									<input type="checkbox" class="ui_config ui_checkbox" checked={m.value} onchange={checkChanged}>
								</td>
								<td>
									<div class='td_text'>{m.text}</div>
								</td>
								<td if={false}>
									<input type="text" class="ui_config ui_hotkey_input" value={m.toggleHotKeyText} onkeydown={setToggleHotKey_Game} />
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>

			<div class='content_column'>

				<div class='box_frame' style='border-color: {cssColors.clPanelForeground}'>
					<div class='box_header' style='background-color: {cssColors.clPanelForeground}; color:{cssColors.clPanelHeader}'>
					　<span style='font-family: IConFont1'>&#xe994</span><span>{utexts.hdrBasicOperation}</span>
					</div>
					<div class='box_content'>
						<table>
							<tr each={m in configHub.basicBehaviorEntries}>
								<td>
									<input type="checkbox" class="ui_config ui_checkbox" checked={m.value} onchange={checkChanged}>
								</td>
								<td>
									<div class='entry_text'>{m.text}</div>
								</td>
							</tr>
						</table>

						<table class='range_table'>
							<tr>
								<td>{utexts.lbtCameraZoomSpeed}</td>
								<td><input type='range' class='range_input' min='75' max='125' step='1' name='CameraZoomSpeed' value={uconfig.CameraZoomSpeed} oninput={rangeInputChanged}/></td>
								<td style='width:60px'>{uconfig.CameraZoomSpeed}%</td>
							</tr>
							<tr>
								<td>{utexts.lbtCameraMovementSpeed}</td>
								<td><input type='range' class='range_input' min='-25' max='75' step='1' name='CameraMovementSpeed' value={uconfig.CameraMovementSpeed} oninput={rangeInputChanged}/></td>
								<td style='width:60px'>{uconfig.CameraMovementSpeed}</td>
							</tr>
							<tr>
								<td>{utexts.lbtInterpolationType}</td>
								<td><input type='range' class='range_input' min='0.0' max='2.0' step='1.0' name='InterpolationType' value={uconfig.InterpolationType} oninput={rangeInputChanged}/></td>
								<td style='width:60px'>{usupport.InterpolationTypeText}</td>
							</tr>
							<tr>
								<td>{utexts.lbtInterpolationResponce}</td>
								<td><input type='range' class='range_input' min='-0.5' max='1.0' step='0.01' name='InterpolationSpeed' value={uconfig.InterpolationSpeed} oninput={rangeInputChanged}/></td>
								<td style='width:60px'>{usupport.InterpolationSpeedText}</td>
							</tr>
							<tr>
								<td>{utexts.lbtMarkerOpacity}</td>
								<td><input type='range' class='range_input' min='0.0' max='1.0' step='0.01' name='MarkerAlpha' value={uconfig.MarkerAlpha} oninput={rangeInputChanged}/></td>
								<td>{uconfig.MarkerAlpha * 100 >> 0}%</td>
							</tr>
							<td>{utexts.lbtCursorLineThickness}</td>
								<td><input type='range' class='range_input' min='1.0' max='30.0' step='1.0' name='CursorLineThickness' value={uconfig.CursorLineThickness} oninput={rangeInputChanged}/></td>
								<td>{uconfig.CursorLineThickness}px</td>
							</tr>
							<tr if={true}>
							<td>{utexts.lbtPlayerCellsAlpha}</td>
								<td><input type='range' class='range_input' min='0.25' max='1.0' step='0.05' name='PlayerCellsAlpha' value={uconfig.PlayerCellsAlpha} oninput={rangeInputChanged}/></td>
								<td>{uconfig.PlayerCellsAlpha}</td>
							</tr>
							<td>{utexts.lbtPelletCellsAlpha}</td>
								<td><input type='range' class='range_input' min='0.25' max='1.0' step='0.05' name='PelletCellsAlpha' value={uconfig.PelletCellsAlpha} oninput={rangeInputChanged}/></td>
								<td>{uconfig.PelletCellsAlpha}</td>
							</tr>
							<td>{utexts.lbtAnotherSectionCellsAlpha}</td>
								<td><input type='range' class='range_input' min='0.25' max='1.0' step='0.05' name='AnotherSectionCellsAlpha' value={uconfig.AnotherSectionCellsAlpha} oninput={rangeInputChanged}/></td>
								<td>{uconfig.AnotherSectionCellsAlpha}</td>
							</tr>
							<tr if={true}>
							<td>{utexts.lbtRenderQuality}</td>
								<td><input type='range' class='range_input' min='0' max='2' step='1' name='RenderQuality' value={uconfig.RenderQuality} oninput={rangeInputChanged}/></td>
								<td>{usupport.RenderQualityText}</td>
							</tr>
							<tr>
								<td>{utexts.lbtCaptureDuration}</td>
								<td><input type='range' class='range_input' min='0' max='5' step='1' name='QuickCaptureTimeOption' value={uconfig.QuickCaptureTimeOption} oninput={rangeInputChanged}/></td>
								<td>{usupport.QuickCaptureTimeSec}{appConfig.isJapanese ? '秒' : 'sec'}</td>
							</tr>
							<tr>
								<td>{utexts.lbtFrameRate}</td>
								<td><input type='range' class='range_input' min='0' max='4' step='1' name='FrameRateOption' value={uconfig.FrameRateOption} oninput={rangeInputChanged}/></td>
								<td>{usupport.FrameRateText}%</td>
							</tr>
                            <tr>
								<td>{utexts.lbtTextZoom}</td>
								<td><input type='range' class='range_input' min='50' max='150' step='1' name='TextZoom' value={uconfig.TextZoom} oninput={rangeInputChanged}/></td>
								<td>{uconfig.TextZoom}%</td>
							</tr>
						</table>

					</div>
				</div>

				<div class='box_frame' style='border-color: {cssColors.clPanelForeground}'>
					<div class='box_header' style='background-color: {cssColors.clPanelForeground}; color:{cssColors.clPanelHeader}'>
					　<span style='font-family: IConFont1'>&#xe994</span><span>{utexts.hdrControl}</span>
					</div>
					<div class='box_content'>
						<table>
							<tr each={m in configHub.controlEntries}>
								<td>
									<div class='td_text' style='width:220px'>
										{m.text}
									</div>
								</td>
								<td>
									<input type="text" class="ui_config ui_hotkey_input" value={m.hotKeyText} onkeydown={setControlHotKey} />
								</td>
							</tr>
						</table>
					</div>
				</div>
                <div id = 'configButtons'>
                    <input type='file' class='reset_button' id="input-Button" onclick={onInputButtonCliecked} data-target="file-uploader" accept="application/JSON" />
                    <input type='button' class='reset_button' value='{utexts.lbtOutputConfig}' onclick={onOutputButtonCliecked}/>
                    <input type='button' class='reset_button' value='{utexts.lbtResetConfig}' onclick={onResetButtonCliecked} />
                </div>
			</div>
		</div>
	</div>
</main-config-panel>`)], e)
            }(s.Element);
        e.MainConfigPanelTag = d
    }, function(t, e, n) {
        "use strict";
        var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(t, e) {
                    t.__proto__ = e
                } || function(t, e) {
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
                },
                function(t, e) {
                    function n() {
                        this.constructor = t
                    }
                    i(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
                }),
            r = this && this.__decorate || function(t, e, n, i) {
                var o, r = arguments.length,
                    s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i);
                else
                    for (var a = t.length - 1; a >= 0; a--)(o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
                return r > 3 && s && Object.defineProperty(e, n, s), s
            };
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        for (var s = "", a = 32, l = 0; l < a; l++) s += '\n\t\t<div id="skin' + l + '" class="skinbox" onclick={ ChangeSkin }>\n\t\t\t<div class="skinimage" style="background-image: url(\'gr/checker2.png\')"></div>\n\t\t\t<div class="skinimage" style="background-image: url(\'{ userEntry.infos[' + l + '].skinUrl }\')"></div>\n\t\t\t<div class="skin_hover_mask"> { userEntry.infos[' + l + "].name } </div>\n\t\t</div>";
        var c = n(5),
            h = n(4),
            l = n(2),
            d = n(0),
            u = function(t) {
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    return e.uconfig = d.gs.uconfig, e.cssColors = d.gs.ucolors.cssColors, e.siteTitle = l.AppConfigurator.instance.siteTitleString, e.appConfig = l.AppConfigurator.instance, e.userEntry = h.gameCore.userEntryMan, e.selectedTabName = "home", e
                }
                return o(e, t), e.prototype.selectTab = function(t) {
                    this.selectedTabName = t
                }, e.prototype.isActive = function(t) {
                    return t == this.selectedTabName
                }, e.prototype.mounted = function() {
                    this.userEntry.indexChangedProc2 = this.update.bind(this), this.userEntry.skinChangedProc2 = this.update.bind(this), d.gs.uconfig.RegisterChangedProc("panelBackImageUri", this.update.bind(this)), d.gs.uconfig.RegisterChangedProc("panelBackImageAlpha", this.update.bind(this)), h.gameCore.gameHudModel.serverInstructionProc = this.setServerInstructionText.bind(this)
                }, e.prototype.ChangeSkin = function(t) {
                    h.gameCore.userEntryMan.ChangeIndex(parseInt(t.currentTarget.id.replace("skin", ""), 10))
                }, e.prototype.setServerInstructionText = function(t) {
                    this.refs.server_instruction_box.innerHTML = t
                }, r([c.template('\n<main-panel>\n\t<style>\n\n\t\t.skinbox:hover .skin_hover_mask {padding-top: 0px;opacity: 1; transition:all 0.4s ease;}\n\t.skin_hover_mask{padding-top: 30px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-align:center;vertical-align:middle;border-radius: 50%;font-size: 6px;width: 50px;height: 50px;position: absolute;z-index:1000;background: rgba(0,0,0,0.5);opacity: 0;color: #fff;display: flex;align-items: center;text-align: center;}.skinbox.skin_hover_mask {opacity: 1;transition:all 0.6s ease;}\n\t.parea{\n\t\t\tborder: solid 1px rgba(255,255,255,1);\n\t\t\tmargin: 4px;\n\t\t\tborder-radius: 4px;\n\t\t}\n\n\t\t.main_panel_root{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t}\n\n\t\t.main_floating_panel{\n\t\t\twidth: 864px;\n\t\t\theight: 698px;\n\t\t\toverflow: hidden;\n\t\t\tposition: absolute;\n\t\t\ttop: 45px;\n\t\t\tleft: 0;\n\t\t\tright: 0;\n\t\t\tbottom: 0;\n\t\t\tmargin: auto;\n\t\t}\n\n\t\t.site_header_area{\n\t\t\theight: 180px;\n\t\t}\n\n\t\t.site_title_text{\n\t\t\tfont-size: 44px;\n\t\t\tfont-family: CustomFont2;\n\t\t}\n\t\t\n\t\t.left_side_panel{\n\t\t\tfloat: left;\n\t\t\theight: 500px;\n\t\t\twidth: 240px;\t\n\t\t}\n\t\t\n\t\t.right_side_panel{\n\t\t\tfloat: right;\n\t\t\twidth: 240px;\n\t\t\theight: 500px;\n\t\t}\n\n\t\t.panel_center_content{\n\t\t\twidth: 360px;\n\t\t\theight: 500px;\n\t\t\tpadding: 12px 20px;\n\t\t\tfloat: left;\n\t\t}\n\n\t\t.whole_area{\n\t\t\theight: 688px;\n\t\t}\n\n\t\t.site_header_area{\n\t\t\tpadding-left: 8px;\n\t\t}\n\n\t\t.server_instruction_box{\n\t\t\tuser-select: text;\n\t\t}\n\n\t\t.main_panel_back{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t}\n\n\t\t.panel_back_box {\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\t_-webkit-clip-path: url(#svgPath);\n\t\t\t_clip-path: url(#svgPath);\n\t\t}\n\t\t\n\t\t.panel_back_img_layer{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tbackground-size: cover;\n\t\t}\n\n\t\t.panel_front_box{\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t}\n\n\t\t.panel_front_box_inner{\n\t\t\tposition: relative;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t}\n\n\t\t.panel_front_box_content{\n\t\t}\n\n\t\t.panel_mask_svg{\n\t\t\theight: 0;\n\t\t}\n\n\t\t.ui_common{\n\t\t\theight: 38px;\n\t\t\tfont-size: 18px;\n\t\t\tfont-family: メイリオ, Arial;\n\t\t}\n\n\t\t.ui_text_box{\n\t\t\tpadding-left: 4px;\n\t\t}\n\n\t\t.panel_navi_box{\n\t\t\tposition: absolute;\n\t\t\ttop: 6px;\n\t\t\tright: 10px;\n\t\t\tuser-select: none;\n\t\t}\n\n\t\t.navi{\n\n\t\t}\n\t\t\n\t\t.navi > div{\n\t\t\tdisplay: inline-block;\n\t\t\twidth: 70px;\n\t\t\theight: 38px;\n\t\t\tbackground-color: #08F;\n\t\t\tborder-radius: 3px;\n\t\t\tposition: relative;\n\t\t\tcursor: pointer;\n\t\t\tfont-family: \'IconFont1\';\n\t\t\ttext-align: center;\n\t\t\tfont-size: 28px;\n\t\t\tline-height: 38px;\n\t\t}\n\t\t\n\t\t.navi > div.selected{\n\t\t\tbackground-color: #04F;\n\t\t}\n\t</style>\n\t<div class="main_panel_root" style="color: {cssColors.clPanelForeground}">\n\t\t<div class="main_panel_back" style="background-color: {cssColors.clOverlayBack};" />\n\n\t\t<div class="main_floating_panel">\n\t\t\t<div class="panel_back_box" \n\t\t\t\tstyle="background-color: {cssColors.clMainPanelBack}; clip-path: url({isActive(\'home\') ? \'#svgPath\' : \'#svgPath2\'})">\n\t\t\t\t<div class="panel_back_img_layer" \n\t\t\t\t\tstyle="background-image: url(\'{uconfig.panelBackImageUri}\'); opacity: {uconfig.panelBackImageAlpha}">\n\t\t\t\t</div>\n\n\t\t\t\t<svg version="1.1" x="0px" y="0px" viewBox="0 0 864 690" class="panel_mask_svg">\n\t\t\t\t\t<clipPath id="svgPath">\n\t\t\t\t\t\t<rect x="5" y="5" width="855" height="179" rx="4" ry="4"/>\n\t\t\t\t\t\t<rect x="5" y="193" width="239" height="499" rx="4" ry="4"/>\n\t\t\t\t\t\t<rect x="253" y="193" width="359" height="499" rx="4" ry="4"/>\n\t\t\t\t\t\t<rect x="621" y="193" width="239" height="499" rx="4" ry="4"/>\n\t\t\t\t\t</clipPath>\n\n\t\t\t\t\t<clipPath id="svgPath2">\n\t\t\t\t\t\t<rect x="5" y="5" width="855" height="687" rx="4" ry="4"/>\n\t\t\t\t\t</clipPath>\n\t\t\t\t</svg>\n\t\t\t</div>\n\n\n\t\t\t<div class="panel_front_box">\n\t\t\t\t<div class="panel_front_box_inner">\n\t\t\t\t\t<div class="panel_front_box_content">\n\t\t\t\t\t\t<div show={isActive(\'home\')}>\n\t\t\t\t\t\t\t<div class="site_header_area parea" style="border-color: {cssColors.clPanelForeground}">\n\t\t\t\t\t\t\t\t<div class="site_title_text">{siteTitle}</div>\n\t\t\t\t\t\t\t\t<div class=\'server_instruction_box\' ref="server_instruction_box" />\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="left_side_panel parea" style="border-color: {cssColors.clPanelForeground}">\n\t\t\t\t\t\t\t\t<left-config-panel />\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="panel_center_content parea" style="border-color: {cssColors.clPanelForeground}">\n\t\t\t\t\t\t\t\t<user-entry-panel />\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="right_side_panel parea" style="border-color: {cssColors.clPanelForeground}">\n\t\t\t\t\t\t\t\t<server-list-root if={appConfig.useIxTrackerServer} />\n\t\t\t\t\t\t\t\t<skin-list-root if={!appConfig.useIxTrackerServer}>\n\t<style>\n\t\t.right_skin_panel_root{\n\t\t\tpadding: 5px 3px;\n\t\t\theight: 100%;\n\t\t\tposition: relative;\n\t\t}\n\t\t.right_panel_ui_outer{\n\t\t\tdisplay: flex;\n\t\t\tflex-wrap: wrap;\n\t\t}\n\t\t.skinbox{\n\t\t\twidth:50px;\n\t\t\theight:50px;\n\t\t\tmargin:4px;\n\t\t\tcursor:pointer;\n\t\t}\n\t\t.skinimage{\n\t\t\tposition: absolute;\n\t\t\twidth: 50px;\n\t\t\theight: 50px;\n\t\t\tbackground-size: cover;\n\t\t\tbackground-position: center center;\n\t\t\tborder-radius: 50%;\n\t\t}\n\t</style>\n\n<div class="right_skin_panel_root">\n\t<div style="display: flex;flex-wrap: wrap;" class="right">' + s + '\n\t</div>\n</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="clear_both" />\n\t\t\t\t\t\t</div>\n\n\n\t\t\t\t\t\t<div show={isActive(\'settings\')}>\n\t\t\t\t\t\t\t<div class="whole_area parea" style="border-color: {cssColors.clPanelForeground}">\n\t\t\t\t\t\t\t\t<main-config-panel />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div show={isActive(\'theme\')}>\n\t\t\t\t\t\t\t<div class="whole_area parea" style="border-color: {cssColors.clPanelForeground}">\n\t\t\t\t\t\t\t\t<color-config-panel />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="panel_navi_box">\n\t\t\t\t\t\t<div class="navi" style="color: {cssColors.clUiSymbols}">\n\t\t\t\t\t\t\t<div onclick={selectTab.bind(this, \'home\')} style="background-color: {cssColors.clMenuButtons}">&#xe900</div>\n\t\t\t\t\t\t\t<div onclick={selectTab.bind(this, \'settings\')} style="background-color: {cssColors.clMenuButtons}">&#xe994</div>\n\t\t\t\t\t\t\t<div onclick={selectTab.bind(this, \'theme\')} style="background-color: {cssColors.clMenuButtons}">&#xe90d</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t</div>\n\t</div>\n</main-panel>')], e)
            }(c.Element);
        e.MainPanelTag = u
    }, function(t, e, n) {
        "use strict";
        var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(t, e) {
                    t.__proto__ = e
                } || function(t, e) {
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
                },
                function(t, e) {
                    function n() {
                        this.constructor = t
                    }
                    i(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
                }),
            r = this && this.__decorate || function(t, e, n, i) {
                var o, r = arguments.length,
                    s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i);
                else
                    for (var a = t.length - 1; a >= 0; a--)(o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
                return r > 3 && s && Object.defineProperty(e, n, s), s
            };
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = n(5),
            a = n(4),
            l = function(t) {
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    return e.model = a.gameCore.serverListModel, e
                }
                return o(e, t), e.prototype.mounted = function() {
                    this.model.Notify = this.update.bind(this)
                }, e.prototype.onServerEntryClicked = function(t) {
                    this.model.ConnectToServer(t.item.info)
                }, r([s.template("\n<server-list-root>\n\t<style>\n\t\tul, li{\n\t\t\tlist-style:none;\n\t\t}\n\t\t\n\t\t.base{\n\t\t\twidth: 210px;\n\t\t\theight: 470px;\n\t\t\toverflow-y: scroll;\n\t\t\toverflow-x: hidden;\n\t\t\tmargin: 10px auto;\n\t\t}\n\t\t\n\t\t.inner{\n\t\t\tposition: absolute;\n\t\t\twidth: 100%;\n\t\t\tpadding: 6px;\n\t\t\toverflow: hidden;\n\t\t}\n\t\t\n\t\t.card0{\n\t\t\tborder: solid 2px #F60;\n\t\t\tbackground-color: #F7A;\n\t\t\tborder-color: #F39;\n\t\t\twidth: 190px;\n\t\t\theight: 62px;\n\t\t\tmargin-bottom: 4px;\n\t\t\tposition: relative;\n\t\t\tcolor: #FFF;\n\t\t\tfont-family: arial;\n\t\t}\n\n\t\t.card_selected{\n\t\t\tbackground-color: #F06;\n\t\t\tborder-color: #D04;\n\t\t}\n\t\t\n\t\t.cover{\n\t\t\tposition: absolute;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.cover:hover{\n\t\t\tbackground-color: rgba(255, 0, 128, 0.2);\n\t\t}\n\t\t\n\t\t.serverName{\n\t\t\tfont-size: 26px;\n\t\t\tline-height: 26px;\n\t\t}\n\n\t\t.infoPart{\n\t\t\tfont-size: 18px;\n\t\t\toverflow: none;\n\t\t}\n\n\t\t.info_region{\n\t\t\tfloat: left;\n\t\t\twidth: 100px;\n\t\t}\n\t\t\n\t\t.info_users{\n\t\t\tfloat: right;\n\t\t}\n\t</style>\n\n\t<div class=\"base\">\n\t\t<ul>\n\t\t\t<li each = {info in model.serverInfos} >\n\t\t\t\t<div class= {card0: true, card_selected: info && info.address == model.currentServerUri } \n\t\t\t\t\tonclick= {onServerEntryClicked}>\n\t\t\t\t\t<div class='inner'>\n\t\t\t\t\t\t<div class='serverName'>\n\t\t\t\t\t\t\t{info.modName}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class='infoPart'>\n\t\t\t\t\t\t\t<div class='info_region'>\n\t\t\t\t\t\t\t\t{info.region}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class='info_users'>\n\t\t\t\t\t\t\t{info.numClients} / {info.numMaxClients}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class='clear_both'></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class='cover'></div>\n\t\t\t</li>\n\t\t</ul>\n\t<div />\n</server-list-root>\n")], e)
            }(s.Element);
        e.ServerListRootTag = l
    }, function(t, e, n) {
        "use strict";
        var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(t, e) {
                    t.__proto__ = e
                } || function(t, e) {
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
                },
                function(t, e) {
                    function n() {
                        this.constructor = t
                    }
                    i(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
                }),
            r = this && this.__decorate || function(t, e, n, i) {
                var o, r = arguments.length,
                    s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i);
                else
                    for (var a = t.length - 1; a >= 0; a--)(o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
                return r > 3 && s && Object.defineProperty(e, n, s), s
            };
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = n(5),
            a = n(0),
            l = n(4),
            c = n(2),
            h = function(t) {
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    return e.uconfig = a.gs.uconfig, e.userEntry = l.gameCore.userEntryMan, e.cssColors = a.gs.ucolors.cssColors, e.appConfig = c.AppConfigurator.instance, e
                }
                return o(e, t), Object.defineProperty(e.prototype, "isDualUi", {
                    get: function() {
                        return a.gs.gconfig.ShowDualSkinInputUi
                    },
                    enumerable: !0,
                    configurable: !0
                }), e.prototype.mounted = function() {
                    this.userEntry.indexChangedProc = this.update.bind(this)
                }, e.prototype.inputText = function(t) {
                    this.userEntry.SetProp(t.target.name, t.target.value)
                }, e.prototype.startPlay = function() {
                    l.gameCore.StartPlay()
                }, e.prototype.startSpectate = function() {
                    l.gameCore.StartSpectate()
                }, r([s.template('\n<user-entry-panel>\n\t<style>\n\t\t.main_ui_area{\n\t\t\twidth: 300px;\n\t\t\tmargin: 0 auto;\n\t\t}\n\t\t.ui_main_button{\n\t\t\t_background-color: #F08;\n\t\t\t_color: #FFF;\n\t\t\tborder-radius: 4px;\n\t\t\tborder: none;\n\t\t\tmargin: 2px 0;\n\t\t\tposition: relative;\n\t\t\tcursor: pointer;\n\n\t\t\twidth: 147px;\n\t\t\tfloat: left;\n\t\t\tvertical-align: middle;\n\t\t}\n\n\t\t.ui_main_button > .button_symbol{\n\t\t\tfont-family: \'IconFont1\';\n\t\t\ttext-align: center;\n\t\t\tfont-size: 24px;\n\t\t\tline-height: 38px;\n\t\t\tdisplay: inline-block;\n\t\t}\n\n\t\t.ui_main_button > .button_text{\n\t\t\tfont-family: \'CustomFont1\';\n\t\t\tfont-size: 22px;\n\t\t\tdisplay: inline-block;\n\t\t\tline-height: 38px;\n\t\t\tvertical-align: top;\n\t\t}\n\n\t\t.ui_text_box{\n\t\t\tmargin: 2px 0;\n\t\t}\n\t\t\n\t\t.ui_full_width{\n\t\t\twidth: 300px;\n\t\t}\n\t\t\n\t\t.ui_team_input{\n\t\t\twidth: 90px;\n\t\t\tfloat: left;\n\t\t}\n\n\t\t.ui_name_input{\n\t\t\twidth: 206px;\n\t\t}\n\n\t\t.player_entry_info_area{\n\t\t}\n\n\t\t.main_buttons_area{\n\t\t\tpadding: 4px 0;\n\t\t}\n\n\t\t\n\n\t</style>\n\t<div class="panel_tab_content">\n\t\t<div>\n\t\t\t<div style=\'height: 25px\' />\n\n\t\t\t<div class="main_ui_area">\n\t\t\t\t<div class="player_entry_info_area">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input type="text" class="ui_common ui_text_box ui_team_input"\n\t\t\t\t\t\t\tref="ui_text_team" name="team" placeholder="team" value="{userEntry.curInfo.team}" oninput={inputText}>\t\n\t\t\t\t\t\t<div style="width:4px; height: 1px; float: left" />\n\t\t\t\t\t\t<input type="text" class="ui_common ui_text_box ui_name_input" ref="ui_text_name"\n\t\t\t\t\t\t\tname="name" placeholder="name" value={userEntry.curInfo.name} oninput={inputText}>\t\n\t\t\t\t\t\t<div class="clear_both"></div>\n\t\t\n\t\t\t\t\t\t<input type="text" class="ui_common ui_text_box ui_full_width" ref="ui_text_skin_url"\n\t\t\t\t\t\t\tname="skinUrl" placeholder="skin url" value={userEntry.curInfo.skinUrl} onchange={inputText}>\t\n\t\t\t\t\t\t<input type="text" class="ui_common ui_text_box ui_full_width" ref="ui_text_skin_url2"\n\t\t\t\t\t\t\tname="skinUrl2" placeholder="skin url 2" value={userEntry.curInfo.skinUrl2} onchange={inputText}\n\t\t\t\t\t\t\tshow={isDualUi}>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class="clear_both"></div>\n\n\t\t\t\t<div class="main_buttons_area">\n\t\t\t\t\t<button class="ui_common ui_main_button ui_half_width" id="ui_button_play" onclick={startPlay}\n\t\t\t\t\t\tstyle="background-color: {cssColors.clMainButtons}; color:{cssColors.clUiSymbols}" >\n\t\t\t\t\t\t<div class="button_symbol">&#xe9a5;</div>\n\t\t\t\t\t\t<div class="button_text">PLAY</div>\n\t\t\t\t\t</button>\n\t\t\t\t\t<div style="width:6px; height: 1px; float: left" />\n\t\t\t\t\t<button class="ui_common ui_main_button ui_half_width" id="ui_button_spec" onclick={startSpectate}\n\t\t\t\t\t\tstyle="background-color: {cssColors.clMainButtons}; color:{cssColors.clUiSymbols}"">\n\t\t\t\t\t\t<div class="button_symbol">&#xe985;</div>\n\t\t\t\t\t\t<div class="button_text">SPEC</div>\n\t\t\t\t\t</button>\n\t\t\t\t\t<div class="clear_both"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t\n\t\t</div>\n\t</div>\n</user-entry-panel>\n')], e)
            }(s.Element);
        e.UserEntryPanelTag = h
    }, function(t, e, n) {
        "use strict";
        var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(t, e) {
                    t.__proto__ = e
                } || function(t, e) {
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
                },
                function(t, e) {
                    function n() {
                        this.constructor = t
                    }
                    i(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
                }),
            r = this && this.__decorate || function(t, e, n, i) {
                var o, r = arguments.length,
                    s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i);
                else
                    for (var a = t.length - 1; a >= 0; a--)(o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
                return r > 3 && s && Object.defineProperty(e, n, s), s
            };
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = n(5),
            a = n(0),
            l = n(4),
            c = n(2),
            h = function(t) {
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    const n = JSON.parse(localStorage.getItem("hideInfo"));
                    return n instanceof Array ? (tcfg.HidePartyCode = n[0], tcfg.HideUserSig = n[1]) : localStorage.setItem("hideInfo", JSON.stringify([0, 0])), e.gconfig = a.gs.gconfig, e.userEntry = l.gameCore.userEntryMan, e.uconfig = a.gs.uconfig, e.cssColors = a.gs.ucolors.cssColors, e.appConfig = c.AppConfigurator.instance, e
                }
                return o(e, t), Object.defineProperty(e.prototype, "isDualUi", {
                    get: function() {
                        return a.gs.gconfig.ShowDualSkinInputUi
                    },
                    enumerable: !0,
                    configurable: !0
                }), e.prototype.tcfg = tcfg, e.prototype.mounted = function() {
                    this.userEntry.skinChangedProc = this.update.bind(this)
                }, e.prototype.inputText = function(t) {
                    this.userEntry.SetProp(t.target.name, t.target.value)
                }, e.prototype.hideCode = function() {
                    var t = document.getElementsByClassName("code_cover")[0];
                    const e = "" == t.style.display;
                    t.style.display = e ? "none" : "", tcfg.HidePartyCode = !e, localStorage.setItem("hideInfo", JSON.stringify([tcfg.HidePartyCode, tcfg.HideUserSig]))
                }, e.prototype.hideUsig = function() {
                    var t = document.getElementsByClassName("usig_cover")[0];
                    const e = "" == t.style.display;
                    t.style.display = e ? "none" : "", tcfg.HideUserSig = !e, localStorage.setItem("hideInfo", JSON.stringify([tcfg.HidePartyCode, tcfg.HideUserSig]))
                }, e.prototype.onArrowButton = function(t) {
                    var e = "arrow_left" == t.target.id ? -1 : 1;
                    l.gameCore.userEntryMan.ShiftIndex(e)
                }, e.prototype.onBenchButton = function() {
                    l.gameCore.ToggleBenchMarkMode()
                }, r([s.template('\n<left-config-panel>\n\t<style>\n\t\t.left_config_panel_root{\n\t\t\tpadding: 5px 10px;\n\t\t\theight: 100%;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.left_input_ui_outer{\n\t\t\twidth: 168px;\n\t\t\tmargin: 0 auto;\n\t\t}\n\t\t\n\t\t.bottom_box{\n\t\t\tposition: absolute;\n\t\t\tleft: 15px;\n\t\t\tbottom: 5px;\n\t\t}\n\n\t\t.side_ad_area{\n\t\t\twidth: 200px;\n\t\t\theight: 200px;\n\t\t\tbackground-color: white;\n\t\t\tmargin: 10px 0;\n\t\t}\n\n\t\t.skin_preview_box{\n\t\t\tposition: relative;\n\t\t\twidth: 100px;\n\t\t\theight: 100px;\n\t\t\tmargin: 10px auto;\n\t\t}\n\t\n\t\t.skin_cell{\n\t\t\tposition: absolute;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tbackground-size: cover;\n\t\t\tbackground-position: center center;\n\t\t\tborder-radius: 50%;\n\t\t}\n\n\t\t.code_text_box_outer{\n\t\t\twidth: 100px;\n\t\t\tmargin: 0 auto;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.code_cover{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tbackground-color: #666;\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tline-height: 36px;\n\t\t\tpadding-left: 6px;\n\t\t}\n\n\t\t#ui_text_code{\n\t\t\twidth: 100%;\n\t\t}\n\n\t\t.usig_text_box_outer{\n\t\t\twidth: 100px;\n\t\t\tmargin: 0 auto;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.usig_cover{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tbackground-color: #666;\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tline-height: 36px;\n\t\t\tpadding-left: 6px;\n\t\t}\n\n\t\t#ui_text_usig{\n\t\t\twidth: 100%;\n\t\t}\n\n\t\t.arrows{\n\t\t\tfont-family: \'IconFont1\';\n\t\t\t_margin: 0 15px;\n\t\t\tmargin-top: 30px;\n\t\t\tfont-size: 28px;\n\t\t\tcursor: pointer;\n\t\t\tuser-select: none;\n\t\t}\n\n\t\t.arrow_left{\n\t\t\tfloat: left;\n\t\t}\n\n\t\t.arrow_right{\n\t\t\tfloat: right;\n\t\t}\n\n\t\t.bench_button{\n\t\t\tfont-family: IconFont1;\n\t\t\twidth: 44px;\n\t\t\theight: 36px;\n\t\t\tline-height: 36px;\n\t\t\tfont-size: 28px;\n\t\t\tborder-radius: 4px;\n\t\t\ttext-align: center;\n\t\t\tcursor: pointer;\n\t\t\tdisplay: inline-block;\n\t\t}\n\n\t\t.version_str{\n\t\t\tfont-family: CustomFont1;\n\t\t\tfont-size: 22px;\n\t\t\tdisplay: inline-block;\n\t\t\tvertical-align: middle;\n\t\t\tmargin-left: 30px;\n\t\t\tmargin-bottom: 12px;\n\t\t}\n\n\t\ta{\n\t\t\tcolor: white;\n\t\t}\n\t\ta:visited{\n\t\t\tcolor: white;\n\t\t}\n\n\t\t.lbar_notes{\n\t\t\tfont-size: 12px;\n\t\t\tmargin-bottom: 20px;\n\t\t}\n\t</style>\n\t<div class="left_config_panel_root">\n\n\t\t<div style="height:20px" show={!isDualUi} />\n\n\t\t<div class="left_input_ui_outer">\n\n\t\t\t<div class="arrows arrow_left" id="arrow_left" onmousedown={onArrowButton}>\n\t\t\t\t◀\n\t\t\t</div>\n\n\t\t\t<div class="arrows arrow_right" id="arrow_right" onmousedown={onArrowButton}>\n\t\t\t\t▶\n\t\t\t</div>\n\n\t\t\t<div class="skin_preview_box">\n\t\t\t\t<div class="skin_cell" style="background-image: url(\'gr/checker2.png\')" />\n\t\t\t\t<div class="skin_cell" style="background-image: url({userEntry.curInfo.skinUrl})" />\n\t\t\t</div>\n\n\t\t\t<div class="clear_both" />\n\n\t\t\t<div class="skin_preview_box" show={isDualUi}>\n\t\t\t\t<div class="skin_cell" style="background-image: url(\'gr/checker2.png\')" />\n\t\t\t\t<div class="skin_cell" style="background-image: url({userEntry.curInfo.skinUrl})" />\n\t\t\t</div>\n\n\t\t\t<div class="code_text_box_outer" show={gconfig.ShowPartyCodeInputUi}>\n\t\t\t\t<input type="text"  class="ui_common ui_text_box"  \n\t\t\t\t\tid="ui_text_code" name="code" placeholder="Code" value="{userEntry.curInfo.code}" oninput={inputText}>\n\t\t\t\t<div class="code_cover" show={tcfg.HidePartyCode}>\n\t\t\t\t\t&#x1F512;\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<button class="ui_common ui_main_button ui_half_width" id="ui_button_hide_code" onclick={hideCode} style="padding: 0 10px; position: relative; left: 140px; bottom: 38px;">👁</button>\n\n\t\t\t<div class="usig_text_box_outer" show={gconfig.ShowPartyCodeInputUi}>\n\t\t\t\t<input type="text"  class="ui_common ui_text_box"  \n\t\t\t\t\tid="ui_text_usig" name="usig" placeholder="User sig" value="{userEntry.curInfo.usig}" oninput={inputText}>\n\t\t\t\t<div class="usig_cover" show={tcfg.HideUserSig}>\n\t\t\t\t\t&#x1F512;\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<button class="ui_common ui_main_button ui_half_width" id="ui_button_hide_usig" onclick={hideUsig} style="padding: 0 10px; position: relative; left: 140px; bottom: 38px;">👁</button>\n\n\t\t\t<div show={appConfig.targetSite == \'ix\'}>\n\t\t\t\t<div style="height: 20px" />\n\t\t\t\t<a href="http://ixagar.net/classic">old version</a>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class="bottom_box">\n\n\t\t\t<div class=\'lbar_notes\'>\n\t\t\t\t<div if={appConfig.isJapanese}>\n\t\t\t\t\tnote: スキンがエラーで表示されない場合、imgurを使ってください。また、スキンの縦横のピクセル数を1000x1000以下にしてください。gyazoの画像は非対応になりました。\n\t\t\t\t</div>\n\t\t\t\t<div if={!appConfig.isJapanese}>\n\t\t\t\t\tnote: please use imgur if your skin is not shown by error. Also it noted that the pixel size of skins should be less than 1000x1000.\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class="bench_button" style="background-color: {cssColors.clMainButtons}; color: {cssColors.clUiSymbols}"\n\t\t\t\tonclick={onBenchButton}>\n\t\t\t\t&#xe90f;\n\t\t\t</div>\n\n\t\t\t<div class="version_str">\n\t\t\t\tLWGA-1.1\n\t\t\t</div>\n\t\t</div>\n\n\t</div>\n</left-config-panel>\n')], e)
            }(s.Element);
        e.LeftConfigPanelTag = h
    }, function(t, e, n) {
        "use strict";
        var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(t, e) {
                    t.__proto__ = e
                } || function(t, e) {
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
                },
                function(t, e) {
                    function n() {
                        this.constructor = t
                    }
                    i(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
                }),
            r = this && this.__decorate || function(t, e, n, i) {
                var o, r = arguments.length,
                    s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i);
                else
                    for (var a = t.length - 1; a >= 0; a--)(o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
                return r > 3 && s && Object.defineProperty(e, n, s), s
            };
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = n(5),
            a = n(0),
            l = n(4),
            c = (function(t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                o(e, t), e.prototype.mounted = function() {
                    this.root.innerHTML = this.opts.content
                }, e = r([s.template("<raw><div></div></raw>")], e)
            }(s.Element), function(t) {
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    return e.model = l.gameCore.gameHudModel, e.perfModel = l.gameCore.perfModel, e.gconfig = a.gs.gconfig, e.uconfig = a.gs.uconfig, e.gstates = a.gs.gstates, e.cssColors = a.gs.ucolors.cssColors, e.chatInputBoxVisible = !1, e.hasNewPrivateMessage = !1, e.prevChatMessagesCount = -1, e
                }
                return o(e, t), e.prototype.mounted = function() {
                    var t = this,
                        e = this.refs.lb_chart_outer,
                        n = this.refs.lb_chart_canvas;
                    n.width = 160, n.height = 160, e.style.width = "160px", e.style.height = "160px";
                    var i = this.refs.map_outer,
                        o = this.refs.map_canvas,
                        r = 300;
                    o.width = r, o.height = r, i.style.width = r + "px", i.style.height = r + "px", window.addEventListener("keydown", function(e) {
                        if (!e.repeat && 13 == e.keyCode) {
                            var n = t.refs.chat_input_text_box;
                            if (t.chatInputBoxVisible) {
                                var i = n.value;
                                n.value = "", t.chatInputBoxVisible = !1, i ? l.gameCore.SendChatMessage(i) : t.update()
                            } else {
                                var o = document.activeElement;
                                if (o && "INPUT" == o.tagName) return void o.blur();
                                t.chatInputBoxVisible = !0, t.update(), n.focus()
                            }
                        }
                    }), setInterval(this.UpdationProc.bind(this), 17);
                    var s = this.refs.overlay_base,
                        r = this.refs.chat_view,
                        a = this.refs.chat_input_box,
                        c = !1;

                    function h(t) {
                        r.style.userSelect = t ? "text" : "none"
                    }
                    r.onmouseenter = function() {
                        c = !0
                    }, r.onmouseleave = function() {
                        c = !1
                    };
                    var d = !1;
                    a.onmouseenter = function() {
                        d = !0
                    }, a.onmouseleave = function() {
                        d = !1
                    }, s.onmousedown = function() {
                        c && h(!0)
                    }, s.onmouseup = function() {
                        c || d || (window.getSelection().removeAllRanges(), h(!1))
                    }
                }, e.prototype.UpdationProc = function() {
                    this.model.isHudUpdated && (this.model.isHudUpdated = !1, this.update(), this.model.chatMessages.length != this.prevChatMessagesCount && (this.prevChatMessagesCount = this.model.chatMessages.length, this.scrollChatViewToEnd()))
                }, e.prototype.scrollChatViewToEnd = function() {
                    var t = this.refs.chat_view;
                    t.scrollTop = t.scrollHeight
                }, r([s.template(`<game-overlay>
	<style>

		.overlay_base{
			_user-select: none;
		}

		.game_control_overlay{
			_user-select: none;
		}

		.chat_view{
			width: 300px;
			height: 250px;
			background-color: rgba(255, 255, 255, 0.3);
			border-radius: 4px;
			position: absolute;
			top: 70px;
			left: 10px;
			overflow-y: scroll;
			overflow-x: none;
			font-size: 14px;
			resize: both;
			padding: 3px;
			word-wrap: break-word;
			user-select: none;
		}

		.chat_view::-webkit-scrollbar{
			width: 8px;
			/*background: rgba(224,224,224, 0.5);*/
		}

		.chat_view::-webkit-scrollbar-thumb{
			background-color: rgba(128,128,128,0.5);
		}

		.chat_view::-webkit-scrollbar-corner {
			background-color: none;
		}

		.chat_view::-webkit-resizer {
			background-color: rgba(64,64,64,0.5);
		}

		.message_time_stamp{
			color: #AAA;
			font-size: 13px;
		}

		.message_sender_name{
			color: #FF0;
		}

		.bottom_area{
			width: 100%;
			position: absolute;
			bottom: 0;
		}
		.chat_input_area{
			width: 360px;
			height: 40px;
			background-color: rgba(200, 200, 200, 0.5);
			border-radius: 4px;
			margin: 0 auto 50px;
		}

		#chat_input_text_box{
			width: 100%;
			height: 100%;
			background-color: none;
			border: none;
			font-size: 16px;
			padding-left: 6px;
		}

		#chat_input_text_box:focus{
			outline: 0;
		}

		.server_client_status_area{
			position: absolute;
			left: 10px;
			bottom: 6px;
			font-size: 14px;
		}

		#server_user_num_text{
			position: absolute;
			top: 6px;
			left: 60px;
			font-size: 15px;
		}

		.self_state_info{
			position: absolute;
			top: 40px;
			left: 10px;
			font-size: 22px;
			font-family: CustomFont1;
		}

		.self_state_info > div{
			display: inline-block;
			margin-right: 10px;
		}

		#self_score_text{

		}

		#server_display_message{
			position: absolute;
			top: 50px;
			width: 100%;
			font-size: 15px;
			text-align: center;
			color: #FF0;
			font-size: 32px;
		}

		.benchmark_mode_message_outer{
			position: absolute;
			top: 70px;
			width: 100%;
		}

		.benchmark_mode_message{
			margin: 0 auto;
			width: 600px;
			font-size: 15px;
			text-align: center;
			font-size: 32px;
			color: #0F0;
			font-family: CustomFont1;
			background-color: rgba(0, 0, 0, 0.7);
			padding: 5px;
		}

		.leaderboard_outer{
			position: absolute;
			top: 10px;
			right: 10px;
		}

		.leaderboard_inner{
			width: 300px;
			padding: 8px;
			border-radius: 4px;
		}

		.lb_header{
			font-family: 'CustomFont1';
			font-size: 22px;
			text-align: center;
		}

		.lb_header_large{
			font-size: 26px;
		}

		.lb_detail{
		}

		.lb_entry{
			font-family: CustomFont1, Meiryo, Arial;
			font-size: 15px;
			height: 20px;
			overflow: hidden;
			text-align: center;
		}

		#lb_chart_outer{
			margin: 5px auto 0;
		}

		#lb_chart_canvas{
			opacity: 0.8;
		}

		#map_outer{
			position: absolute;
			right: 10px;
			bottom: 10px;
		}

		#teamInfo{
			position: absolute;
			right: 320px;
			bottom: 10px;
		display: flex;
		flex-direction: column;
		}

		#map_canvas{
			_background-color: rgba(0, 0, 0, 0.3);
		}

		hr{
			height: 8px;
			border: none;
		}

		.spec_target_info{
			position: absolute;
			top: 60px;
			width: 100%;
			font-size: 22px;
			text-align: center;
			font-family: CustomFont1, Meiryo;
		}

		#notify_log::-webkit-scrollbar{
			width: 8px;
		}

		#notify_log::-webkit-scrollbar-thumb{
			background-color: rgba(128,128,128,0.5);
		}

		#notify_logw::-webkit-scrollbar-corner {
			background-color: none;
		}
	</style>
	<div class='overlay_base' ref='overlay_base'>
		<div id="server_user_num_text" ref="server_user_num_text">
			{model.serverUserNumText}
		</div>

		<div class="self_state_info">
			<div>Score: {(model.selfScore * 0.001).toFixed(1)}k</div>
			<div>Max: {(model.maxScore * 0.001).toFixed(1)}k</div>
			<div>{model.splitNum}/16</div>
		</div>

		<div id="self_score_text" ref="self_score_text">

		</div>

		<div id="server_display_message" ref="server_display_message">
			{model.serverDisplayMessageText}
		</div>

		<div class="spec_target_info" show={model.specTargetName != null}>
			{model.specTargetScore ? model.specTargetName + " -- " + (model.specTargetScore/1000).toFixed(1) + "k" : model.specTargetName}
		</div>

		<div class="benchmark_mode_message_outer" show={gstates.isBenchmarkMode}>
			<div class="benchmark_mode_message" >
				benchmark mode (score: {perfModel.numCellsRendered})
			</div>
		</div>


		<div class="server_client_status_area">
			<div>
				<div each={val, key in perfModel.debugObj}>
					{key} : {val}
				</div>
			</div>

			<hr />

			<div show={uconfig.ShowClientStatus}>
				<div>
					ғᴘꜱ : {perfModel.avgFps.toFixed(1)}
				</div>
				<div>
					ɴᴏᴅᴇꜱ : {perfModel.numCellsRendered}
				</div>
				<div>
					ʀᴇɴᴅᴇʀ : {perfModel.avgDuration.toFixed(2)}ᴍs
				</div>
				<div>
					ʟᴏᴀᴅ : {(perfModel.avgRate * 100).toFixed(2)}%
				</div>
				<div>
					ʙᴜғғᴇʀ : {(perfModel.replayBufferBytes / 1000000).toFixed(2)}ᴍʙ
				</div>

				<hr />
			</div>

			<div id="server_status_text" ref="server_status_text" show={uconfig.ShowServerStatus}>
				<div each={text in model.serverStatusText}>
					{text}
				</div>

				<hr />
			</div>

			<div id="latency_text" ref="latency_text">
				ʟᴀᴛᴇɴᴄʏ: {model.latencyMs}ᴍs
			</div>

			<div id="copylight" ref="copylight_text">

			</div>
		</div>

		<div class="leaderboard_outer" show={uconfig.ShowLeaderboard}>
			<div class="leaderboard_inner" style="background: {cssColors.clLeaderboardBack};">
				<div class="lb_header lb_header_large" style="color: {cssColors.clLeaderboardHeader};">{model.leaderboardHeaderText}</div>
				<div class="lb_detail">
					<div each={model.leaderboardEntries} class="lb_entry" style="color: {color};" show={active}>
						{index + 1}.{text} -- {score}
					</div>
				</div>
			</div>

			<div style="height: 8px"></div>

			<div class="leaderboard_inner" style="background-color: {cssColors.clLeaderboardBack};"
				show={gconfig.ShowTeamRanking}>
				<div class="lb_header" style="color: {cssColors.clLeaderboardHeader};">Team Ranking</div>
				<div class="lb_detail">
					<div each={model.teamRankingEntries} class="lb_entry" style="color: {color};" show={active}>
						{index + 1}.{text} -- {score}
					</div>
				</div>
				<div id="lb_chart_outer" ref="lb_chart_outer">
					<canvas id="lb_chart_canvas" ref="lb_chart_canvas"></canvas>
				</div>
			</div>
		</div>

		<div id="map_outer" ref="map_outer" style="background-color: {cssColors.clMapBackground}" show={uconfig.ShowMap}>
			<canvas id="map_canvas" ref="map_canvas"></canvas>
		</div>

		<div id="game_control_overlay" class='game_control_overlay' ref='game_control_overlay'/>

		<div id='chat_container' style="position: absolute;top: 40px;display: flex;flex-direction: column;">
    <div class="chat_view" id="chat_view" ref="chat_view" onclick="$('.tripKey').toggle();" style="background-color: {cssColors.clChatBackground}; max-width:300px;min-width: 300px;" show={uconfig.ShowChatBox}>
      <div each={model.chatMessages} style="margin-top:3px;display: flex;flex-direction: column;margin-bottom:20px;">
        <div style="display: flex;align-items: inherit;">
          <div class="divs" style="border-radius: 15px;width: 30px;height: 30px;">
          <div style="width: 30px;height: 30px;border-radius: 15px;background-color: {cssColors.clChatSenderName};background-image: url({skinUrl});background-size: cover;background-position-x: left;"></div>
        </div>

        <div style="margin-top:5px;">
          <span class="message_time_stamp" style="color: {cssColors.clChatTimeString};margin-left: 5px;">{timeStamp}</span>
          <span class="tripKey" show={!1} style="color: {cssColors.clChatSenderName};margin-left: 5px;">{tripKey}</span>
          <span style="color: {cssColors.clChatSenderName};margin-left: 5px;">{senderName}:</span>
        </div>
      </div>

      <div style="margin-left: 35px;word-break: break-all" ;>
        <span style="color: {cssColors.clChatMessage};">{message}</span>
      </div>
    </div>
  </div>
 </div>
		<div class="bottom_area">
			<div class="chat_input_area" show={chatInputBoxVisible} ref="chat_input_box">
				<input type="text" id="chat_input_text_box" ref="chat_input_text_box"/>
			</div>
		</div>

	</div>
</game-overlay>`)], e)
            }(s.Element));
        e.GameOverlayTag = c
    }, function(t, e, n) {
        "use strict";
        var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(t, e) {
                    t.__proto__ = e
                } || function(t, e) {
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
                },
                function(t, e) {
                    function n() {
                        this.constructor = t
                    }
                    i(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
                }),
            r = this && this.__decorate || function(t, e, n, i) {
                var o, r = arguments.length,
                    s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i);
                else
                    for (var a = t.length - 1; a >= 0; a--)(o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
                return r > 3 && s && Object.defineProperty(e, n, s), s
            };
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = n(5),
            a = n(0),
            l = n(4),
            c = n(1),
            h = function(t) {
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    return e.model = l.gameCore.ReplayControllerModel, e.cssColors = a.gs.ucolors.cssColors, e.replayUiMessage = "", e.elementIdToReplayOperationDict = {
                        bt_flash: 2,
                        bt_record: 1,
                        bt_stop: 3,
                        bt_play: 4,
                        bt_reel_prev: 5,
                        bt_reel_next: 6,
                        bt_cont: 7,
                        bt_tick_prev: 8,
                        bt_tick_next: 9,
                        bt_reel_delete: 10,
                        bt_speed_down: 12,
                        bt_speed_up: 13
                    }, e
                }
                return o(e, t), e.prototype.mounted = function() {
                    var t = this;
                    this.model.SetStateChangedProc(function(e) {
                        t.update()
                    }), this.update(), this.model.captureNotificationProc = function() {
                        t.replayUiMessage = "captured!", setTimeout(function() {
                            t.replayUiMessage = "", t.update()
                        }, 500)
                    }
                }, e.prototype.onTrackKnobMouseDown = function(t) {
                    var e = this;
                    if (!a.gs.gstates.isBenchmarkMode) {
                        var n = this.refs.gauge_rail.getBoundingClientRect().left,
                            i = function(t) {
                                var i = t.pageX - n,
                                    o = c.Nums.VMap(i, 5, 295, 0, 1, !0);
                                return e.model.SeekReplayPosTo(o, !0), e.update(), !1
                            },
                            o = function(t) {
                                window.removeEventListener("mousemove", i), window.removeEventListener("mouseup", o)
                            };
                        window.addEventListener("mousemove", i), window.addEventListener("mouseup", o), i(t), t.stopPropagation()
                    }
                }, e.prototype.onButtonClick = function(t) {
                    if (!a.gs.gstates.isBenchmarkMode) {
                        var e = t.currentTarget.id,
                            n = this.elementIdToReplayOperationDict[e];
                        n && this.model.HandleReplayOperation(n), t.stopPropagation()
                    }
                }, r([s.template('\n<replay-control-bar>\n\t<style>\n\t\t.replay_bar_area{\n\t\t\twidth: 660px;\n\t\t\theight: 45px;\n\t\t\tmargin: 0 auto;\n\t\t\tborder-radius:4px;\n\t\t\tmargin-top: 6px;\n\t\t\tposition: relative;\n\t\t\tpadding: 4px;\n\t\t\tpadding-left: 10px;\n\t\t\tuser-select: none;\n\t\t}\n\n\t\t.ui_row > div{\n\t\t\tfloat: left;\n\t\t\tmargin: 0 2px;\n\t\t}\n\n\t\t.ui_row2 > *{\n\t\t\tfloat: left;\n\t\t\tmargin: 0 2px;\n\t\t}\n\n\t\t.replay_main_button_group{\n\t\t\tmargin-top: 2px !important;\n\t\t}\n\t\t\n\t\t.control_button_back{\n\t\t\tborder-radius: 5px;\n\t\t}\n\n\t\t.control_button{\n\t\t\twidth: 34px;\n\t\t\theight: 34px;\n\t\t\tborder: solid 1px #FFF;\n\t\t\tborder-radius: 3px;\n\t\t\tline-height: 34px;\n\t\t\tfont-family: \'IconFont1\';\n\t\t\tfont-size: 15px;\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.middle_button{\n\t\t\twidth: 32px;\n\t\t\theight: 28px;\n\t\t\tline-height: 28px;\n\t\t\tfont-size: 12px;\n\t\t\tborder-radius: 2px;\n\t\t}\n\n\t\t.reel_info_area{\n\t\t\tline-height: 28px;\n\t\t\tfont-size: 14px;\n\t\t\tmargin: 0 0px !important;\n\t\t\twidth: 50px;\n\t\t}\n\n\t\t.small_button{\n\t\t\twidth: 22px;\n\t\t\theight: 18px;\n\t\t\tline-height: 18px;\n\t\t\tfont-size: 11px;\n\t\t\tborder-radius: 1px;\n\t\t}\n\n\t\t.control_button:hover{\n\t\t\tbackground-color: rgba(255,255,255,0.2);\n\t\t}\n\n\t\t.is_on{\n\t\t\tbackground-color: #00F;\n\t\t} \n\n\t\t.gauge_area{\n\t\t\twidth: 300px;\n\t\t\theight: 38px;\n\t\t\tposition: relative;\n\t\t\tmargin: 0 8px !important;\n\t\t}\n\n\t\t.gauge_box{\n\t\t\tposition: absolute;\n\t\t\tbottom: 0;\n\t\t}\n\n\t\t.gauge{\n\t\t\twidth: 300px;\n\t\t\theight: 16px;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.gauge_rail{\n\t\t\twidth: 300px;\n\t\t\theight: 10px;\n\t\t\tborder: solid 1px #FFF;\n\t\t\tposition: absolute;\n\t\t\ttop: 3px;\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.gauge_knob{\n\t\t\twidth: 10px;\n\t\t\theight: 16px;\n\t\t\tborder: solid 1px #FFF;\n\t\t\tposition: absolute;\n\t\t\tleft: 0px;\n\t\t\tbackground-color: #08F;\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.time_position_text{\n\t\t\tposition: absolute;\n\t\t\tright: 0;\n\t\t\ttop: 0;\n\t\t\tfont-size: 14px;\n\t\t}\n\n\t\t.replay_speed_text{\n\t\t\twidth: 35px;\n\t\t\tfont-size: 14px;\n\t\t}\n\n\t\t.part_reel_control{\n\t\t\tmargin-top: 5px !important;\n\t\t}\n\n\t\t.second_bar_area{\n\t\t\twidth: 660px;\n\t\t\tmargin: 0 auto;\n\t\t\tposition: relative;\n\t\t\tuser-select: none;\n\t\t}\n\n\t\t.replay_ui_message{\n\t\t\tfont-family: CustomFont1;\n\t\t\tfont-size: 24px;\n\t\t\ttext-align: left;\n\t\t}\n\t</style>\n\t<div>\n\t\t<div class="replay_bar_area ui_row" style="background-color: {cssColors.clReplayBar}; color: {cssColors.clUiSymbols}">\n\t\t\t<div class="replay_main_button_group ui_row">\n\t\t\t\t<div class="control_button" id="bt_flash" onmousedown={onButtonClick}\n\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}; border-color: {cssColors.clUiSymbols}"">&#xe9b5</div>\n\n\t\t\t\t<div class="control_button_back"\n\t\t\t\t\tstyle="background-color: {model.isRecording ? cssColors.clUiButtonActive : \'\'}">\n\t\t\t\t\t<div class="control_button" id="bt_record" onmousedown={onButtonClick} style="border-color: {cssColors.clUiSymbols}">\n\t\t\t\t\t\t\t&#xe914\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div style="width: 2px; height: 1px" />\n\n\t\t\t\t<div class="control_button" id="bt_stop" onmousedown={onButtonClick} \n\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xea1e</div>\n\n\t\t\t\t<div class="control_button_back"\n\t\t\t\t\tstyle="background-color: {model.isPlayback ? cssColors.clUiButtonActive : \'\'}">\n\t\t\t\t\t<div class="control_button" id="bt_play" onmousedown={onButtonClick} style="border-color: {cssColors.clUiSymbols}">\n\t\t\t\t\t\t&#xe902\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t</div>\n\n\t\t\t<div class="gauge_area">\n\n\t\t\t\t<div class="ui_row2" style="margin-left:-2px">\n\t\t\t\t\t<div class="control_button small_button" id="bt_tick_prev" onmousedown={onButtonClick} \n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xf177</div>\n\t\t\t\t\t<div class="control_button small_button" id="bt_tick_next" onmousedown={onButtonClick} \n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xf178</div>\n\n\t\t\t\t\t<div style="width:4px; height: 1px" />\n\n\t\t\t\t\t<div class="control_button small_button" id="bt_speed_down" onmousedown={onButtonClick} \n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xf068</div>\n\t\t\t\t\t<div class="control_button small_button" id="bt_speed_up" onmousedown={onButtonClick} \n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xf067</div>\n\t\t\t\t\t<div class="replay_speed_text">\n\t\t\t\t\t\tx{model.replaySpeedRate.toFixed(2)}\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div style="width:4px; height: 1px" />\n\n\t\t\t\t\t<div class="{control_button_back: true, is_on: model.isAutoShiftToNextReel}">\n\t\t\t\t\t\t<div class="control_button small_button" id="bt_cont" onmousedown={onButtonClick} style="border-color: {cssColors.clUiSymbols}">\n\t\t\t\t\t\t\t&#xe90a\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class="time_position_text">\n\t\t\t\t\t{model.trackPosText}\n\t\t\t\t</div>\n\n\t\t\t\t<div class="gauge_box">\n\t\t\t\t\t<div class="gauge" onmousedown={onTrackKnobMouseDown}>\n\t\t\t\t\t\t<div class="gauge_rail" id="gauge_rail" ref="gauge_rail" style="border-color: {cssColors.clUiSymbols}"/>\n\t\t\t\t\t\t<div class="gauge_knob" id="gauge_knob" \n\t\t\t\t\t\t\tstyle="left: {~~(model.trackPos * 290) + \'px\'}; background-color: {cssColors.clReplayBar}; border-color: {cssColors.clUiSymbols}"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class="part_reel_control">\n\t\t\t\t<div class="ui_row">\n\t\t\t\t\t<div class="control_button middle_button" id="bt_reel_prev" onmousedown={onButtonClick}\n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xe912</div>\n\n\t\t\t\t\t<div class="control_button middle_button" id="bt_reel_next" onmousedown={onButtonClick}\n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xe913</div>\n\n\t\t\t\t\t<div class="reel_info_area">\n\t\t\t\t\t\t<div>{model.numReels > 0 ? model.curReelIndex + 1 : 0}/{model.numReels}</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="control_button middle_button" id="bt_reel_delete" onmousedown={onButtonClick}\n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xe9ad</div>\n\t\t\t\t</div>\n\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class="second_bar_area">\n\t\t\t<div class="replay_ui_message">\n\t\t\t\t{replayUiMessage}\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</replay-control-bar>\n')], e)
            }(s.Element);
        e.ReplayControlBarTag = h
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = function() {
            function t() {
                this.listeners = new Map
            }
            return t.prototype.emit = function(t, e) {
                var n = this.listeners.get(t);
                if (n)
                    for (var i = 0, o = n; i < o.length; i++)(0, o[i])(e)
            }, t.prototype.on = function(t, e) {
                this.listeners.get(t) || this.listeners.set(t, []), this.listeners.get(t).push(e)
            }, t
        }();
        e.EventBus = i
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = function() {
            function t(t) {
                this.values = [0], this.maxCount = t
            }
            return t.prototype.Push = function(t) {
                this.values.length > this.maxCount && this.values.shift(), this.values.push(t)
            }, t.prototype.GetAverageValue = function() {
                var t = 0;
                return (t = this.values.reduce(function(t, e) {
                    return t + e
                }, 0)) / this.values.length
            }, t
        }();
        e.PerformanceCheckQueue = i
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(1),
            o = n(3),
            r = n(0),
            s = n(4),
            a = s.gameCore.nodeMan,
            l = n(11),
            c = n(12),
            h = n(1),
            d = n(25),
            u = n(10),
            p = n(6);
        ! function(t) {
            var e = function() {
                    function t(t) {
                        this.holdTick = 0, this.gameView = t, this.box = new p.Container, this.gr = new p.Graphics, this.box.addChild(this.gr), this.box.zIndex = 1e3, this.elCursorOuter = document.querySelector("#psudo_cursor"), this.elCursorImageOn = document.querySelector("#psudo_cursor_img_on"), this.elCursorOuter.style.webkitUserSelect = "none"
                    }
                    return t.prototype.SetPsudoCursor = function(t, e, n, i) {
                        var o = this.elCursorOuter;
                        o.style.display = t ? "block" : "none", o.style.left = n + "px", o.style.top = i + "px", e && (this.holdTick = 7), this.holdTick > 0 && this.holdTick--, this.elCursorImageOn.style.display = this.holdTick > 0 ? "block" : "none"
                    }, t.prototype.Update = function() {
                        this.gr.clear(), r.gs.gstates.isBenchmarkMode || (this.UpdateCursor(), this.UpdateEatingLimitMarker(), this.UpdateCellDirectionMarker(), this.UpdateTeamCircle())
                    }, t.prototype.DrawCrossPoint = function(t, e, n) {
                        var i = this.gr;
                        i.moveTo(t - n, e), i.lineTo(t + n, e), i.moveTo(t, e - n), i.lineTo(t, e + n)
                    }, t.prototype.UpdateTeamCircle = function() {
                        var t = Date.now(),
                            e = s.gameCore.sight,
                            n = this.gr;
                        if (t - e.teamCircleTimeStamp < 500) {
                            var i = e.teamCircleX,
                                o = e.teamCircleY,
                                r = e.teamCircleRadius;
                            n.lineStyle(10, 16777215, 1), n.drawCircle(i, o, r)
                        }
                    }, t.prototype.UpdateCellDirectionMarker = function() {
                        var t = this.gr;
                        r.gs.uconfig.ShowCellDirectionMarker && this.gameView.cells.forEach(function(e) {
                            if (e.isPlayerCell) {
                                var n = e.node;
                                if (0 != n.velocity.x || 0 != n.velocity.y) {
                                    var o = Math.atan2(n.velocity.y, n.velocity.x),
                                        r = n.nx,
                                        s = n.ny,
                                        a = e.baseSize / 2 * e.scale * .8,
                                        l = e.baseSize / 2 * e.scale * 1.05,
                                        c = r + Math.cos(o) * a,
                                        h = s + Math.sin(o) * a,
                                        d = r + Math.cos(o) * l,
                                        u = s + Math.sin(o) * l,
                                        p = e.labelColor;
                                    t.lineStyle(10, p, 1);
                                    var g = .05 * n.nr;
                                    g = i.Nums.LoLimit(g, 15), t.lineWidth = g, t.moveTo(c, h), t.lineTo(d, u)
                                }
                            }
                        })
                    }, t.prototype.UpdateEatingLimitMarker = function() {
                        var t = this;
                        r.gs.uconfig.ShowEatLimitMarker && s.gameCore.nodeMan.nodeAnalyzer.eatingLimitList.forEach(function(e) {
                            var n = t.gameView.cells.get(e.eaterId),
                                i = t.gameView.cells.get(e.eatenId),
                                o = e.canEat ? 65535 : 11184810;
                            t.gr.lineStyle(10, o, 1), t.DrawCrossPoint(n.x, n.y, 100), t.DrawCrossPoint(i.x, i.y, 100), t.gr.drawCircle(n.x, n.y, e.limitRadius)
                        })
                    }, t.prototype.UpdateCursor = function() {
                        var t = this,
                            e = s.gameCore.sight;
                        if ((r.gs.gstates.isPlaying ? r.gs.uconfig.ShowCursorLine : r.gs.uconfig.ShowSpecAimCursor) && e.aimPlayerId > 0) {
                            var n = e.aimCursorX,
                                i = e.aimCursorY,
                                a = this.gr,
                                l = r.gs.ucolors.GetColor("clCursorLine");
                            a.alpha = o.ColorHelper.GetAlpha(l);
                            var c = r.gs.uconfig.CursorLineThickness;
                            c *= .2 / e.eyeScale, a.lineStyle(c, l);
                            var h = e.aimPlayerId,
                                d = 0;
                            s.gameCore.nodeMan.nodes.forEach(function(e) {
                                if (e.ownerPlayerId == h && 0 == e.cellType) {
                                    var o = t.gameView.cells.get(e.nodeId);
                                    a.moveTo(o.x, o.y), a.lineTo(n, i), d++
                                }
                            });
                            var u = e.WorldToScreen(n, i),
                                p = u[0],
                                g = u[1];
                            this.SetPsudoCursor(!r.gs.gstates.isRealtimeModePlaying && d > 0, e.splitting, p, g), e.splitting = !1
                        } else this.SetPsudoCursor(!1, !1, 0, 0)
                    }, t
                }(),
                n = function() {
                    function t() {
                        this.cardSize = 250, this.sharpness = 10, this.glowDist = 500
                    }
                    return t.prototype.Initialize = function() {
                        this.canvas = document.createElement("canvas"), this.canvas.width = this.canvas.height = this.cardSize + 2 * this.glowDist, this.texture = p.Texture.from(this.canvas), this.UpdateDrawing_Canvas(), r.gs.uconfig.RegisterChangedProc("SimpleVirus", this.UpdateDrawing_Canvas.bind(this)), r.gs.uconfig.RegisterChangedProc("GlowingNonPlayerCells", this.UpdateDrawing_Canvas.bind(this)), r.gs.ucolors.RegisterChangedProc("clVirusInnerFill", this.UpdateDrawing_Canvas.bind(this)), r.gs.ucolors.RegisterChangedProc("clVirusOuterStroke", this.UpdateDrawing_Canvas.bind(this))
                    }, t.prototype.UpdateDrawing_Canvas = function() {
                        const t = r.gs.uconfig.GlowingNonPlayerCells;
                        var e, n = (e = this.cardSize) / 2,
                            i = n + this.glowDist,
                            s = this.canvas.getContext("2d"),
                            a = r.gs.ucolors.GetColor("clVirusInnerFill"),
                            l = r.gs.ucolors.GetAlpha("clVirusInnerFill"),
                            c = r.gs.ucolors.GetColor("clVirusOuterStroke"),
                            h = r.gs.ucolors.GetAlpha("clVirusOuterStroke");
                        if (s.clearRect(0, 0, 2 * i, 2 * i), s.shadowColor = o.ColorHelper.ColorToHtmlString(c), r.gs.uconfig.SimpleVirus) {
                            s.beginPath();
                            var d = .01 * this.cardSize * 4;
                            s.arc(i, i, n, 0, 2 * Math.PI, !1), s.arc(i, i, this.cardSize / 2 - d / 2, 0, 2 * Math.PI, !1), s.lineWidth = d, s.strokeStyle = o.ColorHelper.ColorToHtmlString(c), s.globalAlpha = h, s.shadowBlur = t ? this.glowDist : 0, s.stroke(), s.stroke(), s.shadowBlur /= 2, s.stroke(), s.stroke(), s.globalAlpha /= 2, s.stroke(), s.stroke(), s.shadowBlur /= 1.5, s.stroke(), s.stroke(), s.fillStyle = o.ColorHelper.ColorToHtmlString(a), s.globalAlpha = l, s.fill(), s.shadowBlur = t ? .1 * n : 0, s.globalAlpha = h, s.stroke(), s.globalAlpha /= 2, s.stroke(), s.globalAlpha = 1
                        } else {
                            s.beginPath();
                            const r = 24,
                                d = 360 / r / 180 * Math.PI,
                                u = d / 2,
                                p = n + this.sharpness,
                                g = n - this.sharpness;
                            for (var e = 0; e <= r; e++) s.lineTo(Math.cos(e * d) * p + i, -Math.sin(e * d) * p + i), s.lineTo(Math.cos(e * d + u) * g + i, -Math.sin(e * d + u) * g + i);
                            s.lineWidth = .01 * this.cardSize * 3.25, s.strokeStyle = o.ColorHelper.ColorToHtmlString(c), s.lineJoin = "round", s.globalAlpha = h, s.shadowBlur = t ? this.glowDist : 0, s.stroke(), s.stroke(), s.shadowBlur /= 2, s.stroke(), s.stroke(), s.globalAlpha /= 2, s.stroke(), s.stroke(), s.shadowBlur /= 1.5, s.stroke(), s.stroke(), s.fillStyle = o.ColorHelper.ColorToHtmlString(a), s.globalAlpha = l, s.fill(), s.shadowBlur = t ? .1 * n : 0, s.globalAlpha = h, s.stroke(), s.globalAlpha /= 2, s.stroke(), s.globalAlpha = 1
                        }
                        this.texture.update()
                    }, t.instance = new t, t
                }(),
                g = function() {
                    function t() {}
                    return t.prototype.GetSequenceString = function() {
                        var t = this;
                        return "" + t.skinUrl + t.nameText + t.skinAlpha + t.renderQuality + t.baseColor + t.teamColor + t.showEnemyOverlay + t.insertRenderName
                    }, t
                }(),
                f = function() {
                    function t() {}
                    return t.GetConfigCardSizeFromRenderQuality = function(e) {
                        return t.CardSizeSource[e]
                    }, Object.defineProperty(t, "CurrentConfigCardSize", {
                        get: function() {
                            return t.GetConfigCardSizeFromRenderQuality(r.gs.uconfig.RenderQuality)
                        },
                        enumerable: !0,
                        configurable: !0
                    }), t.CardSizeSource = [200, 400, 800], t
                }(),
                m = function() {
                    function t(t) {
                        this.drawingProps = new g, this.playerId = t, this.drawingProps.renderQuality = r.gs.uconfig.RenderQuality
                    }
                    return t.ResizeInterCanvasIfNeed = function(e) {
                        var n = t.interCanvas;
                        n.height < e && (n.width = e, n.height = e)
                    }, t.prototype.ResizeCanvasIfNeed = function(t) {
                        if (this.canvas || (this.canvas = document.createElement("canvas"), this.canvasCapacitySize = 10, this.canvas.width = 10, this.canvas.height = 10), this.canvasCapacitySize != t) {
                            this.canvasCapacitySize = t, this.canvas.height < t && (this.canvas = document.createElement("canvas"), this.canvas.width = t, this.canvas.height = t, this.baseTexture = p.BaseTexture.from(this.canvas));
                            var e = new p.Rectangle(0, 0, t, t);
                            this.texture = new p.Texture(this.baseTexture, e)
                        }
                    }, t.prototype.StringToCharArrayU = function(t) {
                        return t.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || []
                    }, t.prototype.DrawTextCircular = function(t, e, n, i, o, r, s, a) {
                        t.save(), t.translate(n, i);
                        for (var l = s, c = this.StringToCharArrayU(e), h = 0; h < c.length; h++) {
                            var d = c[h];
                            t.save(), t.rotate(l);
                            var u = t.measureText(d).width,
                                p = -u / 2,
                                g = o * a;
                            t.strokeText(d, p, g), t.fillText(d, p, g), t.restore();
                            var f = .4 * u + .2 * r,
                                m;
                            l -= 2 * Math.atan2(f, Math.sqrt(o * o - f * f))
                        }
                        t.restore()
                    }, t.prototype.RenderCellCanvas = function() {
                        this.playerId == a.activeSelfPlayerId && (this.self = !0);
                        var e = this.drawingProps,
                            n = f.GetConfigCardSizeFromRenderQuality(e.renderQuality);
                        this.cardSize = n;
                        const i = n / 2;
                        var s = n / 2,
                            l = r.gs.uconfig.GlowingCells ? i : 0,
                            c = s + l,
                            h = 2 * c,
                            d = 2 * (s + i);
                        this.ResizeCanvasIfNeed(h);
                        var u = this.canvas.getContext("2d");
                        if (u.save(), u.clearRect(0, 0, d, d), u.beginPath(), u.arc(c, c, s, 0, 2 * Math.PI, !1), u.closePath(), this.skinVisible = this.skinImage && e.skinAlpha > 0, this.skinVisible) {
                            u.shadowBlur = l, u.shadowColor = u.fillStyle = o.ColorHelper.ColorToHtmlString(e.baseColor), u.fill(), u.clip();
                            var p = this.skinImage,
                                g = p.width,
                                m = p.height,
                                y = 0,
                                v = 0,
                                S = 0,
                                b = n;
                            let i;
                            if (!this.self || r.gs.uconfig.ShowSelfSkin)
                                if (g > m ? (y = (g - (S = m)) / 2, v = 0) : (y = 0, v = (m - (S = g)) / 2), u.globalAlpha = e.skinAlpha, b / S < .5) {
                                    t.ResizeInterCanvasIfNeed(h);
                                    var C = t.interCanvas,
                                        x = C.getContext("2d"),
                                        _ = 2 * n;
                                    x.clearRect(0, 0, d, d), x.drawImage(p, y, v, S, S, l, l, b, b), u.drawImage(C, l, l, b, b, l, l, b, b)
                                } else u.drawImage(p, y, v, S, S, l, l, b, b);
                            u.globalAlpha = 1, u.shadowBlur = 0
                        }
                        var w = o.ColorHelper.ColorToHtmlString(e.teamColor);
                        if (e.showEnemyOverlay) {
                            var k = 2 * Math.PI,
                                I = 6 * (T = .01 * n),
                                P = 7 * T,
                                M = n / 2;
                            u.strokeStyle = w, u.lineWidth = I, u.globalAlpha = .3, u.fillStyle = "#000", u.save(), u.arc(c, c, s, 0, 2 * Math.PI, !1), u.clip(), u.fillRect(l, l, n + l, n + l), u.restore(), u.globalAlpha = .8, u.beginPath(), u.arc(c, c, M - P, 0, k, !1), u.stroke();
                            var h = .707 * M - P;
                            u.beginPath(), u.moveTo(l + M + h, l + M - h), u.lineTo(l + M - h, l + M + h), u.stroke(), u.globalAlpha = 1
                        }
                        if (e.insertRenderName) {
                            var T, R = 10 * (T = .01 * n) >> 0;
                            u.font = "bold " + R + "px Meiryo, Arial", u.strokeStyle = "#000", u.fillStyle = w, u.lineWidth = 1.3 * T >> 0, this.DrawTextCircular(u, e.nameText, n, n, .8 * s, R, 1.5, 1)
                        }
                        u.restore(), this.texture.update()
                    }, t.prototype.Update = function() {
                        var t = this,
                            e = this.drawingProps,
                            n = e.GetSequenceString(),
                            i = e.skinUrl,
                            a = s.gameCore.uMan,
                            c = 65535 & this.playerId,
                            h = 1 & this.playerId,
                            d = a.GetUserInfoById(c),
                            p = a.GetTeamInfoById(d.teamId),
                            g = c == a.selfUserId,
                            f = r.gs.gstates.isPlaying || r.gs.gstates.isDeadSpectation,
                            m = d.skinUrls[h],
                            y = p == a.selfTeamInfo,
                            v = o.GameHelper.CheckIsInEatableSection(p.section, a.selfTeamInfo.section),
                            S = !d.isBot && "" == m;
                        S && (m = r.gs.gconfig.NoskinFallbackUrl);
                        var b = 1,
                            C = !0;
                        f && !y && (r.gs.uconfig.ShowEnemySkin ? b = .6 : C = !1), S && g && (C = !1), "dead" == d.name && (C = !1), r.gs.gconfig.ShowAlwaysAllPlayersSkin && (C = !0, b = 1), this.skinImage && 0 == u.SkinImageManager.instance.getSkinAvailability(this.skinImage.src) && (C = !1), r.gs.uconfig.ShowSkin || (C = !1), C || (b = 0), e.baseColor = d.colors[h], e.skinUrl = m, e.nameText = d.fullName, e.teamColor = p.color, e.renderQuality = r.gs.uconfig.RenderQuality, e.insertRenderName = r.gs.uconfig.ShowCircularName && r.gs.uconfig.ShowName && !(!r.gs.uconfig.ShowSelfName && g), e.skinAlpha = b, e.showEnemyOverlay = r.gs.uconfig.ShowEnemySkin && f && !d.isBot && !y && v && b > 0, r.gs.gconfig.ShowAlwaysAllPlayersSkin && (e.showEnemyOverlay = !1), this.glow != r.gs.uconfig.GlowingCells && (this.glow = r.gs.uconfig.GlowingCells, this.reqRenderCellCanvasOnNextFrame = !0), (this.self || g) && this.sv != r.gs.uconfig.ShowSelfSkin && (this.sv, r.gs.uconfig.ShowSelfSkin, this.reqRenderCellCanvasOnNextFrame = !0), e.GetSequenceString() != n && (e.skinUrl != i ? (this.skinImage = null, this.reqRenderCellCanvasOnNextFrame = !0, e.skinUrl && l.ImageWrapper.LoadImageThen(e.skinUrl, function(e) {
                            e && u.SkinImageManager.instance.addSkinUrl(e.src), t.skinImage = e, t.reqRenderCellCanvasLazy = !0
                        })) : this.reqRenderCellCanvasLazy = !0)
                    }, t.prototype.Purge = function() {
                        this.skinImage && this.skinImage.src && u.SkinImageManager.instance.removeSkinUrl(this.skinImage.src)
                    }, t.interCanvas = document.createElement("canvas"), t
                }(),
                y = function() {
                    function t() {
                        this.cellCards = new Map
                    }
                    return t.prototype.GetCellCard = function(t, e) {
                        void 0 === e && (e = !1);
                        var n = this.cellCards.get(t);
                        return !n && e && (n = new m(t), this.cellCards.set(t, n)), h.Utils.Confirm(n), n
                    }, t.prototype.OnUserLeaved = function(t) {
                        var e = this.cellCards.get(t);
                        e && e.Purge(), this.cellCards.delete(t), this.cellCards.delete(t + 1)
                    }, t.prototype.UpdateCardDrawingQueue = function() {
                        var t = !1;
                        this.cellCards.forEach(function(e) {
                            e.reqRenderCellCanvasOnNextFrame && (e.RenderCellCanvas(), e.reqRenderCellCanvasOnNextFrame = !1, t = !0)
                        }), this.cellCards.forEach(function(e) {
                            !t && e.reqRenderCellCanvasLazy && (e.RenderCellCanvas(), e.reqRenderCellCanvasLazy = !1, t = !0)
                        })
                    }, t.instance = new t, t
                }(),
                v = function() {
                    function t() {
                        this.box = new p.Container, this.baseShape = new p.Sprite, this.baseShape.anchor.set(.5), this.baseSprite = new p.Sprite, this.baseSprite.anchor.set(.5), this.overShape = new p.Graphics, this.nameLabel = new p.Text, this.massLabel = new p.BitmapText("", {
                            fontName: "GAMEPLAY_MASS"
                        }), this.box.addChild(this.baseShape), this.box.addChild(this.baseSprite), this.box.addChild(this.overShape)
                    }
                    return t.Gain = function() {
                        return t.pool.Gain()
                    }, t.prototype.Release = function() {
                        this.box.removeChild(this.nameLabel), this.box.removeChild(this.massLabel), t.pool.Release(this)
                    }, Object.defineProperty(t.prototype, "isPlayerCell", {
                        get: function() {
                            return 0 == this.node.cellType
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(t.prototype, "isVirus", {
                        get: function() {
                            return 2 == this.node.cellType
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(t.prototype, "isPellet", {
                        get: function() {
                            return 1 == this.node.cellType
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(t.prototype, "isFood", {
                        get: function() {
                            return 3 == this.node.cellType
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(t.prototype, "isFunnel", {
                        get: function() {
                            return 4 == this.node.cellType
                        },
                        enumerable: !0,
                        configurable: !0
                    }), t.prototype.SetupLabel = function(t) {
                        t.style && (t.style.fontFamily = "Meiryo, Arial", t.style.fontWeight = "bold", t.style.stroke = "#000000", t.style.fontSize = .13 * this.baseSize * (r.gs.uconfig.TextZoom / 100) >> 0, t.style.strokeThickness = .015 * this.baseSize *(r.gs.uconfig.TextZoom / 100) >> 0)
                    }, t.prototype.Initialize = function(t) {
                        this.node = t, t.entity = this, this.glow = this.cellCard = this.baseSize = null, this.isPlayerCell ? this.cellCard = y.instance.GetCellCard(t.ownerPlayerId) : this.isVirus && (this.cellCard = n.instance), this.UpdateBaseShape(), this.cellCard && (this.box.addChild(this.nameLabel), this.box.addChild(this.massLabel)), this.SetupLabel(this.nameLabel), this.SetupLabel(this.massLabel), this.baseColor = -1, this.labelColor = -1, this.edgeColor = -1, this.edgeColor2 = -1, this.ringColor = -1, this.frameTick = 0, this.x = 0, this.y = 0, this.scale = 1, this.x0 = 0, this.y0 = 0, this.scale0 = 1, this.x1 = 0, this.y1 = 0, this.scale1 = 0, this.angle = 0, this.speed = 0, this.speedApplyTime = 0, this.time = 0, this.mass = 0, this.isInEatableSection = !1
                    }, t.prototype.UpdateProps = function(t) {
                        this.node = t, t.entity = this, 0 != this.mass && this.isPellet || this.UpdatePosRadius()
                    }, t.prototype.UpdateLabels = function(t, e, n) {
                        var i = null != t,
                            a = e >= 0;
                        if ((i || a) && this.labelColor != n) {
                            this.labelColor = n;
                            var l = o.ColorHelper.ColorToHtmlString(n);
                            this.nameLabel.style.fill = l, this.massLabel.tint = n
                        }
                        if (i && (h = this.nameLabel).text != t && (h.text = t, h.x = -h.width / 2, h.y = -h.height / 2), a) {
                            var c = e.toString();
                            if (this.massLabel.text != c) {
                                var h = this.massLabel,
                                    d, u = 2;
                                let e;
                                this.isVirus ? (u = 1.9, r.gs.uconfig.VirusSplitHint ? (c = 5 - (c - 100) / 16, d = 4) : d = 2.5) : d = 1, h.scale.x = d, h.scale.y = d, e = c < 1e3 ? c : r.gs.uconfig.SimplifiedMass ? (c / 100 >> 0) / 10 + "K" : c, h.text = e, h.x = -h.width / 2, h.y = -h.height / u, i && t && (h.y += .2 * this.baseSize)
                            }
                        }
                        this.nameLabel.visible = i, this.massLabel.visible = a;
                        let p = !r.gs.uconfig.AutoHideText || s.gameCore.sight.eyeScale * this.node.r > 30;
                        this.nameLabel.visible = i && p, this.massLabel.visible = a && p
                    }, t.prototype.UpdateBaseShape = function() {
                        const t = f.CurrentConfigCardSize;
                        if (this.isPellet || this.isFood) {
                            const e = r.gs.uconfig.GlowingNonPlayerCells;
                            if (this.baseSize != t || this.glow != e) {
                                this.baseSize = t, this.glow = e, this.massLabel.fontSize = .13 * this.baseSize >> 0, this.baseShape.blendMode = e ? PIXI.BLEND_MODES.SCREEN : PIXI.BLEND_MODES.NORMAL;
                                const n = e ? "GP_GLOWING_PELLET" : "GP_BASE_LOW";
                                this.baseShape.texture = PIXI.utils.TextureCache[n]
                            }
                            return void(0 == this.node.ownerPlayerId ? r.gs.uconfig.ShowFood ? this.box.visible = !0 : this.box.visible = !1 : (r.gs.uconfig.ShowPelletSkin && (this.cellCard = y.instance.GetCellCard(this.node.ownerPlayerId)), this.box.visible = !0))
                        }
                        this.box.visible = !0;
                        const e = r.gs.uconfig.GlowingCells;
                        if (this.baseSize != t || this.glow != e)
                            if (this.baseSize = t, this.glow = e, this.massLabel.fontSize = .13 * this.baseSize >> 0, this.baseShape.blendMode = PIXI.BLEND_MODES.NORMAL, 200 == this.baseSize) {
                                const t = e ? "GP_GLOWING_LOW" : "GP_BASE_LOW";
                                this.baseShape.texture = PIXI.utils.TextureCache[t]
                            } else if (400 == this.baseSize) {
                            const t = e ? "GP_GLOWING_MEDIUM" : "GP_BASE_MEDIUM";
                            this.baseShape.texture = PIXI.utils.TextureCache[t]
                        } else {
                            const t = e ? "GP_GLOWING_HIGH" : "GP_BASE_HIGH";
                            this.baseShape.texture = PIXI.utils.TextureCache[t]
                        }
                    }, t.prototype.UpdateDrawing = function(t, e, n, i, a) {
                        var l = this.baseSize / 2,
                            c = this.baseSize / 200,
                            h = e >= 0 || i >= 0 || a >= 0;
                        if (this.isVirus && r.gs.uconfig.VirusRangeHint) {
                            h = !0, (p = this.overShape).clear(), p.alpha = 1;
                            let t = o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clVirusRangeHint")),
                                e = r.gs.ucolors.GetAlpha("clVirusRangeHint");
                            p.beginFill(t, e), p.drawCircle(0, 0, 880 / this.scale), p.endFill()
                        }
                        if (h && (this.edgeColor != e || this.edgeColor2 != i || this.ringColor != a)) {
                            const t = this.node.ownerPlayerId == s.gameCore.nodeMan.selfUserId || this.node.ownerPlayerId == s.gameCore.nodeMan.selfUserId + 1;
                            if (this.edgeColor = e, this.edgeColor2 = i, this.ringColor = a, (p = this.overShape).clear(), p.alpha = 1, e >= 0) {
                                var d = !t && r.gs.uconfig.MarkerThin ? 4 * c : 12.5 * c;
                                if (p.lineStyle(d, e), p.drawCircle(0, 0, l - d / 2), n) {
                                    var u = .707 * l;
                                    p.moveTo(u, -u), p.lineTo(-u, u)
                                }
                            }
                            i >= 0 && (d = this.mass > 2e4 ? 8.75 * c : 6.25 * c, p.lineStyle(d, i), p.drawCircle(0, 0, l - d / 2)), a >= 0 && (d = 5 * c, p.lineStyle(d, a), p.drawCircle(0, 0, l + 10 * c))
                        }
                        this.overShape.visible = h, this.overShape.alpha = r.gs.uconfig.MarkerAlpha;
                        var p, g = t >= 0;
                        g && this.baseColor != t && (this.baseColor = t, this.baseShape.tint = t), this.baseShape.visible = g
                    }, t.prototype.UpdateGraphicsForFrame = function() {
                        var t = this.baseSize;
                        this.baseSize = f.CurrentConfigCardSize;
                        var e = this.baseSize != t,
                            n = this.node,
                            a = s.gameCore.nodeMan,
                            l = s.gameCore.uMan,
                            c = o.GameHelper.DecodePlayerId(n.ownerPlayerId),
                            d = c[0],
                            u = c[1],
                            p = l.GetUserInfoById(d),
                            g = l.GetTeamInfoById(p.teamId),
                            m = p.isBot,
                            y = g == l.selfTeamInfo,
                            v = l.selfTeamInfo.section,
                            S = (this.isPlayerCell || this.isFood) && !o.GameHelper.CheckIsInEatableSection(g.section, v),
                            self = [l.selfUserId,l.selfUserId+1];
                        this.isInEatableSection = S;
                        var b = r.gs.gstates.isPlaying && S;
                        this.box.alpha = b ? .5 : 1;
                        var C = this.isPlayerCell && (65534 & n.ownerPlayerId) == l.selfUserId,
                            x = this.isPlayerCell && n.ownerPlayerId == a.activeSelfPlayerId;
                        e && (this.SetupLabel(this.nameLabel), this.SetupLabel(this.massLabel));
                        var _ = this.isPlayerCell && !r.gs.uconfig.ShowCircularName && r.gs.uconfig.ShowName && !(!r.gs.uconfig.ShowSelfName && C) && "" != p.fullName,
                            w = r.gs.uconfig.ShowMass && (this.isPlayerCell || this.isVirus),
                            k = _ && p.fullName ? p.fullName : null,
                            I = w ? n.mass : -1,
                            P = this.isVirus ? 16777215 : g.color;
                        this.UpdateLabels(k, I, P);
                        var M = -1,
                            T = -1,
                            R = -1,
                            U = -1,
                            A = !1;
                        if (this.isPlayerCell ? M = p.colors[u] : this.isFood ? M = p.colors[u] : this.isFunnel ? M = p.colors[u] : this.isPellet && (M = n.color), this.isPlayerCell) {
                            if (r.gs.uconfig.ShowSplitPrediction && x) {
                            var E = n.splitOrderWeight,
                                    F = i.Nums.MapTo(E, .9, .58);
                            if (r.gs.uconfig.ShowHalfSplit && x) {
                                var half = n.isHalfSplit;
                                    if(half && n == halfbiggest){
                                        T = o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clHalfMarker"))
                                    }
                                    else{
                                        T = 16777215 & o.ColorHelper.ColorFromHSVA(F, 1, 1, 1)
                                    }
                                }else{
                                    T = 16777215 & o.ColorHelper.ColorFromHSVA(F, 1, 1, 1)
                                }
                            }
                            else if (r.gs.uconfig.ShowCellRing) {
                                var temp = o.ColorHelper.invertColor(o.ColorHelper.ColorToHtmlString(l.colors[a]));
                                if (r.gs.uconfig.ShowHalfSplit && x) {
                                var half = n.isHalfSplit;
                                    if(half && n == halfbiggest){
                                        T = o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clHalfMarker"))
                                    }
                                    else{
                                        T = o.ColorHelper.ColorFromHtmlString(temp)
                                    }
                                }else{
                                    T = o.ColorHelper.ColorFromHtmlString(temp)
                                }
                            }
                            else if (r.gs.uconfig.ShowOrderRing2 && self.includes(d) && !r.gs.uconfig.ShowOrderRing) {
                                if (r.gs.uconfig.ShowHalfSplit && x) {
                                var half = n.isHalfSplit;
                                    if(half && n == halfbiggest){
                                        T = o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clHalfMarker"))
                                    }
                                    else{
                                        T =o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clMarkerRing"))
                                    }
                                }
                                else{
                                    T = o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clMarkerRing2"))
                                }
                            }
                            else if (r.gs.uconfig.ShowOrderRing && x && !r.gs.uconfig.ShowOrderRing2) {
                                if (r.gs.uconfig.ShowHalfSplit && x) {
                                var half = n.isHalfSplit;
                                    if(half && n == halfbiggest){
                                        T = o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clHalfMarker"))
                                    }
                                    else{
                                        T = o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clMarkerRing"))
                                    }
                                }
                                else{
                                    T = o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clMarkerRing"))
                                }
                            }
                            else{
                                if (r.gs.uconfig.ShowHalfSplit && x) {
                                var half = n.isHalfSplit;
                                    if(half && n == halfbiggest){
                                        T = o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clHalfMarker"))
                                    }
                                }
                            }
                            if (r.gs.uconfig.ShowMassMarker && !x) {
                                var N = n.sizeLevel,
                                    O = r.gs.uconfig.MarkerExtend ? [o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clMarkerA")), o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clMarkerB")), o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clMarkerC")), o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clMarkerD")), o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clMarkerE")), o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clMarkerF")), o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clMarkerG")), o.ColorHelper.ReplaceAlpha(r.gs.ucolors.GetColor("clMarkerH")), 204] : [16711680, 16737792, 16776960, 56831, 43520, 204];
                                if (-1 != N) {
                                    var D = O[N];
                                    r.gs.uconfig.ShowSkin && (r.gs.uconfig.ShowEnemySkin || y) ? (T = D, A = !m && !y, r.gs.gconfig.ShowAlwaysAllPlayersSkin && (A = !1)) : M = D
                                }
                            }
                            if (r.gs.uconfig.ShowSplitIndicator && r.gs.gstates.isPlaying && !C && n.showMark && (U = n.canEat ? 65280 : 11184810), r.gs.uconfig.ShowAutoSplitAlert && !r.gs.gstates.isBenchmarkMode && n.mass >= 17325) {
                                var H = this.frameTick / 25 * .5 % 1;
                                (H *= 2) > 1 && (H = 2 - H), F = n.mass > 2e4 ? i.Nums.MapTo(H, 0, .33) : i.Nums.MapTo(H, .2875, .725), R = 16777215 & o.ColorHelper.ColorFromHSVA(F, 1, 1, 1)
                            }
                        }
                        let B = this.isPlayerCell || this.isFood;
                        if (this.cellCard, B || h.Utils.Confirm(-1 == T && -1 == R && -1 == U), B && this.cellCard && this.cellCard.skinVisible && (M = -1), this.UpdateDrawing(M, T, A, R, U), this.cellCard && this.cellCard.texture) {
                            this.baseSprite.texture = this.cellCard.texture;
                            var G = this.baseSize / this.cellCard.cardSize;
                            this.baseSprite.scale.x = G, this.baseSprite.scale.y = G
                        }
                        this.UpdateBaseShape(), this.baseSprite.visible = null != this.cellCard
                    }, t.prototype.UpdateInterpolation = function(t, e) {
                        this.frameTick++;
                        const n = r.gs.uconfig;
                        if (2 == n.InterpolationType) {
                            var s = i.Nums.MapTo(n.InterpolationSpeed, .9, .5);
                            this.x = i.Nums.EasyFilter(this.x, this.x1, s), this.y = i.Nums.EasyFilter(this.y, this.y1, s), this.scale = i.Nums.EasyFilter(this.scale, this.scale1, s), this.speedApplyTime -= t, this.speedApplyTime <= 0 && (this.speed = 0);
                            var a = 1 * o.GameHelper.MassToRadius(this.mass),
                                l = r.gs.gconfig.FieldSize;
                            i.Nums.InRange(this.x1, a, l - a) && i.Nums.InRange(this.y1, a, l - a) || (this.speed = 0), this.x1 += Math.cos(this.angle) * this.speed, this.y1 += Math.sin(this.angle) * this.speed
                        } else if (1 == n.InterpolationType) {
                            const t = this.node,
                                i = this.isFood && (!n.ShowPelletSkin || !this.cellCard) || this.isPellet ? 200 : this.baseSize,
                                o = e;
                            t.LinearUpdate(o), this.x = t.x, this.y = t.y, this.scale = 2 * t.r / i
                        } else {
                            var c = performance.now(),
                                h = i.Nums.MapTo(n.InterpolationSpeed, 120, 40),
                                d = i.Nums.Clamp((c - this.time) / h, 0, 1);
                            this.x = i.Nums.Lerp(this.x0, this.x1, d), this.y = i.Nums.Lerp(this.y0, this.y1, d), this.scale = i.Nums.Lerp(this.scale0, this.scale1, d)
                        }
                        this.box.x = this.x, this.box.y = this.y, this.box.scale.x = this.scale, this.box.scale.y = this.scale, this.box.zIndex = this.scale * (this.isPlayerCell || this.isVirus ? 1 : 200 / this.baseSize) + 1e-8 * this.node.nodeId + (this.isInEatableSection ? 100 : 0)
                    }, t.prototype.UpdatePosRadius = function() {
                        this.time = performance.now();
                        const t = this.isFood && (!r.gs.uconfig.Show || !this.cellCard) || this.isPellet ? 200 : this.baseSize;
                        var e = 0 == this.mass,
                            n = this.node.nx,
                            i = this.node.ny,
                            s = this.node.mass,
                            a = 2 * o.GameHelper.MassToRadius(s) / t,
                            l = this.node.motionAngle,
                            c = this.node.motionSpeed;
                        2 == r.gs.uconfig.InterpolationType ? (this.speed = 25 * c / 60 * .6, this.speedApplyTime = 50) : this.speed = 0, e ? (this.x0 = n, this.y0 = i, this.scale0 = a, this.x = n, this.y = i, this.scale = a) : (this.x0 = this.x, this.y0 = this.y, this.scale0 = this.scale), this.x1 = n, this.y1 = i, this.scale1 = a, this.angle = l, this.mass = s
                    }, t.pool = new o.ObjectPool(r.gs.gconfig.MaxCellsNum, function() {
                        return new t
                    }), t
                }(),
                S = function() {
                    function t() {
                        this.delta = 0, this.cells = new Map, this.time0 = Date.now(), this.checkQueue_interval = new d.PerformanceCheckQueue(60), this.checkQueue_duration = new d.PerformanceCheckQueue(60), this.frameIndex = 0
                    }
                    return t.prototype.Initialize = function() {
                        var t = this,
                            i = document.querySelector("#game_canvas_layer_main"),
                            o = {
                                width: i.width,
                                height: i.hight,
                                view: i,
                                antialias: r.gs.uconfig.Antialias,
                                transparent: !0,
                                resolution: r.gs.uconfig.HDMode / 2 + 1,
                                autoDensity: !0
                            };
                        (MAIN_RENDERER = p.autoDetectRenderer(o)).cells = this.cells, this.renderer = MAIN_RENDERER, this.drawingRoot = new p.Container, this.stage = new p.Container, this.drawingRoot.addChild(this.stage), this.fieldGraphics = new c.FieldGraphics(!0), this.stage.addChild(this.fieldGraphics.box);
                        var a = function() {
                            t.fieldGraphics.SetCoordVisibility(r.gs.uconfig.ShowCoord)
                        };
                        r.gs.uconfig.RegisterChangedProc("ShowCoord", a), a(), this.cellsBox = new p.Container, this.stage.addChild(this.cellsBox), n.instance.Initialize(), this.gfs = new e(this), this.stage.addChild(this.gfs.box), s.gameCore.nodeMan.gameViewSyncNodesToListProc = this.SyncNodeListToModel.bind(this), s.gameCore.uMan.userLeavedProc = function(t) {
                            y.instance.OnUserLeaved(t)
                        };
                        var l = function() {
                            var e = window.innerWidth,
                                n = window.innerHeight;
                            t.renderer.resize(e, n), s.gameCore.sight.SetScreenSize(e, n)
                        };
                        l(), window.onresize = l;
                        const h = (t, e, n) => {
                                n = n || 1;
                                const i = document.createElement("canvas"),
                                    o = t + (e ? 400 : 0);
                                i.width = i.height = 2 * o;
                                const r = i.getContext("2d");
                                r.beginPath(), r.fillStyle = "#ffffff", r.shadowColor = "#ffffff", r.shadowBlur = e, r.arc(o, o, t, 0, 2 * Math.PI);
                                for (var s = 0; s < n; s++) r.fill(), r.globalAlpha /= 2;
                                return PIXI.Texture.from(i)
                            },
                            d = () => {
                                const t = document.createElement("canvas"),
                                    e = t.getContext("2d");
                                var n = 150;
                                t.width = 300, t.height = 300;
                                const i = e.createRadialGradient(n, n, 112.5, n, n, n);
                                i.addColorStop(0, "transparent"), i.addColorStop(1, "white"), e.fillStyle = i, e.beginPath(), e.arc(n, n, n, 0, 2 * Math.PI, !1), e.fill();
                                let o = PIXI.Texture.from(t);
                                o.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON, PIXI.Texture.addToCache(o, "Waves")
                            };
                        d();
                        const u = h(100),
                            g = h(200),
                            f = h(400),
                            m = h(100, 50, 1),
                            v = h(200, 100, 1),
                            S = h(400, 200, 1);
                        u.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON, g.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON, f.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON, m.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON, v.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON, S.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON, PIXI.Texture.addToCache(u, "GP_BASE_LOW"), PIXI.Texture.addToCache(g, "GP_BASE_MEDIUM"), PIXI.Texture.addToCache(f, "GP_BASE_HIGH"), PIXI.Texture.addToCache(m, "GP_GLOWING_LOW"), PIXI.Texture.addToCache(v, "GP_GLOWING_MEDIUM"), PIXI.Texture.addToCache(S, "GP_GLOWING_HIGH");
                        const b = () => {
                            const t = document.createElement("canvas"),
                                e = 500;
                            t.width = t.height = 1e3;
                            const n = t.getContext("2d"),
                                i = r.gs.uconfig.PelletCellsAlpha;
                            n.beginPath(), n.fillStyle = "#ffffff", n.shadowColor = "#ffffff", n.shadowBlur = 2e3, n.arc(e, e, 100, 0, 2 * Math.PI), n.fill(), n.globalAlpha = i / 2 + .125, n.fill(), n.save(), n.clip(), n.clearRect(0, 0, 1e3, 1e3), n.restore(), n.shadowBlur = 0, n.globalAlpha = i, n.fill();
                            let o = PIXI.Texture.from(t);
                            o.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON, PIXI.Texture.addToCache(o, "GP_GLOWING_PELLET")
                        };
                        b(), r.gs.uconfig.RegisterChangedProc("PelletCellsAlpha", b)
                    }, t.prototype.StartAnimation = function() {
                        var t = this,
                            e = function() {
                                requestAnimationFrame(e), o.TimeChecker.Start("FrameProc"), t.FrameProc(), o.TimeChecker.Stop(), t.updateWaves()
                            };
                        e(), this.UpdatePerf(), this.wave_Sprite = new p.Sprite, this.wave_Sprite.anchor.x = .5, this.wave_Sprite.anchor.y = .5, t.stage.addChild(this.wave_Sprite), this.wave_Sprite.texture = PIXI.utils.TextureCache.Waves, this.wave_Sprite.visible = !1
                    }, t.prototype.FrameProc = function() {
                        this.frameIndex++;
                        var t = r.gs.usupport.TargetFrameRate;
                        r.gs.gstates.isBenchmarkMode && (t = 60);
                        var e = 60 / t;
                        if (this.frameIndex % e == 0 && (o.PageHelper.Instance.Update(), o.PageHelper.Instance.IsActive)) {
                            r.gs.gstates.isBenchmarkMode && s.gameCore.benchDataFeeder.FrameUpdateProc(), s.gameCore.sight.UpdateFrame();
                            var n = performance.now();
                            y.instance.UpdateCardDrawingQueue();
                            var i = performance.now(),
                                a = i - this.time0;
                            this.time0 = i;
                            let t = .5 * this.delta;
                            this.cells.forEach(function(e) {
                                e.UpdateInterpolation(a, i + t), e.UpdateGraphicsForFrame(), r.gs.uconfig.TogglePlayerTransparentCells && e.isPlayerCell ? (e.baseSprite.alpha = r.gs.uconfig.PlayerCellsAlpha, e.baseShape.alpha = r.gs.uconfig.PlayerCellsAlpha, e.overShape.fillAlpha = 0) : r.gs.uconfig.GlowingNonPlayerCells || !e.isFood && !e.isPellet ? (e.baseSprite.alpha = 1, e.baseShape.alpha = 1, e.overShape.fillAlpha = 1) : (e.baseSprite.alpha = r.gs.uconfig.PelletCellsAlpha, e.baseShape.alpha = r.gs.uconfig.PelletCellsAlpha, e.overShape.fillAlpha = 0)
                            }), this.gfs.Update(), this.checkQueue_interval.Push(a), this.cellsBox.sortChildren(), this.UpdateStagePlacement(), this.fieldGraphics.SetScale(r.gs.gconfig.FieldSize / this.fieldGraphics.baseSize), this.renderer.render(this.drawingRoot);
                            var l = performance.now() - n;
                            this.delta = (this.delta + performance.now() - i) / 2, this.checkQueue_duration.Push(l)
                        }
                    }, t.prototype.UpdatePerf = function() {
                        setTimeout(this.UpdatePerf.bind(this), 1e3), o.TimeChecker.Start("UpdatePerf");
                        var t = s.gameCore.perfModel,
                            e = this.checkQueue_duration.GetAverageValue();
                        t.avgDuration = e, t.avgRate = e / 17;
                        var n = this.checkQueue_interval.GetAverageValue();
                        t.avgFps = 1e3 / n, t.numCellsRendered = this.cells.size, o.TimeChecker.Stop()
                    }, t.prototype.updateWaves = function() {
                        let t = gVar.Waves;
                        for (let e = t.length - 1; e >= 0; e--) {
                            this.wave_Sprite.visible = !0;
                            let n = (Date.now() - t[e].time) / 2;
                            this.wave_Sprite.position.x = t[e].x, this.wave_Sprite.position.y = t[e].y, this.wave_Sprite.scale.set(1 + .01 * n), this.wave_Sprite.alpha -= 1e-4 * n / 5, n > t[e].wavelength && (gVar.Waves.splice(e, 1), this.wave_Sprite.visible = !1, this.wave_Sprite.alpha = 1)
                        }
                    }, t.prototype.UpdateStagePlacement = function() {
                        var t = this.stage,
                            e = s.gameCore.sight,
                            n = e.scw / 2 - e.eyeX * e.eyeScale,
                            i = e.sch / 2 - e.eyeY * e.eyeScale;
                        t.position.x = n, t.position.y = i, t.scale.x = e.eyeScale, t.scale.y = e.eyeScale
                    }, t.prototype.SyncNodeListToModel = function() {
                        var t = this,
                            e = s.gameCore.nodeMan,
                            n = new Set(this.cells.keys()),
                            i = new Set;
                        e.nodes.forEach(function(t) {
                            0 == t.cellType && (s.gameCore.uMan.GetUserInfoById(t.ownerPlayerId), i.add(t.ownerPlayerId))
                        }), i.forEach(function(t) {
                            y.instance.GetCellCard(t, !0).Update()
                        }), e.nodes.forEach(function(e) {
                            var i = e.nodeId,
                                o = t.cells.get(i);
                            o || ((o = v.Gain()).Initialize(e), t.cells.set(i, o), t.cellsBox.addChild(o.box)), o.UpdateProps(e), n.delete(i)
                        }), n.forEach(function(e) {
                            var n = t.cells.get(e);
                            t.cellsBox.removeChild(n.box), t.cells.delete(e), n.Release()
                        })
                    }, t
                }();
            t.GameView = S
        }(e.GameViewDomain2 || (e.GameViewDomain2 = {}))
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(0),
            o = n(4),
            r = function() {
                function t() {}
                return t.prototype.Initialize = function(t) {
                    this.ctx = t.getContext("2d"), this.sz = t.width, o.gameCore.gameHudModel.chartDataHandlerProc = this.PostTeamRankingData.bind(this)
                }, t.prototype.NormAngleToChartAngle = function(t) {
                    var e = Math.PI;
                    return .5 * -e + t * e * 2
                }, t.prototype.PostTeamRankingData = function(t) {
                    if (i.gs.uconfig.ShowLeaderboard || !i.gs.gconfig.ShowTeamRanking) {
                        var e = this.ctx,
                            n = this.sz / 2,
                            o = this.sz / 2,
                            r = Math.PI;
                        e.font = "16px CustomFont1, メイリオ, Arial", e.fillStyle = "#CCC", e.clearRect(0, 0, this.sz, this.sz), e.beginPath(), e.arc(n, n, o, 0, 2 * r, !1), e.fill();
                        for (var s = 0, a = 0, l = t; a < l.length; a++) {
                            var c = (m = l[a]).name,
                                h = m.colorStr,
                                d = 1e-4 * m.score;
                            e.fillStyle = h, e.beginPath();
                            var u = this.NormAngleToChartAngle(s),
                                p = this.NormAngleToChartAngle(s + d);
                            e.moveTo(n, n), e.lineTo(n + Math.cos(u) * o, n + Math.sin(u) * o), e.arc(n, n, o, u, p, !1), e.lineTo(n, n), e.stroke(), e.fill(), s += d
                        }
                        e.beginPath(), e.arc(n, n, o, 0, 2 * r, !1), e.stroke(), s = 0;
                        for (var g = 0, f = t; g < f.length; g++) {
                            var m;
                            if (c = (m = f[g]).name, d = 1e-4 * m.score, u = this.NormAngleToChartAngle(s), p = this.NormAngleToChartAngle(s + d), d > .07) {
                                var y = (u + p) / 2,
                                    v = e.measureText(c).width;
                                e.fillStyle = "black";
                                var S = .6 * o;
                                e.fillText(c, n + Math.cos(y) * S - v / 2, n + Math.sin(y) * S + 4)
                            }
                            s += d
                        }
                    }
                }, t
            }();
        e.TeamRankingChartView = r
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        const i = 100,
            o = (new PIXI.Graphics).beginFill(16777215, 1).drawCircle(0, 0, 50).endFill().generateCanvasTexture(1, 2),
            r = (new PIXI.Graphics).lineStyle(24, 16777215).drawCircle(0, 0, 38).generateCanvasTexture(1, 2),
            s = (new PIXI.Graphics).beginFill(16777215, 1).drawCircle(0, 0, 50).endFill().lineStyle(8, 16777215).drawCircle(0, 0, 66).generateCanvasTexture();
        o.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON, r.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON, s.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON, PIXI.Texture.addToCache(o, "MM_BASE"), PIXI.Texture.addToCache(r, "MM_ENEMY"), PIXI.Texture.addToCache(s, "MM_SELF");
        var a = n(1),
            l = n(3),
            c = n(0),
            h = n(4),
            d = n(12),
            u = n(6),
            p = function() {
                function t() {
                    this.box = new u.Container, this.box2 = new u.Container, this.box.addChild(this.box2), this.baseShape = new u.Sprite, this.baseShape.anchor.set(.5), this.box2.addChild(this.baseShape), this.box2.alpha = 1, this.nameLabel = new u.Text, this.massLabel = new u.BitmapText("", {
                        fontName: "MINIMAP_MASS"
                    }), this.SetupLabel(this.nameLabel, 0), this.box.addChild(this.nameLabel), this.box.addChild(this.massLabel)
                }
                return t.Gain = function() {
                    return t.pool.Gain()
                }, t.prototype.Release = function() {
                    t.pool.Release(this)
                }, t.prototype.Initialize = function(t, e) {
                    this.playerId = t, this.isBot = e, this.name = null, this.shortName = null, this.color = 0, this.mass = 0, this.x = 0, this.y = 0, this.scale = 0, this.x1 = 0, this.y1 = 0, this.scale1 = 0, this.updated = !0, this.isSelfNode = !0, this.isTeammate = !1, this.nameLabel.style.fill = "#FFFFFF", this.nameLabel.text = null, this.massLabel.text = this.mass, this.nameLabel.visible = !e
                }, t.prototype.SetupLabel = function(t) {
                    t.style.fontFamily = "Meiryo, Arial", t.style.fontSize = 13, t.style.fill = "#FFFFFF"
                }, t.prototype.SetBasicProps = function(t, e, n, i) {
                    if (this.nameLabel && this.name != t) {
                        var o = this.nameLabel;
                        o.text = t, o.x = -o.width / 2, o.y = -o.height / 2, this.name = t
                    }
                    this.shortName = i, this.teamId = n, this.nameLabel.visible = !this.isBot && !e
                }, t.prototype.UpdateBotDynamicProps = function(t, e) {
                    var n = this.massLabel;
                    if (n.x = n.width / 2, n.y = n.height / 2, this.nameLabel && this.name != e) {
                        var i = this.nameLabel;
                        i.text = e, i.x = -i.width / 2, i.y = -i.height / 2, this.name = e
                    }
                    this.isBot = t, this.nameLabel.visible = !this.isBot && !this.isSelfNode
                }, t.prototype.SetVariableProps = function(t, e, n) {
                    this.isTeammate = e;
                    const i = c.gs.gstates;
                    if (this.color != t || this.isSelfNode != n) {
                        this.isSelfNode = n, this.baseShape.tint = this.color = t;
                        var o = l.ColorHelper.ColorToHtmlString(t);
                        this.nameLabel && (this.nameLabel.style.fill = o)
                    }
                    i.isSpectate && !i.isDeadSpectation ? (this.isSelfNode ? this.baseShape.texture = PIXI.utils.TextureCache.MM_SELF : this.baseShape.texture = PIXI.utils.TextureCache.MM_BASE, this.baseShape.alpha = 1, this.nameLabel.alpha = 1) : (this.isSelfNode ? this.baseShape.texture = PIXI.utils.TextureCache.MM_SELF : (this.isTeammate || this.isBot) && (this.baseShape.texture = PIXI.utils.TextureCache.MM_BASE), this.baseShape.alpha = this.isBot ? .75 : this.isTeammate ? 1 : .375, this.nameLabel.alpha = this.isTeammate ? 1 : .75), this.box.visible = !0
                }, t.prototype.UpdateInterpolation = function() {
                    var t;
                    (this.x = a.Nums.EasyFilter(this.x, this.x1, .99), this.y = a.Nums.EasyFilter(this.y, this.y1, .99), this.box.x = this.x, this.box.y = this.y, this.box2.scale.x = this.scale, this.box2.scale.y = this.scale, this.scale = a.Nums.EasyFilter(this.scale, this.scale1, .99), this.nameLabel) && ((t = this.nameLabel).y = -t.height - 40 * this.scale);
                    if (this.massLabel) {
                        var t = this.massLabel;
                        const e = this.mass;
                        t.alpha = e > 5600 ? this.isTeammate ? 0 : Math.min(e / 12500 + .2, .95) : 0, t.y = -t.height / 1.5, t.x = -t.width / 2
                    }
                }, t.prototype.SetPosRadius = function(e, n, i) {
                    var o = t.mapCoordScale;
                    e *= o, n *= o;
                    var r = 0 == this.mass;
                    this.mass = i, this.box._zIndex = i, this.massLabel.text = (i / 100 >> 0) / 10 + "K";
                    var s = l.GameHelper.MassToRadius(i);
                    s *= o, s *= .75, this.isSelfNode && s < 4 && (s = 4);
                    var a = 2 * s / t.CellBaseSize;
                    this.x1 = e, this.y1 = n, this.scale1 = a, r && (this.x = e, this.y = n, this.scale = a, this.box.x = e, this.box.y = n, this.box2.scale.x = a, this.box2.scale.y = a)
                }, t.mapCoordScale = .01, t.CellBaseSize = i, t.pool = new l.ObjectPool(c.gs.gconfig.MaxPlayerUnitNum, function() {
                    return new t
                }), t
            }(),
            g = function() {
                function t() {
                    this.box = new u.Container, this.gr = new u.Graphics, this.box.addChild(this.gr), this.box.zIndex = 100
                }
                return t.prototype.Update = function() {
                    var t = h.gameCore.sight,
                        e = this.gr,
                        n = p.mapCoordScale;
                    if (e.clear(), c.gs.gstates.isRealtimeMode) {
                        var i = c.gs.ucolors.colorDefs.clGameForeground;
                        e.lineStyle(1, i);
                        var o = t.eyeX * n,
                            r = t.eyeY * n,
                            s = c.gs.gconfig.FieldSize * n;
                        e.alpha = .6, e.moveTo(o, 0), e.lineTo(o, s), e.moveTo(0, r), e.lineTo(s, r);
                        var a = t.ScreenToWorld(0, 0),
                            l = a[0],
                            d = a[1],
                            u = t.ScreenToWorld(window.innerWidth, window.innerHeight),
                            g = u[0],
                            f = u[1];
                        l *= n, d *= n, g *= n, f *= n, e.moveTo(l, d), e.lineTo(g, d), e.lineTo(g, f), e.lineTo(l, f), e.lineTo(l, d)
                    }
                }, t
            }(),
            f = function() {
                function t() {
                    this.nodes = new Map, this.mapFrontScreen = new g
                }
                return t.prototype.Initialize = function(t) {
                    var e = this;
                    this.uMan = h.gameCore.uMan, this.sz = t.width;
                    var n = {
                        width: t.width,
                        height: t.height,
                        view: t,
                        antialias: c.gs.uconfig.Antialias,
                        transparent: !0,
                        resolution: c.gs.uconfig.HDMode / 2 + 1,
                        autoDensity: !0
                    };
                    SUB_RENDERER = u.autoDetectRenderer(n), this.renderer = SUB_RENDERER, this.drawingRoot = new u.Container;
                    var i = new d.FieldGraphics(!1);
                    this.drawingRoot.addChild(i.box), i.SetScale(this.sz / i.baseSize), this.stage = new u.Container, this.stage.addChild(this.mapFrontScreen.box), this.drawingRoot.addChild(this.stage);
                    var o = function() {
                        requestAnimationFrame(o), c.gs.uconfig.ShowMap && e.FrameProc()
                    };
                    o(), h.gameCore.gameHudModel.mapDataHandlerProc = this.PostMapData.bind(this)
                }, t.prototype.FrameProc = function() {
                    l.PageHelper.Instance.IsActive && (p.mapCoordScale = this.sz / c.gs.gconfig.FieldSize, this.mapFrontScreen.Update(), this.nodes.forEach(function(t) {
                        return t.UpdateInterpolation()
                    }), this.renderer.render(this.drawingRoot))
                }, t.prototype.PostMapData = function(t) {
                    var e = this;
                    this.nodes.forEach(function(t) {
                        return t.updated = !1
                    });
                    for (var n = 0, i = t; n < i.length; n++) {
                        var o = i[n],
                            r = o.playerId,
                            s = this.nodes.get(r);
                        if (!s) {
                            var a = this.uMan.GetUserInfoById(r);
                            if (-1 == a.clientId) continue;
                            g = a.miniMapName, f = a.isBot, (s = p.Gain()).Initialize(r, f);
                            var l = (65534 & r) == this.uMan.selfUserId;
                            s.SetBasicProps(g, l, a.teamId, a.name), this.stage.addChild(s.box), this.nodes.set(r, s)
                        }
                        var c = this.uMan.GetTeamInfoForUser(r),
                            d = c == this.uMan.selfTeamInfo,
                            u = r == h.gameCore.nodeMan.activeSelfPlayerId;
                        s.SetVariableProps(c.color, d, u), s.SetPosRadius(o.nx, o.ny, o.mass), s.updated = !0;
                        var m = this.uMan.GetUserInfoById(r);
                        if (-1 != m.clientId) {
                            var y = m.miniMapName,
                                v = m.isBot;
                            s.name == y && s.isBot == v || s.UpdateBotDynamicProps(v, y)
                        }
                    }
                    var S = [];
                    this.nodes.forEach(function(t) {
                        return !t.updated && S.push(t)
                    }), S.forEach(function(t) {
                        e.stage.removeChild(t.box), e.nodes.delete(t.playerId), t.Release()
                    }), e.stage.sortChildren()
                }, t
            }();
        e.MapView = f
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(0),
            o = n(3),
            r = n(2),
            s = n(4),
            a = function() {
            return function(senderName, message, timeStamp, nameColor, skinUrl ,tripKey) {
                this.senderName = senderName,
                    this.message = message,
                    this.timeStamp = timeStamp,
                    this.nameColor = nameColor,
                    this.skinUrl = skinUrl,
                    this.tripKey = tripKey
            }
        }();
        e.ChatMessage = a;
        var l = function() {
            function t(t) {
                this.text = "", this.color = "", this.score = "", this.active = !1, this.index = t
            }
            return t.prototype.setData = function(t, e, n) {
                this.text = t, this.color = e, this.score = n, this.active = !0
            }, t.prototype.setNoData = function() {
                this.active = !1
            }, t
        }();
        e.LeaderboardEntry = l;
        var c = function() {
            function t() {
                this.leaderboardEntries = [], this.teamRankingEntries = [], this.chatMessages = [], this.selfScore = 0, this.maxScore = 0, this.leaderboardHeaderText = ""
            }
            return t.prototype.insertStubChatMessages = function() {
                for (var t = 0; t < 2; t++) this.PostChatMessage("テスト" + t, "テスト", "0:00", null)
            }, t.prototype.insertStubData = function() {}, t.prototype.Initialize = function() {
                this.leaderboardHeaderText = r.AppConfigurator.instance.leaderboardHeaderText;
                for (var t = 0; t < 10; t++)(e = new l(t)).setNoData(), this.leaderboardEntries.push(e);
                for (t = 0; t < 4; t++) {
                    var e;
                    (e = new l(t)).setNoData(), this.teamRankingEntries.push(e)
                }
                this.insertStubData()
            }, t.prototype.SetAimPlayerClient = function(t) {
                if (this.specTargetUserId != t) {
                    if (this.specTargetUserId = t, t >= 0 && t != s.gameCore.uMan.selfUserId) {
                        var e = s.gameCore.uMan.GetUserInfoById(t);
                        this.specTargetName = e.fullName
                    } else this.specTargetName = null;
                    this.isHudUpdated = !0
                }
            }, t.prototype.SetSpecTargetScore = function(t) {
                this.specTargetScore = t, this.isHudUpdated = !0
            }, t.prototype.PostServerStatusData = function(t) {
                o.PageHelper.Instance.IsActive && (this.serverStatusText = t.split(/\r?\n/), this.isHudUpdated = !0)
            }, t.prototype.PostLatencyData = function(t) {
                this.latencyMs = t, this.isHudUpdated = !0
            }, t.prototype.PostServerUserNumData = function(t, e, n, i) {
                var o = t + e + " / " + i + " (ᴘʟᴀʏ: " + t + ", ꜱᴘᴇᴄ: " + e + "), ʙᴏᴛ: " + n;
                this.serverUserNumText = o, this.isHudUpdated = !0
            }, t.prototype.PostLeaderboardData = function(t) {
                if (o.PageHelper.Instance.IsActive && i.gs.uconfig.ShowLeaderboard) {
                    for (var e = 0; e < this.leaderboardEntries.length; e++) {
                        var n = this.leaderboardEntries[e];
                        if (e < t.length) {
                            var r = t[e];
                            n.setData(r.name, r.colorStr, (.001 * r.score).toFixed(1) + "k")
                        } else n.setNoData()
                    }
                    this.isHudUpdated = !0
                }
            }, t.prototype.PostTeamRankingData = function(t) {
                if (o.PageHelper.Instance.IsActive) {
                    if (i.gs.uconfig.ShowLeaderboard) {
                        for (var e = 0; e < this.teamRankingEntries.length; e++) {
                            var n = this.teamRankingEntries[e];
                            if (e < t.length) {
                                var r = t[e];
                                n.setData(r.name, r.colorStr, (.01 * r.score).toFixed(1) + "%")
                            } else n.setNoData()
                        }
                        this.isHudUpdated = !0
                    }
                    this.chartDataHandlerProc(t)
                }
            }, t.prototype.PostMapData = function(t) {
                i.gs.uconfig.ShowMap && this.mapDataHandlerProc(t)
            }, t.prototype.ClearChatMessages = function() {
                this.chatMessages = [], this.isHudUpdated = !0
            }, t.prototype.PostChatMessage = function(t, e, n, i, skin, trip) {
                i || (i = "#0CF");
                var o = new a(e, n, t, i, skin, trip);
                this.chatMessages.push(o), this.isHudUpdated = !0
            }, t.prototype.PostServerDisplayMessage = function(t) {
                this.serverDisplayMessageText = t, this.isHudUpdated = !0
            }, t.prototype.PostServerInstructionText = function(t) {
                this.serverInstructionProc(t)
            }, t.prototype.ResetMaxScore = function() {
                this.maxScore = 0, this.selfScore = 0
            }, t.prototype.PostSelfScoreData = function(t) {
                this.selfScore = t, this.maxScore = Math.max(this.maxScore, t), this.isHudUpdated = !0
            }, t.prototype.SetSplitNum = function(t) {
                this.splitNum = t, this.isHudUpdated = !0
            }, t
        }();
        e.GameHudModel = c
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(2),
            o = n(3),
            r = n(0),
            s = function() {};
        e.ServerInfo = s;
        var a = function() {
            function t(t) {
                this.gameCore = t;
                var e = o.AppHelper.GetQueryObject();
                this.showAll = 1 == e.showall
            }
            return t.prototype.Start = function() {
                this.langCode = navigator.language.slice(0, 2), this.UpdateList()
            }, t.prototype.ConnectToServer = function(t) {
                if (Date.now() - r.gs.gstates.playerDeadTimeStamp < 2e3) console.log("server selection cancelled");
                else {
                    var e = t.address;
                    this.currentServerUri = e, localStorage.setItem("connTargetUri", e);
                    var n = t.modName;
                    this.gameCore.ConnectToGameServerEx("ws://" + e, n)
                }
            }, t.prototype.FilterServers = function(t) {
                var e = this;
                if (t.forEach(function(t) {
                        t.modName = t.name, t.numClients = t.numPlayers + t.numSpectors, t.order += t.mirrorIndex, -1 != t.mirrorIndex && (t.modName += t.mirrorIndex), t.langCode && e.langCode != t.langCode && (t.visible = !1)
                    }), !this.showAll) {
                    for (var n = {}, i = 0, o = t; i < o.length; i++) n[(a = o[i]).name + a.mirrorIndex] = a;
                    for (var r = 0, s = t; r < s.length; r++) {
                        var a, l = a = s[r],
                            c = n[a.name + (a.mirrorIndex - 1)];
                        c && (c.numClients > c.numMaxClients - 25 || l.numClients > 10 || (l.visible = !1))
                    }
                }
                return t.filter(function(t) {
                    return t.visible
                }).sort(function(t, e) {
                    return t.order - e.order
                })
            }, t.prototype.UpdateList = function() {
                var t = this,
                    e = i.AppConfigurator.instance.trackerServerUri,
                    n = i.AppConfigurator.instance.trackerServerTargetSite;
                $.ajax({
                    type: "GET",
                    url: e + "/list",
                    data: {
                        targetSite: n
                    },
                    success: function(e) {
                        if (t.serverInfos = t.FilterServers(e), null == t.currentServerUri && t.serverInfos.length > 0) {
                            var n = localStorage.getItem("connTargetUri"),
                                i = null;
                            if (n)
                                for (var o = 0, r = t.serverInfos; o < r.length; o++) {
                                    var s = r[o];
                                    if (s.address == n) {
                                        i = s;
                                        break
                                    }
                                }
                            i || (i = t.serverInfos[0]), t.ConnectToServer(i)
                        }
                        t.Notify()
                    }
                }), setTimeout(this.UpdateList.bind(this), 5e3)
            }, t
        }();
        e.ServerListModel = a
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(1),
            o = n(0),
            r = n(3),
            s = function() {
                function t() {}
                return t.AllocatePool = function() {
                    null == this.pool && (this.pool = new r.ObjectPool(1e3, function() {
                        return new t
                    }))
                }, t.prototype.Initialize = function(e) {
                    this.nodeId = t.seqId++, this.ownerPlayerId = e, this.counter = 0;
                    var n = o.gs.gconfig.FieldSize;
                    this.x = i.Nums.RandF() * n, this.y = i.Nums.RandF() * n;
                    var s = i.Nums.RandF();
                    this.mass = i.Nums.MapTo(s * s * s, 500, 22500) >> 0, this.color = r.GameHelper.GenarateRandomColor(), this.m_angle = i.Nums.RandF() * Math.PI * 2, this.speed = i.Nums.MapTo(i.Nums.RandF(), 20, 80), this.nr = r.GameHelper.MassToRadius(this.mass)
                }, t.prototype.Update = function() {
                    this.x += Math.cos(this.m_angle) * this.speed, this.y += Math.sin(this.m_angle) * this.speed, this.counter++ % 4 == 0 && (this.mass += 100 * Math.random() - 50, this.mass = Math.max(Math.min(this.mass >> 0, 22500), 500));
                    var t = 1.1 * this.nr,
                        e = o.gs.gconfig.FieldSize;
                    i.Nums.InRange(this.x, t, e - t) || (this.m_angle = Math.PI - this.m_angle), i.Nums.InRange(this.y, t, e - t) || (this.m_angle = -this.m_angle)
                }, t.seqId = 0, t
            }(),
            a = function() {
                function t(t) {
                    this.nodes = [], this.tick = 0, this.gameCore = t
                }
                return t.prototype.Start = function() {
                    this.playerIds = this.gameCore.uMan.GetPlayerIdsAvailable(), s.AllocatePool(), this.averageFps = 60, this.t0 = performance.now();
                    for (var t = 0; t < 700; t++);
                }, t.prototype.AddNode = function() {
                    var t = i.Nums.RandI(this.playerIds.length),
                        e = this.playerIds[t],
                        n = s.pool.Gain();
                    n.Initialize(e), this.nodes.push(n)
                }, t.prototype.RemoveNode = function() {
                    var t = this.nodes.shift();
                    t && (s.pool.Release(t), this.gameCore.nodeMan.PostNodeRemoval(t.nodeId))
                }, t.prototype.ClearNodes = function() {
                    for (var t = 0, e = this.nodes; t < e.length; t++) {
                        var n = e[t];
                        s.pool.Release(n), this.gameCore.nodeMan.PostNodeRemoval(n.nodeId)
                    }
                    this.nodes = []
                }, t.prototype.FrameUpdateProc = function() {
                    var t = performance.now(),
                        e = 1e3 / (t - this.t0);
                    this.t0 = t, this.averageFps = i.Nums.EasyFilter(this.averageFps, e, .95), this.tick++, this.tick % 2 == 0 && (this.averageFps > 55 ? this.AddNode() : this.RemoveNode());
                    var n = this.gameCore.nodeMan;
                    this.nodes.forEach(function(t) {
                        t.Update(), n.PostNodeData(t.nodeId, 0, t.x, t.y, t.mass, t.ownerPlayerId, t.color, t.m_angle, t.speed)
                    }), n.SyncGameViewToModel()
                }, t.prototype.Stop = function() {
                    this.ClearNodes()
                }, t
            }();
        e.PerfBenchDataFeeder = a
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = function() {
            function t(t) {
                this.ar = [], t && (t instanceof Array ? this.AddRange(t) : this.Add(t))
            }
            return Object.defineProperty(t.prototype, "array", {
                get: function() {
                    return this.ar
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.Count = function(t) {
                if (t) {
                    var e = 0;
                    return this.ar.forEach(function(n) {
                        t(n) && e++
                    }), e
                }
                return this.ar.length
            }, t.prototype.Add = function(t) {
                this.ar.push(t)
            }, t.prototype.AddUnique = function(t) {
                this.Contains(t) || this.ar.push(t)
            }, t.prototype.AddRange = function(t) {
                var e;
                (e = this.ar).push.apply(e, t)
            }, t.prototype.Clear = function() {
                this.ar.splice(0, this.ar.length)
            }, t.prototype.RemoveAt = function(t) {
                this.ar.splice(t, 1)
            }, t.prototype.Remove = function(t) {
                var e = this.ar.indexOf(t);
                e >= 0 && this.ar.splice(e, 1)
            }, t.prototype.RemoveAll = function(t) {
                var e = this;
                this.ar.filter(function(e) {
                    return t(e)
                }).forEach(function(t) {
                    return e.Remove(t)
                })
            }, t.prototype.Contains = function(t) {
                return this.ar.indexOf(t) >= 0
            }, t.prototype.First = function(t) {
                return 0 == this.ar.length ? null : t ? this.ar.filter(t)[0] : this.ar[0]
            }, t.prototype.FirstOrDefault = function(t, e) {
                return 0 == this.ar.length ? e : t ? this.ar.filter(t)[0] : this.ar[0]
            }, t.prototype.Product = function(e) {
                return new t(this.ar.filter(function(t) {
                    return e.Contains(t)
                }))
            }, t.prototype.Except = function(e) {
                return new t(this.ar.filter(function(t) {
                    return e.ar.every(function(e) {
                        return t != e
                    })
                }))
            }, t.prototype.Concat = function(e) {
                return new t(this.ar.concat(e.ar))
            }, t.prototype.Distinct = function() {
                var e = new t;
                return this.ar.forEach(function(t) {
                    e.Contains(t) || e.Add(t)
                }), e
            }, t.prototype.Union = function(t) {
                var e = this.ToList();
                return t.ar.forEach(function(t) {
                    e.Contains(t) || e.Add(t)
                }), e
            }, t.prototype.ForEach = function(t) {
                for (var e = 0; e < this.ar.length; e++) t(this.ar[e])
            }, t.prototype.Where = function(e) {
                return new t(this.ar.filter(e))
            }, t.prototype.Select = function(e) {
                return new t(this.ar.map(e))
            }, t.prototype.LimitCount = function(e) {
                return e < this.ar.length ? new t(this.ar.slice(0, e)) : this
            }, t.prototype.Sort = function(e) {
                return new t(this.ar.sort(e))
            }, t.prototype.GroupBy = function(e) {
                var n = {};
                this.ar.forEach(function(i) {
                    var o = e(i);
                    n[o] || (n[o] = new t), n[o].Add(i)
                });
                var i = new t;
                for (var o in n) i.ar.push(n[o]);
                return i
            }, t.prototype.Take = function(e) {
                return new t(e > 0 ? this.ar.slice(0, e) : this.ar.slice(e))
            }, t.prototype.TakeNFromTail = function(e) {
                return new t(this.ar.slice(-e))
            }, t.prototype.Skip = function(e) {
                return e > this.ar.length ? new t : new t(this.ar.slice(e))
            }, t.prototype.All = function(t) {
                for (var e = 0, n = this.ar; e < n.length; e++)
                    if (!t(n[e])) return !1;
                return !0
            }, t.prototype.Any = function(t) {
                for (var e = 0, n = this.ar; e < n.length; e++)
                    if (t(n[e])) return !0;
                return !1
            }, t.prototype.ToArray = function() {
                return this.ar.slice(0)
            }, t.prototype.ToList = function() {
                return new t(this.ar.slice(0))
            }, t.prototype.Min = function(t) {
                var e = t ? this.ar.map(t) : this;
                return Math.min.apply(Math, e)
            }, t.prototype.Max = function(t) {
                var e = t ? this.ar.map(t) : this;
                return Math.max.apply(Math, e)
            }, t.prototype.Sum = function(t) {
                return 0 == this.Count() ? 0 : (t ? this.ar.map(t) : this).reduce(function(t, e) {
                    return t + e
                })
            }, t.prototype.SafeSum = function(t) {
                return this.Sum(t)
            }, t.prototype.Average = function(t) {
                return 0 == this.Count() ? 0 : this.Sum(t) / this.ar.length
            }, t.prototype.OrderBy = function(e) {
                var n = this.ar.slice(0);
                return n.sort(function(t, n) {
                    return e(t) - e(n)
                }), new t(n)
            }, t.prototype.OrderByDescending = function(e) {
                var n = this.ar.slice(0);
                return n.sort(function(t, n) {
                    return e(n) - e(t)
                }), new t(n)
            }, t.prototype.SelectMany = function(e) {
                var n = new t;
                return this.ar.forEach(function(t) {
                    var i = e(t);
                    n.AddRange(i.ar)
                }), n
            }, t.prototype.IndicesOf = function(e) {
                for (var n = [], i = 0; i < this.ar.length; i++) this.ar[i] == e && n.push(i);
                return new t(n)
            }, t.prototype.SafeTake = function(t) {
                return this.Take(Math.min(t, this.ar.length))
            }, t.prototype.Reverse = function() {
                return new t(this.ar.reverse())
            }, t.prototype.Shift = function() {
                return this.ar.shift()
            }, t
        }();
        e.List = i
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(2),
            o = n(32),
            r = n(1),
            s = n(3),
            a = new function() {
                this.ChatAppCoreVersion = "ChatAppCore B100", this.MessageMaxLength = 140, this.ProfileCommentMaxLength = 60
            },
            l = function() {
                this.Sessions = "Session", this.TeamMembers = "Team Members", this.AllUsers = "All Users", this.Online = "Online", this.Offline = "Offline", this.Advertisement = "AD", this.Name = "Name", this.Skin = "Skin", this.Comment = "Comment", this.ShowTripKey = "Show Trip Key", this.Blocked = "Blocked", this.BlockedMessageNotification = "You are blocked by the peer. This message has not been sent.", this.DeleteMessage = "Delete Message", this.BlockUnblock = "Block/Unblock", this.AppInstruction0 = "An advanced chat system designed for agar private servers. There are server-wide chat, team-specific chat, and private chat between two users. Server administator has no concern in private chat.", this.AppInstruction1 = "Name and skin url are set on the main game window. Either server-wide chat or team-specific chat is synchronized to the chat on game screen (depends on the setting of game server)."
            },
            c = function() {
                this.Sessions = "セッション", this.TeamMembers = "チームメンバー", this.AllUsers = "すべてのユーザー", this.Online = "オンライン", this.Offline = "オフライン", this.Advertisement = "広告", this.Name = "名前", this.Skin = "スキン", this.Comment = "コメント", this.ShowTripKey = "トリップキーを表示", this.Blocked = "ブロック中", this.BlockedMessageNotification = "ブロックされています。この発言は相手に届いていません。", this.DeleteMessage = "メッセージを削除", this.BlockUnblock = "ブロック/解除", this.AppInstruction0 = "agarのプライベートサーバ向けに設計されたチャットシステムです。サーバ全体での会話,チーム毎の会話,ユーザ間での個別の会話があります。サーバ管理者はユーザ同士の個別の会話の内容には関知しません。", this.AppInstruction1 = "名前とスキンURLはゲーム画面で設定したものが使われます。全体の会話またはチームの会話がゲーム内でのチャットと同期しています(ゲームサーバの設定により異なります)。"
            },
            h = navigator.language.startsWith("ja") ? new c : new l,
            d = n(0).gs.uconfig,
            u = function() {
                function t(t) {
                    this.userId = t
                }
                return Object.defineProperty(t.prototype, "FullName", {
                    get: function() {
                        return this.name
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "GameFullName", {
                    get: function() {
                        return "" + this.team + this.name
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "showTripKey", {
                    get: function() {
                        return !!d.ShowTripKey || this._showTripKey
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                    Object.defineProperty(t.prototype, "ChatTrip", {
                    get: function() {
                        return "(" + this.fullTrip.split("#")[0].substr(2, 4) + ")"
                    },
                    enumerable: !0,
                    configurable: !0
                }),t.prototype.SetProps = function(t) {
                    this.siteSig = t.siteSig, this.serverSig = t.serverSig, this.name = t.name, this.team = t.team, this.code = t.code, this.skinUrl = t.skinUrl, this.skinUrlSmall = t.skinUrlSmall, this.fullTrip = t.fullTrip;
                    const e = t.fullTrip.split("#"),
                        n = e[0],
                        i = e[1];
                    this.shortTrip = n + "|" + i, "" == this.skinUrl && (this.skinUrl = "gr/noimage.gif"), "" == this.skinUrlSmall && (this.skinUrlSmall = "gr/noimage.gif"), this.profileComment = t.profileComment, this._showTripKey = t.showTripKey, this.isPlaying = t.isPlaying, this.serverRoomSig = this.siteSig + "." + this.serverSig, this.teamRoomSig = this.siteSig + "." + this.serverSig + "." + this.team + "." + this.code
                }, t
            }();
        e.ChatUser = u;
        var p = function() {
                function t(t, e, n) {
                    this.text = e, this.messageId = n, t && (this.icon = t.skinUrlSmall, this.userId = t.userId, this.userName = t.GameFullName, this.timeStamp = r.DateTimeHelper.GetHourMinutesString())
                }
                return t.prototype.MakeCopy = function() {
                    var e = new t(null, "", 0);
                    return e.icon = this.icon, e.text = this.text, e.messageId = this.messageId, e.userId = this.userId, e.userName = this.userName, e.timeStamp = this.timeStamp, e
                }, t
            }(),
            g = function() {
                function t(t) {
                    this.sessionId = t, this.messages = new o.List, this.isClosed = !1
                }
                return Object.defineProperty(t.prototype, "IsGroup", {
                    get: function() {
                        return 20 != this.category
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "IsPrivate", {
                    get: function() {
                        return 20 == this.category
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "HeaderName", {
                    get: function() {
                        return 12 == this.category && "" == this.title ? "no-tag" : this.IsGroup ? this.title : this.peer.GameFullName
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "HeaderIcon", {
                    get: function() {
                        return 20 == this.category ? this.peer.skinUrl : 12 == this.category ? "gr/team5a.png" : 11 == this.category ? "gr/web1b.png" : void 0
                    },
                    enumerable: !0,
                    configurable: !0
                }), t.prototype.InitAsGroupSession = function(t, e, n) {
                    this.category = t, this.roomSig = e, this.title = n, this.peer = null
                }, t.prototype.InitAsPrivateSession = function(t) {
                    this.category = 20, this.roomSig = "", this.title = "", this.peer = t
                }, t.prototype.AddMessage = function(t) {
                    this.messages.Add(t), this.reqScroll = !0
                }, t.prototype.RemoveMessage = function(t, e) {
                    var n = this.messages.First(function(e) {
                        return e.messageId == t
                    });
                    if (n && (this.messages.Remove(n), e)) {
                        var i = n.MakeCopy();
                        i.text = h.BlockedMessageNotification, this.messages.Add(i)
                    }
                }, t
            }(),
            f = function() {
                function t() {
                    this.siteSig = "", this.serverSig = "", this.name = "", this.team = "", this.code = "", this.skinUrl = "", this.envSig = "", this.profileComment = "", this.showTripKey = !1
                }
                return t.prototype.GetSequentialSignature = function() {
                    return this.siteSig + "_" + this.serverSig + "_" + this.name + "_" + this.team + "_" + this.code + "_" + this.skinUrl + "_" + this.profileComment + "_" + this.showTripKey + "_" + this.envSig
                }, t
            }(),
            m = function() {
                function t(t) {
                    this.receiver = t
                }
                return Object.defineProperty(t.prototype, "IsConnected", {
                    get: function() {
                        return null != this.ws
                    },
                    enumerable: !0,
                    configurable: !0
                }), t.prototype.SendPacket = function(t) {
                    this.ws && this.ws.readyState == WebSocket.OPEN && this.ws.send(t)
                }, t.prototype.ConnectToChatServer = function() {
                    console.log("connecting to chat server"), this.ws = new WebSocket(a.ChatServerUri), this.ws.onmessage = this.OnWsMessage.bind(this), this.ws.onopen = this.OnWsOpen.bind(this), this.ws.onerror = this.OnWsError.bind(this), this.ws.onclose = this.OnWsClose.bind(this)
                }, t.prototype.Close = function() {
                    this.ws && (this.ws.close(), this.ws = null)
                }, t.prototype.OnWsOpen = function() {
                    this.SendPacket(JSON.stringify({
                        op: "JoinToServer"
                    }))
                }, t.prototype.OnWsClose = function(t) {
                    t.reason && console.log("connection to chat server closed: " + t.reason), this.receiver.SetAvailability(!1), this.receiver.FireChanged()
                }, t.prototype.OnWsError = function(t) {
                    console.log(t)
                }, t.prototype.OnWsMessage = function(t) {
                    s.TimeChecker.Start("OnWsMessage@ExChatAppModel");
                    var e = JSON.parse(t.data),
                        n = e.op;
                    "SelfUserId" == n ? (this.selfUserId = e.userId, this.selfUserId, this.pendingUserInfo && (this.SendSelfEntryInfoCore(this.pendingUserInfo), this.pendingUserInfo = null), this.receiver.SetAvailability(!0)) : "UpdateUserInfos" == n ? this.receiver.UserInfosUpdated(e.infos) : "UpdateFixedGroupSessions" == n ? this.receiver.UpdateFixedGroupSessionInfos(e.infos) : "UpdatePrivateSession" == n ? this.receiver.UpdatePrivateSessionInfo(e.info) : "ChatMessage" == n ? this.receiver.HandleReceivedMessage(e.data) : "MessageRemoval" == n && this.receiver.HandleMessageRemoval(e.data), this.receiver.FireChanged(), s.TimeChecker.Stop()
                }, t.prototype.SendSelfEntryInfoCore = function(t) {
                    var e = JSON.stringify({
                        op: "UpdateUserInfo",
                        userId: this.selfUserId,
                        data: t
                    });
                    this.SendPacket(e)
                }, t.prototype.SendSelfEntryInfo = function(t, e) {
                    this.ws ? this.SendSelfEntryInfoCore(t) : (this.pendingUserInfo = t, e && this.ConnectToChatServer())
                }, t.prototype.RequestStartNewPrivateSession = function(t) {
                    this.SendPacket(JSON.stringify({
                        op: "NewPrivateSession",
                        userId: this.selfUserId,
                        peerUserId: t
                    }))
                }, t.prototype.SendChatMessage = function(t, e) {
                    var n = a.MessageMaxLength;
                    e.length > n && (e = e.substr(0, n));
                    var i = {
                        sessionId: t,
                        userId: this.selfUserId,
                        text: e
                    };
                    this.SendPacket(JSON.stringify({
                        op: "ChatMessage",
                        userId: this.selfUserId,
                        data: i
                    })), this.selfUserId
                }, t.prototype.SendMessageRemoval = function(t, e, n) {
                    var i = {
                        sessionId: t,
                        messageId: e,
                        isBlocked: n
                    };
                    this.SendPacket(JSON.stringify({
                        op: "MessageRemoval",
                        userId: this.selfUserId,
                        data: i
                    }))
                }, t
            }(),
            y = function() {
                this.profileComment = "", this.showTripKey = !1
            },
            v = function() {
                function t() {}
                return t.prototype.Init = function() {
                    var t = i.AppConfigurator.instance.MaxProfileNum;
                    this.profileExData = Array(t);
                    for (var e = 0; e < t; e++) this.profileExData[e] = new y;
                    var n = localStorage.getItem("profileExData");
                    if (n) {
                        var o = JSON.parse(n);
                        if (o && o.length > 0)
                            for (var s = Math.min(t, o.length), a = 0; a < s; a++) r.Objects.CopyObjectProps(this.profileExData[a], o[a])
                    } else this.SaveProfileExData();
                    var l = localStorage.getItem("isUserActive");
                    l ? (this.isUserActive = "1" == l, this.SaveIsActive()) : this.isUserActive = !0;
                    var c = localStorage.getItem("blockedUserTrips");
                    c ? this.blockedUserTrips = JSON.parse(c) : (this.blockedUserTrips = [], this.SaveBlockedUserTrips())
                }, t.prototype.SaveProfileExData = function() {
                    var t = JSON.stringify(this.profileExData);
                    localStorage.setItem("profileExData", t)
                }, t.prototype.SaveIsActive = function() {
                    localStorage.setItem("isUserActive", this.isUserActive ? "1" : "0")
                }, t.prototype.SaveBlockedUserTrips = function() {
                    var t = JSON.stringify(this.blockedUserTrips);
                    localStorage.setItem("blockedUserTrips", t)
                }, t.prototype.SetUserBlockState = function(t, e) {
                    if (e && -1 == this.blockedUserTrips.indexOf(t)) this.blockedUserTrips.push(t), this.SaveBlockedUserTrips();
                    else if (!e && this.blockedUserTrips.indexOf(t) >= 0) {
                        var n = this.blockedUserTrips.indexOf(t);
                        this.blockedUserTrips.splice(n, 1), this.SaveBlockedUserTrips()
                    }
                }, t
            }(),
            S = function() {
                function t() {
                    this.entryInfo = new f, this.entrySeqSig = "", this.allUsers = new o.List, this.allSessions = new o.List, this.tmpSession = new g(0), this.sessionInitialMessage = null, this.loadedProfileIndex = 0, this.storage = new v, this.ShowVersion(), this.bridge = new m(this)
                }
                return Object.defineProperty(t.prototype, "Texts", {
                    get: function() {
                        return h
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "IsUserActive", {
                    get: function() {
                        return this.storage.isUserActive
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "selfUserId", {
                    get: function() {
                        return this.bridge ? this.bridge.selfUserId : 0
                    },
                    enumerable: !0,
                    configurable: !0
                }), t.prototype.SetUserEnvSig = function(t) {
                    this.entryInfo.envSig = t
                }, t.prototype.ShowVersion = function() {
                    console.log(a.ChatAppCoreVersion)
                }, t.prototype.FireChanged = function() {
                    this.procOnChanged && this.procOnChanged()
                }, t.prototype.SetAvailability = function(t) {
                    this.isAvailable = t, console.log("unichat availability: " + t)
                }, t.prototype.DiscardCurrentSessions = function() {
                    this.allSessions.Clear(), this.allUsers.Clear(), this.selfUser = null, this.gameChatSession = null, this.curSession = null
                }, t.prototype.SetUserActive = function(t) {
                    this.storage.isUserActive != t && (this.bridge.IsConnected && !t ? (this.DiscardCurrentSessions(), this.bridge.Close()) : !this.bridge.IsConnected && t && this.bridge.SendSelfEntryInfo(this.selfInfoCash, !0), this.storage.isUserActive = t, this.storage.SaveIsActive())
                }, t.prototype.ChatWindowOpenStateChanged = function(t) {
                    this.isWindowOpen = t, t && (this.chatNotificationBadgeProc && this.chatNotificationBadgeProc(!1), this.chatNotificationTitleProc && this.chatNotificationTitleProc(!1))
                }, t.prototype.SetGameTeamChatSessionEnabled = function(t) {
                    a.GameChatSessionCategory = t ? 12 : 11
                }, t.prototype.SetChatServerUri = function(t) {
                    a.ChatServerUri = t
                }, t.prototype.SetSiteSignature = function(t) {
                    this.entryInfo.siteSig = t
                }, t.prototype.SetServerSignature = function(t, e) {
                    (t != this.entryInfo.serverSig || e) && (this.ClearAllUsersAndSessions(), this.entryInfo.serverSig = t, e && this.SendUserEntryIfChanged(!0))
                }, t.prototype.SetUserEntryInfo = function(t, e, n, o, r) {
                    var s = i.AppConfigurator.instance.MaxProfileNum;
                    if (0 <= r && r < s) {
                        null == r && (r = 0), this.entryInfo.name = t, this.entryInfo.team = e, this.entryInfo.code = n, this.entryInfo.skinUrl = o, this.storage.profileExData || this.storage.Init();
                        var a = this.storage.profileExData[r];
                        this.entryInfo.profileComment = a.profileComment, this.entryInfo.showTripKey = a.showTripKey, this.loadedProfileIndex = r, this.SendUserEntryIfChanged()
                    }
                }, t.prototype.ClearAllUsersAndSessions = function() {
                    var t = this;
                    this.curSession = null, this.allSessions.Clear(), this.allUsers.Where(function(e) {
                        return e != t.selfUser
                    }).ForEach(function(e) {
                        return t.RemoveUser(e)
                    })
                }, t.prototype.SendUserEntryIfChanged = function(t) {
                    void 0 === t && (t = !1);
                    var e = this.entryInfo.GetSequentialSignature();
                    (e != this.entrySeqSig || t) && (this.IsUserActive && this.bridge.SendSelfEntryInfo(this.entryInfo, !0), this.selfInfoCash = this.entryInfo, this.entrySeqSig = e)
                }, t.prototype.UpdateSelfProfileDetail = function(t, e) {
                    var n = a.ProfileCommentMaxLength;
                    e.length > n && (e = e.substr(0, n));
                    var i = this.storage.profileExData[this.loadedProfileIndex];
                    i.profileComment = e, i.showTripKey = t, this.storage.SaveProfileExData(), this.entryInfo.profileComment = e, this.entryInfo.showTripKey = t, this.SendUserEntryIfChanged()
                }, t.prototype.GetUserById = function(t) {
                    return this.allUsers.FirstOrDefault(function(e) {
                        return e.userId == t
                    }, null)
                }, t.prototype.GetSessionById = function(t) {
                    return this.allSessions.FirstOrDefault(function(e) {
                        return e.sessionId == t
                    }, null)
                }, t.prototype.RequestStartNewSession = function(t) {
                    this.bridge.RequestStartNewPrivateSession(t.userId)
                }, t.prototype.CheckValidName = function() {
                    return "" != this.selfUser.name
                }, t.prototype.SendMessageOnCurrentSession = function(t) {
                    this.CheckValidName() && (this.curSession == this.tmpSession ? (this.sessionInitialMessage = t, this.RequestStartNewSession(this.tmpSession.peer)) : this.bridge.SendChatMessage(this.curSession.sessionId, t))
                }, t.prototype.SendMessageOnGameChatSession = function(t) {
                    this.CheckValidName() && this.gameChatSession && this.bridge.SendChatMessage(this.gameChatSession.sessionId, t)
                }, t.prototype.SetUserBlockState = function(t, e) {
                    t.fullTrip != this.selfUser.fullTrip && (t.isBlocked = e, this.storage.SetUserBlockState(t.fullTrip, e))
                }, t.prototype.AddNewUser = function(t) {
                    var e = new u(t.userId);
                    return e.SetProps(t), this.storage.blockedUserTrips.indexOf(e.fullTrip) >= 0 && (e.isBlocked = !0), t.userId == this.selfUserId && (this.selfUser = e), this.allUsers.Add(e), e
                }, t.prototype.RemoveUser = function(t) {
                    var e = this;
                    this.allUsers.Remove(t), t.userId == this.selfUserId ? (this.allSessions.RemoveAll(function(t) {
                        return t.IsPrivate
                    }), this.SelectSession(this.gameChatSession)) : this.allSessions.Where(function(e) {
                        return e.peer == t
                    }).ForEach(function(t) {
                        t.hasNewMessage ? t.isClosed = !0 : e.allSessions.Remove(t)
                    })
                }, t.prototype.UserInfosUpdated = function(t) {
                    var e = this;
                    t.forEach(function(t) {
                        if (0 == t.isAlive)(n = e.GetUserById(t.userId)) && e.RemoveUser(n);
                        else {
                            var n = e.GetUserById(t.userId);
                            t.userId == e.selfUserId && (t.name, t.team), n ? n.serverSig == t.serverSig && n.name == t.name && n.team == t.team ? n.SetProps(t) : (e.RemoveUser(n), e.AddNewUser(t)) : e.AddNewUser(t)
                        }
                    })
                }, t.prototype.UpdateFixedGroupSessionInfos = function(t) {
                    var e = this;
                    t.forEach(function(t) {
                        var n = e.GetSessionById(t.sessionId);
                        n || ((n = new g(t.sessionId)).InitAsGroupSession(t.category, t.roomSig, t.title), e.allSessions.Add(n)), t.category == a.GameChatSessionCategory && (e.gameChatSession = n, e.gameChatSession.sessionId, e.gameChatSession.HeaderName)
                    }), null == this.curSession && (this.curSession = this.gameChatSession);
                    var n = t.map(function(t) {
                        return t.sessionId
                    });
                    this.allSessions.Where(function(t) {
                        return t.IsGroup && -1 == n.indexOf(t.sessionId)
                    }).ForEach(function(t) {
                        return e.allSessions.Remove(t)
                    })
                }, t.prototype.UpdatePrivateSessionInfo = function(t) {
                    var e = this.GetSessionById(t.sessionId);
                    if (!e) {
                        e = new g(t.sessionId);
                        var n = t.userIds[0] == this.selfUserId ? t.userIds[1] : t.userIds[0],
                            i = this.GetUserById(n);
                        e.InitAsPrivateSession(i), this.allSessions.Add(e), this.tmpSession && this.curSession == this.tmpSession && t.userIds[0] == this.tmpSession.peer.userId && (this.curSession = e)
                    }
                    null != this.sessionInitialMessage && (this.curSession = e, this.SendMessageOnCurrentSession(this.sessionInitialMessage), this.sessionInitialMessage = null)
                }, t.prototype.HandleReceivedMessage = function(t) {
                    var e = this.GetSessionById(t.sessionId),
                        n = this.GetUserById(t.userId);
                    if (n && e) {
                        if (n.isBlocked) return void(e.IsPrivate && this.bridge.SendMessageRemoval(e.sessionId, t.messageId, !0));
                        if (e.AddMessage(new p(n, t.text, t.messageId)), e != this.curSession && (e.hasNewMessage = !0), !e.IsGroup && !this.isWindowOpen) {
                            var i = t.text,
                                o = n.skinUrl;
                            this.chatNotificationBadgeProc && this.chatNotificationBadgeProc(!0, o, i), this.chatNotificationTitleProc && this.chatNotificationTitleProc(!0)
                        }
                        e == this.gameChatSession && this.gameChatMessageReceiverProc && this.gameChatMessageReceiverProc(n.ChatFullName, t.text,n.skinUrl,n.ChatTrip)
                    }
                }, t.prototype.HandleMessageRemoval = function(t) {
                    var e = this.GetSessionById(t.sessionId);
                    e && e.RemoveMessage(t.messageId, t.isBlocked)
                }, t.prototype.SelectUser = function(t) {
                    var e = this.allSessions.First(function(e) {
                        return e.peer == t
                    });
                    e ? (this.curSession = e, e.reqScroll = !0, this.FireChanged()) : (this.tmpSession.InitAsPrivateSession(t), this.curSession = this.tmpSession), this.curUser = t
                }, t.prototype.SelectSelfUser = function() {
                    this.curUser = this.selfUser, this.curSession = null
                }, t.prototype.SelectUserById = function(t) {
                    var e = this.GetUserById(t);
                    e && this.SelectUser(e)
                }, t.prototype.RemoveCurrentSessionIfClosed = function() {
                    this.curSession && this.curSession.isClosed && this.allSessions.Remove(this.curSession)
                }, t.prototype.SelectSession = function(t) {
                    this.curSession != t && (this.RemoveCurrentSessionIfClosed(), this.curSession = t, t.reqScroll = !0, t.hasNewMessage = !1, this.curUser = t.IsPrivate ? t.peer : null, this.FireChanged())
                }, t.prototype.SelectMessage = function(t) {
                    this.curMessage = this.GetMessageById(t)
                }, t.prototype.GetMessageById = function(t) {
                    return this.curSession.messages.First(function(e) {
                        return e.messageId == t
                    })
                }, t.prototype.DeleteCurrentMessage = function() {
                    this.curMessage.userId == this.selfUserId && this.bridge.SendMessageRemoval(this.curSession.sessionId, this.curMessage.messageId, !1)
                }, t
            }();
        e.ChatAppModel = S
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(1),
            o = n(0),
            r = n(7),
            s = function() {
                function t(t) {
                    this.initDone = !1, this.tick = 0, this.jumpDurationMs = 2e3, this.teamCircleTimeStamp = 0, this.teamCircleX = 0, this.teamCircleY = 0, this.teamCircleRadius = 0, this.gameCore = t
                }
                return t.prototype.Init = function() {
                    if (!this.initDone) {
                        var t = o.gs.gconfig.FieldSize / 2;
                        this.eyeX = t, this.eyeY = t, this.eyeX1 = t, this.eyeY1 = t, this.eyeScale = .08, this.eyeScale1 = .08, this.gravityX = t, this.gravityY = t, this.aimCursorX = t, this.aimCursorY = t, this.localAimX = t, this.localAimY = t, this.initDone = !0, i.Utils.Confirm(this.scw), this.mouseX = this.scw / 2, this.mouseY = this.sch / 2, this.aimPlayerId = -1
                    }
                }, t.prototype.sendWaves = function(t, e, n, i, o, r) {
                    var s = {
                        x: t,
                        y: e
                    };
                    s.time = Date.now(), s.color = n, s.wavelength = i, s.sender = o, s.moreAnimation = r, gVar.Waves.push(s)
                }, t.prototype.SetScreenSize = function(t, e) {
                    this.scw = t, this.sch = e
                }, t.prototype.ScreenToWorld = function(t, e) {
                    return [(t - this.scw / 2) / this.eyeScale + this.eyeX, (e - this.sch / 2) / this.eyeScale + this.eyeY]
                }, t.prototype.WorldToScreen = function(t, e) {
                    return [(t - this.eyeX) * this.eyeScale + this.scw / 2, (e - this.eyeY) * this.eyeScale + this.sch / 2]
                }, t.prototype.SetServerEyePos = function(t, e) {
                    this.serverEyePosX = t, this.serverEyePosY = e
                }, t.prototype.ShiftScale = function(t) {
                    var e = 1 + .13 * t,
                        n = this.eyeScale1 * e;
                    this.eyeScale1 = i.Nums.Clamp(n, .005, 1.5)
                }, t.prototype.SendSelfAimPosition = function() {
                    if (!stopMouse) {
                        var t = this.ScreenToWorld(this.mouseX, this.mouseY),
                            e = t[0],
                            n = t[1];
                        if (e != this.aimXSent || n != this.aimYSent) {
                            var i = this.gameCore.conn;
                            i && i.SendAimCursor(e, n), this.aimXSent = e, this.aimYSent = n
                        }
                    }
                }, t.prototype.RecordStatePacket = function() {
                    var t = this,
                        e = r.InternalPackets.SightState(t.eyeX, t.eyeY, t.eyeScale, t.aimCursorX, t.aimCursorY, t.splitting, t.aimPlayerId);
                    this.gameCore.dataRecorder.PostInternalRecordingPacket(e)
                }, t.prototype.UpdateFrame = function() {
                    this.UpdateCurrentPosScale();
                    var t = o.gs.gconfig.FieldSize;
                    if (this.eyeX = i.Nums.Clamp(this.eyeX, 0, t), this.eyeY = i.Nums.Clamp(this.eyeY, 0, t), o.gs.gstates.isPlaying) {
                        var e = this.ScreenToWorld(this.mouseX, this.mouseY),
                            n = e[0],
                            r = e[1];
                        this.aimCursorX = n, this.aimCursorY = r
                    }
                    o.gs.gstates.isRealtimeMode && this.tick % 2 == 0 && (this.SendSelfAimPosition(), this.RecordStatePacket()), this.tick++
                }, t.prototype.UpdateCurrentPosScale = function() {
                    var t, e, n, r = o.gs.gstates,
                        s = this.gameCore.nodeMan;
                    if (r.isBenchmarkMode) {
                        var a = o.gs.gconfig.FieldSize / 2;
                        this.eyeX = a, this.eyeY = a, this.eyeScale = .05
                    } else if (r.isReplayMode) {
                        var l = .6;
                        this.eyeX = i.Nums.EasyFilter(this.eyeX, this.eyeX1, l), this.eyeY = i.Nums.EasyFilter(this.eyeY, this.eyeY1, l), this.eyeScale = i.Nums.EasyFilter(this.eyeScale, this.eyeScale1, l)
                    } else if (r.isRealtimeMode) {
                        var c = this.ScreenToWorld(this.mouseX, this.mouseY),
                            h = c[0],
                            d = c[1],
                            u = void 0,
                            p = void 0;
                        if (l = .985 - 5e-4 * o.gs.uconfig.CameraMovementSpeed, r.isPlaying && s.hasSelfNode) {
                            var g = s.CalcurateCenterPointOfAllSelfCells(),
                                f = g[0],
                                m = g[1],
                                y = s.CalcurateCenterPointOfEachSelfCells(),
                                v = y[0],
                                S = y[1],
                                b = y[2],
                                C = y[3];
                            if (this.spawned && (o.gs.uconfig.useSpawnSignal && (0 == s.operationUnitIndex && this.sendWaves(v, S, "FFFFFF", 500, "spawn", !0), 1 == s.operationUnitIndex && this.sendWaves(b, C, "FFFFFF", 500, "spawn", !0)), this.jumpTick = this.jumpDurationMs, this.eyeX2 = f, this.eyeY2 = m, this.spawned = !1), this.jumpTick > 0) {
                                this.jumpTick -= 17;
                                var x = i.Nums.VMap(this.jumpTick, this.jumpDurationMs, 0, 0, 1, !0);
                                u = i.Nums.Lerp(this.eyeX2, f, x), p = i.Nums.Lerp(this.eyeY2, m, x), l = i.Nums.Lerp(.94, .986, x)
                            } else u = (t = [f, m])[0], p = t[1]
                        } else - 1 != this.aimPlayerId && (65534 & this.aimPlayerId) != this.gameCore.uMan.selfUserId ? (u = (e = [this.serverEyePosX, this.serverEyePosY])[0], p = e[1]) : (u = (n = [h, d])[0], p = n[1]);
                        this.eyeX = i.Nums.EasyFilter(this.eyeX, u, l), this.eyeY = i.Nums.EasyFilter(this.eyeY, p, l), this.eyeScale = i.Nums.EasyFilter(this.eyeScale, this.eyeScale1, .86)
                    }
                }, t.prototype.SetSpawned = function() {
                    this.spawned = !0
                }, t.prototype.OnPlayerDead = function() {
                    var t = this.gravityX,
                        e = this.gravityY,
                        n = this.aimCursorX,
                        o = this.aimCursorY,
                        r = i.Nums.Lerp(t, n, .3),
                        s = i.Nums.Lerp(e, o, .3);
                    this.localAimX = r, this.localAimY = s
                }, t.prototype.UpdateInterpolation = function() {}, t.prototype.FeedReplaySightState = function(t, e, n, i, r, s, a) {
                    this.eyeX1 = t, this.eyeY1 = e, o.gs.uconfig.AffectZoomingOnReplay && (this.eyeScale1 = n), this.aimCursorX = i, this.aimCursorY = r, this.splitting = s, this.aimPlayerId = a
                }, t.prototype.setAimCursorProps = function(t, e, n, i) {
                    this.aimPlayerId = t, this.aimCursorX = e, this.aimCursorY = n, this.splitting = i
                }, t
            }();
        e.SightCoord = s
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(1),
            o = n(2),
            r = n(3),
            s = function() {
                function t(e) {
                    this.name = "Profile" + (e + 1), this.team = "", this.code = "";
                    var n = e;
                    n >= t.skinUrlSources.length && (n = 0), this.skinUrl = t.skinUrlSources[n], this.skinUrl2 = t.skinUrlSources[n], this.profileIndex = e
                }
                return t.prototype.MakeSequenceString = function() {
                    return this.name + "/" + this.team + "/" + this.code + "/" + this.skinUrl + "/" + this.skinUrl2
                }, t.skinUrlSources = ["http://ixagar.net/skins/ring.png", "http://ixagar.net/skins/k461.png", "http://ixagar.net/skins/wolf.png", "http://ixagar.net/skins/rabbit.png", "http://ixagar.net/skins/dragon.png", "http://ixagar.net/skins/magic_circle.png", "http://ixagar.net/skins/ghost.png", "http://ixagar.net/skins/daemon.png", "http://ixagar.net/skins/bat.png", "http://ixagar.net/skins/skull.png"], t
            }();
        e.UserEntryInfo = s;
        var a = function() {
            function t() {
                this.curIndex = 0, this.modified = !1, this.infos = [];
                for (var t = 0; t < o.AppConfigurator.instance.MaxProfileNum; t++) this.infos[t] = new s(t)
            }
            return Object.defineProperty(t.prototype, "curInfo", {
                get: function() {
                    return this.infos[this.curIndex]
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.Load = function() {
                var t = localStorage.getItem("lwga_user_entries");
                if (t) {
                    var e = JSON.parse(t);
                    if (e instanceof Array)
                        for (var n = Math.min(this.infos.length, e.length), o = 0; o < n; o++) {
                            const t = this.infos[o];
                            i.Objects.CopyObjectProps(t, e[o]), t.usig = r.AppHelper.GetUserEnironmentSignature()
                        }
                }
                var s = parseInt(localStorage.getItem("lwga_user_sel_index"));
                isNaN(s) || (this.curIndex = i.Nums.Clamp(s, 0, this.infos.length - 1))
            }, t.prototype.ShiftIndex = function(t) {
                this.curIndex = (this.curIndex + t + this.infos.length) % this.infos.length, this.indexChangedProc(), this.SaveIfChanged()
            }, t.prototype.ChangeIndex = function(t) {
                this.curIndex = t
            }, t.prototype.SaveIfChanged = function() {
                this.modified && (localStorage.setItem("lwga_user_entries", JSON.stringify(this.infos)), this.modified = !1), localStorage.setItem("lwga_user_sel_index", this.curIndex.toString())
            }, t.prototype.SetProp = function(t, e) {
                this.curInfo[t] != e && (this.curInfo[t] = e, this.infos[this.curInfo.profileIndex][t] = e, "skinUrl" != t && "skinUrl2" != t || this.skinChangedProc(), this.skinChangedProc2(), this.modified = !0)
            }, t
        }();
        e.UserEntryManager = a
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(7),
            o = function() {
                function t() {}
                return t.prototype.SendPacket = function(t) {
                    this.ws && this.ws.readyState == WebSocket.OPEN && this.ws.send(t)
                }, t.prototype.CloseConnection = function() {
                    this.ws && (this.ws.onopen = null, this.ws.onmessage = null, this.ws.onclose = null, this.ws.onerror = null, this.ws.close(), this.ws = null)
                }, t.prototype.SendSessionInitialize = function(t) {
                    this.SendPacket(i.Packets.SessionInitialize(t))
                }, t.prototype.SendUserEntryInfo = function(t, e, n, o, r) {
                    this.SendPacket(i.Packets.UserEntryInfo(t, e, n, o, r))
                }, t.prototype.SendRequestStartPlay = function() {
                    this.SendPacket(i.Packets.RequestStartPlay())
                }, t.prototype.SendRequestStartSpectate = function() {
                    this.SendPacket(i.Packets.RequestStartSpectate())
                }, t.prototype.SendAimCursor = function(t, e) {
                    this.SendPacket(i.Packets.AimCursor(t, e))
                }, t.prototype.SendPlayerAction = function(t, e) {
                    this.SendPacket(i.Packets.PlayerAction(t, e))
                }, t.prototype.SendChatMessage = function(t, e) {
                    this.SendPacket(i.Packets.ChatMessage(t, e))
                }, t.prototype.SendLatencyCheckRequest = function() {
                    this.SendPacket(i.Packets.LatencyCheckRequest())
                }, t.prototype.SendSpecifySpecTarget = function(t) {
                    this.SendPacket(i.Packets.SpecifySpecTarget(t))
                }, t.prototype.ConnectToGameServer = function(t) {
                    var e = this;
                    this.ws && this.CloseConnection(), console.log("connecting to gameserver"), this.ws = new WebSocket(t), this.ws.binaryType = "arraybuffer", this.ws.onopen = function() {
                        console.log("socket opened"), e.connectionOpenProc()
                    }, this.ws.onerror = function(t) {
                        console.log("socket error, " + t)
                    }, this.ws.onclose = function(t) {
                        var n = t.reason || "";
                        console.log("socket closed, " + n), e.connectionClosedProc(n)
                    }, this.ws.onmessage = function(t) {
                        e.packetHandlerProc(t.data)
                    }
                }, t
            }();
        e.ConnectionBridge = o
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(1),
            o = n(8),
            r = n(14),
            s = n(0),
            a = n(3),
            l = function(t, e, n, i) {
                this.timeStamp = t, this.opcode = e, this.keep = n, this.buffer = i
            },
            c = function() {
                function t(t, e, n) {
                    this.packets = t, this.headIndex = e, this.tailIndex = n
                }
                return Object.defineProperty(t.prototype, "headTimeStamp", {
                    get: function() {
                        return this.packets[this.headIndex].timeStamp
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "durationMs", {
                    get: function() {
                        return i.Utils.Confirm(this.tailIndex < this.packets.length), this.packets[this.tailIndex].timeStamp - this.packets[this.headIndex].timeStamp
                    },
                    enumerable: !0,
                    configurable: !0
                }), t
            }(),
            h = function() {
                function t() {
                    this.totalBytes = 0, this.packets = [], this.isRecording = !1, this.isPlayback = !1, this.isLoading = !1, this.trackPos = 0, this.reels = [], this.curReelIndex = 0, this.trackPosText = "", this.isAutoShiftToNextReel = !1, this.cleanIdx = 0, this.reqMainPanelShownAfterPlayback = !1, this.replaySpeedRateExp = 0, this.replaySpeedRate = 1
                }
                return t.prototype.Reset = function() {
                    this.totalBytes = 0, this.packets = [], this.isRecording = !1, this.isPlayback = !1, this.isLoading = !1, this.trackPos = 0, this.recordHeadIndex = 0, this.replayIndex = 0, this.reels = [], this.curReelIndex = 0, this.trackPosText = "", this.cleanIdx = 0, this.reqMainPanelShownAfterPlayback = !1, this.Notify()
                }, Object.defineProperty(t.prototype, "curReel", {
                    get: function() {
                        return this.reels[this.curReelIndex]
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "isReplayMode", {
                    get: function() {
                        return s.gs.gstates.isReplayMode
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "numReels", {
                    get: function() {
                        return this.reels.length
                    },
                    enumerable: !0,
                    configurable: !0
                }), t.prototype.Initialize = function(t) {
                    this.nodeMan = t, this.UpdateTrackPosText(), this.startTimeStamp = Date.now()
                }, t.prototype.SetStateChangedProc = function(t) {
                    this.notificationProc = t
                }, t.prototype.Notify = function(t) {
                    void 0 === t && (t = null), this.notificationProc(t)
                }, t.prototype.AddReel = function(t, e) {
                    for (var n = t; n <= e; n++) this.packets[n].keep = !0;
                    var i = new c(this.packets, t, e);
                    this.reels.push(i), this.curReelIndex = this.reels.length - 1
                }, t.prototype.DeleteCurrentReel = function() {
                    this.reels.length > 0 && (this.reels.splice(this.curReelIndex, 1), this.ShiftCurrentReel(0), this.UpdateTrackPosText())
                }, t.prototype.ShiftCurrentReel = function(t, e) {
                    if (void 0 === e && (e = !1), 0 != this.reels.length) {
                        var n = (this.curReelIndex + t + this.reels.length) % this.reels.length;
                        this.curReelIndex = i.Nums.Clamp(n, 0, this.reels.length - 1), this.StartReplayMode(e), e || (this.ShiftTrackPositionLittle(1), this.ShiftTrackPositionLittle(-1))
                    }
                }, t.prototype.ShiftReplaySpeed = function(t) {
                    this.replaySpeedRateExp = i.Nums.Clamp(this.replaySpeedRateExp + t, -1, 2), this.replaySpeedRate = Math.pow(2, this.replaySpeedRateExp)
                }, t.prototype.HandleReplayOperation = function(t) {
                    switch (t) {
                        case 1:
                            this.ToggleRecording();
                            break;
                        case 4:
                            this.TogglePlayback();
                            break;
                        case 3:
                            this.EndReplayMode();
                            break;
                        case 2:
                            this.DoInstantCapture();
                            break;
                        case 5:
                            this.ShiftCurrentReel(-1);
                            break;
                        case 6:
                            this.ShiftCurrentReel(1);
                            break;
                        case 8:
                            this.ShiftTrackPositionLittle(-1);
                            break;
                        case 9:
                            this.ShiftTrackPositionLittle(1);
                            break;
                        case 10:
                            this.DeleteCurrentReel();
                            break;
                        case 7:
                            this.isAutoShiftToNextReel = !this.isAutoShiftToNextReel;
                            break;
                        case 12:
                            this.ShiftReplaySpeed(-1);
                            break;
                        case 13:
                            this.ShiftReplaySpeed(1)
                    }
                    this.Notify()
                }, t.prototype.DiscardUnnecessaryPackets = function() {
                    for (var t = Date.now() - 1e3 * s.gs.usupport.QuickCaptureTimeSec; this.cleanIdx < this.packets.length;) {
                        var e = this.packets[this.cleanIdx];
                        if (e) {
                            if (e.timeStamp >= t) break;
                            e.keep || (this.packets[this.cleanIdx] = null, this.totalBytes -= e.buffer.byteLength)
                        }
                        this.cleanIdx++
                    }
                }, t.prototype.RecordPacket = function(t) {
                    var e = new o.DataFrameReader(t).ReadUint8();
                    if (!(r.OpcodeGroups.NotForRecord.indexOf(e) >= 0)) {
                        var n = Date.now(),
                            i = r.OpcodeGroups.PermanentKeeped.indexOf(e) >= 0;
                        this.isRecording && (i = !0);
                        var s = new l(n, e, i, t);
                        this.packets.push(s), this.totalBytes += t.byteLength
                    }
                }, t.prototype.PostInternalRecordingPacket = function(t) {
                    this.RecordPacket(t)
                }, t.prototype.PostPacketFromServer = function(t) {
                    a.TimeChecker.Start("PostPacketFromServer"), this.isReplayMode || this.nodeMan.DecodeFrame(t, !0, !1), this.RecordPacket(t), a.TimeChecker.Stop()
                }, t.prototype.ToggleRecording = function() {
                    this.isPlayback || (this.isRecording ? (this.isRecording = !1, this.AddReel(this.recordHeadIndex, this.packets.length - 1)) : (this.isRecording = !0, this.recordHeadIndex = this.packets.length), this.Notify())
                }, t.prototype.DoInstantCapture = function() {
                    if (!this.isPlayback) {
                        var t = Date.now() - this.startTimeStamp,
                            e = 1e3 * s.gs.usupport.QuickCaptureTimeSec;
                        e > t && (e = t);
                        var n = Date.now() - e,
                            i = 0;
                        for (i = this.packets.length - 1; i > 0; i--) {
                            var o = this.packets[i];
                            if (o && o.timeStamp < n) break
                        }
                        this.AddReel(i, this.packets.length - 1), this.captureNotificationProc(), this.Notify()
                    }
                }, t.prototype.ToDigits2 = function(t) {
                    var e = t.toString();
                    return e.length <= 1 ? "0" + e : e
                }, t.prototype.GetTimeDurationString = function(t, e) {
                    var n = t / 1e3 >> 0,
                        i = n / 3600 >> 0,
                        o = (n -= 3600 * i) / 60 >> 0,
                        r = (n -= 60 * o) >> 0,
                        s = t % 1e3 / 100 >> 0,
                        a = (this.ToDigits2(i), this.ToDigits2(o)),
                        l = this.ToDigits2(r),
                        c = null;
                    return c = i > 0 ? i + ":" + a + ":" + l : o + ":" + l, e && (c += "." + s), c
                }, t.prototype.UpdateTrackPosText = function() {
                    var t = 0,
                        e = 0;
                    this.curReel && (t = i.Nums.MapTo(this.trackPos, 0, this.curReel.durationMs), e = this.curReel.durationMs);
                    var n = this.GetTimeDurationString(t, !0),
                        o = this.GetTimeDurationString(e, !0);
                    this.trackPosText = n + " / " + o
                }, t.prototype.SeekReplayPosTo = function(t, e) {
                    if (this.curReel) {
                        var n = this.curReel.headTimeStamp,
                            o = this.curReel.headTimeStamp + this.curReel.durationMs,
                            r = i.Nums.MapTo(t, n, o);
                        if (t >= this.trackPos)
                            for (; this.replayIndex < this.curReel.tailIndex;) {
                                if (s = this.packets[this.replayIndex]) {
                                    if (s.timeStamp >= r) break;
                                    this.nodeMan.DecodeFrame(s.buffer, !1, e)
                                }
                                this.replayIndex++
                            } else
                                for (; this.replayIndex > this.curReel.headIndex;) {
                                    var s;
                                    if (s = this.packets[this.replayIndex]) {
                                        if (s.timeStamp <= r) break;
                                        this.nodeMan.DecodeFrame(s.buffer, !1, e)
                                    }
                                    this.replayIndex--
                                }
                        e && this.nodeMan.SyncGameViewToModel(), this.trackPos = t, this.UpdateTrackPosText()
                    }
                }, t.prototype.ShiftTrackPositionLittle = function(t) {
                    if (this.curReel) {
                        var e = 100 * t / this.curReel.durationMs,
                            n = i.Nums.Clamp(this.trackPos + e, 0, 1);
                        this.SeekReplayPosTo(n, !1)
                    }
                }, t.prototype.StartReplayMode = function(t) {
                    s.gs.gstates.isReplayMode = !0, this.trackPos = 0, this.replayIndex = this.curReel.headIndex, this.FeedStoredPackets(0, this.curReel.headIndex), t && (this.isPlayback = !0, this.ReplayLoopProc())
                }, t.prototype.EndReplayMode = function() {
                    this.FeedStoredPackets(0, this.packets.length), this.isPlayback = !1, this.trackPos = 0, s.gs.gstates.isReplayMode = !1, this.UpdateTrackPosText(), this.reqMainPanelShownAfterPlayback && (s.gs.gstates.setMainPanelVisible(!0), this.reqMainPanelShownAfterPlayback = !1)
                }, t.prototype.ReplayLoopProc = function() {
                    if (this.curReel) {
                        var t = 17 / this.curReel.durationMs * this.replaySpeedRate;
                        this.SeekReplayPosTo(this.trackPos + t, !1), this.trackPos < 1 ? this.isPlayback && setTimeout(this.ReplayLoopProc.bind(this), 17) : this.isAutoShiftToNextReel && this.curReelIndex < this.reels.length - 1 ? this.ShiftCurrentReel(1, !0) : this.EndReplayMode(), this.Notify()
                    }
                }, t.prototype.FeedStoredPackets = function(t, e) {
                    this.isLoading = !0, 0 == t && this.nodeMan.ResetToInitialiState();
                    for (var n = r.OpcodeGroups.PermanentKeeped, i = t; i < e; i++) {
                        var o = this.packets[i];
                        o && (o.opcode, n.indexOf(o.opcode) >= 0 && this.nodeMan.DecodeFrame(o.buffer, !1, !0))
                    }
                    this.isLoading = !1
                }, t.prototype.TogglePause = function() {
                    this.isReplayMode && (this.isPlayback = !this.isPlayback, this.isPlayback && this.ReplayLoopProc())
                }, t.prototype.TogglePlayback = function() {
                    null != this.curReel && (this.isRecording || (this.isReplayMode ? this.TogglePause() : (this.reqMainPanelShownAfterPlayback = s.gs.gstates.isMainPanelVisible, this.StartReplayMode(!0), s.gs.gstates.setMainPanelVisible(!1))))
                }, t
            }();
        e.DataRecorder = h
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(1),
            o = n(3),
            r = n(0).gs.uconfig,
            s = function() {
                function t() {
                    this.colors = [0, 0], this.skinUrls = ["", ""]
                }
                return Object.defineProperty(t.prototype, "fullName", {
                    get: function() {
                        return r.ShowTripKey && this.tripKey && "aaaa" != this.tripKey ? this.team + this.name + "[" + this.tripKey + "]" : this.team + this.name
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "miniMapName", {
                    get: function() {
                        return r.ShowTripKey && this.tripKey && "aaaa" != this.tripKey ? this.team + this.name + "[" + this.tripKey + "]" : this.team + this.name
                    },
                    enumerable: !0,
                    configurable: !0
                }), t.prototype.Initialize = function(t, e, n) {
                    this.clientId = t, this.isBot = e, this.tripKey = n, this.name = "", this.team = "", this.teamId = 0;
                    for (var i = 0; i < 2; i++) this.colors[i] = 0, this.skinUrls[i] = ""
                }, t.prototype.SetProps = function(t, e, n, i, o) {
                    this.name = t, this.team = e, this.teamId = n, this.skinUrls[0] = i, this.skinUrls[1] = o
                }, t.prototype.SetColor = function(t, e) {
                    this.colors[t] = e
                }, t
            }();
        e.TUserInfoData = s;
        var a = function() {
            function t() {}
            return t.prototype.Initialize = function(t, e, n) {
                this.teamId = t, this.teamName = e, this.section = n, this.color = 0, this.colorStr = "#000"
            }, t.prototype.SetColor = function(t) {
                this.color = t, this.colorStr = o.ColorHelper.ColorToHtmlString(t)
            }, t
        }();
        e.TTeamInfoData = a;
        var l = function() {
            function t() {
                this.userInfos = new Map, this.teamInfos = new Map, this.fallbackTeamInfo = new a, this.fallbackTeamInfo.Initialize(-1, "", "**"), this.fallbackTeamInfo.SetColor(4456448), this.fallbackUserInfo = new s, this.fallbackUserInfo.Initialize(-1, !1, "ERR"), this.fallbackUserInfo.SetProps("ERR", "ERR", -1, "", ""), this.fallbackUserInfo.SetColor(0, 4456448), this.fallbackUserInfo.SetColor(1, 4456448), this.selfTeamInfo = this.fallbackTeamInfo
            }
            return t.prototype.Reset = function() {
                this.selfUserId = 0, this.selfTeamInfo = this.fallbackTeamInfo, this.userInfos.clear(), this.teamInfos.clear()
            }, t.prototype.PostSelfUserId = function(t) {
                this.selfUserId = t
            }, t.prototype.PostUserInfoData = function(t, e, n, o, r, a, l, c) {
                void 0 === l && (l = null), void 0 === c && (c = null);
                var h = this.userInfos.get(t);
                h || (i.Utils.Confirm(null != l && null != c), (h = new s).Initialize(t, l, c), this.userInfos.set(t, h)), h.SetProps(e, n, o, r, a), h.isBot = l, h.clientId == this.selfUserId && (this.selfTeamInfo = this.GetTeamInfoById(h.teamId))
            }, t.prototype.PostUserLeave = function(t) {
                this.userInfos.delete(t), this.userLeavedProc && this.userLeavedProc(t)
            }, t.prototype.PostPlayerColorData = function(t, e) {
                var n = o.GameHelper.DecodePlayerId(t),
                    i = n[0],
                    r = n[1],
                    s = this.userInfos.get(i);
                s && s.SetColor(r, e)
            }, t.prototype.PostTeamInfoData = function(t, e, n, o) {
                void 0 === n && (n = null), void 0 === o && (o = null);
                var r = this.teamInfos.get(t);
                r || (i.Utils.Confirm(null != n && null != o), (r = new a).Initialize(t, n, o), this.teamInfos.set(t, r)), r.SetColor(e)
            }, t.prototype.PostTeamInfoRemoval = function(t) {
                this.teamInfos.delete(t)
            }, t.prototype.ClearUserInfos = function() {
                this.userInfos.clear()
            }, t.prototype.GetUserInfoById = function(t) {
                return t &= 65534, this.userInfos.get(t) || this.fallbackUserInfo
            }, t.prototype.GetTeamInfoById = function(t) {
                return this.teamInfos.get(t) || this.fallbackTeamInfo
            }, t.prototype.GetCellColorForPlayer = function(t) {
                var e = 1 & t;
                return this.GetUserInfoById(t).colors[e]
            }, t.prototype.GetSkinUrlForPlayer = function(t) {
                var e = 1 & t;
                return this.GetUserInfoById(t).skinUrls[e]
            }, t.prototype.GetTeamInfoForUser = function(t) {
                t &= 65534;
                var e = this.GetUserInfoById(t);
                return this.GetTeamInfoById(e.teamId)
            }, t.prototype.GetPlayerIdsAvailable = function() {
                var t = [];
                return this.userInfos.forEach(function(e) {
                    !e.isBot && "dead" != e.name && e.skinUrls[0] && e.colors[0] && t.push(e.clientId)
                }), t
            }, t
        }();
        e.UserInfoManager = l
    }, function(t, e, n) {
        "use strict";
        var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(t, e) {
                    t.__proto__ = e
                } || function(t, e) {
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
                },
                function(t, e) {
                    function n() {
                        this.constructor = t
                    }
                    i(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
                }),
            r = this && this.__decorate || function(t, e, n, i) {
                var o, r = arguments.length,
                    s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i);
                else
                    for (var a = t.length - 1; a >= 0; a--)(o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
                return r > 3 && s && Object.defineProperty(e, n, s), s
            };
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = n(5),
            a = n(4),
            l = n(0),
            c = n(2),
            h = n(28),
            d = n(27),
            u = n(26),
            p = n(23),
            g = n(22),
            f = n(21),
            m = n(20),
            y = n(19),
            v = n(18),
            S = n(17),
            b = n(16);
        p.ReplayControlBarTag, g.GameOverlayTag, f.LeftConfigPanelTag, m.UserEntryPanelTag, y.ServerListRootTag, v.MainPanelTag, S.MainConfigPanelTag, b.ColorConfigPanelTag, n(15).SkinFilterPanelTag;
        var C = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.gstates = l.gs.gstates, e.uconfig = l.gs.uconfig, e.cconfig = l.gs.ucolors, e.appConfig = c.AppConfigurator.instance, e.hasNewPrivateMessage = !1, e.newPrivateMessageSkinUrl = "", e.newPrivateMessageText = "", e
            }
            return o(e, t), e.prototype.onChatIconClicked = function(t) {
                window.open("unichat/chat.html", "uni-chat", "width=800, height=600, menubar=no, toolbar=no, scrollbars=no"), t.stopPropagation()
            }, e.prototype.onSkinFilterButton = function(t) {
                this.gstates.isSkinFilterPanelVisible = !this.gstates.isSkinFilterPanelVisible, t.stopPropagation()
            }, e.prototype.mounted = function() {
                setTimeout(this.InitializeAfterAllMounted.bind(this), 1)
            }, e.prototype.InitializeAfterAllMounted = function() {
                var t = this;
                l.gs.gstates.mainPanelVisibleChangedProc = this.update.bind(this), l.gs.uconfig.RegisterChangedProc("ShowReplayBar", this.update.bind(this));
                var e = new u.GameViewDomain2.GameView;
                a.gameCore.Initialize(), e.Initialize(), a.gameCore.serverListModel ? a.gameCore.serverListModel.Start() : (l.gs.gstates.chatRoomSig = c.AppConfigurator.instance.uniChatServerSignature, a.gameCore.ConnectToGameServer());
                var n = new h.MapView,
                    i = new d.TeamRankingChartView;
                n.Initialize(this.refs.game_overlay.refs.map_canvas), i.Initialize(this.refs.game_overlay.refs.lb_chart_canvas), a.gameCore.gameHudModel.Initialize(), e.StartAnimation(), a.gameCore.chatAppModel && (a.gameCore.chatAppModel.chatNotificationBadgeProc = function(e, n, i) {
                    t.hasNewPrivateMessage = e, i ? (t.newPrivateMessageSkinUrl = n, t.newPrivateMessageText = i) : (t.newPrivateMessageSkinUrl = "", t.newPrivateMessageText = ""), t.update()
                }), l.gs.gstates.playerDeadCallbackProc = function() {
                    !l.gs.uconfig.HideMenuAfterDeath && l.gs.gstates.setMainPanelVisible(!0)
                }
            }, r([s.template('\n<app-root>\n\t<style>\n\t\t*{\n\t\t\tbox-sizing: border-box;\n\t\t\tmargin: 0;\n\t\t\tpadding: 0;\n\t\t}\n\t\t\n\t\tapp-root{\n\t\t\tfont-family: \'Meiryo\', \'Arial\';\n\t\t\tfont-size: 18px;\n\t\t\tuser-select: none;\n\t\t}\n\n\t\t@font-face{\n\t\t\tfont-family: \'CustomFont1\';\n\t\t\tsrc: url(\'gr/Xolonium-Regular.ttf\') format(\'truetype\');\n\t\t}\n\n\t\t@font-face{\n\t\t\tfont-family: \'CustomFont2\';\n\t\t\tsrc: url(\'gr/ReFormation Sans Regular.ttf\') format(\'truetype\');\n\t\t}\n\n\t\t@font-face{\n\t\t\tfont-family: \'IconFont1\';\n\t\t\tsrc: url(\'gr/icomoon.ttf\') format(\'truetype\');\n\t\t}\n\n\t\t.clear_both{\n\t\t\tclear: both;\n\t\t}\n\n\t\t.page_root{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tposition: fixed;\n\t\t}\n\n\t\t#game_control_overlay{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t}\n\n\t\t.replay_bar_area_outer{\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\twidth: 100%;\n\t\t\ttext-align: center;\n\t\t}\n\n\t\t#psudo_cursor{\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t\tdisplay: none;\n\t\t}\n\n\t\t#psudo_cursor > img{\n\t\t\tposition: absolute;\n\t\t}\n\n\t\t#game_front_control_overlay{\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\t_background-color: #F00;\n\t\t}\n\n\t\t.ex_chat_icon_box{\n\t\t\tposition: absolute;\n\t\t\ttop: 6px;\n\t\t\tleft: 10px;\n\t\t\t_display: none;\n\t\t}\n\n\t\t#ex_chat_icon{\n\t\t\tbackground-color: rgba(255,255,255,1);\n\t\t\twidth: 45px;\n\t\t\theight: 30px;\n\t\t\tborder-radius: 2px;\n\t\t\tborder: solid 1px #08F;\n\t\t\tcursor: pointer;\n\t\t\tcolor: #444;\n\t\t\ttext-align: center;\n\t\t\tline-height: 24px;\n\t\t\tpadding: 1px;\n\t\t\tz-index: 300;\n\t\t}\n\n\t\t#ex_chat_badge{\n\t\t\tposition: absolute;\n\t\t\twidth:16px;\n\t\t\theight:16px;\n\t\t\tleft: 36px;\n\t\t\ttop: -10px;\n\t\t\tz-index: 301;\n\t\t\tdisplay: visible;\n\t\t}\n\n\t\t.skin_filter_button{\n\t\t\tposition: absolute;\n\t\t\ttop: 6px;\n\t\t\tright: 6px;\n\t\t\tborder-radius: 2px;\n\t\t\tbackground-color: #FFF;\n\t\t\tborder: solid 1px #F0A;\n\t\t\tcolor: #F0A;\n\t\t\twidth: 24px;\n\t\t\theight: 24px;\n\t\t\tdisplay: flex;\n\t\t\tjustify-content: center;\n\t\t\talign-items: center;\n\t\t\tcursor: pointer;\n\t\t\tfont-family: IConFont1;\n\t\t}\n\n\t\t.ex_chat_new_message_outer{\n\t\t\tposition: absolute;\n\t\t\twidth:200px;\n\t\t\theight:50px;\n\t\t\tleft: 60px;\n\t\t\ttop: 6px;\n\t\t\tz-index: 302;\n\t\t\tdisplay: visible;\n\t\t\tbackground-color: #FFF0F0;\n\t\t\tborder: solid 1px #F44;\n\t\t\tcolor: #666;\n\t\t\tfont-size: 13px;\n\t\t\tpadding: 4px;\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.ex_chat_new_message{\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.ex_chat_new_message > *{\n\t\t\tposition: absolute;\n\t\t}\n\n\t\t.ex_chat_new_message > img{\n\t\t\twidth: 30px;\n\t\t\theight: 30px;\n\t\t\tborder-radius: 4px;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t}\n\n\t\t.ex_chat_new_message  > div.textpart{\n\t\t\twidth: calc(100% - 40px);\n\t\t\toverflow: hidden;\n\t\t\ttop: 0;\n\t\t\tleft: 34px;\n\t\t}\n\n\n\n\t</style>\n\t<div class="page_root" spellcheck="false"\n\t\tstyle="background-color: {cconfig.cssColors.clGameBackground}; color: {cconfig.cssColors.clGameForeground};">\n\t\t<div id="game_canvas_layer">\n\t\t\t<canvas id="game_canvas_layer_main" ref="game_canvas_layer_main"/>\n\t\t</div>\n\t\t<div id="game_hud_layer">\n\t\t\t<game-overlay id="game_overlay" ref="game_overlay"/>\n\n\t\t\t<div id="psudo_cursor">\n\t\t\t\t<img src="gr/cursor.png" id="psudo_cursor_img_off" />\n\t\t\t\t<img src="gr/cursor_red.png" id="psudo_cursor_img_on" />\n\t\t\t</div>\n\t\t</div>\n\n\t\t<main-panel show={gstates.isMainPanelVisible} id="main_panel" ref="main_panel" />\n\n\t\t<div class="replay_bar_area_outer" show={uconfig.ShowReplayBar}>\n\t\t\t<replay-control-bar />\n\t\t</div>\n\n\t\t<div class="ex_chat_icon_box" show={appConfig.useUniChat}>\n\t\t\t<div id="ex_chat_icon" onmousedown={onChatIconClicked}>\n\t\t\t\t<img src="gr/chat_icon32.png" style="height:100%" />\n\t\t\t</div>\n\t\t\t\n\t\t\t<div id="ex_chat_badge" show={hasNewPrivateMessage}>\n\t\t\t\t<img src="gr/msg_badge.png" style="width:100%"/>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\'ex_chat_new_message_outer\' onmousedown={onChatIconClicked} show={hasNewPrivateMessage}>\n\t\t\t<div class=\'ex_chat_new_message\'>\n\t\t\t\t<img src={newPrivateMessageSkinUrl} />\n\t\t\t\t<div class=\'textpart\'>\n\t\t\t\t\t{newPrivateMessageText}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class="skin_filter_button" onclick={onSkinFilterButton}\n\t\t\tshow={appConfig.isJapanese}>\n\t\t\t&#xe90d\n\t\t</div>\n\t\t\t\n\t\t<skin-filter-panel show={gstates.isSkinFilterPanelVisible} />\n\t\n\t\t<img src="gr/error.png" id="img_no_image_fallback" style="display:none" />\n</app-root>\n')], e)
        }(s.Element);
        e.AppRootTag = C, e.InitializeView = function() {
            var t = C.createElement();
            document.body.appendChild(t)
        }
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(39),
            o = n(2);
        window.onload = function() {
            console.log("LWGA-R A121a0 240322");
            var t = "ja" == navigator.language.slice(0, 2);
            o.AppConfigurator.instance.allowOnlyForJapaneseLangUser && !t ? document.body.innerHTML = "このページは現在国内ユーザ向けに提供しています。日本語環境以外ではページが表示されないようになっています。" : i.InitializeView()
        }
    }]);