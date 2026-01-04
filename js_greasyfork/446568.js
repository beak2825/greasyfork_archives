// ==UserScript==
// @name         RSTL改
// @namespace	http://tampermonkey.net/
// @version		1.0.0
// @description	extend script for senpai clients
// @author		 Redgeioz
// @match		http://caffe.senpai-agar.online/lwga/
// @match		http://senpai-agar.online/lwga/
// @require		http://code.jquery.com/jquery-latest.js
// @grant		none
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/446568/RSTL%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/446568/RSTL%E6%94%B9.meta.js
// ==/UserScript==
console.clear();
PIXI = null;
if (typeof gts == "undefined")
    gts = gTargetSite;
var tcfg = {}
  , biggest = null
  , stopMouse = false;
jQuery.getScript("https://pixijs.download/v6.3.2/pixi-legacy.min.js").done(()=>{
    init();
    start()
}
);
$("title").html("ʀꜱᴛʟ");
var MAIN_RENDERER, SUB_RENDERER, GAMEPLAY_STYLE, MINIMAP_STYLE;
const GENERAL_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$%";
const init = ()=>{
    console.clear();
    PIXI.utils.sayHello("WebGL 2");
    console.log("ʀᴇᴅɢᴇɪᴏᴢ'ꜱ ꜱᴀᴏ ᴛᴏᴏʟ ʟɪɢʜᴛ");
    GAMEPLAY_STYLE = new PIXI.TextStyle({
        fontFamily: "Meiryo, Arial",
        fontWeight: "bold",
        fill: 16777215,
        fontSize: .13 * 800 >> 0,
        stroke: "#000000",
        strokeThickness: .015 * 800 >> 0
    });
    PIXI.BitmapFont.from("GAMEPLAY_MASS", GAMEPLAY_STYLE, {
        chars: [...PIXI.BitmapFont.NUMERIC, ".K"],
        resolution: 1,
        textureWidth: 1440,
        textureHeight: 1440
    });
    MINIMAP_STYLE = new PIXI.TextStyle({
        fontFamily: "Meiryo, Arial",
        fontSize: 15,
        fill: 16777215,
        stroke: "#000000",
        strokeThickness: 1.25
    });
    PIXI.BitmapFont.from("MINIMAP_MASS", MINIMAP_STYLE, {
        chars: [...PIXI.BitmapFont.NUMERIC, ".K"],
        resolution: 4
    })
}
;
const start = ()=>!function(n) {
    var i = {};
    function o(t) {
        if (i[t])
            return i[t].exports;
        var e = i[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return n[t].call(e.exports, e, e.exports, o),
        e.l = !0,
        e.exports
    }
    o.m = n,
    o.c = i,
    o.d = function(t, e, n) {
        o.o(t, e) || Object.defineProperty(t, e, {
            configurable: !1,
            enumerable: !0,
            get: n
        })
    }
    ,
    o.r = function(t) {
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }
    ,
    o.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default
        }
        : function() {
            return t
        }
        ;
        return o.d(e, "a", e),
        e
    }
    ,
    o.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }
    ,
    o.p = "",
    o(o.s = 40)
}([function(t, n, e) {
    "use strict";
    Object.defineProperty(n, "__esModule", {
        value: !0
    });
    var i = e(1)
      , o = e(3)
      , r = e(2)
      , s = (function() {
        function t() {
            this.procs = []
        }
        t.prototype.Add = function(t) {
            this.procs.push(t)
        }
        ,
        t.prototype.Fire = function() {
            this.procs.forEach(function(t) {
                return t()
            })
        }
    }(),
    function() {
        function t() {
            this.FieldSize = 14e3,
            this.ShowDualSkinInputUi = r.AppConfigurator.instance.showDualSkinInputUi,
            this.ShowPartyCodeInputUi = r.AppConfigurator.instance.showPartyCodeInputUi,
            this.IsolateBlankTagPlayers = !0,
            this.NoskinFallbackUrl = "http://ixagar.net/skins/noskin5.png",
            this.MaxCellsNum = 200,
            this.MaxPlayerUnitNum = 100,
            this.MaxTeamNum = 100,
            this.MaxClientsNum = 100,
            this.ShowTeamRanking = r.AppConfigurator.instance.showTeamRanking,
            this.ShowAlwaysAllPlayersInMap = !1,
            this.ShowAlwaysAllPlayersSkin = !1
        }
        return t.prototype.UpdateFieldSize = function(t) {
            this.FieldSize != t && (this.FieldSize = t)
        }
        ,
        t
    }());
    n.GameConfig = s;
    var a = function() {
        function t() {
            this.isMainPanelVisible = !0,
            this.isDeadSpectation = !1,
            this.isSkinFilterPanelVisible = !1,
            this.chatRoomSig = "",
            this.playerDeadTimeStamp = 0,
            this.enableTeamChatSeparationCurrent = null
        }
        return Object.defineProperty(t.prototype, "isRealtimeMode", {
            get: function() {
                return !this.isReplayMode
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "isRealtimeModePlaying", {
            get: function() {
                return this.isRealtimeMode && this.isPlaying
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "isSpectate", {
            get: function() {
                return !this.isPlaying
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.setMainPanelVisible = function(t) {
            this.isMainPanelVisible = t,
            this.mainPanelVisibleChangedProc()
        }
        ,
        t
    }();
    n.GameStates = a;
    var l = function() {
        return function() {
            this.clGameBackground = 4282668424,
            this.clGameForeground = 4294967295,
            this.clFieldBorder = 4294967295,
            this.clFieldCoords = 2298478591,
            this.clLeaderboardBack = 1711276083,
            this.clLeaderboardHeader = 4278255615,
            this.clMapBackground = 2281701376,
            this.clChatBackground = 2281701376,
            this.clOverlayBack = 1140850688,
            this.clMainPanelBack = 2281710216,
            this.clPanelForeground = 4278255615,
            this.clPanelHeader = 4278190148,
            this.clReplayBar = 4278225151,
            this.clMenuButtons = 4278225151,
            this.clMainButtons = 4294901896,
            this.clUiSymbols = 4294967295,
            this.clUiButtonActive = 4278190335,
            this.clCursorLine = 4294967295,
            this.clVirusOuterStroke = 4278255360,
            this.clVirusInnerFill = 2286175300,
            this.clVirusRangeHint = 2286175300,
            this.clChatTimeString = 4289374890,
            this.clChatSenderName = 4278225151,
            this.clChatMessage = 4294967295,
            this.clMarkerA = 14483643,
            this.clMarkerB = 16711680,
            this.clMarkerC = 16737792,
            this.clMarkerD = 16776960,
            this.clMarkerE = 65535,
            this.clMarkerF = 2003199,
            this.clMarkerG = 2154272,
            this.clMarkerH = 32e3
        }
    }();
    n.ColorDefs = l;
    var c, h = function() {
        function t() {
            this.colorDefs = new l,
            this.cssColors = {},
            this.changedProcs = {},
            this.Load()
        }
        return t.prototype.RegisterChangedProc = function(t, e) {
            this.changedProcs[t] || (this.changedProcs[t] = []),
            this.changedProcs[t].push(e)
        }
        ,
        t.prototype.Load = function() {
            var t = localStorage.getItem("lwga11_color_defs");
            if (t) {
                var e = JSON.parse(t);
                i.Objects.CopyObjectProps(this.colorDefs, e)
            }
            for (var n in this.colorDefs)
                this.UpdateDerivedColorDefs(n)
        }
        ,
        t.prototype.Save = function() {
            var t = JSON.stringify(this.colorDefs);
            localStorage.setItem("lwga11_color_defs", t)
        }
        ,
        t.prototype.UpdateDerivedColorDefs = function(t) {
            var e = this.colorDefs[t]
              , n = o.ColorHelper.ColorToCssColorString(e);
            this.cssColors[t] = n
        }
        ,
        t.prototype.GetCssColor = function(t) {
            return this.cssColors[t]
        }
        ,
        t.prototype.GetColor = function(t) {
            return this.colorDefs[t]
        }
        ,
        t.prototype.GetAlpha = function(t) {
            return (this.colorDefs[t] >> 24 & 255) / 255
        }
        ,
        t.prototype.SetConfigColor = function(t, e) {
            this.colorDefs[t] = e,
            this.UpdateDerivedColorDefs(t),
            this.changedProcs[t] && this.changedProcs[t].forEach(function(t) {
                return t()
            }),
            this.Save()
        }
        ,
        t
    }();
    n.ColorConfigModel = h,
    function(t) {
        t[t.Shift = 256] = "Shift",
        t[t.Ctrl = 512] = "Ctrl",
        t[t.Alt = 1024] = "Alt"
    }(c = n.ModificationKeyCode || (n.ModificationKeyCode = {}));
    var d = function() {
        function e() {
            this.ShowName = !0,
            this.ShowMass = !0,
            this.ShowCursorLine = !0,
            this.ShowSkin = !0,
            this.ShowPelletSkin = 0,
            this.ShowEnemySkin = !0,
            this.ShowEnemyHint = !0,
            this.ShowFood = !0,
            this.ShowSelfName = !0,
            this.ShowSelfSkin = !0,
            this.ShowReplayBar = !0,
            this.SimpleVirus = !0,
            this.VirusSplitHint = !0,
            this.VirusRangeHint = !1,
            this.ShowCoord = !0,
            this.GlowingBorder = !0,
            this.SimplifiedMass = !1,
            this.AutoHideText = !0,
            this.GlowingCells = !1,
            this.GlowingNonPlayerCells = !1,
            this.ShowLeaderboard = !0,
            this.ShowMap = !0,
            this.ShowChatBox = !0,
            this.ShowClientStatus = !0,
            this.ShowServerStatus = !1,
            this.ShowDetailedScore = !1,
            this.ShowSpecAimCursor = !0,
            this.AffectZoomingOnReplay = !0,
            this.Antialias = !0,
            this.HDMode = !1,
            this.HideMenuAfterDeath = !1,
            this.ShowSplitIndicator = !1,
            this.ShowSplitCount = !1,
            this.ShowEatLimitMarker = !1,
            this.ShowSplitPrediction = !1,
            this.ShowAutoSplitAlert = !1,
            this.ShowMassMarker = !1,
            this.OperationWithMouseButton = !1,
            this.SwapMouseButtons = !1,
            this.Debug_DisableSkinLoad = !1,
            this.ShowCircularName = !1,
            this.ShowTripKey = !1,
            this.MarkerThin = !0,
            this.MarkerLight = !0,
            this.MarkerExtend = !0,
            this.ShowCellDirectionMarker = !1,
            this.TogglePlayerTransparentCells = !1,
            this.AnotherSectionCellsAlpha = .5,
            this.RenderQuality = 1,
            this.CameraZoomSpeed = 100,
            this.CameraMovementSpeed = 0,
            this.InterpolationType = 1,
            this.InterpolationSpeed = .5,
            this.QuickCaptureTimeOption = 2,
            this.FrameRateOption = 4,
            this.MarkerAlpha = 1,
            this.CursorLineThickness = 5,
            this.PlayerCellsAlpha = 1,
            this.PelletCellsAlpha = .75,
            this.fieldBackImageUri = r.AppConfigurator.instance.defaultFieldBackImageUri,
            this.fieldBackImageAlpha = "0.6",
            this.fieldBackImageDrawingMode2 = !1,
            this.panelBackImageUri = r.AppConfigurator.instance.defaultPanelBackImageUri,
            this.panelBackImageAlpha = "0.6",
            this.changedProcs = {},
            this.changedProcsForViewModel = {},
            this.acceptNewSkins = !0,
            this.toggleHotKeys = {
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
                GlowingNonPlayerCells: !1
            },
            this.holdHotKeys = {
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
                GlowingNonPlayerCells: !1
            },
            this.controlHotKeys = {
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
                hkPlaybackReplay: -1
            },
            this.RegisterChangedProc("ShowEnemyHint", ()=>{
                n.gs.gconfig.ShowAlwaysAllPlayersSkin = !this.ShowEnemyHint;
                MAIN_RENDERER.cells.forEach(t=>{
                    t.edgeColor = -1
                }
                )
            }
            ),
            this.RegisterChangedProc("HDMode", ()=>{
                MAIN_RENDERER.resolution = this.HDMode * .5 + 1;
                MAIN_RENDERER.resize(window.innerWidth, window.innerHeight);
                SUB_RENDERER.resolution = this.HDMode * .5 + 1;
                SUB_RENDERER.resize(window.innerWidth, window.innerHeight)
            }
            ),
            this.StoreDefaultConfig(),
            this.Load()
        }
        return e.prototype.RegisterChangedProc = function(t, e) {
            this.changedProcs[t] = e
        }
        ,
        e.prototype.GetBgImageAlphaValue = function(t) {
            var e = parseFloat(this[t]);
            return isNaN(e) ? .5 : e
        }
        ,
        e.prototype.SetValue = function(t, e) {
            this[t] != e && (this[t] = e,
            this.Store(),
            this.changedProcs[t] && this.changedProcs[t](t, e),
            this.changedProcsForViewModel[t] && this.changedProcsForViewModel[t]())
        }
        ,
        e.prototype.SetControlHotKey = function(t, e) {
            this.controlHotKeys[t] != e && (this.controlHotKeys[t] = e,
            this.Store())
        }
        ,
        e.prototype.SetToggleHotKey = function(t, e) {
            this.toggleHotKeys[t] != e && (this.toggleHotKeys[t] = e,
            this.Store())
        }
        ,
        e.prototype.SetHoldHotKey = function(t, e) {
            this.holdHotKeys[t] != e && (this.holdHotKeys[t] = e,
            this.Store())
        }
        ,
        e.prototype.SetAcceptNewSkins = function(t) {
            this.acceptNewSkins = t,
            this.Store()
        }
        ,
        e.prototype.Load = function() {
            var t = localStorage.getItem(e.storage_key);
            t && o.StorageHelper.LoadObjectProps(this, t)
        }
        ,
        e.prototype.Store = function() {
            var t = JSON.stringify(this);
            localStorage.setItem(e.storage_key, t)
        }
        ,
        e.prototype.StoreDefaultConfig = function() {
            e.default_config_json_text = JSON.stringify(this)
        }
        ,
        e.prototype.RecoverDefaultConfig = function() {
            o.StorageHelper.LoadObjectProps(this, e.default_config_json_text),
            this.Store(),
            this.resetListenerProc()
        }
        ,
        e.cellDisplayOptionPropNames = ["ShowName", "ShowMass", "ShowSelfName", "ShowSelfSkin", "ShowSkin", "ShowPelletSkin", "ShowEnemySkin", "ShowEnemyHint", "ShowFood", "ShowCursorLine", "ShowMassMarker", "ShowSplitPrediction", "ShowAutoSplitAlert", "ShowSplitIndicator", "ShowEatLimitMarker", "ShowCellDirectionMarker", "TogglePlayerTransparentCells", "GlowingCells", "GlowingNonPlayerCells"],
        e.gameDisplayOptionPropNames = ["SimpleVirus", "VirusSplitHint", "VirusRangeHint", "ShowCoord", "GlowingBorder", "SimplifiedMass", "AutoHideText", "ShowReplayBar", "ShowChatBox", "ShowClientStatus", "ShowServerStatus", "ShowLeaderboard", "ShowMap", "ShowSpecAimCursor", "ShowCircularName","ShowTripKey", "MarkerThin", "MarkerLight", "MarkerExtend"],
        e.basicBehaviorPropNames = ["OperationWithMouseButton", "SwapMouseButtons", "AffectZoomingOnReplay", "Antialias", "HDMode", "HideMenuAfterDeath"],
        e.controlPropNames = ["hkSplit", "hkFeedOne", "hkFeed", "hkChangeUnit", "hkDoubleSplit", "hkTripleSplit", "hkQuadSplit", "hkSuperQuadSplit", "hkInfernoSplit", "hk4xLineSplit", "hkSuspend", "hkToggleSuspend", "hkStartNewGame", "hkToggelSpectateTarget", "hkQuickReplayCapture", "hkToggleReplayRecording", "hkPlaybackReplay"],
        e.storage_key = "lwga11_user_config",
        e
    }();
    n.UserConfig = d;
    var u = function() {
        function t() {
            this.renderQuality = 800;
            this.isJapanese = r.AppConfigurator.instance.isJapanese,
            this.interpolationType = ["Fast", "Linear", "Preceding"],
            this.renderQualityTextSourceJp = ["低", "中", "高"],
            this.renderQualityTextSourceEn = ["Low", "Mid", "High"],
            this.quickCaptureTimeSource = [10, 20, 30, 40, 50, 60],
            this.frameRateSource = [10, 15, 20, 30, 60]
        }
        return Object.defineProperty(t.prototype, "RenderQualityText", {
            get: function() {
                const t = n.gs.uconfig.RenderQuality
                  , e = 100 * 2 << t;
                if (this.renderQuality != e) {
                    this.renderQuality = e;
                    GAMEPLAY_STYLE.fontSize = .13 * e >> 0;
                    GAMEPLAY_STYLE.strokeThickness = .015 * e >> 0;
                    PIXI.BitmapFont.from("GAMEPLAY_MASS", GAMEPLAY_STYLE, {
                        chars: [...PIXI.BitmapFont.NUMERIC],
                        resolution: 1,
                        textureWidth: 1440,
                        textureHeight: 1440
                    })
                }
                return (this.isJapanese ? this.renderQualityTextSourceJp : this.renderQualityTextSourceEn)[t]
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "InterpolationTypeText", {
            get: function() {
                var t = n.gs.uconfig.InterpolationType;
                return this.interpolationType[t]
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "InterpolationSpeedText", {
            get: function() {
                var t = -50;
                var e = t + 100 * n.gs.uconfig.InterpolationSpeed;
                return parseInt(e, 10)
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "QuickCaptureTimeSec", {
            get: function() {
                var t = n.gs.uconfig.QuickCaptureTimeOption;
                return this.quickCaptureTimeSource[t]
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "FrameRateText", {
            get: function() {
                let t = [16, 25, 33, 50, 100];
                var e = n.gs.uconfig.FrameRateOption;
                return t[e]
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "TargetFrameRate", {
            get: function() {
                var t = n.gs.uconfig.FrameRateOption;
                return this.frameRateSource[t]
            },
            enumerable: !0,
            configurable: !0
        }),
        t
    }();
    n.UserConfigSupport = u;
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
            VirusSplitHint: "棘の分裂ヒント",
            VirusRangeHint: "棘の射程ヒント",
            ShowCoord: "フィールド座標",
            GlowingBorder: "枠の外発光",
            SimplifiedMass: "質量表示簡略化",
            AutoHideText: "名前/質量の自動非表示",
            GlowingCells: "細胞外発光",
            GlowingNonPlayerCells: "非プレイヤー細胞外発光",
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
            hdrTheme: "テーマ",
            hdrColor: "色",
            hdrWallpaper: "壁紙"
        },
        t.texts_en = {
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
            VirusSplitHint: "Virus Split Hint",
            VirusRangeHint: "Virus Range Hint",
            ShowCoord: "Field Coord",
            GlowingBorder: "Glowing Border",
            SimplifiedMass: "Simplified Mass Display",
            AutoHideText: "Auto Hide Name/Mass",
            GlowingCells: "Glowing Cells",
            GlowingNonPlayerCells: "Glowing Non-player Cells",
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
            hdrTheme: "Theme",
            hdrColor: "Color",
            hdrWallpaper: "Wallpaper"
        },
        t
    }()
      , f = function() {
        return function() {
            this.gconfig = new s,
            this.gstates = new a,
            this.uconfig = new d,
            this.ucolors = new h,
            this.utexts = r.AppConfigurator.instance.isJapanese ? p.texts_jp : p.texts_en,
            this.usupport = new u
        }
    }();
    n.GlobalObject = f,
    n.gs = new f
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var i = function() {
        function t() {}
        return t.Confirm = function(t) {}
        ,
        t
    }();
    e.Utils = i;
    var o = function() {
        function e() {}
        return e.RandF = function() {
            return Math.random()
        }
        ,
        e.RandFD = function() {
            return 2 * Math.random() - 1
        }
        ,
        e.RandI = function(t) {
            return e.RandF() * t >> 0
        }
        ,
        e.InRange = function(t, e, n) {
            return e <= t && t <= n
        }
        ,
        e.Clamp = function(t, e, n) {
            return Math.max(e, Math.min(t, n))
        }
        ,
        e.VMap = function(t, e, n, i, o, r) {
            void 0 === r && (r = !1);
            var s = (t - e) * (o - i) / (n - e) + i;
            if (r) {
                var a = Math.min(i, o)
                  , l = Math.max(i, o);
                return this.Clamp(s, a, l)
            }
            return s
        }
        ,
        e.MapTo = function(t, e, n) {
            return t * (n - e) + e
        }
        ,
        e.Lerp = function(t, e, n) {
            return (1 - n) * t + n * e
        }
        ,
        e.EasyFilter = function(t, e, n) {
            return n * t + (1 - n) * e
        }
        ,
        e.HiLimit = function(t, e) {
            return Math.min(t, e)
        }
        ,
        e.LoLimit = function(t, e) {
            return Math.max(t, e)
        }
        ,
        e
    }();
    e.Nums = o;
    var r = function() {
        function t() {}
        return t.Remove = function(t, e) {
            var n = t.indexOf(e);
            return n >= 0 && (t.splice(n, 1),
            !0)
        }
        ,
        t.Count = function(t, e) {
            for (var n = 0, i = 0, o = t; i < o.length; i++) {
                e(o[i]) && n++
            }
            return n
        }
        ,
        t.Exclude = function(t, e) {
            for (var n = [], i = 0, o = t; i < o.length; i++) {
                var r = o[i];
                -1 == e.indexOf(r) && n.push(r)
            }
            return n
        }
        ,
        t.First = function(t, e) {
            for (var n = 0, i = t; n < i.length; n++) {
                var o = i[n];
                if (e(o))
                    return o
            }
            return null
        }
        ,
        t
    }();
    e.Arrays = r;
    var s = function() {
        function t() {}
        return t.CopyObjectProps = function(t, e) {
            for (var n in e)
                t.hasOwnProperty(n) && (t[n] = e[n])
        }
        ,
        t
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
            }
              , o = t;
            for (var r in i)
                o = o.replace(r, i[r]);
            return o
        }
        ,
        t.GetCurrentTimeStamp = function() {
            return t.FormatDate("YY/MM/DD hh:mm:ss")
        }
        ,
        t.GetTodayString = function() {
            return t.FormatDate("YYMMDD")
        }
        ,
        t.GetHourMinutesString = function() {
            return t.FormatDate("hh:mm")
        }
        ,
        t.GetSystemTimeSec = function() {
            return Date.now() / 1e3
        }
        ,
        t
    }();
    e.DateTimeHelper = a;
    var l = function() {
        function n(t, e) {
            void 0 === t && (t = 0),
            void 0 === e && (e = 0),
            this.x = t,
            this.y = e
        }
        return Object.defineProperty(n.prototype, "Norm", {
            get: function() {
                return Math.sqrt(this.x * this.x + this.y * this.y)
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(n.prototype, "Angle", {
            get: function() {
                return Math.atan2(this.y, this.x)
            },
            enumerable: !0,
            configurable: !0
        }),
        n.prototype.Normalize = function() {
            var t = this.Norm;
            return t >= 11754943e-45 && (this.x = this.x / t,
            this.y = this.y / t),
            this
        }
        ,
        n.prototype.Scale = function(t) {
            return this.x *= t,
            this.y *= t,
            this
        }
        ,
        n.prototype.Add = function(t) {
            return this.x += t.x,
            this.y += t.y,
            this
        }
        ,
        n.prototype.Set = function(t, e) {
            return this.x = t,
            this.y = e,
            this
        }
        ,
        n.prototype.CopyFrom = function(t) {
            return this.x = t.x,
            this.y = t.y,
            this
        }
        ,
        n.Subtract = function(t, e) {
            return new n(t.x - e.x,t.y - e.y)
        }
        ,
        n.prototype.ClampXY = function(t, e, n, i) {
            return this.x = o.Clamp(this.x, t, n),
            this.y = o.Clamp(this.y, e, i),
            this
        }
        ,
        n.IsEqual = function(t, e) {
            return t.x == e.x && t.y == e.y
        }
        ,
        n.GetDist = function(t, e) {
            var n = e.x - t.x
              , i = e.y - t.y;
            return Math.sqrt(n * n + i * i)
        }
        ,
        n.GetAngle = function(t, e) {
            var n = t.x - e.x
              , i = t.y - e.y;
            return Math.atan2(i, n)
        }
        ,
        n.FromPolar = function(t, e) {
            return new n(Math.cos(t) * e,Math.sin(t) * e)
        }
        ,
        n.prototype.AddPolar = function(t, e) {
            this.x += Math.cos(t) * e,
            this.y += Math.sin(t) * e
        }
        ,
        n.prototype.MakeCopy = function() {
            return new n(this.x,this.y)
        }
        ,
        n.DotProduct = function(t, e) {
            return t.x * e.x + t.y * e.y
        }
        ,
        n.CrossProduct = function(t, e) {
            return t.x * e.y - t.y * e.x
        }
        ,
        n
    }();
    e.Vector = l
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var o = n(3)
      , i = function() {
        function t() {
            this.MaxProfileNum = 32,
            this.useUniChat = !1,
            this.gameServerAddress = null,
            this.showDualSkinInputUi = !1,
            this.showPartyCodeInputUi = !0,
            this.defaultFieldBackImageUri = "",
            this.defaultPanelBackImageUri = "",
            this.siteTitleString = "",
            this.leaderboardHeaderText = "Leaderboard",
            this.showTeamRanking = !1,
            this.useIxTrackerServer = !1,
            this.trackerServerUri = null,
            this.trackerServerTargetSite = null,
            this.showAllServers = !1,
            this.insertionContent = null,
            this.allowOnlyForJapaneseLangUser = !1,
            this.Setup()
        }
        return t.prototype.SetupUnichat = function(t, e, n, i) {
            this.useUniChat = !0,
            this.uniChatServerAddress = t,
            this.uniChatSiteSignature = e,
            this.uniChatServerSignature = n,
            this.useTeamSeparatedChat = i
        }
        ,
        t.prototype.Setup = function() {
            this.isJapanese = navigator.language.startsWith("ja");
            var t = "ws://chat2.ixagar.net:4590"
              , e = gts;
            "sao" == e ? (this.gameServerAddress = "ws://sv-sao.senpai-agar.online:2525",
            this.SetupUnichat(t, "ix", "EA-SAO1", !0),
            this.showPartyCodeInputUi = !0,
            this.siteTitleString = "SENPAI-AGAR.ONLINE",
            this.leaderboardHeaderText = "S.A.O.",
            this.showTeamRanking = !0) : "blank" == e ? (this.gameServerAddress = "ws://133.130.111.204:2527",
            this.SetupUnichat(t, "ix", "EA-SAO-BC", !0),
            this.showPartyCodeInputUi = !0,
            this.leaderboardHeaderText = "Leaderboard",
            this.showTeamRanking = !0) : "caffe" == e ? (this.gameServerAddress = "ws://sv-caffe.senpai-agar.online:2520",
            this.SetupUnichat(t, "_caffe", "caffe", !1),
            this.showTeamRanking = !0,
            this.leaderboardHeaderText = "Caffe") : "caffe2" == e ? (this.gameServerAddress = "ws://sv-caffe2.senpai-agar.online:2521",
            this.SetupUnichat(t, "_caffe2", "caffe2", !1),
            this.showTeamRanking = !0,
            this.leaderboardHeaderText = "caffe2",
            this.allowOnlyForJapaneseLangUser = !0) : "kouhaku" == e ? (this.gameServerAddress = "ws://sv-caffe2.senpai-agar.online:2521",
            this.showTeamRanking = !0,
            this.leaderboardHeaderText = "紅白戦",
            this.allowOnlyForJapaneseLangUser = !0) : "dad" == e ? (this.gameServerAddress = "ws://133.18.168.210:2521",
            this.SetupUnichat(t, "_dad", "dad", !0),
            this.showTeamRanking = !0,
            this.leaderboardHeaderText = "dad",
            this.showPartyCodeInputUi = !0) : "ix" == e ? (this.SetupUnichat(t, "ix", "default", !0),
            this.showPartyCodeInputUi = !0,
            this.defaultFieldBackImageUri = "http://ixagar.net/gr/ixagar_bg.png",
            this.defaultPanelBackImageUri = "http://ixagar.net/gr/ixagar_fg.png",
            this.siteTitleString = "IXAGAR.NET",
            this.leaderboardHeaderText = "IX AGAR",
            this.showTeamRanking = !0,
            this.useIxTrackerServer = !0,
            this.trackerServerUri = "http://hub.ixagar.net:4701",
            this.trackerServerTargetSite = "ixagar") : "dual" == e ? (this.showDualSkinInputUi = !0,
            this.useIxTrackerServer = !0,
            this.trackerServerUri = "http://hub1.dual-agar.online:4703",
            this.trackerServerTargetSite = "dual-agar",
            this.SetupUnichat(t, "_dual", "_dual", !0)) : "caffe_beta" == e || "dev" == e && (this.gameServerAddress = "ws://153.127.253.45:2520",
            this.SetupUnichat(t, "_dev", "dev", !1)),
            this.targetSite = e;
            var n = o.AppHelper.GetQueryObject();
            if (n.target) {
                var i = n.target;
                i.startsWith("localhost") && (this.gameServerAddress = "ws://" + i,
                this.useIxTrackerServer = !1)
            }
            n.showAll && (this.showAllServers = !0)
        }
        ,
        t.instance = new t,
        t
    }();
    e.AppConfigurator = i
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var h = n(1)
      , i = function() {
        function o() {}
        return o.GenerateRandomUserEnvSig = function(t) {
            for (var e = "", n = o.CodeChars, i = 0; i < t; i++) {
                e += n[Math.floor(Math.random() * n.length)]
            }
            return e
        }
        ,
        o.GetUserEnironmentSignature = function() {
            var t = localStorage.getItem("UniChatUserSignature");
            return t || (t = o.GenerateRandomUserEnvSig(6),
            localStorage.setItem("UniChatUserSignature", t)),
            t
        }
        ,
        o.EmbedHyperlink = function(t) {
            return t.replace(/(http:\/\/[\x21-\x7e]+)/gi, '<a href=$1 target="_blank">$1</a>')
        }
        ,
        o.GetQueryObject = function() {
            var o = {};
            return location.search.replace("?", "").split("&").forEach(function(t) {
                var e = t.split("=");
                if (2 == e.length) {
                    var n = e[0]
                      , i = e[1];
                    o[n] = i
                }
            }),
            o
        }
        ,
        o.CodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        o
    }();
    e.AppHelper = i;
    var o = function() {
        function t() {}
        return t.LoadObjectProps = function(t, e) {
            try {
                var n = JSON.parse(e);
                for (var i in n)
                    if (t.hasOwnProperty(i)) {
                        var o = t[i]
                          , r = n[i];
                        o instanceof Object ? h.Objects.CopyObjectProps(o, r) : t[i] = r
                    }
            } catch (t) {}
        }
        ,
        t
    }();
    e.StorageHelper = o;
    var r = function() {
        function t() {}
        return t.ColorFromConfigColorString = function(t) {
            if ("#" != t[0])
                return 0;
            var e = 255
              , n = 0
              , i = 0
              , o = 0;
            return 8 == (t = t.slice(1, t.length)).length ? (e = parseInt(t.slice(0, 2), 16),
            n = parseInt(t.slice(2, 4), 16),
            i = parseInt(t.slice(4, 6), 16),
            o = parseInt(t.slice(6, 8), 16)) : 6 == t.length ? (n = parseInt(t.slice(0, 2), 16),
            i = parseInt(t.slice(2, 4), 16),
            o = parseInt(t.slice(4, 6), 16)) : 4 == t.length ? (e = 17 * parseInt(t[0], 16),
            n = 17 * parseInt(t[1], 16),
            i = 17 * parseInt(t[2], 16),
            o = 17 * parseInt(t[3], 16)) : 3 == t.length && (n = 17 * parseInt(t[0], 16),
            i = 17 * parseInt(t[1], 16),
            o = 17 * parseInt(t[2], 16)),
            isNaN(e) || isNaN(n) || isNaN(i) || isNaN(o) ? 0 : e << 24 | n << 16 | i << 8 | o
        }
        ,
        t.ColorToCssColorString = function(t) {
            return "rgba(" + (t >> 16 & 255) + "," + (t >> 8 & 255) + "," + (255 & t) + "," + (t >> 24 & 255) / 255 + ")"
        }
        ,
        t.GetAlpha = function(t) {
            return (t >> 24 & 255) / 255
        }
        ,
        t.FormatColorByte = function(t) {
            var e = t.toString(16).toUpperCase();
            return 1 == e.length && (e = "0" + e),
            e
        }
        ,
        t.ColorToHtmlString = function(t) {
            var e = t >> 16 & 255
              , n = t >> 8 & 255
              , i = 255 & t;
            return "#" + this.FormatColorByte(e) + this.FormatColorByte(n) + this.FormatColorByte(i)
        }
        ,
        t.ColorFromHtmlString = function(t) {
            if (7 != t.length || "#" != t[0])
                return 8947848;
            var e = parseInt(t.slice(1, 3), 16)
              , n = parseInt(t.slice(3, 5), 16)
              , i = parseInt(t.slice(5, 7), 16);
            return isNaN(e) || isNaN(n) || isNaN(i) ? 8947848 : e << 16 | n << 8 | i
        }
        ,
        t.ColorFromHtmlStringInput = function(t, e) {
            if (7 != t.length || "#" != t[0])
                return -1;
            var n = parseInt(t.slice(1, 3), 16)
              , i = parseInt(t.slice(3, 5), 16)
              , o = parseInt(t.slice(5, 7), 16);
            return isNaN(n) || isNaN(i) || isNaN(o) ? -1 : e << 24 || n << 16 | i << 8 | o
        }
        ,
        t.GetHSV = function(t) {
            var e = (t >> 16 & 255) / 255
              , n = (t >> 8 & 255) / 255
              , i = (255 & t) / 255
              , o = Math.max(e, n, i)
              , r = Math.min(e, n, i)
              , s = 0;
            if (o != r) {
                var a = o - r;
                (s = (e == o ? (n - i) / a : n == o ? 2 + (i - e) / a : 4 + (e - n) / a) / 6) < 0 && (s += 1)
            }
            return [s, (o - r) / o, o]
        }
        ,
        t.ColorFromHSVA = function(t, e, n, i) {
            var o = (1 - e) * n
              , r = n - o
              , s = 6 * t
              , a = 0
              , l = 0
              , c = 0;
            return s < 1 ? (a = n,
            l = s * r + o,
            c = o) : s < 2 ? (a = (2 - s) * r + o,
            l = n,
            c = o) : s < 3 ? (a = o,
            l = n,
            c = (s - 2) * r + o) : s < 4 ? (a = o,
            l = (4 - s) * r + o,
            c = n) : s < 5 ? (a = (s - 4) * r + o,
            l = o,
            c = n) : (a = n,
            l = o,
            c = (6 - s) * r + o),
            255 * i >> 0 << 24 | 255 * a >> 0 << 16 | 255 * l >> 0 << 8 | 255 * c >> 0
        }
        ,
        t.ReplaceAlpha = function(t) {
            var e = this.GetHSV(t);
            return this.ColorFromHSVA(e[0], e[1], e[2], 0)
        }
        ,
        t
    }();
    e.ColorHelper = r;
    var s = function() {
        function t() {}
        return t.RadiusToMass = function(t) {
            return t * t / 100
        }
        ,
        t.MassToRadius = function(t) {
            return Math.sqrt(100 * t)
        }
        ,
        t.GenarateRandomColor = function() {
            var t = [255, h.Nums.RandI(100), h.Nums.RandI(256)].sort(function() {
                return h.Nums.RandFD()
            });
            return t[0] << 16 | t[1] << 8 | t[2]
        }
        ,
        t.CheckIsInEatableSection = function(t, e) {
            return t == e || "**" == t || "**" == e
        }
        ,
        t.DecodePlayerId = function(t) {
            return [65534 & t, 1 & t]
        }
        ,
        t.GetDist = function(t, e, n, i) {
            var o = n - t
              , r = i - e;
            return Math.sqrt(o * o + r * r)
        }
        ,
        t.VectorDotProduct = function(t, e, n, i) {
            return t * n + e * i
        }
        ,
        t.VectorCrossProduct = function(t, e, n, i) {
            return t * i - e * n
        }
        ,
        t.GetLinePointDist = function(t, e, n, i, o, r) {
            var s = new h.Vector(n - t,i - e)
              , a = new h.Vector(o - t,r - e);
            if (h.Vector.DotProduct(s, a) < 0)
                return a.Norm;
            var l = new h.Vector(t - n,e - i)
              , c = new h.Vector(o - n,r - i);
            return h.Vector.DotProduct(l, c) < 0 ? c.Norm : Math.abs(h.Vector.CrossProduct(s, a)) / s.Norm
        }
        ,
        t.HitTestAABB = function(t, e, n, i, o) {
            var r = n - t
              , s = i - i;
            return -o <= r && r <= o && -o <= s && s <= o
        }
        ,
        t.TrimNameAndTeamName = function(t, e) {
            if (t.length > 15)
                t = t.substring(0, 15),
                e = "";
            else {
                var n = 15 - t.length;
                e.length > n && (e = e.substring(0, n))
            }
            return [t, e]
        }
        ,
        t
    }();
    e.GameHelper = s;
    var a = function() {
        function e() {}
        return e.Start = function(t) {
            e.sig = t,
            e.t0 = performance.now()
        }
        ,
        e.Stop = function() {
            if (performance.now() - e.t0 > 50) {
                var t = e.sig;
                console.log("long execution : " + t)
            }
        }
        ,
        e
    }();
    e.TimeChecker = a;
    var l = function() {
        function t(t, e) {
            this.capacity = t,
            this.pool = new Array(t);
            for (var n = 0; n < t; n++)
                this.pool[n] = e();
            this.genProc = e
        }
        return t.prototype.Gain = function() {
            if (this.pool.length <= 0)
                return this.genProc();
            var t = this.pool.pop();
            return t
        }
        ,
        t.prototype.Release = function(t) {
            if (this.pool.length <= this.capacity * 1.125) {
                this.pool.push(t)
            }
        }
        ,
        t
    }();
    e.ObjectPool = l;
    var c = function() {
        function t() {
            this.activeKeepTimeSec = 180,
            this.deactivedTick = 0,
            this.t0 = 0
        }
        return Object.defineProperty(t.prototype, "IsHidden", {
            get: function() {
                return document.hidden
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.Update = function() {
            var t = performance.now()
              , e = t - this.t0;
            this.t0 = t,
            document.hasFocus() ? this.deactivedTick = 0 : this.deactivedTick += .001 * e
        }
        ,
        Object.defineProperty(t.prototype, "IsActive", {
            get: function() {
                return this.deactivedTick < this.activeKeepTimeSec
            },
            enumerable: !0,
            configurable: !0
        }),
        t.Instance = new t,
        t
    }();
    e.PageHelper = c
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var p;
    var l = n(1)
      , i = n(38)
      , o = n(37)
      , r = n(13)
      , s = n(36)
      , a = n(35)
      , c = n(34)
      , f = n(0)
      , h = n(2)
      , d = n(33)
      , u = n(3)
      , g = n(13)
      , m = n(31)
      , y = n(30)
      , v = n(29)
      , S = function() {
        return function() {
            this.avgDuration = 0,
            this.avgRate = 0,
            this.avgFps = 0,
            this.numCellsRendered = 0,
            this.replayBufferBytes = 0,
            this.debugObj = {}
        }
    }();
    e.GamePerformanceStateModel = S;
    var b = function() {
        function t() {
            var e = this;
            this.tick = 0,
            this.seqUseInfoStrSent = null,
            this.perfModel = new S,
            this.serverUriCash = null,
            this.userEntryMan = new a.UserEntryManager,
            this.userEntryMan.Load(),
            this.uMan = new i.UserInfoManager,
            this.dataRecorder = new o.DataRecorder,
            this.nodeMan = new r.NodeManager(this),
            this.conn = new s.ConnectionBridge,
            this.sight = new c.SightCoord(this),
            this.benchDataFeeder = new m.PerfBenchDataFeeder(this),
            this.conn.packetHandlerProc = this.dataRecorder.PostPacketFromServer.bind(this.dataRecorder),
            this.conn.connectionOpenProc = function() {
                e.conn.SendSessionInitialize(u.AppHelper.GetUserEnironmentSignature()),
                e.SendSelfEntryInfoIfChanged(),
                e.conn.SendRequestStartSpectate()
            }
            ,
            this.conn.connectionClosedProc = function(t) {
                console.log("connection closed " + t),
                (t = t.indexOf("serverMaxConnections (") >= 0 ? "Server is full house. Please access after a while.</br>満員です。しばらく時間をおいてからアクセスしてください。" : "") && e.gameHudModel.PostServerInstructionText(t)
            }
            ;
            var t = h.AppConfigurator.instance;
            t.useUniChat && (this.chatAppModel = new d.ChatAppModel,
            this.chatAppModel.SetUserEnvSig(u.AppHelper.GetUserEnironmentSignature()),
            this.chatAppModel.SetChatServerUri(t.uniChatServerAddress),
            this.chatAppModel.SetGameTeamChatSessionEnabled(t.useTeamSeparatedChat),
            this.chatAppModel.SetSiteSignature(t.uniChatSiteSignature),
            this.chatAppModel.SetServerSignature(t.uniChatServerSignature, !1),
            this.chatAppModel.gameChatMessageReceiverProc = this.nodeMan.PostExternalChatMessage.bind(this.nodeMan),
            window.chatAppModel = this.chatAppModel),
            t.useIxTrackerServer && (this.serverListModel = new y.ServerListModel(this)),
            this.gameHudModel = new v.GameHudModel
        }
        return t.prototype.ShowDebugValue = function(t, e) {
            this.perfModel.debugObj[t] = e
        }
        ,
        Object.defineProperty(t.prototype, "ReplayControllerModel", {
            get: function() {
                return this.dataRecorder
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.SendSplitAction = function(t) {
            if (f.gs.gstates.isSpectate) {
                return
            }
            this.gameHudModel.specTargetName = null;
            this.sight.splitting = !0,
            this.conn.SendPlayerAction(0, t)
        }
        ,
        t.prototype.StartPlay = function() {
            f.gs.gstates.isBenchmarkMode || (f.gs.gstates.isPlaying || (this.SendSelfEntryInfoIfChanged(),
            this.conn.SendSpecifySpecTarget(-1),
            this.conn.SendRequestStartPlay(),
            f.gs.gstates.isPlaying = !0,
            f.gs.gstates.isDeadSpectation = !1,
            this.gameHudModel.ResetMaxScore()),
            this.userEntryMan.SaveIfChanged(),
            f.gs.gstates.setMainPanelVisible(!1))
        }
        ,
        t.prototype.StartSpectate = function() {
            f.gs.gstates.isBenchmarkMode || (f.gs.gstates.isPlaying ? f.gs.gstates.setMainPanelVisible(!1) : (this.SendSelfEntryInfoIfChanged(),
            this.userEntryMan.SaveIfChanged(),
            f.gs.gstates.isDeadSpectation = !1,
            f.gs.gstates.setMainPanelVisible(!1)))
        }
        ,
        t.prototype.ToggleBenchMarkMode = function() {
            if (f.gs.gstates.isBenchmarkMode)
                f.gs.gstates.isBenchmarkMode = !1,
                this.benchDataFeeder.Stop(),
                f.gs.gstates.setMainPanelVisible(!0),
                this.ConnectToGameServer();
            else {
                f.gs.gstates.isBenchmarkMode = !0,
                this.CloseConnection(),
                this.nodeMan.OnEnterBenchMarkMode();
                f.gs.gconfig.FieldSize;
                this.benchDataFeeder.Start(),
                f.gs.gstates.setMainPanelVisible(!1)
            }
        }
        ,
        t.prototype.KeyboardInputHandler = function(t, i) {
            if ("INPUT" == document.activeElement.tagName)
                return !1;
            if (i && 27 == t.keyCode && f.gs.gstates.setMainPanelVisible(!f.gs.gstates.isMainPanelVisible),
            !i && 9 == t.KeyCode)
                return !0;
            if (this.sight.initDone && !f.gs.gstates.isBenchmarkMode) {
                var e = t.keyCode;
                t.ctrlKey && (e += f.ModificationKeyCode.Ctrl),
                t.shiftKey && (e += f.ModificationKeyCode.Shift),
                t.altKey && (e += f.ModificationKeyCode.Alt);
                var n = f.gs.uconfig.controlHotKeys;
                const l = ()=>{
                    const t = this.sight;
                    const e = (t.mouseX - t.scw / 2) / t.eyeScale + t.eyeX;
                    const n = (t.mouseY - t.sch / 2) / t.eyeScale + t.eyeY;
                    this.conn.SendAimCursor(e, n),
                    t.aimXSent = e,
                    t.aimYSent = n
                }
                ;
                if (f.gs.gstates.isRealtimeMode) {
                    if (e == n.hkSuspend) {
                        stopMouse = 0;
                        this.conn.SendPlayerAction(5, i ? 0 : 1);
                        return !0
                    }
                    if (e == n.hk4xLineSplit) {
                        if (!i) {
                            return
                        }
                        let t = this.nodeMan.operationUnitIndex;
                        const c = this.nodeMan.selfNodeIds[t];
                        if (c.length != 1) {
                            stopMouse = 0;
                            return
                        }
                        const s = this.sight;
                        const h = c[0];
                        const e = this.nodeMan.nodes.get(h);
                        const d = e.nx;
                        const n = e.ny;
                        if (d != s.aimXSent || n != s.aimYSent) {
                            this.conn.SendAimCursor(d, n),
                            s.aimXSent = d >> 0,
                            s.aimYSent = n >> 0
                        }
                        stopMouse = !stopMouse;
                        if (stopMouse) {
                            p = setInterval(()=>{
                                if (c.length != 1) {
                                    clearInterval(p);
                                    return
                                }
                                if (e.nx == s.aimXSent && e.ny == s.aimYSent) {
                                    setTimeout(()=>{
                                        if (c.length != 1) {
                                            return
                                        }
                                        this.gameHudModel.specTargetName = "4x Line Split is available";
                                        this.gameHudModel.SetSpecTargetScore(0)
                                    }
                                    , 1e3);
                                    clearInterval(p)
                                }
                            }
                            , 35)
                        } else {
                            this.gameHudModel.specTargetName = null;
                            clearInterval(p)
                        }
                        return !0
                    }
                    if (i && e == n.hkToggleSuspend && (this.isSuspend = !this.isSuspend,
                    this.conn.SendPlayerAction(5, this.isSuspend ? 0 : 1)),
                    f.gs.gstates.isPlaying && e == n.hkFeed) {
                        if (stopMouse) {
                            stopMouse = 0
                        }
                        this.conn.SendPlayerAction(4, i ? 1 : 0);
                        return !0
                    }
                    if (e == n.hkDoubleSplit) {
                        stopMouse = 0,
                        l(),
                        stopMouse = i ? 1 : 0,
                        i ? this.SendSplitAction(2) : 0,
                        setTimeout(()=>stopMouse = 0, 600);
                        return !0
                    }
                    if (e == n.hkTripleSplit) {
                        l();
                        const u = stopMouse;
                        stopMouse = i ? 1 : 0;
                        this.conn.SendPlayerAction(5, i ? 0 : 1);
                        if (i && !u) {
                            this.SendSplitAction(3)
                        }
                        return !0
                    }
                    if (e == n.hkSuperQuadSplit) {
                        l();
                        const u = stopMouse;
                        stopMouse = i ? 1 : 0;
                        this.conn.SendPlayerAction(5, i ? 0 : 1);
                        if (i && !u) {
                            this.SendSplitAction(4)
                        }
                        return !0
                    }
                }
                var o = !1
                  , r = f.gs.uconfig;
                for (var s in r.holdHotKeys) {
                    if (e == r.holdHotKeys[s]) {
                        var a = r[s];
                        r.SetValue(s, !a),
                        o = !0
                    }
                }
                if (i) {
                    if (e == n.hkStartNewGame) {
                        if (f.gs.gstates.isBenchmarkMode)
                            return !1;
                        if (!f.gs.gstates.isPlaying)
                            return this.StartPlay(),
                            !0
                    }
                    if (e == n.hkToggelSpectateTarget)
                        return -1 == this.sight.aimPlayerId ? this.conn.SendSpecifySpecTarget(0) : this.conn.SendSpecifySpecTarget(-1),
                        !0;
                    if (e == n.hkQuickReplayCapture)
                        return this.dataRecorder.DoInstantCapture(),
                        !0;
                    if (e == n.hkToggleReplayRecording)
                        return this.dataRecorder.ToggleRecording(),
                        !0;
                    if (e == n.hkPlaybackReplay)
                        return this.dataRecorder.isReplayMode ? this.dataRecorder.EndReplayMode() : this.dataRecorder.TogglePlayback(),
                        !0;
                    if (f.gs.gstates.isRealtimeModePlaying) {
                        if (e == n.hkSplit) {
                            return stopMouse = 0,
                            l(),
                            this.SendSplitAction(1),
                            !0
                        }
                        if (e == n.hkChangeUnit) {
                            if (p) {
                                clearInterval(p)
                            }
                            return this.conn.SendPlayerAction(3, -1),
                            l(),
                            stopMouse = 0,
                            !0
                        }
                        if (e == n.hkFeedOne) {
                            return this.conn.SendPlayerAction(1, -1),
                            stopMouse = 0,
                            !0
                        }
                        if (e == n.hkQuadSplit) {
                            return this.SendSplitAction(4),
                            !0
                        }
                        if (e == n.hkInfernoSplit) {
                            this.SendSplitAction(2);
                            this.conn.SendPlayerAction(3, -1);
                            l();
                            stopMouse = 0;
                            this.SendSplitAction(4);
                            return !0
                        }
                    }
                    for (var s in r.toggleHotKeys) {
                        if (e == r.toggleHotKeys[s]) {
                            a = r[s];
                            r.SetValue(s, !a),
                            o = !0
                        }
                    }
                }
                return !!o && (this.gameHudModel.configUpdatedProc(),
                !0)
            }
        }
        ,
        t.prototype.MouseInputHandler = function(t, e) {
            if (!f.gs.gstates.isBenchmarkMode) {
                var n = f.gs.uconfig
                  , i = 0
                  , o = 2;
                if (e) {
                    if (f.gs.gstates.isRealtimeMode && f.gs.gstates.isSpectate) {
                        if (t == o) {
                            var r = this.sight.ScreenToWorld(this.sight.mouseX, this.sight.mouseY)
                              , s = r[0]
                              , a = r[1]
                              , l = this.nodeMan.GetPlayerIdUnderCursor(s, a);
                            this.conn.SendSpecifySpecTarget(l)
                        }
                        t == i && (this.conn.SendSpecifySpecTarget(-1),
                        this.isSuspend && (this.isSuspend = !1,
                        this.conn.SendPlayerAction(5, this.isSuspend ? 0 : 1)))
                    }
                    t == i && f.gs.gstates.isBenchmarkMode,
                    f.gs.gstates.isReplayMode && (t == i && this.dataRecorder.TogglePlayback(),
                    t == o && (this.dataRecorder.EndReplayMode(),
                    this.dataRecorder.Notify()))
                }
                n.OperationWithMouseButton && (n.SwapMouseButtons && (i = 2,
                o = 0),
                f.gs.gstates.isRealtimeModePlaying && (t == i && e ? this.SendSplitAction(1) : t == o ? this.conn.SendPlayerAction(4, e ? 1 : 0) : 1 == t && e && this.SendSplitAction(4)))
            }
        }
        ,
        t.prototype.SelfUnitsDeadProc = function() {
            var t = this;
            stopMouse = 0;
            this.gameHudModel.specTargetName = null;
            f.gs.gstates.isPlaying && !this.dataRecorder.isLoading && (f.gs.gstates.isPlaying = !1,
            f.gs.gstates.isDeadSpectation = !0,
            this.sight.OnPlayerDead(),
            this.gameHudModel.ResetMaxScore(),
            f.gs.gstates.playerDeadCallbackProc(),
            f.gs.gstates.playerDeadTimeStamp = Date.now(),
            setTimeout(function() {
                return t.conn.SendRequestStartSpectate()
            }, 100))
        }
        ,
        t.prototype.SendSelfEntryInfoIfChanged = function() {
            var t = this.userEntryMan.curInfo
              , e = t.MakeSequenceString()
              , n = u.AppHelper.GetUserEnironmentSignature()
              , i = t.usig != n;
            if (i) {
                n = t.usig ? t.usig : n;
                t.usig = n;
                localStorage.setItem("UniChatUserSignature", t.usig);
                this.chatAppModel.SetUserEnvSig(n);
                this.userEntryMan.infos.forEach(t=>t.usig = n)
            }
            if (i || this.seqUseInfoStrSent != e) {
                var o = t.code;
                f.gs.gconfig.IsolateBlankTagPlayers && "" == t.team && (o = n);
                var r = u.GameHelper.TrimNameAndTeamName(t.team, t.name)
                  , s = r[0]
                  , a = r[1];
                l.Utils.Confirm(s.length + a.length <= 15),
                this.conn.SendUserEntryInfo(a, s, o, t.skinUrl + "?RL", t.skinUrl2),
                this.chatAppModel && this.chatAppModel.SetUserEntryInfo(a, s, o, t.skinUrl, t.profileIndex),
                this.seqUseInfoStrSent = e
            }
        }
        ,
        t.prototype.SendChatMessage = function(t) {
            if (this.chatAppModel)
                this.chatAppModel.SendMessageOnGameChatSession(t);
            else {
                var e = this.uMan.selfUserId;
                this.conn.SendChatMessage(t, e)
            }
        }
        ,
        t.prototype.StatesUpdationProc = function() {
            setTimeout(this.StatesUpdationProc.bind(this), 1e3),
            u.TimeChecker.Start("StatusUpdationProc"),
            this.nodeMan.RecordLatencyCheckStartTime(),
            this.conn.SendLatencyCheckRequest(),
            this.nodeMan.UpdateSelfScore(),
            this.perfModel.replayBufferBytes = this.dataRecorder.totalBytes,
            this.dataRecorder.DiscardUnnecessaryPackets();
            this.perfModel.debugObj,
            g.TNodeData.Pool.capacity,
            g.TNodeData.Pool.pool.length;
            u.TimeChecker.Stop()
        }
        ,
        t.prototype.Initialize = function() {
            var n = this;
            this.dataRecorder.Initialize(this.nodeMan);
            var t = document.querySelector("#game_control_overlay");
            window.addEventListener("keydown", function(t) {
                t.repeat || n.KeyboardInputHandler(t, !0) && t.preventDefault()
            }),
            window.addEventListener("keyup", function(t) {
                n.KeyboardInputHandler(t, !1) && t.preventDefault()
            }),
            window.onmousedown = function(t) {
                f.gs.gstates.isMainPanelVisible || n.MouseInputHandler(t.button, !0)
            }
            ,
            window.onmouseup = function(t) {
                f.gs.gstates.isMainPanelVisible || n.MouseInputHandler(t.button, !1)
            }
            ,
            window.oncontextmenu = function(t) {
                return t.preventDefault(),
                !1
            }
            ,
            window.onmousemove = function(t) {
                n.sight.mouseX = t.clientX,
                n.sight.mouseY = t.clientY
            }
            ;
            var e = function(t) {
                var e = t.wheelDelta / 120 * f.gs.uconfig.CameraZoomSpeed / 100;
                f.gs.gstates.isBenchmarkMode || n.sight.ShiftScale(e)
            };
            navigator.userAgent.indexOf("Firefox") >= 0 ? t.addEventListener("DOMMouseScroll", e, !1) : t.onmousewheel = e,
            this.nodeMan.selfUnitsDeadCallback = this.SelfUnitsDeadProc.bind(this),
            this.StatesUpdationProc()
        }
        ,
        t.prototype.Reset = function() {
            this.seqUseInfoStrSent = null,
            this.isSuspend = !1
        }
        ,
        t.prototype.ConnectToGameServer = function(t) {
            void 0 === t && (t = null),
            t || (t = this.serverUriCash || h.AppConfigurator.instance.gameServerAddress);
            var e = t.split("//")[1].split(":")
              , n = e[0]
              , i = parseInt(e[1]);
            window.GameServerHost = n,
            window.GameServerPort = i,
            this.sight.initDone = !1,
            this.isSuspend = !1,
            this.gameHudModel.ClearChatMessages(),
            this.nodeMan.ResetToInitialiState(),
            this.dataRecorder.Reset(),
            this.uMan.Reset(),
            this.Reset(),
            this.conn.ConnectToGameServer(t),
            this.serverUriCash = t
        }
        ,
        t.prototype.ConnectToGameServerEx = function(t, e) {
            f.gs.gstates.chatRoomSig = e,
            this.ConnectToGameServer(t)
        }
        ,
        t.prototype.CloseConnection = function() {
            this.sight.initDone = !1,
            this.conn.CloseConnection()
        }
        ,
        t
    }();
    e.GameCore = b,
    console.log("gamecore 170127h"),
    e.gameCore = new b
}
, function(t, o, e) {
    "use strict";
    Object.defineProperty(o, "__esModule", {
        value: !0
    });
    var n = function() {
        function t() {
            riot.observable(this)
        }
        return t.prototype.on = function(t, e) {}
        ,
        t.prototype.one = function(t, e) {}
        ,
        t.prototype.off = function(t) {}
        ,
        t.prototype.trigger = function(t) {
            for (var e = [], n = 1; n < arguments.length; n++)
                e[n - 1] = arguments[n]
        }
        ,
        t
    }();
    o.Observable = n;
    var i = function() {
        function t() {}
        return t.prototype.update = function(t) {}
        ,
        t.prototype.unmount = function(t) {}
        ,
        t.prototype.on = function(t, e) {}
        ,
        t.prototype.one = function(t, e) {}
        ,
        t.prototype.off = function(t) {}
        ,
        t.prototype.trigger = function(t) {
            for (var e = [], n = 1; n < arguments.length; n++)
                e[n - 1] = arguments[n]
        }
        ,
        t.prototype.mixin = function(t, e) {}
        ,
        t.createElement = function(t) {
            var e = this.prototype.tagName
              , n = document.createElement(e);
            return riot.mount(n, e, t),
            n
        }
        ,
        t
    }();
    function r(e) {
        var t;
        if (void 0 === e.prototype.template)
            throw "template property not specified";
        var n, i = e.prototype.template;
        i.indexOf("<") < 0 ? void 0 !== o.precompiledTags[i] ? t = o.precompiledTags[i] : (i = function(t) {
            var e = new XMLHttpRequest;
            if (e.open("GET", t, !1),
            e.send(),
            200 == e.status)
                return e.responseText;
            throw e.responseText
        }(i),
        t = riot.compile(i, !0, {
            entities: !0
        })[0]) : t = riot.compile(i, !0, {
            entities: !0
        })[0],
        e.prototype.tagName = (n = t,
        riot.tag2(n.tagName, n.html, n.css, n.attribs, function(t) {
            !function(t, n) {
                var e = Object.keys(n.prototype).reduce(function(t, e) {
                    return t[e] = Object.getOwnPropertyDescriptor(n.prototype, e),
                    t
                }, {});
                Object.defineProperties(t, e)
            }(this, e),
            e.apply(this, [t]),
            void 0 !== e.prototype.mounted && this.on("mount", this.mounted),
            void 0 !== e.prototype.unmounted && this.on("unmount", this.unmounted),
            void 0 !== e.prototype.updating && this.on("update", this.updating),
            void 0 !== e.prototype.updated && this.on("updated", this.updated)
        }, riot.settings.brackets),
        n.tagName)
    }
    o.Element = i,
    o.precompiledTags = {},
    o.registerClass = r,
    o.template = function(e) {
        return function(t) {
            t.prototype.template = e,
            r(t)
        }
    }
}
, function(t, e) {
    t.exports = PIXI
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var l = n(8)
      , i = function() {
        function t() {}
        return t.SessionInitialize = function(t) {
            var e = new l.DataFrameWriter;
            return e.WriteUint8(252),
            e.WriteStringEx("lwga-110"),
            e.WriteStringEx(t),
            e.ArrayBuffer
        }
        ,
        t.AimCursor = function(t, e) {
            var n = new l.DataFrameWriter;
            return n.WriteUint8(16),
            n.WriteInt32(t >> 0),
            n.WriteInt32(e >> 0),
            n.ArrayBuffer
        }
        ,
        t.UserEntryInfo = function(t, e, n, i, o) {
            var r = new l.DataFrameWriter;
            return r.WriteUint8(30),
            r.WriteStringEx(t),
            r.WriteStringEx(e),
            r.WriteStringEx(i),
            r.WriteStringEx(n),
            r.WriteStringEx(o),
            r.ArrayBuffer
        }
        ,
        t.RequestStartPlay = function() {
            var t = new l.DataFrameWriter;
            return t.WriteUint8(31),
            t.ArrayBuffer
        }
        ,
        t.RequestStartSpectate = function() {
            var t = new l.DataFrameWriter;
            return t.WriteUint8(1),
            t.ArrayBuffer
        }
        ,
        t.PlayerAction = function(t, e) {
            var n = new l.DataFrameWriter;
            return n.WriteUint8(25),
            n.WriteUint8(t),
            n.WriteUint8(e),
            n.ArrayBuffer
        }
        ,
        t.ChatMessage = function(t, e) {
            var n = new l.DataFrameWriter;
            return n.WriteUint8(128),
            n.WriteUint16(e),
            n.WriteStringEx(""),
            n.WriteStringEx(t),
            n.ArrayBuffer
        }
        ,
        t.LatencyCheckRequest = function() {
            var t = new l.DataFrameWriter;
            return t.WriteUint8(130),
            t.ArrayBuffer
        }
        ,
        t.SpecifySpecTarget = function(t) {
            var e = new l.DataFrameWriter;
            return e.WriteUint8(27),
            e.WriteInt32(t),
            e.ArrayBuffer
        }
        ,
        t
    }();
    e.Packets = i;
    var o = function() {
        function t() {}
        return t.NodeRemoval = function(t) {
            var e = new l.DataFrameWriter;
            return e.WriteUint8(161),
            e.WriteUint32(t),
            e.ArrayBuffer
        }
        ,
        t.UserEntryInfo = function(t, e, n, i, o, r) {
            var s = new l.DataFrameWriter;
            return s.WriteUint8(162),
            s.WriteUint16(t),
            s.WriteStringEx(e),
            s.WriteStringEx(n),
            s.WriteUint16(i),
            s.WriteStringEx(o),
            s.WriteStringEx(r),
            s.ArrayBuffer
        }
        ,
        t.PlayerColor = function(t, e) {
            var n = new l.DataFrameWriter;
            return n.WriteUint8(163),
            n.WriteUint16(t),
            n.WriteUint32(e),
            n.ArrayBuffer
        }
        ,
        t.TeamColor = function(t, e) {
            var n = new l.DataFrameWriter;
            return n.WriteUint8(164),
            n.WriteUint16(t),
            n.WriteUint32(e),
            n.ArrayBuffer
        }
        ,
        t.MoveSightToward = function(t, e, n) {
            var i = new l.DataFrameWriter;
            return i.WriteUint8(165),
            i.WriteInt32(t >> 0),
            i.WriteInt32(e >> 0),
            i.WriteFloat32(n),
            i.ArrayBuffer
        }
        ,
        t.SightState = function(t, e, n, i, o, r, s) {
            var a = new l.DataFrameWriter;
            return a.WriteUint8(166),
            a.WriteInt32(t >> 0),
            a.WriteInt32(e >> 0),
            a.WriteFloat32(n),
            a.WriteInt32(i >> 0),
            a.WriteInt32(o >> 0),
            a.WriteUint8(r ? 1 : 0),
            a.WriteUint16(s),
            a.ArrayBuffer
        }
        ,
        t
    }();
    e.InternalPackets = o
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var i = function() {
        function t(t) {
            this.bytes = new Uint8Array(t),
            this.pos = 0
        }
        return Object.defineProperty(t.prototype, "Length", {
            get: function() {
                return this.bytes.length
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.ReadUint8 = function() {
            return this.bytes[this.pos++]
        }
        ,
        t.prototype.ReadUint16 = function() {
            return this.ReadUint8() | this.ReadUint8() << 8
        }
        ,
        t.prototype.ReadUint32 = function() {
            var t = this.ReadUint8()
              , e = this.ReadUint8()
              , n = this.ReadUint8();
            return this.ReadUint8() << 24 | n << 16 | e << 8 | t
        }
        ,
        t.prototype.ReadInt16 = function() {
            var t = this.ReadUint16();
            return t >= 32768 && (t -= 65536),
            t
        }
        ,
        t.prototype.ReadInt32 = function() {
            var t = this.ReadUint32();
            return t >= 2147483648 && (t -= 4294967295),
            t
        }
        ,
        t.prototype.ReadFloat32 = function() {
            var t = this.ReadUint32()
              , e = new ArrayBuffer(4);
            return new Uint32Array(e)[0] = t,
            new Float32Array(e)[0]
        }
        ,
        t.prototype.ReadStringEx = function() {
            for (var t = this.ReadUint16(), e = "", n = 0; n < t; n++)
                e += String.fromCharCode(this.ReadUint16());
            return e
        }
        ,
        t
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
        }),
        Object.defineProperty(t.prototype, "ArrayBuffer", {
            get: function() {
                return new Uint8Array(this.bytes).buffer
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.WriteUint8 = function(t) {
            this.bytes.push(t)
        }
        ,
        t.prototype.WriteUint16 = function(t) {
            this.bytes.push(255 & t),
            this.bytes.push(t >> 8 & 255)
        }
        ,
        t.prototype.WriteInt16 = function(t) {
            t < 0 && (t += 65536),
            this.WriteUint16(t)
        }
        ,
        t.prototype.WriteUint32 = function(t) {
            this.bytes.push(255 & t),
            this.bytes.push(t >> 8 & 255),
            this.bytes.push(t >> 16 & 255),
            this.bytes.push(t >> 24 & 255)
        }
        ,
        t.prototype.WriteUint64 = function(t) {
            this.bytes.push(255 & t),
            this.bytes.push(t >> 8 & 255),
            this.bytes.push(t >> 16 & 255),
            this.bytes.push(t >> 24 & 255),
            this.bytes.push(t >> 32 & 255),
            this.bytes.push(t >> 40 & 255),
            this.bytes.push(t >> 48 & 255),
            this.bytes.push(t >> 56 & 255)
        }
        ,
        t.prototype.WriteInt32 = function(t) {
            t < 0 && (t += 4294967295),
            this.WriteUint32(t)
        }
        ,
        t.prototype.WriteFloat32 = function(t) {
            var e = new ArrayBuffer(4);
            new Float32Array(e)[0] = t;
            var n = new Uint32Array(e)[0];
            this.WriteUint32(n)
        }
        ,
        t.prototype.WriteStringEx = function(t) {
            this.WriteUint16(t.length);
            for (var e = 0; e < t.length; e++)
                this.WriteUint16(t.charCodeAt(e))
        }
        ,
        t
    }();
    e.DataFrameWriter = o
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = n(0)
      , o = n(3)
      , i = n(1)
      , r = function() {
        function t(t, e, n) {
            this.key = t,
            this.text = e,
            this.SetColor(n)
        }
        return t.prototype.SetColor = function(t, e) {
            void 0 === e && (e = !1),
            this.color = t,
            this.htmlColor = o.ColorHelper.ColorToHtmlString(t),
            this.cssColor = o.ColorHelper.ColorToCssColorString(t),
            e && s.gs.ucolors.SetConfigColor(this.key, t)
        }
        ,
        t
    }();
    e.ColorConfigEntry = r;
    var a = function() {
        function t() {
            this.SetColor(16711680)
        }
        return t.prototype.SetColor = function(t) {
            var e;
            this.color = t,
            this.htmlColor = o.ColorHelper.ColorToHtmlString(t),
            e = o.ColorHelper.GetHSV(t),
            this.hue = e[0],
            this.sat = e[1],
            this.bri = e[2],
            this.alpha = o.ColorHelper.GetAlpha(t)
        }
        ,
        t.prototype.SetHue = function(t) {
            var e = o.ColorHelper.ColorFromHSVA(t, this.sat, this.bri, this.alpha);
            this.SetColor(e),
            this.hue = t
        }
        ,
        t.prototype.SetAlpha = function(t) {
            var e = this.hue
              , n = o.ColorHelper.ColorFromHSVA(this.hue, this.sat, this.bri, t);
            this.SetColor(n),
            this.hue = e
        }
        ,
        t.prototype.SetSV = function(t, e) {
            var n = this.hue
              , i = o.ColorHelper.ColorFromHSVA(this.hue, t, e, this.alpha);
            this.SetColor(i),
            this.hue = n,
            this.sat = t
        }
        ,
        t.prototype.SetByHtmlColor = function(t) {
            var e = o.ColorHelper.ColorFromHtmlStringInput(t, this.alpha);
            -1 != e && this.SetColor(e)
        }
        ,
        t
    }();
    e.ColorEditModel = a;
    var l = function() {
        function r() {}
        return r.HotKeyToText = function(t) {
            if (t <= 0)
                return "";
            var e = 255 & t
              , n = t - e
              , i = "";
            n > 0 && (n & s.ModificationKeyCode.Shift && (i = "sft+"),
            n & s.ModificationKeyCode.Ctrl && (i = "ctl+"),
            n & s.ModificationKeyCode.Alt && (i = "alt+"));
            var o = r.keyCodeToTextTable[e];
            return o || (o = String.fromCharCode(e)),
            i + o
        }
        ,
        r.keyCodeToTextTable = {
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
        },
        r
    }()
      , c = function() {
        function t(t, e, n, i, o) {
            this.key = t,
            this.text = e,
            this.value = n,
            this.toggleHotKey = i,
            this.holdHotKey = o,
            this.toggleHotKeyText = l.HotKeyToText(i),
            this.holdHotKeyText = l.HotKeyToText(o),
            s.gs.uconfig.changedProcsForViewModel[t] = this.UpdateState.bind(this)
        }
        return t.prototype.UpdateState = function() {
            this.value = s.gs.uconfig[this.key]
        }
        ,
        t.prototype.SetValue = function(t) {
            this.value = t,
            s.gs.uconfig.SetValue(this.key, t)
        }
        ,
        t.prototype.SetToggleHotKey = function(t) {
            this.toggleHotKey = t,
            this.toggleHotKeyText = l.HotKeyToText(t),
            s.gs.uconfig.SetToggleHotKey(this.key, t)
        }
        ,
        t.prototype.SetHoldHotKey = function(t) {
            this.holdHotKey = t,
            this.holdHotKeyText = l.HotKeyToText(t),
            s.gs.uconfig.SetHoldHotKey(this.key, t)
        }
        ,
        t.prototype.PullModelState = function() {
            this.value = s.gs.uconfig[this.key],
            this.toggleHotKey = s.gs.uconfig.toggleHotKeys[this.key],
            this.holdHotKey = s.gs.uconfig.holdHotKeys[this.key],
            this.toggleHotKeyText = l.HotKeyToText(this.toggleHotKey),
            this.holdHotKeyText = l.HotKeyToText(this.holdHotKey)
        }
        ,
        t
    }();
    e.ConfigEntry = c;
    var h = function() {
        function t(t, e, n) {
            this.key = t,
            this.text = e,
            this.hotKey = n,
            this.hotKeyText = l.HotKeyToText(n)
        }
        return t.prototype.SetHotKey = function(t) {
            this.hotKey = t,
            this.hotKeyText = l.HotKeyToText(t),
            s.gs.uconfig.SetControlHotKey(this.key, t)
        }
        ,
        t.prototype.PullModelState = function() {
            this.hotKey = s.gs.uconfig.controlHotKeys[this.key],
            this.hotKeyText = l.HotKeyToText(this.hotKey)
        }
        ,
        t
    }();
    e.ControlHotkeyConfigEntry = h;
    var d = function() {
        function t() {
            var i = s.gs.ucolors.colorDefs;
            this.colorEntries = Object.keys(i).map(function(t) {
                var e = s.gs.utexts[t]
                  , n = i[t];
                return new r(t,e,n)
            }),
            this.curColorEntry = this.colorEntries[0],
            this.cellDisplayEntries = s.UserConfig.cellDisplayOptionPropNames.map(function(t) {
                var e = s.gs.utexts[t]
                  , n = s.gs.uconfig[t]
                  , i = s.gs.uconfig.toggleHotKeys[t]
                  , o = s.gs.uconfig.holdHotKeys[t];
                return new c(t,e,n,i,o)
            }),
            this.gameDisplayEntries = s.UserConfig.gameDisplayOptionPropNames.map(function(t) {
                var e = s.gs.utexts[t]
                  , n = s.gs.uconfig[t]
                  , i = s.gs.uconfig.toggleHotKeys[t];
                return new c(t,e,n,i,-1)
            }),
            this.basicBehaviorEntries = s.UserConfig.basicBehaviorPropNames.map(function(t) {
                var e = s.gs.utexts[t]
                  , n = s.gs.uconfig[t];
                return new c(t,e,n,-1,-1)
            }),
            this.controlEntries = s.UserConfig.controlPropNames.map(function(t) {
                var e = s.gs.utexts[t]
                  , n = s.gs.uconfig.controlHotKeys[t];
                return new h(t,e,n)
            }),
            s.gs.uconfig.resetListenerProc = this.UpdateAll.bind(this)
        }
        return t.prototype.selectColorCard = function(e) {
            var t = i.Arrays.First(this.colorEntries, function(t) {
                return t.key == e
            });
            t && (this.curColorEntry = t)
        }
        ,
        t.prototype.UpdateAll = function() {
            this.cellDisplayEntries.forEach(function(t) {
                return t.PullModelState()
            }),
            this.gameDisplayEntries.forEach(function(t) {
                return t.PullModelState()
            }),
            this.basicBehaviorEntries.forEach(function(t) {
                return t.PullModelState()
            }),
            this.controlEntries.forEach(function(t) {
                return t.PullModelState()
            })
        }
        ,
        t.instance = new t,
        t
    }();
    e.ConfigHub = d
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var i = n(24)
      , o = n(0)
      , r = function() {
        function t() {
            this.bus = new i.EventBus,
            this.skins = {}
        }
        return t.prototype.addSkinUrl = function(t) {
            void 0 == this.skins[t] && (this.skins[t] = o.gs.uconfig.acceptNewSkins,
            this.bus.emit("render"))
        }
        ,
        t.prototype.removeSkinUrl = function(t) {
            void 0 != this.skins[t] && (delete this.skins[t],
            this.bus.emit("render"))
        }
        ,
        t.prototype.setImageAvailability = function(t, e) {
            this.skins[t] = e
        }
        ,
        t.prototype.setImageAvailabilityAll = function(t) {
            for (var e in this.skins)
                this.skins[e] = t
        }
        ,
        t.prototype.getSkinAvailability = function(t) {
            return this.skins[t]
        }
        ,
        t.instance = new t,
        t
    }();
    e.SkinImageManager = r
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var i = function() {
        function o(t) {
            this.procsOnSettled = [],
            this.loadPhase = 0,
            this.TryToLoad(t, 0)
        }
        return o.Initialize = function() {
            o.canvas = document.createElement("canvas"),
            o.ctx = o.canvas.getContext("2d")
        }
        ,
        o.prototype.OnImageLoaded = function() {
            var t = this.image
              , e = this.fname;
            this.isSettled = !0,
            t.width <= 1200 && t.height <= 1200 || (console.log("image size too large: " + e + ", " + t.width + "x" + t.height),
            this.image = this.GetFallBackImage()),
            this.FireSettled()
        }
        ,
        o.prototype.OnImageError = function() {
            if (0 == this.loadPhase) {
                var t = "http://gr.ixagar.net:9400/?uri=" + this.uri;
                this.TryToLoad(t, 1)
            } else
                this.isSettled = !0,
                this.image = this.GetFallBackImage(),
                this.FireSettled()
        }
        ,
        o.prototype.TryToLoad = function(t, e) {
            this.uri = t;
            var n = o.GetFileName(t);
            this.fname = n;
            var i = new Image;
            i.crossOrigin = "Anonymous",
            i.onload = this.OnImageLoaded.bind(this),
            i.onerror = this.OnImageError.bind(this),
            this.loadPhase = e,
            this.image = i,
            i.src = t
        }
        ,
        o.GetFileName = function(t) {
            const e = t.match(/.+\/(.*)$/);
            return e ? e[1] : ""
        }
        ,
        o.prototype.GetFallBackImage = function() {
            return document.querySelector("#img_no_image_fallback")
        }
        ,
        o.prototype.FireSettled = function() {
            var e = this;
            this.procsOnSettled.forEach(function(t) {
                return t(e.image)
            }),
            this.procsOnSettled = []
        }
        ,
        o.prototype.ExecAfterLoad = function(t) {
            this.isSettled ? t(this.image) : this.procsOnSettled.push(t)
        }
        ,
        o.LoadImageThen = function(t, e) {
            var n = o.cash.get(t);
            n || (n = new o(t),
            o.cash.set(t, n)),
            n.ExecAfterLoad(e)
        }
        ,
        o.cash = new Map,
        o
    }();
    e.ImageWrapper = i;
    var o = function() {
        function t() {
            this.imageCash = new Map
        }
        return t.prototype.LoadImageThen = function(t, e, n) {
            if (t) {
                var i = this.imageCash.get(t);
                i && i.flagLoaded ? n(i) : i || ((i = new Image).crossOrigin = "Anonymous",
                this.imageCash.set(t, i),
                i.addEventListener("load", function() {
                    i.flagLoaded = !0,
                    n(i)
                }),
                i.onerror = function() {
                    console.log("failed to load " + t),
                    n(null)
                }
                ,
                i.src = e ? t : "http://gr.ixagar.net:9400/?uri=" + t)
            } else
                n(null)
        }
        ,
        t.CheckIsValidImageUri = function(t) {
            var e = t.match(/^http[s]?\:\/\/.*\.(png|jpg|gif|jpeg)$/);
            return e && e.length > 0
        }
        ,
        t.Instance = new t,
        t
    }();
    e.ImageLoader = o
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var _ = n(3)
      , k = n(11)
      , w = n(0)
      , I = n(6)
      , i = function() {
        function t(s) {
            var a = this
              , t = new I.Container;
            this.box = t,
            this.baseSize = s ? 3200 : 200;
            var l = this.baseSize
              , c = l / 5
              , e = w.gs.uconfig
              , h = w.gs.ucolors;
            if (s) {
                var o = new I.Sprite;
                o.anchor.x = .5,
                o.anchor.y = .5,
                o.position.x = l / 2,
                o.position.y = l / 2,
                t.addChild(o);
                var r = new I.Graphics;
                r.beginFill(0),
                r.drawRect(0, 0, l, l),
                r.endFill(),
                r.visible = !1,
                t.addChild(r);
                var n = function() {
                    o.alpha = e.GetBgImageAlphaValue("fieldBackImageAlpha");
                    var t = e.fieldBackImageUri;
                    if (k.ImageLoader.CheckIsValidImageUri(t)) {
                        var i = e.fieldBackImageDrawingMode2;
                        k.ImageLoader.Instance.LoadImageThen(t, !0, function(t) {
                            if (t) {
                                t.width,
                                t.height;
                                var e = Math.min(t.width, t.height)
                                  , n = a.baseSize / e * (i ? 2 : 1);
                                o.scale.x = n,
                                o.scale.y = n,
                                o.texture = I.Texture.from(t.src),
                                o.mask = i ? null : r,
                                o.visible = !0
                            }
                        })
                    } else
                        o.visible = !1
                };
                n(),
                e.RegisterChangedProc("fieldBackImageUri", n),
                e.RegisterChangedProc("fieldBackImageAlpha", n),
                e.RegisterChangedProc("fieldBackImageDrawingMode2", n)
            }
            var i = new I.Container;
            t.addChild(i),
            this.gridContainer = i;
            var d = new I.Graphics;
            i.addChild(d);
            for (var u = [], p = 0; p < 25; p++) {
                var f = p % 5
                  , g = p / 5 >> 0
                  , m = String.fromCharCode(65 + g) + (f + 1)
                  , y = new I.Text(m);
                y.style.fontSize = .09 * this.baseSize >> 0,
                y.style.fontFamily = "CustomFont2, Arial",
                y.x = f * c + c / 2 - y.width / 2,
                y.y = g * c + c / 2 - y.height / 2,
                i.addChild(y),
                u.push(y)
            }
            var v = function() {
                var t, e;
                !function() {
                    var t = h.GetColor("clFieldCoords");
                    d.alpha = _.ColorHelper.GetAlpha(t),
                    d.clear();
                    var e = s ? .002 : .006
                      , n = a.baseSize * e >> 0
                      , i = n / 2;
                    d.lineStyle(n, t);
                    for (var o = 0; o < 6; o++) {
                        var r = o * c;
                        d.moveTo(r, -i),
                        d.lineTo(r, l + i),
                        d.moveTo(-i, r),
                        d.lineTo(l + i, r)
                    }
                }(),
                t = h.GetColor("clFieldCoords"),
                e = _.ColorHelper.ColorToHtmlString(t),
                u.forEach(function(t) {
                    return t.style.fill = e
                }),
                i.alpha = h.GetAlpha("clFieldCoords")
            };
            setTimeout(v, 1),
            h.RegisterChangedProc("clFieldCoords", v);
            var S = new I.Sprite;
            t.addChild(S);
            S.canvas = document.createElement("canvas");
            S.texture = new I.Texture.from(S.canvas);
            let b = {
                a: 15,
                b: 151
            };
            var C = function() {
                var t = .015 * a.baseSize >> 0
                  , e = .003 * a.baseSize >> 0
                  , n = w.gs.uconfig.GlowingBorder ? t * 9 : 0
                  , i = t + n;
                const o = h.GetColor("clFieldBorder");
                S.alpha = _.ColorHelper.GetAlpha(o);
                S.position.set(-i);
                const r = S.canvas;
                r.width = r.height = l + t * 2 + n * 2;
                const s = r.getContext("2d");
                s.clearRect(0, 0, l + t * 2 + n * 2, l + t * 2 + n * 2);
                s.beginPath();
                s.lineWidth = t;
                s.strokeStyle = _.ColorHelper.ColorToHtmlString(o);
                s.globalAlpha = 1;
                s.shadowBlur = n;
                s.shadowColor = _.ColorHelper.ColorToHtmlString(o);
                s.rect(t / 2 + n, t / 2 + n, l + t, l + t);
                s.save();
                s.clip();
                s.stroke();
                s.shadowBlur = n / 2;
                s.stroke();
                s.stroke();
                s.globalAlpha /= 2;
                s.stroke();
                s.restore();
                s.shadowBlur = n / 4;
                s.globalAlpha = 1;
                s.stroke();
                S.texture.update()
            };
            if (x == 0) {
                C();
                S.blendMode = PIXI.BLEND_MODES.SCREEN;
                e.RegisterChangedProc("GlowingBorder", C);
                h.RegisterChangedProc("clFieldBorder", C);
                x++
            }
        }
        let x = 0;
        return t.prototype.SetScale = function(t) {
            this.box.scale.x = t,
            this.box.scale.y = t
        }
        ,
        t.prototype.SetCoordVisibility = function(t) {
            this.gridContainer.visible = t
        }
        ,
        t
    }();
    e.FieldGraphics = i
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var m = n(1)
      , bt = n(1)
      , Ct = n(8)
      , xt = n(7)
      , _t = n(14)
      , kt = n(3)
      , wt = n(0)
      , It = n(2)
      , y = function() {
        function t() {}
        return t.prototype.Initialize = function(t, e, n, i, o) {
            this.nodeId = t,
            this.cellType = e,
            this.ownerPlayerId = n,
            this.color = i,
            this.ox = 0,
            this.oy = 0,
            this.or = 0,
            this.x,
            this.y,
            this.r,
            this.nx = 0,
            this.ny = 0,
            this.nr = 0,
            this.mass = 0,
            this.updateStamp = o,
            this.motionAngle = 0,
            this.motionSpeed = 0,
            this.canEat = !1,
            this.canEaten = !1,
            this.splitNum = -1,
            this.splitOrderWeight = -1,
            this.canSplit = !1,
            this.showMark = !1,
            this.sizeLevel = -1,
            this.velocity = new m.Vector(0,0)
        }
        ,
        t.prototype.UpdateProps = function(t, e, n, i, o) {
            var r = this.nx
              , s = this.ny;
            this.nx = t,
            this.ny = e,
            this.nr = kt.GameHelper.MassToRadius(n),
            this.mass = n,
            this.motionAngle = i,
            this.motionSpeed = o;
            this.velocity.Set(t - r, e - s)
        }
        ,
        t.prototype.LinearUpdate = function(t) {
            var e = (t - this.updateStamp) / m.Nums.MapTo(wt.gs.uconfig.InterpolationSpeed, 179, 49);
            e = Math.max(Math.min(e, 1), 0);
            this.x = this.ox + (this.nx - this.ox) * e;
            this.y = this.oy + (this.ny - this.oy) * e;
            this.r = this.or + (this.nr - this.or) * e
        }
        ,
        t.Pool = new kt.ObjectPool(wt.gs.gconfig.MaxCellsNum,function() {
            return new t
        }
        ),
        t
    }();
    e.TNodeData = y;
    var v = function() {
        return function(t, e, n, i) {
            this.eaterId = t,
            this.eatenId = e,
            this.limitRadius = n,
            this.canEat = i
        }
    }()
      , S = function() {
        function t() {
            this.nodeId = -1
        }
        return t.prototype.SetTarget = function(t, e, n) {
            this.nodeId = t,
            this.canEat = e,
            this.canPushAll = n
        }
        ,
        t
    }()
      , b = function() {
        function t(t) {
            this.eatingLimitList = [],
            this.AimTargetData = new S,
            this.gameCore = t
        }
        return t.prototype.UpdateNodeAnalysisProps = function() {
            var c = this;
            if (!wt.gs.gstates.isBenchmarkMode) {
                var e = this.gameCore.nodeMan
                  , t = e.nodes
                  , n = e.operationUnitIndex
                  , i = e.selfNodeIds[n].length;
                if (this.gameCore.gameHudModel.SetSplitNum(i),
                i > 0) {
                    var h = [];
                    e.selfNodeIds[n].forEach(t=>h.push(e.nodes.get(t)));
                    It = h[0];
                    h.forEach(function(t) {
                        t.mass > It.mass && (It = t)
                    });
                    biggest = It;
                    var o = h.slice(0).sort(function(t, e) {
                        return t.nodeId - e.nodeId
                    });
                    S = o.length,
                    b = 16 - S,
                    C = 0;
                    o.forEach(function(t, e) {
                        var n = 0;
                        C < b ? t.mass >= 44 ? (n = 0,
                        C++,
                        t.canSplit = !0) : (n = 1,
                        t.canSplit = !1) : (n = m.Nums.VMap(e, b, S - 1, .4, 1, !0),
                        t.canSplit = !1),
                        t.splitOrderWeight = n
                    });
                    var r = this.gameCore.sight
                      , s = e.GetNodeIdUnderCursor(r.aimCursorX, r.aimCursorY)
                      , a = e.nodes.get(s);
                    a && a.ownerPlayerId == e.activeSelfPlayerId && (s = -1,
                    a = null);
                    var l = !1
                      , d = !1;
                    if (a) {
                        var u = 2 * a.mass * 1.3;
                        h.forEach(function(t) {
                            t.mass > u && (kt.GameHelper.GetDist(t.nx, t.ny, a.nx, a.ny) < 780 + t.nr && t.canSplit && (l = !0))
                        });
                        var p = h.length;
                        if (p < 8) {
                            var f = void 0;
                            f = 1 == p ? 16 : 2 == p ? 8 : p <= 4 ? 4 : 2,
                            this.gameCore.ShowDebugValue("div", f);
                            var g = It.mass / f;
                            a.mass > 1.3 * g && (d = !0)
                        }
                    }
                    this.AimTargetData.SetTarget(s, l, d),
                    t.forEach(function(t) {
                        t.showMark = !1,
                        t.canEat = !1,
                        t.canEaten = !1,
                        t.sizeLevel = -1
                    }),
                    t.forEach(function(t) {
                        var e = t.mass
                          , n = It.mass
                          , i = 4 * n * 1.3
                          , o = 2 * n * 1.3
                          , r = n * 1.3
                          , s = n / 1.3
                          , a = n / 2 * 1.3
                          , l = n / 2 / 1.3
                          , c = n / 4 / 1.3
                          , h = n / 8 * 1.3
                          , d = n / 8 / 1.3
                          , n = wt.gs.uconfig.MarkerLight ? c : d;
                        if (wt.gs.uconfig.MarkerExtend) {
                            t.sizeLevel = e > i ? 0 : e > o ? 1 : e > r ? 2 : e > s ? 3 : e > a ? 4 : e > l ? 5 : e > c ? 6 : e > h ? 7 : e > d ? 8 : -1
                        } else {
                            t.sizeLevel = e > o ? 0 : e > r ? 1 : e > s ? 2 : e > l ? 3 : e > n ? 4 : wt.gs.uconfig.MarkerLight ? -1 : 5
                        }
                    }),
                    h.forEach(function(a) {
                        var l = .5 * a.mass * .77;
                        t.forEach(function(t) {
                            if (!(h.indexOf(t) >= 0)) {
                                if (kt.GameHelper.HitTestAABB(a.nx, a.ny, t.nx, t.ny, 1200)) {
                                    var e = c.gameCore.sight
                                      , n = new m.Vector(e.aimCursorX - a.nx,e.aimCursorY - a.ny);
                                    n.Normalize(),
                                    n.Scale(1200);
                                    var i = a.nx + n.x
                                      , o = a.ny + n.y;
                                    if (!(kt.GameHelper.GetLinePointDist(a.nx, a.ny, i, o, t.nx, t.ny) > a.nr + t.nr)) {
                                        t.showMark = !0;
                                        var r = kt.GameHelper.GetDist(a.nx, a.ny, t.nx, t.ny);
                                        if (t.mass < l && a.canSplit && r < 720 + a.nr && (t.canEat = !0),
                                        a == It && r < 720 + a.nr) {
                                            var s = 2 * a.mass * 1.3;
                                            t.mass > s && (t.canEaten = !0,
                                            t.showMark = !0)
                                        }
                                    }
                                }
                            }
                        })
                    }),
                    h.forEach(function(t) {
                        return t.splitNum = h.length
                    })
                }
                this.eatingLimitList = [],
                t.forEach(function(s) {
                    0 == s.cellType && t.forEach(function(t) {
                        if (0 == t.cellType && s.ownerPlayerId != t.ownerPlayerId && kt.GameHelper.HitTestAABB(s.nx, s.ny, t.nx, t.ny, s.nr + t.nr)) {
                            var e = s.nr > t.nr ? s : t
                              , n = s == e ? t : s;
                            if (kt.GameHelper.GetDist(s.nx, s.ny, t.nx, t.ny) < e.nr) {
                                var i = e.mass > 1.3 * n.mass
                                  , o = e.nr - .41 * n.nr
                                  , r = bt.Arrays.First(c.eatingLimitList, function(t) {
                                    return t.eaterId == e.nodeId
                                });
                                r ? o > r.limitRadius && (r.limitRadius = o,
                                r.eatenId = n.nodeId) : c.eatingLimitList.push(new v(e.nodeId,n.nodeId,o,i))
                            }
                        }
                    })
                })
            }
        }
        ,
        t
    }();
    e.NodeAnalyzer = b;
    var C = function() {
        function t(t) {
            this.nodes = new Map,
            this.selfNodeIds = [[], []],
            this.activeSelfPlayerId = -1,
            this.gameCore = t,
            this.nodeAnalyzer = new b(t)
        }
        return Object.defineProperty(t.prototype, "uMan", {
            get: function() {
                return this.gameCore.uMan
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "gameHud", {
            get: function() {
                return this.gameCore.gameHudModel
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "dataReceiver", {
            get: function() {
                return this.gameCore.dataRecorder
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "sight", {
            get: function() {
                return this.gameCore.sight
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "operationUnitIndex", {
            get: function() {
                return this.activeSelfPlayerId == this.uMan.selfUserId ? 0 : 1
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "hasSelfNode", {
            get: function() {
                return this.selfNodeIds[0].length > 0 || this.selfNodeIds[1].length > 0
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.PostClearAllNodes = function() {
            this.selfNodeIds = [[], []],
            this.nodes.forEach(function(t) {
                y.Pool.Release(t)
            }),
            this.nodes.clear()
        }
        ,
        t.prototype.ResetToInitialiState = function() {
            this.uMan.ClearUserInfos(),
            this.PostClearAllNodes()
        }
        ,
        t.prototype.SyncGameViewToModel = function() {
            this.nodeAnalyzer.UpdateNodeAnalysisProps(),
            this.gameViewSyncNodesToListProc()
        }
        ,
        t.prototype.CalcurateCenterPointOfAllSelfCells = function() {
            for (var t = 0, e = 0, n = 0, i = 0; i < 2; i++)
                for (var o = 0, r = this.selfNodeIds[i]; o < r.length; o++) {
                    var s = r[o]
                      , a = this.nodes.get(s);
                    t += a.nx * a.mass,
                    e += a.ny * a.mass,
                    0,
                    n += a.mass
                }
            return [t /= n, e /= n]
        }
        ,
        t.prototype.UpdateSelfScore = function() {
            var t = 0;
            if (!wt.gs.gstates.isBenchmarkMode)
                for (var e = 0; e < 2; e++)
                    for (var n = 0, i = this.selfNodeIds[e]; n < i.length; n++) {
                        var o = i[n];
                        t += this.nodes.get(o).mass
                    }
            this.gameHud.PostSelfScoreData(t)
        }
        ,
        t.prototype.PostNodeData = function(t, e, n, i, o, r, s, a, l, c) {
            var h = this.nodes.get(t)
              , d = !1;
            if (!h && (h = y.Pool.Gain(),
            bt.Utils.Confirm(h),
            h.Initialize(t, e, r, s, c),
            this.nodes.set(t, h),
            h.nx = h.ox = h.x = n,
            h.ny = h.oy = h.y = i,
            h.nr = h.or = h.r = kt.GameHelper.MassToRadius(o),
            0 == h.cellType)) {
                var u = kt.GameHelper.DecodePlayerId(r)
                  , p = u[0]
                  , f = u[1];
                p == this.uMan.selfUserId && (0 == this.selfNodeIds[f].length && (d = !0),
                this.selfNodeIds[f].push(t),
                this.selfNodeIds[f].sort())
            }
            if (wt.gs.uconfig.InterpolationType == 1) {
                const g = c;
                h.LinearUpdate(g);
                h.updateStamp = g;
                h.ox = h.x;
                h.oy = h.y;
                h.or = h.r
            }
            h.UpdateProps(n, i, o, a, l),
            d && this.sight.SetSpawned()
        }
        ,
        t.prototype.PostNodeRemoval = function(t) {
            var e = this.nodes.get(t);
            e && (this.nodes.delete(t),
            y.Pool.Release(e),
            (bt.Arrays.Remove(this.selfNodeIds[0], t) || bt.Arrays.Remove(this.selfNodeIds[1], t)) && 0 == this.selfNodeIds[0].length && 0 == this.selfNodeIds[1].length && this.selfUnitsDeadCallback && this.selfUnitsDeadCallback())
        }
        ,
        t.prototype.RecordLatencyCheckStartTime = function() {
            this.latencyCheckStartTime = Date.now()
        }
        ,
        t.prototype.PostExternalChatMessage = function(t, e) {
            new Date;
            var n = bt.DateTimeHelper.GetHourMinutesString();
            this.gameHud.PostChatMessage(n, t, e, null)
        }
        ,
        t.prototype.OnEnterBenchMarkMode = function() {
            this.gameHud.PostLeaderboardData([]),
            this.gameHud.PostTeamRankingData([]),
            this.gameHud.PostMapData([]),
            this.PostClearAllNodes(),
            this.SyncGameViewToModel(),
            this.gameHud.PostServerStatusData(""),
            this.gameHud.PostLatencyData(0),
            this.gameHud.PostServerUserNumData(0, 0, 0, 0)
        }
        ,
        t.prototype.GetPlayerIdUnderCursor = function(e, n) {
            var i = -1;
            return this.nodes.forEach(function(t) {
                -1 == i && (0 == t.cellType && kt.GameHelper.GetDist(t.nx, t.ny, e, n) < t.nr && (i = t.ownerPlayerId))
            }),
            i
        }
        ,
        t.prototype.GetNodeIdUnderCursor = function(e, n) {
            var i = -1;
            return this.nodes.forEach(function(t) {
                -1 == i && (0 == t.cellType && kt.GameHelper.GetDist(t.nx, t.ny, e, n) < t.nr && (i = t.nodeId))
            }),
            i
        }
        ,
        t.prototype.DecodeFrame = function(t, e, n) {
            var i = new Ct.DataFrameReader(t);
            switch (i.ReadUint8()) {
            case 43:
                var O = i.ReadUint16();
                this.uMan.PostSelfUserId(O);
                break;
            case 65:
                i.ReadFloat32(),
                i.ReadFloat32();
                var H = i.ReadFloat32();
                i.ReadFloat32();
                wt.gs.gconfig.UpdateFieldSize(H),
                this.sight.Init();
                break;
            case 42:
                for (var o = i.ReadUint16(), r = 0; r < o; r++) {
                    var s = i.ReadUint16()
                      , a = i.ReadStringEx()
                      , l = i.ReadStringEx()
                      , c = i.ReadStringEx()
                      , B = i.ReadUint8() > 0
                      , h = i.ReadUint16()
                      , G = i.ReadStringEx()
                      , d = i.ReadStringEx();
                    if (e) {
                        if ((M = this.uMan.GetUserInfoById(s)) != this.uMan.fallbackUserInfo) {
                            var u = xt.InternalPackets.UserEntryInfo(s, a, l, h, c, d);
                            this.dataReceiver.PostInternalRecordingPacket(u)
                        }
                        M.clientId,
                        this.uMan.selfUserId
                    }
                    this.uMan.PostUserInfoData(s, a, l, h, c, d, B, G)
                }
                break;
            case 45:
                for (o = i.ReadUint16(),
                r = 0; r < o; r++) {
                    var L = i.ReadUint16();
                    this.uMan.PostUserLeave(L)
                }
                break;
            case 39:
                for (o = i.ReadUint16(),
                r = 0; r < o; r++) {
                    var p = i.ReadUint16()
                      , z = (s = i.ReadUint16(),
                    i.ReadUint8())
                      , j = i.ReadUint8()
                      , V = i.ReadUint8()
                      , W = i.ReadUint8()
                      , f = z << 16 | j << 8 | V;
                    if (e)
                        if ((M = this.uMan.GetUserInfoById(p)) != this.uMan.fallbackUserInfo) {
                            var K = M.colors[1 & W];
                            this.dataReceiver.PostInternalRecordingPacket(xt.InternalPackets.PlayerColor(p, K))
                        }
                    this.uMan.PostPlayerColorData(p, f)
                }
                break;
            case 36:
                for (o = i.ReadUint16(),
                r = 0; r < o; r++) {
                    h = i.ReadUint16();
                    var X = i.ReadStringEx()
                      , Y = i.ReadStringEx()
                      , q = i.ReadStringEx();
                    f = kt.ColorHelper.ColorFromHtmlString(Y);
                    if (e)
                        if ((T = this.uMan.GetTeamInfoById(h)) != this.uMan.fallbackTeamInfo) {
                            var Q = T.color;
                            this.dataReceiver.PostInternalRecordingPacket(xt.InternalPackets.TeamColor(h, Q))
                        }
                    this.uMan.PostTeamInfoData(h, f, X, q)
                }
                break;
            case 35:
                for (o = i.ReadUint16(),
                r = 0; r < o; r++) {
                    h = i.ReadUint16();
                    this.uMan.PostTeamInfoRemoval(h)
                }
                break;
            case 18:
                this.PostClearAllNodes(),
                n || this.SyncGameViewToModel();
                break;
            case 15:
                var J = i.ReadFloat32()
                  , Z = i.ReadFloat32();
                i.ReadFloat32(),
                i.ReadFloat32();
                if (this.sight.SetServerEyePos(J, Z),
                i.ReadUint8() > 0) {
                    p = i.ReadUint16();
                    var g = i.ReadFloat32()
                      , m = i.ReadFloat32()
                      , $ = i.ReadUint8()
                      , tt = i.ReadUint32();
                    var y = (1 & $) > 0
                      , v = (s = 65534 & p,
                    wt.gs.gstates);
                    s != this.uMan.selfUserId ? this.sight.setAimCursorProps(p, g, m, y) : this.sight.aimPlayerId = p;
                    v.isRealtimeMode && v.isSpectate && this.gameHud.SetSpecTargetScore(tt),
                    s == this.uMan.selfUserId && (this.activeSelfPlayerId = p)
                } else
                    this.sight.aimPlayerId = -1,
                    this.activeSelfPlayerId = -1;
                var et = this.sight.aimPlayerId > 0 ? 65534 & this.sight.aimPlayerId : -1;
                let t = performance.now();
                for (this.gameHud.SetAimPlayerClient(et); ; ) {
                    if (0 == (I = i.ReadUint32()))
                        break;
                    var S = i.ReadUint8()
                      , b = i.ReadFloat32()
                      , C = i.ReadFloat32()
                      , x = i.ReadUint16()
                      , _ = (p = i.ReadUint16(),
                    0);
                    1 == S && (_ = i.ReadUint32());
                    var k = 0
                      , w = 0;
                    if (i.ReadUint8() && (k = i.ReadFloat32(),
                    w = i.ReadFloat32()),
                    e && !this.nodes.has(I)) {
                        u = xt.InternalPackets.NodeRemoval(I);
                        this.dataReceiver.PostInternalRecordingPacket(u)
                    }
                    n && (w = 0),
                    this.PostNodeData(I, S, b, C, x, p, _, k, w, t)
                }
                for (o = i.ReadUint16(),
                r = 0; r < o; r++) {
                    var I = i.ReadUint32();
                    this.PostNodeRemoval(I)
                }
                n || this.SyncGameViewToModel();
                break;
            case 47:
                if (n)
                    break;
                o = i.ReadUint8();
                var P = new Array;
                for (r = 0; r < o; r++) {
                    p = i.ReadUint16(),
                    x = i.ReadUint32();
                    var M = this.uMan.GetUserInfoById(p)
                      , T = this.uMan.GetTeamInfoById(M.teamId);
                    P.push(new _t.TLeaderboardData(M.fullName,x,T.colorStr))
                }
                this.gameHud.PostLeaderboardData(P);
                break;
            case 46:
                if (n)
                    break;
                for (o = i.ReadUint8(),
                P = new Array,
                r = 0; r < o; r++) {
                    h = i.ReadUint16();
                    var nt = i.ReadUint16()
                      , R = this.uMan.GetTeamInfoById(h);
                    P.push(new _t.TLeaderboardData(R.teamName,nt,R.colorStr))
                }
                this.gameHud.PostTeamRankingData(P);
                break;
            case 41:
                if (n)
                    break;
                o = i.ReadUint16();
                var A = new Array;
                for (r = 0; r < o; r++) {
                    p = i.ReadUint16(),
                    b = i.ReadInt16(),
                    C = i.ReadInt16(),
                    x = i.ReadUint16();
                    A.push(new _t.TMapData(p,b,C,x))
                }
                this.gameHud.PostMapData(A);
                break;
            case 128:
                s = i.ReadUint16(),
                i.ReadStringEx();
                var U = i.ReadStringEx()
                  , it = (new Date,
                bt.DateTimeHelper.GetHourMinutesString())
                  , ot = (M = this.uMan.GetUserInfoById(s),
                T = this.uMan.GetTeamInfoById(M.teamId),
                !0);
                It.AppConfigurator.instance.useTeamSeparatedChat && T != this.uMan.selfTeamInfo && (ot = !1),
                ot ? this.gameHud.PostChatMessage(it, M.fullName, U, T.colorStr) : console.log("stray chat message: " + it + " " + M.fullName + " " + U);
                break;
            case 14:
                break;
            case 131:
                if (n)
                    break;
                var rt = Date.now() - this.latencyCheckStartTime;
                this.gameHud.PostLatencyData(rt);
                break;
            case 133:
                var E = i.ReadStringEx();
                console.log(E);
                break;
            case 200:
                var F = i.ReadStringEx()
                  , N = JSON.parse(F);
                wt.gs.gconfig.ShowAlwaysAllPlayersInMap = !N.enableTeamMapSeparation,
                wt.gs.gconfig.ShowAlwaysAllPlayersSkin = !N.enableTeamSkinSeparation;
                var D = this.gameCore.chatAppModel;
                D && D.SetGameTeamChatSessionEnabled(N.enableTeamChatSeparation);
                var st = wt.gs.gstates.enableTeamChatSeparationCurrent != N.enableTeamChatSeparation;
                wt.gs.gstates.enableTeamChatSeparationCurrent = N.enableTeamChatSeparation,
                D && D.SetServerSignature(wt.gs.gstates.chatRoomSig, st);
                break;
            case 201:
                F = i.ReadStringEx();
                this.gameHud.PostServerInstructionText(F);
                break;
            case 202:
                E = i.ReadStringEx();
                this.gameHud.PostServerDisplayMessage(E);
                break;
            case 203:
                if (n)
                    break;
                F = i.ReadStringEx();
                this.gameHud.PostServerStatusData(F);
                break;
            case 91:
                if (n)
                    break;
                i.ReadUint16();
                var at = i.ReadUint16()
                  , lt = i.ReadUint16()
                  , ct = i.ReadUint16()
                  , ht = i.ReadUint16();
                i.ReadStringEx(),
                i.ReadUint32();
                this.gameHud.PostServerUserNumData(at, ct, lt, ht);
                break;
            case 161:
                I = i.ReadUint32();
                this.PostNodeRemoval(I);
                break;
            case 162:
                s = i.ReadUint16();
                var dt = i.ReadStringEx();
                l = i.ReadStringEx(),
                h = i.ReadUint16(),
                c = i.ReadStringEx(),
                d = i.ReadStringEx();
                this.uMan.PostUserInfoData(s, dt, l, h, c, d);
                break;
            case 163:
                p = i.ReadUint16(),
                f = i.ReadUint32();
                this.uMan.PostPlayerColorData(p, f);
                break;
            case 164:
                h = i.ReadUint16(),
                f = i.ReadUint32();
                this.uMan.PostTeamInfoData(h, f);
                break;
            case 166:
                var ut = i.ReadInt32()
                  , pt = i.ReadInt32()
                  , ft = i.ReadFloat32()
                  , gt = (g = i.ReadInt32(),
                m = i.ReadInt32(),
                y = i.ReadUint8() > 0,
                i.ReadUint16());
                this.sight.FeedReplaySightState(ut, pt, ft, g, m, y, gt);
                break;
            case 19:
                i.ReadUint8();
                var mt = i.ReadInt32()
                  , yt = i.ReadInt32()
                  , vt = i.ReadInt32()
                  , St = Date.now();
                this.sight.teamCircleX = mt,
                this.sight.teamCircleY = yt,
                this.sight.teamCircleRadius = vt,
                this.sight.teamCircleTimeStamp = St
            }
        }
        ,
        t
    }();
    e.NodeManager = C
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var i = function() {
        function t() {}
        return t.PermanentKeeped = [42, 45, 39, 36, 35, 65],
        t.NotForRecord = [43, 200, 201, 131, 133, 202],
        t
    }();
    e.OpcodeGroups = i;
    var o = function() {
        return function(t, e, n, i) {
            this.playerId = t,
            this.nx = e,
            this.ny = n,
            this.mass = i
        }
    }();
    e.TMapData = o;
    var r = function() {
        return function(t, e, n) {
            this.name = t,
            this.score = e,
            this.colorStr = n
        }
    }();
    e.TLeaderboardData = r
}
, function(t, e, n) {
    "use strict";
    var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            e.hasOwnProperty(n) && (t[n] = e[n])
    }
    ,
    function(t, e) {
        function n() {
            this.constructor = t
        }
        i(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }
    ), r = this && this.__decorate || function(t, e, n, i) {
        var o, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            s = Reflect.decorate(t, e, n, i);
        else
            for (var a = t.length - 1; a >= 0; a--)
                (o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
        return r > 3 && s && Object.defineProperty(e, n, s),
        s
    }
    ;
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = n(5)
      , a = n(10)
      , l = n(0)
      , c = function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.uconfig = l.gs.uconfig,
            t.skinMan = a.SkinImageManager.instance,
            t
        }
        return o(t, e),
        t.prototype.mounted = function() {
            this.skinMan.bus.on("render", this.update.bind(this)),
            window.ondragstart = function() {
                return !1
            }
        }
        ,
        t.prototype.onCellClick = function(t) {
            var e = t.item.uri
              , n = t.item.allowed;
            this.skinMan.setImageAvailability(e, !n)
        }
        ,
        t.prototype.onButton = function(t) {
            var e = t.target.dataset.sig;
            "acceptNewSkins" == e && this.uconfig.SetAcceptNewSkins(!0),
            "declineNewSkins" == e && this.uconfig.SetAcceptNewSkins(!1),
            "acceptAll" == e && this.skinMan.setImageAvailabilityAll(!0),
            "declineAll" == e && this.skinMan.setImageAvailabilityAll(!1)
        }
        ,
        t = r([s.template("\n<skin-filter-panel>\n\t<style>\n\t\t.skin_filter_panel_root{\n\t\t\twidth: 400px;\n\t\t\theight: 530px;\n\t\t\tbackground-color: #F0F6FF;\n\t\t\tposition: absolute;\n\t\t\ttop: 34px;\n\t\t\tright: 6px;\n\t\t\tborder: solid 1px #44A;\n\t\t\tborder-radius: 2px;\n\t\t\tcolor: #448;\n\t\t\tpadding: 8px;\n\t\t\tfont-size: 16px;\n\t\t}\n\n\t\t.sf_skinlistbox_outer{\n\t\t\theight: 400px;\n\t\t\toverflow-y: scroll;\n\t\t\tborder: solid 1px #CCE;\n\t\t}\n\n\t\t.sf_skinlistbox{\n\t\t\tdisplay: flex;\n\t\t\tflex-wrap: wrap;\n\t\t\talign-items: flex-start;\n\t\t}\n\n\t\t.sf_skinlistbox > div{\n\t\t\twidth: 60px;\n\t\t\theight: 60px;\n\t\t\tdisplay: flex;\n\t\t\tborder: solid 1px #CCE;\n\t\t\tposition: relative;\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.sf_skinlistbox > div > *{\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t}\n\t\t.sf_skinlistbox > div img{\n\t\t\tmax-width: 100%;\n\t\t\tmax-height: 100%;\n\t\t\tleft: 0;\n\t\t\tright: 0;\n\t\t\ttop: 0;\n\t\t\tbottom: 0;\n\t\t\tmargin: auto;\n\t\t}\n\n\t\t.sf_skinlistbox > div > .cover{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tbackground-color: rgba(0, 0, 0, 0.4);\n\t\t}\n\n\t\t.sf_img_block{\n\t\t\topacity: 0.2;\n\t\t}\n\n\t\t.sf_box{\n\t\t\tmargin-bottom: 10px;\n\t\t}\n\n\t\t.sfbt{\n\t\t\tdisplay: inline-block;\n\t\t\tbackground-color: #FFF;\n\t\t\tcolor: #008;\n\t\t\tborder-radius: 2px;\n\t\t\tpadding: 0 4px;\n\t\t\tcursor: pointer;\n\t\t\tborder: solid 1px #008;\n\t\t}\n\n\t\t.sfbt_active{\n\t\t\tbackground-color: #0CF;\n\t\t}\n\t</style>\n\n\t<div class='skin_filter_panel_root'>\n\t\t<div class='sf_box'>\n\t\t\tスキン画像フィルタ\n\t\t</div>\n\n\t\t<div class='sf_skinlistbox_outer sf_box'>\n\t\t\t<div class='sf_skinlistbox'>\n\t\t\t\t<div each={allowed, uri in skinMan.skins} onclick={onCellClick}>\n\t\t\t\t\t<img src={uri} />\n\t\t\t\t\t<div class='cover' show={!allowed}>\n\t\t\t\t\t\t<img src='gr/blocked.png' class='sf_img_block' />\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class='sf_box'>\n\t\t\t<div class='sfbt' onclick={onButton} data-sig='acceptAll'>\n\t\t\t\t全て許可\n\t\t\t</div>\n\n\t\t\t<div class='sfbt' onclick={onButton} data-sig='declineAll'>\n\t\t\t\t全て拒否\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class='sf_box'>\n\t\t\t新規画像:\n\n\t\t\t<div class={sfbt: true, sfbt_active: uconfig.acceptNewSkins} onclick={onButton} data-sig='acceptNewSkins'>\n\t\t\t\t許可\n\t\t\t</div>\n\n\t\t\t<div class={sfbt: true, sfbt_active: !uconfig.acceptNewSkins} onclick={onButton} data-sig='declineNewSkins'>\n\t\t\t\t拒否\n\t\t\t</div>\n\n\t\t</div>\n\n\t</div>\n</skin-filter-panel>\n")], t)
    }(s.Element);
    e.SkinFilterPanelTag = c
}
, function(t, e, n) {
    "use strict";
    var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            e.hasOwnProperty(n) && (t[n] = e[n])
    }
    ,
    function(t, e) {
        function n() {
            this.constructor = t
        }
        i(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }
    ), r = this && this.__decorate || function(t, e, n, i) {
        var o, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            s = Reflect.decorate(t, e, n, i);
        else
            for (var a = t.length - 1; a >= 0; a--)
                (o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
        return r > 3 && s && Object.defineProperty(e, n, s),
        s
    }
    ;
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = n(5)
      , a = n(2)
      , l = n(0)
      , c = n(9)
      , h = n(1)
      , d = 260
      , u = function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.uconfig = l.gs.uconfig,
            t.cssColors = l.gs.ucolors.cssColors,
            t.appConfig = a.AppConfigurator.instance,
            t.utexts = l.gs.utexts,
            t.isJapanese = a.AppConfigurator.instance.isJapanese,
            t.model = c.ConfigHub.instance,
            t.editModel = new c.ColorEditModel,
            t.windowMouseHandlerProc = null,
            t.pickerEndX = d - 6,
            t
        }
        return o(t, e),
        t.prototype.mounted = function() {
            this.editModel.SetColor(this.model.curColorEntry.color),
            this.UpdateColorView(),
            window.addEventListener("mousemove", this.onWindowMouseMove.bind(this)),
            window.addEventListener("mouseup", this.onWindowMouseUp.bind(this))
        }
        ,
        t.prototype.onCardSelected = function(t) {
            var e = t.currentTarget.value;
            this.model.selectColorCard(e),
            this.editModel.SetColor(this.model.curColorEntry.color)
        }
        ,
        t.prototype.onCardSelected2 = function(t) {
            this.UpdateColorView()
        }
        ,
        t.prototype.onMainCanvasClick = function() {}
        ,
        t.prototype.onWindowMouseMove = function(t) {
            this.windowMouseHandlerProc && this.windowMouseHandlerProc(t)
        }
        ,
        t.prototype.onWindowMouseUp = function() {
            this.windowMouseHandlerProc = null
        }
        ,
        t.prototype.ReflectEditModelColorToModel = function() {
            this.model.curColorEntry.SetColor(this.editModel.color, !0),
            this.UpdateColorView(),
            this.update(),
            this.appRoot.update()
        }
        ,
        t.prototype.removeFocusOnPage = function() {
            var t = document.activeElement;
            t && t.blur(),
            window.getSelection().removeAllRanges()
        }
        ,
        t.prototype.onHueGaugeMouseDown = function(t) {
            var i = this
              , o = t.target.getBoundingClientRect().left
              , e = function(t) {
                var e = t.pageX - o
                  , n = h.Nums.VMap(e, 0, i.pickerEndX, 0, .999, !0);
                i.editModel.SetHue(n),
                i.ReflectEditModelColorToModel(),
                i.update()
            };
            return e(t),
            this.windowMouseHandlerProc = e,
            t.preventDefault(),
            !1
        }
        ,
        t.prototype.onMainGaugeMouseDown = function(t) {
            var r = this
              , e = t.target.getBoundingClientRect()
              , s = e.left
              , a = e.top
              , n = function(t) {
                var e = t.pageX - s
                  , n = t.pageY - a
                  , i = h.Nums.VMap(e, 0, r.pickerEndX, 0, 1, !0)
                  , o = h.Nums.VMap(n, 0, r.pickerEndX, 0, 1, !0);
                r.editModel.SetSV(i, 1 - o),
                r.ReflectEditModelColorToModel()
            };
            return n(t),
            this.windowMouseHandlerProc = n,
            t.preventDefault(),
            !1
        }
        ,
        t.prototype.onAlphaGaugeMouseDown = function(t) {
            var i = this
              , o = t.target.getBoundingClientRect().left
              , e = function(t) {
                var e = t.pageX - o
                  , n = h.Nums.VMap(e, 0, i.pickerEndX, 0, 1, !0);
                i.editModel.SetAlpha(n),
                i.ReflectEditModelColorToModel()
            };
            return e(t),
            this.windowMouseHandlerProc = e,
            t.preventDefault(),
            !1
        }
        ,
        t.prototype.onColorTextInput = function(t) {
            var e = t.target.value;
            this.editModel.SetByHtmlColor(e),
            this.ReflectEditModelColorToModel()
        }
        ,
        t.prototype.UpdateColorView = function() {
            this.drawAlphaCanvas(),
            this.drawMainCanvas();
            var t = this.pickerEndX;
            this.refs.knob_hue.style.left = this.editModel.hue * t + "px",
            this.refs.knob_alpha.style.left = this.editModel.alpha * t + "px",
            this.refs.knob_main.style.left = this.editModel.sat * t + "px",
            this.refs.knob_main.style.top = (1 - this.editModel.bri) * t + "px"
        }
        ,
        t.prototype.drawMainCanvas = function() {
            var t = this.refs.picker_main_canvas
              , e = t.width
              , n = t.height
              , i = t.getContext("2d");
            i.clearRect(0, 0, e, n);
            for (var o = 360 * this.editModel.hue, r = 0; r < n; r++) {
                var s = i.createLinearGradient(0, 0, e, 0)
                  , a = "hsl(" + o + ",0%," + h.Nums.VMap(r, 0, n, 100, 0) + "%)"
                  , l = "hsl(" + o + ",100%," + h.Nums.VMap(r, 0, n, 50, 0) + "%)";
                s.addColorStop(0, a),
                s.addColorStop(1, l),
                i.fillStyle = s,
                i.fillRect(0, r, e, 1)
            }
        }
        ,
        t.prototype.drawAlphaCanvas = function() {
            var t = this.refs.picker_alpha_canvas
              , e = t.width
              , n = t.height
              , i = t.getContext("2d");
            i.clearRect(0, 0, e, n),
            i.beginPath();
            var o = i.createLinearGradient(0, 0, e, 0)
              , r = this.model.curColorEntry.color
              , s = r >> 16 & 255
              , a = r >> 8 & 255
              , l = 255 & r;
            o.addColorStop(0, "rgba(" + s + "," + a + "," + l + ",0.0)"),
            o.addColorStop(1, "rgba(" + s + "," + a + "," + l + ",1.0)"),
            i.fillStyle = o,
            i.rect(0, 0, e, n),
            i.fill()
        }
        ,
        t.prototype.optionChanged = function(t, e) {
            t.item.SetValue(e)
        }
        ,
        t.prototype.checkChanged = function(t) {
            this.optionChanged(t, t.target.checked)
        }
        ,
        Object.defineProperty(t.prototype, "appRoot", {
            get: function() {
                return this.parent.parent
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.onConfigTextInput = function(t) {
            l.gs.uconfig.SetValue(t.target.name, t.target.value)
        }
        ,
        t.prototype.onConfigCheckChanged = function(t) {
            l.gs.uconfig.SetValue(t.target.name, t.target.checked)
        }
        ,
        t = r([s.template("\n<color-config-panel>\n\t<style>\n\t\t.panel_content_box{\n\t\t\theight: 632px;\n\t\t\t_overflow-y: scroll;\n\t\t\t_padding: 0 10px;\n\t\t}\n\n\t\t.header_box{\n\t\t\theight: 48px;\n\t\t\tfont-size: 24px;\n\t\t\tpadding-left: 12px;\n\t\t\tline-height: 48px;\n\t\t}\n\n\t\t.panel_content_inner{\n\t\t\twidth: 700px;\n\t\t\tmargin: 0 auto;\n\t\t\tmargin-top: 50px;\n\t\t}\n\n\t\t.box_frame{\n\t\t\tborder: solid 1px;\n\t\t\tborder-radius: 5px;\n\t\t\tmargin-bottom: 10px;\n\t\t}\n\n\t\t.box_header{\n\t\t\twidth: 100%;\n\t\t\tpadding-top: 2px;\n\t\t\tpadding-left: 5px;\n\t\t\tborder-radius: 3px 3px 0 0;\n\t\t\tfont-size: 20px;\n\t\t}\n\n\t\t.box_content{\n\t\t\tpadding: 10px;\n\t\t}\n\n\t\t.ui_config{\n\t\t\theight: 28px;\n\t\t}\n\t\t\n\t\t.ui_checkbox{\n\t\t\twidth: 18px;\n\t\t\theight: 18px;\n\t\t\tvertical-align: middle;\n\t\t}\n\t\t\n\t\t.ui_color_text_input{\n\t\t\twidth: 100px;\n\t\t}\n\n\t\t.main_config_panel_root{\n\t\t}\n\n\t\t.color_edit_part{\n\t\t\theight: 320px;\n\t\t}\n\t\t.color_entries_outer{\n\t\t\tborder: solid 1px #AAA;\n\t\t\twidth: 380px;\n\t\t\theight: 100%;\n\t\t\toverflow-y: scroll;\n\t\t\tuser-select: none;\n\t\t\tcursor: default;\n\t\t\tfloat: left;\n\t\t}\n\n\t\t.color_entry_card{\n\t\t}\n\n\t\t.card_selected{\n\t\t\tbackground-color: #0BF;\n\t\t}\n\n\t\t.color_header{\n\t\t\tdisplay: inline-block;\n\t\t\twidth: 335px;\n\t\t\twhite-space: nowrap;\n\t\t\toverflow: hidden;\n\t\t\tvertical-align: middle;\n\t\t\tpadding-left: 8px;\n\t\t}\n\n\t\t.color_cell{\n\t\t\twidth: 14px;\n\t\t\theight: 14px;\n\t\t\tdisplay: inline-block;\n\t\t\tborder: solid 1px #000;\n\t\t\tvertical-align: middle;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.color_cell > *{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t}\n\n\t\t.color_picker_outer{\n\t\t\twidth: 280px;\n\t\t\theight: 100%;\n\t\t\t_border: solid 1px #AAA;\n\t\t\tfloat: left;\n\t\t\tdisplay: flex;\n\t\t}\n\n\t\t.color_picker_inner{\n\t\t\tmargin: auto auto;\n\t\t\twidth: " + d + "px;\n\t\t\theight: " + (d + 60) + "px;\n\t\t}\n\n\t\t.color_text_input_outer{\n\t\t\tmargin-bottom: 10px;\n\t\t}\n\n\t\tinput.color_text_input{\n\t\t\tborder: none;\n\t\t\twidth: 70px;\n\t\t\theight: 26px;\n\t\t\tpadding-left: 8px;\n\t\t}\n\n\t\t.gauge_box{\n\t\t\twidth: " + d + "px;\n\t\t\t_border: solid 1px #AAA;\n\t\t\tuser-select: none;\n\t\t\tposition: relative;\n\t\t\tcursor: default;\n\t\t}\n\n\t\t.gauge_box_I{\n\t\t\theight: 30px; \n\t\t}\n\n\t\t.gauge_box_L{\n\t\t\theight: " + d + "px;\n\t\t}\n\n\t\t.picker_main_canvas_outer{\n\t\t\t_border: solid 1px #AAA;\n\t\t\tuser-select: none;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.gauge_box > *{\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t}\n\n\t\t.bar_image{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t}\n\n\t\t.gauge_cover{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t}\n\n\t\t.knob{\n\t\t\tborder: solid 1px #000;\n\t\t\tposition: absolute;\n\t\t\tbackground-color: rgba(255, 255, 255, 1.0);\n\t\t}\n\n\t\t.knob_I{\n\t\t\twidth: 6px;\n\t\t\theight: 30px;\n\t\t}\n\n\t\t.knob_L{\n\t\t\twidth: 6px;\n\t\t\theight: 6px;\n\t\t}\n\n\t\t.config_box{}\n\t</style>\n\t<div class=\"main_config_panel_root\">\n\t\t<div class=\"header_box\">\n\t\t\t{utexts.hdrTheme}\n\t\t</div>\n\n\t\t<div class=\"panel_content_box\">\n\t\t\t<div class='panel_content_inner'>\n\n\t\t\t\t<div class='box_frame' style='border-color: {cssColors.clPanelForeground}'>\n\t\t\t\t\t<div class='box_header' style='background-color: {cssColors.clPanelForeground}; color:{cssColors.clPanelHeader}'>\n\t\t\t\t\t　<span style='font-family: IConFont1'>&#xe90d</span><span>{utexts.hdrColor}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class='box_content' style='padding: 15px'>\n\n\t\t\t\t\t\t<div class='color_edit_part'>\n\t\t\t\t\t\t\t<div class='color_entries_outer' onmousedown={onCardSelected2}\n\t\t\t\t\t\t\t\tstyle='border-color: {cssColors.clPanelForeground}'>\n\t\t\t\t\t\t\t\t<virtual each={m in model.colorEntries}>\n\t\t\t\t\t\t\t\t\t<div class='color_entry_card' \n\t\t\t\t\t\t\t\t\t\tstyle='background: {m == model.curColorEntry ? cssColors.clUiButtonActive : \"none\"}'\n\t\t\t\t\t\t\t\t\t\tvalue={m.key} onmousedown={onCardSelected}>\n\t\t\t\t\t\t\t\t\t\t<div class='color_header'>\n\t\t\t\t\t\t\t\t\t\t\t{m.text}\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class='color_cell'>\n\t\t\t\t\t\t\t\t\t\t\t<img src='gr/checker_cell.png' />\n\t\t\t\t\t\t\t\t\t\t\t<div style='background: {m.cssColor}' />\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</virtual>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class='color_picker_outer'>\n\t\t\t\t\t\t\t\t<div class='color_text_input_outer' if={false}>\n\t\t\t\t\t\t\t\t\t<input class='color_text_input' value={model.curColorEntry.htmlColor} oninput={onColorTextInput} />\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class='color_picker_inner'>\n\t\t\t\t\t\t\t\t\t<div class='gauge_box gauge_box_I'>\n\t\t\t\t\t\t\t\t\t\t<img src='gr/huebar.png' class='bar_image' />\n\t\t\t\t\t\t\t\t\t\t<div class='knob knob_I' ref='knob_hue' />\n\t\t\t\t\t\t\t\t\t\t<div class='gauge_cover' onmousedown={onHueGaugeMouseDown} />\n\t\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t\t<div class='gauge_box gauge_box_L'>\n\t\t\t\t\t\t\t\t\t\t<canvas width='" + d + "' height='" + d + "' ref='picker_main_canvas' onclick={onMainCanvasClick}/>\n\t\t\t\t\t\t\t\t\t\t<div class='knob knob_L' ref='knob_main' />\n\t\t\t\t\t\t\t\t\t\t<div class='gauge_cover' onmousedown={onMainGaugeMouseDown} />\n\t\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t\t<div class='gauge_box gauge_box_I'>\n\t\t\t\t\t\t\t\t\t\t<img src='gr/checkbar.png' class='bar_image' />\n\t\t\t\t\t\t\t\t\t\t<canvas width='" + d + '\' height=\'30\' ref=\'picker_alpha_canvas\' />\n\t\t\t\t\t\t\t\t\t\t<div class=\'knob knob_I\' ref=\'knob_alpha\' />\n\t\t\t\t\t\t\t\t\t\t<div class=\'gauge_cover\' onmousedown={onAlphaGaugeMouseDown} />\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\'clear_both\' />\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\'box_frame\' style=\'border-color: {cssColors.clPanelForeground}\'>\n\t\t\t\t\t<div class=\'box_header\' style=\'background-color: {cssColors.clPanelForeground}; color:{cssColors.clPanelHeader}\'>\n\t\t\t\t\t　<span style=\'font-family: IConFont1\'>&#xe90d</span><span>{utexts.hdrWallpaper}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\'box_content\'>\n\n\t\t\t\t\t\t<div class=\'config_box\'>\n\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t{isJapanese ? \'フィールド背景\' : \'Field\'}\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t<input type="text" class="ui_config" style="width:200px" \n\t\t\t\t\t\t\t\t\t\t\tname="fieldBackImageUri"\n\t\t\t\t\t\t\t\t\t\t\tvalue={uconfig.fieldBackImageUri} onchange={onConfigTextInput} />\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td style="font-family: Arial">\n\t\t\t\t\t\t\t\t\t\t&#x03B1;\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t<input type="text" class="ui_config" style="width:30px" \n\t\t\t\t\t\t\t\t\t\t\tname="fieldBackImageAlpha"\n\t\t\t\t\t\t\t\t\t\t\tvalue={uconfig.fieldBackImageAlpha} oninput={onConfigTextInput} />\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\tL\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t<input type="checkbox" class="ui_config ui_checkbox"\n\t\t\t\t\t\t\t\t\t\t\tname="fieldBackImageDrawingMode2"\n\t\t\t\t\t\t\t\t\t\t\tchecked="{uconfig.fieldBackImageDrawingMode2}" onchange={onConfigCheckChanged}/>\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t</tr>\n\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t{isJapanese ? \'パネル背景\' : \'Panel\'}\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t<input type="text" class="ui_config" style="width:200px" \n\t\t\t\t\t\t\t\t\t\t\tname="panelBackImageUri"\n\t\t\t\t\t\t\t\t\t\t\tvalue={uconfig.panelBackImageUri} oninput={onConfigTextInput} />\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td style="font-family: Arial">\n\t\t\t\t\t\t\t\t\t\t&#x03B1;\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t<input type="text" class="ui_config" style="width:30px" \n\t\t\t\t\t\t\t\t\t\t\tname="panelBackImageAlpha"\n\t\t\t\t\t\t\t\t\t\t\tvalue={uconfig.panelBackImageAlpha} oninput={onConfigTextInput} />\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</color-config-panel>\n')], t)
    }(s.Element);
    e.ColorConfigPanelTag = u
}
, function(t, e, n) {
    "use strict";
    var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            e.hasOwnProperty(n) && (t[n] = e[n])
    }
    ,
    function(t, e) {
        function n() {
            this.constructor = t
        }
        i(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }
    ), r = this && this.__decorate || function(t, e, n, i) {
        var o, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            s = Reflect.decorate(t, e, n, i);
        else
            for (var a = t.length - 1; a >= 0; a--)
                (o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
        return r > 3 && s && Object.defineProperty(e, n, s),
        s
    }
    ;
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = n(5)
      , a = n(4)
      , l = n(2)
      , c = n(0)
      , h = n(9)
      , d = function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.uconfig = c.gs.uconfig,
            t.userEntry = a.gameCore.userEntryMan,
            t.cssColors = c.gs.ucolors.cssColors,
            t.appConfig = l.AppConfigurator.instance,
            t.gstates = c.gs.gstates,
            t.usupport = c.gs.usupport,
            t.utexts = c.gs.utexts,
            t.configHub = h.ConfigHub.instance,
            t.isJapanese = l.AppConfigurator.instance.isJapanese,
            t
        }
        return o(t, e),
        t.prototype.optionChanged = function(t, e) {
            t.item.m.SetValue(e)
        }
        ,
        t.prototype.checkChanged = function(t) {
            this.optionChanged(t, t.target.checked)
        }
        ,
        t.prototype.colorChanged = function(t) {
            return t.item.SetColor(t.target.value),
            this.appRoot.update(),
            !1
        }
        ,
        t.prototype.mounted = function() {
            a.gameCore.gameHudModel.configUpdatedProc = this.update.bind(this)
        }
        ,
        Object.defineProperty(t.prototype, "appRoot", {
            get: function() {
                return this.parent.parent
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.getHotKeyFromKeyEvent = function(t, e) {
            if (void 0 === e && (e = !1),
            t.repated)
                return -2;
            var n = t.which;
            if (16 == n || 17 == n || 18 == n || 229 == n)
                return -2;
            if (8 == n || 46 == n)
                return -1;
            var i = t.keyCode;
            t.ctrlKey && (i += c.ModificationKeyCode.Ctrl),
            t.shiftKey && (i += c.ModificationKeyCode.Shift),
            t.altKey && (i += c.ModificationKeyCode.Alt);
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
        }
        ,
        t.prototype.setToggleHotKey_Cells = function(t) {
            var e = this.getHotKeyFromKeyEvent(t, !0);
            -2 != e && t.item.m.SetToggleHotKey(e);
            return t.preventDefault(),
            !1
        }
        ,
        t.prototype.setHoldHotKey_Cells = function(t) {
            var e = this.getHotKeyFromKeyEvent(t, !0);
            -2 != e && t.item.m.SetHoldHotKey(e);
            return t.preventDefault(),
            !1
        }
        ,
        t.prototype.setToggleHotKey_Game = function(t) {
            var e = this.getHotKeyFromKeyEvent(t);
            -2 != e && t.item.m.SetToggleHotKey(e);
            return t.preventDefault(),
            !1
        }
        ,
        t.prototype.setControlHotKey = function(t) {
            var e = this.getHotKeyFromKeyEvent(t);
            -2 != e && t.item.m.SetHotKey(e);
            return t.preventDefault(),
            !1
        }
        ,
        t.prototype.onConfigTextInput = function(t) {
            c.gs.uconfig.SetValue(t.target.name, t.target.value)
        }
        ,
        t.prototype.onConfigCheckChanged = function(t) {
            c.gs.uconfig.SetValue(t.target.name, t.target.checked)
        }
        ,
        t.prototype.rangeInputChanged = function(t) {
            c.gs.uconfig.SetValue(t.target.name, t.target.value)
        }
        ,
        t.prototype.onResetButtonCliecked = function() {
            c.gs.uconfig.RecoverDefaultConfig()
        }
        ,
        t = r([s.template("\n<main-config-panel>\n\t<style>\n\t\t.panel_content_box{\n\t\t\theight: 632px;\n\t\t\toverflow-y: scroll;\n\t\t\tpadding: 10px;\n\t\t\tmargin-right: 4px;\n\t\t}\n\n\t\t.header_box{\n\t\t\theight: 48px;\n\t\t\tfont-size: 24px;\n\t\t\tpadding-left: 12px;\n\t\t\tline-height: 48px;\n\t\t}\n\n\t\t.content_column{\n\t\t\twidth: 380px;\n\t\t\tfloat: left;\n\t\t\tmargin: 0 8px;\n\t\t}\n\n\t\t.box_frame{\n\t\t\tborder: solid 1px;\n\t\t\tborder-radius: 5px;\n\t\t\tmargin-bottom: 10px;\n\t\t}\n\n\t\t.box_header{\n\t\t\twidth: 100%;\n\t\t\tpadding-top: 2px;\n\t\t\tpadding-left: 5px;\n\t\t\tborder-radius: 3px 3px 0 0;\n\t\t\tfont-size: 20px;\n\t\t}\n\n\t\t.box_content{\n\t\t\tpadding: 5px 10px;\n\t\t}\n\n\t\t.td_text{\n\t\t\twhite-space: nowrap;\n\t\t\toverflow: hidden;\n\t\t}\n\n\t\t.range_input{\n\t\t\twidth: 140px;\n\t\t\tvertical-align: top;\n\t\t}\n\n\t\ttd.centered{\n\t\t\ttext-align: center;\n\t\t}\n\n\t\t.ui_config{\n\t\t\theight: 28px;\n\t\t}\n\n\t\t.ui_checkbox{\n\t\t\twidth: 18px;\n\t\t\theight: 18px;\n\t\t\tvertical-align: middle;\n\t\t}\n\n\t\t.ui_hotkey_input{\n\t\t\twidth: 50px;\n\t\t\tborder: solid 1px #888;\n\t\t}\n\n\t\t.range_table td{\n\t\t\tpadding-right: 4px;\n\t\t\tfont-size: 15px;\n\t\t}\n\n\t\t.reset_button{\n\t\t\tfloat: right;\n\t\t\theight: 28px;\n\t\t\tpadding: 2px;\n\t\t\tfont-family: Meiryo, Arial;\n\t\t\tcursor: pointer;\n\t\t}\n\t</style>\n\t<div class=\"main_config_panel_root\">\n\t\t<div class=\"header_box\">\n\t\t\t<span>{utexts.hdrConfiguration}</span>\n\t\t</div>\n\t\t<div class=\"panel_content_box\">\n\t\t\t<div class='content_column'>\n\t\t\t\t<div class='box_frame' style='border-color: {cssColors.clPanelForeground}'>\n\t\t\t\t\t<div class='box_header' style='background-color: {cssColors.clPanelForeground}; color:{cssColors.clPanelHeader}'>\n\t\t\t\t\t　<span style='font-family: IConFont1'>&#xe994</span><span>{utexts.hdrCellDisplay}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class='box_content'>\n\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td colspan='2'></td>\n\t\t\t\t\t\t\t\t<td class='centered'>key1</td>\n\t\t\t\t\t\t\t\t<td class='centered'>key2</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr each={m in configHub.cellDisplayEntries}>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"ui_config ui_checkbox\" checked={m.value} onchange={checkChanged}> \n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<div class='td_text' style='width:220px'>{m.text}</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<input type=\"text\" class=\"ui_config ui_hotkey_input\" value={m.toggleHotKeyText} onkeydown={setToggleHotKey_Cells} />\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<input type=\"text\" class=\"ui_config ui_hotkey_input\" value={m.holdHotKeyText} onkeydown={setHoldHotKey_Cells} />\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t\t<div style='height:5px' />\n\t\t\t\t\t\t<div if={isJapanese}>\n\t\t\t\t\t\t\t<div>key1:キーを押したときにon/offを反転</div>\n\t\t\t\t\t\t\t<div>key2:キーを押している間on/offを反転</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div if={!isJapanese}>\n\t\t\t\t\t\t\t<div>key1:Option inverted when key press</div>\n\t\t\t\t\t\t\t<div>key2:Option inverted while key hold</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class='box_frame' style='border-color: {cssColors.clPanelForeground}'>\n\t\t\t\t\t<div class='box_header' style='background-color: {cssColors.clPanelForeground}; color:{cssColors.clPanelHeader}'>\n\t\t\t\t\t　<span style='font-family: IConFont1'>&#xe994</span><span>{utexts.hdrGameDisplay}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class='box_content'>\n\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td colspan='2'></td>\n\t\t\t\t\t\t\t\t<td if={false}>key1</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr each={m in configHub.gameDisplayEntries}>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"ui_config ui_checkbox\" checked={m.value} onchange={checkChanged}> \n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<div class='td_text'>{m.text}</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td if={false}>\n\t\t\t\t\t\t\t\t\t<input type=\"text\" class=\"ui_config ui_hotkey_input\" value={m.toggleHotKeyText} onkeydown={setToggleHotKey_Game} />\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class='content_column'>\n\n\t\t\t\t<div class='box_frame' style='border-color: {cssColors.clPanelForeground}'>\n\t\t\t\t\t<div class='box_header' style='background-color: {cssColors.clPanelForeground}; color:{cssColors.clPanelHeader}'>\n\t\t\t\t\t　<span style='font-family: IConFont1'>&#xe994</span><span>{utexts.hdrBasicOperation}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class='box_content'>\n\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t<tr each={m in configHub.basicBehaviorEntries}>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"ui_config ui_checkbox\" checked={m.value} onchange={checkChanged}> \n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<div class='entry_text'>{m.text}</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\n\t\t\t\t\t\t<table class='range_table'>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td>{utexts.lbtCameraZoomSpeed}</td>\n\t\t\t\t\t\t\t\t<td><input type='range' class='range_input' min='75' max='125' step='1' name='CameraZoomSpeed' value={uconfig.CameraZoomSpeed} oninput={rangeInputChanged}/></td>\n\t\t\t\t\t\t\t\t<td style='width:60px'>{uconfig.CameraZoomSpeed}%</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td>{utexts.lbtCameraMovementSpeed}</td>\n\t\t\t\t\t\t\t\t<td><input type='range' class='range_input' min='-25' max='75' step='1' name='CameraMovementSpeed' value={uconfig.CameraMovementSpeed} oninput={rangeInputChanged}/></td>\n\t\t\t\t\t\t\t\t<td style='width:60px'>{uconfig.CameraMovementSpeed}</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td>{utexts.lbtInterpolationType}</td>\n\t\t\t\t\t\t\t\t<td><input type='range' class='range_input' min='0.0' max='2.0' step='1.0' name='InterpolationType' value={uconfig.InterpolationType} oninput={rangeInputChanged}/></td>\n\t\t\t\t\t\t\t\t<td style='width:60px'>{usupport.InterpolationTypeText}</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td>{utexts.lbtInterpolationResponce}</td>\n\t\t\t\t\t\t\t\t<td><input type='range' class='range_input' min='-0.5' max='1.0' step='0.01' name='InterpolationSpeed' value={uconfig.InterpolationSpeed} oninput={rangeInputChanged}/></td>\n\t\t\t\t\t\t\t\t<td style='width:60px'>{usupport.InterpolationSpeedText}</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td>{utexts.lbtMarkerOpacity}</td>\n\t\t\t\t\t\t\t\t<td><input type='range' class='range_input' min='0.0' max='1.0' step='0.01' name='MarkerAlpha' value={uconfig.MarkerAlpha} oninput={rangeInputChanged}/></td>\n\t\t\t\t\t\t\t\t<td>{uconfig.MarkerAlpha * 100 >> 0}%</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<td>{utexts.lbtCursorLineThickness}</td>\n\t\t\t\t\t\t\t\t<td><input type='range' class='range_input' min='1.0' max='30.0' step='1.0' name='CursorLineThickness' value={uconfig.CursorLineThickness} oninput={rangeInputChanged}/></td>\n\t\t\t\t\t\t\t\t<td>{uconfig.CursorLineThickness}px</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr if={true}>\n\t\t\t\t\t\t\t<td>{utexts.lbtPlayerCellsAlpha}</td>\n\t\t\t\t\t\t\t\t<td><input type='range' class='range_input' min='0.25' max='1.0' step='0.05' name='PlayerCellsAlpha' value={uconfig.PlayerCellsAlpha} oninput={rangeInputChanged}/></td>\n\t\t\t\t\t\t\t\t<td>{uconfig.PlayerCellsAlpha}</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<td>{utexts.lbtPelletCellsAlpha}</td>\n\t\t\t\t\t\t\t\t<td><input type='range' class='range_input' min='0.25' max='1.0' step='0.05' name='PelletCellsAlpha' value={uconfig.PelletCellsAlpha} oninput={rangeInputChanged}/></td>\n\t\t\t\t\t\t\t\t<td>{uconfig.PelletCellsAlpha}</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<td>{utexts.lbtAnotherSectionCellsAlpha}</td>\n\t\t\t\t\t\t\t\t<td><input type='range' class='range_input' min='0.25' max='1.0' step='0.05' name='AnotherSectionCellsAlpha' value={uconfig.AnotherSectionCellsAlpha} oninput={rangeInputChanged}/></td>\n\t\t\t\t\t\t\t\t<td>{uconfig.AnotherSectionCellsAlpha}</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr if={true}>\n\t\t\t\t\t\t\t<td>{utexts.lbtRenderQuality}</td>\n\t\t\t\t\t\t\t\t<td><input type='range' class='range_input' min='0' max='2' step='1' name='RenderQuality' value={uconfig.RenderQuality} oninput={rangeInputChanged}/></td>\n\t\t\t\t\t\t\t\t<td>{usupport.RenderQualityText}</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td>{utexts.lbtCaptureDuration}</td>\n\t\t\t\t\t\t\t\t<td><input type='range' class='range_input' min='0' max='5' step='1' name='QuickCaptureTimeOption' value={uconfig.QuickCaptureTimeOption} oninput={rangeInputChanged}/></td>\n\t\t\t\t\t\t\t\t<td>{usupport.QuickCaptureTimeSec}{appConfig.isJapanese ? '秒' : 'sec'}</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td>{utexts.lbtFrameRate}</td>\n\t\t\t\t\t\t\t\t<td><input type='range' class='range_input' min='0' max='4' step='1' name='FrameRateOption' value={uconfig.FrameRateOption} oninput={rangeInputChanged}/></td>\n\t\t\t\t\t\t\t\t<td>{usupport.FrameRateText}%</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class='box_frame' style='border-color: {cssColors.clPanelForeground}'>\n\t\t\t\t\t<div class='box_header' style='background-color: {cssColors.clPanelForeground}; color:{cssColors.clPanelHeader}'>\n\t\t\t\t\t　<span style='font-family: IConFont1'>&#xe994</span><span>{utexts.hdrControl}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class='box_content'>\n\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t<tr each={m in configHub.controlEntries}>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<div class='td_text' style='width:220px'>\n\t\t\t\t\t\t\t\t\t\t{m.text}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<input type=\"text\" class=\"ui_config ui_hotkey_input\" value={m.hotKeyText} onkeydown={setControlHotKey} />\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<input type='button' class='reset_button' value='{utexts.lbtResetConfig}' onclick={onResetButtonCliecked} />\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</main-config-panel>\n")], t)
    }(s.Element);
    e.MainConfigPanelTag = d
}
, function(t, e, n) {
    "use strict";
    var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            e.hasOwnProperty(n) && (t[n] = e[n])
    }
    ,
    function(t, e) {
        function n() {
            this.constructor = t
        }
        i(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }
    ), r = this && this.__decorate || function(t, e, n, i) {
        var o, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            s = Reflect.decorate(t, e, n, i);
        else
            for (var a = t.length - 1; a >= 0; a--)
                (o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
        return r > 3 && s && Object.defineProperty(e, n, s),
        s
    }
    ;
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = ""
      , a = 32;
    for (var l = 0; l < a; l++) {
        s += '\n\t\t<div id="skin' + l + '" class="skinbox" onclick={ ChangeSkin }>\n\t\t\t<div class="skinimage" style="background-image: url(\'gr/checker2.png\')"></div>\n\t\t\t<div class="skinimage" style="background-image: url(\'{ userEntry.infos[' + l + '].skinUrl }\')"></div>\n\t\t\t<div class="skin_hover_mask"> { userEntry.infos[' + l + "].name } </div>\n\t\t</div>"
    }
    var c = n(5)
      , h = n(4)
      , l = n(2)
      , d = n(0)
      , u = function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.uconfig = d.gs.uconfig,
            t.cssColors = d.gs.ucolors.cssColors,
            t.siteTitle = l.AppConfigurator.instance.siteTitleString,
            t.appConfig = l.AppConfigurator.instance,
            t.userEntry = h.gameCore.userEntryMan,
            t.selectedTabName = "home",
            t
        }
        return o(t, e),
        t.prototype.selectTab = function(t) {
            this.selectedTabName = t
        }
        ,
        t.prototype.isActive = function(t) {
            return t == this.selectedTabName
        }
        ,
        t.prototype.mounted = function() {
            this.userEntry.indexChangedProc2 = this.update.bind(this);
            this.userEntry.skinChangedProc2 = this.update.bind(this);
            d.gs.uconfig.RegisterChangedProc("panelBackImageUri", this.update.bind(this));
            d.gs.uconfig.RegisterChangedProc("panelBackImageAlpha", this.update.bind(this));
            h.gameCore.gameHudModel.serverInstructionProc = this.setServerInstructionText.bind(this)
        }
        ,
        t.prototype.ChangeSkin = function(t) {
            h.gameCore.userEntryMan.ChangeIndex(parseInt(t.currentTarget.id.replace("skin", ""), 10))
        }
        ,
        t.prototype.setServerInstructionText = function(t) {
            this.refs.server_instruction_box.innerHTML = t
        }
        ,
        t = r([c.template('\n<main-panel>\n\t<style>\n\n\t\t.skinbox:hover .skin_hover_mask {padding-top: 0px;opacity: 1; transition:all 0.4s ease;}\n\t.skin_hover_mask{padding-top: 30px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-align:center;vertical-align:middle;border-radius: 50%;font-size: 6px;width: 50px;height: 50px;position: absolute;z-index:1000;background: rgba(0,0,0,0.5);opacity: 0;color: #fff;display: flex;align-items: center;text-align: center;}.skinbox.skin_hover_mask {opacity: 1;transition:all 0.6s ease;}\n\t.parea{\n\t\t\tborder: solid 1px rgba(255,255,255,1);\n\t\t\tmargin: 4px;\n\t\t\tborder-radius: 4px;\n\t\t}\n\n\t\t.main_panel_root{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t}\n\n\t\t.main_floating_panel{\n\t\t\twidth: 864px;\n\t\t\theight: 698px;\n\t\t\toverflow: hidden;\n\t\t\tposition: absolute;\n\t\t\ttop: 45px;\n\t\t\tleft: 0;\n\t\t\tright: 0;\n\t\t\tbottom: 0;\n\t\t\tmargin: auto;\n\t\t}\n\n\t\t.site_header_area{\n\t\t\theight: 180px;\n\t\t}\n\n\t\t.site_title_text{\n\t\t\tfont-size: 44px;\n\t\t\tfont-family: CustomFont2;\n\t\t}\n\t\t\n\t\t.left_side_panel{\n\t\t\tfloat: left;\n\t\t\theight: 500px;\n\t\t\twidth: 240px;\t\n\t\t}\n\t\t\n\t\t.right_side_panel{\n\t\t\tfloat: right;\n\t\t\twidth: 240px;\n\t\t\theight: 500px;\n\t\t}\n\n\t\t.panel_center_content{\n\t\t\twidth: 360px;\n\t\t\theight: 500px;\n\t\t\tpadding: 12px 20px;\n\t\t\tfloat: left;\n\t\t}\n\n\t\t.whole_area{\n\t\t\theight: 688px;\n\t\t}\n\n\t\t.site_header_area{\n\t\t\tpadding-left: 8px;\n\t\t}\n\n\t\t.server_instruction_box{\n\t\t\tuser-select: text;\n\t\t}\n\n\t\t.main_panel_back{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t}\n\n\t\t.panel_back_box {\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\t_-webkit-clip-path: url(#svgPath);\n\t\t\t_clip-path: url(#svgPath);\n\t\t}\n\t\t\n\t\t.panel_back_img_layer{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tbackground-size: cover;\n\t\t}\n\n\t\t.panel_front_box{\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t}\n\n\t\t.panel_front_box_inner{\n\t\t\tposition: relative;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t}\n\n\t\t.panel_front_box_content{\n\t\t}\n\n\t\t.panel_mask_svg{\n\t\t\theight: 0;\n\t\t}\n\n\t\t.ui_common{\n\t\t\theight: 38px;\n\t\t\tfont-size: 18px;\n\t\t\tfont-family: メイリオ, Arial;\n\t\t}\n\n\t\t.ui_text_box{\n\t\t\tpadding-left: 4px;\n\t\t}\n\n\t\t.panel_navi_box{\n\t\t\tposition: absolute;\n\t\t\ttop: 6px;\n\t\t\tright: 10px;\n\t\t\tuser-select: none;\n\t\t}\n\n\t\t.navi{\n\n\t\t}\n\t\t\n\t\t.navi > div{\n\t\t\tdisplay: inline-block;\n\t\t\twidth: 70px;\n\t\t\theight: 38px;\n\t\t\tbackground-color: #08F;\n\t\t\tborder-radius: 3px;\n\t\t\tposition: relative;\n\t\t\tcursor: pointer;\n\t\t\tfont-family: \'IconFont1\';\n\t\t\ttext-align: center;\n\t\t\tfont-size: 28px;\n\t\t\tline-height: 38px;\n\t\t}\n\t\t\n\t\t.navi > div.selected{\n\t\t\tbackground-color: #04F;\n\t\t}\n\t</style>\n\t<div class="main_panel_root" style="color: {cssColors.clPanelForeground}">\n\t\t<div class="main_panel_back" style="background-color: {cssColors.clOverlayBack};" />\n\n\t\t<div class="main_floating_panel">\n\t\t\t<div class="panel_back_box" \n\t\t\t\tstyle="background-color: {cssColors.clMainPanelBack}; clip-path: url({isActive(\'home\') ? \'#svgPath\' : \'#svgPath2\'})">\n\t\t\t\t<div class="panel_back_img_layer" \n\t\t\t\t\tstyle="background-image: url(\'{uconfig.panelBackImageUri}\'); opacity: {uconfig.panelBackImageAlpha}">\n\t\t\t\t</div>\n\n\t\t\t\t<svg version="1.1" x="0px" y="0px" viewBox="0 0 864 690" class="panel_mask_svg">\n\t\t\t\t\t<clipPath id="svgPath">\n\t\t\t\t\t\t<rect x="5" y="5" width="855" height="179" rx="4" ry="4"/>\n\t\t\t\t\t\t<rect x="5" y="193" width="239" height="499" rx="4" ry="4"/>\n\t\t\t\t\t\t<rect x="253" y="193" width="359" height="499" rx="4" ry="4"/>\n\t\t\t\t\t\t<rect x="621" y="193" width="239" height="499" rx="4" ry="4"/>\n\t\t\t\t\t</clipPath>\n\n\t\t\t\t\t<clipPath id="svgPath2">\n\t\t\t\t\t\t<rect x="5" y="5" width="855" height="687" rx="4" ry="4"/>\n\t\t\t\t\t</clipPath>\n\t\t\t\t</svg>\n\t\t\t</div>\n\n\n\t\t\t<div class="panel_front_box">\n\t\t\t\t<div class="panel_front_box_inner">\n\t\t\t\t\t<div class="panel_front_box_content">\n\t\t\t\t\t\t<div show={isActive(\'home\')}>\n\t\t\t\t\t\t\t<div class="site_header_area parea" style="border-color: {cssColors.clPanelForeground}">\n\t\t\t\t\t\t\t\t<div class="site_title_text">{siteTitle}</div>\n\t\t\t\t\t\t\t\t<div class=\'server_instruction_box\' ref="server_instruction_box" />\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="left_side_panel parea" style="border-color: {cssColors.clPanelForeground}">\n\t\t\t\t\t\t\t\t<left-config-panel />\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="panel_center_content parea" style="border-color: {cssColors.clPanelForeground}">\n\t\t\t\t\t\t\t\t<user-entry-panel />\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="right_side_panel parea" style="border-color: {cssColors.clPanelForeground}">\n\t\t\t\t\t\t\t\t<server-list-root if={appConfig.useIxTrackerServer} />\n\t\t\t\t\t\t\t\t<skin-list-root if={!appConfig.useIxTrackerServer}>\n\t<style>\n\t\t.right_skin_panel_root{\n\t\t\tpadding: 5px 3px;\n\t\t\theight: 100%;\n\t\t\tposition: relative;\n\t\t}\n\t\t.right_panel_ui_outer{\n\t\t\tdisplay: flex;\n\t\t\tflex-wrap: wrap;\n\t\t}\n\t\t.skinbox{\n\t\t\twidth:50px;\n\t\t\theight:50px;\n\t\t\tmargin:4px;\n\t\t\tcursor:pointer;\n\t\t}\n\t\t.skinimage{\n\t\t\tposition: absolute;\n\t\t\twidth: 50px;\n\t\t\theight: 50px;\n\t\t\tbackground-size: cover;\n\t\t\tbackground-position: center center;\n\t\t\tborder-radius: 50%;\n\t\t}\n\t</style>\n\n<div class="right_skin_panel_root">\n\t<div style="display: flex;flex-wrap: wrap;" class="right">' + s + '\n\t</div>\n</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="clear_both" />\n\t\t\t\t\t\t</div>\n\n\n\t\t\t\t\t\t<div show={isActive(\'settings\')}>\n\t\t\t\t\t\t\t<div class="whole_area parea" style="border-color: {cssColors.clPanelForeground}">\n\t\t\t\t\t\t\t\t<main-config-panel />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div show={isActive(\'theme\')}>\n\t\t\t\t\t\t\t<div class="whole_area parea" style="border-color: {cssColors.clPanelForeground}">\n\t\t\t\t\t\t\t\t<color-config-panel />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="panel_navi_box">\n\t\t\t\t\t\t<div class="navi" style="color: {cssColors.clUiSymbols}">\n\t\t\t\t\t\t\t<div onclick={selectTab.bind(this, \'home\')} style="background-color: {cssColors.clMenuButtons}">&#xe900</div>\n\t\t\t\t\t\t\t<div onclick={selectTab.bind(this, \'settings\')} style="background-color: {cssColors.clMenuButtons}">&#xe994</div>\n\t\t\t\t\t\t\t<div onclick={selectTab.bind(this, \'theme\')} style="background-color: {cssColors.clMenuButtons}">&#xe90d</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t</div>\n\t</div>\n</main-panel>')], t)
    }(c.Element);
    e.MainPanelTag = u
}
, function(t, e, n) {
    "use strict";
    var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            e.hasOwnProperty(n) && (t[n] = e[n])
    }
    ,
    function(t, e) {
        function n() {
            this.constructor = t
        }
        i(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }
    ), r = this && this.__decorate || function(t, e, n, i) {
        var o, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            s = Reflect.decorate(t, e, n, i);
        else
            for (var a = t.length - 1; a >= 0; a--)
                (o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
        return r > 3 && s && Object.defineProperty(e, n, s),
        s
    }
    ;
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = n(5)
      , a = n(4)
      , l = function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.model = a.gameCore.serverListModel,
            t
        }
        return o(t, e),
        t.prototype.mounted = function() {
            this.model.Notify = this.update.bind(this)
        }
        ,
        t.prototype.onServerEntryClicked = function(t) {
            this.model.ConnectToServer(t.item.info)
        }
        ,
        t = r([s.template("\n<server-list-root>\n\t<style>\n\t\tul, li{\n\t\t\tlist-style:none;\n\t\t}\n\t\t\n\t\t.base{\n\t\t\twidth: 210px;\n\t\t\theight: 470px;\n\t\t\toverflow-y: scroll;\n\t\t\toverflow-x: hidden;\n\t\t\tmargin: 10px auto;\n\t\t}\n\t\t\n\t\t.inner{\n\t\t\tposition: absolute;\n\t\t\twidth: 100%;\n\t\t\tpadding: 6px;\n\t\t\toverflow: hidden;\n\t\t}\n\t\t\n\t\t.card0{\n\t\t\tborder: solid 2px #F60;\n\t\t\tbackground-color: #F7A;\n\t\t\tborder-color: #F39;\n\t\t\twidth: 190px;\n\t\t\theight: 62px;\n\t\t\tmargin-bottom: 4px;\n\t\t\tposition: relative;\n\t\t\tcolor: #FFF;\n\t\t\tfont-family: arial;\n\t\t}\n\n\t\t.card_selected{\n\t\t\tbackground-color: #F06;\n\t\t\tborder-color: #D04;\n\t\t}\n\t\t\n\t\t.cover{\n\t\t\tposition: absolute;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.cover:hover{\n\t\t\tbackground-color: rgba(255, 0, 128, 0.2);\n\t\t}\n\t\t\n\t\t.serverName{\n\t\t\tfont-size: 26px;\n\t\t\tline-height: 26px;\n\t\t}\n\n\t\t.infoPart{\n\t\t\tfont-size: 18px;\n\t\t\toverflow: none;\n\t\t}\n\n\t\t.info_region{\n\t\t\tfloat: left;\n\t\t\twidth: 100px;\n\t\t}\n\t\t\n\t\t.info_users{\n\t\t\tfloat: right;\n\t\t}\n\t</style>\n\n\t<div class=\"base\">\n\t\t<ul>\n\t\t\t<li each = {info in model.serverInfos} >\n\t\t\t\t<div class= {card0: true, card_selected: info && info.address == model.currentServerUri } \n\t\t\t\t\tonclick= {onServerEntryClicked}>\n\t\t\t\t\t<div class='inner'>\n\t\t\t\t\t\t<div class='serverName'>\n\t\t\t\t\t\t\t{info.modName}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class='infoPart'>\n\t\t\t\t\t\t\t<div class='info_region'>\n\t\t\t\t\t\t\t\t{info.region}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class='info_users'>\n\t\t\t\t\t\t\t{info.numClients} / {info.numMaxClients}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class='clear_both'></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class='cover'></div>\n\t\t\t</li>\n\t\t</ul>\n\t<div />\n</server-list-root>\n")], t)
    }(s.Element);
    e.ServerListRootTag = l
}
, function(t, e, n) {
    "use strict";
    var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            e.hasOwnProperty(n) && (t[n] = e[n])
    }
    ,
    function(t, e) {
        function n() {
            this.constructor = t
        }
        i(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }
    ), r = this && this.__decorate || function(t, e, n, i) {
        var o, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            s = Reflect.decorate(t, e, n, i);
        else
            for (var a = t.length - 1; a >= 0; a--)
                (o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
        return r > 3 && s && Object.defineProperty(e, n, s),
        s
    }
    ;
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = n(5)
      , a = n(0)
      , l = n(4)
      , c = n(2)
      , h = function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.uconfig = a.gs.uconfig,
            t.userEntry = l.gameCore.userEntryMan,
            t.cssColors = a.gs.ucolors.cssColors,
            t.appConfig = c.AppConfigurator.instance,
            t
        }
        return o(t, e),
        Object.defineProperty(t.prototype, "isDualUi", {
            get: function() {
                return a.gs.gconfig.ShowDualSkinInputUi
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.mounted = function() {
            this.userEntry.indexChangedProc = this.update.bind(this)
        }
        ,
        t.prototype.inputText = function(t) {
            this.userEntry.SetProp(t.target.name, t.target.value)
        }
        ,
        t.prototype.startPlay = function() {
            l.gameCore.StartPlay()
        }
        ,
        t.prototype.startSpectate = function() {
            l.gameCore.StartSpectate()
        }
        ,
        t = r([s.template('\n<user-entry-panel>\n\t<style>\n\t\t.main_ui_area{\n\t\t\twidth: 300px;\n\t\t\tmargin: 0 auto;\n\t\t}\n\t\t.ui_main_button{\n\t\t\t_background-color: #F08;\n\t\t\t_color: #FFF;\n\t\t\tborder-radius: 4px;\n\t\t\tborder: none;\n\t\t\tmargin: 2px 0;\n\t\t\tposition: relative;\n\t\t\tcursor: pointer;\n\n\t\t\twidth: 147px;\n\t\t\tfloat: left;\n\t\t\tvertical-align: middle;\n\t\t}\n\n\t\t.ui_main_button > .button_symbol{\n\t\t\tfont-family: \'IconFont1\';\n\t\t\ttext-align: center;\n\t\t\tfont-size: 24px;\n\t\t\tline-height: 38px;\n\t\t\tdisplay: inline-block;\n\t\t}\n\n\t\t.ui_main_button > .button_text{\n\t\t\tfont-family: \'CustomFont1\';\n\t\t\tfont-size: 22px;\n\t\t\tdisplay: inline-block;\n\t\t\tline-height: 38px;\n\t\t\tvertical-align: top;\n\t\t}\n\n\t\t.ui_text_box{\n\t\t\tmargin: 2px 0;\n\t\t}\n\t\t\n\t\t.ui_full_width{\n\t\t\twidth: 300px;\n\t\t}\n\t\t\n\t\t.ui_team_input{\n\t\t\twidth: 90px;\n\t\t\tfloat: left;\n\t\t}\n\n\t\t.ui_name_input{\n\t\t\twidth: 206px;\n\t\t}\n\n\t\t.player_entry_info_area{\n\t\t}\n\n\t\t.main_buttons_area{\n\t\t\tpadding: 4px 0;\n\t\t}\n\n\t\t.center_ad_area{\n\t\t\twidth: 300px;\n\t\t\theight: 250px;\n\t\t\tmargin: 0 auto;\n\t\t\tbackground-color: white;\n\t\t\tmargin-top: 15px;\n\t\t}\n\n\t</style>\n\t<div class="panel_tab_content">\n\t\t<div>\n\t\t\t<div style=\'height: 25px\' />\n\n\t\t\t<div class="main_ui_area">\n\t\t\t\t<div class="player_entry_info_area">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input type="text" class="ui_common ui_text_box ui_team_input"\n\t\t\t\t\t\t\tref="ui_text_team" name="team" placeholder="team" value="{userEntry.curInfo.team}" oninput={inputText}>\t\n\t\t\t\t\t\t<div style="width:4px; height: 1px; float: left" />\n\t\t\t\t\t\t<input type="text" class="ui_common ui_text_box ui_name_input" ref="ui_text_name"\n\t\t\t\t\t\t\tname="name" placeholder="name" value={userEntry.curInfo.name} oninput={inputText}>\t\n\t\t\t\t\t\t<div class="clear_both"></div>\n\t\t\n\t\t\t\t\t\t<input type="text" class="ui_common ui_text_box ui_full_width" ref="ui_text_skin_url"\n\t\t\t\t\t\t\tname="skinUrl" placeholder="skin url" value={userEntry.curInfo.skinUrl} onchange={inputText}>\t\n\t\t\t\t\t\t<input type="text" class="ui_common ui_text_box ui_full_width" ref="ui_text_skin_url2"\n\t\t\t\t\t\t\tname="skinUrl2" placeholder="skin url 2" value={userEntry.curInfo.skinUrl2} onchange={inputText}\n\t\t\t\t\t\t\tshow={isDualUi}>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class="clear_both"></div>\n\n\t\t\t\t<div class="main_buttons_area">\n\t\t\t\t\t<button class="ui_common ui_main_button ui_half_width" id="ui_button_play" onclick={startPlay}\n\t\t\t\t\t\tstyle="background-color: {cssColors.clMainButtons}; color:{cssColors.clUiSymbols}" >\n\t\t\t\t\t\t<div class="button_symbol">&#xe9a5;</div>\n\t\t\t\t\t\t<div class="button_text">PLAY</div>\n\t\t\t\t\t</button>\n\t\t\t\t\t<div style="width:6px; height: 1px; float: left" />\n\t\t\t\t\t<button class="ui_common ui_main_button ui_half_width" id="ui_button_spec" onclick={startSpectate}\n\t\t\t\t\t\tstyle="background-color: {cssColors.clMainButtons}; color:{cssColors.clUiSymbols}"">\n\t\t\t\t\t\t<div class="button_symbol">&#xe985;</div>\n\t\t\t\t\t\t<div class="button_text">SPEC</div>\n\t\t\t\t\t</button>\n\t\t\t\t\t<div class="clear_both"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class="center_ad_area" ref="center_ad_area" id="center_ad_area">\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</user-entry-panel>\n')], t)
    }(s.Element);
    e.UserEntryPanelTag = h
}
, function(t, e, n) {
    "use strict";
    var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            e.hasOwnProperty(n) && (t[n] = e[n])
    }
    ,
    function(t, e) {
        function n() {
            this.constructor = t
        }
        i(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }
    ), r = this && this.__decorate || function(t, e, n, i) {
        var o, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            s = Reflect.decorate(t, e, n, i);
        else
            for (var a = t.length - 1; a >= 0; a--)
                (o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
        return r > 3 && s && Object.defineProperty(e, n, s),
        s
    }
    ;
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = n(5)
      , a = n(0)
      , l = n(4)
      , c = n(2)
      , h = function(n) {
        function t() {
            var t = null !== n && n.apply(this, arguments) || this;
            const e = JSON.parse(localStorage.getItem("hideInfo"));
            e instanceof Array ? (tcfg.HidePartyCode = e[0],
            tcfg.HideUserSig = e[1]) : localStorage.setItem("hideInfo", JSON.stringify([0, 0]));
            return t.gconfig = a.gs.gconfig,
            t.userEntry = l.gameCore.userEntryMan,
            t.uconfig = a.gs.uconfig,
            t.cssColors = a.gs.ucolors.cssColors,
            t.appConfig = c.AppConfigurator.instance,
            t
        }
        return o(t, n),
        Object.defineProperty(t.prototype, "isDualUi", {
            get: function() {
                return a.gs.gconfig.ShowDualSkinInputUi
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.tcfg = tcfg,
        t.prototype.mounted = function() {
            this.userEntry.skinChangedProc = this.update.bind(this)
        }
        ,
        t.prototype.inputText = function(t) {
            this.userEntry.SetProp(t.target.name, t.target.value)
        }
        ,
        t.prototype.hideCode = function() {
            var t = document.getElementsByClassName("code_cover")[0];
            const e = t.style.display == "";
            t.style.display = e ? "none" : "";
            tcfg.HidePartyCode = !e;
            localStorage.setItem("hideInfo", JSON.stringify([tcfg.HidePartyCode, tcfg.HideUserSig]))
        }
        ,
        t.prototype.hideUsig = function() {
            var t = document.getElementsByClassName("usig_cover")[0];
            const e = t.style.display == "";
            t.style.display = e ? "none" : "";
            tcfg.HideUserSig = !e;
            localStorage.setItem("hideInfo", JSON.stringify([tcfg.HidePartyCode, tcfg.HideUserSig]))
        }
        ,
        t.prototype.onArrowButton = function(t) {
            var e = "arrow_left" == t.target.id ? -1 : 1;
            l.gameCore.userEntryMan.ShiftIndex(e)
        }
        ,
        t.prototype.onBenchButton = function() {
            l.gameCore.ToggleBenchMarkMode()
        }
        ,
        t = r([s.template('\n<left-config-panel>\n\t<style>\n\t\t.left_config_panel_root{\n\t\t\tpadding: 5px 10px;\n\t\t\theight: 100%;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.left_input_ui_outer{\n\t\t\twidth: 168px;\n\t\t\tmargin: 0 auto;\n\t\t}\n\t\t\n\t\t.bottom_box{\n\t\t\tposition: absolute;\n\t\t\tleft: 15px;\n\t\t\tbottom: 5px;\n\t\t}\n\n\t\t.side_ad_area{\n\t\t\twidth: 200px;\n\t\t\theight: 200px;\n\t\t\tbackground-color: white;\n\t\t\tmargin: 10px 0;\n\t\t}\n\n\t\t.skin_preview_box{\n\t\t\tposition: relative;\n\t\t\twidth: 100px;\n\t\t\theight: 100px;\n\t\t\tmargin: 10px auto;\n\t\t}\n\t\n\t\t.skin_cell{\n\t\t\tposition: absolute;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tbackground-size: cover;\n\t\t\tbackground-position: center center;\n\t\t\tborder-radius: 50%;\n\t\t}\n\n\t\t.code_text_box_outer{\n\t\t\twidth: 100px;\n\t\t\tmargin: 0 auto;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.code_cover{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tbackground-color: #666;\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tline-height: 36px;\n\t\t\tpadding-left: 6px;\n\t\t}\n\n\t\t#ui_text_code{\n\t\t\twidth: 100%;\n\t\t}\n\n\t\t.usig_text_box_outer{\n\t\t\twidth: 100px;\n\t\t\tmargin: 0 auto;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.usig_cover{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tbackground-color: #666;\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tline-height: 36px;\n\t\t\tpadding-left: 6px;\n\t\t}\n\n\t\t#ui_text_usig{\n\t\t\twidth: 100%;\n\t\t}\n\n\t\t.arrows{\n\t\t\tfont-family: \'IconFont1\';\n\t\t\t_margin: 0 15px;\n\t\t\tmargin-top: 30px;\n\t\t\tfont-size: 28px;\n\t\t\tcursor: pointer;\n\t\t\tuser-select: none;\n\t\t}\n\n\t\t.arrow_left{\n\t\t\tfloat: left;\n\t\t}\n\n\t\t.arrow_right{\n\t\t\tfloat: right;\n\t\t}\n\n\t\t.bench_button{\n\t\t\tfont-family: IconFont1;\n\t\t\twidth: 44px;\n\t\t\theight: 36px;\n\t\t\tline-height: 36px;\n\t\t\tfont-size: 28px;\n\t\t\tborder-radius: 4px;\n\t\t\ttext-align: center;\n\t\t\tcursor: pointer;\n\t\t\tdisplay: inline-block;\n\t\t}\n\n\t\t.version_str{\n\t\t\tfont-family: CustomFont1;\n\t\t\tfont-size: 22px;\n\t\t\tdisplay: inline-block;\n\t\t\tvertical-align: middle;\n\t\t\tmargin-left: 30px;\n\t\t\tmargin-bottom: 12px;\n\t\t}\n\n\t\ta{\n\t\t\tcolor: white;\n\t\t}\n\t\ta:visited{\n\t\t\tcolor: white;\n\t\t}\n\n\t\t.lbar_notes{\n\t\t\tfont-size: 12px;\n\t\t\tmargin-bottom: 20px;\n\t\t}\n\t</style>\n\t<div class="left_config_panel_root">\n\n\t\t<div style="height:20px" show={!isDualUi} />\n\n\t\t<div class="left_input_ui_outer">\n\n\t\t\t<div class="arrows arrow_left" id="arrow_left" onmousedown={onArrowButton}>\n\t\t\t\t◀\n\t\t\t</div>\n\n\t\t\t<div class="arrows arrow_right" id="arrow_right" onmousedown={onArrowButton}>\n\t\t\t\t▶\n\t\t\t</div>\n\n\t\t\t<div class="skin_preview_box">\n\t\t\t\t<div class="skin_cell" style="background-image: url(\'gr/checker2.png\')" />\n\t\t\t\t<div class="skin_cell" style="background-image: url({userEntry.curInfo.skinUrl})" />\n\t\t\t</div>\n\n\t\t\t<div class="clear_both" />\n\n\t\t\t<div class="skin_preview_box" show={isDualUi}>\n\t\t\t\t<div class="skin_cell" style="background-image: url(\'gr/checker2.png\')" />\n\t\t\t\t<div class="skin_cell" style="background-image: url({userEntry.curInfo.skinUrl})" />\n\t\t\t</div>\n\n\t\t\t<div class="code_text_box_outer" show={gconfig.ShowPartyCodeInputUi}>\n\t\t\t\t<input type="text"  class="ui_common ui_text_box"  \n\t\t\t\t\tid="ui_text_code" name="code" placeholder="Code" value="{userEntry.curInfo.code}" oninput={inputText}>\n\t\t\t\t<div class="code_cover" show={tcfg.HidePartyCode}>\n\t\t\t\t\t&#x1F512;\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<button class="ui_common ui_main_button ui_half_width" id="ui_button_hide_code" onclick={hideCode} style="padding: 0 10px; position: relative; left: 140px; bottom: 38px;">👁</button>\n\n\t\t\t<div class="usig_text_box_outer" show={gconfig.ShowPartyCodeInputUi}>\n\t\t\t\t<input type="text"  class="ui_common ui_text_box"  \n\t\t\t\t\tid="ui_text_usig" name="usig" placeholder="User sig" value="{userEntry.curInfo.usig}" oninput={inputText}>\n\t\t\t\t<div class="usig_cover" show={tcfg.HideUserSig}>\n\t\t\t\t\t&#x1F512;\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<button class="ui_common ui_main_button ui_half_width" id="ui_button_hide_usig" onclick={hideUsig} style="padding: 0 10px; position: relative; left: 140px; bottom: 38px;">👁</button>\n\n\t\t\t<div show={appConfig.targetSite == \'ix\'}>\n\t\t\t\t<div style="height: 20px" />\n\t\t\t\t<a href="http://ixagar.net/classic">old version</a>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class="bottom_box">\n\n\t\t\t<div class=\'lbar_notes\'>\n\t\t\t\t<div if={appConfig.isJapanese}>\n\t\t\t\t\tnote: スキンがエラーで表示されない場合、imgurを使ってください。また、スキンの縦横のピクセル数を1000x1000以下にしてください。gyazoの画像は非対応になりました。\n\t\t\t\t</div>\n\t\t\t\t<div if={!appConfig.isJapanese}>\n\t\t\t\t\tnote: please use imgur if your skin is not shown by error. Also it noted that the pixel size of skins should be less than 1000x1000.\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class="bench_button" style="background-color: {cssColors.clMainButtons}; color: {cssColors.clUiSymbols}"\n\t\t\t\tonclick={onBenchButton}>\n\t\t\t\t&#xe90f;\n\t\t\t</div>\n\n\t\t\t<div class="version_str">\n\t\t\t\tLWGA-1.1\n\t\t\t</div>\n\t\t</div>\n\n\t</div>\n</left-config-panel>\n')], t)
    }(s.Element);
    e.LeftConfigPanelTag = h
}
, function(t, e, n) {
    "use strict";
    var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            e.hasOwnProperty(n) && (t[n] = e[n])
    }
    ,
    function(t, e) {
        function n() {
            this.constructor = t
        }
        i(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }
    ), r = this && this.__decorate || function(t, e, n, i) {
        var o, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            s = Reflect.decorate(t, e, n, i);
        else
            for (var a = t.length - 1; a >= 0; a--)
                (o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
        return r > 3 && s && Object.defineProperty(e, n, s),
        s
    }
    ;
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = n(5)
      , a = n(0)
      , d = n(4)
      , l = (function(t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        o(e, t),
        e.prototype.mounted = function() {
            this.root.innerHTML = this.opts.content
        }
        ,
        e = r([s.template("<raw><div></div></raw>")], e)
    }(s.Element),
    function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.model = d.gameCore.gameHudModel,
            t.perfModel = d.gameCore.perfModel,
            t.gconfig = a.gs.gconfig,
            t.uconfig = a.gs.uconfig,
            t.gstates = a.gs.gstates,
            t.cssColors = a.gs.ucolors.cssColors,
            t.chatInputBoxVisible = !1,
            t.hasNewPrivateMessage = !1,
            t.prevChatMessagesCount = -1,
            t
        }
        return o(t, e),
        t.prototype.mounted = function() {
            var o = this
              , t = this.refs.lb_chart_outer
              , e = this.refs.lb_chart_canvas;
            e.width = 160,
            e.height = 160,
            t.style.width = "160px",
            t.style.height = "160px";
            var n = this.refs.map_outer
              , i = this.refs.map_canvas;
            var r = 300;
            i.width = r,
            i.height = r,
            n.style.width = r + "px",
            n.style.height = r + "px",
            window.addEventListener("keydown", function(t) {
                if (!t.repeat) {
                    if (13 == t.keyCode) {
                        var e = o.refs.chat_input_text_box;
                        if (o.chatInputBoxVisible) {
                            var n = e.value;
                            e.value = "",
                            o.chatInputBoxVisible = !1,
                            n ? d.gameCore.SendChatMessage(n) : o.update()
                        } else {
                            var i = document.activeElement;
                            if (i && "INPUT" == i.tagName)
                                return void i.blur();
                            o.chatInputBoxVisible = !0,
                            o.update(),
                            e.focus()
                        }
                    }
                }
            }),
            setInterval(this.UpdationProc.bind(this), 17);
            var s = this.refs.overlay_base
              , r = this.refs.chat_view
              , a = this.refs.chat_input_box
              , l = !1;
            function c(t) {
                r.style.userSelect = t ? "text" : "none"
            }
            r.onmouseenter = function() {
                l = !0
            }
            ,
            r.onmouseleave = function() {
                l = !1
            }
            ;
            var h = !1;
            a.onmouseenter = function() {
                h = !0
            }
            ,
            a.onmouseleave = function() {
                h = !1
            }
            ,
            s.onmousedown = function() {
                l && c(!0)
            }
            ,
            s.onmouseup = function() {
                l || h || (window.getSelection().removeAllRanges(),
                c(!1))
            }
        }
        ,
        t.prototype.UpdationProc = function() {
            this.model.isHudUpdated && (this.model.isHudUpdated = !1,
            this.update(),
            this.model.chatMessages.length != this.prevChatMessagesCount && (this.prevChatMessagesCount = this.model.chatMessages.length,
            this.scrollChatViewToEnd()))
        }
        ,
        t.prototype.scrollChatViewToEnd = function() {
            var t = this.refs.chat_view;
            t.scrollTop = t.scrollHeight
        }
        ,
        t = r([s.template('\n<game-overlay>\n\t<style>\n\n\t\t.overlay_base{\n\t\t\t_user-select: none;\n\t\t}\n\n\t\t.game_control_overlay{\n\t\t\t_user-select: none;\n\t\t}\n\n\t\t.chat_view{\n\t\t\twidth: 300px;\n\t\t\theight: 250px;\n\t\t\tbackground-color: rgba(255, 255, 255, 0.3);\n\t\t\tborder-radius: 4px;\n\t\t\tposition: absolute;\n\t\t\ttop: 70px;\n\t\t\tleft: 10px;\n\t\t\toverflow-y: scroll;\n\t\t\toverflow-x: none;\n\t\t\tfont-size: 14px;\n\t\t\tresize: both;\n\t\t\tpadding: 3px;\n\t\t\tword-wrap: break-word;\n\t\t\tuser-select: none;\n\t\t}\n\n\t\t.chat_view::-webkit-scrollbar{\n\t\t\twidth: 8px;\n\t\t\t/*background: rgba(224,224,224, 0.5);*/\n\t\t}\n\n\t\t.chat_view::-webkit-scrollbar-thumb{\n\t\t\tbackground-color: rgba(128,128,128,0.5);\n\t\t}\n\n\t\t.chat_view::-webkit-scrollbar-corner {\n\t\t\tbackground-color: none;\n\t\t}\n\n\t\t.chat_view::-webkit-resizer {\n\t\t\tbackground-color: rgba(64,64,64,0.5);\n\t\t}\n\n\t\t.message_time_stamp{\n\t\t\tcolor: #AAA;\n\t\t\tfont-size: 13px;\n\t\t}\n\n\t\t.message_sender_name{\n\t\t\tcolor: #FF0;\n\t\t}\n\n\t\t.bottom_area{\n\t\t\twidth: 100%;\n\t\t\tposition: absolute;\n\t\t\tbottom: 0;\n\t\t}\n\t\t.chat_input_area{\n\t\t\twidth: 360px;\n\t\t\theight: 40px;\n\t\t\tbackground-color: rgba(200, 200, 200, 0.5);\n\t\t\tborder-radius: 4px;\n\t\t\tmargin: 0 auto 50px;\n\t\t}\n\n\t\t#chat_input_text_box{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tbackground-color: none;\n\t\t\tborder: none;\n\t\t\tfont-size: 16px;\n\t\t\tpadding-left: 6px;\n\t\t}\n\n\t\t#chat_input_text_box:focus{\n\t\t\toutline: 0;\n\t\t}\n\n\t\t.server_client_status_area{\n\t\t\tposition: absolute;\n\t\t\tleft: 10px;\n\t\t\tbottom: 6px;\n\t\t\tfont-size: 14px;\n\t\t}\n\t\t\n\t\t#server_user_num_text{\n\t\t\tposition: absolute;\n\t\t\ttop: 6px;\n\t\t\tleft: 60px;\n\t\t\tfont-size: 15px;\n\t\t}\n\n\t\t.self_state_info{\n\t\t\tposition: absolute;\n\t\t\ttop: 40px;\n\t\t\tleft: 10px;\n\t\t\tfont-size: 22px;\n\t\t\tfont-family: CustomFont1;\n\t\t}\n\n\t\t.self_state_info > div{\n\t\t\tdisplay: inline-block;\n\t\t\tmargin-right: 10px;\n\t\t}\n\n\t\t#self_score_text{\n\n\t\t}\n\n\t\t#server_display_message{\n\t\t\tposition: absolute;\n\t\t\ttop: 50px;\n\t\t\twidth: 100%;\n\t\t\tfont-size: 15px;\n\t\t\ttext-align: center;\n\t\t\tcolor: #FF0;\n\t\t\tfont-size: 32px;\n\t\t}\n\n\t\t.benchmark_mode_message_outer{\n\t\t\tposition: absolute;\n\t\t\ttop: 70px;\n\t\t\twidth: 100%;\n\t\t}\n\n\t\t.benchmark_mode_message{\n\t\t\tmargin: 0 auto;\n\t\t\twidth: 600px;\n\t\t\tfont-size: 15px;\n\t\t\ttext-align: center;\n\t\t\tfont-size: 32px;\n\t\t\tcolor: #0F0;\n\t\t\tfont-family: CustomFont1;\n\t\t\tbackground-color: rgba(0, 0, 0, 0.7);\n\t\t\tpadding: 5px;\n\t\t}\n\t\t\n\t\t.leaderboard_outer{\n\t\t\tposition: absolute;\n\t\t\ttop: 10px;\n\t\t\tright: 10px;\n\t\t}\n\n\t\t.leaderboard_inner{\n\t\t\twidth: 300px;\n\t\t\tpadding: 8px;\n\t\t\tborder-radius: 4px;\n\t\t}\n\n\t\t.lb_header{\n\t\t\tfont-family: \'CustomFont1\';\n\t\t\tfont-size: 22px;\n\t\t\ttext-align: center;\n\t\t}\n\n\t\t.lb_header_large{\n\t\t\tfont-size: 26px;\n\t\t}\n\n\t\t.lb_detail{\n\t\t}\n\n\t\t.lb_entry{\n\t\t\tfont-family: CustomFont1, Meiryo, Arial;\n\t\t\tfont-size: 15px;\n\t\t\theight: 20px;\n\t\t\toverflow: hidden;\n\t\t\ttext-align: center;\n\t\t}\n\n\t\t#lb_chart_outer{\n\t\t\tmargin: 5px auto 0;\n\t\t}\n\n\t\t#lb_chart_canvas{\n\t\t\topacity: 0.8;\n\t\t}\n\n\t\t#map_outer{\n\t\t\tposition: absolute;\n\t\t\tright: 10px;\n\t\t\tbottom: 10px;\n\t\t}\n\n\t\t#teamInfo{\n\t\t\tposition: absolute;\n\t\t\tright: 320px;\n\t\t\tbottom: 10px;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\t}\n\n\t\t#map_canvas{\n\t\t\t_background-color: rgba(0, 0, 0, 0.3);\n\t\t}\n\n\t\thr{\n\t\t\theight: 8px;\n\t\t\tborder: none;\n\t\t}\n\n\t\t.spec_target_info{\n\t\t\tposition: absolute;\n\t\t\ttop: 60px;\n\t\t\twidth: 100%;\n\t\t\tfont-size: 22px;\n\t\t\ttext-align: center;\n\t\t\tfont-family: CustomFont1, Meiryo;\n\t\t}\n\n\t\t#notify_log::-webkit-scrollbar{\n\t\t\twidth: 8px;\n\t\t}\n\n\t\t#notify_log::-webkit-scrollbar-thumb{\n\t\t\tbackground-color: rgba(128,128,128,0.5);\n\t\t}\n\n\t\t#notify_logw::-webkit-scrollbar-corner {\n\t\t\tbackground-color: none;\n\t\t}\n\t</style>\n\t<div class=\'overlay_base\' ref=\'overlay_base\'>\n\t\t<div id="server_user_num_text" ref="server_user_num_text">\n\t\t\t{model.serverUserNumText}\n\t\t</div>\n\n\t\t<div class="self_state_info">\n\t\t\t<div>Score: {(model.selfScore * 0.001).toFixed(1)}k</div>\n\t\t\t<div>Max: {(model.maxScore * 0.001).toFixed(1)}k</div>\n\t\t\t<div>{model.splitNum}/16</div>\n\t\t</div>\n\n\t\t<div id="self_score_text" ref="self_score_text">\n\n\t\t</div>\n\n\t\t<div id="server_display_message" ref="server_display_message">\n\t\t\t{model.serverDisplayMessageText}\n\t\t</div>\n\n\t\t<div class="spec_target_info" show={model.specTargetName != null}>\n\t\t\t{model.specTargetScore ? model.specTargetName + " -- " + (model.specTargetScore/1000).toFixed(1) + "k" : model.specTargetName}\n\t\t</div>\n\n\t\t<div class="benchmark_mode_message_outer" show={gstates.isBenchmarkMode}>\n\t\t\t<div class="benchmark_mode_message" >\n\t\t\t\tbenchmark mode (score: {perfModel.numCellsRendered})\n\t\t\t</div>\n\t\t</div>\n\n\n\t\t<div class="server_client_status_area">\n\t\t\t<div>\n\t\t\t\t<div each={val, key in perfModel.debugObj}>\n\t\t\t\t\t{key} : {val}\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<hr />\n\n\t\t\t<div show={uconfig.ShowClientStatus}>\n\t\t\t\t<div>\n\t\t\t\t\tғᴘꜱ : {perfModel.avgFps.toFixed(1)}\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\tɴᴏᴅᴇꜱ : {perfModel.numCellsRendered}\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\tʀᴇɴᴅᴇʀ : {perfModel.avgDuration.toFixed(2)}ᴍs\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\tʟᴏᴀᴅ : {(perfModel.avgRate * 100).toFixed(2)}%\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\tʙᴜғғᴇʀ : {(perfModel.replayBufferBytes / 1000000).toFixed(2)}ᴍʙ\n\t\t\t\t</div>\n\n\t\t\t\t<hr />\n\t\t\t</div>\n\n\t\t\t<div id="server_status_text" ref="server_status_text" show={uconfig.ShowServerStatus}>\n\t\t\t\t<div each={text in model.serverStatusText}>\n\t\t\t\t\t{text}\n\t\t\t\t</div>\n\n\t\t\t\t<hr />\n\t\t\t</div>\n\n\t\t\t<div id="latency_text" ref="latency_text">\n\t\t\t\tʟᴀᴛᴇɴᴄʏ: {model.latencyMs}ᴍs\n\t\t\t</div>\n\n\t\t\t<div id="copylight" ref="copylight_text">\n\t\t\t\t　\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class="leaderboard_outer" show={uconfig.ShowLeaderboard}>\n\t\t\t<div class="leaderboard_inner" style="background: {cssColors.clLeaderboardBack};">\n\t\t\t\t<div class="lb_header lb_header_large" style="color: {cssColors.clLeaderboardHeader};">{model.leaderboardHeaderText}</div>\n\t\t\t\t<div class="lb_detail">\n\t\t\t\t\t<div each={model.leaderboardEntries} class="lb_entry" style="color: {color};" show={active}>\n\t\t\t\t\t\t{index + 1}.{text} -- {score}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div style="height: 8px"></div>\n\n\t\t\t<div class="leaderboard_inner" style="background-color: {cssColors.clLeaderboardBack};"\n\t\t\t\tshow={gconfig.ShowTeamRanking}>\n\t\t\t\t<div class="lb_header" style="color: {cssColors.clLeaderboardHeader};">Team Ranking</div>\n\t\t\t\t<div class="lb_detail">\n\t\t\t\t\t<div each={model.teamRankingEntries} class="lb_entry" style="color: {color};" show={active}>\n\t\t\t\t\t\t{index + 1}.{text} -- {score}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div id="lb_chart_outer" ref="lb_chart_outer">\n\t\t\t\t\t<canvas id="lb_chart_canvas" ref="lb_chart_canvas"></canvas>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div id="map_outer" ref="map_outer" style="background-color: {cssColors.clMapBackground}" show={uconfig.ShowMap}>\n\t\t\t<canvas id="map_canvas" ref="map_canvas"></canvas>\n\t\t</div>\n\n\t\t<div id="game_control_overlay" class=\'game_control_overlay\' ref=\'game_control_overlay\'/>\n\n\t\t<div class="chat_view" id="chat_view" ref="chat_view"\n\t\t\tstyle="background-color: {cssColors.clChatBackground}" show={uconfig.ShowChatBox}>\n\t\t\t<div each={model.chatMessages}>\n\t\t\t\t<span class="message_time_stamp" style="color: {cssColors.clChatTimeString}">\n\t\t\t\t\t{timeStamp} \n\t\t\t\t</span>\n\t\t\t\t<span style="color: {cssColors.clChatSenderName}">\n\t\t\t\t\t{senderName}:\n\t\t\t\t</span>\n\t\t\t\t<span style="color: {cssColors.clChatMessage}">\n\t\t\t\t\t{message}\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class="bottom_area">\n\t\t\t<div class="chat_input_area" show={chatInputBoxVisible} ref="chat_input_box">\n\t\t\t\t<input type="text" id="chat_input_text_box" ref="chat_input_text_box"/>\n\t\t\t</div>\n\t\t</div>\n\n\t</div>\n</game-overlay>\n')], t)
    }(s.Element));
    e.GameOverlayTag = l
}
, function(t, e, n) {
    "use strict";
    var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            e.hasOwnProperty(n) && (t[n] = e[n])
    }
    ,
    function(t, e) {
        function n() {
            this.constructor = t
        }
        i(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }
    ), r = this && this.__decorate || function(t, e, n, i) {
        var o, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            s = Reflect.decorate(t, e, n, i);
        else
            for (var a = t.length - 1; a >= 0; a--)
                (o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
        return r > 3 && s && Object.defineProperty(e, n, s),
        s
    }
    ;
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = n(5)
      , a = n(0)
      , l = n(4)
      , c = n(1)
      , h = function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.model = l.gameCore.ReplayControllerModel,
            t.cssColors = a.gs.ucolors.cssColors,
            t.replayUiMessage = "",
            t.elementIdToReplayOperationDict = {
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
            },
            t
        }
        return o(t, e),
        t.prototype.mounted = function() {
            var e = this;
            this.model.SetStateChangedProc(function(t) {
                e.update()
            }),
            this.update(),
            this.model.captureNotificationProc = function() {
                e.replayUiMessage = "captured!",
                setTimeout(function() {
                    e.replayUiMessage = "",
                    e.update()
                }, 500)
            }
        }
        ,
        t.prototype.onTrackKnobMouseDown = function(t) {
            var i = this;
            if (!a.gs.gstates.isBenchmarkMode) {
                var o = this.refs.gauge_rail.getBoundingClientRect().left
                  , e = function(t) {
                    var e = t.pageX - o
                      , n = c.Nums.VMap(e, 5, 295, 0, 1, !0);
                    return i.model.SeekReplayPosTo(n, !0),
                    i.update(),
                    !1
                }
                  , n = function(t) {
                    window.removeEventListener("mousemove", e),
                    window.removeEventListener("mouseup", n)
                };
                window.addEventListener("mousemove", e),
                window.addEventListener("mouseup", n),
                e(t),
                t.stopPropagation()
            }
        }
        ,
        t.prototype.onButtonClick = function(t) {
            if (!a.gs.gstates.isBenchmarkMode) {
                var e = t.currentTarget.id
                  , n = this.elementIdToReplayOperationDict[e];
                n && this.model.HandleReplayOperation(n),
                t.stopPropagation()
            }
        }
        ,
        t = r([s.template('\n<replay-control-bar>\n\t<style>\n\t\t.replay_bar_area{\n\t\t\twidth: 660px;\n\t\t\theight: 45px;\n\t\t\tmargin: 0 auto;\n\t\t\tborder-radius:4px;\n\t\t\tmargin-top: 6px;\n\t\t\tposition: relative;\n\t\t\tpadding: 4px;\n\t\t\tpadding-left: 10px;\n\t\t\tuser-select: none;\n\t\t}\n\n\t\t.ui_row > div{\n\t\t\tfloat: left;\n\t\t\tmargin: 0 2px;\n\t\t}\n\n\t\t.ui_row2 > *{\n\t\t\tfloat: left;\n\t\t\tmargin: 0 2px;\n\t\t}\n\n\t\t.replay_main_button_group{\n\t\t\tmargin-top: 2px !important;\n\t\t}\n\t\t\n\t\t.control_button_back{\n\t\t\tborder-radius: 5px;\n\t\t}\n\n\t\t.control_button{\n\t\t\twidth: 34px;\n\t\t\theight: 34px;\n\t\t\tborder: solid 1px #FFF;\n\t\t\tborder-radius: 3px;\n\t\t\tline-height: 34px;\n\t\t\tfont-family: \'IconFont1\';\n\t\t\tfont-size: 15px;\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.middle_button{\n\t\t\twidth: 32px;\n\t\t\theight: 28px;\n\t\t\tline-height: 28px;\n\t\t\tfont-size: 12px;\n\t\t\tborder-radius: 2px;\n\t\t}\n\n\t\t.reel_info_area{\n\t\t\tline-height: 28px;\n\t\t\tfont-size: 14px;\n\t\t\tmargin: 0 0px !important;\n\t\t\twidth: 50px;\n\t\t}\n\n\t\t.small_button{\n\t\t\twidth: 22px;\n\t\t\theight: 18px;\n\t\t\tline-height: 18px;\n\t\t\tfont-size: 11px;\n\t\t\tborder-radius: 1px;\n\t\t}\n\n\t\t.control_button:hover{\n\t\t\tbackground-color: rgba(255,255,255,0.2);\n\t\t}\n\n\t\t.is_on{\n\t\t\tbackground-color: #00F;\n\t\t} \n\n\t\t.gauge_area{\n\t\t\twidth: 300px;\n\t\t\theight: 38px;\n\t\t\tposition: relative;\n\t\t\tmargin: 0 8px !important;\n\t\t}\n\n\t\t.gauge_box{\n\t\t\tposition: absolute;\n\t\t\tbottom: 0;\n\t\t}\n\n\t\t.gauge{\n\t\t\twidth: 300px;\n\t\t\theight: 16px;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.gauge_rail{\n\t\t\twidth: 300px;\n\t\t\theight: 10px;\n\t\t\tborder: solid 1px #FFF;\n\t\t\tposition: absolute;\n\t\t\ttop: 3px;\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.gauge_knob{\n\t\t\twidth: 10px;\n\t\t\theight: 16px;\n\t\t\tborder: solid 1px #FFF;\n\t\t\tposition: absolute;\n\t\t\tleft: 0px;\n\t\t\tbackground-color: #08F;\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.time_position_text{\n\t\t\tposition: absolute;\n\t\t\tright: 0;\n\t\t\ttop: 0;\n\t\t\tfont-size: 14px;\n\t\t}\n\n\t\t.replay_speed_text{\n\t\t\twidth: 35px;\n\t\t\tfont-size: 14px;\n\t\t}\n\n\t\t.part_reel_control{\n\t\t\tmargin-top: 5px !important;\n\t\t}\n\n\t\t.second_bar_area{\n\t\t\twidth: 660px;\n\t\t\tmargin: 0 auto;\n\t\t\tposition: relative;\n\t\t\tuser-select: none;\n\t\t}\n\n\t\t.replay_ui_message{\n\t\t\tfont-family: CustomFont1;\n\t\t\tfont-size: 24px;\n\t\t\ttext-align: left;\n\t\t}\n\t</style>\n\t<div>\n\t\t<div class="replay_bar_area ui_row" style="background-color: {cssColors.clReplayBar}; color: {cssColors.clUiSymbols}">\n\t\t\t<div class="replay_main_button_group ui_row">\n\t\t\t\t<div class="control_button" id="bt_flash" onmousedown={onButtonClick}\n\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}; border-color: {cssColors.clUiSymbols}"">&#xe9b5</div>\n\n\t\t\t\t<div class="control_button_back"\n\t\t\t\t\tstyle="background-color: {model.isRecording ? cssColors.clUiButtonActive : \'\'}">\n\t\t\t\t\t<div class="control_button" id="bt_record" onmousedown={onButtonClick} style="border-color: {cssColors.clUiSymbols}">\n\t\t\t\t\t\t\t&#xe914\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div style="width: 2px; height: 1px" />\n\n\t\t\t\t<div class="control_button" id="bt_stop" onmousedown={onButtonClick} \n\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xea1e</div>\n\n\t\t\t\t<div class="control_button_back"\n\t\t\t\t\tstyle="background-color: {model.isPlayback ? cssColors.clUiButtonActive : \'\'}">\n\t\t\t\t\t<div class="control_button" id="bt_play" onmousedown={onButtonClick} style="border-color: {cssColors.clUiSymbols}">\n\t\t\t\t\t\t&#xe902\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t</div>\n\n\t\t\t<div class="gauge_area">\n\n\t\t\t\t<div class="ui_row2" style="margin-left:-2px">\n\t\t\t\t\t<div class="control_button small_button" id="bt_tick_prev" onmousedown={onButtonClick} \n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xf177</div>\n\t\t\t\t\t<div class="control_button small_button" id="bt_tick_next" onmousedown={onButtonClick} \n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xf178</div>\n\n\t\t\t\t\t<div style="width:4px; height: 1px" />\n\n\t\t\t\t\t<div class="control_button small_button" id="bt_speed_down" onmousedown={onButtonClick} \n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xf068</div>\n\t\t\t\t\t<div class="control_button small_button" id="bt_speed_up" onmousedown={onButtonClick} \n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xf067</div>\n\t\t\t\t\t<div class="replay_speed_text">\n\t\t\t\t\t\tx{model.replaySpeedRate.toFixed(2)}\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div style="width:4px; height: 1px" />\n\n\t\t\t\t\t<div class="{control_button_back: true, is_on: model.isAutoShiftToNextReel}">\n\t\t\t\t\t\t<div class="control_button small_button" id="bt_cont" onmousedown={onButtonClick} style="border-color: {cssColors.clUiSymbols}">\n\t\t\t\t\t\t\t&#xe90a\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class="time_position_text">\n\t\t\t\t\t{model.trackPosText}\n\t\t\t\t</div>\n\n\t\t\t\t<div class="gauge_box">\n\t\t\t\t\t<div class="gauge" onmousedown={onTrackKnobMouseDown}>\n\t\t\t\t\t\t<div class="gauge_rail" id="gauge_rail" ref="gauge_rail" style="border-color: {cssColors.clUiSymbols}"/>\n\t\t\t\t\t\t<div class="gauge_knob" id="gauge_knob" \n\t\t\t\t\t\t\tstyle="left: {~~(model.trackPos * 290) + \'px\'}; background-color: {cssColors.clReplayBar}; border-color: {cssColors.clUiSymbols}"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class="part_reel_control">\n\t\t\t\t<div class="ui_row">\n\t\t\t\t\t<div class="control_button middle_button" id="bt_reel_prev" onmousedown={onButtonClick}\n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xe912</div>\n\n\t\t\t\t\t<div class="control_button middle_button" id="bt_reel_next" onmousedown={onButtonClick}\n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xe913</div>\n\n\t\t\t\t\t<div class="reel_info_area">\n\t\t\t\t\t\t<div>{model.numReels > 0 ? model.curReelIndex + 1 : 0}/{model.numReels}</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="control_button middle_button" id="bt_reel_delete" onmousedown={onButtonClick}\n\t\t\t\t\t\tstyle="border-color: {cssColors.clUiSymbols}">&#xe9ad</div>\n\t\t\t\t</div>\n\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class="second_bar_area">\n\t\t\t<div class="replay_ui_message">\n\t\t\t\t{replayUiMessage}\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</replay-control-bar>\n')], t)
    }(s.Element);
    e.ReplayControlBarTag = h
}
, function(t, e, n) {
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
                for (var i = 0, o = n; i < o.length; i++) {
                    (0,
                    o[i])(e)
                }
        }
        ,
        t.prototype.on = function(t, e) {
            this.listeners.get(t) || this.listeners.set(t, []),
            this.listeners.get(t).push(e)
        }
        ,
        t
    }();
    e.EventBus = i
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var i = function() {
        function t(t) {
            this.values = [0],
            this.maxCount = t
        }
        return t.prototype.Push = function(t) {
            this.values.length > this.maxCount && this.values.shift(),
            this.values.push(t)
        }
        ,
        t.prototype.GetAverageValue = function() {
            var t = 0;
            return t = this.values.reduce(function(t, e) {
                return t + e
            }, 0),
            t /= this.values.length
        }
        ,
        t
    }();
    e.PerformanceCheckQueue = i
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var D = n(1)
      , O = n(3)
      , H = n(0)
      , B = n(4)
      , P = B.gameCore.nodeMan
      , y = n(11)
      , m = n(12)
      , G = n(1)
      , o = n(25)
      , v = n(10)
      , S = n(6);
    !function(t) {
        var p = function() {
            function t(t) {
                this.holdTick = 0,
                this.gameView = t,
                this.box = new S.Container,
                this.gr = new S.Graphics,
                this.box.addChild(this.gr),
                this.box.zIndex = 1e3,
                this.elCursorOuter = document.querySelector("#psudo_cursor"),
                this.elCursorImageOn = document.querySelector("#psudo_cursor_img_on"),
                this.elCursorOuter.style.webkitUserSelect = "none"
            }
            return t.prototype.SetPsudoCursor = function(t, e, n, i) {
                var o = this.elCursorOuter;
                o.style.display = t ? "block" : "none",
                o.style.left = n + "px",
                o.style.top = i + "px",
                e && (this.holdTick = 7),
                this.holdTick > 0 && this.holdTick--,
                this.elCursorImageOn.style.display = this.holdTick > 0 ? "block" : "none"
            }
            ,
            t.prototype.Update = function() {
                this.gr.clear(),
                H.gs.gstates.isBenchmarkMode || (this.UpdateCursor(),
                this.UpdateEatingLimitMarker(),
                this.UpdateCellDirectionMarker(),
                this.UpdateTeamCircle())
            }
            ,
            t.prototype.DrawCrossPoint = function(t, e, n) {
                var i = this.gr;
                i.moveTo(t - n, e),
                i.lineTo(t + n, e),
                i.moveTo(t, e - n),
                i.lineTo(t, e + n)
            }
            ,
            t.prototype.UpdateTeamCircle = function() {
                var t = Date.now()
                  , e = B.gameCore.sight
                  , n = this.gr;
                if (t - e.teamCircleTimeStamp < 500) {
                    var i = e.teamCircleX
                      , o = e.teamCircleY
                      , r = e.teamCircleRadius;
                    n.lineStyle(10, 16777215, 1),
                    n.drawCircle(i, o, r)
                }
            }
            ,
            t.prototype.UpdateCellDirectionMarker = function() {
                var p = this.gr;
                H.gs.uconfig.ShowCellDirectionMarker && this.gameView.cells.forEach(function(t) {
                    if (t.isPlayerCell) {
                        var e = t.node;
                        if (0 != e.velocity.x || 0 != e.velocity.y) {
                            var n = Math.atan2(e.velocity.y, e.velocity.x)
                              , i = e.nx
                              , o = e.ny
                              , r = t.baseSize / 2 * t.scale * .8
                              , s = t.baseSize / 2 * t.scale * 1.05
                              , a = i + Math.cos(n) * r
                              , l = o + Math.sin(n) * r
                              , c = i + Math.cos(n) * s
                              , h = o + Math.sin(n) * s
                              , d = t.labelColor;
                            p.lineStyle(10, d, 1);
                            var u = .05 * e.nr;
                            u = D.Nums.LoLimit(u, 15),
                            p.lineWidth = u,
                            p.moveTo(a, l),
                            p.lineTo(c, h)
                        }
                    }
                })
            }
            ,
            t.prototype.UpdateEatingLimitMarker = function() {
                var o = this;
                H.gs.uconfig.ShowEatLimitMarker && B.gameCore.nodeMan.nodeAnalyzer.eatingLimitList.forEach(function(t) {
                    var e = o.gameView.cells.get(t.eaterId)
                      , n = o.gameView.cells.get(t.eatenId)
                      , i = t.canEat ? 65535 : 11184810;
                    o.gr.lineStyle(10, i, 1),
                    o.DrawCrossPoint(e.x, e.y, 100),
                    o.DrawCrossPoint(n.x, n.y, 100),
                    o.gr.drawCircle(e.x, e.y, t.limitRadius)
                })
            }
            ,
            t.prototype.UpdateCursor = function() {
                var n = this
                  , t = B.gameCore.sight;
                if ((H.gs.gstates.isPlaying ? H.gs.uconfig.ShowCursorLine : H.gs.uconfig.ShowSpecAimCursor) && t.aimPlayerId > 0) {
                    var i = t.aimCursorX
                      , o = t.aimCursorY
                      , r = this.gr
                      , e = H.gs.ucolors.GetColor("clCursorLine");
                    r.alpha = O.ColorHelper.GetAlpha(e);
                    var s = H.gs.uconfig.CursorLineThickness;
                    s *= .2 / t.eyeScale,
                    r.lineStyle(s, e);
                    var a = t.aimPlayerId
                      , l = 0;
                    B.gameCore.nodeMan.nodes.forEach(function(t) {
                        if (t.ownerPlayerId == a && 0 == t.cellType) {
                            var e = n.gameView.cells.get(t.nodeId);
                            r.moveTo(e.x, e.y),
                            r.lineTo(i, o),
                            l++
                        }
                    });
                    var c = t.WorldToScreen(i, o)
                      , h = c[0]
                      , d = c[1];
                    this.SetPsudoCursor(!H.gs.gstates.isRealtimeModePlaying && l > 0, t.splitting, h, d),
                    t.splitting = !1
                } else
                    this.SetPsudoCursor(!1, !1, 0, 0)
            }
            ,
            t
        }()
          , f = function() {
            function t() {
                this.cardSize = 250;
                this.sharpness = 10;
                this.glowDist = 500
            }
            return t.prototype.Initialize = function() {
                this.canvas = document.createElement("canvas"),
                this.canvas.width = this.canvas.height = this.cardSize + this.glowDist * 2,
                this.texture = S.Texture.from(this.canvas),
                this.UpdateDrawing_Canvas(),
                H.gs.uconfig.RegisterChangedProc("SimpleVirus", this.UpdateDrawing_Canvas.bind(this)),
                H.gs.uconfig.RegisterChangedProc("GlowingNonPlayerCells", this.UpdateDrawing_Canvas.bind(this)),
                H.gs.ucolors.RegisterChangedProc("clVirusInnerFill", this.UpdateDrawing_Canvas.bind(this)),
                H.gs.ucolors.RegisterChangedProc("clVirusOuterStroke", this.UpdateDrawing_Canvas.bind(this))
            }
            ,
            t.prototype.UpdateDrawing_Canvas = function() {
                const e = H.gs.uconfig.GlowingNonPlayerCells;
                var n = this.cardSize
                  , i = n / 2
                  , o = i + this.glowDist
                  , r = this.canvas.getContext("2d")
                  , s = H.gs.ucolors.GetColor("clVirusInnerFill")
                  , a = H.gs.ucolors.GetAlpha("clVirusInnerFill")
                  , l = H.gs.ucolors.GetColor("clVirusOuterStroke")
                  , c = H.gs.ucolors.GetAlpha("clVirusOuterStroke");
                r.clearRect(0, 0, o * 2, o * 2);
                r.shadowColor = O.ColorHelper.ColorToHtmlString(l);
                if (H.gs.uconfig.SimpleVirus) {
                    r.beginPath();
                    var t = 4 * (.01 * this.cardSize);
                    r.arc(o, o, i, 0, 2 * Math.PI, !1);
                    r.arc(o, o, this.cardSize / 2 - t / 2, 0, 2 * Math.PI, !1);
                    r.lineWidth = t;
                    r.strokeStyle = O.ColorHelper.ColorToHtmlString(l);
                    r.globalAlpha = c;
                    r.shadowBlur = e ? this.glowDist : 0;
                    r.stroke();
                    r.stroke();
                    r.shadowBlur /= 2;
                    r.stroke();
                    r.stroke();
                    r.globalAlpha /= 2;
                    r.stroke();
                    r.stroke();
                    r.shadowBlur /= 1.5;
                    r.stroke();
                    r.stroke();
                    r.fillStyle = O.ColorHelper.ColorToHtmlString(s);
                    r.globalAlpha = a;
                    r.fill();
                    r.shadowBlur = e ? i * .1 : 0;
                    r.globalAlpha = c;
                    r.stroke();
                    r.globalAlpha /= 2;
                    r.stroke();
                    r.globalAlpha = 1
                } else {
                    r.beginPath();
                    const h = 24;
                    const d = 360 / h / 180 * Math.PI;
                    const t = d / 2;
                    const u = i + this.sharpness;
                    const p = i - this.sharpness;
                    for (var n = 0; n <= h; n++) {
                        r.lineTo(Math.cos(n * d) * u + o, -Math.sin(n * d) * u + o);
                        r.lineTo(Math.cos(n * d + t) * p + o, -Math.sin(n * d + t) * p + o)
                    }
                    r.lineWidth = 3.25 * (.01 * this.cardSize);
                    r.strokeStyle = O.ColorHelper.ColorToHtmlString(l);
                    r.lineJoin = "round";
                    r.globalAlpha = c;
                    r.shadowBlur = e ? this.glowDist : 0;
                    r.stroke();
                    r.stroke();
                    r.shadowBlur /= 2;
                    r.stroke();
                    r.stroke();
                    r.globalAlpha /= 2;
                    r.stroke();
                    r.stroke();
                    r.shadowBlur /= 1.5;
                    r.stroke();
                    r.stroke();
                    r.fillStyle = O.ColorHelper.ColorToHtmlString(s);
                    r.globalAlpha = a;
                    r.fill();
                    r.shadowBlur = e ? i * .1 : 0;
                    r.globalAlpha = c;
                    r.stroke();
                    r.globalAlpha /= 2;
                    r.stroke();
                    r.globalAlpha = 1
                }
                this.texture.update()
            }
            ,
            t.instance = new t,
            t
        }()
          , e = function() {
            function t() {}
            return t.prototype.GetSequenceString = function() {
                var t = this;
                return "" + t.skinUrl + t.nameText + t.skinAlpha + t.renderQuality + t.baseColor + t.teamColor + t.showEnemyOverlay + t.insertRenderName
            }
            ,
            t
        }()
          , N = function() {
            function e() {}
            return e.GetConfigCardSizeFromRenderQuality = function(t) {
                return e.CardSizeSource[t]
            }
            ,
            Object.defineProperty(e, "CurrentConfigCardSize", {
                get: function() {
                    return e.GetConfigCardSizeFromRenderQuality(H.gs.uconfig.RenderQuality)
                },
                enumerable: !0,
                configurable: !0
            }),
            e.CardSizeSource = [200, 400, 800],
            e
        }()
          , i = function() {
            function I(t) {
                this.drawingProps = new e,
                this.playerId = t,
                this.drawingProps.renderQuality = H.gs.uconfig.RenderQuality
            }
            return I.ResizeInterCanvasIfNeed = function(t) {
                var e = I.interCanvas;
                e.height < t && (e.width = t,
                e.height = t)
            }
            ,
            I.prototype.ResizeCanvasIfNeed = function(t) {
                if (this.canvas || (this.canvas = document.createElement("canvas"),
                this.canvasCapacitySize = 10,
                this.canvas.width = 10,
                this.canvas.height = 10),
                this.canvasCapacitySize != t) {
                    this.canvasCapacitySize = t,
                    this.canvas.height < t && (this.canvas = document.createElement("canvas"),
                    this.canvas.width = t,
                    this.canvas.height = t,
                    this.baseTexture = S.BaseTexture.from(this.canvas));
                    var e = new S.Rectangle(0,0,t,t);
                    this.texture = new S.Texture(this.baseTexture,e)
                }
            }
            ,
            I.prototype.StringToCharArrayU = function(t) {
                return t.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || []
            }
            ,
            I.prototype.DrawTextCircular = function(t, e, n, i, o, r, s, a) {
                t.save(),
                t.translate(n, i);
                for (var l = s, c = this.StringToCharArrayU(e), h = 0; h < c.length; h++) {
                    var d = c[h];
                    t.save(),
                    t.rotate(l);
                    var u = t.measureText(d).width
                      , p = -u / 2
                      , f = o * a;
                    t.strokeText(d, p, f),
                    t.fillText(d, p, f),
                    t.restore();
                    var g = .4 * u + .2 * r
                      , m = Math.sqrt(o * o - g * g);
                    l -= 2 * Math.atan2(g, m)
                }
                t.restore()
            }
            ,
            I.prototype.RenderCellCanvas = function() {
                if (this.playerId == P.activeSelfPlayerId) {
                    this.self = !0
                }
                var e = this.drawingProps
                  , n = N.GetConfigCardSizeFromRenderQuality(e.renderQuality);
                this.cardSize = n;
                const t = n / 2;
                var i = n / 2
                  , o = H.gs.uconfig.GlowingCells ? t : 0
                  , r = i + o
                  , s = 2 * r
                  , a = (i + t) * 2;
                this.ResizeCanvasIfNeed(s);
                var l = this.canvas.getContext("2d");
                if (l.save(),
                l.clearRect(0, 0, a, a),
                l.beginPath(),
                l.arc(r, r, i, 0, 2 * Math.PI, !1),
                l.closePath(),
                this.skinVisible = this.skinImage && e.skinAlpha > 0,
                this.skinVisible) {
                    l.shadowBlur = o;
                    l.shadowColor = l.fillStyle = O.ColorHelper.ColorToHtmlString(e.baseColor);
                    l.fill();
                    l.clip();
                    var c = this.skinImage
                      , h = c.width
                      , d = c.height
                      , u = 0
                      , p = 0
                      , f = 0
                      , g = n;
                    let t = this.self ? H.gs.uconfig.ShowSelfSkin : true;
                    if (t) {
                        if (h > d ? (u = (h - (f = d)) / 2,
                        p = 0) : (u = 0,
                        p = (d - (f = h)) / 2),
                        l.globalAlpha = e.skinAlpha,
                        g / f < .5) {
                            I.ResizeInterCanvasIfNeed(s);
                            var m = I.interCanvas
                              , y = m.getContext("2d")
                              , v = n * 2;
                            y.clearRect(0, 0, a, a),
                            y.drawImage(c, u, p, f, f, o, o, g, g),
                            l.drawImage(m, o, o, g, g, o, o, g, g)
                        } else
                            l.drawImage(c, u, p, f, f, o, o, g, g)
                    }
                    l.globalAlpha = 1;
                    l.shadowBlur = 0
                }
                var S = O.ColorHelper.ColorToHtmlString(e.teamColor);
                if (e.showEnemyOverlay) {
                    var b = 2 * Math.PI
                      , C = 6 * (k = .01 * n)
                      , x = 7 * k
                      , _ = n / 2;
                    l.strokeStyle = S,
                    l.lineWidth = C,
                    l.globalAlpha = .3,
                    l.fillStyle = "#000",
                    l.save(),
                    l.arc(r, r, i, 0, 2 * Math.PI, !1),
                    l.clip(),
                    l.fillRect(o, o, n + o, n + o),
                    l.restore(),
                    l.globalAlpha = .8,
                    l.beginPath(),
                    l.arc(r, r, _ - x, 0, b, !1),
                    l.stroke();
                    var s = .707 * _ - x;
                    l.beginPath(),
                    l.moveTo(o + _ + s, o + _ - s),
                    l.lineTo(o + _ - s, o + _ + s),
                    l.stroke(),
                    l.globalAlpha = 1
                }
                if (e.insertRenderName) {
                    var k, w = 10 * (k = .01 * n) >> 0;
                    l.font = "bold " + w + "px Meiryo, Arial",
                    l.strokeStyle = "#000",
                    l.fillStyle = S,
                    l.lineWidth = 1.3 * k >> 0,
                    this.DrawTextCircular(l, e.nameText, n, n, .8 * i, w, 1.5, 1)
                }
                l.restore(),
                this.texture.update()
            }
            ,
            I.prototype.Update = function() {
                var e = this
                  , t = this.drawingProps
                  , n = t.GetSequenceString()
                  , i = t.skinUrl
                  , o = B.gameCore.uMan
                  , r = 65535 & this.playerId
                  , s = 1 & this.playerId
                  , a = o.GetUserInfoById(r)
                  , l = o.GetTeamInfoById(a.teamId)
                  , c = r == o.selfUserId
                  , h = H.gs.gstates.isPlaying || H.gs.gstates.isDeadSpectation
                  , d = a.skinUrls[s]
                  , u = l == o.selfTeamInfo
                  , p = O.GameHelper.CheckIsInEatableSection(l.section, o.selfTeamInfo.section)
                  , f = !a.isBot && "" == d;
                f && (d = H.gs.gconfig.NoskinFallbackUrl);
                var g = 1
                  , m = !0;
                h && !u && (H.gs.uconfig.ShowEnemySkin ? g = .6 : m = !1),
                f && c && (m = !1),
                "dead" == a.name && (m = !1),
                H.gs.gconfig.ShowAlwaysAllPlayersSkin && (m = !0,
                g = 1),
                this.skinImage && 0 == v.SkinImageManager.instance.getSkinAvailability(this.skinImage.src) && (m = !1),
                H.gs.uconfig.ShowSkin || (m = !1),
                m || (g = 0),
                t.baseColor = a.colors[s],
                t.skinUrl = d,
                t.nameText = a.fullName,
                t.teamColor = l.color,
                t.renderQuality = H.gs.uconfig.RenderQuality,
                t.insertRenderName = H.gs.uconfig.ShowCircularName && H.gs.uconfig.ShowName && !(!H.gs.uconfig.ShowSelfName && c),
                t.skinAlpha = g,
                t.showEnemyOverlay = H.gs.uconfig.ShowEnemySkin && h && !a.isBot && !u && p && g > 0,
                H.gs.gconfig.ShowAlwaysAllPlayersSkin && (t.showEnemyOverlay = !1);
                if (this.glow != H.gs.uconfig.GlowingCells) {
                    this.glow = H.gs.uconfig.GlowingCells;
                    this.reqRenderCellCanvasOnNextFrame = !0
                }
                if ((this.self || c) && this.sv != H.gs.uconfig.ShowSelfSkin) {
                    this.sv == H.gs.uconfig.ShowSelfSkin;
                    this.reqRenderCellCanvasOnNextFrame = !0
                }
                t.GetSequenceString() != n && (t.skinUrl != i ? (this.skinImage = null,
                this.reqRenderCellCanvasOnNextFrame = !0,
                t.skinUrl && y.ImageWrapper.LoadImageThen(t.skinUrl, function(t) {
                    t && v.SkinImageManager.instance.addSkinUrl(t.src),
                    e.skinImage = t,
                    e.reqRenderCellCanvasLazy = !0
                })) : this.reqRenderCellCanvasLazy = !0)
            }
            ,
            I.prototype.Purge = function() {
                this.skinImage && this.skinImage.src && v.SkinImageManager.instance.removeSkinUrl(this.skinImage.src)
            }
            ,
            I.interCanvas = document.createElement("canvas"),
            I
        }()
          , g = function() {
            function t() {
                this.cellCards = new Map
            }
            return t.prototype.GetCellCard = function(t, e) {
                void 0 === e && (e = !1);
                var n = this.cellCards.get(t);
                return !n && e && (n = new i(t),
                this.cellCards.set(t, n)),
                G.Utils.Confirm(n),
                n
            }
            ,
            t.prototype.OnUserLeaved = function(t) {
                var e = this.cellCards.get(t);
                e && e.Purge(),
                this.cellCards.delete(t),
                this.cellCards.delete(t + 1)
            }
            ,
            t.prototype.UpdateCardDrawingQueue = function() {
                var e = !1;
                this.cellCards.forEach(function(t) {
                    t.reqRenderCellCanvasOnNextFrame && (t.RenderCellCanvas(),
                    t.reqRenderCellCanvasOnNextFrame = !1,
                    e = !0)
                }),
                this.cellCards.forEach(function(t) {
                    !e && t.reqRenderCellCanvasLazy && (t.RenderCellCanvas(),
                    t.reqRenderCellCanvasLazy = !1,
                    e = !0)
                })
            }
            ,
            t.instance = new t,
            t
        }()
          , r = function() {
            function t() {
                this.box = new S.Container,
                this.baseShape = new S.Sprite,
                this.baseShape.anchor.set(.5),
                this.baseSprite = new S.Sprite,
                this.baseSprite.anchor.set(.5),
                this.overShape = new S.Graphics,
                this.nameLabel = new S.Text,
                this.massLabel = new S.BitmapText("",{
                    fontName: "GAMEPLAY_MASS"
                }),
                this.box.addChild(this.baseShape),
                this.box.addChild(this.baseSprite),
                this.box.addChild(this.overShape)
            }
            return t.Gain = function() {
                return t.pool.Gain()
            }
            ,
            t.prototype.Release = function() {
                this.box.removeChild(this.nameLabel);
                this.box.removeChild(this.massLabel);
                t.pool.Release(this)
            }
            ,
            Object.defineProperty(t.prototype, "isPlayerCell", {
                get: function() {
                    return 0 == this.node.cellType
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "isVirus", {
                get: function() {
                    return 2 == this.node.cellType
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "isPellet", {
                get: function() {
                    return 1 == this.node.cellType
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "isFood", {
                get: function() {
                    return 3 == this.node.cellType
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "isFunnel", {
                get: function() {
                    return 4 == this.node.cellType
                },
                enumerable: !0,
                configurable: !0
            }),
            t.prototype.SetupLabel = function(t) {
                if (!t.style) {
                    return
                }
                t.style.fontFamily = "Meiryo, Arial",
                t.style.fontWeight = "bold",
                t.style.stroke = "#000000",
                t.style.fontSize = .13 * this.baseSize >> 0,
                t.style.strokeThickness = .015 * this.baseSize >> 0
            }
            ,
            t.prototype.Initialize = function(t) {
                this.node = t;
                t.entity = this;
                this.glow = this.cellCard = this.baseSize = null,
                this.isPlayerCell ? this.cellCard = g.instance.GetCellCard(t.ownerPlayerId) : this.isVirus && (this.cellCard = f.instance),
                this.UpdateBaseShape();
                if (this.cellCard) {
                    this.box.addChild(this.nameLabel);
                    this.box.addChild(this.massLabel)
                }
                this.SetupLabel(this.nameLabel),
                this.SetupLabel(this.massLabel),
                this.baseColor = -1,
                this.labelColor = -1,
                this.edgeColor = -1,
                this.edgeColor2 = -1,
                this.ringColor = -1,
                this.frameTick = 0,
                this.x = 0,
                this.y = 0,
                this.scale = 1,
                this.x0 = 0,
                this.y0 = 0,
                this.scale0 = 1,
                this.x1 = 0,
                this.y1 = 0,
                this.scale1 = 0,
                this.angle = 0,
                this.speed = 0,
                this.speedApplyTime = 0,
                this.time = 0,
                this.mass = 0,
                this.isInEatableSection = !1
            }
            ,
            t.prototype.UpdateProps = function(t) {
                this.node = t,
                t.entity = this,
                !(0 == this.mass) && this.isPellet || this.UpdatePosRadius()
            }
            ,
            t.prototype.UpdateLabels = function(e, t, n) {
                var i = null != e
                  , o = t >= 0;
                if ((i || o) && this.labelColor != n) {
                    this.labelColor = n;
                    var r = O.ColorHelper.ColorToHtmlString(n);
                    this.nameLabel.style.fill = r,
                    this.massLabel.tint = n
                }
                i && ((a = this.nameLabel).text != e && (a.text = e,
                a.x = -a.width / 2,
                a.y = -a.height / 2));
                if (o) {
                    var s = t.toString();
                    if (this.massLabel.text != s) {
                        var a = this.massLabel, l, c = 2;
                        if (this.isVirus) {
                            c = 1.9;
                            if (H.gs.uconfig.VirusSplitHint) {
                                s = 5 - (s - 100) / 16;
                                l = 4
                            } else {
                                l = 2.5
                            }
                        } else {
                            l = 1
                        }
                        a.scale.x = l,
                        a.scale.y = l;
                        let t;
                        if (s < 1e3) {
                            t = s
                        } else if (H.gs.uconfig.SimplifiedMass) {
                            t = (s / 100 >> 0) / 10 + "K"
                        } else {
                            t = s
                        }
                        a.text = t,
                        a.x = -a.width / 2,
                        a.y = -a.height / c,
                        i && e && (a.y += .2 * this.baseSize)
                    }
                }
                this.nameLabel.visible = i;
                this.massLabel.visible = o;
                let h = H.gs.uconfig.AutoHideText ? B.gameCore.sight.eyeScale * this.node.r > 30 : true;
                this.nameLabel.visible = i && h;
                this.massLabel.visible = o && h
            }
            ,
            t.prototype.UpdateBaseShape = function() {
                const t = N.CurrentConfigCardSize;
                if (this.isPellet || this.isFood) {
                    const e = H.gs.uconfig.GlowingNonPlayerCells;
                    if (this.baseSize != t || this.glow != e) {
                        this.baseSize = t;
                        this.glow = e;
                        this.massLabel.fontSize = .13 * this.baseSize >> 0;
                        this.baseShape.blendMode = e ? PIXI.BLEND_MODES.SCREEN : PIXI.BLEND_MODES.NORMAL;
                        const n = e ? "GP_GLOWING_PELLET" : "GP_BASE_LOW";
                        this.baseShape.texture = PIXI.utils.TextureCache[n]
                    }
                    if (this.node.ownerPlayerId == 0) {
                        if (H.gs.uconfig.ShowFood) {
                            this.box.visible = true
                        } else {
                            this.box.visible = false
                        }
                    } else {
                        if (H.gs.uconfig.ShowPelletSkin)
                            this.cellCard = g.instance.GetCellCard(this.node.ownerPlayerId);
                        this.box.visible = true
                    }
                    return
                }
                this.box.visible = true;
                const e = H.gs.uconfig.GlowingCells;
                if (this.baseSize != t || this.glow != e) {
                    this.baseSize = t;
                    this.glow = e;
                    this.massLabel.fontSize = .13 * this.baseSize >> 0;
                    this.baseShape.blendMode = PIXI.BLEND_MODES.NORMAL;
                    if (this.baseSize == 200) {
                        const n = e ? "GP_GLOWING_LOW" : "GP_BASE_LOW";
                        this.baseShape.texture = PIXI.utils.TextureCache[n]
                    } else if (this.baseSize == 400) {
                        const n = e ? "GP_GLOWING_MEDIUM" : "GP_BASE_MEDIUM";
                        this.baseShape.texture = PIXI.utils.TextureCache[n]
                    } else {
                        const n = e ? "GP_GLOWING_HIGH" : "GP_BASE_HIGH";
                        this.baseShape.texture = PIXI.utils.TextureCache[n]
                    }
                }
            }
            ,
            t.prototype.UpdateDrawing = function(t, e, n, i, o) {
                var r = this.baseSize / 2
                  , s = this.baseSize / 200
                  , a = e >= 0 || i >= 0 || o >= 0;
                if (this.isVirus && H.gs.uconfig.VirusRangeHint) {
                    a = true;
                    (h = this.overShape).clear();
                    h.alpha = 1;
                    let t = O.ColorHelper.ReplaceAlpha(H.gs.ucolors.GetColor("clVirusRangeHint"))
                      , e = H.gs.ucolors.GetAlpha("clVirusRangeHint");
                    h.beginFill(t, e);
                    h.drawCircle(0, 0, 880 / this.scale);
                    h.endFill()
                }
                if (a && (this.edgeColor != e || this.edgeColor2 != i || this.ringColor != o)) {
                    const u = this.node.ownerPlayerId == B.gameCore.nodeMan.activeSelfPlayerId;
                    if (this.edgeColor = e,
                    this.edgeColor2 = i,
                    this.ringColor = o,
                    (h = this.overShape).clear(),
                    h.alpha = 1,
                    e >= 0) {
                        var l = !u && H.gs.uconfig.MarkerThin ? 4 * s : 12.5 * s;
                        if (h.lineStyle(l, e),
                        h.drawCircle(0, 0, r - l / 2),
                        n) {
                            var c = .707 * r;
                            h.moveTo(c, -c),
                            h.lineTo(-c, c)
                        }
                    }
                    if (i >= 0) {
                        l = this.mass > 2e4 ? 8.75 * s : 6.25 * s;
                        h.lineStyle(l, i),
                        h.drawCircle(0, 0, r - l / 2)
                    }
                    if (o >= 0) {
                        l = 5 * s;
                        h.lineStyle(l, o),
                        h.drawCircle(0, 0, r + 10 * s)
                    }
                }
                this.overShape.visible = a,
                this.overShape.alpha = H.gs.uconfig.MarkerAlpha;
                var h, d = t >= 0;
                d && this.baseColor != t && (this.baseColor = t,
                this.baseShape.tint = t);
                this.baseShape.visible = d
            }
            ,
            t.prototype.UpdateGraphicsForFrame = function() {
                var t = this.baseSize;
                this.baseSize = N.CurrentConfigCardSize;
                var e = this.baseSize != t
                  , n = this.node
                  , i = B.gameCore.nodeMan
                  , o = B.gameCore.uMan
                  , r = O.GameHelper.DecodePlayerId(n.ownerPlayerId)
                  , s = r[0]
                  , a = r[1]
                  , l = o.GetUserInfoById(s)
                  , c = o.GetTeamInfoById(l.teamId)
                  , h = l.isBot
                  , d = c == o.selfTeamInfo
                  , u = o.selfTeamInfo.section
                  , p = (this.isPlayerCell || this.isFood) && !O.GameHelper.CheckIsInEatableSection(c.section, u);
                this.isInEatableSection = p;
                var f = H.gs.gstates.isPlaying && p;
                this.box.alpha = f ? .5 : 1;
                var g = this.isPlayerCell && (65534 & n.ownerPlayerId) == o.selfUserId
                  , m = this.isPlayerCell && n.ownerPlayerId == i.activeSelfPlayerId;
                e && (this.SetupLabel(this.nameLabel),
                this.SetupLabel(this.massLabel));
                var y = this.isPlayerCell && !H.gs.uconfig.ShowCircularName && H.gs.uconfig.ShowName && !(!H.gs.uconfig.ShowSelfName && g) && "" != l.fullName
                  , v = H.gs.uconfig.ShowMass && (this.isPlayerCell || this.isVirus)
                  , S = y && l.fullName ? l.fullName : null
                  , b = v ? n.mass : -1
                  , C = this.isVirus ? 16777215 : c.color;
                this.UpdateLabels(S, b, C);
                var x = -1
                  , _ = -1
                  , k = -1
                  , w = -1
                  , I = !1;
                if (this.isPlayerCell ? x = l.colors[a] : this.isFood ? x = l.colors[a] : this.isFunnel ? x = l.colors[a] : this.isPellet && (x = n.color),
                this.isPlayerCell) {
                    if (H.gs.uconfig.ShowSplitPrediction && m) {
                        var P = n.splitOrderWeight
                          , M = D.Nums.MapTo(P, .9, .58);
                        _ = 16777215 & O.ColorHelper.ColorFromHSVA(M, 1, 1, 1)
                    }
                    if (H.gs.uconfig.ShowMassMarker && !m) {
                        var T = n.sizeLevel;
                        var R = H.gs.uconfig.MarkerExtend ? [O.ColorHelper.ReplaceAlpha(H.gs.ucolors.GetColor("clMarkerA")), O.ColorHelper.ReplaceAlpha(H.gs.ucolors.GetColor("clMarkerB")), O.ColorHelper.ReplaceAlpha(H.gs.ucolors.GetColor("clMarkerC")), O.ColorHelper.ReplaceAlpha(H.gs.ucolors.GetColor("clMarkerD")), O.ColorHelper.ReplaceAlpha(H.gs.ucolors.GetColor("clMarkerE")), O.ColorHelper.ReplaceAlpha(H.gs.ucolors.GetColor("clMarkerF")), O.ColorHelper.ReplaceAlpha(H.gs.ucolors.GetColor("clMarkerG")), O.ColorHelper.ReplaceAlpha(H.gs.ucolors.GetColor("clMarkerH")), 204] : [16711680, 16737792, 16776960, 56831, 43520, 204];
                        if (-1 != T) {
                            var A = R[T];
                            H.gs.uconfig.ShowSkin && (H.gs.uconfig.ShowEnemySkin || d) ? (_ = A,
                            I = !h && !d,
                            H.gs.gconfig.ShowAlwaysAllPlayersSkin && (I = !1)) : x = A
                        }
                    }
                    if (H.gs.uconfig.ShowSplitIndicator && H.gs.gstates.isPlaying && !g && n.showMark && (w = n.canEat ? 65280 : 11184810),
                    H.gs.uconfig.ShowAutoSplitAlert && !H.gs.gstates.isBenchmarkMode && n.mass >= 17325) {
                        var U = this.frameTick / 25 * .5 % 1;
                        (U *= 2) > 1 && (U = 2 - U);
                        M = n.mass > 2e4 ? D.Nums.MapTo(U, 0, .33) : D.Nums.MapTo(U, .2875, .725);
                        k = 16777215 & O.ColorHelper.ColorFromHSVA(M, 1, 1, 1)
                    }
                }
                let E = this.isPlayerCell || this.isFood;
                if (this.cellCard,
                E || G.Utils.Confirm(-1 == _ && -1 == k && -1 == w),
                E && this.cellCard && this.cellCard.skinVisible && (x = -1),
                this.UpdateDrawing(x, _, I, k, w),
                this.cellCard && this.cellCard.texture) {
                    this.baseSprite.texture = this.cellCard.texture;
                    var F = this.baseSize / this.cellCard.cardSize;
                    this.baseSprite.scale.x = F,
                    this.baseSprite.scale.y = F
                }
                this.UpdateBaseShape();
                this.baseSprite.visible = null != this.cellCard
            }
            ,
            t.prototype.UpdateInterpolation = function(t, e) {
                this.frameTick++;
                const n = H.gs.uconfig;
                if (n.InterpolationType == 2) {
                    var i = D.Nums.MapTo(n.InterpolationSpeed, .9, .5);
                    this.x = D.Nums.EasyFilter(this.x, this.x1, i),
                    this.y = D.Nums.EasyFilter(this.y, this.y1, i),
                    this.scale = D.Nums.EasyFilter(this.scale, this.scale1, i),
                    this.speedApplyTime -= t,
                    this.speedApplyTime <= 0 && (this.speed = 0);
                    var o = 1 * O.GameHelper.MassToRadius(this.mass)
                      , r = H.gs.gconfig.FieldSize;
                    D.Nums.InRange(this.x1, o, r - o) && D.Nums.InRange(this.y1, o, r - o) || (this.speed = 0),
                    this.x1 += Math.cos(this.angle) * this.speed,
                    this.y1 += Math.sin(this.angle) * this.speed
                } else if (n.InterpolationType == 1) {
                    const c = this.node;
                    const h = this.isFood && !(n.ShowPelletSkin && this.cellCard) || this.isPellet ? 200 : this.baseSize;
                    const d = e;
                    c.LinearUpdate(d);
                    this.x = c.x;
                    this.y = c.y;
                    this.scale = c.r * 2 / h
                } else {
                    var s = performance.now()
                      , a = D.Nums.MapTo(n.InterpolationSpeed, 120, 40)
                      , l = D.Nums.Clamp((s - this.time) / a, 0, 1);
                    this.x = D.Nums.Lerp(this.x0, this.x1, l),
                    this.y = D.Nums.Lerp(this.y0, this.y1, l),
                    this.scale = D.Nums.Lerp(this.scale0, this.scale1, l)
                }
                this.box.x = this.x,
                this.box.y = this.y,
                this.box.scale.x = this.scale,
                this.box.scale.y = this.scale,
                this.box.zIndex = this.scale * (!this.isPlayerCell && !this.isVirus ? 200 / this.baseSize : 1) + 1e-8 * this.node.nodeId + (this.isInEatableSection ? 100 : 0)
            }
            ,
            t.prototype.UpdatePosRadius = function() {
                this.time = performance.now();
                const t = this.isFood && !(H.gs.uconfig.Show && this.cellCard) || this.isPellet ? 200 : this.baseSize;
                var e = 0 == this.mass
                  , n = this.node.nx
                  , i = this.node.ny
                  , o = this.node.mass
                  , r = 2 * O.GameHelper.MassToRadius(o) / t
                  , s = this.node.motionAngle
                  , a = this.node.motionSpeed;
                H.gs.uconfig.InterpolationType == 2 ? (this.speed = 25 * a / 60 * .6,
                this.speedApplyTime = 50) : this.speed = 0,
                e ? (this.x0 = n,
                this.y0 = i,
                this.scale0 = r,
                this.x = n,
                this.y = i,
                this.scale = r) : (this.x0 = this.x,
                this.y0 = this.y,
                this.scale0 = this.scale),
                this.x1 = n,
                this.y1 = i,
                this.scale1 = r,
                this.angle = s,
                this.mass = o
            }
            ,
            t.pool = new O.ObjectPool(H.gs.gconfig.MaxCellsNum,function() {
                return new t
            }
            ),
            t
        }()
          , n = function() {
            function t() {
                this.delta = 0;
                this.cells = new Map,
                this.time0 = Date.now(),
                this.checkQueue_interval = new o.PerformanceCheckQueue(60),
                this.checkQueue_duration = new o.PerformanceCheckQueue(60),
                this.frameIndex = 0
            }
            return t.prototype.Initialize = function() {
                var n = this
                  , t = document.querySelector("#game_canvas_layer_main")
                  , e = {
                    width: t.width,
                    height: t.hight,
                    view: t,
                    antialias: H.gs.uconfig.Antialias,
                    transparent: !0,
                    resolution: H.gs.uconfig.HDMode / 2 + 1,
                    autoDensity: !0
                };
                MAIN_RENDERER = S.autoDetectRenderer(e),
                MAIN_RENDERER.cells = this.cells;
                this.renderer = MAIN_RENDERER;
                this.drawingRoot = new S.Container,
                this.stage = new S.Container,
                this.drawingRoot.addChild(this.stage),
                this.fieldGraphics = new m.FieldGraphics(!0),
                this.stage.addChild(this.fieldGraphics.box);
                var i = function() {
                    n.fieldGraphics.SetCoordVisibility(H.gs.uconfig.ShowCoord)
                };
                H.gs.uconfig.RegisterChangedProc("ShowCoord", i),
                i(),
                this.cellsBox = new S.Container,
                this.stage.addChild(this.cellsBox),
                f.instance.Initialize(),
                this.gfs = new p(this),
                this.stage.addChild(this.gfs.box),
                B.gameCore.nodeMan.gameViewSyncNodesToListProc = this.SyncNodeListToModel.bind(this),
                B.gameCore.uMan.userLeavedProc = function(t) {
                    g.instance.OnUserLeaved(t)
                }
                ;
                var o = function() {
                    var t = window.innerWidth
                      , e = window.innerHeight;
                    n.renderer.resize(t, e),
                    B.gameCore.sight.SetScreenSize(t, e)
                };
                o(),
                window.onresize = o;
                const r = (t,e,n)=>{
                    n = n ? n : 1;
                    const i = document.createElement("canvas");
                    const o = t + (e ? 400 : 0);
                    i.width = i.height = o * 2;
                    const r = i.getContext("2d");
                    r.beginPath();
                    r.fillStyle = "#ffffff";
                    r.shadowColor = "#ffffff";
                    r.shadowBlur = e;
                    r.arc(o, o, t, 0, Math.PI * 2);
                    for (var s = 0; s < n; s++) {
                        r.fill();
                        r.globalAlpha /= 2
                    }
                    return PIXI.Texture.from(i)
                }
                ;
                const s = r(100);
                const a = r(200);
                const l = r(400);
                const c = r(100, 50, 1);
                const h = r(200, 100, 1);
                const d = r(400, 200, 1);
                s.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
                a.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
                l.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
                c.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
                h.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
                d.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
                PIXI.Texture.addToCache(s, "GP_BASE_LOW");
                PIXI.Texture.addToCache(a, "GP_BASE_MEDIUM");
                PIXI.Texture.addToCache(l, "GP_BASE_HIGH");
                PIXI.Texture.addToCache(c, "GP_GLOWING_LOW");
                PIXI.Texture.addToCache(h, "GP_GLOWING_MEDIUM");
                PIXI.Texture.addToCache(d, "GP_GLOWING_HIGH");
                const u = ()=>{
                    const t = document.createElement("canvas");
                    const e = 500;
                    t.width = t.height = e * 2;
                    const n = t.getContext("2d");
                    const i = H.gs.uconfig.PelletCellsAlpha;
                    n.beginPath();
                    n.fillStyle = "#ffffff";
                    n.shadowColor = "#ffffff";
                    n.shadowBlur = 2e3;
                    n.arc(e, e, 100, 0, Math.PI * 2);
                    n.fill();
                    n.globalAlpha = i / 2 + .125;
                    n.fill();
                    n.save();
                    n.clip();
                    n.clearRect(0, 0, e * 2, e * 2);
                    n.restore();
                    n.shadowBlur = 0;
                    n.globalAlpha = i;
                    n.fill();
                    let o = PIXI.Texture.from(t);
                    o.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
                    PIXI.Texture.addToCache(o, "GP_GLOWING_PELLET")
                }
                ;
                u();
                H.gs.uconfig.RegisterChangedProc("PelletCellsAlpha", u)
            }
            ,
            t.prototype.StartAnimation = function() {
                var t = this
                  , e = function() {
                    requestAnimationFrame(e),
                    O.TimeChecker.Start("FrameProc"),
                    t.FrameProc(),
                    O.TimeChecker.Stop()
                };
                e(),
                this.UpdatePerf()
            }
            ,
            t.prototype.FrameProc = function() {
                this.frameIndex++;
                var t = H.gs.usupport.TargetFrameRate;
                H.gs.gstates.isBenchmarkMode && (t = 60);
                var e = 60 / t;
                if (this.frameIndex % e == 0 && (O.PageHelper.Instance.Update(),
                O.PageHelper.Instance.IsActive)) {
                    H.gs.gstates.isBenchmarkMode && B.gameCore.benchDataFeeder.FrameUpdateProc(),
                    B.gameCore.sight.UpdateFrame();
                    var n = performance.now();
                    g.instance.UpdateCardDrawingQueue();
                    var i = performance.now()
                      , o = i - this.time0;
                    this.time0 = i;
                    let e = this.delta * .5;
                    this.cells.forEach(function(t) {
                        t.UpdateInterpolation(o, i + e);
                        t.UpdateGraphicsForFrame();
                        if (H.gs.uconfig.TogglePlayerTransparentCells && t.isPlayerCell) {
                            t.baseSprite.alpha = H.gs.uconfig.PlayerCellsAlpha;
                            t.baseShape.alpha = H.gs.uconfig.PlayerCellsAlpha;
                            t.overShape.fillAlpha = 0
                        } else if (!H.gs.uconfig.GlowingNonPlayerCells && (t.isFood || t.isPellet)) {
                            t.baseSprite.alpha = H.gs.uconfig.PelletCellsAlpha;
                            t.baseShape.alpha = H.gs.uconfig.PelletCellsAlpha;
                            t.overShape.fillAlpha = 0
                        } else {
                            t.baseSprite.alpha = 1;
                            t.baseShape.alpha = 1;
                            t.overShape.fillAlpha = 1
                        }
                    }),
                    this.gfs.Update(),
                    this.checkQueue_interval.Push(o),
                    this.cellsBox.sortChildren(),
                    this.UpdateStagePlacement(),
                    this.fieldGraphics.SetScale(H.gs.gconfig.FieldSize / this.fieldGraphics.baseSize),
                    this.renderer.render(this.drawingRoot);
                    var r = performance.now() - n;
                    this.delta = (this.delta + performance.now() - i) / 2;
                    this.checkQueue_duration.Push(r)
                }
            }
            ,
            t.prototype.UpdatePerf = function() {
                setTimeout(this.UpdatePerf.bind(this), 1e3),
                O.TimeChecker.Start("UpdatePerf");
                var t = B.gameCore.perfModel
                  , e = this.checkQueue_duration.GetAverageValue();
                t.avgDuration = e,
                t.avgRate = e / 17;
                var n = this.checkQueue_interval.GetAverageValue();
                t.avgFps = 1e3 / n,
                t.numCellsRendered = this.cells.size,
                O.TimeChecker.Stop()
            }
            ,
            t.prototype.UpdateStagePlacement = function() {
                var t = this.stage
                  , e = B.gameCore.sight
                  , n = e.scw / 2 - e.eyeX * e.eyeScale
                  , i = e.sch / 2 - e.eyeY * e.eyeScale;
                t.position.x = n,
                t.position.y = i,
                t.scale.x = e.eyeScale,
                t.scale.y = e.eyeScale
            }
            ,
            t.prototype.SyncNodeListToModel = function() {
                var i = this
                  , t = B.gameCore.nodeMan
                  , o = new Set(this.cells.keys())
                  , e = new Set;
                t.nodes.forEach(function(t) {
                    if (0 == t.cellType) {
                        B.gameCore.uMan.GetUserInfoById(t.ownerPlayerId);
                        e.add(t.ownerPlayerId)
                    }
                }),
                e.forEach(function(t) {
                    g.instance.GetCellCard(t, !0).Update()
                }),
                t.nodes.forEach(function(t) {
                    var e = t.nodeId
                      , n = i.cells.get(e);
                    n || ((n = r.Gain()).Initialize(t),
                    i.cells.set(e, n),
                    i.cellsBox.addChild(n.box)),
                    n.UpdateProps(t),
                    o.delete(e)
                }),
                o.forEach(function(t) {
                    var e = i.cells.get(t);
                    i.cellsBox.removeChild(e.box),
                    i.cells.delete(t),
                    e.Release()
                })
            }
            ,
            t
        }();
        t.GameView = n
    }(e.GameViewDomain2 || (e.GameViewDomain2 = {}))
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var S = n(0)
      , i = n(4)
      , o = function() {
        function t() {}
        return t.prototype.Initialize = function(t) {
            this.ctx = t.getContext("2d"),
            this.sz = t.width,
            i.gameCore.gameHudModel.chartDataHandlerProc = this.PostTeamRankingData.bind(this)
        }
        ,
        t.prototype.NormAngleToChartAngle = function(t) {
            var e = Math.PI;
            return .5 * -e + t * e * 2
        }
        ,
        t.prototype.PostTeamRankingData = function(t) {
            if (S.gs.uconfig.ShowLeaderboard || !S.gs.gconfig.ShowTeamRanking) {
                var e = this.ctx
                  , n = this.sz / 2
                  , i = this.sz / 2
                  , o = Math.PI;
                e.font = "16px CustomFont1, メイリオ, Arial",
                e.fillStyle = "#CCC",
                e.clearRect(0, 0, this.sz, this.sz),
                e.beginPath(),
                e.arc(n, n, i, 0, 2 * o, !1),
                e.fill();
                for (var r = 0, s = 0, a = t; s < a.length; s++) {
                    var l = (g = a[s]).name
                      , c = g.colorStr
                      , h = 1e-4 * g.score;
                    e.fillStyle = c,
                    e.beginPath();
                    var d = this.NormAngleToChartAngle(r)
                      , u = this.NormAngleToChartAngle(r + h);
                    e.moveTo(n, n),
                    e.lineTo(n + Math.cos(d) * i, n + Math.sin(d) * i),
                    e.arc(n, n, i, d, u, !1),
                    e.lineTo(n, n),
                    e.stroke(),
                    e.fill(),
                    r += h
                }
                e.beginPath(),
                e.arc(n, n, i, 0, 2 * o, !1),
                e.stroke(),
                r = 0;
                for (var p = 0, f = t; p < f.length; p++) {
                    var g;
                    l = (g = f[p]).name,
                    h = 1e-4 * g.score,
                    d = this.NormAngleToChartAngle(r),
                    u = this.NormAngleToChartAngle(r + h);
                    if (h > .07) {
                        var m = (d + u) / 2
                          , y = e.measureText(l).width;
                        e.fillStyle = "black";
                        var v = .6 * i;
                        e.fillText(l, n + Math.cos(m) * v - y / 2, n + Math.sin(m) * v + 4)
                    }
                    r += h
                }
            }
        }
        ,
        t
    }();
    e.TeamRankingChartView = o
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    const i = 100;
    const o = (new PIXI.Graphics).beginFill(16777215, 1).drawCircle(0, 0, i / 2).endFill().generateCanvasTexture(1, 2);
    const r = (new PIXI.Graphics).lineStyle(24, 16777215).drawCircle(0, 0, i / 2 - 12).generateCanvasTexture(1, 2);
    const s = (new PIXI.Graphics).beginFill(16777215, 1).drawCircle(0, 0, i / 2).endFill().lineStyle(8, 16777215).drawCircle(0, 0, i / 2 + 16).generateCanvasTexture();
    o.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON,
    r.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON,
    s.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON,
    PIXI.Texture.addToCache(o, "MM_BASE"),
    PIXI.Texture.addToCache(r, "MM_ENEMY"),
    PIXI.Texture.addToCache(s, "MM_SELF");
    var l = n(1)
      , c = n(3)
      , p = n(0)
      , m = n(4)
      , a = n(12)
      , h = n(6)
      , y = function() {
        function a() {
            this.box = new h.Container,
            this.box2 = new h.Container,
            this.box.addChild(this.box2),
            this.baseShape = new h.Sprite,
            this.baseShape.anchor.set(.5);
            this.box2.addChild(this.baseShape),
            this.box2.alpha = 1,
            this.nameLabel = new h.Text,
            this.massLabel = new h.BitmapText("",{
                fontName: "MINIMAP_MASS"
            }),
            this.SetupLabel(this.nameLabel, 0),
            this.box.addChild(this.nameLabel),
            this.box.addChild(this.massLabel)
        }
        return a.Gain = function() {
            return a.pool.Gain()
        }
        ,
        a.prototype.Release = function() {
            a.pool.Release(this)
        }
        ,
        a.prototype.Initialize = function(t, e) {
            this.playerId = t;
            this.isBot = e;
            this.name = null;
            this.shortName = null;
            this.color = 0;
            this.mass = 0;
            this.x = 0;
            this.y = 0;
            this.scale = 0;
            this.x1 = 0;
            this.y1 = 0;
            this.scale1 = 0;
            this.updated = !0;
            this.isSelfNode = !0;
            this.isTeammate = !1;
            this.nameLabel.style.fill = "#FFFFFF";
            this.nameLabel.text = null;
            this.massLabel.text = this.mass;
            this.nameLabel.visible = !e
        }
        ,
        a.prototype.SetupLabel = function(t) {
            t.style.fontFamily = "Meiryo, Arial";
            t.style.fontSize = 13;
            t.style.fill = "#FFFFFF"
        }
        ,
        a.prototype.SetBasicProps = function(t, e, n, i) {
            if (this.nameLabel && this.name != t) {
                var o = this.nameLabel;
                o.text = t,
                o.x = -o.width / 2,
                o.y = -o.height / 2,
                this.name = t
            }
            this.shortName = i;
            this.teamId = n;
            this.nameLabel.visible = !this.isBot && !e
        }
        ,
        a.prototype.UpdateBotDynamicProps = function(t, e) {
            var n = this.massLabel;
            n.x = n.width / 2;
            n.y = n.height / 2;
            if (this.nameLabel && this.name != e) {
                var i = this.nameLabel;
                i.text = e,
                i.x = -i.width / 2,
                i.y = -i.height / 2,
                this.name = e
            }
            this.isBot = t,
            this.nameLabel.visible = !this.isBot && !this.isSelfNode
        }
        ,
        a.prototype.SetVariableProps = function(t, e, n) {
            this.isTeammate = e;
            const i = p.gs.gstates;
            if (this.color != t || this.isSelfNode != n) {
                this.isSelfNode = n;
                this.baseShape.tint = this.color = t;
                var o = c.ColorHelper.ColorToHtmlString(t);
                this.nameLabel && (this.nameLabel.style.fill = o)
            }
            if (i.isSpectate && !i.isDeadSpectation) {
                if (this.isSelfNode) {
                    this.baseShape.texture = PIXI.utils.TextureCache["MM_SELF"]
                } else {
                    this.baseShape.texture = PIXI.utils.TextureCache["MM_BASE"]
                }
                this.baseShape.alpha = 1;
                this.nameLabel.alpha = 1
            } else {
                if (this.isSelfNode) {
                    this.baseShape.texture = PIXI.utils.TextureCache["MM_SELF"]
                } else if (this.isTeammate || this.isBot) {
                    this.baseShape.texture = PIXI.utils.TextureCache["MM_BASE"]
                }
                this.baseShape.alpha = !this.isBot ? this.isTeammate ? 1 : .375 : .75;
                this.nameLabel.alpha = this.isTeammate ? 1 : .75
            }
            this.box.visible = true
        }
        ,
        a.prototype.UpdateInterpolation = function() {
            this.x = l.Nums.EasyFilter(this.x, this.x1, .99);
            this.y = l.Nums.EasyFilter(this.y, this.y1, .99);
            this.box.x = this.x;
            this.box.y = this.y;
            this.box2.scale.x = this.scale;
            this.box2.scale.y = this.scale;
            this.scale = l.Nums.EasyFilter(this.scale, this.scale1, .99);
            if (this.nameLabel) {
                var t = this.nameLabel;
                t.y = -t.height - 40 * this.scale
            }
            if (this.massLabel) {
                var t = this.massLabel;
                const e = this.mass;
                if (e > 5600) {
                    t.alpha = this.isTeammate ? 0 : Math.min(e / 12500 + .2, .95)
                } else {
                    t.alpha = 0
                }
                t.y = -t.height / 1.5;
                t.x = -t.width / 2
            }
        }
        ,
        a.prototype.SetPosRadius = function(t, e, n) {
            var i = a.mapCoordScale;
            t *= i,
            e *= i;
            var o = 0 == this.mass;
            this.mass = n;
            this.box._zIndex = n;
            this.massLabel.text = (n / 100 >> 0) / 10 + "K";
            var r = c.GameHelper.MassToRadius(n);
            r *= i,
            r *= .75;
            this.isSelfNode && r < 4 && (r = 4);
            var s = 2 * r / a.CellBaseSize;
            this.x1 = t,
            this.y1 = e,
            this.scale1 = s,
            o && (this.x = t,
            this.y = e,
            this.scale = s,
            this.box.x = t,
            this.box.y = e,
            this.box2.scale.x = s,
            this.box2.scale.y = s)
        }
        ,
        a.mapCoordScale = .01,
        a.CellBaseSize = i,
        a.pool = new c.ObjectPool(p.gs.gconfig.MaxPlayerUnitNum,function() {
            return new a
        }
        ),
        a
    }()
      , v = function() {
        function t() {
            this.box = new h.Container,
            this.gr = new h.Graphics,
            this.box.addChild(this.gr),
            this.box.zIndex = 100
        }
        return t.prototype.Update = function() {
            var t = m.gameCore.sight
              , e = this.gr
              , n = y.mapCoordScale;
            if (e.clear(),
            p.gs.gstates.isRealtimeMode) {
                var i = p.gs.ucolors.colorDefs.clGameForeground;
                e.lineStyle(1, i);
                var o = t.eyeX * n
                  , r = t.eyeY * n
                  , s = p.gs.gconfig.FieldSize * n;
                e.alpha = .6,
                e.moveTo(o, 0),
                e.lineTo(o, s),
                e.moveTo(0, r),
                e.lineTo(s, r);
                var a = t.ScreenToWorld(0, 0)
                  , l = a[0]
                  , c = a[1]
                  , h = t.ScreenToWorld(window.innerWidth, window.innerHeight)
                  , d = h[0]
                  , u = h[1];
                l *= n,
                c *= n,
                d *= n,
                u *= n,
                e.moveTo(l, c),
                e.lineTo(d, c),
                e.lineTo(d, u),
                e.lineTo(l, u),
                e.lineTo(l, c)
            }
        }
        ,
        t
    }()
      , S = function() {
        function t() {
            this.nodes = new Map,
            this.mapFrontScreen = new v
        }
        return t.prototype.Initialize = function(t) {
            var e = this;
            this.uMan = m.gameCore.uMan,
            this.sz = t.width;
            var n = {
                width: t.width,
                height: t.height,
                view: t,
                antialias: p.gs.uconfig.Antialias,
                transparent: !0,
                resolution: p.gs.uconfig.HDMode / 2 + 1,
                autoDensity: !0
            };
            SUB_RENDERER = h.autoDetectRenderer(n),
            this.renderer = SUB_RENDERER,
            this.drawingRoot = new h.Container;
            var i = new a.FieldGraphics(!1);
            this.drawingRoot.addChild(i.box),
            i.SetScale(this.sz / i.baseSize),
            this.stage = new h.Container,
            this.stage.addChild(this.mapFrontScreen.box),
            this.drawingRoot.addChild(this.stage);
            var o = function() {
                requestAnimationFrame(o),
                p.gs.uconfig.ShowMap && e.FrameProc()
            };
            o(),
            m.gameCore.gameHudModel.mapDataHandlerProc = this.PostMapData.bind(this)
        }
        ,
        t.prototype.FrameProc = function() {
            c.PageHelper.Instance.IsActive && (y.mapCoordScale = this.sz / p.gs.gconfig.FieldSize,
            this.mapFrontScreen.Update(),
            this.nodes.forEach(function(t) {
                return t.UpdateInterpolation()
            }),
            this.renderer.render(this.drawingRoot))
        }
        ,
        t.prototype.PostMapData = function(t) {
            var e = this;
            this.nodes.forEach(function(t) {
                return t.updated = !1
            });
            for (var n = 0, i = t; n < i.length; n++) {
                var o = i[n]
                  , r = o.playerId
                  , s = this.nodes.get(r);
                if (!s) {
                    var a = this.uMan.GetUserInfoById(r);
                    if (-1 == a.clientId)
                        continue;
                    v = a.miniMapName,
                    S = a.isBot;
                    (s = y.Gain()).Initialize(r, S);
                    var l = (65534 & r) == this.uMan.selfUserId;
                    s.SetBasicProps(v, l, a.teamId, a.name),
                    this.stage.addChild(s.box),
                    this.nodes.set(r, s)
                }
                var c = this.uMan.GetTeamInfoForUser(r)
                  , h = c == this.uMan.selfTeamInfo
                  , d = r == m.gameCore.nodeMan.activeSelfPlayerId;
                s.SetVariableProps(c.color, h, d),
                s.SetPosRadius(o.nx, o.ny, o.mass),
                s.updated = !0;
                var u = this.uMan.GetUserInfoById(r);
                if (-1 != u.clientId) {
                    var p = u.miniMapName
                      , f = u.isBot;
                    s.name == p && s.isBot == f || s.UpdateBotDynamicProps(f, p)
                }
            }
            var g = new Array;
            this.nodes.forEach(function(t) {
                return !t.updated && g.push(t)
            }),
            g.forEach(function(t) {
                e.stage.removeChild(t.box),
                e.nodes.delete(t.playerId),
                t.Release()
            });
            e.stage.sortChildren()
        }
        ,
        t
    }();
    e.MapView = S
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var o = n(0)
      , r = n(3)
      , i = n(2)
      , s = n(4)
      , a = function() {
        return function(t, e, n, i) {
            this.senderName = t,
            this.message = e,
            this.timeStamp = n,
            this.nameColor = i
        }
    }();
    e.ChatMessage = a;
    var l = function() {
        function t(t) {
            this.text = "",
            this.color = "",
            this.score = "",
            this.active = !1,
            this.index = t
        }
        return t.prototype.setData = function(t, e, n) {
            this.text = t,
            this.color = e,
            this.score = n,
            this.active = !0
        }
        ,
        t.prototype.setNoData = function() {
            this.active = !1
        }
        ,
        t
    }();
    e.LeaderboardEntry = l;
    var c = function() {
        function t() {
            this.leaderboardEntries = [],
            this.teamRankingEntries = [],
            this.chatMessages = [],
            this.selfScore = 0,
            this.maxScore = 0,
            this.leaderboardHeaderText = ""
        }
        return t.prototype.insertStubChatMessages = function() {
            for (var t = 0; t < 2; t++)
                this.PostChatMessage("テスト" + t, "テスト", "0:00", null)
        }
        ,
        t.prototype.insertStubData = function() {}
        ,
        t.prototype.Initialize = function() {
            this.leaderboardHeaderText = i.AppConfigurator.instance.leaderboardHeaderText;
            for (var t = 0; t < 10; t++) {
                (e = new l(t)).setNoData(),
                this.leaderboardEntries.push(e)
            }
            for (t = 0; t < 4; t++) {
                var e;
                (e = new l(t)).setNoData(),
                this.teamRankingEntries.push(e)
            }
            this.insertStubData()
        }
        ,
        t.prototype.SetAimPlayerClient = function(t) {
            if (this.specTargetUserId != t) {
                if (this.specTargetUserId = t,
                t >= 0 && t != s.gameCore.uMan.selfUserId) {
                    var e = s.gameCore.uMan.GetUserInfoById(t);
                    this.specTargetName = e.fullName
                } else
                    this.specTargetName = null;
                this.isHudUpdated = !0
            }
        }
        ,
        t.prototype.SetSpecTargetScore = function(t) {
            this.specTargetScore = t,
            this.isHudUpdated = !0
        }
        ,
        t.prototype.PostServerStatusData = function(t) {
            r.PageHelper.Instance.IsActive && (this.serverStatusText = t.split(/\r?\n/),
            this.isHudUpdated = !0)
        }
        ,
        t.prototype.PostLatencyData = function(t) {
            this.latencyMs = t,
            this.isHudUpdated = !0
        }
        ,
        t.prototype.PostServerUserNumData = function(t, e, n, i) {
            var o = t + e + " / " + i + " (ᴘʟᴀʏ: " + t + ", ꜱᴘᴇᴄ: " + e + "), ʙᴏᴛ: " + n;
            this.serverUserNumText = o,
            this.isHudUpdated = !0
        }
        ,
        t.prototype.PostLeaderboardData = function(t) {
            if (r.PageHelper.Instance.IsActive && o.gs.uconfig.ShowLeaderboard) {
                for (var e = 0; e < this.leaderboardEntries.length; e++) {
                    var n = this.leaderboardEntries[e];
                    if (e < t.length) {
                        var i = t[e];
                        n.setData(i.name, i.colorStr, (.001 * i.score).toFixed(1) + "k")
                    } else
                        n.setNoData()
                }
                this.isHudUpdated = !0
            }
        }
        ,
        t.prototype.PostTeamRankingData = function(t) {
            if (r.PageHelper.Instance.IsActive) {
                if (o.gs.uconfig.ShowLeaderboard) {
                    for (var e = 0; e < this.teamRankingEntries.length; e++) {
                        var n = this.teamRankingEntries[e];
                        if (e < t.length) {
                            var i = t[e];
                            n.setData(i.name, i.colorStr, (.01 * i.score).toFixed(1) + "%")
                        } else
                            n.setNoData()
                    }
                    this.isHudUpdated = !0
                }
                this.chartDataHandlerProc(t)
            }
        }
        ,
        t.prototype.PostMapData = function(t) {
            o.gs.uconfig.ShowMap && this.mapDataHandlerProc(t)
        }
        ,
        t.prototype.ClearChatMessages = function() {
            this.chatMessages = [],
            this.isHudUpdated = !0
        }
        ,
        t.prototype.PostChatMessage = function(t, e, n, i) {
            i || (i = "#0CF");
            var o = new a(e,n,t,i);
            this.chatMessages.push(o),
            this.isHudUpdated = !0
        }
        ,
        t.prototype.PostServerDisplayMessage = function(t) {
            this.serverDisplayMessageText = t,
            this.isHudUpdated = !0
        }
        ,
        t.prototype.PostServerInstructionText = function(t) {
            this.serverInstructionProc(t)
        }
        ,
        t.prototype.ResetMaxScore = function() {
            this.maxScore = 0,
            this.selfScore = 0
        }
        ,
        t.prototype.PostSelfScoreData = function(t) {
            this.selfScore = t,
            this.maxScore = Math.max(this.maxScore, t),
            this.isHudUpdated = !0
        }
        ,
        t.prototype.SetSplitNum = function(t) {
            this.splitNum = t,
            this.isHudUpdated = !0
        }
        ,
        t
    }();
    e.GameHudModel = c
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var i = n(2)
      , o = n(3)
      , r = n(0)
      , s = function() {
        return function() {}
    }();
    e.ServerInfo = s;
    var a = function() {
        function t(t) {
            this.gameCore = t;
            var e = o.AppHelper.GetQueryObject();
            this.showAll = 1 == e.showall
        }
        return t.prototype.Start = function() {
            this.langCode = navigator.language.slice(0, 2),
            this.UpdateList()
        }
        ,
        t.prototype.ConnectToServer = function(t) {
            if (Date.now() - r.gs.gstates.playerDeadTimeStamp < 2e3)
                console.log("server selection cancelled");
            else {
                var e = t.address;
                this.currentServerUri = e,
                localStorage.setItem("connTargetUri", e);
                var n = t.modName;
                this.gameCore.ConnectToGameServerEx("ws://" + e, n)
            }
        }
        ,
        t.prototype.FilterServers = function(t) {
            var e = this;
            if (t.forEach(function(t) {
                t.modName = t.name,
                t.numClients = t.numPlayers + t.numSpectors,
                t.order += t.mirrorIndex,
                -1 != t.mirrorIndex && (t.modName += t.mirrorIndex),
                t.langCode && e.langCode != t.langCode && (t.visible = !1)
            }),
            !this.showAll) {
                for (var n = {}, i = 0, o = t; i < o.length; i++) {
                    n[(a = o[i]).name + a.mirrorIndex] = a
                }
                for (var r = 0, s = t; r < s.length; r++) {
                    var a, l = a = s[r], c = n[a.name + (a.mirrorIndex - 1)];
                    if (c)
                        c.numClients > c.numMaxClients - 25 || l.numClients > 10 || (l.visible = !1)
                }
            }
            return t.filter(function(t) {
                return t.visible
            }).sort(function(t, e) {
                return t.order - e.order
            })
        }
        ,
        t.prototype.UpdateList = function() {
            var s = this
              , t = i.AppConfigurator.instance.trackerServerUri
              , e = i.AppConfigurator.instance.trackerServerTargetSite;
            $.ajax({
                type: "GET",
                url: t + "/list",
                data: {
                    targetSite: e
                },
                success: function(t) {
                    if (s.serverInfos = s.FilterServers(t),
                    null == s.currentServerUri && s.serverInfos.length > 0) {
                        var e = localStorage.getItem("connTargetUri")
                          , n = null;
                        if (e)
                            for (var i = 0, o = s.serverInfos; i < o.length; i++) {
                                var r = o[i];
                                if (r.address == e) {
                                    n = r;
                                    break
                                }
                            }
                        n || (n = s.serverInfos[0]),
                        s.ConnectToServer(n)
                    }
                    s.Notify()
                }
            }),
            setTimeout(this.UpdateList.bind(this), 5e3)
        }
        ,
        t
    }();
    e.ServerListModel = a
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var o = n(1)
      , r = n(0)
      , s = n(3)
      , i = function() {
        function i() {}
        return i.AllocatePool = function() {
            null == this.pool && (this.pool = new s.ObjectPool(1e3,function() {
                return new i
            }
            ))
        }
        ,
        i.prototype.Initialize = function(t) {
            this.nodeId = i.seqId++,
            this.ownerPlayerId = t;
            this.counter = 0;
            var e = r.gs.gconfig.FieldSize;
            this.x = o.Nums.RandF() * e,
            this.y = o.Nums.RandF() * e;
            var n = o.Nums.RandF();
            this.mass = o.Nums.MapTo(n * n * n, 500, 22500) >> 0,
            this.color = s.GameHelper.GenarateRandomColor(),
            this.m_angle = o.Nums.RandF() * Math.PI * 2,
            this.speed = o.Nums.MapTo(o.Nums.RandF(), 20, 80),
            this.nr = s.GameHelper.MassToRadius(this.mass)
        }
        ,
        i.prototype.Update = function() {
            this.x += Math.cos(this.m_angle) * this.speed,
            this.y += Math.sin(this.m_angle) * this.speed;
            if (this.counter++ % 4 == 0) {
                this.mass += Math.random() * 100 - 50;
                this.mass = Math.max(Math.min(this.mass >> 0, 22500), 500)
            }
            var t = 1.1 * this.nr
              , e = r.gs.gconfig.FieldSize;
            o.Nums.InRange(this.x, t, e - t) || (this.m_angle = Math.PI - this.m_angle),
            o.Nums.InRange(this.y, t, e - t) || (this.m_angle = -this.m_angle)
        }
        ,
        i.seqId = 0,
        i
    }()
      , a = function() {
        function t(t) {
            this.nodes = [],
            this.tick = 0,
            this.gameCore = t
        }
        return t.prototype.Start = function() {
            this.playerIds = this.gameCore.uMan.GetPlayerIdsAvailable(),
            i.AllocatePool(),
            this.averageFps = 60,
            this.t0 = performance.now();
            for (var t = 0; t < 700; t++)
                ;
        }
        ,
        t.prototype.AddNode = function() {
            var t = o.Nums.RandI(this.playerIds.length)
              , e = this.playerIds[t]
              , n = i.pool.Gain();
            n.Initialize(e),
            this.nodes.push(n)
        }
        ,
        t.prototype.RemoveNode = function() {
            var t = this.nodes.shift();
            t && (i.pool.Release(t),
            this.gameCore.nodeMan.PostNodeRemoval(t.nodeId))
        }
        ,
        t.prototype.ClearNodes = function() {
            for (var t = 0, e = this.nodes; t < e.length; t++) {
                var n = e[t];
                i.pool.Release(n),
                this.gameCore.nodeMan.PostNodeRemoval(n.nodeId)
            }
            this.nodes = []
        }
        ,
        t.prototype.FrameUpdateProc = function() {
            var t = performance.now()
              , e = 1e3 / (t - this.t0);
            this.t0 = t,
            this.averageFps = o.Nums.EasyFilter(this.averageFps, e, .95),
            this.tick++,
            this.tick % 2 == 0 && (this.averageFps > 55 ? this.AddNode() : this.RemoveNode());
            var n = this.gameCore.nodeMan;
            this.nodes.forEach(function(t) {
                t.Update(),
                n.PostNodeData(t.nodeId, 0, t.x, t.y, t.mass, t.ownerPlayerId, t.color, t.m_angle, t.speed)
            }),
            n.SyncGameViewToModel()
        }
        ,
        t.prototype.Stop = function() {
            this.ClearNodes()
        }
        ,
        t
    }();
    e.PerfBenchDataFeeder = a
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var i = function() {
        function o(t) {
            this.ar = new Array,
            t && (t instanceof Array ? this.AddRange(t) : this.Add(t))
        }
        return Object.defineProperty(o.prototype, "array", {
            get: function() {
                return this.ar
            },
            enumerable: !0,
            configurable: !0
        }),
        o.prototype.Count = function(e) {
            if (e) {
                var n = 0;
                return this.ar.forEach(function(t) {
                    e(t) && n++
                }),
                n
            }
            return this.ar.length
        }
        ,
        o.prototype.Add = function(t) {
            this.ar.push(t)
        }
        ,
        o.prototype.AddUnique = function(t) {
            this.Contains(t) || this.ar.push(t)
        }
        ,
        o.prototype.AddRange = function(t) {
            var e;
            (e = this.ar).push.apply(e, t)
        }
        ,
        o.prototype.Clear = function() {
            this.ar.splice(0, this.ar.length)
        }
        ,
        o.prototype.RemoveAt = function(t) {
            this.ar.splice(t, 1)
        }
        ,
        o.prototype.Remove = function(t) {
            var e = this.ar.indexOf(t);
            e >= 0 && this.ar.splice(e, 1)
        }
        ,
        o.prototype.RemoveAll = function(e) {
            var n = this;
            this.ar.filter(function(t) {
                return e(t)
            }).forEach(function(t) {
                return n.Remove(t)
            })
        }
        ,
        o.prototype.Contains = function(t) {
            return this.ar.indexOf(t) >= 0
        }
        ,
        o.prototype.First = function(t) {
            return 0 == this.ar.length ? null : t ? this.ar.filter(t)[0] : this.ar[0]
        }
        ,
        o.prototype.FirstOrDefault = function(t, e) {
            return 0 == this.ar.length ? e : t ? this.ar.filter(t)[0] : this.ar[0]
        }
        ,
        o.prototype.Product = function(e) {
            return new o(this.ar.filter(function(t) {
                return e.Contains(t)
            }))
        }
        ,
        o.prototype.Except = function(t) {
            return new o(this.ar.filter(function(e) {
                return t.ar.every(function(t) {
                    return e != t
                })
            }))
        }
        ,
        o.prototype.Concat = function(t) {
            return new o(this.ar.concat(t.ar))
        }
        ,
        o.prototype.Distinct = function() {
            var e = new o;
            return this.ar.forEach(function(t) {
                e.Contains(t) || e.Add(t)
            }),
            e
        }
        ,
        o.prototype.Union = function(t) {
            var e = this.ToList();
            return t.ar.forEach(function(t) {
                e.Contains(t) || e.Add(t)
            }),
            e
        }
        ,
        o.prototype.ForEach = function(t) {
            for (var e = 0; e < this.ar.length; e++)
                t(this.ar[e])
        }
        ,
        o.prototype.Where = function(t) {
            return new o(this.ar.filter(t))
        }
        ,
        o.prototype.Select = function(t) {
            return new o(this.ar.map(t))
        }
        ,
        o.prototype.LimitCount = function(t) {
            return t < this.ar.length ? new o(this.ar.slice(0, t)) : this
        }
        ,
        o.prototype.Sort = function(t) {
            return new o(this.ar.sort(t))
        }
        ,
        o.prototype.GroupBy = function(n) {
            var i = {};
            this.ar.forEach(function(t) {
                var e = n(t);
                i[e] || (i[e] = new o),
                i[e].Add(t)
            });
            var t = new o;
            for (var e in i)
                t.ar.push(i[e]);
            return t
        }
        ,
        o.prototype.Take = function(t) {
            return new o(t > 0 ? this.ar.slice(0, t) : this.ar.slice(t))
        }
        ,
        o.prototype.TakeNFromTail = function(t) {
            return new o(this.ar.slice(-t))
        }
        ,
        o.prototype.Skip = function(t) {
            return t > this.ar.length ? new o : new o(this.ar.slice(t))
        }
        ,
        o.prototype.All = function(t) {
            for (var e = 0, n = this.ar; e < n.length; e++) {
                if (!t(n[e]))
                    return !1
            }
            return !0
        }
        ,
        o.prototype.Any = function(t) {
            for (var e = 0, n = this.ar; e < n.length; e++) {
                if (t(n[e]))
                    return !0
            }
            return !1
        }
        ,
        o.prototype.ToArray = function() {
            return this.ar.slice(0)
        }
        ,
        o.prototype.ToList = function() {
            return new o(this.ar.slice(0))
        }
        ,
        o.prototype.Min = function(t) {
            var e = t ? this.ar.map(t) : this;
            return Math.min.apply(Math, e)
        }
        ,
        o.prototype.Max = function(t) {
            var e = t ? this.ar.map(t) : this;
            return Math.max.apply(Math, e)
        }
        ,
        o.prototype.Sum = function(t) {
            return 0 == this.Count() ? 0 : (t ? this.ar.map(t) : this).reduce(function(t, e) {
                return t + e
            })
        }
        ,
        o.prototype.SafeSum = function(t) {
            return this.Sum(t)
        }
        ,
        o.prototype.Average = function(t) {
            return 0 == this.Count() ? 0 : this.Sum(t) / this.ar.length
        }
        ,
        o.prototype.OrderBy = function(n) {
            var t = this.ar.slice(0);
            return t.sort(function(t, e) {
                return n(t) - n(e)
            }),
            new o(t)
        }
        ,
        o.prototype.OrderByDescending = function(n) {
            var t = this.ar.slice(0);
            return t.sort(function(t, e) {
                return n(e) - n(t)
            }),
            new o(t)
        }
        ,
        o.prototype.SelectMany = function(n) {
            var i = new o;
            return this.ar.forEach(function(t) {
                var e = n(t);
                i.AddRange(e.ar)
            }),
            i
        }
        ,
        o.prototype.IndicesOf = function(t) {
            for (var e = [], n = 0; n < this.ar.length; n++)
                this.ar[n] == t && e.push(n);
            return new o(e)
        }
        ,
        o.prototype.SafeTake = function(t) {
            return this.Take(Math.min(t, this.ar.length))
        }
        ,
        o.prototype.Reverse = function() {
            return new o(this.ar.reverse())
        }
        ,
        o.prototype.Shift = function() {
            return this.ar.shift()
        }
        ,
        o
    }();
    e.List = i
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var l = n(2)
      , i = n(32)
      , c = n(1)
      , o = n(3)
      , r = new (function() {
        return function() {
            this.ChatAppCoreVersion = "ChatAppCore B100",
            this.MessageMaxLength = 140,
            this.ProfileCommentMaxLength = 60
        }
    }());
    var s = function() {
        return function() {
            this.Sessions = "Session",
            this.TeamMembers = "Team Members",
            this.AllUsers = "All Users",
            this.Online = "Online",
            this.Offline = "Offline",
            this.Advertisement = "AD",
            this.Name = "Name",
            this.Skin = "Skin",
            this.Comment = "Comment",
            this.ShowTripKey = "Show Trip Key",
            this.Blocked = "Blocked",
            this.BlockedMessageNotification = "You are blocked by the peer. This message has not been sent.",
            this.DeleteMessage = "Delete Message",
            this.BlockUnblock = "Block/Unblock",
            this.AppInstruction0 = "An advanced chat system designed for agar private servers. There are server-wide chat, team-specific chat, and private chat between two users. Server administator has no concern in private chat.",
            this.AppInstruction1 = "Name and skin url are set on the main game window. Either server-wide chat or team-specific chat is synchronized to the chat on game screen (depends on the setting of game server)."
        }
    }()
      , a = function() {
        return function() {
            this.Sessions = "セッション",
            this.TeamMembers = "チームメンバー",
            this.AllUsers = "すべてのユーザー",
            this.Online = "オンライン",
            this.Offline = "オフライン",
            this.Advertisement = "広告",
            this.Name = "名前",
            this.Skin = "スキン",
            this.Comment = "コメント",
            this.ShowTripKey = "トリップキーを表示",
            this.Blocked = "ブロック中",
            this.BlockedMessageNotification = "ブロックされています。この発言は相手に届いていません。",
            this.DeleteMessage = "メッセージを削除",
            this.BlockUnblock = "ブロック/解除",
            this.AppInstruction0 = "agarのプライベートサーバ向けに設計されたチャットシステムです。サーバ全体での会話,チーム毎の会話,ユーザ間での個別の会話があります。サーバ管理者はユーザ同士の個別の会話の内容には関知しません。",
            this.AppInstruction1 = "名前とスキンURLはゲーム画面で設定したものが使われます。全体の会話またはチームの会話がゲーム内でのチャットと同期しています(ゲームサーバの設定により異なります)。"
        }
    }()
      , h = navigator.language.startsWith("ja") ? new a : new s
      , d = n(0).gs.uconfig
      , u = function() {
        function t(t) {
            this.userId = t
        }
        return Object.defineProperty(t.prototype, "FullName", {
            get: function() {
                return this.name
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "GameFullName", {
            get: function() {
                return "" + this.team + this.name
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "showTripKey", {
            get: function() {
                return d.ShowTripKey ? true : this._showTripKey
            },
            enumerable: true,
            configurable: true
        }),
        t.prototype.SetProps = function(t) {
            this.siteSig = t.siteSig,
            this.serverSig = t.serverSig,
            this.name = t.name,
            this.team = t.team,
            this.code = t.code,
            this.skinUrl = t.skinUrl,
            this.skinUrlSmall = t.skinUrlSmall,
            this.fullTrip = t.fullTrip;
            const e = t.fullTrip.split("#");
            const n = e[0];
            const i = e[1];
            this.shortTrip = n + "|" + i,
            "" == this.skinUrl && (this.skinUrl = "gr/noimage.gif"),
            "" == this.skinUrlSmall && (this.skinUrlSmall = "gr/noimage.gif"),
            this.profileComment = t.profileComment,
            this._showTripKey = t.showTripKey,
            this.isPlaying = t.isPlaying,
            this.serverRoomSig = this.siteSig + "." + this.serverSig,
            this.teamRoomSig = this.siteSig + "." + this.serverSig + "." + this.team + "." + this.code
        }
        ,
        t
    }();
    e.ChatUser = u;
    var p = function() {
        function e(t, e, n) {
            this.text = e,
            this.messageId = n,
            t && (this.icon = t.skinUrlSmall,
            this.userId = t.userId,
            this.userName = t.GameFullName,
            this.timeStamp = c.DateTimeHelper.GetHourMinutesString())
        }
        return e.prototype.MakeCopy = function() {
            var t = new e(null,"",0);
            return t.icon = this.icon,
            t.text = this.text,
            t.messageId = this.messageId,
            t.userId = this.userId,
            t.userName = this.userName,
            t.timeStamp = this.timeStamp,
            t
        }
        ,
        e
    }()
      , f = function() {
        function t(t) {
            this.sessionId = t,
            this.messages = new i.List,
            this.isClosed = !1
        }
        return Object.defineProperty(t.prototype, "IsGroup", {
            get: function() {
                return 20 != this.category
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "IsPrivate", {
            get: function() {
                return 20 == this.category
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "HeaderName", {
            get: function() {
                return 12 == this.category && "" == this.title ? "no-tag" : this.IsGroup ? this.title : this.peer.GameFullName
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "HeaderIcon", {
            get: function() {
                return 20 == this.category ? this.peer.skinUrl : 12 == this.category ? "gr/team5a.png" : 11 == this.category ? "gr/web1b.png" : void 0
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.InitAsGroupSession = function(t, e, n) {
            this.category = t,
            this.roomSig = e,
            this.title = n,
            this.peer = null
        }
        ,
        t.prototype.InitAsPrivateSession = function(t) {
            this.category = 20,
            this.roomSig = "",
            this.title = "",
            this.peer = t
        }
        ,
        t.prototype.AddMessage = function(t) {
            this.messages.Add(t),
            this.reqScroll = !0
        }
        ,
        t.prototype.RemoveMessage = function(e, t) {
            var n = this.messages.First(function(t) {
                return t.messageId == e
            });
            if (n && (this.messages.Remove(n),
            t)) {
                var i = n.MakeCopy();
                i.text = h.BlockedMessageNotification,
                this.messages.Add(i)
            }
        }
        ,
        t
    }()
      , g = function() {
        function t() {
            this.siteSig = "",
            this.serverSig = "",
            this.name = "",
            this.team = "",
            this.code = "",
            this.skinUrl = "",
            this.envSig = "",
            this.profileComment = "",
            this.showTripKey = !1
        }
        return t.prototype.GetSequentialSignature = function() {
            return this.siteSig + "_" + this.serverSig + "_" + this.name + "_" + this.team + "_" + this.code + "_" + this.skinUrl + "_" + this.profileComment + "_" + this.showTripKey + "_" + this.envSig
        }
        ,
        t
    }()
      , m = (function() {}(),
    function() {}(),
    function() {}(),
    function() {}(),
    function() {
        function t(t) {
            this.receiver = t
        }
        return Object.defineProperty(t.prototype, "IsConnected", {
            get: function() {
                return null != this.ws
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.SendPacket = function(t) {
            this.ws && this.ws.readyState == WebSocket.OPEN && this.ws.send(t)
        }
        ,
        t.prototype.ConnectToChatServer = function() {
            console.log("connecting to chat server"),
            this.ws = new WebSocket(r.ChatServerUri),
            this.ws.onmessage = this.OnWsMessage.bind(this),
            this.ws.onopen = this.OnWsOpen.bind(this),
            this.ws.onerror = this.OnWsError.bind(this),
            this.ws.onclose = this.OnWsClose.bind(this)
        }
        ,
        t.prototype.Close = function() {
            this.ws && (this.ws.close(),
            this.ws = null)
        }
        ,
        t.prototype.OnWsOpen = function() {
            this.SendPacket(JSON.stringify({
                op: "JoinToServer"
            }))
        }
        ,
        t.prototype.OnWsClose = function(t) {
            t.reason && console.log("connection to chat server closed: " + t.reason),
            this.receiver.SetAvailability(!1),
            this.receiver.FireChanged()
        }
        ,
        t.prototype.OnWsError = function(t) {
            console.log(t)
        }
        ,
        t.prototype.OnWsMessage = function(t) {
            o.TimeChecker.Start("OnWsMessage@ExChatAppModel");
            var e = JSON.parse(t.data)
              , n = e.op;
            "SelfUserId" == n ? (this.selfUserId = e.userId,
            this.selfUserId,
            this.pendingUserInfo && (this.SendSelfEntryInfoCore(this.pendingUserInfo),
            this.pendingUserInfo = null),
            this.receiver.SetAvailability(!0)) : "UpdateUserInfos" == n ? this.receiver.UserInfosUpdated(e.infos) : "UpdateFixedGroupSessions" == n ? this.receiver.UpdateFixedGroupSessionInfos(e.infos) : "UpdatePrivateSession" == n ? this.receiver.UpdatePrivateSessionInfo(e.info) : "ChatMessage" == n ? this.receiver.HandleReceivedMessage(e.data) : "MessageRemoval" == n && this.receiver.HandleMessageRemoval(e.data),
            this.receiver.FireChanged(),
            o.TimeChecker.Stop()
        }
        ,
        t.prototype.SendSelfEntryInfoCore = function(t) {
            var e = JSON.stringify({
                op: "UpdateUserInfo",
                userId: this.selfUserId,
                data: t
            });
            this.SendPacket(e)
        }
        ,
        t.prototype.SendSelfEntryInfo = function(t, e) {
            this.ws ? this.SendSelfEntryInfoCore(t) : (this.pendingUserInfo = t,
            e && this.ConnectToChatServer())
        }
        ,
        t.prototype.RequestStartNewPrivateSession = function(t) {
            this.SendPacket(JSON.stringify({
                op: "NewPrivateSession",
                userId: this.selfUserId,
                peerUserId: t
            }))
        }
        ,
        t.prototype.SendChatMessage = function(t, e) {
            var n = r.MessageMaxLength;
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
            })),
            this.selfUserId
        }
        ,
        t.prototype.SendMessageRemoval = function(t, e, n) {
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
        }
        ,
        t
    }())
      , y = function() {
        return function() {
            this.profileComment = "",
            this.showTripKey = !1
        }
    }()
      , v = function() {
        function t() {}
        return t.prototype.Init = function() {
            var t = l.AppConfigurator.instance.MaxProfileNum;
            this.profileExData = Array(t);
            for (var e = 0; e < t; e++)
                this.profileExData[e] = new y;
            var n = localStorage.getItem("profileExData");
            if (n) {
                var i = JSON.parse(n);
                if (i && i.length > 0)
                    for (var o = Math.min(t, i.length), r = 0; r < o; r++)
                        c.Objects.CopyObjectProps(this.profileExData[r], i[r])
            } else
                this.SaveProfileExData();
            var s = localStorage.getItem("isUserActive");
            s ? (this.isUserActive = "1" == s,
            this.SaveIsActive()) : this.isUserActive = !0;
            var a = localStorage.getItem("blockedUserTrips");
            a ? this.blockedUserTrips = JSON.parse(a) : (this.blockedUserTrips = [],
            this.SaveBlockedUserTrips())
        }
        ,
        t.prototype.SaveProfileExData = function() {
            var t = JSON.stringify(this.profileExData);
            localStorage.setItem("profileExData", t)
        }
        ,
        t.prototype.SaveIsActive = function() {
            localStorage.setItem("isUserActive", this.isUserActive ? "1" : "0")
        }
        ,
        t.prototype.SaveBlockedUserTrips = function() {
            var t = JSON.stringify(this.blockedUserTrips);
            localStorage.setItem("blockedUserTrips", t)
        }
        ,
        t.prototype.SetUserBlockState = function(t, e) {
            if (e && -1 == this.blockedUserTrips.indexOf(t))
                this.blockedUserTrips.push(t),
                this.SaveBlockedUserTrips();
            else if (!e && this.blockedUserTrips.indexOf(t) >= 0) {
                var n = this.blockedUserTrips.indexOf(t);
                this.blockedUserTrips.splice(n, 1),
                this.SaveBlockedUserTrips()
            }
        }
        ,
        t
    }()
      , S = function() {
        function t() {
            this.entryInfo = new g,
            this.entrySeqSig = "",
            this.allUsers = new i.List,
            this.allSessions = new i.List,
            this.tmpSession = new f(0),
            this.sessionInitialMessage = null,
            this.loadedProfileIndex = 0,
            this.storage = new v,
            this.ShowVersion(),
            this.bridge = new m(this)
        }
        return Object.defineProperty(t.prototype, "Texts", {
            get: function() {
                return h
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "IsUserActive", {
            get: function() {
                return this.storage.isUserActive
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "selfUserId", {
            get: function() {
                return this.bridge ? this.bridge.selfUserId : 0
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.SetUserEnvSig = function(t) {
            this.entryInfo.envSig = t
        }
        ,
        t.prototype.ShowVersion = function() {
            console.log(r.ChatAppCoreVersion)
        }
        ,
        t.prototype.FireChanged = function() {
            this.procOnChanged && this.procOnChanged()
        }
        ,
        t.prototype.SetAvailability = function(t) {
            this.isAvailable = t,
            console.log("unichat availability: " + t)
        }
        ,
        t.prototype.DiscardCurrentSessions = function() {
            this.allSessions.Clear(),
            this.allUsers.Clear(),
            this.selfUser = null,
            this.gameChatSession = null,
            this.curSession = null
        }
        ,
        t.prototype.SetUserActive = function(t) {
            this.storage.isUserActive != t && (this.bridge.IsConnected && !t ? (this.DiscardCurrentSessions(),
            this.bridge.Close()) : !this.bridge.IsConnected && t && this.bridge.SendSelfEntryInfo(this.selfInfoCash, !0),
            this.storage.isUserActive = t,
            this.storage.SaveIsActive())
        }
        ,
        t.prototype.ChatWindowOpenStateChanged = function(t) {
            this.isWindowOpen = t,
            t && (this.chatNotificationBadgeProc && this.chatNotificationBadgeProc(!1),
            this.chatNotificationTitleProc && this.chatNotificationTitleProc(!1))
        }
        ,
        t.prototype.SetGameTeamChatSessionEnabled = function(t) {
            r.GameChatSessionCategory = t ? 12 : 11
        }
        ,
        t.prototype.SetChatServerUri = function(t) {
            r.ChatServerUri = t
        }
        ,
        t.prototype.SetSiteSignature = function(t) {
            this.entryInfo.siteSig = t
        }
        ,
        t.prototype.SetServerSignature = function(t, e) {
            (t != this.entryInfo.serverSig || e) && (this.ClearAllUsersAndSessions(),
            this.entryInfo.serverSig = t,
            e && this.SendUserEntryIfChanged(!0))
        }
        ,
        t.prototype.SetUserEntryInfo = function(t, e, n, i, o) {
            var r = l.AppConfigurator.instance.MaxProfileNum;
            if (0 <= o && o < r) {
                null == o && (o = 0),
                this.entryInfo.name = t,
                this.entryInfo.team = e,
                this.entryInfo.code = n,
                this.entryInfo.skinUrl = i,
                this.storage.profileExData || this.storage.Init();
                var s = this.storage.profileExData[o];
                this.entryInfo.profileComment = s.profileComment,
                this.entryInfo.showTripKey = s.showTripKey,
                this.loadedProfileIndex = o,
                this.SendUserEntryIfChanged()
            }
        }
        ,
        t.prototype.ClearAllUsersAndSessions = function() {
            var e = this;
            this.curSession = null,
            this.allSessions.Clear(),
            this.allUsers.Where(function(t) {
                return t != e.selfUser
            }).ForEach(function(t) {
                return e.RemoveUser(t)
            })
        }
        ,
        t.prototype.SendUserEntryIfChanged = function(t) {
            void 0 === t && (t = !1);
            var e = this.entryInfo.GetSequentialSignature();
            (e != this.entrySeqSig || t) && (this.IsUserActive && this.bridge.SendSelfEntryInfo(this.entryInfo, !0),
            this.selfInfoCash = this.entryInfo,
            this.entrySeqSig = e)
        }
        ,
        t.prototype.UpdateSelfProfileDetail = function(t, e) {
            var n = r.ProfileCommentMaxLength;
            e.length > n && (e = e.substr(0, n));
            var i = this.storage.profileExData[this.loadedProfileIndex];
            i.profileComment = e,
            i.showTripKey = t,
            this.storage.SaveProfileExData(),
            this.entryInfo.profileComment = e,
            this.entryInfo.showTripKey = t,
            this.SendUserEntryIfChanged()
        }
        ,
        t.prototype.GetUserById = function(e) {
            return this.allUsers.FirstOrDefault(function(t) {
                return t.userId == e
            }, null)
        }
        ,
        t.prototype.GetSessionById = function(e) {
            return this.allSessions.FirstOrDefault(function(t) {
                return t.sessionId == e
            }, null)
        }
        ,
        t.prototype.RequestStartNewSession = function(t) {
            this.bridge.RequestStartNewPrivateSession(t.userId)
        }
        ,
        t.prototype.CheckValidName = function() {
            return "" != this.selfUser.name
        }
        ,
        t.prototype.SendMessageOnCurrentSession = function(t) {
            this.CheckValidName() && (this.curSession == this.tmpSession ? (this.sessionInitialMessage = t,
            this.RequestStartNewSession(this.tmpSession.peer)) : this.bridge.SendChatMessage(this.curSession.sessionId, t))
        }
        ,
        t.prototype.SendMessageOnGameChatSession = function(t) {
            this.CheckValidName() && this.gameChatSession && this.bridge.SendChatMessage(this.gameChatSession.sessionId, t)
        }
        ,
        t.prototype.SetUserBlockState = function(t, e) {
            t.fullTrip != this.selfUser.fullTrip && (t.isBlocked = e,
            this.storage.SetUserBlockState(t.fullTrip, e))
        }
        ,
        t.prototype.AddNewUser = function(t) {
            var e = new u(t.userId);
            return e.SetProps(t),
            this.storage.blockedUserTrips.indexOf(e.fullTrip) >= 0 && (e.isBlocked = !0),
            t.userId == this.selfUserId && (this.selfUser = e),
            this.allUsers.Add(e),
            e
        }
        ,
        t.prototype.RemoveUser = function(e) {
            var n = this;
            (this.allUsers.Remove(e),
            e.userId == this.selfUserId) ? (this.allSessions.RemoveAll(function(t) {
                return t.IsPrivate
            }),
            this.SelectSession(this.gameChatSession)) : this.allSessions.Where(function(t) {
                return t.peer == e
            }).ForEach(function(t) {
                t.hasNewMessage ? t.isClosed = !0 : n.allSessions.Remove(t)
            })
        }
        ,
        t.prototype.UserInfosUpdated = function(t) {
            var n = this;
            t.forEach(function(t) {
                if (0 == t.isAlive) {
                    (e = n.GetUserById(t.userId)) && n.RemoveUser(e)
                } else {
                    var e = n.GetUserById(t.userId);
                    if (t.userId == n.selfUserId && (t.name,
                    t.team),
                    e)
                        e.serverSig == t.serverSig && e.name == t.name && e.team == t.team ? e.SetProps(t) : (n.RemoveUser(e),
                        n.AddNewUser(t));
                    else
                        n.AddNewUser(t)
                }
            })
        }
        ,
        t.prototype.UpdateFixedGroupSessionInfos = function(t) {
            var n = this;
            t.forEach(function(t) {
                var e = n.GetSessionById(t.sessionId);
                e || ((e = new f(t.sessionId)).InitAsGroupSession(t.category, t.roomSig, t.title),
                n.allSessions.Add(e)),
                t.category == r.GameChatSessionCategory && (n.gameChatSession = e,
                n.gameChatSession.sessionId,
                n.gameChatSession.HeaderName)
            }),
            null == this.curSession && (this.curSession = this.gameChatSession);
            var e = t.map(function(t) {
                return t.sessionId
            });
            this.allSessions.Where(function(t) {
                return t.IsGroup && -1 == e.indexOf(t.sessionId)
            }).ForEach(function(t) {
                return n.allSessions.Remove(t)
            })
        }
        ,
        t.prototype.UpdatePrivateSessionInfo = function(t) {
            var e = this.GetSessionById(t.sessionId);
            if (!e) {
                e = new f(t.sessionId);
                var n = t.userIds[0] == this.selfUserId ? t.userIds[1] : t.userIds[0]
                  , i = this.GetUserById(n);
                e.InitAsPrivateSession(i),
                this.allSessions.Add(e),
                this.tmpSession && this.curSession == this.tmpSession && t.userIds[0] == this.tmpSession.peer.userId && (this.curSession = e)
            }
            null != this.sessionInitialMessage && (this.curSession = e,
            this.SendMessageOnCurrentSession(this.sessionInitialMessage),
            this.sessionInitialMessage = null)
        }
        ,
        t.prototype.HandleReceivedMessage = function(t) {
            var e = this.GetSessionById(t.sessionId)
              , n = this.GetUserById(t.userId);
            if (n && e) {
                if (n.isBlocked)
                    return void (e.IsPrivate && this.bridge.SendMessageRemoval(e.sessionId, t.messageId, !0));
                if (e.AddMessage(new p(n,t.text,t.messageId)),
                e != this.curSession && (e.hasNewMessage = !0),
                !e.IsGroup && !this.isWindowOpen) {
                    var i = t.text
                      , o = n.skinUrl;
                    this.chatNotificationBadgeProc && this.chatNotificationBadgeProc(!0, o, i),
                    this.chatNotificationTitleProc && this.chatNotificationTitleProc(!0)
                }
                e == this.gameChatSession && this.gameChatMessageReceiverProc && this.gameChatMessageReceiverProc(n.ChatFullName, t.text)
            }
        }
        ,
        t.prototype.HandleMessageRemoval = function(t) {
            var e = this.GetSessionById(t.sessionId);
            e && e.RemoveMessage(t.messageId, t.isBlocked)
        }
        ,
        t.prototype.SelectUser = function(e) {
            var t = this.allSessions.First(function(t) {
                return t.peer == e
            });
            t ? (this.curSession = t,
            t.reqScroll = !0,
            this.FireChanged()) : (this.tmpSession.InitAsPrivateSession(e),
            this.curSession = this.tmpSession),
            this.curUser = e
        }
        ,
        t.prototype.SelectSelfUser = function() {
            this.curUser = this.selfUser,
            this.curSession = null
        }
        ,
        t.prototype.SelectUserById = function(t) {
            var e = this.GetUserById(t);
            e && this.SelectUser(e)
        }
        ,
        t.prototype.RemoveCurrentSessionIfClosed = function() {
            this.curSession && this.curSession.isClosed && this.allSessions.Remove(this.curSession)
        }
        ,
        t.prototype.SelectSession = function(t) {
            this.curSession != t && (this.RemoveCurrentSessionIfClosed(),
            this.curSession = t,
            t.reqScroll = !0,
            t.hasNewMessage = !1,
            this.curUser = t.IsPrivate ? t.peer : null,
            this.FireChanged())
        }
        ,
        t.prototype.SelectMessage = function(t) {
            this.curMessage = this.GetMessageById(t)
        }
        ,
        t.prototype.GetMessageById = function(e) {
            return this.curSession.messages.First(function(t) {
                return t.messageId == e
            })
        }
        ,
        t.prototype.DeleteCurrentMessage = function() {
            this.curMessage.userId == this.selfUserId && this.bridge.SendMessageRemoval(this.curSession.sessionId, this.curMessage.messageId, !1)
        }
        ,
        t
    }();
    e.ChatAppModel = S
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var m = n(1)
      , y = n(0)
      , i = n(7)
      , o = function() {
        function t(t) {
            this.initDone = !1,
            this.tick = 0,
            this.jumpDurationMs = 2e3,
            this.teamCircleTimeStamp = 0,
            this.teamCircleX = 0,
            this.teamCircleY = 0,
            this.teamCircleRadius = 0,
            this.gameCore = t
        }
        return t.prototype.Init = function() {
            if (!this.initDone) {
                var t = y.gs.gconfig.FieldSize / 2;
                this.eyeX = t,
                this.eyeY = t,
                this.eyeX1 = t,
                this.eyeY1 = t;
                this.eyeScale = .08,
                this.eyeScale1 = .08,
                this.gravityX = t,
                this.gravityY = t,
                this.aimCursorX = t,
                this.aimCursorY = t,
                this.localAimX = t,
                this.localAimY = t,
                this.initDone = !0,
                m.Utils.Confirm(this.scw),
                this.mouseX = this.scw / 2,
                this.mouseY = this.sch / 2,
                this.aimPlayerId = -1
            }
        }
        ,
        t.prototype.SetScreenSize = function(t, e) {
            this.scw = t,
            this.sch = e
        }
        ,
        t.prototype.ScreenToWorld = function(t, e) {
            return [(t - this.scw / 2) / this.eyeScale + this.eyeX, (e - this.sch / 2) / this.eyeScale + this.eyeY]
        }
        ,
        t.prototype.WorldToScreen = function(t, e) {
            return [(t - this.eyeX) * this.eyeScale + this.scw / 2, (e - this.eyeY) * this.eyeScale + this.sch / 2]
        }
        ,
        t.prototype.SetServerEyePos = function(t, e) {
            this.serverEyePosX = t,
            this.serverEyePosY = e
        }
        ,
        t.prototype.ShiftScale = function(t) {
            var e = 1 + .13 * t
              , n = this.eyeScale1 * e;
            this.eyeScale1 = m.Nums.Clamp(n, .005, 1.5)
        }
        ,
        t.prototype.SendSelfAimPosition = function() {
            if (stopMouse) {
                return
            }
            var t = this.ScreenToWorld(this.mouseX, this.mouseY)
              , e = t[0]
              , n = t[1];
            if (e != this.aimXSent || n != this.aimYSent) {
                var i = this.gameCore.conn;
                i && i.SendAimCursor(e, n),
                this.aimXSent = e,
                this.aimYSent = n
            }
        }
        ,
        t.prototype.RecordStatePacket = function() {
            var t = this
              , e = i.InternalPackets.SightState(t.eyeX, t.eyeY, t.eyeScale, t.aimCursorX, t.aimCursorY, t.splitting, t.aimPlayerId);
            this.gameCore.dataRecorder.PostInternalRecordingPacket(e)
        }
        ,
        t.prototype.UpdateFrame = function() {
            this.UpdateCurrentPosScale();
            var t = y.gs.gconfig.FieldSize;
            if (this.eyeX = m.Nums.Clamp(this.eyeX, 0, t),
            this.eyeY = m.Nums.Clamp(this.eyeY, 0, t),
            y.gs.gstates.isPlaying) {
                var e = this.ScreenToWorld(this.mouseX, this.mouseY)
                  , n = e[0]
                  , i = e[1];
                this.aimCursorX = n,
                this.aimCursorY = i
            }
            y.gs.gstates.isRealtimeMode && this.tick % 2 == 0 && (this.SendSelfAimPosition(),
            this.RecordStatePacket()),
            this.tick++
        }
        ,
        t.prototype.UpdateCurrentPosScale = function() {
            var t, e, n, i = y.gs.gstates, o = this.gameCore.nodeMan;
            if (i.isBenchmarkMode) {
                var r = y.gs.gconfig.FieldSize / 2;
                this.eyeX = r,
                this.eyeY = r,
                this.eyeScale = .05
            } else if (i.isReplayMode) {
                var s = .6;
                this.eyeX = m.Nums.EasyFilter(this.eyeX, this.eyeX1, s),
                this.eyeY = m.Nums.EasyFilter(this.eyeY, this.eyeY1, s),
                this.eyeScale = m.Nums.EasyFilter(this.eyeScale, this.eyeScale1, s)
            } else if (i.isRealtimeMode) {
                var a = this.ScreenToWorld(this.mouseX, this.mouseY)
                  , l = a[0]
                  , c = a[1]
                  , h = void 0
                  , d = void 0;
                s = .985 - y.gs.uconfig.CameraMovementSpeed * 5e-4;
                if (i.isPlaying && o.hasSelfNode) {
                    var u = o.CalcurateCenterPointOfAllSelfCells()
                      , p = u[0]
                      , f = u[1];
                    if (this.spawned && (this.jumpTick = this.jumpDurationMs,
                    this.eyeX2 = p,
                    this.eyeY2 = f,
                    this.spawned = !1),
                    this.jumpTick > 0) {
                        this.jumpTick -= 17;
                        var g = m.Nums.VMap(this.jumpTick, this.jumpDurationMs, 0, 0, 1, !0);
                        h = m.Nums.Lerp(this.eyeX2, p, g),
                        d = m.Nums.Lerp(this.eyeY2, f, g),
                        s = m.Nums.Lerp(.94, .986, g)
                    } else
                        h = (t = [p, f])[0],
                        d = t[1]
                } else
                    -1 != this.aimPlayerId && (65534 & this.aimPlayerId) != this.gameCore.uMan.selfUserId ? (h = (e = [this.serverEyePosX, this.serverEyePosY])[0],
                    d = e[1]) : (h = (n = [l, c])[0],
                    d = n[1]);
                this.eyeX = m.Nums.EasyFilter(this.eyeX, h, s),
                this.eyeY = m.Nums.EasyFilter(this.eyeY, d, s);
                this.eyeScale = m.Nums.EasyFilter(this.eyeScale, this.eyeScale1, .86)
            }
        }
        ,
        t.prototype.SetSpawned = function() {
            this.spawned = !0
        }
        ,
        t.prototype.OnPlayerDead = function() {
            var t = this.gravityX
              , e = this.gravityY
              , n = this.aimCursorX
              , i = this.aimCursorY
              , o = m.Nums.Lerp(t, n, .3)
              , r = m.Nums.Lerp(e, i, .3);
            this.localAimX = o,
            this.localAimY = r
        }
        ,
        t.prototype.UpdateInterpolation = function() {}
        ,
        t.prototype.FeedReplaySightState = function(t, e, n, i, o, r, s) {
            this.eyeX1 = t,
            this.eyeY1 = e,
            y.gs.uconfig.AffectZoomingOnReplay && (this.eyeScale1 = n),
            this.aimCursorX = i,
            this.aimCursorY = o,
            this.splitting = r,
            this.aimPlayerId = s
        }
        ,
        t.prototype.setAimCursorProps = function(t, e, n, i) {
            this.aimPlayerId = t,
            this.aimCursorX = e,
            this.aimCursorY = n,
            this.splitting = i
        }
        ,
        t
    }();
    e.SightCoord = o
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = n(1)
      , i = n(2)
      , a = n(3)
      , o = function() {
        function n(t) {
            this.name = "Profile" + (t + 1),
            this.team = "",
            this.code = "";
            var e = t;
            e >= n.skinUrlSources.length && (e = 0),
            this.skinUrl = n.skinUrlSources[e],
            this.skinUrl2 = n.skinUrlSources[e],
            this.profileIndex = t
        }
        return n.prototype.MakeSequenceString = function() {
            return this.name + "/" + this.team + "/" + this.code + "/" + this.skinUrl + "/" + this.skinUrl2
        }
        ,
        n.skinUrlSources = ["http://ixagar.net/skins/ring.png", "http://ixagar.net/skins/k461.png", "http://ixagar.net/skins/wolf.png", "http://ixagar.net/skins/rabbit.png", "http://ixagar.net/skins/dragon.png", "http://ixagar.net/skins/magic_circle.png", "http://ixagar.net/skins/ghost.png", "http://ixagar.net/skins/daemon.png", "http://ixagar.net/skins/bat.png", "http://ixagar.net/skins/skull.png"],
        n
    }();
    e.UserEntryInfo = o;
    var r = function() {
        function t() {
            this.curIndex = 0,
            this.modified = !1,
            this.infos = [];
            for (var t = 0; t < i.AppConfigurator.instance.MaxProfileNum; t++)
                this.infos[t] = new o(t)
        }
        return Object.defineProperty(t.prototype, "curInfo", {
            get: function() {
                return this.infos[this.curIndex]
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.Load = function() {
            var t = localStorage.getItem("lwga_user_entries");
            if (t) {
                var e = JSON.parse(t);
                if (e instanceof Array)
                    for (var n = Math.min(this.infos.length, e.length), i = 0; i < n; i++) {
                        const r = this.infos[i];
                        s.Objects.CopyObjectProps(r, e[i]);
                        r.usig = a.AppHelper.GetUserEnironmentSignature()
                    }
            }
            var o = parseInt(localStorage.getItem("lwga_user_sel_index"));
            isNaN(o) || (this.curIndex = s.Nums.Clamp(o, 0, this.infos.length - 1))
        }
        ,
        t.prototype.ShiftIndex = function(t) {
            this.curIndex = (this.curIndex + t + this.infos.length) % this.infos.length,
            this.indexChangedProc(),
            this.SaveIfChanged()
        }
        ,
        t.prototype.ChangeIndex = function(t) {
            this.curIndex = t
        }
        ,
        t.prototype.SaveIfChanged = function() {
            this.modified && (localStorage.setItem("lwga_user_entries", JSON.stringify(this.infos)),
            this.modified = !1),
            localStorage.setItem("lwga_user_sel_index", this.curIndex.toString())
        }
        ,
        t.prototype.SetProp = function(t, e) {
            this.curInfo[t] != e && (this.curInfo[t] = e,
            this.infos[this.curInfo["profileIndex"]][t] = e,
            "skinUrl" != t && "skinUrl2" != t || this.skinChangedProc(),
            this.skinChangedProc2(),
            this.modified = !0)
        }
        ,
        t
    }();
    e.UserEntryManager = r
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var r = n(7)
      , i = function() {
        function t() {}
        return t.prototype.SendPacket = function(t) {
            this.ws && this.ws.readyState == WebSocket.OPEN && this.ws.send(t)
        }
        ,
        t.prototype.CloseConnection = function() {
            this.ws && (this.ws.onopen = null,
            this.ws.onmessage = null,
            this.ws.onclose = null,
            this.ws.onerror = null,
            this.ws.close(),
            this.ws = null)
        }
        ,
        t.prototype.SendSessionInitialize = function(t) {
            this.SendPacket(r.Packets.SessionInitialize(t))
        }
        ,
        t.prototype.SendUserEntryInfo = function(t, e, n, i, o) {
            this.SendPacket(r.Packets.UserEntryInfo(t, e, n, i, o))
        }
        ,
        t.prototype.SendRequestStartPlay = function() {
            this.SendPacket(r.Packets.RequestStartPlay())
        }
        ,
        t.prototype.SendRequestStartSpectate = function() {
            this.SendPacket(r.Packets.RequestStartSpectate())
        }
        ,
        t.prototype.SendAimCursor = function(t, e) {
            this.SendPacket(r.Packets.AimCursor(t, e))
        }
        ,
        t.prototype.SendPlayerAction = function(t, e) {
            this.SendPacket(r.Packets.PlayerAction(t, e))
        }
        ,
        t.prototype.SendChatMessage = function(t, e) {
            this.SendPacket(r.Packets.ChatMessage(t, e))
        }
        ,
        t.prototype.SendLatencyCheckRequest = function() {
            this.SendPacket(r.Packets.LatencyCheckRequest())
        }
        ,
        t.prototype.SendSpecifySpecTarget = function(t) {
            this.SendPacket(r.Packets.SpecifySpecTarget(t))
        }
        ,
        t.prototype.ConnectToGameServer = function(t) {
            var n = this;
            this.ws && this.CloseConnection(),
            console.log("connecting to gameserver"),
            this.ws = new WebSocket(t),
            this.ws.binaryType = "arraybuffer",
            this.ws.onopen = function() {
                console.log("socket opened"),
                n.connectionOpenProc()
            }
            ,
            this.ws.onerror = function(t) {
                console.log("socket error, " + t)
            }
            ,
            this.ws.onclose = function(t) {
                var e = t.reason || "";
                console.log("socket closed, " + e),
                n.connectionClosedProc(e)
            }
            ,
            this.ws.onmessage = function(t) {
                n.packetHandlerProc(t.data)
            }
        }
        ,
        t
    }();
    e.ConnectionBridge = i
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = n(1)
      , r = n(8)
      , a = n(14)
      , l = n(0)
      , i = n(3)
      , c = function() {
        return function(t, e, n, i) {
            this.timeStamp = t,
            this.opcode = e,
            this.keep = n,
            this.buffer = i
        }
    }()
      , o = function() {
        function t(t, e, n) {
            this.packets = t,
            this.headIndex = e,
            this.tailIndex = n
        }
        return Object.defineProperty(t.prototype, "headTimeStamp", {
            get: function() {
                return this.packets[this.headIndex].timeStamp
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "durationMs", {
            get: function() {
                return s.Utils.Confirm(this.tailIndex < this.packets.length),
                this.packets[this.tailIndex].timeStamp - this.packets[this.headIndex].timeStamp
            },
            enumerable: !0,
            configurable: !0
        }),
        t
    }()
      , h = function() {
        function t() {
            this.totalBytes = 0,
            this.packets = [],
            this.isRecording = !1,
            this.isPlayback = !1,
            this.isLoading = !1,
            this.trackPos = 0,
            this.reels = [],
            this.curReelIndex = 0,
            this.trackPosText = "",
            this.isAutoShiftToNextReel = !1,
            this.cleanIdx = 0,
            this.reqMainPanelShownAfterPlayback = !1,
            this.replaySpeedRateExp = 0,
            this.replaySpeedRate = 1
        }
        return t.prototype.Reset = function() {
            this.totalBytes = 0,
            this.packets = [],
            this.isRecording = !1,
            this.isPlayback = !1,
            this.isLoading = !1,
            this.trackPos = 0,
            this.recordHeadIndex = 0,
            this.replayIndex = 0,
            this.reels = [],
            this.curReelIndex = 0,
            this.trackPosText = "",
            this.cleanIdx = 0,
            this.reqMainPanelShownAfterPlayback = !1,
            this.Notify()
        }
        ,
        Object.defineProperty(t.prototype, "curReel", {
            get: function() {
                return this.reels[this.curReelIndex]
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "isReplayMode", {
            get: function() {
                return l.gs.gstates.isReplayMode
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "numReels", {
            get: function() {
                return this.reels.length
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.Initialize = function(t) {
            this.nodeMan = t,
            this.UpdateTrackPosText(),
            this.startTimeStamp = Date.now()
        }
        ,
        t.prototype.SetStateChangedProc = function(t) {
            this.notificationProc = t
        }
        ,
        t.prototype.Notify = function(t) {
            void 0 === t && (t = null),
            this.notificationProc(t)
        }
        ,
        t.prototype.AddReel = function(t, e) {
            for (var n = t; n <= e; n++)
                this.packets[n].keep = !0;
            var i = new o(this.packets,t,e);
            this.reels.push(i),
            this.curReelIndex = this.reels.length - 1
        }
        ,
        t.prototype.DeleteCurrentReel = function() {
            this.reels.length > 0 && (this.reels.splice(this.curReelIndex, 1),
            this.ShiftCurrentReel(0),
            this.UpdateTrackPosText())
        }
        ,
        t.prototype.ShiftCurrentReel = function(t, e) {
            if (void 0 === e && (e = !1),
            0 != this.reels.length) {
                var n = (this.curReelIndex + t + this.reels.length) % this.reels.length;
                this.curReelIndex = s.Nums.Clamp(n, 0, this.reels.length - 1),
                this.StartReplayMode(e),
                e || (this.ShiftTrackPositionLittle(1),
                this.ShiftTrackPositionLittle(-1))
            }
        }
        ,
        t.prototype.ShiftReplaySpeed = function(t) {
            this.replaySpeedRateExp = s.Nums.Clamp(this.replaySpeedRateExp + t, -1, 2),
            this.replaySpeedRate = Math.pow(2, this.replaySpeedRateExp)
        }
        ,
        t.prototype.HandleReplayOperation = function(t) {
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
        }
        ,
        t.prototype.DiscardUnnecessaryPackets = function() {
            for (var t = Date.now() - 1e3 * l.gs.usupport.QuickCaptureTimeSec; this.cleanIdx < this.packets.length; ) {
                var e = this.packets[this.cleanIdx];
                if (e) {
                    if (e.timeStamp >= t)
                        break;
                    e.keep || (this.packets[this.cleanIdx] = null,
                    this.totalBytes -= e.buffer.byteLength)
                }
                this.cleanIdx++
            }
        }
        ,
        t.prototype.RecordPacket = function(t) {
            var e = new r.DataFrameReader(t).ReadUint8();
            if (!(a.OpcodeGroups.NotForRecord.indexOf(e) >= 0)) {
                var n = Date.now()
                  , i = a.OpcodeGroups.PermanentKeeped.indexOf(e) >= 0;
                this.isRecording && (i = !0);
                var o = new c(n,e,i,t);
                this.packets.push(o),
                this.totalBytes += t.byteLength
            }
        }
        ,
        t.prototype.PostInternalRecordingPacket = function(t) {
            this.RecordPacket(t)
        }
        ,
        t.prototype.PostPacketFromServer = function(t) {
            i.TimeChecker.Start("PostPacketFromServer"),
            this.isReplayMode || this.nodeMan.DecodeFrame(t, !0, !1),
            this.RecordPacket(t),
            i.TimeChecker.Stop()
        }
        ,
        t.prototype.ToggleRecording = function() {
            this.isPlayback || (this.isRecording ? (this.isRecording = !1,
            this.AddReel(this.recordHeadIndex, this.packets.length - 1)) : (this.isRecording = !0,
            this.recordHeadIndex = this.packets.length),
            this.Notify())
        }
        ,
        t.prototype.DoInstantCapture = function() {
            if (!this.isPlayback) {
                var t = Date.now() - this.startTimeStamp
                  , e = 1e3 * l.gs.usupport.QuickCaptureTimeSec;
                e > t && (e = t);
                var n = Date.now() - e
                  , i = 0;
                for (i = this.packets.length - 1; i > 0; i--) {
                    var o = this.packets[i];
                    if (o && o.timeStamp < n)
                        break
                }
                this.AddReel(i, this.packets.length - 1),
                this.captureNotificationProc(),
                this.Notify()
            }
        }
        ,
        t.prototype.ToDigits2 = function(t) {
            var e = t.toString();
            return e.length <= 1 ? "0" + e : e
        }
        ,
        t.prototype.GetTimeDurationString = function(t, e) {
            var n = t / 1e3 >> 0
              , i = n / 3600 >> 0
              , o = (n -= 3600 * i) / 60 >> 0
              , r = (n -= 60 * o) >> 0
              , s = t % 1e3 / 100 >> 0
              , a = (this.ToDigits2(i),
            this.ToDigits2(o))
              , l = this.ToDigits2(r)
              , c = null;
            return c = i > 0 ? i + ":" + a + ":" + l : o + ":" + l,
            e && (c += "." + s),
            c
        }
        ,
        t.prototype.UpdateTrackPosText = function() {
            var t = 0
              , e = 0;
            this.curReel && (t = s.Nums.MapTo(this.trackPos, 0, this.curReel.durationMs),
            e = this.curReel.durationMs);
            var n = this.GetTimeDurationString(t, !0)
              , i = this.GetTimeDurationString(e, !0);
            this.trackPosText = n + " / " + i
        }
        ,
        t.prototype.SeekReplayPosTo = function(t, e) {
            if (this.curReel) {
                var n = this.curReel.headTimeStamp
                  , i = this.curReel.headTimeStamp + this.curReel.durationMs
                  , o = s.Nums.MapTo(t, n, i);
                if (t >= this.trackPos)
                    for (; this.replayIndex < this.curReel.tailIndex; ) {
                        if (r = this.packets[this.replayIndex]) {
                            if (r.timeStamp >= o)
                                break;
                            this.nodeMan.DecodeFrame(r.buffer, !1, e)
                        }
                        this.replayIndex++
                    }
                else
                    for (; this.replayIndex > this.curReel.headIndex; ) {
                        var r;
                        if (r = this.packets[this.replayIndex]) {
                            if (r.timeStamp <= o)
                                break;
                            this.nodeMan.DecodeFrame(r.buffer, !1, e)
                        }
                        this.replayIndex--
                    }
                e && this.nodeMan.SyncGameViewToModel(),
                this.trackPos = t,
                this.UpdateTrackPosText()
            }
        }
        ,
        t.prototype.ShiftTrackPositionLittle = function(t) {
            if (this.curReel) {
                var e = 100 * t / this.curReel.durationMs
                  , n = s.Nums.Clamp(this.trackPos + e, 0, 1);
                this.SeekReplayPosTo(n, !1)
            }
        }
        ,
        t.prototype.StartReplayMode = function(t) {
            l.gs.gstates.isReplayMode = !0,
            this.trackPos = 0,
            this.replayIndex = this.curReel.headIndex,
            this.FeedStoredPackets(0, this.curReel.headIndex),
            t && (this.isPlayback = !0,
            this.ReplayLoopProc())
        }
        ,
        t.prototype.EndReplayMode = function() {
            this.FeedStoredPackets(0, this.packets.length),
            this.isPlayback = !1,
            this.trackPos = 0,
            l.gs.gstates.isReplayMode = !1,
            this.UpdateTrackPosText(),
            this.reqMainPanelShownAfterPlayback && (l.gs.gstates.setMainPanelVisible(!0),
            this.reqMainPanelShownAfterPlayback = !1)
        }
        ,
        t.prototype.ReplayLoopProc = function() {
            if (this.curReel) {
                var t = 17 / this.curReel.durationMs * this.replaySpeedRate;
                this.SeekReplayPosTo(this.trackPos + t, !1),
                this.trackPos < 1 ? this.isPlayback && setTimeout(this.ReplayLoopProc.bind(this), 17) : this.isAutoShiftToNextReel && this.curReelIndex < this.reels.length - 1 ? this.ShiftCurrentReel(1, !0) : this.EndReplayMode(),
                this.Notify()
            }
        }
        ,
        t.prototype.FeedStoredPackets = function(t, e) {
            this.isLoading = !0,
            0 == t && this.nodeMan.ResetToInitialiState();
            for (var n = a.OpcodeGroups.PermanentKeeped, i = t; i < e; i++) {
                var o = this.packets[i];
                if (o) {
                    o.opcode;
                    n.indexOf(o.opcode) >= 0 && this.nodeMan.DecodeFrame(o.buffer, !1, !0)
                }
            }
            this.isLoading = !1
        }
        ,
        t.prototype.TogglePause = function() {
            this.isReplayMode && (this.isPlayback = !this.isPlayback,
            this.isPlayback && this.ReplayLoopProc())
        }
        ,
        t.prototype.TogglePlayback = function() {
            null != this.curReel && (this.isRecording || (this.isReplayMode ? this.TogglePause() : (this.reqMainPanelShownAfterPlayback = l.gs.gstates.isMainPanelVisible,
            this.StartReplayMode(!0),
            l.gs.gstates.setMainPanelVisible(!1))))
        }
        ,
        t
    }();
    e.DataRecorder = h
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var c = n(1)
      , s = n(3)
      , i = n(0).gs.uconfig
      , h = function() {
        function t() {
            this.colors = [0, 0],
            this.skinUrls = ["", ""]
        }
        return Object.defineProperty(t.prototype, "fullName", {
            get: function() {
                if (i.ShowTripKey && this.tripKey && this.tripKey != "aaaa") {
                    return this.team + this.name + "[" + this.tripKey + "]";
                } else {
                    return this.team + this.name;
                }
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "miniMapName", {
            get: function() {
                if (i.ShowTripKey && this.tripKey && this.tripKey != "aaaa") {
                    return this.team + this.name + "[" + this.tripKey + "]";
                } else {
                    return this.team + this.name;
                }
            },
            enumerable: !0,
            configurable: !0
        }),
        t.prototype.Initialize = function(t, e, n) {
            this.clientId = t,
            this.isBot = e,
            this.tripKey = n,
            this.name = "",
            this.team = "",
            this.teamId = 0;
            for (var i = 0; i < 2; i++)
                this.colors[i] = 0,
                this.skinUrls[i] = ""
        }
        ,
        t.prototype.SetProps = function(t, e, n, i, o) {
            this.name = t,
            this.team = e,
            this.teamId = n,
            this.skinUrls[0] = i,
            this.skinUrls[1] = o
        }
        ,
        t.prototype.SetColor = function(t, e) {
            this.colors[t] = e
        }
        ,
        t
    }();
    e.TUserInfoData = h;
    var r = function() {
        function t() {}
        return t.prototype.Initialize = function(t, e, n) {
            this.teamId = t,
            this.teamName = e,
            this.section = n,
            this.color = 0,
            this.colorStr = "#000"
        }
        ,
        t.prototype.SetColor = function(t) {
            this.color = t,
            this.colorStr = s.ColorHelper.ColorToHtmlString(t)
        }
        ,
        t
    }();
    e.TTeamInfoData = r;
    var o = function() {
        function t() {
            this.userInfos = new Map,
            this.teamInfos = new Map;
            this.fallbackTeamInfo = new r,
            this.fallbackTeamInfo.Initialize(-1, "", "**"),
            this.fallbackTeamInfo.SetColor(4456448),
            this.fallbackUserInfo = new h,
            this.fallbackUserInfo.Initialize(-1, !1, "ERR"),
            this.fallbackUserInfo.SetProps("ERR", "ERR", -1, "", ""),
            this.fallbackUserInfo.SetColor(0, 4456448),
            this.fallbackUserInfo.SetColor(1, 4456448),
            this.selfTeamInfo = this.fallbackTeamInfo
        }
        return t.prototype.Reset = function() {
            this.selfUserId = 0,
            this.selfTeamInfo = this.fallbackTeamInfo,
            this.userInfos.clear(),
            this.teamInfos.clear()
        }
        ,
        t.prototype.PostSelfUserId = function(t) {
            this.selfUserId = t
        }
        ,
        t.prototype.PostUserInfoData = function(t, e, n, i, o, r, s, a) {
            void 0 === s && (s = null),
            void 0 === a && (a = null);
            var l = this.userInfos.get(t);
            l || (c.Utils.Confirm(null != s && null != a),
            (l = new h).Initialize(t, s, a),
            this.userInfos.set(t, l)),
            l.SetProps(e, n, i, o, r),
            l.isBot = s,
            l.clientId == this.selfUserId && (this.selfTeamInfo = this.GetTeamInfoById(l.teamId))
        }
        ,
        t.prototype.PostUserLeave = function(t) {
            this.userInfos.delete(t),
            this.userLeavedProc && this.userLeavedProc(t)
        }
        ,
        t.prototype.PostPlayerColorData = function(t, e) {
            var n = s.GameHelper.DecodePlayerId(t)
              , i = n[0]
              , o = n[1]
              , r = this.userInfos.get(i);
            r && r.SetColor(o, e)
        }
        ,
        t.prototype.PostTeamInfoData = function(t, e, n, i) {
            void 0 === n && (n = null),
            void 0 === i && (i = null);
            var o = this.teamInfos.get(t);
            o || (c.Utils.Confirm(null != n && null != i),
            (o = new r).Initialize(t, n, i),
            this.teamInfos.set(t, o)),
            o.SetColor(e)
        }
        ,
        t.prototype.PostTeamInfoRemoval = function(t) {
            this.teamInfos.delete(t)
        }
        ,
        t.prototype.ClearUserInfos = function() {
            this.userInfos.clear()
        }
        ,
        t.prototype.GetUserInfoById = function(t) {
            return t &= 65534,
            this.userInfos.get(t) || this.fallbackUserInfo
        }
        ,
        t.prototype.GetTeamInfoById = function(t) {
            return this.teamInfos.get(t) || this.fallbackTeamInfo
        }
        ,
        t.prototype.GetCellColorForPlayer = function(t) {
            var e = 1 & t;
            return this.GetUserInfoById(t).colors[e]
        }
        ,
        t.prototype.GetSkinUrlForPlayer = function(t) {
            var e = 1 & t;
            return this.GetUserInfoById(t).skinUrls[e]
        }
        ,
        t.prototype.GetTeamInfoForUser = function(t) {
            t &= 65534;
            var e = this.GetUserInfoById(t);
            return this.GetTeamInfoById(e.teamId)
        }
        ,
        t.prototype.GetPlayerIdsAvailable = function() {
            var e = [];
            return this.userInfos.forEach(function(t) {
                !t.isBot && "dead" != t.name && t.skinUrls[0] && t.colors[0] && e.push(t.clientId)
            }),
            e
        }
        ,
        t
    }();
    e.UserInfoManager = o
}
, function(t, e, n) {
    "use strict";
    var i, o = this && this.__extends || (i = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            e.hasOwnProperty(n) && (t[n] = e[n])
    }
    ,
    function(t, e) {
        function n() {
            this.constructor = t
        }
        i(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }
    ), r = this && this.__decorate || function(t, e, n, i) {
        var o, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            s = Reflect.decorate(t, e, n, i);
        else
            for (var a = t.length - 1; a >= 0; a--)
                (o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
        return r > 3 && s && Object.defineProperty(e, n, s),
        s
    }
    ;
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = n(5)
      , a = n(4)
      , l = n(0)
      , c = n(2)
      , h = n(28)
      , d = n(27)
      , u = n(26)
      , p = n(23)
      , f = n(22)
      , g = n(21)
      , m = n(20)
      , y = n(19)
      , v = n(18)
      , S = n(17)
      , b = n(16);
    p.ReplayControlBarTag,
    f.GameOverlayTag,
    g.LeftConfigPanelTag,
    m.UserEntryPanelTag,
    y.ServerListRootTag,
    v.MainPanelTag,
    S.MainConfigPanelTag,
    b.ColorConfigPanelTag,
    n(15).SkinFilterPanelTag;
    var C = function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.gstates = l.gs.gstates,
            t.uconfig = l.gs.uconfig,
            t.cconfig = l.gs.ucolors,
            t.appConfig = c.AppConfigurator.instance,
            t.hasNewPrivateMessage = !1,
            t.newPrivateMessageSkinUrl = "",
            t.newPrivateMessageText = "",
            t
        }
        return o(t, e),
        t.prototype.onChatIconClicked = function(t) {
            window.open("unichat/chat.html", "uni-chat", "width=800, height=600, menubar=no, toolbar=no, scrollbars=no"),
            t.stopPropagation()
        }
        ,
        t.prototype.onSkinFilterButton = function(t) {
            this.gstates.isSkinFilterPanelVisible = !this.gstates.isSkinFilterPanelVisible,
            t.stopPropagation()
        }
        ,
        t.prototype.mounted = function() {
            setTimeout(this.InitializeAfterAllMounted.bind(this), 1)
        }
        ,
        t.prototype.InitializeAfterAllMounted = function() {
            var i = this;
            l.gs.gstates.mainPanelVisibleChangedProc = this.update.bind(this),
            l.gs.uconfig.RegisterChangedProc("ShowReplayBar", this.update.bind(this));
            var t = document.querySelector("#adbox_content")
              , e = document.querySelector("#center_ad_area");
            document.body.removeChild(t),
            e.appendChild(t),
            t.style.display = "block";
            var n = new u.GameViewDomain2.GameView;
            a.gameCore.Initialize(),
            n.Initialize(),
            a.gameCore.serverListModel ? a.gameCore.serverListModel.Start() : (l.gs.gstates.chatRoomSig = c.AppConfigurator.instance.uniChatServerSignature,
            a.gameCore.ConnectToGameServer());
            var o = new h.MapView
              , r = new d.TeamRankingChartView;
            o.Initialize(this.refs.game_overlay.refs.map_canvas),
            r.Initialize(this.refs.game_overlay.refs.lb_chart_canvas),
            a.gameCore.gameHudModel.Initialize(),
            n.StartAnimation(),
            a.gameCore.chatAppModel && (a.gameCore.chatAppModel.chatNotificationBadgeProc = function(t, e, n) {
                i.hasNewPrivateMessage = t,
                n ? (i.newPrivateMessageSkinUrl = e,
                i.newPrivateMessageText = n) : (i.newPrivateMessageSkinUrl = "",
                i.newPrivateMessageText = ""),
                i.update()
            }
            ),
            l.gs.gstates.playerDeadCallbackProc = function() {
                !l.gs.uconfig.HideMenuAfterDeath && l.gs.gstates.setMainPanelVisible(!0);
                var t = document.querySelector("#center_ad_area");
                t.style.opacity = "0.5",
                t.style.pointerEvents = "none",
                setTimeout(function() {
                    t.style.opacity = "1.0",
                    t.style.pointerEvents = "auto"
                }, 2e3)
            }
        }
        ,
        t = r([s.template('\n<app-root>\n\t<style>\n\t\t*{\n\t\t\tbox-sizing: border-box;\n\t\t\tmargin: 0;\n\t\t\tpadding: 0;\n\t\t}\n\t\t\n\t\tapp-root{\n\t\t\tfont-family: \'Meiryo\', \'Arial\';\n\t\t\tfont-size: 18px;\n\t\t\tuser-select: none;\n\t\t}\n\n\t\t@font-face{\n\t\t\tfont-family: \'CustomFont1\';\n\t\t\tsrc: url(\'gr/Xolonium-Regular.ttf\') format(\'truetype\');\n\t\t}\n\n\t\t@font-face{\n\t\t\tfont-family: \'CustomFont2\';\n\t\t\tsrc: url(\'gr/ReFormation Sans Regular.ttf\') format(\'truetype\');\n\t\t}\n\n\t\t@font-face{\n\t\t\tfont-family: \'IconFont1\';\n\t\t\tsrc: url(\'gr/icomoon.ttf\') format(\'truetype\');\n\t\t}\n\n\t\t.clear_both{\n\t\t\tclear: both;\n\t\t}\n\n\t\t.page_root{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tposition: fixed;\n\t\t}\n\n\t\t#game_control_overlay{\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t}\n\n\t\t.replay_bar_area_outer{\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\twidth: 100%;\n\t\t\ttext-align: center;\n\t\t}\n\n\t\t#psudo_cursor{\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t\tdisplay: none;\n\t\t}\n\n\t\t#psudo_cursor > img{\n\t\t\tposition: absolute;\n\t\t}\n\n\t\t#game_front_control_overlay{\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\t_background-color: #F00;\n\t\t}\n\n\t\t.ex_chat_icon_box{\n\t\t\tposition: absolute;\n\t\t\ttop: 6px;\n\t\t\tleft: 10px;\n\t\t\t_display: none;\n\t\t}\n\n\t\t#ex_chat_icon{\n\t\t\tbackground-color: rgba(255,255,255,1);\n\t\t\twidth: 45px;\n\t\t\theight: 30px;\n\t\t\tborder-radius: 2px;\n\t\t\tborder: solid 1px #08F;\n\t\t\tcursor: pointer;\n\t\t\tcolor: #444;\n\t\t\ttext-align: center;\n\t\t\tline-height: 24px;\n\t\t\tpadding: 1px;\n\t\t\tz-index: 300;\n\t\t}\n\n\t\t#ex_chat_badge{\n\t\t\tposition: absolute;\n\t\t\twidth:16px;\n\t\t\theight:16px;\n\t\t\tleft: 36px;\n\t\t\ttop: -10px;\n\t\t\tz-index: 301;\n\t\t\tdisplay: visible;\n\t\t}\n\n\t\t.skin_filter_button{\n\t\t\tposition: absolute;\n\t\t\ttop: 6px;\n\t\t\tright: 6px;\n\t\t\tborder-radius: 2px;\n\t\t\tbackground-color: #FFF;\n\t\t\tborder: solid 1px #F0A;\n\t\t\tcolor: #F0A;\n\t\t\twidth: 24px;\n\t\t\theight: 24px;\n\t\t\tdisplay: flex;\n\t\t\tjustify-content: center;\n\t\t\talign-items: center;\n\t\t\tcursor: pointer;\n\t\t\tfont-family: IConFont1;\n\t\t}\n\n\t\t.ex_chat_new_message_outer{\n\t\t\tposition: absolute;\n\t\t\twidth:200px;\n\t\t\theight:50px;\n\t\t\tleft: 60px;\n\t\t\ttop: 6px;\n\t\t\tz-index: 302;\n\t\t\tdisplay: visible;\n\t\t\tbackground-color: #FFF0F0;\n\t\t\tborder: solid 1px #F44;\n\t\t\tcolor: #666;\n\t\t\tfont-size: 13px;\n\t\t\tpadding: 4px;\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.ex_chat_new_message{\n\t\t\tposition: relative;\n\t\t}\n\n\t\t.ex_chat_new_message > *{\n\t\t\tposition: absolute;\n\t\t}\n\n\t\t.ex_chat_new_message > img{\n\t\t\twidth: 30px;\n\t\t\theight: 30px;\n\t\t\tborder-radius: 4px;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t}\n\n\t\t.ex_chat_new_message  > div.textpart{\n\t\t\twidth: calc(100% - 40px);\n\t\t\toverflow: hidden;\n\t\t\ttop: 0;\n\t\t\tleft: 34px;\n\t\t}\n\n\n\n\t</style>\n\t<div class="page_root" spellcheck="false"\n\t\tstyle="background-color: {cconfig.cssColors.clGameBackground}; color: {cconfig.cssColors.clGameForeground};">\n\t\t<div id="game_canvas_layer">\n\t\t\t<canvas id="game_canvas_layer_main" ref="game_canvas_layer_main"/>\n\t\t</div>\n\t\t<div id="game_hud_layer">\n\t\t\t<game-overlay id="game_overlay" ref="game_overlay"/>\n\n\t\t\t<div id="psudo_cursor">\n\t\t\t\t<img src="gr/cursor.png" id="psudo_cursor_img_off" />\n\t\t\t\t<img src="gr/cursor_red.png" id="psudo_cursor_img_on" />\n\t\t\t</div>\n\t\t</div>\n\n\t\t<main-panel show={gstates.isMainPanelVisible} id="main_panel" ref="main_panel" />\n\n\t\t<div class="replay_bar_area_outer" show={uconfig.ShowReplayBar}>\n\t\t\t<replay-control-bar />\n\t\t</div>\n\n\t\t<div class="ex_chat_icon_box" show={appConfig.useUniChat}>\n\t\t\t<div id="ex_chat_icon" onmousedown={onChatIconClicked}>\n\t\t\t\t<img src="gr/chat_icon32.png" style="height:100%" />\n\t\t\t</div>\n\t\t\t\n\t\t\t<div id="ex_chat_badge" show={hasNewPrivateMessage}>\n\t\t\t\t<img src="gr/msg_badge.png" style="width:100%"/>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\'ex_chat_new_message_outer\' onmousedown={onChatIconClicked} show={hasNewPrivateMessage}>\n\t\t\t<div class=\'ex_chat_new_message\'>\n\t\t\t\t<img src={newPrivateMessageSkinUrl} />\n\t\t\t\t<div class=\'textpart\'>\n\t\t\t\t\t{newPrivateMessageText}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class="skin_filter_button" onclick={onSkinFilterButton}\n\t\t\tshow={appConfig.isJapanese}>\n\t\t\t&#xe90d\n\t\t</div>\n\t\t\t\n\t\t<skin-filter-panel show={gstates.isSkinFilterPanelVisible} />\n\t\n\t\t<img src="gr/error.png" id="img_no_image_fallback" style="display:none" />\n</app-root>\n')], t)
    }(s.Element);
    e.AppRootTag = C,
    e.InitializeView = function() {
        var t = C.createElement();
        document.body.appendChild(t)
    }
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var i = n(39)
      , o = n(2);
    window.onload = function() {
        console.log("LWGA-R A121a0 180618");
        var t = "ja" == navigator.language.slice(0, 2);
        o.AppConfigurator.instance.allowOnlyForJapaneseLangUser && !t ? document.body.innerHTML = "このページは現在国内ユーザ向けに提供しています。日本語環境以外ではページが表示されないようになっています。" : i.InitializeView()
    }
}
]);
